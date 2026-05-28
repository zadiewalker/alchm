'use client';

import { useEffect, useState } from 'react';

interface A11yIssue {
  type: 'tap-target' | 'missing-label' | 'missing-alt' | 'color-contrast' | 'focus';
  element: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export function A11yAudit(): React.JSX.Element | null {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const auditAccessibility = () => {
      const foundIssues: A11yIssue[] = [];

      // Check buttons without accessible names
      const buttons = document.querySelectorAll('button, [role="button"]');
      buttons.forEach((btn, index) => {
        const name = btn.getAttribute('aria-label')
          || btn.getAttribute('aria-labelledby')
          || btn.textContent?.trim();
        
        if (!name) {
          foundIssues.push({
            type: 'missing-label',
            element: `Button ${index + 1}: ${btn.tagName.toLowerCase()}${btn.className ? `.${btn.className.split(' ')[0]}` : ''}`,
            message: 'Button without accessible name',
            severity: 'error'
          });
        }
      });

      // Check small tap targets
      const interactive = document.querySelectorAll('button, a, [role="button"], [onclick]');
      interactive.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          foundIssues.push({
            type: 'tap-target',
            element: `${el.tagName.toLowerCase()}${el.className ? `.${el.className.split(' ')[0]}` : ''} ${index + 1}`,
            message: `Small tap target (${Math.round(rect.width)}×${Math.round(rect.height)}px)`,
            severity: 'error'
          });
        }
      });

      // Check images without alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.getAttribute('alt') && !img.getAttribute('aria-hidden')) {
          foundIssues.push({
            type: 'missing-alt',
            element: `img ${index + 1}`,
            message: 'Image without alt text',
            severity: 'error'
          });
        }
      });

      // Check SVGs without accessibility attributes
      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg, index) => {
        const hasRole = svg.getAttribute('role');
        const hasAriaLabel = svg.getAttribute('aria-label');
        const hasAriaHidden = svg.getAttribute('aria-hidden');
        const hasTitle = svg.querySelector('title');
        
        if (!hasRole && !hasAriaLabel && !hasAriaHidden && !hasTitle) {
          foundIssues.push({
            type: 'missing-label',
            element: `svg ${index + 1}`,
            message: 'SVG without accessibility attributes',
            severity: 'warning'
          });
        }
      });

      // Check for focusable elements without visible focus indicators
      const focusable = document.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      focusable.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el, ':focus');
        const hasOutline = computedStyle.outline && computedStyle.outline !== 'none';
        const hasBoxShadow = computedStyle.boxShadow && computedStyle.boxShadow !== 'none';
        
        if (!hasOutline && !hasBoxShadow) {
          foundIssues.push({
            type: 'focus',
            element: `${el.tagName.toLowerCase()} ${index + 1}`,
            message: 'No visible focus indicator',
            severity: 'warning'
          });
        }
      });

      setIssues(foundIssues);
      
      // Log summary to console
      if (foundIssues.length > 0) {
        console.group('[A11y Audit] Found accessibility issues:');
        foundIssues.forEach(issue => {
          const logMethod = issue.severity === 'error' ? console.error : 
                           issue.severity === 'warning' ? console.warn : console.info;
          logMethod(`${issue.type}: ${issue.element} - ${issue.message}`);
        });
        console.groupEnd();
      } else {
        console.log('[A11y Audit] ✅ No accessibility issues found');
      }
    };

    // Run audit after page loads
    const timer = setTimeout(auditAccessibility, 2000);
    
    // Also run on route changes
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      setTimeout(auditAccessibility, 1000);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || issues.length === 0) {
    return null;
  }

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  return (
    <>
      {/* Floating audit button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'var(--surface-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-divider)',
          borderRadius: '20px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-scrim)',
          opacity: 0.9
        }}
        aria-label={`Accessibility audit: ${errorCount} errors, ${warningCount} warnings. Click to view details.`}
      >
        A11y: {errorCount}E {warningCount}W
      </button>

      {/* Audit panel */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            right: '20px',
            zIndex: 9998,
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-divider)',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '400px',
            maxHeight: '500px',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-scrim-lg)',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--border-divider)'
          }}>
            <h3 style={{ margin: 0, fontSize: '14px' }}>
              Accessibility Issues ({issues.length})
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
              aria-label="Close accessibility audit panel"
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {issues.map((issue, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: '6px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    background: 'var(--surface-elevated)',
                    color: 'var(--text-primary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: "none"
                  }}>
                    {issue.severity}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '11px' }}>
                    {issue.type}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  {issue.element}
                </div>
                <div style={{ fontSize: '12px' }}>
                  {issue.message}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '16px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-divider)',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ margin: 0 }}>
              This panel only shows in development. Remove A11yAudit before production.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default A11yAudit;
