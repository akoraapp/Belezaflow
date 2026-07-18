import { BarChart3, Calendar, Grid3x3, Home, Megaphone, Users, type LucideIcon } from 'lucide-react';
import { T } from '../theme';
import type { Dict } from '../i18n';

export interface TabDef {
  id: string;
  label: string;
  icon: LucideIcon;
}

export function getTabs(t: Dict): TabDef[] {
  return [
    { id: 'hoje', label: t.nav.tabHoje, icon: Home },
    { id: 'maquina', label: t.nav.tabConteudo, icon: Megaphone },
    { id: 'agenda', label: t.nav.tabAgenda, icon: Calendar },
    { id: 'clientes', label: t.nav.tabClientes, icon: Users },
    { id: 'ia', label: t.nav.tabDiagnostico, icon: BarChart3 },
  ];
}

export function BottomNav({
  active,
  onSelect,
  onMore,
  moreActive,
  t,
}: {
  active: string;
  onSelect: (id: string) => void;
  onMore: () => void;
  moreActive: boolean;
  t: Dict;
}) {
  const tabs = getTabs(t);
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
      {tabs.map((tb) => {
        const isActive = active === tb.id && !moreActive;
        return (
          <button
            key={tb.id}
            onClick={() => onSelect(tb.id)}
            data-testid={`tab-${tb.id}`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            <tb.icon size={19} color={isActive ? T.goldDeep : T.muted} strokeWidth={isActive ? 2.4 : 1.9} />
            <span style={{ fontFamily: 'Manrope', fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? T.goldDeep : T.muted }}>{tb.label}</span>
          </button>
        );
      })}
      <button
        onClick={onMore}
        data-testid="tab-mais"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0' }}
      >
        <Grid3x3 size={19} color={moreActive ? T.goldDeep : T.muted} strokeWidth={moreActive ? 2.4 : 1.9} />
        <span style={{ fontFamily: 'Manrope', fontSize: 10, fontWeight: moreActive ? 700 : 500, color: moreActive ? T.goldDeep : T.muted }}>{t.nav.tabMais}</span>
      </button>
    </div>
  );
}
