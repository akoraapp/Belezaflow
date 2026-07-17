export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'MXN' | 'COP' | 'GBP';
export type Language = 'Português' | 'English' | 'Español';
export type ContactMethod = 'whatsapp' | 'sms';

export interface Profile {
  language: Language;
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
}

export interface OnboardingResult {
  language: Language;
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
}
