import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY, PHONE_HEADER, LABEL_KICKER } from '../components/Section';
import type { Locale } from '../data/content';

export function AgendaSetup({ t }: { t: Locale }) {
  const a = t.agendaSetup;
  return (
    <Section label={t.sectionLabels.agendaSetup} heading={a.heading}>
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx(PHONE_HEADER)}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600;")}>{a.title}</div>
              <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{a.subtitle}</div>
            </div>

            <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:14px;')}>
              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:12px;')}>{a.daysLabel}</div>
                <div style={sx('display:flex; gap:6px;')}>
                  {a.days.map((d) => (
                    <div
                      key={d.label}
                      style={{ ...sx('flex:1; text-align:center; padding:9px 0; border-radius:10px; font-size:11px; font-weight:700;'), background: d.bg, color: d.color }}
                    >
                      {d.label}
                    </div>
                  ))}
                </div>
              </div>

              <div style={sx('display:flex; gap:10px;')}>
                <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                  <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{a.hoursLabel}</div>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; margin-top:6px;")}>{a.hoursValue}</div>
                </div>
                <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                  <div style={sx('font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#8A8074; font-weight:700;')}>{a.intervalLabel}</div>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; margin-top:6px;")}>{a.intervalValue}</div>
                </div>
              </div>

              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                <div style={sx(LABEL_KICKER)}>{a.servicesLabel}</div>
                {a.services.map((s) => (
                  <div key={s.name} style={sx('display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-top:1px solid #F2ECDF;')}>
                    <span style={sx('font-size:13px; font-weight:600;')}>{s.name}</span>
                    <span style={sx('font-size:12px; color:#8A8074;')}>{s.duration}</span>
                  </div>
                ))}
              </div>

              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:6px;')}>{a.prepLabel}</div>
                <div style={sx('font-size:14px; font-weight:600;')}>{a.prepValue}</div>
              </div>

              <div style={sx('background:#F6EFE1; border-radius:16px; padding:16px;')}>
                <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A6A2E; margin-bottom:8px;')}>{a.blockedLabel}</div>
                {a.blocked.map((b) => (
                  <div key={b} style={sx('font-size:13px; color:#6B5A34; padding:4px 0;')}>
                    {b}
                  </div>
                ))}
              </div>

              <div style={sx('background:#201C17; border-radius:16px; padding:18px; color:#F4E9D2;')}>
                <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#C9A24B; margin-bottom:8px;')}>{a.linkLabel}</div>
                <div style={sx('font-size:13px; word-break:break-all; color:#E9DFC8; margin-bottom:12px;')}>{a.linkUrl}</div>
                <div
                  style={sx(
                    'height:44px; border-radius:999px; background:#F4E9D2; color:#201C17; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700;',
                  )}
                >
                  {a.generateCta}
                </div>
              </div>
            </div>

            <TabBar active="agenda" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>
    </Section>
  );
}
