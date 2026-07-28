// Minimal external-store primitive so multiple independent hook calls (e.g. useClients()
// used both by ClientesScreen and by useAlerts()) all observe and mutate the same data,
// instead of each hook instance holding its own disconnected copy. Pairs with React's
// built-in useSyncExternalStore — no extra state-management dependency required.
//
// This is also the seam where a future offline cache would plug in: swap `notify`/`setState`
// for a version that also writes through to IndexedDB/localStorage, without any hook or
// component call site changing.
export interface Store<T> {
  getState: () => T;
  setState: (updater: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (updater) => {
      state = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
