'use client';

import React, { useEffect, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Trauma-Informed Motion Controls
 * 
 * Manages motion and animations with special consideration for trauma survivors
 * who may experience motion sensitivity, seizures, or vestibular disorders.
 */

interface MotionPreferences {
  reduceMotion: boolean;
  disableParallax: boolean;
  limitFlashing: boolean;
  reduceTransitions: boolean;
  disableAutoplay: boolean;
  pauseAnimations: boolean;
  respectSystemSettings: boolean;
}

interface TraumaInformedMotionControlsProps {
  children: React.ReactNode;
  enableMotionDetection?: boolean;
  crisisMotionReduction?: boolean;
}

export function TraumaInformedMotionControls({
  children,
  enableMotionDetection = true,
  crisisMotionReduction = true,
}: TraumaInformedMotionControlsProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const [motionPreferences, setMotionPreferences] = useState<MotionPreferences>({
    reduceMotion: false,
    disableParallax: false,
    limitFlashing: false,
    reduceTransitions: false,
    disableAutoplay: false,
    pauseAnimations: false,
    respectSystemSettings: true,
  });

  const [hasMotionSensitivity, setHasMotionSensitivity] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);

  // Detect system motion preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)');
      
      setMotionPreferences(prev => ({
        ...prev,
        reduceMotion: prefersReducedMotion.matches,
        disableAutoplay: prefersReducedData.matches,
      }));

      if (prefersReducedMotion.matches) {
        setHasMotionSensitivity(true);
        announceToScreenReader(
          'Motion reduction detected. Animations will be minimized for your comfort.',
          'polite'
        );
      }
    };

    detectSystemPreferences();

    // Listen for changes in system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => detectSystemPreferences();
    
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    } else {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      } else {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [announceToScreenReader]);

  // Crisis mode motion adjustments
  useEffect(() => {
    if (settings.crisisMode || settings.emergencyMode) {
      setMotionPreferences(prev => ({
        ...prev,
        reduceMotion: true,
        disableParallax: true,
        limitFlashing: true,
        reduceTransitions: true,
        disableAutoplay: true,
        pauseAnimations: crisisMotionReduction,
      }));

      setHasMotionSensitivity(true);
      
      announceToScreenReader(
        'Crisis mode detected. All motion and animations have been reduced for safety.',
        'assertive'
      );
    }
  }, [settings.crisisMode, settings.emergencyMode, crisisMotionReduction, announceToScreenReader]);

  // Apply motion control styles to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing motion classes
    root.classList.remove(
      'motion-reduce',
      'motion-safe',
      'animations-paused',
      'parallax-disabled',
      'transitions-minimal',
      'flashing-limited',
      'autoplay-disabled',
      'motion-sensitivity-active'
    );

    // Apply current preferences
    if (motionPreferences.reduceMotion || hasMotionSensitivity) {
      root.classList.add('motion-reduce');
      
      if (motionPreferences.pauseAnimations || motionPaused) {
        root.classList.add('animations-paused');
      }
      
      if (motionPreferences.disableParallax) {
        root.classList.add('parallax-disabled');
      }
      
      if (motionPreferences.reduceTransitions) {
        root.classList.add('transitions-minimal');
      }
      
      if (motionPreferences.limitFlashing) {
        root.classList.add('flashing-limited');
      }
      
      if (motionPreferences.disableAutoplay) {
        root.classList.add('autoplay-disabled');
      }
      
      root.classList.add('motion-sensitivity-active');
    } else {
      root.classList.add('motion-safe');
    }

    // Apply CSS custom properties for motion control
    root.style.setProperty(
      '--motion-duration',
      motionPreferences.reduceMotion ? '0.01ms' : '300ms'
    );
    
    root.style.setProperty(
      '--motion-distance',
      motionPreferences.reduceMotion ? '0px' : '10px'
    );
    
    root.style.setProperty(
      '--transition-duration',
      motionPreferences.reduceTransitions ? '0.1s' : '0.3s'
    );

  }, [motionPreferences, hasMotionSensitivity, motionPaused]);

  // Pause/resume all animations
  const toggleAnimations = () => {
    const newPausedState = !motionPaused;
    setMotionPaused(newPausedState);
    
    // Apply to all animated elements
    const animatedElements = document.querySelectorAll('*');
    animatedElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.animationPlayState = newPausedState ? 'paused' : 'running';
      }
    });

    announceToScreenReader(
      newPausedState ? 'All animations paused' : 'Animations resumed',
      'polite'
    );
  };

  // Motion sensitivity detector
  useEffect(() => {
    if (!enableMotionDetection) return;

    let motionEventCount = 0;
    let scrollEventCount = 0;
    const motionThreshold = 50; // Events per second
    const scrollThreshold = 30;

    const checkMotionSensitivity = () => {
      if (motionEventCount > motionThreshold || scrollEventCount > scrollThreshold) {
        if (!hasMotionSensitivity) {
          setHasMotionSensitivity(true);
          setMotionPreferences(prev => ({
            ...prev,
            reduceMotion: true,
            pauseAnimations: true,
          }));
          
          announceToScreenReader(
            'High motion activity detected. Reducing animations to prevent discomfort.',
            'polite'
          );
        }
      }
      
      // Reset counters
      motionEventCount = 0;
      scrollEventCount = 0;
    };

    const handleScroll = () => {
      scrollEventCount++;
    };

    const handleDeviceMotion = () => {
      motionEventCount++;
    };

    // Set up detection
    const interval = setInterval(checkMotionSensitivity, 1000);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [enableMotionDetection, hasMotionSensitivity, announceToScreenReader]);

  return (
    <div className="trauma-informed-motion-container">
      {/* Motion Control Panel */}
      <MotionControlPanel
        preferences={motionPreferences}
        onPreferencesChange={setMotionPreferences}
        onToggleAnimations={toggleAnimations}
        animationsPaused={motionPaused}
        hasMotionSensitivity={hasMotionSensitivity}
      />

      {/* Main Content */}
      <div className={`motion-controlled-content ${hasMotionSensitivity ? 'motion-sensitive' : ''}`}>
        {children}
      </div>

      {/* Motion Emergency Stop */}
      {(settings.crisisMode || hasMotionSensitivity) && (
        <MotionEmergencyStop onEmergencyStop={toggleAnimations} isPaused={motionPaused} />
      )}
    </div>
  );
}

/**
 * Motion Control Panel Component
 */
interface MotionControlPanelProps {
  preferences: MotionPreferences;
  onPreferencesChange: (preferences: MotionPreferences) => void;
  onToggleAnimations: () => void;
  animationsPaused: boolean;
  hasMotionSensitivity: boolean;
}

function MotionControlPanel({
  preferences,
  onPreferencesChange,
  onToggleAnimations,
  animationsPaused,
  hasMotionSensitivity,
}: MotionControlPanelProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const updatePreference = (key: keyof MotionPreferences, value: boolean) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  if (!isPanelOpen && !hasMotionSensitivity) {
    return (
      <button
        type="button"
        onClick={() => setIsPanelOpen(true)}
        className="fixed top-4 right-4 z-40 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus-ring"
        aria-label="Open motion controls"
      >
        <span aria-hidden="true">🎭</span>
      </button>
    );
  }

  return (
    <div className="motion-control-panel fixed top-4 right-4 z-40 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span aria-hidden="true">🎭</span>
          Motion Controls
        </h3>
        {!hasMotionSensitivity && (
          <button
            type="button"
            onClick={() => setIsPanelOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close motion controls"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {hasMotionSensitivity && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-sm">
          <div className="flex items-center gap-2 text-yellow-800">
            <span aria-hidden="true">⚠️</span>
            <span className="font-medium">Motion sensitivity detected</span>
          </div>
          <p className="text-yellow-700 text-xs mt-1">
            Animations have been automatically reduced for your comfort.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {/* Emergency pause/play */}
        <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
          <span className="font-medium text-red-900">Emergency Stop</span>
          <button
            type="button"
            onClick={onToggleAnimations}
            className={`
              px-3 py-1 rounded font-medium text-sm focus-ring
              ${animationsPaused 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
          >
            {animationsPaused ? 'Resume' : 'Pause All'}
          </button>
        </div>

        {/* Motion preferences */}
        <div className="space-y-2">
          <MotionToggle
            label="Reduce motion"
            checked={preferences.reduceMotion}
            onChange={(checked) => updatePreference('reduceMotion', checked)}
            description="Minimizes movement and transitions"
          />
          
          <MotionToggle
            label="Disable parallax"
            checked={preferences.disableParallax}
            onChange={(checked) => updatePreference('disableParallax', checked)}
            description="Removes background scrolling effects"
          />
          
          <MotionToggle
            label="Limit flashing"
            checked={preferences.limitFlashing}
            onChange={(checked) => updatePreference('limitFlashing', checked)}
            description="Reduces rapid color changes"
          />
          
          <MotionToggle
            label="Minimal transitions"
            checked={preferences.reduceTransitions}
            onChange={(checked) => updatePreference('reduceTransitions', checked)}
            description="Shortens animation durations"
          />
          
          <MotionToggle
            label="Disable autoplay"
            checked={preferences.disableAutoplay}
            onChange={(checked) => updatePreference('disableAutoplay', checked)}
            description="Prevents automatic video/animation start"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Motion Toggle Component
 */
interface MotionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

function MotionToggle({ label, checked, onChange, description }: MotionToggleProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 focus-ring"
      />
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-600">{description}</div>
        )}
      </div>
    </label>
  );
}

/**
 * Motion Emergency Stop Component
 */
interface MotionEmergencyStopProps {
  onEmergencyStop: () => void;
  isPaused: boolean;
}

function MotionEmergencyStop({ onEmergencyStop, isPaused }: MotionEmergencyStopProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after 10 seconds unless in crisis mode
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 focus-ring"
        aria-label="Show motion emergency controls"
      >
        <span aria-hidden="true">🛑</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onEmergencyStop}
          className={`
            px-4 py-2 rounded font-bold text-sm focus-ring
            ${isPaused 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-white text-red-600 hover:bg-gray-100'
            }
          `}
          aria-describedby="emergency-stop-description"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">{isPaused ? '▶️' : '⏸️'}</span>
            <span>{isPaused ? 'Resume' : 'STOP'}</span>
          </span>
        </button>
        
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-red-200 hover:text-white p-1"
          aria-label="Hide emergency controls"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      
      <div id="emergency-stop-description" className="text-xs text-red-200 mt-1">
        Emergency motion control for motion sensitivity
      </div>
    </div>
  );
}

/**
 * CSS Motion Control Styles (to be added to CSS)
 */
export const MotionControlStyles = `
/* Trauma-Informed Motion Controls */

/* Motion Reduce - Respect user preferences */
.motion-reduce *,
.motion-reduce *::before,
.motion-reduce *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

/* Preserve essential animations for safety */
.motion-reduce .emergency-pulse,
.motion-reduce .crisis-indicator,
.motion-reduce [data-critical-animation] {
  animation-duration: 1s !important;
}

/* Animations Paused State */
.animations-paused * {
  animation-play-state: paused !important;
}

/* Parallax Disabled */
.parallax-disabled [data-parallax] {
  transform: none !important;
}

/* Transitions Minimal */
.transitions-minimal * {
  transition-duration: 0.1s !important;
}

/* Flashing Limited */
.flashing-limited [data-flashing],
.flashing-limited .strobe,
.flashing-limited .blink {
  animation: none !important;
}

/* Autoplay Disabled */
.autoplay-disabled video,
.autoplay-disabled audio {
  autoplay: false !important;
}

/* Motion Sensitivity Active */
.motion-sensitivity-active {
  --motion-safe: 0;
  --motion-reduce: 1;
}

.motion-safe {
  --motion-safe: 1;
  --motion-reduce: 0;
}

/* Responsive motion controls */
@media (prefers-reduced-motion: reduce) {
  .motion-controlled-content *,
  .motion-controlled-content *::before,
  .motion-controlled-content *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Maintain emergency indicators */
  .crisis-pulse,
  .emergency-indicator {
    animation-duration: 1s !important;
  }
}

/* Vestibular disorder considerations */
@media (prefers-reduced-motion: reduce) {
  .parallax,
  [data-parallax],
  .parallax-element {
    transform: none !important;
  }
  
  .zoom-animation,
  .scale-animation {
    transform: none !important;
  }
  
  .rotation-animation {
    transform: none !important;
  }
}
`;

export default TraumaInformedMotionControls;