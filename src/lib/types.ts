export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface LiveAppointment {
  id: string;
  time: string;
  clientName: string;
  service: string;
  price: number;
  status: 'confirmed' | 'done' | 'pending';
  origin?: 'online';
}

export interface FinanceEntry {
  id: string;
  tipo: 'receber' | 'pagar';
  label: string;
  value: number;
  dueDate: string;
}

export interface LiveClient {
  id: string;
  initial: string;
  name: string;
  tag: string;
  lastVisit: string;
  value: string;
  stage: string;
  phone?: string;
  service?: string;
  birthday?: string;
}
