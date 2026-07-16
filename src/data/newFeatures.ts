import type { Lang } from './content';

// Extra UI strings for features added on top of the base content.ts locale:
// login gate, expanded onboarding (name / public name / services), a real
// finance ledger, a working CRM (add client, edit stage, message templates),
// and a functional public booking flow. Kept separate from content.ts to
// avoid churning that already-large file — same Record<Lang, ...> pattern.
export interface NewFeatureStrings {
  login: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    submitCta: string;
    hint: string;
  };
  onboardingName: { title: string; subtitle: string; placeholder: string; greetingPreview: string };
  onboardingPublicName: { title: string; subtitle: string; placeholder: string; linkPrefix: string };
  onboardingServices: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    pricePlaceholder: string;
    durationPlaceholder: string;
    durationSuffix: string;
    addCta: string;
    removeLabel: string;
  };
  finance: {
    ledgerLabel: string;
    receivable: string;
    payable: string;
    addCta: string;
    labelPlaceholder: string;
    valuePlaceholder: string;
    dueDatePlaceholder: string;
    noEntries: string;
    totalReceivable: string;
    totalPayable: string;
  };
  crmAddClient: {
    cta: string;
    formTitle: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    servicePlaceholder: string;
    birthdayPlaceholder: string;
    originLabel: string;
    origins: string[];
    submitCta: string;
  };
  crmProfileExtra: {
    statusLabel: string;
    birthdayLabel: string;
    birthdayPlaceholder: string;
    messagesLabel: string;
    messageTemplateNames: string[];
    sendCta: string;
    copiedLabel: string;
  };
  publicBooking: {
    step1: string;
    step2: string;
    step3: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    confirmCta: string;
    confirmedTitle: string;
    confirmedSubtitle: string;
    noSlots: string;
    notWorkingDay: string;
  };
  agendaSetupSlots: {
    slotsLabel: string;
    hint: string;
  };
}

export const newFeatures: Record<Lang, NewFeatureStrings> = {
  pt: {
    login: {
      title: 'Entrar',
      subtitle: 'Acesse sua conta Beauty Consultants',
      emailPlaceholder: 'E-mail',
      passwordPlaceholder: 'Senha',
      submitCta: 'Entrar',
      hint: 'Primeiro acesso? Basta preencher e entrar — a configuração inicial vem a seguir.',
    },
    onboardingName: {
      title: 'Qual é o seu nome?',
      subtitle: 'Usado nas saudações dentro do app.',
      placeholder: 'Seu nome',
      greetingPreview: 'Bom dia,',
    },
    onboardingPublicName: {
      title: 'Como quer aparecer para suas clientes?',
      subtitle: 'Usado na sua página pública e no link de agendamento.',
      placeholder: 'Nome do seu negócio',
      linkPrefix: 'beautyconsultants.app/',
    },
    onboardingServices: {
      title: 'Confirme seus serviços e valores',
      subtitle: 'Já sugerimos com base na sua profissão. Edite como preferir.',
      namePlaceholder: 'Nome do serviço',
      pricePlaceholder: 'Valor',
      durationPlaceholder: 'Duração',
      durationSuffix: 'min',
      addCta: 'Adicionar serviço',
      removeLabel: 'Remover',
    },
    finance: {
      ledgerLabel: 'Contas a pagar e a receber',
      receivable: 'A receber',
      payable: 'A pagar',
      addCta: 'Adicionar lançamento',
      labelPlaceholder: 'Descrição — ex: Aluguel do espaço',
      valuePlaceholder: 'Valor',
      dueDatePlaceholder: 'Vencimento — ex: 15/07',
      noEntries: 'Nenhum lançamento registrado ainda.',
      totalReceivable: 'Total a receber',
      totalPayable: 'Total a pagar',
    },
    crmAddClient: {
      cta: '+ Cadastrar cliente',
      formTitle: 'Nova cliente',
      namePlaceholder: 'Nome',
      phonePlaceholder: 'Telefone',
      servicePlaceholder: 'Serviço de interesse',
      birthdayPlaceholder: 'Aniversário — ex: 15/03',
      originLabel: 'Origem',
      origins: ['Instagram', 'WhatsApp', 'Google', 'TikTok', 'Indicação'],
      submitCta: 'Adicionar cliente',
    },
    crmProfileExtra: {
      statusLabel: 'Status da cliente',
      birthdayLabel: 'Aniversário',
      birthdayPlaceholder: 'dd/mm',
      messagesLabel: 'Gerar mensagem',
      messageTemplateNames: ['Primeiro contato', 'Follow-up', 'Quebra de objeção', 'Fechamento', 'Reativação'],
      sendCta: 'Copiar mensagem',
      copiedLabel: 'Copiado!',
    },
    publicBooking: {
      step1: 'Escolha o serviço',
      step2: 'Escolha o horário',
      step3: 'Seus dados',
      namePlaceholder: 'Nome',
      phonePlaceholder: 'WhatsApp ou telefone',
      confirmCta: 'Confirmar agendamento',
      confirmedTitle: 'Agendamento confirmado!',
      confirmedSubtitle: 'Você vai receber a confirmação em breve.',
      noSlots: 'Sem horários livres hoje.',
      notWorkingDay: 'Sem atendimento hoje.',
    },
    agendaSetupSlots: {
      slotsLabel: 'Horários abertos para agendamento',
      hint: 'Só os dias e horários marcados aqui ficam disponíveis na sua página pública.',
    },
  },
  en: {
    login: {
      title: 'Sign in',
      subtitle: 'Access your Beauty Consultants account',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      submitCta: 'Sign in',
      hint: 'First time here? Just fill in and continue — setup comes right after.',
    },
    onboardingName: {
      title: "What's your name?",
      subtitle: 'Used for greetings inside the app.',
      placeholder: 'Your name',
      greetingPreview: 'Good morning,',
    },
    onboardingPublicName: {
      title: 'How should clients see you?',
      subtitle: 'Used on your public page and booking link.',
      placeholder: 'Your business name',
      linkPrefix: 'beautyconsultants.app/',
    },
    onboardingServices: {
      title: 'Confirm your services and prices',
      subtitle: 'Already suggested based on your profession. Edit as you like.',
      namePlaceholder: 'Service name',
      pricePlaceholder: 'Price',
      durationPlaceholder: 'Duration',
      durationSuffix: 'min',
      addCta: 'Add service',
      removeLabel: 'Remove',
    },
    finance: {
      ledgerLabel: 'Bills to pay and receive',
      receivable: 'Receivable',
      payable: 'Payable',
      addCta: 'Add entry',
      labelPlaceholder: 'Description — e.g. Studio rent',
      valuePlaceholder: 'Amount',
      dueDatePlaceholder: 'Due date — e.g. Jul 15',
      noEntries: 'No entries logged yet.',
      totalReceivable: 'Total receivable',
      totalPayable: 'Total payable',
    },
    crmAddClient: {
      cta: '+ Add client',
      formTitle: 'New client',
      namePlaceholder: 'Name',
      phonePlaceholder: 'Phone',
      servicePlaceholder: 'Service of interest',
      birthdayPlaceholder: 'Birthday — e.g. Mar 15',
      originLabel: 'Source',
      origins: ['Instagram', 'WhatsApp', 'Google', 'TikTok', 'Referral'],
      submitCta: 'Add client',
    },
    crmProfileExtra: {
      statusLabel: "Client's status",
      birthdayLabel: 'Birthday',
      birthdayPlaceholder: 'mm/dd',
      messagesLabel: 'Generate message',
      messageTemplateNames: ['First contact', 'Follow-up', 'Objection handling', 'Closing', 'Reactivation'],
      sendCta: 'Copy message',
      copiedLabel: 'Copied!',
    },
    publicBooking: {
      step1: 'Choose the service',
      step2: 'Choose the time',
      step3: 'Your details',
      namePlaceholder: 'Name',
      phonePlaceholder: 'WhatsApp or phone',
      confirmCta: 'Confirm booking',
      confirmedTitle: 'Booking confirmed!',
      confirmedSubtitle: "You'll get a confirmation shortly.",
      noSlots: 'No open slots today.',
      notWorkingDay: 'Not available today.',
    },
    agendaSetupSlots: {
      slotsLabel: 'Slots open for booking',
      hint: 'Only the days and times marked here show up as available on your public page.',
    },
  },
};
