'use client';

import React, { useEffect, useState } from 'react';

// Screen Reader Announcer Component
export function ScreenReaderAnnouncer() {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    // Listen for global announcements
    const handleAnnounce = (event: CustomEvent) => {
      setAnnouncement(event.detail.message);
      // Clear after announcement
      setTimeout(() => setAnnouncement(''), 100);
    };
    
    window.addEventListener('announce', handleAnnounce as EventListener);
    return () => window.removeEventListener('announce', handleAnnounce as EventListener);
  }, []);

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
      id="screen-reader-announcer"
    >
      {announcement}
    </div>
  );
}

// Global function to announce to screen readers
export function announce(message: string) {
  window.dispatchEvent(new CustomEvent('announce', { 
    detail: { message } 
  }));
}

// Skip Navigation Component
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
                 bg-sage-400 text-white px-4 py-2 rounded-lg font-medium
                 focus:shadow-sacred transition-all duration-200
                 focus-visible:ring-3 focus-visible:ring-sage-600"
    >
      Skip to main content
    </a>
  );
}

// Focus Management Hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  
  const saveFocus = () => {
    setFocusedElement(document.activeElement as HTMLElement);
  };
  
  const restoreFocus = () => {
    if (focusedElement && document.contains(focusedElement)) {
      focusedElement.focus();
    }
  };
  
  const focusFirstInteractiveElement = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };
  
  return { saveFocus, restoreFocus, focusFirstInteractiveElement };
}

// High Contrast Mode Detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isHighContrast;
}

// Reduced Motion Detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// ARIA Landmark Helper
interface LandmarkProps {
  children: React.ReactNode;
  as?: 'main' | 'nav' | 'section' | 'aside' | 'header' | 'footer';
  label?: string;
  className?: string;
}

export function Landmark({ 
  children, 
  as: Component = 'div', 
  label,
  className = '' 
}: LandmarkProps) {
  const landmarkProps: any = {};
  
  if (Component === 'nav' && label) {
    landmarkProps['aria-label'] = label;
  }
  
  if (Component === 'section' && label) {
    landmarkProps['aria-labelledby'] = label;
  }
  
  if (Component === 'main') {
    landmarkProps['id'] = 'main-content';
  }
  
  return (
    <Component className={className} {...landmarkProps}>
      {children}
    </Component>
  );
}

// Color Contrast Warning Component (Development Only)
export function ColorContrastWarning({ 
  backgroundColor, 
  textColor, 
  level = 'AA' 
}: { 
  backgroundColor: string; 
  textColor: string; 
  level?: 'AA' | 'AAA' 
}) {
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);
  
  useEffect(() => {
    // In production, you'd use a proper contrast calculation library
    // This is a simplified example
    const calculateContrast = (bg: string, text: string) => {
      // Simplified calculation - in production use proper luminance calculation
      return 4.5; // Placeholder
    };
    
    setContrastRatio(calculateContrast(backgroundColor, textColor));
  }, [backgroundColor, textColor]);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  const requiredRatio = level === 'AAA' ? 7 : 4.5;
  const passes = contrastRatio && contrastRatio >= requiredRatio;
  
  return !passes ? (
    <div className="fixed bottom-4 left-4 bg-red-600 text-white p-2 rounded text-xs z-50">
      Contrast ratio too low: {contrastRatio?.toFixed(2)} (needs {requiredRatio})
    </div>
  ) : null;
}