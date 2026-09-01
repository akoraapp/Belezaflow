import { createListResource } from './createListResource';
import { AppointmentService, isSlotConflictError } from '../services/appointmentService';
import { todayDateStr } from '../lib/helpers';
import { notifyPush } from '../lib/pushNotify';
import type { Appointment } from '../types';

const { useResource, store } = createListResource<Appointment>(AppointmentService.fetchAll);

export type AddAppointmentResult = { ok: true } | { ok: false; conflict: boolean };

export function useAppointments() {
  const { items, loading, error, userId } = useResource();

  // Adds optimistically, then rolls the local add back if the write fails — most
  // importantly on a slot conflict (see 0003_appointment_slot_lock.sql), so a caller
  // can never end up believing a double-booked slot went through.
  const addAppointment = async (a: Appointment): Promise<AddAppointmentResult> => {
    store.setState((s) => ({ ...s, items: [...s.items, a] }));
    if (!userId) return { ok: true };
    try {
      await AppointmentService.insert(userId, a);
      notifyPush(userId, 'Novo agendamento', `${a.clientName} às ${a.time}`);
      return { ok: true };
    } catch (err) {
      store.setState((s) => ({ ...s, items: s.items.filter((x) => x.id !== a.id) }));
      const conflict = isSlotConflictError(err);
      if (!conflict) console.error(err);
      return { ok: false, conflict };
    }
  };

  // Used by useAttendance to flip status (Compareceu/NaoCompareceu) as part of
  // the wider attendance orchestration, and directly for simpler status-only
  // transitions like markFollowUpSent/sendReminders below.
  const updateStatus = (id: string, patch: Partial<Appointment>) => {
    store.setState((s) => ({ ...s, items: s.items.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
    AppointmentService.update(id, patch).catch(console.error);
  };

  const markFollowUpSent = (id: string) => updateStatus(id, { followUpSent: true });

  // Records that the professional opened the WhatsApp/SMS confirmation link
  // for this appointment (see src/lib/followup.ts) — not that the client
  // actually received or read it, which this app has no way to know yet.
  const confirmAppointment = (id: string, channel: 'whatsapp' | 'sms') => {
    updateStatus(id, { confirmationStatus: 'enviado', confirmationChannel: channel, confirmationSentAt: new Date().toISOString(), confirmationSentBy: userId ?? undefined });
  };

  const cancelAppointment = (id: string) => {
    const appt = store.getState().items.find((a) => a.id === id);
    updateStatus(id, { status: 'Cancelado' });
    if (userId && appt) {
      notifyPush(userId, 'Agendamento alterado', `${appt.clientName} · ${appt.service} às ${appt.time} foi cancelado.`);
    }
  };

  const rescheduleAppointment = (id: string, day: string, time: string) => {
    const appt = store.getState().items.find((a) => a.id === id);
    updateStatus(id, { day, time, status: 'Agendado' });
    if (userId && appt) {
      notifyPush(userId, 'Agendamento alterado', `${appt.clientName} · ${appt.service} remarcado para ${day} às ${time}.`);
    }
  };

  const sendReminders = () => {
    const todayStr = todayDateStr();
    store.setState((s) => ({
      ...s,
      items: s.items.map((a) => (a.day === todayStr && a.status === 'Agendado' ? { ...a, status: 'Confirmado' } : a)),
    }));
    // Bulk local-only confirmation nudge (mirrors legacy behavior) — each
    // affected row's status is not persisted individually here because it's a
    // soft reminder state, not a real confirmation from the client.
  };

  return { appointments: items, loading, error, addAppointment, updateStatus, markFollowUpSent, confirmAppointment, cancelAppointment, rescheduleAppointment, sendReminders };
}
