import { ArrowRight, Cake, Clock, Target, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import { T, CURRENCIES, RADIUS, ALL_SLOTS } from '../theme';
import { getAvailability, getAvailableSlotsForDate, getBookableDays, fmtMoney, format, todayIsBirthday } from '../lib/helpers';
import { productStatus } from '../hooks/useInventory';
import { Card, EmptyHint, SectionTitle } from '../components/primitives';
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
  if (!profile) return null;
  const currency = profile.currency;
  const { today, isWorkingToday, availableSlots } = getAvailability(profile, appointments);
  const revenue = appointments.filter((a) => a.status === 'Compareceu').reduce((s, a) => s + a.price, 0);
  const gap = Math.max(0, (profile.goal || 0) - revenue);
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
      <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, marginBottom: 22 }}>{t.diagnostico.subtitle}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
        <Metric label={t.diagnostico.metricRevenue} value={`${CURRENCIES[currency].symbol}${fmtMoney(revenue, currency)}`} />
        <Metric label={t.diagnostico.metricGoal} value={`${CURRENCIES[currency].symbol}${fmtMoney(profile.goal, currency)}`} />
        <Metric label={t.diagnostico.metricApptsToday} value={`${today.length}`} />
        <Metric label={t.diagnostico.metricFreeSlots} value={`${availableSlots.length}`} />
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
