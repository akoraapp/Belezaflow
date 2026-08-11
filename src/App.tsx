import { useEffect, useState } from 'react';
import { ChevronLeft, Grid3x3, Home } from 'lucide-react';
import { T, FONT_IMPORT } from './theme';
import { getTabs, BottomNav } from './components/BottomNav';
import { getMoreItems, MoreSheet } from './components/MoreSheet';
import { InstallIOSPrompt } from './components/InstallIOSPrompt';
import { LangProvider, useLang } from './lib/LangContext';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useAlerts } from './hooks/useAlerts';
import { useInventory, productStatus } from './hooks/useInventory';
import { Login } from './screens/Login';
import { Onboarding } from './screens/Onboarding';
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

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0', fontFamily: 'Inter' }}>
      <style>{FONT_IMPORT}</style>
      <div
        style={{
          width: 390,
          height: 780,
          maxHeight: '92vh',
          background: T.bg,
          borderRadius: 40,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 30px 60px -20px rgba(27,23,18,0.35)',
          border: `1px solid ${T.line}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppShell />
      <InstallIOSPrompt />
    </LangProvider>
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

  const [activeTab, setActiveTab] = useState('hoje');
  const [showMore, setShowMore] = useState(false);
  const [moreScreen, setMoreScreen] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
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
      <PhoneShell>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13, color: T.muted }}>…</div>
        </div>
      </PhoneShell>
    );
  }

  if (!session) {
    return (
      <PhoneShell>
        <Login />
      </PhoneShell>
    );
  }

  if (!profile) {
    return (
      <PhoneShell>
        <Onboarding initialName={deriveNameFromEmail(session.user.email || '')} onComplete={completeOnboarding} />
      </PhoneShell>
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

  const toggleBar = (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
      <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.line}`, borderRadius: 999, padding: 4, gap: 4 }}>
        {[
          { id: 'mobile' as const, label: t.nav.viewToggleMobile, icon: Home },
          { id: 'desktop' as const, label: t.nav.viewToggleDesktop, icon: Grid3x3 },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setViewMode(v.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: viewMode === v.id ? T.ink : 'transparent',
              color: viewMode === v.id ? '#fff' : T.muted,
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (viewMode === 'desktop') {
    const navItems = [...tabs, ...moreItems];
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, padding: '24px 0', fontFamily: 'Inter' }}>
        <style>{FONT_IMPORT}</style>
        {toggleBar}
        <div
          style={{
            width: 1180,
            maxWidth: '94vw',
            margin: '0 auto',
            background: T.bg,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 60px -20px rgba(27,23,18,0.25)',
            border: `1px solid ${T.line}`,
            display: 'flex',
            minHeight: 720,
          }}
        >
          <div style={{ width: 230, background: T.surface, borderRight: `1px solid ${T.line}`, padding: '26px 16px', display: 'flex', flexDirection: 'column' }}>
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
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 780 }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>{screenContent}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0', fontFamily: 'Inter' }}>
      <style>{FONT_IMPORT}</style>
      {toggleBar}
      <div
        style={{
          width: 390,
          height: 780,
          maxHeight: '82vh',
          background: T.bg,
          borderRadius: 40,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 30px 60px -20px rgba(27,23,18,0.35)',
          border: `1px solid ${T.line}`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <div style={{ paddingTop: moreScreen && moreScreen !== 'servicos' ? 34 : 0 }}>{screenContent}</div>
        </div>

        {moreScreen && moreScreen !== 'servicos' && (
          <button
            onClick={() => setMoreScreen(null)}
            style={{
              position: 'absolute',
              top: 18,
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
    </div>
  );
}
