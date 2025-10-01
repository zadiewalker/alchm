'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTraumaMobile } from './TraumaInformedMobileProvider';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  description?: string;
  emergencyExit?: boolean;
  oneHandedPriority: number; // 1 = highest priority for thumb reach
}

interface OneHandedNavigationProps {
  variant?: 'bottom-tab' | 'floating-bubble' | 'thumb-arc';
  emergencyExitEnabled?: boolean;
}

export function OneHandedNavigation({ 
  variant = 'thumb-arc', 
  emergencyExitEnabled = true 
}: OneHandedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, actions } = useTraumaMobile();
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [thumbPosition, setThumbPosition] = useState<'right' | 'left'>('right');

  // Detect user's dominant hand from interaction patterns
  useEffect(() => {
    let rightSideTouches = 0;
    let leftSideTouches = 0;
    
    const trackTouchPreference = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const screenWidth = window.innerWidth;
        
        if (touch.clientX > screenWidth * 0.6) {
          rightSideTouches++;
        } else if (touch.clientX < screenWidth * 0.4) {
          leftSideTouches++;
        }
        
        // After 20 touches, determine preference
        if (rightSideTouches + leftSideTouches >= 20) {
          setThumbPosition(rightSideTouches > leftSideTouches ? 'right' : 'left');
          document.removeEventListener('touchstart', trackTouchPreference);
        }
      }
    };
    
    document.addEventListener('touchstart', trackTouchPreference, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', trackTouchPreference);
    };
  }, []);

  // Core navigation items optimized for thumb reach
  const navigationItems: NavigationItem[] = [
    {
      path: '/journal',
      label: 'Write',
      icon: '✍️',
      description: 'New journal entry',
      oneHandedPriority: 1 // Highest priority - most used
    },
    {
      path: '/dashboard',
      label: 'Home',
      icon: '🏠',
      description: 'Dashboard',
      oneHandedPriority: 2
    },
    {
      path: '/journals',
      label: 'History',
      icon: '📚',
      description: 'Past entries',
      oneHandedPriority: 3
    },
    {
      path: '/crisis-support',
      label: 'Help',
      icon: '🆘',
      description: 'Crisis support',
      oneHandedPriority: 1, // Also highest priority for safety
      emergencyExit: true
    }
  ];

  // Emergency navigation items
  const emergencyItems: NavigationItem[] = [
    {
      path: '/emergency',
      label: 'Exit',
      icon: '🚪',
      description: 'Safe exit',
      oneHandedPriority: 1,
      emergencyExit: true
    },
    {
      path: '/',
      label: 'Home',
      icon: '🏠',
      description: 'Main page',
      oneHandedPriority: 2,
      emergencyExit: true
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    if (item.emergencyExit && state.isCrisisMode) {
      setShowEmergencyConfirm(true);
      return;
    }
    
    // Haptic feedback for navigation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    router.push(item.path);
  };

  const handleEmergencyExit = () => {
    // Clear any sensitive data from memory
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({ type: 'EMERGENCY_CLEAR' });
      });
    }
    
    // Navigate to safe page
    window.location.href = 'https://www.google.com';
  };

  const getThumbReachPosition = (priority: number) => {
    // Calculate optimal positions based on thumb reach studies
    const baseBottom = 120; // Base position from bottom
    const positions = {
      right: [
        { bottom: baseBottom, right: 20 }, // Position 1 - easiest reach
        { bottom: baseBottom + 80, right: 30 }, // Position 2
        { bottom: baseBottom + 160, right: 50 }, // Position 3
        { bottom: baseBottom + 240, right: 80 }  // Position 4
      ],
      left: [
        { bottom: baseBottom, left: 20 },
        { bottom: baseBottom + 80, left: 30 },
        { bottom: baseBottom + 160, left: 50 },
        { bottom: baseBottom + 240, left: 80 }
      ]
    };
    
    return positions[thumbPosition][priority - 1] || positions[thumbPosition][0];
  };

  const getTouchTargetSize = () => {
    switch (state.touchTargetSize) {
      case 'emergency': return 'w-20 h-20 text-2xl';
      case 'crisis': return 'w-18 h-18 text-xl';
      case 'large': return 'w-16 h-16 text-lg';
      default: return 'w-14 h-14 text-base';
    }
  };

  // Thumb Arc Navigation (Recommended for crisis situations)
  if (variant === 'thumb-arc') {
    const itemsToShow = state.isCrisisMode ? 
      [...navigationItems, ...emergencyItems].filter(item => item.emergencyExit) :
      navigationItems;

    return (
      <>
        {itemsToShow.map((item, index) => {
          const position = getThumbReachPosition(item.oneHandedPriority);
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item)}
              className={`
                fixed z-40 ${getTouchTargetSize()}
                ${item.emergencyExit 
                  ? 'bg-red-500 hover:bg-red-600 border-red-300' 
                  : isActive 
                    ? 'bg-sage-500 hover:bg-sage-600 border-sage-300'
                    : 'bg-sage-400 hover:bg-sage-500 border-sage-200'
                }
                text-white rounded-full shadow-lg hover:shadow-xl
                flex items-center justify-center transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-opacity-50
                ${state.tremorsDetected ? 'scale-110' : ''}
                ${state.isCrisisMode && item.emergencyExit ? 'animate-pulse' : ''}
              `}
              style={{
                ...position,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)',
                minHeight: state.touchTargetSize === 'emergency' ? '80px' : '56px',
                minWidth: state.touchTargetSize === 'emergency' ? '80px' : '56px'
              }}
              aria-label={`${item.label} - ${item.description}`}
            >
              <span className="text-center">
                <div>{item.icon}</div>
                {state.touchTargetSize === 'emergency' && (
                  <div className="text-xs mt-1">{item.label}</div>
                )}
              </span>
            </button>
          );
        })}

        {/* Hand preference toggle */}
        <button
          onClick={() => setThumbPosition(thumbPosition === 'right' ? 'left' : 'right')}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors"
          style={{ touchAction: 'manipulation' }}
          aria-label="Switch navigation to other hand"
        >
          {thumbPosition === 'right' ? '👈' : '👉'}
        </button>
      </>
    );
  }

  // Bottom Tab Navigation (Standard mobile pattern)
  if (variant === 'bottom-tab') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-sage-200">
        <div className="safe-area-padding-bottom">
          <div className="flex justify-around items-center py-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item)}
                  className={`
                    flex flex-col items-center justify-center py-2 px-3 rounded-lg
                    ${isActive 
                      ? 'bg-sage-100 text-sage-700' 
                      : 'text-sage-500 hover:text-sage-700 hover:bg-sage-50'
                    }
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage-300
                    ${state.tremorsDetected ? 'min-w-[60px] min-h-[60px]' : 'min-w-[52px] min-h-[52px]'}
                  `}
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)'
                  }}
                  aria-label={item.description}
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Floating Bubble Navigation (Space-efficient)
  if (variant === 'floating-bubble') {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
      <div className={`fixed ${thumbPosition === 'right' ? 'bottom-20 right-4' : 'bottom-20 left-4'} z-40`}>
        {/* Main navigation bubble */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            ${getTouchTargetSize()} bg-sage-500 hover:bg-sage-600 text-white rounded-full
            shadow-lg hover:shadow-xl flex items-center justify-center
            transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage-300
          `}
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)'
          }}
          aria-label="Navigation menu"
        >
          {isExpanded ? '✕' : '☰'}
        </button>

        {/* Expanded navigation items */}
        {isExpanded && (
          <div className="absolute bottom-full mb-2 space-y-2">
            {navigationItems.reverse().map((item, index) => {
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    handleNavigation(item);
                    setIsExpanded(false);
                  }}
                  className={`
                    ${getTouchTargetSize()}
                    ${item.emergencyExit 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : isActive 
                        ? 'bg-sage-600 hover:bg-sage-700'
                        : 'bg-sage-400 hover:bg-sage-500'
                    }
                    text-white rounded-full shadow-lg hover:shadow-xl
                    flex items-center justify-center transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-opacity-50
                    animate-[fadeInUp_0.3s_ease-out]
                  `}
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)',
                    animationDelay: `${index * 50}ms`
                  }}
                  aria-label={item.description}
                >
                  {item.icon}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Emergency confirmation modal
function EmergencyExitConfirm({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🚪</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Quick Exit?
        </h2>
        <p className="text-gray-600 mb-6">
          This will close ALCHM and go to a neutral website for your safety.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            style={{ minHeight: '60px', touchAction: 'manipulation' }}
          >
            Yes, exit safely
          </button>
          
          <button
            onClick={onCancel}
            className="bg-sage-500 hover:bg-sage-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            style={{ minHeight: '60px', touchAction: 'manipulation' }}
          >
            Stay in ALCHM
          </button>
        </div>
      </div>
    </div>
  );
}