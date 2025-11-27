/**
 * Security Audit Dashboard - Real-time monitoring for HIPAA compliance
 * Provides comprehensive security oversight for vulnerable youth populations
 * 
 * This component integrates all security testing systems for real-time
 * monitoring and compliance validation across HIPAA, COPPA, GDPR regulations.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HIPAAComplianceAuditor from '@/security/hipaa-compliance-auditor';
import EncryptionValidator from '@/security/encryption-validator';
import AccessControlTester from '@/security/access-control-tester';
import AuditLogValidator from '@/security/audit-log-validator';
import DataBreachDetector from '@/security/data-breach-detector';
import ConsentManagementValidator from '@/security/consent-management-validator';
import DataRetentionTester from '@/security/data-retention-tester';

interface SecurityMetrics {
  overallCompliance: number;
  hipaaCompliance: number;
  coppaCompliance: number;
  gdprCompliance: number;
  encryptionStatus: number;
  accessControlStatus: number;
  auditLogIntegrity: number;
  breachDetectionActive: boolean;
  consentManagementScore: number;
  dataRetentionCompliance: number;
  lastAuditTimestamp: Date;
  criticalIssues: number;
  activeThreats: number;
  pendingRemediation: number;
}

interface ComplianceAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'HIPAA_VIOLATION' | 'COPPA_VIOLATION' | 'GDPR_VIOLATION' | 'BREACH_DETECTED' | 'AUDIT_FAILURE' | 'CONSENT_ISSUE' | 'RETENTION_VIOLATION';
  message: string;
  timestamp: Date;
  affected: string[];
  action: string;
  resolved: boolean;
}

interface AuditReport {
  id: string;
  type: 'COMPREHENSIVE' | 'HIPAA_FOCUSED' | 'MINOR_PROTECTION' | 'BREACH_INVESTIGATION';
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  startTime: Date;
  completionTime?: Date;
  findings: ReportFinding[];
  recommendations: string[];
}

interface ReportFinding {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  evidence: string;
  remediation: string;
  deadline: Date;
}

export default function SecurityAuditDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    overallCompliance: 0,
    hipaaCompliance: 0,
    coppaCompliance: 0,
    gdprCompliance: 0,
    encryptionStatus: 0,
    accessControlStatus: 0,
    auditLogIntegrity: 0,
    breachDetectionActive: false,
    consentManagementScore: 0,
    dataRetentionCompliance: 0,
    lastAuditTimestamp: new Date(),
    criticalIssues: 0,
    activeThreats: 0,
    pendingRemediation: 0
  });

  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [activeReports, setActiveReports] = useState<AuditReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize security systems
  const [hipaaAuditor] = useState(() => new HIPAAComplianceAuditor());
  const [encryptionValidator] = useState(() => new EncryptionValidator());
  const [accessControlTester] = useState(() => new AccessControlTester());
  const [auditLogValidator] = useState(() => new AuditLogValidator());
  const [breachDetector] = useState(() => new DataBreachDetector());
  const [consentValidator] = useState(() => new ConsentManagementValidator());
  const [retentionTester] = useState(() => new DataRetentionTester());

  /**
   * Run comprehensive security audit across all systems
   */
  const runComprehensiveAudit = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log('🔒 Starting comprehensive security audit...');
      
      const auditReport: AuditReport = {
        id: `audit_${Date.now()}`,
        type: 'COMPREHENSIVE',
        status: 'RUNNING',
        progress: 0,
        startTime: new Date(),
        findings: [],
        recommendations: []
      };
      
      setActiveReports(prev => [...prev, auditReport]);

      // HIPAA Compliance Audit
      auditReport.progress = 10;
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? { ...auditReport } : r));
      
      const hipaaResult = await hipaaAuditor.performComprehensiveAudit({
        journalEntries: [],
        therapistNotes: [],
        crisisData: [],
        assessments: []
      });

      // Encryption Validation
      auditReport.progress = 25;
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? { ...auditReport } : r));
      
      const encryptionResult = await encryptionValidator.validatePHIEncryption({
        journalEntries: [],
        therapistNotes: [],
        crisisData: [],
        assessments: []
      });

      // Access Control Testing
      auditReport.progress = 40;
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? { ...auditReport } : r));
      
      const accessResult = await accessControlTester.performAccessControlAudit();

      // Audit Log Validation
      auditReport.progress = 55;
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? { ...auditReport } : r));
      
      const auditLogResult = await auditLogValidator.validateAuditLogs();

      // Consent Management Validation
      auditReport.progress = 70;
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? { ...auditReport } : r));
      
      const consentResult = await consentValidator.validateConsentManagement();

      // Data Retention Testing
      auditReport.progress = 85;
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? { ...auditReport } : r));
      
      const retentionResult = await retentionTester.performDataRetentionAudit();

      // Update metrics based on results
      const newMetrics: SecurityMetrics = {
        overallCompliance: Math.min(
          hipaaResult.riskScore,
          encryptionResult.complianceScore,
          accessResult.complianceScore,
          consentResult.complianceScore,
          retentionResult.complianceScore
        ),
        hipaaCompliance: hipaaResult.riskScore,
        coppaCompliance: consentResult.coppaCompliant ? 100 : 70,
        gdprCompliance: consentResult.gdprCompliant ? 100 : 70,
        encryptionStatus: encryptionResult.complianceScore,
        accessControlStatus: accessResult.complianceScore,
        auditLogIntegrity: auditLogResult.integrityScore,
        breachDetectionActive: true,
        consentManagementScore: consentResult.complianceScore,
        dataRetentionCompliance: retentionResult.complianceScore,
        lastAuditTimestamp: new Date(),
        criticalIssues: [
          ...hipaaResult.criticalViolations,
          ...encryptionResult.criticalIssues,
          ...accessResult.criticalViolations,
          ...consentResult.criticalIssues,
          ...retentionResult.criticalViolations
        ].length,
        activeThreats: 0, // Would be populated by breach detector
        pendingRemediation: 0
      };

      // Create alerts for critical issues
      const newAlerts: ComplianceAlert[] = [];
      
      if (!hipaaResult.overallCompliant) {
        newAlerts.push({
          id: `alert_hipaa_${Date.now()}`,
          severity: 'CRITICAL',
          type: 'HIPAA_VIOLATION',
          message: 'HIPAA compliance violations detected',
          timestamp: new Date(),
          affected: ['PHI_DATA'],
          action: 'Immediate remediation required',
          resolved: false
        });
      }

      if (!consentResult.coppaCompliant) {
        newAlerts.push({
          id: `alert_coppa_${Date.now()}`,
          severity: 'CRITICAL',
          type: 'COPPA_VIOLATION',
          message: 'COPPA compliance violations for minors detected',
          timestamp: new Date(),
          affected: ['MINOR_DATA'],
          action: 'Review minor consent processes',
          resolved: false
        });
      }

      if (encryptionResult.criticalIssues.length > 0) {
        newAlerts.push({
          id: `alert_encryption_${Date.now()}`,
          severity: 'HIGH',
          type: 'HIPAA_VIOLATION',
          message: 'PHI encryption issues detected',
          timestamp: new Date(),
          affected: ['ENCRYPTION'],
          action: 'Fix encryption vulnerabilities',
          resolved: false
        });
      }

      // Complete audit report
      auditReport.progress = 100;
      auditReport.status = 'COMPLETED';
      auditReport.completionTime = new Date();
      auditReport.findings = [
        ...hipaaResult.criticalViolations.map(v => ({
          category: 'HIPAA_COMPLIANCE',
          severity: 'CRITICAL' as const,
          description: v,
          evidence: 'Audit log analysis',
          remediation: 'Implement HIPAA security controls',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })),
        ...encryptionResult.criticalIssues.map(issue => ({
          category: 'ENCRYPTION',
          severity: 'HIGH' as const,
          description: issue,
          evidence: 'Encryption validation test',
          remediation: 'Implement AES-256 encryption',
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }))
      ];
      
      auditReport.recommendations = [
        ...hipaaResult.recommendations,
        ...encryptionResult.recommendations,
        ...accessResult.recommendations,
        ...consentResult.recommendations,
        ...retentionResult.recommendations
      ];

      setMetrics(newMetrics);
      setAlerts(prev => [...prev, ...newAlerts]);
      setActiveReports(prev => prev.map(r => r.id === auditReport.id ? auditReport : r));
      setLastUpdate(new Date());

      console.log('✅ Comprehensive security audit completed');

    } catch (error) {
      console.error('❌ Security audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hipaaAuditor, encryptionValidator, accessControlTester, auditLogValidator, consentValidator, retentionTester]);

  /**
   * Run emergency security scan for critical issues
   */
  const runEmergencySecurityScan = useCallback(async () => {
    console.log('🚨 Running emergency security scan...');
    
    // Quick scan for critical vulnerabilities
    const emergencyChecks = await Promise.all([
      // Check for immediate PHI exposure
      encryptionValidator.validatePHIEncryption({ journalEntries: [], therapistNotes: [], crisisData: [], assessments: [] }),
      
      // Check for active breaches
      breachDetector.analyzeBreachIndicator('system_change', {
        ipAddress: '127.0.0.1',
        userAgent: 'SecurityScan',
        action: 'emergency_scan',
        timestamp: new Date(),
        success: true
      }),
      
      // Check audit log integrity
      auditLogValidator.validateAuditLogs()
    ]);

    const [encryptionStatus, breachStatus, auditStatus] = emergencyChecks;

    if (encryptionStatus.criticalIssues.length > 0 || 
        breachStatus.breachDetected || 
        !auditStatus.valid) {
      
      const emergencyAlert: ComplianceAlert = {
        id: `emergency_${Date.now()}`,
        severity: 'CRITICAL',
        type: 'BREACH_DETECTED',
        message: 'Emergency security issues detected - immediate action required',
        timestamp: new Date(),
        affected: ['SYSTEM_WIDE'],
        action: 'Contact security team immediately',
        resolved: false
      };
      
      setAlerts(prev => [emergencyAlert, ...prev]);
    }
  }, [encryptionValidator, breachDetector, auditLogValidator]);

  /**
   * Export compliance report
   */
  const exportComplianceReport = useCallback(async (reportType: 'HIPAA' | 'COPPA' | 'GDPR' | 'COMPREHENSIVE') => {
    console.log(`📊 Exporting ${reportType} compliance report...`);
    
    const reportData = {
      type: reportType,
      timestamp: new Date(),
      metrics,
      alerts: alerts.filter(a => !a.resolved),
      findings: activeReports.flatMap(r => r.findings),
      recommendations: activeReports.flatMap(r => r.recommendations)
    };

    // In production, this would generate and download a PDF report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_compliance_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [metrics, alerts, activeReports]);

  // Initialize dashboard
  useEffect(() => {
    runComprehensiveAudit();
  }, [runComprehensiveAudit]);

  // Real-time monitoring setup
  useEffect(() => {
    const interval = setInterval(() => {
      // Run periodic emergency scans
      runEmergencySecurityScan();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [runEmergencySecurityScan]);

  const getComplianceStatus = (score: number) => {
    if (score >= 95) return { status: 'COMPLIANT', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80) return { status: 'WARNING', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'NON_COMPLIANT', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-700 bg-red-100';
      case 'HIGH': return 'text-orange-700 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
      case 'LOW': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">
                Security Audit Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time HIPAA compliance monitoring for vulnerable youth protection
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button 
                onClick={runComprehensiveAudit} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Running Audit...' : 'Run Full Audit'}
              </Button>
              <Button 
                onClick={runEmergencySecurityScan}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Emergency Scan
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Overall Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-medium text-gray-900">
                  {metrics.overallCompliance.toFixed(1)}%
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  getComplianceStatus(metrics.overallCompliance).color
                } ${getComplianceStatus(metrics.overallCompliance).bg}`}>
                  {getComplianceStatus(metrics.overallCompliance).status}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Critical Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`text-3xl font-medium ${
                  metrics.criticalIssues > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {metrics.criticalIssues}
                </div>
                {metrics.criticalIssues > 0 && (
                  <div className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                    URGENT
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`text-3xl font-medium ${
                  metrics.activeThreats > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {metrics.activeThreats}
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  metrics.breachDetectionActive ? 'bg-green-400' : 'bg-red-400'
                }`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-medium text-gray-900">
                {metrics.pendingRemediation}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Regulatory Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">HIPAA Compliance</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.hipaaCompliance.toFixed(1)}%</span>
                    <div className={`px-2 py-1 rounded text-xs ${
                      getComplianceStatus(metrics.hipaaCompliance).color
                    } ${getComplianceStatus(metrics.hipaaCompliance).bg}`}>
                      {getComplianceStatus(metrics.hipaaCompliance).status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">COPPA Compliance</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.coppaCompliance.toFixed(1)}%</span>
                    <div className={`px-2 py-1 rounded text-xs ${
                      getComplianceStatus(metrics.coppaCompliance).color
                    } ${getComplianceStatus(metrics.coppaCompliance).bg}`}>
                      {getComplianceStatus(metrics.coppaCompliance).status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">GDPR Compliance</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.gdprCompliance.toFixed(1)}%</span>
                    <div className={`px-2 py-1 rounded text-xs ${
                      getComplianceStatus(metrics.gdprCompliance).color
                    } ${getComplianceStatus(metrics.gdprCompliance).bg}`}>
                      {getComplianceStatus(metrics.gdprCompliance).status}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Security Systems Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Encryption Status</span>
                  <span className={`text-sm ${
                    metrics.encryptionStatus >= 95 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.encryptionStatus.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Access Control</span>
                  <span className={`text-sm ${
                    metrics.accessControlStatus >= 95 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.accessControlStatus.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audit Log Integrity</span>
                  <span className={`text-sm ${
                    metrics.auditLogIntegrity >= 95 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.auditLogIntegrity.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Retention</span>
                  <span className={`text-sm ${
                    metrics.dataRetentionCompliance >= 95 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.dataRetentionCompliance.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Security Alerts ({alerts.filter(a => !a.resolved).length} active)
            </CardTitle>
            <Button 
              onClick={() => setAlerts(alerts.map(a => ({ ...a, resolved: true })))}
              variant="outline"
              size="sm"
            >
              Mark All Resolved
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.filter(a => !a.resolved).map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          getSeverityColor(alert.severity)
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {alert.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        Action required: {alert.action}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Affected:</span>
                        {alert.affected.map((item, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setAlerts(alerts.map(a => 
                        a.id === alert.id ? { ...a, resolved: true } : a
                      ))}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
              {alerts.filter(a => !a.resolved).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>No active security alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Audit Reports ({activeReports.filter(r => r.status !== 'COMPLETED').length} active)
            </CardTitle>
            <div className="space-x-2">
              <Button 
                onClick={() => exportComplianceReport('COMPREHENSIVE')}
                variant="outline"
                size="sm"
              >
                Export Report
              </Button>
              <Button 
                onClick={() => exportComplianceReport('HIPAA')}
                variant="outline"
                size="sm"
              >
                HIPAA Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeReports.slice(0, 5).map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{report.type.replace(/_/g, ' ')} Audit</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        report.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {report.status === 'COMPLETED' ? report.completionTime?.toLocaleString() : 
                       `${report.progress}% complete`}
                    </span>
                  </div>
                  
                  {report.status === 'RUNNING' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${report.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {report.findings.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">
                        {report.findings.length} findings
                      </p>
                      <div className="flex space-x-2">
                        {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
                          const count = report.findings.filter(f => f.severity === severity).length;
                          return count > 0 ? (
                            <span key={severity} className={`px-2 py-1 rounded text-xs ${
                              getSeverityColor(severity)
                            }`}>
                              {count} {severity}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}