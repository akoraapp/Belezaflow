export type Lang = 'pt' | 'en';

export interface OnboardingOption {
  label: string;
  selected: boolean;
  bg: string;
  borderColor: string;
}

export interface OnboardingStep {
  title: string;
  subtitle: string;
  options: OnboardingOption[];
}

export interface ClientMachineToolUi {
  title: string;
  subtitle: string;
  suggestionLabel: string;
  acceptSuggestionCta: string;
  objectiveLabel: string;
  approachLabel: string;
  back: string;
  createAnother: string;
  reelLabel: string;
  postLabel: string;
  storyLabel: string;
  copy: string;
  copied: string;
  resultSubtitle: string;
  historyLabel: string;
  noHistory: string;
}

export interface InventoryProduct {
  name: string;
  category: string;
  brand: string;
  supplier: string;
  qty: number;
  minQty: number;
  unit: string;
  purchaseValue: number;
}

export interface InventoryProfessionData {
  categories: string[];
  consumption: { service: string; items: string[] };
  consumptionList: { service: string; items: string[] }[];
  alerts: string[];
  products: InventoryProduct[];
}

export interface Locale {
  brand: { name: string; tagline: string };
  hero: { kicker: string; title: string; subtitle: string };
  sectionLabels: {
    onboarding: string;
    today: string;
    clientMachine: string;
    crm: string;
    agendaSetup: string;
    publicPage: string;
    agenda: string;
    financeiro: string;
    inventory: string;
    reports: string;
    ai: string;
    settings: string;
  };
  onboarding: {
    heading: string;
    step: string;
    next: string;
    finish: string;
    s1: OnboardingStep;
    s3: OnboardingStep;
    s4: OnboardingStep;
    s5: { title: string; subtitle: string; amount: string; perMonth: string };
  };
  today: {
    heading: string;
    date: string;
    greeting: string;
    revenueLabel: string;
    revenueValue: string;
    revenueSub: string;
    quickActionsLabel: string;
    quickActions: {
      createContent: string;
      registerAttendance: string;
      registeredDone: string;
      goFinance: string;
      newClient: string;
    };
    goal: { label: string; current: string };
    diagnostic: { timestamp: string; message: string; ctaLabel: string };
    contentSuggestion: { label: string; message: string; ctaLabel: string };
    processLabel: string;
    processSteps: { num: string; title: string; desc: string }[];
    actionCardsLabel: string;
    actionCards: { title: string; desc: string; ctaLabel: string }[];
    readyResponsesLabel: string;
    readyResponsesOpenLabel: string;
    readyResponsesCloseLabel: string;
    readyResponses: { title: string; text: string }[];
    copyLabel: string;
    copiedLabel: string;
  };
  clientMachine: {
    heading: string;
    title: string;
    tabs: { contentLabel: string; funnelLabel: string };
    tool: {
      ui: ClientMachineToolUi;
      suggestionText: string;
      suggestedObjective: string;
      suggestedApproach: string;
    };
    funnel: {
      label: string;
      steps: { label: string; value: string; pct: string }[];
      linkLabel: string;
      linkUrl: string;
      cta: string;
      conversionLabel: string;
      conversionValue: string;
      conversionDelta: string;
    };
  };
  agendaSetup: {
    heading: string;
    title: string;
    subtitle: string;
    daysLabel: string;
    days: { label: string; bg: string; color: string }[];
    hoursLabel: string;
    hoursValue: string;
    intervalLabel: string;
    intervalValue: string;
    servicesLabel: string;
    services: { name: string; duration: string }[];
    prepLabel: string;
    prepValue: string;
    blockedLabel: string;
    blocked: string[];
    linkLabel: string;
    linkUrl: string;
    generateCta: string;
  };
  publicPage: {
    heading: string;
    photoLabel: string;
    name: string;
    role: string;
    bio: string;
    instagram: string;
    whatsapp: string;
    locationLabel: string;
    location: string;
    servicesLabel: string;
    selectLabel: string;
    selectedLabel: string;
    services: { name: string; price: string }[];
    portfolioLabel: string;
    portfolio: string[];
    cta: string;
    poweredBy: string;
  };
  crm: {
    heading: string;
    title: string;
    searchPlaceholder: string;
    attendanceLabel: string;
    stages: { key: string; label: string }[];
    clients: { initial: string; name: string; tag: string; lastVisit: string; value: string; stage: string }[];
    profile: {
      initial: string;
      name: string;
      since: string;
      totalSpent: string;
      totalSpentLabel: string;
      visits: string;
      visitsLabel: string;
      tagsLabel: string;
      tags: string[];
      nextApptLabel: string;
      nextAppt: string;
    };
    colName: string;
    colTag: string;
    colLast: string;
    colValue: string;
    desktopUrl: string;
  };
  agenda: {
    heading: string;
    title: string;
    dateLabel: string;
    statusLabels: { confirmed: string; done: string; pending: string };
    appointments: { time: string; client: string; service: string; status: 'confirmed' | 'done' | 'pending' }[];
  };
  financeiro: {
    heading: string;
    title: string;
    goalLabel: string;
    goalPercent: string;
    goalRemaining: string;
    revenueLabel: string;
    revenueValue: string;
    avgTicketLabel: string;
    avgTicketValue: string;
    historyLabel: string;
    months: { label: string; pct: string }[];
    currencyNote: string;
    desktopUrl: string;
  };
  inventory: {
    heading: string;
    title: string;
    productsTitle: string;
    remainingLabel: string;
    restockCta: string;
    historyCta: string;
    allProductsLabel: string;
    inStockLabel: string;
    addProductCta: string;
    expandCta: string;
    collapseCta: string;
    totalInvestedLabel: string;
    registerProductLabel: string;
    formNamePlaceholder: string;
    formQtyPlaceholder: string;
    formValuePlaceholder: string;
    formValueHint: string;
    formSubmitCta: string;
    statusLabels: { ok: string; low: string; out: string };
    quickActionsLabel: string;
    stockValueLabel: string;
    monthlySpendLabel: string;
    monthlySpendValue: string;
    lowStockLabel: string;
    renewalLabel: string;
    aiAlertsLabel: string;
    movementsLabel: string;
    consumptionLabel: string;
    financeIntegrationLabel: string;
    financeIntegrationText: string;
    lowBadge: string;
    qtyLabel: string;
    minLabel: string;
    supplierLabel: string;
    movements: string[];
    quickActions: { key: string; label: string }[];
    professions: { key: string; label: string }[];
    productsByProfession: Record<string, InventoryProfessionData>;
  };
  relatorios: {
    heading: string;
    title: string;
    metrics: { label: string; value: string; delta: string }[];
    topServicesLabel: string;
    topServices: { name: string; pct: string }[];
    insightLabel: string;
    insight: string;
  };
  ia: {
    heading: string;
    title: string;
    subtitle: string;
    messages: { from: 'ai' | 'user'; text: string; align: string; bg: string; color: string }[];
    suggestions: string[];
  };
  config: {
    heading: string;
    title: string;
    sections: { header: string; items: { label: string; value: string }[] }[];
  };
  tabbar: { hoje: string; agenda: string; crm: string; financeiro: string; mais: string };
  desktopNav: { label: string; color: string; bg: string }[];
  desktopNavFin: { label: string; color: string; bg: string }[];
}

export const content: Record<Lang, Locale> = {
  pt: {
    brand: { name: 'Beauty Consultants', tagline: 'Seu negócio de beleza, elevado por IA' },
    hero: {
      kicker: 'Beauty Consultants',
      title: 'O assistente de negócios para profissionais da beleza',
      subtitle:
        'Uma visão completa do produto: da chegada de um novo profissional ao painel financeiro do dia a dia. Toque em cada tela para conhecer o fluxo.',
    },
    sectionLabels: {
      onboarding: 'Onboarding',
      today: 'Módulo · Hoje',
      clientMachine: 'Módulo · Máquina de Clientes',
      crm: 'Módulo · CRM',
      agendaSetup: 'Módulo · Agenda Inteligente',
      publicPage: 'Módulo · Página Pública',
      agenda: 'Módulo · Agenda',
      financeiro: 'Módulo · Financeiro',
      inventory: 'Módulo · Estoque Inteligente',
      reports: 'Módulo · Relatórios',
      ai: 'Módulo · Assistente IA',
      settings: 'Módulo · Configurações',
    },
    onboarding: {
      heading: 'Uma configuração inicial que personaliza todo o app',
      step: 'Passo',
      next: 'Continuar',
      finish: 'Começar a usar',
      s1: {
        title: 'Qual idioma você prefere?',
        subtitle: 'Você pode alterar isso depois.',
        options: [
          { label: 'Português', selected: true, bg: '#FBF3E4', borderColor: '#E3C989' },
          { label: 'English', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Español', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
        ],
      },
      s3: {
        title: 'Qual moeda você usa?',
        subtitle: 'Usada em todo o financeiro.',
        options: [
          { label: 'Real (R$)', selected: true, bg: '#FBF3E4', borderColor: '#E3C989' },
          { label: 'Dólar (US$)', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Euro (€)', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
        ],
      },
      s4: {
        title: 'Qual sua profissão?',
        subtitle: 'Adaptamos serviços e linguagem.',
        options: [
          { label: 'Lash Designer', selected: true, bg: '#FBF3E4', borderColor: '#E3C989' },
          { label: 'Nail Designer', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Cabeleireira', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Esteticista', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Micropigmentadora', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
        ],
      },
      s5: { title: 'Qual sua meta mensal?', subtitle: 'A IA monta seu plano com base nela.', amount: 'R$ 18.500', perMonth: 'por mês' },
    },
    today: {
      heading: 'Painel do dia com plano de ação da IA',
      date: 'Terça-feira, 14 de julho',
      greeting: 'Bom dia, Marina',
      revenueLabel: 'Receita de hoje',
      revenueValue: 'R$ 1.240',
      revenueSub: '4 atendimentos concluídos',
      quickActionsLabel: 'Ações rápidas',
      quickActions: {
        createContent: 'Criar Conteúdo',
        registerAttendance: 'Registrar Comparecimento',
        registeredDone: 'Comparecimento registrado ✓',
        goFinance: 'Acessar Financeiro',
        newClient: 'Cadastrar Cliente',
      },
      goal: { label: 'Meta do mês', current: 'R$ 3.200 de R$ 5.000' },
      diagnostic: {
        timestamp: 'Hoje, 09:14',
        message: 'Ana, você tem 3 buracos na agenda essa semana. Quer que eu preencha?',
        ctaLabel: 'Preencher agenda agora',
      },
      contentSuggestion: {
        label: 'Sugestão de conteúdo',
        message: 'Sua agenda está com poucos horários preenchidos essa semana. Quer criar um conteúdo para atrair mais clientes?',
        ctaLabel: 'Criar conteúdo agora',
      },
      processLabel: 'Como a Secretária IA trabalha por você',
      processSteps: [
        { num: '01', title: 'Cadastro rápido', desc: 'Você cadastra clientes, agenda, produtos e serviços em poucos minutos, direto do celular.' },
        { num: '02', title: 'Cruzamento inteligente', desc: 'O assistente cruza seus dados de agenda, financeiro e estoque e identifica onde está o risco.' },
        { num: '03', title: 'Aviso pronto', desc: 'Você recebe o alerta certo: cliente para chamar, produto para repor, conteúdo pronto para postar.' },
      ],
      actionCardsLabel: 'Ações do dia',
      actionCards: [
        { title: '3 clientes não confirmaram o horário de amanhã', desc: 'Envie um lembrete agora e evite furos na agenda.', ctaLabel: 'Enviar lembrete agora' },
        { title: 'Potencial de R$ 500 para recuperar este mês', desc: 'Clientes sumidas há mais de 60 dias, prontas para reativação.', ctaLabel: 'Ver lista de clientes' },
        { title: 'Cola de cílios Black Fast está acabando', desc: 'Pela sua média de atendimentos, o estoque acaba em 5 dias.', ctaLabel: 'Repor agora' },
        { title: 'Conteúdo pronto para postar hoje', desc: 'Um Reel de antes/depois com roteiro completo te espera.', ctaLabel: 'Ver roteiro do Reel' },
      ],
      readyResponsesLabel: 'Central de respostas prontas',
      readyResponsesOpenLabel: 'Ver respostas',
      readyResponsesCloseLabel: 'Fechar',
      readyResponses: [
        { title: 'Reativação', text: 'Oi [Nome], faz tempo que não te vejo por aqui! Separei um horário especial essa semana pensando em você.' },
        { title: 'Oferta', text: 'Últimas vagas dessa semana! Fechei um horário especial hoje com condição exclusiva. Quer garantir?' },
        { title: 'Follow-up', text: 'Oi [Nome]! Passando para saber como você está se sentindo com o resultado.' },
      ],
      copyLabel: 'Copiar',
      copiedLabel: 'Copiado!',
    },
    clientMachine: {
      heading: 'Crie conteúdo, venda mais e capte clientes automaticamente',
      title: 'Máquina de Clientes',
      tabs: { contentLabel: 'Conteúdo IA', funnelLabel: 'Funil de Captação' },
      tool: {
        ui: {
          title: 'Conteúdo',
          subtitle: 'Crie conteúdo e mensagens prontas com IA',
          suggestionLabel: 'Sugestão da Secretária IA',
          acceptSuggestionCta: 'Gerar conteúdo sugerido',
          objectiveLabel: 'Qual seu objetivo?',
          approachLabel: 'Qual abordagem você deseja usar nesse conteúdo?',
          back: 'Voltar',
          createAnother: 'Criar outro conteúdo',
          reelLabel: 'Roteiro do Reel/Vídeo',
          postLabel: 'Legenda do Post',
          storyLabel: 'Estratégia do Story',
          copy: 'Copiar',
          copied: 'Copiado!',
          resultSubtitle: 'Conteúdo gerado pela IA',
          historyLabel: 'Histórico de conteúdos gerados',
          noHistory: 'Nenhum conteúdo gerado ainda.',
        },
        suggestionText: 'Sua agenda está com poucos horários preenchidos essa semana. Quer criar um conteúdo para atrair mais clientes?',
        suggestedObjective: 'atrair',
        suggestedApproach: 'desejo',
      },
      funnel: {
        label: 'Funil de captação (30 dias)',
        steps: [
          { label: 'Visitas ao link', value: '842', pct: '100%' },
          { label: 'Iniciaram cadastro', value: '316', pct: '62%' },
          { label: 'Agendaram', value: '128', pct: '38%' },
          { label: 'Compareceram', value: '109', pct: '29%' },
        ],
        linkLabel: 'Seu link de agendamento',
        linkUrl: 'beautyconsultants.app/marina-lash',
        cta: 'Copiar link',
        conversionLabel: 'Taxa de conversão',
        conversionValue: '15,2%',
        conversionDelta: '+3,4%',
      },
    },
    agendaSetup: {
      heading: 'Configure sua agenda e gere seu link de agendamento online',
      title: 'Configuração da Agenda',
      subtitle: 'A cliente agenda sozinha, dentro das regras que você definir',
      daysLabel: 'Dias de atendimento',
      days: [
        { label: 'Seg', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Ter', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Qua', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Qui', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Sex', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Sáb', bg: '#F2ECDF', color: '#B0A78F' },
        { label: 'Dom', bg: '#F2ECDF', color: '#B0A78F' },
      ],
      hoursLabel: 'Horário disponível',
      hoursValue: '09:00 – 19:00',
      intervalLabel: 'Intervalo entre horários',
      intervalValue: '15 min',
      servicesLabel: 'Serviços e duração',
      services: [
        { name: 'Volume russo', duration: '2h30' },
        { name: 'Volume brasileiro', duration: '2h00' },
        { name: 'Design de sobrancelha', duration: '45min' },
        { name: 'Retoque', duration: '1h15' },
      ],
      prepLabel: 'Tempo de preparo/limpeza',
      prepValue: '15 min entre cada atendimento',
      blockedLabel: 'Bloqueios de horário',
      blocked: ['Almoço, 12:00–13:00, todos os dias', 'Sextas-feiras após 18:00'],
      linkLabel: 'Link gerado automaticamente',
      linkUrl: 'beautyconsultants.app/marina-lash',
      generateCta: 'Gerar link de agendamento',
    },
    publicPage: {
      heading: 'Uma página de vendas e agendamento para cada profissional',
      photoLabel: 'FOTO PROFISSIONAL',
      name: 'Marina Alves',
      role: 'Lash Designer Premium',
      bio: 'Especialista em volume russo e design de olhar. Atendimento personalizado em São Paulo.',
      instagram: '@marina.lash',
      whatsapp: '(11) 98765-4321',
      locationLabel: 'Localização',
      location: 'São Paulo, SP',
      servicesLabel: 'Serviços',
      selectLabel: 'Selecionar',
      selectedLabel: 'Selecionado',
      services: [
        { name: 'Volume russo', price: 'R$ 280' },
        { name: 'Volume brasileiro', price: 'R$ 220' },
        { name: 'Design de sobrancelha', price: 'R$ 90' },
        { name: 'Retoque', price: 'R$ 150' },
      ],
      portfolioLabel: 'Fotos dos trabalhos',
      portfolio: ['FOTO DO TRABALHO', 'FOTO DO TRABALHO', 'FOTO DO TRABALHO', 'FOTO DO TRABALHO', 'FOTO DO TRABALHO', 'FOTO DO TRABALHO'],
      cta: 'Agendar horário',
      poweredBy: 'Página criada com Beauty Consultants',
    },
    crm: {
      heading: 'Cadastro único com histórico e financeiro',
      title: 'Clientes',
      searchPlaceholder: 'Buscar cliente...',
      attendanceLabel: 'Taxa de comparecimento',
      stages: [
        { key: 'todos', label: 'Todos' },
        { key: 'leads', label: 'Leads' },
        { key: 'agendados', label: 'Agendados' },
        { key: 'inativo', label: 'Inativos' },
        { key: 'vip', label: 'VIP' },
        { key: 'fidelizados', label: 'Fidelizados' },
      ],
      clients: [
        { initial: 'CD', name: 'Camila Duarte', tag: 'Lash · VIP', lastVisit: 'há 3 dias', value: 'R$ 2.340', stage: 'vip' },
        { initial: 'BM', name: 'Beatriz Moraes', tag: 'Sobrancelha', lastVisit: 'há 12 dias', value: 'R$ 860', stage: 'agendados' },
        { initial: 'JS', name: 'Juliana Sales', tag: 'Lash · Nova', lastVisit: 'há 1 dia', value: 'R$ 180', stage: 'agendados' },
        { initial: 'RF', name: 'Renata Ferreira', tag: 'Manutenção', lastVisit: 'há 20 dias', value: 'R$ 1.120', stage: 'fidelizados' },
        { initial: 'LP', name: 'Larissa Pires', tag: 'Lash · VIP', lastVisit: 'há 5 dias', value: 'R$ 3.010', stage: 'vip' },
        { initial: 'AN', name: 'Ana Nogueira', tag: 'Sem retorno', lastVisit: 'há 68 dias', value: 'R$ 420', stage: 'inativo' },
        { initial: 'PS', name: 'Priscila Santos', tag: 'Sem retorno', lastVisit: 'há 74 dias', value: 'R$ 260', stage: 'inativo' },
        { initial: 'IG', name: 'Ingrid Gomes', tag: 'Contato via link', lastVisit: 'Novo contato', value: '—', stage: 'leads' },
        { initial: 'TF', name: 'Tatiane Freitas', tag: 'Contato via Instagram', lastVisit: 'Novo contato', value: '—', stage: 'leads' },
      ],
      profile: {
        initial: 'CD',
        name: 'Camila Duarte',
        since: 'Cliente desde março de 2024',
        totalSpent: 'R$ 2.340',
        totalSpentLabel: 'Total gasto',
        visits: '14',
        visitsLabel: 'Visitas',
        tagsLabel: 'Perfil',
        tags: ['VIP', 'Volume russo', 'Prefere manhã'],
        nextApptLabel: 'Próximo atendimento',
        nextAppt: 'Hoje às 16:00 · Extensão de cílios',
      },
      colName: 'Nome',
      colTag: 'Perfil',
      colLast: 'Última visita',
      colValue: 'Valor total',
      desktopUrl: 'app.beautyconsultants.com/crm',
    },
    agenda: {
      heading: 'Agenda integrada ao financeiro',
      title: 'Agenda',
      dateLabel: 'Terça-feira, 14 de julho',
      statusLabels: { confirmed: 'Confirmado', done: 'Concluído', pending: 'Aguardando' },
      appointments: [
        { time: '09:00', client: 'Larissa Pires', service: 'Volume russo · Manutenção', status: 'done' },
        { time: '11:00', client: 'Juliana Sales', service: 'Volume brasileiro · Primeira vez', status: 'confirmed' },
        { time: '13:30', client: 'Renata Ferreira', service: 'Design de sobrancelha', status: 'done' },
        { time: '16:00', client: 'Camila Duarte', service: 'Extensão de cílios · Volume russo', status: 'confirmed' },
        { time: '18:00', client: 'Beatriz Moraes', service: 'Retorno · Sobrancelha', status: 'pending' },
      ],
    },
    financeiro: {
      heading: 'Metas, ticket médio e histórico multimoeda',
      title: 'Financeiro',
      goalLabel: 'Meta de julho',
      goalPercent: '62%',
      goalRemaining: 'Faltam R$ 7.030 para bater a meta de R$ 18.500',
      revenueLabel: 'Receita do mês',
      revenueValue: 'R$ 11.470',
      avgTicketLabel: 'Ticket médio',
      avgTicketValue: 'R$ 218',
      historyLabel: 'Histórico dos últimos 6 meses',
      months: [
        { label: 'Fev', pct: '40%' },
        { label: 'Mar', pct: '55%' },
        { label: 'Abr', pct: '48%' },
        { label: 'Mai', pct: '70%' },
        { label: 'Jun', pct: '82%' },
        { label: 'Jul', pct: '62%' },
      ],
      currencyNote: 'Valores exibidos em Real (R$) · configurável por país',
      desktopUrl: 'app.beautyconsultants.com/financeiro',
    },
    inventory: {
      heading: 'Controle de materiais que prevê reposições e evita falta de estoque',
      title: 'Estoque',
      productsTitle: 'Produtos',
      remainingLabel: 'restantes',
      restockCta: 'Repor agora',
      historyCta: 'Ver histórico de gastos',
      allProductsLabel: 'Todos os produtos',
      inStockLabel: 'em estoque',
      addProductCta: '+ Adicionar produto',
      expandCta: 'Ver',
      collapseCta: 'Ocultar',
      totalInvestedLabel: 'Total investido em produtos',
      registerProductLabel: 'Registrar produto',
      formNamePlaceholder: 'Nome do produto',
      formQtyPlaceholder: 'Quantidade',
      formValuePlaceholder: 'Valor pago (opcional)',
      formValueHint: 'Preencha o valor para somar ao total investido em produtos.',
      formSubmitCta: 'Salvar produto',
      statusLabels: { ok: 'OK', low: 'Estoque baixo', out: 'Em falta' },
      quickActionsLabel: 'Ações rápidas',
      stockValueLabel: 'Valor estimado do estoque',
      monthlySpendLabel: 'Gasto com materiais no mês',
      monthlySpendValue: 'R$ 640',
      lowStockLabel: 'Nível baixo',
      renewalLabel: 'Precisam renovar',
      aiAlertsLabel: 'Alertas da IA',
      movementsLabel: 'Últimas movimentações',
      consumptionLabel: 'Consumo médio por atendimento',
      financeIntegrationLabel: 'Integração com Financeiro',
      financeIntegrationText:
        'Toda compra registrada aqui gera automaticamente uma despesa no Financeiro, com categoria e impacto no lucro calculados.',
      lowBadge: 'Nível baixo',
      qtyLabel: 'Qtd. atual',
      minLabel: 'Qtd. mínima',
      supplierLabel: 'Fornecedor',
      movements: [
        'Entrada: 10 tips XL — hoje',
        'Saída: 2ml de gel construtor — ontem',
        'Compra registrada: removedor de esmalte — há 3 dias',
        'Baixa de estoque: 1 par de luvas — há 4 dias',
      ],
      quickActions: [
        { key: 'add', label: 'Adicionar produto' },
        { key: 'purchase', label: 'Registrar compra' },
        { key: 'writeoff', label: 'Dar baixa no estoque' },
        { key: 'lowstock', label: 'Ver produtos em falta' },
        { key: 'report', label: 'Ver relatório de consumo' },
      ],
      professions: [
        { key: 'lash', label: 'Lash Designer' },
        { key: 'nail', label: 'Nail Designer' },
        { key: 'brow', label: 'Brow Artist' },
        { key: 'esteticista', label: 'Esteticista' },
      ],
      productsByProfession: {
        lash: {
          categories: ['Extensões de cílios', 'Colas', 'Pads', 'Fitas', 'Pinças', 'Escovinhas', 'Higienizadores'],
          consumption: { service: 'Volume russo', items: ['0,3g de cola', '2 pads de gel', '1 par de luvas'] },
          consumptionList: [
            { service: 'Volume russo', items: ['0,3g de cola', '2 pads de gel', '1 par de luvas'] },
            { service: 'Volume brasileiro', items: ['0,2g de cola', '2 pads de gel', '1 par de luvas'] },
          ],
          alerts: [
            'Você realizou 18 procedimentos usando cola de cílios neste mês. Recomendamos verificar o estoque.',
            'Seu estoque de cola Black Fast está abaixo do ideal. Pela sua média de atendimentos, você deve precisar repor em aproximadamente 5 dias.',
            'Seu gasto com materiais aumentou 20% comparado ao mês anterior.',
          ],
          products: [
            { name: 'Cola de Cílios Black Fast', category: 'Colas', brand: 'LashPro', supplier: 'Studio Lash Distribuidora', qty: 2, minQty: 4, unit: 'un', purchaseValue: 45 },
            { name: 'Extensão Volume Russo 0.07 D', category: 'Extensões de cílios', brand: 'Lash Milano', supplier: 'Studio Lash Distribuidora', qty: 12, minQty: 6, unit: 'cx', purchaseValue: 120 },
            { name: 'Pads de Gel', category: 'Pads', brand: 'LashPro', supplier: 'Beauty Supply BR', qty: 5, minQty: 8, unit: 'pares', purchaseValue: 18 },
            { name: 'Fita Microporosa', category: 'Fitas', brand: '3M', supplier: 'Beauty Supply BR', qty: 10, minQty: 5, unit: 'rolos', purchaseValue: 22 },
          ],
        },
        nail: {
          categories: ['Géis', 'Esmaltes', 'Tips', 'Lixas', 'Brocas', 'Primer', 'Top coat', 'Removedores', 'Luvas', 'Descartáveis'],
          consumption: { service: 'Alongamento em fibra', items: ['5ml de gel', '1 lixa', '1 par de luvas'] },
          consumptionList: [
            { service: 'Alongamento em fibra', items: ['5ml de gel', '1 lixa', '1 par de luvas'] },
            { service: 'Esmaltação em gel', items: ['2ml de esmalte em gel', '1 top coat', '1 par de luvas'] },
          ],
          alerts: [
            'Seu estoque de gel construtor está abaixo do ideal. Pela sua média de atendimentos, você deve precisar repor em aproximadamente 7 dias.',
            'Você usou 22 tips XL neste mês, 40% a mais que o mês passado.',
            'Seu gasto com materiais aumentou 20% comparado ao mês anterior.',
          ],
          products: [
            { name: 'Gel Construtor Rosa', category: 'Géis', brand: 'Dubai Gel', supplier: 'Studio Nails Distribuidora', qty: 2, minQty: 4, unit: 'un', purchaseValue: 45 },
            { name: 'Esmalte Vermelho Clássico', category: 'Esmaltes', brand: 'Colorama', supplier: 'Studio Nails Distribuidora', qty: 8, minQty: 3, unit: 'un', purchaseValue: 45 },
            { name: 'Lixa 100/180', category: 'Lixas', brand: 'Mundial', supplier: 'Beauty Supply BR', qty: 15, minQty: 10, unit: 'un', purchaseValue: 45 },
            { name: 'Luvas Descartáveis P', category: 'Luvas', brand: 'Supermax', supplier: 'Beauty Supply BR', qty: 1, minQty: 2, unit: 'cx', purchaseValue: 120 },
          ],
        },
        brow: {
          categories: ['Henna', 'Tinturas', 'Pinças', 'Linha de marcação', 'Cera', 'Algodão', 'Luvas', 'Higienizadores'],
          consumption: { service: 'Design com Henna', items: ['2g de henna', '1 disco de algodão', '1 par de luvas'] },
          consumptionList: [
            { service: 'Design com Henna', items: ['2g de henna', '1 disco de algodão', '1 par de luvas'] },
            { service: 'Design com Cera', items: ['15g de cera', '2 discos de algodão', '1 par de luvas'] },
          ],
          alerts: [
            'Seu estoque de henna marrom escuro está abaixo do ideal. Pela sua média de atendimentos, você deve precisar repor em aproximadamente 6 dias.',
            'Você realizou 15 designs com henna neste mês.',
            'Seu gasto com materiais aumentou 12% comparado ao mês anterior.',
          ],
          products: [
            { name: 'Henna Marrom Escuro', category: 'Henna', brand: 'BrowArt', supplier: 'Studio Brow Distribuidora', qty: 3, minQty: 5, unit: 'un', purchaseValue: 45 },
            { name: 'Cera Quente Rosa', category: 'Cera', brand: 'Depil Bella', supplier: 'Beauty Supply BR', qty: 2, minQty: 1, unit: 'kg', purchaseValue: 95 },
            { name: 'Linha de Marcação Branca', category: 'Linha de marcação', brand: 'BrowArt', supplier: 'Studio Brow Distribuidora', qty: 6, minQty: 3, unit: 'rolos', purchaseValue: 22 },
            { name: 'Algodão em Disco', category: 'Algodão', brand: 'Cotton Soft', supplier: 'Beauty Supply BR', qty: 1, minQty: 2, unit: 'pct', purchaseValue: 28 },
          ],
        },
        esteticista: {
          categories: ['Cremes', 'Séruns', 'Máscaras', 'Ácidos/produtos profissionais', 'Luvas', 'Gaze', 'Descartáveis'],
          consumption: { service: 'Limpeza de pele profunda', items: ['5ml de sérum', '2 gazes', '1 par de luvas'] },
          consumptionList: [
            { service: 'Limpeza de pele profunda', items: ['5ml de sérum', '2 gazes', '1 par de luvas'] },
            { service: 'Peeling químico', items: ['3ml de ácido glicólico', '1 máscara calmante', '1 par de luvas'] },
          ],
          alerts: [
            'Seu estoque de sérum de vitamina C está abaixo do ideal. Pela sua média de atendimentos, você deve precisar repor em aproximadamente 4 dias.',
            'Você realizou 20 limpezas de pele neste mês.',
            'Seu gasto com materiais aumentou 20% comparado ao mês anterior.',
          ],
          products: [
            { name: 'Sérum Vitamina C', category: 'Séruns', brand: 'Dermaskin', supplier: 'Studio Estética Distribuidora', qty: 3, minQty: 5, unit: 'un', purchaseValue: 45 },
            { name: 'Ácido Glicólico 30%', category: 'Ácidos/produtos profissionais', brand: 'Dermaskin', supplier: 'Studio Estética Distribuidora', qty: 4, minQty: 2, unit: 'un', purchaseValue: 45 },
            { name: 'Máscara de Alginato', category: 'Máscaras', brand: 'SkinLab', supplier: 'Beauty Supply BR', qty: 6, minQty: 3, unit: 'kg', purchaseValue: 95 },
            { name: 'Gaze Estéril', category: 'Descartáveis', brand: 'Cremer', supplier: 'Beauty Supply BR', qty: 2, minQty: 4, unit: 'pct', purchaseValue: 28 },
          ],
        },
      },
    },
    relatorios: {
      heading: 'Relatórios claros para decisões melhores',
      title: 'Relatórios',
      metrics: [
        { label: 'Receita', value: 'R$ 11.470', delta: '+18%' },
        { label: 'Novos clientes', value: '23', delta: '+6%' },
        { label: 'Retenção', value: '71%', delta: '+4%' },
      ],
      topServicesLabel: 'Serviços mais rentáveis',
      topServices: [
        { name: 'Volume russo', pct: '46%' },
        { name: 'Design de sobrancelha', pct: '27%' },
        { name: 'Volume brasileiro', pct: '18%' },
        { name: 'Retoque', pct: '9%' },
      ],
      insightLabel: 'Insight da IA',
      insight: 'Clientes de Volume russo geram 2,3x mais receita recorrente. Considere um pacote de fidelidade para essa categoria.',
    },
    ia: {
      heading: 'Sua assistente pessoal de negócios',
      title: 'Assistente IA',
      subtitle: 'Sempre disponível',
      messages: [
        { from: 'ai', text: 'Bom dia! Você tem 5 atendimentos hoje e já bateu 62% da meta do mês.', align: 'flex-start', bg: '#FFFFFF', color: '#26221D' },
        { from: 'user', text: 'Quais clientes eu deveria reativar essa semana?', align: 'flex-end', bg: '#201C17', color: '#F4E9D2' },
        { from: 'ai', text: '3 clientes estão há mais de 60 dias sem visita: Ana, Priscila e Ingrid. Posso preparar uma mensagem de reativação.', align: 'flex-start', bg: '#FFFFFF', color: '#26221D' },
        { from: 'user', text: 'Sim, por favor.', align: 'flex-end', bg: '#201C17', color: '#F4E9D2' },
      ],
      suggestions: ['Gerar plano do dia', 'Sugerir conteúdo', 'Analisar meu mês'],
    },
    config: {
      heading: 'Controle total do seu perfil e do app',
      title: 'Configurações',
      sections: [
        { header: 'Perfil', items: [{ label: 'Nome', value: 'Marina Alves' }, { label: 'Profissão', value: 'Lash Designer' }] },
        { header: 'Preferências', items: [{ label: 'Idioma', value: 'Português' }, { label: 'Moeda', value: 'Real (R$)' }, { label: 'País', value: 'Brasil' }] },
        { header: 'Automações', items: [{ label: 'WhatsApp', value: 'Ativado' }, { label: 'SMS', value: 'Desativado' }] },
        { header: 'Plano', items: [{ label: 'Assinatura', value: 'Premium' }] },
      ],
    },
    tabbar: { hoje: 'Hoje', agenda: 'Agenda', crm: 'CRM', financeiro: 'Financeiro', mais: 'Mais' },
    desktopNav: [
      { label: 'Hoje', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Agenda', color: '#B7AE9C', bg: 'transparent' },
      { label: 'CRM', color: '#201C17', bg: '#F4E9D2' },
      { label: 'Financeiro', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Relatórios', color: '#B7AE9C', bg: 'transparent' },
    ],
    desktopNavFin: [
      { label: 'Hoje', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Agenda', color: '#B7AE9C', bg: 'transparent' },
      { label: 'CRM', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Financeiro', color: '#201C17', bg: '#F4E9D2' },
      { label: 'Relatórios', color: '#B7AE9C', bg: 'transparent' },
    ],
  },
  en: {
    brand: { name: 'Beauty Consultants', tagline: 'Your beauty business, elevated by AI' },
    hero: {
      kicker: 'Beauty Consultants',
      title: 'The business assistant for beauty professionals',
      subtitle:
        'A full walkthrough of the product: from onboarding a new professional to the daily financial dashboard. Tap through each screen to see the flow.',
    },
    sectionLabels: {
      onboarding: 'Onboarding',
      today: 'Module · Today',
      clientMachine: 'Module · Client Machine',
      crm: 'Module · CRM',
      agendaSetup: 'Module · Smart Calendar',
      publicPage: 'Module · Public Page',
      agenda: 'Module · Calendar',
      financeiro: 'Module · Finance',
      inventory: 'Module · Smart Inventory',
      reports: 'Module · Reports',
      ai: 'Module · AI Assistant',
      settings: 'Module · Settings',
    },
    onboarding: {
      heading: 'A first setup that personalizes the entire app',
      step: 'Step',
      next: 'Continue',
      finish: 'Start using',
      s1: {
        title: 'Which language do you prefer?',
        subtitle: 'You can change this later.',
        options: [
          { label: 'English', selected: true, bg: '#FBF3E4', borderColor: '#E3C989' },
          { label: 'Português', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Español', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
        ],
      },
      s3: {
        title: 'Which currency do you use?',
        subtitle: 'Used across your finance module.',
        options: [
          { label: 'Dollar ($)', selected: true, bg: '#FBF3E4', borderColor: '#E3C989' },
          { label: 'Euro (€)', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Real (R$)', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
        ],
      },
      s4: {
        title: 'What is your profession?',
        subtitle: 'We tailor services and language.',
        options: [
          { label: 'Lash Designer', selected: true, bg: '#FBF3E4', borderColor: '#E3C989' },
          { label: 'Nail Designer', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Hair Stylist', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Esthetician', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
          { label: 'Micropigmentation', selected: false, bg: '#FFFFFF', borderColor: '#EBE2CF' },
        ],
      },
      s5: { title: 'What is your monthly goal?', subtitle: 'The AI builds your plan around it.', amount: '$12,000', perMonth: 'per month' },
    },
    today: {
      heading: 'A daily dashboard with an AI action plan',
      date: 'Tuesday, July 14',
      greeting: 'Good morning, Marina',
      revenueLabel: "Today's revenue",
      revenueValue: '$420',
      revenueSub: '4 appointments completed',
      quickActionsLabel: 'Quick actions',
      quickActions: {
        createContent: 'Create Content',
        registerAttendance: 'Register Attendance',
        registeredDone: 'Attendance registered ✓',
        goFinance: 'Go to Finance',
        newClient: 'Add Client',
      },
      goal: { label: "This month's goal", current: '$1,280 of $2,000' },
      diagnostic: {
        timestamp: 'Today, 9:14 AM',
        message: 'Ana, you have 3 open slots this week. Want me to fill them?',
        ctaLabel: 'Fill my calendar now',
      },
      contentSuggestion: {
        label: 'Content suggestion',
        message: 'Your calendar has few slots filled this week. Want to create content to attract more clients?',
        ctaLabel: 'Create content now',
      },
      processLabel: 'How your AI Secretary works for you',
      processSteps: [
        { num: '01', title: 'Quick setup', desc: 'You add clients, bookings, products and services in minutes, right from your phone.' },
        { num: '02', title: 'Smart cross-check', desc: 'The assistant cross-references your calendar, finance, and inventory data to spot risk.' },
        { num: '03', title: 'Ready alert', desc: 'You get the right nudge: a client to call, a product to restock, content ready to post.' },
      ],
      actionCardsLabel: "Today's actions",
      actionCards: [
        { title: "3 clients haven't confirmed tomorrow's slot", desc: 'Send a reminder now and avoid gaps in your calendar.', ctaLabel: 'Send reminder now' },
        { title: 'Potential $150 to win back this month', desc: 'Clients gone quiet for 60+ days, ready for reactivation.', ctaLabel: 'View client list' },
        { title: 'Black Fast lash adhesive is running low', desc: 'Based on your average bookings, stock runs out in 5 days.', ctaLabel: 'Restock now' },
        { title: 'Content ready to post today', desc: 'A before/after Reel with a full script is waiting for you.', ctaLabel: 'View Reel script' },
      ],
      readyResponsesLabel: 'Ready response center',
      readyResponsesOpenLabel: 'View responses',
      readyResponsesCloseLabel: 'Close',
      readyResponses: [
        { title: 'Reactivation', text: "Hi [Name], it's been a while! I saved a special slot for you this week." },
        { title: 'Offer', text: 'Last spots this week! I opened a special slot today with an exclusive rate. Want to grab it?' },
        { title: 'Follow-up', text: 'Hi [Name]! Just checking in on how you’re loving the results.' },
      ],
      copyLabel: 'Copy',
      copiedLabel: 'Copied!',
    },
    clientMachine: {
      heading: 'Create content, sell more, and capture clients automatically',
      title: 'Client Machine',
      tabs: { contentLabel: 'AI Content', funnelLabel: 'Acquisition Funnel' },
      tool: {
        ui: {
          title: 'Content',
          subtitle: 'Create content and ready-made messages with AI',
          suggestionLabel: 'AI Secretary suggestion',
          acceptSuggestionCta: 'Generate suggested content',
          objectiveLabel: 'What is your objective?',
          approachLabel: 'Which approach do you want to use for this content?',
          back: 'Back',
          createAnother: 'Create another content',
          reelLabel: 'Reel/Video script',
          postLabel: 'Post caption',
          storyLabel: 'Story strategy',
          copy: 'Copy',
          copied: 'Copied!',
          resultSubtitle: 'Content generated by AI',
          historyLabel: 'History of generated content',
          noHistory: 'No content generated yet.',
        },
        suggestionText: 'Your calendar has few slots filled this week. Want to create content to attract more clients?',
        suggestedObjective: 'atrair',
        suggestedApproach: 'desejo',
      },
      funnel: {
        label: 'Acquisition funnel (30 days)',
        steps: [
          { label: 'Link visits', value: '842', pct: '100%' },
          { label: 'Started signup', value: '316', pct: '62%' },
          { label: 'Booked', value: '128', pct: '38%' },
          { label: 'Showed up', value: '109', pct: '29%' },
        ],
        linkLabel: 'Your booking link',
        linkUrl: 'beautyconsultants.app/marina-lash',
        cta: 'Copy link',
        conversionLabel: 'Conversion rate',
        conversionValue: '15.2%',
        conversionDelta: '+3.4%',
      },
    },
    agendaSetup: {
      heading: 'Set up your calendar and generate your online booking link',
      title: 'Calendar Setup',
      subtitle: 'Clients book themselves, within the rules you define',
      daysLabel: 'Working days',
      days: [
        { label: 'Mon', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Tue', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Wed', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Thu', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Fri', bg: '#201C17', color: '#F4E9D2' },
        { label: 'Sat', bg: '#F2ECDF', color: '#B0A78F' },
        { label: 'Sun', bg: '#F2ECDF', color: '#B0A78F' },
      ],
      hoursLabel: 'Available hours',
      hoursValue: '9:00 AM – 7:00 PM',
      intervalLabel: 'Interval between slots',
      intervalValue: '15 min',
      servicesLabel: 'Services & duration',
      services: [
        { name: 'Russian volume', duration: '2h30' },
        { name: 'Classic volume', duration: '2h00' },
        { name: 'Brow design', duration: '45min' },
        { name: 'Touch-up', duration: '1h15' },
      ],
      prepLabel: 'Prep/cleanup time',
      prepValue: '15 min between each appointment',
      blockedLabel: 'Blocked times',
      blocked: ['Lunch, 12:00–1:00 PM, every day', 'Fridays after 6:00 PM'],
      linkLabel: 'Automatically generated link',
      linkUrl: 'beautyconsultants.app/marina-lash',
      generateCta: 'Generate booking link',
    },
    publicPage: {
      heading: 'A sales and booking page for every professional',
      photoLabel: 'PROFESSIONAL PHOTO',
      name: 'Marina Alves',
      role: 'Premium Lash Designer',
      bio: 'Specialist in Russian volume and eye design. Personalized appointments in New York.',
      instagram: '@marina.lash',
      whatsapp: '+1 (555) 123-4567',
      locationLabel: 'Location',
      location: 'New York, NY',
      servicesLabel: 'Services',
      selectLabel: 'Select',
      selectedLabel: 'Selected',
      services: [
        { name: 'Russian volume', price: '$95' },
        { name: 'Classic volume', price: '$75' },
        { name: 'Brow design', price: '$35' },
        { name: 'Touch-up', price: '$50' },
      ],
      portfolioLabel: 'Work photos',
      portfolio: ['WORK PHOTO', 'WORK PHOTO', 'WORK PHOTO', 'WORK PHOTO', 'WORK PHOTO', 'WORK PHOTO'],
      cta: 'Book appointment',
      poweredBy: 'Page created with Beauty Consultants',
    },
    crm: {
      heading: 'A single record with history and finance',
      title: 'Clients',
      searchPlaceholder: 'Search client...',
      attendanceLabel: 'Attendance rate',
      stages: [
        { key: 'todos', label: 'All' },
        { key: 'leads', label: 'Leads' },
        { key: 'agendados', label: 'Booked' },
        { key: 'inativo', label: 'Inactive' },
        { key: 'vip', label: 'VIP' },
        { key: 'fidelizados', label: 'Loyal' },
      ],
      clients: [
        { initial: 'CD', name: 'Camila Duarte', tag: 'Lash · VIP', lastVisit: '3 days ago', value: '$780', stage: 'vip' },
        { initial: 'BM', name: 'Beatriz Moraes', tag: 'Brows', lastVisit: '12 days ago', value: '$290', stage: 'agendados' },
        { initial: 'JS', name: 'Juliana Sales', tag: 'Lash · New', lastVisit: '1 day ago', value: '$60', stage: 'agendados' },
        { initial: 'RF', name: 'Renata Ferreira', tag: 'Maintenance', lastVisit: '20 days ago', value: '$375', stage: 'fidelizados' },
        { initial: 'LP', name: 'Larissa Pires', tag: 'Lash · VIP', lastVisit: '5 days ago', value: '$1,010', stage: 'vip' },
        { initial: 'AN', name: 'Ana Nogueira', tag: 'No rebooking', lastVisit: '68 days ago', value: '$140', stage: 'inativo' },
        { initial: 'PS', name: 'Priscila Santos', tag: 'No rebooking', lastVisit: '74 days ago', value: '$90', stage: 'inativo' },
        { initial: 'IG', name: 'Ingrid Gomes', tag: 'Contact via link', lastVisit: 'New contact', value: '—', stage: 'leads' },
        { initial: 'TF', name: 'Tatiane Freitas', tag: 'Contact via Instagram', lastVisit: 'New contact', value: '—', stage: 'leads' },
      ],
      profile: {
        initial: 'CD',
        name: 'Camila Duarte',
        since: 'Client since March 2024',
        totalSpent: '$780',
        totalSpentLabel: 'Total spent',
        visits: '14',
        visitsLabel: 'Visits',
        tagsLabel: 'Profile',
        tags: ['VIP', 'Russian volume', 'Prefers mornings'],
        nextApptLabel: 'Next appointment',
        nextAppt: 'Today at 4:00 PM · Lash extensions',
      },
      colName: 'Name',
      colTag: 'Profile',
      colLast: 'Last visit',
      colValue: 'Total value',
      desktopUrl: 'app.beautyconsultants.com/crm',
    },
    agenda: {
      heading: 'Calendar integrated with finance',
      title: 'Calendar',
      dateLabel: 'Tuesday, July 14',
      statusLabels: { confirmed: 'Confirmed', done: 'Done', pending: 'Pending' },
      appointments: [
        { time: '9:00', client: 'Larissa Pires', service: 'Russian volume · Fill', status: 'done' },
        { time: '11:00', client: 'Juliana Sales', service: 'Classic volume · First visit', status: 'confirmed' },
        { time: '1:30', client: 'Renata Ferreira', service: 'Brow design', status: 'done' },
        { time: '4:00', client: 'Camila Duarte', service: 'Lash extensions · Russian volume', status: 'confirmed' },
        { time: '6:00', client: 'Beatriz Moraes', service: 'Rebook · Brows', status: 'pending' },
      ],
    },
    financeiro: {
      heading: 'Goals, average ticket, and multi-currency history',
      title: 'Finance',
      goalLabel: 'July goal',
      goalPercent: '62%',
      goalRemaining: '$4,560 left to reach the $12,000 goal',
      revenueLabel: 'Monthly revenue',
      revenueValue: '$7,440',
      avgTicketLabel: 'Average ticket',
      avgTicketValue: '$78',
      historyLabel: 'Last 6 months history',
      months: [
        { label: 'Feb', pct: '40%' },
        { label: 'Mar', pct: '55%' },
        { label: 'Apr', pct: '48%' },
        { label: 'May', pct: '70%' },
        { label: 'Jun', pct: '82%' },
        { label: 'Jul', pct: '62%' },
      ],
      currencyNote: 'Values shown in USD ($) · configurable per country',
      desktopUrl: 'app.beautyconsultants.com/finance',
    },
    inventory: {
      heading: 'Material control that predicts restocking and prevents shortages',
      title: 'Inventory',
      productsTitle: 'Products',
      remainingLabel: 'left',
      restockCta: 'Restock now',
      historyCta: 'View spending history',
      allProductsLabel: 'All products',
      inStockLabel: 'in stock',
      addProductCta: '+ Add product',
      expandCta: 'View',
      collapseCta: 'Hide',
      totalInvestedLabel: 'Total invested in products',
      registerProductLabel: 'Register product',
      formNamePlaceholder: 'Product name',
      formQtyPlaceholder: 'Quantity',
      formValuePlaceholder: 'Amount paid (optional)',
      formValueHint: 'Fill in the amount to add it to your total product investment.',
      formSubmitCta: 'Save product',
      statusLabels: { ok: 'OK', low: 'Low stock', out: 'Out of stock' },
      quickActionsLabel: 'Quick actions',
      stockValueLabel: 'Estimated stock value',
      monthlySpendLabel: 'Material spend this month',
      monthlySpendValue: '$128',
      lowStockLabel: 'Low stock',
      renewalLabel: 'Need renewal',
      aiAlertsLabel: 'AI alerts',
      movementsLabel: 'Recent movements',
      consumptionLabel: 'Average consumption per appointment',
      financeIntegrationLabel: 'Finance integration',
      financeIntegrationText: 'Every purchase logged here automatically creates an expense in Finance, with category and profit impact calculated.',
      lowBadge: 'Low stock',
      qtyLabel: 'Current qty',
      minLabel: 'Min. qty',
      supplierLabel: 'Supplier',
      movements: [
        'Added: 10 XL tips — today',
        'Used: 2ml of builder gel — yesterday',
        'Purchase logged: nail polish remover — 3 days ago',
        'Stock deducted: 1 pair of gloves — 4 days ago',
      ],
      quickActions: [
        { key: 'add', label: 'Add product' },
        { key: 'purchase', label: 'Log purchase' },
        { key: 'writeoff', label: 'Deduct stock' },
        { key: 'lowstock', label: 'View low stock' },
        { key: 'report', label: 'View consumption report' },
      ],
      professions: [
        { key: 'lash', label: 'Lash Designer' },
        { key: 'nail', label: 'Nail Designer' },
        { key: 'brow', label: 'Brow Artist' },
        { key: 'esteticista', label: 'Esthetician' },
      ],
      productsByProfession: {
        lash: {
          categories: ['Lash extensions', 'Adhesives', 'Pads', 'Tape', 'Tweezers', 'Brushes', 'Cleansers'],
          consumption: { service: 'Russian volume', items: ['0.3g of adhesive', '2 gel pads', '1 pair of gloves'] },
          consumptionList: [
            { service: 'Russian volume', items: ['0.3g of adhesive', '2 gel pads', '1 pair of gloves'] },
            { service: 'Classic volume', items: ['0.2g of adhesive', '2 gel pads', '1 pair of gloves'] },
          ],
          alerts: [
            'You performed 18 procedures using lash adhesive this month. We recommend checking your stock.',
            'Your Black Fast adhesive stock is below ideal. Based on your average bookings, you should restock in about 5 days.',
            'Your material spend increased 20% compared to last month.',
          ],
          products: [
            { name: 'Black Fast Lash Adhesive', category: 'Adhesives', brand: 'LashPro', supplier: 'Studio Lash Supply', qty: 2, minQty: 4, unit: 'units', purchaseValue: 45 },
            { name: 'Russian Volume 0.07 D Curl', category: 'Lash extensions', brand: 'Lash Milano', supplier: 'Studio Lash Supply', qty: 12, minQty: 6, unit: 'boxes', purchaseValue: 120 },
            { name: 'Gel Pads', category: 'Pads', brand: 'LashPro', supplier: 'Beauty Supply Co', qty: 5, minQty: 8, unit: 'pairs', purchaseValue: 18 },
            { name: 'Micropore Tape', category: 'Tape', brand: '3M', supplier: 'Beauty Supply Co', qty: 10, minQty: 5, unit: 'rolls', purchaseValue: 22 },
          ],
        },
        nail: {
          categories: ['Gels', 'Polishes', 'Tips', 'Files', 'Bits', 'Primer', 'Top coat', 'Removers', 'Gloves', 'Disposables'],
          consumption: { service: 'Fiberglass extension', items: ['5ml of gel', '1 file', '1 pair of gloves'] },
          consumptionList: [
            { service: 'Fiberglass extension', items: ['5ml of gel', '1 file', '1 pair of gloves'] },
            { service: 'Gel polish', items: ['2ml of gel polish', '1 top coat', '1 pair of gloves'] },
          ],
          alerts: [
            'Your builder gel stock is below ideal. Based on your average bookings, you should restock in about 7 days.',
            'You used 22 XL tips this month, 40% more than last month.',
            'Your material spend increased 20% compared to last month.',
          ],
          products: [
            { name: 'Pink Builder Gel', category: 'Gels', brand: 'Dubai Gel', supplier: 'Studio Nails Supply', qty: 2, minQty: 4, unit: 'units', purchaseValue: 45 },
            { name: 'Classic Red Polish', category: 'Polishes', brand: 'Colorama', supplier: 'Studio Nails Supply', qty: 8, minQty: 3, unit: 'units', purchaseValue: 45 },
            { name: 'File 100/180', category: 'Files', brand: 'Mundial', supplier: 'Beauty Supply Co', qty: 15, minQty: 10, unit: 'units', purchaseValue: 45 },
            { name: 'Disposable Gloves S', category: 'Gloves', brand: 'Supermax', supplier: 'Beauty Supply Co', qty: 1, minQty: 2, unit: 'boxes', purchaseValue: 120 },
          ],
        },
        brow: {
          categories: ['Henna', 'Tints', 'Tweezers', 'Threading line', 'Wax', 'Cotton', 'Gloves', 'Cleansers'],
          consumption: { service: 'Henna brow design', items: ['2g of henna', '1 cotton pad', '1 pair of gloves'] },
          consumptionList: [
            { service: 'Henna brow design', items: ['2g of henna', '1 cotton pad', '1 pair of gloves'] },
            { service: 'Wax brow design', items: ['15g of wax', '2 cotton pads', '1 pair of gloves'] },
          ],
          alerts: [
            'Your dark brown henna stock is below ideal. Based on your average bookings, you should restock in about 6 days.',
            'You performed 15 henna designs this month.',
            'Your material spend increased 12% compared to last month.',
          ],
          products: [
            { name: 'Dark Brown Henna', category: 'Henna', brand: 'BrowArt', supplier: 'Studio Brow Supply', qty: 3, minQty: 5, unit: 'units', purchaseValue: 45 },
            { name: 'Pink Hot Wax', category: 'Wax', brand: 'Depil Bella', supplier: 'Beauty Supply Co', qty: 2, minQty: 1, unit: 'kg', purchaseValue: 95 },
            { name: 'White Threading Line', category: 'Threading line', brand: 'BrowArt', supplier: 'Studio Brow Supply', qty: 6, minQty: 3, unit: 'rolls', purchaseValue: 22 },
            { name: 'Cotton Pads', category: 'Cotton', brand: 'Cotton Soft', supplier: 'Beauty Supply Co', qty: 1, minQty: 2, unit: 'packs', purchaseValue: 28 },
          ],
        },
        esteticista: {
          categories: ['Creams', 'Serums', 'Masks', 'Acids/professional products', 'Gloves', 'Gauze', 'Disposables'],
          consumption: { service: 'Deep facial cleansing', items: ['5ml of serum', '2 gauze pads', '1 pair of gloves'] },
          consumptionList: [
            { service: 'Deep facial cleansing', items: ['5ml of serum', '2 gauze pads', '1 pair of gloves'] },
            { service: 'Chemical peel', items: ['3ml of glycolic acid', '1 soothing mask', '1 pair of gloves'] },
          ],
          alerts: [
            'Your vitamin C serum stock is below ideal. Based on your average bookings, you should restock in about 4 days.',
            'You performed 20 facial cleansings this month.',
            'Your material spend increased 20% compared to last month.',
          ],
          products: [
            { name: 'Vitamin C Serum', category: 'Serums', brand: 'Dermaskin', supplier: 'Studio Esthetics Supply', qty: 3, minQty: 5, unit: 'units', purchaseValue: 45 },
            { name: '30% Glycolic Acid', category: 'Acids/professional products', brand: 'Dermaskin', supplier: 'Studio Esthetics Supply', qty: 4, minQty: 2, unit: 'units', purchaseValue: 45 },
            { name: 'Alginate Mask', category: 'Masks', brand: 'SkinLab', supplier: 'Beauty Supply Co', qty: 6, minQty: 3, unit: 'kg', purchaseValue: 95 },
            { name: 'Sterile Gauze', category: 'Disposables', brand: 'Cremer', supplier: 'Beauty Supply Co', qty: 2, minQty: 4, unit: 'packs', purchaseValue: 28 },
          ],
        },
      },
    },
    relatorios: {
      heading: 'Clear reports for better decisions',
      title: 'Reports',
      metrics: [
        { label: 'Revenue', value: '$7,440', delta: '+18%' },
        { label: 'New clients', value: '23', delta: '+6%' },
        { label: 'Retention', value: '71%', delta: '+4%' },
      ],
      topServicesLabel: 'Top performing services',
      topServices: [
        { name: 'Russian volume', pct: '46%' },
        { name: 'Brow design', pct: '27%' },
        { name: 'Classic volume', pct: '18%' },
        { name: 'Touch-up', pct: '9%' },
      ],
      insightLabel: 'AI insight',
      insight: 'Russian volume clients generate 2.3x more recurring revenue. Consider a loyalty package for this category.',
    },
    ia: {
      heading: 'Your personal business assistant',
      title: 'AI Assistant',
      subtitle: 'Always available',
      messages: [
        { from: 'ai', text: "Good morning! You have 5 appointments today and you've hit 62% of this month's goal.", align: 'flex-start', bg: '#FFFFFF', color: '#26221D' },
        { from: 'user', text: 'Which clients should I reactivate this week?', align: 'flex-end', bg: '#201C17', color: '#F4E9D2' },
        { from: 'ai', text: "3 clients haven't visited in 60+ days: Ana, Priscila, and Ingrid. I can draft a reactivation message.", align: 'flex-start', bg: '#FFFFFF', color: '#26221D' },
        { from: 'user', text: 'Yes, please.', align: 'flex-end', bg: '#201C17', color: '#F4E9D2' },
      ],
      suggestions: ["Generate today's plan", 'Suggest content', 'Analyze my month'],
    },
    config: {
      heading: 'Full control over your profile and the app',
      title: 'Settings',
      sections: [
        { header: 'Profile', items: [{ label: 'Name', value: 'Marina Alves' }, { label: 'Profession', value: 'Lash Designer' }] },
        { header: 'Preferences', items: [{ label: 'Language', value: 'English' }, { label: 'Currency', value: 'Dollar ($)' }, { label: 'Country', value: 'United States' }] },
        { header: 'Automations', items: [{ label: 'WhatsApp', value: 'Enabled' }, { label: 'SMS', value: 'Disabled' }] },
        { header: 'Plan', items: [{ label: 'Subscription', value: 'Premium' }] },
      ],
    },
    tabbar: { hoje: 'Today', agenda: 'Calendar', crm: 'CRM', financeiro: 'Finance', mais: 'More' },
    desktopNav: [
      { label: 'Today', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Calendar', color: '#B7AE9C', bg: 'transparent' },
      { label: 'CRM', color: '#201C17', bg: '#F4E9D2' },
      { label: 'Finance', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Reports', color: '#B7AE9C', bg: 'transparent' },
    ],
    desktopNavFin: [
      { label: 'Today', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Calendar', color: '#B7AE9C', bg: 'transparent' },
      { label: 'CRM', color: '#B7AE9C', bg: 'transparent' },
      { label: 'Finance', color: '#201C17', bg: '#F4E9D2' },
      { label: 'Reports', color: '#B7AE9C', bg: 'transparent' },
    ],
  },
};
