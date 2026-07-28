import { createListResource } from './createListResource';
import { ClientService } from '../services/clientService';
import type { Client } from '../types';

const { useResource, store } = createListResource<Client>(ClientService.fetchAll);

export function useClients() {
  const { items, loading, error, userId } = useResource();

  const addClient = (c: Omit<Client, 'id'>): Client => {
    const client: Client = { id: `c${Date.now()}`, ...c };
    store.setState((s) => ({ ...s, items: [client, ...s.items] }));
    if (userId) ClientService.insert(userId, client).catch(console.error);
    return client;
  };

  const updateClient = (id: string, patch: Partial<Client>) => {
    store.setState((s) => ({ ...s, items: s.items.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
    ClientService.update(id, patch).catch(console.error);
  };

  const findClientForAppointment = (appt: { clientPhone?: string; clientName: string }) =>
    items.find((c) => (appt.clientPhone && c.phone === appt.clientPhone) || c.name === appt.clientName);

  return { clients: items, loading, error, addClient, updateClient, findClientForAppointment };
}
