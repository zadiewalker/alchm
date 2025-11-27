/*
 * ALCHM Sacred Design System - Button Component
 * 
 * Every touch must pass the sanctuary test:
 * "Does this feel like entering a sanctuary, or operating software?"
 * 
 * Trauma-informed interactions that breathe with the user's emotional state.
 */

'use client';

import React, { forwardRef } from 'react';
import { COLORS, SPACING, RADIUS, ANIMATION, A11Y } from '@/design-system/tokens';
import { DESIGN_CONSTANTS, COMPONENT_SPECS, SAGE_SYSTEM, duration } from '@/design-system/foundation';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'crisis' | 'outline' | 'minimal';
  size?: 'small' | 'medium' | 'large' | 'crisis';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  reducedMotion?: boolean;
  elevation?: 'flat' | 'subtle' | 'gentle' | 'prominent';
  as?: 'button' | 'a'; // Allow anchor tag rendering
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  reducedMotion = false,
  elevation = 'subtle',
  as = 'button',
  disabled,
  onClick,
  style,
  ...props 
}, ref) => {
  
  // Jony Ive Perfect Foundation - Mathematical Precision
  const baseClasses = cn([
    // Typography - Perfect optical balance
    'font-medium tracking-tight',
    
    // Mathematical border radius - Golden ratio inspired  
    'rounded-[12px]', // Perfect balance of modern and approachable
    
    // Perfect transitions - Natural easing 
    !reducedMotion && [
      'transition-all duration-300', 
      'ease-[cubic-bezier(0.25,0.46,0.45,0.94)]', // Apple's standard easing
      'transform-gpu', // Hardware acceleration
    ],
    
    // Perfect focus states - Accessibility excellence
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-sage-400/40',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-sanctuary',
    
    // Disabled states - Gentle degradation
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'disabled:transform-none disabled:shadow-none',
    
    // Layout perfection - Mathematical precision
    'relative inline-flex items-center justify-center',
    'select-none whitespace-nowrap',
    
    // Perfect spacing - 8px base unit system
    'gap-2', // 8px between icon and text
    
    // Gentle micro-interactions
    !reducedMotion && !disabled && [
      'hover:scale-[1.02]', // Subtle hover scale
      'active:scale-[0.98]', // Satisfying press feedback
    ],
    
    // Width handling
    fullWidth && 'w-full',
    
    // Loading state
    loading && 'cursor-wait',
  ]);
  
  // Perfect Variant System - Mathematical Color Science
  const variantStyles = {
    primary: cn([
      'bg-sage-400 text-sanctuary-50',
      'hover:bg-sage-500 hover:text-white',
      'border border-sage-400',
      'shadow-gentle hover:shadow-blessing',
      !reducedMotion && 'hover:shadow-sage-400/20',
    ]),
    
    secondary: cn([
      'bg-sanctuary text-charcoal-800', 
      'hover:bg-sage-50 hover:text-charcoal-900',
      'border border-sage-200 hover:border-sage-300',
      'shadow-whisper hover:shadow-gentle',
    ]),

    outline: cn([
      'bg-transparent text-sage-600',
      'hover:bg-sage-50 hover:text-sage-700',
      'border border-sage-400 hover:border-sage-500',
      'shadow-none hover:shadow-whisper',
    ]),
    
    ghost: cn([
      'bg-sage-400/8 text-sage-700',
      'hover:bg-sage-400/16 hover:text-sage-800', 
      'border border-transparent',
      'shadow-none',
    ]),
    
    text: cn([
      'bg-transparent text-sage-600',
      'hover:bg-sage-400/8 hover:text-sage-700',
      'border border-transparent',
      'shadow-none',
    ]),

    minimal: cn([
      'bg-transparent text-charcoal-600',
      'hover:bg-charcoal-100 hover:text-charcoal-800',
      'border border-transparent', 
      'shadow-none',
    ]),
    
    crisis: cn([
      'bg-sage-500 text-white font-semibold',
      'hover:bg-sage-600',
      'border border-sage-500 hover:border-sage-600',
      'shadow-blessing hover:shadow-sanctuary',
      'ring-2 ring-sage-400/20 hover:ring-sage-500/30',
    ]),
  };
  
  // Perfect Size System - Mathematical Touch Targets  
  const sizeStyles = {
    small: cn([
      'h-9 px-4',     // 36px height - Compact but accessible
      'text-sm',      // 14px text
      'min-w-[64px]', // Minimum interaction width
    ]),
    
    medium: cn([
      'h-11 px-6',    // 44px height - Perfect touch target
      'text-base',    // 16px text  
      'min-w-[80px]', // Comfortable minimum width
    ]),
    
    large: cn([
      'h-13 px-8',    // 52px height - Generous interaction
      'text-lg',      // 18px text
      'min-w-[96px]', // Spacious minimum width
    ]),
    
    crisis: cn([
      'h-16 px-10',   // 64px height - Maximum accessibility
      'text-xl',      // 20px text - Enhanced readability
      'min-w-[120px]', // Crisis-optimized width
      'font-semibold', // Enhanced weight for importance
    ]),
  };

  // Perfect Loading Spinner - Mathematical Animation
  const LoadingSpinner = () => (
    <div className={cn([
      'animate-spin w-4 h-4',
      'border-2 border-current border-t-transparent',
      'rounded-full',
      !reducedMotion && 'transition-transform duration-1000 ease-linear'
    ])} />
  );
  
  // Dynamic component selection
  const Component = as === 'a' ? 'a' : 'button';

  return (
    <Component
      ref={ref}
      disabled={as === 'button' ? (disabled || loading) : undefined}
      onClick={onClick}
      className={cn([
        baseClasses,
        variantStyles[variant],
        sizeStyles[size],
        className,
      ])}
      style={style}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={cn([
              'flex items-center justify-center',
              'transition-transform duration-300',
              !reducedMotion && 'group-hover:scale-110'
            ])}>
              {icon}
            </span>
          )}
          
          {children && (
            <span className={cn([
              icon ? 'flex-1' : '',
              'transition-opacity duration-300',
              loading && 'opacity-0'
            ])}>
              {children}
            </span>
          )}
          
          {icon && iconPosition === 'right' && (
            <span className={cn([
              'flex items-center justify-center',
              'transition-transform duration-300',
              !reducedMotion && 'group-hover:scale-110'
            ])}>
              {icon}
            </span>
          )}
        </>
      )}
    </Component>
  );
});

Button.displayName = 'Button';

// Perfect Specialized Button Components

// Crisis Button - Maximum Accessibility & Immediate Recognition
export const CrisisButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant' | 'size'>>(
  (props, ref) => (
    <Button
      ref={ref}
      variant="crisis"
      size="crisis"
      className={cn([
        'group',
        'ring-2 ring-sage-400/30 hover:ring-sage-500/40',
        'shadow-blessing hover:shadow-sanctuary',
        'transition-all duration-300'
      ])}
      {...props}
    />
  )
);

CrisisButton.displayName = 'CrisisButton';

// Primary Action Button - Hero moments
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ size = 'large', ...props }, ref) => (
    <Button
      ref={ref}
      variant="primary"
      size={size}
      className="group"
      {...props}
    />
  )
);

PrimaryButton.displayName = 'PrimaryButton';

// Minimal Button - Subtle interactions
export const MinimalButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ size = 'medium', ...props }, ref) => (
    <Button
      ref={ref}
      variant="minimal"
      size={size}
      className="group"
      {...props}
    />
  )
);

MinimalButton.displayName = 'MinimalButton';

// Icon Button - Perfect square proportions
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  label: string; // Required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 'medium', className, ...props }, ref) => {
    const iconSizes = {
      small: 'w-9 h-9',   // 36px - Perfect square
      medium: 'w-11 h-11', // 44px - Golden ratio
      large: 'w-13 h-13',  // 52px - Generous
      crisis: 'w-16 h-16', // 64px - Maximum
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn([
          iconSizes[size],
          'p-0 aspect-square',
          'group',
          className,
        ])}
        {...props}
      >
        <span className={cn([
          'flex items-center justify-center',
          'transition-transform duration-300',
          'group-hover:scale-110 group-active:scale-95',
        ])}>
          {icon}
        </span>
        <span className="sr-only">{label}</span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';