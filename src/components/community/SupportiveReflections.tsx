'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { 
  EphemeralIdentity,
  TraumaInformedModerator,
  type EphemeralCommunityIdentity,
  type ModerationResult
} from '@/lib/community/privacy-engine';
import CrisisKeywordDetector from '@/components/ui/CrisisKeywordDetector';

interface SupportiveReflectionsProps {
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  userId?: string;
}

interface SupportiveReflection {
  id: string;
  ephemeralId: string;
  originalShare: {
    content: string;
    emotionalState: string;
    pathway?: string;
  };
  supportiveResponse: string;
  supportType: 'validation' | 'encouragement' | 'resource' | 'witness' | 'hope';
  moderationResult: ModerationResult;
  isAnonymous: boolean;
  createdAt: Date;
  reactions: {
    helpful: number;
    healing: number;
    hope: number;
  };
}

const SUPPORT_TYPES = {
  validation: {
    emoji: '✨',
    name: 'Validation',
    description: 'Affirm their experience and feelings',
    prompts: [
      'What you\'re feeling is completely valid and understandable',
      'Your experience matters and deserves to be heard',
      'There\'s nothing wrong with you for feeling this way'
    ],
    tone: 'gentle affirmation'
  },
  encouragement: {
    emoji: '💪',
    name: 'Encouragement',
    description: 'Offer gentle strength and hope',
    prompts: [
      'I see incredible strength in how you\'re handling this',
      'You\'ve survived difficult things before, and that resilience is still with you',
      'Taking this step to share shows tremendous courage'
    ],
    tone: 'gentle strength'
  },
  witness: {
    emoji: '👁️',
    name: 'Witness',
    description: 'Simply acknowledge their truth',
    prompts: [
      'I hear you and I see your pain',
      'Thank you for trusting us with this part of your story',
      'You don\'t have to carry this alone anymore'
    ],
    tone: 'loving presence'
  },
  resource: {
    emoji: '🛤️',
    name: 'Gentle Resources',
    description: 'Suggest helpful practices or support',
    prompts: [
      'Something that helped me in a similar situation was...',
      'Have you considered exploring... (only if it feels right for you)',
      'You might find some comfort in... but trust your own instincts'
    ],
    tone: 'offering, not prescribing'
  },
  hope: {
    emoji: '🌱',
    name: 'Hope Sharing',
    description: 'Share how things can change and grow',
    prompts: [
      'Healing isn\'t linear, but it is possible',
      'You\'re planting seeds now that will bloom in their own time',
      'I\'ve seen transformation happen in the most unexpected ways'
    ],
    tone: 'gentle hope'
  }
};

const TRAUMA_INFORMED_GUIDELINES = [
  {
    do: 'Affirm their experience without minimizing',
    dont: 'Say "everything happens for a reason" or "it could be worse"'
  },
  {
    do: 'Focus on their strengths and resilience',
    dont: 'Give advice unless specifically asked'
  },
  {
    do: 'Honor their autonomy and choices',
    dont: 'Tell them what they "should" do or feel'
  },
  {
    do: 'Create emotional safety through validation',
    dont: 'Push them to "get over it" or move on'
  },
  {
    do: 'Recognize their expertise on their own experience',
    dont: 'Assume you know what they need'
  }
];

const MOCK_SHARES_NEEDING_SUPPORT = [
  {
    id: '1',
    content: 'I feel like I\'m drowning. Every day feels harder than the last, and I don\'t know how to keep going. I\'ve been trying so hard to heal, but I feel like I\'m just getting worse.',
    emotionalState: 'overwhelmed',
    pathway: 'resilience',
    timeAgo: '2 hours ago',
    supportCount: 3
  },
  {
    id: '2',
    content: 'I don\'t recognize myself anymore. The person I used to be feels like a stranger, and I don\'t know who I\'m becoming. It\'s scary not knowing yourself.',
    emotionalState: 'confused',
    pathway: 'becoming',
    timeAgo: '5 hours ago',
    supportCount: 1
  },
  {
    id: '3',
    content: 'Sometimes I wonder if my pain serves any purpose at all. I see everyone else moving forward while I feel stuck in the same place, dealing with the same struggles.',
    emotionalState: 'questioning',
    pathway: 'purpose',
    timeAgo: '8 hours ago',
    supportCount: 7
  }
];

export default function SupportiveReflections({ pathway, userId }: SupportiveReflectionsProps) {
  const [ephemeralIdentity, setEphemeralIdentity] = useState<EphemeralCommunityIdentity | null>(null);
  const [selectedShare, setSelectedShare] = useState<any>(null);
  const [supportResponse, setSupportResponse] = useState('');
  const [selectedSupportType, setSelectedSupportType] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [moderationFeedback, setModerationFeedback] = useState<ModerationResult | null>(null);

  useEffect(() => {
    const identity = EphemeralIdentity.createEphemeralIdentity();
    setEphemeralIdentity(identity);
  }, []);

  // Real-time moderation check
  useEffect(() => {
    if (supportResponse.trim().length > 10) {
      checkModerationGuidance();
    }
  }, [supportResponse]);

  const checkModerationGuidance = async () => {
    const result = await TraumaInformedModerator.moderateContent(supportResponse);
    setModerationFeedback(result);
  };

  const handleCrisisDetection = (keywords: string[]) => {
    setCrisisDetected(keywords);
  };

  const handleSelectShare = (share: any) => {
    setSelectedShare(share);
    setSupportResponse('');
    setSelectedSupportType(null);
    setModerationFeedback(null);
  };

  const handleSupportTypeSelect = (type: string) => {
    setSelectedSupportType(type);
    const supportType = SUPPORT_TYPES[type as keyof typeof SUPPORT_TYPES];
    
    // Pre-populate with gentle prompts
    const prompt = supportType.prompts[Math.floor(Math.random() * supportType.prompts.length)];
    setSupportResponse(`${prompt}\n\n`);
  };

  const handleSubmitSupport = async () => {
    if (!ephemeralIdentity || !supportResponse.trim() || !selectedShare || crisisDetected.length > 0) return;

    setIsSubmitting(true);

    try {
      // Final moderation check
      const finalModeration = await TraumaInformedModerator.moderateContent(supportResponse);
      
      if (!finalModeration.approved) {
        alert('Your response needs some adjustments to ensure it\'s trauma-informed and supportive. Please review the guidelines and try again.');
        setIsSubmitting(false);
        return;
      }

      const reflection: Partial<SupportiveReflection> = {
        ephemeralId: ephemeralIdentity.ephemeralId,
        originalShare: {
          content: selectedShare.content,
          emotionalState: selectedShare.emotionalState,
          pathway: selectedShare.pathway
        },
        supportiveResponse: supportResponse.trim(),
        supportType: selectedSupportType as any,
        moderationResult: finalModeration,
        isAnonymous: true,
        createdAt: new Date()
      };

      // In production, this would save to Firebase with proper security
      console.log('Submitting supportive reflection:', reflection);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setSupportResponse('');
      setSelectedShare(null);
      setSelectedSupportType(null);
      setModerationFeedback(null);
      
      alert('Your supportive reflection has been shared anonymously. Thank you for being part of our healing community.');
      
    } catch (error) {
      console.error('Error submitting support:', error);
      alert('There was an issue submitting your support. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ephemeralIdentity) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E8E7F] mx-auto mb-4"></div>
            <p className="text-white/80">Creating your supportive space...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">💜</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Supportive Reflections</h1>
        <p className="text-white/80 text-sm max-w-2xl mx-auto">
          Offer trauma-informed support to community members who have shared their struggles. 
          Your gentle words can be the light someone needs to see.
        </p>
      </div>

      {/* Trauma-Informed Guidelines */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">🧠</span>
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Trauma-Informed Support Guidelines</p>
              <p className="text-blue-200/80 text-xs leading-relaxed mb-2">
                Our community follows trauma-informed principles. Focus on validation, empowerment, and safety.
              </p>
              <Button
                onClick={() => setShowGuidelines(!showGuidelines)}
                variant="ghost"
                className="text-blue-300 hover:text-blue-200 text-xs px-0"
              >
                {showGuidelines ? 'Hide' : 'Show'} Guidelines
              </Button>
            </div>
          </div>
        </div>

        {showGuidelines && (
          <div className="mt-4 space-y-2">
            {TRAUMA_INFORMED_GUIDELINES.map((guideline, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-green-500/10 p-2 rounded">
                  <span className="text-green-300 font-medium">✓ DO: </span>
                  <span className="text-green-200/80">{guideline.do}</span>
                </div>
                <div className="bg-red-500/10 p-2 rounded">
                  <span className="text-red-300 font-medium">✗ DON'T: </span>
                  <span className="text-red-200/80">{guideline.dont}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedShare ? (
        /* Support Response Interface */
        <div className="space-y-6">
          <Button
            onClick={() => setSelectedShare(null)}
            variant="ghost"
            className="text-white/60 hover:text-white/80"
          >
            ← Back to Shares
          </Button>

          {/* Original Share */}
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/60 text-sm">Anonymous • {selectedShare.timeAgo}</span>
                {selectedShare.pathway && (
                  <span className="px-2 py-1 rounded-full bg-[#5E8E7F]/20 text-[#5E8E7F] text-xs capitalize">
                    {selectedShare.pathway}
                  </span>
                )}
                <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs capitalize">
                  {selectedShare.emotionalState}
                </span>
              </div>
              <p className="text-white/90 leading-relaxed">{selectedShare.content}</p>
            </div>
            <div className="text-xs text-white/60">
              {selectedShare.supportCount} people have offered support
            </div>
          </Card>

          {/* Support Type Selection */}
          <Card className="bg-white/5 border-white/10 p-4">
            <p className="text-white/90 text-sm font-medium mb-3">💫 How would you like to offer support?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(SUPPORT_TYPES).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => handleSupportTypeSelect(key)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedSupportType === key
                      ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                      : 'border-white/10 hover:border-white/20 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{type.emoji}</span>
                    <span className="text-xs font-medium">{type.name}</span>
                  </div>
                  <p className="text-xs opacity-80">{type.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Support Response Form */}
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Your supportive response (anonymous)</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">Anonymous</span>
                  {selectedSupportType && (
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">
                      {SUPPORT_TYPES[selectedSupportType as keyof typeof SUPPORT_TYPES].name}
                    </span>
                  )}
                </div>
              </div>
              
              <CrisisKeywordDetector 
                text={supportResponse}
                onCrisisDetected={handleCrisisDetection}
              />
              
              <TextArea
                placeholder="Offer your gentle, trauma-informed support... Remember to validate their experience, honor their strength, and create emotional safety through your words."
                value={supportResponse}
                onChange={(e) => setSupportResponse(e.target.value)}
                className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
              />
            </div>

            {/* Real-time Moderation Feedback */}
            {moderationFeedback && (
              <Card className={`mb-4 p-3 ${
                moderationFeedback.approved 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={moderationFeedback.approved ? 'text-green-400' : 'text-yellow-400'}>
                    {moderationFeedback.approved ? '✅' : '⚠️'}
                  </span>
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      moderationFeedback.approved ? 'text-green-200' : 'text-yellow-200'
                    }`}>
                      {moderationFeedback.approved 
                        ? 'Trauma-informed and supportive ✨' 
                        : 'Consider adjusting for better support'
                      }
                    </p>
                    {!moderationFeedback.approved && moderationFeedback.suggestedResources.length > 0 && (
                      <p className="text-yellow-200/80 text-xs">
                        Suggested approach: Focus on validation and gentle encouragement rather than advice or solutions.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}
            
            <div className="flex justify-between items-center">
              <span className={`text-xs ${
                supportResponse.length > 500 ? 'text-red-400' : 'text-white/40'
              }`}>
                {supportResponse.length}/500 characters
              </span>
              <Button
                onClick={handleSubmitSupport}
                disabled={!supportResponse.trim() || supportResponse.length > 500 || crisisDetected.length > 0 || isSubmitting || !moderationFeedback?.approved}
                className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Support...' : 'Send Supportive Response'}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* Shares Needing Support */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light text-white">Community Members Seeking Support</h2>
            <span className="text-white/60 text-sm">{MOCK_SHARES_NEEDING_SUPPORT.length} people could use your kindness</span>
          </div>

          {MOCK_SHARES_NEEDING_SUPPORT.map((share) => (
            <Card key={share.id} className="bg-white/5 border-white/10 p-4">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/60 text-sm">Anonymous • {share.timeAgo}</span>
                  {share.pathway && (
                    <span className="px-2 py-1 rounded-full bg-[#5E8E7F]/20 text-[#5E8E7F] text-xs capitalize">
                      {share.pathway}
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs capitalize">
                    {share.emotionalState}
                  </span>
                </div>
                <p className="text-white/90 leading-relaxed mb-3">{share.content}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">
                  💜 {share.supportCount} supportive responses
                </span>
                <Button
                  onClick={() => handleSelectShare(share)}
                  className="bg-[#5E8E7F] hover:bg-[#4A6B5E] text-sm px-4 py-2"
                >
                  Offer Support
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Supportive Responses */}
      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-light text-white text-center">Recent Supportive Responses</h2>
        
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60 text-xs">Anonymous supporter • 1 hour ago</span>
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">Validation</span>
            </div>
            <p className="text-white/90 text-sm italic leading-relaxed">
              "What you're feeling is completely valid. The fact that you're still showing up and trying, even when it feels impossible, shows incredible strength. Healing isn't linear, and it's okay to have hard days. You're not alone in this."
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>💜 23 helpful</span>
            <span>✨ 18 healing</span>
            <span>🌱 31 hope</span>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60 text-xs">Anonymous supporter • 3 hours ago</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">Witness</span>
            </div>
            <p className="text-white/90 text-sm italic leading-relaxed">
              "I hear you and I see your courage in sharing this. The confusion you're feeling about who you're becoming makes complete sense - growth can feel disorienting. Thank you for trusting us with this vulnerable part of your journey."
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span>💜 19 helpful</span>
            <span>✨ 22 healing</span>
            <span>🌱 15 hope</span>
          </div>
        </Card>
      </div>
    </div>
  );
}