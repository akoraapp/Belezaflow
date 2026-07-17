export interface ContentResult {
  diagnostico: string;
  estrategia: string;
  roteiro: string;
  legenda: string;
  cta: string;
}

const OBJETIVO_ANGLE: Record<string, { diagnostico: string; estrategia: string }> = {
  'Atrair clientes': {
    diagnostico: 'Quem ainda não te conhece precisa ver prova visual do seu trabalho antes de confiar no seu preço.',
    estrategia: 'Priorize antes/depois e bastidores do atendimento — isso reduz a objeção de "não conheço o trabalho dela" mais rápido que qualquer discurso.',
  },
  'Preencher agenda': {
    diagnostico: 'Você tem horários vagos essa semana, e quem já te segue só precisa de um empurrão com urgência real.',
    estrategia: 'Comunique a escassez com honestidade — quantidade exata de vagas e prazo — sem soar como propaganda genérica.',
  },
  'Reativar clientes': {
    diagnostico: 'Clientes que já confiaram em você um dia esquecem de voltar, não porque não gostaram, mas porque a rotina engole a lembrança.',
    estrategia: 'Fale diretamente com quem sumiu, reconhecendo o tempo que passou e oferecendo um motivo concreto para voltar agora.',
  },
  Autoridade: {
    diagnostico: 'Preço alto sem contexto parece caro; preço alto com processo visível parece justo.',
    estrategia: 'Mostre o cuidado técnico por trás do resultado — o que a cliente não vê no espelho, mas paga para ter.',
  },
  'Quebra de objeção': {
    diagnostico: 'A maior parte de quem não agenda não discorda do valor do seu trabalho — só não decidiu resolver a dúvida que ainda tem.',
    estrategia: 'Nomeie a objeção mais comum em voz alta antes que a cliente precise perguntar, e responda com um fato, não uma promessa.',
  },
};

const FORMATO_ROTEIRO: Record<string, string> = {
  Reel: 'Abra com o resultado pronto nos primeiros 2 segundos, corte para o processo em 3-4 cenas rápidas, feche com o rosto da cliente satisfeita e o CTA em texto na tela.',
  Story: 'Use uma sequência de 3 stories: enquete ou pergunta no primeiro, bastidor real no segundo, link/botão de agendar no terceiro.',
  Carrossel: 'Capa com uma afirmação direta, 3-4 slides desenvolvendo o raciocínio com uma ideia por slide, último slide com o CTA isolado.',
  Post: 'Uma imagem forte do resultado como âncora visual, legenda carregando o raciocínio completo do gancho ao CTA.',
};

const INTENSIDADE_TOM: Record<string, string> = {
  Rápido: 'Tom direto e curto — priorize a ação sobre a explicação.',
  Estratégico: 'Tom consultivo — explique o porquê antes do quê, construindo confiança junto com o CTA.',
  Agressivo: 'Tom urgente e assertivo — deixe claro o custo de adiar a decisão, sem ser agressivo com a pessoa.',
};

export async function generateContent(objetivo: string, formato: string, intensidade: string): Promise<ContentResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const angle = OBJETIVO_ANGLE[objetivo] || OBJETIVO_ANGLE['Preencher agenda'];
  const roteiroBase = FORMATO_ROTEIRO[formato] || FORMATO_ROTEIRO.Post;
  const tom = INTENSIDADE_TOM[intensidade] || INTENSIDADE_TOM.Estratégico;

  return {
    diagnostico: angle.diagnostico,
    estrategia: `${angle.estrategia} ${tom}`,
    roteiro: `Formato ${formato}: ${roteiroBase}`,
    legenda:
      objetivo === 'Reativar clientes'
        ? 'Faz tempo que a gente não se vê por aqui 💛 Separei um horário pensando em você essa semana — quer aproveitar?'
        : objetivo === 'Quebra de objeção'
          ? 'Sei que às vezes o que trava não é vontade, é dúvida. Te conto exatamente como funciona antes de você decidir 👇'
          : 'Ainda tem horário essa semana — e eles não ficam abertos por muito tempo. Bora marcar o seu?',
    cta: intensidade === 'Agressivo' ? 'Últimas vagas — responda essa mensagem agora para garantir o seu horário.' : 'Toque no link da bio ou me chama no direct para escolher seu horário.',
  };
}
