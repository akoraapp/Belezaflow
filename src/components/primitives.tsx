import type { CSSProperties, ReactNode } from 'react';
import { Check, ChevronLeft, type LucideIcon } from 'lucide-react';
import { T, CURRENCIES, STATUS_COLOR } from '../theme';
import { STATUS_LABEL } from '../i18n';
import { fmtMoney } from '../lib/helpers';
import { useLang } from '../lib/LangContext';
import type { Appointment, CurrencyCode, ServiceItem } from '../types';

export function GoalRing({ progress, size = 120, stroke = 10, center }: { progress: number; size?: number; stroke?: number; center?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="goldSweep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9BA6D" />
          <stop offset="100%" stopColor="#8A6D2F" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.goldSoft} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#goldSweep)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="50%" y="47%" textAnchor="middle" fontFamily="Fraunces" fontSize={size * 0.19} fill={T.ink} fontWeight="600">
        {Math.round(pct * 100)}%
      </text>
      <text x="50%" y="63%" textAnchor="middle" fontFamily="Manrope" fontSize={size * 0.075} fill={T.muted}>
        {center || 'da meta'}
      </text>
    </svg>
  );
}

export function Chip({ active, onClick, children, testId }: { active: boolean; onClick: () => void; children: ReactNode; testId?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      style={{
        padding: '9px 16px',
        borderRadius: 999,
        fontFamily: 'Manrope',
        fontSize: 13.5,
        fontWeight: 600,
        border: `1px solid ${active ? T.gold : T.line}`,
        background: active ? T.ink : 'transparent',
        color: active ? '#fff' : T.ink,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all .15s',
      }}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  full,
  disabled,
  icon: Icon,
  testId,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      style={{
        width: full ? '100%' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 22px',
        borderRadius: 14,
        border: 'none',
        background: disabled ? T.line : `linear-gradient(135deg, #C9A24B, #8A6D2F)`,
        color: disabled ? T.muted : '#fff',
        fontFamily: 'Manrope',
        fontWeight: 700,
        fontSize: 14.5,
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: disabled ? 'none' : '0 6px 16px -6px rgba(138,109,47,0.55)',
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function Card({ children, style, onClick, testId }: { children: ReactNode; style?: CSSProperties; onClick?: () => void; testId?: string }) {
  return (
    <div
      onClick={onClick}
      data-testid={testId}
      style={{
        background: T.surface,
        borderRadius: 18,
        padding: 16,
        border: `1px solid ${T.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, letterSpacing: 0.2 }}>{children}</div>
      {right}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  numeric,
  testId,
  type,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
  testId?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      data-testid={testId}
      onChange={(e) => onChange(numeric ? e.target.value.replace(/[^0-9]/g, '') : e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '13px 14px',
        borderRadius: 12,
        border: `1.5px solid ${T.line}`,
        fontFamily: 'Manrope',
        fontSize: 14,
        fontWeight: 600,
        color: T.ink,
        outline: 'none',
        boxSizing: 'border-box',
        background: '#fff',
      }}
    />
  );
}

interface PhoneCountry {
  iso: string;
  dial: string;
  flag: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: 'BR', dial: '+55', flag: '🇧🇷' },
  { iso: 'PT', dial: '+351', flag: '🇵🇹' },
  { iso: 'US', dial: '+1', flag: '🇺🇸' },
  { iso: 'CA', dial: '+1', flag: '🇨🇦' },
  { iso: 'MX', dial: '+52', flag: '🇲🇽' },
  { iso: 'CO', dial: '+57', flag: '🇨🇴' },
  { iso: 'AR', dial: '+54', flag: '🇦🇷' },
  { iso: 'CL', dial: '+56', flag: '🇨🇱' },
  { iso: 'ES', dial: '+34', flag: '🇪🇸' },
  { iso: 'CH', dial: '+41', flag: '🇨🇭' },
  { iso: 'GB', dial: '+44', flag: '🇬🇧' },
];

function splitPhone(value: string): { dial: string; rest: string } {
  const found = PHONE_COUNTRIES.find((c) => value === c.dial || value.startsWith(`${c.dial} `));
  if (found) return { dial: found.dial, rest: value.slice(found.dial.length).trimStart() };
  return { dial: PHONE_COUNTRIES[0].dial, rest: value };
}

export function PhoneInput({ value, onChange, placeholder, testId }: { value: string; onChange: (v: string) => void; placeholder?: string; testId?: string }) {
  const { dial, rest } = splitPhone(value);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <select
        value={dial}
        onChange={(e) => onChange(`${e.target.value} ${rest}`.trim())}
        data-testid={testId ? `${testId}-country` : undefined}
        style={{
          width: 96,
          flexShrink: 0,
          padding: '13px 6px',
          borderRadius: 12,
          border: `1.5px solid ${T.line}`,
          fontFamily: 'Manrope',
          fontSize: 13,
          fontWeight: 600,
          color: T.ink,
          outline: 'none',
          background: '#fff',
        }}
      >
        {PHONE_COUNTRIES.map((c) => (
          <option key={c.iso} value={c.dial}>
            {c.flag} {c.dial}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={rest}
        data-testid={testId}
        onChange={(e) => onChange(`${dial} ${e.target.value.replace(/[^0-9 ()-]/g, '')}`.trim())}
        placeholder={placeholder}
        style={{
          flex: 1,
          minWidth: 0,
          padding: '13px 14px',
          borderRadius: 12,
          border: `1.5px solid ${T.line}`,
          fontFamily: 'Manrope',
          fontSize: 14,
          fontWeight: 600,
          color: T.ink,
          outline: 'none',
          boxSizing: 'border-box',
          background: '#fff',
        }}
      />
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{children}</div>;
}

export function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <button
        onClick={onBack}
        style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${T.line}`, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <ChevronLeft size={16} color={T.ink} />
      </button>
      <div style={{ fontFamily: 'Fraunces', fontSize: 21, fontWeight: 600, color: T.ink }}>{title}</div>
    </div>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return (
    <div style={{ padding: 16, textAlign: 'center', fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, border: `1px dashed ${T.line}`, borderRadius: 14 }}>
      {text}
    </div>
  );
}

export function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${T.line}` }}>
      <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted }}>{label}</span>
      <span style={{ fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 700, color: T.ink }}>{value}</span>
    </div>
  );
}

export function StatBox({ label, value, accent, testId }: { label: string; value: string; accent?: string; testId?: string }) {
  return (
    <Card testId={testId} style={{ flex: 1, padding: 14 }}>
      <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 600, color: accent || T.ink, marginTop: 6 }}>{value}</div>
    </Card>
  );
}

export function StepLabel({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: T.ink,
          color: T.goldLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Manrope',
          fontWeight: 700,
          fontSize: 10.5,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, color: T.ink, textTransform: 'uppercase', letterSpacing: 0.4 }}>{children}</div>
    </div>
  );
}

export function ServiceOption({ s, active, currency, onClick }: { s: ServiceItem; active: boolean; currency: CurrencyCode; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 14px',
        borderRadius: 14,
        cursor: 'pointer',
        border: `1.5px solid ${active ? T.gold : T.line}`,
        background: active ? T.goldSoft : T.surface,
      }}
    >
      <div>
        <div style={{ fontFamily: 'Fraunces', fontSize: 14.5, color: T.ink }}>{s.name}</div>
        <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, marginTop: 1 }}>{s.duration} min</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 15, color: T.goldDeep, fontWeight: 600 }}>
          {CURRENCIES[currency].symbol}
          {fmtMoney(s.price, currency)}
        </div>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `1.5px solid ${active ? T.gold : T.line}`,
            background: active ? T.gold : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {active && <Check size={12} color="#fff" />}
        </div>
      </div>
    </div>
  );
}

export function IconButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px', borderRadius: 12, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer' }}
    >
      <Icon size={15} color={T.goldDeep} />
      <span style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.ink }}>{label}</span>
    </button>
  );
}

export function MiniField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted, marginBottom: 3 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, '')))}
        style={{
          width: '100%',
          minWidth: 0,
          border: `1px solid ${T.line}`,
          borderRadius: 8,
          padding: '6px 8px',
          fontFamily: 'Manrope',
          fontWeight: 600,
          fontSize: 13,
          color: T.ink,
          outline: 'none',
          boxSizing: 'border-box',
          background: '#fff',
        }}
      />
    </div>
  );
}

export function AppointmentRow({ a, currency, testId }: { a: Appointment; currency: CurrencyCode; testId?: string }) {
  const { lang } = useLang();
  return (
    <Card testId={testId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'center', minWidth: 40 }}>
          <div style={{ fontFamily: 'Fraunces', fontSize: 15, color: T.ink }}>{a.time}</div>
        </div>
        <div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: T.ink }}>{a.clientName}</div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>
            {a.service}
            {a.clientPhone ? ` · ${a.clientPhone}` : ''}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: T.goldDeep }}>
          {CURRENCIES[currency].symbol}
          {fmtMoney(a.price, currency)}
        </div>
        <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: STATUS_COLOR[a.status] || T.muted }}>
          {STATUS_LABEL[lang][a.status] || a.status}
          {a.origin === 'online' ? ' · Online' : ''}
        </div>
      </div>
    </Card>
  );
}
