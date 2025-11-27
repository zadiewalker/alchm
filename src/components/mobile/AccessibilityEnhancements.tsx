'use client';

import React, { useState, useEffect, useRef } from 'react';

// Mobile Accessibility Enhancements for Trauma-Informed Pricing
// Supports users with motor impairments, vision issues, and cognitive differences

interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  slowInteractions: boolean;
  voiceAnnouncements: boolean;
  simplicityMode: boolean;
}

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
}

export function AccessibilityEnhancements({ children }: AccessibilityEnhancementsProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
    reducedMotion: false,
    slowInteractions: false,
    voiceAnnouncements: false,
    simplicityMode: false
  });
  
  const [showA11yPanel, setShowA11yPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Detect user preferences on mount
  useEffect(() => {
    detectUserPreferences();
    loadSavedSettings();
    setupKeyboardNavigation();
    setupFocusManagement();
    setIsLoading(false);
  }, []);

  // Apply settings when they change
  useEffect(() => {
    applyAccessibilitySettings();
    saveSettings();
  }, [settings]);

  const detectUserPreferences = () => {
    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersLargeText = window.matchMedia('(prefers-reduced-data: reduce)').matches;

    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      largeText: prefersLargeText
    }));
  };

  const loadSavedSettings = () => {
    try {
      const saved = localStorage.getItem('alchm-accessibility-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.warn('Could not load accessibility settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('alchm-accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Could not save accessibility settings:', error);
    }
  };

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // Large text
    if (settings.largeText) {
      root.style.setProperty('--font-size-multiplier', '1.25');
      root.classList.add('large-text');
    } else {
      root.style.removeProperty('--font-size-multiplier');
      root.classList.remove('large-text');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Slow interactions (longer hover/focus delays)
    if (settings.slowInteractions) {
      root.classList.add('slow-interactions');
    } else {
      root.classList.remove('slow-interactions');
    }

    // Simplicity mode (remove non-essential elements)
    if (settings.simplicityMode) {
      root.classList.add('simplicity-mode');
    } else {
      root.classList.remove('simplicity-mode');
    }
  };

  const setupKeyboardNavigation = () => {
    // Enhanced keyboard navigation for pricing page
    document.addEventListener('keydown', (e) => {
      // Alt + A to open accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowA11yPanel(true);
        announceToScreenReader('Accessibility panel opened');
      }

      // Escape to close accessibility panel
      if (e.key === 'Escape' && showA11yPanel) {
        setShowA11yPanel(false);
        announceToScreenReader('Accessibility panel closed');
      }

      // Enhanced tab navigation
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Highlight focused elements more prominently
        setTimeout(() => {
          const focused = document.activeElement;
          if (focused && focusableElements.length > 0) {
            focused.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 10);
      }
    });
  };

  const setupFocusManagement = () => {
    // Enhanced focus indicators
    const style = document.createElement('style');
    style.textContent = `
      .enhanced-focus *:focus {
        outline: 3px solid #4F46E5 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.3) !important;
      }
      
      .high-contrast *:focus {
        outline: 4px solid #FFFFFF !important;
        background-color: #000000 !important;
        color: #FFFFFF !important;
      }
      
      .large-text {
        font-size: calc(1rem * var(--font-size-multiplier, 1)) !important;
      }
      
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .slow-interactions button:hover {
        transition-delay: 0.5s !important;
      }
      
      .simplicity-mode .testimonials,
      .simplicity-mode .social-proof,
      .simplicity-mode .decorative {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add enhanced focus class
    document.body.classList.add('enhanced-focus');
  };

  const announceToScreenReader = (message: string) => {
    if (settings.voiceAnnouncements && announcementRef.current) {
      announcementRef.current.textContent = message;
      
      // Clear after 5 seconds
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 5000);
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    const settingNames = {
      largeText: 'Large text',
      highContrast: 'High contrast',
      reducedMotion: 'Reduced motion',
      slowInteractions: 'Slow interactions',
      voiceAnnouncements: 'Voice announcements',
      simplicityMode: 'Simplicity mode'
    };
    
    announceToScreenReader(
      `${settingNames[key]} ${value ? 'enabled' : 'disabled'}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading accessibility features...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Screen Reader Announcement Area */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-lg"
        style={{ touchAction: 'manipulation' }}
      >
        Skip to main content
      </a>

      {/* Accessibility Button - Always Visible */}
      <button
        onClick={() => setShowA11yPanel(true)}
        className="fixed top-4 right-4 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
        style={{ 
          minHeight: '48px',
          minWidth: '48px',
          touchAction: 'manipulation'
        }}
        aria-label="Open accessibility settings (Alt + A)"
        title="Accessibility Options"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Accessibility Panel */}
      {showA11yPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                  Accessibility Options
                </h2>
                <button
                  onClick={() => setShowA11yPanel(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  style={{ minHeight: '48px', minWidth: '48px', touchAction: 'manipulation' }}
                  aria-label="Close accessibility panel"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Large Text */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => updateSetting('largeText', !settings.largeText)}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                      settings.largeText ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    role="switch"
                    aria-checked={settings.largeText}
                    aria-labelledby="large-text-label"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.largeText ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <h3 id="large-text-label" className="font-medium text-gray-900">Large Text</h3>
                    <p className="text-sm text-gray-600">Increase text size for better readability</p>
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                      settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    role="switch"
                    aria-checked={settings.highContrast}
                    aria-labelledby="high-contrast-label"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <h3 id="high-contrast-label" className="font-medium text-gray-900">High Contrast</h3>
                    <p className="text-sm text-gray-600">Enhance color contrast for better visibility</p>
                  </div>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                      settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    role="switch"
                    aria-checked={settings.reducedMotion}
                    aria-labelledby="reduced-motion-label"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <h3 id="reduced-motion-label" className="font-medium text-gray-900">Reduced Motion</h3>
                    <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                  </div>
                </div>

                {/* Slow Interactions */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => updateSetting('slowInteractions', !settings.slowInteractions)}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                      settings.slowInteractions ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    role="switch"
                    aria-checked={settings.slowInteractions}
                    aria-labelledby="slow-interactions-label"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.slowInteractions ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <h3 id="slow-interactions-label" className="font-medium text-gray-900">Slow Interactions</h3>
                    <p className="text-sm text-gray-600">Longer delays for hover and focus states</p>
                  </div>
                </div>

                {/* Voice Announcements */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => updateSetting('voiceAnnouncements', !settings.voiceAnnouncements)}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                      settings.voiceAnnouncements ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    role="switch"
                    aria-checked={settings.voiceAnnouncements}
                    aria-labelledby="voice-announcements-label"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.voiceAnnouncements ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <h3 id="voice-announcements-label" className="font-medium text-gray-900">Voice Announcements</h3>
                    <p className="text-sm text-gray-600">Enhanced screen reader announcements</p>
                  </div>
                </div>

                {/* Simplicity Mode */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => updateSetting('simplicityMode', !settings.simplicityMode)}
                    className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                      settings.simplicityMode ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    role="switch"
                    aria-checked={settings.simplicityMode}
                    aria-labelledby="simplicity-mode-label"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.simplicityMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <div>
                    <h3 id="simplicity-mode-label" className="font-medium text-gray-900">Simplicity Mode</h3>
                    <p className="text-sm text-gray-600">Hide non-essential elements for focus</p>
                  </div>
                </div>

              </div>

              {/* Help Text */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-900 mb-2">Keyboard Shortcuts</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Alt + A: Open accessibility panel</li>
                  <li>• Tab: Navigate between elements</li>
                  <li>• Escape: Close panels</li>
                  <li>• Space/Enter: Activate buttons</li>
                </ul>
              </div>

              {/* Crisis Support Notice */}
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-medium text-red-900 mb-2">Need Immediate Help?</h4>
                <p className="text-sm text-red-800 mb-3">
                  If you're in crisis, the red heart button provides immediate support access.
                </p>
                <a
                  href="tel:988"
                  className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ touchAction: 'manipulation' }}
                >
                  Call Crisis Lifeline: 988
                </a>
              </div>

              {/* Close Button */}
              <div className="mt-8">
                <button
                  onClick={() => setShowA11yPanel(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium text-lg transition-colors"
                  style={{ 
                    minHeight: '56px',
                    touchAction: 'manipulation'
                  }}
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}