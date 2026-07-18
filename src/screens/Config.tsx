import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Scissors } from 'lucide-react';
import { T, CURRENCIES } from '../theme';
import { Card, Chip } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { LANG_OPTIONS } from '../i18n';
import type { CurrencyCode, Lang, Profile, ServiceItem } from '../types';

interface ConfigScreenProps {
  profile: Profile;
  services: ServiceItem[];
  onUpdateProfile: (patch: Partial<Profile>) => void;
  onOpenServicos: () => void;
}

export function ConfigScreen({ profile, services, onUpdateProfile, onOpenServicos }: ConfigScreenProps) {
  const { t, lang, setLang } = useLang();
  const [openRow, setOpenRow] = useState<'idioma' | 'moeda' | null>(null);

  const staticItems: string[] = [
    t.config.itemDadosProfissional,
    t.config.itemFoto,
    t.config.itemLogo,
    t.config.itemTempoAtendimentos,
    t.config.itemRegrasCancelamento,
    t.config.itemRegrasReagendamento,
    t.config.itemPrefNotificacoes,
    t.config.itemMetaFinanceira,
  ];

  return (
    <div style={{ padding: '22px 20px 100px' }}>
      <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: T.ink, marginBottom: 16 }}>{t.config.title}</div>

      <Card onClick={onOpenServicos} style={{ marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scissors size={16} color={T.goldDeep} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: T.ink }}>{t.config.servicesRowTitle}</div>
          <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: T.muted }}>
            {services.length} {t.config.servicesCountSuffix}
          </div>
        </div>
        <ChevronRight size={16} color={T.muted} />
      </Card>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{t.config.contactMethodTitle}</div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.muted, marginBottom: 10 }}>{t.config.contactMethodHint}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip active={(profile.contactMethod || 'whatsapp') === 'whatsapp'} onClick={() => onUpdateProfile({ contactMethod: 'whatsapp' })}>
            WhatsApp
          </Chip>
          <Chip active={profile.contactMethod === 'sms'} onClick={() => onUpdateProfile({ contactMethod: 'sms' })}>
            SMS
          </Chip>
        </div>
      </Card>

      <div style={{ fontFamily: 'Fraunces', fontSize: 15.5, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{t.config.generalTitle}</div>
      <Card style={{ padding: 0 }}>
        <div
          onClick={() => setOpenRow((r) => (r === 'idioma' ? null : 'idioma'))}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${T.line}`, cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink }}>{t.config.itemIdioma}</span>
          <ChevronDown size={15} color={T.muted} style={{ transform: openRow === 'idioma' ? 'rotate(180deg)' : 'none' }} />
        </div>
        {openRow === 'idioma' && (
          <div style={{ padding: '10px 16px 16px', borderBottom: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LANG_OPTIONS.map((opt) => (
              <div
                key={opt.code}
                onClick={() => setLang(opt.code as Lang)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: `1.5px solid ${lang === opt.code ? T.gold : T.line}`,
                  background: lang === opt.code ? T.goldSoft : 'transparent',
                }}
              >
                <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13 }}>{opt.label}</span>
                {lang === opt.code && <Check size={14} color={T.goldDeep} />}
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => setOpenRow((r) => (r === 'moeda' ? null : 'moeda'))}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${T.line}`, cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink }}>{t.config.itemMoeda}</span>
          <ChevronDown size={15} color={T.muted} style={{ transform: openRow === 'moeda' ? 'rotate(180deg)' : 'none' }} />
        </div>
        {openRow === 'moeda' && (
          <div style={{ padding: '10px 16px 16px', borderBottom: `1px solid ${T.line}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
              <div
                key={c}
                onClick={() => onUpdateProfile({ currency: c })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: `1.5px solid ${profile.currency === c ? T.gold : T.line}`,
                  background: profile.currency === c ? T.goldSoft : 'transparent',
                }}
              >
                <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12.5 }}>
                  {c} {CURRENCIES[c].symbol}
                </span>
                {profile.currency === c && <Check size={13} color={T.goldDeep} />}
              </div>
            ))}
          </div>
        )}

        {staticItems.map((it, i) => (
          <div
            key={it}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < staticItems.length - 1 ? `1px solid ${T.line}` : 'none', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: 'Manrope', fontSize: 13.5, color: T.ink }}>{it}</span>
            <ChevronRight size={15} color={T.muted} />
          </div>
        ))}
      </Card>
    </div>
  );
}
