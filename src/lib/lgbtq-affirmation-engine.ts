// ALCHM LGBTQ+ Affirmation Engine
// Celebrates and affirms diverse sexual orientations, gender identities, and expressions

import { PronounPreference } from '@/components/PronounSelector';
import { IdentityJourney, CulturalContext } from '@/types/identity-schema';

// ===== LGBTQ+ AFFIRMATION TYPES =====

export interface LGBTQContext {
  identityDimensions: IdentityDimension[];
  comingOutJourney?: ComingOutJourney;
  communityConnections: CommunityConnection[];
  identityIntersections: IdentityIntersection[];
  pronouns?: PronounPreference;
  chosenName?: string;
  privacyLevel: 'private' | 'community' | 'public';
}

export interface IdentityDimension {
  type: 'sexual_orientation' | 'gender_identity' | 'romantic_orientation' | 'gender_expression';
  label: string;
  selfDescribed?: string;
  visibility: 'private' | 'selective' | 'open';
  affirmationLevel: 'exploring' | 'accepting' | 'celebrating' | 'advocating';
}

export interface ComingOutJourney {
  stages: ComingOutStage[];
  currentStage: 'self_discovery' | 'self_acceptance' | 'selective_disclosure' | 'open_living' | 'advocacy';
  supportNeeds: SupportNeed[];
  challenges: string[];
  celebrations: string[];
}

export interface ComingOutStage {
  stage: string;
  timeframe: string;
  experiences: string[];
  supportReceived: string[];
  lessonsLearned: string[];
}

export interface CommunityConnection {
  type: 'chosen_family' | 'lgbtq_community' | 'support_group' | 'advocacy_org' | 'online_community';
  name: string;
  relationshipDepth: 'surface' | 'supportive' | 'close' | 'family_level';
  supportType: string[];
}

export interface IdentityIntersection {
  identities: string[];
  intersectionType: 'harmonious' | 'complex' | 'challenging' | 'evolving';
  navigationStrategies: string[];
  strengthsFromIntersection: string[];
}

export interface SupportNeed {
  category: 'emotional' | 'practical' | 'community' | 'advocacy' | 'spiritual';
  specific: string;
  urgency: 'low' | 'medium' | 'high';
  culturalConsiderations: string[];
}

export interface AffirmationResponse {
  primaryAffirmation: string;
  specificCelebrations: string[];
  communityConnection: string;
  strengthsAcknowledged: string[];
  encouragement: string;
  pronounUsage: string[];
  intersectionalSupport?: string;
}

// ===== LGBTQ+ AFFIRMATION PROMPTS =====

export const lgbtqAffirmationPrompts = {
  'pride_reflection': [
    "What aspects of your identity fill you with the most joy and pride today?",
    "How has your journey of self-discovery revealed beautiful truths about who you are?",
    "What would you celebrate about your authentic self right now?",
    "How do you honor the courage it took to embrace your true identity?"
  ],
  
  'coming_out_support': [
    "Reflect on a moment when you felt truly seen and accepted for who you are.",
    "What does living authentically mean to you in this season of your life?",
    "How do you create safety for yourself while being true to who you are?",
    "What wisdom would you offer to someone beginning their own journey of self-discovery?"
  ],
  
  'community_belonging': [
    "What forms of chosen family or community bring you the most comfort and strength?",
    "How do you find and create spaces where your full self is welcomed and celebrated?",
    "Where do you experience the deepest sense of belonging and acceptance?",
    "How do you contribute to creating inclusive spaces for others?"
  ],
  
  'intersectional_identity': [
    "How do the different beautiful aspects of your identity weave together in your life?",
    "What unique perspectives and gifts do you bring because of your full, complex self?",
    "How do you honor and celebrate all parts of your identity simultaneously?",
    "What does it mean to you to live at the intersection of multiple identities?"
  ],
  
  'resilience_celebration': [
    "What inner strengths have you discovered through your journey of self-acceptance?",
    "How has embracing your authentic self changed how you show up in the world?",
    "What obstacles have you overcome that now serve as sources of wisdom and strength?",
    "How do you practice self-compassion during challenging moments?"
  ],
  
  'relationship_exploration': [
    "How do you navigate relationships while honoring your authentic self?",
    "What does healthy love and connection look like for you?",
    "How do you communicate your needs and boundaries in relationships?",
    "What patterns of love and connection feel most genuine to who you are?"
  ]
};

// ===== LGBTQ+ AFFIRMING LANGUAGE PATTERNS =====

export const affirmingLanguagePatterns = {
  // Celebration language vs deficit language
  'identity_celebration': [
    'Your identity is a gift to the world',
    'The diversity of your experience enriches our community',
    'Your authenticity creates space for others to be themselves',
    'Your courage in living openly inspires others',
    'Your unique perspective is valuable and needed'
  ],
  
  // Strength-based recognition
  'resilience_recognition': [
    'The strength it takes to live authentically is remarkable',
    'Your journey of self-discovery shows incredible courage',
    'You are creating your own path with wisdom and grace',
    'Your resilience in the face of challenges is inspiring',
    'Your commitment to being true to yourself is powerful'
  ],
  
  // Community-affirming language
  'community_affirmation': [
    'You belong in communities that celebrate your full self',
    'Chosen family is just as sacred as biological family',
    'Your contributions to our community are valued and appreciated',
    'There are people who will love and accept you exactly as you are',
    'Your voice and experience matter deeply'
  ],
  
  // Intersectional support
  'intersectional_affirmation': [
    'All aspects of your identity deserve celebration and respect',
    'Your complex identity brings unique wisdom and perspective',
    'There is no hierarchy of which parts of yourself matter most',
    'Your intersectional experience is valid and important',
    'You don\'t have to choose between different parts of your identity'
  ]
};

// ===== PRONOUN-AWARE RESPONSE GENERATION =====

export class LGBTQAffirmingAI {
  private pronounPatterns: Map<string, PronounUsage>;

  constructor() {
    this.pronounPatterns = new Map([
      ['they/them', { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' }],
      ['she/her', { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' }],
      ['he/him', { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' }],
      ['ze/zir', { subject: 'ze', object: 'zir', possessive: 'zir', reflexive: 'zirself' }],
      ['xe/xir', { subject: 'xe', object: 'xir', possessive: 'xir', reflexive: 'xirself' }]
    ]);
  }

  generateAffirmingResponse(
    userInput: string,
    lgbtqContext: LGBTQContext,
    identityJourney?: IdentityJourney
  ): AffirmationResponse {
    
    // Determine appropriate affirmation strategy
    const affirmationStrategy = this.determineAffirmationStrategy(userInput, lgbtqContext);
    
    // Generate pronoun-correct content
    const pronounUsage = this.getPronounUsage(lgbtqContext.pronouns);
    
    // Create affirming response
    const response: AffirmationResponse = {
      primaryAffirmation: this.generatePrimaryAffirmation(affirmationStrategy, pronounUsage),
      specificCelebrations: this.generateSpecificCelebrations(lgbtqContext, userInput),
      communityConnection: this.generateCommunityConnection(lgbtqContext),
      strengthsAcknowledged: this.identifyStrengths(userInput, lgbtqContext),
      encouragement: this.generateEncouragement(affirmationStrategy, pronounUsage),
      pronounUsage: this.validatePronounUsage(pronounUsage),
      intersectionalSupport: this.generateIntersectionalSupport(lgbtqContext, identityJourney)
    };

    return response;
  }

  private determineAffirmationStrategy(
    userInput: string, 
    context: LGBTQContext
  ): AffirmationStrategy {
    
    // Analyze input for key themes
    const themes = this.analyzeInputThemes(userInput);
    
    // Determine current affirmation needs
    const currentStage = context.comingOutJourney?.currentStage || 'self_discovery';
    
    return {
      primaryTheme: themes[0] || 'general_affirmation',
      supportNeeds: context.comingOutJourney?.supportNeeds || [],
      celebrationLevel: this.determineCelebrationLevel(context),
      communityFocus: this.shouldEmphasizeCommunity(context),
      intersectionalSupport: context.identityIntersections.length > 0
    };
  }

  private generatePrimaryAffirmation(
    strategy: AffirmationStrategy, 
    pronouns: PronounUsage
  ): string {
    const templates = {
      'identity_exploration': [
        `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} are on a beautiful journey of self-discovery, and every step ${pronouns.subject} take${pronouns.subject === 'they' ? '' : 's'} is valid and worthy of celebration.`,
        `The courage ${pronouns.subject} show${pronouns.subject === 'they' ? '' : 's'} in exploring ${pronouns.possessive} authentic self is truly remarkable.`,
        `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} deserve${pronouns.subject === 'they' ? '' : 's'} to be celebrated for exactly who ${pronouns.subject} are.`
      ],
      
      'community_seeking': [
        `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} belong${pronouns.subject === 'they' ? '' : 's'} in communities that celebrate ${pronouns.possessive} full, authentic self.`,
        `The connections ${pronouns.subject} seek and create are sacred forms of chosen family.`,
        `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} are worthy of love, acceptance, and belonging exactly as ${pronouns.subject} are.`
      ],
      
      'resilience_building': [
        `The strength ${pronouns.subject} demonstrate${pronouns.subject === 'they' ? '' : 's'} in living authentically is inspiring and powerful.`,
        `Every challenge ${pronouns.subject} navigate${pronouns.subject === 'they' ? '' : 's'} adds to ${pronouns.possessive} wisdom and resilience.`,
        `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} are creating ${pronouns.possessive} own path with courage and grace.`
      ]
    };

    const themeTemplates = templates[strategy.primaryTheme] || templates['identity_exploration'];
    return themeTemplates[Math.floor(Math.random() * themeTemplates.length)];
  }

  private generateSpecificCelebrations(
    context: LGBTQContext, 
    userInput: string
  ): string[] {
    const celebrations: string[] = [];
    
    // Celebrate identity dimensions
    context.identityDimensions.forEach(dimension => {
      if (dimension.affirmationLevel === 'celebrating' || dimension.affirmationLevel === 'advocating') {
        celebrations.push(`Your ${dimension.label} identity is beautiful and valid`);
      }
    });
    
    // Celebrate community connections
    const strongConnections = context.communityConnections.filter(
      conn => conn.relationshipDepth === 'close' || conn.relationshipDepth === 'family_level'
    );
    
    if (strongConnections.length > 0) {
      celebrations.push('The chosen family and community you\'ve built shows your capacity for love and connection');
    }
    
    // Celebrate intersectional identity
    if (context.identityIntersections.length > 0) {
      celebrations.push('The complexity of your intersectional identity brings unique wisdom and perspective');
    }
    
    return celebrations;
  }

  private generateCommunityConnection(context: LGBTQContext): string {
    const hasStrongCommunity = context.communityConnections.some(
      conn => conn.relationshipDepth === 'close' || conn.relationshipDepth === 'family_level'
    );
    
    if (hasStrongCommunity) {
      return 'Your chosen family and community connections are sources of strength and belonging that honor your authentic self.';
    } else {
      return 'There are communities and chosen family waiting to welcome and celebrate you exactly as you are. You deserve spaces where your full self is cherished.';
    }
  }

  private identifyStrengths(userInput: string, context: LGBTQContext): string[] {
    const strengths: string[] = [];
    
    // Analyze input for strength indicators
    if (userInput.toLowerCase().includes('came out') || userInput.toLowerCase().includes('told')) {
      strengths.push('Courage in sharing your authentic self with others');
    }
    
    if (userInput.toLowerCase().includes('proud') || userInput.toLowerCase().includes('celebrate')) {
      strengths.push('Self-acceptance and pride in your identity');
    }
    
    if (userInput.toLowerCase().includes('community') || userInput.toLowerCase().includes('friends')) {
      strengths.push('Ability to build meaningful connections and chosen family');
    }
    
    if (userInput.toLowerCase().includes('overcome') || userInput.toLowerCase().includes('challenge')) {
      strengths.push('Resilience in navigating challenges with grace');
    }
    
    // Add context-based strengths
    if (context.comingOutJourney?.currentStage === 'advocacy') {
      strengths.push('Leadership in creating change for the LGBTQ+ community');
    }
    
    if (context.identityIntersections.length > 0) {
      strengths.push('Wisdom that comes from navigating multiple identity dimensions');
    }
    
    return strengths.length > 0 ? strengths : ['Authenticity and courage in being true to yourself'];
  }

  private generateEncouragement(
    strategy: AffirmationStrategy, 
    pronouns: PronounUsage
  ): string {
    const encouragements = [
      `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} are exactly where ${pronouns.subject} need to be on ${pronouns.possessive} journey, and every step forward is worth celebrating.`,
      `The world is better because ${pronouns.subject} exist and choose to live authentically.`,
      `${pronouns.subject.charAt(0).toUpperCase() + pronouns.subject.slice(1)} have everything within ${pronouns.object} to continue growing and thriving as ${pronouns.possessive} truest self.`,
      `${pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} identity is a gift, and ${pronouns.subject} deserve${pronouns.subject === 'they' ? '' : 's'} all the love and acceptance that comes with living authentically.`
    ];
    
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  private getPronounUsage(pronounPreference?: PronounPreference): PronounUsage {
    if (!pronounPreference) {
      return { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' };
    }
    
    if (pronounPreference.pronouns === 'custom' && pronounPreference.customPronouns) {
      return {
        subject: pronounPreference.customPronouns.subject,
        object: pronounPreference.customPronouns.object,
        possessive: pronounPreference.customPronouns.possessive,
        reflexive: pronounPreference.customPronouns.reflexive
      };
    }
    
    return this.pronounPatterns.get(pronounPreference.pronouns) || 
           { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' };
  }

  private validatePronounUsage(pronouns: PronounUsage): string[] {
    return [
      `Subject: ${pronouns.subject}`,
      `Object: ${pronouns.object}`,
      `Possessive: ${pronouns.possessive}`,
      `Reflexive: ${pronouns.reflexive}`
    ];
  }

  private generateIntersectionalSupport(
    context: LGBTQContext, 
    identityJourney?: IdentityJourney
  ): string | undefined {
    if (context.identityIntersections.length === 0) return undefined;
    
    const intersections = context.identityIntersections[0]; // Focus on primary intersection
    
    return `Your intersectional identity as someone who navigates ${intersections.identities.join(' and ')} brings unique wisdom and perspective. All aspects of who you are deserve celebration and respect - you don't have to choose between different parts of your identity.`;
  }

  // Helper methods
  private analyzeInputThemes(input: string): string[] {
    const themes: string[] = [];
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('community') || lowerInput.includes('belonging') || lowerInput.includes('family')) {
      themes.push('community_seeking');
    }
    
    if (lowerInput.includes('challenge') || lowerInput.includes('overcome') || lowerInput.includes('difficult')) {
      themes.push('resilience_building');
    }
    
    if (lowerInput.includes('identity') || lowerInput.includes('discover') || lowerInput.includes('who am i')) {
      themes.push('identity_exploration');
    }
    
    return themes.length > 0 ? themes : ['general_affirmation'];
  }

  private determineCelebrationLevel(context: LGBTQContext): 'gentle' | 'moderate' | 'high' {
    const celebratingDimensions = context.identityDimensions.filter(
      dim => dim.affirmationLevel === 'celebrating' || dim.affirmationLevel === 'advocating'
    );
    
    if (celebratingDimensions.length >= 2) return 'high';
    if (celebratingDimensions.length === 1) return 'moderate';
    return 'gentle';
  }

  private shouldEmphasizeCommunity(context: LGBTQContext): boolean {
    return context.communityConnections.length > 0 || 
           context.comingOutJourney?.supportNeeds.some(need => need.category === 'community') || false;
  }
}

// ===== SUPPORTING INTERFACES =====

interface PronounUsage {
  subject: string;
  object: string;
  possessive: string;
  reflexive: string;
}

interface AffirmationStrategy {
  primaryTheme: string;
  supportNeeds: SupportNeed[];
  celebrationLevel: 'gentle' | 'moderate' | 'high';
  communityFocus: boolean;
  intersectionalSupport: boolean;
}

// ===== UTILITY FUNCTIONS =====

export function createLGBTQContext(
  identityDimensions: IdentityDimension[],
  pronouns?: PronounPreference,
  chosenName?: string
): LGBTQContext {
  return {
    identityDimensions,
    communityConnections: [],
    identityIntersections: [],
    pronouns,
    chosenName,
    privacyLevel: 'private'
  };
}

export function generateAffirmingPrompt(
  category: keyof typeof lgbtqAffirmationPrompts,
  context?: LGBTQContext
): string {
  const prompts = lgbtqAffirmationPrompts[category];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Export the main engine
export default LGBTQAffirmingAI;