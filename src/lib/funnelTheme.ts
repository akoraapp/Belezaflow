// Palette for the marketing funnel (landing page + quiz) only — kept separate
// from theme.ts because the source design uses richer dark sections (near-black
// panels, a warm cream tools band) that the rest of the app's screens don't use.
// Same family as theme.ts (cream/gold/near-black) so it still reads as BelezaFlow.
export const F = {
  bg: '#F7F5F2',
  surface: '#FFFFFF',
  toolsBg: '#F7F0E6',
  ink: '#1C1C1E',
  inkSoft: '#2B2B28',
  inkDeep: '#17171A',
  gold: '#C8A96A',
  goldDeep: '#B8965A',
  goldWarn: '#F5BA34',
  muted: '#79797B',
  mutedOnDark: '#B8B4AC',
  mutedLight: '#9C9C9E',
  body: '#5C5C5E',
  line: '#E4E1DA',
  lineSoft: '#EDE7DC',
  danger: '#D1453B',
  dangerSoft: '#F3E4E2',
  dangerGradient: 'linear-gradient(90deg,#E8756B,#D1453B)',
  warnBg: '#FBF8F1',
  warnBorder: '#E8DDC4',
};

export const FUNNEL_FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');`;

export const FUNNEL_KEYFRAMES = `
@keyframes bfFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bfCtaPulse { 0%, 100% { box-shadow: 0 8px 20px rgba(200,169,106,0.35); } 50% { box-shadow: 0 8px 30px rgba(200,169,106,0.65); } }
@keyframes bfFloatA { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-18px) rotate(-4deg); } }
@keyframes bfFloatB { 0%, 100% { transform: translateY(0) rotate(3deg); } 50% { transform: translateY(-14px) rotate(3deg); } }
@keyframes bfFloatC { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-22px) rotate(-2deg); } }
/* On narrow phones the floating decorative cards overlap the hero title
   (they're positioned relative to the full-width hero panel, not the text
   column) — hide them below the app's own mobile breakpoint. */
@media (max-width: 640px) {
  .bf-hero-float { display: none; }
}
`;

export interface FunnelPricing {
  currencySymbol: string;
  monthlyPrice: number;
  annualTotalPrice: number;
}

// pt = Brazil market (BRL), en/es = international (USD) — mirrors the source
// design's two separate pricing configs.
export const FUNNEL_PRICING: Record<'pt' | 'en' | 'es', FunnelPricing> = {
  pt: { currencySymbol: 'R$', monthlyPrice: 77, annualTotalPrice: 684 },
  en: { currencySymbol: '$', monthlyPrice: 47, annualTotalPrice: 397 },
  es: { currencySymbol: '$', monthlyPrice: 47, annualTotalPrice: 397 },
};
