import { useState } from 'react';
import { ChevronLeft, Heart, UserPlus, CalendarDays, Wallet, Package, Sparkles, PartyPopper, type LucideIcon } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { PrimaryButton } from './primitives';
import { useLang } from '../lib/LangContext';

const STEP_ICONS: LucideIcon[] = [Heart, UserPlus, CalendarDays, Wallet, Package, Sparkles, PartyPopper];

// Shown once per account, right after she first reaches the real dashboard —
// a quick lay-of-the-land before the in-depth Manual (Settings > Help) is
// ever needed. Dismissing or finishing both mark it seen for good.
export function FirstRunTour({ onGoToClients, onDismiss }: { onGoToClients: () => void; onDismiss: () => void }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const steps = t.tour.steps;
  const isLast = step === steps.length - 1;
  const Icon = STEP_ICONS[step] ?? Sparkles;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: T.bg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? T.gold : T.line }} />
          ))}
        </div>
        <button
          onClick={onDismiss}
          data-testid="tour-skip"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: T.muted, padding: '4px 2px' }}
        >
          {t.tour.skipCta}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 28px', textAlign: 'center' }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${T.goldLight}, ${T.goldDeep})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 26,
          }}
        >
          <Icon size={32} color="#fff" />
        </div>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 400, color: T.ink, lineHeight: 1.25, marginBottom: 12 }}>{steps[step].title}</div>
        <div style={{ fontFamily: 'Inter', fontSize: 14.5, color: T.muted, lineHeight: 1.55, maxWidth: 320 }}>{steps[step].desc}</div>
      </div>

      <div style={{ padding: 20, display: 'flex', gap: 10, borderTop: `1px solid ${T.line}` }}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{ padding: '14px 16px', borderRadius: RADIUS.control, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer' }}
          >
            <ChevronLeft size={18} color={T.ink} />
          </button>
        )}
        {isLast ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton full onClick={onGoToClients} testId="tour-finish-primary">
              {t.tour.finishPrimaryCta}
            </PrimaryButton>
            <PrimaryButton full variant="secondary" onClick={onDismiss} testId="tour-finish-secondary">
              {t.tour.finishSecondaryCta}
            </PrimaryButton>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <PrimaryButton full onClick={() => setStep((s) => s + 1)} testId="tour-next">
              {t.tour.nextCta}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
