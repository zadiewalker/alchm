'use client';

import React, { useState, useEffect } from 'react';
import { useTraumaMobile } from '@/components/mobile/TraumaInformedMobileProvider';

interface CrisisFooterProps {
  position?: 'fixed' | 'sticky' | 'static';
  variant?: 'minimal' | 'standard' | 'comprehensive';
  showOfflineSupport?: boolean;
}

export function EnhancedCrisisFooter({ 
  position = 'fixed', 
  variant = 'standard',
  showOfflineSupport = true 
}: CrisisFooterProps) {
  const { state, actions } = useTraumaMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-expand in crisis mode
  useEffect(() => {
    if (state.isCrisisMode || state.isEmergencyMode) {
      setIsExpanded(true);
    }
  }, [state.isCrisisMode, state.isEmergencyMode]);

  // Emergency resources with one-tap access
  const emergencyResources = [
    {
      label: 'Call 988',
      description: 'Suicide & Crisis Lifeline',
      action: () => {
        setLastInteraction(new Date());
        window.location.href = 'tel:988';
      },
      priority: 'highest',
      color: 'bg-red-500 hover:bg-red-600',
      icon: '📞'
    },
    {
      label: 'Text HOME to 741741',
      description: 'Crisis Text Line',
      action: () => {
        setLastInteraction(new Date());
        window.location.href = 'sms:741741?body=HOME';
      },
      priority: 'high',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: '💬'
    },
    {
      label: 'Call 911',
      description: 'Emergency Services',
      action: () => {
        setLastInteraction(new Date());
        window.location.href = 'tel:911';
      },
      priority: 'critical',
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: '🚨'
    }
  ];

  // Specialized support resources
  const specializedResources = [
    {
      label: 'LGBTQ+ Support',
      number: '1-866-488-7386',
      description: 'Trevor Project',
      icon: '🏳️‍🌈'
    },
    {
      label: 'Trans Lifeline',
      number: '877-565-8860',
      description: 'Trans community support',
      icon: '🏳️‍⚧️'
    },
    {
      label: 'Domestic Violence',
      number: '1-800-799-7233',
      description: 'National Hotline',
      icon: '🛡️'
    },
    {
      label: 'Spanish Support',
      number: '888-628-9454',
      description: 'Línea Nacional',
      icon: '🌍'
    }
  ];

  const handlePrimarySupport = () => {
    if (state.isEmergencyMode) {
      // In emergency mode, prioritize immediate call
      window.location.href = 'tel:988';
    } else if (state.isCrisisMode) {
      // In crisis mode, show all options but prioritized
      setIsExpanded(true);
    } else {
      // Standard mode, toggle expanded view
      setIsExpanded(!isExpanded);
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const getTouchTargetSize = () => {
    switch (state.touchTargetSize) {
      case 'emergency': return 'w-20 h-20 text-2xl';
      case 'crisis': return 'w-18 h-18 text-xl';
      case 'large': return 'w-16 h-16 text-lg';
      default: return 'w-14 h-14 text-base';
    }
  };

  const getContainerClasses = () => {
    const base = 'transition-all duration-300 ease-out';
    const positionClasses = {
      fixed: 'fixed bottom-0 left-0 right-0 z-50',
      sticky: 'sticky bottom-0 z-40',
      static: 'relative z-30'
    };
    
    return `${base} ${positionClasses[position]}`;
  };

  // Minimal variant for non-crisis situations
  if (variant === 'minimal' && !state.isCrisisMode && !state.isEmergencyMode) {
    return (
      <div className={getContainerClasses()}>
        <div className="bg-sage-50/95 backdrop-blur-sm border-t border-sage-200 p-2">
          <div className="flex justify-center">
            <button
              onClick={handlePrimarySupport}
              className={`${getTouchTargetSize()} bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-red-300`}
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)'
              }}
              aria-label="Crisis support - Tap for help options"
            >
              🆘
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      {/* Crisis Mode Notification */}
      {(state.isCrisisMode || state.isEmergencyMode) && (
        <div className="bg-red-50 border-t-2 border-red-200 p-3 text-center">
          <div className="text-red-800 font-medium text-sm">
            {state.isEmergencyMode ? '🚨 Emergency Support Activated' : '🆘 Crisis Support Available'}
          </div>
          <div className="text-red-600 text-xs mt-1">
            Help is available right now - you're not alone
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className={`
        ${state.isCrisisMode ? 'bg-red-50/98' : 'bg-sage-50/95'}
        backdrop-blur-sm border-t border-sage-200
        ${isExpanded ? 'pb-4' : 'pb-2'}
      `}>
        {/* Primary Crisis Button */}
        <div className="flex justify-center pt-3 pb-2">
          <button
            onClick={handlePrimarySupport}
            className={`
              ${getTouchTargetSize()}
              ${state.isEmergencyMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}
              text-white rounded-full flex items-center justify-center shadow-lg
              transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300
              ${state.isCrisisMode ? 'animate-pulse' : ''}
              ${state.tremorsDetected ? 'scale-110' : ''}
            `}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)',
              minHeight: state.touchTargetSize === 'emergency' ? '80px' : '56px',
              minWidth: state.touchTargetSize === 'emergency' ? '80px' : '56px'
            }}
            aria-label="Crisis support - Immediate help available"
          >
            {state.isEmergencyMode ? '🚨' : '🆘'}
          </button>
        </div>

        {/* Expanded Crisis Resources */}
        {(isExpanded || state.isCrisisMode || state.isEmergencyMode) && (
          <div className="px-4 space-y-3">
            {/* Primary Emergency Actions */}
            <div className="grid grid-cols-1 gap-2">
              {emergencyResources.map((resource, index) => (
                <button
                  key={index}
                  onClick={resource.action}
                  className={`
                    ${resource.color} text-white rounded-xl p-4 flex items-center gap-3
                    transition-all duration-200 shadow-md hover:shadow-lg
                    focus:outline-none focus:ring-4 focus:ring-opacity-50
                    ${state.tremorsDetected ? 'min-h-[72px]' : 'min-h-[60px]'}
                  `}
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="text-2xl">{resource.icon}</div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-lg">{resource.label}</div>
                    <div className="text-sm opacity-90">{resource.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Specialized Support - Only show if not in emergency mode */}
            {!state.isEmergencyMode && variant === 'comprehensive' && (
              <>
                <div className="border-t border-sage-200 pt-3">
                  <div className="text-center text-sage-600 font-medium text-sm mb-2">
                    Specialized Support
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {specializedResources.map((resource, index) => (
                      <button
                        key={index}
                        onClick={() => window.location.href = `tel:${resource.number}`}
                        className="bg-sage-100 hover:bg-sage-200 p-3 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-sage-300"
                        style={{
                          touchAction: 'manipulation',
                          minHeight: state.tremorsDetected ? '68px' : '60px'
                        }}
                      >
                        <div className="text-lg mb-1">{resource.icon}</div>
                        <div className="text-sage-800 font-medium text-xs">{resource.label}</div>
                        <div className="text-sage-600 text-xs">{resource.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Offline Support Notice */}
            {isOffline && showOfflineSupport && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-orange-800">
                  <div className="text-lg">📱</div>
                  <div>
                    <div className="font-medium text-sm">You're offline</div>
                    <div className="text-xs">But phone calls still work! All numbers above are accessible.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Grounding Reminder */}
            {(state.isCrisisMode || state.isEmergencyMode) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-blue-800 font-medium text-sm mb-1">Take a breath</div>
                <div className="text-blue-700 text-xs">
                  You are safe right now. Feel your feet on the ground. You are not alone.
                </div>
              </div>
            )}

            {/* Collapse Button */}
            {!state.isEmergencyMode && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-sage-600 hover:text-sage-800 text-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sage-300 rounded"
                  style={{
                    touchAction: 'manipulation',
                    minHeight: '44px'
                  }}
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex justify-center items-center gap-2 pt-1 pb-1">
          {state.tremorsDetected && (
            <div className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
              🤝 Touch assist active
            </div>
          )}
          {state.lowBattery && (
            <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              🔋 Power saving mode
            </div>
          )}
          {isOffline && (
            <div className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              📱 Offline - calls available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick action hook for emergency situations
export function useEmergencyActions() {
  const { actions } = useTraumaMobile();
  
  return {
    quickCall988: () => {
      actions.activateCrisisMode();
      window.location.href = 'tel:988';
    },
    quickText741741: () => {
      actions.activateCrisisMode();
      window.location.href = 'sms:741741?body=HOME';
    },
    activateEmergencyMode: () => {
      actions.activateEmergencyMode();
    },
    enableAccessibilityMode: () => {
      actions.enableTremorCompensation();
      actions.reduceCognitiveLoad();
    }
  };
}