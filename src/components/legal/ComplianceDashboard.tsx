'use client';

/**
 * ALCHM Admin Compliance Dashboard
 * Comprehensive compliance monitoring and reporting for legal team
 * Real-time compliance status, alerts, and audit trail
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { complianceChecker } from '../../lib/legal/compliance-checker';
import { legalUpdatesMonitor } from '../../lib/legal/legal-updates-monitor';
import { legalDocumentGenerator } from '../../lib/legal/dynamic-legal-document-generator';

interface ComplianceMetrics {
  overallScore: number;
  gdprScore: number;
  ccpaScore: number;
  coppaScore: number;
  criticalViolations: number;
  highRiskIssues: number;
  pendingActions: number;
  lastAuditDate: string;
  nextAuditDue: string;
  complianceStatus: 'compliant' | 'at_risk' | 'non_compliant';
}

interface AlertSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  recentAlerts: Array<{
    id: string;
    title: string;
    severity: string;
    createdAt: string;
    status: string;
  }>;
}

interface LegalUpdateSummary {
  totalUpdates: number;
  pendingImplementation: number;
  overdueActions: number;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    deadline: string;
    urgency: string;
  }>;
}

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audits' | 'alerts' | 'updates' | 'reports' | 'settings'>('overview');
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics | null>(null);
  const [alertSummary, setAlertSummary] = useState<AlertSummary | null>(null);
  const [legalUpdateSummary, setLegalUpdateSummary] = useState<LegalUpdateSummary | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load compliance metrics
      const complianceStatus = await complianceChecker.getComplianceStatus();
      const legalStatus = legalUpdatesMonitor.getComplianceStatus();
      
      setComplianceMetrics({
        overallScore: complianceStatus.overallScore,
        gdprScore: 85, // Mock values - would come from detailed audit
        ccpaScore: 78,
        coppaScore: 92,
        criticalViolations: complianceStatus.criticalViolations,
        highRiskIssues: legalStatus.activeUpdates,
        pendingActions: legalStatus.pendingActions,
        lastAuditDate: complianceStatus.lastAuditDate || new Date().toISOString(),
        nextAuditDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        complianceStatus: legalStatus.overallStatus
      });

      // Load alert summary
      setAlertSummary({
        critical: legalStatus.criticalAlerts,
        high: 3,
        medium: 7,
        low: 12,
        total: legalStatus.criticalAlerts + 22,
        recentAlerts: [
          {
            id: 'alert_1',
            title: 'GDPR Article 22 Update Required',
            severity: 'high',
            createdAt: new Date().toISOString(),
            status: 'open'
          },
          {
            id: 'alert_2',
            title: 'COPPA Compliance Review Due',
            severity: 'medium',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress'
          }
        ]
      });

      // Load legal update summary
      setLegalUpdateSummary({
        totalUpdates: legalStatus.activeUpdates + 5,
        pendingImplementation: legalStatus.activeUpdates,
        overdueActions: 1,
        upcomingDeadlines: [
          {
            id: 'deadline_1',
            title: 'GDPR AI Transparency Updates',
            deadline: legalStatus.nextDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'high'
          },
          {
            id: 'deadline_2',
            title: 'CCPA Privacy Policy Review',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'medium'
          }
        ]
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const runComplianceAudit = async () => {
    setIsRunningAudit(true);
    try {
      const results = await complianceChecker.performFullComplianceAudit();
      setAuditResults(results);
      await loadDashboardData(); // Refresh metrics
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const generateComplianceReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      complianceMetrics,
      alertSummary,
      legalUpdateSummary,
      auditResults
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alchm-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'at_risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'non_compliant': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!complianceMetrics || !alertSummary || !legalUpdateSummary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading compliance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">Legal Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor regulatory compliance, legal updates, and audit status</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={runComplianceAudit}
            disabled={isRunningAudit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunningAudit ? '🔍 Running Audit...' : '🔍 Run Compliance Audit'}
          </Button>
          <Button onClick={generateComplianceReport} variant="outline">
            📊 Generate Report
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={`border-2 ${getStatusColor(complianceMetrics.complianceStatus)}`}>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-medium">{complianceMetrics.overallScore}%</div>
              <div className="text-sm font-medium uppercase tracking-wide">
                Overall Compliance
              </div>
              <div className={`text-xs mt-1 px-2 py-1 rounded ${getStatusColor(complianceMetrics.complianceStatus)}`}>
                {complianceMetrics.complianceStatus.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-medium text-red-600">{complianceMetrics.criticalViolations}</div>
              <div className="text-sm font-medium text-gray-700">Critical Violations</div>
              <div className="text-xs text-gray-500 mt-1">Immediate action required</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-medium text-yellow-600">{alertSummary.total}</div>
              <div className="text-sm font-medium text-gray-700">Active Alerts</div>
              <div className="text-xs text-gray-500 mt-1">{alertSummary.critical} critical, {alertSummary.high} high</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-medium text-blue-600">{complianceMetrics.pendingActions}</div>
              <div className="text-sm font-medium text-gray-700">Pending Actions</div>
              <div className="text-xs text-gray-500 mt-1">Across all regulations</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'audits', label: 'Audits', icon: '🔍' },
          { id: 'alerts', label: 'Alerts', icon: '🚨' },
          { id: 'updates', label: 'Legal Updates', icon: '📋' },
          { id: 'reports', label: 'Reports', icon: '📄' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regulation Compliance Scores */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Compliance by Regulation</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">GDPR (EU)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${complianceMetrics.gdprScore}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{complianceMetrics.gdprScore}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">CCPA (California)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${complianceMetrics.ccpaScore}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{complianceMetrics.ccpaScore}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">COPPA (Children)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${complianceMetrics.coppaScore}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{complianceMetrics.coppaScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Recent Alerts</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertSummary.recentAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{alert.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Upcoming Deadlines</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {legalUpdateSummary.upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{deadline.title}</div>
                      <div className="text-sm text-gray-600">
                        Due: {new Date(deadline.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(deadline.urgency)}`}>
                      {deadline.urgency.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => setActiveTab('audits')} className="w-full" variant="outline">
                🔍 View Detailed Audit Results
              </Button>
              <Button onClick={() => setActiveTab('alerts')} className="w-full" variant="outline">
                🚨 Manage Active Alerts
              </Button>
              <Button onClick={() => setActiveTab('updates')} className="w-full" variant="outline">
                📋 Review Legal Updates
              </Button>
              <Button onClick={generateComplianceReport} className="w-full" variant="outline">
                📊 Export Compliance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === 'audits' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Compliance Audits</h3>
                <Button onClick={runComplianceAudit} disabled={isRunningAudit}>
                  {isRunningAudit ? 'Running...' : 'Run New Audit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {auditResults ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-medium text-blue-600">{auditResults.gdpr.score}%</div>
                      <div className="text-sm text-gray-600">GDPR Compliance</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-medium text-blue-600">{auditResults.ccpa.score}%</div>
                      <div className="text-sm text-gray-600">CCPA Compliance</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-medium text-blue-600">{auditResults.coppa.score}%</div>
                      <div className="text-sm text-gray-600">COPPA Compliance</div>
                    </div>
                  </div>

                  {/* Violations */}
                  {auditResults.gdpr.violations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Critical Violations</h4>
                      <div className="space-y-2">
                        {auditResults.gdpr.violations.map((violation: any) => (
                          <div key={violation.id} className="p-3 border-l-4 border-red-500 bg-red-50">
                            <div className="font-medium text-red-800">{violation.requirement}</div>
                            <div className="text-sm text-red-700">{violation.description}</div>
                            <div className="text-xs text-red-600 mt-1">
                              Due: {new Date(violation.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No recent audit results available.</p>
                  <Button onClick={runComplianceAudit} disabled={isRunningAudit}>
                    Run Compliance Audit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Active Compliance Alerts</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-xl font-medium text-red-700">{alertSummary.critical}</div>
                  <div className="text-sm text-red-600">Critical</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xl font-medium text-yellow-700">{alertSummary.high}</div>
                  <div className="text-sm text-yellow-600">High</div>
                </div>
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xl font-medium text-blue-700">{alertSummary.medium}</div>
                  <div className="text-sm text-blue-600">Medium</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-xl font-medium text-gray-700">{alertSummary.low}</div>
                  <div className="text-sm text-gray-600">Low</div>
                </div>
              </div>

              <div className="space-y-3">
                {alertSummary.recentAlerts.map(alert => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Created: {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legal Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Legal Updates & Requirements</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-medium">{legalUpdateSummary.totalUpdates}</div>
                  <div className="text-sm text-gray-600">Total Updates</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-medium text-yellow-600">{legalUpdateSummary.pendingImplementation}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-xl font-medium text-red-600">{legalUpdateSummary.overdueActions}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>

              <div className="space-y-3">
                {legalUpdateSummary.upcomingDeadlines.map(update => (
                  <div key={update.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{update.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Deadline: {new Date(update.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(update.urgency)}`}>
                          {update.urgency.toUpperCase()}
                        </span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Compliance Reports</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={generateComplianceReport} className="w-full">
                  📊 Generate Full Compliance Report
                </Button>
                <Button variant="outline" className="w-full">
                  📋 Export Audit Trail
                </Button>
                <Button variant="outline" className="w-full">
                  📄 Generate Legal Update Summary
                </Button>
                <Button variant="outline" className="w-full">
                  🔍 Create Regulatory Filing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Compliance Monitoring Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Audit Schedule</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Daily compliance checks</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Weekly comprehensive audits</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Monthly legal update reviews</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Alert Notifications</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Email alerts for critical issues</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Slack notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>SMS for emergency violations</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}