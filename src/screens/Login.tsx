import { useState } from 'react';
import { T } from '../theme';
import { PrimaryButton, TextInput } from '../components/primitives';

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 22px 28px', boxSizing: 'border-box' }}>
        <div style={{ flex: 0.6 }} />

        <div style={{ fontFamily: 'Fraunces', fontSize: 15, letterSpacing: 1, textTransform: 'uppercase', color: T.goldDeep, marginBottom: 10 }}>BeautyFlow AI</div>
        <div style={{ fontFamily: 'Fraunces', fontSize: 30, fontWeight: 600, color: T.ink, marginBottom: 6 }}>{mode === 'signup' ? 'Criar conta' : 'Entrar'}</div>
        <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.muted, marginBottom: 28 }}>
          {mode === 'signup' ? 'Comece a usar o BeautyFlow AI.' : 'Acesse sua conta para continuar.'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextInput value={name} onChange={setName} placeholder="Seu nome" testId="login-name" />
          <TextInput type="email" value={email} onChange={setEmail} placeholder="E-mail" testId="login-email" />
          <TextInput type="password" value={password} onChange={setPassword} placeholder="Senha" testId="login-password" />
        </div>

        <div
          onClick={() => setMode((m) => (m === 'signup' ? 'signin' : 'signup'))}
          style={{ cursor: 'pointer', fontFamily: 'Manrope', fontSize: 13, color: T.goldDeep, fontWeight: 700, marginTop: 16, textAlign: 'center' }}
        >
          {mode === 'signup' ? 'Já tem conta? Entrar' : 'Ainda não tem conta? Criar conta'}
        </div>

        <div style={{ flex: 1 }} />

        <PrimaryButton full disabled={!canSubmit} onClick={() => canSubmit && onLogin(name.trim())} testId="login-submit">
          {mode === 'signup' ? 'Criar conta' : 'Entrar'}
        </PrimaryButton>
      </div>
    </div>
  );
}
