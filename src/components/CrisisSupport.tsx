/**
 * Crisis Support Component
 * 
 * Provides gentle, trauma-informed crisis intervention within the writing experience.
 * Activates when crisis indicators are detected, offering immediate support and resources.
 */

"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { crisisCare } from '@/lib/emotional-intelligence';
import { MedicalDisclaimer } from '@/components/ui/MedicalDisclaimer';

interface CrisisSupportProps {
  isVisible: boolean;
  onContinueWriting: () => void;
  onClose: () => void;
  severity: 'mild' | 'moderate' | 'severe';
}

export function CrisisSupport({ 
  isVisible, 
  onContinueWriting, 
  onClose,
  severity 
}: CrisisSupportProps) {
  const [currentStep, setCurrentStep] = useState<'detection' | 'check' | 'resources' | 'safety'>('detection');
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingCount, setBreathingCount] = useState(0);

  // Auto-progress through steps based on severity
  useEffect(() => {
    if (isVisible) {
      if (severity === 'severe') {
        setCurrentStep('resources');
      } else {
        setCurrentStep('detection');
      }
    }
  }, [isVisible, severity]);

  // Breathing exercise
  const startBreathingExercise = () => {
    setShowBreathing(true);
    setBreathingCount(0);
    
    const interval = setInterval(() => {
      setBreathingCount(prev => {
        if (prev >= 6) { // 3 breaths (in + out)
          clearInterval(interval);
          setShowBreathing(false);
          return 0;
        }
        return prev + 1;
      });
    }, 4000); // 4 seconds per breath phase
  };

  const handleSafetyResponse = (response: string) => {
    setUserResponse(response);
    
    switch (response) {
      case "I'm okay for now":
        setCurrentStep('safety');
        break;
      case "I could use support":
        setCurrentStep('resources');
        break;
      case "Help me find resources":
        setCurrentStep('resources');
        break;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-rose-50 via-white to-sage-50 border-rose-200/50 shadow-2xl">
        
        {/* Breathing Exercise Overlay */}
        {showBreathing && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
            <div className="text-center">
              <div className={`w-24 h-24 bg-gradient-to-br from-sage-200 to-sage-300 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-4000 ${
                breathingCount % 2 === 0 ? 'scale-100' : 'scale-125'
              }`}>
                <div className="w-12 h-12 bg-sage-500 rounded-full animate-breathe"></div>
              </div>
              <h3 className="text-xl font-medium text-ink mb-2">
                {breathingCount % 2 === 0 ? 'Breathe in slowly...' : 'Breathe out gently...'}
              </h3>
              <p className="text-muted">
                Just focus on your breath. You're safe right now.
              </p>
            </div>
          </div>
        )}

        {/* Detection Step */}
        {currentStep === 'detection' && (
          <div className="text-center">
            {/* MANDATORY App Store Crisis Disclaimer */}
            <MedicalDisclaimer 
              variant="crisis" 
              className="mb-6 text-left"
              showCrisisResources={true}
              context="crisis"
              severity="crisis"
            />
            
            <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-medium text-ink mb-4">
              We see you
            </h2>
            
            <p className="text-lg text-muted leading-relaxed mb-8 max-w-md mx-auto">
              {crisisCare.detection.message} Your courage in sharing this is remarkable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep('check')}
                size="lg"
                className="bg-sage-400 hover:bg-sage-500 text-white"
              >
                I could use some support
              </Button>
              
              <Button
                onClick={startBreathingExercise}
                variant="outline"
                size="lg"
                className="border-sage-300 text-sage-700 hover:bg-sage-50"
              >
                Help me breathe first
              </Button>
              
              <Button
                onClick={onContinueWriting}
                variant="ghost"
                size="lg"
                className="text-muted hover:text-ink"
              >
                Keep writing
              </Button>
            </div>
          </div>
        )}

        {/* Gentle Check Step */}
        {currentStep === 'check' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-sage-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-pulse"></div>
              </div>
              
              <h3 className="text-xl font-medium text-ink mb-4">
                Taking care of you
              </h3>
              
              <p className="text-muted leading-relaxed">
                {crisisCare.gentleCheck.message}
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              {crisisCare.gentleCheck.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSafetyResponse(option)}
                  className="w-full p-4 text-left bg-sage-50 hover:bg-sage-100 border border-sage-200 hover:border-sage-300 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50"
                >
                  <span className="font-medium text-ink">{option}</span>
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={onContinueWriting}
                className="text-sm text-muted hover:text-ink underline decoration-muted/50 hover:decoration-ink/50 transition-all duration-300"
              >
                I just want to keep writing for now
              </button>
            </div>
          </div>
        )}

        {/* Resources Step */}
        {currentStep === 'resources' && (
          <div>
            {/* Crisis Resources Disclaimer - App Store Compliance */}
            <div className="mb-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-red-800 font-medium mb-1">
                      <strong>Emergency Professional Care Required</strong>
                    </p>
                    <p className="text-red-700 text-xs">
                      ALCHM cannot provide emergency mental health treatment. The resources below connect you to trained crisis professionals who can provide immediate, life-saving support. These services are confidential and available 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-medium text-ink mb-4">
                Professional support is here
              </h3>
              
              <p className="text-lg text-muted leading-relaxed mb-8">
                {crisisCare.resources.message}
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              {crisisCare.resources.options.map((resource) => (
                <div
                  key={resource.text}
                  className="p-6 bg-white border border-blue-200/50 rounded-2xl shadow-soft"
                >
                  {resource.action.startsWith('tel:') || resource.action.startsWith('sms:') ? (
                    <a
                      href={resource.action}
                      className="block text-center group transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors duration-300">
                          {resource.action.startsWith('tel:') && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          )}
                          {resource.action.startsWith('sms:') && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-blue-700 group-hover:text-blue-800 transition-colors duration-300">
                          {resource.text}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <button
                      onClick={onContinueWriting}
                      className="w-full text-center p-2 font-medium text-sage-700 hover:text-sage-800 transition-colors duration-300"
                    >
                      {resource.text}
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted">
                These numbers are staffed by people who understand and want to help.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={startBreathingExercise}
                  variant="outline"
                  size="sm"
                  className="border-sage-300"
                >
                  Take a breathing break
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                >
                  Close for now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Safety Planning Step */}
        {currentStep === 'safety' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h3 className="text-xl font-medium text-ink mb-4">
                Building your support
              </h3>
              
              <p className="text-muted leading-relaxed mb-8">
                {crisisCare.safetyPlanning.message}
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              {crisisCare.safetyPlanning.prompts.map((prompt, index) => (
                <div key={index} className="p-4 bg-sage-50/50 border border-sage-200/50 rounded-xl">
                  <p className="font-medium text-ink mb-2">{prompt}</p>
                  <textarea
                    placeholder="Take your time with this..."
                    className="w-full p-3 bg-white border border-sage-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/25 text-sm"
                    rows={2}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep('resources')}
                className="text-sm text-muted hover:text-ink underline decoration-muted/50 hover:decoration-ink/50 transition-all duration-300"
              >
                Back to resources
              </button>
              
              <div className="flex gap-3">
                <Button
                  onClick={onContinueWriting}
                  variant="outline"
                  size="sm"
                >
                  Continue writing
                </Button>
                
                <Button
                  onClick={onClose}
                  size="sm"
                >
                  I'm done for now
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Always-present close option */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/25"
        >
          <svg className="w-4 h-4 text-muted hover:text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Card>
    </div>
  );
}

export default CrisisSupport;