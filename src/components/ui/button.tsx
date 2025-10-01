/* 
 * ALCHM PREMIUM DIGITAL SANCTUARY BUTTON COMPONENT
 * "Simplicity is the ultimate sophistication applied to healing"
 * 
 * Transform every interaction into a moment of sanctuary.
 * Trauma-informed design with Jonathan Ive's purposeful beauty.
 */

'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'crisis' | 'emergency' | 'text';
  size?: 'default' | 'sm' | 'lg' | 'touch' | 'crisis' | 'emergency';
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'default',
  disabled,
  onClick,
  ...props 
}: ButtonProps & { onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
  
  // Premium Digital Sanctuary Foundation
  const baseClasses = [
    'font-sacred',
    'rounded-embrace',
    'transition-all',
    'duration-breath',
    'ease-blessing',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-sage-primary/30',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-offwhite',
    'disabled:opacity-40',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
    'touch-safe'
  ].join(' ');
  
  // Premium Digital Sanctuary Variants
  const variantClasses = {
    primary: [
      'bg-sage-primary',
      'text-white',
      'shadow-blessing',
      'hover:bg-sage-dark',
      'hover:shadow-sanctuary',
      'hover:-translate-y-0.5',
      'active:translate-y-0',
      'active:shadow-breath'
    ].join(' '),
    
    secondary: [
      'bg-transparent',
      'text-terracotta-400',
      'border-2',
      'border-terracotta-400',
      'hover:bg-terracotta-mist',
      'hover:border-terracotta-500',
      'active:bg-terracotta-200/20'
    ].join(' '),
    
    ghost: [
      'bg-transparent',
      'text-charcoal-600',
      'hover:bg-sage-50',
      'hover:text-charcoal-800',
      'active:bg-sage-100'
    ].join(' '),
    
    crisis: [
      'bg-error',
      'text-white',
      'shadow-blessing',
      'hover:bg-error/90',
      'hover:shadow-sanctuary',
      'font-medium'
    ].join(' '),
    
    emergency: [
      'bg-emergency',
      'text-white',
      'shadow-sanctuary',
      'hover:bg-emergency/90',
      'hover:shadow-temple',
      'font-sacred',
      'animate-gentle-pulse'
    ].join(' '),
    
    text: [
      'bg-transparent',
      'text-sage-dark',
      'hover:text-sage-primary',
      'hover:underline',
      'underline-offset-4',
      'p-0',
      'min-h-0',
      'min-w-0'
    ].join(' ')
  };
  
  // Premium Touch Target Sizing
  const sizeClasses = {
    default: [
      'px-lg',
      'py-3.5',
      'text-base',
      'font-ground',
      'min-h-touch-base'
    ].join(' '),
    
    sm: [
      'px-md',
      'py-2.5',
      'text-small',
      'font-ground',
      'min-h-[40px]'
    ].join(' '),
    
    lg: [
      'px-xl',
      'py-4',
      'text-medium',
      'font-presence',
      'min-h-touch-comfortable'
    ].join(' '),
    
    touch: [
      'px-xl',
      'py-4',
      'text-medium',
      'font-presence',
      'min-h-touch-comfortable',
      'md:px-lg',
      'md:py-3.5',
      'md:min-h-touch-base'
    ].join(' '),
    
    crisis: [
      'px-2xl',
      'py-5',
      'text-crisis',
      'font-intention',
      'min-h-touch-crisis'
    ].join(' '),
    
    emergency: [
      'px-3xl',
      'py-6',
      'text-large',
      'font-sacred',
      'min-h-touch-emergency'
    ].join(' ')
  };

  // Premium Digital Sanctuary Interaction - Mindful, trauma-informed feedback
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Intentional haptic feedback for supported devices - gentle and meaningful
    if (typeof window !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        if (variant === 'emergency') {
          navigator.vibrate([120, 80, 120]); // Urgent attention pattern
        } else if (variant === 'crisis') {
          navigator.vibrate([80, 40, 80]); // Supportive attention pattern
        } else {
          navigator.vibrate(40); // Gentle sanctuary confirmation
        }
      } catch (error) {
        // Graceful degradation - no haptic feedback
      }
    }
    
    // Execute callback with intention
    if (onClick) {
      onClick(event);
    }
  };
  
  return (
    <button
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${className}
      `.trim()}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}