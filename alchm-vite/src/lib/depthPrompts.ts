'use client';

import type { Emotion } from '@/lib/emotions';
import { getEmotionPrompt } from '@/lib/emotions';
import type { BodySensation } from '@/lib/somatic';

export function buildWritingPrompt(emotion: Emotion | null, sensation: BodySensation | null): string {
  if (!emotion) return "What's on your mind?";
  if (!sensation) return getEmotionPrompt(emotion);

  const regionLabel =
    sensation.region === 'whole'
      ? 'your whole body'
      : sensation.region === 'nowhere'
        ? "somewhere you can't quite name"
        : `your ${sensation.region}`;

  const somaticDesc = sensation.description && sensation.description.trim() ? ` — ${sensation.description.trim()}` : '';

  const templates: Record<string, string> = {
    fear: `There's something ${emotion.label.toLowerCase()} sitting in ${regionLabel}${somaticDesc}. Stay with that sensation for a breath. What is it trying to tell you?`,
    sadness: `You're carrying something ${emotion.label.toLowerCase()} in ${regionLabel}${somaticDesc}. If that heaviness could speak, what would it say?`,
    anger: `There's ${emotion.label.toLowerCase()} energy in ${regionLabel}${somaticDesc}. Underneath anger, there's usually something it's guarding. What needs protecting right now?`,
    joy: `You're feeling ${emotion.label.toLowerCase()}, and it's alive in ${regionLabel}${somaticDesc}. What made this feeling possible? Name it so you can come back to it.`,
    surprise: `Something shifted, and you feel it in ${regionLabel}${somaticDesc}. What did you expect instead?`,
    disgust: `There's ${emotion.label.toLowerCase()} in ${regionLabel}${somaticDesc}. What would you say to someone you love who was feeling exactly this?`,
    trust: `There's warmth in ${regionLabel}${somaticDesc} — ${emotion.label.toLowerCase()}. What are you learning to let in?`,
    anticipation: `Something's pulling at you — ${emotion.label.toLowerCase()} — and you feel it in ${regionLabel}${somaticDesc}. Where is this energy trying to take you?`,
  };

  return templates[emotion.family] || `You're feeling ${emotion.label.toLowerCase()} in ${regionLabel}${somaticDesc}. Stay with it. What comes up?`;
}

