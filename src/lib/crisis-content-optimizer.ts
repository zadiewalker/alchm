/**
 * Crisis-Sensitive Content Loading Optimizer
 * Trauma-informed performance optimizations for crisis-critical content
 */

export interface CrisisContentConfig {
  enablePreloading: boolean
  enableResourceHints: boolean
  enableInlineCriticalCSS: boolean
  enableImageOptimization: boolean
  emergencyMode: boolean
  networkThreshold: 'fast-3g' | 'slow-3g' | '2g'
}

export interface CrisisResource {
  type: 'css' | 'js' | 'image' | 'font' | 'prefetch'
  url: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  conditions?: {
    crisisPage?: boolean
    slowNetwork?: boolean
    lowMemory?: boolean
  }
}

const DEFAULT_CONFIG: CrisisContentConfig = {
  enablePreloading: true,
  enableResourceHints: true,
  enableInlineCriticalCSS: true,
  enableImageOptimization: true,
  emergencyMode: false,
  networkThreshold: 'slow-3g'
}

// Critical resources for crisis situations
const CRISIS_CRITICAL_RESOURCES: CrisisResource[] = [
  // Critical CSS for crisis pages
  {
    type: 'css',
    url: '/css/crisis-critical.css',
    priority: 'critical',
    conditions: { crisisPage: true }
  },
  
  // Emergency JavaScript
  {
    type: 'js',
    url: '/js/crisis-support.js',
    priority: 'critical',
    conditions: { crisisPage: true }
  },
  
  // Crisis hotline resources
  {
    type: 'prefetch',
    url: '/api/crisis-resources',
    priority: 'critical',
    conditions: { crisisPage: true }
  },
  
  // Emergency contact data
  {
    type: 'prefetch',
    url: '/api/emergency-contacts',
    priority: 'critical',
    conditions: { crisisPage: true }
  },
  
  // Critical fonts for readability
  {
    type: 'font',
    url: '/fonts/inter-var.woff2',
    priority: 'high',
    conditions: { crisisPage: true }
  }
]

export class CrisisContentOptimizer {
  private static instance: CrisisContentOptimizer | null = null
  private config: CrisisContentConfig
  private networkInfo: any
  private memoryInfo: any
  private isCrisisPage: boolean = false
  private isLowEndDevice: boolean = false
  private observers: IntersectionObserver[] = []

  constructor(config: Partial<CrisisContentConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.networkInfo = this.getNetworkInfo()
    this.memoryInfo = this.getMemoryInfo()
    this.isCrisisPage = this.detectCrisisPage()
    this.isLowEndDevice = this.detectLowEndDevice()
  }

  static getInstance(config?: Partial<CrisisContentConfig>): CrisisContentOptimizer {
    if (!this.instance) {
      this.instance = new CrisisContentOptimizer(config)
    }
    return this.instance
  }

  public async initialize(): Promise<void> {
    if (typeof window === 'undefined') return

    console.log('🚨 Initializing crisis-sensitive content optimizer...')

    try {
      // Apply emergency optimizations if needed
      if (this.config.emergencyMode) {
        await this.enableEmergencyMode()
      }

      // Optimize for crisis pages
      if (this.isCrisisPage) {
        await this.optimizeCrisisPage()
      }

      // Set up intelligent preloading
      if (this.config.enablePreloading) {
        this.initializeIntelligentPreloading()
      }

      // Configure resource hints
      if (this.config.enableResourceHints) {
        this.configureResourceHints()
      }

      // Optimize images
      if (this.config.enableImageOptimization) {
        this.optimizeImages()
      }

      // Set up network-aware loading
      this.setupNetworkAwareLoading()

      // Initialize crisis-specific lazy loading
      this.initializeCrisisLazyLoading()

      console.log('✅ Crisis content optimizer initialized')

    } catch (error) {
      console.error('❌ Failed to initialize crisis content optimizer:', error)
    }
  }

  private detectCrisisPage(): boolean {
    if (typeof window === 'undefined') return false

    const path = window.location.pathname.toLowerCase()
    const crisisPaths = [
      '/crisis',
      '/emergency',
      '/support',
      '/help',
      '/hotline',
      '/resources'
    ]

    return crisisPaths.some(crisisPath => path.includes(crisisPath))
  }

  private detectLowEndDevice(): boolean {
    if (typeof navigator === 'undefined') return false

    // Check device memory
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2) {
      return true
    }

    // Check hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      return true
    }

    // Check user agent for low-end devices
    const lowEndPatterns = [
      /Android [4-6]/,
      /iPhone OS [1-9]_/,
      /Opera Mini/
    ]

    return lowEndPatterns.some(pattern => pattern.test(navigator.userAgent))
  }

  private getNetworkInfo(): any {
    if (typeof navigator === 'undefined') return null

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    } : null
  }

  private getMemoryInfo(): any {
    if (typeof performance === 'undefined') return null

    return (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
    } : null
  }

  private async enableEmergencyMode(): Promise<void> {
    console.log('🚨 Enabling emergency mode optimizations')

    // Disable non-essential features
    this.disableNonEssentialFeatures()

    // Enable aggressive caching
    this.enableAggressiveCaching()

    // Reduce animation and transitions
    this.reduceAnimations()

    // Preload emergency resources immediately
    await this.preloadEmergencyResources()

    document.body.classList.add('emergency-mode')
  }

  private async optimizeCrisisPage(): Promise<void> {
    console.log('🎯 Applying crisis page optimizations')

    // Preload crisis-critical resources
    await this.preloadCrisisResources()

    // Inline critical CSS
    if (this.config.enableInlineCriticalCSS) {
      await this.inlineCriticalCSS()
    }

    // Prioritize above-the-fold content
    this.prioritizeAboveTheFold()

    // Set up emergency resource monitoring
    this.monitorEmergencyResources()
  }

  private async preloadCrisisResources(): Promise<void> {
    const criticalResources = CRISIS_CRITICAL_RESOURCES.filter(resource => {
      if (!resource.conditions) return true

      const conditions = resource.conditions
      
      if (conditions.crisisPage && !this.isCrisisPage) return false
      if (conditions.slowNetwork && !this.isSlowNetwork()) return false
      if (conditions.lowMemory && !this.isLowMemoryDevice()) return false

      return true
    })

    for (const resource of criticalResources) {
      await this.preloadResource(resource)
    }
  }

  private async preloadResource(resource: CrisisResource): Promise<void> {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.url

    switch (resource.type) {
      case 'css':
        link.as = 'style'
        break
      case 'js':
        link.as = 'script'
        break
      case 'font':
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
        break
      case 'image':
        link.as = 'image'
        break
      case 'prefetch':
        link.rel = 'prefetch'
        break
    }

    // Set fetch priority based on resource priority
    if ('fetchPriority' in link) {
      switch (resource.priority) {
        case 'critical':
          (link as any).fetchPriority = 'high'
          break
        case 'high':
          (link as any).fetchPriority = 'high'
          break
        case 'medium':
          (link as any).fetchPriority = 'auto'
          break
        case 'low':
          (link as any).fetchPriority = 'low'
          break
      }
    }

    document.head.appendChild(link)

    // Log for monitoring
    console.log(`🚀 Preloaded ${resource.priority} resource: ${resource.url}`)
  }

  private async preloadEmergencyResources(): Promise<void> {
    const emergencyResources = [
      '/api/crisis-resources',
      '/crisis-support',
      '/emergency-contacts',
      '/css/emergency-mode.css'
    ]

    emergencyResources.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })
  }

  private async inlineCriticalCSS(): Promise<void> {
    try {
      // This would typically be done at build time, but we can enhance at runtime
      const criticalCSS = await this.getCriticalCSS()
      
      if (criticalCSS) {
        const style = document.createElement('style')
        style.textContent = criticalCSS
        style.setAttribute('data-critical', 'true')
        document.head.insertBefore(style, document.head.firstChild)
        
        console.log('📝 Critical CSS inlined for crisis page')
      }
    } catch (error) {
      console.warn('Failed to inline critical CSS:', error)
    }
  }

  private async getCriticalCSS(): Promise<string | null> {
    // In production, this would be generated at build time
    // For now, return basic critical styles for crisis pages
    if (!this.isCrisisPage) return null

    return `
      /* Crisis page critical CSS */
      .crisis-banner {
        background: #dc2626;
        color: white;
        padding: 1rem;
        text-align: center;
        font-weight: bold;
      }
      
      .emergency-button {
        background: #dc2626;
        color: white;
        border: none;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border-radius: 0.5rem;
        cursor: pointer;
        display: block;
        width: 100%;
        max-width: 300px;
        margin: 1rem auto;
      }
      
      .crisis-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
        line-height: 1.6;
      }
      
      .loading-skeleton {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `
  }

  private prioritizeAboveTheFold(): void {
    const aboveTheFoldElements = document.querySelectorAll('[data-above-fold]')
    
    aboveTheFoldElements.forEach(element => {
      // Prioritize images above the fold
      if (element.tagName === 'IMG') {
        const img = element as HTMLImageElement
        img.loading = 'eager'
        if ('fetchPriority' in img) {
          (img as any).fetchPriority = 'high'
        }
      }
      
      // Prioritize videos above the fold
      if (element.tagName === 'VIDEO') {
        const video = element as HTMLVideoElement
        video.preload = 'metadata'
      }
    })
  }

  private initializeIntelligentPreloading(): void {
    // Preload resources based on user interaction patterns
    this.setupHoverPreloading()
    
    // Preload next likely pages
    this.setupPredictivePreloading()
    
    // Preload on viewport approach
    this.setupViewportPreloading()
  }

  private setupHoverPreloading(): void {
    // Preload links on hover with debouncing
    let hoverTimeout: number

    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement

      if (link && link.href && this.shouldPreloadLink(link.href)) {
        clearTimeout(hoverTimeout)
        hoverTimeout = window.setTimeout(() => {
          this.preloadPage(link.href)
        }, 100) // 100ms delay to avoid preloading on quick mouseovers
      }
    })

    document.addEventListener('mouseout', () => {
      clearTimeout(hoverTimeout)
    })
  }

  private setupPredictivePreloading(): void {
    // Preload likely next pages based on current page
    const currentPath = window.location.pathname
    const predictivePreloads = this.getPredictivePreloads(currentPath)
    
    predictivePreloads.forEach(url => {
      this.preloadPage(url)
    })
  }

  private setupViewportPreloading(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          const preloadUrl = element.getAttribute('data-preload')
          
          if (preloadUrl) {
            this.preloadPage(preloadUrl)
            observer.unobserve(element)
          }
        }
      })
    }, {
      rootMargin: '50px' // Start preloading 50px before element enters viewport
    })

    // Observe elements with data-preload attribute
    document.querySelectorAll('[data-preload]').forEach(element => {
      observer.observe(element)
    })

    this.observers.push(observer)
  }

  private shouldPreloadLink(href: string): boolean {
    // Don't preload external links
    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      return false
    }
    
    // Don't preload if on slow network and save-data is enabled
    if (this.networkInfo?.saveData && this.isSlowNetwork()) {
      return false
    }
    
    // Always preload crisis-related links
    if (href.includes('crisis') || href.includes('emergency') || href.includes('support')) {
      return true
    }
    
    // Don't preload if low memory
    if (this.isLowMemoryDevice()) {
      return false
    }
    
    return true
  }

  private preloadPage(url: string): void {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  }

  private getPredictivePreloads(currentPath: string): string[] {
    const preloads: string[] = []
    
    // Crisis-specific predictive preloading
    if (currentPath === '/') {
      preloads.push('/journal', '/crisis-support')
    }
    
    if (currentPath.includes('journal')) {
      preloads.push('/journals', '/crisis-support')
    }
    
    if (currentPath.includes('auth')) {
      preloads.push('/dashboard', '/journal')
    }
    
    return preloads
  }

  private configureResourceHints(): void {
    // DNS prefetch for critical domains
    const criticalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ]

    criticalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })

    // Preconnect to critical origins
    const criticalOrigins = [
      'https://fonts.googleapis.com'
    ]

    criticalOrigins.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  private optimizeImages(): void {
    // Set up lazy loading for non-critical images
    const images = document.querySelectorAll('img:not([data-critical])')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          
          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src
          }
          
          // Add loading class
          img.classList.add('loading')
          
          img.onload = () => {
            img.classList.remove('loading')
            img.classList.add('loaded')
          }
          
          imageObserver.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px'
    })

    images.forEach(img => {
      // Skip images above the fold or marked as critical
      if (img.hasAttribute('data-above-fold') || img.hasAttribute('data-critical')) {
        return
      }
      
      imageObserver.observe(img)
    })

    this.observers.push(imageObserver)
  }

  private setupNetworkAwareLoading(): void {
    if (!this.networkInfo) return

    // Adjust loading strategy based on network conditions
    if (this.isSlowNetwork()) {
      this.enableSlowNetworkOptimizations()
    }

    // Listen for network changes
    if (this.networkInfo.addEventListener) {
      this.networkInfo.addEventListener('change', () => {
        this.networkInfo = this.getNetworkInfo()
        
        if (this.isSlowNetwork()) {
          this.enableSlowNetworkOptimizations()
        } else {
          this.disableSlowNetworkOptimizations()
        }
      })
    }
  }

  private enableSlowNetworkOptimizations(): void {
    console.log('🐌 Enabling slow network optimizations')
    
    // Reduce image quality
    document.body.classList.add('slow-network')
    
    // Disable non-essential preloading
    // (Implementation would disable certain preload operations)
    
    // Enable data saver mode
    this.enableDataSaverMode()
  }

  private disableSlowNetworkOptimizations(): void {
    document.body.classList.remove('slow-network')
    this.disableDataSaverMode()
  }

  private enableDataSaverMode(): void {
    document.body.classList.add('data-saver')
    
    // Disable background images
    const style = document.createElement('style')
    style.textContent = `
      .data-saver .background-image {
        background-image: none !important;
      }
      
      .data-saver video {
        display: none;
      }
      
      .data-saver .non-essential {
        display: none;
      }
    `
    style.setAttribute('data-data-saver', 'true')
    document.head.appendChild(style)
  }

  private disableDataSaverMode(): void {
    document.body.classList.remove('data-saver')
    const dataSaverStyle = document.querySelector('[data-data-saver="true"]')
    if (dataSaverStyle) {
      dataSaverStyle.remove()
    }
  }

  private initializeCrisisLazyLoading(): void {
    // Custom lazy loading for crisis-sensitive content
    const lazyElements = document.querySelectorAll('[data-crisis-lazy]')
    
    const crisisObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          const loadAction = element.getAttribute('data-crisis-lazy')
          
          switch (loadAction) {
            case 'load-content':
              this.loadCrisisContent(element)
              break
            case 'load-resources':
              this.loadCrisisResources(element)
              break
            case 'activate-feature':
              this.activateCrisisFeature(element)
              break
          }
          
          crisisObserver.unobserve(element)
        }
      })
    }, {
      // Load crisis content earlier than normal content
      rootMargin: this.isCrisisPage ? '100px' : '50px'
    })

    lazyElements.forEach(element => {
      crisisObserver.observe(element)
    })

    this.observers.push(crisisObserver)
  }

  private async loadCrisisContent(element: HTMLElement): Promise<void> {
    const contentUrl = element.getAttribute('data-content-url')
    if (!contentUrl) return

    try {
      const response = await fetch(contentUrl)
      const content = await response.text()
      element.innerHTML = content
      element.classList.add('crisis-content-loaded')
    } catch (error) {
      console.error('Failed to load crisis content:', error)
      element.innerHTML = '<p>Content temporarily unavailable. Please refresh the page.</p>'
    }
  }

  private async loadCrisisResources(element: HTMLElement): Promise<void> {
    const resourceUrls = element.getAttribute('data-resource-urls')?.split(',') || []
    
    for (const url of resourceUrls) {
      await this.preloadResource({
        type: 'prefetch',
        url: url.trim(),
        priority: 'high'
      })
    }
  }

  private activateCrisisFeature(element: HTMLElement): void {
    const featureName = element.getAttribute('data-feature-name')
    if (!featureName) return

    // Activate specific crisis features on demand
    switch (featureName) {
      case 'emergency-chat':
        this.initializeEmergencyChat(element)
        break
      case 'crisis-hotline':
        this.initializeCrisisHotline(element)
        break
      case 'immediate-help':
        this.initializeImmediateHelp(element)
        break
    }
  }

  private initializeEmergencyChat(element: HTMLElement): void {
    // Load emergency chat component
    element.innerHTML = `
      <div class="emergency-chat">
        <button class="emergency-chat-button">
          🆘 Start Emergency Chat
        </button>
      </div>
    `
  }

  private initializeCrisisHotline(element: HTMLElement): void {
    // Load crisis hotline component
    element.innerHTML = `
      <div class="crisis-hotline">
        <a href="tel:988" class="crisis-hotline-button">
          📞 Call 988 - Crisis Lifeline
        </a>
      </div>
    `
  }

  private initializeImmediateHelp(element: HTMLElement): void {
    // Load immediate help resources
    element.innerHTML = `
      <div class="immediate-help">
        <h3>Immediate Help Resources</h3>
        <ul>
          <li><a href="tel:911">🚨 Emergency: 911</a></li>
          <li><a href="tel:988">💙 Crisis Lifeline: 988</a></li>
          <li><a href="/crisis-support">🫂 Crisis Support</a></li>
        </ul>
      </div>
    `
  }

  // Utility methods
  private isSlowNetwork(): boolean {
    if (!this.networkInfo) return false
    
    return this.networkInfo.effectiveType === '2g' || 
           this.networkInfo.effectiveType === 'slow-2g' ||
           this.networkInfo.downlink < 1.0
  }

  private isLowMemoryDevice(): boolean {
    if (!this.memoryInfo) return this.isLowEndDevice
    
    const usageRatio = this.memoryInfo.usedJSHeapSize / this.memoryInfo.jsHeapSizeLimit
    return usageRatio > 0.8 || this.isLowEndDevice
  }

  private disableNonEssentialFeatures(): void {
    document.body.classList.add('essential-only')
    
    // Hide non-essential elements
    const nonEssentialElements = document.querySelectorAll('.non-essential, .optional, .enhancement')
    nonEssentialElements.forEach(element => {
      (element as HTMLElement).style.display = 'none'
    })
  }

  private enableAggressiveCaching(): void {
    // Enable service worker aggressive caching if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update()
      })
    }
  }

  private reduceAnimations(): void {
    const style = document.createElement('style')
    style.textContent = `
      .emergency-mode *,
      .emergency-mode *::before,
      .emergency-mode *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `
    style.setAttribute('data-emergency-animations', 'true')
    document.head.appendChild(style)
  }

  private monitorEmergencyResources(): void {
    // Monitor critical crisis resources loading
    const criticalSelectors = [
      '.emergency-button',
      '.crisis-banner',
      '.crisis-hotline',
      '.immediate-help'
    ]

    criticalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        if (!element.classList.contains('loaded')) {
          console.warn(`Critical crisis element not loaded: ${selector}`)
        }
      })
    })
  }

  // Public API
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  public enableEmergencyModePublic(): void {
    this.config.emergencyMode = true
    this.enableEmergencyMode()
  }

  public getNetworkCondition(): string {
    return this.networkInfo?.effectiveType || 'unknown'
  }

  public isCrisisPageActive(): boolean {
    return this.isCrisisPage
  }

  public isLowEndDeviceActive(): boolean {
    return this.isLowEndDevice
  }
}

// Global instance
export const crisisContentOptimizer = CrisisContentOptimizer.getInstance()

// React hook
export const useCrisisContentOptimizer = () => {
  return {
    optimizer: crisisContentOptimizer,
    enableEmergencyMode: () => crisisContentOptimizer.enableEmergencyModePublic(),
    getNetworkCondition: () => crisisContentOptimizer.getNetworkCondition(),
    isCrisisPage: () => crisisContentOptimizer.isCrisisPageActive(),
    isLowEndDevice: () => crisisContentOptimizer.isLowEndDeviceActive()
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    crisisContentOptimizer.initialize()
  })
}

export default crisisContentOptimizer