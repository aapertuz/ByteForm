create or replace function public.start_submission(
  p_form_id uuid,
  p_started_at timestamptz default now(),
  p_answers jsonb default '{}'::jsonb,
  p_completed_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_published boolean;
  v_id uuid;
begin
  select is_published into v_published
  from public.forms
  where id = p_form_id
  for share;

  if v_published is null then
    raise exception 'form_not_found';
  end if;
  if v_published is false then
    raise exception 'form_not_published';
  end if;

  insert into public.submissions (form_id, started_at, answers, completed_at)
  values (p_form_id, p_started_at, p_answers, p_completed_at)
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.update_submission(
  p_submission_id uuid,
  p_form_id uuid,
  p_answers jsonb,
  p_completed_at timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_completed timestamptz;
  v_form_id uuid;
begin
  -- FOR UPDATE serializes concurrent updates so the completed_at guard below
  -- can't race with another caller setting it.
  select completed_at, form_id into v_completed, v_form_id
  from public.submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'submission_not_found';
  end if;
  if v_form_id <> p_form_id then
    raise exception 'form_mismatch';
  end if;
  if v_completed is not null then
    raise exception 'already_completed';
  end if;

  update public.submissions
  set answers = p_answers,
      completed_at = coalesce(p_completed_at, completed_at)
  where id = p_submission_id;
end;
$$;


revoke all on function public.start_submission(uuid, timestamptz, jsonb, timestamptz) from public;
revoke all on function public.update_submission(uuid, uuid, jsonb, timestamptz) from public;
