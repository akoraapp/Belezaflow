import type { Lang } from './content';

// Starter services suggested during onboarding, keyed by a coarse
// profession bucket. Kept separate from the inventory profession mapping
// (ClientMachineFlow/App use 'lash' as inventory fallback since that's the
// richest example catalog) — for service suggestions a generic default
// reads better than mislabeling e.g. a hairdresser with lash treatments.
export type ServiceBucket = 'lash' | 'nail' | 'esteticista' | 'other';

// Onboarding profession option index -> service suggestion bucket.
export const PROFESSION_SERVICE_BUCKET: ServiceBucket[] = ['lash', 'nail', 'other', 'esteticista', 'other'];

interface SuggestedService {
  name: string;
  price: number;
  duration: number;
}

export const SUGGESTED_SERVICES: Record<Lang, Record<ServiceBucket, SuggestedService[]>> = {
  pt: {
    lash: [
      { name: 'Volume russo', price: 280, duration: 150 },
      { name: 'Volume brasileiro', price: 220, duration: 120 },
      { name: 'Design de sobrancelha', price: 90, duration: 45 },
      { name: 'Retoque', price: 150, duration: 75 },
    ],
    nail: [
      { name: 'Esmaltação em gel', price: 60, duration: 60 },
      { name: 'Alongamento em fibra', price: 130, duration: 120 },
      { name: 'Manutenção', price: 55, duration: 60 },
    ],
    esteticista: [
      { name: 'Limpeza de pele', price: 110, duration: 60 },
      { name: 'Peeling', price: 150, duration: 50 },
      { name: 'Massagem modeladora', price: 130, duration: 60 },
    ],
    other: [{ name: 'Serviço padrão', price: 100, duration: 60 }],
  },
  en: {
    lash: [
      { name: 'Russian volume', price: 95, duration: 150 },
      { name: 'Classic volume', price: 75, duration: 120 },
      { name: 'Brow design', price: 35, duration: 45 },
      { name: 'Touch-up', price: 50, duration: 75 },
    ],
    nail: [
      { name: 'Gel polish', price: 40, duration: 60 },
      { name: 'Fiberglass extension', price: 90, duration: 120 },
      { name: 'Maintenance', price: 35, duration: 60 },
    ],
    esteticista: [
      { name: 'Facial cleansing', price: 70, duration: 60 },
      { name: 'Peel', price: 95, duration: 50 },
      { name: 'Sculpting massage', price: 85, duration: 60 },
    ],
    other: [{ name: 'Standard service', price: 60, duration: 60 }],
  },
};
