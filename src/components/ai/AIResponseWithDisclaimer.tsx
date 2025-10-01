/**
 * AI Response with Medical Disclaimer Component
 * 
 * Ensures all AI responses include appropriate medical disclaimers
 * for App Store compliance and user safety.
 */

"use client";

import React from 'react';
import { MedicalDisclaimer } from '@/components/ui/MedicalDisclaimer';

interface AIResponseData {
  insight?: string;
  encouragement?: string;
  followUpQuestion?: string;
  medicalDisclaimer?: {
    applied: boolean;
    type: string;
    context: any;
    complianceStatus?: string;
    healthContentDetected?: boolean;
    severityLevel?: string;
  };
  supportLevel?: string;
  responseType?: string;
}

interface AIResponseWithDisclaimerProps {
  response: AIResponseData;
  className?: string;
  showDisclaimerAlways?: boolean; // Force disclaimer display even if not in response
}

export function AIResponseWithDisclaimer({ 
  response, 
  className = '',
  showDisclaimerAlways = false 
}: AIResponseWithDisclaimerProps) {
  
  // Determine if disclaimer should be shown
  const shouldShowDisclaimer = showDisclaimerAlways || 
    response.medicalDisclaimer?.applied || 
    response.supportLevel === 'crisis' ||
    response.medicalDisclaimer?.healthContentDetected;
  
  // Determine disclaimer variant based on response context
  let disclaimerVariant: 'banner' | 'inline' | 'crisis' = 'inline';
  let disclaimerContext: 'general' | 'ai_response' | 'crisis' = 'ai_response';
  let disclaimerSeverity: 'standard' | 'elevated' | 'crisis' = 'standard';
  
  if (response.supportLevel === 'crisis' || response.medicalDisclaimer?.type === 'crisis') {
    disclaimerVariant = 'crisis';
    disclaimerContext = 'crisis';
    disclaimerSeverity = 'crisis';
  } else if (response.medicalDisclaimer?.type === 'therapy_boundary') {
    disclaimerContext = 'ai_response';
    disclaimerSeverity = 'elevated';
  } else if (response.medicalDisclaimer?.type === 'elevated') {
    disclaimerSeverity = 'elevated';
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Crisis disclaimer appears first for immediate visibility */}
      {disclaimerVariant === 'crisis' && (
        <MedicalDisclaimer
          variant="crisis"
          context="crisis"
          severity="crisis"
          showCrisisResources={true}
          className="mb-4"
        />
      )}
      
      {/* Main AI Response Content */}
      <div className="space-y-3">
        {response.insight && (
          <div className="bg-sage-50 border border-sage-200 rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sage-800 leading-relaxed">
                {response.insight}
              </div>
            </div>
          </div>
        )}
        
        {response.encouragement && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-blue-800 leading-relaxed">
                {response.encouragement}
              </div>
            </div>
          </div>
        )}
        
        {response.followUpQuestion && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-amber-800 leading-relaxed font-medium">
                {response.followUpQuestion}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Medical disclaimer for non-crisis responses */}
      {shouldShowDisclaimer && disclaimerVariant !== 'crisis' && (
        <MedicalDisclaimer
          variant="inline"
          context={disclaimerContext}
          severity={disclaimerSeverity}
          showCrisisResources={disclaimerSeverity === 'elevated'}
          className="mt-4"
        />
      )}
      
      {/* Compliance validation warning for development */}
      {process.env.NODE_ENV === 'development' && response.medicalDisclaimer?.complianceStatus === 'failed' && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-xs text-red-800">
          <strong>DEV WARNING:</strong> Medical disclaimer compliance failed. 
          Reason: {response.medicalDisclaimer?.context?.reason || 'Unknown'}
        </div>
      )}
      
      {/* Development info about disclaimer status */}
      {process.env.NODE_ENV === 'development' && response.medicalDisclaimer && (
        <details className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-xs text-gray-700">
          <summary className="cursor-pointer font-medium">Disclaimer Debug Info</summary>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(response.medicalDisclaimer, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

export default AIResponseWithDisclaimer;