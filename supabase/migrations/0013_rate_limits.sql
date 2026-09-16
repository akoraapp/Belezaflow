-- Shared rate-limiting primitive for Edge Functions. Only the service role
-- (used exclusively by Edge Functions, never the browser) can read/write
-- this table — RLS is enabled with no policies, so anon/authenticated
-- clients get nothing, same pattern as every other service-role-only table
-- in this schema.
create table if not exists public.rate_limits (
  key text primary key,
  count int not null default 0,
  window_start timestamptz not null default now()
);
alter table public.rate_limits enable row level security;

-- Atomically bumps the counter for `p_key` (resetting it if the current
-- window has expired) and reports whether this call is still within
-- `p_max_count` for that `p_window_seconds` window. security definer + the
-- table's own RLS (no policies) means this function is the only way for
-- anyone besides the service role to touch rate_limits at all, and it never
-- exposes row contents — just a boolean.
create or replace function public.check_rate_limit(p_key text, p_max_count int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case
      when public.rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval then 1
      else public.rate_limits.count + 1
    end,
    window_start = case
      when public.rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval then now()
      else public.rate_limits.window_start
    end
  returning count into v_count;

  return v_count <= p_max_count;
end;
$$;
