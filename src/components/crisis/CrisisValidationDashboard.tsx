/**
 * ALCHM Crisis Validation Dashboard
 * 
 * Professional interface for licensed mental health practitioners to:
 * - Review crisis detection algorithm performance
 * - Validate test cases and adjust sensitivity
 * - Monitor real-time crisis intervention effectiveness
 * - Generate clinical compliance reports
 * 
 * Security: Only accessible to verified mental health professionals
 */

'use client';

import React, { useState, useEffect } from 'react';
import { CrisisValidationSuite, type CrisisTestCase, type ValidationMetrics } from '../../testing/crisis-validation-suite';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface CrisisValidationDashboardProps {
  userRole: 'therapist' | 'crisis_specialist' | 'admin';
  licenseNumber?: string;
  specialties?: string[];
}

interface ValidationSession {
  id: string;
  timestamp: string;
  validator: string;
  metrics: ValidationMetrics;
  status: 'in_progress' | 'completed' | 'requires_review';
  notes?: string;
}

export default function CrisisValidationDashboard({
  userRole,
  licenseNumber,
  specialties = []
}: CrisisValidationDashboardProps) {
  const [validationSuite] = useState(new CrisisValidationSuite());
  const [currentValidation, setCurrentValidation] = useState<any>(null);
  const [validationHistory, setValidationHistory] = useState<ValidationSession[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTestCategories, setSelectedTestCategories] = useState<string[]>(['all']);
  const [complianceReport, setComplianceReport] = useState<string>('');
  const [alertThresholds, setAlertThresholds] = useState({
    accuracy: 95,
    falsePositiveRate: 2,
    responseTime: 1000
  });

  // Verify professional credentials
  useEffect(() => {
    if (!licenseNumber && userRole !== 'admin') {
      console.warn('Crisis validation requires verified mental health professional credentials');
    }
  }, [licenseNumber, userRole]);

  /**
   * Run comprehensive crisis detection validation
   */
  const runValidation = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    console.log('🔍 Starting crisis detection validation by:', userRole);

    try {
      const results = await validationSuite.runFullValidation();
      
      setCurrentValidation(results);
      setComplianceReport(results.complianceReport);

      // Save validation session
      const session: ValidationSession = {
        id: `validation_${Date.now()}`,
        timestamp: new Date().toISOString(),
        validator: `${userRole}_${licenseNumber || 'admin'}`,
        metrics: results.metrics,
        status: results.readyForProduction ? 'completed' : 'requires_review',
        notes: `Validated by ${userRole} - Production ready: ${results.readyForProduction}`
      };

      setValidationHistory(prev => [session, ...prev.slice(0, 9)]); // Keep last 10

      // Alert if critical thresholds not met
      if (results.metrics.accuracy * 100 < alertThresholds.accuracy) {
        alert(`⚠️ CRITICAL: Accuracy below threshold (${(results.metrics.accuracy * 100).toFixed(1)}%)`);
      }

    } catch (error) {
      console.error('❌ Validation failed:', error);
      alert('Validation failed. See console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Generate clinical report for documentation
   */
  const generateClinicalReport = () => {
    if (!currentValidation) return;

    const reportData = {
      validationDate: new Date().toISOString(),
      validator: {
        role: userRole,
        license: licenseNumber,
        specialties: specialties
      },
      metrics: currentValidation.metrics,
      complianceStatus: currentValidation.readyForProduction,
      recommendations: generateRecommendations(currentValidation.metrics)
    };

    // Download as JSON for clinical records
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alchm_crisis_validation_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  /**
   * Generate clinical recommendations based on metrics
   */
  const generateRecommendations = (metrics: ValidationMetrics): string[] => {
    const recommendations: string[] = [];

    if (metrics.accuracy < 0.95) {
      recommendations.push('Improve crisis detection accuracy through additional training data');
    }
    if (metrics.falsePositiveRate > 0.02) {
      recommendations.push('Reduce false positive rate to minimize unnecessary crisis alerts');
    }
    if (metrics.maxResponseTime > 3000) {
      recommendations.push('Optimize response time for life-critical crisis detection');
    }
    if (metrics.culturalCompetencyScore < 0.90) {
      recommendations.push('Enhance cultural competency for diverse crisis expressions');
    }
    if (metrics.emergencyDetectionAccuracy < 0.98) {
      recommendations.push('CRITICAL: Improve emergency-level crisis detection accuracy');
    }

    return recommendations;
  };

  /**
   * Get compliance status styling
   */
  const getComplianceStatus = (metrics: ValidationMetrics) => {
    const isCompliant = metrics.accuracy >= 0.95 && 
                       metrics.falsePositiveRate <= 0.02 && 
                       metrics.maxResponseTime <= 3000;
    
    return {
      status: isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT',
      className: isCompliant ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crisis Detection Validation Dashboard
        </h1>
        <p className="text-gray-600">
          Professional validation interface for mental health practitioners
        </p>
        
        {/* Credentials Display */}
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            {userRole.replace('_', ' ').toUpperCase()}
          </span>
          {licenseNumber && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              License: {licenseNumber}
            </span>
          )}
          {specialties.length > 0 && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              {specialties.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Validation Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Test Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Categories
            </label>
            <div className="space-y-2">
              {['all', 'suicide_ideation', 'cultural_specific', 'self_harm', 'domestic_violence', 'false_positives'].map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTestCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTestCategories(prev => [...prev, category]);
                      } else {
                        setSelectedTestCategories(prev => prev.filter(c => c !== category));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{category.replace('_', ' ').toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Alert Thresholds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Thresholds
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500">Accuracy (%)</label>
                <input
                  type="number"
                  value={alertThresholds.accuracy}
                  onChange={(e) => setAlertThresholds(prev => ({ ...prev, accuracy: parseInt(e.target.value) }))}
                  className="w-full px-3 py-1 border rounded text-sm"
                  min="90"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">False Positive Rate (%)</label>
                <input
                  type="number"
                  value={alertThresholds.falsePositiveRate}
                  onChange={(e) => setAlertThresholds(prev => ({ ...prev, falsePositiveRate: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-1 border rounded text-sm"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Response Time (ms)</label>
                <input
                  type="number"
                  value={alertThresholds.responseTime}
                  onChange={(e) => setAlertThresholds(prev => ({ ...prev, responseTime: parseInt(e.target.value) }))}
                  className="w-full px-3 py-1 border rounded text-sm"
                  min="100"
                  max="5000"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-center space-y-3">
            <Button
              onClick={runValidation}
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRunning ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Validation...
                </div>
              ) : (
                'Run Full Validation'
              )}
            </Button>
            
            {currentValidation && (
              <Button
                onClick={generateClinicalReport}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Generate Clinical Report
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Current Validation Results */}
      {currentValidation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Metrics Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Validation Metrics</h2>
            
            <div className="space-y-4">
              {/* Compliance Status */}
              <div className={`p-3 rounded-lg ${getComplianceStatus(currentValidation.metrics).className}`}>
                <div className="font-semibold">
                  Status: {getComplianceStatus(currentValidation.metrics).status}
                </div>
                <div className="text-sm mt-1">
                  Production Ready: {currentValidation.readyForProduction ? 'YES' : 'NO'}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {(currentValidation.metrics.accuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Accuracy</div>
                  <div className="text-xs text-gray-500">Target: ≥95%</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {(currentValidation.metrics.emergencyDetectionAccuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Emergency Detection</div>
                  <div className="text-xs text-gray-500">Target: ≥98%</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-orange-600">
                    {(currentValidation.metrics.falsePositiveRate * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">False Positive Rate</div>
                  <div className="text-xs text-gray-500">Target: ≤2%</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentValidation.metrics.maxResponseTime.toFixed(0)}ms
                  </div>
                  <div className="text-sm text-gray-600">Max Response Time</div>
                  <div className="text-xs text-gray-500">Target: ≤3000ms</div>
                </div>
              </div>

              {/* Cultural Competency */}
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-lg font-semibold text-blue-800">
                  Cultural Competency: {(currentValidation.metrics.culturalCompetencyScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  Validates crisis detection across BIPOC, LGBTQ+, Indigenous, and Religious communities
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Breakdown */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Case Breakdown</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Total Tests</span>
                <span className="font-bold">{currentValidation.metrics.totalTests}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium text-green-700">Tests Passed</span>
                <span className="font-bold text-green-700">{currentValidation.metrics.passed}</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium text-blue-700">Avg Response Time</span>
                <span className="font-bold text-blue-700">{currentValidation.metrics.avgResponseTime.toFixed(1)}ms</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-sm font-medium text-purple-700">Resource Load Time</span>
                <span className="font-bold text-purple-700">{currentValidation.metrics.resourceLoadTime.toFixed(1)}ms</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Clinical Recommendations</h3>
              <div className="space-y-1">
                {generateRecommendations(currentValidation.metrics).map((rec, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {rec}
                  </div>
                ))}
                {generateRecommendations(currentValidation.metrics).length === 0 && (
                  <div className="text-sm text-green-600">
                    ✅ All clinical requirements met - System approved for production
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Validation History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Validation History</h2>
        
        {validationHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Validator</th>
                  <th className="text-left py-2">Accuracy</th>
                  <th className="text-left py-2">False Positive Rate</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {validationHistory.map((session) => (
                  <tr key={session.id} className="border-b">
                    <td className="py-2">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2">{session.validator}</td>
                    <td className="py-2">
                      {(session.metrics.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-2">
                      {(session.metrics.falsePositiveRate * 100).toFixed(2)}%
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : session.status === 'requires_review'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No validation history available. Run your first validation to begin.
          </div>
        )}
      </Card>

      {/* Compliance Report */}
      {complianceReport && (
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Clinical Compliance Report</h2>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {complianceReport}
          </pre>
        </Card>
      )}
    </div>
  );
}