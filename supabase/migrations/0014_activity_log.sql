-- Minimal business-action audit trail. Service-role only, same pattern as
-- rate_limits — RLS enabled with no policies means anon/authenticated
-- clients get nothing; only Edge Functions (service role) can read/write it.
create table if not exists public.activity_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.activity_log enable row level security;

create index if not exists activity_log_user_id_idx on public.activity_log(user_id);
create index if not exists activity_log_created_at_idx on public.activity_log(created_at);
