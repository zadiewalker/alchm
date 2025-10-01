'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Compass, Feather, AlertCircle, TrendingUp } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'sage' | 'coach' | 'poet';
  content: string;
  confidence: number;
  triggerWords: string[];
  timestamp: Date;
}

interface RealTimeAIInsightsProps {
  content: string;
  mood?: string;
  insights?: any[];
}

// Khepera's three archetypal voices
const ARCHETYPE_CONFIGS = {
  sage: {
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    name: 'The Sage',
    prefix: '✨ I am Khepera, the Sage.',
  },
  coach: {
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    name: 'The Coach',
    prefix: '✨ I am Khepera, the Coach.',
  },
  poet: {
    icon: Feather,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    name: 'The Poet',
    prefix: '✨ I am Khepera, the Poet.',
  }
};

// Pattern recognition for triggering different archetypes
const INSIGHT_PATTERNS = {
  sage: {
    triggers: [
      'confused', 'lost', 'uncertain', 'don\'t know', 'overwhelmed', 'wisdom', 'guidance',
      'meaning', 'purpose', 'ancient', 'truth', 'understanding', 'perspective'
    ],
    responses: [
      'What ancient wisdom might be emerging from this experience?',
      'In the grand tapestry of human experience, what thread are you weaving today?',
      'The confusion you feel is the birthplace of new understanding.',
      'Your uncertainty holds space for profound wisdom to emerge.',
      'What timeless truth wants to reveal itself through this moment?'
    ]
  },
  coach: {
    triggers: [
      'can\'t', 'impossible', 'stuck', 'failed', 'struggle', 'difficult', 'challenge',
      'goal', 'want to', 'trying', 'effort', 'progress', 'growth', 'change'
    ],
    responses: [
      'You\'ve survived 100% of your difficult days. What\'s your strategy now?',
      'What strength you\'ve already demonstrated is waiting to be called upon again.',
      'Your track record shows remarkable resilience. How will you channel that power?',
      'What\'s your next powerful move from this place of awareness?',
      'The challenge before you is an invitation to discover new capabilities.'
    ]
  },
  poet: {
    triggers: [
      'heart', 'soul', 'feeling', 'beautiful', 'pain', 'love', 'dreams', 'hope',
      'tears', 'joy', 'broken', 'healing', 'sacred', 'divine', 'spirit'
    ],
    responses: [
      'Your heart is writing poetry in a language only you understand.',
      'This chapter of your story holds colors that don\'t yet have names.',
      'The symphony of your experience creates harmonies no one else can hear.',
      'Your soul speaks in metaphors that bridge the seen and unseen worlds.',
      'In the garden of your being, what new flowers are learning to bloom?'
    ]
  }
};

export const RealTimeAIInsights: React.FC<RealTimeAIInsightsProps> = ({
  content,
  mood,
  insights = []
}) => {
  const [activeInsights, setActiveInsights] = useState<AIInsight[]>([]);
  const [showInsight, setShowInsight] = useState(false);

  // Analyze content for insight triggers
  const analyzedInsights = useMemo(() => {
    if (!content || content.length < 30) return [];

    const contentLower = content.toLowerCase();
    const words = contentLower.split(/\s+/);
    const recentWords = words.slice(-50); // Analyze last 50 words
    const recentText = recentWords.join(' ');

    const insights: AIInsight[] = [];

    // Check each archetype for triggers
    Object.entries(INSIGHT_PATTERNS).forEach(([archetypeKey, pattern]) => {
      const archetype = archetypeKey as keyof typeof INSIGHT_PATTERNS;
      const matchedTriggers = pattern.triggers.filter(trigger => 
        recentText.includes(trigger.toLowerCase())
      );

      if (matchedTriggers.length > 0) {
        const confidence = Math.min(matchedTriggers.length * 0.3, 0.9);
        const randomResponse = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
        
        insights.push({
          id: `${archetype}-${Date.now()}`,
          type: archetype,
          content: randomResponse,
          confidence,
          triggerWords: matchedTriggers,
          timestamp: new Date()
        });
      }
    });

    // Sort by confidence and return top 2
    return insights
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);
  }, [content]);

  // Update active insights when new ones are detected
  useEffect(() => {
    if (analyzedInsights.length > 0) {
      // Only add new insights (not duplicates)
      const newInsights = analyzedInsights.filter(newInsight => 
        !activeInsights.some(existing => 
          existing.type === newInsight.type && 
          Math.abs(existing.timestamp.getTime() - newInsight.timestamp.getTime()) < 10000
        )
      );

      if (newInsights.length > 0) {
        setActiveInsights(prev => [...newInsights, ...prev].slice(0, 5));
        setShowInsight(true);
      }
    }
  }, [analyzedInsights]);

  // Auto-hide insights after delay
  useEffect(() => {
    if (showInsight) {
      const timer = setTimeout(() => {
        setShowInsight(false);
      }, 15000); // Show for 15 seconds

      return () => clearTimeout(timer);
    }
  }, [showInsight, activeInsights]);

  const handleInsightInteraction = (insightId: string) => {
    // Mark insight as acknowledged
    setActiveInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, confidence: Math.max(insight.confidence - 0.2, 0) }
          : insight
      )
    );
  };

  if (activeInsights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="text-sm">
          Khepera's wisdom awakens as you write...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Wisdom Reflections</span>
        </h4>
        {activeInsights.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {activeInsights.length} insights
          </span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {activeInsights.map((insight, index) => {
          const config = ARCHETYPE_CONFIGS[insight.type];
          const IconComponent = config.icon;

          return (
            <motion.div
              key={insight.id}
              className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} cursor-pointer transition-all duration-300 hover:shadow-md`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleInsightInteraction(insight.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                  <IconComponent className={`w-4 h-4 ${config.color}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(insight.confidence * 100)}% resonance
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-xs text-purple-600 dark:text-purple-400 block mb-1">
                      {config.prefix}
                    </span>
                    {insight.content}
                  </p>
                  
                  {insight.triggerWords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {insight.triggerWords.slice(0, 3).map((word, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-white/50 dark:bg-gray-700/50 rounded-full text-gray-600 dark:text-gray-400"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <motion.div
                className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r from-${insight.type === 'sage' ? 'amber' : insight.type === 'coach' ? 'emerald' : 'purple'}-400 to-${insight.type === 'sage' ? 'amber' : insight.type === 'coach' ? 'emerald' : 'purple'}-600`}
                  initial={{ width: 0 }}
                  animate={{ width: `${insight.confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Gentle reminder about AI nature */}
      <motion.div
        className="mt-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <p className="mb-1 font-medium">Remember:</p>
            <p>
              These reflections emerge from AI pattern recognition, designed to mirror your own wisdom back to you. 
              For professional support, please connect with qualified human practitioners.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeAIInsights;