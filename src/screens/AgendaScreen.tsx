import { useState } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';
import type { NewFeatureStrings } from '../data/newFeatures';
import type { ServiceItem } from '../lib/types';

export interface AgendaAppointment {
  id: string;
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
  strings: NewFeatureStrings['agendaAddAppointment'];
  agendaAppointments: AgendaAppointment[];
  services: ServiceItem[];
  availableSlots: string[];
  fmtPrice: (n: number) => string;
  onOpenSetup: () => void;
  onAddAppointment: (data: { clientName: string; service: ServiceItem; time: string }) => void;
}

export function AgendaScreen({ t, strings, agendaAppointments, services, availableSlots, fmtPrice, onOpenSetup, onAddAppointment }: AgendaScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const inputStyle = sx(
    "height:44px; border-radius:10px; border:1px solid #EBE2CF; padding:0 14px; font-size:14px; font-family:'Manrope',sans-serif; box-sizing:border-box; width:100%;",
  );

  function submit() {
    const service = services.find((s) => s.id === serviceId);
    if (!clientName.trim() || !service || !time) return;
    onAddAppointment({ clientName: clientName.trim(), service, time });
    setClientName('');
    setServiceId(null);
    setTime(null);
    setShowForm(false);
  }

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

      <div style={sx(`${CONTENT_PAD_X} box-sizing:border-box; margin-bottom:18px;`)}>
        <div
          onClick={() => setShowForm((v) => !v)}
          data-testid="agenda-add-toggle"
          style={sx(
            'cursor:pointer; height:50px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; gap:8px; font-size:14px; font-weight:700; letter-spacing:0.3px; box-shadow:0 10px 24px -10px rgba(32,28,23,0.45);',
          )}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#F4E9D2" strokeWidth="1.8" strokeLinecap="round">
            <path d="M7.5 1.5v12M1.5 7.5h12"></path>
          </svg>
          {strings.cta}
        </div>

        {showForm && (
          <div style={sx('margin-top:14px; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px; display:flex; flex-direction:column; gap:10px;')}>
            <div style={sx('font-size:13px; font-weight:700; color:#201C17;')}>{strings.formTitle}</div>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={strings.clientPlaceholder} style={inputStyle} />

            <div style={sx('font-size:11px; color:#8A8074; margin-top:2px;')}>{strings.serviceLabel}</div>
            {services.length === 0 ? (
              <div style={sx('font-size:12px; color:#B0A78F;')}>{strings.noServices}</div>
            ) : (
              <div style={sx('display:flex; flex-wrap:wrap; gap:6px;')}>
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setServiceId(svc.id)}
                    style={{
                      ...sx('cursor:pointer; padding:7px 12px; border-radius:999px; font-size:12px; font-weight:600;'),
                      border: `1px solid ${serviceId === svc.id ? '#201C17' : '#EBE2CF'}`,
                      background: serviceId === svc.id ? '#201C17' : '#FFFFFF',
                      color: serviceId === svc.id ? '#F4E9D2' : '#8A8074',
                    }}
                  >
                    {svc.name || strings.serviceLabel} {svc.price ? `· ${fmtPrice(svc.price)}` : ''}
                  </div>
                ))}
              </div>
            )}

            <div style={sx('font-size:11px; color:#8A8074; margin-top:6px;')}>{strings.timeLabel}</div>
            {availableSlots.length === 0 ? (
              <div style={sx('font-size:12px; color:#B0A78F;')}>{strings.noSlots}</div>
            ) : (
              <div style={sx('display:flex; flex-wrap:wrap; gap:6px;')}>
                {availableSlots.map((slot) => (
                  <div
                    key={slot}
                    onClick={() => setTime(slot)}
                    style={{
                      ...sx('cursor:pointer; padding:7px 12px; border-radius:999px; font-size:12px; font-weight:600;'),
                      border: `1px solid ${time === slot ? '#201C17' : '#EBE2CF'}`,
                      background: time === slot ? '#201C17' : '#FFFFFF',
                      color: time === slot ? '#F4E9D2' : '#8A8074',
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={submit}
              data-testid="agenda-add-submit"
              style={sx(
                'cursor:pointer; height:46px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; margin-top:8px;',
              )}
            >
              {strings.submitCta}
            </div>
          </div>
        )}
      </div>

      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:10px;`)}>
        {agendaAppointments.map((ap) => (
          <div key={ap.id} style={sx('display:flex; gap:14px; align-items:stretch;')}>
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
