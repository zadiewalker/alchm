'use client';

import { registerPlugin } from '@capacitor/core';

type ReminderType = 'return';

type NotificationPermissionResult = {
  display?: 'granted' | 'denied' | 'prompt';
};

type LocalNotificationSchema = {
  id: number;
  title: string;
  body: string;
  schedule?: {
    on?: { hour: number; minute: number };
    at?: Date;
    repeats?: boolean;
    allowWhileIdle?: boolean;
  };
  sound?: string;
  smallIcon?: string;
  largeIcon?: string;
};

type LocalNotificationsPlugin = {
  requestPermissions: () => Promise<NotificationPermissionResult>;
  checkPermissions: () => Promise<NotificationPermissionResult>;
  schedule: (options: { notifications: LocalNotificationSchema[] }) => Promise<void>;
  cancel: (options: { notifications: Array<{ id: number }> }) => Promise<void>;
};

const LocalNotifications = registerPlugin<LocalNotificationsPlugin>('LocalNotifications');

const ID_MAP: Record<ReminderType, number> = {
  return: 1003,
};

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch {
    return false;
  }
}

export async function checkNotificationPermission(): Promise<boolean> {
  try {
    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(_time: string, _type: 'morning' | 'evening'): Promise<void> {
  return Promise.resolve();
}

export async function scheduleReturnReminder(_hoursFromNow = 48): Promise<void> {
  // Return reminders remain unavailable until explicit user-choice handling is verified.
  return Promise.resolve();
}

export async function cancelReminder(type: ReminderType): Promise<void> {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: ID_MAP[type] }] });
  } catch {
    // no-op
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: ID_MAP.return }],
    });
  } catch {
    // no-op
  }
}
