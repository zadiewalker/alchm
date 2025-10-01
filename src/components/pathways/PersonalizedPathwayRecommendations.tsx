'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Brain,
  Heart,
  Compass,
  Shield,
  ChevronRight,
  Star,
  Leaf
} from 'lucide-react';

interface UserProgress {
  totalPathwaysStarted: number;
  totalPathwaysCompleted: number;
  currentlyActive: number;
  weeklyProgress: number;
  healingMomentum: 'emerging' | 'growing' | 'blooming' | 'flourishing';
  communityContributions: number;
  peerConnectionsCount: number;
  storiesShared: number;
  milestonesAchieved: number;
  healingStreak: number;
  milestones: Array<{
    id: string;
    title: string;
    achievedAt: Date;
    category: string;
    communityRecognition?: number;
  }>;
}

interface PathwayRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Foundation' | 'Growth' | 'Advanced' | 'Guided';
  matchScore: number;
  reasoning: string[];
  aiInsights: string;
  communitySupport: {
    activeMembers: number;
    completionRate: number;
    avgRating: number;
    recentStories: number;
  };
  personalizedAdaptations: string[];
  nextSteps: string[];
  therapeuticBenefits: string[];
  culturalConsiderations?: string[];
  traumaInformed: boolean;
  professionalGuidance?: boolean;
  icon: string;
  gradient: string;
}

interface PersonalizedPathwayRecommendationsProps {
  userProgress: UserProgress | null;
}

export function PersonalizedPathwayRecommendations({ userProgress }: PersonalizedPathwayRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PathwayRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    // Simulate AI-driven pathway recommendations based on user progress
    setTimeout(() => {
      const mockRecommendations: PathwayRecommendation[] = [
        {
          id: 'emotional-regulation-focus',
          title: 'Emotional Regulation Mastery',
          description: 'Advanced techniques for managing emotional intensity and building resilience',
          category: 'Emotional Regulation Garden',
          duration: '6 weeks',
          difficulty: 'Growth',
          matchScore: 94,
          reasoning: [
            'Your recent writing patterns show increased emotional awareness',
            'Strong foundation in mindfulness from completed pathway',
            'Community peers report this as highly transformative',
            'Optimal timing based on your current healing momentum'
          ],
          aiInsights: "Based on your journal entries, you've developed strong emotional awareness. This pathway builds on that foundation to help you regulate emotions more effectively, particularly during stress. Your consistent engagement and growing healing momentum indicate readiness for this growth-level challenge.",
          communitySupport: {
            activeMembers: 847,
            completionRate: 89,
            avgRating: 4.7,
            recentStories: 23
          },
          personalizedAdaptations: [
            'Extended reflection periods based on your writing style',
            'Integration with your existing mindfulness practice',
            'Community mentorship from similar healing paths',
            'Trauma-informed modifications for safety'
          ],
          nextSteps: [
            'Complete emotional awareness assessment',
            'Join peer support circle for this pathway',
            'Set personalized regulation goals',
            'Begin with gentle stress response techniques'
          ],
          therapeuticBenefits: [
            'Improved stress management',
            'Enhanced emotional resilience',
            'Better relationship communication',
            'Reduced anxiety and reactivity'
          ],
          traumaInformed: true,
          icon: '🌿',
          gradient: 'from-blue-400/20 to-teal-600/20'
        },
        {
          id: 'community-connection',
          title: 'Empathy & Connection Circle',
          description: 'Deepen your capacity for meaningful relationships and community engagement',
          category: 'Connection Grove',
          duration: '4 weeks',
          difficulty: 'Foundation',
          matchScore: 87,
          reasoning: [
            'Your community contributions show readiness for deeper connection',
            'Writing patterns indicate desire for meaningful relationships',
            'Strong emotional foundation supports relationship growth',
            'Peer feedback suggests you\'d benefit from connection skills'
          ],
          aiInsights: "Your increasing community engagement and the empathy evident in your journal reflections suggest you're ready to deepen your connection skills. This pathway will help you build stronger, more authentic relationships while maintaining healthy boundaries.",
          communitySupport: {
            activeMembers: 923,
            completionRate: 91,
            avgRating: 4.8,
            recentStories: 31
          },
          personalizedAdaptations: [
            'Focus on authentic vulnerability techniques',
            'Integration with your peer support activities',
            'Emphasis on digital boundary setting',
            'Cultural sensitivity for diverse connections'
          ],
          nextSteps: [
            'Assess current relationship patterns',
            'Practice active listening techniques',
            'Join empathy-building peer exercises',
            'Set healthy communication goals'
          ],
          therapeuticBenefits: [
            'Stronger interpersonal relationships',
            'Improved communication skills',
            'Enhanced emotional intelligence',
            'Reduced social anxiety'
          ],
          traumaInformed: true,
          icon: '🌳',
          gradient: 'from-purple-400/20 to-indigo-600/20'
        },
        {
          id: 'purpose-alignment',
          title: 'Life Purpose Discovery',
          description: 'Align your actions with your deeper calling and values',
          category: 'Purpose Meadow',
          duration: '7 weeks',
          difficulty: 'Growth',
          matchScore: 82,
          reasoning: [
            'Your reflective writing shows deep questioning about meaning',
            'Completion of self-awareness pathway provides strong foundation',
            'Community engagement patterns suggest readiness for purpose work',
            'Optimal moment in your healing journey for meaning-making'
          ],
          aiInsights: "Your journal entries reveal a growing sense of wanting to align your life with deeper meaning. Having built emotional awareness, you're now ready to explore how your values can guide your actions and choices.",
          communitySupport: {
            activeMembers: 654,
            completionRate: 86,
            avgRating: 4.6,
            recentStories: 18
          },
          personalizedAdaptations: [
            'Integration with your existing values exploration',
            'Focus on action-oriented goal setting',
            'Community mentorship for purpose discovery',
            'Flexible pacing for deep reflection'
          ],
          nextSteps: [
            'Complete comprehensive values assessment',
            'Explore meaning-making through writing',
            'Connect with purpose-focused peer group',
            'Create personal mission statement'
          ],
          therapeuticBenefits: [
            'Increased life satisfaction',
            'Better decision-making alignment',
            'Enhanced motivation and direction',
            'Greater sense of fulfillment'
          ],
          traumaInformed: true,
          icon: '🌻',
          gradient: 'from-yellow-400/20 to-gold-600/20'
        },
        {
          id: 'trauma-recovery',
          title: 'Gentle Trauma Recovery',
          description: 'Trauma-informed healing with professional guidance and peer support',
          category: 'Resilience Forest',
          duration: '8 weeks',
          difficulty: 'Guided',
          matchScore: 78,
          reasoning: [
            'Your healing momentum indicates readiness for deeper work',
            'Strong community connections provide necessary support',
            'Professional guidance available for safety',
            'Peer group has excellent safety record'
          ],
          aiInsights: "While your foundation work has been excellent, your writing patterns suggest some deeper healing work may be beneficial. This pathway is designed with maximum safety measures and professional oversight.",
          communitySupport: {
            activeMembers: 412,
            completionRate: 93,
            avgRating: 4.9,
            recentStories: 15
          },
          personalizedAdaptations: [
            'Individualized pacing based on your comfort',
            'Enhanced safety protocols and check-ins',
            'Professional guidance integration',
            'Flexible withdrawal options at any time'
          ],
          nextSteps: [
            'Consult with professional guidance team',
            'Complete comprehensive safety assessment',
            'Join specialized peer support circle',
            'Establish personal safety plan'
          ],
          therapeuticBenefits: [
            'Reduced trauma-related symptoms',
            'Improved emotional regulation',
            'Enhanced sense of safety',
            'Greater life integration'
          ],
          culturalConsiderations: [
            'Culturally sensitive trauma approaches',
            'Integration with traditional healing practices',
            'Community-specific support options'
          ],
          traumaInformed: true,
          professionalGuidance: true,
          icon: '🌲',
          gradient: 'from-amber-400/20 to-orange-600/20'
        }
      ];

      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 800);
  }, [userProgress]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Foundation': return 'text-green-400';
      case 'Growth': return 'text-blue-400';
      case 'Advanced': return 'text-purple-400';
      case 'Guided': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="mb-16">
        <Card className="bg-white/5 backdrop-blur-sm border-white/20 border">
          <div className="p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <Brain className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-light">AI is analyzing your healing journey...</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8" />
          AI-Powered Pathway Recommendations
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
          Based on your healing journey, writing patterns, and community engagement, 
          here are pathways perfectly aligned with your current growth phase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card 
              className={`bg-gradient-to-br ${rec.gradient} backdrop-blur-sm border-white/20 border-2 hover:border-white/40 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
              onClick={() => {
                setSelectedRecommendation(rec.id);
                setShowDetailedView(true);
              }}
            >
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-sm font-medium ${getMatchScoreColor(rec.matchScore)}`}>
                  {rec.matchScore}% match
                </div>
              </div>

              {/* Trauma-Informed Badge */}
              {rec.traumaInformed && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-2 py-1 rounded-full bg-green-500/20 backdrop-blur-sm text-xs text-green-300 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Trauma-Informed
                  </div>
                </div>
              )}

              {/* Professional Guidance Badge */}
              {rec.professionalGuidance && (
                <div className="absolute top-12 left-4 z-10">
                  <div className="px-2 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm text-xs text-purple-300 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Professional Guided
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{rec.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-white mb-2 group-hover:text-white/90 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.duration}
                      </span>
                      <span className={`flex items-center gap-1 ${getDifficultyColor(rec.difficulty)}`}>
                        <Target className="w-3 h-3" />
                        {rec.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {rec.communitySupport.activeMembers} members
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Insights Preview */}
                <div className="bg-black/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-300" />
                    <span className="text-blue-300 text-sm font-medium">AI Insight</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {rec.aiInsights.length > 120 ? `${rec.aiInsights.substring(0, 120)}...` : rec.aiInsights}
                  </p>
                </div>

                {/* Top Reasoning Points */}
                <div className="space-y-2 mb-4">
                  {rec.reasoning.slice(0, 2).map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                      {reason}
                    </div>
                  ))}
                  {rec.reasoning.length > 2 && (
                    <div className="text-white/50 text-xs">
                      +{rec.reasoning.length - 2} more reasons
                    </div>
                  )}
                </div>

                {/* Community Stats */}
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {rec.communitySupport.completionRate}% completion
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    {rec.communitySupport.avgRating}/5.0
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {rec.communitySupport.recentStories} recent stories
                  </span>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all duration-300 group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Starting pathway: ${rec.id}`);
                  }}
                >
                  <span>View Detailed Recommendation</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {showDetailedView && selectedRecommendation && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailedView(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const rec = recommendations.find(r => r.id === selectedRecommendation);
                if (!rec) return null;
                
                return (
                  <div className="p-8 text-white">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{rec.icon}</div>
                        <div>
                          <h2 className="text-3xl font-light mb-2">{rec.title}</h2>
                          <p className="text-white/70">{rec.category}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowDetailedView(false)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        Close
                      </Button>
                    </div>

                    {/* AI Insights */}
                    <Card className="bg-blue-500/20 backdrop-blur-sm border-blue-300/30 mb-6">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="w-6 h-6 text-blue-300" />
                          <h3 className="text-xl font-medium text-blue-100">AI Analysis</h3>
                        </div>
                        <p className="text-blue-100 leading-relaxed">{rec.aiInsights}</p>
                      </div>
                    </Card>

                    {/* Why This Pathway */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                        <div className="p-6">
                          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                            <Compass className="w-5 h-5" />
                            Why This Pathway?
                          </h3>
                          <div className="space-y-3">
                            {rec.reasoning.map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-white/80 text-sm">{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      <Card className="bg-white/5 backdrop-blur-sm border-white/20">
                        <div className="p-6">
                          <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Community Support
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-white/70">Active Members</span>
                              <span className="text-white">{rec.communitySupport.activeMembers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Completion Rate</span>
                              <span className="text-green-400">{rec.communitySupport.completionRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Average Rating</span>
                              <span className="text-yellow-400">{rec.communitySupport.avgRating}/5.0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Recent Stories</span>
                              <span className="text-white">{rec.communitySupport.recentStories}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Personalized Adaptations */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/20 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <Leaf className="w-5 h-5" />
                          Personalized For You
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-white/90 mb-2">Adaptations</h4>
                            <div className="space-y-2">
                              {rec.personalizedAdaptations.map((adaptation, idx) => (
                                <div key={idx} className="text-white/70 text-sm">• {adaptation}</div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-white/90 mb-2">Next Steps</h4>
                            <div className="space-y-2">
                              {rec.nextSteps.map((step, idx) => (
                                <div key={idx} className="text-white/70 text-sm">• {step}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Therapeutic Benefits */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/20 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Expected Benefits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rec.therapeuticBenefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-pink-400 rounded-full" />
                              <span className="text-white/80 text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          console.log(`Starting pathway: ${rec.id}`);
                          setShowDetailedView(false);
                        }}
                      >
                        Start This Pathway
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          console.log(`Joining peer group for: ${rec.id}`);
                          setShowDetailedView(false);
                        }}
                      >
                        Join Peer Group
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}