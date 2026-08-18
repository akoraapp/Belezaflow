import { useState } from 'react';
import { T } from '../theme';
import { TextInput, PrimaryButton } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { supabase } from '../services/supabaseClient';
import belezaflowLogo from '../assets/belezaflow-logo.webp';

const MIN_PASSWORD_LENGTH = 6;

// Shown instead of the normal dashboard when Supabase fires PASSWORD_RECOVERY
// (the user arrived via a "reset your password" email link) — see
// useAuth's passwordRecovery flag and App.tsx's gate. Signs the user out
// after a successful change so they log back in with the new password,
// which is the simplest correct way to make sure the app re-derives a
// clean session/profile/subscription state afterward.
export function NovaSenhaScreen({ onDone }: { onDone: () => void }) {
  const { t } = useLang();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const canSubmit = password.trim().length >= MIN_PASSWORD_LENGTH && confirmPassword.trim().length >= MIN_PASSWORD_LENGTH;

  const submit = async () => {
    if (!canSubmit || loading) return;
    setError('');
    if (password !== confirmPassword) {
      setError(t.novaSenha.errorMismatch);
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setLoading(false);
      setError(t.novaSenha.errorGeneric);
      return;
    }
    setSuccess(true);
    await supabase.auth.signOut();
    setTimeout(onDone, 1800);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '44px 22px 28px', boxSizing: 'border-box', overflowY: 'auto', background: T.bg }}>
      <img src={belezaflowLogo} alt="BelezaFlow" style={{ width: 140, height: 'auto', margin: '0 auto 28px', display: 'block' }} />
      <div style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 400, color: T.ink, marginBottom: 8, textAlign: 'center' }}>{t.novaSenha.title}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted, marginBottom: 26, lineHeight: 1.5, textAlign: 'center' }}>{t.novaSenha.subtitle}</div>

      {success ? (
        <div style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.success, textAlign: 'center', fontWeight: 600 }} data-testid="nova-senha-success">
          {t.novaSenha.successMessage}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            <TextInput type="password" value={password} onChange={setPassword} placeholder={t.novaSenha.passwordPlaceholder} testId="nova-senha-password" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <TextInput type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder={t.novaSenha.confirmPlaceholder} testId="nova-senha-confirm" />
          </div>
          {error && (
            <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.danger, marginBottom: 14, textAlign: 'center' }} data-testid="nova-senha-error">
              {error}
            </div>
          )}
          <PrimaryButton full onClick={submit} disabled={!canSubmit || loading} testId="nova-senha-submit">
            {loading ? '…' : t.novaSenha.submitCta}
          </PrimaryButton>
        </>
      )}
    </div>
  );
}
