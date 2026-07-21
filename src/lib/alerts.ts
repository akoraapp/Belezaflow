import { Calendar, Cake, MessageCircle, Package, Target, UserX, Users, type LucideIcon } from 'lucide-react';
import { getAvailability, fmtCurrency, todayIsBirthday, format } from './helpers';
import { productStatus } from '../screens/Estoque';
import type { Dict } from '../i18n';
import type { Appointment, Client, CurrencyCode, Product, Profile, ServiceItem } from '../types';

export interface AlertItem {
  key: string;
  icon: LucideIcon;
  title: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export interface AlertCallbacks {
  onOpenAgenda: () => void;
  onOpenClientesLost: () => void;
  onOpenEstoque: () => void;
  onOpenClientesLeads: () => void;
  onSendReminders: () => void;
  onFollowUpNoShow: (appointment: Appointment) => void;
}

interface BuildAlertsParams {
  profile: Profile;
  appointments: Appointment[];
  clients: Client[];
  services: ServiceItem[];
  products: Product[];
  currency: CurrencyCode;
  t: Dict;
  callbacks: AlertCallbacks;
}

/**
 * Single source of truth for every proactive alert/notification in the app.
 * Every item here is derived from real, currently-registered data — nothing
 * is shown unless the underlying condition is actually true right now.
 */
export function buildAlerts({ profile, appointments, clients, services, products, currency, t, callbacks }: BuildAlertsParams): AlertItem[] {
  const { today, isWorkingToday, availableSlots } = getAvailability(profile, appointments);

  const lostClients = clients.filter((c) => c.status === 'Perdido');
  const ticketBase =
    appointments.length > 0 ? appointments.reduce((s, a) => s + a.price, 0) / appointments.length : services.length > 0 ? services.reduce((s, x) => s + x.price, 0) / services.length : 0;
  const recoveryPotential = Math.round(lostClients.length * ticketBase);

  const pendingConfirmation = today.filter((a) => a.status === 'Agendado').length;
  const lowStockCount = products.filter((p) => productStatus(p) !== 'ok').length;
  const leads = clients.filter((c) => c.status === 'Novo Lead').length;
  const birthdayClients = clients.filter((c) => todayIsBirthday(c.birthday));

  const alerts: AlertItem[] = [];

  if (isWorkingToday && availableSlots.length > 0) {
    alerts.push({
      key: 'gaps',
      icon: Calendar,
      title: format(t.hoje.alertGapsMessage, { n: availableSlots.length }),
      ctaLabel: t.hoje.alertGapsCta,
      onCta: callbacks.onOpenAgenda,
    });
  }

  if (recoveryPotential > 0) {
    alerts.push({
      key: 'recovery',
      icon: Target,
      title: format(t.hoje.alertRecoveryMessage, { value: fmtCurrency(recoveryPotential, currency) }),
      ctaLabel: t.hoje.alertRecoveryCta,
      onCta: callbacks.onOpenClientesLost,
    });
  }

  if (pendingConfirmation > 0) {
    alerts.push({
      key: 'confirm',
      icon: MessageCircle,
      title: format(t.hoje.alertConfirmMessage, { n: pendingConfirmation }),
      ctaLabel: t.hoje.alertConfirmCta,
      onCta: callbacks.onSendReminders,
    });
  }

  if (lowStockCount > 0) {
    alerts.push({
      key: 'stock',
      icon: Package,
      title: format(t.hoje.alertStockMessage, { n: lowStockCount }),
      ctaLabel: t.hoje.alertStockCta,
      onCta: callbacks.onOpenEstoque,
    });
  }

  if (birthdayClients.length > 0) {
    alerts.push({
      key: 'birthday',
      icon: Cake,
      title: format(t.hoje.alertBirthdayMessage, { names: birthdayClients.map((c) => c.name).join(', ') }),
    });
  }

  if (leads > 0) {
    alerts.push({
      key: 'leads',
      icon: Users,
      title: format(t.hoje.alertLeadsMessage, { n: leads }),
      ctaLabel: t.hoje.alertLeadsCta,
      onCta: callbacks.onOpenClientesLeads,
    });
  }

  const noShows = appointments.filter((a) => a.status === 'NaoCompareceu' && !a.followUpSent);
  noShows.forEach((a) => {
    alerts.push({
      key: `noshow-${a.id}`,
      icon: UserX,
      title: format(t.hoje.alertNoShowMessage, { name: a.clientName, service: a.service }),
      ctaLabel: t.hoje.alertNoShowCta,
      onCta: () => callbacks.onFollowUpNoShow(a),
    });
  });

  return alerts;
}
