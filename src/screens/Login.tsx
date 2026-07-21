import { useState } from 'react';
import { T } from '../theme';
import { TextInput, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import belezaflowLogo from '../assets/belezaflow-logo.webp';

function deriveNameFromEmail(email: string) {
  const local = email.split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Profissional';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = email.trim().length > 0 && password.trim().length > 0;
  const submit = () => canSubmit && onLogin(deriveNameFromEmail(email.trim()));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '44px 22px 28px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ flex: 0.5 }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 26 }}>
          <img src={belezaflowLogo} alt="BelezaFlow" style={{ width: 220, height: 'auto', marginBottom: 4 }} />
          <div style={{ fontFamily: 'Inter', fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: 700, color: T.muted, textAlign: 'center' }}>{t.login.brandTagline}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextInput type="email" value={email} onChange={setEmail} placeholder={t.login.emailPlaceholder} testId="login-email" />
          <TextInput type="password" value={password} onChange={setPassword} placeholder={t.login.passwordPlaceholder} testId="login-password" />
        </div>

        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.goldDeep, fontWeight: 700 }}>{t.login.forgotPassword}</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ marginTop: 22 }}>
          <PrimaryButton full onClick={submit} disabled={!canSubmit} testId="login-submit">
            {t.login.enterCta}
          </PrimaryButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.line }} />
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.login.orDivider}</span>
          <div style={{ flex: 1, height: 1, background: T.line }} />
        </div>

        <PrimaryButton full onClick={submit} disabled={!canSubmit} variant="accent" testId="login-create-account">
          {t.login.createAccountCta}
        </PrimaryButton>
      </div>
    </div>
  );
}
