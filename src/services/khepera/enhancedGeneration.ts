import { isCrisisSignalPresent, CRISIS_RESPONSE } from './crisisDetection';
import { generateKheperaResponse } from './generateResponse';
import type { KheperaUserContext, KheperaResponse } from '@/types/khepera';
import type { ReflectionTiming } from '@/types/khepera';

// Internal generator. Canonical callers should go through ./service.
// Enhanced mode now shares the adaptive pipeline to avoid divergence.

export async function generateEnhancedKheperaResponse(
  entryText: string,
  context?: KheperaUserContext,
  options: { abortSignal?: AbortSignal; reflectionTiming?: ReflectionTiming } = {}
): Promise<KheperaResponse> {
  if (isCrisisSignalPresent(entryText)) {
    return CRISIS_RESPONSE;
  }

  return generateKheperaResponse(entryText, context, options);
}
