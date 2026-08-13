// Creates a Mercado Pago recurring subscription (preapproval) for the calling
// user's chosen plan and returns the checkout URL (init_point) to redirect to.
//
// Required secrets (Project Settings > Edge Functions > Secrets, or
// `supabase secrets set`): MP_ACCESS_TOKEN. Optional: APP_BASE_URL (used for
// Mercado Pago's back_url if the request has no Origin header to fall back on).
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// the Supabase runtime and do not need to be set manually.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

type Plan = 'monthly' | 'annual';
type PricingLang = 'pt' | 'en' | 'es';

// Mirrors src/lib/funnelTheme.ts's FUNNEL_PRICING — kept in sync manually
// since the frontend constant isn't reachable from a Deno Edge Function.
// Pricing is decided here from the user's own profile.language, not from
// anything the client sends, so a tampered request can't buy the cheaper plan.
const PRICING: Record<PricingLang, { currency: string; monthly: number; annual: number }> = {
  pt: { currency: 'BRL', monthly: 77, annual: 684 },
  en: { currency: 'USD', monthly: 47, annual: 397 },
  es: { currency: 'USD', monthly: 47, annual: 397 },
};

interface CreateSubscriptionBody {
  plan: Plan;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  if (!MP_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'MP_ACCESS_TOKEN is not configured' }), { status: 500 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }

  // Identifies the caller from their own JWT — the plan is chosen by the
  // client, but WHO is buying it is never trusted from the request body.
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
  }

  let body: CreateSubscriptionBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }
  if (body.plan !== 'monthly' && body.plan !== 'annual') {
    return new Response(JSON.stringify({ error: "plan must be 'monthly' or 'annual'" }), { status: 400 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin.from('profiles').select('language').eq('id', user.id).maybeSingle();
  if (profileError) {
    console.error(profileError);
    return new Response(JSON.stringify({ error: profileError.message }), { status: 500 });
  }
  const lang: PricingLang = profile?.language === 'en' || profile?.language === 'es' ? profile.language : 'pt';
  const pricing = PRICING[lang];
  const amount = body.plan === 'monthly' ? pricing.monthly : pricing.annual;

  const origin = req.headers.get('origin') || Deno.env.get('APP_BASE_URL') || 'https://app.belezaflow.com';

  const preapprovalPayload = {
    reason: `BelezaFlow - ${body.plan === 'monthly' ? 'Plano Mensal' : 'Plano Anual'}`,
    external_reference: user.id,
    payer_email: user.email,
    back_url: `${origin}/app`,
    status: 'pending',
    auto_recurring: {
      frequency: body.plan === 'monthly' ? 1 : 12,
      frequency_type: 'months',
      transaction_amount: amount,
      currency_id: pricing.currency,
    },
  };

  const mpResponse = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    body: JSON.stringify(preapprovalPayload),
  });

  if (!mpResponse.ok) {
    const mpError = await mpResponse.text();
    console.error('Mercado Pago preapproval error', mpResponse.status, mpError);
    return new Response(JSON.stringify({ error: 'Mercado Pago request failed' }), { status: 502 });
  }

  const mpData = await mpResponse.json();

  const { error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .update({ plan: body.plan, status: 'pending_payment', mp_preapproval_id: mpData.id, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);

  if (updateError) {
    console.error(updateError);
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ init_point: mpData.init_point }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
