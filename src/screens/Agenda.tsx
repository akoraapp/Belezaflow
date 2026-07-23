import { useState } from 'react';
import { Plus } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { getAvailability, fmtMoney, formatTimeLabel } from '../lib/helpers';
import { Card, Chip, TextInput, EmptyHint, AppointmentRow, PrimaryButton, SectionTitle } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { Appointment, CurrencyCode, Profile, ServiceItem } from '../types';

interface AgendaScreenProps {
  appointments: Appointment[];
  services: ServiceItem[];
  profile: Profile;
  currency: CurrencyCode;
  addAppointment: (a: Appointment) => void;
  embedded?: boolean;
  onMarkAttended?: (appointmentId: string) => void;
  onMarkNoShow?: (appointmentId: string) => void;
}

export function AgendaScreen({ appointments, services, profile, currency, addAppointment, embedded, onMarkAttended, onMarkNoShow }: AgendaScreenProps) {
  const { t, lang } = useLang();
  const [showAdd, setShowAdd] = useState(false);
  const [selService, setSelService] = useState<ServiceItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [time, setTime] = useState<string | null>(null);

  const { today, isWorkingToday, availableSlots } = getAvailability(profile, appointments);

  const submit = () => {
    if (!selService || !clientName || !time) return;
    addAppointment({
      id: `a${Date.now()}`,
      clientName,
      service: selService.name,
      price: Number(selService.price),
      duration: selService.duration,
      time,
      day: 'hoje',
      status: 'Agendado',
      createdAt: Date.now(),
    });
    setShowAdd(false);
    setSelService(null);
    setClientName('');
    setTime(null);
  };

  return (
    <div style={embedded ? undefined : { padding: '22px 20px 100px' }}>
      {!embedded && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 400, color: T.ink }}>{t.agenda.title}</div>
        </div>
      )}
      <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 18 }}>
        {isWorkingToday
          ? `${today.length} ${t.agenda.apptsCountSuffix} · ${availableSlots.length} ${t.agenda.slotsCountSuffix}`
          : t.agenda.notWorkingDayShort}
      </div>

      <div style={{ marginBottom: 16 }}>
        <PrimaryButton full variant="accent" onClick={() => setShowAdd((v) => !v)} icon={Plus} testId="agenda-add-toggle">
          {t.agenda.addApptCta}
        </PrimaryButton>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{t.agenda.newApptFormTitle}</div>
          <TextInput value={clientName} onChange={setClientName} placeholder={t.agenda.clientNamePlaceholder} testId="agenda-client-name" />
          <div style={{ height: 8 }} />
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginBottom: 8 }}>{t.agenda.selectServiceLabel}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {services.length === 0 && <span style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.agenda.noServicesRegistered}</span>}
            {services.map((s) => (
              <Chip key={s.id} active={selService?.id === s.id} onClick={() => setSelService(s)}>
                {s.name}
              </Chip>
            ))}
          </div>
          {selService && (
            <div style={{ marginBottom: 12, fontFamily: 'Inter', fontSize: 12, color: T.goldDeep }}>
              {t.agenda.autoFilledValuePrefix} {fmtMoney(selService.price, currency)} · {selService.duration} min
            </div>
          )}
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginBottom: 8 }}>{t.agenda.availableTodayLabel}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {availableSlots.length === 0 && <span style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.agenda.noSlotsToday}</span>}
            {availableSlots.map((tm) => (
              <Chip key={tm} active={time === tm} onClick={() => setTime(tm)}>
                {formatTimeLabel(tm, lang)}
              </Chip>
            ))}
          </div>
          <PrimaryButton full onClick={submit} disabled={!selService || !clientName || !time} testId="agenda-add-submit">
            {t.agenda.confirmCta}
          </PrimaryButton>
        </Card>
      )}

      <SectionTitle>{t.agenda.todayLabel}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {today.length === 0 && <EmptyHint text={t.agenda.noApptsToday} />}
        {[...today]
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((a) => (
            <AppointmentRow
              key={a.id}
              a={a}
              currency={currency}
              testId={`appt-${a.id}`}
              onMarkAttended={onMarkAttended ? () => onMarkAttended(a.id) : undefined}
              onMarkNoShow={onMarkNoShow ? () => onMarkNoShow(a.id) : undefined}
            />
          ))}
      </div>

      {availableSlots.length > 0 && (
        <>
          <div style={{ height: 24 }} />
          <SectionTitle>{t.agenda.freeSlotsToday}</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {availableSlots.map((tm) => (
              <div key={tm} style={{ padding: '8px 14px', borderRadius: RADIUS.pill, border: `1px dashed ${T.line}`, fontFamily: 'Inter', fontSize: 12.5, color: T.muted }}>
                {formatTimeLabel(tm, lang)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
