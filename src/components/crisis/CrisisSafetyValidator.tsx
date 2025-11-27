/**
 * Crisis Safety Validator Component
 * 
 * Real-time validation and monitoring of crisis intervention systems
 * Provides immediate feedback on crisis system health and accessibility
 * 
 * CRITICAL: This component helps ensure life-saving systems work when needed
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Phone, MessageSquare, Globe, Clock, Users, Shield } from 'lucide-react';
import { 
  crisisSafetyMonitor, 
  type CrisisHealthMetrics, 
  type CrisisResourceTest,
  type CrisisDetectionTest,
  type CrisisAlertLevel,
  validateEmergencyContacts,
  quickCrisisHealthCheck
} from '@/lib/crisis-safety-monitor';

interface CrisisSafetyValidatorProps {
  autoStart?: boolean;
  showDetailed?: boolean;
  onCriticalAlert?: (alert: CrisisAlertLevel) => void;
}

export default function CrisisSafetyValidator({ 
  autoStart = false, 
  showDetailed = false,
  onCriticalAlert 
}: CrisisSafetyValidatorProps) {
  // State for monitoring data
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<CrisisHealthMetrics | null>(null);
  const [resourceTests, setResourceTests] = useState<CrisisResourceTest[]>([]);
  const [accuracyTests, setAccuracyTests] = useState<CrisisDetectionTest[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<CrisisAlertLevel[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Emergency contacts validation
  const [emergencyContacts] = useState(validateEmergencyContacts());

  // Quick health check function
  const performQuickCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const health = await quickCrisisHealthCheck();
      const mockHealthMetrics: CrisisHealthMetrics = {
        timestamp: new Date().toISOString(),
        service: 'crisis-detection',
        status: health.healthy ? 'healthy' : 'degraded',
        responseTime: health.responseTime,
        errorRate: health.healthy ? 0 : 1,
        availability: health.healthy ? 100 : 95,
        details: {
          endpoint: '/api/crisis-detection',
          method: 'GET',
          error: health.error
        }
      };
      
      setHealthMetrics(mockHealthMetrics);
      setLastCheck(new Date());

      // Generate alert if critical
      if (!health.healthy || health.responseTime > 3000) {
        const alert: CrisisAlertLevel = {
          level: health.responseTime > 5000 ? 'critical' : 'warning',
          message: health.error || `Slow response time: ${health.responseTime}ms`,
          service: 'crisis-detection',
          timestamp: new Date().toISOString(),
          impact: health.responseTime > 5000 ? 'high' : 'medium'
        };
        
        setActiveAlerts(prev => [alert, ...prev.slice(0, 4)]);
        onCriticalAlert?.(alert);
      }
    } catch (error) {
      console.error('Quick health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onCriticalAlert]);

  // Comprehensive test function
  const performComprehensiveTest = useCallback(async () => {
    setIsLoading(true);
    try {
      // Test crisis detection accuracy
      const accuracy = await crisisSafetyMonitor.testCrisisDetectionAccuracy();
      setAccuracyTests(accuracy);

      // Test emergency resources
      const resources = await crisisSafetyMonitor.testEmergencyResources();
      setResourceTests(resources);

      // Get active alerts
      const alerts = await crisisSafetyMonitor.getActiveAlerts();
      setActiveAlerts(alerts);

      setLastCheck(new Date());
    } catch (error) {
      console.error('Comprehensive test failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start continuous monitoring
  const startMonitoring = useCallback(async () => {
    try {
      await crisisSafetyMonitor.monitorCrisisHealth();
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  }, []);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    crisisSafetyMonitor.stopMonitoring();
    setIsMonitoring(false);
  }, []);

  // Auto-start monitoring if requested
  useEffect(() => {
    if (autoStart) {
      performQuickCheck();
    }
  }, [autoStart, performQuickCheck]);

  // Get status color for health metrics
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get alert level color
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'emergency': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-medium text-gray-900">Crisis Safety Validator</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={performQuickCheck}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>{isLoading ? 'Testing...' : 'Quick Check'}</span>
          </button>
          
          <button
            onClick={performComprehensiveTest}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Full Test
          </button>
          
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-4 py-2 rounded-md text-white ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isMonitoring ? 'Stop Monitor' : 'Start Monitor'}
          </button>
        </div>
      </div>

      {/* Last Check Timestamp */}
      {lastCheck && (
        <div className="mb-4 text-sm text-gray-600">
          Last checked: {lastCheck.toLocaleString()}
        </div>
      )}

      {/* Health Status Overview */}
      {healthMetrics && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Crisis Detection Health</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthMetrics.status)}`}>
                {healthMetrics.status.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Status</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-medium ${healthMetrics.responseTime < 3000 ? 'text-green-600' : 'text-red-600'}`}>
                {healthMetrics.responseTime}ms
              </div>
              <div className="text-xs text-gray-500">Response Time</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-medium ${healthMetrics.availability >= 99.9 ? 'text-green-600' : 'text-yellow-600'}`}>
                {healthMetrics.availability.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Availability</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-medium ${healthMetrics.errorRate === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(healthMetrics.errorRate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Error Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Active Alerts</span>
          </h3>
          
          <div className="space-y-2">
            {activeAlerts.slice(0, 5).map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded border-l-4 ${
                  alert.level === 'emergency' ? 'border-red-600 bg-red-50' :
                  alert.level === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.level === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getAlertColor(alert.level)}`}>
                      {alert.level.toUpperCase()}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{alert.service}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts Validation */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
          <Phone className="h-5 w-5 text-blue-600" />
          <span>Emergency Contacts</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="border rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                {contact.accessible ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium text-sm">{contact.name}</span>
              </div>
              
              <div className="text-xs text-gray-600">
                <div>{contact.type.replace('_', ' ').toUpperCase()}</div>
                <div>Number: {contact.number}</div>
                <div>Country: {contact.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Accessibility Tests */}
      {resourceTests.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <span>Crisis Resources</span>
          </h3>
          
          <div className="space-y-3">
            {resourceTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {test.type === 'phone' && <Phone className="h-4 w-4 text-blue-600" />}
                  {test.type === 'text' && <MessageSquare className="h-4 w-4 text-green-600" />}
                  {test.type === 'web' && <Globe className="h-4 w-4 text-purple-600" />}
                  
                  <div>
                    <div className="font-medium text-sm">{test.name}</div>
                    <div className="text-xs text-gray-600">{test.contact}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {test.responseTime && (
                    <span className="text-xs text-gray-500">{test.responseTime}ms</span>
                  )}
                  {test.accessible ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy Tests */}
      {showDetailed && accuracyTests.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-600" />
            <span>Detection Accuracy</span>
          </h3>
          
          <div className="space-y-2">
            {accuracyTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                <div>
                  <span className="font-medium">{test.inputText}</span>
                  <span className="ml-2 text-gray-500">({test.language})</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{test.responseTime}ms</span>
                  {test.accuracy ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {accuracyTests.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              Accuracy: {((accuracyTests.filter(t => t.accuracy).length / accuracyTests.length) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      )}

      {/* Monitoring Status */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-700">
            Continuous monitoring: {isMonitoring ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="mt-2 text-xs text-gray-600">
          {isMonitoring 
            ? 'Crisis systems are being monitored in real-time for availability and performance.'
            : 'Click "Start Monitor" to enable continuous crisis system health monitoring.'
          }
        </div>
      </div>
    </div>
  );
}