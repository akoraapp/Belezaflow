-- The appointment-reminders cron job (0005_pg_cron_reminders.sql) has been
-- calling net.http_post with url/Authorization pulled from two vault
-- secrets ('appointment_reminders_url', 'service_role_key') that were
-- never actually created — a manual step documented in that migration's
-- comments but never carried out. Every 15-minute run has therefore been
-- posting to a NULL url and silently doing nothing: appointment reminder
-- push notifications have never actually been sent.
--
-- Fixed here with a purpose-built, narrow-scope secret instead of the
-- project's master service_role_key: this way the one credential living in
-- pg_net/vault (readable by anyone with SQL access to this project) can
-- only ever be used to trigger this one harmless, idempotent function —
-- never to impersonate the service role anywhere else. The Edge Function's
-- own service role key (used for all of its actual database writes) stays
-- exactly where it already was, in the Edge Function's own environment.
--
-- MANUAL STEP REQUIRED: add a Supabase Edge Function secret named
-- CRON_SECRET whose value matches the one stored below (Project Settings >
-- Edge Functions > Secrets) — appointment-reminders checks incoming
-- requests against it. Without this, the cron job's calls are correctly
-- rejected with 403 rather than silently doing nothing again.
select vault.create_secret('c10e7f5cf626ed77efe1c54cef9f3b53ddfd47505d72bc9b040f5dd6a2cc21d9', 'cron_internal_secret');

select cron.schedule(
  'appointment-reminders-every-15-min',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://zqimhhjyeljafhqtpfci.supabase.co/functions/v1/appointment-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_internal_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
