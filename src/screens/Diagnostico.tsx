import { ArrowRight, BarChart3, Cake, Clock, Target, Users, type LucideIcon } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { getAvailability, fmtMoney, todayIsBirthday } from '../lib/helpers';
import { productStatus } from './Estoque';
import { Card, EmptyHint } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { Appointment, Client, CurrencyCode, Product, Profile } from '../types';

interface DiagnosticoScreenProps {
  profile: Profile;
  clients: Client[];
  appointments: Appointment[];
  products: Product[];
  currency: CurrencyCode;
  onOpenConteudo: () => void;
  onOpenClientes: () => void;
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
      <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 20, fontWeight: 600, color: accent || T.ink, marginTop: 5 }}>{value}</div>
    </Card>
  );
}

export function DiagnosticoScreen({ profile, clients, appointments, products, currency, onOpenConteudo, onOpenClientes }: DiagnosticoScreenProps) {
  const { t } = useLang();
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
    insights.push({ icon: Clock, title: `${availableSlots.length} ${t.agenda.slotsCountSuffix}`, cta: t.diagnostico.ctaCriarConteudo, onClick: onOpenConteudo });
  }
  if (leads > 0) {
    insights.push({ icon: Users, title: `${leads}`, cta: t.diagnostico.ctaVerClientes, onClick: onOpenClientes });
  }
  birthdayClients.forEach((c) => insights.push({ icon: Cake, title: c.name, cta: t.diagnostico.ctaMensagem, onClick: onOpenClientes }));
  if ((profile.goal || 0) > 0 && gap > 0) {
    insights.push({ icon: Target, title: `${CURRENCIES[currency].symbol}${fmtMoney(gap, currency)}`, cta: t.diagnostico.ctaPlano, onClick: onOpenConteudo });
  }

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <BarChart3 size={20} color={T.goldDeep} />
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 25, fontWeight: 600, color: T.ink }}>{t.diagnostico.title}</div>
      </div>
      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, marginBottom: 22 }}>{t.diagnostico.subtitle}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
        <Metric label={t.diagnostico.metricRevenue} value={`${CURRENCIES[currency].symbol}${fmtMoney(revenue, currency)}`} />
        <Metric label={t.diagnostico.metricGoal} value={`${CURRENCIES[currency].symbol}${fmtMoney(profile.goal, currency)}`} />
        <Metric label={t.diagnostico.metricApptsToday} value={`${today.length}`} />
        <Metric label={t.diagnostico.metricFreeSlots} value={`${availableSlots.length}`} />
        <Metric label={t.diagnostico.metricActiveClients} value={`${activeClients}`} accent={T.success} />
        <Metric label={t.diagnostico.metricLostClients} value={`${lostClients}`} accent={lostClients > 0 ? T.danger : undefined} />
        <Metric label={t.diagnostico.metricLowStock} value={`${lowStock}`} accent={lowStock > 0 ? T.danger : undefined} />
      </div>

      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 12 }}>{t.diagnostico.insightsTitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.length === 0 && <EmptyHint text={t.diagnostico.noInsights} />}
        {insights.map((ins, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ins.icon size={14} color={T.goldDeep} />
            </div>
            <div style={{ flex: 1, fontFamily: 'Manrope', fontWeight: 600, fontSize: 12.5, color: T.ink }}>{ins.title}</div>
            <button
              onClick={ins.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                border: 'none',
                background: T.goldDeep,
                color: '#fff',
                fontFamily: 'Manrope',
                fontWeight: 700,
                fontSize: 11.5,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 999,
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
