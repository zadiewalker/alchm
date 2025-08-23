// Lighthouse CI configuration for ALCHM
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/login',
        'http://localhost:3000/journals',
        'http://localhost:3000/home'
      ],
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'ready',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        // Performance budgets
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:total:size': ['error', { maxNumericValue: 2000000 }], // 2MB
        
        // Security headers
        'is-on-https': 'off', // Disabled for local testing
        'redirects-http': 'off', // Disabled for local testing
        
        // PWA requirements
        'service-worker': ['error', { minScore: 1 }],
        'installable-manifest': ['error', { minScore: 1 }],
        'splash-screen': ['error', { minScore: 1 }],
        'themed-omnibox': ['error', { minScore: 1 }],
        
        // Accessibility requirements
        'color-contrast': ['error', { minScore: 1 }],
        'heading-order': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'label': ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        
        // Trauma-informed design specific checks
        'meta-description': ['warn', { minScore: 1 }],
        'meta-viewport': ['error', { minScore: 1 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      port: 3000,
      host: 'localhost'
    }
  }
}