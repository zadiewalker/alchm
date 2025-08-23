'use client';

import React, { useState, useEffect } from 'react';

interface ComplianceMetrics {
  totalUsers: number;
  totalEntries: number;
  encryptionStatus: {
    encrypted: number;
    unencrypted: number;
    percentage: number;
  };
  piiProtection: {
    totalPIIDetected: number;
    totalPIIRedacted: number;
    riskLevels: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  complianceFrameworks: {
    ferpa: {
      compliant: number;
      violations: number;
      status: 'compliant' | 'warning' | 'violation';
    };
    coppa: {
      compliant: number;
      violations: number;
      status: 'compliant' | 'warning' | 'violation';
    };
    gdpr: {
      compliant: number;
      violations: number;
      status: 'compliant' | 'warning' | 'violation';
    };
  };
  auditTrail: AuditEvent[];
  securityIncidents: SecurityIncident[];
}

interface AuditEvent {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  compliance: string[];
}

interface SecurityIncident {
  id: string;
  timestamp: Date;
  type: 'pii_exposure' | 'encryption_failure' | 'unauthorized_access' | 'session_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  affectedUsers: number;
}

export default function ComplianceDashboard({ userRole }: { userRole: 'admin' | 'privacy_officer' | 'school_official' }) {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'incidents' | 'policies'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchComplianceMetrics();
  }, [timeRange]);

  const fetchComplianceMetrics = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/compliance/metrics?range=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch compliance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compliance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ALCHM Compliance Dashboard</h1>
              <p className="text-gray-600">Privacy & Security Monitoring for Educational Technology</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {userRole === 'admin' ? 'Administrator' : 
                 userRole === 'privacy_officer' ? 'Privacy Officer' : 
                 'School Official'}
              </span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'audit', 'incidents', 'policies'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab metrics={metrics} />}
        {activeTab === 'audit' && <AuditTab metrics={metrics} />}
        {activeTab === 'incidents' && <IncidentsTab metrics={metrics} />}
        {activeTab === 'policies' && <PoliciesTab />}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ metrics }: { metrics: ComplianceMetrics | null }) {
  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Compliance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ComplianceCard
          title="FERPA Compliance"
          status={metrics.complianceFrameworks.ferpa.status}
          percentage={95}
          description="Educational Records Protection"
          violations={metrics.complianceFrameworks.ferpa.violations}
        />
        <ComplianceCard
          title="COPPA Compliance"
          status={metrics.complianceFrameworks.coppa.status}
          percentage={98}
          description="Children's Privacy Protection"
          violations={metrics.complianceFrameworks.coppa.violations}
        />
        <ComplianceCard
          title="GDPR Compliance"
          status={metrics.complianceFrameworks.gdpr.status}
          percentage={92}
          description="General Data Protection"
          violations={metrics.complianceFrameworks.gdpr.violations}
        />
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Encryption Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Encrypted Entries</span>
              <span className="font-semibold text-green-600">
                {metrics.encryptionStatus.encrypted.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${metrics.encryptionStatus.percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              {metrics.encryptionStatus.percentage}% of all journal entries are encrypted
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PII Protection</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.piiProtection.totalPIIDetected}
                </div>
                <div className="text-sm text-gray-500">PII Items Detected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.piiProtection.totalPIIRedacted}
                </div>
                <div className="text-sm text-gray-500">PII Items Redacted</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Risk Level Distribution</div>
              {Object.entries(metrics.piiProtection.riskLevels).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className={`capitalize text-sm ${
                    level === 'critical' ? 'text-red-600' :
                    level === 'high' ? 'text-orange-600' :
                    level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {level}
                  </span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{metrics.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{metrics.totalEntries.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{metrics.auditTrail.length}</div>
            <div className="text-sm text-gray-500">Audit Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{metrics.securityIncidents.length}</div>
            <div className="text-sm text-gray-500">Security Incidents</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compliance Card Component
function ComplianceCard({ 
  title, 
  status, 
  percentage, 
  description, 
  violations 
}: { 
  title: string;
  status: 'compliant' | 'warning' | 'violation';
  percentage: number;
  description: string;
  violations: number;
}) {
  const statusColors = {
    compliant: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    violation: 'bg-red-50 text-red-800 border-red-200'
  };

  const statusIcons = {
    compliant: '✓',
    warning: '⚠',
    violation: '✗'
  };

  return (
    <div className={`rounded-lg border p-6 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-2xl">{statusIcons[status]}</span>
      </div>
      <p className="text-sm opacity-75 mb-4">{description}</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Compliance Rate</span>
          <span className="font-semibold">{percentage}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
          <div 
            className="bg-current h-2 rounded-full opacity-75"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {violations > 0 && (
          <div className="text-sm">
            <span className="font-medium">{violations}</span> violations need attention
          </div>
        )}
      </div>
    </div>
  );
}

// Audit Tab Component
function AuditTab({ metrics }: { metrics: ComplianceMetrics | null }) {
  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
        <p className="text-gray-600">Detailed log of all privacy and security events</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compliance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.auditTrail.slice(0, 50).map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.timestamp.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                    event.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    event.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.compliance.join(', ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {event.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Incidents Tab Component
function IncidentsTab({ metrics }: { metrics: ComplianceMetrics | null }) {
  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Incidents</h3>
        
        {metrics.securityIncidents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Security Incidents</h4>
            <p className="text-gray-600">All systems are operating securely with no reported incidents.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.securityIncidents.map((incident) => (
              <div key={incident.id} className={`border rounded-lg p-4 ${
                incident.severity === 'critical' ? 'border-red-300 bg-red-50' :
                incident.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                incident.severity === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                'border-blue-300 bg-blue-50'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {incident.type.replace('_', ' ')}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    incident.resolved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {incident.resolved ? 'Resolved' : 'Active'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{incident.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{incident.timestamp.toLocaleString()}</span>
                  <span>{incident.affectedUsers} users affected</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Policies Tab Component
function PoliciesTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Policies & Documentation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Required Policies</h4>
            <div className="space-y-2">
              <PolicyLink 
                title="Privacy Policy" 
                status="current" 
                lastUpdated="2025-01-15"
                url="/policies/privacy-policy"
              />
              <PolicyLink 
                title="FERPA Notice" 
                status="current" 
                lastUpdated="2025-01-15"
                url="/policies/ferpa-notice"
              />
              <PolicyLink 
                title="COPPA Notice" 
                status="current" 
                lastUpdated="2025-01-15"
                url="/policies/coppa-notice"
              />
              <PolicyLink 
                title="Terms of Service" 
                status="review_needed" 
                lastUpdated="2024-12-01"
                url="/policies/terms"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Compliance Documentation</h4>
            <div className="space-y-2">
              <PolicyLink 
                title="Data Processing Agreement" 
                status="current" 
                lastUpdated="2025-01-10"
                url="/compliance/dpa"
              />
              <PolicyLink 
                title="Security Assessment" 
                status="current" 
                lastUpdated="2025-01-05"
                url="/compliance/security"
              />
              <PolicyLink 
                title="Incident Response Plan" 
                status="current" 
                lastUpdated="2024-12-15"
                url="/compliance/incident-response"
              />
              <PolicyLink 
                title="Staff Training Records" 
                status="current" 
                lastUpdated="2025-01-01"
                url="/compliance/training"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Policy Link Component
function PolicyLink({ 
  title, 
  status, 
  lastUpdated, 
  url 
}: { 
  title: string;
  status: 'current' | 'review_needed' | 'outdated';
  lastUpdated: string;
  url: string;
}) {
  const statusColors = {
    current: 'bg-green-100 text-green-800',
    review_needed: 'bg-yellow-100 text-yellow-800',
    outdated: 'bg-red-100 text-red-800'
  };

  const statusText = {
    current: 'Current',
    review_needed: 'Review Needed',
    outdated: 'Outdated'
  };

  return (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div>
        <h5 className="font-medium text-gray-900">{title}</h5>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
          {statusText[status]}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View →
        </a>
      </div>
    </div>
  );
}