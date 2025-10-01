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

interface AcrossTheMarshStoriesProps {
  ephemeralIdentity: EphemeralCommunityIdentity;
}

interface MarshStory {
  id: string;
  ephemeralAuthorId: string;
  title: string;
  storyContent: string;
  storyStage: 'in-the-marsh' | 'crossing-over' | 'on-the-other-side' | 'looking-back';
  emotionalTone: 'vulnerable-sharing' | 'hopeful-progress' | 'wisdom-offering' | 'solidarity-building';
  themes: string[];
  culturalContext?: string;
  pathway?: string;
  reactions: {
    seen: number;
    held: number;
    strength: number;
    gratitude: number;
    resonance: number;
  };
  supportiveResponses: MarshResponse[];
  isAnonymous: boolean;
  isModerated: boolean;
  qualityRating: number;
  createdAt: Date;
  expiresAt: Date;
}

interface MarshResponse {
  id: string;
  storyId: string;
  responderEphemeralId: string;
  responseContent: string;
  responseType: 'witness' | 'solidarity' | 'gentle-wisdom' | 'encouragement';
  isAnonymous: boolean;
  createdAt: Date;
}

const STORY_STAGES = [
  {
    id: 'in-the-marsh',
    name: 'In the Marsh',
    description: 'Currently struggling, seeking understanding and connection',
    emoji: '🌫️',
    color: 'from-gray-400 to-blue-500',
    prompt: 'Share what you\'re moving through right now. You don\'t have to be strong or have answers. Just real.'
  },
  {
    id: 'crossing-over',
    name: 'Crossing Over',
    description: 'In transition, seeing glimpses of hope and change',
    emoji: '🌉',
    color: 'from-blue-400 to-green-500',
    prompt: 'Share about being in the messy middle - where healing isn\'t linear and progress comes in waves.'
  },
  {
    id: 'on-the-other-side',
    name: 'On the Other Side',
    description: 'Having moved through a significant challenge or transformation',
    emoji: '🌅',
    color: 'from-green-400 to-yellow-500',
    prompt: 'Share your journey of getting through something that once felt impossible. What did healing look like?'
  },
  {
    id: 'looking-back',
    name: 'Looking Back',
    description: 'Reflecting on the journey with wisdom and perspective',
    emoji: '🦉',
    color: 'from-purple-400 to-indigo-500',
    prompt: 'Share wisdom from your journey - what you wish you could tell yourself in the marsh.'
  }
];

const EMOTIONAL_TONES = [
  {
    id: 'vulnerable-sharing',
    name: 'Vulnerable Sharing',
    description: 'Raw, honest, in-the-moment emotional expression',
    emoji: '💔',
    supportType: 'witness'
  },
  {
    id: 'hopeful-progress',
    name: 'Hopeful Progress',
    description: 'Sharing signs of growth and positive change',
    emoji: '🌱',
    supportType: 'encouragement'
  },
  {
    id: 'wisdom-offering',
    name: 'Wisdom Offering',
    description: 'Sharing lessons learned and insights gained',
    emoji: '🕯️',
    supportType: 'gratitude'
  },
  {
    id: 'solidarity-building',
    name: 'Solidarity Building',
    description: 'Creating connection through shared experience',
    emoji: '🤝',
    supportType: 'resonance'
  }
];

const REACTION_TYPES = [
  { id: 'seen', emoji: '👁️', label: 'I See You', description: 'Witnessed with compassion' },
  { id: 'held', emoji: '🤗', label: 'I Hold Space', description: 'Sending support and presence' },
  { id: 'strength', emoji: '💪', label: 'Your Strength', description: 'Acknowledging resilience' },
  { id: 'gratitude', emoji: '🙏', label: 'Thank You', description: 'Grateful for your sharing' },
  { id: 'resonance', emoji: '🔄', label: 'This Resonates', description: 'Deeply relates to experience' }
];

const SAMPLE_STORIES: MarshStory[] = [
  {
    id: 'story-1',
    ephemeralAuthorId: 'anon-marsh-123',
    title: 'Finding Light in the Fog',
    storyContent: 'Three years ago, I couldn\'t get out of bed. Depression had wrapped around me like fog so thick I couldn\'t see my own hands. Today, I woke up and made breakfast without thinking about it. Healing isn\'t dramatic - it\'s in these ordinary moments that I now cherish. The fog lifts so gradually you don\'t notice until you can see the sky.',
    storyStage: 'on-the-other-side',
    emotionalTone: 'hopeful-progress',
    themes: ['depression-recovery', 'gradual-healing', 'ordinary-miracles'],
    reactions: { seen: 234, held: 187, strength: 298, gratitude: 156, resonance: 267 },
    supportiveResponses: [],
    isAnonymous: true,
    isModerated: true,
    qualityRating: 4.8,
    createdAt: new Date('2025-01-20'),
    expiresAt: new Date('2026-01-20')
  },
  {
    id: 'story-2',
    ephemeralAuthorId: 'anon-marsh-456',
    title: 'To Anyone in the Thick of It',
    storyContent: 'I\'m writing this from 2 AM, can\'t sleep again, anxiety gnawing at my chest. If you\'re reading this from a similar place - we\'re here together in the dark. I don\'t have answers, but I have company to offer. Sometimes that\'s enough. You don\'t have to be okay to belong here.',
    storyStage: 'in-the-marsh',
    emotionalTone: 'vulnerable-sharing',
    themes: ['anxiety', 'insomnia', 'solidarity', 'belonging'],
    reactions: { seen: 456, held: 389, strength: 123, gratitude: 78, resonance: 501 },
    supportiveResponses: [],
    isAnonymous: true,
    isModerated: true,
    qualityRating: 4.9,
    createdAt: new Date('2025-01-22'),
    expiresAt: new Date('2026-01-22')
  },
  {
    id: 'story-3',
    ephemeralAuthorId: 'anon-marsh-789',
    title: 'What My Grandmother\'s Hands Taught Me',
    storyContent: 'Watching my abuela\'s hands shape masa, I learned that healing, like bread, needs time to rise. She survived civil war, immigration, loss - her hands carried all of it and still created something nourishing. I\'m learning to honor the wisdom in my own hands, in my own survival. Trauma is not just individual - it\'s generational, and so is resilience.',
    storyStage: 'looking-back',
    emotionalTone: 'wisdom-offering',
    themes: ['intergenerational-trauma', 'cultural-healing', 'resilience', 'ancestry'],
    culturalContext: 'latina',
    reactions: { seen: 189, held: 145, strength: 267, gratitude: 298, resonance: 234 },
    supportiveResponses: [],
    isAnonymous: true,
    isModerated: true,
    qualityRating: 4.7,
    createdAt: new Date('2025-01-18'),
    expiresAt: new Date('2026-01-18')
  }
];

export default function AcrossTheMarshStories({ ephemeralIdentity }: AcrossTheMarshStoriesProps) {
  const [currentView, setCurrentView] = useState<'browse' | 'share' | 'story-detail'>('browse');
  const [selectedStory, setSelectedStory] = useState<MarshStory | null>(null);
  const [stories, setStories] = useState<MarshStory[]>(SAMPLE_STORIES);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  // Story creation state
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryContent, setNewStoryContent] = useState('');
  const [newStoryStage, setNewStoryStage] = useState('');
  const [newEmotionalTone, setNewEmotionalTone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyScore, setPrivacyScore] = useState(100);

  // Real-time privacy analysis
  useEffect(() => {
    if (newStoryContent.trim().length > 0) {
      const sanitized = PrivacyContentFilter.sanitizeForSharing(newStoryContent);
      setPrivacyScore(sanitized.confidenceScore);
    }
  }, [newStoryContent]);

  const filteredStories = stories.filter(story => 
    !selectedStage || story.storyStage === selectedStage
  );

  const handleShareStory = async () => {
    if (!newStoryTitle.trim() || !newStoryContent.trim() || !newStoryStage || !newEmotionalTone) return;

    setIsSubmitting(true);

    try {
      // Content moderation
      const moderation = await TraumaInformedModerator.moderateContent(newStoryContent);
      if (!moderation.approved) {
        alert('Your story contains content that may need additional support. Please consider our crisis resources if you\'re in immediate need.');
        setIsSubmitting(false);
        return;
      }

      // Privacy sanitization
      const sanitized = PrivacyContentFilter.sanitizeForSharing(newStoryContent);

      const newStory: MarshStory = {
        id: `story-${Date.now()}`,
        ephemeralAuthorId: ephemeralIdentity.ephemeralId,
        title: newStoryTitle.trim(),
        storyContent: sanitized.sanitizedContent,
        storyStage: newStoryStage as any,
        emotionalTone: newEmotionalTone as any,
        themes: extractThemes(sanitized.sanitizedContent),
        reactions: { seen: 0, held: 0, strength: 0, gratitude: 0, resonance: 0 },
        supportiveResponses: [],
        isAnonymous: true,
        isModerated: true,
        qualityRating: 0,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };

      setStories(prev => [newStory, ...prev]);
      
      // Reset form
      setNewStoryTitle('');
      setNewStoryContent('');
      setNewStoryStage('');
      setNewEmotionalTone('');
      
      setCurrentView('browse');
      alert('Your story has been shared across the marsh. Thank you for your courage in sharing.');

    } catch (error) {
      console.error('Error sharing story:', error);
      alert('There was an issue sharing your story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractThemes = (content: string): string[] => {
    const themeWords = {
      'anxiety': ['anxiety', 'anxious', 'worry', 'panic', 'fear'],
      'depression': ['depression', 'depressed', 'sad', 'hopeless', 'empty'],
      'healing': ['healing', 'recovery', 'better', 'growing', 'progress'],
      'trauma': ['trauma', 'hurt', 'pain', 'abuse', 'violence'],
      'resilience': ['strong', 'strength', 'resilient', 'survivor', 'overcome'],
      'growth': ['learning', 'growth', 'changing', 'becoming', 'evolving'],
      'family': ['family', 'mother', 'father', 'parent', 'child'],
      'relationships': ['relationship', 'partner', 'love', 'friend', 'support'],
      'purpose': ['purpose', 'meaning', 'calling', 'passion', 'direction']
    };

    const content_lower = content.toLowerCase();
    const themes: string[] = [];

    Object.entries(themeWords).forEach(([theme, words]) => {
      if (words.some(word => content_lower.includes(word))) {
        themes.push(theme);
      }
    });

    return themes;
  };

  const handleReaction = (storyId: string, reactionType: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            reactions: { 
              ...story.reactions, 
              [reactionType]: story.reactions[reactionType as keyof typeof story.reactions] + 1 
            } 
          }
        : story
    ));
    
    // In production, save reaction to Firebase
    console.log('Reacting to story:', storyId, reactionType);
  };

  const renderBrowse = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 flex items-center justify-center">
          <span className="text-2xl">🌊</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Across the Marsh</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          Anonymous stories of healing journeys - from the depths of struggle to the shores of hope. 
          Share your truth, find your people, witness the courage all around you.
        </p>
      </div>

      {/* Story Stages Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedStage(null)}
          className={`p-4 rounded-lg border text-center transition-all duration-200 ${
            selectedStage === null
              ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
              : 'border-white/10 hover:border-white/20 text-white/80'
          }`}
        >
          <div className="text-2xl mb-2">🌟</div>
          <div className="text-sm font-medium">All Stories</div>
          <div className="text-xs opacity-70 mt-1">{stories.length} stories</div>
        </button>
        
        {STORY_STAGES.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id)}
            className={`p-4 rounded-lg border text-center transition-all duration-200 ${
              selectedStage === stage.id
                ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                : 'border-white/10 hover:border-white/20 text-white/80'
            }`}
          >
            <div className="text-2xl mb-2">{stage.emoji}</div>
            <div className="text-sm font-medium">{stage.name}</div>
            <div className="text-xs opacity-70 mt-1">
              {stories.filter(s => s.storyStage === stage.id).length} stories
            </div>
          </button>
        ))}
      </div>

      {/* Share Story CTA */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-purple-200 font-medium mb-1">Your Story Matters</h3>
            <p className="text-purple-200/80 text-sm">
              Share your journey anonymously - someone needs to hear exactly what you've been through.
            </p>
          </div>
          <Button
            onClick={() => setCurrentView('share')}
            className="bg-[#5E8E7F] hover:bg-[#4A6B5E] whitespace-nowrap"
          >
            Share Your Story
          </Button>
        </div>
      </Card>

      {/* Stories */}
      <div className="space-y-6">
        {filteredStories.length === 0 ? (
          <Card className="bg-white/5 border-white/10 p-8 text-center">
            <p className="text-white/60">No stories found for this stage. Be the first to share!</p>
          </Card>
        ) : (
          filteredStories.map((story) => (
            <Card key={story.id} className="bg-white/5 border-white/10 p-6 hover:bg-white/8 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {STORY_STAGES.find(s => s.id === story.storyStage)?.emoji || '🌊'}
                    </span>
                    <h3 className="text-white font-medium text-lg">{story.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                    <span className="px-2 py-1 rounded-full bg-white/10">
                      {STORY_STAGES.find(s => s.id === story.storyStage)?.name}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10">
                      {EMOTIONAL_TONES.find(t => t.id === story.emotionalTone)?.name}
                    </span>
                    <span>{story.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <div>★ {story.qualityRating.toFixed(1)}</div>
                </div>
              </div>

              <p className="text-white/90 leading-relaxed mb-4 line-clamp-3">
                {story.storyContent}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {story.themes.slice(0, 3).map((theme, index) => (
                  <span key={index} className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                    #{theme}
                  </span>
                ))}
                {story.themes.length > 3 && (
                  <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-300 text-xs">
                    +{story.themes.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className="flex gap-2 flex-wrap">
                  {REACTION_TYPES.map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => handleReaction(story.id, reaction.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/80"
                      title={reaction.description}
                    >
                      <span>{reaction.emoji}</span>
                      <span>{story.reactions[reaction.id as keyof typeof story.reactions]}</span>
                    </button>
                  ))}
                </div>
                <div className="text-white/60 text-xs">
                  Anonymous traveler
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderShare = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">✍️</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Share Your Story</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Your journey across the marsh matters. Share your truth anonymously - it might be the light someone else needs to see.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Where are you in your journey?</h3>
        <div className="space-y-3">
          {STORY_STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setNewStoryStage(stage.id)}
              className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                newStoryStage === stage.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{stage.emoji}</span>
                <span className="font-medium">{stage.name}</span>
              </div>
              <p className="text-xs opacity-70 mb-2">{stage.description}</p>
              <p className="text-xs italic opacity-60">{stage.prompt}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">What tone feels right for your sharing?</h3>
        <div className="space-y-2">
          {EMOTIONAL_TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setNewEmotionalTone(tone.id)}
              className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                newEmotionalTone === tone.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{tone.emoji}</span>
                <span className="font-medium text-sm">{tone.name}</span>
              </div>
              <p className="text-xs opacity-70">{tone.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Story Title</h3>
        <input
          type="text"
          placeholder="A simple title that captures your story's essence..."
          value={newStoryTitle}
          onChange={(e) => setNewStoryTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-[#5E8E7F] focus:outline-none"
          maxLength={80}
        />
        <div className="text-right text-xs text-white/40 mt-1">
          {newStoryTitle.length}/80 characters
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/90 font-medium">Your Story</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${privacyScore >= 80 ? 'bg-green-400' : privacyScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
            <span className="text-white/60 text-xs">Privacy: {privacyScore}%</span>
          </div>
        </div>
        <TextArea
          placeholder="Share your story from the heart. What has your journey across the marsh looked like? What would you want someone in a similar place to know? Your words might be exactly what someone needs to hear..."
          value={newStoryContent}
          onChange={(e) => setNewStoryContent(e.target.value)}
          className="min-h-48 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
        />
        <div className="text-right text-xs text-white/40 mt-1">
          {newStoryContent.length}/3000 characters
        </div>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <h3 className="text-blue-200 font-medium mb-2">Marsh Story Guidelines</h3>
        <ul className="text-blue-200/80 text-xs space-y-1">
          <li>• Share from your lived experience and truth</li>
          <li>• Your story is safe here - complete anonymity guaranteed</li>
          <li>• Include specific details that might help others</li>
          <li>• Remember someone in crisis may read this</li>
          <li>• Cultural context is welcome and valued</li>
          <li>• There\'s no "right" way to heal or tell your story</li>
        </ul>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentView('browse')}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back to Stories
        </Button>
        <Button
          onClick={handleShareStory}
          disabled={!newStoryTitle.trim() || !newStoryContent.trim() || !newStoryStage || !newEmotionalTone || isSubmitting}
          className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
        >
          {isSubmitting ? 'Sharing Story...' : 'Share Across the Marsh'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {currentView === 'browse' && renderBrowse()}
      {currentView === 'share' && renderShare()}
    </div>
  );
}