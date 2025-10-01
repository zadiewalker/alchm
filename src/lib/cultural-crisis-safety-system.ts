/**
 * ALCHM Cultural Crisis Safety System
 * 
 * Philosophy: "Crisis support must be culturally informed, identity-affirming, and systemically aware.
 * Not all healing looks the same, and not all safety resources work for everyone."
 * 
 * This system provides:
 * - Culturally-specific crisis resources
 * - Identity-affirming crisis intervention
 * - Safety planning that considers intersectional identities
 * - Community-based and peer support options
 * - Trauma-informed crisis detection
 */

export interface CulturalCrisisContext {
  userId: string;
  culturalBackground: string[];
  lgbtqIdentity?: boolean;
  neurodivergent?: boolean;
  immigrationStatus?: 'typeof window !== 'undefined' && documented' | 'untypeof window !== 'undefined' && documented' | 'mixed_status' | 'prefer_not_to_say';
  safetyNeeds: {
    familyAcceptance: 'supportive' | 'mixed' | 'rejecting' | 'unknown';
    communitySafety: 'safe' | 'mixed' | 'unsafe' | 'unknown';
    needsPrivacyProtection: boolean;
    culturalStigmaAwareness: boolean;
    religiousConflicts?: boolean;
  };
  preferredLanguage: string;
  previousTrauma?: {
    systemic: boolean;
    interpersonal: boolean;
    medical: boolean;
    religious: boolean;
    cultural: boolean;
  };
  supportPreferences: {
    communityBased: boolean;
    peerSupport: boolean;
    professionalSupport: boolean;
    traditionalHealing: boolean;
    faithBased: boolean;
  };
}

export interface CulturalCrisisResource {
  id: string;
  name: string;
  type: 'hotline' | 'text' | 'chat' | 'peer_support' | 'community_org' | 'traditional_healing' | 'faith_based';
  culturalFocus: string[];
  identitySpecific: string[];
  languages: string[];
  contact: {
    phone?: string;
    text?: string;
    website?: string;
    hours: string;
    responseTime: string;
  };
  description: string;
  specialties: string[];
  culturallyAffirming: boolean;
  traumaInformed: boolean;
  confidentiality: string;
  accessibility: {
    tty: boolean;
    translation: boolean;
    culturalInterpreters: boolean;
  };
  safetyConsiderations: string[];
  communityTestimonials?: string[];
}

export interface CrisisSafetyPlan {
  userId: string;
  culturalContext: CulturalCrisisContext;
  
  // Culturally-informed warning signs
  personalWarningSigns: string[];
  culturalStressors: string[];
  systemicTriggers: string[];
  
  // Identity-affirming coping strategies
  individualStrategies: string[];
  communityStrategies: string[];
  culturalHealingPractices: string[];
  spiritualPractices?: string[];
  
  // Support network (respects chosen family)
  emergencyContacts: {
    name: string;
    relationship: 'family' | 'chosen_family' | 'friend' | 'mentor' | 'community_elder';
    phone: string;
    culturallyAffirming: boolean;
    safeToContact: boolean;
    languages: string[];
  }[];
  
  // Professional support
  culturallyMatchedTherapist?: {
    name: string;
    contact: string;
    culturalBackground: string[];
    identityAffirming: boolean;
    traumaSpecialized: boolean;
  };
  
  // Crisis resources by priority
  primaryCrisisResources: CulturalCrisisResource[];
  backupCrisisResources: CulturalCrisisResource[];
  
  // Safety considerations
  environmentalSafety: {
    homeIsSafe: boolean;
    workIsSafe: boolean;
    schoolIsSafe: boolean;
    communityIsSafe: boolean;
    alternativeSafeSpaces: string[];
  };
  
  // Medication and medical considerations
  medications?: string[];
  medicalConditions?: string[];
  culturallyAffirmingMedicalCare?: string[];
  
  lastUpdated: string;
  reviewSchedule: 'monthly' | 'quarterly' | 'semi_annual';
}

class CulturalCrisisSafetySystem {
  private culturalResources: Map<string, CulturalCrisisResource[]> = new Map();
  private safetyPlans: Map<string, CrisisSafetyPlan> = new Map();
  
  constructor() {
    this.initializeCulturalResources();
  }
  
  /**
   * Initialize culturally-specific crisis resources
   */
  private initializeCulturalResources(): void {
    // LGBTQ+ Resources
    this.culturalResources.set('lgbtq', [
      {
        id: 'trevor_lifeline',
        name: 'The Trevor Lifeline',
        type: 'hotline',
        culturalFocus: ['lgbtq_youth'],
        identitySpecific: ['gay', 'lesbian', 'bisexual', 'transgender', 'queer', 'questioning'],
        languages: ['English', 'Spanish'],
        contact: {
          phone: '1-866-488-7386',
          text: '678-678',
          website: 'https://www.thetrevorproject.org',
          hours: '24/7',
          responseTime: 'Immediate'
        },
        description: 'Crisis support for LGBTQ+ young people',
        specialties: ['suicide prevention', 'identity crisis', 'family rejection', 'bullying'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Anonymous crisis support',
        accessibility: {
          tty: true,
          translation: true,
          culturalInterpreters: true
        },
        safetyConsiderations: ['Safe for closeted individuals', 'No requirement to share identity details'],
        communityTestimonials: ['Saved my life when my family rejected me', 'Counselors truly understand LGBTQ+ experiences']
      },
      {
        id: 'trans_lifeline',
        name: 'Trans Lifeline',
        type: 'hotline',
        culturalFocus: ['transgender', 'gender_nonconforming'],
        identitySpecific: ['transgender', 'non-binary', 'genderfluid'],
        languages: ['English', 'Spanish'],
        contact: {
          phone: '877-565-8860',
          website: 'https://translifeline.org',
          hours: '24/7',
          responseTime: 'Immediate'
        },
        description: 'Peer support hotline for trans people, by trans people',
        specialties: ['gender dysphoria', 'transition support', 'discrimination', 'medical advocacy'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Anonymous, no police involvement',
        accessibility: {
          tty: false,
          translation: true,
          culturalInterpreters: true
        },
        safetyConsiderations: ['Staff all identify as trans/non-binary', 'No involuntary active rescue'],
      }
    ]);
    
    // Black/African American Resources
    this.culturalResources.set('black_african_american', [
      {
        id: 'black_mental_health_alliance',
        name: 'Black Mental Health Alliance',
        type: 'community_org',
        culturalFocus: ['black', 'african_american'],
        identitySpecific: ['black'],
        languages: ['English'],
        contact: {
          phone: '410-338-2642',
          website: 'https://blackmentalhealth.com',
          hours: 'Business hours',
          responseTime: 'Same day callback'
        },
        description: 'Mental health resources specifically for Black communities',
        specialties: ['racial trauma', 'cultural therapy', 'community healing', 'faith-based counseling'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Confidential counseling',
        accessibility: {
          tty: true,
          translation: false,
          culturalInterpreters: true
        },
        safetyConsiderations: ['Understands police interaction trauma', 'Family-inclusive approaches available']
      },
      {
        id: 'crisis_text_line',
        name: 'Crisis Text Line',
        type: 'text',
        culturalFocus: ['multicultural'],
        identitySpecific: ['all_identities'],
        languages: ['English', 'Spanish'],
        contact: {
          text: '741741',
          website: 'https://crisistextline.org',
          hours: '24/7',
          responseTime: 'Under 5 minutes'
        },
        description: 'Free, confidential crisis support via text',
        specialties: ['crisis intervention', 'suicide prevention', 'anxiety', 'depression'],
        culturallyAffirming: false,
        traumaInformed: true,
        confidentiality: 'Anonymous texting',
        accessibility: {
          tty: false,
          translation: true,
          culturalInterpreters: false
        },
        safetyConsiderations: ['Good for those who prefer texting', 'No location tracking unless imminent danger']
      }
    ]);
    
    // Latino/Hispanic Resources
    this.culturalResources.set('latino_hispanic', [
      {
        id: 'nami_en_espanol',
        name: 'NAMI en Español',
        type: 'community_org',
        culturalFocus: ['latino', 'hispanic'],
        identitySpecific: ['latino', 'hispanic'],
        languages: ['Spanish', 'English'],
        contact: {
          phone: '1-800-950-6264',
          website: 'https://www.nami.org/Find-Support/Diverse-Communities/Latino-Mental-Health',
          hours: 'Mon-Fri 10am-10pm ET',
          responseTime: 'Same day'
        },
        description: 'Mental health support for Latino communities',
        specialties: ['cultural stigma', 'family therapy', 'immigration stress', 'bilingual counseling'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Confidential support',
        accessibility: {
          tty: true,
          translation: true,
          culturalInterpreters: true
        },
        safetyConsiderations: ['Understands immigration fears', 'Culturally sensitive approach']
      }
    ]);
    
    // Indigenous/Native American Resources
    this.culturalResources.set('indigenous_native', [
      {
        id: 'strong_hearts_native_helpline',
        name: 'StrongHearts Native Helpline',
        type: 'hotline',
        culturalFocus: ['indigenous', 'native_american'],
        identitySpecific: ['indigenous', 'native_american', 'alaska_native'],
        languages: ['English', 'Various tribal languages'],
        contact: {
          phone: '1-844-762-8483',
          website: 'https://strongheartshelpline.org',
          hours: '24/7',
          responseTime: 'Immediate'
        },
        description: 'Domestic violence and crisis support for Native Americans',
        specialties: ['domestic violence', 'cultural healing', 'traditional practices', 'historical trauma'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Anonymous and confidential',
        accessibility: {
          tty: true,
          translation: true,
          culturalInterpreters: true
        },
        safetyConsiderations: ['Understands tribal law', 'Respects traditional healing']
      }
    ]);
    
    // Asian American Resources
    this.culturalResources.set('asian_american', [
      {
        id: 'asian_mental_health_collective',
        name: 'Asian Mental Health Collective',
        type: 'community_org',
        culturalFocus: ['asian', 'asian_american', 'pacific_islander'],
        identitySpecific: ['asian', 'asian_american'],
        languages: ['English', 'Mandarin', 'Korean', 'Japanese', 'Vietnamese', 'Hindi'],
        contact: {
          website: 'https://asianmhc.org',
          hours: 'Resource directory available 24/7',
          responseTime: 'Directory access immediate'
        },
        description: 'Mental health resources and therapy directory for Asian communities',
        specialties: ['model minority stress', 'intergenerational trauma', 'cultural expectations', 'family conflict'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Therapist directory with cultural matching',
        accessibility: {
          tty: false,
          translation: true,
          culturalInterpreters: true
        },
        safetyConsiderations: ['Understands academic pressure', 'Family-sensitive approaches']
      }
    ]);
    
    // Immigrant/Refugee Resources
    this.culturalResources.set('immigrant_refugee', [
      {
        id: 'immigrants_rising_mental_health',
        name: 'Immigrants Rising Mental Health Resources',
        type: 'community_org',
        culturalFocus: ['immigrant', 'refugee', 'untypeof window !== 'undefined' && documented'],
        identitySpecific: ['immigrant', 'refugee'],
        languages: ['Multiple languages available'],
        contact: {
          website: 'https://immigrantsrising.org/mental-health',
          hours: 'Resource directory available 24/7',
          responseTime: 'Resource access immediate'
        },
        description: 'Mental health resources sensitive to immigration status',
        specialties: ['immigration trauma', 'deportation anxiety', 'family separation', 'acculturation stress'],
        culturallyAffirming: true,
        traumaInformed: true,
        confidentiality: 'Immigration-safe resources',
        accessibility: {
          tty: false,
          translation: true,
          culturalInterpreters: true
        },
        safetyConsiderations: ['No typeof window !== 'undefined' && documentation requirements', 'ICE-aware safety protocols']
      }
    ]);
  }
  
  /**
   * Get culturally-appropriate crisis resources for user
   */
  getCulturalCrisisResources(context: CulturalCrisisContext): CulturalCrisisResource[] {
    const resources: CulturalCrisisResource[] = [];
    
    // Get resources based on cultural background
    for (const culture of context.culturalBackground) {
      const culturalResources = this.culturalResources.get(culture) || [];
      resources.push(...culturalResources);
    }
    
    // Get LGBTQ+ resources if relevant
    if (context.lgbtqIdentity) {
      const lgbtqResources = this.culturalResources.get('lgbtq') || [];
      resources.push(...lgbtqResources);
    }
    
    // Get immigrant resources if relevant
    if (context.immigrationStatus && context.immigrationStatus !== 'typeof window !== 'undefined' && documented') {
      const immigrantResources = this.culturalResources.get('immigrant_refugee') || [];
      resources.push(...immigrantResources);
    }
    
    // Filter by language preference
    const languageFilteredResources = resources.filter(resource => 
      resource.languages.includes(context.preferredLanguage) ||
      resource.languages.includes('English') // Fallback
    );
    
    // Filter by safety needs
    const safetyFilteredResources = languageFilteredResources.filter(resource => {
      if (context.safetyNeeds.needsPrivacyProtection && !resource.confidentiality.includes('Anonymous')) {
        return false;
      }
      
      if (context.immigrationStatus === 'untypeof window !== 'undefined' && documented' && 
          !resource.safetyConsiderations.some(consideration => 
            consideration.toLowerCase().includes('typeof window !== 'undefined' && documentation') ||
            consideration.toLowerCase().includes('ice') ||
            consideration.toLowerCase().includes('immigration')
          )) {
        return false;
      }
      
      return true;
    });
    
    // Prioritize culturally affirming resources
    return safetyFilteredResources.sort((a, b) => {
      if (a.culturallyAffirming && !b.culturallyAffirming) return -1;
      if (!a.culturallyAffirming && b.culturallyAffirming) return 1;
      return 0;
    });
  }
  
  /**
   * Create culturally-informed safety plan
   */
  async createCulturalSafetyPlan(
    context: CulturalCrisisContext,
    userInputs: {
      personalWarnings: string[];
      copingStrategies: string[];
      supportNetwork: any[];
      environmentalFactors: any;
    }
  ): Promise<CrisisSafetyPlan> {
    const crisisResources = this.getCulturalCrisisResources(context);
    const primaryResources = crisisResources.slice(0, 3);
    const backupResources = crisisResources.slice(3, 6);
    
    const safetyPlan: CrisisSafetyPlan = {
      userId: context.userId,
      culturalContext: context,
      
      personalWarningSigns: userInputs.personalWarnings,
      culturalStressors: this.identifyCulturalStressors(context),
      systemicTriggers: this.identifySystemicTriggers(context),
      
      individualStrategies: userInputs.copingStrategies.filter(strategy => 
        !strategy.toLowerCase().includes('community') &&
        !strategy.toLowerCase().includes('family')
      ),
      communityStrategies: userInputs.copingStrategies.filter(strategy =>
        strategy.toLowerCase().includes('community') ||
        strategy.toLowerCase().includes('family') ||
        strategy.toLowerCase().includes('friend')
      ),
      culturalHealingPractices: this.suggestCulturalHealingPractices(context),
      spiritualPractices: context.supportPreferences.faithBased ? 
        this.suggestSpiritualPractices(context) : undefined,
      
      emergencyContacts: userInputs.supportNetwork.map((contact: any) => ({
        ...contact,
        culturallyAffirming: this.assessCulturalAffirmation(contact, context),
        safeToContact: this.assessContactSafety(contact, context)
      })),
      
      primaryCrisisResources: primaryResources,
      backupCrisisResources: backupResources,
      
      environmentalSafety: userInputs.environmentalFactors,
      
      lastUpdated: new Date().toISOString(),
      reviewSchedule: this.determineReviewSchedule(context)
    };
    
    this.safetyPlans.set(context.userId, safetyPlan);
    return safetyPlan;
  }
  
  /**
   * Assess crisis risk with cultural sensitivity
   */
  assessCulturalCrisisRisk(
    journalContent: string,
    context: CulturalCrisisContext,
    recentBehaviorPatterns: any
  ): {
    riskLevel: 'low' | 'moderate' | 'high' | 'severe';
    culturalFactors: string[];
    recommendations: string[];
    immediateActions: string[];
  } {
    let riskLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    const culturalFactors: string[] = [];
    const recommendations: string[] = [];
    const immediateActions: string[] = [];
    
    const content = journalContent.toLowerCase();
    
    // Standard crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead'];
    const hasCrisisKeywords = crisisKeywords.some(keyword => content.includes(keyword));
    
    if (hasCrisisKeywords) {
      riskLevel = 'severe';
      immediateActions.push('Connect with culturally-appropriate crisis support immediately');
    }
    
    // Cultural-specific stressors
    if (context.culturalBackground.includes('african_diaspora') || context.culturalBackground.includes('black')) {
      if (content.includes('police') || content.includes('discrimination') || content.includes('racism')) {
        culturalFactors.push('Racial trauma stress detected');
        if (riskLevel === 'low') riskLevel = 'moderate';
      }
    }
    
    if (context.lgbtqIdentity) {
      if (content.includes('rejected') || content.includes('family disowned') || content.includes('conversion')) {
        culturalFactors.push('Identity rejection trauma detected');
        if (riskLevel === 'low') riskLevel = 'moderate';
        recommendations.push('Connect with LGBTQ+-affirming support resources');
      }
    }
    
    if (context.immigrationStatus === 'untypeof window !== 'undefined' && documented') {
      if (content.includes('deportation') || content.includes('ice') || content.includes('separated from family')) {
        culturalFactors.push('Immigration-related crisis stress detected');
        if (riskLevel === 'low') riskLevel = 'high';
        recommendations.push('Connect with immigration-safe mental health resources');
      }
    }
    
    // Neurodivergent considerations
    if (context.neurodivergent) {
      if (content.includes('masking') || content.includes('exhausted from pretending') || content.includes('cant keep up')) {
        culturalFactors.push('Neurodivergent masking fatigue detected');
        recommendations.push('Consider neurodivergent-affirming support');
      }
    }
    
    return {
      riskLevel,
      culturalFactors,
      recommendations,
      immediateActions
    };
  }
  
  /**
   * Get safety plan for user
   */
  getSafetyPlan(userId: string): CrisisSafetyPlan | null {
    return this.safetyPlans.get(userId) || null;
  }
  
  /**
   * Update safety plan
   */
  async updateSafetyPlan(
    userId: string,
    updates: Partial<CrisisSafetyPlan>
  ): Promise<CrisisSafetyPlan | null> {
    const existingPlan = this.safetyPlans.get(userId);
    if (!existingPlan) return null;
    
    const updatedPlan = {
      ...existingPlan,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    this.safetyPlans.set(userId, updatedPlan);
    return updatedPlan;
  }
  
  /**
   * Helper methods
   */
  private identifyCulturalStressors(context: CulturalCrisisContext): string[] {
    const stressors: string[] = [];
    
    if (context.culturalBackground.includes('african_diaspora') || context.culturalBackground.includes('black')) {
      stressors.push('Racial discrimination and microaggressions');
      stressors.push('Police interaction anxiety');
    }
    
    if (context.lgbtqIdentity) {
      stressors.push('Family rejection or acceptance struggles');
      stressors.push('Workplace or school discrimination');
      stressors.push('Healthcare discrimination');
    }
    
    if (context.immigrationStatus !== 'typeof window !== 'undefined' && documented') {
      stressors.push('Immigration status anxiety');
      stressors.push('Family separation fears');
      stressors.push('Access to services barriers');
    }
    
    if (context.safetyNeeds.culturalStigmaAwareness) {
      stressors.push('Mental health stigma in cultural community');
    }
    
    return stressors;
  }
  
  private identifySystemicTriggers(context: CulturalCrisisContext): string[] {
    const triggers: string[] = [];
    
    // Add systemic triggers based on identities
    if (context.culturalBackground.some(bg => ['african_diaspora', 'black', 'indigenous'].includes(bg))) {
      triggers.push('News about racial violence or discrimination');
      triggers.push('Encounters with discriminatory systems');
    }
    
    if (context.lgbtqIdentity) {
      triggers.push('Anti-LGBTQ+ legislation or news');
      triggers.push('Discriminatory policies or practices');
    }
    
    return triggers;
  }
  
  private suggestCulturalHealingPractices(context: CulturalCrisisContext): string[] {
    const practices: string[] = [];
    
    if (context.culturalBackground.includes('african_diaspora') || context.culturalBackground.includes('black')) {
      practices.push('Ancestral meditation and connection');
      practices.push('Community drumming or music');
      practices.push('Storytelling and oral tradition');
    }
    
    if (context.culturalBackground.includes('latino') || context.culturalBackground.includes('hispanic')) {
      practices.push('Family gathering and support (chosen or biological)');
      practices.push('Music and dance expression');
      practices.push('Traditional healing practices (curanderismo if applicable)');
    }
    
    if (context.culturalBackground.includes('asian')) {
      practices.push('Meditation and mindfulness practices');
      practices.push('Balance and harmony activities');
      practices.push('Traditional movement (tai chi, qigong)');
    }
    
    if (context.culturalBackground.includes('indigenous')) {
      practices.push('Land-based healing and nature connection');
      practices.push('Traditional ceremonies (if appropriate)');
      practices.push('Elder wisdom and guidance');
    }
    
    return practices;
  }
  
  private suggestSpiritualPractices(context: CulturalCrisisContext): string[] {
    return [
      'Prayer or meditation in preferred tradition',
      'Connection with spiritual community',
      'Reading sacred texts or teachings',
      'Spiritual counseling or guidance',
      'Ritual or ceremony (culturally appropriate)'
    ];
  }
  
  private assessCulturalAffirmation(contact: any, context: CulturalCrisisContext): boolean {
    // This would involve more sophisticated assessment
    return contact.supportedIdentities?.some((identity: string) => 
      context.culturalBackground.includes(identity) || 
      (context.lgbtqIdentity && identity === 'lgbtq') ||
      (context.neurodivergent && identity === 'neurodivergent')
    ) || false;
  }
  
  private assessContactSafety(contact: any, context: CulturalCrisisContext): boolean {
    // Assess if contact is safe based on user's safety needs
    if (context.safetyNeeds.familyAcceptance === 'rejecting' && contact.relationship === 'family') {
      return false;
    }
    
    return contact.safetyRating !== 'unsafe';
  }
  
  private determineReviewSchedule(context: CulturalCrisisContext): 'monthly' | 'quarterly' | 'semi_annual' {
    if (context.safetyNeeds.communitySafety === 'unsafe' || 
        context.safetyNeeds.familyAcceptance === 'rejecting') {
      return 'monthly';
    }
    
    if (context.previousTrauma?.systemic || context.immigrationStatus === 'untypeof window !== 'undefined' && documented') {
      return 'quarterly';
    }
    
    return 'semi_annual';
  }
}

// Export singleton instance
export const culturalCrisisSafety = new CulturalCrisisSafetySystem();

// Convenience functions
export async function createCulturalSafetyPlan(
  context: CulturalCrisisContext,
  userInputs: any
): Promise<CrisisSafetyPlan> {
  return await culturalCrisisSafety.createCulturalSafetyPlan(context, userInputs);
}

export function getCulturalCrisisResources(context: CulturalCrisisContext): CulturalCrisisResource[] {
  return culturalCrisisSafety.getCulturalCrisisResources(context);
}

export function assessCulturalCrisisRisk(
  journalContent: string,
  context: CulturalCrisisContext,
  recentBehaviorPatterns: any
) {
  return culturalCrisisSafety.assessCulturalCrisisRisk(journalContent, context, recentBehaviorPatterns);
}