import type { ModelTextResponse, ModelProviderRequest } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const OPENAI_TIMEOUT_MS = 20_000;
const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';

type OpenAIResponsePayload = {
  model?: string;
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const KHEPERA_JSON_SCHEMA = {
  name: 'khepera_reflection',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      witness: { type: 'string' },
      perspective: { type: 'string' },
      seed: { type: 'string' },
    },
    required: ['witness', 'perspective', 'seed'],
    additionalProperties: false,
  },
} as const;

function createTimeoutSignal(abortSignal?: AbortSignal): {
  signal?: AbortSignal;
  cleanup: () => void;
} {
  if (typeof AbortController === 'undefined') {
    return { signal: abortSignal, cleanup: () => undefined };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new DOMException('OpenAI request timed out', 'AbortError')),
    OPENAI_TIMEOUT_MS,
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

export function extractOpenAIResponseText(payload: OpenAIResponsePayload): string {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const contentParts = (payload.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === 'output_text' && typeof part.text === 'string')
    .map((part) => part.text!.trim())
    .filter(Boolean);

  return contentParts.join('\n').trim();
}

export async function requestOpenAIText(
  request: ModelProviderRequest,
): Promise<ModelTextResponse> {
  const {
    system,
    prompt,
    model = process.env.OPENAI_KHEPERA_MODEL || DEFAULT_OPENAI_MODEL,
    maxTokens = 460,
    temperature = 0.55,
    responseFormat = 'text',
    abortSignal,
  } = request;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const body = {
    model,
    temperature,
    max_output_tokens: maxTokens,
    input: [
      { role: 'system', content: [{ type: 'input_text', text: system }] },
      { role: 'user', content: [{ type: 'input_text', text: prompt }] },
    ],
    text: responseFormat === 'khepera_json'
      ? {
          format: {
            type: 'json_schema',
            ...KHEPERA_JSON_SCHEMA,
          },
        }
      : {
          format: {
            type: 'text',
          },
        },
  };

  const { signal, cleanup } = createTimeoutSignal(abortSignal);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      throw new Error(`OpenAI Responses API failed: ${response.status}`);
    }

    const payload = (await response.json()) as OpenAIResponsePayload;
    const text = extractOpenAIResponseText(payload);

    if (!text) {
      throw new Error('OpenAI response contained no text output');
    }

    return {
      text,
      provider: 'openai',
      model: payload.model || model,
    };
  } finally {
    cleanup();
  }
}
