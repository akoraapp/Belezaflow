// Creates a subscription for the calling user's chosen plan and returns the
// checkout URL to redirect to. Which payment provider handles it depends on
// the caller's real-world location — geolocated from the request's IP
// address server-side, never anything the client sends, so a tampered
// request can't switch providers/currency — NOT their UI language. A
// Portuguese-speaking visitor outside Brazil still pays in USD via Stripe;
// someone in Brazil pays in BRL via Mercado Pago regardless of which
// language they browse in:
//   - IP geolocates to BR  -> Mercado Pago, BRL
//   - anywhere else        -> Stripe Checkout, USD, cards (always recurring)
// If geolocation fails (lookup error, no IP on the request, etc.) this falls
// back to the old language-based heuristic (profile/metadata language === pt)
// so checkout never breaks outright — it just loses the location precision.
//
// For Brazil, the plan and the client-requested paymentMethod together
// decide which Mercado Pago API is used:
//   - monthly, or annual with paymentMethod !== 'pix' -> /preapproval
//     (recurring, card-only — Mercado Pago's recurring-billing API doesn't
//     support Pix at all).
//   - annual with paymentMethod === 'pix' -> checkout/preferences (Checkout
//     Pro), a one-time charge for the full annual amount. This only exists
//     for the annual plan since it's already sold as a single upfront
//     payment; billing_type is stamped 'one_time' so useSubscriptionGate
//     knows this subscription won't renew itself once current_period_end
//     passes.
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
const BR_PRICING = { currency: 'BRL', monthly: 77, annual: 684 };
const INTL_PRICING = { currency: 'USD', monthly: 47, annual: 397 };

interface CreateSubscriptionBody {
  plan: Plan;
  paymentMethod?: 'card' | 'pix';
}

// Geolocates the caller's IP via a free lookup service to decide Brazil vs.
// international pricing/provider. Returns null (never throws) on any
// failure — no IP on the request, the lookup service being down, a private/
// local IP in dev, etc. — so the caller can fall back to a language-based
// guess instead of the request failing outright.
async function detectCountryCode(req: Request): Promise<string | null> {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';
  if (!ip) return null;
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return typeof data.country_code === 'string' ? data.country_code.toUpperCase() : null;
  } catch (err) {
    console.error('Country geolocation failed', err);
    return null;
  }
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
    .update({
      plan,
      status: 'pending_payment',
      provider: 'mercadopago',
      billing_type: 'recurring',
      mp_preapproval_id: mpData.id,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  return mpData.init_point as string;
}

// Annual-only, pt-only: a single upfront Pix charge via Mercado Pago Checkout
// Pro, since /preapproval (used above) is card-only and has no Pix support.
async function createMercadoPagoOneTimeCheckout(userId: string, email: string | undefined, amount: number, currency: string, origin: string) {
  if (!MP_ACCESS_TOKEN) throw new Error('MP_ACCESS_TOKEN is not configured');

  const preferencePayload = {
    items: [{ title: 'BelezaFlow - Plano Anual', quantity: 1, unit_price: amount, currency_id: currency }],
    external_reference: userId,
    payer: email ? { email } : undefined,
    back_urls: {
      success: `${origin}/app?checkout=success`,
      failure: `${origin}/app?checkout=cancelled`,
      pending: `${origin}/app?checkout=pending`,
    },
    auto_return: 'approved',
  };

  const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    body: JSON.stringify(preferencePayload),
  });
  if (!mpResponse.ok) {
    console.error('Mercado Pago preference error', mpResponse.status, await mpResponse.text());
    throw new Error('Mercado Pago request failed');
  }
  const mpData = await mpResponse.json();

  await supabaseAdmin
    .from('subscriptions')
    .update({
      plan: 'annual',
      status: 'pending_payment',
      provider: 'mercadopago',
      billing_type: 'one_time',
      mp_preapproval_id: null,
      updated_at: new Date().toISOString(),
    })
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
      billing_type: 'recurring',
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
  if (body.paymentMethod !== undefined && body.paymentMethod !== 'card' && body.paymentMethod !== 'pix') {
    return new Response(JSON.stringify({ error: "paymentMethod must be 'card' or 'pix'" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: profile, error: profileError } = await supabaseAdmin.from('profiles').select('language').eq('id', user.id).maybeSingle();
  if (profileError) {
    console.error(profileError);
    return new Response(JSON.stringify({ error: profileError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  // profiles.language (set once onboarding completes) is the source of truth
  // once it exists. If checkout happens before that — or onboarding is ever
  // skipped for a direct-purchase flow — fall back to the language recorded
  // in auth metadata at signup time (see Login.tsx's signUp). This `lang` is
  // ONLY used below as a last-resort fallback if IP geolocation fails — it no
  // longer drives currency/provider on its own (see detectCountryCode above).
  const metadataLang = (user.user_metadata as Record<string, unknown> | undefined)?.language;
  const fallbackLang: PricingLang = metadataLang === 'en' || metadataLang === 'es' ? metadataLang : 'pt';
  const lang: PricingLang = profile?.language === 'en' || profile?.language === 'es' || profile?.language === 'pt' ? profile.language : fallbackLang;

  const countryCode = await detectCountryCode(req);
  const isBrazil = countryCode !== null ? countryCode === 'BR' : lang === 'pt';
  const pricing = isBrazil ? BR_PRICING : INTL_PRICING;
  const amount = body.plan === 'monthly' ? pricing.monthly : pricing.annual;
  const origin = req.headers.get('origin') || Deno.env.get('APP_BASE_URL') || 'https://app.belezaflow.com';

  const wantsPix = isBrazil && body.plan === 'annual' && body.paymentMethod === 'pix';

  try {
    const initPoint = wantsPix
      ? await createMercadoPagoOneTimeCheckout(user.id, user.email, amount, pricing.currency, origin)
      : isBrazil
        ? await createMercadoPagoCheckout(user.id, user.email, body.plan, amount, pricing.currency, origin)
        : await createStripeCheckout(user.id, user.email, body.plan, amount, pricing.currency, origin);
    return new Response(JSON.stringify({ init_point: initPoint }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Could not start checkout' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
