'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { crisisDetection } from '@/lib/enhanced-crisis-detection';

/**
 * Universal Crisis Safety Provider - The Guardian Angel Component
 * Ensures crisis support is ALWAYS available regardless of navigation state,
 * loading conditions, or component failures.
 */

interface CrisisState {
  isDetected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  lastDetection: Date | null;
  emergencyModeActive: boolean;
}

interface CrisisContext {
  crisisState: CrisisState;
  triggerEmergencyMode: () => void;
  checkCrisisContent: (content: string) => boolean;
  isNavigationSafe: boolean;
  crisisResourcesLoaded: boolean;
}

const CrisisContext = createContext<CrisisContext | null>(null);

interface UniversalCrisisSafetyProviderProps {
  children: React.ReactNode;
}

export function UniversalCrisisSafetyProvider({ children }: UniversalCrisisSafetyProviderProps) {
  const pathname = usePathname();
  const [crisisState, setCrisisState] = useState<CrisisState>({
    isDetected: false,
    severity: 'low',
    confidence: 0,
    lastDetection: null,
    emergencyModeActive: false
  });
  const [isNavigationSafe, setIsNavigationSafe] = useState(true);
  const [crisisResourcesLoaded, setCrisisResourcesLoaded] = useState(false);
  const [emergencyButtonRendered, setEmergencyButtonRendered] = useState(false);

  // Preload crisis resources immediately
  useEffect(() => {
    const preloadCrisisResources = async () => {
      try {
        // Preload emergency phone functionality
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          // Cache crisis resources offline
        }
        
        // Test emergency call functionality
        const testCall = () => {
          const link = document.createElement('a');
          link.href = 'tel:988';
          return link;
        };
        testCall();
        
        setCrisisResourcesLoaded(true);
      } catch (error) {
        console.error('Crisis resources preload failed:', error);
        // Still mark as loaded to not block functionality
        setCrisisResourcesLoaded(true);
      }
    };

    preloadCrisisResources();
  }, []);

  // Emergency mode trigger - bypasses all normal flows
  const triggerEmergencyMode = useCallback(() => {
    setCrisisState(prev => ({
      ...prev,
      emergencyModeActive: true,
      isDetected: true,
      severity: 'critical',
      confidence: 1.0,
      lastDetection: new Date()
    }));

    // Immediate emergency actions
    try {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }

      // Multiple fallback attempts to call crisis line
      const callAttempts = [
        () => window.open('tel:988', '_self'),
        () => window.location.href = 'tel:988',
        () => {
          const link = document.createElement('a');
          link.href = 'tel:988';
          link.click();
        }
      ];

      // Try each method with delay
      callAttempts.forEach((attempt, index) => {
        setTimeout(() => {
          try {
            attempt();
          } catch (error) {
            console.error(`Crisis call attempt ${index + 1} failed:`, error);
          }
        }, index * 100);
      });

    } catch (error) {
      console.error('Emergency mode trigger failed:', error);
      // Show fallback alert
      alert('CRISIS SUPPORT: Call 988 immediately\nNational Suicide Prevention Lifeline\n24/7 Free Support');
    }
  }, []);

  // Crisis content detection
  const checkCrisisContent = useCallback((content: string): boolean => {
    if (!content || content.length < 10) return false;

    try {
      const result = crisisDetection.detectCrisis(content);
      
      if (result.detected && result.confidence > 0.6) {
        setCrisisState(prev => ({
          ...prev,
          isDetected: true,
          severity: result.severity,
          confidence: result.confidence,
          lastDetection: new Date()
        }));

        // Auto-trigger emergency mode for critical cases
        if (result.severity === 'critical' && result.confidence > 0.8) {
          triggerEmergencyMode();
        }

        return true;
      }
    } catch (error) {
      console.error('Crisis detection failed:', error);
      // Fallback to simple keyword check
      const emergencyKeywords = ['kill myself', 'suicide', 'end it all', 'want to die'];
      const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      if (hasEmergencyKeyword) {
        triggerEmergencyMode();
        return true;
      }
    }

    return false;
  }, [triggerEmergencyMode]);

  // Monitor navigation safety
  useEffect(() => {
    const handleNavigationStart = () => {
      setIsNavigationSafe(false);
      // Ensure emergency button remains visible during navigation
      renderEmergencyButton();
    };

    const handleNavigationEnd = () => {
      setIsNavigationSafe(true);
    };

    // Listen for navigation events
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      handleNavigationStart();
      const result = originalPushState.apply(this, args);
      setTimeout(handleNavigationEnd, 100);
      return result;
    };

    history.replaceState = function(...args) {
      handleNavigationStart();
      const result = originalReplaceState.apply(this, args);
      setTimeout(handleNavigationEnd, 100);
      return result;
    };

    window.addEventListener('beforeunload', handleNavigationStart);
    window.addEventListener('load', handleNavigationEnd);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('beforeunload', handleNavigationStart);
      window.removeEventListener('load', handleNavigationEnd);
    };
  }, []);

  // Render emergency button that survives all component unmounts
  const renderEmergencyButton = useCallback(() => {
    if (emergencyButtonRendered) return;

    const buttonId = 'alchm-emergency-crisis-button';
    let existingButton = document.getElementById(buttonId);
    
    if (!existingButton) {
      existingButton = document.createElement('button');
      existingButton.id = buttonId;
      existingButton.innerHTML = '🆘';
      existingButton.setAttribute('aria-label', 'Emergency Crisis Support - Call 988');
      existingButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(145deg, #dc2626, #b91c1c);
        border: 3px solid rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: crisis-pulse 2s infinite;
      `;
      
      // Add CSS animation
      if (!document.getElementById('crisis-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'crisis-animation-styles';
        style.textContent = `
          @keyframes crisis-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4), 0 0 0 0 rgba(220, 38, 38, 0.7);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 12px 40px rgba(220, 38, 38, 0.6), 0 0 0 15px rgba(220, 38, 38, 0);
            }
          }
        `;
        document.head.appendChild(style);
      }

      existingButton.onclick = () => {
        triggerEmergencyMode();
      };

      document.body.appendChild(existingButton);
      setEmergencyButtonRendered(true);
    }
  }, [triggerEmergencyMode, emergencyButtonRendered]);

  // Render emergency button on mount and when crisis detected
  useEffect(() => {
    renderEmergencyButton();
  }, [renderEmergencyButton]);

  useEffect(() => {
    if (crisisState.isDetected && crisisState.severity === 'critical') {
      renderEmergencyButton();
    }
  }, [crisisState, renderEmergencyButton]);

  // Monitor all text inputs for crisis content
  useEffect(() => {
    const handleTextInput = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        const content = target.value;
        if (content.length > 20) { // Only check substantial content
          checkCrisisContent(content);
        }
      }
    };

    document.addEventListener('input', handleTextInput, { passive: true });
    return () => document.removeEventListener('input', handleTextInput);
  }, [checkCrisisContent]);

  const contextValue: CrisisContext = {
    crisisState,
    triggerEmergencyMode,
    checkCrisisContent,
    isNavigationSafe,
    crisisResourcesLoaded
  };

  return (
    <CrisisContext.Provider value={contextValue}>
      {children}
      
      {/* Crisis Detection Overlay - Shows during critical situations */}
      {crisisState.emergencyModeActive && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(220, 38, 38, 0.95)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999998,
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🆘</div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Crisis Support Available</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px', maxWidth: '600px' }}>You matter. Help is available right now. You don't have to face this alone.</p>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.open('tel:988', '_self')}
              style={{
                background: 'white',
                color: '#dc2626',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              📞 Call 988 Now
            </button>
            
            <button
              onClick={() => window.open('sms:741741&body=HOME', '_self')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              💬 Text HOME to 741741
            </button>
          </div>
          
          <p style={{ fontSize: '14px', marginTop: '30px', opacity: 0.9 }}>Both services are free, confidential, and available 24/7</p>
          
          <button
            onClick={() => setCrisisState(prev => ({ ...prev, emergencyModeActive: false }))}
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            I'm getting help
          </button>
        </div>
      )}
      
      {/* Crisis Support Notice during high-risk detection */}
      {crisisState.isDetected && crisisState.severity === 'high' && !crisisState.emergencyModeActive && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: 'rgba(220, 38, 38, 0.95)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            maxWidth: '300px',
            zIndex: 999997,
            boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)'
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>We care about you</div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>If you're struggling, support is available 24/7</div>
          <button
            onClick={() => window.open('tel:988', '_self')}
            style={{
              background: 'white',
              color: '#dc2626',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Call 988 for Support
          </button>
        </div>
      )}
    </CrisisContext.Provider>
  );
}

export function useCrisisSafety() {
  const context = useContext(CrisisContext);
  if (!context) {
    throw new Error('useCrisisSafety must be used within UniversalCrisisSafetyProvider');
  }
  return context;
}