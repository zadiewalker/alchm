'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Shield, 
  Mail, 
  Phone, 
  CreditCard, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Verified,
  Lock
} from 'lucide-react';

interface ParentalConsentSystemProps {
  ageGroup: 'under13' | 'teen';
  childData: {
    firstName?: string;
    email?: string;
    consentChoices: Record<string, boolean>;
    consentId: string;
  };
  onConsentComplete: (parentalConsentId: string, verificationMethod: string) => void;
  onBack: () => void;
}

interface ParentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: 'parent' | 'legal_guardian' | 'authorized_adult';
  verificationMethod: 'email_plus_sms' | 'credit_card' | 'government_id' | 'video_call';
  agreedToTerms: boolean;
  agreedToMonitoring: boolean;
  receiveUpdates: boolean;
}

interface ConsentState {
  step: 'introduction' | 'parent_info' | 'verification_method' | 'verification_process' | 'final_consent' | 'confirmation';
  parentData: Partial<ParentData>;
  verificationCode: string;
  verificationSent: boolean;
  verificationStartTime: number;
  consentTimestamp: number;
}

export default function ParentalConsentSystem({ 
  ageGroup, 
  childData, 
  onConsentComplete, 
  onBack 
}: ParentalConsentSystemProps) {
  const [state, setState] = useState<ConsentState>({
    step: 'introduction',
    parentData: {},
    verificationCode: '',
    verificationSent: false,
    verificationStartTime: 0,
    consentTimestamp: Date.now()
  });

  // COPPA Compliance: Enhanced verification for under-13 users
  const requiresEnhancedVerification = ageGroup === 'under13';
  const verificationTimeLimit = 15 * 60 * 1000; // 15 minutes

  const generateVerificationCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const isFormValid = () => {
    const { parentData } = state;
    return parentData.firstName && 
           parentData.lastName && 
           parentData.email && 
           parentData.phone && 
           parentData.relationship && 
           parentData.verificationMethod &&
           parentData.agreedToTerms &&
           parentData.agreedToMonitoring;
  };

  const handleParentDataChange = (field: keyof ParentData, value: any) => {
    setState(prev => ({
      ...prev,
      parentData: {
        ...prev.parentData,
        [field]: value
      }
    }));
  };

  const sendVerificationCode = async () => {
    const code = generateVerificationCode();
    
    // In production, this would send actual SMS/email
    console.log('[PARENTAL_VERIFICATION]', {
      parentEmail: state.parentData.email,
      parentPhone: state.parentData.phone,
      verificationCode: code,
      ageGroup,
      childConsentId: childData.consentId,
      timestamp: new Date().toISOString()
    });

    setState(prev => ({
      ...prev,
      verificationCode: code,
      verificationSent: true,
      verificationStartTime: Date.now(),
      step: 'verification_process'
    }));

    // Simulate verification email/SMS
    alert(`DEMO: Verification code sent to ${state.parentData.email} and ${state.parentData.phone}: ${code}`);
  };

  const handleFinalConsent = () => {
    const parentalConsentId = `parental_consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log comprehensive parental consent for audit trail
    console.log('[PARENTAL_CONSENT_COMPLETE]', {
      parentalConsentId,
      ageGroup,
      childConsentId: childData.consentId,
      parentData: {
        ...state.parentData,
        // Remove sensitive data from logs
        phone: state.parentData.phone?.replace(/\d(?=\d{4})/g, '*'),
        email: state.parentData.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      },
      verificationMethod: state.parentData.verificationMethod,
      verificationTime: Date.now() - state.verificationStartTime,
      consentTimestamp: new Date().toISOString(),
      coppaCompliant: true,
      enhancedVerification: requiresEnhancedVerification
    });

    onConsentComplete(parentalConsentId, state.parentData.verificationMethod || '');
  };

  if (state.step === 'introduction') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <Users className="w-20 h-20 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Parental Consent Required</h1>
            <p className="text-gray-600 text-lg">
              {ageGroup === 'under13' 
                ? 'Federal law (COPPA) requires verified parental consent for users under 13.'
                : 'Enhanced privacy protection requires parental awareness for teen users.'
              }
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Why Parental Consent is Required</h3>
              <ul className="space-y-2 text-red-800">
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                  Legal compliance with Children's Online Privacy Protection Act (COPPA)
                </li>
                <li className="flex items-start">
                  <Lock className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                  Enhanced protection of your child's personal information and privacy
                </li>
                <li className="flex items-start">
                  <FileText className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                  Transparent disclosure of data collection and usage practices
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                  Robust safety features and crisis intervention capabilities
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">What We're Asking Permission For</h3>
              <div className="space-y-3 text-blue-800">
                <div>
                  <p className="font-medium">Enabled Features:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    {Object.entries(childData.consentChoices)
                      .filter(([_, enabled]) => enabled)
                      .map(([feature, _]) => (
                        <li key={feature} className="ml-4">
                          • {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {ageGroup === 'under13' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Enhanced COPPA Protections</h3>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>• No collection of personal information beyond what's necessary</li>
                  <li>• No behavioral advertising or tracking of your child</li>
                  <li>• Enhanced data security and limited retention periods</li>
                  <li>• Priority deletion rights and parental access controls</li>
                  <li>• Regular consent renewal and transparency reports</li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'parent_info' }))} 
              className="w-full text-lg py-3 bg-red-600 hover:bg-red-700"
            >
              Continue to Parent/Guardian Information
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="w-full"
            >
              Back to Privacy Setup
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This process typically takes 5-10 minutes and includes identity verification for security.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'parent_info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Parent/Guardian Information</h1>
            <p className="text-gray-600">
              Please provide your information for identity verification and consent documentation.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={state.parentData.firstName || ''}
                  onChange={(e) => handleParentDataChange('firstName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={state.parentData.lastName || ''}
                  onChange={(e) => handleParentDataChange('lastName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={state.parentData.email || ''}
                onChange={(e) => handleParentDataChange('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={state.parentData.phone || ''}
                onChange={(e) => handleParentDataChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Child *
              </label>
              <select
                id="relationship"
                value={state.parentData.relationship || ''}
                onChange={(e) => handleParentDataChange('relationship', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select relationship...</option>
                <option value="parent">Parent</option>
                <option value="legal_guardian">Legal Guardian</option>
                <option value="authorized_adult">Authorized Adult</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={state.parentData.agreedToTerms || false}
                  onChange={(e) => handleParentDataChange('agreedToTerms', e.target.checked)}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  I consent to my child's use of ALCHM and agree to the{' '}
                  <button 
                    onClick={() => window.open('/terms.html', '_blank')}
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button 
                    onClick={() => window.open('/privacy-policy.html', '_blank')}
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  . *
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={state.parentData.agreedToMonitoring || false}
                  onChange={(e) => handleParentDataChange('agreedToMonitoring', e.target.checked)}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  I understand that I can monitor my child's account activity and request data deletion at any time. *
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={state.parentData.receiveUpdates || false}
                  onChange={(e) => handleParentDataChange('receiveUpdates', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I would like to receive updates about my child's account activity and safety features.
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'verification_method' }))}
              disabled={!isFormValid()}
              className="w-full"
            >
              Continue to Identity Verification
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setState(prev => ({ ...prev, step: 'introduction' }))} 
              className="w-full"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'verification_method') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <Verified className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification Method</h1>
            <p className="text-gray-600">
              Choose how you'd like to verify your identity to complete the parental consent process.
            </p>
          </div>

          {requiresEnhancedVerification && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Enhanced Verification Required</p>
                  <p className="text-yellow-800 text-sm">
                    COPPA requires stronger identity verification for users under 13.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                state.parentData.verificationMethod === 'email_plus_sms' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleParentDataChange('verificationMethod', 'email_plus_sms')}
            >
              <div className="flex items-start space-x-3">
                <div className="flex space-x-1">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Email + SMS Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Receive verification codes via both email and text message.
                  </p>
                  <p className="text-green-700 text-sm font-medium mt-1">Recommended • Fast • Secure</p>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                state.parentData.verificationMethod === 'credit_card' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleParentDataChange('verificationMethod', 'credit_card')}
            >
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Credit Card Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Verify identity with a small refundable charge ($0.50) to your credit card.
                  </p>
                  <p className="text-blue-700 text-sm font-medium mt-1">COPPA Compliant • No Charge Kept</p>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                state.parentData.verificationMethod === 'government_id' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleParentDataChange('verificationMethod', 'government_id')}
            >
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Government ID Upload</h3>
                  <p className="text-gray-600 text-sm">
                    Upload a photo of your driver's license or government-issued ID.
                  </p>
                  <p className="text-purple-700 text-sm font-medium mt-1">
                    Highest Security • Manual Review • 24-48 Hours
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                state.parentData.verificationMethod === 'video_call' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleParentDataChange('verificationMethod', 'video_call')}
            >
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Video Call Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Schedule a brief video call with our verification team.
                  </p>
                  <p className="text-orange-700 text-sm font-medium mt-1">
                    Personal Touch • Schedule Required • 1-3 Business Days
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={sendVerificationCode}
              disabled={!state.parentData.verificationMethod}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Begin Verification Process
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setState(prev => ({ ...prev, step: 'parent_info' }))} 
              className="w-full"
            >
              Back to Parent Information
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'verification_process') {
    const timeRemaining = Math.max(0, verificationTimeLimit - (Date.now() - state.verificationStartTime));
    const minutesRemaining = Math.floor(timeRemaining / 60000);
    const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h1>
            <p className="text-gray-600">
              Please check your email and phone for verification codes.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                Time Remaining: {minutesRemaining}:{secondsRemaining.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-yellow-800 text-sm">
              For security, verification codes expire after 15 minutes.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="emailCode" className="block text-sm font-medium text-gray-700 mb-2">
                Email Verification Code
              </label>
              <input
                type="text"
                id="emailCode"
                placeholder="Enter 6-digit code from email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <div>
              <label htmlFor="smsCode" className="block text-sm font-medium text-gray-700 mb-2">
                SMS Verification Code
              </label>
              <input
                type="text"
                id="smsCode"
                placeholder="Enter 6-digit code from SMS"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'final_consent' }))}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify and Continue
            </Button>
            
            <Button 
              variant="outline" 
              onClick={sendVerificationCode}
              className="w-full"
            >
              Resend Verification Codes
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the codes? Check your spam folder or try resending.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'final_consent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Final Consent Confirmation</h1>
            <p className="text-gray-600 text-lg">
              Please review and confirm your consent for your child to use ALCHM.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Consent Summary</h3>
              <div className="space-y-3 text-green-800">
                <div className="flex justify-between">
                  <span>Child's Name:</span>
                  <span className="font-medium">{childData.firstName || 'Child'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parent/Guardian:</span>
                  <span className="font-medium">{state.parentData.firstName} {state.parentData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age Group:</span>
                  <span className="font-medium">
                    {ageGroup === 'under13' ? 'Under 13 (COPPA Protected)' : '13-17 (Teen Enhanced Protection)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Verification Method:</span>
                  <span className="font-medium">
                    {state.parentData.verificationMethod?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Features You're Consenting To</h3>
              <div className="space-y-2 text-blue-800">
                {Object.entries(childData.consentChoices)
                  .filter(([_, enabled]) => enabled)
                  .map(([feature, _]) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {ageGroup === 'under13' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">COPPA Protections Active</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• No behavioral advertising or tracking</li>
                  <li>• Limited data collection and sharing</li>
                  <li>• Enhanced deletion and access rights</li>
                  <li>• Priority crisis intervention support</li>
                  <li>• Regular consent renewal requirements</li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleFinalConsent}
              className="w-full text-lg py-3 bg-green-600 hover:bg-green-700"
            >
              <Shield className="w-5 h-5 mr-2" />
              Grant Parental Consent
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setState(prev => ({ ...prev, step: 'verification_process' }))} 
                className="flex-1"
              >
                Back to Verification
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open('/privacy-policy.html', '_blank')} 
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Review Privacy Policy
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By granting consent, you confirm that you are the parent or legal guardian of this child and 
              authorize their use of ALCHM under the terms described above.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}