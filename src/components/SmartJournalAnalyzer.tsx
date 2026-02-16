'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/lib/storageKeys';

interface RealtimeInsight {
  id: string;
  type: 'emotion' | 'pattern' | 'suggestion' | 'milestone' | 'concern';
  message: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestion?: string;
}

interface EmotionalTone {
  primary: string;
  secondary?: string;
  intensity: number; // 0-1
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0-1 (calm to excited)
}

interface WritingMetrics {
  wordCount: number;
  sentimentScore: number;
  emotionalDepth: number;
  selfReflectionLevel: number;
  growthIndicators: string[];
  concernFlags: string[];
}

export default function SmartJournalAnalyzer({ 
  content, 
  onInsightGenerated,
  className = ''
}: { 
  content: string;
  onInsightGenerated?: (insights: RealtimeInsight[]) => void;
  className?: string;
}) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<RealtimeInsight[]>([]);
  const [emotionalTone, setEmotionalTone] = useState<EmotionalTone | null>(null);
  const [writingMetrics, setWritingMetrics] = useState<WritingMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnalyzedLength = useRef(0);

  // Real-time analysis as user types
  useEffect(() => {
    if (content.length > 50 && content.length !== lastAnalyzedLength.current) {
      // Debounce analysis to avoid excessive processing
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        performRealtimeAnalysis();
        lastAnalyzedLength.current = content.length;
      }, 1500);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content]);

  const performRealtimeAnalysis = async () => {
    if (content.length < 20) return;

    setIsAnalyzing(true);
    try {
      // Analyze emotional tone
      const tone = analyzeEmotionalTone(content);
      setEmotionalTone(tone);

      // Generate writing metrics
      const metrics = analyzeWritingMetrics(content);
      setWritingMetrics(metrics);

      // Generate real-time insights
      const newInsights = generateRealtimeInsights(content, tone, metrics);
      setInsights(newInsights);

      // Callback for parent component
      if (onInsightGenerated) {
        onInsightGenerated(newInsights);
      }

      // Store analysis for future reference
      storeAnalysisData({ content, tone, metrics, insights: newInsights });

    } catch (error) {
      console.error('Error in realtime analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeEmotionalTone = (text: string): EmotionalTone => {
    const words = text.toLowerCase().split(/\s+/);
    
    // Emotion detection lexicon (simplified)
    const emotionLexicon = {
      joy: ['happy', 'joyful', 'excited', 'elated', 'cheerful', 'delighted', 'thrilled', 'grateful', 'blessed', 'amazing'],
      sadness: ['sad', 'depressed', 'down', 'melancholy', 'sorrowful', 'grief', 'heartbroken', 'disappointed', 'blue'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'livid', 'pissed', 'outraged'],
      fear: ['afraid', 'scared', 'anxious', 'worried', 'nervous', 'terrified', 'panic', 'frightened', 'concerned'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'bewildered', 'stunned', 'unexpected'],
      disgust: ['disgusted', 'revolted', 'sick', 'nauseous', 'repulsed', 'appalled'],
      trust: ['trust', 'confident', 'secure', 'safe', 'comfortable', 'peaceful', 'calm', 'serene'],
      anticipation: ['hopeful', 'excited', 'eager', 'optimistic', 'looking forward', 'expecting']
    };

    // Calculate emotion scores
    const emotionScores: { [key: string]: number } = {};
    Object.entries(emotionLexicon).forEach(([emotion, emotionWords]) => {
      const score = emotionWords.reduce((count, word) => {
        return count + (words.filter(w => w.includes(word)).length);
      }, 0);
      emotionScores[emotion] = score;
    });

    // Find primary emotion
    const primary = Object.entries(emotionScores).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max, { emotion: 'neutral', score: 0 }
    ).emotion;

    // Find secondary emotion (second highest)
    const sortedEmotions = Object.entries(emotionScores)
      .sort(([,a], [,b]) => b - a)
      .filter(([emotion]) => emotion !== primary);
    
    const secondary = sortedEmotions.length > 0 && sortedEmotions[0][1] > 0 ? sortedEmotions[0][0] : undefined;

    // Calculate intensity (0-1)
    const totalEmotionWords = Object.values(emotionScores).reduce((sum, score) => sum + (score || 0), 0);
    const intensity = Math.min(totalEmotionWords / Math.max(words.length * 0.1, 1), 1);

    // Calculate valence (-1 to 1)
    const positiveEmotions = ['joy', 'trust', 'anticipation', 'surprise'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust'];
    
    const positiveScore = positiveEmotions.reduce((sum, emotion) => sum + (emotionScores[emotion] || 0), 0);
    const negativeScore = negativeEmotions.reduce((sum, emotion) => sum + (emotionScores[emotion] || 0), 0);
    
    const valence = totalEmotionWords > 0 ? 
      (positiveScore - negativeScore) / totalEmotionWords : 0;

    // Calculate arousal (0-1) - high arousal emotions vs low arousal
    const highArousalEmotions = ['anger', 'fear', 'joy', 'surprise'];
    const arousalScore = highArousalEmotions.reduce((sum, emotion) => sum + (emotionScores[emotion] || 0), 0);
    const arousal = Math.min(arousalScore / Math.max(totalEmotionWords, 1), 1);

    return {
      primary,
      secondary,
      intensity,
      valence: Math.max(-1, Math.min(1, valence)),
      arousal
    };
  };

  const analyzeWritingMetrics = (text: string): WritingMetrics => {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Word count
    const wordCount = words.length;

    // Sentiment analysis (simplified)
    const positiveWords = ['good', 'great', 'amazing', 'wonderful', 'happy', 'love', 'beautiful', 'perfect', 'excellent', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disgusting', 'worst', 'painful', 'difficult', 'struggling'];
    
    const positiveCount = words.filter(word => positiveWords.some(pos => word.toLowerCase().includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.toLowerCase().includes(neg))).length;
    
    const sentimentScore = wordCount > 0 ? (positiveCount - negativeCount) / wordCount : 0;

    // Emotional depth indicators
    const deepEmotionWords = ['feel', 'feeling', 'emotion', 'heart', 'soul', 'inside', 'deep', 'profound', 'intense'];
    const emotionalDepth = deepEmotionWords.filter(word => text.toLowerCase().includes(word)).length / Math.max(wordCount / 100, 1);

    // Self-reflection indicators
    const reflectionWords = ['realize', 'understand', 'learn', 'discover', 'insight', 'aware', 'notice', 'recognize', 'think', 'believe'];
    const selfReflectionLevel = reflectionWords.filter(word => text.toLowerCase().includes(word)).length / Math.max(wordCount / 100, 1);

    // Growth indicators
    const growthWords = ['grow', 'change', 'improve', 'better', 'progress', 'develop', 'evolve', 'transform', 'heal', 'overcome'];
    const growthIndicators = growthWords.filter(word => text.toLowerCase().includes(word));

    // Concern flags
    const concernWords = ['suicide', 'kill myself', 'end it all', 'hopeless', 'worthless', 'give up', 'can\'t go on'];
    const concernFlags = concernWords.filter(phrase => text.toLowerCase().includes(phrase));

    return {
      wordCount,
      sentimentScore: Math.max(-1, Math.min(1, sentimentScore)),
      emotionalDepth: Math.min(emotionalDepth, 1),
      selfReflectionLevel: Math.min(selfReflectionLevel, 1),
      growthIndicators,
      concernFlags
    };
  };

  const generateRealtimeInsights = (
    text: string, 
    tone: EmotionalTone, 
    metrics: WritingMetrics
  ): RealtimeInsight[] => {
    const insights: RealtimeInsight[] = [];

    // Emotional awareness insight
    if (tone.intensity > 0.3 && tone.primary !== 'neutral') {
      insights.push({
        id: `emotion_${Date.now()}`,
        type: 'emotion',
        message: `You're expressing strong ${tone.primary} in your writing${tone.secondary ? ` with hints of ${tone.secondary}` : ''}`,
        confidence: tone.intensity,
        priority: tone.intensity > 0.7 ? 'high' : 'medium',
        actionable: true,
        suggestion: tone.valence < -0.5 ? 
          'Consider what support or self-care you might need right now' :
          'This emotional awareness is valuable for your growth'
      });
    }

    // Growth recognition
    if (metrics.growthIndicators.length > 0) {
      insights.push({
        id: `growth_${Date.now()}`,
        type: 'milestone',
        message: `You're showing signs of personal growth and development`,
        confidence: 0.8,
        priority: 'medium',
        actionable: true,
        suggestion: 'Acknowledge this progress - growth takes courage and awareness'
      });
    }

    // Deep reflection recognition
    if (metrics.selfReflectionLevel > 0.4) {
      insights.push({
        id: `reflection_${Date.now()}`,
        type: 'pattern',
        message: 'You\'re engaging in meaningful self-reflection',
        confidence: metrics.selfReflectionLevel,
        priority: 'low',
        actionable: false
      });
    }

    // Length encouragement
    if (metrics.wordCount > 200) {
      insights.push({
        id: `length_${Date.now()}`,
        type: 'milestone',
        message: 'You\'re taking time to explore your thoughts deeply',
        confidence: 0.7,
        priority: 'low',
        actionable: false
      });
    }

    // Concern detection
    if (metrics.concernFlags.length > 0) {
      insights.push({
        id: `concern_${Date.now()}`,
        type: 'concern',
        message: 'Your writing suggests you might be going through a difficult time',
        confidence: 0.9,
        priority: 'high',
        actionable: true,
        suggestion: 'Consider reaching out to crisis support (988) or a trusted person'
      });
    }

    // Positive momentum
    if (metrics.sentimentScore > 0.3 && tone.valence > 0.2) {
      insights.push({
        id: `positive_${Date.now()}`,
        type: 'milestone',
        message: 'Your writing has a positive and hopeful tone',
        confidence: 0.8,
        priority: 'low',
        actionable: false
      });
    }

    // Suggestion for emotional processing
    if (tone.intensity > 0.6 && tone.valence < 0) {
      insights.push({
        id: `processing_${Date.now()}`,
        type: 'suggestion',
        message: 'Strong emotions are present in your writing',
        confidence: 0.8,
        priority: 'medium',
        actionable: true,
        suggestion: 'Consider a grounding exercise or reaching out for support'
      });
    }

    return insights.filter(insight => insight.confidence > 0.5);
  };

  const storeAnalysisData = (data: any) => {
    try {
      const analysisHistory = JSON.parse(getStorageItemWithFallback('writing_analysis_history') || '[]');
      analysisHistory.push({
        ...data,
        timestamp: new Date().toISOString(),
        userId: user?.uid || 'anonymous'
      });
      
      // Keep only last 20 analyses
      const recentAnalyses = analysisHistory.slice(-20);
      setStorageItemNormalized('writing_analysis_history', JSON.stringify(recentAnalyses));
    } catch (error) {
      console.error('Error storing analysis data:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      emotion: '💭',
      pattern: '🔍',
      suggestion: '💡',
      milestone: '🌟',
      concern: '⚠️'
    };
    return icons[type as keyof typeof icons] || '✨';
  };

  const getEmotionalToneColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: 'text-yellow-400',
      sadness: 'text-blue-400',
      anger: 'text-red-400',
      fear: 'text-purple-400',
      surprise: 'text-pink-400',
      disgust: 'text-green-400',
      trust: 'text-cyan-400',
      anticipation: 'text-orange-400',
      neutral: 'text-gray-400'
    };
    return colors[emotion] || 'text-gray-400';
  };

  if (content.length < 20) {
    return (
      <div className={`smart-journal-analyzer ${className}`}>
        <div className="text-center py-4">
          <div className="text-white/40 text-sm">
            ✨ AI analysis will appear as you write...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`smart-journal-analyzer ${className}`}>
      {/* Real-time Insights */}
      {insights.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-white/80 font-medium text-sm">✨ Live Insights</h4>
            {isAnalyzing && (
              <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          
          {insights.map(insight => (
            <div
              key={insight.id}
              className={`border-l-4 pl-4 py-2 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <p className="text-white/80 text-sm">{insight.message}</p>
                  {insight.suggestion && (
                    <p className="text-white/60 text-xs mt-1 italic">💡 {insight.suggestion}</p>
                  )}
                </div>
                <div className="text-white/40 text-xs">
                  {Math.round((insight.confidence || 0) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emotional Tone & Metrics Summary */}
      {(emotionalTone || writingMetrics) && (
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/80 font-medium text-sm">📊 Writing Analysis</h4>
            <button
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className="text-white/60 hover:text-white text-xs"
            >
              {showDetailedAnalysis ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {emotionalTone && (
              <div>
                <div className="text-white/70 text-xs mb-1">Emotional Tone</div>
                <div className={`${getEmotionalToneColor(emotionalTone.primary)} text-sm font-medium capitalize`}>
                  {emotionalTone.primary}
                  {emotionalTone.secondary && (
                    <span className="text-white/60"> + {emotionalTone.secondary}</span>
                  )}
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, (emotionalTone.intensity || 0) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {writingMetrics && (
              <div>
                <div className="text-white/70 text-xs mb-1">Word Count</div>
                <div className="text-white text-sm font-medium">
                  {writingMetrics.wordCount} words
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {writingMetrics.wordCount > 150 ? 'Detailed entry' : writingMetrics.wordCount > 50 ? 'Good length' : 'Getting started'}
                </div>
              </div>
            )}
          </div>

          {showDetailedAnalysis && emotionalTone && writingMetrics && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-white/70 text-xs mb-2">Emotional Metrics</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Valence</span>
                    <span className={emotionalTone.valence > 0 ? 'text-green-400' : 'text-red-400'}>
                      {emotionalTone.valence > 0 ? '+' : ''}{(emotionalTone.valence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Intensity</span>
                    <span className="text-purple-400">{(emotionalTone.intensity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Arousal</span>
                    <span className="text-blue-400">{(emotionalTone.arousal * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-white/70 text-xs mb-2">Reflection Depth</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Self-Reflection</span>
                    <span className="text-cyan-400">{(writingMetrics.selfReflectionLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Emotional Depth</span>
                    <span className="text-pink-400">{(writingMetrics.emotionalDepth * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Sentiment</span>
                    <span className={writingMetrics.sentimentScore > 0 ? 'text-green-400' : writingMetrics.sentimentScore < 0 ? 'text-red-400' : 'text-gray-400'}>
                      {writingMetrics.sentimentScore > 0 ? '+' : ''}{(writingMetrics.sentimentScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
