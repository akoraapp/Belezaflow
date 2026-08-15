-- Adds Stripe as a second payment provider alongside Mercado Pago: pt
-- (Brazil) checks out through Mercado Pago as before, en/es (international)
-- now checks out through Stripe. `provider` records which one actually
-- created the row's checkout so the webhooks (and any future support code)
-- know which API to trust for that subscription.

alter table public.subscriptions add column if not exists provider text check (provider in ('mercadopago', 'stripe'));
alter table public.subscriptions add column if not exists stripe_customer_id text;
alter table public.subscriptions add column if not exists stripe_subscription_id text;

create index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions(stripe_subscription_id);
