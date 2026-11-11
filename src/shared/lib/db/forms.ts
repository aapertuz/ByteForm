import "server-only";
import type { Database } from "@/shared/types/database";
import { databaseResult, getDatabase } from "./client";

type FormRow = Database["public"]["Tables"]["forms"]["Row"];
type NewForm = Database["public"]["Tables"]["forms"]["Insert"];

export function listForms(userId: string) {
  return databaseResult(async () => await getDatabase()`
    SELECT * FROM public.forms WHERE user_id = ${userId} ORDER BY updated_at DESC
  ` as FormRow[]);
}

export function getOwnedForm(id: string, userId: string) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT * FROM public.forms WHERE id = ${id} AND user_id = ${userId}`;
    return (rows[0] as FormRow | undefined) ?? null;
  });
}

export function getVisibleForm(id: string, userId: string | null) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT * FROM public.forms
      WHERE id = ${id} AND (is_published = true OR user_id = ${userId})`;
    return (rows[0] as FormRow | undefined) ?? null;
  });
}

export function getPublishedForm(slug: string) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT * FROM public.forms WHERE slug = ${slug} AND is_published = true`;
    return (rows[0] as FormRow | undefined) ?? null;
  });
}

export function insertForm(form: NewForm) {
  return databaseResult(async () => {
    const rows = await getDatabase()`INSERT INTO public.forms
      (user_id, title, slug, welcome_screen, thank_you_screen, questions)
      VALUES (${form.user_id}, ${form.title}, ${form.slug}, ${JSON.stringify(form.welcome_screen)}::jsonb,
        ${JSON.stringify(form.thank_you_screen)}::jsonb, ${JSON.stringify(form.questions)}::jsonb)
      RETURNING *`;
    return rows[0] as FormRow;
  });
}

const editableColumns = new Set([
  "title", "slug", "welcome_screen", "thank_you_screen", "questions", "is_published", "redirect_url",
]);
const jsonColumns = new Set(["welcome_screen", "thank_you_screen", "questions"]);

export function updateForm(id: string, userId: string, update: Record<string, unknown>) {
  return databaseResult(async () => {
    const entries = Object.entries(update).filter(([key]) => editableColumns.has(key));
    if (!entries.length) {
      const rows = await getDatabase()`SELECT * FROM public.forms WHERE id = ${id} AND user_id = ${userId}`;
      if (!rows.length) throw new Error("form_not_found");
      return rows[0] as FormRow;
    }
    const values = entries.map(([key, value]) => jsonColumns.has(key) ? JSON.stringify(value) : value);
    // Identifiers come exclusively from the allowlist; all values are parameters.
    const assignments = entries.map(([key], index) => `"${key}" = $${index + 3}${jsonColumns.has(key) ? "::jsonb" : ""}`);
    const rows = await getDatabase().query(
      `UPDATE public.forms SET ${assignments.join(", ")} WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId, ...values],
    );
    if (!rows.length) throw new Error("form_not_found");
    return rows[0] as FormRow;
  });
}

export function deleteForm(id: string, userId: string) {
  return databaseResult(async () => {
    await getDatabase()`DELETE FROM public.forms WHERE id = ${id} AND user_id = ${userId}`;
  });
}
