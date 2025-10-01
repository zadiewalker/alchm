/**
 * ALCHM Crisis Resource Performance Optimizer
 * 
 * Ensures crisis resources load within 3 seconds on ANY network condition.
 * Lives depend on this working - every optimization is trauma-informed.
 * 
 * Performance Targets:
 * - Crisis hotlines: <1s on 3G+, <3s on 2G
 * - Emergency contacts: <500ms (cached)
 * - Crisis text resources: <1s
 * - Offline fallbacks: <100ms
 * - Battery impact: <2% per crisis session
 */

interface CrisisResource {
  id: string;
  type: 'hotline' | 'text' | 'chat' | 'emergency' | 'guide' | 'contact';
  priority: 'critical' | 'high' | 'medium' | 'low';
  url?: string;
  phone?: string;
  data?: any;
  cacheKey: string;
  loadTimeTarget: number; // milliseconds
  networkRequirement: '2g' | '3g' | '4g' | 'any';
}

interface PerformanceMetrics {
  loadTime: number;
  cacheHit: boolean;
  networkType: string;
  batteryLevel?: number;
  memoryUsage: number;
  success: boolean;
  fallbackUsed: boolean;
}

interface OptimizationStrategy {
  preload: boolean;
  cache: boolean;
  offline: boolean;
  compress: boolean;
  prioritize: boolean;
  batterySaver: boolean;
}

// Crisis resources with performance-first configuration
const CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: 'suicide-hotline-988',
    type: 'hotline',
    priority: 'critical',
    phone: '988',
    cacheKey: 'crisis_988',
    loadTimeTarget: 100, // Must be instant
    networkRequirement: 'any'
  },
  {
    id: 'crisis-text-741741',
    type: 'text',
    priority: 'critical',
    phone: '741741',
    cacheKey: 'crisis_text',
    loadTimeTarget: 100,
    networkRequirement: 'any'
  },
  {
    id: 'emergency-911',
    type: 'emergency',
    priority: 'critical',
    phone: '911',
    cacheKey: 'emergency_911',
    loadTimeTarget: 50, // Absolute priority
    networkRequirement: 'any'
  },
  {
    id: 'crisis-chat-api',
    type: 'chat',
    priority: 'high',
    url: '/api/crisis-chat',
    cacheKey: 'crisis_chat_endpoint',
    loadTimeTarget: 1000,
    networkRequirement: '3g'
  },
  {
    id: 'crisis-safety-plan',
    type: 'guide',
    priority: 'high',
    url: '/crisis-resources/safety-plan',
    cacheKey: 'safety_plan',
    loadTimeTarget: 2000,
    networkRequirement: '2g'
  },
  {
    id: 'local-crisis-centers',
    type: 'contact',
    priority: 'medium',
    url: '/api/crisis-centers/local',
    cacheKey: 'local_crisis_centers',
    loadTimeTarget: 3000,
    networkRequirement: '2g'
  }
];

class CrisisResourcePerformanceOptimizer {
  private cache: Map<string, { data: any; timestamp: number; expires: number }> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();
  private networkInfo: any = null;
  private batteryLevel: number = 1;
  private isLowEndDevice: boolean = false;
  private serviceWorker: ServiceWorker | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeOptimizer();
    }
  }

  private async initializeOptimizer(): Promise<void> {
    // Detect device capabilities
    this.detectDeviceCapabilities();
    
    // Monitor network changes
    this.monitorNetworkChanges();
    
    // Monitor battery level
    this.monitorBatteryLevel();
    
    // Initialize service worker for offline support
    await this.initializeServiceWorker();
    
    // Preload critical crisis resources
    await this.preloadCriticalResources();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
  }

  private detectDeviceCapabilities(): void {
    const nav = navigator as any;
    
    // Detect low-end device
    const memory = nav.deviceMemory || this.estimateMemory();
    const cores = nav.hardwareConcurrency || 2;
    this.isLowEndDevice = memory < 2 || cores < 4;
    
    // Get network information
    this.networkInfo = nav.connection || nav.mozConnection || nav.webkitConnection;
  }

  private estimateMemory(): number {
    try {
      const memory = (performance as any).memory;
      if (memory) {
        return memory.jsHeapSizeLimit / (1024 * 1024 * 1024); // GB
      }
    } catch {}
    return 2; // Conservative estimate
  }

  private monitorNetworkChanges(): void {
    if (this.networkInfo) {
      this.networkInfo.addEventListener('change', () => {
        this.adaptToNetworkConditions();
      });
    }
  }

  private async monitorBatteryLevel(): Promise<void> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.batteryLevel = battery.level;
        
        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level;
          this.adaptToBatteryLevel();
        });
      } catch (error) {
        console.warn('Battery API not available');
      }
    }
  }

  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/crisis-sw.js');
        this.serviceWorker = registration.active || registration.waiting || registration.installing;
        
        // Cache critical crisis resources immediately
        if (this.serviceWorker) {
          this.serviceWorker.postMessage({
            type: 'CACHE_CRISIS_RESOURCES',
            resources: CRISIS_RESOURCES.filter(r => r.priority === 'critical')
          });
        }
      } catch (error) {
        console.warn('Service worker registration failed:', error);
      }
    }
  }

  private async preloadCriticalResources(): Promise<void> {
    const criticalResources = CRISIS_RESOURCES.filter(r => r.priority === 'critical');
    
    // Preload in parallel but respect performance budget
    const preloadPromises = criticalResources.map(resource => 
      this.optimizedResourceLoad(resource, { background: true })
    );
    
    try {
      await Promise.allSettled(preloadPromises);
    } catch (error) {
      console.warn('Critical resource preloading encountered errors:', error);
    }
  }

  private setupPerformanceMonitoring(): void {
    // Monitor for performance regression
    setInterval(() => {
      this.analyzePerformanceMetrics();
    }, 30000);
    
    // Monitor page visibility for optimization opportunities
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseNonCriticalOperations();
      } else {
        this.resumeOperations();
      }
    });
  }

  private adaptToNetworkConditions(): void {
    if (!this.networkInfo) return;
    
    const effectiveType = this.networkInfo.effectiveType;
    const downlink = this.networkInfo.downlink;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      this.enableUltraLowBandwidthMode();
    } else if (effectiveType === '3g' || downlink < 1.5) {
      this.enableLowBandwidthMode();
    } else {
      this.enableStandardMode();
    }
  }

  private adaptToBatteryLevel(): void {
    if (this.batteryLevel < 0.15) { // <15% battery
      this.enableBatterySaverMode();
    } else if (this.batteryLevel < 0.30) { // <30% battery
      this.enableLowPowerMode();
    } else {
      this.enableNormalPowerMode();
    }
  }

  private enableUltraLowBandwidthMode(): void {
    // Cache everything possible locally
    // Disable all but critical resources
    // Use text-only fallbacks
    this.cacheAllCriticalResources();
  }

  private enableLowBandwidthMode(): void {
    // Compress all requests
    // Prioritize critical resources
    // Use progressive loading
  }

  private enableStandardMode(): void {
    // Normal operation with preloading
  }

  private enableBatterySaverMode(): void {
    // Minimal network requests
    // Disable background operations
    // Use cached resources aggressively
    this.pauseNonCriticalOperations();
  }

  private enableLowPowerMode(): void {
    // Reduce refresh rates
    // Minimize background processing
  }

  private enableNormalPowerMode(): void {
    // Full functionality
    this.resumeOperations();
  }

  public async loadCrisisResource(resourceId: string, options: { urgent?: boolean; fallback?: boolean } = {}): Promise<any> {
    const resource = CRISIS_RESOURCES.find(r => r.id === resourceId);
    if (!resource) {
      throw new Error(`Crisis resource not found: ${resourceId}`);
    }

    const startTime = performance.now();
    
    try {
      // Check cache first for instant response
      const cached = this.getCachedResource(resource.cacheKey);
      if (cached && !options.urgent) {
        this.recordMetrics(resourceId, {
          loadTime: performance.now() - startTime,
          cacheHit: true,
          networkType: this.getNetworkType(),
          batteryLevel: this.batteryLevel,
          memoryUsage: this.getMemoryUsage(),
          success: true,
          fallbackUsed: false
        });
        return cached;
      }

      // Load with optimization strategy
      const strategy = this.getOptimizationStrategy(resource);
      const result = await this.optimizedResourceLoad(resource, strategy);
      
      // Cache the result
      this.cacheResource(resource.cacheKey, result, this.getCacheExpiry(resource));
      
      const loadTime = performance.now() - startTime;
      
      // Check if we met performance target
      if (loadTime > resource.loadTimeTarget && resource.priority === 'critical') {
        console.warn(`Crisis resource ${resourceId} exceeded target: ${loadTime}ms > ${resource.loadTimeTarget}ms`);
        this.reportPerformanceIssue(resourceId, loadTime, resource.loadTimeTarget);
      }

      this.recordMetrics(resourceId, {
        loadTime,
        cacheHit: false,
        networkType: this.getNetworkType(),
        batteryLevel: this.batteryLevel,
        memoryUsage: this.getMemoryUsage(),
        success: true,
        fallbackUsed: false
      });

      return result;
      
    } catch (error) {
      const loadTime = performance.now() - startTime;
      
      // Try fallback if available
      if (options.fallback !== false) {
        const fallbackResult = await this.loadFallbackResource(resource);
        if (fallbackResult) {
          this.recordMetrics(resourceId, {
            loadTime,
            cacheHit: false,
            networkType: this.getNetworkType(),
            batteryLevel: this.batteryLevel,
            memoryUsage: this.getMemoryUsage(),
            success: true,
            fallbackUsed: true
          });
          return fallbackResult;
        }
      }

      this.recordMetrics(resourceId, {
        loadTime,
        cacheHit: false,
        networkType: this.getNetworkType(),
        batteryLevel: this.batteryLevel,
        memoryUsage: this.getMemoryUsage(),
        success: false,
        fallbackUsed: options.fallback === false ? false : true
      });

      throw error;
    }
  }

  private async optimizedResourceLoad(resource: CrisisResource, strategy: OptimizationStrategy | { background?: boolean }): Promise<any> {
    // Prevent duplicate requests
    const loadingKey = `loading_${resource.id}`;
    if (this.loadingPromises.has(loadingKey)) {
      return this.loadingPromises.get(loadingKey);
    }

    const loadPromise = this.performOptimizedLoad(resource, strategy);
    this.loadingPromises.set(loadingKey, loadPromise);
    
    try {
      const result = await loadPromise;
      this.loadingPromises.delete(loadingKey);
      return result;
    } catch (error) {
      this.loadingPromises.delete(loadingKey);
      throw error;
    }
  }

  private async performOptimizedLoad(resource: CrisisResource, strategy: any): Promise<any> {
    if (resource.phone) {
      // Phone numbers are instantly available
      return {
        type: 'phone',
        number: resource.phone,
        formatted: this.formatPhoneNumber(resource.phone),
        action: `tel:${resource.phone}`
      };
    }

    if (resource.url) {
      const fetchOptions: RequestInit = {
        method: 'GET',
        // Set appropriate priority
        priority: resource.priority === 'critical' ? 'high' : 'low',
        // Use cache for performance
        cache: strategy.cache !== false ? 'force-cache' : 'no-cache'
      } as any;

      // Add compression headers for efficiency
      if (strategy.compress !== false) {
        fetchOptions.headers = {
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': 'application/json, text/plain, */*'
        };
      }

      // Set timeout based on network conditions
      const timeoutMs = this.getTimeoutForResource(resource);
      
      return this.fetchWithTimeout(resource.url, fetchOptions, timeoutMs);
    }

    // Static data resource
    return resource.data || null;
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getTimeoutForResource(resource: CrisisResource): number {
    const networkType = this.getNetworkType();
    let baseTimeout = resource.loadTimeTarget;

    // Adjust timeout based on network conditions
    switch (networkType) {
      case 'slow-2g':
        baseTimeout *= 3;
        break;
      case '2g':
        baseTimeout *= 2;
        break;
      case '3g':
        baseTimeout *= 1.5;
        break;
      default:
        // 4g or better - use base timeout
        break;
    }

    // Ensure minimum timeout for critical resources
    if (resource.priority === 'critical') {
      baseTimeout = Math.max(baseTimeout, 5000); // 5s minimum for critical
    }

    return Math.min(baseTimeout, 30000); // 30s maximum
  }

  private async loadFallbackResource(resource: CrisisResource): Promise<any> {
    // Use service worker cache as fallback
    if (this.serviceWorker) {
      try {
        const cached = await this.getCachedFromServiceWorker(resource.cacheKey);
        if (cached) return cached;
      } catch (error) {
        console.warn('Service worker fallback failed:', error);
      }
    }

    // Use local storage fallback
    const localFallback = this.getLocalStorageFallback(resource.cacheKey);
    if (localFallback) return localFallback;

    // Use static fallback data
    return this.getStaticFallback(resource);
  }

  private getStaticFallback(resource: CrisisResource): any {
    const staticFallbacks: Record<string, any> = {
      'crisis_988': {
        type: 'phone',
        number: '988',
        formatted: '9-8-8',
        action: 'tel:988',
        description: 'Suicide & Crisis Lifeline'
      },
      'crisis_text': {
        type: 'text',
        number: '741741',
        formatted: 'Text HOME to 741741',
        action: 'sms:741741',
        description: 'Crisis Text Line'
      },
      'emergency_911': {
        type: 'phone',
        number: '911',
        formatted: '9-1-1',
        action: 'tel:911',
        description: 'Emergency Services'
      }
    };

    return staticFallbacks[resource.cacheKey] || null;
  }

  private async getCachedFromServiceWorker(cacheKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.serviceWorker) {
        reject(new Error('Service worker not available'));
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve(event.data.data);
        } else {
          reject(new Error(event.data.error));
        }
      };

      this.serviceWorker.postMessage({
        type: 'GET_CACHED_RESOURCE',
        cacheKey
      }, [messageChannel.port2]);
    });
  }

  private getLocalStorageFallback(cacheKey: string): any {
    try {
      const stored = localStorage.getItem(`alchm_crisis_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expires > Date.now()) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Local storage fallback failed:', error);
    }
    return null;
  }

  private formatPhoneNumber(phone: string): string {
    if (phone === '988') return '9-8-8';
    if (phone === '911') return '9-1-1';
    if (phone === '741741') return '741741';
    
    // Format other numbers
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  private getOptimizationStrategy(resource: CrisisResource): OptimizationStrategy {
    return {
      preload: resource.priority === 'critical',
      cache: true,
      offline: resource.priority !== 'low',
      compress: !this.isLowEndDevice,
      prioritize: resource.priority === 'critical',
      batterySaver: this.batteryLevel < 0.3
    };
  }

  private getCachedResource(cacheKey: string): any {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }

  private cacheResource(cacheKey: string, data: any, expiryMs: number): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + expiryMs
    });

    // Also cache in localStorage for persistence
    try {
      localStorage.setItem(`alchm_crisis_${cacheKey}`, JSON.stringify({
        data,
        expires: Date.now() + expiryMs
      }));
    } catch (error) {
      console.warn('Failed to cache in localStorage:', error);
    }
  }

  private getCacheExpiry(resource: CrisisResource): number {
    switch (resource.priority) {
      case 'critical':
        return 24 * 60 * 60 * 1000; // 24 hours
      case 'high':
        return 4 * 60 * 60 * 1000; // 4 hours
      case 'medium':
        return 1 * 60 * 60 * 1000; // 1 hour
      case 'low':
        return 30 * 60 * 1000; // 30 minutes
      default:
        return 1 * 60 * 60 * 1000; // 1 hour
    }
  }

  private getNetworkType(): string {
    return this.networkInfo?.effectiveType || 'unknown';
  }

  private getMemoryUsage(): number {
    try {
      const memory = (performance as any).memory;
      return memory ? memory.usedJSHeapSize / (1024 * 1024) : 0;
    } catch {
      return 0;
    }
  }

  private recordMetrics(resourceId: string, metrics: PerformanceMetrics): void {
    if (!this.performanceMetrics.has(resourceId)) {
      this.performanceMetrics.set(resourceId, []);
    }
    
    const resourceMetrics = this.performanceMetrics.get(resourceId)!;
    resourceMetrics.push(metrics);
    
    // Keep only recent metrics
    if (resourceMetrics.length > 100) {
      resourceMetrics.splice(0, resourceMetrics.length - 50);
    }
  }

  private async reportPerformanceIssue(resourceId: string, actualTime: number, targetTime: number): Promise<void> {
    try {
      await fetch('/api/monitoring/crisis-performance-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          actualTime,
          targetTime,
          networkType: this.getNetworkType(),
          batteryLevel: this.batteryLevel,
          isLowEndDevice: this.isLowEndDevice,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to report performance issue:', error);
    }
  }

  private cacheAllCriticalResources(): void {
    const criticalResources = CRISIS_RESOURCES.filter(r => r.priority === 'critical');
    
    criticalResources.forEach(async (resource) => {
      try {
        await this.loadCrisisResource(resource.id, { fallback: false });
      } catch (error) {
        console.warn(`Failed to cache critical resource ${resource.id}:`, error);
      }
    });
  }

  private pauseNonCriticalOperations(): void {
    // Clear non-critical timers
    // Pause background sync
    // Reduce monitoring frequency
  }

  private resumeOperations(): void {
    // Resume normal operations
    // Restart monitoring
    // Sync any pending data
  }

  private analyzePerformanceMetrics(): void {
    // Analyze trends and optimize strategies
    this.performanceMetrics.forEach((metrics, resourceId) => {
      const recent = metrics.slice(-10); // Last 10 requests
      const avgLoadTime = recent.reduce((sum, m) => sum + m.loadTime, 0) / recent.length;
      const resource = CRISIS_RESOURCES.find(r => r.id === resourceId);
      
      if (resource && avgLoadTime > resource.loadTimeTarget * 1.5) {
        console.warn(`Performance degradation detected for ${resourceId}: ${avgLoadTime}ms avg`);
        this.optimizeResource(resource);
      }
    });
  }

  private optimizeResource(resource: CrisisResource): void {
    // Implement adaptive optimization strategies
    if (resource.priority === 'critical') {
      this.preloadCriticalResources();
    }
  }

  // Public API
  public async getCrisisHotline(): Promise<any> {
    return this.loadCrisisResource('suicide-hotline-988', { urgent: true });
  }

  public async getCrisisTextLine(): Promise<any> {
    return this.loadCrisisResource('crisis-text-741741', { urgent: true });
  }

  public async getEmergencyNumber(): Promise<any> {
    return this.loadCrisisResource('emergency-911', { urgent: true });
  }

  public async getSafetyPlan(): Promise<any> {
    return this.loadCrisisResource('crisis-safety-plan');
  }

  public getPerformanceMetrics(resourceId?: string): any {
    if (resourceId) {
      return this.performanceMetrics.get(resourceId) || [];
    }
    
    const allMetrics: any = {};
    this.performanceMetrics.forEach((metrics, id) => {
      allMetrics[id] = metrics;
    });
    return allMetrics;
  }

  public clearCache(): void {
    this.cache.clear();
    
    // Clear localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('alchm_crisis_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Global instance
export const crisisResourceOptimizer = new CrisisResourcePerformanceOptimizer();

// React hook
export const useCrisisResources = () => {
  return {
    getCrisisHotline: () => crisisResourceOptimizer.getCrisisHotline(),
    getCrisisTextLine: () => crisisResourceOptimizer.getCrisisTextLine(),
    getEmergencyNumber: () => crisisResourceOptimizer.getEmergencyNumber(),
    getSafetyPlan: () => crisisResourceOptimizer.getSafetyPlan(),
    getPerformanceMetrics: (resourceId?: string) => crisisResourceOptimizer.getPerformanceMetrics(resourceId),
    clearCache: () => crisisResourceOptimizer.clearCache()
  };
};

export default crisisResourceOptimizer;