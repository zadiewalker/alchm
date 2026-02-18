'use client';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const TIMEOUT_MS = 30_000;

interface ReflectionSuccess {
  text: string;
  error: null;
}

interface ReflectionFailure {
  text: null;
  error: string;
}

export type ReflectionResult = ReflectionSuccess | ReflectionFailure;

type AnthropicResponse = {
  content?: Array<{ type?: string; text?: string }>;
};

function extractAnthropicText(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const maybe = data as AnthropicResponse;
  const text = maybe.content?.[0]?.text;
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  return trimmed.length ? trimmed : null;
}

type AnthropicMessage = { role: 'user' | 'assistant'; content: string };

async function anthropicText(args: {
  apiKey: string;
  model: string;
  system: string;
  messages: AnthropicMessage[];
  maxTokens: number;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const { apiKey, model, system, messages, maxTokens } = args;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Explicitly required for direct-from-browser usage (no server proxy).
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      if (res.status === 429) return { ok: false, error: 'Khepera needs a moment. Try again shortly.' };
      if (res.status === 401) return { ok: false, error: "Khepera can't connect right now. Your entry is saved." };
      return { ok: false, error: "Khepera couldn't connect. Your entry is saved safely." };
    }

    const json: unknown = await res.json();
    const text = extractAnthropicText(json);
    if (!text) return { ok: false, error: "Khepera listened but couldn't form a response. Try again." };
    return { ok: true, text };
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === 'AbortError') {
      return { ok: false, error: 'Khepera is taking too long. Your entry is saved — try again later.' };
    }
    return { ok: false, error: 'No connection. Your entry is saved safely on your device.' };
  }
}

export async function getReflection(args: {
  systemPrompt: string;
  userMessage: string;
  apiKey: string;
  maxTokens?: number;
}): Promise<ReflectionResult> {
  const { systemPrompt, userMessage, apiKey, maxTokens } = args;

  if (!apiKey) {
    return { text: null, error: 'Khepera is resting. Reflections will return soon.' };
  }
  if (!userMessage.trim()) {
    return { text: null, error: 'Write something first — even one sentence is enough.' };
  }

  const result = await anthropicText({
    apiKey,
    model: MODEL,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    maxTokens: typeof maxTokens === 'number' && Number.isFinite(maxTokens) ? Math.max(64, Math.floor(maxTokens)) : 1024,
  });

  if (!result.ok) return { text: null, error: result.error };
  return { text: result.text, error: null };
}

export async function getExtractionText(args: {
  systemPrompt: string;
  userMessage: string;
  apiKey: string;
  model: string;
  maxTokens: number;
}): Promise<{ text: string | null; error: string | null }> {
  const { systemPrompt, userMessage, apiKey, model, maxTokens } = args;
  if (!apiKey) return { text: null, error: null };
  if (!userMessage.trim()) return { text: null, error: null };

  const result = await anthropicText({
    apiKey,
    model,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    maxTokens,
  });

  if (!result.ok) return { text: null, error: null };
  return { text: result.text, error: null };
}
