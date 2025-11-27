/**
 * ALCHM Launch Readiness Dashboard
 * 
 * Comprehensive dashboard for monitoring and validating all critical business
 * infrastructure systems before app store submission.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { launchReadinessAutomationSuite, LaunchReadinessReport, LaunchReadinessCheck } from '@/lib/launch-readiness/automation-suite';

interface LaunchReadinessDashboardProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function LaunchReadinessDashboard({ 
  autoRefresh = false, 
  refreshInterval = 300000 // 5 minutes
}: LaunchReadinessDashboardProps) {
  const [report, setReport] = useState<LaunchReadinessReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(runValidation, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const runValidation = async () => {
    setLoading(true);
    try {
      const validationReport = await launchReadinessAutomationSuite.runLaunchReadinessValidation();
      setReport(validationReport);
      setLastRun(new Date());
    } catch (error) {
      console.error('Launch readiness validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-100';
      case 'not_ready': return 'text-red-600 bg-red-100';
      case 'passed': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
      case 'passed':
        return '✅';
      case 'needs_attention':
      case 'warning':
        return '⚠️';
      case 'not_ready':
      case 'failed':
        return '❌';
      case 'running':
        return '🔄';
      default:
        return '⏳';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Launch Readiness Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive validation of all critical business infrastructure systems
            </p>
            {lastRun && (
              <p className="text-xs text-gray-500 mt-1">
                Last validation: {lastRun.toLocaleString()}
              </p>
            )}
          </div>
          <Button
            onClick={runValidation}
            disabled={loading}
            className="bg-[#a4b792] hover:bg-[#96a085] text-white"
          >
            {loading ? 'Running...' : 'Run Validation'}
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      {report && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{getStatusIcon(report.overall.status)}</div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">
                  Overall Status: {report.overall.status.replace('_', ' ').toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600">
                  Score: {report.overall.score}/100 • Duration: {(report.overall.totalDuration / 1000).toFixed(1)}s
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(report.overall.status)}`}>
              {report.overall.status === 'ready' ? '🚀 Ready for Launch' :
               report.overall.status === 'needs_attention' ? '⚠️ Needs Attention' :
               '🚫 Not Ready'}
            </div>
          </div>

          {/* Progress bars for each category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(report.categories).map(([category, data]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{category}</span>
                  <span>{data.passed}/{data.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.score >= 90 ? 'bg-green-500' :
                      data.score >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">{data.score}% complete</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navigation Tabs */}
      {report && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'System Overview' },
            { id: 'details', label: 'Detailed Results' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-[#a4b792] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content Tabs */}
      {report && (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['critical', 'important', 'recommended'].map((category) => {
                const checks = report.checks.filter(c => c.category === category);
                return (
                  <Card key={category} className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                      {category} Systems ({checks.filter(c => c.status === 'passed').length}/{checks.length})
                    </h3>
                    <div className="space-y-3">
                      {checks.map((check) => (
                        <div key={check.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getStatusIcon(check.status)}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{check.name}</p>
                              <p className="text-xs text-gray-500">{check.description}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                            {check.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {report.checks.map((check) => (
                <Card key={check.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(check.status)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{check.name}</h3>
                        <p className="text-sm text-gray-600">{check.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(check.status)}`}>
                        {check.status}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(check.category)}`}>
                        {check.category}
                      </div>
                    </div>
                  </div>

                  {check.result && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Score: {check.result.score}/100</span>
                        <span>Duration: {check.result.duration}ms</span>
                        <span>Completed: {check.result.timestamp.toLocaleTimeString()}</span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-2">Result:</p>
                        <p className="text-sm text-gray-700">{check.result.message}</p>
                      </div>

                      {check.result.details.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Details:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {check.result.details.map((detail, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-[#a4b792] mt-1">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {check.result.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Recommendations:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {check.result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-orange-500 mt-1">⚠️</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {/* Blockers */}
              {report.blockers.length > 0 && (
                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-lg font-medium text-red-900 mb-4">🚫 Critical Blockers</h3>
                  <div className="space-y-2">
                    {report.blockers.map((blocker, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-red-600 mt-1">❌</span>
                        <span className="text-sm text-red-800">{blocker}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Next Steps */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Next Steps</h3>
                <div className="space-y-2">
                  {report.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-[#a4b792] mt-1">•</span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommendations */}
              {report.recommendations.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">💡 Recommendations</h3>
                  <div className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-600 mt-1">⚠️</span>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!report && !loading && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ready for Launch Validation</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Run a comprehensive validation to check all critical business infrastructure systems
            and ensure ALCHM is ready for app store submission.
          </p>
          <Button
            onClick={runValidation}
            className="bg-[#a4b792] hover:bg-[#96a085] text-white"
          >
            Start Launch Readiness Check
          </Button>
        </Card>
      )}
    </div>
  );
}