import { hasExternalApiBaseUrl, getApiUrl } from '@/utils/api';
import { isEnhancedKheperaEnabledForUser } from '@/services/featureFlags';
import { isCrisisSignalPresent, CRISIS_RESPONSE } from './crisisDetection';
import { generateKheperaResponse } from './generateResponse';
import { generateEnhancedKheperaResponse } from './enhancedGeneration';
import { extractThemesFromEntry } from './extractThemes';
import type { KheperaResponse, KheperaUserContext } from '@/types/khepera';
import type { ReflectionTiming } from '@/types/khepera';
import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { CompanionTextRequest, CompanionTextResult } from './generateResponse';

export interface GenerateKheperaInput {
  entryText: string;
  userContext?: KheperaUserContext;
  signal?: AbortSignal;
  useEnhanced?: boolean;
  userId?: string | null;
  reflectionTiming?: ReflectionTiming;
}

export interface OnboardingKheperaResult {
  response: string;
  seed: string;
}

export async function generateSafeKheperaResponse(
  input: GenerateKheperaInput
): Promise<KheperaResponse> {
  const { entryText, userContext, signal, useEnhanced, userId } = input;

  if (isCrisisSignalPresent(entryText)) {
    return CRISIS_RESPONSE;
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
  options: { abortSignal?: AbortSignal } = {}
): Promise<OnboardingKheperaResult> {
  if (isCrisisSignalPresent(entry)) {
    return {
      response: `${CRISIS_RESPONSE.witness}\n\n${CRISIS_RESPONSE.perspective}`,
      seed: CRISIS_RESPONSE.seed,
    };
  }

  if (!hasExternalApiBaseUrl()) {
    return buildOnboardingFallback();
  }

  const response = await fetch(getApiUrl('/api/khepera/onboarding'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry }),
    signal: options.abortSignal,
  });

  if (!response.ok) {
    throw new Error(`Onboarding response failed: ${response.status}`);
  }

  return response.json() as Promise<OnboardingKheperaResult>;
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
  if (isCrisisSignalPresent(entryText)) {
    return {
      themes: [],
      tone: 'processing',
    };
  }

  return extractThemesFromEntry(entryText, kheperaResponse);
}

export async function generateCompanionText(
  request: CompanionTextRequest
): Promise<CompanionTextResult> {
  const { createModelText } = await import('./generateResponse');
  return createModelText(request);
}

export function buildOnboardingFallback(): OnboardingKheperaResult {
  return {
    response: "Something brought you here. That's worth paying attention to.",
    seed: 'What in this moment most wants not to be skipped past?',
  };
}
