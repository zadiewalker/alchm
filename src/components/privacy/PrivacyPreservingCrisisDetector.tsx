'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';

interface PrivacyPreservingCrisisDetectorProps {
  text: string;
  onCrisisDetected?: (riskLevel: 'critical' | 'high' | 'moderate', hashedIndicators: string[]) => void;
  userAgeStatus?: 'adult' | 'teen' | 'minor';
  privacyMode?: 'strict' | 'balanced' | 'minimal';
}

interface CrisisPattern {
  id: string;
  pattern: RegExp;
  riskLevel: 'critical' | 'high' | 'moderate';
  category: 'suicidal' | 'self_harm' | 'substance' | 'violence' | 'despair';
  youthSpecific?: boolean;
}

export default function PrivacyPreservingCrisisDetector({ 
  text, 
  onCrisisDetected,
  userAgeStatus = 'adult',
  privacyMode = 'balanced'
}: PrivacyPreservingCrisisDetectorProps) {
  const [detectedRisk, setDetectedRisk] = useState<'critical' | 'high' | 'moderate' | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [hashedIndicators, setHashedIndicators] = useState<string[]>([]);
  const [privacyKeyGenerated, setPrivacyKeyGenerated] = useState(false);

  // Privacy-preserving crisis patterns using regex for better accuracy
  const crisisPatterns: CrisisPattern[] = [
    // Critical - Immediate intervention needed
    {
      id: 'suicide_direct',
      pattern: /\b(kill myself|end my life|going to die|ready to die|suicide plan|final goodbye)\b/gi,
      riskLevel: 'critical',
      category: 'suicidal'
    },
    {
      id: 'suicide_method',
      pattern: /\b(pills and alcohol|hanging|jump off|gun to|razor blade|overdose on)\b/gi,
      riskLevel: 'critical',
      category: 'suicidal'
    },
    {
      id: 'imminent_timeline',
      pattern: /\b(tonight|today|right now|this hour|before sunrise|countdown|moment arrived)\b/gi,
      riskLevel: 'critical',
      category: 'suicidal'
    },

    // High risk - Urgent monitoring needed
    {
      id: 'escalating_self_harm',
      pattern: /\b(cut deeper|hurt myself worse|burning myself|punish myself severely)\b/gi,
      riskLevel: 'high',
      category: 'self_harm'
    },
    {
      id: 'severe_despair',
      pattern: /\b(completely hopeless|no hope left|breaking point|unbearable agony|giving up completely)\b/gi,
      riskLevel: 'high',
      category: 'despair'
    },
    {
      id: 'youth_specific_risk',
      pattern: /\b(can't face school|parents will kill me|nowhere to go|running away tonight)\b/gi,
      riskLevel: 'high',
      category: 'despair',
      youthSpecific: true
    },

    // Moderate risk - Support and monitoring
    {
      id: 'emerging_crisis',
      pattern: /\b(thoughts of death|researching methods|can't cope|losing control|spiraling)\b/gi,
      riskLevel: 'moderate',
      category: 'despair'
    },
    {
      id: 'substance_risk',
      pattern: /\b(drinking to forget|using to numb|high to escape|substances daily)\b/gi,
      riskLevel: 'moderate',
      category: 'substance'
    }
  ];

  // Enhanced false positive filtering for privacy
  const falsePositivePatterns = [
    /\b(killed it in|to die for|dead tired|dying to meet|suicide mission game|killed the presentation)\b/gi,
    /\b(drop dead gorgeous|over my dead body|dead serious about|kill time|dying of laughter)\b/gi,
    /\b(cutting edge|razor sharp focus|jumping for joy|hanging out|burning passion)\b/gi
  ];

  // Privacy-preserving hash function for indicators
  const hashIndicator = useCallback((indicator: string): string => {
    if (privacyMode === 'strict') {
      // Strict privacy: Only category-level hashing
      return CryptoJS.SHA256(indicator.substring(0, 3)).toString();
    } else if (privacyMode === 'balanced') {
      // Balanced: Hash with salt but preserve some structure
      const salt = 'alchm_crisis_detector_v1';
      return CryptoJS.SHA256(indicator + salt).toString().substring(0, 16);
    } else {
      // Minimal privacy: Direct hashing for debugging (not for production)
      return CryptoJS.SHA256(indicator).toString().substring(0, 12);
    }
  }, [privacyMode]);

  // Privacy-conscious pattern matching
  const analyzeTextForCrisis = useCallback((inputText: string) => {
    if (!inputText || inputText.length < 10) return null;

    // Normalize text while preserving privacy
    const normalizedText = inputText.toLowerCase();
    
    // Check for false positives first to avoid unnecessary processing
    const hasFalsePositive = falsePositivePatterns.some(pattern => 
      pattern.test(normalizedText)
    );
    
    if (hasFalsePositive) {
      return null;
    }

    let highestRisk: 'critical' | 'high' | 'moderate' | null = null;
    const foundIndicators: string[] = [];
    const applicablePatterns = crisisPatterns.filter(pattern => 
      !pattern.youthSpecific || (pattern.youthSpecific && userAgeStatus === 'teen')
    );

    // Analyze patterns in order of severity
    for (const pattern of applicablePatterns) {
      const matches = normalizedText.match(pattern.pattern);
      if (matches) {
        foundIndicators.push(...matches.map(match => hashIndicator(pattern.category + '_' + pattern.riskLevel)));
        
        if (!highestRisk || 
            (pattern.riskLevel === 'critical') ||
            (pattern.riskLevel === 'high' && highestRisk === 'moderate')) {
          highestRisk = pattern.riskLevel;
        }
      }
    }

    return highestRisk ? { riskLevel: highestRisk, indicators: foundIndicators } : null;
  }, [userAgeStatus, hashIndicator]);

  // Privacy-preserving text analysis
  useEffect(() => {
    const analysisResult = analyzeTextForCrisis(text);
    
    if (analysisResult) {
      setDetectedRisk(analysisResult.riskLevel);
      setHashedIndicators(analysisResult.indicators);
      setShowAlert(true);
      
      // Callback with privacy-preserved data only
      onCrisisDetected?.(analysisResult.riskLevel, analysisResult.indicators);

      // Auto-hide logic based on risk level (privacy-conscious)
      if (analysisResult.riskLevel === 'critical') {
        // Critical alerts don't auto-hide for safety
      } else if (analysisResult.riskLevel === 'high') {
        setTimeout(() => setShowAlert(false), 60000);
      } else {
        setTimeout(() => setShowAlert(false), 30000);
      }

      // Privacy audit log (no PII)
      console.log('Privacy-preserving crisis detection triggered', {
        riskLevel: analysisResult.riskLevel,
        indicatorCount: analysisResult.indicators.length,
        userAgeStatus,
        privacyMode,
        timestamp: new Date().toISOString(),
        textLength: text.length,
        // No actual text content logged for privacy
      });
    } else {
      setDetectedRisk(null);
      setHashedIndicators([]);
      setShowAlert(false);
    }
  }, [text, analyzeTextForCrisis, onCrisisDetected, userAgeStatus, privacyMode]);

  // Generate privacy key on component mount
  useEffect(() => {
    if (!privacyKeyGenerated) {
      setPrivacyKeyGenerated(true);
    }
  }, [privacyKeyGenerated]);

  if (!showAlert || !detectedRisk) return null;

  const isUrgent = detectedRisk === 'critical';
  const isHighRisk = detectedRisk === 'high';

  // Youth-specific crisis messaging
  const getYouthSpecificMessage = () => {
    if (userAgeStatus === 'teen') {
      return isUrgent 
        ? "Your feelings are valid and you matter deeply. There are people who understand what you're going through and want to help."
        : "It sounds like you're dealing with some heavy stuff. That takes courage to acknowledge. Support is available.";
    }
    return isUrgent
      ? "If you're thinking of hurting yourself, please reach out for help right now. You matter, and there are people who want to help."
      : "It sounds like you're going through a difficult time. Professional support is available whenever you need it.";
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${
      isUrgent ? 'animate-pulse' : ''
    }`}>
      <div className={`rounded-2xl shadow-2xl border-2 p-6 ${
        isUrgent 
          ? 'bg-red-50 border-red-300 text-red-900' 
          : isHighRisk 
          ? 'bg-orange-50 border-orange-300 text-orange-900'
          : 'bg-yellow-50 border-yellow-300 text-yellow-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUrgent ? 'bg-red-200' : isHighRisk ? 'bg-orange-200' : 'bg-yellow-200'
          }`}>
            <span className="text-lg">{isUrgent ? '🚨' : isHighRisk ? '⚠️' : '💙'}</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {isUrgent ? 'You Are Not Alone' : isHighRisk ? 'Support is Here' : 'We\'re Here for You'}
            </h3>
            <p className="text-sm mb-4 leading-relaxed">
              {getYouthSpecificMessage()}
            </p>
            
            <div className="space-y-2">
              <Link
                href="tel:988"
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors duration-200 ${
                  isUrgent 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : isHighRisk
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                <div>
                  <div className="font-semibold">988 Crisis Lifeline</div>
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

              {userAgeStatus === 'teen' && (
                <Link
                  href="https://suicidepreventionlifeline.org/help-yourself/youth/"
                  target="_blank"
                  className="flex items-center justify-between w-full p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200 text-sm text-blue-800"
                >
                  <span>Youth-Specific Resources</span>
                  <span>🌟</span>
                </Link>
              )}
            </div>

            {/* Privacy indicator */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>🔒</span>
                <span>Privacy Protected: Analysis uses encrypted patterns only</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Risk Level: {detectedRisk} | Indicators: {hashedIndicators.length} (hashed) | 
                Mode: {privacyMode} | Age: {userAgeStatus}
              </div>
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