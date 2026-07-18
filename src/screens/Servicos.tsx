import { Plus, X } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { BackHeader, MiniField } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { CurrencyCode, ServiceItem } from '../types';

interface ServicosScreenProps {
  services: ServiceItem[];
  setServices: (updater: (prev: ServiceItem[]) => ServiceItem[]) => void;
  currency: CurrencyCode;
  onBack: () => void;
}

export function ServicosScreen({ services, setServices, currency, onBack }: ServicosScreenProps) {
  const { t } = useLang();
  const updateService = (id: string, field: 'name' | 'price' | 'duration', val: string | number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const removeService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));
  const addService = () => setServices((prev) => [...prev, { id: `s${Date.now()}`, name: t.onboarding.newServiceDefaultName, price: 0, duration: 0 }]);

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <BackHeader title={t.servicos.title} onBack={onBack} />
      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, marginBottom: 16 }}>{t.servicos.hint}</div>
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
              <MiniField label={`${t.servicos.valorLabel} (${CURRENCIES[currency].symbol})`} value={s.price} onChange={(v) => updateService(s.id, 'price', v)} />
              <MiniField label={t.servicos.duracaoLabel} value={s.duration} onChange={(v) => updateService(s.id, 'duration', v)} />
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
          <Plus size={15} /> {t.servicos.addServiceCta}
        </button>
      </div>
    </div>
  );
}
