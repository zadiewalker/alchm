import * as Sentry from '@sentry/nextjs';
import { assertNoRawTextLeak, redactMonitoringPayload } from '@/services/privacy/assertNoRawTextLeak';

export type OperationalEvent =
  | 'app_startup_started'
  | 'app_startup_shell_visible'
  | 'app_startup_auth_ready'
  | 'app_startup_bootstrap_timeout'
  | 'app_startup_ready'
  | 'app_startup_fallback'
  | 'auth_bootstrap_started'
  | 'auth_bootstrap_step'
  | 'auth_bootstrap_timeout'
  | 'auth_bootstrap_ready'
  | 'auth_bootstrap_fallback'
  | 'auth_bootstrap_error'
  | 'submission_transition'
  | 'sync_issue'
  | 'raw_text_leak_guard'
  | 'khepera_validation_failure'
  | 'model_failure'
  | 'export_failure'
  | 'purchase_failure'
  | 'subscription_access'
  | 'restore_failure'
  | 'transformation_cta_tap'
  | 'subscription_options_scroll_requested'
  | 'subscription_options_scroll_success'
  | 'subscription_options_scroll_failed'
  | 'purchase_cta_tap'
  | 'purchase_cta_started'
  | 'purchase_cta_failed'
  | 'restore_cta_tap'
  | 'upgrade_options_tap'
  | 'footer_nav_tap'
  | 'internal_nav_tap'
  | 'support_failure'
  | 'notification_routing_failure'
  | 'first_write_started'
  | 'first_write_submitted'
  | 'crisis_resources_opened'
  | 'first_khepera_received'
  | 'ui_exception';

export interface OperationalPayload {
  localId?: string;
  state?: string;
  issue?: string;
  source?: string;
  step?: string;
  errorCode?: string;
  hasFirebaseUser?: boolean;
  hasCachedSession?: boolean;
  hasContainer?: boolean;
  hasAccess?: boolean;
  hasOffering?: boolean;
  surface?: 'dashboard' | 'settings' | 'mirror' | 'containers' | 'journal_limit' | 'onboarding' | 'upgrade';
  result?: string;
  feature?: string;
  route?: string;
  durationMs?: number;
  duration_ms?: number;
  timeoutMs?: number;
  configured?: boolean;
}

export interface SubscriptionAccessTelemetry {
  result: 'success' | 'timeout' | 'fallback';
  hasAccess: boolean;
  duration_ms: number;
  source: 'network' | 'cache' | 'fallback';
}

export const ALERT_DEFINITIONS = [
  'crash_spike',
  'failed_local_save_spike',
  'pending_sync_spike',
  'auth_required_spike',
  'khepera_validation_failure',
  'raw_text_leak_guard',
] as const;

export const MONITORING_DASHBOARD = [
  'submission_transition counts by state',
  'sync_issue counts by issue',
  'failed_local_save count',
  'pending_sync backlog',
  'auth_required sync failures',
  'khepera_validation_failure events',
  'raw_text_leak_guard events',
  'client/server/edge crash volume',
] as const;

export const SOURCE_MAP_PROCESS = {
  configFile: 'next.config.js',
  authTokenEnv: 'SENTRY_AUTH_TOKEN',
  releaseEnv: 'NEXT_PUBLIC_APP_VERSION',
  environmentEnv: 'NEXT_PUBLIC_ENV',
} as const;

function withSafeScope(run: (scope: Sentry.Scope) => void, fallbackMessage: string, fallbackError?: Error): void {
  if (typeof Sentry.withScope !== 'function') {
    if (fallbackError && typeof Sentry.captureException === 'function') {
      Sentry.captureException(fallbackError);
      return;
    }
    if (typeof Sentry.captureMessage === 'function') {
      Sentry.captureMessage(fallbackMessage, fallbackError ? 'error' : 'info');
    }
    return;
  }

  Sentry.withScope((scope) => {
    run(scope);
  });
}

function normalizeSubscriptionAccessResult(payload: OperationalPayload): SubscriptionAccessTelemetry['result'] {
  if (payload.result === 'timeout' || payload.state === 'timeout') {
    return 'timeout';
  }

  if (payload.result === 'fallback' || payload.state === 'fallback') {
    return 'fallback';
  }

  return 'success';
}

function normalizeSubscriptionAccessSource(payload: OperationalPayload): SubscriptionAccessTelemetry['source'] {
  if (payload.source === 'cache') {
    return 'cache';
  }

  if (payload.source === 'fallback' || payload.result === 'fallback' || payload.state === 'fallback') {
    return 'fallback';
  }

  return 'network';
}

function normalizeOperationalPayload(
  event: OperationalEvent,
  payload: OperationalPayload,
): OperationalPayload {
  if (event !== 'subscription_access') {
    return payload;
  }

  const normalized: OperationalPayload = {
    ...payload,
    result: normalizeSubscriptionAccessResult(payload),
    source: normalizeSubscriptionAccessSource(payload),
    duration_ms: payload.duration_ms ?? payload.durationMs ?? 0,
    hasAccess: payload.hasAccess ?? false,
  };

  return normalized;
}

export function recordOperationalEvent(event: OperationalEvent, payload: OperationalPayload): void {
  assertNoRawTextLeak(payload, `telemetry:${event}`);
  const safePayload = redactMonitoringPayload(normalizeOperationalPayload(event, payload));

  withSafeScope((scope) => {
    scope.setTag('app', 'alchm');
    scope.setTag('event', event);
    if (safePayload.state) scope.setTag('state', safePayload.state);
    if (safePayload.issue) scope.setTag('issue', safePayload.issue);
    scope.setContext('operational', safePayload as Record<string, unknown>);
    Sentry.captureMessage(`alchm.${event}`, 'info');
  }, `alchm.${event}`);
}

export function recordOperationalException(event: OperationalEvent, error: unknown, payload: OperationalPayload = {}): void {
  assertNoRawTextLeak(payload, `telemetry_error:${event}`);
  const safePayload = redactMonitoringPayload(payload);
  const safeError = error instanceof Error ? error : new Error(String(error));

  withSafeScope((scope) => {
    scope.setTag('app', 'alchm');
    scope.setTag('event', event);
    if (safePayload.state) scope.setTag('state', safePayload.state);
    if (safePayload.issue) scope.setTag('issue', safePayload.issue);
    scope.setContext('operational', safePayload as Record<string, unknown>);
    scope.setLevel('error');
    scope.setFingerprint(['alchm', event, safePayload.issue ?? 'none']);
    scope.captureException(safeError);
  }, `alchm.${event}`, safeError);
}

export function recordOperationalBreadcrumb(
  category: string,
  payload: OperationalPayload = {},
): void {
  assertNoRawTextLeak(payload, `telemetry_breadcrumb:${category}`);
  const safePayload = redactMonitoringPayload(payload);

  if (typeof Sentry.addBreadcrumb !== 'function') {
    return;
  }

  Sentry.addBreadcrumb({
    category: `alchm.${category}`,
    message: `alchm.${category}`,
    level: 'info',
    data: safePayload as Record<string, unknown>,
  });
}
