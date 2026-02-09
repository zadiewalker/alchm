/**
 * Global Crisis Resource Integration System
 * 
 * Comprehensive crisis intervention system providing culturally-appropriate,
 * accessible, and marginalized-community-friendly crisis resources worldwide
 */

import { CrisisResource, LocaleConfig, getLocaleConfig } from './index';

export interface UserCrisisProfile {
  age: number;
  gender?: string;
  pronouns?: string[];
  sexualOrientation?: string;
  genderIdentity?: string;
  race?: string;
  ethnicity?: string;
  immigrationStatus?: 'citizen' | 'resident' | 'visa' | 'undocumented' | 'refugee' | 'asylum';
  disabilities?: string[];
  languages: string[];
  location: {
    country: string;
    state?: string;
    city?: string;
    timeZone: string;
  };
  safetyConsiderations: {
    safeToCallAuthorities: boolean;
    needsAnonymity: boolean;
    hasPrivateSpace: boolean;
    concernsAboutDiscrimination: boolean;
    previousNegativeExperiences: string[];
  };
  supportPreferences: {
    prefersPeerSupport: boolean;
    needsCulturallyMatchedCounselor: boolean;
    religiousAffiliation?: string;
    traumaInformedCareRequired: boolean;
    accessibilityNeeds: string[];
  };
  crisisType: 'suicidal_ideation' | 'self_harm' | 'domestic_violence' | 'sexual_assault' | 
             'substance_abuse' | 'psychosis' | 'panic_attack' | 'discrimination' | 
             'family_crisis' | 'academic_pressure' | 'work_stress' | 'financial_crisis' |
             'immigration_issues' | 'identity_crisis' | 'spiritual_crisis' | 'other';
}

export interface CrisisResourceMatch {
  resource: CrisisResource;
  matchScore: number;
  matchReasons: string[];
  warnings?: string[];
  culturalConsiderations: string[];
  accessInstructions: string;
  safetyTips: string[];
}

export interface CrisisInterventionPlan {
  immediate: CrisisResourceMatch[];
  followUp: CrisisResourceMatch[];
  ongoing: CrisisResourceMatch[];
  selfCare: {
    groundingTechniques: string[];
    safetyPlan: string[];
    culturallyAdaptedCoping: string[];
  };
  communityResources: {
    local: CrisisResourceMatch[];
    cultural: CrisisResourceMatch[];
    peer: CrisisResourceMatch[];
  };
}

/**
 * Comprehensive global crisis resources database
 * Organized by region with cultural and accessibility considerations
 */
export const GLOBAL_CRISIS_RESOURCES: Record<string, CrisisResource[]> = {
  'en-US': [
    {
      type: 'hotline',
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      description: 'Free, confidential 24/7 crisis counseling and support',
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
      description: 'Free 24/7 crisis counseling via text message',
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
      description: 'Trans-led crisis support hotline run by and for transgender people',
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
      description: 'Peer counseling, information, and local resources for LGBTQ+ community',
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
    },
    {
      type: 'hotline',
      name: 'RAINN National Sexual Assault Hotline',
      contact: '1-800-656-4673',
      description: 'Confidential support for survivors of sexual assault',
      languages: ['en', 'es'],
      availability: '24/7',
      specialties: ['sexual_assault', 'trauma', 'survivor_support'],
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
      type: 'hotline',
      name: 'National Domestic Violence Hotline',
      contact: '1-800-799-7233',
      description: 'Confidential support for domestic violence survivors',
      languages: ['en', 'es', 'over_200_languages'],
      availability: '24/7',
      specialties: ['domestic_violence', 'safety_planning', 'survivor_support'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: true,
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
      type: 'peer_support',
      name: 'Black Mental Health Alliance',
      contact: 'blackmentalhealth.com/crisis-resources',
      description: 'Crisis resources specifically for Black communities',
      languages: ['en'],
      availability: 'Varies by resource',
      specialties: ['black_mental_health', 'cultural_therapy', 'community_support'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: true,
      trauma_informed: true,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: true,
        deaf: false,
        blind: false,
        neurodivergent_friendly: true
      }
    },
    {
      type: 'hotline',
      name: 'SAMHSA National Helpline',
      contact: '1-800-662-4357',
      description: 'Treatment referrals and information for substance abuse and mental health',
      languages: ['en', 'es'],
      availability: '24/7',
      specialties: ['substance_abuse', 'mental_health', 'treatment_referrals'],
      marginalized_friendly: true,
      lgbtq_affirming: false,
      poc_centered: false,
      trauma_informed: true,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: true,
        deaf: true,
        blind: true,
        neurodivergent_friendly: false
      }
    }
  ],

  'es-MX': [
    {
      type: 'hotline',
      name: 'Línea de la Vida',
      contact: '800-911-2000',
      description: 'Línea nacional gratuita de prevención del suicidio en México',
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
      name: 'Consejo Ciudadano para la Seguridad y Justicia',
      contact: '5533-5533',
      description: 'Apoyo psicológico y orientación en situaciones de crisis',
      languages: ['es'],
      availability: '24/7',
      specialties: ['crisis', 'violence', 'family_support'],
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
    },
    {
      type: 'hotline',
      name: 'Línea Mujeres',
      contact: '01-800-108-4053',
      description: 'Línea de apoyo para mujeres en situación de violencia',
      languages: ['es', 'indigenous_languages'],
      availability: '24/7',
      specialties: ['domestic_violence', 'womens_support', 'indigenous_support'],
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
      type: 'peer_support',
      name: 'Fundación Arcoíris',
      contact: 'fundacionarcoiris.org.mx',
      description: 'Apoyo para la comunidad LGBTIQ+ en México',
      languages: ['es'],
      availability: 'Business hours',
      specialties: ['lgbtq', 'discrimination', 'peer_support'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: true,
      trauma_informed: false,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: false,
        deaf: false,
        blind: false,
        neurodivergent_friendly: false
      }
    }
  ],

  'ar-SA': [
    {
      type: 'hotline',
      name: 'مركز الدعم النفسي والاجتماعي',
      contact: '920033360',
      description: 'خط المساعدة النفسية والاجتماعية في المملكة العربية السعودية',
      languages: ['ar', 'en'],
      availability: '24/7',
      specialties: ['mental_health', 'crisis', 'family_support'],
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
    },
    {
      type: 'clinic',
      name: 'مستشفى الملك فيصل التخصصي - الطب النفسي',
      contact: '+966-11-464-7272',
      description: 'خدمات الطب النفسي المتخصصة',
      languages: ['ar', 'en'],
      availability: 'Hospital hours',
      specialties: ['mental_health', 'psychiatric_care', 'family_therapy'],
      marginalized_friendly: false,
      lgbtq_affirming: false,
      poc_centered: true,
      trauma_informed: false,
      confidentiality_level: 'confidential',
      cost: 'insurance',
      accessibility: {
        wheelchair: true,
        deaf: false,
        blind: false,
        neurodivergent_friendly: false
      }
    }
  ],

  'de-DE': [
    {
      type: 'hotline',
      name: 'Telefonseelsorge',
      contact: '0800-111-0-111 or 0800-111-0-222',
      description: 'Kostenlose, anonyme Beratung in Krisen und schwierigen Lebenssituationen',
      languages: ['de', 'en', 'tr'],
      availability: '24/7',
      specialties: ['crisis', 'suicide', 'mental_health'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: false,
      trauma_informed: true,
      confidentiality_level: 'anonymous',
      cost: 'free',
      accessibility: {
        wheelchair: true,
        deaf: true,
        blind: true,
        neurodivergent_friendly: true
      }
    },
    {
      type: 'chat',
      name: 'Nummer gegen Kummer - Kinder- und Jugendtelefon',
      contact: '116 111',
      description: 'Kostenlose Beratung für Kinder und Jugendliche',
      languages: ['de'],
      availability: 'Mon-Sat 2pm-8pm',
      specialties: ['youth', 'crisis', 'bullying'],
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
      type: 'peer_support',
      name: 'Bundesverband Trans* e.V.',
      contact: 'bundesverband-trans.de',
      description: 'Unterstützung und Beratung für trans* Menschen',
      languages: ['de', 'en'],
      availability: 'Varies by resource',
      specialties: ['transgender', 'lgbtq', 'legal_support'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: false,
      trauma_informed: true,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: true,
        deaf: false,
        blind: false,
        neurodivergent_friendly: true
      }
    }
  ],

  'hi-IN': [
    {
      type: 'hotline',
      name: 'आशा हेल्पलाइन (Aasra Helpline)',
      contact: '9820466726',
      description: 'आत्महत्या रोकथाम और भावनात्मक सहायता सेवा',
      languages: ['hi', 'en', 'mr'],
      availability: '24/7',
      specialties: ['suicide', 'crisis', 'emotional_support'],
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
    },
    {
      type: 'hotline',
      name: 'किरण हेल्पलाइन (Kiran Helpline)',
      contact: '1800-599-0019',
      description: 'राष्ट्रीय मानसिक स्वास्थ्य पुनर्वास हेल्पलाइन',
      languages: ['hi', 'en', 'te', 'ta', 'ml'],
      availability: '24/7',
      specialties: ['mental_health', 'rehabilitation', 'family_support'],
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
    },
    {
      type: 'peer_support',
      name: 'Humsafar Trust',
      contact: 'humsafar.org',
      description: 'LGBTQ+ community support and crisis intervention',
      languages: ['hi', 'en'],
      availability: 'Business hours',
      specialties: ['lgbtq', 'hiv_support', 'community_health'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: true,
      trauma_informed: false,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: false,
        deaf: false,
        blind: false,
        neurodivergent_friendly: false
      }
    }
  ],

  'pt-BR': [
    {
      type: 'hotline',
      name: 'Centro de Valorização da Vida (CVV)',
      contact: '188',
      description: 'Apoio emocional e prevenção do suicídio',
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
    },
    {
      type: 'hotline',
      name: 'Central de Atendimento à Mulher (Ligue 180)',
      contact: '180',
      description: 'Central de atendimento para mulheres em situação de violência',
      languages: ['pt'],
      availability: '24/7',
      specialties: ['domestic_violence', 'womens_support', 'legal_guidance'],
      marginalized_friendly: true,
      lgbtq_affirming: false,
      poc_centered: true,
      trauma_informed: true,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: true,
        deaf: true,
        blind: true,
        neurodivergent_friendly: false
      }
    },
    {
      type: 'peer_support',
      name: 'Grupo Dignidade',
      contact: 'grupodignidade.org.br',
      description: 'Organização de defesa dos direitos LGBT',
      languages: ['pt'],
      availability: 'Business hours',
      specialties: ['lgbtq', 'legal_support', 'discrimination'],
      marginalized_friendly: true,
      lgbtq_affirming: true,
      poc_centered: true,
      trauma_informed: false,
      confidentiality_level: 'confidential',
      cost: 'free',
      accessibility: {
        wheelchair: true,
        deaf: false,
        blind: false,
        neurodivergent_friendly: false
      }
    }
  ]
};

/**
 * Match crisis resources to user profile and needs
 */
export function matchCrisisResources(
  userProfile: UserCrisisProfile,
  locale: string
): CrisisResourceMatch[] {
  const localeConfig = getLocaleConfig(locale);
  const availableResources = GLOBAL_CRISIS_RESOURCES[locale] || GLOBAL_CRISIS_RESOURCES['en-US'];
  
  const matches: CrisisResourceMatch[] = [];

  availableResources.forEach(resource => {
    const match = evaluateResourceMatch(resource, userProfile, localeConfig);
    if (match.matchScore > 0.3) { // Minimum threshold for relevance
      matches.push(match);
    }
  });

  // Sort by match score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Evaluate how well a crisis resource matches a user's profile and needs
 */
function evaluateResourceMatch(
  resource: CrisisResource,
  userProfile: UserCrisisProfile,
  localeConfig: LocaleConfig
): CrisisResourceMatch {
  let score = 0.0;
  const matchReasons: string[] = [];
  const warnings: string[] = [];
  const culturalConsiderations: string[] = [];
  const safetyTips: string[] = [];

  // Basic availability check
  if (resource.availability === '24/7') {
    score += 0.2;
    matchReasons.push('Available 24/7');
  }

  // Language compatibility
  const userLanguages = userProfile.languages;
  const hasLanguageMatch = userLanguages.some(lang => 
    resource.languages.some(resLang => lang.startsWith(resLang))
  );
  if (hasLanguageMatch) {
    score += 0.3;
    matchReasons.push('Available in your language');
  } else {
    warnings.push('May not be available in your preferred language');
  }

  // Crisis type specialty match
  if (resource.specialties.includes(userProfile.crisisType)) {
    score += 0.4;
    matchReasons.push(`Specializes in ${userProfile.crisisType}`);
  }

  // LGBTQ+ affirmation
  if (userProfile.sexualOrientation && userProfile.sexualOrientation !== 'heterosexual' ||
      userProfile.genderIdentity && userProfile.genderIdentity !== 'cisgender') {
    if (resource.lgbtq_affirming) {
      score += 0.3;
      matchReasons.push('LGBTQ+ affirming');
    } else {
      score -= 0.1;
      warnings.push('May not be LGBTQ+ affirming');
    }
  }

  // POC-centered resources
  if (userProfile.race && ['Black', 'Latino', 'Indigenous', 'Asian', 'Middle Eastern'].includes(userProfile.race)) {
    if (resource.poc_centered) {
      score += 0.3;
      matchReasons.push('Centers people of color');
    } else if (resource.marginalized_friendly) {
      score += 0.1;
      matchReasons.push('Marginalized community friendly');
    }
  }

  // Immigration status considerations
  if (userProfile.immigrationStatus && 
      ['undocumented', 'asylum', 'refugee'].includes(userProfile.immigrationStatus)) {
    if (!userProfile.safetyConsiderations.safeToCallAuthorities) {
      if (resource.type === 'emergency') {
        score -= 0.5;
        warnings.push('Emergency services may not be safe for your immigration status');
      } else if (resource.confidentiality_level === 'anonymous') {
        score += 0.2;
        matchReasons.push('Anonymous service - safer for undocumented individuals');
      }
    }
  }

  // Accessibility needs
  if (userProfile.supportPreferences.accessibilityNeeds.length > 0) {
    userProfile.supportPreferences.accessibilityNeeds.forEach(need => {
      switch (need) {
        case 'deaf_hard_of_hearing':
          if (resource.accessibility.deaf) {
            score += 0.2;
            matchReasons.push('Accessible for deaf/hard of hearing');
          } else if (resource.type === 'hotline') {
            score -= 0.3;
            warnings.push('Voice-only service may not be accessible');
          }
          break;
        case 'blind_low_vision':
          if (resource.accessibility.blind) {
            score += 0.2;
            matchReasons.push('Accessible for blind/low vision users');
          }
          break;
        case 'wheelchair_mobility':
          if (resource.accessibility.wheelchair && resource.type === 'clinic') {
            score += 0.2;
            matchReasons.push('Wheelchair accessible');
          }
          break;
        case 'neurodivergent':
          if (resource.accessibility.neurodivergent_friendly) {
            score += 0.2;
            matchReasons.push('Neurodivergent-friendly');
          }
          break;
      }
    });
  }

  // Trauma-informed care
  if (userProfile.supportPreferences.traumaInformedCareRequired && resource.trauma_informed) {
    score += 0.3;
    matchReasons.push('Trauma-informed care');
  }

  // Confidentiality preferences
  if (userProfile.safetyConsiderations.needsAnonymity) {
    if (resource.confidentiality_level === 'anonymous') {
      score += 0.3;
      matchReasons.push('Anonymous service');
    } else {
      warnings.push('This service may not be completely anonymous');
    }
  }

  // Safety considerations for discrimination concerns
  if (userProfile.safetyConsiderations.concernsAboutDiscrimination) {
    if (resource.marginalized_friendly) {
      score += 0.2;
      matchReasons.push('Committed to serving marginalized communities');
    } else {
      warnings.push('Discrimination policies unknown');
    }
  }

  // Cost considerations (assume financial stress during crisis)
  if (resource.cost === 'free') {
    score += 0.1;
    matchReasons.push('Free service');
  }

  // Cultural considerations based on locale
  generateCulturalConsiderations(resource, localeConfig, culturalConsiderations);
  
  // Safety tips based on user profile
  generateSafetyTips(resource, userProfile, safetyTips);

  // Access instructions
  const accessInstructions = generateAccessInstructions(resource, userProfile);

  return {
    resource,
    matchScore: Math.max(0, Math.min(1, score)), // Clamp between 0 and 1
    matchReasons,
    warnings: warnings.length > 0 ? warnings : undefined,
    culturalConsiderations,
    accessInstructions,
    safetyTips
  };
}

function generateCulturalConsiderations(
  resource: CrisisResource,
  localeConfig: LocaleConfig,
  considerations: string[]
): void {
  // Add cultural context based on locale
  if (localeConfig.culturalContext.familyStructure === 'extended') {
    considerations.push('May want to involve family members in crisis planning');
  }

  if (localeConfig.culturalContext.spiritualConsiderations.length > 0) {
    considerations.push('Can incorporate spiritual/religious perspectives if helpful');
  }

  if (localeConfig.culturalContext.communicationStyle === 'indirect') {
    considerations.push('Service may adapt to indirect communication preferences');
  }

  if (localeConfig.culturalContext.culturalValues.collectivism > 60) {
    considerations.push('Crisis response may include community and family support');
  }
}

function generateSafetyTips(
  resource: CrisisResource,
  userProfile: UserCrisisProfile,
  tips: string[]
): void {
  // General safety tips
  tips.push('You can hang up or disconnect at any time if you feel uncomfortable');
  tips.push('You control what information you share');

  // Specific to user circumstances
  if (!userProfile.safetyConsiderations.hasPrivateSpace) {
    tips.push('Consider using chat or text services if you cannot speak privately');
  }

  if (userProfile.immigrationStatus && ['undocumented', 'asylum', 'refugee'].includes(userProfile.immigrationStatus)) {
    if (resource.type === 'hotline') {
      tips.push('This service should not ask about or report immigration status');
    }
  }

  if (userProfile.safetyConsiderations.concernsAboutDiscrimination) {
    tips.push('You have the right to request a different counselor if needed');
    tips.push('Discrimination is not acceptable - you can report concerns');
  }

  if (userProfile.age < 18) {
    if (resource.specialties.includes('youth')) {
      tips.push('This service specializes in supporting young people');
    } else {
      tips.push('Let them know your age so they can provide appropriate support');
    }
  }
}

function generateAccessInstructions(
  resource: CrisisResource,
  userProfile: UserCrisisProfile
): string {
  let instructions = `Contact: ${resource.contact}`;
  
  if (resource.availability !== '24/7') {
    instructions += `\nAvailable: ${resource.availability}`;
  }

  // Add specific instructions based on resource type
  switch (resource.type) {
    case 'text':
      instructions += '\nSend a text message to start chatting with a counselor';
      break;
    case 'chat':
      instructions += '\nVisit the website to start an online chat session';
      break;
    case 'hotline':
      instructions += '\nCall to speak directly with a trained counselor';
      if (!userProfile.safetyConsiderations.hasPrivateSpace) {
        instructions += '\nIf you cannot speak, many hotlines also offer text or chat options';
      }
      break;
    case 'clinic':
      instructions += '\nContact to schedule an appointment or ask about walk-in availability';
      break;
  }

  // Language instructions
  const userLanguage = userProfile.languages[0];
  if (!resource.languages.includes(userLanguage)) {
    instructions += '\nAsk for interpreter services if needed';
  }

  return instructions;
}

/**
 * Generate comprehensive crisis intervention plan
 */
export function generateCrisisInterventionPlan(
  userProfile: UserCrisisProfile,
  locale: string
): CrisisInterventionPlan {
  const allMatches = matchCrisisResources(userProfile, locale);
  
  // Categorize resources by urgency and type
  const immediate = allMatches.filter(match => 
    match.resource.type === 'hotline' || 
    match.resource.type === 'text' || 
    match.resource.type === 'emergency'
  ).slice(0, 3);

  const followUp = allMatches.filter(match =>
    match.resource.type === 'clinic' ||
    match.resource.type === 'peer_support'
  ).slice(0, 3);

  const ongoing = allMatches.filter(match =>
    match.resource.specialties.includes('ongoing_support') ||
    match.resource.type === 'peer_support'
  ).slice(0, 3);

  // Generate culturally-adapted self-care strategies
  const localeConfig = getLocaleConfig(locale);
  const selfCare = generateCulturalSelfCare(userProfile, localeConfig);

  // Find community resources
  const local = allMatches.filter(match => 
    match.resource.name.toLowerCase().includes('local') ||
    match.resource.name.toLowerCase().includes('community')
  );

  const cultural = allMatches.filter(match =>
    match.resource.poc_centered ||
    match.resource.specialties.includes('cultural_therapy')
  );

  const peer = allMatches.filter(match =>
    match.resource.type === 'peer_support' ||
    match.resource.specialties.includes('peer_support')
  );

  return {
    immediate,
    followUp,
    ongoing,
    selfCare,
    communityResources: {
      local,
      cultural,
      peer
    }
  };
}

function generateCulturalSelfCare(
  userProfile: UserCrisisProfile,
  localeConfig: LocaleConfig
): {
  groundingTechniques: string[];
  safetyPlan: string[];
  culturallyAdaptedCoping: string[];
} {
  const grounding: string[] = [];
  const safety: string[] = [];
  const cultural: string[] = [];

  // Universal grounding techniques
  grounding.push('Take 5 deep breaths');
  grounding.push('Name 5 things you can see, 4 you can hear, 3 you can touch');
  grounding.push('Hold something cold (ice cube, cold water)');

  // Cultural adaptations based on healing traditions
  if (localeConfig.culturalContext.healingTraditions.includes('meditation')) {
    grounding.push('Practice mindfulness meditation');
    cultural.push('Use traditional meditation practices from your culture');
  }

  if (localeConfig.culturalContext.healingTraditions.includes('prayer')) {
    cultural.push('Turn to prayer or spiritual practices that comfort you');
  }

  if (localeConfig.culturalContext.familyStructure === 'extended') {
    safety.push('Reach out to trusted family members');
    cultural.push('Consider involving family elders or community leaders');
  }

  if (localeConfig.culturalContext.healingTraditions.includes('nature_connection')) {
    grounding.push('Spend time in nature or with plants');
    cultural.push('Connect with the land and natural elements');
  }

  // Safety planning
  safety.push('Identify trusted people you can call');
  safety.push('Remove or secure means of self-harm');
  safety.push('Have crisis hotline numbers easily accessible');
  safety.push('Create a list of reasons to live');

  return {
    groundingTechniques: grounding,
    safetyPlan: safety,
    culturallyAdaptedCoping: cultural
  };
}

