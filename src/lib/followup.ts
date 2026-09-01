import { format } from './helpers';
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

// Built-in appointment-confirmation message, used whenever the professional
// hasn't customized their own template (see profiles.confirmation_message_template,
// edited in Config.tsx). Placeholders match format()'s {key} syntax.
const CONFIRMATION_TEMPLATES: Record<Lang, string> = {
  pt: 'Olá {nome_cliente}! Confirmando seu horário de {servico} no dia {data} às {hora} com {nome_profissional}. Podemos contar com você? 😊',
  en: 'Hi {nome_cliente}! Confirming your {servico} appointment on {data} at {hora} with {nome_profissional}. Can we count on you? 😊',
  es: '¡Hola {nome_cliente}! Confirmando tu cita de {servico} el {data} a las {hora} con {nome_profissional}. ¿Contamos contigo? 😊',
};

export function buildConfirmationMessage(customTemplate: string | undefined, lang: Lang, vars: { nome_cliente: string; data: string; hora: string; servico: string; nome_profissional: string }) {
  const template = customTemplate?.trim() ? customTemplate : CONFIRMATION_TEMPLATES[lang] || CONFIRMATION_TEMPLATES.pt;
  return format(template, vars);
}

export function digitsOnly(phone: string) {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppLink(phone: string, message: string) {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// sms: URIs split on OS: iOS expects "&body=", every other platform (Android,
// desktop SMS-capable apps) expects "?body=" as the first query separator.
export function buildSmsLink(phone: string, message: string) {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isIOS ? '&' : '?';
  return `sms:${digits}${separator}body=${encodeURIComponent(message)}`;
}
