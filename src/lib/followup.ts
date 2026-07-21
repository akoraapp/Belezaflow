import type { Lang } from '../types';

const NO_SHOW_TEMPLATES: Record<Lang, (name: string, service: string) => string> = {
  pt: (name, service) => `Oi ${name}! Senti sua falta no horário de ${service} 💛 Tudo bem? Quando puder, me chama pra gente remarcar num horário que fique bom pra você.`,
  en: (name, service) => `Hi ${name}! We missed you at your ${service} appointment 💛 Everything okay? Whenever you're ready, just message me and we'll find a new time that works for you.`,
  es: (name, service) => `¡Hola ${name}! Te extrañamos en tu cita de ${service} 💛 ¿Todo bien? Cuando puedas, escríbeme y buscamos un nuevo horario que te quede bien.`,
};

export function buildNoShowMessage(clientName: string, serviceName: string, lang: Lang) {
  const template = NO_SHOW_TEMPLATES[lang] || NO_SHOW_TEMPLATES.pt;
  return template(clientName, serviceName);
}

export function digitsOnly(phone: string) {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppLink(phone: string, message: string) {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
