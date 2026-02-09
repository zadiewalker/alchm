/**
 * Cultural Adaptation Framework for ALCHM
 * 
 * Provides culturally-responsive AI prompts, therapeutic approaches,
 * and healing modalities that honor diverse traditions and worldviews
 */

import { CulturalContext, LocaleConfig } from './index';

export interface CulturalAdaptation {
  aiPromptModifications: Record<string, string>;
  therapeuticApproaches: string[];
  avoidedTopics: string[];
  preferredLanguagePatterns: string[];
  familyInvolvementLevel: 'individual' | 'family_informed' | 'family_centered' | 'community_centered';
  timeFramework: 'session_based' | 'process_oriented' | 'crisis_responsive' | 'seasonal_aligned';
  healingMetaphors: string[];
  spiritualIntegration: 'excluded' | 'optional' | 'integrated' | 'central';
  traumaFramework: 'individual' | 'familial' | 'historical' | 'intergenerational' | 'systemic';
}

export interface HealingTradition {
  name: string;
  origin: string;
  description: string;
  principles: string[];
  practices: string[];
  contraindicationsWesternTherapy: string[];
  integrationGuidelines: string[];
  respectfulInclusion: {
    requiresPermission: boolean;
    communityConsent: boolean;
    knowledgeKeeperInvolvement: boolean;
    reciprocityRequired: boolean;
  };
}

/**
 * Comprehensive healing traditions database with respectful integration guidelines
 */
export const HEALING_TRADITIONS: Record<string, HealingTradition> = {
  curanderismo: {
    name: 'Curanderismo',
    origin: 'Latin America',
    description: 'Traditional Mexican and Latin American healing practice combining indigenous, Spanish, and African elements',
    principles: ['holistic_healing', 'spiritual_balance', 'family_involvement', 'community_support'],
    practices: ['limpias', 'sobadoras', 'herbal_remedies', 'prayer', 'ritual_cleansing'],
    contraindicationsWesternTherapy: ['individualistic_focus', 'secular_only_approach', 'dismissal_of_spiritual'],
    integrationGuidelines: [
      'Honor spiritual aspects of healing',
      'Include family in healing process',
      'Respect traditional remedies alongside therapy',
      'Acknowledge intergenerational wisdom'
    ],
    respectfulInclusion: {
      requiresPermission: true,
      communityConsent: true,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: true
    }
  },

  ubuntu: {
    name: 'Ubuntu Philosophy',
    origin: 'Southern Africa',
    description: 'African philosophy emphasizing interconnectedness: "I am because we are"',
    principles: ['interconnectedness', 'collective_responsibility', 'community_healing', 'shared_humanity'],
    practices: ['community_circles', 'storytelling', 'collective_wisdom', 'elder_guidance'],
    contraindicationsWesternTherapy: ['extreme_individualism', 'isolation_based_treatment', 'dismissal_of_community'],
    integrationGuidelines: [
      'Emphasize community support in healing',
      'Include extended network in recovery',
      'Honor collective wisdom and experiences',
      'Frame healing as community benefit'
    ],
    respectfulInclusion: {
      requiresPermission: true,
      communityConsent: true,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: true
    }
  },

  ayurveda: {
    name: 'Ayurveda',
    origin: 'India',
    description: 'Ancient Indian system of holistic medicine focusing on balance of mind, body, and spirit',
    principles: ['mind_body_spirit_unity', 'constitutional_healing', 'prevention', 'natural_harmony'],
    practices: ['meditation', 'yoga', 'pranayama', 'herbal_medicine', 'lifestyle_counseling'],
    contraindicationsWesternTherapy: ['mind_body_separation', 'symptom_suppression', 'one_size_fits_all'],
    integrationGuidelines: [
      'Consider individual constitution in treatment',
      'Integrate mindfulness and breathing practices',
      'Honor mind-body connection',
      'Include lifestyle and dietary considerations'
    ],
    respectfulInclusion: {
      requiresPermission: false,
      communityConsent: false,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: false
    }
  },

  indigenous_healing_circles: {
    name: 'Indigenous Healing Circles',
    origin: 'Various Indigenous Communities',
    description: 'Sacred community-based healing practices honoring traditional ways',
    principles: ['sacred_community', 'ancestral_wisdom', 'earth_connection', 'ceremonial_healing'],
    practices: ['talking_circles', 'smudging', 'drumming', 'storytelling', 'land_connection'],
    contraindicationsWesternTherapy: ['cultural_appropriation', 'secular_only', 'individual_focus'],
    integrationGuidelines: [
      'Only with explicit permission from tribal authorities',
      'Must involve Indigenous healers or knowledge keepers',
      'Cannot be adapted without community blessing',
      'Requires understanding of specific tribal traditions'
    ],
    respectfulInclusion: {
      requiresPermission: true,
      communityConsent: true,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: true
    }
  },

  islamic_healing: {
    name: 'Islamic Healing Principles',
    origin: 'Islamic Tradition',
    description: 'Faith-based healing incorporating Quranic guidance and prophetic medicine',
    principles: ['divine_guidance', 'community_support', 'spiritual_purification', 'family_involvement'],
    practices: ['prayer', 'dhikr', 'quranic_recitation', 'community_support', 'halal_lifestyle'],
    contraindicationsWesternTherapy: ['secular_only_approach', 'family_exclusion', 'cultural_insensitivity'],
    integrationGuidelines: [
      'Respect Islamic values and practices',
      'Include prayer and spiritual elements',
      'Honor family involvement preferences',
      'Avoid conflicting therapeutic approaches'
    ],
    respectfulInclusion: {
      requiresPermission: false,
      communityConsent: true,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: false
    }
  },

  chinese_medicine: {
    name: 'Traditional Chinese Medicine Psychology',
    origin: 'China',
    description: 'Holistic approach to mental wellness based on qi, yin-yang, and five elements',
    principles: ['energy_balance', 'holistic_harmony', 'preventive_care', 'natural_healing'],
    practices: ['meditation', 'qigong', 'acupuncture_principles', 'herbal_wisdom', 'tai_chi'],
    contraindicationsWesternTherapy: ['energy_dismissal', 'purely_pharmaceutical', 'mind_body_separation'],
    integrationGuidelines: [
      'Honor concepts of energy and balance',
      'Include movement and meditation practices',
      'Consider holistic approaches to symptoms',
      'Respect traditional diagnostic frameworks'
    ],
    respectfulInclusion: {
      requiresPermission: false,
      communityConsent: false,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: false
    }
  },

  whakapapa_healing: {
    name: 'Whakapapa Healing',
    origin: 'Māori New Zealand',
    description: 'Healing through understanding genealogical connections and cultural identity',
    principles: ['ancestral_connection', 'cultural_identity', 'whakatōhea', 'spiritual_grounding'],
    practices: ['pepeha_sharing', 'cultural_reconnection', 'ancestral_honor', 'land_connection'],
    contraindicationsWesternTherapy: ['cultural_disconnection', 'individual_only_focus', 'secular_mandated'],
    integrationGuidelines: [
      'Honor cultural identity and connection',
      'Include whānau (family) in healing process',
      'Respect spiritual and ancestral dimensions',
      'Support cultural reconnection practices'
    ],
    respectfulInclusion: {
      requiresPermission: true,
      communityConsent: true,
      knowledgeKeeperInvolvement: true,
      reciprocityRequired: true
    }
  }
};

/**
 * Generate culturally-adapted AI prompts based on user's cultural context
 */
export function generateCulturalPrompts(
  basePrompt: string,
  culturalContext: CulturalContext,
  userPreferences: {
    spiritualInclusivity?: boolean;
    familyInvolvement?: boolean;
    traditionalHealing?: boolean;
  } = {}
): string {
  let adaptedPrompt = basePrompt;

  // Adapt for collectivist vs individualist cultures
  if (culturalContext.culturalValues.collectivism > 60) {
    adaptedPrompt = adaptedPrompt.replace(
      /\b(you|your|yourself)\b/g, 
      (match) => {
        switch (match) {
          case 'you': return 'you and your community';
          case 'your': return 'your and your family\'s';
          case 'yourself': return 'yourself and your loved ones';
          default: return match;
        }
      }
    );
  }

  // Adapt for communication styles
  if (culturalContext.communicationStyle === 'indirect') {
    // Soften direct questions and add context
    adaptedPrompt = adaptedPrompt.replace(
      /What do you think about/g,
      'When you have time to reflect, you might consider'
    );
    adaptedPrompt = adaptedPrompt.replace(
      /How do you feel/g,
      'In your own time and way, you might explore how you feel'
    );
  }

  // Add spiritual elements if appropriate
  if (userPreferences.spiritualInclusivity && 
      culturalContext.spiritualConsiderations.length > 0) {
    adaptedPrompt += ' Feel free to include any spiritual or religious perspectives that feel meaningful to your healing journey.';
  }

  // Incorporate healing traditions metaphors
  const traditions = culturalContext.healingTraditions;
  if (traditions.includes('curanderismo')) {
    adaptedPrompt = adaptedPrompt.replace(
      /healing/g,
      'healing and restoration of your spiritual balance'
    );
  }
  
  if (traditions.includes('ayurveda')) {
    adaptedPrompt += ' Consider how your thoughts, feelings, and physical sensations are interconnected in your response.';
  }

  if (traditions.includes('ubuntu')) {
    adaptedPrompt = adaptedPrompt.replace(
      /your journey/g,
      'your journey and how it connects you to your community'
    );
  }

  // Adapt for trauma expression patterns
  if (culturalContext.traumaExpression === 'somatic') {
    adaptedPrompt += ' Feel free to describe any physical sensations or bodily experiences as part of your emotional expression.';
  }

  if (culturalContext.traumaExpression === 'relational') {
    adaptedPrompt += ' You may want to share how your relationships and connections with others are part of this experience.';
  }

  // Time orientation adaptations
  if (culturalContext.timeOrientation === 'cyclical') {
    adaptedPrompt = adaptedPrompt.replace(
      /progress/g,
      'the natural cycles of growth and healing'
    );
  }

  return adaptedPrompt;
}

/**
 * Get cultural adaptation guidelines for a specific locale
 */
export function getCulturalAdaptation(locale: string): CulturalAdaptation {
  const localeConfig = getLocaleConfigByString(locale); // We'll implement this helper
  const context = localeConfig.culturalContext;

  const adaptation: CulturalAdaptation = {
    aiPromptModifications: {},
    therapeuticApproaches: [],
    avoidedTopics: [],
    preferredLanguagePatterns: [],
    familyInvolvementLevel: 'individual',
    timeFramework: 'session_based',
    healingMetaphors: [],
    spiritualIntegration: 'excluded',
    traumaFramework: 'individual'
  };

  // Determine family involvement level
  if (context.familyStructure === 'extended' || context.culturalValues.collectivism > 70) {
    adaptation.familyInvolvementLevel = 'family_centered';
  } else if (context.culturalValues.collectivism > 40) {
    adaptation.familyInvolvementLevel = 'family_informed';
  }

  // Set time framework based on cultural orientation
  if (context.timeOrientation === 'cyclical') {
    adaptation.timeFramework = 'seasonal_aligned';
  } else if (context.timeOrientation === 'polychronic') {
    adaptation.timeFramework = 'process_oriented';
  }

  // Configure spiritual integration
  if (context.spiritualConsiderations.length > 0) {
    adaptation.spiritualIntegration = 'optional';
    if (context.healingTraditions.includes('religious_healing') || 
        context.healingTraditions.includes('quranic_healing')) {
      adaptation.spiritualIntegration = 'central';
    }
  }

  // Set trauma framework based on cultural values
  if (context.culturalValues.collectivism > 80) {
    adaptation.traumaFramework = 'intergenerational';
  } else if (context.culturalValues.collectivism > 60) {
    adaptation.traumaFramework = 'familial';
  } else if (context.culturalValues.collectivism > 40) {
    adaptation.traumaFramework = 'systemic';
  }

  // Add healing metaphors based on traditions
  adaptation.healingMetaphors = context.healingTraditions.map(tradition => {
    switch (tradition) {
      case 'curanderismo': return 'spiritual_cleansing';
      case 'ayurveda': return 'balance_restoration';
      case 'ubuntu': return 'community_weaving';
      case 'indigenous_practices': return 'ancestral_guidance';
      default: return 'growth_journey';
    }
  });

  // Configure therapeutic approaches
  adaptation.therapeuticApproaches = getAppropriatetherapeuticApproaches(context);

  return adaptation;
}

function getAppropriatetherapeuticApproaches(context: CulturalContext): string[] {
  const approaches: string[] = ['trauma_informed'];

  if (context.culturalValues.collectivism > 60) {
    approaches.push('family_systems', 'community_based');
  }

  if (context.healingTraditions.includes('meditation') || 
      context.healingTraditions.includes('yoga')) {
    approaches.push('mindfulness_based', 'somatic');
  }

  if (context.communicationStyle === 'indirect') {
    approaches.push('narrative_therapy', 'art_therapy', 'expressive_arts');
  } else {
    approaches.push('cognitive_behavioral', 'solution_focused');
  }

  if (context.spiritualConsiderations.length > 0) {
    approaches.push('spiritually_integrated');
  }

  if (context.traumaExpression === 'somatic') {
    approaches.push('body_based', 'movement_therapy');
  }

  return approaches;
}

// Helper function - we'll need to implement this or import from the main file
function getLocaleConfigByString(locale: string): LocaleConfig {
  // This would import from the main file or be passed as parameter
  // For now, returning a basic structure
  return {
    locale,
    name: locale,
    nativeName: locale,
    direction: 'ltr',
    region: 'unknown',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    culturalContext: {
      region: 'unknown',
      language: 'en',
      script: 'ltr',
      culturalValues: {
        collectivism: 30,
        powerDistance: 40,
        uncertaintyAvoidance: 50,
        masculinity: 50,
        longTermOrientation: 50,
        indulgence: 50
      },
      healingTraditions: ['therapy'],
      spiritualConsiderations: ['secular'],
      familyStructure: 'nuclear',
      communicationStyle: 'direct',
      traumaExpression: 'emotional',
      timeOrientation: 'linear'
    },
    crisisResources: [],
    legalFramework: {
      dataProtection: 'other',
      dataResidencyRequired: false,
      crossBorderTransfer: 'allowed',
      mandatoryReporting: {
        required: false,
        conditions: [],
        exemptions: []
      },
      mentalHealthLaws: {
        involuntaryHold: false,
        dutyToWarn: false,
        parentalConsent: false
      },
      lgbtqRights: {
        protectionLevel: 'full',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    enabled: true
  };
}

/**
 * Validate if a healing tradition can be ethically included
 */
export function validateHealingTraditionInclusion(
  traditionName: string,
  userCulturalBackground: string[],
  hasCommunitypermission: boolean = false
): {
  canInclude: boolean;
  requirements: string[];
  warnings: string[];
} {
  const tradition = HEALING_TRADITIONS[traditionName];
  if (!tradition) {
    return {
      canInclude: false,
      requirements: [],
      warnings: ['Unknown healing tradition']
    };
  }

  const result = {
    canInclude: true,
    requirements: [] as string[],
    warnings: [] as string[]
  };

  // Check if user has cultural connection to the tradition
  const hasCulturalConnection = userCulturalBackground.some(bg => 
    tradition.origin.toLowerCase().includes(bg.toLowerCase())
  );

  if (tradition.respectfulInclusion.requiresPermission && !hasCulturalConnection) {
    if (!hasCommunitypermission) {
      result.canInclude = false;
      result.requirements.push('Community permission required');
    }
  }

  if (tradition.respectfulInclusion.knowledgeKeeperInvolvement) {
    result.requirements.push('Knowledge keeper involvement needed');
  }

  if (tradition.respectfulInclusion.reciprocityRequired) {
    result.requirements.push('Reciprocity to originating community required');
  }

  if (!hasCulturalConnection) {
    result.warnings.push('User may not have cultural connection to this tradition');
    result.warnings.push('Ensure respectful and appropriate integration');
  }

  return result;
}

