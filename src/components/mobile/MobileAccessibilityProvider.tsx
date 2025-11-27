'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Accessibility state for mobile users with motor limitations
interface MobileAccessibilityState {
  // Motor accessibility
  tremorCompensation: boolean;
  oneHandedMode: boolean;
  largeTouch: boolean;
  motorDifficulty: 'none' | 'mild' | 'moderate' | 'severe';
  
  // Visual accessibility
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  darkMode: boolean;
  
  // Cognitive accessibility
  simplifiedUI: boolean;
  reduceComplexity: boolean;
  extendedTimeouts: boolean;
  
  // Crisis-specific accessibility
  crisisMode: boolean;
  emergencyMode: boolean;
  panicSafeNavigation: boolean;
  
  // Device capabilities
  supportsVibration: boolean;
  supportsVoice: boolean;
  batteryLevel: number;
  
  // User preferences
  preferredHandedness: 'left' | 'right' | 'both';
  interactionSpeed: 'slow' | 'normal' | 'fast';
}

interface MobileAccessibilityContextType {
  state: MobileAccessibilityState;
  actions: {
    enableTremorCompensation: () => void;
    toggleOneHandedMode: () => void;
    setHighContrast: (enabled: boolean) => void;
    setLargeText: (enabled: boolean) => void;
    setReducedMotion: (enabled: boolean) => void;
    enableCrisisMode: () => void;
    enableEmergencyMode: () => void;
    setMotorDifficulty: (level: MobileAccessibilityState['motorDifficulty']) => void;
    setHandedness: (hand: MobileAccessibilityState['preferredHandedness']) => void;
    setInteractionSpeed: (speed: MobileAccessibilityState['interactionSpeed']) => void;
    resetToDefaults: () => void;
  };
}

const MobileAccessibilityContext = createContext<MobileAccessibilityContextType | undefined>(undefined);

interface MobileAccessibilityProviderProps {
  children: ReactNode;
}

export function MobileAccessibilityProvider({ children }: MobileAccessibilityProviderProps) {
  const [state, setState] = useState<MobileAccessibilityState>({
    tremorCompensation: false,
    oneHandedMode: false,
    largeTouch: false,
    motorDifficulty: 'none',
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    darkMode: false,
    simplifiedUI: false,
    reduceComplexity: false,
    extendedTimeouts: false,
    crisisMode: false,
    emergencyMode: false,
    panicSafeNavigation: false,
    supportsVibration: false,
    supportsVoice: false,
    batteryLevel: 100,
    preferredHandedness: 'right',
    interactionSpeed: 'normal'
  });

  // Detect device capabilities and user preferences
  useEffect(() => {
    const detectCapabilities = () => {
      // Check for vibration support
      const supportsVibration = 'vibrate' in navigator;
      
      // Check for voice support
      const supportsVoice = 'speechSynthesis' in window || 'webkitSpeechRecognition' in window;
      
      // Check system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setState(prev => ({
        ...prev,
        supportsVibration,
        supportsVoice,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        darkMode: prefersDarkMode
      }));
    };

    detectCapabilities();

    // Monitor battery level for accessibility adjustments
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setState(prev => ({ ...prev, batteryLevel: battery.level * 100 }));
        };
        
        battery.addEventListener('levelchange', updateBattery);
        updateBattery();
      });
    }

    // Listen for system preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, highContrast: e.matches }));
    };
    
    const handleColorChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, darkMode: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);
    colorQuery.addEventListener('change', handleColorChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      colorQuery.removeEventListener('change', handleColorChange);
    };
  }, []);

  // Tremor detection through touch patterns
  useEffect(() => {
    let touchStartTime = 0;
    let touchMoveCount = 0;
    let irregularMovements = 0;
    
    const detectTremors = (e: TouchEvent) => {
      if (e.type === 'touchstart') {
        touchStartTime = Date.now();
        touchMoveCount = 0;
        irregularMovements = 0;
      } else if (e.type === 'touchmove') {
        touchMoveCount++;
        const touch = e.touches[0];
        if (touch) {
          // Detect irregular micro-movements that might indicate tremors
          const irregularity = Math.abs(touch.clientX % 1) + Math.abs(touch.clientY % 1);
          if (irregularity > 0.5) {
            irregularMovements++;
          }
        }
      } else if (e.type === 'touchend') {
        const duration = Date.now() - touchStartTime;
        const irregularityRatio = irregularMovements / Math.max(touchMoveCount, 1);
        
        // If sustained irregular movements detected, suggest tremor compensation
        if (duration > 300 && touchMoveCount > 5 && irregularityRatio > 0.4) {
          if (!state.tremorCompensation) {
            setState(prev => ({
              ...prev,
              tremorCompensation: true,
              largeTouch: true,
              motorDifficulty: prev.motorDifficulty === 'none' ? 'mild' : prev.motorDifficulty
            }));
            
            // Gentle haptic feedback to confirm detection
            if (state.supportsVibration) {
              navigator.vibrate([100, 50, 100]);
            }
          }
        }
      }
    };
    
    document.addEventListener('touchstart', detectTremors, { passive: true });
    document.addEventListener('touchmove', detectTremors, { passive: true });
    document.addEventListener('touchend', detectTremors, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', detectTremors);
      document.removeEventListener('touchmove', detectTremors);
      document.removeEventListener('touchend', detectTremors);
    };
  }, [state.tremorCompensation, state.supportsVibration]);

  // Apply accessibility CSS classes based on state
  useEffect(() => {
    const body = document.body;
    
    // Clear previous accessibility classes
    body.classList.remove(
      'tremor-compensation', 'one-handed-mode', 'large-touch-targets',
      'high-contrast-mode', 'large-text-mode', 'reduced-motion-mode',
      'simplified-ui-mode', 'crisis-accessibility-mode', 'emergency-accessibility-mode',
      'left-handed-mode', 'right-handed-mode', 'slow-interaction-mode',
      'motor-difficulty-mild', 'motor-difficulty-moderate', 'motor-difficulty-severe'
    );
    
    // Apply current accessibility classes
    if (state.tremorCompensation) body.classList.add('tremor-compensation');
    if (state.oneHandedMode) body.classList.add('one-handed-mode');
    if (state.largeTouch) body.classList.add('large-touch-targets');
    if (state.highContrast) body.classList.add('high-contrast-mode');
    if (state.largeText) body.classList.add('large-text-mode');
    if (state.reducedMotion) body.classList.add('reduced-motion-mode');
    if (state.simplifiedUI) body.classList.add('simplified-ui-mode');
    if (state.crisisMode) body.classList.add('crisis-accessibility-mode');
    if (state.emergencyMode) body.classList.add('emergency-accessibility-mode');
    
    if (state.preferredHandedness === 'left') body.classList.add('left-handed-mode');
    if (state.preferredHandedness === 'right') body.classList.add('right-handed-mode');
    
    if (state.interactionSpeed === 'slow') body.classList.add('slow-interaction-mode');
    
    if (state.motorDifficulty !== 'none') {
      body.classList.add(`motor-difficulty-${state.motorDifficulty}`);
    }
    
    // Set CSS custom properties for fine-tuned control
    body.style.setProperty('--accessibility-touch-size', state.largeTouch ? '72px' : '52px');
    body.style.setProperty('--accessibility-animation-speed', state.reducedMotion ? '0ms' : '300ms');
    body.style.setProperty('--accessibility-timeout-multiplier', state.extendedTimeouts ? '3' : '1');
    body.style.setProperty('--accessibility-battery-level', `${state.batteryLevel}%`);
    
  }, [state]);

  // Auto-adjust settings based on crisis detection
  useEffect(() => {
    if (state.crisisMode && !state.emergencyMode) {
      // Crisis mode: Increase touch targets, simplify UI
      setState(prev => ({
        ...prev,
        largeTouch: true,
        simplifiedUI: true,
        extendedTimeouts: true
      }));
    }
    
    if (state.emergencyMode) {
      // Emergency mode: Maximum accessibility
      setState(prev => ({
        ...prev,
        largeTouch: true,
        simplifiedUI: true,
        extendedTimeouts: true,
        highContrast: true,
        reduceComplexity: true
      }));
    }
  }, [state.crisisMode, state.emergencyMode]);

  // Auto-adjust settings based on battery level
  useEffect(() => {
    if (state.batteryLevel < 20) {
      // Low battery: Enable power-saving accessibility features
      setState(prev => ({
        ...prev,
        reducedMotion: true,
        simplifiedUI: true
      }));
    }
  }, [state.batteryLevel]);

  const actions = {
    enableTremorCompensation: () => {
      setState(prev => ({
        ...prev,
        tremorCompensation: true,
        largeTouch: true,
        motorDifficulty: prev.motorDifficulty === 'none' ? 'mild' : prev.motorDifficulty
      }));
      
      if (state.supportsVibration) {
        navigator.vibrate([200, 100, 200]);
      }
    },
    
    toggleOneHandedMode: () => {
      setState(prev => ({ ...prev, oneHandedMode: !prev.oneHandedMode }));
      
      if (state.supportsVibration) {
        navigator.vibrate([100]);
      }
    },
    
    setHighContrast: (enabled: boolean) => {
      setState(prev => ({ ...prev, highContrast: enabled }));
    },
    
    setLargeText: (enabled: boolean) => {
      setState(prev => ({ ...prev, largeText: enabled }));
    },
    
    setReducedMotion: (enabled: boolean) => {
      setState(prev => ({ ...prev, reducedMotion: enabled }));
    },
    
    enableCrisisMode: () => {
      setState(prev => ({
        ...prev,
        crisisMode: true,
        largeTouch: true,
        simplifiedUI: true,
        extendedTimeouts: true,
        panicSafeNavigation: true
      }));
      
      if (state.supportsVibration) {
        navigator.vibrate([500, 200, 500]);
      }
    },
    
    enableEmergencyMode: () => {
      setState(prev => ({
        ...prev,
        emergencyMode: true,
        crisisMode: true,
        largeTouch: true,
        simplifiedUI: true,
        extendedTimeouts: true,
        highContrast: true,
        reduceComplexity: true,
        panicSafeNavigation: true
      }));
      
      if (state.supportsVibration) {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
      }
    },
    
    setMotorDifficulty: (level: MobileAccessibilityState['motorDifficulty']) => {
      setState(prev => ({
        ...prev,
        motorDifficulty: level,
        tremorCompensation: level !== 'none',
        largeTouch: level !== 'none',
        extendedTimeouts: level === 'moderate' || level === 'severe',
        simplifiedUI: level === 'severe'
      }));
    },
    
    setHandedness: (hand: MobileAccessibilityState['preferredHandedness']) => {
      setState(prev => ({ ...prev, preferredHandedness: hand }));
    },
    
    setInteractionSpeed: (speed: MobileAccessibilityState['interactionSpeed']) => {
      setState(prev => ({
        ...prev,
        interactionSpeed: speed,
        extendedTimeouts: speed === 'slow'
      }));
    },
    
    resetToDefaults: () => {
      setState(prev => ({
        ...prev,
        tremorCompensation: false,
        oneHandedMode: false,
        largeTouch: false,
        motorDifficulty: 'none',
        simplifiedUI: false,
        reduceComplexity: false,
        extendedTimeouts: false,
        crisisMode: false,
        emergencyMode: false,
        panicSafeNavigation: false,
        preferredHandedness: 'right',
        interactionSpeed: 'normal'
      }));
    }
  };

  return (
    <MobileAccessibilityContext.Provider value={{ state, actions }}>
      {children}
      
      {/* Accessibility announcements for screen readers */}
      <div id="accessibility-announcements" className="sr-only" aria-live="polite" aria-atomic="true">
        {state.tremorCompensation && !state.crisisMode && (
          <span>Tremor compensation enabled. Touch targets enlarged for easier interaction.</span>
        )}
        {state.crisisMode && (
          <span>Crisis mode activated. Interface simplified for safety and ease of use.</span>
        )}
        {state.emergencyMode && (
          <span>Emergency mode activated. Maximum accessibility features enabled.</span>
        )}
      </div>
      
      {/* Visual accessibility indicators */}
      {(state.tremorCompensation || state.oneHandedMode || state.largeTouch) && (
        <div className="fixed top-4 left-4 z-50 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          {state.emergencyMode ? '🚨' : state.crisisMode ? '🛡️' : '♿'} Accessibility Active
        </div>
      )}
    </MobileAccessibilityContext.Provider>
  );
}

export function useMobileAccessibility() {
  const context = useContext(MobileAccessibilityContext);
  if (context === undefined) {
    throw new Error('useMobileAccessibility must be used within a MobileAccessibilityProvider');
  }
  return context;
}

// Hook for component-level accessibility adaptations
export function useAccessibilityStyles() {
  const { state } = useMobileAccessibility();
  
  return {
    touchTargetSize: state.largeTouch ? '72px' : state.tremorCompensation ? '64px' : '52px',
    animationDuration: state.reducedMotion ? '0ms' : state.batteryLevel < 20 ? '150ms' : '300ms',
    fontSize: state.largeText ? '1.25rem' : '1rem',
    spacing: state.motorDifficulty === 'severe' ? '24px' : state.motorDifficulty === 'moderate' ? '16px' : '12px',
    timeout: state.extendedTimeouts ? 15000 : 5000,
    
    // CSS classes for easy application
    containerClasses: [
      state.oneHandedMode && 'max-w-xs ml-auto mr-4',
      state.preferredHandedness === 'left' && 'items-start',
      state.preferredHandedness === 'right' && 'items-end',
      state.simplifiedUI && 'space-y-6',
      state.crisisMode && 'bg-red-50 border-red-200',
      state.emergencyMode && 'bg-red-100 border-red-300 border-2'
    ].filter(Boolean).join(' '),
    
    buttonClasses: [
      'transition-all duration-200',
      state.largeTouch && 'min-h-18 min-w-18 p-4',
      state.tremorCompensation && 'border-2 border-gray-300',
      state.highContrast && 'border-black text-black bg-white',
      state.motorDifficulty === 'severe' && 'text-xl font-medium',
      state.crisisMode && 'bg-red-600 text-white border-red-700',
      state.emergencyMode && 'bg-red-700 text-white border-red-800 shadow-xl'
    ].filter(Boolean).join(' '),
    
    // Interaction patterns
    hapticFeedback: (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
      if (!state.supportsVibration) return;
      
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200],
        success: [100, 50, 100],
        warning: [200, 100, 200],
        error: [300, 100, 300, 100, 300]
      };
      
      navigator.vibrate(patterns[pattern]);
    }
  };
}

// Accessibility-aware focus management
export function useAccessibilityFocus() {
  const { state } = useMobileAccessibility();
  
  return {
    focusDelay: state.motorDifficulty === 'severe' ? 1000 : state.interactionSpeed === 'slow' ? 500 : 0,
    
    // Enhanced focus for crisis situations
    enhancedFocus: (element: HTMLElement) => {
      if (state.crisisMode || state.emergencyMode) {
        element.style.outline = '4px solid #dc2626';
        element.style.outlineOffset = '4px';
        element.style.boxShadow = '0 0 0 8px rgba(220, 38, 38, 0.3)';
      }
      
      element.focus();
      
      // Scroll into view with extra padding for motor difficulties
      element.scrollIntoView({ 
        behavior: state.reducedMotion ? 'auto' : 'smooth',
        block: 'center',
        inline: 'center'
      });
    },
    
    // Safe navigation for panic situations
    panicSafeNavigate: (url: string) => {
      if (state.panicSafeNavigation) {
        // Show confirmation for navigation during crisis
        const confirmed = confirm('Are you sure you want to leave this page? Crisis support will remain available.');
        if (confirmed) {
          window.location.href = url;
        }
      } else {
        window.location.href = url;
      }
    }
  };
}