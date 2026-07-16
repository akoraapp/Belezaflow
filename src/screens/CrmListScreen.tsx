import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
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

interface CrmListScreenProps {
  t: Locale;
  crmStages: CrmStage[];
  crmClientsWithAttendance: CrmClientWithAttendance[];
  attendanceCountLabel: string;
  conversionLabelValue: string;
  attendanceLabels: { yes: string; no: string };
  onOpenProfile: (name: string) => void;
}

export function CrmListScreen({
  t,
  crmStages,
  crmClientsWithAttendance,
  attendanceCountLabel,
  conversionLabelValue,
  attendanceLabels,
  onOpenProfile,
}: CrmListScreenProps) {
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box;`)}>
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
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:10px;`)}>
        {crmClientsWithAttendance.map((c) => (
          <div key={c.name} style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
            <div onClick={() => onOpenProfile(c.name)} style={sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between;')}>
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
    </div>
  );
}
