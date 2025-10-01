'use client';

import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface SomaticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'crisis' | 'gentle';
  size?: 'standard' | 'large' | 'crisis' | 'emergency';
  disabled?: boolean;
  hapticFeedback?: boolean;
  nervousSystemAware?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

/**
 * SomaticButton - Button component designed to feel good in the body
 * Provides appropriate touch feedback, sizing, and visual responses
 */
export function SomaticButton({
  children,
  onClick,
  variant = 'primary',
  size = 'standard',
  disabled = false,
  hapticFeedback = true,
  nervousSystemAware = true,
  className = '',
  type = 'button',
  ariaLabel
}: SomaticButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [nervousState, setNervousState] = useState<'calm' | 'activated' | 'withdrawn'>('calm');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pressStartTime = useRef<number>(0);

  // Detect nervous system state based on interaction patterns
  useEffect(() => {
    if (!nervousSystemAware) return;

    const detectNervousState = () => {
      // Simple heuristic based on recent interactions
      const recentInteractions = performance.now() - pressStartTime.current;
      
      if (recentInteractions < 100) {
        setNervousState('activated'); // Very quick repeated presses
      } else if (recentInteractions > 3000) {
        setNervousState('withdrawn'); // Long delays between interactions
      } else {
        setNervousState('calm'); // Normal interaction timing
      }
    };

    const timer = setTimeout(detectNervousState, 200);
    return () => clearTimeout(timer);
  }, [isPressed, nervousSystemAware]);

  const handlePress = () => {
    if (disabled) return;

    pressStartTime.current = performance.now();
    setIsPressed(true);

    // Haptic feedback simulation through subtle visual response
    if (hapticFeedback && buttonRef.current) {
      buttonRef.current.style.transform = 'scale(0.98) translateY(1px)';
      
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = '';
        }
      }, 100);
    }

    // Execute click handler after brief delay to feel more responsive
    setTimeout(() => {
      onClick?.();
      setIsPressed(false);
    }, 80);
  };

  const getButtonClasses = () => {
    const baseClasses = 'somatic-button';
    
    const variantClasses = {
      primary: 'bg-sage-400 text-white border-sage-300',
      secondary: 'bg-white text-sage-600 border-sage-300',
      crisis: 'bg-crisis-red text-white border-crisis-red',
      gentle: 'bg-sage-50 text-sage-700 border-sage-200'
    };

    const sizeClasses = {
      standard: 'min-h-[56px] min-w-[56px] px-6 py-3',
      large: 'min-h-[64px] min-w-[64px] px-8 py-4',
      crisis: 'min-h-[72px] min-w-[72px] px-8 py-4',
      emergency: 'min-h-[80px] min-w-[80px] px-10 py-5'
    };

    const stateClasses = nervousSystemAware ? {
      calm: 'hover:shadow-lg',
      activated: 'hover:shadow-md animate-gentle-pulse',
      withdrawn: 'hover:shadow-sm opacity-90'
    }[nervousState] : '';

    const disabledClasses = disabled ? 
      'opacity-60 cursor-not-allowed touch-none' : 
      'cursor-pointer hover:-translate-y-0.5 active:translate-y-0';

    return [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      stateClasses,
      disabledClasses,
      isPressed ? 'scale-98' : '',
      className
    ].filter(Boolean).join(' ');
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={getButtonClasses()}
      onClick={handlePress}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        transition: 'all 200ms cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        touchAction: 'manipulation', // Prevents zoom on touch
        WebkitTapHighlightColor: 'transparent', // Removes iOS tap highlight
        outline: 'none'
      }}
      onFocus={(e) => {
        // Gentle focus indicator
        e.target.style.boxShadow = '0 0 0 3px rgba(164, 183, 146, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = '';
      }}
    >
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'inherit'
      }}>
        {children}
      </span>
    </button>
  );
}

/**
 * SomaticToggle - Switch component with embodied feedback
 */
interface SomaticToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'standard' | 'large';
  className?: string;
}

export function SomaticToggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'standard',
  className = ''
}: SomaticToggleProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const sizeStyles = {
    standard: { width: '48px', height: '28px' },
    large: { width: '56px', height: '32px' }
  };

  const thumbSize = {
    standard: '24px',
    large: '28px'
  };

  return (
    <label 
      className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className={`
          relative rounded-full transition-all duration-300 ease-out
          ${checked ? 'bg-sage-400' : 'bg-sage-200'}
          ${isFocused ? 'ring-2 ring-sage-300 ring-opacity-50' : ''}
        `}
        style={sizeStyles[size]}
      >
        <div
          className={`
            absolute top-0.5 rounded-full bg-white shadow-md
            transition-all duration-300 cubic-bezier(0.45, 0.05, 0.55, 0.95)
            ${checked ? 'translate-x-5' : 'translate-x-0.5'}
          `}
          style={{
            width: thumbSize[size],
            height: thumbSize[size],
            transform: checked 
              ? `translateX(${size === 'large' ? '24px' : '20px'})` 
              : 'translateX(2px)'
          }}
        />
      </div>
      
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
        className="sr-only"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {label && (
        <span className="somatic-text text-sm select-none">
          {label}
        </span>
      )}
    </label>
  );
}

/**
 * SomaticFloatingActionButton - Crisis-accessible floating button
 */
interface SomaticFloatingActionButtonProps {
  onClick: () => void;
  icon?: ReactNode;
  label: string;
  variant?: 'sage' | 'crisis' | 'emergency';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  breathingEffect?: boolean;
  className?: string;
}

export function SomaticFloatingActionButton({
  onClick,
  icon = '❤️',
  label,
  variant = 'sage',
  position = 'bottom-right',
  breathingEffect = true,
  className = ''
}: SomaticFloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const variantClasses = {
    sage: 'bg-sage-400 hover:bg-sage-500 text-white',
    crisis: 'bg-crisis-red hover:bg-crisis-red-hover text-white animate-gentle-pulse',
    emergency: 'bg-crisis-red hover:bg-crisis-red-hover text-white animate-crisis-attention'
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed z-50 w-16 h-16 rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-sage-300 focus:ring-opacity-50
        ${positionClasses[position]}
        ${variantClasses[variant]}
        ${breathingEffect ? 'breathing-grounding' : ''}
        ${className}
      `}
      aria-label={label}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>
        {icon}
      </span>
    </button>
  );
}