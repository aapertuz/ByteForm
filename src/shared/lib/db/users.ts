import "server-only";
import { getDatabase } from "./client";

/** Preserve Supabase UUIDs while linking the external identity to an application user. */
export async function syncUser(providerId: string, email: string | null) {
  const rows = await getDatabase()`INSERT INTO public.users (id, auth_provider_id, email)
    VALUES (${providerId}::uuid, ${providerId}, ${email})
    ON CONFLICT (auth_provider_id) DO UPDATE SET email = EXCLUDED.email
    RETURNING id, email`;
  return rows[0] as { id: string; email: string | null };
}
