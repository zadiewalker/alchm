'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// CRISIS-CRITICAL: Ultra-aggressive lazy loading for bundle optimization
import { Suspense, lazy } from 'react';
import dynamicImport from 'next/dynamic';

const MedicalDisclaimer = dynamicImport(() => import('@/components/ui/MedicalDisclaimer'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-sanctuary-gray-100 rounded-lg h-16"></div>
});

// Lazy load CSS imports to reduce initial bundle
const loadMobileStyles = () => {
  if (typeof window !== 'undefined') {
    import('@/styles/mobile-trauma-informed.css');
    import('@/styles/trauma-informed-animations.css');
    import('@/styles/mobile-browser-optimizations.css');
  }
};

// EMERGENCY: Progressive loading for non-critical dashboard features
const EmotionalReportCard = dynamicImport(() => import('@/components/dashboard/EmotionalReportCard'), { 
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
});

// Load analytics only when user scrolls or after delay
const SanctuaryAnalyticsDashboard = dynamicImport(() => import('@/components/dashboard/SanctuaryAnalyticsDashboard'), { 
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  )
});

// Ultra-lightweight privacy toggle
const QuickPrivacyToggle = dynamicImport(() => import('@/components/privacy/AnalyticsPrivacyControls').then(mod => ({ default: mod.QuickPrivacyToggle })), { 
  ssr: false,
  loading: () => <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
});

// Progressive dashboard sections - commented out for emergency optimization
// These will be loaded only when needed to reduce initial bundle size
// const AdvancedAnalytics = dynamicImport(() => import('@/components/dashboard/AdvancedAnalytics'), {
//   ssr: false,
//   loading: () => null
// });

// const PathwayProgress = dynamicImport(() => import('@/components/dashboard/PathwayProgress'), {
//   ssr: false,
//   loading: () => null
// });

// Lazy load performance monitoring utilities
const loadPerformanceMonitors = () => Promise.all([
  import('@/lib/mobile-performance-crisis-monitor'),
  import('@/lib/navigation-performance-monitor'),
  import('@/lib/crisis-safe-navigation')
]);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [performanceSettings, setPerformanceSettings] = useState<any>(null);
  const [navigationMonitor, setNavigationMonitor] = useState<any>(null);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const initAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
          } else {
            router.push('/auth/login');
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
        router.push('/auth/login');
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  // CRISIS-CRITICAL: Lazy initialize performance monitoring and crisis-safe navigation
  useEffect(() => {
    let unsubscribeCrisis: (() => void) | null = null;
    let unsubscribeNavAlerts: (() => void) | null = null;
    
    // Load mobile styles asynchronously
    loadMobileStyles();
    
    // Initialize performance monitoring asynchronously
    const initMonitoring = async () => {
      try {
        const [
          { initializeMobilePerformanceMonitor },
          { initializeNavigationMonitor },
          { default: crisisNav }
        ] = await loadPerformanceMonitors();
        
        const monitor = initializeMobilePerformanceMonitor();
        const navMonitor = initializeNavigationMonitor();
        setNavigationMonitor(navMonitor);
        
        // Initialize crisis-safe navigation system
        crisisNav.setInCrisis(false);
        
        // Set up performance monitoring listeners
        setPerformanceSettings(monitor.getSettings());
        
        // Crisis mode monitoring
        unsubscribeCrisis = monitor.onCrisisMode((enabled: boolean) => {
          if (enabled) {
            console.log('Crisis mode enabled - optimizing for performance');
            crisisNav.setInCrisis(true);
          }
        });

        // Navigation performance monitoring
        unsubscribeNavAlerts = navMonitor.onNavigationAlert((metric: any, severity: string) => {
          console.warn('Navigation performance alert:', severity, metric);
          
          if (severity === 'crisis') {
            monitor.forceCrisisMode();
          }
        });
        
      } catch (error) {
        console.warn('Performance monitoring initialization failed:', error);
      }
    };
    
    // Delay initialization to avoid blocking initial render
    setTimeout(initMonitoring, 100);
    
    // Listen for performance updates
    const handlePerformanceUpdate = (event: any) => {
      setPerformanceSettings(event.detail.settings);
    };
    
    window.addEventListener('performanceUpdate', handlePerformanceUpdate);
    
    return () => {
      window.removeEventListener('performanceUpdate', handlePerformanceUpdate);
      if (unsubscribeCrisis) unsubscribeCrisis();
      if (unsubscribeNavAlerts) unsubscribeNavAlerts();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      setNavigationLoading(true);
      const auth = await getFirebaseAuth();
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      setNavigationLoading(false);
    }
  };

  // Crisis-safe trauma-informed navigation with loading states and double-tap protection
  const handleNavigation = async (path: string) => {
    const now = Date.now();
    if (now - lastTouchTime < 1000) return; // Prevent accidental double-taps
    
    setLastTouchTime(now);
    setNavigationLoading(true);
    
    let navigationId: string | null = null;
    
    try {
      // Add haptic feedback for supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Track navigation start
      if (navigationMonitor) {
        navigationId = navigationMonitor.trackNavigationStart(path);
      }
      
      // Use Next.js router directly for reliable navigation
      await router.push(path);
      
      // Track successful navigation
      if (navigationMonitor && navigationId) {
        navigationMonitor.trackNavigationEnd(navigationId, true);
      }
      
      setNavigationLoading(false);
    } catch (error) {
      console.error('Navigation error:', error);
      
      // Track failed navigation
      if (navigationMonitor && navigationId) {
        navigationMonitor.trackNavigationEnd(navigationId, false, error.message);
      }
      
      // Show trauma-informed error message
      showNavigationError(path, error);
      setNavigationLoading(false);
    }
  };

  const showNavigationError = (attemptedPath: string, error: any) => {
    const errorNotice = document.createElement('div');
    errorNotice.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(164, 183, 146, 0.95);
      color: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 400px;
      z-index: 999998;
      text-align: center;
      box-shadow: 0 8px 32px rgba(164, 183, 146, 0.3);
    `;
    
    errorNotice.innerHTML = `
      <div style="font-size: 32px; margin-bottom: 16px;">🌿</div>
      <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">
        Taking a gentle pause
      </h3>
      <p style="font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
        We're having a small technical hiccup. Let's try a different approach.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="window.location.href='${attemptedPath}'" style="
          background: white;
          color: #a4b792;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        ">Try Again</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
        ">Stay Here</button>
      </div>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.3);">
        <button onclick="window.open('tel:988', '_self')" style="
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        ">🆘 Need Support? Call 988</button>
      </div>
    `;
    
    document.body.appendChild(errorNotice);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorNotice.parentElement) {
        errorNotice.remove();
      }
    }, 10000);
  };

  // Crisis support with enhanced mobile accessibility
  const handleCrisisSupport = () => {
    // Immediate haptic feedback for crisis support
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]); // Double pulse for urgency
    }
    
    // Multiple fallback methods for crisis support
    try {
      window.open('tel:988', '_self');
    } catch (error) {
      // Fallback to showing the number
      alert('Crisis Support: 988\nNational Suicide Prevention Lifeline');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-gentle-pulse">🌿</div>
          <h1 className="text-2xl font-light mb-4 text-sanctuary-white">Loading your sanctuary...</h1>
          <div className="w-6 h-6 mx-auto border-2 border-sanctuary-white/25 border-t-sanctuary-white/70 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600">
      {/* Sacred Sanctuary Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-sanctuary/5 via-transparent to-sanctuary/10 pointer-events-none"></div>
      
      {/* Viewport meta for mobile optimization */}
      <div className="sr-only">
        ALCHM Dashboard - Your sanctuary for healing and growth
      </div>
      
      {/* Floating Header with Sanctuary Glass */}
      <header className="relative z-10 mb-phi-xl">
        <div className="sanctuary-glass border border-sanctuary/20 m-6 rounded-3xl p-phi-lg shadow-floating animate-sanctuary-float">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-phi-md">
            <div className="flex-1">
              <h1 className="text-xlarge font-light text-sanctuary mb-phi-xs tracking-normal animate-gentle-breathe">
                Welcome to your sanctuary
              </h1>
              <p className="text-sanctuary/80 text-small font-light tracking-wide break-all">{user?.email}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="touch"
              disabled={navigationLoading}
              className="sanctuary-glass border border-sanctuary/30 hover:border-sanctuary/50 hover:shadow-soft backdrop-blur-xl min-h-[52px] min-w-[120px] text-sanctuary rounded-2xl transition-all duration-400 hover:scale-105 active:scale-95"
              aria-label="Sign out of ALCHM"
            >
              {navigationLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-sanctuary/25 border-t-sanctuary rounded-full animate-spin"></div>
                  <span className="font-light">Signing out...</span>
                </div>
              ) : (
                <span className="font-light">Sign Out</span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Sacred Sanctuary Cards */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-phi-lg mb-phi-2xl">
          
          {/* Sacred Journal Card */}
          <div 
            onClick={() => handleNavigation('/journal')}
            className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating hover:shadow-sacred cursor-pointer group transition-all duration-600 hover:scale-105 active:scale-98 touch-target-large"
            style={{ touchAction: 'manipulation' }}
            role="button"
            tabIndex={0}
            aria-label="Create new journal entry - Share your thoughts in a safe space"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigation('/journal');
              }
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-phi-md group-hover:animate-heart-sparkle transition-all duration-400" role="img" aria-label="Writing emoji">
                ✍️
              </div>
              <h3 className="text-large font-light text-sage-700 mb-phi-sm tracking-normal">
                Sacred Journal
              </h3>
              <p className="text-sage-600 leading-relaxed text-small font-normal">
                Express your thoughts in this protected sanctuary
              </p>
              {navigationLoading && (
                <div className="mt-phi-sm flex items-center justify-center gap-2 text-sage-500">
                  <div className="w-3 h-3 border-2 border-sage-400/25 border-t-sage-400 rounded-full animate-spin"></div>
                  <span className="text-phi-xs font-light">Opening sanctuary...</span>
                </div>
              )}
            </div>
            
            {/* Floating sparkle decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">✨</div>
          </div>

          {/* Sacred Library Card */}
          <div 
            onClick={() => handleNavigation('/journals')}
            className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating hover:shadow-sacred cursor-pointer group transition-all duration-600 hover:scale-105 active:scale-98 touch-target-large"
            style={{ touchAction: 'manipulation' }}
            role="button"
            tabIndex={0}
            aria-label="View past journal entries - Review your healing journey"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigation('/journals');
              }
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-phi-md group-hover:animate-heart-sparkle transition-all duration-400" role="img" aria-label="Books emoji">
                📚
              </div>
              <h3 className="text-large font-light text-sage-700 mb-phi-sm tracking-normal">
                Sacred Library
              </h3>
              <p className="text-sage-600 leading-relaxed text-small font-normal">
                Revisit your journey and celebrate growth
              </p>
              {navigationLoading && (
                <div className="mt-phi-sm flex items-center justify-center gap-2 text-sage-500">
                  <div className="w-3 h-3 border-2 border-sage-400/25 border-t-sage-400 rounded-full animate-spin"></div>
                  <span className="text-phi-xs font-light">Opening library...</span>
                </div>
              )}
            </div>
            
            {/* Floating sparkle decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">✨</div>
          </div>

          {/* Community Healing Sanctuary */}
          <div 
            onClick={() => handleNavigation('/community')}
            className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating hover:shadow-sacred cursor-pointer group transition-all duration-600 hover:scale-105 active:scale-98 touch-target-large"
            style={{ touchAction: 'manipulation' }}
            role="button"
            tabIndex={0}
            aria-label="Join healing community - Connect anonymously with others on similar journeys"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigation('/community');
              }
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-phi-md group-hover:animate-heart-sparkle transition-all duration-400" role="img" aria-label="Community emoji">
                🌍
              </div>
              <h3 className="text-large font-light text-sage-700 mb-phi-sm tracking-normal">
                Community Healing
              </h3>
              <p className="text-sage-600 leading-relaxed text-small font-normal">
                Connect anonymously with others on healing journeys
              </p>
              {navigationLoading && (
                <div className="mt-phi-sm flex items-center justify-center gap-2 text-sage-500">
                  <div className="w-3 h-3 border-2 border-sage-400/25 border-t-sage-400 rounded-full animate-spin"></div>
                  <span className="text-phi-xs font-light">Connecting sanctuary...</span>
                </div>
              )}
            </div>
            
            {/* Community sparkle decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">🤝</div>
          </div>

          {/* Premium Sanctuary Card */}
          <div 
            onClick={() => handleNavigation('/pricing')}
            className="organic-container sanctuary-glass border border-sage-400/30 p-phi-lg shadow-floating hover:shadow-sacred cursor-pointer group transition-all duration-600 hover:scale-105 active:scale-98 touch-target-large bg-gradient-to-br from-sanctuary/90 to-sage-50/90"
            style={{ touchAction: 'manipulation' }}
            role="button"
            tabIndex={0}
            aria-label="View premium features - Unlock advanced AI insights and healing tools"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigation('/pricing');
              }
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-phi-md group-hover:animate-heart-sparkle transition-all duration-400" role="img" aria-label="Gem emoji">
                💎
              </div>
              <h3 className="text-large font-light text-sage-700 mb-phi-sm tracking-normal">
                Premium Sanctuary
              </h3>
              <p className="text-sage-600 leading-relaxed text-small font-normal">
                Unlock deeper wisdom and advanced healing tools
              </p>
              {navigationLoading && (
                <div className="mt-phi-sm flex items-center justify-center gap-2 text-sage-500">
                  <div className="w-3 h-3 border-2 border-sage-400/25 border-t-sage-400 rounded-full animate-spin"></div>
                  <span className="text-phi-xs font-light">Loading sanctuary...</span>
                </div>
              )}
            </div>
            
            {/* Premium sparkle decoration with golden hint */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">✨</div>
            <div className="absolute -bottom-1 -left-1 text-warm-amber opacity-50 animate-gentle-sparkle animation-delay-1000">✨</div>
          </div>

          {/* Crisis Support Sanctuary - Enhanced Accessibility */}
          <div 
            onClick={handleCrisisSupport}
            className="organic-container border-4 border-crisis-red/60 p-phi-lg shadow-floating hover:shadow-nurturing cursor-pointer group transition-all duration-600 hover:scale-105 active:scale-98 touch-target-emergency bg-gradient-to-br from-red-50/95 to-sanctuary/95 backdrop-blur-xl animate-crisis-attention"
            style={{ touchAction: 'manipulation' }}
            role="button"
            tabIndex={0}
            aria-label="Emergency crisis support - Call 988 National Suicide Prevention Lifeline immediately"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCrisisSupport();
              }
            }}
          >
            <div className="text-center">
              <div className="text-7xl mb-phi-md group-hover:animate-heart-sparkle transition-all duration-400" role="img" aria-label="Emergency SOS emoji">
                🆘
              </div>
              <h3 className="text-large font-medium text-crisis-red mb-phi-sm tracking-normal">
                Crisis Sanctuary
              </h3>
              <p className="text-crisis-red leading-relaxed text-small font-medium mb-phi-xs">
                Immediate help is available 24/7
              </p>
              <p className="text-crisis-red/80 text-micro font-medium">
                Tap to call 988
              </p>
            </div>
            
            {/* Crisis attention pulse decoration */}
            <div className="absolute inset-0 rounded-3xl border-2 border-crisis-red/20 animate-crisis-attention"></div>
          </div>

          {/* Sacred Growth Sanctuary */}
          <div className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating group">
            <div className="text-center">
              <div className="text-6xl mb-phi-md animate-gentle-breathe" role="img" aria-label="Seedling emoji">🌱</div>
              <h3 className="text-phi-lg font-light text-sage-700 mb-phi-sm tracking-wide">
                Sacred Growth
              </h3>
              <p className="text-sage-600 leading-relaxed text-phi-sm font-light mb-phi-md">
                Witnessing your healing journey unfold
              </p>
              
              {/* Sacred Progress Visualization */}
              <div className="relative">
                <div className="bg-sage-100/60 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-sage-400 to-sage-500 h-2 rounded-full w-1/3 transition-all duration-1000 animate-gentle-breathe shadow-soft"></div>
                </div>
                <div className="absolute -top-1 left-1/3 w-4 h-4 bg-sage-400 rounded-full shadow-soft animate-gentle-pulse transform -translate-x-1/2"></div>
              </div>
            </div>
            
            {/* Growth sparkle decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">🌿</div>
          </div>

          {/* Sacred Resources Sanctuary */}
          <div className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating group">
            <div className="text-center">
              <div className="text-6xl mb-phi-md animate-gentle-breathe" role="img" aria-label="Book emoji">📖</div>
              <h3 className="text-phi-lg font-light text-sage-700 mb-phi-sm tracking-wide">
                Sacred Resources
              </h3>
              <p className="text-sage-600 leading-relaxed text-phi-sm font-light mb-phi-md">
                Wisdom guides for your healing path
              </p>
              
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center px-phi-sm py-phi-xs bg-gradient-to-r from-sage-100/80 to-sage-50/80 rounded-full border border-sage-200/60 backdrop-blur-sm">
                <span className="text-sage-600 text-phi-xs font-light">Sanctuary opening soon</span>
                <div className="ml-2 w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse"></div>
              </div>
            </div>
            
            {/* Wisdom sparkle decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">📚</div>
          </div>

        </div>

        {/* Sacred Insights Dashboard */}
        <div className="mb-phi-2xl">
          {user && (
            <div className="space-y-phi-xl">
              {/* Sacred Emotional Insights */}
              <div className="sanctuary-glass border border-sanctuary/20 rounded-3xl p-phi-xl shadow-floating animate-sanctuary-float">
                <EmotionalReportCard 
                  timeframe="month" 
                  showPrivacyIndicator={true}
                />
              </div>
              
              {/* Mobile Sacred Analytics Portal */}
              <div className="lg:hidden">
                <div 
                  onClick={() => handleNavigation('/analytics')}
                  className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating hover:shadow-sacred cursor-pointer group transition-all duration-600 hover:scale-102 active:scale-98 touch-target-large"
                  style={{ touchAction: 'manipulation' }}
                  role="button"
                  tabIndex={0}
                  aria-label="View detailed emotional analytics - Explore your healing journey insights"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-phi-md">
                      <div className="text-phi-2xl group-hover:animate-heart-sparkle transition-all duration-400">🌸</div>
                      <div>
                        <h3 className="text-phi-md font-light text-sage-700 mb-phi-xs tracking-wide">
                          Sacred Analytics
                        </h3>
                        <p className="text-sage-600 text-phi-sm font-light leading-relaxed">
                          Explore your complete healing journey
                        </p>
                      </div>
                    </div>
                    <div className="text-sage-400 group-hover:text-sage-600 transition-colors duration-400 text-phi-lg">
                      →
                    </div>
                  </div>
                  
                  {/* Analytics sparkle decoration */}
                  <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">📊</div>
                </div>
              </div>
              
              {/* Sacred Analytics Cathedral for Desktop */}
              <div className="hidden lg:block">
                <div className="sanctuary-glass border border-sanctuary/20 rounded-3xl p-phi-xl shadow-floating">
                  <SanctuaryAnalyticsDashboard />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sacred Privacy Sanctuary */}
        <div className="mb-phi-xl">
          {user && (
            <div className="organic-container sanctuary-glass border border-sanctuary/20 p-phi-lg shadow-floating">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-phi-md font-light text-sage-700 mb-phi-xs tracking-wide">Sacred Privacy</h3>
                  <p className="text-sage-600 text-phi-xs font-light">Your data sanctuary remains under your control</p>
                </div>
                <div className="sanctuary-glass rounded-full p-phi-xs border border-sanctuary/30">
                  <QuickPrivacyToggle userId={user.uid} />
                </div>
              </div>
              
              {/* Privacy sparkle decoration */}
              <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">🔒</div>
            </div>
          )}
        </div>
      </div>

      {/* Sacred Crisis Support Portal - Floating Guardian */}
      <div className="fixed bottom-phi-lg right-phi-lg z-50">
        <div 
          onClick={handleCrisisSupport}
          className="organic-container bg-gradient-to-br from-crisis-red to-red-600 border-4 border-sanctuary/30 w-20 h-20 shadow-sacred animate-crisis-attention cursor-pointer group transition-all duration-400 hover:scale-110 active:scale-95 touch-target-emergency flex items-center justify-center"
          style={{ 
            touchAction: 'manipulation',
            minWidth: '80px',
            minHeight: '80px',
            WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)'
          }}
          role="button"
          tabIndex={0}
          aria-label="Emergency crisis support - Call 988 National Suicide Prevention Lifeline"
        >
          <span className="text-phi-xl text-sanctuary animate-gentle-pulse group-hover:animate-heart-sparkle" role="img" aria-label="Emergency SOS">🆘</span>
          
          {/* Crisis pulse ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-crisis-red/40 animate-crisis-attention"></div>
          <div className="absolute inset-0 rounded-3xl border border-sanctuary/40 animate-gentle-pulse"></div>
        </div>
      </div>
      
      {/* Screen reader announcement for crisis support */}
      <div className="sr-only" aria-live="polite" id="crisis-announcement">
        Crisis support is always available. Tap the emergency button to call 988.
      </div>
      
      {/* Medical Disclaimer - Important for user safety */}
      <div className="mt-8 px-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}