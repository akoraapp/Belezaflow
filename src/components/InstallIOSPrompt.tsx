import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { T, SHADOW } from '../theme';
import { useLang } from '../lib/LangContext';

const DISMISS_KEY = 'belezaflow-install-prompt-dismissed';

function isIOSSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  return isIOS && isSafari;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (window.navigator as unknown as { standalone?: boolean }).standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: T.ink,
          color: T.goldLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.ink, lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

export function InstallIOSPrompt() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || !isIOSSafari()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      // localStorage unavailable — still safe to show the prompt once per session
    }
    setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // localStorage unavailable — the prompt will just show again next session
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(27,23,18,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 430, background: T.bg, borderRadius: '22px 22px 0 0', padding: '22px 22px 30px', boxShadow: SHADOW.elevated, boxSizing: 'border-box' }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 4, background: T.line, margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 12 }}>
          <div style={{ fontFamily: 'Playfair Display', fontSize: 19, fontWeight: 400, color: T.ink }}>{t.installPrompt.title}</div>
          <button onClick={dismiss} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, flexShrink: 0 }} data-testid="install-prompt-dismiss">
            <X size={18} color={T.muted} />
          </button>
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, marginBottom: 20, lineHeight: 1.5 }}>{t.installPrompt.subtitle}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Step n={1} text={t.installPrompt.step1} />
          <Step n={2} text={t.installPrompt.step2} />
          <Step n={3} text={t.installPrompt.step3} />
        </div>
      </div>
    </div>
  );
}
