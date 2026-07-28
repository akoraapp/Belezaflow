import { supabase } from './supabaseClient';
import type { Client } from '../types';

function rowToClient(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    service: row.service as string,
    origem: row.origem as string,
    status: row.status as string,
    birthday: row.birthday as string,
  };
}

export const ClientService = {
  async fetchAll(userId: string): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToClient);
  },

  async insert(userId: string, client: Client): Promise<void> {
    const { error } = await supabase.from('clients').insert({
      id: client.id,
      user_id: userId,
      name: client.name,
      phone: client.phone,
      service: client.service,
      origem: client.origem,
      status: client.status,
      birthday: client.birthday,
    });
    if (error) throw error;
  },

  async update(id: string, patch: Partial<Client>): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.phone !== undefined) row.phone = patch.phone;
    if (patch.service !== undefined) row.service = patch.service;
    if (patch.origem !== undefined) row.origem = patch.origem;
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.birthday !== undefined) row.birthday = patch.birthday;
    const { error } = await supabase.from('clients').update(row).eq('id', id);
    if (error) throw error;
  },
};
