'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CelebrationEvent } from '@/lib/gamification/duolingo-style-healing-engine';
import { useMobileOptimization } from '../MobileOptimizationProvider';

interface CelebrationSystemProps {
  celebrations: CelebrationEvent[];
  userPreferences?: {
    celebrationStyle: 'gentle' | 'enthusiastic' | 'wise';
    animationsEnabled: boolean;
    soundEnabled: boolean;
  };
  onCelebrationComplete: (celebrationId: string) => void;
  onCelebrationShare?: (celebration: CelebrationEvent) => void;
}

interface ActiveCelebration extends CelebrationEvent {
  isActive: boolean;
  startTime: number;
  duration: number;
}

const ANIMATION_CONFIGS = {
  gentle_sparkle: {
    duration: 3000,
    particles: 8,
    colors: ['#a4b792', '#93a682', '#8ea876'],
    size: 'small',
    movement: 'subtle'
  },
  warm_glow: {
    duration: 4000,
    particles: 12,
    colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
    size: 'medium',
    movement: 'gentle'
  },
  growth_flourish: {
    duration: 5000,
    particles: 15,
    colors: ['#10b981', '#34d399', '#6ee7b7'],
    size: 'medium',
    movement: 'expanding'
  },
  wisdom_bloom: {
    duration: 6000,
    particles: 20,
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    size: 'large',
    movement: 'spiraling'
  },
  heart_expansion: {
    duration: 4500,
    particles: 16,
    colors: ['#ef4444', '#f87171', '#fca5a5'],
    size: 'medium',
    movement: 'heart_pulse'
  }
};

const CELEBRATION_MESSAGES = {
  gentle: {
    streak_milestone: [
      "You showed up. That's beautiful.",
      "Gentle consistency is your superpower.",
      "This steady presence is how healing happens."
    ],
    skill_unlock: [
      "A new capacity for healing has opened.",
      "Your growth has created new possibilities.",
      "This skill emerged naturally from your practice."
    ],
    return_celebration: [
      "Welcome back to yourself.",
      "Your return is an act of courage.",
      "This is what self-compassion looks like."
    ]
  },
  enthusiastic: {
    streak_milestone: [
      "🎉 Look at this consistency! You're amazing!",
      "🔥 This streak shows your commitment to healing!",
      "⭐ You're building something incredible!"
    ],
    skill_unlock: [
      "🚀 New skill unlocked! Your growth is inspiring!",
      "✨ This is what transformation looks like!",
      "💪 You've earned this new emotional capacity!"
    ],
    return_celebration: [
      "🌈 Welcome back, warrior!",
      "💖 Your resilience is extraordinary!",
      "🌟 This comeback energy is everything!"
    ]
  },
  wise: {
    streak_milestone: [
      "In consistency, you teach your nervous system that healing is safe.",
      "Each day of practice is a seed planted in the garden of your becoming.",
      "This rhythm you've created honors the ancient wisdom of daily devotion."
    ],
    skill_unlock: [
      "The student in you has become the teacher. This skill is your gift to yourself.",
      "What was once a challenge is now your strength. Witness your transformation.",
      "You've cultivated this capacity through patient practice. It belongs to you now."
    ],
    return_celebration: [
      "The prodigal soul returns home to itself. There is great rejoicing.",
      "In your return, you embody the truth that healing is not linear.",
      "You chose love over perfectionism. This is the path of the wise."
    ]
  }
};

export default function CelebrationSystem({
  celebrations,
  userPreferences = {
    celebrationStyle: 'gentle',
    animationsEnabled: true,
    soundEnabled: false
  },
  onCelebrationComplete,
  onCelebrationShare
}: CelebrationSystemProps) {
  const [activeCelebrations, setActiveCelebrations] = useState<ActiveCelebration[]>([]);
  const [celebrationQueue, setCelebrationQueue] = useState<CelebrationEvent[]>([]);
  const [currentCelebration, setCurrentCelebration] = useState<ActiveCelebration | null>(null);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; color: string; size: number }>>([]);

  const {
    isCrisisMode,
    isLowBattery,
    deviceTier,
    isOffline
  } = useMobileOptimization();

  // Queue new celebrations
  useEffect(() => {
    const newCelebrations = celebrations.filter(
      celebration => !activeCelebrations.some(active => active.id === celebration.id) &&
      !celebrationQueue.some(queued => queued.id === celebration.id)
    );

    if (newCelebrations.length > 0) {
      setCelebrationQueue(prev => [...prev, ...newCelebrations]);
    }
  }, [celebrations, activeCelebrations, celebrationQueue]);

  // Process celebration queue
  useEffect(() => {
    if (celebrationQueue.length > 0 && !currentCelebration) {
      const nextCelebration = celebrationQueue[0];
      const animationConfig = ANIMATION_CONFIGS[nextCelebration.animation] || ANIMATION_CONFIGS.gentle_sparkle;
      
      const activeCelebration: ActiveCelebration = {
        ...nextCelebration,
        isActive: true,
        startTime: Date.now(),
        duration: userPreferences.animationsEnabled ? animationConfig.duration : 2000
      };

      setCurrentCelebration(activeCelebration);
      setCelebrationQueue(prev => prev.slice(1));

      // Generate particles for animation
      if (userPreferences.animationsEnabled && !isLowBattery && deviceTier !== 'low') {
        generateParticles(animationConfig);
      }

      // Auto-complete celebration after duration
      setTimeout(() => {
        completeCelebration(activeCelebration.id);
      }, activeCelebration.duration);
    }
  }, [celebrationQueue, currentCelebration, userPreferences.animationsEnabled, isLowBattery, deviceTier]);

  const generateParticles = useCallback((config: typeof ANIMATION_CONFIGS[keyof typeof ANIMATION_CONFIGS]) => {
    const newParticles = Array.from({ length: config.particles }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: config.size === 'small' ? 4 : config.size === 'medium' ? 6 : 8
    }));

    setParticles(newParticles);

    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, config.duration);
  }, []);

  const completeCelebration = useCallback((celebrationId: string) => {
    setCurrentCelebration(null);
    onCelebrationComplete(celebrationId);
  }, [onCelebrationComplete]);

  const getPersonalizedMessage = useCallback((celebration: CelebrationEvent): string => {
    if (celebration.personalizedTouch) {
      return celebration.personalizedTouch;
    }

    const messages = CELEBRATION_MESSAGES[userPreferences.celebrationStyle]?.[celebration.type];
    if (messages && messages.length > 0) {
      return messages[Math.floor(Math.random() * messages.length)];
    }

    return celebration.message;
  }, [userPreferences.celebrationStyle]);

  const handleShare = useCallback((celebration: CelebrationEvent) => {
    if (onCelebrationShare && celebration.sharingOption) {
      onCelebrationShare(celebration);
    }
  }, [onCelebrationShare]);

  // Crisis mode adjustments
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};

  // Render particles
  const renderParticles = () => {
    if (!userPreferences.animationsEnabled || isLowBattery || !currentCelebration) return null;

    const animationConfig = ANIMATION_CONFIGS[currentCelebration.animation];
    
    return particles.map(particle => (
      <motion.div
        key={particle.id}
        style={{
          position: 'fixed',
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1.2, 0],
          y: animationConfig.movement === 'expanding' ? [0, -100] : 
             animationConfig.movement === 'spiraling' ? [0, -200] :
             animationConfig.movement === 'heart_pulse' ? [0, -50] : [0, -30],
          x: animationConfig.movement === 'spiraling' ? 
              [0, Math.sin(Date.now() / 1000) * 50] : 0
        }}
        transition={{
          duration: animationConfig.duration / 1000,
          ease: "easeOut"
        }}
      />
    ));
  };

  return (
    <>
      {/* Particle System */}
      {renderParticles()}

      {/* Main Celebration Modal */}
      <AnimatePresence>
        {currentCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 9998
            }}
            onClick={() => completeCelebration(currentCelebration.id)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ 
                type: "spring", 
                duration: 0.6,
                bounce: 0.3
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: isCrisisMode ? '12px' : '16px',
                padding: isCrisisMode ? '2.5rem' : '2rem',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                ...crisisStyles
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                style={{
                  fontSize: isCrisisMode ? '4rem' : '3rem',
                  marginBottom: '1rem'
                }}
              >
                {currentCelebration.type === 'streak_milestone' && '🌟'}
                {currentCelebration.type === 'skill_unlock' && '✨'}
                {currentCelebration.type === 'exercise_completion' && '🎯'}
                {currentCelebration.type === 'insight_moment' && '💡'}
                {currentCelebration.type === 'breakthrough' && '🚀'}
                {currentCelebration.type === 'return_celebration' && '🌈'}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  margin: '0 0 1rem 0',
                  color: '#2e2e2e',
                  fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
                  fontWeight: isCrisisMode ? '700' : '600'
                }}
              >
                {currentCelebration.title}
              </motion.h3>

              {/* Personalized Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  color: '#666',
                  fontSize: isCrisisMode ? '1.1rem' : '1rem',
                  lineHeight: '1.5',
                  margin: '0 0 1.5rem 0',
                  fontWeight: isCrisisMode ? '500' : 'normal'
                }}
              >
                {getPersonalizedMessage(currentCelebration)}
              </motion.p>

              {/* XP Award */}
              {currentCelebration.xpAwarded > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{
                    backgroundColor: '#a4b792',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: isCrisisMode ? '1rem' : '0.9rem',
                    fontWeight: '600',
                    margin: '0 auto 1.5rem auto',
                    display: 'inline-block'
                  }}
                >
                  +{currentCelebration.xpAwarded} XP
                </motion.div>
              )}

              {/* Badge Award */}
              {currentCelebration.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  style={{
                    backgroundColor: 'rgba(168, 183, 150, 0.1)',
                    border: '2px solid #a4b792',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div style={{
                    fontSize: isCrisisMode ? '2rem' : '1.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    🏆
                  </div>
                  <div style={{
                    fontSize: isCrisisMode ? '1rem' : '0.9rem',
                    color: '#667a5c',
                    fontWeight: '600'
                  }}>
                    Badge Earned: {currentCelebration.badge}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <button
                  onClick={() => completeCelebration(currentCelebration.id)}
                  style={{
                    backgroundColor: '#a4b792',
                    color: 'white',
                    border: 'none',
                    borderRadius: isCrisisMode ? '8px' : '10px',
                    padding: isCrisisMode ? '1rem 2rem' : '0.75rem 1.5rem',
                    fontSize: isCrisisMode ? '1rem' : '0.9rem',
                    fontWeight: isCrisisMode ? '700' : '600',
                    cursor: 'pointer',
                    minHeight: isCrisisMode ? '50px' : '40px',
                    minWidth: isCrisisMode ? '120px' : '100px'
                  }}
                >
                  {isCrisisMode ? 'Celebrate!' : 'Continue'}
                </button>

                {/* Share Button */}
                {currentCelebration.sharingOption && onCelebrationShare && (
                  <button
                    onClick={() => handleShare(currentCelebration)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#666',
                      border: '2px solid #e5e5e5',
                      borderRadius: isCrisisMode ? '8px' : '10px',
                      padding: isCrisisMode ? '1rem 2rem' : '0.75rem 1.5rem',
                      fontSize: isCrisisMode ? '1rem' : '0.9rem',
                      fontWeight: isCrisisMode ? '700' : '600',
                      cursor: 'pointer',
                      minHeight: isCrisisMode ? '50px' : '40px',
                      minWidth: isCrisisMode ? '120px' : '100px'
                    }}
                  >
                    Share Anonymously
                  </button>
                )}
              </div>

              {/* Subtle completion indicator */}
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: currentCelebration.duration / 1000, ease: "linear" }}
                style={{
                  height: '2px',
                  backgroundColor: '#a4b792',
                  borderRadius: '1px',
                  marginTop: '1.5rem',
                  opacity: 0.3
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini celebration notifications for background celebrations */}
      <div style={{
        position: 'fixed',
        top: isCrisisMode ? '2rem' : '1rem',
        right: isCrisisMode ? '2rem' : '1rem',
        zIndex: 9997,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <AnimatePresence>
          {celebrationQueue.slice(1, 3).map((celebration, index) => (
            <motion.div
              key={celebration.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ delay: index * 0.2 }}
              style={{
                backgroundColor: 'white',
                border: '2px solid #a4b792',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                maxWidth: '250px',
                fontSize: isCrisisMode ? '0.9rem' : '0.8rem'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>✨</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#2e2e2e' }}>
                    {celebration.title}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.75rem' }}>
                    {celebration.xpAwarded > 0 && `+${celebration.xpAwarded} XP`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}