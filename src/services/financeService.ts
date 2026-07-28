import { supabase } from './supabaseClient';
import type { FinanceEntry } from '../types';

function rowToFinanceEntry(row: Record<string, unknown>): FinanceEntry {
  return {
    id: row.id as string,
    tipo: row.tipo as FinanceEntry['tipo'],
    label: row.label as string,
    value: Number(row.value),
    data: row.data as string,
    createdAt: new Date(row.created_at as string).getTime(),
  };
}

export const FinanceService = {
  async fetchAll(userId: string): Promise<FinanceEntry[]> {
    const { data, error } = await supabase.from('finance_entries').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToFinanceEntry);
  },

  async insert(userId: string, entry: FinanceEntry): Promise<void> {
    const { error } = await supabase.from('finance_entries').insert({
      id: entry.id,
      user_id: userId,
      tipo: entry.tipo,
      label: entry.label,
      value: entry.value,
      data: entry.data,
    });
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('finance_entries').delete().eq('id', id);
    if (error) throw error;
  },
};
