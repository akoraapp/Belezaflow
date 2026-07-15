import { useEffect, useRef, useState } from 'react';
import { sx } from '../lib/sx';
import type { Lang, Locale } from '../data/content';

interface ObjectiveDef {
  key: string;
  label: string;
}

interface ApproachDef {
  key: string;
  label: string;
  sub: string;
  tone: string;
}

const OBJECTIVES: Record<Lang, ObjectiveDef[]> = {
  pt: [
    { key: 'atrair', label: 'Atrair mais gente' },
    { key: 'vender', label: 'Vender mais' },
    { key: 'recuperar', label: 'Recuperar clientes sumidos' },
    { key: 'fidelizar', label: 'Fidelizar / pós-atendimento' },
  ],
  en: [
    { key: 'atrair', label: 'Attract more people' },
    { key: 'vender', label: 'Sell more' },
    { key: 'recuperar', label: 'Win back quiet clients' },
    { key: 'fidelizar', label: 'Build loyalty / follow-up' },
  ],
};

const APPROACHES: Record<Lang, ApproachDef[]> = {
  pt: [
    { key: 'educativo', label: 'Educativo', sub: 'Ensinar, explicar benefícios, criar autoridade', tone: 'educativo' },
    { key: 'desejo', label: 'Desejo', sub: 'Mostrar transformação e resultado', tone: 'de desejo' },
    { key: 'urgencia', label: 'Urgência e Escassez', sub: 'Preencher horários, prazo curto', tone: 'de urgência' },
    { key: 'prova_social', label: 'Prova Social', sub: 'Depoimentos, antes e depois', tone: 'de prova social' },
    { key: 'conexao', label: 'Conexão e Relacionamento', sub: 'Proximidade, humanizar', tone: 'próximo e pessoal' },
    { key: 'venda_direta', label: 'Venda Direta', sub: 'Oferta clara, conversão imediata', tone: 'direto ao ponto' },
    { key: 'autoridade', label: 'Autoridade', sub: 'Posicionamento como especialista', tone: 'de autoridade' },
  ],
  en: [
    { key: 'educativo', label: 'Educational', sub: 'Teach, explain benefits, build authority', tone: 'educational' },
    { key: 'desejo', label: 'Desire', sub: 'Show transformation and results', tone: 'desire-driven' },
    { key: 'urgencia', label: 'Urgency & Scarcity', sub: 'Fill slots, short deadline', tone: 'urgent' },
    { key: 'prova_social', label: 'Social Proof', sub: 'Testimonials, before & after', tone: 'social-proof driven' },
    { key: 'conexao', label: 'Connection & Relationship', sub: 'Build closeness, humanize', tone: 'personal and close' },
    { key: 'venda_direta', label: 'Direct Sale', sub: 'Clear offer, immediate conversion', tone: 'direct' },
    { key: 'autoridade', label: 'Authority', sub: 'Position yourself as a specialist', tone: 'authoritative' },
  ],
};

const OBJECTIVE_FOCUS: Record<Lang, Record<string, string>> = {
  pt: {
    atrair: 'atrair clientes que ainda não te conhecem',
    vender: 'vender um serviço ou pacote',
    recuperar: 'reativar clientes que não vêm há mais de 60 dias',
    fidelizar: 'fortalecer o relacionamento pós-atendimento',
  },
  en: {
    atrair: 'attracting clients who don’t know you yet',
    vender: 'selling a service or package',
    recuperar: 'winning back clients who haven’t visited in 60+ days',
    fidelizar: 'strengthening the post-visit relationship',
  },
};

interface GeneratedResult {
  reelScript: string;
  postCaption: string;
  storyStrategy: string;
}

interface HistoryEntry {
  objectiveKey: string;
  approachKey: string;
  result: GeneratedResult;
  timestamp: string;
}

function generateResult(lang: Lang, objectiveKey: string, approachKey: string): GeneratedResult {
  const approach = APPROACHES[lang].find((a) => a.key === approachKey)!;
  const focus = OBJECTIVE_FOCUS[lang][objectiveKey];
  if (lang === 'en') {
    return {
      reelScript: `Hook: a striking before/after moment.\nBody: show the process behind ${focus}, with a ${approach.tone} tone.\nClose: invite them to book — "${approach.label} works, come see for yourself."`,
      postCaption: `Content with a ${approach.tone} tone, focused on ${focus}. Talk about the care you provide and close by inviting the client to book.`,
      storyStrategy: `3-story sequence: behind-the-scenes, the result, then a direct "DM me to lock in yours" — all in a ${approach.tone} tone, aimed at ${focus}.`,
    };
  }
  return {
    reelScript: `Gancho: um momento forte de antes/depois.\nCorpo: mostre o processo focado em ${focus}, com tom ${approach.tone}.\nFechamento: convide para agendar — "${approach.label} funciona, venha conferir."`,
    postCaption: `Conteúdo em tom ${approach.tone}, com foco em ${focus}. Fale sobre o cuidado que você oferece e finalize convidando a cliente a agendar.`,
    storyStrategy: `Sequência de 3 stories: bastidor, resultado final e depois um "me chama no direct para garantir o seu" — tudo em tom ${approach.tone}, voltado para ${focus}.`,
  };
}

interface ClientMachineFlowProps {
  t: Locale;
  lang: Lang;
  presetObjective: string | null;
}

export function ClientMachineFlow({ t, lang, presetObjective }: ClientMachineFlowProps) {
  const TOOL = t.clientMachine.tool;
  const [step, setStep] = useState<'home' | 'approach' | 'result'>('home');
  const [objectiveKey, setObjectiveKey] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const lastConsumedPreset = useRef<string | null>(null);

  function generate(objKey: string, approachKey: string) {
    const generated = generateResult(lang, objKey, approachKey);
    const timestamp = new Date().toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    setObjectiveKey(objKey);
    setResult(generated);
    setStep('result');
    setHistory((h) => [{ objectiveKey: objKey, approachKey, result: generated, timestamp }, ...h].slice(0, 8));
  }

  useEffect(() => {
    if (presetObjective && presetObjective !== lastConsumedPreset.current) {
      lastConsumedPreset.current = presetObjective;
      const objKey = presetObjective.split('-')[0];
      setObjectiveKey(objKey);
      setStep('approach');
    }
  }, [presetObjective]);

  function goBackHome() {
    setStep('home');
    setObjectiveKey(null);
  }

  function selectObjective(key: string) {
    setObjectiveKey(key);
    setStep('approach');
  }

  function acceptSuggestion() {
    generate(TOOL.suggestedObjective, TOOL.suggestedApproach);
  }

  function createAnother() {
    setStep('home');
    setObjectiveKey(null);
    setResult(null);
  }

  function doCopy(field: string, text: string) {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 1600);
  }

  const objLabelMap: Record<string, string> = {};
  OBJECTIVES[lang].forEach((o) => (objLabelMap[o.key] = o.label));
  const appLabelMap: Record<string, string> = {};
  APPROACHES[lang].forEach((a) => (appLabelMap[a.key] = a.label));
  const currentObjectiveLabel = objectiveKey ? objLabelMap[objectiveKey] : '';
  const resultReel = result?.reelScript ?? '';
  const resultPost = result?.postCaption ?? '';
  const resultStory = result?.storyStrategy ?? '';

  return (
    <div style={sx('height:100%; display:flex; flex-direction:column; min-height:0;')}>
      {step === 'home' && (
        <>
          <div style={sx('padding:70px 24px 14px; box-sizing:border-box;')}>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600;")}>{TOOL.ui.title}</div>
            <div style={sx('font-size:13px; color:#8A8074; margin-top:4px;')}>{TOOL.ui.subtitle}</div>
          </div>

          <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:16px;')}>
            <div style={sx('background:#201C17; border-radius:18px; padding:18px; color:#F4E9D2; border:1px solid #C9A24B;')}>
              <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#C9A24B; margin-bottom:8px;')}>
                {TOOL.ui.suggestionLabel}
              </div>
              <div style={sx('font-size:14px; line-height:1.5; margin-bottom:14px;')}>{TOOL.suggestionText}</div>
              <div
                onClick={acceptSuggestion}
                style={sx(
                  'cursor:pointer; height:44px; border-radius:999px; background:#F4E9D2; color:#201C17; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700;',
                )}
              >
                {TOOL.ui.acceptSuggestionCta}
              </div>
            </div>

            <div>
              <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;')}>
                {TOOL.ui.objectiveLabel}
              </div>
              <div style={sx('display:grid; grid-template-columns:1fr 1fr; gap:10px;')}>
                {OBJECTIVES[lang].map((obj) => (
                  <div
                    key={obj.key}
                    onClick={() => selectObjective(obj.key)}
                    style={sx('cursor:pointer; background:#FFFFFF; border:1.5px solid #EBE2CF; border-radius:16px; padding:16px 12px; text-align:center;')}
                  >
                    <div style={sx('font-size:13px; font-weight:700; color:#26221D; line-height:1.35;')}>{obj.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={sx('font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; color:#8A8074; margin-bottom:10px;')}>
                {TOOL.ui.historyLabel}
              </div>
              {history.length > 0 ? (
                <div style={sx('display:flex; flex-direction:column; gap:8px;')}>
                  {history.map((h, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setObjectiveKey(h.objectiveKey);
                        setResult(h.result);
                        setStep('result');
                      }}
                      style={sx('cursor:pointer; background:#FFFFFF; border:1px solid #EBE2CF; border-radius:14px; padding:12px 14px;')}
                    >
                      <div style={sx('font-size:13px; font-weight:700;')}>
                        {objLabelMap[h.objectiveKey] || h.objectiveKey} · {appLabelMap[h.approachKey] || h.approachKey}
                      </div>
                      <div style={sx('font-size:11px; color:#8A8074; margin-top:2px;')}>{h.timestamp}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={sx('font-size:13px; color:#B0A78F;')}>{TOOL.ui.noHistory}</div>
              )}
            </div>
          </div>
        </>
      )}

      {step === 'approach' && (
        <>
          <div style={sx('padding:70px 24px 16px; box-sizing:border-box;')}>
            <div onClick={goBackHome} style={sx('cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#8A8074; font-weight:600; margin-bottom:14px;')}>
              ← {TOOL.ui.back}
            </div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; line-height:1.3;")}>{TOOL.ui.approachLabel}</div>
            <div style={sx('font-size:12px; color:#8A8074; margin-top:4px;')}>{currentObjectiveLabel}</div>
          </div>
          <div style={sx('flex:1; overflow:auto; padding:0 24px 24px; box-sizing:border-box; display:flex; flex-direction:column; gap:10px;')}>
            {APPROACHES[lang].map((ap) => (
              <div
                key={ap.key}
                onClick={() => objectiveKey && generate(objectiveKey, ap.key)}
                style={sx('cursor:pointer; background:#FFFFFF; border:1.5px solid #EBE2CF; border-radius:14px; padding:14px 18px;')}
              >
                <div style={sx('font-size:14px; font-weight:700;')}>{ap.label}</div>
                <div style={sx('font-size:12px; color:#8A8074; margin-top:3px;')}>{ap.sub}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'result' && (
        <>
          <div style={sx('padding:70px 24px 16px; box-sizing:border-box;')}>
            <div onClick={goBackHome} style={sx('cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#8A8074; font-weight:600; margin-bottom:14px;')}>
              ← {TOOL.ui.back}
            </div>
            <div style={sx("font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600;")}>{currentObjectiveLabel}</div>
            <div style={sx('font-size:12px; color:#8A8074; margin-top:4px;')}>{TOOL.ui.resultSubtitle}</div>
          </div>
          <div style={sx('flex:1; overflow:auto; padding:0 24px 20px; box-sizing:border-box; display:flex; flex-direction:column; gap:12px;')}>
            <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
              <div style={sx('font-size:11px; text-transform:uppercase; letter-spacing:0.6px; font-weight:700; color:#B98D3E; margin-bottom:8px;')}>
                {TOOL.ui.reelLabel}
              </div>
              <div style={sx('font-size:14px; line-height:1.55; white-space:pre-line;')}>{resultReel}</div>
              <div
                onClick={() => doCopy('reel', resultReel)}
                style={sx(
                  'cursor:pointer; margin-top:12px; display:inline-flex; padding:8px 16px; border-radius:999px; background:#201C17; color:#F4E9D2; font-size:12px; font-weight:700;',
                )}
              >
                {copiedField === 'reel' ? TOOL.ui.copied : TOOL.ui.copy}
              </div>
            </div>

            <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
              <div style={sx('font-size:11px; text-transform:uppercase; letter-spacing:0.6px; font-weight:700; color:#B98D3E; margin-bottom:8px;')}>
                {TOOL.ui.postLabel}
              </div>
              <div style={sx('font-size:14px; line-height:1.55;')}>{resultPost}</div>
              <div
                onClick={() => doCopy('post', resultPost)}
                style={sx(
                  'cursor:pointer; margin-top:12px; display:inline-flex; padding:8px 16px; border-radius:999px; background:#201C17; color:#F4E9D2; font-size:12px; font-weight:700;',
                )}
              >
                {copiedField === 'post' ? TOOL.ui.copied : TOOL.ui.copy}
              </div>
            </div>

            <div style={sx('background:#FFFFFF; border:1px solid #EBE2CF; border-radius:16px; padding:16px;')}>
              <div style={sx('font-size:11px; text-transform:uppercase; letter-spacing:0.6px; font-weight:700; color:#B98D3E; margin-bottom:8px;')}>
                {TOOL.ui.storyLabel}
              </div>
              <div style={sx('font-size:14px; line-height:1.55;')}>{resultStory}</div>
              <div
                onClick={() => doCopy('story', resultStory)}
                style={sx(
                  'cursor:pointer; margin-top:12px; display:inline-flex; padding:8px 16px; border-radius:999px; background:#201C17; color:#F4E9D2; font-size:12px; font-weight:700;',
                )}
              >
                {copiedField === 'story' ? TOOL.ui.copied : TOOL.ui.copy}
              </div>
            </div>
          </div>
          <div style={sx('padding:0 24px 18px; box-sizing:border-box;')}>
            <div
              onClick={createAnother}
              style={sx(
                'cursor:pointer; height:46px; border-radius:999px; border:1px solid #D8C79E; color:#8A6A2E; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700;',
              )}
            >
              {TOOL.ui.createAnother}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
