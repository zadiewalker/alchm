// Advanced PWA Configuration - Offline-First Architecture
// Supports 10M+ users with intelligent caching and background sync

export interface PWAConfig {
  // Core PWA settings
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'natural' | 'landscape' | 'portrait';
  startUrl: string;
  scope: string;
  
  // Caching strategies
  cachingStrategies: {
    staticAssets: 'cache-first' | 'stale-while-revalidate';
    apiCalls: 'network-first' | 'cache-first' | 'network-only';
    journalEntries: 'cache-first' | 'network-first';
    aiInsights: 'stale-while-revalidate' | 'network-first';
  };
  
  // Offline capabilities
  offlineCapabilities: {
    maxOfflineEntries: number;
    maxCacheSize: number; // MB
    backgroundSyncEnabled: boolean;
    offlineIndicatorEnabled: boolean;
    conflictResolutionStrategy: 'client-wins' | 'server-wins' | 'merge';
  };
  
  // Performance optimizations
  performance: {
    preloadCriticalResources: boolean;
    lazyLoadImages: boolean;
    compressionEnabled: boolean;
    criticalResourceHints: string[];
  };
  
  // Push notifications
  pushNotifications: {
    enabled: boolean;
    publicKey: string;
    notificationTypes: ('daily_reminder' | 'mood_check' | 'crisis_alert' | 'milestone')[];
  };
}

export const ALCHM_PWA_CONFIG: PWAConfig = {
  name: 'ALCHM - Trauma-Informed AI Journaling',
  shortName: 'ALCHM',
  description: 'Trauma-informed AI journaling platform with crisis prevention and personalized insights',
  themeColor: '#8B5CF6', // Purple-500
  backgroundColor: '#0F172A', // Slate-900
  display: 'standalone',
  orientation: 'any',
  startUrl: '/',
  scope: '/',
  
  cachingStrategies: {
    staticAssets: 'cache-first',
    apiCalls: 'network-first',
    journalEntries: 'cache-first',
    aiInsights: 'stale-while-revalidate'
  },
  
  offlineCapabilities: {
    maxOfflineEntries: 100, // Generous offline storage
    maxCacheSize: 50, // 50MB cache limit
    backgroundSyncEnabled: true,
    offlineIndicatorEnabled: true,
    conflictResolutionStrategy: 'client-wins' // User's offline work takes precedence
  },
  
  performance: {
    preloadCriticalResources: true,
    lazyLoadImages: true,
    compressionEnabled: true,
    criticalResourceHints: [
      '/api/auth/session',
      '/api/user/profile',
      '/fonts/inter.woff2'
    ]
  },
  
  pushNotifications: {
    enabled: true,
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    notificationTypes: ['daily_reminder', 'mood_check', 'crisis_alert', 'milestone']
  }
};

// Icon specifications for different platforms
export const PWA_ICONS = [
  {
    src: '/icons/icon-72x72.png',
    sizes: '72x72',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-96x96.png',
    sizes: '96x96',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-128x128.png',
    sizes: '128x128',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-144x144.png',
    sizes: '144x144',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-152x152.png',
    sizes: '152x152',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-192x192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-384x384.png',
    sizes: '384x384',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable any'
  }
];

// Platform-specific optimizations
export const PLATFORM_OPTIMIZATIONS = {
  ios: {
    appleWebAppCapable: true,
    appleWebAppStatusBarStyle: 'black-translucent',
    appleTouchIcon: '/icons/apple-touch-icon.png',
    appleTouchStartupImage: '/icons/apple-startup.png'
  },
  
  android: {
    chromeDevToolsAutoUpdate: true,
    androidChromeFullscreen: true,
    androidChromeNavigationBar: '#0F172A'
  },
  
  typeof window !== 'undefined' && windows: {
    msTileColor: '#8B5CF6',
    msApplicationTileImage: '/icons/ms-tile-310x310.png'
  }
};

// Service Worker configuration
export const SW_CONFIG = {
  swUrl: '/sw.js',
  swScope: '/',
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    },
    {
      urlPattern: /\/api\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5 // 5 minutes
        },
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ]
};

export default ALCHM_PWA_CONFIG;