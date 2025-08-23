// Static asset optimization utilities for ALCHM
export interface FontDisplayConfig {
  family: string
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  preload: boolean
  fallback: string[]
}

export interface CSSOptimizationConfig {
  critical: boolean
  inline: boolean
  preload: boolean
  defer: boolean
}

// Font optimization utilities
export class FontOptimizer {
  // Critical fonts to preload
  private static CRITICAL_FONTS = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-regular.woff2',
    '/fonts/inter-medium.woff2'
  ]

  // Font display configurations
  private static FONT_CONFIGS: Record<string, FontDisplayConfig> = {
    'Inter': {
      family: 'Inter',
      display: 'swap',
      preload: true,
      fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
    },
    'Inter Variable': {
      family: 'Inter',
      display: 'swap',
      preload: true,
      fallback: ['Inter', 'system-ui', 'sans-serif']
    }
  }

  // Preload critical fonts
  static preloadCriticalFonts(): void {
    if (typeof window === 'undefined') return

    this.CRITICAL_FONTS.forEach(fontUrl => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = fontUrl
      document.head.appendChild(link)
    })
  }

  // Generate font-face CSS with optimizations
  static generateFontFace(config: FontDisplayConfig): string {
    return `
      @font-face {
        font-family: '${config.family}';
        font-display: ${config.display};
        src: url('/fonts/${config.family.toLowerCase().replace(/\s+/g, '-')}.woff2') format('woff2'),
             url('/fonts/${config.family.toLowerCase().replace(/\s+/g, '-')}.woff') format('woff');
      }
    `
  }

  // Get optimized font stack
  static getFontStack(fontFamily: string): string {
    const config = this.FONT_CONFIGS[fontFamily]
    if (!config) return fontFamily

    return [config.family, ...config.fallback].join(', ')
  }

  // Inject font preload links
  static injectFontPreloads(fonts: string[]): void {
    if (typeof window === 'undefined') return

    fonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      link.href = font
      document.head.appendChild(link)
    })
  }

  // Monitor font loading performance
  static monitorFontLoading(): void {
    if (typeof window === 'undefined' || !('fonts' in document)) return

    document.fonts.ready.then(() => {
      console.log('🔤 All fonts loaded')
    })

    // Monitor individual font loading
    document.fonts.addEventListener('loadingdone', (event) => {
      console.log(`🔤 Font loaded: ${event.fontface?.family}`)
    })

    document.fonts.addEventListener('loadingerror', (event) => {
      console.warn(`🔤 Font failed to load: ${event.fontface?.family}`)
    })
  }
}

// CSS optimization utilities
export class CSSOptimizer {
  // Critical CSS patterns for above-the-fold content
  private static CRITICAL_CSS_SELECTORS = [
    'html',
    'body',
    'header',
    'nav',
    '.header',
    '.nav',
    '.hero',
    '.main-content',
    '.loading',
    '.error',
    'h1',
    'h2',
    '.btn-primary',
    '.container',
    '.grid',
    '.flex'
  ]

  // Extract critical CSS from stylesheets
  static extractCriticalCSS(): string {
    if (typeof window === 'undefined') return ''

    let criticalCSS = ''
    
    // Get all stylesheets
    Array.from(document.styleSheets).forEach(styleSheet => {
      try {
        Array.from(styleSheet.cssRules || []).forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            // Check if selector matches critical patterns
            const isCritical = this.CRITICAL_CSS_SELECTORS.some(selector => 
              rule.selectorText?.includes(selector)
            )
            
            if (isCritical) {
              criticalCSS += rule.cssText + '\n'
            }
          }
        })
      } catch (e) {
        // Cross-origin stylesheet - skip
      }
    })

    return criticalCSS
  }

  // Inline critical CSS
  static inlineCriticalCSS(css: string): void {
    if (typeof window === 'undefined') return

    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-critical', 'true')
    document.head.appendChild(style)
  }

  // Defer non-critical CSS loading
  static deferNonCriticalCSS(): void {
    if (typeof window === 'undefined') return

    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
    
    stylesheets.forEach(link => {
      const linkElement = link as HTMLLinkElement
      
      // Convert to preload and load asynchronously
      linkElement.rel = 'preload'
      linkElement.as = 'style'
      
      linkElement.onload = () => {
        linkElement.rel = 'stylesheet'
      }
    })
  }

  // Remove unused CSS (basic implementation)
  static removeUnusedCSS(): void {
    if (typeof window === 'undefined') return

    const usedSelectors = new Set<string>()
    
    // Collect all used classes and IDs
    document.querySelectorAll('*').forEach(element => {
      element.classList.forEach(className => {
        usedSelectors.add(`.${className}`)
      })
      
      if (element.id) {
        usedSelectors.add(`#${element.id}`)
      }
    })

    // This is a simplified version - in production, use tools like PurgeCSS
    console.log(`🎨 Found ${usedSelectors.size} used CSS selectors`)
  }

  // Optimize CSS delivery
  static optimizeCSSDelivery(configs: Record<string, CSSOptimizationConfig>): void {
    Object.entries(configs).forEach(([href, config]) => {
      const link = document.querySelector(`link[href="${href}"]`) as HTMLLinkElement
      if (!link) return

      if (config.critical) {
        // Keep as blocking
        return
      }

      if (config.preload) {
        link.rel = 'preload'
        link.as = 'style'
        
        if (config.defer) {
          link.onload = () => {
            setTimeout(() => {
              link.rel = 'stylesheet'
            }, 100)
          }
        }
      }
    })
  }
}

// Static asset utilities
export class StaticAssetOptimizer {
  // Preload critical static assets
  static preloadCriticalAssets(assets: Array<{
    href: string
    as: 'script' | 'style' | 'font' | 'image' | 'document'
    type?: string
    crossorigin?: boolean
  }>): void {
    if (typeof window === 'undefined') return

    assets.forEach(asset => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = asset.href
      link.as = asset.as
      
      if (asset.type) {
        link.type = asset.type
      }
      
      if (asset.crossorigin) {
        link.crossOrigin = 'anonymous'
      }
      
      document.head.appendChild(link)
    })
  }

  // Prefetch next page assets
  static prefetchAssets(assets: string[]): void {
    if (typeof window === 'undefined') return

    assets.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    })
  }

  // Enable resource hints
  static enableResourceHints(domains: string[]): void {
    if (typeof window === 'undefined') return

    domains.forEach(domain => {
      // DNS prefetch
      const dnsPrefetch = document.createElement('link')
      dnsPrefetch.rel = 'dns-prefetch'
      dnsPrefetch.href = `//${domain}`
      document.head.appendChild(dnsPrefetch)

      // Preconnect for critical domains
      if (domain.includes('firebase') || domain.includes('google')) {
        const preconnect = document.createElement('link')
        preconnect.rel = 'preconnect'
        preconnect.href = `https://${domain}`
        preconnect.crossOrigin = 'anonymous'
        document.head.appendChild(preconnect)
      }
    })
  }

  // Monitor asset loading performance
  static monitorAssetLoading(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming
        const loadTime = resource.responseEnd - resource.requestStart
        
        // Log slow loading assets
        if (loadTime > 1000) {
          console.warn(`Slow asset load (${loadTime.toFixed(0)}ms):`, resource.name)
        }
        
        // Track different asset types
        const url = new URL(resource.name)
        const ext = url.pathname.split('.').pop()?.toLowerCase()
        
        switch (ext) {
          case 'css':
            console.log(`🎨 CSS loaded: ${loadTime.toFixed(0)}ms - ${url.pathname}`)
            break
          case 'js':
            console.log(`📜 JS loaded: ${loadTime.toFixed(0)}ms - ${url.pathname}`)
            break
          case 'woff':
          case 'woff2':
            console.log(`🔤 Font loaded: ${loadTime.toFixed(0)}ms - ${url.pathname}`)
            break
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
  }

  // Generate asset manifest for caching
  static generateAssetManifest(): Record<string, any> {
    if (typeof window === 'undefined') return {}

    const manifest: Record<string, any> = {
      fonts: [],
      css: [],
      js: [],
      images: []
    }

    // Collect fonts
    document.querySelectorAll('link[as="font"]').forEach(link => {
      manifest.fonts.push({
        href: (link as HTMLLinkElement).href,
        preload: link.getAttribute('rel') === 'preload'
      })
    })

    // Collect CSS
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      manifest.css.push({
        href: (link as HTMLLinkElement).href,
        critical: link.hasAttribute('data-critical')
      })
    })

    // Collect JS
    document.querySelectorAll('script[src]').forEach(script => {
      manifest.js.push({
        src: (script as HTMLScriptElement).src,
        async: (script as HTMLScriptElement).async,
        defer: (script as HTMLScriptElement).defer
      })
    })

    return manifest
  }
}

// Asset optimization manager
export class AssetOptimizationManager {
  private static initialized = false

  // Initialize all asset optimizations
  static initialize(): void {
    if (this.initialized || typeof window === 'undefined') return

    console.log('🚀 Initializing asset optimizations...')

    // Font optimizations
    FontOptimizer.preloadCriticalFonts()
    FontOptimizer.monitorFontLoading()

    // CSS optimizations
    const criticalCSS = CSSOptimizer.extractCriticalCSS()
    if (criticalCSS) {
      CSSOptimizer.inlineCriticalCSS(criticalCSS)
    }
    CSSOptimizer.deferNonCriticalCSS()

    // Static asset optimizations
    StaticAssetOptimizer.enableResourceHints([
      'firebasestorage.googleapis.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ])
    
    StaticAssetOptimizer.monitorAssetLoading()

    this.initialized = true
    console.log('✅ Asset optimizations initialized')
  }

  // Preload assets for next page
  static preloadForRoute(route: string): void {
    const routeAssets: Record<string, string[]> = {
      '/journals': [
        '/api/journals',
        '/static/css/journals.css'
      ],
      '/profile': [
        '/api/user/profile',
        '/static/css/profile.css'
      ]
    }

    const assets = routeAssets[route]
    if (assets) {
      StaticAssetOptimizer.prefetchAssets(assets)
    }
  }

  // Generate optimization report
  static generateReport(): string {
    let report = '🏗️ Asset Optimization Report\n'
    report += '=' .repeat(35) + '\n\n'

    // Font analysis
    const fontLinks = document.querySelectorAll('link[as="font"]')
    report += `🔤 Fonts: ${fontLinks.length} preloaded\n`

    // CSS analysis
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]')
    const criticalCSS = document.querySelectorAll('style[data-critical]')
    report += `🎨 CSS: ${cssLinks.length} external, ${criticalCSS.length} critical inline\n`

    // Resource hints
    const dnsPrefetch = document.querySelectorAll('link[rel="dns-prefetch"]')
    const preconnect = document.querySelectorAll('link[rel="preconnect"]')
    report += `🔗 Resource Hints: ${dnsPrefetch.length} DNS prefetch, ${preconnect.length} preconnect\n`

    return report
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AssetOptimizationManager.initialize()
  })
}