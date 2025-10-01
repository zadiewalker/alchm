'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface TraumaOptimizedInterfaceProps {
  children: React.ReactNode;
  emergencyMode?: boolean;
  onEmergencyModeToggle?: (enabled: boolean) => void;
  crisisLevel?: 'stable' | 'elevated' | 'crisis';
}

interface TouchTarget {
  element: HTMLElement;
  originalSize: { width: number; height: number };
}

export function TraumaOptimizedInterface({
  children,
  emergencyMode = false,
  onEmergencyModeToggle,
  crisisLevel = 'stable'
}: TraumaOptimizedInterfaceProps) {
  const router = useRouter();
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isOldDevice: false,
    hasReducedMotion: false,
    isHighContrast: false,
    batteryLevel: 1
  });

  // Monitor device capabilities and constraints
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Check for reduced motion preference
      const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for high contrast mode
      const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches ||
                            window.matchMedia('(prefers-contrast: more)').matches;
      
      // Detect older devices by memory and performance
      const isOldDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
                         (navigator.deviceMemory && navigator.deviceMemory <= 2);

      setDeviceCapabilities({
        isOldDevice: isOldDevice || false,
        hasReducedMotion,
        isHighContrast,
        batteryLevel: 1 // Will be updated by battery API if available
      });
    };

    // Battery API monitoring
    const monitorBattery = async () => {
      try {
        // @ts-ignore - Battery API
        const battery = await navigator.getBattery?.();
        if (battery) {
          const updateBatteryStatus = () => {
            setIsLowBattery(battery.level <= 0.2);
            setDeviceCapabilities(prev => ({
              ...prev,
              batteryLevel: battery.level
            }));
          };
          
          updateBatteryStatus();
          battery.addEventListener('levelchange', updateBatteryStatus);
          battery.addEventListener('chargingchange', updateBatteryStatus);
        }
      } catch (error) {
        // Battery API not available
      }
    };

    // Network quality monitoring
    const monitorConnection = () => {
      const updateConnectionQuality = () => {
        if (!navigator.onLine) {
          setConnectionQuality('offline');
          return;
        }

        // @ts-ignore - Connection API
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === '4g' || effectiveType === '3g') {
            setConnectionQuality('good');
          } else {
            setConnectionQuality('poor');
          }
        }
      };

      updateConnectionQuality();
      window.addEventListener('online', updateConnectionQuality);
      window.addEventListener('offline', updateConnectionQuality);
    };

    checkDeviceCapabilities();
    monitorBattery();
    monitorConnection();

    // Listen for media query changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    motionQuery.addListener(checkDeviceCapabilities);
    contrastQuery.addListener(checkDeviceCapabilities);

    return () => {
      motionQuery.removeListener(checkDeviceCapabilities);
      contrastQuery.removeListener(checkDeviceCapabilities);
    };
  }, []);

  // Optimize touch targets for crisis situations
  useEffect(() => {
    const optimizeTouchTargets = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex="0"]'
      );

      interactiveElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();
        
        // Ensure minimum 52px touch target for trembling hands
        if (rect.width < 52 || rect.height < 52) {
          htmlElement.style.minWidth = '52px';
          htmlElement.style.minHeight = '52px';
          htmlElement.style.padding = Math.max(
            parseInt(getComputedStyle(htmlElement).padding) || 0,
            12
          ) + 'px';
        }

        // Add larger click area for crisis mode
        if (emergencyMode || crisisLevel === 'crisis') {
          htmlElement.style.minWidth = '64px';
          htmlElement.style.minHeight = '64px';
          htmlElement.style.padding = '16px';
        }
      });
    };

    // Run optimization on component mount and when emergency mode changes
    optimizeTouchTargets();
    
    // Re-run when DOM changes (for dynamic content)
    const observer = new MutationObserver(optimizeTouchTargets);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });

    return () => observer.disconnect();
  }, [emergencyMode, crisisLevel]);

  // Crisis-safe error recovery
  const handleCriticalError = useCallback((error: Error) => {
    console.error('Crisis interface error:', error);
    
    // Attempt to navigate to safe space
    try {
      router.push('/crisis-resources');
    } catch (navigationError) {
      // If navigation fails, show emergency contact info
      const emergencyDiv = document.createElement('div');
      emergencyDiv.innerHTML = `
        <div style="
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100vw; 
          height: 100vh; 
          background: #000; 
          color: #fff; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          align-items: center; 
          z-index: 9999;
          font-size: 24px;
          text-align: center;
          padding: 20px;
        ">
          <h1 style="font-size: 32px; margin-bottom: 20px;">You are safe</h1>
          <p style="margin-bottom: 30px;">If you're in crisis, please reach out:</p>
          <p style="margin-bottom: 15px;">Crisis Text Line: Text HOME to 741741</p>
          <p style="margin-bottom: 15px;">National Suicide Prevention Lifeline: 988</p>
          <button onclick="location.reload()" style="
            background: #fff; 
            color: #000; 
            border: none; 
            padding: 15px 30px; 
            font-size: 20px; 
            border-radius: 8px; 
            margin-top: 20px;
            min-width: 200px;
            min-height: 52px;
          ">
            Try Again
          </button>
        </div>
      `;
      document.body.appendChild(emergencyDiv);
    }
  }, [router]);

  // Performance optimizations based on device capabilities
  const getOptimizedClassName = () => {
    const classes = ['trauma-optimized-interface'];
    
    if (deviceCapabilities.hasReducedMotion) {
      classes.push('reduced-motion');
    }
    
    if (deviceCapabilities.isHighContrast) {
      classes.push('high-contrast');
    }
    
    if (deviceCapabilities.isOldDevice) {
      classes.push('old-device');
    }
    
    if (isLowBattery) {
      classes.push('low-battery');
    }
    
    if (connectionQuality === 'poor' || connectionQuality === 'offline') {
      classes.push('poor-connection');
    }
    
    if (emergencyMode) {
      classes.push('emergency-mode');
    }
    
    classes.push(`crisis-level-${crisisLevel}`);
    
    return classes.join(' ');
  };

  return (
    <div className={getOptimizedClassName()}>
      {/* Crisis status indicator */}
      {(crisisLevel !== 'stable' || emergencyMode) && (
        <div className="crisis-status-bar">
          <div className="crisis-indicator">
            <span className="crisis-dot" />
            {emergencyMode ? 'Emergency Mode Active' : 'Crisis Support Available'}
          </div>
        </div>
      )}

      {/* Connection and battery warnings */}
      {(connectionQuality === 'offline' || isLowBattery) && (
        <div className="device-status-warnings">
          {connectionQuality === 'offline' && (
            <div className="offline-warning">
              <span>Offline - Crisis resources cached locally</span>
            </div>
          )}
          {isLowBattery && (
            <div className="battery-warning">
              <span>Low battery - Power saving mode active</span>
            </div>
          )}
        </div>
      )}

      {/* Main interface with trauma-informed optimizations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`interface-${emergencyMode ? 'emergency' : 'normal'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: deviceCapabilities.hasReducedMotion ? 0 : 0.2,
            ease: 'easeOut'
          }}
          className="interface-content"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Emergency floating button - always accessible */}
      <button
        className="emergency-floating-button"
        onClick={() => {
          if (onEmergencyModeToggle) {
            onEmergencyModeToggle(!emergencyMode);
          }
        }}
        aria-label="Toggle emergency mode"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: crisisLevel === 'crisis' ? '#ff4444' : '#ff6b6b',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          zIndex: 1000,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: deviceCapabilities.hasReducedMotion ? 'none' : 'all 0.2s ease'
        }}
      >
        🆘
      </button>

      {/* Styles for trauma-optimized interface */}
      <style jsx>{`
        .trauma-optimized-interface {
          min-height: 100vh;
          font-size: 18px;
          line-height: 1.6;
          transition: none;
        }

        .crisis-status-bar {
          position: sticky;
          top: 0;
          background: #ff6b6b;
          color: white;
          padding: 12px 20px;
          text-align: center;
          font-weight: 600;
          z-index: 100;
        }

        .crisis-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .crisis-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .device-status-warnings {
          background: #ffa500;
          color: white;
          font-size: 16px;
          text-align: center;
        }

        .offline-warning,
        .battery-warning {
          padding: 8px 16px;
          font-weight: 500;
        }

        .interface-content {
          min-height: calc(100vh - 60px);
          padding: 20px;
        }

        /* High contrast mode */
        .high-contrast {
          filter: contrast(1.5);
        }

        .high-contrast .crisis-status-bar {
          background: #000;
          border: 2px solid #fff;
        }

        /* Old device optimizations */
        .old-device * {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .old-device img {
          image-rendering: optimizeSpeed;
        }

        /* Low battery mode */
        .low-battery * {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }

        .low-battery .crisis-dot {
          animation: none;
        }

        /* Poor connection optimizations */
        .poor-connection img {
          display: none;
        }

        .poor-connection video {
          display: none;
        }

        /* Emergency mode styles */
        .emergency-mode {
          background: #1a1a1a;
          color: #ffffff;
        }

        .emergency-mode .interface-content {
          max-width: 600px;
          margin: 0 auto;
          font-size: 20px;
        }

        .emergency-mode button,
        .emergency-mode a {
          min-height: 64px !important;
          font-size: 18px !important;
          padding: 16px !important;
          margin: 8px 0 !important;
        }

        /* Crisis level styles */
        .crisis-level-elevated {
          --primary-color: #ff8c00;
        }

        .crisis-level-crisis {
          --primary-color: #ff4444;
          --bg-color: #2a0000;
        }

        /* Reduced motion */
        .reduced-motion * {
          animation: none !important;
          transition: none !important;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Touch target optimizations */
        .trauma-optimized-interface button,
        .trauma-optimized-interface a,
        .trauma-optimized-interface input,
        .trauma-optimized-interface select {
          min-width: 52px;
          min-height: 52px;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
        }

        .emergency-mode button,
        .emergency-mode a,
        .emergency-mode input {
          min-width: 64px !important;
          min-height: 64px !important;
          padding: 16px !important;
          font-size: 18px !important;
        }

        /* Accessibility improvements */
        .trauma-optimized-interface :focus {
          outline: 3px solid #4A90E2;
          outline-offset: 2px;
        }

        .high-contrast :focus {
          outline: 3px solid #fff;
        }

        /* Safe spacing for one-handed use */
        .trauma-optimized-interface {
          padding-bottom: 100px; /* Extra space for floating button */
        }
      `}</style>
    </div>
  );
}

export default TraumaOptimizedInterface;