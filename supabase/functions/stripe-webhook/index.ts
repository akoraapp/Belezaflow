// Receives Stripe's webhook events (checkout + subscription lifecycle) and
// updates the matching subscriptions row. Handles the en/es (international)
// side of checkout; src/screens/EscolherPlano's Brazil/pt side is handled by
// mercadopago-webhook instead — see create-subscription for how a user is
// routed to one provider or the other.
//
// Register this function's URL with Stripe as the webhook endpoint:
//   https://<your-project-ref>.functions.supabase.co/stripe-webhook
// Subscribe it to: checkout.session.completed, customer.subscription.updated,
// customer.subscription.deleted.
//
// Required secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (the "Signing
// secret" shown when you add the endpoint in the Stripe Dashboard — this is
// what lets us verify a request genuinely came from Stripe). SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are provided automatically by the Supabase runtime.

import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() }) : null;
const cryptoProvider = Stripe.createSubtleCryptoProvider();

async function updateSubscriptionByUserId(userId: string, patch: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) console.error('Failed updating subscription', userId, error);
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status): 'active' | 'past_due' | 'canceled' | null {
  if (status === 'active' || status === 'trialing') return 'active';
  if (status === 'past_due' || status === 'unpaid' || status === 'incomplete_expired') return 'past_due';
  if (status === 'canceled') return 'canceled';
  return null; // 'incomplete' — still waiting on the first payment, no-op.
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  if (!userId) {
    console.error('Checkout session has no client_reference_id (user id)', session.id);
    return;
  }
  let currentPeriodEnd: string | undefined;
  if (stripe && typeof session.subscription === 'string') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  }
  await updateSubscriptionByUserId(userId, {
    status: 'active',
    provider: 'stripe',
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
    stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
    ...(currentPeriodEnd ? { current_period_end: currentPeriodEnd } : {}),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('Stripe subscription has no metadata.user_id', subscription.id);
    return;
  }
  const status = mapSubscriptionStatus(subscription.status);
  if (!status) return;
  await updateSubscriptionByUserId(userId, { status, current_period_end: new Date(subscription.current_period_end * 1000).toISOString() });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('Stripe subscription has no metadata.user_id', subscription.id);
    return;
  }
  await updateSubscriptionByUserId(userId, { status: 'canceled' });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not configured');
    return new Response('ok', { status: 200 });
  }

  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET, undefined, cryptoProvider);
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    } else if (event.type === 'customer.subscription.updated') {
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
    } else if (event.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
    }
    // Any other event type is acknowledged but ignored — nothing actionable for us.
  } catch (err) {
    console.error('Error processing Stripe webhook', err);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
