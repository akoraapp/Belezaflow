-- Idempotency guard for send-welcome-email: without this, a webhook retry
-- (Mercado Pago and Stripe both retry on anything but a clean 2xx) could
-- trigger the same "welcome + Kiwify training link" email more than once.
alter table public.subscriptions add column if not exists welcome_email_sent_at timestamptz;
