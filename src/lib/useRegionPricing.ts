import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { FUNNEL_PRICING, type FunnelPricing } from './funnelTheme';
import type { Lang } from '../types';

// Which currency/plan-provider a visitor sees is decided by their real
// location (geolocated server-side from their IP by the detect-region Edge
// Function), not by their UI language — someone browsing in Portuguese from
// outside Brazil should still see USD pricing. The actual charge is always
// re-derived independently by create-subscription at checkout time; this
// hook only decides what price tag to *display* beforehand.
const CACHE_KEY = 'belezaflow-region';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h — location rarely changes mid-session

interface RegionCache {
  isBrazil: boolean;
  fetchedAt: number;
}

function readCache(): RegionCache | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegionCache;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(isBrazil: boolean) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ isBrazil, fetchedAt: Date.now() } satisfies RegionCache));
  } catch {
    // sessionStorage unavailable — fine, this call just re-fetches next time
  }
}

export function useRegionPricing(lang: Lang) {
  // Until the real location comes back (or if the lookup ever fails), fall
  // back to the language-based guess so a price is always shown immediately.
  const [isBrazil, setIsBrazil] = useState<boolean>(() => readCache()?.isBrazil ?? lang === 'pt');
  const [loading, setLoading] = useState(() => readCache() === null);

  useEffect(() => {
    const cached = readCache();
    if (cached !== null) return;

    let cancelled = false;
    supabase.functions
      .invoke<{ isBrazil: boolean }>('detect-region')
      .then(({ data, error }) => {
        if (cancelled || error || typeof data?.isBrazil !== 'boolean') return;
        writeCache(data.isBrazil);
        setIsBrazil(data.isBrazil);
      })
      .catch(() => {
        // Network/lookup failure — keep the language-based guess already set.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pricing: FunnelPricing = isBrazil ? FUNNEL_PRICING.pt : FUNNEL_PRICING.en;
  return { pricing, isBrazil, loading };
}
