import "server-only";
import type { Database } from "@/shared/types/database";
import { databaseResult, getDatabase } from "./client";

type Submission = Database["public"]["Tables"]["submissions"]["Row"];

export function listSubmissions(formId: string, userId: string) {
  return databaseResult(async () => await getDatabase()`
    SELECT s.* FROM public.submissions s JOIN public.forms f ON f.id = s.form_id
    WHERE f.id = ${formId} AND f.user_id = ${userId} ORDER BY s.created_at DESC
  ` as Submission[]);
}

export function getResponseCounts(userId: string) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT s.form_id, count(*)::integer AS count
      FROM public.submissions s JOIN public.forms f ON f.id = s.form_id
      WHERE f.user_id = ${userId} GROUP BY s.form_id`;
    return Object.fromEntries(rows.map(row => [row.form_id, row.count])) as Record<string, number>;
  });
}

export function deleteSubmission(id: string, userId: string) {
  return databaseResult(async () => {
    const rows = await getDatabase()`DELETE FROM public.submissions s USING public.forms f
      WHERE s.id = ${id} AND s.form_id = f.id AND f.user_id = ${userId} RETURNING s.id`;
    return rows.length > 0;
  });
}

export function startSubmission(formId: string, startedAt: string, answers: Record<string, unknown> = {}, completedAt: string | null = null) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT public.start_submission(
      ${formId}::uuid, ${startedAt}::timestamptz, ${JSON.stringify(answers)}::jsonb, ${completedAt}::timestamptz
    ) AS id`;
    return rows[0].id as string;
  });
}

export function updateSubmission(id: string, formId: string, answers: Record<string, unknown>, completedAt: string | null) {
  return databaseResult(async () => {
    await getDatabase()`SELECT public.update_submission(${id}::uuid, ${formId}::uuid,
      ${JSON.stringify(answers)}::jsonb, ${completedAt}::timestamptz)`;
  });
}
