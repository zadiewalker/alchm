'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  text?: string;
  description: string;
  availability: string;
  category: 'general' | 'lgbtq' | 'youth' | 'domestic' | 'veteran' | 'international';
  languages?: string[];
}

const crisisResources: CrisisResource[] = [
  {
    id: 'suicide-lifeline',
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    text: 'Text HOME to 741741',
    description: '24/7 free and confidential support',
    availability: '24/7',
    category: 'general',
    languages: ['English', 'Spanish']
  },
  {
    id: 'crisis-text-line',
    name: 'Crisis Text Line',
    phone: '741741',
    description: 'Text HOME for crisis support',
    availability: '24/7',
    category: 'general'
  },
  {
    id: 'trevor-project',
    name: 'The Trevor Project',
    phone: '1-866-488-7386',
    text: 'Text START to 678-678',
    description: 'Crisis support for LGBTQ+ youth',
    availability: '24/7',
    category: 'lgbtq'
  },
  {
    id: 'trans-lifeline',
    name: 'Trans Lifeline',
    phone: '877-565-8860',
    description: 'Support for transgender people',
    availability: '24/7',
    category: 'lgbtq'
  },
  {
    id: 'domestic-violence',
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    text: 'Text START to 88788',
    description: 'Support for domestic violence survivors',
    availability: '24/7',
    category: 'domestic'
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    phone: '911',
    description: 'Immediate emergency assistance',
    availability: '24/7',
    category: 'general'
  }
];

interface ElegantCrisisFooterProps {
  className?: string;
  theme?: 'minimal' | 'expanded' | 'emergency';
  position?: 'bottom' | 'floating';
  autoDetect?: boolean;
}

export default function ElegantCrisisFooter({ 
  className = '', 
  theme = 'minimal',
  position = 'floating',
  autoDetect = true
}: ElegantCrisisFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now());

  // Crisis keyword detection
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself',
    'can\'t go on', 'hopeless', 'worthless', 'emergency', 'help me',
    'crisis', 'desperate', 'scared', 'alone', 'trapped'
  ];

  // Auto-detect crisis context from page content or user input
  useEffect(() => {
    if (!autoDetect) return;

    const detectCrisisContext = () => {
      // Check for crisis keywords in recent text input
      const textInputs = document.querySelectorAll('input[type="text"], textarea');
      let hasCrisisContent = false;

      textInputs.forEach(input => {
        const value = (input as HTMLInputElement | HTMLTextAreaElement).value.toLowerCase();
        if (crisisKeywords.some(keyword => value.includes(keyword))) {
          hasCrisisContent = true;
        }
      });

      if (hasCrisisContent && !isEmergencyMode) {
        setIsEmergencyMode(true);
        setIsExpanded(true);
        
        // Gentle haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    };

    // Monitor for crisis context every 2 seconds
    const interval = setInterval(detectCrisisContext, 2000);
    return () => clearInterval(interval);
  }, [autoDetect, isEmergencyMode]);

  // Handle crisis resource contact
  const handleResourceContact = useCallback((resource: CrisisResource, type: 'call' | 'text') => {
    setLastInteraction(Date.now());
    
    // Track emergency access for analytics (without personal data)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'crisis_resource_accessed', {
        event_category: 'Crisis Support',
        event_label: resource.category,
        value: 1,
        // Note: No personal data logged
      });
    }

    if (type === 'call') {
      window.location.href = `tel:${resource.phone}`;
    } else if (resource.text) {
      // For text lines, try to open messaging app
      if (resource.id === 'crisis-text-line') {
        window.location.href = `sms:741741&body=HOME`;
      } else if (resource.id === 'trevor-project') {
        window.location.href = `sms:678678&body=START`;
      }
    }
  }, []);

  // Filter resources by category
  const filteredResources = crisisResources.filter(resource => 
    selectedCategory === 'all' ? true : resource.category === selectedCategory
  );

  // Emergency mode styling
  const emergencyClass = isEmergencyMode ? 'alert' : '';
  
  if (position === 'floating' && !isExpanded) {
    return (
      <button
        className={`crisis-support ${emergencyClass} ${className}`}
        onClick={() => setIsExpanded(true)}
        aria-label="Access crisis support resources"
        style={{
          animation: isEmergencyMode ? 'gentle-pulse 2s infinite' : 'none'
        }}
      >
        <span role="img" aria-label="Crisis support">🆘</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[998]"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      {/* Main Crisis Footer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-lg border-t border-gray-200 z-[999] transform transition-transform duration-300 ease-out max-h-[80vh] overflow-hidden ${
          isExpanded ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="container mx-auto px-4 py-6 max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sage-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🛡️</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {isEmergencyMode ? 'Emergency Support' : 'Crisis Resources'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isEmergencyMode ? 'Immediate help is available' : 'Available 24/7 when you need support'}
                </p>
              </div>
            </div>
            {!isEmergencyMode && (
              <button
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Close crisis resources"
              >
                ×
              </button>
            )}
          </div>

          {/* Emergency Banner */}
          {isEmergencyMode && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-lg">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>You are not alone.</strong> Crisis support is available immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          {!isEmergencyMode && (
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {[
                { id: 'general', label: 'General', icon: '🆘' },
                { id: 'lgbtq', label: 'LGBTQ+', icon: '🏳️‍🌈' },
                { id: 'youth', label: 'Youth', icon: '👶' },
                { id: 'domestic', label: 'DV Support', icon: '🏠' }
              ].map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-sage-400 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Crisis Resources Grid */}
          <div className="grid gap-3 max-h-64 overflow-y-auto">
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {resource.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {resource.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {resource.availability}
                      </span>
                      {resource.languages && (
                        <span className="text-xs text-gray-500">
                          {resource.languages.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {/* Call Button */}
                    <button
                      onClick={() => handleResourceContact(resource, 'call')}
                      className="bg-red-600 text-white text-xs px-3 py-2 min-h-10 rounded-lg hover:bg-red-700 transition-colors"
                      aria-label={`Call ${resource.name}`}
                    >
                      📞 Call
                    </button>
                    
                    {/* Text Button */}
                    {resource.text && (
                      <button
                        onClick={() => handleResourceContact(resource, 'text')}
                        className="bg-white text-sage-600 border-2 border-sage-300 text-xs px-3 py-2 min-h-10 rounded-lg hover:bg-sage-50 transition-colors"
                        aria-label={`Text ${resource.name}`}
                      >
                        💬 Text
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {isEmergencyMode 
                ? 'These resources are completely confidential and available right now.'
                : 'All resources are free, confidential, and available 24/7. You are not alone.'
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
}