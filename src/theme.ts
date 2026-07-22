import { Eye, Hand, PenTool, Droplet, Scissors, Flame, Palette, Stethoscope, Store, MoreHorizontal, type LucideIcon } from 'lucide-react';
import type { CurrencyCode } from './types';

// Design system tokens — single source of truth. Every screen/component must
// consume these instead of hardcoding hex values, radii, shadows, or fonts.
export const T = {
  bg: '#F5F0E8',
  surface: '#FFFFFF',
  surfaceAlt: '#EFE7D8',
  ink: '#1A1A1A',
  gold: '#C9A227',
  goldLight: '#E4C765',
  goldOnDark: '#E4C765',
  goldDeep: '#A6841F',
  goldSoft: '#F6EDD6',
  muted: '#8A8A8A',
  mutedDeep: '#6E6E6E',
  line: '#E5DCC8',
  danger: '#B5654A',
  dangerSoft: '#F3E1DA',
  success: '#6B8E5A',
  successSoft: '#E6EDE1',
};

// Fixed spacing scale — use these multiples everywhere instead of ad-hoc px values.
export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };

// Border-radius scale: cards/containers, inputs/buttons, pills/badges.
export const RADIUS = { card: 20, control: 16, pill: 999 };

// Canonical shadow tokens.
export const SHADOW = {
  card: '0px 2px 8px rgba(26,26,26,0.06)',
  elevated: '0px 4px 16px rgba(26,26,26,0.12)',
};

export const FONT_SERIF = "'Playfair Display', serif";
export const FONT_SANS = "'Inter', sans-serif";

export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@400;500;600;700;800&display=swap');`;

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
  icon: LucideIcon;
}

export const PROFESSIONS: Profession[] = [
  { id: 'lash', icon: Eye },
  { id: 'nail', icon: Hand },
  { id: 'brow', icon: PenTool },
  { id: 'aesthetician', icon: Droplet },
  { id: 'hair', icon: Scissors },
  { id: 'wax', icon: Flame },
  { id: 'makeup', icon: Palette },
  { id: 'clinic', icon: Stethoscope },
  { id: 'salon', icon: Store },
  { id: 'other', icon: MoreHorizontal },
];

interface SuggestedService {
  key: string;
  price: number;
  duration: number;
}

export const SUGGESTED_SERVICES: Record<string, SuggestedService[]> = {
  lash: [
    { key: 'classica', price: 90, duration: 90 },
    { key: 'hibrida', price: 120, duration: 100 },
    { key: 'volumeRusso', price: 160, duration: 120 },
    { key: 'megaVolume', price: 190, duration: 140 },
    { key: 'foxEyes', price: 170, duration: 120 },
    { key: 'manutencao', price: 70, duration: 60 },
    { key: 'remocao', price: 30, duration: 30 },
  ],
  nail: [
    { key: 'esmaltacaoGel', price: 60, duration: 60 },
    { key: 'alongamentoFibra', price: 130, duration: 120 },
    { key: 'blindagem', price: 70, duration: 70 },
    { key: 'manutencaoUnhas', price: 55, duration: 60 },
  ],
  brow: [
    { key: 'designHenna', price: 45, duration: 40 },
    { key: 'micropigmentacao', price: 350, duration: 150 },
    { key: 'laminacao', price: 90, duration: 60 },
  ],
  aesthetician: [
    { key: 'limpezaPele', price: 110, duration: 60 },
    { key: 'peeling', price: 150, duration: 50 },
    { key: 'massagemModeladora', price: 130, duration: 60 },
  ],
  hair: [
    { key: 'corte', price: 80, duration: 50 },
    { key: 'coloracao', price: 220, duration: 150 },
    { key: 'escova', price: 70, duration: 45 },
  ],
  wax: [
    { key: 'depilacaoPerna', price: 60, duration: 40 },
    { key: 'depilacaoBuco', price: 15, duration: 10 },
  ],
  makeup: [
    { key: 'maquiagemSocial', price: 150, duration: 60 },
    { key: 'maquiagemNoiva', price: 400, duration: 120 },
  ],
  clinic: [
    { key: 'consulta', price: 200, duration: 40 },
    { key: 'procedimentoEstetico', price: 500, duration: 90 },
  ],
  salon: [
    { key: 'corteSalao', price: 80, duration: 50 },
    { key: 'manicure', price: 50, duration: 50 },
  ],
  other: [{ key: 'servicoPadrao', price: 100, duration: 60 }],
};

export const ORIGENS = ['Instagram', 'WhatsApp', 'Google', 'TikTok', 'Facebook', 'Indicação'];
export const STATUS_LIST = ['Novo Lead', 'Conversando', 'Agendado', 'Cliente', 'Perdido'];
export const STATUS_COLOR: Record<string, string> = {
  'Novo Lead': T.gold,
  Conversando: '#B08D3F',
  Agendado: T.success,
  Confirmado: T.success,
  Cliente: T.ink,
  Perdido: T.danger,
  Cancelado: T.danger,
  Compareceu: T.success,
  NaoCompareceu: T.danger,
};

export const ALL_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
