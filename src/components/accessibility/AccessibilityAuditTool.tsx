'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

/**
 * Accessibility Audit Tool
 * 
 * Comprehensive accessibility testing and reporting tool for ALCHM.
 * Provides real-time accessibility analysis with trauma-informed considerations.
 */

interface AccessibilityIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'wcag-a' | 'wcag-aa' | 'wcag-aaa' | 'best-practice' | 'trauma-informed';
  title: string;
  description: string;
  element?: Element;
  selector?: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  crisisImpact?: boolean; // Special flag for crisis situations
  guidelines: string[];
  suggestions: string[];
}

interface AccessibilityReport {
  timestamp: string;
  pageTitle: string;
  url: string;
  summary: {
    total: number;
    errors: number;
    warnings: number;
    passed: number;
    crisisCritical: number;
  };
  issues: AccessibilityIssue[];
  wcagLevel: 'A' | 'AA' | 'AAA';
  traumaInformedScore: number; // 0-100
}

export function AccessibilityAuditTool() {
  const { settings } = useAccessibility();
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const reportRef = useRef<HTMLDivElement>(null);

  // Run accessibility audit
  const runAudit = async () => {
    setIsRunning(true);

    try {
      const issues = await performAccessibilityAudit();
      const newReport = generateReport(issues);
      setReport(newReport);

      // Announce completion
      const totalIssues = newReport.summary.errors + newReport.summary.warnings;
      const message = totalIssues === 0 
        ? 'Accessibility audit complete. No issues found.'
        : `Accessibility audit complete. ${totalIssues} issues found.`;
      
      // Use a small delay to ensure the announcement is heard
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('accessibility-announce', {
          detail: { message, priority: 'polite' }
        }));
      }, 100);

    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-audit when page changes in crisis mode
  useEffect(() => {
    if (autoMode || settings.crisisMode) {
      const timer = setTimeout(runAudit, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoMode, settings.crisisMode]);

  // Perform the actual accessibility audit
  const performAccessibilityAudit = async (): Promise<AccessibilityIssue[]> => {
    const issues: AccessibilityIssue[] = [];

    // Check for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        issues.push({
          id: `missing-alt-${index}`,
          severity: 'error',
          category: 'wcag-a',
          title: 'Missing alt text',
          description: 'Image is missing alternative text for screen readers',
          element: img,
          selector: `img:nth-child(${index + 1})`,
          impact: 'serious',
          crisisImpact: true,
          guidelines: ['WCAG 2.1 A - 1.1.1 Non-text Content'],
          suggestions: [
            'Add descriptive alt text that conveys the purpose of the image',
            'Use alt="" for decorative images',
            'Consider aria-label or aria-labelledby for complex images'
          ]
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      const hasAriaLabelledby = input.getAttribute('aria-labelledby');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
        issues.push({
          id: `missing-label-${index}`,
          severity: 'error',
          category: 'wcag-a',
          title: 'Missing form label',
          description: 'Form control is missing an accessible label',
          element: input,
          selector: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`,
          impact: 'critical',
          crisisImpact: true,
          guidelines: ['WCAG 2.1 A - 1.3.1 Info and Relationships', 'WCAG 2.1 A - 4.1.2 Name, Role, Value'],
          suggestions: [
            'Add a <label> element with for attribute matching the input id',
            'Use aria-label for brief descriptions',
            'Use aria-labelledby to reference other descriptive elements'
          ]
        });
      }
    });

    // Check for insufficient color contrast
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label');
    for (let i = 0; i < Math.min(textElements.length, 50); i++) { // Limit for performance
      const element = textElements[i] as HTMLElement;
      if (element.offsetParent !== null) { // Only visible elements
        const contrast = await checkColorContrast(element);
        if (contrast.ratio < 4.5) {
          issues.push({
            id: `low-contrast-${i}`,
            severity: contrast.ratio < 3 ? 'error' : 'warning',
            category: 'wcag-aa',
            title: 'Insufficient color contrast',
            description: `Text has contrast ratio of ${contrast.ratio.toFixed(2)}:1 (minimum 4.5:1 required)`,
            element: element,
            selector: element.tagName.toLowerCase(),
            impact: 'serious',
            crisisImpact: true,
            guidelines: ['WCAG 2.1 AA - 1.4.3 Contrast (Minimum)'],
            suggestions: [
              'Increase contrast between text and background colors',
              'Use darker text on light backgrounds or lighter text on dark backgrounds',
              'Test with color contrast tools'
            ]
          });
        }
      }
    }

    // Check for missing headings structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
    });

    // Check for skipped heading levels
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        issues.push({
          id: `skipped-heading-${i}`,
          severity: 'warning',
          category: 'wcag-aa',
          title: 'Skipped heading level',
          description: `Heading jumps from h${headingLevels[i - 1]} to h${headingLevels[i]}`,
          element: headings[i],
          selector: `h${headingLevels[i]}`,
          impact: 'moderate',
          crisisImpact: false,
          guidelines: ['WCAG 2.1 AA - 1.3.1 Info and Relationships'],
          suggestions: [
            'Use heading levels in sequential order',
            'Don\'t skip heading levels for styling purposes',
            'Use CSS for visual styling instead of larger headings'
          ]
        });
      }
    }

    // Check for missing focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const hasFocusStyle = computedStyle.outline !== 'none' || 
                           computedStyle.boxShadow !== 'none' ||
                           element.classList.contains('focus-ring') ||
                           element.classList.contains('focus-visible');
      
      if (!hasFocusStyle) {
        issues.push({
          id: `missing-focus-${index}`,
          severity: 'warning',
          category: 'wcag-aa',
          title: 'Missing focus indicator',
          description: 'Interactive element lacks visible focus indicator',
          element: element,
          selector: element.tagName.toLowerCase(),
          impact: 'serious',
          crisisImpact: true,
          guidelines: ['WCAG 2.1 AA - 2.4.7 Focus Visible'],
          suggestions: [
            'Add focus styles with outline or box-shadow',
            'Use :focus-visible for keyboard-only focus indicators',
            'Ensure focus indicators have sufficient contrast'
          ]
        });
      }
    });

    // Check for touch target sizes (mobile accessibility)
    if (window.innerWidth < 768) {
      const touchTargets = document.querySelectorAll('button, a, input, select');
      touchTargets.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const minSize = settings.crisisMode ? 56 : 44;
        
        if (rect.width < minSize || rect.height < minSize) {
          issues.push({
            id: `small-touch-target-${index}`,
            severity: settings.crisisMode ? 'error' : 'warning',
            category: 'best-practice',
            title: 'Touch target too small',
            description: `Touch target is ${rect.width.toFixed(0)}×${rect.height.toFixed(0)}px (minimum ${minSize}×${minSize}px)`,
            element: element,
            selector: element.tagName.toLowerCase(),
            impact: settings.crisisMode ? 'critical' : 'moderate',
            crisisImpact: true,
            guidelines: ['WCAG 2.1 AAA - 2.5.5 Target Size'],
            suggestions: [
              `Increase touch target to at least ${minSize}×${minSize}px`,
              'Add padding to increase clickable area',
              'Ensure adequate spacing between touch targets'
            ]
          });
        }
      });
    }

    // Crisis-specific checks
    if (settings.crisisMode || settings.emergencyMode) {
      // Check for emergency contact accessibility
      const emergencyElements = document.querySelectorAll('[data-emergency-contact], [data-crisis-help]');
      if (emergencyElements.length === 0) {
        issues.push({
          id: 'missing-emergency-access',
          severity: 'error',
          category: 'trauma-informed',
          title: 'Missing emergency contact accessibility',
          description: 'No easily accessible emergency contact found in crisis mode',
          impact: 'critical',
          crisisImpact: true,
          guidelines: ['Trauma-Informed Design - Crisis Support'],
          suggestions: [
            'Add emergency contact button with data-emergency-contact attribute',
            'Ensure emergency contact is keyboard accessible',
            'Make emergency contact highly visible and easy to find'
          ]
        });
      }

      // Check for crisis mode announcements
      const hasAriaLive = document.querySelector('[aria-live]');
      if (!hasAriaLive) {
        issues.push({
          id: 'missing-aria-live',
          severity: 'warning',
          category: 'trauma-informed',
          title: 'Missing live region for crisis updates',
          description: 'No ARIA live region found for dynamic crisis information',
          impact: 'serious',
          crisisImpact: true,
          guidelines: ['WCAG 2.1 AA - 4.1.3 Status Messages'],
          suggestions: [
            'Add aria-live region for crisis status updates',
            'Use aria-live="assertive" for urgent crisis information',
            'Use aria-live="polite" for non-urgent updates'
          ]
        });
      }
    }

    return issues;
  };

  // Generate accessibility report
  const generateReport = (issues: AccessibilityIssue[]): AccessibilityReport => {
    const errors = issues.filter(issue => issue.severity === 'error');
    const warnings = issues.filter(issue => issue.severity === 'warning');
    const crisisCritical = issues.filter(issue => issue.crisisImpact);

    // Calculate trauma-informed score
    const totalChecks = 20; // Base number of accessibility checks
    const passedChecks = totalChecks - errors.length - (warnings.length * 0.5);
    const traumaInformedScore = Math.max(0, Math.min(100, (passedChecks / totalChecks) * 100));

    // Determine WCAG level compliance
    let wcagLevel: 'A' | 'AA' | 'AAA' = 'AAA';
    if (issues.some(issue => issue.category === 'wcag-a' && issue.severity === 'error')) {
      wcagLevel = 'A';
    } else if (issues.some(issue => issue.category === 'wcag-aa' && issue.severity === 'error')) {
      wcagLevel = 'AA';
    }

    return {
      timestamp: new Date().toISOString(),
      pageTitle: document.title,
      url: window.location.href,
      summary: {
        total: issues.length,
        errors: errors.length,
        warnings: warnings.length,
        passed: totalChecks - issues.length,
        crisisCritical: crisisCritical.length,
      },
      issues,
      wcagLevel,
      traumaInformedScore,
    };
  };

  // Check color contrast ratio
  const checkColorContrast = async (element: HTMLElement): Promise<{ ratio: number; foreground: string; background: string }> => {
    const computedStyle = window.getComputedStyle(element);
    const foreground = computedStyle.color;
    const background = computedStyle.backgroundColor;

    // Simple contrast calculation (would need more sophisticated logic for real implementation)
    // This is a simplified version - real implementation would need to handle transparency, etc.
    const fgRgb = parseColor(foreground);
    const bgRgb = parseColor(background);
    
    const ratio = calculateContrastRatio(fgRgb, bgRgb);
    
    return {
      ratio,
      foreground,
      background,
    };
  };

  // Parse CSS color to RGB
  const parseColor = (color: string): [number, number, number] => {
    // Simplified color parsing - real implementation would be more robust
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
    }
    return [0, 0, 0]; // Fallback
  };

  // Calculate contrast ratio between two colors
  const calculateContrastRatio = (color1: [number, number, number], color2: [number, number, number]): number => {
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(...color1);
    const lum2 = getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Filter issues by category
  const filteredIssues = report?.issues.filter(issue => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'errors') return issue.severity === 'error';
    if (selectedCategory === 'warnings') return issue.severity === 'warning';
    if (selectedCategory === 'crisis') return issue.crisisImpact;
    return issue.category === selectedCategory;
  }) || [];

  // Export report as JSON
  const exportReport = () => {
    if (!report) return;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="accessibility-audit-tool bg-white rounded-lg shadow-lg border-2 border-gray-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Accessibility Audit</h2>
            <p className="text-gray-600 mt-1">
              WCAG 2.1 compliance and trauma-informed design analysis
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoMode}
                onChange={(e) => setAutoMode(e.target.checked)}
                className="focus-ring"
              />
              <span className="text-sm font-medium">Auto-audit</span>
            </label>
            
            <button
              type="button"
              onClick={runAudit}
              disabled={isRunning}
              className={`
                touch-target-comfortable px-6 py-2 rounded-lg font-semibold focus-ring
                ${isRunning 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Running...
                </span>
              ) : (
                'Run Audit'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      {report && (
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{report.summary.errors}</div>
              <div className="text-sm text-red-800">Errors</div>
            </div>
            
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{report.summary.warnings}</div>
              <div className="text-sm text-yellow-800">Warnings</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{report.summary.passed}</div>
              <div className="text-sm text-green-800">Passed</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{report.summary.crisisCritical}</div>
              <div className="text-sm text-purple-800">Crisis Critical</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>WCAG Compliance:</strong> Level {report.wcagLevel} | 
                <strong className="ml-2">Trauma-Informed Score:</strong> {report.traumaInformedScore.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
            
            <button
              type="button"
              onClick={exportReport}
              className="touch-target bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus-ring"
            >
              Export Report
            </button>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      {report && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({report.summary.total})
            </button>
            
            <button
              onClick={() => setSelectedCategory('errors')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedCategory === 'errors' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Errors ({report.summary.errors})
            </button>
            
            <button
              onClick={() => setSelectedCategory('warnings')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedCategory === 'warnings' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Warnings ({report.summary.warnings})
            </button>
            
            <button
              onClick={() => setSelectedCategory('crisis')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedCategory === 'crisis' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Crisis Impact ({report.summary.crisisCritical})
            </button>
          </div>
        </div>
      )}

      {/* Issues List */}
      {report && (
        <div ref={reportRef} className="max-h-96 overflow-y-auto">
          {filteredIssues.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-lg">🎉 No issues found in this category!</p>
              <p className="text-sm mt-1">Great job on accessibility!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredIssues.map((issue, index) => (
                <div key={issue.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Severity Icon */}
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${issue.severity === 'error' 
                        ? 'bg-red-600 text-white' 
                        : issue.severity === 'warning'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-500 text-white'
                      }
                    `}>
                      {issue.severity === 'error' ? '!' : issue.severity === 'warning' ? '⚠' : 'i'}
                    </div>
                    
                    {/* Issue Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {issue.title}
                          {issue.crisisImpact && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              Crisis Impact
                            </span>
                          )}
                        </h3>
                        
                        <span className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${issue.impact === 'critical' 
                            ? 'bg-red-100 text-red-800' 
                            : issue.impact === 'serious'
                            ? 'bg-orange-100 text-orange-800'
                            : issue.impact === 'moderate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {issue.impact}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
                      
                      {issue.selector && (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                          {issue.selector}
                        </code>
                      )}
                      
                      {/* Guidelines */}
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          <strong>Guidelines:</strong> {issue.guidelines.join(', ')}
                        </div>
                      </div>
                      
                      {/* Suggestions */}
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                          View Suggestions
                        </summary>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1 ml-4">
                          {issue.suggestions.map((suggestion, i) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!report && !isRunning && (
        <div className="p-12 text-center text-gray-500">
          <div className="text-4xl mb-4">♿</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Results</h3>
          <p className="text-sm">Click "Run Audit" to analyze this page for accessibility issues.</p>
        </div>
      )}
    </div>
  );
}

export default AccessibilityAuditTool;