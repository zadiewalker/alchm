export type QuestionRegister =
  | 'tender'
  | 'searching'
  | 'grounded'
  | 'stirred'
  | 'spacious';

export interface DashboardQuestion {
  id: number;
  prompt: string;
  register: QuestionRegister;
  kheperaGreeting: string;
}

export const DASHBOARD_QUESTIONS: DashboardQuestion[] = [
  { id: 1,  register: 'grounded',   kheperaGreeting: 'Khepera is here.',
    prompt: 'What\'s most present for you right now — not most important, just most present?' },
  { id: 2,  register: 'tender',     kheperaGreeting: 'Khepera is listening.',
    prompt: 'What have you been carrying this week that you haven\'t put down?' },
  { id: 3,  register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What do you keep almost saying — but stopping yourself?' },
  { id: 4,  register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What did you notice about yourself today that surprised you, even slightly?' },
  { id: 5,  register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What\'s the feeling you\'ve been trying to name this week?' },
  { id: 6,  register: 'spacious',   kheperaGreeting: 'Khepera is listening.',
    prompt: 'If you didn\'t have to explain yourself to anyone today, what would you say?' },
  { id: 7,  register: 'tender',     kheperaGreeting: 'Khepera is here.',
    prompt: 'What version of yourself showed up today — and how did it feel to be them?' },
  { id: 8,  register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What are you waiting to feel ready for?' },
  { id: 9,  register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What has been true about you lately that you haven\'t said out loud?' },
  { id: 10, register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What keeps returning — even when you try to set it down?' },
  { id: 11, register: 'spacious',   kheperaGreeting: 'Khepera is listening.',
    prompt: 'What would you write if you knew no one would ever read it?' },
  { id: 12, register: 'tender',     kheperaGreeting: 'Khepera is here.',
    prompt: 'Where have you been hardest on yourself this week?' },
  { id: 13, register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What do you wish someone would ask you about?' },
  { id: 14, register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What does your body know right now that your mind hasn\'t caught up to?' },
  { id: 15, register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What\'s the thing you almost said today — and why didn\'t you?' },
  { id: 16, register: 'spacious',   kheperaGreeting: 'Khepera is listening.',
    prompt: 'What are you allowed to want that you rarely let yourself want?' },
  { id: 17, register: 'tender',     kheperaGreeting: 'Khepera is here.',
    prompt: 'What has surprised you about who you\'ve been lately?' },
  { id: 18, register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What are you trying to figure out that you can\'t quite hold still long enough to see?' },
  { id: 19, register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What small thing happened today that deserves more space than it got?' },
  { id: 20, register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What have you outgrown that you haven\'t admitted yet?' },
  { id: 21, register: 'spacious',   kheperaGreeting: 'Khepera is listening.',
    prompt: 'What would it feel like to not explain yourself — to anyone — today?' },
  { id: 22, register: 'tender',     kheperaGreeting: 'Khepera is here.',
    prompt: 'Who have you been lately, when no one is watching?' },
  { id: 23, register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What are you hoping will be different — and what would have to change for that to happen?' },
  { id: 24, register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What are you carrying right now that isn\'t actually yours to carry?' },
  { id: 25, register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What emotion have you been translating into something more acceptable?' },
  { id: 26, register: 'spacious',   kheperaGreeting: 'Khepera is listening.',
    prompt: 'What are you allowed to let go of today?' },
  { id: 27, register: 'tender',     kheperaGreeting: 'Khepera is here.',
    prompt: 'What have you been protecting yourself from feeling?' },
  { id: 28, register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What truth have you been circling without landing on?' },
  { id: 29, register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What does rest actually look like for you right now — not what it should look like?' },
  { id: 30, register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What are you grieving that you haven\'t named as grief yet?' },
  { id: 31, register: 'spacious',   kheperaGreeting: 'Khepera is listening.',
    prompt: 'What would you do differently today if you trusted yourself completely?' },
  { id: 32, register: 'tender',     kheperaGreeting: 'Khepera is here.',
    prompt: 'What part of you has been trying to get your attention?' },
  { id: 33, register: 'searching',  kheperaGreeting: 'Khepera is here.',
    prompt: 'What question has been living in you that you haven\'t let yourself ask?' },
  { id: 34, register: 'grounded',   kheperaGreeting: 'Khepera is paying attention.',
    prompt: 'What has this period of your life been asking of you?' },
  { id: 35, register: 'stirred',    kheperaGreeting: 'Khepera is here.',
    prompt: 'What are you becoming — even if you can\'t name it yet?' },
];

// Fixed epoch: first Sunday of 2026.
// All users see the same question in the same calendar week.
const EPOCH = new Date('2026-01-04T00:00:00');
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export function getCurrentQuestion(): DashboardQuestion {
  const weeksSinceEpoch = Math.floor(
    (Date.now() - EPOCH.getTime()) / MS_PER_WEEK
  );
  const index = ((weeksSinceEpoch % DASHBOARD_QUESTIONS.length)
    + DASHBOARD_QUESTIONS.length) % DASHBOARD_QUESTIONS.length;
  return DASHBOARD_QUESTIONS[index];
}
