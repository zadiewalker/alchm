/**
 * ALCHM Crisis Resource Preloader
 * Smart preloading system for sub-3-second crisis resource access
 * Predictive loading based on user patterns and risk indicators
 */

import { culturalCrisisResources } from './cultural-crisis-resources';

export interface CrisisResource {
  id: string;
  name: string;
  number?: string;
  text?: string;
  url?: string;
  description: string;
  available: string;
  priority: 'emergency' | 'critical' | 'high' | 'medium' | 'low';
  cultural?: string[];
  language?: string[];
  region?: string;
  ageGroup?: 'youth' | 'adult' | 'senior' | 'all';
  lastUpdated: Date;
}

export interface PreloadingStrategy {
  immediate: CrisisResource[];
  predictive: CrisisResource[];
  cultural: CrisisResource[];
  location: CrisisResource[];
}

export interface NetworkQuality {
  effectiveType: '2g' | '3g' | '4g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface UserRiskProfile {
  emotionalState: 'stable' | 'vulnerable' | 'crisis' | 'unknown';
  historicalPatterns: string[];
  culturalIdentity: string[];
  preferredLanguage: string;
  location?: {
    country: string;
    region?: string;
    timezone: string;
  };
  ageGroup?: 'youth' | 'adult' | 'senior';
}

class CrisisResourcePreloader {
  private cache: Cache | null = null;
  private serviceWorker: ServiceWorker | null = null;
  private preloadedResources: Set<string> = new Set();
  private networkQuality: NetworkQuality | null = null;
  private isPreloading = false;
  
  // EMERGENCY Performance targets - life-critical thresholds
  private readonly PERFORMANCE_TARGETS = {
    EMERGENCY_LOAD_TIME: 100,     // 100ms for emergency resources (life-critical)
    CRITICAL_LOAD_TIME: 500,      // 500ms for critical resources
    HIGH_PRIORITY_LOAD_TIME: 1000, // 1 second for high priority
    TOTAL_PRELOAD_TIME: 3000      // 3 seconds for all preloading (reduced from 5s)
  };

  constructor() {
    // Only initialize on client-side to avoid SSR issues
    if (typeof window !== 'undefined') {
      this.initializePreloader();
    }
  }

  /**
   * Initialize the crisis resource preloader
   */
  private async initializePreloader(): Promise<void> {
    try {
      // Register crisis service worker if not already registered
      await this.registerCrisisServiceWorker();
      
      // Initialize cache
      await this.initializeCache();
      
      // Detect network quality
      this.detectNetworkQuality();
      
      // Start background preloading of universal resources
      this.preloadUniversalResources();
      
      console.log('[Crisis Preloader] Initialized successfully');
    } catch (error) {
      console.error('[Crisis Preloader] Initialization failed:', error);
      // Continue without preloading - better than blocking
    }
  }

  /**
   * Register the crisis-specific service worker
   */
  private async registerCrisisServiceWorker(): Promise<void> {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/crisis-sw.js', {
          scope: '/',
          updateViaCache: 'none' // Always check for updates
        });

        this.serviceWorker = registration.active || registration.waiting || registration.installing;
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          console.log('[Crisis Preloader] Service worker updating...');
        });

        console.log('[Crisis Preloader] Service worker registered');
      } catch (error) {
        console.error('[Crisis Preloader] Service worker registration failed:', error);
      }
    }
  }

  /**
   * Initialize crisis resource cache
   */
  private async initializeCache(): Promise<void> {
    if ('caches' in window) {
      this.cache = await caches.open('alchm-crisis-resources-v1');
    }
  }

  /**
   * Detect network quality for adaptive preloading
   */
  private detectNetworkQuality(): void {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    // @ts-ignore - Navigator connection API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      this.networkQuality = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };

      // Listen for network changes
      connection.addEventListener('change', () => {
        this.detectNetworkQuality();
        this.adaptPreloadingStrategy();
      });
    }
  }

  /**
   * Preload universal crisis resources immediately
   */
  private async preloadUniversalResources(): Promise<void> {
    if (this.isPreloading) return;
    this.isPreloading = true;

    const universalResources: CrisisResource[] = [
      {
        id: 'suicide-prevention-988',
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        description: '24/7 crisis support and suicide prevention',
        available: '24/7',
        priority: 'critical',
        cultural: ['all'],
        language: ['en', 'es'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        text: 'HOME to 741741',
        description: '24/7 crisis support via text message',
        available: '24/7',
        priority: 'critical',
        cultural: ['all'],
        language: ['en', 'es'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      },
      {
        id: 'emergency-911',
        name: 'Emergency Services',
        number: '911',
        description: 'Life-threatening emergencies',
        available: '24/7',
        priority: 'emergency',
        cultural: ['all'],
        language: ['all'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      }
    ];

    await this.preloadResourcesBatch(universalResources, 'universal');
    
    // Also preload emergency contacts to localStorage for instant access
    this.preloadEmergencyContacts();
    
    this.isPreloading = false;
  }

  /**
   * Smart preloading based on user risk profile
   */
  public async smartPreload(userProfile: UserRiskProfile): Promise<void> {
    try {
      const strategy = this.buildPreloadingStrategy(userProfile);
      
      // Preload in priority order with performance budgets
      await Promise.all([
        this.preloadWithTimeout(strategy.immediate, this.PERFORMANCE_TARGETS.CRITICAL_LOAD_TIME),
        this.preloadWithTimeout(strategy.predictive, this.PERFORMANCE_TARGETS.HIGH_PRIORITY_LOAD_TIME),
        this.preloadWithTimeout(strategy.cultural, this.PERFORMANCE_TARGETS.HIGH_PRIORITY_LOAD_TIME),
        this.preloadWithTimeout(strategy.location, this.PERFORMANCE_TARGETS.TOTAL_PRELOAD_TIME)
      ]);

      console.log('[Crisis Preloader] Smart preloading completed');
    } catch (error) {
      console.error('[Crisis Preloader] Smart preloading failed:', error);
    }
  }

  /**
   * Build preloading strategy based on user profile
   */
  private buildPreloadingStrategy(userProfile: UserRiskProfile): PreloadingStrategy {
    const strategy: PreloadingStrategy = {
      immediate: [],
      predictive: [],
      cultural: [],
      location: []
    };

    // Immediate resources based on emotional state
    if (userProfile.emotionalState === 'crisis' || userProfile.emotionalState === 'vulnerable') {
      strategy.immediate = this.getEmergencyResources();
    }

    // Predictive resources based on historical patterns
    if (userProfile.historicalPatterns.length > 0) {
      strategy.predictive = this.getPredictiveResources(userProfile.historicalPatterns);
    }

    // Cultural resources based on identity
    if (userProfile.culturalIdentity.length > 0) {
      strategy.cultural = this.getCulturalResources(userProfile.culturalIdentity);
    }

    // Location-based resources
    if (userProfile.location) {
      strategy.location = this.getLocationResources(userProfile.location);
    }

    return strategy;
  }

  /**
   * Get emergency resources for immediate access
   */
  private getEmergencyResources(): CrisisResource[] {
    return [
      {
        id: 'emergency-911',
        name: 'Emergency Services',
        number: '911',
        description: 'Life-threatening emergencies - call immediately',
        available: '24/7',
        priority: 'emergency',
        cultural: ['all'],
        language: ['all'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      },
      {
        id: 'suicide-prevention-988',
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        description: '24/7 crisis support and suicide prevention',
        available: '24/7',
        priority: 'critical',
        cultural: ['all'],
        language: ['en', 'es'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      }
    ];
  }

  /**
   * Get predictive resources based on historical patterns
   */
  private getPredictiveResources(patterns: string[]): CrisisResource[] {
    const resources: CrisisResource[] = [];
    
    if (patterns.includes('anxiety') || patterns.includes('panic')) {
      resources.push({
        id: 'anxiety-crisis-line',
        name: 'Anxiety and Depression Crisis Line',
        number: '1-800-826-3632',
        description: 'Specialized support for anxiety and panic disorders',
        available: '24/7',
        priority: 'high',
        cultural: ['all'],
        language: ['en'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      });
    }

    if (patterns.includes('self-harm') || patterns.includes('cutting')) {
      resources.push({
        id: 'self-injury-support',
        name: 'Self-Injury Outreach & Support',
        url: 'https://sioutreach.org/crisis',
        description: 'Support for self-harm and self-injury recovery',
        available: '24/7',
        priority: 'high',
        cultural: ['all'],
        language: ['en'],
        region: 'US',
        ageGroup: 'youth',
        lastUpdated: new Date()
      });
    }

    return resources;
  }

  /**
   * Get cultural resources based on identity
   */
  private getCulturalResources(culturalIdentity: string[]): CrisisResource[] {
    const resources: CrisisResource[] = [];

    if (culturalIdentity.includes('lgbtq') || culturalIdentity.includes('queer')) {
      resources.push({
        id: 'trevor-project',
        name: 'Trevor Project',
        number: '1-866-488-7386',
        description: '24/7 crisis support for LGBTQ+ youth',
        available: '24/7',
        priority: 'critical',
        cultural: ['lgbtq'],
        language: ['en', 'es'],
        region: 'US',
        ageGroup: 'youth',
        lastUpdated: new Date()
      });
    }

    if (culturalIdentity.includes('transgender') || culturalIdentity.includes('trans')) {
      resources.push({
        id: 'trans-lifeline',
        name: 'Trans Lifeline',
        number: '877-565-8860',
        description: 'Crisis support for transgender community',
        available: '24/7',
        priority: 'critical',
        cultural: ['transgender'],
        language: ['en', 'es'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      });
    }

    if (culturalIdentity.includes('black') || culturalIdentity.includes('african-american')) {
      resources.push({
        id: 'blackline',
        name: 'BlackLine',
        number: '1-800-604-5841',
        description: 'Crisis support for Black, Indigenous, and POC communities',
        available: '24/7',
        priority: 'high',
        cultural: ['black', 'bipoc'],
        language: ['en'],
        region: 'US',
        ageGroup: 'all',
        lastUpdated: new Date()
      });
    }

    return resources;
  }

  /**
   * Get location-based resources
   */
  private getLocationResources(location: { country: string; region?: string }): CrisisResource[] {
    const resources: CrisisResource[] = [];

    switch (location.country.toLowerCase()) {
      case 'ca':
      case 'canada':
        resources.push({
          id: 'canada-crisis-services',
          name: 'Canada Crisis Services',
          number: '1-833-456-4566',
          description: '24/7 crisis support in Canada',
          available: '24/7',
          priority: 'critical',
          cultural: ['all'],
          language: ['en', 'fr'],
          region: 'CA',
          ageGroup: 'all',
          lastUpdated: new Date()
        });
        break;

      case 'uk':
      case 'united kingdom':
        resources.push({
          id: 'samaritans-uk',
          name: 'Samaritans',
          number: '116 123',
          description: '24/7 crisis support in the UK',
          available: '24/7',
          priority: 'critical',
          cultural: ['all'],
          language: ['en'],
          region: 'UK',
          ageGroup: 'all',
          lastUpdated: new Date()
        });
        break;

      case 'au':
      case 'australia':
        resources.push({
          id: 'lifeline-australia',
          name: 'Lifeline Australia',
          number: '13 11 14',
          description: '24/7 crisis support in Australia',
          available: '24/7',
          priority: 'critical',
          cultural: ['all'],
          language: ['en'],
          region: 'AU',
          ageGroup: 'all',
          lastUpdated: new Date()
        });
        break;
    }

    return resources;
  }

  /**
   * Preload resources with timeout for performance
   */
  private async preloadWithTimeout(resources: CrisisResource[], timeout: number): Promise<void> {
    const preloadPromise = this.preloadResourcesBatch(resources, 'priority');
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, timeout);
    });

    await Promise.race([preloadPromise, timeoutPromise]);
  }

  /**
   * Preload a batch of resources
   */
  private async preloadResourcesBatch(resources: CrisisResource[], category: string): Promise<void> {
    if (!this.cache) {
      // Fallback to DOM prefetch if no cache available
      this.prefetchResourcesDOM(resources);
      return;
    }

    const promises = resources.map(async (resource) => {
      try {
        const resourceUrl = this.buildResourceUrl(resource);
        
        if (this.preloadedResources.has(resourceUrl)) {
          return; // Already preloaded
        }

        // Create resource data for caching
        const resourceData = {
          ...resource,
          category,
          cachedAt: new Date().toISOString()
        };

        const response = new Response(JSON.stringify(resourceData), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=3600' // Cache for 1 hour
          }
        });

        await this.cache.put(resourceUrl, response);
        this.preloadedResources.add(resourceUrl);
        
        console.log(`[Crisis Preloader] Preloaded ${resource.name}`);
      } catch (error) {
        console.warn(`[Crisis Preloader] Failed to preload ${resource.name}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Fallback DOM prefetch when cache unavailable
   */
  private prefetchResourcesDOM(resources: CrisisResource[]): void {
    if (typeof document === 'undefined') return;

    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = this.buildResourceUrl(resource);
      document.head.appendChild(link);
    });
  }

  /**
   * Build resource URL for caching
   */
  private buildResourceUrl(resource: CrisisResource): string {
    return `/api/crisis-resources/${resource.id}`;
  }

  /**
   * Adapt preloading strategy based on network quality
   */
  private adaptPreloadingStrategy(): void {
    if (!this.networkQuality) return;

    // Reduce preloading on slow networks or save-data mode
    if (this.networkQuality.saveData || 
        this.networkQuality.effectiveType === '2g' ||
        (this.networkQuality.effectiveType === '3g' && this.networkQuality.downlink < 1)) {
      
      console.log('[Crisis Preloader] Adapting to slow network - prioritizing critical resources only');
      // Only preload emergency and critical resources on slow networks
      this.preloadUniversalResources();
    }
  }

  /**
   * Preload emergency contacts to localStorage for instant access
   */
  public preloadEmergencyContacts(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      
      const emergencyData = {
        suicide_prevention: {
          name: 'National Suicide Prevention Lifeline',
          number: '988',
          available: '24/7'
        },
        crisis_text_line: {
          name: 'Crisis Text Line',
          number: '741741',
          text: 'HOME',
          available: '24/7'
        },
        emergency_services: {
          name: 'Emergency Services',
          number: '911',
          available: '24/7'
        },
        trevor_project: {
          name: 'Trevor Project',
          number: '1-866-488-7386',
          available: '24/7',
          cultural: 'LGBTQ+ youth'
        },
        trans_lifeline: {
          name: 'Trans Lifeline',
          number: '877-565-8860',
          available: '24/7',
          cultural: 'Transgender community'
        },
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('alchm_emergency_contacts', JSON.stringify(emergencyData));
      console.log('[Crisis Preloader] Emergency contacts cached to localStorage');
    } catch (error) {
      console.warn('[Crisis Preloader] Failed to cache emergency contacts:', error);
    }
  }

  /**
   * Get preloaded crisis resource
   */
  public async getCrisisResource(resourceId: string): Promise<CrisisResource | null> {
    if (!this.cache) return null;

    try {
      const resourceUrl = `/api/crisis-resources/${resourceId}`;
      const response = await this.cache.match(resourceUrl);
      
      if (response) {
        const resourceData = await response.json();
        return resourceData;
      }
    } catch (error) {
      console.error(`[Crisis Preloader] Failed to get resource ${resourceId}:`, error);
    }

    return null;
  }

  /**
   * Update crisis resources in background
   */
  public async updateCrisisResources(): Promise<void> {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({ type: 'UPDATE_CRISIS_CACHE' });
    }
  }

  /**
   * Check if crisis resources are loaded and available
   */
  public isResourcesLoaded(): boolean {
    // Check if emergency contacts are in localStorage
    if (typeof localStorage !== 'undefined') {
      const emergencyContacts = localStorage.getItem('alchm_emergency_contacts');
      if (emergencyContacts) return true;
    }
    
    // Check if any resources are preloaded
    return this.preloadedResources.size > 0;
  }

  /**
   * Get preloading status
   */
  public getPreloadingStatus(): {
    isActive: boolean;
    resourcesPreloaded: number;
    networkQuality: NetworkQuality | null;
  } {
    return {
      isActive: this.isPreloading,
      resourcesPreloaded: this.preloadedResources.size,
      networkQuality: this.networkQuality
    };
  }

  /**
   * EMERGENCY: Get crisis resources with <100ms guarantee
   * This is the life-critical function for instant crisis resource access
   */
  public getEmergencyResourcesInstant(): {
    phone: string;
    text: string;
    emergency: string;
    resources: Record<string, any>;
  } {
    // Return hardcoded values for absolute fastest access (<10ms)
    return {
      phone: 'tel:988',
      text: 'sms:741741',
      emergency: 'tel:911',
      resources: {
        suicide_prevention: {
          name: '988 Suicide & Crisis Lifeline',
          number: 'tel:988',
          action: () => window.location.href = 'tel:988'
        },
        crisis_text: {
          name: 'Crisis Text Line',
          number: 'sms:741741',
          action: () => window.location.href = 'sms:741741?body=HOME'
        },
        emergency: {
          name: 'Emergency Services',
          number: 'tel:911',
          action: () => window.location.href = 'tel:911'
        },
        trevor: {
          name: 'Trevor Project (LGBTQ+ Youth)',
          number: 'tel:18664887386',
          action: () => window.location.href = 'tel:18664887386'
        },
        trans_lifeline: {
          name: 'Trans Lifeline',
          number: 'tel:8775658860',
          action: () => window.location.href = 'tel:8775658860'
        }
      }
    };
  }

  /**
   * EMERGENCY: Trigger crisis call with performance monitoring
   */
  public emergencyCrisisCall(resourceType: 'phone' | 'text' | 'emergency' = 'phone'): void {
    const startTime = performance.now();
    
    try {
      const resources = this.getEmergencyResourcesInstant();
      let url: string;
      
      switch (resourceType) {
        case 'text':
          url = 'sms:741741?body=HOME';
          break;
        case 'emergency':
          url = 'tel:911';
          break;
        default:
          url = 'tel:988';
      }
      
      window.location.href = url;
      
      const responseTime = performance.now() - startTime;
      console.log(`🆘 Emergency crisis call initiated in ${responseTime.toFixed(2)}ms`);
      
      // Alert if response time exceeds 100ms threshold
      if (responseTime > 100) {
        console.warn(`⚠️ CRISIS RESPONSE TIME EXCEEDED: ${responseTime.toFixed(2)}ms > 100ms threshold`);
      }
      
    } catch (error) {
      console.error('🚨 EMERGENCY CRISIS CALL FAILED:', error);
      // Fallback: show alert with phone numbers
      alert('EMERGENCY CRISIS RESOURCES:\n\n988 - Suicide & Crisis Lifeline\n911 - Emergency Services\n\nText HOME to 741741 - Crisis Text Line');
    }
  }

  /**
   * Legacy API compatibility
   */
  public async initialize(): Promise<void> {
    // Already initialized in constructor, but keep for backwards compatibility
    await this.initializePreloader();
  }

  public preloadCrisisResources(): void {
    // Legacy method - now handled by preloadUniversalResources
    this.preloadUniversalResources();
  }
}

// Export singleton instance
export const crisisResourcePreloader = new CrisisResourcePreloader();