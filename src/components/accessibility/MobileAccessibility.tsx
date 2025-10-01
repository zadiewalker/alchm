'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * Mobile Accessibility Provider - Technology That Includes Everyone
 * 
 * Built with the understanding that someone using ALCHM might be:
 * - Using a screen reader while in crisis
 * - Having motor difficulties due to medication or trauma
 * - Experiencing visual impairments from crying or stress
 * - Using voice control or switch navigation
 * 
 * Every interaction must be accessible not just technically,
 * but emotionally - creating space for all forms of human experience.
 */

interface AccessibilityState {
  // User preferences
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersLargeText: boolean;
  
  // Device capabilities
  supportsHaptics: boolean;
  hasScreenReader: boolean;
  hasVoiceControl: boolean;
  
  // Context-aware settings
  isInCrisis: boolean;
  needsSimpleNavigation: boolean;
  requiresLargerTouchTargets: boolean;
  
  // Dynamic adjustments
  fontSize: number;
  touchTargetSize: number;
  animationDuration: number;
}

interface AccessibilityActions {
  updateCrisisMode: (inCrisis: boolean) => void;
  updateFontSize: (size: number) => void;
  updateTouchTargetSize: (size: number) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  vibrate: (pattern?: number | number[]) => void;
}

interface AccessibilityContextType extends AccessibilityState, AccessibilityActions {}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface MobileAccessibilityProviderProps {
  children: ReactNode;
}

export function MobileAccessibilityProvider({ children }: MobileAccessibilityProviderProps) {
  const [state, setState] = useState<AccessibilityState>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersLargeText: false,
    supportsHaptics: false,
    hasScreenReader: false,
    hasVoiceControl: false,
    isInCrisis: false,
    needsSimpleNavigation: false,
    requiresLargerTouchTargets: false,
    fontSize: 17, // iOS default
    touchTargetSize: 48, // Minimum accessible size
    animationDuration: 300,
  });

  const [announcementElement, setAnnouncementElement] = useState<HTMLDivElement | null>(null);

  // Detect system preferences
  useEffect(() => {
    const updatePreferences = () => {
      setState(prev => ({
        ...prev,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersLargeText: window.matchMedia('(prefers-color-scheme: dark)').matches, // Approximate
        supportsHaptics: 'vibrate' in navigator,
      }));
    };

    updatePreferences();

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    motionQuery.addEventListener('change', updatePreferences);
    contrastQuery.addEventListener('change', updatePreferences);

    return () => {
      motionQuery.removeEventListener('change', updatePreferences);
      contrastQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  // Detect assistive technology
  useEffect(() => {
    const detectAssistiveTech = () => {
      // Screen reader detection (approximate)
      const hasScreenReader = !!(
        window.speechSynthesis || 
        (navigator as any).userAgent.includes('NVDA') ||
        (navigator as any).userAgent.includes('JAWS') ||
        document.querySelector('[aria-live]')
      );

      // Voice control detection (iOS VoiceControl adds specific attributes)
      const hasVoiceControl = !!(
        document.querySelector('[data-voice-control]') ||
        (navigator as any).userAgent.includes('VoiceControl')
      );

      setState(prev => ({
        ...prev,
        hasScreenReader,
        hasVoiceControl,
        requiresLargerTouchTargets: hasVoiceControl || hasScreenReader,
        needsSimpleNavigation: hasVoiceControl,
      }));
    };

    // Check after DOM is ready
    setTimeout(detectAssistiveTech, 1000);
  }, []);

  // Create announcement element for screen readers
  useEffect(() => {
    const element = document.createElement('div');
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.style.position = 'absolute';
    element.style.left = '-10000px';
    element.style.width = '1px';
    element.style.height = '1px';
    element.style.overflow = 'hidden';
    
    document.body.appendChild(element);
    setAnnouncementElement(element);

    return () => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  // Adjust settings based on context
  useEffect(() => {
    const baseSize = state.prefersLargeText ? 19 : 17;
    const touchSize = state.requiresLargerTouchTargets ? 56 : 48;
    const duration = state.prefersReducedMotion ? 0 : 300;

    setState(prev => ({
      ...prev,
      fontSize: Math.max(baseSize, prev.fontSize),
      touchTargetSize: Math.max(touchSize, prev.touchTargetSize),
      animationDuration: state.isInCrisis ? 0 : duration,
    }));
  }, [
    state.prefersLargeText,
    state.requiresLargerTouchTargets,
    state.prefersReducedMotion,
    state.isInCrisis
  ]);

  // Update CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--a11y-font-size', `${state.fontSize}px`);
    root.style.setProperty('--a11y-touch-size', `${state.touchTargetSize}px`);
    root.style.setProperty('--a11y-animation-duration', `${state.animationDuration}ms`);
    
    if (state.prefersHighContrast) {
      root.style.setProperty('--a11y-contrast', 'high');
    } else {
      root.style.removeProperty('--a11y-contrast');
    }
  }, [state.fontSize, state.touchTargetSize, state.animationDuration, state.prefersHighContrast]);

  const updateCrisisMode = (inCrisis: boolean) => {
    setState(prev => ({ ...prev, isInCrisis: inCrisis }));
    
    if (inCrisis) {
      announceToScreenReader(
        'Crisis mode activated. All animations disabled. Large touch targets enabled.',
        'assertive'
      );
    }
  };

  const updateFontSize = (size: number) => {
    setState(prev => ({ ...prev, fontSize: Math.max(14, Math.min(24, size)) }));
  };

  const updateTouchTargetSize = (size: number) => {
    setState(prev => ({ ...prev, touchTargetSize: Math.max(44, Math.min(72, size)) }));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementElement) {
      announcementElement.setAttribute('aria-live', priority);
      announcementElement.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcementElement) {
          announcementElement.textContent = '';
        }
      }, 1000);
    }
  };

  const vibrate = (pattern: number | number[] = 50) => {
    if (state.supportsHaptics && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const contextValue: AccessibilityContextType = {
    ...state,
    updateCrisisMode,
    updateFontSize,
    updateTouchTargetSize,
    announceToScreenReader,
    vibrate,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div 
        className={`accessibility-provider ${state.isInCrisis ? 'crisis-mode' : ''}`}
        data-high-contrast={state.prefersHighContrast}
        data-reduced-motion={state.prefersReducedMotion}
        data-large-text={state.prefersLargeText}
      >
        {children}
      </div>

      <style jsx global>{`
        .accessibility-provider {
          /* Base accessibility improvements */
          --focus-outline: 3px solid #5E8E7F;
          --focus-offset: 2px;
        }

        /* Crisis mode overrides */
        .accessibility-provider.crisis-mode * {
          transition: none !important;
          animation: none !important;
        }

        .accessibility-provider.crisis-mode .mobile-button,
        .accessibility-provider.crisis-mode .mobile-nav-item,
        .accessibility-provider.crisis-mode .mobile-card.interactive {
          min-height: 72px !important;
          min-width: 72px !important;
        }

        /* High contrast mode */
        .accessibility-provider[data-high-contrast="true"] {
          --mobile-sage: #2d5016 !important;
          --mobile-ink: #000000 !important;
          --mobile-whisper: #4a4a4a !important;
        }

        .accessibility-provider[data-high-contrast="true"] .mobile-button.primary {
          border: 2px solid var(--mobile-sage) !important;
        }

        .accessibility-provider[data-high-contrast="true"] .mobile-card {
          border: 2px solid rgba(94, 142, 127, 0.5) !important;
        }

        /* Reduced motion */
        .accessibility-provider[data-reduced-motion="true"] * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        /* Large text scaling */
        .accessibility-provider[data-large-text="true"] {
          font-size: calc(var(--a11y-font-size) * 1.1) !important;
        }

        /* Focus management for all interactive elements */
        .accessibility-provider *:focus-visible {
          outline: var(--focus-outline) !important;
          outline-offset: var(--focus-offset) !important;
          border-radius: 4px !important;
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        /* Skip links for keyboard navigation */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: var(--mobile-sage);
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
          font-size: 14px;
        }

        .skip-link:focus {
          top: 6px;
        }

        /* Touch target sizing */
        .accessibility-provider .mobile-button,
        .accessibility-provider .mobile-nav-item,
        .accessibility-provider button,
        .accessibility-provider a {
          min-height: var(--a11y-touch-size) !important;
          min-width: var(--a11y-touch-size) !important;
        }

        /* Error and success states for screen readers */
        [role="alert"] {
          font-weight: bold;
          color: #FF3500;
        }

        [role="status"] {
          font-weight: bold;
          color: #5E8E7F;
        }

        /* Voice control optimization */
        [data-voice-control] {
          speak: always;
        }
      `}</style>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  
  if (!context) {
    throw new Error('useAccessibility must be used within MobileAccessibilityProvider');
  }
  
  return context;
}

// Convenience hooks for common accessibility needs
export function useCrisisMode() {
  const { isInCrisis, updateCrisisMode, announceToScreenReader } = useAccessibility();
  
  const enableCrisisMode = () => {
    updateCrisisMode(true);
    announceToScreenReader(
      'Crisis support mode enabled. Interface simplified for easier navigation.',
      'assertive'
    );
  };

  const disableCrisisMode = () => {
    updateCrisisMode(false);
    announceToScreenReader('Crisis mode disabled.', 'polite');
  };

  return { isInCrisis, enableCrisisMode, disableCrisisMode };
}

export function useScreenReaderAnnouncements() {
  const { announceToScreenReader } = useAccessibility();
  
  const announceNavigation = (location: string) => {
    announceToScreenReader(`Navigated to ${location}`, 'polite');
  };

  const announceAction = (action: string) => {
    announceToScreenReader(`${action} completed`, 'polite');
  };

  const announceError = (error: string) => {
    announceToScreenReader(`Error: ${error}`, 'assertive');
  };

  const announceSuccess = (message: string) => {
    announceToScreenReader(`Success: ${message}`, 'polite');
  };

  return {
    announceNavigation,
    announceAction,
    announceError,
    announceSuccess,
    announce: announceToScreenReader
  };
}

// Component for skip links
export function SkipLinks() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
    </>
  );
}

// Component for screen reader status announcements
export function AccessibilityStatus({ message, type = 'status' }: { 
  message: string; 
  type?: 'status' | 'alert'; 
}) {
  return (
    <div 
      role={type}
      aria-live={type === 'alert' ? 'assertive' : 'polite'}
      className="sr-only"
    >
      {message}
    </div>
  );
}