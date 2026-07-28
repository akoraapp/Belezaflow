import { supabase } from './supabaseClient';
import type { Product } from '../types';

function rowToProduct(row: Record<string, unknown>): Product {
  return { id: row.id as string, name: row.name as string, qty: Number(row.qty), minQty: Number(row.min_qty) };
}

export const InventoryService = {
  async fetchAll(userId: string): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToProduct);
  },

  async insert(userId: string, product: Product): Promise<void> {
    const { error } = await supabase.from('products').insert({ id: product.id, user_id: userId, name: product.name, qty: product.qty, min_qty: product.minQty });
    if (error) throw error;
  },

  async update(id: string, patch: Partial<Product>): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.qty !== undefined) row.qty = patch.qty;
    if (patch.minQty !== undefined) row.min_qty = patch.minQty;
    const { error } = await supabase.from('products').update(row).eq('id', id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },
};
