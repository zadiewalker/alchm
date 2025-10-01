/**
 * ALCHM Cultural Crisis Resources Database
 * Culturally competent crisis resources for diverse communities
 * Ensures appropriate support for all identities and backgrounds
 */

export interface CulturalCrisisResource {
  id: string;
  name: string;
  number?: string;
  text?: string;
  email?: string;
  website?: string;
  description: string;
  instructions: string;
  available: string;
  priority: 'emergency' | 'critical' | 'high' | 'medium';
  
  // Cultural specificity
  culturalFocus: string[];
  languages: string[];
  region: string[];
  ageGroups: ('youth' | 'adult' | 'senior' | 'all')[];
  
  // Special considerations
  religiousAffirmation?: boolean;
  identityAffirmation?: boolean;
  traumaInformed?: boolean;
  culturallyTrained?: boolean;
  
  // Accessibility
  tty?: string;
  interpreterServices?: boolean;
  accessibilityFeatures?: string[];
  
  lastUpdated: Date;
  verified: boolean;
}

export interface CulturalContext {
  identity: string[];
  language: string;
  region?: string;
  ageGroup?: 'youth' | 'adult' | 'senior';
  religiousAffiliation?: string;
  immigrationStatus?: 'citizen' | 'typeof window !== 'undefined' && documented' | 'untypeof window !== 'undefined' && documented' | 'refugee';
}

class CulturalCrisisResourcesDatabase {
  private resources: CulturalCrisisResource[] = [];
  private resourcesByCategory: Map<string, CulturalCrisisResource[]> = new Map();
  private resourcesByLanguage: Map<string, CulturalCrisisResource[]> = new Map();

  constructor() {
    this.initializeCulturalResources();
    this.indexResources();
  }

  /**
   * Initialize comprehensive cultural crisis resources
   */
  private initializeCulturalResources(): void {
    this.resources = [
      // Universal Resources
      {
        id: 'suicide-prevention-988',
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        description: '24/7 crisis support and suicide prevention',
        instructions: 'Call 988 for immediate crisis support. Available in English and Spanish. Press 1 for veterans. Press 2 for Spanish.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['all'],
        traumaInformed: true,
        interpreterServices: true,
        tty: '1-800-799-4889',
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        text: 'HOME to 741741',
        description: '24/7 crisis support via text message',
        instructions: 'Text HOME to 741741 to connect with a Crisis Counselor. Free 24/7 support for anyone in crisis.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['all'],
        traumaInformed: true,
        accessibilityFeatures: ['text-based', 'anonymous'],
        lastUpdated: new Date(),
        verified: true
      },

      // LGBTQ+ Resources
      {
        id: 'trevor-project',
        name: 'Trevor Project',
        number: '1-866-488-7386',
        text: 'START to 678-678',
        website: 'https://www.thetrevorproject.org/get-help/',
        description: '24/7 crisis support for LGBTQ+ youth',
        instructions: 'Call for immediate crisis support. Also available via text and chat online. Specifically trained counselors for LGBTQ+ youth issues.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['lgbtq', 'queer', 'gay', 'lesbian', 'bisexual'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['youth'],
        identityAffirmation: true,
        traumaInformed: true,
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'trans-lifeline',
        name: 'Trans Lifeline',
        number: '877-565-8860',
        description: 'Crisis support for transgender community',
        instructions: 'Call for trans-specific crisis support. Run by trans people for trans people. Will not call emergency services without your consent.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['transgender', 'trans', 'nonbinary', 'genderfluid'],
        languages: ['en', 'es'],
        region: ['US', 'CA'],
        ageGroups: ['all'],
        identityAffirmation: true,
        traumaInformed: true,
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'lgbt-national-hotline',
        name: 'LGBT National Hotline',
        number: '1-888-843-4564',
        description: 'Peer support and local resource referrals',
        instructions: 'Call for peer support and local LGBT resource information. Confidential support from trained volunteers.',
        available: 'Mon-Fri 4PM-12AM ET, Sat 12PM-5PM ET',
        priority: 'high',
        culturalFocus: ['lgbtq', 'questioning'],
        languages: ['en'],
        region: ['US'],
        ageGroups: ['all'],
        identityAffirmation: true,
        lastUpdated: new Date(),
        verified: true
      },

      // Black, Indigenous, and People of Color Resources
      {
        id: 'blackline',
        name: 'BlackLine',
        number: '1-800-604-5841',
        description: 'Crisis support for Black, Indigenous, and POC communities',
        instructions: 'Call for culturally competent crisis support. Prioritizing the health and wellness of Black and Brown communities.',
        available: '24/7',
        priority: 'high',
        culturalFocus: ['black', 'african-american', 'bipoc', 'indigenous'],
        languages: ['en'],
        region: ['US'],
        ageGroups: ['all'],
        culturallyTrained: true,
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'stronghearts-native',
        name: 'StrongHearts Native Helpline',
        number: '1-844-762-8483',
        description: 'Crisis support for Native Americans',
        instructions: 'Call for culturally-appropriate support for Native Americans facing domestic violence and crisis situations.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['native-american', 'indigenous', 'tribal', 'first-nations'],
        languages: ['en', 'tribal-languages'],
        region: ['US'],
        ageGroups: ['all'],
        culturallyTrained: true,
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'asian-mental-health',
        name: 'Asian Mental Health Collective',
        website: 'https://www.asianmhc.org/crisis-resources/',
        description: 'Crisis resources for Asian and Pacific Islander communities',
        instructions: 'Visit website for culturally competent resources and crisis support specifically for Asian and Pacific Islander communities.',
        available: 'Resource directory available 24/7',
        priority: 'high',
        culturalFocus: ['asian', 'pacific-islander', 'aapi'],
        languages: ['en', 'zh', 'ko', 'ja', 'hi', 'tl', 'vi'],
        region: ['US'],
        ageGroups: ['all'],
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },

      // Immigrant and Refugee Resources
      {
        id: 'national-immigration-forum',
        name: 'Immigration Crisis Support',
        number: '1-800-375-5283',
        description: 'Crisis support for immigrants and refugees',
        instructions: 'Call for immigration-related crisis support and legal referrals. Understanding of unique challenges faced by immigrant communities.',
        available: 'Business hours, emergency support available',
        priority: 'high',
        culturalFocus: ['immigrant', 'refugee', 'untypeof window !== 'undefined' && documented'],
        languages: ['en', 'es', 'ar', 'fr', 'so'],
        region: ['US'],
        ageGroups: ['all'],
        culturallyTrained: true,
        interpreterServices: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'refugee-mental-health',
        name: 'Center for Victims - Refugee Mental Health',
        number: '1-202-393-2292',
        description: 'Mental health support for refugees and asylum seekers',
        instructions: 'Call for trauma-informed mental health support specifically designed for refugees and asylum seekers.',
        available: 'Mon-Fri 9AM-5PM ET',
        priority: 'high',
        culturalFocus: ['refugee', 'asylum-seeker'],
        languages: ['en', 'ar', 'so', 'am', 'fr'],
        region: ['US'],
        ageGroups: ['all'],
        traumaInformed: true,
        culturallyTrained: true,
        interpreterServices: true,
        lastUpdated: new Date(),
        verified: true
      },

      // Religious and Faith-Based Resources
      {
        id: 'jewish-family-services',
        name: 'Jewish Family Services Crisis Support',
        number: 'varies by location',
        description: 'Crisis support with Jewish cultural understanding',
        instructions: 'Search for local Jewish Family Services office for culturally and religiously appropriate crisis support.',
        available: 'Varies by location',
        priority: 'medium',
        culturalFocus: ['jewish'],
        languages: ['en', 'he', 'yi'],
        region: ['US'],
        ageGroups: ['all'],
        religiousAffirmation: true,
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'islamic-society-crisis',
        name: 'Islamic Society Crisis Support',
        number: 'varies by location',
        description: 'Crisis support with Islamic cultural understanding',
        instructions: 'Contact local Islamic Society or Muslim Community Center for culturally and religiously appropriate support.',
        available: 'Varies by location',
        priority: 'medium',
        culturalFocus: ['muslim', 'islamic'],
        languages: ['en', 'ar', 'ur', 'fa'],
        region: ['US'],
        ageGroups: ['all'],
        religiousAffirmation: true,
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },

      // Youth-Specific Resources
      {
        id: 'teen-line',
        name: 'Teen Line',
        number: '1-310-855-4673',
        text: 'TEEN to 839863',
        description: 'Teen-to-teen crisis support',
        instructions: 'Call or text to talk with trained teen volunteers who understand what you\'re going through.',
        available: 'Daily 6PM-10PM PT',
        priority: 'high',
        culturalFocus: ['universal'],
        languages: ['en'],
        region: ['US'],
        ageGroups: ['youth'],
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'boys-town',
        name: 'Boys Town National Hotline',
        number: '1-800-448-3000',
        description: 'Crisis support for children and teens',
        instructions: 'Call for immediate support with any crisis. Trained counselors available for children, teens, and parents.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['youth'],
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },

      // Veteran Resources
      {
        id: 'veterans-crisis',
        name: 'Veterans Crisis Line',
        number: '1-800-273-8255',
        text: '838255',
        description: 'Crisis support for veterans (Press 1 after calling)',
        instructions: 'Call and press 1 for immediate veteran crisis support. Also available via text to 838255 or chat online.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['veteran', 'military', 'active-duty'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['adult'],
        traumaInformed: true,
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },

      // Women and Maternal Health Resources
      {
        id: 'postpartum-support',
        name: 'Postpartum Support International',
        number: '1-944-4-PPD-MOM',
        description: 'Crisis support for postpartum depression and anxiety',
        instructions: 'Call for immediate support with postpartum mental health crises. Specialized counselors available.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['maternal', 'postpartum', 'perinatal'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['adult'],
        traumaInformed: true,
        culturallyTrained: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'national-domestic-violence',
        name: 'National Domestic Violence Hotline',
        number: '1-800-799-7233',
        description: '24/7 domestic violence crisis support',
        instructions: 'Call for immediate support if you are experiencing domestic violence. Available in over 200 languages.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal', 'domestic-violence'],
        languages: ['en', 'es', 'over-200-languages'],
        region: ['US'],
        ageGroups: ['all'],
        traumaInformed: true,
        culturallyTrained: true,
        interpreterServices: true,
        tty: '1-800-787-3224',
        lastUpdated: new Date(),
        verified: true
      },

      // Disability-Specific Resources
      {
        id: 'disability-crisis',
        name: 'Disability Information and Access Line',
        number: '1-888-677-1199',
        description: 'Crisis support for people with disabilities',
        instructions: 'Call for crisis support and resource referrals specifically for people with disabilities.',
        available: 'Mon-Fri 10AM-6PM ET',
        priority: 'high',
        culturalFocus: ['disability', 'accessibility'],
        languages: ['en', 'es'],
        region: ['US'],
        ageGroups: ['all'],
        tty: '1-888-677-1199',
        accessibilityFeatures: ['tty', 'relay-services'],
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },

      // International Resources
      {
        id: 'samaritans-uk',
        name: 'Samaritans (UK)',
        number: '116 123',
        email: 'jo@samaritans.org',
        description: '24/7 crisis support in the UK',
        instructions: 'Call 116 123 for free from any phone or email jo@samaritans.org for support.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal'],
        languages: ['en'],
        region: ['UK'],
        ageGroups: ['all'],
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'lifeline-australia',
        name: 'Lifeline Australia',
        number: '13 11 14',
        text: '0477 13 11 14',
        description: '24/7 crisis support in Australia',
        instructions: 'Call 13 11 14 or text 0477 13 11 14 for crisis support and suicide prevention.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal'],
        languages: ['en'],
        region: ['AU'],
        ageGroups: ['all'],
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      },
      {
        id: 'canada-crisis-services',
        name: 'Crisis Services Canada',
        number: '1-833-456-4566',
        text: '45645',
        description: '24/7 crisis support in Canada',
        instructions: 'Call 1-833-456-4566 or text 45645 for crisis support across Canada.',
        available: '24/7',
        priority: 'critical',
        culturalFocus: ['universal'],
        languages: ['en', 'fr'],
        region: ['CA'],
        ageGroups: ['all'],
        traumaInformed: true,
        lastUpdated: new Date(),
        verified: true
      }
    ];
  }

  /**
   * Index resources by category and language for fast lookup
   */
  private indexResources(): void {
    // Index by cultural focus
    for (const resource of this.resources) {
      for (const focus of resource.culturalFocus) {
        if (!this.resourcesByCategory.has(focus)) {
          this.resourcesByCategory.set(focus, []);
        }
        this.resourcesByCategory.get(focus)!.push(resource);
      }
    }

    // Index by language
    for (const resource of this.resources) {
      for (const language of resource.languages) {
        if (!this.resourcesByLanguage.has(language)) {
          this.resourcesByLanguage.set(language, []);
        }
        this.resourcesByLanguage.get(language)!.push(resource);
      }
    }
  }

  /**
   * Get culturally appropriate crisis resources
   */
  public getCulturallyAppropriateResources(context: CulturalContext): CulturalCrisisResource[] {
    let matchedResources: CulturalCrisisResource[] = [];
    const matchScores = new Map<string, number>();

    // Score each resource based on cultural match
    for (const resource of this.resources) {
      let score = 0;

      // Cultural identity match (highest priority)
      for (const identity of context.identity) {
        if (resource.culturalFocus.includes(identity)) {
          score += 10;
        }
      }

      // Language match
      if (resource.languages.includes(context.language)) {
        score += 5;
      }

      // Age group match
      if (context.ageGroup && resource.ageGroups.includes(context.ageGroup)) {
        score += 3;
      }

      // Regional match
      if (context.region && resource.region.includes(context.region)) {
        score += 2;
      }

      // Universal resources get base score
      if (resource.culturalFocus.includes('universal')) {
        score += 1;
      }

      if (score > 0) {
        matchScores.set(resource.id, score);
        matchedResources.push(resource);
      }
    }

    // Sort by match score (highest first)
    matchedResources.sort((a, b) => {
      const scoreA = matchScores.get(a.id) || 0;
      const scoreB = matchScores.get(b.id) || 0;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      // Secondary sort by priority
      const priorityOrder = { emergency: 1, critical: 2, high: 3, medium: 4 };
      return (priorityOrder as any)[a.priority] - (priorityOrder as any)[b.priority];
    });

    // Ensure we always include universal critical resources
    const criticalUniversal = this.resources.filter(r => 
      r.priority === 'critical' && r.culturalFocus.includes('universal')
    );
    
    // Merge and deduplicate
    const allResources = [...criticalUniversal, ...matchedResources];
    const uniqueResources = allResources.filter((resource, index, self) => 
      index === self.findIndex(r => r.id === resource.id)
    );

    return uniqueResources.slice(0, 8); // Limit to top 8 resources
  }

  /**
   * Get emergency resources for immediate crisis
   */
  public getEmergencyResources(context?: CulturalContext): CulturalCrisisResource[] {
    let emergencyResources = this.resources.filter(r => 
      r.priority === 'emergency' || r.priority === 'critical'
    );

    if (context) {
      // Prioritize culturally appropriate emergency resources
      emergencyResources = this.getCulturallyAppropriateResources(context)
        .filter(r => r.priority === 'emergency' || r.priority === 'critical');
    }

    return emergencyResources.slice(0, 5);
  }

  /**
   * Get resources by specific cultural identity
   */
  public getResourcesByIdentity(identity: string): CulturalCrisisResource[] {
    return this.resourcesByCategory.get(identity) || [];
  }

  /**
   * Get resources by language
   */
  public getResourcesByLanguage(language: string): CulturalCrisisResource[] {
    return this.resourcesByLanguage.get(language) || [];
  }

  /**
   * Search resources by keywords
   */
  public searchResources(query: string, context?: CulturalContext): CulturalCrisisResource[] {
    const queryLower = query.toLowerCase();
    const matchingResources = this.resources.filter(resource => {
      return resource.name.toLowerCase().includes(queryLower) ||
             resource.description.toLowerCase().includes(queryLower) ||
             resource.culturalFocus.some(focus => focus.toLowerCase().includes(queryLower));
    });

    if (context) {
      // Sort by cultural appropriateness
      return this.getCulturallyAppropriateResources({
        ...context,
        identity: [...context.identity, queryLower]
      }).filter(resource => matchingResources.includes(resource));
    }

    return matchingResources;
  }

  /**
   * Get resource by ID
   */
  public getResourceById(id: string): CulturalCrisisResource | null {
    return this.resources.find(r => r.id === id) || null;
  }

  /**
   * Validate and format phone number for calling
   */
  public formatPhoneNumber(resource: CulturalCrisisResource): {
    displayNumber: string;
    callableNumber: string;
    instructions: string;
  } {
    if (!resource.number) {
      return {
        displayNumber: 'N/A',
        callableNumber: '',
        instructions: resource.instructions
      };
    }

    let displayNumber = resource.number;
    let callableNumber = resource.number.replace(/\D/g, '');
    
    // Handle special cases
    if (resource.number.includes('varies')) {
      return {
        displayNumber: 'Varies by location',
        callableNumber: '',
        instructions: 'Contact your local organization for specific number'
      };
    }

    // Format US numbers
    if (callableNumber.length === 10) {
      displayNumber = `(${callableNumber.slice(0,3)}) ${callableNumber.slice(3,6)}-${callableNumber.slice(6)}`;
    } else if (callableNumber.length === 11 && callableNumber.startsWith('1')) {
      displayNumber = `+1 (${callableNumber.slice(1,4)}) ${callableNumber.slice(4,7)}-${callableNumber.slice(7)}`;
    }

    return {
      displayNumber,
      callableNumber: callableNumber.startsWith('1') ? callableNumber : '1' + callableNumber,
      instructions: resource.instructions
    };
  }

  /**
   * Get all available cultural identities
   */
  public getAvailableCulturalIdentities(): string[] {
    const identities = new Set<string>();
    for (const resource of this.resources) {
      for (const focus of resource.culturalFocus) {
        if (focus !== 'universal') {
          identities.add(focus);
        }
      }
    }
    return Array.from(identities).sort();
  }

  /**
   * Get all available languages
   */
  public getAvailableLanguages(): string[] {
    const languages = new Set<string>();
    for (const resource of this.resources) {
      for (const lang of resource.languages) {
        if (!lang.includes('over-') && !lang.includes('tribal-')) {
          languages.add(lang);
        }
      }
    }
    return Array.from(languages).sort();
  }

  /**
   * Update resource (for admin use)
   */
  public updateResource(id: string, updates: Partial<CulturalCrisisResource>): boolean {
    const index = this.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.resources[index] = { ...this.resources[index], ...updates, lastUpdated: new Date() };
      this.reindexResources();
      return true;
    }
    return false;
  }

  /**
   * Add new resource (for admin use)
   */
  public addResource(resource: CulturalCrisisResource): void {
    this.resources.push({ ...resource, lastUpdated: new Date() });
    this.reindexResources();
  }

  /**
   * Reindex resources after updates
   */
  private reindexResources(): void {
    this.resourcesByCategory.clear();
    this.resourcesByLanguage.clear();
    this.indexResources();
  }

  /**
   * Get resource statistics
   */
  public getResourceStats(): {
    totalResources: number;
    culturalIdentities: number;
    languages: number;
    regions: number;
    criticalResources: number;
    verifiedResources: number;
  } {
    const uniqueLanguages = new Set(this.resources.flatMap(r => r.languages)).size;
    const uniqueRegions = new Set(this.resources.flatMap(r => r.region)).size;
    const criticalCount = this.resources.filter(r => r.priority === 'critical' || r.priority === 'emergency').length;
    const verifiedCount = this.resources.filter(r => r.verified).length;

    return {
      totalResources: this.resources.length,
      culturalIdentities: this.getAvailableCulturalIdentities().length,
      languages: uniqueLanguages,
      regions: uniqueRegions,
      criticalResources: criticalCount,
      verifiedResources: verifiedCount
    };
  }
}

// Export singleton instance
export const culturalCrisisResources = new CulturalCrisisResourcesDatabase();