import { Link } from 'react-router-dom';
import { T, FONT_IMPORT } from '../theme';
import wordmark from '../assets/belezaflow-wordmark.png';

const SUPPORT_EMAIL = 'belezaflowapp@gmail.com';
const LAST_UPDATED = '17 de setembro de 2026';

// Legal content is deliberately kept in a single language (Portuguese) —
// BelezaFlow is a Brazilian business and this document is written to satisfy
// the LGPD (Lei Geral de Proteção de Dados, Lei 13.709/2018), which is what
// actually governs how this app handles personal data, regardless of which
// language a given user reads the app's UI in.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.muted, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: 'Inter' }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 80px' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 28 }}>
          <img src={wordmark} alt="BelezaFlow" style={{ height: 20, width: 'auto', display: 'block' }} />
        </Link>

        <div style={{ fontFamily: 'Playfair Display', fontSize: 27, fontWeight: 500, color: T.ink, marginBottom: 6 }}>Política de Privacidade</div>
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 30 }}>Última atualização: {LAST_UPDATED}</div>

        <Section title="1. Quem somos">
          O BelezaFlow é um aplicativo de gestão para profissionais de beleza (agenda, clientes, financeiro e conteúdo), operado como um negócio brasileiro. Para
          qualquer assunto relacionado a esta política ou aos seus dados, fale com a gente em{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: T.goldDeep, fontWeight: 700 }}>
            {SUPPORT_EMAIL}
          </a>
          .
        </Section>

        <Section title="2. Quais dados coletamos">
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <li>Dados de cadastro: e-mail e senha (armazenada de forma criptografada, nunca em texto puro).</li>
            <li>Dados profissionais: nome, nome público, profissão, foto/logo, Instagram, WhatsApp, endereço e link de mapa.</li>
            <li>Dados que você cadastra sobre seus próprios clientes: nome, telefone, aniversário, serviço de interesse, origem e status.</li>
            <li>Dados de agenda e atendimentos: horários, serviços, valores e status de cada agendamento.</li>
            <li>Dados financeiros que você registra no app: contas a pagar/receber e metas.</li>
            <li>Dados de pagamento da sua assinatura: processados diretamente por Mercado Pago ou Stripe — nunca armazenamos número de cartão no BelezaFlow.</li>
            <li>Dados técnicos: idioma, moeda, fuso horário, e permissão de notificações do seu dispositivo.</li>
          </ul>
        </Section>

        <Section title="3. Para que usamos esses dados">
          Usamos os dados acima para: operar as funcionalidades do app (agenda, clientes, financeiro, estoque, conteúdo e diagnóstico do seu negócio); processar
          pagamentos e gerenciar sua assinatura; enviar e-mails transacionais (ex: confirmação de acesso após o pagamento); e proteger a plataforma contra abuso,
          através de limites de requisições e registro de atividades relevantes da conta. Mensagens de confirmação/lembrete para os seus clientes (WhatsApp ou SMS)
          são abertas sob sua ação direta — o BelezaFlow não envia mensagens automaticamente para os seus clientes sem que você aperte o botão de enviar.
        </Section>

        <Section title="4. Com quem compartilhamos dados">
          Não vendemos seus dados a terceiros para fins de publicidade. Compartilhamos dados apenas com prestadores de serviço estritamente necessários para o
          funcionamento do app, atuando como operadores em nosso nome:
          <ul style={{ paddingLeft: 18, margin: '8px 0 0' }}>
            <li>
              <strong>Supabase</strong> — hospedagem, banco de dados e autenticação.
            </li>
            <li>
              <strong>Mercado Pago</strong> e <strong>Stripe</strong> — processamento de pagamentos da sua assinatura.
            </li>
            <li>
              <strong>Kiwify</strong> — gestão de cobrança e acesso, quando a assinatura é feita por essa plataforma.
            </li>
            <li>
              <strong>Resend</strong> — envio de e-mails transacionais (ex: confirmação de acesso).
            </li>
          </ul>
        </Section>

        <Section title="5. Dados dos seus clientes">
          Ao cadastrar clientes/leads no BelezaFlow, você (a profissional) é a controladora desses dados perante seus próprios clientes, e o BelezaFlow atua como
          operador, tratando essas informações apenas para viabilizar as funcionalidades do app a seu pedido. É sua responsabilidade ter uma base legal (como o
          consentimento) para registrar os dados de contato dos seus clientes.
        </Section>

        <Section title="6. Por quanto tempo guardamos seus dados">
          Mantemos seus dados enquanto sua conta estiver ativa. Se você solicitar o cancelamento da conta, seus dados são removidos ou anonimizados em prazo
          razoável, exceto informações que a legislação exija manter por mais tempo (por exemplo, registros fiscais de pagamentos).
        </Section>

        <Section title="7. Segurança">
          Adotamos medidas técnicas para proteger seus dados: conexões criptografadas (HTTPS), controle de acesso por linha no banco de dados (cada profissional só
          acessa os próprios registros), limitação de taxa de requisições contra abuso, e registro de eventos sensíveis da conta.
        </Section>

        <Section title="8. Seus direitos (LGPD)">
          Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar, a qualquer momento: confirmação da existência de tratamento,
          acesso aos seus dados, correção de dados incompletos ou desatualizados, anonimização/bloqueio/eliminação de dados desnecessários, portabilidade,
          informação sobre com quem compartilhamos seus dados, e revogação do consentimento (incluindo exclusão da sua conta). Para exercer qualquer um desses
          direitos, escreva para{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: T.goldDeep, fontWeight: 700 }}>
            {SUPPORT_EMAIL}
          </a>
          .
        </Section>

        <Section title="9. Cookies e armazenamento local">
          O BelezaFlow não usa cookies de publicidade ou rastreamento de terceiros. Usamos apenas armazenamento técnico necessário ao funcionamento do app: sua
          sessão de autenticação e o cache do aplicativo instalável (PWA), para que ele continue funcionando mesmo com conexão instável.
        </Section>

        <Section title="10. Menores de idade">O BelezaFlow não é destinado a menores de 18 anos.</Section>

        <Section title="11. Alterações nesta política">
          Podemos atualizar esta política eventualmente. A data no topo desta página sempre indica a versão mais recente.
        </Section>
      </div>
    </div>
  );
}
