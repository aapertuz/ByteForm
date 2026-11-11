import "server-only";
import { databaseResult, getDatabase } from "./client";

interface ApplicationInput {
  p_email: string;
  p_prompt: string;
  p_mode: string;
  p_plan: string;
  p_billing: string;
  p_edit_token: string;
}

export function submitApplication(input: ApplicationInput) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT public.submit_waitlist_application(
      ${input.p_email}, ${input.p_prompt}, ${input.p_mode}, ${input.p_plan}, ${input.p_billing}, ${input.p_edit_token}::uuid
    ) AS id`;
    return rows[0].id as string;
  });
}

export function updateApplicationDetails(input: {
  p_id: string; p_edit_token: string; p_website: string; p_details: string;
}) {
  return databaseResult(async () => {
    const rows = await getDatabase()`SELECT public.update_waitlist_application_details(
      ${input.p_id}::uuid, ${input.p_edit_token}::uuid, ${input.p_website}, ${input.p_details}
    ) AS saved`;
    return rows[0].saved as boolean;
  });
}
