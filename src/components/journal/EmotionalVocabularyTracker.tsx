'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BookOpen, Target, Award, Zap, Heart } from 'lucide-react';

interface EmotionalWord {
  word: string;
  category: 'basic' | 'intermediate' | 'advanced' | 'nuanced';
  sentiment: 'positive' | 'neutral' | 'negative' | 'complex';
  frequency: number;
  firstUsed: Date;
  lastUsed: Date;
}

interface VocabularyGrowth {
  totalWords: number;
  newWordsThisWeek: number;
  diversityScore: number;
  sophisticationLevel: number;
  emotionalRange: number;
}

interface EmotionalVocabularyTrackerProps {
  content: string;
  onVocabularyUpdate?: (vocabulary: string[]) => void;
}

// Comprehensive emotional vocabulary database
const EMOTIONAL_VOCABULARY = {
  basic: {
    positive: ['happy', 'good', 'nice', 'okay', 'fine', 'glad', 'pleased', 'content'],
    negative: ['sad', 'bad', 'angry', 'mad', 'upset', 'hurt', 'worried', 'scared'],
    neutral: ['calm', 'neutral', 'steady', 'balanced', 'quiet', 'still']
  },
  intermediate: {
    positive: ['joyful', 'grateful', 'excited', 'hopeful', 'confident', 'peaceful', 'energetic', 'optimistic', 'fulfilled', 'blessed'],
    negative: ['frustrated', 'disappointed', 'anxious', 'overwhelmed', 'jealous', 'guilty', 'ashamed', 'lonely', 'confused', 'stressed'],
    neutral: ['contemplative', 'reflective', 'observant', 'curious', 'pensive', 'thoughtful']
  },
  advanced: {
    positive: ['euphoric', 'ecstatic', 'blissful', 'serene', 'radiant', 'triumphant', 'exhilarated', 'rejuvenated', 'inspired', 'empowered'],
    negative: ['devastated', 'anguished', 'tormented', 'despairing', 'mortified', 'livid', 'desolate', 'apprehensive', 'melancholic', 'indignant'],
    neutral: ['introspective', 'philosophical', 'analytical', 'meditative', 'stoic', 'contemplative']
  },
  nuanced: {
    positive: ['bittersweet', 'nostalgic', 'whimsical', 'tender', 'luminous', 'resilient', 'graceful', 'transcendent', 'ethereal', 'sublime'],
    negative: ['wistful', 'forlorn', 'bereft', 'disheartened', 'perturbed', 'vexed', 'disoriented', 'melancholic', 'somber', 'rueful'],
    complex: ['ambivalent', 'conflicted', 'bittersweet', 'poignant', 'cathartic', 'transformative', 'revelatory', 'profound', 'paradoxical', 'ineffable']
  }
};

// Flatten vocabulary for analysis
const ALL_EMOTIONAL_WORDS = Object.entries(EMOTIONAL_VOCABULARY).reduce((acc, [category, sentiments]) => {
  Object.entries(sentiments).forEach(([sentiment, words]) => {
    words.forEach(word => {
      acc[word.toLowerCase()] = {
        category: category as 'basic' | 'intermediate' | 'advanced' | 'nuanced',
        sentiment: sentiment as 'positive' | 'neutral' | 'negative' | 'complex'
      };
    });
  });
  return acc;
}, {} as Record<string, { category: string; sentiment: string }>);

export const EmotionalVocabularyTracker: React.FC<EmotionalVocabularyTrackerProps> = ({
  content,
  onVocabularyUpdate
}) => {
  const [trackedWords, setTrackedWords] = useState<EmotionalWord[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<VocabularyGrowth | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Analyze content for emotional vocabulary
  const currentVocabulary = useMemo(() => {
    if (!content || content.length < 10) return [];

    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    const emotionalWords: EmotionalWord[] = [];
    const now = new Date();

    words.forEach(word => {
      const wordInfo = ALL_EMOTIONAL_WORDS[word];
      if (wordInfo) {
        const existingWord = emotionalWords.find(ew => ew.word === word);
        if (existingWord) {
          existingWord.frequency += 1;
          existingWord.lastUsed = now;
        } else {
          emotionalWords.push({
            word,
            category: wordInfo.category as 'basic' | 'intermediate' | 'advanced' | 'nuanced',
            sentiment: wordInfo.sentiment as 'positive' | 'neutral' | 'negative' | 'complex',
            frequency: 1,
            firstUsed: now,
            lastUsed: now
          });
        }
      }
    });

    return emotionalWords.sort((a, b) => b.frequency - a.frequency);
  }, [content]);

  // Update tracked words and notify parent
  useEffect(() => {
    setTrackedWords(currentVocabulary);
    
    if (onVocabularyUpdate) {
      onVocabularyUpdate(currentVocabulary.map(w => w.word));
    }
  }, [currentVocabulary, onVocabularyUpdate]);

  // Calculate growth metrics
  useEffect(() => {
    if (trackedWords.length > 0) {
      const categoryCount = {
        basic: trackedWords.filter(w => w.category === 'basic').length,
        intermediate: trackedWords.filter(w => w.category === 'intermediate').length,
        advanced: trackedWords.filter(w => w.category === 'advanced').length,
        nuanced: trackedWords.filter(w => w.category === 'nuanced').length
      };

      const sentimentCount = {
        positive: trackedWords.filter(w => w.sentiment === 'positive').length,
        negative: trackedWords.filter(w => w.sentiment === 'negative').length,
        neutral: trackedWords.filter(w => w.sentiment === 'neutral').length,
        complex: trackedWords.filter(w => w.sentiment === 'complex').length
      };

      const totalWords = trackedWords.length;
      const diversityScore = Math.min(
        Object.values(categoryCount).filter(count => count > 0).length / 4,
        1
      );
      
      const sophisticationLevel = (
        (categoryCount.intermediate * 0.25) +
        (categoryCount.advanced * 0.5) +
        (categoryCount.nuanced * 1)
      ) / Math.max(totalWords, 1);

      const emotionalRange = Math.min(
        Object.values(sentimentCount).filter(count => count > 0).length / 4,
        1
      );

      setGrowthMetrics({
        totalWords,
        newWordsThisWeek: 0, // Would be calculated from historical data
        diversityScore,
        sophisticationLevel,
        emotionalRange
      });
    }
  }, [trackedWords]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'intermediate': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'advanced': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'nuanced': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      case 'complex': return '🤔';
      default: return '💭';
    }
  };

  const getGrowthLevel = () => {
    if (!growthMetrics) return 'Beginning';
    
    const score = (growthMetrics.sophisticationLevel + growthMetrics.diversityScore + growthMetrics.emotionalRange) / 3;
    
    if (score < 0.25) return 'Budding Explorer';
    if (score < 0.5) return 'Growing Articulator';
    if (score < 0.75) return 'Skilled Expresser';
    return 'Eloquent Communicator';
  };

  if (trackedWords.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <Heart className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="text-sm">
          Your emotional vocabulary will bloom as you write...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>Emotional Growth</span>
        </h4>
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </motion.button>
      </div>

      {/* Growth Overview */}
      {growthMetrics && (
        <motion.div
          className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {getGrowthLevel()}
            </span>
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Vocabulary Size:</span>
              <div className="font-medium text-indigo-700 dark:text-indigo-300">
                {growthMetrics.totalWords} words
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Sophistication:</span>
              <div className="font-medium text-purple-700 dark:text-purple-300">
                {Math.round(growthMetrics.sophisticationLevel * 100)}%
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Emotional Range</span>
                <span>{Math.round(growthMetrics.emotionalRange * 100)}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${growthMetrics.emotionalRange * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Vocabulary Diversity</span>
                <span>{Math.round(growthMetrics.diversityScore * 100)}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${growthMetrics.diversityScore * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Vocabulary Breakdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="space-y-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Distribution */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries({
                basic: trackedWords.filter(w => w.category === 'basic').length,
                intermediate: trackedWords.filter(w => w.category === 'intermediate').length,
                advanced: trackedWords.filter(w => w.category === 'advanced').length,
                nuanced: trackedWords.filter(w => w.category === 'nuanced').length
              }).map(([category, count]) => (
                <div
                  key={category}
                  className={`p-2 rounded text-center text-xs ${getCategoryColor(category)}`}
                >
                  <div className="font-medium capitalize">{category}</div>
                  <div className="text-xs opacity-75">{count} words</div>
                </div>
              ))}
            </div>

            {/* Current Session Words */}
            <div>
              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Current Session</span>
              </h5>
              <div className="flex flex-wrap gap-1">
                {trackedWords.slice(0, 12).map((word, index) => (
                  <motion.span
                    key={word.word}
                    className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(word.category)}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    title={`${word.category} • ${word.sentiment} • used ${word.frequency}x`}
                  >
                    {getSentimentEmoji(word.sentiment)} {word.word}
                    {word.frequency > 1 && (
                      <span className="ml-1 text-xs opacity-75">×{word.frequency}</span>
                    )}
                  </motion.span>
                ))}
              </div>
              
              {trackedWords.length > 12 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  +{trackedWords.length - 12} more emotional words detected
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Growth Encouragement */}
      <motion.div
        className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          🌱 <strong>Growth insight:</strong> Your emotional vocabulary reflects your inner world's richness. 
          Each nuanced word you discover expands your capacity for self-understanding.
        </p>
      </motion.div>
    </div>
  );
};

export default EmotionalVocabularyTracker;