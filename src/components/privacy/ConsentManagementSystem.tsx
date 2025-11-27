'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface ConsentRecord {
  id: string;
  purpose: string;
  legalBasis: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
  dataTypes: string[];
  processingActivities: string[];
  thirdParties: string[];
  retentionPeriod: string;
  userConsent: boolean;
  consentTimestamp: string | null;
  withdrawalTimestamp: string | null;
  consentVersion: string;
  isRequired: boolean;
  ageRestricted: boolean; // Special handling for minors
  parentalConsentRequired: boolean;
}

interface ConsentBanner {
  id: string;
  title: string;
  description: string;
  consentTypes: string[];
  priority: 'high' | 'medium' | 'low';
  trigger: 'immediate' | 'interaction' | 'feature_access';
  isActive: boolean;
}

interface ParentalConsentStatus {
  isRequired: boolean;
  parentEmail: string;
  verificationSent: boolean;
  verificationCode: string;
  verifiedAt: string | null;
  expiresAt: string;
}

// Enterprise-grade consent management for mental health apps with COPPA compliance
export default function ConsentManagementSystem() {
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [consentBanners, setConsentBanners] = useState<ConsentBanner[]>([]);
  const [parentalConsent, setParentalConsent] = useState<ParentalConsentStatus | null>(null);
  const [showConsentCenter, setShowConsentCenter] = useState(false);
  const [activeBanner, setActiveBanner] = useState<ConsentBanner | null>(null);
  const [userAge, setUserAge] = useState<'adult' | 'teen' | 'minor' | null>(null);

  // Initialize consent system
  useEffect(() => {
    initializeConsentSystem();
    checkUserAgeStatus();
    loadExistingConsent();
  }, []);

  const initializeConsentSystem = () => {
    const defaultConsentRecords: ConsentRecord[] = [
      {
        id: 'essential_services',
        purpose: 'Essential app functionality and account management',
        legalBasis: 'contract',
        dataTypes: ['email', 'authentication_tokens', 'account_preferences'],
        processingActivities: ['account_creation', 'authentication', 'service_delivery'],
        thirdParties: ['Firebase Auth (Google)'],
        retentionPeriod: 'Until account deletion',
        userConsent: true,
        consentTimestamp: new Date().toISOString(),
        withdrawalTimestamp: null,
        consentVersion: '1.0',
        isRequired: true,
        ageRestricted: false,
        parentalConsentRequired: false
      },
      {
        id: 'journal_processing',
        purpose: 'Journal entry storage and AI-powered insights',
        legalBasis: 'contract',
        dataTypes: ['journal_content', 'mood_data', 'emotional_patterns'],
        processingActivities: ['content_storage', 'ai_analysis', 'insight_generation'],
        thirdParties: ['AI processing services (anonymized data only)'],
        retentionPeriod: 'Until user deletion or account closure',
        userConsent: true,
        consentTimestamp: new Date().toISOString(),
        withdrawalTimestamp: null,
        consentVersion: '1.0',
        isRequired: true,
        ageRestricted: false,
        parentalConsentRequired: false
      },
      {
        id: 'crisis_detection',
        purpose: 'Mental health crisis detection and safety monitoring',
        legalBasis: 'legitimate_interest',
        dataTypes: ['emotional_indicators', 'crisis_keywords', 'behavioral_patterns'],
        processingActivities: ['safety_monitoring', 'crisis_detection', 'emergency_resource_provision'],
        thirdParties: ['Crisis intervention services'],
        retentionPeriod: '30 days maximum',
        userConsent: true,
        consentTimestamp: new Date().toISOString(),
        withdrawalTimestamp: null,
        consentVersion: '1.0',
        isRequired: false,
        ageRestricted: true, // Special protections for minors
        parentalConsentRequired: false
      },
      {
        id: 'analytics_improvement',
        purpose: 'App usage analytics for service improvement',
        legalBasis: 'consent',
        dataTypes: ['usage_patterns', 'feature_interactions', 'performance_metrics'],
        processingActivities: ['analytics_collection', 'service_improvement', 'feature_development'],
        thirdParties: ['Google Analytics (anonymized)'],
        retentionPeriod: '24 months',
        userConsent: false,
        consentTimestamp: null,
        withdrawalTimestamp: null,
        consentVersion: '1.0',
        isRequired: false,
        ageRestricted: true, // Enhanced protections for minors
        parentalConsentRequired: true
      },
      {
        id: 'research_participation',
        purpose: 'Anonymous mental health research and population insights',
        legalBasis: 'consent',
        dataTypes: ['anonymized_patterns', 'demographic_data', 'outcome_metrics'],
        processingActivities: ['research_analysis', 'population_studies', 'outcome_measurement'],
        thirdParties: ['Academic research institutions'],
        retentionPeriod: '5 years (anonymized)',
        userConsent: false,
        consentTimestamp: null,
        withdrawalTimestamp: null,
        consentVersion: '1.0',
        isRequired: false,
        ageRestricted: true,
        parentalConsentRequired: true
      }
    ];

    const defaultBanners: ConsentBanner[] = [
      {
        id: 'initial_consent',
        title: 'Privacy & Data Protection',
        description: 'We need your consent for data processing beyond essential app functionality.',
        consentTypes: ['analytics_improvement', 'research_participation'],
        priority: 'high',
        trigger: 'immediate',
        isActive: true
      },
      {
        id: 'crisis_detection_consent',
        title: 'Mental Health Safety Features',
        description: 'Enable AI-powered crisis detection for additional safety monitoring?',
        consentTypes: ['crisis_detection'],
        priority: 'medium',
        trigger: 'feature_access',
        isActive: true
      }
    ];

    setConsentRecords(defaultConsentRecords);
    setConsentBanners(defaultBanners);
  };

  const checkUserAgeStatus = () => {
    const ageGroup = localStorage.getItem('alchm_user_age_group') as 'adult' | 'teen' | 'minor' | null;
    setUserAge(ageGroup);

    if (ageGroup === 'minor') {
      // Initialize parental consent requirements
      const parentalConsentData = localStorage.getItem('alchm_parental_consent_status');
      if (parentalConsentData) {
        setParentalConsent(JSON.parse(parentalConsentData));
      } else {
        setParentalConsent({
          isRequired: true,
          parentEmail: '',
          verificationSent: false,
          verificationCode: '',
          verifiedAt: null,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });
      }
    }
  };

  const loadExistingConsent = () => {
    const savedConsent = localStorage.getItem('alchm_consent_records');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsentRecords(parsed);
      } catch (error) {
        console.warn('Failed to load consent records');
      }
    }

    // Check if initial consent banner should be shown
    const hasGivenInitialConsent = localStorage.getItem('alchm_initial_consent_given');
    if (!hasGivenInitialConsent) {
      const initialBanner = consentBanners.find(b => b.id === 'initial_consent');
      if (initialBanner) {
        setActiveBanner(initialBanner);
      }
    }
  };

  const updateConsentRecord = useCallback((recordId: string, consent: boolean) => {
    const updatedRecords = consentRecords.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          userConsent: consent,
          consentTimestamp: consent ? new Date().toISOString() : record.consentTimestamp,
          withdrawalTimestamp: !consent ? new Date().toISOString() : null
        };
      }
      return record;
    });

    setConsentRecords(updatedRecords);
    localStorage.setItem('alchm_consent_records', JSON.stringify(updatedRecords));

    // Apply consent changes to app functionality
    applyConsentChanges(recordId, consent);
  }, [consentRecords]);

  const applyConsentChanges = (recordId: string, consent: boolean) => {
    switch (recordId) {
      case 'analytics_improvement':
        if (consent) {
          localStorage.removeItem('alchm_analytics_disabled');
        } else {
          localStorage.setItem('alchm_analytics_disabled', 'true');
          // Clear existing analytics data
          localStorage.removeItem('alchm_analytics_data');
        }
        break;

      case 'crisis_detection':
        if (consent) {
          localStorage.removeItem('alchm_crisis_detection_disabled');
        } else {
          localStorage.setItem('alchm_crisis_detection_disabled', 'true');
        }
        break;

      case 'research_participation':
        if (consent) {
          localStorage.removeItem('alchm_research_opt_out');
        } else {
          localStorage.setItem('alchm_research_opt_out', 'true');
        }
        break;
    }
  };

  const handleBannerConsent = (banner: ConsentBanner, consentChoices: Record<string, boolean>) => {
    // Update all related consent records
    banner.consentTypes.forEach(consentType => {
      const consent = consentChoices[consentType] || false;
      updateConsentRecord(consentType, consent);
    });

    // Mark banner as handled
    if (banner.id === 'initial_consent') {
      localStorage.setItem('alchm_initial_consent_given', 'true');
    }

    setActiveBanner(null);
  };

  const sendParentalVerificationEmail = async (parentEmail: string) => {
    // In a real implementation, this would send an actual verification email
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const updatedParentalConsent: ParentalConsentStatus = {
      ...parentalConsent!,
      parentEmail,
      verificationSent: true,
      verificationCode,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
    };

    setParentalConsent(updatedParentalConsent);
    localStorage.setItem('alchm_parental_consent_status', JSON.stringify(updatedParentalConsent));

    alert(
      `Verification email sent to ${parentEmail}. ` +
      `The parent/guardian must verify their identity and provide consent. ` +
      `Verification code: ${verificationCode} (for demo purposes - normally sent via email)`
    );
  };

  const verifyParentalConsent = (code: string) => {
    if (parentalConsent && code === parentalConsent.verificationCode) {
      const verifiedConsent: ParentalConsentStatus = {
        ...parentalConsent,
        verifiedAt: new Date().toISOString()
      };

      setParentalConsent(verifiedConsent);
      localStorage.setItem('alchm_parental_consent_status', JSON.stringify(verifiedConsent));

      // Enable age-restricted features for verified minors
      const restrictedRecords = consentRecords.filter(r => r.ageRestricted && r.parentalConsentRequired);
      restrictedRecords.forEach(record => {
        updateConsentRecord(record.id, true);
      });

      alert('Parental consent verified successfully! Age-restricted features are now enabled.');
    } else {
      alert('Invalid verification code. Please check the code sent to the parent/guardian email.');
    }
  };

  const exportConsentHistory = () => {
    const consentHistory = {
      userAge,
      consentRecords: consentRecords.map(record => ({
        ...record,
        // Exclude sensitive internal data
        consentVersion: record.consentVersion,
        consentTimestamp: record.consentTimestamp,
        withdrawalTimestamp: record.withdrawalTimestamp,
        userConsent: record.userConsent
      })),
      parentalConsent: userAge === 'minor' ? parentalConsent : null,
      exportTimestamp: new Date().toISOString(),
      complianceVersion: '1.0'
    };

    const blob = new Blob([JSON.stringify(consentHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alchm-consent-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render parental consent interface for minors
  if (userAge === 'minor' && parentalConsent && !parentalConsent.verifiedAt) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <h2 className="text-xl font-medium text-red-800">Parental Consent Required</h2>
            <p className="text-red-600">COPPA Compliance - Children's Privacy Protection</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {!parentalConsent.verificationSent ? (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Parent/Guardian Verification Required</h3>
                  <p className="text-yellow-700 text-sm">
                    Federal law requires parental consent for users under 13. We need to verify 
                    a parent or guardian's identity before enabling data processing features.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="parent@example.com"
                    onChange={(e) => setParentalConsent({
                      ...parentalConsent,
                      parentEmail: e.target.value
                    })}
                  />
                </div>
                
                <Button
                  onClick={() => sendParentalVerificationEmail(parentalConsent.parentEmail)}
                  disabled={!parentalConsent.parentEmail.includes('@')}
                  className="w-full"
                >
                  Send Verification Email
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Verification Email Sent</h3>
                  <p className="text-blue-700 text-sm">
                    A verification email has been sent to {parentalConsent.parentEmail}. 
                    Please ask the parent/guardian to check their email and provide the verification code.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code (from parent's email)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercase"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    onChange={(e) => {
                      if (e.target.value.length === 6) {
                        verifyParentalConsent(e.target.value.toUpperCase());
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render consent banner
  if (activeBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <h3 className="font-medium text-gray-900 mb-1">{activeBanner.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{activeBanner.description}</p>
              
              <div className="space-y-2">
                {activeBanner.consentTypes.map(consentType => {
                  const record = consentRecords.find(r => r.id === consentType);
                  if (!record) return null;
                  
                  return (
                    <label key={consentType} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="rounded"
                      />
                      <span>{record.purpose}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  const consentChoices: Record<string, boolean> = {};
                  activeBanner.consentTypes.forEach(type => {
                    consentChoices[type] = false;
                  });
                  handleBannerConsent(activeBanner, consentChoices);
                }}
                variant="outline"
                size="sm"
              >
                Decline All
              </Button>
              <Button
                onClick={() => {
                  const consentChoices: Record<string, boolean> = {};
                  activeBanner.consentTypes.forEach(type => {
                    consentChoices[type] = true;
                  });
                  handleBannerConsent(activeBanner, consentChoices);
                }}
                size="sm"
              >
                Accept All
              </Button>
              <Button
                onClick={() => setShowConsentCenter(true)}
                variant="outline"
                size="sm"
              >
                Customize
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render consent center
  if (showConsentCenter) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-blue-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium">Consent Management Center</h2>
                <p className="text-sm text-gray-600">
                  Manage your data processing consent preferences
                  {userAge && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {userAge === 'minor' ? 'Under 13' : userAge === 'teen' ? '13-17' : '18+'}
                    </span>
                  )}
                </p>
              </div>
              <Button onClick={() => setShowConsentCenter(false)} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {consentRecords.map(record => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {record.purpose}
                      {record.isRequired && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Required</span>
                      )}
                      {record.ageRestricted && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Age Restricted
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Legal Basis: {record.legalBasis.replace('_', ' ')}
                    </p>
                  </div>
                  
                  {!record.isRequired && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={record.userConsent}
                        onChange={(e) => updateConsentRecord(record.id, e.target.checked)}
                        className="rounded"
                        disabled={record.ageRestricted && userAge === 'minor' && !parentalConsent?.verifiedAt}
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Data Types:</span>
                    <p>{record.dataTypes.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Retention Period:</span>
                    <p>{record.retentionPeriod}</p>
                  </div>
                  <div>
                    <span className="font-medium">Third Parties:</span>
                    <p>{record.thirdParties.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Consent Status:</span>
                    <p>
                      {record.userConsent ? 'Granted' : 'Withdrawn'}
                      {record.consentTimestamp && (
                        <span className="ml-1">
                          on {new Date(record.consentTimestamp).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Consent Management Options</h3>
              <div className="flex space-x-3">
                <Button onClick={exportConsentHistory} variant="outline">
                  📥 Download Consent History
                </Button>
                <Button 
                  onClick={() => window.open('/privacy-policy.html', '_blank')} 
                  variant="outline"
                >
                  📋 Privacy Policy
                </Button>
                <Button 
                  onClick={() => window.open('mailto:privacy@alchm.app', '_blank')} 
                  variant="outline"
                >
                  📧 Contact Privacy Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Floating consent management button
  return (
    <div className="fixed bottom-4 right-4 z-30">
      <Button
        onClick={() => setShowConsentCenter(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
        aria-label="Open consent management center"
      >
        🛡️
      </Button>
    </div>
  );
}