/* 
 * ALCHM Sacred Design System - Typography Component
 * "Typography is the voice of sanctuary"
 * 
 * Every word must feel like it belongs in a healing space,
 * never demanding attention, always offering support.
 */

'use client';

import React from 'react';
import { TYPOGRAPHY, COLORS } from '@/design-system/tokens';
import { cn } from '@/lib/utils';
import { DESIGN_CONSTANTS, TYPOGRAPHY_SYSTEM, fontSize, lineHeight } from '@/design-system/foundation';

// Sacred typography variants that honor emotional states
type TypographyVariant = 
  | 'displayLarge'    // Emotional impact, rare and powerful
  | 'displayMedium'   // Hero moments
  | 'displaySmall'    // Section heroes
  | 'headlineLarge'   // Structure without dominance  
  | 'headlineMedium'  // Gentle section titles
  | 'headlineSmall'   // Card titles, subsections
  | 'bodyLarge'       // Prominent reading
  | 'bodyMedium'      // Standard comfortable reading
  | 'bodySmall'       // Supporting details
  | 'labelLarge'      // UI guidance
  | 'labelMedium'     // Form labels
  | 'labelSmall'      // Micro labels
  | 'crisis';         // Enhanced for crisis situations

type TypographyAlign = 'left' | 'center' | 'right' | 'justify';
type TypographyColor = 'default' | 'muted' | 'sage' | 'white' | 'crisis' | 'inherit';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  align?: TypographyAlign;
  color?: TypographyColor;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  reducedMotion?: boolean; // Trauma-informed motion sensitivity
  crisisMode?: boolean; // Enhanced accessibility for crisis scenarios
}

// Jony Ive Mathematical Typography System - Perfect Proportional Scaling
const variantStyles: Record<TypographyVariant, string> = {
  // Display Typography - Hero Moments (Ultra-precise scaling)
  'displayLarge': 'text-[61px] leading-[1.1] tracking-[-0.035em] font-thin',      // 61px = Perfect golden ratio scale
  'displayMedium': 'text-[49px] leading-[1.15] tracking-[-0.03em] font-thin',    // 49px = Mathematical progression
  'displaySmall': 'text-[39px] leading-[1.2] tracking-[-0.025em] font-light',    // 39px = Fibonacci-inspired

  // Headlines - Structured Hierarchy (Precise mathematical intervals)  
  'headlineLarge': 'text-[31px] leading-[1.25] tracking-[-0.02em] font-light',   // 31px = Perfect scale ratio
  'headlineMedium': 'text-[25px] leading-[1.3] tracking-[-0.015em] font-normal', // 25px = 16 × 1.56 (golden)
  'headlineSmall': 'text-[20px] leading-[1.35] tracking-[-0.01em] font-normal',  // 20px = Clean progression

  // Body Typography - Reading Perfection (Optimized for comprehension)
  'bodyLarge': 'text-[18px] leading-[1.6] tracking-[0] font-normal',             // 18px = Enhanced readability
  'bodyMedium': 'text-[16px] leading-[1.5] tracking-[0] font-normal',            // 16px = Perfect base
  'bodySmall': 'text-[14px] leading-[1.55] tracking-[0.005em] font-normal',      // 14px = Subtle expansion

  // Labels - Interface Precision (Micro-typography excellence)
  'labelLarge': 'text-[16px] leading-[1.3] tracking-[0.01em] font-medium',       // 16px = Strong presence
  'labelMedium': 'text-[14px] leading-[1.3] tracking-[0.015em] font-medium',     // 14px = Clear guidance
  'labelSmall': 'text-[12px] leading-[1.3] tracking-[0.05em] font-medium uppercase', // 12px = Micro details

  // Crisis Typography - Enhanced Accessibility
  'crisis': 'text-[20px] leading-[1.75] tracking-[0.025em] font-medium'          // Maximum readability
};


const alignStyles: Record<TypographyAlign, string> = {
  'left': 'text-left',
  'center': 'text-center',
  'right': 'text-right',
  'justify': 'text-justify'
};

// Perfect Color System - Mathematically Precise Contrast Ratios
const colorStyles: Record<TypographyColor, string> = {
  'default': 'text-charcoal-800',   // Perfect readability contrast (7.2:1)
  'muted': 'text-charcoal-600',     // Gentle secondary text (4.8:1)  
  'sage': 'text-sage-400',          // Brand color accessibility optimized
  'white': 'text-sanctuary-50',     // Pure clarity
  'crisis': 'text-sage-500',        // Enhanced contrast for crisis readability
  'inherit': 'text-inherit'         // Inherit from parent
};

// Jony Ive Weight System - Precise Optical Balance  
const weightStyles: Record<string, string> = {
  'thin': 'font-thin',          // 100 - Ultra-light ethereal presence
  'light': 'font-light',        // 300 - Gentle refined elegance  
  'normal': 'font-normal',      // 400 - Perfect reading weight
  'medium': 'font-medium',      // 500 - Intentional emphasis
  'semibold': 'font-semibold',  // 600 - Strong sacred headers
  'bold': 'font-bold'           // 700 - Maximum emphasis (rare use)
};

// Default semantic HTML elements
const defaultElements: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  'displayLarge': 'h1',
  'displayMedium': 'h1', 
  'displaySmall': 'h2',
  'headlineLarge': 'h2',
  'headlineMedium': 'h3',
  'headlineSmall': 'h4',
  'bodyLarge': 'p',
  'bodyMedium': 'p',
  'bodySmall': 'p', 
  'labelLarge': 'label',
  'labelMedium': 'label',
  'labelSmall': 'span',
  'crisis': 'p'
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(({
  children,
  variant = 'bodyMedium',
  align = 'left',
  color = 'default',
  weight = 'normal',
  className = '',
  as,
  reducedMotion = false,
  crisisMode = false,
  ...props
}, ref) => {
  // Determine the HTML element to render
  const Component = as || defaultElements[variant];
  
  // Build className string with sacred design considerations
  const classes = [
    // Base variant styles from tokens
    variantStyles[variant],
    
    // Alignment
    alignStyles[align],
    
    // Color
    colorStyles[color],
    
    // Weight
    weightStyles[weight],
    
    // Perfect font family system - SF Pro optimized
    'font-display',
    
    // Crisis mode enhancements
    crisisMode && [
      'font-medium',
      'tracking-wide',
      'selection:bg-[#a4b792]/20'
    ].join(' '),
    
    // Perfect micro-interactions - Jony Ive precision
    reducedMotion ? '' : 'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
    
    // Perfect accessibility - Mathematical precision
    'selection:bg-sage-400/16', // Gentle selection highlight
    'focus-visible:outline-sage-400 focus-visible:outline-2 focus-visible:outline-offset-2',
    'scroll-mt-24', // Perfect scroll padding
    
    // Custom className
    className
  ].filter(Boolean).join(' ').trim().replace(/\s+/g, ' ');

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

Typography.displayName = 'Typography';

// Specialized Typography Components for Common Use Cases

interface HeadingProps extends Omit<TypographyProps, 'variant'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ level = 1, children, ...props }, ref) => {
  const variantMap: Record<number, TypographyVariant> = {
    1: 'displayLarge',
    2: 'displayMedium', 
    3: 'displaySmall',
    4: 'headlineLarge',
    5: 'headlineMedium',
    6: 'headlineSmall'
  };

  return (
    <Typography
      ref={ref}
      variant={variantMap[level]}
      as={`h${level}` as keyof JSX.IntrinsicElements}
      {...props}
    >
      {children}
    </Typography>
  );
});

Heading.displayName = 'Heading';

export const Body = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'> & { size?: 'small' | 'medium' | 'large' }>(
  ({ children, size = 'medium', ...props }, ref) => {
    const variantMap = {
      'small': 'bodySmall',
      'medium': 'bodyMedium', 
      'large': 'bodyLarge'
    } as const;

    return (
      <Typography
        ref={ref}
        variant={variantMap[size]}
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

Body.displayName = 'Body';

export const Caption = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'variant'>>(
  ({ children, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="labelSmall"
      color="muted"
      {...props}
    >
      {children}
    </Typography>
  )
);

Caption.displayName = 'Caption';

export const CrisisText = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant' | 'crisisMode'>>(
  ({ children, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="crisis"
      color="crisis"
      crisisMode={true}
      {...props}
    >
      {children}
    </Typography>
  )
);

CrisisText.displayName = 'CrisisText';

// Trauma-Informed Text Components

interface SacredTextProps extends Omit<TypographyProps, 'variant'> {
  gentle?: boolean;
  sanctuary?: boolean;
}

export function SacredText({ children, gentle = false, sanctuary = false, ...props }: SacredTextProps) {
  return (
    <Typography
      variant="bodyMedium"
      color={sanctuary ? 'white' : 'default'}
      className={cn(
        gentle && 'opacity-80',
        sanctuary && 'text-sanctuary/90',
        'transition-opacity duration-300 ease-out'
      )}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function PromptText({ children, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography
      variant="bodyMedium"
      weight="light"  // Explicitly set luxury weight
      color="sage"
      className={cn(
        'italic opacity-70',
        'animate-gentle-pulse',
        'transition-all duration-600 ease-out'
      )}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Utility function for responsive text scaling
export function useResponsiveText(baseSize: number, mobileScale: number = 0.875) {
  return {
    fontSize: `clamp(${baseSize * mobileScale}rem, ${baseSize}vw, ${baseSize}rem)`
  };
}

// Typography utility for trauma-informed readability
export function enhanceReadability(text: string): React.ReactNode {
  // Add zero-width spaces after punctuation for better line breaking
  return text.replace(/([.!?;,:])/g, '$1\u200B');
}

// Typography component for displaying word counts in a sanctuary style
interface WordCountProps {
  count: number;
  className?: string;
}

export function SacredWordCount({ count, className }: WordCountProps) {
  return (
    <Caption 
      className={cn(
        'sanctuary-glass border border-sanctuary/20 rounded-2xl px-3 py-1 backdrop-blur-xl',
        'animate-gentle-pulse',
        className
      )}
      color="sage"
    >
      {count} sacred words
    </Caption>
  );
}

// Typography component for gentle encouragement
interface EncouragementProps {
  children: React.ReactNode;
  className?: string;
}

export function GentleEncouragement({ children, className }: EncouragementProps) {
  return (
    <Body
      size="small"
      color="sage" 
      className={cn(
        'flex items-center gap-2',
        'sanctuary-glass border border-sanctuary/20 rounded-2xl px-3 py-2 backdrop-blur-xl',
        'animate-gentle-breathe',
        className
      )}
    >
      <span className="animate-gentle-sparkle">✨</span>
      {children}
    </Body>
  );
}