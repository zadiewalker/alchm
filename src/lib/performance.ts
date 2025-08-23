// Performance monitoring and optimization utilities for ALCHM
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals'

// Performance metrics interface
export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number // Cumulative Layout Shift
  fid?: number // First Input Delay
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  ttfb?: number // Time to First Byte
  
  // Custom metrics
  navigationStart?: number
  domContentLoaded?: number
  loadComplete?: number
  
  // Resource metrics
  jsLoadTime?: number
  cssLoadTime?: number
  imageLoadTime?: number
  
  // User experience metrics
  timeToInteractive?: number
  totalBlockingTime?: number
}

// Performance thresholds for monitoring
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals (Google's recommended values)
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,
  
  FID_GOOD: 100, // ms
  FID_NEEDS_IMPROVEMENT: 300,
  
  LCP_GOOD: 2500, // ms
  LCP_NEEDS_IMPROVEMENT: 4000,
  
  FCP_GOOD: 1800, // ms
  FCP_NEEDS_IMPROVEMENT: 3000,
  
  TTFB_GOOD: 800, // ms
  TTFB_NEEDS_IMPROVEMENT: 1800,
  
  // Custom thresholds
  TTI_GOOD: 3800, // ms
  TBT_GOOD: 200   // ms
}

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring()
    }
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals()
    
    // Monitor navigation timing
    this.monitorNavigationTiming()
    
    // Monitor resource timing
    this.monitorResourceTiming()
    
    // Monitor long tasks
    this.monitorLongTasks()
    
    // Monitor layout shifts
    this.monitorLayoutShifts()
  }

  private monitorCoreWebVitals() {
    // Cumulative Layout Shift
    getCLS((metric: Metric) => {
      this.metrics.cls = metric.value
      this.reportMetric('CLS', metric.value)
    })

    // First Input Delay
    getFID((metric: Metric) => {
      this.metrics.fid = metric.value
      this.reportMetric('FID', metric.value)
    })

    // First Contentful Paint
    getFCP((metric: Metric) => {
      this.metrics.fcp = metric.value
      this.reportMetric('FCP', metric.value)
    })

    // Largest Contentful Paint
    getLCP((metric: Metric) => {
      this.metrics.lcp = metric.value
      this.reportMetric('LCP', metric.value)
    })

    // Time to First Byte
    getTTFB((metric: Metric) => {
      this.metrics.ttfb = metric.value
      this.reportMetric('TTFB', metric.value)
    })
  }

  private monitorNavigationTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            
            this.metrics.navigationStart = navEntry.navigationStart
            this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.navigationStart
            this.metrics.loadComplete = navEntry.loadEventEnd - navEntry.navigationStart
            
            this.reportNavigationMetrics(navEntry)
          }
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      this.observers.push(observer)
    }
  }

  private monitorResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        let jsLoadTime = 0
        let cssLoadTime = 0
        let imageLoadTime = 0
        
        entries.forEach((entry) => {
          const resource = entry as PerformanceResourceTiming
          const duration = resource.responseEnd - resource.requestStart
          
          if (resource.name.includes('.js')) {
            jsLoadTime += duration
          } else if (resource.name.includes('.css')) {
            cssLoadTime += duration
          } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) {
            imageLoadTime += duration
          }
        })
        
        this.metrics.jsLoadTime = jsLoadTime
        this.metrics.cssLoadTime = cssLoadTime
        this.metrics.imageLoadTime = imageLoadTime
      })
      
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    }
  }

  private monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let totalBlockingTime = 0
        
        list.getEntries().forEach((entry) => {
          // Tasks longer than 50ms are considered blocking
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50
          }
        })
        
        this.metrics.totalBlockingTime = totalBlockingTime
        this.reportMetric('TBT', totalBlockingTime)
      })
      
      try {
        observer.observe({ entryTypes: ['longtask'] })
        this.observers.push(observer)
      } catch (e) {
        // Long task API not supported
        console.warn('Long Task API not supported')
      }
    }
  }

  private monitorLayoutShifts() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const layoutShift = entry as any
          if (!layoutShift.hadRecentInput) {
            console.log('Layout shift detected:', {
              value: layoutShift.value,
              sources: layoutShift.sources?.map((source: any) => ({
                node: source.node,
                currentRect: source.currentRect,
                previousRect: source.previousRect
              }))
            })
          }
        })
      })
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(observer)
      } catch (e) {
        // Layout shift API not supported
        console.warn('Layout Shift API not supported')
      }
    }
  }

  private reportMetric(name: string, value: number) {
    const status = this.getMetricStatus(name, value)
    
    // Log metric with status
    console.log(`🔍 ${name}: ${value.toFixed(2)}${this.getMetricUnit(name)} (${status})`)
    
    // Send to analytics (only in production)
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value, status)
    }
  }

  private reportNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics = {
      'DNS Lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'TCP Connection': entry.connectEnd - entry.connectStart,
      'Server Response': entry.responseEnd - entry.requestStart,
      'DOM Processing': entry.domContentLoadedEventStart - entry.responseEnd,
      'Resource Loading': entry.loadEventStart - entry.domContentLoadedEventEnd
    }
    
    console.log('📊 Navigation Timing:', metrics)
  }

  private getMetricStatus(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PERFORMANCE_THRESHOLDS
    
    switch (name) {
      case 'CLS':
        return value <= thresholds.CLS_GOOD ? 'good' : 
               value <= thresholds.CLS_NEEDS_IMPROVEMENT ? 'needs-improvement' : 'poor'
      case 'FID':
        return value <= thresholds.FID_GOOD ? 'good' : 
               value <= thresholds.FID_NEEDS_IMPROVEMENT ? 'needs-improvement' : 'poor'
      case 'LCP':
        return value <= thresholds.LCP_GOOD ? 'good' : 
               value <= thresholds.LCP_NEEDS_IMPROVEMENT ? 'needs-improvement' : 'poor'
      case 'FCP':
        return value <= thresholds.FCP_GOOD ? 'good' : 
               value <= thresholds.FCP_NEEDS_IMPROVEMENT ? 'needs-improvement' : 'poor'
      case 'TTFB':
        return value <= thresholds.TTFB_GOOD ? 'good' : 
               value <= thresholds.TTFB_NEEDS_IMPROVEMENT ? 'needs-improvement' : 'poor'
      case 'TBT':
        return value <= thresholds.TBT_GOOD ? 'good' : 'needs-improvement'
      default:
        return 'good'
    }
  }

  private getMetricUnit(name: string): string {
    switch (name) {
      case 'CLS':
        return ''
      case 'FID':
      case 'LCP':
      case 'FCP':
      case 'TTFB':
      case 'TBT':
        return 'ms'
      default:
        return 'ms'
    }
  }

  private async sendToAnalytics(name: string, value: number, status: string) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metric: name,
          value,
          status,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      console.warn('Failed to send performance metric:', error)
    }
  }

  // Public methods
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  generateReport(): string {
    const metrics = this.getMetrics()
    
    let report = '📊 ALCHM Performance Report\n'
    report += '=' .repeat(40) + '\n\n'
    
    // Core Web Vitals
    report += '🎯 Core Web Vitals:\n'
    if (metrics.cls !== undefined) {
      report += `  CLS: ${metrics.cls.toFixed(3)} (${this.getMetricStatus('CLS', metrics.cls)})\n`
    }
    if (metrics.fid !== undefined) {
      report += `  FID: ${metrics.fid.toFixed(0)}ms (${this.getMetricStatus('FID', metrics.fid)})\n`
    }
    if (metrics.lcp !== undefined) {
      report += `  LCP: ${metrics.lcp.toFixed(0)}ms (${this.getMetricStatus('LCP', metrics.lcp)})\n`
    }
    if (metrics.fcp !== undefined) {
      report += `  FCP: ${metrics.fcp.toFixed(0)}ms (${this.getMetricStatus('FCP', metrics.fcp)})\n`
    }
    if (metrics.ttfb !== undefined) {
      report += `  TTFB: ${metrics.ttfb.toFixed(0)}ms (${this.getMetricStatus('TTFB', metrics.ttfb)})\n`
    }
    
    // Navigation timing
    report += '\n⏱️ Navigation Timing:\n'
    if (metrics.domContentLoaded !== undefined) {
      report += `  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(0)}ms\n`
    }
    if (metrics.loadComplete !== undefined) {
      report += `  Load Complete: ${metrics.loadComplete.toFixed(0)}ms\n`
    }
    
    // Resource loading
    report += '\n📦 Resource Loading:\n'
    if (metrics.jsLoadTime !== undefined) {
      report += `  JavaScript: ${metrics.jsLoadTime.toFixed(0)}ms\n`
    }
    if (metrics.cssLoadTime !== undefined) {
      report += `  CSS: ${metrics.cssLoadTime.toFixed(0)}ms\n`
    }
    if (metrics.imageLoadTime !== undefined) {
      report += `  Images: ${metrics.imageLoadTime.toFixed(0)}ms\n`
    }
    
    return report
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor()
  }
  return performanceMonitor!
}

// Performance optimization utilities
export class PerformanceOptimizer {
  // Preload critical resources
  static preloadResource(href: string, as: 'script' | 'style' | 'font' | 'image') {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      if (as === 'font') {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    }
  }

  // Prefetch next page resources
  static prefetchResource(href: string) {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }
  }

  // Lazy load images with Intersection Observer
  static lazyLoadImages() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              observer.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  // Optimize third-party scripts loading
  static loadThirdPartyScript(src: string, async: boolean = true, defer: boolean = false) {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = src
      script.async = async
      script.defer = defer
      document.head.appendChild(script)
    }
  }

  // Critical CSS injection
  static injectCriticalCSS(css: string) {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = css
      document.head.appendChild(style)
    }
  }
}

// Export performance monitoring hook for React components
export function usePerformanceMonitor() {
  const monitor = getPerformanceMonitor()
  
  return {
    getMetrics: () => monitor?.getMetrics(),
    generateReport: () => monitor?.generateReport(),
    isSupported: typeof window !== 'undefined' && 'PerformanceObserver' in window
  }
}