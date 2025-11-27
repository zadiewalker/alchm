/**
 * HIPAA-Compliant Therapist Dashboard
 * 
 * Provides secure access to patient information and therapeutic tools
 * while maintaining strict HIPAA compliance and audit requirements
 * 
 * CRITICAL: This dashboard handles PHI and must maintain HIPAA compliance
 * All access is logged and monitored for regulatory compliance
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Activity,
  Users,
  Calendar,
  Download,
  Upload,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PHIProtectionSystem, PHIAccessRequest } from '@/lib/hipaa/phi-protection-system';
import { AuditLoggingSystem } from '@/lib/hipaa/audit-logging-system';
import { SecureMessagingSystem } from '@/lib/hipaa/secure-messaging-system';
import { BreachNotificationSystem } from '@/lib/hipaa/breach-notification-system';
import { BAAComplianceFramework } from '@/lib/hipaa/baa-compliance-framework';

// Interfaces for dashboard components
interface TherapistProfile {
  therapistId: string;
  name: string;
  licenseNumber: string;
  licenseState: string;
  specializations: string[];
  credentials: string[];
  avatar?: string;
  contactInfo: {
    email: string;
    phone: string;
    emergencyPhone: string;
  };
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  complianceStatus: 'compliant' | 'needs_attention' | 'non_compliant';
  lastTrainingDate: Date;
  nextComplianceReview: Date;
}

interface PatientRecord {
  patientId: string;
  name: string;
  dateOfBirth: Date;
  lastSessionDate?: Date;
  nextSessionDate?: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  diagnosisCodes: string[];
  treatmentPhase: 'assessment' | 'active_treatment' | 'maintenance' | 'discharge_planning';
  consentStatus: 'active' | 'expired' | 'revoked' | 'pending';
  communicationPreferences: {
    preferredMethod: 'secure_message' | 'phone' | 'video' | 'in_person';
    emergencyContact: boolean;
    appointmentReminders: boolean;
  };
  lastAccessed: Date;
  accessCount: number;
}

interface ComplianceAlert {
  alertId: string;
  type: 'consent_expiring' | 'training_due' | 'audit_required' | 'breach_detected' | 'system_update';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionRequired: boolean;
  dueDate?: Date;
  affectedPatients?: string[];
  resolveUrl?: string;
}

interface DashboardMetrics {
  totalPatients: number;
  activePatients: number;
  highRiskPatients: number;
  pendingMessages: number;
  upcomingAppointments: number;
  complianceScore: number;
  lastAuditDate: Date;
  phiAccessCount: number;
  securityIncidents: number;
}

interface HIPAAComplianceStatus {
  overallStatus: 'compliant' | 'needs_attention' | 'non_compliant';
  lastAssessment: Date;
  nextAssessment: Date;
  complianceScore: number;
  auditFindings: number;
  remediation Items: number;
  certificationStatus: 'current' | 'expiring' | 'expired';
  trainingStatus: 'current' | 'due' | 'overdue';
}

export const HIPAACompliantDashboard: React.FC = () => {
  // State management
  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile | null>(null);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [complianceStatus, setComplianceStatus] = useState<HIPAAComplianceStatus | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'messages' | 'compliance' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | 'low' | 'moderate' | 'high' | 'critical'>('all');
  const [showPHI, setShowPHI] = useState(false);
  const [auditMode, setAuditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HIPAA systems initialization
  const [phiSystem] = useState(() => new PHIProtectionSystem());
  const [auditSystem] = useState(() => new AuditLoggingSystem());
  const [messagingSystem] = useState(() => 
    new SecureMessagingSystem('encryption_key', 'signing_key', auditSystem)
  );
  const [breachSystem] = useState(() => new BreachNotificationSystem(auditSystem));
  const [baaSystem] = useState(() => new BAAComplianceFramework(auditSystem));

  // Load dashboard data with proper PHI access logging
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Log dashboard access
      await auditSystem.logEvent({
        eventType: 'phi_access',
        userId: therapistProfile?.therapistId || 'unknown',
        userRole: 'therapist',
        resourceAccessed: 'therapist_dashboard',
        actionPerformed: 'read',
        outcome: 'success',
        sourceIP: 'client_ip', // Would get from request
        userAgent: navigator.userAgent,
        sessionId: 'dashboard_session',
        purposeOfUse: 'treatment',
        dataClassification: 'confidential'
      });

      // Load therapist profile (mock data - in production, fetch from secure API)
      const mockTherapistProfile: TherapistProfile = {
        therapistId: 'THER_001',
        name: 'Dr. Sarah Johnson',
        licenseNumber: 'PSY12345',
        licenseState: 'CA',
        specializations: ['Trauma Therapy', 'EMDR', 'CBT'],
        credentials: ['PhD', 'LMFT', 'EMDR Certified'],
        contactInfo: {
          email: 'sarah.johnson@alchm.app',
          phone: '(555) 123-4567',
          emergencyPhone: '(555) 987-6543'
        },
        workingHours: {
          start: '09:00',
          end: '17:00',
          timezone: 'PST'
        },
        complianceStatus: 'compliant',
        lastTrainingDate: new Date('2024-01-15'),
        nextComplianceReview: new Date('2024-07-15')
      };

      // Load patient records with PHI protection
      const mockPatients: PatientRecord[] = [
        {
          patientId: 'PAT_001',
          name: showPHI ? 'John D.' : 'Patient 001',
          dateOfBirth: new Date('1985-03-15'),
          lastSessionDate: new Date('2024-02-20'),
          nextSessionDate: new Date('2024-02-27'),
          riskLevel: 'moderate',
          diagnosisCodes: ['F43.10', 'F41.1'],
          treatmentPhase: 'active_treatment',
          consentStatus: 'active',
          communicationPreferences: {
            preferredMethod: 'secure_message',
            emergencyContact: true,
            appointmentReminders: true
          },
          lastAccessed: new Date(),
          accessCount: 15
        },
        {
          patientId: 'PAT_002',
          name: showPHI ? 'Maria S.' : 'Patient 002',
          dateOfBirth: new Date('1992-07-22'),
          lastSessionDate: new Date('2024-02-19'),
          nextSessionDate: new Date('2024-02-26'),
          riskLevel: 'high',
          diagnosisCodes: ['F32.9', 'F43.12'],
          treatmentPhase: 'active_treatment',
          consentStatus: 'active',
          communicationPreferences: {
            preferredMethod: 'phone',
            emergencyContact: true,
            appointmentReminders: true
          },
          lastAccessed: new Date(),
          accessCount: 23
        }
      ];

      // Load compliance alerts
      const mockAlerts: ComplianceAlert[] = [
        {
          alertId: 'ALERT_001',
          type: 'training_due',
          severity: 'medium',
          title: 'HIPAA Training Due',
          description: 'Annual HIPAA training is due within 30 days',
          actionRequired: true,
          dueDate: new Date('2024-03-15'),
          resolveUrl: '/training/hipaa-annual'
        },
        {
          alertId: 'ALERT_002',
          type: 'consent_expiring',
          severity: 'high',
          title: 'Patient Consent Expiring',
          description: '3 patients have consent forms expiring this week',
          actionRequired: true,
          affectedPatients: ['PAT_003', 'PAT_004', 'PAT_005'],
          resolveUrl: '/patients/consent-renewal'
        }
      ];

      // Load dashboard metrics
      const mockMetrics: DashboardMetrics = {
        totalPatients: 45,
        activePatients: 38,
        highRiskPatients: 7,
        pendingMessages: 12,
        upcomingAppointments: 8,
        complianceScore: 92,
        lastAuditDate: new Date('2024-01-15'),
        phiAccessCount: 234,
        securityIncidents: 0
      };

      // Load compliance status
      const mockComplianceStatus: HIPAAComplianceStatus = {
        overallStatus: 'compliant',
        lastAssessment: new Date('2024-01-15'),
        nextAssessment: new Date('2024-07-15'),
        complianceScore: 92,
        auditFindings: 2,
        remediationItems: 1,
        certificationStatus: 'current',
        trainingStatus: 'current'
      };

      setTherapistProfile(mockTherapistProfile);
      setPatients(mockPatients);
      setComplianceAlerts(mockAlerts);
      setDashboardMetrics(mockMetrics);
      setComplianceStatus(mockComplianceStatus);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Log error
      await auditSystem.logEvent({
        eventType: 'system_access',
        userId: therapistProfile?.therapistId || 'unknown',
        userRole: 'therapist',
        resourceAccessed: 'therapist_dashboard',
        actionPerformed: 'read',
        outcome: 'failure',
        sourceIP: 'client_ip',
        userAgent: navigator.userAgent,
        sessionId: 'dashboard_session',
        dataClassification: 'internal',
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  }, [therapistProfile?.therapistId, showPHI, auditSystem]);

  // Handle patient selection with PHI access request
  const selectPatient = useCallback(async (patient: PatientRecord) => {
    try {
      // Create PHI access request
      const accessRequest: PHIAccessRequest = {
        requestId: `REQ_${Date.now()}`,
        therapistId: therapistProfile?.therapistId || '',
        patientId: patient.patientId,
        purposeOfUse: 'treatment',
        minimumNecessary: ['basic_info', 'session_notes', 'treatment_plan'],
        requestTimestamp: new Date(),
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
        consentStatus: patient.consentStatus === 'active' ? 'granted' : 'denied'
      };

      // Verify access
      if (accessRequest.consentStatus !== 'granted') {
        throw new Error('Patient consent required for PHI access');
      }

      // Log patient access
      await auditSystem.logEvent({
        eventType: 'phi_access',
        userId: therapistProfile?.therapistId || '',
        userRole: 'therapist',
        patientId: patient.patientId,
        resourceAccessed: 'patient_record',
        actionPerformed: 'read',
        outcome: 'success',
        sourceIP: 'client_ip',
        userAgent: navigator.userAgent,
        sessionId: 'dashboard_session',
        purposeOfUse: 'treatment',
        dataClassification: patient.riskLevel === 'critical' ? 'restricted' : 'confidential'
      });

      setSelectedPatient(patient);
      setActiveTab('patients');
    } catch (error) {
      console.error('Failed to access patient record:', error);
      
      // Log failed access
      await auditSystem.logEvent({
        eventType: 'phi_access',
        userId: therapistProfile?.therapistId || '',
        userRole: 'therapist',
        patientId: patient.patientId,
        resourceAccessed: 'patient_record',
        actionPerformed: 'read',
        outcome: 'failure',
        sourceIP: 'client_ip',
        userAgent: navigator.userAgent,
        sessionId: 'dashboard_session',
        purposeOfUse: 'treatment',
        dataClassification: 'confidential',
        errorDetails: error instanceof Error ? error.message : 'Access denied'
      });
      
      alert('Access denied: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [therapistProfile?.therapistId, auditSystem]);

  // Toggle PHI visibility with additional security
  const togglePHIVisibility = useCallback(async () => {
    try {
      const newVisibility = !showPHI;
      
      // Log PHI visibility change
      await auditSystem.logEvent({
        eventType: 'configuration_change',
        userId: therapistProfile?.therapistId || '',
        userRole: 'therapist',
        resourceAccessed: 'phi_visibility',
        actionPerformed: newVisibility ? 'show_phi' : 'hide_phi',
        outcome: 'success',
        sourceIP: 'client_ip',
        userAgent: navigator.userAgent,
        sessionId: 'dashboard_session',
        dataClassification: 'internal'
      });

      setShowPHI(newVisibility);
      
      // Reload patient data with new visibility settings
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to toggle PHI visibility:', error);
    }
  }, [showPHI, therapistProfile?.therapistId, auditSystem, loadDashboardData]);

  // Filter patients based on search and risk level
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = filterRiskLevel === 'all' || patient.riskLevel === filterRiskLevel;
      return matchesSearch && matchesRisk;
    });
  }, [patients, searchQuery, filterRiskLevel]);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Render loading state
  if (loading) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <div className=\"flex flex-col items-center space-y-4\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600\"></div>
          <p className=\"text-gray-600\">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <Card className=\"p-8 max-w-md w-full mx-4\">
          <div className=\"flex flex-col items-center space-y-4 text-center\">
            <XCircle className=\"h-12 w-12 text-red-500\" />
            <h2 className=\"text-xl font-medium text-gray-900\">Dashboard Error</h2>
            <p className=\"text-gray-600\">{error}</p>
            <Button onClick={loadDashboardData} className=\"w-full\">
              <RefreshCw className=\"w-4 h-4 mr-2\" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* HIPAA Compliance Header */}
      <header className=\"bg-white border-b border-gray-200 shadow-sm\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between items-center h-16\">
            {/* Logo and Title */}
            <div className=\"flex items-center space-x-4\">
              <Shield className=\"h-8 w-8 text-blue-600\" />
              <div>
                <h1 className=\"text-xl font-medium text-gray-900\">ALCHM Therapist Portal</h1>
                <p className=\"text-sm text-gray-500\">HIPAA-Compliant Dashboard</p>
              </div>
            </div>

            {/* Security Controls */}
            <div className=\"flex items-center space-x-4\">
              {/* PHI Visibility Toggle */}
              <Button
                variant=\"outline\"
                size=\"sm\"
                onClick={togglePHIVisibility}
                className={`${showPHI ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}
              >
                {showPHI ? <EyeOff className=\"w-4 h-4 mr-2\" /> : <Eye className=\"w-4 h-4 mr-2\" />}
                {showPHI ? 'Hide PHI' : 'Show PHI'}
              </Button>

              {/* Audit Mode Toggle */}
              <Button
                variant=\"outline\"
                size=\"sm\"
                onClick={() => setAuditMode(!auditMode)}
                className={`${auditMode ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
              >
                <Activity className=\"w-4 h-4 mr-2\" />
                {auditMode ? 'Exit Audit' : 'Audit Mode'}
              </Button>

              {/* Compliance Status */}
              <div className=\"flex items-center space-x-2\">
                {complianceStatus?.overallStatus === 'compliant' ? (
                  <CheckCircle className=\"w-5 h-5 text-green-500\" />
                ) : (
                  <AlertTriangle className=\"w-5 h-5 text-yellow-500\" />
                )}
                <span className=\"text-sm font-medium text-gray-700\">
                  {complianceStatus?.overallStatus === 'compliant' ? 'Compliant' : 'Needs Attention'}
                </span>
              </div>

              {/* Logout */}
              <Button variant=\"ghost\" size=\"sm\">
                <LogOut className=\"w-4 h-4\" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Compliance Alerts Banner */}
      {complianceAlerts.length > 0 && (
        <div className=\"bg-yellow-50 border-b border-yellow-200\">
          <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3\">
            <div className=\"flex items-center justify-between\">
              <div className=\"flex items-center space-x-3\">
                <AlertTriangle className=\"w-5 h-5 text-yellow-600\" />
                <span className=\"text-sm font-medium text-yellow-800\">
                  {complianceAlerts.length} compliance alert{complianceAlerts.length !== 1 ? 's' : ''} require attention
                </span>
              </div>
              <Button
                variant=\"outline\"
                size=\"sm\"
                onClick={() => setActiveTab('compliance')}
                className=\"bg-white hover:bg-gray-50\"
              >
                Review Alerts
                <ChevronRight className=\"w-4 h-4 ml-1\" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        {/* Navigation Tabs */}
        <nav className=\"flex space-x-8 mb-8\">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'compliance', label: 'Compliance', icon: Shield },
            { id: 'audit', label: 'Audit Log', icon: FileText }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className=\"w-4 h-4\" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className=\"space-y-8\">
            {/* Metrics Cards */}
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
              <Card className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Total Patients</p>
                    <p className=\"text-3xl font-medium text-gray-900\">{dashboardMetrics?.totalPatients}</p>
                  </div>
                  <Users className=\"w-8 h-8 text-blue-600\" />
                </div>
              </Card>

              <Card className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">High Risk</p>
                    <p className=\"text-3xl font-medium text-red-600\">{dashboardMetrics?.highRiskPatients}</p>
                  </div>
                  <AlertTriangle className=\"w-8 h-8 text-red-600\" />
                </div>
              </Card>

              <Card className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Pending Messages</p>
                    <p className=\"text-3xl font-medium text-yellow-600\">{dashboardMetrics?.pendingMessages}</p>
                  </div>
                  <MessageSquare className=\"w-8 h-8 text-yellow-600\" />
                </div>
              </Card>

              <Card className=\"p-6\">
                <div className=\"flex items-center justify-between\">
                  <div>
                    <p className=\"text-sm font-medium text-gray-600\">Compliance Score</p>
                    <p className=\"text-3xl font-medium text-green-600\">{dashboardMetrics?.complianceScore}%</p>
                  </div>
                  <Shield className=\"w-8 h-8 text-green-600\" />
                </div>
              </Card>
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">
              {/* Recent Patients */}
              <Card className=\"p-6\">
                <h3 className=\"text-lg font-medium text-gray-900 mb-4\">Recent Patients</h3>
                <div className=\"space-y-4\">
                  {patients.slice(0, 5).map((patient) => (
                    <div key={patient.patientId} className=\"flex items-center justify-between p-3 bg-gray-50 rounded-lg\">
                      <div className=\"flex items-center space-x-3\">
                        <div className={`w-3 h-3 rounded-full ${
                          patient.riskLevel === 'critical' ? 'bg-red-500' :
                          patient.riskLevel === 'high' ? 'bg-orange-500' :
                          patient.riskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className=\"font-medium text-gray-900\">{patient.name}</p>
                          <p className=\"text-sm text-gray-500\">
                            Next: {patient.nextSessionDate?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant=\"ghost\"
                        size=\"sm\"
                        onClick={() => selectPatient(patient)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Compliance Status */}
              <Card className=\"p-6\">
                <h3 className=\"text-lg font-medium text-gray-900 mb-4\">HIPAA Compliance Status</h3>
                <div className=\"space-y-4\">
                  <div className=\"flex items-center justify-between\">
                    <span className=\"text-sm text-gray-600\">Overall Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      complianceStatus?.overallStatus === 'compliant' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complianceStatus?.overallStatus}
                    </span>
                  </div>
                  <div className=\"flex items-center justify-between\">
                    <span className=\"text-sm text-gray-600\">Last Assessment</span>
                    <span className=\"text-sm text-gray-900\">
                      {complianceStatus?.lastAssessment.toLocaleDateString()}
                    </span>
                  </div>
                  <div className=\"flex items-center justify-between\">
                    <span className=\"text-sm text-gray-600\">Training Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      complianceStatus?.trainingStatus === 'current'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {complianceStatus?.trainingStatus}
                    </span>
                  </div>
                  <div className=\"pt-2\">
                    <Button
                      variant=\"outline\"
                      size=\"sm\"
                      onClick={() => setActiveTab('compliance')}
                      className=\"w-full\"
                    >
                      View Full Compliance Report
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className=\"space-y-6\">
            {/* Search and Filter */}
            <div className=\"flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4\">
              <div className=\"flex-1 relative\">
                <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400\" />
                <input
                  type=\"text\"
                  placeholder=\"Search patients...\"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=\"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
                />
              </div>
              <select
                value={filterRiskLevel}
                onChange={(e) => setFilterRiskLevel(e.target.value as any)}
                className=\"px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              >
                <option value=\"all\">All Risk Levels</option>
                <option value=\"low\">Low Risk</option>
                <option value=\"moderate\">Moderate Risk</option>
                <option value=\"high\">High Risk</option>
                <option value=\"critical\">Critical Risk</option>
              </select>
            </div>

            {/* Patients List */}
            <Card className=\"overflow-hidden\">
              <div className=\"overflow-x-auto\">
                <table className=\"min-w-full divide-y divide-gray-200\">
                  <thead className=\"bg-gray-50\">
                    <tr>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Patient
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Risk Level
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Treatment Phase
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Next Session
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Consent Status
                      </th>
                      <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className=\"bg-white divide-y divide-gray-200\">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.patientId} className=\"hover:bg-gray-50\">
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"flex items-center\">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                              patient.riskLevel === 'critical' ? 'bg-red-500' :
                              patient.riskLevel === 'high' ? 'bg-orange-500' :
                              patient.riskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            <div>
                              <div className=\"text-sm font-medium text-gray-900\">{patient.name}</div>
                              <div className=\"text-sm text-gray-500\">{patient.patientId}</div>
                            </div>
                          </div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            patient.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                            patient.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                            patient.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {patient.riskLevel}
                          </span>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                          {patient.treatmentPhase.replace('_', ' ')}
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                          {patient.nextSessionDate?.toLocaleDateString()}
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            patient.consentStatus === 'active' ? 'bg-green-100 text-green-800' :
                            patient.consentStatus === 'expired' ? 'bg-red-100 text-red-800' :
                            patient.consentStatus === 'revoked' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {patient.consentStatus}
                          </span>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap text-sm font-medium\">
                          <Button
                            variant=\"outline\"
                            size=\"sm\"
                            onClick={() => selectPatient(patient)}
                            disabled={patient.consentStatus !== 'active'}
                          >
                            View Record
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className=\"space-y-6\">
            {/* Compliance Overview */}
            <Card className=\"p-6\">
              <h3 className=\"text-lg font-medium text-gray-900 mb-4\">HIPAA Compliance Overview</h3>
              <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
                <div className=\"text-center\">
                  <div className={`text-3xl font-medium ${
                    complianceStatus?.overallStatus === 'compliant' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {complianceStatus?.complianceScore}%
                  </div>
                  <p className=\"text-sm text-gray-600\">Overall Score</p>
                </div>
                <div className=\"text-center\">
                  <div className=\"text-3xl font-medium text-blue-600\">
                    {complianceStatus?.auditFindings}
                  </div>
                  <p className=\"text-sm text-gray-600\">Audit Findings</p>
                </div>
                <div className=\"text-center\">
                  <div className=\"text-3xl font-medium text-orange-600\">
                    {complianceStatus?.remediationItems}
                  </div>
                  <p className=\"text-sm text-gray-600\">Remediation Items</p>
                </div>
              </div>
            </Card>

            {/* Active Alerts */}
            <Card className=\"p-6\">
              <h3 className=\"text-lg font-medium text-gray-900 mb-4\">Active Compliance Alerts</h3>
              <div className=\"space-y-4\">
                {complianceAlerts.map((alert) => (
                  <div key={alert.alertId} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                    alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className=\"flex items-start justify-between\">
                      <div className=\"flex-1\">
                        <h4 className=\"font-medium text-gray-900\">{alert.title}</h4>
                        <p className=\"text-sm text-gray-600 mt-1\">{alert.description}</p>
                        {alert.dueDate && (
                          <p className=\"text-xs text-gray-500 mt-2\">
                            Due: {alert.dueDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {alert.actionRequired && (
                        <Button variant=\"outline\" size=\"sm\">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Additional tab content would continue here... */}
      </main>

      {/* Security Footer */}
      <footer className=\"bg-gray-900 text-white py-4\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex items-center justify-between text-sm\">
            <div className=\"flex items-center space-x-4\">
              <span>HIPAA Compliant • End-to-End Encrypted</span>
              <span>Session: {Date.now().toString().slice(-8)}</span>
            </div>
            <div className=\"flex items-center space-x-4\">
              <span>Last Audit: {dashboardMetrics?.lastAuditDate.toLocaleDateString()}</span>
              <Lock className=\"w-4 h-4\" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};