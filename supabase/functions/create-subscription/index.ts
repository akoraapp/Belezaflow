// Creates a recurring subscription for the calling user's chosen plan and
// returns the checkout URL to redirect to. Which payment provider handles it
// depends on the user's own profile.language (never anything the client
// sends, so a tampered request can't switch providers or plans):
//   - pt (Brazil)      -> Mercado Pago /preapproval, BRL, Pix/boleto/cards
//   - en / es (intl)   -> Stripe Checkout, USD, cards
//
// Required secrets (Project Settings > Edge Functions > Secrets, or
// `supabase secrets set`): MP_ACCESS_TOKEN, STRIPE_SECRET_KEY. Optional:
// APP_BASE_URL (fallback for the post-checkout redirect URL if the request
// has no Origin header). SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are
// provided automatically by the Supabase runtime and do not need to be set
// manually.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') ?? '';
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() }) : null;

// The frontend calls this function directly from the browser, so a preflight
// OPTIONS request precedes the real POST — without these headers the browser
// blocks the POST before it's ever sent, surfacing as a 405/CORS error.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Plan = 'monthly' | 'annual';
type PricingLang = 'pt' | 'en' | 'es';

// Mirrors src/lib/funnelTheme.ts's FUNNEL_PRICING — kept in sync manually
// since the frontend constant isn't reachable from a Deno Edge Function.
const PRICING: Record<PricingLang, { currency: string; monthly: number; annual: number }> = {
  pt: { currency: 'BRL', monthly: 77, annual: 684 },
  en: { currency: 'USD', monthly: 47, annual: 397 },
  es: { currency: 'USD', monthly: 47, annual: 397 },
};

interface CreateSubscriptionBody {
  plan: Plan;
}

async function createMercadoPagoCheckout(userId: string, email: string | undefined, plan: Plan, amount: number, currency: string, origin: string) {
  if (!MP_ACCESS_TOKEN) throw new Error('MP_ACCESS_TOKEN is not configured');

  const preapprovalPayload = {
    reason: `BelezaFlow - ${plan === 'monthly' ? 'Plano Mensal' : 'Plano Anual'}`,
    external_reference: userId,
    payer_email: email,
    back_url: `${origin}/app`,
    status: 'pending',
    auto_recurring: {
      frequency: plan === 'monthly' ? 1 : 12,
      frequency_type: 'months',
      transaction_amount: amount,
      currency_id: currency,
    },
  };

  const mpResponse = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    body: JSON.stringify(preapprovalPayload),
  });
  if (!mpResponse.ok) {
    console.error('Mercado Pago preapproval error', mpResponse.status, await mpResponse.text());
    throw new Error('Mercado Pago request failed');
  }
  const mpData = await mpResponse.json();

  await supabaseAdmin
    .from('subscriptions')
    .update({ plan, status: 'pending_payment', provider: 'mercadopago', mp_preapproval_id: mpData.id, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return mpData.init_point as string;
}

async function createStripeCheckout(userId: string, email: string | undefined, plan: Plan, amount: number, currency: string, origin: string) {
  if (!stripe) throw new Error('STRIPE_SECRET_KEY is not configured');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    client_reference_id: userId,
    success_url: `${origin}/app?checkout=success`,
    cancel_url: `${origin}/app?checkout=cancelled`,
    subscription_data: { metadata: { user_id: userId } },
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: `BelezaFlow - ${plan === 'monthly' ? 'Monthly Plan' : 'Annual Plan'}` },
          unit_amount: Math.round(amount * 100),
          recurring: { interval: plan === 'monthly' ? 'month' : 'year' },
        },
        quantity: 1,
      },
    ],
  });

  await supabaseAdmin
    .from('subscriptions')
    .update({
      plan,
      status: 'pending_payment',
      provider: 'stripe',
      stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (!session.url) throw new Error('Stripe did not return a checkout URL');
  return session.url;
}

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

  // Identifies the caller from their own JWT — the plan is chosen by the
  // client, but WHO is buying it is never trusted from the request body.
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const {
    data: { user },
    error: userError,
  } = await callerClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  let body: CreateSubscriptionBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (body.plan !== 'monthly' && body.plan !== 'annual') {
    return new Response(JSON.stringify({ error: "plan must be 'monthly' or 'annual'" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: profile, error: profileError } = await supabaseAdmin.from('profiles').select('language').eq('id', user.id).maybeSingle();
  if (profileError) {
    console.error(profileError);
    return new Response(JSON.stringify({ error: profileError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  const lang: PricingLang = profile?.language === 'en' || profile?.language === 'es' ? profile.language : 'pt';
  const pricing = PRICING[lang];
  const amount = body.plan === 'monthly' ? pricing.monthly : pricing.annual;
  const origin = req.headers.get('origin') || Deno.env.get('APP_BASE_URL') || 'https://app.belezaflow.com';

  try {
    const initPoint =
      lang === 'pt'
        ? await createMercadoPagoCheckout(user.id, user.email, body.plan, amount, pricing.currency, origin)
        : await createStripeCheckout(user.id, user.email, body.plan, amount, pricing.currency, origin);
    return new Response(JSON.stringify({ init_point: initPoint }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Could not start checkout' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
