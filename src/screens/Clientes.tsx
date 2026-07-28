import { useState } from 'react';
import { ChevronLeft, MessageCircle, MessageSquare, Plus } from 'lucide-react';
import { T, RADIUS, ORIGENS, STATUS_LIST, STATUS_COLOR, CURRENCIES } from '../theme';
import { STATUS_LABEL, ORIGEM_LABEL } from '../i18n';
import { Card, Chip, TextInput, PhoneInput, EmptyHint, PrimaryButton, Row, SectionTitle, StatBox, SelectInput } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { format, fmtMoney } from '../lib/helpers';
import { buildNoShowMessage, buildWhatsAppLink } from '../lib/followup';
import { useProfile } from '../hooks/useProfile';
import { useClients } from '../hooks/useClients';
import { useServices } from '../hooks/useServices';
import { useAppointments } from '../hooks/useAppointments';
import type { Appointment, Client, ContactMethod, CurrencyCode } from '../types';

interface ClientesScreenProps {
  initialFilter?: string;
  initialSelectedId?: string | null;
}

export function ClientesScreen({ initialFilter, initialSelectedId }: ClientesScreenProps) {
  const { t, lang } = useLang();
  const { profile } = useProfile();
  const { clients, addClient, updateClient } = useClients();
  const { services } = useServices();
  const { appointments, markFollowUpSent: onFollowUpSent } = useAppointments();
  const [filter, setFilter] = useState(initialFilter ?? 'Todos');
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [birthday, setBirthday] = useState('');
  const [origem, setOrigem] = useState('Instagram');
  if (!profile) return null;
  const currency = profile.currency;
  const contactMethod = profile.contactMethod;
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
    const clientAppointments = appointments.filter((a) => (selected.phone && a.clientPhone === selected.phone) || a.clientName === selected.name);
    const pendingNoShow = clientAppointments.find((a) => a.status === 'NaoCompareceu' && !a.followUpSent);
    return (
      <ClienteDetail
        client={selected}
        currency={currency}
        clientAppointments={clientAppointments}
        onBack={() => setSelectedId(null)}
        contactMethod={contactMethod}
        onChangeStatus={(status) => updateClient(selected.id, { status })}
        onChangeBirthday={(bday) => updateClient(selected.id, { birthday: bday })}
        pendingNoShow={pendingNoShow}
        onFollowUpSent={onFollowUpSent}
      />
    );
  }

  const attendedCount = appointments.filter((a) => a.status === 'Compareceu').length;
  const noShowCount = appointments.filter((a) => a.status === 'NaoCompareceu').length;
  const trackedCount = attendedCount + noShowCount;
  const attendanceRate = trackedCount > 0 ? Math.round((attendedCount / trackedCount) * 100) : null;

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 25, fontWeight: 400, color: T.ink }}>{t.clientes.title}</div>
        <PrimaryButton variant="accent" onClick={() => setShowAdd((v) => !v)} icon={Plus} testId="clientes-add-toggle">
          {t.clientes.newClientCta}
        </PrimaryButton>
      </div>

      <div style={{ borderRadius: RADIUS.card, padding: '14px 18px', background: T.ink, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.gold }}>{t.clientes.attendanceRateLabel}</div>
        <div style={{ fontFamily: 'Inter', fontSize: attendanceRate === null ? 12.5 : 18, fontWeight: 700, color: attendanceRate === null ? 'rgba(255,255,255,0.5)' : '#fff' }}>
          {attendanceRate === null ? t.clientes.noAttendanceDataLabel : `${attendanceRate}%`}
        </div>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{t.clientes.newClientFormTitle}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextInput value={name} onChange={setName} placeholder={t.clientes.namePlaceholder} testId="clientes-name" />
            <PhoneInput value={phone} onChange={setPhone} placeholder={t.clientes.phonePlaceholder} testId="clientes-phone" />
            <TextInput value={birthday} onChange={setBirthday} placeholder={t.clientes.birthdayPlaceholder} />
          </div>

          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, margin: '10px 0 8px' }}>{t.clientes.serviceLabel}</div>
          {services.length === 0 ? (
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 4 }}>{t.clientes.noServicesToSelect}</div>
          ) : (
            <div style={{ marginBottom: 4 }}>
              <SelectInput
                options={services.map((s) => s.name)}
                value={service}
                onChange={setService}
                placeholder={t.clientes.serviceSelectPlaceholder}
                testId="clientes-service-select"
              />
            </div>
          )}

          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted, margin: '10px 0 8px' }}>{t.clientes.originLabel}</div>
          <div style={{ marginBottom: 12 }}>
            <SelectInput options={ORIGENS} value={origem} onChange={setOrigem} labelFor={(o) => ORIGEM_LABEL[lang][o] || o} testId="clientes-origin-select" />
          </div>
          <PrimaryButton full onClick={submit} disabled={!name} testId="clientes-add-submit">
            {t.clientes.addClientCta}
          </PrimaryButton>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
        {['Todos', ...STATUS_LIST].map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s === 'Todos' ? t.clientes.filterAll : STATUS_LABEL[lang][s]}
          </Chip>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && <EmptyHint text={t.clientes.noClientsInFilter} />}
        {filtered.map((c) => (
          <Card key={c.id} onClick={() => setSelectedId(c.id)} testId={`cliente-row-${c.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
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
                  fontFamily: 'Playfair Display',
                  color: T.goldDeep,
                  fontWeight: 700,
                }}
              >
                {c.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13.5, color: T.ink }}>{c.name}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted }}>
                  {ORIGEM_LABEL[lang][c.origem] || c.origem} · {c.service}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 10.5, fontWeight: 700, color: STATUS_COLOR[c.status], padding: '3px 9px', borderRadius: 999, background: T.surfaceAlt }}>
              {STATUS_LABEL[lang][c.status] || c.status}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClienteDetail({
  client,
  currency,
  clientAppointments,
  onBack,
  contactMethod,
  onChangeStatus,
  onChangeBirthday,
  pendingNoShow,
  onFollowUpSent,
}: {
  client: Client;
  currency: CurrencyCode;
  clientAppointments: Appointment[];
  onBack: () => void;
  contactMethod: ContactMethod;
  onChangeStatus: (status: string) => void;
  onChangeBirthday: (bday: string) => void;
  pendingNoShow?: Appointment;
  onFollowUpSent: (appointmentId: string) => void;
}) {
  const { t, lang } = useLang();
  const attendedAppointments = clientAppointments.filter((a) => a.status === 'Compareceu');
  const totalGasto = attendedAppointments.reduce((s, a) => s + a.price, 0);
  const visitas = attendedAppointments.length;
  const [msgType, setMsgType] = useState<string | null>(null);
  const [bdayInput, setBdayInput] = useState(client.birthday === '—' ? '' : client.birthday || '');
  const [copied, setCopied] = useState(false);
  const [noShowCopied, setNoShowCopied] = useState(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const templateBodies: Record<string, Record<string, string>> = {
    pt: {
      primeiroContato: `Olá ${client.name}! 😊 Vi seu interesse em ${client.service}. Posso te ajudar a encontrar o melhor horário?`,
      followUp: `Oi ${client.name}, tudo bem? Ainda está pensando em agendar seu ${client.service}? Tenho horários abrindo essa semana!`,
      quebraObjecao: `Entendo, ${client.name}! Se for sobre o valor, posso te mostrar as formas de pagamento que temos disponíveis 💛`,
      fechamento: `${client.name}, consigo te encaixar para o ${client.service} — vamos confirmar seu horário?`,
      reativacao: `Saudades por aqui, ${client.name}! Que tal renovar seu ${client.service}? Tenho uma condição especial essa semana.`,
    },
    en: {
      primeiroContato: `Hi ${client.name}! 😊 I saw you're interested in ${client.service}. Can I help you find the best time?`,
      followUp: `Hi ${client.name}, how are you? Still thinking about booking your ${client.service}? I have openings this week!`,
      quebraObjecao: `I understand, ${client.name}! If it's about the price, I can show you the payment options we have 💛`,
      fechamento: `${client.name}, I can fit you in for your ${client.service} — shall we confirm your time?`,
      reativacao: `Missed you here, ${client.name}! How about renewing your ${client.service}? I have a special offer this week.`,
    },
    es: {
      primeiroContato: `¡Hola ${client.name}! 😊 Vi tu interés en ${client.service}. ¿Te ayudo a encontrar el mejor horario?`,
      followUp: `Hola ${client.name}, ¿todo bien? ¿Aún estás pensando en agendar tu ${client.service}? ¡Tengo horarios disponibles esta semana!`,
      quebraObjecao: `Entiendo, ${client.name}! Si es por el precio, puedo mostrarte las formas de pago que tenemos disponibles 💛`,
      fechamento: `${client.name}, puedo agendarte para tu ${client.service} — ¿confirmamos tu horario?`,
      reativacao: `¡Te extrañamos por aquí, ${client.name}! ¿Qué tal renovar tu ${client.service}? Tengo una condición especial esta semana.`,
    },
  };

  const templateKeys = ['primeiroContato', 'followUp', 'quebraObjecao', 'fechamento', 'reativacao'] as const;
  const methodLabel = contactMethod === 'sms' ? 'SMS' : 'WhatsApp';
  const MethodIcon = contactMethod === 'sms' ? MessageSquare : MessageCircle;

  const sendTemplateMessage = async () => {
    if (!msgType) return;
    const message = templateBodies[lang][msgType];
    const waLink = client.phone ? buildWhatsAppLink(client.phone, message) : null;
    if (contactMethod === 'whatsapp' && waLink) {
      window.open(waLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (await copyText(message)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const noShowMessage = pendingNoShow ? buildNoShowMessage(client.name, pendingNoShow.service, lang) : '';
  const noShowWaLink = pendingNoShow && client.phone ? buildWhatsAppLink(client.phone, noShowMessage) : null;

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
          fontFamily: 'Inter',
          fontSize: 13,
          color: T.muted,
          marginBottom: 14,
          padding: 0,
        }}
      >
        <ChevronLeft size={16} /> {t.clientes.backToClientes}
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
            fontFamily: 'Playfair Display',
            fontSize: 22,
            color: T.goldDeep,
            fontWeight: 700,
          }}
        >
          {client.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 19, fontWeight: 400, color: T.ink }}>{client.name}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{client.phone}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <StatBox label={t.clientes.totalGastoLabel} value={`${CURRENCIES[currency].symbol}${fmtMoney(totalGasto, currency)}`} />
        <StatBox label={t.clientes.visitasLabel} value={String(visitas)} />
      </div>

      <Card style={{ marginBottom: 20 }}>
        <Row label={t.clientes.originRowLabel} value={ORIGEM_LABEL[lang][client.origem] || client.origem} />
        <Row label={t.clientes.serviceRowLabel} value={client.service} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted }}>{t.clientes.birthdayLabel}</span>
          <input
            value={bdayInput}
            onChange={(e) => setBdayInput(e.target.value)}
            onBlur={() => onChangeBirthday(bdayInput || '—')}
            placeholder={t.clientes.birthdayInputPlaceholder}
            style={{
              border: 'none',
              borderBottom: `1px solid ${T.line}`,
              textAlign: 'right',
              fontFamily: 'Inter',
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

      {pendingNoShow && (
        <Card style={{ marginBottom: 20, border: `1.5px solid ${T.danger}` }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: T.danger, marginBottom: 6 }}>{t.clientes.noShowFollowUpTitle}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.ink, marginBottom: 10, lineHeight: 1.5 }}>
            {format(t.clientes.noShowFollowUpBody, { name: client.name, service: pendingNoShow.service })}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.ink, lineHeight: 1.5, background: T.surfaceAlt, borderRadius: RADIUS.control, padding: 12, marginBottom: 10 }}>{noShowMessage}</div>
          {!client.phone && <div style={{ fontFamily: 'Inter', fontSize: 11, color: T.muted, marginBottom: 10 }}>{t.clientes.noPhoneHint}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            {noShowWaLink && (
              <button
                onClick={() => {
                  window.open(noShowWaLink, '_blank', 'noopener,noreferrer');
                  onFollowUpSent(pendingNoShow.id);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  border: 'none',
                  borderRadius: RADIUS.control,
                  background: T.ink,
                  color: '#fff',
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 12.5,
                  padding: '10px 12px',
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={14} /> {t.clientes.openWhatsAppCta}
              </button>
            )}
            <button
              onClick={async () => {
                if (await copyText(noShowMessage)) {
                  setNoShowCopied(true);
                  setTimeout(() => setNoShowCopied(false), 1500);
                  onFollowUpSent(pendingNoShow.id);
                }
              }}
              style={{
                flex: 1,
                border: `1.5px solid ${T.line}`,
                borderRadius: RADIUS.control,
                background: T.surface,
                color: T.ink,
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 12.5,
                padding: '10px 12px',
                cursor: 'pointer',
              }}
            >
              {noShowCopied ? t.clientes.copiedMessageLabel : t.clientes.copyMessageCta}
            </button>
          </div>
        </Card>
      )}

      <SectionTitle>{t.clientes.clientStatusTitle}</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {STATUS_LIST.map((s) => (
          <Chip key={s} active={client.status === s} onClick={() => onChangeStatus(s)}>
            {STATUS_LABEL[lang][s]}
          </Chip>
        ))}
      </div>

      <SectionTitle>{t.clientes.centralRespostasTitle}</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {templateKeys.map((k) => (
          <Chip key={k} active={msgType === k} onClick={() => setMsgType(k)}>
            {t.clientes.msgTemplateLabels[k]}
          </Chip>
        ))}
      </div>
      {msgType && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{templateBodies[lang][msgType]}</div>
          {!client.phone && contactMethod === 'whatsapp' && (
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: T.muted, marginTop: 8 }}>{t.clientes.noPhoneHint}</div>
          )}
          <div style={{ marginTop: 12 }}>
            <PrimaryButton full icon={MethodIcon} onClick={sendTemplateMessage} testId="clientes-send-template">
              {copied ? t.clientes.copiedMessageLabel : `${t.clientes.sendViaPrefix} ${methodLabel}`}
            </PrimaryButton>
          </div>
        </Card>
      )}
    </div>
  );
}
