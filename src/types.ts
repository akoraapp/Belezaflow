export interface ServiceConsumable {
  productId: string;
  qty: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  consumables?: ServiceConsumable[];
}

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'MXN' | 'COP' | 'GBP';
export type Lang = 'pt' | 'en' | 'es';
export type ContactMethod = 'whatsapp' | 'sms';

export interface Product {
  id: string;
  name: string;
  qty: number;
  minQty: number;
}

export interface Profile {
  language: Lang;
  currency: CurrencyCode;
  name: string;
  publicName: string;
  profession: string;
  goal: number;
  instagram: string;
  whatsapp: string;
  endereco: string;
  mapsLink: string;
  contactMethod: ContactMethod;
  workingDays: string[];
  availableSlots: string[];
  bufferMinutes: number;
  cancellationNoticeHours: number;
  rescheduleNoticeHours: number;
  // IANA timezone (e.g. "America/Sao_Paulo"), captured from the browser at
  // onboarding — used server-side to compute correct appointment-reminder times.
  timezone: string;
}

export interface OnboardingResult {
  language: Lang;
  currency: CurrencyCode;
  name: string;
  publicName: string;
  profession: string;
  goal: number;
  services: ServiceItem[];
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  service: string;
  price: number;
  duration: number;
  time: string;
  day: string;
  status: string;
  origin?: 'online';
  createdAt: number;
  followUpSent?: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  service: string;
  origem: string;
  status: string;
  birthday: string;
}

export interface FinanceEntry {
  id: string;
  tipo: 'receber' | 'pagar';
  label: string;
  value: number;
  data: string;
  createdAt: number;
}
