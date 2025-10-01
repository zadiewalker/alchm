'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Star, 
  Heart, 
  Sparkles, 
  Trophy,
  Crown,
  Gift,
  Leaf,
  Sun,
  Moon,
  Calendar,
  Users,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronRight,
  Plus,
  Target,
  TrendingUp,
  Compass,
  Shield,
  Clock,
  Smile,
  Zap
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

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'personal' | 'community' | 'pathway' | 'support';
  achievedBy: string; // Anonymous identifier
  achievedAt: Date;
  pathwayId?: string;
  icon: string;
  color: string;
  gradient: string;
  significance: 'small' | 'medium' | 'major' | 'breakthrough';
  communityReactions: {
    hearts: number;
    celebrations: number;
    encouragements: number;
    shares: number;
  };
  anonymousMessage?: string;
  relatedStory?: string;
  inspiringOthers: number;
  isCelebrated: boolean;
  celebrationParticipants: number;
  tags: string[];
  difficulty?: 'foundation' | 'growth' | 'advanced';
  duration?: string;
  communityImpact: 'low' | 'medium' | 'high' | 'transformative';
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  currentProgress: number;
  targetProgress: number;
  participantCount: number;
  endDate: Date;
  category: string;
  icon: string;
  gradient: string;
  rewards: string[];
  milestoneMarkers: number[];
  isActive: boolean;
  communitySpirit: number; // 0-100 engagement score
}

interface SharedMilestonesProps {
  userProgress: UserProgress | null;
}

export function SharedMilestones({ userProgress }: SharedMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [communityMilestones, setCommunityMilestones] = useState<Milestone[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<CommunityChallenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Milestones', icon: Award },
    { id: 'personal', name: 'Personal Victories', icon: Star },
    { id: 'community', name: 'Community Impact', icon: Users },
    { id: 'pathway', name: 'Pathway Progress', icon: Compass },
    { id: 'support', name: 'Peer Support', icon: Heart }
  ];

  useEffect(() => {
    // Simulate loading milestones and community data
    setTimeout(() => {
      const mockMilestones: Milestone[] = [
        {
          id: 'milestone-1',
          title: 'First Week of Mindful Breathing',
          description: 'Completed 7 consecutive days of mindful breathing practice, even during stressful moments at work.',
          category: 'personal',
          type: 'pathway',
          achievedBy: 'GentleGardener',
          achievedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          pathwayId: 'mindful-awareness',
          icon: '🧘‍♀️',
          color: 'text-green-400',
          gradient: 'from-green-400/20 to-emerald-600/20',
          significance: 'medium',
          communityReactions: {
            hearts: 23,
            celebrations: 15,
            encouragements: 31,
            shares: 8
          },
          anonymousMessage: "This felt impossible at first, but each day got a little easier. The community encouragement kept me going!",
          inspiringOthers: 12,
          isCelebrated: true,
          celebrationParticipants: 23,
          tags: ['mindfulness', 'consistency', 'stress-management'],
          difficulty: 'foundation',
          duration: '7 days',
          communityImpact: 'medium'
        },
        {
          id: 'milestone-2',
          title: 'Shared First Vulnerable Story',
          description: 'Found courage to anonymously share a personal healing story that has inspired others in the community.',
          category: 'community',
          type: 'support',
          achievedBy: 'CourageousHeart',
          achievedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          icon: '💗',
          color: 'text-pink-400',
          gradient: 'from-pink-400/20 to-rose-600/20',
          significance: 'major',
          communityReactions: {
            hearts: 89,
            celebrations: 45,
            encouragements: 67,
            shares: 23
          },
          anonymousMessage: "Sharing my story felt scary but liberating. Thank you all for creating such a safe space.",
          relatedStory: 'story-healing-after-loss',
          inspiringOthers: 47,
          isCelebrated: true,
          celebrationParticipants: 89,
          tags: ['vulnerability', 'courage', 'community-impact'],
          communityImpact: 'high'
        },
        {
          id: 'milestone-3',
          title: 'Trauma Healing Breakthrough',
          description: 'Achieved a significant breakthrough in processing difficult emotions with professional guidance.',
          category: 'personal',
          type: 'pathway',
          achievedBy: 'RisingPhoenix',
          achievedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          pathwayId: 'trauma-healing',
          icon: '🌅',
          color: 'text-amber-400',
          gradient: 'from-amber-400/20 to-orange-600/20',
          significance: 'breakthrough',
          communityReactions: {
            hearts: 156,
            celebrations: 89,
            encouragements: 134,
            shares: 45
          },
          anonymousMessage: "This work is hard but so worth it. Every small step forward is a victory worth celebrating.",
          inspiringOthers: 78,
          isCelebrated: true,
          celebrationParticipants: 156,
          tags: ['trauma-recovery', 'breakthrough', 'professional-support'],
          difficulty: 'advanced',
          duration: '8 weeks',
          communityImpact: 'transformative'
        },
        {
          id: 'milestone-4',
          title: '30-Day Healing Streak',
          description: 'Maintained consistent engagement with healing practices for 30 consecutive days.',
          category: 'personal',
          type: 'personal',
          achievedBy: 'SteadyGrowth',
          achievedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          icon: '🔥',
          color: 'text-orange-400',
          gradient: 'from-orange-400/20 to-red-600/20',
          significance: 'major',
          communityReactions: {
            hearts: 67,
            celebrations: 34,
            encouragements: 89,
            shares: 21
          },
          anonymousMessage: "Consistency has been my greatest teacher. Small daily actions create profound change.",
          inspiringOthers: 34,
          isCelebrated: true,
          celebrationParticipants: 67,
          tags: ['consistency', 'dedication', 'daily-practice'],
          communityImpact: 'medium'
        },
        {
          id: 'milestone-5',
          title: 'Supported 10 Community Members',
          description: 'Provided meaningful encouragement and support to fellow community members in their healing journeys.',
          category: 'community',
          type: 'support',
          achievedBy: 'CompassionateGuide',
          achievedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          icon: '🤝',
          color: 'text-blue-400',
          gradient: 'from-blue-400/20 to-indigo-600/20',
          significance: 'major',
          communityReactions: {
            hearts: 102,
            celebrations: 56,
            encouragements: 78,
            shares: 32
          },
          anonymousMessage: "Giving support to others has healed parts of me I didn't know needed healing.",
          inspiringOthers: 56,
          isCelebrated: true,
          celebrationParticipants: 102,
          tags: ['peer-support', 'community-service', 'empathy'],
          communityImpact: 'high'
        }
      ];

      const mockChallenges: CommunityChallenge[] = [
        {
          id: 'challenge-1',
          title: 'Collective Gratitude Practice',
          description: 'Together, let\'s practice gratitude daily and share anonymous reflections about what we\'re grateful for in our healing journeys.',
          goal: 'Share 1000 gratitude reflections as a community',
          currentProgress: 743,
          targetProgress: 1000,
          participantCount: 234,
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          category: 'mindfulness',
          icon: '🙏',
          gradient: 'from-yellow-400/20 to-gold-600/20',
          rewards: [
            'Community gratitude celebration',
            'Special milestone badge',
            'Exclusive healing meditation session',
            'Featured community reflection'
          ],
          milestoneMarkers: [250, 500, 750, 1000],
          isActive: true,
          communitySpirit: 87
        },
        {
          id: 'challenge-2',
          title: 'Anonymous Acts of Kindness',
          description: 'Spread healing through small, anonymous acts of kindness within our community and beyond.',
          goal: 'Complete 500 acts of kindness together',
          currentProgress: 342,
          targetProgress: 500,
          participantCount: 189,
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          category: 'community',
          icon: '💝',
          gradient: 'from-pink-400/20 to-rose-600/20',
          rewards: [
            'Community kindness celebration',
            'Kindness champion badge',
            'Group appreciation ceremony',
            'Healing wisdom compilation'
          ],
          milestoneMarkers: [125, 250, 375, 500],
          isActive: true,
          communitySpirit: 92
        }
      ];

      setMilestones(mockMilestones.filter(m => m.type === 'personal'));
      setCommunityMilestones(mockMilestones);
      setActiveChallenges(mockChallenges);
      setIsLoading(false);
    }, 800);
  }, []);

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'small': return <Leaf className="w-4 h-4" />;
      case 'medium': return <Star className="w-4 h-4" />;
      case 'major': return <Award className="w-4 h-4" />;
      case 'breakthrough': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'small': return 'text-green-400';
      case 'medium': return 'text-blue-400';
      case 'major': return 'text-purple-400';
      case 'breakthrough': return 'text-gold-400';
      default: return 'text-gray-400';
    }
  };

  const handleCelebrateMilestone = (milestoneId: string) => {
    setSelectedMilestone(milestoneId);
    setShowCelebrationModal(true);
  };

  const filteredMilestones = selectedCategory === 'all' 
    ? communityMilestones 
    : communityMilestones.filter(m => m.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/20 border">
          <div className="p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <Award className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-light">Loading community celebrations...</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8" />
          Shared Milestones & Celebrations
        </h2>
        <p className="text-white/80 max-w-3xl mx-auto leading-relaxed">
          Celebrate healing victories together while maintaining complete anonymity. 
          Every milestone shared inspires others and strengthens our collective healing journey.
        </p>
      </div>

      {/* Community Challenges */}
      <section className="mb-12">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Active Community Challenges
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${challenge.gradient} backdrop-blur-sm border-white/20 border-2 hover:border-white/40 transition-all duration-300`}>
                <div className="p-6">
                  {/* Challenge Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-medium text-white mb-2">{challenge.title}</h4>
                      <p className="text-white/70 text-sm leading-relaxed mb-3">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {challenge.participantCount} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">{challenge.goal}</span>
                      <span className="text-white text-sm font-medium">
                        {challenge.currentProgress}/{challenge.targetProgress}
                      </span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-3 backdrop-blur-sm">
                      <div 
                        className="bg-gradient-to-r from-white/30 to-white/50 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(challenge.currentProgress / challenge.targetProgress) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      {challenge.milestoneMarkers.map((marker, idx) => (
                        <div key={idx} className="text-xs text-white/60">
                          {marker}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Community Spirit */}
                  <div className="bg-black/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Community Spirit</span>
                      <span className="text-white text-sm font-medium">{challenge.communitySpirit}%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full"
                        style={{ width: `${challenge.communitySpirit}%` }}
                      />
                    </div>
                  </div>

                  {/* Rewards Preview */}
                  <div className="mb-4">
                    <h5 className="text-white/90 text-sm font-medium mb-2">Community Rewards</h5>
                    <div className="space-y-1">
                      {challenge.rewards.slice(0, 2).map((reward, idx) => (
                        <div key={idx} className="text-white/70 text-xs flex items-center gap-2">
                          <Gift className="w-3 h-3" />
                          {reward}
                        </div>
                      ))}
                      {challenge.rewards.length > 2 && (
                        <div className="text-white/50 text-xs">
                          +{challenge.rewards.length - 2} more rewards
                        </div>
                      )}
                    </div>
                  </div>

                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all duration-300">
                    Join Challenge
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map(({ id, name, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === id
                ? 'bg-white/20 text-white backdrop-blur-sm border-white/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            } border border-white/20`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </Button>
        ))}
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-6">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Recent Community Milestones
        </h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/30 via-white/20 to-transparent" />
          
          <div className="space-y-6">
            {filteredMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Timeline Icon */}
                <div className={`absolute left-6 top-6 w-4 h-4 rounded-full bg-gradient-to-r ${milestone.gradient} border-2 border-white/30 z-10`} />
                
                <Card className={`bg-gradient-to-br ${milestone.gradient} backdrop-blur-sm border-white/20 border hover:border-white/40 transition-all duration-300`}>
                  <div className="p-6">
                    {/* Milestone Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{milestone.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-medium text-white">{milestone.title}</h4>
                            <div className={`flex items-center gap-1 ${getSignificanceColor(milestone.significance)}`}>
                              {getSignificanceIcon(milestone.significance)}
                              <span className="text-xs capitalize">{milestone.significance}</span>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm leading-relaxed mb-3">{milestone.description}</p>
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(milestone.achievedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              By {milestone.achievedBy}
                            </span>
                            {milestone.duration && (
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {milestone.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anonymous Message */}
                    {milestone.anonymousMessage && (
                      <div className="bg-black/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-4 h-4 text-blue-300" />
                          <span className="text-blue-300 text-sm font-medium">Anonymous Reflection</span>
                        </div>
                        <p className="text-white/80 text-sm italic leading-relaxed">
                          "{milestone.anonymousMessage}"
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {milestone.tags.map((tag, idx) => (
                        <div key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                          #{tag}
                        </div>
                      ))}
                    </div>

                    {/* Community Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-pink-300 hover:text-pink-200 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{milestone.communityReactions.hearts}</span>
                        </button>
                        <button className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 transition-colors">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm">{milestone.communityReactions.celebrations}</span>
                        </button>
                        <button className="flex items-center gap-1 text-green-300 hover:text-green-200 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{milestone.communityReactions.encouragements}</span>
                        </button>
                        <button className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{milestone.communityReactions.shares}</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <TrendingUp className="w-3 h-3" />
                        <span>Inspiring {milestone.inspiringOthers} others</span>
                      </div>
                    </div>

                    {/* Celebration Status */}
                    {milestone.isCelebrated && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-300">
                            <Award className="w-4 h-4" />
                            <span className="text-sm">Celebrated by {milestone.celebrationParticipants} community members</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleCelebrateMilestone(milestone.id)}
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-200 border border-green-400/30"
                          >
                            Join Celebration
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebrationModal && selectedMilestone && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCelebrationModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const milestone = communityMilestones.find(m => m.id === selectedMilestone);
                if (!milestone) return null;
                
                return (
                  <div className="p-8 text-white">
                    {/* Celebration Header */}
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">{milestone.icon}</div>
                      <h2 className="text-3xl font-light mb-2">🎉 Celebrating This Milestone! 🎉</h2>
                      <p className="text-white/70 text-lg">{milestone.title}</p>
                    </div>

                    {/* Milestone Details */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/20 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium mb-4">Milestone Achievement</h3>
                        <p className="text-white/80 leading-relaxed mb-4">{milestone.description}</p>
                        {milestone.anonymousMessage && (
                          <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-300/30">
                            <p className="text-blue-100 italic">"{milestone.anonymousMessage}"</p>
                            <div className="text-blue-200/70 text-sm mt-2">- {milestone.achievedBy}</div>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Community Impact */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/20 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Community Impact
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-light text-green-400 mb-1">{milestone.inspiringOthers}</div>
                            <p className="text-white/70 text-sm">People Inspired</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-light text-blue-400 mb-1">{milestone.celebrationParticipants}</div>
                            <p className="text-white/70 text-sm">Celebration Participants</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Celebration Actions */}
                    <div className="space-y-4">
                      <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        Send Anonymous Encouragement
                      </Button>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Celebrate This Victory
                      </Button>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Inspiration
                      </Button>
                      <Button 
                        onClick={() => setShowCelebrationModal(false)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}