'use client';

import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Globe, Heart, Users, Shield } from 'lucide-react';

interface CrisisResource {
  id: string;
  name: string;
  contact: string;
  contactType: 'phone' | 'text' | 'chat' | 'website' | 'email';
  description: string;
  priority: number;
  availability: string;
}

interface CrisisDetectionResult {
  interventionLevel: 'none' | 'gentle' | 'supportive' | 'immediate';
  crisisScore: number;
  detectedPatterns: any[];
  recommendedResources: CrisisResource[];
  confidence: number;
  timestamp: Date;
  processingTime: number;
}

interface CrisisInterventionOverlayProps {
  isVisible: boolean;
  detectionResult: CrisisDetectionResult;
  onClose: () => void;
  onResourceAccess: (resource: CrisisResource) => void;
  userId?: string;
}

const INTERVENTION_MESSAGES = {
  immediate: {
    title: "You're not alone right now",
    message: "It sounds like you're going through something really difficult. There are people who want to help you through this moment.",
    cta: "Get immediate support",
    urgency: "high"
  },
  supportive: {
    title: "We're here with you",
    message: "Thank you for sharing what you're experiencing. It takes courage to express difficult feelings.",
    cta: "Find support resources",
    urgency: "medium"
  },
  gentle: {
    title: "Taking care of yourself",
    message: "It sounds like you're working through some challenges. Remember that reaching out is a sign of strength.",
    cta: "Explore wellness resources",
    urgency: "low"
  }
};

const CONTACT_ICONS = {
  phone: Phone,
  text: MessageCircle,
  chat: MessageCircle,
  website: Globe,
  email: MessageCircle
};

export function CrisisInterventionOverlay({
  isVisible,
  detectionResult,
  onClose,
  onResourceAccess,
  userId
}: CrisisInterventionOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedResource, setSelectedResource] = useState<CrisisResource | null>(null);

  useEffect(() => {
    if (isVisible && detectionResult.interventionLevel !== 'none') {
      // Log intervention display
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'crisis_intervention_displayed', {
          user_id: userId || 'anonymous',
          intervention_level: detectionResult.interventionLevel,
          confidence: detectionResult.confidence,
          resource_count: detectionResult.recommendedResources.length
        });
      }
    }
  }, [isVisible, detectionResult, userId]);

  const handleClose = () => {
    setIsClosing(true);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'crisis_intervention_dismissed', {
        user_id: userId || 'anonymous',
        intervention_level: detectionResult.interventionLevel,
        time_displayed: Date.now() - detectionResult.timestamp.getTime()
      });
    }

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleResourceClick = (resource: CrisisResource) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'crisis_resource_accessed', {
        user_id: userId || 'anonymous',
        resource_id: resource.id,
        resource_type: resource.contactType,
        intervention_level: detectionResult.interventionLevel
      });
    }

    onResourceAccess(resource);
    setSelectedResource(resource);
  };

  const handleEmergencyCall = () => {
    const emergencyResource = detectionResult.recommendedResources.find(
      r => r.id === 'emergency_services'
    );
    
    if (emergencyResource) {
      handleResourceClick(emergencyResource);
    }

    // Attempt to initiate call on mobile
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      window.location.href = 'tel:911';
    }
  };

  if (!isVisible) return null;

  const intervention = INTERVENTION_MESSAGES[detectionResult.interventionLevel as keyof typeof INTERVENTION_MESSAGES];
  const isHighUrgency = detectionResult.interventionLevel === 'immediate';

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Overlay Content */}
      <div className={`absolute inset-x-4 top-1/2 transform -translate-y-1/2 max-w-md mx-auto
        bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Header */}
        <div className={`relative p-6 rounded-t-2xl ${
          isHighUrgency ? 'bg-red-50 border-b border-red-100' : 'bg-green-50 border-b border-green-100'
        }`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-full ${
              isHighUrgency ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <Heart className={`w-6 h-6 ${
                isHighUrgency ? 'text-red-600' : 'text-green-600'
              }`} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {intervention.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {intervention.message}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Call Button (High Urgency Only) */}
        {isHighUrgency && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <button
              onClick={handleEmergencyCall}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Call 911 - Emergency</span>
            </button>
            <p className="text-xs text-red-700 mt-2 text-center">
              If you're in immediate danger, please call emergency services
            </p>
          </div>
        )}

        {/* Crisis Resources */}
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            {intervention.cta}
          </h4>

          <div className="space-y-3">
            {detectionResult.recommendedResources.slice(0, 3).map((resource) => {
              const IconComponent = CONTACT_ICONS[resource.contactType];
              return (
                <button
                  key={resource.id}
                  onClick={() => handleResourceClick(resource)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-green-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IconComponent className="w-4 h-4 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 mb-1">
                        {resource.name}
                      </div>
                      <div className="text-sm text-green-700 font-medium mb-1">
                        {resource.contact}
                      </div>
                      <div className="text-xs text-gray-600">
                        {resource.description} • {resource.availability}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Support */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">
                  You matter and your life has value
                </h5>
                <p className="text-sm text-blue-800">
                  Crisis feelings are temporary. Professional support can help you work through 
                  these difficult moments and find your way forward.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Indicator (for testing - remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="px-6 pb-4">
            <div className="text-xs text-gray-500 text-center">
              Detection confidence: {Math.round(detectionResult.confidence * 100)}% 
              • Score: {detectionResult.crisisScore.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-medium text-gray-900 mb-2">{selectedResource.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedResource.description}</p>
            
            <div className="space-y-3">
              <a
                href={selectedResource.contactType === 'phone' ? `tel:${selectedResource.contact}` : 
                      selectedResource.contactType === 'text' ? `sms:${selectedResource.contact}` :
                      '#'}
                className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition-colors"
              >
                Contact {selectedResource.name}
              </a>
              
              <button
                onClick={() => setSelectedResource(null)}
                className="block w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
