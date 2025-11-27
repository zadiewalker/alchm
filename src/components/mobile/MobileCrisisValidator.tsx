'use client';

/**
 * MOBILE CRISIS VALIDATOR COMPONENT
 * Real-time validation of crisis accessibility on mobile devices
 * Tests all critical requirements for users in trauma/crisis situations
 */

import { useState, useEffect, useCallback } from 'react';

interface CrisisValidationResult {
  test: string;
  passed: boolean;
  value: number | string;
  threshold: number | string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

interface ValidationSummary {
  totalTests: number;
  passedTests: number;
  criticalIssues: number;
  warnings: number;
  overallScore: number;
}

export default function MobileCrisisValidator() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CrisisValidationResult[]>([]);
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const runCrisisValidation = useCallback(async () => {
    setIsRunning(true);
    setResults([]);

    const validationResults: CrisisValidationResult[] = [];

    try {
      // Test 1: Crisis Button Accessibility
      const crisisButtons = document.querySelectorAll('.crisis-accessible, [class*="crisis-floating"], .emergency-button');
      
      if (crisisButtons.length === 0) {
        validationResults.push({
          test: 'Crisis Button Presence',
          passed: false,
          value: 0,
          threshold: 1,
          severity: 'critical',
          message: 'No crisis buttons found - critical safety issue'
        });
      } else {
        let minSize = Infinity;
        let allAccessible = true;

        crisisButtons.forEach(button => {
          const rect = button.getBoundingClientRect();
          const size = Math.min(rect.width, rect.height);
          if (size < minSize) minSize = size;
          if (size < 60) allAccessible = false;
        });

        validationResults.push({
          test: 'Crisis Button Size',
          passed: minSize >= 60,
          value: Math.round(minSize),
          threshold: 60,
          severity: minSize >= 60 ? 'info' : 'critical',
          message: `Smallest crisis button: ${Math.round(minSize)}px (60px required for trembling hands)`
        });

        // Test if crisis button is in thumb-reachable zone
        const firstButton = crisisButtons[0] as HTMLElement;
        const buttonRect = firstButton.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const thumbZoneStart = screenHeight * 0.33; // Bottom 2/3 of screen

        validationResults.push({
          test: 'Thumb-Reachable Zone',
          passed: buttonRect.top >= thumbZoneStart,
          value: `${Math.round(((screenHeight - buttonRect.top) / screenHeight) * 100)}%`,
          threshold: '67%',
          severity: buttonRect.top >= thumbZoneStart ? 'info' : 'warning',
          message: buttonRect.top >= thumbZoneStart 
            ? 'Crisis button in optimal thumb zone' 
            : 'Crisis button may be difficult to reach one-handed'
        });
      }

      // Test 2: Emergency Contact Accessibility
      const hasEmergencyNumbers = document.body.textContent?.toLowerCase().includes('988') || 
                                 document.body.textContent?.toLowerCase().includes('911');
      
      validationResults.push({
        test: 'Emergency Contacts Visible',
        passed: hasEmergencyNumbers,
        value: hasEmergencyNumbers ? 'Found' : 'Missing',
        threshold: 'Required',
        severity: hasEmergencyNumbers ? 'info' : 'critical',
        message: hasEmergencyNumbers 
          ? 'Emergency contact numbers visible'
          : 'No emergency contact numbers found (988/911 required)'
      });

      // Test 3: Page Load Performance
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      
      validationResults.push({
        test: 'Crisis Load Time',
        passed: loadTime <= 3000,
        value: Math.round(loadTime),
        threshold: 3000,
        severity: loadTime <= 3000 ? 'info' : 'critical',
        message: `Page loaded in ${Math.round(loadTime)}ms (3000ms max for crisis access)`
      });

      // Test 4: Network Quality Detection
      const connection = (navigator as any).connection;
      const networkSpeed = connection?.effectiveType || 'unknown';
      const isSlowNetwork = ['slow-2g', '2g'].includes(networkSpeed);
      
      validationResults.push({
        test: 'Network Adaptation',
        passed: !isSlowNetwork || document.body.classList.contains('slow-connection'),
        value: networkSpeed,
        threshold: '3g+',
        severity: isSlowNetwork ? 'warning' : 'info',
        message: isSlowNetwork 
          ? 'Slow network detected - check if optimizations are active'
          : `Network speed acceptable: ${networkSpeed}`
      });

      // Test 5: Touch Target Safety
      const allButtons = document.querySelectorAll('button, a, input, [role="button"]');
      let unsafeTouchTargets = 0;
      let totalInteractive = 0;

      allButtons.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          totalInteractive++;
          const minSize = Math.min(rect.width, rect.height);
          if (minSize < 44) {
            unsafeTouchTargets++;
          }
        }
      });

      const touchSafetyRatio = totalInteractive > 0 ? (totalInteractive - unsafeTouchTargets) / totalInteractive : 1;
      
      validationResults.push({
        test: 'Touch Target Safety',
        passed: touchSafetyRatio >= 0.8,
        value: `${Math.round(touchSafetyRatio * 100)}%`,
        threshold: '80%',
        severity: touchSafetyRatio >= 0.8 ? 'info' : 'warning',
        message: `${Math.round(touchSafetyRatio * 100)}% of interactive elements are touch-safe (44px minimum)`
      });

      // Test 6: Memory Usage (if available)
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const memoryUsageMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
        
        validationResults.push({
          test: 'Memory Usage',
          passed: memoryUsageMB <= 50,
          value: Math.round(memoryUsageMB),
          threshold: 50,
          severity: memoryUsageMB <= 50 ? 'info' : 'warning',
          message: `${Math.round(memoryUsageMB)}MB memory used (50MB max for old devices)`
        });
      }

      // Test 7: Offline Crisis Support
      const hasServiceWorker = 'serviceWorker' in navigator;
      let offlineSupport = false;
      
      if (hasServiceWorker) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          offlineSupport = registration !== undefined;
        } catch (error) {
          console.warn('Service worker check failed:', error);
        }
      }

      validationResults.push({
        test: 'Offline Crisis Support',
        passed: offlineSupport,
        value: offlineSupport ? 'Available' : 'Missing',
        threshold: 'Required',
        severity: offlineSupport ? 'info' : 'warning',
        message: offlineSupport 
          ? 'Service worker active - offline crisis support available'
          : 'No offline support detected - users may lose access during network issues'
      });

      // Test 8: Focus Management
      const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      let hasFocusOutlines = true;
      
      // Quick check for focus styles
      const testButton = document.querySelector('.crisis-accessible') as HTMLElement;
      if (testButton) {
        testButton.focus();
        const computedStyle = window.getComputedStyle(testButton, ':focus');
        const hasVisibleFocus = computedStyle.outline !== 'none' || computedStyle.boxShadow !== 'none';
        testButton.blur();
        hasFocusOutlines = hasVisibleFocus;
      }

      validationResults.push({
        test: 'Focus Accessibility',
        passed: hasFocusOutlines,
        value: hasFocusOutlines ? 'Good' : 'Poor',
        threshold: 'Visible',
        severity: hasFocusOutlines ? 'info' : 'warning',
        message: hasFocusOutlines 
          ? 'Focus indicators visible for keyboard navigation'
          : 'Poor focus indicators - may be difficult for keyboard users'
      });

      // Calculate summary
      const totalTests = validationResults.length;
      const passedTests = validationResults.filter(r => r.passed).length;
      const criticalIssues = validationResults.filter(r => r.severity === 'critical').length;
      const warnings = validationResults.filter(r => r.severity === 'warning').length;
      const overallScore = Math.round((passedTests / totalTests) * 100);

      setResults(validationResults);
      setSummary({
        totalTests,
        passedTests,
        criticalIssues,
        warnings,
        overallScore
      });

    } catch (error) {
      console.error('Crisis validation failed:', error);
      validationResults.push({
        test: 'Validation Error',
        passed: false,
        value: 'Failed',
        threshold: 'Success',
        severity: 'critical',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      setResults(validationResults);
      setSummary({
        totalTests: validationResults.length,
        passedTests: 0,
        criticalIssues: 1,
        warnings: 0,
        overallScore: 0
      });
    }

    setIsRunning(false);
  }, []);

  // Auto-run validation on component mount
  useEffect(() => {
    // Run validation after a short delay to ensure DOM is ready
    const timer = setTimeout(runCrisisValidation, 1000);
    return () => clearTimeout(timer);
  }, [runCrisisValidation]);

  if (!summary && !isRunning) {
    return null; // Don't show anything until first validation
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm text-gray-900">
            Crisis Safety Check
          </h3>
          <button
            onClick={runCrisisValidation}
            disabled={isRunning}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isRunning ? 'Testing...' : 'Retest'}
          </button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <div className={`text-2xl ${
                summary.overallScore >= 80 ? 'text-green-600' :
                summary.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {summary.overallScore >= 80 ? '✅' : 
                 summary.overallScore >= 60 ? '⚠️' : '🚨'}
              </div>
              <div>
                <div className="font-medium text-sm">
                  {summary.overallScore}% Crisis Safe
                </div>
                <div className="text-xs text-gray-600">
                  {summary.passedTests}/{summary.totalTests} tests passed
                </div>
              </div>
            </div>

            {summary.criticalIssues > 0 && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                🚨 {summary.criticalIssues} critical issue{summary.criticalIssues !== 1 ? 's' : ''} found
              </div>
            )}

            {summary.warnings > 0 && (
              <div className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                ⚠️ {summary.warnings} warning{summary.warnings !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        )}

        {/* Toggle details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {/* Detailed results */}
        {showDetails && (
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs border ${
                  result.severity === 'critical' ? 'bg-red-50 border-red-200 text-red-800' :
                  result.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-green-50 border-green-200 text-green-800'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span>{result.passed ? '✅' : '❌'}</span>
                  <span className="font-medium">{result.test}</span>
                </div>
                <div className="text-xs opacity-80">
                  {result.message}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Value: {result.value} | Threshold: {result.threshold}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions for critical issues */}
        {summary && summary.criticalIssues > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-red-600 font-medium mb-2">
              Quick Actions:
            </div>
            <div className="space-y-1">
              {results.filter(r => r.severity === 'critical').map((result, index) => (
                <div key={index} className="text-xs text-red-600">
                  • {result.test}: {result.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Development mode warning */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            🔧 Dev Mode: Remove validator before production
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to get validation results programmatically
export function useCrisisValidation() {
  const [results, setResults] = useState<CrisisValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateCrisisSafety = useCallback(async () => {
    setIsValidating(true);
    // Implementation would be similar to the component above
    // This is a simplified version for programmatic use
    const results: CrisisValidationResult[] = [];
    
    try {
      // Basic crisis button check
      const crisisButtons = document.querySelectorAll('.crisis-accessible');
      results.push({
        test: 'Crisis Button Present',
        passed: crisisButtons.length > 0,
        value: crisisButtons.length,
        threshold: 1,
        severity: crisisButtons.length > 0 ? 'info' : 'critical',
        message: crisisButtons.length > 0 ? 'Crisis button found' : 'No crisis button found'
      });
      
      setResults(results);
    } catch (error) {
      console.error('Crisis validation error:', error);
    }
    
    setIsValidating(false);
  }, []);

  return {
    results,
    isValidating,
    validateCrisisSafety
  };
}