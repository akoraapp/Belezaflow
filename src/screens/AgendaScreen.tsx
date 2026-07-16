import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
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

interface AgendaScreenProps {
  t: Locale;
  agendaAppointments: AgendaAppointment[];
  onOpenSetup: () => void;
}

export function AgendaScreen({ t, agendaAppointments, onOpenSetup }: AgendaScreenProps) {
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box; display:flex; align-items:flex-start; justify-content:space-between; gap:12px;`)}>
        <div>
          <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{t.agenda.title}</div>
          <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{t.agenda.dateLabel}</div>
        </div>
        <div
          onClick={onOpenSetup}
          role="button"
          aria-label={t.agendaSetup.title}
          style={sx(
            'cursor:pointer; flex-shrink:0; width:38px; height:38px; border-radius:50%; border:1px solid #EBE2CF; display:flex; align-items:center; justify-content:center;',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8074" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.6-2-3.4-2.4.6a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.3 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-.6-2 3.4L6.6 11a7.7 7.7 0 0 0 0 2l-2 1.6 2 3.4 2.4-.6a7.6 7.6 0 0 0 1.7 1L11 21h4l.3-2.6a7.6 7.6 0 0 0 1.7-1l2.4.6 2-3.4-2-1.6Z"></path>
          </svg>
        </div>
      </div>
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:10px;`)}>
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
    </div>
  );
}
