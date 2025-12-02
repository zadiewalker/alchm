'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

/**
 * ALCHM Accessibility Provider
 * 
 * Provides comprehensive accessibility features for trauma-informed mental health support.
 * Ensures WCAG 2.1 AA compliance with special considerations for users in crisis.
 */

interface AccessibilitySettings {
  // Motion and Animation
  respectReducedMotion: boolean;
  disableAnimations: boolean;
  
  // Text and Visual
  fontSize: 'default' | 'comfortable' | 'large' | 'crisis';
  contrast: 'default' | 'high' | 'crisis';
  lineHeight: 'default' | 'comfortable' | 'loose';
  
  // Interaction
  touchTargetSize: 'default' | 'comfortable' | 'crisis' | 'emergency';
  focusIndicators: 'default' | 'enhanced' | 'crisis';
  
  // Crisis Support
  crisisMode: boolean;
  emergencyMode: boolean;
  simplifiedInterface: boolean;
  
  // Assistive Technology
  screenReaderOptimized: boolean;
  keyboardNavigationMode: boolean;
  voiceControlMode: boolean;
  
  // Cognitive Support
  dyslexiaFriendly: boolean;
  adhdhSupport: boolean;
  memorySupport: boolean;
}

interface AccessibilityContext {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  enableCrisisMode: () => void;
  disableCrisisMode: () => void;
  enableEmergencyMode: () => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusManagement: {
    setFocusTrap: (element: HTMLElement) => void;
    releaseFocusTrap: () => void;
    moveFocus: (direction: 'next' | 'previous' | 'first' | 'last') => void;
    announcePageChange: (pageTitle: string) => void;
  };
}

const AccessibilityContext = createContext<AccessibilityContext | null>(null);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
  initialCrisisMode?: boolean;
}

export function AccessibilityProvider({ 
  children, 
  initialCrisisMode = false 
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    respectReducedMotion: false,
    disableAnimations: false,
    fontSize: 'default',
    contrast: 'default',
    lineHeight: 'default',
    touchTargetSize: 'default',
    focusIndicators: 'default',
    crisisMode: initialCrisisMode,
    emergencyMode: false,
    simplifiedInterface: false,
    screenReaderOptimized: false,
    keyboardNavigationMode: false,
    voiceControlMode: false,
    dyslexiaFriendly: false,
    adhdhSupport: false,
    memorySupport: false,
  });

  const announceRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Detect user preferences on mount
  useEffect(() => {
    const detectPreferences = () => {
      const updates: Partial<AccessibilitySettings> = {};

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        updates.respectReducedMotion = true;
        updates.disableAnimations = true;
      }

      // Check for high contrast preference
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        updates.contrast = 'high';
      }

      // Check for large text preference
      if (window.matchMedia('(min-resolution: 2dppx)').matches) {
        updates.fontSize = 'comfortable';
      }

      // Detect touch device for larger touch targets
      if (window.matchMedia('(pointer: coarse)').matches) {
        updates.touchTargetSize = 'comfortable';
      }

      // Detect keyboard navigation
      const handleFirstTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          updates.keyboardNavigationMode = true;
          document.removeEventListener('keydown', handleFirstTab);
        }
      };
      document.addEventListener('keydown', handleFirstTab);

      if (Object.keys(updates).length > 0) {
        setSettings(prev => ({ ...prev, ...updates }));
      }
    };

    detectPreferences();

    // Load saved preferences
    try {
      const saved = localStorage.getItem('alchm-accessibility-settings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alchm-accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, [settings]);

  // Apply accessibility classes to document
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Remove all accessibility classes first
    html.classList.remove(
      'a11y-crisis-mode',
      'a11y-emergency-mode',
      'a11y-reduced-motion',
      'a11y-high-contrast',
      'a11y-keyboard-navigation',
      'a11y-dyslexia-friendly',
      'a11y-simplified-interface'
    );

    body.classList.remove(
      'font-size-comfortable',
      'font-size-large',
      'font-size-crisis',
      'touch-targets-comfortable',
      'touch-targets-crisis',
      'touch-targets-emergency',
      'focus-enhanced',
      'focus-crisis'
    );

    // Apply current settings
    if (settings.crisisMode) {
      html.classList.add('a11y-crisis-mode');
    }

    if (settings.emergencyMode) {
      html.classList.add('a11y-emergency-mode');
    }

    if (settings.respectReducedMotion || settings.disableAnimations) {
      html.classList.add('a11y-reduced-motion');
    }

    if (settings.contrast === 'high' || settings.contrast === 'crisis') {
      html.classList.add('a11y-high-contrast');
    }

    if (settings.keyboardNavigationMode) {
      html.classList.add('a11y-keyboard-navigation');
    }

    if (settings.dyslexiaFriendly) {
      html.classList.add('a11y-dyslexia-friendly');
    }

    if (settings.simplifiedInterface) {
      html.classList.add('a11y-simplified-interface');
    }

    // Font size
    if (settings.fontSize !== 'default') {
      body.classList.add(`font-size-${settings.fontSize}`);
    }

    // Touch targets
    if (settings.touchTargetSize !== 'default') {
      body.classList.add(`touch-targets-${settings.touchTargetSize}`);
    }

    // Focus indicators
    if (settings.focusIndicators === 'enhanced') {
      body.classList.add('focus-enhanced');
    } else if (settings.focusIndicators === 'crisis') {
      body.classList.add('focus-crisis');
    }

  }, [settings]);

  // Crisis mode effects
  useEffect(() => {
    if (settings.crisisMode) {
      // Automatically enable crisis-appropriate settings
      setSettings(prev => ({
        ...prev,
        disableAnimations: true,
        fontSize: 'crisis',
        contrast: 'crisis',
        lineHeight: 'loose',
        touchTargetSize: 'crisis',
        focusIndicators: 'crisis',
        simplifiedInterface: true,
        screenReaderOptimized: true,
      }));

      // Set page title for screen readers
      const originalTitle = document.title;
      document.title = 'Crisis Support - ' + originalTitle;

      return () => {
        document.title = originalTitle;
      };
    }
  }, [settings.crisisMode]);

  // Emergency mode effects
  useEffect(() => {
    if (settings.emergencyMode) {
      // Maximum accessibility settings for emergency
      setSettings(prev => ({
        ...prev,
        crisisMode: true,
        disableAnimations: true,
        fontSize: 'crisis',
        contrast: 'crisis',
        lineHeight: 'loose',
        touchTargetSize: 'emergency',
        focusIndicators: 'crisis',
        simplifiedInterface: true,
        screenReaderOptimized: true,
      }));

      // Emergency page title
      const originalTitle = document.title;
      document.title = '🚨 EMERGENCY SUPPORT - ' + originalTitle;

      // Announce emergency mode
      announceToScreenReader(
        'Emergency support mode activated. Large buttons and simplified interface available. Crisis resources at top of page.',
        'assertive'
      );

      return () => {
        document.title = originalTitle;
      };
    }
  }, [settings.emergencyMode]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const enableCrisisMode = () => {
    setSettings(prev => ({ ...prev, crisisMode: true }));
    announceToScreenReader(
      'Crisis support mode enabled. Interface simplified with larger text and buttons.',
      'assertive'
    );
  };

  const disableCrisisMode = () => {
    setSettings(prev => ({
      ...prev,
      crisisMode: false,
      emergencyMode: false,
      simplifiedInterface: false,
    }));
    announceToScreenReader('Crisis support mode disabled.', 'polite');
  };

  const enableEmergencyMode = () => {
    setSettings(prev => ({ ...prev, emergencyMode: true, crisisMode: true }));
    announceToScreenReader(
      'Emergency mode activated. Crisis hotlines and emergency contacts available immediately.',
      'assertive'
    );
  };

  const announceToScreenReader = (
    message: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (!announceRef.current) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    announceRef.current.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      if (announceRef.current?.contains(announcement)) {
        announceRef.current.removeChild(announcement);
      }
    }, 1000);
  };

  const setFocusTrap = (element: HTMLElement) => {
    // Save current focus
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Set focus trap
    focusTrapRef.current = element;
    
    // Move focus to first focusable element in trap
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Handle tab navigation
    const handleTabNavigation = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && focusTrapRef.current) {
        const focusableElements = focusTrapRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabNavigation);
    
    return () => {
      document.removeEventListener('keydown', handleTabNavigation);
    };
  };

  const releaseFocusTrap = () => {
    focusTrapRef.current = null;
    
    // Return focus to previous element
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  const moveFocus = (direction: 'next' | 'previous' | 'first' | 'last') => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(
      document.activeElement as HTMLElement
    );

    let nextIndex: number;
    
    switch (direction) {
      case 'next':
        nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'previous':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = focusableElements.length - 1;
        break;
    }

    (focusableElements[nextIndex] as HTMLElement)?.focus();
  };

  const announcePageChange = (pageTitle: string) => {
    announceToScreenReader(`Navigated to ${pageTitle}`, 'assertive');
  };

  const contextValue: AccessibilityContext = {
    settings,
    updateSettings,
    enableCrisisMode,
    disableCrisisMode,
    enableEmergencyMode,
    announceToScreenReader,
    focusManagement: {
      setFocusTrap,
      releaseFocusTrap,
      moveFocus,
      announcePageChange,
    },
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Screen reader announcement area */}
      <div 
        ref={announceRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="accessibility-announcements"
      />
      
      {/* Skip links */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <a href="#navigation" className="skip-link">
          Skip to navigation
        </a>
        {settings.crisisMode && (
          <a href="#crisis-resources" className="skip-link">
            Skip to crisis resources
          </a>
        )}
      </div>
    </AccessibilityContext.Provider>
  );
}

export default AccessibilityProvider;