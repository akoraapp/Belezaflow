import { useEffect, useState, type ChangeEvent } from 'react';
import { AppFrame } from './components/AppFrame';
import { BottomNav } from './components/BottomNav';
import { useNavigator } from './app/navigation';
import { content, type Lang } from './data/content';
import { newFeatures } from './data/newFeatures';
import { DEFAULT_WORKING_DAYS, TIME_SLOTS, slugify, todayWeekdayIndex } from './lib/scheduling';
import type { FinanceEntry, LiveAppointment, LiveClient, ServiceItem } from './lib/types';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen, type OnboardingResult } from './screens/OnboardingScreen';
import { HomeScreen, type HojeQuickAction, type ReadyResponseWithCopy } from './screens/HomeScreen';
import { AgendaScreen, type AgendaAppointment } from './screens/AgendaScreen';
import { AgendaSetupScreen } from './screens/AgendaSetupScreen';
import { CrmListScreen, type CrmStage, type CrmClientWithAttendance } from './screens/CrmListScreen';
import { CrmProfileScreen } from './screens/CrmProfileScreen';
import { FinanceScreen } from './screens/FinanceScreen';
import { MoreMenuScreen } from './screens/MoreMenuScreen';
import { ClientMachineScreen } from './screens/ClientMachineScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { AiAssistantScreen } from './screens/AiAssistantScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PublicPageScreen } from './screens/PublicPageScreen';

const AGENDA_STATUS_STYLE: Record<string, { statusColor: string; badgeBg: string; badgeColor: string }> = {
  confirmed: { statusColor: '#B98D3E', badgeBg: '#FBF3E4', badgeColor: '#8A6A2E' },
  done: { statusColor: '#C7BEAC', badgeBg: '#F2ECDF', badgeColor: '#8A8074' },
  pending: { statusColor: '#201C17', badgeBg: '#ECE7DC', badgeColor: '#201C17' },
};

const AUTHED_KEY = 'bc.authed';
const ONBOARDED_KEY = 'bc.onboarded';
const LANG_KEY = 'bc.lang';

function fmtCurrency(lang: Lang, n: number): string {
  return lang === 'pt' ? `R$ ${n.toLocaleString('pt-BR')}` : `$${n.toLocaleString('en-US')}`;
}

let idSeq = 0;
function nextId(prefix: string): string {
  idSeq += 1;
  return `${prefix}-${idSeq}`;
}

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTHED_KEY) === '1');
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem(ONBOARDED_KEY) === '1');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(LANG_KEY) as Lang) || 'pt');
  const [inventoryProfession, setInventoryProfession] = useState('lash');
  const [professionalName, setProfessionalName] = useState('');
  const [publicName, setPublicName] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [appointments, setAppointments] = useState<LiveAppointment[]>([]);
  const [bookedSlotTimes, setBookedSlotTimes] = useState<string[]>([]);
  const [workingDays, setWorkingDays] = useState<number[]>(DEFAULT_WORKING_DAYS);
  const [bookableSlots, setBookableSlots] = useState<string[]>(TIME_SLOTS);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [clients, setClients] = useState<LiveClient[]>([]);
  const [crmFilter, setCrmFilter] = useState('todos');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showPublicPreview, setShowPublicPreview] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, 'yes' | 'no'>>({});
  const [estoqueExpandedConsumption, setEstoqueExpandedConsumption] = useState<Record<number, boolean>>({ 0: true });
  const [readyResponsesOpen, setReadyResponsesOpen] = useState(false);
  const [copiedResponseIdx, setCopiedResponseIdx] = useState<number | null>(null);
  const [contentPresetObjectiveState, setContentPresetObjectiveState] = useState<string | null>(null);
  const [contentPresetNonce, setContentPresetNonce] = useState(0);
  const [estoqueExtraProducts, setEstoqueExtraProducts] = useState<{ name: string; qty: number; value: number }[]>([]);
  const [estoqueAddFormOpen, setEstoqueAddFormOpen] = useState(false);
  const [estoqueAddFormName, setEstoqueAddFormName] = useState('');
  const [estoqueAddFormQty, setEstoqueAddFormQty] = useState('');
  const [estoqueAddFormValue, setEstoqueAddFormValue] = useState('');

  const nav = useNavigator();
  const t = content[lang];
  const nf = newFeatures[lang];
  const fmtPrice = (n: number) => fmtCurrency(lang, n);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  function markAttendance(name: string, status: 'yes' | 'no') {
    setAttendance((a) => ({ ...a, [name]: status }));
  }

  function login(name: string) {
    setProfessionalName(name);
    setAuthed(true);
    localStorage.setItem(AUTHED_KEY, '1');
  }

  function finishOnboarding(result: OnboardingResult) {
    setPublicName(result.publicName);
    setMonthlyGoal(result.monthlyGoal);
    setServices(result.services);
    setAppointments(
      t.agenda.appointments.map((ap) => ({
        id: nextId('seed-appt'),
        time: ap.time,
        clientName: ap.client,
        service: ap.service,
        price: 0,
        status: ap.status,
      })),
    );
    setClients(
      t.crm.clients.map((c) => ({
        id: nextId('seed-client'),
        initial: c.initial,
        name: c.name,
        tag: c.tag,
        lastVisit: c.lastVisit,
        value: c.value,
        stage: c.stage,
      })),
    );
    setOnboarded(true);
    localStorage.setItem(ONBOARDED_KEY, '1');
  }

  const toggleLang = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'));

  // CRM
  const filteredClients = crmFilter === 'todos' ? clients : clients.filter((c) => c.stage === crmFilter);
  const crmStages: CrmStage[] = t.crm.stages.map((s) => ({
    ...s,
    bg: s.key === crmFilter ? '#201C17' : '#FFFFFF',
    color: s.key === crmFilter ? '#F4E9D2' : '#8A8074',
    border: s.key === crmFilter ? '#201C17' : '#EBE2CF',
    onClick: () => setCrmFilter(s.key),
  }));

  const attendanceValues = Object.values(attendance);
  const yesCount = attendanceValues.filter((v) => v === 'yes').length;
  const noCount = attendanceValues.filter((v) => v === 'no').length;
  const totalRegistered = yesCount + noCount;
  const conversionLabelValue = totalRegistered > 0 ? `${Math.round((yesCount / totalRegistered) * 100)}%` : '—';
  const attendanceCountLabel =
    totalRegistered > 0
      ? lang === 'pt'
        ? `${yesCount} de ${totalRegistered} registrados`
        : `${yesCount} of ${totalRegistered} logged`
      : lang === 'pt'
        ? 'Nenhum registro ainda'
        : 'No records yet';

  const crmClientsWithAttendance: CrmClientWithAttendance[] = filteredClients.map((c) => {
    const status = attendance[c.name];
    return {
      ...c,
      showAttendanceButtons: c.stage === 'agendados',
      yesBg: status === 'yes' ? '#4E7A49' : '#EAF2E7',
      yesColor: status === 'yes' ? '#FFFFFF' : '#4E7A49',
      yesBorder: status === 'yes' ? '#4E7A49' : '#CFE4C9',
      noBg: status === 'no' ? '#8A4A3E' : '#F6E7E1',
      noColor: status === 'no' ? '#FFFFFF' : '#8A4A3E',
      noBorder: status === 'no' ? '#8A4A3E' : '#E8CFC4',
      markYes: () => markAttendance(c.name, 'yes'),
      markNo: () => markAttendance(c.name, 'no'),
    };
  });
  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0] ?? null;

  function updateClientStage(id: string, stage: string) {
    setClients((list) => list.map((c) => (c.id === id ? { ...c, stage } : c)));
  }
  function updateClientBirthday(id: string, birthday: string) {
    setClients((list) => list.map((c) => (c.id === id ? { ...c, birthday } : c)));
  }
  function addClient(data: { name: string; phone: string; service: string; birthday: string; origin: string }) {
    const initial = data.name.trim().slice(0, 2).toUpperCase() || '—';
    const tag = `${lang === 'pt' ? 'Contato via' : 'Contact via'} ${data.origin}`;
    const newClient: LiveClient = {
      id: nextId('client'),
      initial,
      name: data.name,
      tag,
      lastVisit: lang === 'pt' ? 'Novo contato' : 'New contact',
      value: '—',
      stage: 'leads',
      phone: data.phone || undefined,
      service: data.service || undefined,
      birthday: data.birthday || undefined,
    };
    setClients((list) => [newClient, ...list]);
  }

  // Hoje quick actions
  const nextApptName = appointments[0]?.clientName ?? '';
  const nextApptAttended = attendance[nextApptName] === 'yes';
  const goToClientMachine = () => nav.openDetail('clientMachine');
  const hojeQuickActions: HojeQuickAction[] = [
    { key: 'content', label: t.today.quickActions.createContent, bg: '#201C17', border: '#201C17', color: '#F4E9D2', onClick: goToClientMachine },
    {
      key: 'attendance',
      label: nextApptAttended ? t.today.quickActions.registeredDone : t.today.quickActions.registerAttendance,
      bg: nextApptAttended ? '#FBF3E4' : '#FFFFFF',
      border: nextApptAttended ? '#E3C989' : '#EBE2CF',
      color: nextApptAttended ? '#8A6A2E' : '#26221D',
      onClick: () => markAttendance(nextApptName, 'yes'),
    },
    { key: 'finance', label: t.today.quickActions.goFinance, bg: '#FFFFFF', border: '#EBE2CF', color: '#26221D', onClick: () => nav.goTab('financeiro') },
    { key: 'client', label: t.today.quickActions.newClient, bg: '#FFFFFF', border: '#EBE2CF', color: '#26221D', onClick: () => nav.goTab('crm') },
  ];

  // Agenda
  const agendaAppointments: AgendaAppointment[] = [...appointments]
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((ap) => ({
      id: ap.id,
      time: ap.time,
      client: ap.clientName,
      service: ap.service,
      ...AGENDA_STATUS_STYLE[ap.status],
      statusLabel: t.agenda.statusLabels[ap.status],
    }));

  // Hoje: greeting + goal (both live — no static demo defaults)
  const greetingHour = new Date().getHours();
  const greetingPrefix = greetingHour < 12 ? nf.greetings.morning : greetingHour < 18 ? nf.greetings.afternoon : nf.greetings.evening;
  const greeting = `${greetingPrefix}, ${professionalName}`;

  const goalCurrentNum = appointments.filter((ap) => ap.status === 'confirmed' || ap.status === 'done').reduce((sum, ap) => sum + ap.price, 0);
  const goalTargetNum = monthlyGoal;
  const goalPct = goalTargetNum > 0 ? Math.min(100, Math.round((goalCurrentNum / goalTargetNum) * 100)) : 0;
  const goalPercentLabel = `${goalPct}%`;
  const goalStatusLabel = lang === 'pt' ? `${fmtCurrency(lang, goalCurrentNum)} de ${fmtCurrency(lang, goalTargetNum)}` : `${fmtCurrency(lang, goalCurrentNum)} of ${fmtCurrency(lang, goalTargetNum)}`;
  const goalRemainingNum = Math.max(0, goalTargetNum - goalCurrentNum);
  const goalRemainingLabel =
    lang === 'pt' ? `Faltam ${fmtCurrency(lang, goalRemainingNum)} para bater a meta` : `${fmtCurrency(lang, goalRemainingNum)} left to hit your goal`;

  const readyResponsesToggleLabel = readyResponsesOpen ? t.today.readyResponsesCloseLabel : t.today.readyResponsesOpenLabel;
  const readyResponsesWithCopy: ReadyResponseWithCopy[] = t.today.readyResponses.map((rr, i) => ({
    ...rr,
    copyLabel: copiedResponseIdx === i ? t.today.copiedLabel : t.today.copyLabel,
    onCopy: () => {
      try {
        navigator.clipboard?.writeText(rr.text);
      } catch {
        /* clipboard unavailable */
      }
      setCopiedResponseIdx(i);
      setTimeout(() => setCopiedResponseIdx((idx) => (idx === i ? null : idx)), 1600);
    },
  }));
  const toggleReadyResponses = () => setReadyResponsesOpen((v) => !v);

  const contentPresetObjective = contentPresetObjectiveState ? `atrair-${contentPresetNonce}` : null;
  const goToContentSuggestion = () => {
    setContentPresetObjectiveState('atrair');
    setContentPresetNonce((n) => n + 1);
    nav.openDetail('clientMachine');
  };

  // Estoque Inteligente
  const invData = t.inventory.productsByProfession[inventoryProfession] ?? t.inventory.productsByProfession.lash;
  const extraProducts = estoqueExtraProducts.map((p) => ({
    name: p.name,
    category: '',
    brand: '',
    supplier: '',
    qty: p.qty,
    minQty: 1,
    unit: lang === 'pt' ? 'un' : 'units',
    purchaseValue: p.value,
  }));
  const allProductsRaw = invData.products.concat(extraProducts).map((p) => ({ ...p, isLow: p.qty <= p.minQty, isOut: p.qty <= 0 }));
  const inventoryTotalInvestedNum = allProductsRaw.reduce((sum, p) => sum + (p.purchaseValue || 0), 0);
  const inventoryTotalInvested = fmtCurrency(lang, inventoryTotalInvestedNum);
  const inventoryProductCountLabel = lang === 'pt' ? `${allProductsRaw.length} produtos cadastrados` : `${allProductsRaw.length} products registered`;

  const toggleAddForm = () => setEstoqueAddFormOpen((v) => !v);
  const onAddFormNameChange = (e: ChangeEvent<HTMLInputElement>) => setEstoqueAddFormName(e.target.value);
  const onAddFormQtyChange = (e: ChangeEvent<HTMLInputElement>) => setEstoqueAddFormQty(e.target.value);
  const onAddFormValueChange = (e: ChangeEvent<HTMLInputElement>) => setEstoqueAddFormValue(e.target.value);
  const onAddFormSubmit = () => {
    const name = estoqueAddFormName.trim();
    if (!name) return;
    const qty = parseFloat(estoqueAddFormQty) || 1;
    const value = parseFloat(estoqueAddFormValue) || 0;
    setEstoqueExtraProducts((list) => [...list, { name, qty, value }]);
    setEstoqueAddFormName('');
    setEstoqueAddFormQty('');
    setEstoqueAddFormValue('');
    setEstoqueAddFormOpen(false);
  };

  const inventoryLowProducts = allProductsRaw.filter((p) => p.isLow);
  const inventoryHasLow = inventoryLowProducts.length > 0;
  const inventoryLowHeadline =
    lang === 'pt'
      ? `${inventoryLowProducts.length} produto${inventoryLowProducts.length === 1 ? '' : 's'} precisando de reposição`
      : `${inventoryLowProducts.length} product${inventoryLowProducts.length === 1 ? '' : 's'} needing restock`;
  const inventoryAlertsWithAction = invData.alerts.map((text, i) => ({
    text,
    actionLabel: i === invData.alerts.length - 1 ? t.inventory.historyCta : t.inventory.restockCta,
  }));
  const inventoryConsumptionList = (invData.consumptionList || [invData.consumption]).map((cs, i) => ({
    ...cs,
    expanded: !!estoqueExpandedConsumption[i],
    toggleLabel: estoqueExpandedConsumption[i] ? t.inventory.collapseCta : t.inventory.expandCta,
    onToggle: () => setEstoqueExpandedConsumption((m) => ({ ...m, [i]: !m[i] })),
  }));
  const inventoryAllProducts = allProductsRaw.map((p) => {
    const status = p.isOut ? 'out' : p.isLow ? 'low' : 'ok';
    const style = {
      ok: { bg: '#EAF2E7', color: '#4E7A49', label: t.inventory.statusLabels.ok },
      low: { bg: '#FBF3E4', color: '#8A6A2E', label: t.inventory.statusLabels.low },
      out: { bg: '#F6E1DB', color: '#8A4A3E', label: t.inventory.statusLabels.out },
    }[status];
    return { ...p, statusBg: style.bg, statusColor: style.color, statusLabel: style.label };
  });

  // Finance ledger
  function addFinanceEntry(entry: { tipo: 'receber' | 'pagar'; label: string; value: number; dueDate: string }) {
    setFinanceEntries((list) => [{ id: nextId('fin'), ...entry }, ...list]);
  }
  function removeFinanceEntry(id: string) {
    setFinanceEntries((list) => list.filter((e) => e.id !== id));
  }

  // Agenda Online (public booking)
  function toggleWorkingDay(idx: number) {
    setWorkingDays((days) => (days.includes(idx) ? days.filter((d) => d !== idx) : [...days, idx].sort()));
  }
  function toggleSlot(slot: string) {
    setBookableSlots((slots) => (slots.includes(slot) ? slots.filter((s) => s !== slot) : [...slots, slot].sort()));
  }
  const isWorkingToday = workingDays.includes(todayWeekdayIndex());
  const publicBookingAvailableSlots = bookableSlots.filter((slot) => !bookedSlotTimes.includes(slot));
  const publicLink = `${nf.onboardingPublicName.linkPrefix}${slugify(publicName)}`;

  function confirmBooking(data: { service: ServiceItem; time: string; name: string; phone: string }) {
    setAppointments((list) => [
      ...list,
      { id: nextId('appt'), time: data.time, clientName: data.name, service: data.service.name, price: data.service.price, status: 'confirmed', origin: 'online' },
    ]);
    setBookedSlotTimes((list) => [...list, data.time]);
    setClients((list) => {
      const existing = list.find((c) => c.phone && c.phone === data.phone);
      if (existing) {
        return list.map((c) => (c.id === existing.id ? { ...c, stage: 'agendados', service: data.service.name } : c));
      }
      const initial = data.name.trim().slice(0, 2).toUpperCase() || '—';
      const newClient: LiveClient = {
        id: nextId('client'),
        initial,
        name: data.name,
        tag: data.service.name,
        lastVisit: lang === 'pt' ? 'Novo contato' : 'New contact',
        value: '—',
        stage: 'agendados',
        phone: data.phone,
        service: data.service.name,
      };
      return [newClient, ...list];
    });
  }

  function addManualAppointment(data: { clientName: string; service: ServiceItem; time: string }) {
    setAppointments((list) => [
      ...list,
      { id: nextId('appt'), time: data.time, clientName: data.clientName, service: data.service.name, price: data.service.price, status: 'confirmed' },
    ]);
    setBookedSlotTimes((list) => [...list, data.time]);
  }

  if (!authed) {
    return (
      <AppFrame>
        <LoginScreen strings={nf.login} onLogin={login} />
      </AppFrame>
    );
  }

  if (!onboarded) {
    return (
      <AppFrame>
        <OnboardingScreen t={t} lang={lang} strings={nf} onLanguageSelect={setLang} onProfessionSelect={setInventoryProfession} onFinish={finishOnboarding} />
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      {nav.tab === 'hoje' && !nav.detail && (
        <HomeScreen
          t={t}
          greeting={greeting}
          goalStatusLabel={goalStatusLabel}
          goalPercentLabel={goalPercentLabel}
          goalRemainingLabel={goalRemainingLabel}
          hojeQuickActions={hojeQuickActions}
          readyResponsesOpen={readyResponsesOpen}
          readyResponsesToggleLabel={readyResponsesToggleLabel}
          readyResponsesWithCopy={readyResponsesWithCopy}
          toggleReadyResponses={toggleReadyResponses}
          goToContentSuggestion={goToContentSuggestion}
        />
      )}

      {nav.tab === 'agenda' && !nav.detail && (
        <AgendaScreen
          t={t}
          strings={nf.agendaAddAppointment}
          agendaAppointments={agendaAppointments}
          services={services}
          availableSlots={publicBookingAvailableSlots}
          fmtPrice={fmtPrice}
          onOpenSetup={() => nav.openDetail('agendaSetup')}
          onAddAppointment={addManualAppointment}
        />
      )}
      {nav.tab === 'agenda' && nav.detail === 'agendaSetup' && (
        <AgendaSetupScreen
          t={t}
          strings={nf}
          publicLink={publicLink}
          workingDays={workingDays}
          toggleWorkingDay={toggleWorkingDay}
          bookableSlots={bookableSlots}
          toggleSlot={toggleSlot}
          onBack={nav.goBack}
          onOpenPublicPage={() => setShowPublicPreview(true)}
        />
      )}

      {nav.tab === 'crm' && !nav.detail && (
        <CrmListScreen
          t={t}
          strings={nf.crmAddClient}
          crmStages={crmStages}
          crmClientsWithAttendance={crmClientsWithAttendance}
          attendanceCountLabel={attendanceCountLabel}
          conversionLabelValue={conversionLabelValue}
          attendanceLabels={{ yes: lang === 'pt' ? 'Compareceu' : 'Attended', no: lang === 'pt' ? 'Não compareceu' : 'No-show' }}
          onOpenProfile={(id) => {
            setSelectedClientId(id);
            nav.openDetail('crmProfile');
          }}
          onAddClient={addClient}
        />
      )}
      {nav.tab === 'crm' && nav.detail === 'crmProfile' && selectedClient && (
        <CrmProfileScreen
          t={t}
          lang={lang}
          strings={nf.crmProfileExtra}
          client={selectedClient}
          stageOptions={t.crm.stages.filter((s) => s.key !== 'todos')}
          onBack={nav.goBack}
          onChangeStage={(stage) => updateClientStage(selectedClient.id, stage)}
          onChangeBirthday={(birthday) => updateClientBirthday(selectedClient.id, birthday)}
        />
      )}

      {nav.tab === 'financeiro' && !nav.detail && (
        <FinanceScreen t={t} strings={nf.finance} entries={financeEntries} fmtPrice={fmtPrice} onAddEntry={addFinanceEntry} onRemoveEntry={removeFinanceEntry} />
      )}

      {nav.tab === 'mais' && !nav.detail && <MoreMenuScreen t={t} lang={lang} onToggleLang={toggleLang} onOpen={nav.openDetail} />}
      {nav.tab === 'mais' && nav.detail === 'clientMachine' && (
        <ClientMachineScreen t={t} lang={lang} contentPresetObjective={contentPresetObjective} onExit={nav.goBack} />
      )}
      {nav.tab === 'mais' && nav.detail === 'inventory' && (
        <InventoryScreen
          t={t}
          onBack={nav.goBack}
          inventoryTotalInvested={inventoryTotalInvested}
          inventoryProductCountLabel={inventoryProductCountLabel}
          inventoryAlertsWithAction={inventoryAlertsWithAction}
          inventoryHasLow={inventoryHasLow}
          inventoryLowHeadline={inventoryLowHeadline}
          inventoryLowProducts={inventoryLowProducts}
          inventoryConsumptionList={inventoryConsumptionList}
          inventoryAllProducts={inventoryAllProducts}
          addFormOpen={estoqueAddFormOpen}
          addFormToggleLabel={estoqueAddFormOpen ? t.inventory.collapseCta : t.inventory.expandCta}
          addFormName={estoqueAddFormName}
          addFormQty={estoqueAddFormQty}
          addFormValue={estoqueAddFormValue}
          toggleAddForm={toggleAddForm}
          onAddFormNameChange={onAddFormNameChange}
          onAddFormQtyChange={onAddFormQtyChange}
          onAddFormValueChange={onAddFormValueChange}
          onAddFormSubmit={onAddFormSubmit}
        />
      )}
      {nav.tab === 'mais' && nav.detail === 'relatorios' && <ReportsScreen t={t} onBack={nav.goBack} />}
      {nav.tab === 'mais' && nav.detail === 'ia' && <AiAssistantScreen t={t} onBack={nav.goBack} />}
      {nav.tab === 'mais' && nav.detail === 'config' && <SettingsScreen t={t} lang={lang} onToggleLang={toggleLang} onBack={nav.goBack} />}

      <BottomNav active={nav.tab} t={t} onSelect={nav.goTab} />

      {showPublicPreview && (
        <PublicPageScreen
          t={t}
          strings={nf.publicBooking}
          publicName={publicName || professionalName}
          services={services}
          availableSlots={publicBookingAvailableSlots}
          isWorkingToday={isWorkingToday}
          fmtPrice={fmtPrice}
          onConfirmBooking={confirmBooking}
          onClose={() => setShowPublicPreview(false)}
        />
      )}
    </AppFrame>
  );
}
