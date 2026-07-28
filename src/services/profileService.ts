import { supabase } from './supabaseClient';
import type { Profile } from '../types';

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

export const ProfileService = {
  async fetch(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return data ? rowToProfile(data) : null;
  },

  async insert(userId: string, profile: Profile): Promise<void> {
    const { error } = await supabase.from('profiles').insert({ id: userId, ...profileToRow(profile) });
    if (error) throw error;
  },

  async update(userId: string, patch: Partial<Profile>): Promise<void> {
    const { error } = await supabase.from('profiles').update(profileToRow(patch)).eq('id', userId);
    if (error) throw error;
  },
};
