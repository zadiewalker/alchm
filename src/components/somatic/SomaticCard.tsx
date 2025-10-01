'use client';

import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface SomaticCardProps {
  children: ReactNode;
  variant?: 'sanctuary' | 'glass' | 'grounding' | 'breathing';
  nervousSystemState?: 'safe' | 'activated' | 'shutdown' | 'auto';
  elevation?: 'flat' | 'subtle' | 'moderate' | 'prominent';
  interactive?: boolean;
  breathingEffect?: boolean;
  className?: string;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
}

/**
 * SomaticCard - Card component that provides containment and grounding
 */
export function SomaticCard({
  children,
  variant = 'sanctuary',
  nervousSystemState = 'safe',
  elevation = 'moderate',
  interactive = false,
  breathingEffect = false,
  className = '',
  onClick,
  onHover
}: SomaticCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [detectedState, setDetectedState] = useState(nervousSystemState);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-detect nervous system state based on interaction patterns
  useEffect(() => {
    if (nervousSystemState === 'auto') {
      // Simple heuristic based on hover patterns
      let hoverDuration = 0;
      let hoverStartTime = 0;

      const trackHover = () => {
        if (isHovered) {
          hoverStartTime = performance.now();
        } else if (hoverStartTime) {
          hoverDuration = performance.now() - hoverStartTime;
          
          if (hoverDuration < 100) {
            setDetectedState('activated'); // Very quick hovers
          } else if (hoverDuration > 2000) {
            setDetectedState('shutdown'); // Long, hesitant hovers
          } else {
            setDetectedState('safe'); // Normal interaction
          }
        }
      };

      trackHover();
    }
  }, [isHovered, nervousSystemState]);

  const getCardClasses = () => {
    const baseClasses = 'somatic-foundation';
    
    const variantClasses = {
      sanctuary: 'card-sanctuary',
      glass: 'card-glass',
      grounding: 'somatic-grounding-anchor somatic-safe-container',
      breathing: 'somatic-breathing-surface somatic-safe-container'
    };

    const stateClasses = {
      safe: 'nervous-state-safe',
      activated: 'nervous-state-activated',
      shutdown: 'nervous-state-shutdown'
    };

    const elevationClasses = {
      flat: '',
      subtle: 'shadow-sm',
      moderate: 'shadow-md hover:shadow-lg',
      prominent: 'shadow-lg hover:shadow-xl'
    };

    const interactiveClasses = interactive ? [
      'cursor-pointer',
      'transition-all duration-300 ease-out',
      isHovered ? 'transform -translate-y-1' : '',
      isPressed ? 'transform scale-98' : ''
    ].join(' ') : '';

    const breathingClasses = breathingEffect ? 'breathing-coherent' : '';

    const currentState = nervousSystemState === 'auto' ? detectedState : nervousSystemState;

    return [
      baseClasses,
      variantClasses[variant],
      stateClasses[currentState],
      elevationClasses[elevation],
      interactiveClasses,
      breathingClasses,
      className
    ].filter(Boolean).join(' ');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    onHover?.(false);
  };

  const handleMouseDown = () => {
    if (interactive) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={getCardClasses()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      style={{
        borderRadius: '24px',
        padding: 'var(--somatic-space-social)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
}

/**
 * SomaticCardHeader - Card header with somatic spacing
 */
interface SomaticCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function SomaticCardHeader({ children, className = '' }: SomaticCardHeaderProps) {
  return (
    <div className={`card-header somatic-space-personal ${className}`}>
      {children}
    </div>
  );
}

/**
 * SomaticCardContent - Card content area with breathing room
 */
interface SomaticCardContentProps {
  children: ReactNode;
  spacing?: 'compact' | 'comfortable' | 'spacious';
  className?: string;
}

export function SomaticCardContent({ 
  children, 
  spacing = 'comfortable',
  className = '' 
}: SomaticCardContentProps) {
  const spacingClasses = {
    compact: 'somatic-space-intimate',
    comfortable: 'somatic-space-personal',
    spacious: 'somatic-space-social'
  };

  return (
    <div className={`card-content ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * SomaticCardActions - Card actions with proper touch targets
 */
interface SomaticCardActionsProps {
  children: ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  className?: string;
}

export function SomaticCardActions({ 
  children, 
  alignment = 'left',
  className = '' 
}: SomaticCardActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between'
  };

  return (
    <div className={`
      card-actions 
      flex gap-3 items-center 
      ${alignmentClasses[alignment]}
      somatic-space-personal
      ${className}
    `}>
      {children}
    </div>
  );
}

/**
 * SomaticProgressCard - Card that shows progress with somatic feedback
 */
interface SomaticProgressCardProps {
  title: string;
  progress: number; // 0-100
  description?: string;
  icon?: ReactNode;
  breathingSync?: boolean;
  className?: string;
}

export function SomaticProgressCard({
  title,
  progress,
  description,
  icon,
  breathingSync = true,
  className = ''
}: SomaticProgressCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress with breathing rhythm
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <SomaticCard 
      variant="sanctuary" 
      breathingEffect={breathingSync}
      className={className}
    >
      <SomaticCardHeader>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex-shrink-0 text-sage-600">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="somatic-heading text-lg font-medium text-sage-800">
              {title}
            </h3>
            {description && (
              <p className="somatic-text text-sm text-sage-600 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </SomaticCardHeader>

      <SomaticCardContent spacing="comfortable">
        <div className="relative">
          {/* Progress background */}
          <div 
            className="h-2 bg-sage-100 rounded-full overflow-hidden"
            style={{ borderRadius: '12px' }}
          >
            {/* Progress fill with breathing effect */}
            <div
              className={`h-full bg-sage-400 rounded-full transition-all duration-1000 ease-out ${breathingSync ? 'breathing-grounding' : ''}`}
              style={{ 
                width: `${animatedProgress}%`,
                borderRadius: '12px'
              }}
            />
          </div>
          
          {/* Progress percentage */}
          <div className="flex justify-between items-center mt-2">
            <span className="somatic-text text-xs text-sage-600">
              Progress
            </span>
            <span className="somatic-text text-sm font-medium text-sage-800">
              {Math.round(animatedProgress)}%
            </span>
          </div>
        </div>
      </SomaticCardContent>
    </SomaticCard>
  );
}

/**
 * SomaticEmptyState - Card for empty states with gentle encouragement
 */
interface SomaticEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SomaticEmptyState({
  title,
  description,
  action,
  icon = '🌱',
  className = ''
}: SomaticEmptyStateProps) {
  return (
    <SomaticCard 
      variant="grounding" 
      elevation="subtle"
      className={`text-center ${className}`}
    >
      <SomaticCardContent spacing="spacious">
        <div className="breathing-grounding text-4xl mb-4" role="img" aria-hidden="true">
          {icon}
        </div>
        
        <h3 className="somatic-heading text-lg font-medium text-sage-800 mb-2">
          {title}
        </h3>
        
        <p className="somatic-text text-sage-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
        
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </SomaticCardContent>
    </SomaticCard>
  );
}