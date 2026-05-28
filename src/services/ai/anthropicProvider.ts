import type { ModelTextResponse, ModelProviderRequest } from './types';

export async function requestAnthropicText(
  _request: ModelProviderRequest,
): Promise<ModelTextResponse> {
  throw new Error('Direct client model-provider invocation is not available.');
}
