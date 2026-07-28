import { useState } from 'react';
import { T } from '../theme';
import { AgendaScreen } from './Agenda';
import { AgendaOnlineScreen } from './AgendaOnline';
import { useLang } from '../lib/LangContext';

interface AgendaTabProps {
  onOpenServicos: () => void;
}

type SubTab = 'interna' | 'online';

export function AgendaTab({ onOpenServicos }: AgendaTabProps) {
  const { t } = useLang();
  const [subTab, setSubTab] = useState<SubTab>('interna');

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 25, fontWeight: 400, color: T.ink, marginBottom: 18 }}>{t.agenda.title}</div>

      <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.line}`, borderRadius: 999, padding: 4, gap: 4, marginBottom: 22, boxShadow: '0 2px 10px -6px rgba(32,28,23,0.1)' }}>
        {(
          [
            { id: 'interna' as const, label: t.agenda.subtabInterna },
            { id: 'online' as const, label: t.agenda.subtabOnline },
          ]
        ).map((v) => (
          <button
            key={v.id}
            onClick={() => setSubTab(v.id)}
            data-testid={`agenda-subtab-${v.id}`}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 999,
              border: 'none',
              background: subTab === v.id ? T.ink : 'transparent',
              color: subTab === v.id ? '#fff' : T.muted,
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {subTab === 'interna' ? <AgendaScreen embedded /> : <AgendaOnlineScreen embedded onOpenServicos={onOpenServicos} />}
    </div>
  );
}
