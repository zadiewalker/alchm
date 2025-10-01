'use client';

import React, { useEffect, useState } from 'react';
import { useBetaAccess } from '@/hooks/useBetaAccess';
import { feedbackService } from '@/lib/beta/feedbackService';
import { BetaFeedback } from '@/types/beta';

interface AutoBugReporterProps {
  enableJSErrorCapture?: boolean;
  enableUnhandledRejectionCapture?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableNetworkErrorCapture?: boolean;
  enableUserInteractionCapture?: boolean;
  onBugDetected?: (bug: BetaFeedback) => void;
  onReportSubmitted?: (report: BetaFeedback) => void;
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface NetworkError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  timestamp: Date;
  responseText?: string;
}

interface JSError {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  stack?: string;
  timestamp: Date;
  userAgent: string;
}

export function AutoBugReporter({
  enableJSErrorCapture = true,
  enableUnhandledRejectionCapture = true,
  enablePerformanceMonitoring = true,
  enableNetworkErrorCapture = true,
  enableUserInteractionCapture = true,
  onBugDetected,
  onReportSubmitted
}: AutoBugReporterProps) {
  const { isBetaUser, canAccessFeature, updateActivity } = useBetaAccess();
  const [errors, setErrors] = useState<JSError[]>([]);
  const [networkErrors, setNetworkErrors] = useState<NetworkError[]>([]);
  const [performanceIssues, setPerformanceIssues] = useState<string[]>([]);
  const [isReporting, setIsReporting] = useState(false);

  // Don't run if user doesn't have beta access
  if (!isBetaUser || !canAccessFeature('bug_reporting')) {
    return null;
  }

  useEffect(() => {
    const cleanup: (() => void)[] = [];

    // JavaScript Error Capture
    if (enableJSErrorCapture) {
      const errorHandler = (event: ErrorEvent) => {
        const error: JSError = {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: new Date(),
          userAgent: navigator.userAgent
        };

        setErrors(prev => [...prev, error]);
        handleAutomaticBugReport('js_error', error);
      };

      window.addEventListener('error', errorHandler);
      cleanup.push(() => window.removeEventListener('error', errorHandler));
    }

    // Unhandled Promise Rejection Capture
    if (enableUnhandledRejectionCapture) {
      const rejectionHandler = (event: PromiseRejectionEvent) => {
        const error: JSError = {
          message: `Unhandled Promise Rejection: ${event.reason}`,
          filename: 'unknown',
          lineno: 0,
          colno: 0,
          stack: event.reason?.stack || 'No stack trace available',
          timestamp: new Date(),
          userAgent: navigator.userAgent
        };

        setErrors(prev => [...prev, error]);
        handleAutomaticBugReport('promise_rejection', error);
      };

      window.addEventListener('unhandledrejection', rejectionHandler);
      cleanup.push(() => window.removeEventListener('unhandledrejection', rejectionHandler));
    }

    // Performance Monitoring
    if (enablePerformanceMonitoring) {
      const checkPerformance = () => {
        const metrics = collectPerformanceMetrics();
        const issues = analyzePerformanceMetrics(metrics);
        
        if (issues.length > 0) {
          setPerformanceIssues(prev => [...prev, ...issues]);
          issues.forEach(issue => {
            handleAutomaticBugReport('performance_issue', { issue, metrics });
          });
        }
      };

      // Check performance after page load
      if (document.readyState === 'complete') {
        setTimeout(checkPerformance, 2000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(checkPerformance, 2000);
        });
      }
    }

    // Network Error Capture
    if (enableNetworkErrorCapture) {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          
          if (!response.ok) {
            const networkError: NetworkError = {
              url: args[0].toString(),
              method: (args[1]?.method || 'GET').toUpperCase(),
              status: response.status,
              statusText: response.statusText,
              timestamp: new Date(),
              responseText: await response.clone().text().catch(() => 'Unable to read response')
            };

            setNetworkErrors(prev => [...prev, networkError]);
            
            if (response.status >= 500) {
              handleAutomaticBugReport('network_error', networkError);
            }
          }
          
          return response;
        } catch (error) {
          const networkError: NetworkError = {
            url: args[0].toString(),
            method: (args[1]?.method || 'GET').toUpperCase(),
            status: 0,
            statusText: 'Network Error',
            timestamp: new Date(),
            responseText: error instanceof Error ? error.message : 'Unknown error'
          };

          setNetworkErrors(prev => [...prev, networkError]);
          handleAutomaticBugReport('network_error', networkError);
          
          throw error;
        }
      };

      cleanup.push(() => {
        window.fetch = originalFetch;
      });
    }

    // User Interaction Monitoring for Deadlocks/Freezes
    if (enableUserInteractionCapture) {
      let lastInteraction = Date.now();
      let interactionTimeout: NodeJS.Timeout;

      const updateLastInteraction = () => {
        lastInteraction = Date.now();
        clearTimeout(interactionTimeout);
        
        // Check for UI freezes (no response to interactions for 5+ seconds)
        interactionTimeout = setTimeout(() => {
          const timeSinceInteraction = Date.now() - lastInteraction;
          if (timeSinceInteraction > 5000) {
            handleAutomaticBugReport('ui_freeze', {
              timeSinceInteraction,
              timestamp: new Date(),
              userAgent: navigator.userAgent
            });
          }
        }, 5000);
      };

      const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
      interactionEvents.forEach(event => {
        document.addEventListener(event, updateLastInteraction, { passive: true });
      });

      cleanup.push(() => {
        interactionEvents.forEach(event => {
          document.removeEventListener(event, updateLastInteraction);
        });
        clearTimeout(interactionTimeout);
      });
    }

    return () => {
      cleanup.forEach(fn => fn());
    };
  }, [isBetaUser, canAccessFeature]);

  const collectPerformanceMetrics = (): PerformanceMetrics => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: getLCP(),
      cumulativeLayoutShift: getCLS(),
      firstInputDelay: getFID()
    };
  };

  const getLCP = (): number => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }) as any;
  };

  const getCLS = (): number => {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
    return clsValue;
  };

  const getFID = (): number => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          resolve((entry as any).processingStart - entry.startTime);
        }
      }).observe({ entryTypes: ['first-input'] });
    }) as any;
  };

  const analyzePerformanceMetrics = (metrics: PerformanceMetrics): string[] => {
    const issues: string[] = [];

    if (metrics.loadTime > 3000) {
      issues.push(`Slow page load: ${metrics.loadTime}ms`);
    }

    if (metrics.firstContentfulPaint > 2500) {
      issues.push(`Slow First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    }

    if (metrics.largestContentfulPaint > 4000) {
      issues.push(`Poor Largest Contentful Paint: ${metrics.largestContentfulPaint}ms`);
    }

    if (metrics.cumulativeLayoutShift > 0.25) {
      issues.push(`High Cumulative Layout Shift: ${metrics.cumulativeLayoutShift}`);
    }

    if (metrics.firstInputDelay > 300) {
      issues.push(`High First Input Delay: ${metrics.firstInputDelay}ms`);
    }

    return issues;
  };

  const collectSystemInfo = () => {
    const connection = (navigator as any).connection;
    
    return {
      // Browser info
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      
      // Screen info
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenColorDepth: screen.colorDepth,
      screenPixelDepth: screen.pixelDepth,
      
      // Window info
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      
      // Network info
      connectionType: connection?.effectiveType,
      connectionDownlink: connection?.downlink,
      connectionRtt: connection?.rtt,
      connectionSaveData: connection?.saveData,
      
      // Memory info (if available)
      memoryUsed: (performance as any).memory?.usedJSHeapSize,
      memoryTotal: (performance as any).memory?.totalJSHeapSize,
      memoryLimit: (performance as any).memory?.jsHeapSizeLimit,
      
      // Timing info
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
      
      // Page info
      url: window.location.href,
      referrer: document.referrer,
      title: document.title
    };
  };

  const handleAutomaticBugReport = async (type: string, errorData: any) => {
    if (isReporting) return; // Prevent spam

    try {
      setIsReporting(true);
      
      const systemInfo = collectSystemInfo();
      const severity = determineSeverity(type, errorData);
      
      const bugReport = await feedbackService.submitFeedback({
        type: 'bug',
        title: `Auto-detected ${type.replace('_', ' ')}: ${getErrorTitle(type, errorData)}`,
        description: formatErrorDescription(type, errorData, systemInfo),
        priority: severity,
        tags: ['auto-detected', type, `browser-${getBrowserName()}`, `os-${getOSName()}`],
        userId: 'current-user', // This should come from auth context
        includeScreenshot: true,
        includeConsoleLog: true
      });

      if (onBugDetected) {
        onBugDetected(bugReport);
      }

      if (onReportSubmitted) {
        onReportSubmitted(bugReport);
      }

      // Track the bug reporting activity
      await updateActivity({
        featuresUsed: ['auto_bug_detection'],
        sessionDuration: 0
      });

    } catch (error) {
      console.error('Failed to submit automatic bug report:', error);
    } finally {
      // Reset reporting flag after a delay to prevent spam
      setTimeout(() => setIsReporting(false), 5000);
    }
  };

  const determineSeverity = (type: string, errorData: any): 'low' | 'medium' | 'high' | 'critical' => {
    switch (type) {
      case 'js_error':
        if (errorData.message.includes('TypeError') || errorData.message.includes('ReferenceError')) {
          return 'high';
        }
        return 'medium';
      
      case 'promise_rejection':
        return 'medium';
      
      case 'network_error':
        if (errorData.status >= 500) return 'high';
        if (errorData.status === 0) return 'critical';
        return 'medium';
      
      case 'performance_issue':
        if (errorData.issue.includes('Slow page load') && errorData.metrics.loadTime > 10000) {
          return 'high';
        }
        return 'medium';
      
      case 'ui_freeze':
        if (errorData.timeSinceInteraction > 10000) return 'critical';
        return 'high';
      
      default:
        return 'medium';
    }
  };

  const getErrorTitle = (type: string, errorData: any): string => {
    switch (type) {
      case 'js_error':
        return errorData.message.substring(0, 50) + (errorData.message.length > 50 ? '...' : '');
      case 'promise_rejection':
        return 'Unhandled Promise Rejection';
      case 'network_error':
        return `${errorData.method} ${errorData.url} (${errorData.status})`;
      case 'performance_issue':
        return errorData.issue;
      case 'ui_freeze':
        return `UI Freeze (${Math.round(errorData.timeSinceInteraction / 1000)}s)`;
      default:
        return 'Unknown Error';
    }
  };

  const formatErrorDescription = (type: string, errorData: any, systemInfo: any): string => {
    let description = `**Automatically detected ${type.replace('_', ' ')}**\n\n`;
    
    // Error-specific details
    switch (type) {
      case 'js_error':
        description += `**Error Details:**\n`;
        description += `- Message: ${errorData.message}\n`;
        description += `- File: ${errorData.filename}:${errorData.lineno}:${errorData.colno}\n`;
        if (errorData.stack) {
          description += `- Stack Trace:\n\`\`\`\n${errorData.stack}\n\`\`\`\n\n`;
        }
        break;
        
      case 'network_error':
        description += `**Network Error Details:**\n`;
        description += `- URL: ${errorData.url}\n`;
        description += `- Method: ${errorData.method}\n`;
        description += `- Status: ${errorData.status} ${errorData.statusText}\n`;
        if (errorData.responseText) {
          description += `- Response: ${errorData.responseText.substring(0, 200)}\n\n`;
        }
        break;
        
      case 'performance_issue':
        description += `**Performance Metrics:**\n`;
        Object.entries(errorData.metrics).forEach(([key, value]) => {
          description += `- ${key}: ${value}\n`;
        });
        description += `\n**Issue:** ${errorData.issue}\n\n`;
        break;
        
      case 'ui_freeze':
        description += `**UI Freeze Details:**\n`;
        description += `- Duration: ${Math.round(errorData.timeSinceInteraction / 1000)} seconds\n`;
        description += `- Last interaction: ${errorData.timestamp}\n\n`;
        break;
    }
    
    // System information
    description += `**System Information:**\n`;
    description += `- Browser: ${systemInfo.userAgent}\n`;
    description += `- Viewport: ${systemInfo.viewportWidth}x${systemInfo.viewportHeight}\n`;
    description += `- Screen: ${systemInfo.screenWidth}x${systemInfo.screenHeight}\n`;
    description += `- Connection: ${systemInfo.connectionType || 'Unknown'}\n`;
    description += `- Memory Used: ${systemInfo.memoryUsed ? Math.round(systemInfo.memoryUsed / 1024 / 1024) + 'MB' : 'Unknown'}\n`;
    description += `- Time Zone: ${systemInfo.timeZone}\n`;
    description += `- URL: ${systemInfo.url}\n`;
    
    return description;
  };

  const getBrowserName = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'chrome';
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Safari')) return 'safari';
    if (ua.includes('Edge')) return 'edge';
    return 'other';
  };

  const getOSName = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'windows';
    if (ua.includes('Mac')) return 'macos';
    if (ua.includes('Linux')) return 'linux';
    if (ua.includes('Android')) return 'android';
    if (ua.includes('iOS')) return 'ios';
    return 'other';
  };

  // This component doesn't render anything visible
  return null;
}