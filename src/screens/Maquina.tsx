import { useState } from 'react';
import { Check, ChevronDown, Copy, Inbox, Loader2, Megaphone, Sparkles } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { Card, PrimaryButton, SectionTitle } from '../components/primitives';
import { generateContent, type ContentResult } from '../lib/contentGenerator';
import { useLang } from '../lib/LangContext';

const OBJETIVOS = ['Atrair clientes', 'Preencher agenda', 'Reativar clientes', 'Autoridade', 'Quebra de objeção'];
const FORMATOS = ['Reel', 'Story', 'Carrossel', 'Post'];
const INTENSIDADES = ['Rápido', 'Estratégico', 'Agressivo'];

interface GeneratedItem {
  id: string;
  formato: string;
  basedOn: string | null;
  content: ContentResult;
}

function GridOption({ label, active, onClick, testId }: { label: string; active: boolean; onClick: () => void; testId?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      style={{
        padding: '16px 12px',
        borderRadius: RADIUS.control,
        textAlign: 'center',
        cursor: 'pointer',
        border: `1.5px solid ${active ? T.gold : T.line}`,
        background: T.surface,
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 13,
        color: T.ink,
      }}
    >
      {label}
    </button>
  );
}

function FieldGroup({ label, options, value, onChange, testId }: { label: string; options: string[]; value: string; onChange: (v: string) => void; testId?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <SectionTitle>{label}</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map((o, i) => (
          <GridOption key={o} label={o} active={value === o} onClick={() => onChange(o)} testId={testId ? `${testId}-${i}` : undefined} />
        ))}
      </div>
    </div>
  );
}

function MiniSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 10.5, color: T.goldDeep, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.ink, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}

function GeneratedCard({ item, testId }: { item: GeneratedItem; testId?: string }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const preview = item.content.legenda.length > 100 ? `${item.content.legenda.slice(0, 100)}…` : item.content.legenda;

  const copy = async () => {
    const full = `${item.content.legenda}\n\n${item.content.cta}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently ignore, button state simply won't confirm
    }
  };

  return (
    <Card testId={testId} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: RADIUS.pill,
            background: T.surface,
            border: `1px solid ${T.gold}`,
            color: T.goldDeep,
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 10.5,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            flexShrink: 0,
          }}
        >
          {item.formato}
        </span>
        {item.basedOn && (
          <span style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, textAlign: 'right' }}>
            {t.maquina.basedOnPrefix} {item.basedOn}
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.ink, lineHeight: 1.5, marginBottom: expanded ? 14 : 12 }}>{expanded ? item.content.legenda : preview}</div>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
          <MiniSection label={t.maquina.diagnosticoLabel} text={item.content.diagnostico} />
          <MiniSection label={t.maquina.estrategiaLabel} text={item.content.estrategia} />
          <MiniSection label={t.maquina.roteiroLabel} text={item.content.roteiro} />
          <MiniSection label={t.maquina.ctaLabel} text={item.content.cta} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setExpanded((v) => !v)}
          data-testid={testId ? `${testId}-toggle` : undefined}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            border: `1px solid ${T.line}`,
            background: T.surface,
            color: T.ink,
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 11.5,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: RADIUS.control,
          }}
        >
          {expanded ? t.maquina.viewLessCta : t.maquina.viewFullCta}
          <ChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
        </button>
        <button
          onClick={copy}
          data-testid={testId ? `${testId}-copy` : undefined}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            border: 'none',
            background: copied ? T.success : T.ink,
            color: '#fff',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 11.5,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: RADIUS.control,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? t.maquina.copiedCta : t.maquina.copyCta}
        </button>
      </div>
    </Card>
  );
}

interface MaquinaScreenProps {
  freeSlotsToday: number;
  lostClientsCount: number;
}

export function MaquinaScreen({ freeSlotsToday, lostClientsCount }: MaquinaScreenProps) {
  const { t, lang } = useLang();
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [objetivo, setObjetivo] = useState('Preencher agenda');
  const [formato, setFormato] = useState('Reel');
  const [intensidade, setIntensidade] = useState('Estratégico');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);

  const generate = async () => {
    setLoading(true);
    const content = await generateContent(lang, objetivo, formato, intensidade);
    setItems((prev) => [{ id: `c${Date.now()}`, formato, basedOn: null, content }, ...prev]);
    setLoading(false);
  };

  const generateAuto = async () => {
    let autoObjetivo = 'Atrair clientes';
    let signal = '';
    if (freeSlotsToday > 0) {
      autoObjetivo = 'Preencher agenda';
      signal = `${freeSlotsToday} ${t.agenda.slotsCountSuffix}`;
    } else if (lostClientsCount > 0) {
      autoObjetivo = 'Reativar clientes';
      signal = `${lostClientsCount} ${t.diagnostico.metricLostClients.toLowerCase()}`;
    } else {
      signal = t.maquina.autoIntro;
    }
    const autoFormato = 'Reel';
    const autoIntensidade = 'Estratégico';
    setObjetivo(autoObjetivo);
    setFormato(autoFormato);
    setIntensidade(autoIntensidade);
    setLoading(true);
    const content = await generateContent(lang, autoObjetivo, autoFormato, autoIntensidade);
    setItems((prev) => [{ id: `c${Date.now()}`, formato: autoFormato, basedOn: signal, content }, ...prev]);
    setLoading(false);
  };

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Megaphone size={20} color={T.goldDeep} />
        <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 400, color: T.ink }}>{t.maquina.title}</div>
      </div>
      <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, marginBottom: 18 }}>{t.maquina.subtitle}</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div
          onClick={() => setMode('auto')}
          data-testid="maquina-mode-auto"
          style={{
            flex: 1,
            cursor: 'pointer',
            borderRadius: RADIUS.card,
            padding: 18,
            background: T.ink,
            border: `1.5px solid ${mode === 'auto' ? T.gold : 'transparent'}`,
          }}
        >
          <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.gold, marginBottom: 8 }}>
            {t.maquina.modeAutoLabel}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.bg, lineHeight: 1.4 }}>{t.maquina.autoIntro}</div>
        </div>
        <div
          onClick={() => setMode('manual')}
          data-testid="maquina-mode-manual"
          style={{
            flex: 1,
            cursor: 'pointer',
            borderRadius: RADIUS.card,
            padding: 18,
            background: T.surface,
            border: `1.5px solid ${mode === 'manual' ? T.gold : T.line}`,
          }}
        >
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 6 }}>{t.maquina.modeManualLabel}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{t.maquina.manualCardDesc}</div>
        </div>
      </div>

      {mode === 'auto' ? (
        <PrimaryButton full variant="champagne" onClick={generateAuto} disabled={loading} icon={loading ? Loader2 : Sparkles} testId="maquina-generate-auto">
          {loading ? t.maquina.generatingCta : t.maquina.autoGenerateCta}
        </PrimaryButton>
      ) : (
        <Card>
          <FieldGroup label={t.maquina.objetivoLabel} options={OBJETIVOS} value={objetivo} onChange={setObjetivo} testId="maquina-objetivo" />
          <FieldGroup label={t.maquina.formatoLabel} options={FORMATOS} value={formato} onChange={setFormato} testId="maquina-formato" />
          <FieldGroup label={t.maquina.intensidadeLabel} options={INTENSIDADES} value={intensidade} onChange={setIntensidade} testId="maquina-intensidade" />
          <PrimaryButton full onClick={generate} disabled={loading} icon={loading ? Loader2 : undefined} testId="maquina-generate">
            {loading ? t.maquina.generatingCta : t.maquina.generateCta}
          </PrimaryButton>
        </Card>
      )}

      <div style={{ height: 30 }} />

      <SectionTitle>{t.maquina.generatedSectionTitle}</SectionTitle>

      {items.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', border: `1px dashed ${T.line}`, borderRadius: RADIUS.control }}>
          <Inbox size={22} color={T.muted} style={{ marginBottom: 10 }} />
          <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>{t.maquina.emptyStateText}</div>
        </div>
      ) : (
        <div>
          {items.map((item, i) => (
            <GeneratedCard key={item.id} item={item} testId={`maquina-result-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
