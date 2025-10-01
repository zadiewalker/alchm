'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisAccessibilityProps {
  children: React.ReactNode;
  crisisLevel?: 'stable' | 'elevated' | 'crisis';
  enableEnhancedMode?: boolean;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  colorBlindSupport: boolean;
  focusRingEnhanced: boolean;
  voicePrompts: boolean;
  simplifiedInterface: boolean;
}

interface ScreenReaderContext {
  isActive: boolean;
  type: 'nvda' | 'jaws' | 'voiceover' | 'talkback' | 'unknown';
  announcements: string[];
}

export function CrisisAccessibility({
  children,
  crisisLevel = 'stable',
  enableEnhancedMode = false
}: CrisisAccessibilityProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    colorBlindSupport: false,
    focusRingEnhanced: false,
    voicePrompts: false,
    simplifiedInterface: false
  });

  const [screenReader, setScreenReader] = useState<ScreenReaderContext>({
    isActive: false,
    type: 'unknown',
    announcements: []
  });

  const [emergencyAccessMode, setEmergencyAccessMode] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);
  const focusManagerRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Detect accessibility preferences and tools
  useEffect(() => {
    const detectAccessibilitySettings = () => {
      const newSettings: AccessibilitySettings = {
        highContrast: window.matchMedia('(prefers-contrast: high)').matches ||
                     window.matchMedia('(prefers-contrast: more)').matches,
        largeText: window.matchMedia('(prefers-font-size: large)').matches,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        screenReaderOptimized: detectScreenReader(),
        colorBlindSupport: false, // Will be detected through user preference
        focusRingEnhanced: window.matchMedia('(prefers-contrast: high)').matches,
        voicePrompts: 'speechSynthesis' in window && crisisLevel === 'crisis',
        simplifiedInterface: emergencyAccessMode || crisisLevel === 'crisis'
      };

      setSettings(newSettings);
      applyAccessibilitySettings(newSettings);
    };

    detectAccessibilitySettings();

    // Listen for changes in system preferences
    const mediaQueries = [
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-font-size: large)'),
      window.matchMedia('(prefers-reduced-motion: reduce)')
    ];

    mediaQueries.forEach(mq => {
      mq.addListener(detectAccessibilitySettings);
    });

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeListener(detectAccessibilitySettings);
      });
    };
  }, [emergencyAccessMode, crisisLevel]);

  // Screen reader detection and optimization
  const detectScreenReader = useCallback((): boolean => {
    // Check for screen reader indicators
    const hasScreenReader = !!(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      navigator.userAgent.includes('TalkBack') ||
      window.navigator.userAgent.includes('WindowEyes') ||
      (window as any).speechSynthesis ||
      document.getElementsByTagName('body')[0]?.classList.contains('screen-reader')
    );

    if (hasScreenReader) {
      // Detect specific screen reader
      let type: ScreenReaderContext['type'] = 'unknown';
      if (navigator.userAgent.includes('NVDA')) type = 'nvda';
      else if (navigator.userAgent.includes('JAWS')) type = 'jaws';
      else if (navigator.userAgent.includes('VoiceOver')) type = 'voiceover';
      else if (navigator.userAgent.includes('TalkBack')) type = 'talkback';

      setScreenReader({
        isActive: true,
        type,
        announcements: []
      });

      return true;
    }

    return false;
  }, []);

  // Apply accessibility settings to DOM
  const applyAccessibilitySettings = useCallback((newSettings: AccessibilitySettings) => {
    const body = document.body;
    
    // Remove existing classes
    body.classList.remove(
      'high-contrast-mode',
      'large-text-mode', 
      'reduced-motion-mode',
      'screen-reader-optimized',
      'color-blind-support',
      'enhanced-focus',
      'simplified-interface',
      'emergency-access-mode'
    );

    // Apply new classes based on settings
    if (newSettings.highContrast) {
      body.classList.add('high-contrast-mode');
    }
    
    if (newSettings.largeText) {
      body.classList.add('large-text-mode');
    }
    
    if (newSettings.reducedMotion) {
      body.classList.add('reduced-motion-mode');
    }
    
    if (newSettings.screenReaderOptimized) {
      body.classList.add('screen-reader-optimized');
    }
    
    if (newSettings.colorBlindSupport) {
      body.classList.add('color-blind-support');
    }
    
    if (newSettings.focusRingEnhanced) {
      body.classList.add('enhanced-focus');
    }
    
    if (newSettings.simplifiedInterface) {
      body.classList.add('simplified-interface');
    }

    if (emergencyAccessMode) {
      body.classList.add('emergency-access-mode');
    }

    // Configure ARIA live regions
    configureAriaLiveRegions();
    
    // Setup focus management
    setupFocusManagement();

  }, [emergencyAccessMode]);

  // Configure ARIA live regions for announcements
  const configureAriaLiveRegions = useCallback(() => {
    // Create or update live region for announcements
    let liveRegion = document.getElementById('crisis-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'crisis-announcements';
      liveRegion.setAttribute('aria-live', crisisLevel === 'crisis' ? 'assertive' : 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Update the urgency based on crisis level
    liveRegion.setAttribute('aria-live', crisisLevel === 'crisis' ? 'assertive' : 'polite');
  }, [crisisLevel]);

  // Setup enhanced focus management for crisis situations
  const setupFocusManagement = useCallback(() => {
    // Trap focus within critical areas during crisis
    if (crisisLevel === 'crisis') {
      const trapFocus = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
          );
          
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', trapFocus);
      return () => document.removeEventListener('keydown', trapFocus);
    }
  }, [crisisLevel]);

  // Announce message to screen readers and voice synthesis
  const announceMessage = useCallback((message: string, priority: 'low' | 'medium' | 'high' | 'emergency' = 'medium') => {
    // Add to screen reader announcements
    setScreenReader(prev => ({
      ...prev,
      announcements: [...prev.announcements.slice(-4), message] // Keep last 5 announcements
    }));

    // Update ARIA live region
    const liveRegion = document.getElementById('crisis-announcements');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement to allow for new ones
      setTimeout(() => {
        if (liveRegion.textContent === message) {
          liveRegion.textContent = '';
        }
      }, 3000);
    }

    // Voice synthesis for high priority or crisis announcements
    if ((priority === 'high' || priority === 'emergency') && settings.voicePrompts && 'speechSynthesis' in window) {
      // Cancel previous speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = priority === 'emergency' ? 1.2 : 1.0;
      utterance.pitch = priority === 'emergency' ? 1.1 : 1.0;
      utterance.volume = 0.8;
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.voicePrompts]);

  // Emergency accessibility mode toggle
  const toggleEmergencyAccessMode = useCallback(() => {
    setEmergencyAccessMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        announceMessage('Emergency accessibility mode activated. Interface simplified for crisis support.', 'emergency');
        
        // Auto-enable critical settings
        setSettings(prevSettings => ({
          ...prevSettings,
          highContrast: true,
          largeText: true,
          reducedMotion: true,
          screenReaderOptimized: true,
          focusRingEnhanced: true,
          simplifiedInterface: true
        }));
      } else {
        announceMessage('Emergency accessibility mode deactivated.', 'medium');
      }
      
      return newMode;
    });
  }, [announceMessage]);

  // Voice control setup
  useEffect(() => {
    if (!settings.voicePrompts || !('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      
      // Basic voice commands for crisis situations
      if (command.includes('help') || command.includes('emergency')) {
        window.location.href = '/crisis-resources';
      } else if (command.includes('home') || command.includes('dashboard')) {
        window.location.href = '/dashboard';
      } else if (command.includes('write') || command.includes('journal')) {
        window.location.href = '/journal';
      }
    };

    // Activate voice commands in crisis mode
    if (crisisLevel === 'crisis') {
      setIsVoiceEnabled(true);
      announceMessage('Voice commands activated. Say "help", "home", or "write" to navigate.', 'high');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [settings.voicePrompts, crisisLevel, announceMessage]);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Emergency access toggle: Ctrl + Alt + A
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        toggleEmergencyAccessMode();
      }

      // High contrast toggle: Ctrl + Alt + C
      if (event.ctrlKey && event.altKey && event.key === 'c') {
        event.preventDefault();
        setSettings(prev => ({
          ...prev,
          highContrast: !prev.highContrast
        }));
        announceMessage(`High contrast mode ${settings.highContrast ? 'disabled' : 'enabled'}.`, 'medium');
      }

      // Large text toggle: Ctrl + Alt + T
      if (event.ctrlKey && event.altKey && event.key === 't') {
        event.preventDefault();
        setSettings(prev => ({
          ...prev,
          largeText: !prev.largeText
        }));
        announceMessage(`Large text mode ${settings.largeText ? 'disabled' : 'enabled'}.`, 'medium');
      }

      // Crisis help shortcut: Ctrl + Shift + H
      if (event.ctrlKey && event.shiftKey && event.key === 'h') {
        event.preventDefault();
        window.location.href = '/crisis-resources';
        announceMessage('Navigating to crisis support resources.', 'high');
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [toggleEmergencyAccessMode, announceMessage, settings.highContrast, settings.largeText]);

  // Crisis-specific announcements
  useEffect(() => {
    if (crisisLevel === 'crisis') {
      announceMessage('Crisis support mode active. You are safe. Help is available.', 'emergency');
    } else if (crisisLevel === 'elevated') {
      announceMessage('Enhanced support mode active. Additional resources available.', 'high');
    }
  }, [crisisLevel, announceMessage]);

  return (
    <div className="crisis-accessibility-container">
      {/* Screen reader optimized announcements */}
      <div
        ref={announcementRef}
        id="crisis-announcements"
        className="sr-only"
        aria-live={crisisLevel === 'crisis' ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        {screenReader.announcements[screenReader.announcements.length - 1]}
      </div>

      {/* Emergency accessibility panel */}
      <AnimatePresence>
        {emergencyAccessMode && (
          <motion.div
            className="emergency-access-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
          >
            <h2 className="panel-title">Emergency Accessibility Controls</h2>
            <div className="control-grid">
              <button
                className="access-control"
                onClick={() => setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                aria-pressed={settings.highContrast}
              >
                <span className="control-icon" aria-hidden="true">🔆</span>
                <span>High Contrast</span>
              </button>
              
              <button
                className="access-control"
                onClick={() => setSettings(prev => ({ ...prev, largeText: !prev.largeText }))}
                aria-pressed={settings.largeText}
              >
                <span className="control-icon" aria-hidden="true">🔍</span>
                <span>Large Text</span>
              </button>
              
              <button
                className="access-control"
                onClick={() => setSettings(prev => ({ ...prev, voicePrompts: !prev.voicePrompts }))}
                aria-pressed={settings.voicePrompts}
              >
                <span className="control-icon" aria-hidden="true">🔊</span>
                <span>Voice Prompts</span>
              </button>
              
              <button
                className="access-control crisis-help"
                onClick={() => window.location.href = '/crisis-resources'}
              >
                <span className="control-icon" aria-hidden="true">🆘</span>
                <span>Crisis Help</span>
              </button>
            </div>
            
            <button
              className="close-panel"
              onClick={toggleEmergencyAccessMode}
              aria-label="Close emergency accessibility panel"
            >
              Close Panel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content with accessibility enhancements */}
      <div 
        ref={focusManagerRef}
        className="accessible-content"
        role="main"
        aria-label="Main application content"
      >
        {children}
      </div>

      {/* Floating accessibility button */}
      <button
        className="accessibility-toggle"
        onClick={toggleEmergencyAccessMode}
        aria-label="Toggle emergency accessibility controls"
        title="Press Ctrl+Alt+A to toggle accessibility controls"
      >
        <span className="toggle-icon" aria-hidden="true">♿</span>
        <span className="sr-only">Accessibility Options</span>
      </button>

      {/* Skip links for keyboard navigation */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#crisis-resources" className="skip-link">Skip to crisis resources</a>
        <a href="#navigation" className="skip-link">Skip to navigation</a>
      </div>

      <style jsx>{`
        .crisis-accessibility-container {
          position: relative;
          min-height: 100vh;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .emergency-access-panel {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          border: 2px solid #4A90E2;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          max-width: 400px;
          width: 90vw;
        }

        .panel-title {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          color: #333;
        }

        .control-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .access-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          background: #f9f9f9;
          cursor: pointer;
          font-size: 14px;
          min-height: 80px;
          transition: all 0.2s ease;
        }

        .access-control:hover,
        .access-control:focus {
          border-color: #4A90E2;
          background: #f0f8ff;
          transform: translateY(-2px);
        }

        .access-control[aria-pressed="true"] {
          background: #4A90E2;
          color: white;
          border-color: #4A90E2;
        }

        .access-control.crisis-help {
          background: #ff4444;
          color: white;
          border-color: #ff4444;
        }

        .access-control.crisis-help:hover {
          background: #ff3333;
        }

        .control-icon {
          font-size: 24px;
          line-height: 1;
        }

        .close-panel {
          width: 100%;
          padding: 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .close-panel:hover {
          background: #5a6268;
        }

        .accessible-content {
          min-height: 100vh;
          padding-bottom: 80px; /* Space for floating button */
        }

        .accessibility-toggle {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #4A90E2;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
          z-index: 1000;
          transition: all 0.2s ease;
        }

        .accessibility-toggle:hover,
        .accessibility-toggle:focus {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
        }

        .accessibility-toggle:focus {
          outline: 3px solid rgba(74, 144, 226, 0.5);
          outline-offset: 2px;
        }

        .toggle-icon {
          font-size: 24px;
          line-height: 1;
        }

        .skip-links {
          position: absolute;
          top: -100px;
          left: 0;
          z-index: 10001;
        }

        .skip-link {
          position: absolute;
          top: -100px;
          left: 8px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 0 0 4px 4px;
          transition: top 0.2s ease;
        }

        .skip-link:focus {
          top: 0;
        }

        /* High contrast mode styles */
        :global(.high-contrast-mode) {
          filter: contrast(2);
        }

        :global(.high-contrast-mode) .emergency-access-panel {
          background: #000;
          color: #fff;
          border-color: #fff;
        }

        :global(.high-contrast-mode) .access-control {
          background: #000;
          color: #fff;
          border-color: #fff;
        }

        :global(.high-contrast-mode) .access-control:hover {
          background: #fff;
          color: #000;
        }

        /* Large text mode styles */
        :global(.large-text-mode) {
          font-size: 120%;
        }

        :global(.large-text-mode) .panel-title {
          font-size: 22px;
        }

        :global(.large-text-mode) .access-control {
          font-size: 16px;
          min-height: 100px;
        }

        :global(.large-text-mode) .control-icon {
          font-size: 28px;
        }

        /* Reduced motion mode */
        :global(.reduced-motion-mode) * {
          animation: none !important;
          transition: none !important;
        }

        /* Screen reader optimized mode */
        :global(.screen-reader-optimized) {
          focus-outline-color: #ff0000;
        }

        :global(.screen-reader-optimized) *:focus {
          outline: 3px solid #ff0000 !important;
          outline-offset: 2px;
        }

        /* Enhanced focus mode */
        :global(.enhanced-focus) *:focus {
          outline: 4px solid #4A90E2 !important;
          outline-offset: 3px;
          box-shadow: 0 0 0 6px rgba(74, 144, 226, 0.2) !important;
        }

        /* Simplified interface mode */
        :global(.simplified-interface) {
          font-family: Arial, sans-serif;
        }

        :global(.simplified-interface) * {
          border-radius: 4px !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }

        :global(.simplified-interface) button,
        :global(.simplified-interface) a {
          min-height: 64px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          padding: 16px !important;
        }

        /* Emergency access mode */
        :global(.emergency-access-mode) {
          background: #1a1a1a !important;
          color: #ffffff !important;
        }

        :global(.emergency-access-mode) button {
          min-height: 72px !important;
          font-size: 20px !important;
        }

        /* Mobile optimizations */
        @media (max-width: 480px) {
          .emergency-access-panel {
            top: 10px;
            padding: 16px;
            width: 95vw;
          }

          .control-grid {
            grid-template-columns: 1fr;
          }

          .access-control {
            min-height: 60px;
          }
        }

        /* Color blind support */
        :global(.color-blind-support) {
          --success-color: #0066cc;
          --warning-color: #ff6600;
          --error-color: #cc0000;
        }

        /* Voice prompt indicators */
        :global(.voice-prompts-enabled) .accessibility-toggle::after {
          content: '🎤';
          position: absolute;
          top: -8px;
          right: -8px;
          background: #28a745;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default CrisisAccessibility;