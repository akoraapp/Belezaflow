import type { Lang } from '../data/content';

export type MessageTemplateKey = 'firstContact' | 'followUp' | 'objection' | 'closing' | 'reactivation';

export const MESSAGE_TEMPLATE_KEYS: MessageTemplateKey[] = ['firstContact', 'followUp', 'objection', 'closing', 'reactivation'];

export function generateMessage(key: MessageTemplateKey, lang: Lang, clientName: string, service?: string): string {
  const svc = service && service !== '—' ? service : undefined;
  if (lang === 'en') {
    switch (key) {
      case 'firstContact':
        return `Hi ${clientName}! I saw your interest${svc ? ` in ${svc}` : ''} and would love to help you find the best time.`;
      case 'followUp':
        return `Hi ${clientName}, how are you? Still thinking about booking${svc ? ` your ${svc}` : ''}? I have slots opening up this week!`;
      case 'objection':
        return `I understand, ${clientName}! If it's about the price, I can show you the payment options we have available.`;
      case 'closing':
        return `${clientName}, I can fit you in${svc ? ` for the ${svc}` : ''} — shall we confirm your time?`;
      case 'reactivation':
        return `We miss you, ${clientName}! How about renewing${svc ? ` your ${svc}` : ''}? I set aside a special rate for you this week.`;
    }
  }
  switch (key) {
    case 'firstContact':
      return `Oi ${clientName}! Vi seu interesse${svc ? ` em ${svc}` : ''} e adoraria te ajudar a encontrar o melhor horário.`;
    case 'followUp':
      return `Oi ${clientName}, tudo bem? Ainda está pensando em agendar${svc ? ` seu ${svc}` : ''}? Tenho horários abrindo essa semana!`;
    case 'objection':
      return `Entendo, ${clientName}! Se for sobre o valor, posso te mostrar as formas de pagamento que temos disponíveis.`;
    case 'closing':
      return `${clientName}, consigo te encaixar${svc ? ` para o ${svc}` : ''} — vamos confirmar seu horário?`;
    case 'reactivation':
      return `Sentimos sua falta, ${clientName}! Que tal renovar${svc ? ` seu ${svc}` : ''}? Separei uma condição especial essa semana.`;
  }
}
