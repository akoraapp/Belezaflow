import { T } from '../theme';
import { useLang } from '../lib/LangContext';

// Shown between "user finished checkout on Mercado Pago" and "our webhook
// flipped the subscription to active" — useSubscriptionGate polls in the
// background and this screen just unmounts itself once that lands.
export function AguardandoPagamentoScreen() {
  const { t } = useLang();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 22px', textAlign: 'center', gap: 14 }}>
      <div style={{ width: 34, height: 34, border: `3px solid ${T.line}`, borderTopColor: T.gold, borderRadius: '50%', animation: 'bfSpin 0.8s linear infinite' }} />
      <style>{'@keyframes bfSpin { to { transform: rotate(360deg); } }'}</style>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 400, color: T.ink }}>{t.choosePlan.awaitingTitle}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted, lineHeight: 1.5, maxWidth: 320 }}>{t.choosePlan.awaitingSubtitle}</div>
    </div>
  );
}
