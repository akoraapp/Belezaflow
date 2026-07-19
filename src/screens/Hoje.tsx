import { useMemo } from 'react';
import { AlertCircle, Bot, Calendar, Megaphone, UserPlus, Wallet, type LucideIcon } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { getAvailability, fmtMoney } from '../lib/helpers';
import { Card, GoalRing, EmptyHint, AppointmentRow } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { AlertItem } from '../lib/alerts';
import type { Appointment, CurrencyCode, Profile } from '../types';

interface HojeScreenProps {
  profile: Profile;
  appointments: Appointment[];
  currency: CurrencyCode;
  alerts: AlertItem[];
  onOpenConteudo: () => void;
  onOpenAgenda: () => void;
  onOpenFinanceiro: () => void;
  onOpenClientes: () => void;
}

export function HojeScreen({ profile, appointments, currency, alerts, onOpenConteudo, onOpenAgenda, onOpenFinanceiro, onOpenClientes }: HojeScreenProps) {
  const { t } = useLang();
  const { today, isWorkingToday, availableSlots } = getAvailability(profile, appointments);
  const monthRevenue = useMemo(() => appointments.filter((a) => a.status !== 'Cancelado').reduce((sum, a) => sum + a.price, 0), [appointments]);
  const progress = Math.min(1, monthRevenue / (profile.goal || 1));
  const hour = new Date().getHours();
  const greet = hour < 12 ? t.hoje.greetMorning : hour < 18 ? t.hoje.greetAfternoon : t.hoje.greetEvening;

  const showFull = isWorkingToday && availableSlots.length === 0 && today.length > 0;

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.muted }}>{greet},</div>
      <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 20 }} data-testid="hoje-greeting">
        {profile.name}.
      </div>

      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted, marginBottom: 4 }}>{t.hoje.revenueLabel}</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 20, color: T.ink }}>
            {CURRENCIES[currency].symbol} {fmtMoney(monthRevenue, currency)}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>
            {CURRENCIES[currency].symbol} {fmtMoney(profile.goal, currency)} {t.hoje.ofGoalSuffix}
          </div>
        </div>
        <GoalRing progress={progress} size={88} stroke={8} center={t.onboarding.goalRingCenter} />
      </Card>

      <div style={{ fontFamily: 'Manrope', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700, color: T.muted, marginBottom: 10 }}>{t.hoje.quickActionsTitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <QuickActionButton icon={Megaphone} label={t.hoje.quickConteudo} onClick={onOpenConteudo} primary testId="quick-conteudo" />
        <QuickActionButton icon={Calendar} label={t.hoje.quickAtendimento} onClick={onOpenAgenda} testId="quick-atendimento" />
        <QuickActionButton icon={Wallet} label={t.hoje.quickFinanceiro} onClick={onOpenFinanceiro} testId="quick-financeiro" />
        <QuickActionButton icon={UserPlus} label={t.hoje.quickCliente} onClick={onOpenClientes} testId="quick-cliente" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Bot size={15} color={T.goldDeep} />
        <div style={{ fontFamily: 'Manrope', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700, color: T.goldDeep }}>{t.hoje.sectionEyebrow}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {!isWorkingToday && (
          <Card>
            <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.muted }}>{t.hoje.notWorkingDay}</div>
          </Card>
        )}

        {showFull && (
          <Card style={{ borderColor: T.gold, background: T.goldSoft }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: T.ink }}>{t.hoje.alertFullToday}</div>
          </Card>
        )}

        {alerts.map((a) => (
          <AlertRow key={a.key} icon={a.icon} title={a.title} ctaLabel={a.ctaLabel} onCta={a.onCta} />
        ))}

        {alerts.length === 0 && isWorkingToday && !showFull && (
          <Card>
            <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{t.hoje.noAlerts}</div>
          </Card>
        )}
      </div>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{t.hoje.appointmentsToday}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {today.length === 0 && <EmptyHint text={t.hoje.noAppointmentsToday} />}
        {[...today]
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((a) => (
            <AppointmentRow key={a.id} a={a} currency={currency} />
          ))}
      </div>
    </div>
  );
}

function AlertRow({ icon: Icon, title, ctaLabel, onCta }: { icon: typeof AlertCircle; title: string; ctaLabel?: string; onCta?: () => void }) {
  return (
    <Card style={{ borderColor: T.gold, background: T.goldSoft }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon size={18} color={T.goldDeep} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13.5, color: T.ink, lineHeight: 1.45 }}>{title}</div>
      </div>
      {ctaLabel && onCta && (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={onCta}
            style={{
              width: '100%',
              height: 40,
              borderRadius: 12,
              border: 'none',
              background: T.ink,
              color: '#fff',
              fontFamily: 'Manrope',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </Card>
  );
}

function QuickActionButton({ icon: Icon, label, onClick, primary, testId }: { icon: LucideIcon; label: string; onClick: () => void; primary?: boolean; testId?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
        padding: '14px 14px',
        borderRadius: 16,
        cursor: 'pointer',
        textAlign: 'left',
        border: primary ? 'none' : `1px solid ${T.line}`,
        background: primary ? `linear-gradient(135deg, #C9A24B, #8A6D2F)` : '#fff',
        boxShadow: primary ? '0 6px 16px -6px rgba(138,109,47,0.55)' : 'none',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: primary ? 'rgba(255,255,255,0.2)' : T.goldSoft,
        }}
      >
        <Icon size={15} color={primary ? '#fff' : T.goldDeep} />
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, color: primary ? '#fff' : T.ink, lineHeight: 1.3 }}>{label}</div>
    </button>
  );
}
