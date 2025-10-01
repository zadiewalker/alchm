'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface SomaticInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  label?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  nervousSystemAware?: boolean;
  breathingSpace?: boolean;
}

/**
 * SomaticInput - Input field designed to reduce tension and support nervous system regulation
 */
export function SomaticInput({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  label,
  helpText,
  error,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  nervousSystemAware = true,
  breathingSpace = true
}: SomaticInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const inputRef = useRef<HTMLInputElement>(null);
  const lastKeystroke = useRef<number>(0);

  // Monitor typing patterns for nervous system awareness
  useEffect(() => {
    if (!nervousSystemAware) return;

    const handleKeyDown = () => {
      const now = performance.now();
      const timeSinceLastKeystroke = now - lastKeystroke.current;
      
      if (timeSinceLastKeystroke < 100) {
        setTypingSpeed('fast'); // Rapid typing = potential activation
      } else if (timeSinceLastKeystroke > 2000) {
        setTypingSpeed('slow'); // Long pauses = potential withdrawal
      } else {
        setTypingSpeed('normal'); // Regulated typing
      }
      
      lastKeystroke.current = now;
      setHasInteracted(true);
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
      return () => inputElement.removeEventListener('keydown', handleKeyDown);
    }
  }, [nervousSystemAware]);

  const getInputClasses = () => {
    const baseClasses = 'somatic-input w-full';
    
    const stateClasses = {
      slow: 'border-sage-300 bg-sage-50', // Gentle encouragement
      normal: 'border-sage-200 bg-white',
      fast: 'border-sage-400 bg-white' // Grounding for activation
    };

    const focusClasses = isFocused ? 'ring-2 ring-sage-200 ring-opacity-50' : '';
    const errorClasses = error ? 'border-crisis-red ring-2 ring-crisis-red ring-opacity-20' : '';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
    const breathingClasses = breathingSpace ? 'somatic-breathing-space' : '';

    return [
      baseClasses,
      nervousSystemAware ? stateClasses[typingSpeed] : stateClasses.normal,
      focusClasses,
      errorClasses,
      disabledClasses,
      breathingClasses,
      className
    ].filter(Boolean).join(' ');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="somatic-space-personal">
      {label && (
        <label 
          htmlFor={`somatic-input-${Math.random()}`}
          className="somatic-text block text-sm font-medium text-sage-700 mb-2"
        >
          {label}
          {required && <span className="text-crisis-red ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={getInputClasses()}
          style={{
            fontSize: '16px', // Prevents iOS zoom
            transition: 'all 300ms cubic-bezier(0.45, 0.05, 0.55, 0.95)',
            WebkitAppearance: 'none' // Remove iOS styling
          }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? 'error-message' : 
            helpText ? 'help-text' : undefined
          }
        />
        
        {/* Breathing indicator for focus state */}
        {isFocused && breathingSpace && (
          <div 
            className="absolute -inset-1 rounded-lg opacity-30 breathing-coherent pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(164, 183, 146, 0.1), transparent)',
              zIndex: -1
            }}
          />
        )}
      </div>

      {/* Help text with somatic spacing */}
      {helpText && !error && (
        <p 
          id="help-text"
          className="somatic-text text-xs text-sage-600 mt-2"
        >
          {helpText}
        </p>
      )}

      {/* Error message with gentle crisis styling */}
      {error && (
        <p 
          id="error-message"
          className="somatic-crisis-text text-xs text-crisis-red mt-2"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * SomaticTextarea - Multi-line text input with embodied design
 */
interface SomaticTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  autoGrow?: boolean;
  breathingGuide?: boolean;
}

export function SomaticTextarea({
  value,
  onChange,
  placeholder = '',
  label,
  helpText,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  autoGrow = true,
  breathingGuide = true
}: SomaticTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update word count and auto-grow
  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    if (autoGrow && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoGrow]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="somatic-space-social">
      <div className="flex justify-between items-end mb-2">
        {label && (
          <label 
            htmlFor={`somatic-textarea-${Math.random()}`}
            className="somatic-text block text-sm font-medium text-sage-700"
          >
            {label}
            {required && <span className="text-crisis-red ml-1" aria-label="required">*</span>}
          </label>
        )}
        
        {/* Word count with breathing animation */}
        {isFocused && (
          <span className="somatic-text text-xs text-sage-500 breathing-grounding">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
            {maxLength && ` / ${maxLength} characters`}
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={autoGrow ? undefined : rows}
          maxLength={maxLength}
          className={`
            somatic-input w-full resize-none
            ${breathingGuide ? 'somatic-breathing-space' : ''}
            ${isFocused ? 'ring-2 ring-sage-200 ring-opacity-50' : ''}
            ${error ? 'border-crisis-red ring-2 ring-crisis-red ring-opacity-20' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
          style={{
            fontSize: '16px', // Prevents iOS zoom
            minHeight: autoGrow ? `${rows * 1.5}rem` : undefined,
            transition: 'all 300ms cubic-bezier(0.45, 0.05, 0.55, 0.95)',
            lineHeight: '1.8' // Extra generous for comfortable reading
          }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? 'error-message' : 
            helpText ? 'help-text' : undefined
          }
        />

        {/* Breathing guide visual */}
        {isFocused && breathingGuide && (
          <div 
            className="absolute top-2 right-2 opacity-40"
            aria-hidden="true"
          >
            <div 
              className="w-3 h-3 rounded-full bg-sage-400 breathing-coherent"
              title="Breathing guide"
            />
          </div>
        )}
      </div>

      {/* Help text */}
      {helpText && !error && (
        <p 
          id="help-text"
          className="somatic-text text-xs text-sage-600 mt-2"
        >
          {helpText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p 
          id="error-message"
          className="somatic-crisis-text text-xs text-crisis-red mt-2"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * SomaticSelect - Dropdown with embodied interaction
 */
interface SomaticSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  label?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function SomaticSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  label,
  helpText,
  error,
  disabled = false,
  required = false,
  className = ''
}: SomaticSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="somatic-space-personal">
      {label && (
        <label 
          htmlFor={`somatic-select-${Math.random()}`}
          className="somatic-text block text-sm font-medium text-sage-700 mb-2"
        >
          {label}
          {required && <span className="text-crisis-red ml-1" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            somatic-input w-full appearance-none
            ${isFocused ? 'ring-2 ring-sage-200 ring-opacity-50' : ''}
            ${error ? 'border-crisis-red ring-2 ring-crisis-red ring-opacity-20' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
          style={{
            fontSize: '16px', // Prevents iOS zoom
            paddingRight: '3rem', // Space for arrow
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px'
          }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? 'error-message' : 
            helpText ? 'help-text' : undefined
          }
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {helpText && !error && (
        <p 
          id="help-text"
          className="somatic-text text-xs text-sage-600 mt-2"
        >
          {helpText}
        </p>
      )}

      {error && (
        <p 
          id="error-message"
          className="somatic-crisis-text text-xs text-crisis-red mt-2"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}