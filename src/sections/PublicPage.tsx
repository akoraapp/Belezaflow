import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { Section, DeviceRow } from '../components/Section';
import type { Locale } from '../data/content';

export interface PublicService {
  name: string;
  price: string;
  borderColor: string;
  bg: string;
  btnBg: string;
  btnColor: string;
  btnBorder: string;
  btnLabel: string;
  onClick: () => void;
}

interface PublicPageProps {
  t: Locale;
  publicServices: PublicService[];
  publicCtaLabel: string;
}

export function PublicPage({ t, publicServices, publicCtaLabel }: PublicPageProps) {
  const p = t.publicPage;
  return (
    <Section label={t.sectionLabels.publicPage} heading={p.heading}>
      <DeviceRow>
        <IOSDevice>
          <div style={sx('height:100%; display:flex; flex-direction:column; background:#FAF7F0; overflow:auto;')}>
            <div
              style={sx(
                'padding:74px 24px 30px; box-sizing:border-box; text-align:center; background:radial-gradient(120% 100% at 50% 0%, #2B261F 0%, #201C17 60%, #17130F 100%); color:#F4E9D2; position:relative;',
              )}
            >
              <div style={sx('position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, transparent, #C9A24B, transparent);')} />
              <div style={sx('width:80px; height:80px; border-radius:50%; margin:0 auto 16px; border:2px solid #C9A24B; padding:3px; box-sizing:border-box;')}>
                <div
                  style={sx(
                    'width:100%; height:100%; border-radius:50%; background:repeating-linear-gradient(135deg,#3A342C,#3A342C 6px,#332E27 6px,#332E27 12px); display:flex; align-items:center; justify-content:center; font-size:7px; font-family:monospace; color:#C9A24B; letter-spacing:0.4px;',
                  )}
                >
                  {p.photoLabel}
                </div>
              </div>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; letter-spacing:0.3px;")}>{p.name}</div>
              <div
                style={sx(
                  'display:inline-block; margin-top:8px; padding:5px 14px; border:1px solid #C9A24B; border-radius:999px; font-size:11px; color:#E3C989; font-weight:700; letter-spacing:0.6px; text-transform:uppercase;',
                )}
              >
                {p.role}
              </div>
              <div style={sx('font-size:12px; color:#B7AE9C; margin-top:14px; line-height:1.6; max-width:280px; margin-left:auto; margin-right:auto;')}>{p.bio}</div>
            </div>

            <div style={sx('padding:18px 24px; display:flex; gap:8px; border-bottom:1px solid #EBE2CF; background:#FFFFFF;')}>
              <div style={sx('flex:1; text-align:center; padding:10px 4px; border-radius:12px; background:#FBF6EA;')}>
                <div style={sx('font-size:10px; color:#8A8074; text-transform:uppercase; letter-spacing:0.4px; font-weight:700;')}>Instagram</div>
                <div style={sx('font-size:12px; font-weight:700; margin-top:3px; color:#26221D;')}>{p.instagram}</div>
              </div>
              <div style={sx('flex:1; text-align:center; padding:10px 4px; border-radius:12px; background:#FBF6EA;')}>
                <div style={sx('font-size:10px; color:#8A8074; text-transform:uppercase; letter-spacing:0.4px; font-weight:700;')}>WhatsApp</div>
                <div style={sx('font-size:12px; font-weight:700; margin-top:3px; color:#26221D;')}>{p.whatsapp}</div>
              </div>
              <div style={sx('flex:1; text-align:center; padding:10px 4px; border-radius:12px; background:#FBF6EA;')}>
                <div style={sx('font-size:10px; color:#8A8074; text-transform:uppercase; letter-spacing:0.4px; font-weight:700;')}>{p.locationLabel}</div>
                <div style={sx('font-size:12px; font-weight:700; margin-top:3px; color:#26221D;')}>{p.location}</div>
              </div>
            </div>

            <div style={sx('padding:22px 24px; border-bottom:1px solid #EBE2CF; background:#FFFFFF;')}>
              <div style={sx('font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#B98D3E; margin-bottom:14px;')}>{p.servicesLabel}</div>
              <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
                {publicServices.map((s) => (
                  <div
                    key={s.name}
                    onClick={s.onClick}
                    style={{
                      ...sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; border-radius:14px; transition:all 0.15s ease;'),
                      border: `1.5px solid ${s.borderColor}`,
                      background: s.bg,
                    }}
                  >
                    <div>
                      <div style={sx("font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:600; color:#26221D;")}>{s.name}</div>
                      <div style={sx('font-size:12px; color:#B98D3E; font-weight:700; margin-top:2px;')}>{s.price}</div>
                    </div>
                    <div
                      style={{
                        ...sx('flex-shrink:0; padding:9px 16px; border-radius:999px; font-size:12px; font-weight:700;'),
                        background: s.btnBg,
                        color: s.btnColor,
                        border: `1px solid ${s.btnBorder}`,
                      }}
                    >
                      {s.btnLabel}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={sx('padding:22px 24px; background:#FFFFFF;')}>
              <div style={sx('font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#B98D3E; margin-bottom:14px;')}>{p.portfolioLabel}</div>
              <div style={sx('display:grid; grid-template-columns:repeat(3,1fr); gap:8px;')}>
                {p.portfolio.map((photo, i) => (
                  <div
                    key={i}
                    style={sx(
                      'aspect-ratio:1; border-radius:12px; background:repeating-linear-gradient(135deg,#F0E6D2,#F0E6D2 6px,#EADCC0 6px,#EADCC0 12px); display:flex; align-items:center; justify-content:center; font-size:7px; font-family:monospace; color:#8A6A2E; text-align:center; padding:4px; box-sizing:border-box; border:1px solid #EBE2CF;',
                    )}
                  >
                    {photo}
                  </div>
                ))}
              </div>
            </div>

            <div style={sx('padding:16px 24px 28px; margin-top:auto; background:#FAF7F0; border-top:1px solid #EBE2CF;')}>
              <div
                style={sx(
                  'height:52px; border-radius:999px; background:linear-gradient(90deg,#201C17,#2B261F); color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; letter-spacing:0.3px; box-shadow:0 8px 20px -8px rgba(32,28,23,0.5);',
                )}
              >
                {publicCtaLabel}
              </div>
              <div style={sx('text-align:center; font-size:10px; color:#B0A78F; margin-top:12px; letter-spacing:0.3px;')}>{p.poweredBy}</div>
            </div>
          </div>
        </IOSDevice>
      </DeviceRow>
    </Section>
  );
}
