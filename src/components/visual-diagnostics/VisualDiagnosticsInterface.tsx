/**
 * Visual Diagnostics Interface Component
 * 
 * Trauma-informed interface for users to submit screenshots and receive
 * visual guidance for technical issues in their ALCHM sanctuary.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MedicalDisclaimer } from '@/components/ui/MedicalDisclaimer';
import { CrisisSupport } from '@/components/ui/CrisisSupport';

interface VisualDiagnosticsInterfaceProps {
  userEmotionalState?: string;
  crisisLevel?: 'none' | 'low' | 'moderate' | 'high';
  sessionId?: string;
  onAnalysisComplete?: (result: any) => void;
}

interface DeviceContext {
  platform: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  browserVersion: string;
  screenResolution: string;
  viewport: { width: number; height: number };
  isMobile: boolean;
  operatingSystem: string;
  touchCapable: boolean;
}

export default function VisualDiagnosticsInterface({
  userEmotionalState = 'neutral',
  crisisLevel = 'none',
  sessionId,
  onAnalysisComplete
}: VisualDiagnosticsInterfaceProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [userConsent, setUserConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get device context
  const getDeviceContext = useCallback((): DeviceContext => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad/i.test(navigator.userAgent) || 
      (navigator.maxTouchPoints > 1 && window.innerWidth > 768);
    
    let platform: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (isTablet) platform = 'tablet';
    else if (isMobile) platform = 'mobile';

    return {
      platform,
      browser: getBrowserName(),
      browserVersion: getBrowserVersion(),
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      isMobile,
      operatingSystem: getOperatingSystem(),
      touchCapable: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
  }, []);

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Please use an image smaller than 5MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Show privacy notice for first-time users
    if (!userConsent) {
      setShowPrivacyNotice(true);
    }
  }, [userConsent]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const fakeEvent = {
        target: { files: [imageFile] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageSelect(fakeEvent);
    }
  }, [handleImageSelect]);

  const analyzeScreenshot = async () => {
    if (!selectedImage || !userConsent) return;

    setIsAnalyzing(true);
    
    try {
      // Convert image to base64
      const base64Image = await fileToBase64(selectedImage);
      const imageType = selectedImage.type.split('/')[1] as 'png' | 'jpg' | 'jpeg' | 'webp';
      
      // Prepare request
      const request = {
        imageData: base64Image,
        imageType,
        userDescription: userDescription.trim(),
        deviceContext: getDeviceContext(),
        userEmotionalState,
        crisisLevel,
        sessionId
      };

      // Call Firebase Function
      const { data } = await fetch('/api/visual-diagnostics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      }).then(res => res.json());

      setAnalysisResult(data);
      onAnalysisComplete?.(data);
      
    } catch (error) {
      console.error('Screenshot analysis error:', error);
      // Provide fallback guidance
      setAnalysisResult({
        fallback: true,
        guidance: {
          emotionalPreparation: "I'm experiencing some technical challenges while analyzing your screenshot, but I'm still here to support you.",
          introduction: "Thank you for sharing your screenshot. While my visual analysis is temporarily limited, I can still offer guidance.",
          encouragement: ["Your willingness to seek technical support shows real self-advocacy"],
          safetyReminders: ["Your data and privacy remain protected"]
        },
        fallbackOptions: [
          'Try basic troubleshooting steps like refreshing the page',
          'Contact human support for personalized guidance',
          'Check if the issue persists across different devices'
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetInterface = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUserDescription('');
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show crisis support if high crisis level
  if (crisisLevel === 'high') {
    return <CrisisSupport />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Emotional Preparation */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h2 className="text-xl font-medium text-purple-800 mb-3">
          ✨ Visual Technical Support
        </h2>
        <p className="text-purple-700 leading-relaxed">
          {getEmotionalPreparation(userEmotionalState)}
        </p>
      </Card>

      {/* Privacy Notice Modal */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Screenshot Privacy Protection
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Your screenshot will be processed with privacy protection:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Personal information will be automatically redacted</li>
                <li>Images are processed temporarily and not permanently stored</li>
                <li>Only technical interface elements are analyzed</li>
                <li>You can describe your issue without sharing personal details</li>
              </ul>
              <p className="font-medium text-purple-700">
                Your privacy and safety remain our highest priority.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setUserConsent(true);
                  setShowPrivacyNotice(false);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                I Understand
              </Button>
              <Button
                onClick={() => {
                  setShowPrivacyNotice(false);
                  resetInterface();
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {!analysisResult ? (
        <>
          {/* Screenshot Upload Area */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              <h3 className="text-lg font-medium text-gray-800">
                Share a Screenshot of Your Technical Issue
              </h3>
              
              <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors
                  ${selectedImage ? 'border-purple-400 bg-purple-50' : 'hover:border-purple-400 hover:bg-purple-50'}
                `}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Screenshot preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-purple-600">
                      Screenshot ready for analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        Drag and drop a screenshot here, or click to select
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, or WebP up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              
              {selectedImage && (
                <Button
                  onClick={resetInterface}
                  variant="outline"
                  className="text-gray-600"
                >
                  Choose Different Image
                </Button>
              )}
            </div>
          </Card>

          {/* Description Input */}
          {selectedImage && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Describe What You're Experiencing (Optional)
              </h3>
              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="For example: 'The sign-in button isn't responding when I tap it' or 'The page appears broken on my phone'..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-2">
                Your description helps provide more targeted guidance ({userDescription.length}/500)
              </p>
            </Card>
          )}

          {/* Analysis Button */}
          {selectedImage && userConsent && (
            <div className="text-center">
              <Button
                onClick={analyzeScreenshot}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing with Care...
                  </div>
                ) : (
                  'Analyze Screenshot'
                )}
              </Button>
              
              {isAnalyzing && (
                <p className="text-sm text-purple-600 mt-2">
                  Taking a gentle, thorough look at your technical challenge...
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        /* Analysis Results */
        <VisualDiagnosticsResults
          result={analysisResult}
          userEmotionalState={userEmotionalState}
          onStartOver={resetInterface}
        />
      )}
      
      {/* Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}

// Results Component
interface VisualDiagnosticsResultsProps {
  result: any;
  userEmotionalState: string;
  onStartOver: () => void;
}

function VisualDiagnosticsResults({ 
  result, 
  userEmotionalState, 
  onStartOver 
}: VisualDiagnosticsResultsProps) {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [showVisualGuide, setShowVisualGuide] = useState(false);

  return (
    <div className="space-y-6">
      {/* Emotional Support Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <h2 className="text-xl font-medium text-green-800 mb-3">
          ✨ Visual Analysis Complete
        </h2>
        <p className="text-green-700 mb-4">
          {result.guidance?.introduction || "I've analyzed your screenshot with care and attention to your current emotional state."}
        </p>
        {result.guidance?.encouragement?.map((phrase: string, index: number) => (
          <p key={index} className="text-green-600 text-sm mb-2">
            • {phrase}
          </p>
        ))}
      </Card>

      {/* Crisis Resources if Applicable */}
      {result.crisisResources && (
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-medium text-red-800 mb-4">
            🚨 Immediate Support Available
          </h3>
          <div className="space-y-3">
            {result.crisisResources.map((resource: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="font-medium text-red-700">{resource.name}:</span>
                <span className="text-red-600">{resource.contact}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detected Issues */}
      {result.detectedIssues && result.detectedIssues.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Technical Issues Identified
          </h3>
          <div className="space-y-4">
            {result.detectedIssues.map((issue: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{issue.description}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium
                    ${issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}
                  `}>
                    {issue.severity}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {issue.traumaInformedExplanation}
                </p>
                
                {issue.suggestedFix?.approach && (
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-700 mb-2">Gentle Steps to Try:</h5>
                    <div className="space-y-2">
                      {issue.suggestedFix.approach.slice(0, 2).map((step: any, stepIndex: number) => (
                        <div key={stepIndex} className="text-sm">
                          <span className="font-medium text-purple-600">
                            Step {step.stepNumber}:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {step.therapeuticFraming || step.action}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowVisualGuide(true);
                      }}
                      variant="outline"
                      className="mt-3 text-purple-600 border-purple-600 hover:bg-purple-50"
                    >
                      Get Visual Step-by-Step Guide
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Interface Analysis */}
      {result.interfaceAnalysis && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            ALCHM Interface Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Detected Page</p>
              <p className="text-sm text-gray-600 capitalize">
                {result.interfaceAnalysis.detectedPage.replace('-', ' ')}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Components Analyzed</p>
              <p className="text-sm text-gray-600">
                {result.interfaceAnalysis.componentsAnalyzed}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Functional Elements</p>
              <p className="text-sm text-gray-600">
                {result.interfaceAnalysis.functionalComponents}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Safety Reminders */}
      {result.guidance?.safetyReminders && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            Safety Reminders
          </h3>
          <div className="space-y-2">
            {result.guidance.safetyReminders.map((reminder: string, index: number) => (
              <p key={index} className="text-blue-700 text-sm">
                • {reminder}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Fallback Options */}
      {result.fallbackOptions && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Alternative Support Options
          </h3>
          <div className="space-y-2">
            {result.fallbackOptions.map((option: string, index: number) => (
              <p key={index} className="text-gray-600 text-sm">
                • {option}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onStartOver}
          variant="outline"
          className="px-6 py-2"
        >
          Analyze Another Screenshot
        </Button>
        <Button
          onClick={() => window.open('/contact', '_blank')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
        >
          Connect with Human Support
        </Button>
      </div>

      {/* Visual Guide Modal */}
      {showVisualGuide && selectedIssue && (
        <VisualGuideModal
          issue={selectedIssue}
          userEmotionalState={userEmotionalState}
          onClose={() => {
            setShowVisualGuide(false);
            setSelectedIssue(null);
          }}
        />
      )}
    </div>
  );
}

// Visual Guide Modal Component
interface VisualGuideModalProps {
  issue: any;
  userEmotionalState: string;
  onClose: () => void;
}

function VisualGuideModal({ issue, userEmotionalState, onClose }: VisualGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [guideData, setGuideData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Load visual guide data
    const loadVisualGuide = async () => {
      try {
        // In a real implementation, this would call the createVisualGuide function
        const mockGuide = {
          visualSteps: issue.suggestedFix.approach.map((step: any, index: number) => ({
            stepNumber: index + 1,
            title: `Step ${index + 1}`,
            description: step.action || step.therapeuticFraming,
            traumaInformedFraming: step.therapeuticFraming || step.action,
            expectedOutcome: `After this step, you should see improvement in the issue`,
            troubleshootingTips: step.safetyCheck ? [step.safetyCheck] : [],
            emotionalSupport: getStepEmotionalSupport(index + 1, userEmotionalState),
            canSkip: true,
            estimatedTime: '1-2 minutes'
          })),
          emotionalSupport: {
            preparation: getEmotionalPreparation(userEmotionalState),
            encouragement: getEncouragementMessage(userEmotionalState),
            safetyReminder: 'Remember, you can pause at any time and return to this guide when you feel ready'
          }
        };
        
        setGuideData(mockGuide);
      } catch (error) {
        console.error('Failed to load visual guide:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVisualGuide();
  }, [issue, userEmotionalState]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full p-6 bg-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Preparing your visual guide...</p>
        </Card>
      </div>
    );
  }

  const currentStepData = guideData?.visualSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Visual Step-by-Step Guide
            </h2>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          </div>

          {guideData?.emotionalSupport && currentStep === 0 && (
            <Card className="p-4 mb-6 bg-purple-50 border-purple-200">
              <p className="text-purple-700 mb-2">
                {guideData.emotionalSupport.preparation}
              </p>
              <p className="text-purple-600 text-sm">
                {guideData.emotionalSupport.encouragement}
              </p>
            </Card>
          )}

          {currentStepData && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                  {currentStepData.stepNumber}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{currentStepData.title}</h3>
                  <p className="text-sm text-gray-500">
                    Estimated time: {currentStepData.estimatedTime}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">What to do:</h4>
                <p className="text-gray-700">{currentStepData.description}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Gentle guidance:</h4>
                <p className="text-blue-700">{currentStepData.traumaInformedFraming}</p>
              </div>

              {currentStepData.troubleshootingTips.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">If you need help:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {currentStepData.troubleshootingTips.map((tip: string, index: number) => (
                      <li key={index} className="text-yellow-700 text-sm">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Expected outcome:</h4>
                <p className="text-green-700">{currentStepData.expectedOutcome}</p>
              </div>

              {currentStepData.emotionalSupport && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-700 text-sm">
                    💜 {currentStepData.emotionalSupport}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {guideData?.visualSteps.length || 1}
            </span>
            
            {currentStep < (guideData?.visualSteps.length || 1) - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete
              </Button>
            )}
          </div>

          {currentStepData?.canSkip && (
            <div className="text-center mt-4">
              <Button
                onClick={() => setCurrentStep(Math.min(guideData?.visualSteps.length - 1, currentStep + 1))}
                variant="outline"
                size="sm"
                className="text-gray-500"
              >
                Skip this step if it feels overwhelming
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper functions
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

function getBrowserName(): string {
  const agent = navigator.userAgent;
  if (agent.indexOf('Chrome') > -1) return 'Chrome';
  if (agent.indexOf('Firefox') > -1) return 'Firefox';
  if (agent.indexOf('Safari') > -1) return 'Safari';
  if (agent.indexOf('Edge') > -1) return 'Edge';
  return 'Unknown';
}

function getBrowserVersion(): string {
  const agent = navigator.userAgent;
  const match = agent.match(/(Chrome|Firefox|Safari|Edge)\/(\d+)/);
  return match ? match[2] : 'Unknown';
}

function getOperatingSystem(): string {
  const platform = navigator.platform;
  if (platform.indexOf('Win') > -1) return 'Windows';
  if (platform.indexOf('Mac') > -1) return 'macOS';
  if (platform.indexOf('Linux') > -1) return 'Linux';
  if (platform.indexOf('iPhone') > -1) return 'iOS';
  if (platform.indexOf('Android') > -1) return 'Android';
  return 'Unknown';
}

function getEmotionalPreparation(emotionalState: string): string {
  const preparations = {
    frustrated: "I understand you're feeling frustrated with this technical issue. Let's approach this one gentle step at a time, honoring your emotional state while working toward a solution.",
    anxious: "Take a deep breath. These visual steps are designed to feel manageable and safe. You can pause at any time if you need to ground yourself.",
    overwhelmed: "Your emotional wellbeing comes first. These visual guides are here when you feel ready, and there's no pressure to complete them all at once.",
    neutral: "You're approaching this technical challenge with good awareness. Let's work through this systematically with visual support."
  };
  
  return preparations[emotionalState as keyof typeof preparations] || preparations.neutral;
}

function getEncouragementMessage(emotionalState: string): string {
  const encouragements = {
    frustrated: "Your persistence in seeking solutions shows real self-advocacy and strength.",
    anxious: "You're taking brave steps to maintain your digital sanctuary, even when it feels uncertain.",
    overwhelmed: "Every small step you take is building your digital resilience and confidence.",
    neutral: "You're building valuable skills in maintaining and troubleshooting your digital healing space."
  };
  
  return encouragements[emotionalState as keyof typeof encouragements] || encouragements.neutral;
}

function getStepEmotionalSupport(stepNumber: number, emotionalState: string): string {
  const supportMessages = {
    frustrated: [
      "This step might feel tedious, but you're building real technical resilience",
      "Each action you take is an act of self-care for your digital sanctuary",
      "Your persistence through frustration shows remarkable self-advocacy"
    ],
    anxious: [
      "Take your time with this step - there's no rush",
      "Remember, you can always pause and return to this when you feel ready",
      "This gentle exploration is building your confidence with technology"
    ],
    overwhelmed: [
      "This step can wait if you need to ground yourself first",
      "You're not required to complete this all at once",
      "Your emotional safety is more important than any technical fix"
    ],
    neutral: [
      "You're making steady progress through this technical challenge",
      "Each step builds your understanding and capability",
      "Your systematic approach is serving your sanctuary well"
    ]
  };

  const messages = supportMessages[emotionalState as keyof typeof supportMessages] || supportMessages.neutral;
  return messages[Math.min(stepNumber - 1, messages.length - 1)];
}