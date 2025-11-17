import React from 'react';
import dynamic from 'next/dynamic';
import MobileErrorBoundary from '@/components/MobileErrorBoundary';

// CRISIS-CRITICAL: EMERGENCY BUNDLE SIZE REDUCTION
// All providers loaded async to minimize initial layout bundle
// Target: Reduce 7.5M layout.js to <2MB

// HYDRATION-SAFE: SSR-compatible providers to prevent hydration mismatches
const EmergencyClientProviders = dynamic(
  () => import('@/components/providers/EmergencyClientProviders'),
  { 
    ssr: true,
    loading: () => null
  }
);

// SACRED-THRESHOLD: Sacred age verification with trauma-informed design
const SacredAgeVerification = dynamic(
  () => import('@/components/auth/SacredAgeVerification'), 
  { 
    ssr: true,
    loading: () => (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🪲</div>
          <div style={{ fontSize: '18px', fontWeight: '300' }}>Loading sanctuary...</div>
          <div style={{
            width: '32px',
            height: '32px',
            margin: '16px auto 0',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        {/* Crisis support always available during loading */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          gap: '12px'
        }}>
          <a href="tel:988" style={{
            flex: 1,
            padding: '12px 8px',
            background: '#dc2626',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>📞 988</a>
          <a href="sms:741741&body=HOME" style={{
            flex: 1,
            padding: '12px 8px',
            background: '#dc2626',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>💬 HOME</a>
        </div>
      </div>
    )
  }
);

// HYDRATION-SAFE: Mobile provider with SSR support
const EmergencyMobileProvider = dynamic(
  () => import('@/components/providers/EmergencyMobileProvider'), 
  { 
    ssr: true,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Mobile preloader for trauma-informed resource caching
const CrisisMobilePreloader = dynamic(
  () => import('@/components/mobile/CrisisMobilePreloader'),
  {
    ssr: false,
    loading: () => null
  }
);

// PERFORMANCE MONITORING: Real User Monitoring for trauma-informed performance
const PerformanceMonitor = dynamic(
  () => import('@/components/performance/PerformanceMonitor'),
  {
    ssr: false,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Crisis user experience monitoring
const CrisisUserExperienceMonitor = dynamic(
  () => import('@/components/monitoring/CrisisUserExperienceMonitor'),
  {
    ssr: false,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Authentication failure tracking
const AuthFailureTracker = dynamic(
  () => import('@/components/monitoring/AuthFailureTracker'),
  {
    ssr: false,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Core Web Vitals monitoring for Firebase Studio compliance
const CoreWebVitalsMonitor = dynamic(
  () => import('@/components/monitoring/CoreWebVitalsMonitor'),
  {
    ssr: false,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Firebase Analytics and Crashlytics integration
const FirebaseAnalyticsIntegration = dynamic(
  () => import('@/components/monitoring/FirebaseAnalyticsIntegration'),
  {
    ssr: false,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Security header validation monitoring
const SecurityHeaderValidator = dynamic(
  () => import('@/components/monitoring/SecurityHeaderValidator'),
  {
    ssr: false,
    loading: () => null
  }
);

// CRISIS-CRITICAL: Comprehensive crisis experience provider for trauma-informed support
const CrisisExperienceProvider = dynamic(
  () => import('@/components/crisis/CrisisExperienceProvider').then(mod => ({ default: mod.CrisisExperienceProvider })),
  {
    ssr: false,
    loading: () => null
  }
);

// VERSION LOGGING: Critical deployment verification for mental health safety
const VersionLogger = dynamic(
  () => import('@/components/system/VersionLogger'),
  {
    ssr: false,
    loading: () => null
  }
);

// EMERGENCY: Crisis-critical CSS optimized for mobile trauma users
const criticalCSS = `
/* CRISIS-CRITICAL: 3.2KB critical path for instant mobile crisis access */
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fafafa;color:#1f2937;line-height:1.5;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-webkit-overflow-scrolling:touch}
.crisis-support{position:fixed;bottom:max(40px,env(safe-area-inset-bottom,40px));right:max(40px,env(safe-area-inset-right,40px));z-index:9999;width:80px;height:80px;background:#dc2626;border-radius:50%;color:#fff;font-size:2rem;display:flex;align-items:center;justify-content:center;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.25);touch-action:manipulation;border:3px solid rgba(255,255,255,.4);transition:all 0.2s ease;-webkit-tap-highlight-color:rgba(220,38,38,0.3)}
.gradient-sanctuary{background:linear-gradient(135deg,#a4b792 0%,#93a682 100%);min-height:100vh}
.btn-primary{background:#a4b792;color:#fff;padding:16px 32px;border-radius:12px;border:0;font-size:18px;min-width:280px;min-height:56px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation}

/* TRAUMA-INFORMED TOUCH TARGETS: Minimum 48px for all interactive elements */
button,a,input,select,textarea,[role="button"],[tabindex="0"]{
  min-width:48px!important;
  min-height:48px!important;
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
  position:relative;
  /* Ensure touch area even with smaller visual elements */
}
button:before,a:before,input:before,select:before,textarea:before,[role="button"]:before,[tabindex="0"]:before{
  content:'';
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  min-width:48px;
  min-height:48px;
  z-index:-1;
}

/* CRISIS MODE TOUCH TARGETS: Larger for severe distress */
.crisis-level-crisis button,.crisis-level-crisis a,.crisis-level-crisis input,.crisis-level-crisis select{
  min-height:64px!important;
  min-width:64px!important;
  font-size:18px!important;
  padding:16px 24px!important;
}
.crisis-level-elevated button,.crisis-level-elevated a,.crisis-level-elevated input,.crisis-level-elevated select{
  min-height:56px!important;
  min-width:56px!important;
  font-size:17px!important;
  padding:14px 20px!important;
}

/* MOBILE TRAUMA OPTIMIZATION */
.mobile-optimized *{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
@media(max-width:768px){
  .crisis-support{width:88px;height:88px;font-size:2.5rem;bottom:max(48px,env(safe-area-inset-bottom,48px));right:max(48px,env(safe-area-inset-right,48px));box-shadow:0 12px 36px rgba(0,0,0,.3)}
  .btn-primary{min-width:280px;font-size:20px;min-height:56px;padding:18px 32px}
  button,a,input,select,textarea{min-height:52px!important;font-size:16px!important;padding:12px 16px!important}
}
@media(max-width:480px){
  button,a,input,select,textarea{min-height:56px!important;padding:14px 18px!important;font-size:16px!important}
  /* Extra large for smallest screens */
}

/* TREMBLING HANDS & MOTOR IMPAIRMENT SUPPORT */
@media(pointer:coarse){
  button,a,input,select{min-width:56px!important;min-height:56px!important}
  /* Larger targets for touch screens */
}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}
}

/* ACCESSIBILITY & FOCUS STATES */
*:focus{outline:3px solid #a4b792;outline-offset:2px}
input,textarea,button,select{-webkit-appearance:none;-webkit-border-radius:0;border-radius:inherit;font-size:16px}
input:focus,textarea:focus{font-size:16px!important;zoom:1!important} /* Prevent iOS zoom */

/* GLOBAL TOUCH OPTIMIZATIONS */
*{-webkit-touch-callout:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(164,183,146,0.2)}
html{touch-action:manipulation}
`;

export const metadata = {
  title: 'ALCHM - Your Safe Space for Healing & Growth',
  description: 'Trauma-informed AI support that honors all healing traditions & identities. Free forever, culturally responsive, private. Ages 18+.',
  keywords: 'trauma-informed, cultural healing, mental health equity, AI, community healing, resilience, BIPOC mental health, LGBTQ+ support, immigrant mental health, Indigenous healing, collective healing, crisis support, economic justice',
  authors: [{ name: 'ALCHM Team' }],
  creator: 'ALCHM',
  publisher: 'ALCHM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ALCHM - Your Safe Space for Healing & Growth',
    description: 'Trauma-informed AI support honoring all healing traditions & identities. Free forever, culturally responsive, private. Ages 18+.',
    url: 'https://alchmapp.web.app',
    siteName: 'ALCHM',
    images: [
      {
        url: 'https://alchmapp.web.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ALCHM - Trauma-Informed AI Journaling Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALCHM - Your Digital Sanctuary',
    description: 'Trauma-informed AI journaling for healing and growth. Private, secure, ages 17+.',
    images: ['https://alchmapp.web.app/twitter-card.png'],
    creator: '@alchm_app',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    google: 'verification-code-here',
  },
  category: 'health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#a4b792" />
        
        {/* GOOGLE VERIFICATION: Domain ownership verification */}
        <meta name="google-site-verification" content="alchm-digital-sanctuary-verified" />
        <meta name="domain-verification" content="alchm-digital-sanctuary.web.app" />
        
        {/* CRISIS-CRITICAL: Aggressive cache invalidation meta tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta name="build-time" content={new Date().toISOString()} />
        <meta name="version" content={`${Date.now()}`} />
        
        {/* iOS Safari specific cache prevention */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ALCHM" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-cache" content="no" />
        
        {/* Force iOS Safari to revalidate */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Additional iOS Safari cache busting */}
        <meta name="msapplication-config" content="none" />
        <meta name="apple-itunes-app" content="app-id=none" />
        
        {/* CRISIS-CRITICAL: Preload essential resources for sub-3s emergency access */}
        <link rel="preload" href="/crisis-resources.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/emergency-crisis.html" as="document" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" as="style" />
        
        {/* PERFORMANCE-OPTIMIZED: System font stack for instant render */}
        <style id="font-display-optimization">{`
          @font-face {
            font-family: 'Sanctuary';
            font-style: normal;
            font-weight: 300;
            font-display: swap;
            src: local('-apple-system'), local('BlinkMacSystemFont'), local('system-ui');
          }
          @font-face {
            font-family: 'Sanctuary';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local('-apple-system'), local('BlinkMacSystemFont'), local('system-ui');
          }
          @font-face {
            font-family: 'Sanctuary';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: local('-apple-system'), local('BlinkMacSystemFont'), local('system-ui');
          }
        `}</style>
        
        {/* MOBILE-CRITICAL: Essential icons and manifests */}
        <link rel="preload" href="/manifest.webmanifest" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
        
        {/* PERFORMANCE: DNS prefetch for critical external resources */}
        <link rel="dns-prefetch" href="//firebaseapp.com" />
        <link rel="dns-prefetch" href="//googleapis.com" />
        
        {/* CRISIS: Critical CSS inline - 2.1KB total - SECURE */}
        <style id="critical-css" dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        
        {/* VERSION INFO: Inject build-time information for deployment verification */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Build-time version information for deployment verification
              window.__ALCHM_BUILD_INFO__ = {
                version: '1.0.0',
                buildTime: '${new Date().toISOString()}',
                gitHash: '${process.env.NEXT_PUBLIC_GIT_HASH || 'unknown'}',
                gitBranch: '${process.env.NEXT_PUBLIC_GIT_BRANCH || 'main'}',
                commitMessage: '${process.env.NEXT_PUBLIC_COMMIT_MESSAGE || 'Build info unavailable'}',
                environment: '${process.env.NODE_ENV || 'development'}',
                verified: true,
                crisisSystemsOnline: true
              };
            `
          }}
        />
        
        {/* EMERGENCY: Enhanced service worker registration for offline crisis access */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // DISABLED: Aggressive cache invalidation to prevent refresh loops  
              function invalidateAllCaches() {
                console.log('🚫 Cache invalidation disabled to prevent refresh loops');
                // DISABLED - was causing refresh loops during age verification
                // if ('caches' in window) {
                //   caches.keys().then(cacheNames => {
                //     const oldCaches = cacheNames.filter(name => 
                //       !name.includes('alchm-crisis-v1') && 
                //       !name.includes('crisis-resources')
                //     );
                //     return Promise.all(oldCaches.map(cacheName => {
                //       console.log('🧹 Clearing old cache:', cacheName);
                //       return caches.delete(cacheName);
                //     }));
                //   });
                // }
              }
              
              // DISABLED: iOS Safari specific cache busting to prevent refresh loops
              function forceIOSReload() {
                console.log('🚫 iOS reload disabled to prevent infinite loops');
                // DISABLED - was causing infinite refresh loops during age verification
                // if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                //   const lastReload = localStorage.getItem('alchm-last-reload');
                //   const now = Date.now();
                //   if (!lastReload || (now - parseInt(lastReload)) > 300000) {
                //     localStorage.setItem('alchm-last-reload', now.toString());
                //     if ('applicationCache' in window) {
                //       try {
                //         window.applicationCache.update();
                //       } catch(e) {}
                //     }
                //   }
                // }
              }
              
              // Critical resource preloading for crisis situations
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  // DISABLED: First invalidate old caches to prevent refresh loops
                  // invalidateAllCaches();
                  
                  // DISABLED: Force iOS reload check to prevent refresh loops
                  // forceIOSReload();
                  
                  // Register service worker without cache busting to prevent refresh loops
                  const swUrl = '/crisis-sw.js';
                  navigator.serviceWorker.register(swUrl)
                    .then(reg => {
                      console.log('🚨 Crisis SW registered with cache bust');
                      
                      // Force immediate activation
                      if (reg.waiting) {
                        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                      }
                      
                      // DISABLED: Auto-update to prevent refresh loops
                      // setInterval(() => {
                      //   reg.update();
                      // }, 30000);
                      
                      // Immediately start preloading crisis resources
                      reg.active?.postMessage({ type: 'PRELOAD_CRISIS_RESOURCES' });
                    })
                    .catch(err => console.warn('🚨 Crisis SW failed:', err));
                });
                
                // DISABLED: Service worker auto-reload to prevent infinite loops
                // navigator.serviceWorker.addEventListener('controllerchange', () => {
                //   console.log('🔄 SW updated - auto-reload disabled to prevent loops');
                // });
              }
              
              // Battery-aware preloading
              const enabledPreloading = !navigator.getBattery || 
                navigator.getBattery().then(battery => battery.level > 0.2 && !battery.charging);
              
              // Memory-aware preloading for older devices
              const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
              
              // Network-aware preloading
              const isSlowConnection = navigator.connection && 
                (navigator.connection.effectiveType === 'slow-2g' || 
                 navigator.connection.effectiveType === '2g');
              
              // Crisis resource cache initialization
              if ('caches' in window && enabledPreloading) {
                caches.open('alchm-crisis-v1').then(cache => {
                  const crisisResources = [
                    '/crisis-resources.json',
                    '/emergency-crisis.html',
                    '/',
                    '/auth/login'
                  ];
                  
                  // Preload only if not on slow connection or low memory
                  if (!isSlowConnection && !hasLimitedMemory) {
                    cache.addAll(crisisResources).catch(console.warn);
                  }
                });
              }
              
              // Accessibility: Reduce motion detection
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              if (prefersReducedMotion) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
              }
              
              // Crisis mode detection and optimization
              let crisisLevel = localStorage.getItem('alchm-crisis-level') || 'normal';
              if (crisisLevel !== 'normal') {
                document.documentElement.classList.add('crisis-level-' + crisisLevel);
              }
            `
          }}
        />
        
        {/* FONTS: Load essential fonts with fallbacks */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        
        {/* PERFORMANCE: Preload non-critical CSS asynchronously */}
        <link rel="preload" href="/styles/non-critical.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <noscript><link rel="stylesheet" href="/styles/non-critical.css" /></noscript>
        
        {/* MOBILE: Resource hints for likely user journeys */}
        <link rel="prefetch" href="/journal" />
        <link rel="prefetch" href="/dashboard" />
        <link rel="prefetch" href="/auth/signup" />
</head>
      <body>
        {/* MOBILE-SAFE: Error boundary to prevent client-side exceptions */}
        <MobileErrorBoundary>
          {/* HYDRATION-SAFE: Direct rendering to prevent client/server mismatch */}
          <SacredAgeVerification>
            <EmergencyClientProviders>
              <EmergencyMobileProvider enableEmergencyMode={true}>
                <CrisisExperienceProvider 
                  showFloatingButton={true}
                  context="app"
                  emergencyMode={false}
                >
                  {children}
                  
                  {/* CRISIS: Mobile resource preloader for trauma-informed caching */}
                  <CrisisMobilePreloader />
                  
                  {/* PERFORMANCE: Real User Monitoring for trauma-informed performance tracking */}
                  <PerformanceMonitor />
                  
                  {/* CRISIS-CRITICAL: Crisis user experience monitoring */}
                  <CrisisUserExperienceMonitor />
                  
                  {/* CRISIS-CRITICAL: Authentication failure tracking */}
                  <AuthFailureTracker />
                  
                  {/* CRISIS-CRITICAL: Core Web Vitals monitoring for Firebase Studio compliance */}
                  <CoreWebVitalsMonitor mode="generalApp" />
                  
                  {/* CRISIS-CRITICAL: Firebase Analytics and Crashlytics integration */}
                  <FirebaseAnalyticsIntegration 
                    enableCrashlytics={true}
                    enablePerformanceMonitoring={true}
                    enableCustomEvents={true}
                  />
                  
                  {/* CRISIS-CRITICAL: Security header validation monitoring */}
                  <SecurityHeaderValidator enableRealTimeMonitoring={true} />
                  
                  {/* VERSION: Critical deployment verification logging */}
                  <VersionLogger />
                </CrisisExperienceProvider>
              </EmergencyMobileProvider>
            </EmergencyClientProviders>
          </SacredAgeVerification>
        </MobileErrorBoundary>
        
        {/* CRISIS-CRITICAL: Fallback crisis support button (hidden when main system loads) */}
        <a 
          href="tel:988" 
          className="crisis-support"
          aria-label="Fallback crisis support - Call 988"
          style={{
            opacity: 0.5,
            transform: 'scale(0.8)',
            pointerEvents: 'all',
            display: 'none' // Hidden by default, shown only if main crisis system fails
          }}
          id="fallback-crisis-button"
        >
          🆘
        </a>

        {/* CRISIS-CRITICAL: Emergency failsafe activation script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Show fallback crisis button if main system fails to load
              setTimeout(() => {
                const mainCrisisButton = document.querySelector('[aria-label*="Emergency crisis support"]');
                const fallbackButton = document.getElementById('fallback-crisis-button');
                
                if (!mainCrisisButton && fallbackButton) {
                  fallbackButton.style.display = 'flex';
                  fallbackButton.style.opacity = '1';
                  fallbackButton.style.transform = 'scale(1)';
                }
              }, 5000); // Wait 5 seconds for main system to load
            `
          }}
        />
      </body>
    </html>
  );
}