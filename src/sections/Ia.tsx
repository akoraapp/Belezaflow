import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY } from '../components/Section';
import type { Locale } from '../data/content';

export function Ia({ t }: { t: Locale }) {
  const ia = t.ia;
  return (
    <Section label={t.sectionLabels.ai} heading={ia.heading}>
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx('padding:70px 24px 16px; box-sizing:border-box;')}>
              <div style={sx('display:flex; align-items:center; gap:10px;')}>
                <div style={sx('width:34px; height:34px; border-radius:50%; background:#201C17; display:flex; align-items:center; justify-content:center;')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A24B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3.5c.6 3.2 2 4.6 5.2 5.2-3.2.6-4.6 2-5.2 5.2-.6-3.2-2-4.6-5.2-5.2 3.2-.6 4.6-2 5.2-5.2Z"></path>
                    <path d="M18.5 15.5c.3 1.6 1 2.3 2.6 2.6-1.6.3-2.3 1-2.6 2.6-.3-1.6-1-2.3-2.6-2.6 1.6-.3 2.3-1 2.6-2.6Z"></path>
                  </svg>
                </div>
                <div>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600;")}>{ia.title}</div>
                  <div style={sx('font-size:12px; color:#8A8074;')}>{ia.subtitle}</div>
                </div>
              </div>
            </div>
            <div style={sx('flex:1; overflow:auto; padding:0 24px 16px; box-sizing:border-box; display:flex; flex-direction:column; gap:12px;')}>
              {ia.messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.align }}>
                  <div
                    style={{
                      ...sx('max-width:78%; padding:12px 16px; border-radius:16px; font-size:14px; line-height:1.5;'),
                      background: msg.bg,
                      color: msg.color,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={sx('padding:0 24px 14px; box-sizing:border-box; display:flex; gap:8px; flex-wrap:wrap;')}>
              {ia.suggestions.map((sg) => (
                <div key={sg} style={sx('font-size:12px; padding:8px 14px; border-radius:999px; border:1px solid #D8C79E; color:#8A6A2E; font-weight:600;')}>
                  {sg}
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
