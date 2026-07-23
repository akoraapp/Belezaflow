-- BeautyFlow AI — initial schema
-- Every table is scoped to auth.uid() via row level security so each
-- professional only ever sees their own data.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'pt',
  currency text not null default 'BRL',
  name text not null default '',
  public_name text not null default '',
  profession text not null default '',
  goal numeric not null default 0,
  instagram text not null default '',
  whatsapp text not null default '',
  endereco text not null default '',
  maps_link text not null default '',
  contact_method text not null default 'whatsapp',
  working_days text[] not null default '{}',
  available_slots text[] not null default '{}',
  buffer_minutes integer not null default 0,
  cancellation_notice_hours integer not null default 24,
  reschedule_notice_hours integer not null default 24,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create table if not exists public.services (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price numeric not null default 0,
  duration integer not null default 0,
  consumables jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
create policy "services_all_own" on public.services for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists services_user_id_idx on public.services(user_id);

create table if not exists public.products (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  qty integer not null default 0,
  min_qty integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "products_all_own" on public.products for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists products_user_id_idx on public.products(user_id);

create table if not exists public.clients (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null default '',
  service text not null default '',
  origem text not null default '',
  status text not null default 'Novo Lead',
  birthday text not null default '—',
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;
create policy "clients_all_own" on public.clients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists clients_user_id_idx on public.clients(user_id);

create table if not exists public.appointments (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  client_phone text,
  service text not null,
  price numeric not null default 0,
  duration integer not null default 0,
  time text not null,
  day text not null default 'hoje',
  status text not null default 'Agendado',
  origin text,
  follow_up_sent boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;
create policy "appointments_all_own" on public.appointments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists appointments_user_id_idx on public.appointments(user_id);

create table if not exists public.finance_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('receber', 'pagar')),
  label text not null,
  value numeric not null default 0,
  data text not null default '—',
  created_at timestamptz not null default now()
);

alter table public.finance_entries enable row level security;
create policy "finance_entries_all_own" on public.finance_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists finance_entries_user_id_idx on public.finance_entries(user_id);

-- Storage bucket for future profile photo uploads (private, per-user folders).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_read_public" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_write_own" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_update_own" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_delete_own" on storage.objects for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
