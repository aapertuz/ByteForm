# Neon database

ByteForm stores application data in Neon PostgreSQL. The connected project is **ByteForm** (`dawn-resonance-87539344`, AWS US East Ohio), database `neondb`. This migration starts with an empty database; no Supabase records or credentials were copied.

## Local setup

Copy `.env.local.example` to `.env.local` and supply the connection strings from Neon. `DATABASE_URL` is the pooled application URL. `DATABASE_MIGRATION_URL` is the direct URL used for schema changes. Both are server-only secrets; never prefix them with `NEXT_PUBLIC_`.

```sh
bun install
bun run db:migrate
bun dev
```

The migration runner applies ordered SQL files in `migrations/`, using a database advisory lock and one transaction per migration. It records checksums in `public.byteform_migrations`; do not change an applied migration. Add a new numbered file instead. Historical files in `supabase/migrations/` are retained only for reference and must not be run against Neon.

## Data and access

- `public.users` contains application identities with a stable UUID, optional external auth provider ID, email, and creation timestamp. It contains no passwords or session tokens. `auth_provider_id` is text so Clerk IDs can be linked later.
- `public.forms` belongs to an application user. Deleting the user cascades to their forms and submissions.
- `public.submissions` preserves two-phase response tracking and the existing submission UUID capability. Updates reject an incorrect form ID or a completed submission. Single-phase responses are created atomically.
- `public.waitlist_applications` stores leads, selected plans, and optional details. Detail edits require the existing HTTP-only cookie, a matching token hash, and an application less than 24 hours old.

Database access lives in `src/shared/lib/db/` and is marked `server-only`. Every owner read or mutation includes a user predicate; public form reads require publication. SQL values are parameterized, and dynamic update columns are allowlisted. Database errors return a generic message except for known submission domain errors.

The application currently connects as the database/table owner. RLS is enabled with no public policies, denying table access to ordinary database roles. The owner bypasses RLS, so the server data layer is the authorization boundary. Do not expose this connection or add browser-side SQL access. Stored submission and waitlist functions have their default PUBLIC execute grants revoked.

## Authentication and future Clerk work

The database migration does not replace authentication. Existing Supabase sign-in, callback, browser session handling, and proxy remain until Clerk is implemented. No application tables or RPC calls use Supabase anymore.

`src/shared/lib/auth/server.ts` verifies the current Supabase session and upserts the application user into Neon. Existing Supabase UUIDs are preserved for analytics identity consistency. On the Clerk migration, replace session verification here and map Clerk's external user ID through `users.auth_provider_id` to the stable application UUID. Update browser auth and route protection in the same authentication change. Do not store Clerk IDs in the UUID form-owner column directly. User deletion synchronization is also part of that later auth integration.

## Deployment

Set `DATABASE_URL` in the deployment environment and run migrations before deploying this code. Keep Supabase's public authentication variables until the Clerk integration replaces the remaining auth code. Local `.env.local` changes do not configure hosted deployments. Do not delete the Supabase project before that authentication transition.

## Verification

```sh
bun test src/shared/lib/db/database.test.mjs src/app/api/applications/route.test.mjs
bunx tsc --noEmit
bun run build
```

The database integration tests apply the real migrations to an isolated PostgreSQL engine and exercise ownership, draft visibility, submission state, waitlist capabilities and expiry, and cascading deletes. They do not write fixtures to the live Neon project.
