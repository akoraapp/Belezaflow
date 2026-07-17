import { useState } from 'react';
import { Loader2, Megaphone } from 'lucide-react';
import { T } from '../theme';
import { Card, Chip, FieldLabel, PrimaryButton } from '../components/primitives';
import { generateContent, type ContentResult } from '../lib/contentGenerator';

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

export function MaquinaScreen() {
  const [objetivo, setObjetivo] = useState('Preencher agenda');
  const [formato, setFormato] = useState('Reel');
  const [intensidade, setIntensidade] = useState('Estratégico');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const content = await generateContent(objetivo, formato, intensidade);
    setResult(content);
    setLoading(false);
  };

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Megaphone size={20} color={T.goldDeep} />
        <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink }}>Máquina de Conteúdo</div>
      </div>
      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: T.muted, marginBottom: 18 }}>Sua estrategista digital particular — conteúdo pensado para vender, não apenas postar.</div>

      <FieldGroup label="Objetivo" options={OBJETIVOS} value={objetivo} onChange={setObjetivo} />
      <FieldGroup label="Formato" options={FORMATOS} value={formato} onChange={setFormato} />
      <FieldGroup label="Intensidade" options={INTENSIDADES} value={intensidade} onChange={setIntensidade} />

      <div style={{ marginTop: 6 }}>
        <PrimaryButton full onClick={generate} disabled={loading} icon={loading ? Loader2 : undefined} testId="maquina-generate">
          {loading ? 'Gerando conteúdo...' : 'Gerar Conteúdo'}
        </PrimaryButton>
      </div>

      {result && (
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ResultCard label="Diagnóstico" text={result.diagnostico} />
          <ResultCard label="Estratégia" text={result.estrategia} />
          <ResultCard label="Roteiro" text={result.roteiro} />
          <ResultCard label="Legenda" text={result.legenda} />
          <ResultCard label="CTA" text={result.cta} accent />
        </div>
      )}
    </div>
  );
}
