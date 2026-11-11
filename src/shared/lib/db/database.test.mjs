import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
mock.module("server-only", () => ({}));
mock.module("@neondatabase/serverless", () => ({
  types: { setTypeParser: () => {}, builtins: { TIMESTAMPTZ: 1184 }, getTypeParser: () => value => value },
  neon: () => {
    const query = async (sql, values) => (await db.query(sql, values)).rows;
    const tagged = (strings, ...values) => query(
      strings.reduce((sql, part, i) => sql + (i ? `$${i}` : "") + part, ""), values,
    );
    tagged.query = query;
    return tagged;
  },
}));
process.env.DATABASE_URL ||= "postgresql://test:test@localhost/test";
const forms = await import("./forms");
const submissions = await import("./submissions");

let owner, other, draft, published;
beforeAll(async () => {
  const directory = new URL("../../../../migrations/", import.meta.url);
  for (const file of (await readdir(directory)).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"));
  }
  const users = await db.query("INSERT INTO public.users (auth_provider_id) VALUES ('owner'), ('other') RETURNING id");
  [owner, other] = users.rows.map(row => row.id);
  for (const [title, slug] of [["Draft", "draft"], ["Published", "published"]]) {
    const result = await forms.insertForm({
      user_id: owner, title, slug, welcome_screen: { title: "Welcome", buttonText: "Start" },
      thank_you_screen: { title: "Thanks" }, questions: [],
    });
    expect(result.error).toBeNull();
    if (slug === "draft") draft = result.data.id;
    else published = result.data.id;
  }
  await forms.updateForm(published, owner, { is_published: true });
});
afterAll(() => db.close());

describe("Neon database access", () => {
  test("keeps drafts private and restricts owner reads", async () => {
    expect((await forms.listForms(other)).data).toEqual([]);
    expect((await forms.getOwnedForm(draft, other)).data).toBeNull();
    expect((await forms.getVisibleForm(draft, null)).data).toBeNull();
    expect((await forms.getVisibleForm(draft, other)).data).toBeNull();
    expect((await forms.getVisibleForm(draft, owner)).data.id).toBe(draft);
    expect((await forms.getPublishedForm("draft")).data).toBeNull();
    expect((await forms.getPublishedForm("published")).data.id).toBe(published);
  });
  test("prevents another user changing ownership, editing, or deleting a form", async () => {
    expect((await forms.updateForm(draft, other, { title: "Stolen" })).error.message).toBe("form_not_found");
    await forms.deleteForm(draft, other);
    await forms.updateForm(draft, owner, { user_id: other, title: "Safe title" });
    const result = await forms.getOwnedForm(draft, owner);
    expect(result.data.title).toBe("Safe title");
    expect(result.data.user_id).toBe(owner);
  });
  test("rejects draft submissions and protects completion and form matching", async () => {
    expect((await submissions.startSubmission(draft, new Date().toISOString())).error.message).toBe("form_not_published");
    const { data: id } = await submissions.startSubmission(published, new Date().toISOString());
    expect((await submissions.updateSubmission(id, draft, {}, null)).error.message).toBe("form_mismatch");
    expect((await submissions.updateSubmission(id, published, { answer: "yes" }, new Date().toISOString())).error).toBeNull();
    expect((await submissions.updateSubmission(id, published, {}, null)).error.message).toBe("already_completed");
    expect((await submissions.listSubmissions(published, other)).data).toEqual([]);
    expect((await submissions.deleteSubmission(id, other)).data).toBe(false);
    expect((await submissions.getResponseCounts(owner)).data[published]).toBe(1);
    expect((await submissions.deleteSubmission(id, owner)).data).toBe(true);
  });
  test("creates completed single-phase submissions atomically", async () => {
    const completedAt = new Date().toISOString();
    const { data: id, error } = await submissions.startSubmission(published, completedAt, { answer: "one" }, completedAt);
    expect(error).toBeNull();
    const result = await submissions.listSubmissions(published, owner);
    expect(result.data.find(row => row.id === id).answers).toEqual({ answer: "one" });
    expect(result.data.find(row => row.id === id).completed_at).not.toBeNull();
  });
  test("protects waitlist details with a hashed token and 24-hour expiry", async () => {
    const token = crypto.randomUUID();
    const result = await db.query("SELECT public.submit_waitlist_application($1,$2,$3,$4,$5,$6) AS id", ["qa@example.com", "Feedback", "chat", "pro", "monthly", token]);
    const id = result.rows[0].id;
    const update = async editToken => (await db.query("SELECT public.update_waitlist_application_details($1,$2,$3,$4) AS saved", [id, editToken, "https://example.com", "Details"])).rows[0].saved;
    expect(await update(crypto.randomUUID())).toBe(false);
    expect(await update(token)).toBe(true);
    const row = (await db.query("SELECT * FROM public.waitlist_applications WHERE id = $1", [id])).rows[0];
    expect(row.edit_token_hash).not.toContain(token);
    await db.query("UPDATE public.waitlist_applications SET created_at = now() - interval '25 hours' WHERE id = $1", [id]);
    expect(await update(token)).toBe(false);
  });
  test("cascades user deletion through forms and submissions", async () => {
    await db.query("DELETE FROM public.users WHERE id = $1", [owner]);
    expect((await forms.listForms(owner)).data).toEqual([]);
    expect((await db.query("SELECT * FROM public.submissions")).rows).toEqual([]);
  });
});
