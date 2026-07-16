import { useState } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';
import type { NewFeatureStrings } from '../data/newFeatures';
import type { FinanceEntry } from '../lib/types';

interface FinanceScreenProps {
  t: Locale;
  strings: NewFeatureStrings['finance'];
  entries: FinanceEntry[];
  fmtPrice: (n: number) => string;
  onAddEntry: (entry: { tipo: 'receber' | 'pagar'; label: string; value: number; dueDate: string }) => void;
  onRemoveEntry: (id: string) => void;
}

export function FinanceScreen({ t, strings, entries, fmtPrice, onAddEntry, onRemoveEntry }: FinanceScreenProps) {
  const f = t.financeiro;
  const s = strings;
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<'receber' | 'pagar'>('receber');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');

  const totalReceivable = entries.filter((e) => e.tipo === 'receber').reduce((sum, e) => sum + e.value, 0);
  const totalPayable = entries.filter((e) => e.tipo === 'pagar').reduce((sum, e) => sum + e.value, 0);

  function submit() {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!label.trim() || !num) return;
    onAddEntry({ tipo, label: label.trim(), value: num, dueDate: dueDate.trim() || '—' });
    setLabel('');
    setValue('');
    setDueDate('');
    setShowForm(false);
  }

  const inputStyle = sx(
    "height:44px; border-radius:10px; border:1px solid #EBE2CF; padding:0 14px; font-size:14px; font-family:'Manrope',sans-serif; box-sizing:border-box; width:100%;",
  );

  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box;`)}>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{f.title}</div>
      </div>
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:16px;`)}>
        <div style={sx('background:#201C17; border-radius:20px; padding:22px; color:#F4E9D2; display:flex; align-items:center; gap:18px;')}>
          <div style={sx('width:76px; height:76px; border-radius:16px; position:relative; overflow:hidden; background:rgba(244,233,210,0.1); border:1px solid rgba(244,233,210,0.25); flex-shrink:0;')}>
            <div style={{ ...sx('position:absolute; bottom:0; left:0; right:0; background:#C9A24B;'), height: f.goalPercent }} />
            <div style={sx('position:absolute; inset:0; display:flex; align-items:center; justify-content:center;')}>
              <span style={sx("font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:700; color:#201C17;")}>{f.goalPercent}</span>
            </div>
          </div>
          <div>
            <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#C9A24B; font-weight:700;')}>{f.goalLabel}</div>
            <div style={sx('font-size:13px; color:#B7AE9C; margin-top:8px; line-height:1.45;')}>{f.goalRemaining}</div>
          </div>
        </div>

        <div style={sx('display:flex; gap:10px;')}>
          <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
            <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{f.revenueLabel}</div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; margin-top:6px;")}>{f.revenueValue}</div>
          </div>
          <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
            <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{f.avgTicketLabel}</div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; margin-top:6px;")}>{f.avgTicketValue}</div>
          </div>
        </div>

        <div style={sx('display:flex; gap:10px;')}>
          <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
            <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#4E7A49; font-weight:700;')}>{s.totalReceivable}</div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; margin-top:6px; color:#4E7A49;")}>{fmtPrice(totalReceivable)}</div>
          </div>
          <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
            <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A4A3E; font-weight:700;')}>{s.totalPayable}</div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; margin-top:6px; color:#8A4A3E;")}>{fmtPrice(totalPayable)}</div>
          </div>
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:20px;')}>
          <div style={sx('display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;')}>
            <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074;')}>{s.ledgerLabel}</div>
            <div onClick={() => setShowForm((v) => !v)} style={sx('cursor:pointer; font-size:12px; color:#B98D3E; font-weight:700;')}>
              + {s.addCta}
            </div>
          </div>

          {showForm && (
            <div style={sx('display:flex; flex-direction:column; gap:8px; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid #F2ECDF;')}>
              <div style={sx('display:flex; gap:8px;')}>
                <div
                  onClick={() => setTipo('receber')}
                  style={{
                    ...sx('cursor:pointer; flex:1; text-align:center; padding:8px 0; border-radius:999px; font-size:12px; font-weight:700;'),
                    background: tipo === 'receber' ? '#201C17' : '#F6EFE1',
                    color: tipo === 'receber' ? '#F4E9D2' : '#8A6A2E',
                  }}
                >
                  {s.receivable}
                </div>
                <div
                  onClick={() => setTipo('pagar')}
                  style={{
                    ...sx('cursor:pointer; flex:1; text-align:center; padding:8px 0; border-radius:999px; font-size:12px; font-weight:700;'),
                    background: tipo === 'pagar' ? '#201C17' : '#F6EFE1',
                    color: tipo === 'pagar' ? '#F4E9D2' : '#8A6A2E',
                  }}
                >
                  {s.payable}
                </div>
              </div>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={s.labelPlaceholder} style={inputStyle} />
              <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={s.valuePlaceholder} inputMode="numeric" style={inputStyle} />
              <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder={s.dueDatePlaceholder} style={inputStyle} />
              <div
                onClick={submit}
                data-testid="finance-add-entry-submit"
                style={sx(
                  'cursor:pointer; height:44px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; margin-top:4px;',
                )}
              >
                {s.addCta}
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div style={sx('font-size:13px; color:#B0A78F;')}>{s.noEntries}</div>
          ) : (
            <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
              {entries.map((e) => (
                <div key={e.id} style={sx('display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-top:1px solid #F2ECDF;')}>
                  <div>
                    <div style={sx('font-size:13px; font-weight:700; color:#201C17;')}>{e.label}</div>
                    <div style={sx('font-size:11px; color:#8A8074; margin-top:2px;')}>{e.dueDate}</div>
                  </div>
                  <div style={sx('display:flex; align-items:center; gap:10px;')}>
                    <div style={{ ...sx('font-size:13px; font-weight:700;'), color: e.tipo === 'receber' ? '#4E7A49' : '#8A4A3E' }}>
                      {e.tipo === 'receber' ? '+' : '-'}
                      {fmtPrice(e.value)}
                    </div>
                    <svg
                      onClick={() => onRemoveEntry(e.id)}
                      width="13"
                      height="13"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="#B0A78F"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      style={{ cursor: 'pointer', flexShrink: 0 }}
                    >
                      <path d="M1 1l12 12M13 1 1 13"></path>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:20px;')}>
          <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:14px;')}>{f.historyLabel}</div>
          <div style={sx('display:flex; align-items:flex-end; gap:10px; height:90px;')}>
            {f.months.map((m) => (
              <div key={m.label} style={sx('flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;')}>
                <div style={{ ...sx('width:100%; border-radius:5px 5px 0 0; background:#E3C989;'), height: m.pct }} />
                <div style={sx('font-size:10px; color:#8A8074; margin-top:6px;')}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={sx('font-size:12px; color:#8A8074; text-align:center;')}>{f.currencyNote}</div>
      </div>
    </div>
  );
}
