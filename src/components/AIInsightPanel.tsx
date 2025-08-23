// AI Insight Panel - Trauma-Informed Insights with Tier-Based Features
// Displays personalized AI insights with safety validation and tier-specific features

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  TrendingUp, 
  Shield, 
  Sparkles,
  MessageCircle,
  BookOpen,
  Target,
  Star,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Users,
  Crown,
  Zap
} from 'lucide-react';
import { AIInsight } from '@/types/firestore-schema';
import { TierFeatureGate } from './TierFeatureGate';

interface AIInsightPanelProps {
  insight: AIInsight;
  userTier: 'free' | 'deep-cut' | 'oracle';
  onClose: () => void;
  onFeedback?: (rating: number, feedback?: string) => void;
  onActionTaken?: (action: string) => void;
}

export function AIInsightPanel({ 
  insight, 
  userTier, 
  onClose, 
  onFeedback, 
  onActionTaken 
}: AIInsightPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'reflection' | 'actions' | 'patterns' | 'mentor'>('reflection');
  const [userRating, setUserRating] = useState<number | null>(insight.userRating || null);
  const [actionsTaken, setActionsTaken] = useState<string[]>(insight.actionsTaken || []);
  const [showMentorChat, setShowMentorChat] = useState(false);
  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  // Animation state for entrance
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    onFeedback?.(rating);
  };

  const handleActionClick = (action: string, index: number) => {
    if (!actionsTaken.includes(action)) {
      const newActions = [...actionsTaken, action];
      setActionsTaken(newActions);
      onActionTaken?.(action);
    }
    setExpandedAction(expandedAction === index ? null : index);
  };

  const getPersonalizationScore = () => {
    return Math.round(insight.personalizedScore * 100);
  };

  const getRiskLevelColor = () => {
    switch (insight.riskAssessment) {
      case 'high': return 'text-red-400 border-red-400';
      case 'moderate': return 'text-yellow-400 border-yellow-400';
      default: return 'text-green-400 border-green-400';
    }
  };

  const getQualityIndicators = () => {
    const indicators = [];
    
    if (insight.traumaInformed) {
      indicators.push({ label: 'Trauma-Informed', icon: Shield, color: 'text-purple-400' });
    }
    if (insight.personalizedScore > 0.8) {
      indicators.push({ label: 'Highly Personalized', icon: Target, color: 'text-blue-400' });
    }
    if (insight.celebrationMoment) {
      indicators.push({ label: 'Celebration Moment', icon: Sparkles, color: 'text-yellow-400' });
    }
    
    return indicators;
  };

  const getAdvancedActions = () => {
    // Tier-specific advanced actions
    const baseActions = insight.suggestedActions || [];
    
    if (userTier === 'oracle') {
      return [
        ...baseActions,
        'Schedule AI mentor session to explore this further',
        'Share insight with your inner circle for support',
        'Integrate this reflection into your leadership development plan'
      ];
    } else if (userTier === 'deep-cut') {
      return [
        ...baseActions,
        'Review your pattern analysis for similar themes',
        'Export this insight for deeper reflection',
        'Set up a reminder to revisit this insight in a week'
      ];
    }
    
    return baseActions;
  };

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-slate-700 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">AI Insights</h2>
                <Badge 
                  variant="outline" 
                  className={`${getRiskLevelColor()} border-opacity-50`}
                >
                  {insight.riskAssessment} risk
                </Badge>
              </div>
              <Button 
                onClick={onClose}
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            {/* Quality indicators */}
            <div className="flex flex-wrap gap-2 mb-4">
              {getQualityIndicators().map((indicator, index) => (
                <div key={index} className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-800/50 rounded-full">
                  <indicator.icon className={`h-3 w-3 ${indicator.color}`} />
                  <span className="text-gray-300">{indicator.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-800/50 rounded-full">
                <Target className="h-3 w-3 text-blue-400" />
                <span className="text-gray-300">{getPersonalizationScore()}% personalized</span>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedTab('reflection')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTab === 'reflection' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Reflection
              </button>
              <button
                onClick={() => setSelectedTab('actions')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTab === 'actions' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Actions ({getAdvancedActions().length})
              </button>
              
              <TierFeatureGate userTier={userTier} requiredTier="deep-cut">
                <button
                  onClick={() => setSelectedTab('patterns')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTab === 'patterns' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Patterns
                </button>
              </TierFeatureGate>

              <TierFeatureGate userTier={userTier} requiredTier="oracle">
                <button
                  onClick={() => setSelectedTab('mentor')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTab === 'mentor' 
                      ? 'bg-gold-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Crown className="h-3 w-3 mr-1 inline" />
                  AI Mentor
                </button>
              </TierFeatureGate>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTab === 'reflection' && (
              <div className="space-y-6">
                {/* Main reflection */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-pink-400" />
                      Your Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {insight.reflection}
                    </p>
                    
                    {insight.celebrationMoment && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium text-yellow-300">Celebration Moment!</span>
                        </div>
                        <p className="text-yellow-200/80 text-sm">
                          This entry shows significant growth and breakthrough thinking. Take a moment to acknowledge your progress!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mood prediction */}
                {insight.moodPrediction && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">Predicted mood improvement</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                          +{(insight.moodPrediction - 5).toFixed(1)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Based on your reflection patterns, we predict your mood may improve by this amount.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {selectedTab === 'actions' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-medium text-white">Suggested Actions</h3>
                </div>
                
                {getAdvancedActions().map((action, index) => (
                  <Card 
                    key={index} 
                    className={`bg-slate-800/50 border-slate-700 transition-all duration-200 cursor-pointer hover:border-purple-500/50 ${
                      actionsTaken.includes(action) ? 'border-green-500/50 bg-green-900/10' : ''
                    }`}
                    onClick={() => handleActionClick(action, index)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {actionsTaken.includes(action) ? (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-600 rounded-full"></div>
                          )}
                          <span className={`${actionsTaken.includes(action) ? 'text-green-300' : 'text-gray-300'}`}>
                            {action}
                          </span>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                          expandedAction === index ? 'rotate-90' : ''
                        }`} />
                      </div>
                      
                      {expandedAction === index && (
                        <div className="mt-3 pl-8 text-sm text-gray-400">
                          <p>Click to mark this action as completed and track your progress.</p>
                          {index >= 3 && userTier !== 'free' && (
                            <p className="mt-1 text-purple-300">
                              ✨ This is a premium feature available to {userTier} tier users.
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <TierFeatureGate userTier={userTier} requiredTier="deep-cut">
              {selectedTab === 'patterns' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-medium text-white">Pattern Analysis</h3>
                  </div>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-purple-300 mb-2">Recurring Themes</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Growth mindset', 'Relationship focus', 'Work-life balance', 'Self-reflection'].map((theme, index) => (
                              <Badge key={index} variant="outline" className="border-purple-400 text-purple-300">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-blue-300 mb-2">Emotional Patterns</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Gratitude frequency</span>
                              <span className="text-green-400">↑ 23% this month</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Stress mentions</span>
                              <span className="text-yellow-400">→ Stable</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Breakthrough moments</span>
                              <span className="text-green-400">↑ 40% this month</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TierFeatureGate>

            <TierFeatureGate userTier={userTier} requiredTier="oracle">
              {selectedTab === 'mentor' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-gold-400" />
                    <h3 className="text-lg font-medium text-white">AI Mentor</h3>
                    <Badge className="bg-gold-600/20 border-gold-400 text-gold-300">
                      Oracle Exclusive
                    </Badge>
                  </div>
                  
                  <Card className="bg-gradient-to-r from-gold-900/20 to-amber-900/20 border border-gold-500/30">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <MessageCircle className="h-12 w-12 text-gold-400 mx-auto mb-2" />
                        <h4 className="font-medium text-gold-300 mb-1">Ready for a deeper conversation?</h4>
                        <p className="text-sm text-gold-200/80">
                          Your AI mentor can help you explore this insight further and connect it to your leadership journey.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => setShowMentorChat(true)}
                        className="w-full bg-gold-600 hover:bg-gold-700 text-black font-medium"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Mentor Session
                      </Button>
                      
                      <div className="mt-4 space-y-2 text-xs text-gold-200/60">
                        <p>• Personalized coaching based on your insights</p>
                        <p>• Leadership development guidance</p>
                        <p>• Strategic thinking support</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TierFeatureGate>
          </div>

          {/* Footer with rating */}
          <div className="border-t border-slate-700 p-6 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">How helpful was this insight?</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(rating)}
                      className={`p-1 rounded transition-colors ${
                        userRating && rating <= userRating
                          ? 'text-yellow-400'
                          : 'text-gray-600 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="h-4 w-4" fill={userRating && rating <= userRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Zap className="h-3 w-3" />
                <span>Processed in {insight.processingTimeMs}ms</span>
              </div>
            </div>
            
            {userRating && (
              <p className="text-xs text-green-400 mt-2">
                Thank you for your feedback! This helps us improve our insights.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}