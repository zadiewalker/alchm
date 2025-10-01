/**
 * Privacy-Enhanced Mobile Optimization Provider
 * Implements additional privacy safeguards for vulnerable youth users
 * Compliant with COPPA, FERPA, GDPR, and CCPA requirements
 */

"use client";

import { useEffect, useState, createContext, useContext } from 'react';
import { mobilePerformanceMonitor } from '../lib/mobile-performance-monitor';

interface PrivacyEnhancedMobileContext {
  isOffline: boolean;
  isCrisisMode: boolean;
  deviceTier: string;
  privacyLevel: 'minimal' | 'standard' | 'maximum';
  enableCrisisMode: () => void;
  disableCrisisMode: () => void;
  updatePrivacyLevel: (level: 'minimal' | 'standard' | 'maximum') => void;
  // Enhanced privacy controls
  clearAllLocalData: () => void;
  exportUserData: () => Promise<any>;
  revokeConsent: () => void;
}

const PrivacyEnhancedContext = createContext<PrivacyEnhancedMobileContext>({
  isOffline: false,
  isCrisisMode: false,
  deviceTier: 'medium',
  privacyLevel: 'standard',
  enableCrisisMode: () => {},
  disableCrisisMode: () => {},
  updatePrivacyLevel: () => {},
  clearAllLocalData: () => {},
  exportUserData: async () => ({}),
  revokeConsent: () => {}
});

export const usePrivacyEnhancedMobile = () => useContext(PrivacyEnhancedContext);

interface PrivacyEnhancedMobileProviderProps {
  children: React.ReactNode;
}

export default function PrivacyEnhancedMobileProvider({ children }: PrivacyEnhancedMobileProviderProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [deviceTier, setDeviceTier] = useState('medium');
  const [privacyLevel, setPrivacyLevel] = useState<'minimal' | 'standard' | 'maximum'>('standard');

  useEffect(() => {
    initializePrivacyEnhancedMobile();
  }, []);

  const initializePrivacyEnhancedMobile = async () => {
    // Initialize with privacy-first approach
    await enforcePrivacySafeColors();
    await setupPrivacyCompliantMonitoring();
    
    // Load user privacy preferences
    loadPrivacyPreferences();
  };

  const enforcePrivacySafeColors = async () => {
    // PRIVACY COMPLIANCE: Color forcing without data collection
    const SAGE_PRIMARY = '#a4b792';
    const SAGE_SECONDARY = '#8fa37c';
    const SAGE_GRADIENT = `linear-gradient(145deg, ${SAGE_PRIMARY} 0%, ${SAGE_SECONDARY} 100%)`;

    try {
      // Apply colors with zero data collection
      const criticalElements = [
        typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement,
        typeof window !== 'undefined' && document.body,
        typeof window !== 'undefined' && document.querySelector('main')
      ].filter(Boolean);

      criticalElements.forEach(el => {
        if (el) {
          el.style.cssText += `
            background: ${SAGE_GRADIENT} !important;
            background-color: ${SAGE_PRIMARY} !important;
            min-height: 100vh !important;
          `;
        }
      });

      // Privacy-compliant CSS properties (no user identification)
      const anonymousProperties = {
        '--sage-primary': SAGE_PRIMARY,
        '--sage-secondary': SAGE_SECONDARY
      };

      Object.entries(anonymousProperties).forEach(([prop, value]) => {
        typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement.style.setProperty(prop, value, 'important');
      });

    } catch (error) {
      console.error('[Privacy Mobile] Color enforcement failed:', error);
    }
  };

  const setupPrivacyCompliantMonitoring = async () => {
    // COPPA/GDPR Compliant monitoring - no personal data collection
    try {
      // Basic network status (no user identification)
      const updateOnlineStatus = () => {
        setIsOffline(!typeof window !== 'undefined' && navigator.onLine);
      };

      typeof window !== 'undefined' && window.addEventListener('online', updateOnlineStatus);
      typeof window !== 'undefined' && window.addEventListener('offline', updateOnlineStatus);
      updateOnlineStatus();

      // Device performance tier (anonymous)
      if (mobilePerformanceMonitor) {
        await mobilePerformanceMonitor.initialize();
        setDeviceTier(mobilePerformanceMonitor.getDeviceTier());
      }

    } catch (error) {
      console.error('[Privacy Mobile] Monitoring setup failed:', error);
    }
  };

  const loadPrivacyPreferences = () => {
    try {
      // Load privacy level preference (no personal identification)
      const storedLevel = typeof window !== 'undefined' && localStorage.getItem('alchm_privacy_level') as 'minimal' | 'standard' | 'maximum';
      if (storedLevel && ['minimal', 'standard', 'maximum'].includes(storedLevel)) {
        setPrivacyLevel(storedLevel);
      }
    } catch (error) {
      console.log('[Privacy Mobile] Could not load preferences:', error);
      // Default to maximum privacy on error
      setPrivacyLevel('maximum');
    }
  };

  const enableCrisisMode = () => {
    console.log('[Privacy Mobile] Activating crisis mode (anonymous)');
    
    setIsCrisisMode(true);
    
    // Store crisis mode preference (no user identification)
    try {
      typeof window !== 'undefined' && localStorage.setItem('alchm_emergency_mode', 'true');
    } catch (error) {
      console.error('[Privacy Mobile] Could not store crisis preference:', error);
    }
    
    // Apply crisis-specific styles
    if (typeof window !== 'undefined' && document.body) {
      typeof window !== 'undefined' && document.body.classList.add('crisis-active', 'emergency-mode');
    }
    
    // Haptic feedback (no data collection)
    if (typeof window !== 'undefined' && navigator.vibrate) {
      typeof window !== 'undefined' && navigator.vibrate([200, 100, 200]);
    }
  };

  const disableCrisisMode = () => {
    console.log('[Privacy Mobile] Deactivating crisis mode');
    
    setIsCrisisMode(false);
    
    try {
      typeof window !== 'undefined' && localStorage.removeItem('alchm_emergency_mode');
    } catch (error) {
      console.error('[Privacy Mobile] Could not clear crisis preference:', error);
    }
    
    if (typeof window !== 'undefined' && document.body) {
      typeof window !== 'undefined' && document.body.classList.remove('crisis-active', 'emergency-mode');
    }
  };

  const updatePrivacyLevel = (level: 'minimal' | 'standard' | 'maximum') => {
    setPrivacyLevel(level);
    
    try {
      typeof window !== 'undefined' && localStorage.setItem('alchm_privacy_level', level);
    } catch (error) {
      console.error('[Privacy Mobile] Could not store privacy preference:', error);
    }

    // Apply privacy level specific optimizations
    applyPrivacyLevelSettings(level);
  };

  const applyPrivacyLevelSettings = (level: 'minimal' | 'standard' | 'maximum') => {
    const body = typeof window !== 'undefined' && document.body;
    
    // Remove existing privacy classes
    body.classList.remove('privacy-minimal', 'privacy-standard', 'privacy-maximum');
    
    // Apply new privacy level
    body.classList.add(`privacy-${level}`);
    
    switch (level) {
      case 'minimal':
        // Basic privacy protections only
        break;
      case 'standard':
        // Standard privacy protections (default)
        break;
      case 'maximum':
        // Maximum privacy protections
        body.classList.add('no-analytics', 'no-tracking', 'ephemeral-mode');
        break;
    }
  };

  // GDPR Article 20 - Data Portability
  const exportUserData = async (): Promise<any> => {
    try {
      const userData = {
        preferences: {
          privacyLevel,
          colorPreferences: typeof window !== 'undefined' && localStorage.getItem('alchm_sage_enforced'),
          crisisMode: typeof window !== 'undefined' && localStorage.getItem('alchm_emergency_mode')
        },
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      return userData;
    } catch (error) {
      console.error('[Privacy Mobile] Export failed:', error);
      return {};
    }
  };

  // GDPR Article 17 - Right to Erasure
  const clearAllLocalData = () => {
    try {
      // Clear all ALCHM-related local storage
      const keysToRemove = [
        'alchm_sage_enforced',
        'alchm_sage_timestamp',
        'alchm_emergency_mode',
        'alchm_privacy_level'
      ];

      keysToRemove.forEach(key => {
        typeof window !== 'undefined' && localStorage.removeItem(key);
        typeof window !== 'undefined' && sessionStorage.removeItem(key);
      });

      // Clear all cache storage
      if ('caches' in typeof window !== 'undefined' && window) {
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        });
      }

      console.log('[Privacy Mobile] All local data cleared');
      
    } catch (error) {
      console.error('[Privacy Mobile] Data clearing failed:', error);
    }
  };

  // GDPR Article 7(3) - Withdrawal of consent
  const revokeConsent = () => {
    // Set maximum privacy level
    updatePrivacyLevel('maximum');
    
    // Clear non-essential data
    clearAllLocalData();
    
    // Redirect to consent withdrawal page
    typeof window !== 'undefined' && window.location.href = '/privacy/withdraw-consent';
  };

  const contextValue: PrivacyEnhancedMobileContext = {
    isOffline,
    isCrisisMode,
    deviceTier,
    privacyLevel,
    enableCrisisMode,
    disableCrisisMode,
    updatePrivacyLevel,
    clearAllLocalData,
    exportUserData,
    revokeConsent
  };

  return (
    <PrivacyEnhancedContext.Provider value={contextValue}>
      {children}
      
      {/* Crisis Mode Indicator */}
      {isCrisisMode && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
          <span className="font-semibold">Crisis Support Active - Your Privacy Protected</span>
          <button 
            onClick={disableCrisisMode}
            className="ml-4 px-3 py-1 bg-white text-red-600 rounded text-sm hover:bg-red-50"
          >
            Deactivate
          </button>
        </div>
      )}

      {/* Privacy Level Indicator (Maximum Privacy Only) */}
      {privacyLevel === 'maximum' && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg text-sm z-40">
          🔒 Maximum Privacy Mode
        </div>
      )}

      {/* Offline Privacy Notice */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm z-40">
          📡 Offline Mode - Data Stays Local
        </div>
      )}
    </PrivacyEnhancedContext.Provider>
  );
}