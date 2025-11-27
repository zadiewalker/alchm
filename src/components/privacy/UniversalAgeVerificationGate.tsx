'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePrivacyCompliance } from './PrivacyComplianceProvider';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface UniversalAgeVerificationGateProps {
  children: ReactNode;
}

export default function UniversalAgeVerificationGate({ children }: UniversalAgeVerificationGateProps) {
  const {
    ageVerified,
    ageGroup,
    requiresParentalConsent,
    parentalConsentVerified,
    isCompliant,
    isInitializing,
    isVerifying,
    complianceErrors,
    jurisdiction,
    applicableLaws,
    initiateAgeVerification,
    submitAgeVerification,
    grantConsent,
    initiateParentalConsent
  } = usePrivacyCompliance();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showParentalModal, setShowParentalModal] = useState(false);
  const [currentVerificationId, setCurrentVerificationId] = useState<string | null>(null);
  
  const [birthData, setBirthData] = useState({
    birthMonth: '',
    birthYear: ''
  });
  
  const [consentChoices, setConsentChoices] = useState({
    essential_functionality: true,
    safety_communications: true,
    enhanced_ai_features: false,
    platform_analytics: false,
    research_participation: false
  });
  
  const [parentalData, setParentalData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    relationship: 'parent'
  });

  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Show verification modal if user is not age verified
  useEffect(() => {
    if (!isInitializing && !ageVerified && !showVerificationModal) {
      setShowVerificationModal(true);
    }
  }, [isInitializing, ageVerified, showVerificationModal]);

  // Show consent modal after age verification
  useEffect(() => {
    if (ageVerified && !isCompliant && !showConsentModal && !requiresParentalConsent) {
      setShowConsentModal(true);
    }
  }, [ageVerified, isCompliant, showConsentModal, requiresParentalConsent]);

  // Show parental consent modal if required
  useEffect(() => {
    if (ageVerified && requiresParentalConsent && !parentalConsentVerified && !showParentalModal) {
      setShowParentalModal(true);
    }
  }, [ageVerified, requiresParentalConsent, parentalConsentVerified, showParentalModal]);

  // If user is compliant, render children
  if (isCompliant && ageVerified) {
    return <>{children}</>;
  }

  // Loading state
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Initializing Privacy Protection
            </h2>
            <p className="text-gray-600 text-sm">
              Configuring COPPA, GDPR, and privacy compliance systems...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Jony Ive Age Verification Modal
  if (showVerificationModal && !ageVerified) {
    return (
      <div className="fixed inset-0 z-50 sanctuary-backdrop flex items-center justify-center p-6">
        <div className="sanctuary-glass organic-container max-w-lg w-full p-10 shadow-floating animate-slide-in-up">
          <div className="text-center space-y-10">
            {/* Minimalist Sage Icon with Physics Animation */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#a4b792] to-[#93a682] rounded-full flex items-center justify-center shadow-elevated transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-5 h-5 bg-white/50 rounded-full animate-gentle-breathe"></div>
              </div>
            </div>
            
            {/* Radical Typography Simplicity */}
            <div className="space-y-3">
              <h1 className="text-3xl font-extralight text-[#2a2d2a] tracking-tight leading-none">
                Age Verification
              </h1>
              <p className="text-[#93a682] font-light text-sm tracking-wide">
                Adult Platform • Privacy Protected
              </p>
              {error && (
                <p className="text-red-600 font-light text-sm bg-red-50 rounded-2xl px-4 py-2">
                  {error}
                </p>
              )}
            </div>
            
            {/* Invisible Interaction */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <label htmlFor="birth-month" className="block text-sm font-light text-[#7a8c6a] mb-3 tracking-wide">
                    Birth Month
                  </label>
                  <select
                    id="birth-month"
                    value={birthData.birthMonth}
                    onChange={(e) => setBirthData(prev => ({ ...prev, birthMonth: e.target.value }))}
                    className="w-full bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-[#2a2d2a] focus:bg-white focus:shadow-elevated focus:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-base font-light px-6 py-4 appearance-none cursor-pointer touch-target-large"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="" disabled className="text-[#93a682] font-light">Select...</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="text-[#2a2d2a] font-light">
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-left">
                  <label htmlFor="birth-year" className="block text-sm font-light text-[#7a8c6a] mb-3 tracking-wide">
                    Birth Year
                  </label>
                  <select
                    id="birth-year"
                    value={birthData.birthYear}
                    onChange={(e) => setBirthData(prev => ({ ...prev, birthYear: e.target.value }))}
                    className="w-full bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-[#2a2d2a] focus:bg-white focus:shadow-elevated focus:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-base font-light px-6 py-4 appearance-none cursor-pointer touch-target-large"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="" disabled className="text-[#93a682] font-light">Select...</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year} className="text-[#2a2d2a] font-light">
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (!birthData.birthMonth || !birthData.birthYear) {
                    setError('Please select your birth month and year.');
                    return;
                  }
                  
                  setError(null);
                  
                  try {
                    const success = await submitAgeVerification(birthData);
                    if (success) {
                      setShowVerificationModal(false);
                    } else {
                      setVerificationAttempts(prev => prev + 1);
                      setError('Age verification failed. Please check your information and try again.');
                      
                      if (verificationAttempts >= 2) {
                        setError('Multiple verification attempts detected. For your protection, please contact support.');
                      }
                    }
                  } catch (err) {
                    setError('Verification system error. Please try again or contact support.');
                  }
                }}
                disabled={isVerifying || !birthData.birthMonth || !birthData.birthYear}
                className="w-full bg-[#a4b792] hover:bg-[#93a682] disabled:opacity-50 text-white rounded-2xl py-4 px-6 font-medium text-base transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-elevated hover:-translate-y-0.5 touch-target-large"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 bg-white/30 rounded-full animate-gentle-pulse"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Age & Continue'
                )}
              </button>
            </div>
            
            {/* Minimal Privacy Assurance */}
            <div className="pt-6 border-t border-white/20">
              <p className="text-xs text-[#93a682] font-extralight leading-relaxed tracking-wide">
                Stored locally • Never shared • GDPR compliant
              </p>
              <p className="text-xs text-[#93a682] font-extralight mt-2">
                Attempts: {verificationAttempts}/3
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Consent Modal (after age verification)
  if (showConsentModal && ageVerified && !requiresParentalConsent) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-medium text-gray-900">Privacy Preferences</h2>
              <p className="text-green-600 font-medium mt-2">Age Verified - Configure Your Data Choices</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-medium text-green-800 text-lg mb-3">
                🎉 Welcome to ALCHM
              </h3>
              <p className="text-green-700">
                Your age has been verified ({ageGroup} user). Now let's configure your privacy preferences 
                to ensure you have control over your personal data.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 text-lg">Choose Your Data Sharing Preferences:</h4>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="essential"
                      checked={consentChoices.essential_functionality}
                      disabled
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="essential" className="font-medium text-gray-900">
                        Essential Functionality (Required)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Core features like account management, journal storage, and safety systems.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="safety"
                      checked={consentChoices.safety_communications}
                      disabled
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="safety" className="font-medium text-gray-900">
                        Safety Communications (Required)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Crisis detection alerts and emergency resource notifications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="ai-features"
                      checked={consentChoices.enhanced_ai_features}
                      onChange={(e) => setConsentChoices(prev => ({ 
                        ...prev, 
                        enhanced_ai_features: e.target.checked 
                      }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="ai-features" className="font-medium text-gray-900">
                        Enhanced AI Features (Optional)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Advanced emotion analysis, personalized insights, and AI-guided reflections.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={consentChoices.platform_analytics}
                      onChange={(e) => setConsentChoices(prev => ({ 
                        ...prev, 
                        platform_analytics: e.target.checked 
                      }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="analytics" className="font-medium text-gray-900">
                        Platform Analytics (Optional)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Anonymous usage data to improve the platform (no personal content shared).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="research"
                      checked={consentChoices.research_participation}
                      onChange={(e) => setConsentChoices(prev => ({ 
                        ...prev, 
                        research_participation: e.target.checked 
                      }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="research" className="font-medium text-gray-900">
                        Research Participation (Optional)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Anonymized data contribution to mental health research studies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">Your Privacy Rights:</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You can change these preferences anytime in your account settings</li>
                <li>• You can request access to, correction of, or deletion of your data</li>
                <li>• You can export your data in a portable format</li>
                <li>• You can withdraw consent for optional features without losing core functionality</li>
              </ul>
            </div>

            <Button
              onClick={async () => {
                try {
                  await grantConsent(consentChoices);
                  setShowConsentModal(false);
                } catch (err) {
                  setError('Failed to save privacy preferences. Please try again.');
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
            >
              Save Privacy Preferences and Continue
            </Button>

            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded">
              <p className="font-medium mb-2">🔒 Legal Compliance Notice:</p>
              <p>
                This consent process ensures compliance with {applicableLaws.join(', ')} and other 
                applicable privacy regulations. Your choices are stored securely and can be modified 
                at any time through your account settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parental Consent Modal (for minors)
  if (showParentalModal && requiresParentalConsent && !parentalConsentVerified) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h2 className="text-2xl font-medium text-red-800">Parental Consent Required</h2>
              <p className="text-red-600 font-medium mt-2">COPPA Protection Notice - {ageGroup} User</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="font-medium text-red-800 text-lg mb-3">
                🔒 Federal Law Requires Parental Consent
              </h3>
              <div className="space-y-3 text-red-700">
                <p className="font-medium">
                  The Children's Online Privacy Protection Act (COPPA) requires verifiable parental 
                  consent for users under 18 using mental health applications.
                </p>
                <p><strong>Why parental consent is required:</strong></p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>ALCHM processes sensitive emotional and mental health content</li>
                  <li>AI systems analyze personal emotional patterns</li>
                  <li>Crisis detection and intervention features are provided</li>
                  <li>Account creation requires personal information storage</li>
                  <li>Mental health resources and therapeutic content are accessed</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Parent/Guardian Information:</h4>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Full Name
                  </label>
                  <input
                    type="text"
                    value={parentalData.parentName}
                    onChange={(e) => setParentalData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Email Address
                  </label>
                  <input
                    type="email"
                    value={parentalData.parentEmail}
                    onChange={(e) => setParentalData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (for verification)
                  </label>
                  <input
                    type="tel"
                    value={parentalData.parentPhone}
                    onChange={(e) => setParentalData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship to User
                  </label>
                  <select
                    value={parentalData.relationship}
                    onChange={(e) => setParentalData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="parent">Parent</option>
                    <option value="legal_guardian">Legal Guardian</option>
                    <option value="authorized_adult">Authorized Adult</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={async () => {
                  try {
                    if (!parentalData.parentName || !parentalData.parentEmail || !parentalData.parentPhone) {
                      setError('Please fill in all required parent/guardian information.');
                      return;
                    }
                    
                    await initiateParentalConsent(parentalData);
                    alert('Parental consent verification has been initiated. The parent/guardian will receive an email with verification instructions.');
                    setShowParentalModal(false);
                  } catch (err) {
                    setError('Failed to initiate parental consent. Please try again.');
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Send Parental Verification
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://kidshealth.org/teen/', '_blank')}
                className="flex-1"
              >
                Find Age-Appropriate Resources
              </Button>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded">
              <p className="font-medium mb-2">Privacy Protection Notice:</p>
              <p>
                This verification process ensures compliance with federal privacy laws protecting minors. 
                Parent/guardian information is stored securely and used only for consent verification. 
                All data collection follows COPPA guidelines and FTC regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Compliance error state
  if (complianceErrors.length > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Privacy Compliance Issue
            </h2>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              {complianceErrors.map((error, index) => (
                <p key={index} className="bg-red-50 p-3 rounded border border-red-200">
                  {error}
                </p>
              ))}
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Retry Verification Process
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Verifying Privacy Compliance
          </h2>
          <p className="text-gray-600 text-sm">
            Ensuring all regulatory requirements are met...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}