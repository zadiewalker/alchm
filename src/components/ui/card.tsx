/* 
 * ALCHM Sacred Design System - Card Component
 * "Every container must pass the sanctuary test"
 * 
 * Cards should feel like gentle holders of content,
 * never demanding attention, always offering support.
 */

'use client';

import React, { forwardRef } from 'react';
import { COLORS, SPACING, RADIUS, SHADOW } from '@/design-system/tokens';
import { DESIGN_CONSTANTS, COMPONENT_SPECS, SAGE_SYSTEM } from '@/design-system/foundation';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'crisis' | 'gentle' | 'sanctuary';
  padding?: 'none' | 'small' | 'medium' | 'large' | 'hero';
  interactive?: boolean;
  reducedMotion?: boolean;
  elevation?: 'flat' | 'subtle' | 'gentle' | 'prominent' | 'floating';
  as?: 'div' | 'section' | 'article' | 'button';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  variant = 'elevated',
  padding = 'medium',
  interactive = false,
  reducedMotion = false,
  elevation = 'subtle',
  as = 'div',
  onClick,
  ...props 
}, ref) => {
  
  // Jony Ive Perfect Foundation - Mathematical Card Architecture
  const baseClasses = cn([
    // Perfect border radius - 16px mathematical harmony
    'rounded-2xl',
    
    // Flawless transitions - Apple-grade easing
    !reducedMotion && [
      'transition-all duration-300',
      'ease-[cubic-bezier(0.25,0.46,0.45,0.94)]', // Apple's signature easing
      'transform-gpu', // Hardware acceleration for smoothness
    ],
    
    // Layout perfection
    'relative',
    'overflow-hidden',
    'isolate', // Create stacking context
    
    // Perfect typography inheritance
    'antialiased',
  ]);
  
  // Perfect Variant System - Mathematical Color Science
  const variantStyles = {
    elevated: cn([
      'bg-sanctuary text-charcoal-800',
      'border border-sanctuary-400/8',
      elevation === 'subtle' && 'shadow-whisper',
      elevation === 'gentle' && 'shadow-gentle', 
      elevation === 'prominent' && 'shadow-blessing',
      elevation === 'floating' && 'shadow-sanctuary',
    ]),
    
    outlined: cn([
      'bg-sanctuary text-charcoal-800',
      'border border-sage-200 hover:border-sage-300',
      'shadow-none',
      interactive && 'hover:bg-sage-50/30',
    ]),
    
    filled: cn([
      'bg-sage-50 text-charcoal-800',
      'border border-sage-100',
      'shadow-none',
    ]),
    
    glass: cn([
      'bg-sanctuary-glass backdrop-blur-xl',
      'text-charcoal-800',
      'border border-sanctuary/20',
      'shadow-gentle',
    ]),

    gentle: cn([
      'bg-sanctuary-50 text-charcoal-700',
      'border border-sage-100/40',
      'shadow-whisper',
    ]),

    sanctuary: cn([
      'bg-gradient-to-br from-sanctuary-50 to-sage-50/30',
      'text-charcoal-800',
      'border border-sage-200/20',
      'shadow-breath',
    ]),
    
    crisis: cn([
      'bg-sage-50 text-charcoal-800',
      'border-2 border-sage-200',
      'shadow-gentle',
      'ring-1 ring-sage-400/10',
    ]),
  };
  
  // Mathematical Padding System - Perfect Content Breathing
  const paddingStyles = {
    none: '',
    small: 'p-4',     // 16px - Compact content
    medium: 'p-6',    // 24px - Standard comfort
    large: 'p-8',     // 32px - Generous space  
    hero: 'p-12',     // 48px - Hero sections
  };
  
  // Perfect Interactive States - Jony Ive Micro-interactions
  const interactiveStyles = interactive ? cn([
    'cursor-pointer group',
    
    // Perfect focus states
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-sage-400/40',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-sanctuary',
    
    // Gentle hover micro-interactions
    !reducedMotion && [
      'hover:scale-[1.01]',        // Subtle scale
      'hover:-translate-y-1',      // Gentle float
      'hover:shadow-blessing',     // Enhanced shadow
      'active:scale-[0.99]',       // Satisfying press
      'active:translate-y-0',      // Return to ground
    ],
    
    // Reduced motion fallback
    reducedMotion && 'hover:shadow-gentle',
  ]) : '';
  
  // Dynamic component selection
  const Component = as === 'button' || onClick ? 'button' : as;
  
  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={cn([
        baseClasses,
        variantStyles[variant],
        paddingStyles[padding],
        interactiveStyles,
        className,
      ])}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

// Perfect Card Subcomponents - Mathematical Content Structure

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn([
        'mb-6', // Perfect 24px spacing
        'space-y-2', // 8px internal spacing
        className
      ])} 
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, level = 'h3', ...props }, ref) => {
    const Component = level;
    
    // Perfect Typography Hierarchy - Mathematical Scaling
    const levelStyles = {
      h1: 'text-[31px] leading-[1.25] font-light tracking-[-0.02em]',    // Display scale
      h2: 'text-[25px] leading-[1.3] font-normal tracking-[-0.015em]',   // Hero scale
      h3: 'text-[20px] leading-[1.35] font-normal tracking-[-0.01em]',   // Section scale
      h4: 'text-[18px] leading-[1.4] font-medium tracking-[-0.005em]',   // Subsection scale
    };
    
    return (
      <Component 
        // @ts-ignore - dynamic component ref
        ref={ref}
        className={cn([
          levelStyles[level],
          'text-charcoal-800',
          'scroll-mt-24', // Perfect scroll padding
          className
        ])} 
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p 
      ref={ref} 
      className={cn([
        'text-[16px] leading-[1.6] tracking-[0] font-normal',  // Perfect readability
        'text-charcoal-600',  // Gentle secondary contrast (4.8:1)
        'max-w-prose',  // Perfect reading width
        'transition-colors duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
        className
      ])} 
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'none' | 'tight' | 'default' | 'comfortable' | 'spacious';
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', spacing = 'default', ...props }, ref) => {
    const spacingStyles = {
      none: '',
      tight: 'space-y-3',      // 12px - Compact content
      default: 'space-y-4',    // 16px - Standard breathing room
      comfortable: 'space-y-6', // 24px - Generous spacing
      spacious: 'space-y-8'    // 32px - Luxurious spacing
    };

    return (
      <div 
        ref={ref} 
        className={cn([
          spacingStyles[spacing || 'default'],
          'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          className
        ])} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
  spacing?: 'none' | 'tight' | 'default' | 'comfortable' | 'spacious';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', align = 'between', spacing = 'default', ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center', 
      right: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };

    const spacingClasses = {
      none: 'gap-0',
      tight: 'gap-2',     // 8px - Compact actions
      default: 'gap-3',   // 12px - Standard spacing
      comfortable: 'gap-4', // 16px - Generous spacing
      spacious: 'gap-6'   // 24px - Luxurious spacing
    };
    
    return (
      <div 
        ref={ref} 
        className={cn([
          'flex items-center',
          'mt-6',  // Perfect 24px top margin
          'min-h-[44px]',  // Minimum touch target height
          alignClasses[align],
          spacingClasses[spacing || 'default'],
          'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          className
        ])} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';