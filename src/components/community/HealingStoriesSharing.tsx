'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Shield, 
  Eye,
  EyeOff,
  Lock,
  Share2,
  MessageCircle,
  Star,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Bookmark,
  ThumbsUp,
  Flag,
  Globe,
  Users,
  Lightbulb,
  Compass,
  Leaf,
  Sun,
  Moon,
  Sparkles,
  Award,
  ChevronRight,
  Edit3,
  Archive
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

interface HealingStory {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  theme: string[];
  author: string; // Anonymous identifier
  postedAt: Date;
  lastUpdated?: Date;
  readTime: number; // minutes
  isAnonymous: boolean;
  privacyLevel: 'public' | 'community' | 'support-groups';
  traumaInformed: boolean;
  professionallyReviewed: boolean;
  triggerWarnings?: string[];
  supportiveContent: boolean;
  hopefulOutcome: boolean;
  pathwayRelated?: string;
  stage: 'early-healing' | 'mid-journey' | 'growth-phase' | 'transformation';
  communityReactions: {
    hearts: number;
    inspired: number;
    relates: number;
    grateful: number;
    bookmarks: number;
  };
  supportiveComments: number;
  helpfulVotes: number;
  reportCount: number;
  moderationStatus: 'approved' | 'pending' | 'flagged';
  tags: string[];
  culturalContext?: string[];
  ageGroup?: string;
  relatedStories?: string[];
  encouragementLevel: 'gentle' | 'moderate' | 'strong';
  wisdomShared: string[];
  lessonsSummary: string;
  communityImpact: 'low' | 'medium' | 'high' | 'transformative';
}

interface StoryFilter {
  category: string;
  stage: string;
  theme: string;
  encouragementLevel: string;
  readTime: string;
}

interface HealingStoriesSharingProps {
  userProgress: UserProgress | null;
}

export function HealingStoriesSharing({ userProgress }: HealingStoriesSharingProps) {
  const [stories, setStories] = useState<HealingStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<HealingStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<StoryFilter>({
    category: 'all',
    stage: 'all',
    theme: 'all',
    encouragementLevel: 'all',
    readTime: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedStories, setBookmarkedStories] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Stories', icon: Globe },
    { id: 'mindfulness', name: 'Mindfulness Journey', icon: Leaf },
    { id: 'trauma-recovery', name: 'Trauma Recovery', icon: Shield },
    { id: 'relationships', name: 'Relationship Healing', icon: Heart },
    { id: 'anxiety-depression', name: 'Mental Health', icon: Sun },
    { id: 'purpose-meaning', name: 'Finding Purpose', icon: Compass },
    { id: 'grief-loss', name: 'Grief & Loss', icon: Moon },
    { id: 'addiction-recovery', name: 'Addiction Recovery', icon: Star }
  ];

  const stageFilters = [
    { id: 'all', name: 'All Stages' },
    { id: 'early-healing', name: 'Early Healing' },
    { id: 'mid-journey', name: 'Mid Journey' },
    { id: 'growth-phase', name: 'Growth Phase' },
    { id: 'transformation', name: 'Transformation' }
  ];

  const themeFilters = [
    { id: 'all', name: 'All Themes' },
    { id: 'breakthrough', name: 'Breakthrough Moments' },
    { id: 'setback-recovery', name: 'Overcoming Setbacks' },
    { id: 'daily-practice', name: 'Daily Practices' },
    { id: 'community-support', name: 'Community Support' },
    { id: 'professional-help', name: 'Professional Help' },
    { id: 'self-discovery', name: 'Self Discovery' },
    { id: 'hope-resilience', name: 'Hope & Resilience' }
  ];

  useEffect(() => {
    // Simulate loading healing stories
    setTimeout(() => {
      const mockStories: HealingStory[] = [
        {
          id: 'story-1',
          title: 'Finding Light in the Darkness: My Anxiety Recovery Journey',
          content: `Three months ago, I couldn't leave my house without having a panic attack. Today, I walked to the coffee shop down the street and had a real conversation with a stranger. 

The journey hasn't been linear. There were days when I thought I was moving backwards, when the anxiety felt like a storm that would never pass. But through consistent mindfulness practice and the support of this anonymous community, I've learned that healing isn't about becoming fearless—it's about becoming friends with your own courage.

What helped me most was starting with just three mindful breaths each morning. That's it. Three breaths. From there, I slowly built a practice that includes gentle movement, journaling, and connecting with others who understand this path.

To anyone reading this who's struggling with anxiety: you're not broken. You're not alone. And that tiny spark of hope you feel sometimes? That's real, and it's enough to start with.

The mindfulness pathway in our community taught me that anxiety isn't the enemy—it's a messenger. When I stopped fighting it and started listening with compassion, everything changed.`,
          excerpt: 'From panic attacks to peaceful conversations: how mindfulness and community support transformed my relationship with anxiety.',
          category: 'anxiety-depression',
          theme: ['breakthrough', 'daily-practice', 'community-support'],
          author: 'QuietStrength',
          postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          readTime: 4,
          isAnonymous: true,
          privacyLevel: 'community',
          traumaInformed: true,
          professionallyReviewed: true,
          triggerWarnings: ['anxiety', 'panic attacks'],
          supportiveContent: true,
          hopefulOutcome: true,
          pathwayRelated: 'mindful-awareness',
          stage: 'growth-phase',
          communityReactions: {
            hearts: 156,
            inspired: 89,
            relates: 203,
            grateful: 67,
            bookmarks: 94
          },
          supportiveComments: 23,
          helpfulVotes: 198,
          reportCount: 0,
          moderationStatus: 'approved',
          tags: ['anxiety', 'mindfulness', 'community-support', 'daily-practice', 'hope'],
          ageGroup: 'young-adult',
          encouragementLevel: 'strong',
          wisdomShared: [
            'Start with just three mindful breaths',
            'Anxiety is a messenger, not an enemy',
            'Healing isn\'t linear—setbacks are part of the process',
            'Community support makes all the difference'
          ],
          lessonsSummary: 'Small, consistent practices and community support can transform our relationship with anxiety from one of fear to one of compassionate understanding.',
          communityImpact: 'high'
        },
        {
          id: 'story-2',
          title: 'Across the Marsh: Healing After Loss',
          content: `I lost my partner six months ago, and for a long time, I felt like I was drowning in a marsh with no way out. The grief felt endless, suffocating. I couldn't see past the next breath, let alone imagine a future.

This community became my lifeline. The anonymous nature meant I could share my darkest thoughts without judgment. People here understood that grief isn't something you "get over"—it's something you learn to carry with love.

The pathways helped me understand that healing doesn't mean forgetting or "moving on." It means learning to hold space for both sorrow and joy, for memories and new possibilities. The grief is still here, but now it sits alongside hope.

What surprised me most was discovering that my capacity for empathy had grown. Having walked through this marsh of loss, I could now sit with others in their darkness and offer the same gift this community gave me: presence without pressure to fix or rush.

To anyone walking through loss: the marsh is real, the darkness is valid, and you don't have to navigate it alone. There are people here who will walk beside you, even when the path seems impossible.`,
          excerpt: 'A journey through grief that discovered how loss can deepen our capacity for compassion and connection.',
          category: 'grief-loss',
          theme: ['hope-resilience', 'community-support', 'self-discovery'],
          author: 'MarshWalker',
          postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          readTime: 5,
          isAnonymous: true,
          privacyLevel: 'community',
          traumaInformed: true,
          professionallyReviewed: true,
          triggerWarnings: ['grief', 'loss', 'death'],
          supportiveContent: true,
          hopefulOutcome: true,
          stage: 'mid-journey',
          communityReactions: {
            hearts: 267,
            inspired: 134,
            relates: 178,
            grateful: 89,
            bookmarks: 156
          },
          supportiveComments: 34,
          helpfulVotes: 289,
          reportCount: 0,
          moderationStatus: 'approved',
          tags: ['grief', 'loss', 'community', 'empathy', 'healing-journey'],
          ageGroup: 'adult',
          encouragementLevel: 'moderate',
          wisdomShared: [
            'Grief isn\'t something you get over—it\'s something you learn to carry with love',
            'Healing means holding space for both sorrow and joy',
            'Loss can deepen our capacity for empathy',
            'You don\'t have to navigate darkness alone'
          ],
          lessonsSummary: 'Grief transforms us not by taking away our capacity to feel, but by expanding our ability to hold complexity and support others in their healing.',
          communityImpact: 'transformative'
        },
        {
          id: 'story-3',
          title: 'Breaking Free: My Journey from Trauma to Empowerment',
          content: `*Content note: This story discusses trauma recovery with care and hope*

For years, I carried trauma like a heavy backpack I couldn't set down. It affected every relationship, every decision, every moment of my day. I felt broken, like damaged goods that could never be whole again.

The trauma healing pathway here saved my life. Not because it erased what happened, but because it taught me that my trauma doesn't define my worth. The professional guidance, combined with peer support from others who truly understand, created a safety net I'd never had before.

Recovery isn't about "getting back to who you were before"—that person doesn't exist anymore, and that's okay. It's about discovering who you're becoming through the process of healing. I've learned to see my sensitivity as a superpower, my hypervigilance as a protective gift I can now choose when to use.

The most powerful moment was when I realized I had gone three full days without thinking about my trauma. Not because I was avoiding it, but because I was living fully in my present life. That's when I knew: I wasn't just surviving anymore—I was thriving.

To my fellow survivors: your healing is not selfish. Your joy is not betrayal. Your growth is not erasure of your experience. You deserve safety, love, and the beautiful life you're creating one brave step at a time.`,
          excerpt: 'A powerful story of reclaiming life after trauma, discovering that healing creates not who we were, but who we\'re becoming.',
          category: 'trauma-recovery',
          theme: ['breakthrough', 'professional-help', 'hope-resilience', 'self-discovery'],
          author: 'Phoenix_Rising',
          postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          readTime: 6,
          isAnonymous: true,
          privacyLevel: 'community',
          traumaInformed: true,
          professionallyReviewed: true,
          triggerWarnings: ['trauma', 'PTSD recovery'],
          supportiveContent: true,
          hopefulOutcome: true,
          pathwayRelated: 'trauma-healing',
          stage: 'transformation',
          communityReactions: {
            hearts: 345,
            inspired: 234,
            relates: 189,
            grateful: 123,
            bookmarks: 267
          },
          supportiveComments: 45,
          helpfulVotes: 398,
          reportCount: 0,
          moderationStatus: 'approved',
          tags: ['trauma-recovery', 'PTSD', 'resilience', 'professional-help', 'post-traumatic-growth'],
          ageGroup: 'adult',
          encouragementLevel: 'strong',
          wisdomShared: [
            'Trauma doesn\'t define your worth',
            'Recovery is about becoming, not returning',
            'Sensitivity can be a superpower when understood',
            'Your healing is not selfish—it\'s necessary'
          ],
          lessonsSummary: 'Trauma recovery is not about returning to who we were, but about discovering the resilient, empowered person we are becoming through the healing process.',
          communityImpact: 'transformative'
        },
        {
          id: 'story-4',
          title: 'Small Steps, Big Changes: Finding My Daily Rhythm',
          content: `I used to think healing required dramatic breakthroughs and life-changing moments. What I discovered instead was the profound power of tiny, consistent actions.

My healing journey started with making my bed every morning. That's it. One small act of care for my space and myself. From there, I added five minutes of gentle stretching. Then three mindful breaths before meals. These weren't grand gestures—they were whispers of self-compassion.

Six months later, these small practices have created a rhythm that carries me through difficult days. When anxiety spikes or depression settles in, I have these gentle anchors to return to. My made bed becomes proof that I can complete something. The stretches remind me I have a body worth caring for.

The mindfulness pathway taught me that transformation happens in the small moments between breaths, not just in the big revelations. Every time I choose gentleness over self-criticism, every time I honor my needs instead of ignoring them—these are the real victories.

What strikes me most is how these practices have rippled into my relationships. When I learned to be patient with myself, I became more patient with others. When I created space for my own healing, I could hold space for others' journeys too.

To anyone feeling overwhelmed by the idea of healing: start impossibly small. One breath. One moment of kindness toward yourself. One tiny step. The path reveals itself as you walk it.`,
          excerpt: 'How tiny daily practices created profound transformation: the power of starting impossibly small on the healing journey.',
          category: 'mindfulness',
          theme: ['daily-practice', 'self-discovery', 'breakthrough'],
          author: 'GentleSteps',
          postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          readTime: 4,
          isAnonymous: true,
          privacyLevel: 'community',
          traumaInformed: true,
          professionallyReviewed: true,
          supportiveContent: true,
          hopefulOutcome: true,
          pathwayRelated: 'mindful-awareness',
          stage: 'growth-phase',
          communityReactions: {
            hearts: 198,
            inspired: 145,
            relates: 234,
            grateful: 78,
            bookmarks: 167
          },
          supportiveComments: 28,
          helpfulVotes: 256,
          reportCount: 0,
          moderationStatus: 'approved',
          tags: ['daily-practice', 'mindfulness', 'small-steps', 'self-compassion', 'consistency'],
          ageGroup: 'adult',
          encouragementLevel: 'gentle',
          wisdomShared: [
            'Healing happens in small moments between breaths',
            'Start impossibly small—one breath, one moment',
            'Self-compassion ripples into all relationships',
            'Tiny practices create profound transformation'
          ],
          lessonsSummary: 'Transformation doesn\'t require dramatic breakthroughs—it grows from the accumulation of small, consistent acts of self-compassion and mindful presence.',
          communityImpact: 'high'
        }
      ];

      setStories(mockStories);
      setFilteredStories(mockStories);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = stories;

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(story => story.category === filters.category);
    }
    if (filters.stage !== 'all') {
      filtered = filtered.filter(story => story.stage === filters.stage);
    }
    if (filters.theme !== 'all') {
      filtered = filtered.filter(story => story.theme.includes(filters.theme));
    }
    if (filters.encouragementLevel !== 'all') {
      filtered = filtered.filter(story => story.encouragementLevel === filters.encouragementLevel);
    }
    if (filters.readTime !== 'all') {
      if (filters.readTime === 'short') {
        filtered = filtered.filter(story => story.readTime <= 3);
      } else if (filters.readTime === 'medium') {
        filtered = filtered.filter(story => story.readTime > 3 && story.readTime <= 7);
      } else if (filters.readTime === 'long') {
        filtered = filtered.filter(story => story.readTime > 7);
      }
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStories(filtered);
  }, [filters, searchTerm, stories]);

  const handleBookmark = (storyId: string) => {
    setBookmarkedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleReaction = (storyId: string, reactionType: keyof HealingStory['communityReactions']) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? {
            ...story,
            communityReactions: {
              ...story.communityReactions,
              [reactionType]: story.communityReactions[reactionType] + 1
            }
          }
        : story
    ));
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'early-healing': return <Leaf className="w-4 h-4" />;
      case 'mid-journey': return <Sun className="w-4 h-4" />;
      case 'growth-phase': return <Sparkles className="w-4 h-4" />;
      case 'transformation': return <Award className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'early-healing': return 'text-green-400';
      case 'mid-journey': return 'text-yellow-400';
      case 'growth-phase': return 'text-blue-400';
      case 'transformation': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getEncouragementColor = (level: string) => {
    switch (level) {
      case 'gentle': return 'text-green-400';
      case 'moderate': return 'text-blue-400';
      case 'strong': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/20 border">
          <div className="p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <BookOpen className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-light">Loading healing stories...</span>
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
          <BookOpen className="w-8 h-8" />
          Healing Stories: Across the Marsh
        </h2>
        <p className="text-white/80 max-w-3xl mx-auto leading-relaxed">
          Share and discover anonymous healing stories that inspire hope, build connection, 
          and illuminate the many paths through life's challenges toward growth and resilience.
        </p>
      </div>

      {/* Privacy Guarantee */}
      <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-300/30 border max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-300" />
            <h3 className="text-xl font-medium text-blue-100">Safe Story Sharing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100/90">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">Complete anonymity maintained</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Trauma-informed moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Professional review for safety</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Supportive community guidelines</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Share Your Story Button */}
      <div className="text-center">
        <Button
          onClick={() => setShowShareModal(true)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 text-lg gap-3"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Share Your Healing Story
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/20 border">
        <div className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search stories by title, themes, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Filter Categories */}
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(({ id, name, icon: Icon }) => (
                  <Button
                    key={id}
                    onClick={() => setFilters(prev => ({ ...prev, category: id }))}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center gap-1 ${
                      filters.category === id
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    } border border-white/20`}
                  >
                    <Icon className="w-3 h-3" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Healing Stage</label>
                <select
                  value={filters.stage}
                  onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                >
                  {stageFilters.map(stage => (
                    <option key={stage.id} value={stage.id} className="bg-gray-800">{stage.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Theme</label>
                <select
                  value={filters.theme}
                  onChange={(e) => setFilters(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                >
                  {themeFilters.map(theme => (
                    <option key={theme.id} value={theme.id} className="bg-gray-800">{theme.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Read Time</label>
                <select
                  value={filters.readTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                >
                  <option value="all" className="bg-gray-800">All Lengths</option>
                  <option value="short" className="bg-gray-800">Short (≤3 min)</option>
                  <option value="medium" className="bg-gray-800">Medium (4-7 min)</option>
                  <option value="long" className="bg-gray-800">Long (8+ min)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stories Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-light text-white">
            {filteredStories.length} {filteredStories.length === 1 ? 'Story' : 'Stories'} Found
          </h3>
          {bookmarkedStories.length > 0 && (
            <div className="flex items-center gap-2 text-white/70">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm">{bookmarkedStories.length} bookmarked</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStories.map((story, index) => {
            const isBookmarked = bookmarkedStories.includes(story.id);
            
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/20 border-2 hover:border-white/40 transition-all duration-300 cursor-pointer relative group overflow-hidden">
                  {/* Story Header */}
                  <div className="p-6">
                    {/* Status Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {story.traumaInformed && (
                          <div className="px-2 py-1 rounded-full bg-green-500/20 backdrop-blur-sm text-xs text-green-300 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Trauma-Informed
                          </div>
                        )}
                        {story.professionallyReviewed && (
                          <div className="px-2 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm text-xs text-blue-300 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Reviewed
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(story.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isBookmarked 
                            ? 'bg-yellow-500/20 text-yellow-300' 
                            : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Title and Meta */}
                    <h4 className="text-xl font-medium text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>

                    {/* Author and Timing */}
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {story.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {story.readTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {story.postedAt.toLocaleDateString()}
                      </span>
                    </div>

                    {/* Stage and Encouragement Level */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center gap-1 ${getStageColor(story.stage)}`}>
                        {getStageIcon(story.stage)}
                        <span className="text-xs capitalize">{story.stage.replace('-', ' ')}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${getEncouragementColor(story.encouragementLevel)}`}>
                        <Heart className="w-3 h-3" />
                        <span className="text-xs capitalize">{story.encouragementLevel} encouragement</span>
                      </div>
                    </div>

                    {/* Trigger Warnings */}
                    {story.triggerWarnings && story.triggerWarnings.length > 0 && (
                      <div className="bg-amber-500/20 rounded-lg p-3 mb-4 backdrop-blur-sm border border-amber-300/30">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-amber-300" />
                          <span className="text-amber-300 text-sm font-medium">Content Note</span>
                        </div>
                        <p className="text-amber-100/90 text-xs">
                          This story discusses: {story.triggerWarnings.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.slice(0, 4).map((tag, idx) => (
                        <div key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                          #{tag}
                        </div>
                      ))}
                      {story.tags.length > 4 && (
                        <div className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                          +{story.tags.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Community Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReaction(story.id, 'hearts');
                          }}
                          className="flex items-center gap-1 text-pink-300 hover:text-pink-200 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{story.communityReactions.hearts}</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReaction(story.id, 'inspired');
                          }}
                          className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{story.communityReactions.inspired}</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReaction(story.id, 'relates');
                          }}
                          className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{story.communityReactions.relates}</span>
                        </button>
                      </div>
                      
                      <Button
                        onClick={() => {
                          setSelectedStory(story.id);
                          setShowStoryModal(true);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 px-4 py-2 text-sm group/btn"
                      >
                        <span>Read Full Story</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Share Story Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-light">Share Your Healing Story</h2>
                  <Button
                    onClick={() => setShowShareModal(false)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Close
                  </Button>
                </div>

                {/* Safety Information */}
                <Card className="bg-green-500/20 backdrop-blur-sm border-green-300/30 mb-6">
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-green-100 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Your Safety & Privacy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-100/90 text-sm">
                      <div>• Complete anonymity guaranteed</div>
                      <div>• Professional moderation review</div>
                      <div>• Trauma-informed editing support</div>
                      <div>• Option to withdraw story anytime</div>
                      <div>• Community guidelines protection</div>
                      <div>• Crisis support resources available</div>
                    </div>
                  </div>
                </Card>

                {/* Guidelines */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/20 mb-6">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-4">Story Sharing Guidelines</h3>
                    <div className="space-y-2 text-white/80 text-sm">
                      <div>• Share your authentic experience with hope and healing</div>
                      <div>• Include trigger warnings for potentially difficult content</div>
                      <div>• Focus on growth, resilience, and lessons learned</div>
                      <div>• Respect others' experiences and avoid giving direct advice</div>
                      <div>• Remember that your story may deeply impact someone's healing journey</div>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log('Starting story sharing process');
                      setShowShareModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                  >
                    Begin Sharing Story
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Story Modal */}
      <AnimatePresence>
        {showStoryModal && selectedStory && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStoryModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const story = stories.find(s => s.id === selectedStory);
                if (!story) return null;
                
                return (
                  <div className="p-8 text-white">
                    {/* Story Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-3xl font-light mb-4">{story.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {story.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {story.readTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {story.postedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowStoryModal(false)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        Close
                      </Button>
                    </div>

                    {/* Content Warning */}
                    {story.triggerWarnings && story.triggerWarnings.length > 0 && (
                      <Card className="bg-amber-500/20 backdrop-blur-sm border-amber-300/30 mb-6">
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-300" />
                            <span className="text-amber-300 font-medium">Content Note</span>
                          </div>
                          <p className="text-amber-100/90 text-sm">
                            This story discusses: {story.triggerWarnings.join(', ')}
                          </p>
                        </div>
                      </Card>
                    )}

                    {/* Story Content */}
                    <div className="prose prose-invert max-w-none mb-8">
                      <div className="whitespace-pre-line text-white/90 leading-relaxed">
                        {story.content}
                      </div>
                    </div>

                    {/* Wisdom Summary */}
                    <Card className="bg-blue-500/20 backdrop-blur-sm border-blue-300/30 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-blue-100 mb-4 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Key Wisdom Shared
                        </h3>
                        <div className="space-y-2">
                          {story.wisdomShared.map((wisdom, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-blue-100/90">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{wisdom}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-blue-600/20 rounded-lg">
                          <p className="text-blue-100 text-sm italic">
                            "{story.lessonsSummary}"
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Community Reactions */}
                    <div className="flex items-center gap-4 mb-6">
                      <button 
                        onClick={() => handleReaction(story.id, 'hearts')}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 rounded-lg text-pink-300 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                        <span>Heart ({story.communityReactions.hearts})</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(story.id, 'inspired')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg text-yellow-300 transition-colors"
                      >
                        <Star className="w-5 h-5" />
                        <span>Inspired ({story.communityReactions.inspired})</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(story.id, 'relates')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-300 transition-colors"
                      >
                        <Users className="w-5 h-5" />
                        <span>Relates ({story.communityReactions.relates})</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(story.id, 'grateful')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-300 transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>Grateful ({story.communityReactions.grateful})</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => handleBookmark(story.id)}
                        className={`flex-1 flex items-center justify-center gap-2 ${
                          bookmarkedStories.includes(story.id)
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarkedStories.includes(story.id) ? 'fill-current' : ''}`} />
                        {bookmarkedStories.includes(story.id) ? 'Bookmarked' : 'Bookmark Story'}
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                        onClick={() => console.log('Share encouragement')}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Share Encouragement
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