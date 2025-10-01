/* 
 * ALCHM PREMIUM DIGITAL SANCTUARY CARD COMPONENT
 * "Objects should speak to the subconscious of healing"
 * 
 * Transform every container into a moment of sanctuary.
 * Jonathan Ive's purposeful beauty for trauma-informed experiences.
 */

'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'sanctuary' | 'featured' | 'community' | 'glass';
  interactive?: boolean;
  elevation?: 'whisper' | 'breath' | 'blessing' | 'sanctuary' | 'temple';
}

export function Card({ 
  children, 
  className = '', 
  variant = 'sanctuary',
  interactive = false,
  elevation = 'blessing',
  ...props 
}: CardProps) {
  
  // Premium Digital Sanctuary Foundation
  const baseClasses = [
    'rounded-sanctuary',
    'p-lg',
    'transition-all',
    'duration-breath',
    'ease-blessing',
    'font-sacred'
  ].join(' ');
  
  // Premium Digital Sanctuary Variants
  const variantClasses = {
    default: [
      'bg-white',
      'border',
      'border-sage-lighter/50',
      'text-charcoal-800'
    ].join(' '),
    
    sanctuary: [
      'glass-sanctuary',
      'text-charcoal-700',
      'border',
      'border-white/20'
    ].join(' '),
    
    featured: [
      'bg-gradient-to-br',
      'from-sage-lighter/30',
      'via-white',
      'to-blush-50/30',
      'border',
      'border-sage-light',
      'text-charcoal-800',
      'relative',
      'overflow-hidden'
    ].join(' '),
    
    community: [
      'bg-gradient-to-br',
      'from-terracotta-50/30',
      'via-white',
      'to-blush-100/20',
      'border-l-3',
      'border-l-terracotta-400',
      'border-t',
      'border-r',
      'border-b',
      'border-terracotta-100',
      'text-charcoal-800'
    ].join(' '),
    
    glass: [
      'glass-sage',
      'text-charcoal-700',
      'border',
      'border-sage-200/30'
    ].join(' ')
  };
  
  // Premium Shadow System
  const shadowClasses = {
    whisper: 'shadow-whisper',
    breath: 'shadow-breath',
    blessing: 'shadow-blessing',
    sanctuary: 'shadow-sanctuary',
    temple: 'shadow-temple'
  };
  
  // Mindful Interaction - Gentle, trauma-informed feedback
  const interactiveClasses = interactive ? [
    'cursor-pointer',
    'hover:shadow-sanctuary',
    'hover:-translate-y-0.5',
    'hover:scale-[1.005]',
    'active:translate-y-0',
    'active:scale-[1.002]',
    'focus-visible:ring-2',
    'focus-visible:ring-sage-primary/20',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-offwhite'
  ].join(' ') : '';
  
  return (
    <div 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${shadowClasses[elevation]}
        ${interactiveClasses} 
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

// Premium Digital Sanctuary Card Subcomponents - Intentional hierarchy

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`p-lg pb-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3';
}

export function CardTitle({ children, className = '', level = 'h3', ...props }: CardTitleProps) {
  const Component = level;
  
  // Premium Digital Sanctuary typography - purposeful, breathing hierarchy
  const sizeClasses = {
    h1: 'text-2xlarge font-breath text-charcoal-800',
    h2: 'text-xlarge font-presence text-charcoal-800',  
    h3: 'text-large font-ground text-charcoal-800'
  };
  
  return (
    <Component 
      className={`${sizeClasses[level]} mb-xs transition-colors duration-breath ease-blessing ${className}`} 
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p className={`text-base font-ground leading-relaxed text-charcoal-600 transition-colors duration-breath ease-blessing ${className}`} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'tight' | 'comfortable' | 'generous';
}

export function CardContent({ children, className = '', spacing = 'comfortable', ...props }: CardContentProps) {
  const spacingClasses = {
    tight: 'p-md',
    comfortable: 'p-lg',
    generous: 'p-xl'
  };
  
  return (
    <div className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function CardFooter({ children, className = '', align = 'between', ...props }: CardFooterProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center', 
    right: 'justify-end',
    between: 'justify-between'
  };
  
  return (
    <div className={`flex items-center p-lg pt-sm gap-sm ${alignClasses[align]} ${className}`} {...props}>
      {children}
    </div>
  );
}