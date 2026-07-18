import { Bell } from 'lucide-react';
import { T } from '../theme';
import { Card } from '../components/primitives';
import { useLang } from '../lib/LangContext';

export function NotificacoesScreen() {
  const { t } = useLang();
  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 16 }}>{t.notificacoes.title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {t.notificacoes.items.map((n) => (
          <Card key={n.title} style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={14} color={T.goldDeep} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: T.ink }}>{n.title}</div>
              <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>{n.sub}</div>
            </div>
            <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted }}>{n.time}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
