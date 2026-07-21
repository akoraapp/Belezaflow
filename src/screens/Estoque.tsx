import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { T } from '../theme';
import { Card, TextInput, EmptyHint, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { Product } from '../types';

interface EstoqueScreenProps {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
}

function productStatus(p: Product): 'ok' | 'low' | 'out' {
  if (p.qty <= 0) return 'out';
  if (p.qty <= p.minQty) return 'low';
  return 'ok';
}

export function EstoqueScreen({ products, addProduct, updateProduct, removeProduct }: EstoqueScreenProps) {
  const { t } = useLang();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [minQty, setMinQty] = useState('');

  const submit = () => {
    if (!name) return;
    addProduct({ name, qty: Number(qty) || 0, minQty: Number(minQty) || 0 });
    setName('');
    setQty('');
    setMinQty('');
    setShowAdd(false);
  };

  const statusMeta = {
    ok: { label: t.estoque.statusOk, bg: '#E7EFE3', color: T.success },
    low: { label: t.estoque.statusLow, bg: T.goldSoft, color: T.goldDeep },
    out: { label: t.estoque.statusOut, bg: '#F4E1DD', color: T.danger },
  };

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 25, fontWeight: 600, color: T.ink }}>{t.estoque.title}</div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          data-testid="estoque-add-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 999,
            border: 'none',
            background: T.ink,
            color: '#fff',
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            boxShadow: '0 6px 16px -6px rgba(32,28,23,0.35)',
          }}
        >
          <Plus size={15} /> {t.estoque.addProductCta}
        </button>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{t.estoque.newProductFormTitle}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextInput value={name} onChange={setName} placeholder={t.estoque.productNamePlaceholder} testId="estoque-name" />
            <div style={{ display: 'flex', gap: 8 }}>
              <TextInput value={qty} onChange={setQty} placeholder={t.estoque.qtyLabel} numeric testId="estoque-qty" />
              <TextInput value={minQty} onChange={setMinQty} placeholder={t.estoque.minQtyLabel} numeric testId="estoque-min-qty" />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <PrimaryButton full onClick={submit} disabled={!name} testId="estoque-add-submit">
              {t.estoque.saveCta}
            </PrimaryButton>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.length === 0 && <EmptyHint text={t.estoque.noProducts} />}
        {products.map((p) => {
          const status = productStatus(p);
          const meta = statusMeta[status];
          return (
            <Card key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: T.ink }}>{p.name}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted, marginTop: 2 }}>
                  {p.qty} {t.estoque.unitsSuffix} · {t.estoque.minQtyLabel.toLowerCase()}: {p.minQty}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={() => updateProduct(p.id, { qty: Math.max(0, p.qty - 1) })}
                    style={{ width: 24, height: 24, borderRadius: 8, border: `1px solid ${T.line}`, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 700, color: T.ink }}
                  >
                    −
                  </button>
                  <button
                    onClick={() => updateProduct(p.id, { qty: p.qty + 1 })}
                    style={{ width: 24, height: 24, borderRadius: 8, border: `1px solid ${T.line}`, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 700, color: T.ink }}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 10.5, color: meta.color, padding: '4px 10px', borderRadius: 999, background: meta.bg, whiteSpace: 'nowrap' }}>
                  {meta.label}
                </div>
                <Trash2 size={14} color={T.muted} style={{ cursor: 'pointer' }} onClick={() => removeProduct(p.id)} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { productStatus };
