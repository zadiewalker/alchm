'use client';

import { getExtractionText } from '@/lib/api';

export interface ExtractionResult {
  suggestedMood: string | null;
  themes: string[];
  intensity: number; // 1-10
  needsFollowup: boolean;
  suggestedLens: 'cbt' | 'ifs' | 'somatic' | 'narrative' | 'existential' | null;
}

const MODEL = 'claude-haiku-4-5-20251001';

const EXTRACTION_PROMPT = `You are a journal analysis system. Given a journal entry, extract:

1. mood: The dominant emotion in one word (e.g., "anxious", "hopeful", "numb", "heavy", "peaceful", "angry", "grateful", "confused"). Return null if unclear.
2. themes: 1-3 short phrases describing what the entry is about (e.g., "work pressure", "relationship with mother", "sleep problems").
3. intensity: 1-10 how emotionally heavy the entry is. 1 = light reflection, 10 = deep crisis.
4. needsFollowup: true if the user would benefit from a guided pathway on this topic.
5. suggestedLens: which therapeutic approach best fits — "cbt", "ifs", "somatic", "narrative", "existential", or null.

Respond ONLY with valid JSON. No other text.

Example output:
{"mood":"anxious","themes":["work deadline","sleep problems"],"intensity":6,"needsFollowup":true,"suggestedLens":"somatic"}`;

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function parseExtraction(text: string): ExtractionResult | null {
  const clean = text.replace(/```json|```/g, '').trim();
  if (!clean) return null;

  try {
    const parsed = JSON.parse(clean) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const obj = parsed as Record<string, unknown>;

    const mood = typeof obj.mood === 'string' ? obj.mood.trim() : null;
    const themes = Array.isArray(obj.themes) ? obj.themes.map((t) => String(t).trim()).filter(Boolean).slice(0, 3) : [];
    const intensity = clampInt(Number(obj.intensity ?? 0), 1, 10);
    const needsFollowup = Boolean(obj.needsFollowup);
    const lensRaw = typeof obj.suggestedLens === 'string' ? obj.suggestedLens.trim() : null;
    const suggestedLens =
      lensRaw === 'cbt' || lensRaw === 'ifs' || lensRaw === 'somatic' || lensRaw === 'narrative' || lensRaw === 'existential'
        ? lensRaw
        : null;

    return {
      suggestedMood: mood && mood.length ? mood : null,
      themes,
      intensity,
      needsFollowup,
      suggestedLens,
    };
  } catch {
    return null;
  }
}

export async function extractInsights(entryContent: string, apiKey: string): Promise<ExtractionResult | null> {
  if (!apiKey || !entryContent.trim()) return null;

  const res = await getExtractionText({
    systemPrompt: EXTRACTION_PROMPT,
    userMessage: entryContent,
    apiKey,
    model: MODEL,
    maxTokens: 200,
  });

  if (!res.text) return null;
  return parseExtraction(res.text);
}

