import { useState } from 'react';
import { T } from '../theme';
import { TextInput, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { supabase } from '../services/supabaseClient';
import belezaflowLogo from '../assets/belezaflow-logo.webp';

export function Login({ isMobile = true }: { isMobile?: boolean }) {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<'signin' | 'signup' | 'reset' | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const canSubmit = email.trim().length > 0 && password.trim().length > 0;
  const canResetPassword = email.trim().length > 0;

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

  const forgotPassword = async () => {
    if (!canResetPassword || loading) return;
    setError('');
    setInfo('');
    setLoading('reset');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    setLoading(null);
    if (resetError) {
      setError(t.login.authErrorGeneric);
      return;
    }
    setInfo(t.login.forgotPasswordCheckEmail);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '44px 22px 28px' : 0,
          justifyContent: isMobile ? undefined : 'center',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {isMobile ? (
          <>
            <div style={{ flex: 0.5 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 26 }}>
              <img src={belezaflowLogo} alt="BelezaFlow" style={{ width: 220, height: 'auto', marginBottom: 4 }} />
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: 700, color: T.muted, textAlign: 'center' }}>
                {t.login.brandTagline}
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontFamily: 'Playfair Display', fontSize: 34, fontWeight: 400, color: T.ink }}>{t.login.loginWelcomeBack}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.goldDeep, marginTop: 6 }}>{t.login.welcomeBackSubtitle}</div>
          </div>
        )}

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
          <button
            onClick={forgotPassword}
            disabled={!canResetPassword || !!loading}
            data-testid="login-forgot-password"
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontFamily: 'Inter',
              fontSize: 12.5,
              color: T.goldDeep,
              fontWeight: 700,
              cursor: !canResetPassword || !!loading ? 'default' : 'pointer',
              opacity: !canResetPassword || !!loading ? 0.6 : 1,
            }}
          >
            {loading === 'reset' ? '…' : t.login.forgotPassword}
          </button>
        </div>

        {isMobile && <div style={{ flex: 1 }} />}

        <div style={{ marginTop: isMobile ? 22 : 26 }}>
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
