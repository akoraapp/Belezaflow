// Sends the one-time "you're in!" email once a subscription actually goes
// active (a real payment landed) — not at signup/trial start. Delivers two
// things: a reminder that her app access is ready, and the link to the
// Kiwify members area where the training videos live (a separate product
// from the app itself, so this is the only place that connects the two).
//
// Called server-to-server from mercadopago-webhook and stripe-webhook right
// after they flip a subscription's status to 'active' — never from the
// frontend. Idempotent via subscriptions.welcome_email_sent_at: safe to call
// on every webhook delivery, including retries, without ever double-sending.
//
// Required secrets (Project Settings > Edge Functions > Secrets):
//   RESEND_API_KEY   — from resend.com, after verifying the sending domain.
//   KIWIFY_MEMBERS_URL — the Kiwify members-area login link (same for every
//                        buyer; they sign in there with the email they
//                        bought with).
// Optional: WELCOME_EMAIL_FROM (defaults below), APP_URL (defaults below).
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const KIWIFY_MEMBERS_URL = Deno.env.get('KIWIFY_MEMBERS_URL') ?? '';
const WELCOME_EMAIL_FROM = Deno.env.get('WELCOME_EMAIL_FROM') ?? 'BelezaFlow <contato@belezaflow.app>';
const APP_URL = Deno.env.get('APP_URL') ?? 'https://belezaflow.app';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function buildEmailHtml(name: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
    <h1 style="font-size: 22px;">Bem-vinda ao BelezaFlow, ${name}! 🎉</h1>
    <p style="font-size: 15px; line-height: 1.6;">Seu acesso já está liberado. Para entrar no app, é só usar o e-mail e a senha que você cadastrou:</p>
    <p style="margin: 24px 0;">
      <a href="${APP_URL}/app" style="background: #C8A96A; color: #1a1a1a; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold; display: inline-block;">Acessar o BelezaFlow</a>
    </p>
    ${
      KIWIFY_MEMBERS_URL
        ? `<p style="font-size: 15px; line-height: 1.6;">E antes de começar, dá uma passada no treinamento completo — está tudo esperando por você na área de membros:</p>
    <p style="margin: 24px 0;">
      <a href="${KIWIFY_MEMBERS_URL}" style="background: #1a1a1a; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold; display: inline-block;">Assistir ao treinamento</a>
    </p>
    <p style="font-size: 13px; color: #666;">Use o mesmo e-mail da compra para entrar na área de membros.</p>`
        : ''
    }
    <p style="font-size: 14px; color: #666; margin-top: 32px;">Qualquer dúvida, é só responder este e-mail.</p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let userId: string | undefined;
  try {
    ({ userId } = await req.json());
  } catch {
    // no-op — handled by the missing-userId check below.
  }
  if (!userId) return new Response(JSON.stringify({ error: 'missing userId' }), { status: 400 });

  try {
    const { data: sub, error: subError } = await supabaseAdmin.from('subscriptions').select('welcome_email_sent_at').eq('user_id', userId).maybeSingle();
    if (subError) throw subError;
    if (sub?.welcome_email_sent_at) return new Response(JSON.stringify({ skipped: 'already_sent' }), { status: 200 });

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured — welcome email not sent');
      return new Response(JSON.stringify({ skipped: 'not_configured' }), { status: 200 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError) throw userError;
    const email = userData.user?.email;
    if (!email) throw new Error(`user ${userId} has no email`);

    const { data: profile } = await supabaseAdmin.from('profiles').select('name').eq('id', userId).maybeSingle();
    const name = (profile?.name as string) || '';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: WELCOME_EMAIL_FROM,
        to: email,
        subject: 'Seu acesso ao BelezaFlow + treinamento 🎉',
        html: buildEmailHtml(name),
      }),
    });
    if (!res.ok) {
      console.error('Resend send failed', res.status, await res.text());
      return new Response(JSON.stringify({ error: 'send_failed' }), { status: 200 });
    }

    await supabaseAdmin.from('subscriptions').update({ welcome_email_sent_at: new Date().toISOString() }).eq('user_id', userId);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('send-welcome-email failed', userId, err);
    // Never a 4xx/5xx for a failure here — this is a non-critical side
    // effect of a payment webhook, and both providers retry undelivered
    // webhooks on non-2xx responses. A broken email send must not risk the
    // subscription-activation webhook itself being retried/duplicated.
    return new Response(JSON.stringify({ error: String(err) }), { status: 200 });
  }
});
