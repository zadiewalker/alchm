'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BetaAccessProps {
  referralCode?: string;
}

interface BetaFormData {
  email: string;
  cohortType: 'MENTAL_HEALTH_PROFESSIONALS' | 'EARLY_ADOPTERS' | 'REFERRALS' | 'GENERAL_WAITLIST';
  referralCode?: string;
  professionalCredentials?: {
    license: string;
    specialty: string;
    verified: boolean;
  };
  waitlistReason: string;
}

interface BetaResponse {
  success: boolean;
  status: 'active' | 'waitlist';
  message: string;
  betaCode?: string;
  waitlistPosition?: number;
  estimatedWaitWeeks?: number;
}

export default function BetaAccess({ referralCode }: BetaAccessProps) {
  const [formData, setFormData] = useState<BetaFormData>({
    email: '',
    cohortType: referralCode ? 'REFERRALS' : 'GENERAL_WAITLIST',
    referralCode: referralCode || '',
    waitlistReason: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<BetaResponse | null>(null);
  const [showProfessionalFields, setShowProfessionalFields] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In production, this would call the Firebase Function
      // For demo, simulate API response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse: BetaResponse = {
        success: true,
        status: referralCode || formData.cohortType === 'MENTAL_HEALTH_PROFESSIONALS' ? 'active' : 'waitlist',
        message: referralCode 
          ? 'Welcome to ALCHM beta! Check your email for next steps.'
          : formData.cohortType === 'MENTAL_HEALTH_PROFESSIONALS'
          ? 'Professional access granted! Welcome to ALCHM beta.'
          : `You've been added to our waitlist. Position: ${Math.floor(Math.random() * 2000) + 100}`,
        betaCode: referralCode || formData.cohortType === 'MENTAL_HEALTH_PROFESSIONALS' 
          ? `ALCHM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
          : undefined,
        waitlistPosition: !referralCode && formData.cohortType !== 'MENTAL_HEALTH_PROFESSIONALS' 
          ? Math.floor(Math.random() * 2000) + 100 
          : undefined,
        estimatedWaitWeeks: !referralCode && formData.cohortType !== 'MENTAL_HEALTH_PROFESSIONALS'
          ? Math.ceil((Math.floor(Math.random() * 2000) + 100) / 200)
          : undefined
      };
      
      setResult(mockResponse);
      
    } catch (error) {
      console.error('Beta access request failed:', error);
      setResult({
        success: false,
        status: 'waitlist',
        message: 'Something went wrong. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCohortChange = (cohort: BetaFormData['cohortType']) => {
    setFormData(prev => ({ ...prev, cohortType: cohort }));
    setShowProfessionalFields(cohort === 'MENTAL_HEALTH_PROFESSIONALS');
  };

  if (result) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-6">
          {result.status === 'active' ? (
            <div className="text-green-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mt-2">Welcome to ALCHM Beta!</h2>
            </div>
          ) : (
            <div className="text-blue-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mt-2">You're on the Waitlist</h2>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-700 text-center">{result.message}</p>
        </div>

        {result.betaCode && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium text-green-800 mb-2">Your Beta Code:</p>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <code className="text-lg font-mono font-bold text-green-700">{result.betaCode}</code>
              <button
                onClick={() => navigator.clipboard.writeText(result.betaCode!)}
                className="text-green-600 hover:text-green-800"
              >
                📋
              </button>
            </div>
            <p className="text-xs text-green-600 mt-2">
              Save this code! You'll need it to activate your account.
            </p>
          </div>
        )}

        {result.waitlistPosition && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">#{result.waitlistPosition}</div>
                <div className="text-sm text-blue-700">Your Position</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{result.estimatedWaitWeeks}</div>
                <div className="text-sm text-blue-700">Est. Weeks</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={() => {
              setResult(null);
              setFormData({
                email: '',
                cohortType: 'GENERAL_WAITLIST',
                referralCode: '',
                waitlistReason: ''
              });
            }}
            variant="outline"
            className="w-full"
          >
            Request Another Access Code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Join ALCHM Beta
        </h1>
        <p className="text-gray-600">
          {referralCode 
            ? 'You\'ve been invited to join our trauma-informed AI journaling platform'
            : 'Get early access to trauma-informed AI journaling'}
        </p>
      </div>

      {referralCode && (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
          <p className="text-sm font-medium text-purple-800">
            🎉 You have a referral code! This gives you priority access.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        {!referralCode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which best describes you?
            </label>
            <div className="space-y-2">
              {[
                { value: 'MENTAL_HEALTH_PROFESSIONALS', label: '🩺 Mental Health Professional', priority: 'High Priority' },
                { value: 'EARLY_ADOPTERS', label: '🚀 Tech Early Adopter', priority: 'Medium Priority' },
                { value: 'GENERAL_WAITLIST', label: '💜 Someone Ready to Heal', priority: 'Standard Priority' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.cohortType === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="cohortType"
                    value={option.value}
                    checked={formData.cohortType === option.value}
                    onChange={(e) => handleCohortChange(e.target.value as BetaFormData['cohortType'])}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.priority}</div>
                  </div>
                  {formData.cohortType === option.value && (
                    <div className="text-purple-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {showProfessionalFields && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <p className="text-sm font-medium text-blue-800">
              Professional Verification (Optional but increases priority)
            </p>
            <div>
              <input
                type="text"
                placeholder="License/Certification"
                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  professionalCredentials: {
                    ...prev.professionalCredentials,
                    license: e.target.value,
                    specialty: prev.professionalCredentials?.specialty || '',
                    verified: false
                  }
                }))}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Specialty (e.g., PTSD, CBT, DBT)"
                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  professionalCredentials: {
                    ...prev.professionalCredentials,
                    license: prev.professionalCredentials?.license || '',
                    specialty: e.target.value,
                    verified: false
                  }
                }))}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Why are you interested in ALCHM? (Optional)
          </label>
          <textarea
            id="reason"
            rows={3}
            value={formData.waitlistReason}
            onChange={(e) => setFormData(prev => ({ ...prev, waitlistReason: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Help us understand your wellness journey..."
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Requesting Access...
            </div>
          ) : (
            'Request Beta Access'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>We're launching with 10,000 beta users to ensure the best experience.</p>
        <p className="mt-1">All data is protected with enterprise-grade security.</p>
      </div>
    </div>
  );
}