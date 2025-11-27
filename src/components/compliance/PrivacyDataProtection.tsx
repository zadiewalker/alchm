'use client';

import { useState, useEffect } from 'react';
import { Shield, Download, Trash2, Eye, EyeOff, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  collected: boolean;
  required: boolean;
  purpose: string;
  retention: string;
  sharing: 'none' | 'aggregated' | 'anonymized';
  userControl: 'full' | 'limited' | 'none';
}

interface PrivacySettings {
  analytics: boolean;
  crashReporting: boolean;
  personalizedContent: boolean;
  marketingCommunications: boolean;
  dataSharing: boolean;
  locationTracking: boolean;
}

interface ConsentRecord {
  type: string;
  granted: boolean;
  timestamp: Date;
  version: string;
}

const DATA_CATEGORIES: DataCategory[] = [
  {
    id: 'journal_entries',
    name: 'Journal Entries',
    description: 'Your personal writing, thoughts, and reflections',
    collected: true,
    required: true,
    purpose: 'Core app functionality - storing and analyzing your journal entries',
    retention: 'Until you delete them or close your account',
    sharing: 'none',
    userControl: 'full'
  },
  {
    id: 'emotional_data',
    name: 'Emotional Patterns',
    description: 'AI-generated insights about your emotional patterns',
    collected: true,
    required: false,
    purpose: 'Providing personalized insights and recommendations',
    retention: '90 days from generation',
    sharing: 'anonymized',
    userControl: 'full'
  },
  {
    id: 'usage_analytics',
    name: 'Usage Analytics',
    description: 'How you interact with the app (anonymized)',
    collected: true,
    required: false,
    purpose: 'Improving app performance and user experience',
    retention: '24 months in anonymized form',
    sharing: 'aggregated',
    userControl: 'full'
  },
  {
    id: 'technical_data',
    name: 'Technical Data',
    description: 'Device type, app version, crash reports',
    collected: true,
    required: true,
    purpose: 'Bug fixes, security, and app stability',
    retention: '12 months',
    sharing: 'anonymized',
    userControl: 'limited'
  },
  {
    id: 'account_info',
    name: 'Account Information',
    description: 'Email, age verification, subscription status',
    collected: true,
    required: true,
    purpose: 'Account management and legal compliance',
    retention: 'Until account deletion + 30 days for legal requirements',
    sharing: 'none',
    userControl: 'limited'
  }
];

const NEVER_COLLECTED = [
  'Location data or GPS coordinates',
  'Camera or photo access',
  'Microphone or audio recordings',
  'Contacts or address book',
  'Social media connections',
  'Biometric data',
  'Financial information (beyond subscription status)',
  'Health records or medical information'
];

export function PrivacyDataProtection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'data' | 'requests'>('overview');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    analytics: true,
    crashReporting: true,
    personalizedContent: true,
    marketingCommunications: false,
    dataSharing: false,
    locationTracking: false
  });
  const [consentHistory, setConsentHistory] = useState<ConsentRecord[]>([]);
  const [isMinor, setIsMinor] = useState<boolean | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    // Check if user is under 18 for COPPA compliance
    const birthYear = localStorage.getItem('user_birth_year');
    if (birthYear) {
      const age = new Date().getFullYear() - parseInt(birthYear);
      setIsMinor(age < 18);
    }

    // Load consent history
    const savedConsent = localStorage.getItem('alchm_consent_history');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsentHistory(parsed.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        })));
      } catch (error) {
        console.error('Failed to parse consent history:', error);
      }
    }
  }, []);

  const updatePrivacySetting = (setting: keyof PrivacySettings, value: boolean) => {
    const newSettings = { ...privacySettings, [setting]: value };
    setPrivacySettings(newSettings);
    
    // Record consent change
    const consentRecord: ConsentRecord = {
      type: setting,
      granted: value,
      timestamp: new Date(),
      version: '1.0.0'
    };
    
    const newHistory = [consentRecord, ...consentHistory];
    setConsentHistory(newHistory);
    
    // Save to localStorage
    localStorage.setItem('alchm_privacy_settings', JSON.stringify(newSettings));
    localStorage.setItem('alchm_consent_history', JSON.stringify(newHistory));

    // Log analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'privacy_setting_changed', {
        setting_name: setting,
        setting_value: value,
        user_type: isMinor ? 'minor' : 'adult'
      });
    }
  };

  const exportUserData = async () => {
    try {
      const response = await fetch('/api/privacy/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `alchm-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('Your data export has been downloaded successfully.');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Data export failed:', error);
      alert('Failed to export data. Please try again or contact support.');
    }
  };

  const requestDataDeletion = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete all your data? This action cannot be undone. ' +
      'Your journal entries, insights, and account will be permanently deleted.'
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch('/api/privacy/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert('Your data deletion request has been submitted. All data will be deleted within 30 days.');
        // Redirect to deletion confirmation page
        window.location.href = '/data-deletion-confirmation';
      } else {
        throw new Error('Deletion request failed');
      }
    } catch (error) {
      console.error('Data deletion request failed:', error);
      alert('Failed to submit deletion request. Please contact support.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Privacy-First Design</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              ALCHM is built with privacy as a core principle. Your journal entries are encrypted, 
              stored locally first, and you maintain full control over your data. We never sell 
              personal information and minimize data collection to only what's necessary for core functionality.
            </p>
          </div>
        </div>
      </div>

      {isMinor && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">COPPA Protection Active</h4>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Additional privacy protections are active for users under 18. Data collection is 
                further minimized, and parental consent may be required for certain features.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">What We Collect</h4>
          <ul className="text-sm text-green-800 space-y-1">
            {DATA_CATEGORIES.filter(cat => cat.collected).map(cat => (
              <li key={cat.id} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">What We Never Collect</h4>
          <ul className="text-sm text-red-800 space-y-1">
            {NEVER_COLLECTED.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-red-600" />
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="text-xs text-red-700 underline mt-2"
          >
            {showDetailedView ? 'Show less' : `View all ${NEVER_COLLECTED.length} items`}
          </button>
          {showDetailedView && (
            <ul className="text-sm text-red-800 space-y-1 mt-2">
              {NEVER_COLLECTED.slice(4).map((item, index) => (
                <li key={index + 4} className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-red-600" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Your Rights & Controls</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Access & Export</h5>
            <p className="text-gray-600">Download all your data in a portable format</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Correction</h5>
            <p className="text-gray-600">Edit or correct any personal information</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Deletion</h5>
            <p className="text-gray-600">Permanently delete your account and all data</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Privacy Controls</h4>
        
        <div className="space-y-4">
          {Object.entries(privacySettings).map(([key, value]) => {
            const setting = key as keyof PrivacySettings;
            const settingInfo = {
              analytics: {
                label: 'Usage Analytics',
                description: 'Help improve the app by sharing anonymous usage patterns'
              },
              crashReporting: {
                label: 'Crash Reporting',
                description: 'Automatically report crashes to help fix bugs (recommended)'
              },
              personalizedContent: {
                label: 'Personalized Insights',
                description: 'Allow AI to provide personalized recommendations based on your journals'
              },
              marketingCommunications: {
                label: 'Marketing Communications',
                description: 'Receive emails about new features and wellness tips'
              },
              dataSharing: {
                label: 'Research Participation',
                description: 'Allow anonymized data to be used for mental health research'
              },
              locationTracking: {
                label: 'Location Services',
                description: 'Currently not used - this setting is reserved for future features'
              }
            };

            return (
              <div key={key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900">{settingInfo[setting].label}</h5>
                    {isMinor && ['marketingCommunications', 'dataSharing'].includes(setting) && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Parental Consent Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{settingInfo[setting].description}</p>
                </div>
                <button
                  onClick={() => updatePrivacySetting(setting, !value)}
                  disabled={isMinor && ['marketingCommunications', 'dataSharing'].includes(setting)}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-300'
                  } ${isMinor && ['marketingCommunications', 'dataSharing'].includes(setting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDataCategory = () => (
    <div className="space-y-4">
      {DATA_CATEGORIES.map(category => (
        <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {category.collected ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                category.required ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {category.required ? 'Required' : 'Optional'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-800 mb-1">Purpose</h5>
              <p className="text-gray-600">{category.purpose}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-1">Retention</h5>
              <p className="text-gray-600">{category.retention}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-1">Sharing</h5>
              <p className="text-gray-600 capitalize">{category.sharing}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-1">Your Control</h5>
              <p className="text-gray-600 capitalize">{category.userControl}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">Export Your Data</h4>
              <p className="text-sm text-gray-600">Download all your information</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Get a copy of all your journal entries, insights, and account data in JSON format.
          </p>
          <button
            onClick={exportUserData}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download My Data
          </button>
        </div>

        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-600">Permanently remove all data</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            This will permanently delete your account, journal entries, and all associated data. 
            This action cannot be undone.
          </p>
          <button
            onClick={requestDataDeletion}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      </div>

      {consentHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Consent History</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {consentHistory.slice(0, 10).map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <span className="font-medium capitalize">{record.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    record.granted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.granted ? 'Granted' : 'Revoked'}
                  </span>
                </div>
                <span className="text-gray-500">{record.timestamp.toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
            <p className="text-blue-800 text-sm mb-3">
              If you have questions about your privacy or need assistance with data requests, 
              our support team is here to help.
            </p>
            <a
              href="mailto:privacy@alchm.app"
              className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-medium text-gray-900">Privacy & Data Protection</h3>
        </div>
        <p className="text-gray-600">
          Manage your privacy settings and understand how your data is protected
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'settings', label: 'Settings' },
            { id: 'data', label: 'Data Details' },
            { id: 'requests', label: 'Data Requests' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'data' && renderDataCategory()}
        {activeTab === 'requests' && renderRequests()}
      </div>
    </div>
  );
}