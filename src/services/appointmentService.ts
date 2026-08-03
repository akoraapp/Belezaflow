import { supabase } from './supabaseClient';
import type { Appointment } from '../types';

function rowToAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    clientName: row.client_name as string,
    clientPhone: (row.client_phone as string) || undefined,
    service: row.service as string,
    price: Number(row.price),
    duration: Number(row.duration),
    time: row.time as string,
    day: row.day as string,
    status: row.status as string,
    origin: (row.origin as Appointment['origin']) || undefined,
    createdAt: new Date(row.created_at as string).getTime(),
    followUpSent: Boolean(row.follow_up_sent),
  };
}

export function isSlotConflictError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505';
}

export const AppointmentService = {
  async fetchAll(userId: string): Promise<Appointment[]> {
    const { data, error } = await supabase.from('appointments').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToAppointment);
  },

  async insert(userId: string, appt: Appointment): Promise<void> {
    const { error } = await supabase.from('appointments').insert({
      id: appt.id,
      user_id: userId,
      client_name: appt.clientName,
      client_phone: appt.clientPhone ?? null,
      service: appt.service,
      price: appt.price,
      duration: appt.duration,
      time: appt.time,
      day: appt.day,
      status: appt.status,
      origin: appt.origin ?? null,
      follow_up_sent: appt.followUpSent ?? false,
    });
    if (error) throw error;
  },

  async update(id: string, patch: Partial<Appointment>): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.followUpSent !== undefined) row.follow_up_sent = patch.followUpSent;
    const { error } = await supabase.from('appointments').update(row).eq('id', id);
    if (error) throw error;
  },
};
