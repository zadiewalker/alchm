'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, MessageCircle, Shield, AlertTriangle, Sparkles } from 'lucide-react';

interface CrisisIndicator {
  level: 'low' | 'moderate' | 'high' | 'severe';
  confidence: number;
  triggers: string[];
  timestamp: Date;
}

interface CrisisResource {
  type: 'hotline' | 'text' | 'chat' | 'local' | 'breathing' | 'grounding';
  title: string;
  description: string;
  contact?: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CrisisDetectionIntegrationProps {
  content: string;
  onCrisisDetected?: (level: string) => void;
}

// Crisis detection patterns (trauma-informed and culturally sensitive)
const CRISIS_PATTERNS = {
  severe: [
    'want to die', 'kill myself', 'end it all', 'can\'t go on', 'no point living',
    'suicide', 'self harm', 'hurt myself', 'better off dead', 'plan to die'
  ],
  high: [
    'hopeless', 'worthless', 'nothing matters', 'can\'t take it', 'breaking down',
    'everything hurts', 'too much pain', 'can\'t breathe', 'falling apart', 'lost everything'
  ],
  moderate: [
    'overwhelmed', 'drowning', 'suffocating', 'can\'t cope', 'too hard',
    'giving up', 'exhausted', 'burnt out', 'falling behind', 'scared'
  ],
  low: [
    'stressed', 'anxious', 'worried', 'tired', 'frustrated', 'upset',
    'difficult day', 'struggling', 'challenging', 'hard time'
  ]
};

// Immediate crisis resources
const CRISIS_RESOURCES: CrisisResource[] = [
  {
    type: 'hotline',
    title: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support 24/7 for people in crisis',
    contact: '988',
    icon: Phone
  },
  {
    type: 'text',
    title: 'Crisis Text Line',
    description: 'Text with a trained counselor',
    contact: 'Text HOME to 741741',
    icon: MessageCircle
  },
  {
    type: 'chat',
    title: 'International Support',
    description: 'Crisis support worldwide',
    url: 'https://findahelpline.com',
    icon: Heart
  },
  {
    type: 'breathing',
    title: 'Emergency Grounding',
    description: '4-7-8 breathing technique for immediate relief',
    icon: Shield
  }
];

// Gentle grounding techniques
const GROUNDING_TECHNIQUES = [
  {
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste'
  },
  {
    title: 'Box Breathing',
    description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat gently.'
  },
  {
    title: 'Body Scan',
    description: 'Notice each part of your body from toes to head with kindness'
  },
  {
    title: 'Safe Place Visualization',
    description: 'Imagine a place where you feel completely safe and peaceful'
  }
];

export const CrisisDetectionIntegration: React.FC<CrisisDetectionIntegrationProps> = ({
  content,
  onCrisisDetected
}) => {
  const [crisisLevel, setCrisisLevel] = useState<CrisisIndicator | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [acknowledgedCrisis, setAcknowledgedCrisis] = useState(false);

  // Analyze content for crisis indicators
  const crisisAnalysis = useMemo(() => {
    if (!content || content.length < 20) return null;

    const contentLower = content.toLowerCase();
    let highestLevel: 'low' | 'moderate' | 'high' | 'severe' | null = null;
    let allTriggers: string[] = [];
    let totalConfidence = 0;

    // Check each crisis level
    Object.entries(CRISIS_PATTERNS).forEach(([level, patterns]) => {
      const triggers = patterns.filter(pattern => contentLower.includes(pattern));
      if (triggers.length > 0) {
        allTriggers = [...allTriggers, ...triggers];
        
        // Calculate confidence based on number and severity of triggers
        const levelWeight = level === 'severe' ? 4 : level === 'high' ? 3 : level === 'moderate' ? 2 : 1;
        const confidence = Math.min((triggers.length * levelWeight) * 0.2, 1);
        totalConfidence = Math.max(totalConfidence, confidence);
        
        if (!highestLevel || 
            (level === 'severe') ||
            (level === 'high' && highestLevel !== 'severe') ||
            (level === 'moderate' && !['severe', 'high'].includes(highestLevel))) {
          highestLevel = level as 'low' | 'moderate' | 'high' | 'severe';
        }
      }
    });

    if (highestLevel && allTriggers.length > 0) {
      return {
        level: highestLevel,
        confidence: totalConfidence,
        triggers: allTriggers,
        timestamp: new Date()
      };
    }

    return null;
  }, [content]);

  // Update crisis state when analysis changes
  useEffect(() => {
    if (crisisAnalysis && crisisAnalysis.level !== crisisLevel?.level) {
      setCrisisLevel(crisisAnalysis);
      setShowResources(true);
      setAcknowledgedCrisis(false);
      
      if (onCrisisDetected) {
        onCrisisDetected(crisisAnalysis.level);
      }
    }
  }, [crisisAnalysis, crisisLevel, onCrisisDetected]);

  const handleAcknowledge = () => {
    setAcknowledgedCrisis(true);
    setShowResources(false);
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'severe': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'moderate': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getCrisisMessage = (level: string) => {
    switch (level) {
      case 'severe':
        return {
          title: 'Immediate Support Available',
          message: 'Your words reveal deep pain. You don\'t have to face this alone. Immediate, professional support is just a call away.'
        };
      case 'high':
        return {
          title: 'Support & Care Resources',
          message: 'I notice you\'re experiencing significant distress. Your courage in expressing this deserves support.'
        };
      case 'moderate':
        return {
          title: 'Gentle Care Resources',
          message: 'You\'re navigating challenging waters. These resources might offer some comfort and guidance.'
        };
      case 'low':
        return {
          title: 'Self-Care Suggestions',
          message: 'It sounds like you\'re having a difficult time. Here are some gentle techniques that might help.'
        };
      default:
        return { title: '', message: '' };
    }
  };

  // Don't render anything if no crisis detected
  if (!crisisLevel) return null;

  const { title, message } = getCrisisMessage(crisisLevel.level);
  const isHighRisk = ['severe', 'high'].includes(crisisLevel.level);

  return (
    <AnimatePresence>
      {showResources && !acknowledgedCrisis && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`max-w-lg w-full p-6 rounded-xl border-2 ${getAlertColor(crisisLevel.level)} shadow-2xl`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Heart className={`w-6 h-6 ${
                  isHighRisk ? 'text-red-600' : 'text-indigo-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ✨ I am Khepera. Your wellbeing matters deeply.
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {message}
            </p>

            {/* Crisis Resources */}
            {isHighRisk && (
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Immediate Support</span>
                </h4>
                
                {CRISIS_RESOURCES.slice(0, 3).map((resource, index) => {
                  const IconComponent = resource.icon;
                  return (
                    <motion.div
                      key={resource.title}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">
                            {resource.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resource.description}
                          </p>
                          {resource.contact && (
                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                              {resource.contact}
                            </p>
                          )}
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Grounding Techniques */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Gentle Techniques</span>
              </h4>
              
              {GROUNDING_TECHNIQUES.slice(0, 2).map((technique, index) => (
                <motion.div
                  key={technique.title}
                  className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-1">
                    {technique.title}
                  </h5>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    {technique.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <motion.button
                onClick={handleAcknowledge}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Thank you, I understand
              </motion.button>
              
              {isHighRisk && (
                <motion.a
                  href="tel:988"
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 988</span>
                </motion.a>
              )}
            </div>

            {/* Gentle reminder */}
            <motion.div
              className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                💝 <strong>Remember:</strong> Your life has value. These difficult feelings are temporary, 
                even when they feel overwhelming. Professional support can provide tools and perspective 
                that journaling alone cannot offer.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Subtle persistent indicator */}
      {acknowledgedCrisis && crisisLevel && (
        <motion.div
          className="fixed bottom-4 left-4 z-40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.button
            onClick={() => setShowResources(true)}
            className={`p-3 rounded-full shadow-lg ${getAlertColor(crisisLevel.level)} border-2 hover:shadow-xl transition-all`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Crisis support resources"
          >
            <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CrisisDetectionIntegration;