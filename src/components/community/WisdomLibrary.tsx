'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  Search, 
  Filter, 
  Plus, 
  BookOpen, 
  Lightbulb, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Meh,
  Star,
  CheckCircle,
  AlertCircle,
  Tag,
  X,
  User,
  Calendar
} from 'lucide-react';

interface WisdomEntry {
  id: string;
  contributorAnonymousId: string;
  type: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isVerified: boolean;
  verificationSource?: string;
  effectiveness_votes: {
    helpful: number;
    somewhat_helpful: number;
    not_helpful: number;
  };
  createdAt: Date;
  sourceType: string;
}

interface WisdomLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WisdomLibrary({ isOpen, onClose }: WisdomLibraryProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'browse' | 'create' | 'search'>('browse');
  const [entries, setEntries] = useState<WisdomEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<WisdomEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Create form data
  const [createFormData, setCreateFormData] = useState({
    type: 'coping_strategy',
    title: '',
    content: '',
    category: 'anxiety',
    tags: [] as string[],
    sourceType: 'personal_experience'
  });

  const wisdomTypes = [
    { value: 'coping_strategy', label: 'Coping Strategy', description: 'Practical techniques for managing difficult situations' },
    { value: 'healing_insight', label: 'Healing Insight', description: 'Profound realizations or perspectives gained through healing' },
    { value: 'resource_recommendation', label: 'Resource Recommendation', description: 'Books, apps, services, or tools that have been helpful' },
    { value: 'practice', label: 'Daily Practice', description: 'Routines or habits that support ongoing wellness' },
    { value: 'affirmation', label: 'Affirmation', description: 'Positive statements or mantras for self-compassion' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'anxiety', label: 'Anxiety Management' },
    { value: 'depression', label: 'Depression Support' },
    { value: 'trauma', label: 'Trauma Healing' },
    { value: 'grief', label: 'Grief & Loss' },
    { value: 'self_care', label: 'Self-Care' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'addiction', label: 'Addiction Recovery' },
    { value: 'therapy', label: 'Therapy & Professional Help' },
    { value: 'medication', label: 'Medication & Treatment' }
  ];

  const sourceTypes = [
    { value: 'personal_experience', label: 'Personal Experience', description: 'From my own healing journey' },
    { value: 'professional_guidance', label: 'Professional Guidance', description: 'Learned from therapist or healthcare provider' },
    { value: 'research_based', label: 'Research-Based', description: 'Supported by studies or clinical evidence' },
    { value: 'traditional_wisdom', label: 'Traditional Wisdom', description: 'From cultural, spiritual, or ancestral practices' }
  ];

  const suggestedTags = [
    'quick_relief', 'long_term', 'free', 'mobile_app', 'breathing', 'movement',
    'journaling', 'meditation', 'social_support', 'professional_help', 'crisis',
    'daily_routine', 'sleep', 'exercise', 'nutrition', 'creativity', 'nature',
    'boundaries', 'self_compassion', 'gratitude', 'hope', 'courage', 'resilience'
  ];

  useEffect(() => {
    if (isOpen && mode === 'browse') {
      loadWisdomEntries();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, selectedCategory, selectedTags]);

  const loadWisdomEntries = async () => {
    setLoading(true);
    try {
      // Mock data - would call searchWisdomEntries function
      const mockEntries: WisdomEntry[] = [
        {
          id: '1',
          contributorAnonymousId: 'wise_oak_7x2m',
          type: 'coping_strategy',
          title: 'The 5-4-3-2-1 Grounding Technique',
          content: 'When anxiety overwhelms me, I use this sensory grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. It brings me back to the present moment and helps interrupt the anxiety spiral.',
          category: 'anxiety',
          tags: ['quick_relief', 'breathing', 'crisis', 'free'],
          isVerified: true,
          verificationSource: 'Clinical research on grounding techniques',
          effectiveness_votes: { helpful: 45, somewhat_helpful: 8, not_helpful: 2 },
          createdAt: new Date('2024-01-20'),
          sourceType: 'professional_guidance'
        },
        {
          id: '2',
          contributorAnonymousId: 'healing_river_3k9p',
          type: 'healing_insight',
          title: 'Healing Isn\'t Linear',
          content: 'I learned that having a bad day doesn\'t mean I\'m going backwards. Healing is like a spiral staircase - sometimes it feels like you\'re going in circles, but you\'re actually moving upward. Bad days are part of the process, not evidence that recovery isn\'t working.',
          category: 'self_care',
          tags: ['hope', 'long_term', 'self_compassion'],
          isVerified: false,
          effectiveness_votes: { helpful: 32, somewhat_helpful: 5, not_helpful: 1 },
          createdAt: new Date('2024-01-18'),
          sourceType: 'personal_experience'
        },
        {
          id: '3',
          contributorAnonymousId: 'gentle_mountain_5p7k',
          type: 'resource_recommendation',
          title: 'Insight Timer for Meditation',
          content: 'This free meditation app has been a lifesaver for my anxiety. It has thousands of guided meditations, including specific ones for anxiety, sleep, and trauma. The timer feature lets me meditate in silence too. The community aspect makes me feel less alone in my practice.',
          category: 'mindfulness',
          tags: ['mobile_app', 'free', 'meditation', 'social_support'],
          isVerified: true,
          verificationSource: 'Peer-reviewed mental health app analysis',
          effectiveness_votes: { helpful: 28, somewhat_helpful: 4, not_helpful: 0 },
          createdAt: new Date('2024-01-15'),
          sourceType: 'personal_experience'
        }
      ];
      setEntries(mockEntries);
    } catch (error) {
      setError('Failed to load wisdom entries');
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry => 
        selectedTags.some(tag => entry.tags.includes(tag))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by helpfulness
    filtered.sort((a, b) => {
      const aScore = a.effectiveness_votes.helpful - a.effectiveness_votes.not_helpful;
      const bScore = b.effectiveness_votes.helpful - b.effectiveness_votes.not_helpful;
      return bScore - aScore;
    });

    setFilteredEntries(filtered);
  };

  const handleCreateWisdom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/create-wisdom-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          wisdomData: createFormData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMode('browse');
        loadWisdomEntries(); // Refresh the list
        // Reset form
        setCreateFormData({
          type: 'coping_strategy',
          title: '',
          content: '',
          category: 'anxiety',
          tags: [],
          sourceType: 'personal_experience'
        });
      } else {
        setError(result.error || 'Failed to create wisdom entry');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (entryId: string, vote: 'helpful' | 'somewhat_helpful' | 'not_helpful') => {
    if (!user) return;

    try {
      const response = await fetch('/api/community/vote-on-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          entryId,
          vote
        })
      });

      if (response.ok) {
        // Update local state
        setEntries(prev => prev.map(entry => {
          if (entry.id === entryId) {
            return {
              ...entry,
              effectiveness_votes: {
                ...entry.effectiveness_votes,
                [vote]: entry.effectiveness_votes[vote] + 1
              }
            };
          }
          return entry;
        }));
      }
    } catch (error) {
      console.error('Error voting on wisdom entry:', error);
    }
  };

  const addTag = (tag: string) => {
    if (!createFormData.tags.includes(tag) && createFormData.tags.length < 5) {
      setCreateFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setCreateFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const toggleSelectedTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getEffectivenessScore = (votes: WisdomEntry['effectiveness_votes']) => {
    const total = votes.helpful + votes.somewhat_helpful + votes.not_helpful;
    if (total === 0) return 0;
    return Math.round(((votes.helpful * 1 + votes.somewhat_helpful * 0.5) / total) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Community Wisdom Library</h2>
            <p className="text-gray-600 mt-1">Collective insights and healing strategies from our community</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setMode('browse')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                mode === 'browse'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Browse Wisdom
            </button>
            <button
              onClick={() => setMode('create')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                mode === 'create'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Contribute Wisdom
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          
          {/* Sidebar Filters (Browse Mode) */}
          {mode === 'browse' && (
            <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
              
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wisdom..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleSelectedTag(tag)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-purple-600 text-sm hover:text-purple-700"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Browse Mode */}
            {mode === 'browse' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No wisdom found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                    <button
                      onClick={() => setMode('create')}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Contribute Wisdom
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredEntries.map(entry => (
                      <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.type === 'coping_strategy' ? 'bg-blue-100 text-blue-700' :
                                entry.type === 'healing_insight' ? 'bg-green-100 text-green-700' :
                                entry.type === 'resource_recommendation' ? 'bg-purple-100 text-purple-700' :
                                entry.type === 'practice' ? 'bg-orange-100 text-orange-700' :
                                'bg-pink-100 text-pink-700'
                              }`}>
                                {wisdomTypes.find(t => t.value === entry.type)?.label}
                              </span>
                              
                              {entry.isVerified && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                              
                              <span className="text-xs text-gray-500">
                                {getEffectivenessScore(entry.effectiveness_votes)}% helpful
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{entry.title}</h3>
                          </div>

                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center gap-1 mb-1">
                              <User className="w-3 h-3" />
                              {entry.contributorAnonymousId}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">{entry.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                              {categories.find(c => c.value === entry.category)?.label}
                            </span>
                            {entry.tags.map(tag => (
                              <span key={tag} className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-sm">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVote(entry.id, 'helpful')}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              {entry.effectiveness_votes.helpful}
                            </button>
                            <button
                              onClick={() => handleVote(entry.id, 'somewhat_helpful')}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                            >
                              <Meh className="w-4 h-4" />
                              {entry.effectiveness_votes.somewhat_helpful}
                            </button>
                            <button
                              onClick={() => handleVote(entry.id, 'not_helpful')}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              {entry.effectiveness_votes.not_helpful}
                            </button>
                          </div>
                        </div>

                        {entry.isVerified && entry.verificationSource && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-green-800 text-sm">
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              Verified: {entry.verificationSource}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create Mode */}
            {mode === 'create' && (
              <form onSubmit={handleCreateWisdom} className="space-y-6 max-w-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Wisdom Type *
                    </label>
                    <select
                      id="type"
                      value={createFormData.type}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      {wisdomTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={createFormData.category}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={createFormData.title}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your wisdom a clear, helpful title..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Wisdom *
                  </label>
                  <textarea
                    id="content"
                    value={createFormData.content}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your insight, strategy, or resource in detail. Be specific about how it helped you and how others might use it..."
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    required
                    maxLength={2000}
                  />
                  <p className="text-sm text-gray-500 mt-1">{createFormData.content.length}/2000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Select up to 5)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={createFormData.tags.includes(tag) || createFormData.tags.length >= 5}
                        className={`p-2 rounded text-sm transition-colors ${
                          createFormData.tags.includes(tag)
                            ? 'bg-purple-100 text-purple-700 cursor-default'
                            : createFormData.tags.length >= 5
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 cursor-pointer'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  
                  {createFormData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {createFormData.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="sourceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Source of This Wisdom *
                  </label>
                  <select
                    id="sourceType"
                    value={createFormData.sourceType}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, sourceType: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {sourceTypes.map(source => (
                      <option key={source.value} value={source.value}>
                        {source.label} - {source.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setMode('browse')}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !createFormData.title || !createFormData.content}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4" />
                        Share Wisdom
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}