-- Web Push notifications: subscription storage + reminder tracking.

-- push_subscriptions ----------------------------------------------------------
-- One row per device/browser subscription. A user can have several (phone,
-- laptop, ...), so this is a plain list rather than one row per user.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
create policy "push_subscriptions_all_own" on public.push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);

-- Avoids duplicate rows if a device re-subscribes with the same endpoint.
create unique index if not exists push_subscriptions_unique_endpoint
  on public.push_subscriptions (user_id, (subscription ->> 'endpoint'));

-- appointments ------------------------------------------------------------------
-- Tracks whether the "starts in 30 minutes" reminder push was already sent,
-- so appointment-reminders (run every 15 min via pg_cron) never double-sends.
alter table public.appointments add column if not exists reminder_sent_at timestamptz;
