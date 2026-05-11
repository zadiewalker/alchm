import {
  buildOnboardingFallback as buildOnboardingFallbackFromService,
  generateSafeOnboardingKheperaResponse as generateOnboardingKheperaResponseFromService,
} from './service';
import type { OnboardingKheperaResult } from './service';

export type { OnboardingKheperaResult } from './service';

export async function generateOnboardingKheperaResponse(
  entry: string,
  options: { abortSignal?: AbortSignal } = {}
): Promise<OnboardingKheperaResult> {
  return generateOnboardingKheperaResponseFromService(entry, options);
}

export function buildOnboardingFallback(): OnboardingKheperaResult {
  return buildOnboardingFallbackFromService();
}
