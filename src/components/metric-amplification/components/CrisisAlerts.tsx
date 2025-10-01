/**
 * ALCHM Crisis Alerts Component
 * Performance Critical: <100ms render time for crisis situations
 * Memory Safe: Zero memory leaks, automated cleanup
 */

'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CrisisAlert {
  id: string;
  type: 'performance' | 'memory' | 'crisis' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  metrics?: any;
}

interface CrisisAlertsProps {
  alerts: CrisisAlert[];
  onAlertClick?: (alert: CrisisAlert) => void;
  maxAlerts?: number;
}

export const CrisisAlerts = memo(({ 
  alerts = [], 
  onAlertClick,
  maxAlerts = 5 
}: CrisisAlertsProps) => {
  const [visibleAlerts, setVisibleAlerts] = useState<CrisisAlert[]>([]);
  const alertsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // PERFORMANCE: Only show most critical alerts
  useEffect(() => {
    const sortedAlerts = [...alerts]
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, maxAlerts);
    
    setVisibleAlerts(sortedAlerts);
  }, [alerts, maxAlerts]);
  
  // MEMORY CLEANUP: Remove old alert DOM references
  useEffect(() => {
    const activeIds = new Set(visibleAlerts.map(a => a.id));
    for (const [id, element] of alertsRef.current.entries()) {
      if (!activeIds.has(id)) {
        alertsRef.current.delete(id);
      }
    }
  }, [visibleAlerts]);
  
  if (visibleAlerts.length === 0) {
    return (
      <Card variant="sanctuary" className="border-sage-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-center text-sage-600">
            <div className="w-3 h-3 bg-sage-400 rounded-full animate-gentle-pulse mr-3"></div>
            <span className="text-sm font-medium">All systems optimal</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card variant="gentle" className="border-l-4 border-red-400">
      <CardHeader className="pb-3">
        <CardTitle level="h3" className="text-red-700 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-gentle-pulse"></div>
          Crisis Alerts
          <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
            {visibleAlerts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {visibleAlerts.map((alert) => (
            <CrisisAlertItem
              key={alert.id}
              alert={alert}
              onClick={onAlertClick}
              ref={(el) => {
                if (el) alertsRef.current.set(alert.id, el);
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

const CrisisAlertItem = memo(React.forwardRef<HTMLDivElement, {
  alert: CrisisAlert;
  onClick?: (alert: CrisisAlert) => void;
}>(({ alert, onClick }, ref) => {
  const severityConfig = {
    critical: { 
      bg: 'bg-red-50 border-red-200', 
      text: 'text-red-800', 
      dot: 'bg-red-500',
      icon: '🚨'
    },
    high: { 
      bg: 'bg-orange-50 border-orange-200', 
      text: 'text-orange-800', 
      dot: 'bg-orange-500',
      icon: '⚠️'
    },
    medium: { 
      bg: 'bg-amber-50 border-amber-200', 
      text: 'text-amber-800', 
      dot: 'bg-amber-500',
      icon: '⚡'
    },
    low: { 
      bg: 'bg-blue-50 border-blue-200', 
      text: 'text-blue-800', 
      dot: 'bg-blue-500',
      icon: 'ℹ️'
    }
  };
  
  const config = severityConfig[alert.severity];
  const timeAgo = Math.floor((Date.now() - alert.timestamp.getTime()) / 1000);
  
  return (
    <div
      ref={ref}
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${config.bg}`}
      onClick={() => onClick?.(alert)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1 ${config.dot}`}></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs">{config.icon}</span>
            <span className={`text-sm font-medium ${config.text} capitalize`}>
              {alert.type} Alert
            </span>
            <span className="text-xs text-sanctuary-gray-500">
              {timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`}
            </span>
          </div>
          <p className={`text-sm ${config.text} leading-relaxed`}>
            {alert.message}
          </p>
          {alert.metrics && (
            <div className="mt-2 text-xs text-sanctuary-gray-600">
              <code className="bg-sanctuary-gray-100 px-2 py-1 rounded">
                {JSON.stringify(alert.metrics, null, 0)}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}));

// Performance monitoring alert generator
export const usePerformanceAlerts = () => {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const alertIdCounter = useRef(0);
  
  const addAlert = (
    type: CrisisAlert['type'],
    severity: CrisisAlert['severity'],
    message: string,
    metrics?: any
  ) => {
    const alert: CrisisAlert = {
      id: `alert_${Date.now()}_${++alertIdCounter.current}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      metrics
    };
    
    setAlerts(prev => {
      const newAlerts = [alert, ...prev];
      // Keep only last 20 alerts to prevent memory bloat
      return newAlerts.slice(0, 20);
    });
    
    // Auto-remove low priority alerts after 30 seconds
    if (severity === 'low') {
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== alert.id));
      }, 30000);
    }
  };
  
  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };
  
  const clearAllAlerts = () => {
    setAlerts([]);
  };
  
  return {
    alerts,
    addAlert,
    clearAlert,
    clearAllAlerts
  };
};

CrisisAlerts.displayName = 'CrisisAlerts';
CrisisAlertItem.displayName = 'CrisisAlertItem';