import { isEnhancedKheperaEnabledForUser } from '@/services/featureFlags';
import { detectCrisisSignals, CRISIS_RESPONSE } from './crisisDetection';
import { generateKheperaResponse } from './generateResponse';
import { generateEnhancedKheperaResponse } from './enhancedGeneration';
import { extractThemesFromEntry } from './extractThemes';
import { requestPersistedKheperaReflection } from '@/services/ai/modelProvider';
import type { KheperaResponse, KheperaUserContext } from '@/types/khepera';
import type { ReflectionTiming } from '@/types/khepera';
import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { CanonicalSessionPersistenceRequest } from '@/services/ai/types';

export interface GenerateKheperaInput {
  entryText: string;
  userContext?: KheperaUserContext;
  signal?: AbortSignal;
  useEnhanced?: boolean;
  userId?: string | null;
  reflectionTiming?: ReflectionTiming;
  canonicalSession?: CanonicalSessionPersistenceRequest;
}

export interface OnboardingKheperaResult {
  response: string;
  seed: string;
}

export async function generateSafeKheperaResponse(
  input: GenerateKheperaInput
): Promise<KheperaResponse> {
  const { entryText, userContext, signal, useEnhanced, userId } = input;

  if (detectCrisisSignals(entryText)) {
    return CRISIS_RESPONSE;
  }

  if (input.canonicalSession) {
    return requestPersistedKheperaReflection(entryText, input.canonicalSession);
  }

  const effectiveUseEnhanced = useEnhanced ?? (userId ? isEnhancedKheperaEnabledForUser(userId) : false);

  return effectiveUseEnhanced
    ? generateEnhancedKheperaResponse(entryText, userContext, { abortSignal: signal, reflectionTiming: input.reflectionTiming })
    : generateKheperaResponse(entryText, userContext, { abortSignal: signal, reflectionTiming: input.reflectionTiming });
}

export async function generateJournalKheperaResponse(
  entryText: string,
  userContext?: KheperaUserContext,
  options: { abortSignal?: AbortSignal; userId?: string | null } = {}
): Promise<KheperaResponse> {
  const useEnhanced = options.userId ? isEnhancedKheperaEnabledForUser(options.userId) : false;
  return generateSafeKheperaResponse({
    entryText,
    userContext,
    signal: options.abortSignal,
    useEnhanced,
    userId: options.userId,
  });
}

export async function generateSafeOnboardingKheperaResponse(
  entry: string,
  _options: { abortSignal?: AbortSignal } = {}
): Promise<OnboardingKheperaResult> {
  if (detectCrisisSignals(entry)) {
    return {
      response: `${CRISIS_RESPONSE.witness}\n\n${CRISIS_RESPONSE.perspective}`,
      seed: CRISIS_RESPONSE.seed,
    };
  }

  // Onboarding remains local until it is covered by the authenticated gateway contract.
  return buildOnboardingFallback();
}

export async function generateOnboardingKheperaResponse(
  entry: string,
  options: { abortSignal?: AbortSignal } = {}
): Promise<OnboardingKheperaResult> {
  return generateSafeOnboardingKheperaResponse(entry, options);
}

export async function extractThemesForKheperaEntry(
  entryText: string,
  kheperaResponse: string
): Promise<{ themes: ThemeTag[]; tone: EmotionalTone }> {
  if (detectCrisisSignals(entryText)) {
    return {
      themes: [],
      tone: 'processing',
    };
  }

  return extractThemesFromEntry(entryText, kheperaResponse);
}

export function buildOnboardingFallback(): OnboardingKheperaResult {
  return {
    response: "Something brought you here. That's worth paying attention to.",
    seed: 'What in this moment most wants not to be skipped past?',
  };
}
