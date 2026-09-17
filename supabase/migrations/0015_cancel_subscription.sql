-- Lets a user cancel their recurring subscription while keeping access until
-- the period they already paid for ends, instead of revoking it immediately.
-- The cancel-subscription Edge Function tells Mercado Pago/Stripe to stop
-- future billing and sets this flag; the cron job below flips status to
-- 'canceled' once current_period_end actually passes (or right away if it
-- was never set, e.g. canceling before the very first payment ever landed).

alter table public.subscriptions add column if not exists cancel_at_period_end boolean not null default false;

select cron.schedule(
  'finalize-canceled-subscriptions-hourly',
  '0 * * * *',
  $$
  update public.subscriptions
  set status = 'canceled', updated_at = now()
  where cancel_at_period_end = true
    and status = 'active'
    and (current_period_end is null or current_period_end < now());
  $$
);
