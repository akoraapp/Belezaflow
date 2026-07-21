import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Grid3x3, Home } from 'lucide-react';
import { T, FONT_IMPORT, ALL_SLOTS } from './theme';
import { getTabs, BottomNav } from './components/BottomNav';
import { getMoreItems, MoreSheet } from './components/MoreSheet';
import { LangProvider, useLang } from './lib/LangContext';
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
import { getAvailability } from './lib/helpers';
import { buildAlerts } from './lib/alerts';
import { getNotificationPermission, requestNotificationPermission, fireNotification, type NotifPermission } from './lib/notifications';
import { buildNoShowMessage, buildWhatsAppLink } from './lib/followup';
import { productStatus } from './screens/Estoque';
import type { Appointment, Client, CurrencyCode, FinanceEntry, OnboardingResult, Product, Profile, ServiceItem } from './types';

export default function App() {
  return (
    <LangProvider>
      <AppShell />
    </LangProvider>
  );
}

function AppShell() {
  const { t, lang } = useLang();
  const [authedName, setAuthedName] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState('hoje');
  const [showMore, setShowMore] = useState(false);
  const [moreScreen, setMoreScreen] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [clientesFilter, setClientesFilter] = useState('Todos');
  const [clientesNonce, setClientesNonce] = useState(0);
  const [clientesInitialSelectedId, setClientesInitialSelectedId] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotifPermission>(() => getNotificationPermission());
  const [alertTimestamps, setAlertTimestamps] = useState<Record<string, number>>({});
  const seenAlertKeysRef = useRef<Set<string>>(new Set());

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
      bufferMinutes: 0,
      cancellationNoticeHours: 24,
      rescheduleNoticeHours: 24,
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
  const addProduct = (p: Omit<Product, 'id'>) => setProducts((prev) => [{ id: `p${Date.now()}`, ...p }, ...prev]);
  const updateProduct = (id: string, patch: Partial<Product>) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removeProduct = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const sendReminders = () => {
    setAppointments((prev) => prev.map((a) => (a.day === 'hoje' && a.status === 'Agendado' ? { ...a, status: 'Confirmado' } : a)));
  };

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

  const findClientForAppointment = (appt: Appointment) => clients.find((c) => (appt.clientPhone && c.phone === appt.clientPhone) || c.name === appt.clientName);

  const markAttendance = (appointmentId: string, attended: boolean) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt) return;

    if (attended) {
      setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, status: 'Compareceu' } : a)));
      const service = services.find((s) => s.name === appt.service);
      if (service?.consumables?.length) {
        const consumables = service.consumables;
        setProducts((prev) =>
          prev.map((p) => {
            const consumable = consumables.find((c) => c.productId === p.id);
            return consumable ? { ...p, qty: Math.max(0, p.qty - consumable.qty) } : p;
          }),
        );
      }
      return;
    }

    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, status: 'NaoCompareceu' } : a)));
    const existingClient = findClientForAppointment(appt);
    if (existingClient) {
      updateClient(existingClient.id, { status: 'Perdido' });
    } else {
      addClient({ name: appt.clientName, phone: appt.clientPhone || '', service: appt.service, origem: 'Agenda', status: 'Perdido', birthday: '—' });
    }
  };

  const handleFollowUpNoShow = (appt: Appointment) => {
    if (appt.clientPhone) {
      const message = buildNoShowMessage(appt.clientName, appt.service, lang);
      const waLink = buildWhatsAppLink(appt.clientPhone, message);
      if (waLink) {
        window.open(waLink, '_blank', 'noopener,noreferrer');
        setAppointments((prev) => prev.map((a) => (a.id === appt.id ? { ...a, followUpSent: true } : a)));
        return;
      }
    }
    const client = findClientForAppointment(appt);
    openClientesWithFilter('Perdido', client?.id ?? null);
  };

  const markFollowUpSent = (appointmentId: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, followUpSent: true } : a)));
  };

  const currency: CurrencyCode = profile?.currency || 'BRL';

  const alerts = profile
    ? buildAlerts({
        profile,
        appointments,
        clients,
        services,
        products,
        currency,
        t,
        callbacks: {
          onOpenAgenda: () => selectTab('agenda'),
          onOpenClientesLost: () => openClientesWithFilter('Perdido'),
          onOpenEstoque: () => openMore('estoque'),
          onOpenClientesLeads: () => openClientesWithFilter('Novo Lead'),
          onSendReminders: sendReminders,
          onFollowUpNoShow: handleFollowUpNoShow,
        },
      })
    : [];
  const alertKeysJoined = alerts.map((a) => a.key).join('|');

  useEffect(() => {
    const currentKeys = alerts.map((a) => a.key);
    const currentKeySet = new Set(currentKeys);
    // Keys that vanished (condition resolved) are dropped from the seen-set so the
    // same alert notifies again if the condition becomes true a second time.
    Array.from(seenAlertKeysRef.current).forEach((k) => {
      if (!currentKeySet.has(k)) seenAlertKeysRef.current.delete(k);
    });
    const newlyAppeared = alerts.filter((a) => !seenAlertKeysRef.current.has(a.key));
    newlyAppeared.forEach((a) => seenAlertKeysRef.current.add(a.key));

    if (newlyAppeared.length > 0) {
      setAlertTimestamps((prev) => {
        const next = { ...prev };
        newlyAppeared.forEach((a) => {
          next[a.key] = Date.now();
        });
        return next;
      });
      if (notifPermission === 'granted') {
        newlyAppeared.forEach((a) => fireNotification('BeautyFlow AI', a.title));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertKeysJoined, notifPermission]);

  const requestNotifPermission = async () => {
    const result = await requestNotificationPermission();
    setNotifPermission(result);
  };

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

  const { availableSlots } = getAvailability(profile, appointments);
  const lowStockCount = products.filter((p) => productStatus(p) !== 'ok').length;

  const screenContent = (
    <>
      {moreScreen === 'maquina' && <MaquinaScreen freeSlotsToday={availableSlots.length} lostClientsCount={clients.filter((c) => c.status === 'Perdido').length} />}
      {moreScreen === 'ia' && (
        <DiagnosticoScreen
          profile={profile}
          clients={clients}
          appointments={appointments}
          products={products}
          currency={currency}
          onOpenConteudo={() => openMore('maquina')}
          onOpenClientes={() => selectTab('clientes')}
        />
      )}
      {moreScreen === 'estoque' && <EstoqueScreen products={products} addProduct={addProduct} updateProduct={updateProduct} removeProduct={removeProduct} />}
      {moreScreen === 'notificacoes' && (
        <NotificacoesScreen alerts={alerts} timestamps={alertTimestamps} permission={notifPermission} onRequestPermission={requestNotifPermission} />
      )}
      {moreScreen === 'config' && (
        <ConfigScreen
          profile={profile}
          services={services}
          onUpdateProfile={updateProfile}
          onOpenServicos={() => setMoreScreen('servicos')}
          notifPermission={notifPermission}
          onRequestNotifPermission={requestNotifPermission}
        />
      )}
      {moreScreen === 'servicos' && (
        <ServicosScreen services={services} setServices={setServicesUpdater} products={products} currency={currency} onBack={() => setMoreScreen(null)} />
      )}

      {!moreScreen && activeTab === 'hoje' && (
        <HojeScreen
          profile={profile}
          appointments={appointments}
          currency={currency}
          alerts={alerts}
          onOpenConteudo={() => openMore('maquina')}
          onOpenAgenda={() => selectTab('agenda')}
          onOpenFinanceiro={() => selectTab('financeiro')}
          onOpenClientes={() => selectTab('clientes')}
          onMarkAttended={(id) => markAttendance(id, true)}
          onMarkNoShow={(id) => markAttendance(id, false)}
        />
      )}
      {!moreScreen && activeTab === 'agenda' && (
        <AgendaTab
          appointments={appointments}
          services={services}
          profile={profile}
          currency={currency}
          addAppointment={addAppointment}
          onUpdateProfile={updateProfile}
          addClient={addClient}
          onOpenServicos={() => setMoreScreen('servicos')}
          onMarkAttended={(id) => markAttendance(id, true)}
          onMarkNoShow={(id) => markAttendance(id, false)}
        />
      )}
      {!moreScreen && activeTab === 'clientes' && (
        <ClientesScreen
          key={clientesNonce}
          clients={clients}
          services={services}
          appointments={appointments}
          contactMethod={profile.contactMethod}
          addClient={addClient}
          updateClient={updateClient}
          initialFilter={clientesFilter}
          initialSelectedId={clientesInitialSelectedId}
          onFollowUpSent={markFollowUpSent}
        />
      )}
      {!moreScreen && activeTab === 'financeiro' && (
        <FinanceiroScreen appointments={appointments} profile={profile} currency={currency} entries={financeEntries} addEntry={addFinanceEntry} removeEntry={removeFinanceEntry} />
      )}
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
    const navItems = [...tabs, ...moreItems];
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
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 19, color: T.ink, padding: '0 10px 22px', fontWeight: 600 }}>
              BeautyFlow <span style={{ color: T.goldDeep }}>AI</span>
            </div>
            <div style={{ padding: '0 10px 14px', fontFamily: 'Manrope', fontSize: 12, color: T.muted }}>
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

        <BottomNav active={activeTab} onSelect={selectTab} onMore={() => setShowMore(true)} moreActive={!!moreScreen} t={t} />
        {showMore && <MoreSheet onSelect={openMore} onClose={() => setShowMore(false)} t={t} />}
      </div>
    </div>
  );
}
