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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
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

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
