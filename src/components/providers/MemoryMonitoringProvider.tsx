/**
 * Memory Monitoring Provider for ALCHM
 * Integrates memory leak detection with React component tree
 * Provides real-time memory monitoring for crisis-critical applications
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSafeEffect, useSafeState } from '@/lib/memory-management/react-memory-manager';
import MemoryLeakDetector, { MemoryLeak } from '@/lib/memory-management/memory-leak-detector';

interface MemoryMonitoringContextType {
  memoryUsage: {
    current: number;
    peak: number;
    growth: number;
    status: 'healthy' | 'warning' | 'critical';
  };
  isMonitoring: boolean;
  reportLeak: (component: string, description: string) => void;
  emergencyCleanup: () => void;
}

const MemoryMonitoringContext = createContext&lt;MemoryMonitoringContextType | null&gt;(null);

export function useMemoryMonitoring() {
  const context = useContext(MemoryMonitoringContext);
  if (!context) {
    throw new Error('useMemoryMonitoring must be used within MemoryMonitoringProvider');
  }
  return context;
}

interface MemoryMonitoringProviderProps {
  children: ReactNode;
  enableCrisisMode?: boolean;
  alertThreshold?: number; // MB per minute
  criticalThreshold?: number; // MB per minute
}

export default function MemoryMonitoringProvider({
  children,
  enableCrisisMode = false,
  alertThreshold = 0.5,
  criticalThreshold = 1.5
}: MemoryMonitoringProviderProps) {
  const [memoryUsage, setMemoryUsage] = useSafeState({
    current: 0,
    peak: 0,
    growth: 0,
    status: 'healthy' as const
  }, 'MemoryMonitoringProvider');
  
  const [isMonitoring, setIsMonitoring] = useSafeState(false, 'MemoryMonitoringProvider');
  const [memoryDetector] = useSafeState(() => MemoryLeakDetector.getInstance(), 'MemoryMonitoringProvider');

  useSafeEffect(() => {
    // Start memory monitoring
    setIsMonitoring(true);
    
    memoryDetector.startMonitoring({
      interval: enableCrisisMode ? 3000 : 10000,
      onLeakDetected: (leak: MemoryLeak) => {
        console.warn('[ALCHM Memory] Memory leak detected:', leak);
        
        // Send to analytics (privacy-preserving)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'memory_leak_detected', {
            severity: leak.severity,
            growth_rate: leak.growth,
            component: leak.component || 'unknown',
            crisis_mode: enableCrisisMode
          });
        }
        
        // Update memory usage state
        updateMemoryUsage();
      },
      onCriticalLeak: (leak: MemoryLeak) => {
        console.error('[ALCHM Memory] CRITICAL MEMORY LEAK:', leak);
        
        // Immediate emergency response for crisis users
        if (enableCrisisMode) {
          performEmergencyCleanup();
        }
        
        // Send critical alert to monitoring
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'critical_memory_leak', {
            growth_rate: leak.growth,
            component: leak.component || 'unknown',
            crisis_mode: enableCrisisMode
          });
        }
        
        updateMemoryUsage();
      }
    });
    
    // Update memory usage periodically
    const updateInterval = setInterval(updateMemoryUsage, enableCrisisMode ? 5000 : 15000);
    
    return () => {
      memoryDetector.stopMonitoring();
      clearInterval(updateInterval);
      setIsMonitoring(false);
    };
  }, [enableCrisisMode, memoryDetector], 'MemoryMonitoringProvider');
  
  const updateMemoryUsage = () => {
    const usage = memoryDetector.getMemoryUsage();
    setMemoryUsage(usage);
  };
  
  const reportLeak = (component: string, description: string) => {
    console.warn(`[ALCHM Memory] Manual leak report from ${component}: ${description}`);
    
    // Log for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'manual_memory_report', {
        component,
        description: description.slice(0, 100), // Truncate for privacy
        crisis_mode: enableCrisisMode
      });
    }
  };
  
  const performEmergencyCleanup = () => {
    console.log('[ALCHM Memory] Performing emergency cleanup...');
    
    // Execute all registered cleanup functions
    memoryDetector.executeAllCleanup();
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    // Clear non-essential browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (!name.includes('crisis') && !name.includes('emergency')) {
            caches.delete(name);
          }
        });
      });
    }
    
    // Update memory usage after cleanup
    setTimeout(updateMemoryUsage, 1000);
  };
  
  const contextValue: MemoryMonitoringContextType = {
    memoryUsage,
    isMonitoring,
    reportLeak,
    emergencyCleanup: performEmergencyCleanup
  };
  
  return (
    &lt;MemoryMonitoringContext.Provider value={contextValue}&gt;
      {children}
      
      {/* Development memory monitor overlay */}
      {process.env.NODE_ENV === 'development' && (
        &lt;MemoryMonitorOverlay /&gt;
      )}
    &lt;/MemoryMonitoringContext.Provider&gt;
  );
}

/**
 * Development overlay showing memory usage
 */
function MemoryMonitorOverlay() {
  const { memoryUsage, isMonitoring, emergencyCleanup } = useMemoryMonitoring();
  
  if (!isMonitoring) return null;
  
  const getStatusColor = () => {
    switch (memoryUsage.status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };
  
  return (
    &lt;div className="fixed bottom-4 right-4 bg-black/90 text-white text-xs p-3 rounded-lg font-mono z-50 max-w-xs"&gt;
      &lt;div className="flex items-center gap-2 mb-2"&gt;
        &lt;div className={`w-2 h-2 rounded-full ${getStatusColor()}`}&gt;&lt;/div&gt;
        &lt;span className="font-semibold"&gt;Memory Monitor&lt;/span&gt;
      &lt;/div&gt;
      
      &lt;div className="space-y-1"&gt;
        &lt;div&gt;Current: {memoryUsage.current.toFixed(1)}MB&lt;/div&gt;
        &lt;div&gt;Peak: {memoryUsage.peak.toFixed(1)}MB&lt;/div&gt;
        &lt;div&gt;Growth: {memoryUsage.growth.toFixed(2)}MB/min&lt;/div&gt;
        &lt;div&gt;Status: {memoryUsage.status}&lt;/div&gt;
      &lt;/div&gt;
      
      {memoryUsage.status !== 'healthy' && (
        &lt;button
          onClick={emergencyCleanup}
          className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
        &gt;
          Emergency Cleanup
        &lt;/button&gt;
      )}
    &lt;/div&gt;
  );
}

/**
 * Hook for components to report memory usage
 */
export function useMemoryReporting(componentName: string) {
  const { reportLeak } = useMemoryMonitoring();
  
  const reportMemoryLeak = (description: string) => {
    reportLeak(componentName, description);
  };
  
  return { reportMemoryLeak };
}