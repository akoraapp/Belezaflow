import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { fmtMoney } from '../lib/helpers';
import { Card, Chip, TextInput, EmptyHint, PrimaryButton, GoalRing, StatBox } from '../components/primitives';
import type { Appointment, CurrencyCode, FinanceEntry, Profile } from '../types';

interface FinanceiroScreenProps {
  appointments: Appointment[];
  profile: Profile;
  currency: CurrencyCode;
  entries: FinanceEntry[];
  addEntry: (e: FinanceEntry) => void;
  removeEntry: (id: string) => void;
}

export function FinanceiroScreen({ appointments, profile, currency, entries, addEntry, removeEntry }: FinanceiroScreenProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [tipo, setTipo] = useState<'receber' | 'pagar'>('receber');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('');

  const dayRev = appointments.filter((a) => a.day === 'hoje').reduce((s, a) => s + a.price, 0);
  const totalRev = appointments.filter((a) => a.status !== 'Cancelado').reduce((s, a) => s + a.price, 0);
  const progress = Math.min(1, totalRev / (profile.goal || 1));
  const ticketMedio = appointments.length ? Math.round(appointments.reduce((s, a) => s + a.price, 0) / appointments.length) : 0;

  const aReceber = entries.filter((e) => e.tipo === 'receber').reduce((s, e) => s + Number(e.value), 0);
  const aPagar = entries.filter((e) => e.tipo === 'pagar').reduce((s, e) => s + Number(e.value), 0);

  const submit = () => {
    if (!label || !value) return;
    addEntry({ id: `f${Date.now()}`, tipo, label, value: Number(value), data: data || '—' });
    setLabel('');
    setValue('');
    setData('');
    setShowAdd(false);
  };

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 16 }}>Financeiro</div>

      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>Faturamento acumulado (agendamentos)</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 21, color: T.ink }}>
            {CURRENCIES[currency].symbol}
            {fmtMoney(totalRev, currency)}
          </div>
        </div>
        <GoalRing progress={progress} size={80} stroke={7} center="da meta" />
      </Card>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <StatBox label="Hoje" value={`${CURRENCIES[currency].symbol}${fmtMoney(dayRev, currency)}`} />
        <StatBox label="Ticket médio" value={`${CURRENCIES[currency].symbol}${fmtMoney(ticketMedio, currency)}`} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <StatBox label="A receber" value={`${CURRENCIES[currency].symbol}${fmtMoney(aReceber, currency)}`} accent={T.success} />
        <StatBox label="A pagar" value={`${CURRENCIES[currency].symbol}${fmtMoney(aPagar, currency)}`} accent={T.danger} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink }}>Contas a pagar e a receber</div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          data-testid="finance-add-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: 'none',
            background: T.goldSoft,
            color: T.goldDeep,
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            padding: '7px 12px',
            borderRadius: 999,
          }}
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <Chip active={tipo === 'receber'} onClick={() => setTipo('receber')}>
              A receber
            </Chip>
            <Chip active={tipo === 'pagar'} onClick={() => setTipo('pagar')}>
              A pagar
            </Chip>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextInput value={label} onChange={setLabel} placeholder="Descrição — ex: Aluguel do espaço" testId="finance-label" />
            <TextInput value={value} onChange={setValue} placeholder={`Valor (${CURRENCIES[currency].symbol})`} numeric testId="finance-value" />
            <TextInput value={data} onChange={setData} placeholder="Vencimento — ex: 15/07" />
          </div>
          <div style={{ marginTop: 12 }}>
            <PrimaryButton full onClick={submit} disabled={!label || !value} testId="finance-add-submit">
              Salvar lançamento
            </PrimaryButton>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.length === 0 && !showAdd && <EmptyHint text="Nenhum lançamento registrado ainda. Toque em “Adicionar” para incluir contas a pagar ou a receber." />}
        {entries.map((e) => (
          <Card key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: T.ink }}>{e.label}</div>
              <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted }}>Vence {e.data}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: e.tipo === 'receber' ? T.success : T.danger }}>
                {e.tipo === 'receber' ? '+' : '-'}
                {CURRENCIES[currency].symbol}
                {fmtMoney(e.value, currency)}
              </div>
              <Trash2 size={14} color={T.muted} style={{ cursor: 'pointer' }} onClick={() => removeEntry(e.id)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
