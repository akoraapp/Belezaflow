import { sx } from '../lib/sx';
import { SCREEN_SCROLL, SCREEN_PAD_TOP, SCREEN_PAD_BOTTOM, CONTENT_PAD_X } from '../components/AppFrame';
import type { Locale } from '../data/content';

export interface HojeQuickAction {
  key: string;
  label: string;
  bg: string;
  border: string;
  color: string;
  onClick: () => void;
}

export interface ReadyResponseWithCopy {
  title: string;
  text: string;
  copyLabel: string;
  onCopy: () => void;
}

interface HomeScreenProps {
  t: Locale;
  goalPercentLabel: string;
  goalRemainingLabel: string;
  hojeQuickActions: HojeQuickAction[];
  readyResponsesOpen: boolean;
  readyResponsesToggleLabel: string;
  readyResponsesWithCopy: ReadyResponseWithCopy[];
  toggleReadyResponses: () => void;
  goToContentSuggestion: () => void;
}

export function HomeScreen({
  t,
  goalPercentLabel,
  goalRemainingLabel,
  hojeQuickActions,
  readyResponsesOpen,
  readyResponsesToggleLabel,
  readyResponsesWithCopy,
  toggleReadyResponses,
  goToContentSuggestion,
}: HomeScreenProps) {
  return (
    <div style={sx(`${SCREEN_SCROLL}`)}>
      <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box;`)}>
        <div style={sx('font-size:13px; color:#8A8074;')}>{t.today.date}</div>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; margin-top:4px;")}>{t.today.greeting}</div>
      </div>

      <div style={sx(`${CONTENT_PAD_X} ${SCREEN_PAD_BOTTOM} box-sizing:border-box; display:flex; flex-direction:column; gap:16px;`)}>
        <div style={sx('background:#201C17; border-radius:20px; padding:22px; color:#F4E9D2;')}>
          <div style={sx('display:flex; justify-content:space-between; align-items:baseline;')}>
            <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#C9A24B; font-weight:700;')}>{t.today.goal.label}</div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600;")}>{goalPercentLabel}</div>
          </div>
          <div style={sx("font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:600; margin-top:10px;")}>{t.today.goal.current}</div>
          <div style={sx('height:8px; border-radius:999px; background:rgba(244,233,210,0.16); margin-top:14px; overflow:hidden;')}>
            <div style={{ ...sx('height:100%; border-radius:999px; background:#C9A24B;'), width: goalPercentLabel }} />
          </div>
          <div style={sx('font-size:12px; color:#B7AE9C; margin-top:10px;')}>{goalRemainingLabel}</div>
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:18px;')}>
          <div style={sx('display:flex; align-items:center; gap:8px; margin-bottom:10px;')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98D3E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.5c.6 3.2 2 4.6 5.2 5.2-3.2.6-4.6 2-5.2 5.2-.6-3.2-2-4.6-5.2-5.2 3.2-.6 4.6-2 5.2-5.2Z"></path>
            </svg>
            <div style={sx('font-size:12px; font-weight:700; color:#201C17;')}>{t.brand.name}</div>
            <div style={sx('font-size:11px; color:#B0A78F; margin-left:auto;')}>{t.today.diagnostic.timestamp}</div>
          </div>
          <div style={sx('font-size:14px; line-height:1.55; color:#3A342C; margin-bottom:14px;')}>{t.today.diagnostic.message}</div>
          <div
            style={sx(
              'height:44px; border-radius:999px; background:#201C17; color:#F4E9D2; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700;',
            )}
          >
            {t.today.diagnostic.ctaLabel}
          </div>
        </div>

        <div style={sx('background:#FFFFFF; border:1.5px solid #E3C989; border-radius:20px; padding:18px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A6A2E; margin-bottom:10px;')}>
            {t.today.contentSuggestion.label}
          </div>
          <div style={sx('font-size:14px; line-height:1.55; color:#3A342C; margin-bottom:14px;')}>{t.today.contentSuggestion.message}</div>
          <div
            onClick={goToContentSuggestion}
            style={sx(
              'cursor:pointer; height:44px; border-radius:999px; background:#F6EFE1; color:#8A6A2E; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700;',
            )}
          >
            {t.today.contentSuggestion.ctaLabel}
          </div>
        </div>

        <div>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;')}>
            {t.today.quickActionsLabel}
          </div>
          <div style={sx('display:grid; grid-template-columns:1fr 1fr; gap:10px;')}>
            {hojeQuickActions.map((qa) => (
              <div
                key={qa.key}
                onClick={qa.onClick}
                style={{
                  ...sx('cursor:pointer; border-radius:16px; padding:18px 14px; display:flex; align-items:center; justify-content:center; text-align:center;'),
                  background: qa.bg,
                  border: `1px solid ${qa.border}`,
                }}
              >
                <div style={{ ...sx('font-size:13px; font-weight:700; line-height:1.35;'), color: qa.color }}>{qa.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:20px; padding:18px;')}>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:14px;')}>
            {t.today.processLabel}
          </div>
          {t.today.processSteps.map((ps) => (
            <div key={ps.num} style={sx('display:flex; gap:12px; padding:10px 0; border-top:1px solid #F2ECDF;')}>
              <div
                style={sx(
                  'flex-shrink:0; width:26px; height:26px; border-radius:50%; border:1.5px solid #E3C989; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#B98D3E;',
                )}
              >
                {ps.num}
              </div>
              <div>
                <div style={sx('font-size:13px; font-weight:700; color:#201C17;')}>{ps.title}</div>
                <div style={sx('font-size:12.5px; color:#8A8074; margin-top:3px; line-height:1.5;')}>{ps.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;')}>
            {t.today.actionCardsLabel}
          </div>
          <div style={sx('display:flex; flex-direction:column; gap:10px;')}>
            {t.today.actionCards.map((ac) => (
              <div key={ac.title} style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
                <div style={sx('font-size:14px; font-weight:700; color:#201C17;')}>{ac.title}</div>
                <div style={sx('font-size:12.5px; color:#8A8074; margin-top:4px; line-height:1.5;')}>{ac.desc}</div>
                <div
                  style={sx(
                    'margin-top:12px; display:inline-flex; padding:9px 16px; border-radius:999px; background:#F6EFE1; color:#8A6A2E; font-size:12px; font-weight:700; cursor:pointer;',
                  )}
                >
                  {ac.ctaLabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={sx('background:#F6EFE1; border-radius:20px; padding:18px;')}>
          <div onClick={toggleReadyResponses} style={sx('cursor:pointer; display:flex; align-items:center; justify-content:space-between;')}>
            <div style={sx('font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A6A2E;')}>{t.today.readyResponsesLabel}</div>
            <div style={sx('font-size:12px; color:#8A6A2E; font-weight:700;')}>{readyResponsesToggleLabel}</div>
          </div>
          {readyResponsesOpen && (
            <div style={sx('display:flex; flex-direction:column; gap:10px; margin-top:14px;')}>
              {readyResponsesWithCopy.map((rr) => (
                <div key={rr.title} style={sx('background:#FFFFFF; border:1px solid #EAD9B0; border-radius:14px; padding:14px;')}>
                  <div style={sx('font-size:11px; font-weight:700; color:#B98D3E; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;')}>
                    {rr.title}
                  </div>
                  <div style={sx('font-size:13px; color:#3A342C; line-height:1.5;')}>{rr.text}</div>
                  <div
                    onClick={rr.onCopy}
                    style={sx(
                      'cursor:pointer; margin-top:10px; display:inline-flex; padding:7px 14px; border-radius:999px; background:#201C17; color:#F4E9D2; font-size:11px; font-weight:700;',
                    )}
                  >
                    {rr.copyLabel}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
