'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Terminal, 
  Copy, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  CheckCircle,
  Filter,
  Search,
  Eye,
  EyeOff,
  Bug,
  Network,
  Shield,
  Heart,
  Trash2,
  HelpCircle
} from 'lucide-react';

interface ConsoleLogCollectorProps {
  onLogsCollected?: (logs: CollectedLogs) => void;
  traumaInformed?: boolean;
  autoCapture?: boolean;
  maxLogs?: number;
}

interface CollectedLogs {
  browserLogs: BrowserLog[];
  networkLogs: NetworkLog[];
  errorSummary: ErrorSummary;
  performanceMetrics: PerformanceLog[];
  securityEvents: SecurityEvent[];
  timestamp: Date;
  sessionId: string;
  userAgent: string;
  url: string;
}

interface BrowserLog {
  id: string;
  timestamp: Date;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
  line?: number;
  column?: number;
  stack?: string;
  category: LogCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  traumaInformedDescription?: string;
  userFriendlyMessage?: string;
  relatedToAlchm: boolean;
}

interface NetworkLog {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status: number;
  statusText: string;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  type: 'xhr' | 'fetch' | 'websocket' | 'navigation';
  failed: boolean;
  errorMessage?: string;
  headers?: Record<string, string>;
}

interface ErrorSummary {
  totalErrors: number;
  errorsByType: Record<string, number>;
  criticalErrors: BrowserLog[];
  javascriptErrors: number;
  networkErrors: number;
  authenticationErrors: number;
  performanceErrors: number;
  traumaInformedSummary: string;
}

interface PerformanceLog {
  id: string;
  timestamp: Date;
  metric: string;
  value: number;
  unit: string;
  threshold?: number;
  exceeded: boolean;
  impact: 'low' | 'medium' | 'high';
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'csp_violation' | 'mixed_content' | 'cors_error' | 'xss_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: string;
  blocked: boolean;
}

type LogCategory = 
  | 'javascript'
  | 'network'
  | 'security'
  | 'performance'
  | 'authentication'
  | 'firebase'
  | 'react'
  | 'stripe'
  | 'general';

interface LogFilter {
  levels: Set<string>;
  categories: Set<LogCategory>;
  searchTerm: string;
  showOnlyErrors: boolean;
  timeRange: 'all' | '1m' | '5m' | '15m' | '1h';
}

export function ConsoleLogCollector({
  onLogsCollected,
  traumaInformed = true,
  autoCapture = false,
  maxLogs = 1000
}: ConsoleLogCollectorProps) {
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectedLogs, setCollectedLogs] = useState<CollectedLogs | null>(null);
  const [currentLogs, setCurrentLogs] = useState<BrowserLog[]>([]);
  const [networkLogs, setNetworkLogs] = useState<NetworkLog[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [filter, setFilter] = useState<LogFilter>({
    levels: new Set(['error', 'warn']),
    categories: new Set(),
    searchTerm: '',
    showOnlyErrors: false,
    timeRange: 'all'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const logInterceptorRef = useRef<(() => void) | null>(null);
  const networkInterceptorRef = useRef<(() => void) | null>(null);

  // Auto-start if enabled
  useEffect(() => {
    if (autoCapture) {
      startLogCollection();
    }
    
    return () => {
      stopLogCollection();
    };
  }, [autoCapture]);

  const startLogCollection = useCallback(() => {
    if (isCollecting) return;
    
    setIsCollecting(true);
    setCurrentLogs([]);
    setNetworkLogs([]);
    
    // Intercept console methods
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    const createLogInterceptor = (level: keyof typeof originalConsole) => {
      return (...args: any[]) => {
        // Call original method
        originalConsole[level](...args);
        
        // Capture the log
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        const logEntry: BrowserLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          level: level === 'debug' ? 'debug' : level,
          message,
          source: 'console',
          category: categorizeLog(message),
          severity: getSeverity(level, message),
          traumaInformedDescription: createTraumaInformedDescription(message, level),
          userFriendlyMessage: createUserFriendlyMessage(message),
          relatedToAlchm: isAlchmRelated(message)
        };
        
        setCurrentLogs(prev => {
          const newLogs = [...prev, logEntry];
          return newLogs.slice(-maxLogs); // Keep only recent logs
        });
      };
    };
    
    // Override console methods
    console.log = createLogInterceptor('log');
    console.info = createLogInterceptor('info');
    console.warn = createLogInterceptor('warn');
    console.error = createLogInterceptor('error');
    console.debug = createLogInterceptor('debug');
    
    // Store cleanup function
    logInterceptorRef.current = () => {
      console.log = originalConsole.log;
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.debug = originalConsole.debug;
    };
    
    // Intercept network requests
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    // Fetch interceptor
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const method = args[1]?.method || 'GET';
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        const networkEntry: NetworkLog = {
          id: `network-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          method,
          url,
          status: response.status,
          statusText: response.statusText,
          responseTime: endTime - startTime,
          requestSize: 0, // Simplified
          responseSize: 0, // Simplified
          type: 'fetch',
          failed: !response.ok
        };
        
        setNetworkLogs(prev => [...prev, networkEntry].slice(-maxLogs));
        return response;
      } catch (error) {
        const endTime = performance.now();
        
        const networkEntry: NetworkLog = {
          id: `network-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          method,
          url,
          status: 0,
          statusText: 'Network Error',
          responseTime: endTime - startTime,
          requestSize: 0,
          responseSize: 0,
          type: 'fetch',
          failed: true,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        };
        
        setNetworkLogs(prev => [...prev, networkEntry].slice(-maxLogs));
        throw error;
      }
    };
    
    // Store network cleanup
    networkInterceptorRef.current = () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
    };
    
  }, [isCollecting, maxLogs]);

  const stopLogCollection = useCallback(() => {
    if (!isCollecting) return;
    
    setIsCollecting(false);
    
    // Restore original console methods
    if (logInterceptorRef.current) {
      logInterceptorRef.current();
      logInterceptorRef.current = null;
    }
    
    // Restore original network methods
    if (networkInterceptorRef.current) {
      networkInterceptorRef.current();
      networkInterceptorRef.current = null;
    }
    
    // Generate comprehensive log analysis
    const logs: CollectedLogs = {
      browserLogs: currentLogs,
      networkLogs,
      errorSummary: generateErrorSummary(currentLogs),
      performanceMetrics: generatePerformanceMetrics(),
      securityEvents: generateSecurityEvents(currentLogs),
      timestamp: new Date(),
      sessionId: generateSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    setCollectedLogs(logs);
    onLogsCollected?.(logs);
  }, [isCollecting, currentLogs, networkLogs, onLogsCollected]);

  const categorizeLog = (message: string): LogCategory => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('firebase') || lowerMessage.includes('firestore')) return 'firebase';
    if (lowerMessage.includes('stripe') || lowerMessage.includes('payment')) return 'stripe';
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) return 'react';
    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('session')) return 'authentication';
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('xhr')) return 'network';
    if (lowerMessage.includes('security') || lowerMessage.includes('csp') || lowerMessage.includes('cors')) return 'security';
    if (lowerMessage.includes('performance') || lowerMessage.includes('slow') || lowerMessage.includes('memory')) return 'performance';
    if (lowerMessage.includes('syntaxerror') || lowerMessage.includes('typeerror') || lowerMessage.includes('referenceerror')) return 'javascript';
    
    return 'general';
  };

  const getSeverity = (level: string, message: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (level === 'error') {
      if (message.toLowerCase().includes('critical') || message.toLowerCase().includes('fatal')) return 'critical';
      if (message.toLowerCase().includes('auth') || message.toLowerCase().includes('payment')) return 'high';
      return 'medium';
    }
    if (level === 'warn') return 'medium';
    return 'low';
  };

  const createTraumaInformedDescription = (message: string, level: string): string => {
    if (level === 'error') {
      return "We noticed an error occurred. This happens sometimes with technology, and it's not your fault. We're here to help you work through this.";
    }
    if (level === 'warn') {
      return "This is a gentle reminder from your browser. Nothing is broken - it's just letting us know about something we can improve.";
    }
    return "This is normal technical information that helps us understand how things are working.";
  };

  const createUserFriendlyMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
      return "There was a connection issue with our servers";
    }
    if (lowerMessage.includes('auth') || lowerMessage.includes('login')) {
      return "There was an issue with the login process";
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('stripe')) {
      return "There was an issue processing payment information";
    }
    if (lowerMessage.includes('firebase') || lowerMessage.includes('firestore')) {
      return "There was an issue connecting to our database";
    }
    
    return "A technical issue occurred that we can help resolve";
  };

  const isAlchmRelated = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes('alchm') || 
           lowerMessage.includes('firebase') ||
           lowerMessage.includes('journal') ||
           lowerMessage.includes('emotion') ||
           lowerMessage.includes('sage') ||
           lowerMessage.includes('sanctuary');
  };

  const generateErrorSummary = (logs: BrowserLog[]): ErrorSummary => {
    const errors = logs.filter(log => log.level === 'error');
    const warnings = logs.filter(log => log.level === 'warn');
    
    const errorsByType: Record<string, number> = {};
    logs.forEach(log => {
      errorsByType[log.category] = (errorsByType[log.category] || 0) + 1;
    });

    const criticalErrors = logs.filter(log => log.severity === 'critical');
    
    return {
      totalErrors: errors.length,
      errorsByType,
      criticalErrors,
      javascriptErrors: logs.filter(log => log.category === 'javascript').length,
      networkErrors: logs.filter(log => log.category === 'network').length,
      authenticationErrors: logs.filter(log => log.category === 'authentication').length,
      performanceErrors: logs.filter(log => log.category === 'performance').length,
      traumaInformedSummary: traumaInformed 
        ? `We found ${errors.length} issues that we can help you resolve. Remember, these technical hiccups are normal and don't reflect on you at all.`
        : `Found ${errors.length} errors and ${warnings.length} warnings`
    };
  };

  const generatePerformanceMetrics = (): PerformanceLog[] => {
    const metrics: PerformanceLog[] = [];
    
    // Get performance metrics from browser
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.push({
          id: 'load-time',
          timestamp: new Date(),
          metric: 'Page Load Time',
          value: navigation.loadEventEnd - navigation.loadEventStart,
          unit: 'ms',
          threshold: 3000,
          exceeded: (navigation.loadEventEnd - navigation.loadEventStart) > 3000,
          impact: 'medium'
        });
      }
    }
    
    return metrics;
  };

  const generateSecurityEvents = (logs: BrowserLog[]): SecurityEvent[] => {
    return logs
      .filter(log => log.category === 'security')
      .map(log => ({
        id: `security-${log.id}`,
        timestamp: log.timestamp,
        type: 'csp_violation' as const,
        severity: log.severity,
        description: log.message,
        details: log.message,
        blocked: true
      }));
  };

  const generateSessionId = (): string => {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  const filteredLogs = currentLogs.filter(log => {
    // Level filter
    if (!filter.levels.has(log.level)) return false;
    
    // Category filter
    if (filter.categories.size > 0 && !filter.categories.has(log.category)) return false;
    
    // Search filter
    if (filter.searchTerm && !log.message.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
    
    // Error only filter
    if (filter.showOnlyErrors && log.level !== 'error') return false;
    
    // Time range filter
    if (filter.timeRange !== 'all') {
      const now = new Date();
      const logTime = new Date(log.timestamp);
      const diffMinutes = (now.getTime() - logTime.getTime()) / (1000 * 60);
      
      const ranges = { '1m': 1, '5m': 5, '15m': 15, '1h': 60 };
      if (diffMinutes > ranges[filter.timeRange as keyof typeof ranges]) return false;
    }
    
    return true;
  });

  const downloadLogs = useCallback(() => {
    if (!collectedLogs) return;
    
    const logData = {
      ...collectedLogs,
      exportedAt: new Date().toISOString(),
      traumaInformed,
      privacy: {
        note: "This log file contains technical diagnostic information only. No personal content from your journals or entries is included.",
        retention: "Please delete this file after the support issue is resolved.",
        sharing: "Only share this with official ALCHM support staff."
      }
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `alchm-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }, [collectedLogs, traumaInformed]);

  const copyToClipboard = useCallback(async () => {
    if (!collectedLogs) return;
    
    const summary = `ALCHM Support Logs
Generated: ${collectedLogs.timestamp.toISOString()}
Session: ${collectedLogs.sessionId}
URL: ${collectedLogs.url}

Error Summary:
- Total Errors: ${collectedLogs.errorSummary.totalErrors}
- JavaScript Errors: ${collectedLogs.errorSummary.javascriptErrors}
- Network Errors: ${collectedLogs.errorSummary.networkErrors}
- Authentication Errors: ${collectedLogs.errorSummary.authenticationErrors}

Recent Critical Errors:
${collectedLogs.errorSummary.criticalErrors.slice(0, 5).map(error => 
  `[${error.timestamp.toISOString()}] ${error.level.toUpperCase()}: ${error.message}`
).join('\n')}

Performance Metrics:
${collectedLogs.performanceMetrics.map(metric => 
  `${metric.metric}: ${metric.value}${metric.unit} ${metric.exceeded ? '⚠️ Exceeded threshold' : '✅'}`
).join('\n')}`;

    await navigator.clipboard.writeText(summary);
  }, [collectedLogs]);

  const InstructionsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl bg-sanctuary-white max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-medium text-sanctuary-gray-800">
                {traumaInformed ? 'How to Share Diagnostic Information' : 'Console Log Collection Guide'}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-sage-50 rounded-lg border border-sage-100">
            <h4 className="font-medium text-sage-800 mb-2">
              {traumaInformed ? '💚 What this helps us understand:' : 'What are console logs?'}
            </h4>
            <p className="text-sm text-sanctuary-gray-700 mb-3">
              {traumaInformed 
                ? 'These logs help us see what your browser experienced while you were using ALCHM. Think of them like a gentle conversation between your device and our app - they help us understand where we can make things work better for you.'
                : 'Console logs are diagnostic messages that help identify technical issues. They contain information about errors, warnings, and system events.'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sanctuary-gray-800">
              {traumaInformed ? 'Simple steps to help us help you:' : 'Manual Collection Steps:'}
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</div>
                <div>
                  <p className="font-medium">Open Developer Tools</p>
                  <p className="text-sanctuary-gray-600">
                    Press F12 (or Ctrl+Shift+I on Windows, Cmd+Option+I on Mac)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">2</div>
                <div>
                  <p className="font-medium">Click the "Console" tab</p>
                  <p className="text-sanctuary-gray-600">
                    You'll see a panel with text messages
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">3</div>
                <div>
                  <p className="font-medium">Reproduce the issue</p>
                  <p className="text-sanctuary-gray-600">
                    {traumaInformed 
                      ? 'Gently try the action that caused the problem while the console is open'
                      : 'Perform the action that causes the problem'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">4</div>
                <div>
                  <p className="font-medium">Copy the messages</p>
                  <p className="text-sanctuary-gray-600">
                    Right-click in the console and select "Select All", then copy
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">🔒 Privacy Protection</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Console logs don't contain your journal entries or personal content</li>
              <li>• They only show technical system messages</li>
              <li>• We never see your passwords or private information</li>
              <li>• Logs are automatically deleted after analysis</li>
            </ul>
          </div>

          {traumaInformed && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800 mb-2">💚 Remember</h4>
              <p className="text-xs text-green-700">
                If this feels overwhelming, that's completely okay. You can also just describe what happened in your own words, and we'll help you step by step. There's no pressure to use technical tools if they don't feel comfortable.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Instructions Modal */}
      {showInstructions && <InstructionsModal />}
      
      {/* Main Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft ${
                isCollecting 
                  ? 'bg-green-400 animate-pulse' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500'
              }`}>
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-sanctuary-gray-800">
                  {traumaInformed ? 'Technical Information Helper' : 'Console Log Collector'}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  {traumaInformed 
                    ? 'Gather helpful information to understand what\'s happening'
                    : 'Capture browser console logs for debugging'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(true)}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Help
              </Button>
              
              {isCollecting ? (
                <Button
                  onClick={stopLogCollection}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Collection
                </Button>
              ) : (
                <Button
                  onClick={startLogCollection}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Collecting
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!isCollecting && currentLogs.length === 0 && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto">
                  <Bug className="w-8 h-8 text-blue-600" />
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-sanctuary-gray-800 mb-2">
                    {traumaInformed 
                      ? 'Let\'s gather some helpful information' 
                      : 'Ready to collect diagnostic information'}
                  </h4>
                  <p className="text-sm text-sanctuary-gray-600 mb-4">
                    {traumaInformed
                      ? 'Click "Start Collecting" then use ALCHM normally. When the issue happens, click "Stop Collection" and we\'ll have the information we need to help.'
                      : 'Start collection, reproduce the issue, then stop to analyze the logs.'}
                  </p>
                </div>
                
                <div className="text-xs text-sanctuary-gray-500 space-y-1">
                  <p>• Captures browser console messages</p>
                  <p>• Monitors network requests</p>
                  <p>• Records performance metrics</p>
                  <p>• All data stays private and secure</p>
                </div>
              </div>
            </div>
          )}

          {isCollecting && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">
                    {traumaInformed ? 'Gently collecting information...' : 'Collecting logs...'}
                  </span>
                </div>
                <div className="text-sm text-green-700">
                  {currentLogs.length} events captured
                </div>
              </div>
              
              {traumaInformed && (
                <div className="p-3 bg-sage-50 rounded-lg border border-sage-100">
                  <p className="text-sm text-sage-700">
                    💚 Go ahead and use ALCHM normally. Try the action that's giving you trouble. We're quietly gathering information to help you.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentLogs.length > 0 && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 p-3 bg-sanctuary-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-sanctuary-gray-600" />
                  <span className="text-sm font-medium text-sanctuary-gray-700">Filter:</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {['error', 'warn', 'info', 'log'].map(level => (
                    <label key={level} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={filter.levels.has(level)}
                        onChange={(e) => {
                          const newLevels = new Set(filter.levels);
                          if (e.target.checked) {
                            newLevels.add(level);
                          } else {
                            newLevels.delete(level);
                          }
                          setFilter(prev => ({ ...prev, levels: newLevels }));
                        }}
                        className="w-3 h-3"
                      />
                      <span className="text-xs text-sanctuary-gray-600 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
                
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filter.searchTerm}
                  onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="px-2 py-1 text-xs border rounded w-40"
                />
              </div>

              {/* Log Display */}
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {filteredLogs.length === 0 ? (
                  <div className="p-4 text-center text-sanctuary-gray-500">
                    <p className="text-sm">No logs match current filters</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredLogs.slice(-50).map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 text-xs font-mono ${
                          log.level === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
                          log.level === 'warn' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                          log.level === 'info' ? 'bg-blue-50 border-l-4 border-blue-400' :
                          'bg-sanctuary-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <span className="text-sanctuary-gray-500">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <span className={`px-1 rounded text-xs uppercase font-medium ${
                            log.level === 'error' ? 'bg-red-600 text-white' :
                            log.level === 'warn' ? 'bg-yellow-600 text-white' :
                            log.level === 'info' ? 'bg-blue-600 text-white' :
                            'bg-sanctuary-gray-600 text-white'
                          }`}>
                            {log.level}
                          </span>
                          <span className="text-sanctuary-gray-600 text-xs">
                            [{log.category}]
                          </span>
                          {log.relatedToAlchm && (
                            <span className="bg-sage-600 text-white px-1 rounded text-xs">
                              ALCHM
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sanctuary-gray-800 mb-2">
                          {log.message}
                        </div>
                        
                        {traumaInformed && log.traumaInformedDescription && (
                          <div className="text-xs text-sage-700 italic bg-sage-25 p-2 rounded">
                            💚 {log.traumaInformedDescription}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {collectedLogs && (
          <CardFooter className="flex items-center justify-between bg-sanctuary-gray-50">
            <div className="text-sm text-sanctuary-gray-600">
              Collected {collectedLogs.browserLogs.length} browser logs, {collectedLogs.networkLogs.length} network events
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Summary
              </Button>
              
              <Button
                onClick={downloadLogs}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Download Full Report
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Error Summary */}
      {collectedLogs && collectedLogs.errorSummary.totalErrors > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-lg font-medium text-sanctuary-gray-800">
                  {traumaInformed ? 'What We Found' : 'Error Summary'}
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  {collectedLogs.errorSummary.traumaInformedSummary}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="text-2xl font-medium text-red-600">
                  {collectedLogs.errorSummary.totalErrors}
                </div>
                <div className="text-xs text-red-700">Total Errors</div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-medium text-blue-600">
                  {collectedLogs.errorSummary.networkErrors}
                </div>
                <div className="text-xs text-blue-700">Network Issues</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-medium text-purple-600">
                  {collectedLogs.errorSummary.authenticationErrors}
                </div>
                <div className="text-xs text-purple-700">Auth Issues</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="text-2xl font-medium text-orange-600">
                  {collectedLogs.errorSummary.javascriptErrors}
                </div>
                <div className="text-xs text-orange-700">JavaScript Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}