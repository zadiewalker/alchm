'use client';

export type EmotionFamily =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'surprise'
  | 'disgust'
  | 'trust'
  | 'anticipation';

export type EmotionValence = 'positive' | 'negative' | 'neutral';

export interface Emotion {
  id: string;
  label: string;
  family: EmotionFamily;
  valence: EmotionValence;
  somatic?: string;
}

export const FAMILY_LABELS: Record<EmotionFamily, string> = {
  joy: 'Joy',
  sadness: 'Sadness',
  anger: 'Anger',
  fear: 'Fear',
  surprise: 'Surprise',
  disgust: 'Shame',
  trust: 'Trust',
  anticipation: 'Anticipation',
};

export const EMOTION_MAP: Record<EmotionFamily, Emotion[]> = {
  joy: [
    { id: 'joyful', label: 'Joyful', family: 'joy', valence: 'positive' },
    { id: 'grateful', label: 'Grateful', family: 'joy', valence: 'positive' },
    { id: 'peaceful', label: 'Peaceful', family: 'joy', valence: 'positive' },
    { id: 'hopeful', label: 'Hopeful', family: 'joy', valence: 'positive' },
    { id: 'content', label: 'Content', family: 'joy', valence: 'positive' },
    { id: 'proud', label: 'Proud', family: 'joy', valence: 'positive' },
  ],
  sadness: [
    { id: 'sad', label: 'Sad', family: 'sadness', valence: 'negative', somatic: 'chest' },
    { id: 'lonely', label: 'Lonely', family: 'sadness', valence: 'negative', somatic: 'chest' },
    { id: 'heavy', label: 'Heavy', family: 'sadness', valence: 'negative', somatic: 'shoulders' },
    { id: 'grieving', label: 'Grieving', family: 'sadness', valence: 'negative', somatic: 'chest' },
    { id: 'disappointed', label: 'Disappointed', family: 'sadness', valence: 'negative' },
    { id: 'numb', label: 'Numb', family: 'sadness', valence: 'neutral', somatic: 'whole' },
  ],
  anger: [
    { id: 'angry', label: 'Angry', family: 'anger', valence: 'negative', somatic: 'jaw' },
    { id: 'frustrated', label: 'Frustrated', family: 'anger', valence: 'negative', somatic: 'hands' },
    { id: 'resentful', label: 'Resentful', family: 'anger', valence: 'negative', somatic: 'stomach' },
    { id: 'irritated', label: 'Irritated', family: 'anger', valence: 'negative' },
    { id: 'betrayed', label: 'Betrayed', family: 'anger', valence: 'negative', somatic: 'chest' },
  ],
  fear: [
    { id: 'anxious', label: 'Anxious', family: 'fear', valence: 'negative', somatic: 'chest' },
    { id: 'worried', label: 'Worried', family: 'fear', valence: 'negative', somatic: 'stomach' },
    { id: 'overwhelmed', label: 'Overwhelmed', family: 'fear', valence: 'negative', somatic: 'head' },
    { id: 'restless', label: 'Restless', family: 'fear', valence: 'negative', somatic: 'legs' },
    { id: 'dreading', label: 'Dreading', family: 'fear', valence: 'negative', somatic: 'stomach' },
    { id: 'insecure', label: 'Insecure', family: 'fear', valence: 'negative', somatic: 'chest' },
  ],
  surprise: [
    { id: 'surprised', label: 'Surprised', family: 'surprise', valence: 'neutral' },
    { id: 'confused', label: 'Confused', family: 'surprise', valence: 'neutral', somatic: 'head' },
    { id: 'curious', label: 'Curious', family: 'surprise', valence: 'positive' },
    { id: 'shocked', label: 'Shocked', family: 'surprise', valence: 'negative' },
  ],
  disgust: [
    { id: 'disgusted', label: 'Disgusted', family: 'disgust', valence: 'negative', somatic: 'stomach' },
    { id: 'ashamed', label: 'Ashamed', family: 'disgust', valence: 'negative', somatic: 'face' },
    { id: 'guilty', label: 'Guilty', family: 'disgust', valence: 'negative', somatic: 'stomach' },
    { id: 'embarrassed', label: 'Embarrassed', family: 'disgust', valence: 'negative', somatic: 'face' },
  ],
  trust: [
    { id: 'trusting', label: 'Trusting', family: 'trust', valence: 'positive' },
    { id: 'safe', label: 'Safe', family: 'trust', valence: 'positive' },
    { id: 'loved', label: 'Loved', family: 'trust', valence: 'positive', somatic: 'chest' },
    { id: 'accepted', label: 'Accepted', family: 'trust', valence: 'positive' },
  ],
  anticipation: [
    { id: 'excited', label: 'Excited', family: 'anticipation', valence: 'positive' },
    { id: 'nervous', label: 'Nervous', family: 'anticipation', valence: 'neutral', somatic: 'stomach' },
    { id: 'eager', label: 'Eager', family: 'anticipation', valence: 'positive' },
    { id: 'torn', label: 'Torn', family: 'anticipation', valence: 'neutral' },
  ],
};

export function findEmotion(args: { family: EmotionFamily; specificId: string | null }): Emotion | null {
  const list = EMOTION_MAP[args.family] || [];
  if (args.specificId) {
    const match = list.find((e) => e.id === args.specificId) || null;
    if (match) return match;
  }
  // Fall back to a synthetic family emotion.
  return { id: args.family, label: FAMILY_LABELS[args.family], family: args.family, valence: 'neutral' };
}

export function getEmotionPrompt(emotion: Emotion): string {
  const label = emotion.label.toLowerCase();
  switch (emotion.family) {
    case 'joy':
      return `You're feeling ${label}. What brought this on? Sometimes naming what's good helps you hold onto it.`;
    case 'sadness':
      return `You're carrying something ${label}. You don't have to explain it — just describe what it's like right now.`;
    case 'anger':
      return `There's ${label} energy here. What happened? And what's underneath it — what does it want to protect?`;
    case 'fear':
      return `Something feels ${label}. Can you describe the shape of it? Not why you feel it — what it actually feels like.`;
    case 'surprise':
      return `Something caught you off guard. What shifted? Sometimes the most interesting part is what you expected instead.`;
    case 'disgust':
      return `You're sitting with ${label}. That takes courage. What would you say to a friend feeling exactly this?`;
    case 'trust':
      return `There's warmth here — ${label}. What made this possible? What are you learning to trust?`;
    case 'anticipation':
      return `Something's ahead of you. ${emotion.label} has a direction. Where is it pointing?`;
    default:
      return `What's here right now?`;
  }
}

