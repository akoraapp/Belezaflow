import { sx } from '../lib/sx';
import { ClientMachineFlow } from '../components/ClientMachineFlow';
import type { Lang, Locale } from '../data/content';

interface ClientMachineScreenProps {
  t: Locale;
  lang: Lang;
  contentPresetObjective: string | null;
  onExit: () => void;
}

export function ClientMachineScreen({ t, lang, contentPresetObjective, onExit }: ClientMachineScreenProps) {
  return (
    <div style={sx('height:100%; display:flex; flex-direction:column; min-height:0;')}>
      <ClientMachineFlow t={t} lang={lang} presetObjective={contentPresetObjective} exitLabel={t.tabbar.mais} onExit={onExit} />
    </div>
  );
}
