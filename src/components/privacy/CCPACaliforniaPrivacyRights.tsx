'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface CCPACaliforniaPrivacyRightsProps {
  userId: string;
  userLocation: {
    state?: string;
    isCaliforniaResident?: boolean;
  };
  onCCPAComplianceChange: (status: 'compliant' | 'pending' | 'violation') => void;
}

interface PersonalInformationCategory {
  id: string;
  category: string;
  examples: string[];
  collected: boolean;
  sources: string[];
  businessPurpose: string[];
  thirdParties: string[];
  sold: boolean;
  sharedForCrossContext: boolean;
  retentionPeriod: string;
  sensitivePersonalInfo: boolean;
}

interface CCPAConsumerRequest {
  id: string;
  requestType: 'know' | 'delete' | 'opt_out' | 'opt_in' | 'correct' | 'limit';
  status: 'submitted' | 'verified' | 'processing' | 'completed' | 'denied';
  submittedDate: string;
  verifiedDate?: string;
  completedDate?: string;
  requestDetails: string;
  verificationMethod: 'email' | 'phone' | 'manual';
  responseData?: any;
  denialReason?: string;
}

interface CCPAOptOutStatus {
  personalInfoSale: boolean;
  crossContextBehavioralAds: boolean;
  sensitivePersonalInfoProcessing: boolean;
  thirdPartySharing: boolean;
  lastUpdated: string;
  globalPrivacyControl: boolean;
}

interface CCPAComplianceRecord {
  userId: string;
  isCaliforniaResident: boolean;
  personalInfoCategories: PersonalInformationCategory[];
  consumerRequests: CCPAConsumerRequest[];
  optOutStatus: CCPAOptOutStatus;
  privacyPolicyNotified: boolean;
  collectionNoticeProvided: boolean;
  complianceStatus: 'compliant' | 'pending' | 'violation';
  lastAssessment: string;
  violations: string[];
  businessEntity: 'small' | 'large';
  thresholdMet: boolean; // $25M revenue, 50K+ consumers, or 50%+ revenue from selling PI
}

export default function CCPACaliforniaPrivacyRights({
  userId,
  userLocation,
  onCCPAComplianceChange
}: CCPACaliforniaPrivacyRightsProps) {
  const [complianceRecord, setComplianceRecord] = useState<CCPAComplianceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<CCPAConsumerRequest['requestType']>('know');
  const [requestDetails, setRequestDetails] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation.isCaliforniaResident) {
      loadCCPAComplianceRecord();
    } else {
      setLoading(false);
    }
  }, [userId, userLocation.isCaliforniaResident]);

  const loadCCPAComplianceRecord = async () => {
    try {
      setLoading(true);
      const recordRef = doc(db, 'ccpa_compliance_records', userId);
      const recordDoc = await getDoc(recordRef);

      if (recordDoc.exists()) {
        const record = recordDoc.data() as CCPAComplianceRecord;
        setComplianceRecord(record);
        onCCPAComplianceChange(record.complianceStatus);
      } else {
        // Initialize CCPA compliance record
        const initialRecord = await createInitialCCPARecord();
        setComplianceRecord(initialRecord);
        onCCPAComplianceChange(initialRecord.complianceStatus);
      }
    } catch (err) {
      console.error('Error loading CCPA compliance record:', err);
      setError('Failed to load California privacy rights information.');
    } finally {
      setLoading(false);
    }
  };

  const createInitialCCPARecord = async (): Promise<CCPAComplianceRecord> => {
    const personalInfoCategories: PersonalInformationCategory[] = [
      {
        id: 'identifiers',
        category: 'Identifiers',
        examples: ['Email address', 'Account ID', 'IP address'],
        collected: true,
        sources: ['Directly from you', 'Your device'],
        businessPurpose: ['Service provision', 'Account management'],
        thirdParties: ['Firebase (Google)', 'Analytics providers'],
        sold: false,
        sharedForCrossContext: false,
        retentionPeriod: '24 months after account deletion',
        sensitivePersonalInfo: false
      },
      {
        id: 'personal_info',
        category: 'Personal Information',
        examples: ['Name', 'Age range', 'Profile information'],
        collected: true,
        sources: ['Directly from you'],
        businessPurpose: ['Service provision', 'Age verification'],
        thirdParties: [],
        sold: false,
        sharedForCrossContext: false,
        retentionPeriod: '12 months for minors, 24 months for adults',
        sensitivePersonalInfo: false
      },
      {
        id: 'internet_activity',
        category: 'Internet or Electronic Network Activity',
        examples: ['App usage patterns', 'Journal entry metadata', 'Feature interactions'],
        collected: true,
        sources: ['Your device', 'App interactions'],
        businessPurpose: ['Service improvement', 'Crisis detection', 'Analytics'],
        thirdParties: ['Firebase (Google)', 'Analytics providers'],
        sold: false,
        sharedForCrossContext: false,
        retentionPeriod: '26 months for analytics, immediate for crisis detection',
        sensitivePersonalInfo: false
      },
      {
        id: 'sensitive_personal_info',
        category: 'Sensitive Personal Information',
        examples: ['Journal content', 'Mental health status', 'Crisis indicators'],
        collected: true,
        sources: ['Directly from you', 'AI analysis of your content'],
        businessPurpose: ['Service provision', 'Crisis intervention', 'Wellness insights'],
        thirdParties: ['AI providers (anonymized summaries only)'],
        sold: false,
        sharedForCrossContext: false,
        retentionPeriod: 'User-controlled, default 12 months',
        sensitivePersonalInfo: true
      }
    ];

    const optOutStatus: CCPAOptOutStatus = {
      personalInfoSale: true, // Opted out by default (we don't sell)
      crossContextBehavioralAds: true, // Opted out by default (we don't use)
      sensitivePersonalInfoProcessing: false, // Processing necessary for service
      thirdPartySharing: false, // Limited sharing for service provision
      lastUpdated: new Date().toISOString(),
      globalPrivacyControl: false
    };

    const initialRecord: CCPAComplianceRecord = {
      userId,
      isCaliforniaResident: true,
      personalInfoCategories,
      consumerRequests: [],
      optOutStatus,
      privacyPolicyNotified: true,
      collectionNoticeProvided: true,
      complianceStatus: 'compliant',
      lastAssessment: new Date().toISOString(),
      violations: [],
      businessEntity: 'small', // ALCHM is currently a small business
      thresholdMet: false
    };

    await setDoc(doc(db, 'ccpa_compliance_records', userId), initialRecord);
    return initialRecord;
  };

  const submitConsumerRequest = async () => {
    if (!requestDetails.trim() || !complianceRecord) {
      setError('Please provide request details.');
      return;
    }

    try {
      const request: Omit<CCPAConsumerRequest, 'id'> = {
        requestType,
        status: 'submitted',
        submittedDate: new Date().toISOString(),
        requestDetails: requestDetails.trim(),
        verificationMethod: 'email'
      };

      const requestId = `ccpa_request_${Date.now()}`;
      const updatedRecord = {
        ...complianceRecord,
        consumerRequests: [...complianceRecord.consumerRequests, { id: requestId, ...request }]
      };

      await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
        consumerRequests: updatedRecord.consumerRequests
      });

      setComplianceRecord(updatedRecord);
      setShowRequestModal(false);
      setRequestDetails('');

      // Trigger automated processing for certain request types
      await processAutomatedCCPARequest(requestId, requestType);

    } catch (err) {
      console.error('Error submitting CCPA consumer request:', err);
      setError('Failed to submit consumer request. Please try again.');
    }
  };

  const processAutomatedCCPARequest = async (requestId: string, type: CCPAConsumerRequest['requestType']) => {
    try {
      switch (type) {
        case 'know':
          await processKnowRequest(requestId);
          break;
        case 'delete':
          await processDeleteRequest(requestId);
          break;
        case 'opt_out':
          await processOptOutRequest(requestId);
          break;
        case 'opt_in':
          await processOptInRequest(requestId);
          break;
        default:
          // Manual processing required
          break;
      }
    } catch (err) {
      console.error('Error processing automated CCPA request:', err);
    }
  };

  const processKnowRequest = async (requestId: string) => {
    if (!complianceRecord) return;

    try {
      // Compile comprehensive data disclosure
      const responseData = {
        requestType: 'Right to Know',
        personalInformationCollected: complianceRecord.personalInfoCategories.map(category => ({
          category: category.category,
          examples: category.examples,
          collected: category.collected,
          sources: category.sources,
          businessPurpose: category.businessPurpose,
          thirdParties: category.thirdParties,
          sold: category.sold,
          sharedForCrossContext: category.sharedForCrossContext,
          retentionPeriod: category.retentionPeriod
        })),
        businessPurposes: [
          'Providing trauma-informed journaling services',
          'AI-powered wellness insights',
          'Crisis detection and intervention',
          'Service improvement and analytics',
          'Account management and customer support'
        ],
        categoriesShared: complianceRecord.personalInfoCategories
          .filter(c => c.thirdParties.length > 0)
          .map(c => ({ category: c.category, sharedWith: c.thirdParties })),
        categoriesSold: [], // ALCHM does not sell personal information
        optOutStatus: complianceRecord.optOutStatus,
        dataRetentionPolicy: 'Data is retained according to user preferences and legal requirements',
        responseDate: new Date().toISOString()
      };

      const updatedRequests = complianceRecord.consumerRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'completed' as const,
              verifiedDate: new Date().toISOString(),
              completedDate: new Date().toISOString(),
              responseData
            }
          : req
      );

      await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
        consumerRequests: updatedRequests
      });

      setComplianceRecord(prev => prev ? { ...prev, consumerRequests: updatedRequests } : prev);

    } catch (err) {
      console.error('Error processing know request:', err);
    }
  };

  const processDeleteRequest = async (requestId: string) => {
    if (!complianceRecord) return;

    try {
      // Check if deletion is required by law
      const canDelete = !complianceRecord.personalInfoCategories.some(category =>
        category.businessPurpose.includes('Legal compliance') ||
        category.businessPurpose.includes('Fraud prevention')
      );

      if (!canDelete) {
        const updatedRequests = complianceRecord.consumerRequests.map(req =>
          req.id === requestId
            ? {
                ...req,
                status: 'denied' as const,
                completedDate: new Date().toISOString(),
                denialReason: 'Deletion not required by law due to legal compliance obligations'
              }
            : req
        );

        await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
          consumerRequests: updatedRequests
        });

        setComplianceRecord(prev => prev ? { ...prev, consumerRequests: updatedRequests } : prev);
        return;
      }

      // Schedule deletion
      const responseData = {
        deletionScheduled: true,
        estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        itemsToDelete: complianceRecord.personalInfoCategories.map(c => c.category),
        retainedItems: ['Legal compliance records', 'Transaction history for refunds'],
        notice: 'Your personal information will be deleted within 30 days unless legally required to retain'
      };

      const updatedRequests = complianceRecord.consumerRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'completed' as const,
              verifiedDate: new Date().toISOString(),
              completedDate: new Date().toISOString(),
              responseData
            }
          : req
      );

      await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
        consumerRequests: updatedRequests
      });

      setComplianceRecord(prev => prev ? { ...prev, consumerRequests: updatedRequests } : prev);

    } catch (err) {
      console.error('Error processing delete request:', err);
    }
  };

  const processOptOutRequest = async (requestId: string) => {
    if (!complianceRecord) return;

    try {
      const updatedOptOutStatus: CCPAOptOutStatus = {
        ...complianceRecord.optOutStatus,
        personalInfoSale: true,
        crossContextBehavioralAds: true,
        thirdPartySharing: true,
        lastUpdated: new Date().toISOString()
      };

      const responseData = {
        optOutStatus: updatedOptOutStatus,
        effectiveDate: new Date().toISOString(),
        notice: 'You have been opted out of the sale and sharing of personal information'
      };

      const updatedRequests = complianceRecord.consumerRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'completed' as const,
              verifiedDate: new Date().toISOString(),
              completedDate: new Date().toISOString(),
              responseData
            }
          : req
      );

      await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
        consumerRequests: updatedRequests,
        optOutStatus: updatedOptOutStatus
      });

      setComplianceRecord(prev => prev ? { 
        ...prev, 
        consumerRequests: updatedRequests,
        optOutStatus: updatedOptOutStatus 
      } : prev);

    } catch (err) {
      console.error('Error processing opt-out request:', err);
    }
  };

  const processOptInRequest = async (requestId: string) => {
    if (!complianceRecord) return;

    try {
      const updatedOptOutStatus: CCPAOptOutStatus = {
        ...complianceRecord.optOutStatus,
        personalInfoSale: false,
        crossContextBehavioralAds: false,
        thirdPartySharing: false,
        lastUpdated: new Date().toISOString()
      };

      const responseData = {
        optInStatus: updatedOptOutStatus,
        effectiveDate: new Date().toISOString(),
        notice: 'You have opted back into the sale and sharing of personal information'
      };

      const updatedRequests = complianceRecord.consumerRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'completed' as const,
              verifiedDate: new Date().toISOString(),
              completedDate: new Date().toISOString(),
              responseData
            }
          : req
      );

      await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
        consumerRequests: updatedRequests,
        optOutStatus: updatedOptOutStatus
      });

      setComplianceRecord(prev => prev ? { 
        ...prev, 
        consumerRequests: updatedRequests,
        optOutStatus: updatedOptOutStatus 
      } : prev);

    } catch (err) {
      console.error('Error processing opt-in request:', err);
    }
  };

  const updateOptOutPreferences = async (preference: keyof CCPAOptOutStatus, value: boolean) => {
    if (!complianceRecord) return;

    try {
      const updatedOptOutStatus = {
        ...complianceRecord.optOutStatus,
        [preference]: value,
        lastUpdated: new Date().toISOString()
      };

      await updateDoc(doc(db, 'ccpa_compliance_records', userId), {
        optOutStatus: updatedOptOutStatus
      });

      setComplianceRecord(prev => prev ? { ...prev, optOutStatus: updatedOptOutStatus } : prev);

    } catch (err) {
      console.error('Error updating opt-out preferences:', err);
      setError('Failed to update preferences. Please try again.');
    }
  };

  const downloadConsumerRequestResponse = (request: CCPAConsumerRequest) => {
    if (!request.responseData) return;

    const blob = new Blob([JSON.stringify(request.responseData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CCPA_${request.requestType}_response_${request.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Don't show CCPA interface for non-California residents
  if (!userLocation.isCaliforniaResident) {
    return (
      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="text-center">
          <span className="text-4xl block mb-4">🐻</span>
          <h3 className="text-lg font-medium text-blue-800 mb-2">California Privacy Rights (CCPA)</h3>
          <p className="text-blue-700">
            CCPA rights are available to California residents. Your current state: {userLocation.state || 'Unknown'}
          </p>
          <p className="text-sm text-blue-600 mt-2">
            If you are a California resident, please update your location in settings to access CCPA features.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading California privacy rights...</p>
        </div>
      </div>
    );
  }

  if (!complianceRecord) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
        <div className="text-center">
          <span className="text-4xl block mb-4">⚠️</span>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading CCPA Information</h3>
          <p className="text-red-700">Unable to load your California privacy rights information.</p>
          <button
            onClick={loadCCPAComplianceRecord}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CCPA Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🐻</span>
          <div>
            <h3 className="text-xl font-medium text-purple-800">California Consumer Privacy Act (CCPA) Rights</h3>
            <p className="text-sm text-purple-700">
              Your privacy rights as a California resident under the California Consumer Privacy Act
            </p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              complianceRecord.complianceStatus === 'compliant' ? 'bg-green-200 text-green-800' :
              complianceRecord.complianceStatus === 'violation' ? 'bg-red-200 text-red-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
              {complianceRecord.complianceStatus.toUpperCase()}
            </span>
            <span className="text-purple-700">
              Last assessment: {new Date(complianceRecord.lastAssessment).toLocaleDateString()}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-lg font-medium text-blue-800">{complianceRecord.personalInfoCategories.length}</div>
              <div className="text-sm text-blue-600">Data Categories</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-lg font-medium text-green-800">{complianceRecord.consumerRequests.length}</div>
              <div className="text-sm text-green-600">Consumer Requests</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="text-lg font-medium text-yellow-800">
                {Object.values(complianceRecord.optOutStatus).filter(status => status === true).length}
              </div>
              <div className="text-sm text-yellow-600">Opt-Out Settings</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-lg font-medium text-purple-800">
                {complianceRecord.businessEntity === 'small' ? 'Small' : 'Large'}
              </div>
              <div className="text-sm text-purple-600">Business Entity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your CCPA Rights */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
        <h3 className="text-xl font-medium text-green-800 mb-4 flex items-center gap-2">
          <span>⚖️</span>
          Your California Privacy Rights
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">📋 Right to Know</h4>
            <p className="text-sm text-green-700 mb-3">
              Request information about personal information collected, used, disclosed, or sold.
            </p>
            <button
              onClick={() => { setRequestType('know'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Information
            </button>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">🗑️ Right to Delete</h4>
            <p className="text-sm text-red-700 mb-3">
              Request deletion of personal information we have collected.
            </p>
            <button
              onClick={() => { setRequestType('delete'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Deletion
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">🚫 Right to Opt-Out</h4>
            <p className="text-sm text-blue-700 mb-3">
              Opt-out of the sale or sharing of your personal information.
            </p>
            <button
              onClick={() => { setRequestType('opt_out'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Opt-Out of Sale/Sharing
            </button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">✏️ Right to Correct</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Request correction of inaccurate personal information.
            </p>
            <button
              onClick={() => { setRequestType('correct'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Correction
            </button>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-2">🔒 Right to Non-Discrimination</h4>
          <p className="text-sm text-orange-700">
            You have the right not to receive discriminatory treatment for exercising your CCPA rights. 
            We will not deny goods or services, charge different prices, or provide different service quality 
            based on your exercise of CCPA rights.
          </p>
        </div>
      </div>

      {/* Opt-Out Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <h3 className="text-xl font-medium text-blue-800 mb-4 flex items-center gap-2">
          <span>🛡️</span>
          Your Opt-Out Preferences
        </h3>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-800">Sale of Personal Information</div>
              <div className="text-sm text-blue-700">
                Currently: {complianceRecord.optOutStatus.personalInfoSale ? 'Opted Out' : 'Opted In'}
              </div>
            </div>
            <button
              onClick={() => updateOptOutPreferences('personalInfoSale', !complianceRecord.optOutStatus.personalInfoSale)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                complianceRecord.optOutStatus.personalInfoSale
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {complianceRecord.optOutStatus.personalInfoSale ? 'Opted Out ✓' : 'Opt Out'}
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-800">Cross-Context Behavioral Advertising</div>
              <div className="text-sm text-blue-700">
                Currently: {complianceRecord.optOutStatus.crossContextBehavioralAds ? 'Opted Out' : 'Opted In'}
              </div>
            </div>
            <button
              onClick={() => updateOptOutPreferences('crossContextBehavioralAds', !complianceRecord.optOutStatus.crossContextBehavioralAds)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                complianceRecord.optOutStatus.crossContextBehavioralAds
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {complianceRecord.optOutStatus.crossContextBehavioralAds ? 'Opted Out ✓' : 'Opt Out'}
            </button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 flex items-center justify-between">
            <div>
              <div className="font-medium text-yellow-800">Sensitive Personal Information Processing</div>
              <div className="text-sm text-yellow-700">
                Limited to service provision only: {complianceRecord.optOutStatus.sensitivePersonalInfoProcessing ? 'Yes' : 'No'}
              </div>
            </div>
            <button
              onClick={() => updateOptOutPreferences('sensitivePersonalInfoProcessing', !complianceRecord.optOutStatus.sensitivePersonalInfoProcessing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                complianceRecord.optOutStatus.sensitivePersonalInfoProcessing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {complianceRecord.optOutStatus.sensitivePersonalInfoProcessing ? 'Limited ✓' : 'Limit Processing'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Last updated: {new Date(complianceRecord.optOutStatus.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {/* Personal Information Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
        <h3 className="text-xl font-medium text-purple-800 mb-4 flex items-center gap-2">
          <span>📊</span>
          Personal Information We Collect
        </h3>

        <div className="space-y-4">
          {complianceRecord.personalInfoCategories.map((category) => (
            <div key={category.id} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-purple-800">{category.category}</div>
                  <div className="text-sm text-purple-700">Examples: {category.examples.join(', ')}</div>
                </div>
                <div className="flex gap-2">
                  {category.sensitivePersonalInfo && (
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-medium">
                      SENSITIVE
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    category.collected ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {category.collected ? 'COLLECTED' : 'NOT COLLECTED'}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <p><strong>Sources:</strong> {category.sources.join(', ')}</p>
                  <p><strong>Business Purpose:</strong> {category.businessPurpose.join(', ')}</p>
                </div>
                <div>
                  <p><strong>Third Parties:</strong> {category.thirdParties.length > 0 ? category.thirdParties.join(', ') : 'None'}</p>
                  <p><strong>Sold:</strong> {category.sold ? 'Yes' : 'No'}</p>
                  <p><strong>Shared for Cross-Context Ads:</strong> {category.sharedForCrossContext ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="mt-2 text-sm text-purple-600">
                <strong>Retention Period:</strong> {category.retentionPeriod}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consumer Requests History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
        <h3 className="text-xl font-medium text-orange-800 mb-4 flex items-center gap-2">
          <span>📝</span>
          Consumer Requests History
        </h3>

        {complianceRecord.consumerRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📋</span>
            <p>No consumer requests submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {complianceRecord.consumerRequests.map((request) => (
              <div key={request.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-orange-800 capitalize">
                      {request.requestType.replace('_', ' ')} Request
                    </div>
                    <div className="text-sm text-orange-700">
                      Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    request.status === 'completed' ? 'bg-green-200 text-green-800' :
                    request.status === 'denied' ? 'bg-red-200 text-red-800' :
                    request.status === 'processing' ? 'bg-blue-200 text-blue-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {request.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-orange-700 mb-2">{request.requestDetails}</p>

                {request.status === 'completed' && request.responseData && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadConsumerRequestResponse(request)}
                      className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-sm transition-colors"
                    >
                      📄 Download Response
                    </button>
                    <span className="text-sm text-orange-600">
                      Completed: {request.completedDate ? new Date(request.completedDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                )}

                {request.status === 'denied' && request.denialReason && (
                  <div className="bg-red-100 rounded p-2 border border-red-200 mt-2">
                    <div className="text-sm text-red-800">
                      <strong>Denial Reason:</strong> {request.denialReason}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-medium text-gray-900 mb-4 capitalize">
              CCPA {requestType.replace('_', ' ')} Request
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Details
                </label>
                <textarea
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Please describe your request in detail..."
                />
              </div>

              <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
                <p><strong>Processing Time:</strong> We will respond within 45 days as required by CCPA.</p>
                <p><strong>Verification:</strong> We may request additional information to verify your identity.</p>
                <p><strong>Fee:</strong> Most requests are processed free of charge.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitConsumerRequest}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CCPA Information */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">ℹ️ About CCPA</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            The California Consumer Privacy Act (CCPA) gives California residents specific rights regarding their personal information.
          </p>
          <p><strong>Business Information:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Business Name: ALCHM Digital Sanctuary</li>
            <li>Business Category: {complianceRecord.businessEntity === 'small' ? 'Small Business' : 'Large Business'}</li>
            <li>We do not sell personal information to third parties</li>
            <li>We share limited information with service providers for business purposes only</li>
          </ul>
          <p><strong>Contact Information:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Privacy Officer: privacy@alchm.com</li>
            <li>Toll-Free Privacy Hotline: 1-800-ALCHM-PRIVACY</li>
          </ul>
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