import { createListResource } from './createListResource';
import { AppointmentService } from '../services/appointmentService';
import type { Appointment } from '../types';

const { useResource, store } = createListResource<Appointment>(AppointmentService.fetchAll);

export function useAppointments() {
  const { items, loading, error, userId } = useResource();

  const addAppointment = (a: Appointment) => {
    store.setState((s) => ({ ...s, items: [...s.items, a] }));
    if (userId) AppointmentService.insert(userId, a).catch(console.error);
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
    store.setState((s) => ({
      ...s,
      items: s.items.map((a) => (a.day === 'hoje' && a.status === 'Agendado' ? { ...a, status: 'Confirmado' } : a)),
    }));
    // Bulk local-only confirmation nudge (mirrors legacy behavior) — each
    // affected row's status is not persisted individually here because it's a
    // soft reminder state, not a real confirmation from the client.
  };

  return { appointments: items, loading, error, addAppointment, updateStatus, markFollowUpSent, sendReminders };
}
