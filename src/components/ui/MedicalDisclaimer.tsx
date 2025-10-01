/**
 * Enhanced Medical Disclaimer Component
 * 
 * App Store compliant medical disclaimers for mental health applications.
 * Implements mandatory professional care referrals and crisis safety protocols.
 */

import React from 'react';
// Simple icon components to replace lucide-react
const AlertTriangle = ({ className = "", ...props }) => (
  <svg className={className} {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Phone = ({ className = "", ...props }) => (
  <svg className={className} {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Heart = ({ className = "", ...props }) => (
  <svg className={className} {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Shield = ({ className = "", ...props }) => (
  <svg className={className} {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'modal' | 'footer' | 'compact' | 'inline' | 'crisis';
  showCrisisResources?: boolean;
  className?: string;
  context?: 'general' | 'ai_response' | 'crisis' | 'therapy_content' | 'assessment';
  severity?: 'standard' | 'elevated' | 'crisis';
}

// Crisis resource data
const CRISIS_RESOURCES = {
  immediate: [
    { number: '988', label: 'Suicide & Crisis Lifeline', type: 'tel' },
    { number: '911', label: 'Emergency Services', type: 'tel' },
    { number: '741741', label: 'Crisis Text Line (Text HOME)', type: 'sms' }
  ],
  specialized: [
    { number: '1-866-488-7386', label: 'Trevor Lifeline (LGBTQ+)', type: 'tel' },
    { number: '1-877-565-8860', label: 'Trans Lifeline', type: 'tel' },
    { url: 'https://www.veteranscrisisline.net/', label: 'Veterans Crisis Line', type: 'web' }
  ]
};

export function MedicalDisclaimer({ 
  variant = 'banner', 
  showCrisisResources = true,
  className = '',
  context = 'general',
  severity = 'standard'
}: MedicalDisclaimerProps) {
  
  // Crisis variant for immediate safety
  if (variant === 'crisis' || severity === 'crisis') {
    return (
      <div className={`bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg ${className}`}>
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-900 mb-2 text-lg">Immediate Safety Notice</h4>
            <p className="text-red-800 font-semibold mb-3">
              <strong>ALCHM cannot provide emergency mental health care.</strong> If you're having thoughts of self-harm or suicide, please contact professional help immediately.
            </p>
            <div className="space-y-2 mb-4">
              {CRISIS_RESOURCES.immediate.map((resource) => (
                <a
                  key={resource.number}
                  href={resource.type === 'tel' ? `tel:${resource.number}` : `sms:${resource.number}`}
                  className="flex items-center gap-2 p-3 bg-red-100 hover:bg-red-200 rounded-lg text-red-800 hover:text-red-900 font-medium transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {resource.label}: {resource.number}
                </a>
              ))}
            </div>
            <p className="text-red-700 text-sm font-medium">
              These services are available 24/7 and staffed by trained professionals who understand crisis situations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant for AI responses
  if (variant === 'inline') {
    return (
      <div className={`text-sm text-sage-700 bg-sage-50 px-4 py-3 rounded-lg border border-sage-200 mt-4 ${className}`}>
        <div className="flex items-start gap-2">
          <Heart className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Professional Care Reminder</p>
            <p className="text-xs text-sage-600">
              This AI guidance complements but never replaces professional therapy or medical care. 
              For ongoing mental health support, please consult with a licensed therapist or counselor.
              {severity === 'elevated' && (
                <span className="block mt-1 font-medium text-amber-700">
                  If you're experiencing distress, consider reaching out to a mental health professional.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for space-constrained areas
  if (variant === 'compact') {
    return (
      <div className={`text-xs text-sage-600 bg-sage-50 px-3 py-2 rounded-lg border border-sage-200 ${className}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span>
            <strong>Not Medical Treatment:</strong> ALCHM provides journaling tools, not therapy or medical care. 
            For mental health support, consult a licensed professional. Crisis: 988.
          </span>
        </div>
      </div>
    );
  }

  // Modal variant for prominent display
  if (variant === 'modal') {
    return (
      <div className={`bg-white border border-amber-200 rounded-xl p-6 shadow-xl max-w-2xl ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-2">Important Medical Disclaimer</h3>
        </div>
        
        <div className="space-y-4 text-amber-800">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-bold mb-2">ALCHM is NOT medical treatment</h4>
            <p className="text-sm">
              This platform provides journaling tools and AI-powered reflection guidance for educational and wellness purposes only. 
              It is not therapy, medical treatment, psychological counseling, or professional mental health care.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold mb-2 text-blue-900">Seek Professional Care</h4>
            <p className="text-sm text-blue-800">
              For mental health concerns, diagnosis, or treatment, please consult with licensed healthcare professionals, 
              therapists, or counselors in your area.
            </p>
          </div>
          
          {showCrisisResources && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-bold mb-3 text-red-900">Crisis Resources</h4>
              <div className="space-y-2">
                {CRISIS_RESOURCES.immediate.map((resource) => (
                  <a
                    key={resource.number}
                    href={resource.type === 'tel' ? `tel:${resource.number}` : `sms:${resource.number}`}
                    className="flex items-center gap-2 text-red-700 hover:text-red-900 font-medium text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    {resource.label}: {resource.number}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Footer variant for persistent display
  if (variant === 'footer') {
    return (
      <div className={`bg-gray-50 border-t border-gray-200 px-4 py-3 text-xs text-gray-600 ${className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <p>
            <strong>Medical Disclaimer:</strong> ALCHM is not therapy or medical treatment. 
            This platform provides journaling and reflection tools for educational purposes. 
            For mental health care, consult licensed professionals. 
            <span className="font-medium text-gray-700">Crisis support: 988</span>
          </p>
        </div>
      </div>
    );
  }

  // Default banner variant with context-aware messaging
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <h4 className="font-semibold text-amber-900 mb-1">
            {context === 'ai_response' ? 'AI Guidance Disclaimer' : 'Medical Disclaimer'}
          </h4>
          
          <p className="text-amber-800 mb-2">
            <strong>ALCHM is not therapy, medical treatment, or professional mental health care.</strong> 
            {context === 'ai_response' && (
              <span> Our AI provides educational reflection guidance and should never replace professional therapy or medical advice.</span>
            )}
            {context === 'assessment' && (
              <span> Any assessments or insights are for educational self-reflection only and not diagnostic tools.</span>
            )}
            {context === 'therapy_content' && (
              <span> Therapeutic techniques shared are educational and not a substitute for working with a licensed therapist.</span>
            )}
            {context === 'general' && (
              <span> This platform provides journaling, self-reflection, and emotional wellness education only.</span>
            )}
          </p>
          
          <p className="text-amber-700 text-xs mb-3">
            For ongoing mental health support, please consult with licensed healthcare professionals, 
            therapists, or counselors. If you're experiencing a mental health crisis or having thoughts 
            of self-harm, please contact emergency services or a crisis hotline immediately.
          </p>
          
          {showCrisisResources && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-3 text-xs">
                {CRISIS_RESOURCES.immediate.map((resource) => (
                  <a
                    key={resource.number}
                    href={resource.type === 'tel' ? `tel:${resource.number}` : `sms:${resource.number}`}
                    className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {resource.label.includes('Crisis Text') ? 'Text HOME to 741741' : `${resource.label}: ${resource.number}`}
                  </a>
                ))}
              </div>
              
              {context === 'crisis' && (
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium">
                    Specialized Support Available:
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs">
                    {CRISIS_RESOURCES.specialized.slice(0, 2).map((resource) => (
                      <a
                        key={resource.number || resource.url}
                        href={resource.type === 'tel' ? `tel:${resource.number}` : resource.url}
                        className="text-blue-700 hover:text-blue-900 font-medium"
                      >
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalDisclaimer;