import { ALL_SLOTS, CURRENCIES, WEEKDAY_LABELS } from '../theme';
import type { Appointment, CurrencyCode, Profile } from '../types';

export function getAvailability(profile: Profile | null, appointments: Appointment[]) {
  const today = (appointments || []).filter((a) => a.day === 'hoje');
  const todayLabel = WEEKDAY_LABELS[new Date().getDay()];
  const workingDays = profile?.workingDays || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const isWorkingToday = workingDays.includes(todayLabel);
  const chosenSlots = profile?.availableSlots?.length ? profile.availableSlots : ALL_SLOTS;
  const availableSlots = isWorkingToday ? chosenSlots.filter((t) => !today.some((a) => a.time === t)) : [];
  return { today, isWorkingToday, workingDays, chosenSlots, availableSlots };
}

export function todayIsBirthday(dateStr?: string) {
  if (!dateStr) return false;
  const m = dateStr.match(/^(\d{1,2})\/(\d{1,2})/);
  if (!m) return false;
  const now = new Date();
  return Number(m[1]) === now.getDate() && Number(m[2]) === now.getMonth() + 1;
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
