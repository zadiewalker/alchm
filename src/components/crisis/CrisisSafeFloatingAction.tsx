/*
 * ALCHM Crisis-Safe Floating Action Button
 * Jony Ive Excellence - Always Accessible Crisis Support
 * 
 * Trauma-Informed Design:
 * - Consistent placement across all app screens
 * - <3 second access to crisis resources
 * - Offline-first crisis functionality
 * - Gentle, non-jarring interactions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CrisisExperienceHub } from './CrisisExperienceHub';
import { useUserActionTracking } from '@/components/monitoring/PerformanceMonitor';

interface CrisisSafeFloatingActionProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
  context?: 'app' | 'onboarding' | 'journaling' | 'crisis-page';
  isVisible?: boolean;
  emergencyMode?: boolean;
}

export default function CrisisSafeFloatingAction({
  position = 'bottom-right',
  context = 'app',
  isVisible = true,
  emergencyMode = false
}: CrisisSafeFloatingActionProps) {
  // Cache busting for mobile - November 15, 2024 - v2.1
  const cacheKey = `crisis-button-${Date.now()}-v2.1`;
  const { trackAction } = useUserActionTracking();
  const [showCrisisHub, setShowCrisisHub] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  // Offline detection for crisis resources
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    setIsOffline(!navigator.onLine);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Add trauma-informed animations and styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes crisis-breathe {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        50% { 
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }
      }
      @keyframes gentle-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      @keyframes emergency-alert {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        25% { 
          transform: scale(1.1);
          box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.3);
        }
        50% { 
          transform: scale(1.05);
          box-shadow: 0 0 0 12px rgba(239, 68, 68, 0.1);
        }
        75% { 
          transform: scale(1.1);
          box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.3);
        }
      }
      .crisis-breathe {
        animation: crisis-breathe 3s ease-in-out infinite;
      }
      .gentle-pulse {
        animation: gentle-pulse 2s ease-in-out infinite;
      }
      .emergency-alert {
        animation: emergency-alert 1.5s ease-in-out infinite;
      }
      .button-pressed {
        transform: scale(0.95);
        transition: transform 0.1s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  const handleCrisisAccess = () => {
    const accessStartTime = Date.now();
    
    setButtonPressed(true);
    setTimeout(() => setButtonPressed(false), 100);

    trackAction('CrisisFloatingAction_Pressed', {
      context,
      position,
      isOffline,
      emergencyMode,
      accessTime: Date.now()
    });

    // Direct access to 988 for emergency mode
    if (emergencyMode) {
      window.location.href = 'tel:988';
      return;
    }

    // Show crisis hub for regular access
    setShowCrisisHub(true);
    
    // Track hub load time
    setTimeout(() => {
      trackAction('CrisisHub_LoadComplete', {
        loadTime: Date.now() - accessStartTime,
        context
      });
    }, 100);
  };

  const handleCloseCrisisHub = () => {
    setShowCrisisHub(false);
    trackAction('CrisisHub_Closed', { context });
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + C for crisis access
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        handleCrisisAccess();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <div 
        className={`fixed ${getPositionClasses()} z-40`}
        style={{ 
          filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
          userSelect: 'none'
        }}
      >
        <Button
          onClick={handleCrisisAccess}
          className={`
            bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg 
            transition-all duration-300 group relative overflow-hidden w-12 h-12
            ${emergencyMode ? 'emergency-alert' : 'crisis-breathe'}
            ${buttonPressed ? 'button-pressed' : ''}
          `}
          aria-label="Crisis support - Emergency assistance available 24/7"
          title="Crisis Support (Ctrl+Shift+C)"
          data-version="v2.1-mobile-fix"
        >
          {/* Offline indicator */}
          {isOffline && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-red-600"></div>
          )}
          
          {/* Crisis icon */}
          <span className="text-sm group-hover:scale-110 transition-transform duration-200 block">
            🆘
          </span>
          
          {/* Emergency pulse overlay */}
          {emergencyMode && (
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-30 gentle-pulse"></div>
          )}
        </Button>

        {/* Hover tooltip */}
        <div className={`
          absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs 
          rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none backdrop-blur-sm
        `}>
          Crisis Support 24/7
          {isOffline && (
            <span className="block text-yellow-300">Offline Ready</span>
          )}
        </div>
      </div>

      {/* Crisis Experience Hub Modal */}
      {showCrisisHub && (
        <div className="fixed inset-0 z-50">
          <CrisisExperienceHub 
            context="floating"
            isEmergency={emergencyMode}
          />
          {/* Close overlay - clicking outside closes */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={handleCloseCrisisHub}
          />
        </div>
      )}

      {/* Accessibility - Screen reader announcement */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {emergencyMode ? 'Emergency crisis support activated' : ''}
        {isOffline ? 'Crisis support available offline' : ''}
      </div>
    </>
  );
}

// Quick access hook for programmatic crisis button access
export const useCrisisAccess = () => {
  const { trackAction } = useUserActionTracking();

  const triggerCrisisAccess = (context: string, isEmergency = false) => {
    trackAction('CrisisAccess_Programmatic', { context, isEmergency });
    
    if (isEmergency) {
      window.location.href = 'tel:988';
    } else {
      // Could trigger crisis hub modal
      const event = new CustomEvent('openCrisisHub', { detail: { context } });
      window.dispatchEvent(event);
    }
  };

  const quickDial988 = (context: string) => {
    trackAction('CrisisQuickDial_988', { context });
    window.location.href = 'tel:988';
  };

  const quickTextCrisisLine = (context: string) => {
    trackAction('CrisisQuickText_HOME', { context });
    window.location.href = 'sms:741741?body=HOME';
  };

  return {
    triggerCrisisAccess,
    quickDial988,
    quickTextCrisisLine
  };
};

export { CrisisSafeFloatingAction };
export type { CrisisSafeFloatingActionProps };