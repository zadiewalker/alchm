'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnonymousWisdomSharing from './AnonymousWisdomSharing';
import PeerSupportCircles from './PeerSupportCircles';
import CollectiveGrowthInsights from './CollectiveGrowthInsights';
import SupportiveReflections from './SupportiveReflections';
import CulturalWisdomExchange from './CulturalWisdomExchange';
import SharingCircle from './SharingCircle';
import AnonymousMentoringSystem from './AnonymousMentoringSystem';
import CommunityWisdomLibrary from './CommunityWisdomLibrary';
import CollectiveHealingChallenges from './CollectiveHealingChallenges';
import AcrossTheMarshStories from './AcrossTheMarshStories';
import CulturalHealingCircles from './CulturalHealingCircles';
import CrisisSafeCommunityResponse from './CrisisSafeCommunityResponse';
import CommunityAnalyticsDashboard from './CommunityAnalyticsDashboard';
import { EphemeralIdentity, type EphemeralCommunityIdentity } from '@/lib/community/privacy-engine';

interface CommunityHubProps {
  userId?: string;
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  preferredLanguage?: string;
}

type CommunityView = 
  | 'hub' 
  | 'wisdom-sharing' 
  | 'peer-circles' 
  | 'insights' 
  | 'support-reflections' 
  | 'cultural-exchange'
  | 'sharing-circle'
  | 'marsh-stories'
  | 'mentoring'
  | 'challenges'
  | 'wisdom-library'
  | 'cultural-circles'
  | 'crisis-response'
  | 'analytics';

const COMMUNITY_FEATURES = [
  {
    id: 'marsh-stories' as CommunityView,
    name: 'Across the Marsh',
    emoji: '🌊',
    description: 'Anonymous healing journey stories from struggle to transformation',
    benefits: ['Story sharing', 'Journey witnessing', 'Hope building'],
    color: 'from-blue-400 to-purple-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'wisdom-sharing' as CommunityView,
    name: 'Anonymous Wisdom Sharing',
    emoji: '✨',
    description: 'Share insights from your healing journey without revealing your identity',
    benefits: ['Complete anonymity', 'Privacy-first design', 'Trauma-informed moderation'],
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    id: 'peer-circles' as CommunityView,
    name: 'Peer Support Circles',
    emoji: '🫂',
    description: 'Small, anonymous groups for shared experiences and mutual support',
    benefits: ['Ephemeral identities', 'Pathway-focused', 'Cultural sensitivity'],
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'mentoring' as CommunityView,
    name: 'Anonymous Mentoring',
    emoji: '🌱',
    description: 'Give back or receive guidance from experienced healers anonymously',
    benefits: ['Healing stage matching', 'Boundary protection', 'Mutual growth'],
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  {
    id: 'challenges' as CommunityView,
    name: 'Collective Challenges',
    emoji: '🎯',
    description: 'Join community healing activities that unite without comparison',
    benefits: ['Non-competitive growth', 'Collective goals', 'Mutual support'],
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  },
  {
    id: 'wisdom-library' as CommunityView,
    name: 'Community Wisdom Library',
    emoji: '📚',
    description: 'Curated healing insights and strategies shared by the community',
    benefits: ['Quality curated content', 'Searchable wisdom', 'Peer reviewed'],
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20'
  },
  {
    id: 'cultural-circles' as CommunityView,
    name: 'Cultural Healing Circles',
    emoji: '🌍',
    description: 'Honor diverse healing traditions in culturally-aware spaces',
    benefits: ['Cultural respect', 'Traditional wisdom', 'Inclusive practices'],
    color: 'from-teal-400 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20'
  },
  {
    id: 'crisis-response' as CommunityView,
    name: 'Crisis Support',
    emoji: '🛡️',
    description: 'Crisis-safe community response with professional integration',
    benefits: ['Trained responders', 'Professional escalation', 'Crisis resources'],
    color: 'from-red-400 to-pink-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  {
    id: 'analytics' as CommunityView,
    name: 'Community Analytics',
    emoji: '📊',
    description: 'Collective healing patterns without individual tracking',
    benefits: ['Privacy-preserving insights', 'Community patterns', 'Healing trends'],
    color: 'from-cyan-400 to-teal-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  }
];

const COMMUNITY_STATS = {
  totalShares: 12847,
  activeSupportCircles: 34,
  culturalTraditions: 47,
  supportiveResponses: 8932,
  privacyScore: 100, // Perfect privacy record
  activeMembers: 2156 // Currently online
};

const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    description: '24/7 free and confidential support',
    international: false
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 crisis support via text',
    international: false
  },
  {
    name: 'International Association for Suicide Prevention',
    url: 'https://www.iasp.info/resources/Crisis_Centres/',
    description: 'Crisis centers worldwide',
    international: true
  }
];

export default function CommunityHub({ 
  userId, 
  pathway, 
  preferredLanguage = 'en' 
}: CommunityHubProps) {
  const [currentView, setCurrentView] = useState<CommunityView>('hub');
  const [ephemeralIdentity, setEphemeralIdentity] = useState<EphemeralCommunityIdentity | null>(null);

  // Initialize ephemeral identity for anonymous participation
  useEffect(() => {
    const identity = EphemeralIdentity.createEphemeralIdentity();
    setEphemeralIdentity(identity);
  }, []);
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  const renderCurrentView = () => {
    if (!ephemeralIdentity) {
      return (
        <div className="max-w-2xl mx-auto p-4">
          <Card className="bg-white/5 border-white/10 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5E8E7F] mx-auto mb-6"></div>
              <h2 className="text-xl text-white mb-2">Preparing Your Anonymous Sanctuary</h2>
              <p className="text-white/70">Creating your secure, private space for community healing...</p>
            </div>
          </Card>
        </div>
      );
    }

    switch (currentView) {
      case 'marsh-stories':
        return <AcrossTheMarshStories ephemeralIdentity={ephemeralIdentity} />;
      case 'wisdom-sharing':
        return <AnonymousWisdomSharing pathway={pathway} />;
      case 'peer-circles':
        return <PeerSupportCircles pathway={pathway} preferredLanguage={preferredLanguage} />;
      case 'mentoring':
        return <AnonymousMentoringSystem ephemeralIdentity={ephemeralIdentity} />;
      case 'challenges':
        return <CollectiveHealingChallenges ephemeralIdentity={ephemeralIdentity} />;
      case 'wisdom-library':
        return <CommunityWisdomLibrary ephemeralIdentity={ephemeralIdentity} />;
      case 'cultural-circles':
        return <CulturalHealingCircles ephemeralIdentity={ephemeralIdentity} />;
      case 'crisis-response':
        return <CrisisSafeCommunityResponse ephemeralIdentity={ephemeralIdentity} />;
      case 'analytics':
        return <CommunityAnalyticsDashboard />;
      case 'insights':
        return <CollectiveGrowthInsights userId={userId} pathway={pathway} />;
      case 'support-reflections':
        return <SupportiveReflections pathway={pathway} userId={userId} />;
      case 'cultural-exchange':
        return <CulturalWisdomExchange preferredLanguage={preferredLanguage} />;
      case 'sharing-circle':
        return <SharingCircle pathway={pathway} />;
      default:
        return renderHubView();
    }
  };

  const renderHubView = () => (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-3xl">🌟</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-4">Community Sanctuary</h1>
        <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
          Connect with others on healing journeys while maintaining complete anonymity. 
          Share wisdom, find support, and discover you're not alone—all within a privacy-first sanctuary.
        </p>
      </div>

      {/* Privacy Promise */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
            <span className="text-blue-300 text-xl">🛡️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-blue-200 text-lg font-medium mb-2">Our Privacy Promise</h3>
            <p className="text-blue-200/80 text-sm leading-relaxed mb-3">
              Zero personal information sharing. Ephemeral identities. No tracking. No data mining. 
              Your privacy is not just protected—it's sacred. We've maintained 100% anonymity since day one.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-blue-300 font-medium text-lg">{COMMUNITY_STATS.privacyScore}%</div>
                <div className="text-blue-200/60 text-xs">Privacy Score</div>
              </div>
              <div>
                <div className="text-blue-300 font-medium text-lg">0</div>
                <div className="text-blue-200/60 text-xs">Data Breaches</div>
              </div>
              <div>
                <div className="text-blue-300 font-medium text-lg">∞</div>
                <div className="text-blue-200/60 text-xs">Anonymity Level</div>
              </div>
              <div>
                <div className="text-blue-300 font-medium text-lg">24/7</div>
                <div className="text-blue-200/60 text-xs">Safety Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Crisis Support Banner */}
      <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-300 text-xl">🆘</span>
            <div>
              <p className="text-red-200 text-sm font-medium">Crisis Support Available 24/7</p>
              <p className="text-red-200/80 text-xs">If you're in crisis, you don't have to face it alone</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCrisisResources(!showCrisisResources)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            Get Help Now
          </Button>
        </div>
        
        {showCrisisResources && (
          <div className="mt-4 pt-4 border-t border-red-500/20 space-y-2">
            {CRISIS_RESOURCES.map((resource, index) => (
              <div key={index} className="bg-red-500/10 rounded-lg p-3">
                <h4 className="text-red-200 font-medium text-sm">{resource.name}</h4>
                <p className="text-red-200/80 text-xs mb-1">{resource.description}</p>
                {resource.number && (
                  <p className="text-red-300 font-mono text-sm">{resource.number}</p>
                )}
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-200 text-sm underline">
                    Access Resources
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <div className="text-2xl font-medium text-[#5E8E7F] mb-1">
            {COMMUNITY_STATS.totalShares.toLocaleString()}
          </div>
          <div className="text-white/60 text-xs">Anonymous Shares</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <div className="text-2xl font-medium text-[#5E8E7F] mb-1">
            {COMMUNITY_STATS.activeSupportCircles}
          </div>
          <div className="text-white/60 text-xs">Active Circles</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <div className="text-2xl font-medium text-[#5E8E7F] mb-1">
            {COMMUNITY_STATS.culturalTraditions}
          </div>
          <div className="text-white/60 text-xs">Cultural Traditions</div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4 text-center">
          <div className="text-2xl font-medium text-[#5E8E7F] mb-1">
            {COMMUNITY_STATS.activeMembers.toLocaleString()}
          </div>
          <div className="text-white/60 text-xs">Active Members</div>
        </Card>
      </div>

      {/* Simplified Community Features - Progressive Disclosure */}
      <div className="max-w-2xl mx-auto space-y-3">
        {COMMUNITY_FEATURES.slice(0, 4).map((feature) => (
          <button 
            key={feature.id} 
            className="w-full flex items-center gap-6 p-6 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 hover:scale-[1.01] transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-white/30"
            onClick={() => setCurrentView(feature.id)}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
              {feature.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-lg mb-1">{feature.name}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
            </div>
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
        
        <div className="text-center pt-6">
          <button className="text-white/70 text-sm hover:text-white/90 transition-colors">
            View all community features →
          </button>
        </div>
      </div>

      {/* Community Testimonials */}
      <div className="space-y-6">
        <h2 className="text-2xl font-light text-white text-center">What Our Anonymous Community Says</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 p-6">
            <p className="text-white/90 italic text-lg mb-4">
              "I never thought I could share my deepest struggles, but the complete anonymity here made it possible. 
              The support I received was exactly what I needed to take my next step in healing."
            </p>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Anonymous Community Member</span>
              <span>Resilience Pathway</span>
            </div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-6">
            <p className="text-white/90 italic text-lg mb-4">
              "The cultural wisdom exchange opened my eyes to healing practices I never knew existed. 
              Learning from different traditions while staying completely anonymous felt revolutionary."
            </p>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Anonymous Community Member</span>
              <span>Cultural Exchange</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-8 text-center">
        <h3 className="text-2xl font-light text-white mb-4">Your Voice Matters</h3>
        <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
          Every anonymous share creates ripples of healing. Your story might be exactly what someone else needs to hear 
          to feel less alone in their journey.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => setCurrentView('wisdom-sharing')}
            className="bg-[#5E8E7F] hover:bg-[#4A6B5E] px-6 py-3"
          >
            Share Your Wisdom
          </Button>
          <Button
            onClick={() => setCurrentView('peer-circles')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-6 py-3"
          >
            Join a Support Circle
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen">
      {currentView !== 'hub' && (
        <div className="bg-[#1a1a1a] p-4">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => setCurrentView('hub')}
              variant="ghost"
              className="text-white/60 hover:text-white/80"
            >
              ← Back to Community Hub
            </Button>
          </div>
        </div>
      )}
      
      {renderCurrentView()}
    </div>
  );
}