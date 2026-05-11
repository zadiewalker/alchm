import type {
  NotificationType,
  NotificationContext,
  NotificationCopyTemplate,
} from '@/types/notifications';

export const NOTIFICATION_COPY_TEMPLATES: Record<NotificationType, NotificationCopyTemplate> = {
  seedReturn: {
    type: 'seedReturn',
    titles: [
      'This came back.',
      'Something you wrote is here again.',
      'A return.',
    ],
    bodies: [
      'This came back from earlier.',
      'Something you wrote is here again.',
      'A return is here.',
    ],
    contextualBodies: {
      hasEntry: [
        'Something you wrote is here again.',
        'This came back from earlier.',
      ],
      hasContainer: [
        'Something from this container came back.',
        'A return is here.',
      ],
      firstTime: [
        'Something from your first writing came back.',
        'A return is here.',
      ],
      returning: [
        'This came back from earlier.',
        'Something you wrote is here again.',
      ],
    },
    supportedTokens: ['entryDate', 'containerName'],
  },
};

function selectVariation<T>(
  options: T[],
  context: NotificationContext,
  recentSelections: T[] = [],
): T {
  const availableOptions = options.length > recentSelections.length + 1
    ? options.filter((opt) => !recentSelections.includes(opt))
    : options;
  const selectionPool = availableOptions.length ? availableOptions : options;
  const seed = buildCopySeed(context);
  return selectionPool[seed % selectionPool.length];
}

function replaceTokens(text: string, context: NotificationContext): string {
  let result = text;

  if (context.entryDate) {
    const entryDate = new Date(context.entryDate);
    const dateStr = entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    result = result.replace(/\{entryDate\}/g, dateStr);
  }

  if (context.containerId) {
    result = result.replace(/\{containerName\}/g, 'this');
  }

  return result;
}

function getContextualBody(
  template: NotificationCopyTemplate,
  context: NotificationContext,
  recentCopy: string[] = [],
): string {
  let pool = template.bodies;

  if (context.containerId && template.contextualBodies?.hasContainer) {
    pool = template.contextualBodies.hasContainer;
  } else if (context.entryId && template.contextualBodies?.hasEntry) {
    pool = template.contextualBodies.hasEntry;
  } else if (template.contextualBodies?.returning) {
    pool = template.contextualBodies.returning;
  }

  return replaceTokens(selectVariation(pool, context, recentCopy), context);
}

export function generateNotificationCopy(
  type: NotificationType,
  context: NotificationContext,
  recentCopy?: { titles: string[]; bodies: string[] },
): { title: string; body: string } {
  const template = NOTIFICATION_COPY_TEMPLATES[type];
  const title = selectVariation(template.titles, context, recentCopy?.titles || []);
  const body = getContextualBody(template, context, recentCopy?.bodies || []);
  return { title, body };
}

function buildCopySeed(context: NotificationContext): number {
  const raw = `${context.entryId ?? ''}:${context.containerId ?? ''}:${context.entryDate ?? ''}:${context.returnType ?? ''}`;
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 33 + raw.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getNotificationTemplate(type: NotificationType): NotificationCopyTemplate {
  return NOTIFICATION_COPY_TEMPLATES[type];
}

export function validateNotificationCopy(title: string, body: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!title.trim()) issues.push('missing_title');
  if (!body.trim()) issues.push('missing_body');
  if (title.length > 60) issues.push('title_too_long');
  if (body.length > 140) issues.push('body_too_long');
  if (/\?$/.test(body.trim()) || /\?$/.test(title.trim())) issues.push('notification_must_not_ask_question');

  return {
    valid: issues.length === 0,
    issues,
  };
}
