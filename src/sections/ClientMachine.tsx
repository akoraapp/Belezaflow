import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { TabBar } from '../components/TabBar';
import { ClientMachineFlow } from '../components/ClientMachineFlow';
import { Section, DeviceRow, PHONE_BODY, PHONE_HEADER, SCROLL_BODY } from '../components/Section';
import type { Lang, Locale } from '../data/content';

interface ClientMachineProps {
  t: Locale;
  lang: Lang;
  contentPresetObjective: string | null;
}

export function ClientMachine({ t, lang, contentPresetObjective }: ClientMachineProps) {
  return (
    <Section label={t.sectionLabels.clientMachine} heading={t.clientMachine.heading} dataScreenLabel="Máquina de Clientes">
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <ClientMachineFlow t={t} lang={lang} presetObjective={contentPresetObjective} />
            <TabBar active="mais" t={t} />
          </div>
        </IOSDevice>

        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx(PHONE_HEADER)}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; margin-bottom:14px;")}>{t.clientMachine.title}</div>
              <div style={sx('display:flex; gap:8px;')}>
                <div style={sx('padding:8px 16px; border-radius:999px; border:1px solid #EBE2CF; color:#8A8074; font-size:12px; font-weight:700;')}>
                  {t.clientMachine.tabs.contentLabel}
                </div>
                <div style={sx('padding:8px 16px; border-radius:999px; background:#201C17; color:#F4E9D2; font-size:12px; font-weight:700;')}>
                  {t.clientMachine.tabs.funnelLabel}
                </div>
              </div>
            </div>

            <div style={sx(SCROLL_BODY)}>
              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:20px;')}>
                <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:14px;')}>
                  {t.clientMachine.funnel.label}
                </div>
                {t.clientMachine.funnel.steps.map((f) => (
                  <div key={f.label} style={sx('margin-bottom:12px;')}>
                    <div style={sx('display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;')}>
                      <span style={sx('font-weight:600;')}>{f.label}</span>
                      <span style={sx('color:#8A8074;')}>{f.value}</span>
                    </div>
                    <div style={sx('height:6px; border-radius:999px; background:#F0E6D2; overflow:hidden;')}>
                      <div style={{ ...sx('height:100%; border-radius:999px; background:#B98D3E;'), width: f.pct }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={sx('background:#201C17; border-radius:20px; padding:20px; color:#F4E9D2;')}>
                <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#C9A24B; margin-bottom:8px;')}>
                  {t.clientMachine.funnel.linkLabel}
                </div>
                <div style={sx('font-size:14px; word-break:break-all; color:#E9DFC8; margin-bottom:14px;')}>{t.clientMachine.funnel.linkUrl}</div>
                <div
                  style={sx(
                    'height:44px; border-radius:999px; background:#F4E9D2; color:#201C17; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700;',
                  )}
                >
                  {t.clientMachine.funnel.cta}
                </div>
              </div>

              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:20px; display:flex; justify-content:space-between; align-items:center;')}>
                <div>
                  <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074;')}>
                    {t.clientMachine.funnel.conversionLabel}
                  </div>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; margin-top:6px;")}>
                    {t.clientMachine.funnel.conversionValue}
                  </div>
                </div>
                <div style={sx('font-size:12px; padding:6px 12px; border-radius:999px; background:#EAF2E7; color:#4E7A49; font-weight:700;')}>
                  {t.clientMachine.funnel.conversionDelta}
                </div>
              </div>
            </div>

            <TabBar active="mais" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>
    </Section>
  );
}
