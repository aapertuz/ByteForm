-- Private lead storage. Visitors can submit through the two narrowly scoped RPCs,
-- but cannot list/read applications or modify a row without its opaque edit token.
begin;

create table public.waitlist_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  prompt text not null check (length(btrim(prompt)) between 1 and 1000),
  mode text not null check (mode in ('chat', 'classic')),
  plan text not null check (plan in ('classic', 'pro', 'team')),
  billing text not null check (billing in ('monthly', 'annual')),
  edit_token_hash text not null,
  website text not null default '' check (length(website) <= 500 and (website = '' or website ~* '^https?://')),
  details text not null default '' check (length(details) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index waitlist_applications_created_at_idx on public.waitlist_applications (created_at desc);
alter table public.waitlist_applications enable row level security;
revoke all on public.waitlist_applications from anon, authenticated;

create function public.submit_waitlist_application(
  p_email text, p_prompt text, p_mode text, p_plan text, p_billing text, p_edit_token uuid
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare application_id uuid;
begin
  if p_edit_token is null then raise exception 'Edit token required'; end if;
  insert into public.waitlist_applications (email, prompt, mode, plan, billing, edit_token_hash)
  values (lower(btrim(p_email)), btrim(p_prompt), p_mode, p_plan, p_billing,
    encode(sha256(convert_to(p_edit_token::text, 'UTF8')), 'hex'))
  returning id into application_id;
  return application_id;
end;
$$;

create function public.update_waitlist_application_details(
  p_id uuid, p_edit_token uuid, p_website text, p_details text
) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.waitlist_applications set website = btrim(p_website), details = btrim(p_details), updated_at = now()
  where id = p_id
    and edit_token_hash = encode(sha256(convert_to(p_edit_token::text, 'UTF8')), 'hex')
    and created_at > now() - interval '24 hours';
  return found;
end;
$$;

revoke all on function public.submit_waitlist_application(text, text, text, text, text, uuid) from public;
revoke all on function public.update_waitlist_application_details(uuid, uuid, text, text) from public;
grant execute on function public.submit_waitlist_application(text, text, text, text, text, uuid) to anon, authenticated;
grant execute on function public.update_waitlist_application_details(uuid, uuid, text, text) to anon, authenticated;

commit;
