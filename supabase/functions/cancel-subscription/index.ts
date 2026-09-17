// Lets the signed-in user cancel their own subscription. Access (status
// stays 'active') continues until the period already paid for ends —
// cancel_at_period_end is set here, and the cron job in
// 0015_cancel_subscription.sql flips status to 'canceled' once
// current_period_end passes. Mercado Pago's preapproval and Stripe's
// subscription are both told to stop future billing right away; only local
// access is deferred to the paid-through date.
//
// Required secrets: MP_ACCESS_TOKEN and/or STRIPE_SECRET_KEY (whichever
// provider the caller's subscription actually uses). SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are provided automatically by the Supabase
// runtime.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') ?? '';
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() }) : null;

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

async function logActivity(userId: string, action: string, metadata: Record<string, unknown> = {}) {
  const { error } = await supabaseAdmin.from('activity_log').insert({ user_id: userId, action, metadata });
  if (error) console.error('activity_log insert failed', action, error);
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
    p_key: `cancel-subscription:${user.id}`,
    p_max_count: 5,
    p_window_seconds: 300,
  });
  if (rateLimitError) console.error('check_rate_limit failed', rateLimitError); // fail open
  if (!rateLimitError && withinLimit === false) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: sub, error: fetchError } = await supabaseAdmin
    .from('subscriptions')
    .select('status, provider, billing_type, mp_preapproval_id, stripe_subscription_id, cancel_at_period_end')
    .eq('user_id', user.id)
    .maybeSingle();
  if (fetchError) {
    console.error(fetchError);
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (!sub || sub.status !== 'active') {
    return new Response(JSON.stringify({ error: 'No active subscription to cancel' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (sub.cancel_at_period_end) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // A one-time charge (e.g. the annual plan paid via Pix) has nothing
  // recurring to stop at the provider — it already lapses on its own at
  // current_period_end (see useSubscriptionGate). Just mark the flag so the
  // UI shows the same "ends on X" messaging either way.
  if (sub.billing_type !== 'one_time') {
    try {
      if (sub.provider === 'mercadopago') {
        if (!MP_ACCESS_TOKEN) throw new Error('MP_ACCESS_TOKEN is not configured');
        if (!sub.mp_preapproval_id) throw new Error('Subscription has no linked Mercado Pago preapproval');
        const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${sub.mp_preapproval_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
          body: JSON.stringify({ status: 'cancelled' }),
        });
        if (!mpResponse.ok) {
          console.error('Mercado Pago cancel error', mpResponse.status, await mpResponse.text());
          throw new Error('Mercado Pago request failed');
        }
      } else if (sub.provider === 'stripe') {
        if (!stripe) throw new Error('STRIPE_SECRET_KEY is not configured');
        if (!sub.stripe_subscription_id) throw new Error('Subscription has no linked Stripe subscription');
        await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true });
      } else {
        throw new Error(`Unknown provider: ${sub.provider}`);
      }
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: 'Could not cancel subscription with payment provider' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .update({ cancel_at_period_end: true, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);
  if (updateError) {
    console.error(updateError);
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  await logActivity(user.id, 'subscription_cancel_requested', { provider: sub.provider, billingType: sub.billing_type });

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
