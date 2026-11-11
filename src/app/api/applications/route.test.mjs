import { afterEach, describe, expect, mock, test } from "bun:test";

const rpc = mock(async () => ({
  data: "00000000-0000-4000-8000-000000000001",
  error: null,
}));
let credential;
mock.module("@/shared/lib/db/applications", () => ({
  submitApplication: (input) => rpc("submit_waitlist_application", input),
  updateApplicationDetails: (input) => rpc("update_waitlist_application_details", input),
}));
mock.module("next/headers", () => ({
  cookies: async () => ({
    get: () => (credential ? { value: credential } : undefined),
  }),
}));
const { POST, PATCH } = await import("./route.ts");

const application = {
  email: " QA@example.com ",
  prompt: "Customer feedback",
  mode: "chat",
  plan: "pro",
  billing: "monthly",
};
const token = "00000000-0000-4000-8000-000000000002";
function request(method, body, origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/applications", {
    method,
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  rpc.mockClear();
  rpc.mockImplementation(async () => ({
    data: "00000000-0000-4000-8000-000000000001",
    error: null,
  }));
  credential = undefined;
});

describe("waitlist applications", () => {
  test("rejects cross-origin requests before accessing storage", async () => {
    expect(
      (await POST(request("POST", application, "https://other.example")))
        .status,
    ).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });
  test("rejects invalid email, unsupported tiers, blank prompts, and voice", async () => {
    for (const override of [
      { email: "invalid" },
      { plan: "unknown" },
      { prompt: " " },
      { mode: "voice" },
    ]) {
      expect(
        (await POST(request("POST", { ...application, ...override }))).status,
      ).toBe(400);
    }
    expect(rpc).not.toHaveBeenCalled();
  });
  test("normalizes email and sets a private session only after saving", async () => {
    const response = await POST(request("POST", application));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ saved: true });
    expect(rpc.mock.calls[0][1].p_email).toBe("qa@example.com");
    const cookie = response.headers.get("set-cookie");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=strict");
    expect(cookie).toContain("Path=/api/applications");
  });
  test("accepts direct pricing applications without a form brief or mode", async () => {
    const response = await POST(
      request("POST", {
        source: "pricing",
        email: " Buyer@example.com ",
        plan: "team",
        billing: "annual",
      }),
    );
    expect(response.status).toBe(201);
    expect(rpc.mock.calls[0][1]).toMatchObject({
      p_email: "buyer@example.com",
      p_plan: "team",
      p_billing: "annual",
      p_prompt: "Pricing inquiry: team plan (annual billing).",
      p_mode: "chat",
    });
  });
  test("derives pricing context on the server and preserves the selected tier", async () => {
    const response = await POST(
      request("POST", {
        source: "pricing",
        email: "buyer@example.com",
        plan: "classic",
        billing: "monthly",
        prompt: "Injected brief",
        mode: "voice",
      }),
    );
    expect(response.status).toBe(201);
    expect(rpc.mock.calls[0][1]).toMatchObject({
      p_plan: "classic",
      p_billing: "monthly",
      p_prompt: "Pricing inquiry: classic plan (monthly billing).",
      p_mode: "classic",
    });
  });
  test("rejects invalid direct-pricing selections", async () => {
    for (const override of [
      { plan: "unknown" },
      { billing: "weekly" },
      { email: "invalid" },
      { source: "unknown" },
    ]) {
      expect(
        (
          await POST(
            request("POST", {
              source: "pricing",
              email: "buyer@example.com",
              plan: "pro",
              billing: "annual",
              ...override,
            }),
          )
        ).status,
      ).toBe(400);
    }
    expect(rpc).not.toHaveBeenCalled();
  });
  test("does not report success or issue a cookie when storage fails", async () => {
    rpc.mockResolvedValue({
      data: null,
      error: { message: "Database error with private data" },
    });
    const response = await POST(request("POST", application));
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(JSON.stringify(await response.json())).not.toContain("private data");
  });
  test("requires a valid application session to save details", async () => {
    expect(
      (await PATCH(request("PATCH", { website: "", details: "" }))).status,
    ).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });
  test("rejects unsafe website protocols", async () => {
    credential = `00000000-0000-4000-8000-000000000001:${token}`;
    expect(
      (
        await PATCH(
          request("PATCH", { website: "javascript:alert(1)", details: "" }),
        )
      ).status,
    ).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });
  test("saves optional details using the cookie credential", async () => {
    credential = `00000000-0000-4000-8000-000000000001:${token}`;
    rpc.mockResolvedValue({ data: true, error: null });
    const response = await PATCH(
      request("PATCH", {
        website: "https://example.com",
        details: "Feedback survey",
      }),
    );
    expect(response.status).toBe(200);
    expect(rpc.mock.calls[0][1].p_edit_token).toBe(token);
  });
  test("does not claim details were saved for an invalid or expired token", async () => {
    credential = `00000000-0000-4000-8000-000000000001:${token}`;
    rpc.mockResolvedValue({ data: false, error: null });
    expect(
      (await PATCH(request("PATCH", { website: "", details: "" }))).status,
    ).toBe(503);
  });
});
