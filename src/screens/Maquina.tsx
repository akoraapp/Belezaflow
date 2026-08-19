import { useState } from 'react';
import { Check, ChevronDown, Copy, Inbox, Loader2 } from 'lucide-react';
import { T, RADIUS } from '../theme';
import { Card, PrimaryButton, SectionTitle, SelectInput } from '../components/primitives';
import { generateContent, type ContentResult } from '../lib/contentGenerator';
import { getAvailability } from '../lib/helpers';
import { useLang } from '../lib/LangContext';
import { useProfile } from '../hooks/useProfile';
import { useAppointments } from '../hooks/useAppointments';
import { useClients } from '../hooks/useClients';

const OBJETIVOS = ['Atrair clientes', 'Preencher agenda', 'Reativar clientes', 'Autoridade', 'Quebra de objeção'];
const FORMATOS = ['Reel', 'Story', 'Carrossel', 'Post'];
const INTENSIDADES = ['Rápido', 'Estratégico', 'Agressivo'];

// These values are the lookup keys src/lib/contentGenerator.ts uses internally,
// so they stay fixed in Portuguese regardless of the app's language — only the
// label shown in the select is translated, via these maps into i18n's
// maquina.*Options dictionaries (see SelectGroup's labelFor below).
const OBJETIVO_I18N_KEY: Record<string, string> = {
  'Atrair clientes': 'atrairClientes',
  'Preencher agenda': 'preencherAgenda',
  'Reativar clientes': 'reativarClientes',
  Autoridade: 'autoridade',
  'Quebra de objeção': 'quebraObjecao',
};
const FORMATO_I18N_KEY: Record<string, string> = { Reel: 'reel', Story: 'story', Carrossel: 'carrossel', Post: 'post' };
const INTENSIDADE_I18N_KEY: Record<string, string> = { Rápido: 'rapido', Estratégico: 'estrategico', Agressivo: 'agressivo' };

interface GeneratedItem {
  id: string;
  formato: string;
  basedOn: string | null;
  content: ContentResult;
}

function SelectGroup({
  label,
  options,
  value,
  onChange,
  testId,
  labelFor,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  testId?: string;
  labelFor?: (v: string) => string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <SectionTitle>{label}</SectionTitle>
      <SelectInput options={options} value={value} onChange={onChange} testId={testId} labelFor={labelFor} />
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

export function MaquinaScreen() {
  const { t, lang } = useLang();
  const { profile } = useProfile();
  const { appointments } = useAppointments();
  const { clients } = useClients();
  const [objetivo, setObjetivo] = useState('Preencher agenda');
  const [formato, setFormato] = useState('Reel');
  const [intensidade, setIntensidade] = useState('Estratégico');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const freeSlotsToday = profile ? getAvailability(profile, appointments).availableSlots.length : 0;
  const lostClientsCount = clients.filter((c) => c.status === 'Perdido').length;

  const objetivoOptions = t.maquina.objetivoOptions as Record<string, string>;
  const formatoOptions = t.maquina.formatoOptions as Record<string, string>;
  const intensidadeOptions = t.maquina.intensidadeOptions as Record<string, string>;
  const objetivoLabelFor = (v: string) => objetivoOptions[OBJETIVO_I18N_KEY[v]] ?? v;
  const formatoLabelFor = (v: string) => formatoOptions[FORMATO_I18N_KEY[v]] ?? v;
  const intensidadeLabelFor = (v: string) => intensidadeOptions[INTENSIDADE_I18N_KEY[v]] ?? v;

  const generate = async () => {
    setLoading(true);
    const content = await generateContent(lang, objetivo, formato, intensidade, profile?.profession);
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
    const content = await generateContent(lang, autoObjetivo, autoFormato, autoIntensidade, profile?.profession);
    setItems((prev) => [{ id: `c${Date.now()}`, formato: autoFormato, basedOn: signal, content }, ...prev]);
    setLoading(false);
  };

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 24, fontWeight: 400, color: T.ink, marginBottom: 4 }}>{t.maquina.title}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 12.5, color: T.muted, marginBottom: 18 }}>{t.maquina.subtitle}</div>

      <div style={{ borderRadius: RADIUS.card, padding: 20, background: T.ink, marginBottom: 26 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.gold, marginBottom: 8 }}>
          {t.maquina.modeAutoLabel}
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.bg, lineHeight: 1.5, marginBottom: 16 }}>{t.maquina.autoIntro}</div>
        <PrimaryButton full variant="champagne" onClick={generateAuto} disabled={loading} icon={loading ? Loader2 : undefined} testId="maquina-generate-auto">
          {loading ? t.maquina.generatingCta : t.maquina.autoGenerateCta}
        </PrimaryButton>
      </div>

      <SelectGroup label={t.maquina.objetivoLabel} options={OBJETIVOS} value={objetivo} onChange={setObjetivo} testId="maquina-objetivo" labelFor={objetivoLabelFor} />
      <SelectGroup label={t.maquina.formatoLabel} options={FORMATOS} value={formato} onChange={setFormato} testId="maquina-formato" labelFor={formatoLabelFor} />
      <SelectGroup
        label={t.maquina.intensidadeLabel}
        options={INTENSIDADES}
        value={intensidade}
        onChange={setIntensidade}
        testId="maquina-intensidade"
        labelFor={intensidadeLabelFor}
      />
      <div style={{ marginBottom: 26 }}>
        <PrimaryButton full onClick={generate} disabled={loading} icon={loading ? Loader2 : undefined} testId="maquina-generate">
          {loading ? t.maquina.generatingCta : t.maquina.generateCta}
        </PrimaryButton>
      </div>

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
