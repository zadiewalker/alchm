'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealingLoadingStatesProps {
  /** Type of loading animation */
  variant?: 'breathing' | 'dots' | 'sanctuary' | 'lotus' | 'waves' | 'minimal';
  /** Size of the loading indicator */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Loading message for screen readers and display */
  message?: string;
  /** Whether this is for a crisis situation (reduces motion) */
  crisisMode?: boolean;
  /** Battery conservation mode */
  batterySaver?: boolean;
  /** High contrast accessibility mode */
  highContrast?: boolean;
  /** Custom healing affirmation */
  affirmation?: string;
  /** Show percentage if available */
  progress?: number;
  /** Custom className */
  className?: string;
}

interface SkeletonLoadingProps {
  /** Type of content being loaded */
  type?: 'text' | 'card' | 'journal' | 'dashboard' | 'button';
  /** Number of skeleton items */
  count?: number;
  /** Custom className */
  className?: string;
  /** Crisis mode reduces animations */
  crisisMode?: boolean;
}

const HealingLoadingStates: React.FC<HealingLoadingStatesProps> = ({
  variant = 'breathing',
  size = 'md',
  message = 'Loading your sanctuary...',
  crisisMode = false,
  batterySaver = false,
  highContrast = false,
  affirmation,
  progress,
  className = ''
}) => {
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Healing affirmations for loading states
  const healingAffirmations = [
    'You are safe in this moment',
    'Your feelings are valid',
    'Healing happens one breath at a time',
    'You are worthy of peace',
    'This too shall pass',
    'You are not alone',
    'Each moment is a new beginning',
    'Your journey matters'
  ];

  // Rotate through affirmations if provided
  useEffect(() => {
    if (affirmation || !batterySaver) {
      const affirmationText = affirmation || healingAffirmations[Math.floor(Math.random() * healingAffirmations.length)];
      setCurrentAffirmation(affirmationText);
      
      if (!affirmation && !batterySaver) {
        const interval = setInterval(() => {
          setCurrentAffirmation(healingAffirmations[Math.floor(Math.random() * healingAffirmations.length)]);
        }, 4000);
        return () => clearInterval(interval);
      }
    }
  }, [affirmation, batterySaver]);

  // Size configuration
  const sizeConfig = {
    sm: { container: 'w-8 h-8', dot: 'w-2 h-2', text: 'text-sm' },
    md: { container: 'w-12 h-12', dot: 'w-3 h-3', text: 'text-base' },
    lg: { container: 'w-16 h-16', dot: 'w-4 h-4', text: 'text-lg' },
    xl: { container: 'w-24 h-24', dot: 'w-6 h-6', text: 'text-xl' }
  };

  const config = sizeConfig[size];

  // Breathing animation component
  const BreathingLoader = () => (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <motion.div
        className={`${config.container} rounded-full border-2 border-sage-primary flex items-center justify-center`}
        animate={!batterySaver && !crisisMode ? {
          scale: [1, 1.2, 1],
          borderColor: ['#a4b792', '#93a682', '#a4b792']
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <span className="text-2xl" role="img" aria-label="breathing">🫁</span>
      </motion.div>
      
      {!batterySaver && (
        <motion.p
          className={`${config.text} text-sage-600 text-center max-w-xs`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentAffirmation}
        </motion.p>
      )}
    </div>
  );

  // Dots animation component
  const DotsLoader = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${config.dot} rounded-full ${
            highContrast ? 'bg-black' : 'bg-sage-primary'
          }`}
          animate={!batterySaver && !crisisMode ? {
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );

  // Sanctuary animation component
  const SanctuaryLoader = () => (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className={`${config.container} relative`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-sage-light"
          animate={!batterySaver && !crisisMode ? {
            rotate: 360,
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-sage-primary"
          animate={!batterySaver && !crisisMode ? {
            rotate: -360,
            scale: [1, 0.9, 1]
          } : {}}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl" role="img" aria-label="sanctuary">🏛️</span>
        </div>
      </div>
      
      <p className={`${config.text} text-sage-600 text-center`}>
        {message}
      </p>
    </div>
  );

  // Lotus animation component
  const LotusLoader = () => (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <motion.div
        className={`${config.container} flex items-center justify-center`}
        animate={!batterySaver && !crisisMode ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <span className="text-4xl" role="img" aria-label="lotus">🪷</span>
      </motion.div>
      
      {progress !== undefined && (
        <div className="w-full max-w-xs bg-sage-light rounded-full h-2">
          <motion.div
            className="bg-sage-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );

  // Waves animation component
  const WavesLoader = () => (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-1 bg-sage-primary rounded-full ${
            size === 'sm' ? 'h-4' : size === 'md' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-12'
          }`}
          animate={!batterySaver && !crisisMode ? {
            scaleY: [1, 2, 1],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );

  // Minimal loader for battery saver mode
  const MinimalLoader = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${config.container} border-2 border-sage-primary rounded-full 
                      border-t-transparent animate-spin`} 
           style={{ animationDuration: crisisMode ? '2s' : '1s' }} />
      <span className={`${config.text} text-sage-600`}>
        {batterySaver ? 'Loading...' : message}
      </span>
    </div>
  );

  // Render appropriate variant
  const renderLoader = () => {
    if (batterySaver || crisisMode) return <MinimalLoader />;
    
    switch (variant) {
      case 'breathing': return <BreathingLoader />;
      case 'dots': return <DotsLoader />;
      case 'sanctuary': return <SanctuaryLoader />;
      case 'lotus': return <LotusLoader />;
      case 'waves': return <WavesLoader />;
      case 'minimal': return <MinimalLoader />;
      default: return <BreathingLoader />;
    }
  };

  return (
    <div className="flex items-center justify-center p-8" role="status" aria-live="polite">
      {renderLoader()}
      <span className="sr-only">{message}</span>
    </div>
  );
};

// Skeleton loading component for content placeholders
export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  type = 'text',
  count = 1,
  className = '',
  crisisMode = false
}) => {
  const getSkeletonElements = () => {
    switch (type) {
      case 'text':
        return Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`sanctuary-skeleton h-4 rounded ${
              i === count - 1 ? 'w-3/4' : 'w-full'
            } mb-2`}
            style={{
              animationDelay: crisisMode ? '0s' : `${i * 0.1}s`
            }}
          />
        ));
        
      case 'card':
        return Array.from({ length: count }, (_, i) => (
          <div key={i} className="sanctuary-glass p-6 rounded-lg space-y-4">
            <div className="sanctuary-skeleton h-6 w-3/4 rounded" />
            <div className="sanctuary-skeleton h-4 w-full rounded" />
            <div className="sanctuary-skeleton h-4 w-5/6 rounded" />
            <div className="sanctuary-skeleton h-8 w-24 rounded" />
          </div>
        ));
        
      case 'journal':
        return Array.from({ length: count }, (_, i) => (
          <div key={i} className="space-y-4 p-4 border border-sage-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="sanctuary-skeleton w-8 h-8 rounded-full" />
              <div className="sanctuary-skeleton h-4 w-32 rounded" />
            </div>
            <div className="sanctuary-skeleton h-20 w-full rounded" />
            <div className="flex space-x-2">
              <div className="sanctuary-skeleton h-6 w-16 rounded-full" />
              <div className="sanctuary-skeleton h-6 w-20 rounded-full" />
            </div>
          </div>
        ));
        
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="sanctuary-glass p-6 rounded-lg">
                <div className="sanctuary-skeleton h-8 w-3/4 rounded mb-4" />
                <div className="sanctuary-skeleton h-24 w-full rounded mb-4" />
                <div className="sanctuary-skeleton h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        );
        
      case 'button':
        return Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="sanctuary-skeleton h-12 w-32 rounded-lg"
            style={{
              animationDelay: crisisMode ? '0s' : `${i * 0.1}s`
            }}
          />
        ));
        
      default:
        return (
          <div className="sanctuary-skeleton h-4 w-full rounded" />
        );
    }
  };

  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      {getSkeletonElements()}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

// Loading overlay for full-screen loading states
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  variant?: HealingLoadingStatesProps['variant'];
  message?: string;
  onCancel?: () => void;
  batterySaver?: boolean;
  crisisMode?: boolean;
}> = ({
  isVisible,
  variant = 'breathing',
  message = 'Loading...',
  onCancel,
  batterySaver = false,
  crisisMode = false
}) => {
  // Prevent body scroll when overlay is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-sanctuary-white bg-opacity-95 backdrop-blur-sm 
                     flex items-center justify-center"
          style={{ backdropFilter: batterySaver ? 'none' : 'blur(4px)' }}
        >
          <div className="text-center space-y-6 max-w-sm mx-auto px-6">
            <HealingLoadingStates
              variant={variant}
              size="lg"
              message={message}
              batterySaver={batterySaver}
              crisisMode={crisisMode}
            />
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="sanctuary-btn-secondary mt-8"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HealingLoadingStates;