import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Calendar, DollarSign, Plus, Ticket, Trash2 } from 'lucide-react';
import { T, CURRENCIES, RADIUS, SHADOW } from '../theme';
import { MONTH_NAMES, MONTH_ABBR } from '../i18n';
import { fmtCurrency, fmtMoney, format } from '../lib/helpers';
import { Card, Chip, TextInput, EmptyHint, PrimaryButton, StatBox } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import type { Appointment, CurrencyCode, FinanceEntry, Profile } from '../types';

function GoalGauge({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const textOnFill = clamped >= 50;
  return (
    <div style={{ width: 64, height: 64, borderRadius: RADIUS.control, position: 'relative', overflow: 'hidden', background: 'rgba(244,233,210,0.14)', flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${clamped}%`,
          background: `linear-gradient(180deg, ${T.goldLight}, ${T.gold})`,
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
          fontFamily: 'Playfair Display',
          fontWeight: 700,
          fontSize: 15,
          color: textOnFill ? T.ink : T.bg,
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150, marginTop: 6 }}>
      {data.map((d) => {
        const h = Math.max(4, Math.round((d.value / max) * 100));
        return (
          <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            {d.value > 0 && (
              <div style={{ fontFamily: 'Inter', fontSize: 9.5, fontWeight: 700, color: T.goldDeep, whiteSpace: 'nowrap' }}>{fmtMoney(d.value, currency)}</div>
            )}
            <div
              title={d.value > 0 ? fmtCurrency(d.value, currency) : undefined}
              style={{
                width: '100%',
                maxWidth: 26,
                height: `${h}%`,
                borderRadius: '6px 6px 3px 3px',
                background: d.value > 0 ? `linear-gradient(180deg, ${T.goldLight}, ${T.gold})` : T.line,
              }}
            />
            <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted }}>{d.label}</div>
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
    appointments.filter((a) => a.status === 'Compareceu' && new Date(a.createdAt).getFullYear() === year && new Date(a.createdAt).getMonth() === month);
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
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 25, fontWeight: 600, color: T.ink, marginBottom: 22 }}>{t.financeiro.title}</div>

      <div style={{ background: T.ink, borderRadius: RADIUS.card, padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: SHADOW.elevated }}>
        <GoalGauge pct={goalPct} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: T.goldLight }}>
            {t.financeiro.metaOfMonthPrefix} {monthName}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.bg, marginTop: 7, lineHeight: 1.5 }}>
            {remaining > 0
              ? `${t.financeiro.remainingToGoalPrefix} ${fmtCurrency(remaining, currency)} ${t.financeiro.remainingToGoalMiddle} ${fmtCurrency(profile.goal, currency)}`
              : t.financeiro.goalReached}
          </div>
        </div>
      </div>

      <div title={t.financeiro.periodLabel} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, marginBottom: isCurrentPeriod ? 26 : 10 }}>
        <Calendar size={12} color={T.muted} />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          data-testid="finance-month-select"
          style={{ border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: T.muted, outline: 'none', cursor: 'pointer' }}
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
          style={{ border: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: T.muted, outline: 'none', cursor: 'pointer' }}
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {!isCurrentPeriod && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 26, padding: '10px 12px', background: T.goldSoft, borderRadius: RADIUS.control }}>
          <span style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.goldDeep, fontWeight: 600 }}>
            {t.financeiro.viewingPeriodPrefix} {monthName} {selectedYear}
          </span>
          <button
            onClick={resetToCurrentPeriod}
            data-testid="finance-reset-period"
            style={{ border: 'none', background: 'transparent', color: T.goldDeep, fontFamily: 'Inter', fontWeight: 700, fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}
          >
            {t.financeiro.backToCurrentCta}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <StatBox label={t.financeiro.receitaMes} value={fmtCurrency(totalRev, currency)} icon={DollarSign} />
        <StatBox label={t.financeiro.ticketMedio} value={fmtCurrency(ticketMedio, currency)} icon={Ticket} />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 30 }}>
        <StatBox label={t.financeiro.totalReceber} value={fmtCurrency(aReceber, currency)} accent={T.success} icon={ArrowDownCircle} />
        <StatBox label={t.financeiro.totalPagar} value={fmtCurrency(aPagar, currency)} accent={T.danger} icon={ArrowUpCircle} />
      </div>

      {!isCurrentPeriod && periodAppointments.length === 0 && periodEntries.length === 0 && (
        <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 11.5, color: T.muted, marginTop: -20, marginBottom: 30 }}>{t.financeiro.noDataForPeriod}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 600, color: T.ink }}>{t.financeiro.contasTitle}</div>
        <PrimaryButton onClick={() => setShowAdd((v) => !v)} icon={Plus} variant="accent" testId="finance-add-toggle">
          {t.financeiro.addLancamentoCta}
        </PrimaryButton>
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
            <PrimaryButton full onClick={submit} disabled={!label || !value} variant="accent" testId="finance-add-submit">
              {t.financeiro.salvarLancamentoCta}
            </PrimaryButton>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
        {entries.length === 0 && !showAdd && <EmptyHint text={t.financeiro.noLancamentos} />}
        {entries.map((e) => (
          <Card key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: T.ink }}>{e.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: T.muted }}>
                {t.financeiro.venceLabel} {e.data}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: e.tipo === 'receber' ? T.success : T.danger }}>
                {e.tipo === 'receber' ? '+' : '-'}
                {fmtCurrency(e.value, currency)}
              </div>
              <Trash2 size={14} color={T.muted} style={{ cursor: 'pointer' }} onClick={() => removeEntry(e.id)} />
            </div>
          </Card>
        ))}
      </div>

      <div style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 12 }}>{t.financeiro.historicoTitle}</div>
      <Card style={{ marginBottom: 18 }}>
        <BarChart data={history} currency={currency} />
      </Card>

      <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 11, color: T.muted }}>
        {format('{prefix} {currency} · {suffix}', { prefix: t.financeiro.footerNotePrefix, currency, suffix: t.financeiro.footerNoteSuffix })}
      </div>
    </div>
  );
}
