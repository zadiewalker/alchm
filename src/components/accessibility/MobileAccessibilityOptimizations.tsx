'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Mobile Accessibility Optimizations
 * 
 * Provides comprehensive mobile accessibility features for ALCHM with special focus on
 * crisis situations where users may have trembling hands, blurred vision, or cognitive stress.
 */

interface MobileAccessibilityOptimizationsProps {
  children: React.ReactNode;
}

export function MobileAccessibilityOptimizations({ 
  children 
}: MobileAccessibilityOptimizationsProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const [deviceInfo, setDeviceInfo] = useState({
    isTouch: false,
    isIOS: false,
    isAndroid: false,
    screenSize: 'unknown',
    orientation: 'portrait',
    hasMotionSensors: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Detect device capabilities
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      const hasMotionSensors = 'DeviceOrientationEvent' in window && 'DeviceMotionEvent' in window;

      // Screen size detection
      const screenWidth = window.innerWidth;
      let screenSize = 'small';
      if (screenWidth >= 768) screenSize = 'tablet';
      if (screenWidth >= 1024) screenSize = 'desktop';

      // Orientation
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

      setDeviceInfo({
        isTouch,
        isIOS,
        isAndroid,
        screenSize,
        orientation,
        hasMotionSensors,
      });
    };

    detectDevice();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100); // Small delay for accurate measurements
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Apply mobile-specific accessibility classes
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const classes = [
      'mobile-accessibility-optimized',
      deviceInfo.isTouch && 'touch-device',
      deviceInfo.isIOS && 'ios-device',
      deviceInfo.isAndroid && 'android-device',
      `screen-${deviceInfo.screenSize}`,
      `orientation-${deviceInfo.orientation}`,
      settings.crisisMode && 'mobile-crisis-mode',
      settings.emergencyMode && 'mobile-emergency-mode',
    ].filter(Boolean);

    classes.forEach(className => {
      if (className) container.classList.add(className);
    });

    return () => {
      classes.forEach(className => {
        if (className) container.classList.remove(className);
      });
    };
  }, [deviceInfo, settings.crisisMode, settings.emergencyMode]);

  return (
    <div ref={containerRef} className="mobile-accessibility-container">
      {/* Mobile-specific skip links */}
      <MobileSkipLinks />
      
      {/* Touch optimization overlay */}
      <TouchOptimizationOverlay deviceInfo={deviceInfo} />
      
      {/* Crisis mode mobile enhancements */}
      {(settings.crisisMode || settings.emergencyMode) && (
        <CrisisMobileEnhancements deviceInfo={deviceInfo} />
      )}
      
      {/* Main content */}
      {children}
      
      {/* Mobile accessibility toolbar */}
      <MobileAccessibilityToolbar deviceInfo={deviceInfo} />
    </div>
  );
}

/**
 * Mobile Skip Links Component
 */
function MobileSkipLinks() {
  const { settings } = useAccessibility();

  return (
    <div className="mobile-skip-links sr-only-focusable">
      <div className="skip-links-container bg-white border-2 border-blue-600 rounded-lg p-3 m-2">
        <h2 className="text-lg font-bold mb-2">Quick Navigation</h2>
        <ul className="space-y-2">
          <li>
            <a 
              href="#main-content" 
              className="skip-link touch-target-comfortable block text-blue-600 font-medium"
            >
              Skip to main content
            </a>
          </li>
          {settings.crisisMode && (
            <li>
              <a 
                href="#crisis-resources" 
                className="skip-link touch-target-comfortable block text-red-600 font-bold"
              >
                🆘 Emergency Crisis Resources
              </a>
            </li>
          )}
          <li>
            <a 
              href="#mobile-accessibility-toolbar" 
              className="skip-link touch-target-comfortable block text-blue-600 font-medium"
            >
              Accessibility Settings
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Touch Optimization Overlay
 */
interface TouchOptimizationOverlayProps {
  deviceInfo: {
    isTouch: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    screenSize: string;
    orientation: string;
  };
}

function TouchOptimizationOverlay({ deviceInfo }: TouchOptimizationOverlayProps) {
  const { settings } = useAccessibility();
  const [touchTargets, setTouchTargets] = useState<Element[]>([]);

  useEffect(() => {
    if (!deviceInfo.isTouch) return;

    // Find all interactive elements that might need touch optimization
    const selectors = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[tabindex="0"]',
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    const targets: Element[] = [];

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      // Check if element is too small for comfortable touch
      const minSize = settings.crisisMode ? 56 : 44;
      if (rect.width < minSize || rect.height < minSize) {
        targets.push(element);
        
        // Add touch optimization class
        element.classList.add('needs-touch-optimization');
        
        // Apply minimum touch target size
        if (element instanceof HTMLElement) {
          element.style.minWidth = `${minSize}px`;
          element.style.minHeight = `${minSize}px`;
          element.style.padding = element.style.padding || '8px';
        }
      }
    });

    setTouchTargets(targets);

    // Cleanup function
    return () => {
      targets.forEach(element => {
        element.classList.remove('needs-touch-optimization');
      });
    };
  }, [deviceInfo.isTouch, settings.crisisMode]);

  // Don't render anything visible - this component works through DOM manipulation
  return null;
}

/**
 * Crisis Mobile Enhancements
 */
function CrisisMobileEnhancements({ deviceInfo }: TouchOptimizationOverlayProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const [shakingDetected, setShakingDetected] = useState(false);
  const [panModeActive, setPanModeActive] = useState(false);

  // Shake detection for crisis situations
  useEffect(() => {
    if (!deviceInfo.hasMotionSensors || !settings.crisisMode) return;

    let shakeThreshold = 15;
    let lastUpdate = 0;
    let x = 0, y = 0, z = 0;
    let lastX = 0, lastY = 0, lastZ = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const curTime = Date.now();
      if (curTime - lastUpdate > 100) {
        const diffTime = curTime - lastUpdate;
        lastUpdate = curTime;

        x = acceleration.x || 0;
        y = acceleration.y || 0;
        z = acceleration.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > shakeThreshold && !shakingDetected) {
          setShakingDetected(true);
          announceToScreenReader(
            'Device shaking detected. Activating emergency assistance mode.',
            'assertive'
          );
          
          // Show emergency options after shake
          setTimeout(() => {
            const emergencyButton = document.querySelector('[data-emergency-contact]');
            if (emergencyButton && emergencyButton instanceof HTMLElement) {
              emergencyButton.focus();
              emergencyButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);

          // Reset shake detection after delay
          setTimeout(() => setShakingDetected(false), 5000);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [deviceInfo.hasMotionSensors, settings.crisisMode, shakingDetected, announceToScreenReader]);

  // Pan mode for users with motor difficulties
  const enablePanMode = () => {
    setPanModeActive(true);
    announceToScreenReader(
      'Pan mode enabled. Touch anywhere and drag to scroll the page.',
      'polite'
    );

    // Add pan mode styles
    document.body.style.touchAction = 'pan-y';
    document.body.style.overscrollBehavior = 'contain';
  };

  const disablePanMode = () => {
    setPanModeActive(false);
    announceToScreenReader('Pan mode disabled.', 'polite');

    // Remove pan mode styles
    document.body.style.touchAction = '';
    document.body.style.overscrollBehavior = '';
  };

  if (!settings.crisisMode && !settings.emergencyMode) return null;

  return (
    <div className="crisis-mobile-enhancements">
      {/* Shake detection indicator */}
      {shakingDetected && (
        <div
          className="shake-detection-alert fixed top-4 left-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg border-2 border-red-800"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <p className="font-bold">Emergency Assistance Detected</p>
              <p className="text-sm">Shake detected - emergency options available below</p>
            </div>
          </div>
        </div>
      )}

      {/* Pan mode toggle for motor difficulties */}
      <div className="pan-mode-controls fixed bottom-20 left-4 z-40">
        {!panModeActive ? (
          <button
            type="button"
            onClick={enablePanMode}
            className="touch-target-crisis bg-blue-600 text-white rounded-full p-3 shadow-lg"
            aria-label="Enable pan mode for easier navigation with motor difficulties"
          >
            <span aria-hidden="true">🤚</span>
            <span className="sr-only">Pan Mode</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={disablePanMode}
            className="touch-target-crisis bg-green-600 text-white rounded-full p-3 shadow-lg"
            aria-label="Disable pan mode"
          >
            <span aria-hidden="true">✋</span>
            <span className="sr-only">Exit Pan Mode</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Mobile Accessibility Toolbar
 */
function MobileAccessibilityToolbar({ deviceInfo }: TouchOptimizationOverlayProps) {
  const { settings, updateSettings } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      id="mobile-accessibility-toolbar"
      className="mobile-accessibility-toolbar fixed bottom-4 left-4 right-4 z-40"
    >
      {/* Collapsed toolbar */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={toggleExpanded}
          className="w-full touch-target-comfortable bg-blue-600 text-white rounded-lg font-semibold focus-ring"
          aria-expanded={false}
          aria-controls="accessibility-options"
        >
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true">♿</span>
            <span>Accessibility Options</span>
            <span aria-hidden="true">▲</span>
          </span>
        </button>
      ) : (
        /* Expanded toolbar */
        <div 
          id="accessibility-options"
          className="bg-white border-2 border-blue-600 rounded-lg shadow-lg p-4"
          role="region"
          aria-label="Mobile accessibility options"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Accessibility</h2>
            <button
              type="button"
              onClick={toggleExpanded}
              className="touch-target bg-gray-200 rounded-full p-2"
              aria-expanded={true}
              aria-controls="accessibility-options"
            >
              <span aria-hidden="true">▼</span>
              <span className="sr-only">Collapse accessibility options</span>
            </button>
          </div>

          {/* Quick settings grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Font size */}
            <button
              type="button"
              onClick={() => {
                const sizes = ['default', 'comfortable', 'large', 'crisis'];
                const currentIndex = sizes.indexOf(settings.fontSize);
                const nextIndex = (currentIndex + 1) % sizes.length;
                updateSettings({ fontSize: sizes[nextIndex] as any });
              }}
              className={`
                touch-target-comfortable p-3 rounded-lg border-2 font-medium
                ${settings.fontSize !== 'default' 
                  ? 'bg-blue-100 border-blue-600 text-blue-900' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
                }
              `}
            >
              <span className="block text-lg mb-1" aria-hidden="true">Aa</span>
              <span className="text-sm">Text Size</span>
            </button>

            {/* Touch targets */}
            <button
              type="button"
              onClick={() => {
                const sizes = ['default', 'comfortable', 'crisis', 'emergency'];
                const currentIndex = sizes.indexOf(settings.touchTargetSize);
                const nextIndex = (currentIndex + 1) % sizes.length;
                updateSettings({ touchTargetSize: sizes[nextIndex] as any });
              }}
              className={`
                touch-target-comfortable p-3 rounded-lg border-2 font-medium
                ${settings.touchTargetSize !== 'default' 
                  ? 'bg-green-100 border-green-600 text-green-900' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
                }
              `}
            >
              <span className="block text-lg mb-1" aria-hidden="true">👆</span>
              <span className="text-sm">Touch Size</span>
            </button>

            {/* High contrast */}
            <button
              type="button"
              onClick={() => {
                const newContrast = settings.contrast === 'high' ? 'default' : 'high';
                updateSettings({ contrast: newContrast });
              }}
              className={`
                touch-target-comfortable p-3 rounded-lg border-2 font-medium
                ${settings.contrast === 'high' 
                  ? 'bg-yellow-100 border-yellow-600 text-yellow-900' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
                }
              `}
            >
              <span className="block text-lg mb-1" aria-hidden="true">🔆</span>
              <span className="text-sm">Contrast</span>
            </button>

            {/* Reduce motion */}
            <button
              type="button"
              onClick={() => {
                updateSettings({ disableAnimations: !settings.disableAnimations });
              }}
              className={`
                touch-target-comfortable p-3 rounded-lg border-2 font-medium
                ${settings.disableAnimations 
                  ? 'bg-purple-100 border-purple-600 text-purple-900' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
                }
              `}
            >
              <span className="block text-lg mb-1" aria-hidden="true">🎭</span>
              <span className="text-sm">No Motion</span>
            </button>
          </div>

          {/* Crisis mode toggle */}
          <div className="border-t pt-3">
            {!settings.crisisMode ? (
              <button
                type="button"
                onClick={() => updateSettings({ crisisMode: true })}
                className="w-full touch-target-crisis bg-red-600 text-white rounded-lg font-bold"
              >
                <span className="flex items-center justify-center gap-2">
                  <span aria-hidden="true">🆘</span>
                  <span>Enable Crisis Mode</span>
                </span>
              </button>
            ) : (
              <div className="bg-red-100 border-2 border-red-600 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-red-900">Crisis Mode Active</span>
                  <span aria-hidden="true">🆘</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ crisisMode: false, emergencyMode: false })}
                  className="w-full touch-target bg-white text-red-700 border border-red-600 rounded font-medium"
                >
                  Disable Crisis Mode
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileAccessibilityOptimizations;