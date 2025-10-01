/**
 * FIREBASE HOSTING OPTIMIZATION FOR ALCHM
 * 
 * MISSION: Ensure fastest possible content delivery for users in crisis
 * Optimizes CDN, caching, and edge delivery for trauma-informed support
 */

export interface OptimizationConfig {
  enableCompression: boolean;
  enableCaching: boolean;
  enablePrefetch: boolean;
  enablePreload: boolean;
  enableServiceWorker: boolean;
  enableHTTP2Push: boolean;
  optimizeImages: boolean;
  enableCDN: boolean;
}

export interface CacheStrategy {
  staticAssets: number; // seconds
  dynamicContent: number;
  apiResponses: number;
  crisisResources: number;
  offlineContent: number;
}

export interface CompressionConfig {
  gzip: boolean;
  brotli: boolean;
  minimumSize: number; // bytes
  fileTypes: string[];
}

// Crisis-optimized caching strategy
export const CRISIS_CACHE_STRATEGY: CacheStrategy = {
  staticAssets: 31536000, // 1 year for static assets
  dynamicContent: 300, // 5 minutes for dynamic content
  apiResponses: 60, // 1 minute for API responses
  crisisResources: 86400, // 24 hours for crisis resources (but always check freshness)
  offlineContent: 604800 // 1 week for offline fallback content
};

// Optimized compression configuration
export const COMPRESSION_CONFIG: CompressionConfig = {
  gzip: true,
  brotli: true,
  minimumSize: 1024, // Only compress files > 1KB
  fileTypes: [
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json',
    'text/xml',
    'application/xml',
    'image/svg+xml',
    'text/plain'
  ]
};

export class FirebaseHostingOptimizer {
  private static instance: FirebaseHostingOptimizer | null = null;
  private config: OptimizationConfig;
  private isOptimized = false;

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableCompression: true,
      enableCaching: true,
      enablePrefetch: true,
      enablePreload: true,
      enableServiceWorker: true,
      enableHTTP2Push: false, // Firebase Hosting doesn't support HTTP/2 Server Push
      optimizeImages: true,
      enableCDN: true,
      ...config
    };
  }

  static getInstance(config?: Partial<OptimizationConfig>): FirebaseHostingOptimizer {
    if (!this.instance) {
      this.instance = new FirebaseHostingOptimizer(config);
    }
    return this.instance;
  }

  async optimizeForCrisisSupport(): Promise<void> {
    if (this.isOptimized) return;

    console.log('🚀 Optimizing Firebase Hosting for Crisis Support...');

    if (typeof window !== 'undefined') {
      // Client-side optimizations
      await this.implementClientSideOptimizations();
    }

    this.isOptimized = true;
    console.log('✅ Firebase Hosting Optimization Complete');
  }

  private async implementClientSideOptimizations(): Promise<void> {
    // Preload critical resources
    if (this.config.enablePreload) {
      this.preloadCriticalResources();
    }

    // Setup prefetching for likely next pages
    if (this.config.enablePrefetch) {
      this.setupIntelligentPrefetching();
    }

    // Optimize images
    if (this.config.optimizeImages) {
      this.optimizeImages();
    }

    // Setup service worker for offline support
    if (this.config.enableServiceWorker) {
      await this.setupServiceWorker();
    }

    // Implement advanced caching
    if (this.config.enableCaching) {
      this.implementAdvancedCaching();
    }

    // Setup CDN optimizations
    if (this.config.enableCDN) {
      this.optimizeCDNDelivery();
    }
  }

  private preloadCriticalResources(): void {
    console.log('⚡ Preloading critical resources...');

    // Critical CSS and fonts
    const criticalResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/css/critical.css', as: 'style' },
      { href: '/icons/favicon.svg', as: 'image' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      
      document.head.appendChild(link);
    });

    // Preload crisis resources immediately
    this.preloadCrisisResources();
  }

  private preloadCrisisResources(): void {
    console.log('🆘 Preloading crisis support resources...');

    const crisisResources = [
      '/crisis-resources',
      '/emergency-contacts',
      '/api/crisis-detection',
      '/offline-crisis-support'
    ];

    crisisResources.forEach(resource => {
      // Use different strategies based on resource type
      if (resource.startsWith('/api/')) {
        // For API endpoints, just establish connection
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = resource;
        document.head.appendChild(link);
      } else {
        // For pages, prefetch the content
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      }
    });

    // Preconnect to external crisis services
    this.preconnectToCrisisServices();
  }

  private preconnectToCrisisServices(): void {
    const externalServices = [
      'https://988lifeline.org',
      'https://suicidepreventionlifeline.org',
      'https://www.crisistextline.org'
    ];

    externalServices.forEach(service => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = service;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  private setupIntelligentPrefetching(): void {
    console.log('🧠 Setting up intelligent prefetching...');

    // Prefetch based on user behavior patterns
    const highProbabilityRoutes = [
      { from: '/', to: '/journal', probability: 0.8 },
      { from: '/journal', to: '/journals', probability: 0.6 },
      { from: '/dashboard', to: '/journal', probability: 0.7 },
      { from: '*', to: '/crisis-resources', probability: 0.3 } // Always have some probability
    ];

    const currentPath = window.location.pathname;
    
    highProbabilityRoutes.forEach(route => {
      if (route.from === '*' || route.from === currentPath) {
        if (Math.random() < route.probability) {
          this.prefetchRoute(route.to);
        }
      }
    });

    // Setup hover-based prefetching for links
    this.setupHoverPrefetching();

    // Setup viewport-based prefetching
    this.setupViewportPrefetching();
  }

  private prefetchRoute(route: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  private setupHoverPrefetching(): void {
    // Prefetch on hover with debouncing
    let hoverTimeout: NodeJS.Timeout;

    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && link.origin === window.location.origin) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          this.prefetchRoute(link.pathname);
        }, 100); // 100ms delay to avoid over-prefetching
      }
    });
  }

  private setupViewportPrefetching(): void {
    // Prefetch links when they enter the viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            if (link.href && link.origin === window.location.origin) {
              this.prefetchRoute(link.pathname);
              observer.unobserve(link); // Only prefetch once
            }
          }
        });
      }, { rootMargin: '50px' });

      // Observe all internal links
      document.querySelectorAll('a[href]').forEach(link => {
        const anchor = link as HTMLAnchorElement;
        if (anchor.origin === window.location.origin) {
          observer.observe(anchor);
        }
      });
    }
  }

  private optimizeImages(): void {
    console.log('🖼️ Optimizing image delivery...');

    // Implement responsive images
    this.implementResponsiveImages();

    // Setup lazy loading for non-critical images
    this.setupLazyLoading();

    // Optimize image formats
    this.optimizeImageFormats();
  }

  private implementResponsiveImages(): void {
    const images = document.querySelectorAll('img:not([srcset])');
    
    images.forEach(img => {
      const image = img as HTMLImageElement;
      
      // Only process images that don't already have srcset
      if (!image.srcset && image.src) {
        const baseSrc = image.src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        const ext = image.src.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg';
        
        // Create responsive srcset (assuming images are available in multiple sizes)
        const srcset = [
          `${baseSrc}_480w.${ext} 480w`,
          `${baseSrc}_800w.${ext} 800w`,
          `${baseSrc}_1200w.${ext} 1200w`,
          `${baseSrc}_1600w.${ext} 1600w`
        ].join(', ');
        
        image.srcset = srcset;
        image.sizes = '(max-width: 480px) 480px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px';
      }
    });
  }

  private setupLazyLoading(): void {
    // Use native lazy loading with fallback
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const image = img as HTMLImageElement;
      
      // First 3 images should load immediately (above fold)
      if (index < 3) {
        image.loading = 'eager';
      } else {
        image.loading = 'lazy';
      }
    });

    // Fallback for browsers that don't support native lazy loading
    if (!('loading' in HTMLImageElement.prototype)) {
      this.implementIntersectionObserverLazyLoading();
    }
  }

  private implementIntersectionObserverLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const dataSrc = img.getAttribute('data-src');
            
            if (dataSrc) {
              img.src = dataSrc;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  private optimizeImageFormats(): void {
    // Detect WebP support and upgrade image formats
    const supportsWebP = this.checkWebPSupport();
    const supportsAVIF = this.checkAVIFSupport();

    if (supportsAVIF || supportsWebP) {
      const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"], img[src*=".png"]');
      
      images.forEach(img => {
        const image = img as HTMLImageElement;
        let newSrc = image.src;
        
        if (supportsAVIF) {
          newSrc = newSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        } else if (supportsWebP) {
          newSrc = newSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        
        // Test if the optimized format exists
        this.testImageFormat(newSrc).then(exists => {
          if (exists) {
            image.src = newSrc;
          }
        });
      });
    }
  }

  private checkWebPSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  private checkAVIFSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  private async testImageFormat(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async setupServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        console.log('🔧 Setting up Service Worker for offline support...');
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        // Send configuration to service worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'CONFIG_UPDATE',
            config: {
              cacheStrategy: CRISIS_CACHE_STRATEGY,
              compressionConfig: COMPRESSION_CONFIG,
              crisisMode: this.detectCrisisMode()
            }
          });
        }

        console.log('✅ Service Worker registered successfully');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  }

  private implementAdvancedCaching(): void {
    console.log('🗄️ Implementing advanced caching strategies...');

    // Setup cache-first strategy for static assets
    this.setupStaticAssetCaching();

    // Setup network-first strategy for dynamic content
    this.setupDynamicContentCaching();

    // Setup stale-while-revalidate for API responses
    this.setupAPIResponseCaching();

    // Setup cache-first with network fallback for crisis resources
    this.setupCrisisResourceCaching();
  }

  private setupStaticAssetCaching(): void {
    // Cache static assets aggressively
    if ('caches' in window) {
      const staticAssets = [
        '/css/styles.css',
        '/js/app.js',
        '/icons/favicon.svg',
        '/fonts/inter-var.woff2'
      ];

      caches.open('alchm-static-v1').then(cache => {
        cache.addAll(staticAssets);
      });
    }
  }

  private setupDynamicContentCaching(): void {
    // Implement intelligent caching for dynamic content
    const dynamicPages = [
      '/dashboard',
      '/journal',
      '/journals'
    ];

    if ('caches' in window) {
      caches.open('alchm-dynamic-v1').then(cache => {
        dynamicPages.forEach(page => {
          // Prefetch and cache dynamic pages
          fetch(page).then(response => {
            if (response.ok) {
              cache.put(page, response.clone());
            }
          });
        });
      });
    }
  }

  private setupAPIResponseCaching(): void {
    // Cache API responses with intelligent invalidation
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [resource, options] = args;
      const url = typeof resource === 'string' ? resource : resource instanceof Request ? resource.url : '';
      
      // Only cache GET requests to our API
      if (url.includes('/api/') && (!options || options.method === 'GET' || !options.method)) {
        const cacheKey = `api-cache-${url}`;
        
        try {
          const cache = await caches.open('alchm-api-v1');
          const cachedResponse = await cache.match(cacheKey);
          
          // Return cached response if valid
          if (cachedResponse && this.isCacheValid(cachedResponse, CRISIS_CACHE_STRATEGY.apiResponses)) {
            // Make background request to update cache
            originalFetch(...args).then(response => {
              if (response.ok) {
                cache.put(cacheKey, response.clone());
              }
            });
            
            return cachedResponse;
          }
        } catch (error) {
          console.warn('Cache operation failed:', error);
        }
      }
      
      const response = await originalFetch(...args);
      
      // Cache successful API responses
      if (response.ok && url.includes('/api/') && (!options || options.method === 'GET' || !options.method)) {
        try {
          const cache = await caches.open('alchm-api-v1');
          cache.put(`api-cache-${url}`, response.clone());
        } catch (error) {
          console.warn('Failed to cache API response:', error);
        }
      }
      
      return response;
    };
  }

  private setupCrisisResourceCaching(): void {
    // Ensure crisis resources are always available
    if ('caches' in window) {
      const crisisResources = [
        '/crisis-resources',
        '/emergency-contacts',
        '/offline-crisis-support',
        '/api/crisis-hotlines'
      ];

      caches.open('alchm-crisis-v1').then(cache => {
        crisisResources.forEach(resource => {
          fetch(resource).then(response => {
            if (response.ok) {
              cache.put(resource, response.clone());
            }
          }).catch(error => {
            console.warn(`Failed to cache crisis resource ${resource}:`, error);
          });
        });
      });
    }
  }

  private isCacheValid(response: Response, maxAgeSeconds: number): boolean {
    const responseDate = response.headers.get('date');
    if (!responseDate) return false;
    
    const age = (Date.now() - new Date(responseDate).getTime()) / 1000;
    return age < maxAgeSeconds;
  }

  private optimizeCDNDelivery(): void {
    console.log('🌍 Optimizing CDN delivery...');

    // Add resource hints for CDN optimization
    this.addResourceHints();

    // Setup connection optimization
    this.optimizeConnections();

    // Implement edge-side caching hints
    this.implementEdgeCachingHints();
  }

  private addResourceHints(): void {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: '//firebasestorage.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
      
      document.head.appendChild(link);
    });
  }

  private optimizeConnections(): void {
    // Optimize connection settings for Firebase Hosting
    if ('navigator' in window && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if (connection) {
        // Adjust prefetching based on connection quality
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Reduce prefetching on slow connections
          this.config.enablePrefetch = false;
          console.log('🐌 Slow connection detected, reducing prefetching');
        }
        
        if (connection.saveData) {
          // Respect data saver mode
          this.config.enablePrefetch = false;
          this.config.optimizeImages = true; // Aggressive image optimization
          console.log('📱 Data saver mode detected, optimizing for bandwidth');
        }
      }
    }
  }

  private implementEdgeCachingHints(): void {
    // Add cache control headers hints for edge caching
    const metaTags = [
      { name: 'Cache-Control', content: 'public, max-age=3600, stale-while-revalidate=86400' },
      { name: 'Vary', content: 'Accept-Encoding, Accept' }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.httpEquiv = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }

  private detectCrisisMode(): boolean {
    // Detect if user is in crisis mode
    const crisisIndicators = [
      localStorage.getItem('alchm_crisis_mode'),
      document.querySelector('[data-crisis-detected]'),
      window.location.search.includes('crisis=true')
    ];

    return crisisIndicators.some(indicator => Boolean(indicator));
  }

  // Public API
  public generateFirebaseConfigOptimizations(): any {
    return {
      hosting: [
        {
          site: "alchm-digital-sanctuary",
          public: "out",
          ignore: [
            "firebase.json",
            "**/.*",
            "**/node_modules/**",
            "**/*.map"
          ],
          rewrites: [
            {
              source: "/api/khepera/**",
              function: "chatWithGemini"
            },
            {
              source: "/api/stripe/webhook",
              function: "subscriptionWebhook"
            },
            {
              source: "**",
              destination: "/index.html"
            }
          ],
          headers: [
            {
              source: "/_next/static/**",
              headers: [
                {
                  key: "Cache-Control",
                  value: `public, max-age=${CRISIS_CACHE_STRATEGY.staticAssets}, immutable`
                },
                {
                  key: "Vary",
                  value: "Accept-Encoding"
                }
              ]
            },
            {
              source: "**/*.@(js|css|woff|woff2|eot|ttf)",
              headers: [
                {
                  key: "Cache-Control",
                  value: `public, max-age=${CRISIS_CACHE_STRATEGY.staticAssets}, immutable`
                },
                {
                  key: "Vary",
                  value: "Accept-Encoding"
                }
              ]
            },
            {
              source: "**/*.@(jpg|jpeg|gif|png|svg|webp|avif)",
              headers: [
                {
                  key: "Cache-Control",
                  value: `public, max-age=${CRISIS_CACHE_STRATEGY.staticAssets}`
                },
                {
                  key: "Vary",
                  value: "Accept"
                }
              ]
            },
            {
              source: "/crisis-resources/**",
              headers: [
                {
                  key: "Cache-Control",
                  value: `public, max-age=${CRISIS_CACHE_STRATEGY.crisisResources}, stale-while-revalidate=3600`
                },
                {
                  key: "X-Crisis-Resource",
                  value: "true"
                }
              ]
            },
            {
              source: "/api/**",
              headers: [
                {
                  key: "Cache-Control",
                  value: `public, max-age=${CRISIS_CACHE_STRATEGY.apiResponses}, stale-while-revalidate=300`
                }
              ]
            },
            {
              source: "**/*.html",
              headers: [
                {
                  key: "Cache-Control",
                  value: `public, max-age=${CRISIS_CACHE_STRATEGY.dynamicContent}, stale-while-revalidate=600`
                }
              ]
            },
            {
              source: "**",
              headers: [
                {
                  key: "X-Frame-Options",
                  value: "DENY"
                },
                {
                  key: "X-Content-Type-Options",
                  value: "nosniff"
                },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin"
                },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()"
                },
                {
                  key: "Content-Security-Policy",
                  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.googleapis.com https://*.firebase.com"
                }
              ]
            }
          ],
          cleanUrls: true,
          trailingSlash: false
        }
      ]
    };
  }

  public generatePerformanceReport(): string {
    let report = '🚀 Firebase Hosting Optimization Report\n';
    report += '=' .repeat(45) + '\n\n';

    report += `Configuration:\n`;
    report += `  Compression: ${this.config.enableCompression ? '✅' : '❌'}\n`;
    report += `  Caching: ${this.config.enableCaching ? '✅' : '❌'}\n`;
    report += `  Prefetching: ${this.config.enablePrefetch ? '✅' : '❌'}\n`;
    report += `  Preloading: ${this.config.enablePreload ? '✅' : '❌'}\n`;
    report += `  Service Worker: ${this.config.enableServiceWorker ? '✅' : '❌'}\n`;
    report += `  Image Optimization: ${this.config.optimizeImages ? '✅' : '❌'}\n`;
    report += `  CDN Optimization: ${this.config.enableCDN ? '✅' : '❌'}\n\n`;

    report += `Cache Strategy:\n`;
    report += `  Static Assets: ${CRISIS_CACHE_STRATEGY.staticAssets}s (1 year)\n`;
    report += `  Dynamic Content: ${CRISIS_CACHE_STRATEGY.dynamicContent}s\n`;
    report += `  API Responses: ${CRISIS_CACHE_STRATEGY.apiResponses}s\n`;
    report += `  Crisis Resources: ${CRISIS_CACHE_STRATEGY.crisisResources}s\n`;
    report += `  Offline Content: ${CRISIS_CACHE_STRATEGY.offlineContent}s\n\n`;

    report += `Crisis Mode: ${this.detectCrisisMode() ? '🆘 ACTIVE' : '✅ STANDBY'}\n`;

    return report;
  }
}

// Initialize optimization
export const firebaseHostingOptimizer = FirebaseHostingOptimizer.getInstance();

// Auto-optimize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    firebaseHostingOptimizer.optimizeForCrisisSupport();
  });
}

export default FirebaseHostingOptimizer;