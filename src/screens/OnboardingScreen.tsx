import { useState } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_PAD_TOP, CONTENT_PAD_X } from '../components/AppFrame';
import type { Lang, Locale, OnboardingStep } from '../data/content';

// Maps onboarding profession option index -> inventory profession key.
// Only lash/nail/esteticista have dedicated inventory data; other
// professions fall back to the lash catalog as a reasonable default.
const PROFESSION_INVENTORY_KEY = ['lash', 'nail', 'lash', 'esteticista', 'lash'];

interface OnboardingScreenProps {
  t: Locale;
  onLanguageSelect: (lang: Lang) => void;
  onProfessionSelect: (inventoryKey: string) => void;
  onFinish: () => void;
}

function detectLang(label: string): Lang | null {
  if (label === 'Português') return 'pt';
  if (label === 'English') return 'en';
  return null;
}

function OptionRow({ label, selected, onClick, compact }: { label: string; selected: boolean; onClick: () => void; compact?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...sx(`cursor:pointer; display:flex; align-items:center; justify-content:space-between; padding:${compact ? '14px 18px' : '16px 18px'}; border-radius:14px;`),
        border: `1.5px solid ${selected ? '#E3C989' : '#EBE2CF'}`,
        background: selected ? '#FBF3E4' : '#FFFFFF',
      }}
    >
      <span style={sx(`font-size:${compact ? '15px' : '16px'}; font-weight:600;`)}>{label}</span>
      {selected && <div style={sx('width:10px; height:10px; border-radius:50%; background:#B98D3E; flex-shrink:0;')} />}
    </div>
  );
}

export function OnboardingScreen({ t, onLanguageSelect, onProfessionSelect, onFinish }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const o = t.onboarding;

  const [langIdx, setLangIdx] = useState(() => o.s1.options.findIndex((opt) => opt.selected));
  const [currencyIdx, setCurrencyIdx] = useState(() => o.s3.options.findIndex((opt) => opt.selected));
  const [professionIdx, setProfessionIdx] = useState(() => o.s4.options.findIndex((opt) => opt.selected));

  function selectLanguage(i: number, opt: OnboardingStep['options'][number]) {
    setLangIdx(i);
    const lang = detectLang(opt.label);
    if (lang) onLanguageSelect(lang);
  }

  function selectProfession(i: number) {
    setProfessionIdx(i);
    onProfessionSelect(PROFESSION_INVENTORY_KEY[i] ?? 'lash');
  }

  return (
    <div style={sx('height:100%; display:flex; flex-direction:column; background:#FFFFFF;')}>
      <div
        style={sx(
          `${SCREEN_PAD_TOP} ${CONTENT_PAD_X} display:flex; flex-direction:column; flex:1; min-height:0; overflow-y:auto; box-sizing:border-box; padding-bottom:32px;`,
        )}
      >
        <div style={sx('font-size:12px; letter-spacing:2px; color:#B98D3E; font-weight:700; text-transform:uppercase;')}>
          {o.step} {step} / 4
        </div>

        {step === 1 && (
          <>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:16px; margin-bottom:6px;")}>{o.s1.title}</div>
            <div style={sx('font-size:14px; color:#8A8074; margin-bottom:28px;')}>{o.s1.subtitle}</div>
            <div style={sx('display:flex; flex-direction:column; gap:12px;')}>
              {o.s1.options.map((opt, i) => (
                <OptionRow key={opt.label} label={opt.label} selected={i === langIdx} onClick={() => selectLanguage(i, opt)} />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:16px; margin-bottom:6px;")}>{o.s3.title}</div>
            <div style={sx('font-size:14px; color:#8A8074; margin-bottom:28px;')}>{o.s3.subtitle}</div>
            <div style={sx('display:flex; flex-direction:column; gap:12px;')}>
              {o.s3.options.map((opt, i) => (
                <OptionRow key={opt.label} label={opt.label} selected={i === currencyIdx} onClick={() => setCurrencyIdx(i)} />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:16px; margin-bottom:6px;")}>{o.s4.title}</div>
            <div style={sx('font-size:14px; color:#8A8074; margin-bottom:28px;')}>{o.s4.subtitle}</div>
            <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
              {o.s4.options.map((opt, i) => (
                <OptionRow key={opt.label} label={opt.label} selected={i === professionIdx} onClick={() => selectProfession(i)} compact />
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:16px; margin-bottom:6px;")}>{o.s5.title}</div>
            <div style={sx('font-size:14px; color:#8A8074; margin-bottom:28px;')}>{o.s5.subtitle}</div>
            <div style={sx('text-align:center; padding:28px 0;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:600; color:#201C17;")}>{o.s5.amount}</div>
              <div style={sx('font-size:13px; color:#8A8074; margin-top:6px;')}>{o.s5.perMonth}</div>
            </div>
            <div style={sx('height:6px; border-radius:999px; background:#F0E6D2; margin:8px 0 30px; overflow:hidden;')}>
              <div style={sx('width:62%; height:100%; background:#B98D3E;')} />
            </div>
          </>
        )}

        <div style={sx('flex:1;')} />

        <div style={sx('display:flex; gap:10px;')}>
          {step > 1 && (
            <div
              onClick={() => setStep((s) => s - 1)}
              style={sx(
                'cursor:pointer; height:50px; width:50px; flex-shrink:0; border-radius:999px; border:1px solid #EBE2CF; display:flex; align-items:center; justify-content:center;',
              )}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="#8A8074" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.5 2 3 6l4.5 4"></path>
              </svg>
            </div>
          )}
          <div
            onClick={() => (step < 4 ? setStep((s) => s + 1) : onFinish())}
            style={sx(
              'cursor:pointer; flex:1; height:50px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:600; letter-spacing:0.4px;',
            )}
          >
            {step < 4 ? o.next : o.finish}
          </div>
        </div>
      </div>
    </div>
  );
}
