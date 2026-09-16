// Lets a user whose checkout got stuck reset their own subscription back to
// 'trialing' so EscolherPlanoScreen shows again instead of leaving them on
// "aguardando confirmação" forever. Runs with the service role because
// subscriptions has no client-facing update policy (see
// 0006_subscriptions.sql) — this function is the one narrow, server-checked
// place a client-triggered write is allowed: it only resets a row that is
// actually pending_payment, so an already-active or already-canceled
// subscription can never be touched through this endpoint.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Access-Control-Allow-Origin defaults to '*' only when ALLOWED_ORIGINS isn't
// set, so this doesn't break anything before that secret exists — set
// ALLOWED_ORIGINS (comma-separated, e.g. "https://belezaflow.app") to
// actually restrict this authenticated, app-only endpoint to real origins.
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeadersFor(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  const allowOrigin = ALLOWED_ORIGINS.length === 0 ? '*' : ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const callerClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: withinLimit, error: rateLimitError } = await supabaseAdmin.rpc('check_rate_limit', {
    p_key: `reset-subscription:${user.id}`,
    p_max_count: 10,
    p_window_seconds: 300,
  });
  if (rateLimitError) console.error('check_rate_limit failed', rateLimitError); // fail open
  if (!rateLimitError && withinLimit === false) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: existing, error: fetchError } = await supabaseAdmin.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle();
  if (fetchError) {
    console.error(fetchError);
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (existing?.status !== 'pending_payment') {
    return new Response(JSON.stringify({ error: 'Subscription is not pending payment' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'trialing',
      plan: null,
      provider: null,
      mp_preapproval_id: null,
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);
  if (updateError) {
    console.error(updateError);
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { error: logError } = await supabaseAdmin.from('activity_log').insert({ user_id: user.id, action: 'subscription_reset', metadata: { previousStatus: existing.status } });
  if (logError) console.error('activity_log insert failed', logError);

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
