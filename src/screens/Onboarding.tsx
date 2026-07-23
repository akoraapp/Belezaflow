import { useEffect, useState } from 'react';
import { Check, ChevronLeft, Plus, X } from 'lucide-react';
import { T, CURRENCIES, PROFESSIONS, SUGGESTED_SERVICES, RADIUS } from '../theme';
import { PROFESSION_LABEL, SUGGESTED_SERVICE_LABEL, LANG_OPTIONS } from '../i18n';
import { PrimaryButton, TextInput, MiniField, GoalRing } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { CurrencyCode, Lang, OnboardingResult, ServiceItem } from '../types';

function StepBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 23, fontWeight: 400, color: T.ink, lineHeight: 1.25 }}>{title}</div>
      {subtitle && <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted, marginTop: 6, marginBottom: 22 }}>{subtitle}</div>}
      {!subtitle && <div style={{ marginBottom: 22 }} />}
      {children}
    </div>
  );
}

function SelectRow({ active, onClick, label, compact, testId }: { active: boolean; onClick: () => void; label: string; compact?: boolean; testId?: string }) {
  return (
    <div
      onClick={onClick}
      data-testid={testId}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: compact ? '13px 14px' : '16px 16px',
        borderRadius: RADIUS.control,
        cursor: 'pointer',
        border: `1.5px solid ${active ? T.gold : T.line}`,
        background: active ? `linear-gradient(135deg, ${T.goldLight}, ${T.goldDeep})` : T.surface,
      }}
    >
      <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: active ? '#fff' : T.ink }}>{label}</span>
      {active && <Check size={16} color="#fff" />}
    </div>
  );
}

export function Onboarding({ initialName, onComplete }: { initialName: string; onComplete: (data: OnboardingResult) => void }) {
  const { lang, setLang, t } = useLang();
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>('BRL');
  const [publicName, setPublicName] = useState('');
  const [profession, setProfession] = useState<string | null>(null);
  const [goal, setGoal] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    if (profession) {
      const base = SUGGESTED_SERVICES[profession] || SUGGESTED_SERVICES.other;
      setServices(base.map((s, i) => ({ id: `s${i}`, name: SUGGESTED_SERVICE_LABEL[lang][s.key] || s.key, price: s.price, duration: s.duration })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profession]);

  const totalSteps = 6;
  const canNext = [true, true, publicName.trim().length > 0, !!profession, !!goal && Number(goal) > 0, services.length > 0];

  const updateService = (id: string, field: 'name' | 'price' | 'duration', val: string | number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const removeService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));
  const addService = () => setServices((prev) => [...prev, { id: `s${Date.now()}`, name: t.onboarding.newServiceDefaultName, price: 0, duration: 0 }]);

  const next = () => {
    if (step === totalSteps - 1) {
      onComplete({ language: lang, currency, name: initialName, publicName, profession: profession!, goal: Number(goal), services });
    } else setStep((s) => s + 1);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? T.gold : T.line }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 22px' }}>
        {step === 0 && (
          <StepBlock title={t.onboarding.stepIdiomaTitle} subtitle={t.onboarding.stepIdiomaSubtitle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LANG_OPTIONS.map((opt) => (
                <SelectRow key={opt.code} active={lang === opt.code} onClick={() => setLang(opt.code as Lang)} label={opt.label} testId={`onboarding-lang-${opt.code}`} />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 1 && (
          <StepBlock title={t.onboarding.stepMoedaTitle} subtitle={t.onboarding.stepMoedaSubtitle}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                <SelectRow key={c} active={currency === c} onClick={() => setCurrency(c)} label={`${c}  ${CURRENCIES[c].symbol}`} compact />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title={t.onboarding.stepPublicNameTitle} subtitle={t.onboarding.stepPublicNameSubtitle}>
            <TextInput value={publicName} onChange={setPublicName} placeholder={t.onboarding.publicNamePlaceholder} testId="onboarding-public-name" />
            {publicName && (
              <div style={{ marginTop: 18, padding: 12, background: T.surface, border: `1px solid ${T.gold}`, borderRadius: RADIUS.control, fontFamily: 'Inter', fontSize: 13, color: T.goldDeep }}>
                {t.onboarding.publicLinkPrefix}
                {publicName.toLowerCase().replace(/\s+/g, '')}
              </div>
            )}
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock title={t.onboarding.stepProfessionTitle} subtitle={t.onboarding.stepProfessionSubtitle}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PROFESSIONS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  data-testid={`onboarding-profession-${p.id}`}
                  style={{
                    padding: '18px 10px',
                    borderRadius: RADIUS.control,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: `1.5px solid ${profession === p.id ? T.gold : T.line}`,
                    background: profession === p.id ? `linear-gradient(135deg, ${T.goldLight}, ${T.goldDeep})` : T.surface,
                  }}
                >
                  <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: profession === p.id ? '#fff' : T.ink }}>
                    {PROFESSION_LABEL[lang][p.id]}
                  </div>
                </div>
              ))}
            </div>
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock title={t.onboarding.stepGoalTitle} subtitle={t.onboarding.stepGoalSubtitle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Playfair Display', fontSize: 22, color: T.ink }}>{CURRENCIES[currency].symbol}</span>
              <TextInput value={goal} onChange={setGoal} placeholder="0" numeric testId="onboarding-goal" />
            </div>
            {goal && Number(goal) > 0 && (
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                <GoalRing progress={0} size={130} center={t.onboarding.goalRingCenter} />
              </div>
            )}
          </StepBlock>
        )}

        {step === 5 && (
          <StepBlock title={t.onboarding.stepServicesTitle} subtitle={t.onboarding.stepServicesSubtitle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {services.map((s) => (
                <div key={s.id} style={{ border: `1px solid ${T.line}`, borderRadius: RADIUS.control, padding: 12, background: T.surface }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      value={s.name}
                      onChange={(e) => updateService(s.id, 'name', e.target.value)}
                      style={{ border: 'none', background: 'transparent', fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: T.ink, outline: 'none', width: '70%' }}
                    />
                    <X size={16} color={T.muted} style={{ cursor: 'pointer' }} onClick={() => removeService(s.id)} />
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                    <MiniField label={`${t.onboarding.valorLabel} (${CURRENCIES[currency].symbol})`} value={s.price} onChange={(v) => updateService(s.id, 'price', v)} />
                    <MiniField label={t.onboarding.duracaoLabel} value={s.duration} onChange={(v) => updateService(s.id, 'duration', v)} />
                  </div>
                </div>
              ))}
              <button
                onClick={addService}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  justifyContent: 'center',
                  padding: 12,
                  border: 'none',
                  borderRadius: RADIUS.control,
                  background: T.goldDeep,
                  color: '#fff',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} /> {t.onboarding.addServiceCta}
              </button>
            </div>
          </StepBlock>
        )}
      </div>

      <div style={{ padding: 20, display: 'flex', gap: 10, borderTop: `1px solid ${T.line}` }}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{ padding: '14px 16px', borderRadius: RADIUS.control, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer' }}
          >
            <ChevronLeft size={18} color={T.ink} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <PrimaryButton full onClick={next} disabled={!canNext[step]} testId="onboarding-next">
            {step === totalSteps - 1 ? t.onboarding.finishCta : t.onboarding.continueCta}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
