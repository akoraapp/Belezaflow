import { supabase } from './supabaseClient';
import type { Appointment, Client, FinanceEntry, Product, Profile, ServiceItem } from '../types';

// ---------- profiles ----------

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    language: row.language as Profile['language'],
    currency: row.currency as Profile['currency'],
    name: row.name as string,
    publicName: row.public_name as string,
    profession: row.profession as string,
    goal: Number(row.goal),
    instagram: row.instagram as string,
    whatsapp: row.whatsapp as string,
    endereco: row.endereco as string,
    mapsLink: row.maps_link as string,
    contactMethod: row.contact_method as Profile['contactMethod'],
    workingDays: (row.working_days as string[]) ?? [],
    availableSlots: (row.available_slots as string[]) ?? [],
    bufferMinutes: Number(row.buffer_minutes),
    cancellationNoticeHours: Number(row.cancellation_notice_hours),
    rescheduleNoticeHours: Number(row.reschedule_notice_hours),
  };
}

function profileToRow(profile: Partial<Profile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (profile.language !== undefined) row.language = profile.language;
  if (profile.currency !== undefined) row.currency = profile.currency;
  if (profile.name !== undefined) row.name = profile.name;
  if (profile.publicName !== undefined) row.public_name = profile.publicName;
  if (profile.profession !== undefined) row.profession = profile.profession;
  if (profile.goal !== undefined) row.goal = profile.goal;
  if (profile.instagram !== undefined) row.instagram = profile.instagram;
  if (profile.whatsapp !== undefined) row.whatsapp = profile.whatsapp;
  if (profile.endereco !== undefined) row.endereco = profile.endereco;
  if (profile.mapsLink !== undefined) row.maps_link = profile.mapsLink;
  if (profile.contactMethod !== undefined) row.contact_method = profile.contactMethod;
  if (profile.workingDays !== undefined) row.working_days = profile.workingDays;
  if (profile.availableSlots !== undefined) row.available_slots = profile.availableSlots;
  if (profile.bufferMinutes !== undefined) row.buffer_minutes = profile.bufferMinutes;
  if (profile.cancellationNoticeHours !== undefined) row.cancellation_notice_hours = profile.cancellationNoticeHours;
  if (profile.rescheduleNoticeHours !== undefined) row.reschedule_notice_hours = profile.rescheduleNoticeHours;
  return row;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data ? rowToProfile(data) : null;
}

export async function insertProfile(userId: string, profile: Profile): Promise<void> {
  const { error } = await supabase.from('profiles').insert({ id: userId, ...profileToRow(profile) });
  if (error) throw error;
}

export async function updateProfileRow(userId: string, patch: Partial<Profile>): Promise<void> {
  const { error } = await supabase.from('profiles').update(profileToRow(patch)).eq('id', userId);
  if (error) throw error;
}

// ---------- services ----------

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

export async function fetchServices(userId: string): Promise<ServiceItem[]> {
  const { data, error } = await supabase.from('services').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToService);
}

export async function insertServices(userId: string, services: ServiceItem[]): Promise<void> {
  if (services.length === 0) return;
  const { error } = await supabase.from('services').insert(services.map((s) => serviceToRow(userId, s)));
  if (error) throw error;
}

export async function replaceServices(userId: string, services: ServiceItem[]): Promise<void> {
  const { error: deleteError } = await supabase.from('services').delete().eq('user_id', userId);
  if (deleteError) throw deleteError;
  await insertServices(userId, services);
}

// ---------- products ----------

function rowToProduct(row: Record<string, unknown>): Product {
  return { id: row.id as string, name: row.name as string, qty: Number(row.qty), minQty: Number(row.min_qty) };
}

export async function fetchProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

export async function insertProduct(userId: string, product: Product): Promise<void> {
  const { error } = await supabase.from('products').insert({ id: product.id, user_id: userId, name: product.name, qty: product.qty, min_qty: product.minQty });
  if (error) throw error;
}

export async function updateProductRow(id: string, patch: Partial<Product>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.qty !== undefined) row.qty = patch.qty;
  if (patch.minQty !== undefined) row.min_qty = patch.minQty;
  const { error } = await supabase.from('products').update(row).eq('id', id);
  if (error) throw error;
}

export async function deleteProductRow(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ---------- clients ----------

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

export async function fetchClients(userId: string): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToClient);
}

export async function insertClient(userId: string, client: Client): Promise<void> {
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
}

export async function updateClientRow(id: string, patch: Partial<Client>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.service !== undefined) row.service = patch.service;
  if (patch.origem !== undefined) row.origem = patch.origem;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.birthday !== undefined) row.birthday = patch.birthday;
  const { error } = await supabase.from('clients').update(row).eq('id', id);
  if (error) throw error;
}

// ---------- appointments ----------

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

export async function fetchAppointments(userId: string): Promise<Appointment[]> {
  const { data, error } = await supabase.from('appointments').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToAppointment);
}

export async function insertAppointment(userId: string, appt: Appointment): Promise<void> {
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
}

export async function updateAppointmentRow(id: string, patch: Partial<Appointment>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.followUpSent !== undefined) row.follow_up_sent = patch.followUpSent;
  const { error } = await supabase.from('appointments').update(row).eq('id', id);
  if (error) throw error;
}

// ---------- finance entries ----------

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

export async function fetchFinanceEntries(userId: string): Promise<FinanceEntry[]> {
  const { data, error } = await supabase.from('finance_entries').select('*').eq('user_id', userId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToFinanceEntry);
}

export async function insertFinanceEntry(userId: string, entry: FinanceEntry): Promise<void> {
  const { error } = await supabase.from('finance_entries').insert({
    id: entry.id,
    user_id: userId,
    tipo: entry.tipo,
    label: entry.label,
    value: entry.value,
    data: entry.data,
  });
  if (error) throw error;
}

export async function deleteFinanceEntryRow(id: string): Promise<void> {
  const { error } = await supabase.from('finance_entries').delete().eq('id', id);
  if (error) throw error;
}
