'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface CrisisResource {
  id: string;
  name: string;
  contact: string;
  description: string;
  type: 'phone' | 'text' | 'web' | 'chat';
  available: string;
  languages?: string[];
  specialization?: string;
}

interface CrisisInterventionProps {
  variant?: 'full' | 'compact' | 'floating' | 'emergency';
  autoTrigger?: boolean;
  crisisKeywords?: string[];
}

export function CrisisIntervention({ 
  variant = 'full', 
  autoTrigger = false,
  crisisKeywords = []
}: CrisisInterventionProps) {
  const [isVisible, setIsVisible] = useState(variant === 'floating' || variant === 'emergency');
  const [hasTriggered, setHasTriggered] = useState(false);

  const crisisResources: CrisisResource[] = [
    {
      id: 'emergency',
      name: 'Emergency Services',
      contact: '911',
      description: 'For immediate life-threatening emergencies',
      type: 'phone',
      available: '24/7',
      specialization: 'Emergency response'
    },
    {
      id: 'suicide-prevention',
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      description: 'Free, confidential support for people in emotional distress or suicidal crisis',
      type: 'phone',
      available: '24/7',
      languages: ['English', 'Spanish'],
      specialization: 'Suicide prevention'
    },
    {
      id: 'crisis-text',
      name: 'Crisis Text Line',
      contact: '741741',
      description: 'Text HOME for free, 24/7 crisis support via text message',
      type: 'text',
      available: '24/7',
      specialization: 'Text-based crisis support'
    },
    {
      id: 'lgbtq-hotline',
      name: 'LGBTQ National Hotline',
      contact: '1-888-843-4564',
      description: 'Support for LGBTQ+ individuals in crisis',
      type: 'phone',
      available: '24/7',
      specialization: 'LGBTQ+ support'
    },
    {
      id: 'domestic-violence',
      name: 'National Domestic Violence Hotline',
      contact: '1-800-799-7233',
      description: 'Support for domestic violence situations',
      type: 'phone',
      available: '24/7',
      languages: ['English', 'Spanish'],
      specialization: 'Domestic violence'
    },
    {
      id: 'substance-abuse',
      name: 'SAMHSA Helpline',
      contact: '1-800-662-4357',
      description: 'Treatment referral and information service for substance abuse',
      type: 'phone',
      available: '24/7',
      specialization: 'Substance abuse'
    },
    {
      id: 'eating-disorders',
      name: 'National Eating Disorders Association',
      contact: '1-800-931-2237',
      description: 'Support for eating disorder concerns',
      type: 'phone',
      available: 'Mon-Thu 11am-9pm ET, Fri 11am-5pm ET',
      specialization: 'Eating disorders'
    },
    {
      id: 'veterans',
      name: 'Veterans Crisis Line',
      contact: '1-800-273-8255',
      description: 'Crisis support specifically for veterans',
      type: 'phone',
      available: '24/7',
      specialization: 'Veterans support'
    }
  ];

  useEffect(() => {
    if (autoTrigger && crisisKeywords.length > 0 && !hasTriggered) {
      // This would typically be triggered by crisis detection in journal content
      setIsVisible(true);
      setHasTriggered(true);
      
      // Log crisis intervention trigger for safety analytics
      console.log('Crisis intervention triggered for user safety');
    }
  }, [autoTrigger, crisisKeywords, hasTriggered]);

  const handleResourceContact = (resource: CrisisResource) => {
    // Track crisis resource usage for analytics (without personal data)
    const analyticsData = {
      resourceId: resource.id,
      timestamp: new Date().toISOString(),
      contactMethod: resource.type
    };
    
    // Send analytics to help improve crisis resources
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'crisis_resource_accessed', {
        resource_type: resource.specialization,
        contact_method: resource.type
      });
    }

    // Open appropriate contact method
    let contactUrl = '';
    switch (resource.type) {
      case 'phone':
        contactUrl = `tel:${resource.contact}`;
        break;
      case 'text':
        contactUrl = `sms:${resource.contact}`;
        break;
      case 'web':
      case 'chat':
        contactUrl = resource.contact;
        break;
    }
    
    if (contactUrl) {
      window.open(contactUrl, resource.type === 'web' || resource.type === 'chat' ? '_blank' : '_self');
    }
  };

  if (variant === 'floating') {
    return (
      <div 
        className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <Card className="w-80 shadow-lg border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-red-800">Need immediate help?</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-red-600 hover:text-red-800"
                aria-label="Close crisis resources"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handleResourceContact(crisisResources[0])}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                aria-label="Call 911 for emergency"
              >
                🚨 Emergency: 911
              </Button>
              <Button
                onClick={() => handleResourceContact(crisisResources[1])}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Call 988 Suicide and Crisis Lifeline"
              >
                📞 Crisis Line: 988
              </Button>
              <Button
                onClick={() => handleResourceContact(crisisResources[2])}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                aria-label="Text HOME to 741741 for crisis support"
              >
                💬 Text: 741741
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'emergency') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white shadow-2xl">
          <CardHeader className="bg-red-600 text-white text-center">
            <h2 className="text-xl font-medium">Crisis Support Available</h2>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center mb-6 text-gray-700">
              If you're having thoughts of self-harm or are in crisis, help is available right now.
            </p>
            <div className="space-y-3">
              {crisisResources.slice(0, 3).map((resource) => (
                <Button
                  key={resource.id}
                  onClick={() => handleResourceContact(resource)}
                  className="w-full text-left justify-start h-auto p-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900"
                  aria-label={`Contact ${resource.name}`}
                >
                  <div>
                    <div className="font-medium">{resource.name}</div>
                    <div className="text-sm text-gray-600">{resource.contact}</div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                className="px-6"
              >
                I'm Safe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-red-800 mb-3">Crisis Support</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {crisisResources.slice(0, 3).map((resource) => (
              <Button
                key={resource.id}
                onClick={() => handleResourceContact(resource)}
                variant="outline"
                size="sm"
                className="text-xs"
                aria-label={`Contact ${resource.name} at ${resource.contact}`}
              >
                {resource.type === 'phone' ? '📞' : resource.type === 'text' ? '💬' : '🌐'} {resource.contact}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-medium text-center text-gray-900">
          Crisis Support Resources
        </h2>
        <p className="text-center text-gray-600">
          If you're experiencing a mental health crisis, help is available 24/7
        </p>
      </CardHeader>
      <CardContent>
        {/* Immediate Emergency */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded">
          <h3 className="text-lg font-medium text-red-800 mb-4">
            🚨 Immediate Emergency
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crisisResources.slice(0, 3).map((resource) => (
              <div key={resource.id} className="bg-white p-4 rounded shadow">
                <h4 className="font-medium text-gray-900 mb-2">{resource.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <Button
                  onClick={() => handleResourceContact(resource)}
                  className={`w-full ${
                    resource.id === 'emergency' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  aria-label={`Contact ${resource.name} at ${resource.contact}`}
                >
                  {resource.type === 'phone' ? '📞' : '💬'} {resource.contact}
                </Button>
                <p className="text-xs text-gray-500 mt-2">Available: {resource.available}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Resources */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Specialized Support Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crisisResources.slice(3).map((resource) => (
              <div key={resource.id} className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium text-gray-900 mb-2">{resource.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                {resource.specialization && (
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-2">
                    {resource.specialization}
                  </span>
                )}
                <Button
                  onClick={() => handleResourceContact(resource)}
                  variant="outline"
                  size="sm"
                  className="w-full mb-2"
                  aria-label={`Contact ${resource.name} at ${resource.contact}`}
                >
                  {resource.type === 'phone' ? '📞' : '💬'} {resource.contact}
                </Button>
                <p className="text-xs text-gray-500">Available: {resource.available}</p>
                {resource.languages && (
                  <p className="text-xs text-gray-500">
                    Languages: {resource.languages.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Important Reminders</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• These resources are free and confidential</li>
            <li>• You don't need to be in immediate danger to call</li>
            <li>• Crisis counselors are trained to help with all types of emotional distress</li>
            <li>• Text options are available if you prefer not to talk on the phone</li>
            <li>• Your safety and privacy are protected</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}