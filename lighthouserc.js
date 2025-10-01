module.exports = {
  ci: {
    collect: {
      // URLs to test - prioritizing crisis scenarios
      url: [
        'http://localhost:3001/',
        'http://localhost:3001/auth/login',
        'http://localhost:3001/journal',
        'http://localhost:3001/dashboard',
        'http://localhost:3001/crisis-support',
        'http://localhost:3001/pricing'
      ],
      
      // Crisis-critical mobile performance settings
      settings: [
        // Slow 3G scenario - worst case for crisis users
        {
          formFactor: 'mobile',
          throttling: {
            rttMs: 150,
            throughputKbps: 1600,
            cpuSlowdownMultiplier: 4,
            requestLatencyMs: 150,
            downloadThroughputKbps: 1600,
            uploadThroughputKbps: 750
          },
          numberOfRuns: 5,
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'pwa'],
          enablePWAAudits: true,
          skipAudits: ['uses-http2', 'uses-long-cache-ttl']
        },
        // Regular 3G scenario
        {
          formFactor: 'mobile',
          throttling: {
            rttMs: 40,
            throughputKbps: 9000,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
          },
          numberOfRuns: 3,
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          skipAudits: ['uses-http2', 'uses-long-cache-ttl']
        }
      ]
    },
    
    assert: {
      // Crisis-optimized performance thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.85 }],
        
        // Crisis-Critical Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }], // Crisis: <1.2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }], // Crisis: <2.0s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }], // Crisis: <0.05
        'max-potential-fid': ['error', { maxNumericValue: 100 }], // Crisis: <100ms
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // Crisis: <300ms
        'interactive': ['error', { maxNumericValue: 3000 }], // Crisis: <3.0s
        
        // Crisis-specific performance metrics
        'speed-index': ['warn', { maxNumericValue: 2500 }],
        'server-response-time': ['error', { maxNumericValue: 200 }],
        
        // Mobile-optimized resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 150000 }], // Reduced for mobile
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 40000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 80000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 300000 }], // Stricter for crisis
        'resource-summary:total:size': ['error', { maxNumericValue: 600000 }], // Total page weight
        
        // Request counts - critical for slow connections
        'resource-summary:total:count': ['error', { maxNumericValue: 40 }],
        'resource-summary:script:count': ['error', { maxNumericValue: 8 }],
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 5 }],
        
        // Accessibility - critical for trauma-informed design
        'color-contrast': 'error',
        'tap-targets': 'error',
        'accessible-names': 'error',
        
        // PWA requirements for offline crisis support
        'installable-manifest': 'warn',
        'service-worker': 'warn',
        'offline-start-url': 'warn',
        
        // Security
        'is-on-https': 'off',  // Allow HTTP for local testing
        'redirects-http': 'off'
      }
    },
    
    upload: {
      // Temporary server for local development
      target: 'temporary-public-storage'
      
      // For production, use LHCI server:
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN
    },
    
    server: {
      // Local LHCI server configuration
      port: 9001,
      storage: {
        storageMethod: 'filesystem',
        storagePath: './lighthouse-server-data'
      }
    }
  }
};