'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Keyboard Navigation Component
 * 
 * Provides comprehensive keyboard navigation support for ALCHM with trauma-informed design.
 * Ensures all functionality is available via keyboard for users who cannot use a mouse.
 */

interface KeyboardNavigationProps {
  children: React.ReactNode;
  enableRovingTabIndex?: boolean;
  enableArrowNavigation?: boolean;
  focusTrapEnabled?: boolean;
  escapeHandler?: () => void;
}

export function KeyboardNavigation({
  children,
  enableRovingTabIndex = false,
  enableArrowNavigation = false,
  focusTrapEnabled = false,
  escapeHandler,
}: KeyboardNavigationProps) {
  const { settings, focusManagement } = useAccessibility();
  const containerRef = useRef<HTMLDivElement>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndexRef = useRef<number>(-1);

  // Get all focusable elements within container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled]):not([tabindex="-1"])',
      'a[href]:not([tabindex="-1"])',
      'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled]):not([tabindex="-1"])',
      '[role="link"]:not([tabindex="-1"])',
      '[role="menuitem"]:not([disabled]):not([tabindex="-1"])',
      '[role="tab"]:not([disabled]):not([tabindex="-1"])',
      'summary:not([disabled]):not([tabindex="-1"])',
    ].join(', ');

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    // Filter out hidden elements
    return elements.filter(element => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
      );
    });
  }, []);

  // Update focusable elements list
  const updateFocusableElements = useCallback(() => {
    focusableElementsRef.current = getFocusableElements();
    
    if (enableRovingTabIndex) {
      // Set up roving tabindex
      focusableElementsRef.current.forEach((element, index) => {
        element.tabIndex = index === 0 ? 0 : -1;
      });
    }
  }, [getFocusableElements, enableRovingTabIndex]);

  // Set focus to specific element by index
  const focusElementByIndex = useCallback((index: number) => {
    const elements = focusableElementsRef.current;
    if (index >= 0 && index < elements.length) {
      const element = elements[index];
      
      if (enableRovingTabIndex) {
        // Update roving tabindex
        elements.forEach((el, i) => {
          el.tabIndex = i === index ? 0 : -1;
        });
      }
      
      element.focus();
      currentFocusIndexRef.current = index;
      
      // Announce to screen readers in crisis mode
      if (settings.crisisMode) {
        const elementText = element.textContent || element.getAttribute('aria-label') || 'Interactive element';
        // Use a timeout to avoid interrupting current announcements
        setTimeout(() => {
          const event = new CustomEvent('accessibility-announce', {
            detail: { message: `Focused: ${elementText}`, priority: 'polite' }
          });
          document.dispatchEvent(event);
        }, 100);
      }
    }
  }, [enableRovingTabIndex, settings.crisisMode]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const elements = focusableElementsRef.current;
    if (elements.length === 0) return;

    const currentIndex = elements.findIndex(el => el === document.activeElement);
    
    switch (event.key) {
      case 'Escape':
        if (escapeHandler) {
          event.preventDefault();
          escapeHandler();
        }
        break;

      case 'Tab':
        if (focusTrapEnabled) {
          event.preventDefault();
          const nextIndex = event.shiftKey 
            ? (currentIndex > 0 ? currentIndex - 1 : elements.length - 1)
            : (currentIndex < elements.length - 1 ? currentIndex + 1 : 0);
          focusElementByIndex(nextIndex);
        }
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        if (enableArrowNavigation) {
          event.preventDefault();
          const nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
          focusElementByIndex(nextIndex);
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (enableArrowNavigation) {
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
          focusElementByIndex(prevIndex);
        }
        break;

      case 'Home':
        if (enableArrowNavigation) {
          event.preventDefault();
          focusElementByIndex(0);
        }
        break;

      case 'End':
        if (enableArrowNavigation) {
          event.preventDefault();
          focusElementByIndex(elements.length - 1);
        }
        break;

      // Crisis mode shortcut keys
      case 'h':
      case 'H':
        if (settings.crisisMode && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          // Focus crisis help button
          const helpButton = document.querySelector('[data-crisis-help]') as HTMLElement;
          if (helpButton) {
            helpButton.focus();
          }
        }
        break;

      case 'e':
      case 'E':
        if (settings.emergencyMode && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          // Focus emergency contact
          const emergencyButton = document.querySelector('[data-emergency-contact]') as HTMLElement;
          if (emergencyButton) {
            emergencyButton.focus();
          }
        }
        break;
    }
  }, [
    enableArrowNavigation,
    focusTrapEnabled,
    escapeHandler,
    focusElementByIndex,
    settings.crisisMode,
    settings.emergencyMode,
  ]);

  // Set up keyboard event listeners
  useEffect(() => {
    updateFocusableElements();

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);

    // Update focusable elements when DOM changes
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'hidden', 'style', 'aria-hidden'],
    });

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [handleKeyDown, updateFocusableElements]);

  // Focus trap effect
  useEffect(() => {
    if (focusTrapEnabled && containerRef.current) {
      focusManagement.setFocusTrap(containerRef.current);
      
      return () => {
        focusManagement.releaseFocusTrap();
      };
    }
  }, [focusTrapEnabled, focusManagement]);

  return (
    <div
      ref={containerRef}
      className={`keyboard-navigation-container ${settings.keyboardNavigationMode ? 'keyboard-active' : ''}`}
      role="application"
      aria-label="Keyboard navigable content"
    >
      {children}
    </div>
  );
}

/**
 * Focus Trap Component
 * 
 * Traps focus within a specific area (useful for modals, dialogs).
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  onEscape?: () => void;
  initialFocus?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
}

export function FocusTrap({
  children,
  active,
  onEscape,
  initialFocus,
  restoreFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store previous focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Set initial focus
    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else {
      // Focus first focusable element
      const focusableElement = containerRef.current.querySelector(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (focusableElement) {
        focusableElement.focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, initialFocus, onEscape, restoreFocus]);

  if (!active) return <>{children}</>;

  return (
    <KeyboardNavigation
      enableArrowNavigation={false}
      focusTrapEnabled={true}
      escapeHandler={onEscape}
    >
      <div ref={containerRef}>
        {children}
      </div>
    </KeyboardNavigation>
  );
}

/**
 * Roving Tab Index Component
 * 
 * Implements roving tabindex pattern for lists and menus.
 */
interface RovingTabIndexProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  defaultFocusIndex?: number;
  onFocusChange?: (index: number) => void;
}

export function RovingTabIndex({
  children,
  orientation = 'vertical',
  loop = true,
  defaultFocusIndex = 0,
  onFocusChange,
}: RovingTabIndexProps) {
  return (
    <KeyboardNavigation
      enableRovingTabIndex={true}
      enableArrowNavigation={true}
    >
      <div
        role="group"
        aria-orientation={orientation === 'both' ? undefined : orientation}
        className="roving-tabindex-container"
      >
        {children}
      </div>
    </KeyboardNavigation>
  );
}

/**
 * Accessible Menu Component
 * 
 * Implements ARIA menu pattern with keyboard navigation.
 */
interface AccessibleMenuProps {
  children: React.ReactNode;
  trigger: React.ReactElement;
  isOpen: boolean;
  onClose: () => void;
  placement?: 'bottom' | 'top' | 'left' | 'right';
}

export function AccessibleMenu({
  children,
  trigger,
  isOpen,
  onClose,
  placement = 'bottom',
}: AccessibleMenuProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const enhancedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? 'accessible-menu' : undefined,
  });

  return (
    <div className="accessible-menu-container">
      {enhancedTrigger}
      
      {isOpen && (
        <FocusTrap active={isOpen} onEscape={onClose} restoreFocus={true}>
          <div
            ref={menuRef}
            id="accessible-menu"
            role="menu"
            className={`accessible-menu placement-${placement}`}
            aria-labelledby={triggerRef.current?.id}
          >
            <RovingTabIndex orientation="vertical">
              {React.Children.map(children, (child, index) => (
                <div role="menuitem" tabIndex={index === 0 ? 0 : -1}>
                  {child}
                </div>
              ))}
            </RovingTabIndex>
          </div>
        </FocusTrap>
      )}
    </div>
  );
}

/**
 * Keyboard Shortcuts Component
 * 
 * Provides keyboard shortcuts with visual indicators and accessibility.
 */
interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  description: string;
  action: () => void;
  crisisOnly?: boolean;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  showHelp?: boolean;
  onToggleHelp?: () => void;
}

export function KeyboardShortcuts({
  shortcuts,
  showHelp = false,
  onToggleHelp,
}: KeyboardShortcutsProps) {
  const { settings, announceToScreenReader } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        // Skip crisis-only shortcuts if not in crisis mode
        if (shortcut.crisisOnly && !settings.crisisMode) return;

        const modifiersMatch = shortcut.modifiers?.every(modifier => {
          switch (modifier) {
            case 'ctrl': return event.ctrlKey;
            case 'alt': return event.altKey;
            case 'shift': return event.shiftKey;
            case 'meta': return event.metaKey;
            default: return false;
          }
        }) ?? true;

        if (modifiersMatch && event.key.toLowerCase() === shortcut.key.toLowerCase()) {
          event.preventDefault();
          shortcut.action();
          announceToScreenReader(`Activated: ${shortcut.description}`, 'assertive');
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, settings.crisisMode, announceToScreenReader]);

  if (!showHelp) return null;

  const visibleShortcuts = shortcuts.filter(shortcut => 
    !shortcut.crisisOnly || settings.crisisMode
  );

  return (
    <div 
      className="keyboard-shortcuts-help"
      role="dialog"
      aria-label="Keyboard shortcuts help"
      aria-modal="true"
    >
      <div className="shortcuts-content bg-accessible-light border-2 border-accessible-dark rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Keyboard Shortcuts</h2>
        
        <ul className="space-y-2">
          {visibleShortcuts.map((shortcut, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="font-medium">{shortcut.description}</span>
              <code className="bg-accessible-dark text-accessible-light px-2 py-1 rounded text-sm">
                {shortcut.modifiers?.map(mod => `${mod}+`).join('')}{shortcut.key}
              </code>
            </li>
          ))}
        </ul>

        {onToggleHelp && (
          <button
            type="button"
            onClick={onToggleHelp}
            className="mt-4 w-full touch-target bg-accessible-sage text-accessible-light rounded focus-ring"
          >
            Close Help
          </button>
        )}
      </div>
    </div>
  );
}

export default KeyboardNavigation;