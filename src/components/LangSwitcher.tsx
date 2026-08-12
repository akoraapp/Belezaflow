import { useLang } from '../lib/LangContext';
import { LANG_OPTIONS } from '../i18n';
import { F } from '../lib/funnelTheme';

// Small language switcher for the pre-auth funnel pages (landing + quiz),
// which don't have a signed-in profile driving the language yet. Uses the
// same LangProvider/localStorage the rest of the app already relies on, so
// picking a language here carries over into Login/Onboarding/the app.
export function LangSwitcher({ dark }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {LANG_OPTIONS.map((opt) => {
        const active = opt.code === lang;
        return (
          <button
            key={opt.code}
            onClick={() => setLang(opt.code)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '5px 10px',
              fontFamily: 'Inter',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              background: active ? F.gold : 'transparent',
              color: active ? F.ink : dark ? F.mutedOnDark : F.muted,
            }}
          >
            {opt.code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
