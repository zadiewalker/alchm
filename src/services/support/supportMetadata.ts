import { BUILD_STAMP } from '@/config/buildInfo';
import { getPlatform } from '@/services/platform/platformService';
import type { DiagnosticsOptInState, SupportDiagnosticsMetadata, SupportPlatform } from '@/types/support';

function normalizePlatform(platform: string): SupportPlatform {
  if (platform === 'ios') return 'ios';
  if (platform === 'web') return 'web';
  return 'unknown';
}

export function buildSupportDiagnosticsMetadata(
  diagnostics: DiagnosticsOptInState
): SupportDiagnosticsMetadata | undefined {
  if (!diagnostics.includeDiagnostics) {
    return undefined;
  }

  return {
    appBuild: BUILD_STAMP,
    platform: normalizePlatform(getPlatform()),
    locale: typeof navigator !== 'undefined' ? navigator.language : undefined,
  };
}
