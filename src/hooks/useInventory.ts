import { createListResource } from './createListResource';
import { InventoryService } from '../services/inventoryService';
import type { Product } from '../types';

const { useResource, store } = createListResource<Product>(InventoryService.fetchAll);

export function useInventory() {
  const { items, loading, error, userId } = useResource();

  const addProduct = (p: Omit<Product, 'id'>) => {
    const product: Product = { id: `p${Date.now()}`, ...p };
    store.setState((s) => ({ ...s, items: [product, ...s.items] }));
    if (userId) InventoryService.insert(userId, product).catch(console.error);
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    store.setState((s) => ({ ...s, items: s.items.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    InventoryService.update(id, patch).catch(console.error);
  };

  const removeProduct = (id: string) => {
    store.setState((s) => ({ ...s, items: s.items.filter((p) => p.id !== id) }));
    InventoryService.remove(id).catch(console.error);
  };

  // Used by useAttendance to decrement consumables and get the up-to-date quantity back.
  const decrementProduct = (id: string, qty: number) => {
    const product = store.getState().items.find((p) => p.id === id);
    if (!product) return;
    updateProduct(id, { qty: Math.max(0, product.qty - qty) });
  };

  return { products: items, loading, error, addProduct, updateProduct, removeProduct, decrementProduct };
}

export function productStatus(p: Product): 'ok' | 'low' | 'out' {
  if (p.qty <= 0) return 'out';
  if (p.qty <= p.minQty) return 'low';
  return 'ok';
}
