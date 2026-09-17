-- check_rate_limit is SECURITY DEFINER (it must bypass RLS to write to
-- rate_limits, which intentionally has no client-facing policies). That
-- also means Postgres, by default, lets any role with EXECUTE call it
-- directly via PostgREST's auto-generated /rest/v1/rpc/check_rate_limit —
-- including anon and authenticated, who have no business calling it
-- themselves. Only the Edge Functions (using the service role key) should
-- ever call this; anyone else calling it directly could poison another
-- user's rate-limit key (e.g. 'create-subscription:<victim-id>') to lock
-- them out of a real endpoint they never actually hit.
revoke execute on function public.check_rate_limit(text, integer, integer) from public;
revoke execute on function public.check_rate_limit(text, integer, integer) from anon;
revoke execute on function public.check_rate_limit(text, integer, integer) from authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
