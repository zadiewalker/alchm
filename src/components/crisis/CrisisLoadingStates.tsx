/**
 * ALCHM Crisis Loading States Component
 * 
 * MISSION CRITICAL: Trauma-informed loading states that don't create anxiety.
 * Designed specifically for vulnerable moments when users are in crisis.
 * 
 * Design Principles:
 * - Gentle, breathing-like animations that feel supportive
 * - No jarring or sudden movements that could startle
 * - Calming colors that soothe rather than agitate
 * - Clear progress indication without time pressure
 * - Supportive messaging during loading periods
 * - Reduced motion support for accessibility
 * - Offline-friendly fallbacks
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Shield, 
  Sun, 
  Moon, 
  Leaf,
  Waves,
  Wind,
  Cloud
} from 'lucide-react';

export type LoadingVariant = 
  | 'breathing'     // Gentle breathing animation
  | 'pulse'         // Soft pulsing effect
  | 'wave'          // Calming wave motion
  | 'grow'          // Organic growth animation
  | 'flow'          // Flowing particle effect
  | 'minimal';      // Minimal static loading

export type LoadingSize = 
  | 'small'         // 24px
  | 'medium'        // 48px
  | 'large'         // 72px
  | 'fullscreen';   // Full viewport

interface CrisisLoadingStatesProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  message?: string;
  supportiveText?: string;
  progress?: number; // 0-100, undefined for indeterminate
  className?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  isVisible?: boolean;
  onTimeout?: () => void;
  timeoutMs?: number;
}

/**
 * Crisis Loading States Component
 * 
 * Provides trauma-informed loading animations and progress indicators
 */
export const CrisisLoadingStates: React.FC<CrisisLoadingStatesProps> = ({
  variant = 'breathing',
  size = 'medium',
  message = 'Loading...',
  supportiveText,
  progress,
  className = '',
  showIcon = true,
  icon,
  isVisible = true,
  onTimeout,
  timeoutMs = 30000 // 30 second timeout
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress || 0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Handle timeout
  useEffect(() => {
    if (timeoutMs && onTimeout) {
      const timer = setTimeout(() => {
        setHasTimedOut(true);
        onTimeout();
      }, timeoutMs);

      return () => clearTimeout(timer);
    }
  }, [timeoutMs, onTimeout]);

  // Smooth progress animation
  useEffect(() => {
    if (typeof progress === 'number') {
      const timer = setTimeout(() => {
        setCurrentProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Get default icon based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case 'breathing':
      case 'pulse':
        return <Heart size={24} />;
      case 'wave':
        return <Waves size={24} />;
      case 'grow':
        return <Leaf size={24} />;
      case 'flow':
        return <Wind size={24} />;
      default:
        return <Shield size={24} />;
    }
  };

  const displayIcon = icon || getDefaultIcon();

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className={`crisis-loading-states crisis-loading--${variant} crisis-loading--${size} ${className}`}>
      <div className="crisis-loading-container">
        {/* Loading Animation */}
        <div className="crisis-loading-animation">
          {showIcon && (
            <div className="crisis-loading-icon">
              {displayIcon}
            </div>
          )}
          
          {/* Variant-specific animations */}
          {variant === 'breathing' && (
            <div className="breathing-circles">
              <div className="breathing-circle breathing-circle--1"></div>
              <div className="breathing-circle breathing-circle--2"></div>
              <div className="breathing-circle breathing-circle--3"></div>
            </div>
          )}
          
          {variant === 'pulse' && (
            <div className="pulse-rings">
              <div className="pulse-ring pulse-ring--1"></div>
              <div className="pulse-ring pulse-ring--2"></div>
            </div>
          )}
          
          {variant === 'wave' && (
            <div className="wave-container">
              <div className="wave wave--1"></div>
              <div className="wave wave--2"></div>
              <div className="wave wave--3"></div>
            </div>
          )}
          
          {variant === 'grow' && (
            <div className="growth-container">
              <div className="growth-element growth-element--1"></div>
              <div className="growth-element growth-element--2"></div>
              <div className="growth-element growth-element--3"></div>
            </div>
          )}
          
          {variant === 'flow' && (
            <div className="flow-container">
              <div className="flow-particle flow-particle--1"></div>
              <div className="flow-particle flow-particle--2"></div>
              <div className="flow-particle flow-particle--3"></div>
              <div className="flow-particle flow-particle--4"></div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="crisis-progress-container">
            <div className="crisis-progress-bar">
              <div 
                className="crisis-progress-fill"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="crisis-progress-text">
              {Math.round(currentProgress)}%
            </div>
          </div>
        )}

        {/* Loading Messages */}
        <div className="crisis-loading-content">
          {message && (
            <h3 className="crisis-loading-message">{message}</h3>
          )}
          
          {supportiveText && (
            <p className="crisis-loading-supportive">{supportiveText}</p>
          )}
          
          {hasTimedOut && (
            <div className="crisis-loading-timeout">
              <p>Taking longer than expected. You can continue safely.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .crisis-loading-states {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .crisis-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        /* Size Variants */
        .crisis-loading--small .crisis-loading-animation {
          width: 24px;
          height: 24px;
        }

        .crisis-loading--medium .crisis-loading-animation {
          width: 48px;
          height: 48px;
        }

        .crisis-loading--large .crisis-loading-animation {
          width: 72px;
          height: 72px;
        }

        .crisis-loading--fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--crisis-sanctuary-warm, #fefcfb);
          z-index: 9999;
        }

        .crisis-loading--fullscreen .crisis-loading-animation {
          width: 96px;
          height: 96px;
        }

        /* Loading Animation Container */
        .crisis-loading-animation {
          position: relative;
          margin-bottom: 2rem;
        }

        .crisis-loading-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--crisis-sage-primary, #8ba675);
          z-index: 10;
        }

        /* Breathing Animation */
        .breathing-circles {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .breathing-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            var(--crisis-sage-primary, #8ba675) 0%,
            var(--crisis-sage-light, #f7f9f6) 70%,
            transparent 100%
          );
          opacity: 0.3;
        }

        .breathing-circle--1 {
          animation: crisis-breathe 4s ease-in-out infinite;
        }

        .breathing-circle--2 {
          animation: crisis-breathe 4s ease-in-out infinite 1.3s;
          opacity: 0.2;
        }

        .breathing-circle--3 {
          animation: crisis-breathe 4s ease-in-out infinite 2.6s;
          opacity: 0.1;
        }

        @keyframes crisis-breathe {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
        }

        /* Pulse Animation */
        .pulse-rings {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .pulse-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid var(--crisis-sage-primary, #8ba675);
          border-radius: 50%;
          opacity: 0;
        }

        .pulse-ring--1 {
          animation: crisis-pulse-ring 2s ease-out infinite;
        }

        .pulse-ring--2 {
          animation: crisis-pulse-ring 2s ease-out infinite 1s;
        }

        @keyframes crisis-pulse-ring {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* Wave Animation */
        .wave-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 50%;
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            180deg,
            transparent 50%,
            var(--crisis-sage-primary, #8ba675) 50%
          );
          border-radius: 50%;
          opacity: 0.3;
        }

        .wave--1 {
          animation: crisis-wave 3s ease-in-out infinite;
        }

        .wave--2 {
          animation: crisis-wave 3s ease-in-out infinite 1s;
          opacity: 0.2;
        }

        .wave--3 {
          animation: crisis-wave 3s ease-in-out infinite 2s;
          opacity: 0.1;
        }

        @keyframes crisis-wave {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20%) rotate(180deg);
          }
        }

        /* Growth Animation */
        .growth-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .growth-element {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20%;
          height: 20%;
          background: var(--crisis-sage-primary, #8ba675);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.6;
        }

        .growth-element--1 {
          animation: crisis-grow 3s ease-in-out infinite;
        }

        .growth-element--2 {
          animation: crisis-grow 3s ease-in-out infinite 1s;
          opacity: 0.4;
        }

        .growth-element--3 {
          animation: crisis-grow 3s ease-in-out infinite 2s;
          opacity: 0.2;
        }

        @keyframes crisis-grow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            transform: translate(-50%, -50%) scale(2);
          }
        }

        /* Flow Animation */
        .flow-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .flow-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--crisis-sage-primary, #8ba675);
          border-radius: 50%;
          opacity: 0;
        }

        .flow-particle--1 {
          top: 0;
          left: 50%;
          animation: crisis-flow-1 2s ease-in-out infinite;
        }

        .flow-particle--2 {
          top: 50%;
          right: 0;
          animation: crisis-flow-2 2s ease-in-out infinite 0.5s;
        }

        .flow-particle--3 {
          bottom: 0;
          left: 50%;
          animation: crisis-flow-3 2s ease-in-out infinite 1s;
        }

        .flow-particle--4 {
          top: 50%;
          left: 0;
          animation: crisis-flow-4 2s ease-in-out infinite 1.5s;
        }

        @keyframes crisis-flow-1 {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(100%); }
        }

        @keyframes crisis-flow-2 {
          0%, 100% { opacity: 0; transform: translateX(0); }
          50% { opacity: 0.8; transform: translateX(-100%); }
        }

        @keyframes crisis-flow-3 {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(-100%); }
        }

        @keyframes crisis-flow-4 {
          0%, 100% { opacity: 0; transform: translateX(0); }
          50% { opacity: 0.8; transform: translateX(100%); }
        }

        /* Progress Bar */
        .crisis-progress-container {
          width: 100%;
          margin: 1rem 0;
        }

        .crisis-progress-bar {
          width: 100%;
          height: 8px;
          background: var(--crisis-sage-muted, #e8ede4);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .crisis-progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--crisis-sage-primary, #8ba675) 0%,
            var(--crisis-sage-deep, #6b8559) 100%
          );
          border-radius: 4px;
          transition: width 0.3s ease;
          position: relative;
        }

        .crisis-progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: crisis-progress-shine 2s ease-in-out infinite;
        }

        @keyframes crisis-progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .crisis-progress-text {
          text-align: center;
          font-size: 0.875rem;
          color: var(--crisis-sage-deep, #6b8559);
          font-weight: 500;
        }

        /* Loading Content */
        .crisis-loading-content {
          width: 100%;
        }

        .crisis-loading-message {
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--crisis-sage-deep, #6b8559);
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .crisis-loading-supportive {
          font-size: 1rem;
          color: var(--crisis-neutral-600, #6c757d);
          line-height: 1.6;
          margin: 0;
        }

        .crisis-loading-timeout {
          margin-top: 1rem;
          padding: 1rem;
          background: var(--crisis-support-yellow, #c4b87d);
          color: white;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        /* Minimal Variant */
        .crisis-loading--minimal .breathing-circles,
        .crisis-loading--minimal .pulse-rings,
        .crisis-loading--minimal .wave-container,
        .crisis-loading--minimal .growth-container,
        .crisis-loading--minimal .flow-container {
          display: none;
        }

        .crisis-loading--minimal .crisis-loading-icon {
          position: static;
          transform: none;
          opacity: 0.6;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .crisis-loading-states {
            padding: 1.5rem;
          }

          .crisis-loading--large .crisis-loading-animation {
            width: 60px;
            height: 60px;
          }

          .crisis-loading--fullscreen .crisis-loading-animation {
            width: 80px;
            height: 80px;
          }

          .crisis-loading-message {
            font-size: 1.25rem;
          }

          .crisis-loading-supportive {
            font-size: 1.125rem;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .crisis-progress-bar {
            border: 2px solid var(--crisis-sage-deep, #6b8559);
          }

          .breathing-circle,
          .pulse-ring,
          .wave,
          .growth-element,
          .flow-particle {
            opacity: 0.8;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .breathing-circle,
          .pulse-ring,
          .wave,
          .growth-element,
          .flow-particle {
            animation: none;
          }

          .crisis-progress-fill::after {
            animation: none;
          }

          .crisis-loading-icon {
            opacity: 0.8;
          }

          .breathing-circles,
          .pulse-rings,
          .wave-container,
          .growth-container,
          .flow-container {
            opacity: 0.3;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .crisis-loading--fullscreen {
            background: var(--crisis-sanctuary-dark, #1a1d1a);
          }
        }
      `}</style>
    </div>
  );
};

// Preset configurations for common use cases
export const CrisisLoadingPresets = {
  ResourceLoading: (props: Partial<CrisisLoadingStatesProps>) => (
    <CrisisLoadingStates
      variant="breathing"
      size="medium"
      message="Loading crisis resources..."
      supportiveText="Getting help ready for you"
      icon={<Shield size={24} />}
      {...props}
    />
  ),

  EmergencyConnecting: (props: Partial<CrisisLoadingStatesProps>) => (
    <CrisisLoadingStates
      variant="pulse"
      size="large"
      message="Connecting to support..."
      supportiveText="You're not alone. Help is on the way."
      icon={<Heart size={32} />}
      pulseAnimation={true}
      {...props}
    />
  ),

  SafeTransition: (props: Partial<CrisisLoadingStatesProps>) => (
    <CrisisLoadingStates
      variant="wave"
      size="medium"
      message="Creating safe space..."
      supportiveText="Take a deep breath. You're in a safe place."
      icon={<Leaf size={24} />}
      {...props}
    />
  ),

  MinimalProgress: (props: Partial<CrisisLoadingStatesProps>) => (
    <CrisisLoadingStates
      variant="minimal"
      size="small"
      message="Processing..."
      showIcon={false}
      {...props}
    />
  )
};

export default CrisisLoadingStates;