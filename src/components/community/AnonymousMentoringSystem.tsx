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
import { useRouter } from 'next/navigation';

interface AnonymousMentoringSystemProps {
  ephemeralIdentity: EphemeralCommunityIdentity;
}

interface MentorProfile {
  ephemeralId: string;
  healingStage: 'early-healing' | 'active-growth' | 'integration' | 'wisdom-keeper';
  pathwaysExperience: string[];
  culturalBackgrounds: string[];
  specialties: string[];
  availabilityWindow: number; // hours per week
  supportStyle: 'gentle-guidance' | 'practical-tools' | 'spiritual-wisdom' | 'trauma-informed';
  languageSupport: string[];
  anonymityLevel: 'full-anonymous' | 'voice-only' | 'text-only';
  isActive: boolean;
  rating: number;
  completedMentorships: number;
  createdAt: Date;
}

interface MentorshipRequest {
  id: string;
  seekerEphemeralId: string;
  requestType: 'one-time-guidance' | 'short-term-support' | 'crisis-companion';
  pathway?: string;
  culturalPreference?: string;
  supportNeeds: string[];
  urgencyLevel: 'low' | 'moderate' | 'high' | 'crisis';
  requestContent: string;
  matchedMentorId?: string;
  status: 'pending' | 'matched' | 'active' | 'completed' | 'closed';
  createdAt: Date;
  expiresAt: Date;
}

const HEALING_STAGES = [
  {
    id: 'early-healing',
    name: 'Early Healing',
    description: 'Just beginning to process and understand trauma/challenges',
    emoji: '🌱',
    mentorRequirement: 'integration'
  },
  {
    id: 'active-growth',
    name: 'Active Growth',
    description: 'Actively working on healing patterns and building new habits',
    emoji: '🌿',
    mentorRequirement: 'wisdom-keeper'
  },
  {
    id: 'integration',
    name: 'Integration Phase',
    description: 'Integrating lessons and developing consistent healing practices',
    emoji: '🌳',
    mentorRequirement: 'wisdom-keeper'
  },
  {
    id: 'wisdom-keeper',
    name: 'Wisdom Keeper',
    description: 'Ready to guide others while continuing personal growth',
    emoji: '🏔️',
    mentorRequirement: null // Can mentor all stages
  }
];

const MENTORSHIP_SPECIALTIES = [
  { id: 'trauma-recovery', name: 'Trauma Recovery', description: 'PTSD, complex trauma, recovery paths' },
  { id: 'addiction-recovery', name: 'Addiction Recovery', description: 'Substance recovery, behavioral addictions' },
  { id: 'identity-exploration', name: 'Identity Exploration', description: 'LGBTQ+ journey, cultural identity, self-discovery' },
  { id: 'relationship-healing', name: 'Relationship Healing', description: 'Family trauma, boundary setting, healthy relationships' },
  { id: 'spiritual-growth', name: 'Spiritual Growth', description: 'Faith transitions, spiritual practices, meaning-making' },
  { id: 'career-purpose', name: 'Career & Purpose', description: 'Life direction, career transitions, finding purpose' },
  { id: 'anxiety-depression', name: 'Anxiety & Depression', description: 'Mental health management, coping strategies' },
  { id: 'grief-loss', name: 'Grief & Loss', description: 'Death, divorce, major life changes' }
];

const SUPPORT_STYLES = [
  { id: 'gentle-guidance', name: 'Gentle Guidance', description: 'Soft, nurturing approach with lots of validation' },
  { id: 'practical-tools', name: 'Practical Tools', description: 'Concrete strategies and actionable steps' },
  { id: 'spiritual-wisdom', name: 'Spiritual Wisdom', description: 'Faith-based or spiritual perspective on healing' },
  { id: 'trauma-informed', name: 'Trauma-Informed', description: 'Clinical understanding with lived experience' }
];

export default function AnonymousMentoringSystem({ ephemeralIdentity }: AnonymousMentoringSystemProps) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<'selection' | 'become-mentor' | 'seek-mentor' | 'active-mentorship'>('selection');
  const [healingStage, setHealingStage] = useState<string>('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [supportStyle, setSupportStyle] = useState<string>('');
  const [mentorshipRequest, setMentorshipRequest] = useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = useState<string>('moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);

  // Real-time content moderation
  useEffect(() => {
    if (mentorshipRequest.trim().length > 0) {
      TraumaInformedModerator.moderateContent(mentorshipRequest).then(setModerationResult);
    }
  }, [mentorshipRequest]);

  const handleBecomeMentor = async () => {
    if (!healingStage || selectedSpecialties.length === 0 || !supportStyle) return;

    setIsSubmitting(true);

    try {
      const mentorProfile: Partial<MentorProfile> = {
        ephemeralId: ephemeralIdentity.ephemeralId,
        healingStage: healingStage as any,
        pathwaysExperience: ['resilience', 'becoming'], // Would be dynamic based on user data
        culturalBackgrounds: ['universal'], // Would be user-specified
        specialties: selectedSpecialties,
        availabilityWindow: 5, // 5 hours per week default
        supportStyle: supportStyle as any,
        languageSupport: ['en'],
        anonymityLevel: 'text-only',
        isActive: true,
        rating: 5.0,
        completedMentorships: 0,
        createdAt: new Date()
      };

      // In production, save to Firebase with proper security rules
      console.log('Creating mentor profile:', mentorProfile);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Welcome to our mentoring community! Your anonymous profile is active. You\'ll be matched with seekers who could benefit from your experience.');
      setCurrentMode('active-mentorship');
      
    } catch (error) {
      console.error('Error creating mentor profile:', error);
      alert('There was an issue creating your mentor profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeekMentor = async () => {
    if (!mentorshipRequest.trim() || selectedSpecialties.length === 0) return;
    
    if (moderationResult?.riskLevel === 'crisis') {
      router.push('/crisis-resources');
      return;
    }

    setIsSubmitting(true);

    try {
      const request: Partial<MentorshipRequest> = {
        id: `req_${Date.now()}`,
        seekerEphemeralId: ephemeralIdentity.ephemeralId,
        requestType: urgencyLevel === 'crisis' ? 'crisis-companion' : 'short-term-support',
        supportNeeds: selectedSpecialties,
        urgencyLevel: urgencyLevel as any,
        requestContent: mentorshipRequest,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      // In production, save to Firebase and trigger matching algorithm
      console.log('Creating mentorship request:', request);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Your request has been submitted anonymously. We\'re matching you with an experienced community member who understands your journey. You\'ll hear back within 24 hours.');
      setCurrentMode('active-mentorship');
      
    } catch (error) {
      console.error('Error creating mentorship request:', error);
      alert('There was an issue submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModeSelection = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 flex items-center justify-center">
          <span className="text-2xl">🌱</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Anonymous Mentoring</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Connect with experienced healers or share your wisdom - all through complete anonymity and trauma-informed matching.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="bg-blue-500/10 border-blue-500/20 p-6 cursor-pointer hover:bg-blue-500/15 transition-colors group"
          onClick={() => setCurrentMode('seek-mentor')}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🤗</span>
            </div>
            <h3 className="text-blue-200 font-medium mb-2">Seek Guidance</h3>
            <p className="text-blue-200/80 text-sm mb-4">
              Connect with someone who's walked a similar path and can offer wisdom from their healing journey.
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-400/60"></span>
                <span className="text-blue-200/70 text-xs">Anonymous matching</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-400/60"></span>
                <span className="text-blue-200/70 text-xs">Trauma-informed support</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-400/60"></span>
                <span className="text-blue-200/70 text-xs">Crisis-safe environment</span>
              </div>
            </div>
          </div>
        </Card>

        <Card 
          className="bg-green-500/10 border-green-500/20 p-6 cursor-pointer hover:bg-green-500/15 transition-colors group"
          onClick={() => setCurrentMode('become-mentor')}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏔️</span>
            </div>
            <h3 className="text-green-200 font-medium mb-2">Share Wisdom</h3>
            <p className="text-green-200/80 text-sm mb-4">
              Guide others through challenges you've overcome while maintaining complete anonymity and healthy boundaries.
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-400/60"></span>
                <span className="text-green-200/70 text-xs">Give back safely</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-400/60"></span>
                <span className="text-green-200/70 text-xs">Boundary protection</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-400/60"></span>
                <span className="text-green-200/70 text-xs">Structured support</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Healing Stages Overview */}
      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Healing Stages & Mentorship</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {HEALING_STAGES.map((stage) => (
            <div key={stage.id} className="text-center">
              <div className="text-2xl mb-2">{stage.emoji}</div>
              <h4 className="text-white/90 text-sm font-medium mb-1">{stage.name}</h4>
              <p className="text-white/60 text-xs leading-relaxed">{stage.description}</p>
            </div>
          ))}
        </div>
        <p className="text-white/70 text-xs mt-4 text-center">
          We match seekers with mentors who are at least one stage ahead in their healing journey.
        </p>
      </Card>
    </div>
  );

  const renderBecomeMentor = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 flex items-center justify-center">
          <span className="text-2xl">🏔️</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Become an Anonymous Mentor</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Share your wisdom while maintaining complete privacy. Help others navigate challenges you've overcome.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Your Healing Stage</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {HEALING_STAGES.filter(stage => stage.id !== 'early-healing').map((stage) => (
            <button
              key={stage.id}
              onClick={() => setHealingStage(stage.id)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                healingStage === stage.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{stage.emoji}</span>
                <span className="font-medium text-sm">{stage.name}</span>
              </div>
              <p className="text-xs opacity-80">{stage.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Your Areas of Experience</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {MENTORSHIP_SPECIALTIES.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => {
                setSelectedSpecialties(prev => 
                  prev.includes(specialty.id) 
                    ? prev.filter(id => id !== specialty.id)
                    : [...prev, specialty.id]
                );
              }}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                selectedSpecialties.includes(specialty.id)
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <p className="text-sm font-medium mb-1">{specialty.name}</p>
              <p className="text-xs opacity-80">{specialty.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Your Support Style</h3>
        <div className="space-y-2">
          {SUPPORT_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSupportStyle(style.id)}
              className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                supportStyle === style.id
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <p className="text-sm font-medium mb-1">{style.name}</p>
              <p className="text-xs opacity-80">{style.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <h3 className="text-blue-200 font-medium mb-2">Mentor Protection Promise</h3>
        <ul className="text-blue-200/80 text-xs space-y-1">
          <li>• Complete anonymity - no personal information shared</li>
          <li>• Structured interactions - no overwhelming requests</li>
          <li>• Crisis escalation - professional support for emergencies</li>
          <li>• Boundary tools - easy ways to step back when needed</li>
          <li>• Community support - mentor-to-mentor backing</li>
        </ul>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentMode('selection')}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          onClick={handleBecomeMentor}
          disabled={!healingStage || selectedSpecialties.length === 0 || !supportStyle || isSubmitting}
          className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Profile...' : 'Become Anonymous Mentor'}
        </Button>
      </div>
    </div>
  );

  const renderSeekMentor = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 flex items-center justify-center">
          <span className="text-2xl">🤗</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Seek Anonymous Guidance</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Connect with someone who understands your journey. Share what you're going through and get matched with experienced support.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">What areas would you like support with?</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {MENTORSHIP_SPECIALTIES.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => {
                setSelectedSpecialties(prev => 
                  prev.includes(specialty.id) 
                    ? prev.filter(id => id !== specialty.id)
                    : [...prev, specialty.id]
                );
              }}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                selectedSpecialties.includes(specialty.id)
                  ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <p className="text-sm font-medium mb-1">{specialty.name}</p>
              <p className="text-xs opacity-80">{specialty.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Share what you're going through</h3>
        <TextArea
          placeholder="Tell us about your situation, what you're struggling with, or what kind of guidance you're seeking. This helps us match you with someone who has relevant experience..."
          value={mentorshipRequest}
          onChange={(e) => setMentorshipRequest(e.target.value)}
          className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs ${mentorshipRequest.length > 500 ? 'text-red-400' : 'text-white/40'}`}>
            {mentorshipRequest.length}/500 characters
          </span>
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">How urgently do you need support?</h3>
        <div className="space-y-2">
          {[
            { id: 'low', name: 'Low - Within a few days is fine', color: 'green' },
            { id: 'moderate', name: 'Moderate - Within 24 hours would help', color: 'yellow' },
            { id: 'high', name: 'High - I really need to talk to someone soon', color: 'orange' },
            { id: 'crisis', name: 'Crisis - I need immediate support', color: 'red' }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setUrgencyLevel(level.id)}
              className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                urgencyLevel === level.id
                  ? `border-${level.color}-500 bg-${level.color}-500/20 text-${level.color}-200`
                  : 'border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <p className="text-sm">{level.name}</p>
            </button>
          ))}
        </div>
      </Card>

      {moderationResult?.riskLevel === 'crisis' && (
        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-lg">🆘</span>
            <div>
              <p className="text-red-200 text-sm font-medium mb-1">Crisis Support Detected</p>
              <p className="text-red-200/80 text-xs leading-relaxed mb-2">
                It sounds like you're in crisis and need immediate professional support. We'll connect you with crisis resources right away.
              </p>
              <Button
                onClick={() => router.push('/crisis-resources')}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
              >
                Get Crisis Support Now
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentMode('selection')}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          onClick={handleSeekMentor}
          disabled={!mentorshipRequest.trim() || selectedSpecialties.length === 0 || isSubmitting}
          className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting Request...' : 'Request Anonymous Mentor'}
        </Button>
      </div>
    </div>
  );

  const renderActiveMentorship = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-green-500/10 border-green-500/20 p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-400/20 flex items-center justify-center">
            <span className="text-2xl">🌟</span>
          </div>
          <h2 className="text-green-200 font-medium mb-2">You're Now Part of Our Mentoring Community!</h2>
          <p className="text-green-200/80 text-sm">
            Check back here to see your mentorship connections, guidance requests, and community impact.
          </p>
        </div>
      </Card>
      
      <Button
        onClick={() => setCurrentMode('selection')}
        className="w-full bg-[#5E8E7F] hover:bg-[#4A6B5E]"
      >
        Back to Mentoring Hub
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {currentMode === 'selection' && renderModeSelection()}
      {currentMode === 'become-mentor' && renderBecomeMentor()}
      {currentMode === 'seek-mentor' && renderSeekMentor()}
      {currentMode === 'active-mentorship' && renderActiveMentorship()}
    </div>
  );
}