import type { CSSProperties, ReactNode } from 'react';
import { sx } from '../lib/sx';

interface SectionProps {
  label: string;
  heading: string;
  dataScreenLabel?: string;
  lastSection?: boolean;
  children: ReactNode;
}

export function Section({ label, heading, dataScreenLabel, lastSection, children }: SectionProps) {
  return (
    <div style={sx(`padding:0 48px ${lastSection ? '120px' : '96px'};`)} data-screen-label={dataScreenLabel}>
      <div style={sx('margin-bottom:36px;')}>
        <div style={sx('font-size:12px; letter-spacing:2.5px; text-transform:uppercase; color:#B98D3E; font-weight:700; margin-bottom:10px;')}>{label}</div>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600;")}>{heading}</div>
      </div>
      {children}
    </div>
  );
}

export function DeviceRow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...sx('display:flex; gap:28px; flex-wrap:wrap;'), ...style }}>{children}</div>;
}

export const PHONE_BODY = 'height:100%; display:flex; flex-direction:column; background:#FBF8F2;';
export const PHONE_HEADER = 'padding:70px 24px 16px; box-sizing:border-box;';
export const SCROLL_BODY = 'flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:16px;';
export const CARD = 'background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;';
export const LABEL_KICKER = 'font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;';
export const SERIF_TITLE = "font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600;";
