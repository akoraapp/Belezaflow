import { useState } from 'react';

export type Tab = 'hoje' | 'agenda' | 'crm' | 'financeiro' | 'mais';

export type Detail = 'agendaSetup' | 'crmProfile' | 'clientMachine' | 'inventory' | 'relatorios' | 'ia' | 'config';

interface NavState {
  tab: Tab;
  detail: Detail | null;
}

export function useNavigator() {
  const [state, setState] = useState<NavState>({ tab: 'hoje', detail: null });

  function goTab(tab: Tab) {
    setState({ tab, detail: null });
  }

  function openDetail(detail: Detail) {
    setState((s) => ({ ...s, detail }));
  }

  function goBack() {
    setState((s) => ({ ...s, detail: null }));
  }

  return { tab: state.tab, detail: state.detail, goTab, openDetail, goBack };
}
