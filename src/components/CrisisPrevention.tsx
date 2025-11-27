'use client';

import React, { useState, useEffect } from 'react';
import { CrisisAssessmentOutputType } from '@/ai/flows/crisis-prevention';

interface CrisisPreventionProps {
  assessment?: CrisisAssessmentOutputType;
  onResourceClick?: (resource: any) => void;
  className?: string;
}

interface SupportResource {
  type: 'hotline' | 'therapist' | 'community' | 'app' | 'technique' | 'emergency';
  name: string;
  contact?: string;
  description: string;
  available24h?: boolean;
}

const CrisisPrevention: React.FC<CrisisPreventionProps> = ({ 
  assessment, 
  onResourceClick,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'resources' | 'coping' | 'actions'>('resources');

  useEffect(() => {
    if (assessment && assessment.riskLevel !== 'low') {
      setIsVisible(true);
    }
  }, [assessment]);

  if (!assessment || !isVisible) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'crisis': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-400 text-white';
      case 'moderate': return 'bg-yellow-400 text-gray-900';
      case 'low': return 'bg-green-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'crisis': return '🚨';
      case 'high': return '⚠️';
      case 'moderate': return '💛';
      case 'low': return '💚';
      default: return '🔵';
    }
  };

  const handleResourceClick = (resource: SupportResource) => {
    onResourceClick?.(resource);
    
    // Handle different resource types
    if (resource.contact) {
      if (resource.contact.includes('://')) {
        window.open(resource.contact, '_blank');
      } else if (resource.contact.includes('@')) {
        window.open(`mailto:${resource.contact}`);
      } else if (resource.contact.match(/^\d/)) {
        window.open(`tel:${resource.contact.replace(/\D/g, '')}`);
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border-l-4 ${
      assessment.riskLevel === 'crisis' ? 'border-red-500' : 
      assessment.riskLevel === 'high' ? 'border-red-400' : 
      assessment.riskLevel === 'moderate' ? 'border-yellow-400' : 'border-green-400'
    } ${className}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getRiskIcon(assessment.riskLevel)}</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Support & Resources
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(assessment.riskLevel)}`}>
                  {assessment.riskLevel.toUpperCase()} PRIORITY
                </span>
                <span className="text-sm text-gray-500">
                  Confidence: {Math.round(assessment.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning Patterns */}
        {assessment.warningPatterns.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Detected Patterns:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {assessment.warningPatterns.map((pattern, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  {pattern}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Emergency Alert for Crisis Level */}
      {assessment.riskLevel === 'crisis' && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl">🚨</span>
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-2">
                Immediate Support Available
              </h4>
              <p className="text-red-700 text-sm mb-3">
                If you are in immediate danger or thinking about harming yourself, please reach out for help right now.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.open('tel:988')}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700"
                >
                  Call 988 - Crisis Lifeline
                </button>
                <button
                  onClick={() => window.open('sms:741741&body=HOME')}
                  className="w-full bg-red-100 text-red-700 px-4 py-2 rounded font-medium hover:bg-red-200"
                >
                  Text HOME to 741741
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { key: 'resources', label: 'Support Resources', icon: '📞' },
            { key: 'coping', label: 'Coping Strategies', icon: '🧘' },
            { key: 'actions', label: 'Next Steps', icon: '✅' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {selectedTab === 'resources' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Support Resources</h4>
            <div className="grid gap-3">
              {assessment.supportResources.map((resource, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => handleResourceClick(resource)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">{resource.name}</h5>
                        {resource.available24h && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            24/7
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      {resource.contact && (
                        <p className="text-sm font-medium text-blue-600">{resource.contact}</p>
                      )}
                    </div>
                    <div className="text-2xl">
                      {resource.type === 'hotline' && '📞'}
                      {resource.type === 'therapist' && '👩‍⚕️'}
                      {resource.type === 'community' && '👥'}
                      {resource.type === 'app' && '📱'}
                      {resource.type === 'technique' && '🧘'}
                      {resource.type === 'emergency' && '🚨'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'coping' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Coping Strategies</h4>
            <div className="space-y-3">
              {assessment.copingStrategies.map((strategy, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{strategy}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-medium text-green-800 mb-2">Remember:</h5>
              <p className="text-sm text-green-700">
                These feelings are temporary. You have gotten through difficult times before, and you can get through this too. 
                You don't have to face this alone.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'actions' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Recommended Next Steps</h4>
            <div className="space-y-3">
              {assessment.recommendedActions.map((action, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-l-4 ${
                    action.priority === 1 ? 'border-red-400 bg-red-50' :
                    action.priority === 2 ? 'border-yellow-400 bg-yellow-50' :
                    'border-blue-400 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">{action.action}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          action.priority === 1 ? 'bg-red-100 text-red-700' :
                          action.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          Priority {action.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <div className="text-xl">
                      {action.type === 'emergency' && '🚨'}
                      {action.type === 'professional' && '👩‍⚕️'}
                      {action.type === 'self_care' && '🧘'}
                      {action.type === 'community' && '👥'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {assessment.followUpScheduled && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-600">📅</span>
                  <h5 className="font-medium text-purple-800">Follow-up Scheduled</h5>
                </div>
                <p className="text-sm text-purple-700">
                  We'll check in with you later to see how you're doing. You're not alone in this journey.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          This assessment is for support purposes only and does not replace professional medical advice. 
          If you are in immediate danger, please call 911 or go to your nearest emergency room.
        </p>
      </div>
    </div>
  );
};

export default CrisisPrevention;