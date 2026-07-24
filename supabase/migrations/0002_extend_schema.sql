-- BeautyFlow AI — schema extension
-- Adds columns/tables on top of 0001_init.sql. No existing table, column,
-- or data is dropped or renamed — safe to run against a database that
-- already has 0001_init.sql applied and populated.

-- profiles -------------------------------------------------------------
alter table public.profiles add column if not exists country text not null default '';
alter table public.profiles add column if not exists timezone text not null default '';
alter table public.profiles add column if not exists date_format text not null default 'DD/MM/YYYY';
alter table public.profiles add column if not exists number_format text not null default '1.234,56';
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- services ---------------------------------------------------------------
alter table public.services add column if not exists profession text not null default '';
alter table public.services add column if not exists category text not null default '';
alter table public.services add column if not exists is_default boolean not null default false;
alter table public.services add column if not exists active boolean not null default true;
alter table public.services add column if not exists color text;
alter table public.services add column if not exists updated_at timestamptz not null default now();

create index if not exists services_active_idx on public.services(user_id, active);

-- clients ------------------------------------------------------------------
-- clients.birthday (text) already exists from 0001_init.sql and is kept as-is;
-- birthday_date is the new proper date-typed column.
alter table public.clients add column if not exists instagram text not null default '';
alter table public.clients add column if not exists email text not null default '';
alter table public.clients add column if not exists notes text not null default '';
alter table public.clients add column if not exists birthday_date date;
alter table public.clients add column if not exists last_visit timestamptz;
alter table public.clients add column if not exists total_spent numeric not null default 0;
alter table public.clients add column if not exists total_visits integer not null default 0;
alter table public.clients add column if not exists average_ticket numeric not null default 0;
alter table public.clients add column if not exists preferred_contact text not null default 'whatsapp';
alter table public.clients add column if not exists updated_at timestamptz not null default now();

create index if not exists clients_status_idx on public.clients(user_id, status);

-- appointments ----------------------------------------------------------------
-- client_name and service (text) stay for backward compatibility; client_id
-- and service_id are the new normalized foreign keys.
alter table public.appointments add column if not exists client_id text references public.clients(id) on delete set null;
alter table public.appointments add column if not exists service_id text references public.services(id) on delete set null;

create index if not exists appointments_client_id_idx on public.appointments(client_id);
create index if not exists appointments_service_id_idx on public.appointments(service_id);

-- financial_goals -----------------------------------------------------------------
create table if not exists public.financial_goals (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  period text not null,
  goal numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.financial_goals enable row level security;
create policy "financial_goals_all_own" on public.financial_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists financial_goals_user_id_idx on public.financial_goals(user_id);

-- messages -------------------------------------------------------------------------
create table if not exists public.messages (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text references public.clients(id) on delete set null,
  channel text not null check (channel in ('whatsapp', 'sms')),
  message text not null,
  status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "messages_all_own" on public.messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists messages_user_id_idx on public.messages(user_id);
create index if not exists messages_client_id_idx on public.messages(client_id);

-- payment_methods --------------------------------------------------------------------
create table if not exists public.payment_methods (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  active boolean not null default true
);

alter table public.payment_methods enable row level security;
create policy "payment_methods_all_own" on public.payment_methods for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists payment_methods_user_id_idx on public.payment_methods(user_id);
