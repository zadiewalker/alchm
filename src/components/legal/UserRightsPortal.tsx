'use client';

/**
 * ALCHM User Rights Portal
 * Comprehensive interface for GDPR/CCPA data subject rights
 * Supports data export, deletion, correction, and consent management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface DataExportRequest {
  id: string;
  requestType: 'full_export' | 'partial_export' | 'consent_history' | 'processing_log';
  format: 'json' | 'csv' | 'pdf' | 'xml';
  status: 'pending' | 'processing' | 'ready' | 'downloaded' | 'expired';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt: string;
  fileSize?: number;
  sections: string[];
}

interface DataDeletionRequest {
  id: string;
  deletionType: 'account_deletion' | 'partial_deletion' | 'consent_withdrawal';
  status: 'pending_verification' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  requestedAt: string;
  completedAt?: string;
  verificationCode?: string;
  dataTypes: string[];
  retentionExceptions: string[];
  confirmationRequired: boolean;
}

interface DataCorrectionRequest {
  id: string;
  field: string;
  currentValue: string;
  requestedValue: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

interface UserDataSummary {
  accountInfo: {
    email: string;
    displayName: string;
    createdAt: string;
    lastLoginAt: string;
    accountStatus: string;
  };
  journalData: {
    entryCount: number;
    totalWords: number;
    dateRange: { from: string; to: string };
    moodDataPoints: number;
  };
  aiInteractions: {
    totalInteractions: number;
    insightsGenerated: number;
    lastInteraction: string;
  };
  consentStatus: {
    granted: string[];
    withdrawn: string[];
    lastUpdated: string;
  };
  dataProcessing: {
    purposes: string[];
    legalBases: string[];
    thirdParties: string[];
    retentionPeriods: Record<string, string>;
  };
}

export default function UserRightsPortal() {
  const [user, loading, error] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'export' | 'delete' | 'correct' | 'consent'>('overview');
  const [userDataSummary, setUserDataSummary] = useState<UserDataSummary | null>(null);
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<DataDeletionRequest[]>([]);
  const [correctionRequests, setCorrectionRequests] = useState<DataCorrectionRequest[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteVerificationCode, setDeleteVerificationCode] = useState('');

  useEffect(() => {
    if (user) {
      loadUserDataSummary();
      loadExistingRequests();
    }
  }, [user]);

  const loadUserDataSummary = async () => {
    // In production, this would fetch from secure API
    const mockData: UserDataSummary = {
      accountInfo: {
        email: user?.email || '',
        displayName: user?.displayName || 'Anonymous User',
        createdAt: '2024-01-15',
        lastLoginAt: new Date().toISOString(),
        accountStatus: 'active'
      },
      journalData: {
        entryCount: 127,
        totalWords: 45230,
        dateRange: { from: '2024-01-15', to: new Date().toISOString() },
        moodDataPoints: 89
      },
      aiInteractions: {
        totalInteractions: 342,
        insightsGenerated: 156,
        lastInteraction: new Date().toISOString()
      },
      consentStatus: {
        granted: ['essential_services', 'ai_processing', 'crisis_detection'],
        withdrawn: ['analytics_improvement'],
        lastUpdated: '2024-03-15'
      },
      dataProcessing: {
        purposes: ['Service Delivery', 'AI Insights', 'Crisis Detection', 'Account Management'],
        legalBases: ['Contract', 'Consent', 'Vital Interest'],
        thirdParties: ['Firebase (Google)', 'Khepera AI'],
        retentionPeriods: {
          'Account Data': 'Until account deletion',
          'Journal Content': 'Until user deletion',
          'AI Interactions': 'Immediate deletion after processing',
          'Crisis Logs': '72 hours maximum'
        }
      }
    };

    setUserDataSummary(mockData);
  };

  const loadExistingRequests = () => {
    const storedExports = localStorage.getItem('alchm_export_requests');
    const storedDeletions = localStorage.getItem('alchm_deletion_requests');
    const storedCorrections = localStorage.getItem('alchm_correction_requests');

    if (storedExports) {
      try {
        setExportRequests(JSON.parse(storedExports));
      } catch (error) {
        console.warn('Failed to load export requests');
      }
    }

    if (storedDeletions) {
      try {
        setDeletionRequests(JSON.parse(storedDeletions));
      } catch (error) {
        console.warn('Failed to load deletion requests');
      }
    }

    if (storedCorrections) {
      try {
        setCorrectionRequests(JSON.parse(storedCorrections));
      } catch (error) {
        console.warn('Failed to load correction requests');
      }
    }
  };

  const requestDataExport = useCallback(async (
    exportType: DataExportRequest['requestType'],
    format: DataExportRequest['format'],
    sections: string[]
  ) => {
    const newRequest: DataExportRequest = {
      id: `export_${Date.now()}`,
      requestType: exportType,
      format,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      sections
    };

    const updatedRequests = [...exportRequests, newRequest];
    setExportRequests(updatedRequests);
    localStorage.setItem('alchm_export_requests', JSON.stringify(updatedRequests));

    // Simulate processing
    setTimeout(() => {
      simulateExportProcessing(newRequest.id);
    }, 3000);

    alert(`Export request submitted! You'll receive an email when your ${format.toUpperCase()} export is ready.`);
  }, [exportRequests]);

  const simulateExportProcessing = (requestId: string) => {
    setExportRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'ready' as const,
          completedAt: new Date().toISOString(),
          downloadUrl: `/downloads/${requestId}.${req.format}`,
          fileSize: Math.floor(Math.random() * 10000000) + 1000000 // 1-10MB
        };
      }
      return req;
    }));
  };

  const downloadExport = (request: DataExportRequest) => {
    if (request.status === 'ready' && request.downloadUrl) {
      // In production, this would download the actual file
      const exportData = generateMockExportData(request);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alchm-export-${request.id}.${request.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Mark as downloaded
      setExportRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'downloaded' as const } : req
      ));
    }
  };

  const generateMockExportData = (request: DataExportRequest): string => {
    const exportData = {
      exportInfo: {
        requestId: request.id,
        exportType: request.requestType,
        generatedAt: new Date().toISOString(),
        dataController: 'ALCHM Digital Sanctuary',
        format: request.format
      },
      userData: userDataSummary,
      journalEntries: request.sections.includes('journal') ? [
        {
          id: '1',
          date: '2024-03-15',
          content: '[ENCRYPTED] - Your journal content would be decrypted for export',
          mood: 'hopeful',
          tags: ['reflection', 'growth']
        }
      ] : [],
      aiInteractions: request.sections.includes('ai') ? [
        {
          timestamp: '2024-03-15T10:30:00Z',
          userInput: '[ENCRYPTED]',
          aiResponse: '[ENCRYPTED]',
          type: 'insight_generation'
        }
      ] : [],
      consentHistory: request.sections.includes('consent') ? [
        {
          timestamp: '2024-01-15T09:00:00Z',
          item: 'essential_services',
          action: 'granted',
          method: 'web_form'
        }
      ] : []
    };

    if (request.format === 'json') {
      return JSON.stringify(exportData, null, 2);
    } else if (request.format === 'csv') {
      // Convert to CSV format
      return 'Export Type,Data,Generated At\nFull Export,User Data,' + new Date().toISOString();
    } else {
      return JSON.stringify(exportData, null, 2);
    }
  };

  const requestAccountDeletion = useCallback(async () => {
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newRequest: DataDeletionRequest = {
      id: `delete_${Date.now()}`,
      deletionType: 'account_deletion',
      status: 'pending_verification',
      requestedAt: new Date().toISOString(),
      verificationCode,
      dataTypes: ['all_personal_data'],
      retentionExceptions: ['Legal compliance logs (anonymized)'],
      confirmationRequired: true
    };

    const updatedRequests = [...deletionRequests, newRequest];
    setDeletionRequests(updatedRequests);
    localStorage.setItem('alchm_deletion_requests', JSON.stringify(updatedRequests));

    alert(
      `Account deletion request initiated. ` +
      `Verification code: ${verificationCode} ` +
      `(In production, this would be sent to your email)`
    );

    setShowDeleteConfirmation(true);
  }, [deletionRequests]);

  const confirmAccountDeletion = () => {
    const latestRequest = deletionRequests[deletionRequests.length - 1];
    
    if (latestRequest && deleteVerificationCode === latestRequest.verificationCode) {
      setDeletionRequests(prev => prev.map(req => 
        req.id === latestRequest.id ? { 
          ...req, 
          status: 'confirmed' as const 
        } : req
      ));

      setShowDeleteConfirmation(false);
      alert(
        'Account deletion confirmed. Your account and all data will be permanently deleted within 30 days. ' +
        'You can cancel this request by contacting privacy@alchm.app within 7 days.'
      );
    } else {
      alert('Invalid verification code. Please check the code sent to your email.');
    }
  };

  const requestDataCorrection = useCallback(async (
    field: string,
    currentValue: string,
    requestedValue: string,
    justification: string
  ) => {
    const newRequest: DataCorrectionRequest = {
      id: `correct_${Date.now()}`,
      field,
      currentValue,
      requestedValue,
      justification,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    const updatedRequests = [...correctionRequests, newRequest];
    setCorrectionRequests(updatedRequests);
    localStorage.setItem('alchm_correction_requests', JSON.stringify(updatedRequests));

    alert('Data correction request submitted. We\'ll review it within 30 days.');
  }, [correctionRequests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your privacy dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h2 className="text-xl font-bold">Authentication Required</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Please sign in to access your privacy dashboard and exercise your data rights.
            </p>
            <Button onClick={() => window.location.href = '/auth/login'} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <h1 className="text-2xl font-bold text-blue-900">Your Privacy Rights Portal</h1>
          <p className="text-blue-700">
            Exercise your data protection rights under GDPR, CCPA, and other privacy laws.
            You have complete control over your personal information.
          </p>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Data Overview', icon: '📊' },
          { id: 'export', label: 'Export Data', icon: '📥' },
          { id: 'delete', label: 'Delete Data', icon: '🗑️' },
          { id: 'correct', label: 'Correct Data', icon: '✏️' },
          { id: 'consent', label: 'Consent Settings', icon: '🛡️' }
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
      {activeTab === 'overview' && userDataSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Account Information</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Email:</strong> {userDataSummary.accountInfo.email}</div>
              <div><strong>Display Name:</strong> {userDataSummary.accountInfo.displayName}</div>
              <div><strong>Account Created:</strong> {new Date(userDataSummary.accountInfo.createdAt).toLocaleDateString()}</div>
              <div><strong>Last Login:</strong> {new Date(userDataSummary.accountInfo.lastLoginAt).toLocaleDateString()}</div>
              <div><strong>Status:</strong> <span className="text-green-600 capitalize">{userDataSummary.accountInfo.accountStatus}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Journal Data Summary</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Total Entries:</strong> {userDataSummary.journalData.entryCount}</div>
              <div><strong>Total Words:</strong> {userDataSummary.journalData.totalWords.toLocaleString()}</div>
              <div><strong>Mood Data Points:</strong> {userDataSummary.journalData.moodDataPoints}</div>
              <div><strong>Date Range:</strong> {new Date(userDataSummary.journalData.dateRange.from).toLocaleDateString()} - {new Date(userDataSummary.journalData.dateRange.to).toLocaleDateString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">AI Interactions</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Total Interactions:</strong> {userDataSummary.aiInteractions.totalInteractions}</div>
              <div><strong>Insights Generated:</strong> {userDataSummary.aiInteractions.insightsGenerated}</div>
              <div><strong>Last Interaction:</strong> {new Date(userDataSummary.aiInteractions.lastInteraction).toLocaleDateString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Data Processing</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Processing Purposes:</strong> {userDataSummary.dataProcessing.purposes.join(', ')}</div>
              <div><strong>Legal Bases:</strong> {userDataSummary.dataProcessing.legalBases.join(', ')}</div>
              <div><strong>Third Parties:</strong> {userDataSummary.dataProcessing.thirdParties.join(', ')}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Request Data Export</h3>
              <p className="text-gray-600">Download a copy of all your personal data</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => requestDataExport('full_export', 'json', ['account', 'journal', 'ai', 'consent'])}
                  className="w-full"
                >
                  📄 Full Data Export (JSON)
                </Button>
                <Button
                  onClick={() => requestDataExport('consent_history', 'pdf', ['consent'])}
                  variant="outline"
                  className="w-full"
                >
                  📋 Consent History (PDF)
                </Button>
                <Button
                  onClick={() => requestDataExport('partial_export', 'csv', ['journal'])}
                  variant="outline"
                  className="w-full"
                >
                  📊 Journal Data (CSV)
                </Button>
                <Button
                  onClick={() => requestDataExport('processing_log', 'json', ['ai'])}
                  variant="outline"
                  className="w-full"
                >
                  🤖 AI Processing Log (JSON)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Requests */}
          {exportRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Export Requests</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{request.requestType.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-sm text-gray-600">
                          {request.format.toUpperCase()} • Requested {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                        <div className={`text-xs font-medium ${
                          request.status === 'ready' ? 'text-green-600' :
                          request.status === 'processing' ? 'text-blue-600' :
                          request.status === 'downloaded' ? 'text-gray-600' :
                          'text-yellow-600'
                        }`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      {request.status === 'ready' && (
                        <Button onClick={() => downloadExport(request)} size="sm">
                          📥 Download ({(request.fileSize! / 1024 / 1024).toFixed(1)}MB)
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Delete Tab */}
      {activeTab === 'delete' && (
        <div className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <h3 className="text-lg font-semibold text-red-800">Delete Your Data</h3>
              <p className="text-red-700">
                ⚠️ <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h4 className="font-medium mb-2">What will be deleted:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• All journal entries and personal content</li>
                  <li>• Account information and preferences</li>
                  <li>• AI interaction history</li>
                  <li>• Mood tracking data</li>
                  <li>• All personal identifiers</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium mb-2">What we may retain (anonymized):</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Anonymous usage statistics for service improvement</li>
                  <li>• Legal compliance logs (no personal identifiers)</li>
                  <li>• Anonymized research data (if previously consented)</li>
                </ul>
              </div>

              <Button
                onClick={requestAccountDeletion}
                variant="destructive"
                className="w-full"
                disabled={deletionRequests.some(req => req.status === 'pending_verification')}
              >
                🗑️ Delete My Account and All Data
              </Button>
            </CardContent>
          </Card>

          {/* Deletion Requests */}
          {deletionRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Deletion Requests</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deletionRequests.map(request => (
                    <div key={request.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{request.deletionType.replace('_', ' ').toUpperCase()}</div>
                          <div className="text-sm text-gray-600">
                            Requested {new Date(request.requestedAt).toLocaleDateString()}
                          </div>
                          <div className={`text-xs font-medium mt-1 ${
                            request.status === 'completed' ? 'text-green-600' :
                            request.status === 'processing' ? 'text-blue-600' :
                            request.status === 'pending_verification' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Correct Tab */}
      {activeTab === 'correct' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Request Data Correction</h3>
              <p className="text-gray-600">Correct any inaccurate personal information</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                requestDataCorrection(
                  formData.get('field') as string,
                  formData.get('currentValue') as string,
                  formData.get('requestedValue') as string,
                  formData.get('justification') as string
                );
                (e.target as HTMLFormElement).reset();
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field to Correct
                  </label>
                  <select name="field" required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select a field</option>
                    <option value="email">Email Address</option>
                    <option value="display_name">Display Name</option>
                    <option value="preferences">Account Preferences</option>
                    <option value="other">Other (specify in justification)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Value
                  </label>
                  <input
                    type="text"
                    name="currentValue"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="What is currently stored"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Value
                  </label>
                  <input
                    type="text"
                    name="requestedValue"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="What it should be"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Justification
                  </label>
                  <textarea
                    name="justification"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Explain why this correction is needed"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Correction Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Correction Requests */}
          {correctionRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Correction Requests</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {correctionRequests.map(request => (
                    <div key={request.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{request.field.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div><strong>From:</strong> {request.currentValue}</div>
                        <div><strong>To:</strong> {request.requestedValue}</div>
                        <div><strong>Reason:</strong> {request.justification}</div>
                      </div>
                      <div className={`text-xs font-medium mt-2 ${
                        request.status === 'completed' ? 'text-green-600' :
                        request.status === 'approved' ? 'text-blue-600' :
                        request.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Consent Tab */}
      {activeTab === 'consent' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Consent Management</h3>
            <p className="text-gray-600">Manage your consent preferences</p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Consent management is handled through our dedicated Consent Management System.
              </p>
              <Button onClick={() => window.location.href = '/consent'}>
                🛡️ Open Consent Center
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-800">Confirm Account Deletion</h3>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-700">
                Enter the verification code sent to your email to confirm account deletion:
              </p>
              
              <input
                type="text"
                value={deleteVerificationCode}
                onChange={(e) => setDeleteVerificationCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-center uppercase"
                maxLength={6}
              />
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowDeleteConfirmation(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAccountDeletion}
                  variant="destructive"
                  className="flex-1"
                  disabled={deleteVerificationCode.length !== 6}
                >
                  Confirm Deletion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <strong>Need Help?</strong> Contact our Privacy Team at{' '}
              <a href="mailto:privacy@alchm.app" className="text-blue-600 hover:underline">
                privacy@alchm.app
              </a>
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="/privacy-policy.html" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              <a href="/terms.html" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
              <a href="/gdpr.html" className="text-blue-600 hover:underline">
                GDPR Information
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}