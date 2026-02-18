'use client';

import type { JournalEntry } from '@/lib/types';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function createLocalReflection(entry: JournalEntry): string {
  const text = (entry.content || '').toLowerCase();

  const emotionPatterns: Record<string, string[]> = {
    anxious: ['anxious', 'worried', 'stress', 'nervous', 'overwhelm'],
    sad: ['sad', 'down', 'lonely', 'empty', 'hopeless'],
    angry: ['angry', 'mad', 'frustrated', 'furious'],
    grateful: ['grateful', 'thank', 'appreciate', 'blessed'],
    peaceful: ['calm', 'peaceful', 'quiet', 'stillness'],
    hopeful: ['hope', 'forward', 'improving', 'better'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'mixed'],
  };

  const detected: string[] = [];
  for (const [emotion, words] of Object.entries(emotionPatterns)) {
    if (words.some((w) => text.includes(w))) detected.push(emotion);
  }

  const emotionalRecognition = detected.length
    ? `Emotional Recognition: I hear ${detected.slice(0, 2).join(' and ')} in what you wrote.`
    : `Emotional Recognition: I hear something tender trying to be named here.`;

  const strengths: string[] = [];
  if (text.includes('try')) strengths.push('perseverance');
  if (text.includes('help') || text.includes('support')) strengths.push('seeking connection');
  if (text.includes('understand') || text.includes('notice')) strengths.push('self-awareness');
  if ((entry.content || '').trim().split(/\s+/).length > 40) strengths.push('thoughtful reflection');

  const strengthIdentification = strengths.length
    ? `Strength Identification: Even here, I see ${pick(strengths)}.`
    : `Strength Identification: The act of writing this down is a kind of strength.`;

  const gentleInsight = `Gentle Insight: If you pause for one breath, what feels most true in your body right now?`;

  const suggestionPool = [
    'Put one hand on your chest and name one thing you need.',
    'Write one sentence that begins with: "What I wish someone understood is…" ',
    'Choose one small kindness you can offer yourself tonight.',
    'Notice one thought you are carrying, and ask: "Is this a fact, or a fear?"',
  ];

  const nurturingSuggestion = `Nurturing Suggestion: ${pick(suggestionPool)}`;

  return [emotionalRecognition, strengthIdentification, gentleInsight, nurturingSuggestion].join('\n');
}

