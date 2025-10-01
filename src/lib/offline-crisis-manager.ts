/**
 * ALCHM Offline Crisis Manager
 * Emergency crisis support when internet is unavailable
 * Ensures life-saving resources are always accessible
 */

export interface OfflineCrisisResource {
  id: string;
  name: string;
  number: string;
  description: string;
  instructions: string;
  priority: 'emergency' | 'critical' | 'high';
  cultural?: string[];
  ageGroup?: 'youth' | 'adult' | 'senior' | 'all';
  available: string;
}

export interface CrisisDetectionPattern {
  keywords: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  cultural?: string[];
  ageSpecific?: boolean;
}

class OfflineCrisisManager {
  private offlineResources: OfflineCrisisResource[] = [];
  private detectionPatterns: CrisisDetectionPattern[] = [];
  private isOnline = typeof window !== 'undefined' && navigator.onLine;
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.initializeOfflineResources();
    this.initializeCrisisDetectionPatterns();
    this.setupOnlineStatusListeners();
    this.cacheResourcesLocally();
  }

  /**
   * Initialize offline crisis resources
   */
  private initializeOfflineResources(): void {
    this.offlineResources = [
      // Emergency Services
      {
        id: 'emergency-911',
        name: 'Emergency Services',
        number: '911',
        description: 'Life-threatening emergencies',
        instructions: 'Call immediately for medical emergencies, fire, or police response. Stay on the line and follow dispatcher instructions.',
        priority: 'emergency',
        cultural: ['all'],
        ageGroup: 'all',
        available: '24/7'
      },
      
      // National Crisis Resources
      {
        id: 'suicide-prevention-988',
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        description: '24/7 crisis support and suicide prevention',
        instructions: 'Call 988 for immediate crisis support. Available in English and Spanish. Confidential support for people in suicidal crisis.',
        priority: 'critical',
        cultural: ['all'],
        ageGroup: 'all',
        available: '24/7'
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        number: '741741',
        description: '24/7 crisis support via text (Text HOME to 741741)',
        instructions: 'Text HOME to 741741 to connect with a Crisis Counselor. Free 24/7 support for anyone in crisis.',
        priority: 'critical',
        cultural: ['all'],
        ageGroup: 'all',
        available: '24/7'
      },
      
      // LGBTQ+ Resources
      {
        id: 'trevor-project',
        name: 'Trevor Project',
        number: '1-866-488-7386',
        description: '24/7 crisis support for LGBTQ+ youth',
        instructions: 'Call for immediate crisis support. Also available via text and chat online. Specifically trained for LGBTQ+ youth issues.',
        priority: 'critical',
        cultural: ['lgbtq', 'queer', 'gay', 'lesbian', 'bisexual'],
        ageGroup: 'youth',
        available: '24/7'
      },
      {
        id: 'trans-lifeline',
        name: 'Trans Lifeline',
        number: '877-565-8860',
        description: 'Crisis support for transgender community',
        instructions: 'Call for trans-specific crisis support. Run by trans people for trans people. Will not call emergency services without your consent.',
        priority: 'critical',
        cultural: ['transgender', 'trans', 'nonbinary'],
        ageGroup: 'all',
        available: '24/7'
      },
      
      // Cultural-Specific Resources
      {
        id: 'blackline',
        name: 'BlackLine',
        number: '1-800-604-5841',
        description: 'Crisis support for Black, Indigenous, and POC communities',
        instructions: 'Call for culturally competent crisis support. Prioritizing the health and wellness of Black and Brown communities.',
        priority: 'high',
        cultural: ['black', 'african-american', 'bipoc', 'indigenous'],
        ageGroup: 'all',
        available: '24/7'
      },
      {
        id: 'stronghearts-native',
        name: 'StrongHearts Native Helpline',
        number: '1-844-762-8483',
        description: 'Crisis support for Native Americans',
        instructions: 'Call for culturally-appropriate support for Native Americans facing domestic violence and crisis situations.',
        priority: 'high',
        cultural: ['native-american', 'indigenous', 'tribal'],
        ageGroup: 'all',
        available: '24/7'
      },
      
      // Specialized Crisis Resources
      {
        id: 'veterans-crisis',
        name: 'Veterans Crisis Line',
        number: '1-800-273-8255',
        description: 'Crisis support for veterans (Press 1 after calling)',
        instructions: 'Call and press 1 for immediate veteran crisis support. Also available via text to 838255.',
        priority: 'critical',
        cultural: ['veteran', 'military'],
        ageGroup: 'adult',
        available: '24/7'
      },
      {
        id: 'postpartum-support',
        name: 'Postpartum Support International',
        number: '1-944-4-PPD-MOM',
        description: 'Crisis support for postpartum depression and anxiety',
        instructions: 'Call for immediate support with postpartum mental health crises. Specialized counselors available.',
        priority: 'high',
        cultural: ['maternal', 'postpartum'],
        ageGroup: 'adult',
        available: '24/7'
      },
      
      // International Resources (for travelers/immigrants)
      {
        id: 'international-association',
        name: 'International Association for Suicide Prevention',
        number: 'varies',
        description: 'Global crisis resources directory',
        instructions: 'Visit iasp.info/resources/Crisis_Centres for international crisis numbers. Available worldwide.',
        priority: 'high',
        cultural: ['international'],
        ageGroup: 'all',
        available: 'varies'
      }
    ];
  }

  /**
   * Initialize crisis detection patterns for offline use
   */
  private initializeCrisisDetectionPatterns(): void {
    this.detectionPatterns = [
      // Suicide ideation - Critical
      {
        keywords: ['want to die', 'kill myself', 'end my life', 'suicide', 'suicidal', 'not worth living', 'better off dead'],
        severity: 'critical',
        cultural: ['all']
      },
      {
        keywords: ['planning to die', 'suicide plan', 'how to kill', 'ways to die', 'ending it all'],
        severity: 'critical',
        cultural: ['all']
      },
      
      // Self-harm - High
      {
        keywords: ['cutting myself', 'self-harm', 'hurt myself', 'burning myself', 'scratching myself'],
        severity: 'high',
        cultural: ['all']
      },
      {
        keywords: ['razor', 'blade', 'cutting', 'scars', 'blood', 'burning', 'hitting myself'],
        severity: 'high',
        cultural: ['all']
      },
      
      // Violence threats - Critical
      {
        keywords: ['hurt others', 'kill them', 'violence', 'harm someone', 'make them pay'],
        severity: 'critical',
        cultural: ['all']
      },
      
      // Severe depression - High
      {
        keywords: ['can\'t go on', 'no hope', 'hopeless', 'worthless', 'pointless', 'give up'],
        severity: 'high',
        cultural: ['all']
      },
      {
        keywords: ['nobody cares', 'alone forever', 'no one understands', 'burden to everyone'],
        severity: 'medium',
        cultural: ['all']
      },
      
      // Panic/anxiety crisis - Medium
      {
        keywords: ['panic attack', 'can\'t breathe', 'heart racing', 'going crazy', 'losing control'],
        severity: 'medium',
        cultural: ['all']
      },
      
      // LGBTQ+ specific crisis patterns
      {
        keywords: ['rejected by family', 'kicked out', 'conversion therapy', 'not accepted', 'hate who I am'],
        severity: 'high',
        cultural: ['lgbtq'],
        ageSpecific: true
      },
      
      // Cultural trauma patterns
      {
        keywords: ['discrimination', 'racism', 'hate crime', 'cultural trauma', 'identity crisis'],
        severity: 'high',
        cultural: ['bipoc']
      },
      
      // Domestic violence - Critical
      {
        keywords: ['being hurt', 'domestic violence', 'abusive relationship', 'fear for my safety', 'threatening me'],
        severity: 'critical',
        cultural: ['all']
      }
    ];
  }

  /**
   * Setup online status listeners
   */
  private setupOnlineStatusListeners(): void {
    typeof window !== 'undefined' && window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      console.log('[Offline Crisis Manager] Back online');
    });

    typeof window !== 'undefined' && window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
      console.log('[Offline Crisis Manager] Gone offline - offline crisis support active');
    });
  }

  /**
   * Cache crisis resources locally
   */
  private cacheResourcesLocally(): void {
    try {
      if (typeof typeof window !== 'undefined' && localStorage !== 'undefined') {
        const resourceData = {
          resources: this.offlineResources,
          patterns: this.detectionPatterns,
          lastUpdated: new Date().toISOString()
        };
        
        typeof window !== 'undefined' && localStorage.setItem('alchm_offline_crisis_resources', JSON.stringify(resourceData));
        console.log('[Offline Crisis Manager] Crisis resources cached locally');
      }
    } catch (error) {
      console.warn('[Offline Crisis Manager] Failed to cache resources:', error);
    }
  }

  /**
   * Detect crisis in text (works offline)
   */
  public detectCrisis(text: string, userProfile?: {
    culturalIdentity?: string[];
    ageGroup?: string;
  }): {
    detected: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    matchedPatterns: string[];
    recommendedResources: OfflineCrisisResource[];
  } {
    if (!text || text.trim().length === 0) {
      return {
        detected: false,
        severity: 'low',
        matchedPatterns: [],
        recommendedResources: []
      };
    }

    const textLower = text.toLowerCase();
    const matchedPatterns: string[] = [];
    let highestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check patterns for matches
    for (const pattern of this.detectionPatterns) {
      const hasMatch = pattern.keywords.some(keyword => textLower.includes(keyword.toLowerCase()));
      
      if (hasMatch) {
        // Check cultural relevance
        if (pattern.cultural && pattern.cultural.length > 0 && pattern.cultural[0] !== 'all') {
          if (userProfile?.culturalIdentity) {
            const hasCulturalMatch = pattern.cultural.some(cultural => 
              userProfile.culturalIdentity!.includes(cultural)
            );
            if (!hasCulturalMatch) continue;
          }
        }

        // Check age relevance
        if (pattern.ageSpecific && userProfile?.ageGroup) {
          if (userProfile.ageGroup === 'adult' && 
              pattern.cultural?.includes('lgbtq')) {
            continue; // Skip LGBTQ youth-specific patterns for adults
          }
        }

        matchedPatterns.push(...pattern.keywords.filter(k => textLower.includes(k.toLowerCase())));
        
        // Update severity
        if (this.compareSeverity(pattern.severity, highestSeverity) > 0) {
          highestSeverity = pattern.severity;
        }
      }
    }

    const detected = matchedPatterns.length > 0;
    const recommendedResources = detected ? this.getRecommendedResources(highestSeverity, userProfile) : [];

    return {
      detected,
      severity: highestSeverity,
      matchedPatterns,
      recommendedResources
    };
  }

  /**
   * Compare severity levels
   */
  private compareSeverity(severity1: string, severity2: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return (levels as any)[severity1] - (levels as any)[severity2];
  }

  /**
   * Get recommended crisis resources based on severity and user profile
   */
  private getRecommendedResources(
    severity: 'low' | 'medium' | 'high' | 'critical',
    userProfile?: {
      culturalIdentity?: string[];
      ageGroup?: string;
    }
  ): OfflineCrisisResource[] {
    let resources = [...this.offlineResources];

    // Filter by priority based on severity
    if (severity === 'critical') {
      resources = resources.filter(r => r.priority === 'emergency' || r.priority === 'critical');
    } else if (severity === 'high') {
      resources = resources.filter(r => r.priority !== 'emergency');
    }

    // Filter by cultural identity
    if (userProfile?.culturalIdentity && userProfile.culturalIdentity.length > 0) {
      const culturalResources = resources.filter(resource => {
        if (!resource.cultural) return false;
        return resource.cultural.some(cultural => 
          cultural === 'all' || userProfile.culturalIdentity!.includes(cultural)
        );
      });
      
      // If we have cultural matches, prioritize them but include universal ones
      if (culturalResources.length > 0) {
        const universalResources = resources.filter(r => r.cultural?.includes('all'));
        resources = [...culturalResources, ...universalResources];
      }
    }

    // Filter by age group
    if (userProfile?.ageGroup) {
      resources = resources.filter(resource => 
        !resource.ageGroup || resource.ageGroup === 'all' || resource.ageGroup === userProfile.ageGroup
      );
    }

    // Sort by priority (emergency first, then critical, then high)
    resources.sort((a, b) => {
      const priorityOrder = { emergency: 1, critical: 2, high: 3 };
      return (priorityOrder as any)[a.priority] - (priorityOrder as any)[b.priority];
    });

    // Limit to top 5 resources to avoid overwhelming user
    return resources.slice(0, 5);
  }

  /**
   * Get emergency resources for immediate crisis
   */
  public getEmergencyResources(): OfflineCrisisResource[] {
    return this.offlineResources
      .filter(resource => resource.priority === 'emergency' || resource.priority === 'critical')
      .slice(0, 3);
  }

  /**
   * Get culturally appropriate resources
   */
  public getCulturalResources(culturalIdentity: string[]): OfflineCrisisResource[] {
    if (!culturalIdentity || culturalIdentity.length === 0) {
      return this.getEmergencyResources();
    }

    const culturalResources = this.offlineResources.filter(resource => {
      if (!resource.cultural) return false;
      return resource.cultural.some(cultural => 
        cultural === 'all' || culturalIdentity.includes(cultural)
      );
    });

    return culturalResources.slice(0, 5);
  }

  /**
   * Format crisis resource for display
   */
  public formatResourceForDisplay(resource: OfflineCrisisResource): {
    primaryAction: string;
    secondaryInfo: string;
    instructions: string;
    culturalNote?: string;
  } {
    const primaryAction = `Call ${resource.number}`;
    const secondaryInfo = `${resource.name} - ${resource.available}`;
    const instructions = resource.instructions;
    
    let culturalNote: string | undefined;
    if (resource.cultural && !resource.cultural.includes('all')) {
      culturalNote = `Specifically supports ${resource.cultural.join(', ')} community`;
    }

    return {
      primaryAction,
      secondaryInfo,
      instructions,
      culturalNote
    };
  }

  /**
   * Create offline crisis intervention message
   */
  public createCrisisInterventionMessage(
    severity: 'low' | 'medium' | 'high' | 'critical',
    resources: OfflineCrisisResource[]
  ): {
    title: string;
    message: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    resources: Array<{
      name: string;
      number: string;
      description: string;
      action: string;
    }>;
  } {
    let title: string;
    let message: string;

    switch (severity) {
      case 'critical':
        title = '🚨 Immediate Crisis Support Needed';
        message = 'We care about you and want you to be safe. You\'re currently offline, but these crisis resources are always available. Please call one of these numbers immediately:';
        break;
      case 'high':
        title = '💝 Crisis Support Available';
        message = 'We\'ve detected you might be going through a difficult time. Even though you\'re offline, help is always available. These resources are here for you:';
        break;
      case 'medium':
        title = '💙 Support Resources';
        message = 'It sounds like you might need some support right now. These resources are available even when you\'re offline:';
        break;
      default:
        title = '🤗 You\'re Not Alone';
        message = 'Remember that support is always available when you need it:';
    }

    const formattedResources = resources.map(resource => ({
      name: resource.name,
      number: resource.number,
      description: resource.description,
      action: `Call ${resource.number}`
    }));

    return {
      title,
      message,
      urgency: severity,
      resources: formattedResources
    };
  }

  /**
   * Check if online
   */
  public isOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Add listener for online status changes
   */
  public addOnlineStatusListener(listener: (isOnline: boolean) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove online status listener
   */
  public removeOnlineStatusListener(listener: (isOnline: boolean) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify listeners of online status change
   */
  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('[Offline Crisis Manager] Listener error:', error);
      }
    });
  }

  /**
   * Get all available offline resources
   */
  public getAllOfflineResources(): OfflineCrisisResource[] {
    return [...this.offlineResources];
  }

  /**
   * Update offline resources (when back online)
   */
  public async updateOfflineResources(newResources?: OfflineCrisisResource[]): Promise<void> {
    if (newResources && newResources.length > 0) {
      this.offlineResources = newResources;
      this.cacheResourcesLocally();
      console.log('[Offline Crisis Manager] Resources updated');
    }
  }

  /**
   * Load cached resources from typeof window !== 'undefined' && localStorage
   */
  public loadCachedResources(): boolean {
    try {
      if (typeof typeof window !== 'undefined' && localStorage !== 'undefined') {
        const cached = typeof window !== 'undefined' && localStorage.getItem('alchm_offline_crisis_resources');
        if (cached) {
          const data = JSON.parse(cached);
          if (data.resources && data.patterns) {
            this.offlineResources = data.resources;
            this.detectionPatterns = data.patterns;
            console.log('[Offline Crisis Manager] Loaded cached resources');
            return true;
          }
        }
      }
    } catch (error) {
      console.warn('[Offline Crisis Manager] Failed to load cached resources:', error);
    }
    return false;
  }
}

// Export singleton instance
export const offlineCrisisManager = new OfflineCrisisManager();