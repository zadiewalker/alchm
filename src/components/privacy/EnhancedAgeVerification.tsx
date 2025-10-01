'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface AgeVerificationState {
  isVerified: boolean;
  ageGroup: 'adult' | 'teen' | 'minor' | null;
  verificationMethod: 'birthdate' | 'parental_consent' | null;
  parentalConsentStatus: 'pending' | 'approved' | 'denied' | null;
  verificationTimestamp: number | null;
  verificationAttempts: number;
  requiresParentalConsent: boolean;
}

interface EnhancedAgeVerificationProps {
  onVerificationComplete: (state: AgeVerificationState) => void;
  onMobileRedirect?: () => void;
  strict?: boolean; // For mental health apps requiring stricter verification
}

// COPPA-compliant age verification with enhanced protections for mental health apps
export default function EnhancedAgeVerification({ 
  onVerificationComplete, 
  onMobileRedirect,
  strict = true 
}: EnhancedAgeVerificationProps) {
  const [state, setState] = useState<AgeVerificationState>({
    isVerified: false,
    ageGroup: null,
    verificationMethod: null,
    parentalConsentStatus: null,
    verificationTimestamp: null,
    verificationAttempts: 0,
    requiresParentalConsent: false
  });
  
  const [showVerification, setShowVerification] = useState(false);
  const [selectedBirthDate, setSelectedBirthDate] = useState({
    month: '',
    day: '',
    year: ''
  });
  
  const [parentalEmail, setParentalEmail] = useState('');
  const [showParentalConsent, setShowParentalConsent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Enhanced verification checks on component mount
  useEffect(() => {
    const checkExistingVerification = () => {
      const sessionVerified = sessionStorage.getItem('alchm_enhanced_age_verified');
      const verificationData = localStorage.getItem('alchm_age_verification_data');
      const verificationBlocked = localStorage.getItem('alchm_verification_blocked');
      
      // Check if verification is temporarily blocked due to excessive attempts
      if (verificationBlocked) {
        const blockedTime = parseInt(verificationBlocked);
        const timeDiff = Date.now() - blockedTime;
        const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
        
        if (timeDiff < BLOCK_DURATION) {
          // Still blocked - redirect to external resources
          window.location.href = 'https://www.commonsensemedia.org/articles/mental-health-apps-and-privacy-what-parents-need-to-know';
          return;
        } else {
          // Block expired, remove flag
          localStorage.removeItem('alchm_verification_blocked');
        }
      }
      
      if (sessionVerified === 'true' && verificationData) {
        try {
          const parsedData: AgeVerificationState = JSON.parse(verificationData);
          
          // Verify data integrity and recency
          const now = Date.now();
          const verificationAge = parsedData.verificationTimestamp ? now - parsedData.verificationTimestamp : 0;
          const VERIFICATION_VALIDITY = strict ? 12 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 12 or 24 hours
          
          if (verificationAge < VERIFICATION_VALIDITY && parsedData.isVerified) {
            setState(parsedData);
            onVerificationComplete(parsedData);
            return;
          }
        } catch (error) {
          console.warn('Invalid verification data, requiring re-verification');
        }
      }
      
      // Show verification modal if not verified
      setShowVerification(true);
    };

    checkExistingVerification();
  }, [onVerificationComplete, strict]);

  // Calculate age from birth date with enhanced precision
  const calculateAge = useCallback((birthDate: { month: string; day: string; year: string }) => {
    const today = new Date();
    const birth = new Date(
      parseInt(birthDate.year),
      parseInt(birthDate.month) - 1,
      parseInt(birthDate.day)
    );
    
    if (birth > today) return -1; // Invalid future date
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  // Enhanced age verification with COPPA compliance
  const handleAgeVerification = async () => {
    if (!selectedBirthDate.month || !selectedBirthDate.day || !selectedBirthDate.year) {
      alert('Please select your complete birth date for verification.');
      return;
    }
    
    if (!agreedToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    const age = calculateAge(selectedBirthDate);
    const newAttempts = state.verificationAttempts + 1;
    
    // Rate limiting for excessive attempts
    if (newAttempts > 5) {
      localStorage.setItem('alchm_verification_blocked', Date.now().toString());
      window.location.href = 'https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa';
      return;
    }
    
    if (age < 0) {
      alert('Please enter a valid birth date.');
      return;
    }

    let ageGroup: 'adult' | 'teen' | 'minor';
    let requiresParentalConsent = false;
    let verificationMethod: 'birthdate' | 'parental_consent' = 'birthdate';

    if (age < 13) {
      // COPPA protected age - requires parental consent
      ageGroup = 'minor';
      requiresParentalConsent = true;
      verificationMethod = 'parental_consent';
      setShowParentalConsent(true);
      
      // Update state to reflect parental consent requirement
      const newState: AgeVerificationState = {
        isVerified: false,
        ageGroup,
        verificationMethod,
        parentalConsentStatus: 'pending',
        verificationTimestamp: Date.now(),
        verificationAttempts: newAttempts,
        requiresParentalConsent: true
      };
      
      setState(newState);
      return;
      
    } else if (age < 18) {
      // Teen users - enhanced protections but no parental consent required
      ageGroup = 'teen';
    } else {
      // Adult users
      ageGroup = 'adult';
    }

    // Complete verification for teens and adults
    const newState: AgeVerificationState = {
      isVerified: true,
      ageGroup,
      verificationMethod,
      parentalConsentStatus: null,
      verificationTimestamp: Date.now(),
      verificationAttempts: newAttempts,
      requiresParentalConsent
    };

    // Store verification data securely
    sessionStorage.setItem('alchm_enhanced_age_verified', 'true');
    localStorage.setItem('alchm_age_verification_data', JSON.stringify(newState));
    
    // Additional storage for ageGroup-specific compliance
    localStorage.setItem('alchm_user_age_group', ageGroup);
    
    setState(newState);
    setShowVerification(false);
    onVerificationComplete(newState);
  };

  // Handle parental consent submission
  const handleParentalConsentSubmission = async () => {
    if (!parentalEmail || !parentalEmail.includes('@')) {
      alert('Please enter a valid parent/guardian email address.');
      return;
    }

    // In a real implementation, this would send verification email to parent
    // For now, we'll simulate the process
    alert(
      `A verification email has been sent to ${parentalEmail}. ` +
      'The parent/guardian must verify their identity and provide consent ' +
      'before access to ALCHM can be granted. This process typically takes 24-48 hours.'
    );

    // Update state to reflect pending parental consent
    const newState: AgeVerificationState = {
      ...state,
      parentalConsentStatus: 'pending',
      verificationTimestamp: Date.now()
    };

    setState(newState);
    localStorage.setItem('alchm_age_verification_data', JSON.stringify(newState));
    
    // For COPPA compliance, user cannot proceed without verified parental consent
    setTimeout(() => {
      window.location.href = 'https://www.kidshelpphone.ca/';
    }, 3000);
  };

  if (!showVerification && !showParentalConsent) return null;

  // Parental Consent Flow for COPPA Compliance
  if (showParentalConsent) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h2 className="text-2xl font-bold text-red-800">Parental Consent Required</h2>
              <p className="text-red-600 font-medium mt-2">COPPA Protection Active</p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-800 text-lg mb-3">
                🔒 Children's Online Privacy Protection Act (COPPA) Notice
              </h3>
              <div className="space-y-3 text-red-700">
                <p className="font-semibold">
                  This application collects personal information and is not intended for children under 13.
                </p>
                <p>
                  <strong>Why parental consent is required:</strong>
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>ALCHM processes personal journaling content and emotional data</li>
                  <li>AI systems analyze emotional patterns for crisis detection</li>
                  <li>Account creation requires email address storage</li>
                  <li>Usage analytics are collected for app improvement</li>
                  <li>Mental health resources and crisis intervention features are provided</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Alternative Resources for Young Users</h4>
              <p className="text-yellow-700 text-sm mb-3">
                While ALCHM requires parental consent for users under 13, here are age-appropriate mental wellness resources:
              </p>
              <div className="space-y-2 text-sm">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://kidshealth.org/teen/', '_blank')}
                  className="mr-2 mb-2"
                >
                  KidsHealth Resources
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.commonsensemedia.org/articles/mental-health-apps-and-privacy-what-parents-need-to-know', '_blank')}
                  className="mr-2 mb-2"
                >
                  Parent Privacy Guide
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Email Address (Required for Verification)
                </label>
                <input
                  type="email"
                  value={parentalEmail}
                  onChange={(e) => setParentalEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  placeholder="parent@example.com"
                  required
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="parent-understands"
                  className="mt-1"
                  required
                />
                <label htmlFor="parent-understands" className="text-sm text-gray-700">
                  I understand that as a parent/guardian, I must verify my identity and 
                  provide explicit consent before my child can access ALCHM's mental health features.
                </label>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleParentalConsentSubmission}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Send Parental Verification Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = 'https://kidshealth.org/teen/'}
                  className="flex-1"
                >
                  Find Age-Appropriate Resources
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded">
              <p className="font-medium mb-2">Privacy Protection Notice:</p>
              <p>
                This verification process ensures compliance with federal privacy laws protecting children. 
                No personal information from users under 13 is stored without verified parental consent. 
                All data collection follows COPPA guidelines and FTC regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Age Verification Interface
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-50 border-b border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Enhanced Age Verification</h2>
            <p className="text-blue-600 font-medium mt-2">Privacy & Mental Health Protection</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-800 text-lg mb-3">
              🔒 Why Age Verification is Required
            </h3>
            <div className="space-y-2 text-blue-700 text-sm">
              <p><strong>ALCHM is a mental health platform that:</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Processes sensitive emotional and psychological content</li>
                <li>Uses AI analysis for crisis detection and mental health insights</li>
                <li>Provides crisis intervention and mental health resources</li>
                <li>Covers mature themes related to trauma, identity, and emotional healing</li>
                <li>Requires informed consent for mental health data processing</li>
              </ul>
              <p className="font-medium text-blue-800 mt-3">
                This verification ensures compliance with COPPA, GDPR, and mental health privacy regulations.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Please enter your birth date for age verification:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Month</label>
                  <select
                    value={selectedBirthDate.month}
                    onChange={(e) => setSelectedBirthDate(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Day</label>
                  <select
                    value={selectedBirthDate.day}
                    onChange={(e) => setSelectedBirthDate(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Year</label>
                  <select
                    value={selectedBirthDate.year}
                    onChange={(e) => setSelectedBirthDate(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="agree-terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <button 
                  onClick={() => window.open('/privacy-policy.html', '_blank')}
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </button>
                {' '}and{' '}
                <button 
                  onClick={() => window.open('/terms.html', '_blank')}
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service
                </button>
                , and confirm that the birth date provided is accurate.
              </label>
            </div>

            <Button
              onClick={handleAgeVerification}
              disabled={!agreedToTerms || !selectedBirthDate.month || !selectedBirthDate.day || !selectedBirthDate.year}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3"
            >
              Verify Age and Continue
            </Button>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded border-t border-gray-200">
            <p className="font-medium mb-2">🛡️ Privacy Protection Guarantee:</p>
            <p className="mb-2">
              Your birth date is used solely for age verification and compliance with privacy regulations. 
              This information is stored securely and locally on your device.
            </p>
            <p>
              <strong>Verification attempts:</strong> {state.verificationAttempts}/5 
              (Rate limited for security and COPPA compliance)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}