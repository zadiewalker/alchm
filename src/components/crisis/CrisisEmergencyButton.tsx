/**
 * ALCHM Crisis Emergency Button Component
 * 
 * MISSION CRITICAL: Emergency button design using crisis-safe patterns.
 * Uses muted red (#b87d7d) that is serious but not jarring during vulnerable moments.
 * 
 * Design Principles:
 * - Muted red that conveys urgency without triggering panic
 * - Large touch targets for trembling hands or motor difficulties
 * - Clear, readable text during dissociative states
 * - Accessible focus states and keyboard navigation
 * - Multiple activation methods (click, enter, space)
 * - Gentle animations that feel supportive rather than alarming
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  ExternalLink,
  AlertTriangle,
  Headphones
} from 'lucide-react';

export type EmergencyButtonVariant = 
  | 'primary'      // Main emergency button
  | 'call'         // Phone call action
  | 'text'         // Text/SMS action  
  | 'chat'         // Chat/messaging action
  | 'resource'     // General resource access
  | 'safety';      // Safety check/confirmation

export type EmergencyButtonSize = 
  | 'default'      // Standard size (56px min height)
  | 'large'        // Large size (64px min height)
  | 'compact'      // Compact size (48px min height)
  | 'mobile';      // Mobile optimized (60px min height)

interface CrisisEmergencyButtonProps {
  children: React.ReactNode;
  variant?: EmergencyButtonVariant;
  size?: EmergencyButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
  autoFocus?: boolean;
  pulseAnimation?: boolean;
  glowEffect?: boolean;
}

/**
 * Crisis Emergency Button Component
 * 
 * Implements crisis-safe emergency button patterns with muted red design
 */
export const CrisisEmergencyButton: React.FC<CrisisEmergencyButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = '',
  'aria-label': ariaLabel,
  'data-testid': testId,
  autoFocus = false,
  pulseAnimation = false,
  glowEffect = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Auto-focus for critical emergency states
  useEffect(() => {
    if (autoFocus && !disabled) {
      const element = buttonRef.current || linkRef.current;
      if (element) {
        element.focus();
      }
    }
  }, [autoFocus, disabled]);

  // Get variant-specific icon
  const getVariantIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'call':
        return <Phone size={20} />;
      case 'text':
        return <MessageCircle size={20} />;
      case 'chat':
        return <Headphones size={20} />;
      case 'safety':
        return <Shield size={20} />;
      case 'resource':
        return <ExternalLink size={20} />;
      default:
        return <Heart size={20} />;
    }
  };

  // Handle button interaction
  const handleInteraction = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (disabled || loading) return;
    
    // Prevent double-triggering
    event.preventDefault();
    
    if (onClick) {
      onClick();
    } else if (href) {
      // Handle different types of links
      if (href.startsWith('tel:') || href.startsWith('sms:')) {
        window.location.href = href;
      } else {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Handle keyboard interaction
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressed(true);
      handleInteraction(event);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressed(false);
    }
  };

  // Build CSS classes
  const baseClasses = [
    'crisis-emergency-button',
    `crisis-emergency-button--${variant}`,
    `crisis-emergency-button--${size}`,
    disabled && 'crisis-emergency-button--disabled',
    loading && 'crisis-emergency-button--loading',
    isPressed && 'crisis-emergency-button--pressed',
    isFocused && 'crisis-emergency-button--focused',
    pulseAnimation && 'crisis-emergency-button--pulse',
    glowEffect && 'crisis-emergency-button--glow',
    className
  ].filter(Boolean).join(' ');

  // Common props
  const commonProps = {
    className: baseClasses,
    'aria-label': ariaLabel,
    'data-testid': testId,
    'aria-disabled': disabled,
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  };

  // Render as link if href provided
  if (href && !disabled) {
    return (
      <a
        ref={linkRef}
        href={href}
        {...commonProps}
        onClick={handleInteraction}
        tabIndex={0}
        role="button"
      >
        <span className="crisis-emergency-button__content">
          {loading ? (
            <div className="crisis-emergency-button__spinner" />
          ) : (
            <>
              <span className="crisis-emergency-button__icon">
                {getVariantIcon()}
              </span>
              <span className="crisis-emergency-button__text">
                {children}
              </span>
            </>
          )}
        </span>
        
        <style jsx>{`
          .crisis-emergency-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 1.5rem;
            background: var(--crisis-emergency-red, #b87d7d);
            color: white;
            border: 2px solid var(--crisis-emergency-red, #b87d7d);
            border-radius: 12px;
            font-family: inherit;
            font-size: 1.125rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            user-select: none;
            min-height: 56px;
            min-width: 160px;
            box-shadow: 
              0 2px 8px rgba(184, 125, 125, 0.2),
              0 1px 3px rgba(184, 125, 125, 0.1);
          }

          /* Size Variants */
          .crisis-emergency-button--default {
            min-height: 56px;
            min-width: 160px;
            padding: 1rem 1.5rem;
            font-size: 1.125rem;
          }

          .crisis-emergency-button--large {
            min-height: 64px;
            min-width: 200px;
            padding: 1.25rem 2rem;
            font-size: 1.25rem;
            border-radius: 16px;
          }

          .crisis-emergency-button--compact {
            min-height: 48px;
            min-width: 120px;
            padding: 0.875rem 1.25rem;
            font-size: 1rem;
          }

          .crisis-emergency-button--mobile {
            min-height: 60px;
            min-width: 100%;
            padding: 1.125rem 1.5rem;
            font-size: 1.25rem;
          }

          /* Variant Styles */
          .crisis-emergency-button--call {
            background: var(--crisis-emergency-red, #b87d7d);
            border-color: var(--crisis-emergency-red, #b87d7d);
          }

          .crisis-emergency-button--text {
            background: var(--crisis-support-blue, #7da3b8);
            border-color: var(--crisis-support-blue, #7da3b8);
          }

          .crisis-emergency-button--chat {
            background: var(--crisis-support-purple, #9b87b8);
            border-color: var(--crisis-support-purple, #9b87b8);
          }

          .crisis-emergency-button--safety {
            background: var(--crisis-sage-primary, #8ba675);
            border-color: var(--crisis-sage-primary, #8ba675);
          }

          .crisis-emergency-button--resource {
            background: var(--crisis-neutral-600, #6c757d);
            border-color: var(--crisis-neutral-600, #6c757d);
          }

          /* Hover States */
          .crisis-emergency-button:hover:not(.crisis-emergency-button--disabled) {
            background: var(--crisis-emergency-red-hover, #a66d6d);
            border-color: var(--crisis-emergency-red-hover, #a66d6d);
            transform: translateY(-1px);
            box-shadow: 
              0 4px 12px rgba(184, 125, 125, 0.25),
              0 2px 6px rgba(184, 125, 125, 0.15);
          }

          .crisis-emergency-button--text:hover:not(.crisis-emergency-button--disabled) {
            background: #6a8ca0;
            border-color: #6a8ca0;
          }

          .crisis-emergency-button--chat:hover:not(.crisis-emergency-button--disabled) {
            background: #8976a0;
            border-color: #8976a0;
          }

          .crisis-emergency-button--safety:hover:not(.crisis-emergency-button--disabled) {
            background: #7a9564;
            border-color: #7a9564;
          }

          .crisis-emergency-button--resource:hover:not(.crisis-emergency-button--disabled) {
            background: #5a646d;
            border-color: #5a646d;
          }

          /* Active/Pressed States */
          .crisis-emergency-button--pressed,
          .crisis-emergency-button:active {
            background: var(--crisis-emergency-red-active, #955d5d);
            border-color: var(--crisis-emergency-red-active, #955d5d);
            transform: translateY(0);
            box-shadow: 0 1px 4px rgba(184, 125, 125, 0.2);
          }

          /* Focus States */
          .crisis-emergency-button--focused,
          .crisis-emergency-button:focus {
            outline: 3px solid rgba(184, 125, 125, 0.5);
            outline-offset: 2px;
          }

          /* Disabled State */
          .crisis-emergency-button--disabled {
            background: var(--crisis-neutral-300, #dee2e6);
            border-color: var(--crisis-neutral-300, #dee2e6);
            color: var(--crisis-neutral-500, #adb5bd);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          /* Loading State */
          .crisis-emergency-button--loading {
            cursor: wait;
            color: transparent;
          }

          /* Pulse Animation */
          .crisis-emergency-button--pulse {
            animation: crisis-button-pulse 2s ease-in-out infinite;
          }

          @keyframes crisis-button-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.9;
            }
          }

          /* Glow Effect */
          .crisis-emergency-button--glow {
            animation: crisis-button-glow 3s ease-in-out infinite;
          }

          @keyframes crisis-button-glow {
            0%, 100% {
              box-shadow: 
                0 2px 8px rgba(184, 125, 125, 0.2),
                0 1px 3px rgba(184, 125, 125, 0.1);
            }
            50% {
              box-shadow: 
                0 4px 16px rgba(184, 125, 125, 0.4),
                0 2px 8px rgba(184, 125, 125, 0.2),
                0 0 20px rgba(184, 125, 125, 0.1);
            }
          }

          /* Button Content Layout */
          .crisis-emergency-button__content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            position: relative;
            z-index: 2;
          }

          .crisis-emergency-button__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .crisis-emergency-button__text {
            font-weight: inherit;
            line-height: 1.2;
          }

          /* Loading Spinner */
          .crisis-emergency-button__spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: crisis-button-spin 1s linear infinite;
          }

          @keyframes crisis-button-spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .crisis-emergency-button--default,
            .crisis-emergency-button--large,
            .crisis-emergency-button--compact {
              min-height: 60px;
              font-size: 1.25rem;
              padding: 1.125rem 1.5rem;
            }

            .crisis-emergency-button--mobile {
              min-height: 64px;
              font-size: 1.375rem;
            }
          }

          /* High Contrast Mode */
          @media (prefers-contrast: high) {
            .crisis-emergency-button {
              border-width: 3px;
              background: #8b0000;
              border-color: #8b0000;
            }

            .crisis-emergency-button:focus {
              outline-width: 4px;
            }
          }

          /* Reduced Motion */
          @media (prefers-reduced-motion: reduce) {
            .crisis-emergency-button {
              transition: none;
            }

            .crisis-emergency-button:hover {
              transform: none;
            }

            .crisis-emergency-button--pulse,
            .crisis-emergency-button--glow {
              animation: none;
            }

            .crisis-emergency-button__spinner {
              animation: none;
              border: 2px solid currentColor;
              border-radius: 0;
            }
          }
        `}</style>
      </a>
    );
  }

  // Render as button
  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      {...commonProps}
      onClick={handleInteraction}
    >
      <span className="crisis-emergency-button__content">
        {loading ? (
          <div className="crisis-emergency-button__spinner" />
        ) : (
          <>
            <span className="crisis-emergency-button__icon">
              {getVariantIcon()}
            </span>
            <span className="crisis-emergency-button__text">
              {children}
            </span>
          </>
        )}
      </span>
      
      <style jsx>{`
        .crisis-emergency-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.5rem;
          background: var(--crisis-emergency-red, #b87d7d);
          color: white;
          border: 2px solid var(--crisis-emergency-red, #b87d7d);
          border-radius: 12px;
          font-family: inherit;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          user-select: none;
          min-height: 56px;
          min-width: 160px;
          box-shadow: 
            0 2px 8px rgba(184, 125, 125, 0.2),
            0 1px 3px rgba(184, 125, 125, 0.1);
        }

        /* Size Variants */
        .crisis-emergency-button--default {
          min-height: 56px;
          min-width: 160px;
          padding: 1rem 1.5rem;
          font-size: 1.125rem;
        }

        .crisis-emergency-button--large {
          min-height: 64px;
          min-width: 200px;
          padding: 1.25rem 2rem;
          font-size: 1.25rem;
          border-radius: 16px;
        }

        .crisis-emergency-button--compact {
          min-height: 48px;
          min-width: 120px;
          padding: 0.875rem 1.25rem;
          font-size: 1rem;
        }

        .crisis-emergency-button--mobile {
          min-height: 60px;
          width: 100%;
          padding: 1.125rem 1.5rem;
          font-size: 1.25rem;
        }

        /* Variant Styles */
        .crisis-emergency-button--call {
          background: var(--crisis-emergency-red, #b87d7d);
          border-color: var(--crisis-emergency-red, #b87d7d);
        }

        .crisis-emergency-button--text {
          background: var(--crisis-support-blue, #7da3b8);
          border-color: var(--crisis-support-blue, #7da3b8);
        }

        .crisis-emergency-button--chat {
          background: var(--crisis-support-purple, #9b87b8);
          border-color: var(--crisis-support-purple, #9b87b8);
        }

        .crisis-emergency-button--safety {
          background: var(--crisis-sage-primary, #8ba675);
          border-color: var(--crisis-sage-primary, #8ba675);
        }

        .crisis-emergency-button--resource {
          background: var(--crisis-neutral-600, #6c757d);
          border-color: var(--crisis-neutral-600, #6c757d);
        }

        /* Hover States */
        .crisis-emergency-button:hover:not(:disabled):not(.crisis-emergency-button--disabled) {
          background: var(--crisis-emergency-red-hover, #a66d6d);
          border-color: var(--crisis-emergency-red-hover, #a66d6d);
          transform: translateY(-1px);
          box-shadow: 
            0 4px 12px rgba(184, 125, 125, 0.25),
            0 2px 6px rgba(184, 125, 125, 0.15);
        }

        .crisis-emergency-button--text:hover:not(:disabled) {
          background: #6a8ca0;
          border-color: #6a8ca0;
        }

        .crisis-emergency-button--chat:hover:not(:disabled) {
          background: #8976a0;
          border-color: #8976a0;
        }

        .crisis-emergency-button--safety:hover:not(:disabled) {
          background: #7a9564;
          border-color: #7a9564;
        }

        .crisis-emergency-button--resource:hover:not(:disabled) {
          background: #5a646d;
          border-color: #5a646d;
        }

        /* Active/Pressed States */
        .crisis-emergency-button--pressed,
        .crisis-emergency-button:active:not(:disabled) {
          background: var(--crisis-emergency-red-active, #955d5d);
          border-color: var(--crisis-emergency-red-active, #955d5d);
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(184, 125, 125, 0.2);
        }

        /* Focus States */
        .crisis-emergency-button--focused,
        .crisis-emergency-button:focus {
          outline: 3px solid rgba(184, 125, 125, 0.5);
          outline-offset: 2px;
        }

        /* Disabled State */
        .crisis-emergency-button:disabled,
        .crisis-emergency-button--disabled {
          background: var(--crisis-neutral-300, #dee2e6);
          border-color: var(--crisis-neutral-300, #dee2e6);
          color: var(--crisis-neutral-500, #adb5bd);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Loading State */
        .crisis-emergency-button--loading {
          cursor: wait;
          color: transparent;
        }

        /* Pulse Animation */
        .crisis-emergency-button--pulse {
          animation: crisis-button-pulse 2s ease-in-out infinite;
        }

        @keyframes crisis-button-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.9;
          }
        }

        /* Glow Effect */
        .crisis-emergency-button--glow {
          animation: crisis-button-glow 3s ease-in-out infinite;
        }

        @keyframes crisis-button-glow {
          0%, 100% {
            box-shadow: 
              0 2px 8px rgba(184, 125, 125, 0.2),
              0 1px 3px rgba(184, 125, 125, 0.1);
          }
          50% {
            box-shadow: 
              0 4px 16px rgba(184, 125, 125, 0.4),
              0 2px 8px rgba(184, 125, 125, 0.2),
              0 0 20px rgba(184, 125, 125, 0.1);
          }
        }

        /* Button Content Layout */
        .crisis-emergency-button__content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .crisis-emergency-button__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .crisis-emergency-button__text {
          font-weight: inherit;
          line-height: 1.2;
        }

        /* Loading Spinner */
        .crisis-emergency-button__spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: crisis-button-spin 1s linear infinite;
        }

        @keyframes crisis-button-spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .crisis-emergency-button--default,
          .crisis-emergency-button--large,
          .crisis-emergency-button--compact {
            min-height: 60px;
            font-size: 1.25rem;
            padding: 1.125rem 1.5rem;
          }

          .crisis-emergency-button--mobile {
            min-height: 64px;
            font-size: 1.375rem;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .crisis-emergency-button {
            border-width: 3px;
            background: #8b0000;
            border-color: #8b0000;
          }

          .crisis-emergency-button:focus {
            outline-width: 4px;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .crisis-emergency-button {
            transition: none;
          }

          .crisis-emergency-button:hover {
            transform: none;
          }

          .crisis-emergency-button--pulse,
          .crisis-emergency-button--glow {
            animation: none;
          }

          .crisis-emergency-button__spinner {
            animation: none;
            border: 2px solid currentColor;
            border-radius: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default CrisisEmergencyButton;