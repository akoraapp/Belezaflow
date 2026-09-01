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
  // Custom appointment-confirmation message template (see src/lib/followup.ts) —
  // empty means "use the built-in default for the current language".
  confirmationMessageTemplate: string;
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
  // Opção 1 confirmation flow: the professional taps a WhatsApp/SMS deep
  // link, the app just records that the send flow was opened — see
  // src/lib/followup.ts and AppointmentRow. confirmadoPeloCliente stays
  // null/unused until a future paid-provider integration can flip it from
  // an actual client reply instead.
  confirmationStatus?: 'nao_enviado' | 'enviado';
  confirmationChannel?: 'whatsapp' | 'sms';
  confirmationSentAt?: string;
  confirmationSentBy?: string;
  confirmadoPeloCliente?: boolean | null;
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
