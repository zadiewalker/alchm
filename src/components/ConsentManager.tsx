'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  purpose: string;
  required: boolean;
  dataTypes: string[];
  consequences: string;
  legalBasis: string;
}

interface ConsentRecord {
  userId: string;
  consentType: string;
  granted: boolean;
  timestamp: Date;
  consentMethod: string;
  consentText: string;
  consentVersion: string;
  withdrawnAt?: Date;
  withdrawalMethod?: string;
}

interface ConsentManagerProps {
  user: User | null;
  onConsentUpdate?: (consents: Record<string, boolean>) => void;
  showModal?: boolean;
  onClose?: () => void;
}

const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'essential_services',
    name: 'Essential Services',
    description: 'Core functionality required for ALCHM to work',
    purpose: 'Provide basic journaling, account management, and security features',
    required: true,
    dataTypes: ['Account information', 'Authentication data', 'Basic usage logs'],
    consequences: 'ALCHM cannot function without these essential services',
    legalBasis: 'Contractual necessity'
  },
  {
    id: 'ai_analysis',
    name: 'AI Journal Analysis',
    description: 'Allow Khepera AI to analyze your journal entries for therapeutic insights',
    purpose: 'Provide personalized emotional support and therapeutic guidance',
    required: false,
    dataTypes: ['Journal content', 'Emotional patterns', 'Analysis results'],
    consequences: 'You will not receive AI-powered insights, but can still journal normally',
    legalBasis: 'Consent (GDPR Article 6(1)(a))'
  },
  {
    id: 'crisis_monitoring',
    name: 'Crisis Detection & Safety Monitoring',
    description: 'Monitor journal entries for signs of crisis to provide emergency resources',
    purpose: 'Detect potential mental health crises and provide appropriate support resources',
    required: false,
    dataTypes: ['Journal content', 'Crisis indicators', 'Risk assessment data'],
    consequences: 'Crisis situations may not be automatically detected, reducing safety support',
    legalBasis: 'Vital interests (GDPR Article 6(1)(d))'
  },
  {
    id: 'analytics_improvement',
    name: 'Service Improvement Analytics',
    description: 'Share anonymized usage data to help improve ALCHM for all users',
    purpose: 'Understand usage patterns to enhance features and user experience',
    required: false,
    dataTypes: ['Anonymized usage statistics', 'Feature interaction data', 'Performance metrics'],
    consequences: 'ALCHM improvements may not reflect your usage patterns',
    legalBasis: 'Legitimate interest (GDPR Article 6(1)(f))'
  },
  {
    id: 'research_participation',
    name: 'Mental Health Research (Optional)',
    description: 'Contribute anonymized data to mental health research studies',
    purpose: 'Support academic research to advance understanding of digital mental health interventions',
    required: false,
    dataTypes: ['Anonymized journal themes', 'Usage patterns', 'Outcome indicators'],
    consequences: 'Your data will not contribute to mental health research',
    legalBasis: 'Consent (GDPR Article 6(1)(a))'
  },
  {
    id: 'communication',
    name: 'Privacy & Service Communications',
    description: 'Receive important updates about privacy, security, and service changes',
    purpose: 'Keep you informed about changes that affect your data and privacy',
    required: false,
    dataTypes: ['Contact information', 'Communication preferences'],
    consequences: 'You may miss important privacy and security updates',
    legalBasis: 'Legitimate interest (GDPR Article 6(1)(f))'
  }
];

const CONSENT_VERSION = '1.1'; // Increment when consent requirements change

export default function ConsentManager({ user, onConsentUpdate, showModal = false, onClose }: ConsentManagerProps) {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasExistingConsents, setHasExistingConsents] = useState(false);
  const [lastConsentVersion, setLastConsentVersion] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingConsents();
    }
  }, [user]);

  const loadExistingConsents = async () => {
    if (!user) return;

    try {
      const privacyDoc = await getDoc(doc(db, 'userPrivacySettings', user.uid));
      
      if (privacyDoc.exists()) {
        const data = privacyDoc.data();
        const processingConsent = data.dataProcessingConsent || {};
        
        setConsents({
          essential_services: true, // Always required
          ai_analysis: processingConsent.journalAnalysis || false,
          crisis_monitoring: processingConsent.crisisMonitoring || false,
          analytics_improvement: processingConsent.analyticsParticipation || false,
          research_participation: processingConsent.researchParticipation || false,
          communication: processingConsent.communicationPreferences || true
        });
        
        setLastConsentVersion(processingConsent.consentVersion || '1.0');
        setHasExistingConsents(true);
      } else {
        // Set defaults for new users
        setConsents({
          essential_services: true,
          ai_analysis: true, // Opt-in by default for therapeutic value
          crisis_monitoring: true, // Recommended for safety
          analytics_improvement: false,
          research_participation: false,
          communication: true
        });
        setHasExistingConsents(false);
      }
    } catch (error) {
      console.error('Error loading consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = (categoryId: string, granted: boolean) => {
    // Cannot disable essential services
    if (categoryId === 'essential_services' && !granted) {
      return;
    }

    setConsents(prev => ({
      ...prev,
      [categoryId]: granted
    }));
  };

  const saveConsents = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update privacy settings
      const privacySettings = {
        userId: user.uid,
        dataProcessingConsent: {
          journalAnalysis: consents.ai_analysis,
          aiInsights: consents.ai_analysis,
          crisisMonitoring: consents.crisis_monitoring,
          analyticsParticipation: consents.analytics_improvement,
          researchParticipation: consents.research_participation,
          communicationPreferences: consents.communication,
          consentDate: new Date(),
          consentVersion: CONSENT_VERSION
        },
        lastUpdated: new Date()
      };

      await setDoc(doc(db, 'userPrivacySettings', user.uid), privacySettings, { merge: true });

      // Create detailed consent records for each category
      const consentPromises = CONSENT_CATEGORIES.map(category => {
        const consentRecord: Partial<ConsentRecord> = {
          userId: user.uid,
          consentType: category.id,
          granted: consents[category.id],
          timestamp: new Date(),
          consentMethod: showModal ? 'modal_form' : 'settings_page',
          consentText: category.description,
          consentVersion: CONSENT_VERSION
        };

        return addDoc(collection(db, 'consentRecords'), consentRecord);
      });

      await Promise.all(consentPromises);

      // Log consent update
      await addDoc(collection(db, 'privacyAuditLog'), {
        userId: user.uid,
        action: hasExistingConsents ? 'consent_updated' : 'initial_consent_given',
        timestamp: new Date(),
        details: `User ${hasExistingConsents ? 'updated' : 'provided'} consent preferences`,
        legalBasis: 'consent'
      });

      if (onConsentUpdate) {
        onConsentUpdate(consents);
      }

      if (onClose) {
        onClose();
      }

      alert('Consent preferences saved successfully');

    } catch (error) {
      console.error('Error saving consents:', error);
      alert('Failed to save consent preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const withdrawConsent = async (categoryId: string) => {
    if (categoryId === 'essential_services') {
      alert('Essential services cannot be disabled as they are required for ALCHM to function.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to withdraw consent for ${CONSENT_CATEGORIES.find(c => c.id === categoryId)?.name}? ` +
      `This will immediately stop this type of data processing.`
    );

    if (confirmed) {
      // Record withdrawal
      await addDoc(collection(db, 'consentRecords'), {
        userId: user?.uid,
        consentType: categoryId,
        granted: false,
        timestamp: new Date(),
        consentMethod: 'withdrawal_button',
        consentText: `User withdrew consent for ${categoryId}`,
        consentVersion: CONSENT_VERSION,
        withdrawnAt: new Date(),
        withdrawalMethod: 'user_interface'
      });

      // Update local state
      updateConsent(categoryId, false);
      
      // Save changes
      await saveConsents();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading consent preferences...</div>
      </div>
    );
  }

  // Check if consent version has changed and user needs to re-consent
  const needsReConsent = lastConsentVersion && lastConsentVersion !== CONSENT_VERSION;

  const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!showModal) return <>{children}</>;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  return (
    <ModalWrapper>
      <div className="p-6 bg-white rounded-lg">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {needsReConsent ? 'Updated Privacy Preferences Required' : 'Manage Your Data Consent'}
              </h2>
              <p className="text-gray-600 mt-2">
                {needsReConsent 
                  ? 'We\'ve updated our privacy practices. Please review and confirm your preferences.'
                  : 'Choose how your data is used to personalize your ALCHM experience.'
                }
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>

          {needsReConsent && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex">
                <div className="text-yellow-400 mr-3">⚠️</div>
                <div>
                  <h3 className="font-medium text-yellow-800">Consent Update Required</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Our privacy practices have been updated (v{CONSENT_VERSION}). 
                    Your previous consent version was {lastConsentVersion}. 
                    Please review and confirm your preferences to continue using ALCHM.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle for detailed view */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showDetailedView ? '← Hide detailed information' : 'Show detailed information →'}
          </button>
        </div>

        {/* Consent Categories */}
        <div className="space-y-4">
          {CONSENT_CATEGORIES.map((category) => (
            <div key={category.id} className={`border rounded-lg p-4 ${
              category.required ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    {category.required && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2">{category.description}</p>
                  
                  {showDetailedView && (
                    <div className="text-sm space-y-2 mt-3 p-3 bg-gray-50 rounded">
                      <div>
                        <strong>Purpose:</strong> {category.purpose}
                      </div>
                      <div>
                        <strong>Data Types:</strong> {category.dataTypes.join(', ')}
                      </div>
                      <div>
                        <strong>Legal Basis:</strong> {category.legalBasis}
                      </div>
                      <div>
                        <strong>If you opt out:</strong> {category.consequences}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-col items-end space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents[category.id] || false}
                      onChange={(e) => updateConsent(category.id, e.target.checked)}
                      disabled={category.required}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {consents[category.id] ? 'Granted' : 'Denied'}
                    </span>
                  </label>
                  
                  {!category.required && consents[category.id] && (
                    <button
                      onClick={() => withdrawConsent(category.id)}
                      className="text-red-600 hover:text-red-800 text-xs underline"
                    >
                      Withdraw Consent
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Your Privacy Rights</h4>
          <p className="text-gray-700 text-sm mb-2">
            You can change these preferences at any time in your Privacy Dashboard. 
            Under GDPR and other privacy laws, you have the right to:
          </p>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Access your personal data</li>
            <li>• Correct inaccurate information</li>
            <li>• Delete your data (right to be forgotten)</li>
            <li>• Export your data in a portable format</li>
            <li>• Object to processing or withdraw consent at any time</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={saveConsents}
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-medium ${
              saving
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Legal Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>
            By using ALCHM, you agree to our Privacy Policy and Terms of Service. 
            For questions about data processing, contact privacy@alchm.app
          </p>
          <p className="mt-1">
            Consent Version: {CONSENT_VERSION} | Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
}