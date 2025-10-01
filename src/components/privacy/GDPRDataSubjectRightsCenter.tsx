'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';

interface GDPRDataSubjectRightsCenterProps {
  userId: string;
  userLocation: {
    country?: string;
    region?: string;
    isEUResident?: boolean;
  };
  onGDPRComplianceChange: (status: 'compliant' | 'pending' | 'violation') => void;
}

interface DataProcessingRecord {
  id: string;
  dataType: string;
  processingPurpose: string;
  legalBasis: 'consent' | 'legitimate_interest' | 'vital_interests' | 'legal_obligation' | 'public_task' | 'contract';
  dataCategories: string[];
  retentionPeriod: number;
  thirdPartySharing: boolean;
  thirdParties?: string[];
  automated: boolean;
  consentWithdrawable: boolean;
  consentGiven?: boolean;
  consentDate?: string;
  lastProcessed: string;
  dataMinimizationCompliant: boolean;
  purposeLimitationCompliant: boolean;
}

interface GDPRRightsRequest {
  id: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'restriction' | 'portability' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requestDate: string;
  completionDate?: string;
  requestDetails: string;
  responseData?: any;
  rejectionReason?: string;
  followUpRequired: boolean;
}

interface GDPRComplianceStatus {
  overallCompliance: 'compliant' | 'pending' | 'violation';
  dataProcessingCompliance: boolean;
  consentManagementCompliance: boolean;
  rightsResponseCompliance: boolean;
  dataProtectionOfficerContact: string;
  supervisoryAuthorityContact: string;
  lastAssessment: string;
  pendingActions: string[];
}

export default function GDPRDataSubjectRightsCenter({
  userId,
  userLocation,
  onGDPRComplianceChange
}: GDPRDataSubjectRightsCenterProps) {
  const [processingRecords, setProcessingRecords] = useState<DataProcessingRecord[]>([]);
  const [rightsRequests, setRightsRequests] = useState<GDPRRightsRequest[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<GDPRComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<DataProcessingRecord | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<GDPRRightsRequest['requestType']>('access');
  const [requestDetails, setRequestDetails] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation.isEUResident) {
      loadDataProcessingRecords();
      loadRightsRequests();
      assessGDPRCompliance();
    }
  }, [userId, userLocation.isEUResident]);

  const loadDataProcessingRecords = async () => {
    try {
      setLoading(true);
      const recordsQuery = query(
        collection(db, 'data_processing_records'),
        where('userId', '==', userId)
      );
      
      const recordsSnapshot = await getDocs(recordsQuery);
      const records: DataProcessingRecord[] = recordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DataProcessingRecord));

      setProcessingRecords(records);
    } catch (err) {
      console.error('Error loading data processing records:', err);
      setError('Failed to load data processing records.');
    }
  };

  const loadRightsRequests = async () => {
    try {
      const requestsQuery = query(
        collection(db, 'gdpr_rights_requests'),
        where('userId', '==', userId)
      );
      
      const requestsSnapshot = await getDocs(requestsQuery);
      const requests: GDPRRightsRequest[] = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        userId,
        ...doc.data()
      } as GDPRRightsRequest));

      setRightsRequests(requests);
    } catch (err) {
      console.error('Error loading rights requests:', err);
      setError('Failed to load rights requests.');
    } finally {
      setLoading(false);
    }
  };

  const assessGDPRCompliance = async () => {
    try {
      const pendingActions: string[] = [];
      
      // Check data processing compliance
      let dataProcessingCompliance = true;
      processingRecords.forEach(record => {
        if (!record.legalBasis) {
          dataProcessingCompliance = false;
          pendingActions.push(`Define legal basis for ${record.dataType} processing`);
        }
        
        if (record.legalBasis === 'consent' && !record.consentGiven) {
          dataProcessingCompliance = false;
          pendingActions.push(`Obtain valid consent for ${record.dataType} processing`);
        }
        
        if (!record.dataMinimizationCompliant) {
          pendingActions.push(`Review data minimization for ${record.dataType}`);
        }
        
        if (!record.purposeLimitationCompliant) {
          pendingActions.push(`Ensure purpose limitation compliance for ${record.dataType}`);
        }
      });

      // Check consent management compliance
      const consentRecords = processingRecords.filter(r => r.legalBasis === 'consent');
      const consentManagementCompliance = consentRecords.every(r => 
        r.consentGiven && r.consentWithdrawable
      );

      // Check rights response compliance
      const pendingRequests = rightsRequests.filter(r => r.status === 'pending');
      const overdueRequests = rightsRequests.filter(r => {
        if (r.status !== 'pending') return false;
        const requestAge = Date.now() - new Date(r.requestDate).getTime();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        return requestAge > thirtyDays;
      });

      const rightsResponseCompliance = overdueRequests.length === 0;
      
      if (overdueRequests.length > 0) {
        pendingActions.push(`Respond to ${overdueRequests.length} overdue rights request(s)`);
      }

      const compliance: GDPRComplianceStatus = {
        overallCompliance: pendingActions.length === 0 ? 'compliant' : 
                          overdueRequests.length > 0 ? 'violation' : 'pending',
        dataProcessingCompliance,
        consentManagementCompliance,
        rightsResponseCompliance,
        dataProtectionOfficerContact: 'dpo@alchm.com',
        supervisoryAuthorityContact: 'Your local Data Protection Authority',
        lastAssessment: new Date().toISOString(),
        pendingActions
      };

      setComplianceStatus(compliance);
      onGDPRComplianceChange(compliance.overallCompliance);

    } catch (err) {
      console.error('Error assessing GDPR compliance:', err);
      setError('Failed to assess GDPR compliance.');
    }
  };

  const submitRightsRequest = async () => {
    if (!requestDetails.trim()) {
      setError('Please provide request details.');
      return;
    }

    try {
      const request: Omit<GDPRRightsRequest, 'id'> = {
        requestType,
        status: 'pending',
        requestDate: new Date().toISOString(),
        requestDetails: requestDetails.trim(),
        followUpRequired: false
      };

      const requestRef = doc(collection(db, 'gdpr_rights_requests'));
      await setDoc(requestRef, { ...request, userId });

      setRightsRequests(prev => [...prev, { id: requestRef.id, ...request }]);
      setShowRequestModal(false);
      setRequestDetails('');
      
      // Trigger automated processing for certain request types
      await processAutomatedRightsRequest(requestRef.id, requestType);

    } catch (err) {
      console.error('Error submitting rights request:', err);
      setError('Failed to submit rights request. Please try again.');
    }
  };

  const processAutomatedRightsRequest = async (requestId: string, type: GDPRRightsRequest['requestType']) => {
    try {
      switch (type) {
        case 'access':
          await processDataAccessRequest(requestId);
          break;
        case 'portability':
          await processDataPortabilityRequest(requestId);
          break;
        case 'erasure':
          await processDataErasureRequest(requestId);
          break;
        default:
          // Manual processing required
          break;
      }
    } catch (err) {
      console.error('Error processing automated rights request:', err);
    }
  };

  const processDataAccessRequest = async (requestId: string) => {
    try {
      // Collect all user data
      const userData = {
        personalData: {
          userId,
          location: userLocation,
          processingRecords: processingRecords.map(r => ({
            dataType: r.dataType,
            purpose: r.processingPurpose,
            legalBasis: r.legalBasis,
            retentionPeriod: r.retentionPeriod,
            thirdPartySharing: r.thirdPartySharing,
            thirdParties: r.thirdParties || []
          }))
        },
        rightsHistory: rightsRequests,
        dataExportDate: new Date().toISOString(),
        format: 'structured_json'
      };

      await updateDoc(doc(db, 'gdpr_rights_requests', requestId), {
        status: 'completed',
        completionDate: new Date().toISOString(),
        responseData: userData
      });

      // Update local state
      setRightsRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed', completionDate: new Date().toISOString(), responseData: userData }
          : req
      ));

    } catch (err) {
      console.error('Error processing data access request:', err);
    }
  };

  const processDataPortabilityRequest = async (requestId: string) => {
    try {
      // Export data in portable format
      const portableData = {
        userId,
        exportFormat: 'json',
        dataCategories: processingRecords.map(r => ({
          category: r.dataType,
          data: `[Data would be exported in machine-readable format]`,
          format: 'json'
        })),
        exportDate: new Date().toISOString(),
        rightsNotice: 'This data export is provided under GDPR Article 20 - Right to Data Portability'
      };

      await updateDoc(doc(db, 'gdpr_rights_requests', requestId), {
        status: 'completed',
        completionDate: new Date().toISOString(),
        responseData: portableData
      });

      setRightsRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed', completionDate: new Date().toISOString(), responseData: portableData }
          : req
      ));

    } catch (err) {
      console.error('Error processing data portability request:', err);
    }
  };

  const processDataErasureRequest = async (requestId: string) => {
    try {
      // Check if erasure is legally required
      const canErase = processingRecords.every(record => 
        record.legalBasis === 'consent' || 
        (record.legalBasis === 'legitimate_interest' && !record.thirdPartySharing)
      );

      if (!canErase) {
        await updateDoc(doc(db, 'gdpr_rights_requests', requestId), {
          status: 'rejected',
          completionDate: new Date().toISOString(),
          rejectionReason: 'Data erasure not possible due to legal obligations or overriding legitimate interests'
        });
        return;
      }

      // Mark for erasure (actual deletion would be handled by background job)
      await updateDoc(doc(db, 'gdpr_rights_requests', requestId), {
        status: 'completed',
        completionDate: new Date().toISOString(),
        responseData: {
          erasureScheduled: true,
          completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          notice: 'Your data will be permanently erased within 30 days unless legally required to retain'
        }
      });

    } catch (err) {
      console.error('Error processing data erasure request:', err);
    }
  };

  const updateConsentSettings = async (recordId: string, consentGiven: boolean) => {
    try {
      const record = processingRecords.find(r => r.id === recordId);
      if (!record || record.legalBasis !== 'consent') return;

      const updatedRecord = {
        ...record,
        consentGiven,
        consentDate: consentGiven ? new Date().toISOString() : undefined
      };

      await updateDoc(doc(db, 'data_processing_records', recordId), updatedRecord);
      
      setProcessingRecords(prev => prev.map(r => 
        r.id === recordId ? updatedRecord : r
      ));

      // Re-assess compliance after consent change
      await assessGDPRCompliance();

    } catch (err) {
      console.error('Error updating consent settings:', err);
      setError('Failed to update consent settings.');
    }
  };

  const downloadRightsRequestResponse = (request: GDPRRightsRequest) => {
    if (!request.responseData) return;

    const blob = new Blob([JSON.stringify(request.responseData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GDPR_${request.requestType}_response_${request.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Don't show GDPR interface for non-EU residents
  if (!userLocation.isEUResident) {
    return (
      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="text-center">
          <span className="text-4xl block mb-4">🌍</span>
          <h3 className="text-lg font-bold text-blue-800 mb-2">GDPR Rights Center</h3>
          <p className="text-blue-700">
            GDPR rights are available to EU residents. Your current location: {userLocation.country || 'Unknown'}
          </p>
          <p className="text-sm text-blue-600 mt-2">
            If you are an EU resident, please update your location in settings to access GDPR features.
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
          <p className="text-gray-600">Loading GDPR data subject rights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* GDPR Compliance Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🇪🇺</span>
          <div>
            <h3 className="text-xl font-bold text-blue-800">GDPR Data Subject Rights Center</h3>
            <p className="text-sm text-blue-700">
              European Union General Data Protection Regulation compliance for {userLocation.country} residents
            </p>
          </div>
        </div>

        {complianceStatus && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                complianceStatus.overallCompliance === 'compliant' ? 'bg-green-200 text-green-800' :
                complianceStatus.overallCompliance === 'violation' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {complianceStatus.overallCompliance.toUpperCase()}
              </span>
              <span className="text-blue-700">
                Last assessment: {new Date(complianceStatus.lastAssessment).toLocaleDateString()}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <div className={`text-lg font-bold ${complianceStatus.dataProcessingCompliance ? 'text-green-700' : 'text-red-700'}`}>
                  {complianceStatus.dataProcessingCompliance ? '✅' : '❌'}
                </div>
                <div className="text-sm text-blue-800">Data Processing</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <div className={`text-lg font-bold ${complianceStatus.consentManagementCompliance ? 'text-green-700' : 'text-red-700'}`}>
                  {complianceStatus.consentManagementCompliance ? '✅' : '❌'}
                </div>
                <div className="text-sm text-blue-800">Consent Management</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <div className={`text-lg font-bold ${complianceStatus.rightsResponseCompliance ? 'text-green-700' : 'text-red-700'}`}>
                  {complianceStatus.rightsResponseCompliance ? '✅' : '❌'}
                </div>
                <div className="text-sm text-blue-800">Rights Response</div>
              </div>
            </div>

            {complianceStatus.pendingActions.length > 0 && (
              <div className="bg-yellow-100 rounded-lg p-3 border border-yellow-200">
                <h5 className="font-bold text-yellow-800 mb-2">Pending Actions:</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {complianceStatus.pendingActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Your GDPR Rights */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <span>⚖️</span>
          Your GDPR Rights
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-bold text-green-800 mb-2">📋 Right of Access</h4>
            <p className="text-sm text-green-700 mb-3">
              Request a copy of all personal data we process about you.
            </p>
            <button
              onClick={() => { setRequestType('access'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Data Access
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">📤 Right to Data Portability</h4>
            <p className="text-sm text-blue-700 mb-3">
              Export your data in a machine-readable format.
            </p>
            <button
              onClick={() => { setRequestType('portability'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Export My Data
            </button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2">✏️ Right of Rectification</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Request correction of inaccurate personal data.
            </p>
            <button
              onClick={() => { setRequestType('rectification'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Data Correction
            </button>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-bold text-red-800 mb-2">🗑️ Right of Erasure</h4>
            <p className="text-sm text-red-700 mb-3">
              Request deletion of your personal data.
            </p>
            <button
              onClick={() => { setRequestType('erasure'); setShowRequestModal(true); }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Data Deletion
            </button>
          </div>
        </div>
      </div>

      {/* Data Processing Records */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
        <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <span>📊</span>
          Your Data Processing Records
        </h3>

        <div className="space-y-4">
          {processingRecords.map((record) => (
            <div key={record.id} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-purple-800">{record.dataType}</div>
                  <div className="text-sm text-purple-700">{record.processingPurpose}</div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    record.legalBasis === 'consent' ? 'bg-green-200 text-green-800' :
                    record.legalBasis === 'legitimate_interest' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {record.legalBasis.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="text-sm text-purple-700 grid md:grid-cols-2 gap-2 mb-3">
                <div><strong>Retention:</strong> {record.retentionPeriod} days</div>
                <div><strong>3rd Party Sharing:</strong> {record.thirdPartySharing ? 'Yes' : 'No'}</div>
                <div><strong>Automated:</strong> {record.automated ? 'Yes' : 'No'}</div>
                <div><strong>Data Minimization:</strong> {record.dataMinimizationCompliant ? '✅' : '❌'}</div>
              </div>

              {record.legalBasis === 'consent' && (
                <div className="bg-purple-100 rounded p-3 border border-purple-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-purple-800">Consent Status</div>
                      <div className="text-sm text-purple-700">
                        {record.consentGiven ? 
                          `Granted on ${record.consentDate ? new Date(record.consentDate).toLocaleDateString() : 'Unknown date'}` : 
                          'Not granted'
                        }
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateConsentSettings(record.id, !record.consentGiven)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          record.consentGiven 
                            ? 'bg-red-100 hover:bg-red-200 text-red-800' 
                            : 'bg-green-100 hover:bg-green-200 text-green-800'
                        }`}
                      >
                        {record.consentGiven ? 'Withdraw Consent' : 'Grant Consent'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rights Requests History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
        <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
          <span>📝</span>
          Rights Requests History
        </h3>

        {rightsRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📋</span>
            <p>No rights requests submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rightsRequests.map((request) => (
              <div key={request.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-orange-800 capitalize">
                      {request.requestType.replace('_', ' ')} Request
                    </div>
                    <div className="text-sm text-orange-700">
                      Submitted: {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    request.status === 'completed' ? 'bg-green-200 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    request.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {request.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-orange-700 mb-2">{request.requestDetails}</p>

                {request.status === 'completed' && request.responseData && (
                  <button
                    onClick={() => downloadRightsRequestResponse(request)}
                    className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-sm transition-colors"
                  >
                    📄 Download Response
                  </button>
                )}

                {request.status === 'rejected' && request.rejectionReason && (
                  <div className="bg-red-100 rounded p-2 border border-red-200 mt-2">
                    <div className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {request.rejectionReason}
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
            <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
              {requestType.replace('_', ' ')} Request
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Details
                </label>
                <textarea
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Please describe your request in detail..."
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <p><strong>Processing Time:</strong> We will respond within 30 days as required by GDPR.</p>
                <p><strong>Verification:</strong> We may request additional information to verify your identity.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRightsRequest}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      {complianceStatus && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-2">📞 Data Protection Contacts</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Data Protection Officer:</strong> <a href={`mailto:${complianceStatus.dataProtectionOfficerContact}`} className="text-blue-600 underline">{complianceStatus.dataProtectionOfficerContact}</a></p>
            <p><strong>Supervisory Authority:</strong> {complianceStatus.supervisoryAuthorityContact}</p>
            <p><strong>Your Location:</strong> {userLocation.country}, {userLocation.region}</p>
          </div>
        </div>
      )}

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