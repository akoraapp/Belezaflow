import { createListResource } from './createListResource';
import { FinanceService } from '../services/financeService';
import type { FinanceEntry } from '../types';

const { useResource, store } = createListResource<FinanceEntry>(FinanceService.fetchAll);

export function useFinance() {
  const { items, loading, error, userId } = useResource();

  const addFinanceEntry = (e: FinanceEntry) => {
    store.setState((s) => ({ ...s, items: [...s.items, e] }));
    if (userId) FinanceService.insert(userId, e).catch(console.error);
  };

  const removeFinanceEntry = (id: string) => {
    store.setState((s) => ({ ...s, items: s.items.filter((e) => e.id !== id) }));
    FinanceService.remove(id).catch(console.error);
  };

  return { financeEntries: items, loading, error, addFinanceEntry, removeFinanceEntry };
}
