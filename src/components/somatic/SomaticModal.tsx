'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface SomaticModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  nervousSystemAware?: boolean;
  breathingBackdrop?: boolean;
  gentleEntry?: boolean;
  crisisMode?: boolean;
  className?: string;
}

/**
 * SomaticModal - Modal component designed to feel safe and containing
 * Provides gentle entry/exit, breathing backdrop, and nervous system awareness
 */
export function SomaticModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  nervousSystemAware = true,
  breathingBackdrop = true,
  gentleEntry = true,
  crisisMode = false,
  className = ''
}: SomaticModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [nervousState, setNervousState] = useState<'calm' | 'activated' | 'withdrawn'>('calm');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Track nervous system state based on interaction patterns
  useEffect(() => {
    if (!nervousSystemAware || !isOpen) return;

    let clickCount = 0;
    let lastClickTime = 0;

    const handleClick = () => {
      const now = performance.now();
      const timeSinceLastClick = now - lastClickTime;
      
      if (timeSinceLastClick < 500) {
        clickCount++;
      } else {
        clickCount = 1;
      }
      
      if (clickCount > 3) {
        setNervousState('activated'); // Rapid clicking = activation
      } else if (timeSinceLastClick > 5000) {
        setNervousState('withdrawn'); // Long delays = withdrawal
      } else {
        setNervousState('calm'); // Normal interaction
      }
      
      lastClickTime = now;
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, nervousSystemAware]);

  // Handle modal open/close with gentle timing
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Gentle entry timing
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Focus management for accessibility
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, gentleEntry ? 100 : 0);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      setIsClosing(true);
      
      // Gentle exit timing
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        
        // Restore focus
        if (previousFocus.current) {
          previousFocus.current.focus();
        }
      }, gentleEntry ? 200 : 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, gentleEntry]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !crisisMode) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, crisisMode]);

  const getSizeClasses = () => {
    const sizeMap = {
      small: 'max-w-md',
      medium: 'max-w-lg',
      large: 'max-w-2xl',
      fullscreen: 'max-w-full h-full'
    };
    
    return sizeMap[size];
  };

  const getBackdropClasses = () => {
    const baseClasses = 'fixed inset-0 z-50 flex items-center justify-center p-4';
    const breathingClasses = breathingBackdrop ? 'somatic-breathing-surface' : '';
    const stateClasses = nervousSystemAware ? {
      calm: 'bg-black bg-opacity-40',
      activated: 'bg-sage-900 bg-opacity-30', // Gentler for activation
      withdrawn: 'bg-sage-800 bg-opacity-50' // More containment for withdrawal
    }[nervousState] : 'bg-black bg-opacity-40';

    return `${baseClasses} ${breathingClasses} ${stateClasses}`;
  };

  const getModalClasses = () => {
    const baseClasses = 'somatic-foundation somatic-safe-container relative';
    const sizeClasses = getSizeClasses();
    const stateClasses = nervousSystemAware ? {
      calm: 'nervous-state-safe',
      activated: 'nervous-state-activated border-2 border-sage-300',
      withdrawn: 'nervous-state-shutdown'
    }[nervousState] : 'nervous-state-safe';
    
    const crisisClasses = crisisMode ? 'border-2 border-crisis-red shadow-xl' : '';
    const visibilityClasses = isVisible && !isClosing ? 
      'animate-gentle-fade' : 
      'opacity-0 transform scale-95';

    return [
      baseClasses,
      sizeClasses,
      stateClasses,
      crisisClasses,
      visibilityClasses,
      className
    ].filter(Boolean).join(' ');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !crisisMode) {
      onClose();
    }
  };

  if (!isOpen && !isVisible) {
    return null;
  }

  const modalContent = (
    <div
      className={getBackdropClasses()}
      onClick={handleBackdropClick}
      style={{
        backdropFilter: breathingBackdrop ? 'blur(8px)' : 'blur(4px)',
        WebkitBackdropFilter: breathingBackdrop ? 'blur(8px)' : 'blur(4px)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.6, 1)'
      }}
    >
      <div
        ref={modalRef}
        className={getModalClasses()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        style={{
          maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
          overflowY: 'auto',
          borderRadius: size === 'fullscreen' ? '0' : '24px',
          padding: 'var(--somatic-space-social)',
          background: 'rgba(254, 252, 251, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transition: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Close button - positioned for easy access */}
        {!crisisMode && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-sage-50 hover:bg-sage-100 transition-colors duration-200 z-10"
            style={{
              minHeight: '44px',
              minWidth: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close modal"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="text-sage-600"
            >
              <path 
                d="M15 5L5 15M5 5L15 15" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Modal header */}
        {title && (
          <div className="somatic-space-personal border-b border-sage-200 pb-4 mb-6">
            <h2 
              id="modal-title"
              className="somatic-heading text-xl font-medium text-sage-800"
            >
              {title}
            </h2>
          </div>
        )}

        {/* Modal content */}
        <div className="somatic-space-personal">
          {children}
        </div>

        {/* Breathing guide for long content */}
        {breathingBackdrop && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-30"
            aria-hidden="true"
          >
            <div className="w-2 h-2 rounded-full bg-sage-400 breathing-coherent" />
          </div>
        )}
      </div>
    </div>
  );

  // Render modal in portal
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}

/**
 * SomaticConfirmModal - Confirmation modal with somatic awareness
 */
interface SomaticConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'gentle' | 'caution' | 'crisis';
  breathingSpace?: boolean;
}

export function SomaticConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'gentle',
  breathingSpace = true
}: SomaticConfirmModalProps) {
  const [hasConsidered, setHasConsidered] = useState(false);

  // Require brief consideration time for important decisions
  useEffect(() => {
    if (isOpen && variant !== 'gentle') {
      const timer = setTimeout(() => {
        setHasConsidered(true);
      }, 2000); // 2 second consideration period

      return () => {
        clearTimeout(timer);
        setHasConsidered(false);
      };
    } else {
      setHasConsidered(true);
    }
  }, [isOpen, variant]);

  const getVariantStyles = () => {
    const variants = {
      gentle: {
        confirmButton: 'bg-sage-400 hover:bg-sage-500 text-white',
        cancelButton: 'bg-sage-100 hover:bg-sage-200 text-sage-700',
        icon: '💚',
        iconColor: 'text-sage-600'
      },
      caution: {
        confirmButton: 'bg-crisis-amber hover:bg-yellow-600 text-white',
        cancelButton: 'bg-sage-100 hover:bg-sage-200 text-sage-700',
        icon: '⚠️',
        iconColor: 'text-yellow-600'
      },
      crisis: {
        confirmButton: 'bg-crisis-red hover:bg-crisis-red-hover text-white',
        cancelButton: 'bg-sage-400 hover:bg-sage-500 text-white',
        icon: '🚨',
        iconColor: 'text-crisis-red'
      }
    };

    return variants[variant];
  };

  const styles = getVariantStyles();

  return (
    <SomaticModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      breathingBackdrop={breathingSpace}
      crisisMode={variant === 'crisis'}
    >
      <div className="text-center somatic-space-social">
        {/* Icon */}
        <div className={`text-4xl mb-4 ${styles.iconColor}`} role="img" aria-hidden="true">
          {styles.icon}
        </div>

        {/* Message */}
        <p className="somatic-text text-sage-700 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Breathing space for consideration */}
        {breathingSpace && !hasConsidered && variant !== 'gentle' && (
          <div className="mb-4">
            <div className="w-8 h-8 mx-auto breathing-coherent bg-sage-200 rounded-full" />
            <p className="somatic-text text-xs text-sage-500 mt-2">
              Taking a moment to consider...
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={onClose}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200
              min-h-[48px] min-w-[48px]
              ${styles.cancelButton}
            `}
            style={{ touchAction: 'manipulation' }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={!hasConsidered}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200
              min-h-[48px] min-w-[48px]
              ${styles.confirmButton}
              ${!hasConsidered ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:-translate-y-0.5'}
            `}
            style={{ touchAction: 'manipulation' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </SomaticModal>
  );
}

/**
 * SomaticDrawer - Bottom sheet/drawer with somatic entry
 */
interface SomaticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
  breathingHandle?: boolean;
  className?: string;
}

export function SomaticDrawer({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  breathingHandle = true,
  className = ''
}: SomaticDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      document.body.style.overflow = 'hidden';
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const getHeightClass = () => {
    const heightMap = {
      auto: 'max-h-[80vh]',
      half: 'h-1/2',
      full: 'h-full'
    };
    
    return heightMap[height];
  };

  if (!isOpen) return null;

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={drawerRef}
        className={`
          somatic-foundation somatic-safe-container
          w-full ${getHeightClass()}
          transform transition-all duration-300 ease-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          ${className}
        `}
        style={{
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          background: 'rgba(254, 252, 251, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto'
        }}
      >
        {/* Handle */}
        {breathingHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div 
              className="w-12 h-1 bg-sage-300 rounded-full breathing-grounding"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-sage-200">
            <h2 className="somatic-heading text-lg font-medium text-sage-800">
              {title}
            </h2>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-sage-50 hover:bg-sage-100 transition-colors duration-200"
              style={{ minHeight: '44px', minWidth: '44px' }}
              aria-label="Close drawer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path 
                  d="M15 5L5 15M5 5L15 15" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof window !== 'undefined') {
    return createPortal(drawerContent, document.body);
  }

  return null;
}