/* 
 * ALCHM Sacred Design System - Input Component
 * "Every field becomes a sanctuary for expression"
 * 
 * Trauma-informed inputs that welcome words without judgment.
 * Each keystroke should feel safe, supported, held.
 */

'use client';

import React, { forwardRef, useState } from 'react';
import { COLORS, SPACING, RADIUS, A11Y } from '@/design-system/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'journal' | 'crisis';
  reducedMotion?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className = '', 
  label,
  helper,
  error,
  icon,
  variant = 'default',
  reducedMotion = false,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Sacred foundation - inputs must never feel demanding
  const inputClasses = `
    w-full px-4 py-3.5
    ${icon ? 'pl-12' : ''}
    bg-white
    border-2 rounded-xl
    text-gray-900 placeholder-gray-400
    ${reducedMotion ? '' : 'transition-all duration-200'}
    focus:outline-none
    ${error 
      ? 'border-[#c9a090] focus:border-[#c9a090]' 
      : isFocused 
        ? 'border-[#a4b792] shadow-sm' 
        : 'border-gray-200 hover:border-gray-300'
    }
    ${variant === 'journal' ? 'text-lg leading-relaxed' : ''}
    ${variant === 'crisis' ? 'min-h-[56px] text-lg' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {(helper || error) && (
        <p className={`mt-2 text-sm ${
          error 
            ? 'text-[#c9a090]' 
            : 'text-gray-500'
        }`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
  variant?: 'default' | 'journal' | 'crisis';
  reducedMotion?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  className = '', 
  label,
  helper,
  error,
  variant = 'default',
  reducedMotion = false,
  autoResize = false,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Sacred foundation for textarea - the heart of journaling
  const textareaClasses = `
    w-full px-4 py-3.5
    bg-white
    border-2 rounded-xl
    text-gray-900 placeholder-gray-400
    ${reducedMotion ? '' : 'transition-all duration-200'}
    focus:outline-none
    resize-none
    ${error 
      ? 'border-[#c9a090] focus:border-[#c9a090]' 
      : isFocused 
        ? 'border-[#a4b792] shadow-sm' 
        : 'border-gray-200 hover:border-gray-300'
    }
    ${variant === 'journal' ? 'text-lg leading-relaxed min-h-[120px]' : 'min-h-[100px]'}
    ${variant === 'crisis' ? 'min-h-[80px] text-lg' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // Auto-resize functionality for journal entries
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      const target = e.currentTarget;
      target.style.height = 'auto';
      target.style.height = `${Math.min(target.scrollHeight, 400)}px`;
    }
    props.onInput?.(e);
  };
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        onInput={handleInput}
        className={textareaClasses}
        {...props}
      />
      
      {(helper || error) && (
        <p className={`mt-2 text-sm ${
          error 
            ? 'text-[#c9a090]' 
            : 'text-gray-500'
        }`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';