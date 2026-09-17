// Receives Mercado Pago's webhook notifications (preapproval and payment
// events) and updates the matching subscriptions row.
//
// Register this function's URL with Mercado Pago as the notification URL:
//   https://<your-project-ref>.functions.supabase.co/mercadopago-webhook
//
// Security: every event re-fetches the resource straight from Mercado
// Pago's API using our own access token before writing anything, so a
// forged POST alone can't flip a subscription to active. On top of that,
// when MP_WEBHOOK_SECRET is configured, this also verifies the
// x-signature/x-request-id HMAC Mercado Pago sends (the "Secret key" shown
// next to the notification URL in the Mercado Pago dashboard) — without it,
// anyone who learns/guesses a real payment id belonging to this merchant
// account could still replay a notification for it.
//
// Required secrets: MP_ACCESS_TOKEN. Optional but recommended:
// MP_WEBHOOK_SECRET. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided
// automatically by the Supabase runtime.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') ?? '';
const MP_WEBHOOK_SECRET = Deno.env.get('MP_WEBHOOK_SECRET') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const PLAN_PERIOD_MS: Record<string, number> = {
  monthly: 30 * 24 * 60 * 60 * 1000,
  annual: 365 * 24 * 60 * 60 * 1000,
};

// Mercado Pago's documented scheme: x-signature is "ts=<unix seconds>,v1=<hex
// hmac>" and the signed manifest is "id:<data.id lowercased>;request-id:<x-request-id>;ts:<ts>;".
// Returns true when MP_WEBHOOK_SECRET isn't configured yet (soft-allow, but
// logged) so this doesn't silently break existing checkouts before the
// secret is set up — the resource-refetch-before-write behavior above is
// still the primary guard either way.
async function verifyMpSignature(req: Request, dataId: string): Promise<boolean> {
  if (!MP_WEBHOOK_SECRET) {
    console.error('MP_WEBHOOK_SECRET is not configured — skipping Mercado Pago signature verification');
    return true;
  }

  const signatureHeader = req.headers.get('x-signature');
  const requestId = req.headers.get('x-request-id');
  if (!signatureHeader || !requestId) return false;

  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(',')) {
    const [key, value] = part.split('=').map((s) => s.trim());
    if (key && value) parts[key] = value;
  }
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(MP_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signatureBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  const computedHex = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return computedHex === v1;
}

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

// Fire-and-log, never throw: send-welcome-email is idempotent on its own
// (see that function), so it's safe — and simplest — to call this every time
// a subscription goes active rather than tracking "was this already active"
// here too. A failure here must never fail the webhook itself.
async function triggerWelcomeEmail(userId: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) console.error('send-welcome-email failed', userId, res.status, await res.text());
  } catch (err) {
    console.error('send-welcome-email request failed', userId, err);
  }
}

async function logActivity(userId: string, action: string, metadata: Record<string, unknown> = {}) {
  const { error } = await supabaseAdmin.from('activity_log').insert({ user_id: userId, action, metadata });
  if (error) console.error('activity_log insert failed', action, error);
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
    await updateSubscriptionByUserId(userId, { status: 'active', mp_preapproval_id: preapprovalId, cancel_at_period_end: false });
    await logActivity(userId, 'subscription_active', { provider: 'mercadopago', preapprovalId });
    await triggerWelcomeEmail(userId);
  } else if (preapproval.status === 'paused') {
    await updateSubscriptionByUserId(userId, { status: 'past_due' });
    await logActivity(userId, 'subscription_past_due', { provider: 'mercadopago', preapprovalId });
  } else if (preapproval.status === 'cancelled') {
    // Access isn't revoked here — the caller (cancel-subscription Edge
    // Function, or Mercado Pago itself if canceled from their dashboard/for
    // repeated payment failures) already paid through current_period_end;
    // the cron job in 0015_cancel_subscription.sql finalizes the status once
    // that date actually passes.
    await updateSubscriptionByUserId(userId, { cancel_at_period_end: true });
    await logActivity(userId, 'subscription_canceled', { provider: 'mercadopago', preapprovalId });
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
    await updateSubscriptionByUserId(userId, { status: 'active', current_period_end: new Date(Date.now() + periodMs).toISOString(), cancel_at_period_end: false });
    await logActivity(userId, 'subscription_active', { provider: 'mercadopago', paymentId });
    await triggerWelcomeEmail(userId);
  } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
    await updateSubscriptionByUserId(userId, { status: 'past_due' });
    await logActivity(userId, 'subscription_past_due', { provider: 'mercadopago', paymentId });
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

  // MP's signature scheme applies to the real POST notifications; skip it
  // for the occasional GET ping, which carries no signature to check.
  if (req.method === 'POST' && resourceId && !(await verifyMpSignature(req, resourceId))) {
    console.error('Mercado Pago signature verification failed', { type, resourceId });
    return new Response('Invalid signature', { status: 401 });
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
