/**
 * Crisis-Safe Mobile Provider
 * 
 * MOBILE GUARDIAN: Ensures crisis safety features work seamlessly on mobile devices
 * 
 * This provider handles mobile-specific crisis safety optimizations including
 * offline functionality, accessibility enhancements, emergency shortcuts,
 * and trauma-informed touch interactions for users in crisis states.
 */

'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { crisisSafetyCoordinator } from '@/lib/crisis-safety-coordinator';
import { analytics } from '@/lib/analytics';
import { logger } from '@/lib/logging';

interface CrisisSafeMobileContextType {
  // Crisis safety state
  emergencyMode: boolean;
  panicMode: boolean;
  crisisResourcesAvailable: boolean;
  
  // Mobile-specific features
  hapticFeedback: (pattern?: 'light' | 'medium' | 'heavy') => void;
  emergencyVibrationAlert: () => void;
  quickCrisisAccess: () => void;
  
  // Accessibility enhancements
  highContrastMode: boolean;
  largeTextMode: boolean;
  reducedMotion: boolean;
  tremorCompensation: boolean;
  
  // Touch safety
  preventAccidentalTaps: boolean;
  gentleTouchResponse: boolean;
  lastTouchTime: number;
  
  // Offline support
  offlineResourcesLoaded: boolean;
  criticalResourcesCached: boolean;
  
  // Device capabilities
  deviceOrientation: 'portrait' | 'landscape';
  batteryLevel: number;
  networkStatus: 'online' | 'offline' | 'slow';
  
  // Crisis-specific functions
  activateEmergencyMode: () => void;
  activatePanicMode: () => void;
  deactivateEmergencyMode: () => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  tremorCompensation: boolean;
  voiceAssistance: boolean;
}

const CrisisSafeMobileContext = createContext<CrisisSafeMobileContextType | undefined>(undefined);

interface CrisisSafeMobileProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function CrisisSafeMobileProvider({ children, userId }: CrisisSafeMobileProviderProps) {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [crisisResourcesAvailable, setCrisisResourcesAvailable] = useState(false);
  
  // Accessibility states
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tremorCompensation, setTremorCompensation] = useState(false);
  
  // Touch safety states
  const [preventAccidentalTaps, setPreventAccidentalTaps] = useState(false);
  const [gentleTouchResponse, setGentleTouchResponse] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  
  // Device states
  const [offlineResourcesLoaded, setOfflineResourcesLoaded] = useState(false);
  const [criticalResourcesCached, setCriticalResourcesCached] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  
  const vibrationPatterns = useRef({
    emergency: [200, 100, 200, 100, 200],
    panic: [500, 200, 500],
    gentle: [50],
    confirmation: [30, 50, 30]
  });

  // Initialize mobile capabilities and crisis resources
  useEffect(() => {
    const initializeMobileCrisisSafety = async () => {
      try {
        // Check device capabilities
        await checkDeviceCapabilities();
        
        // Load offline crisis resources
        await loadOfflineCrisisResources();
        
        // Setup emergency gesture listeners
        setupEmergencyGestures();
        
        // Initialize accessibility preferences
        loadAccessibilityPreferences();
        
        // Setup device monitoring
        setupDeviceMonitoring();
        
        logger.info('Mobile crisis safety initialized');
      } catch (error) {
        logger.error('Failed to initialize mobile crisis safety', error);
      }
    };

    initializeMobileCrisisSafety();
  }, []);

  // Check device capabilities for crisis support
  const checkDeviceCapabilities = async () => {
    try {
      // Check vibration support
      const hasVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;
      
      // Check battery API
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.floor(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.floor(battery.level * 100));
        });
      }
      
      // Check network status
      if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
        setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        
        window.addEventListener('online', () => setNetworkStatus('online'));
        window.addEventListener('offline', () => setNetworkStatus('offline'));
      }
      
      // Check orientation
      if (typeof window !== 'undefined') {
        const updateOrientation = () => {
          setDeviceOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };
        
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        window.addEventListener('orientationchange', updateOrientation);
      }
      
    } catch (error) {
      logger.error('Failed to check device capabilities', error);
    }
  };

  // Load offline crisis resources for emergency access
  const loadOfflineCrisisResources = async () => {
    try {
      // Cache critical crisis resources
      const criticalResources = [
        { number: '988', name: 'Suicide & Crisis Lifeline' },
        { number: '741741', name: 'Crisis Text Line', prefix: 'HOME' },
        { number: '911', name: 'Emergency Services' }
      ];
      
      // Store in localStorage for offline access
      localStorage.setItem('alchm_crisis_resources_cached', JSON.stringify({
        resources: criticalResources,
        cachedAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      }));
      
      setCriticalResourcesCached(true);
      setCrisisResourcesAvailable(true);
      setOfflineResourcesLoaded(true);
      
    } catch (error) {
      logger.error('Failed to load offline crisis resources', error);
      // Ensure basic resources are still available
      setCrisisResourcesAvailable(true);
    }
  };

  // Setup emergency gesture recognition
  const setupEmergencyGestures = () => {
    if (typeof window === 'undefined') return;

    let tapCount = 0;
    let tapTimer: NodeJS.Timeout;
    
    // Triple-tap emergency activation
    const handleTripleTap = () => {
      tapCount++;
      
      if (tapCount === 1) {
        tapTimer = setTimeout(() => {
          tapCount = 0;
        }, 1000); // Reset after 1 second
      } else if (tapCount === 3) {
        clearTimeout(tapTimer);
        tapCount = 0;
        
        // Activate emergency mode
        activateEmergencyMode();
        analytics.track('crisis', 'emergency_gesture_activated', 'triple_tap');
      }
    };

    // Long press panic activation
    let longPressTimer: NodeJS.Timeout;
    let isLongPress = false;
    
    const handleLongPressStart = () => {
      isLongPress = false;
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        activatePanicMode();
        hapticFeedback('heavy');
        analytics.track('crisis', 'panic_gesture_activated', 'long_press');
      }, 2000); // 2 second long press
    };

    const handleLongPressEnd = () => {
      clearTimeout(longPressTimer);
      if (isLongPress) {
        // Long press completed - panic mode activated
        return;
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleLongPressStart);
    document.addEventListener('touchend', handleLongPressEnd);
    document.addEventListener('click', handleTripleTap);

    // Cleanup function
    return () => {
      document.removeEventListener('touchstart', handleLongPressStart);
      document.removeEventListener('touchend', handleLongPressEnd);
      document.removeEventListener('click', handleTripleTap);
      clearTimeout(tapTimer);
      clearTimeout(longPressTimer);
    };
  };

  // Load accessibility preferences
  const loadAccessibilityPreferences = () => {
    try {
      const saved = localStorage.getItem('alchm_accessibility_preferences');
      if (saved) {
        const preferences = JSON.parse(saved) as AccessibilitySettings;
        setHighContrastMode(preferences.highContrast);
        setLargeTextMode(preferences.largeText);
        setReducedMotion(preferences.reducedMotion);
        setTremorCompensation(preferences.tremorCompensation);
      }
      
      // Check system preferences
      if (typeof window !== 'undefined') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setReducedMotion(true);
        }
        if (window.matchMedia('(prefers-contrast: high)').matches) {
          setHighContrastMode(true);
        }
      }
    } catch (error) {
      logger.error('Failed to load accessibility preferences', error);
    }
  };

  // Setup device monitoring for battery and connection
  const setupDeviceMonitoring = () => {
    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionStatus = () => {
        if (!navigator.onLine) {
          setNetworkStatus('offline');
        } else if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          setNetworkStatus('slow');
        } else {
          setNetworkStatus('online');
        }
      };

      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();
    }
  };

  // Haptic feedback with crisis-safe patterns
  const hapticFeedback = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    try {
      switch (pattern) {
        case 'light':
          navigator.vibrate(vibrationPatterns.current.gentle);
          break;
        case 'medium':
          navigator.vibrate(vibrationPatterns.current.confirmation);
          break;
        case 'heavy':
          navigator.vibrate(vibrationPatterns.current.panic);
          break;
      }
    } catch (error) {
      // Vibration not supported or blocked - fail silently
    }
  }, []);

  // Emergency vibration alert
  const emergencyVibrationAlert = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    try {
      navigator.vibrate(vibrationPatterns.current.emergency);
      
      // Repeat 3 times with pauses
      setTimeout(() => navigator.vibrate(vibrationPatterns.current.emergency), 1000);
      setTimeout(() => navigator.vibrate(vibrationPatterns.current.emergency), 2000);
    } catch (error) {
      // Fail silently if vibration not supported
    }
  }, []);

  // Quick crisis access function
  const quickCrisisAccess = useCallback(() => {
    try {
      // Try to call 988 directly
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        
        if (isMobile) {
          window.location.href = 'tel:988';
        } else {
          // Desktop - show crisis resources modal
          activateEmergencyMode();
        }
        
        analytics.track('crisis', 'quick_access_used', 'direct_call');
      }
    } catch (error) {
      logger.error('Quick crisis access failed', error);
      // Fallback to emergency mode
      activateEmergencyMode();
    }
  }, []);

  // Activate emergency mode
  const activateEmergencyMode = useCallback(() => {
    setEmergencyMode(true);
    setPreventAccidentalTaps(true);
    setGentleTouchResponse(true);
    
    // Enhance accessibility for crisis state
    setHighContrastMode(true);
    setTremorCompensation(true);
    
    // Notify crisis safety coordinator
    if (userId) {
      analytics.track('crisis', 'emergency_mode_activated', 'mobile');
    }
    
    // Haptic feedback
    hapticFeedback('heavy');
    
    logger.info('Mobile emergency mode activated');
  }, [userId, hapticFeedback]);

  // Activate panic mode (more intense than emergency)
  const activatePanicMode = useCallback(() => {
    setPanicMode(true);
    activateEmergencyMode(); // Also activate emergency mode
    
    // Maximum accessibility enhancements
    setHighContrastMode(true);
    setLargeTextMode(true);
    setTremorCompensation(true);
    setReducedMotion(true);
    
    // Emergency vibration pattern
    emergencyVibrationAlert();
    
    if (userId) {
      analytics.track('crisis', 'panic_mode_activated', 'mobile');
    }
    
    logger.info('Mobile panic mode activated');
  }, [userId, emergencyVibrationAlert, activateEmergencyMode]);

  // Deactivate emergency mode
  const deactivateEmergencyMode = useCallback(() => {
    setEmergencyMode(false);
    setPanicMode(false);
    setPreventAccidentalTaps(false);
    setGentleTouchResponse(false);
    
    // Restore normal accessibility settings
    loadAccessibilityPreferences();
    
    if (userId) {
      analytics.track('crisis', 'emergency_mode_deactivated', 'mobile');
    }
    
    // Gentle confirmation
    hapticFeedback('light');
    
    logger.info('Mobile emergency mode deactivated');
  }, [userId, hapticFeedback]);

  // Update accessibility settings
  const updateAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    const currentSettings = {
      highContrast: highContrastMode,
      largeText: largeTextMode,
      reducedMotion: reducedMotion,
      tremorCompensation: tremorCompensation,
      voiceAssistance: false
    };

    const newSettings = { ...currentSettings, ...settings };

    // Apply settings
    if (settings.highContrast !== undefined) {
      setHighContrastMode(settings.highContrast);
    }
    if (settings.largeText !== undefined) {
      setLargeTextMode(settings.largeText);
    }
    if (settings.reducedMotion !== undefined) {
      setReducedMotion(settings.reducedMotion);
    }
    if (settings.tremorCompensation !== undefined) {
      setTremorCompensation(settings.tremorCompensation);
    }

    // Save to localStorage
    try {
      localStorage.setItem('alchm_accessibility_preferences', JSON.stringify(newSettings));
    } catch (error) {
      logger.error('Failed to save accessibility preferences', error);
    }

    // Track usage
    analytics.trackUser.preferencesChanged('accessibility_mobile', JSON.stringify(Object.keys(settings)));
  }, [highContrastMode, largeTextMode, reducedMotion, tremorCompensation]);

  // Apply mobile crisis safety styles
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Apply emergency mode styles
    if (emergencyMode || panicMode) {
      root.classList.add('crisis-emergency-mode');
      
      if (panicMode) {
        root.classList.add('crisis-panic-mode');
      }
    } else {
      root.classList.remove('crisis-emergency-mode', 'crisis-panic-mode');
    }

    // Apply accessibility styles
    if (highContrastMode) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (largeTextMode) {
      root.classList.add('large-text-mode');
    } else {
      root.classList.remove('large-text-mode');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion-mode');
    } else {
      root.classList.remove('reduced-motion-mode');
    }

    if (tremorCompensation) {
      root.classList.add('tremor-compensation-mode');
    } else {
      root.classList.remove('tremor-compensation-mode');
    }

    return () => {
      // Cleanup classes on unmount
      root.classList.remove(
        'crisis-emergency-mode',
        'crisis-panic-mode',
        'high-contrast-mode',
        'large-text-mode',
        'reduced-motion-mode',
        'tremor-compensation-mode'
      );
    };
  }, [emergencyMode, panicMode, highContrastMode, largeTextMode, reducedMotion, tremorCompensation]);

  const contextValue: CrisisSafeMobileContextType = {
    // Crisis safety state
    emergencyMode,
    panicMode,
    crisisResourcesAvailable,
    
    // Mobile-specific features
    hapticFeedback,
    emergencyVibrationAlert,
    quickCrisisAccess,
    
    // Accessibility enhancements
    highContrastMode,
    largeTextMode,
    reducedMotion,
    tremorCompensation,
    
    // Touch safety
    preventAccidentalTaps,
    gentleTouchResponse,
    lastTouchTime,
    
    // Offline support
    offlineResourcesLoaded,
    criticalResourcesCached,
    
    // Device capabilities
    deviceOrientation,
    batteryLevel,
    networkStatus,
    
    // Crisis-specific functions
    activateEmergencyMode,
    activatePanicMode,
    deactivateEmergencyMode,
    updateAccessibilitySettings
  };

  return (
    <CrisisSafeMobileContext.Provider value={contextValue}>
      {children}
    </CrisisSafeMobileContext.Provider>
  );
}

export function useCrisisSafeMobile(): CrisisSafeMobileContextType {
  const context = useContext(CrisisSafeMobileContext);
  if (context === undefined) {
    throw new Error('useCrisisSafeMobile must be used within a CrisisSafeMobileProvider');
  }
  return context;
}