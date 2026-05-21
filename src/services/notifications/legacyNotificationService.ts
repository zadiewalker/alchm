'use client';

import { registerPlugin } from '@capacitor/core';

type ReminderType = 'morning' | 'evening' | 'return';

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
  morning: 1001,
  evening: 1002,
  return: 1003,
};

const REMINDER_MESSAGES = [
  { title: 'ALCHM', body: 'Khepera has a question for you today.', timeOfDay: 'morning' },
  { title: 'ALCHM', body: 'A quiet moment is waiting whenever you are.', timeOfDay: 'morning' },
  { title: 'ALCHM', body: 'What would you like to carry into today?', timeOfDay: 'morning' },
  { title: 'ALCHM', body: 'Your sanctuary is open.', timeOfDay: 'morning' },
  { title: 'ALCHM', body: 'There is no right time. Only your time.', timeOfDay: 'morning' },
  { title: 'ALCHM', body: 'How did today land?', timeOfDay: 'evening' },
  { title: 'ALCHM', body: 'Before the day closes, what do you want to name?', timeOfDay: 'evening' },
  { title: 'ALCHM', body: 'Khepera is here whenever you are ready.', timeOfDay: 'evening' },
  { title: 'ALCHM', body: 'Even one sentence is enough tonight.', timeOfDay: 'evening' },
  { title: 'ALCHM', body: 'The quiet is yours tonight.', timeOfDay: 'evening' },
  { title: 'ALCHM', body: 'No rush. Khepera is still here.', timeOfDay: 'return' },
  { title: 'ALCHM', body: "Your sanctuary doesn't keep score.", timeOfDay: 'return' },
  { title: 'ALCHM', body: 'Coming back is its own kind of courage.', timeOfDay: 'return' },
] as const;

function pickMessage(type: ReminderType) {
  const pool = REMINDER_MESSAGES.filter((item) => item.timeOfDay === type);
  return pool[Math.floor(Math.random() * pool.length)];
}

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

export async function scheduleDailyReminder(time: string, type: 'morning' | 'evening'): Promise<void> {
  try {
    const permitted = await checkNotificationPermission();
    if (!permitted) return;

    await cancelReminder(type);

    const [hours, minutes] = time.split(':').map((value) => Number.parseInt(value, 10));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const message = pickMessage(type);
    if (!message) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: ID_MAP[type],
          title: message.title,
          body: message.body,
          schedule: {
            on: { hour: hours, minute: minutes },
            repeats: true,
            allowWhileIdle: true,
          },
          sound: undefined,
          smallIcon: 'ic_notification',
          largeIcon: 'ic_notification',
        },
      ],
    });
  } catch {
    // no-op
  }
}

export async function scheduleReturnReminder(hoursFromNow = 48): Promise<void> {
  try {
    const permitted = await checkNotificationPermission();
    if (!permitted) return;

    await cancelReminder('return');

    const message = pickMessage('return');
    if (!message) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: ID_MAP.return,
          title: message.title,
          body: message.body,
          schedule: {
            at: new Date(Date.now() + Math.max(1, hoursFromNow) * 60 * 60 * 1000),
          },
        },
      ],
    });
  } catch {
    // no-op
  }
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
      notifications: [{ id: ID_MAP.morning }, { id: ID_MAP.evening }, { id: ID_MAP.return }],
    });
  } catch {
    // no-op
  }
}
