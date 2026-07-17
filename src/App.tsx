import { useState } from 'react';
import { ChevronLeft, Grid3x3, Home } from 'lucide-react';
import { T, FONT_IMPORT } from './theme';
import { TABS, BottomNav } from './components/BottomNav';
import { MORE_ITEMS, MoreSheet } from './components/MoreSheet';
import { Login } from './screens/Login';
import { Onboarding } from './screens/Onboarding';
import { HojeScreen } from './screens/Hoje';
import { AgendaScreen } from './screens/Agenda';
import { ClientesScreen } from './screens/Clientes';
import { FinanceiroScreen } from './screens/Financeiro';
import { IAScreen } from './screens/IA';
import { MaquinaScreen } from './screens/Maquina';
import { ServicosScreen } from './screens/Servicos';
import { AgendaOnlineScreen } from './screens/AgendaOnline';
import { ConfigScreen } from './screens/Config';
import { NotificacoesScreen } from './screens/Notificacoes';
import { ALL_SLOTS } from './theme';
import type { Appointment, Client, CurrencyCode, FinanceEntry, OnboardingResult, Profile, ServiceItem } from './types';

export default function App() {
  const [authedName, setAuthedName] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState('hoje');
  const [showMore, setShowMore] = useState(false);
  const [moreScreen, setMoreScreen] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleOnboardingComplete = (data: OnboardingResult) => {
    setProfile({
      language: data.language,
      currency: data.currency,
      name: data.name,
      publicName: data.publicName,
      profession: data.profession,
      goal: data.goal,
      instagram: '',
      whatsapp: '',
      endereco: '',
      mapsLink: '',
      contactMethod: 'whatsapp',
      workingDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
      availableSlots: [...ALL_SLOTS],
    });
    setServices(data.services);
  };

  const addAppointment = (a: Appointment) => setAppointments((prev) => [...prev, a]);
  const updateProfile = (patch: Partial<Profile>) => setProfile((p) => (p ? { ...p, ...patch } : p));
  const addFinanceEntry = (e: FinanceEntry) => setFinanceEntries((prev) => [...prev, e]);
  const removeFinanceEntry = (id: string) => setFinanceEntries((prev) => prev.filter((e) => e.id !== id));
  const addClient = (c: Omit<Client, 'id'>) => setClients((prev) => [{ id: `c${Date.now()}`, ...c }, ...prev]);
  const updateClient = (id: string, patch: Partial<Client>) => setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const setServicesUpdater = (updater: (prev: ServiceItem[]) => ServiceItem[]) => setServices(updater);

  const openMore = (id: string) => {
    setMoreScreen(id);
    setShowMore(false);
  };
  const selectTab = (id: string) => {
    setActiveTab(id);
    setMoreScreen(null);
  };
  const goTo = (id: string) => (TABS.some((t) => t.id === id) ? selectTab(id) : openMore(id));

  const currency: CurrencyCode = profile?.currency || 'BRL';

  if (!authedName) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0', fontFamily: 'Manrope' }}>
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
          <Login onLogin={setAuthedName} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0', fontFamily: 'Manrope' }}>
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
          <Onboarding initialName={authedName} onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  const screenContent = (
    <>
      {moreScreen === 'financeiro' && (
        <FinanceiroScreen appointments={appointments} profile={profile} currency={currency} entries={financeEntries} addEntry={addFinanceEntry} removeEntry={removeFinanceEntry} />
      )}
      {moreScreen === 'online' && (
        <AgendaOnlineScreen
          profile={profile}
          services={services}
          appointments={appointments}
          currency={currency}
          onUpdateProfile={updateProfile}
          addAppointment={addAppointment}
          addClient={addClient}
          onOpenServicos={() => setMoreScreen('servicos')}
        />
      )}
      {moreScreen === 'notificacoes' && <NotificacoesScreen />}
      {moreScreen === 'config' && <ConfigScreen profile={profile} services={services} onUpdateProfile={updateProfile} onOpenServicos={() => setMoreScreen('servicos')} />}
      {moreScreen === 'servicos' && <ServicosScreen services={services} setServices={setServicesUpdater} currency={currency} onBack={() => setMoreScreen(null)} />}

      {!moreScreen && activeTab === 'hoje' && (
        <HojeScreen profile={profile} appointments={appointments} clients={clients} services={services} currency={currency} onOpenMaquina={() => selectTab('maquina')} />
      )}
      {!moreScreen && activeTab === 'maquina' && <MaquinaScreen />}
      {!moreScreen && activeTab === 'agenda' && <AgendaScreen appointments={appointments} services={services} profile={profile} currency={currency} addAppointment={addAppointment} />}
      {!moreScreen && activeTab === 'clientes' && <ClientesScreen clients={clients} contactMethod={profile.contactMethod} addClient={addClient} updateClient={updateClient} />}
      {!moreScreen && activeTab === 'ia' && <IAScreen profile={profile} clients={clients} appointments={appointments} currency={currency} />}
    </>
  );

  const toggleBar = (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
      <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.line}`, borderRadius: 999, padding: 4, gap: 4 }}>
        {[
          { id: 'mobile' as const, label: 'Celular', icon: Home },
          { id: 'desktop' as const, label: 'Computador', icon: Grid3x3 },
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
              fontFamily: 'Manrope',
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
    const navItems = [...TABS, ...MORE_ITEMS];
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, padding: '24px 0', fontFamily: 'Manrope' }}>
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
            <div style={{ fontFamily: 'Fraunces', fontSize: 19, color: T.ink, padding: '0 10px 22px', fontWeight: 600 }}>
              BeautyFlow <span style={{ color: T.goldDeep }}>AI</span>
            </div>
            <div style={{ padding: '0 10px 14px', fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>Olá, {profile.name} 👋</div>
            {navItems.map((item) => {
              const isActive = moreScreen ? moreScreen === item.id : activeTab === item.id;
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
                    fontFamily: 'Manrope',
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
    <div style={{ width: '100%', minHeight: '100vh', background: T.surfaceAlt, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 0', fontFamily: 'Manrope' }}>
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

        <BottomNav active={activeTab} onSelect={selectTab} onMore={() => setShowMore(true)} moreActive={!!moreScreen} />
        {showMore && <MoreSheet onSelect={openMore} onClose={() => setShowMore(false)} />}
      </div>
    </div>
  );
}
