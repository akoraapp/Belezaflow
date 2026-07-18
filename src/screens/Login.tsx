import { useState } from 'react';
import { T } from '../theme';
import { PrimaryButton, TextInput } from '../components/primitives';
import { useLang } from '../lib/LangContext';

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const { t } = useLang();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 22px 28px', boxSizing: 'border-box' }}>
        <div style={{ flex: 0.6 }} />

        <div style={{ fontFamily: 'Fraunces', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: T.goldDeep, marginBottom: 10 }}>{t.login.brandEyebrow}</div>
        <div style={{ fontFamily: 'Fraunces', fontSize: 30, fontWeight: 600, color: T.ink, marginBottom: 6 }}>{mode === 'signup' ? t.login.signupTitle : t.login.signinTitle}</div>
        <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.muted, marginBottom: 28 }}>{mode === 'signup' ? t.login.signupSubtitle : t.login.signinSubtitle}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextInput value={name} onChange={setName} placeholder={t.login.namePlaceholder} testId="login-name" />
          <TextInput type="email" value={email} onChange={setEmail} placeholder={t.login.emailPlaceholder} testId="login-email" />
          <TextInput type="password" value={password} onChange={setPassword} placeholder={t.login.passwordPlaceholder} testId="login-password" />
        </div>

        <div
          onClick={() => setMode((m) => (m === 'signup' ? 'signin' : 'signup'))}
          style={{ cursor: 'pointer', fontFamily: 'Manrope', fontSize: 13, color: T.goldDeep, fontWeight: 700, marginTop: 16, textAlign: 'center' }}
        >
          {mode === 'signup' ? t.login.toggleToSignin : t.login.toggleToSignup}
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton full disabled={!canSubmit} onClick={() => canSubmit && onLogin(name.trim())} testId="login-submit">
          {mode === 'signup' ? t.login.signupCta : t.login.signinCta}
        </PrimaryButton>
      </div>
    </div>
  );
}
