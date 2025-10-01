/**
 * Accessibility utilities and testing helpers for ALCHM
 */

// Focus management utilities
export class FocusManager {
  private static focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])'
  ].join(', ');

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors));
  }

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (typeof window !== 'undefined' && document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (typeof window !== 'undefined' && document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Find close button or first focusable element
        const closeButton = container.querySelector('[aria-label*="close"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    container.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element
    firstFocusable?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('keydown', handleEscapeKey);
    };
  }

  static restoreFocus(previousElement: HTMLElement | null) {
    if (previousElement && typeof window !== 'undefined' && document.contains(previousElement)) {
      previousElement.focus();
    }
  }
}

// Live region announcements
export class ScreenReaderAnnouncer {
  private static liveRegion: HTMLElement | null = null;

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  private static createLiveRegion() {
    this.liveRegion = typeof window !== 'undefined' && document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    typeof window !== 'undefined' && document.body.appendChild(this.liveRegion);
  }
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// High contrast detection
export function prefersHighContrast(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-contrast: high)').matches;
}

// Color scheme detection
export function prefersDarkMode(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Keyboard navigation utilities
export class KeyboardNavigation {
  static handleArrowKeys(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onSelect: (index: number) => void,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) {
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (event.key) {
      case nextKey:
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        onSelect(nextIndex);
        items[nextIndex]?.focus();
        break;

      case prevKey:
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        onSelect(prevIndex);
        items[prevIndex]?.focus();
        break;

      case 'Home':
        event.preventDefault();
        onSelect(0);
        items[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        const lastIndex = items.length - 1;
        onSelect(lastIndex);
        items[lastIndex]?.focus();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        // Trigger click on current item
        items[currentIndex]?.click();
        break;
    }
  }
}

// Skip link utilities
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLAnchorElement {
  const skipLink = typeof window !== 'undefined' && document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  
  return skipLink;
}

// ARIA utilities
export class ARIAUtils {
  static setExpanded(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  static setSelected(element: HTMLElement, selected: boolean) {
    element.setAttribute('aria-selected', selected.toString());
  }

  static setPressed(element: HTMLElement, pressed: boolean) {
    element.setAttribute('aria-pressed', pressed.toString());
  }

  static describedBy(element: HTMLElement, descriptionId: string) {
    const existing = element.getAttribute('aria-describedby');
    if (existing) {
      element.setAttribute('aria-describedby', `${existing} ${descriptionId}`);
    } else {
      element.setAttribute('aria-describedby', descriptionId);
    }
  }

  static labelledBy(element: HTMLElement, labelId: string) {
    element.setAttribute('aria-labelledby', labelId);
  }
}

// Touch target size validation
export function validateTouchTargets(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const interactiveElements = typeof window !== 'undefined' && document.querySelectorAll(
    'button, input, textarea, select, a, [role="button"], [tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // WCAG AAA recommendation

    if (rect.width < minSize || rect.height < minSize) {
      issues.push(`Element ${element.tagName} is too small: ${rect.width}x${rect.height}px`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

// Color contrast validation (simplified)
export function validateColorContrast(
  foreground: string,
  background: string
): { ratio: number; aaPass: boolean; aaaPass: boolean } {
  // This is a simplified version - in production, use a proper contrast checker
  const luminance = (color: string) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    aaPass: ratio >= 4.5,
    aaaPass: ratio >= 7
  };
}

// Error message formatting for screen readers
export function formatErrorMessage(field: string, error: string): string {
  return `${field}: ${error}. Please correct this field to continue.`;
}

// Loading state announcements
export function announceLoadingState(loading: boolean, context: string = '') {
  if (loading) {
    ScreenReaderAnnouncer.announce(`Loading ${context}...`, 'polite');
  } else {
    ScreenReaderAnnouncer.announce(`${context} loaded`, 'polite');
  }
}