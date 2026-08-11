import { supabase } from '../services/supabaseClient';

// Fire-and-forget call to the send-push Edge Function. Never throws: a push
// failing to send must not block or roll back the appointment action that
// triggered it.
export function notifyPush(userId: string, title: string, body: string) {
  supabase.functions.invoke('send-push', { body: { user_id: userId, title, body } }).catch(console.error);
}
