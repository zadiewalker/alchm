// Secure CSS loading utilities for ALCHM
// Replaces dangerouslySetInnerHTML with validated CSS injection

/**
 * Validates and sanitizes CSS content to prevent XSS attacks
 * @param css - Raw CSS string to validate
 * @returns Sanitized CSS string safe for injection
 */
export function validateCSS(css: string): string {
  if (!css || typeof css !== 'string') {
    console.warn('ALCHM Security: Invalid CSS input, using empty styles');
    return '';
  }

  // Remove potentially dangerous CSS content
  const sanitizedCSS = css
    // Remove javascript: urls
    .replace(/javascript\s*:/gi, '')
    // Remove expression() calls (IE-specific but good to block)
    .replace(/expression\s*\(/gi, '')
    // Remove @import with javascript or data urls
    .replace(/@import\s+["'](?:javascript|data):/gi, '')
    // Remove any HTML-like content that shouldn't be in CSS
    .replace(/<[^>]*>/g, '')
    // Remove potential CSS injection patterns
    .replace(/url\s*\(\s*["']?javascript:/gi, 'url(about:blank')
    .replace(/url\s*\(\s*["']?data:text\/html/gi, 'url(about:blank')
    // Limit CSS size to prevent memory issues
    .slice(0, 50000); // 50KB limit

  return sanitizedCSS;
}

/**
 * Creates a secure CSS style element and injects validated CSS
 * @param css - CSS content to inject
 * @param id - Optional ID for the style element
 * @returns The created style element
 */
export function injectSecureCSS(css: string, id?: string): HTMLStyleElement | null {
  if (typeof typeof window !== 'undefined' && document === 'undefined') {
    console.warn('ALCHM Security: Document not available, skipping CSS injection');
    return null;
  }

  try {
    const sanitizedCSS = validateCSS(css);
    
    if (!sanitizedCSS.trim()) {
      console.warn('ALCHM Security: No valid CSS content to inject');
      return null;
    }

    // Create style element securely
    const styleElement = typeof window !== 'undefined' && document.createElement('style');
    
    // Set attributes safely
    styleElement.type = 'text/css';
    if (id) {
      styleElement.id = id;
    }
    
    // Use textContent instead of innerHTML for security
    styleElement.textContent = sanitizedCSS;
    
    // Add to typeof window !== 'undefined' && document head
    typeof window !== 'undefined' && document.head.appendChild(styleElement);
    
    return styleElement;
  } catch (error) {
    console.error('ALCHM Security: Failed to inject CSS securely:', error);
    return null;
  }
}

/**
 * Creates secure CSS content for React components
 * @param css - CSS content to validate
 * @returns Sanitized CSS string safe for injection
 */
export function getSecureCSS(css: string): string {
  return validateCSS(css);
}

/**
 * Critical CSS validation specifically for ALCHM's crisis-safe styles
 * @param css - Critical CSS content
 * @returns Validated critical CSS
 */
export function validateCriticalCSS(css: string): string {
  const sanitized = validateCSS(css);
  
  // Additional validation for critical CSS
  const requiredPatterns = [
    'crisis-support', // Must contain crisis support styles
    'gradient-sanctuary', // Must contain sanctuary styles
    'btn-primary' // Must contain primary button styles
  ];
  
  const hasRequiredStyles = requiredPatterns.every(pattern => 
    sanitized.includes(pattern)
  );
  
  if (!hasRequiredStyles) {
    console.warn('ALCHM Security: Critical CSS missing required crisis patterns, using fallback');
    return getCriticalCSSFallback();
  }
  
  return sanitized;
}

/**
 * Emergency fallback CSS for crisis scenarios
 * @returns Minimal CSS for crisis functionality
 */
function getCriticalCSSFallback(): string {
  return `
    body { margin: 0; font-family: system-ui, sans-serif; }
    .crisis-support { 
      position: fixed; 
      bottom: 40px; 
      right: 40px; 
      z-index: 9999; 
      width: 80px; 
      height: 80px; 
      background: #dc2626; 
      border-radius: 50%; 
      color: #fff; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      text-decoration: none; 
      font-size: 2rem;
    }
    .btn-primary { 
      background: #a4b792; 
      color: #fff; 
      padding: 16px 32px; 
      border-radius: 12px; 
      border: 0; 
      cursor: pointer; 
    }
  `;
}