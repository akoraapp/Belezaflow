import { createContext, useContext, useState, type ReactNode } from 'react';
import { DICT, type Dict } from '../i18n';
import type { Lang } from '../types';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LangContext = createContext<LangContextValue | null>(null);

const SUPPORTED_LANGS: Lang[] = ['pt', 'en', 'es'];
const LANG_STORAGE_KEY = 'beautyflow-lang';

function readSavedLang(): Lang | null {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && (SUPPORTED_LANGS as string[]).includes(saved)) return saved as Lang;
  } catch {
    // localStorage unavailable (privacy mode, sandboxed preview, etc.) — fall through to detection
  }
  return null;
}

function detectDeviceLang(): Lang {
  try {
    const candidates = navigator.languages?.length ? navigator.languages : navigator.language ? [navigator.language] : [];
    for (const candidate of candidates) {
      const primary = candidate.slice(0, 2).toLowerCase();
      if ((SUPPORTED_LANGS as string[]).includes(primary)) return primary as Lang;
    }
  } catch {
    // navigator unavailable — fall through to default
  }
  return 'pt';
}

function detectInitialLang(): Lang {
  return readSavedLang() ?? detectDeviceLang();
}

export function LangProvider({ initialLang, children }: { initialLang?: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? detectInitialLang());
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      // localStorage unavailable — the choice still applies for this session
    }
  };
  const value: LangContextValue = { lang, setLang, t: DICT[lang] };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within a LangProvider');
  return ctx;
}
