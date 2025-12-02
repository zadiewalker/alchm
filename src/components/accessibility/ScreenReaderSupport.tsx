'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Screen Reader Support Component
 * 
 * Provides comprehensive screen reader support for ALCHM with trauma-informed considerations.
 * Includes live regions, landmarks, and semantic structure for assistive technologies.
 */

interface ScreenReaderSupportProps {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
  skipToContent?: boolean;
  landmarkNavigation?: boolean;
}

export function ScreenReaderSupport({
  children,
  pageTitle,
  pageDescription,
  skipToContent = true,
  landmarkNavigation = true,
}: ScreenReaderSupportProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const mainContentRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const skipLinksRef = useRef<HTMLDivElement>(null);

  // Announce page changes to screen readers
  useEffect(() => {
    const timeout = setTimeout(() => {
      announceToScreenReader(`Page loaded: ${pageTitle}`, 'assertive');
      if (pageDescription) {
        announceToScreenReader(pageDescription, 'polite');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [pageTitle, pageDescription, announceToScreenReader]);

  // Handle skip link navigation
  const handleSkipToContent = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (mainContentRef.current) {
        mainContentRef.current.focus();
        mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSkipToNavigation = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (navigationRef.current) {
        navigationRef.current.focus();
        navigationRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Page metadata for screen readers */}
      <div className="sr-only">
        <h1>{pageTitle}</h1>
        {pageDescription && <p>{pageDescription}</p>}
        {settings.crisisMode && (
          <div role="alert" aria-live="assertive">
            Crisis support mode is active. Interface has been simplified with larger buttons and emergency resources are prioritized.
          </div>
        )}
      </div>

      {/* Skip links for keyboard navigation */}
      {skipToContent && (
        <div ref={skipLinksRef} className="skip-links">
          <a
            href="#main-content"
            className="skip-link focus-ring"
            onKeyDown={handleSkipToContent}
            aria-describedby="skip-content-description"
          >
            Skip to main content
          </a>
          <div id="skip-content-description" className="sr-only">
            Press Enter to jump to the main content area
          </div>

          {landmarkNavigation && (
            <>
              <a
                href="#navigation"
                className="skip-link focus-ring"
                onKeyDown={handleSkipToNavigation}
                aria-describedby="skip-nav-description"
              >
                Skip to navigation
              </a>
              <div id="skip-nav-description" className="sr-only">
                Press Enter to jump to the navigation menu
              </div>
            </>
          )}

          {settings.crisisMode && (
            <>
              <a
                href="#crisis-resources"
                className="skip-link focus-ring"
                aria-describedby="skip-crisis-description"
              >
                Skip to crisis resources
              </a>
              <div id="skip-crisis-description" className="sr-only">
                Press Enter to jump directly to emergency support resources
              </div>
            </>
          )}
        </div>
      )}

      {/* Main landmark structure */}
      <div className="screen-reader-structure">
        {/* Application landmark */}
        <div role="application" aria-label="ALCHM Trauma-Informed Journaling Application">
          
          {/* Banner landmark - site header */}
          <header role="banner" aria-label="Site header with navigation and accessibility controls">
            {/* Page header will be inserted here by parent components */}
          </header>

          {/* Navigation landmark */}
          {landmarkNavigation && (
            <nav 
              ref={navigationRef}
              role="navigation" 
              aria-label="Main navigation"
              id="navigation"
              tabIndex={-1}
            >
              {/* Navigation content will be inserted by parent components */}
            </nav>
          )}

          {/* Crisis resources landmark - high priority for screen readers */}
          {settings.crisisMode && (
            <aside 
              role="region" 
              aria-label="Crisis support resources"
              aria-describedby="crisis-region-description"
              id="crisis-resources"
              className="crisis-priority-region"
            >
              <div id="crisis-region-description" className="sr-only">
                Emergency mental health resources and crisis support contacts
              </div>
              {/* Crisis resources will be inserted by parent components */}
            </aside>
          )}

          {/* Main content landmark */}
          <main 
            ref={mainContentRef}
            role="main" 
            aria-label={`Main content: ${pageTitle}`}
            id="main-content"
            tabIndex={-1}
          >
            {/* Content wrapper with proper headings hierarchy */}
            <div className="content-wrapper">
              {children}
            </div>
          </main>

          {/* Complementary content landmark */}
          <aside role="complementary" aria-label="Additional resources and tools">
            {/* Sidebar content will be inserted by parent components */}
          </aside>

          {/* Content info landmark - footer */}
          <footer role="contentinfo" aria-label="Site footer with legal information and additional resources">
            {/* Footer content will be inserted by parent components */}
          </footer>

        </div>
      </div>

      {/* Live regions for dynamic content announcements */}
      <LiveRegions />
    </>
  );
}

/**
 * Live Regions Component
 * 
 * Manages ARIA live regions for announcing dynamic content changes to screen readers.
 */
function LiveRegions() {
  const statusRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  return (
    <div className="live-regions sr-only">
      {/* Status updates - polite announcements */}
      <div
        ref={statusRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id="status-announcements"
        aria-label="Status updates"
      />

      {/* Alert announcements - assertive/urgent */}
      <div
        ref={alertRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        id="alert-announcements"
        aria-label="Important alerts"
      />

      {/* Log announcements - for journal entries, progress, etc. */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        id="log-announcements"
        aria-label="Activity log"
      />
    </div>
  );
}

/**
 * Accessible Heading Component
 * 
 * Ensures proper heading hierarchy for screen reader navigation.
 */
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
  tabIndex?: number;
}

export function AccessibleHeading({ 
  level, 
  children, 
  className = '',
  id,
  tabIndex
}: AccessibleHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return React.createElement(
    HeadingTag,
    {
      className: `accessible-heading heading-level-${level} ${className}`,
      id,
      tabIndex,
      'aria-level': level,
    },
    children
  );
}

/**
 * Accessible Description Component
 * 
 * Provides accessible descriptions for complex content.
 */
interface AccessibleDescriptionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleDescription({ id, children, className = '' }: AccessibleDescriptionProps) {
  return (
    <div
      id={id}
      className={`accessible-description ${className}`}
      role="note"
      aria-label="Additional description"
    >
      {children}
    </div>
  );
}

/**
 * Accessible List Component
 * 
 * Provides properly structured lists for screen readers.
 */
interface AccessibleListProps {
  type?: 'unordered' | 'ordered' | 'description';
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  itemCount?: number;
}

export function AccessibleList({ 
  type = 'unordered', 
  children, 
  className = '',
  ariaLabel,
  itemCount
}: AccessibleListProps) {
  const listProps = {
    className: `accessible-list ${className}`,
    'aria-label': ariaLabel,
    ...(itemCount && { 'aria-setsize': itemCount }),
  };

  if (type === 'ordered') {
    return <ol {...listProps}>{children}</ol>;
  } else if (type === 'description') {
    return <dl {...listProps}>{children}</dl>;
  } else {
    return <ul {...listProps}>{children}</ul>;
  }
}

/**
 * Accessible Button Component
 * 
 * Enhanced button with proper ARIA attributes and keyboard support.
 */
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  type?: 'button' | 'submit' | 'reset';
  role?: string;
}

export function AccessibleButton({
  children,
  onClick,
  onKeyDown,
  className = '',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  type = 'button',
  role = 'button',
}: AccessibleButtonProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
    
    // Handle Enter and Space key activation
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !disabled) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type={type}
      role={role}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`accessible-button touch-target focus-ring ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}

export default ScreenReaderSupport;