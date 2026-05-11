const RAW_TEXT_KEYS = new Set([
  'entryText',
  'content',
  'body',
  'response',
  'request',
  'message',
]);

function looksLikeJournalText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 120) return false;
  const whitespaceWords = trimmed.split(/\s+/).length;
  return whitespaceWords >= 20;
}

function scan(value: unknown, path: string[] = []): string | null {
  if (typeof value === 'string') {
    return looksLikeJournalText(value) ? path.join('.') || 'root' : null;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  for (const [key, next] of Object.entries(value as Record<string, unknown>)) {
    const nextPath = [...path, key];
    if (RAW_TEXT_KEYS.has(key) && typeof next === 'string' && looksLikeJournalText(next)) {
      return nextPath.join('.');
    }

    const nested = scan(next, nextPath);
    if (nested) return nested;
  }

  return null;
}

export function assertNoRawTextLeak(payload: unknown, boundary: string): void {
  const match = scan(payload);
  if (!match) return;

  const error = new Error(`raw_text_leak_detected:${boundary}:${match}`);
  void import('@sentry/nextjs').then((Sentry) => {
    Sentry.captureMessage('alchm.raw_text_leak_guard', {
      level: 'error',
      extra: { boundary, path: match },
    });
  }).catch(() => {});
  if (process.env.NODE_ENV !== 'production') {
    throw error;
  }
}

export function redactMonitoringPayload<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const clone = Array.isArray(payload) ? [...payload] : { ...(payload as Record<string, unknown>) };

  for (const key of Object.keys(clone)) {
    const value = (clone as Record<string, unknown>)[key];
    if (RAW_TEXT_KEYS.has(key) && typeof value === 'string') {
      (clone as Record<string, unknown>)[key] = '[redacted]';
      continue;
    }

    if (value && typeof value === 'object') {
      (clone as Record<string, unknown>)[key] = redactMonitoringPayload(value);
    }
  }

  return clone as T;
}
