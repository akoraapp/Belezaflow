export type NotifPermission = NotificationPermission | 'unsupported';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotifPermission {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return Notification.permission;
  } catch {
    return 'unsupported';
  }
}

export async function requestNotificationPermission(): Promise<NotifPermission> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return getNotificationPermission();
  }
}

export function fireNotification(title: string, body: string) {
  if (!isNotificationSupported()) return;
  try {
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body, tag: body });
  } catch {
    // Some sandboxed/embedded contexts (e.g. a cross-origin iframe preview) throw
    // even when permission reads as granted — fail silently rather than crash the app.
  }
}
