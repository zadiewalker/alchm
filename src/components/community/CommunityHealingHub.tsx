'use client';

import React, { useState, useEffect } from 'react';
import { communityHealingEngine, SharingCircle, CollectiveWisdom, PeerMatch } from '@/lib/community-healing-engine';

interface CommunityHealingHubProps {
  userId: string;
  userThemes?: string[];
  culturalContext?: string[];
  className?: string;
}

export function CommunityHealingHub({ 
  userId, 
  userThemes = [], 
  culturalContext = [],
  className = ''
}: CommunityHealingHubProps) {
  const [activeTab, setActiveTab] = useState<'circles' | 'wisdom' | 'matches'>('circles');
  const [sharingCircles, setSharingCircles] = useState<SharingCircle[]>([]);
  const [collectiveWisdom, setCollectiveWisdom] = useState<CollectiveWisdom[]>([]);
  const [peerMatches, setPeerMatches] = useState<PeerMatch[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Load relevant sharing circles
    const relevantCircles = communityHealingEngine.getRelevantSharingCircles(userThemes);
    setSharingCircles(relevantCircles);

    // Load relevant wisdom
    const relevantWisdom = communityHealingEngine.getRelevantWisdom(userThemes, culturalContext);
    setCollectiveWisdom(relevantWisdom);

    // Find peer matches
    const matches = communityHealingEngine.findPeerMatches(userId, userThemes, culturalContext);
    setPeerMatches(matches);

    // Load dashboard data
    const dashboard = communityHealingEngine.getCommunityDashboard();
    setDashboardData(dashboard);
  }, [userId, userThemes, culturalContext]);

  return (
    <div className={`community-healing-hub ${className}`}>
      {/* Header */}
      <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-lg mb-phi-lg backdrop-blur-xl">
        <div className="flex items-center justify-between mb-phi-md">
          <h2 className="text-phi-lg font-light text-sage-700 tracking-wide">
            🌍 Community Healing Sanctuary
          </h2>
          {dashboardData && (
            <div className="flex items-center gap-phi-md text-phi-xs text-sage-600/80">
              <span>{dashboardData.totalShares} shares</span>
              <span>•</span>
              <span>{dashboardData.activeCircles} circles</span>
              <span>•</span>
              <span>{dashboardData.wisdomLibrarySize} wisdom entries</span>
            </div>
          )}
        </div>
        
        <p className="text-sage-600/80 text-phi-sm font-light leading-relaxed">
          Connect anonymously with others on healing journeys. Share wisdom, find support, and contribute to collective healing - all while maintaining complete privacy.
        </p>
        
        {/* Privacy Notice */}
        <div className="mt-phi-md p-phi-sm sanctuary-glass border border-sage-300/30 rounded-xl">
          <div className="flex items-center gap-phi-xs text-sage-600/70 text-phi-xs">
            <span>🛡️</span>
            <span>Your identity is fully protected. All sharing is anonymous and encrypted.</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-phi-xs mb-phi-lg">
        {[
          { id: 'circles', label: '🔄 Sharing Circles', count: sharingCircles.length },
          { id: 'wisdom', label: '💎 Collective Wisdom', count: collectiveWisdom.length },
          { id: 'matches', label: '🤝 Peer Matches', count: peerMatches.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-phi-md py-phi-sm rounded-2xl text-phi-sm font-light transition-all duration-300
              flex items-center gap-phi-xs
              ${activeTab === tab.id
                ? 'bg-sage-400 text-sanctuary shadow-soft'
                : 'sanctuary-glass border border-sanctuary/30 text-sage-600 hover:shadow-soft hover:scale-105'
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="text-phi-xs opacity-70">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-phi-lg">
        {activeTab === 'circles' && (
          <SharingCirclesView circles={sharingCircles} userId={userId} />
        )}
        
        {activeTab === 'wisdom' && (
          <CollectiveWisdomView wisdom={collectiveWisdom} />
        )}
        
        {activeTab === 'matches' && (
          <PeerMatchesView matches={peerMatches} userId={userId} />
        )}
      </div>
    </div>
  );
}

function SharingCirclesView({ circles, userId }: { circles: SharingCircle[]; userId: string }) {
  const [selectedCircle, setSelectedCircle] = useState<SharingCircle | null>(null);

  return (
    <div className="space-y-phi-md">
      <div className="grid gap-phi-md">
        {circles.map(circle => (
          <div
            key={circle.id}
            className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-lg hover:shadow-soft transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedCircle(circle)}
          >
            <div className="flex justify-between items-start mb-phi-md">
              <div>
                <h3 className="text-phi-base font-medium text-sage-700">{circle.theme}</h3>
                <p className="text-sage-600/80 text-phi-sm mt-phi-xs">{circle.description}</p>
              </div>
              <div className="text-right">
                <div className="text-phi-xs text-sage-600/60">{circle.participants} participants</div>
                <div className="text-phi-xs text-sage-600/60 mt-phi-xs">
                  {circle.anonymousShares.length} shares
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-phi-xs">
              {circle.healingFocus.map(focus => (
                <span
                  key={focus}
                  className="px-phi-sm py-phi-xs rounded-xl bg-sage-200/50 text-sage-700 text-phi-xs"
                >
                  {focus}
                </span>
              ))}
              <span className="px-phi-sm py-phi-xs rounded-xl bg-sanctuary/10 text-sanctuary text-phi-xs">
                {circle.circleType}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedCircle && (
        <SharingCircleModal
          circle={selectedCircle}
          onClose={() => setSelectedCircle(null)}
          userId={userId}
        />
      )}
    </div>
  );
}

function SharingCircleModal({ 
  circle, 
  onClose, 
  userId 
}: { 
  circle: SharingCircle; 
  onClose: () => void; 
  userId: string;
}) {
  const [newShare, setNewShare] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!newShare.trim()) return;
    
    setIsSharing(true);
    try {
      // Create anonymous share
      const share = communityHealingEngine.createAnonymousShare(
        newShare,
        userId,
        circle.healingFocus
      );
      
      // Add to circle
      communityHealingEngine.addShareToCircle(share.id, circle.id);
      
      setNewShare('');
      // In a real app, would refresh the circle data
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 sanctuary-backdrop backdrop-blur-xl flex items-center justify-center p-phi-lg animate-fade-in">
      <div className="organic-container sanctuary-glass border border-sanctuary/30 shadow-floating p-phi-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
        <div className="flex justify-between items-center mb-phi-lg">
          <h3 className="text-phi-lg font-light text-sage-700 tracking-wide">{circle.theme}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl sanctuary-glass border border-sanctuary/30 text-sage-600 hover:text-sage-700 hover:shadow-soft flex items-center justify-center transition-all duration-400 hover:scale-110 active:scale-95"
          >
            <span className="text-phi-sm">✕</span>
          </button>
        </div>

        {/* Recent Shares */}
        <div className="space-y-phi-md mb-phi-lg">
          {circle.anonymousShares.slice(0, 3).map(share => (
            <div
              key={share.id}
              className="sanctuary-glass border border-sanctuary/20 rounded-xl p-phi-md"
            >
              <div className="text-sage-700 text-phi-sm mb-phi-sm leading-relaxed">
                {share.content}
              </div>
              <div className="flex justify-between items-center text-phi-xs text-sage-600/60">
                <div className="flex items-center gap-phi-sm">
                  <span>{share.anonymizedMetadata.journeyStage} • {share.anonymizedMetadata.ageRange}</span>
                  <div className="flex gap-phi-xs">
                    {share.healingTags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-phi-xs py-phi-xs rounded bg-sage-200/30 text-sage-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-phi-sm">
                  <span>💙 {share.supportCount}</span>
                  <span>✨ {Math.round(share.resonanceLevel * 10)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share Form */}
        <div className="border-t border-sanctuary/20 pt-phi-lg">
          <h4 className="text-phi-base font-medium text-sage-700 mb-phi-md">Share Anonymously</h4>
          <textarea
            value={newShare}
            onChange={(e) => setNewShare(e.target.value)}
            placeholder="Share your experience, wisdom, or seek support... Your identity is completely protected."
            className="w-full h-32 p-phi-md sanctuary-glass border border-sanctuary/20 rounded-xl text-sage-700 placeholder:text-sage-500/60 placeholder:italic resize-none focus:outline-none focus:border-sage-400"
            style={{ fontFamily: 'var(--font-system)' }}
          />
          <div className="flex justify-between items-center mt-phi-md">
            <div className="text-phi-xs text-sage-600/60">
              Anonymous • Safe • Supportive
            </div>
            <button
              onClick={handleShare}
              disabled={!newShare.trim() || isSharing}
              className={`
                px-phi-lg py-phi-sm rounded-2xl font-light text-phi-sm transition-all duration-400 tracking-wide
                ${newShare.trim() && !isSharing
                  ? 'bg-sage-400 text-sanctuary hover:bg-sage-500 shadow-soft hover:shadow-floating hover:scale-105 active:scale-95'
                  : 'sanctuary-glass border border-sanctuary/30 text-sage-500 cursor-not-allowed'
                }
              `}
            >
              {isSharing ? 'Sharing...' : 'Share Anonymously'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectiveWisdomView({ wisdom }: { wisdom: CollectiveWisdom[] }) {
  return (
    <div className="grid gap-phi-md">
      {wisdom.map(item => (
        <div
          key={item.id}
          className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-lg hover:shadow-soft transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-phi-md">
            <div>
              <h3 className="text-phi-base font-medium text-sage-700">{item.title}</h3>
              <div className="flex items-center gap-phi-sm mt-phi-xs">
                <span className="px-phi-sm py-phi-xs rounded-xl bg-sage-200/50 text-sage-700 text-phi-xs">
                  {item.wisdomType.replace('-', ' ')}
                </span>
                <span className="px-phi-sm py-phi-xs rounded-xl bg-sanctuary/10 text-sanctuary text-phi-xs">
                  {item.source.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-phi-xs text-sage-600/60">
                ✨ {Math.round(item.resonanceScore * 100)}% resonance
              </div>
              <div className="text-phi-xs text-sage-600/60 mt-phi-xs">
                {item.anonymizedContributions} contributors
              </div>
            </div>
          </div>
          
          <p className="text-sage-600 text-phi-sm leading-relaxed mb-phi-md">
            {item.content}
          </p>
          
          <div className="flex flex-wrap gap-phi-xs">
            {item.culturalContexts.map(context => (
              <span
                key={context}
                className="px-phi-sm py-phi-xs rounded-xl bg-sanctuary/20 text-sanctuary text-phi-xs"
              >
                {context}
              </span>
            ))}
            {item.applicableThemes.slice(0, 3).map(theme => (
              <span
                key={theme}
                className="px-phi-sm py-phi-xs rounded-xl bg-sage-200/30 text-sage-700 text-phi-xs"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PeerMatchesView({ matches, userId }: { matches: PeerMatch[]; userId: string }) {
  return (
    <div className="space-y-phi-md">
      {matches.length === 0 ? (
        <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-xl text-center">
          <div className="text-phi-2xl mb-phi-md">🌱</div>
          <h3 className="text-phi-base font-medium text-sage-700 mb-phi-sm">
            Building Your Peer Network
          </h3>
          <p className="text-sage-600/80 text-phi-sm leading-relaxed">
            As you continue journaling and engaging with the community, we'll find peers who share similar experiences or complementary strengths for mutual support.
          </p>
        </div>
      ) : (
        <div className="grid gap-phi-md">
          {matches.map(match => (
            <div
              key={match.matchId}
              className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-lg hover:shadow-soft transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-phi-md">
                <div>
                  <h3 className="text-phi-base font-medium text-sage-700">
                    {match.connectionType.replace('-', ' ')} • {Math.round(match.similarity * 100)}% alignment
                  </h3>
                  <div className="text-phi-sm text-sage-600/80 mt-phi-xs">
                    {match.healingStage} in their journey
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-phi-xs text-sage-600/60">
                    {match.culturalAlignment > 0.5 ? '🌍 Cultural alignment' : '🤝 Different perspectives'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-phi-sm mb-phi-md">
                {match.sharedThemes.length > 0 && (
                  <div>
                    <div className="text-phi-xs text-sage-600/70 mb-phi-xs">Shared experiences:</div>
                    <div className="flex flex-wrap gap-phi-xs">
                      {match.sharedThemes.map(theme => (
                        <span
                          key={theme}
                          className="px-phi-sm py-phi-xs rounded-xl bg-sage-200/50 text-sage-700 text-phi-xs"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {match.complementaryStrengths.length > 0 && (
                  <div>
                    <div className="text-phi-xs text-sage-600/70 mb-phi-xs">Complementary strengths:</div>
                    <div className="flex flex-wrap gap-phi-xs">
                      {match.complementaryStrengths.map(strength => (
                        <span
                          key={strength}
                          className="px-phi-sm py-phi-xs rounded-xl bg-sanctuary/20 text-sanctuary text-phi-xs"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-phi-xs text-sage-600/60">
                  Support style: {match.supportStyle} • Privacy: {match.privacyLevel}
                </div>
                <button className="px-phi-md py-phi-xs rounded-xl sanctuary-glass border border-sanctuary/30 text-sage-600 hover:shadow-soft text-phi-xs transition-all duration-300">
                  Connect Anonymously
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}