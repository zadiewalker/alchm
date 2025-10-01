/**
 * ALCHM Mobile Crisis Offline Manager
 * 
 * Ensures crisis resources are available offline for users in vulnerable situations
 * who may lose internet connection or have unreliable networks.
 * 
 * Critical for trauma survivors who need consistent access to support resources.
 */

interface CrisisResource {
  url: string;
  type: 'json' | 'html' | 'text' | 'image';
  priority: 'critical' | 'high' | 'medium' | 'low';
  content?: string | object;
  lastUpdated?: number;
  expiresAt?: number;
}

interface EmergencyContact {
  name: string;
  number: string;
  type: 'crisis' | 'emergency' | 'text' | 'chat';
  description: string;
  available24h: boolean;
}

interface OfflineConfig {
  maxCacheSize: number; // MB
  cacheExpiration: number; // hours
  retryAttempts: number;
  backgroundSync: boolean;
}

export class MobileCrisisOfflineManager {
  private cache: Map<string, CrisisResource> = new Map();
  private serviceWorker: ServiceWorker | null = null;
  private isOnline: boolean = true;
  private syncQueue: string[] = [];
  private config: OfflineConfig;

  constructor() {
    this.config = {
      maxCacheSize: 20, // 20MB for crisis resources
      cacheExpiration: 24, // 24 hours
      retryAttempts: 3,
      backgroundSync: true
    };

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize the offline manager
   */
  private async initialize(): Promise<void> {
    try {
      // Set up online/offline detection
      this.setupNetworkMonitoring();

      // Register service worker for offline functionality
      await this.registerServiceWorker();

      // Load cached crisis resources
      await this.loadCachedResources();

      // Preload critical crisis resources
      await this.preloadCriticalResources();

      // Set up emergency contacts cache
      await this.cacheEmergencyContacts();

      // Start background sync if supported
      if (this.config.backgroundSync) {
        this.setupBackgroundSync();
      }

    } catch (error) {
      console.error('Crisis offline manager initialization failed:', error);
      // Fallback to basic offline support
      this.setupBasicOfflineSupport();
    }
  }

  /**
   * Set up network monitoring for online/offline detection
   */
  private setupNetworkMonitoring(): void {
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOnlineStatusChange(false);
    });

    // Monitor connection quality
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.handleConnectionChange(connection);
      });
    }
  }

  /**
   * Handle online/offline status changes
   */
  private handleOnlineStatusChange(isOnline: boolean): void {
    if (isOnline) {
      // When back online, sync any queued updates
      this.processSyncQueue();
      // Refresh critical resources
      this.refreshCriticalResources();
    } else {
      // When offline, ensure crisis resources are available
      this.validateOfflineResources();
    }

    // Dispatch event for UI components
    window.dispatchEvent(new CustomEvent('connectionStatusChange', {
      detail: { isOnline, hasOfflineResources: this.hasOfflineResources() }
    }));
  }

  /**
   * Handle connection quality changes
   */
  private handleConnectionChange(connection: any): void {
    const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                            connection.effectiveType === '2g';
    
    if (isSlowConnection) {
      // Prioritize crisis resources only
      this.enableCrisisOnlyMode();
    }
  }

  /**
   * Register service worker for offline functionality
   */
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/mobile-crisis-sw.js');
        this.serviceWorker = registration.active || registration.waiting || registration.installing;
        
        console.log('Crisis service worker registered successfully');
      } catch (error) {
        console.warn('Crisis service worker registration failed:', error);
      }
    }
  }

  /**
   * Preload critical crisis resources
   */
  private async preloadCriticalResources(): Promise<void> {
    const criticalResources: CrisisResource[] = [
      {
        url: '/crisis-hotlines.json',
        type: 'json',
        priority: 'critical'
      },
      {
        url: '/emergency-contacts.json',
        type: 'json',
        priority: 'critical'
      },
      {
        url: '/offline-crisis-guide.html',
        type: 'html',
        priority: 'critical'
      },
      {
        url: '/crisis-breathing-exercises.json',
        type: 'json',
        priority: 'high'
      },
      {
        url: '/crisis-grounding-techniques.json',
        type: 'json',
        priority: 'high'
      },
      {
        url: '/safety-planning-template.json',
        type: 'json',
        priority: 'medium'
      }
    ];

    // Preload critical resources first
    const criticalPromises = criticalResources
      .filter(resource => resource.priority === 'critical')
      .map(resource => this.cacheResource(resource));

    await Promise.all(criticalPromises);

    // Preload high priority resources if network allows
    if (this.isOnline && !this.isSlowConnection()) {
      const highPriorityPromises = criticalResources
        .filter(resource => resource.priority === 'high')
        .map(resource => this.cacheResource(resource));

      await Promise.all(highPriorityPromises);
    }
  }

  /**
   * Cache a crisis resource
   */
  private async cacheResource(resource: CrisisResource): Promise<void> {
    try {
      const response = await fetch(resource.url, {
        cache: 'force-cache',
        priority: 'high' as any
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${resource.url}: ${response.status}`);
      }

      let content;
      switch (resource.type) {
        case 'json':
          content = await response.json();
          break;
        case 'html':
        case 'text':
          content = await response.text();
          break;
        default:
          content = await response.blob();
      }

      const cachedResource: CrisisResource = {
        ...resource,
        content,
        lastUpdated: Date.now(),
        expiresAt: Date.now() + (this.config.cacheExpiration * 60 * 60 * 1000)
      };

      this.cache.set(resource.url, cachedResource);
      
      // Store in localStorage for persistence
      this.persistResource(resource.url, cachedResource);

    } catch (error) {
      console.warn(`Failed to cache crisis resource ${resource.url}:`, error);
    }
  }

  /**
   * Cache emergency contacts
   */
  private async cacheEmergencyContacts(): Promise<void> {
    const emergencyContacts: EmergencyContact[] = [
      {
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        type: 'crisis',
        description: 'Free and confidential emotional support 24/7',
        available24h: true
      },
      {
        name: 'Emergency Services',
        number: '911',
        type: 'emergency',
        description: 'Medical, fire, and police emergencies',
        available24h: true
      },
      {
        name: 'Crisis Text Line',
        number: '741741',
        type: 'text',
        description: 'Text HOME to 741741 for crisis support',
        available24h: true
      },
      {
        name: 'National Domestic Violence Hotline',
        number: '1-800-799-7233',
        type: 'crisis',
        description: '24/7 confidential support for domestic violence',
        available24h: true
      },
      {
        name: 'Trans Lifeline',
        number: '877-565-8860',
        type: 'crisis',
        description: 'Crisis support for transgender people',
        available24h: true
      },
      {
        name: 'LGBTQ National Hotline',
        number: '1-888-843-4564',
        type: 'crisis',
        description: 'Support for LGBTQ+ individuals',
        available24h: false
      }
    ];

    try {
      localStorage.setItem('alchm_emergency_contacts', JSON.stringify({
        contacts: emergencyContacts,
        lastUpdated: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache emergency contacts:', error);
    }
  }

  /**
   * Get emergency contacts (from cache if offline)
   */
  public getEmergencyContacts(): EmergencyContact[] {
    try {
      const cached = localStorage.getItem('alchm_emergency_contacts');
      if (cached) {
        const data = JSON.parse(cached);
        return data.contacts || [];
      }
    } catch (error) {
      console.warn('Failed to load emergency contacts:', error);
    }

    // Fallback emergency contacts
    return [
      {
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        type: 'crisis',
        description: 'Free and confidential emotional support 24/7',
        available24h: true
      },
      {
        name: 'Emergency Services',
        number: '911',
        type: 'emergency',
        description: 'Medical, fire, and police emergencies',
        available24h: true
      }
    ];
  }

  /**
   * Get a cached resource
   */
  public async getResource(url: string): Promise<CrisisResource | null> {
    // Try cache first
    const cached = this.cache.get(url);
    if (cached && !this.isResourceExpired(cached)) {
      return cached;
    }

    // Try localStorage
    const persisted = this.getPersistedResource(url);
    if (persisted && !this.isResourceExpired(persisted)) {
      this.cache.set(url, persisted);
      return persisted;
    }

    // If online, try to fetch fresh
    if (this.isOnline) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const content = await response.text();
          const resource: CrisisResource = {
            url,
            type: 'text',
            priority: 'medium',
            content,
            lastUpdated: Date.now(),
            expiresAt: Date.now() + (this.config.cacheExpiration * 60 * 60 * 1000)
          };
          
          this.cache.set(url, resource);
          this.persistResource(url, resource);
          return resource;
        }
      } catch (error) {
        console.warn(`Failed to fetch resource ${url}:`, error);
      }
    }

    return null;
  }

  /**
   * Check if device has offline crisis resources
   */
  public hasOfflineResources(): boolean {
    try {
      const emergencyContacts = localStorage.getItem('alchm_emergency_contacts');
      const cachedResources = localStorage.getItem('alchm_crisis_cache');
      return !!(emergencyContacts && cachedResources);
    } catch {
      return false;
    }
  }

  /**
   * Enable crisis-only mode for slow connections
   */
  private enableCrisisOnlyMode(): void {
    document.body.classList.add('crisis-only-mode');
    
    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('crisisOnlyModeEnabled', {
      detail: { reason: 'slow-connection' }
    }));
  }

  /**
   * Check if connection is slow
   */
  private isSlowConnection(): boolean {
    const connection = (navigator as any).connection;
    return connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      (connection.downlink && connection.downlink < 1)
    );
  }

  /**
   * Persist resource to localStorage
   */
  private persistResource(url: string, resource: CrisisResource): void {
    try {
      const cache = this.getPersistedCache();
      cache[url] = resource;
      localStorage.setItem('alchm_crisis_cache', JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to persist crisis resource:', error);
    }
  }

  /**
   * Get persisted resource from localStorage
   */
  private getPersistedResource(url: string): CrisisResource | null {
    try {
      const cache = this.getPersistedCache();
      return cache[url] || null;
    } catch {
      return null;
    }
  }

  /**
   * Get persisted cache from localStorage
   */
  private getPersistedCache(): Record<string, CrisisResource> {
    try {
      const cached = localStorage.getItem('alchm_crisis_cache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }

  /**
   * Check if resource is expired
   */
  private isResourceExpired(resource: CrisisResource): boolean {
    return !resource.expiresAt || Date.now() > resource.expiresAt;
  }

  /**
   * Load cached resources from localStorage
   */
  private async loadCachedResources(): Promise<void> {
    try {
      const cache = this.getPersistedCache();
      for (const [url, resource] of Object.entries(cache)) {
        if (!this.isResourceExpired(resource)) {
          this.cache.set(url, resource);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached resources:', error);
    }
  }

  /**
   * Validate that offline resources are available
   */
  private validateOfflineResources(): void {
    const hasEmergencyContacts = !!localStorage.getItem('alchm_emergency_contacts');
    const hasCachedResources = this.cache.size > 0;

    if (!hasEmergencyContacts || !hasCachedResources) {
      console.warn('Offline crisis resources may be incomplete');
      // Try to use fallback resources
      this.setupBasicOfflineSupport();
    }
  }

  /**
   * Set up basic offline support as fallback
   */
  private setupBasicOfflineSupport(): void {
    // Ensure emergency contacts are always available
    if (!localStorage.getItem('alchm_emergency_contacts')) {
      this.cacheEmergencyContacts();
    }

    // Create minimal offline crisis guide
    const offlineGuide = `
      <h1>Crisis Support - Offline Mode</h1>
      <p>You are currently offline, but help is still available:</p>
      <ul>
        <li><strong>Call 988</strong> - National Suicide Prevention Lifeline</li>
        <li><strong>Call 911</strong> - Emergency Services</li>
        <li><strong>Text HOME to 741741</strong> - Crisis Text Line</li>
      </ul>
      <h2>Immediate Coping Strategies:</h2>
      <ol>
        <li>Take slow, deep breaths</li>
        <li>Name 5 things you can see, 4 you can hear, 3 you can touch</li>
        <li>Call someone you trust</li>
        <li>Go to a safe place</li>
      </ol>
    `;

    try {
      localStorage.setItem('alchm_offline_crisis_guide', offlineGuide);
    } catch {
      // Storage not available - emergency contacts will still work
    }
  }

  /**
   * Process sync queue when back online
   */
  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const url = this.syncQueue.shift();
      if (url) {
        try {
          await this.cacheResource({ url, type: 'text', priority: 'medium' });
        } catch (error) {
          console.warn(`Failed to sync resource ${url}:`, error);
        }
      }
    }
  }

  /**
   * Refresh critical resources when back online
   */
  private async refreshCriticalResources(): Promise<void> {
    const criticalUrls = [
      '/crisis-hotlines.json',
      '/emergency-contacts.json'
    ];

    for (const url of criticalUrls) {
      try {
        await this.cacheResource({ url, type: 'json', priority: 'critical' });
      } catch (error) {
        console.warn(`Failed to refresh critical resource ${url}:`, error);
      }
    }
  }

  /**
   * Set up background sync
   */
  private setupBackgroundSync(): void {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('crisis-resources-sync');
      });
    }
  }

  /**
   * Get offline status
   */
  public isOffline(): boolean {
    return !this.isOnline;
  }

  /**
   * Get cached resource count
   */
  public getCachedResourceCount(): number {
    return this.cache.size;
  }

  /**
   * Clear expired resources
   */
  public clearExpiredResources(): void {
    for (const [url, resource] of this.cache.entries()) {
      if (this.isResourceExpired(resource)) {
        this.cache.delete(url);
      }
    }

    // Update localStorage
    try {
      const cache = this.getPersistedCache();
      const filteredCache: Record<string, CrisisResource> = {};
      
      for (const [url, resource] of Object.entries(cache)) {
        if (!this.isResourceExpired(resource)) {
          filteredCache[url] = resource;
        }
      }
      
      localStorage.setItem('alchm_crisis_cache', JSON.stringify(filteredCache));
    } catch (error) {
      console.warn('Failed to clear expired resources:', error);
    }
  }
}

// Create global instance
let _crisisOfflineManager: MobileCrisisOfflineManager | null = null;

/**
 * Get the crisis offline manager instance
 */
export function getCrisisOfflineManager(): MobileCrisisOfflineManager {
  if (!_crisisOfflineManager && typeof window !== 'undefined') {
    _crisisOfflineManager = new MobileCrisisOfflineManager();
  }
  return _crisisOfflineManager!;
}

/**
 * React hook for offline crisis support
 */
export function useOfflineCrisisSupport() {
  const manager = getCrisisOfflineManager();
  
  return {
    isOffline: manager?.isOffline(),
    hasOfflineResources: manager?.hasOfflineResources(),
    getEmergencyContacts: () => manager?.getEmergencyContacts() || [],
    getResource: (url: string) => manager?.getResource(url),
    cachedResourceCount: manager?.getCachedResourceCount() || 0
  };
}

export default MobileCrisisOfflineManager;