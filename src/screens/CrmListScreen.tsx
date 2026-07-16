import { useState } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';
import type { NewFeatureStrings } from '../data/newFeatures';

export interface CrmStage {
  key: string;
  label: string;
  bg: string;
  color: string;
  border: string;
  onClick: () => void;
}

export interface CrmClientWithAttendance {
  id: string;
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

interface NewClientData {
  name: string;
  phone: string;
  service: string;
  birthday: string;
  origin: string;
}

interface CrmListScreenProps {
  t: Locale;
  strings: NewFeatureStrings['crmAddClient'];
  crmStages: CrmStage[];
  crmClientsWithAttendance: CrmClientWithAttendance[];
  attendanceCountLabel: string;
  conversionLabelValue: string;
  attendanceLabels: { yes: string; no: string };
  onOpenProfile: (id: string) => void;
  onAddClient: (data: NewClientData) => void;
}

export function CrmListScreen({
  t,
  strings,
  crmStages,
  crmClientsWithAttendance,
  attendanceCountLabel,
  conversionLabelValue,
  attendanceLabels,
  onOpenProfile,
  onAddClient,
}: CrmListScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [birthday, setBirthday] = useState('');
  const [origin, setOrigin] = useState(strings.origins[0]);

  const inputStyle = sx(
    "height:44px; border-radius:10px; border:1px solid #EBE2CF; padding:0 14px; font-size:14px; font-family:'Manrope',sans-serif; box-sizing:border-box; width:100%;",
  );

  function submit() {
    if (!name.trim()) return;
    onAddClient({ name: name.trim(), phone: phone.trim(), service: service.trim(), birthday: birthday.trim(), origin });
    setName('');
    setPhone('');
    setService('');
    setBirthday('');
    setOrigin(strings.origins[0]);
    setShowForm(false);
  }

  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box;`)}>
        <div style={sx('display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;')}>
          <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{t.crm.title}</div>
          <div onClick={() => setShowForm((v) => !v)} style={sx('cursor:pointer; font-size:12px; color:#B98D3E; font-weight:700;')}>
            {strings.cta}
          </div>
        </div>

        {showForm && (
          <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px; margin-bottom:14px; display:flex; flex-direction:column; gap:8px;')}>
            <div style={sx('font-size:13px; font-weight:700; color:#201C17; margin-bottom:2px;')}>{strings.formTitle}</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={strings.namePlaceholder} style={inputStyle} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={strings.phonePlaceholder} style={inputStyle} />
            <input value={service} onChange={(e) => setService(e.target.value)} placeholder={strings.servicePlaceholder} style={inputStyle} />
            <input value={birthday} onChange={(e) => setBirthday(e.target.value)} placeholder={strings.birthdayPlaceholder} style={inputStyle} />
            <div style={sx('font-size:11px; color:#8A8074; margin-top:4px;')}>{strings.originLabel}</div>
            <div style={sx('display:flex; flex-wrap:wrap; gap:6px;')}>
              {strings.origins.map((o) => (
                <div
                  key={o}
                  onClick={() => setOrigin(o)}
                  style={{
                    ...sx('cursor:pointer; padding:6px 12px; border-radius:999px; font-size:12px; font-weight:600;'),
                    border: `1px solid ${origin === o ? '#201C17' : '#EBE2CF'}`,
                    background: origin === o ? '#201C17' : '#FFFFFF',
                    color: origin === o ? '#F4E9D2' : '#8A8074',
                  }}
                >
                  {o}
                </div>
              ))}
            </div>
            <div
              onClick={submit}
              data-testid="crm-add-client-submit"
              style={sx(
                'cursor:pointer; height:44px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; margin-top:6px;',
              )}
            >
              {strings.submitCta}
            </div>
          </div>
        )}

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
          <div key={c.id} style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
            <div onClick={() => onOpenProfile(c.id)} style={sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between;')}>
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
