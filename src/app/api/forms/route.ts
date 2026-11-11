import { listForms, insertForm } from "@/shared/lib/db/forms";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/auth/server";
import { createFormSchema } from "@/shared/lib/validation/forms";
import { captureServerEvent } from "@/shared/lib/analytics/posthog-server";
import { AnalyticsEvent } from "@/shared/lib/analytics/events";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: forms, error } = await listForms(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(forms);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const body = parsed.data;

  const { data, error } = await insertForm({
      user_id: user.id,
      title: body.title || "Untitled Form",
      slug: body.slug || `form-${Date.now()}`,
      welcome_screen: body.welcomeScreen || { title: "Welcome", buttonText: "Start" },
      thank_you_screen: body.thankYouScreen || { title: "Thank you!" },
      questions: body.questions || [],
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await captureServerEvent({
    distinctId: user.id,
    event: AnalyticsEvent.FormCreated,
    properties: {
      form_id: data.id,
      question_count: Array.isArray(data.questions) ? data.questions.length : 0,
    },
  });

  return NextResponse.json(data, { status: 201 });
}
