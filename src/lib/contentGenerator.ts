import type { Lang } from '../types';

export interface ContentResult {
  diagnostico: string;
  estrategia: string;
  roteiro: string;
  legenda: string;
  cta: string;
}

type Angle = { diagnostico: string; estrategia: string; legenda: string };

const OBJETIVO_ANGLE: Record<Lang, Record<string, Angle>> = {
  pt: {
    'Atrair clientes': {
      diagnostico: 'Quem ainda não te conhece precisa ver prova visual do seu trabalho antes de confiar no seu preço.',
      estrategia: 'Priorize antes/depois e bastidores do atendimento. Isso reduz a objeção de "não conheço o trabalho dela" mais rápido do que qualquer discurso.',
      legenda: 'Isso aqui não foi photoshop, foi técnica. Cada detalhe do resultado começa numa avaliação bem feita antes do primeiro toque.',
    },
    'Preencher agenda': {
      diagnostico: 'Você tem horários vagos essa semana, e quem já te segue só precisa de um empurrão com urgência real.',
      estrategia: 'Comunique a escassez com honestidade: quantidade exata de vagas e prazo, sem soar como propaganda genérica.',
      legenda: 'Essa semana sobrou espaço na agenda que eu não esperava. Se você tava esperando o momento certo, pode ser agora.',
    },
    'Reativar clientes': {
      diagnostico: 'Clientes que já confiaram em você um dia esquecem de voltar, não porque não gostaram, mas porque a rotina engole a lembrança.',
      estrategia: 'Fale diretamente com quem sumiu, reconhecendo o tempo que passou e oferecendo um motivo concreto para voltar agora.',
      legenda: 'Faz tempo que a gente não se vê por aqui. Separei um horário pensando em você essa semana, quer aproveitar?',
    },
    Autoridade: {
      diagnostico: 'Preço alto sem contexto parece caro; preço alto com processo visível parece justo.',
      estrategia: 'Mostre o cuidado técnico por trás do resultado: o que a cliente não vê no espelho, mas paga para ter.',
      legenda: 'O que separa um resultado que dura de um que estraga em duas semanas não é sorte, é processo. Deixa eu te mostrar o meu.',
    },
    'Quebra de objeção': {
      diagnostico: 'A maior parte de quem não agenda não discorda do valor do seu trabalho, só não decidiu resolver a dúvida que ainda tem.',
      estrategia: 'Nomeie a objeção mais comum em voz alta antes que a cliente precise perguntar, e responda com um fato, não uma promessa.',
      legenda: 'Sei que às vezes o que trava não é vontade, é dúvida. Te conto exatamente como funciona antes de você decidir.',
    },
  },
  en: {
    'Atrair clientes': {
      diagnostico: "People who don't know you yet need visual proof of your work before they trust your price.",
      estrategia: "Prioritize before/after shots and behind-the-scenes footage. It kills the \"I don't know her work\" objection faster than any pitch.",
      legenda: "This wasn't Photoshop, it was technique. Every detail of the result starts with a proper assessment before the first touch.",
    },
    'Preencher agenda': {
      diagnostico: 'You have open slots this week, and people who already follow you just need a real, honest push.',
      estrategia: 'Communicate scarcity honestly: exact number of slots and deadline, without sounding like generic advertising.',
      legenda: "I had more room open up this week than I expected. If you've been waiting for the right time, this might be it.",
    },
    'Reativar clientes': {
      diagnostico: "Clients who already trusted you once forget to come back, not because they didn't like it, but because routine swallows the memory.",
      estrategia: "Speak directly to the people who vanished, acknowledging the time that's passed and offering a concrete reason to come back now.",
      legenda: "It's been a while since we've seen you here. I saved a slot with you in mind this week, want to grab it?",
    },
    Autoridade: {
      diagnostico: 'A high price with no context feels expensive; a high price with a visible process feels fair.',
      estrategia: "Show the technical care behind the result: what the client doesn't see in the mirror, but pays for.",
      legenda: "What separates a result that lasts from one that fades in two weeks isn't luck, it's process. Let me show you mine.",
    },
    'Quebra de objeção': {
      diagnostico: "Most people who don't book don't disagree with your value, they just haven't resolved a doubt they still have.",
      estrategia: 'Name the most common objection out loud before the client has to ask, and answer it with a fact, not a promise.',
      legenda: "I know sometimes what holds you back isn't willingness, it's doubt. Let me walk you through exactly how it works before you decide.",
    },
  },
  es: {
    'Atrair clientes': {
      diagnostico: 'Quien todavía no te conoce necesita ver prueba visual de tu trabajo antes de confiar en tu precio.',
      estrategia: 'Prioriza el antes/después y el detrás de cámaras. Eso reduce la objeción de "no conozco su trabajo" más rápido que cualquier discurso.',
      legenda: 'Esto no fue photoshop, fue técnica. Cada detalle del resultado empieza en una evaluación bien hecha antes del primer toque.',
    },
    'Preencher agenda': {
      diagnostico: 'Tienes horarios libres esta semana, y quienes ya te siguen solo necesitan un empujón con urgencia real.',
      estrategia: 'Comunica la escasez con honestidad: cantidad exacta de cupos y plazo, sin sonar como publicidad genérica.',
      legenda: 'Esta semana quedó más espacio del que esperaba en la agenda. Si estabas esperando el momento justo, puede ser ahora.',
    },
    'Reativar clientes': {
      diagnostico: 'Las clientas que ya confiaron en ti un día se olvidan de volver, no porque no les gustó, sino porque la rutina se traga el recuerdo.',
      estrategia: 'Háblale directamente a quien desapareció, reconociendo el tiempo que pasó y ofreciendo un motivo concreto para volver ahora.',
      legenda: 'Hace tiempo que no te vemos por aquí. Aparté un horario pensando en ti esta semana, ¿lo aprovechas?',
    },
    Autoridade: {
      diagnostico: 'Un precio alto sin contexto parece caro; un precio alto con proceso visible parece justo.',
      estrategia: 'Muestra el cuidado técnico detrás del resultado: lo que la clienta no ve en el espejo, pero paga por tener.',
      legenda: 'Lo que separa un resultado que dura de uno que se arruina en dos semanas no es suerte, es proceso. Déjame mostrarte el mío.',
    },
    'Quebra de objeção': {
      diagnostico: 'La mayoría de quienes no agendan no está en desacuerdo con el valor de tu trabajo, solo no resolvió una duda que aún tiene.',
      estrategia: 'Nombra la objeción más común en voz alta antes de que la clienta tenga que preguntar, y respóndela con un hecho, no una promesa.',
      legenda: 'Sé que a veces lo que frena no es la falta de ganas, es la duda. Te cuento exactamente cómo funciona antes de que decidas.',
    },
  },
};

const FORMATO_ROTEIRO: Record<Lang, Record<string, string>> = {
  pt: {
    Reel: 'Abra com o resultado pronto nos primeiros 2 segundos, corte para o processo em 3 a 4 cenas rápidas, feche com o rosto da cliente satisfeita e o CTA em texto na tela.',
    Story: 'Use uma sequência de 3 stories: enquete ou pergunta no primeiro, bastidor real no segundo, link ou botão de agendar no terceiro.',
    Carrossel: 'Capa com uma afirmação direta, 3 a 4 slides desenvolvendo o raciocínio com uma ideia por slide, último slide com o CTA isolado.',
    Post: 'Uma imagem forte do resultado como âncora visual, legenda carregando o raciocínio completo do gancho ao CTA.',
  },
  en: {
    Reel: "Open with the finished result in the first 2 seconds, cut to the process in 3 to 4 quick shots, close on the client's happy face with the CTA in on-screen text.",
    Story: 'Use a sequence of 3 stories: a poll or question in the first, real behind-the-scenes in the second, a booking link or button in the third.',
    Carrossel: 'Cover slide with a direct statement, 3 to 4 slides building the argument with one idea per slide, last slide with the CTA alone.',
    Post: 'A strong image of the result as the visual anchor, caption carrying the full argument from hook to CTA.',
  },
  es: {
    Reel: 'Abre con el resultado terminado en los primeros 2 segundos, corta al proceso en 3 a 4 escenas rápidas, cierra con el rostro satisfecho de la clienta y el CTA en texto en pantalla.',
    Story: 'Usa una secuencia de 3 historias: encuesta o pregunta en la primera, detrás de cámaras real en la segunda, enlace o botón de agendar en la tercera.',
    Carrossel: 'Portada con una afirmación directa, 3 a 4 slides desarrollando el razonamiento con una idea por slide, último slide con el CTA solo.',
    Post: 'Una imagen fuerte del resultado como ancla visual, con la leyenda llevando todo el razonamiento del gancho al CTA.',
  },
};

const INTENSIDADE_TOM: Record<Lang, Record<string, string>> = {
  pt: {
    Rápido: 'Tom direto e curto, priorizando a ação sobre a explicação.',
    Estratégico: 'Tom consultivo, explicando o porquê antes do quê e construindo confiança junto com o CTA.',
    Agressivo: 'Tom urgente e assertivo, deixando claro o custo de adiar a decisão sem ser agressivo com a pessoa.',
  },
  en: {
    Rápido: 'Direct and short tone, prioritizing action over explanation.',
    Estratégico: 'Consultive tone, explaining the why before the what and building trust alongside the CTA.',
    Agressivo: 'Urgent, assertive tone, making the cost of delaying the decision clear without being aggressive toward the person.',
  },
  es: {
    Rápido: 'Tono directo y corto, priorizando la acción sobre la explicación.',
    Estratégico: 'Tono consultivo, explicando el porqué antes del qué y generando confianza junto con el CTA.',
    Agressivo: 'Tono urgente y asertivo, dejando claro el costo de postergar la decisión sin ser agresivo con la persona.',
  },
};

const CTA: Record<Lang, { agressivo: string; default: string }> = {
  pt: {
    agressivo: 'Últimas vagas: responda essa mensagem agora para garantir o seu horário.',
    default: 'Toque no link da bio ou me chama no direct para escolher seu horário.',
  },
  en: {
    agressivo: 'Last spots: reply to this message now to lock in your time.',
    default: 'Tap the link in bio or DM me to pick your time.',
  },
  es: {
    agressivo: 'Últimos cupos: responde este mensaje ahora para asegurar tu horario.',
    default: 'Toca el enlace en la bio o escríbeme por DM para elegir tu horario.',
  },
};

export async function generateContent(lang: Lang, objetivo: string, formato: string, intensidade: string): Promise<ContentResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const angle = OBJETIVO_ANGLE[lang][objetivo] || OBJETIVO_ANGLE[lang]['Preencher agenda'];
  const roteiroBase = FORMATO_ROTEIRO[lang][formato] || FORMATO_ROTEIRO[lang].Post;
  const tom = INTENSIDADE_TOM[lang][intensidade] || INTENSIDADE_TOM[lang].Estratégico;
  const cta = intensidade === 'Agressivo' ? CTA[lang].agressivo : CTA[lang].default;

  return {
    diagnostico: angle.diagnostico,
    estrategia: `${angle.estrategia} ${tom}`,
    roteiro: `${formato}: ${roteiroBase}`,
    legenda: angle.legenda,
    cta,
  };
}
