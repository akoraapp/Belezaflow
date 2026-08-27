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
      {
        diagnostico: 'Conteúdo genérico de beleza compete com o feed inteiro; conteúdo que fala com uma pessoa específica da sua região não compete com ninguém.',
        estrategia: 'Nomeie o bairro, a ocasião ou o tipo de pele/cabelo exato que você atende melhor. Quanto mais específico o recorte, mais a pessoa certa se sente "isso é pra mim".',
        legenda: 'Não é pra todo mundo. É pra quem mora aqui perto e já cansou de sair insatisfeita de salão genérico. Se é você, continua lendo.',
      },
      {
        diagnostico: 'Ninguém confia mais rápido em você do que em alguém que já é cliente — mas a maioria das profissionais nunca pede pra essa confiança circular.',
        estrategia: 'Peça abertamente pra clientes satisfeitas marcarem uma amiga nos comentários, e ofereça um motivo real pra fazer isso agora, não só um "compartilhe aí".',
        legenda: 'Se essa foto te lembrou de alguém que precisa se cuidar mais, marca ela aqui embaixo. Ela vai agradecer (e você também).',
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
      {
        diagnostico: 'Um cancelamento de última hora normalmente é tratado como perda — mas pra quem está de olho, é a vaga mais rápida de conseguir da semana.',
        estrategia: 'Anuncie a vaga que abriu por cancelamento como uma oportunidade exclusiva e com prazo curtíssimo, não como um post de rotina.',
        legenda: 'Acabou de abrir uma vaga de última hora por cancelamento. Quem responder primeiro leva — sem fila de espera dessa vez.',
      },
      {
        diagnostico: 'Muita gente não agenda por falta de vontade, agenda por falta de decisão — e decisão trava quando não tem uma data óbvia pra bater o olho.',
        estrategia: 'Sugira o próprio ritmo ideal de manutenção da cliente (ex: a cada X semanas) e conecte a vaga de hoje a esse ciclo, não a uma promoção qualquer.',
        legenda: 'Se sua última vez foi há um tempinho, hoje é um ótimo dia pra voltar ao seu ritmo. Ainda tenho horário livre.',
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
      {
        diagnostico: 'Boa parte de quem sumiu não decidiu parar — só perdeu a noção de quanto tempo passou desde o último cuidado.',
        estrategia: 'Calcule (mesmo que por estimativa) há quanto tempo a maioria das suas clientes inativas não vem, e use esse número como gatilho direto, não como culpa.',
        legenda: 'Faz uns bons meses que várias de vocês não passam por aqui. Sem cobrança, só um lembrete: seu horário de sempre ainda existe.',
      },
      {
        diagnostico: 'Desconto pra reativar cliente sumida ensina ela a esperar desconto pra sempre — o que traz de volta é atenção genuína, não preço baixo.',
        estrategia: 'Ofereça algo de valor que não seja dinheiro: prioridade de horário, um mimo no atendimento, uma conversa rápida sobre o que mudou desde a última vez.',
        legenda: 'Não vou te oferecer desconto pra voltar. Vou te oferecer o de sempre: atenção de verdade, no seu tempo. Bora marcar?',
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
      {
        diagnostico: 'Autoridade genérica ("sou apaixonada pelo que faço") não convence ninguém — número específico e resultado real convencem.',
        estrategia: 'Conte um caso real (sem expor a cliente) com um dado concreto: quanto tempo levou, quantas sessões, o que mudou de fato — números geram confiança que adjetivos não geram.',
        legenda: '3 sessões, 6 semanas, um resultado que a própria cliente não esperava. Autoridade não é discurso, é histórico.',
      },
      {
        diagnostico: 'Cliente não sabe diferenciar técnica boa de técnica ruim — mas sabe reconhecer quando alguém investe em aprender de verdade.',
        estrategia: 'Mostre bastidores de formação, curso ou estudo contínuo seu. Isso comunica seriedade profissional sem precisar dizer "eu sou boa no que faço".',
        legenda: 'Enquanto você dormia, eu tava estudando essa técnica de novo. Não é modéstia, é o motivo do resultado ficar cada vez melhor.',
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
      {
        diagnostico: 'Muita gente que hesita já teve uma experiência ruim em outro lugar — e a objeção real não é sobre você, é sobre um trauma anterior.',
        estrategia: 'Reconheça publicamente que experiências ruins existem no mercado, e mostre o que você faz diferente logo na avaliação inicial pra evitar o mesmo erro.',
        legenda: 'Se você já saiu de algum lugar arrependida, entendo a desconfiança. Por isso minha avaliação antes do procedimento não é rápida — é o contrário.',
      },
      {
        diagnostico: 'Quem compara 5 perfis diferentes antes de decidir não está indecisa sobre gostar do seu trabalho — está sobrecarregada de opções parecidas.',
        estrategia: 'Facilite a decisão dando um critério claro e simples pra escolher (não "eu sou a melhor", mas "é assim que você sabe se é a pessoa certa pra você").',
        legenda: 'Não preciso ser a única opção que você olhou. Preciso ser a que te deixa mais segura pra decidir. Aqui vai o que eu acho que você deveria perguntar antes de escolher.',
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
      {
        diagnostico: 'Generic beauty content competes with the entire feed; content that speaks to one specific person in your area competes with no one.',
        estrategia: "Name the neighborhood, the occasion, or the exact skin/hair type you serve best. The sharper the focus, the more the right person feels 'this is for me.'",
        legenda: "Not for everyone. For whoever's nearby and done leaving unsatisfied from a generic salon. If that's you, keep reading.",
      },
      {
        diagnostico: "Nobody builds trust in you faster than someone who's already a client — but most pros never actually ask that trust to spread.",
        estrategia: "Openly ask happy clients to tag a friend in the comments, and give them a real reason to do it now, not just a generic 'share this.'",
        legenda: "If this photo reminded you of someone who needs to treat themselves better, tag her below. She'll thank you (and so will I).",
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
      {
        diagnostico: "A last-minute cancellation usually gets treated as a loss — but for whoever's paying attention, it's the fastest open slot of the week.",
        estrategia: 'Announce the cancellation slot as an exclusive, very-short-window opportunity, not a routine post.',
        legenda: "A last-minute slot just opened from a cancellation. First to reply gets it — no waitlist this time.",
      },
      {
        diagnostico: "A lot of people don't book out of low motivation — they book out of no clear reason to decide today, and indecision stalls without an obvious date.",
        estrategia: "Suggest the client's own ideal maintenance rhythm (e.g. every X weeks) and tie today's slot to that cycle, not to a random promo.",
        legenda: "If it's been a while since your last visit, today's a great day to get back on your rhythm. I still have room.",
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
      {
        diagnostico: "Most people who disappeared didn't decide to stop — they just lost track of how much time has actually passed since their last visit.",
        estrategia: "Estimate how long most of your inactive clients have really been gone, and use that number as the direct trigger — not guilt.",
        legenda: "It's been a good while since several of you stopped by. No pressure, just a reminder: your usual spot is still here.",
      },
      {
        diagnostico: "A discount to win back a lost client teaches her to wait for discounts forever — what actually brings people back is genuine attention, not a lower price.",
        estrategia: "Offer something valuable that isn't money: priority scheduling, extra care during the appointment, a real check-in on what's changed since last time.",
        legenda: "I'm not going to offer you a discount to come back. I'll offer you the usual: real attention, on your time. Want to book?",
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
      {
        diagnostico: "Generic authority ('I'm passionate about what I do') convinces no one — a specific number and a real result do.",
        estrategia: 'Tell a real case (without exposing the client) with a concrete detail: how long it took, how many sessions, what actually changed — numbers build trust that adjectives don\'t.',
        legenda: "3 sessions, 6 weeks, a result the client herself didn't expect. Authority isn't a pitch, it's a track record.",
      },
      {
        diagnostico: "Clients can't tell good technique from bad technique — but they can tell when someone actually invests in real training.",
        estrategia: "Show behind-the-scenes of a course, certification, or ongoing study. That communicates professionalism without ever saying 'I'm good at what I do.'",
        legenda: "While you were asleep, I was studying this technique again. Not modesty — it's exactly why the results keep getting better.",
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
      {
        diagnostico: "A lot of people who hesitate already had a bad experience somewhere else — the real objection isn't about you, it's about an old scar.",
        estrategia: 'Publicly acknowledge that bad experiences exist in the market, and show what you do differently right from the initial consultation to avoid the same mistake.',
        legenda: "If you've walked away disappointed somewhere before, I get the hesitation. That's exactly why my consultation before any procedure isn't quick — it's the opposite.",
      },
      {
        diagnostico: "Someone comparing 5 different profiles before deciding isn't unsure if they like your work — they're overwhelmed by too many similar options.",
        estrategia: "Make the decision easier by giving a clear, simple criterion to choose by (not 'I'm the best,' but 'here's how you know if I'm the right fit for you').",
        legenda: "I don't need to be the only option you looked at. I need to be the one that makes you feel most confident deciding. Here's what I think you should ask before choosing.",
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
      {
        diagnostico: 'El contenido genérico de belleza compite con todo el feed; el contenido que le habla a una persona específica de tu zona no compite con nadie.',
        estrategia: 'Nombra el barrio, la ocasión o el tipo exacto de piel/cabello que mejor atiendes. Cuanto más específico el recorte, más la persona correcta siente que "esto es para mí".',
        legenda: 'No es para todo el mundo. Es para quien vive cerca y ya se cansó de salir insatisfecha de un salón genérico. Si eres tú, sigue leyendo.',
      },
      {
        diagnostico: 'Nadie confía más rápido en ti que alguien que ya es tu clienta — pero la mayoría de las profesionales nunca le pide a esa confianza que se propague.',
        estrategia: 'Pide abiertamente a tus clientas satisfechas que etiqueten a una amiga en los comentarios, y dales un motivo real para hacerlo ahora, no solo un "comparte esto".',
        legenda: 'Si esta foto te hizo pensar en alguien que necesita cuidarse más, etiquétala aquí abajo. Te lo va a agradecer (y yo también).',
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
      {
        diagnostico: 'Una cancelación de último momento normalmente se trata como una pérdida — pero para quien está atenta, es el cupo más rápido de conseguir en toda la semana.',
        estrategia: 'Anuncia el cupo que se liberó por cancelación como una oportunidad exclusiva y con un plazo muy corto, no como un post de rutina.',
        legenda: 'Se acaba de liberar un cupo de último momento por cancelación. Quien responda primero se lo lleva — esta vez sin lista de espera.',
      },
      {
        diagnostico: 'Mucha gente no agenda por falta de ganas — agenda por falta de una razón clara para decidir hoy, y la indecisión se frena sin una fecha obvia.',
        estrategia: 'Sugiere el ritmo ideal de mantenimiento de la clienta (por ejemplo, cada X semanas) y conecta el cupo de hoy con ese ciclo, no con una promoción cualquiera.',
        legenda: 'Si hace un tiempo que no vienes, hoy es un buen día para retomar tu ritmo. Todavía tengo horario libre.',
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
      {
        diagnostico: 'La mayoría de quienes desaparecieron no decidieron dejar de venir — solo perdieron la noción de cuánto tiempo pasó desde su última visita.',
        estrategia: 'Calcula (aunque sea aproximado) hace cuánto tiempo no viene la mayoría de tus clientas inactivas, y usa ese número como gatillo directo, sin culpa.',
        legenda: 'Ya hace varios meses que muchas de ustedes no pasan por aquí. Sin presión, solo un recordatorio: tu horario de siempre sigue existiendo.',
      },
      {
        diagnostico: 'Un descuento para reactivar a una clienta que desapareció le enseña a esperar descuentos para siempre — lo que realmente hace volver es atención genuina, no precio bajo.',
        estrategia: 'Ofrece algo de valor que no sea dinero: prioridad de horario, un detalle especial durante la cita, una charla real sobre qué cambió desde la última vez.',
        legenda: 'No te voy a ofrecer un descuento para volver. Te voy a ofrecer lo de siempre: atención de verdad, a tu tiempo. ¿Agendamos?',
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
      {
        diagnostico: 'La autoridad genérica ("me apasiona lo que hago") no convence a nadie — un número específico y un resultado real sí.',
        estrategia: 'Cuenta un caso real (sin exponer a la clienta) con un dato concreto: cuánto tiempo tomó, cuántas sesiones, qué cambió de verdad — los números generan confianza que los adjetivos no generan.',
        legenda: '3 sesiones, 6 semanas, un resultado que ni la propia clienta esperaba. La autoridad no es discurso, es historial.',
      },
      {
        diagnostico: 'La clienta no sabe distinguir una técnica buena de una mala — pero sí reconoce cuando alguien invierte de verdad en seguir aprendiendo.',
        estrategia: 'Muestra el detrás de cámaras de un curso, formación o estudio continuo tuyo. Eso comunica seriedad profesional sin tener que decir "soy buena en lo que hago".',
        legenda: 'Mientras tú dormías, yo estaba estudiando esta técnica otra vez. No es modestia, es la razón por la que el resultado sigue mejorando.',
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
      {
        diagnostico: 'Mucha gente que duda ya tuvo una mala experiencia en otro lugar — la objeción real no es sobre ti, es sobre una herida anterior.',
        estrategia: 'Reconoce públicamente que existen malas experiencias en el mercado, y muestra qué haces diferente desde la evaluación inicial para evitar el mismo error.',
        legenda: 'Si alguna vez saliste decepcionada de algún lugar, entiendo la desconfianza. Por eso mi evaluación antes del procedimiento no es rápida — todo lo contrario.',
      },
      {
        diagnostico: 'Quien compara 5 perfiles distintos antes de decidir no está indecisa sobre si le gusta tu trabajo — está saturada de opciones parecidas.',
        estrategia: 'Facilita la decisión dando un criterio claro y simple para elegir (no "soy la mejor", sino "así sabes si soy la persona correcta para ti").',
        legenda: 'No necesito ser la única opción que viste. Necesito ser la que te da más seguridad para decidir. Aquí va lo que creo que deberías preguntar antes de elegir.',
      },
    ],
  },
};

const FORMATO_ROTEIROS: Record<Lang, Record<string, string[]>> = {
  pt: {
    Reel: [
      'Abra com o resultado pronto nos primeiros 2 segundos, corte para o processo em 3 a 4 cenas rápidas, feche com o rosto da cliente satisfeita e o CTA em texto na tela.',
      'Comece com uma pergunta ou afirmação polêmica em texto na tela, mostre 2-3 provas rápidas que a sustentam, termine com o resultado final e o CTA falado.',
      'Grave em primeira pessoa explicando o "porquê" de uma decisão técnica enquanto trabalha, intercalando com cortes do processo, fechando com o resultado e o CTA em texto.',
    ],
    Story: [
      'Use uma sequência de 3 stories: enquete ou pergunta no primeiro, bastidor real no segundo, link ou botão de agendar no terceiro.',
      'Sequência de 3 stories: um "você sabia" ou fato curioso no primeiro, o processo em câmera rápida no segundo, contagem regressiva ou senso de urgência no terceiro com o link.',
      'Sequência de 3 stories: pergunta direta pro público no primeiro (caixinha de resposta), resultado chocante no segundo, botão de agendar em destaque no terceiro.',
    ],
    Carrossel: [
      'Capa com uma afirmação direta, 3 a 4 slides desenvolvendo o raciocínio com uma ideia por slide, último slide com o CTA isolado.',
      'Capa em formato de pergunta, cada slide seguinte responde uma parte da pergunta com uma imagem ou frase curta, último slide fecha com o CTA e o contato.',
      'Capa com um "antes" chamativo, slides do meio mostrando o processo passo a passo, penúltimo slide com o "depois", último slide só com o CTA.',
    ],
    Post: [
      'Uma imagem forte do resultado como âncora visual, legenda carregando o raciocínio completo do gancho ao CTA.',
      'Foto de bastidor (não do resultado final) como âncora, legenda contando a história por trás daquele atendimento até chegar no CTA.',
      'Imagem de comparação lado a lado como âncora visual, legenda curta e direta reforçando o ponto principal, fechando com o CTA.',
    ],
  },
  en: {
    Reel: [
      "Open with the finished result in the first 2 seconds, cut to the process in 3 to 4 quick shots, close on the client's happy face with the CTA in on-screen text.",
      'Start with a bold question or statement in on-screen text, show 2-3 quick proof points backing it up, end on the final result with a spoken CTA.',
      'Film in first person explaining the "why" behind one technical choice while you work, cutting between process shots, closing on the result with the CTA in text.',
    ],
    Story: [
      'Use a sequence of 3 stories: a poll or question in the first, real behind-the-scenes in the second, a booking link or button in the third.',
      'Sequence of 3 stories: a "did you know" fact in the first, fast-motion process footage in the second, a countdown or urgency cue in the third with the link.',
      'Sequence of 3 stories: a direct question to your audience in the first (reply sticker), a striking result reveal in the second, a prominent booking button in the third.',
    ],
    Carrossel: [
      'Cover slide with a direct statement, 3 to 4 slides building the argument with one idea per slide, last slide with the CTA alone.',
      'Cover slide phrased as a question, each following slide answers part of it with an image or short line, last slide closes with the CTA and contact info.',
      'Cover slide with an eye-catching "before," middle slides walking through the process step by step, second-to-last slide with the "after," last slide with only the CTA.',
    ],
    Post: [
      'A strong image of the result as the visual anchor, caption carrying the full argument from hook to CTA.',
      'A behind-the-scenes photo (not the final result) as the anchor, caption telling the story behind that appointment leading up to the CTA.',
      'A side-by-side comparison image as the visual anchor, short direct caption reinforcing the main point, closing with the CTA.',
    ],
  },
  es: {
    Reel: [
      'Abre con el resultado terminado en los primeros 2 segundos, corta al proceso en 3 a 4 escenas rápidas, cierra con el rostro satisfecho de la clienta y el CTA en texto en pantalla.',
      'Empieza con una pregunta o afirmación llamativa en texto en pantalla, muestra 2-3 pruebas rápidas que la respalden, termina con el resultado final y el CTA hablado.',
      'Grábate en primera persona explicando el "por qué" de una decisión técnica mientras trabajas, intercalando con cortes del proceso, cerrando con el resultado y el CTA en texto.',
    ],
    Story: [
      'Usa una secuencia de 3 historias: encuesta o pregunta en la primera, detrás de cámaras real en la segunda, enlace o botón de agendar en la tercera.',
      'Secuencia de 3 historias: un dato curioso en la primera, el proceso en cámara rápida en la segunda, cuenta regresiva o urgencia en la tercera con el enlace.',
      'Secuencia de 3 historias: pregunta directa al público en la primera (con caja de respuestas), resultado impactante en la segunda, botón de agendar destacado en la tercera.',
    ],
    Carrossel: [
      'Portada con una afirmación directa, 3 a 4 slides desarrollando el razonamiento con una idea por slide, último slide con el CTA solo.',
      'Portada en forma de pregunta, cada slide siguiente responde una parte con una imagen o frase corta, último slide cierra con el CTA y el contacto.',
      'Portada con un "antes" llamativo, slides del medio mostrando el proceso paso a paso, penúltimo slide con el "después", último slide solo con el CTA.',
    ],
    Post: [
      'Una imagen fuerte del resultado como ancla visual, con la leyenda llevando todo el razonamiento del gancho al CTA.',
      'Una foto de detrás de cámaras (no el resultado final) como ancla, leyenda contando la historia detrás de esa cita hasta llegar al CTA.',
      'Una imagen de comparación lado a lado como ancla visual, leyenda corta y directa reforzando el punto principal, cerrando con el CTA.',
    ],
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

// One extra sentence appended to "estrategia" when the person's profession/
// niche is known (from profiles.profession, free text — works for any niche
// they typed, no fixed list needed). Kept as a single appended clause rather
// than rewritten inline sentences, so all 45 hand-written angle variations
// stay untouched and easy to maintain.
const NICHE_CLAUSE: Record<Lang, (profissao: string) => string> = {
  pt: (profissao) => ` Lembre sempre que isso fala direto com quem busca ${profissao}.`,
  en: (profissao) => ` Keep in mind this speaks directly to people looking for ${profissao}.`,
  es: (profissao) => ` Recuerda que esto le habla directamente a quien busca ${profissao}.`,
};

export async function generateContent(lang: Lang, objetivo: string, formato: string, intensidade: string, profissao?: string): Promise<ContentResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const angles = OBJETIVO_ANGLES[lang][objetivo] || OBJETIVO_ANGLES[lang]['Preencher agenda'];
  const angle = pickRandom(angles);
  const roteiroOptions = FORMATO_ROTEIROS[lang][formato] || FORMATO_ROTEIROS[lang].Post;
  const roteiroBase = pickRandom(roteiroOptions);
  const tom = INTENSIDADE_TOM[lang][intensidade] || INTENSIDADE_TOM[lang].Estratégico;
  const cta = intensidade === 'Agressivo' ? CTA[lang].agressivo : CTA[lang].default;
  const nicheClause = profissao?.trim() ? NICHE_CLAUSE[lang](profissao.trim()) : '';

  return {
    diagnostico: angle.diagnostico,
    estrategia: `${angle.estrategia} ${tom}${nicheClause}`,
    roteiro: `${formato}: ${roteiroBase}`,
    legenda: angle.legenda,
    cta,
  };
}
