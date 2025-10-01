/**
 * ALCHM Low-End Device Optimizer
 * Specialized optimizations for ultra-low and low-tier devices
 * Ensures ALCHM works flawlessly on older phones and slow networks
 */

import { mobilePerformanceMonitor } from './mobile-performance-monitor';
import { analyticsPerformanceOptimizer } from './analytics-performance-optimizer';

interface DeviceOptimizations {
  disableAnimations: boolean;
  reduceChartQuality: boolean;
  enableDataVirtualization: boolean;
  simplifyUI: boolean;
  aggressiveCaching: boolean;
  limitConcurrentOperations: boolean;
  useOptimizedRendering: boolean;
  deferNonEssentialFeatures: boolean;
}

interface NetworkOptimizations {
  enableOfflineMode: boolean;
  reduceImageQuality: boolean;
  compressData: boolean;
  batchRequests: boolean;
  prefetchCritical: boolean;
  delayNonCriticalRequests: boolean;
  useServiceWorkerCaching: boolean;
  enableProgressiveLoading: boolean;
}

interface LowEndPerformanceState {
  deviceTier: 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high';
  networkQuality: 'excellent' | 'good' | 'poor' | 'critical';
  batteryLevel: number;
  isCharging: boolean;
  thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
  memoryPressure: number; // 0-100
  activeOptimizations: string[];
}

export class LowEndDeviceOptimizer {
  private state: LowEndPerformanceState = {
    deviceTier: 'medium',
    networkQuality: 'good',
    batteryLevel: 100,
    isCharging: true,
    thermalState: 'nominal',
    memoryPressure: 0,
    activeOptimizations: []
  };

  private optimizations: {
    device: DeviceOptimizations;
    network: NetworkOptimizations;
  } = {
    device: {
      disableAnimations: false,
      reduceChartQuality: false,
      enableDataVirtualization: false,
      simplifyUI: false,
      aggressiveCaching: false,
      limitConcurrentOperations: false,
      useOptimizedRendering: false,
      deferNonEssentialFeatures: false
    },
    network: {
      enableOfflineMode: false,
      reduceImageQuality: false,
      compressData: false,
      batchRequests: false,
      prefetchCritical: false,
      delayNonCriticalRequests: false,
      useServiceWorkerCaching: false,
      enableProgressiveLoading: false
    }
  };

  private observers: {
    intersection?: IntersectionObserver;
    mutation?: MutationObserver;
  } = {};

  private deferredImages: Set<HTMLImageElement> = new Set();
  private virtualizedComponents: Map<string, boolean> = new Map();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor() {
    this.initializeLowEndOptimizations();
  }

  /**
   * Initialize low-end device optimizations
   */
  private initializeLowEndOptimizations(): void {
    if (typeof window === 'undefined') return;

    // Update device state
    this.updateDeviceState();

    // Apply initial optimizations
    this.applyDeviceOptimizations();
    this.applyNetworkOptimizations();

    // Setup monitoring
    this.setupDeviceMonitoring();
    this.setupNetworkMonitoring();

    // Initialize specific optimizations
    this.initializeImageOptimization();
    this.initializeDataVirtualization();
    this.initializeRequestBatching();
    this.initializeProgressiveLoading();

    console.log('🔧 Low-end device optimizations initialized', {
      deviceTier: this.state.deviceTier,
      networkQuality: this.state.networkQuality,
      activeOptimizations: this.state.activeOptimizations
    });
  }

  /**
   * Update device performance state
   */
  private updateDeviceState(): void {
    // Get device tier from mobile performance monitor
    this.state.deviceTier = mobilePerformanceMonitor.getDeviceTier();

    // Update memory pressure
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      this.state.memoryPressure = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }

    // Check network quality
    const connection = (navigator as any).connection;
    if (connection) {
      const rtt = connection.rtt || 0;
      const effectiveType = connection.effectiveType || 'unknown';

      if (rtt > 1000 || effectiveType === 'slow-2g') {
        this.state.networkQuality = 'critical';
      } else if (rtt > 500 || effectiveType === '2g') {
        this.state.networkQuality = 'poor';
      } else if (rtt > 200 || effectiveType === '3g') {
        this.state.networkQuality = 'good';
      } else {
        this.state.networkQuality = 'excellent';
      }
    }
  }

  /**
   * Apply device-specific optimizations
   */
  private applyDeviceOptimizations(): void {
    const isLowEnd = ['ultra-low', 'low'].includes(this.state.deviceTier);
    const isHighMemoryPressure = this.state.memoryPressure > 80;

    // Ultra-low devices need aggressive optimizations
    if (this.state.deviceTier === 'ultra-low') {
      this.optimizations.device = {
        disableAnimations: true,
        reduceChartQuality: true,
        enableDataVirtualization: true,
        simplifyUI: true,
        aggressiveCaching: true,
        limitConcurrentOperations: true,
        useOptimizedRendering: true,
        deferNonEssentialFeatures: true
      };
      this.state.activeOptimizations.push('ultra_low_mode');
    }
    // Low devices need moderate optimizations
    else if (this.state.deviceTier === 'low' || isHighMemoryPressure) {
      this.optimizations.device = {
        disableAnimations: true,
        reduceChartQuality: true,
        enableDataVirtualization: true,
        simplifyUI: false,
        aggressiveCaching: true,
        limitConcurrentOperations: true,
        useOptimizedRendering: true,
        deferNonEssentialFeatures: false
      };
      this.state.activeOptimizations.push('low_end_mode');
    }

    // Apply CSS optimizations
    if (this.optimizations.device.disableAnimations) {
      this.disableAnimations();
    }

    if (this.optimizations.device.simplifyUI) {
      this.simplifyUI();
    }

    if (this.optimizations.device.useOptimizedRendering) {
      this.enableOptimizedRendering();
    }
  }

  /**
   * Apply network-specific optimizations
   */
  private applyNetworkOptimizations(): void {
    const isPoorNetwork = ['poor', 'critical'].includes(this.state.networkQuality);

    if (this.state.networkQuality === 'critical') {
      this.optimizations.network = {
        enableOfflineMode: true,
        reduceImageQuality: true,
        compressData: true,
        batchRequests: true,
        prefetchCritical: true,
        delayNonCriticalRequests: true,
        useServiceWorkerCaching: true,
        enableProgressiveLoading: true
      };
      this.state.activeOptimizations.push('critical_network_mode');
    } else if (this.state.networkQuality === 'poor') {
      this.optimizations.network = {
        enableOfflineMode: false,
        reduceImageQuality: true,
        compressData: true,
        batchRequests: true,
        prefetchCritical: false,
        delayNonCriticalRequests: true,
        useServiceWorkerCaching: true,
        enableProgressiveLoading: true
      };
      this.state.activeOptimizations.push('poor_network_mode');
    }

    // Apply network optimizations
    if (this.optimizations.network.batchRequests) {
      this.enableRequestBatching();
    }

    if (this.optimizations.network.useServiceWorkerCaching) {
      this.enableServiceWorkerCaching();
    }
  }

  /**
   * Disable animations and transitions
   */
  private disableAnimations(): void {
    const style = document.createElement('style');
    style.id = 'low-end-animations';
    style.textContent = `
      /* Disable all animations for low-end devices */
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Specifically target ALCHM analytics components */
      .wellness-chart-animation,
      .badge-animation,
      .streak-visualization,
      .progress-animation {
        animation: none !important;
        transition: none !important;
      }
      
      /* Disable CSS transforms that cause repaints */
      .analytics-card:hover {
        transform: none !important;
      }
      
      /* Simplify shadows and effects */
      .shadow-card,
      .shadow-elevated {
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
      }
    `;

    document.head.appendChild(style);
    this.state.activeOptimizations.push('animations_disabled');
  }

  /**
   * Simplify UI for better performance
   */
  private simplifyUI(): void {
    const style = document.createElement('style');
    style.id = 'low-end-ui';
    style.textContent = `
      /* Simplify gradients to solid colors */
      .bg-gradient-to-br,
      .bg-gradient-to-r,
      .bg-gradient-radial {
        background-image: none !important;
        background-color: var(--sage-50) !important;
      }
      
      /* Reduce border radius complexity */
      .rounded-2xl,
      .rounded-3xl {
        border-radius: 0.5rem !important;
      }
      
      /* Simplify backdrop blur effects */
      .backdrop-blur-sm {
        backdrop-filter: none !important;
        background-color: rgba(255, 255, 255, 0.95) !important;
      }
      
      /* Hide decorative elements */
      .decorative-element,
      .ambient-light {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
    this.state.activeOptimizations.push('ui_simplified');
  }

  /**
   * Enable optimized rendering
   */
  private enableOptimizedRendering(): void {
    const style = document.createElement('style');
    style.id = 'low-end-rendering';
    style.textContent = `
      /* Use GPU acceleration sparingly */
      .analytics-chart,
      .wellness-visualization {
        will-change: auto !important;
        transform: translateZ(0);
      }
      
      /* Optimize painting layers */
      .badge-container,
      .streak-display {
        contain: layout style paint;
      }
      
      /* Reduce repaint areas */
      .analytics-card {
        isolation: isolate;
      }
    `;

    document.head.appendChild(style);
    this.state.activeOptimizations.push('optimized_rendering');
  }

  /**
   * Initialize image optimization for low-end devices
   */
  private initializeImageOptimization(): void {
    if (!this.optimizations.network.reduceImageQuality) return;

    // Replace high-quality images with low-quality versions
    const images = document.querySelectorAll('img[src]');
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      const src = imgElement.src;
      
      // For ALCHM, reduce quality for non-critical images
      if (!src.includes('icon') && !src.includes('logo')) {
        this.deferredImages.add(imgElement);
        
        // Use intersection observer for lazy loading
        if (this.observers.intersection) {
          this.observers.intersection.observe(imgElement);
        }
      }
    });

    // Setup intersection observer for lazy loading
    this.observers.intersection = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadOptimizedImage(img);
          this.observers.intersection?.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    this.state.activeOptimizations.push('image_optimization');
  }

  /**
   * Load optimized image for low-end devices
   */
  private loadOptimizedImage(img: HTMLImageElement): void {
    const originalSrc = img.src;
    
    // Create a low-quality placeholder first
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = img.offsetWidth || 100;
      canvas.height = img.offsetHeight || 100;
      
      // Create a simple placeholder
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Replace with placeholder while loading
      img.src = canvas.toDataURL();
    }

    // Load the actual image with reduced quality
    const actualImg = new Image();
    actualImg.onload = () => {
      img.src = actualImg.src;
    };
    
    // For analytics charts, reduce resolution
    if (originalSrc.includes('chart') || originalSrc.includes('analytics')) {
      actualImg.src = this.getReducedQualityUrl(originalSrc);
    } else {
      actualImg.src = originalSrc;
    }
  }

  /**
   * Get reduced quality URL for images
   */
  private getReducedQualityUrl(originalUrl: string): string {
    // Add quality parameter for supported image services
    if (originalUrl.includes('firebasestorage')) {
      return `${originalUrl}&quality=60&format=webp`;
    }
    
    return originalUrl;
  }

  /**
   * Initialize data virtualization for large lists
   */
  private initializeDataVirtualization(): void {
    if (!this.optimizations.device.enableDataVirtualization) return;

    // Find large lists that need virtualization
    const largeLists = document.querySelectorAll('[data-virtualize], .analytics-list, .badge-list');
    
    largeLists.forEach((list) => {
      this.virtualizeComponent(list as HTMLElement);
    });

    this.state.activeOptimizations.push('data_virtualization');
  }

  /**
   * Virtualize a component for better performance
   */
  private virtualizeComponent(element: HTMLElement): void {
    const componentId = element.id || `virtualized_${Date.now()}`;
    
    if (this.virtualizedComponents.has(componentId)) return;

    // Only show items in viewport
    const children = Array.from(element.children);
    const visibleCount = Math.min(10, children.length); // Show max 10 items
    
    // Hide non-visible items
    children.forEach((child, index) => {
      if (index >= visibleCount) {
        (child as HTMLElement).style.display = 'none';
      }
    });

    // Setup scroll-based loading
    element.addEventListener('scroll', () => {
      this.handleVirtualizedScroll(element, children);
    });

    this.virtualizedComponents.set(componentId, true);
  }

  /**
   * Handle scroll for virtualized components
   */
  private handleVirtualizedScroll(container: HTMLElement, allChildren: Element[]): void {
    const scrollTop = container.scrollTop;
    const containerHeight = container.offsetHeight;
    const itemHeight = 60; // Approximate item height
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      allChildren.length,
      startIndex + Math.ceil(containerHeight / itemHeight) + 2 // Buffer
    );

    // Show/hide appropriate items
    allChildren.forEach((child, index) => {
      const htmlChild = child as HTMLElement;
      if (index >= startIndex && index <= endIndex) {
        htmlChild.style.display = '';
      } else {
        htmlChild.style.display = 'none';
      }
    });
  }

  /**
   * Initialize request batching for poor networks
   */
  private initializeRequestBatching(): void {
    if (!this.optimizations.network.batchRequests) return;

    // Override fetch to batch requests
    const originalFetch = window.fetch;
    
    window.fetch = (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      
      // Batch analytics requests
      if (url.includes('/api/analytics') || url.includes('/api/tracking')) {
        return this.addToBatchQueue(() => originalFetch(...args));
      }
      
      return originalFetch(...args);
    };

    this.state.activeOptimizations.push('request_batching');
  }

  /**
   * Add request to batch queue
   */
  private addToBatchQueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      // Process queue if not already processing
      if (!this.isProcessingQueue) {
        this.processBatchQueue();
      }
    });
  }

  /**
   * Process batched requests
   */
  private async processBatchQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    try {
      // Process requests in small batches
      const batchSize = this.state.networkQuality === 'critical' ? 2 : 5;
      
      while (this.requestQueue.length > 0) {
        const batch = this.requestQueue.splice(0, batchSize);
        
        // Execute batch concurrently
        await Promise.allSettled(batch.map(request => request()));
        
        // Wait between batches to avoid overwhelming the network
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Enable service worker caching
   */
  private enableServiceWorkerCaching(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        this.state.activeOptimizations.push('service_worker_caching');
      }).catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    }
  }

  /**
   * Enable request batching optimization
   */
  private enableRequestBatching(): void {
    // Already handled in initializeRequestBatching
    console.log('Request batching enabled for poor network conditions');
  }

  /**
   * Initialize progressive loading
   */
  private initializeProgressiveLoading(): void {
    if (!this.optimizations.network.enableProgressiveLoading) return;

    // Load critical content first, defer everything else
    this.loadCriticalContent();
    
    // Load non-critical content after a delay
    setTimeout(() => {
      this.loadNonCriticalContent();
    }, 1000);

    this.state.activeOptimizations.push('progressive_loading');
  }

  /**
   * Load critical content first
   */
  private loadCriticalContent(): void {
    // Prioritize crisis resources, journal functionality, and basic UI
    const criticalElements = document.querySelectorAll(
      '[data-critical], .crisis-button, .journal-entry, .auth-form'
    );

    criticalElements.forEach((element) => {
      (element as HTMLElement).style.priority = 'high';
    });
  }

  /**
   * Load non-critical content after delay
   */
  private loadNonCriticalContent(): void {
    // Load analytics, badges, and gamification features
    const nonCriticalElements = document.querySelectorAll(
      '.analytics-chart, .badge-display, .streak-visualization, .gamification-progress'
    );

    nonCriticalElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.style.display === 'none') {
        htmlElement.style.display = '';
      }
    });
  }

  /**
   * Setup device monitoring
   */
  private setupDeviceMonitoring(): void {
    // Monitor memory pressure
    setInterval(() => {
      this.updateDeviceState();
      
      // Apply additional optimizations if needed
      if (this.state.memoryPressure > 90) {
        this.enableEmergencyOptimizations();
      }
    }, 15000); // Check every 15 seconds
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring(): void {
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.updateDeviceState();
        this.applyNetworkOptimizations();
      });
    }
  }

  /**
   * Enable emergency optimizations for critical performance issues
   */
  private enableEmergencyOptimizations(): void {
    console.warn('🚨 Enabling emergency optimizations for device performance');

    // Disable all non-essential features
    this.disableNonEssentialFeatures();
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    // Clear caches
    this.clearOptimizationCaches();

    this.state.activeOptimizations.push('emergency_optimizations');
  }

  /**
   * Disable non-essential features
   */
  private disableNonEssentialFeatures(): void {
    const nonEssentialElements = document.querySelectorAll(
      '.analytics-dashboard, .badge-intelligence, .gamification-hub'
    );

    nonEssentialElements.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  /**
   * Clear optimization caches
   */
  private clearOptimizationCaches(): void {
    this.deferredImages.clear();
    this.virtualizedComponents.clear();
    this.requestQueue = [];
  }

  /**
   * Get current optimization state
   */
  public getOptimizationState(): {
    state: LowEndPerformanceState;
    optimizations: {
      device: DeviceOptimizations;
      network: NetworkOptimizations;
    };
  } {
    return {
      state: { ...this.state },
      optimizations: {
        device: { ...this.optimizations.device },
        network: { ...this.optimizations.network }
      }
    };
  }

  /**
   * Manually trigger optimizations
   */
  public optimizeForCurrentConditions(): void {
    this.updateDeviceState();
    this.applyDeviceOptimizations();
    this.applyNetworkOptimizations();
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    // Disconnect observers
    if (this.observers.intersection) {
      this.observers.intersection.disconnect();
    }
    
    if (this.observers.mutation) {
      this.observers.mutation.disconnect();
    }

    // Remove optimization styles
    const optimizationStyles = document.querySelectorAll(
      '#low-end-animations, #low-end-ui, #low-end-rendering'
    );
    optimizationStyles.forEach(style => style.remove());

    // Clear caches
    this.clearOptimizationCaches();
  }
}

// Global low-end device optimizer
export const lowEndDeviceOptimizer = new LowEndDeviceOptimizer();

// React hook for low-end device optimization
export const useLowEndOptimization = () => {
  return {
    getState: () => lowEndDeviceOptimizer.getOptimizationState(),
    optimize: () => lowEndDeviceOptimizer.optimizeForCurrentConditions(),
    isLowEndDevice: () => {
      const state = lowEndDeviceOptimizer.getOptimizationState();
      return ['ultra-low', 'low'].includes(state.state.deviceTier);
    },
    isPoorNetwork: () => {
      const state = lowEndDeviceOptimizer.getOptimizationState();
      return ['poor', 'critical'].includes(state.state.networkQuality);
    }
  };
};

export default lowEndDeviceOptimizer;