import { getVisibleForm, getOwnedForm, updateForm, deleteForm } from "@/shared/lib/db/forms";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/auth/server";
import { updateFormSchema } from "@/shared/lib/validation/forms";
import { captureServerEvent } from "@/shared/lib/analytics/posthog-server";
import { AnalyticsEvent } from "@/shared/lib/analytics/events";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await getVisibleForm(id, (await getCurrentUser())?.id ?? null);

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const parsed = updateFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.slug !== undefined) update.slug = body.slug;
  if (body.welcomeScreen !== undefined) update.welcome_screen = body.welcomeScreen;
  if (body.thankYouScreen !== undefined) update.thank_you_screen = body.thankYouScreen;
  if (body.questions !== undefined) update.questions = body.questions;
  if (body.isPublished !== undefined) update.is_published = body.isPublished;
  if (body.redirectUrl !== undefined) {
    // Store empty string as null so the DB column stays clean
    update.redirect_url = body.redirectUrl === "" ? null : body.redirectUrl;
  }

  // Read the prior state so we can fire publish/unpublish events only on
  // actual transitions, not on every PUT that happens to include the flag.
  const { data: previous } = await getOwnedForm(id, user.id);

  const { data, error } = await updateForm(id, user.id, update);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (
    previous &&
    body.isPublished !== undefined &&
    previous.is_published !== data.is_published
  ) {
    await captureServerEvent({
      distinctId: user.id,
      event: data.is_published
        ? AnalyticsEvent.FormPublished
        : AnalyticsEvent.FormUnpublished,
      properties: { form_id: data.id },
    });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await deleteForm(id, user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
