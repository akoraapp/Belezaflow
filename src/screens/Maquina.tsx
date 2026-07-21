import { useState } from 'react';
import { Check, ChevronDown, Copy, Inbox, Loader2, Megaphone, Sparkles, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { T } from '../theme';
import { Card, FieldLabel, PrimaryButton } from '../components/primitives';
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
        borderRadius: 14,
        textAlign: 'center',
        cursor: 'pointer',
        border: `1.5px solid ${active ? T.gold : T.line}`,
        background: active ? T.goldSoft : T.surface,
        fontFamily: 'Manrope',
        fontWeight: 700,
        fontSize: 13,
        color: T.ink,
      }}
    >
      {active && <Check size={13} color={T.goldDeep} style={{ marginRight: 5, verticalAlign: -2 }} />}
      {label}
    </button>
  );
}

function FieldGroup({ label, options, value, onChange, testId }: { label: string; options: string[]; value: string; onChange: (v: string) => void; testId?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map((o, i) => (
          <GridOption key={o} label={o} active={value === o} onClick={() => onChange(o)} testId={testId ? `${testId}-${i}` : undefined} />
        ))}
      </div>
    </div>
  );
}

function EntryCard({
  icon: Icon,
  title,
  description,
  active,
  onClick,
  testId,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <Card
      onClick={onClick}
      testId={testId}
      style={{
        flex: 1,
        cursor: 'pointer',
        border: `1.5px solid ${active ? T.gold : T.line}`,
        background: active ? T.goldSoft : T.surface,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: active ? T.ink : T.goldSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Icon size={15} color={active ? T.goldLight : T.goldDeep} />
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 4 }}>{title}</div>
      <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{description}</div>
    </Card>
  );
}

function MiniSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 10.5, color: T.goldDeep, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.ink, lineHeight: 1.5 }}>{text}</div>
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
            borderRadius: 999,
            background: T.goldSoft,
            color: T.goldDeep,
            fontFamily: 'Manrope',
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
          <span style={{ fontFamily: 'Manrope', fontSize: 10.5, color: T.muted, textAlign: 'right' }}>
            {t.maquina.basedOnPrefix} {item.basedOn}
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, lineHeight: 1.5, marginBottom: expanded ? 14 : 12 }}>{expanded ? item.content.legenda : preview}</div>

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
            background: 'transparent',
            color: T.ink,
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 11.5,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 999,
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
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 11.5,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 999,
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
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 600, color: T.ink }}>{t.maquina.title}</div>
      </div>
      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, marginBottom: 18 }}>{t.maquina.subtitle}</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <EntryCard
          icon={Sparkles}
          title={t.maquina.modeAutoLabel}
          description={t.maquina.autoIntro}
          active={mode === 'auto'}
          onClick={() => setMode('auto')}
          testId="maquina-mode-auto"
        />
        <EntryCard
          icon={SlidersHorizontal}
          title={t.maquina.modeManualLabel}
          description={t.maquina.manualCardDesc}
          active={mode === 'manual'}
          onClick={() => setMode('manual')}
          testId="maquina-mode-manual"
        />
      </div>

      {mode === 'auto' ? (
        <PrimaryButton full onClick={generateAuto} disabled={loading} icon={loading ? Loader2 : Sparkles} testId="maquina-generate-auto">
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

      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 12 }}>{t.maquina.generatedSectionTitle}</div>

      {items.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', border: `1px dashed ${T.line}`, borderRadius: 16 }}>
          <Inbox size={22} color={T.muted} style={{ marginBottom: 10 }} />
          <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, lineHeight: 1.5 }}>{t.maquina.emptyStateText}</div>
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
