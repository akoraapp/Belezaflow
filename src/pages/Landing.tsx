import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Check,
  Clock,
  DollarSign,
  MessageCircle,
  MessageSquare,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useLang } from '../lib/LangContext';
import { format } from '../lib/helpers';
import { F, FUNNEL_FONT_IMPORT, FUNNEL_KEYFRAMES, FUNNEL_PRICING } from '../lib/funnelTheme';
import { LangSwitcher } from '../components/LangSwitcher';
import wordmark from '../assets/belezaflow-wordmark.png';
import appIcon from '../assets/belezaflow-app-icon.png';

const TOOL_ICONS = [Search, MessageSquare, Settings, Clock];
const FEATURE_ICONS = [Calendar, Sparkles, MessageCircle, DollarSign, Users];
const FLOAT_ANIMATIONS = ['bfFloatA 6s ease-in-out infinite', 'bfFloatB 7s ease-in-out infinite', 'bfFloatC 6.5s ease-in-out infinite', 'bfFloatB 6.8s ease-in-out infinite', 'bfFloatA 6s ease-in-out infinite'];
const FLOAT_POSITIONS = ['top:14%;left:12px;', 'top:8%;right:12px;', 'bottom:8%;right:12px;', 'top:55%;right:12px;', 'bottom:8%;left:12px;'];

function scrollToPricing() {
  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return <div style={{ fontSize: 13, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>{children}</div>;
}

export function LandingPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const isReturningUser = localStorage.getItem('belezaflow_returning_user') === '1';
  const l = t.landing;
  const pricing = FUNNEL_PRICING[lang];
  const [openFaq, setOpenFaq] = useState(-1);

  useEffect(() => {
    if (isReturningUser) navigate('/app', { replace: true });
  }, [isReturningUser, navigate]);

  const annualSavings = Math.max(0, pricing.monthlyPrice * 12 - pricing.annualTotalPrice);
  const perDay = (pricing.annualTotalPrice / 365).toFixed(2);
  const savingsText = format(l.savingsTemplate, { symbol: pricing.currencySymbol, n: annualSavings });
  const perDayText = format(l.perDayTemplate, { symbol: pricing.currencySymbol, n: perDay });

  if (isReturningUser) return null;

  return (
    <div style={{ background: F.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: F.ink, overflowX: 'hidden' }}>
      <style>{FUNNEL_FONT_IMPORT + FUNNEL_KEYFRAMES}</style>

      {/* Hero */}
      <div style={{ background: F.surface, padding: '32px 20px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {l.heroPreviewCards.map((card, i) => (
          <div
            key={i}
            className="bf-hero-float"
            style={{
              position: 'absolute',
              width: 88,
              padding: '10px 10px',
              background: F.surface,
              border: `1px solid ${F.lineSoft}`,
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              textAlign: 'left',
              opacity: 0.9,
              zIndex: 0,
              animation: FLOAT_ANIMATIONS[i],
              ...parseFloatPosition(FLOAT_POSITIONS[i]),
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, color: F.goldDeep, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{card.tag}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: F.ink, marginBottom: 3 }}>{card.title}</div>
            <div style={{ fontSize: 10, color: F.mutedLight }}>{card.desc}</div>
          </div>
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 480, margin: '0 auto 40px' }}>
            <img src={wordmark} alt="BelezaFlow" style={{ height: 22, width: 'auto', display: 'block' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LangSwitcher />
              <button onClick={scrollToPricing} style={btnDark}>
                {l.viewPlansCta}
              </button>
            </div>
          </div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 42, fontWeight: 800, color: F.ink, lineHeight: 1.15, margin: '0 auto 24px', maxWidth: 700, letterSpacing: -1 }}>{l.heroTitle}</h1>
          <p style={{ fontSize: 18, color: F.body, lineHeight: 1.6, margin: '0 auto 32px', maxWidth: 600 }}>
            {l.heroSubtitlePrefix} <strong style={{ color: F.goldDeep, fontWeight: 800 }}>{l.heroSubtitleHighlight}</strong> {l.heroSubtitleSuffix}
          </p>
          <button onClick={scrollToPricing} style={{ ...btnGold, width: '100%', maxWidth: 440, padding: '20px 20px', fontWeight: 800, animation: 'bfCtaPulse 2.4s ease-in-out infinite' }} data-testid="landing-hero-cta">
            {l.ctaLabel}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18 }}>
            <ShieldCheck size={20} color={F.gold} />
            <span style={{ fontSize: 13.5, color: F.muted, fontWeight: 600 }}>{l.guaranteeLabel}</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '56px 24px', background: F.ink, textAlign: 'center' }}>
        <Eyebrow color={F.gold}>{l.howItWorksEyebrow}</Eyebrow>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 800, color: '#FFFFFF', margin: '0 auto 16px', lineHeight: 1.2, maxWidth: 700 }}>{l.howItWorksTitle}</h2>
        <p style={{ fontSize: 16, color: F.mutedOnDark, margin: '0 auto 32px', lineHeight: 1.5, maxWidth: 600 }}>{l.howItWorksSubtitle}</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 700, margin: '0 auto' }}>
          {l.howItWorksSteps.map((step, i) => (
            <div key={i} style={{ width: '100%' }}>
              <div style={{ textAlign: 'left', background: 'transparent', border: `1.5px solid ${F.gold}`, borderRadius: 18, padding: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: F.gold, color: F.ink, fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{step.number}</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#FFFFFF', marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14.5, color: F.mutedOnDark, lineHeight: 1.55 }}>{step.desc}</div>
              </div>
              {i < l.howItWorksSteps.length - 1 && <div style={{ color: F.gold, fontSize: 20, padding: '14px 0' }}>↓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div style={{ padding: '56px 24px', background: F.toolsBg, textAlign: 'center' }}>
        <Eyebrow color={F.goldDeep}>{l.toolsEyebrow}</Eyebrow>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 800, color: F.ink, margin: '0 auto 32px', lineHeight: 1.2, maxWidth: 700 }}>{l.toolsTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto', textAlign: 'left' }}>
          {l.toolBoxes.map((tool, i) => {
            const Icon = TOOL_ICONS[i % TOOL_ICONS.length];
            return (
              <div key={i} style={{ background: F.surface, borderRadius: 18, padding: 28, border: `1px solid ${F.gold}` }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: F.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={19} color="#FFFFFF" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 19, color: F.ink, marginBottom: 10 }}>{tool.title}</div>
                <div style={{ fontSize: 14.5, color: '#6B6B6B', lineHeight: 1.6 }}>{tool.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diferencial */}
      <div style={{ padding: '56px 20px', background: F.inkSoft, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 800, color: '#FFFFFF', textAlign: 'center', margin: '0 auto 32px', maxWidth: 600, lineHeight: 1.25 }}>{l.diferencialTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto', textAlign: 'left' }}>
          <div style={{ background: '#1C1C1A', borderRadius: 20, padding: '26px 22px', textAlign: 'left' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: F.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <MessageCircle size={20} color={F.ink} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 19, color: '#FFFFFF', marginBottom: 10 }}>{l.secretaryTitle}</div>
            <div style={{ fontSize: 14, color: F.mutedOnDark, lineHeight: 1.55, marginBottom: 18 }}>{l.secretaryIntro}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {l.aiNotifications.map((notif, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: F.surface, borderRadius: 14, padding: '12px 14px' }}>
                  <div style={{ width: 38, height: 38, minWidth: 38, borderRadius: 10, overflow: 'hidden' }}>
                    <img src={appIcon} alt="BelezaFlow" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontWeight: 800, fontSize: 12.5, color: F.ink }}>BelezaFlow</span>
                      <span style={{ fontSize: 10.5, color: F.mutedLight }}>{notif.time}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#3C3C3E', lineHeight: 1.45 }}>{notif.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: F.gold, lineHeight: 1.5, marginTop: 18 }}>{l.secretaryClosing}</div>
          </div>

          <div style={{ background: '#1C1C1A', borderRadius: 20, padding: '26px 22px', textAlign: 'left' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: F.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
              <Play size={18} color={F.ink} fill={F.ink} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 19, color: '#FFFFFF', marginBottom: 10 }}>{l.contentMachineTitle}</div>
            <div style={{ fontSize: 14, color: F.mutedOnDark, lineHeight: 1.55, marginBottom: 18 }}>{l.contentMachineIntro}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Check size={14} color={F.gold} strokeWidth={3} />
                <span style={{ fontSize: 13.5, color: '#E4E1DA', lineHeight: 1.5 }}>{l.contentMachineBullet1}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Check size={14} color={F.gold} strokeWidth={3} />
                <span style={{ fontSize: 13.5, color: '#E4E1DA', lineHeight: 1.5 }}>{l.contentMachineBullet2}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: F.gold, lineHeight: 1.5 }}>{l.contentMachineClosing}</div>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: F.goldWarn, textAlign: 'center', margin: '28px auto 0', maxWidth: 440, lineHeight: 1.6 }}>
          {l.diferencialFootnotePrefix} <strong style={{ color: '#FFFFFF' }}>{l.diferencialFootnoteHighlight}</strong>
          {l.diferencialFootnoteSuffix}
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: '56px 24px', background: F.surface, textAlign: 'center' }}>
        <Eyebrow color={F.goldDeep}>{l.featuresEyebrow}</Eyebrow>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 800, color: F.ink, margin: '0 auto 32px', lineHeight: 1.2, maxWidth: 700 }}>{l.featuresTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto', textAlign: 'left' }}>
          {l.features.map((feat, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <div key={i} style={{ background: F.surface, border: `1px solid ${F.lineSoft}`, borderRadius: 18, padding: 26, boxShadow: '0 4px 18px rgba(0,0,0,0.05)', position: 'relative' }}>
                {feat.tag && (
                  <span style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 800, letterSpacing: 0.5, color: F.ink, background: F.gold, padding: '4px 10px', borderRadius: 999 }}>{feat.tag}</span>
                )}
                <div style={{ width: 46, height: 46, borderRadius: 12, background: F.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={20} color={F.ink} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, color: F.ink, marginBottom: 8 }}>{feat.title}</div>
                <div style={{ fontSize: 14, color: F.body, lineHeight: 1.6 }}>{feat.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '52px 24px', background: F.ink }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 800, color: '#FFFFFF', textAlign: 'center', margin: '0 0 32px 0' }}>{l.faqEyebrow}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700, margin: '0 auto' }}>
          {l.faqItems.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} onClick={() => setOpenFaq(isOpen ? -1 : i)} style={{ background: F.inkSoft, borderRadius: 14, padding: '18px 20px', cursor: 'pointer' }} data-testid={`landing-faq-${i}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: '#FFFFFF' }}>{faq.q}</div>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      minWidth: 26,
                      borderRadius: '50%',
                      background: F.gold,
                      color: F.ink,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.25s ease',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <Plus size={15} strokeWidth={3} />
                  </div>
                </div>
                {isOpen && <div style={{ fontSize: 13.5, color: F.mutedOnDark, lineHeight: 1.5, marginTop: 12 }}>{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: F.ink, padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 400, height: 1, background: `linear-gradient(90deg,transparent,${F.gold},transparent)` }} />
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ padding: '64px 24px 72px', background: F.inkDeep }}>
        <Eyebrow color={F.gold}>
          <span style={{ display: 'block', textAlign: 'center' }}>{l.pricingEyebrow}</span>
        </Eyebrow>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 800, color: '#FFFFFF', textAlign: 'center', margin: '0 0 10px 0' }}>{l.pricingTitle}</h2>
        <p style={{ fontSize: 15, color: F.mutedOnDark, textAlign: 'center', margin: '0 0 44px 0' }}>{l.pricingSubtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 760, margin: '0 auto', alignItems: 'start' }}>
          <div style={{ background: F.inkSoft, border: '1px solid #3C3C38', borderRadius: 22, padding: '32px 28px', boxShadow: '0 0 45px rgba(200,169,106,0.15)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: F.mutedOnDark, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>{l.monthlyLabel}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 38, fontWeight: 800, color: '#FFFFFF' }}>
                {pricing.currencySymbol} {pricing.monthlyPrice}
              </span>
              <span style={{ fontSize: 14, color: F.mutedOnDark }}>{l.perMonthLabel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
              <PlanBullet color="#E4E1DA" checkColor={F.gold}>
                {l.monthlyBullet1}
              </PlanBullet>
              <PlanBullet color="#E4E1DA" checkColor={F.gold}>
                {l.monthlyBullet2}
              </PlanBullet>
              <PlanBullet color="#E4E1DA" checkColor={F.gold}>
                {l.monthlyBullet3}
              </PlanBullet>
            </div>
            <Link to="/app?plan=monthly" style={{ textDecoration: 'none', display: 'block' }} data-testid="landing-subscribe-monthly">
              <button style={{ width: '100%', background: 'transparent', color: '#FFFFFF', fontWeight: 700, letterSpacing: 0.3, padding: '16px 20px', borderRadius: 14, border: `2px solid ${F.gold}`, fontSize: 14, textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                {l.subscribeMonthlyCta}
              </button>
            </Link>
          </div>

          <div style={{ background: F.surface, borderRadius: 22, padding: '32px 28px', position: 'relative', boxShadow: '0 0 70px rgba(200,169,106,0.45), 0 16px 40px rgba(0,0,0,0.35)', transform: 'scale(1.03)' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: F.gold, color: F.ink, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', padding: '6px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              {l.mostPopularLabel}
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: F.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14, marginTop: 6 }}>{l.annualLabel}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 38, fontWeight: 800, color: F.ink }}>
                {pricing.currencySymbol} {pricing.annualTotalPrice}
              </span>
              <span style={{ fontSize: 14, color: F.muted }}>{l.perYearLabel}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, marginTop: 14 }}>
              <PlanBullet color="#3C3C3E" checkColor={F.goldDeep}>
                {l.annualBullet1}
              </PlanBullet>
              <div style={{ background: F.toolsBg, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={14} color={F.goldDeep} strokeWidth={3} />
                <span style={{ fontSize: 15, color: '#8A5A2B', fontWeight: 800 }}>{savingsText}</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: F.goldDeep, fontStyle: 'italic', fontWeight: 600, marginBottom: 22 }}>{l.annualBestInvestment}</div>
            <Link to="/app?plan=annual" style={{ textDecoration: 'none', display: 'block' }} data-testid="landing-subscribe-annual">
              <button style={{ ...btnGold, padding: '16px 20px', fontSize: 14 }}>{l.subscribeAnnualCta}</button>
            </Link>
            <div style={{ textAlign: 'center', fontSize: 15, color: '#8A5A2B', fontWeight: 800, marginTop: 12 }}>{perDayText}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: F.mutedLight, background: '#EFEBE3' }}>{l.footerText}</div>
    </div>
  );
}

function PlanBullet({ children, color, checkColor }: { children: React.ReactNode; color: string; checkColor: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13.5, color, lineHeight: 1.4 }}>
      <Check size={14} color={checkColor} strokeWidth={3} />
      {children}
    </div>
  );
}

function parseFloatPosition(css: string): React.CSSProperties {
  const style: Record<string, string> = {};
  css
    .split(';')
    .filter(Boolean)
    .forEach((rule) => {
      const [prop, value] = rule.split(':');
      style[prop] = value;
    });
  return style as React.CSSProperties;
}

const btnDark: React.CSSProperties = {
  background: F.ink,
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: 13,
  padding: '10px 18px',
  borderRadius: 999,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};

const btnGold: React.CSSProperties = {
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
};
