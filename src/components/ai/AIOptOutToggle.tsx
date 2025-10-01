'use client';

import React, { useState, useEffect } from 'react';

export interface AIPreferences {
  enableAIAnalysis: boolean;
  enableAIPrompts: boolean;
  enableCrisisSafety: boolean; // Always true for safety
  analogMode: boolean;
  consentGiven: boolean;
  lastUpdated: string;
}

interface AIOptOutToggleProps {
  userId: string;
  onPreferencesChange?: (preferences: AIPreferences) => void;
  initialPreferences?: Partial<AIPreferences>;
}

export default function AIOptOutToggle({ 
  userId, 
  onPreferencesChange,
  initialPreferences = {}
}: AIOptOutToggleProps) {
  const [preferences, setPreferences] = useState<AIPreferences>({
    enableAIAnalysis: true,
    enableAIPrompts: true,
    enableCrisisSafety: true, // Always true for safety
    analogMode: false,
    consentGiven: false,
    lastUpdated: new Date().toISOString(),
    ...initialPreferences
  });

  const [showDetails, setShowDetails] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(!preferences.consentGiven);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, [userId]);

  const loadUserPreferences = async () => {
    try {
      const response = await fetch(`/api/user/ai-preferences`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPreferences(prev => ({ ...prev, ...data.data.preferences }));
          setShowConsentDialog(!data.data.preferences.consentGiven);
        }
      }
    } catch (error) {
      console.error('Failed to load AI preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: AIPreferences) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/ai-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPreferences)
      });

      if (response.ok) {
        setPreferences(newPreferences);
        onPreferencesChange?.(newPreferences);
      }
    } catch (error) {
      console.error('Failed to save AI preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentGiven = () => {
    const updatedPreferences = {
      ...preferences,
      consentGiven: true,
      lastUpdated: new Date().toISOString()
    };
    savePreferences(updatedPreferences);
    setShowConsentDialog(false);
  };

  const handleOptOutOfAI = () => {
    const updatedPreferences = {
      ...preferences,
      enableAIAnalysis: false,
      enableAIPrompts: false,
      analogMode: true,
      lastUpdated: new Date().toISOString()
    };
    savePreferences(updatedPreferences);
  };

  const handlePreferenceChange = (key: keyof AIPreferences, value: boolean) => {
    // Crisis safety is always enabled for user protection
    if (key === 'enableCrisisSafety') return;

    let updatedPreferences = {
      ...preferences,
      [key]: value,
      lastUpdated: new Date().toISOString()
    };

    // If enabling analog mode, disable AI features
    if (key === 'analogMode' && value) {
      updatedPreferences = {
        ...updatedPreferences,
        enableAIAnalysis: false,
        enableAIPrompts: false
      };
    }

    // If enabling AI features, disable analog mode
    if ((key === 'enableAIAnalysis' || key === 'enableAIPrompts') && value) {
      updatedPreferences = {
        ...updatedPreferences,
        analogMode: false
      };
    }

    savePreferences(updatedPreferences);
  };

  // AI Consent Dialog
  if (showConsentDialog) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Assisted Journaling</h2>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-700">
              ALCHM can enhance your journaling experience with AI-powered insights and reflections. 
              Before we begin, we want you to understand how our AI works and give you complete control 
              over your experience.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What Our AI Does</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Provides gentle, trauma-informed reflection insights</li>
                <li>• Suggests culturally-appropriate coping strategies</li>
                <li>• Detects crisis language and provides immediate safety resources</li>
                <li>• Generates personalized reflection prompts</li>
                <li>• Recognizes emotional patterns and growth</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">What Our AI Does NOT Do</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Diagnose mental health conditions</li>
                <li>• Provide medical or psychiatric advice</li>
                <li>• Replace professional therapy or counseling</li>
                <li>• Store or remember your conversations</li>
                <li>• Share your data with third parties</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Your Choices</h3>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• You can disable AI features at any time</li>
                <li>• You can use analog (non-AI) journaling mode</li>
                <li>• Crisis safety features remain active for your protection</li>
                <li>• All your data is encrypted and private</li>
                <li>• You own your journal content completely</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-800 text-sm">
                <strong>I am an AI assistant designed to support your journaling practice.</strong> I am not a 
                licensed healthcare provider and cannot diagnose conditions or recommend specific treatments. 
                If you're experiencing mental health concerns, please consult a qualified professional. 
                For crisis situations, please contact emergency services or crisis hotlines.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOptOutOfAI}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Journal Without AI
            </button>
            <button
              onClick={handleConsentGiven}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enable AI-Assisted Journaling
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            You can change these preferences anytime in your settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Interaction Preferences</h3>
          <p className="text-gray-600 text-sm">Control how AI assists your journaling experience</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Current Mode Display */}
      <div className="mb-6">
        {preferences.analogMode ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium text-green-800">Analog Journaling Mode</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              You're journaling without AI assistance. Your words, your wisdom.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="font-medium text-blue-800">AI-Assisted Journaling</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              AI provides gentle insights and culturally-aware support.
            </p>
          </div>
        )}
      </div>

      {/* Preference Controls */}
      <div className="space-y-4">
        {/* Analog Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-900">Analog Journaling Mode</label>
            <p className="text-gray-600 text-sm">Journal without any AI processing or analysis</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.analogMode}
              onChange={(e) => handlePreferenceChange('analogMode', e.target.checked)}
              disabled={isLoading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* AI Analysis Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-900">AI Analysis & Insights</label>
            <p className="text-gray-600 text-sm">Get AI-powered emotional insights and pattern recognition</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.enableAIAnalysis}
              onChange={(e) => handlePreferenceChange('enableAIAnalysis', e.target.checked)}
              disabled={isLoading || preferences.analogMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
          </label>
        </div>

        {/* AI Prompts Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-900">AI Reflection Prompts</label>
            <p className="text-gray-600 text-sm">Receive personalized reflection questions from AI</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.enableAIPrompts}
              onChange={(e) => handlePreferenceChange('enableAIPrompts', e.target.checked)}
              disabled={isLoading || preferences.analogMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
          </label>
        </div>

        {/* Crisis Safety (Always Enabled) */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-900">Crisis Safety Detection</label>
            <p className="text-gray-600 text-sm">Automatic detection and support for crisis situations (always enabled)</p>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 text-sm mr-2">Always Active</span>
            <div className="w-11 h-6 bg-green-600 rounded-full relative">
              <div className="absolute top-[2px] right-[2px] bg-white border-green-300 border rounded-full h-5 w-5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">How AI Assists Your Journaling</h4>
            <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
              <li>Provides trauma-informed emotional support and validation</li>
              <li>Suggests culturally-appropriate coping strategies and resources</li>
              <li>Recognizes emotional patterns and growth over time</li>
              <li>Generates personalized reflection prompts based on your entries</li>
              <li>Offers gentle reframing and strength-based perspectives</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Privacy & Safety</h4>
            <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
              <li>AI conversations are stateless - no memory between sessions</li>
              <li>All journal content is encrypted end-to-end</li>
              <li>Crisis detection provides immediate safety resources</li>
              <li>You can export or delete your data at any time</li>
              <li>No personal data is shared with AI providers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Analog Journaling Benefits</h4>
            <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
              <li>Complete privacy with no AI processing</li>
              <li>Direct connection to your inner wisdom</li>
              <li>Trauma-informed reflection prompts from human experts</li>
              <li>Cultural grounding practices and traditional wisdom</li>
              <li>Freedom from digital analysis and feedback</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>Remember:</strong> You can change these preferences at any time. 
              The goal is to support your healing journey in whatever way feels most comfortable and authentic to you.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {preferences.analogMode ? (
          <button
            onClick={() => handlePreferenceChange('analogMode', false)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Enable AI Assistance
          </button>
        ) : (
          <button
            onClick={handleOptOutOfAI}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Switch to Analog Mode
          </button>
        )}
        
        <button
          onClick={() => setShowConsentDialog(true)}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          Review AI Information
        </button>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 mt-3">
        Last updated: {new Date(preferences.lastUpdated).toLocaleDateString()}
      </p>
    </div>
  );
}