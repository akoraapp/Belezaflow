-- Schedules the appointment-reminders Edge Function to run every 15 minutes.
--
-- MANUAL STEP REQUIRED (cannot be done from a migration file): pg_cron and
-- pg_net are usually pre-enabled on Supabase projects, but if the two
-- `create extension` statements below fail with a permissions error, enable
-- them from the Dashboard first: Database > Extensions > search "pg_cron"
-- and "pg_net" > Enable.
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- ANOTHER MANUAL STEP: the cron job below calls the Edge Function over HTTP
-- and needs your project's function URL + service role key. Rather than
-- hardcoding the service role key in this file (it would end up in git
-- history), store both as Vault secrets by running this once in the SQL
-- editor, with your own project ref and service role key:
--
--   select vault.create_secret(
--     'https://YOUR-PROJECT-REF.supabase.co/functions/v1/appointment-reminders',
--     'appointment_reminders_url'
--   );
--   select vault.create_secret(
--     'YOUR_SERVICE_ROLE_KEY',
--     'service_role_key'
--   );
--
-- (Project ref and service role key: Project Settings > API.)

select cron.schedule(
  'appointment-reminders-every-15-min',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'appointment_reminders_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
