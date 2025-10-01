'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { 
  EphemeralIdentity,
  type EphemeralCommunityIdentity,
  type PeerSupportCircle,
  type SupportCircleMember
} from '@/lib/community/privacy-engine';
import { getCulturalGreeting } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

interface PeerSupportCirclesProps {
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  preferredLanguage?: string;
  culturalContext?: string;
}

const CIRCLE_TYPES = {
  resilience: {
    name: 'Resilience Builders',
    emoji: '🌱',
    description: 'For those rebuilding strength after life\'s storms',
    maxMembers: 8,
    prompts: [
      "What helped you take the next breath when everything felt impossible?",
      "Share a moment when you surprised yourself with your own strength",
      "What would you tell someone who feels like they're drowning?"
    ]
  },
  becoming: {
    name: 'Identity Explorers',
    emoji: '🦋',
    description: 'Discovering who you\'re becoming beyond who you were',
    maxMembers: 6,
    prompts: [
      "What old story about yourself are you ready to release?",
      "How are you different from who you were a year ago?",
      "What aspect of yourself are you still learning to love?"
    ]
  },
  purpose: {
    name: 'Meaning Makers',
    emoji: '✨',
    description: 'Finding purpose through pain and growth through struggle',
    maxMembers: 8,
    prompts: [
      "How has your pain pointed you toward your purpose?",
      "What gift do you have that you're finally ready to share?",
      "When do you feel most connected to something larger than yourself?"
    ]
  },
  belonging: {
    name: 'Connection Seekers',
    emoji: '🕊️',
    description: 'Creating authentic community and finding your people',
    maxMembers: 10,
    prompts: [
      "Where do you feel most seen and accepted for who you truly are?",
      "How do you create belonging for others?",
      "What does 'home' feel like in your relationships?"
    ]
  }
};

const CULTURAL_CIRCLES = [
  {
    id: 'ubuntu',
    name: 'Ubuntu Circle',
    emoji: '🌍',
    description: 'African philosophy of interconnected humanity',
    culturalContext: 'ubuntu_philosophy',
    greeting: 'Sawubona - I see you'
  },
  {
    id: 'dharmic',
    name: 'Dharmic Circle',
    emoji: '🪷',
    description: 'Eastern wisdom traditions and mindful healing',
    culturalContext: 'dharmic_values',
    greeting: 'Namaste - The divine in me honors the divine in you'
  },
  {
    id: 'indigenous',
    name: 'Seven Generations Circle',
    emoji: '🌿',
    description: 'Indigenous wisdom and connection to ancestral healing',
    culturalContext: 'ancestral_wisdom',
    greeting: 'Mitákuye Oyás\'iŋ - All my relations'
  },
  {
    id: 'neurodivergent',
    name: 'Neurodivergent Sanctuary',
    emoji: '🌈',
    description: 'Safe space for different ways of experiencing the world',
    culturalContext: 'neurodiversity_affirming',
    greeting: 'Welcome, exactly as you are'
  }
];

const SUPPORT_RITUALS = [
  { id: 'listen', emoji: '👂', name: 'Deep Listening', description: 'Witnessed without judgment' },
  { id: 'reflect', emoji: '🪞', name: 'Gentle Reflection', description: 'Mirror back strengths you see' },
  { id: 'resource', emoji: '🛤️', name: 'Share Resources', description: 'Offer tools that helped you' },
  { id: 'affirm', emoji: '💜', name: 'Loving Affirmation', description: 'Remind them of their worth' },
  { id: 'hold-space', emoji: '🫧', name: 'Hold Space', description: 'Be present with their experience' }
];

export default function PeerSupportCircles({ 
  pathway, 
  preferredLanguage = 'en',
  culturalContext 
}: PeerSupportCirclesProps) {
  const router = useRouter();
  const [ephemeralIdentity, setEphemeralIdentity] = useState<EphemeralCommunityIdentity | null>(null);
  const [availableCircles, setAvailableCircles] = useState<PeerSupportCircle[]>([]);
  const [joinedCircle, setJoinedCircle] = useState<PeerSupportCircle | null>(null);
  const [shareContent, setShareContent] = useState('');
  const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [showCulturalCircles, setShowCulturalCircles] = useState(false);

  // Initialize ephemeral identity
  useEffect(() => {
    const identity = EphemeralIdentity.createEphemeralIdentity();
    setEphemeralIdentity(identity);
    loadAvailableCircles();
  }, []);

  const loadAvailableCircles = async () => {
    // In production, this would query Firestore for active circles
    // For now, we'll create mock data
    const mockCircles: PeerSupportCircle[] = [
      {
        id: 'resilience-1',
        name: CIRCLE_TYPES.resilience.name,
        description: CIRCLE_TYPES.resilience.description,
        pathway: 'resilience',
        maxMembers: CIRCLE_TYPES.resilience.maxMembers,
        currentMembers: 5,
        ephemeralMembers: [],
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
        culturalContext: 'universal',
        languageSupport: ['en', 'es', 'pt']
      },
      {
        id: 'becoming-1',
        name: CIRCLE_TYPES.becoming.name,
        description: CIRCLE_TYPES.becoming.description,
        pathway: 'becoming',
        maxMembers: CIRCLE_TYPES.becoming.maxMembers,
        currentMembers: 3,
        ephemeralMembers: [],
        isActive: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
        culturalContext: 'universal',
        languageSupport: ['en', 'ko', 'zh']
      },
      {
        id: 'ubuntu-1',
        name: 'Ubuntu Healing Circle',
        description: 'Ubuntu philosophy: we heal together because we hurt together',
        maxMembers: 10,
        currentMembers: 7,
        ephemeralMembers: [],
        isActive: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
        culturalContext: 'ubuntu_philosophy',
        languageSupport: ['en', 'sw', 'yo']
      }
    ];
    
    setAvailableCircles(mockCircles);
  };

  const handleJoinCircle = async (circle: PeerSupportCircle) => {
    if (!ephemeralIdentity || isJoining) return;
    
    setIsJoining(true);
    
    try {
      // In production, this would join the circle with proper privacy protection
      const newMember: SupportCircleMember = {
        ephemeralId: ephemeralIdentity.ephemeralId,
        joinedAt: new Date(),
        pathway: circle.pathway,
        culturalBackground: culturalContext,
        isActive: true
      };

      // Simulate joining
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedCircle = {
        ...circle,
        currentMembers: circle.currentMembers + 1,
        ephemeralMembers: [...circle.ephemeralMembers, newMember]
      };
      
      setJoinedCircle(updatedCircle);
      
    } catch (error) {
      console.error('Error joining circle:', error);
      alert('There was an issue joining the circle. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveCircle = () => {
    setJoinedCircle(null);
    setShareContent('');
    setSelectedRitual(null);
  };

  const handleShareInCircle = async () => {
    if (!shareContent.trim() || !joinedCircle || !ephemeralIdentity) return;

    try {
      // In production, this would send the message with proper moderation and privacy
      console.log('Sharing in circle:', {
        circleId: joinedCircle.id,
        ephemeralId: ephemeralIdentity.ephemeralId,
        content: shareContent,
        ritual: selectedRitual
      });

      // Simulate sharing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShareContent('');
      setSelectedRitual(null);
      
      alert('Your message has been shared anonymously with the circle.');
      
    } catch (error) {
      console.error('Error sharing in circle:', error);
      alert('There was an issue sharing your message. Please try again.');
    }
  };

  if (!ephemeralIdentity) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E8E7F] mx-auto mb-4"></div>
            <p className="text-white/80">Preparing your anonymous sanctuary...</p>
          </div>
        </Card>
      </div>
    );
  }

  // If user has joined a circle, show the circle interface
  if (joinedCircle) {
    const circleType = pathway ? CIRCLE_TYPES[pathway] : null;
    const prompts = circleType?.prompts || [
      "What's on your heart that needs to be witnessed?",
      "What support do you need right now?",
      "What wisdom would you share with someone on a similar journey?"
    ];

    return (
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Circle Header */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{joinedCircle.pathway ? CIRCLE_TYPES[joinedCircle.pathway]?.emoji : '🌙'}</span>
                <h2 className="text-lg font-medium text-white">{joinedCircle.name}</h2>
              </div>
              <p className="text-white/80 text-sm mb-2">{joinedCircle.description}</p>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span>👥 {joinedCircle.currentMembers}/{joinedCircle.maxMembers} members</span>
                <span>🕒 Active for 22 hours</span>
              </div>
            </div>
            <Button
              onClick={handleLeaveCircle}
              variant="ghost"
              className="text-white/60 hover:text-white/80 text-xs"
            >
              Leave Circle
            </Button>
          </div>
        </Card>

        {/* Cultural Greeting */}
        {joinedCircle.culturalContext && joinedCircle.culturalContext !== 'universal' && (
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="text-center">
              <p className="text-[#5E8E7F] text-sm font-medium">
                {getCulturalGreeting(preferredLanguage as any)}
              </p>
            </div>
          </Card>
        )}

        {/* Circle Guidelines */}
        <Card className="bg-blue-500/10 border-blue-500/20 p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">🕊️</span>
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Circle Sacred Agreements</p>
              <ul className="text-blue-200/80 text-xs space-y-1">
                <li>• What is shared here, stays here</li>
                <li>• Speak from your heart, listen with compassion</li>
                <li>• No advice unless asked, no judgment ever</li>
                <li>• Honor different paths and perspectives</li>
                <li>• Take care of yourself first</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Support Ritual Selection */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/90 text-sm font-medium mb-3">💜 How would you like to show up today?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SUPPORT_RITUALS.map((ritual) => (
              <button
                key={ritual.id}
                onClick={() => setSelectedRitual(ritual.id)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  selectedRitual === ritual.id
                    ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                    : 'border-white/10 hover:border-white/20 text-white/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{ritual.emoji}</span>
                  <span className="text-xs font-medium">{ritual.name}</span>
                </div>
                <p className="text-xs opacity-80">{ritual.description}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Circle Prompts */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/90 text-sm font-medium mb-3">💭 Circle Reflection Prompts:</p>
          <div className="space-y-2">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setShareContent(prompt + '\n\n')}
                className="w-full text-left p-3 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
              >
                <p className="text-white/80 text-sm italic">"{prompt}"</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Sharing Interface */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Sharing anonymously in circle</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">Anonymous</span>
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">Sacred Space</span>
              </div>
            </div>
            
            <TextArea
              placeholder="Share what's on your heart... this circle holds space for your truth with love and acceptance."
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
              className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/40 text-xs">
              {shareContent.length}/800 characters
            </span>
            <Button
              onClick={handleShareInCircle}
              disabled={!shareContent.trim() || shareContent.length > 800}
              className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
            >
              Share with Circle
            </Button>
          </div>
        </Card>

        {/* Mock Circle Activity */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/90 text-sm font-medium mb-3">Recent Circle Shares</p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <span className="text-white/60 text-xs">Anonymous • 23 minutes ago</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Deep Listening</span>
              </div>
              <p className="text-white/80 text-sm italic">
                "I see your courage in sharing your truth. Thank you for trusting us with your heart. You're not alone in this journey."
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-teal-400 flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <span className="text-white/60 text-xs">Anonymous • 1 hour ago</span>
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Share Resources</span>
              </div>
              <p className="text-white/80 text-sm italic">
                "What you shared about rebuilding trust resonated deeply. I found that journaling about small moments of joy helped me reconnect with hope when everything felt dark."
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show available circles
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">🫂</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Peer Support Circles</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Find your people in small, anonymous groups focused on shared experiences. Connect authentically while maintaining complete privacy.
        </p>
      </div>

      {/* Privacy Assurance */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-400 text-lg">🔐</span>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Anonymous & Ephemeral</p>
            <p className="text-blue-200/80 text-xs leading-relaxed">
              Circles form temporarily with ephemeral identities. No personal information is shared. 
              Conversations disappear after 24 hours. Your privacy is sacred.
            </p>
          </div>
        </div>
      </Card>

      {/* Toggle Cultural Circles */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowCulturalCircles(!showCulturalCircles)}
          variant="ghost"
          className="text-white/70 hover:text-white/90"
        >
          {showCulturalCircles ? 'Show Pathway Circles' : 'Show Cultural Circles'}
        </Button>
      </div>

      {/* Available Circles */}
      <div className="space-y-4">
        {showCulturalCircles ? (
          // Cultural Circles
          CULTURAL_CIRCLES.map((circle) => (
            <Card key={circle.id} className="bg-white/5 border-white/10 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{circle.emoji}</span>
                    <h3 className="text-white font-medium">{circle.name}</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-3">{circle.description}</p>
                  <p className="text-[#5E8E7F] text-xs italic mb-3">"{circle.greeting}"</p>
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                    <span>👥 7/10 members</span>
                    <span>🌍 Multilingual</span>
                    <span>⏰ 23 hours remaining</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleJoinCircle({
                    id: circle.id,
                    name: circle.name,
                    description: circle.description,
                    maxMembers: 10,
                    currentMembers: 7,
                    ephemeralMembers: [],
                    isActive: true,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
                    culturalContext: circle.culturalContext,
                    languageSupport: ['en', 'es', 'sw']
                  })}
                  disabled={isJoining}
                  className="bg-[#5E8E7F] hover:bg-[#4A6B5E] text-sm px-4 py-2"
                >
                  {isJoining ? 'Joining...' : 'Join Circle'}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          // Pathway Circles
          availableCircles.map((circle) => {
            const circleType = circle.pathway ? CIRCLE_TYPES[circle.pathway] : null;
            return (
              <Card key={circle.id} className="bg-white/5 border-white/10 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{circleType?.emoji || '🌙'}</span>
                      <h3 className="text-white font-medium">{circle.name}</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{circle.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                      <span>👥 {circle.currentMembers}/{circle.maxMembers} members</span>
                      <span>🗣️ {circle.languageSupport?.join(', ')}</span>
                      <span>⏰ {Math.floor((circle.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))} hours remaining</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinCircle(circle)}
                    disabled={isJoining || circle.currentMembers >= circle.maxMembers}
                    className="bg-[#5E8E7F] hover:bg-[#4A6B5E] text-sm px-4 py-2"
                  >
                    {isJoining ? 'Joining...' : circle.currentMembers >= circle.maxMembers ? 'Full' : 'Join Circle'}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create New Circle */}
      <Card className="bg-white/5 border-white/10 p-4 text-center">
        <p className="text-white/80 text-sm mb-3">
          Don't see a circle that fits? New circles form when 3+ people express interest in similar themes.
        </p>
        <Button
          variant="ghost"
          className="text-[#5E8E7F] hover:text-white/90"
          onClick={() => router.push('/community/request-circle')}
        >
          Request New Circle
        </Button>
      </Card>
    </div>
  );
}