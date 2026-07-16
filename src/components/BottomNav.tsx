import type { ReactNode } from 'react';
import { sx } from '../lib/sx';
import type { Locale } from '../data/content';
import type { Tab } from '../app/navigation';

const ACTIVE = '#201C17';
const INACTIVE = '#C7BEAC';

interface BottomNavProps {
  active: Tab;
  t: Locale;
  onSelect: (tab: Tab) => void;
}

interface NavItem {
  key: Tab;
  label: string;
  icon: (color: string) => ReactNode;
}

export function BottomNav({ active, t, onSelect }: BottomNavProps) {
  const col = (key: Tab) => (active === key ? ACTIVE : INACTIVE);

  const items: NavItem[] = [
    {
      key: 'hoje',
      label: t.tabbar.hoje,
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5"></path>
          <path d="M5.5 10v9h13v-9"></path>
          <path d="M10 19v-5h4v5"></path>
        </svg>
      ),
    },
    {
      key: 'agenda',
      label: t.tabbar.agenda,
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5.5" width="16" height="14.5" rx="2"></rect>
          <path d="M4 10h16M8 3.5v3M16 3.5v3"></path>
        </svg>
      ),
    },
    {
      key: 'crm',
      label: t.tabbar.crm,
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.4"></circle>
          <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2"></path>
        </svg>
      ),
    },
    {
      key: 'financeiro',
      label: t.tabbar.financeiro,
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8.2"></circle>
          <path d="M12 7.5v9M14.6 9.6c0-1.1-1.2-1.9-2.6-1.9-1.5 0-2.6.9-2.6 2 0 3 5.2 1.5 5.2 4.4 0 1.1-1.2 2-2.6 2s-2.6-.8-2.6-1.9"></path>
        </svg>
      ),
    },
    {
      key: 'mais',
      label: t.tabbar.mais,
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.3"></rect>
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.3"></rect>
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.3"></rect>
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.3"></rect>
        </svg>
      ),
    },
  ];

  return (
    <div
      style={sx(
        'position:absolute; left:0; right:0; bottom:0; z-index:50; display:flex; align-items:center; justify-content:space-around; height:64px; padding-bottom:env(safe-area-inset-bottom, 0px); background:rgba(255,255,255,0.92); backdrop-filter:blur(10px); border-top:1px solid #EBE2CF; box-sizing:border-box;',
      )}
    >
      {items.map((item) => (
        <div
          key={item.key}
          onClick={() => onSelect(item.key)}
          data-testid={`tab-${item.key}`}
          style={sx('cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; height:100%; justify-content:center;')}
        >
          {item.icon(col(item.key))}
          <span style={{ ...sx('font-size:10px; font-weight:700; letter-spacing:0.3px;'), color: col(item.key) }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
