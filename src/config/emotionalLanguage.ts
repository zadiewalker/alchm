export const EMOTIONAL_LANGUAGE_GOVERNANCE = {
  posture: [
    'calm',
    'observational',
    'spacious',
    'emotionally dignified',
    'non-performative',
    'temporally gentle',
    'quietly continuous',
  ],
  silenceInvariants: [
    'Missed days remain silent.',
    'Absence is never framed as failure.',
    'A return is never a reminder.',
    'No resurfacing is safer than mistimed resurfacing.',
  ],
  bannedCategories: {
    analytics: [
      'dominant emotion',
      'top mood',
      'top emotion',
      'frequency',
      'trend',
      'pattern detected',
      'insights engine',
      'predictive',
      'analytics',
    ],
    growthProgress: [
      'progress',
      'improvement',
      'growth journey',
      'leveling up',
      'milestone',
      'achievement',
      'streak',
      'consistency',
      'falling behind',
      'back on track',
    ],
    nostalgia: [
      'remember this',
      'on this day',
      'look how far',
      'years ago today',
      'throwback',
      'memory lane',
    ],
    behavioralPressure: [
      'catch up',
      'keep going',
      'stay consistent',
      "don't stop",
      'continue your journey',
    ],
    therapeuticOverreach: [
      'healing you',
      'trauma recovery',
      'breakthrough',
      'emotional diagnosis',
      'what this means',
      'unresolved issue',
      'subconscious pattern',
    ],
  },
  approvedAlternatives: [
    { avoid: 'dominant emotion', prefer: 'recently named tones' },
    { avoid: 'welcome back', prefer: 'you are here' },
    { avoid: 'pattern detected', prefer: 'something felt emotionally familiar' },
    { avoid: "look how far you've come", prefer: 'silence or observational continuity' },
    { avoid: 'progress', prefer: 'movement, if it must be named at all' },
    { avoid: 'insights', prefer: 'reflections' },
    { avoid: 'frequency', prefer: 'rhythm' },
  ],
  sacredArchiveExamples: [
    'This reflection seemed to remain nearby.',
    'Something from another season returned softly.',
    'A familiar emotional texture felt close.',
    'Something here remained gently unfinished.',
  ],
} as const;

export const EMOTIONAL_LANGUAGE_GOVERNED_SURFACES = [
  'src/app/dashboard/DashboardClient.tsx',
  'src/app/community/page.tsx',
  'src/app/insights/page.tsx',
  'src/app/onboarding/page.tsx',
  'src/app/pathways/page.tsx',
  'src/app/pathways/foundation/page.tsx',
  'src/components/journal/JournalFlow.tsx',
  'src/config/containerDefinitions.ts',
  'src/config/resurfacingTone.ts',
  'src/services/mirror/mirrorService.ts',
  'src/services/notifications/localReminderService.ts',
  'src/services/notifications/notificationCopy.ts',
] as const;

export const EMOTIONAL_LANGUAGE_QUARANTINED_SURFACES = [] as const;

export const EMOTIONAL_LANGUAGE_RETIRED_SURFACES = [
  {
    file: 'src/components/PredictiveAnalytics.tsx',
    reason: 'Retired legacy analytics framing.',
  },
  {
    file: 'src/components/SmartJournalAnalyzer.tsx',
    reason: 'Retired real-time analysis/coaching framing.',
  },
  {
    file: 'src/components/community/CollectiveExperiences.tsx',
    reason: 'Retired community challenge/growth framing.',
  },
  {
    file: 'src/components/community/StoryCreator.tsx',
    reason: 'Retired therapeutic-progress story framing.',
  },
  {
    file: 'src/components/community/WisdomLibrary.tsx',
    reason: 'Retired healing-journey wisdom framing.',
  },
  {
    file: 'src/components/community/GrowthHealingCircles.tsx',
    reason: 'Retired explicit growth/healing community surface.',
  },
  {
    file: 'src/components/community/HealingCircleManager.tsx',
    reason: 'Retired healing journey and frequency circle-management surface.',
  },
  {
    file: 'src/components/CulturalChallengeLibrary.tsx.disabled',
    reason: 'Retired disabled challenge library surface.',
  },
  {
    file: 'src/components/MigrationPrompt.tsx',
    reason: 'Retired legacy sync prompt surface.',
  },
  {
    file: 'src/app/pathways/enough-as-you-are/page.tsx.bak',
    reason: 'Retired stale route backup.',
  },
  {
    file: 'src/app/pathways/calm-the-storm/page.tsx.bak',
    reason: 'Retired stale route backup.',
  },
  {
    file: 'src/app/pathways/shadow-work/page.tsx.bak',
    reason: 'Retired stale route backup.',
  },
  {
    file: 'src/app/pathways/honoring-loss/page.tsx.bak',
    reason: 'Retired stale route backup.',
  },
] as const;
