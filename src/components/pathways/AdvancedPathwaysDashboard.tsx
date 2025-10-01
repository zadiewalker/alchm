'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PathwayCard } from './PathwayCard';
import { BotanicalProgress } from './BotanicalProgress';
import { PersonalizedPathwayRecommendations } from './PersonalizedPathwayRecommendations';
import { AnonymousPeerGroups } from '@/components/community/AnonymousPeerGroups';
import { SharedMilestones } from '@/components/community/SharedMilestones';
import { HealingStoriesSharing } from '@/components/community/HealingStoriesSharing';
import { CrisisFloatingButton } from '@/components/ui/CrisisFloatingButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Users, Star, BookOpen, Heart, Shield, Compass, Sprout } from 'lucide-react';

// Enhanced pathway categories with community integration
const PATHWAY_CATEGORIES = {
  selfAwareness: {
    title: 'Self-Awareness Journey',
    subtitle: 'Cultivating mindful presence and emotional recognition',
    icon: '🌱',
    gradient: 'from-green-400/20 to-emerald-600/20',
    communityCount: 1247,
    pathways: [
      {
        id: 'mindful-awareness',
        title: 'Mindful Awareness',
        description: 'Develop present-moment awareness through gentle practices',
        duration: '3 weeks',
        progress: 65,
        difficulty: 'Foundation',
        participants: 1247,
        communityEngagement: 87,
        avgCompletionRate: 94,
        peerSupport: true
      },
      {
        id: 'emotional-recognition',
        title: 'Emotional Recognition',
        description: 'Learn to identify and name your emotions with compassion',
        duration: '4 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 892,
        communityEngagement: 91,
        avgCompletionRate: 89,
        peerSupport: true
      }
    ]
  },
  emotionalRegulation: {
    title: 'Emotional Regulation Garden',
    subtitle: 'Growing skills for stress management and emotional balance',
    icon: '🌿',
    gradient: 'from-blue-400/20 to-teal-600/20',
    communityCount: 1456,
    pathways: [
      {
        id: 'stress-sanctuary',
        title: 'Stress Sanctuary',
        description: 'Create inner calm through proven relaxation techniques',
        duration: '5 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 1456,
        communityEngagement: 85,
        avgCompletionRate: 92,
        peerSupport: true
      },
      {
        id: 'emotional-balance',
        title: 'Emotional Balance',
        description: 'Advanced techniques for emotional equilibrium',
        duration: '6 weeks',
        progress: 0,
        difficulty: 'Growth',
        participants: 734,
        communityEngagement: 88,
        avgCompletionRate: 87,
        peerSupport: true
      }
    ]
  },
  connectionGrove: {
    title: 'Connection Grove',
    subtitle: 'Nurturing relationships, communication, and empathy',
    icon: '🌳',
    gradient: 'from-purple-400/20 to-indigo-600/20',
    communityCount: 923,
    pathways: [
      {
        id: 'empathy-circle',
        title: 'Empathy Circle',
        description: 'Deepen your capacity for understanding others',
        duration: '4 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 923,
        communityEngagement: 93,
        avgCompletionRate: 91,
        peerSupport: true
      },
      {
        id: 'healthy-boundaries',
        title: 'Healthy Boundaries',
        description: 'Learn to set and maintain loving boundaries',
        duration: '5 weeks',
        progress: 0,
        difficulty: 'Growth',
        participants: 687,
        communityEngagement: 86,
        avgCompletionRate: 88,
        peerSupport: true
      }
    ]
  },
  resilienceForest: {
    title: 'Resilience Forest',
    subtitle: 'Building strength through trauma recovery and growth',
    icon: '🌲',
    gradient: 'from-amber-400/20 to-orange-600/20',
    communityCount: 543,
    pathways: [
      {
        id: 'trauma-healing',
        title: 'Trauma Healing',
        description: 'Gentle approaches to processing difficult experiences',
        duration: '8 weeks',
        progress: 0,
        difficulty: 'Guided',
        participants: 543,
        communityEngagement: 95,
        avgCompletionRate: 93,
        requiresSupport: true,
        peerSupport: true,
        professionalGuidance: true
      },
      {
        id: 'post-traumatic-growth',
        title: 'Post-Traumatic Growth',
        description: 'Discover meaning and strength after adversity',
        duration: '10 weeks',
        progress: 0,
        difficulty: 'Advanced',
        participants: 312,
        communityEngagement: 89,
        avgCompletionRate: 85,
        peerSupport: true,
        professionalGuidance: true
      }
    ]
  },
  purposeMeadow: {
    title: 'Purpose Meadow',
    subtitle: 'Discovering meaning, setting goals, and living your values',
    icon: '🌻',
    gradient: 'from-yellow-400/20 to-gold-600/20',
    communityCount: 1123,
    pathways: [
      {
        id: 'values-discovery',
        title: 'Values Discovery',
        description: 'Uncover what truly matters to you',
        duration: '3 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 1123,
        communityEngagement: 84,
        avgCompletionRate: 90,
        peerSupport: true
      },
      {
        id: 'life-purpose',
        title: 'Life Purpose',
        description: 'Align your actions with your deeper calling',
        duration: '7 weeks',
        progress: 0,
        difficulty: 'Growth',
        participants: 654,
        communityEngagement: 87,
        avgCompletionRate: 86,
        peerSupport: true
      }
    ]
  }
};

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

interface CommunityInsights {
  totalMembers: number;
  activeThisWeek: number;
  storiesShared: number;
  milestonesReached: number;
  peerSupportsGiven: number;
  collectiveHealingMomentum: 'building' | 'strong' | 'powerful' | 'transformative';
}

export function AdvancedPathwaysDashboard() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'pathways' | 'community' | 'stories' | 'milestones'>('pathways');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [communityInsights, setCommunityInsights] = useState<CommunityInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading user progress and community data
    setTimeout(() => {
      setUserProgress({
        totalPathwaysStarted: 3,
        totalPathwaysCompleted: 1,
        currentlyActive: 2,
        weeklyProgress: 68,
        healingMomentum: 'growing',
        communityContributions: 12,
        peerConnectionsCount: 8,
        storiesShared: 2,
        milestonesAchieved: 5,
        healingStreak: 14,
        milestones: [
          {
            id: '1',
            title: 'First Week of Mindful Awareness',
            achievedAt: new Date('2024-01-15'),
            category: 'Self-Awareness Journey',
            communityRecognition: 23
          },
          {
            id: '2',
            title: 'Shared First Healing Story',
            achievedAt: new Date('2024-01-20'),
            category: 'Community Connection',
            communityRecognition: 47
          }
        ]
      });

      setCommunityInsights({
        totalMembers: 15847,
        activeThisWeek: 3942,
        storiesShared: 1834,
        milestonesReached: 7291,
        peerSupportsGiven: 12047,
        collectiveHealingMomentum: 'powerful'
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePathwayStart = useCallback((pathwayId: string) => {
    console.log('Starting pathway:', pathwayId);
    setSelectedPathway(pathwayId);
  }, []);

  const handleJoinPeerGroup = useCallback((pathwayId: string) => {
    console.log('Joining peer group for pathway:', pathwayId);
    setActiveView('community');
  }, []);

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'emerging': return <Sprout className="w-6 h-6" />;
      case 'growing': return <Leaf className="w-6 h-6" />;
      case 'blooming': return <Star className="w-6 h-6" />;
      case 'flourishing': return <Heart className="w-6 h-6" />;
      default: return <Leaf className="w-6 h-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-sanctuary flex items-center justify-center">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-white/20 rounded-full animate-gentle-pulse mb-8 mx-auto backdrop-blur-sm flex items-center justify-center">
            <Compass className="w-10 h-10 text-white/80" />
          </div>
          <h2 className="text-3xl font-light mb-4">Preparing Your Healing Sanctuary</h2>
          <p className="text-white/80 text-lg">Connecting you to pathways and community wisdom...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-sanctuary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Hero Section */}
        <motion.header
          className="text-center mb-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <div className="text-white/60 text-sm uppercase tracking-wider mb-3 font-medium">
              Your Healing Ecosystem
            </div>
            <h1 className="text-4xl md:text-6xl font-extralight mb-6 tracking-tight">
              Pathways & Community
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-4xl mx-auto leading-relaxed">
              Transform your healing journey through intentional pathways while connecting anonymously 
              with others walking similar paths of growth and recovery.
            </p>
          </div>
          
          {/* Enhanced Journey Overview */}
          {userProgress && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  {getMomentumIcon(userProgress.healingMomentum)}
                </div>
                <div className="text-2xl font-extralight mb-2 capitalize">{userProgress.healingMomentum}</div>
                <p className="text-white/80 text-xs">Healing Momentum</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-2xl font-extralight mb-2">{userProgress.currentlyActive}</div>
                <p className="text-white/80 text-xs">Active Pathways</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-2xl font-extralight mb-2">{userProgress.peerConnectionsCount}</div>
                <p className="text-white/80 text-xs">Peer Connections</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-2xl font-extralight mb-2">{userProgress.storiesShared}</div>
                <p className="text-white/80 text-xs">Stories Shared</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-6 h-6" />
                </div>
                <div className="text-2xl font-extralight mb-2">{userProgress.healingStreak}</div>
                <p className="text-white/80 text-xs">Day Streak</p>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Community Insights Bar */}
        {communityInsights && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/20 border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-light flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Community Healing Insights
                  </h3>
                  <div className="text-white/60 text-sm">
                    Anonymous • Privacy Protected
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-light text-white mb-1">
                      {communityInsights.totalMembers.toLocaleString()}
                    </div>
                    <p className="text-white/70 text-sm">Total Healers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-white mb-1">
                      {communityInsights.activeThisWeek.toLocaleString()}
                    </div>
                    <p className="text-white/70 text-sm">Active This Week</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-white mb-1">
                      {communityInsights.storiesShared.toLocaleString()}
                    </div>
                    <p className="text-white/70 text-sm">Stories Shared</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-white mb-1">
                      {communityInsights.milestonesReached.toLocaleString()}
                    </div>
                    <p className="text-white/70 text-sm">Milestones</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-white mb-1 capitalize">
                      {communityInsights.collectiveHealingMomentum}
                    </div>
                    <p className="text-white/70 text-sm">Collective Energy</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
        )}

        {/* Navigation Tabs */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'pathways', label: 'Healing Pathways', icon: BookOpen },
              { id: 'community', label: 'Peer Groups', icon: Users },
              { id: 'stories', label: 'Healing Stories', icon: Heart },
              { id: 'milestones', label: 'Shared Milestones', icon: Star }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  activeView === id
                    ? 'bg-white/20 text-white backdrop-blur-sm border-white/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                } border border-white/20`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </motion.section>

        {/* Dynamic Content Based on Active View */}
        <AnimatePresence mode="wait">
          {activeView === 'pathways' && (
            <motion.div
              key="pathways"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Botanical Progress Visualization */}
              {userProgress && (
                <motion.section
                  className="mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <BotanicalProgress userProgress={userProgress} />
                </motion.section>
              )}

              {/* Personalized Recommendations */}
              <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <PersonalizedPathwayRecommendations userProgress={userProgress} />
              </motion.section>

              {/* Pathway Categories */}
              <motion.section
                className="space-y-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {Object.entries(PATHWAY_CATEGORIES).map(([categoryKey, category], index) => (
                  <motion.div
                    key={categoryKey}
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Enhanced Category Header */}
                    <div className="text-center space-y-4">
                      <div className={`inline-flex items-center gap-6 px-8 py-6 rounded-3xl bg-gradient-to-r ${category.gradient} backdrop-blur-sm border border-white/20`}>
                        <span className="text-5xl">{category.icon}</span>
                        <div className="text-left">
                          <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
                            {category.title}
                          </h2>
                          <p className="text-white/80 text-sm max-w-md mb-2">
                            {category.subtitle}
                          </p>
                          <div className="flex items-center gap-4 text-white/60 text-xs">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {category.communityCount} healers
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              Active community support
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Pathway Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                      {category.pathways.map((pathway) => (
                        <motion.div
                          key={pathway.id}
                          whileHover={{ scale: 1.02, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <PathwayCard
                            pathway={pathway}
                            onStart={() => handlePathwayStart(pathway.id)}
                            onJoinPeerGroup={() => handleJoinPeerGroup(pathway.id)}
                            category={category}
                            showCommunityFeatures={true}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.section>
            </motion.div>
          )}

          {activeView === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <AnonymousPeerGroups userProgress={userProgress} />
            </motion.div>
          )}

          {activeView === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <HealingStoriesSharing userProgress={userProgress} />
            </motion.div>
          )}

          {activeView === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <SharedMilestones userProgress={userProgress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crisis Support - Always Visible */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Card className="max-w-3xl mx-auto bg-red-50/80 backdrop-blur-sm border-red-200/50 border-2">
            <div className="p-8 text-center">
              <div className="text-5xl mb-6">🆘</div>
              <h3 className="text-2xl font-light text-sanctuary-gray-800 mb-4">
                Crisis Support Available 24/7
              </h3>
              <p className="text-sanctuary-gray-600 mb-6 leading-relaxed">
                If you're experiencing thoughts of self-harm or suicide, please reach out immediately. 
                You are not alone, and help is always available.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => window.open('tel:988', '_self')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg gap-3"
                  size="lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 988 Suicide & Crisis Lifeline
                </Button>
                <p className="text-sanctuary-gray-500 text-sm">
                  ALCHM provides peer support and pathways, not medical treatment. Always consult healthcare professionals for mental health support.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>

      {/* Crisis Floating Button */}
      <CrisisFloatingButton />
    </div>
  );
}

export default AdvancedPathwaysDashboard;