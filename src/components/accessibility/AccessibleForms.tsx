'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Accessible Forms Component Suite
 * 
 * Provides comprehensive form accessibility for ALCHM with trauma-informed design.
 * Includes proper error handling, validation, and screen reader support.
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface AccessibleFormProps {
  children: React.ReactNode;
  onSubmit?: (data: FormData) => void;
  validation?: (data: FormData) => ValidationResult;
  className?: string;
  ariaLabel?: string;
  crisisMode?: boolean;
}

export function AccessibleForm({
  children,
  onSubmit,
  validation,
  className = '',
  ariaLabel,
  crisisMode = false,
}: AccessibleFormProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formWarnings, setFormWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    
    // Clear previous errors
    setFormErrors([]);
    setFormWarnings([]);

    // Run validation if provided
    if (validation) {
      const result = validation(formData);
      
      if (!result.isValid) {
        setFormErrors(result.errors);
        setFormWarnings(result.warnings);
        setIsSubmitting(false);
        
        // Announce errors to screen readers
        const errorMessage = result.errors.length > 0
          ? `Form has ${result.errors.length} error${result.errors.length > 1 ? 's' : ''}: ${result.errors.join(', ')}`
          : '';
        
        announceToScreenReader(errorMessage, 'assertive');
        
        // Focus error summary
        if (errorSummaryRef.current && result.errors.length > 0) {
          errorSummaryRef.current.focus();
          errorSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return;
      }
    }

    // Submit form
    try {
      if (onSubmit) {
        await onSubmit(formData);
        announceToScreenReader('Form submitted successfully', 'polite');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form';
      setFormErrors([errorMessage]);
      announceToScreenReader(`Form submission failed: ${errorMessage}`, 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCrisisModeActive = crisisMode || settings.crisisMode || settings.emergencyMode;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`accessible-form ${isCrisisModeActive ? 'crisis-mode' : ''} ${className}`}
      aria-label={ariaLabel}
      noValidate // We handle validation ourselves for better accessibility
    >
      {/* Error Summary */}
      {(formErrors.length > 0 || formWarnings.length > 0) && (
        <div
          ref={errorSummaryRef}
          className={`
            form-error-summary p-4 mb-6 rounded-lg border-2
            ${isCrisisModeActive 
              ? 'bg-red-50 border-red-600 text-red-900' 
              : 'bg-red-50 border-red-400 text-red-800'
            }
          `}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          <h2 className="font-bold text-lg mb-2">
            {formErrors.length > 0 && (
              <span>
                {formErrors.length} Error{formErrors.length > 1 ? 's' : ''} Found
              </span>
            )}
          </h2>
          
          {formErrors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 mb-3">
              {formErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          )}

          {formWarnings.length > 0 && (
            <div className="border-t pt-3">
              <h3 className="font-semibold mb-1">Warnings:</h3>
              <ul className="list-disc list-inside space-y-1">
                {formWarnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Form Content */}
      <div className="form-content space-y-6">
        {children}
      </div>

      {/* Submit Button */}
      <div className="form-actions mt-8 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            submit-button w-full font-bold rounded-lg focus-ring
            ${isCrisisModeActive 
              ? 'touch-target-crisis bg-red-600 hover:bg-red-700 text-white text-lg' 
              : 'touch-target-comfortable bg-sage-600 hover:bg-sage-700 text-white'
            }
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:transform hover:scale-[1.02]'}
            transition-all duration-200
          `}
          aria-describedby={isSubmitting ? 'submit-loading' : undefined}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Submitting...</span>
            </span>
          ) : (
            <span>Submit Form</span>
          )}
        </button>

        {isSubmitting && (
          <div id="submit-loading" className="sr-only" aria-live="polite">
            Form is being submitted. Please wait.
          </div>
        )}
      </div>
    </form>
  );
}

/**
 * Accessible Input Component
 */
interface AccessibleInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  validation?: (value: string) => string | null;
  className?: string;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
}

export function AccessibleInput({
  type = 'text',
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  validation,
  className = '',
  autoComplete,
  maxLength,
  pattern,
}: AccessibleInputProps) {
  const { settings } = useAccessibility();
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputId = `input-${name}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Clear error when user starts typing
    if (error && touched) {
      setError(null);
    }
    
    onChange?.(newValue);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    const value = event.target.value;
    
    // Run validation on blur
    if (validation) {
      const validationError = validation(value);
      setError(validationError);
    }
    
    onBlur?.(value);
  };

  const isCrisisModeActive = settings.crisisMode || settings.emergencyMode;
  const hasError = error && touched;

  return (
    <div className={`accessible-input-group ${className}`}>
      {/* Label */}
      <label
        htmlFor={inputId}
        className={`
          form-label block font-semibold mb-2
          ${isCrisisModeActive ? 'text-lg' : 'text-base'}
          ${hasError ? 'text-red-700' : 'text-gray-900'}
        `}
      >
        {label}
        {required && (
          <span className="required-indicator text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <div
          id={descriptionId}
          className="form-description text-sm text-gray-600 mb-2"
        >
          {description}
        </div>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type={type}
        id={inputId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
        className={`
          form-control w-full border-2 rounded-lg px-4 py-3 transition-colors
          ${isCrisisModeActive 
            ? 'text-lg min-h-[56px] border-gray-400' 
            : 'text-base min-h-[48px] border-gray-300'
          }
          ${hasError 
            ? 'border-red-500 bg-red-50 focus:border-red-600' 
            : 'border-gray-300 bg-white focus:border-blue-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ')}
        aria-invalid={hasError}
        aria-required={required}
      />

      {/* Error Message */}
      {hasError && (
        <div
          id={errorId}
          className="form-error mt-2 text-sm text-red-700 flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <span className="text-red-500" aria-hidden="true">⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Accessible Textarea Component
 */
interface AccessibleTextareaProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  validation?: (value: string) => string | null;
  className?: string;
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}

export function AccessibleTextarea({
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  validation,
  className = '',
  rows = 4,
  maxLength,
  resize = true,
}: AccessibleTextareaProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textareaId = `textarea-${name}`;
  const descriptionId = description ? `${textareaId}-description` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const countId = maxLength ? `${textareaId}-count` : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    // Update word count
    const words = newValue.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Clear error when user starts typing
    if (error && touched) {
      setError(null);
    }
    
    onChange?.(newValue);

    // Auto-save announcement for journal entries
    if (name === 'journal' || name === 'entry') {
      // Debounced auto-save announcement
      const announce = () => announceToScreenReader('Journal auto-saved', 'polite');
      setTimeout(announce, 2000);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setTouched(true);
    const value = event.target.value;
    
    // Run validation on blur
    if (validation) {
      const validationError = validation(value);
      setError(validationError);
    }
    
    onBlur?.(value);
  };

  const isCrisisModeActive = settings.crisisMode || settings.emergencyMode;
  const hasError = error && touched;

  return (
    <div className={`accessible-textarea-group ${className}`}>
      {/* Label */}
      <label
        htmlFor={textareaId}
        className={`
          form-label block font-semibold mb-2
          ${isCrisisModeActive ? 'text-lg' : 'text-base'}
          ${hasError ? 'text-red-700' : 'text-gray-900'}
        `}
      >
        {label}
        {required && (
          <span className="required-indicator text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <div
          id={descriptionId}
          className="form-description text-sm text-gray-600 mb-2"
        >
          {description}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        id={textareaId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={isCrisisModeActive ? Math.max(rows, 6) : rows}
        maxLength={maxLength}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`
          form-control w-full border-2 rounded-lg px-4 py-3 transition-colors
          ${isCrisisModeActive 
            ? 'text-lg leading-loose' 
            : 'text-base leading-relaxed'
          }
          ${hasError 
            ? 'border-red-500 bg-red-50 focus:border-red-600' 
            : 'border-gray-300 bg-white focus:border-blue-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${resize ? 'resize-vertical' : 'resize-none'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-describedby={[descriptionId, errorId, countId].filter(Boolean).join(' ')}
        aria-invalid={hasError}
        aria-required={required}
      />

      {/* Word/Character Count */}
      {(maxLength || name === 'journal') && (
        <div
          id={countId}
          className="form-count text-sm text-gray-500 mt-2 flex justify-between items-center"
        >
          <span>{wordCount} words</span>
          {maxLength && (
            <span className={value && value.length > maxLength * 0.9 ? 'text-orange-600' : ''}>
              {value?.length || 0} / {maxLength} characters
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div
          id={errorId}
          className="form-error mt-2 text-sm text-red-700 flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <span className="text-red-500" aria-hidden="true">⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Accessible Select Component
 */
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AccessibleSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  description?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  validation?: (value: string) => string | null;
  className?: string;
  placeholder?: string;
}

export function AccessibleSelect({
  name,
  label,
  options,
  description,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  validation,
  className = '',
  placeholder,
}: AccessibleSelectProps) {
  const { settings } = useAccessibility();
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  const selectId = `select-${name}`;
  const descriptionId = description ? `${selectId}-description` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    
    // Clear error when user makes selection
    if (error && touched) {
      setError(null);
    }
    
    onChange?.(newValue);
  };

  const handleBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
    setTouched(true);
    const value = event.target.value;
    
    // Run validation on blur
    if (validation) {
      const validationError = validation(value);
      setError(validationError);
    }
    
    onBlur?.(value);
  };

  const isCrisisModeActive = settings.crisisMode || settings.emergencyMode;
  const hasError = error && touched;

  return (
    <div className={`accessible-select-group ${className}`}>
      {/* Label */}
      <label
        htmlFor={selectId}
        className={`
          form-label block font-semibold mb-2
          ${isCrisisModeActive ? 'text-lg' : 'text-base'}
          ${hasError ? 'text-red-700' : 'text-gray-900'}
        `}
      >
        {label}
        {required && (
          <span className="required-indicator text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <div
          id={descriptionId}
          className="form-description text-sm text-gray-600 mb-2"
        >
          {description}
        </div>
      )}

      {/* Select */}
      <select
        ref={selectRef}
        id={selectId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`
          form-control w-full border-2 rounded-lg px-4 py-3 transition-colors
          ${isCrisisModeActive 
            ? 'text-lg min-h-[56px] border-gray-400' 
            : 'text-base min-h-[48px] border-gray-300'
          }
          ${hasError 
            ? 'border-red-500 bg-red-50 focus:border-red-600' 
            : 'border-gray-300 bg-white focus:border-blue-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ')}
        aria-invalid={hasError}
        aria-required={required}
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

      {/* Error Message */}
      {hasError && (
        <div
          id={errorId}
          className="form-error mt-2 text-sm text-red-700 flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <span className="text-red-500" aria-hidden="true">⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export { AccessibleForm, AccessibleInput, AccessibleTextarea, AccessibleSelect };