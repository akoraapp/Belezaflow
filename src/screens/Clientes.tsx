import { useState } from 'react';
import { ChevronLeft, MessageCircle, MessageSquare, Plus } from 'lucide-react';
import { T, ORIGENS, STATUS_LIST, STATUS_COLOR } from '../theme';
import { Card, Chip, TextInput, EmptyHint, PrimaryButton, Row } from '../components/primitives';
import type { Client, ContactMethod } from '../types';

interface ClientesScreenProps {
  clients: Client[];
  contactMethod: ContactMethod;
  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
}

export function ClientesScreen({ clients, contactMethod, addClient, updateClient }: ClientesScreenProps) {
  const [filter, setFilter] = useState('Todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [birthday, setBirthday] = useState('');
  const [origem, setOrigem] = useState('Instagram');
  const filtered = filter === 'Todos' ? clients : clients.filter((c) => c.status === filter);

  const submit = () => {
    if (!name) return;
    addClient({ name, phone, service: service || '—', origem, status: 'Novo Lead', birthday: birthday || '—' });
    setName('');
    setPhone('');
    setService('');
    setBirthday('');
    setOrigem('Instagram');
    setShowAdd(false);
  };

  const selected = clients.find((c) => c.id === selectedId);
  if (selected) {
    return (
      <ClienteDetail
        client={selected}
        onBack={() => setSelectedId(null)}
        contactMethod={contactMethod}
        onChangeStatus={(status) => updateClient(selected.id, { status })}
        onChangeBirthday={(bday) => updateClient(selected.id, { birthday: bday })}
      />
    );
  }

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink }}>Clientes</div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          data-testid="clientes-add-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 999,
            border: 'none',
            background: `linear-gradient(135deg, #C9A24B, #8A6D2F)`,
            color: '#fff',
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            boxShadow: '0 6px 16px -6px rgba(138,109,47,0.55)',
          }}
        >
          <Plus size={15} /> Nova cliente
        </button>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Nova cliente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextInput value={name} onChange={setName} placeholder="Nome" testId="clientes-name" />
            <TextInput value={phone} onChange={setPhone} placeholder="Telefone" />
            <TextInput value={service} onChange={setService} placeholder="Serviço de interesse" />
            <TextInput value={birthday} onChange={setBirthday} placeholder="Aniversário — ex: 15/03" />
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted, margin: '10px 0 8px' }}>Origem:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {ORIGENS.map((o) => (
              <Chip key={o} active={origem === o} onClick={() => setOrigem(o)}>
                {o}
              </Chip>
            ))}
          </div>
          <PrimaryButton full onClick={submit} disabled={!name} testId="clientes-add-submit">
            Adicionar cliente
          </PrimaryButton>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
        {['Todos', ...STATUS_LIST].map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && <EmptyHint text="Nenhuma cliente nesse filtro ainda." />}
        {filtered.map((c) => (
          <Card key={c.id} onClick={() => setSelectedId(c.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: T.goldSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Fraunces',
                  color: T.goldDeep,
                  fontWeight: 700,
                }}
              >
                {c.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: T.ink }}>{c.name}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>
                  {c.origem} · {c.service}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'Manrope', fontSize: 10.5, fontWeight: 700, color: STATUS_COLOR[c.status], padding: '3px 9px', borderRadius: 999, background: T.surfaceAlt }}>
              {c.status}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClienteDetail({
  client,
  onBack,
  contactMethod,
  onChangeStatus,
  onChangeBirthday,
}: {
  client: Client;
  onBack: () => void;
  contactMethod: ContactMethod;
  onChangeStatus: (status: string) => void;
  onChangeBirthday: (bday: string) => void;
}) {
  const [msgType, setMsgType] = useState<string | null>(null);
  const [bdayInput, setBdayInput] = useState(client.birthday === '—' ? '' : client.birthday || '');
  const templates: Record<string, string> = {
    'Primeiro contato': `Olá ${client.name}! 😊 Vi seu interesse em ${client.service}. Posso te ajudar a encontrar o melhor horário?`,
    'Follow-up': `Oi ${client.name}, tudo bem? Ainda está pensando em agendar seu ${client.service}? Tenho horários abrindo essa semana!`,
    'Quebra de objeção': `Entendo, ${client.name}! Se for sobre o valor, posso te mostrar as formas de pagamento que temos disponíveis 💛`,
    Fechamento: `${client.name}, consigo te encaixar para o ${client.service} — vamos confirmar seu horário?`,
    Reativação: `Saudades por aqui, ${client.name}! Que tal renovar seu ${client.service}? Tenho uma condição especial essa semana.`,
  };
  const methodLabel = contactMethod === 'sms' ? 'SMS' : 'WhatsApp';
  const MethodIcon = contactMethod === 'sms' ? MessageSquare : MessageCircle;

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontFamily: 'Manrope',
          fontSize: 13,
          color: T.muted,
          marginBottom: 14,
          padding: 0,
        }}
      >
        <ChevronLeft size={16} /> Clientes
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: T.goldSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Fraunces',
            fontSize: 22,
            color: T.goldDeep,
            fontWeight: 700,
          }}
        >
          {client.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 19, color: T.ink }}>{client.name}</div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>{client.phone}</div>
        </div>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <Row label="Origem" value={client.origem} />
        <Row label="Serviço de interesse" value={client.service} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0' }}>
          <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted }}>Aniversário</span>
          <input
            value={bdayInput}
            onChange={(e) => setBdayInput(e.target.value)}
            onBlur={() => onChangeBirthday(bdayInput || '—')}
            placeholder="dd/mm"
            style={{
              border: 'none',
              borderBottom: `1px solid ${T.line}`,
              textAlign: 'right',
              fontFamily: 'Manrope',
              fontSize: 12.5,
              fontWeight: 700,
              color: T.ink,
              outline: 'none',
              width: 80,
              background: 'transparent',
            }}
          />
        </div>
      </Card>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Status da cliente</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {STATUS_LIST.map((s) => (
          <Chip key={s} active={client.status === s} onClick={() => onChangeStatus(s)}>
            {s}
          </Chip>
        ))}
      </div>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Gerar Mensagem IA</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {Object.keys(templates).map((t) => (
          <Chip key={t} active={msgType === t} onClick={() => setMsgType(t)}>
            {t}
          </Chip>
        ))}
      </div>
      {msgType && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{templates[msgType]}</div>
          <div style={{ marginTop: 12 }}>
            <PrimaryButton full icon={MethodIcon}>
              Enviar via {methodLabel}
            </PrimaryButton>
          </div>
        </Card>
      )}
    </div>
  );
}
