/**
 * ALCHM Culturally Responsive Badge System
 * 
 * Philosophy: "Every culture has its own way of celebrating growth and honoring progress.
 * True healing honors diverse forms of strength, wisdom, and resilience."
 * 
 * This system creates badges that celebrate:
 * - Different cultural approaches to healing and growth
 * - Intersectional identities and experiences
 * - Community-centered vs individual achievements
 * - Diverse definitions of success and progress
 * - Resistance and survival as forms of strength
 */

import { Badge } from '@/types/gamification';

export interface CulturalBadge extends Badge {
  culturalOrigin: string;
  culturalContext: string;
  inclusivityLevel: 'universal' | 'cultural_specific' | 'intersectional';
  celebratesWhat: string[];
  avoidsCulturalHarm: boolean;
  honorsTradition: boolean;
  supportsIdentityAffirmation: boolean;
  acknowledgessSystemicFactors: boolean;
}

/**
 * BLACK AMBITION ALIGNED BADGES
 * Celebrating Black excellence, resilience, and community strength
 */
export const BLACK_EXCELLENCE_BADGES: CulturalBadge[] = [
  {
    id: 'ancestors_strength',
    name: 'Ancestral Strength',
    description: 'Connected with the strength that flows through your lineage',
    icon: '👑',
    category: 'Cultural Connection',
    xpAwarded: 50,
    celebrationMessage: 'The strength of your ancestors lives in you. They are proud.',
    culturalOrigin: 'African and African Diaspora traditions',
    culturalContext: 'Honors the concept of ancestral presence and inherited resilience',
    inclusivityLevel: 'cultural_specific',
    celebratesWhat: [
      'Ancestral connection',
      'Inherited resilience',
      'Cultural pride',
      'Intergenerational strength'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'code_switching_master',
    name: 'Code-Switching Mastery',
    description: 'Navigated different spaces while staying true to yourself',
    icon: '🎭',
    category: 'Cultural Navigation',
    xpAwarded: 75,
    celebrationMessage: 'Your ability to move between worlds is a superpower.',
    culturalOrigin: 'Marginalized community experiences',
    culturalContext: 'Recognizes the emotional labor and skill of cultural code-switching',
    inclusivityLevel: 'intersectional',
    celebratesWhat: [
      'Cultural adaptability',
      'Identity preservation',
      'Emotional intelligence',
      'Survival skills'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'community_uplift',
    name: 'Community Uplift',
    description: 'Your healing work ripples out to lift up your community',
    icon: '✊',
    category: 'Collective Healing',
    xpAwarded: 100,
    celebrationMessage: 'When you heal, you heal generations. Your work matters.',
    culturalOrigin: 'Ubuntu and collectivist healing traditions',
    culturalContext: 'Celebrates healing as community work, not just individual work',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Collective healing',
      'Community care',
      'Generational impact',
      'Social responsibility'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'resistance_resilience',
    name: 'Resistance as Resilience',
    description: 'Your resistance to injustice is a form of healing',
    icon: '🔥',
    category: 'Social Justice',
    xpAwarded: 150,
    celebrationMessage: 'Your fire for justice is healing medicine for the world.',
    culturalOrigin: 'Liberation psychology and activist traditions',
    culturalContext: 'Recognizes social justice work as a form of mental health practice',
    inclusivityLevel: 'intersectional',
    celebratesWhat: [
      'Social justice engagement',
      'Resistance to oppression',
      'Community advocacy',
      'Systemic change work'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  }
];

/**
 * LGBTQ+ AFFIRMATION BADGES
 * Celebrating authentic self-expression and queer joy
 */
export const LGBTQ_AFFIRMATION_BADGES: CulturalBadge[] = [
  {
    id: 'authentic_self',
    name: 'Authentic Self',
    description: 'Showed up as your full, authentic self',
    icon: '🏳️‍🌈',
    category: 'Authenticity',
    xpAwarded: 100,
    celebrationMessage: 'Your authenticity is a gift to the world. Keep shining.',
    culturalOrigin: 'LGBTQ+ liberation movements',
    culturalContext: 'Celebrates the courage required to be authentic in an often hostile world',
    inclusivityLevel: 'intersectional',
    celebratesWhat: [
      'Authentic self-expression',
      'Courage to be visible',
      'Identity affirmation',
      'Personal truth'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'chosen_family',
    name: 'Chosen Family Builder',
    description: 'Created or deepened chosen family connections',
    icon: '💖',
    category: 'Community',
    xpAwarded: 75,
    celebrationMessage: 'The family you choose is as sacred as the family you were born into.',
    culturalOrigin: 'LGBTQ+ community traditions',
    culturalContext: 'Honors chosen family as a legitimate and sacred form of kinship',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Chosen family creation',
      'Community building',
      'Mutual support',
      'Found family bonds'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'queer_joy',
    name: 'Queer Joy',
    description: 'Celebrated the joy and beauty of your identity',
    icon: '✨',
    category: 'Celebration',
    xpAwarded: 50,
    celebrationMessage: 'Your joy is revolutionary. Your happiness is resistance.',
    culturalOrigin: 'Queer joy movements',
    culturalContext: 'Celebrates joy as resistance against oppression and internalized shame',
    inclusivityLevel: 'cultural_specific',
    celebratesWhat: [
      'Identity celebration',
      'Joy as resistance',
      'Self-love',
      'Community celebration'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  }
];

/**
 * YOUTH EMPOWERMENT BADGES
 * Designed for Youth Truth / DoSomething.org alignment
 */
export const YOUTH_EMPOWERMENT_BADGES: CulturalBadge[] = [
  {
    id: 'youth_voice',
    name: 'Youth Voice',
    description: 'Used your voice to speak your truth with power',
    icon: '📢',
    category: 'Empowerment',
    xpAwarded: 75,
    celebrationMessage: 'Your voice matters. Your perspective is needed.',
    culturalOrigin: 'Youth liberation movements',
    culturalContext: 'Celebrates young people as experts on their own experiences',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Self-advocacy',
      'Truth-telling',
      'Youth leadership',
      'Perspective sharing'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'boundary_setter',
    name: 'Boundary Setter',
    description: 'Set healthy boundaries with adults or systems',
    icon: '🛡️',
    category: 'Self-Protection',
    xpAwarded: 100,
    celebrationMessage: 'Your boundaries teach others how to respect you.',
    culturalOrigin: 'Self-advocacy and empowerment traditions',
    culturalContext: 'Recognizes boundary-setting as a crucial life skill, especially for marginalized youth',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Self-protection',
      'Healthy boundaries',
      'Self-respect',
      'Adult-youth equality'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'future_vision',
    name: 'Future Vision',
    description: 'Dreamed and planned for the future you want to create',
    icon: '🔮',
    category: 'Visioning',
    xpAwarded: 50,
    celebrationMessage: 'Your dreams are blueprints for change. Keep building.',
    culturalOrigin: 'Liberation imagination traditions',
    culturalContext: 'Celebrates dreaming and planning as acts of resistance and hope',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Future planning',
      'Dream cultivation',
      'Hope building',
      'Vision creation'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: false
  }
];

/**
 * IMMIGRANT & MULTICULTURAL BADGES
 * Celebrating cultural bridge-building and identity integration
 */
export const MULTICULTURAL_BADGES: CulturalBadge[] = [
  {
    id: 'cultural_bridge_builder',
    name: 'Cultural Bridge Builder',
    description: 'Connected different parts of your cultural identity',
    icon: '🌉',
    category: 'Identity Integration',
    xpAwarded: 100,
    celebrationMessage: 'You are a living bridge between worlds. That is a sacred gift.',
    culturalOrigin: 'Multicultural and immigrant experiences',
    culturalContext: 'Honors the complexity and beauty of holding multiple cultural identities',
    inclusivityLevel: 'cultural_specific',
    celebratesWhat: [
      'Cultural integration',
      'Identity synthesis',
      'Multicultural navigation',
      'Heritage honoring'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'language_keeper',
    name: 'Language Keeper',
    description: 'Honored or preserved your heritage language',
    icon: '🗣️',
    category: 'Cultural Preservation',
    xpAwarded: 75,
    celebrationMessage: 'Every word you speak in your heritage language keeps culture alive.',
    culturalOrigin: 'Language preservation movements',
    culturalContext: 'Recognizes language as carrier of culture and identity',
    inclusivityLevel: 'cultural_specific',
    celebratesWhat: [
      'Language preservation',
      'Cultural continuity',
      'Heritage honoring',
      'Identity expression'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: false
  }
];

/**
 * NEURODIVERGENT AFFIRMATION BADGES
 * Celebrating different ways of thinking and being
 */
export const NEURODIVERGENT_BADGES: CulturalBadge[] = [
  {
    id: 'different_by_design',
    name: 'Different by Design',
    description: 'Celebrated your unique way of thinking and processing',
    icon: '🧠',
    category: 'Neurodiversity',
    xpAwarded: 75,
    celebrationMessage: 'Your brain is not broken. It is beautifully different.',
    culturalOrigin: 'Neurodiversity movement',
    culturalContext: 'Reframes neurodivergence as difference rather than deficit',
    inclusivityLevel: 'cultural_specific',
    celebratesWhat: [
      'Neurodivergent pride',
      'Cognitive differences',
      'Unique perspectives',
      'Processing styles'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: true
  },
  {
    id: 'sensory_wisdom',
    name: 'Sensory Wisdom',
    description: 'Honored your sensory needs and experiences',
    icon: '🌈',
    category: 'Self-Accommodation',
    xpAwarded: 50,
    celebrationMessage: 'Your sensory experience of the world is valid and important.',
    culturalOrigin: 'Sensory diversity awareness',
    culturalContext: 'Validates different sensory experiences as legitimate ways of being',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Sensory self-awareness',
      'Self-accommodation',
      'Body wisdom',
      'Environmental attunement'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: false,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: false
  }
];

/**
 * UNIVERSAL CULTURALLY-INFORMED BADGES
 * Celebrating human experiences through cultural lens
 */
export const UNIVERSAL_CULTURAL_BADGES: CulturalBadge[] = [
  {
    id: 'cultural_humility',
    name: 'Cultural Humility',
    description: 'Approached different cultures with respect and openness',
    icon: '🙏',
    category: 'Humility',
    xpAwarded: 50,
    celebrationMessage: 'Your openness to learning from others is a gift.',
    culturalOrigin: 'Cross-cultural competency practices',
    culturalContext: 'Celebrates respectful engagement across cultural differences',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Cultural respect',
      'Learning mindset',
      'Humility',
      'Cross-cultural appreciation'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: false,
    acknowledgessSystemicFactors: false
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Shared your story in a way that honors your experience',
    icon: '📖',
    category: 'Narrative',
    xpAwarded: 75,
    celebrationMessage: 'Your story is medicine. Thank you for sharing it.',
    culturalOrigin: 'Oral tradition and narrative healing',
    culturalContext: 'Honors storytelling as universal healing practice',
    inclusivityLevel: 'universal',
    celebratesWhat: [
      'Story sharing',
      'Narrative healing',
      'Experience honoring',
      'Wisdom transmission'
    ],
    avoidsCulturalHarm: true,
    honorsTradition: true,
    supportsIdentityAffirmation: true,
    acknowledgessSystemicFactors: false
  }
];

/**
 * Cultural Badge Manager
 * Intelligently awards badges based on user's cultural context
 */
export class CulturalBadgeManager {
  private allBadges: CulturalBadge[] = [
    ...BLACK_EXCELLENCE_BADGES,
    ...LGBTQ_AFFIRMATION_BADGES,
    ...YOUTH_EMPOWERMENT_BADGES,
    ...MULTICULTURAL_BADGES,
    ...NEURODIVERGENT_BADGES,
    ...UNIVERSAL_CULTURAL_BADGES
  ];
  
  /**
   * Get relevant badges for a user based on their cultural context
   */
  getRelevantBadges(userContext: {
    culturalBackground?: string[];
    lgbtqIdentity?: boolean;
    neurodivergent?: boolean;
    immigrant?: boolean;
    ageGroup?: 'youth' | 'adult';
    intersectionalIdentities?: string[];
  }): CulturalBadge[] {
    let relevantBadges = [...this.allBadges];
    
    // Filter based on cultural background
    if (userContext.culturalBackground) {
      const culturallyRelevant = this.allBadges.filter(badge => {
        if (badge.inclusivityLevel === 'universal') return true;
        
        // Check for specific cultural alignments
        if (userContext.culturalBackground.includes('black') && 
            BLACK_EXCELLENCE_BADGES.includes(badge)) return true;
        if (userContext.culturalBackground.includes('multicultural') && 
            MULTICULTURAL_BADGES.includes(badge)) return true;
            
        return badge.inclusivityLevel === 'intersectional';
      });
      
      relevantBadges = culturallyRelevant;
    }
    
    // Add LGBTQ+ badges if relevant
    if (userContext.lgbtqIdentity) {
      relevantBadges = [...relevantBadges, ...LGBTQ_AFFIRMATION_BADGES];
    }
    
    // Add neurodivergent badges if relevant
    if (userContext.neurodivergent) {
      relevantBadges = [...relevantBadges, ...NEURODIVERGENT_BADGES];
    }
    
    // Add youth badges if relevant
    if (userContext.ageGroup === 'youth') {
      relevantBadges = [...relevantBadges, ...YOUTH_EMPOWERMENT_BADGES];
    }
    
    // Remove duplicates
    const uniqueBadges = relevantBadges.filter((badge, index, arr) => 
      arr.findIndex(b => b.id === badge.id) === index
    );
    
    return uniqueBadges;
  }
  
  /**
   * Check if a badge should be awarded based on journal content and cultural context
   */
  shouldAwardBadge(
    badgeId: string,
    journalContent: string,
    userContext: any,
    userHistory: any
  ): boolean {
    const badge = this.allBadges.find(b => b.id === badgeId);
    if (!badge) return false;
    
    const content = journalContent.toLowerCase();
    
    // Badge-specific logic
    switch (badgeId) {
      case 'ancestors_strength':
        return content.includes('ancestors') || 
               content.includes('family history') ||
               content.includes('heritage') ||
               content.includes('lineage');
               
      case 'authentic_self':
        return content.includes('authentic') ||
               content.includes('true self') ||
               content.includes('came out') ||
               content.includes('being myself');
               
      case 'youth_voice':
        return content.includes('spoke up') ||
               content.includes('my voice') ||
               content.includes('stood up') ||
               content.includes('advocated');
               
      case 'cultural_bridge_builder':
        return content.includes('different cultures') ||
               content.includes('navigate between') ||
               content.includes('multicultural') ||
               content.includes('two worlds');
               
      default:
        return false;
    }
  }
  
  /**
   * Get celebration message that is culturally appropriate
   */
  getCulturalCelebration(
    badgeId: string, 
    userContext: any
  ): string {
    const badge = this.allBadges.find(b => b.id === badgeId);
    if (!badge) return 'Congratulations on your growth!';
    
    return badge.celebrationMessage;
  }
}

// Export singleton
export const culturalBadgeManager = new CulturalBadgeManager();

/**
 * Badge Safety Guidelines
 * Ensures badges don't perpetuate harm or stereotypes
 */
export const BADGE_SAFETY_GUIDELINES = {
  avoid: [
    'Stereotyping cultural practices',
    'Appropriating sacred traditions',
    'Tokenizing identity markers',
    'Creating hierarchies of oppression',
    'Ignoring intersectionality',
    'Pathologizing cultural differences'
  ],
  ensure: [
    'Multiple pathways to achievement',
    'Recognition of diverse strengths',
    'Respect for cultural complexity',
    'Celebration without appropriation',
    'Intersectional awareness',
    'Community input and feedback'
  ],
  principles: [
    'Culture is not costume',
    'Identity is complex and fluid',
    'Healing looks different for everyone',
    'Community wisdom guides design',
    'Safety comes before engagement',
    'Representation includes power-sharing'
  ]
};
