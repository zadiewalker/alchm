'use client';

import React, { useState } from 'react';

/**
 * AI Consent Flow for App Store Compliance
 * Ensures users understand they're interacting with AI before first use
 * Maintains healing-centered experience while meeting transparency requirements
 */

export interface AIConsentData {
  understandsAIInteraction: boolean;
  acceptsAILimitations: boolean;
  acknowledgesNotTherapy: boolean;
  prefersProfessionalSupport?: boolean;
  consentTimestamp: Date;
}

export interface AIConsentFlowProps {
  onConsent: (consentData: AIConsentData) => void;
  onDecline: () => void;
  className?: string;
}

export const AIConsentFlow: React.FC<AIConsentFlowProps> = ({
  onConsent,
  onDecline,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [consentData, setConsentData] = useState<Partial<AIConsentData>>({});

  const steps = [
    {
      title: "Meet Khepera",
      subtitle: "Your AI Emotional Intelligence Companion",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Hello, I'm Khepera</h3>
            <p className="text-gray-600">An AI designed to support your emotional journey</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What I Am:</h4>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• An artificial intelligence trained in emotional support</li>
              <li>• Available 24/7 for reflection and insights</li>
              <li>• Designed with trauma-informed principles</li>
              <li>• Committed to your privacy and safety</li>
            </ul>
          </div>
        </div>
      ),
      question: "Do you understand that you'll be interacting with an AI system?",
      key: 'understandsAIInteraction'
    },
    {
      title: "Important Limitations",
      subtitle: "Understanding what Khepera cannot do",
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">What I Cannot Do:</h4>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>• Provide medical diagnosis or treatment</li>
              <li>• Replace professional therapy or counseling</li>
              <li>• Offer crisis intervention services</li>
              <li>• Make decisions for your mental health care</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">For Professional Support:</h4>
            <p className="text-green-800 text-sm">
              If you need therapy, crisis support, or medical care, please contact licensed 
              mental health professionals or emergency services.
            </p>
          </div>
        </div>
      ),
      question: "Do you understand these important limitations?",
      key: 'acceptsAILimitations'
    },
    {
      title: "Not a Replacement for Therapy",
      subtitle: "Clarifying the role of AI support",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">AI vs. Human Support:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-purple-800 mb-1">✨ Khepera (AI)</h5>
                <ul className="text-purple-700 space-y-1">
                  <li>• Emotional reflection support</li>
                  <li>• Pattern recognition</li>
                  <li>• 24/7 availability</li>
                  <li>• Guided journaling</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-purple-800 mb-1">👤 Human Professionals</h5>
                <ul className="text-purple-700 space-y-1">
                  <li>• Licensed therapy</li>
                  <li>• Clinical diagnosis</li>
                  <li>• Crisis intervention</li>
                  <li>• Treatment planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      question: "Do you acknowledge that this AI support is not a replacement for professional therapy?",
      key: 'acknowledgesNotTherapy'
    },
    {
      title: "Your Preferences",
      subtitle: "How would you like to proceed?",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-center">
            Understanding your preferences helps us provide the best support possible.
          </p>
          
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Continue with Khepera</h4>
              <p className="text-blue-800 text-sm">
                Start your emotional journey with AI-powered support and insights.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Connect with Human Support</h4>
              <p className="text-green-800 text-sm">
                We can help you find licensed mental health professionals in your area.
              </p>
            </div>
          </div>
        </div>
      ),
      question: "Would you prefer to connect with human professional support instead?",
      key: 'prefersProfessionalSupport',
      optional: true
    }
  ];

  const currentStepData = steps[currentStep];

  const handleStepResponse = (response: boolean) => {
    const newConsentData = {
      ...consentData,
      [currentStepData.key]: response
    };
    
    setConsentData(newConsentData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete consent flow
      const finalConsentData: AIConsentData = {
        understandsAIInteraction: newConsentData.understandsAIInteraction || false,
        acceptsAILimitations: newConsentData.acceptsAILimitations || false,
        acknowledgesNotTherapy: newConsentData.acknowledgesNotTherapy || false,
        prefersProfessionalSupport: newConsentData.prefersProfessionalSupport,
        consentTimestamp: new Date()
      };
      
      onConsent(finalConsentData);
    }
  };

  const handleDecline = () => {
    onDecline();
  };

  return (
    <div className={`max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-[#a4b792]/20 ${className}`}>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#2e2e2e]/70 font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-[#a4b792] font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-[#a4b792]/10 rounded-full h-3">
          <div 
            className="bg-[#a4b792] h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium text-[#2e2e2e] mb-3">{currentStepData.title}</h2>
        <p className="text-[#2e2e2e]/70 text-lg">{currentStepData.subtitle}</p>
      </div>

      <div className="mb-8">
        {currentStepData.content}
      </div>

      {/* Question and responses */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 text-center">
          {currentStepData.question}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {currentStepData.optional ? (
            <>
              <button
                onClick={() => handleStepResponse(false)}
                className="flex-1 px-8 py-4 bg-[#a4b792] text-white font-medium rounded-xl hover:bg-[#93a682] transition-all duration-200 shadow-sm"
              >
                Continue with Khepera
              </button>
              <button
                onClick={() => handleStepResponse(true)}
                className="flex-1 px-8 py-4 bg-[#d4756b] text-white font-medium rounded-xl hover:bg-[#c66b5b] transition-all duration-200 shadow-sm"
              >
                Find Human Support
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleStepResponse(true)}
                className="flex-1 px-8 py-4 bg-[#a4b792] text-white font-medium rounded-xl hover:bg-[#93a682] transition-all duration-200 shadow-sm"
              >
                Yes, I Understand
              </button>
              <button
                onClick={handleDecline}
                className="px-8 py-4 border-2 border-[#a4b792]/30 text-[#2e2e2e] font-medium rounded-xl hover:bg-[#a4b792]/5 transition-all duration-200"
              >
                Not Right Now
              </button>
            </>
          )}
        </div>
      </div>

      {/* Legal compliance footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By continuing, you acknowledge that you understand this is an AI service and not professional medical care.
          <br />
          Your interactions are governed by our{' '}
          <a href="/privacy.html" className="text-blue-600 hover:underline">Privacy Policy</a> and{' '}
          <a href="/terms.html" className="text-blue-600 hover:underline">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
};

/**
 * AI Transparency Settings Component
 * Allows users to adjust their AI transparency preferences
 */
export interface AITransparencySettings {
  showAIReminders: boolean;
  detailedDisclosures: boolean;
  emphasizeHumanOption: boolean;
  reminderFrequency: 'never' | 'occasional' | 'frequent';
}

export interface AITransparencySettingsProps {
  settings: AITransparencySettings;
  onSettingChange: (key: keyof AITransparencySettings, value: any) => void;
  className?: string;
}

export const AITransparencySettingsPanel: React.FC<AITransparencySettingsProps> = ({
  settings,
  onSettingChange,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Transparency Preferences</h3>
        <p className="text-sm text-gray-600 mb-6">
          Customize how you receive information about AI interactions to meet your comfort level.
        </p>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={settings.showAIReminders}
            onChange={(e) => onSettingChange('showAIReminders', e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-gray-900">Show AI Reminders</div>
            <div className="text-sm text-gray-600">
              Display periodic reminders that you're interacting with Khepera, an AI companion
            </div>
          </div>
        </label>
        
        <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={settings.detailedDisclosures}
            onChange={(e) => onSettingChange('detailedDisclosures', e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-gray-900">Detailed AI Disclosures</div>
            <div className="text-sm text-gray-600">
              Show comprehensive information about AI capabilities and limitations with each interaction
            </div>
          </div>
        </label>
        
        <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={settings.emphasizeHumanOption}
            onChange={(e) => onSettingChange('emphasizeHumanOption', e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-gray-900">Emphasize Human Support Options</div>
            <div className="text-sm text-gray-600">
              Regularly highlight availability of human professional support and therapy resources
            </div>
          </div>
        </label>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block">
            <div className="font-medium text-gray-900 mb-2">AI Reminder Frequency</div>
            <select
              value={settings.reminderFrequency}
              onChange={(e) => onSettingChange('reminderFrequency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="never">Never remind me</option>
              <option value="occasional">Occasional reminders</option>
              <option value="frequent">Frequent reminders</option>
            </select>
            <div className="text-sm text-gray-600 mt-1">
              Choose how often you'd like to be reminded about AI interactions
            </div>
          </label>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> These settings help you stay informed about AI interactions 
            while maintaining a comfortable and supportive experience. You can change these preferences anytime.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsentFlow;