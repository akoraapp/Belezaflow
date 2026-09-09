import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AtSign, Check, MapPin, MessageCircle, MessageSquare } from 'lucide-react';
import { T, SHADOW } from '../theme';
import { PROFESSION_LABEL, WEEKDAY_LABEL } from '../i18n';
import { getAvailableSlotsForDate, getBookableDays, fmtMoney, formatTimeLabel } from '../lib/helpers';
import { buildWhatsAppLink, digitsOnly } from '../lib/followup';
import { Card, TextInput, PhoneInput, EmptyHint, StepLabel, ServiceOption, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { supabase } from '../services/supabaseClient';
import type { Appointment, ContactMethod, CurrencyCode, ServiceItem } from '../types';

interface PublicProfile {
  publicName: string;
  profession: string;
  instagram: string;
  whatsapp: string;
  endereco: string;
  mapsLink: string;
  contactMethod: ContactMethod;
  workingDays: string[];
  availableSlots: string[];
  currency: CurrencyCode;
}

// Only day/time/status travel over the wire (see supabase/functions/public-
// booking) — never another client's name or phone — so this is narrower
// than the full Appointment type the shared availability helpers expect.
// They only ever read those three fields, so the cast below is safe.
type PublicAppointment = Pick<Appointment, 'day' | 'time' | 'status'>;

export function PublicBookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLang();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [appointments, setAppointments] = useState<PublicAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [bookService, setBookService] = useState<ServiceItem | null>(null);
  const [bookDate, setBookDate] = useState<string | null>(null);
  const [bookTime, setBookTime] = useState<string | null>(null);
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    supabase.functions
      .invoke<{ profile: PublicProfile; services: ServiceItem[]; appointments: PublicAppointment[] }>('public-booking', { body: { action: 'get', slug } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.profile) {
          setNotFound(true);
        } else {
          setProfile(data.profile);
          setServices(data.services ?? []);
          setAppointments(data.appointments ?? []);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const bookableDays = profile ? getBookableDays({ workingDays: profile.workingDays }, 14) : [];
  useEffect(() => {
    if (!bookDate && bookableDays.length > 0) setBookDate(bookableDays[0].dateStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookableDays.map((d) => d.dateStr).join(',')]);

  // Only day/time/status travel over the wire for this — see PublicAppointment above —
  // but getAvailableSlotsForDate only ever reads those three fields, so this is safe.
  const availableSlotsForBookDate =
    profile && bookDate ? getAvailableSlotsForDate({ workingDays: profile.workingDays, availableSlots: profile.availableSlots }, appointments as Appointment[], bookDate) : [];

  const mapsHref = profile?.mapsLink || (profile?.endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.endereco)}` : null);

  const confirmBooking = async () => {
    if (!slug || !bookService || !bookDate || !bookTime || !bookName || !bookPhone || submitting) return;
    setSubmitting(true);
    setBookingError(false);
    const { data, error } = await supabase.functions.invoke<{ ok?: boolean; error?: string }>('public-booking', {
      body: { action: 'book', slug, serviceId: bookService.id, day: bookDate, time: bookTime, clientName: bookName, clientPhone: bookPhone },
    });
    setSubmitting(false);
    if (error || !data?.ok) {
      setBookingError(true);
      setBookTime(null);
      // The slot we just took is now occupied from our own perspective too,
      // so it disappears from the picker without waiting for a refetch.
      setAppointments((prev) => [...prev, { day: bookDate, time: bookTime, status: 'Agendado' }]);
      return;
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, fontFamily: 'Inter', color: T.muted }}>…</div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, fontFamily: 'Inter', padding: 24, textAlign: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 22, color: T.ink, marginBottom: 8 }}>{t.agendaOnline.notFoundTitle}</div>
          <div style={{ fontSize: 13, color: T.muted }}>{t.agendaOnline.notFoundSubtitle}</div>
        </div>
      </div>
    );
  }

  const currency = profile.currency;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Inter', padding: '32px 16px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
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
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, background: T.surface, border: `1px solid ${T.line}`, fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: T.goldDeep, textDecoration: 'none' }}
                >
                  <AtSign size={12} /> {profile.instagram}
                </a>
              )}
              {profile.whatsapp && (
                <a
                  href={profile.contactMethod === 'sms' ? `sms:${digitsOnly(profile.whatsapp)}` : buildWhatsAppLink(profile.whatsapp, t.agendaOnline.whatsappGreeting) || '#'}
                  target={profile.contactMethod === 'sms' ? undefined : '_blank'}
                  rel={profile.contactMethod === 'sms' ? undefined : 'noreferrer'}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, background: T.surface, border: `1px solid ${T.line}`, fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: T.goldDeep, textDecoration: 'none' }}
                >
                  {profile.contactMethod === 'sms' ? <MessageSquare size={12} /> : <MessageCircle size={12} />} {profile.whatsapp}
                </a>
              )}
              {mapsHref && (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, background: T.goldSoft, border: `1px solid ${T.gold}`, fontFamily: 'Inter', fontWeight: 700, fontSize: 11, color: T.goldDeep, textDecoration: 'none' }}
                >
                  <MapPin size={12} /> {t.agendaOnline.howToGet}
                </a>
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
                            borderRadius: 12,
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
                            borderRadius: 999,
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
                  <PhoneInput value={bookPhone} onChange={setBookPhone} placeholder={t.agendaOnline.phoneContactPlaceholder} testId="public-booking-phone" />
                </div>

                {bookService && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: T.surface, border: `1px solid ${T.gold}`, marginBottom: 16 }}>
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

                {bookingError && <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.danger, marginBottom: 12, textAlign: 'center' }}>{t.agendaOnline.slotTakenError}</div>}
                <PrimaryButton full onClick={confirmBooking} disabled={submitting || !bookService || !bookDate || !bookTime || !bookName || !bookPhone} testId="public-booking-confirm">
                  {submitting ? '…' : t.agendaOnline.confirmApptCta}
                </PrimaryButton>
                <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 10, color: T.muted, marginTop: 14, letterSpacing: 0.3 }}>{t.agendaOnline.secureBookingFooter}</div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
