'use client';

import React, { useState, useEffect } from 'react';
import { AIOptOutManager, AI_INTERACTION_LEVELS } from '@/lib/ai-opt-out-manager';

interface EnhancedAIOptOutProps {
  userId: string;
  currentPreferences?: any;
  onPreferencesUpdate: (preferences: any) => void;
}

export default function EnhancedAIOptOut({
  userId,
  currentPreferences,
  onPreferencesUpdate
}: EnhancedAIOptOutProps) {
  const [showOptOutDialog, setShowOptOutDialog] = useState(false);
  const [optOutProcess, setOptOutProcess] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [showTransparencyReport, setShowTransparencyReport] = useState(false);
  const [showGranularControls, setShowGranularControls] = useState(false);
  const [granularSettings, setGranularSettings] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const aiOptOutManager = AIOptOutManager.getInstance();

  useEffect(() => {
    // Initialize granular settings from current preferences
    if (currentPreferences) {
      const controls = aiOptOutManager.getGranularControls();
      const settings: Record<string, boolean> = {};
      controls.forEach(control => {
        settings[control.feature] = currentPreferences[control.feature] !== false;
      });
      setGranularSettings(settings);
    }
  }, [currentPreferences]);

  const handleInitiateOptOut = async () => {
    try {
      const process = await aiOptOutManager.initiateOptOut(userId, 'user_preference');
      setOptOutProcess(process);
      setShowOptOutDialog(true);
      setCurrentStep(0);
    } catch (error) {
      console.error('Failed to initiate opt-out process:', error);
    }
  };

  const handleStepChoice = (stepIndex: number, choice: string) => {
    setSelectedChoices(prev => ({
      ...prev,
      [stepIndex]: choice
    }));
  };

  const handleNextStep = () => {
    if (currentStep < optOutProcess.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOptOut = async () => {
    setIsProcessing(true);
    try {
      // Process the opt-out based on user choices
      const finalPreferences = await processOptOutChoices();
      onPreferencesUpdate(finalPreferences);
      setShowOptOutDialog(false);
      
      // Show confirmation
      alert('Your AI preferences have been updated successfully.');
    } catch (error) {
      console.error('Failed to complete opt-out:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processOptOutChoices = async () => {
    const step0Choice = selectedChoices[0]; // Opt-out decision
    const step1Choice = selectedChoices[1]; // Alternative choice
    const step2Choice = selectedChoices[2]; // Data handling
    
    let newLevel: 'none' | 'minimal' | 'standard' | 'enhanced' = 'none';
    
    switch (step0Choice) {
      case 'Yes, disable all AI':
        newLevel = 'none';
        break;
      case 'Switch to minimal AI':
        newLevel = 'minimal';
        break;
      case 'Customize settings':
        newLevel = currentPreferences?.interactionLevel || 'standard';
        break;
      case 'Cancel':
        return currentPreferences; // No changes
    }

    // Handle data choices
    if (step2Choice === 'Delete all AI data') {
      await handleDataDeletion();
    } else if (step2Choice === 'Export before deletion') {
      await handleDataExport();
    }

    return {
      ...currentPreferences,
      interactionLevel: newLevel,
      explicitOptOut: newLevel === 'none',
      lastUpdated: new Date().toISOString(),
      optOutReason: 'user_preference',
      dataHandlingChoice: step2Choice
    };
  };

  const handleDataDeletion = async () => {
    // Implementation for data deletion
    console.log('Deleting AI-generated data...');
  };

  const handleDataExport = async () => {
    // Implementation for data export
    console.log('Exporting AI-generated data...');
  };

  const handleGranularControlChange = (feature: string, enabled: boolean) => {
    setGranularSettings(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const saveGranularSettings = async () => {
    try {
      const updatedPreferences = {
        ...currentPreferences,
        ...granularSettings,
        lastUpdated: new Date().toISOString()
      };
      onPreferencesUpdate(updatedPreferences);
      alert('Your AI control settings have been updated.');
    } catch (error) {
      console.error('Failed to save granular settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const transparencyReport = aiOptOutManager.generateAITransparencyReport();
  const granularControls = aiOptOutManager.getGranularControls();

  return (
    <div className="space-y-6">
      {/* Current AI Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">AI Interaction Controls</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium text-gray-900">
              Current Level: {currentPreferences?.interactionLevel ? 
                AI_INTERACTION_LEVELS[currentPreferences.interactionLevel]?.name : 
                'Not Set'}
            </h3>
            <p className="text-gray-600 text-sm">
              {currentPreferences?.interactionLevel ? 
                AI_INTERACTION_LEVELS[currentPreferences.interactionLevel]?.description : 
                'No AI interaction level configured'}
            </p>
          </div>
          
          <div className="space-x-3">
            <button
              onClick={() => setShowTransparencyReport(true)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              How AI Works
            </button>
            <button
              onClick={handleInitiateOptOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Change AI Settings
            </button>
          </div>
        </div>

        {/* Quick Status */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded p-3">
            <div className="font-medium text-gray-900">AI Analysis</div>
            <div className={`text-sm ${
              currentPreferences?.enableAIAnalysis ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentPreferences?.enableAIAnalysis ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="font-medium text-gray-900">AI Prompts</div>
            <div className={`text-sm ${
              currentPreferences?.enableAIPrompts ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentPreferences?.enableAIPrompts ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="font-medium text-gray-900">Crisis Safety</div>
            <div className="text-sm text-green-600">Always Enabled</div>
          </div>
        </div>
      </div>

      {/* Granular Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Detailed AI Controls</h3>
          <button
            onClick={() => setShowGranularControls(!showGranularControls)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showGranularControls ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {showGranularControls && (
          <div className="space-y-4">
            {granularControls.map((control) => (
              <div key={control.feature} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{control.feature}</h4>
                    <p className="text-gray-600 text-sm">{control.description}</p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={granularSettings[control.feature] !== false}
                      onChange={(e) => handleGranularControlChange(control.feature, e.target.checked)}
                      disabled={!control.canOptOut}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h5 className="text-xs font-medium text-green-700 mb-1">Benefits</h5>
                    <ul className="text-xs text-green-600 space-y-1">
                      {control.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-orange-700 mb-1">Considerations</h5>
                    <ul className="text-xs text-orange-600 space-y-1">
                      {control.risks.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {!control.canOptOut && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 rounded p-2">
                    This feature is required for your safety and cannot be disabled.
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={saveGranularSettings}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Detailed Settings
            </button>
          </div>
        )}
      </div>

      {/* AI Transparency Report Dialog */}
      {showTransparencyReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-900">How AI Works in ALCHM</h2>
              <button
                onClick={() => setShowTransparencyReport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">What Our AI Does</h3>
                <ul className="space-y-2">
                  {transparencyReport.whatAIDoes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">What Our AI Does NOT Do</h3>
                <ul className="space-y-2">
                  {transparencyReport.whatAIDoesNOT.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Data and Privacy</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(transparencyReport.howYourDataIsUsed).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded p-3">
                      <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="text-gray-600 text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Rights</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {transparencyReport.yourRights.map((right, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700 text-sm">{right}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Safety Measures</h3>
                <ul className="space-y-2">
                  {transparencyReport.safetyMeasures.map((measure, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">🛡️</span>
                      <span className="text-gray-700">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTransparencyReport(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opt-Out Process Dialog */}
      {showOptOutDialog && optOutProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-900">Modify AI Settings</h2>
              <button
                onClick={() => setShowOptOutDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {optOutProcess.steps.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / optOutProcess.steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {optOutProcess.steps[currentStep]?.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {optOutProcess.steps[currentStep]?.description}
              </p>

              <div className="space-y-3">
                {optOutProcess.steps[currentStep]?.options.map((option: string, index: number) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`step_${currentStep}`}
                      value={option}
                      checked={selectedChoices[currentStep] === option}
                      onChange={() => handleStepChoice(currentStep, option)}
                      className="mr-3"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>

              {/* Show analog alternative on first step */}
              {currentStep === 1 && optOutProcess.alternativeOffered && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">
                    {optOutProcess.alternativeOffered.title}
                  </h4>
                  <ul className="text-amber-800 text-sm space-y-1">
                    {optOutProcess.alternativeOffered.features.map((feature: string, index: number) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Show data handling options on third step */}
              {currentStep === 2 && optOutProcess.dataHandlingOptions && (
                <div className="mt-4 space-y-3">
                  {optOutProcess.dataHandlingOptions.map((option: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <h5 className="font-medium text-gray-900">{option.option}</h5>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Timeline: {option.timeline}</span>
                        <span>{option.reversible ? 'Reversible' : 'Permanent'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              <div className="space-x-3">
                <button
                  onClick={() => setShowOptOutDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>

                {currentStep === optOutProcess.steps.length - 1 ? (
                  <button
                    onClick={handleCompleteOptOut}
                    disabled={!selectedChoices[currentStep] || isProcessing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Changes'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedChoices[currentStep]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}