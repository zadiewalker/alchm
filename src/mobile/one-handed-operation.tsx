'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OneHandedOperationProps {
  children: React.ReactNode;
  enabled?: boolean;
  handedness?: 'left' | 'right' | 'auto';
  onHandednessChange?: (handedness: 'left' | 'right') => void;
}

interface ThumbZone {
  easy: { top: number; bottom: number; left: number; right: number };
  natural: { top: number; bottom: number; left: number; right: number };
  stretch: { top: number; bottom: number; left: number; right: number };
}

interface GestureAction {
  id: string;
  label: string;
  action: () => void;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

const THUMB_ZONES: Record<'left' | 'right', ThumbZone> = {
  right: {
    easy: { top: 60, bottom: 85, left: 65, right: 95 },
    natural: { top: 40, bottom: 90, left: 50, right: 100 },
    stretch: { top: 15, bottom: 100, left: 30, right: 100 }
  },
  left: {
    easy: { top: 60, bottom: 85, left: 5, right: 35 },
    natural: { top: 40, bottom: 90, left: 0, right: 50 },
    stretch: { top: 15, bottom: 100, left: 0, right: 70 }
  }
};

export function OneHandedOperation({
  children,
  enabled = true,
  handedness = 'auto',
  onHandednessChange
}: OneHandedOperationProps) {
  const [activeHandedness, setActiveHandedness] = useState<'left' | 'right'>('right');
  const [thumbZones, setThumbZones] = useState<ThumbZone>(THUMB_ZONES.right);
  const [showZones, setShowZones] = useState(false);
  const [reachabilityMode, setReachabilityMode] = useState(false);
  const [swipeGesturesEnabled, setSwipeGesturesEnabled] = useState(true);
  const [gestureActions, setGestureActions] = useState<GestureAction[]>([]);
  const [deviceSize, setDeviceSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const reachabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect device size and adjust thumb zones accordingly
  useEffect(() => {
    const updateDeviceSize = () => {
      const screenHeight = window.screen.height;
      const screenWidth = window.screen.width;
      const maxDimension = Math.max(screenHeight, screenWidth);
      
      if (maxDimension <= 667) { // iPhone SE, iPhone 8 and smaller
        setDeviceSize('small');
      } else if (maxDimension <= 896) { // iPhone 11, iPhone 12 mini to iPhone 12
        setDeviceSize('medium');
      } else { // iPhone 12 Pro Max and larger
        setDeviceSize('large');
      }
    };

    updateDeviceSize();
    window.addEventListener('resize', updateDeviceSize);
    return () => window.removeEventListener('resize', updateDeviceSize);
  }, []);

  // Auto-detect handedness based on usage patterns
  useEffect(() => {
    if (handedness === 'auto') {
      let leftTaps = 0;
      let rightTaps = 0;
      let totalTaps = 0;

      const detectHandedness = (event: TouchEvent) => {
        if (event.touches.length !== 1) return;
        
        const touch = event.touches[0];
        const screenWidth = window.innerWidth;
        const touchX = touch.clientX;
        
        totalTaps++;
        
        if (touchX < screenWidth * 0.4) {
          leftTaps++;
        } else if (touchX > screenWidth * 0.6) {
          rightTaps++;
        }
        
        // Determine handedness after 10 taps
        if (totalTaps >= 10) {
          const detectedHandedness = leftTaps > rightTaps ? 'left' : 'right';
          setActiveHandedness(detectedHandedness);
          setThumbZones(THUMB_ZONES[detectedHandedness]);
          onHandednessChange?.(detectedHandedness);
          
          document.removeEventListener('touchstart', detectHandedness);
        }
      };

      document.addEventListener('touchstart', detectHandedness, { passive: true });
      
      return () => document.removeEventListener('touchstart', detectHandedness);
    } else {
      setActiveHandedness(handedness);
      setThumbZones(THUMB_ZONES[handedness]);
    }
  }, [handedness, onHandednessChange]);

  // Adjust zones based on device size
  useEffect(() => {
    const adjustedZones = { ...THUMB_ZONES[activeHandedness] };
    
    if (deviceSize === 'large') {
      // For larger devices, expand the easy zone and shrink stretch zone
      adjustedZones.easy.top += 5;
      adjustedZones.natural.top += 10;
      adjustedZones.stretch.top += 15;
    } else if (deviceSize === 'small') {
      // For smaller devices, most of the screen is reachable
      adjustedZones.easy.top -= 10;
      adjustedZones.easy.bottom += 5;
    }
    
    setThumbZones(adjustedZones);
  }, [deviceSize, activeHandedness]);

  // Setup default gesture actions
  useEffect(() => {
    const defaultActions: GestureAction[] = [
      {
        id: 'back',
        label: 'Go Back',
        action: () => window.history.back(),
        icon: '←',
        priority: 'high'
      },
      {
        id: 'home',
        label: 'Home',
        action: () => window.location.href = '/dashboard',
        icon: '🏠',
        priority: 'high'
      },
      {
        id: 'crisis-help',
        label: 'Crisis Help',
        action: () => window.location.href = '/crisis-resources',
        icon: '🆘',
        priority: 'high'
      },
      {
        id: 'menu',
        label: 'Menu',
        action: () => setShowZones(!showZones),
        icon: '☰',
        priority: 'medium'
      }
    ];
    
    setGestureActions(defaultActions);
  }, [showZones]);

  // Handle touch gestures for one-handed operation
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!enabled || !swipeGesturesEnabled || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [enabled, swipeGesturesEnabled]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!touchStartRef.current || !enabled) return;
    
    const touch = event.changedTouches[0];
    const touchStart = touchStartRef.current;
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    touchStartRef.current = null;
    
    // Detect swipe gestures
    if (distance > 50 && deltaTime < 500) {
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      
      // Right swipe (back navigation)
      if (angle > -30 && angle < 30) {
        const backAction = gestureActions.find(a => a.id === 'back');
        backAction?.action();
      }
      // Left swipe (forward or menu)
      else if (Math.abs(angle) > 150) {
        const menuAction = gestureActions.find(a => a.id === 'menu');
        menuAction?.action();
      }
      // Down swipe from top (reachability mode)
      else if (angle > 45 && angle < 135 && touchStart.y < 100) {
        activateReachabilityMode();
      }
    }
    
    // Double tap for emergency help
    const doubleTapThreshold = 300;
    if (distance < 20 && deltaTime < doubleTapThreshold) {
      if (touchStart.time - (touchStartRef.current?.time || 0) < doubleTapThreshold) {
        const crisisAction = gestureActions.find(a => a.id === 'crisis-help');
        crisisAction?.action();
      }
    }
  }, [enabled, gestureActions]);

  // Activate reachability mode (bring top content down)
  const activateReachabilityMode = useCallback(() => {
    setReachabilityMode(true);
    
    // Clear existing timeout
    if (reachabilityTimeoutRef.current) {
      clearTimeout(reachabilityTimeoutRef.current);
    }
    
    // Auto-deactivate after 5 seconds
    reachabilityTimeoutRef.current = setTimeout(() => {
      setReachabilityMode(false);
    }, 5000);
  }, []);

  // Position element within thumb reach
  const getOptimalPosition = useCallback((priority: 'high' | 'medium' | 'low' = 'medium') => {
    const zone = priority === 'high' ? thumbZones.easy : 
                 priority === 'medium' ? thumbZones.natural : thumbZones.stretch;
    
    return {
      top: `${zone.top}%`,
      left: activeHandedness === 'right' ? `${zone.left}%` : `${zone.right - 20}%`,
      position: 'fixed' as const,
      zIndex: 1000
    };
  }, [thumbZones, activeHandedness]);

  // Create floating action button in thumb zone
  const FloatingActionButton = ({ action }: { action: GestureAction }) => (
    <motion.button
      key={action.id}
      className="one-handed-fab"
      style={getOptimalPosition(action.priority)}
      onClick={action.action}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      aria-label={action.label}
    >
      <span className="fab-icon">{action.icon}</span>
      <span className="fab-label">{action.label}</span>
    </motion.button>
  );

  return (
    <div
      ref={containerRef}
      className={`one-handed-container ${enabled ? 'enabled' : ''} ${reachabilityMode ? 'reachability-active' : ''} hand-${activeHandedness}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main content with reachability transform */}
      <div 
        className={`content-container ${reachabilityMode ? 'pulled-down' : ''}`}
        style={{
          transform: reachabilityMode ? 'translateY(25vh)' : 'translateY(0)',
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>

      {/* Thumb zone indicators (for debugging/setup) */}
      {showZones && (
        <div className="thumb-zones">
          <div 
            className="thumb-zone easy"
            style={{
              top: `${thumbZones.easy.top}%`,
              bottom: `${100 - thumbZones.easy.bottom}%`,
              left: `${thumbZones.easy.left}%`,
              right: `${100 - thumbZones.easy.right}%`
            }}
          />
          <div 
            className="thumb-zone natural"
            style={{
              top: `${thumbZones.natural.top}%`,
              bottom: `${100 - thumbZones.natural.bottom}%`,
              left: `${thumbZones.natural.left}%`,
              right: `${100 - thumbZones.natural.right}%`
            }}
          />
          <div 
            className="thumb-zone stretch"
            style={{
              top: `${thumbZones.stretch.top}%`,
              bottom: `${100 - thumbZones.stretch.bottom}%`,
              left: `${thumbZones.stretch.left}%`,
              right: `${100 - thumbZones.stretch.right}%`
            }}
          />
        </div>
      )}

      {/* Floating action buttons in thumb-friendly positions */}
      <AnimatePresence>
        {enabled && gestureActions
          .filter(action => action.priority === 'high')
          .slice(0, 2) // Limit to 2 high-priority actions
          .map((action, index) => (
            <FloatingActionButton key={action.id} action={action} />
          ))}
      </AnimatePresence>

      {/* Handedness toggle */}
      <button
        className="handedness-toggle"
        onClick={() => {
          const newHandedness = activeHandedness === 'right' ? 'left' : 'right';
          setActiveHandedness(newHandedness);
          setThumbZones(THUMB_ZONES[newHandedness]);
          onHandednessChange?.(newHandedness);
        }}
        style={getOptimalPosition('low')}
        aria-label={`Switch to ${activeHandedness === 'right' ? 'left' : 'right'} handed mode`}
      >
        {activeHandedness === 'right' ? '👈' : '👉'}
      </button>

      {/* Reachability hint */}
      {reachabilityMode && (
        <div className="reachability-hint">
          <p>Reachability Mode Active</p>
          <p>Tap anywhere to dismiss</p>
        </div>
      )}

      <style jsx>{`
        .one-handed-container {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .one-handed-container.enabled {
          padding-bottom: 100px; /* Space for floating elements */
        }

        .content-container {
          min-height: 100vh;
          transition: transform 0.3s ease-out;
        }

        .content-container.pulled-down {
          transform: translateY(25vh) scale(0.85);
          transform-origin: top center;
          border-radius: 12px 12px 0 0;
          overflow: hidden;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        }

        .thumb-zones {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 999;
        }

        .thumb-zone {
          position: absolute;
          border: 2px solid;
          border-radius: 8px;
          pointer-events: none;
        }

        .thumb-zone.easy {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.1);
        }

        .thumb-zone.natural {
          border-color: #FF9800;
          background: rgba(255, 152, 0, 0.1);
        }

        .thumb-zone.stretch {
          border-color: #F44336;
          background: rgba(244, 67, 54, 0.1);
        }

        .one-handed-fab {
          position: fixed;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #4A90E2;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
          transition: all 0.2s ease;
          z-index: 1001;
        }

        .one-handed-fab:hover,
        .one-handed-fab:focus {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
        }

        .one-handed-fab:focus {
          outline: 3px solid rgba(74, 144, 226, 0.5);
          outline-offset: 2px;
        }

        .fab-icon {
          font-size: 20px;
          line-height: 1;
        }

        .fab-label {
          font-size: 8px;
          font-weight: 600;
          text-align: center;
          line-height: 1;
          max-width: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .handedness-toggle {
          position: fixed;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 20px;
          z-index: 1001;
          transition: all 0.2s ease;
        }

        .handedness-toggle:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .reachability-hint {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          text-align: center;
          z-index: 1002;
          pointer-events: none;
        }

        .reachability-hint p {
          margin: 0;
          font-size: 14px;
        }

        .reachability-hint p:first-child {
          font-weight: bold;
          margin-bottom: 4px;
        }

        /* Left-handed adjustments */
        .hand-left .one-handed-fab {
          background: #FF6B6B;
        }

        .hand-left .one-handed-fab:hover {
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        }

        /* Device-specific adjustments */
        @media screen and (max-height: 667px) {
          /* Small devices */
          .content-container.pulled-down {
            transform: translateY(20vh) scale(0.9);
          }
        }

        @media screen and (min-height: 896px) {
          /* Large devices */
          .content-container.pulled-down {
            transform: translateY(30vh) scale(0.8);
          }
        }

        /* Landscape mode adjustments */
        @media (orientation: landscape) {
          .content-container.pulled-down {
            transform: translateY(15vh) scale(0.9);
          }

          .one-handed-fab {
            width: 56px;
            height: 56px;
          }

          .fab-icon {
            font-size: 18px;
          }

          .fab-label {
            font-size: 7px;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .one-handed-fab {
            background: #000;
            border: 2px solid #fff;
          }

          .handedness-toggle {
            background: #000;
            border: 2px solid #fff;
          }

          .thumb-zone {
            border-width: 3px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .content-container,
          .one-handed-fab,
          .handedness-toggle {
            transition: none !important;
          }
        }

        /* Focus management for crisis situations */
        .one-handed-container.enabled *:focus {
          outline: 3px solid #4A90E2;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Ensure minimum touch targets in one-handed mode */
        .one-handed-container.enabled button,
        .one-handed-container.enabled a,
        .one-handed-container.enabled input,
        .one-handed-container.enabled select {
          min-width: 52px;
          min-height: 52px;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}

export default OneHandedOperation;