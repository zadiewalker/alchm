export const ALCHM_PRODUCT_DOCTRINE = {
  identity: 'A private, trauma-informed space for writing and restrained reflection.',
  priorities: [
    'emotional safety',
    'privacy integrity',
    'non-directive reflection',
    'restraint',
    'trust durability',
    'operational coherence',
  ],
  nonNegotiables: {
    streaks: false,
    shamePrompts: false,
    diagnosis: false,
    directAdvice: false,
    therapySimulation: false,
    emotionallyCoerciveNotifications: false,
    trainingOnJournalEntries: false,
    manipulativeEngagementCopy: false,
    surveillancePersonalization: false,
  },
  prohibitedProductPatterns: [
    'streaks',
    'missed-day prompts',
    'guilt mechanics',
    'coercive retention',
    'emotional dependency language',
    'therapy or treatment simulation',
    'diagnosis or advice',
    'journal-text training',
  ],
} as const;

export const KHEPERA_REFLECTION_CONSTITUTION = {
  role: 'reflection system',
  requiredSections: ['Witness', 'Perspective Offer', 'Seed Question'],
  outputKeys: ['witness', 'perspective', 'seed'],
  prohibitedBehaviors: [
    'diagnose',
    'prescribe',
    'advise',
    'coach',
    'direct',
    'simulate therapy',
    'create dependency',
    'overstate certainty',
  ],
  seedRule: 'Exactly one open-ended, non-directive question.',
} as const;

export const INTEGRITY_REFERENCE_PATHS = [
  'docs/integrity/PRODUCT_DOCTRINE.md',
  'docs/integrity/KHEPERA_REFLECTION_CONSTITUTION.md',
  'docs/integrity/OPERATING_RULES.md',
  'DATA_RIGHTS_MAP.md',
  'AGENTS.md',
] as const;
