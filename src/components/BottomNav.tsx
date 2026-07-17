import { Bot, Calendar, Grid3x3, Home, Megaphone, Users, type LucideIcon } from 'lucide-react';
import { T } from '../theme';

export interface TabDef {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const TABS: TabDef[] = [
  { id: 'hoje', label: 'Hoje', icon: Home },
  { id: 'maquina', label: 'Conteúdo', icon: Megaphone },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'ia', label: 'IA', icon: Bot },
];

export function BottomNav({
  active,
  onSelect,
  onMore,
  moreActive,
}: {
  active: string;
  onSelect: (id: string) => void;
  onMore: () => void;
  moreActive: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(8px)',
        borderTop: `1px solid ${T.line}`,
        display: 'flex',
        padding: '8px 6px 10px',
        zIndex: 20,
      }}
    >
      {TABS.map((t) => {
        const isActive = active === t.id && !moreActive;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            data-testid={`tab-${t.id}`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            <t.icon size={19} color={isActive ? T.goldDeep : T.muted} strokeWidth={isActive ? 2.4 : 1.9} />
            <span style={{ fontFamily: 'Manrope', fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? T.goldDeep : T.muted }}>{t.label}</span>
          </button>
        );
      })}
      <button
        onClick={onMore}
        data-testid="tab-mais"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0' }}
      >
        <Grid3x3 size={19} color={moreActive ? T.goldDeep : T.muted} strokeWidth={moreActive ? 2.4 : 1.9} />
        <span style={{ fontFamily: 'Manrope', fontSize: 10, fontWeight: moreActive ? 700 : 500, color: moreActive ? T.goldDeep : T.muted }}>Mais</span>
      </button>
    </div>
  );
}
