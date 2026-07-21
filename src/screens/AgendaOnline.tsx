import { useState } from 'react';
import { AtSign, Check, Copy, MapPin, Phone, QrCode, Share2 } from 'lucide-react';
import { T, ALL_SLOTS } from '../theme';
import { PROFESSION_LABEL, WEEKDAY_LABEL } from '../i18n';
import { getAvailability, fmtMoney, formatTimeLabel } from '../lib/helpers';
import { Card, Chip, TextInput, PhoneInput, FieldLabel, EmptyHint, IconButton, StepLabel, ServiceOption, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { Appointment, Client, CurrencyCode, Profile, ServiceItem } from '../types';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

interface AgendaOnlineScreenProps {
  profile: Profile;
  services: ServiceItem[];
  appointments: Appointment[];
  currency: CurrencyCode;
  onUpdateProfile: (patch: Partial<Profile>) => void;
  addAppointment: (a: Appointment) => void;
  addClient: (c: Omit<Client, 'id'>) => void;
  onOpenServicos: () => void;
  embedded?: boolean;
}

export function AgendaOnlineScreen({ profile, services, appointments, currency, onUpdateProfile, addAppointment, addClient, onOpenServicos, embedded }: AgendaOnlineScreenProps) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const [bookService, setBookService] = useState<ServiceItem | null>(null);
  const [bookTime, setBookTime] = useState<string | null>(null);
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const slug = (profile.publicName || 'seunegocio').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const link = `beautyflow.app/${slug}`;

  const { workingDays, chosenSlots, availableSlots } = getAvailability(profile, appointments);

  const toggleDay = (d: string) => {
    const next = workingDays.includes(d) ? workingDays.filter((x) => x !== d) : [...workingDays, d];
    onUpdateProfile({ workingDays: next });
  };
  const toggleSlot = (tm: string) => {
    const next = chosenSlots.includes(tm) ? chosenSlots.filter((x) => x !== tm) : [...chosenSlots, tm].sort();
    onUpdateProfile({ availableSlots: next });
  };

  const confirmBooking = () => {
    if (!bookService || !bookTime || !bookName || !bookPhone) return;
    addAppointment({
      id: `a${Date.now()}`,
      clientName: bookName,
      clientPhone: bookPhone,
      service: bookService.name,
      price: Number(bookService.price),
      duration: bookService.duration,
      time: bookTime,
      day: 'hoje',
      status: 'Agendado',
      origin: 'online',
      createdAt: Date.now(),
    });
    addClient({ name: bookName, phone: bookPhone, service: bookService.name, origem: 'Agenda Online', status: 'Agendado', birthday: '—' });
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
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{t.agendaOnline.title}</div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted, marginBottom: 18 }}>{t.agendaOnline.subtitle}</div>
        </>
      )}

      <Card style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted, marginBottom: 6 }}>{t.agendaOnline.publicLinkLabel}</div>
        <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: T.ink, marginBottom: 12 }}>{link}</div>
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

      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 12 }}>{t.agendaOnline.publicInfoTitle}</div>
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
          <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted, marginTop: 4 }}>{t.agendaOnline.mapsHint}</div>
        </div>
      </Card>

      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 5 }}>{t.agendaOnline.slotsTitle}</div>
      <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted, marginBottom: 12 }}>{t.agendaOnline.slotsSubtitle}</div>
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
        <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted, marginTop: 10 }}>{t.agendaOnline.slotsHint}</div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 15.5, fontWeight: 600, color: T.ink }}>{t.agendaOnline.servicesShownTitle}</div>
        <button onClick={onOpenServicos} style={{ border: 'none', background: 'transparent', color: T.goldDeep, fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
          {t.agendaOnline.editServicesCta}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {services.length === 0 && <EmptyHint text={t.agendaOnline.noServicesShort} />}
        {services.map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, background: T.surfaceAlt }}>
            <span style={{ fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 600, color: T.ink }}>
              {s.name} · {s.duration}min
            </span>
            <span style={{ fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 700, color: T.goldDeep }}>{fmtMoney(s.price, currency)}</span>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{t.agendaOnline.previewTitle}</div>
      <Card style={{ padding: 0, overflow: 'hidden', border: `1px solid ${T.line}`, boxShadow: '0 18px 40px -20px rgba(27,23,18,0.25)' }}>
        <div
          style={{
            position: 'relative',
            background: `radial-gradient(circle at 30% 20%, #4A3B22, #1B1712 70%)`,
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
              background: 'repeating-linear-gradient(115deg, rgba(201,162,75,0.08) 0px, rgba(201,162,75,0.08) 1px, transparent 1px, transparent 26px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: 74,
              height: 74,
              borderRadius: '50%',
              margin: '0 auto 14px',
              background: `linear-gradient(135deg, #D9BA6D, #8A6D2F)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Cormorant Garamond',
              fontSize: 27,
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 0 0 3px rgba(255,255,255,0.12), 0 8px 22px -6px rgba(0,0,0,0.5)',
            }}
          >
            {(profile.publicName || 'S').charAt(0)}
          </div>
          <div style={{ position: 'relative', fontFamily: 'Cormorant Garamond', fontSize: 21, color: '#fff', fontWeight: 600 }}>{profile.publicName || t.agendaOnline.defaultPublicName}</div>
          <div style={{ position: 'relative', fontFamily: 'Manrope', fontSize: 10.5, color: T.goldLight, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1.4 }}>
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
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(232,213,168,0.25)',
                  fontFamily: 'Manrope',
                  fontSize: 11,
                  color: T.goldLight,
                  textDecoration: 'none',
                }}
              >
                <AtSign size={12} /> {profile.instagram}
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`tel:${profile.whatsapp.replace(/\D/g, '')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(232,213,168,0.25)',
                  fontFamily: 'Manrope',
                  fontSize: 11,
                  color: T.goldLight,
                  textDecoration: 'none',
                }}
              >
                <Phone size={12} /> {profile.whatsapp}
              </a>
            )}
            {profile.endereco && profile.mapsLink && (
              <a
                href={profile.mapsLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'rgba(232,213,168,0.16)',
                  border: `1px solid ${T.gold}`,
                  fontFamily: 'Manrope',
                  fontWeight: 700,
                  fontSize: 11,
                  color: T.goldLight,
                  textDecoration: 'none',
                }}
              >
                <MapPin size={12} /> {t.agendaOnline.howToGet}
              </a>
            )}
            {!profile.instagram && !profile.whatsapp && !profile.endereco && (
              <span style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{t.agendaOnline.fillInfoHint}</span>
            )}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '26px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Check size={24} color={T.goldDeep} />
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 17, color: T.ink }}>{t.agendaOnline.confirmedTitle}</div>
              <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted, marginTop: 3 }}>{t.agendaOnline.confirmedSubtitle}</div>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {availableSlots.length === 0 && <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>{t.agendaOnline.noSlotsFree}</span>}
                {availableSlots.map((tm) => (
                  <button
                    key={tm}
                    onClick={() => setBookTime(tm)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 12,
                      fontFamily: 'Cormorant Garamond',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1.5px solid ${bookTime === tm ? T.gold : T.line}`,
                      background: bookTime === tm ? `linear-gradient(135deg, #D9BA6D, #8A6D2F)` : T.surface,
                      color: bookTime === tm ? '#fff' : T.ink,
                    }}
                  >
                    {formatTimeLabel(tm, lang)}
                  </button>
                ))}
              </div>

              <StepLabel n={3}>{t.agendaOnline.step3}</StepLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                <TextInput value={bookName} onChange={setBookName} placeholder={t.agendaOnline.namePlaceholder} />
                <PhoneInput value={bookPhone} onChange={setBookPhone} placeholder={t.agendaOnline.phoneContactPlaceholder} testId="agendaonline-book-phone" />
              </div>

              {bookService && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 14, background: T.goldSoft, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, color: T.ink }}>
                      {bookService.name}
                      {bookTime ? ` · ${formatTimeLabel(bookTime, lang)}` : ''}
                    </div>
                    <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted }}>{bookService.duration} min</div>
                  </div>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, color: T.goldDeep, fontWeight: 600 }}>{fmtMoney(bookService.price, currency)}</div>
                </div>
              )}

              <PrimaryButton full onClick={confirmBooking} disabled={!bookService || !bookTime || !bookName || !bookPhone}>
                {t.agendaOnline.confirmApptCta}
              </PrimaryButton>
              <div style={{ textAlign: 'center', fontFamily: 'Manrope', fontSize: 10, color: T.muted, marginTop: 14, letterSpacing: 0.3 }}>{t.agendaOnline.secureBookingFooter}</div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
