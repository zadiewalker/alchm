/**
 * Enhanced Performance Monitor for ALCHM
 * Crisis-critical performance monitoring with real-time optimization
 */

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
  tti: number | null
  pageLoadTime: number | null
  memoryUsage: number | null
  networkInfo: NetworkInfo | null
}

interface NetworkInfo {
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

interface CrisisMetrics {
  crisisResourceLoadTime: number | null
  emergencyButtonResponseTime: number | null
  journalSaveTime: number | null
  authLoadTime: number | null
  kheeperaResponseTime: number | null
}

interface PerformanceAlert {
  metric: string
  value: number
  threshold: number
  severity: 'warning' | 'critical'
  timestamp: number
  userAgent: string
  url: string
  crisisMode: boolean
}

interface DeviceInfo {
  memory: number | null
  cores: number | null
  tier: 'low' | 'medium' | 'high'
  isMobile: boolean
  isLowPower: boolean
  connectionType: string
}

// Crisis-critical performance thresholds
const PERFORMANCE_THRESHOLDS = {
  CRISIS_CRITICAL: {
    LCP: { good: 800, poor: 1200 },
    FID: { good: 30, poor: 50 },
    CLS: { good: 0.03, poor: 0.05 },
    FCP: { good: 600, poor: 800 },
    TTI: { good: 1500, poor: 2000 },
    TTFB: { good: 200, poor: 400 },
    CRISIS_RESOURCE_LOAD: { good: 500, critical: 800 },
    EMERGENCY_BUTTON: { good: 50, critical: 100 },
    JOURNAL_SAVE: { good: 800, critical: 1500 },
    KHEPERA_RESPONSE: { good: 1000, critical: 2000 }
  },
  STANDARD: {
    LCP: { good: 1200, poor: 2500 },
    FID: { good: 50, poor: 100 },
    CLS: { good: 0.05, poor: 0.1 },
    FCP: { good: 800, poor: 1800 },
    TTI: { good: 2000, poor: 5000 },
    TTFB: { good: 300, poor: 800 },
    CRISIS_RESOURCE_LOAD: { good: 1000, critical: 2000 },
    EMERGENCY_BUTTON: { good: 100, critical: 200 },
    JOURNAL_SAVE: { good: 1500, critical: 3000 },
    KHEPERA_RESPONSE: { good: 2000, critical: 5000 }
  }
}

export class EnhancedPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null, fid: null, cls: null, fcp: null,
    ttfb: null, tti: null, pageLoadTime: null,
    memoryUsage: null, networkInfo: null
  }

  private crisisMetrics: CrisisMetrics = {
    crisisResourceLoadTime: null,
    emergencyButtonResponseTime: null,
    journalSaveTime: null,
    authLoadTime: null,
    kheeperaResponseTime: null
  }

  private deviceInfo: DeviceInfo = {
    memory: null, cores: null, tier: 'medium',
    isMobile: false, isLowPower: false, connectionType: 'unknown'
  }

  private observers: PerformanceObserver[] = []
  private alerts: PerformanceAlert[] = []
  private isCrisisMode = false
  private sessionId: string

  constructor() {
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    if (typeof window !== 'undefined') {
      this.detectDevice()
      this.initializeMonitoring()
    }
  }

  private detectDevice(): void {
    const nav = navigator as any

    // Device memory detection
    this.deviceInfo.memory = nav.deviceMemory || null
    this.deviceInfo.cores = nav.hardwareConcurrency || null
    
    // Mobile detection
    this.deviceInfo.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent)
    
    // Low power mode detection
    this.deviceInfo.isLowPower = nav.connection?.saveData || false
    
    // Connection type
    this.deviceInfo.connectionType = nav.connection?.effectiveType || 'unknown'
    
    // Device tier calculation
    if (this.deviceInfo.memory && this.deviceInfo.memory >= 8) {
      this.deviceInfo.tier = 'high'
    } else if (this.deviceInfo.memory && this.deviceInfo.memory >= 4) {
      this.deviceInfo.tier = 'medium'
    } else if (this.deviceInfo.memory && this.deviceInfo.memory < 2) {
      this.deviceInfo.tier = 'low'
    } else if (this.deviceInfo.cores && this.deviceInfo.cores < 4) {
      this.deviceInfo.tier = 'low'
    }

    console.log('📱 Device Info:', this.deviceInfo)
  }

  private getThresholds() {
    return this.isCrisisMode ? PERFORMANCE_THRESHOLDS.CRISIS_CRITICAL : PERFORMANCE_THRESHOLDS.STANDARD
  }

  private initializeMonitoring(): void {
    this.setupWebVitalsMonitoring()
    this.setupNetworkMonitoring()
    this.setupMemoryMonitoring()
    this.setupCrisisMetrics()
    this.startPeriodicReporting()
    this.optimizeForDevice()
  }

  private setupWebVitalsMonitoring(): void {
    if (!('PerformanceObserver' in window)) return

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.lcp = lastEntry.startTime
        this.checkThreshold('LCP', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)
    } catch (e) {
      console.warn('LCP monitoring not supported')
    }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
          this.checkThreshold('FID', this.metrics.fid)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)
    } catch (e) {
      console.warn('FID monitoring not supported')
    }

    // CLS Observer
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.cls = clsValue
        this.checkThreshold('CLS', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    } catch (e) {
      console.warn('CLS monitoring not supported')
    }

    // Paint Observer (FCP)
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime
            this.checkThreshold('FCP', entry.startTime)
          }
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(paintObserver)
    } catch (e) {
      console.warn('Paint timing monitoring not supported')
    }

    // Navigation Observer (TTFB, TTI)
    try {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[]
        entries.forEach((entry) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart
          this.metrics.pageLoadTime = entry.loadEventEnd - entry.loadEventStart
          this.metrics.tti = entry.domInteractive - entry.navigationStart
          
          this.checkThreshold('TTFB', this.metrics.ttfb)
          this.checkThreshold('TTI', this.metrics.tti)
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)
    } catch (e) {
      console.warn('Navigation timing monitoring not supported')
    }
  }

  private setupNetworkMonitoring(): void {
    const connection = (navigator as any).connection
    
    if (connection) {
      this.metrics.networkInfo = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      }

      // Network change monitoring
      connection.addEventListener('change', () => {
        this.metrics.networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        }
        
        // Alert on poor network for crisis users
        if (this.isCrisisMode && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
          this.createAlert('NETWORK_DEGRADATION', connection.rtt, 2000, 'critical')
        }
      })
    }
  }

  private setupMemoryMonitoring(): void {
    const updateMemoryInfo = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        
        // Alert on high memory usage (critical for low-tier devices)
        const threshold = this.deviceInfo.tier === 'low' ? 0.8 : 0.9
        if (this.metrics.memoryUsage > threshold) {
          this.createAlert('HIGH_MEMORY_USAGE', this.metrics.memoryUsage * 100, threshold * 100, 'critical')
        }
      }
    }

    setInterval(updateMemoryInfo, 15000) // Check every 15 seconds for crisis users
    updateMemoryInfo()
  }

  private setupCrisisMetrics(): void {
    // Monitor crisis button response time
    this.monitorCrisisButton()
    
    // Monitor Khepera AI response time
    this.monitorKheperaPerformance()
    
    // Monitor journal save performance
    this.monitorJournalSave()
    
    // Monitor auth performance
    this.monitorAuthPerformance()
  }

  private monitorCrisisButton(): void {
    const observer = new MutationObserver(() => {
      const crisisButton = document.querySelector('[data-crisis-button], .crisis-button, [data-emergency]')
      if (crisisButton) {
        crisisButton.addEventListener('click', () => {
          const startTime = performance.now()
          
          const checkCrisisLoad = () => {
            const crisisModal = document.querySelector('[data-crisis-modal], .crisis-modal')
            const crisisResources = document.querySelector('[data-crisis-resources]')
            
            if (crisisModal || crisisResources) {
              const loadTime = performance.now() - startTime
              this.crisisMetrics.emergencyButtonResponseTime = loadTime
              
              const thresholds = this.getThresholds()
              if (loadTime > thresholds.EMERGENCY_BUTTON.critical) {
                this.createAlert('CRISIS_BUTTON_SLOW', loadTime, thresholds.EMERGENCY_BUTTON.critical, 'critical')
              }
            } else if (performance.now() - startTime < 3000) {
              setTimeout(checkCrisisLoad, 50)
            }
          }
          
          setTimeout(checkCrisisLoad, 0)
        })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  private monitorKheperaPerformance(): void {
    // Override fetch to monitor Khepera API calls
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
      
      if (url.includes('khepera') || url.includes('ai') || url.includes('chat')) {
        const startTime = performance.now()
        
        try {
          const response = await originalFetch(...args)
          const responseTime = performance.now() - startTime
          
          this.crisisMetrics.kheeperaResponseTime = responseTime
          
          const thresholds = this.getThresholds()
          if (responseTime > thresholds.KHEPERA_RESPONSE.critical) {
            this.createAlert('KHEPERA_SLOW', responseTime, thresholds.KHEPERA_RESPONSE.critical, 'critical')
          }
          
          return response
        } catch (error) {
          const responseTime = performance.now() - startTime
          this.createAlert('KHEPERA_FAILED', responseTime, 0, 'critical')
          throw error
        }
      }
      
      return originalFetch(...args)
    }
  }

  private monitorJournalSave(): void {
    // Monitor journal save operations
    const originalFetch = window.fetch
    const enhancedFetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
      
      if (url.includes('/api/save') || url.includes('journal')) {
        const startTime = performance.now()
        
        try {
          const response = await originalFetch(...args)
          const saveTime = performance.now() - startTime
          
          this.crisisMetrics.journalSaveTime = saveTime
          
          const thresholds = this.getThresholds()
          if (saveTime > thresholds.JOURNAL_SAVE.critical) {
            this.createAlert('JOURNAL_SAVE_SLOW', saveTime, thresholds.JOURNAL_SAVE.critical, 'critical')
          }
          
          return response
        } catch (error) {
          const saveTime = performance.now() - startTime
          this.createAlert('JOURNAL_SAVE_FAILED', saveTime, 0, 'critical')
          throw error
        }
      }
      
      return originalFetch(...args)
    }

    if (window.fetch.toString().includes('[native code]')) {
      window.fetch = enhancedFetch
    }
  }

  private monitorAuthPerformance(): void {
    // Monitor authentication-related performance
    const originalFetch = window.fetch
    const enhancedFetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : ''
      
      if (url.includes('auth') || url.includes('session') || url.includes('login')) {
        const startTime = performance.now()
        
        try {
          const response = await originalFetch(...args)
          const authTime = performance.now() - startTime
          
          this.crisisMetrics.authLoadTime = authTime
          
          const thresholds = this.getThresholds()
          if (authTime > thresholds.CRISIS_RESOURCE_LOAD.critical) {
            this.createAlert('AUTH_SLOW', authTime, thresholds.CRISIS_RESOURCE_LOAD.critical, 'warning')
          }
          
          return response
        } catch (error) {
          const authTime = performance.now() - startTime
          this.createAlert('AUTH_FAILED', authTime, 0, 'critical')
          throw error
        }
      }
      
      return originalFetch(...args)
    }

    if (window.fetch === originalFetch) {
      window.fetch = enhancedFetch
    }
  }

  private optimizeForDevice(): void {
    if (this.deviceInfo.tier === 'low' || this.deviceInfo.isLowPower) {
      console.log('🔋 Low-power device detected, applying optimizations...')
      
      // Reduce animation durations
      const style = document.createElement('style')
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.2s !important;
          transition-duration: 0.2s !important;
        }
      `
      document.head.appendChild(style)
      
      // Lazy load non-critical images
      const images = document.querySelectorAll('img:not([data-critical])')
      images.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
          (img as HTMLImageElement).loading = 'lazy'
        }
      })
    }

    if (this.deviceInfo.connectionType === '2g' || this.deviceInfo.connectionType === 'slow-2g') {
      console.log('📶 Slow connection detected, reducing payload...')
      
      // Disable non-essential features for slow connections
      document.body.classList.add('reduced-motion')
    }
  }

  private checkThreshold(metric: string, value: number): void {
    const thresholds = this.getThresholds()
    const threshold = (thresholds as any)[metric]
    
    if (!threshold) return

    if (value > threshold.poor || value > (threshold.critical || threshold.poor)) {
      const severity = threshold.critical && value > threshold.critical ? 'critical' : 'warning'
      this.createAlert(metric, value, threshold.poor, severity)
    }
  }

  private createAlert(metric: string, value: number, threshold: number, severity: 'warning' | 'critical'): void {
    const alert: PerformanceAlert = {
      metric,
      value,
      threshold,
      severity,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      crisisMode: this.isCrisisMode
    }

    this.alerts.push(alert)
    
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-25)
    }

    console.warn(`⚠️ Performance Alert [${severity.toUpperCase()}]: ${metric} = ${value.toFixed(0)}ms (threshold: ${threshold}ms)`)

    if (severity === 'critical' || this.isCrisisMode) {
      this.sendAlert(alert)
    }
  }

  private async sendAlert(alert: PerformanceAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alert,
          sessionId: this.sessionId,
          deviceInfo: this.deviceInfo,
          metrics: this.metrics,
          crisisMetrics: this.crisisMetrics
        })
      })
    } catch (error) {
      console.warn('Failed to send performance alert:', error)
    }
  }

  private startPeriodicReporting(): void {
    // Report metrics more frequently for crisis users
    const interval = this.isCrisisMode ? 15000 : 30000
    
    setInterval(() => {
      this.reportMetrics()
    }, interval)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics()
      }
    })

    window.addEventListener('beforeunload', () => {
      this.reportMetrics()
    })
  }

  private async reportMetrics(): Promise<void> {
    const payload = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      crisisMetrics: this.crisisMetrics,
      deviceInfo: this.deviceInfo,
      alerts: this.alerts.filter(a => Date.now() - a.timestamp < 300000),
      isCrisisMode: this.isCrisisMode
    }

    try {
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/monitoring/performance', JSON.stringify(payload))
      } else {
        await fetch('/api/monitoring/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
    } catch (error) {
      console.warn('Failed to report performance metrics:', error)
    }
  }

  // Public API
  public setCrisisMode(enabled: boolean): void {
    this.isCrisisMode = enabled
    console.log(`🚨 Crisis mode ${enabled ? 'enabled' : 'disabled'}`)
    
    if (enabled) {
      // Immediate optimization for crisis mode
      this.optimizeForCrisis()
    }
  }

  private optimizeForCrisis(): void {
    // Preload crisis resources
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = '/crisis-resources'
    document.head.appendChild(link)
    
    // Reduce all animations
    document.body.style.setProperty('--animation-speed', '0.1s')
  }

  public getPerformanceScore(): number {
    let score = 100
    const thresholds = this.getThresholds()
    
    // Weighted scoring based on crisis criticality
    const weights = {
      LCP: 30, FCP: 20, FID: 25, CLS: 15, TTFB: 10
    }
    
    Object.entries(weights).forEach(([metric, weight]) => {
      const value = (this.metrics as any)[metric.toLowerCase()]
      if (value !== null && value !== undefined) {
        const threshold = (thresholds as any)[metric]
        if (threshold && value > threshold.good) {
          const penalty = value > threshold.poor ? weight : weight * 0.5
          score -= penalty
        }
      }
    })
    
    return Math.max(0, score)
  }

  public generateReport(): string {
    let report = '🎯 ALCHM Performance Audit Report\n'
    report += '='.repeat(40) + '\n\n'
    
    report += `📱 Device Info:\n`
    report += `   Tier: ${this.deviceInfo.tier}\n`
    report += `   Mobile: ${this.deviceInfo.isMobile}\n`
    report += `   Memory: ${this.deviceInfo.memory || 'Unknown'} GB\n`
    report += `   Cores: ${this.deviceInfo.cores || 'Unknown'}\n`
    report += `   Connection: ${this.deviceInfo.connectionType}\n`
    report += `   Crisis Mode: ${this.isCrisisMode}\n\n`
    
    report += `🏆 Overall Performance Score: ${this.getPerformanceScore()}/100\n\n`
    
    report += `📊 Core Web Vitals:\n`
    if (this.metrics.lcp) report += `   LCP: ${this.metrics.lcp.toFixed(0)}ms\n`
    if (this.metrics.fcp) report += `   FCP: ${this.metrics.fcp.toFixed(0)}ms\n`
    if (this.metrics.fid) report += `   FID: ${this.metrics.fid.toFixed(0)}ms\n`
    if (this.metrics.cls) report += `   CLS: ${this.metrics.cls.toFixed(3)}\n`
    if (this.metrics.ttfb) report += `   TTFB: ${this.metrics.ttfb.toFixed(0)}ms\n`
    if (this.metrics.tti) report += `   TTI: ${this.metrics.tti.toFixed(0)}ms\n\n`
    
    report += `🆘 Crisis Metrics:\n`
    Object.entries(this.crisisMetrics).forEach(([key, value]) => {
      if (value !== null) {
        report += `   ${key}: ${value.toFixed(0)}ms\n`
      }
    })
    
    if (this.alerts.length > 0) {
      report += `\n⚠️ Recent Alerts (${this.alerts.length}):\n`
      this.alerts.slice(-5).forEach(alert => {
        report += `   ${alert.severity.toUpperCase()}: ${alert.metric} = ${alert.value.toFixed(0)}ms\n`
      })
    }
    
    return report
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Global instance
export const enhancedPerformanceMonitor = new EnhancedPerformanceMonitor()

// React hook
export const useEnhancedPerformance = () => {
  return {
    setCrisisMode: (enabled: boolean) => enhancedPerformanceMonitor.setCrisisMode(enabled),
    getPerformanceScore: () => enhancedPerformanceMonitor.getPerformanceScore(),
    generateReport: () => enhancedPerformanceMonitor.generateReport()
  }
}