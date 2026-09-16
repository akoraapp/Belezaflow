-- Security fix: subscriptions_insert_own only checked auth.uid() = user_id,
-- with no restriction on the values being inserted. Since the subscriptions
-- table's own status check allows 'active', a signed-in user could insert
-- their own subscription row directly as { status: 'active', plan: 'annual' }
-- via the client SDK — before the app's own lazy-create in
-- useSubscriptionGate.ts ever runs — and skip payment entirely. The only
-- legitimate client-side insert is that lazy-create of the initial trial row
-- (status 'trialing', no plan yet); every real transition after that is
-- written server-side by create-subscription/the payment webhooks using the
-- service role key, which bypasses RLS and isn't affected by this policy.
drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own" on public.subscriptions
  for insert
  with check (auth.uid() = user_id and status = 'trialing' and plan is null);
