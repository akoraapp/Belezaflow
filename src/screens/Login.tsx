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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: 52, fontWeight: 600, color: T.ink, lineHeight: 1 }}>B</span>
            <span style={{ fontFamily: 'Fraunces', fontSize: 52, fontWeight: 500, fontStyle: 'italic', color: T.gold, lineHeight: 1, marginLeft: -10 }}>F</span>
            <Sparkles size={16} color={T.gold} style={{ position: 'absolute', top: -6, right: -10 }} />
          </div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, letterSpacing: 0.3, marginBottom: 10 }}>
            <span style={{ color: T.ink }}>Beleza</span>
            <span style={{ color: T.gold, fontStyle: 'italic' }}>Flow</span>
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
            background: canSubmit ? T.ink : T.line,
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
            background: canSubmit ? `linear-gradient(135deg, #C9A24B, #8A6D2F)` : T.line,
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
