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
    confirmationStatus: (row.confirmation_status as Appointment['confirmationStatus']) || 'nao_enviado',
    confirmationChannel: (row.confirmation_channel as Appointment['confirmationChannel']) || undefined,
    confirmationSentAt: (row.confirmation_sent_at as string) || undefined,
    confirmationSentBy: (row.confirmation_sent_by as string) || undefined,
    confirmadoPeloCliente: (row.confirmado_pelo_cliente as boolean | null) ?? null,
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
    if (patch.day !== undefined) row.day = patch.day;
    if (patch.time !== undefined) row.time = patch.time;
    if (patch.confirmationStatus !== undefined) row.confirmation_status = patch.confirmationStatus;
    if (patch.confirmationChannel !== undefined) row.confirmation_channel = patch.confirmationChannel;
    if (patch.confirmationSentAt !== undefined) row.confirmation_sent_at = patch.confirmationSentAt;
    if (patch.confirmationSentBy !== undefined) row.confirmation_sent_by = patch.confirmationSentBy;
    // A reschedule moves the appointment to a new instant, so any reminder
    // already sent for the old time no longer applies.
    if (patch.day !== undefined || patch.time !== undefined) row.reminder_sent_at = null;
    const { error } = await supabase.from('appointments').update(row).eq('id', id);
    if (error) throw error;
  },
};
