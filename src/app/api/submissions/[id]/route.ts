import { updateSubmission, deleteSubmission } from "@/shared/lib/db/submissions";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/auth/server";
import { submissionSchema } from "@/shared/lib/validation/forms";

const RPC_ERROR_STATUS: Record<string, number> = {
  submission_not_found: 404,
  form_mismatch: 403,
  already_completed: 400,
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: submissionId } = await params;
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (!parsed.data.formId) {
    return NextResponse.json({ error: "formId is required" }, { status: 400 });
  }

  const completedAt = parsed.data.completed === true ? new Date().toISOString() : null;
  const { error: rpcError } = await updateSubmission(
    submissionId, parsed.data.formId, parsed.data.answers, completedAt,
  );

  if (rpcError) {
    const status = RPC_ERROR_STATUS[rpcError.message] ?? 500;
    return NextResponse.json({ error: rpcError.message }, { status });
  }

  return NextResponse.json({ success: true });
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

  const { data: deleted, error } = await deleteSubmission(id, user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
