import { recordOperationalException } from '@/services/monitoring/telemetry';
import type { SupportFailureStep } from '@/types/support';

function getSafeError(error: unknown): Error {
  if (error instanceof Error) {
    return new Error(`${error.name}: ${error.message.slice(0, 160)}`);
  }

  return new Error('Unknown support failure');
}

export function triggerSupportFailure(params: {
  step: SupportFailureStep;
  error: unknown;
}): void {
  try {
    recordOperationalException('support_failure', getSafeError(params.error), {
      state: params.step,
    });
  } catch {
    console.error('[support_failure]', params.step);
  }
}
