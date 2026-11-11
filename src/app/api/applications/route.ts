import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import {
  applicationDetailsSchema,
  applicationSchema,
} from "@/features/creation/application-schema";

const cookieName = "byteform-application";
const cookieAge = 60 * 60 * 24;

function isSameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const parsed = applicationSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Check your email and plan details and try again." },
      { status: 400 },
    );

  try {
    const supabase = await createClient();
    const editToken = randomUUID();
    const application = parsed.data;
    const { data, error } = await supabase.rpc("submit_waitlist_application", {
      p_email: parsed.data.email,
      p_prompt:
        application.source === "pricing"
          ? `Pricing inquiry: ${application.plan} plan (${application.billing} billing).`
          : application.prompt,
      p_mode:
        application.source === "pricing"
          ? application.plan === "classic"
            ? "classic"
            : "chat"
          : application.mode,
      p_plan: parsed.data.plan,
      p_billing: parsed.data.billing,
      p_edit_token: editToken,
    });
    if (error || typeof data !== "string") {
      return NextResponse.json(
        {
          error: "We couldn’t save your application. Please try again shortly.",
        },
        { status: 503 },
      );
    }
    const response = NextResponse.json({ saved: true }, { status: 201 });
    response.cookies.set(cookieName, `${data}:${editToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/applications",
      maxAge: cookieAge,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "We couldn’t save your application. Please try again shortly." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const credential = (await cookies()).get(cookieName)?.value;
  const [id, token] = credential?.split(":") ?? [];
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !token || !uuid.test(id) || !uuid.test(token)) {
    return NextResponse.json(
      {
        error:
          "Your application session has expired. Please submit a new application.",
      },
      { status: 401 },
    );
  }
  const parsed = applicationDetailsSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Check your website address and details." },
      { status: 400 },
    );

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(
      "update_waitlist_application_details",
      {
        p_id: id,
        p_edit_token: token,
        p_website: parsed.data.website,
        p_details: parsed.data.details,
      },
    );
    if (error || data !== true)
      return NextResponse.json(
        { error: "We couldn’t save your details. Please try again." },
        { status: 503 },
      );
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: "We couldn’t save your details. Please try again." },
      { status: 503 },
    );
  }
}
