// ALCHM Crisis Resource Cache Manager
// Ensures crisis resources are available within <3 seconds during emergencies
// Trauma-informed design with offline capability and battery optimization

interface CrisisResource {
  id: string;
  type: 'hotline' | 'technique' | 'audio' | 'video' | 'text';
  content: string | Blob;
  priority: 'critical' | 'high' | 'medium';
  lastUpdated: number;
  size: number;
  language?: string;
  region?: string;
}

interface CacheMetrics {
  totalSize: number;
  resourceCount: number;
  lastCacheUpdate: number;
  hitRate: number;
  averageLoadTime: number;
  batteryLevel?: number;
  connectionType?: string;
}

class CrisisResourceCacheManager {
  private dbName = 'alchm_crisis_cache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private maxCacheSize = 50 * 1024 * 1024; // 50MB max for crisis resources
  private criticalResourceTTL = 24 * 60 * 60 * 1000; // 24 hours
  private metrics: CacheMetrics = {
    totalSize: 0,
    resourceCount: 0,
    lastCacheUpdate: 0,
    hitRate: 0,
    averageLoadTime: 0
  };

  constructor() {
    this.initializeDatabase();
    this.monitorBatteryAndNetwork();
  }

  // Initialize IndexedDB with crisis-optimized structure
  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('[Crisis Cache] Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[Crisis Cache] Database initialized successfully');
        this.preloadCriticalResources();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crisis resources store
        if (!db.objectStoreNames.contains('crisis_resources')) {
          const resourceStore = db.createObjectStore('crisis_resources', { keyPath: 'id' });
          resourceStore.createIndex('type', 'type', { unique: false });
          resourceStore.createIndex('priority', 'priority', { unique: false });
          resourceStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
          resourceStore.createIndex('language', 'language', { unique: false });
          resourceStore.createIndex('region', 'region', { unique: false });
        }

        // Cache metadata store
        if (!db.objectStoreNames.contains('cache_metadata')) {
          db.createObjectStore('cache_metadata', { keyPath: 'key' });
        }

        // Performance metrics store
        if (!db.objectStoreNames.contains('performance_metrics')) {
          const metricsStore = db.createObjectStore('performance_metrics', { keyPath: 'timestamp' });
          metricsStore.createIndex('loadTime', 'loadTime', { unique: false });
          metricsStore.createIndex('resourceType', 'resourceType', { unique: false });
        }
      };
    });
  }

  // Preload critical crisis resources immediately
  private async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      {
        id: 'crisis-hotlines-us',
        type: 'hotline' as const,
        content: JSON.stringify({
          suicide_prevention: { phone: '988', name: 'National Suicide Prevention Lifeline' },
          crisis_text: { text: 'HOME to 741741', name: 'Crisis Text Line' },
          emergency: { phone: '911', name: 'Emergency Services' }
        }),
        priority: 'critical' as const,
        region: 'us'
      },
      {
        id: 'grounding-54321',
        type: 'technique' as const,
        content: JSON.stringify({
          name: '54321 Grounding Technique',
          steps: [
            'Name 5 things you can see',
            'Name 4 things you can touch',
            'Name 3 things you can hear',
            'Name 2 things you can smell',
            'Name 1 thing you can taste'
          ],
          duration: '2-5 minutes'
        }),
        priority: 'critical' as const
      },
      {
        id: 'box-breathing',
        type: 'technique' as const,
        content: JSON.stringify({
          name: 'Box Breathing',
          steps: [
            'Breathe in slowly for 4 counts',
            'Hold your breath for 4 counts',
            'Breathe out slowly for 4 counts',
            'Hold empty for 4 counts'
          ],
          duration: '2-4 minutes'
        }),
        priority: 'critical' as const
      }
    ];

    for (const resource of criticalResources) {
      await this.cacheResource(resource);
    }
  }

  // Cache a crisis resource with trauma-informed optimization
  async cacheResource(resource: Omit<CrisisResource, 'lastUpdated' | 'size'>): Promise<void> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    const startTime = performance.now();
    
    try {
      const resourceWithMeta: CrisisResource = {
        ...resource,
        lastUpdated: Date.now(),
        size: this.calculateResourceSize(resource.content)
      };

      // Check cache size limits before adding
      await this.enforceStorageLimits();

      const transaction = this.db!.transaction(['crisis_resources'], 'readwrite');
      const store = transaction.objectStore('crisis_resources');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(resourceWithMeta);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Update metrics
      await this.updateMetrics(performance.now() - startTime, resource.type);
      
      console.log(`[Crisis Cache] Cached ${resource.type} resource: ${resource.id}`);
    } catch (error) {
      console.error('[Crisis Cache] Failed to cache resource:', error);
      throw error;
    }
  }

  // Retrieve crisis resource with <1s target for critical resources
  async getResource(id: string): Promise<CrisisResource | null> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    const startTime = performance.now();

    try {
      const transaction = this.db!.transaction(['crisis_resources'], 'readonly');
      const store = transaction.objectStore('crisis_resources');

      const resource = await new Promise<CrisisResource | null>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      // Update hit rate metrics
      const loadTime = performance.now() - startTime;
      await this.updateHitMetrics(!!resource, loadTime);

      // Check if resource is still valid
      if (resource && this.isResourceValid(resource)) {
        return resource;
      }

      return null;
    } catch (error) {
      console.error('[Crisis Cache] Failed to retrieve resource:', error);
      return null;
    }
  }

  // Get resources by type with priority sorting
  async getResourcesByType(type: CrisisResource['type'], region?: string): Promise<CrisisResource[]> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    try {
      const transaction = this.db!.transaction(['crisis_resources'], 'readonly');
      const store = transaction.objectStore('crisis_resources');
      const index = store.index('type');

      const resources = await new Promise<CrisisResource[]>((resolve, reject) => {
        const request = index.getAll(type);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      // Filter by region if specified and sort by priority
      return resources
        .filter(resource => !region || resource.region === region)
        .filter(resource => this.isResourceValid(resource))
        .sort((a, b) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    } catch (error) {
      console.error('[Crisis Cache] Failed to get resources by type:', error);
      return [];
    }
  }

  // Cache crisis resources from the JSON file
  async cacheCrisisResourcesFromJSON(): Promise<void> {
    try {
      const response = await fetch('/crisis-resources.json');
      const crisisData = await response.json();

      // Cache immediate hotlines
      for (const [region, hotlines] of Object.entries(crisisData.immediate)) {
        await this.cacheResource({
          id: `hotlines-${region}`,
          type: 'hotline',
          content: JSON.stringify(hotlines),
          priority: 'critical',
          region: region as string
        });
      }

      // Cache specialized resources
      for (const [category, resource] of Object.entries(crisisData.specialized)) {
        await this.cacheResource({
          id: `specialized-${category}`,
          type: 'hotline',
          content: JSON.stringify(resource),
          priority: 'high'
        });
      }

      // Cache grounding techniques
      for (const technique of crisisData.immediate_techniques) {
        await this.cacheResource({
          id: `technique-${technique.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'technique',
          content: JSON.stringify(technique),
          priority: technique.category === 'grounding' ? 'critical' : 'high'
        });
      }

      console.log('[Crisis Cache] Successfully cached all crisis resources');
    } catch (error) {
      console.error('[Crisis Cache] Failed to cache crisis resources from JSON:', error);
    }
  }

  // Clear expired resources and enforce storage limits
  private async enforceStorageLimits(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['crisis_resources'], 'readwrite');
      const store = transaction.objectStore('crisis_resources');

      // Get all resources
      const allResources = await new Promise<CrisisResource[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      let totalSize = allResources.reduce((sum, resource) => sum + resource.size, 0);

      // Remove expired resources first
      const now = Date.now();
      const expiredResources = allResources.filter(resource => 
        now - resource.lastUpdated > this.criticalResourceTTL && resource.priority !== 'critical'
      );

      for (const resource of expiredResources) {
        await new Promise<void>((resolve, reject) => {
          const deleteRequest = store.delete(resource.id);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
        totalSize -= resource.size;
      }

      // If still over limit, remove oldest non-critical resources
      if (totalSize > this.maxCacheSize) {
        const nonCritical = allResources
          .filter(resource => resource.priority !== 'critical')
          .sort((a, b) => a.lastUpdated - b.lastUpdated);

        for (const resource of nonCritical) {
          if (totalSize <= this.maxCacheSize) break;
          
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(resource.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
          totalSize -= resource.size;
        }
      }

      // Update metrics
      this.metrics.totalSize = totalSize;
      this.metrics.resourceCount = allResources.length - expiredResources.length;
    } catch (error) {
      console.error('[Crisis Cache] Failed to enforce storage limits:', error);
    }
  }

  // Monitor battery and network for adaptive caching
  private monitorBatteryAndNetwork(): void {
    // Battery monitoring
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.metrics.batteryLevel = battery.level;
        
        battery.addEventListener('levelchange', () => {
          this.metrics.batteryLevel = battery.level;
          this.adaptCachingStrategy();
        });
      });
    }

    // Network monitoring
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionType = connection.effectiveType;
      
      connection.addEventListener('change', () => {
        this.metrics.connectionType = connection.effectiveType;
        this.adaptCachingStrategy();
      });
    }
  }

  // Adapt caching strategy based on device conditions
  private adaptCachingStrategy(): void {
    const isLowBattery = this.metrics.batteryLevel && this.metrics.batteryLevel < 0.2;
    const isSlowConnection = this.metrics.connectionType && 
      ['slow-2g', '2g'].includes(this.metrics.connectionType);

    if (isLowBattery || isSlowConnection) {
      // Reduce max cache size for resource conservation
      this.maxCacheSize = 25 * 1024 * 1024; // 25MB
      console.log('[Crisis Cache] Adapted to low resource mode');
    } else {
      // Normal cache size
      this.maxCacheSize = 50 * 1024 * 1024; // 50MB
    }
  }

  // Helper functions
  private calculateResourceSize(content: string | Blob): number {
    if (typeof content === 'string') {
      return new Blob([content]).size;
    }
    return content.size;
  }

  private isResourceValid(resource: CrisisResource): boolean {
    const now = Date.now();
    const maxAge = resource.priority === 'critical' ? this.criticalResourceTTL : this.criticalResourceTTL / 2;
    return now - resource.lastUpdated < maxAge;
  }

  private async updateMetrics(loadTime: number, resourceType: string): Promise<void> {
    this.metrics.averageLoadTime = 
      (this.metrics.averageLoadTime + loadTime) / 2;

    // Store performance metric for analysis
    if (this.db) {
      const transaction = this.db.transaction(['performance_metrics'], 'readwrite');
      const store = transaction.objectStore('performance_metrics');
      
      store.add({
        timestamp: Date.now(),
        loadTime,
        resourceType,
        batteryLevel: this.metrics.batteryLevel,
        connectionType: this.metrics.connectionType
      }).catch(() => {}); // Ignore errors for metrics
    }
  }

  private async updateHitMetrics(isHit: boolean, loadTime: number): Promise<void> {
    const currentHits = this.metrics.hitRate * this.metrics.resourceCount;
    const newHits = isHit ? currentHits + 1 : currentHits;
    this.metrics.resourceCount += 1;
    this.metrics.hitRate = newHits / this.metrics.resourceCount;
    
    await this.updateMetrics(loadTime, 'retrieval');
  }

  // Public API for getting cache status
  getCacheMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  // Emergency cache clear for crisis situations
  async emergencyCacheClear(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['crisis_resources'], 'readwrite');
      const store = transaction.objectStore('crisis_resources');
      
      // Clear all non-critical resources
      const allResources = await new Promise<CrisisResource[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      for (const resource of allResources) {
        if (resource.priority !== 'critical') {
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(resource.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        }
      }

      console.log('[Crisis Cache] Emergency cache clear completed');
    } catch (error) {
      console.error('[Crisis Cache] Emergency cache clear failed:', error);
    }
  }
}

// Global instance for crisis cache management
export const crisisResourceCache = new CrisisResourceCacheManager();

// Export for crisis-aware components
export { CrisisResourceCacheManager, type CrisisResource, type CacheMetrics };