import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const TRIAL_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const PENDING_PAYMENT_POLL_MS = 4000;

export type SubscriptionStatus = 'trialing' | 'pending_payment' | 'active' | 'past_due' | 'canceled';

export interface SubscriptionRow {
  plan: 'monthly' | 'annual' | null;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  billingType: 'recurring' | 'one_time';
  currentPeriodEnd: string | null;
}

function rowFrom(data: Record<string, unknown>): SubscriptionRow {
  const row: SubscriptionRow = {
    plan: (data.plan as SubscriptionRow['plan']) ?? null,
    status: data.status as SubscriptionStatus,
    trialEndsAt: (data.trial_ends_at as string) ?? null,
    billingType: (data.billing_type as SubscriptionRow['billingType']) ?? 'recurring',
    currentPeriodEnd: (data.current_period_end as string) ?? null,
  };
  // A one-time charge (e.g. Pix on the annual plan) never renews itself, so
  // once its paid-through date passes it must be treated as lapsed — same as
  // a recurring subscription whose renewal failed — even though nothing ever
  // wrote 'past_due' into the row itself.
  if (row.billingType === 'one_time' && row.status === 'active' && row.currentPeriodEnd && new Date(row.currentPeriodEnd).getTime() < Date.now()) {
    return { ...row, status: 'past_due' };
  }
  return row;
}

// Fetches (and, for accounts predating this feature, lazily creates) the
// signed-in user's subscription row, and re-polls while a Mercado Pago
// payment is in flight — the webhook that flips pending_payment -> active
// can land a few seconds after checkout, so App.tsx's gate needs fresh data
// without the user having to reload.
export function useSubscriptionGate(userId: string | null) {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('subscriptions').select('plan, status, trial_ends_at, billing_type, current_period_end').eq('user_id', userId).maybeSingle();
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    if (!data) {
      const trialEndsAt = new Date(Date.now() + TRIAL_DAYS_MS).toISOString();
      const { data: created, error: insertError } = await supabase
        .from('subscriptions')
        .insert({ user_id: userId, status: 'trialing', trial_ends_at: trialEndsAt })
        .select('plan, status, trial_ends_at, billing_type, current_period_end')
        .single();
      if (insertError) {
        console.error(insertError);
        setLoading(false);
        return;
      }
      setSubscription(rowFrom(created));
      setLoading(false);
      return;
    }
    setSubscription(rowFrom(data));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    if (subscription?.status !== 'pending_payment') return;
    const interval = setInterval(fetchSubscription, PENDING_PAYMENT_POLL_MS);
    return () => clearInterval(interval);
  }, [subscription?.status, fetchSubscription]);

  // Lets a user stuck on "aguardando confirmação" bail out and pick a plan
  // again instead of waiting forever for a payment that never completed.
  const resetPendingPayment = useCallback(async () => {
    const { error } = await supabase.functions.invoke('reset-subscription', { body: {} });
    if (error) throw error;
    await fetchSubscription();
  }, [fetchSubscription]);

  return { subscription, loading, refetch: fetchSubscription, resetPendingPayment };
}
