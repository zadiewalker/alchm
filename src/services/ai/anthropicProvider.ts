import type { ModelTextResponse, ModelProviderRequest } from './types';

const ANTHROPIC_MODEL_TIMEOUT_MS = 20_000;
const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

function createTimeoutSignal(abortSignal?: AbortSignal): {
  signal?: AbortSignal;
  cleanup: () => void;
} {
  if (typeof AbortController === 'undefined') {
    return { signal: abortSignal, cleanup: () => undefined };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new DOMException('Anthropic request timed out', 'AbortError')),
    ANTHROPIC_MODEL_TIMEOUT_MS,
  );

  const abortHandler = () => controller.abort(abortSignal?.reason);
  if (abortSignal) {
    if (abortSignal.aborted) {
      controller.abort(abortSignal.reason);
    } else {
      abortSignal.addEventListener('abort', abortHandler, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      if (abortSignal) {
        abortSignal.removeEventListener('abort', abortHandler);
      }
    },
  };
}

export async function requestAnthropicText(
  request: ModelProviderRequest,
): Promise<ModelTextResponse> {
  const {
    system,
    prompt,
    model = DEFAULT_ANTHROPIC_MODEL,
    maxTokens = 460,
    temperature = 0.55,
    abortSignal,
  } = request;

  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const { signal, cleanup } = createTimeoutSignal(abortSignal);

  try {
    const response = await anthropic.messages.create(
      {
        model,
        max_tokens: maxTokens,
        temperature,
        ...(system ? { system } : {}),
        messages: [{ role: 'user', content: prompt }],
      },
      signal ? { signal } : undefined,
    );

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Anthropic');
    }

    return {
      text: content.text,
      provider: 'anthropic',
      model,
    };
  } finally {
    cleanup();
  }
}
