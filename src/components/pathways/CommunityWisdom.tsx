'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WisdomShare {
  id: string;
  content: string;
  category: string;
  timeFrame: string; // e.g., "3 months in", "1 year later"
  mood: 'hopeful' | 'peaceful' | 'grateful' | 'strong' | 'gentle';
  supportCount: number;
  createdAt: Date;
}

interface MilestoneShare {
  id: string;
  title: string;
  description: string;
  pathwayCategory: string;
  celebrationIcon: string;
  timeAchieved: string;
  encouragementNote?: string;
}

// Sample wisdom shares (in production, these would come from a secure, anonymous API)
const SAMPLE_WISDOM_SHARES: WisdomShare[] = [
  {
    id: '1',
    content: "Learning to breathe through difficult emotions instead of avoiding them has been the most gentle revolution in my healing journey.",
    category: 'Emotional Regulation',
    timeFrame: '6 months in',
    mood: 'peaceful',
    supportCount: 47,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    content: "I discovered that my sensitivity isn't a weakness—it's a superpower that helps me connect deeply with others and myself.",
    category: 'Self-Awareness',
    timeFrame: '1 year later',
    mood: 'strong',
    supportCount: 89,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    content: "Setting boundaries felt scary at first, but now I see them as love letters to my future self.",
    category: 'Relationships',
    timeFrame: '4 months in',
    mood: 'hopeful',
    supportCount: 62,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '4',
    content: "Some days healing feels like tiny steps, and that's perfect. Every gentle choice towards myself matters.",
    category: 'Self-Compassion',
    timeFrame: '8 months in',
    mood: 'gentle',
    supportCount: 94,
    createdAt: new Date('2024-01-08')
  }
];

const SAMPLE_MILESTONES: MilestoneShare[] = [
  {
    id: '1',
    title: 'First Month of Daily Mindfulness',
    description: 'Completed 30 days of gentle mindfulness practice',
    pathwayCategory: 'Self-Awareness Journey',
    celebrationIcon: '🌱',
    timeAchieved: 'yesterday',
    encouragementNote: 'Starting is the hardest part - you did it!'
  },
  {
    id: '2',
    title: 'Boundary Setting Breakthrough',
    description: 'Successfully maintained a difficult but necessary boundary',
    pathwayCategory: 'Connection Grove',
    celebrationIcon: '🌳',
    timeAchieved: '3 days ago'
  },
  {
    id: '3',
    title: 'Emotional Regulation Milestone',
    description: 'Used breathing techniques during a stressful moment',
    pathwayCategory: 'Emotional Regulation Garden',
    celebrationIcon: '🌿',
    timeAchieved: '1 week ago',
    encouragementNote: 'Those tools really work when we need them most'
  }
];

// Mood-based styling
const getMoodStyling = (mood: WisdomShare['mood']) => {
  const styles = {
    hopeful: 'bg-yellow-500/10 border-yellow-300/20 text-yellow-100',
    peaceful: 'bg-blue-500/10 border-blue-300/20 text-blue-100',
    grateful: 'bg-green-500/10 border-green-300/20 text-green-100',
    strong: 'bg-purple-500/10 border-purple-300/20 text-purple-100',
    gentle: 'bg-pink-500/10 border-pink-300/20 text-pink-100'
  };
  return styles[mood];
};

// Anonymous wisdom card
const WisdomCard = ({ wisdom }: { wisdom: WisdomShare }) => {
  const [showSupport, setShowSupport] = useState(false);
  
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 10px 30px rgba(255,255,255,0.1)"
      }}
    >
      {/* Wisdom content */}
      <div className="space-y-3">
        <p className="text-white/90 leading-relaxed italic">
          "{wisdom.content}"
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMoodStyling(wisdom.mood)}`}>
              {wisdom.mood}
            </span>
            <span className="text-white/60">
              {wisdom.category} • {wisdom.timeFrame}
            </span>
          </div>
        </div>
      </div>

      {/* Support interaction */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <span>💚</span>
          <span>{wisdom.supportCount} hearts</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
          onClick={() => setShowSupport(!showSupport)}
        >
          <motion.span
            animate={showSupport ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            💚
          </motion.span>
          Send Love
        </Button>
      </div>

      {/* Support sent feedback */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            className="bg-green-500/10 border border-green-300/20 rounded-xl p-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-green-100 text-sm text-center">
              Your love has been sent anonymously 💚
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Milestone celebration card
const MilestoneCard = ({ milestone }: { milestone: MilestoneShare }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gold-400/10 to-yellow-500/10 backdrop-blur-sm rounded-2xl p-6 border border-gold-300/20 space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 15px 35px rgba(255,215,0,0.1)"
      }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="text-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {milestone.celebrationIcon}
        </motion.div>
        
        <div className="flex-1 space-y-2">
          <h4 className="text-white font-medium leading-tight">
            {milestone.title}
          </h4>
          <p className="text-white/80 text-sm">
            {milestone.description}
          </p>
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <span>{milestone.pathwayCategory}</span>
            <span>•</span>
            <span>{milestone.timeAchieved}</span>
          </div>
        </div>
      </div>

      {milestone.encouragementNote && (
        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <p className="text-white/90 text-sm italic">
            💭 {milestone.encouragementNote}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Share wisdom interface
const ShareWisdomInterface = ({ onShare }: { onShare: (content: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<WisdomShare['mood']>('hopeful');

  const moods: Array<{ value: WisdomShare['mood']; label: string; icon: string }> = [
    { value: 'hopeful', label: 'Hopeful', icon: '🌅' },
    { value: 'peaceful', label: 'Peaceful', icon: '🕊️' },
    { value: 'grateful', label: 'Grateful', icon: '🙏' },
    { value: 'strong', label: 'Strong', icon: '💪' },
    { value: 'gentle', label: 'Gentle', icon: '🌸' }
  ];

  const handleShare = () => {
    if (content.trim()) {
      onShare(content);
      setContent('');
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
        size="lg"
      >
        <motion.span
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          ✨ Share Your Wisdom Anonymously
        </motion.span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-3">
              <label className="block text-white/90 text-sm font-medium">
                Share what you've learned (completely anonymous)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What insight, realization, or gentle wisdom would you like to share with fellow travelers?"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                rows={4}
                maxLength={280}
              />
              <div className="text-right text-white/60 text-xs">
                {content.length}/280
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-white/90 text-sm font-medium">
                Current mood
              </label>
              <div className="flex gap-2 flex-wrap">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`px-3 py-2 rounded-full text-xs font-medium border transition-all ${
                      selectedMood === mood.value
                        ? getMoodStyling(mood.value)
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {mood.icon} {mood.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleShare}
                disabled={!content.trim()}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50"
              >
                Share Anonymously
              </Button>
            </div>

            <div className="bg-blue-500/10 border border-blue-300/20 rounded-xl p-3">
              <p className="text-blue-100 text-xs leading-relaxed">
                💙 Your wisdom is shared completely anonymously. No personal information is stored or shared. 
                This creates a safe space for authentic expression and mutual support.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function CommunityWisdom() {
  const [wisdomShares, setWisdomShares] = useState<WisdomShare[]>(SAMPLE_WISDOM_SHARES);
  const [milestones, setMilestones] = useState<MilestoneShare[]>(SAMPLE_MILESTONES);
  const [activeTab, setActiveTab] = useState<'wisdom' | 'milestones'>('wisdom');
  const [filter, setFilter] = useState<string>('all');

  const handleShareWisdom = (content: string) => {
    // In production, this would make an API call to securely store the anonymous wisdom
    console.log('Sharing wisdom:', content);
    // Add optimistic update
    const newWisdom: WisdomShare = {
      id: Date.now().toString(),
      content,
      category: 'Personal Growth',
      timeFrame: 'just now',
      mood: 'hopeful',
      supportCount: 0,
      createdAt: new Date()
    };
    setWisdomShares([newWisdom, ...wisdomShares]);
  };

  const categories = ['all', 'Self-Awareness', 'Emotional Regulation', 'Relationships', 'Resilience', 'Purpose'];

  const filteredWisdom = filter === 'all' 
    ? wisdomShares 
    : wisdomShares.filter(wisdom => wisdom.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-2xl">🤝</span>
          <div>
            <h3 className="text-lg font-medium text-white">Anonymous Wisdom Circle</h3>
            <p className="text-white/70 text-sm">Safe space for sharing insights and celebrating progress</p>
          </div>
        </div>
      </div>

      {/* Share Interface */}
      <ShareWisdomInterface onShare={handleShareWisdom} />

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
          <div className="flex gap-1">
            {[
              { key: 'wisdom', label: 'Wisdom Shares', icon: '💡' },
              { key: 'milestones', label: 'Celebrations', icon: '🎉' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'wisdom' | 'milestones')}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.icon} {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'wisdom' ? (
          <motion.div
            key="wisdom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Category Filter */}
            <div className="flex justify-center">
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      filter === category
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Wisdom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWisdom.map((wisdom) => (
                <WisdomCard key={wisdom.id} wisdom={wisdom} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {milestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Notice */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="text-center space-y-3">
          <div className="text-2xl">🔒</div>
          <h4 className="text-white font-medium">Complete Privacy Protection</h4>
          <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
            All wisdom shares and celebrations are completely anonymous. No personal information, 
            IP addresses, or identifying data is stored. This creates a safe sanctuary for authentic 
            expression and mutual support without fear of judgment or exposure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommunityWisdom;