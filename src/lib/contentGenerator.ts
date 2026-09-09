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

// Each roteiro is a real, followable shot/slide breakdown — timing cues,
// what to film or write in each beat, and a practical tip — not a one-line
// abstract structure. Rendered with white-space: pre-line (see MiniSection
// in Maquina.tsx), so the \n line breaks below show up as an actual list.
const FORMATO_ROTEIROS: Record<Lang, Record<string, string[]>> = {
  pt: {
    Reel: [
      'Roteiro (15-30s):\n0-2s — Abra JÁ com o resultado pronto: cliente de costas olhando o espelho, corte seco pro rosto dela vendo pela primeira vez. Nada de "oi gente" ou introdução.\n3-9s — 3 a 4 cortes rápidos (1-2s cada) do processo: preparação, o momento técnico principal, o "antes" ficando pra trás.\n10-13s — Volte no rosto real da cliente vendo o resultado ao vivo. A reação genuína vale mais que qualquer efeito.\n14-15s — Texto fixo na tela com o CTA (ex: "Manda uma mensagem e garante o seu"), enquanto sua voz reforça o mesmo convite.\nÁudio: escolha um som em alta que combine com corte rápido — evite silêncio total nos primeiros segundos, é ali que a pessoa decide se continua assistindo.',
      'Roteiro (15-30s):\n0-3s — Texto grande na tela com a pergunta ou afirmação que gera identificação (ex: "Você já saiu insatisfeita de um salão genérico?"). Sem aparecer ainda, só o texto.\n4-10s — 2 a 3 provas rápidas que sustentam a afirmação: um detalhe do seu processo, um resultado anterior, uma etapa que você faz diferente.\n11-14s — Mostre o resultado final completo, em um único plano parado por 2-3 segundos (dá tempo da pessoa realmente ver).\n15s — CTA falado direto pra câmera, olhando no olho de quem assiste.\nDica: grave a pergunta do início por último — assim você já sabe exatamente qual prova visual vai encaixar melhor com o que disse.',
      'Roteiro (20-35s):\n0-2s — Você em primeira pessoa, já trabalhando, olhando pra câmera e falando o "porquê" da técnica que vai usar (ex: "Eu sempre faço isso antes, e é por isso que dura mais").\n3-15s — Continue narrando enquanto trabalha, intercalando com 2-3 cortes de close no processo — a narração é o fio condutor, as imagens são a prova.\n16-18s — Feche mostrando o resultado pronto, ainda falando, conectando de volta com o que disse no início.\n19s+ — CTA em texto na tela, sem precisar repetir falado (a atenção já foi conquistada pela narrativa).\nDica: grave o áudio primeiro (é a parte mais difícil de acertar) e depois filme as cenas do processo por cima, sincronizando na edição.',
    ],
    Story: [
      'Roteiro (sequência de 3 stories):\nStory 1 — Enquete ou pergunta simples relacionada ao serviço (ex: "Já pensou em fazer X?" com opções Sim/Não). O objetivo aqui é só gerar interação, não vender ainda.\nStory 2 — Bastidor real e cru do seu trabalho (não precisa ser produzido) — mostre você preparando algo ou no meio de um atendimento.\nStory 3 — Link ou botão de agendar em destaque, com uma frase curta de convite direto (ex: "Bora marcar o seu?"). Coloque o adesivo de link o mais visível possível.\nDica: responda quem interagir no Story 1 no direct — é ali que a conversa de venda realmente começa.',
      'Roteiro (sequência de 3 stories):\nStory 1 — "Você sabia?" com um fato curioso e curto sobre o seu serviço (algo que a maioria das clientes não sabe).\nStory 2 — O processo em câmera rápida (time-lapse ou vídeo acelerado) mostrando a etapa mais visual do atendimento.\nStory 3 — Contagem regressiva ou senso de urgência real (ex: "só 2 horários essa semana") junto com o link de agendamento.\nDica: use a caixinha de contagem regressiva do próprio Instagram no Story 3 — ela manda lembrete automático pra quem interagir.',
      'Roteiro (sequência de 3 stories):\nStory 1 — Pergunta direta pro público usando a caixinha de resposta (ex: "Qual é a sua maior dúvida sobre X?").\nStory 2 — Um resultado forte e recente, mostrado de forma direta, sem enrolação — foto ou vídeo curto.\nStory 3 — Botão de agendar em destaque, respondendo a pergunta feita no Story 1 como gancho (ex: "A resposta pra sua dúvida? Vem ver de perto.").\nDica: salve essa sequência nos destaques depois — ela continua trabalhando por você mesmo depois de 24h.',
    ],
    Carrossel: [
      'Roteiro (5 slides):\nSlide 1 (capa) — Frase direta e forte, grande, sem enrolação (ex: "3 sinais de que você precisa trocar de profissional").\nSlide 2 — Primeiro ponto do raciocínio, uma ideia só, frase curta + imagem de apoio.\nSlide 3 — Segundo ponto, seguindo a mesma lógica visual do slide 2.\nSlide 4 — Terceiro ponto, fechando o raciocínio completo.\nSlide 5 (fechamento) — Só o CTA, isolado, sem mais nenhuma informação nova — a pessoa já foi convencida, aqui é só a ação.\nDica: a legenda do post reforça o gancho do slide 1, não repete o conteúdo dos slides — ela é o convite pra deslizar.',
      'Roteiro (5-6 slides):\nSlide 1 (capa) — Pergunta direta que sua cliente ideal já se fez (ex: "Por que meu resultado não dura como o da minha amiga?").\nSlides 2 a 4 — Cada slide responde uma parte da pergunta com uma frase curta + imagem, sempre uma ideia por slide.\nSlide 5 — Resumo em uma frase de tudo que foi respondido.\nSlide 6 (fechamento) — CTA + seu contato/link, bem visível.\nDica: teste a pergunta da capa com uma cliente de verdade antes de postar — se ela reagir com "nossa, é verdade", o gancho está bom.',
      'Roteiro (5 slides):\nSlide 1 (capa) — "Antes" chamativo, sem filtro, real.\nSlides 2 a 3 — Processo passo a passo, uma etapa por slide, sempre com uma frase curta explicando o que está acontecendo.\nSlide 4 — "Depois", o contraste completo com o slide 1.\nSlide 5 (fechamento) — Só o CTA, nada mais.\nDica: coloque o "antes" e o "depois" com o mesmo enquadramento e iluminação — o contraste fica muito mais forte e honesto.',
    ],
    Post: [
      'Roteiro (1 imagem + legenda):\nImagem — Resultado final, bem iluminado, enquadramento limpo, sem distração no fundo.\nLegenda — Primeira linha é o gancho (repete ou reforça a ideia do diagnóstico acima), 2-3 linhas desenvolvendo o raciocínio, última linha é o CTA isolado, com espaço antes pra separar visualmente.\nDica: a primeira linha da legenda aparece antes do "ver mais" — é ela que decide se a pessoa vai ler o resto.',
      'Roteiro (1 imagem + legenda):\nImagem — Bastidor real do atendimento (não o resultado final) — mostra processo, não perfeição.\nLegenda — Conte a história daquele atendimento específico em 3-4 frases curtas, terminando no CTA.\nDica: use o nome do serviço ou uma palavra que sua cliente ideal buscaria no Instagram — ajuda o post a ser encontrado.',
      'Roteiro (1 imagem + legenda):\nImagem — Comparação lado a lado (antes/depois na mesma imagem, dividida ao meio).\nLegenda — Curta e direta: 1 frase reforçando o ponto principal, seguida do CTA. Sem enrolação aqui, a imagem já fala por si.\nDica: peça pra cliente autorizar o uso da imagem de comparação antes de postar — e reforce que o resultado varia por pessoa, se o seu nicho exigir esse cuidado.',
    ],
  },
  en: {
    Reel: [
      'Script (15-30s):\n0-2s — Open ALREADY on the finished result: client with her back to the mirror, hard cut to her face seeing it for the first time. No "hey guys" intro.\n3-9s — 3 to 4 quick cuts (1-2s each) of the process: prep, the main technical moment, the "before" fading behind you.\n10-13s — Cut back to the client\'s real face seeing the result live. A genuine reaction beats any effect.\n14-15s — On-screen text with the CTA (e.g. "Message me to lock in your spot"), while your voice repeats the same invite.\nAudio: pick a trending sound that matches the fast-cut pace — avoid dead silence in the first seconds, that\'s when people decide whether to keep watching.',
      'Script (15-30s):\n0-3s — Big on-screen text with the question or statement that creates recognition (e.g. "Ever left a generic salon disappointed?"). Don\'t appear yet, just the text.\n4-10s — 2 to 3 quick proof points backing it up: a detail of your process, a past result, a step you do differently.\n11-14s — Show the full final result in a single still shot held for 2-3 seconds (gives people time to actually see it).\n15s — CTA spoken straight to camera, looking the viewer in the eye.\nTip: film the opening question last — that way you already know which visual proof will best match what you said.',
      'Script (20-35s):\n0-2s — You in first person, already working, looking at the camera and explaining the "why" behind the technique you\'re about to use (e.g. "I always do this first, and that\'s why it lasts longer").\n3-15s — Keep narrating while you work, cutting between 2-3 close-up shots of the process — the narration is the thread, the footage is the proof.\n16-18s — Close by showing the finished result, still talking, tying back to what you said at the start.\n19s+ — CTA in on-screen text, no need to repeat it out loud (attention is already earned by the story).\nTip: record the audio first (that\'s the hardest part to get right), then film the process shots over it and sync in editing.',
    ],
    Story: [
      'Script (3-story sequence):\nStory 1 — A simple poll or question about the service (e.g. "Ever thought about trying X?" with Yes/No). The only goal here is interaction, not selling yet.\nStory 2 — Real, raw behind-the-scenes of your work (doesn\'t need to be polished) — you prepping something or mid-appointment.\nStory 3 — Booking link or button front and center, with a short direct invite (e.g. "Want to book yours?"). Make the link sticker as visible as possible.\nTip: DM anyone who interacts with Story 1 — that\'s where the real sales conversation starts.',
      'Script (3-story sequence):\nStory 1 — A "did you know" with a short curious fact about your service (something most clients don\'t know).\nStory 2 — The process in fast motion (time-lapse or sped-up video) showing the most visual step of the appointment.\nStory 3 — A countdown or real urgency cue (e.g. "only 2 slots left this week") together with the booking link.\nTip: use Instagram\'s own countdown sticker on Story 3 — it auto-reminds anyone who interacts with it.',
      'Script (3-story sequence):\nStory 1 — A direct question to your audience using the reply sticker (e.g. "What\'s your biggest doubt about X?").\nStory 2 — A strong, recent result shown directly, no filler — a short photo or video.\nStory 3 — A prominent booking button, answering the question from Story 1 as the hook (e.g. "The answer to your question? Come see it up close.").\nTip: save this sequence to your highlights afterward — it keeps working for you even after 24h.',
    ],
    Carrossel: [
      'Script (5 slides):\nSlide 1 (cover) — Direct, bold statement, large text, no filler (e.g. "3 signs it\'s time to switch professionals").\nSlide 2 — First point of the argument, one idea only, short line + supporting image.\nSlide 3 — Second point, following the same visual logic as slide 2.\nSlide 4 — Third point, closing the full argument.\nSlide 5 (closer) — Just the CTA, alone, no new information — she\'s already convinced, this is only the action.\nTip: the caption reinforces the slide 1 hook, it doesn\'t repeat the slide content — it\'s the invitation to swipe.',
      'Script (5-6 slides):\nSlide 1 (cover) — A direct question your ideal client has already asked herself (e.g. "Why doesn\'t my result last as long as my friend\'s?").\nSlides 2-4 — Each slide answers part of the question with a short line + image, always one idea per slide.\nSlide 5 — A one-line summary of everything just answered.\nSlide 6 (closer) — CTA + your contact/link, clearly visible.\nTip: test the cover question on a real client before posting — if she reacts with "wow, that\'s so true," the hook works.',
      'Script (5 slides):\nSlide 1 (cover) — An eye-catching, real, unfiltered "before."\nSlides 2-3 — Step-by-step process, one step per slide, always with a short line explaining what\'s happening.\nSlide 4 — The "after," the full contrast with slide 1.\nSlide 5 (closer) — Just the CTA, nothing else.\nTip: shoot the "before" and "after" with the same framing and lighting — the contrast reads much stronger and more honest.',
    ],
    Post: [
      'Script (1 image + caption):\nImage — Final result, well lit, clean framing, no background distraction.\nCaption — First line is the hook (repeats or reinforces the diagnóstico idea above), 2-3 lines developing the argument, last line is the CTA on its own, with a line break before it for visual separation.\nTip: the caption\'s first line shows before "see more" — it\'s what decides whether people read the rest.',
      'Script (1 image + caption):\nImage — Real behind-the-scenes of the appointment (not the final result) — shows process, not perfection.\nCaption — Tell the story of that specific appointment in 3-4 short sentences, ending on the CTA.\nTip: use the service name or a word your ideal client would actually search on Instagram — helps the post get found.',
      'Script (1 image + caption):\nImage — Side-by-side comparison (before/after in one image, split down the middle).\nCaption — Short and direct: one line reinforcing the main point, followed by the CTA. No filler here, the image already speaks for itself.\nTip: get the client\'s consent to use the comparison image before posting — and note that results vary person to person if your niche calls for that disclaimer.',
    ],
  },
  es: {
    Reel: [
      'Guion (15-30s):\n0-2s — Abre YA con el resultado terminado: clienta de espaldas mirando el espejo, corte seco a su rostro viéndolo por primera vez. Nada de "hola a todos" ni introducción.\n3-9s — 3 a 4 cortes rápidos (1-2s cada uno) del proceso: preparación, el momento técnico principal, el "antes" quedando atrás.\n10-13s — Vuelve al rostro real de la clienta viendo el resultado en vivo. La reacción genuina vale más que cualquier efecto.\n14-15s — Texto fijo en pantalla con el CTA (ej: "Escríbeme y asegura tu horario"), mientras tu voz refuerza la misma invitación.\nAudio: elige un sonido en tendencia que combine con el ritmo de corte rápido — evita el silencio total en los primeros segundos, ahí es cuando la persona decide si sigue viendo.',
      'Guion (15-30s):\n0-3s — Texto grande en pantalla con la pregunta o afirmación que genera identificación (ej: "¿Alguna vez saliste insatisfecha de un salón genérico?"). Aún sin aparecer, solo el texto.\n4-10s — 2 a 3 pruebas rápidas que la respaldan: un detalle de tu proceso, un resultado anterior, un paso que haces distinto.\n11-14s — Muestra el resultado final completo en un solo plano fijo de 2-3 segundos (da tiempo de verlo de verdad).\n15s — CTA hablado directo a cámara, mirando a los ojos de quien te ve.\nTip: graba la pregunta inicial al final — así ya sabes exactamente qué prueba visual encaja mejor con lo que dijiste.',
      'Guion (20-35s):\n0-2s — Tú en primera persona, ya trabajando, mirando a cámara y explicando el "por qué" de la técnica que vas a usar (ej: "Siempre hago esto primero, y por eso dura más").\n3-15s — Sigue narrando mientras trabajas, intercalando con 2-3 cortes de primer plano del proceso — la narración es el hilo conductor, las imágenes son la prueba.\n16-18s — Cierra mostrando el resultado terminado, todavía hablando, conectando de nuevo con lo que dijiste al inicio.\n19s+ — CTA en texto en pantalla, sin necesidad de repetirlo hablado (la atención ya está ganada por la narrativa).\nTip: graba el audio primero (es la parte más difícil de acertar) y luego filma las escenas del proceso encima, sincronizando en la edición.',
    ],
    Story: [
      'Guion (secuencia de 3 historias):\nHistoria 1 — Encuesta o pregunta simple relacionada con el servicio (ej: "¿Ya pensaste en hacerte X?" con opciones Sí/No). El único objetivo aquí es generar interacción, todavía no vender.\nHistoria 2 — Detrás de cámaras real y crudo de tu trabajo (no hace falta que esté producido) — muéstrate preparando algo o en medio de una cita.\nHistoria 3 — Enlace o botón de agendar bien visible, con una frase corta de invitación directa (ej: "¿Agendamos el tuyo?"). Pon el sticker de enlace lo más visible posible.\nTip: respóndele por DM a quien interactúe en la Historia 1 — ahí es donde realmente empieza la conversación de venta.',
      'Guion (secuencia de 3 historias):\nHistoria 1 — "¿Sabías que...?" con un dato curioso y corto sobre tu servicio (algo que la mayoría de tus clientas no sabe).\nHistoria 2 — El proceso en cámara rápida (time-lapse o video acelerado) mostrando el paso más visual de la cita.\nHistoria 3 — Cuenta regresiva o urgencia real (ej: "solo 2 horarios esta semana") junto con el enlace de agendar.\nTip: usa el sticker de cuenta regresiva de Instagram en la Historia 3 — envía recordatorio automático a quien interactúe.',
      'Guion (secuencia de 3 historias):\nHistoria 1 — Pregunta directa al público con el sticker de respuesta (ej: "¿Cuál es tu mayor duda sobre X?").\nHistoria 2 — Un resultado fuerte y reciente, mostrado directo, sin rodeos — foto o video corto.\nHistoria 3 — Botón de agendar destacado, respondiendo la pregunta de la Historia 1 como gancho (ej: "¿La respuesta a tu duda? Ven a verla de cerca.").\nTip: guarda esta secuencia en destacados después — sigue trabajando para ti incluso después de 24h.',
    ],
    Carrossel: [
      'Guion (5 slides):\nSlide 1 (portada) — Frase directa y fuerte, en grande, sin rodeos (ej: "3 señales de que necesitas cambiar de profesional").\nSlide 2 — Primer punto del razonamiento, una sola idea, frase corta + imagen de apoyo.\nSlide 3 — Segundo punto, siguiendo la misma lógica visual del slide 2.\nSlide 4 — Tercer punto, cerrando el razonamiento completo.\nSlide 5 (cierre) — Solo el CTA, aislado, sin información nueva — la persona ya está convencida, aquí solo va la acción.\nTip: la leyenda del post refuerza el gancho del slide 1, no repite el contenido de los slides — es la invitación a deslizar.',
      'Guion (5-6 slides):\nSlide 1 (portada) — Pregunta directa que tu clienta ideal ya se hizo (ej: "¿Por qué mi resultado no dura tanto como el de mi amiga?").\nSlides 2 a 4 — Cada slide responde una parte de la pregunta con una frase corta + imagen, siempre una idea por slide.\nSlide 5 — Resumen en una frase de todo lo respondido.\nSlide 6 (cierre) — CTA + tu contacto/enlace, bien visible.\nTip: prueba la pregunta de portada con una clienta real antes de publicar — si reacciona con "uy, es verdad", el gancho funciona.',
      'Guion (5 slides):\nSlide 1 (portada) — "Antes" llamativo, sin filtro, real.\nSlides 2 a 3 — Proceso paso a paso, una etapa por slide, siempre con una frase corta explicando qué está pasando.\nSlide 4 — "Después", el contraste completo con el slide 1.\nSlide 5 (cierre) — Solo el CTA, nada más.\nTip: fotografía el "antes" y el "después" con el mismo encuadre e iluminación — el contraste se ve mucho más fuerte y honesto.',
    ],
    Post: [
      'Guion (1 imagen + leyenda):\nImagen — Resultado final, bien iluminado, encuadre limpio, sin distracciones de fondo.\nLeyenda — La primera línea es el gancho (repite o refuerza la idea del diagnóstico de arriba), 2-3 líneas desarrollando el razonamiento, última línea es el CTA solo, con un espacio antes para separarlo visualmente.\nTip: la primera línea de la leyenda aparece antes del "ver más" — es la que decide si la persona lee el resto.',
      'Guion (1 imagen + leyenda):\nImagen — Detrás de cámaras real de la cita (no el resultado final) — muestra proceso, no perfección.\nLeyenda — Cuenta la historia de esa cita específica en 3-4 frases cortas, terminando en el CTA.\nTip: usa el nombre del servicio o una palabra que tu clienta ideal buscaría en Instagram — ayuda a que el post se encuentre.',
      'Guion (1 imagen + leyenda):\nImagen — Comparación lado a lado (antes/después en la misma imagen, dividida por la mitad).\nLeyenda — Corta y directa: 1 frase reforzando el punto principal, seguida del CTA. Sin rodeos aquí, la imagen ya habla por sí sola.\nTip: pide autorización a la clienta para usar la imagen de comparación antes de publicar — y aclara que el resultado varía según la persona, si tu rubro requiere esa advertencia.',
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
