import { BellRing } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { Card, EmptyHint, PrimaryButton } from '../components/primitives';
import { relativeTimeLabel } from '../lib/helpers';
import { useLang } from '../lib/LangContext';
import type { AlertItem } from '../lib/alerts';
import type { NotifPermission } from '../lib/notifications';

interface NotificacoesScreenProps {
  alerts: AlertItem[];
  timestamps: Record<string, number>;
  permission: NotifPermission;
  onRequestPermission: () => void;
}

export function NotificacoesScreen({ alerts, timestamps, permission, onRequestPermission }: NotificacoesScreenProps) {
  const { t, lang } = useLang();

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 400, color: T.ink, marginBottom: 16 }}>{t.notificacoes.title}</div>

      {permission === 'default' && (
        <Card style={{ marginBottom: 16, border: `1.5px solid ${T.gold}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
            <BellRing size={18} color={T.goldDeep} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: T.ink, lineHeight: 1.45 }}>{t.notificacoes.permissionBannerTitle}</div>
          </div>
          <PrimaryButton full onClick={onRequestPermission} testId="notif-request-permission">
            {t.notificacoes.permissionBannerCta}
          </PrimaryButton>
        </Card>
      )}

      {permission === 'denied' && (
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.danger, marginBottom: 16, lineHeight: 1.5 }}>{t.notificacoes.permissionDenied}</div>
      )}

      {permission === 'granted' && (
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.success, marginBottom: 16 }}>{t.notificacoes.permissionGranted}</div>
      )}

      {permission === 'unsupported' && (
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 16 }}>{t.notificacoes.permissionUnsupported}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.length === 0 && <EmptyHint text={t.notificacoes.emptyState} />}
        {alerts.map((a) => (
          <Card key={a.key} style={{ display: 'flex', gap: 12 }} testId={`notificacao-${a.key}`}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <a.icon size={14} color={T.goldDeep} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: T.ink, lineHeight: 1.4 }}>{a.title}</div>
              {a.ctaLabel && a.onCta && (
                <button
                  onClick={a.onCta}
                  style={{
                    marginTop: 8,
                    border: 'none',
                    background: T.goldDeep,
                    color: '#fff',
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: 11.5,
                    cursor: 'pointer',
                    padding: '7px 12px',
                    borderRadius: RADIUS.control,
                  }}
                >
                  {a.ctaLabel}
                </button>
              )}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, whiteSpace: 'nowrap' }}>
              {timestamps[a.key] ? relativeTimeLabel(timestamps[a.key], lang) : ''}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
