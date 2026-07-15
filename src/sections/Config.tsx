import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY, PHONE_HEADER } from '../components/Section';
import type { Locale } from '../data/content';

export function Config({ t }: { t: Locale }) {
  const c = t.config;
  return (
    <Section label={t.sectionLabels.settings} heading={c.heading} lastSection>
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx(PHONE_HEADER)}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{c.title}</div>
            </div>
            <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:20px;')}>
              {c.sections.map((sec) => (
                <div key={sec.header}>
                  <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8A8074; font-weight:700; margin-bottom:8px;')}>{sec.header}</div>
                  <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; overflow:hidden;')}>
                    {sec.items.map((it) => (
                      <div key={it.label} style={sx('display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid #F2ECDF;')}>
                        <span style={sx('font-size:14px; font-weight:600;')}>{it.label}</span>
                        <span style={sx('font-size:13px; color:#8A8074;')}>{it.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <TabBar active="mais" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>
    </Section>
  );
}
