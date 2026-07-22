import { Plus, X } from 'lucide-react';
import { T, CURRENCIES, RADIUS } from '../theme';
import { BackHeader, MiniField } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { CurrencyCode, Product, ServiceItem } from '../types';

interface ServicosScreenProps {
  services: ServiceItem[];
  setServices: (updater: (prev: ServiceItem[]) => ServiceItem[]) => void;
  products: Product[];
  currency: CurrencyCode;
  onBack: () => void;
}

export function ServicosScreen({ services, setServices, products, currency, onBack }: ServicosScreenProps) {
  const { t } = useLang();
  const updateService = (id: string, field: 'name' | 'price' | 'duration', val: string | number) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const removeService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));
  const addService = () => setServices((prev) => [...prev, { id: `s${Date.now()}`, name: t.onboarding.newServiceDefaultName, price: 0, duration: 0 }]);

  const addConsumable = (serviceId: string, productId: string) =>
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, consumables: [...(s.consumables || []).filter((c) => c.productId !== productId), { productId, qty: 1 }] }
          : s,
      ),
    );
  const updateConsumableQty = (serviceId: string, productId: string, qty: number) =>
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, consumables: (s.consumables || []).map((c) => (c.productId === productId ? { ...c, qty } : c)) } : s)),
    );
  const removeConsumable = (serviceId: string, productId: string) =>
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, consumables: (s.consumables || []).filter((c) => c.productId !== productId) } : s)));

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <BackHeader title={t.servicos.title} onBack={onBack} />
      <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, marginBottom: 16 }}>{t.servicos.hint}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {services.map((s) => {
          const consumables = s.consumables || [];
          const linkedIds = new Set(consumables.map((c) => c.productId));
          const availableToLink = products.filter((p) => !linkedIds.has(p.id));
          return (
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
                <MiniField label={`${t.servicos.valorLabel} (${CURRENCIES[currency].symbol})`} value={s.price} onChange={(v) => updateService(s.id, 'price', v)} />
                <MiniField label={t.servicos.duracaoLabel} value={s.duration} onChange={(v) => updateService(s.id, 'duration', v)} />
              </div>

              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
                <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 4 }}>{t.servicos.consumablesTitle}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginBottom: 8, lineHeight: 1.4 }}>{t.servicos.consumablesHint}</div>

                {consumables.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                    {consumables.map((c) => {
                      const product = products.find((p) => p.id === c.productId);
                      return (
                        <div key={c.productId} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.surfaceAlt, borderRadius: RADIUS.control, padding: '6px 10px' }}>
                          <div style={{ flex: 1, fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: T.ink }}>{product?.name || c.productId}</div>
                          <div style={{ fontFamily: 'Inter', fontSize: 10, color: T.muted }}>{t.servicos.consumableQtyLabel}</div>
                          <input
                            value={c.qty}
                            data-testid={`servicos-consumable-qty-${s.id}-${c.productId}`}
                            onChange={(e) => updateConsumableQty(s.id, c.productId, Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                            style={{
                              width: 40,
                              border: `1px solid ${T.line}`,
                              borderRadius: RADIUS.control,
                              padding: '4px 6px',
                              fontFamily: 'Inter',
                              fontWeight: 700,
                              fontSize: 12,
                              color: T.ink,
                              outline: 'none',
                              textAlign: 'center',
                              background: T.surface,
                            }}
                          />
                          <X size={13} color={T.muted} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => removeConsumable(s.id, c.productId)} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {products.length === 0 ? (
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: T.muted }}>{t.servicos.noProductsToLink}</div>
                ) : (
                  availableToLink.length > 0 && (
                    <select
                      value=""
                      onChange={(e) => e.target.value && addConsumable(s.id, e.target.value)}
                      data-testid={`servicos-add-consumable-${s.id}`}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: RADIUS.control,
                        border: `1.5px dashed ${T.gold}`,
                        background: T.surface,
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        fontSize: 12,
                        color: T.goldDeep,
                        outline: 'none',
                      }}
                    >
                      <option value="" disabled>
                        {t.servicos.addConsumableCta}
                      </option>
                      {availableToLink.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )
                )}
              </div>
            </div>
          );
        })}
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
          <Plus size={15} /> {t.servicos.addServiceCta}
        </button>
      </div>
    </div>
  );
}
