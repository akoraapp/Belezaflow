import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Scissors } from 'lucide-react';
import { T, CURRENCIES, RADIUS } from '../theme';
import { Card, Chip, PrimaryButton, TextInput, PhoneInput, SectionTitle } from '../components/primitives';
import { useLang } from '../lib/LangContext';
import { LANG_OPTIONS } from '../i18n';
import type { NotifPermission } from '../lib/notifications';
import type { CurrencyCode, Lang, Profile, ServiceItem } from '../types';

interface ConfigScreenProps {
  profile: Profile;
  services: ServiceItem[];
  onUpdateProfile: (patch: Partial<Profile>) => void;
  onOpenServicos: () => void;
  notifPermission: NotifPermission;
  onRequestNotifPermission: () => void;
  onSignOut: () => void;
}

type OpenRow = 'idioma' | 'moeda' | 'dados' | 'politicas' | 'notificacoes' | null;

export function ConfigScreen({ profile, services, onUpdateProfile, onOpenServicos, notifPermission, onRequestNotifPermission, onSignOut }: ConfigScreenProps) {
  const { t, lang, setLang } = useLang();
  const [openRow, setOpenRow] = useState<OpenRow>(null);

  const notifStatusLabel =
    notifPermission === 'granted'
      ? t.config.notifStatusGranted
      : notifPermission === 'denied'
        ? t.config.notifStatusDenied
        : notifPermission === 'unsupported'
          ? t.config.notifStatusUnsupported
          : t.config.notifStatusDefault;

  const toggle = (row: OpenRow) => setOpenRow((r) => (r === row ? null : row));

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ fontFamily: 'Playfair Display', fontSize: 25, fontWeight: 400, color: T.ink, marginBottom: 22 }}>{t.config.title}</div>

      <Card onClick={onOpenServicos} style={{ marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scissors size={16} color={T.goldDeep} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13.5, color: T.ink }}>{t.config.servicesRowTitle}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: T.muted }}>
            {services.length} {t.config.servicesCountSuffix}
          </div>
        </div>
        <ChevronRight size={16} color={T.muted} />
      </Card>

      <SectionTitle>{t.config.contactMethodTitle}</SectionTitle>
      <Card style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.muted, marginBottom: 10 }}>{t.config.contactMethodHint}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip active={(profile.contactMethod || 'whatsapp') === 'whatsapp'} onClick={() => onUpdateProfile({ contactMethod: 'whatsapp' })}>
            WhatsApp
          </Chip>
          <Chip active={profile.contactMethod === 'sms'} onClick={() => onUpdateProfile({ contactMethod: 'sms' })}>
            SMS
          </Chip>
        </div>
      </Card>

      <SectionTitle>{t.config.generalTitle}</SectionTitle>
      <Card style={{ padding: 0 }}>
        <div onClick={() => toggle('idioma')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: `1px solid ${T.line}`, cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.ink }}>{t.config.itemIdioma}</span>
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
                  borderRadius: RADIUS.control,
                  cursor: 'pointer',
                  border: `1.5px solid ${lang === opt.code ? T.gold : T.line}`,
                  background: T.surface,
                }}
              >
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13 }}>{opt.label}</span>
                {lang === opt.code && <Check size={14} color={T.goldDeep} />}
              </div>
            ))}
          </div>
        )}

        <div onClick={() => toggle('moeda')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${T.line}`, cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.ink }}>{t.config.itemMoeda}</span>
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
                  borderRadius: RADIUS.control,
                  cursor: 'pointer',
                  border: `1.5px solid ${profile.currency === c ? T.gold : T.line}`,
                  background: T.surface,
                }}
              >
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5 }}>
                  {c} {CURRENCIES[c].symbol}
                </span>
                {profile.currency === c && <Check size={13} color={T.goldDeep} />}
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => toggle('dados')}
          data-testid="config-dados-row"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${T.line}`, cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.ink }}>{t.config.itemDadosProfissional}</span>
          <ChevronDown size={15} color={T.muted} style={{ transform: openRow === 'dados' ? 'rotate(180deg)' : 'none' }} />
        </div>
        {openRow === 'dados' && (
          <div style={{ padding: '10px 16px 16px', borderBottom: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t.config.dadosProfissionalNomeLabel}</div>
              <TextInput value={profile.name} onChange={(v) => onUpdateProfile({ name: v })} testId="config-dados-nome" />
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t.config.dadosProfissionalContatoLabel}</div>
              <PhoneInput value={profile.whatsapp} onChange={(v) => onUpdateProfile({ whatsapp: v })} testId="config-dados-contato" />
            </div>
          </div>
        )}

        <div
          onClick={() => toggle('politicas')}
          data-testid="config-politicas-row"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${T.line}`, cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.ink }}>{t.config.itemPoliticasAgendamento}</span>
          <ChevronDown size={15} color={T.muted} style={{ transform: openRow === 'politicas' ? 'rotate(180deg)' : 'none' }} />
        </div>
        {openRow === 'politicas' && (
          <div style={{ padding: '10px 16px 16px', borderBottom: `1px solid ${T.line}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t.config.politicasBufferLabel}</div>
              <TextInput
                value={String(profile.bufferMinutes)}
                onChange={(v) => onUpdateProfile({ bufferMinutes: Number(v) || 0 })}
                numeric
                testId="config-politicas-buffer"
              />
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t.config.politicasCancelamentoLabel}</div>
              <TextInput
                value={String(profile.cancellationNoticeHours)}
                onChange={(v) => onUpdateProfile({ cancellationNoticeHours: Number(v) || 0 })}
                numeric
                testId="config-politicas-cancelamento"
              />
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 10.5, color: T.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t.config.politicasReagendamentoLabel}</div>
              <TextInput
                value={String(profile.rescheduleNoticeHours)}
                onChange={(v) => onUpdateProfile({ rescheduleNoticeHours: Number(v) || 0 })}
                numeric
                testId="config-politicas-reagendamento"
              />
            </div>
          </div>
        )}

        <div
          onClick={() => toggle('notificacoes')}
          data-testid="config-notif-row"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: 13.5, color: T.ink }}>{t.config.itemPrefNotificacoes}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 11.5, fontWeight: 700, color: notifPermission === 'granted' ? T.success : T.muted }}>{notifStatusLabel}</span>
            <ChevronDown size={15} color={T.muted} style={{ transform: openRow === 'notificacoes' ? 'rotate(180deg)' : 'none' }} />
          </div>
        </div>
        {openRow === 'notificacoes' && (
          <div style={{ padding: '10px 16px 16px' }}>
            {notifPermission === 'denied' && <div style={{ fontFamily: 'Inter', fontSize: 12, color: T.danger, marginBottom: 10, lineHeight: 1.5 }}>{t.config.notifDeniedHint}</div>}
            {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
              <PrimaryButton full onClick={onRequestNotifPermission} testId="config-notif-enable">
                {t.config.notifEnableCta}
              </PrimaryButton>
            )}
          </div>
        )}
      </Card>

      <div style={{ marginTop: 22 }}>
        <PrimaryButton full variant="secondary" onClick={onSignOut} testId="config-sign-out">
          {t.config.signOutCta}
        </PrimaryButton>
      </div>
    </div>
  );
}
