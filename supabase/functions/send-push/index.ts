// Sends a Web Push notification to every subscribed device of a given user.
// Called from the frontend right after an appointment is created/canceled/
// rescheduled, and from the appointment-reminders function on its cron schedule.
//
// Required secrets (Project Settings > Edge Functions > Secrets, or
// `supabase secrets set`): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// the Supabase runtime and do not need to be set manually.

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:support@belezaflow.app';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

interface SendPushBody {
  user_id: string;
  title: string;
  body: string;
  url?: string;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return new Response(JSON.stringify({ error: 'VAPID keys are not configured' }), { status: 500 });
  }

  let payload: SendPushBody;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { user_id, title, body, url } = payload;
  if (!user_id || !title || !body) {
    return new Response(JSON.stringify({ error: 'user_id, title and body are required' }), { status: 400 });
  }

  const { data: rows, error } = await supabaseAdmin.from('push_subscriptions').select('id, subscription').eq('user_id', user_id);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const notificationPayload = JSON.stringify({ title, body, url: url ?? '/' });

  type PushSubscriptionArg = Parameters<typeof webpush.sendNotification>[0];
  const results = await Promise.allSettled(
    rows.map((row) => webpush.sendNotification(row.subscription as unknown as PushSubscriptionArg, notificationPayload)),
  );

  // A 404/410 means the browser/OS invalidated that subscription (uninstalled,
  // permission revoked, ...) — prune it so future sends don't keep retrying it.
  const staleIds = results
    .map((result, i) => ({ result, id: rows[i].id as string }))
    .filter(({ result }) => result.status === 'rejected' && [404, 410].includes((result.reason as { statusCode?: number })?.statusCode ?? 0))
    .map(({ id }) => id);

  if (staleIds.length > 0) {
    await supabaseAdmin.from('push_subscriptions').delete().in('id', staleIds);
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return new Response(JSON.stringify({ sent, total: rows.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
