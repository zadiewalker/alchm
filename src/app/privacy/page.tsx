'use client';

import { useEffect, useState } from 'react';
import { onAuthChanged } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface UserPrivacySettings {
  dataProcessingConsent: {
    journalAnalysis: boolean;
    aiInsights: boolean;
    crisisMonitoring: boolean;
    analyticsParticipation: boolean;
    consentDate: Date;
    consentVersion: string;
  };
  dataRetention: {
    journalRetentionMonths: number;
    analysisRetentionMonths: number;
    automaticDeletion: boolean;
  };
  dataSharing: {
    allowAnonymizedResearch: boolean;
    allowTrendAnalysis: boolean;
    allowSystemImprovement: boolean;
  };
  communication: {
    privacyUpdates: boolean;
    dataProcessingNotifications: boolean;
    breachNotifications: boolean;
  };
}

interface DataExportRequest {
  id?: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'failed';
  requestedAt: Date;
  formats: string[];
  downloadUrl?: string;
  expiresAt?: Date;
}

interface PrivacyAuditEntry {
  action: string;
  timestamp: Date;
  details: string;
}

export default function PrivacyDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'export' | 'delete' | 'audit' | 'transparency'>('settings');
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>({
    dataProcessingConsent: {
      journalAnalysis: true,
      aiInsights: true,
      crisisMonitoring: true,
      analyticsParticipation: false,
      consentDate: new Date(),
      consentVersion: '1.0'
    },
    dataRetention: {
      journalRetentionMonths: 0, // 0 = indefinite
      analysisRetentionMonths: 24,
      automaticDeletion: false
    },
    dataSharing: {
      allowAnonymizedResearch: false,
      allowTrendAnalysis: true,
      allowSystemImprovement: true
    },
    communication: {
      privacyUpdates: true,
      dataProcessingNotifications: true,
      breachNotifications: true
    }
  });
  const [exportRequest, setExportRequest] = useState<DataExportRequest | null>(null);
  const [auditLog, setAuditLog] = useState<PrivacyAuditEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.push('/auth/login');
      } else {
        loadPrivacySettings(user.uid);
        loadAuditLog(user.uid);
        checkExportRequest(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadPrivacySettings = async (userId: string) => {
    try {
      const docRef = doc(db, 'userPrivacySettings', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPrivacySettings({
          ...privacySettings,
          ...data,
          dataProcessingConsent: {
            ...privacySettings.dataProcessingConsent,
            ...data.dataProcessingConsent,
            consentDate: data.dataProcessingConsent?.consentDate?.toDate() || new Date()
          }
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const loadAuditLog = (userId: string) => {
    const q = query(
      collection(db, 'privacyAuditLog'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        action: doc.data().action,
        timestamp: doc.data().timestamp.toDate(),
        details: doc.data().details
      })) as PrivacyAuditEntry[];
      setAuditLog(entries);
    });
  };

  const checkExportRequest = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'dataExportRequests'),
        where('userId', '==', userId),
        where('status', 'in', ['pending', 'processing', 'ready']),
        orderBy('requestedAt', 'desc')
      );
      
      const snapshot = await getDoc(doc(db, 'dataExportRequests', userId));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setExportRequest({
          id: snapshot.id,
          status: data.status,
          requestedAt: data.requestedAt.toDate(),
          formats: data.formats,
          downloadUrl: data.downloadUrl,
          expiresAt: data.expiresAt?.toDate()
        });
      }
    } catch (error) {
      console.error('Error checking export request:', error);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const settingsWithTimestamp = {
        ...privacySettings,
        userId: user.uid,
        lastUpdated: new Date(),
        dataProcessingConsent: {
          ...privacySettings.dataProcessingConsent,
          consentDate: new Date(),
          consentVersion: '1.0'
        }
      };

      await setDoc(doc(db, 'userPrivacySettings', user.uid), settingsWithTimestamp);
      
      // Log the privacy settings update
      await addDoc(collection(db, 'privacyAuditLog'), {
        userId: user.uid,
        action: 'privacy_settings_updated',
        timestamp: new Date(),
        details: 'User updated privacy preferences',
        legalBasis: 'consent'
      });

      alert('Privacy settings saved successfully');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      alert('Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const requestDataExport = async (formats: string[]) => {
    if (!user) return;

    try {
      const exportRequest = {
        userId: user.uid,
        requestedAt: new Date(),
        status: 'pending',
        formats,
        includeAnalyses: true,
        includeMetadata: true
      };

      await addDoc(collection(db, 'dataExportRequests'), exportRequest);
      
      // Log the export request
      await addDoc(collection(db, 'privacyAuditLog'), {
        userId: user.uid,
        action: 'data_exported',
        timestamp: new Date(),
        details: `User requested data export in formats: ${formats.join(', ')}`,
        legalBasis: 'consent'
      });

      setExportRequest({
        status: 'pending',
        requestedAt: new Date(),
        formats
      });

      alert('Data export request submitted. You will receive an email when your export is ready.');
    } catch (error) {
      console.error('Error requesting data export:', error);
      alert('Failed to request data export. Please try again.');
    }
  };

  const requestAccountDeletion = async () => {
    if (!user) return;
    
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone. ' +
      'You will have 30 days to cancel this request before your data is permanently deleted.'
    );
    
    if (!confirmed) return;

    try {
      const deletionRequest = {
        userId: user.uid,
        userEmail: user.email,
        requestedAt: new Date(),
        verificationToken: Math.random().toString(36).substring(2, 15),
        verified: false,
        status: 'pending_verification',
        scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancellationDeadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000), // 29 days
        retainForLegal: false
      };

      await addDoc(collection(db, 'accountDeletionRequests'), deletionRequest);
      
      // Log the deletion request
      await addDoc(collection(db, 'privacyAuditLog'), {
        userId: user.uid,
        action: 'account_deletion_requested',
        timestamp: new Date(),
        details: 'User requested account deletion with 30-day grace period',
        legalBasis: 'consent'
      });

      alert('Account deletion request submitted. Please check your email for verification instructions.');
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      alert('Failed to request account deletion. Please try again.');
    }
  };

  const updateConsent = (category: keyof UserPrivacySettings['dataProcessingConsent'], value: boolean) => {
    if (category === 'consentDate' || category === 'consentVersion') return;
    
    setPrivacySettings(prev => ({
      ...prev,
      dataProcessingConsent: {
        ...prev.dataProcessingConsent,
        [category]: value,
        consentDate: new Date(),
        consentVersion: '1.0'
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 flex items-center justify-center">
        <div className="text-xl text-green-800">Loading privacy dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-green-900">Privacy & Data Control</h1>
            <p className="text-green-700 mt-2">Manage your personal data with complete transparency and control</p>
          </div>
          <a 
            href="/dashboard" 
            className="px-4 py-2 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">🛡️ Your Privacy Rights</h3>
          <p className="text-blue-800 text-sm">
            Under GDPR, CCPA, and other privacy laws, you have the right to know what data we collect, 
            how it's used, request a copy of your data, correct inaccuracies, and delete your account. 
            This dashboard gives you complete control over your personal information.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { key: 'settings', label: 'Privacy Settings', icon: '⚙️' },
            { key: 'export', label: 'Data Export', icon: '📦' },
            { key: 'delete', label: 'Account Deletion', icon: '🗑️' },
            { key: 'audit', label: 'Activity Log', icon: '📋' },
            { key: 'transparency', label: 'Transparency', icon: '👁️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-3 rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-green-600 text-white'
                  : 'text-green-700 hover:bg-green-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100">
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-6">Privacy & Consent Settings</h2>
              
              {/* Data Processing Consent */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-green-800 mb-4">Data Processing Consent</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Journal AI Analysis</div>
                      <div className="text-sm text-green-700">Allow AI to analyze your journal entries for insights and therapeutic support</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.dataProcessingConsent.journalAnalysis}
                      onChange={(e) => updateConsent('journalAnalysis', e.target.checked)}
                      className="w-5 h-5 text-green-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Crisis Monitoring</div>
                      <div className="text-sm text-green-700">Enable safety monitoring to detect potential crisis situations (recommended)</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.dataProcessingConsent.crisisMonitoring}
                      onChange={(e) => updateConsent('crisisMonitoring', e.target.checked)}
                      className="w-5 h-5 text-green-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Analytics Participation</div>
                      <div className="text-sm text-green-700">Share anonymized usage data to help improve ALCHM for all users</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.dataProcessingConsent.analyticsParticipation}
                      onChange={(e) => updateConsent('analyticsParticipation', e.target.checked)}
                      className="w-5 h-5 text-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-green-800 mb-4">Data Retention Preferences</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-900 mb-2">Journal Entry Retention</label>
                    <select
                      value={privacySettings.dataRetention.journalRetentionMonths}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        dataRetention: {
                          ...prev.dataRetention,
                          journalRetentionMonths: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="0">Keep indefinitely (until I delete my account)</option>
                      <option value="12">Delete after 12 months</option>
                      <option value="24">Delete after 24 months</option>
                      <option value="36">Delete after 36 months</option>
                      <option value="60">Delete after 60 months (maximum)</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-900 mb-2">AI Analysis Retention</label>
                    <select
                      value={privacySettings.dataRetention.analysisRetentionMonths}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        dataRetention: {
                          ...prev.dataRetention,
                          analysisRetentionMonths: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="12">Delete after 12 months</option>
                      <option value="24">Delete after 24 months (recommended)</option>
                      <option value="36">Delete after 36 months</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={savePrivacySettings}
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-medium ${
                  saving
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } transition-colors`}
              >
                {saving ? 'Saving...' : 'Save Privacy Settings'}
              </button>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-6">Download Your Data</h2>
              
              {exportRequest?.status === 'pending' || exportRequest?.status === 'processing' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Export In Progress</h3>
                  <p className="text-blue-700 mt-2">
                    Your data export is being prepared. You'll receive an email when it's ready to download.
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Requested on: {exportRequest.requestedAt.toLocaleDateString()}
                  </p>
                </div>
              ) : exportRequest?.status === 'ready' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-green-900">Export Ready</h3>
                  <p className="text-green-700 mt-2">Your data export is ready for download.</p>
                  <a
                    href={exportRequest.downloadUrl}
                    className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download Data Package
                  </a>
                  <p className="text-sm text-green-600 mt-2">
                    Expires: {exportRequest.expiresAt?.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Download a complete copy of your personal data stored in ALCHM. 
                    Your export will include journal entries, AI analyses, and account information.
                  </p>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Choose Export Formats:</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>JSON (machine-readable, for importing to other services)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>CSV (spreadsheet format for analysis)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>PDF (human-readable report)</span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => requestDataExport(['json', 'csv'])}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Data Export
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    <p>• Export processing typically takes 24-48 hours</p>
                    <p>• You'll receive an email when your export is ready</p>
                    <p>• Download links expire after 30 days for security</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-6">Account Deletion</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-red-900">⚠️ Permanent Action</h3>
                <p className="text-red-700 mt-2">
                  Account deletion permanently removes all your data from ALCHM. This includes:
                </p>
                <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
                  <li>All journal entries and personal content</li>
                  <li>AI analyses and insights</li>
                  <li>Account information and preferences</li>
                  <li>Export and privacy settings</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900">30-Day Grace Period</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    You have 30 days to cancel your deletion request. During this time, 
                    your account will be deactivated but your data will remain recoverable.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900">Consider Data Export First</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Before deleting your account, consider downloading your data. 
                    Your journal entries may have personal value worth preserving.
                  </p>
                </div>
                
                <button
                  onClick={requestAccountDeletion}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Request Account Deletion
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-6">Privacy Activity Log</h2>
              
              <p className="text-gray-700 mb-6">
                This log shows all privacy-related actions on your account for transparency and security.
              </p>
              
              <div className="space-y-3">
                {auditLog.length === 0 ? (
                  <p className="text-gray-500 italic">No privacy activities logged yet.</p>
                ) : (
                  auditLog.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {entry.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-600">{entry.details}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'transparency' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-6">Data Processing Transparency</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3">What Data We Collect</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li><strong>Account Information:</strong> Email address, encrypted password, account creation date</li>
                    <li><strong>Journal Content:</strong> Your written entries, timestamps, word counts</li>
                    <li><strong>AI Analysis Data:</strong> Emotional insights, therapeutic suggestions, crisis assessments</li>
                    <li><strong>Usage Analytics:</strong> Login frequency, feature usage (only if consented)</li>
                    <li><strong>Technical Data:</strong> IP address for security, device information for optimization</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-3">How We Use Your Data</h3>
                  <ul className="space-y-2 text-green-800">
                    <li><strong>Therapeutic Support:</strong> Provide AI-driven insights and mental health support</li>
                    <li><strong>Safety Monitoring:</strong> Detect crisis situations and provide appropriate resources</li>
                    <li><strong>Service Improvement:</strong> Enhance features and user experience (anonymized data only)</li>
                    <li><strong>Communication:</strong> Send important updates about your account and privacy</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-3">Data Protection Measures</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li><strong>Encryption:</strong> All data encrypted in transit and at rest using industry standards</li>
                    <li><strong>Access Controls:</strong> Strict role-based access with multi-factor authentication</li>
                    <li><strong>Data Minimization:</strong> We collect only what's necessary for service functionality</li>
                    <li><strong>Regular Audits:</strong> Quarterly security reviews and vulnerability assessments</li>
                    <li><strong>Privacy by Design:</strong> All features built with privacy protection as the default</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Your Rights Under Privacy Laws</h3>
                  <ul className="space-y-2 text-gray-800">
                    <li><strong>Right to Know:</strong> Understand what data we collect and how it's used</li>
                    <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Right to Rectification:</strong> Correct any inaccurate personal information</li>
                    <li><strong>Right to Erasure:</strong> Delete your data and account permanently</li>
                    <li><strong>Right to Portability:</strong> Export your data in standard formats</li>
                    <li><strong>Right to Object:</strong> Withdraw consent for specific data processing</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-green-700">
          <p>
            Questions about your privacy? Contact us at{' '}
            <a href="mailto:privacy@alchm.app" className="underline">privacy@alchm.app</a>
          </p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString()} | Privacy Policy Version 1.0
          </p>
        </div>
      </div>
    </div>
  );
}