'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePerformanceTier } from '@/lib/mobilePerformanceManager';

interface TraumaInformedMobileUXProps {
  children: React.ReactNode;
  enableCrisisDetection?: boolean;
  enableEmergencyMode?: boolean;
}

/**
 * TraumaInformedMobileUX - Comprehensive mobile wrapper for trauma-sensitive interactions
 * 
 * Features:
 * - Crisis detection and emergency mode activation
 * - Battery-aware performance optimization
 * - Tremor-compensation for touch interactions
 * - Dissociation-aware UI adjustments
 * - Emergency contact quick access
 * - Offline capability maintenance
 */
export function TraumaInformedMobileUX({ 
  children, 
  enableCrisisDetection = true,
  enableEmergencyMode = true 
}: TraumaInformedMobileUXProps) {
  const { 
    tier, 
    deviceCapabilities, 
    shouldUseAnimations, 
    transitionDuration,
    enableCrisisMode,
    emergencyMode 
  } = usePerformanceTier();

  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [touchPressure, setTouchPressure] = useState<number[]>([]);
  const [shakingDetected, setShakingDetected] = useState(false);
  const [dissociationMode, setDissociationMode] = useState(false);

  // Crisis keywords for content monitoring (trauma-informed detection)
  const CRISIS_KEYWORDS = [
    'crisis', 'emergency', 'help', 'suicide', 'hurt', 'harm', 'scared', 
    'panic', 'anxiety', 'overwhelm', 'breakdown', 'trauma', 'flashback',
    'dissociat', 'trigger', 'episode', 'attack', 'dying', 'end'
  ];

  // Monitor for crisis indicators
  useEffect(() => {
    if (!enableCrisisDetection) return;

    const detectCrisisPatterns = () => {
      // Text input analysis for crisis language
      const textInputs = document.querySelectorAll('textarea, input[type="text"]');
      textInputs.forEach(input => {
        const content = (input as HTMLInputElement).value.toLowerCase();
        const crisisScore = CRISIS_KEYWORDS.reduce((score, keyword) => {
          const matches = (content.match(new RegExp(keyword, 'gi')) || []).length;
          return score + matches;
        }, 0);

        if (crisisScore >= 3 && !isCrisisMode) {
          activateCrisisMode();
        }
      });
    };

    // Monitor input changes with debouncing
    const debouncedDetection = debounce(detectCrisisPatterns, 2000);
    document.addEventListener('input', debouncedDetection);

    return () => document.removeEventListener('input', debouncedDetection);
  }, [isCrisisMode, enableCrisisDetection]);

  // Touch tremor detection and compensation
  useEffect(() => {
    let touchStartTime = 0;
    let touchData: Array<{ pressure: number; timestamp: number }> = [];

    const handleTouchStart = (e: TouchEvent) => {
      touchStartTime = Date.now();
      if (e.touches[0] && 'force' in e.touches[0]) {
        // @ts-ignore - force property exists on some devices
        const pressure = e.touches[0].force || 0.5;
        touchData.push({ pressure, timestamp: touchStartTime });
        
        // Keep only last 10 touch events
        if (touchData.length > 10) touchData.shift();
        
        // Analyze pressure variance to detect tremors
        if (touchData.length >= 5) {
          const pressures = touchData.map(d => d.pressure);
          const variance = calculateVariance(pressures);
          
          if (variance > 0.3) {
            setShakingDetected(true);
            compensateForTremors();
          } else {
            setShakingDetected(false);
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchDuration = Date.now() - touchStartTime;
      
      // Detect very quick taps that might be accidental
      if (touchDuration < 50) {
        e.preventDefault();
        console.log('[TraumaUX] Quick tap prevented - tremor compensation');
      }
    };

    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Device motion monitoring for panic/shaking detection
  useEffect(() => {
    if (!window.DeviceMotionEvent) return;

    let motionData: number[] = [];
    let lastShakeTime = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const acceleration = Math.sqrt(x! * x! + y! * y! + z! * z!);
      
      motionData.push(acceleration);
      if (motionData.length > 20) motionData.shift();

      // Detect rapid shaking patterns
      const recentMotion = motionData.slice(-5);
      const avgAcceleration = recentMotion.reduce((a, b) => a + b, 0) / recentMotion.length;
      
      const now = Date.now();
      if (avgAcceleration > 15 && now - lastShakeTime > 3000) {
        setShakingDetected(true);
        lastShakeTime = now;
        console.log('[TraumaUX] Device shaking detected - activating tremor compensation');
        
        // Provide haptic feedback to acknowledge the detection
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        
        // Auto-enable larger touch targets
        compensateForTremors();
      }
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, []);

  // Battery level monitoring for extended crisis situations
  useEffect(() => {
    if (deviceCapabilities.batteryLevel < 0.15 && !deviceCapabilities.isCharging) {
      console.warn('[TraumaUX] Critical battery level - enabling emergency conservation mode');
      setIsEmergencyMode(true);
      emergencyMode();
    }
  }, [deviceCapabilities.batteryLevel, deviceCapabilities.isCharging]);

  const activateCrisisMode = useCallback(() => {
    // Remove sensitive logging in production for privacy
    if (process.env.NODE_ENV === 'development') {
      console.log('[TraumaUX] Crisis mode activated');
    }
    setIsCrisisMode(true);
    enableCrisisMode();
    
    // Immediate visual feedback
    document.body.classList.add('crisis-detected');
    
    // Enhanced haptic feedback for crisis acknowledgment
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }
    
    // Show crisis resources immediately
    showCrisisResources();
    
    // Notify any listening components
    window.dispatchEvent(new CustomEvent('alchm:crisis-mode-activated'));
  }, [enableCrisisMode]);

  const compensateForTremors = useCallback(() => {
    console.log('[TraumaUX] Applying tremor compensation');
    document.body.classList.add('tremor-compensation');
    
    // Increase touch targets dynamically
    const touchTargets = document.querySelectorAll('.touch-target, button, a');
    touchTargets.forEach(target => {
      target.classList.add('tremor-safe');
    });
    
    // Reduce sensitivity timeouts
    setTimeout(() => {
      document.body.classList.remove('tremor-compensation');
      touchTargets.forEach(target => {
        target.classList.remove('tremor-safe');
      });
    }, 30000); // 30 seconds of compensation
  }, []);

  const showCrisisResources = useCallback(() => {
    // Check if crisis floating button exists and trigger it
    const crisisButton = document.querySelector('.crisis-accessible') as HTMLElement;
    if (crisisButton) {
      crisisButton.click();
    } else {
      // Create emergency overlay if crisis button not found
      createEmergencyCrisisOverlay();
    }
  }, []);

  const createEmergencyCrisisOverlay = () => {
    const overlay = document.createElement('div');
    overlay.className = 'emergency-crisis-overlay';
    overlay.innerHTML = `
      <div class="crisis-overlay-content">
        <h2>Crisis Support Available</h2>
        <p>We noticed you might be in distress. Help is available right now.</p>
        <div class="crisis-actions">
          <a href="tel:988" class="crisis-call-button">Call 988 Crisis Lifeline</a>
          <button class="crisis-close-button">I'm okay, close this</button>
        </div>
      </div>
    `;
    
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    `;
    
    const closeButton = overlay.querySelector('.crisis-close-button');
    closeButton?.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    document.body.appendChild(overlay);
  };

  const detectDissociationPatterns = useCallback(() => {
    // Monitor for signs of dissociation:
    // - Very slow interactions
    // - Repetitive patterns
    // - Long pauses between actions
    
    let lastInteractionTime = Date.now();
    let interactionGaps: number[] = [];
    
    const trackInteraction = () => {
      const now = Date.now();
      const gap = now - lastInteractionTime;
      
      interactionGaps.push(gap);
      if (interactionGaps.length > 10) interactionGaps.shift();
      
      // If user has very long gaps (>30 seconds) consistently
      const longGaps = interactionGaps.filter(gap => gap > 30000);
      if (longGaps.length > 3 && interactionGaps.length >= 5) {
        if (!dissociationMode) {
          console.log('[TraumaUX] Dissociation patterns detected');
          setDissociationMode(true);
          enableDissociationSupport();
        }
      }
      
      lastInteractionTime = now;
    };
    
    document.addEventListener('click', trackInteraction);
    document.addEventListener('touch', trackInteraction);
    document.addEventListener('keydown', trackInteraction);
    
    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('touch', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
    };
  }, [dissociationMode]);

  const enableDissociationSupport = () => {
    document.body.classList.add('dissociation-support');
    
    // Show gentle grounding reminders
    const groundingReminder = document.createElement('div');
    groundingReminder.className = 'grounding-reminder';
    groundingReminder.innerHTML = `
      <div class="grounding-content">
        <div class="grounding-icon">🌿</div>
        <p>Take a moment to feel your feet on the ground.</p>
        <button class="grounding-dismiss">I'm present</button>
      </div>
    `;
    
    groundingReminder.style.cssText = `
      position: fixed;
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(164, 183, 146, 0.95);
      color: white;
      padding: 1rem 2rem;
      border-radius: 20px;
      z-index: 9999;
      text-align: center;
      backdrop-filter: blur(10px);
    `;
    
    const dismissButton = groundingReminder.querySelector('.grounding-dismiss');
    dismissButton?.addEventListener('click', () => {
      document.body.removeChild(groundingReminder);
    });
    
    document.body.appendChild(groundingReminder);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(groundingReminder)) {
        document.body.removeChild(groundingReminder);
      }
    }, 10000);
  };

  useEffect(() => {
    const cleanup = detectDissociationPatterns();
    return cleanup;
  }, [detectDissociationPatterns]);

  // Utility functions
  const calculateVariance = (numbers: number[]): number => {
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b) / squaredDiffs.length;
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  };

  // Dynamic styles based on current state
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    '--touch-target-size': shakingDetected ? '60px' : '48px',
    '--transition-duration': shouldUseAnimations ? `${transitionDuration}ms` : '0ms',
    '--crisis-mode': isCrisisMode ? '1' : '0',
    '--emergency-mode': isEmergencyMode ? '1' : '0',
  } as React.CSSProperties;

  return (
    <div 
      className={`trauma-informed-mobile-ux ${isCrisisMode ? 'crisis-active' : ''} ${isEmergencyMode ? 'emergency-active' : ''} ${shakingDetected ? 'tremor-detected' : ''} ${dissociationMode ? 'dissociation-support' : ''}`}
      style={containerStyles}
    >
      {/* Crisis State Indicator */}
      {isCrisisMode && (
        <div className="crisis-indicator" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(220, 38, 38, 0.9)',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 9998,
          backdropFilter: 'blur(10px)'
        }}>
          🆘 Crisis Support Mode Active - Help is available
        </div>
      )}

      {/* Emergency Mode Indicator */}
      {isEmergencyMode && (
        <div className="emergency-indicator" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(245, 158, 11, 0.9)',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 9998,
          backdropFilter: 'blur(10px)'
        }}>
          🔋 Battery Saver Mode - Essential features only
        </div>
      )}

      {/* Performance Tier Indicator (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="perf-indicator" style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 10000
        }}>
          Tier: {tier.name} | Battery: {Math.round(deviceCapabilities.batteryLevel * 100)}%
        </div>
      )}

      {/* Tremor Compensation Status */}
      {shakingDetected && (
        <div className="tremor-status" style={{
          position: 'fixed',
          top: '50px',
          right: '10px',
          background: 'rgba(164, 183, 146, 0.9)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          🤝 Tremor support active
        </div>
      )}

      {children}
    </div>
  );
}