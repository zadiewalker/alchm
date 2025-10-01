'use client';

/**
 * ALCHM Enhanced Cultural Crisis Resources System
 * Culturally-responsive crisis support with intersectional awareness
 * Privacy-preserving resource matching with sub-3-second load times
 */

import React from 'react';

export interface CulturalCrisisResource {
  id: string;
  name: string;
  shortName: string;
  description: string;
  contactInfo: {
    phone?: string;
    text?: string;
    chat?: string;
    email?: string;
    website?: string;
  };
  accessibility: {
    languages: string[];
    interpreters: boolean;
    tty: boolean;
    relay: boolean;
    culturalCompetency: string[];
  };
  availability: {
    hours: string;
    timezone: string;
    emergency: boolean;
    responseTime: string;
  };
  specializations: string[];
  culturalContext: string[];
  ageGroups: ('youth' | 'adult' | 'senior' | 'all')[];
  intersectionalSupport: string[];
  traumaInformed: boolean;
  costInfo: 'free' | 'sliding-scale' | 'insurance' | 'varied';
  verificationStatus: 'verified' | 'pending' | 'community-sourced';
  lastUpdated: string;
  region: 'us' | 'ca' | 'uk' | 'au' | 'international';
  icon: string;
  priorityScore: number;
}

export interface ResourceFilter {
  culturalIdentity: string[];
  ageGroup: 'youth' | 'adult' | 'senior';
  languages: string[];
  location?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  accessibilityNeeds: string[];
  intersectionalFactors: string[];
}

export interface ResourceRecommendation {
  resource: CulturalCrisisResource;
  relevanceScore: number;
  reasoning: string[];
  alternativeContacts: string[];
  accessibilityNotes: string[];
}

class CulturalCrisisResourcesEnhanced {
  private resources: CulturalCrisisResource[] = [];
  private resourceCache: Map<string, ResourceRecommendation[]> = new Map();
  private performanceMetrics: Map<string, number[]> = new Map();
  
  // Performance targets for crisis resource access
  private readonly PERFORMANCE_TARGETS = {
    RESOURCE_LOAD_TIME: 3000,    // 3 seconds max load time
    SEARCH_RESPONSE_TIME: 500,   // 500ms for resource search
    CACHE_EXPIRY: 300000,        // 5 minutes cache expiry
    MAX_CACHE_SIZE: 100          // Maximum cached queries
  };

  constructor() {
    this.initializeResources();
    this.setupCacheCleanup();
  }

  /**
   * Initialize comprehensive cultural crisis resources
   */
  private initializeResources(): void {
    this.resources = [
      // LGBTQ+ Resources
      {
        id: 'trevor-project',
        name: 'The Trevor Project',
        shortName: 'Trevor Project',
        description: '24/7 crisis support for LGBTQ+ young people',
        contactInfo: {
          phone: '1-866-488-7386',
          text: 'Text START to 678-678',
          chat: 'https://www.thetrevorproject.org/get-help/',
          website: 'https://www.thetrevorproject.org'
        },
        accessibility: {
          languages: ['English', 'Spanish'],
          interpreters: true,
          tty: true,
          relay: true,
          culturalCompetency: ['LGBTQ+', 'youth', 'coming-out', 'identity']
        },
        availability: {
          hours: '24/7',
          timezone: 'All US timezones',
          emergency: true,
          responseTime: 'Immediate'
        },
        specializations: ['Suicide prevention', 'LGBTQ+ identity', 'Coming out', 'Family rejection', 'School bullying'],
        culturalContext: ['lgbtq', 'queer', 'gay', 'lesbian', 'bisexual'],
        ageGroups: ['youth'],
        intersectionalSupport: ['LGBTQ+ BIPOC', 'Trans youth', 'Religious trauma'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '🏳️‍🌈',
        priorityScore: 95
      },

      {
        id: 'trans-lifeline',
        name: 'Trans Lifeline',
        shortName: 'Trans Lifeline',
        description: 'Crisis support by and for transgender people',
        contactInfo: {
          phone: '877-565-8860',
          website: 'https://translifeline.org'
        },
        accessibility: {
          languages: ['English', 'Spanish'],
          interpreters: false,
          tty: false,
          relay: true,
          culturalCompetency: ['transgender', 'gender identity', 'transition', 'deadnaming']
        },
        availability: {
          hours: '24/7',
          timezone: 'US/Canada',
          emergency: true,
          responseTime: 'Direct connection'
        },
        specializations: ['Transgender support', 'Gender identity', 'Transition issues', 'Discrimination'],
        culturalContext: ['transgender', 'trans', 'nonbinary', 'genderqueer'],
        ageGroups: ['all'],
        intersectionalSupport: ['Trans BIPOC', 'Trans youth', 'Trans seniors'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '🏳️‍⚧️',
        priorityScore: 93
      },

      // BIPOC Resources
      {
        id: 'blackline',
        name: 'BlackLine',
        shortName: 'BlackLine',
        description: 'Crisis support for Black, Indigenous, and People of Color',
        contactInfo: {
          phone: '1-800-604-5841',
          website: 'https://www.callblackline.com'
        },
        accessibility: {
          languages: ['English'],
          interpreters: true,
          tty: true,
          relay: true,
          culturalCompetency: ['Black community', 'Indigenous', 'POC', 'racial trauma']
        },
        availability: {
          hours: '24/7',
          timezone: 'US',
          emergency: true,
          responseTime: 'Community connection'
        },
        specializations: ['Racial trauma', 'Police violence', 'Systemic oppression', 'Community healing'],
        culturalContext: ['black', 'indigenous', 'bipoc', 'african-american'],
        ageGroups: ['all'],
        intersectionalSupport: ['Black LGBTQ+', 'Indigenous two-spirit', 'Immigrant communities'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '✊🏿',
        priorityScore: 92
      },

      {
        id: 'crisis-text-line-spanish',
        name: 'Línea de Crisis en Español',
        shortName: 'Línea Crisis',
        description: 'Apoyo de crisis en español las 24 horas',
        contactInfo: {
          text: 'Envía HOLA al 741741',
          phone: '1-888-628-9454'
        },
        accessibility: {
          languages: ['Spanish'],
          interpreters: false,
          tty: false,
          relay: true,
          culturalCompetency: ['Latino', 'Hispanic', 'Spanish-speaking', 'immigrant']
        },
        availability: {
          hours: '24/7',
          timezone: 'US',
          emergency: true,
          responseTime: '5 minutos'
        },
        specializations: ['Crisis en español', 'Apoyo cultural', 'Inmigración', 'Familia'],
        culturalContext: ['latino', 'hispanic', 'spanish-speaking', 'immigrant'],
        ageGroups: ['all'],
        intersectionalSupport: ['LGBTQ+ Latino', 'Undocumented immigrants', 'Mixed-status families'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '🌍',
        priorityScore: 90
      },

      // Youth-Specific Resources
      {
        id: 'teen-line',
        name: 'Teen Line',
        shortName: 'Teen Line',
        description: 'Teen-to-teen crisis support',
        contactInfo: {
          phone: '1-800-852-8336',
          text: 'Text TEEN to 839863',
          website: 'https://teenlineonline.org'
        },
        accessibility: {
          languages: ['English'],
          interpreters: true,
          tty: true,
          relay: true,
          culturalCompetency: ['Youth', 'Teen issues', 'Peer support']
        },
        availability: {
          hours: '6 PM - 10 PM PST',
          timezone: 'PST',
          emergency: false,
          responseTime: 'Peer connection'
        },
        specializations: ['Teen support', 'Peer counseling', 'School issues', 'Dating violence'],
        culturalContext: ['all'],
        ageGroups: ['youth'],
        intersectionalSupport: ['All identities welcomed'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '👥',
        priorityScore: 85
      },

      // Religious/Spiritual Trauma
      {
        id: 'recovering-from-religion',
        name: 'Recovering From Religion',
        shortName: 'RFR Support',
        description: 'Support for those questioning or leaving religion',
        contactInfo: {
          phone: '1-844-368-2848',
          chat: 'https://www.recoveringfromreligion.org/hotline',
          website: 'https://www.recoveringfromreligion.org'
        },
        accessibility: {
          languages: ['English'],
          interpreters: false,
          tty: false,
          relay: true,
          culturalCompetency: ['Religious trauma', 'Spiritual abuse', 'Deconversion']
        },
        availability: {
          hours: 'Limited hours',
          timezone: 'US',
          emergency: false,
          responseTime: 'Support available'
        },
        specializations: ['Religious trauma', 'Spiritual abuse', 'Faith transition', 'Family rejection'],
        culturalContext: ['religious-trauma', 'spiritual-abuse', 'ex-religious'],
        ageGroups: ['all'],
        intersectionalSupport: ['LGBTQ+ religious trauma', 'Cult survivors'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '🕊️',
        priorityScore: 80
      },

      // Domestic Violence
      {
        id: 'national-domestic-violence-hotline',
        name: 'National Domestic Violence Hotline',
        shortName: 'DV Hotline',
        description: '24/7 support for domestic violence survivors',
        contactInfo: {
          phone: '1-800-799-7233',
          text: 'Text START to 88788',
          chat: 'https://www.thehotline.org',
          website: 'https://www.thehotline.org'
        },
        accessibility: {
          languages: ['English', 'Spanish', '200+ languages via interpreters'],
          interpreters: true,
          tty: true,
          relay: true,
          culturalCompetency: ['Domestic violence', 'Intimate partner violence', 'Safety planning']
        },
        availability: {
          hours: '24/7',
          timezone: 'US',
          emergency: true,
          responseTime: 'Immediate'
        },
        specializations: ['Domestic violence', 'Safety planning', 'Legal resources', 'Shelter referrals'],
        culturalContext: ['all'],
        ageGroups: ['all'],
        intersectionalSupport: ['LGBTQ+ survivors', 'Immigrant survivors', 'Disability-informed'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '🛡️',
        priorityScore: 94
      },

      // Mental Health Specific
      {
        id: 'nami-helpline',
        name: 'NAMI HelpLine',
        shortName: 'NAMI',
        description: 'Mental health information and support',
        contactInfo: {
          phone: '1-800-950-6264',
          text: 'Text NAMI to 741741',
          website: 'https://www.nami.org/help'
        },
        accessibility: {
          languages: ['English', 'Spanish'],
          interpreters: true,
          tty: true,
          relay: true,
          culturalCompetency: ['Mental health', 'Family support', 'Advocacy']
        },
        availability: {
          hours: 'Mon-Fri 10 AM - 10 PM ET',
          timezone: 'ET',
          emergency: false,
          responseTime: 'Information support'
        },
        specializations: ['Mental health education', 'Family support', 'Local resources', 'Advocacy'],
        culturalContext: ['all'],
        ageGroups: ['all'],
        intersectionalSupport: ['Culturally diverse programming'],
        traumaInformed: true,
        costInfo: 'free',
        verificationStatus: 'verified',
        lastUpdated: '2024-01-15',
        region: 'us',
        icon: '🧠',
        priorityScore: 78
      }
    ];

    console.log(`🆘 Initialized ${this.resources.length} cultural crisis resources`);
  }

  /**
   * Get culturally-appropriate crisis resources with performance tracking
   */
  public async getCulturalResources(filter: ResourceFilter): Promise<ResourceRecommendation[]> {
    const startTime = performance.now();
    
    // Check cache first
    const cacheKey = this.generateCacheKey(filter);
    if (this.resourceCache.has(cacheKey)) {
      const cached = this.resourceCache.get(cacheKey)!;
      this.recordPerformance('cache_hit', performance.now() - startTime);
      return cached;
    }

    // Filter and score resources
    const recommendations = await this.filterAndScoreResources(filter);
    
    // Cache results for performance
    this.resourceCache.set(cacheKey, recommendations);
    
    const totalTime = performance.now() - startTime;
    this.recordPerformance('resource_search', totalTime);
    
    if (totalTime > this.PERFORMANCE_TARGETS.SEARCH_RESPONSE_TIME) {
      console.warn(`⚠️ Cultural resource search exceeded 500ms: ${totalTime.toFixed(2)}ms`);
    }

    return recommendations;
  }

  /**
   * Filter and score resources based on cultural relevance
   */
  private async filterAndScoreResources(filter: ResourceFilter): Promise<ResourceRecommendation[]> {
    const recommendations: ResourceRecommendation[] = [];

    for (const resource of this.resources) {
      const relevanceScore = this.calculateRelevanceScore(resource, filter);
      
      if (relevanceScore > 0) {
        const reasoning = this.generateReasoning(resource, filter, relevanceScore);
        const alternativeContacts = this.getAlternativeContacts(resource);
        const accessibilityNotes = this.getAccessibilityNotes(resource, filter);

        recommendations.push({
          resource,
          relevanceScore,
          reasoning,
          alternativeContacts,
          accessibilityNotes
        });
      }
    }

    // Sort by relevance score and urgency
    return recommendations
      .sort((a, b) => {
        // Prioritize emergency resources in critical situations
        if (filter.urgencyLevel === 'critical') {
          if (a.resource.availability.emergency && !b.resource.availability.emergency) return -1;
          if (!a.resource.availability.emergency && b.resource.availability.emergency) return 1;
        }
        
        return b.relevanceScore - a.relevanceScore;
      })
      .slice(0, 10); // Return top 10 most relevant
  }

  /**
   * Calculate cultural relevance score
   */
  private calculateRelevanceScore(resource: CulturalCrisisResource, filter: ResourceFilter): number {
    let score = 0;

    // Cultural identity match (highest weight)
    const culturalMatch = filter.culturalIdentity.some(identity => 
      resource.culturalContext.includes(identity) || resource.culturalContext.includes('all')
    );
    if (culturalMatch) score += 40;

    // Age group match
    if (resource.ageGroups.includes(filter.ageGroup) || resource.ageGroups.includes('all')) {
      score += 20;
    }

    // Language support
    const languageMatch = filter.languages.some(lang => 
      resource.accessibility.languages.includes(lang)
    );
    if (languageMatch) score += 15;

    // Emergency availability for urgent needs
    if (filter.urgencyLevel === 'critical' && resource.availability.emergency) {
      score += 15;
    }

    // Intersectional support
    const intersectionalMatch = filter.intersectionalFactors.some(factor =>
      resource.intersectionalSupport.some(support => 
        support.toLowerCase().includes(factor.toLowerCase())
      )
    );
    if (intersectionalMatch) score += 10;

    // Accessibility needs
    const accessibilityMatch = filter.accessibilityNeeds.some(need => {
      switch (need) {
        case 'tty': return resource.accessibility.tty;
        case 'interpreters': return resource.accessibility.interpreters;
        case 'relay': return resource.accessibility.relay;
        default: return false;
      }
    });
    if (accessibilityMatch) score += 5;

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Generate reasoning for resource recommendation
   */
  private generateReasoning(resource: CulturalCrisisResource, filter: ResourceFilter, score: number): string[] {
    const reasoning: string[] = [];

    // Cultural relevance
    const culturalMatch = filter.culturalIdentity.filter(identity => 
      resource.culturalContext.includes(identity)
    );
    if (culturalMatch.length > 0) {
      reasoning.push(`Specialized support for ${culturalMatch.join(', ')} community`);
    }

    // Age appropriateness
    if (resource.ageGroups.includes(filter.ageGroup)) {
      reasoning.push(`Age-appropriate for ${filter.ageGroup}s`);
    }

    // Language support
    const supportedLanguages = filter.languages.filter(lang => 
      resource.accessibility.languages.includes(lang)
    );
    if (supportedLanguages.length > 0) {
      reasoning.push(`Support available in ${supportedLanguages.join(', ')}`);
    }

    // Emergency availability
    if (resource.availability.emergency && filter.urgencyLevel === 'critical') {
      reasoning.push('Available for immediate crisis support');
    }

    // Trauma-informed care
    if (resource.traumaInformed) {
      reasoning.push('Trauma-informed approach');
    }

    return reasoning;
  }

  /**
   * Get alternative contact methods
   */
  private getAlternativeContacts(resource: CulturalCrisisResource): string[] {
    const alternatives: string[] = [];

    if (resource.contactInfo.text) {
      alternatives.push(`Text: ${resource.contactInfo.text}`);
    }
    if (resource.contactInfo.chat) {
      alternatives.push('Online chat available');
    }
    if (resource.contactInfo.website) {
      alternatives.push('Website resources available');
    }

    return alternatives;
  }

  /**
   * Get accessibility notes
   */
  private getAccessibilityNotes(resource: CulturalCrisisResource, filter: ResourceFilter): string[] {
    const notes: string[] = [];

    if (resource.accessibility.tty && filter.accessibilityNeeds.includes('tty')) {
      notes.push('TTY accessible');
    }
    if (resource.accessibility.interpreters) {
      notes.push('Interpreter services available');
    }
    if (resource.accessibility.relay && filter.accessibilityNeeds.includes('relay')) {
      notes.push('Relay services supported');
    }

    return notes;
  }

  /**
   * Generate cache key for resource filter
   */
  private generateCacheKey(filter: ResourceFilter): string {
    return JSON.stringify({
      cultural: filter.culturalIdentity.sort(),
      age: filter.ageGroup,
      lang: filter.languages.sort(),
      urgency: filter.urgencyLevel,
      access: filter.accessibilityNeeds.sort(),
      intersect: filter.intersectionalFactors.sort()
    });
  }

  /**
   * Record performance metrics
   */
  private recordPerformance(operation: string, time: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    
    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(time);
    
    // Keep only last 50 measurements
    if (metrics.length > 50) {
      metrics.shift();
    }
  }

  /**
   * Setup cache cleanup to prevent memory leaks
   */
  private setupCacheCleanup(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        if (this.resourceCache.size > this.PERFORMANCE_TARGETS.MAX_CACHE_SIZE) {
          this.resourceCache.clear();
          console.log('🧹 Cultural crisis resource cache cleared');
        }
      }, this.PERFORMANCE_TARGETS.CACHE_EXPIRY);
    }
  }

  /**
   * Get emergency resources for immediate access
   */
  public getEmergencyResources(): CulturalCrisisResource[] {
    return this.resources
      .filter(r => r.availability.emergency)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): Map<string, number[]> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Update resource verification status
   */
  public updateResourceStatus(resourceId: string, status: 'verified' | 'pending' | 'community-sourced'): void {
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource) {
      resource.verificationStatus = status;
      resource.lastUpdated = new Date().toISOString();
      
      // Clear cache to reflect updates
      this.resourceCache.clear();
    }
  }

  /**
   * Add new community-sourced resource
   */
  public addCommunityResource(resource: Omit<CulturalCrisisResource, 'verificationStatus' | 'lastUpdated'>): void {
    const newResource: CulturalCrisisResource = {
      ...resource,
      verificationStatus: 'community-sourced',
      lastUpdated: new Date().toISOString()
    };

    this.resources.push(newResource);
    this.resourceCache.clear(); // Clear cache to include new resource
    
    console.log(`📝 Added community-sourced resource: ${resource.name}`);
  }
}

// Export singleton instance
export const culturalCrisisResources = new CulturalCrisisResourcesEnhanced();

// React hook for cultural crisis resources
export function useCulturalCrisisResources() {
  const [loading, setLoading] = React.useState(false);
  const [resources, setResources] = React.useState<ResourceRecommendation[]>([]);

  const getCulturalResources = React.useCallback(async (filter: ResourceFilter) => {
    setLoading(true);
    try {
      const recommendations = await culturalCrisisResources.getCulturalResources(filter);
      setResources(recommendations);
    } catch (error) {
      console.error('Failed to load cultural crisis resources:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmergencyResources = React.useCallback(() => {
    return culturalCrisisResources.getEmergencyResources();
  }, []);

  return {
    loading,
    resources,
    getCulturalResources,
    getEmergencyResources
  };
}