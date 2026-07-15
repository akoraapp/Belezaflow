import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { ChromeWindow } from '../components/ChromeWindow';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY, PHONE_HEADER } from '../components/Section';
import type { Locale } from '../data/content';

export function Financeiro({ t }: { t: Locale }) {
  const f = t.financeiro;
  return (
    <Section label={t.sectionLabels.financeiro} heading={f.heading}>
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx(PHONE_HEADER)}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{f.title}</div>
            </div>
            <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:16px;')}>
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
            <TabBar active="financeiro" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>

      <div style={sx('margin-top:28px;')}>
        <ChromeWindow width={1120} height={660} url={f.desktopUrl}>
          <div style={sx("display:flex; height:100%; font-family:'Manrope',sans-serif; background:#FBF8F2;")}>
            <div style={sx('width:220px; background:#201C17; padding:28px 20px; box-sizing:border-box; display:flex; flex-direction:column; gap:4px;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; color:#F4E9D2; font-weight:600; margin-bottom:24px;")}>{t.brand.name}</div>
              {t.desktopNavFin.map((n) => (
                <div key={n.label} style={{ ...sx('padding:10px 12px; border-radius:8px; font-size:13px; font-weight:600;'), color: n.color, background: n.bg }}>
                  {n.label}
                </div>
              ))}
            </div>
            <div style={sx('flex:1; padding:32px 36px; overflow:auto; box-sizing:border-box;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; margin-bottom:20px;")}>{f.title}</div>
              <div style={sx('display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:24px;')}>
                <div style={sx('background:#201C17; border-radius:16px; padding:20px; color:#F4E9D2; display:flex; align-items:center; gap:14px;')}>
                  <div style={sx('width:56px; height:56px; border-radius:12px; position:relative; overflow:hidden; background:rgba(244,233,210,0.1); border:1px solid rgba(244,233,210,0.25); flex-shrink:0;')}>
                    <div style={{ ...sx('position:absolute; bottom:0; left:0; right:0; background:#C9A24B;'), height: f.goalPercent }} />
                    <div style={sx('position:absolute; inset:0; display:flex; align-items:center; justify-content:center;')}>
                      <span style={sx("font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:700; color:#201C17;")}>{f.goalPercent}</span>
                    </div>
                  </div>
                  <div>
                    <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#C9A24B; font-weight:700;')}>{f.goalLabel}</div>
                    <div style={sx('font-size:11px; color:#B7AE9C; margin-top:6px; line-height:1.4;')}>{f.goalRemaining}</div>
                  </div>
                </div>
                <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:20px;')}>
                  <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{f.revenueLabel}</div>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; margin-top:8px;")}>{f.revenueValue}</div>
                </div>
                <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:20px;')}>
                  <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{f.avgTicketLabel}</div>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; margin-top:8px;")}>{f.avgTicketValue}</div>
                </div>
              </div>
              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:24px;')}>
                <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:16px;')}>{f.historyLabel}</div>
                <div style={sx('display:flex; align-items:flex-end; gap:16px; height:140px;')}>
                  {f.months.map((m) => (
                    <div key={m.label} style={sx('flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;')}>
                      <div style={{ ...sx('width:100%; border-radius:6px 6px 0 0; background:#E3C989;'), height: m.pct }} />
                      <div style={sx('font-size:11px; color:#8A8074; margin-top:8px;')}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ChromeWindow>
      </div>
    </Section>
  );
}
