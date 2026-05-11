import { detectCrisisSignals } from '@/services/khepera/crisisDetection';
import { requestAnthropicText } from './anthropicProvider';
import { requestOpenAIText } from './openAIProvider';
import type {
  GuardedModelTextResponse,
  ModelProviderName,
  ModelProviderRequest,
} from './types';

export function resolveAiProviderName(value = process.env.AI_PROVIDER): ModelProviderName {
  return value === 'openai' ? 'openai' : 'anthropic';
}

export async function requestModelText(
  request: ModelProviderRequest,
): Promise<GuardedModelTextResponse> {
  if (request.inputTextForSafety && detectCrisisSignals(request.inputTextForSafety)) {
    return {
      blockedByCrisis: true,
      text: null,
      provider: null,
      model: null,
    };
  }

  const provider = resolveAiProviderName();
  const result = provider === 'openai'
    ? await requestOpenAIText(request)
    : await requestAnthropicText(request);

  return {
    blockedByCrisis: false,
    ...result,
  };
}
