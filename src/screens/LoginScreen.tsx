import { useState } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_PAD_TOP, CONTENT_PAD_X } from '../components/AppFrame';
import type { NewFeatureStrings } from '../data/newFeatures';

interface LoginScreenProps {
  strings: NewFeatureStrings['login'];
  onLogin: (name: string) => void;
}

export function LoginScreen({ strings, onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;

  const inputStyle = sx(
    "height:50px; border-radius:12px; border:1px solid #EBE2CF; padding:0 16px; font-size:14px; font-family:'Manrope',sans-serif; box-sizing:border-box; width:100%;",
  );

  return (
    <div style={sx('height:100%; display:flex; flex-direction:column; background:#FFFFFF;')}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} display:flex; flex-direction:column; flex:1; box-sizing:border-box; padding-bottom:32px;`)}>
        <div style={sx('flex:0.5;')} />

        <div style={sx('width:34px; height:34px; border-radius:50%; border:1.5px solid #B98D3E; display:flex; align-items:center; justify-content:center; margin-bottom:20px;')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98D3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M6 6l2.2 2.2M15.8 15.8 18 18M18 6l-2.2 2.2M8.2 15.8 6 18"></path>
          </svg>
        </div>

        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; margin-bottom:6px;")}>
          {mode === 'signup' ? strings.signupTitle : strings.signinTitle}
        </div>
        <div style={sx('font-size:14px; color:#8A8074; margin-bottom:32px;')}>{mode === 'signup' ? strings.signupSubtitle : strings.signinSubtitle}</div>

        <div style={sx('display:flex; flex-direction:column; gap:12px;')}>
          <input type="text" placeholder={strings.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <input type="email" placeholder={strings.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder={strings.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </div>

        <div
          onClick={() => setMode((m) => (m === 'signup' ? 'signin' : 'signup'))}
          style={sx('cursor:pointer; font-size:13px; color:#B98D3E; font-weight:600; margin-top:16px; text-align:center;')}
        >
          {mode === 'signup' ? strings.toggleToSignin : strings.toggleToSignup}
        </div>

        <div style={sx('flex:1;')} />

        <div
          onClick={() => canSubmit && onLogin(name.trim())}
          data-testid="login-submit"
          style={{
            ...sx(
              'cursor:pointer; height:52px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:600; letter-spacing:0.4px;',
            ),
            background: canSubmit ? '#201C17' : '#EBE2CF',
            color: canSubmit ? '#F4E9D2' : '#B0A78F',
          }}
        >
          {mode === 'signup' ? strings.signupCta : strings.signinCta}
        </div>
      </div>
    </div>
  );
}
