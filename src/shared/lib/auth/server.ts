import "server-only";
import { cache } from "react";
import { createClient } from "@/shared/lib/supabase/server";
import { syncUser } from "@/shared/lib/db/users";

/** Auth-provider boundary. Clerk can replace session verification here later. */
export const getCurrentUser = cache(async () => {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;

  return syncUser(user.id, user.email ?? null);
});
