-- Subscriptions: one row per user, tracking trial/paid status and the
-- linked Mercado Pago preapproval (recurring subscription) once one exists.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text check (plan in ('monthly', 'annual')),
  status text not null default 'trialing' check (status in ('trialing', 'pending_payment', 'active', 'past_due', 'canceled')),
  mp_preapproval_id text,
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.subscriptions enable row level security;

-- Reads are self-service; every status/plan transition after the initial
-- trial row is written server-side (create-subscription / mercadopago-webhook
-- Edge Functions, both using the service role key, which bypasses RLS) —
-- so there is deliberately no update policy for the client.
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions_insert_own" on public.subscriptions for insert with check (auth.uid() = user_id);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_mp_preapproval_id_idx on public.subscriptions(mp_preapproval_id);
