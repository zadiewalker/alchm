/**
 * Mobile Optimization Provider - Core Crisis Safety System
 * Orchestrates all mobile optimizations for vulnerable users
 * Philosophy: "Invisible protection that just works"
 */

"use client";

import { useEffect, useState, createContext, useContext } from 'react';
import dynamic from 'next/dynamic';
import { offlineCrisisManager } from '../lib/offline-crisis-manager';
import { mobilePerformanceMonitor } from '../lib/mobile-performance-monitor';
import { crisisResourcePreloader } from '../lib/crisis-resource-preloader';
import { useAuthPageGuard } from '../lib/auth-page-guard';

// Lazy load components to improve initial performance
const CrisisFloatingButton = dynamic(() => import('./ui/CrisisFloatingButton'), { 
  ssr: false,
  loading: () => null // No loading state for crisis button - it must be instant
});

const PanicSafeNavigation = dynamic(() => import('./PanicSafeNavigation'), {
  ssr: false,
  loading: () => null
});

const PWAInstaller = dynamic(() => import('./PWAInstaller'), {
  ssr: false,
  loading: () => null
});

const EmergencyModeTest = dynamic(() => import('./EmergencyModeTest'), {
  ssr: false,
  loading: () => null
});

interface MobileOptimizationContext {
  isOffline: boolean;
  isCrisisMode: boolean;
  isLowBattery: boolean;
  deviceTier: string;
  networkSpeed: string;
  enableCrisisMode: () => void;
  disableCrisisMode: () => void;
  isEmergencyModeOptimal: boolean;
}

const MobileContext = createContext<MobileOptimizationContext>({
  isOffline: false,
  isCrisisMode: false,
  isLowBattery: false,
  deviceTier: 'medium',
  networkSpeed: 'unknown',
  enableCrisisMode: () => {},
  disableCrisisMode: () => {},
  isEmergencyModeOptimal: true
});

export const useMobileOptimization = () => useContext(MobileContext);

interface MobileOptimizationProviderProps {
  children: React.ReactNode;
}

export default function MobileOptimizationProvider({ children }: MobileOptimizationProviderProps) {
  const [isInitialized, setIsInitialized] = useState(true); // Start as initialized to avoid blocking
  const [isOffline, setIsOffline] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [deviceTier, setDeviceTier] = useState('medium');
  const [networkSpeed, setNetworkSpeed] = useState('unknown');
  const [isEmergencyModeOptimal, setIsEmergencyModeOptimal] = useState(true);
  const [showDevTools, setShowDevTools] = useState(false);
  
  // EMERGENCY FIX: Auth page guard to prevent blocking sign-in
  const isAuthPage = useAuthPageGuard();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // MOBILE EMERGENCY: Multiple sage color enforcement waves
    forceSageColors(); // Immediate
    setTimeout(forceSageColors, 0); // Next tick
    setTimeout(forceSageColors, 50); // After paint
    setTimeout(forceSageColors, 100); // After layout
    setTimeout(forceSageColors, 250); // After fonts/images
    setTimeout(forceSageColors, 500); // After full render
    setTimeout(forceSageColors, 1000); // Safety net
    setTimeout(forceSageColors, 2000); // Final backup

    // Initialize in the background without blocking render
    initializeMobileOptimizations().catch(console.error);
  }, []);

  const forceSageColors = () => {
    console.log('🚨 MOBILE OPTIMIZATION: Nuclear sage color enforcement');
    
    const SAGE_PRIMARY = '#a4b792';
    const SAGE_SECONDARY = '#8fa37c';
    const SAGE_GRADIENT = `linear-gradient(145deg, ${SAGE_PRIMARY} 0%, ${SAGE_SECONDARY} 100%)`;
    const WHITE_TEXT = '#fefcfb';
    
    try {
      // 1. Force on critical DOM elements with maximum specificity
      const criticalElements = [
        document.documentElement,
        document.body,
        document.querySelector('main'),
        document.querySelector('.sanctuary-layout'),
        document.querySelector('.auth-sanctuary'),
        document.querySelector('.home-sanctuary'),
        document.querySelector('[data-sage-version]')
      ].filter(Boolean);
      
      criticalElements.forEach(el => {
        if (el) {
          el.style.cssText += `
            background: ${SAGE_GRADIENT} !important;
            background-color: ${SAGE_PRIMARY} !important;
            background-attachment: fixed !important;
            -webkit-background-attachment: fixed !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            color: ${WHITE_TEXT} !important;
          `;
          
          // Add class for CSS targeting
          el.classList.add('sage-enforced');
        }
      });
      
      // 2. Force ALL CSS custom properties related to sage/backgrounds
      const cssProperties = {
        '--surface': SAGE_PRIMARY,
        '--surface-light': '#f7f7f2',
        '--ink': '#2e2e2e',
        '--ink-mute': '#494949', 
        '--sage': SAGE_PRIMARY,
        '--sage-primary': SAGE_PRIMARY,
        '--sage-secondary': SAGE_SECONDARY,
        '--sage-tertiary': '#7a8f67',
        '--sage-400': SAGE_PRIMARY,
        '--sage-500': SAGE_SECONDARY,
        '--sage-600': '#7a8f67',
        '--color-primary': SAGE_PRIMARY,
        '--color-primary-hover': SAGE_SECONDARY,
        '--sanctuary-white': WHITE_TEXT
      };
      
      Object.entries(cssProperties).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(prop, value, 'important');
      });
      
      // 3. Add mobile-specific sage enforcement
      if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-sage-enforced');
        
        // Force gradient on viewport meta tag change (mobile keyboard, etc.)
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && !viewport.hasAttribute('data-sage-enforced')) {
          viewport.setAttribute('data-sage-enforced', 'true');
        }
      }
      
      // 4. Cache prevention
      document.documentElement.setAttribute('data-sage-nuclear-timestamp', Date.now().toString());
      
      console.log('✅ MOBILE OPTIMIZATION: Nuclear sage enforcement complete');
      
    } catch (error) {
      console.error('❌ MOBILE OPTIMIZATION: Sage enforcement failed:', error);
      
      // Fallback - basic enforcement
      if (document.body) {
        document.body.style.background = SAGE_GRADIENT;
        document.body.style.backgroundColor = SAGE_PRIMARY;
      }
    }
  };

  const initializeMobileOptimizations = async () => {
    try {
      console.log('[Mobile Optimization] Initializing crisis safety systems');

      // Basic initialization without complex dependencies
      setupBasicNetworkMonitoring();
      setupBasicAccessibilityDetection();
      setupBasicEmergencyMode();
      
      // More complex systems can initialize in the background
      setTimeout(() => {
        initializeComplexSystems().catch(console.error);
      }, 100);

      console.log('[Mobile Optimization] Core systems initialized');

    } catch (error) {
      console.error('[Mobile Optimization] Initialization failed:', error);
    }
  };

  const initializeComplexSystems = async () => {
    try {
      // These can fail without breaking the app
      await Promise.allSettled([
        initializeOfflineManager(),
        initializePerformanceMonitor(), 
        initializeCrisisPreloader()
      ]);
      
      updateSystemStates();
      setupDevToolsShortcut();
      
    } catch (error) {
      console.error('[Mobile Optimization] Complex systems failed:', error);
    }
  };

  const initializeOfflineManager = async () => {
    try {
      await offlineCrisisManager.initialize();
      offlineCrisisManager.setupNetworkListener();
    } catch (error) {
      console.error('[Mobile Optimization] Offline manager failed:', error);
    }
  };

  const initializePerformanceMonitor = async () => {
    try {
      await mobilePerformanceMonitor.initialize();
      setDeviceTier(mobilePerformanceMonitor.getDeviceTier());
      setIsEmergencyModeOptimal(mobilePerformanceMonitor.isCrisisModeOptimal());
    } catch (error) {
      console.error('[Mobile Optimization] Performance monitor failed:', error);
    }
  };

  const initializeCrisisPreloader = async () => {
    try {
      await crisisResourcePreloader.initialize();
    } catch (error) {
      console.error('[Mobile Optimization] Crisis preloader failed:', error);
    }
  };

  const setupBasicNetworkMonitoring = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check
  };

  const setupNetworkMonitoring = () => {
    setupBasicNetworkMonitoring();

    // Monitor connection speed changes
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const updateConnectionSpeed = () => {
        setNetworkSpeed(connection.effectiveType || 'unknown');
      };
      connection.addEventListener('change', updateConnectionSpeed);
      updateConnectionSpeed();
    }

    return () => {
      window.removeEventListener('online', () => setIsOffline(!navigator.onLine));
      window.removeEventListener('offline', () => setIsOffline(!navigator.onLine));
    };
  };

  const setupBatteryMonitoring = async () => {
    try {
      // @ts-ignore - navigator.getBattery is experimental
      const battery = await navigator.getBattery();
      
      const updateBatteryStatus = () => {
        setIsLowBattery(battery.level < 0.2);
      };

      battery.addEventListener('levelchange', updateBatteryStatus);
      battery.addEventListener('chargingchange', updateBatteryStatus);
      updateBatteryStatus();
      
    } catch (error) {
      console.log('[Mobile Optimization] Battery API not available');
    }
  };

  const setupBasicAccessibilityDetection = () => {
    // Apply basic accessibility preferences without complex listeners
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');

      if (prefersReducedMotion.matches) {
        document.body.classList.add('prefers-reduced-motion');
      }
      if (prefersHighContrast.matches) {
        document.body.classList.add('prefers-high-contrast');
      }
    } catch (error) {
      console.log('[Mobile Optimization] Basic accessibility detection failed:', error);
    }
  };

  const setupAccessibilityDetection = () => {
    // Apply accessibility preferences immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    const prefersLargeText = window.matchMedia('(prefers-reduced-data: reduce)'); // Proxy for low-end devices

    const applyAccessibilityPreferences = () => {
      if (prefersReducedMotion.matches) {
        document.body.classList.add('prefers-reduced-motion');
      }
      if (prefersHighContrast.matches) {
        document.body.classList.add('prefers-high-contrast');
      }
      if (prefersLargeText.matches) {
        document.body.classList.add('prefers-large-text');
      }
    };

    // Apply immediately and listen for changes
    applyAccessibilityPreferences();
    prefersReducedMotion.addEventListener('change', applyAccessibilityPreferences);
    prefersHighContrast.addEventListener('change', applyAccessibilityPreferences);
  };

  const setupBasicEmergencyMode = () => {
    // Simple emergency mode detection
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof localStorage === 'undefined') return;
    
    try {
      const emergencyMode = localStorage.getItem('alchm_emergency_mode') === 'true';
      if (emergencyMode) {
        setIsCrisisMode(true);
        document.body.classList.add('crisis-active', 'emergency-mode');
      }
    } catch (error) {
      console.log('[Mobile Optimization] Emergency mode detection failed:', error);
    }
  };

  const setupEmergencyModeDetection = () => {
    setupBasicEmergencyMode();

    // Listen for emergency triggers
    window.addEventListener('emergency-trigger', enableCrisisMode);
    window.addEventListener('panic-detected', enableCrisisMode);
    window.addEventListener('crisis-language-detected', enableCrisisMode);

    return () => {
      window.removeEventListener('emergency-trigger', enableCrisisMode);
      window.removeEventListener('panic-detected', enableCrisisMode);
      window.removeEventListener('crisis-language-detected', enableCrisisMode);
    };
  };

  const setupDevToolsShortcut = () => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        setShowDevTools(!showDevTools);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  };

  const updateSystemStates = () => {
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }
    
    // Check if we're in crisis mode (can fail safely)
    try {
      const crisisMode = offlineCrisisManager.isEmergencyMode();
      setIsCrisisMode(crisisMode);
    } catch (error) {
      console.error('[Mobile Optimization] Crisis mode check failed:', error);
    }
  };

  const enableCrisisMode = () => {
    console.log('[Mobile Optimization] Activating crisis mode');
    
    setIsCrisisMode(true);
    
    if (typeof document !== 'undefined') {
      // Apply crisis-specific optimizations
      document.body.classList.add('crisis-active');
      document.body.classList.add('emergency-mode');
    }
    
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      // Haptic feedback for crisis mode activation
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Background system calls that can fail safely
    setTimeout(() => {
      try {
        offlineCrisisManager.enableEmergencyMode();
        crisisResourcePreloader.initialize();
      } catch (error) {
        console.error('[Mobile Optimization] Crisis mode system activation failed:', error);
      }
    }, 0);
  };

  const disableCrisisMode = () => {
    console.log('[Mobile Optimization] Deactivating crisis mode');
    
    setIsCrisisMode(false);
    
    if (typeof document !== 'undefined') {
      // Remove crisis-specific classes
      document.body.classList.remove('crisis-active');
      document.body.classList.remove('emergency-mode');
    }
    
    // Background system calls that can fail safely
    setTimeout(() => {
      try {
        offlineCrisisManager.disableEmergencyMode();
      } catch (error) {
        console.error('[Mobile Optimization] Crisis mode deactivation failed:', error);
      }
    }, 0);
  };

  // Context value
  const contextValue: MobileOptimizationContext = {
    isOffline,
    isCrisisMode,
    isLowBattery,
    deviceTier,
    networkSpeed,
    enableCrisisMode,
    disableCrisisMode,
    isEmergencyModeOptimal
  };

  if (!isInitialized) {
    // Show minimal loading screen while systems initialize
    return (
      <div className="flex items-center justify-center min-h-screen bg-sanctuary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sage-600 font-medium">Preparing your sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <MobileContext.Provider value={contextValue}>
      {children}
      
      {/* EMERGENCY FIX: Only show overlays when NOT on auth pages */}
      {!isAuthPage && (
        <>
          {/* Crisis Support - Hidden on auth pages to prevent blocking sign-in */}
          <CrisisFloatingButton />
          
          {/* Navigation - Adapts to crisis mode, hidden on auth pages */}
          <PanicSafeNavigation 
            isInCrisis={isCrisisMode}
            userPreferences={{
              reducedMotion: typeof document !== 'undefined' ? document.body.classList.contains('prefers-reduced-motion') : false,
              highContrast: typeof document !== 'undefined' ? document.body.classList.contains('prefers-high-contrast') : false,
              largeText: typeof document !== 'undefined' ? document.body.classList.contains('prefers-large-text') : false
            }}
          />
          
          {/* PWA Installation Prompt - Hidden on auth pages */}
          <PWAInstaller />
        </>
      )}
      
      {/* Development Tools (only in dev mode) - NOT auth page guarded since dev only */}
      {showDevTools && process.env.NODE_ENV === 'development' && (
        <EmergencyModeTest />
      )}

      {/* EMERGENCY FIX: System indicators are auth-page guarded to prevent blocking sign-in */}
      {!isAuthPage && (
        <>
          {/* Offline Indicator */}
          {isOffline && (
            <div className="offline-indicator">
              📡 Working offline
            </div>
          )}

          {/* Low Battery Warning */}
          {isLowBattery && (
            <div className="battery-warning">
              🔋 Low battery - Power saving mode active
            </div>
          )}

          {/* Crisis Mode Indicator */}
          {isCrisisMode && (
            <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
              <span className="font-semibold">Crisis Support Active</span>
              <button 
                onClick={disableCrisisMode}
                className="ml-4 px-3 py-1 bg-white text-red-600 rounded text-sm hover:bg-red-50"
              >
                Deactivate
              </button>
            </div>
          )}

          {/* Performance Warning for Critical Situations */}
          {!isEmergencyModeOptimal && isCrisisMode && (
            <div className="fixed bottom-20 left-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-lg z-40">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Your device is running in low-performance mode. Crisis features are optimized but may load slower.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </MobileContext.Provider>
  );
}