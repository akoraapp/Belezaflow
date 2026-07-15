import { useState, type ChangeEvent } from 'react';
import { sx } from './lib/sx';
import { content, type Lang } from './data/content';
import { Onboarding } from './sections/Onboarding';
import { Today } from './sections/Today';
import { ClientMachine } from './sections/ClientMachine';
import { Crm } from './sections/Crm';
import { AgendaSetup } from './sections/AgendaSetup';
import { PublicPage } from './sections/PublicPage';
import { Agenda } from './sections/Agenda';
import { Financeiro } from './sections/Financeiro';
import { Inventory } from './sections/Inventory';
import { Relatorios } from './sections/Relatorios';
import { Ia } from './sections/Ia';
import { Config } from './sections/Config';
import type { HojeQuickAction, ReadyResponseWithCopy } from './sections/Today';
import type { CrmStage, CrmClientWithAttendance } from './sections/Crm';
import type { PublicService } from './sections/PublicPage';
import type { AgendaAppointment } from './sections/Agenda';

const AGENDA_STATUS_STYLE: Record<string, { statusColor: string; badgeBg: string; badgeColor: string }> = {
  confirmed: { statusColor: '#B98D3E', badgeBg: '#FBF3E4', badgeColor: '#8A6A2E' },
  done: { statusColor: '#C7BEAC', badgeBg: '#F2ECDF', badgeColor: '#8A8074' },
  pending: { statusColor: '#201C17', badgeBg: '#ECE7DC', badgeColor: '#201C17' },
};

function parseNum(s: string): number {
  return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
}

function fmtCurrency(lang: Lang, n: number): string {
  return lang === 'pt' ? `R$ ${n.toLocaleString('pt-BR')}` : `$${n.toLocaleString('en-US')}`;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('pt');
  const [crmFilter, setCrmFilter] = useState('todos');
  const [publicSelectedService, setPublicSelectedService] = useState<number | null>(null);
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

  const t = content[lang];

  function markAttendance(name: string, status: 'yes' | 'no') {
    setAttendance((a) => ({ ...a, [name]: status }));
  }

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

  // Hoje quick actions
  const nextApptName = t.agenda.appointments[0]?.client ?? '';
  const nextApptAttended = attendance[nextApptName] === 'yes';
  const goToClientMachine = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const hojeQuickActions: HojeQuickAction[] = [
    {
      key: 'content',
      label: t.today.quickActions.createContent,
      bg: '#201C17',
      border: '#201C17',
      color: '#F4E9D2',
      onClick: goToClientMachine,
    },
    {
      key: 'attendance',
      label: nextApptAttended ? t.today.quickActions.registeredDone : t.today.quickActions.registerAttendance,
      bg: nextApptAttended ? '#FBF3E4' : '#FFFFFF',
      border: nextApptAttended ? '#E3C989' : '#EBE2CF',
      color: nextApptAttended ? '#8A6A2E' : '#26221D',
      onClick: () => markAttendance(nextApptName, 'yes'),
    },
    {
      key: 'finance',
      label: t.today.quickActions.goFinance,
      bg: '#FFFFFF',
      border: '#EBE2CF',
      color: '#26221D',
      onClick: goToClientMachine,
    },
    {
      key: 'client',
      label: t.today.quickActions.newClient,
      bg: '#FFFFFF',
      border: '#EBE2CF',
      color: '#26221D',
      onClick: goToClientMachine,
    },
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
    lang === 'pt'
      ? `Faltam ${fmtCurrency(lang, goalRemainingNum)} para bater a meta`
      : `${fmtCurrency(lang, goalRemainingNum)} left to hit your goal`;

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
    const el = document.querySelector('[data-screen-label="Máquina de Clientes"]');
    el?.scrollIntoView({ block: 'start' });
  };

  // Estoque Inteligente (fixed to the "lash" profession, as in the source prototype)
  const invData = t.inventory.productsByProfession.lash;
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
  const allProductsRaw = invData.products.concat(extraProducts).map((p) => ({
    ...p,
    isLow: p.qty <= p.minQty,
    isOut: p.qty <= 0,
  }));
  const inventoryTotalInvestedNum = allProductsRaw.reduce((sum, p) => sum + (p.purchaseValue || 0), 0);
  const inventoryTotalInvested = fmtCurrency(lang, inventoryTotalInvestedNum);
  const inventoryProductCountLabel =
    lang === 'pt' ? `${allProductsRaw.length} produtos cadastrados` : `${allProductsRaw.length} products registered`;

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
  const publicCtaLabel =
    publicSelectedService != null ? `${t.publicPage.cta} · ${t.publicPage.services[publicSelectedService].name}` : t.publicPage.cta;

  const toggleLang = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'));
  const ptStyle = { color: lang === 'pt' ? '#201C17' : '#B7AE9C' };
  const enStyle = { color: lang === 'en' ? '#201C17' : '#B7AE9C' };

  return (
    <div style={sx("font-family:'Manrope',sans-serif; background:#FAF7F0; min-height:100vh; color:#26221D;")}>
      {/* TOP BAR */}
      <div
        style={sx(
          'position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:22px 48px; background:rgba(250,247,240,0.86); backdrop-filter:blur(10px); border-bottom:1px solid #EBE2CF;',
        )}
      >
        <div style={sx('display:flex; align-items:center; gap:12px;')}>
          <div style={sx('width:34px; height:34px; border-radius:50%; border:1.5px solid #B98D3E; display:flex; align-items:center; justify-content:center;')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98D3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M6 6l2.2 2.2M15.8 15.8 18 18M18 6l-2.2 2.2M8.2 15.8 6 18"></path>
            </svg>
          </div>
          <div style={sx("font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; letter-spacing:0.5px;")}>{t.brand.name}</div>
        </div>
        <div style={sx('display:flex; align-items:center; gap:22px;')}>
          <div style={sx('font-size:13px; color:#8A8074; letter-spacing:0.3px;')}>{t.brand.tagline}</div>
          <div
            onClick={toggleLang}
            style={sx(
              'cursor:pointer; display:flex; align-items:center; gap:8px; padding:8px 16px; border:1px solid #D8C79E; border-radius:999px; font-size:13px; font-weight:600; letter-spacing:0.5px;',
            )}
          >
            <span style={ptStyle}>PT</span>
            <span style={sx('color:#D8C79E;')}>/</span>
            <span style={enStyle}>EN</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={sx('padding:72px 48px 56px; max-width:900px;')}>
        <div style={sx('font-size:13px; letter-spacing:3px; text-transform:uppercase; color:#B98D3E; font-weight:700; margin-bottom:18px;')}>{t.hero.kicker}</div>
        <div style={sx("font-family:'Cormorant Garamond',serif; font-size:56px; line-height:1.08; font-weight:600; color:#201C17; margin-bottom:22px;")}>
          {t.hero.title}
        </div>
        <div style={sx('font-size:18px; line-height:1.6; color:#6B6459; max-width:640px;')}>{t.hero.subtitle}</div>
      </div>

      <Onboarding t={t} />

      <Today
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

      <ClientMachine t={t} lang={lang} contentPresetObjective={contentPresetObjective} />

      <Crm
        t={t}
        crmStages={crmStages}
        crmClientsWithAttendance={crmClientsWithAttendance}
        attendanceCountLabel={attendanceCountLabel}
        conversionLabelValue={conversionLabelValue}
        attendanceLabels={{ yes: lang === 'pt' ? 'Compareceu' : 'Attended', no: lang === 'pt' ? 'Não compareceu' : 'No-show' }}
      />

      <AgendaSetup t={t} />

      <PublicPage t={t} publicServices={publicServices} publicCtaLabel={publicCtaLabel} />

      <Agenda t={t} agendaAppointments={agendaAppointments} />

      <Financeiro t={t} />

      <Inventory
        t={t}
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

      <Relatorios t={t} />

      <Ia t={t} />

      <Config t={t} />
    </div>
  );
}
