// Backs the chat widget on the BelezaFlow Instagram-bio landing page (a
// standalone static HTML page, not part of this Vite app). That page
// previously called https://api.anthropic.com directly from browser-side
// JavaScript — which only works with an API key embedded in the page
// source, visible to anyone who opens dev tools or views the page's
// source. This function holds the real key server-side instead; the
// static page calls this endpoint with just the conversation and a
// language code.
//
// Anonymous, public endpoint (no Supabase session exists on a bio-link
// page) — rate-limited by IP since there's no user to key a limit by, same
// pattern as public-booking.
//
// Required secret: ANTHROPIC_API_KEY (Project Settings > Edge Functions >
// Secrets). SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided
// automatically by the Supabase runtime.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Access-Control-Allow-Origin defaults to '*' only when ALLOWED_ORIGINS isn't
// set, so this doesn't break the bio page before that secret exists — set
// ALLOWED_ORIGINS (comma-separated) once you know the bio page's real origin.
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeadersFor(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  const allowOrigin = ALLOWED_ORIGINS.length === 0 ? '*' : ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

const LANG_NAMES: Record<string, string> = {
  pt: 'português do Brasil',
  es: 'español',
  en: 'English',
};

function buildSystemPrompt(langName: string): string {
  return `Você é a assistente do Beleza Flow, respondendo dentro da página de bio no Instagram.
O Beleza Flow é uma plataforma para profissionais autônomas da beleza (nail designer, lash designer, brow artist, esteticista, cabeleireira, maquiadora) organizarem o negócio em um único lugar. Módulos: CRM de clientes e leads, agenda online e pessoal, financeiro, estoque inteligente (categorias e alertas personalizados por profissão), e uma máquina de conteúdo com IA que cria post, story, oferta e mensagem de venda prontos. Um assistente de IA cruza esses módulos e avisa proativamente sobre clientes a retomar, produtos a repor e conteúdo a criar.
Programa atual: Founding 20, seleção de 20 profissionais para testar 30 dias grátis, com acompanhamento, condição especial de Founding Member depois, e futura possibilidade de meses grátis por indicação (nunca chame isso de programa de afiliados ou de influenciadoras).
Responda sempre em ${langName}, de forma direta e calorosa, sem clichê de vendas, em até 3 frases curtas. Nunca invente preço final definitivo, se perguntarem sobre valor, diga que a condição especial de lançamento é revelada durante os Founding 20.
Se a pergunta não tiver nada a ver com o Beleza Flow, com o negócio da profissional de beleza, ou com os Founding 20 (por exemplo, assuntos completamente aleatórios), responda com bom humor que isso está fora do que você pode ajudar aqui, e traga a conversa de volta perguntando algo sobre o negócio da pessoa ou sobre o Beleza Flow.
Termine a maior parte das respostas com uma pergunta curta ou sugestão que ajude a pessoa a dar o próximo passo (por exemplo, perguntar sobre outra dor do negócio dela, ou convidar pra se candidatar aos Founding 20), mas sem forçar isso em toda mensagem seguida.`;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBody {
  messages: ChatMessage[];
  lang?: string;
}

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LEN = 2000;

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not configured');
    return new Response(JSON.stringify({ error: 'Chat is not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const ip = getClientIp(req);
  const { data: withinLimit, error: rateLimitError } = await supabaseAdmin.rpc('check_rate_limit', {
    p_key: `bio-chat:${ip}`,
    p_max_count: 20,
    p_window_seconds: 600,
  });
  if (rateLimitError) console.error('check_rate_limit failed', rateLimitError); // fail open
  if (!rateLimitError && withinLimit === false) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  let body: ChatBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    return new Response(JSON.stringify({ error: 'invalid_messages' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  for (const m of body.messages) {
    if ((m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || m.content.length === 0 || m.content.length > MAX_MESSAGE_LEN) {
      return new Response(JSON.stringify({ error: 'invalid_messages' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }

  const langName = LANG_NAMES[body.lang ?? 'pt'] ?? LANG_NAMES.pt;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 500,
        system: buildSystemPrompt(langName),
        messages: body.messages,
      }),
    });
    if (!res.ok) {
      console.error('Anthropic request failed', res.status, await res.text());
      return new Response(JSON.stringify({ error: 'upstream_error' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const data = await res.json();
    const textBlocks = (data.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text);
    const reply = textBlocks.join('\n').trim();
    return new Response(JSON.stringify({ reply }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
