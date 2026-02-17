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

export async function getReflection(args: {
  systemPrompt: string;
  userMessage: string;
  apiKey: string;
}): Promise<ReflectionResult> {
  const { systemPrompt, userMessage, apiKey } = args;

  if (!apiKey) {
    return { text: null, error: 'Khepera is resting. Reflections will return soon.' };
  }
  if (!userMessage.trim()) {
    return { text: null, error: 'Write something first — even one sentence is enough.' };
  }

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
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      if (res.status === 429) return { text: null, error: 'Khepera needs a moment. Try again shortly.' };
      if (res.status === 401) return { text: null, error: "Khepera can't connect right now. Your entry is saved." };
      return { text: null, error: "Khepera couldn't connect. Your entry is saved safely." };
    }

    const json: unknown = await res.json();
    const text = extractAnthropicText(json);
    if (!text) return { text: null, error: "Khepera listened but couldn't form a reflection. Try again." };
    return { text, error: null };
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === 'AbortError') {
      return { text: null, error: 'Khepera is taking too long. Your entry is saved — try again later.' };
    }
    return { text: null, error: 'No connection. Your entry is saved safely on your device.' };
  }
}

