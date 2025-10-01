'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface EmergencyModeProps {
  children: React.ReactNode;
  onModeChange?: (active: boolean) => void;
  autoActivationThreshold?: number; // Time in ms of inactivity before suggesting emergency mode
}

interface EmergencyAction {
  id: string;
  label: string;
  description: string;
  action: () => void;
  icon: string;
  color: string;
  priority: 'critical' | 'high' | 'medium';
}

interface TapDetection {
  count: number;
  lastTap: number;
  positions: { x: number; y: number }[];
}

export function EmergencyMode({
  children,
  onModeChange,
  autoActivationThreshold = 30000 // 30 seconds of inactivity
}: EmergencyModeProps) {
  const router = useRouter();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [tapDetection, setTapDetection] = useState<TapDetection>({
    count: 0,
    lastTap: 0,
    positions: []
  });
  
  const [showActivationPrompt, setShowActivationPrompt] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [emergencyActions, setEmergencyActions] = useState<EmergencyAction[]>([]);
  const [isMinimalMode, setIsMinimalMode] = useState(false);
  const [breathingGuideActive, setBreathingGuideActive] = useState(false);
  
  const emergencyModeRef = useRef<HTMLDivElement>(null);
  const activationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Initialize emergency actions
  useEffect(() => {
    const actions: EmergencyAction[] = [
      {
        id: 'crisis-hotline',
        label: 'Crisis Hotline',
        description: 'Call 988 - Suicide & Crisis Lifeline',
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.href = 'tel:988';
          }
        },
        icon: '📞',
        color: '#ff4444',
        priority: 'critical'
      },
      {
        id: 'text-crisis',
        label: 'Crisis Text',
        description: 'Text HOME to 741741',
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.href = 'sms:741741?body=HOME';
          }
        },
        icon: '💬',
        color: '#ff6b6b',
        priority: 'critical'
      },
      {
        id: 'emergency-911',
        label: 'Emergency 911',
        description: 'Call emergency services',
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.href = 'tel:911';
          }
        },
        icon: '🚨',
        color: '#cc0000',
        priority: 'critical'
      },
      {
        id: 'breathing-guide',
        label: 'Breathe',
        description: 'Guided breathing exercise',
        action: () => setBreathingGuideActive(true),
        icon: '🫁',
        color: '#4A90E2',
        priority: 'high'
      },
      {
        id: 'safe-space',
        label: 'Safe Space',
        description: 'Go to calming environment',
        action: () => router.push('/safe-space'),
        icon: '🛡️',
        color: '#28a745',
        priority: 'high'
      },
      {
        id: 'trusted-contact',
        label: 'Call Someone',
        description: 'Contact trusted person',
        action: () => openContactSelector(),
        icon: '👥',
        color: '#6f42c1',
        priority: 'medium'
      }
    ];

    setEmergencyActions(actions);
  }, [router]);

  // Triple-tap detection
  const handleTapDetection = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    const currentTime = Date.now();
    const clientX = 'touches' in event ? event.touches[0]?.clientX : (event as React.MouseEvent).clientX;
    const clientY = 'touches' in event ? event.touches[0]?.clientY : (event as React.MouseEvent).clientY;
    
    if (!clientX || !clientY) return;

    const TAP_TIMEOUT = 500; // 500ms window for triple tap
    const TAP_RADIUS = 50; // 50px radius for tap area
    
    setTapDetection(prev => {
      const timeSinceLastTap = currentTime - prev.lastTap;
      
      // Reset if too much time has passed
      if (timeSinceLastTap > TAP_TIMEOUT) {
        return {
          count: 1,
          lastTap: currentTime,
          positions: [{ x: clientX, y: clientY }]
        };
      }

      // Check if tap is in the same area
      const lastPosition = prev.positions[prev.positions.length - 1];
      const distance = Math.sqrt(
        Math.pow(clientX - lastPosition.x, 2) + Math.pow(clientY - lastPosition.y, 2)
      );

      if (distance > TAP_RADIUS) {
        return {
          count: 1,
          lastTap: currentTime,
          positions: [{ x: clientX, y: clientY }]
        };
      }

      const newCount = prev.count + 1;
      const newPositions = [...prev.positions, { x: clientX, y: clientY }];

      // Triple tap detected!
      if (newCount >= 3) {
        activateEmergencyMode();
        return {
          count: 0,
          lastTap: 0,
          positions: []
        };
      }

      return {
        count: newCount,
        lastTap: currentTime,
        positions: newPositions
      };
    });
  }, []);

  // Activate emergency mode
  const activateEmergencyMode = useCallback(() => {
    setIsEmergencyMode(true);
    setShowActivationPrompt(false);
    
    // Provide immediate feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Announce activation
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = 'Emergency mode activated. Help options are now available.';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 3000);

    // Focus first emergency action
    setTimeout(() => {
      const firstAction = document.querySelector('.emergency-action') as HTMLElement;
      firstAction?.focus();
    }, 100);

    onModeChange?.(true);
  }, [onModeChange]);

  // Deactivate emergency mode
  const deactivateEmergencyMode = useCallback(() => {
    setIsEmergencyMode(false);
    setBreathingGuideActive(false);
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Emergency mode deactivated.';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 2000);

    onModeChange?.(false);
  }, [onModeChange]);

  // Track user activity for auto-activation suggestion
  const trackActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Don't track if already in emergency mode
    if (isEmergencyMode) return;

    const timer = setTimeout(() => {
      if (!isEmergencyMode && !showActivationPrompt) {
        setShowActivationPrompt(true);
      }
    }, autoActivationThreshold);

    setInactivityTimer(timer);
  }, [inactivityTimer, isEmergencyMode, showActivationPrompt, autoActivationThreshold]);

  // Setup activity tracking
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [trackActivity, inactivityTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Emergency activation: Ctrl + Shift + E (or Cmd + Shift + E on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        if (isEmergencyMode) {
          deactivateEmergencyMode();
        } else {
          activateEmergencyMode();
        }
      }

      // Escape key to exit emergency mode
      if (event.key === 'Escape' && isEmergencyMode) {
        event.preventDefault();
        deactivateEmergencyMode();
      }

      // Quick crisis hotline: Ctrl + Shift + H
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        if (typeof window !== 'undefined') {
          window.location.href = 'tel:988';
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEmergencyMode, activateEmergencyMode, deactivateEmergencyMode]);

  // Open contact selector
  const openContactSelector = useCallback(() => {
    // This would integrate with device contacts API in a real implementation
    const contacts = [
      { name: 'Emergency Contact', number: 'tel:+1234567890' },
      { name: 'Trusted Friend', number: 'tel:+0987654321' },
      { name: 'Family Member', number: 'tel:+1122334455' }
    ];

    // For now, just show the first contact
    if (contacts.length > 0 && typeof window !== 'undefined') {
      window.location.href = contacts[0].number;
    }
  }, []);

  // Breathing guide component
  const BreathingGuide = () => (
    <motion.div
      className="breathing-guide"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="breathing-circle">
        <motion.div
          className="breath-indicator"
          animate={{
            scale: [1, 1.5, 1.5, 1],
            opacity: [0.6, 1, 1, 0.6]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.25, 0.75, 1]
          }}
        />
      </div>
      
      <div className="breathing-instructions">
        <h3>Breathe with the circle</h3>
        <p>Inhale as it grows, exhale as it shrinks</p>
        <button 
          className="close-breathing"
          onClick={() => setBreathingGuideActive(false)}
        >
          I'm feeling better
        </button>
      </div>
    </motion.div>
  );

  return (
    <div 
      ref={emergencyModeRef}
      className={`emergency-mode-container ${isEmergencyMode ? 'emergency-active' : ''}`}
      onTouchStart={handleTapDetection}
      onMouseDown={handleTapDetection}
    >
      {/* Triple-tap activation prompt */}
      <AnimatePresence>
        {showActivationPrompt && !isEmergencyMode && (
          <motion.div
            className="activation-prompt"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="prompt-content">
              <h3>Need help?</h3>
              <p>Triple-tap anywhere or press Ctrl+Shift+E to activate emergency mode</p>
              <button 
                className="activate-now"
                onClick={activateEmergencyMode}
              >
                Activate Now
              </button>
              <button 
                className="dismiss-prompt"
                onClick={() => setShowActivationPrompt(false)}
              >
                Not now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`main-content ${isEmergencyMode ? 'blurred' : ''}`}>
        {children}
      </div>

      {/* Emergency mode overlay */}
      <AnimatePresence>
        {isEmergencyMode && (
          <motion.div
            className="emergency-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="emergency-header">
              <h1>You are safe</h1>
              <p>Emergency help is available</p>
              <button 
                className="exit-emergency"
                onClick={deactivateEmergencyMode}
                aria-label="Exit emergency mode"
              >
                ✕
              </button>
            </div>

            <div className="emergency-actions">
              {emergencyActions
                .sort((a, b) => {
                  const priorityOrder = { critical: 0, high: 1, medium: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map((action) => (
                  <motion.button
                    key={action.id}
                    className={`emergency-action priority-${action.priority}`}
                    style={{ backgroundColor: action.color }}
                    onClick={action.action}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * emergencyActions.indexOf(action) }}
                  >
                    <span className="action-icon" aria-hidden="true">{action.icon}</span>
                    <div className="action-content">
                      <h3>{action.label}</h3>
                      <p>{action.description}</p>
                    </div>
                  </motion.button>
                ))}
            </div>

            {/* Minimal mode toggle */}
            <button
              className="minimal-toggle"
              onClick={() => setIsMinimalMode(!isMinimalMode)}
            >
              {isMinimalMode ? 'Show all options' : 'Show only essential'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing guide overlay */}
      <AnimatePresence>
        {breathingGuideActive && <BreathingGuide />}
      </AnimatePresence>

      <style jsx>{`
        .emergency-mode-container {
          position: relative;
          min-height: 100vh;
          touch-action: manipulation;
        }

        .main-content {
          transition: filter 0.3s ease;
        }

        .main-content.blurred {
          filter: blur(2px);
          pointer-events: none;
        }

        .activation-prompt {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          max-width: 320px;
          text-align: center;
        }

        .prompt-content h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
        }

        .prompt-content p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }

        .activate-now {
          background: #ff4444;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: bold;
          margin: 0 8px 8px 0;
          cursor: pointer;
          min-height: 48px;
        }

        .activate-now:hover {
          background: #ff3333;
        }

        .dismiss-prompt {
          background: transparent;
          color: #666;
          border: 1px solid #ddd;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          min-height: 48px;
        }

        .emergency-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          color: #fff;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          padding: 20px;
          overflow-y: auto;
        }

        .emergency-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }

        .emergency-header h1 {
          font-size: 32px;
          margin: 0 0 8px 0;
          color: #fff;
        }

        .emergency-header p {
          font-size: 18px;
          margin: 0;
          color: #ccc;
        }

        .exit-emergency {
          position: absolute;
          top: 0;
          right: 0;
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .exit-emergency:hover {
          background: #fff;
          color: #000;
        }

        .emergency-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
          max-width: 500px;
          margin: 0 auto;
          width: 100%;
        }

        .emergency-action {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          color: white;
          min-height: 80px;
          font-size: 16px;
          transition: all 0.2s ease;
          touch-action: manipulation;
        }

        .emergency-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .emergency-action:focus {
          outline: 3px solid #fff;
          outline-offset: 2px;
        }

        .emergency-action.priority-critical {
          order: 1;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
        }

        .emergency-action.priority-high {
          order: 2;
        }

        .emergency-action.priority-medium {
          order: 3;
        }

        .action-icon {
          font-size: 32px;
          line-height: 1;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
        }

        .action-content h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: bold;
        }

        .action-content p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .minimal-toggle {
          background: transparent;
          color: #ccc;
          border: 1px solid #444;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 20px;
          align-self: center;
        }

        .minimal-toggle:hover {
          color: #fff;
          border-color: #fff;
        }

        /* Breathing guide styles */
        .breathing-guide {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 10001;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }

        .breathing-circle {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 32px;
        }

        .breath-indicator {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, #4A90E2, #7B68EE);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breathing-instructions h3 {
          font-size: 24px;
          margin: 0 0 8px 0;
        }

        .breathing-instructions p {
          font-size: 16px;
          margin: 0 0 24px 0;
          opacity: 0.8;
        }

        .close-breathing {
          background: #28a745;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          min-height: 56px;
        }

        .close-breathing:hover {
          background: #218838;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .emergency-overlay {
            padding: 16px;
          }

          .emergency-header h1 {
            font-size: 24px;
          }

          .emergency-actions {
            gap: 12px;
          }

          .emergency-action {
            padding: 16px;
            min-height: 72px;
          }

          .action-icon {
            font-size: 24px;
          }

          .action-content h3 {
            font-size: 16px;
          }

          .action-content p {
            font-size: 13px;
          }

          .breathing-circle {
            width: 150px;
            height: 150px;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .emergency-overlay {
            background: #000;
          }

          .emergency-action {
            border: 2px solid #fff;
          }

          .emergency-action:focus {
            outline: 4px solid #fff;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .breath-indicator {
            animation: none;
          }

          .emergency-action:hover {
            transform: none;
          }
        }

        /* Screen reader only content */
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
      `}</style>
    </div>
  );
}

export default EmergencyMode;