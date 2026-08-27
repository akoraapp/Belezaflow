import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../lib/LangContext';
import { format } from '../lib/helpers';
import { F, FUNNEL_FONT_IMPORT, FUNNEL_KEYFRAMES } from '../lib/funnelTheme';
import { LangSwitcher } from '../components/LangSwitcher';
import wordmark from '../assets/belezaflow-wordmark.png';

type Screen = 'quiz' | 'analyzing' | 'diagnosis';

const RISK_PERCENTAGE = 78;
const MARKETING_BLOCK_IDX = 3;
const INSTAGRAM_FREEZE_IDX = 0;
const PAPER_IDX = 0;
const NEVER_REACTIVATE_IDX = 0;

export function QuizPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const q = t.quiz;

  const [screen, setScreen] = useState<Screen>('quiz');
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [riskBarWidth, setRiskBarWidth] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const selectAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setTimeout(() => {
      setAnswers((prev) => [...prev, index]);
      const nextStep = quizStep + 1;
      if (nextStep >= q.questions.length) {
        setScreen('analyzing');
        setAnalyzeProgress(0);
        startAnalysis();
      } else {
        setQuizStep(nextStep);
      }
      setSelectedOption(null);
    }, 420);
  };

  const startAnalysis = () => {
    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress = Math.min(100, progress + 4);
      setAnalyzeProgress(progress);
      if (progress >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setScreen('diagnosis');
          setRiskBarWidth(0);
          setTimeout(() => setRiskBarWidth(RISK_PERCENTAGE), 150);
        }, 400);
      }
    }, 90);
  };

  const current = q.questions[quizStep];

  const dynamicCards = [];
  if (answers[0] === MARKETING_BLOCK_IDX || answers[3] === INSTAGRAM_FREEZE_IDX) dynamicCards.push(q.alertCardMarketing);
  if (answers[1] === PAPER_IDX) dynamicCards.push(q.alertCardPaper);
  if (answers[2] === NEVER_REACTIVATE_IDX) dynamicCards.push(q.alertCardReactivation);
  if (dynamicCards.length === 0) dynamicCards.push(q.fallbackCard);

  const p1Text = q.questions[0].options[answers[0]] ?? '';
  const conclusionText = p1Text ? `${q.conclusionPrefix}${p1Text}.` : '';

  return (
    <div style={{ background: F.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: F.ink }}>
      <style>{FUNNEL_FONT_IMPORT + FUNNEL_KEYFRAMES}</style>

      {screen === 'quiz' && (
        <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 24px 40px', animation: 'bfFadeIn 0.5s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <img src={wordmark} alt="BelezaFlow" style={{ height: 22, width: 'auto', display: 'block' }} />
            <LangSwitcher />
          </div>
          <div style={{ height: 6, background: F.line, borderRadius: 999, overflow: 'hidden', marginBottom: 40 }}>
            <div style={{ height: '100%', background: F.gold, borderRadius: 999, transition: 'width 0.4s ease', width: `${(quizStep / q.questions.length) * 100}%` }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: F.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            {format(q.questionLabelTemplate, { n: quizStep + 1, t: q.questions.length })}
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: F.ink, margin: '0 0 28px 0', lineHeight: 1.35 }}>{current.text}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {current.options.map((opt, i) => {
              const selected = selectedOption === i;
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  disabled={selectedOption !== null}
                  data-testid={`quiz-option-${i}`}
                  style={{
                    padding: '18px 20px',
                    background: selected ? F.gold : F.surface,
                    border: `2px solid ${selected ? F.gold : F.line}`,
                    borderRadius: 16,
                    fontSize: 16,
                    fontWeight: selected ? 700 : 600,
                    color: F.ink,
                    textAlign: 'left',
                    cursor: selectedOption !== null ? 'default' : 'pointer',
                    transition: 'all 0.25s ease',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: selected ? '0 8px 20px rgba(200,169,106,0.35)' : 'none',
                    transform: selected ? 'scale(0.98)' : 'none',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {screen === 'analyzing' && (
        <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, animation: 'bfFadeIn 0.5s ease', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: F.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 24 }}>{q.analyzingLabel}</div>
          <div style={{ width: '100%', height: 10, background: F.line, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ height: '100%', background: F.gold, width: `${analyzeProgress}%`, transition: 'width 0.15s linear', borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 14, color: F.muted, fontWeight: 600 }}>{analyzeProgress}%</div>
        </div>
      )}

      {screen === 'diagnosis' && (
        <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '80vh', padding: '24px 24px 48px', animation: 'bfFadeIn 0.5s ease' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: F.danger, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14, textAlign: 'center' }}>{q.diagnosisCompleteLabel}</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 800, color: F.danger, textAlign: 'center', margin: '0 0 32px 0', lineHeight: 1.25 }}>{q.alertTitle}</h1>

          <div style={{ background: F.surface, borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: F.ink }}>{q.riskLabel}</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: F.danger }}>{RISK_PERCENTAGE}%</span>
            </div>
            <div style={{ height: 14, background: F.dangerSoft, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${riskBarWidth}%`, background: F.dangerGradient, borderRadius: 999, transition: 'width 1.2s ease' }} />
            </div>
          </div>

          {dynamicCards.map((card, i) => (
            <div key={i} style={{ background: F.surface, borderRadius: 16, padding: '18px 20px', marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 9, height: 9, minWidth: 9, borderRadius: '50%', background: F.danger, marginTop: 6 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: F.ink, marginBottom: 4 }}>{card.title}</div>
                <div style={{ fontSize: 13.5, color: F.body, lineHeight: 1.5 }}>{card.desc}</div>
              </div>
            </div>
          ))}

          {conclusionText && (
            <div style={{ fontSize: 14, color: F.ink, fontWeight: 600, lineHeight: 1.5, marginTop: 18, padding: '16px 18px', background: F.warnBg, borderRadius: 14, border: `1px solid ${F.warnBorder}` }}>{conclusionText}</div>
          )}

          <button
            onClick={() => navigate('/')}
            data-testid="quiz-see-solution"
            style={{
              width: '100%',
              marginTop: 20,
              background: F.gold,
              color: F.ink,
              fontWeight: 700,
              letterSpacing: 0.3,
              padding: '18px 20px',
              borderRadius: 14,
              border: 'none',
              fontSize: 15,
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(200,169,106,0.35)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {q.seeSolutionCta}
          </button>
        </div>
      )}
    </div>
  );
}
