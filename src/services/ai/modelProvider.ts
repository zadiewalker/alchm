import { httpsCallable } from 'firebase/functions';
import { getFirebaseFunctions } from '@/services/firebase/firebaseService';
import { detectCrisisSignals } from '@/services/khepera/crisisDetection';
import type {
  CanonicalSessionPersistenceRequest,
  GuardedModelTextResponse,
  ModelProviderName,
  ModelProviderRequest,
  PrecomputedKheperaPersistenceRequest,
} from './types';
import type { KheperaResponse } from '@/types/khepera';

type GatewayResponse = GuardedModelTextResponse;

function isGatewayResponse(value: unknown): value is GatewayResponse {
  if (typeof value !== 'object' || value === null || !('blockedByCrisis' in value)) {
    return false;
  }

  if (value.blockedByCrisis === true) {
    return 'text' in value && value.text === null;
  }

  return value.blockedByCrisis === false
    && 'text' in value
    && typeof value.text === 'string'
    && 'provider' in value
    && value.provider === 'anthropic'
    && 'model' in value
    && typeof value.model === 'string';
}

export function resolveAiProviderName(): ModelProviderName {
  return 'anthropic';
}

export async function requestPersistedKheperaReflection(
  entryText: string,
  session: CanonicalSessionPersistenceRequest,
): Promise<KheperaResponse> {
  if (detectCrisisSignals(entryText)) {
    throw new Error('Crisis reflections are not persisted through the Khepera gateway.');
  }

  const invokeGateway = httpsCallable<{ entryText: string; session: CanonicalSessionPersistenceRequest }, unknown>(
    getFirebaseFunctions(),
    'generateKheperaReflection',
  );
  const result = await invokeGateway({ entryText, session });

  if (!isGatewayResponse(result.data) || result.data.blockedByCrisis) {
    throw new Error('Khepera gateway returned an invalid response.');
  }

  const parsed: unknown = JSON.parse(result.data.text);
  if (
    typeof parsed !== 'object'
    || parsed === null
    || !('witness' in parsed)
    || !('perspective' in parsed)
    || !('seed' in parsed)
    || typeof parsed.witness !== 'string'
    || typeof parsed.perspective !== 'string'
    || typeof parsed.seed !== 'string'
  ) {
    throw new Error('Khepera gateway returned an invalid response.');
  }

  return {
    witness: parsed.witness,
    perspective: parsed.perspective,
    seed: parsed.seed,
  };
}

export async function persistPrecomputedKheperaReflection(
  entryText: string,
  response: PrecomputedKheperaPersistenceRequest,
  session: CanonicalSessionPersistenceRequest,
): Promise<void> {
  if (detectCrisisSignals(entryText)) {
    throw new Error('Crisis reflections are not persisted through the Khepera gateway.');
  }

  const invokeGateway = httpsCallable<{
    entryText: string;
    session: CanonicalSessionPersistenceRequest;
    precomputedResponse: PrecomputedKheperaPersistenceRequest;
  }, unknown>(
    getFirebaseFunctions(),
    'generateKheperaReflection',
  );
  const result = await invokeGateway({ entryText, session, precomputedResponse: response });

  if (!isGatewayResponse(result.data) || result.data.blockedByCrisis) {
    throw new Error('Khepera gateway returned an invalid persistence response.');
  }
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

  if (request.responseFormat !== 'khepera_json' || !request.inputTextForSafety) {
    throw new Error('Server-authoritative secondary AI processing is unavailable in this build.');
  }

  const invokeGateway = httpsCallable<{ entryText: string }, unknown>(
    getFirebaseFunctions(),
    'generateKheperaReflection',
  );
  const result = await invokeGateway({ entryText: request.inputTextForSafety });

  if (!isGatewayResponse(result.data)) {
    throw new Error('Khepera gateway returned an invalid response.');
  }

  return result.data;
}
