import { BarChart3, Bell, Megaphone, Package, Settings, type LucideIcon } from 'lucide-react';
import { T } from '../theme';
import type { Dict } from '../i18n';

export interface MoreItem {
  id: string;
  label: string;
  icon: LucideIcon;
  sub: string;
}

export function getMoreItems(t: Dict): MoreItem[] {
  return [
    { id: 'maquina', label: t.nav.tabConteudo, icon: Megaphone, sub: t.nav.moreConteudoSub },
    { id: 'ia', label: t.nav.tabDiagnostico, icon: BarChart3, sub: t.nav.moreDiagnosticoSub },
    { id: 'estoque', label: t.nav.moreEstoqueLabel, icon: Package, sub: t.nav.moreEstoqueSub },
    { id: 'notificacoes', label: t.nav.moreNotificacoesLabel, icon: Bell, sub: t.nav.moreNotificacoesSub },
    { id: 'config', label: t.nav.moreConfigLabel, icon: Settings, sub: t.nav.moreConfigSub },
  ];
}

export function MoreSheet({ onSelect, onClose, t }: { onSelect: (id: string) => void; onClose: () => void; t: Dict }) {
  const items = getMoreItems(t);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(27,23,18,0.35)', zIndex: 30, display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: T.bg, borderRadius: '22px 22px 0 0', padding: '18px 20px 28px' }}>
        <div style={{ width: 36, height: 4, borderRadius: 4, background: T.line, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 17, color: T.ink, marginBottom: 14 }}>{t.nav.moreTitle}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelect(m.id)}
              data-testid={`more-${m.id}`}
              style={{ border: `1px solid ${T.line}`, borderRadius: 16, padding: 14, cursor: 'pointer', background: T.surface }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <m.icon size={15} color={T.goldDeep} />
              </div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: T.ink }}>{m.label}</div>
              <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
