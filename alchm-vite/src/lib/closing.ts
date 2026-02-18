'use client';

const CLOSINGS: Record<string, string[]> = {
  fear: [
    "You don't have to solve this tonight.",
    "The feeling is real. It's also temporary.",
    "What if this is your body asking for something it needs?",
    "Courage isn't the absence of fear. It's writing this entry.",
    "You named it. That's the first step of not being controlled by it.",
  ],
  sadness: [
    "Grief is love with nowhere to go. Let it be here.",
    "You don't have to carry this alone. But you can carry it for now.",
    "Some things don't need fixing. They need witnessing.",
    "This heaviness is yours. It means you cared about something.",
    'Still here. That matters more than you think.',
  ],
  anger: [
    'Anger is information. What is it telling you?',
    "You're allowed to be angry. The question is what you do next.",
    "Underneath every fire, there's something worth protecting.",
    'The fact that this bothers you means your values are intact.',
    "Let it burn. Then look at what's left standing.",
  ],
  joy: [
    "Hold this one close. You'll want to remember what it felt like.",
    'This is what it feels like when things are working.',
    "Joy doesn't need to justify itself. Let it be simple.",
    'Notice who or what made this possible. Tell them if you can.',
    "You built something today. Even if it's just this feeling.",
  ],
  surprise: [
    'The unexpected is where growth hides.',
    'What you expected says as much as what happened.',
    'Confusion is the beginning of understanding. Stay with it.',
    'Your brain is reorganizing. Let it.',
  ],
  disgust: [
    'Shame loses power when it is spoken. You just spoke it.',
    'You showed up for the hardest conversation, the one with yourself.',
    "What you're carrying isn't a verdict. It's a feeling. Feelings pass.",
    "The you who did that thing isn't the whole you. You know that.",
  ],
  trust: [
    "Let this in. You don't have to guard everything.",
    'Trust is a muscle. You just used it.',
    'Some doors only open from the inside.',
    "You're learning to let good things happen. That's its own kind of brave.",
  ],
  anticipation: [
    "Whatever's coming, you've already started preparing. This entry is proof.",
    'You can want something and be scared of it at the same time.',
    "The waiting is the hard part. You're doing it anyway.",
    'Everything you need for tomorrow, you have today.',
  ],
};

const DEFAULT_CLOSINGS = [
  "You showed up. That's the whole thing.",
  "This is yours. Nobody else needs to understand it.",
  'Still here. Still writing. That is enough.',
  'The fact that you are here means something is working.',
];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function getClosing(emotionFamily: string | null, entryId: string): string {
  const pool = (emotionFamily && CLOSINGS[emotionFamily]) || DEFAULT_CLOSINGS;
  const index = Math.abs(hashString(entryId || 'entry')) % pool.length;
  return pool[index] || DEFAULT_CLOSINGS[0]!;
}

