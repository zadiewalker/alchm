'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PathwayCard } from './PathwayCard';
import { BotanicalProgress } from './BotanicalProgress';
import { CommunityWisdom } from './CommunityWisdom';
import { CrisisFloatingButton } from '@/components/ui/CrisisFloatingButton';
import { motion, AnimatePresence } from 'framer-motion';

// Pathway Categories with Botanical Metaphors
const PATHWAY_CATEGORIES = {
  selfAwareness: {
    title: 'Self-Awareness Journey',
    subtitle: 'Cultivating mindful presence and emotional recognition',
    icon: '🌱',
    gradient: 'from-green-400/20 to-emerald-600/20',
    pathways: [
      {
        id: 'mindful-awareness',
        title: 'Mindful Awareness',
        description: 'Develop present-moment awareness through gentle practices',
        duration: '3 weeks',
        progress: 65,
        difficulty: 'Foundation',
        participants: 1247
      },
      {
        id: 'emotional-recognition',
        title: 'Emotional Recognition',
        description: 'Learn to identify and name your emotions with compassion',
        duration: '4 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 892
      }
    ]
  },
  emotionalRegulation: {
    title: 'Emotional Regulation Garden',
    subtitle: 'Growing skills for stress management and emotional balance',
    icon: '🌿',
    gradient: 'from-blue-400/20 to-teal-600/20',
    pathways: [
      {
        id: 'stress-sanctuary',
        title: 'Stress Sanctuary',
        description: 'Create inner calm through proven relaxation techniques',
        duration: '5 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 1456
      },
      {
        id: 'emotional-balance',
        title: 'Emotional Balance',
        description: 'Advanced techniques for emotional equilibrium',
        duration: '6 weeks',
        progress: 0,
        difficulty: 'Growth',
        participants: 734
      }
    ]
  },
  connectionGrove: {
    title: 'Connection Grove',
    subtitle: 'Nurturing relationships, communication, and empathy',
    icon: '🌳',
    gradient: 'from-purple-400/20 to-indigo-600/20',
    pathways: [
      {
        id: 'empathy-circle',
        title: 'Empathy Circle',
        description: 'Deepen your capacity for understanding others',
        duration: '4 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 923
      },
      {
        id: 'healthy-boundaries',
        title: 'Healthy Boundaries',
        description: 'Learn to set and maintain loving boundaries',
        duration: '5 weeks',
        progress: 0,
        difficulty: 'Growth',
        participants: 687
      }
    ]
  },
  resilienceForest: {
    title: 'Resilience Forest',
    subtitle: 'Building strength through trauma recovery and growth',
    icon: '🌲',
    gradient: 'from-amber-400/20 to-orange-600/20',
    pathways: [
      {
        id: 'trauma-healing',
        title: 'Trauma Healing',
        description: 'Gentle approaches to processing difficult experiences',
        duration: '8 weeks',
        progress: 0,
        difficulty: 'Guided',
        participants: 543,
        requiresSupport: true
      },
      {
        id: 'post-traumatic-growth',
        title: 'Post-Traumatic Growth',
        description: 'Discover meaning and strength after adversity',
        duration: '10 weeks',
        progress: 0,
        difficulty: 'Advanced',
        participants: 312
      }
    ]
  },
  purposeMeadow: {
    title: 'Purpose Meadow',
    subtitle: 'Discovering meaning, setting goals, and living your values',
    icon: '🌻',
    gradient: 'from-yellow-400/20 to-gold-600/20',
    pathways: [
      {
        id: 'values-discovery',
        title: 'Values Discovery',
        description: 'Uncover what truly matters to you',
        duration: '3 weeks',
        progress: 0,
        difficulty: 'Foundation',
        participants: 1123
      },
      {
        id: 'life-purpose',
        title: 'Life Purpose',
        description: 'Align your actions with your deeper calling',
        duration: '7 weeks',
        progress: 0,
        difficulty: 'Growth',
        participants: 654
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
  milestones: Array<{
    id: string;
    title: string;
    achievedAt: Date;
    category: string;
  }>;
}

export function PathwaysDashboard() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCommunityWisdom, setShowCommunityWisdom] = useState(false);

  useEffect(() => {
    // Simulate loading user progress
    setTimeout(() => {
      setUserProgress({
        totalPathwaysStarted: 3,
        totalPathwaysCompleted: 1,
        currentlyActive: 2,
        weeklyProgress: 68,
        healingMomentum: 'growing',
        milestones: [
          {
            id: '1',
            title: 'First Week of Mindful Awareness',
            achievedAt: new Date('2024-01-15'),
            category: 'Self-Awareness Journey'
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePathwayStart = (pathwayId: string) => {
    console.log('Starting pathway:', pathwayId);
    // Implementation would integrate with pathway system
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
          <div className="w-16 h-16 bg-white/20 rounded-full animate-gentle-pulse mb-6 mx-auto backdrop-blur-sm" />
          <h2 className="text-2xl font-light mb-2">Preparing Your Healing Garden</h2>
          <p className="text-white/80">Loading your pathway constellation...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-sanctuary">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.header
          className="text-center mb-16 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <div className="text-white/60 text-sm uppercase tracking-wider mb-3 font-medium">
              Your Healing Journey
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight mb-6 tracking-tight">
              Pathways Dashboard
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-4xl mx-auto leading-relaxed">
              Transform your healing journey into an organic exploration through landscapes of growth, 
              where each step forward is honored with intentional care.
            </p>
          </div>
          
          {/* Journey Overview */}
          {userProgress && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-extralight mb-2">{userProgress.totalPathwaysStarted}</div>
                <p className="text-white/80 text-sm">Pathways Explored</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-extralight mb-2">{userProgress.currentlyActive}</div>
                <p className="text-white/80 text-sm">Currently Growing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-extralight mb-2">{userProgress.weeklyProgress}%</div>
                <p className="text-white/80 text-sm">This Week</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-extralight mb-2 capitalize">{userProgress.healingMomentum}</div>
                <p className="text-white/80 text-sm">Healing Momentum</p>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Botanical Progress Visualization */}
        {userProgress && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <BotanicalProgress userProgress={userProgress} />
          </motion.section>
        )}

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
              {/* Category Header */}
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r ${category.gradient} backdrop-blur-sm border border-white/20`}>
                  <span className="text-4xl">{category.icon}</span>
                  <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-light text-white mb-1">
                      {category.title}
                    </h2>
                    <p className="text-white/80 text-sm max-w-md">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pathway Cards */}
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
                      category={category}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Community Wisdom Section */}
        <motion.section
          className="mt-24 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Community Wisdom
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              Anonymous insights and encouragement from fellow travelers on the healing journey
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <CommunityWisdom />
          </div>
        </motion.section>

        {/* Emergency Support */}
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
                  ALCHM is a journaling platform, not medical treatment. Always consult healthcare professionals for mental health support.
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

export default PathwaysDashboard;