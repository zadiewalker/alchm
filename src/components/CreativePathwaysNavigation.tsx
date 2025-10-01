'use client';

import React, { useState, useMemo } from 'react';

interface NavigationPathway {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  borderColor: string;
  comingSoon?: boolean;
}

interface CreativePathwaysNavigationProps {
  activePathway: string;
  onNavigate: (pathway: string) => void;
  sessionCount: number;
  insightCount: number;
  communityConnections: number;
  className?: string;
}

const NAVIGATION_PATHWAYS: NavigationPathway[] = [
  {
    id: 'hub',
    name: 'Creative Hub',
    icon: '🎨',
    description: 'Multi-modal expression sanctuary',
    color: 'sage',
    gradient: 'from-sage-100 to-green-100',
    borderColor: 'border-sage-400'
  },
  {
    id: 'voice',
    name: 'Voice & Sound',
    icon: '🎙️',
    description: 'Healing through vocal expression',
    color: 'blue',
    gradient: 'from-blue-100 to-sky-100',
    borderColor: 'border-blue-400'
  },
  {
    id: 'art',
    name: 'Visual Arts',
    icon: '🖼️',
    description: 'Digital art therapy canvases',
    color: 'purple',
    gradient: 'from-purple-100 to-violet-100',
    borderColor: 'border-purple-400'
  },
  {
    id: 'movement',
    name: 'Movement & Dance',
    icon: '💃',
    description: 'Somatic healing through motion',
    color: 'pink',
    gradient: 'from-pink-100 to-rose-100',
    borderColor: 'border-pink-400'
  },
  {
    id: 'poetry',
    name: 'Poetry & Writing',
    icon: '✨',
    description: 'Transformative word crafting',
    color: 'indigo',
    gradient: 'from-indigo-100 to-blue-100',
    borderColor: 'border-indigo-400'
  },
  {
    id: 'music',
    name: 'Music Therapy',
    icon: '🎵',
    description: 'Frequency healing and sound',
    color: 'orange',
    gradient: 'from-orange-100 to-red-100',
    borderColor: 'border-orange-400'
  },
  {
    id: 'community',
    name: 'Creative Community',
    icon: '🤝',
    description: 'Share and witness creativity',
    color: 'emerald',
    gradient: 'from-emerald-100 to-green-100',
    borderColor: 'border-emerald-400'
  },
  {
    id: 'cultural',
    name: 'Cultural Arts',
    icon: '🌍',
    description: 'Traditional healing modalities',
    color: 'amber',
    gradient: 'from-amber-100 to-yellow-100',
    borderColor: 'border-amber-400'
  },
  {
    id: 'multisensory',
    name: 'Multi-Sensory',
    icon: '🌈',
    description: 'Synesthetic expression paths',
    color: 'teal',
    gradient: 'from-teal-100 to-cyan-100',
    borderColor: 'border-teal-400'
  },
  {
    id: 'analytics',
    name: 'Creative Insights',
    icon: '📊',
    description: 'Patterns and growth tracking',
    color: 'slate',
    gradient: 'from-slate-100 to-gray-100',
    borderColor: 'border-slate-400'
  }
];

const CreativePathwaysNavigation: React.FC<CreativePathwaysNavigationProps> = ({
  activePathway,
  onNavigate,
  sessionCount,
  insightCount,
  communityConnections,
  className = ''
}) => {
  const [hoveredPathway, setHoveredPathway] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Enhanced pathway info with stats
  const enhancedPathways = useMemo(() => {
    return NAVIGATION_PATHWAYS.map(pathway => {
      let badge = '';
      let badgeColor = '';
      
      switch (pathway.id) {
        case 'hub':
          if (sessionCount > 0) {
            badge = `${sessionCount} sessions`;
            badgeColor = 'bg-sage-500 text-white';
          }
          break;
        case 'analytics':
          if (insightCount > 0) {
            badge = `${insightCount} insights`;
            badgeColor = 'bg-blue-500 text-white';
          }
          break;
        case 'community':
          if (communityConnections > 0) {
            badge = `${communityConnections} connections`;
            badgeColor = 'bg-purple-500 text-white';
          }
          break;
      }
      
      return {
        ...pathway,
        badge,
        badgeColor
      };
    });
  }, [sessionCount, insightCount, communityConnections]);

  return (
    <div className={`creative-pathways-navigation ${className}`}>
      {/* Navigation Header */}
      <div className="navigation-header flex items-center justify-between mb-6 px-6">
        <h2 className="text-2xl font-light text-gray-800">
          Creative Pathways
        </h2>
        
        <div className="navigation-controls flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="view-toggle bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                viewMode === 'grid' 
                  ? 'bg-sage-100 text-sage-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                viewMode === 'list' 
                  ? 'bg-sage-100 text-sage-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List
            </button>
          </div>
          
          {/* Session Stats */}
          {sessionCount > 0 && (
            <div className="session-stats bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-sage-200">
              <span className="text-sm text-sage-700">
                {sessionCount} creative sessions completed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Grid/List */}
      <div className={`navigation-pathways px-6 ${
        viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4' 
          : 'space-y-3'
      }`}>
        {enhancedPathways.map((pathway) => (
          <button
            key={pathway.id}
            onClick={() => onNavigate(pathway.id)}
            onMouseEnter={() => setHoveredPathway(pathway.id)}
            onMouseLeave={() => setHoveredPathway(null)}
            disabled={pathway.comingSoon}
            className={`
              pathway-card group relative transition-all duration-200 
              ${viewMode === 'grid' 
                ? 'p-6 rounded-2xl border-2 hover:scale-105 hover:shadow-lg' 
                : 'p-4 rounded-xl border flex items-center gap-4 hover:shadow-md'
              }
              ${activePathway === pathway.id
                ? `bg-gradient-to-br ${pathway.gradient} ${pathway.borderColor} shadow-md scale-105`
                : `bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gradient-to-br hover:${pathway.gradient} hover:${pathway.borderColor}`
              }
              ${pathway.comingSoon 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            {/* Coming Soon Badge */}
            {pathway.comingSoon && (
              <div className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs px-2 py-1 rounded-full">
                Soon
              </div>
            )}

            {/* Activity Badge */}
            {pathway.badge && (
              <div className={`absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full ${pathway.badgeColor}`}>
                {pathway.badge}
              </div>
            )}

            {viewMode === 'grid' ? (
              // Grid Layout
              <div className="text-center">
                <div className="pathway-icon text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {pathway.icon}
                </div>
                <h3 className="pathway-name text-lg font-semibold text-gray-800 mb-2">
                  {pathway.name}
                </h3>
                <p className="pathway-description text-sm text-gray-600 leading-tight">
                  {pathway.description}
                </p>
              </div>
            ) : (
              // List Layout
              <>
                <div className="pathway-icon text-3xl">
                  {pathway.icon}
                </div>
                <div className="pathway-info flex-1">
                  <h3 className="pathway-name text-lg font-semibold text-gray-800">
                    {pathway.name}
                  </h3>
                  <p className="pathway-description text-sm text-gray-600">
                    {pathway.description}
                  </p>
                </div>
                {activePathway === pathway.id && (
                  <div className="active-indicator w-3 h-3 bg-sage-400 rounded-full"></div>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Pathway Description Tooltip */}
      {hoveredPathway && viewMode === 'grid' && (
        <div className="pathway-tooltip fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 max-w-sm">
          {(() => {
            const pathway = enhancedPathways.find(p => p.id === hoveredPathway);
            if (!pathway) return null;
            
            return (
              <div className="text-center">
                <div className="text-2xl mb-2">{pathway.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-1">{pathway.name}</h4>
                <p className="text-sm text-gray-600">{pathway.description}</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Quick Stats Bar */}
      {(sessionCount > 0 || insightCount > 0 || communityConnections > 0) && (
        <div className="quick-stats mt-8 px-6">
          <div className="stats-bar bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-sage-200">
            <div className="flex justify-center gap-8">
              {sessionCount > 0 && (
                <div className="stat text-center">
                  <div className="stat-value text-2xl font-light text-sage-700">{sessionCount}</div>
                  <div className="stat-label text-xs text-gray-600">Creative Sessions</div>
                </div>
              )}
              {insightCount > 0 && (
                <div className="stat text-center">
                  <div className="stat-value text-2xl font-light text-blue-700">{insightCount}</div>
                  <div className="stat-label text-xs text-gray-600">Cross-Modal Insights</div>
                </div>
              )}
              {communityConnections > 0 && (
                <div className="stat text-center">
                  <div className="stat-value text-2xl font-light text-purple-700">{communityConnections}</div>
                  <div className="stat-label text-xs text-gray-600">Community Connections</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Getting Started Hint */}
      {sessionCount === 0 && (
        <div className="getting-started-hint mt-8 px-6">
          <div className="hint-card bg-gradient-to-r from-sage-50 to-green-50 rounded-2xl p-6 border border-sage-200">
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Welcome to Your Creative Sanctuary
              </h3>
              <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
                Begin your healing journey through creative expression. Each pathway offers unique ways to 
                process emotions, discover insights, and connect with your authentic self.
              </p>
              <button
                onClick={() => onNavigate('hub')}
                className="px-6 py-3 bg-sage-400 text-white rounded-full font-medium hover:bg-sage-500 transition-colors"
              >
                Start in the Creative Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativePathwaysNavigation;