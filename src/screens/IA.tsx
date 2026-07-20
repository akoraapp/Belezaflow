import { ArrowRight, Bot, Cake, Clock, Target, Users, type LucideIcon } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { getAvailability, fmtMoney, todayIsBirthday } from '../lib/helpers';
import { Card, EmptyHint } from '../components/primitives';
import type { Appointment, Client, CurrencyCode, Profile } from '../types';

interface IAScreenProps {
  profile: Profile;
  clients: Client[];
  appointments: Appointment[];
  currency: CurrencyCode;
}

interface Insight {
  icon: LucideIcon;
  title: string;
  cta: string;
}

export function IAScreen({ profile, clients, appointments, currency }: IAScreenProps) {
  const { isWorkingToday, availableSlots } = getAvailability(profile, appointments);
  const gap = Math.max(0, (profile.goal || 0) - appointments.filter((a) => a.status !== 'Cancelado').reduce((s, a) => s + a.price, 0));
  const leads = clients.filter((c) => c.status === 'Novo Lead').length;
  const birthdayClients = clients.filter((c) => todayIsBirthday(c.birthday));

  const insights: Insight[] = [];
  if (isWorkingToday && availableSlots.length > 0) {
    insights.push({ icon: Clock, title: `${availableSlots.length} horário${availableSlots.length > 1 ? 's' : ''} vago${availableSlots.length > 1 ? 's' : ''} hoje`, cta: 'Criar conteúdo' });
  }
  if (leads > 0) {
    insights.push({ icon: Users, title: `${leads} lead${leads > 1 ? 's' : ''} aguardando contato`, cta: 'Ver clientes' });
  }
  birthdayClients.forEach((c) => insights.push({ icon: Cake, title: `Aniversário de ${c.name} hoje`, cta: 'Mensagem' }));
  if ((profile.goal || 0) > 0 && gap > 0) {
    insights.push({ icon: Target, title: `Faltam ${CURRENCIES[currency].symbol}${fmtMoney(gap, currency)} para a meta`, cta: 'Plano' });
  }

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Bot size={20} color={T.goldDeep} />
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 600, color: T.ink }}>Assistente IA</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {insights.length === 0 && <EmptyHint text="Nada para destacar agora. À medida que você cadastra clientes e agendamentos, os insights aparecem aqui." />}
        {insights.map((ins, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ins.icon size={14} color={T.goldDeep} />
            </div>
            <div style={{ flex: 1, fontFamily: 'Manrope', fontWeight: 600, fontSize: 12.5, color: T.ink }}>{ins.title}</div>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                border: 'none',
                background: T.goldSoft,
                color: T.goldDeep,
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
