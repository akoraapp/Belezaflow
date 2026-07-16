import { sx } from '../lib/sx';
import { ScreenHeader } from '../components/ScreenHeader';
import { SCREEN_SCROLL, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';

export function ReportsScreen({ t, onBack }: { t: Locale; onBack: () => void }) {
  const r = t.relatorios;
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <ScreenHeader title={r.title} backLabel={t.tabbar.mais} onBack={onBack} />
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:16px;`)}>
        <div style={sx('display:flex; gap:10px;')}>
          {r.metrics.map((m) => (
            <div key={m.label} style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:14px;')}>
              <div style={sx('font-size:10px; letter-spacing:0.4px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{m.label}</div>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; margin-top:6px;")}>{m.value}</div>
              <div style={sx('font-size:11px; color:#4E7A49; margin-top:2px; font-weight:600;')}>{m.delta}</div>
            </div>
          ))}
        </div>
        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:20px;')}>
          <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:14px;')}>{r.topServicesLabel}</div>
          {r.topServices.map((s) => (
            <div key={s.name} style={sx('margin-bottom:12px;')}>
              <div style={sx('display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;')}>
                <span style={sx('font-weight:600;')}>{s.name}</span>
                <span style={sx('color:#8A8074;')}>{s.pct}</span>
              </div>
              <div style={sx('height:6px; border-radius:999px; background:#F0E6D2; overflow:hidden;')}>
                <div style={{ ...sx('height:100%; border-radius:999px; background:#B98D3E;'), width: s.pct }} />
              </div>
            </div>
          ))}
        </div>
        <div style={sx('background:#F6EFE1; border-radius:16px; padding:18px;')}>
          <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A6A2E; margin-bottom:8px;')}>{r.insightLabel}</div>
          <div style={sx('font-size:13px; color:#6B5A34; line-height:1.5;')}>{r.insight}</div>
        </div>
      </div>
    </div>
  );
}
