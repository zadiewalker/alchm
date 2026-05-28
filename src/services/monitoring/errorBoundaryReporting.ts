import { recordOperationalException } from '@/services/monitoring/telemetry';

type ErrorBoundaryContext = {
  boundaryName?: string;
  reloadCount: number;
};

export function reportErrorBoundaryException(
  error: Error,
  context: ErrorBoundaryContext
): void {
  recordOperationalException('ui_exception', error, {
    source: context.boundaryName || 'error_boundary',
    state: String(context.reloadCount),
  });
}
