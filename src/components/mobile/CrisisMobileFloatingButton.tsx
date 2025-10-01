'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface CrisisMobileFloatingButtonProps {
  onCrisisActivated?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  size?: 'normal' | 'large' | 'emergency';
}

/**
 * Crisis-optimized mobile floating button designed for users experiencing emotional distress
 * 
 * Features:
 * - Extra large touch targets for trembling hands
 * - High contrast colors for visual impairment during crisis
 * - Multi-tap protection to prevent accidental activation
 * - Haptic feedback for confirmation
 * - Always accessible, even during offline situations
 * - One-tap emergency calling functionality
 */
export function CrisisMobileFloatingButton({ 
  onCrisisActivated,
  position = 'bottom-right',
  size = 'emergency'
}: CrisisMobileFloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor device state for crisis optimization
  useEffect(() => {
    const checkBattery = async () => {
      try {
        // @ts-ignore - navigator.getBattery is experimental
        const battery = await navigator.getBattery();
        setBatteryLevel(battery.level);
        
        const updateBattery = () => setBatteryLevel(battery.level);
        battery.addEventListener('levelchange', updateBattery);
        
        return () => battery.removeEventListener('levelchange', updateBattery);
      } catch (error) {
        console.log('Battery API not available');
      }
    };

    const checkOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    const checkCrisisMode = () => {
      const crisisIndicators = [
        localStorage.getItem('alchm_emergency_mode') === 'true',
        document.body.classList.contains('crisis-active'),
        document.body.classList.contains('emergency-mode')
      ];
      setIsCrisisMode(crisisIndicators.some(Boolean));
    };

    checkBattery();
    checkOnlineStatus();
    checkCrisisMode();

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    window.addEventListener('storage', checkCrisisMode);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
      window.removeEventListener('storage', checkCrisisMode);
    };
  }, []);

  // Anti-tremor touch protection
  const handleSafeTouch = useCallback((action: () => void) => {
    const now = Date.now();
    if (now - lastTouchTime < 1000) return; // Prevent rapid taps during distress
    
    setLastTouchTime(now);
    
    // Enhanced haptic feedback for crisis situations
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]); // Double pulse for confirmation
    }
    
    action();
  }, [lastTouchTime]);

  const handleEmergencyCall = useCallback(() => {
    handleSafeTouch(() => {
      // Multiple fallback methods for emergency calling
      try {
        // Primary: Direct call
        window.open('tel:988', '_self');
      } catch (error) {
        try {
          // Fallback: Location-based assignment
          window.location.href = 'tel:988';
        } catch (fallbackError) {
          // Last resort: Show emergency information
          alert('Emergency Support: 988\nNational Suicide Prevention Lifeline\n24/7 Crisis Support');
        }
      }

      // Track emergency activation
      if (onCrisisActivated) {
        onCrisisActivated();
      }
    });
  }, [handleSafeTouch, onCrisisActivated]);

  const handleExpand = useCallback(() => {
    handleSafeTouch(() => {
      setIsExpanded(!isExpanded);
    });
  }, [isExpanded, handleSafeTouch]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'center':
        return 'bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'normal':
        return 'w-14 h-14';
      case 'large':
        return 'w-16 h-16';
      case 'emergency':
        return 'w-20 h-20 min-w-[80px] min-h-[80px]';
      default:
        return 'w-20 h-20';
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-24 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200/50 p-4 min-w-[280px]">
          {/* Crisis Resources */}
          <div className="space-y-3">
            <div className="text-center mb-4">
              <h3 className="text-red-800 font-semibold text-lg mb-1">Crisis Support</h3>
              <p className="text-red-600 text-sm">Immediate help is available</p>
            </div>

            {/* Emergency Call Button */}
            <Button
              onClick={handleEmergencyCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-lg min-h-[60px]"
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)'
              }}
            >
              <span className="text-2xl mr-3">📞</span>
              Call 988 Crisis Lifeline
            </Button>

            {/* Crisis Chat */}
            <Button
              onClick={() => handleSafeTouch(() => {
                window.open('https://suicidepreventionlifeline.org/chat/', '_blank');
              })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium rounded-xl transition-all duration-200 min-h-[52px]"
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.3)'
              }}
              disabled={isOffline}
            >
              <span className="text-xl mr-2">💬</span>
              {isOffline ? 'Chat (Offline)' : 'Crisis Chat'}
            </Button>

            {/* Grounding Exercise */}
            <Button
              onClick={() => handleSafeTouch(() => {
                setIsExpanded(false);
                // Show grounding exercise modal
                showGroundingExercise();
              })}
              className="w-full bg-sage-500 hover:bg-sage-600 text-white py-3 text-base font-medium rounded-xl transition-all duration-200 min-h-[52px]"
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)'
              }}
            >
              <span className="text-xl mr-2">🌿</span>
              Grounding Exercise
            </Button>

            {/* Close Button */}
            <Button
              onClick={() => handleSafeTouch(() => setIsExpanded(false))}
              variant="ghost"
              className="w-full py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl min-h-[48px]"
              style={{
                touchAction: 'manipulation'
              }}
            >
              Close
            </Button>
          </div>

          {/* Device Status Indicators */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            {batteryLevel < 0.2 && (
              <span className="flex items-center text-amber-600">
                🔋 Low battery
              </span>
            )}
            {isOffline && (
              <span className="flex items-center text-red-600">
                📡 Offline mode
              </span>
            )}
            {isCrisisMode && (
              <span className="flex items-center text-green-600">
                🆘 Crisis mode active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Crisis Button */}
      <Button
        onClick={isExpanded ? handleEmergencyCall : handleExpand}
        className={`
          ${getSizeClasses()} 
          rounded-full shadow-2xl transition-all duration-300 
          ${isCrisisMode 
            ? 'bg-red-600 hover:bg-red-700 animate-crisis-pulse' 
            : 'bg-red-500 hover:bg-red-600 animate-gentle-pulse'
          }
          text-white border-4 border-white/20 hover:scale-105 active:scale-95
          flex items-center justify-center
        `}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)',
          minWidth: '80px',
          minHeight: '80px'
        }}
        aria-label="Emergency crisis support - Call 988 National Suicide Prevention Lifeline"
      >
        <span className={`${size === 'emergency' ? 'text-4xl' : 'text-3xl'} animate-gentle-pulse`}>
          🆘
        </span>
      </Button>

      {/* Accessibility Ring */}
      <div className={`
        absolute inset-0 ${getSizeClasses()} rounded-full 
        border-2 border-red-400/30 animate-gentle-pulse
        pointer-events-none
      `} />
    </div>
  );
}

// Helper function to show grounding exercise
function showGroundingExercise() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      text-align: center;
    ">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🌿</div>
      <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #374151;">
        5-4-3-2-1 Grounding
      </h2>
      <div style="text-align: left; margin-bottom: 2rem; line-height: 1.6; color: #6b7280;">
        <p style="margin-bottom: 0.5rem;"><strong>5 things</strong> you can see</p>
        <p style="margin-bottom: 0.5rem;"><strong>4 things</strong> you can touch</p>
        <p style="margin-bottom: 0.5rem;"><strong>3 things</strong> you can hear</p>
        <p style="margin-bottom: 0.5rem;"><strong>2 things</strong> you can smell</p>
        <p style="margin-bottom: 0.5rem;"><strong>1 thing</strong> you can taste</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: #a4b792;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        min-height: 52px;
        font-size: 1rem;
      ">
        I'm feeling more grounded
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Auto-remove after 2 minutes
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove();
    }
  }, 120000);
}

export default CrisisMobileFloatingButton;