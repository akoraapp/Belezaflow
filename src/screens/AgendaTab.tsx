import { useState } from 'react';
import { T } from '../theme';
import { AgendaScreen } from './Agenda';
import { AgendaOnlineScreen } from './AgendaOnline';
import { useLang } from '../lib/LangContext';
import type { Appointment, Client, CurrencyCode, Profile, ServiceItem } from '../types';

interface AgendaTabProps {
  appointments: Appointment[];
  services: ServiceItem[];
  profile: Profile;
  currency: CurrencyCode;
  addAppointment: (a: Appointment) => void;
  onUpdateProfile: (patch: Partial<Profile>) => void;
  addClient: (c: Omit<Client, 'id'>) => void;
  onOpenServicos: () => void;
}

type SubTab = 'interna' | 'online';

export function AgendaTab({ appointments, services, profile, currency, addAppointment, onUpdateProfile, addClient, onOpenServicos }: AgendaTabProps) {
  const { t } = useLang();
  const [subTab, setSubTab] = useState<SubTab>('interna');

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 14 }}>{t.agenda.title}</div>

      <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.line}`, borderRadius: 999, padding: 4, gap: 4, marginBottom: 18 }}>
        {(
          [
            { id: 'interna' as const, label: t.agenda.subtabInterna },
            { id: 'online' as const, label: t.agenda.subtabOnline },
          ]
        ).map((v) => (
          <button
            key={v.id}
            onClick={() => setSubTab(v.id)}
            data-testid={`agenda-subtab-${v.id}`}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 999,
              border: 'none',
              background: subTab === v.id ? T.ink : 'transparent',
              color: subTab === v.id ? '#fff' : T.muted,
              fontFamily: 'Manrope',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {subTab === 'interna' ? (
        <AgendaScreen embedded appointments={appointments} services={services} profile={profile} currency={currency} addAppointment={addAppointment} />
      ) : (
        <AgendaOnlineScreen
          embedded
          profile={profile}
          services={services}
          appointments={appointments}
          currency={currency}
          onUpdateProfile={onUpdateProfile}
          addAppointment={addAppointment}
          addClient={addClient}
          onOpenServicos={onOpenServicos}
        />
      )}
    </div>
  );
}
