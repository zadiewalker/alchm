'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface SomaticFoundationProps {
  children: ReactNode;
  nervousSystemState?: 'ventral' | 'sympathetic' | 'dorsal' | 'auto';
  breathingEnabled?: boolean;
  className?: string;
}

/**
 * SomaticFoundation - Core container that provides embodied visual experience
 * Automatically applies grounding textures, breathing rhythms, and nervous system state awareness
 */
export function SomaticFoundation({ 
  children, 
  nervousSystemState = 'auto',
  breathingEnabled = true,
  className = '' 
}: SomaticFoundationProps) {
  const [detectedState, setDetectedState] = useState<'ventral' | 'sympathetic' | 'dorsal'>('ventral');
  const [isVisible, setIsVisible] = useState(false);

  // Auto-detect nervous system state based on interaction patterns
  useEffect(() => {
    if (nervousSystemState === 'auto') {
      // Simple heuristic: detect based on scroll speed, click patterns, etc.
      const detectState = () => {
        const scrollSpeed = Math.abs(window.scrollY - (window.scrollY || 0));
        
        if (scrollSpeed > 50) {
          setDetectedState('sympathetic'); // Fast scrolling = activated
        } else if (scrollSpeed < 5) {
          setDetectedState('dorsal'); // Very slow = potentially withdrawn
        } else {
          setDetectedState('ventral'); // Moderate = regulated
        }
      };

      window.addEventListener('scroll', detectState);
      return () => window.removeEventListener('scroll', detectState);
    } else {
      setDetectedState(nervousSystemState);
    }
  }, [nervousSystemState]);

  // Gentle fade-in on mount to avoid jarring appearance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stateClass = nervousSystemState === 'auto' ? 
    `nervous-system-${detectedState}` : 
    `nervous-system-${nervousSystemState}`;

  const breathingClass = breathingEnabled ? 'somatic-breathing-surface' : '';

  return (
    <div 
      className={`
        somatic-foundation 
        ${stateClass} 
        ${breathingClass}
        ${isVisible ? 'animate-gentle-fade' : 'opacity-0'}
        ${className}
      `}
      style={{
        transition: 'all 800ms cubic-bezier(0.4, 0, 0.6, 1)',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
}

/**
 * SomaticContainer - Provides safe containment with grounding texture
 */
interface SomaticContainerProps {
  children: ReactNode;
  variant?: 'safe' | 'activated' | 'shutdown';
  className?: string;
}

export function SomaticContainer({ 
  children, 
  variant = 'safe', 
  className = '' 
}: SomaticContainerProps) {
  return (
    <div className={`
      somatic-safe-container
      nervous-state-${variant}
      somatic-grounding-anchor
      ${className}
    `}>
      {children}
    </div>
  );
}

/**
 * SomaticBreathingGuide - Visual breathing rhythm guide
 */
interface SomaticBreathingGuideProps {
  size?: 'small' | 'medium' | 'large';
  intensity?: 'subtle' | 'moderate' | 'prominent';
  className?: string;
}

export function SomaticBreathingGuide({ 
  size = 'medium', 
  intensity = 'moderate',
  className = '' 
}: SomaticBreathingGuideProps) {
  const sizeMap = {
    small: '40px',
    medium: '60px',
    large: '80px'
  };

  const intensityMap = {
    subtle: 0.3,
    moderate: 0.5,
    prominent: 0.7
  };

  return (
    <div 
      className={`breathing-coherent ${className}`}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(164, 183, 146, ${intensityMap[intensity]}) 0%, transparent 70%)`,
        position: 'relative',
        margin: '0 auto'
      }}
      aria-label="Breathing rhythm guide"
      role="img"
    >
      <div 
        style={{
          position: 'absolute',
          inset: '20%',
          borderRadius: '50%',
          background: `rgba(164, 183, 146, ${intensityMap[intensity] * 0.5})`,
          animation: 'heart-coherence 5000ms ease-in-out infinite'
        }}
      />
    </div>
  );
}

/**
 * SomaticSpacer - Provides embodied spacing that feels natural
 */
interface SomaticSpacerProps {
  space: 'intimate' | 'personal' | 'social' | 'public';
  orientation?: 'vertical' | 'horizontal';
  withGrounding?: boolean;
}

export function SomaticSpacer({ 
  space, 
  orientation = 'vertical',
  withGrounding = false 
}: SomaticSpacerProps) {
  const spacingMap = {
    intimate: 'var(--somatic-space-intimate)',
    personal: 'var(--somatic-space-personal)',
    social: 'var(--somatic-space-social)',
    public: 'var(--somatic-space-public)'
  };

  const style = orientation === 'vertical' 
    ? { height: spacingMap[space], width: '100%' }
    : { width: spacingMap[space], height: '100%' };

  return (
    <div 
      style={style}
      className={withGrounding ? 'somatic-grounding-anchor' : ''}
      aria-hidden="true"
    />
  );
}

/**
 * SomaticText - Typography that reduces bodily tension
 */
interface SomaticTextProps {
  children: ReactNode;
  variant?: 'body' | 'heading' | 'crisis';
  element?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
}

export function SomaticText({ 
  children, 
  variant = 'body',
  element = 'p',
  className = '' 
}: SomaticTextProps) {
  const Component = element;
  
  const variantClass = {
    body: 'somatic-text somatic-paragraph',
    heading: 'somatic-heading',
    crisis: 'somatic-crisis-text'
  }[variant];

  return (
    <Component className={`${variantClass} ${className}`}>
      {children}
    </Component>
  );
}