import { useEffect, useSyncExternalStore } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { createStore } from '../services/store';

interface AuthState {
  session: Session | null | undefined; // undefined = not resolved yet
  // True from the moment Supabase fires PASSWORD_RECOVERY (someone arrived via
  // a "reset your password" email link) until updateUser({ password }) succeeds
  // and NovaSenhaScreen clears it — App.tsx uses this to show that screen
  // instead of the normal dashboard even though a session already exists.
  passwordRecovery: boolean;
}

const authStore = createStore<AuthState>({ session: undefined, passwordRecovery: false });

let listenerStarted = false;
function ensureListener() {
  if (listenerStarted) return;
  listenerStarted = true;
  supabase.auth.getSession().then(({ data }) => authStore.setState((s) => ({ ...s, session: data.session })));
  supabase.auth.onAuthStateChange((event, newSession) => {
    authStore.setState((s) => ({
      session: newSession,
      passwordRecovery: event === 'PASSWORD_RECOVERY' ? true : s.passwordRecovery,
    }));
  });
}

export function useAuth() {
  useEffect(() => {
    ensureListener();
  }, []);

  const state = useSyncExternalStore(authStore.subscribe, authStore.getState);

  return {
    session: state.session,
    userId: state.session?.user.id ?? null,
    passwordRecovery: state.passwordRecovery,
    clearPasswordRecovery: () => authStore.setState((s) => ({ ...s, passwordRecovery: false })),
    signOut: () => supabase.auth.signOut().catch(console.error),
  };
}
