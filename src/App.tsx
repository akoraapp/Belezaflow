import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { T, FONT_IMPORT } from './theme';
import type { Dict } from './i18n';
import belezaflowLogo from './assets/belezaflow-logo.webp';
import { getTabs, BottomNav } from './components/BottomNav';
import { getMoreItems, MoreSheet } from './components/MoreSheet';
import { InstallIOSPrompt } from './components/InstallIOSPrompt';
import { useLang } from './lib/LangContext';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useAlerts } from './hooks/useAlerts';
import { useInventory, productStatus } from './hooks/useInventory';
import { useIsMobile } from './hooks/useIsMobile';
import { useSubscriptionGate } from './hooks/useSubscriptionGate';
import { supabase } from './services/supabaseClient';
import { Login } from './screens/Login';
import { Onboarding } from './screens/Onboarding';
import { EscolherPlanoScreen } from './screens/EscolherPlano';
import { AguardandoPagamentoScreen } from './screens/AguardandoPagamento';
import { HojeScreen } from './screens/Hoje';
import { AgendaTab } from './screens/AgendaTab';
import { ClientesScreen } from './screens/Clientes';
import { FinanceiroScreen } from './screens/Financeiro';
import { DiagnosticoScreen } from './screens/Diagnostico';
import { MaquinaScreen } from './screens/Maquina';
import { ServicosScreen } from './screens/Servicos';
import { EstoqueScreen } from './screens/Estoque';
import { ConfigScreen } from './screens/Config';
import { NotificacoesScreen } from './screens/Notificacoes';

function deriveNameFromEmail(email: string) {
  const local = email.split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Profissional';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// The brand panel that fills the left column of the desktop auth layout —
// same light background as the form beside it (no color-blocking), just the
// logo, a thin gold divider, and the tagline, centered.
function AuthBrandPanel({ t }: { t: Dict }) {
  return (
    <div
      style={{
        flex: '0 0 50%',
        height: '100%',
        background: T.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '0 40px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img src={belezaflowLogo} alt="BelezaFlow" style={{ width: 260, height: 'auto' }} />
        <div style={{ width: 40, height: 2, background: T.gold, margin: '18px auto' }} />
        <div style={{ fontFamily: 'Inter', fontSize: 11.5, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: 700, color: T.muted }}>{t.login.brandTagline}</div>
      </div>
    </div>
  );
}

// Wraps Login/Onboarding/the initial loading state. On a real phone this
// renders full-bleed (no decorative frame), unchanged from before. On a wide
// screen it's a two-column layout — the brand panel on the left, the form on
// the right — filling the real window (100vw/100vh, no outer margins)
// instead of a small card floating alone. Which one shows is decided purely
// by the real viewport width (useIsMobile), never by a user-facing toggle.
function AuthShell({ children, isMobile, t }: { children: React.ReactNode; isMobile: boolean; t: Dict }) {
  if (isMobile) {
    return (
      <div className="app-fullbleed" style={{ background: T.bg, fontFamily: 'Inter', position: 'relative', overflow: 'hidden' }}>
        <style>{FONT_IMPORT}</style>
        {children}
      </div>
    );
  }
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', fontFamily: 'Inter', overflow: 'hidden' }}>
      <style>{FONT_IMPORT}</style>
      <AuthBrandPanel t={t} />
      <div style={{ flex: '1 1 auto', height: '100%', background: T.bg, overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: 440, height: '100%', margin: '0 auto' }}>{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppShell />
      <InstallIOSPrompt />
    </>
  );
}

// App.tsx owns exactly three things: authentication, the current profile
// (including onboarding), and navigation state. Every module's data (clients,
// appointments, services, finance, inventory, alerts) is fetched and mutated by
// its own hook, called directly inside the screen that needs it — nothing here
// holds business data or talks to Supabase.
function AppShell() {
  const { t, lang, setLang } = useLang();
  const { session } = useAuth();
  const { profile, loading: profileLoading, completeOnboarding } = useProfile();
  const { products } = useInventory();

  // A returning session may load on a different device/browser than the one
  // that completed onboarding — once the account's saved profile arrives,
  // it's the source of truth for which language to show, not localStorage
  // or the browser's locale guess.
  useEffect(() => {
    if (profile && profile.language !== lang) setLang(profile.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.language]);

  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const { subscription, loading: subscriptionLoading } = useSubscriptionGate(session?.user.id ?? null);
  const [organicPlanScreenDismissed, setOrganicPlanScreenDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState('hoje');
  const [showMore, setShowMore] = useState(false);
  const [moreScreen, setMoreScreen] = useState<string | null>(null);
  const [clientesFilter, setClientesFilter] = useState('Todos');
  const [clientesNonce, setClientesNonce] = useState(0);
  const [clientesInitialSelectedId, setClientesInitialSelectedId] = useState<string | null>(null);

  const openMore = (id: string) => {
    setMoreScreen(id);
    setShowMore(false);
  };
  const selectTab = (id: string) => {
    setActiveTab(id);
    setMoreScreen(null);
  };
  const tabs = getTabs(t);
  const moreItems = getMoreItems(t);
  const goTo = (id: string) => (tabs.some((tb) => tb.id === id) ? selectTab(id) : openMore(id));

  const openClientesWithFilter = (filterValue: string, selectClientId: string | null = null) => {
    setClientesFilter(filterValue);
    setClientesInitialSelectedId(selectClientId);
    setClientesNonce((n) => n + 1);
    selectTab('clientes');
  };

  const { alerts, alertTimestamps, notifPermission, requestNotifPermission } = useAlerts(
    {
      onOpenAgenda: () => selectTab('agenda'),
      onOpenEstoque: () => openMore('estoque'),
      onOpenClientesFiltered: openClientesWithFilter,
    },
    profile?.currency || 'BRL',
  );

  if (session === undefined || (session && profileLoading && !profile)) {
    return (
      <AuthShell isMobile={isMobile} t={t}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted }}>…</div>
        </div>
      </AuthShell>
    );
  }

  if (!session) {
    return (
      <AuthShell isMobile={isMobile} t={t}>
        <Login isMobile={isMobile} />
      </AuthShell>
    );
  }

  if (!profile) {
    return (
      <AuthShell isMobile={isMobile} t={t}>
        <Onboarding initialName={deriveNameFromEmail(session.user.email || '')} onComplete={completeOnboarding} />
      </AuthShell>
    );
  }

  if (subscriptionLoading || !subscription) {
    return (
      <AuthShell isMobile={isMobile} t={t}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted }}>…</div>
        </div>
      </AuthShell>
    );
  }

  const startCheckout = async (plan: 'monthly' | 'annual') => {
    const { data, error } = await supabase.functions.invoke('create-subscription', { body: { plan } });
    if (error || !data?.init_point) throw error ?? new Error('create-subscription did not return an init_point');
    window.location.href = data.init_point;
  };

  // A "plan" deep link from the landing page pricing section (see src/pages/Landing.tsx,
  // /app?plan=monthly|annual) means the visitor already chose a plan before logging in —
  // real payment is required here, never a local dismiss: unlock only once the
  // subscription is genuinely active, show a polling wait screen while Mercado
  // Pago's webhook is still catching up, and never offer a skip.
  const planParam = searchParams.get('plan');
  const requestedPlan = planParam === 'monthly' || planParam === 'annual' ? planParam : null;
  if (requestedPlan && subscription.status !== 'active') {
    if (subscription.status === 'pending_payment') {
      return (
        <AuthShell isMobile={isMobile} t={t}>
          <AguardandoPagamentoScreen />
        </AuthShell>
      );
    }
    return (
      <AuthShell isMobile={isMobile} t={t}>
        <EscolherPlanoScreen initialPlan={requestedPlan} onContinue={startCheckout} onSkip={null} />
      </AuthShell>
    );
  }

  // Organic signup (no ?plan= link): free access during the trial, same as
  // today. Once trial_ends_at passes, send to plan selection too — but this
  // path can still be dismissed locally, since it's a soft nudge rather than
  // a purchase already in progress.
  const trialExpired = subscription.status === 'trialing' && !!subscription.trialEndsAt && new Date(subscription.trialEndsAt).getTime() < Date.now();
  if (!requestedPlan && trialExpired && !organicPlanScreenDismissed) {
    return (
      <AuthShell isMobile={isMobile} t={t}>
        <EscolherPlanoScreen initialPlan="monthly" onContinue={startCheckout} onSkip={() => setOrganicPlanScreenDismissed(true)} />
      </AuthShell>
    );
  }

  const lowStockCount = products.filter((p) => productStatus(p) !== 'ok').length;

  const screenContent = (
    <>
      {moreScreen === 'maquina' && <MaquinaScreen />}
      {moreScreen === 'ia' && <DiagnosticoScreen onOpenConteudo={() => openMore('maquina')} onOpenClientes={() => selectTab('clientes')} />}
      {moreScreen === 'estoque' && <EstoqueScreen />}
      {moreScreen === 'notificacoes' && (
        <NotificacoesScreen alerts={alerts} timestamps={alertTimestamps} permission={notifPermission} onRequestPermission={requestNotifPermission} />
      )}
      {moreScreen === 'config' && (
        <ConfigScreen onOpenServicos={() => setMoreScreen('servicos')} notifPermission={notifPermission} onRequestNotifPermission={requestNotifPermission} />
      )}
      {moreScreen === 'servicos' && <ServicosScreen onBack={() => setMoreScreen(null)} />}

      {!moreScreen && activeTab === 'hoje' && (
        <HojeScreen
          alerts={alerts}
          onOpenConteudo={() => openMore('maquina')}
          onOpenAgenda={() => selectTab('agenda')}
          onOpenFinanceiro={() => selectTab('financeiro')}
          onOpenClientes={() => selectTab('clientes')}
        />
      )}
      {!moreScreen && activeTab === 'agenda' && <AgendaTab onOpenServicos={() => setMoreScreen('servicos')} />}
      {!moreScreen && activeTab === 'clientes' && (
        <ClientesScreen key={clientesNonce} initialFilter={clientesFilter} initialSelectedId={clientesInitialSelectedId} />
      )}
      {!moreScreen && activeTab === 'financeiro' && <FinanceiroScreen />}
    </>
  );

  if (!isMobile) {
    const navItems = [...tabs, ...moreItems];
    return (
      // Fills the real browser window like an ordinary dashboard/site — no
      // outer card, no fixed max width. Only the sidebar has a fixed width;
      // the content pane flexes to whatever room is left and scrolls on its
      // own real height (100vh, not a fixed pixel guess).
      <div style={{ width: '100%', height: '100vh', background: T.surfaceAlt, fontFamily: 'Inter', display: 'flex', overflow: 'hidden' }}>
        <style>{FONT_IMPORT}</style>
        <div
          style={{
            width: 230,
            flexShrink: 0,
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
            background: T.surface,
            borderRight: `1px solid ${T.line}`,
            padding: '26px 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontFamily: 'Playfair Display', fontSize: 19, color: T.ink, padding: '0 10px 22px', fontWeight: 600 }}>
            Beleza<span style={{ color: T.goldDeep }}>Flow</span>
          </div>
          <div style={{ padding: '0 10px 14px', fontFamily: 'Inter', fontSize: 12, color: T.muted }}>
            {t.nav.greetingLoggedAs}, {profile.name} 👋
          </div>
          {navItems.map((item) => {
            const isActive = moreScreen ? moreScreen === item.id : activeTab === item.id;
            const badge = item.id === 'estoque' ? (lowStockCount > 0 ? lowStockCount : null) : item.id === 'notificacoes' ? (alerts.length > 0 ? alerts.length : null) : null;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? T.goldSoft : 'transparent',
                  color: isActive ? T.goldDeep : T.ink,
                  fontFamily: 'Inter',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  marginBottom: 3,
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <item.icon size={16} />
                {item.label}
                {badge && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: '#fff',
                      background: T.danger,
                      borderRadius: 999,
                      padding: '1px 6px',
                    }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>{screenContent}</div>
        </div>
      </div>
    );
  }

  // Real phone viewport: no decorative frame, fills the actual screen edge to
  // edge (see .app-fullbleed in index.css for the dvh/vh fallback).
  return (
    <div className="app-fullbleed" style={{ background: T.bg, fontFamily: 'Inter', position: 'relative', overflow: 'hidden' }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
        <div style={{ paddingTop: moreScreen && moreScreen !== 'servicos' ? 'max(34px, calc(env(safe-area-inset-top) + 12px))' : 0 }}>{screenContent}</div>
      </div>

      {moreScreen && moreScreen !== 'servicos' && (
        <button
          onClick={() => setMoreScreen(null)}
          style={{
            position: 'absolute',
            top: 'max(18px, calc(env(safe-area-inset-top) + 8px))',
            left: 16,
            zIndex: 25,
            width: 32,
            height: 32,
            borderRadius: 10,
            border: `1px solid ${T.line}`,
            background: T.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={16} color={T.ink} />
        </button>
      )}

      <BottomNav active={activeTab} onSelect={selectTab} onMore={() => setShowMore(true)} moreActive={!!moreScreen} t={t} />
      {showMore && <MoreSheet onSelect={openMore} onClose={() => setShowMore(false)} t={t} />}
    </div>
  );
}
