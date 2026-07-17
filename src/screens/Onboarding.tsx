import { useEffect, useState } from 'react';
import { Check, ChevronLeft, Plus, X } from 'lucide-react';
import { T, CURRENCIES, PROFESSIONS, SUGGESTED_SERVICES } from '../theme';
import { PrimaryButton, TextInput, MiniField, GoalRing } from '../components/primitives';
import type { CurrencyCode, Language, OnboardingResult, ServiceItem } from '../types';

function StepBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'Fraunces', fontSize: 23, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>{title}</div>
      {subtitle && <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.muted, marginTop: 6, marginBottom: 22 }}>{subtitle}</div>}
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
        borderRadius: 14,
        cursor: 'pointer',
        border: `1.5px solid ${active ? T.gold : T.line}`,
        background: active ? T.goldSoft : T.surface,
      }}
    >
      <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: T.ink }}>{label}</span>
      {active && <Check size={16} color={T.goldDeep} />}
    </div>
  );
}

const LANGUAGES: Language[] = ['Português', 'English', 'Español'];

export function Onboarding({ initialName, onComplete }: { initialName: string; onComplete: (data: OnboardingResult) => void }) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<Language>('Português');
  const [currency, setCurrency] = useState<CurrencyCode>('BRL');
  const [publicName, setPublicName] = useState('');
  const [profession, setProfession] = useState<string | null>(null);
  const [goal, setGoal] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    if (profession) {
      const base = SUGGESTED_SERVICES[profession] || SUGGESTED_SERVICES.other;
      setServices(base.map((s, i) => ({ id: `s${i}`, name: s.name, price: 0, duration: 0 })));
    }
  }, [profession]);

  const totalSteps = 6;
  const canNext = [true, true, publicName.trim().length > 0, !!profession, !!goal && Number(goal) > 0, services.length > 0];

  const updateService = (id: string, field: 'name' | 'price' | 'duration', val: string | number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const removeService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));
  const addService = () => setServices((prev) => [...prev, { id: `s${Date.now()}`, name: 'Novo serviço', price: 0, duration: 0 }]);

  const next = () => {
    if (step === totalSteps - 1) {
      onComplete({ language, currency, name: initialName, publicName, profession: profession!, goal: Number(goal), services });
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
          <StepBlock title="Escolha o idioma" subtitle="Isso irá alterar todos os textos do aplicativo.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LANGUAGES.map((l) => (
                <SelectRow key={l} active={language === l} onClick={() => setLanguage(l)} label={l} testId={`onboarding-lang-${l}`} />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 1 && (
          <StepBlock title="Escolha a moeda" subtitle="Idioma e moeda funcionam de forma independente.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                <SelectRow key={c} active={currency === c} onClick={() => setCurrency(c)} label={`${c}  ${CURRENCIES[c].symbol}`} compact />
              ))}
            </div>
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title="Como deseja aparecer para seus clientes?" subtitle="Usado na página pública, no link da agenda e nos compartilhamentos.">
            <TextInput value={publicName} onChange={setPublicName} placeholder="Studio Glow" testId="onboarding-public-name" />
            {publicName && (
              <div style={{ marginTop: 18, padding: 12, background: T.goldSoft, borderRadius: 12, fontFamily: 'Manrope', fontSize: 13, color: T.goldDeep }}>
                beautyflow.app/agendar/{publicName.toLowerCase().replace(/\s+/g, '')}
              </div>
            )}
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock title="Qual sua profissão?" subtitle="Vamos sugerir serviços prontos para você.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PROFESSIONS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  data-testid={`onboarding-profession-${p.id}`}
                  style={{
                    padding: '18px 10px',
                    borderRadius: 14,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: `1.5px solid ${profession === p.id ? T.gold : T.line}`,
                    background: profession === p.id ? T.goldSoft : T.surface,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      margin: '0 auto 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: profession === p.id ? 'rgba(255,255,255,0.6)' : T.goldSoft,
                    }}
                  >
                    <p.icon size={17} color={T.goldDeep} strokeWidth={1.6} />
                  </div>
                  <div style={{ fontFamily: 'Manrope', fontSize: 12, fontWeight: 600, color: T.ink }}>{p.label}</div>
                </div>
              ))}
            </div>
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock title="Qual sua meta mensal?" subtitle="Essa meta será utilizada em todo o sistema.">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Fraunces', fontSize: 22, color: T.ink }}>{CURRENCIES[currency].symbol}</span>
              <TextInput value={goal} onChange={setGoal} placeholder="0" numeric testId="onboarding-goal" />
            </div>
            {goal && Number(goal) > 0 && (
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                <GoalRing progress={0} size={130} center="a caminho" />
              </div>
            )}
          </StepBlock>
        )}

        {step === 5 && (
          <StepBlock title="Confirme seus serviços e valores" subtitle="Sugerimos os nomes com base na sua profissão — ajuste o valor e a duração que você pratica.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {services.map((s) => (
                <div key={s.id} style={{ border: `1px solid ${T.line}`, borderRadius: 14, padding: 12, background: T.surface }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      value={s.name}
                      onChange={(e) => updateService(s.id, 'name', e.target.value)}
                      style={{ border: 'none', background: 'transparent', fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: T.ink, outline: 'none', width: '70%' }}
                    />
                    <X size={16} color={T.muted} style={{ cursor: 'pointer' }} onClick={() => removeService(s.id)} />
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                    <MiniField label={`Valor (${CURRENCIES[currency].symbol})`} value={s.price} onChange={(v) => updateService(s.id, 'price', v)} />
                    <MiniField label="Duração (min)" value={s.duration} onChange={(v) => updateService(s.id, 'duration', v)} />
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
                  border: `1.5px dashed ${T.gold}`,
                  borderRadius: 14,
                  background: 'transparent',
                  color: T.goldDeep,
                  fontFamily: 'Manrope',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} /> Adicionar serviço
              </button>
            </div>
          </StepBlock>
        )}
      </div>

      <div style={{ padding: 20, display: 'flex', gap: 10, borderTop: `1px solid ${T.line}` }}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{ padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer' }}
          >
            <ChevronLeft size={18} color={T.ink} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <PrimaryButton full onClick={next} disabled={!canNext[step]} testId="onboarding-next">
            {step === totalSteps - 1 ? 'Concluir configuração' : 'Continuar'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
