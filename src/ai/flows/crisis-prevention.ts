// Crisis Prevention System - Proactive mental health monitoring
import { z } from 'zod';

// Risk assessment input schema
export const CrisisAssessmentInput = z.object({
  text: string(),
  userId: z.string(),
  beforeMood: z.number().min(1).max(10).optional(),
  recentEntries: z.array(z.string()).optional(),
  userHistory: z.object({
    previousCrises: z.array(z.object({
      date: z.string(),
      riskScore: z.number(),
      intervention: z.string(),
      outcome: z.string()
    })).optional(),
    copingStrategies: z.array(z.string()).optional(),
    supportNetwork: z.array(z.string()).optional(),
    triggers: z.array(z.string()).optional()
  }).optional(),
  timestamp: z.number().optional()
});

// Risk assessment output schema
export const CrisisAssessmentOutput = z.object({
  riskScore: z.number().min(0).max(1),
  riskLevel: z.enum(['low', 'moderate', 'high', 'crisis']),
  triggerWords: z.array(z.string()),
  warningPatterns: z.array(z.string()),
  recommendedActions: z.array(z.object({
    type: z.enum(['self_care', 'professional', 'emergency', 'community']),
    action: z.string(),
    priority: z.number().min(1).max(5),
    description: z.string()
  })),
  copingStrategies: z.array(z.string()),
  supportResources: z.array(z.object({
    type: z.enum(['hotline', 'therapist', 'community', 'app', 'technique']),
    name: z.string(),
    contact: z.string().optional(),
    description: z.string(),
    available24h: z.boolean().optional()
  })),
  interventionType: z.enum(['none', 'gentle_check', 'urgent_support', 'emergency_protocol']),
  confidence: z.number().min(0).max(1),
  followUpScheduled: z.boolean(),
  emergencyContacts: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string().optional(),
    email: z.string().optional()
  })).optional()
});

export type CrisisAssessmentInputType = z.infer<typeof CrisisAssessmentInput>;
export type CrisisAssessmentOutputType = z.infer<typeof CrisisAssessmentOutput>;

// Crisis risk indicators
const CRISIS_KEYWORDS = {
  suicidal: [
    'kill myself', 'end it all', 'suicide', 'suicidal', 'don\'t want to live',
    'better off dead', 'no point in living', 'want to die', 'end my life',
    'take my own life', 'nothing to live for'
  ],
  selfHarm: [
    'hurt myself', 'cut myself', 'self harm', 'self-harm', 'cutting',
    'burning myself', 'punish myself', 'deserve pain'
  ],
  hopelessness: [
    'hopeless', 'no hope', 'pointless', 'meaningless', 'empty',
    'nothing matters', 'can\'t go on', 'no way out', 'stuck forever',
    'never get better', 'always be this way'
  ],
  isolation: [
    'all alone', 'nobody cares', 'no one understands', 'completely isolated',
    'no friends', 'everyone hates me', 'burden to everyone', 'better without me'
  ],
  overwhelm: [
    'can\'t cope', 'too much', 'falling apart', 'losing control',
    'breaking down', 'can\'t handle', 'everything is wrong', 'spiraling'
  ],
  substanceAbuse: [
    'drinking too much', 'using drugs', 'getting high', 'need alcohol',
    'drinking to forget', 'numbing the pain', 'substance abuse'
  ]
};

// Protective factors
const PROTECTIVE_FACTORS = [
  'grateful', 'support', 'family', 'friends', 'help', 'therapy',
  'better tomorrow', 'getting help', 'reaching out', 'not alone',
  'hope', 'recovery', 'healing', 'progress', 'strength'
];

// Risk assessment function
export function assessCrisisRisk(
  text: string, 
  beforeMood?: number,
  recentEntries: string[] = []
): { riskScore: number; riskLevel: 'low' | 'moderate' | 'high' | 'crisis'; triggerWords: string[]; patterns: string[] } {
  
  const lowerText = text.toLowerCase();
  let riskScore = 0;
  const triggerWords: string[] = [];
  const patterns: string[] = [];

  // Check for crisis keywords with weighted scoring
  Object.entries(CRISIS_KEYWORDS).forEach(([category, keywords]) => {
    const foundKeywords = keywords.filter(keyword => lowerText.includes(keyword));
    
    if (foundKeywords.length > 0) {
      triggerWords.push(...foundKeywords);
      
      switch (category) {
        case 'suicidal':
          riskScore += 0.4;
          patterns.push('Suicidal ideation detected');
          break;
        case 'selfHarm':
          riskScore += 0.3;
          patterns.push('Self-harm indicators present');
          break;
        case 'hopelessness':
          riskScore += 0.2;
          patterns.push('Expressions of hopelessness');
          break;
        case 'isolation':
          riskScore += 0.15;
          patterns.push('Social isolation indicators');
          break;
        case 'overwhelm':
          riskScore += 0.1;
          patterns.push('Overwhelm and crisis indicators');
          break;
        case 'substanceAbuse':
          riskScore += 0.15;
          patterns.push('Substance use concerns');
          break;
      }
    }
  });

  // Factor in mood score
  if (beforeMood) {
    if (beforeMood <= 2) {
      riskScore += 0.2;
      patterns.push('Extremely low mood rating');
    } else if (beforeMood <= 3) {
      riskScore += 0.1;
      patterns.push('Low mood rating');
    }
  }

  // Check for protective factors (reduce risk)
  const protectiveCount = PROTECTIVE_FACTORS.filter(factor => 
    lowerText.includes(factor)
  ).length;
  
  if (protectiveCount > 0) {
    riskScore = Math.max(0, riskScore - (protectiveCount * 0.05));
    patterns.push('Protective factors identified');
  }

  // Analyze recent entry patterns
  if (recentEntries.length > 0) {
    const recentText = recentEntries.join(' ').toLowerCase();
    let escalationFound = false;
    
    Object.values(CRISIS_KEYWORDS).flat().forEach(keyword => {
      if (recentText.includes(keyword) && lowerText.includes(keyword)) {
        escalationFound = true;
      }
    });
    
    if (escalationFound) {
      riskScore += 0.1;
      patterns.push('Escalating pattern detected across entries');
    }
  }

  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  if (riskScore >= 0.7) {
    riskLevel = 'crisis';
  } else if (riskScore >= 0.4) {
    riskLevel = 'high';
  } else if (riskScore >= 0.2) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  return {
    riskScore: Math.min(riskScore, 1),
    riskLevel,
    triggerWords: [...new Set(triggerWords)],
    patterns: [...new Set(patterns)]
  };
}

// Generate personalized coping strategies
export function generateCopingStrategies(
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis',
  triggerWords: string[],
  userHistory?: CrisisAssessmentInputType['userHistory']
): string[] {
  
  const strategies = {
    low: [
      'Practice 5-4-3-2-1 grounding: Notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
      'Take 10 deep breaths, counting each exhale',
      'Write down 3 things you\'re grateful for today',
      'Go for a short walk or do gentle stretching',
      'Listen to calming music or nature sounds',
      'Call or text someone who cares about you'
    ],
    moderate: [
      'Use the STOP technique: Stop, Take a breath, Observe your thoughts, Proceed mindfully',
      'Practice progressive muscle relaxation',
      'Reach out to a trusted friend or family member',
      'Engage in a creative activity that brings you joy',
      'Use a mindfulness or meditation app for 10 minutes',
      'Take a warm bath or shower',
      'Write in your journal about what you\'re feeling'
    ],
    high: [
      'Contact your therapist or counselor immediately',
      'Call a mental health helpline for immediate support',
      'Stay with a trusted friend or family member',
      'Remove any means of self-harm from your environment',
      'Go to a safe, public place if you\'re alone',
      'Use crisis text line: Text HOME to 741741',
      'Practice intensive breathing exercises'
    ],
    crisis: [
      'Call 988 (Suicide & Crisis Lifeline) immediately',
      'Go to your nearest emergency room',
      'Call 911 if you are in immediate danger',
      'Contact a trusted person to stay with you',
      'Call your local crisis intervention team',
      'Use the Crisis Text Line: Text HOME to 741741',
      'Remove all means of harm from your environment immediately'
    ]
  };

  let selectedStrategies = [...strategies[riskLevel]];

  // Add personalized strategies based on user history
  if (userHistory?.copingStrategies) {
    const personalStrategies = userHistory.copingStrategies
      .filter(strategy => !selectedStrategies.includes(strategy))
      .slice(0, 2);
    selectedStrategies.unshift(...personalStrategies);
  }

  return selectedStrategies.slice(0, 6);
}

// Generate support resources
export function generateSupportResources(riskLevel: 'low' | 'moderate' | 'high' | 'crisis') {
  const baseResources = [
    {
      type: 'hotline' as const,
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      description: '24/7 free and confidential support for people in distress',
      available24h: true
    },
    {
      type: 'hotline' as const,
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: 'Free 24/7 support via text message',
      available24h: true
    },
    {
      type: 'app' as const,
      name: 'Calm',
      description: 'Meditation and sleep stories',
      available24h: true
    },
    {
      type: 'technique' as const,
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8',
      available24h: true
    }
  ];

  const riskSpecificResources = {
    low: [
      {
        type: 'community' as const,
        name: 'Online Support Groups',
        description: 'Connect with others who understand your experience',
        available24h: false
      }
    ],
    moderate: [
      {
        type: 'therapist' as const,
        name: 'Psychology Today',
        contact: 'psychologytoday.com',
        description: 'Find therapists in your area',
        available24h: false
      }
    ],
    high: [
      {
        type: 'hotline' as const,
        name: 'National Alliance on Mental Illness',
        contact: '1-800-950-NAMI',
        description: 'Mental health support and information',
        available24h: false
      }
    ],
    crisis: [
      {
        type: 'emergency' as const,
        name: 'Emergency Services',
        contact: '911',
        description: 'Immediate emergency response',
        available24h: true
      }
    ]
  };

  return [
    ...baseResources,
    ...riskSpecificResources[riskLevel]
  ];
}

// Generate recommended actions
export function generateRecommendedActions(
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis',
  triggerWords: string[]
) {
  const actions = {
    low: [
      {
        type: 'self_care' as const,
        action: 'Practice mindfulness',
        priority: 2,
        description: 'Take 10 minutes for meditation or deep breathing'
      },
      {
        type: 'community' as const,
        action: 'Connect with others',
        priority: 3,
        description: 'Reach out to a friend or join a support group'
      }
    ],
    moderate: [
      {
        type: 'professional' as const,
        action: 'Schedule therapy session',
        priority: 2,
        description: 'Book an appointment with a mental health professional'
      },
      {
        type: 'self_care' as const,
        action: 'Implement coping strategies',
        priority: 1,
        description: 'Use proven techniques to manage current distress'
      }
    ],
    high: [
      {
        type: 'professional' as const,
        action: 'Contact therapist immediately',
        priority: 1,
        description: 'Reach out to your mental health provider today'
      },
      {
        type: 'community' as const,
        action: 'Stay with support person',
        priority: 1,
        description: 'Don\'t be alone - stay with someone you trust'
      }
    ],
    crisis: [
      {
        type: 'emergency' as const,
        action: 'Call crisis hotline now',
        priority: 1,
        description: 'Immediate professional crisis intervention needed'
      },
      {
        type: 'emergency' as const,
        action: 'Ensure immediate safety',
        priority: 1,
        description: 'Remove means of harm and get to safety'
      }
    ]
  };

  return actions[riskLevel];
}

// Determine intervention type
export function determineInterventionType(
  riskScore: number,
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis'
): 'none' | 'gentle_check' | 'urgent_support' | 'emergency_protocol' {
  
  if (riskLevel === 'crisis' || riskScore >= 0.7) {
    return 'emergency_protocol';
  } else if (riskLevel === 'high' || riskScore >= 0.4) {
    return 'urgent_support';
  } else if (riskLevel === 'moderate' || riskScore >= 0.2) {
    return 'gentle_check';
  } else {
    return 'none';
  }
}

// Main crisis assessment function
export async function assessCrisis(input: CrisisAssessmentInputType): Promise<CrisisAssessmentOutputType> {
  try {
    // Perform risk assessment
    const riskAssessment = assessCrisisRisk(
      input.text,
      input.beforeMood,
      input.recentEntries
    );

    // Generate coping strategies
    const copingStrategies = generateCopingStrategies(
      riskAssessment.riskLevel,
      riskAssessment.triggerWords,
      input.userHistory
    );

    // Generate support resources
    const supportResources = generateSupportResources(riskAssessment.riskLevel);

    // Generate recommended actions
    const recommendedActions = generateRecommendedActions(
      riskAssessment.riskLevel,
      riskAssessment.triggerWords
    );

    // Determine intervention type
    const interventionType = determineInterventionType(
      riskAssessment.riskScore,
      riskAssessment.riskLevel
    );

    // Calculate confidence based on trigger word count and clarity
    const confidence = Math.min(
      0.5 + (riskAssessment.triggerWords.length * 0.1) + (riskAssessment.patterns.length * 0.05),
      0.95
    );

    return {
      riskScore: riskAssessment.riskScore,
      riskLevel: riskAssessment.riskLevel,
      triggerWords: riskAssessment.triggerWords,
      warningPatterns: riskAssessment.patterns,
      recommendedActions,
      copingStrategies,
      supportResources,
      interventionType,
      confidence,
      followUpScheduled: riskAssessment.riskLevel !== 'low',
      emergencyContacts: input.userHistory?.supportNetwork?.map(contact => ({
        name: contact,
        relationship: 'Support Person',
      }))
    };

  } catch (error) {
    console.error('Error in crisis assessment:', error);
    throw new Error('Failed to assess crisis risk');
  }
}