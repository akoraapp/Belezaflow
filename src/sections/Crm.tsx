import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { ChromeWindow } from '../components/ChromeWindow';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY, PHONE_HEADER, LABEL_KICKER } from '../components/Section';
import type { Locale } from '../data/content';

export interface CrmStage {
  key: string;
  label: string;
  bg: string;
  color: string;
  border: string;
  onClick: () => void;
}

export interface CrmClientWithAttendance {
  initial: string;
  name: string;
  tag: string;
  value: string;
  showAttendanceButtons: boolean;
  yesBg: string;
  yesColor: string;
  yesBorder: string;
  noBg: string;
  noColor: string;
  noBorder: string;
  markYes: () => void;
  markNo: () => void;
}

interface CrmProps {
  t: Locale;
  crmStages: CrmStage[];
  crmClientsWithAttendance: CrmClientWithAttendance[];
  attendanceCountLabel: string;
  conversionLabelValue: string;
  attendanceLabels: { yes: string; no: string };
}

export function Crm({ t, crmStages, crmClientsWithAttendance, attendanceCountLabel, conversionLabelValue, attendanceLabels }: CrmProps) {
  return (
    <Section label={t.sectionLabels.crm} heading={t.crm.heading}>
      <DeviceRow style={{ alignItems: 'flex-start' }}>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx(PHONE_HEADER)}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; margin-bottom:14px;")}>{t.crm.title}</div>
              <div style={sx('display:flex; gap:6px; overflow-x:auto; margin-bottom:12px; padding-bottom:2px;')}>
                {crmStages.map((stg) => (
                  <div
                    key={stg.key}
                    onClick={stg.onClick}
                    style={{
                      ...sx('cursor:pointer; flex-shrink:0; padding:7px 14px; border-radius:999px; font-size:12px; font-weight:700; white-space:nowrap;'),
                      border: `1px solid ${stg.border}`,
                      background: stg.bg,
                      color: stg.color,
                    }}
                  >
                    {stg.label}
                  </div>
                ))}
              </div>
              <div style={sx('height:44px; border-radius:12px; background:#FFFFFF; border:1px solid #EBE2CF; display:flex; align-items:center; padding:0 16px; font-size:14px; color:#B0A78F; margin-bottom:12px;')}>
                {t.crm.searchPlaceholder}
              </div>
              <div style={sx('background:#201C17; border-radius:14px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; color:#F4E9D2;')}>
                <div>
                  <div style={sx('font-size:10px; letter-spacing:0.8px; text-transform:uppercase; color:#C9A24B; font-weight:700;')}>{t.crm.attendanceLabel}</div>
                  <div style={sx('font-size:11px; color:#B7AE9C; margin-top:2px;')}>{attendanceCountLabel}</div>
                </div>
                <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600;")}>{conversionLabelValue}</div>
              </div>
            </div>
            <div style={sx('flex:1; overflow:auto; padding:12px 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:10px;')}>
              {crmClientsWithAttendance.map((c) => (
                <div key={c.name} style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                  <div style={sx('display:flex; align-items:center; justify-content:space-between;')}>
                    <div style={sx('display:flex; align-items:center; gap:12px;')}>
                      <div style={sx("width:38px; height:38px; border-radius:50%; background:#F0E6D2; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-weight:600; color:#8A6A2E;")}>
                        {c.initial}
                      </div>
                      <div>
                        <div style={sx('font-size:15px; font-weight:700;')}>{c.name}</div>
                        <div style={sx('font-size:12px; color:#8A8074; margin-top:2px;')}>{c.tag}</div>
                      </div>
                    </div>
                    <div style={sx('font-size:13px; color:#B98D3E; font-weight:700;')}>{c.value}</div>
                  </div>
                  {c.showAttendanceButtons && (
                    <div style={sx('display:flex; gap:8px; margin-top:12px; padding-top:12px; border-top:1px solid #F2ECDF;')}>
                      <div
                        onClick={c.markYes}
                        style={{
                          ...sx('cursor:pointer; flex:1; text-align:center; padding:8px 0; border-radius:999px; font-size:12px; font-weight:700;'),
                          background: c.yesBg,
                          color: c.yesColor,
                          border: `1px solid ${c.yesBorder}`,
                        }}
                      >
                        {attendanceLabels.yes}
                      </div>
                      <div
                        onClick={c.markNo}
                        style={{
                          ...sx('cursor:pointer; flex:1; text-align:center; padding:8px 0; border-radius:999px; font-size:12px; font-weight:700;'),
                          background: c.noBg,
                          color: c.noColor,
                          border: `1px solid ${c.noBorder}`,
                        }}
                      >
                        {attendanceLabels.no}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <TabBar active="crm" t={t} />
          </div>
        </IOSDevice>

        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx('padding:70px 24px 20px; box-sizing:border-box; text-align:center;')}>
              <div style={sx("width:64px; height:64px; border-radius:50%; background:#F0E6D2; margin:0 auto 14px; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:#8A6A2E;")}>
                {t.crm.profile.initial}
              </div>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600;")}>{t.crm.profile.name}</div>
              <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{t.crm.profile.since}</div>
            </div>
            <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:16px;')}>
              <div style={sx('display:flex; gap:10px;')}>
                <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:14px; text-align:center;')}>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600;")}>{t.crm.profile.totalSpent}</div>
                  <div style={sx('font-size:11px; color:#8A8074; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;')}>
                    {t.crm.profile.totalSpentLabel}
                  </div>
                </div>
                <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:14px; text-align:center;')}>
                  <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600;")}>{t.crm.profile.visits}</div>
                  <div style={sx('font-size:11px; color:#8A8074; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;')}>
                    {t.crm.profile.visitsLabel}
                  </div>
                </div>
              </div>
              <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:18px;')}>
                <div style={sx(LABEL_KICKER)}>{t.crm.profile.tagsLabel}</div>
                <div style={sx('display:flex; flex-wrap:wrap; gap:8px;')}>
                  {t.crm.profile.tags.map((tag) => (
                    <div key={tag} style={sx('font-size:12px; padding:6px 12px; border-radius:999px; background:#F6EFE1; color:#8A6A2E; font-weight:600;')}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div style={sx('background:#201C17; border-radius:16px; padding:18px; color:#F4E9D2;')}>
                <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#C9A24B; margin-bottom:8px;')}>
                  {t.crm.profile.nextApptLabel}
                </div>
                <div style={sx('font-size:15px; font-weight:600;')}>{t.crm.profile.nextAppt}</div>
              </div>
            </div>
            <TabBar active="crm" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>

      <div style={sx('margin-top:28px;')}>
        <ChromeWindow width={1120} height={660} url={t.crm.desktopUrl}>
          <div style={sx("display:flex; height:100%; font-family:'Manrope',sans-serif; background:#FBF8F2;")}>
            <div style={sx('width:220px; background:#201C17; padding:28px 20px; box-sizing:border-box; display:flex; flex-direction:column; gap:4px;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; color:#F4E9D2; font-weight:600; margin-bottom:24px;")}>{t.brand.name}</div>
              {t.desktopNav.map((n) => (
                <div key={n.label} style={{ ...sx('padding:10px 12px; border-radius:8px; font-size:13px; font-weight:600;'), color: n.color, background: n.bg }}>
                  {n.label}
                </div>
              ))}
            </div>
            <div style={sx('flex:1; padding:32px 36px; overflow:auto; box-sizing:border-box;')}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; margin-bottom:20px;")}>{t.crm.title}</div>
              <div style={sx('display:flex; flex-direction:column; gap:1px; background:#EBE2CF; border-radius:14px; overflow:hidden; border:1px solid #EBE2CF;')}>
                <div style={sx('display:grid; grid-template-columns:2fr 1.4fr 1fr 1fr; background:#F6EFE1; padding:12px 20px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#8A8074; font-weight:700;')}>
                  <div>{t.crm.colName}</div>
                  <div>{t.crm.colTag}</div>
                  <div>{t.crm.colLast}</div>
                  <div>{t.crm.colValue}</div>
                </div>
                {t.crm.clients.map((c) => (
                  <div key={c.name} style={sx('display:grid; grid-template-columns:2fr 1.4fr 1fr 1fr; background:#FFFFFF; padding:14px 20px; font-size:13px; align-items:center;')}>
                    <div style={sx('font-weight:700;')}>{c.name}</div>
                    <div style={sx('color:#8A8074;')}>{c.tag}</div>
                    <div style={sx('color:#8A8074;')}>{c.lastVisit}</div>
                    <div style={sx('color:#B98D3E; font-weight:700;')}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChromeWindow>
      </div>
    </Section>
  );
}
