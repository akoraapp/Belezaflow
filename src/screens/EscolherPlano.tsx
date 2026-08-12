import { useState } from 'react';
import { Check } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { Card, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { format } from '../lib/helpers';
import { FUNNEL_PRICING } from '../lib/funnelTheme';

type PlanId = 'monthly' | 'annual';

export function EscolherPlanoScreen({ initialPlan, onContinue, onSkip }: { initialPlan: PlanId; onContinue: (plan: PlanId) => void; onSkip: () => void }) {
  const { t, lang } = useLang();
  const l = t.landing;
  const pricing = FUNNEL_PRICING[lang];
  const [selected, setSelected] = useState<PlanId>(initialPlan);

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

      <PrimaryButton full onClick={() => onContinue(selected)} testId="choose-plan-continue">
        {t.choosePlan.continueCta}
      </PrimaryButton>
      <button
        onClick={onSkip}
        data-testid="choose-plan-skip"
        style={{ border: 'none', background: 'transparent', padding: '14px 0 0', fontFamily: 'Inter', fontSize: 12.5, color: T.muted, fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
      >
        {t.choosePlan.skipCta}
      </button>
    </div>
  );
}
