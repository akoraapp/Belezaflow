import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { MONTH_NAMES, MONTH_ABBR } from '../i18n';
import { fmtCurrency, format } from '../lib/helpers';
import { Card, Chip, TextInput, EmptyHint, PrimaryButton, StatBox } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { Appointment, CurrencyCode, FinanceEntry, Profile } from '../types';

function GoalGauge({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const textOnFill = clamped >= 50;
  return (
    <div style={{ width: 64, height: 64, borderRadius: 16, position: 'relative', overflow: 'hidden', background: 'rgba(244,233,210,0.14)', flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${clamped}%`,
          background: 'linear-gradient(180deg, #E3C989, #B98D3E)',
          transition: 'height 0.6s ease',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Cormorant Garamond',
          fontWeight: 700,
          fontSize: 15,
          color: textOnFill ? '#1B1712' : '#F4E9D2',
        }}
      >
        {Math.round(clamped)}%
      </div>
    </div>
  );
}

function BarChart({ data, currency }: { data: { label: string; value: number }[]; currency: CurrencyCode }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130, marginTop: 6 }}>
      {data.map((d) => {
        const h = Math.max(4, Math.round((d.value / max) * 100));
        return (
          <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
            <div
              title={d.value > 0 ? fmtCurrency(d.value, currency) : undefined}
              style={{
                width: '100%',
                maxWidth: 26,
                height: `${h}%`,
                borderRadius: '6px 6px 3px 3px',
                background: d.value > 0 ? `linear-gradient(180deg, #D9BA6D, #B8933E)` : T.line,
              }}
            />
            <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

interface FinanceiroScreenProps {
  appointments: Appointment[];
  profile: Profile;
  currency: CurrencyCode;
  entries: FinanceEntry[];
  addEntry: (e: FinanceEntry) => void;
  removeEntry: (id: string) => void;
}

export function FinanceiroScreen({ appointments, profile, currency, entries, addEntry, removeEntry }: FinanceiroScreenProps) {
  const { t, lang } = useLang();
  const [showAdd, setShowAdd] = useState(false);
  const [tipo, setTipo] = useState<'receber' | 'pagar'>('receber');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const isCurrentPeriod = selectedYear === currentYear && selectedMonth === currentMonth;
  const yearOptions = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i);

  const appointmentsInPeriod = (year: number, month: number) =>
    appointments.filter((a) => a.status !== 'Cancelado' && new Date(a.createdAt).getFullYear() === year && new Date(a.createdAt).getMonth() === month);
  const entriesInPeriod = (year: number, month: number) =>
    entries.filter((e) => new Date(e.createdAt).getFullYear() === year && new Date(e.createdAt).getMonth() === month);

  const periodAppointments = appointmentsInPeriod(selectedYear, selectedMonth);
  const periodEntries = entriesInPeriod(selectedYear, selectedMonth);

  const totalRev = periodAppointments.reduce((s, a) => s + a.price, 0);
  const goalPct = profile.goal > 0 ? Math.min(100, Math.round((totalRev / profile.goal) * 100)) : 0;
  const remaining = Math.max(0, profile.goal - totalRev);
  const ticketMedio = periodAppointments.length ? Math.round(periodAppointments.reduce((s, a) => s + a.price, 0) / periodAppointments.length) : 0;

  const aReceber = periodEntries.filter((e) => e.tipo === 'receber').reduce((s, e) => s + Number(e.value), 0);
  const aPagar = periodEntries.filter((e) => e.tipo === 'pagar').reduce((s, e) => s + Number(e.value), 0);

  const monthName = MONTH_NAMES[lang][selectedMonth];
  const history = Array.from({ length: 6 }).map((_, i) => {
    const idx = currentMonth - (5 - i);
    const monthIdx = ((idx % 12) + 12) % 12;
    const yearOffset = Math.floor((currentMonth - (5 - i)) / 12);
    const yearForMonth = currentYear + yearOffset;
    const revenue = appointmentsInPeriod(yearForMonth, monthIdx).reduce((s, a) => s + a.price, 0);
    return { label: MONTH_ABBR[lang][monthIdx], value: revenue };
  });

  const resetToCurrentPeriod = () => {
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  };

  const submit = () => {
    if (!label || !value) return;
    addEntry({ id: `f${Date.now()}`, tipo, label, value: Number(value), data: data || '—', createdAt: Date.now() });
    setLabel('');
    setValue('');
    setData('');
    setShowAdd(false);
  };

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 16 }}>{t.financeiro.title}</div>

      <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
        {t.financeiro.periodLabel}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          data-testid="finance-month-select"
          style={{ flex: 1.4, padding: '11px 10px', borderRadius: 12, border: `1.5px solid ${T.line}`, fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, color: T.ink, background: '#fff', outline: 'none' }}
        >
          {MONTH_NAMES[lang].map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          data-testid="finance-year-select"
          style={{ flex: 1, padding: '11px 10px', borderRadius: 12, border: `1.5px solid ${T.line}`, fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, color: T.ink, background: '#fff', outline: 'none' }}
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {!isCurrentPeriod && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12, padding: '10px 12px', background: T.goldSoft, borderRadius: 12 }}>
          <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.goldDeep, fontWeight: 600 }}>
            {t.financeiro.viewingPeriodPrefix} {monthName} {selectedYear}
          </span>
          <button
            onClick={resetToCurrentPeriod}
            data-testid="finance-reset-period"
            style={{ border: 'none', background: 'transparent', color: T.goldDeep, fontFamily: 'Manrope', fontWeight: 700, fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}
          >
            {t.financeiro.backToCurrentCta}
          </button>
        </div>
      )}

      <div style={{ background: T.ink, borderRadius: 20, padding: 18, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <GoalGauge pct={goalPct} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: T.goldLight }}>
            {t.financeiro.metaOfMonthPrefix} {monthName}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, color: '#F4E9D2', marginTop: 6, lineHeight: 1.4 }}>
            {remaining > 0
              ? `${t.financeiro.remainingToGoalPrefix} ${fmtCurrency(remaining, currency)} ${t.financeiro.remainingToGoalMiddle} ${fmtCurrency(profile.goal, currency)}`
              : t.financeiro.goalReached}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <StatBox label={t.financeiro.receitaMes} value={fmtCurrency(totalRev, currency)} />
        <StatBox label={t.financeiro.ticketMedio} value={fmtCurrency(ticketMedio, currency)} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <StatBox label={t.financeiro.totalReceber} value={fmtCurrency(aReceber, currency)} accent={T.success} />
        <StatBox label={t.financeiro.totalPagar} value={fmtCurrency(aPagar, currency)} accent={T.danger} />
      </div>

      {!isCurrentPeriod && periodAppointments.length === 0 && periodEntries.length === 0 && (
        <div style={{ textAlign: 'center', fontFamily: 'Manrope', fontSize: 11.5, color: T.muted, marginTop: -10, marginBottom: 20 }}>{t.financeiro.noDataForPeriod}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 15.5, fontWeight: 600, color: T.ink }}>{t.financeiro.contasTitle}</div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          data-testid="finance-add-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: 'none',
            background: T.ink,
            color: '#fff',
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            padding: '7px 12px',
            borderRadius: 999,
          }}
        >
          <Plus size={14} /> {t.financeiro.addLancamentoCta}
        </button>
      </div>

      {showAdd && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <Chip active={tipo === 'receber'} onClick={() => setTipo('receber')}>
              {t.financeiro.tipoReceber}
            </Chip>
            <Chip active={tipo === 'pagar'} onClick={() => setTipo('pagar')}>
              {t.financeiro.tipoPagar}
            </Chip>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextInput value={label} onChange={setLabel} placeholder={t.financeiro.descricaoPlaceholder} testId="finance-label" />
            <TextInput value={value} onChange={setValue} placeholder={`${t.financeiro.valorPlaceholderPrefix} (${CURRENCIES[currency].symbol})`} numeric testId="finance-value" />
            <TextInput value={data} onChange={setData} placeholder={t.financeiro.vencimentoPlaceholder} />
          </div>
          <div style={{ marginTop: 12 }}>
            <PrimaryButton full onClick={submit} disabled={!label || !value} testId="finance-add-submit">
              {t.financeiro.salvarLancamentoCta}
            </PrimaryButton>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {entries.length === 0 && !showAdd && <EmptyHint text={t.financeiro.noLancamentos} />}
        {entries.map((e) => (
          <Card key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: T.ink }}>{e.label}</div>
              <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted }}>
                {t.financeiro.venceLabel} {e.data}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: e.tipo === 'receber' ? T.success : T.danger }}>
                {e.tipo === 'receber' ? '+' : '-'}
                {fmtCurrency(e.value, currency)}
              </div>
              <Trash2 size={14} color={T.muted} style={{ cursor: 'pointer' }} onClick={() => removeEntry(e.id)} />
            </div>
          </Card>
        ))}
      </div>

      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{t.financeiro.historicoTitle}</div>
      <Card style={{ marginBottom: 14 }}>
        <BarChart data={history} currency={currency} />
      </Card>

      <div style={{ textAlign: 'center', fontFamily: 'Manrope', fontSize: 11, color: T.muted }}>
        {format('{prefix} {currency} · {suffix}', { prefix: t.financeiro.footerNotePrefix, currency, suffix: t.financeiro.footerNoteSuffix })}
      </div>
    </div>
  );
}
