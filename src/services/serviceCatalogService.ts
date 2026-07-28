import { supabase } from './supabaseClient';
import type { ServiceItem } from '../types';

function rowToService(row: Record<string, unknown>): ServiceItem {
  return {
    id: row.id as string,
    name: row.name as string,
    price: Number(row.price),
    duration: Number(row.duration),
    consumables: (row.consumables as ServiceItem['consumables']) ?? [],
  };
}

function serviceToRow(userId: string, service: ServiceItem): Record<string, unknown> {
  return {
    id: service.id,
    user_id: userId,
    name: service.name,
    price: service.price,
    duration: service.duration,
    consumables: service.consumables ?? [],
  };
}

export const ServiceCatalogService = {
  async fetchAll(userId: string): Promise<ServiceItem[]> {
    const { data, error } = await supabase.from('services').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToService);
  },

  async insertMany(userId: string, services: ServiceItem[]): Promise<void> {
    if (services.length === 0) return;
    const { error } = await supabase.from('services').insert(services.map((s) => serviceToRow(userId, s)));
    if (error) throw error;
  },

  async replaceAll(userId: string, services: ServiceItem[]): Promise<void> {
    const { error: deleteError } = await supabase.from('services').delete().eq('user_id', userId);
    if (deleteError) throw deleteError;
    await ServiceCatalogService.insertMany(userId, services);
  },
};
