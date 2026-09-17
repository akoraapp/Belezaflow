import { useState } from 'react';
import { ArrowRight, Cake, Clock, Target, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import { T, CURRENCIES, RADIUS, ALL_SLOTS } from '../theme';
import { getAvailability, getAvailableSlotsForDate, getBookableDays, fmtMoney, format, todayDateStr, todayIsBirthday } from '../lib/helpers';
import { productStatus } from '../hooks/useInventory';
import { Card, Chip, EmptyHint, SectionTitle } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { useProfile } from '../hooks/useProfile';
import { useClients } from '../hooks/useClients';
import { useAppointments } from '../hooks/useAppointments';
import { useInventory } from '../hooks/useInventory';

// Looking ahead this many working days decides whether the agenda counts as
// "full" for the raise-prices insight below — long enough to smooth out a
// single quiet day, short enough to still feel actionable.
const UPCOMING_DAYS_WINDOW = 7;
const AGENDA_FULL_FREE_RATIO = 0.2;
const GOAL_NEAR_OR_ABOVE_RATIO = 0.9;

// The period selector for the metric cards below — separate from the
// insights section further down, which always stays about "right now"
// (today's free slots, leads waiting, a birthday today) since those read
// oddly stretched across a wider window ("2 horários vagos" over 30 days
// isn't an actionable insight the way "2 horários vagos hoje" is).
const PERIOD_OPTIONS = [1, 7, 15, 30, 60] as const;
type PeriodDays = (typeof PERIOD_OPTIONS)[number];
// profile.goal is a monthly figure (see Financeiro.tsx) — prorated to the
// selected window so "Meta" stays a meaningful comparison at any period.
const GOAL_PRORATION_BASE_DAYS = 30;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function addDaysToDateStr(dateStr: string, delta: number) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

// End-of-day boundary (local time) for a "YYYY-MM-DD" string, so a lead
// created any time today still counts as "created today" when compared
// against client.createdAt (a precise millisecond timestamp).
function dateStrToLocalEndOfDayMs(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
}

function dateStrToLocalStartOfDayMs(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
}

interface DiagnosticoScreenProps {
  onOpenConteudo: () => void;
  onOpenClientes: (clientId?: string) => void;
  onOpenFinanceiro: () => void;
}

interface Insight {
  icon: LucideIcon;
  title: string;
  cta: string;
  onClick: () => void;
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Card style={{ flex: '1 1 45%', padding: 16 }}>
      <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 700, color: accent || T.ink, marginTop: 5 }}>{value}</div>
    </Card>
  );
}

export function DiagnosticoScreen({ onOpenConteudo, onOpenClientes, onOpenFinanceiro }: DiagnosticoScreenProps) {
  const { t } = useLang();
  const { profile } = useProfile();
  const { clients } = useClients();
  const { appointments } = useAppointments();
  const { products } = useInventory();
  const [periodDays, setPeriodDays] = useState<PeriodDays>(1);
  if (!profile) return null;
  const currency = profile.currency;
  const { isWorkingToday, availableSlots } = getAvailability(profile, appointments);

  // Metric cards: everything scoped to the selected window. Revenue/goal look
  // back from today (an appointment can only be "Compareceu" in the past or
  // today); appointment count/free slots look forward from today — together
  // that's the "360" view asked for, with "Hoje" (periodDays === 1) reducing
  // to exactly the same single day on both sides as before this existed.
  const todayStr = todayDateStr();
  const periodStartStr = addDaysToDateStr(todayStr, -(periodDays - 1));
  const periodEndStr = addDaysToDateStr(todayStr, periodDays - 1);
  const revenue = appointments
    .filter((a) => a.status === 'Compareceu' && a.day >= periodStartStr && a.day <= todayStr)
    .reduce((s, a) => s + a.price, 0);
  const periodGoal = Math.round(((profile.goal || 0) * periodDays) / GOAL_PRORATION_BASE_DAYS);
  const gap = Math.max(0, periodGoal - revenue);
  const apptsInPeriod = appointments.filter((a) => a.day >= todayStr && a.day <= periodEndStr).length;
  const bookableDaysInPeriod = getBookableDays(profile, periodDays);
  const freeSlotsInPeriod = bookableDaysInPeriod.reduce((sum, d) => sum + getAvailableSlotsForDate(profile, appointments, d.dateStr).length, 0);

  // Of the leads/clients created within the selected window, how many have
  // since moved past "Novo Lead" — i.e. converted into a booking.
  const periodStartMs = dateStrToLocalStartOfDayMs(periodStartStr);
  const periodEndMs = dateStrToLocalEndOfDayMs(todayStr);
  const clientsInPeriod = clients.filter((c) => c.createdAt >= periodStartMs && c.createdAt <= periodEndMs);
  const convertedInPeriod = clientsInPeriod.filter((c) => c.status === 'Agendado' || c.status === 'Cliente').length;
  const conversionRate = clientsInPeriod.length > 0 ? Math.round((convertedInPeriod / clientsInPeriod.length) * 100) : null;

  const leads = clients.filter((c) => c.status === 'Novo Lead').length;
  const activeClients = clients.filter((c) => c.status === 'Cliente' || c.status === 'Agendado').length;
  const lostClients = clients.filter((c) => c.status === 'Perdido').length;
  const lowStock = products.filter((p) => productStatus(p) !== 'ok').length;
  const birthdayClients = clients.filter((c) => todayIsBirthday(c.birthday));

  const insights: Insight[] = [];
  if (isWorkingToday && availableSlots.length > 0) {
    const title = availableSlots.length === 1 ? t.diagnostico.freeSlotInsightOne : format(t.diagnostico.freeSlotInsightOther, { n: availableSlots.length });
    insights.push({ icon: Clock, title, cta: t.diagnostico.ctaCriarConteudo, onClick: onOpenConteudo });
  }
  if (leads > 0) {
    const title = leads === 1 ? t.diagnostico.leadsInsightOne : format(t.diagnostico.leadsInsightOther, { n: leads });
    insights.push({ icon: Users, title, cta: t.diagnostico.ctaVerClientes, onClick: () => onOpenClientes() });
  }
  birthdayClients.forEach((c) =>
    insights.push({
      icon: Cake,
      title: format(t.diagnostico.birthdayInsightTemplate, { name: c.name }),
      cta: t.diagnostico.ctaMensagem,
      onClick: () => onOpenClientes(c.id),
    }),
  );
  if ((profile.goal || 0) > 0 && gap > 0) {
    insights.push({
      icon: Target,
      title: format(t.diagnostico.goalGapInsightTemplate, { amount: `${CURRENCIES[currency].symbol}${fmtMoney(gap, currency)}` }),
      cta: t.diagnostico.ctaPlano,
      onClick: onOpenFinanceiro,
    });
  }

  // The flip side of the goal-gap insight above: agenda is nearly full for the
  // upcoming week AND the goal is basically met, so the bottleneck isn't more
  // clients, it's capacity/pricing — nudge toward raising prices or opening
  // more slots instead of just "keep filling the calendar."
  const upcomingDays = getBookableDays(profile, UPCOMING_DAYS_WINDOW);
  const daySlotCapacity = profile.availableSlots?.length ? profile.availableSlots.length : ALL_SLOTS.length;
  const upcomingCapacity = upcomingDays.length * daySlotCapacity;
  const upcomingFreeSlots = upcomingDays.reduce((sum, d) => sum + getAvailableSlotsForDate(profile, appointments, d.dateStr).length, 0);
  const agendaIsFull = upcomingCapacity > 0 && upcomingFreeSlots / upcomingCapacity <= AGENDA_FULL_FREE_RATIO;
  const goalNearOrAbove = (profile.goal || 0) > 0 && revenue / profile.goal >= GOAL_NEAR_OR_ABOVE_RATIO;
  if (agendaIsFull && goalNearOrAbove) {
    insights.push({ icon: TrendingUp, title: t.diagnostico.raisePricesInsightTitle, cta: t.diagnostico.ctaPlano, onClick: onOpenFinanceiro });
  }

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ marginBottom: 5 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 25, fontWeight: 400, color: T.ink }}>{t.diagnostico.title}</div>
      </div>
      <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, marginBottom: 16 }}>{t.diagnostico.subtitle}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {PERIOD_OPTIONS.map((d) => (
          <Chip key={d} active={periodDays === d} onClick={() => setPeriodDays(d)}>
            {d === 1 ? t.diagnostico.periodHoje : format(t.diagnostico.periodDiasTemplate, { n: d })}
          </Chip>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
        <Metric label={t.diagnostico.metricRevenue} value={`${CURRENCIES[currency].symbol}${fmtMoney(revenue, currency)}`} />
        <Metric label={t.diagnostico.metricGoal} value={`${CURRENCIES[currency].symbol}${fmtMoney(periodGoal, currency)}`} />
        <Metric label={t.diagnostico.metricApptsToday} value={`${apptsInPeriod}`} />
        <Metric label={t.diagnostico.metricFreeSlots} value={`${freeSlotsInPeriod}`} />
        <Metric
          label={t.diagnostico.metricConversionRate}
          value={conversionRate === null ? t.clientes.noAttendanceDataLabel : `${conversionRate}%`}
        />
        <Metric label={t.diagnostico.metricActiveClients} value={`${activeClients}`} accent={T.success} />
        <Metric label={t.diagnostico.metricLostClients} value={`${lostClients}`} accent={lostClients > 0 ? T.danger : undefined} />
        <Metric label={t.diagnostico.metricLowStock} value={`${lowStock}`} accent={lowStock > 0 ? T.danger : undefined} />
      </div>

      <SectionTitle>{t.diagnostico.insightsTitle}</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.length === 0 && <EmptyHint text={t.diagnostico.noInsights} />}
        {insights.map((ins, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ins.icon size={14} color={T.goldDeep} />
            </div>
            <div style={{ flex: 1, fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: T.ink }}>{ins.title}</div>
            <button
              onClick={ins.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                border: 'none',
                background: T.goldDeep,
                color: '#fff',
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: 11.5,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: RADIUS.control,
                flexShrink: 0,
              }}
            >
              {ins.cta} <ArrowRight size={11} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
