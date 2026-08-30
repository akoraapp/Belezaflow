import { useEffect, useState } from 'react';
import { AtSign, Check, Copy, MapPin, MessageCircle, MessageSquare, QrCode, Share2 } from 'lucide-react';
import { T, ALL_SLOTS, RADIUS, SHADOW } from '../theme';
import { PROFESSION_LABEL, WEEKDAY_LABEL } from '../i18n';
import { getAvailability, getAvailableSlotsForDate, getBookableDays, fmtMoney, formatTimeLabel } from '../lib/helpers';
import { buildWhatsAppLink, digitsOnly } from '../lib/followup';
import { Card, Chip, TextInput, PhoneInput, FieldLabel, EmptyHint, IconButton, StepLabel, ServiceOption, PrimaryButton, SectionTitle } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { useProfile } from '../hooks/useProfile';
import { useAppointments } from '../hooks/useAppointments';
import { useServices } from '../hooks/useServices';
import { useClients } from '../hooks/useClients';
import type { ServiceItem } from '../types';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

interface AgendaOnlineScreenProps {
  onOpenServicos: () => void;
  embedded?: boolean;
}

export function AgendaOnlineScreen({ onOpenServicos, embedded }: AgendaOnlineScreenProps) {
  const { t, lang } = useLang();
  const { profile, updateProfile: onUpdateProfile } = useProfile();
  const { appointments, addAppointment } = useAppointments();
  const { services } = useServices();
  const { addClient, updateClient, findClientForAppointment } = useClients();
  const [copied, setCopied] = useState(false);
  const [bookService, setBookService] = useState<ServiceItem | null>(null);
  const [bookDate, setBookDate] = useState<string | null>(null);
  const [bookTime, setBookTime] = useState<string | null>(null);
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState(false);

  const bookableDays = getBookableDays(profile, 14);
  useEffect(() => {
    if (!bookDate && bookableDays.length > 0) setBookDate(bookableDays[0].dateStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookableDays.map((d) => d.dateStr).join(',')]);

  if (!profile) return null;
  const currency = profile.currency;

  const slug = (profile.publicName || 'seunegocio').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const link = `beautyflow.app/${slug}`;

  const { workingDays, chosenSlots } = getAvailability(profile, appointments);
  const availableSlotsForBookDate = bookDate ? getAvailableSlotsForDate(profile, appointments, bookDate) : [];
  // The professional only needs to type an address — a Google Maps search link is
  // generated from it automatically. The separate "Link do Google Maps" field is an
  // optional override for a more precise pin.
  const mapsHref = profile.mapsLink || (profile.endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.endereco)}` : null);

  const toggleDay = (d: string) => {
    const next = workingDays.includes(d) ? workingDays.filter((x) => x !== d) : [...workingDays, d];
    onUpdateProfile({ workingDays: next });
  };
  const toggleSlot = (tm: string) => {
    const next = chosenSlots.includes(tm) ? chosenSlots.filter((x) => x !== tm) : [...chosenSlots, tm].sort();
    onUpdateProfile({ availableSlots: next });
  };

  const confirmBooking = async () => {
    if (!bookService || !bookDate || !bookTime || !bookName || !bookPhone) return;
    setBookingError(false);
    const result = await addAppointment({
      id: `a${Date.now()}`,
      clientName: bookName,
      clientPhone: bookPhone,
      service: bookService.name,
      price: Number(bookService.price),
      duration: bookService.duration,
      time: bookTime,
      day: bookDate,
      status: 'Agendado',
      origin: 'online',
      createdAt: Date.now(),
    });
    if (!result.ok) {
      setBookingError(true);
      setBookTime(null);
      return;
    }
    // A returning client booking again through the public link must never
    // create a second CRM record for the same person — match by phone/name
    // first, same as the rest of the app does when linking an appointment
    // back to a client (see useAttendance.ts).
    const existingClient = findClientForAppointment({ clientName: bookName, clientPhone: bookPhone });
    if (existingClient) {
      if (existingClient.status !== 'Cliente') updateClient(existingClient.id, { status: 'Agendado' });
    } else {
      addClient({ name: bookName, phone: bookPhone, service: bookService.name, origem: 'Agenda Online', status: 'Agendado', birthday: '' });
    }
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setBookService(null);
      setBookTime(null);
      setBookName('');
      setBookPhone('');
    }, 2000);
  };

  return (
    <div style={embedded ? undefined : { padding: '22px 20px 100px' }}>
      {!embedded && (
        <>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 400, color: T.ink, marginBottom: 4 }}>{t.agendaOnline.title}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 18 }}>{t.agendaOnline.subtitle}</div>
        </>
      )}

      <Card style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginBottom: 6 }}>{t.agendaOnline.publicLinkLabel}</div>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13.5, color: T.ink, marginBottom: 12 }}>{link}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton
            icon={Copy}
            label={copied ? t.agendaOnline.copiedLabel : t.agendaOnline.copyLabel}
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          />
          <IconButton icon={Share2} label={t.agendaOnline.shareLabel} />
          <IconButton icon={QrCode} label={t.agendaOnline.qrLabel} />
        </div>
      </Card>

      <SectionTitle>{t.agendaOnline.publicInfoTitle}</SectionTitle>
      <Card style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <FieldLabel>{t.agendaOnline.instagramLabel}</FieldLabel>
          <TextInput value={profile.instagram || ''} onChange={(v) => onUpdateProfile({ instagram: v })} placeholder={t.agendaOnline.instagramPlaceholder} />
        </div>
        <div>
          <FieldLabel>{t.agendaOnline.phoneLabel}</FieldLabel>
          <PhoneInput value={profile.whatsapp || ''} onChange={(v) => onUpdateProfile({ whatsapp: v })} placeholder={t.agendaOnline.phonePlaceholder} testId="agendaonline-whatsapp" />
        </div>
        <div>
          <FieldLabel>{t.agendaOnline.localNameLabel}</FieldLabel>
          <TextInput value={profile.endereco || ''} onChange={(v) => onUpdateProfile({ endereco: v })} placeholder={t.agendaOnline.localPlaceholder} />
        </div>
        <div>
          <FieldLabel>{t.agendaOnline.mapsLinkLabel}</FieldLabel>
          <TextInput value={profile.mapsLink || ''} onChange={(v) => onUpdateProfile({ mapsLink: v })} placeholder={t.agendaOnline.mapsPlaceholder} />
          <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginTop: 4 }}>{t.agendaOnline.mapsHint}</div>
        </div>
      </Card>

      <SectionTitle>{t.agendaOnline.slotsTitle}</SectionTitle>
      <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 12 }}>{t.agendaOnline.slotsSubtitle}</div>
      <Card style={{ marginBottom: 26 }}>
        <FieldLabel>{t.agendaOnline.workingDaysLabel}</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {WEEKDAYS.map((d) => (
            <Chip key={d} active={workingDays.includes(d)} onClick={() => toggleDay(d)}>
              {WEEKDAY_LABEL[lang][d]}
            </Chip>
          ))}
        </div>
        <FieldLabel>{t.agendaOnline.openSlotsLabel}</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_SLOTS.map((tm) => (
            <Chip key={tm} active={chosenSlots.includes(tm)} onClick={() => toggleSlot(tm)}>
              {formatTimeLabel(tm, lang)}
            </Chip>
          ))}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginTop: 10 }}>{t.agendaOnline.slotsHint}</div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: T.gold }}>{t.agendaOnline.servicesShownTitle}</div>
        <button onClick={onOpenServicos} style={{ border: 'none', background: 'transparent', color: T.goldDeep, fontFamily: 'Inter', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
          {t.agendaOnline.editServicesCta}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {services.length === 0 && <EmptyHint text={t.agendaOnline.noServicesShort} />}
        {services.map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: RADIUS.control, background: T.surfaceAlt }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 600, color: T.ink }}>
              {s.name} · {s.duration}min
            </span>
            <span style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 700, color: T.goldDeep }}>{fmtMoney(s.price, currency)}</span>
          </div>
        ))}
      </div>

      <SectionTitle>{t.agendaOnline.previewTitle}</SectionTitle>
      <Card style={{ padding: 0, overflow: 'hidden', border: `1px solid ${T.line}`, boxShadow: SHADOW.elevated }}>
        <div
          style={{
            position: 'relative',
            background: `radial-gradient(circle at 30% 20%, ${T.goldSoft}, ${T.bg} 70%)`,
            padding: '34px 20px 30px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.5,
              background: 'repeating-linear-gradient(115deg, rgba(201,162,75,0.10) 0px, rgba(201,162,75,0.10) 1px, transparent 1px, transparent 26px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: 74,
              height: 74,
              borderRadius: '50%',
              margin: '0 auto 14px',
              background: `linear-gradient(135deg, ${T.goldLight}, ${T.goldDeep})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Playfair Display',
              fontSize: 27,
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 0 0 3px rgba(255,255,255,0.6), 0 8px 22px -6px rgba(26,26,26,0.25)',
            }}
          >
            {(profile.publicName || 'S').charAt(0)}
          </div>
          <div style={{ position: 'relative', fontFamily: 'Playfair Display', fontSize: 21, color: T.ink, fontWeight: 400 }}>{profile.publicName || t.agendaOnline.defaultPublicName}</div>
          <div style={{ position: 'relative', fontFamily: 'Inter', fontSize: 10.5, color: T.goldDeep, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.4 }}>
            {profile.profession ? PROFESSION_LABEL[lang][profile.profession] : ''}
          </div>
          <div style={{ position: 'relative', width: 28, height: 1.5, background: T.gold, margin: '12px auto 14px', opacity: 0.7 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: T.surface,
                  border: `1px solid ${T.line}`,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 11,
                  color: T.goldDeep,
                  textDecoration: 'none',
                }}
              >
                <AtSign size={12} /> {profile.instagram}
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={
                  profile.contactMethod === 'sms'
                    ? `sms:${digitsOnly(profile.whatsapp)}`
                    : buildWhatsAppLink(profile.whatsapp, t.agendaOnline.whatsappGreeting) || '#'
                }
                target={profile.contactMethod === 'sms' ? undefined : '_blank'}
                rel={profile.contactMethod === 'sms' ? undefined : 'noreferrer'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: T.surface,
                  border: `1px solid ${T.line}`,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 11,
                  color: T.goldDeep,
                  textDecoration: 'none',
                }}
              >
                {profile.contactMethod === 'sms' ? <MessageSquare size={12} /> : <MessageCircle size={12} />} {profile.whatsapp}
              </a>
            )}
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: T.goldSoft,
                  border: `1px solid ${T.gold}`,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: 11,
                  color: T.goldDeep,
                  textDecoration: 'none',
                }}
              >
                <MapPin size={12} /> {t.agendaOnline.howToGet}
              </a>
            )}
            {!profile.instagram && !profile.whatsapp && !profile.endereco && (
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: T.muted }}>{t.agendaOnline.fillInfoHint}</span>
            )}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '26px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Check size={24} color={T.goldDeep} />
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 17, color: T.ink }}>{t.agendaOnline.confirmedTitle}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginTop: 3 }}>{t.agendaOnline.confirmedSubtitle}</div>
            </div>
          ) : (
            <>
              <StepLabel n={1}>{t.agendaOnline.step1}</StepLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {services.length === 0 && <EmptyHint text={t.agendaOnline.noServicesYet} />}
                {services.map((s) => (
                  <ServiceOption key={s.id} s={s} active={bookService?.id === s.id} currency={currency} onClick={() => setBookService(s)} />
                ))}
              </div>

              <StepLabel n={2}>{t.agendaOnline.step2}</StepLabel>
              {bookableDays.length === 0 ? (
                <div style={{ marginBottom: 20, fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.agendaOnline.noBookableDays}</div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
                    {bookableDays.map((d) => (
                      <button
                        key={d.dateStr}
                        onClick={() => {
                          setBookDate(d.dateStr);
                          setBookTime(null);
                        }}
                        style={{
                          flexShrink: 0,
                          minWidth: 52,
                          padding: '8px 10px',
                          borderRadius: RADIUS.control,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: `1.5px solid ${bookDate === d.dateStr ? T.gold : T.line}`,
                          background: bookDate === d.dateStr ? `linear-gradient(135deg, ${T.goldLight}, ${T.goldDeep})` : T.surface,
                        }}
                      >
                        <div style={{ fontFamily: 'Inter', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: bookDate === d.dateStr ? '#fff' : T.muted }}>
                          {WEEKDAY_LABEL[lang][d.weekday]}
                        </div>
                        <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 700, color: bookDate === d.dateStr ? '#fff' : T.ink }}>{d.dayOfMonth}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {availableSlotsForBookDate.length === 0 && <span style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.agendaOnline.noSlotsFree}</span>}
                    {availableSlotsForBookDate.map((tm) => (
                      <button
                        key={tm}
                        onClick={() => setBookTime(tm)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: RADIUS.pill,
                          fontFamily: 'Playfair Display',
                          fontSize: 13.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: `1.5px solid ${bookTime === tm ? T.gold : T.line}`,
                          background: bookTime === tm ? `linear-gradient(135deg, ${T.goldLight}, ${T.goldDeep})` : T.surface,
                          color: bookTime === tm ? '#fff' : T.ink,
                        }}
                      >
                        {formatTimeLabel(tm, lang)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <StepLabel n={3}>{t.agendaOnline.step3}</StepLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                <TextInput value={bookName} onChange={setBookName} placeholder={t.agendaOnline.namePlaceholder} />
                <PhoneInput value={bookPhone} onChange={setBookPhone} placeholder={t.agendaOnline.phoneContactPlaceholder} testId="agendaonline-book-phone" />
              </div>

              {bookService && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: RADIUS.control, background: T.surface, border: `1px solid ${T.gold}`, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12.5, color: T.ink }}>
                      {bookService.name}
                      {bookDate ? ` · ${bookDate.split('-')[2]}/${bookDate.split('-')[1]}` : ''}
                      {bookTime ? ` · ${formatTimeLabel(bookTime, lang)}` : ''}
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted }}>{bookService.duration} min</div>
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 15, color: T.goldDeep, fontWeight: 700 }}>{fmtMoney(bookService.price, currency)}</div>
                </div>
              )}

              {bookingError && (
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.danger, marginBottom: 12, textAlign: 'center' }}>{t.agendaOnline.slotTakenError}</div>
              )}
              <PrimaryButton full onClick={confirmBooking} disabled={!bookService || !bookDate || !bookTime || !bookName || !bookPhone}>
                {t.agendaOnline.confirmApptCta}
              </PrimaryButton>
              <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 10, color: T.muted, marginTop: 14, letterSpacing: 0.3 }}>{t.agendaOnline.secureBookingFooter}</div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
