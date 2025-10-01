// Typography Components - ALCHM Sacred Design System
// "Typography is the voice of design" - Applied to trauma-informed healing interfaces

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Typography Variant Definitions
type TypographyVariant = 
  | 'display-1'    // Hero headlines, splash text (56px)
  | 'display-2'    // Primary page titles (40px)
  | 'heading-1'    // Page headings, hero text (32px)
  | 'heading-2'    // Section headings (24px)
  | 'heading-3'    // Card titles, subsections (18px)
  | 'body-large'   // Prominent body text (18px)
  | 'body'         // Primary body text (16px)
  | 'body-small'   // Supporting text (14px)
  | 'caption'      // Labels, captions (12px)
  | 'crisis';      // Crisis text (20px with enhanced accessibility)

type TypographyWeight = 'ultralight' | 'thin' | 'light' | 'normal' | 'medium' | 'semibold';
type TypographyAlign = 'left' | 'center' | 'right' | 'justify';
type TypographyColor = 'default' | 'muted' | 'sage' | 'white' | 'crisis' | 'inherit';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  color?: TypographyColor;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  responsive?: boolean; // Enables mobile-optimized scaling
  crisisMode?: boolean; // Enhanced accessibility for crisis scenarios
}

// Sacred Typography Mappings
const variantStyles: Record<TypographyVariant, string> = {
  'display-1': 'text-3xlarge font-thin leading-tight tracking-tight',
  'display-2': 'text-2xlarge font-light leading-snug tracking-snug',
  'heading-1': 'text-xlarge font-light leading-snug tracking-snug',
  'heading-2': 'text-large font-light leading-normal tracking-normal',
  'heading-3': 'text-medium font-normal leading-comfortable tracking-normal',
  'body-large': 'text-medium font-normal leading-comfortable tracking-normal',
  'body': 'text-base font-normal leading-relaxed tracking-normal',
  'body-small': 'text-small font-normal leading-comfortable tracking-wide',
  'caption': 'text-micro font-normal leading-normal tracking-wider',
  'crisis': 'text-crisis font-medium leading-loose tracking-wide'
};

const weightStyles: Record<TypographyWeight, string> = {
  'ultralight': 'font-ultralight',
  'thin': 'font-thin',
  'light': 'font-light',
  'normal': 'font-normal',
  'medium': 'font-medium',
  'semibold': 'font-semibold'
};

const alignStyles: Record<TypographyAlign, string> = {
  'left': 'text-left',
  'center': 'text-center',
  'right': 'text-right',
  'justify': 'text-justify'
};

const colorStyles: Record<TypographyColor, string> = {
  'default': 'text-sanctuary-gray-800',
  'muted': 'text-sanctuary-gray-600',
  'sage': 'text-sage-600',
  'white': 'text-sanctuary-white',
  'crisis': 'text-crisis-red',
  'inherit': ''
};

// Default HTML elements for each variant
const defaultElements: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  'display-1': 'h1',
  'display-2': 'h1',
  'heading-1': 'h2',
  'heading-2': 'h3',
  'heading-3': 'h4',
  'body-large': 'p',
  'body': 'p',
  'body-small': 'p',
  'caption': 'span',
  'crisis': 'p'
};

export function Typography({
  children,
  variant = 'body',
  weight,
  align = 'left',
  color = 'default',
  className,
  as,
  responsive = true,
  crisisMode = false,
  ...props
}: TypographyProps) {
  // Determine the HTML element to render
  const Component = as || defaultElements[variant];
  
  // Build className string with sacred design considerations
  const classes = cn(
    // Base variant styles
    variantStyles[variant],
    
    // Weight override if provided
    weight && weightStyles[weight],
    
    // Alignment
    alignStyles[align],
    
    // Color
    colorStyles[color],
    
    // Crisis mode enhancements
    crisisMode && [
      'mobile-crisis-text',
      'font-medium',
      'tracking-wide',
      'selection:bg-crisis-red/20'
    ],
    
    // Responsive typography
    responsive && [
      'transition-all duration-300 ease-out'
    ],
    
    // Trauma-informed accessibility
    'selection:bg-sage-200/50',
    'focus-visible:outline-sage-400',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    
    // Custom className
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

// Specialized Typography Components for Common Use Cases

interface HeadingProps extends Omit<TypographyProps, 'variant'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 1, children, weight, ...props }: HeadingProps) {
  const variantMap: Record<number, TypographyVariant> = {
    1: 'display-1',
    2: 'display-2', 
    3: 'heading-1',
    4: 'heading-2',
    5: 'heading-3',
    6: 'heading-3'
  };

  const weightMap: Record<number, TypographyWeight> = {
    1: weight || 'thin',
    2: weight || 'light',
    3: weight || 'light',
    4: weight || 'light',
    5: weight || 'normal',
    6: weight || 'normal'
  };

  return (
    <Typography
      variant={variantMap[level]}
      weight={weightMap[level]}
      as={`h${level}` as keyof JSX.IntrinsicElements}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function Body({ children, size = 'normal', ...props }: Omit<TypographyProps, 'variant'> & { size?: 'small' | 'normal' | 'large' }) {
  const variantMap = {
    'small': 'body-small',
    'normal': 'body', 
    'large': 'body-large'
  } as const;

  return (
    <Typography
      variant={variantMap[size]}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function Caption({ children, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography
      variant="caption"
      color="muted"
      {...props}
    >
      {children}
    </Typography>
  );
}

export function CrisisText({ children, ...props }: Omit<TypographyProps, 'variant' | 'crisisMode'>) {
  return (
    <Typography
      variant="crisis"
      color="crisis"
      crisisMode={true}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Trauma-Informed Text Components

interface SacredTextProps extends Omit<TypographyProps, 'variant'> {
  gentle?: boolean;
  sanctuary?: boolean;
}

export function SacredText({ children, gentle = false, sanctuary = false, ...props }: SacredTextProps) {
  return (
    <Typography
      variant="body"
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
      variant="body"
      color="sage"
      className={cn(
        'italic font-light opacity-70',
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