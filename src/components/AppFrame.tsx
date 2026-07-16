import type { ReactNode } from 'react';
import { sx } from '../lib/sx';

/**
 * Mobile-first shell. Edge-to-edge on phone widths; centered as a single
 * app column with a soft edge on wider viewports (no fake device bezel —
 * this is the real app, not a mockup).
 */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div style={sx('height:100dvh; display:flex; justify-content:center; background:#ECE4D3;')}>
      <div
        style={{
          ...sx("width:100%; max-width:480px; height:100%; background:#FAF7F0; position:relative; display:flex; flex-direction:column; font-family:'Manrope',sans-serif; color:#26221D; overflow:hidden;"),
          boxShadow: '0 0 60px rgba(32,28,23,0.08)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const SCREEN_SCROLL = 'flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch;';
export const SCREEN_PAD_TOP = 'padding-top:calc(env(safe-area-inset-top, 0px) + 24px);';
export const SCREEN_PAD_BOTTOM = 'padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 96px);';
export const CONTENT_PAD_X = 'padding-left:24px; padding-right:24px;';
