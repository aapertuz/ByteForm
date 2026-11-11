# Prompt applications

Guests submitting the home-page prompt enter `/new?prompt=…&mode=…`. The workspace shows their prompt, a finite building preview, and a paused signup state. The modal cannot be dismissed from the building-preview page: it has no close button, and Escape/backdrop interactions do not close it. It collects email, then a preferred plan and billing interval. `Application sent!` appears only after the server confirms storage.

Landing pricing cards open the same dialog in place with the chosen tier and billing interval. This entry asks only for email and submits directly; it skips the tier picker. For these applications, the server stores a `Pricing inquiry: …` description as context, with the tier’s default form mode. No additional migration is needed beyond 005.

## Database setup

Run `supabase/migrations/005_waitlist_applications.sql` in the SQL editor of the Supabase project configured by `NEXT_PUBLIC_SUPABASE_URL`. The existing public anonymous key is sufficient for the application API after this migration; no service-role key is needed.

The migration creates the private `public.waitlist_applications` table and two narrowly scoped RPCs. Review applications in the Supabase table editor. Stored fields include email, original prompt, requested mode, preferred plan, billing interval, optional company website/details, and timestamps. A plan preference does not create a subscription or charge the applicant. This flow does not create an authenticated account or generate a form.

Visitors cannot read or list applications. Optional details require an opaque token stored in an HTTP-only, same-site cookie, valid for 24 hours. Only the token hash is stored in the database. Applications cannot be edited after the cookie expires; existing records remain available to administrators.

If the project URL is unreachable or the migration has not been applied, the modal retains the entered information and offers a retry through Next. It never reports success for an unsuccessful save.

## Verification

- `bun test src/app/api/applications/route.test.mjs`
- `bunx eslint src/features/creation src/app/api/applications src/app/new/page.tsx`
- `bunx tsc --noEmit`
- `bun run build`

Verify a real submission after applying the migration and confirming the configured Supabase URL is reachable. Confirm email, plan, mode, prompt, and optional details in the Supabase table editor.
