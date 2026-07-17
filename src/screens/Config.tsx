import { ChevronRight, Scissors } from 'lucide-react';
import { T } from '../theme';
import { Card, Chip } from '../components/primitives';
import type { Profile, ServiceItem } from '../types';

const ITEMS = [
  'Idioma',
  'Moeda',
  'Dados da profissional',
  'Foto',
  'Logo',
  'Tempo entre atendimentos',
  'Regras de cancelamento',
  'Regras de reagendamento',
  'Preferências de notificações',
  'Meta financeira',
];

interface ConfigScreenProps {
  profile: Profile;
  services: ServiceItem[];
  onUpdateProfile: (patch: Partial<Profile>) => void;
  onOpenServicos: () => void;
}

export function ConfigScreen({ profile, services, onUpdateProfile, onOpenServicos }: ConfigScreenProps) {
  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 16 }}>Configurações</div>

      <Card onClick={onOpenServicos} style={{ marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scissors size={16} color={T.goldDeep} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: T.ink }}>Serviços e valores</div>
          <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>
            {services.length} serviço{services.length !== 1 ? 's' : ''} cadastrado{services.length !== 1 ? 's' : ''}
          </div>
        </div>
        <ChevronRight size={16} color={T.muted} />
      </Card>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Como prefere entrar em contato com clientes</div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted, marginBottom: 10 }}>
          Usado nos botões de envio de mensagem em Clientes. Ex: clientes nos EUA costumam preferir SMS; na América Latina, WhatsApp.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip active={(profile.contactMethod || 'whatsapp') === 'whatsapp'} onClick={() => onUpdateProfile({ contactMethod: 'whatsapp' })}>
            WhatsApp
          </Chip>
          <Chip active={profile.contactMethod === 'sms'} onClick={() => onUpdateProfile({ contactMethod: 'sms' })}>
            SMS
          </Chip>
        </div>
      </Card>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Geral</div>
      <Card style={{ padding: 0 }}>
        {ITEMS.map((it, i) => (
          <div
            key={it}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < ITEMS.length - 1 ? `1px solid ${T.line}` : 'none', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink }}>{it}</span>
            <ChevronRight size={15} color={T.muted} />
          </div>
        ))}
      </Card>
    </div>
  );
}
