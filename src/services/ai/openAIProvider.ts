import type { ModelTextResponse, ModelProviderRequest } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function extractOpenAIResponseText(payload: unknown): string {
  if (!isRecord(payload)) {
    return '';
  }
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  const contentParts = output
    .flatMap((item) => isRecord(item) && Array.isArray(item.content) ? item.content : [])
    .map((part) => isRecord(part) && part.type === 'output_text' && typeof part.text === 'string' ? part.text.trim() : '')
    .filter(Boolean);

  return contentParts.join('\n').trim();
}

export async function requestOpenAIText(
  _request: ModelProviderRequest,
): Promise<ModelTextResponse> {
  throw new Error('Direct client model-provider invocation is not available.');
}
