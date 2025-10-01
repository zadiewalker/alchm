'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencySanctuaryButtonProps {
  /** Override default position */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Enable one-handed optimization mode */
  oneHandedMode?: boolean;
  /** Custom emergency contact number */
  emergencyNumber?: string;
  /** Custom crisis text helpline */
  crisisTextLine?: string;
  /** Show accessibility enhancements */
  highContrast?: boolean;
  /** Battery conservation mode */
  batterySaver?: boolean;
  /** Crisis mode activation */
  crisisMode?: boolean;
  /** Additional emergency actions */
  onEmergencyActions?: () => void;
  /** Custom className */
  className?: string;
}

interface CrisisResource {
  id: string;
  title: string;
  description: string;
  action: () => void;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  type: 'call' | 'text' | 'website' | 'breathing' | 'grounding';
}

const EmergencySanctuaryButton: React.FC<EmergencySanctuaryButtonProps> = ({
  position = 'bottom-right',
  oneHandedMode = false,
  emergencyNumber = '988',
  crisisTextLine = 'HOME',
  highContrast = false,
  batterySaver = false,
  crisisMode = false,
  onEmergencyActions,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [currentBreathPhase, setCurrentBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const expandedRef = useRef<HTMLDivElement>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout>();

  // Check for device capabilities
  useEffect(() => {
    setIsVibrationEnabled('vibrate' in navigator);
  }, []);

  // Emergency vibration pattern
  const emergencyVibrate = useCallback(() => {
    if (isVibrationEnabled && !batterySaver) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }, [isVibrationEnabled, batterySaver]);

  // Breathing exercise timer
  useEffect(() => {
    if (isBreathingMode && !batterySaver) {
      const breathingCycle = () => {
        setCurrentBreathPhase(prev => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          setBreathingCount(count => count + 1);
          return 'inhale';
        });
      };

      const duration = currentBreathPhase === 'inhale' ? 4000 : 
                      currentBreathPhase === 'hold' ? 2000 : 6000;
      
      breathingTimerRef.current = setTimeout(breathingCycle, duration);
      
      return () => {
        if (breathingTimerRef.current) {
          clearTimeout(breathingTimerRef.current);
        }
      };
    }
  }, [isBreathingMode, currentBreathPhase, batterySaver]);

  // Close expanded menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Crisis resources with trauma-informed ordering
  const crisisResources: CrisisResource[] = [
    {
      id: 'call-988',
      title: '988 Suicide & Crisis Lifeline',
      description: 'Immediate crisis support',
      action: () => window.location.href = `tel:${emergencyNumber}`,
      icon: '📞',
      priority: 'high',
      type: 'call'
    },
    {
      id: 'text-crisis',
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741',
      action: () => window.location.href = `sms:741741?body=${crisisTextLine}`,
      icon: '💬',
      priority: 'high',
      type: 'text'
    },
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Guided breathing exercise',
      action: () => {
        setIsBreathingMode(true);
        setIsExpanded(false);
        emergencyVibrate();
      },
      icon: '🫁',
      priority: 'medium',
      type: 'breathing'
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Grounding technique',
      action: () => {
        // Trigger grounding exercise modal
        setIsExpanded(false);
      },
      icon: '🌱',
      priority: 'medium',
      type: 'grounding'
    },
    {
      id: 'emergency-911',
      title: 'Emergency 911',
      description: 'Medical emergency',
      action: () => window.location.href = 'tel:911',
      icon: '🚨',
      priority: 'high',
      type: 'call'
    }
  ];

  // Position classes based on prop and one-handed mode
  const getPositionClasses = () => {
    const baseClasses = 'fixed z-[9999]';
    
    if (oneHandedMode) {
      // Optimize for thumb reach from bottom corners
      return `${baseClasses} bottom-6 right-4 md:right-6`;
    }
    
    switch (position) {
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-4`;
      case 'bottom-center':
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
      default:
        return `${baseClasses} bottom-6 right-4`;
    }
  };

  // Handle emergency button press
  const handleEmergencyPress = () => {
    emergencyVibrate();
    setIsExpanded(!isExpanded);
    onEmergencyActions?.();
  };

  // Emergency button styles
  const emergencyButtonClasses = `
    sanctuary-btn-emergency sanctuary-touch-emergency
    ${highContrast ? 'ring-4 ring-white' : ''}
    ${crisisMode ? 'animate-crisis-attention' : 'animate-gentle-pulse'}
    ${batterySaver ? 'shadow-none' : ''}
    ${className}
  `;

  return (
    <>
      {/* Main Emergency Button */}
      <div className={getPositionClasses()}>
        <div ref={expandedRef}>
          <motion.button
            className={emergencyButtonClasses}
            onClick={handleEmergencyPress}
            whileHover={!batterySaver ? { scale: 1.05 } : {}}
            whileTap={!batterySaver ? { scale: 0.95 } : {}}
            aria-label="Emergency assistance and crisis resources"
            aria-expanded={isExpanded}
            aria-haspopup="menu"
          >
            <motion.span
              animate={!batterySaver ? { rotate: isExpanded ? 45 : 0 } : {}}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="text-2xl font-bold"
            >
              {isExpanded ? '✕' : 'SOS'}
            </motion.span>
          </motion.button>

          {/* Expanded Crisis Resources Menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: batterySaver ? 0 : 0.2, ease: 'easeOut' }}
                className="absolute bottom-20 right-0 w-80 max-w-[90vw]"
              >
                <div className="sanctuary-glass sanctuary-card p-6 space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="sanctuary-heading-secondary text-lg font-semibold mb-2">
                      Crisis Support Resources
                    </h3>
                    <p className="sanctuary-body-small text-sm opacity-80">
                      You're not alone. Help is available.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {crisisResources
                      .sort((a, b) => a.priority === 'high' ? -1 : 1)
                      .map((resource) => (
                        <motion.button
                          key={resource.id}
                          className="sanctuary-touch-crisis w-full p-4 text-left rounded-lg 
                                   sanctuary-glass border border-sage-200 hover:border-sage-300
                                   transition-all duration-200 group"
                          onClick={resource.action}
                          whileHover={!batterySaver ? { y: -1 } : {}}
                          whileTap={!batterySaver ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl" role="img" aria-hidden="true">
                              {resource.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="sanctuary-body-text font-medium text-sage-700 group-hover:text-sage-900">
                                {resource.title}
                              </div>
                              <div className="sanctuary-body-small text-sage-500 mt-1">
                                {resource.description}
                              </div>
                            </div>
                            {resource.priority === 'high' && (
                              <div className="w-2 h-2 bg-crisis-red rounded-full animate-pulse" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                  </div>

                  <div className="pt-4 border-t border-sage-200">
                    <button
                      className="sanctuary-btn-secondary w-full text-center"
                      onClick={() => setIsExpanded(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {isBreathingMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setIsBreathingMode(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="sanctuary-glass sanctuary-card max-w-sm w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="sanctuary-heading-secondary mb-6">
                4-7-8 Breathing Exercise
              </h3>

              <div className="mb-8">
                <motion.div
                  className="w-32 h-32 mx-auto border-4 border-sage-300 rounded-full flex items-center justify-center"
                  animate={!batterySaver ? {
                    scale: currentBreathPhase === 'inhale' ? 1.2 : 
                           currentBreathPhase === 'hold' ? 1.2 : 1
                  } : {}}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                >
                  <span className="text-2xl">🫁</span>
                </motion.div>
              </div>

              <div className="mb-6">
                <div className="sanctuary-body-text text-lg font-medium mb-2">
                  {currentBreathPhase === 'inhale' && 'Breathe In...'}
                  {currentBreathPhase === 'hold' && 'Hold...'}
                  {currentBreathPhase === 'exhale' && 'Breathe Out...'}
                </div>
                <div className="sanctuary-body-small">
                  Cycle {breathingCount + 1} of 4
                </div>
              </div>

              <div className="space-y-3">
                <div className="sanctuary-body-small text-sage-600">
                  <p>• Inhale for 4 seconds</p>
                  <p>• Hold for 7 seconds</p>
                  <p>• Exhale for 8 seconds</p>
                </div>
              </div>

              <button
                className="sanctuary-btn-secondary mt-6"
                onClick={() => setIsBreathingMode(false)}
              >
                End Exercise
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battery Saver Notice */}
      {batterySaver && (
        <div className="sanctuary-battery-warning">
          ⚡ Battery Saver Mode - Emergency features remain fully accessible
        </div>
      )}
    </>
  );
};

export default EmergencySanctuaryButton;