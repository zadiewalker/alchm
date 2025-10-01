/**
 * ALCHM Critical Resource Optimization System
 * Ensures fastest possible loading for crisis-critical resources
 * 
 * Priority Order:
 * 1. Crisis button (life-saving)
 * 2. Emergency contacts
 * 3. Core authentication
 * 4. Journal functionality
 * 5. Secondary features
 */

export interface CriticalResource {
  url: string;
  type: 'script' | 'style' | 'image' | 'font' | 'data';
  priority: 'crisis' | 'high' | 'normal' | 'low';
  preload: boolean;
  prefetch: boolean;
  crossOrigin?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export class CriticalResourceManager {
  private static instance: CriticalResourceManager;
  private loadedResources = new Set<string>();
  private failedResources = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();
  
  // Crisis-critical resources that must load immediately
  private readonly crisisResources: CriticalResource[] = [
    {
      url: '/api/crisis-support',
      type: 'data',
      priority: 'crisis',
      preload: true,
      prefetch: false,
      fetchPriority: 'high'
    },
    {
      url: '/styles/crisis-core.css',
      type: 'style',
      priority: 'crisis',
      preload: true,
      prefetch: false,
      fetchPriority: 'high'
    },
    {
      url: '/scripts/crisis-button.js',
      type: 'script',
      priority: 'crisis',
      preload: true,
      prefetch: false,
      fetchPriority: 'high'
    }
  ];

  // High-priority resources for core functionality
  private readonly highPriorityResources: CriticalResource[] = [
    {
      url: '/styles/critical.css',
      type: 'style',
      priority: 'high',
      preload: true,
      prefetch: false,
      fetchPriority: 'high'
    },
    {
      url: '/api/auth/session',
      type: 'data',
      priority: 'high',
      preload: true,
      prefetch: false,
      fetchPriority: 'high'
    },
    {
      url: '/fonts/system-ui.woff2',
      type: 'font',
      priority: 'high',
      preload: true,
      prefetch: false,
      crossOrigin: true,
      fetchPriority: 'high'
    }
  ];

  static getInstance(): CriticalResourceManager {
    if (!this.instance) {
      this.instance = new CriticalResourceManager();
    }
    return this.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeResourceOptimization();
    }
  }

  private initializeResourceOptimization() {
    // Preload crisis resources immediately
    this.preloadCrisisResources();
    
    // Set up intelligent prefetching
    this.setupIntelligentPrefetching();
    
    // Monitor resource loading performance
    this.monitorResourcePerformance();
    
    // Handle visibility change for resource prioritization
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.optimizeForVisibleState();
      }
    });
  }

  private preloadCrisisResources() {
    console.log('🚨 Preloading crisis-critical resources...');
    
    this.crisisResources.forEach(resource => {
      this.preloadResource(resource);
    });

    // Preload high-priority resources with slight delay
    setTimeout(() => {
      this.highPriorityResources.forEach(resource => {
        this.preloadResource(resource);
      });
    }, 50); // 50ms delay to prioritize crisis resources
  }

  private preloadResource(resource: CriticalResource): Promise<void> {
    if (this.loadedResources.has(resource.url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(resource.url)) {
      return this.loadingPromises.get(resource.url)!;
    }

    const promise = this.createPreloadPromise(resource);
    this.loadingPromises.set(resource.url, promise);
    
    return promise;
  }

  private createPreloadPromise(resource: CriticalResource): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      
      if (resource.type === 'style') {
        this.preloadStylesheet(resource, startTime, resolve, reject);
      } else if (resource.type === 'script') {
        this.preloadScript(resource, startTime, resolve, reject);
      } else if (resource.type === 'font') {
        this.preloadFont(resource, startTime, resolve, reject);
      } else if (resource.type === 'image') {
        this.preloadImage(resource, startTime, resolve, reject);
      } else if (resource.type === 'data') {
        this.preloadData(resource, startTime, resolve, reject);
      } else {
        this.preloadGeneric(resource, startTime, resolve, reject);
      }
    });
  }

  private preloadStylesheet(resource: CriticalResource, startTime: number, resolve: Function, reject: Function) {
    const link = document.createElement('link');
    link.rel = resource.preload ? 'preload' : 'prefetch';
    link.href = resource.url;
    link.as = 'style';
    if (resource.fetchPriority) {
      link.setAttribute('fetchpriority', resource.fetchPriority);
    }
    
    link.onload = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'success');
      this.loadedResources.add(resource.url);
      resolve();
    };
    
    link.onerror = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'error');
      this.failedResources.add(resource.url);
      reject(new Error(`Failed to load stylesheet: ${resource.url}`));
    };
    
    document.head.appendChild(link);
  }

  private preloadScript(resource: CriticalResource, startTime: number, resolve: Function, reject: Function) {
    const link = document.createElement('link');
    link.rel = resource.preload ? 'preload' : 'prefetch';
    link.href = resource.url;
    link.as = 'script';
    if (resource.crossOrigin) {
      link.crossOrigin = 'anonymous';
    }
    if (resource.fetchPriority) {
      link.setAttribute('fetchpriority', resource.fetchPriority);
    }
    
    link.onload = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'success');
      this.loadedResources.add(resource.url);
      resolve();
    };
    
    link.onerror = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'error');
      this.failedResources.add(resource.url);
      reject(new Error(`Failed to load script: ${resource.url}`));
    };
    
    document.head.appendChild(link);
  }

  private preloadFont(resource: CriticalResource, startTime: number, resolve: Function, reject: Function) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    if (resource.fetchPriority) {
      link.setAttribute('fetchpriority', resource.fetchPriority);
    }
    
    link.onload = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'success');
      this.loadedResources.add(resource.url);
      resolve();
    };
    
    link.onerror = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'error');
      this.failedResources.add(resource.url);
      reject(new Error(`Failed to load font: ${resource.url}`));
    };
    
    document.head.appendChild(link);
  }

  private preloadImage(resource: CriticalResource, startTime: number, resolve: Function, reject: Function) {
    const img = new Image();
    if (resource.fetchPriority) {
      img.setAttribute('fetchpriority', resource.fetchPriority);
    }
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'success');
      this.loadedResources.add(resource.url);
      resolve();
    };
    
    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'error');
      this.failedResources.add(resource.url);
      reject(new Error(`Failed to load image: ${resource.url}`));
    };
    
    img.src = resource.url;
  }

  private async preloadData(resource: CriticalResource, startTime: number, resolve: Function, reject: Function) {
    try {
      const response = await fetch(resource.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        priority: resource.fetchPriority || 'auto'
      } as any);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const loadTime = performance.now() - startTime;
      
      this.recordResourceLoad(resource.url, loadTime, 'success');
      this.loadedResources.add(resource.url);
      
      // Cache the data for immediate access
      this.cacheResourceData(resource.url, data);
      
      resolve();
    } catch (error) {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'error');
      this.failedResources.add(resource.url);
      reject(error);
    }
  }

  private preloadGeneric(resource: CriticalResource, startTime: number, resolve: Function, reject: Function) {
    const link = document.createElement('link');
    link.rel = resource.preload ? 'preload' : 'prefetch';
    link.href = resource.url;
    if (resource.fetchPriority) {
      link.setAttribute('fetchpriority', resource.fetchPriority);
    }
    
    link.onload = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'success');
      this.loadedResources.add(resource.url);
      resolve();
    };
    
    link.onerror = () => {
      const loadTime = performance.now() - startTime;
      this.recordResourceLoad(resource.url, loadTime, 'error');
      this.failedResources.add(resource.url);
      reject(new Error(`Failed to load resource: ${resource.url}`));
    };
    
    document.head.appendChild(link);
  }

  private recordResourceLoad(url: string, loadTime: number, status: 'success' | 'error') {
    const priority = this.getResourcePriority(url);
    
    if (priority === 'crisis' && status === 'error') {
      console.error(`🚨 CRITICAL: Crisis resource failed to load: ${url} (${loadTime.toFixed(2)}ms)`);
    } else if (priority === 'crisis' && loadTime > 500) {
      console.warn(`⚠️ Crisis resource slow to load: ${url} (${loadTime.toFixed(2)}ms)`);
    }

    // Send to monitoring API
    this.sendResourceMetrics(url, loadTime, status, priority);
  }

  private getResourcePriority(url: string): string {
    const crisisResource = this.crisisResources.find(r => r.url === url);
    if (crisisResource) return 'crisis';
    
    const highPriorityResource = this.highPriorityResources.find(r => r.url === url);
    if (highPriorityResource) return 'high';
    
    return 'normal';
  }

  private async sendResourceMetrics(url: string, loadTime: number, status: string, priority: string) {
    try {
      await fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'resource_load',
          url,
          loadTime,
          status,
          priority,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      // Silent fail for monitoring
    }
  }

  private cacheResourceData(url: string, data: any) {
    if ('caches' in window) {
      caches.open('alchm-critical-data').then(cache => {
        const response = new Response(JSON.stringify(data));
        cache.put(url, response);
      });
    }
  }

  private setupIntelligentPrefetching() {
    // Prefetch resources based on user behavior patterns
    this.observeUserInteractions();
    
    // Prefetch on idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.prefetchSecondaryResources();
      });
    }
  }

  private observeUserInteractions() {
    // Track mouse movements near critical elements
    const crisisButton = document.querySelector('[data-crisis-button]');
    if (crisisButton) {
      crisisButton.addEventListener('mouseenter', () => {
        this.preloadCrisisModal();
      });
    }

    // Track form focus events
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea')) {
        this.preloadJournalResources();
      }
    });
  }

  private async preloadCrisisModal() {
    const crisisModalResources = [
      '/api/crisis-resources',
      '/components/crisis-modal.js',
      '/styles/crisis-modal.css'
    ];

    crisisModalResources.forEach(url => {
      this.preloadResource({
        url,
        type: 'data',
        priority: 'crisis',
        preload: true,
        prefetch: false,
        fetchPriority: 'high'
      });
    });
  }

  private async preloadJournalResources() {
    const journalResources = [
      '/api/journal/templates',
      '/components/journal-editor.js',
      '/styles/journal-editor.css'
    ];

    journalResources.forEach(url => {
      this.preloadResource({
        url,
        type: 'data',
        priority: 'high',
        preload: true,
        prefetch: false,
        fetchPriority: 'high'
      });
    });
  }

  private prefetchSecondaryResources() {
    const secondaryResources = [
      '/api/user/preferences',
      '/components/dashboard.js',
      '/styles/dashboard.css'
    ];

    secondaryResources.forEach(url => {
      this.preloadResource({
        url,
        type: 'data',
        priority: 'normal',
        preload: false,
        prefetch: true,
        fetchPriority: 'low'
      });
    });
  }

  private monitorResourcePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.analyzeResourceTiming(resourceEntry);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming) {
    const priority = this.getResourcePriority(entry.name);
    const loadTime = entry.responseEnd - entry.startTime;
    
    if (priority === 'crisis' && loadTime > 500) {
      console.warn(`🚨 Crisis resource performance degradation: ${entry.name} (${loadTime.toFixed(2)}ms)`);
      this.triggerPerformanceAlert(entry.name, loadTime, 'crisis');
    }
  }

  private async triggerPerformanceAlert(url: string, loadTime: number, priority: string) {
    try {
      await fetch('/api/monitoring/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: 'resourceLoadTime',
          value: loadTime,
          threshold: priority === 'crisis' ? 500 : 1000,
          url,
          priority,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to send performance alert:', error);
    }
  }

  private optimizeForVisibleState() {
    // Re-prioritize resources when page becomes visible
    this.preloadCrisisResources();
  }

  // Public methods
  isResourceLoaded(url: string): boolean {
    return this.loadedResources.has(url);
  }

  isResourceFailed(url: string): boolean {
    return this.failedResources.has(url);
  }

  getLoadedResources(): string[] {
    return Array.from(this.loadedResources);
  }

  getFailedResources(): string[] {
    return Array.from(this.failedResources);
  }

  // Emergency mode - load only crisis resources
  enableEmergencyMode() {
    console.log('🚨 EMERGENCY MODE ACTIVATED - Loading crisis resources only');
    
    // Cancel non-critical resource loading
    this.loadingPromises.forEach((promise, url) => {
      const priority = this.getResourcePriority(url);
      if (priority !== 'crisis') {
        // Cancel the request if possible
      }
    });

    // Force load crisis resources
    this.preloadCrisisResources();
  }
}

// Export singleton instance
export const criticalResourceManager = CriticalResourceManager.getInstance();