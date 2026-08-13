import { useState } from 'react';
import { Check } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { Card, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { format } from '../lib/helpers';
import { FUNNEL_PRICING } from '../lib/funnelTheme';

type PlanId = 'monthly' | 'annual';

export function EscolherPlanoScreen({
  initialPlan,
  onContinue,
  onSkip,
}: {
  initialPlan: PlanId;
  onContinue: (plan: PlanId) => Promise<void>;
  // Absent entirely when this screen was reached via a direct-purchase ?plan=
  // link from the landing page — there is no skipping a purchase already in
  // progress. Only a future "still inside the free trial" entry point would
  // pass a real onSkip.
  onSkip?: (() => void) | null;
}) {
  const { t, lang } = useLang();
  const l = t.landing;
  const pricing = FUNNEL_PRICING[lang];
  const [selected, setSelected] = useState<PlanId>(initialPlan);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onContinue(selected);
      // On success the caller redirects the browser to Mercado Pago, so this
      // component is about to unmount — no need to clear `submitting`.
    } catch (err) {
      console.error(err);
      setError(t.choosePlan.errorGeneric);
      setSubmitting(false);
    }
  };

  const annualSavings = Math.max(0, pricing.monthlyPrice * 12 - pricing.annualTotalPrice);
  const savingsText = format(l.savingsTemplate, { symbol: pricing.currencySymbol, n: annualSavings });

  const plans: { id: PlanId; label: string; price: number; suffix: string; note?: string }[] = [
    { id: 'monthly', label: l.monthlyLabel, price: pricing.monthlyPrice, suffix: l.perMonthLabel },
    { id: 'annual', label: l.annualLabel, price: pricing.annualTotalPrice, suffix: l.perYearLabel, note: savingsText },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '32px 22px 28px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 400, color: T.ink, marginBottom: 8 }}>{t.choosePlan.title}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted, marginBottom: 26, lineHeight: 1.5 }}>{t.choosePlan.subtitle}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {plans.map((plan) => {
          const active = selected === plan.id;
          return (
            <Card
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              testId={`choose-plan-${plan.id}`}
              style={{ border: `2px solid ${active ? T.gold : T.line}`, cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12.5, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>{plan.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700, color: T.ink }}>
                      {pricing.currencySymbol} {plan.price}
                    </span>
                    <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted }}>{plan.suffix}</span>
                  </div>
                  {plan.note && <div style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: T.goldDeep, marginTop: 6 }}>{plan.note}</div>}
                </div>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    minWidth: 26,
                    borderRadius: RADIUS.pill,
                    background: active ? T.gold : T.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {active && <Check size={15} color={T.ink} strokeWidth={3} />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {error && (
        <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.danger, marginBottom: 10, textAlign: 'center' }} data-testid="choose-plan-error">
          {error}
        </div>
      )}

      <PrimaryButton full onClick={handleContinue} disabled={submitting} testId="choose-plan-continue">
        {submitting ? '…' : t.choosePlan.continueCta}
      </PrimaryButton>
      {onSkip && (
        <button
          onClick={onSkip}
          disabled={submitting}
          data-testid="choose-plan-skip"
          style={{ border: 'none', background: 'transparent', padding: '14px 0 0', fontFamily: 'Inter', fontSize: 12.5, color: T.muted, fontWeight: 600, cursor: submitting ? 'default' : 'pointer', textAlign: 'center' }}
        >
          {t.choosePlan.skipCta}
        </button>
      )}
    </div>
  );
}
