import { useMemo } from 'react';
import { AlertCircle, Cake, Users } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { getAvailability, fmtMoney, todayIsBirthday } from '../lib/helpers';
import { Card, GoalRing, EmptyHint, PrimaryButton, AppointmentRow } from '../components/primitives';
import type { Appointment, Client, CurrencyCode, Profile, ServiceItem } from '../types';

interface HojeScreenProps {
  profile: Profile;
  appointments: Appointment[];
  clients: Client[];
  services: ServiceItem[];
  currency: CurrencyCode;
  onOpenMaquina: () => void;
}

export function HojeScreen({ profile, appointments, clients, services, currency, onOpenMaquina }: HojeScreenProps) {
  const { today, isWorkingToday, availableSlots } = getAvailability(profile, appointments);
  const monthRevenue = useMemo(() => appointments.filter((a) => a.status !== 'Cancelado').reduce((sum, a) => sum + a.price, 0), [appointments]);
  const progress = Math.min(1, monthRevenue / (profile.goal || 1));
  const vagos = availableSlots.length;
  const potencial = vagos * (services[0]?.price || 0);
  const leads = clients.filter((c) => c.status === 'Novo Lead').length;
  const birthdayClients = clients.filter((c) => todayIsBirthday(c.birthday));
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.muted }}>{greet},</div>
      <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 20 }} data-testid="hoje-greeting">
        {profile.name}.
      </div>

      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted, marginBottom: 4 }}>Faturamento acumulado</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 20, color: T.ink }}>
            {CURRENCIES[currency].symbol} {fmtMoney(monthRevenue, currency)}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>
            de {CURRENCIES[currency].symbol} {fmtMoney(profile.goal, currency)} (meta)
          </div>
        </div>
        <GoalRing progress={progress} size={88} stroke={8} center="da meta" />
      </Card>

      {isWorkingToday ? (
        <Card style={{ marginBottom: 14, borderColor: T.gold, background: T.goldSoft }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertCircle size={18} color={T.goldDeep} style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: T.ink }}>
                {vagos > 0 ? `Você possui ${vagos} horário${vagos > 1 ? 's' : ''} vago${vagos > 1 ? 's' : ''} hoje.` : 'Sua agenda de hoje está cheia. 🎉'}
              </div>
              {vagos > 0 && (
                <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.goldDeep, marginTop: 2 }}>
                  {potencial > 0 ? `Potencial estimado: ${CURRENCIES[currency].symbol} ${fmtMoney(potencial, currency)}` : 'Cadastre seus serviços para ver o potencial em R$.'}
                </div>
              )}
            </div>
          </div>
          {vagos > 0 && (
            <div style={{ marginTop: 12 }}>
              <PrimaryButton full onClick={onOpenMaquina}>
                Executar Plano do Dia
              </PrimaryButton>
            </div>
          )}
        </Card>
      ) : (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.muted }}>Hoje não é um dia de atendimento (defina isso em Agenda Online).</div>
        </Card>
      )}

      {birthdayClients.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cake size={16} color={T.goldDeep} />
            </div>
            <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink }}>
              Hoje é aniversário de <b>{birthdayClients.map((c) => c.name).join(', ')}</b>.
            </div>
          </div>
        </Card>
      )}

      {leads > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color={T.goldDeep} />
            </div>
            <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink }}>
              <b>
                {leads} novo{leads > 1 ? 's' : ''} lead{leads > 1 ? 's' : ''}
              </b>{' '}
              aguardando contato.
            </div>
          </div>
        </Card>
      )}

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Agendamentos de hoje</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {today.length === 0 && <EmptyHint text="Nenhum agendamento hoje ainda. Compartilhe seu link de agenda online." />}
        {[...today]
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((a) => (
            <AppointmentRow key={a.id} a={a} currency={currency} />
          ))}
      </div>
    </div>
  );
}
