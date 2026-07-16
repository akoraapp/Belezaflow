import { sx } from '../lib/sx';
import { SCREEN_PAD_TOP, CONTENT_PAD_X } from './AppFrame';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  backLabel: string;
  onBack: () => void;
}

export function ScreenHeader({ title, subtitle, backLabel, onBack }: ScreenHeaderProps) {
  return (
    <div style={sx(`${SCREEN_PAD_TOP} ${CONTENT_PAD_X} padding-bottom:16px; box-sizing:border-box; flex-shrink:0;`)}>
      <div onClick={onBack} style={sx('cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#8A8074; font-weight:600; margin-bottom:14px;')}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#8A8074" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.5 2 3 6l4.5 4"></path>
        </svg>
        {backLabel}
      </div>
      <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600;")}>{title}</div>
      {subtitle && <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{subtitle}</div>}
    </div>
  );
}
