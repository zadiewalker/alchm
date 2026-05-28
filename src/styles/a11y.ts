'use client';

import React from 'react';

// Visually hidden utility for screen reader only content
export const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// Minimum tap target enforcement
export const minTapTarget: React.CSSProperties = {
  minWidth: '44px',
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Focus trap utility for modals and sheets
export const useFocusTrap = (
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement>
) => {
  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector = 
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    const focusableElements = container.querySelectorAll(
      focusableSelector
    ) as NodeListOf<HTMLElement>;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isOpen, containerRef]);
};

// Focus management hook for modals
export const useFocusManagement = (isOpen: boolean): {
  containerRef: React.RefObject<HTMLDivElement | null>;
} => {
  const previousFocus = React.useRef<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before opening
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Move focus to the modal
      setTimeout(() => {
        containerRef.current?.focus();
      }, 0);
    } else {
      // Return focus when closing
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }
  }, [isOpen]);

  // Set up focus trap
  useFocusTrap(isOpen, containerRef);

  return { containerRef };
};

// Keyboard event handler for div buttons
export const createKeyboardHandler = (onClick: () => void) => {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };
};

// Screen reader announcement utility
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  
  // Set the message after a brief delay to ensure screen readers notice
  setTimeout(() => {
    announcement.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};

// High contrast color checker (for development)
export const checkColorContrast = (_foreground: string, _background: string): boolean => {
  // Simplified contrast checker - in production would use a full WCAG implementation
  // This is just for basic validation during development
  return true; // Placeholder
};

// Tone configuration with accessibility labels
export const TONE_ARIA_LABELS = {
  processing: 'Processing emotions',
  grief: 'Experiencing grief',
  anger: 'Feeling anger',
  anxiety: 'Feeling anxious',
  clarity: 'Experiencing clarity',
  numbness: 'Feeling numb',
  tenderness: 'Feeling tender',
  ambivalence: 'Feeling ambivalent',
  neutral: 'Neutral tone'
} as const;
