import { useState } from 'react';
import { T } from '../theme';
import { TextInput, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { supabase } from '../lib/supabaseClient';
import belezaflowLogo from '../assets/belezaflow-logo.webp';

export function Login() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<'signin' | 'signup' | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const signIn = async () => {
    if (!canSubmit || loading) return;
    setError('');
    setInfo('');
    setLoading('signin');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(null);
    if (signInError) setError(t.login.authErrorGeneric);
  };

  const signUp = async () => {
    if (!canSubmit || loading) return;
    setError('');
    setInfo('');
    setLoading('signup');
    const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(null);
    if (signUpError) {
      setError(t.login.authErrorGeneric);
      return;
    }
    if (data.session) return;
    setInfo(t.login.signupCheckEmail);
  };

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

        {error && (
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.danger, marginTop: 12 }} data-testid="login-error">
            {error}
          </div>
        )}
        {info && (
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.success, marginTop: 12 }} data-testid="login-info">
            {info}
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.goldDeep, fontWeight: 700 }}>{t.login.forgotPassword}</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ marginTop: 22 }}>
          <PrimaryButton full onClick={signIn} disabled={!canSubmit || !!loading} testId="login-submit">
            {loading === 'signin' ? '…' : t.login.enterCta}
          </PrimaryButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: T.line }} />
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted }}>{t.login.orDivider}</span>
          <div style={{ flex: 1, height: 1, background: T.line }} />
        </div>

        <PrimaryButton full onClick={signUp} disabled={!canSubmit || !!loading} variant="accent" testId="login-create-account">
          {loading === 'signup' ? '…' : t.login.createAccountCta}
        </PrimaryButton>
      </div>
    </div>
  );
}
