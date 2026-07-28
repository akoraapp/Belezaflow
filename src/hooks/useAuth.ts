import { useEffect, useSyncExternalStore } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { createStore } from '../services/store';

interface AuthState {
  session: Session | null | undefined; // undefined = not resolved yet
}

const authStore = createStore<AuthState>({ session: undefined });

let listenerStarted = false;
function ensureListener() {
  if (listenerStarted) return;
  listenerStarted = true;
  supabase.auth.getSession().then(({ data }) => authStore.setState({ session: data.session }));
  supabase.auth.onAuthStateChange((_event, newSession) => authStore.setState({ session: newSession }));
}

export function useAuth() {
  useEffect(() => {
    ensureListener();
  }, []);

  const state = useSyncExternalStore(authStore.subscribe, authStore.getState);

  return {
    session: state.session,
    userId: state.session?.user.id ?? null,
    signOut: () => supabase.auth.signOut().catch(console.error),
  };
}
