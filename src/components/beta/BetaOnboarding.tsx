'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { betaUserService } from '@/lib/beta/betaUserService';
import { BetaUser } from '@/types/beta';

interface BetaOnboardingProps {
  onComplete: (betaUser: BetaUser) => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export function BetaOnboarding({ onComplete }: BetaOnboardingProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Beta Testing',
      description: 'Learn about your role as a beta tester',
      component: WelcomeStep
    },
    {
      id: 'profile',
      title: 'Beta Profile Setup',
      description: 'Tell us about your testing setup and preferences',
      component: ProfileStep
    },
    {
      id: 'permissions',
      title: 'Testing Permissions',
      description: 'Configure your testing preferences and consent',
      component: PermissionsStep
    },
    {
      id: 'guidelines',
      title: 'Testing Guidelines',
      description: 'Review important testing guidelines and expectations',
      component: GuidelinesStep
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Your beta testing account is ready',
      component: CompleteStep
    }
  ];

  const handleStepComplete = (data: any) => {
    setStepData(prev => ({ ...prev, ...data }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finalizeBetaUser();
    }
  };

  const finalizeBetaUser = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const betaUser = await betaUserService.createBetaUser(user.uid, {
        email: user.email,
        displayName: user.displayName,
        ...stepData.profile,
        communicationPreferences: stepData.permissions?.communicationPreferences
      });

      // Update user status to active
      await betaUserService.updateBetaUser(betaUser.id, {
        status: 'active'
      });

      onComplete(betaUser);
    } catch (err) {
      setError('Failed to complete beta user setup. Please try again.');
      console.error('Error finalizing beta user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium text-gray-900">Beta Testing Setup</h1>
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep].description}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <CurrentStepComponent
          data={stepData[steps[currentStep].id]}
          onComplete={handleStepComplete}
          onPrevious={currentStep > 0 ? handlePrevious : undefined}
          loading={loading}
        />
      </Card>
    </div>
  );
}

// Individual Step Components

function WelcomeStep({ onComplete, onPrevious }: any) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thank you for joining our beta testing program!
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            As a beta tester, you'll help us improve ALCHM by testing new features, reporting bugs, 
            and providing valuable feedback about your experience.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-900 mb-2">What you'll do:</h4>
            <ul className="space-y-1 text-blue-800">
              <li>• Test new features before they're released</li>
              <li>• Report bugs and provide detailed feedback</li>
              <li>• Participate in surveys and interviews</li>
              <li>• Help shape the future of digital wellness</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="font-medium text-green-900 mb-2">What you'll get:</h4>
            <ul className="space-y-1 text-green-800">
              <li>• Early access to new features</li>
              <li>• Direct influence on product development</li>
              <li>• Recognition in our beta tester community</li>
              <li>• Potential rewards for valuable contributions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onComplete({})}>
          Let's Get Started
        </Button>
      </div>
    </div>
  );
}

function ProfileStep({ data, onComplete, onPrevious }: any) {
  const [profile, setProfile] = useState({
    primaryDevice: data?.primaryDevice || '',
    operatingSystem: data?.operatingSystem || '',
    browser: data?.browser || '',
    experience: data?.experience || '',
    interests: data?.interests || [],
    availabilityHours: data?.availabilityHours || 5,
    timeZone: data?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...data
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const deviceOptions = ['mobile', 'tablet', 'desktop'];
  const experienceOptions = ['beginner', 'intermediate', 'advanced'];
  const interestOptions = [
    'Mental Health',
    'Journaling',
    'Mindfulness',
    'Personal Growth',
    'Technology',
    'Mobile Apps',
    'User Experience',
    'Accessibility'
  ];

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.primaryDevice) newErrors.primaryDevice = 'Please select your primary device';
    if (!profile.experience) newErrors.experience = 'Please select your experience level';
    if (profile.availabilityHours < 1) newErrors.availabilityHours = 'Please provide availability hours';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateProfile()) {
      onComplete({ profile });
    }
  };

  const handleInterestToggle = (interest: string) => {
    const updated = profile.interests.includes(interest)
      ? profile.interests.filter((i: string) => i !== interest)
      : [...profile.interests, interest];
    
    setProfile(prev => ({ ...prev, interests: updated }));
  };

  // Auto-detect user's device and browser
  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      let device = 'desktop';
      
      if (/Mobile|Android|iPhone|iPad/.test(ua)) {
        device = /iPad/.test(ua) ? 'tablet' : 'mobile';
      }
      
      const browser = ua.includes('Chrome') ? 'Chrome' :
                     ua.includes('Firefox') ? 'Firefox' :
                     ua.includes('Safari') ? 'Safari' :
                     ua.includes('Edge') ? 'Edge' : 'Other';
      
      const os = ua.includes('Windows') ? 'Windows' :
                ua.includes('Mac') ? 'macOS' :
                ua.includes('Linux') ? 'Linux' :
                ua.includes('Android') ? 'Android' :
                ua.includes('iOS') ? 'iOS' : 'Other';
      
      setProfile(prev => ({
        ...prev,
        primaryDevice: prev.primaryDevice || device,
        browser: prev.browser || browser,
        operatingSystem: prev.operatingSystem || os
      }));
    };

    detectDevice();
  }, []);

  return (
    <div>
      <div className="space-y-6">
        {/* Primary Device */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Testing Device *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {deviceOptions.map(device => (
              <button
                key={device}
                type="button"
                onClick={() => setProfile(prev => ({ ...prev, primaryDevice: device }))}
                className={`p-3 border rounded-md text-center capitalize ${
                  profile.primaryDevice === device
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {device}
              </button>
            ))}
          </div>
          {errors.primaryDevice && (
            <p className="text-red-500 text-sm mt-1">{errors.primaryDevice}</p>
          )}
        </div>

        {/* Operating System */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operating System
          </label>
          <input
            type="text"
            value={profile.operatingSystem}
            onChange={(e) => setProfile(prev => ({ ...prev, operatingSystem: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., macOS, Windows, Android"
          />
        </div>

        {/* Browser */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Browser
          </label>
          <input
            type="text"
            value={profile.browser}
            onChange={(e) => setProfile(prev => ({ ...prev, browser: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Chrome, Safari, Firefox"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level *
          </label>
          <select
            value={profile.experience}
            onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your experience level</option>
            {experienceOptions.map(level => (
              <option key={level} value={level} className="capitalize">
                {level}
              </option>
            ))}
          </select>
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas of Interest
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map(interest => (
              <label key={interest} className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Availability (hours) *
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={profile.availabilityHours}
            onChange={(e) => setProfile(prev => ({ ...prev, availabilityHours: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.availabilityHours && (
            <p className="text-red-500 text-sm mt-1">{errors.availabilityHours}</p>
          )}
        </div>

        {/* Time Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Zone
          </label>
          <input
            type="text"
            value={profile.timeZone}
            onChange={(e) => setProfile(prev => ({ ...prev, timeZone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., America/New_York"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function PermissionsStep({ data, onComplete, onPrevious }: any) {
  const [permissions, setPermissions] = useState({
    canReportBugs: data?.canReportBugs ?? true,
    canParticipateInSurveys: data?.canParticipateInSurveys ?? true,
    canScheduleInterviews: data?.canScheduleInterviews ?? false,
    communicationPreferences: {
      email: data?.communicationPreferences?.email ?? true,
      inApp: data?.communicationPreferences?.inApp ?? true,
      sms: data?.communicationPreferences?.sms ?? false,
      ...data?.communicationPreferences
    },
    dataCollection: data?.dataCollection ?? true,
    analytics: data?.analytics ?? true,
    ...data
  });

  const handleSubmit = () => {
    onComplete({ permissions });
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Testing Permissions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Permissions</h3>
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={permissions.canReportBugs}
                onChange={(e) => setPermissions(prev => ({ ...prev, canReportBugs: e.target.checked }))}
                className="mr-3 mt-1"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Bug Reporting</span>
                <p className="text-sm text-gray-500">Allow automatic bug detection and reporting</p>
              </div>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={permissions.canParticipateInSurveys}
                onChange={(e) => setPermissions(prev => ({ ...prev, canParticipateInSurveys: e.target.checked }))}
                className="mr-3 mt-1"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Survey Participation</span>
                <p className="text-sm text-gray-500">Participate in feedback surveys and questionnaires</p>
              </div>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={permissions.canScheduleInterviews}
                onChange={(e) => setPermissions(prev => ({ ...prev, canScheduleInterviews: e.target.checked }))}
                className="mr-3 mt-1"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">User Interviews</span>
                <p className="text-sm text-gray-500">Participate in one-on-one interviews and usability sessions</p>
              </div>
            </label>
          </div>
        </div>

        {/* Communication Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={permissions.communicationPreferences.email}
                onChange={(e) => setPermissions(prev => ({
                  ...prev,
                  communicationPreferences: {
                    ...prev.communicationPreferences,
                    email: e.target.checked
                  }
                }))}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">Email notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={permissions.communicationPreferences.inApp}
                onChange={(e) => setPermissions(prev => ({
                  ...prev,
                  communicationPreferences: {
                    ...prev.communicationPreferences,
                    inApp: e.target.checked
                  }
                }))}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">In-app notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={permissions.communicationPreferences.sms}
                onChange={(e) => setPermissions(prev => ({
                  ...prev,
                  communicationPreferences: {
                    ...prev.communicationPreferences,
                    sms: e.target.checked
                  }
                }))}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">SMS notifications (optional)</span>
            </label>
          </div>
        </div>

        {/* Data Collection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data Collection</h3>
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={permissions.dataCollection}
                onChange={(e) => setPermissions(prev => ({ ...prev, dataCollection: e.target.checked }))}
                className="mr-3 mt-1"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Usage Data Collection</span>
                <p className="text-sm text-gray-500">Allow collection of anonymous usage data to improve the app</p>
              </div>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={permissions.analytics}
                onChange={(e) => setPermissions(prev => ({ ...prev, analytics: e.target.checked }))}
                className="mr-3 mt-1"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Analytics Tracking</span>
                <p className="text-sm text-gray-500">Help us understand how features are used and improve user experience</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function GuidelinesStep({ onComplete, onPrevious }: any) {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const guidelines = [
    {
      id: 'confidentiality',
      title: 'Confidentiality',
      content: 'Keep all beta features and information confidential. Do not share screenshots, videos, or details about unreleased features on social media or with non-beta users.'
    },
    {
      id: 'quality_feedback',
      title: 'Quality Feedback',
      content: 'Provide detailed, constructive feedback. Include steps to reproduce issues, expected vs. actual behavior, and suggestions for improvement.'
    },
    {
      id: 'regular_participation',
      title: 'Regular Participation',
      content: 'Stay actively engaged in the beta program. Test new features regularly and respond to surveys and feedback requests in a timely manner.'
    },
    {
      id: 'respectful_communication',
      title: 'Respectful Communication',
      content: 'Communicate respectfully with the development team and other beta testers. Provide honest but constructive criticism.'
    },
    {
      id: 'data_privacy',
      title: 'Data Privacy',
      content: 'Understand that beta versions may collect additional data for testing purposes. Your privacy is important to us and data will be handled according to our privacy policy.'
    }
  ];

  const allAcknowledged = guidelines.every(g => acknowledged[g.id]);

  const handleSubmit = () => {
    if (allAcknowledged) {
      onComplete({ guidelines: acknowledged });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">
          Please review and acknowledge the following guidelines for beta testing:
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {guidelines.map(guideline => (
          <div key={guideline.id} className="border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-900 mb-2">{guideline.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{guideline.content}</p>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={acknowledged[guideline.id] || false}
                onChange={(e) => setAcknowledged(prev => ({
                  ...prev,
                  [guideline.id]: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">I understand and agree to this guideline</span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleSubmit} disabled={!allAcknowledged}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
}

function CompleteStep({ loading }: any) {
  return (
    <div className="text-center">
      {loading ? (
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Setting up your beta account...
          </h3>
          <p className="text-gray-600">
            Please wait while we configure your beta testing permissions.
          </p>
        </div>
      ) : (
        <div>
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Welcome to the Beta Program!
          </h3>
          <p className="text-gray-600 mb-6">
            Your beta testing account has been set up successfully. You now have access to beta features and can start providing valuable feedback.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800 text-sm">
              Look for the beta indicator in your dashboard to access new features and provide feedback.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}