// Performance integration and initialization for ALCHM
import { getPerformanceMonitor } from './performance'
import CoreWebVitalsOptimizer from './coreWebVitals'
import { getCacheStrategies, CacheWarmer } from './cacheStrategies'
import { ImageOptimizer } from './imageOptimization'
import { AssetOptimizationManager } from './assetOptimization'

// Performance configuration
export interface PerformanceConfig {
  enableMonitoring: boolean
  enableOptimizations: boolean
  enableCaching: boolean
  enableImageOptimization: boolean
  enableAssetOptimization: boolean
  debugMode: boolean
}

// Default configuration
const DEFAULT_CONFIG: PerformanceConfig = {
  enableMonitoring: true,
  enableOptimizations: true,
  enableCaching: true,
  enableImageOptimization: true,
  enableAssetOptimization: true,
  debugMode: process.env.NODE_ENV === 'development'
}

// Performance integration manager
export class PerformanceIntegrationManager {
  private static instance: PerformanceIntegrationManager | null = null
  private config: PerformanceConfig
  private initialized = false

  private constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  static getInstance(config?: Partial<PerformanceConfig>): PerformanceIntegrationManager {
    if (!this.instance) {
      this.instance = new PerformanceIntegrationManager(config)
    }
    return this.instance
  }

  // Initialize all performance optimizations
  async initialize(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') {
      return
    }

    console.log('🚀 Initializing ALCHM Performance Optimizations...')
    
    try {
      // Initialize monitoring first
      if (this.config.enableMonitoring) {
        await this.initializeMonitoring()
      }

      // Initialize Core Web Vitals optimization
      if (this.config.enableOptimizations) {
        CoreWebVitalsOptimizer.getInstance()
        if (this.config.debugMode) {
          console.log('✅ Core Web Vitals optimization initialized')
        }
      }

      // Initialize caching strategies
      if (this.config.enableCaching) {
        await this.initializeCaching()
      }

      // Initialize image optimizations
      if (this.config.enableImageOptimization) {
        this.initializeImageOptimization()
      }

      // Initialize asset optimizations
      if (this.config.enableAssetOptimization) {
        AssetOptimizationManager.initialize()
        if (this.config.debugMode) {
          console.log('✅ Asset optimization initialized')
        }
      }

      // Setup performance tracking
      this.setupPerformanceTracking()

      // Setup cleanup on page unload
      this.setupCleanup()

      this.initialized = true
      console.log('✅ ALCHM Performance Optimizations initialized successfully')

    } catch (error) {
      console.error('❌ Failed to initialize performance optimizations:', error)
    }
  }

  private async initializeMonitoring(): Promise<void> {
    const monitor = getPerformanceMonitor()
    if (monitor && this.config.debugMode) {
      console.log('✅ Performance monitoring initialized')
    }
  }

  private async initializeCaching(): Promise<void> {
    const cacheStrategies = getCacheStrategies()
    
    // Warm critical caches
    const cacheWarmer = new CacheWarmer()
    
    // Warm static assets cache
    await cacheWarmer.warmStaticAssets()
    
    // Warm user-specific cache if user is authenticated
    const userId = this.getCurrentUserId()
    if (userId) {
      await cacheWarmer.warmUserCache(userId)
    }

    // Setup periodic cache maintenance
    this.setupCacheMaintenance()

    if (this.config.debugMode) {
      console.log('✅ Caching strategies initialized')
    }
  }

  private initializeImageOptimization(): void {
    // Initialize lazy loading
    ImageOptimizer.initializeLazyLoading()

    // Preload critical images
    const criticalImages = this.getCriticalImages()
    ImageOptimizer.preloadCriticalImages(criticalImages)

    if (this.config.debugMode) {
      console.log('✅ Image optimization initialized')
    }
  }

  private setupPerformanceTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportPerformanceData()
      }
    })

    // Track beforeunload for final metrics
    window.addEventListener('beforeunload', () => {
      this.reportPerformanceData()
    })

    // Periodic performance reporting (every 30 seconds)
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.reportPerformanceData()
      }
    }, 30000)
  }

  private setupCacheMaintenance(): void {
    const cacheStrategies = getCacheStrategies()

    // Clean up expired cache entries every 10 minutes
    setInterval(() => {
      cacheStrategies.performMaintenance()
      if (this.config.debugMode) {
        console.log('🧹 Cache maintenance completed')
      }
    }, 10 * 60 * 1000)
  }

  private setupCleanup(): void {
    window.addEventListener('beforeunload', () => {
      const monitor = getPerformanceMonitor()
      if (monitor && typeof monitor.cleanup === 'function') {
        monitor.cleanup()
      }
    })
  }

  private reportPerformanceData(): void {
    if (!this.config.enableMonitoring) return

    try {
      const vitalsOptimizer = CoreWebVitalsOptimizer.getInstance()
      const vitalsData = vitalsOptimizer.getVitalsData()
      
      // Only send if we have meaningful data
      if (Object.values(vitalsData).some(value => value !== null && value !== undefined)) {
        this.sendPerformanceDataToAnalytics(vitalsData)
      }
    } catch (error) {
      console.warn('Failed to report performance data:', error)
    }
  }

  private async sendPerformanceDataToAnalytics(vitalsData: any): Promise<void> {
    if (process.env.NODE_ENV !== 'production') return

    try {
      await fetch('/api/analytics/performance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vitalsData,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          connection: (navigator as any).connection?.effectiveType,
          deviceMemory: (navigator as any).deviceMemory,
          hardwareConcurrency: navigator.hardwareConcurrency
        })
      })
    } catch (error) {
      // Silently fail to avoid affecting user experience
    }
  }

  private getCurrentUserId(): string | null {
    // This would integrate with your auth system
    // For now, check localStorage or session
    try {
      const user = localStorage.getItem('alchm_user')
      return user ? JSON.parse(user).uid : null
    } catch {
      return null
    }
  }

  private getCriticalImages(): string[] {
    // Define critical images that should be preloaded
    return [
      '/images/logo.svg',
      '/images/hero-bg.webp',
      '/icons/icon-192x192.png'
    ]
  }

  // Public API methods
  async optimizeForRoute(route: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }

    // Preload assets for specific routes
    AssetOptimizationManager.preloadForRoute(route)

    // Route-specific optimizations
    switch (route) {
      case '/journals':
        await this.optimizeForJournalsPage()
        break
      case '/profile':
        await this.optimizeForProfilePage()
        break
      case '/':
        await this.optimizeForHomePage()
        break
    }
  }

  private async optimizeForJournalsPage(): Promise<void> {
    const userId = this.getCurrentUserId()
    if (userId) {
      const cacheWarmer = new CacheWarmer()
      await cacheWarmer.warmUserCache(userId)
    }
  }

  private async optimizeForProfilePage(): Promise<void> {
    // Preload profile-specific resources
    ImageOptimizer.preloadCriticalImages(['/images/default-avatar.svg'])
  }

  private async optimizeForHomePage(): Promise<void> {
    // Preload hero images and critical assets
    const criticalImages = ['/images/hero-bg.webp', '/images/features.webp']
    ImageOptimizer.preloadCriticalImages(criticalImages)
  }

  generatePerformanceReport(): string {
    const vitalsOptimizer = CoreWebVitalsOptimizer.getInstance()
    const cacheStrategies = getCacheStrategies()
    
    let report = '📊 ALCHM Performance Report\n'
    report += '=' .repeat(40) + '\n\n'

    // Core Web Vitals
    report += vitalsOptimizer.generateReport()
    report += '\n\n'

    // Cache performance
    const cacheStats = cacheStrategies.getCacheStats()
    report += '💾 Cache Performance:\n'
    report += `Memory cache: ${cacheStats.memorySize} entries\n`
    report += `Storage usage: ${(cacheStats.storageSize / 1024).toFixed(1)}KB\n`
    report += `Hit rate: ${(cacheStats.memoryHitRate * 100).toFixed(1)}%\n\n`

    // Asset optimization
    report += AssetOptimizationManager.generateReport()

    return report
  }

  // Utility methods for debugging
  getDebugInfo(): any {
    if (!this.config.debugMode) return null

    const vitalsOptimizer = CoreWebVitalsOptimizer.getInstance()
    const cacheStrategies = getCacheStrategies()

    return {
      config: this.config,
      initialized: this.initialized,
      vitalsData: vitalsOptimizer.getVitalsData(),
      cacheStats: cacheStrategies.getCacheStats(),
      recommendations: vitalsOptimizer.generateRecommendations()
    }
  }
}

// Hook for React components
export function usePerformanceIntegration(config?: Partial<PerformanceConfig>) {
  const manager = PerformanceIntegrationManager.getInstance(config)

  return {
    initialize: () => manager.initialize(),
    optimizeForRoute: (route: string) => manager.optimizeForRoute(route),
    generateReport: () => manager.generatePerformanceReport(),
    getDebugInfo: () => manager.getDebugInfo()
  }
}

// Auto-initialize when module is loaded (if in browser)
if (typeof window !== 'undefined') {
  // Initialize on next tick to allow for configuration
  setTimeout(() => {
    PerformanceIntegrationManager.getInstance().initialize()
  }, 0)
}

export default PerformanceIntegrationManager