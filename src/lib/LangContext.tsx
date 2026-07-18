import { createContext, useContext, useState, type ReactNode } from 'react';
import { DICT, type Dict } from '../i18n';
import type { Lang } from '../types';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ initialLang = 'pt', children }: { initialLang?: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const value: LangContextValue = { lang, setLang, t: DICT[lang] };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within a LangProvider');
  return ctx;
}
