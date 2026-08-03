import { createListResource } from './createListResource';
import { AppointmentService, isSlotConflictError } from '../services/appointmentService';
import { todayDateStr } from '../lib/helpers';
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

  return { appointments: items, loading, error, addAppointment, updateStatus, markFollowUpSent, sendReminders };
}
