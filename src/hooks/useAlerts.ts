import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useAppointments } from './useAppointments';
import { useClients } from './useClients';
import { useServices } from './useServices';
import { useInventory } from './useInventory';
import { buildAlerts, type AlertItem } from '../lib/alerts';
import { useLang } from '../lib/LangContext';
import { buildNoShowMessage, buildWhatsAppLink, buildConfirmationMessage, buildSmsLink } from '../lib/followup';
import { getNotificationPermission, requestNotificationPermission, fireNotification, type NotifPermission } from '../lib/notifications';
import { subscribeToPush } from '../lib/push';
import { PushService } from '../services/pushService';
import { todayDateStr, formatTimeLabel } from '../lib/helpers';
import type { Appointment, CurrencyCode } from '../types';

interface AlertsNav {
  onOpenAgenda: () => void;
  onOpenEstoque: () => void;
  onOpenClientesFiltered: (filter: string, clientId?: string | null) => void;
}

// Aggregates every module's data into the app's single alerts/notifications feed
// (consumed by Hoje, Notificações, and the nav badges) — this is the one place
// allowed to depend on every other module's hook, precisely so no other screen has to.
export function useAlerts(nav: AlertsNav, currency: CurrencyCode) {
  const { t, lang } = useLang();
  const { userId } = useAuth();
  const { profile } = useProfile();
  const { appointments, confirmAppointment, markFollowUpSent } = useAppointments();
  const { clients } = useClients();
  const { services } = useServices();
  const { products } = useInventory();
  const [notifPermission, setNotifPermission] = useState<NotifPermission>(() => getNotificationPermission());
  const [alertTimestamps, setAlertTimestamps] = useState<Record<string, number>>({});
  const seenAlertKeysRef = useRef<Set<string>>(new Set());

  const handleFollowUpNoShow = (appt: Appointment) => {
    if (appt.clientPhone) {
      const message = buildNoShowMessage(appt.clientName, appt.service, lang);
      const waLink = buildWhatsAppLink(appt.clientPhone, message);
      if (waLink) {
        window.open(waLink, '_blank', 'noopener,noreferrer');
        markFollowUpSent(appt.id);
        return;
      }
    }
    const client = clients.find((c) => (appt.clientPhone && c.phone === appt.clientPhone) || c.name === appt.clientName);
    nav.onOpenClientesFiltered('Perdido', client?.id ?? null);
  };

  // There's no real send-automation behind this — it used to just silently
  // flip every pending appointment to "Confirmado" locally, which lied about
  // a confirmation that never happened. With exactly one pending client we
  // can do what the button promises and open WhatsApp/SMS for her right
  // away (same message + logging as Agenda's own per-row confirm button);
  // with more than one there's no single link to open, so send her to
  // Agenda where each appointment already has that same real button.
  const handleSendReminders = () => {
    if (!profile) return;
    const todayStr = todayDateStr();
    const pending = appointments.filter((a) => a.day === todayStr && a.status === 'Agendado');
    const appt = pending.length === 1 ? pending[0] : null;
    if (appt && appt.clientPhone) {
      const clientPhone = appt.clientPhone;
      const [, m, d] = appt.day.split('-');
      const message = buildConfirmationMessage(profile.confirmationMessageTemplate, lang, {
        nome_cliente: appt.clientName,
        data: `${d}/${m}`,
        hora: formatTimeLabel(appt.time, lang),
        servico: appt.service,
        nome_profissional: profile.publicName || profile.name,
      });
      const channel = profile.contactMethod === 'sms' ? 'sms' : 'whatsapp';
      const link = channel === 'sms' ? buildSmsLink(clientPhone, message) : buildWhatsAppLink(clientPhone, message);
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
        confirmAppointment(appt.id, channel);
        return;
      }
    }
    nav.onOpenAgenda();
  };

  const alerts: AlertItem[] = profile
    ? buildAlerts({
        profile,
        appointments,
        clients,
        services,
        products,
        currency,
        t,
        callbacks: {
          onOpenAgenda: nav.onOpenAgenda,
          onOpenClientesLost: () => nav.onOpenClientesFiltered('Perdido'),
          onOpenEstoque: nav.onOpenEstoque,
          onOpenClientesLeads: () => nav.onOpenClientesFiltered('Novo Lead'),
          onSendReminders: handleSendReminders,
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
        newlyAppeared.forEach((a) => fireNotification('BelezaFlow', a.title));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertKeysJoined, notifPermission]);

  const requestNotifPermission = async () => {
    const result = await requestNotificationPermission();
    setNotifPermission(result);
    if (result === 'granted' && userId) {
      try {
        const subscription = await subscribeToPush();
        if (subscription) await PushService.saveSubscription(userId, subscription);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return { alerts, alertTimestamps, notifPermission, requestNotifPermission };
}
