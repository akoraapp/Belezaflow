import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { T } from '../theme';
import { TextInput } from '../components/primitives';
import { useLang } from '../lib/LangContext';

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;
  const submit = () => canSubmit && onLogin(name.trim());

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '44px 22px 28px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ flex: 0.5 }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 26 }}>
          <div style={{ position: 'relative', width: 128, height: 92, marginBottom: 8 }}>
            <svg width="128" height="92" viewBox="0 0 128 92" style={{ position: 'absolute', inset: 0 }}>
              <path
                d="M8,58 C 30,78 50,78 64,54 C 78,30 98,30 118,50"
                fill="none"
                stroke={T.gold}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </svg>
            <span style={{ position: 'absolute', left: 4, top: 4, fontFamily: 'Fraunces', fontSize: 60, fontWeight: 600, color: T.ink, lineHeight: 1 }}>B</span>
            <span style={{ position: 'absolute', left: 58, top: 4, fontFamily: 'Fraunces', fontSize: 60, fontWeight: 500, color: T.gold, lineHeight: 1 }}>F</span>
            <Sparkles size={17} color={T.gold} style={{ position: 'absolute', top: -2, right: 6 }} />
          </div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 25, fontWeight: 600, letterSpacing: 3, marginBottom: 10 }}>
            <span style={{ color: T.ink }}>BELEZA</span>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ color: T.gold }}>FLOW</span>
              <svg width="76" height="14" viewBox="0 0 76 14" style={{ position: 'absolute', left: 0, bottom: -9 }}>
                <path d="M2,3 C 20,13 40,13 50,5 C 58,-1 68,1 74,7" fill="none" stroke={T.gold} strokeWidth={1.6} strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.muted, textAlign: 'center', fontWeight: 700 }}>
            {t.login.brandTagline}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextInput value={name} onChange={setName} placeholder={t.login.namePlaceholder} testId="login-name" />
          <TextInput type="email" value={email} onChange={setEmail} placeholder={t.login.emailPlaceholder} testId="login-email" />
          <TextInput type="password" value={password} onChange={setPassword} placeholder={t.login.passwordPlaceholder} testId="login-password" />
        </div>

        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <span style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.goldDeep, fontWeight: 700 }}>{t.login.forgotPassword}</span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={submit}
          disabled={!canSubmit}
          data-testid="login-submit"
          style={{
            width: '100%',
            height: 52,
            borderRadius: 14,
            border: 'none',
            background: canSubmit ? `linear-gradient(135deg, #C9A24B, #8A6D2F)` : T.line,
            color: canSubmit ? '#fff' : T.muted,
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 15,
            cursor: canSubmit ? 'pointer' : 'default',
            marginTop: 22,
          }}
        >
          {t.login.enterCta}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.line }} />
          <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>{t.login.orDivider}</span>
          <div style={{ flex: 1, height: 1, background: T.line }} />
        </div>

        <button
          onClick={submit}
          disabled={!canSubmit}
          data-testid="login-create-account"
          style={{
            width: '100%',
            height: 52,
            borderRadius: 14,
            border: 'none',
            background: canSubmit ? T.ink : T.line,
            color: canSubmit ? '#fff' : T.muted,
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 15,
            cursor: canSubmit ? 'pointer' : 'default',
          }}
        >
          {t.login.createAccountCta}
        </button>
      </div>
    </div>
  );
}
