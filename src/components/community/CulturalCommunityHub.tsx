/*
 * ALCHM Cultural Community Hub
 * Terracotta-warmed community features that honor diverse relationship styles
 * Respects chosen family, blood family, spiritual family, and cultural kinship patterns
 */

import React, { useState } from 'react';
import { CulturalText, CulturalHeading } from '../cultural/CulturalTypography';
import { CulturalIcons } from '../cultural/CulturalIconSystem';

interface CommunityMemberProps {
  id: string;
  name: string;
  avatar?: string;
  relationshipType: 'chosen-family' | 'blood-family' | 'spiritual-family' | 'community' | 'mentor' | 'apprentice';
  culturalBackground?: string;
  pronouns?: string;
  connectionStrength: 'acquaintance' | 'friend' | 'close' | 'family' | 'soul';
  sharedJourneys?: string[];
  mutualSupport?: boolean;
  lastConnection?: Date;
}

interface CommunityHubProps {
  currentUser: {
    id: string;
    name: string;
    culturalContext: 'individualist' | 'collectivist' | 'mixed';
    preferredRelationshipStyle: 'nuclear' | 'extended' | 'chosen' | 'multi-layered';
    lang: string;
  };
  members: CommunityMemberProps[];
  onConnect?: (memberId: string) => void;
  onSupport?: (memberId: string, type: 'emotional' | 'practical' | 'spiritual') => void;
  className?: string;
}

const relationshipColors = {
  'chosen-family': 'bg-terracotta-200 border-terracotta-400 text-terracotta-800',
  'blood-family': 'bg-sage-200 border-sage-400 text-sage-800',
  'spiritual-family': 'bg-blush-200 border-blush-400 text-blush-800',
  'community': 'bg-gold-sun bg-opacity-20 border-gold-sun text-gray-800',
  'mentor': 'bg-copper-glow bg-opacity-20 border-copper-glow text-gray-800',
  'apprentice': 'bg-water-flow border-water-depth text-gray-800',
};

const relationshipIcons = {
  'chosen-family': CulturalIcons.ChosenFamily,
  'blood-family': CulturalIcons.Community,
  'spiritual-family': CulturalIcons.SpiritualFamily,
  'community': CulturalIcons.Community,
  'mentor': CulturalIcons.Wisdom,
  'apprentice': CulturalIcons.Growth,
};

const connectionStrengthIndicators = {
  acquaintance: { dots: 1, color: 'bg-gray-300' },
  friend: { dots: 2, color: 'bg-sage-400' },
  close: { dots: 3, color: 'bg-terracotta-400' },
  family: { dots: 4, color: 'bg-blush-400' },
  soul: { dots: 5, color: 'bg-gold-sun' },
};

export const CulturalCommunityHub: React.FC<CommunityHubProps> = ({
  currentUser,
  members,
  onConnect,
  onSupport,
  className = '',
}) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'constellation' | 'tree'>('grid');

  // Group members by relationship type for cultural visualization
  const groupedMembers = members.reduce((groups, member) => {
    const type = member.relationshipType;
    if (!groups[type]) groups[type] = [];
    groups[type].push(member);
    return groups;
  }, {} as Record<string, CommunityMemberProps[]>);

  const renderMemberCard = (member: CommunityMemberProps) => {
    const IconComponent = relationshipIcons[member.relationshipType];
    const connectionData = connectionStrengthIndicators[member.connectionStrength];
    const isSelected = selectedMember === member.id;

    return (
      <div
        key={member.id}
        className={`
          community-member-card p-4 rounded-lg border-2 transition-all duration-300
          hover:scale-105 cursor-pointer
          ${relationshipColors[member.relationshipType]}
          ${isSelected ? 'ring-2 ring-sage-400 scale-105' : ''}
        `}
        onClick={() => setSelectedMember(isSelected ? null : member.id)}
      >
        <div className="flex items-start gap-3">
          {/* Avatar or Initial */}
          <div className="flex-shrink-0">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={`${member.name}'s avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-terracotta-400 flex items-center justify-center text-white font-medium">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            {/* Name and Pronouns */}
            <div className="flex items-center gap-2 mb-1">
              <CulturalText
                lang={currentUser.lang}
                variant="heading"
                size="sm"
                weight="medium"
                className="truncate"
              >
                {member.name}
              </CulturalText>
              {member.pronouns && (
                <span className="text-xs opacity-70 flex-shrink-0">
                  ({member.pronouns})
                </span>
              )}
            </div>

            {/* Cultural Background */}
            {member.culturalBackground && (
              <CulturalText
                lang={currentUser.lang}
                variant="caption"
                className="text-xs opacity-80 mb-2"
              >
                {member.culturalBackground}
              </CulturalText>
            )}

            {/* Relationship Type and Connection Strength */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComponent size="sm" className="opacity-80" />
                <span className="text-xs font-medium capitalize">
                  {member.relationshipType.replace('-', ' ')}
                </span>
              </div>

              {/* Connection Strength Dots */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < connectionData.dots ? connectionData.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isSelected && (
          <div className="mt-4 pt-4 border-t border-current border-opacity-20 animate-fade-in">
            {/* Shared Journeys */}
            {member.sharedJourneys && member.sharedJourneys.length > 0 && (
              <div className="mb-3">
                <CulturalText
                  lang={currentUser.lang}
                  variant="caption"
                  size="sm"
                  weight="medium"
                  className="block mb-2"
                >
                  Shared Journeys
                </CulturalText>
                <div className="flex flex-wrap gap-1">
                  {member.sharedJourneys.map((journey, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs"
                    >
                      {journey}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Actions */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnect?.(member.id);
                }}
                className="
                  flex items-center gap-2 px-3 py-2 rounded-lg
                  bg-white bg-opacity-50 hover:bg-opacity-70
                  text-xs font-medium transition-all
                "
              >
                <CulturalIcons.Growth size="sm" />
                Connect
              </button>
              
              {member.mutualSupport && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSupport?.(member.id, 'emotional');
                  }}
                  className="
                    flex items-center gap-2 px-3 py-2 rounded-lg
                    bg-white bg-opacity-50 hover:bg-opacity-70
                    text-xs font-medium transition-all
                  "
                >
                  <CulturalIcons.SelfCompassion size="sm" />
                  Support
                </button>
              )}
            </div>

            {/* Last Connection */}
            {member.lastConnection && (
              <div className="mt-2 text-xs opacity-60">
                Last connected {member.lastConnection.toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderConstellationView = () => {
    // Visual constellation showing relationship proximity and strength
    return (
      <div className="constellation-view relative h-96 bg-gradient-to-br from-sage-50 to-terracotta-50 rounded-xl p-8">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Central user */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-400 to-terracotta-400 flex items-center justify-center text-white font-medium text-lg shadow-lg">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            {/* Connection lines and member nodes */}
            {members.slice(0, 8).map((member, index) => {
              const angle = (index * 45) * (Math.PI / 180);
              const distance = 120 + (connectionStrengthIndicators[member.connectionStrength].dots * 10);
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              
              return (
                <div key={member.id}>
                  {/* Connection line */}
                  <div
                    className={`absolute w-0.5 origin-center ${connectionStrengthIndicators[member.connectionStrength].color}`}
                    style={{
                      left: '50%',
                      top: '50%',
                      height: `${distance}px`,
                      transform: `rotate(${index * 45}deg) translateY(-50%)`,
                      transformOrigin: 'center top',
                    }}
                  />
                  
                  {/* Member node */}
                  <div
                    className={`absolute w-10 h-10 rounded-full ${relationshipColors[member.relationshipType]} flex items-center justify-center text-xs font-medium shadow-md cursor-pointer hover:scale-110 transition-transform`}
                    style={{
                      left: `calc(50% + ${x}px - 20px)`,
                      top: `calc(50% + ${y}px - 20px)`,
                    }}
                    onClick={() => setSelectedMember(member.id)}
                    title={member.name}
                  >
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderTreeView = () => {
    // Hierarchical tree view showing relationship types
    return (
      <div className="tree-view space-y-6">
        {Object.entries(groupedMembers).map(([type, typeMembers]) => (
          <div key={type} className="relationship-group">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${relationshipColors[type as keyof typeof relationshipColors].split(' ')[0]}`} />
              <CulturalHeading
                lang={currentUser.lang}
                level={3}
                size="lg"
                className="capitalize"
              >
                {type.replace('-', ' ')} ({typeMembers.length})
              </CulturalHeading>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
              {typeMembers.map(renderMemberCard)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`cultural-community-hub ${className}`}>
      {/* Header */}
      <div className="community-warmth p-6 mb-6">
        <CulturalHeading
          lang={currentUser.lang}
          level={1}
          size="2xl"
          className="mb-4"
        >
          Your Sacred Circle
        </CulturalHeading>
        
        <CulturalText
          lang={currentUser.lang}
          variant="body"
          className="mb-6 opacity-90"
        >
          Honor the diverse relationships that nurture your healing journey. 
          Each connection is sacred, whether chosen, given, or discovered.
        </CulturalText>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {[
            { mode: 'grid', label: 'Grid', icon: '▦' },
            { mode: 'constellation', label: 'Constellation', icon: '✦' },
            { mode: 'tree', label: 'Tree', icon: '🌳' },
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === mode 
                  ? 'bg-terracotta-heart text-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                }
              `}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Visualization */}
      <div className="community-content">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(renderMemberCard)}
          </div>
        )}
        
        {viewMode === 'constellation' && renderConstellationView()}
        
        {viewMode === 'tree' && renderTreeView()}
      </div>

      {/* Cultural Context Info */}
      <div className="mt-8 p-4 bg-sage-50 rounded-lg">
        <CulturalText
          lang={currentUser.lang}
          variant="caption"
          className="text-sm text-sage-700"
        >
          <strong>Cultural Context:</strong> This community view adapts to your 
          {currentUser.culturalContext === 'collectivist' ? ' collectivist' : 
           currentUser.culturalContext === 'individualist' ? ' individualist' : ' mixed'} 
          cultural context, honoring your preferred relationship patterns and connection styles.
        </CulturalText>
      </div>

      {/* Relationship Legend */}
      <div className="mt-6 p-4 bg-blush-50 rounded-lg">
        <CulturalHeading
          lang={currentUser.lang}
          level={4}
          size="base"
          className="mb-3"
        >
          Relationship Types
        </CulturalHeading>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(relationshipColors).map(([type, colorClass]) => {
            const IconComponent = relationshipIcons[type as keyof typeof relationshipIcons];
            return (
              <div key={type} className="flex items-center gap-2">
                <IconComponent size="sm" color="sage" />
                <span className="text-sm capitalize">
                  {type.replace('-', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Support Circle Component for crisis/difficult times
interface SupportCircleProps {
  currentUser: {
    name: string;
    lang: string;
    culturalContext: 'individualist' | 'collectivist' | 'mixed';
  };
  availableSupport: CommunityMemberProps[];
  emergencyContacts: CommunityMemberProps[];
  onRequestSupport?: (type: 'emotional' | 'practical' | 'spiritual' | 'crisis') => void;
  className?: string;
}

export const SupportCircle: React.FC<SupportCircleProps> = ({
  currentUser,
  availableSupport,
  emergencyContacts,
  onRequestSupport,
  className = '',
}) => {
  return (
    <div className={`support-circle ${className}`}>
      <div className="community-warmth p-6">
        <CulturalHeading
          lang={currentUser.lang}
          level={2}
          size="xl"
          className="mb-4"
        >
          Your Support Circle
        </CulturalHeading>
        
        <CulturalText
          lang={currentUser.lang}
          variant="body"
          className="mb-6"
        >
          When you need support, these trusted souls are here for you. 
          Each offers different gifts of care and connection.
        </CulturalText>

        {/* Emergency Contacts */}
        <div className="mb-6">
          <CulturalHeading
            lang={currentUser.lang}
            level={3}
            size="lg"
            className="mb-3 text-crisis-text"
          >
            Crisis Support
          </CulturalHeading>
          
          <div className="grid gap-2">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-crisis-text bg-opacity-10 rounded-lg border border-crisis-text border-opacity-30"
              >
                <div className="flex items-center gap-3">
                  <CulturalIcons.Protection size="sm" color="sage" />
                  <div>
                    <CulturalText
                      lang={currentUser.lang}
                      variant="emphasis"
                      size="sm"
                    >
                      {contact.name}
                    </CulturalText>
                    <div className="text-xs opacity-70">
                      {contact.relationshipType.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onRequestSupport?.('crisis')}
                  className="px-4 py-2 bg-crisis-text text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
                >
                  Reach Out
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Support by Type */}
        <div className="grid gap-4">
          {[
            { type: 'emotional', icon: CulturalIcons.SelfCompassion, color: 'blush' },
            { type: 'practical', icon: CulturalIcons.Community, color: 'terracotta' },
            { type: 'spiritual', icon: CulturalIcons.Wisdom, color: 'sage' },
          ].map(({ type, icon: IconComponent, color }) => (
            <div key={type} className="support-type">
              <div className="flex items-center gap-3 mb-3">
                <IconComponent size="md" color={color as any} />
                <CulturalHeading
                  lang={currentUser.lang}
                  level={4}
                  size="base"
                  className="capitalize"
                >
                  {type} Support
                </CulturalHeading>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSupport
                  .filter(member => member.mutualSupport)
                  .slice(0, 4)
                  .map((member) => (
                    <div
                      key={`${type}-${member.id}`}
                      className="flex items-center justify-between p-2 bg-white bg-opacity-50 rounded-lg"
                    >
                      <span className="text-sm">{member.name}</span>
                      <button
                        onClick={() => onRequestSupport?.(type as any)}
                        className="text-xs px-2 py-1 bg-sage-400 text-white rounded hover:bg-sage-500 transition-colors"
                      >
                        Ask
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulturalCommunityHub;