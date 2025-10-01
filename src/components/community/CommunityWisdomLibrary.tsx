'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { 
  type EphemeralCommunityIdentity,
  TraumaInformedModerator,
  PrivacyContentFilter 
} from '@/lib/community/privacy-engine';

interface CommunityWisdomLibraryProps {
  ephemeralIdentity: EphemeralCommunityIdentity;
}

interface WisdomEntry {
  id: string;
  ephemeralAuthorId: string;
  title: string;
  content: string;
  category: 'coping-strategies' | 'healing-insights' | 'practical-tools' | 'spiritual-wisdom' | 'trauma-recovery' | 'self-care' | 'relationships' | 'purpose-meaning';
  pathway?: string;
  culturalContext?: string;
  tags: string[];
  upvotes: number;
  helpfulCount: number;
  savedCount: number;
  qualityScore: number;
  verificationLevel: 'community' | 'peer-reviewed' | 'expert-endorsed';
  isAnonymous: boolean;
  createdAt: Date;
  lastModified: Date;
  expiresAt: Date;
}

interface WisdomVote {
  entryId: string;
  voterEphemeralId: string;
  voteType: 'helpful' | 'transformative' | 'practical' | 'inspiring';
  createdAt: Date;
}

const WISDOM_CATEGORIES = [
  {
    id: 'coping-strategies',
    name: 'Coping Strategies',
    description: 'Practical techniques for managing difficult moments',
    emoji: '🛡️',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'healing-insights',
    name: 'Healing Insights',
    description: 'Deep realizations and breakthrough moments',
    emoji: '💡',
    color: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'practical-tools',
    name: 'Practical Tools',
    description: 'Step-by-step methods and resources',
    emoji: '🔧',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'spiritual-wisdom',
    name: 'Spiritual Wisdom',
    description: 'Faith, meaning-making, and transcendent perspectives',
    emoji: '✨',
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'trauma-recovery',
    name: 'Trauma Recovery',
    description: 'Healing from traumatic experiences',
    emoji: '🌱',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    description: 'Nurturing and caring for yourself',
    emoji: '🤗',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Building healthy connections and boundaries',
    emoji: '🤝',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'purpose-meaning',
    name: 'Purpose & Meaning',
    description: 'Finding direction and life purpose',
    emoji: '🎯',
    color: 'from-indigo-400 to-purple-500'
  }
];

const SAMPLE_WISDOM_ENTRIES: WisdomEntry[] = [
  {
    id: 'wisdom-1',
    ephemeralAuthorId: 'anon-abc123',
    title: 'The 5-4-3-2-1 Grounding Technique That Saved Me',
    content: 'When panic hits, I name 5 things I can see, 4 I can touch, 3 I can hear, 2 I can smell, and 1 I can taste. It pulls me back to my body and the present moment. I keep this written on my phone for emergencies.',
    category: 'coping-strategies',
    pathway: 'resilience',
    tags: ['anxiety', 'panic', 'grounding', 'immediate-help'],
    upvotes: 847,
    helpfulCount: 1203,
    savedCount: 892,
    qualityScore: 4.8,
    verificationLevel: 'peer-reviewed',
    isAnonymous: true,
    createdAt: new Date('2025-01-15'),
    lastModified: new Date('2025-01-15'),
    expiresAt: new Date('2026-01-15')
  },
  {
    id: 'wisdom-2',
    ephemeralAuthorId: 'anon-def456',
    title: 'How I Learned to Forgive Myself',
    content: 'I wrote letters to myself at different ages - the scared 8-year-old, the confused 16-year-old, the struggling 25-year-old. I told each version what they needed to hear. It was like becoming my own loving parent. Healing isn\'t linear, and that\'s okay.',
    category: 'healing-insights',
    pathway: 'becoming',
    tags: ['self-forgiveness', 'inner-child', 'compassion', 'healing-journey'],
    upvotes: 1204,
    helpfulCount: 1876,
    savedCount: 1543,
    qualityScore: 4.9,
    verificationLevel: 'community',
    isAnonymous: true,
    createdAt: new Date('2025-01-10'),
    lastModified: new Date('2025-01-10'),
    expiresAt: new Date('2026-01-10')
  },
  {
    id: 'wisdom-3',
    ephemeralAuthorId: 'anon-ghi789',
    title: 'My Morning Ritual for Dark Days',
    content: 'On days when getting out of bed feels impossible: 1) I make my bed immediately - it\'s one accomplished thing. 2) I drink a full glass of water. 3) I play one song that makes me feel strong. 4) I text one person I care about. These tiny acts create momentum.',
    category: 'practical-tools',
    pathway: 'resilience',
    tags: ['depression', 'morning-routine', 'momentum', 'self-care'],
    upvotes: 923,
    helpfulCount: 1456,
    savedCount: 1234,
    qualityScore: 4.7,
    verificationLevel: 'peer-reviewed',
    isAnonymous: true,
    createdAt: new Date('2025-01-08'),
    lastModified: new Date('2025-01-08'),
    expiresAt: new Date('2026-01-08')
  },
  {
    id: 'wisdom-4',
    ephemeralAuthorId: 'anon-jkl012',
    title: 'Finding God/Universe/Source in the Mess',
    content: 'I lost my faith during trauma, then found it again in unexpected places - in strangers\' kindness, in my own resilience, in the way flowers grow through concrete. The sacred doesn\'t avoid suffering; it transforms it. Your spiritual path can be uniquely yours.',
    category: 'spiritual-wisdom',
    pathway: 'purpose',
    tags: ['faith-journey', 'meaning-making', 'trauma-recovery', 'spirituality'],
    upvotes: 756,
    helpfulCount: 1123,
    savedCount: 967,
    qualityScore: 4.6,
    verificationLevel: 'community',
    isAnonymous: true,
    createdAt: new Date('2025-01-05'),
    lastModified: new Date('2025-01-05'),
    expiresAt: new Date('2026-01-05')
  }
];

const VOTE_TYPES = [
  { id: 'helpful', emoji: '👍', label: 'Helpful', description: 'This advice was practical and useful' },
  { id: 'transformative', emoji: '✨', label: 'Transformative', description: 'This changed my perspective' },
  { id: 'practical', emoji: '🔧', label: 'Practical', description: 'Easy to implement and actionable' },
  { id: 'inspiring', emoji: '💖', label: 'Inspiring', description: 'This gave me hope and motivation' }
];

export default function CommunityWisdomLibrary({ ephemeralIdentity }: CommunityWisdomLibraryProps) {
  const [currentView, setCurrentView] = useState<'browse' | 'contribute' | 'my-contributions'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [wisdomEntries, setWisdomEntries] = useState<WisdomEntry[]>(SAMPLE_WISDOM_ENTRIES);
  const [newWisdomTitle, setNewWisdomTitle] = useState('');
  const [newWisdomContent, setNewWisdomContent] = useState('');
  const [newWisdomCategory, setNewWisdomCategory] = useState('');
  const [newWisdomTags, setNewWisdomTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyScore, setPrivacyScore] = useState(100);

  // Real-time privacy analysis
  useEffect(() => {
    if (newWisdomContent.trim().length > 0) {
      const sanitized = PrivacyContentFilter.sanitizeForSharing(newWisdomContent);
      setPrivacyScore(sanitized.confidenceScore);
    }
  }, [newWisdomContent]);

  const filteredEntries = wisdomEntries.filter(entry => {
    const matchesCategory = !selectedCategory || entry.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleContributeWisdom = async () => {
    if (!newWisdomTitle.trim() || !newWisdomContent.trim() || !newWisdomCategory) return;

    setIsSubmitting(true);

    try {
      // Content moderation
      const moderation = await TraumaInformedModerator.moderateContent(newWisdomContent);
      if (!moderation.approved) {
        alert('Your wisdom contains content that may need review. Please consider our community guidelines.');
        setIsSubmitting(false);
        return;
      }

      // Privacy sanitization
      const sanitized = PrivacyContentFilter.sanitizeForSharing(newWisdomContent);

      const newEntry: WisdomEntry = {
        id: `wisdom-${Date.now()}`,
        ephemeralAuthorId: ephemeralIdentity.ephemeralId,
        title: newWisdomTitle.trim(),
        content: sanitized.sanitizedContent,
        category: newWisdomCategory as any,
        tags: newWisdomTags,
        upvotes: 0,
        helpfulCount: 0,
        savedCount: 0,
        qualityScore: 0,
        verificationLevel: 'community',
        isAnonymous: true,
        createdAt: new Date(),
        lastModified: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      };

      setWisdomEntries(prev => [newEntry, ...prev]);
      
      // Reset form
      setNewWisdomTitle('');
      setNewWisdomContent('');
      setNewWisdomCategory('');
      setNewWisdomTags([]);
      
      setCurrentView('browse');
      alert('Your wisdom has been added to the community library! Thank you for sharing your insights.');

    } catch (error) {
      console.error('Error contributing wisdom:', error);
      alert('There was an issue adding your wisdom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (entryId: string, voteType: string) => {
    setWisdomEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, helpfulCount: entry.helpfulCount + 1 }
        : entry
    ));
    
    // In production, save vote to Firebase
    console.log('Voting:', entryId, voteType);
  };

  const renderBrowse = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Community Wisdom Library</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Discover insights, strategies, and wisdom shared anonymously by community members who understand the healing journey.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search wisdom, strategies, insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-[#5E8E7F] focus:outline-none"
          />
          <Button
            onClick={() => setCurrentView('contribute')}
            className="bg-[#5E8E7F] hover:bg-[#4A6B5E] whitespace-nowrap"
          >
            Share Wisdom
          </Button>
        </div>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`p-4 rounded-lg border text-center transition-all duration-200 ${
            selectedCategory === null
              ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
              : 'border-white/10 hover:border-white/20 text-white/80'
          }`}
        >
          <div className="text-2xl mb-2">🌟</div>
          <div className="text-sm font-medium">All Wisdom</div>
          <div className="text-xs opacity-70 mt-1">{wisdomEntries.length} entries</div>
        </button>
        
        {WISDOM_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-lg border text-center transition-all duration-200 ${
              selectedCategory === category.id
                ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                : 'border-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <div className="text-2xl mb-2">{category.emoji}</div>
            <div className="text-sm font-medium">{category.name}</div>
            <div className="text-xs opacity-70 mt-1">
              {wisdomEntries.filter(e => e.category === category.id).length} entries
            </div>
          </button>
        ))}
      </div>

      {/* Wisdom Entries */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-8 text-center">
            <p className="text-white/60">No wisdom entries found matching your search.</p>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="bg-white/5 border-white/10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {WISDOM_CATEGORIES.find(c => c.id === entry.category)?.emoji || '💡'}
                    </span>
                    <h3 className="text-white font-medium text-lg">{entry.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                    <span className="px-2 py-1 rounded-full bg-white/10">
                      {WISDOM_CATEGORIES.find(c => c.id === entry.category)?.name}
                    </span>
                    <span>{entry.verificationLevel}</span>
                    <span>★ {entry.qualityScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <div>{entry.helpfulCount} found helpful</div>
                  <div>{entry.savedCount} saved</div>
                </div>
              </div>

              <p className="text-white/90 leading-relaxed mb-4">{entry.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {entry.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  {VOTE_TYPES.map((voteType) => (
                    <button
                      key={voteType.id}
                      onClick={() => handleVote(entry.id, voteType.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/80"
                      title={voteType.description}
                    >
                      <span>{voteType.emoji}</span>
                      <span>{voteType.label}</span>
                    </button>
                  ))}
                </div>
                <div className="text-white/60 text-xs">
                  Shared anonymously • {entry.createdAt.toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderContribute = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 flex items-center justify-center">
          <span className="text-2xl">✍️</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Share Your Wisdom</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Your insights could be exactly what someone needs to hear. Share your wisdom anonymously to help others heal.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Title</h3>
        <input
          type="text"
          placeholder="What's the main insight you want to share?"
          value={newWisdomTitle}
          onChange={(e) => setNewWisdomTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-[#5E8E7F] focus:outline-none"
          maxLength={100}
        />
        <div className="text-right text-xs text-white/40 mt-1">
          {newWisdomTitle.length}/100 characters
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Category</h3>
        <div className="grid grid-cols-2 gap-2">
          {WISDOM_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setNewWisdomCategory(category.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                newWisdomCategory === category.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{category.emoji}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <p className="text-xs opacity-70">{category.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/90 font-medium">Your Wisdom</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${privacyScore >= 80 ? 'bg-green-400' : privacyScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
            <span className="text-white/60 text-xs">Privacy: {privacyScore}%</span>
          </div>
        </div>
        <TextArea
          placeholder="Share your insight, strategy, or lesson learned. What would you tell someone who's struggling with something you've overcome? Be specific and practical..."
          value={newWisdomContent}
          onChange={(e) => setNewWisdomContent(e.target.value)}
          className="min-h-40 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
        />
        <div className="text-right text-xs text-white/40 mt-1">
          {newWisdomContent.length}/2000 characters
        </div>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <h3 className="text-blue-200 font-medium mb-2">Wisdom Guidelines</h3>
        <ul className="text-blue-200/80 text-xs space-y-1">
          <li>• Share from lived experience, not theoretical knowledge</li>
          <li>• Be specific and practical - what exactly helped?</li>
          <li>• Avoid giving medical or professional advice</li>
          <li>• Include cultural context when relevant</li>
          <li>• Remember someone in crisis may read this</li>
          <li>• Complete anonymity is guaranteed</li>
        </ul>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentView('browse')}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back to Library
        </Button>
        <Button
          onClick={handleContributeWisdom}
          disabled={!newWisdomTitle.trim() || !newWisdomContent.trim() || !newWisdomCategory || isSubmitting}
          className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
        >
          {isSubmitting ? 'Adding Wisdom...' : 'Share Anonymously'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {currentView === 'browse' && renderBrowse()}
      {currentView === 'contribute' && renderContribute()}
    </div>
  );
}