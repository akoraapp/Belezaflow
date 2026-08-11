import { supabase } from './supabaseClient';

export const PushService = {
  async saveSubscription(userId: string, subscription: PushSubscriptionJSON): Promise<void> {
    if (!subscription.endpoint) return;
    // Replace any existing row for this exact endpoint (same device re-subscribing)
    // rather than accumulating duplicates.
    await supabase.from('push_subscriptions').delete().eq('user_id', userId).eq('subscription->>endpoint', subscription.endpoint);
    const { error } = await supabase.from('push_subscriptions').insert({ user_id: userId, subscription });
    if (error) throw error;
  },
};
