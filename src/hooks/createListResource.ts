import { useEffect, useSyncExternalStore } from 'react';
import { useAuth } from './useAuth';
import { createStore, type Store } from '../services/store';

interface ListState<T> {
  items: T[];
  loading: boolean;
  error: unknown;
  userId: string | null;
}

// Shared plumbing behind every "list of rows scoped to the signed-in user" hook
// (clients, appointments, products, finance entries, service catalog): fetch once
// per userId, expose the result through a shared store so every component calling
// the resulting hook sees the same live data, and hand back the store so the
// concrete hook can layer its own mutation methods (add/update/remove) on top.
export function createListResource<T>(fetchAll: (userId: string) => Promise<T[]>) {
  const store: Store<ListState<T>> = createStore<ListState<T>>({ items: [], loading: false, error: null, userId: null });

  function useResource() {
    const { userId } = useAuth();

    useEffect(() => {
      if (!userId) {
        store.setState({ items: [], loading: false, error: null, userId: null });
        return;
      }
      if (store.getState().userId === userId) return;
      let cancelled = false;
      store.setState((s) => ({ ...s, loading: true }));
      fetchAll(userId)
        .then((items) => {
          if (!cancelled) store.setState({ items, loading: false, error: null, userId });
        })
        .catch((error) => {
          if (!cancelled) store.setState((s) => ({ ...s, loading: false, error }));
        });
      return () => {
        cancelled = true;
      };
    }, [userId]);

    const state = useSyncExternalStore(store.subscribe, store.getState);
    return state;
  }

  return { useResource, store };
}
