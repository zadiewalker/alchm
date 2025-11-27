'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Badge system types
interface CreativeLearningBadge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  criteria: BadgeCriteria;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  healingValue: string;
  icon: string;
  color: string;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  prerequisiteBadges?: string[];
  rewards: BadgeReward[];
}

interface BadgeCriteria {
  type: 'session_count' | 'modality_exploration' | 'cross_modal_pattern' | 'community_connection' | 'breakthrough_moment' | 'consistency' | 'vulnerability_courage' | 'creative_flow' | 'healing_milestone';
  target: number;
  timeframe?: 'day' | 'week' | 'month' | 'all_time';
  specificRequirements?: { [key: string]: any };
}

interface BadgeReward {
  type: 'feature_unlock' | 'customization' | 'wisdom_insight' | 'community_recognition' | 'healing_tool';
  content: string;
  value: any;
}

type BadgeCategory = 
  | 'voice_mastery' 
  | 'visual_artist' 
  | 'poetry_sage' 
  | 'sound_healer' 
  | 'movement_guardian' 
  | 'multimodal_alchemist'
  | 'community_connector'
  | 'healing_pioneer'
  | 'pattern_discoverer'
  | 'breakthrough_champion';

interface CreativeLearningBadgesProps {
  onBadgeUnlocked?: (badge: CreativeLearningBadge) => void;
  className?: string;
}

// Badge categories with healing themes
const BADGE_CATEGORIES = {
  voice_mastery: {
    name: 'Voice Mastery',
    icon: '🎙️',
    color: 'from-blue-100 to-sky-100',
    description: 'Honoring the power of spoken truth and emotional expression'
  },
  visual_artist: {
    name: 'Visual Artist',
    icon: '🎨',
    color: 'from-purple-100 to-violet-100',
    description: 'Celebrating the language of colors, shapes, and visual storytelling'
  },
  poetry_sage: {
    name: 'Poetry Sage',
    icon: '✨',
    color: 'from-pink-100 to-rose-100',
    description: 'Weaving wisdom through metaphor, rhythm, and verse'
  },
  sound_healer: {
    name: 'Sound Healer',
    icon: '🎵',
    color: 'from-green-100 to-emerald-100',
    description: 'Channeling healing through frequency, rhythm, and vibration'
  },
  movement_guardian: {
    name: 'Movement Guardian',
    icon: '💃',
    color: 'from-orange-100 to-amber-100',
    description: 'Honoring body wisdom and somatic intelligence'
  },
  multimodal_alchemist: {
    name: 'Multimodal Alchemist',
    icon: '⚗️',
    color: 'from-sage-100 to-green-100',
    description: 'Transforming pain into beauty across multiple creative dimensions'
  },
  community_connector: {
    name: 'Community Connector',
    icon: '🤝',
    color: 'from-yellow-100 to-lime-100',
    description: 'Building bridges of healing through shared creative courage'
  },
  healing_pioneer: {
    name: 'Healing Pioneer',
    icon: '🌟',
    color: 'from-indigo-100 to-purple-100',
    description: 'Leading the way in innovative trauma-informed creative healing'
  },
  pattern_discoverer: {
    name: 'Pattern Discoverer',
    icon: '🔍',
    color: 'from-teal-100 to-cyan-100',
    description: 'Uncovering the deeper patterns in creative healing journeys'
  },
  breakthrough_champion: {
    name: 'Breakthrough Champion',
    icon: '💎',
    color: 'from-rose-100 to-red-100',
    description: 'Celebrating moments of profound healing and transformation'
  }
};

// Pre-defined badges with healing focus
const CREATIVE_BADGES: Omit<CreativeLearningBadge, 'progress' | 'isUnlocked' | 'unlockedAt'>[] = [
  // Voice Mastery Badges
  {
    id: 'first_voice',
    name: 'First Words',
    description: 'Spoke your truth for the first time in the sanctuary',
    category: 'voice_mastery',
    criteria: { type: 'session_count', target: 1, specificRequirements: { modality: 'voice' } },
    rarity: 'common',
    healingValue: 'Breaking the silence, honoring your voice',
    icon: '🎤',
    color: 'bg-blue-100 text-blue-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Your voice carries healing power', value: 'voice_wisdom_1' }
    ]
  },
  {
    id: 'voice_flow_master',
    name: 'Voice Flow Master',
    description: 'Achieved transcendent flow state in voice expression',
    category: 'voice_mastery',
    criteria: { type: 'creative_flow', target: 5, specificRequirements: { modality: 'voice', flowState: 'transcendent' } },
    rarity: 'rare',
    healingValue: 'Mastery of emotional expression through voice',
    icon: '🌊',
    color: 'bg-blue-200 text-blue-900',
    rewards: [
      { type: 'feature_unlock', content: 'Advanced voice analysis tools', value: 'voice_analysis_pro' },
      { type: 'wisdom_insight', content: 'In flow, your voice becomes medicine', value: 'voice_wisdom_advanced' }
    ]
  },

  // Visual Artist Badges
  {
    id: 'first_brushstroke',
    name: 'First Brushstroke',
    description: 'Created your first piece of healing art',
    category: 'visual_artist',
    criteria: { type: 'session_count', target: 1, specificRequirements: { modality: 'art' } },
    rarity: 'common',
    healingValue: 'Beginning the journey of visual emotional expression',
    icon: '🖌️',
    color: 'bg-purple-100 text-purple-800',
    rewards: [
      { type: 'customization', content: 'New color palettes', value: 'color_palettes_extended' }
    ]
  },
  {
    id: 'color_alchemist',
    name: 'Color Alchemist',
    description: 'Transformed emotions through 100+ color expressions',
    category: 'visual_artist',
    criteria: { type: 'session_count', target: 100, specificRequirements: { modality: 'art' } },
    rarity: 'epic',
    healingValue: 'Master of color psychology and emotional transformation',
    icon: '🌈',
    color: 'bg-purple-200 text-purple-900',
    rewards: [
      { type: 'feature_unlock', content: 'Professional art tools', value: 'advanced_art_tools' },
      { type: 'wisdom_insight', content: 'Colors are the vocabulary of the soul', value: 'color_wisdom_master' }
    ]
  },

  // Poetry Sage Badges
  {
    id: 'first_verse',
    name: 'First Verse',
    description: 'Transformed pain into poetry for the first time',
    category: 'poetry_sage',
    criteria: { type: 'session_count', target: 1, specificRequirements: { modality: 'poetry' } },
    rarity: 'common',
    healingValue: 'Beginning the sacred work of meaning-making through verse',
    icon: '📝',
    color: 'bg-pink-100 text-pink-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Poetry transforms suffering into beauty', value: 'poetry_wisdom_1' }
    ]
  },
  {
    id: 'metaphor_weaver',
    name: 'Metaphor Weaver',
    description: 'Created profound metaphors across 25 poems',
    category: 'poetry_sage',
    criteria: { type: 'session_count', target: 25, specificRequirements: { modality: 'poetry', hasMetaphors: true } },
    rarity: 'rare',
    healingValue: 'Master of symbolic language and meaning creation',
    icon: '🕸️',
    color: 'bg-pink-200 text-pink-900',
    rewards: [
      { type: 'feature_unlock', content: 'Advanced poetry analysis', value: 'poetry_analysis_advanced' }
    ]
  },

  // Sound Healer Badges
  {
    id: 'first_frequency',
    name: 'First Frequency',
    description: 'Experienced healing through therapeutic sound',
    category: 'sound_healer',
    criteria: { type: 'session_count', target: 1, specificRequirements: { modality: 'music' } },
    rarity: 'common',
    healingValue: 'Opening to the medicine of sound and vibration',
    icon: '🔊',
    color: 'bg-green-100 text-green-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Sound is medicine for the soul', value: 'sound_wisdom_1' }
    ]
  },
  {
    id: 'frequency_master',
    name: 'Frequency Master',
    description: 'Achieved nervous system regulation through 50+ sound sessions',
    category: 'sound_healer',
    criteria: { type: 'session_count', target: 50, specificRequirements: { modality: 'music', nervousSystemRegulation: true } },
    rarity: 'epic',
    healingValue: 'Master of therapeutic frequency and vibration healing',
    icon: '🎭',
    color: 'bg-green-200 text-green-900',
    rewards: [
      { type: 'feature_unlock', content: 'Custom frequency generator', value: 'custom_frequencies' }
    ]
  },

  // Movement Guardian Badges
  {
    id: 'first_movement',
    name: 'First Movement',
    description: 'Honored your body\'s wisdom through conscious movement',
    category: 'movement_guardian',
    criteria: { type: 'session_count', target: 1, specificRequirements: { modality: 'movement' } },
    rarity: 'common',
    healingValue: 'Beginning the journey of somatic healing and body wisdom',
    icon: '🏃‍♀️',
    color: 'bg-orange-100 text-orange-800',
    rewards: [
      { type: 'wisdom_insight', content: 'The body remembers what the mind forgets', value: 'movement_wisdom_1' }
    ]
  },
  {
    id: 'somatic_sage',
    name: 'Somatic Sage',
    description: 'Achieved trauma release through 30+ movement sessions',
    category: 'movement_guardian',
    criteria: { type: 'session_count', target: 30, specificRequirements: { modality: 'movement', traumaRelease: true } },
    rarity: 'rare',
    healingValue: 'Master of somatic intelligence and body-based healing',
    icon: '🌿',
    color: 'bg-orange-200 text-orange-900',
    rewards: [
      { type: 'feature_unlock', content: 'Advanced somatic exercises', value: 'advanced_somatic_tools' }
    ]
  },

  // Multimodal Alchemist Badges
  {
    id: 'cross_modal_explorer',
    name: 'Cross-Modal Explorer',
    description: 'Used multiple creative modalities in a single session',
    category: 'multimodal_alchemist',
    criteria: { type: 'modality_exploration', target: 3, timeframe: 'day' },
    rarity: 'uncommon',
    healingValue: 'Embracing the full spectrum of creative healing',
    icon: '🔄',
    color: 'bg-sage-100 text-sage-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Healing happens on multiple dimensions', value: 'multimodal_wisdom_1' }
    ]
  },
  {
    id: 'integration_master',
    name: 'Integration Master',
    description: 'Discovered 10+ cross-modal healing patterns',
    category: 'multimodal_alchemist',
    criteria: { type: 'cross_modal_pattern', target: 10 },
    rarity: 'legendary',
    healingValue: 'Master of holistic, integrated creative healing',
    icon: '⚡',
    color: 'bg-sage-200 text-sage-900',
    rewards: [
      { type: 'feature_unlock', content: 'Master alchemist tools', value: 'alchemist_master_suite' },
      { type: 'community_recognition', content: 'Integration Master status', value: 'master_recognition' }
    ]
  },

  // Community Connector Badges
  {
    id: 'first_share',
    name: 'First Share',
    description: 'Courageously shared your creative expression with the community',
    category: 'community_connector',
    criteria: { type: 'community_connection', target: 1, specificRequirements: { action: 'share' } },
    rarity: 'uncommon',
    healingValue: 'Building bridges through vulnerable creative sharing',
    icon: '🌉',
    color: 'bg-yellow-100 text-yellow-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Vulnerability is the birthplace of courage', value: 'community_wisdom_1' }
    ]
  },
  {
    id: 'healing_witness',
    name: 'Healing Witness',
    description: 'Provided supportive witnessing to 50+ community expressions',
    category: 'community_connector',
    criteria: { type: 'community_connection', target: 50, specificRequirements: { action: 'witness' } },
    rarity: 'rare',
    healingValue: 'Master of sacred witnessing and community healing support',
    icon: '👁️',
    color: 'bg-yellow-200 text-yellow-900',
    rewards: [
      { type: 'feature_unlock', content: 'Advanced witnessing tools', value: 'witnessing_tools_advanced' }
    ]
  },

  // Breakthrough Champion Badges
  {
    id: 'first_breakthrough',
    name: 'First Breakthrough',
    description: 'Experienced your first documented healing breakthrough',
    category: 'breakthrough_champion',
    criteria: { type: 'breakthrough_moment', target: 1 },
    rarity: 'uncommon',
    healingValue: 'Recognizing and celebrating profound moments of healing',
    icon: '💥',
    color: 'bg-rose-100 text-rose-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Breakthroughs happen in sacred moments of courage', value: 'breakthrough_wisdom_1' }
    ]
  },
  {
    id: 'transformation_catalyst',
    name: 'Transformation Catalyst',
    description: 'Achieved 10+ documented breakthrough moments',
    category: 'breakthrough_champion',
    criteria: { type: 'breakthrough_moment', target: 10 },
    rarity: 'legendary',
    healingValue: 'Master of personal transformation and breakthrough achievement',
    icon: '🔥',
    color: 'bg-rose-200 text-rose-900',
    rewards: [
      { type: 'feature_unlock', content: 'Breakthrough analysis suite', value: 'breakthrough_master_tools' },
      { type: 'community_recognition', content: 'Transformation Catalyst status', value: 'catalyst_recognition' }
    ]
  },

  // Consistency Badges
  {
    id: 'seven_day_streak',
    name: 'Seven Day Sanctuary',
    description: 'Maintained creative practice for 7 consecutive days',
    category: 'healing_pioneer',
    criteria: { type: 'consistency', target: 7, timeframe: 'day' },
    rarity: 'uncommon',
    healingValue: 'Building sustainable creative healing practice',
    icon: '📅',
    color: 'bg-indigo-100 text-indigo-800',
    rewards: [
      { type: 'wisdom_insight', content: 'Consistency is the mother of transformation', value: 'consistency_wisdom_1' }
    ]
  },
  {
    id: 'monthly_devotee',
    name: 'Monthly Devotee',
    description: 'Maintained daily creative practice for 30 days',
    category: 'healing_pioneer',
    criteria: { type: 'consistency', target: 30, timeframe: 'day' },
    rarity: 'rare',
    healingValue: 'Demonstrating profound commitment to healing journey',
    icon: '🌙',
    color: 'bg-indigo-200 text-indigo-900',
    rewards: [
      { type: 'feature_unlock', content: 'Advanced progress tracking', value: 'progress_tracking_advanced' }
    ]
  }
];

export default function CreativeLearningBadges({ onBadgeUnlocked, className = '' }: CreativeLearningBadgesProps) {
  const [badges, setBadges] = useState<CreativeLearningBadge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [selectedBadge, setSelectedBadge] = useState<CreativeLearningBadge | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [celebratingBadge, setCelebratingBadge] = useState<CreativeLearningBadge | null>(null);

  const { currentMood } = useMoodContext();

  // Initialize badges with progress calculation
  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('alchm_badge_progress') || '{}');
    const savedUnlocked = JSON.parse(localStorage.getItem('alchm_unlocked_badges') || '[]');
    
    // Initialize badges with current progress
    const initializedBadges = CREATIVE_BADGES.map(badgeTemplate => {
      const progress = calculateBadgeProgress(badgeTemplate.criteria);
      const isUnlocked = savedUnlocked.includes(badgeTemplate.id) || progress >= badgeTemplate.criteria.target;
      
      return {
        ...badgeTemplate,
        progress: Math.min(progress, badgeTemplate.criteria.target),
        isUnlocked,
        unlockedAt: isUnlocked && !savedUnlocked.includes(badgeTemplate.id) ? new Date() : undefined
      };
    });

    setBadges(initializedBadges);

    // Check for newly unlocked badges
    initializedBadges.forEach(badge => {
      if (badge.isUnlocked && !savedUnlocked.includes(badge.id)) {
        setTimeout(() => celebrateBadge(badge), Math.random() * 2000);
        savedUnlocked.push(badge.id);
      }
    });

    localStorage.setItem('alchm_unlocked_badges', JSON.stringify(savedUnlocked));
  }, []);

  // Calculate progress based on criteria
  const calculateBadgeProgress = useCallback((criteria: BadgeCriteria): number => {
    // This would integrate with actual user data
    // For now, returning mock progress based on localStorage data
    const sessions = JSON.parse(localStorage.getItem('alchm_creative_sessions') || '[]');
    const communityActions = JSON.parse(localStorage.getItem('alchm_community_actions') || '[]');
    
    switch (criteria.type) {
      case 'session_count':
        const filteredSessions = sessions.filter((session: any) => {
          if (criteria.specificRequirements?.modality) {
            return session.type === criteria.specificRequirements.modality;
          }
          return true;
        });
        return filteredSessions.length;

      case 'modality_exploration':
        // Count unique modalities used in timeframe
        const recentSessions = sessions.filter((session: any) => {
          if (criteria.timeframe === 'day') {
            return (Date.now() - new Date(session.timestamp).getTime()) < 24 * 60 * 60 * 1000;
          }
          return true;
        });
        const uniqueModalities = new Set(recentSessions.map((s: any) => s.type));
        return uniqueModalities.size;

      case 'community_connection':
        return communityActions.filter((action: any) => 
          !criteria.specificRequirements?.action || action.type === criteria.specificRequirements.action
        ).length;

      case 'consistency':
        // Calculate streak based on daily sessions
        let streak = 0;
        const sortedSessions = sessions.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        let currentDate = new Date();
        for (let i = 0; i < criteria.target; i++) {
          const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
          
          const hasSessionOnDay = sortedSessions.some((session: any) => {
            const sessionDate = new Date(session.timestamp);
            return sessionDate >= dayStart && sessionDate < dayEnd;
          });
          
          if (hasSessionOnDay) {
            streak++;
          } else {
            break;
          }
        }
        return streak;

      case 'cross_modal_pattern':
        // Mock pattern detection - would integrate with actual pattern recognition
        return Math.floor(sessions.length / 10); // 1 pattern per 10 sessions

      case 'breakthrough_moment':
        // Count sessions with breakthrough tags
        return sessions.filter((session: any) => 
          session.insights?.some((insight: string) => insight.toLowerCase().includes('breakthrough'))
        ).length;

      default:
        return 0;
    }
  }, []);

  // Celebrate badge unlock
  const celebrateBadge = useCallback((badge: CreativeLearningBadge) => {
    setCelebratingBadge(badge);
    onBadgeUnlocked?.(badge);
    
    // Haptic celebration
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Auto-hide celebration after 5 seconds
    setTimeout(() => setCelebratingBadge(null), 5000);
  }, [onBadgeUnlocked]);

  // Filter badges by category and unlock status
  const filteredBadges = useMemo(() => {
    let filtered = badges;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(badge => badge.category === selectedCategory);
    }
    
    if (showUnlockedOnly) {
      filtered = filtered.filter(badge => badge.isUnlocked);
    }
    
    // Sort by rarity and progress
    const rarityOrder = { 'legendary': 5, 'epic': 4, 'rare': 3, 'uncommon': 2, 'common': 1 };
    filtered.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1;
      if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      return (b.progress / b.criteria.target) - (a.progress / a.criteria.target);
    });
    
    return filtered;
  }, [badges, selectedCategory, showUnlockedOnly]);

  // Get badge rarity styling
  const getBadgeRarityStyle = useCallback((rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 shadow-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50';
      case 'epic': return 'border-purple-400 shadow-purple-200 bg-gradient-to-br from-purple-50 to-pink-50';
      case 'rare': return 'border-blue-400 shadow-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50';
      case 'uncommon': return 'border-green-400 shadow-green-200 bg-gradient-to-br from-green-50 to-emerald-50';
      default: return 'border-gray-300 shadow-gray-100 bg-white';
    }
  }, []);

  // Statistics
  const badgeStats = useMemo(() => {
    const unlocked = badges.filter(b => b.isUnlocked).length;
    const total = badges.length;
    const categories = new Set(badges.filter(b => b.isUnlocked).map(b => b.category)).size;
    
    return { unlocked, total, categories };
  }, [badges]);

  return (
    <div className={`creative-learning-badges ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          Creative Healing Badges
        </h3>
        <p className="text-sm text-gray-600">
          Celebrate your journey of artistic and emotional growth
        </p>
      </div>

      {/* Badge Statistics */}
      <div className="badge-stats mb-6 p-4 bg-gradient-to-r from-sage-50 to-green-50 rounded-2xl">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-medium text-sage-600">{badgeStats.unlocked}</div>
            <div className="text-xs text-gray-600">Badges Earned</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-green-600">{badgeStats.categories}</div>
            <div className="text-xs text-gray-600">Categories Unlocked</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-blue-600">
              {Math.round((badgeStats.unlocked / badgeStats.total) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Journey Completed</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-sage-400 to-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(badgeStats.unlocked / badgeStats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="badge-filters mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as BadgeCategory | 'all')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sage-300"
            >
              <option value="all">All Categories</option>
              {Object.entries(BADGE_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-unlocked"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="show-unlocked" className="text-sm text-gray-700">
              Show only unlocked badges
            </label>
          </div>
        </div>

        {selectedCategory !== 'all' && (
          <div className="category-description p-3 bg-gradient-to-br from-sage-50 to-green-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-1">
              {BADGE_CATEGORIES[selectedCategory].icon} {BADGE_CATEGORIES[selectedCategory].name}
            </h4>
            <p className="text-sm text-gray-600">
              {BADGE_CATEGORIES[selectedCategory].description}
            </p>
          </div>
        )}
      </div>

      {/* Badges Grid */}
      <div className="badges-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map(badge => (
          <Card 
            key={badge.id}
            className={`badge-card cursor-pointer transition-all duration-300 hover:scale-105 border-2 shadow-lg ${
              badge.isUnlocked 
                ? getBadgeRarityStyle(badge.rarity)
                : 'border-gray-200 bg-gray-50 opacity-75'
            }`}
            onClick={() => setSelectedBadge(badge)}
          >
            <div className="p-6">
              {/* Badge Header */}
              <div className="text-center mb-4">
                <div className={`text-4xl mb-2 ${badge.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                <h4 className={`font-medium text-lg ${badge.isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Badge 
                    className={`capitalize ${badge.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                      badge.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                      badge.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                      badge.rarity === 'uncommon' ? 'bg-green-200 text-green-800' :
                      'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {badge.rarity}
                  </Badge>
                  {badge.isUnlocked && (
                    <Badge className="bg-sage-200 text-sage-800">
                      ✓ Unlocked
                    </Badge>
                  )}
                </div>
              </div>

              {/* Badge Description */}
              <p className={`text-sm text-center mb-4 ${badge.isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                {badge.description}
              </p>

              {/* Progress Bar */}
              {!badge.isUnlocked && (
                <div className="progress-section mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress}/{badge.criteria.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sage-400 to-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (badge.progress / badge.criteria.target) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Healing Value */}
              <div className="healing-value p-3 bg-white/50 rounded-lg">
                <div className="text-xs font-medium text-gray-600 mb-1">Healing Value:</div>
                <p className="text-xs italic text-gray-700">{badge.healingValue}</p>
              </div>

              {/* Unlock Date */}
              {badge.isUnlocked && badge.unlockedAt && (
                <div className="text-center mt-3">
                  <div className="text-xs text-gray-500">
                    Unlocked {badge.unlockedAt.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="empty-state text-center py-12">
          <div className="text-6xl mb-4 opacity-30">🏆</div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            No badges match your filters
          </h4>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Try adjusting your filters or continue your creative healing journey to unlock more badges.
          </p>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="badge-detail-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-center flex-1">
                  <div className={`text-6xl mb-3 ${selectedBadge.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {selectedBadge.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-800">{selectedBadge.name}</h3>
                  <Badge className="mt-2 capitalize">
                    {selectedBadge.rarity}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedBadge.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Healing Value</h4>
                  <p className="text-sm italic text-sage-700 bg-sage-50 p-3 rounded-lg">
                    {selectedBadge.healingValue}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Category</h4>
                  <p className="text-sm text-gray-600">
                    {BADGE_CATEGORIES[selectedBadge.category].icon} {BADGE_CATEGORIES[selectedBadge.category].name}
                  </p>
                </div>

                {!selectedBadge.isUnlocked && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Progress</h4>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-sage-400 to-green-400 h-3 rounded-full"
                        style={{ width: `${Math.min(100, (selectedBadge.progress / selectedBadge.criteria.target) * 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedBadge.progress} / {selectedBadge.criteria.target} completed
                    </p>
                  </div>
                )}

                {selectedBadge.rewards.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Rewards</h4>
                    <div className="space-y-2">
                      {selectedBadge.rewards.map((reward, i) => (
                        <div key={i} className="text-sm bg-blue-50 p-2 rounded">
                          <span className="font-medium">
                            {reward.type === 'feature_unlock' && '🔓 '}
                            {reward.type === 'wisdom_insight' && '💡 '}
                            {reward.type === 'customization' && '🎨 '}
                            {reward.type === 'community_recognition' && '👑 '}
                            {reward.type === 'healing_tool' && '🛠️ '}
                          </span>
                          {reward.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBadge.isUnlocked && selectedBadge.unlockedAt && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Unlocked</h4>
                    <p className="text-sm text-gray-600">
                      {selectedBadge.unlockedAt.toLocaleDateString()} at {selectedBadge.unlockedAt.toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Badge Celebration Modal */}
      {celebratingBadge && (
        <div className="celebration-modal fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="celebration-content bg-white rounded-3xl p-8 text-center max-w-md transform animate-pulse">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-medium text-gray-800 mb-2">
              Badge Unlocked!
            </h3>
            
            <div className="text-6xl mb-4">{celebratingBadge.icon}</div>
            <h4 className="text-xl font-medium text-sage-700 mb-2">
              {celebratingBadge.name}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {celebratingBadge.description}
            </p>
            
            <div className="bg-sage-50 p-4 rounded-lg mb-6">
              <p className="text-sm italic text-sage-800">
                "{celebratingBadge.healingValue}"
              </p>
            </div>
            
            <Button 
              onClick={() => setCelebratingBadge(null)}
              className="bg-sage-400 hover:bg-sage-500 text-white"
            >
              Continue Journey
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}