import { sx } from '../lib/sx';
import { IOSDevice } from '../components/IOSDevice';
import { TabBar } from '../components/TabBar';
import { Section, DeviceRow, PHONE_BODY, PHONE_HEADER } from '../components/Section';
import type { Locale } from '../data/content';

export interface AgendaAppointment {
  time: string;
  client: string;
  service: string;
  statusColor: string;
  badgeBg: string;
  badgeColor: string;
  statusLabel: string;
}

interface AgendaProps {
  t: Locale;
  agendaAppointments: AgendaAppointment[];
}

export function Agenda({ t, agendaAppointments }: AgendaProps) {
  return (
    <Section label={t.sectionLabels.agenda} heading={t.agenda.heading}>
      <DeviceRow>
        <IOSDevice>
          <div style={sx(PHONE_BODY)}>
            <div style={sx(PHONE_HEADER)}>
              <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{t.agenda.title}</div>
              <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{t.agenda.dateLabel}</div>
            </div>
            <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:10px;')}>
              {agendaAppointments.map((ap) => (
                <div key={ap.time} style={sx('display:flex; gap:14px; align-items:stretch;')}>
                  <div style={sx('width:56px; flex-shrink:0; font-size:13px; color:#8A8074; padding-top:14px; font-weight:600;')}>{ap.time}</div>
                  <div
                    style={{
                      ...sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:14px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px;'),
                      borderLeft: `3px solid ${ap.statusColor}`,
                    }}
                  >
                    <div>
                      <div style={sx('font-size:15px; font-weight:700;')}>{ap.client}</div>
                      <div style={sx('font-size:13px; color:#8A8074; margin-top:2px;')}>{ap.service}</div>
                    </div>
                    <div
                      style={{
                        ...sx('flex-shrink:0; font-size:10px; font-weight:700; padding:5px 10px; border-radius:999px; white-space:nowrap;'),
                        background: ap.badgeBg,
                        color: ap.badgeColor,
                      }}
                    >
                      {ap.statusLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <TabBar active="agenda" t={t} />
          </div>
        </IOSDevice>
      </DeviceRow>
    </Section>
  );
}
