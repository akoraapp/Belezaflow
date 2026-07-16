import { useState } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_PAD_TOP, CONTENT_PAD_X } from '../components/AppFrame';
import type { Lang, Locale, OnboardingStep } from '../data/content';
import type { NewFeatureStrings } from '../data/newFeatures';
import { PROFESSION_SERVICE_BUCKET, SUGGESTED_SERVICES } from '../data/suggestedServices';
import { slugify } from '../lib/scheduling';
import type { ServiceItem } from '../lib/types';

// Maps onboarding profession option index -> inventory profession key.
// Only lash/nail/esteticista have dedicated inventory data; other
// professions fall back to the lash catalog as a reasonable default.
const PROFESSION_INVENTORY_KEY = ['lash', 'nail', 'lash', 'esteticista', 'lash'];

const TOTAL_STEPS = 7;

export interface OnboardingResult {
  name: string;
  publicName: string;
  services: ServiceItem[];
}

interface OnboardingScreenProps {
  t: Locale;
  lang: Lang;
  strings: NewFeatureStrings;
  onLanguageSelect: (lang: Lang) => void;
  onProfessionSelect: (inventoryKey: string) => void;
  onFinish: (result: OnboardingResult) => void;
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

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:16px; margin-bottom:6px;")}>{title}</div>
      <div style={sx('font-size:14px; color:#8A8074; margin-bottom:28px;')}>{subtitle}</div>
    </>
  );
}

const inputStyle = sx(
  "height:50px; border-radius:12px; border:1px solid #EBE2CF; padding:0 16px; font-size:15px; font-weight:600; font-family:'Manrope',sans-serif; box-sizing:border-box; width:100%;",
);

let serviceIdSeq = 0;
function nextServiceId() {
  serviceIdSeq += 1;
  return `svc-${serviceIdSeq}`;
}

export function OnboardingScreen({ t, lang, strings, onLanguageSelect, onProfessionSelect, onFinish }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const o = t.onboarding;
  const s = strings;

  const [langIdx, setLangIdx] = useState(() => o.s1.options.findIndex((opt) => opt.selected));
  const [professionIdx, setProfessionIdx] = useState(() => o.s4.options.findIndex((opt) => opt.selected));
  const [currencyIdx, setCurrencyIdx] = useState(() => o.s3.options.findIndex((opt) => opt.selected));
  const [name, setName] = useState('');
  const [publicName, setPublicName] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const bucket = PROFESSION_SERVICE_BUCKET[professionIdx] ?? 'other';
    return SUGGESTED_SERVICES[lang][bucket].map((svc) => ({ id: nextServiceId(), ...svc }));
  });
  const [servicesInitialized, setServicesInitialized] = useState(false);

  function selectLanguage(i: number, opt: OnboardingStep['options'][number]) {
    setLangIdx(i);
    const lang = detectLang(opt.label);
    if (lang) onLanguageSelect(lang);
  }

  function selectProfession(i: number) {
    setProfessionIdx(i);
    onProfessionSelect(PROFESSION_INVENTORY_KEY[i] ?? 'lash');
    if (!servicesInitialized) {
      const bucket = PROFESSION_SERVICE_BUCKET[i] ?? 'other';
      setServices(SUGGESTED_SERVICES[lang][bucket].map((svc) => ({ id: nextServiceId(), ...svc })));
    }
  }

  function updateService(id: string, field: 'name' | 'price' | 'duration', value: string) {
    setServicesInitialized(true);
    setServices((prev) =>
      prev.map((svc) => {
        if (svc.id !== id) return svc;
        if (field === 'name') return { ...svc, name: value };
        const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
        return { ...svc, [field]: num };
      }),
    );
  }

  function removeService(id: string) {
    setServicesInitialized(true);
    setServices((prev) => prev.filter((svc) => svc.id !== id));
  }

  function addService() {
    setServicesInitialized(true);
    setServices((prev) => [...prev, { id: nextServiceId(), name: '', price: 0, duration: 30 }]);
  }

  const canAdvance = [
    true,
    professionIdx >= 0,
    true,
    name.trim().length > 0,
    publicName.trim().length > 0,
    true,
    services.length > 0,
  ];

  function next() {
    if (step === TOTAL_STEPS) {
      onFinish({ name: name.trim(), publicName: publicName.trim(), services });
    } else {
      setStep((v) => v + 1);
    }
  }

  return (
    <div style={sx('height:100%; display:flex; flex-direction:column; background:#FFFFFF;')}>
      <div
        style={sx(
          `${SCREEN_PAD_TOP} ${CONTENT_PAD_X} display:flex; flex-direction:column; flex:1; min-height:0; overflow-y:auto; box-sizing:border-box; padding-bottom:32px;`,
        )}
      >
        <div style={sx('font-size:12px; letter-spacing:2px; color:#B98D3E; font-weight:700; text-transform:uppercase;')}>
          {o.step} {step} / {TOTAL_STEPS}
        </div>

        {step === 1 && (
          <>
            <StepHeading title={o.s1.title} subtitle={o.s1.subtitle} />
            <div style={sx('display:flex; flex-direction:column; gap:12px;')}>
              {o.s1.options.map((opt, i) => (
                <OptionRow key={opt.label} label={opt.label} selected={i === langIdx} onClick={() => selectLanguage(i, opt)} />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeading title={o.s4.title} subtitle={o.s4.subtitle} />
            <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
              {o.s4.options.map((opt, i) => (
                <OptionRow key={opt.label} label={opt.label} selected={i === professionIdx} onClick={() => selectProfession(i)} compact />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <StepHeading title={o.s3.title} subtitle={o.s3.subtitle} />
            <div style={sx('display:flex; flex-direction:column; gap:12px;')}>
              {o.s3.options.map((opt, i) => (
                <OptionRow key={opt.label} label={opt.label} selected={i === currencyIdx} onClick={() => setCurrencyIdx(i)} />
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <StepHeading title={s.onboardingName.title} subtitle={s.onboardingName.subtitle} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={s.onboardingName.placeholder} style={inputStyle} />
            {name.trim() && (
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; color:#8A6A2E; margin-top:18px;")}>
                {s.onboardingName.greetingPreview} {name.trim()}.
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <StepHeading title={s.onboardingPublicName.title} subtitle={s.onboardingPublicName.subtitle} />
            <input value={publicName} onChange={(e) => setPublicName(e.target.value)} placeholder={s.onboardingPublicName.placeholder} style={inputStyle} />
            {publicName.trim() && (
              <div style={sx('margin-top:16px; padding:12px 14px; background:#F6EFE1; border-radius:12px;')}>
                <span style={sx('font-size:13px; color:#8A6A2E; font-weight:600;')}>
                  {s.onboardingPublicName.linkPrefix}
                  {slugify(publicName)}
                </span>
              </div>
            )}
          </>
        )}

        {step === 6 && (
          <>
            <StepHeading title={o.s5.title} subtitle={o.s5.subtitle} />
            <div style={sx('text-align:center; padding:28px 0;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:600; color:#201C17;")}>{o.s5.amount}</div>
              <div style={sx('font-size:13px; color:#8A8074; margin-top:6px;')}>{o.s5.perMonth}</div>
            </div>
            <div style={sx('height:6px; border-radius:999px; background:#F0E6D2; margin:8px 0 30px; overflow:hidden;')}>
              <div style={sx('width:62%; height:100%; background:#B98D3E;')} />
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <StepHeading title={s.onboardingServices.title} subtitle={s.onboardingServices.subtitle} />
            <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
              {services.map((svc) => (
                <div key={svc.id} style={sx('border:1px solid #EBE2CF; border-radius:14px; padding:12px; background:#FBF8F2;')}>
                  <div style={sx('display:flex; align-items:center; justify-content:space-between; gap:8px;')}>
                    <input
                      value={svc.name}
                      onChange={(e) => updateService(svc.id, 'name', e.target.value)}
                      placeholder={s.onboardingServices.namePlaceholder}
                      style={sx("border:none; background:transparent; font-family:'Manrope',sans-serif; font-weight:700; font-size:14px; color:#201C17; outline:none; width:100%;")}
                    />
                    <svg
                      onClick={() => removeService(svc.id)}
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="#8A8074"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      style={{ cursor: 'pointer', flexShrink: 0 }}
                    >
                      <path d="M1 1l12 12M13 1 1 13"></path>
                    </svg>
                  </div>
                  <div style={sx('display:flex; gap:10px; margin-top:8px;')}>
                    <input
                      value={svc.price || ''}
                      onChange={(e) => updateService(svc.id, 'price', e.target.value)}
                      placeholder={s.onboardingServices.pricePlaceholder}
                      inputMode="numeric"
                      style={sx(
                        "flex:1; min-width:0; width:100%; box-sizing:border-box; border:1px solid #EBE2CF; border-radius:8px; padding:6px 10px; font-family:'Manrope',sans-serif; font-weight:600; font-size:13px; outline:none;",
                      )}
                    />
                    <input
                      value={svc.duration || ''}
                      onChange={(e) => updateService(svc.id, 'duration', e.target.value)}
                      placeholder={`${s.onboardingServices.durationPlaceholder} (${s.onboardingServices.durationSuffix})`}
                      inputMode="numeric"
                      style={sx(
                        "flex:1; min-width:0; width:100%; box-sizing:border-box; border:1px solid #EBE2CF; border-radius:8px; padding:6px 10px; font-family:'Manrope',sans-serif; font-weight:600; font-size:13px; outline:none;",
                      )}
                    />
                  </div>
                </div>
              ))}
              <div
                onClick={addService}
                style={sx(
                  'cursor:pointer; text-align:center; padding:12px; border:1.5px dashed #E3C989; border-radius:14px; color:#8A6A2E; font-weight:700; font-size:13px;',
                )}
              >
                + {s.onboardingServices.addCta}
              </div>
            </div>
          </>
        )}

        <div style={sx('flex:1;')} />

        <div style={sx('display:flex; gap:10px; margin-top:24px;')}>
          {step > 1 && (
            <div
              onClick={() => setStep((v) => v - 1)}
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
            onClick={() => canAdvance[step - 1] && next()}
            data-testid="onboarding-next"
            style={{
              ...sx('flex:1; height:50px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:600; letter-spacing:0.4px;'),
              cursor: canAdvance[step - 1] ? 'pointer' : 'default',
              background: canAdvance[step - 1] ? '#201C17' : '#EBE2CF',
              color: canAdvance[step - 1] ? '#F4E9D2' : '#B0A78F',
            }}
          >
            {step < TOTAL_STEPS ? o.next : o.finish}
          </div>
        </div>
      </div>
    </div>
  );
}
