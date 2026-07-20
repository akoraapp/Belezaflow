import { useState } from 'react';
import { Loader2, Megaphone, Sparkles } from 'lucide-react';
import { T } from '../theme';
import { Card, Chip, FieldLabel, PrimaryButton } from '../components/primitives';
import { generateContent, type ContentResult } from '../lib/contentGenerator';
import { useLang } from '../lib/LangContext';

const OBJETIVOS = ['Atrair clientes', 'Preencher agenda', 'Reativar clientes', 'Autoridade', 'Quebra de objeção'];
const FORMATOS = ['Reel', 'Story', 'Carrossel', 'Post'];
const INTENSIDADES = ['Rápido', 'Estratégico', 'Agressivo'];

function FieldGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <Card style={accent ? { background: T.goldSoft, borderColor: T.gold } : {}}>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11.5, color: T.goldDeep, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{text}</div>
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
  const [result, setResult] = useState<ContentResult | null>(null);
  const [basedOn, setBasedOn] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const content = await generateContent(lang, objetivo, formato, intensidade);
    setResult(content);
    setBasedOn(null);
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
    setResult(null);
    const content = await generateContent(lang, autoObjetivo, autoFormato, autoIntensidade);
    setResult(content);
    setBasedOn(signal);
    setLoading(false);
  };

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Megaphone size={20} color={T.goldDeep} />
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 600, color: T.ink }}>{t.maquina.title}</div>
      </div>
      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, marginBottom: 18 }}>{t.maquina.subtitle}</div>

      <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.line}`, borderRadius: 999, padding: 4, gap: 4, marginBottom: 18 }}>
        <button
          onClick={() => setMode('auto')}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 999,
            border: 'none',
            background: mode === 'auto' ? T.ink : 'transparent',
            color: mode === 'auto' ? '#fff' : T.muted,
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          {t.maquina.modeAutoLabel}
        </button>
        <button
          onClick={() => setMode('manual')}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 999,
            border: 'none',
            background: mode === 'manual' ? T.ink : 'transparent',
            color: mode === 'manual' ? '#fff' : T.muted,
            fontFamily: 'Manrope',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          {t.maquina.modeManualLabel}
        </button>
      </div>

      {mode === 'auto' ? (
        <>
          <Card style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Sparkles size={18} color={T.goldDeep} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontFamily: 'Manrope', fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{t.maquina.autoIntro}</div>
          </Card>
          <PrimaryButton full onClick={generateAuto} disabled={loading} icon={loading ? Loader2 : Sparkles} testId="maquina-generate-auto">
            {loading ? t.maquina.generatingCta : t.maquina.autoGenerateCta}
          </PrimaryButton>
        </>
      ) : (
        <>
          <FieldGroup label={t.maquina.objetivoLabel} options={OBJETIVOS} value={objetivo} onChange={setObjetivo} />
          <FieldGroup label={t.maquina.formatoLabel} options={FORMATOS} value={formato} onChange={setFormato} />
          <FieldGroup label={t.maquina.intensidadeLabel} options={INTENSIDADES} value={intensidade} onChange={setIntensidade} />
          <PrimaryButton full onClick={generate} disabled={loading} icon={loading ? Loader2 : undefined} testId="maquina-generate">
            {loading ? t.maquina.generatingCta : t.maquina.generateCta}
          </PrimaryButton>
        </>
      )}

      {result && (
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {basedOn && (
            <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>
              {t.maquina.basedOnPrefix} {basedOn}
            </div>
          )}
          <ResultCard label={t.maquina.diagnosticoLabel} text={result.diagnostico} />
          <ResultCard label={t.maquina.estrategiaLabel} text={result.estrategia} />
          <ResultCard label={t.maquina.roteiroLabel} text={result.roteiro} />
          <ResultCard label={t.maquina.legendaLabel} text={result.legenda} />
          <ResultCard label={t.maquina.ctaLabel} text={result.cta} accent />
        </div>
      )}
    </div>
  );
}
