/* 
 * ALCHM SACRED INPUT COMPONENT
 * "Every field becomes a space for expression"
 * 
 * Trauma-informed inputs that feel safe and never jarring.
 * Glass morphism meets healing-centered interaction design.
 */

'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'sanctuary' | 'journal';
  error?: boolean;
}

export function Input({ 
  className = '', 
  variant = 'sanctuary',
  error = false,
  ...props 
}: InputProps) {
  
  // Sacred Foundation
  const baseClasses = [
    'alchm-input',
    'transition-all duration-base ease-gentle',
    'focus-visible:outline-none'
  ].join(' ');
  
  // Sacred Variants
  const variantClasses = {
    default: 'bg-sanctuary border border-sanctuary-gray-200 text-sanctuary-gray-800',
    sanctuary: 'sanctuary-glass backdrop-blur-xl text-sage-700 placeholder:text-sage-500/60',
    journal: 'bg-transparent border-0 text-sanctuary placeholder:text-sanctuary/50 text-large font-light'
  };
  
  // Error state
  const errorClasses = error ? 'border-crisis-red focus:border-crisis-red' : '';
  
  return (
    <input
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${errorClasses}
        ${className}
      `.trim()}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'sanctuary' | 'journal';
  error?: boolean;
}

export function Textarea({ 
  className = '', 
  variant = 'sanctuary',
  error = false,
  ...props 
}: TextareaProps) {
  
  // Sacred Foundation for textarea
  const baseClasses = [
    'alchm-input',
    'alchm-textarea',
    'transition-all duration-base ease-gentle',
    'focus-visible:outline-none',
    'resize-none'
  ].join(' ');
  
  // Sacred Variants
  const variantClasses = {
    default: 'bg-sanctuary border border-sanctuary-gray-200 text-sanctuary-gray-800',
    sanctuary: 'sanctuary-glass backdrop-blur-xl text-sage-700 placeholder:text-sage-500/60',
    journal: 'bg-transparent border-0 text-sanctuary placeholder:text-sanctuary/50 text-large font-light leading-relaxed min-h-[300px]'
  };
  
  // Error state
  const errorClasses = error ? 'border-crisis-red focus:border-crisis-red' : '';
  
  return (
    <textarea
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${errorClasses}
        ${className}
      `.trim()}
      {...props}
    />
  );
}