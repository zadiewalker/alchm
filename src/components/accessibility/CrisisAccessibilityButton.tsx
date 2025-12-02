'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Crisis Accessibility Button Component
 * 
 * Enhanced crisis button with comprehensive accessibility features for users with disabilities
 * during emergency mental health situations. Designed to work with all assistive technologies.
 */

interface CrisisAccessibilityButtonProps {
  onActivate: () => void;
  position?: 'fixed' | 'static';
  size?: 'default' | 'large' | 'emergency';
  variant?: 'crisis' | 'emergency' | 'support';
  showText?: boolean;
  customText?: string;
  ariaLabel?: string;
  emergencyNumber?: string;
  className?: string;
}

export function CrisisAccessibilityButton({
  onActivate,
  position = 'fixed',
  size = 'emergency',
  variant = 'crisis',
  showText = true,
  customText,
  ariaLabel,
  emergencyNumber = '988',
  className = '',
}: CrisisAccessibilityButtonProps) {
  const { settings, announceToScreenReader, enableEmergencyMode } = useAccessibility();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [lastPressTime, setLastPressTime] = useState(0);

  // Auto-pulse in crisis mode for visibility
  useEffect(() => {
    if (settings.crisisMode || settings.emergencyMode) {
      const interval = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [settings.crisisMode, settings.emergencyMode]);

  // Enhanced activation logic with multiple triggers
  const handleActivation = (event?: React.MouseEvent | React.KeyboardEvent | React.TouchEvent) => {
    const currentTime = Date.now();
    
    // Double-tap protection (prevent accidental activation)
    if (currentTime - lastPressTime < 300) {
      setPressCount(prev => prev + 1);
    } else {
      setPressCount(1);
    }
    
    setLastPressTime(currentTime);

    // Immediate activation for emergency scenarios
    if (variant === 'emergency' || settings.emergencyMode || pressCount >= 2) {
      enableEmergencyMode();
      onActivate();
      
      // Announce activation
      announceToScreenReader(
        'Emergency support activated. Crisis resources loading immediately.',
        'assertive'
      );
      
      // Vibration feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } else {
      // Single press for crisis mode
      onActivate();
      announceToScreenReader(
        'Crisis support activated. Getting help resources ready.',
        'assertive'
      );
      
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }

    // Visual feedback
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1500);
  };

  // Keyboard event handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Multiple key triggers for accessibility
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Escape' ||
      (event.key === 'h' && (event.ctrlKey || event.metaKey)) ||
      (event.key === 'e' && event.altKey)
    ) {
      event.preventDefault();
      event.stopPropagation();
      handleActivation(event);
    }
  };

  // Long press for mobile accessibility
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleTouchStart = (event: React.TouchEvent) => {
    const timer = setTimeout(() => {
      handleActivation(event);
      announceToScreenReader(
        'Long press detected. Emergency support activated.',
        'assertive'
      );
    }, 1000);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Focus management for crisis scenarios
  useEffect(() => {
    if (settings.emergencyMode && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [settings.emergencyMode]);

  // Determine button styling based on variant and settings
  const getButtonStyling = () => {
    const baseClasses = [
      'crisis-accessibility-button',
      'focus-ring',
      'transition-all duration-200',
      'font-bold',
      'border-2',
      'rounded-lg',
      'flex items-center justify-center gap-2',
      'select-none',
      'relative',
      'overflow-hidden',
    ];

    // Size classes
    if (size === 'emergency' || settings.emergencyMode) {
      baseClasses.push('touch-target-emergency', 'text-xl', 'px-6 py-4');
    } else if (size === 'large' || settings.crisisMode) {
      baseClasses.push('touch-target-crisis', 'text-lg', 'px-4 py-3');
    } else {
      baseClasses.push('touch-target-comfortable', 'text-base', 'px-3 py-2');
    }

    // Color and variant classes
    if (variant === 'emergency' || settings.emergencyMode) {
      baseClasses.push(
        'bg-red-600 hover:bg-red-700 focus:bg-red-700',
        'text-white border-red-800',
        'shadow-lg hover:shadow-xl'
      );
    } else if (variant === 'crisis' || settings.crisisMode) {
      baseClasses.push(
        'bg-orange-500 hover:bg-orange-600 focus:bg-orange-600',
        'text-white border-orange-700',
        'shadow-md hover:shadow-lg'
      );
    } else {
      baseClasses.push(
        'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600',
        'text-white border-blue-700',
        'shadow-sm hover:shadow-md'
      );
    }

    // Position classes
    if (position === 'fixed') {
      baseClasses.push(
        'fixed bottom-6 right-6 z-50',
        'md:bottom-8 md:right-8'
      );
    }

    // Animation classes
    if (isPulsing) {
      baseClasses.push('animate-pulse');
    }

    // High contrast mode adjustments
    if (settings.contrast === 'high' || settings.contrast === 'crisis') {
      baseClasses.push('border-4', 'font-black');
    }

    return baseClasses.join(' ');
  };

  // Determine button text
  const getButtonText = () => {
    if (customText) return customText;
    
    if (variant === 'emergency' || settings.emergencyMode) {
      return `Emergency ${emergencyNumber}`;
    } else if (variant === 'crisis' || settings.crisisMode) {
      return 'Get Crisis Help';
    } else {
      return 'Support';
    }
  };

  // Get appropriate icon
  const getIcon = () => {
    if (variant === 'emergency' || settings.emergencyMode) {
      return '🚨';
    } else if (variant === 'crisis' || settings.crisisMode) {
      return '🆘';
    } else {
      return '💙';
    }
  };

  const buttonClasses = getButtonStyling();
  const buttonText = getButtonText();
  const icon = getIcon();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleActivation}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`${buttonClasses} ${className}`}
        aria-label={ariaLabel || `${buttonText}. Press Enter, Space, or Escape to activate crisis support. Double-tap for immediate emergency assistance.`}
        aria-describedby="crisis-button-description"
        aria-expanded="false"
        aria-haspopup="dialog"
        role="button"
        tabIndex={0}
        data-crisis-button="true"
        data-emergency-contact={variant === 'emergency'}
      >
        {/* Icon */}
        <span 
          aria-hidden="true" 
          className="text-2xl"
          role="img"
          aria-label={variant === 'emergency' ? 'Emergency alert' : 'Crisis support'}
        >
          {icon}
        </span>

        {/* Text */}
        {showText && (
          <span className="font-bold tracking-wide">
            {buttonText}
          </span>
        )}

        {/* Pulse overlay for crisis mode */}
        {(settings.crisisMode || settings.emergencyMode) && (
          <div 
            className={`
              absolute inset-0 rounded-lg
              ${isPulsing ? 'animate-ping bg-white opacity-20' : ''}
            `}
            aria-hidden="true"
          />
        )}

        {/* Loading indicator for emergency mode */}
        {settings.emergencyMode && (
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* Hidden description for screen readers */}
      <div id="crisis-button-description" className="sr-only">
        Crisis support button. Multiple ways to activate:
        Click or tap to activate crisis support.
        Press Enter, Space, or Escape key to activate.
        Use Control+H or Alt+E keyboard shortcuts.
        Long press for 1 second to activate emergency mode.
        Double-tap for immediate emergency assistance.
        {settings.emergencyMode && 
          ` Emergency mode is currently active with ${emergencyNumber} suicide prevention lifeline.`
        }
      </div>

      {/* Global keyboard shortcut listener */}
      <div className="sr-only">
        <div role="region" aria-label="Crisis support keyboard shortcuts">
          <p>Global shortcuts available anywhere on the page:</p>
          <ul>
            <li>Control+H or Command+H: Activate crisis help</li>
            <li>Alt+E: Emergency activation</li>
            <li>Escape key when focused: Quick activation</li>
          </ul>
        </div>
      </div>

      {/* Crisis mode announcement */}
      {(settings.crisisMode || settings.emergencyMode) && (
        <div className="sr-only" aria-live="polite">
          {settings.emergencyMode 
            ? 'Emergency mode active. Crisis resources immediately available.'
            : 'Crisis support mode active. Enhanced accessibility enabled.'
          }
        </div>
      )}
    </>
  );
}

/**
 * Floating Crisis Button
 * 
 * Always-visible floating crisis button with enhanced accessibility.
 */
export function FloatingCrisisButton() {
  const { settings } = useAccessibility();
  const [isVisible, setIsVisible] = useState(true);

  const handleCrisisActivation = () => {
    // Navigate to crisis resources
    window.location.href = '/crisis-resources';
  };

  // Auto-show in crisis situations
  useEffect(() => {
    setIsVisible(true);
  }, [settings.crisisMode, settings.emergencyMode]);

  if (!isVisible) return null;

  return (
    <CrisisAccessibilityButton
      onActivate={handleCrisisActivation}
      position="fixed"
      size={settings.emergencyMode ? 'emergency' : 'large'}
      variant={settings.emergencyMode ? 'emergency' : 'crisis'}
      emergencyNumber="988"
      ariaLabel="Get immediate crisis support and mental health resources"
    />
  );
}

export default CrisisAccessibilityButton;