'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { 
  EphemeralIdentity, 
  PrivacyContentFilter, 
  TraumaInformedModerator,
  type EphemeralCommunityIdentity,
  type AnonymousWisdomShare 
} from '@/lib/community/privacy-engine';
import CrisisKeywordDetector from '@/components/ui/CrisisKeywordDetector';
import { useRouter } from 'next/navigation';

interface AnonymousWisdomSharingProps {
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  culturalContext?: string;
}

const WISDOM_PROMPTS = {
  resilience: [
    "What strength did you discover in your darkest moment?",
    "How did you rebuild after something fell apart?",
    "What would you tell someone who feels like giving up?",
    "When did you realize you were stronger than you knew?"
  ],
  becoming: [
    "What old story about yourself did you finally let go of?",
    "How are you different now from who you were a year ago?",
    "What permission did you have to give yourself to grow?",
    "What's something you're becoming that surprises you?"
  ],
  purpose: [
    "When do you feel most alive and connected to meaning?",
    "How do your struggles connect to your purpose?",
    "What gift do you have that the world needs right now?",
    "How has pain transformed into purpose for you?"
  ],
  belonging: [
    "Where do you feel most seen and accepted?",
    "How do you create belonging for others?",
    "What does home feel like to you now?",
    "How did you find your people?"
  ],
  universal: [
    "What wisdom would you share with someone just starting their healing journey?",
    "What truth took you too long to learn?",
    "How has your relationship with yourself changed?",
    "What do you wish you could tell your younger self?"
  ]
};

const CULTURAL_WISDOM_TRADITIONS = [
  { id: 'ubuntu', name: 'Ubuntu (African Philosophy)', description: 'I am because we are' },
  { id: 'wabi-sabi', name: 'Wabi-Sabi (Japanese)', description: 'Finding beauty in imperfection' },
  { id: 'saudade', name: 'Saudade (Portuguese)', description: 'Longing transformed into beauty' },
  { id: 'hygge', name: 'Hygge (Danish)', description: 'Cozy contentment and simple joy' },
  { id: 'ubuntu-botho', name: 'Ubuntu/Botho (Southern African)', description: 'Collective humanity and interconnectedness' },
  { id: 'ikigai', name: 'Ikigai (Japanese)', description: 'Reason for being and life purpose' },
  { id: 'lagom', name: 'Lagom (Swedish)', description: 'Just the right amount - balanced living' },
  { id: 'ubuntu-hunhu', name: 'Hunhu/Ubuntu (Zimbabwean)', description: 'Humanness through community' }
];

const SHARING_INTENTIONS = [
  { id: 'wisdom', emoji: '🌟', label: 'Share Wisdom', description: 'Offer insight from your journey' },
  { id: 'support', emoji: '🤗', label: 'Offer Support', description: 'Encourage someone who\'s struggling' },
  { id: 'connection', emoji: '🕊️', label: 'Seek Connection', description: 'Find others on similar paths' },
  { id: 'healing', emoji: '✨', label: 'Healing Story', description: 'Share transformation and growth' },
  { id: 'gratitude', emoji: '🙏', label: 'Express Gratitude', description: 'Acknowledge beauty in your journey' }
];

export default function AnonymousWisdomSharing({ 
  pathway, 
  culturalContext = 'universal' 
}: AnonymousWisdomSharingProps) {
  const router = useRouter();
  const [ephemeralIdentity, setEphemeralIdentity] = useState<EphemeralCommunityIdentity | null>(null);
  const [wisdomContent, setWisdomContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);
  const [selectedCulturalTradition, setSelectedCulturalTradition] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyScore, setPrivacyScore] = useState<number>(100);
  const [crisisDetected, setCrisisDetected] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [sanitizedPreview, setSanitizedPreview] = useState<string>('');

  // Initialize ephemeral identity
  useEffect(() => {
    const identity = EphemeralIdentity.createEphemeralIdentity();
    setEphemeralIdentity(identity);
  }, []);

  // Get contextual prompts
  const prompts = pathway ? WISDOM_PROMPTS[pathway] : WISDOM_PROMPTS.universal;

  // Real-time privacy analysis
  useEffect(() => {
    if (wisdomContent.trim().length > 0) {
      const sanitized = PrivacyContentFilter.sanitizeForSharing(wisdomContent);
      setPrivacyScore(sanitized.confidenceScore);
      setSanitizedPreview(sanitized.sanitizedContent);
    }
  }, [wisdomContent]);

  const handleCrisisDetection = (keywords: string[]) => {
    setCrisisDetected(keywords);
  };

  const handleSubmitWisdom = async () => {
    if (!ephemeralIdentity || !wisdomContent.trim() || crisisDetected.length > 0) return;

    setIsSubmitting(true);

    try {
      // Sanitize content for privacy
      const sanitized = PrivacyContentFilter.sanitizeForSharing(wisdomContent);
      
      // Check moderation
      const moderation = await TraumaInformedModerator.moderateContent(sanitized.sanitizedContent);
      
      if (!moderation.approved) {
        if (moderation.riskLevel === 'crisis') {
          // Redirect to crisis support
          router.push('/crisis-resources');
          return;
        } else {
          alert('Your sharing contains content that may need additional support. Please consider reaching out to our crisis resources.');
          return;
        }
      }

      // Create anonymous wisdom share
      const wisdomShare: Partial<AnonymousWisdomShare> = {
        ephemeralId: ephemeralIdentity.ephemeralId,
        sanitizedContent: sanitized.sanitizedContent,
        pathway,
        emotionalTags: extractEmotionalTags(wisdomContent),
        culturalWisdom: selectedCulturalTradition ? {
          tradition: selectedCulturalTradition,
          practice: extractCulturalPractice(wisdomContent),
          culturalContext
        } : undefined,
        isApproved: moderation.approved,
        riskLevel: moderation.riskLevel,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      };

      // In production, this would save to Firebase with proper security rules
      console.log('Submitting anonymous wisdom share:', wisdomShare);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setWisdomContent('');
      setSelectedPrompt(null);
      setSelectedIntention(null);
      setSelectedCulturalTradition(null);
      setShowPreview(false);
      
      // Show success message
      alert('Your wisdom has been shared anonymously with the community. Thank you for contributing to our collective healing.');
      
    } catch (error) {
      console.error('Error sharing wisdom:', error);
      alert('There was an issue sharing your wisdom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractEmotionalTags = (content: string): string[] => {
    const emotionalWords = {
      'hope': ['hope', 'hopeful', 'optimistic', 'bright', 'light'],
      'strength': ['strong', 'strength', 'powerful', 'resilient', 'brave'],
      'peace': ['peace', 'calm', 'serene', 'tranquil', 'centered'],
      'love': ['love', 'loving', 'compassion', 'kindness', 'caring'],
      'growth': ['growing', 'learning', 'evolving', 'transforming', 'changing'],
      'healing': ['healing', 'recovery', 'mending', 'restoration', 'renewal'],
      'connection': ['connected', 'belonging', 'community', 'together', 'unity'],
      'gratitude': ['grateful', 'thankful', 'appreciation', 'blessed', 'abundance']
    };

    const content_lower = content.toLowerCase();
    const tags: string[] = [];

    Object.entries(emotionalWords).forEach(([emotion, words]) => {
      if (words.some(word => content_lower.includes(word))) {
        tags.push(emotion);
      }
    });

    return tags;
  };

  const extractCulturalPractice = (content: string): string => {
    const practices = [
      'meditation', 'prayer', 'ritual', 'ceremony', 'tradition',
      'storytelling', 'music', 'dance', 'art', 'nature',
      'community gathering', 'sharing circle', 'wisdom keeping'
    ];

    const content_lower = content.toLowerCase();
    return practices.find(practice => content_lower.includes(practice)) || 'wisdom sharing';
  };

  if (!ephemeralIdentity) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E8E7F] mx-auto mb-4"></div>
            <p className="text-white/80">Creating your anonymous sanctuary...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Anonymous Wisdom Sharing</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Share your insights, struggles, or growth in complete anonymity. Your wisdom might be exactly what someone needs to hear.
        </p>
      </div>

      {/* Privacy Assurance */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-400 text-lg">🛡️</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-blue-200 text-sm font-medium">Complete Anonymity Guaranteed</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${privacyScore >= 80 ? 'bg-green-400' : privacyScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                <span className="text-blue-200/80 text-xs">Privacy: {privacyScore}%</span>
              </div>
            </div>
            <p className="text-blue-200/80 text-xs leading-relaxed">
              Your identity is protected with ephemeral IDs. No personal information is stored or shared. Content is automatically filtered for privacy.
            </p>
          </div>
        </div>
      </Card>

      {/* Sharing Intention */}
      <Card className="bg-white/5 border-white/10 p-4">
        <p className="text-white/90 text-sm font-medium mb-3">🎯 What's your intention for sharing?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SHARING_INTENTIONS.map((intention) => (
            <button
              key={intention.id}
              onClick={() => setSelectedIntention(intention.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                selectedIntention === intention.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{intention.emoji}</span>
                <span className="text-xs font-medium">{intention.label}</span>
              </div>
              <p className="text-xs opacity-80">{intention.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Cultural Wisdom Context */}
      <Card className="bg-white/5 border-white/10 p-4">
        <p className="text-white/90 text-sm font-medium mb-3">🌍 Cultural Wisdom Tradition (Optional)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {CULTURAL_WISDOM_TRADITIONS.map((tradition) => (
            <button
              key={tradition.id}
              onClick={() => setSelectedCulturalTradition(tradition.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                selectedCulturalTradition === tradition.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <p className="text-xs font-medium mb-1">{tradition.name}</p>
              <p className="text-xs opacity-80">{tradition.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Wisdom Prompts */}
      <Card className="bg-white/5 border-white/10 p-4">
        <p className="text-white/90 text-sm font-medium mb-3">💭 Need inspiration? Try these prompts:</p>
        <div className="space-y-2">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedPrompt(prompt);
                setWisdomContent(prompt + '\n\n');
              }}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                selectedPrompt === prompt
                  ? 'border-[#5E8E7F]/50 bg-[#5E8E7F]/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <p className="text-white/80 text-sm italic">"{prompt}"</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Wisdom Sharing Form */}
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Sharing as Anonymous</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">Anonymous</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">Ephemeral ID</span>
            </div>
          </div>
          
          <CrisisKeywordDetector 
            text={wisdomContent}
            onCrisisDetected={handleCrisisDetection}
          />
          
          <TextArea
            placeholder="Share your wisdom, your story, or what you've learned. This space honors your truth while protecting your privacy..."
            value={wisdomContent}
            onChange={(e) => setWisdomContent(e.target.value)}
            className="min-h-40 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <span className={`text-xs ${
              wisdomContent.length > 1000 ? 'text-red-400' : 'text-white/40'
            }`}>
              {wisdomContent.length}/1000 characters
            </span>
            {privacyScore < 80 && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-yellow-400 hover:text-yellow-300 underline"
              >
                {showPreview ? 'Hide' : 'Show'} Privacy Preview
              </button>
            )}
          </div>
          <Button
            onClick={handleSubmitWisdom}
            disabled={!wisdomContent.trim() || wisdomContent.length > 1000 || crisisDetected.length > 0 || isSubmitting}
            className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sharing Anonymously...' : 'Share Your Wisdom'}
          </Button>
        </div>

        {/* Privacy Preview */}
        {showPreview && privacyScore < 80 && (
          <Card className="bg-yellow-500/10 border-yellow-500/20 p-3">
            <p className="text-yellow-200 text-xs font-medium mb-2">Privacy-Enhanced Preview:</p>
            <p className="text-yellow-200/80 text-xs leading-relaxed whitespace-pre-wrap">
              {sanitizedPreview}
            </p>
          </Card>
        )}

        {/* Crisis Resources Notice */}
        {crisisDetected.length > 0 && (
          <Card className="bg-red-500/10 border-red-500/20 p-3">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-lg">🆘</span>
              <div>
                <p className="text-red-200 text-sm font-medium mb-1">Crisis Support Available</p>
                <p className="text-red-200/80 text-xs leading-relaxed mb-2">
                  It sounds like you might be going through a really difficult time. You don't have to face this alone.
                </p>
                <Button
                  onClick={() => router.push('/crisis-resources')}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                >
                  Get Immediate Support
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Card>

      {/* Community Guidelines Reminder */}
      <Card className="bg-white/5 border-white/10 p-4">
        <p className="text-white/80 text-xs leading-relaxed">
          <span className="font-medium">Community Guidelines:</span> Share with authenticity and respect. 
          No identifying information. Focus on wisdom, growth, and support. Crisis support is available 24/7 
          through our resources page. Your voice matters and your privacy is sacred.
        </p>
      </Card>
    </div>
  );
}