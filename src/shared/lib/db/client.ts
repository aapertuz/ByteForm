import "server-only";
import { neon, types } from "@neondatabase/serverless";

// Preserve the existing API and Server Component contract for PostgreSQL timestamps.
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value: string) => new Date(value).toISOString());

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  return neon(url);
}

const publicErrors = new Set([
  "form_not_found", "form_not_published", "submission_not_found",
  "form_mismatch", "already_completed",
]);

/** Preserve domain errors without exposing SQL, credentials, or submitted data. */
export async function databaseResult<T>(operation: () => Promise<T>) {
  try {
    return { data: await operation(), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return {
      data: null,
      error: { message: publicErrors.has(message) ? message : "Database operation failed" },
    };
  }
}
