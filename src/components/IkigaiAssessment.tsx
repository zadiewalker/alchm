'use client';

import React, { useState, useEffect } from 'react';
import { IKIGAI_STEPS } from '@/ai/flows/ikigai-discovery';
import { IkigaiAssessmentOutputType } from '@/ai/flows/ikigai-discovery';

interface IkigaiAssessmentProps {
  onComplete?: (result: IkigaiAssessmentOutputType) => void;
  className?: string;
}

interface IkigaiProgress {
  currentStep: number;
  progressPercentage: number;
  completionBadges: string[];
  sessions: any[];
  purposeStatement?: string;
}

const IkigaiAssessment: React.FC<IkigaiAssessmentProps> = ({ 
  onComplete,
  className = '' 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<IkigaiProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IkigaiAssessmentOutputType | null>(null);
  const [sessionId] = useState(`ikigai_${Date.now()}`);
  const [error, setError] = useState<string | null>(null);

  // Load existing progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/ikigai-assessment');
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        setCurrentStep(data.progress.currentStep);
      }
    } catch (error) {
      console.error('Error loading IKIGAI progress:', error);
    }
  };

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [`question_${questionIndex}`]: value
    }));
  };

  const handleStepSubmit = async () => {
    if (Object.keys(responses).length < 3) {
      setError('Please answer at least 3 questions to continue');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ikigai-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          currentStep,
          responses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process IKIGAI assessment');
      }

      const stepResult: IkigaiAssessmentOutputType = await response.json();
      setResult(stepResult);
      
      if (stepResult.nextStep) {
        setCurrentStep(stepResult.nextStep);
        setResponses({});
      }

      onComplete?.(stepResult);

      // Reload progress
      await loadProgress();

    } catch (error) {
      console.error('Error processing IKIGAI step:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToStep = (step: number) => {
    if (progress && step <= progress.progress.currentStep) {
      setCurrentStep(step);
      setResponses({});
      setResult(null);
    }
  };

  const currentStepData = IKIGAI_STEPS[currentStep as keyof typeof IKIGAI_STEPS];

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IKIGAI Discovery Journey
        </h1>
        <p className="text-gray-600 mb-4">
          Discover your purpose through the Japanese concept of IKIGAI - 
          the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress?.progressPercentage || (currentStep / 7) * 100}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-500">
          Step {currentStep} of 7 • {progress?.progressPercentage || Math.round((currentStep / 7) * 100)}% Complete
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.entries(IKIGAI_STEPS).map(([stepNum, step]) => {
          const stepNumber = parseInt(stepNum);
          const isCompleted = progress && stepNumber < progress.progress.currentStep;
          const isCurrent = stepNumber === currentStep;
          const isAccessible = progress && stepNumber <= progress.progress.currentStep;
          
          return (
            <button
              key={stepNum}
              onClick={() => goToStep(stepNumber)}
              disabled={!isAccessible}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCurrent 
                  ? 'bg-blue-500 text-white' 
                  : isCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : isAccessible
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {stepNumber}. {step.title}
            </button>
          );
        })}
      </div>

      {/* Completion Badges */}
      {progress && progress.completionBadges.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-gray-900 mb-2">Your Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {progress.completionBadges.map((badge, index) => (
              <span key={index} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Step */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-2">{currentStepData.description}</p>
          <div className="text-sm text-blue-600">
            ⏱️ Estimated time: {currentStepData.timeEstimate}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentStepData.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {index + 1}. {question}
              </label>
              <textarea
                value={responses[`question_${index}`] || ''}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder="Take your time to reflect and share your thoughts..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleStepSubmit}
            disabled={isLoading || Object.keys(responses).length < 3}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing your insights...
              </div>
            ) : currentStep === 7 ? (
              'Complete Your IKIGAI Journey'
            ) : (
              'Continue to Next Step'
            )}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Answer at least 3 questions to continue
        </div>
      </div>

      {/* Step Results */}
      {result && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            Step {currentStep - 1} Insights
          </h3>

          {/* Insights */}
          {result.insights.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
              <ul className="space-y-2">
                {result.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-500 mt-1">💡</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Purpose Statement */}
          {result.purposeStatement && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Your Purpose Statement</h4>
              <p className="text-purple-800 italic text-lg">"{result.purposeStatement}"</p>
            </div>
          )}

          {/* Career Suggestions */}
          {result.careerSuggestions && result.careerSuggestions.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Career Pathways</h4>
              <div className="space-y-3">
                {result.careerSuggestions.map((career, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{career.title}</h5>
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {Math.round(career.alignment * 100)}% match
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{career.description}</p>
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Next Steps:</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {career.steps.slice(0, 3).map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Steps */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Your Next Actions</h4>
            <div className="grid gap-2">
              {result.actionableSteps.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Session Prompt */}
          {result.nextSessionPrompt && (
            <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
              <p className="text-gray-700 font-medium">{result.nextSessionPrompt}</p>
            </div>
          )}
        </div>
      )}

      {/* Purpose Statement Display (if completed) */}
      {progress?.purposeStatement && currentStep > 6 && (
        <div className="bg-gradient-to-r from-gold-50 to-yellow-50 rounded-lg shadow-lg p-6 border border-yellow-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🌟 Your IKIGAI</h3>
            <blockquote className="text-lg text-gray-800 italic mb-4">
              "{progress.purposeStatement}"
            </blockquote>
            <p className="text-sm text-gray-600">
              This is your north star - let it guide your decisions and actions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IkigaiAssessment;