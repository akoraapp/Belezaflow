// Receives Mercado Pago's webhook notifications (preapproval and payment
// events) and updates the matching subscriptions row.
//
// Register this function's URL with Mercado Pago as the notification URL:
//   https://<your-project-ref>.functions.supabase.co/mercadopago-webhook
//
// Security note: this never trusts the webhook body's own status field —
// every event re-fetches the resource straight from Mercado Pago's API using
// our own access token before writing anything, which is what actually
// prevents a forged POST from flipping someone's subscription to active.
// Full request-signature verification (Mercado Pago's x-signature /
// x-request-id HMAC scheme) is NOT implemented here; add it if tighter
// verification is needed later.
//
// Required secrets: MP_ACCESS_TOKEN. SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are provided automatically by the Supabase runtime.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const PLAN_PERIOD_MS: Record<string, number> = {
  monthly: 30 * 24 * 60 * 60 * 1000,
  annual: 365 * 24 * 60 * 60 * 1000,
};

async function mpGet(path: string) {
  const res = await fetch(`https://api.mercadopago.com${path}`, { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } });
  if (!res.ok) {
    console.error('Mercado Pago GET failed', path, res.status, await res.text());
    return null;
  }
  return res.json();
}

async function updateSubscriptionByUserId(userId: string, patch: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) console.error('Failed updating subscription', userId, error);
}

async function handlePreapproval(preapprovalId: string) {
  const preapproval = await mpGet(`/preapproval/${preapprovalId}`);
  if (!preapproval) return;
  const userId = preapproval.external_reference as string | undefined;
  if (!userId) {
    console.error('Preapproval has no external_reference (user id)', preapprovalId);
    return;
  }
  if (preapproval.status === 'authorized') {
    await updateSubscriptionByUserId(userId, { status: 'active', mp_preapproval_id: preapprovalId });
  } else if (preapproval.status === 'paused') {
    await updateSubscriptionByUserId(userId, { status: 'past_due' });
  } else if (preapproval.status === 'cancelled') {
    await updateSubscriptionByUserId(userId, { status: 'canceled' });
  }
  // 'pending' -> no-op, already pending_payment from create-subscription.
}

// Handles a "payment" event regardless of which Mercado Pago API created the
// underlying charge — a recurring /preapproval installment and a one-time
// checkout/preferences (Checkout Pro, e.g. annual-plan Pix) charge both
// produce a payment resource with the same external_reference and status
// fields once approved, so no separate branch is needed for either.
async function handlePayment(paymentId: string) {
  const payment = await mpGet(`/v1/payments/${paymentId}`);
  if (!payment) return;
  const userId = (payment.external_reference as string | undefined) ?? undefined;
  if (!userId) {
    console.error('Payment has no external_reference (user id)', paymentId);
    return;
  }

  if (payment.status === 'approved') {
    const { data: existing } = await supabaseAdmin.from('subscriptions').select('plan').eq('user_id', userId).maybeSingle();
    const plan = existing?.plan as string | undefined;
    const periodMs = (plan && PLAN_PERIOD_MS[plan]) || PLAN_PERIOD_MS.monthly;
    await updateSubscriptionByUserId(userId, { status: 'active', current_period_end: new Date(Date.now() + periodMs).toISOString() });
  } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
    await updateSubscriptionByUserId(userId, { status: 'past_due' });
  }
  // 'pending'/'in_process' -> no-op, keep waiting.
}

Deno.serve(async (req) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!MP_ACCESS_TOKEN) {
    console.error('MP_ACCESS_TOKEN is not configured');
    return new Response('ok', { status: 200 });
  }

  const url = new URL(req.url);
  let type = url.searchParams.get('type') ?? url.searchParams.get('topic') ?? '';
  let resourceId = url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? '';

  if (!type || !resourceId) {
    try {
      const body = await req.json();
      type = type || body.type || body.topic || '';
      resourceId = resourceId || body.data?.id || body.id || '';
    } catch {
      // No JSON body — fine, we only had query params to go on.
    }
  }

  try {
    if (type === 'preapproval' || type === 'subscription_preapproval') {
      if (resourceId) await handlePreapproval(resourceId);
    } else if (type === 'payment') {
      if (resourceId) await handlePayment(resourceId);
    }
    // Any other topic (e.g. subscription_authorized_payment without a plain
    // payment id) is acknowledged but ignored — nothing actionable for us.
  } catch (err) {
    console.error('Error processing Mercado Pago webhook', err);
  }

  // Mercado Pago only cares that this returns 2xx; it retries on anything else.
  return new Response('ok', { status: 200 });
});
