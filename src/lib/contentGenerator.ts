import type { Lang } from '../types';

export interface ContentResult {
  diagnostico: string;
  estrategia: string;
  roteiro: string;
  legenda: string;
  cta: string;
}

type Angle = { diagnostico: string; estrategia: string; legenda: string };

// Each objetivo has several hand-written variations per language instead of
// a single fixed one. generateContent picks one at random on every call, so
// asking for "3 reels" with the same objetivo/formato/intensidade no longer
// returns three identical ideas — it returns three different angles on the
// same underlying strategy. This trades unlimited AI variety for zero
// ongoing cost and zero third-party dependency; see the product decision
// this replaced (static single-template generator) for context.
const OBJETIVO_ANGLES: Record<Lang, Record<string, Angle[]>> = {
  pt: {
    'Atrair clientes': [
      {
        diagnostico: 'Quem ainda não te conhece precisa ver prova visual do seu trabalho antes de confiar no seu preço.',
        estrategia: 'Priorize antes/depois e bastidores do atendimento. Isso reduz a objeção de "não conheço o trabalho dela" mais rápido do que qualquer discurso.',
        legenda: 'Isso aqui não foi photoshop, foi técnica. Cada detalhe do resultado começa numa avaliação bem feita antes do primeiro toque.',
      },
      {
        diagnostico: 'Gente nova só te encontra pelo que consegue ver em 3 segundos de rolagem — se não for claro o que você faz, ela passa direto.',
        estrategia: 'Abra com o resultado mais impressionante que você já entregou. Deixe o processo pra depois; a primeira impressão precisa ser visual e imediata.',
        legenda: 'Toda vez que alguém pergunta "isso é photoshop?", eu sei que fiz meu trabalho certo. Quer ver de perto como funciona?',
      },
      {
        diagnostico: 'A maior barreira de quem nunca agendou com você não é preço, é confiança em algo que ela nunca viu de perto.',
        estrategia: 'Mostre o rosto e a reação real da cliente no momento em que ela vê o resultado — isso vale mais do que qualquer legenda bem escrita.',
        legenda: 'Esse foi o momento em que ela viu o espelho pela primeira vez. Reações assim são o motivo de eu fazer o que faço.',
      },
    ],
    'Preencher agenda': [
      {
        diagnostico: 'Você tem horários vagos essa semana, e quem já te segue só precisa de um empurrão com urgência real.',
        estrategia: 'Comunique a escassez com honestidade: quantidade exata de vagas e prazo, sem soar como propaganda genérica.',
        legenda: 'Essa semana sobrou espaço na agenda que eu não esperava. Se você tava esperando o momento certo, pode ser agora.',
      },
      {
        diagnostico: 'Seguidores que já te acompanham há tempo às vezes só não agendam porque esquecem que hoje é um bom dia pra isso.',
        estrategia: 'Não venda a vaga, venda o motivo de hoje ser um bom dia: fim de semana chegando, evento, ou simplesmente "só porque".',
        legenda: 'Sextou e ainda tem espaço aqui pra quem quer chegar bem no fim de semana. Se joga.',
      },
      {
        diagnostico: 'Agenda com buraco no meio da semana é dinheiro parado, mas gritar "vagas disponíveis" sem contexto não convence ninguém.',
        estrategia: 'Conecte a vaga livre a um benefício concreto pra quem agendar rápido: menos espera, horário melhor, atenção mais tranquila.',
        legenda: 'Quinta livre por aqui — sem correria, sem fila, só eu e você com tempo de sobra pra fazer bonito.',
      },
    ],
    'Reativar clientes': [
      {
        diagnostico: 'Clientes que já confiaram em você um dia esquecem de voltar, não porque não gostaram, mas porque a rotina engole a lembrança.',
        estrategia: 'Fale diretamente com quem sumiu, reconhecendo o tempo que passou e oferecendo um motivo concreto para voltar agora.',
        legenda: 'Faz tempo que a gente não se vê por aqui. Separei um horário pensando em você essa semana, quer aproveitar?',
      },
      {
        diagnostico: 'Ninguém volta por causa de um post genérico de "sentimos sua falta" — isso soa como mensagem automática de loja.',
        estrategia: 'Lembre a cliente de um detalhe específico do último atendimento dela. Memória pessoal reconstrói vínculo mais rápido que desconto.',
        legenda: 'Ainda lembro do resultado que a gente conseguiu da última vez. Bora repetir (ou até melhorar)?',
      },
      {
        diagnostico: 'Clientes que sumiram geralmente não têm uma razão dramática — só deixaram de priorizar, e ninguém as trouxe de volta pra pauta.',
        estrategia: 'Reduza o atrito de voltar: ofereça remarcar direto pelo mesmo canal de sempre, sem burocracia nem sensação de "recomeçar do zero".',
        legenda: 'Sem cerimônia: se quiser voltar, me manda uma mensagem que eu já encaixo você. Nada mudou por aqui, só o tempo passou.',
      },
    ],
    Autoridade: [
      {
        diagnostico: 'Preço alto sem contexto parece caro; preço alto com processo visível parece justo.',
        estrategia: 'Mostre o cuidado técnico por trás do resultado: o que a cliente não vê no espelho, mas paga para ter.',
        legenda: 'O que separa um resultado que dura de um que estraga em duas semanas não é sorte, é processo. Deixa eu te mostrar o meu.',
      },
      {
        diagnostico: 'Quem compara só pelo preço nunca viu a diferença entre um serviço feito com técnica e um feito na pressa.',
        estrategia: 'Explique o "porquê" de uma escolha técnica específica sua — um produto, uma etapa, um cuidado extra que a maioria pula.',
        legenda: 'Esse passo aqui a maioria pula pra ganhar tempo. Eu não pulo, e é por isso que o resultado dura mais.',
      },
      {
        diagnostico: 'Autoridade não se constrói com uma frase de efeito, se constrói mostrando o raciocínio por trás de cada decisão técnica.',
        estrategia: 'Ensine algo real e específico sobre o seu ofício — um cuidado, um erro comum que você evita, um motivo técnico por trás de uma escolha.',
        legenda: 'Poucas pessoas sabem por que eu faço essa etapa antes de qualquer outra. Hoje eu conto.',
      },
    ],
    'Quebra de objeção': [
      {
        diagnostico: 'A maior parte de quem não agenda não discorda do valor do seu trabalho, só não decidiu resolver a dúvida que ainda tem.',
        estrategia: 'Nomeie a objeção mais comum em voz alta antes que a cliente precise perguntar, e responda com um fato, não uma promessa.',
        legenda: 'Sei que às vezes o que trava não é vontade, é dúvida. Te conto exatamente como funciona antes de você decidir.',
      },
      {
        diagnostico: 'Quem tem medo de se arrepender de um procedimento não quer ouvir "confia em mim", quer entender o processo antes de decidir.',
        estrategia: 'Responda a pergunta que ninguém faz em voz alta: "e se eu não gostar do resultado?" — com transparência sobre o que é ajustável e o que não é.',
        legenda: 'Sim, dá pra ajustar se algo não ficar do seu jeito. Vou te explicar exatamente o que é reversível e o que não é, antes de qualquer coisa.',
      },
      {
        diagnostico: 'A dúvida mais silenciosa nem sempre é sobre o resultado — muitas vezes é sobre se vai doer, quanto tempo leva, ou se vale a pena pro momento de vida da pessoa.',
        estrategia: 'Escolha UMA dúvida prática (dor, tempo, manutenção) e responda com detalhe real, não com uma frase vaga de tranquilização.',
        legenda: 'A pergunta que mais recebo no direct não é sobre preço. Hoje eu respondo ela de vez, sem rodeio.',
      },
    ],
  },
  en: {
    'Atrair clientes': [
      {
        diagnostico: "People who don't know you yet need visual proof of your work before they trust your price.",
        estrategia: "Prioritize before/after shots and behind-the-scenes footage. It kills the \"I don't know her work\" objection faster than any pitch.",
        legenda: "This wasn't Photoshop, it was technique. Every detail of the result starts with a proper assessment before the first touch.",
      },
      {
        diagnostico: "New people only find you through what they can process in 3 seconds of scrolling — if it's not instantly clear what you do, they scroll past.",
        estrategia: 'Open with the single most impressive result you have. Save the process for later; the first impression needs to be visual and immediate.',
        legenda: 'Every time someone asks "wait, is this Photoshop?" I know I did my job right. Want a closer look at how it happens?',
      },
      {
        diagnostico: "The biggest barrier for someone who's never booked with you isn't price, it's trust in something they've never seen up close.",
        estrategia: "Show the client's real face and reaction the moment she sees the result — that's worth more than any clever caption.",
        legenda: 'This was the exact moment she saw the mirror for the first time. Reactions like this are why I do this work.',
      },
    ],
    'Preencher agenda': [
      {
        diagnostico: 'You have open slots this week, and people who already follow you just need a real, honest push.',
        estrategia: 'Communicate scarcity honestly: exact number of slots and deadline, without sounding like generic advertising.',
        legenda: "I had more room open up this week than I expected. If you've been waiting for the right time, this might be it.",
      },
      {
        diagnostico: "Longtime followers sometimes just don't book because they forget today's actually a good day to.",
        estrategia: "Don't sell the slot, sell the reason today is a good day: a weekend coming up, an event, or simply \"just because.\"",
        legenda: "It's Friday and there's still room here for anyone who wants to look their best this weekend. Go for it.",
      },
      {
        diagnostico: "A gap in the middle of the week is money sitting idle, but shouting \"slots available\" with no context convinces no one.",
        estrategia: 'Tie the open slot to a concrete benefit for whoever books fast: less waiting, a better time slot, more relaxed attention.',
        legenda: "Thursday's wide open here — no rush, no line, just you and me with plenty of time to get it right.",
      },
    ],
    'Reativar clientes': [
      {
        diagnostico: "Clients who already trusted you once forget to come back, not because they didn't like it, but because routine swallows the memory.",
        estrategia: "Speak directly to the people who vanished, acknowledging the time that's passed and offering a concrete reason to come back now.",
        legenda: "It's been a while since we've seen you here. I saved a slot with you in mind this week, want to grab it?",
      },
      {
        diagnostico: 'Nobody comes back because of a generic "we miss you" post — it reads like an automated store message.',
        estrategia: 'Remind her of a specific detail from her last visit. A personal memory rebuilds the connection faster than any discount.',
        legenda: 'I still remember the result we got last time. Want to do it again (or even take it further)?',
      },
      {
        diagnostico: "Clients who disappear usually don't have a dramatic reason — they just stopped prioritizing it, and nobody brought it back to their attention.",
        estrategia: 'Lower the friction of coming back: offer to rebook through the same channel as always, with no red tape or "starting from scratch" feeling.',
        legenda: "No fuss: if you want to come back, just message me and I'll fit you in. Nothing's changed here, only time has passed.",
      },
    ],
    Autoridade: [
      {
        diagnostico: 'A high price with no context feels expensive; a high price with a visible process feels fair.',
        estrategia: "Show the technical care behind the result: what the client doesn't see in the mirror, but pays for.",
        legenda: "What separates a result that lasts from one that fades in two weeks isn't luck, it's process. Let me show you mine.",
      },
      {
        diagnostico: "Anyone comparing on price alone has never seen the difference between a service done with technique and one done in a rush.",
        estrategia: 'Explain the "why" behind one specific technical choice of yours — a product, a step, an extra care most people skip.',
        legenda: "Most people skip this exact step to save time. I don't, and that's exactly why the result lasts longer.",
      },
      {
        diagnostico: "Authority isn't built with a catchy line, it's built by showing the reasoning behind every technical decision.",
        estrategia: 'Teach something real and specific about your craft — a precaution, a common mistake you avoid, a technical reason behind a choice.',
        legenda: "Barely anyone knows why I do this step before anything else. Today I'm explaining it.",
      },
    ],
    'Quebra de objeção': [
      {
        diagnostico: "Most people who don't book don't disagree with your value, they just haven't resolved a doubt they still have.",
        estrategia: 'Name the most common objection out loud before the client has to ask, and answer it with a fact, not a promise.',
        legenda: "I know sometimes what holds you back isn't willingness, it's doubt. Let me walk you through exactly how it works before you decide.",
      },
      {
        diagnostico: 'Someone afraid of regretting a procedure doesn\'t want to hear "trust me" — they want to understand the process before deciding.',
        estrategia: 'Answer the question nobody asks out loud: "what if I don\'t like the result?" — with honesty about what\'s adjustable and what isn\'t.',
        legenda: "Yes, it can be adjusted if something isn't quite right. I'll walk you through exactly what's reversible before anything else.",
      },
      {
        diagnostico: "The quietest doubt isn't always about the result — often it's about pain, time, or whether it's worth it right now in someone's life.",
        estrategia: 'Pick ONE practical concern (pain, time, upkeep) and answer it with real detail, not a vague reassurance.',
        legenda: "The question I get most in DMs isn't about price. Today I'm finally answering it, no dancing around it.",
      },
    ],
  },
  es: {
    'Atrair clientes': [
      {
        diagnostico: 'Quien todavía no te conoce necesita ver prueba visual de tu trabajo antes de confiar en tu precio.',
        estrategia: 'Prioriza el antes/después y el detrás de cámaras. Eso reduce la objeción de "no conozco su trabajo" más rápido que cualquier discurso.',
        legenda: 'Esto no fue photoshop, fue técnica. Cada detalle del resultado empieza en una evaluación bien hecha antes del primer toque.',
      },
      {
        diagnostico: 'La gente nueva solo te encuentra por lo que puede ver en 3 segundos de scroll — si no queda claro qué haces, sigue de largo.',
        estrategia: 'Abre con el resultado más impresionante que hayas logrado. Deja el proceso para después; la primera impresión debe ser visual e inmediata.',
        legenda: 'Cada vez que alguien pregunta "¿esto es photoshop?", sé que hice bien mi trabajo. ¿Quieres ver de cerca cómo funciona?',
      },
      {
        diagnostico: 'La mayor barrera de quien nunca agendó contigo no es el precio, es la confianza en algo que nunca vio de cerca.',
        estrategia: 'Muestra el rostro y la reacción real de la clienta en el momento en que ve el resultado — eso vale más que cualquier leyenda bien escrita.',
        legenda: 'Este fue el momento en que ella vio el espejo por primera vez. Reacciones así son la razón por la que hago lo que hago.',
      },
    ],
    'Preencher agenda': [
      {
        diagnostico: 'Tienes horarios libres esta semana, y quienes ya te siguen solo necesitan un empujón con urgencia real.',
        estrategia: 'Comunica la escasez con honestidad: cantidad exacta de cupos y plazo, sin sonar como publicidad genérica.',
        legenda: 'Esta semana quedó más espacio del que esperaba en la agenda. Si estabas esperando el momento justo, puede ser ahora.',
      },
      {
        diagnostico: 'Quienes te siguen hace tiempo a veces no agendan solo porque olvidan que hoy es un buen día para hacerlo.',
        estrategia: 'No vendas el cupo, vende la razón por la que hoy es un buen día: fin de semana cerca, un evento, o simplemente "porque sí".',
        legenda: 'Es viernes y todavía hay espacio aquí para quien quiere llegar bien al fin de semana. Anímate.',
      },
      {
        diagnostico: 'Un hueco en medio de la semana es dinero parado, pero gritar "cupos disponibles" sin contexto no convence a nadie.',
        estrategia: 'Conecta el cupo libre con un beneficio concreto para quien agende rápido: menos espera, mejor horario, atención más tranquila.',
        legenda: 'Jueves libre por aquí — sin apuro, sin fila, solo tú y yo con tiempo de sobra para que quede perfecto.',
      },
    ],
    'Reativar clientes': [
      {
        diagnostico: 'Las clientas que ya confiaron en ti un día se olvidan de volver, no porque no les gustó, sino porque la rutina se traga el recuerdo.',
        estrategia: 'Háblale directamente a quien desapareció, reconociendo el tiempo que pasó y ofreciendo un motivo concreto para volver ahora.',
        legenda: 'Hace tiempo que no te vemos por aquí. Aparté un horario pensando en ti esta semana, ¿lo aprovechas?',
      },
      {
        diagnostico: 'Nadie vuelve por un post genérico de "te extrañamos" — suena a mensaje automático de tienda.',
        estrategia: 'Recuérdale un detalle específico de su última visita. Un recuerdo personal reconstruye el vínculo más rápido que un descuento.',
        legenda: 'Todavía recuerdo el resultado que logramos la última vez. ¿Repetimos (o lo llevamos aún más lejos)?',
      },
      {
        diagnostico: 'Las clientas que desaparecen normalmente no tienen una razón dramática — solo dejaron de priorizarlo, y nadie se lo volvió a poner en la mira.',
        estrategia: 'Reduce la fricción de volver: ofrece reagendar por el mismo canal de siempre, sin trámites ni sensación de "empezar de cero".',
        legenda: 'Sin protocolo: si quieres volver, mándame un mensaje y te acomodo. Nada cambió por aquí, solo pasó el tiempo.',
      },
    ],
    Autoridade: [
      {
        diagnostico: 'Un precio alto sin contexto parece caro; un precio alto con proceso visible parece justo.',
        estrategia: 'Muestra el cuidado técnico detrás del resultado: lo que la clienta no ve en el espejo, pero paga por tener.',
        legenda: 'Lo que separa un resultado que dura de uno que se arruina en dos semanas no es suerte, es proceso. Déjame mostrarte el mío.',
      },
      {
        diagnostico: 'Quien compara solo por precio nunca vio la diferencia entre un servicio hecho con técnica y uno hecho con prisa.',
        estrategia: 'Explica el "por qué" de una elección técnica específica tuya — un producto, un paso, un cuidado extra que la mayoría se salta.',
        legenda: 'Este paso la mayoría se lo salta para ganar tiempo. Yo no, y por eso el resultado dura más.',
      },
      {
        diagnostico: 'La autoridad no se construye con una frase efectista, se construye mostrando el razonamiento detrás de cada decisión técnica.',
        estrategia: 'Enseña algo real y específico de tu oficio — un cuidado, un error común que evitas, una razón técnica detrás de una elección.',
        legenda: 'Casi nadie sabe por qué hago este paso antes que cualquier otro. Hoy te lo cuento.',
      },
    ],
    'Quebra de objeção': [
      {
        diagnostico: 'La mayoría de quienes no agendan no está en desacuerdo con el valor de tu trabajo, solo no resolvió una duda que aún tiene.',
        estrategia: 'Nombra la objeción más común en voz alta antes de que la clienta tenga que preguntar, y respóndela con un hecho, no una promesa.',
        legenda: 'Sé que a veces lo que frena no es la falta de ganas, es la duda. Te cuento exactamente cómo funciona antes de que decidas.',
      },
      {
        diagnostico: 'Quien teme arrepentirse de un procedimiento no quiere oír "confía en mí", quiere entender el proceso antes de decidir.',
        estrategia: 'Responde la pregunta que nadie hace en voz alta: "¿y si no me gusta el resultado?" — con transparencia sobre qué es ajustable y qué no.',
        legenda: 'Sí, se puede ajustar si algo no queda a tu gusto. Te explico exactamente qué es reversible y qué no, antes de nada.',
      },
      {
        diagnostico: 'La duda más silenciosa no siempre es sobre el resultado — muchas veces es sobre si duele, cuánto tiempo toma, o si vale la pena en este momento de su vida.',
        estrategia: 'Elige UNA duda práctica (dolor, tiempo, mantenimiento) y respóndela con detalle real, no con una frase vaga de tranquilidad.',
        legenda: 'La pregunta que más recibo por DM no es sobre el precio. Hoy la respondo de una vez, sin rodeos.',
      },
    ],
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

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export async function generateContent(lang: Lang, objetivo: string, formato: string, intensidade: string): Promise<ContentResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const angles = OBJETIVO_ANGLES[lang][objetivo] || OBJETIVO_ANGLES[lang]['Preencher agenda'];
  const angle = pickRandom(angles);
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
