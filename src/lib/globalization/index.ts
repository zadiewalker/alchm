/**
 * ALCHM Global Expansion Framework
 * 
 * Comprehensive internationalization and cultural adaptation system
 * for trauma-informed mental wellness serving marginalized communities worldwide
 */

export interface CulturalContext {
  region: string;
  language: string;
  script: 'ltr' | 'rtl';
  culturalValues: {
    collectivism: number; // 0-100 scale
    powerDistance: number; // 0-100 scale
    uncertaintyAvoidance: number; // 0-100 scale
    masculinity: number; // 0-100 scale
    longTermOrientation: number; // 0-100 scale
    indulgence: number; // 0-100 scale
  };
  healingTraditions: string[];
  spiritualConsiderations: string[];
  familyStructure: 'nuclear' | 'extended' | 'chosen' | 'communal';
  communicationStyle: 'direct' | 'indirect' | 'high-context' | 'low-context';
  traumaExpression: 'somatic' | 'emotional' | 'relational' | 'spiritual' | 'mixed';
  timeOrientation: 'linear' | 'cyclical' | 'polychronic' | 'monochronic';
}

export interface LocaleConfig {
  locale: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  region: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  culturalContext: CulturalContext;
  crisisResources: CrisisResource[];
  legalFramework: LegalFramework;
  enabled: boolean;
}

export interface CrisisResource {
  type: 'hotline' | 'text' | 'chat' | 'emergency' | 'clinic' | 'peer_support';
  name: string;
  contact: string;
  description: string;
  languages: string[];
  availability: string;
  specialties: string[];
  marginalized_friendly: boolean;
  lgbtq_affirming: boolean;
  poc_centered: boolean;
  trauma_informed: boolean;
  confidentiality_level: 'anonymous' | 'confidential' | 'reported';
  cost: 'free' | 'sliding_scale' | 'insurance' | 'paid';
  accessibility: {
    wheelchair: boolean;
    deaf: boolean;
    blind: boolean;
    neurodivergent_friendly: boolean;
  };
}

export interface LegalFramework {
  dataProtection: 'gdpr' | 'lgpd' | 'pipeda' | 'ccpa' | 'pdpa' | 'other';
  dataResidencyRequired: boolean;
  crossBorderTransfer: 'prohibited' | 'restricted' | 'allowed';
  mandatoryReporting: {
    required: boolean;
    conditions: string[];
    exemptions: string[];
  };
  mentalHealthLaws: {
    involuntaryHold: boolean;
    dutyToWarn: boolean;
    parentalConsent: boolean;
  };
  lgbtqRights: {
    protectionLevel: 'full' | 'partial' | 'none' | 'illegal';
    conversionTherapyBan: boolean;
    genderAffirmingCare: boolean;
  };
}

/**
 * Comprehensive locale configurations for global expansion
 * Each locale includes cultural context, crisis resources, and legal frameworks
 */
export const GLOBAL_LOCALES: Record<string, LocaleConfig> = {
  // English-speaking regions
  'en-US': {
    locale: 'en-US',
    name: 'English (United States)',
    nativeName: 'English (United States)',
    direction: 'ltr',
    region: 'North America',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    culturalContext: {
      region: 'North America',
      language: 'English',
      script: 'ltr',
      culturalValues: {
        collectivism: 10,
        powerDistance: 40,
        uncertaintyAvoidance: 46,
        masculinity: 62,
        longTermOrientation: 26,
        indulgence: 68
      },
      healingTraditions: ['therapy', 'medication', 'peer_support', 'indigenous_practices'],
      spiritualConsiderations: ['christianity', 'secular', 'indigenous_spirituality', 'new_age'],
      familyStructure: 'nuclear',
      communicationStyle: 'direct',
      traumaExpression: 'emotional',
      timeOrientation: 'linear'
    },
    crisisResources: [
      {
        type: 'hotline',
        name: 'National Suicide Prevention Lifeline',
        contact: '988',
        description: '24/7 crisis support for people in suicidal crisis or emotional distress',
        languages: ['en', 'es'],
        availability: '24/7',
        specialties: ['suicide', 'crisis', 'mental_health'],
        marginalized_friendly: true,
        lgbtq_affirming: true,
        poc_centered: false,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: true,
          deaf: true,
          blind: true,
          neurodivergent_friendly: true
        }
      },
      {
        type: 'text',
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        description: '24/7 crisis support via text message',
        languages: ['en', 'es'],
        availability: '24/7',
        specialties: ['crisis', 'youth', 'lgbtq'],
        marginalized_friendly: true,
        lgbtq_affirming: true,
        poc_centered: false,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: true,
          deaf: true,
          blind: false,
          neurodivergent_friendly: true
        }
      },
      {
        type: 'hotline',
        name: 'Trans Lifeline',
        contact: '877-565-8860',
        description: 'Trans-led crisis support hotline for trans people',
        languages: ['en', 'es'],
        availability: '24/7',
        specialties: ['transgender', 'crisis', 'peer_support'],
        marginalized_friendly: true,
        lgbtq_affirming: true,
        poc_centered: false,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: true,
          deaf: false,
          blind: true,
          neurodivergent_friendly: true
        }
      },
      {
        type: 'hotline',
        name: 'LGBT National Hotline',
        contact: '1-888-843-4564',
        description: 'Peer counseling and local resources for LGBTQ+ individuals',
        languages: ['en'],
        availability: 'Mon-Fri 4pm-12am, Sat-Sun 12pm-5pm EST',
        specialties: ['lgbtq', 'peer_support', 'resources'],
        marginalized_friendly: true,
        lgbtq_affirming: true,
        poc_centered: false,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: true,
          deaf: true,
          blind: true,
          neurodivergent_friendly: true
        }
      }
    ],
    legalFramework: {
      dataProtection: 'other',
      dataResidencyRequired: false,
      crossBorderTransfer: 'allowed',
      mandatoryReporting: {
        required: true,
        conditions: ['imminent_harm_self', 'imminent_harm_others', 'child_abuse', 'elder_abuse'],
        exemptions: ['past_trauma', 'suicidal_ideation_without_plan']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: true,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'partial',
        conversionTherapyBan: false,
        genderAffirmingCare: true
      }
    },
    enabled: true
  },

  // Spanish-speaking regions
  'es-MX': {
    locale: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español (México)',
    direction: 'ltr',
    region: 'Latin America',
    currency: 'MXN',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    culturalContext: {
      region: 'Latin America',
      language: 'Spanish',
      script: 'ltr',
      culturalValues: {
        collectivism: 70,
        powerDistance: 81,
        uncertaintyAvoidance: 82,
        masculinity: 69,
        longTermOrientation: 24,
        indulgence: 97
      },
      healingTraditions: ['curanderismo', 'sobadoras', 'hierbas', 'family_support', 'religious_healing'],
      spiritualConsiderations: ['catholicism', 'indigenous_beliefs', 'santeria', 'folk_religion'],
      familyStructure: 'extended',
      communicationStyle: 'high-context',
      traumaExpression: 'somatic',
      timeOrientation: 'cyclical'
    },
    crisisResources: [
      {
        type: 'hotline',
        name: 'Línea de la Vida',
        contact: '800-911-2000',
        description: 'Línea nacional de prevención del suicidio en México',
        languages: ['es'],
        availability: '24/7',
        specialties: ['suicide', 'crisis', 'mental_health'],
        marginalized_friendly: true,
        lgbtq_affirming: false,
        poc_centered: true,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: false,
          deaf: false,
          blind: true,
          neurodivergent_friendly: false
        }
      },
      {
        type: 'hotline',
        name: 'Consejo Ciudadano',
        contact: '5533-5533',
        description: 'Apoyo psicológico y orientación en crisis',
        languages: ['es'],
        availability: '24/7',
        specialties: ['crisis', 'violence', 'family'],
        marginalized_friendly: true,
        lgbtq_affirming: false,
        poc_centered: true,
        trauma_informed: false,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: false,
          deaf: false,
          blind: true,
          neurodivergent_friendly: false
        }
      }
    ],
    legalFramework: {
      dataProtection: 'other',
      dataResidencyRequired: true,
      crossBorderTransfer: 'restricted',
      mandatoryReporting: {
        required: true,
        conditions: ['child_abuse', 'family_violence'],
        exemptions: ['adult_trauma']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: false,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'partial',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    enabled: true
  },

  // Arabic-speaking regions
  'ar-SA': {
    locale: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (المملكة العربية السعودية)',
    direction: 'rtl',
    region: 'Middle East',
    currency: 'SAR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h',
    culturalContext: {
      region: 'Middle East',
      language: 'Arabic',
      script: 'rtl',
      culturalValues: {
        collectivism: 75,
        powerDistance: 95,
        uncertaintyAvoidance: 80,
        masculinity: 60,
        longTermOrientation: 36,
        indulgence: 52
      },
      healingTraditions: ['quranic_healing', 'herbal_medicine', 'family_support', 'community_elders'],
      spiritualConsiderations: ['islam', 'traditional_beliefs'],
      familyStructure: 'extended',
      communicationStyle: 'indirect',
      traumaExpression: 'somatic',
      timeOrientation: 'cyclical'
    },
    crisisResources: [
      {
        type: 'hotline',
        name: 'مركز الدعم النفسي',
        contact: '920033360',
        description: 'خط المساعدة النفسية الوطني',
        languages: ['ar', 'en'],
        availability: '24/7',
        specialties: ['mental_health', 'crisis', 'family'],
        marginalized_friendly: false,
        lgbtq_affirming: false,
        poc_centered: true,
        trauma_informed: false,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: false,
          deaf: false,
          blind: true,
          neurodivergent_friendly: false
        }
      }
    ],
    legalFramework: {
      dataProtection: 'other',
      dataResidencyRequired: true,
      crossBorderTransfer: 'prohibited',
      mandatoryReporting: {
        required: true,
        conditions: ['all_mental_health', 'family_issues'],
        exemptions: []
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: true,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'illegal',
        conversionTherapyBan: false,
        genderAffirmingCare: false
      }
    },
    enabled: true
  },

  // European regions
  'de-DE': {
    locale: 'de-DE',
    name: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    direction: 'ltr',
    region: 'Europe',
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h',
    culturalContext: {
      region: 'Europe',
      language: 'German',
      script: 'ltr',
      culturalValues: {
        collectivism: 33,
        powerDistance: 35,
        uncertaintyAvoidance: 65,
        masculinity: 66,
        longTermOrientation: 83,
        indulgence: 40
      },
      healingTraditions: ['psychotherapy', 'naturopathy', 'wellness', 'medical_model'],
      spiritualConsiderations: ['christianity', 'secular', 'eastern_philosophy'],
      familyStructure: 'nuclear',
      communicationStyle: 'direct',
      traumaExpression: 'emotional',
      timeOrientation: 'linear'
    },
    crisisResources: [
      {
        type: 'hotline',
        name: 'Telefonseelsorge',
        contact: '0800-111-0-111 or 0800-111-0-222',
        description: 'Kostenlose Beratung in Krisen und schwierigen Lebenssituationen',
        languages: ['de', 'en', 'tr'],
        availability: '24/7',
        specialties: ['crisis', 'suicide', 'mental_health'],
        marginalized_friendly: true,
        lgbtq_affirming: true,
        poc_centered: false,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: true,
          deaf: true,
          blind: true,
          neurodivergent_friendly: true
        }
      }
    ],
    legalFramework: {
      dataProtection: 'gdpr',
      dataResidencyRequired: true,
      crossBorderTransfer: 'restricted',
      mandatoryReporting: {
        required: false,
        conditions: [],
        exemptions: ['therapeutic_privilege']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
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
  },

  // Asian regions
  'hi-IN': {
    locale: 'hi-IN',
    name: 'Hindi (India)',
    nativeName: 'हिन्दी (भारत)',
    direction: 'ltr',
    region: 'South Asia',
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h',
    culturalContext: {
      region: 'South Asia',
      language: 'Hindi',
      script: 'ltr',
      culturalValues: {
        collectivism: 77,
        powerDistance: 77,
        uncertaintyAvoidance: 40,
        masculinity: 56,
        longTermOrientation: 51,
        indulgence: 26
      },
      healingTraditions: ['ayurveda', 'yoga', 'meditation', 'family_guidance', 'religious_healing'],
      spiritualConsiderations: ['hinduism', 'islam', 'sikhism', 'buddhism', 'jainism'],
      familyStructure: 'extended',
      communicationStyle: 'indirect',
      traumaExpression: 'somatic',
      timeOrientation: 'cyclical'
    },
    crisisResources: [
      {
        type: 'hotline',
        name: 'आशा हेल्पलाइन (Aasra Helpline)',
        contact: '9820466726',
        description: 'आत्महत्या रोकथाम और भावनात्मक सहायता',
        languages: ['hi', 'en', 'mr'],
        availability: '24/7',
        specialties: ['suicide', 'crisis', 'mental_health'],
        marginalized_friendly: true,
        lgbtq_affirming: false,
        poc_centered: true,
        trauma_informed: false,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: false,
          deaf: false,
          blind: true,
          neurodivergent_friendly: false
        }
      }
    ],
    legalFramework: {
      dataProtection: 'pdpa',
      dataResidencyRequired: true,
      crossBorderTransfer: 'restricted',
      mandatoryReporting: {
        required: true,
        conditions: ['child_abuse', 'domestic_violence'],
        exemptions: ['marital_issues', 'family_disputes']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: false,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'partial',
        conversionTherapyBan: false,
        genderAffirmingCare: true
      }
    },
    enabled: true
  },

  // Additional locales for comprehensive coverage
  'pt-BR': {
    locale: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    direction: 'ltr',
    region: 'South America',
    currency: 'BRL',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    culturalContext: {
      region: 'South America',
      language: 'Portuguese',
      script: 'ltr',
      culturalValues: {
        collectivism: 62,
        powerDistance: 69,
        uncertaintyAvoidance: 76,
        masculinity: 49,
        longTermOrientation: 44,
        indulgence: 59
      },
      healingTraditions: ['umbanda', 'candomble', 'spiritism', 'family_support', 'community_healing'],
      spiritualConsiderations: ['catholicism', 'protestantism', 'spiritism', 'afro_brazilian'],
      familyStructure: 'extended',
      communicationStyle: 'high-context',
      traumaExpression: 'relational',
      timeOrientation: 'polychronic'
    },
    crisisResources: [
      {
        type: 'hotline',
        name: 'Centro de Valorização da Vida (CVV)',
        contact: '188',
        description: 'Prevenção do suicídio e apoio emocional',
        languages: ['pt'],
        availability: '24/7',
        specialties: ['suicide', 'crisis', 'emotional_support'],
        marginalized_friendly: true,
        lgbtq_affirming: true,
        poc_centered: true,
        trauma_informed: true,
        confidentiality_level: 'confidential',
        cost: 'free',
        accessibility: {
          wheelchair: true,
          deaf: false,
          blind: true,
          neurodivergent_friendly: false
        }
      }
    ],
    legalFramework: {
      dataProtection: 'lgpd',
      dataResidencyRequired: true,
      crossBorderTransfer: 'restricted',
      mandatoryReporting: {
        required: true,
        conditions: ['child_abuse', 'elder_abuse', 'domestic_violence'],
        exemptions: ['therapeutic_relationship']
      },
      mentalHealthLaws: {
        involuntaryHold: true,
        dutyToWarn: false,
        parentalConsent: true
      },
      lgbtqRights: {
        protectionLevel: 'full',
        conversionTherapyBan: true,
        genderAffirmingCare: true
      }
    },
    enabled: true
  }
};

/**
 * Get the appropriate locale configuration based on user's location and preferences
 */
export function getLocaleConfig(locale: string): LocaleConfig {
  return GLOBAL_LOCALES[locale] || GLOBAL_LOCALES['en-US'];
}

/**
 * Get all enabled locales for the platform
 */
export function getEnabledLocales(): LocaleConfig[] {
  return Object.values(GLOBAL_LOCALES).filter(locale => locale.enabled);
}

/**
 * Determine if a locale requires special cultural considerations for therapy
 */
export function requiresCulturalAdaptation(locale: string): boolean {
  const config = getLocaleConfig(locale);
  return config.culturalContext.culturalValues.collectivism > 50 || 
         config.culturalContext.communicationStyle === 'indirect' ||
         config.culturalContext.healingTraditions.length > 3;
}

/**
 * Get appropriate crisis resources for a user's location and identity
 */
export function getCrisisResourcesForUser(
  locale: string,
  userProfile: {
    isLGBTQ?: boolean;
    isPOC?: boolean;
    hasDisability?: boolean;
    age?: number;
    needsAnonymity?: boolean;
  }
): CrisisResource[] {
  const config = getLocaleConfig(locale);
  
  return config.crisisResources.filter(resource => {
    // Filter by user identity and needs
    if (userProfile.isLGBTQ && !resource.lgbtq_affirming) return false;
    if (userProfile.isPOC && !resource.poc_centered && !resource.marginalized_friendly) return false;
    if (userProfile.needsAnonymity && resource.confidentiality_level !== 'anonymous') return false;
    
    // Filter by accessibility needs
    if (userProfile.hasDisability) {
      // This would be expanded based on specific disability needs
      return resource.accessibility.wheelchair || 
             resource.accessibility.deaf || 
             resource.accessibility.blind ||
             resource.accessibility.neurodivergent_friendly;
    }
    
    return true;
  }).sort((a, b) => {
    // Prioritize resources that are more inclusive
    let scoreA = 0;
    let scoreB = 0;
    
    if (a.marginalized_friendly) scoreA++;
    if (a.lgbtq_affirming) scoreA++;
    if (a.poc_centered) scoreA++;
    if (a.trauma_informed) scoreA++;
    
    if (b.marginalized_friendly) scoreB++;
    if (b.lgbtq_affirming) scoreB++;
    if (b.poc_centered) scoreB++;
    if (b.trauma_informed) scoreB++;
    
    return scoreB - scoreA;
  });
}