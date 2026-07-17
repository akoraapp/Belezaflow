import { Eye, Hand, PenTool, Droplet, Scissors, Flame, Palette, Stethoscope, Store, MoreHorizontal, type LucideIcon } from 'lucide-react';
import type { CurrencyCode } from './types';

export const T = {
  bg: '#FFFFFF',
  surface: '#FCFAF5',
  surfaceAlt: '#F6F1E7',
  ink: '#1B1712',
  gold: '#B8933E',
  goldLight: '#EADFC1',
  goldDeep: '#8A6D2F',
  goldSoft: '#F3EACB',
  muted: '#8C8579',
  line: '#EDE6D8',
  danger: '#AD4A3C',
  success: '#5B7A54',
};

export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Manrope:wght@400;500;600;700;800&display=swap');`;

interface CurrencyMeta {
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  BRL: { symbol: 'R$', locale: 'pt-BR' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  MXN: { symbol: '$', locale: 'es-MX' },
  COP: { symbol: '$', locale: 'es-CO' },
  GBP: { symbol: '£', locale: 'en-GB' },
};

export interface Profession {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const PROFESSIONS: Profession[] = [
  { id: 'lash', label: 'Lash Designer', icon: Eye },
  { id: 'nail', label: 'Nail Designer', icon: Hand },
  { id: 'brow', label: 'Designer de Sobrancelhas', icon: PenTool },
  { id: 'aesthetician', label: 'Esteticista', icon: Droplet },
  { id: 'hair', label: 'Cabeleireira', icon: Scissors },
  { id: 'wax', label: 'Depiladora', icon: Flame },
  { id: 'makeup', label: 'Maquiadora', icon: Palette },
  { id: 'clinic', label: 'Clínica', icon: Stethoscope },
  { id: 'salon', label: 'Salão de Beleza', icon: Store },
  { id: 'other', label: 'Outro', icon: MoreHorizontal },
];

interface SuggestedService {
  name: string;
  price: number;
  duration: number;
}

export const SUGGESTED_SERVICES: Record<string, SuggestedService[]> = {
  lash: [
    { name: 'Clássica', price: 90, duration: 90 },
    { name: 'Híbrida', price: 120, duration: 100 },
    { name: 'Volume Russo', price: 160, duration: 120 },
    { name: 'Mega Volume', price: 190, duration: 140 },
    { name: 'Fox Eyes', price: 170, duration: 120 },
    { name: 'Manutenção', price: 70, duration: 60 },
    { name: 'Remoção', price: 30, duration: 30 },
  ],
  nail: [
    { name: 'Esmaltação em Gel', price: 60, duration: 60 },
    { name: 'Alongamento em Fibra', price: 130, duration: 120 },
    { name: 'Blindagem', price: 70, duration: 70 },
    { name: 'Manutenção', price: 55, duration: 60 },
  ],
  brow: [
    { name: 'Design com Henna', price: 45, duration: 40 },
    { name: 'Micropigmentação', price: 350, duration: 150 },
    { name: 'Laminação', price: 90, duration: 60 },
  ],
  aesthetician: [
    { name: 'Limpeza de Pele', price: 110, duration: 60 },
    { name: 'Peeling', price: 150, duration: 50 },
    { name: 'Massagem Modeladora', price: 130, duration: 60 },
  ],
  hair: [
    { name: 'Corte', price: 80, duration: 50 },
    { name: 'Coloração', price: 220, duration: 150 },
    { name: 'Escova', price: 70, duration: 45 },
  ],
  wax: [
    { name: 'Depilação Perna Completa', price: 60, duration: 40 },
    { name: 'Depilação Buço', price: 15, duration: 10 },
  ],
  makeup: [
    { name: 'Maquiagem Social', price: 150, duration: 60 },
    { name: 'Maquiagem para Noiva', price: 400, duration: 120 },
  ],
  clinic: [
    { name: 'Consulta', price: 200, duration: 40 },
    { name: 'Procedimento Estético', price: 500, duration: 90 },
  ],
  salon: [
    { name: 'Corte', price: 80, duration: 50 },
    { name: 'Manicure', price: 50, duration: 50 },
  ],
  other: [{ name: 'Serviço Padrão', price: 100, duration: 60 }],
};

export const ORIGENS = ['Instagram', 'WhatsApp', 'Google', 'TikTok', 'Facebook', 'Indicação'];
export const STATUS_LIST = ['Novo Lead', 'Conversando', 'Agendado', 'Cliente', 'Perdido'];
export const STATUS_COLOR: Record<string, string> = {
  'Novo Lead': T.gold,
  Conversando: '#B08D3F',
  Agendado: T.success,
  Cliente: T.ink,
  Perdido: T.danger,
};

export const ALL_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
