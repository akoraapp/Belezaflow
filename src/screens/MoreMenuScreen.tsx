import type { ReactNode } from 'react';
import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Lang, Locale } from '../data/content';
import type { Detail } from '../app/navigation';

interface MenuEntry {
  detail: Detail;
  title: string;
  subtitle: string;
  icon: ReactNode;
}

interface MoreMenuScreenProps {
  t: Locale;
  lang: Lang;
  onToggleLang: () => void;
  onOpen: (detail: Detail) => void;
}

export function MoreMenuScreen({ t, lang, onToggleLang, onOpen }: MoreMenuScreenProps) {
  const entries: MenuEntry[] = [
    {
      detail: 'clientMachine',
      title: t.clientMachine.title,
      subtitle: t.clientMachine.tool.ui.subtitle,
      icon: (
        <path d="M12 3.5c.6 3.2 2 4.6 5.2 5.2-3.2.6-4.6 2-5.2 5.2-.6-3.2-2-4.6-5.2-5.2 3.2-.6 4.6-2 5.2-5.2Z"></path>
      ),
    },
    {
      detail: 'inventory',
      title: t.inventory.title,
      subtitle: t.inventory.heading,
      icon: (
        <>
          <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"></path>
          <path d="M4 8.5 12 13l8-4.5M12 13v7"></path>
        </>
      ),
    },
    {
      detail: 'relatorios',
      title: t.relatorios.title,
      subtitle: t.relatorios.heading,
      icon: (
        <>
          <path d="M5 19V9M12 19V5M19 19v-6"></path>
        </>
      ),
    },
    {
      detail: 'ia',
      title: t.ia.title,
      subtitle: t.ia.subtitle,
      icon: (
        <>
          <path d="M12 3.5c.6 3.2 2 4.6 5.2 5.2-3.2.6-4.6 2-5.2 5.2-.6-3.2-2-4.6-5.2-5.2 3.2-.6 4.6-2 5.2-5.2Z"></path>
          <path d="M18.5 15.5c.3 1.6 1 2.3 2.6 2.6-1.6.3-2.3 1-2.6 2.6-.3-1.6-1-2.3-2.6-2.6 1.6-.3 2.3-1 2.6-2.6Z"></path>
        </>
      ),
    },
    {
      detail: 'config',
      title: t.config.title,
      subtitle: t.config.heading,
      icon: (
        <>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.6-2-3.4-2.4.6a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.3 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-.6-2 3.4L6.6 11a7.7 7.7 0 0 0 0 2l-2 1.6 2 3.4 2.4-.6a7.6 7.6 0 0 0 1.7 1L11 21h4l.3-2.6a7.6 7.6 0 0 0 1.7-1l2.4.6 2-3.4-2-1.6Z"></path>
        </>
      ),
    },
  ];

  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box;`)}>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;")}>{t.tabbar.mais}</div>
      </div>

      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:10px;`)}>
        {entries.map((entry) => (
          <div
            key={entry.detail}
            onClick={() => onOpen(entry.detail)}
            style={sx(
              'cursor:pointer; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px; display:flex; align-items:center; gap:14px;',
            )}
          >
            <div style={sx('flex-shrink:0; width:38px; height:38px; border-radius:50%; border:1.5px solid #E3C989; display:flex; align-items:center; justify-content:center;')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98D3E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {entry.icon}
              </svg>
            </div>
            <div style={sx('flex:1; min-width:0;')}>
              <div style={sx('font-size:15px; font-weight:700;')}>{entry.title}</div>
              <div style={sx('font-size:12px; color:#8A8074; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;')}>{entry.subtitle}</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
              <path d="M1 1l6 6-6 6" stroke="#D8C79E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}

        <div
          onClick={onToggleLang}
          style={sx(
            'cursor:pointer; margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px; padding:12px 16px; border:1px solid #D8C79E; border-radius:999px; font-size:13px; font-weight:600; letter-spacing:0.5px;',
          )}
        >
          <span style={{ color: lang === 'pt' ? '#201C17' : '#B7AE9C' }}>PT</span>
          <span style={sx('color:#D8C79E;')}>/</span>
          <span style={{ color: lang === 'en' ? '#201C17' : '#B7AE9C' }}>EN</span>
        </div>
      </div>
    </div>
  );
}
