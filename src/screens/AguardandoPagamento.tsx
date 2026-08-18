import { useEffect, useState } from 'react';
import { T } from '../theme';
import { PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';

const RETRY_TIMEOUT_MS = 2 * 60 * 1000;

// Shown between "user finished checkout on Mercado Pago" and "our webhook
// flipped the subscription to active" — useSubscriptionGate polls in the
// background and this screen just unmounts itself once that lands. If the
// webhook never lands (payment abandoned, failed silently, etc.) a retry
// button appears after RETRY_TIMEOUT_MS so the user isn't stuck here forever.
export function AguardandoPagamentoScreen({ onRetry }: { onRetry: () => Promise<void> }) {
  const { t } = useLang();
  const [showRetry, setShowRetry] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowRetry(true), RETRY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    setError('');
    try {
      await onRetry();
      // On success the gate re-renders EscolherPlanoScreen instead of this
      // component, so no need to clear `retrying` here.
    } catch (err) {
      console.error(err);
      setError(t.choosePlan.errorGeneric);
      setRetrying(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 22px', textAlign: 'center', gap: 14 }}>
      <div style={{ width: 34, height: 34, border: `3px solid ${T.line}`, borderTopColor: T.gold, borderRadius: '50%', animation: 'bfSpin 0.8s linear infinite' }} />
      <style>{'@keyframes bfSpin { to { transform: rotate(360deg); } }'}</style>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 400, color: T.ink }}>{t.choosePlan.awaitingTitle}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted, lineHeight: 1.5, maxWidth: 320 }}>{t.choosePlan.awaitingSubtitle}</div>
      {showRetry && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 10, width: '100%', maxWidth: 260 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.choosePlan.retryHint}</div>
          {error && (
            <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.danger }} data-testid="awaiting-payment-error">
              {error}
            </div>
          )}
          <PrimaryButton full variant="secondary" onClick={handleRetry} disabled={retrying} testId="awaiting-payment-retry">
            {retrying ? '…' : t.choosePlan.retryCta}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
