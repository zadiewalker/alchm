/**
 * ALCHM Breakthrough Detection System
 * 
 * Automated milestone recognition that celebrates meaningful progress
 * without creating pressure. Detects therapeutic breakthroughs through
 * sophisticated content analysis and pattern recognition.
 * 
 * This system recognizes healing moments users might miss themselves.
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { therapeuticMomentumEngine, type ProgressInsight } from '@/lib/retention/therapeutic-momentum-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Heart, 
  TrendingUp, 
  Compass, 
  Brain,
  Sparkles,
  Mountain,
  Sunrise,
  Flower,
  Shield
} from 'lucide-react';

interface BreakthroughPattern {
  id: string;
  name: string;
  description: string;
  patterns: RegExp[];
  significance: number;
  category: 'self_awareness' | 'emotional_regulation' | 'relationship_insight' | 'pattern_recognition' | 'self_compassion' | 'future_vision';
  icon: React.ReactNode;
  celebrationStyle: 'gentle' | 'celebratory' | 'profound';
}

interface DetectedBreakthrough {
  id: string;
  pattern: BreakthroughPattern;
  confidence: number;
  evidence: string[];
  context: string;
  timestamp: Date;
  userAcknowledged: boolean;
  journalEntryId: string;
}

interface MilestoneThreshold {
  type: string;
  thresholds: { value: number; celebration: string; significance: number }[];
}

const breakthroughPatterns: BreakthroughPattern[] = [
  {
    id: 'self_awareness_breakthrough',
    name: 'Self-Awareness Breakthrough',
    description: 'Recognizing personal patterns and behaviors',
    patterns: [
      /I (realize|notice|see) that I/gi,
      /I'm starting to understand (myself|why)/gi,
      /I keep (doing|thinking|feeling)/gi,
      /This pattern of/gi,
      /I'm aware that/gi
    ],
    significance: 75,
    category: 'self_awareness',
    icon: <Lightbulb className="w-5 h-5" />,
    celebrationStyle: 'celebratory'
  },
  {
    id: 'emotional_regulation_milestone',
    name: 'Emotional Regulation Growth',
    description: 'Learning to manage emotions more effectively',
    patterns: [
      /I'm getting better at/gi,
      /I can (pause|breathe|step back)/gi,
      /Instead of (reacting|panicking|spiraling)/gi,
      /I'm learning to/gi,
      /I handled (this|that) differently/gi
    ],
    significance: 80,
    category: 'emotional_regulation',
    icon: <Heart className="w-5 h-5" />,
    celebrationStyle: 'celebratory'
  },
  {
    id: 'relationship_insight',
    name: 'Relationship Insight',
    description: 'Understanding relationship dynamics and boundaries',
    patterns: [
      /I deserve (better|respect|love)/gi,
      /(healthy|unhealthy) (relationship|boundary)/gi,
      /I'm setting (boundaries|limits)/gi,
      /I won't (accept|tolerate)/gi,
      /This relationship (dynamic|pattern)/gi
    ],
    significance: 85,
    category: 'relationship_insight',
    icon: <Shield className="w-5 h-5" />,
    celebrationStyle: 'profound'
  },
  {
    id: 'pattern_recognition',
    name: 'Pattern Recognition',
    description: 'Connecting dots between thoughts, feelings, and behaviors',
    patterns: [
      /Every time I/gi,
      /The pattern is/gi,
      /This reminds me of/gi,
      /I see the connection/gi,
      /It's not a coincidence/gi
    ],
    significance: 70,
    category: 'pattern_recognition',
    icon: <Compass className="w-5 h-5" />,
    celebrationStyle: 'celebratory'
  },
  {
    id: 'self_compassion_growth',
    name: 'Self-Compassion Breakthrough',
    description: 'Developing kindness toward oneself',
    patterns: [
      /I forgive myself/gi,
      /I'm (human|learning|growing)/gi,
      /It's okay (to|that)/gi,
      /I'm being too hard on myself/gi,
      /I deserve (compassion|kindness|grace)/gi
    ],
    significance: 90,
    category: 'self_compassion',
    icon: <Flower className="w-5 h-5" />,
    celebrationStyle: 'profound'
  },
  {
    id: 'future_vision',
    name: 'Future Vision Clarity',
    description: 'Seeing possibilities and hope for the future',
    patterns: [
      /I can (see|imagine|envision)/gi,
      /I want to (become|create|build)/gi,
      /My future (self|life)/gi,
      /I'm excited (about|for)/gi,
      /There's hope/gi
    ],
    significance: 85,
    category: 'future_vision',
    icon: <Sunrise className="w-5 h-5" />,
    celebrationStyle: 'profound'
  }
];

const milestoneThresholds: MilestoneThreshold[] = [
  {
    type: 'journal_entries',
    thresholds: [
      { value: 1, celebration: 'Your first reflection - what courage!', significance: 60 },
      { value: 5, celebration: 'Five entries of self-discovery', significance: 65 },
      { value: 10, celebration: 'Ten moments of brave introspection', significance: 70 },
      { value: 25, celebration: 'Building a meaningful practice', significance: 75 },
      { value: 50, celebration: 'Fifty times you\'ve chosen growth', significance: 80 },
      { value: 100, celebration: 'A hundred windows into your soul', significance: 85 }
    ]
  },
  {
    type: 'consecutive_days',
    thresholds: [
      { value: 3, celebration: 'Three days of showing up for yourself', significance: 55 },
      { value: 7, celebration: 'A week of consistent self-care', significance: 65 },
      { value: 14, celebration: 'Two weeks of building new habits', significance: 70 },
      { value: 30, celebration: 'A month of courageous reflection', significance: 80 },
      { value: 60, celebration: 'Two months of dedicated growth', significance: 85 }
    ]
  },
  {
    type: 'emotional_vocabulary',
    thresholds: [
      { value: 10, celebration: 'Discovering new ways to express yourself', significance: 60 },
      { value: 25, celebration: 'Your emotional vocabulary is flourishing', significance: 70 },
      { value: 50, celebration: 'Fifty shades of emotional awareness', significance: 80 }
    ]
  }
];

export default function BreakthroughDetection({
  journalEntry,
  onBreakthroughDetected,
  enableRealTimeDetection = true,
  celebrationMode = 'gentle'
}: {
  journalEntry?: any;
  onBreakthroughDetected?: (breakthrough: DetectedBreakthrough) => void;
  enableRealTimeDetection?: boolean;
  celebrationMode?: 'gentle' | 'visible' | 'silent';
}) {
  const { user } = useAuth();
  const [detectedBreakthroughs, setDetectedBreakthroughs] = useState<DetectedBreakthrough[]>([]);
  const [showBreakthrough, setShowBreakthrough] = useState(false);
  const [currentBreakthrough, setCurrentBreakthrough] = useState<DetectedBreakthrough | null>(null);
  const [userStats, setUserStats] = useState<any>(null);

  /**
   * Analyze journal entry for breakthroughs
   */
  const analyzeForBreakthroughs = useCallback(async (entry: any) => {
    if (!entry?.content || !user?.uid) return;

    const detectedBreakthroughs: DetectedBreakthrough[] = [];
    const content = entry.content.toLowerCase();

    // Check each pattern
    for (const pattern of breakthroughPatterns) {
      const evidence: string[] = [];
      let totalMatches = 0;

      for (const regex of pattern.patterns) {
        const matches = content.match(regex);
        if (matches) {
          totalMatches += matches.length;
          evidence.push(...matches.map(match => match.trim()));
        }
      }

      if (totalMatches > 0) {
        const confidence = Math.min(100, (totalMatches / pattern.patterns.length) * 100);
        
        if (confidence >= 50) { // Threshold for breakthrough detection
          const breakthrough: DetectedBreakthrough = {
            id: `${pattern.id}_${Date.now()}_${Math.random()}`,
            pattern,
            confidence,
            evidence: [...new Set(evidence)], // Remove duplicates
            context: extractContext(entry.content, evidence[0]),
            timestamp: new Date(),
            userAcknowledged: false,
            journalEntryId: entry.id
          };

          detectedBreakthroughs.push(breakthrough);
        }
      }
    }

    // Process detected breakthroughs
    if (detectedBreakthroughs.length > 0) {
      setDetectedBreakthroughs(prev => [...prev, ...detectedBreakthroughs]);
      
      // Trigger callbacks
      detectedBreakthroughs.forEach(breakthrough => {
        onBreakthroughDetected?.(breakthrough);
      });

      // Show celebration for highest significance breakthrough
      if (enableRealTimeDetection && celebrationMode !== 'silent') {
        const mostSignificant = detectedBreakthroughs.reduce((max, current) => 
          current.pattern.significance > max.pattern.significance ? current : max
        );
        showBreakthroughCelebration(mostSignificant);
      }

      // Save to therapeutic momentum engine
      for (const breakthrough of detectedBreakthroughs) {
        await saveBreakthrough(breakthrough);
      }
    }
  }, [user?.uid, onBreakthroughDetected, enableRealTimeDetection, celebrationMode]);

  /**
   * Check for milestone achievements
   */
  const checkMilestones = useCallback(async () => {
    if (!user?.uid || !userStats) return;

    const achievedMilestones: DetectedBreakthrough[] = [];

    for (const milestoneType of milestoneThresholds) {
      const currentValue = userStats[milestoneType.type] || 0;
      
      for (const threshold of milestoneType.thresholds) {
        if (currentValue >= threshold.value) {
          // Check if this milestone was already achieved
          const existingMilestone = detectedBreakthroughs.find(b => 
            b.pattern.name === `${milestoneType.type}_${threshold.value}`
          );

          if (!existingMilestone) {
            const milestoneBreakthrough: DetectedBreakthrough = {
              id: `milestone_${milestoneType.type}_${threshold.value}_${Date.now()}`,
              pattern: {
                id: `${milestoneType.type}_${threshold.value}`,
                name: `${milestoneType.type}_${threshold.value}`,
                description: threshold.celebration,
                patterns: [],
                significance: threshold.significance,
                category: 'self_awareness',
                icon: <Mountain className="w-5 h-5" />,
                celebrationStyle: threshold.significance > 75 ? 'profound' : 'celebratory'
              },
              confidence: 100,
              evidence: [`Achieved ${threshold.value} ${milestoneType.type}`],
              context: threshold.celebration,
              timestamp: new Date(),
              userAcknowledged: false,
              journalEntryId: 'milestone'
            };

            achievedMilestones.push(milestoneBreakthrough);
          }
        }
      }
    }

    if (achievedMilestones.length > 0) {
      setDetectedBreakthroughs(prev => [...prev, ...achievedMilestones]);
      
      // Show celebration for milestones
      if (celebrationMode !== 'silent') {
        showBreakthroughCelebration(achievedMilestones[0]);
      }
    }
  }, [user?.uid, userStats, detectedBreakthroughs, celebrationMode]);

  /**
   * Load user statistics for milestone checking
   */
  const loadUserStats = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const momentum = await therapeuticMomentumEngine.calculateMomentum(user.uid);
      setUserStats({
        journal_entries: momentum.totalSessions,
        consecutive_days: momentum.consecutiveDays,
        emotional_vocabulary: momentum.emotionalVocabularyGrowth,
        breakthroughs: momentum.breakthroughMoments
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, [user?.uid]);

  /**
   * Extract context around a matched phrase
   */
  const extractContext = (content: string, evidence: string): string => {
    const index = content.toLowerCase().indexOf(evidence.toLowerCase());
    if (index === -1) return evidence;

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + evidence.length + 50);
    
    return content.slice(start, end).trim();
  };

  /**
   * Save breakthrough to database
   */
  const saveBreakthrough = async (breakthrough: DetectedBreakthrough) => {
    try {
      // Would save to Firestore in production
      console.log('Breakthrough detected:', breakthrough);
    } catch (error) {
      console.error('Error saving breakthrough:', error);
    }
  };

  /**
   * Show breakthrough celebration
   */
  const showBreakthroughCelebration = (breakthrough: DetectedBreakthrough) => {
    if (currentBreakthrough) return; // Don't interrupt existing celebration

    setCurrentBreakthrough(breakthrough);
    setShowBreakthrough(true);

    // Auto-hide after appropriate duration
    const duration = breakthrough.pattern.celebrationStyle === 'profound' ? 8000 : 
                    breakthrough.pattern.celebrationStyle === 'celebratory' ? 5000 : 3000;

    setTimeout(() => {
      setShowBreakthrough(false);
      setTimeout(() => setCurrentBreakthrough(null), 300);
    }, duration);
  };

  /**
   * Handle manual breakthrough acknowledgment
   */
  const acknowledgeBreakthrough = (breakthroughId: string) => {
    setDetectedBreakthroughs(prev => 
      prev.map(b => b.id === breakthroughId ? { ...b, userAcknowledged: true } : b)
    );
  };

  // Effects
  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  useEffect(() => {
    if (userStats) {
      checkMilestones();
    }
  }, [userStats, checkMilestones]);

  useEffect(() => {
    if (journalEntry && enableRealTimeDetection) {
      analyzeForBreakthroughs(journalEntry);
    }
  }, [journalEntry, analyzeForBreakthroughs, enableRealTimeDetection]);

  // Silent mode - no UI
  if (celebrationMode === 'silent') {
    return null;
  }

  return (
    <div className="breakthrough-detection">
      {/* Breakthrough Celebration Modal */}
      <AnimatePresence>
        {showBreakthrough && currentBreakthrough && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBreakthrough(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <BreakthroughCelebrationCard 
                breakthrough={currentBreakthrough}
                onAcknowledge={() => {
                  acknowledgeBreakthrough(currentBreakthrough.id);
                  setShowBreakthrough(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gentle Mode - Small Indicators */}
      {celebrationMode === 'gentle' && (
        <div className="space-y-2">
          {detectedBreakthroughs
            .filter(b => !b.userAcknowledged)
            .slice(0, 3)
            .map(breakthrough => (
              <div 
                key={breakthrough.id}
                className="flex items-center space-x-2 text-xs text-gray-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100"
              >
                <div className="text-amber-600">{breakthrough.pattern.icon}</div>
                <span className="flex-1">{breakthrough.pattern.description}</span>
                <button
                  onClick={() => acknowledgeBreakthrough(breakthrough.id)}
                  className="text-amber-700 hover:text-amber-800 text-xs"
                >
                  ✓
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/**
 * Breakthrough Celebration Card Component
 */
const BreakthroughCelebrationCard = ({ 
  breakthrough, 
  onAcknowledge 
}: { 
  breakthrough: DetectedBreakthrough;
  onAcknowledge: () => void;
}) => {
  const getCardStyle = () => {
    switch (breakthrough.pattern.celebrationStyle) {
      case 'profound':
        return 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200';
      case 'celebratory':
        return 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200';
      default:
        return 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200';
    }
  };

  const getTextColor = () => {
    switch (breakthrough.pattern.celebrationStyle) {
      case 'profound':
        return 'text-purple-900';
      case 'celebratory':
        return 'text-emerald-900';
      default:
        return 'text-amber-900';
    }
  };

  const getIconColor = () => {
    switch (breakthrough.pattern.celebrationStyle) {
      case 'profound':
        return 'text-purple-600';
      case 'celebratory':
        return 'text-emerald-600';
      default:
        return 'text-amber-600';
    }
  };

  return (
    <div className={`rounded-2xl border-2 p-6 shadow-xl backdrop-blur-sm ${getCardStyle()}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 mb-3 ${getIconColor()}`}>
          {breakthrough.pattern.icon}
        </div>
        <h3 className={`text-lg font-medium ${getTextColor()} mb-1`}>
          Breakthrough Detected!
        </h3>
        <p className={`text-sm ${getTextColor()}/80`}>
          {breakthrough.pattern.description}
        </p>
      </div>

      {/* Evidence */}
      {breakthrough.evidence.length > 0 && (
        <div className="mb-4">
          <p className={`text-xs ${getTextColor()}/60 mb-2`}>What we noticed:</p>
          <div className="bg-white/60 rounded-lg p-3">
            <p className={`text-sm italic ${getTextColor()}`}>
              "{breakthrough.context}"
            </p>
          </div>
        </div>
      )}

      {/* Confidence & Significance */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className={`w-4 h-4 ${getIconColor()}`} />
          <span className={`text-xs ${getTextColor()}/80`}>
            Significance: {breakthrough.pattern.significance}%
          </span>
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: Math.ceil(breakthrough.confidence / 25) }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${getIconColor().replace('text-', 'bg-')}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={onAcknowledge}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            breakthrough.pattern.celebrationStyle === 'profound' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : breakthrough.pattern.celebrationStyle === 'celebratory'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          Celebrate This Growth
        </button>
      </div>
    </div>
  );
};

/**
 * Breakthrough History Component
 */
export const BreakthroughHistory = ({ 
  breakthroughs 
}: { 
  breakthroughs: DetectedBreakthrough[] 
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Your Growth Journey</h4>
      
      {breakthroughs.length === 0 ? (
        <p className="text-xs text-gray-500">
          Your breakthroughs will appear here as they're discovered
        </p>
      ) : (
        <div className="space-y-2">
          {breakthroughs
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
            .map(breakthrough => (
              <div 
                key={breakthrough.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-gray-600">{breakthrough.pattern.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">
                    {breakthrough.pattern.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {breakthrough.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {breakthrough.pattern.significance}%
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};