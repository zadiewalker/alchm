'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CrisisKeywordDetectorProps {
  text: string;
  onCrisisDetected?: (keywords: string[]) => void;
}

export default function CrisisKeywordDetector({ text, onCrisisDetected }: CrisisKeywordDetectorProps) {
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  // Enhanced crisis detection using the advanced pattern system
  const criticalImmediateKeywords = [
    // Direct suicidal ideation
    'kill myself', 'end my life', 'suicide', 'suicidal', 'want to die', 'better off dead',
    'not worth living', 'end it all', 'ready to die', 'going to end it', 'final goodbye',
    
    // Method-specific indicators
    'pills and alcohol', 'hanging myself', 'jump off', 'gun to my head', 'razor blade',
    'overdose on', 'carbon monoxide', 'noose ready', 'bridge jump', 'poison myself'
  ];

  const highRiskKeywords = [
    // Self-harm escalation
    'hurt myself worse', 'cut myself deeper', 'self harm escalating', 'cutting deeper',
    'burning myself', 'punish myself severely', 'deserve extreme pain',
    
    // Severe despair
    'completely hopeless', 'no hope left', 'can\'t go on anymore', 'breaking point reached',
    'unbearable agony', 'giving up completely', 'abandoned by everyone', 'worthless life'
  ];

  const moderateRiskKeywords = [
    // Emerging crisis
    'thoughts of death', 'death seems peaceful', 'researching methods', 'planning ahead',
    'can\'t cope anymore', 'everything falling apart', 'losing control', 'spiraling down',
    'drowning in problems', 'exhausted from fighting', 'no energy left'
  ];

  // Time urgency indicators that escalate any risk level
  const urgentTimeKeywords = [
    'tonight', 'today', 'right now', 'this moment', 'plan to', 'going to', 'ready to',
    'in an hour', 'before sunrise', 'final decision', 'countdown started', 'moment arrived'
  ];

  // Advanced false positive filtering
  const falsePositivePatterns = [
    'killed it in', 'to die for', 'dead tired', 'dying to meet', 'suicide mission game',
    'killed the presentation', 'dead beat tired', 'drop dead gorgeous', 'over my dead body',
    'dead serious about', 'kill time', 'killed the game', 'dying of laughter'
  ];

  useEffect(() => {
    if (!text || text.length < 10) return;

    const lowerText = text.toLowerCase();
    
    // Check for false positives first
    const hasFalsePositive = falsePositivePatterns.some(pattern => 
      lowerText.includes(pattern.toLowerCase())
    );
    
    if (hasFalsePositive) {
      setDetectedKeywords([]);
      setShowAlert(false);
      return;
    }

    // Multi-tier risk detection with enhanced accuracy
    let foundKeywords: string[] = [];
    let riskLevel: 'critical' | 'high' | 'moderate' | 'none' = 'none';

    // Check critical immediate risk (highest priority)
    const criticalMatches = criticalImmediateKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    if (criticalMatches.length > 0) {
      foundKeywords = criticalMatches;
      riskLevel = 'critical';
    } else {
      // Check high risk keywords
      const highRiskMatches = highRiskKeywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      
      if (highRiskMatches.length > 0) {
        foundKeywords = highRiskMatches;
        riskLevel = 'high';
      } else {
        // Check moderate risk keywords
        const moderateMatches = moderateRiskKeywords.filter(keyword => 
          lowerText.includes(keyword.toLowerCase())
        );
        
        if (moderateMatches.length > 0) {
          foundKeywords = moderateMatches;
          riskLevel = 'moderate';
        }
      }
    }

    if (foundKeywords.length > 0) {
      setDetectedKeywords(foundKeywords);
      setShowAlert(true);
      onCrisisDetected?.(foundKeywords);

      // Check for time urgency that affects alert persistence
      const hasUrgentTiming = urgentTimeKeywords.some(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );

      // Auto-hide logic based on risk level and urgency
      if (riskLevel === 'critical' || hasUrgentTiming) {
        // Critical alerts stay visible - don't auto-hide
        return;
      } else if (riskLevel === 'high') {
        // High risk alerts stay for 60 seconds
        setTimeout(() => setShowAlert(false), 60000);
      } else {
        // Moderate risk alerts auto-hide after 30 seconds
        setTimeout(() => setShowAlert(false), 30000);
      }
    } else {
      setDetectedKeywords([]);
      setShowAlert(false);
    }
  }, [text, onCrisisDetected]);

  if (!showAlert || detectedKeywords.length === 0) return null;

  // Determine alert urgency and style based on detected keywords
  const isCritical = criticalImmediateKeywords.some(keyword => 
    detectedKeywords.some(detected => detected.toLowerCase() === keyword.toLowerCase())
  );
  
  const isHighRisk = highRiskKeywords.some(keyword => 
    detectedKeywords.some(detected => detected.toLowerCase() === keyword.toLowerCase())
  );
  
  const hasUrgentTiming = urgentTimeKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  
  const isUrgent = isCritical || (isHighRisk && hasUrgentTiming);

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${
      isUrgent ? 'animate-pulse' : ''
    }`}>
      <div className={`rounded-2xl shadow-2xl border-2 p-6 ${
        isUrgent 
          ? 'bg-red-50 border-red-300 text-red-900' 
          : 'bg-orange-50 border-orange-300 text-orange-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUrgent ? 'bg-red-200' : 'bg-orange-200'
          }`}>
            <span className="text-lg">{isUrgent ? '🚨' : '💙'}</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-2">
              {isUrgent ? 'You Are Not Alone' : 'Support is Available'}
            </h3>
            <p className="text-sm mb-4 leading-relaxed">
              {isUrgent 
                ? 'If you\'re thinking of hurting yourself, please reach out for help right now. You matter, and there are people who want to help.'
                : 'It sounds like you\'re going through a difficult time. Professional support is available whenever you need it.'
              }
            </p>
            
            <div className="space-y-2">
              <Link
                href="tel:988"
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors duration-200 ${
                  isUrgent 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                <div>
                  <div className="font-medium">988 Crisis Lifeline</div>
                  <div className="text-sm opacity-90">24/7 • Free • Confidential</div>
                </div>
                <div className="text-xl">📞</div>
              </Link>
              
              <Link
                href="sms:741741"
                className="flex items-center justify-between w-full p-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors duration-200 text-sm"
              >
                <span>Text HOME to 741741</span>
                <span>💬</span>
              </Link>
            </div>
          </div>
          
          <button
            onClick={() => setShowAlert(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label="Close alert"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}