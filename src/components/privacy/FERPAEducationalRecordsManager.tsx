'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface FERPAEducationalRecordsManagerProps {
  userId: string;
  userRole: 'student' | 'educator' | 'parent' | 'school_official' | 'researcher';
  educationalContext: {
    schoolDistrict?: string;
    institution?: string;
    gradeLevel?: string;
    isMinor?: boolean;
  };
  onComplianceStatusChange: (status: 'compliant' | 'violation' | 'needs_review') => void;
}

interface EducationalRecord {
  id: string;
  studentId: string;
  recordType: 'journal_entry' | 'mood_data' | 'ai_interaction' | 'progress_data' | 'crisis_assessment';
  educationalPurpose: string;
  disclosureLevel: 'student_only' | 'parent_guardian' | 'school_official' | 'researcher' | 'emergency';
  retentionPeriod: number; // in days
  created: string;
  lastAccessed?: string;
  accessLog: Array<{
    userId: string;
    userRole: string;
    timestamp: string;
    purpose: string;
    legitimateInterest: boolean;
  }>;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  parentalNotificationRequired: boolean;
  consentRequired: boolean;
  consentObtained?: boolean;
  complianceNotes: string[];
}

interface FERPAComplianceStatus {
  overallStatus: 'compliant' | 'violation' | 'needs_review';
  violations: Array<{
    recordId: string;
    violationType: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    requiredAction: string;
  }>;
  recommendations: string[];
  lastAudit: string;
}

export default function FERPAEducationalRecordsManager({
  userId,
  userRole,
  educationalContext,
  onComplianceStatusChange
}: FERPAEducationalRecordsManagerProps) {
  const [educationalRecords, setEducationalRecords] = useState<EducationalRecord[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<FERPAComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EducationalRecord | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  useEffect(() => {
    loadEducationalRecords();
    performFERPAComplianceAudit();
  }, [userId]);

  const loadEducationalRecords = async () => {
    try {
      setLoading(true);
      const recordsQuery = query(
        collection(db, 'educational_records'),
        where('studentId', '==', userId)
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      const records: EducationalRecord[] = recordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EducationalRecord));

      setEducationalRecords(records);
    } catch (err) {
      console.error('Error loading educational records:', err);
      setError('Failed to load educational records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const performFERPAComplianceAudit = async () => {
    try {
      const violations: FERPAComplianceStatus['violations'] = [];
      const recommendations: string[] = [];

      // Audit each educational record
      educationalRecords.forEach(record => {
        // Check for required educational purpose
        if (!record.educationalPurpose || record.educationalPurpose.trim().length === 0) {
          violations.push({
            recordId: record.id,
            violationType: 'FERPA_VIOLATION_001',
            description: 'Educational record lacks defined educational purpose',
            severity: 'high',
            requiredAction: 'Define clear educational purpose for this record'
          });
        }

        // Check disclosure level appropriateness
        if (!record.disclosureLevel) {
          violations.push({
            recordId: record.id,
            violationType: 'FERPA_VIOLATION_002',
            description: 'Educational record lacks appropriate disclosure level',
            severity: 'high',
            requiredAction: 'Set appropriate disclosure level based on FERPA guidelines'
          });
        }

        // Check retention period compliance
        if (!record.retentionPeriod || record.retentionPeriod <= 0) {
          violations.push({
            recordId: record.id,
            violationType: 'FERPA_VIOLATION_003',
            description: 'Educational record lacks defined retention period',
            severity: 'medium',
            requiredAction: 'Set retention period according to school district policy'
          });
        }

        // Check for excessive retention
        const recordAge = Date.now() - new Date(record.created).getTime();
        const daysSinceCreation = recordAge / (1000 * 60 * 60 * 24);
        if (daysSinceCreation > record.retentionPeriod) {
          violations.push({
            recordId: record.id,
            violationType: 'FERPA_VIOLATION_004',
            description: 'Educational record exceeds defined retention period',
            severity: 'medium',
            requiredAction: 'Archive or delete record according to retention policy'
          });
        }

        // Check access log for legitimate educational interest
        record.accessLog.forEach(access => {
          if (!access.legitimateInterest && access.userRole !== 'student') {
            violations.push({
              recordId: record.id,
              violationType: 'FERPA_VIOLATION_005',
              description: 'Record access without legitimate educational interest',
              severity: 'critical',
              requiredAction: 'Investigate and document legitimate educational interest'
            });
          }
        });

        // Check parental consent requirements for minors
        if (educationalContext.isMinor && record.consentRequired && !record.consentObtained) {
          violations.push({
            recordId: record.id,
            violationType: 'FERPA_VIOLATION_006',
            description: 'Minor student record requires parental consent',
            severity: 'high',
            requiredAction: 'Obtain parental consent before processing this record'
          });
        }
      });

      // Generate recommendations
      if (violations.length > 0) {
        recommendations.push('Implement comprehensive FERPA training for all staff with access to educational records');
        recommendations.push('Establish regular audit schedule for educational record compliance');
        recommendations.push('Create automated retention period enforcement system');
      }

      if (educationalRecords.length > 50) {
        recommendations.push('Consider implementing educational record archival system for better data management');
      }

      const status: FERPAComplianceStatus = {
        overallStatus: violations.length === 0 ? 'compliant' : 
                      violations.some(v => v.severity === 'critical') ? 'violation' : 'needs_review',
        violations,
        recommendations,
        lastAudit: new Date().toISOString()
      };

      setComplianceStatus(status);
      onComplianceStatusChange(status.overallStatus);

      // Log compliance audit
      await logComplianceAudit(status);

    } catch (err) {
      console.error('Error performing FERPA compliance audit:', err);
      setError('Failed to perform compliance audit. Please try again.');
    }
  };

  const logComplianceAudit = async (status: FERPAComplianceStatus) => {
    try {
      const auditLog = {
        userId,
        userRole,
        educationalContext,
        auditTimestamp: new Date().toISOString(),
        complianceStatus: status,
        recordsAudited: educationalRecords.length,
        violationsFound: status.violations.length,
        auditType: 'FERPA_COMPLIANCE_AUDIT'
      };

      await setDoc(doc(db, 'ferpa_audit_logs', `${userId}_${Date.now()}`), auditLog);
    } catch (err) {
      console.error('Error logging FERPA compliance audit:', err);
    }
  };

  const requestRecordDisclosure = async (recordId: string, requesterInfo: {
    requesterRole: string;
    purpose: string;
    legitimateInterest: boolean;
    requesterId: string;
  }) => {
    try {
      const record = educationalRecords.find(r => r.id === recordId);
      if (!record) return;

      // FERPA compliance check
      const isValidDisclosure = validateDisclosureRequest(record, requesterInfo);
      
      if (!isValidDisclosure.allowed) {
        alert(`Disclosure denied: ${isValidDisclosure.reason}`);
        return;
      }

      // Update access log
      const updatedRecord = {
        ...record,
        lastAccessed: new Date().toISOString(),
        accessLog: [
          ...record.accessLog,
          {
            userId: requesterInfo.requesterId,
            userRole: requesterInfo.requesterRole,
            timestamp: new Date().toISOString(),
            purpose: requesterInfo.purpose,
            legitimateInterest: requesterInfo.legitimateInterest
          }
        ],
        complianceNotes: [
          ...record.complianceNotes,
          `Record disclosed to ${requesterInfo.requesterRole} for: ${requesterInfo.purpose}`
        ]
      };

      await updateDoc(doc(db, 'educational_records', recordId), updatedRecord);
      
      // Update local state
      setEducationalRecords(prev => 
        prev.map(r => r.id === recordId ? updatedRecord : r)
      );

    } catch (err) {
      console.error('Error processing record disclosure:', err);
      setError('Failed to process record disclosure request.');
    }
  };

  const validateDisclosureRequest = (record: EducationalRecord, requesterInfo: any) => {
    // Student can always access their own records
    if (requesterInfo.requesterId === record.studentId) {
      return { allowed: true, reason: '' };
    }

    // Parent/guardian access for minor students
    if (requesterInfo.requesterRole === 'parent' && educationalContext.isMinor) {
      return { allowed: true, reason: '' };
    }

    // School official with legitimate educational interest
    if (requesterInfo.requesterRole === 'school_official' && requesterInfo.legitimateInterest) {
      return { allowed: true, reason: '' };
    }

    // Emergency situations
    if (record.recordType === 'crisis_assessment' && requesterInfo.requesterRole === 'emergency') {
      return { allowed: true, reason: '' };
    }

    // Research with proper authorization
    if (requesterInfo.requesterRole === 'researcher' && record.disclosureLevel === 'researcher') {
      return { allowed: true, reason: '' };
    }

    return { 
      allowed: false, 
      reason: 'Request does not meet FERPA disclosure requirements' 
    };
  };

  const updateRetentionPolicy = async (recordId: string, newRetentionDays: number, reason: string) => {
    try {
      const record = educationalRecords.find(r => r.id === recordId);
      if (!record) return;

      const updatedRecord = {
        ...record,
        retentionPeriod: newRetentionDays,
        complianceNotes: [
          ...record.complianceNotes,
          `Retention period updated to ${newRetentionDays} days. Reason: ${reason}`
        ]
      };

      await updateDoc(doc(db, 'educational_records', recordId), updatedRecord);
      
      setEducationalRecords(prev => 
        prev.map(r => r.id === recordId ? updatedRecord : r)
      );

      // Re-audit after changes
      await performFERPAComplianceAudit();

    } catch (err) {
      console.error('Error updating retention policy:', err);
      setError('Failed to update retention policy.');
    }
  };

  const generateFERPAComplianceReport = () => {
    if (!complianceStatus) return;

    const report = {
      generatedAt: new Date().toISOString(),
      institution: educationalContext.institution || 'ALCHM Digital Platform',
      studentId: userId,
      userRole,
      educationalContext,
      complianceStatus,
      recordsSummary: {
        totalRecords: educationalRecords.length,
        recordsByType: educationalRecords.reduce((acc, record) => {
          acc[record.recordType] = (acc[record.recordType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageRetentionPeriod: Math.round(
          educationalRecords.reduce((sum, record) => sum + record.retentionPeriod, 0) / educationalRecords.length
        )
      },
      violations: complianceStatus.violations,
      recommendations: complianceStatus.recommendations
    };

    // Download report as JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FERPA_Compliance_Report_${userId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FERPA educational records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* FERPA Compliance Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🎓</span>
          <div>
            <h3 className="text-xl font-bold text-purple-800">FERPA Educational Records Management</h3>
            <p className="text-sm text-purple-700">
              Family Educational Rights and Privacy Act (FERPA) compliance for educational data
            </p>
          </div>
        </div>

        {complianceStatus && (
          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                complianceStatus.overallStatus === 'compliant' ? 'bg-green-200 text-green-800' :
                complianceStatus.overallStatus === 'violation' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {complianceStatus.overallStatus.toUpperCase()}
              </span>
              <span className="text-purple-700">
                Last audit: {new Date(complianceStatus.lastAudit).toLocaleDateString()}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-lg font-bold text-blue-800">{educationalRecords.length}</div>
                <div className="text-sm text-blue-600">Educational Records</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-lg font-bold text-red-800">{complianceStatus.violations.length}</div>
                <div className="text-sm text-red-600">Violations Found</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-lg font-bold text-yellow-800">{complianceStatus.recommendations.length}</div>
                <div className="text-sm text-yellow-600">Recommendations</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generateFERPAComplianceReport}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                📄 Generate Compliance Report
              </button>
              <button
                onClick={performFERPAComplianceAudit}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-sm font-medium transition-colors"
              >
                🔍 Re-audit Records
              </button>
            </div>
          </div>
        )}

        {/* Educational Context */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-800 mb-2">📚 Educational Context</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p><strong>Role:</strong> {userRole.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Institution:</strong> {educationalContext.institution || 'Not specified'}</p>
            </div>
            <div>
              <p><strong>Grade Level:</strong> {educationalContext.gradeLevel || 'Not specified'}</p>
              <p><strong>Minor Status:</strong> {educationalContext.isMinor ? 'Yes (enhanced protections)' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Violations and Recommendations */}
      {complianceStatus && complianceStatus.violations.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            FERPA Compliance Violations
          </h3>
          
          <div className="space-y-3">
            {complianceStatus.violations.map((violation, index) => (
              <div key={index} className="bg-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-red-800">{violation.violationType}</div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    violation.severity === 'critical' ? 'bg-red-600 text-white' :
                    violation.severity === 'high' ? 'bg-red-500 text-white' :
                    violation.severity === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {violation.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-red-700 mb-2">{violation.description}</p>
                <p className="text-sm text-red-800 font-medium">
                  <strong>Required Action:</strong> {violation.requiredAction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {complianceStatus && complianceStatus.recommendations.length > 0 && (
        <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
          <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
            <span>💡</span>
            FERPA Compliance Recommendations
          </h3>
          
          <div className="space-y-2">
            {complianceStatus.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <p className="text-sm text-yellow-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Records List */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <span>📋</span>
          Educational Records ({educationalRecords.length})
        </h3>

        {educationalRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📚</span>
            <p>No educational records found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {educationalRecords.map((record) => (
              <div key={record.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-green-800 capitalize">
                      {record.recordType.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-green-700">
                      Created: {new Date(record.created).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      record.dataClassification === 'public' ? 'bg-green-200 text-green-800' :
                      record.dataClassification === 'internal' ? 'bg-blue-200 text-blue-800' :
                      record.dataClassification === 'confidential' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {record.dataClassification.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-green-700 mb-2">
                  <p><strong>Educational Purpose:</strong> {record.educationalPurpose || 'Not defined'}</p>
                  <p><strong>Disclosure Level:</strong> {record.disclosureLevel.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>Retention Period:</strong> {record.retentionPeriod} days</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-sm transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setShowAuditLog(true)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-sm transition-colors"
                  >
                    Access Log ({record.accessLog.length})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FERPA Rights Information */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-2">ℹ️ Your FERPA Rights</h4>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Right to Inspect:</strong> You have the right to inspect and review your educational records.</p>
          <p><strong>Right to Request Amendment:</strong> You can request amendments to inaccurate or misleading records.</p>
          <p><strong>Right to Consent to Disclosures:</strong> Generally, FERPA requires consent before disclosing educational records.</p>
          <p><strong>Right to File a Complaint:</strong> You can file a complaint with the U.S. Department of Education if you believe your FERPA rights have been violated.</p>
          <p><strong>Parental Rights:</strong> {educationalContext.isMinor ? 'Parents have FERPA rights until you turn 18.' : 'As an adult student, you have full FERPA rights.'}</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline mt-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}