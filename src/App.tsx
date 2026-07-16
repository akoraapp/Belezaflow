import { useEffect, useState, type ChangeEvent } from 'react';
import { AppFrame } from './components/AppFrame';
import { BottomNav } from './components/BottomNav';
import { useNavigator } from './app/navigation';
import { content, type Lang } from './data/content';
import { OnboardingScreen } from './screens/OnboardingScreen';
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
import { PublicPageScreen, type PublicService } from './screens/PublicPageScreen';

const AGENDA_STATUS_STYLE: Record<string, { statusColor: string; badgeBg: string; badgeColor: string }> = {
  confirmed: { statusColor: '#B98D3E', badgeBg: '#FBF3E4', badgeColor: '#8A6A2E' },
  done: { statusColor: '#C7BEAC', badgeBg: '#F2ECDF', badgeColor: '#8A8074' },
  pending: { statusColor: '#201C17', badgeBg: '#ECE7DC', badgeColor: '#201C17' },
};

const ONBOARDED_KEY = 'bc.onboarded';
const LANG_KEY = 'bc.lang';

function parseNum(s: string): number {
  return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
}

function fmtCurrency(lang: Lang, n: number): string {
  return lang === 'pt' ? `R$ ${n.toLocaleString('pt-BR')}` : `$${n.toLocaleString('en-US')}`;
}

export default function App() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem(ONBOARDED_KEY) === '1');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(LANG_KEY) as Lang) || 'pt');
  const [inventoryProfession, setInventoryProfession] = useState('lash');
  const [crmFilter, setCrmFilter] = useState('todos');
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [publicSelectedService, setPublicSelectedService] = useState<number | null>(null);
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

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  function markAttendance(name: string, status: 'yes' | 'no') {
    setAttendance((a) => ({ ...a, [name]: status }));
  }

  function finishOnboarding() {
    setOnboarded(true);
    localStorage.setItem(ONBOARDED_KEY, '1');
  }

  const toggleLang = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'));

  // CRM
  const filteredClients = crmFilter === 'todos' ? t.crm.clients : t.crm.clients.filter((c) => c.stage === crmFilter);
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
  const selectedClient = t.crm.clients.find((c) => c.name === selectedClientName) ?? t.crm.clients[0];

  // Hoje quick actions
  const nextApptName = t.agenda.appointments[0]?.client ?? '';
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
  const agendaAppointments: AgendaAppointment[] = t.agenda.appointments.map((ap) => ({
    ...ap,
    ...AGENDA_STATUS_STYLE[ap.status],
    statusLabel: t.agenda.statusLabels[ap.status],
  }));

  // Hoje: goal + ready responses
  const goalNums = t.today.goal.current.match(/[\d.,]+/g) || ['0', '0'];
  const goalCurrentNum = parseNum(goalNums[0]);
  const goalTargetNum = parseNum(goalNums[1] || goalNums[0]);
  const goalPct = goalTargetNum > 0 ? Math.min(100, Math.round((goalCurrentNum / goalTargetNum) * 100)) : 0;
  const goalPercentLabel = `${goalPct}%`;
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

  // Public page
  const publicServices: PublicService[] = t.publicPage.services.map((s, i) => {
    const isSelected = i === publicSelectedService;
    return {
      ...s,
      borderColor: isSelected ? '#B98D3E' : '#EBE2CF',
      bg: isSelected ? '#FBF3E4' : '#FFFFFF',
      btnBg: isSelected ? '#201C17' : '#F6EFE1',
      btnColor: isSelected ? '#F4E9D2' : '#8A6A2E',
      btnBorder: isSelected ? '#201C17' : '#E3C989',
      btnLabel: isSelected ? t.publicPage.selectedLabel : t.publicPage.selectLabel,
      onClick: () => setPublicSelectedService(isSelected ? null : i),
    };
  });
  const publicCtaLabel = publicSelectedService != null ? `${t.publicPage.cta} · ${t.publicPage.services[publicSelectedService].name}` : t.publicPage.cta;

  if (!onboarded) {
    return (
      <AppFrame>
        <OnboardingScreen t={t} onLanguageSelect={setLang} onProfessionSelect={setInventoryProfession} onFinish={finishOnboarding} />
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      {nav.tab === 'hoje' && !nav.detail && (
        <HomeScreen
          t={t}
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

      {nav.tab === 'agenda' && !nav.detail && <AgendaScreen t={t} agendaAppointments={agendaAppointments} onOpenSetup={() => nav.openDetail('agendaSetup')} />}
      {nav.tab === 'agenda' && nav.detail === 'agendaSetup' && (
        <AgendaSetupScreen t={t} onBack={nav.goBack} onOpenPublicPage={() => setShowPublicPreview(true)} />
      )}

      {nav.tab === 'crm' && !nav.detail && (
        <CrmListScreen
          t={t}
          crmStages={crmStages}
          crmClientsWithAttendance={crmClientsWithAttendance}
          attendanceCountLabel={attendanceCountLabel}
          conversionLabelValue={conversionLabelValue}
          attendanceLabels={{ yes: lang === 'pt' ? 'Compareceu' : 'Attended', no: lang === 'pt' ? 'Não compareceu' : 'No-show' }}
          onOpenProfile={(name) => {
            setSelectedClientName(name);
            nav.openDetail('crmProfile');
          }}
        />
      )}
      {nav.tab === 'crm' && nav.detail === 'crmProfile' && <CrmProfileScreen t={t} client={selectedClient} onBack={nav.goBack} />}

      {nav.tab === 'financeiro' && !nav.detail && <FinanceScreen t={t} />}

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
        <PublicPageScreen t={t} publicServices={publicServices} publicCtaLabel={publicCtaLabel} onClose={() => setShowPublicPreview(false)} />
      )}
    </AppFrame>
  );
}
