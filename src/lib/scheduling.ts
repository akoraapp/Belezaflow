// Canonical hourly booking slots (language-agnostic 24h format) and weekday
// index helpers shared between Agenda setup (which days/slots are open) and
// the public booking flow (which slots are still free).

export const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// 0 = Monday .. 6 = Sunday, matching the display order of agendaSetup.days
// in content.ts for both locales (Seg..Dom / Mon..Sun).
export const DEFAULT_WORKING_DAYS = [0, 1, 2, 3, 4];

export function todayWeekdayIndex(): number {
  const jsDay = new Date().getDay(); // 0 = Sunday .. 6 = Saturday
  return (jsDay + 6) % 7; // shift to 0 = Monday .. 6 = Sunday
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
