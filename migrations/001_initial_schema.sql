-- Application identities; provider IDs are text to support a future Clerk integration.
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_provider_id text unique,
  email text,
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;

-- Forms table
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null default 'Untitled Form',
  slug text not null,
  welcome_screen jsonb not null default '{"title": "Welcome", "buttonText": "Start"}'::jsonb,
  thank_you_screen jsonb not null default '{"title": "Thank you!"}'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Unique slug per user
create unique index forms_slug_idx on public.forms (slug);

-- Index for user queries
create index forms_user_id_idx on public.forms (user_id);

-- Submissions table
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Index for form queries
create index submissions_form_id_idx on public.submissions (form_id);
create index submissions_created_at_idx on public.submissions (created_at desc);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger forms_updated_at
  before update on public.forms
  for each row execute function public.handle_updated_at();

alter table public.forms add column is_published boolean not null default false;
alter table public.forms add column redirect_url text default null;

-- Auth identities are managed externally; ownership is enforced in the server data layer.
-- RLS denies access to non-owner database roles unless explicitly granted a policy.
alter table public.forms enable row level security;
alter table public.submissions enable row level security;
