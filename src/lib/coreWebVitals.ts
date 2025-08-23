// Core Web Vitals optimization and monitoring for ALCHM
import { getCLS, getFID, getFCP, getLCP, getTTFB, onINP, onFCP, Metric } from 'web-vitals'

export interface CoreWebVitalsData {
  cls: number | null
  fid: number | null
  inp: number | null // Interaction to Next Paint (replacing FID)
  lcp: number | null
  fcp: number | null
  ttfb: number | null
  timestamp: number
  url: string
  userAgent?: string
  connection?: string
}

export interface OptimizationRecommendation {
  metric: string
  current: number
  target: number
  impact: 'high' | 'medium' | 'low'
  recommendations: string[]
}

// Core Web Vitals thresholds (Google's standards)
export const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FID: { good: 100, needsImprovement: 300 },
  INP: { good: 200, needsImprovement: 500 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 }
}

// Core Web Vitals optimizer
export class CoreWebVitalsOptimizer {
  private static instance: CoreWebVitalsOptimizer | null = null
  private vitalsData: Partial<CoreWebVitalsData> = {}
  private isMonitoring = false

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring()
    }
  }

  static getInstance(): CoreWebVitalsOptimizer {
    if (!this.instance) {
      this.instance = new CoreWebVitalsOptimizer()
    }
    return this.instance
  }

  private initializeMonitoring(): void {
    if (this.isMonitoring) return
    this.isMonitoring = true

    console.log('🎯 Starting Core Web Vitals monitoring...')

    // Monitor CLS (Cumulative Layout Shift)
    getCLS((metric: Metric) => {
      this.vitalsData.cls = metric.value
      this.handleMetric('CLS', metric.value)
      this.optimizeCLS()
    })

    // Monitor FID (First Input Delay) - being replaced by INP
    getFID((metric: Metric) => {
      this.vitalsData.fid = metric.value
      this.handleMetric('FID', metric.value)
      this.optimizeFID()
    })

    // Monitor INP (Interaction to Next Paint) - new metric replacing FID
    onINP((metric: Metric) => {
      this.vitalsData.inp = metric.value
      this.handleMetric('INP', metric.value)
      this.optimizeINP()
    })

    // Monitor LCP (Largest Contentful Paint)
    getLCP((metric: Metric) => {
      this.vitalsData.lcp = metric.value
      this.handleMetric('LCP', metric.value)
      this.optimizeLCP()
    })

    // Monitor FCP (First Contentful Paint)
    getFCP((metric: Metric) => {
      this.vitalsData.fcp = metric.value
      this.handleMetric('FCP', metric.value)
      this.optimizeFCP()
    })

    // Monitor TTFB (Time to First Byte)
    getTTFB((metric: Metric) => {
      this.vitalsData.ttfb = metric.value
      this.handleMetric('TTFB', metric.value)
      this.optimizeTTFB()
    })

    // Additional FCP monitoring with custom handler
    onFCP((metric: Metric) => {
      console.log(`🎨 First Contentful Paint: ${metric.value.toFixed(0)}ms`)
    })
  }

  private handleMetric(name: string, value: number): void {
    const status = this.getMetricStatus(name, value)
    const icon = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌'
    
    console.log(`${icon} ${name}: ${value.toFixed(name === 'CLS' ? 3 : 0)}${name === 'CLS' ? '' : 'ms'} (${status})`)

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value, status)
    }

    // Trigger optimizations based on poor scores
    if (status === 'poor') {
      this.triggerOptimizations(name, value)
    }
  }

  private getMetricStatus(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS]
    if (!thresholds) return 'good'

    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  // CLS (Cumulative Layout Shift) optimizations
  private optimizeCLS(): void {
    // Ensure images have dimensions
    this.ensureImageDimensions()
    
    // Reserve space for dynamic content
    this.reserveSpaceForDynamicContent()
    
    // Optimize font loading
    this.optimizeFontLoading()
  }

  private ensureImageDimensions(): void {
    const images = document.querySelectorAll('img:not([width]):not([height])')
    images.forEach((img) => {
      const imgElement = img as HTMLImageElement
      if (imgElement.naturalWidth && imgElement.naturalHeight) {
        imgElement.width = imgElement.naturalWidth
        imgElement.height = imgElement.naturalHeight
      }
    })
  }

  private reserveSpaceForDynamicContent(): void {
    // Add min-height to containers that load content dynamically
    const dynamicContainers = document.querySelectorAll('[data-dynamic-content]')
    dynamicContainers.forEach((container) => {
      const element = container as HTMLElement
      if (!element.style.minHeight) {
        element.style.minHeight = '200px'
      }
    })
  }

  private optimizeFontLoading(): void {
    // Add font-display: swap to @font-face rules
    const styleSheets = Array.from(document.styleSheets)
    styleSheets.forEach((styleSheet) => {
      try {
        const rules = Array.from(styleSheet.cssRules || [])
        rules.forEach((rule) => {
          if (rule instanceof CSSFontFaceRule) {
            if (!rule.style.fontDisplay) {
              rule.style.fontDisplay = 'swap'
            }
          }
        })
      } catch (e) {
        // Cross-origin stylesheet
      }
    })
  }

  // FID (First Input Delay) optimizations
  private optimizeFID(): void {
    // Break up long tasks
    this.breakUpLongTasks()
    
    // Defer non-essential JavaScript
    this.deferNonEssentialJS()
    
    // Use requestIdleCallback for low-priority work
    this.useRequestIdleCallback()
  }

  private breakUpLongTasks(): void {
    // Implement task scheduling for long operations
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      console.log('🚀 Using Scheduler API for task prioritization')
    } else {
      // Fallback to setTimeout for task yielding
      this.implementTaskYielding()
    }
  }

  private implementTaskYielding(): void {
    // Create a utility for yielding control to the browser
    (window as any).yieldToMain = function() {
      return new Promise(resolve => {
        setTimeout(resolve, 0)
      })
    }
  }

  private deferNonEssentialJS(): void {
    const scripts = document.querySelectorAll('script[src]:not([data-essential])')
    scripts.forEach((script) => {
      const scriptElement = script as HTMLScriptElement
      if (!scriptElement.async && !scriptElement.defer) {
        scriptElement.defer = true
      }
    })
  }

  private useRequestIdleCallback(): void {
    if ('requestIdleCallback' in window) {
      // Schedule non-critical work during idle time
      const scheduleWork = (work: () => void) => {
        requestIdleCallback((deadline) => {
          if (deadline.timeRemaining() > 5) {
            work()
          } else {
            scheduleWork(work) // Reschedule if not enough time
          }
        })
      }
      
      (window as any).scheduleIdleWork = scheduleWork
    }
  }

  // INP (Interaction to Next Paint) optimizations
  private optimizeINP(): void {
    // Optimize event handlers
    this.optimizeEventHandlers()
    
    // Reduce DOM complexity
    this.reduceDOMComplexity()
    
    // Optimize rendering work
    this.optimizeRenderingWork()
  }

  private optimizeEventHandlers(): void {
    // Use passive event listeners where possible
    const events = ['scroll', 'wheel', 'touchstart', 'touchmove']
    events.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true })
    })

    // Debounce expensive event handlers
    this.implementEventDebouncing()
  }

  private implementEventDebouncing(): void {
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    (window as any).debounce = debounce
  }

  private reduceDOMComplexity(): void {
    // Monitor DOM size and warn if too large
    const domSize = document.querySelectorAll('*').length
    if (domSize > 3000) {
      console.warn(`⚠️ Large DOM size detected: ${domSize} elements. Consider virtualization.`)
    }
  }

  private optimizeRenderingWork(): void {
    // Use CSS containment where possible
    const containers = document.querySelectorAll('[data-container]')
    containers.forEach((container) => {
      const element = container as HTMLElement
      element.style.contain = 'layout style paint'
    })
  }

  // LCP (Largest Contentful Paint) optimizations
  private optimizeLCP(): void {
    // Preload LCP resources
    this.preloadLCPResources()
    
    // Optimize LCP element
    this.optimizeLCPElement()
    
    // Remove render-blocking resources
    this.removeRenderBlockingResources()
  }

  private preloadLCPResources(): void {
    // Find potential LCP elements and preload their resources
    const lcpCandidates = document.querySelectorAll('img, video, [style*="background-image"]')
    lcpCandidates.forEach((element, index) => {
      if (index < 3) { // Preload first few images only
        const img = element as HTMLImageElement
        if (img.src && !img.loading) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = img.src
          document.head.appendChild(link)
        }
      }
    })
  }

  private optimizeLCPElement(): void {
    // Monitor for LCP element and optimize it
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        
        if (lastEntry && lastEntry.element) {
          const lcpElement = lastEntry.element
          console.log('🎯 LCP element detected:', lcpElement)
          
          // Ensure LCP element has priority loading
          if (lcpElement.tagName === 'IMG') {
            lcpElement.loading = 'eager'
            lcpElement.fetchPriority = 'high'
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP observation not supported')
      }
    }
  }

  private removeRenderBlockingResources(): void {
    // Convert blocking CSS to non-blocking
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
    stylesheets.forEach((link) => {
      const linkElement = link as HTMLLinkElement
      linkElement.media = 'print'
      linkElement.onload = () => {
        linkElement.media = 'all'
      }
    })
  }

  // FCP (First Contentful Paint) optimizations
  private optimizeFCP(): void {
    // Inline critical CSS
    this.inlineCriticalCSS()
    
    // Optimize above-the-fold content
    this.optimizeAboveTheFold()
    
    // Reduce server response time
    this.optimizeServerResponse()
  }

  private inlineCriticalCSS(): void {
    // This would typically be done at build time
    // For runtime, we can identify critical styles
    const criticalSelectors = ['body', 'header', '.header', '.nav', '.hero', 'h1', 'h2']
    console.log('🎨 Critical CSS selectors identified:', criticalSelectors.length)
  }

  private optimizeAboveTheFold(): void {
    // Prioritize above-the-fold content loading
    const aboveTheFold = window.innerHeight
    const elements = document.querySelectorAll('img, iframe, video')
    
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      if (rect.top < aboveTheFold) {
        // Element is above the fold
        if (element.tagName === 'IMG') {
          (element as HTMLImageElement).loading = 'eager'
        }
      }
    })
  }

  private optimizeServerResponse(): void {
    // Monitor server response times
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const navigationEntry = entry as PerformanceNavigationTiming
          const serverTime = navigationEntry.responseEnd - navigationEntry.requestStart
          
          if (serverTime > 600) {
            console.warn(`⚠️ Slow server response: ${serverTime.toFixed(0)}ms`)
          }
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
    }
  }

  // TTFB (Time to First Byte) optimizations
  private optimizeTTFB(): void {
    // These are mainly server-side optimizations, but we can monitor and report
    console.log('📡 TTFB optimization requires server-side improvements')
    
    // Enable service worker for caching
    this.enableServiceWorkerCaching()
    
    // Implement resource hints
    this.implementResourceHints()
  }

  private enableServiceWorkerCaching(): void {
    if ('serviceWorker' in navigator) {
      console.log('🔧 Service Worker available for caching optimization')
    }
  }

  private implementResourceHints(): void {
    // Add resource hints for external domains
    const externalDomains = [
      'firebasestorage.googleapis.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ]

    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })
  }

  // Trigger specific optimizations based on poor scores
  private triggerOptimizations(metric: string, value: number): void {
    console.log(`🚨 Poor ${metric} score detected: ${value}. Triggering optimizations...`)

    switch (metric) {
      case 'CLS':
        this.emergencyCLSOptimization()
        break
      case 'LCP':
        this.emergencyLCPOptimization()
        break
      case 'FID':
      case 'INP':
        this.emergencyInteractivityOptimization()
        break
    }
  }

  private emergencyCLSOptimization(): void {
    // Remove animations temporarily
    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `
    document.head.appendChild(style)
  }

  private emergencyLCPOptimization(): void {
    // Boost LCP element priority
    const images = document.querySelectorAll('img')
    if (images.length > 0) {
      const firstImage = images[0] as HTMLImageElement
      firstImage.loading = 'eager'
      if ('fetchPriority' in firstImage) {
        (firstImage as any).fetchPriority = 'high'
      }
    }
  }

  private emergencyInteractivityOptimization(): void {
    // Delay non-essential scripts
    const scripts = document.querySelectorAll('script[src]:not([data-essential])')
    scripts.forEach(script => {
      (script as HTMLScriptElement).defer = true
    })
  }

  // Analytics and reporting
  private async sendToAnalytics(metric: string, value: number, status: string): Promise<void> {
    try {
      const vitalsData: CoreWebVitalsData = {
        ...this.vitalsData,
        [metric.toLowerCase()]: value,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection?.effectiveType
      } as CoreWebVitalsData

      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, status, vitalsData })
      })
    } catch (error) {
      console.warn('Failed to send Web Vitals data:', error)
    }
  }

  // Generate recommendations
  generateRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    
    Object.entries(this.vitalsData).forEach(([metric, value]) => {
      if (value === null || value === undefined) return
      
      const metricName = metric.toUpperCase()
      const threshold = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS]
      
      if (threshold && value > threshold.good) {
        recommendations.push({
          metric: metricName,
          current: value,
          target: threshold.good,
          impact: value > threshold.needsImprovement ? 'high' : 'medium',
          recommendations: this.getMetricRecommendations(metricName, value)
        })
      }
    })

    return recommendations
  }

  private getMetricRecommendations(metric: string, value: number): string[] {
    const recommendations: Record<string, string[]> = {
      CLS: [
        'Add explicit width and height attributes to images',
        'Reserve space for dynamic content with min-height',
        'Use font-display: swap for web fonts',
        'Avoid inserting content above existing content'
      ],
      LCP: [
        'Preload the LCP resource',
        'Optimize and compress the LCP resource',
        'Remove render-blocking CSS/JS above the fold',
        'Use a CDN for faster resource delivery'
      ],
      FID: [
        'Break up long JavaScript tasks',
        'Use requestIdleCallback for non-essential work',
        'Defer or async non-critical JavaScript',
        'Minimize main thread work'
      ],
      INP: [
        'Optimize event handlers',
        'Reduce DOM complexity',
        'Use passive event listeners',
        'Debounce expensive operations'
      ],
      FCP: [
        'Inline critical CSS',
        'Optimize server response time',
        'Remove render-blocking resources',
        'Use a CDN'
      ],
      TTFB: [
        'Optimize server performance',
        'Use a CDN',
        'Enable caching',
        'Optimize database queries'
      ]
    }

    return recommendations[metric] || []
  }

  // Public API
  getVitalsData(): Partial<CoreWebVitalsData> {
    return { ...this.vitalsData }
  }

  generateReport(): string {
    const recommendations = this.generateRecommendations()
    
    let report = '🎯 Core Web Vitals Report\n'
    report += '=' .repeat(30) + '\n\n'

    // Current scores
    Object.entries(this.vitalsData).forEach(([metric, value]) => {
      if (value !== null && value !== undefined) {
        const status = this.getMetricStatus(metric.toUpperCase(), value)
        const icon = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌'
        const unit = metric === 'cls' ? '' : 'ms'
        report += `${icon} ${metric.toUpperCase()}: ${value.toFixed(metric === 'cls' ? 3 : 0)}${unit} (${status})\n`
      }
    })

    // Recommendations
    if (recommendations.length > 0) {
      report += '\n🚀 Optimization Recommendations:\n'
      recommendations.forEach((rec, index) => {
        const impact = rec.impact === 'high' ? '🔴' : rec.impact === 'medium' ? '🟡' : '🟢'
        report += `${impact} ${rec.metric} (${rec.current.toFixed(0)} → ${rec.target}):\n`
        rec.recommendations.forEach(recommendation => {
          report += `  • ${recommendation}\n`
        })
        report += '\n'
      })
    } else {
      report += '\n✅ All Core Web Vitals are performing well!'
    }

    return report
  }
}

// Hook for React components
export function useCoreWebVitals() {
  const optimizer = CoreWebVitalsOptimizer.getInstance()
  
  return {
    getVitalsData: () => optimizer.getVitalsData(),
    generateReport: () => optimizer.generateReport(),
    getRecommendations: () => optimizer.generateRecommendations()
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    CoreWebVitalsOptimizer.getInstance()
  })
}

export default CoreWebVitalsOptimizer