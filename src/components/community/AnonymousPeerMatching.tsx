'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Clock, Star, MessageCircle, Eye } from 'lucide-react';

interface CommunityMember {
  id: string;
  anonymousName: string;
  healingJourney: string;
  preferredSupport: string[];
  availabilityWindow: string;
  lastActive: Date;
  trustScore: number;
  sharedWisdomCount: number;
}

interface Props {
  members: CommunityMember[];
  userPreferences: {
    anonymousMode: boolean;
    preferredSupport: string[];
    availabilityWindow: string;
  };
}

export const AnonymousPeerMatching: React.FC<Props> = ({ members, userPreferences }) => {
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [matchingEnabled, setMatchingEnabled] = useState(true);

  const calculateMatchScore = (member: CommunityMember) => {
    let score = 0;
    
    // Availability matching
    if (member.availabilityWindow === userPreferences.availabilityWindow) {
      score += 30;
    }
    
    // Support type matching
    const commonSupport = member.preferredSupport.filter(type => 
      userPreferences.preferredSupport.includes(type)
    );
    score += commonSupport.length * 20;
    
    // Trust score bonus
    score += member.trustScore * 0.3;
    
    // Activity bonus
    const hoursActive = (Date.now() - member.lastActive.getTime()) / (1000 * 60 * 60);
    if (hoursActive < 24) score += 10;
    else if (hoursActive < 72) score += 5;
    
    return Math.min(100, Math.round(score));
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-slate-600 bg-slate-100';
  };

  const getLastActiveText = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Active now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const sortedMembers = [...members]
    .map(member => ({ ...member, matchScore: calculateMatchScore(member) }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium text-slate-800 tracking-wide">
            Anonymous Peer Matching
          </h3>
          <p className="text-slate-600 text-sm mt-1 tracking-wide">
            Connect with others on similar healing journeys
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMatchingEnabled(!matchingEnabled)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
              ${matchingEnabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-slate-100 text-slate-600'
              }
            `}
          >
            <Shield size={16} />
            <span>{matchingEnabled ? 'Matching Enabled' : 'Matching Disabled'}</span>
          </button>
        </div>
      </div>

      {matchingEnabled ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member List */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-800 tracking-wide">
              Potential Matches ({sortedMembers.length})
            </h4>
            
            {sortedMembers.map(member => (
              <Card 
                key={member.id} 
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selectedMember?.id === member.id 
                    ? 'ring-2 ring-sage-400 shadow-md border-sage-300' 
                    : 'border-slate-200 hover:shadow-sm hover:border-sage-200'
                }`}
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-sage-800">
                        {member.anonymousName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-800 tracking-wide">
                        {member.anonymousName}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {getLastActiveText(member.lastActive)}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium tracking-wide
                    ${getMatchColor(member.matchScore)}
                  `}>
                    {member.matchScore}% match
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-3 tracking-wide">
                  {member.healingJourney}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Star size={12} />
                      <span>Trust: {member.trustScore}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={12} />
                      <span>{member.sharedWisdomCount} wisdom shared</span>
                    </div>
                  </div>
                  
                  <span className="text-slate-400 capitalize">
                    {member.availabilityWindow}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {member.preferredSupport.slice(0, 3).map(support => (
                    <span 
                      key={support}
                      className="px-2 py-1 bg-sage-50 text-sage-700 rounded text-xs"
                    >
                      {support}
                    </span>
                  ))}
                  {member.preferredSupport.length > 3 && (
                    <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-xs">
                      +{member.preferredSupport.length - 3} more
                    </span>
                  )}
                </div>
              </Card>
            ))}

            {sortedMembers.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg tracking-wide">No matches found</p>
                <p className="text-sm mt-2">Try adjusting your preferences</p>
              </div>
            )}
          </div>

          {/* Member Details */}
          {selectedMember && (
            <Card className="p-6 border-sage-200 bg-sage-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-sage-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-sage-800">
                      {selectedMember.anonymousName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-800 tracking-wide">
                      {selectedMember.anonymousName}
                    </h4>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium tracking-wide
                      ${getMatchColor(selectedMember.matchScore)}
                    `}>
                      {selectedMember.matchScore}% compatibility
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Healing Journey
                  </label>
                  <p className="text-slate-800 bg-white p-3 rounded-lg text-sm tracking-wide">
                    {selectedMember.healingJourney}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Trust Score
                    </label>
                    <div className="flex items-center space-x-2">
                      <Star className="text-yellow-500" size={16} />
                      <span className="text-slate-800 font-medium">
                        {selectedMember.trustScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Availability
                    </label>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-blue-500" size={16} />
                      <span className="text-slate-800 capitalize">
                        {selectedMember.availabilityWindow}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Preferred Support Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.preferredSupport.map(support => (
                      <span 
                        key={support}
                        className={`
                          px-3 py-1 rounded-full text-xs font-medium tracking-wide
                          ${userPreferences.preferredSupport.includes(support)
                            ? 'bg-sage-100 text-sage-800'
                            : 'bg-slate-100 text-slate-600'
                          }
                        `}
                      >
                        {support}
                        {userPreferences.preferredSupport.includes(support) && ' ✓'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connection Actions */}
                <div className="flex space-x-2 pt-4 border-t border-slate-200">
                  <Button className="bg-sage-600 hover:bg-sage-700 text-white flex-1">
                    <Heart size={16} className="mr-2" />
                    Send Connection Request
                  </Button>
                  <Button variant="outline">
                    <Eye size={16} className="mr-2" />
                    View Profile
                  </Button>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Shield className="text-blue-600 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Anonymous Connection
                      </p>
                      <p className="text-xs text-blue-700">
                        All connections remain anonymous until both parties consent to share more information.
                        You can disconnect at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-8 border-slate-200">
          <div className="text-center text-slate-500">
            <Shield size={48} className="mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium text-slate-700 mb-2">
              Peer Matching Disabled
            </h4>
            <p className="text-sm tracking-wide mb-4">
              You can enable peer matching to connect with others on similar healing journeys
            </p>
            <Button 
              onClick={() => setMatchingEnabled(true)}
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              Enable Matching
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnonymousPeerMatching;