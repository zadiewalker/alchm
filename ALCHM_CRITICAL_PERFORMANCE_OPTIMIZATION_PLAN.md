# ALCHM Critical Performance Optimization Plan

## 🚨 EXECUTIVE SUMMARY - CRISIS PERFORMANCE STATUS

**CRITICAL FINDING**: ALCHM currently fails all trauma-informed performance standards.

### Current Performance Status
- **Average Performance Score**: 60/100 ❌ (Target: >90)
- **Crisis-Ready Pages**: 0/7 ❌ (Target: 7/7)
- **Crisis-Ready User Journeys**: 0/4 ❌ (Target: 4/4)
- **Bundle Size**: 180KB average ❌ (Target: <160KB)
- **Time to Interactive**: 12+ seconds ❌ (Target: <3 seconds)

### Risk Assessment
**IMMEDIATE RISK TO VULNERABLE USERS**: Current performance could prevent users in crisis from accessing help within critical time windows.

---

## 🎯 TRAUMA-INFORMED PERFORMANCE TARGETS

### Core Web Vitals for Crisis Users
- **First Contentful Paint**: <1.2s (99% current compliance ✅)
- **Largest Contentful Paint**: <2.0s (0% current compliance ❌)
- **First Input Delay**: <50ms (0% current compliance ❌)
- **Cumulative Layout Shift**: <0.05 (100% current compliance ✅)
- **Time to Interactive**: <3.0s (0% current compliance ❌)

### Bundle Size Targets
- **Initial Bundle**: <120KB (currently 147KB ❌)
- **Page Bundles**: <15KB (currently 59KB max ❌)
- **Critical Path**: <10KB (currently 58KB ❌)

---

## 🚨 CRITICAL PERFORMANCE ISSUES

### 1. Massive JavaScript Bundles
- **First Load JS**: 147KB shared + up to 59KB per page
- **Impact**: 12+ second Time to Interactive
- **Crisis Risk**: Users may abandon before functionality loads

### 2. Blocking JavaScript Execution
- **Total Blocking Time**: 1.2+ seconds across all pages
- **Impact**: Pages appear loaded but are unresponsive
- **Crisis Risk**: Users can't interact when they need immediate help

### 3. Large Component Bundles
- **Dashboard**: 58KB+ individual bundle
- **Journals**: 59KB+ individual bundle
- **Auth Signup**: 54KB+ individual bundle
- **Impact**: Excessive component bundling prevents code splitting

---

## 🛠️ IMMEDIATE OPTIMIZATION ACTIONS

### Priority 1: Emergency Bundle Splitting (24-48 hours)

#### 1.1 Implement Aggressive Code Splitting
```javascript
// next.config.js optimization
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'next',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ],
    largePageDataBytes: 8 * 1024, // Reduce to 8KB
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 200,
        maxSize: 5000, // EMERGENCY: 5KB max chunks
        cacheGroups: {
          // Critical path - minimal bundle
          critical: {
            test: /[\\/]src[\\/](components|lib)[\\/].*\.(auth|crisis|emergency)/,
            name: 'critical',
            priority: 100,
            chunks: 'initial',
            maxSize: 8000,
            enforce: true
          },
          // Defer all Firebase to async
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            priority: 90,
            chunks: 'async',
            maxSize: 15000,
            enforce: true
          },
          // Defer heavy components
          heavy: {
            test: /[\\/]src[\\/]components[\\/].*(Dashboard|Journal|Pathway)/,
            name: 'heavy-components',
            priority: 80,
            chunks: 'async',
            maxSize: 10000
          }
        }
      };
    }
    return config;
  }
};
```

#### 1.2 Critical Path Optimization
```typescript
// src/app/layout.tsx - Remove non-critical imports
import dynamic from 'next/dynamic';

// Lazy load heavy components
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), {
  ssr: false,
  loading: () => null
});

const AnalyticsWrapper = dynamic(() => import('@/components/analytics/AnalyticsWrapper'), {
  ssr: false
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {/* Critical path only */}
        {children}
        {/* Load analytics after interaction */}
        <AnalyticsWrapper />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
```

#### 1.3 Component Lazy Loading Strategy
```typescript
// src/app/dashboard/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Critical components load immediately
import CrisisSupport from '@/components/crisis/CrisisSupport';

// Heavy components load on demand
const EmotionalReportCard = dynamic(() => import('@/components/dashboard/EmotionalReportCard'), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
});

const GrowthPortfolioExporter = dynamic(() => import('@/components/dashboard/GrowthPortfolioExporter'), {
  ssr: false
});

export default function Dashboard() {
  return (
    <div>
      {/* Critical - loads immediately */}
      <CrisisSupport />
      
      {/* Important - loads with suspense */}
      <Suspense fallback={<DashboardSkeleton />}>
        <EmotionalReportCard />
      </Suspense>
      
      {/* Non-critical - loads after interaction */}
      <GrowthPortfolioExporter />
    </div>
  );
}
```

### Priority 2: Critical Resource Preloading (48-72 hours)

#### 2.1 Preload Critical Resources
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/api/auth/session" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-subset.woff2" as="font" type="font/woff2" crossOrigin="" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//firebaseapp.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 2.2 Service Worker for Crisis Resources
```javascript
// public/crisis-sw.js
const CRISIS_CACHE = 'crisis-resources-v1';
const CRITICAL_RESOURCES = [
  '/',
  '/auth/login',
  '/dashboard',
  '/api/auth/session',
  '/crisis-resources',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CRISIS_CACHE)
      .then((cache) => cache.addAll(CRITICAL_RESOURCES))
  );
});

// Network first for dynamic content, cache first for static
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Network first for API calls
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CRISIS_CACHE)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for static resources
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

### Priority 3: Database & API Optimization (72-96 hours)

#### 3.1 Firestore Query Optimization
```typescript
// src/lib/useJournals.ts
import { useCallback, useMemo } from 'react';
import { query, orderBy, limit, where, startAfter } from 'firebase/firestore';

export function useOptimizedJournals() {
  // Implement pagination to reduce initial load
  const getRecentJournals = useCallback(async (userId: string, limitCount = 5) => {
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount) // Start with only 5 entries
    );
    
    return getDocs(q);
  }, []);

  // Lazy load additional entries
  const getNextBatch = useCallback(async (userId: string, lastDoc: any) => {
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(10)
    );
    
    return getDocs(q);
  }, []);

  return { getRecentJournals, getNextBatch };
}
```

#### 3.2 API Response Optimization
```typescript
// src/app/api/journal/list/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5'); // Default to 5
  const cursor = searchParams.get('cursor');
  
  // Return minimal data for initial load
  const journals = await getJournals(userId, { limit, cursor });
  
  // Only include essential fields
  const optimizedJournals = journals.map(journal => ({
    id: journal.id,
    title: journal.title,
    createdAt: journal.createdAt,
    mood: journal.mood,
    // Exclude content and metadata for list view
  }));

  return Response.json({ 
    journals: optimizedJournals,
    hasMore: journals.length === limit,
    nextCursor: journals[journals.length - 1]?.id
  });
}
```

### Priority 4: CSS & Asset Optimization (96-120 hours)

#### 4.1 Critical CSS Inlining
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS - inlined for immediate render */
            body { margin: 0; font-family: Inter, sans-serif; }
            .loading-spinner { /* crisis loading indicator */ }
            .crisis-button { /* emergency button styles */ }
            .auth-form { /* login form styles */ }
            /* Only styles needed for above-fold content */
          `
        }} />
        
        {/* Non-critical CSS loads async */}
        <link
          rel="preload"
          href="/styles/non-critical.css"
          as="style"
          onLoad="this.rel='stylesheet'"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 4.2 Font Optimization
```css
/* Critical font subset */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-critical.woff2') format('woff2');
  font-weight: 400 700;
  font-display: swap;
  unicode-range: U+0020-007F; /* Basic Latin only */
}

/* Extended fonts load later */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-extended.woff2') format('woff2');
  font-weight: 400 700;
  font-display: swap;
  unicode-range: U+0080-00FF; /* Latin Extended */
}
```

---

## 📊 PERFORMANCE MONITORING IMPLEMENTATION

### Real-Time Performance Tracking
```typescript
// src/lib/performance-monitor.ts
class CrisisPerformanceMonitor {
  private static instance: CrisisPerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance() {
    if (!CrisisPerformanceMonitor.instance) {
      CrisisPerformanceMonitor.instance = new CrisisPerformanceMonitor();
    }
    return CrisisPerformanceMonitor.instance;
  }

  trackCriticalPath(path: string) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.metrics.set(path, duration);
        
        // Alert if critical path exceeds thresholds
        if (duration > 3000) {
          this.alertSlowPerformance(path, duration);
        }
        
        // Send to analytics
        this.reportMetric(path, duration);
      }
    };
  }

  private alertSlowPerformance(path: string, duration: number) {
    // Log critical performance issues
    console.error(`🚨 CRISIS PERFORMANCE ALERT: ${path} took ${duration}ms`);
    
    // Send to monitoring service
    fetch('/api/performance-alert', {
      method: 'POST',
      body: JSON.stringify({ path, duration, timestamp: Date.now() })
    });
  }

  private reportMetric(path: string, duration: number) {
    // Send to Firebase Analytics with crisis context
    gtag('event', 'performance_metric', {
      event_category: 'crisis_performance',
      event_label: path,
      value: Math.round(duration),
      custom_parameters: {
        is_crisis_path: path.includes('crisis') || path.includes('auth'),
        meets_target: duration < 3000
      }
    });
  }
}
```

### Performance Budget Enforcement
```javascript
// performance-budget.js
const PERFORMANCE_BUDGETS = {
  // Trauma-informed budgets
  firstLoadJS: 120 * 1024, // 120KB max
  firstContentfulPaint: 1200, // 1.2s max
  largestContentfulPaint: 2000, // 2s max
  timeToInteractive: 3000, // 3s max
  cumulativeLayoutShift: 0.05, // 0.05 max
  
  // Crisis-specific budgets
  authFlow: 5000, // 5s total auth flow
  journalCreate: 3000, // 3s journal creation
  crisisAccess: 1000, // 1s crisis resource access
};

function enforceBudgets(metrics) {
  const violations = [];
  
  Object.entries(PERFORMANCE_BUDGETS).forEach(([metric, budget]) => {
    if (metrics[metric] > budget) {
      violations.push({
        metric,
        actual: metrics[metric],
        budget,
        severity: metric.includes('crisis') ? 'CRITICAL' : 'HIGH'
      });
    }
  });
  
  if (violations.length > 0) {
    console.error('🚨 PERFORMANCE BUDGET VIOLATIONS:', violations);
    // Fail CI/CD if critical violations
    if (violations.some(v => v.severity === 'CRITICAL')) {
      process.exit(1);
    }
  }
}
```

---

## 🎯 EXPECTED PERFORMANCE IMPROVEMENTS

### After Emergency Optimizations (Phase 1):
- **Bundle Size**: 147KB → 90KB (39% reduction)
- **Time to Interactive**: 12s → 4s (67% improvement)
- **Lighthouse Performance**: 60 → 85 (42% improvement)

### After Full Implementation (Phase 2):
- **Bundle Size**: 90KB → 60KB (60% total reduction)
- **Time to Interactive**: 4s → 2s (83% total improvement)
- **Lighthouse Performance**: 85 → 95 (58% total improvement)
- **Crisis Readiness**: 0/7 → 7/7 pages (100% compliance)

---

## 🚨 IMPLEMENTATION TIMELINE

### Week 1 (Emergency Response)
- [ ] Implement emergency bundle splitting
- [ ] Add critical resource preloading
- [ ] Deploy service worker for offline support
- [ ] Set up performance monitoring

### Week 2 (Core Optimization)
- [ ] Optimize database queries and API responses
- [ ] Implement critical CSS inlining
- [ ] Add font optimization
- [ ] Configure performance budgets

### Week 3 (Monitoring & Validation)
- [ ] Validate all user journeys meet crisis standards
- [ ] Set up automated performance alerts
- [ ] Create performance regression tests
- [ ] Document performance maintenance procedures

---

## 🔧 MAINTENANCE REQUIREMENTS

### Daily Monitoring
- Performance dashboard checks
- Bundle size regression alerts
- Critical path timing validation

### Weekly Reviews
- User journey performance analysis
- Mobile network simulation tests
- Performance budget compliance

### Monthly Assessments
- Comprehensive Lighthouse audits
- Real user monitoring analysis
- Performance optimization opportunities

---

**CRITICAL NOTE**: This optimization plan addresses life-safety performance requirements for vulnerable users. Implementation should be treated with the same urgency as a security vulnerability, as poor performance can prevent users from accessing critical mental health resources during crisis moments.