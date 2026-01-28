/**
 * Localized Community Features and Healing Circles
 * 
 * Culturally-responsive community healing platform supporting diverse
 * traditions, languages, and marginalized community needs worldwide
 */

import { CulturalContext, LocaleConfig, getLocaleConfig } from './index';
import { HealingTradition, HEALING_TRADITIONS } from './culturalAdaptation';

export interface CommunityMember {
  id: string;
  displayName: string;
  pronouns?: string[];
  culturalBackground: string[];
  languages: string[];
  timeZone: string;
  location: {
    country: string;
    region?: string;
    timezone: string;
  };
  identityMarkers: {
    age_range: '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
    gender_identity?: string;
    sexual_orientation?: string;
    race_ethnicity?: string[];
    neurodivergent?: boolean;
    disability?: string[];
    immigrant_refugee?: boolean;
    indigenous?: boolean;
    religious_spiritual?: string[];
  };
  healingPreferences: {
    preferred_traditions: string[];
    communication_style: 'direct' | 'indirect' | 'spiritual' | 'clinical';
    support_type: 'peer' | 'elder_guided' | 'professional' | 'mixed';
    anonymity_level: 'full' | 'partial' | 'identified';
    trigger_warnings: string[];
    safe_topics: string[];
  };
  communityRoles: {
    is_moderator: boolean;
    is_elder: boolean;
    is_knowledge_keeper: boolean;
    is_peer_supporter: boolean;
    cultural_liaison: string[];
  };
}

export interface HealingCircle {
  id: string;
  name: string;
  description: string;
  circle_type: 'cultural_healing' | 'identity_support' | 'trauma_recovery' | 
               'spiritual_exploration' | 'peer_support' | 'crisis_support' |
               'family_healing' | 'intergenerational' | 'professional_guidance';
  cultural_context: {
    primary_culture: string;
    healing_traditions: string[];
    languages: string[];
    spiritual_elements: boolean;
    cultural_protocols: string[];
  };
  membership: {
    criteria: {
      age_range?: string;
      cultural_background?: string[];
      identity_markers?: string[];
      experience_level?: 'newcomer' | 'experienced' | 'elder';
      geographic_region?: string;
    };
    size_limit: number;
    waiting_list: boolean;
    approval_process: 'automatic' | 'moderated' | 'community_consensus' | 'elder_approved';
  };
  facilitation: {
    facilitators: CommunityMember[];
    rotation_schedule: string;
    cultural_protocols: {
      opening_ritual?: string;
      closing_ritual?: string;
      speaking_order: 'circle' | 'raised_hand' | 'talking_stick' | 'open' | 'respectful_order' | 'mindful_sharing';
      silence_respect: boolean;
      elder_guidance: boolean;
    };
  };
  schedule: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
    duration: string;
    timezone_rotation: boolean;
    cultural_calendar_aligned: boolean;
    sacred_time_respect: string[];
  };
  safety_guidelines: {
    confidentiality_level: 'circle_only' | 'anonymous' | 'name_protected';
    content_warnings: string[];
    cultural_safety_measures: string[];
    crisis_protocols: string[];
    conflict_resolution: 'restorative' | 'traditional' | 'mediated' | 'islamic_mediation';
  };
  accessibility: {
    hearing_accessible: boolean;
    vision_accessible: boolean;
    mobility_accessible: boolean;
    neurodivergent_friendly: boolean;
    translation_available: string[];
    low_bandwidth_support: boolean;
  };
}

export interface CulturalWisdomEntry {
  id: string;
  title: string;
  content: string;
  tradition: string;
  cultural_origin: string;
  contributed_by: string;
  verified_by?: string; // Knowledge keeper verification
  wisdom_type: 'healing_practice' | 'coping_strategy' | 'ritual' | 'story' | 
               'medicine_knowledge' | 'spiritual_guidance' | 'community_practice';
  appropriate_contexts: string[];
  cultural_permissions: {
    open_sharing: boolean;
    community_permission_required: boolean;
    knowledge_keeper_verified: boolean;
    reciprocity_expected: boolean;
  };
  safety_considerations: string[];
  modern_adaptations?: string;
  scientific_backing?: string;
  contraindications: string[];
  tags: string[];
}

export interface LocalizedEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'healing_ceremony' | 'cultural_celebration' | 'support_gathering' |
              'education_workshop' | 'ritual_practice' | 'community_dialogue' |
              'crisis_response' | 'seasonal_observance';
  cultural_significance: {
    tradition: string;
    sacred_level: 'open' | 'restricted' | 'sacred_limited';
    cultural_protocols: string[];
    appropriate_participants: string[];
  };
  timing: {
    datetime: Date;
    timezone: string;
    duration: string;
    follows_cultural_calendar: boolean;
    seasonal_alignment?: string;
    lunar_alignment?: boolean;
  };
  location: {
    type: 'virtual' | 'hybrid' | 'sacred_space' | 'community_center';
    accessibility_features: string[];
    cultural_appropriateness: string;
  };
  facilitation: {
    cultural_leaders: string[];
    knowledge_keepers?: string[];
    community_elders?: string[];
    trained_facilitators: string[];
  };
  participation: {
    registration_required: boolean;
    cultural_prerequisites?: string[];
    preparation_needed: string[];
    materials_provided: boolean;
    sliding_scale_fees: boolean;
  };
}

/**
 * Cultural healing circle templates for different traditions
 */
export const HEALING_CIRCLE_TEMPLATES: Record<string, Partial<HealingCircle>> = {
  ubuntu_circle: {
    name: 'Ubuntu Healing Circle',
    description: 'Community healing based on African Ubuntu philosophy: "I am because we are"',
    circle_type: 'cultural_healing',
    cultural_context: {
      primary_culture: 'african_diaspora',
      healing_traditions: ['ubuntu', 'community_healing', 'storytelling'],
      languages: ['en', 'sw', 'zu'],
      spiritual_elements: true,
      cultural_protocols: ['ancestor_acknowledgment', 'community_blessing', 'shared_wisdom']
    },
    facilitation: {
      facilitators: [],
      rotation_schedule: 'elder_guided',
      cultural_protocols: {
        opening_ritual: 'Ancestor acknowledgment and community blessing',
        closing_ritual: 'Gratitude circle and community commitment',
        speaking_order: 'circle',
        silence_respect: true,
        elder_guidance: true
      }
    },
    safety_guidelines: {
      confidentiality_level: 'circle_only',
      content_warnings: ['intergenerational_trauma', 'colonization_trauma'],
      cultural_safety_measures: ['ubuntu_principles', 'elder_guidance', 'community_consensus'],
      crisis_protocols: ['community_support', 'elder_consultation'],
      conflict_resolution: 'restorative'
    }
  },

  indigenous_talking_circle: {
    name: 'Talking Circle',
    description: 'Traditional Indigenous healing circle with sacred protocols',
    circle_type: 'cultural_healing',
    cultural_context: {
      primary_culture: 'indigenous',
      healing_traditions: ['talking_circles', 'medicine_wheel', 'sacred_directions'],
      languages: ['en', 'indigenous_languages'],
      spiritual_elements: true,
      cultural_protocols: ['smudging', 'sacred_directions', 'talking_stick', 'elder_guidance']
    },
    facilitation: {
      facilitators: [],
      rotation_schedule: 'traditional_keeper_led',
      cultural_protocols: {
        opening_ritual: 'Smudging ceremony and direction acknowledgment',
        closing_ritual: 'Gratitude and sacred closing',
        speaking_order: 'talking_stick',
        silence_respect: true,
        elder_guidance: true
      }
    },
    safety_guidelines: {
      confidentiality_level: 'circle_only',
      content_warnings: ['historical_trauma', 'residential_school_trauma', 'cultural_genocide'],
      cultural_safety_measures: ['traditional_protocols', 'elder_supervision', 'cultural_permission'],
      crisis_protocols: ['traditional_healing', 'community_support'],
      conflict_resolution: 'traditional'
    }
  },

  lgbtq_chosen_family_circle: {
    name: 'Chosen Family Healing Circle',
    description: 'Safe space for LGBTQ+ community healing and chosen family support',
    circle_type: 'identity_support',
    cultural_context: {
      primary_culture: 'lgbtq',
      healing_traditions: ['chosen_family', 'identity_affirmation', 'resilience_building'],
      languages: ['en', 'es', 'multiple'],
      spiritual_elements: false,
      cultural_protocols: ['pronoun_sharing', 'identity_affirmation', 'chosen_family_recognition']
    },
    facilitation: {
      facilitators: [],
      rotation_schedule: 'peer_led_rotation',
      cultural_protocols: {
        opening_ritual: 'Pronoun and identity sharing circle',
        closing_ritual: 'Affirmation and chosen family blessing',
        speaking_order: 'raised_hand',
        silence_respect: true,
        elder_guidance: false
      }
    },
    safety_guidelines: {
      confidentiality_level: 'anonymous',
      content_warnings: ['family_rejection', 'discrimination', 'violence', 'conversion_therapy'],
      cultural_safety_measures: ['lgbtq_affirming', 'no_deadnaming', 'identity_respect'],
      crisis_protocols: ['lgbtq_specific_resources', 'chosen_family_support'],
      conflict_resolution: 'restorative'
    }
  },

  latina_sobadoras_circle: {
    name: 'Círculo de Sobadoras',
    description: 'Traditional Mexican healing circle incorporating curanderismo',
    circle_type: 'cultural_healing',
    cultural_context: {
      primary_culture: 'latina',
      healing_traditions: ['curanderismo', 'sobadoras', 'spiritual_cleansing'],
      languages: ['es', 'en'],
      spiritual_elements: true,
      cultural_protocols: ['spiritual_cleansing', 'family_blessing', 'traditional_prayers']
    },
    facilitation: {
      facilitators: [],
      rotation_schedule: 'curandera_led',
      cultural_protocols: {
        opening_ritual: 'Spiritual cleansing and family blessing',
        closing_ritual: 'Gratitude prayers and family strengthening',
        speaking_order: 'circle',
        silence_respect: true,
        elder_guidance: true
      }
    },
    safety_guidelines: {
      confidentiality_level: 'circle_only',
      content_warnings: ['family_trauma', 'migration_trauma', 'discrimination'],
      cultural_safety_measures: ['traditional_respect', 'family_honor', 'spiritual_safety'],
      crisis_protocols: ['family_involvement', 'spiritual_guidance'],
      conflict_resolution: 'traditional'
    }
  },

  islamic_healing_circle: {
    name: 'Healing Circle with Islamic Guidance',
    description: 'Mental health support incorporating Islamic principles and community',
    circle_type: 'spiritual_exploration',
    cultural_context: {
      primary_culture: 'islamic',
      healing_traditions: ['islamic_healing', 'community_support', 'spiritual_guidance'],
      languages: ['ar', 'ur', 'en'],
      spiritual_elements: true,
      cultural_protocols: ['opening_dua', 'islamic_guidance', 'community_support']
    },
    facilitation: {
      facilitators: [],
      rotation_schedule: 'imam_guided',
      cultural_protocols: {
        opening_ritual: 'Opening dua and Quranic recitation',
        closing_ritual: 'Closing dua and community blessing',
        speaking_order: 'respectful_order',
        silence_respect: true,
        elder_guidance: true
      }
    },
    safety_guidelines: {
      confidentiality_level: 'circle_only',
      content_warnings: ['islamophobia', 'family_pressure', 'cultural_conflicts'],
      cultural_safety_measures: ['islamic_principles', 'gender_considerations', 'family_respect'],
      crisis_protocols: ['imam_consultation', 'family_involvement'],
      conflict_resolution: 'islamic_mediation'
    }
  },

  asian_meditation_circle: {
    name: 'Mindful Healing Circle',
    description: 'Healing circle incorporating Buddhist and Asian mindfulness traditions',
    circle_type: 'spiritual_exploration',
    cultural_context: {
      primary_culture: 'east_asian',
      healing_traditions: ['meditation', 'mindfulness', 'buddhist_principles'],
      languages: ['en', 'zh', 'ja', 'ko'],
      spiritual_elements: true,
      cultural_protocols: ['mindful_opening', 'meditation_practice', 'wisdom_sharing']
    },
    facilitation: {
      facilitators: [],
      rotation_schedule: 'meditation_teacher_led',
      cultural_protocols: {
        opening_ritual: 'Mindful breathing and intention setting',
        closing_ritual: 'Meditation and merit dedication',
        speaking_order: 'mindful_sharing',
        silence_respect: true,
        elder_guidance: true
      }
    },
    safety_guidelines: {
      confidentiality_level: 'circle_only',
      content_warnings: ['family_pressure', 'academic_stress', 'cultural_expectations'],
      cultural_safety_measures: ['face_saving', 'family_honor', 'indirect_communication'],
      crisis_protocols: ['family_consultation', 'meditation_support'],
      conflict_resolution: 'mediated'
    }
  }
};

/**
 * Create a culturally-appropriate healing circle
 */
export function createHealingCircle(
  template: string,
  customizations: Partial<HealingCircle>,
  locale: string
): HealingCircle {
  const baseTemplate = HEALING_CIRCLE_TEMPLATES[template];
  if (!baseTemplate) {
    throw new Error(`Healing circle template '${template}' not found`);
  }

  const localeConfig = getLocaleConfig(locale);
  const culturalAdaptations = adaptCircleForLocale(baseTemplate, localeConfig);

  return {
    id: generateCircleId(),
    name: customizations.name || baseTemplate.name || 'Healing Circle',
    description: customizations.description || baseTemplate.description || '',
    circle_type: customizations.circle_type || baseTemplate.circle_type || 'peer_support',
    cultural_context: {
      ...baseTemplate.cultural_context,
      ...customizations.cultural_context,
      ...culturalAdaptations.cultural_context
    },
    membership: {
      criteria: customizations.membership?.criteria || {},
      size_limit: customizations.membership?.size_limit || 12,
      waiting_list: customizations.membership?.waiting_list || true,
      approval_process: customizations.membership?.approval_process || 'moderated'
    },
    facilitation: {
      ...baseTemplate.facilitation,
      ...customizations.facilitation
    },
    schedule: {
      frequency: customizations.schedule?.frequency || 'weekly',
      duration: customizations.schedule?.duration || '90_minutes',
      timezone_rotation: customizations.schedule?.timezone_rotation || false,
      cultural_calendar_aligned: customizations.schedule?.cultural_calendar_aligned || true,
      sacred_time_respect: customizations.schedule?.sacred_time_respect || []
    },
    safety_guidelines: {
      ...baseTemplate.safety_guidelines,
      ...customizations.safety_guidelines
    },
    accessibility: {
      hearing_accessible: customizations.accessibility?.hearing_accessible || true,
      vision_accessible: customizations.accessibility?.vision_accessible || true,
      mobility_accessible: customizations.accessibility?.mobility_accessible || true,
      neurodivergent_friendly: customizations.accessibility?.neurodivergent_friendly || true,
      translation_available: customizations.accessibility?.translation_available || [locale],
      low_bandwidth_support: customizations.accessibility?.low_bandwidth_support || true
    }
  } as HealingCircle;
}

function adaptCircleForLocale(
  template: Partial<HealingCircle>,
  localeConfig: LocaleConfig
): Partial<HealingCircle> {
  const adaptations: Partial<HealingCircle> = {
    cultural_context: {
      ...template.cultural_context,
      languages: [localeConfig.locale, ...template.cultural_context?.languages || []],
    }
  };

  // Add cultural protocols based on locale
  if (localeConfig.culturalContext.spiritualConsiderations.length > 0) {
    adaptations.cultural_context!.spiritual_elements = true;
  }

  // Adapt communication style
  if (localeConfig.culturalContext.communicationStyle === 'indirect') {
    if (adaptations.facilitation?.cultural_protocols) {
      adaptations.facilitation.cultural_protocols.speaking_order = 'circle';
    }
  }

  return adaptations;
}

function generateCircleId(): string {
  return `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Match users to appropriate healing circles
 */
export function matchUserToCircles(
  user: CommunityMember,
  availableCircles: HealingCircle[]
): Array<{
  circle: HealingCircle;
  matchScore: number;
  matchReasons: string[];
  culturalFit: string[];
  warnings?: string[];
}> {
  const matches = availableCircles.map(circle => {
    const match = evaluateCircleMatch(user, circle);
    return {
      circle,
      ...match
    };
  });

  return matches
    .filter(match => match.matchScore > 0.3)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function evaluateCircleMatch(
  user: CommunityMember,
  circle: HealingCircle
): {
  matchScore: number;
  matchReasons: string[];
  culturalFit: string[];
  warnings?: string[];
} {
  let score = 0.0;
  const matchReasons: string[] = [];
  const culturalFit: string[] = [];
  const warnings: string[] = [];

  // Cultural background matching
  const userCultures = user.culturalBackground;
  const circleCulture = circle.cultural_context.primary_culture;
  if (userCultures.includes(circleCulture)) {
    score += 0.4;
    matchReasons.push(`Matches your ${circleCulture} cultural background`);
  }

  // Healing tradition preferences
  const userTraditions = user.healingPreferences.preferred_traditions;
  const circleTraditions = circle.cultural_context.healing_traditions;
  const traditionMatch = userTraditions.filter(t => circleTraditions.includes(t)).length;
  if (traditionMatch > 0) {
    score += 0.3 * (traditionMatch / circleTraditions.length);
    matchReasons.push(`Incorporates your preferred healing traditions`);
  }

  // Language compatibility
  const userLanguages = user.languages;
  const circleLanguages = circle.cultural_context.languages;
  const hasLanguageMatch = userLanguages.some(lang => 
    circleLanguages.some(circleLang => lang.startsWith(circleLang))
  );
  if (hasLanguageMatch) {
    score += 0.2;
    matchReasons.push('Available in your language');
  } else {
    warnings?.push('Language barriers may exist');
  }

  // Identity marker matching
  if (circle.circle_type === 'identity_support') {
    // Check for identity-specific circles (e.g., LGBTQ+, immigrant, etc.)
    if (circle.name.toLowerCase().includes('lgbtq') && 
        (user.identityMarkers.gender_identity !== 'cisgender' || 
         user.identityMarkers.sexual_orientation !== 'heterosexual')) {
      score += 0.5;
      matchReasons.push('Designed for LGBTQ+ community');
    }

    if (circle.name.toLowerCase().includes('immigrant') && 
        user.identityMarkers.immigrant_refugee) {
      score += 0.4;
      matchReasons.push('Supports immigrant and refugee experiences');
    }
  }

  // Communication style compatibility
  const userStyle = user.healingPreferences.communication_style;
  if ((userStyle === 'indirect' && circle.facilitation.cultural_protocols?.silence_respect) ||
      (userStyle === 'spiritual' && circle.cultural_context.spiritual_elements)) {
    score += 0.2;
    culturalFit.push('Communication style aligns with circle format');
  }

  // Anonymity preferences
  const userAnonymity = user.healingPreferences.anonymity_level;
  const circleConfidentiality = circle.safety_guidelines.confidentiality_level;
  if ((userAnonymity === 'full' && circleConfidentiality === 'anonymous') ||
      (userAnonymity === 'partial' && circleConfidentiality === 'name_protected')) {
    score += 0.2;
    matchReasons.push('Matches your privacy preferences');
  }

  // Age appropriateness
  if (circle.membership.criteria.age_range) {
    const userAge = user.identityMarkers.age_range;
    if (circle.membership.criteria.age_range === userAge) {
      score += 0.1;
      matchReasons.push('Age-appropriate group');
    }
  }

  // Cultural safety assessment
  assessCulturalSafety(user, circle, culturalFit, warnings);

  return {
    matchScore: Math.max(0, Math.min(1, score)),
    matchReasons,
    culturalFit,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

function assessCulturalSafety(
  user: CommunityMember,
  circle: HealingCircle,
  culturalFit: string[],
  warnings: string[]
): void {
  // Check if circle has appropriate cultural safety measures
  const safetyMeasures = circle.safety_guidelines.cultural_safety_measures;
  
  if ((user.identityMarkers.gender_identity && user.identityMarkers.gender_identity !== 'cisgender') || 
      (user.identityMarkers.sexual_orientation && user.identityMarkers.sexual_orientation !== 'heterosexual')) {
    if (!safetyMeasures.includes('lgbtq_affirming')) {
      warnings.push('LGBTQ+ safety measures not explicitly mentioned');
    }
  }

  if (user.identityMarkers.race_ethnicity && 
      !safetyMeasures.some(measure => measure.includes('racial') || measure.includes('ethnic'))) {
    warnings.push('Racial/ethnic safety measures not explicitly mentioned');
  }

  if (user.identityMarkers.immigrant_refugee && 
      !safetyMeasures.includes('immigration_safe')) {
    warnings.push('Immigration status safety not explicitly addressed');
  }

  // Positive cultural safety indicators
  if (safetyMeasures.includes('elder_guidance')) {
    culturalFit.push('Includes elder guidance and wisdom');
  }

  if (safetyMeasures.includes('traditional_protocols')) {
    culturalFit.push('Follows traditional cultural protocols');
  }

  if (safetyMeasures.includes('restorative_justice')) {
    culturalFit.push('Uses restorative approach to conflict');
  }
}

/**
 * Generate community guidelines for a specific cultural context
 */
export function generateCommunityGuidelines(
  locale: string,
  circleType: string
): {
  principles: string[];
  protocols: string[];
  safety_measures: string[];
  cultural_considerations: string[];
  crisis_procedures: string[];
} {
  const localeConfig = getLocaleConfig(locale);
  const culturalContext = localeConfig.culturalContext;

  const guidelines = {
    principles: [
      'Respect for all identities and experiences',
      'Commitment to confidentiality and safety',
      'Honor for diverse healing traditions',
      'Support without judgment or advice-giving'
    ],
    protocols: [
      'Speak from personal experience using "I" statements',
      'Listen with compassion and without interruption',
      'Respect silence and processing time',
      'Honor different communication styles and paces'
    ],
    safety_measures: [
      'Zero tolerance for discrimination or harassment',
      'Content warnings for potentially triggering topics',
      'Right to pass or step away when needed',
      'Crisis support protocols available'
    ],
    cultural_considerations: [],
    crisis_procedures: [
      'Facilitator intervention for safety concerns',
      'Connection to culturally-appropriate crisis resources',
      'Community support activation when appropriate',
      'Professional referrals when needed'
    ]
  };

  // Add cultural-specific considerations
  if (culturalContext.culturalValues.collectivism > 60) {
    guidelines.cultural_considerations.push(
      'Honor family and community perspectives in healing',
      'Recognize healing as beneficial to the whole community',
      'Include extended support networks when appropriate'
    );
  }

  if (culturalContext.healingTraditions.includes('ancestor_wisdom')) {
    guidelines.cultural_considerations.push(
      'Acknowledge ancestral wisdom and guidance',
      'Respect traditional healing knowledge',
      'Honor intergenerational healing connections'
    );
  }

  if (culturalContext.spiritualConsiderations.length > 0) {
    guidelines.cultural_considerations.push(
      'Welcome spiritual perspectives and practices',
      'Respect diverse religious and spiritual beliefs',
      'Honor prayer, ritual, and sacred practices'
    );
  }

  if (culturalContext.communicationStyle === 'indirect') {
    guidelines.protocols.push(
      'Allow for indirect communication and storytelling',
      'Respect non-verbal communication and silence',
      'Honor different ways of expressing emotion and need'
    );
  }

  return guidelines;
}

/**
 * Create cultural wisdom sharing system
 */
export function createWisdomEntry(
  wisdom: Omit<CulturalWisdomEntry, 'id'>,
  contributor: CommunityMember
): CulturalWisdomEntry {
  // Validate cultural permissions
  const validation = validateWisdomSharing(wisdom, contributor);
  if (!validation.canShare) {
    throw new Error(`Cannot share wisdom: ${validation.reasons.join(', ')}`);
  }

  return {
    id: generateWisdomId(),
    ...wisdom,
    contributed_by: contributor.id,
    // Additional validation and verification would happen here
  };
}

function validateWisdomSharing(
  wisdom: Omit<CulturalWisdomEntry, 'id'>,
  contributor: CommunityMember
): {
  canShare: boolean;
  reasons: string[];
  requirements: string[];
} {
  const reasons: string[] = [];
  const requirements: string[] = [];
  let canShare = true;

  // Check if contributor has cultural connection
  const hasCulturalConnection = contributor.culturalBackground.includes(wisdom.cultural_origin);
  if (!hasCulturalConnection && wisdom.cultural_permissions.community_permission_required) {
    canShare = false;
    reasons.push('No cultural connection to tradition');
    requirements.push('Community permission required');
  }

  // Check for sacred knowledge
  if (wisdom.wisdom_type === 'ritual' && 
      wisdom.cultural_permissions.knowledge_keeper_verified && 
      !wisdom.verified_by) {
    canShare = false;
    reasons.push('Sacred knowledge requires verification');
    requirements.push('Knowledge keeper verification needed');
  }

  // Check for appropriation risk
  if (!hasCulturalConnection && wisdom.cultural_permissions.reciprocity_expected) {
    requirements.push('Reciprocity to originating community expected');
  }

  return {
    canShare,
    reasons,
    requirements
  };
}

function generateWisdomId(): string {
  return `wisdom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

