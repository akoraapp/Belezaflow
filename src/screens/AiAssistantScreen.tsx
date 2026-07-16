import { sx } from '../lib/sx';
import { ScreenHeader } from '../components/ScreenHeader';
import { SCREEN_SCROLL, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';

export function AiAssistantScreen({ t, onBack }: { t: Locale; onBack: () => void }) {
  const ia = t.ia;
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <ScreenHeader title={ia.title} subtitle={ia.subtitle} backLabel={t.tabbar.mais} onBack={onBack} />
      <div style={sx(`${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box; display:flex; flex-direction:column; gap:12px;`)}>
        {ia.messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.align }}>
            <div
              style={{
                ...sx('max-width:78%; padding:12px 16px; border-radius:16px; font-size:14px; line-height:1.5;'),
                background: msg.bg,
                color: msg.color,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; gap:8px; flex-wrap:wrap;`)}>
        {ia.suggestions.map((sg) => (
          <div key={sg} style={sx('font-size:12px; padding:8px 14px; border-radius:999px; border:1px solid #D8C79E; color:#8A6A2E; font-weight:600;')}>
            {sg}
          </div>
        ))}
      </div>
    </div>
  );
}
