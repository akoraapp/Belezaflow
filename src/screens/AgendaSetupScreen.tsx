import { sx } from '../lib/sx';
import { ScreenHeader } from '../components/ScreenHeader';
import { SCREEN_SCROLL, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import { TIME_SLOTS } from '../lib/scheduling';
import type { Locale } from '../data/content';
import type { NewFeatureStrings } from '../data/newFeatures';

interface AgendaSetupScreenProps {
  t: Locale;
  strings: NewFeatureStrings;
  publicLink: string;
  workingDays: number[];
  toggleWorkingDay: (idx: number) => void;
  bookableSlots: string[];
  toggleSlot: (slot: string) => void;
  onBack: () => void;
  onOpenPublicPage: () => void;
}

export function AgendaSetupScreen({
  t,
  strings,
  publicLink,
  workingDays,
  toggleWorkingDay,
  bookableSlots,
  toggleSlot,
  onBack,
  onOpenPublicPage,
}: AgendaSetupScreenProps) {
  const a = t.agendaSetup;
  const s = strings.agendaSetupSlots;
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <ScreenHeader title={a.title} subtitle={a.subtitle} backLabel={t.agenda.title} onBack={onBack} />

      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:14px;`)}>
        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:12px;')}>{a.daysLabel}</div>
          <div style={sx('display:flex; gap:6px;')}>
            {a.days.map((d, i) => {
              const active = workingDays.includes(i);
              return (
                <div
                  key={d.label}
                  onClick={() => toggleWorkingDay(i)}
                  style={{
                    ...sx('cursor:pointer; flex:1; text-align:center; padding:9px 0; border-radius:10px; font-size:11px; font-weight:700;'),
                    background: active ? '#201C17' : '#F2ECDF',
                    color: active ? '#F4E9D2' : '#B0A78F',
                  }}
                >
                  {d.label}
                </div>
              );
            })}
          </div>
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:12px;')}>{s.slotsLabel}</div>
          <div style={sx('display:flex; flex-wrap:wrap; gap:8px;')}>
            {TIME_SLOTS.map((slot) => {
              const active = bookableSlots.includes(slot);
              return (
                <div
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  style={{
                    ...sx('cursor:pointer; padding:8px 14px; border-radius:999px; font-size:12.5px; font-weight:700;'),
                    border: `1.5px solid ${active ? '#E3C989' : '#EBE2CF'}`,
                    background: active ? '#FBF3E4' : '#FFFFFF',
                    color: active ? '#8A6A2E' : '#B0A78F',
                  }}
                >
                  {slot}
                </div>
              );
            })}
          </div>
          <div style={sx('font-size:11px; color:#B0A78F; margin-top:12px; line-height:1.5;')}>{s.hint}</div>
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;')}>{a.servicesLabel}</div>
          {a.services.map((svc) => (
            <div key={svc.name} style={sx('display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-top:1px solid #F2ECDF;')}>
              <span style={sx('font-size:13px; font-weight:600;')}>{svc.name}</span>
              <span style={sx('font-size:12px; color:#8A8074;')}>{svc.duration}</span>
            </div>
          ))}
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:6px;')}>{a.prepLabel}</div>
          <div style={sx('font-size:14px; font-weight:600;')}>{a.prepValue}</div>
        </div>

        <div style={sx('background:#F6EFE1; border-radius:16px; padding:16px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A6A2E; margin-bottom:8px;')}>{a.blockedLabel}</div>
          {a.blocked.map((b) => (
            <div key={b} style={sx('font-size:13px; color:#6B5A34; padding:4px 0;')}>
              {b}
            </div>
          ))}
        </div>

        <div style={sx('background:#201C17; border-radius:16px; padding:18px; color:#F4E9D2;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#C9A24B; margin-bottom:8px;')}>{a.linkLabel}</div>
          <div style={sx('font-size:13px; word-break:break-all; color:#E9DFC8; margin-bottom:12px;')}>{publicLink}</div>
          <div
            style={sx(
              'height:44px; border-radius:999px; background:#F4E9D2; color:#201C17; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700;',
            )}
          >
            {a.generateCta}
          </div>
        </div>

        <div
          onClick={onOpenPublicPage}
          style={sx(
            'cursor:pointer; height:48px; border-radius:999px; border:1px solid #D8C79E; color:#8A6A2E; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700;',
          )}
        >
          {t.sectionLabels.publicPage}
        </div>
      </div>
    </div>
  );
}
