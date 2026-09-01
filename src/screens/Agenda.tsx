import { useState } from 'react';
import { Plus } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { getAvailability, fmtMoney, formatTimeLabel, todayDateStr, weekdayLabelForDate } from '../lib/helpers';
import { buildWhatsAppLink, buildSmsLink, buildConfirmationMessage } from '../lib/followup';
import { WEEKDAY_LABEL, STATUS_LABEL } from '../i18n';
import { Card, Chip, TextInput, PhoneInput, SelectInput, EmptyHint, AppointmentRow, PrimaryButton, SectionTitle } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { useProfile } from '../hooks/useProfile';
import { useAppointments } from '../hooks/useAppointments';
import { useServices } from '../hooks/useServices';
import { useClients } from '../hooks/useClients';
import { useAttendance } from '../hooks/useAttendance';
import type { Appointment, ServiceItem } from '../types';

// Sentinel value for "this isn't an existing CRM client" in the client
// picker below — never a real client id (those are generated as `c${Date.now()}`).
const NEW_CLIENT_VALUE = '__new__';

interface AgendaScreenProps {
  embedded?: boolean;
}

export function AgendaScreen({ embedded }: AgendaScreenProps) {
  const { t, lang } = useLang();
  const { profile } = useProfile();
  const { appointments, addAppointment, cancelAppointment, rescheduleAppointment, confirmAppointment } = useAppointments();
  const { services } = useServices();
  const { clients, addClient, updateClient } = useClients();
  const { markAttended: onMarkAttended, markNoShow: onMarkNoShow } = useAttendance();
  const [showAdd, setShowAdd] = useState(false);
  const [selService, setSelService] = useState<ServiceItem | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [time, setTime] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  if (!profile) return null;
  const currency = profile.currency;

  const { today, isWorkingToday, availableSlots } = getAvailability(profile, appointments);
  const todayStr = todayDateStr();
  const upcomingByDay = new Map<string, typeof appointments>();
  appointments
    .filter((a) => a.day > todayStr)
    .sort((a, b) => (a.day === b.day ? a.time.localeCompare(b.time) : a.day.localeCompare(b.day)))
    .forEach((a) => {
      const group = upcomingByDay.get(a.day) || [];
      group.push(a);
      upcomingByDay.set(a.day, group);
    });

  const isNewClient = selectedClientId === NEW_CLIENT_VALUE;
  const selectedClient = !isNewClient ? clients.find((c) => c.id === selectedClientId) : undefined;
  const finalClientName = isNewClient ? newClientName.trim() : (selectedClient?.name ?? '');
  const finalClientPhone = isNewClient ? newClientPhone.trim() : (selectedClient?.phone ?? '');
  const canSubmit = !!selService && !!time && !!selectedClientId && !!finalClientName;

  const clientSelectOptions = [NEW_CLIENT_VALUE, ...clients.map((c) => c.id)];
  const clientLabelFor = (id: string) => {
    if (id === NEW_CLIENT_VALUE) return t.agenda.newClientOption;
    const c = clients.find((x) => x.id === id);
    return c ? `${c.name} · ${STATUS_LABEL[lang][c.status] ?? c.status}` : id;
  };

  const submit = async () => {
    if (!selService || !time || !canSubmit) return;
    setSubmitError(false);
    const result = await addAppointment({
      id: `a${Date.now()}`,
      clientName: finalClientName,
      clientPhone: finalClientPhone || undefined,
      service: selService.name,
      price: Number(selService.price),
      duration: selService.duration,
      time,
      day: todayDateStr(),
      status: 'Agendado',
      createdAt: Date.now(),
    });
    if (!result.ok) {
      setSubmitError(true);
      setTime(null);
      return;
    }
    // Booking is the moment a lead/inactive client becomes an active one —
    // mirrors what Agenda Online already does for public bookings. A client
    // already marked 'Cliente' is left as-is (never downgraded).
    if (selectedClient) {
      if (selectedClient.status !== 'Cliente') updateClient(selectedClient.id, { status: 'Agendado' });
    } else {
      addClient({ name: finalClientName, phone: finalClientPhone, service: selService.name, origem: 'Agenda', status: 'Agendado', birthday: '' });
    }
    setShowAdd(false);
    setSelService(null);
    setSelectedClientId('');
    setNewClientName('');
    setNewClientPhone('');
    setTime(null);
  };

  // Opens WhatsApp/SMS with the confirmation message pre-filled and, once the
  // professional's own app takes over, records that the send flow was opened
  // (see useAppointments.confirmAppointment — this can't detect an actual
  // send or delivery, only that the link was launched).
  const sendConfirmation = (appt: Appointment, channel: 'whatsapp' | 'sms') => {
    if (!appt.clientPhone) return;
    const [, m, d] = appt.day.split('-');
    const message = buildConfirmationMessage(profile.confirmationMessageTemplate, lang, {
      nome_cliente: appt.clientName,
      data: `${d}/${m}`,
      hora: formatTimeLabel(appt.time, lang),
      servico: appt.service,
      nome_profissional: profile.publicName || profile.name,
    });
    const link = channel === 'whatsapp' ? buildWhatsAppLink(appt.clientPhone, message) : buildSmsLink(appt.clientPhone, message);
    if (!link) return;
    window.open(link, '_blank', 'noopener,noreferrer');
    confirmAppointment(appt.id, channel);
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
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginBottom: 8 }}>{t.agenda.selectClientLabel}</div>
          <SelectInput
            options={clientSelectOptions}
            value={selectedClientId}
            onChange={setSelectedClientId}
            labelFor={clientLabelFor}
            placeholder={t.agenda.selectClientPlaceholder}
            testId="agenda-client-select"
          />
          {isNewClient && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TextInput value={newClientName} onChange={setNewClientName} placeholder={t.agenda.clientNamePlaceholder} testId="agenda-new-client-name" />
              <PhoneInput value={newClientPhone} onChange={setNewClientPhone} placeholder={t.agendaOnline.phoneContactPlaceholder} testId="agenda-new-client-phone" />
            </div>
          )}
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
          {submitError && <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.danger, marginBottom: 10 }}>{t.agendaOnline.slotTakenError}</div>}
          <PrimaryButton full onClick={submit} disabled={!canSubmit} testId="agenda-add-submit">
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
            <div key={a.id}>
              <AppointmentRow
                a={a}
                currency={currency}
                testId={`appt-${a.id}`}
                onMarkAttended={onMarkAttended ? () => onMarkAttended(a.id) : undefined}
                onMarkNoShow={onMarkNoShow ? () => onMarkNoShow(a.id) : undefined}
                onCancel={() => cancelAppointment(a.id)}
                onReschedule={() => setReschedulingId((cur) => (cur === a.id ? null : a.id))}
                onConfirmWhatsApp={() => sendConfirmation(a, 'whatsapp')}
                onConfirmSms={() => sendConfirmation(a, 'sms')}
              />
              {reschedulingId === a.id && (
                <Card style={{ marginTop: 8 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginBottom: 8 }}>{t.attendance.rescheduleSlotsLabel}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {availableSlots.length === 0 && <span style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.attendance.rescheduleNoSlots}</span>}
                    {availableSlots.map((tm) => (
                      <Chip
                        key={tm}
                        active={false}
                        onClick={() => {
                          rescheduleAppointment(a.id, todayDateStr(), tm);
                          setReschedulingId(null);
                        }}
                      >
                        {formatTimeLabel(tm, lang)}
                      </Chip>
                    ))}
                  </div>
                </Card>
              )}
            </div>
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

      {upcomingByDay.size > 0 && (
        <>
          <div style={{ height: 24 }} />
          <SectionTitle>{t.agenda.upcomingLabel}</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Array.from(upcomingByDay.entries()).map(([day, appts]) => {
              const [, m, d] = day.split('-');
              return (
                <div key={day}>
                  <div style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
                    {WEEKDAY_LABEL[lang][weekdayLabelForDate(day)]} · {d}/{m}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {appts.map((a) => (
                      <AppointmentRow
                        key={a.id}
                        a={a}
                        currency={currency}
                        testId={`appt-${a.id}`}
                        onConfirmWhatsApp={() => sendConfirmation(a, 'whatsapp')}
                        onConfirmSms={() => sendConfirmation(a, 'sms')}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
