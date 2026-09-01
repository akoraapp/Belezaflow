-- Appointment confirmation, Opção 1 (semi-automatic): the professional taps a
-- WhatsApp/SMS deep link (see src/lib/followup.ts) to send a confirmation
-- message to the client, and the app records that the send flow was opened.
-- Fields are deliberately structured so a future paid-provider integration
-- (Opção 2) can write the same columns from a server-side webhook instead —
-- confirmado_pelo_cliente stays unused until the client can actually reply
-- and flip it automatically.

alter table public.appointments add column if not exists confirmation_status text not null default 'nao_enviado' check (confirmation_status in ('nao_enviado', 'enviado'));
alter table public.appointments add column if not exists confirmation_channel text check (confirmation_channel in ('whatsapp', 'sms'));
alter table public.appointments add column if not exists confirmation_sent_at timestamptz;
alter table public.appointments add column if not exists confirmation_sent_by uuid references auth.users(id);
alter table public.appointments add column if not exists confirmado_pelo_cliente boolean;

-- Editable per-profile message template (placeholders substituted client-side:
-- {nome_cliente}, {data}, {hora}, {servico}, {nome_profissional}). Empty/null
-- means "use the built-in default for the professional's language".
alter table public.profiles add column if not exists confirmation_message_template text not null default '';
