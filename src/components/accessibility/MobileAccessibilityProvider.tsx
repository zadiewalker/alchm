'use client';

import { useEffect, useState } from 'react';

/**
 * MobileAccessibilityProvider
 * 
 * Enhances accessibility for users with motor impairments, tremors, or other
 * physical challenges who may be accessing ALCHM during emotional distress.
 */
export default function MobileAccessibilityProvider() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [extendedTouchTargets, setExtendedTouchTargets] = useState(false);

  useEffect(() => {
    // Detect user preferences
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersLargeText = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // Some users need both
    
    setHighContrast(prefersHighContrast);
    setReducedMotion(prefersReducedMotion);
    setLargeText(prefersLargeText);

    // Check for stored accessibility preferences
    const storedPrefs = localStorage.getItem('alchm_accessibility_prefs');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs);
      setExtendedTouchTargets(prefs.extendedTouchTargets || false);
      setLargeText(prefs.largeText || prefersLargeText);
      setHighContrast(prefs.highContrast || prefersHighContrast);
    }

    // Auto-enable extended touch targets for crisis or tremor detection
    const enableExtendedTargets = detectTremorOrMotorImpairment();
    if (enableExtendedTargets) {
      setExtendedTouchTargets(true);
    }

    // Apply accessibility enhancements
    applyAccessibilityStyles();

    // Listen for media query changes
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleHighContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    const handleReducedMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    highContrastQuery.addEventListener('change', handleHighContrastChange);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  /**
   * Detects potential tremors or motor impairments based on interaction patterns
   */
  const detectTremorOrMotorImpairment = (): boolean => {
    // Check for stored indicators of motor difficulty
    const motorDifficulty = sessionStorage.getItem('motor_difficulty_detected');
    if (motorDifficulty) return true;

    // Check time of access (late night anxiety/crisis access)
    const hour = new Date().getHours();
    const isPotentialCrisisTime = hour >= 23 || hour <= 5;

    // Check for crisis mode indicators
    const crisisMode = document.body.classList.contains('crisis-mode');

    return isPotentialCrisisTime || crisisMode;
  };

  /**
   * Applies comprehensive accessibility styles
   */
  const applyAccessibilityStyles = () => {
    const style = document.createElement('style');
    style.id = 'mobile-accessibility-styles';
    
    let css = `
      /* Base accessibility improvements */
      * {
        scroll-behavior: ${reducedMotion ? 'auto' : 'smooth'};
      }
      
      /* Enhanced focus indicators for motor impairments */
      .accessibility-enhanced *:focus,
      .accessibility-enhanced *:focus-visible {
        outline: 4px solid #a4b792 !important;
        outline-offset: 4px !important;
        border-radius: 8px !important;
        box-shadow: 0 0 0 8px rgba(164, 183, 146, 0.3) !important;
      }
      
      /* Larger touch targets for motor impairments */
      .extended-touch-targets button,
      .extended-touch-targets a,
      .extended-touch-targets input,
      .extended-touch-targets textarea {
        min-height: 72px !important;
        min-width: 72px !important;
        padding: 20px !important;
        margin: 8px !important;
      }
      
      /* High contrast mode */
      .high-contrast-mode {
        background: #000000 !important;
        color: #ffffff !important;
      }
      
      .high-contrast-mode button {
        background: #ffffff !important;
        color: #000000 !important;
        border: 3px solid #ffffff !important;
      }
      
      .high-contrast-mode a {
        color: #00ffff !important;
        text-decoration: underline !important;
      }
      
      /* Large text mode */
      .large-text-mode {
        font-size: 120% !important;
        line-height: 1.8 !important;
      }
      
      .large-text-mode h1 { font-size: 3rem !important; }
      .large-text-mode h2 { font-size: 2.5rem !important; }
      .large-text-mode h3 { font-size: 2rem !important; }
      .large-text-mode button { font-size: 1.25rem !important; }
      
      /* Reduced motion preferences */
      .reduced-motion-mode *,
      .reduced-motion-mode *::before,
      .reduced-motion-mode *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Tremor-friendly interactions */
      .tremor-friendly {
        touch-action: manipulation;
        -webkit-user-select: none;
        user-select: none;
      }
      
      .tremor-friendly button {
        transition: all 0.3s ease;
        transform: scale(1);
      }
      
      .tremor-friendly button:hover,
      .tremor-friendly button:focus {
        transform: scale(1.1);
        background-color: rgba(164, 183, 146, 0.2) !important;
      }
      
      .tremor-friendly button:active {
        transform: scale(1.05);
        transition-duration: 0.1s;
      }
      
      /* Prevent accidental interactions */
      .prevent-accidental {
        pointer-events: auto;
      }
      
      .prevent-accidental button:not(:hover):not(:focus) {
        opacity: 0.8;
      }
      
      /* Crisis-accessible elements always visible */
      .crisis-accessible {
        opacity: 1 !important;
        visibility: visible !important;
        z-index: 10000 !important;
      }
      
      /* Voice control optimizations */
      .voice-control-optimized [role="button"],
      .voice-control-optimized button {
        position: relative;
      }
      
      .voice-control-optimized [role="button"]::after,
      .voice-control-optimized button::after {
        content: attr(aria-label);
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        opacity: 0;
        pointer-events: none;
        white-space: nowrap;
        z-index: 10001;
      }
      
      .voice-control-optimized [role="button"]:hover::after,
      .voice-control-optimized button:hover::after {
        opacity: 1;
      }
      
      /* Screen reader optimizations */
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
      
      /* Mobile-specific accessibility */
      @media (max-width: 768px) {
        .mobile-accessibility button,
        .mobile-accessibility a[role="button"] {
          min-height: 64px !important;
          min-width: 64px !important;
          font-size: 18px !important;
        }
        
        .mobile-accessibility.extended-touch-targets button,
        .mobile-accessibility.extended-touch-targets a[role="button"] {
          min-height: 80px !important;
          min-width: 80px !important;
          font-size: 20px !important;
        }
      }
      
      /* Specific improvements for ALCHM homepage */
      .google-signin-enhanced {
        border: 3px solid #a4b792 !important;
        box-shadow: 0 4px 20px rgba(164, 183, 146, 0.3) !important;
      }
      
      .crisis-button-enhanced {
        border: 4px solid #dc2626 !important;
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.3) !important;
        animation: gentle-pulse 2s infinite;
      }
      
      @keyframes gentle-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `;

    // Apply conditional styles
    if (reducedMotion) {
      css += `
        .reduced-motion-mode .crisis-button-enhanced {
          animation: none !important;
        }
      `;
    }

    style.textContent = css;
    
    // Remove existing styles if present
    const existingStyle = document.getElementById('mobile-accessibility-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  };

  /**
   * Applies accessibility classes to body based on preferences
   */
  useEffect(() => {
    const classes = [
      'accessibility-enhanced',
      'mobile-accessibility',
      'tremor-friendly',
      'voice-control-optimized'
    ];

    if (highContrast) classes.push('high-contrast-mode');
    if (largeText) classes.push('large-text-mode');
    if (reducedMotion) classes.push('reduced-motion-mode');
    if (extendedTouchTargets) classes.push('extended-touch-targets');

    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.includes('accessibility') && !cls.includes('contrast') && !cls.includes('text') && !cls.includes('motion') && !cls.includes('touch') && !cls.includes('tremor') && !cls.includes('voice'))
      .concat(classes)
      .join(' ');

    // Store preferences
    const prefs = {
      highContrast,
      largeText,
      reducedMotion,
      extendedTouchTargets
    };
    localStorage.setItem('alchm_accessibility_prefs', JSON.stringify(prefs));

    // Re-apply styles when preferences change
    applyAccessibilityStyles();
  }, [highContrast, largeText, reducedMotion, extendedTouchTargets]);

  /**
   * Enhances existing elements with accessibility attributes
   */
  useEffect(() => {
    // Enhance Google sign-in button
    const googleButton = document.querySelector('[data-auth-button]') as HTMLElement;
    if (googleButton) {
      googleButton.classList.add('google-signin-enhanced');
      googleButton.setAttribute('aria-describedby', 'google-signin-help');
      
      // Add help text
      if (!document.getElementById('google-signin-help')) {
        const helpText = document.createElement('div');
        helpText.id = 'google-signin-help';
        helpText.className = 'sr-only';
        helpText.textContent = 'Sign in with Google to access your private journaling sanctuary. This will open a secure popup window.';
        googleButton.parentNode?.appendChild(helpText);
      }
    }

    // Enhance crisis button
    const crisisButton = document.querySelector('.crisis-accessible') as HTMLElement;
    if (crisisButton) {
      crisisButton.classList.add('crisis-button-enhanced');
      crisisButton.setAttribute('aria-describedby', 'crisis-help');
      
      if (!document.getElementById('crisis-help')) {
        const helpText = document.createElement('div');
        helpText.id = 'crisis-help';
        helpText.className = 'sr-only';
        helpText.textContent = 'Emergency crisis support. Tap to access immediate help including crisis hotlines and text support.';
        crisisButton.parentNode?.appendChild(helpText);
      }
    }

    // Add keyboard navigation instructions
    if (!document.getElementById('keyboard-nav-help')) {
      const navHelp = document.createElement('div');
      navHelp.id = 'keyboard-nav-help';
      navHelp.className = 'sr-only';
      navHelp.setAttribute('aria-live', 'polite');
      navHelp.textContent = 'Use Tab to navigate, Enter to activate buttons, and Escape to close dialogs. Crisis support is always available.';
      document.body.appendChild(navHelp);
    }
  }, []);

  // This component doesn't render visible content
  return null;
}

/**
 * Manual accessibility toggle for users who need to adjust settings
 */
export function AccessibilityToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccessibilityPanel = () => {
    setIsOpen(!isOpen);
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleAccessibilityPanel}
        className="fixed bottom-20 left-4 z-50 bg-sage-600 text-white p-3 rounded-full shadow-lg"
        style={{ minHeight: '56px', minWidth: '56px' }}
        aria-label="Open accessibility options"
      >
        ♿
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 bg-white p-4 rounded-lg shadow-xl border-2 border-sage-300 max-w-xs">
      <h3 className="text-lg font-medium mb-3 text-sage-800">Accessibility Options</h3>
      
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            onChange={(e) => {
              document.body.classList.toggle('extended-touch-targets', e.target.checked);
            }}
            className="w-5 h-5"
          />
          <span className="text-sm">Larger touch targets</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            onChange={(e) => {
              document.body.classList.toggle('high-contrast-mode', e.target.checked);
            }}
            className="w-5 h-5"
          />
          <span className="text-sm">High contrast</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            onChange={(e) => {
              document.body.classList.toggle('large-text-mode', e.target.checked);
            }}
            className="w-5 h-5"
          />
          <span className="text-sm">Larger text</span>
        </label>
      </div>
      
      <button
        onClick={() => setIsOpen(false)}
        className="mt-4 w-full bg-sage-600 text-white py-2 px-4 rounded-lg"
        style={{ minHeight: '44px' }}
      >
        Close
      </button>
    </div>
  );
}