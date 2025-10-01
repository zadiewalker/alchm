'use client';

// CRISIS-CRITICAL: Ultra-lightweight emergency page for crisis situations
// Target: <10KB bundle size for 3G networks
// NO external dependencies beyond React

import { useState, useEffect } from 'react';

// Emergency crisis resources - hardcoded for speed
const EMERGENCY_RESOURCES = [
  {
    id: 'crisis-text',
    name: '988 Crisis Text',
    action: () => window.open('sms:741741', '_self'),
    text: 'Text HOME to 741741',
    icon: '💬',
    priority: 1
  },
  {
    id: 'crisis-call',
    name: '988 Crisis Call',
    action: () => window.open('tel:988', '_self'),
    text: 'Call 988',
    icon: '📞',
    priority: 1
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    action: () => window.open('tel:911', '_self'),
    text: 'Call 911',
    icon: '🚨',
    priority: 0
  }
];

// Crisis severity levels for proper response
type CrisisSeverity = 'immediate' | 'urgent' | 'support';

interface CrisisEmergencyPageProps {
  severity?: CrisisSeverity;
  onContinueToJournal?: () => void;
  backupText?: string;
}

export default function CrisisEmergencyPage({ 
  severity = 'support',
  onContinueToJournal,
  backupText = ''
}: CrisisEmergencyPageProps) {
  const [hasCalledHelp, setHasCalledHelp] = useState(false);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);

  // Auto-focus on most critical resource
  useEffect(() => {
    if (severity === 'immediate') {
      // Auto-open emergency services for immediate danger
      const timer = setTimeout(() => {
        if (!hasCalledHelp) {
          window.open('tel:911', '_self');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [severity, hasCalledHelp]);

  const handleEmergencyAction = (resource: typeof EMERGENCY_RESOURCES[0]) => {
    setHasCalledHelp(true);
    resource.action();
  };

  const getCrisisMessage = () => {
    switch (severity) {
      case 'immediate':
        return {
          title: '🚨 You are not alone - Help is here',
          message: 'Your life matters. Emergency support is connecting now.',
          urgency: 'Call emergency services immediately if you are in immediate danger.'
        };
      case 'urgent':
        return {
          title: '💙 We hear you - Support is available',
          message: 'Crisis support specialists are ready to help right now.',
          urgency: 'You deserve support. Reach out - it shows strength.'
        };
      default:
        return {
          title: '🤗 You matter - Support is here',
          message: 'Trained counselors are available 24/7 to listen and help.',
          urgency: 'Take care of yourself. You are worth it.'
        };
    }
  };

  const crisisMessage = getCrisisMessage();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 flex flex-col items-center justify-center"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Crisis Header */}
      <div className="max-w-md w-full text-center mb-8">
        <div className="text-6xl mb-4 animate-pulse">{severity === 'immediate' ? '🚨' : '💙'}</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {crisisMessage.title}
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          {crisisMessage.message}
        </p>
        {severity === 'immediate' && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 font-semibold">
              {crisisMessage.urgency}
            </p>
          </div>
        )}
      </div>

      {/* Emergency Actions */}
      <div className="max-w-md w-full space-y-4 mb-8">
        {EMERGENCY_RESOURCES
          .filter(resource => severity === 'immediate' || resource.priority > 0)
          .map((resource) => (
            <button
              key={resource.id}
              onClick={() => handleEmergencyAction(resource)}
              className={`
                w-full p-6 rounded-lg font-bold text-lg transition-all duration-200
                ${resource.id === 'emergency' 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-blue-300
                min-h-16 flex items-center justify-center gap-3
              `}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-2xl">{resource.icon}</span>
              <span>{resource.text}</span>
            </button>
          ))
        }
      </div>

      {/* Safety Planning */}
      {severity !== 'immediate' && (
        <div className="max-w-md w-full mb-8">
          <button
            onClick={() => setShowSafetyPlan(!showSafetyPlan)}
            className="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
          >
            <span className="font-semibold">
              {showSafetyPlan ? '🔼' : '🔽'} Quick Safety Tips
            </span>
          </button>
          
          {showSafetyPlan && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Remove means of harm from your environment</li>
                <li>• Stay with trusted friends or family</li>
                <li>• Use grounding techniques: 5 things you see, 4 you hear, 3 you touch</li>
                <li>• Remember: This feeling is temporary</li>
                <li>• You have survived difficult times before</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Continue to Journal Option */}
      {severity !== 'immediate' && onContinueToJournal && (
        <div className="max-w-md w-full">
          <button
            onClick={onContinueToJournal}
            className="w-full p-4 border-2 border-gray-300 hover:border-gray-400 rounded-lg text-gray-700 hover:text-gray-800 transition-colors"
          >
            <span className="font-medium">Continue Writing in Journal</span>
            <br />
            <span className="text-sm opacity-75">Sometimes expressing feelings helps</span>
          </button>
        </div>
      )}

      {/* Footer Message */}
      <div className="max-w-md w-full mt-8 text-center">
        <p className="text-sm text-gray-600">
          You are valued. You matter. Help is always available.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Crisis support is free, confidential, and available 24/7
        </p>
      </div>
    </div>
  );
}