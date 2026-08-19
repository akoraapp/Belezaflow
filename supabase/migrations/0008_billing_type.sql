-- Distinguishes a recurring subscription (Mercado Pago /preapproval or
-- Stripe subscription, auto-renews) from a one-time charge (Mercado Pago
-- Checkout Pro preference, e.g. Pix on the annual plan) that never renews
-- itself — see create-subscription and useSubscriptionGate for how this
-- drives access once current_period_end passes.

alter table public.subscriptions add column if not exists billing_type text not null default 'recurring' check (billing_type in ('recurring', 'one_time'));
