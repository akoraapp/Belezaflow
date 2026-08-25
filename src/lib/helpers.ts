import { ALL_SLOTS, CURRENCIES, WEEKDAY_LABELS } from '../theme';
import type { Appointment, CurrencyCode, Lang, Profile } from '../types';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function todayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateStrToLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function weekdayLabelForDate(dateStr: string) {
  return WEEKDAY_LABELS[dateStrToLocalDate(dateStr).getDay()];
}

export function getAvailability(profile: Profile | null, appointments: Appointment[]) {
  const dateStr = todayDateStr();
  const today = (appointments || []).filter((a) => a.day === dateStr);
  const workingDays = profile?.workingDays || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const isWorkingToday = workingDays.includes(weekdayLabelForDate(dateStr));
  const chosenSlots = profile?.availableSlots?.length ? profile.availableSlots : ALL_SLOTS;
  // A cancelled appointment no longer occupies its slot — mirrors the DB's
  // appointments_unique_active_slot partial index, which excludes 'Cancelado'
  // so the same time can be rebooked.
  const availableSlots = isWorkingToday ? chosenSlots.filter((t) => !today.some((a) => a.time === t && a.status !== 'Cancelado')) : [];
  return { today, isWorkingToday, workingDays, chosenSlots, availableSlots };
}

// Used by the public booking preview: unlike getAvailability (always "today"), this computes
// open slots for an arbitrary calendar date, so a client can book any upcoming working day,
// not just today.
export function getAvailableSlotsForDate(profile: Profile | null, appointments: Appointment[], dateStr: string) {
  const workingDays = profile?.workingDays || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  if (!workingDays.includes(weekdayLabelForDate(dateStr))) return [];
  const chosenSlots = profile?.availableSlots?.length ? profile.availableSlots : ALL_SLOTS;
  const bookedTimes = new Set((appointments || []).filter((a) => a.day === dateStr && a.status !== 'Cancelado').map((a) => a.time));
  return chosenSlots.filter((t) => !bookedTimes.has(t));
}

export interface BookableDay {
  dateStr: string;
  weekday: string;
  dayOfMonth: number;
  month: number;
}

// Enumerates the next `daysAhead` calendar days that fall on one of the professional's
// working days, for the public booking day picker.
export function getBookableDays(profile: Profile | null, daysAhead = 14): BookableDay[] {
  const workingDays = profile?.workingDays || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const result: BookableDay[] = [];
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const weekday = WEEKDAY_LABELS[d.getDay()];
    if (workingDays.includes(weekday)) {
      result.push({ dateStr: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`, weekday, dayOfMonth: d.getDate(), month: d.getMonth() + 1 });
    }
  }
  return result;
}

export function todayIsBirthday(dateStr?: string) {
  if (!dateStr) return false;
  const m = dateStr.match(/^(\d{1,2})\/(\d{1,2})/);
  if (!m) return false;
  const now = new Date();
  return Number(m[1]) === now.getDate() && Number(m[2]) === now.getMonth() + 1;
}

export function format(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}

export function fmtMoney(value: number, currency: CurrencyCode) {
  const c = CURRENCIES[currency] || CURRENCIES.BRL;
  try {
    return new Intl.NumberFormat(c.locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      .format(value || 0)
      .replace(/\s/g, '.');
  } catch {
    return String(value || 0);
  }
}

export function fmtCurrency(value: number, currency: CurrencyCode) {
  return `${CURRENCIES[currency].symbol} ${fmtMoney(value, currency)}`;
}

// Slot times are stored internally as 24h "HH:MM" strings (sorting/comparison relies on
// this). English speakers conventionally read schedules in 12h AM/PM, so only the display
// label is reformatted for 'en' — pt and es keep the 24h format common in their locales.
export function formatTimeLabel(time: string, lang: Lang) {
  if (lang !== 'en') return time;
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

const RELATIVE_TIME_WORDS: Record<Lang, { now: string; minAgo: (n: number) => string; hAgo: (n: number) => string; dAgo: (n: number) => string }> = {
  pt: { now: 'agora', minAgo: (n) => `há ${n} min`, hAgo: (n) => `há ${n} h`, dAgo: (n) => `há ${n} d` },
  en: { now: 'now', minAgo: (n) => `${n} min ago`, hAgo: (n) => `${n} h ago`, dAgo: (n) => `${n} d ago` },
  es: { now: 'ahora', minAgo: (n) => `hace ${n} min`, hAgo: (n) => `hace ${n} h`, dAgo: (n) => `hace ${n} d` },
};

export function relativeTimeLabel(timestampMs: number, lang: Lang) {
  const words = RELATIVE_TIME_WORDS[lang] || RELATIVE_TIME_WORDS.pt;
  const minutes = Math.max(0, Math.floor((Date.now() - timestampMs) / 60000));
  if (minutes < 1) return words.now;
  if (minutes < 60) return words.minAgo(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return words.hAgo(hours);
  return words.dAgo(Math.floor(hours / 24));
}
