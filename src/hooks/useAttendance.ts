import { useAppointments } from './useAppointments';
import { useClients } from './useClients';
import { useInventory } from './useInventory';
import { useServices } from './useServices';
import type { Appointment } from '../types';

// Orchestrates the one business event that spans three modules at once: marking
// an appointment's outcome. This intentionally lives outside useAppointments/
// useClients/useInventory so each of those stays a plain CRUD hook over its own
// table — this hook is the only place that knows they need to move together.
export function useAttendance() {
  const { appointments, updateStatus } = useAppointments();
  const { services } = useServices();
  const { decrementProduct } = useInventory();
  const { findClientForAppointment, updateClient, addClient } = useClients();

  const markAttendance = (appointmentId: string, attended: boolean) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt) return;

    if (attended) {
      updateStatus(appointmentId, { status: 'Compareceu' });
      const service = services.find((s) => s.name === appt.service);
      service?.consumables?.forEach((c) => decrementProduct(c.productId, c.qty));
      return;
    }

    updateStatus(appointmentId, { status: 'NaoCompareceu' });
    const existingClient = findClientForAppointment(appt);
    if (existingClient) {
      updateClient(existingClient.id, { status: 'Perdido' });
    } else {
      addClient({ name: appt.clientName, phone: appt.clientPhone || '', service: appt.service, origem: 'Agenda', status: 'Perdido', birthday: '' });
    }
  };

  const markAttended = (appointmentId: string) => markAttendance(appointmentId, true);
  const markNoShow = (appointmentId: string) => markAttendance(appointmentId, false);

  const findClientFor = (appt: Appointment) => findClientForAppointment(appt);

  return { markAttended, markNoShow, findClientFor };
}
