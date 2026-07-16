import { sx } from '../lib/sx';
import { ScreenHeader } from '../components/ScreenHeader';
import { SCREEN_SCROLL, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Lang, Locale } from '../data/content';

interface SettingsScreenProps {
  t: Locale;
  lang: Lang;
  onToggleLang: () => void;
  onBack: () => void;
}

export function SettingsScreen({ t, lang, onToggleLang, onBack }: SettingsScreenProps) {
  const c = t.config;
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <ScreenHeader title={c.title} backLabel={t.tabbar.mais} onBack={onBack} />
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:20px;`)}>
        <div
          onClick={onToggleLang}
          style={sx(
            'cursor:pointer; align-self:flex-start; display:flex; align-items:center; gap:8px; padding:8px 16px; border:1px solid #D8C79E; border-radius:999px; font-size:13px; font-weight:600; letter-spacing:0.5px;',
          )}
        >
          <span style={{ color: lang === 'pt' ? '#201C17' : '#B7AE9C' }}>PT</span>
          <span style={sx('color:#D8C79E;')}>/</span>
          <span style={{ color: lang === 'en' ? '#201C17' : '#B7AE9C' }}>EN</span>
        </div>

        {c.sections.map((sec) => (
          <div key={sec.header}>
            <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8A8074; font-weight:700; margin-bottom:8px;')}>{sec.header}</div>
            <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; overflow:hidden;')}>
              {sec.items.map((it) => (
                <div key={it.label} style={sx('display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid #F2ECDF;')}>
                  <span style={sx('font-size:14px; font-weight:600;')}>{it.label}</span>
                  <span style={sx('font-size:13px; color:#8A8074;')}>{it.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
