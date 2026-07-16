import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';

interface CrmProfileScreenProps {
  t: Locale;
  client: { initial: string; name: string; tag: string; value: string };
  onBack: () => void;
}

export function CrmProfileScreen({ t, client, onBack }: CrmProfileScreenProps) {
  const p = t.crm.profile;
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:20px; box-sizing:border-box;`)}>
        <div onClick={onBack} style={sx('cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#8A8074; font-weight:600; margin-bottom:18px;')}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#8A8074" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 2 3 6l4.5 4"></path>
          </svg>
          {t.crm.title}
        </div>
        <div style={sx('text-align:center;')}>
          <div style={sx("width:64px; height:64px; border-radius:50%; background:#F0E6D2; margin:0 auto 14px; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:#8A6A2E;")}>
            {client.initial}
          </div>
          <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600;")}>{client.name}</div>
          <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{p.since}</div>
        </div>
      </div>
      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:16px;`)}>
        <div style={sx('display:flex; gap:10px;')}>
          <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:14px; text-align:center;')}>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600;")}>{client.value}</div>
            <div style={sx('font-size:11px; color:#8A8074; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;')}>{p.totalSpentLabel}</div>
          </div>
          <div style={sx('flex:1; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:14px; text-align:center;')}>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600;")}>{p.visits}</div>
            <div style={sx('font-size:11px; color:#8A8074; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;')}>{p.visitsLabel}</div>
          </div>
        </div>
        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:18px;')}>
          <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;')}>{p.tagsLabel}</div>
          <div style={sx('display:flex; flex-wrap:wrap; gap:8px;')}>
            <div style={sx('font-size:12px; padding:6px 12px; border-radius:999px; background:#F6EFE1; color:#8A6A2E; font-weight:600;')}>{client.tag}</div>
            {p.tags.map((tag) => (
              <div key={tag} style={sx('font-size:12px; padding:6px 12px; border-radius:999px; background:#F6EFE1; color:#8A6A2E; font-weight:600;')}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div style={sx('background:#201C17; border-radius:16px; padding:18px; color:#F4E9D2;')}>
          <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#C9A24B; margin-bottom:8px;')}>{p.nextApptLabel}</div>
          <div style={sx('font-size:15px; font-weight:600;')}>{p.nextAppt}</div>
        </div>
      </div>
    </div>
  );
}
