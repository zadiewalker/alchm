import type {
  NotificationType,
  SchedulingRule,
  NotificationContext,
  ScheduledNotification,
} from '@/types/notifications';

export const SCHEDULING_RULES: Record<NotificationType, SchedulingRule> = {
  seedReturn: {
    type: 'seedReturn',
    delayHours: {
      min: 48,
      max: 72,
    },
    allowedHours: {
      start: 9,
      end: 20,
    },
    maxPerDay: 1,
    maxPerWeek: 3,
    cooldownHours: 24,
    requiresJournalEntry: true,
    skipOnWeekends: false,
    skipOnHolidays: true,
  },
};

const US_HOLIDAYS = [
  '2024-12-25', '2025-01-01', '2025-01-20', '2025-02-17', '2025-05-26',
  '2025-07-04', '2025-09-01', '2025-10-13', '2025-11-11', '2025-11-27', '2025-12-25',
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-05-25', '2026-07-03', '2026-09-07',
  '2026-10-12', '2026-11-11', '2026-11-26', '2026-12-25',
];

function isHoliday(date: Date): boolean {
  return US_HOLIDAYS.includes(date.toISOString().split('T')[0]);
}

export function calculateDeliveryTime(
  type: NotificationType,
  context: NotificationContext,
  baseTime: Date = new Date(),
): Date | null {
  const rule = SCHEDULING_RULES[type];
  const seed = buildDeterministicSeed(type, context);
  const delaySpan = Math.max(0, rule.delayHours.max - rule.delayHours.min);
  const delayHours = rule.delayHours.min + (seed % (delaySpan + 1));
  const deliveryTime = new Date(baseTime.getTime() + delayHours * 60 * 60 * 1000);
  const allowedHourSpan = rule.allowedHours.end - rule.allowedHours.start;
  const hourOffset = allowedHourSpan > 0 ? seed % (allowedHourSpan + 1) : 0;
  const minute = (seed * 7) % 60;

  deliveryTime.setHours(rule.allowedHours.start + hourOffset);
  deliveryTime.setMinutes(minute);
  deliveryTime.setSeconds(0);
  deliveryTime.setMilliseconds(0);

  if (rule.skipOnHolidays && isHoliday(deliveryTime)) {
    deliveryTime.setDate(deliveryTime.getDate() + 1);
    return calculateDeliveryTime(type, context, deliveryTime);
  }

  return deliveryTime;
}

function buildDeterministicSeed(type: NotificationType, context: NotificationContext): number {
  const raw = `${type}:${context.entryId ?? ''}:${context.containerId ?? ''}:${context.entryDate ?? ''}`;
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function canScheduleNotification(
  type: NotificationType,
  context: NotificationContext,
  recentNotifications: ScheduledNotification[],
): { allowed: boolean; reason?: string; nextAllowedAt?: Date } {
  const rule = SCHEDULING_RULES[type];
  const now = new Date();

  if (rule.requiresJournalEntry && !context.entryId) {
    return { allowed: false, reason: 'Requires a journal entry context' };
  }

  const relevantNotifications = recentNotifications.filter((n) => n.config.type === type);

  if (rule.maxPerDay) {
    const todayNotifications = relevantNotifications.filter((n) => new Date(n.scheduledAt).toDateString() === now.toDateString());
    if (todayNotifications.length >= rule.maxPerDay) {
      const nextAllowedAt = new Date(now);
      nextAllowedAt.setDate(nextAllowedAt.getDate() + 1);
      nextAllowedAt.setHours(9, 0, 0, 0);
      return { allowed: false, reason: `Daily limit of ${rule.maxPerDay} reached`, nextAllowedAt };
    }
  }

  if (rule.maxPerWeek) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekNotifications = relevantNotifications.filter((n) => new Date(n.scheduledAt) >= weekStart);
    if (weekNotifications.length >= rule.maxPerWeek) {
      const nextAllowedAt = new Date(weekStart);
      nextAllowedAt.setDate(nextAllowedAt.getDate() + 7);
      return { allowed: false, reason: `Weekly limit of ${rule.maxPerWeek} reached`, nextAllowedAt };
    }
  }

  if (rule.cooldownHours && relevantNotifications.length > 0) {
    const lastNotification = relevantNotifications.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];
    const cooldownEnd = new Date(new Date(lastNotification.scheduledAt).getTime() + rule.cooldownHours * 60 * 60 * 1000);
    if (now < cooldownEnd) {
      return { allowed: false, reason: `Cooldown period active for ${rule.cooldownHours} hours`, nextAllowedAt: cooldownEnd };
    }
  }

  return { allowed: true };
}

export function getSchedulingRule(type: NotificationType): SchedulingRule {
  return SCHEDULING_RULES[type];
}

export function getRecommendedNotificationTypes(
  context: NotificationContext,
  recentNotifications: ScheduledNotification[],
): NotificationType[] {
  if (context.entryId && canScheduleNotification('seedReturn', context, recentNotifications).allowed) {
    return ['seedReturn'];
  }
  return [];
}
