// Sends a Web Push notification to every subscribed device of a given user.
// Called from the frontend right after an appointment is created/canceled/
// rescheduled, and from the appointment-reminders function on its cron schedule.
//
// Security: this used to trust body.user_id outright — any signed-in caller
// could push arbitrary title/body text to any other user's device just by
// naming their id. Now the caller must either present the service role key
// (the internal, trusted caller — appointment-reminders and other server-side
// callers) or their own JWT matching user_id (the frontend, notifying its own
// user about their own appointment change).
//
// Required secrets (Project Settings > Edge Functions > Secrets, or
// `supabase secrets set`): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided
// automatically by the Supabase runtime and do not need to be set manually.

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:support@belezaflow.app';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface SendPushBody {
  user_id: string;
  title: string;
  body: string;
  url?: string;
}

// Constant-time-ish comparison isn't critical here (this isn't a signature
// check, just a secret-equality check against an env var only this project
// knows), but avoiding a plain !== keeps it consistent with how the rest of
// the codebase treats bearer secrets.
function isServiceRoleCaller(authHeader: string | null): boolean {
  if (!authHeader?.startsWith('Bearer ')) return false;
  return authHeader.slice('Bearer '.length) === SERVICE_ROLE_KEY;
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

  const authHeader = req.headers.get('Authorization');
  if (!isServiceRoleCaller(authHeader)) {
    if (!authHeader) return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser();
    if (userError || !user) return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
    if (user.id !== user_id) return new Response(JSON.stringify({ error: 'Cannot send a push notification for another user' }), { status: 403 });

    const { data: withinLimit, error: rateLimitError } = await supabaseAdmin.rpc('check_rate_limit', {
      p_key: `send-push:${user.id}`,
      p_max_count: 30,
      p_window_seconds: 300,
    });
    if (rateLimitError) console.error('check_rate_limit failed', rateLimitError); // fail open
    if (!rateLimitError && withinLimit === false) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429 });
    }
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
