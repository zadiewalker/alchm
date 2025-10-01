/**
 * Mobile Trauma Optimization Provider for ALCHM
 * Comprehensive mobile optimization system for users in crisis
 */

'use client';

import React, { useState, useEffect } from 'react';
import TraumaOptimizedInterface from './trauma-optimized-interface';
import PanicSafeNavigation from './panic-safe-navigation';
import OneHandedOperation from './one-handed-operation';
import CrisisAccessibility from './crisis-accessibility';
import EmergencyMode from './emergency-mode';
import { useBatteryConservation } from './battery-conservation';
import { useNetworkResilience } from './network-resilient-design';

interface MobileTraumaProviderProps {
  children: React.ReactNode;
  enableEmergencyMode?: boolean;
  crisisLevel?: 'stable' | 'elevated' | 'crisis';
  showNavigation?: boolean;
}

interface SystemCapabilities {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  supportsVibration: boolean;
  supportsSpeech: boolean;
  supportsBackgroundSync: boolean;
  screenSize: 'small' | 'medium' | 'large';
  supportsTouchGestures: boolean;
}

export function MobileTraumaProvider({
  children,
  enableEmergencyMode = true,
  crisisLevel = 'stable',
  showNavigation = true
}: MobileTraumaProviderProps) {
  const [systemCapabilities, setSystemCapabilities] = useState<SystemCapabilities>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    supportsVibration: false,
    supportsSpeech: false,
    supportsBackgroundSync: false,
    screenSize: 'medium',
    supportsTouchGestures: false
  });

  const [emergencyModeActive, setEmergencyModeActive] = useState(false);
  const [handedness, setHandedness] = useState<'left' | 'right'>('right');
  const [accessibilityEnhanced, setAccessibilityEnhanced] = useState(false);

  // Get battery and network status
  const { 
    batteryStatus, 
    conservationActive, 
    criticalMode 
  } = useBatteryConservation();

  const { 
    isOffline, 
    isSlowConnection, 
    connectionQuality 
  } = useNetworkResilience();

  // Detect system capabilities
  useEffect(() => {
    const detectCapabilities = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      // Screen size detection
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const maxDimension = Math.max(screenWidth, screenHeight);
      
      let screenSize: 'small' | 'medium' | 'large' = 'medium';
      if (maxDimension <= 667) screenSize = 'small';
      else if (maxDimension >= 900) screenSize = 'large';

      const capabilities: SystemCapabilities = {
        isMobile,
        isIOS,
        isAndroid,
        supportsVibration: 'vibrate' in navigator,
        supportsSpeech: 'speechSynthesis' in window,
        supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        screenSize,
        supportsTouchGestures: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      };

      setSystemCapabilities(capabilities);

      // Auto-enable accessibility features on mobile for crisis levels
      if (isMobile && (crisisLevel === 'elevated' || crisisLevel === 'crisis')) {
        setAccessibilityEnhanced(true);
      }
    };

    detectCapabilities();
    window.addEventListener('resize', detectCapabilities);
    
    return () => window.removeEventListener('resize', detectCapabilities);
  }, [crisisLevel]);

  // Auto-activate emergency mode in critical situations
  useEffect(() => {
    if (criticalMode || (crisisLevel === 'crisis' && !emergencyModeActive)) {
      setEmergencyModeActive(true);
    }
  }, [criticalMode, crisisLevel, emergencyModeActive]);

  // Enhanced crisis level based on system state
  const getEffectiveCrisisLevel = (): 'stable' | 'elevated' | 'crisis' => {
    if (emergencyModeActive || criticalMode) return 'crisis';
    if (conservationActive || isOffline || crisisLevel === 'elevated') return 'elevated';
    return crisisLevel;
  };

  const effectiveCrisisLevel = getEffectiveCrisisLevel();

  // Mobile-specific optimizations
  useEffect(() => {
    if (!systemCapabilities.isMobile) return;

    // Prevent zoom on input focus (iOS)
    if (systemCapabilities.isIOS) {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    }

    // Android-specific optimizations
    if (systemCapabilities.isAndroid) {
      // Prevent text selection on long press
      document.body.style.webkitUserSelect = 'none';
      document.body.style.webkitTouchCallout = 'none';
    }

    // Add mobile-specific classes
    document.body.classList.add('mobile-optimized');
    if (systemCapabilities.isIOS) document.body.classList.add('ios-device');
    if (systemCapabilities.isAndroid) document.body.classList.add('android-device');
    document.body.classList.add(`screen-${systemCapabilities.screenSize}`);

    return () => {
      document.body.classList.remove(
        'mobile-optimized', 
        'ios-device', 
        'android-device',
        `screen-${systemCapabilities.screenSize}`
      );
    };
  }, [systemCapabilities]);

  // Handle emergency mode changes
  const handleEmergencyModeChange = (active: boolean) => {
    setEmergencyModeActive(active);
    
    // Provide system feedback
    if (active && systemCapabilities.supportsVibration) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  // Handle handedness changes
  const handleHandednessChange = (newHandedness: 'left' | 'right') => {
    setHandedness(newHandedness);
    
    // Store preference
    try {
      localStorage.setItem('alchm_handedness', newHandedness);
    } catch (error) {
      console.warn('Could not save handedness preference:', error);
    }
  };

  // Load saved handedness preference
  useEffect(() => {
    try {
      const savedHandedness = localStorage.getItem('alchm_handedness');
      if (savedHandedness === 'left' || savedHandedness === 'right') {
        setHandedness(savedHandedness);
      }
    } catch (error) {
      console.warn('Could not load handedness preference:', error);
    }
  }, []);

  // Don't render mobile optimizations on desktop unless specifically requested
  if (!systemCapabilities.isMobile && !enableEmergencyMode) {
    return (
      <div className="desktop-container">
        {children}
        {/* Still provide emergency mode for desktop crisis situations */}
        <EmergencyMode onModeChange={handleEmergencyModeChange}>
          <div style={{ display: 'none' }} />
        </EmergencyMode>
      </div>
    );
  }

  return (
    <div className="mobile-trauma-provider">
      {/* Emergency mode wrapper - highest priority */}
      <EmergencyMode 
        onModeChange={handleEmergencyModeChange}
        autoActivationThreshold={30000}
      >
        {/* Crisis accessibility features */}
        <CrisisAccessibility
          crisisLevel={effectiveCrisisLevel}
          enableEnhancedMode={accessibilityEnhanced}
        >
          {/* One-handed operation optimization */}
          <OneHandedOperation
            enabled={systemCapabilities.isMobile}
            handedness={handedness === 'left' ? 'left' : 'right'}
            onHandednessChange={handleHandednessChange}
          >
            {/* Main trauma-optimized interface */}
            <TraumaOptimizedInterface
              emergencyMode={emergencyModeActive}
              crisisLevel={effectiveCrisisLevel}
              onEmergencyModeToggle={handleEmergencyModeChange}
            >
              {/* Main application content */}
              {children}
              
              {/* Panic-safe navigation - only show if enabled and not in emergency mode */}
              {showNavigation && !emergencyModeActive && (
                <PanicSafeNavigation
                  emergencyMode={false}
                  crisisLevel={effectiveCrisisLevel}
                  onNavigationStart={() => {
                    // Optional loading state handling
                  }}
                  onNavigationComplete={() => {
                    // Optional completion handling
                  }}
                />
              )}
            </TraumaOptimizedInterface>
          </OneHandedOperation>
        </CrisisAccessibility>
      </EmergencyMode>

      {/* Status indicators for debugging/monitoring */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mobile-debug-info">
          <details className="debug-panel">
            <summary>Mobile Debug Info</summary>
            <div className="debug-content">
              <p>Crisis Level: {effectiveCrisisLevel}</p>
              <p>Battery: {batteryStatus ? `${Math.round(batteryStatus.level * 100)}%` : 'Unknown'}</p>
              <p>Connection: {connectionQuality.level}</p>
              <p>Screen: {systemCapabilities.screenSize}</p>
              <p>Handedness: {handedness}</p>
              <p>Emergency: {emergencyModeActive ? 'Active' : 'Inactive'}</p>
              <p>Platform: {systemCapabilities.isIOS ? 'iOS' : systemCapabilities.isAndroid ? 'Android' : 'Other'}</p>
            </div>
          </details>
        </div>
      )}

      <style jsx>{`
        .mobile-trauma-provider {
          position: relative;
          min-height: 100vh;
        }

        .desktop-container {
          position: relative;
        }

        .mobile-debug-info {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 9999;
          font-size: 12px;
          opacity: 0.7;
        }

        .debug-panel {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px;
          border-radius: 4px;
        }

        .debug-content {
          margin-top: 8px;
          font-size: 10px;
        }

        .debug-content p {
          margin: 2px 0;
        }

        /* Global mobile optimizations */
        :global(.mobile-optimized) {
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          -webkit-overflow-scrolling: touch;
        }

        :global(.mobile-optimized *) {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        :global(.mobile-optimized button),
        :global(.mobile-optimized a),
        :global(.mobile-optimized input),
        :global(.mobile-optimized select),
        :global(.mobile-optimized textarea) {
          min-width: 44px;
          min-height: 44px;
          border-radius: 8px;
        }

        /* iOS-specific optimizations */
        :global(.ios-device) {
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }

        :global(.ios-device input),
        :global(.ios-device textarea) {
          -webkit-appearance: none;
          border-radius: 0;
          font-size: 16px; /* Prevents zoom */
        }

        /* Android-specific optimizations */
        :global(.android-device) {
          -webkit-user-select: none;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
        }

        /* Screen size optimizations */
        :global(.screen-small) {
          font-size: 16px;
        }

        :global(.screen-medium) {
          font-size: 17px;
        }

        :global(.screen-large) {
          font-size: 18px;
        }

        :global(.screen-small button),
        :global(.screen-small a) {
          min-height: 48px;
          font-size: 16px;
        }

        :global(.screen-medium button),
        :global(.screen-medium a) {
          min-height: 52px;
          font-size: 17px;
        }

        :global(.screen-large button),
        :global(.screen-large a) {
          min-height: 56px;
          font-size: 18px;
        }

        /* Crisis mode overrides */
        :global(.crisis-level-crisis) {
          --touch-target-size: 64px;
          --font-size-min: 18px;
        }

        :global(.crisis-level-elevated) {
          --touch-target-size: 56px;
          --font-size-min: 17px;
        }

        :global(.crisis-level-stable) {
          --touch-target-size: 44px;
          --font-size-min: 16px;
        }
      `}</style>
    </div>
  );
}

// Export individual components for selective use
export {
  TraumaOptimizedInterface,
  PanicSafeNavigation,
  OneHandedOperation,
  CrisisAccessibility,
  EmergencyMode
};

export default MobileTraumaProvider;