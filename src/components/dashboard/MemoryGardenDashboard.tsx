// ALCHM Memory Garden Dashboard
// Poetic data visualization that transforms analytics into stories of growth
// Non-clinical, warmth-focused emotional metrics interface

import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  SparklesIcon, 
  HeartIcon,
  StarIcon,
  GiftIcon,
  DocumentArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  MemoryGardenEntry,
  Badge,
  EmotionalTerrain,
  GrowthPortfolio,
  PoetryAnalytics,
  GrowthPortfolioGenerator,
  SACRED_BADGES
} from '@/lib/memory-garden-analytics';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';
import KheperaScarabIcon from '@/components/khepera/KheperaScarabIcons';

// ===== INTERFACE TYPES =====

interface MemoryGardenDashboardProps {
  userId: string;
  entries: MemoryGardenEntry[];
  culturalContext?: string;
  userName?: string;
  onExportPortfolio?: (portfolio: GrowthPortfolio) => void;
  className?: string;
}

interface StreakVisualizationProps {
  streakData: {
    currentStreak: number;
    longestStreak: number;
    weeklyPattern: number[];
    streakPhase: 'building' | 'flowing' | 'deepening' | 'mastering';
  };
}

// ===== MAIN COMPONENT =====

export default function MemoryGardenDashboard({
  userId,
  entries,
  culturalContext = 'universal',
  userName = 'Dear One',
  onExportPortfolio,
  className = ''
}: MemoryGardenDashboardProps) {
  
  const { getSacredPrompt, getSacredButton } = useSacredMicrocopy();
  
  // ===== STATE MANAGEMENT =====
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'season'>('month');
  const [emotionalTerrain, setEmotionalTerrain] = useState<EmotionalTerrain | null>(null);
  const [aiThemes, setAiThemes] = useState<string[]>([]);
  const [streakData, setStreakData] = useState<any>(null);
  const [moodTimeline, setMoodTimeline] = useState<any[]>([]);
  const [recentBadges, setRecentBadges] = useState<Badge[]>([]);
  const [showPortfolioGenerator, setShowPortfolioGenerator] = useState(false);

  // ===== DATA PROCESSING =====
  useEffect(() => {
    if (entries.length === 0) return;

    // Calculate emotional terrain
    const terrain = PoetryAnalytics.calculateEmotionalTerrain(entries);
    setEmotionalTerrain(terrain);

    // Generate AI themes
    const themes = PoetryAnalytics.generateAIThemes(entries, selectedTimeframe);
    setAiThemes(themes);

    // Calculate streak data
    const streak = PoetryAnalytics.calculateJournalingStreak(entries);
    setStreakData(streak);

    // Generate mood timeline
    const timeline = PoetryAnalytics.generateMoodTimeline(entries, 30);
    setMoodTimeline(timeline);

    // Get recent badges (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recent = entries
      .filter(entry => entry.date >= sevenDaysAgo)
      .flatMap(entry => entry.badges)
      .slice(0, 6);
    
    setRecentBadges(recent);
  }, [entries, selectedTimeframe]);

  const handleExportPortfolio = () => {
    if (onExportPortfolio) {
      const portfolio = GrowthPortfolioGenerator.createPortfolio(
        entries,
        { name: userName, culturalContext },
        selectedTimeframe === 'week' ? 'month' : 'semester'
      );
      onExportPortfolio(portfolio);
    }
  };

  return (
    <div className={`memory-garden-dashboard ${className}`}>
      <div className="max-w-7xl mx-auto space-y-space-ritual">
        
        {/* Garden Header */}
        <div className="garden-header text-center space-y-space-gentle">
          <div className="flex justify-center mb-space-breath">
            <div className="garden-icon-container">
              <KheperaScarabIcon size={48} mode="present" showAura={true} />
              <SparklesIcon className="w-6 h-6 text-soft-blush floating-sparkle" />
              <HeartIcon className="w-5 h-5 text-warm-terra floating-heart" />
            </div>
          </div>
          
          <h1 className="garden-title text-text-ceremony font-weight-ceremony">
            Your Memory Garden
          </h1>
          
          <p className="garden-subtitle text-text-secondary text-text-presence max-w-2xl mx-auto">
            Here grows the story of your becoming - not data to judge, but poetry to celebrate. 
            Each reflection plants seeds of wisdom in the garden of your growth.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="timeframe-selector bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary font-weight-presence">Growth Perspective</h3>
            <div className="flex gap-space-breath">
              {[
                { key: 'week', label: 'This Week', description: 'Recent growth' },
                { key: 'month', label: 'This Moon', description: 'Lunar cycle wisdom' },
                { key: 'season', label: 'This Season', description: 'Seasonal becoming' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedTimeframe(option.key as any)}
                  className={`timeframe-option ${
                    selectedTimeframe === option.key ? 'selected' : ''
                  }`}
                >
                  <div className="font-weight-presence text-text-breath">{option.label}</div>
                  <div className="text-text-whisper">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Garden Grid */}
        <div className="garden-grid grid grid-cols-1 lg:grid-cols-3 gap-space-gentle">
          
          {/* Left Column: Streak & Badges */}
          <div className="garden-column space-y-space-gentle">
            
            {/* Sacred Streak Line */}
            {streakData && (
              <StreakVisualization streakData={streakData} />
            )}

            {/* Recent Badges */}
            <div className="recent-badges bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
              <div className="flex items-center gap-space-breath mb-space-gentle">
                <StarIcon className="w-5 h-5 text-warm-terra" />
                <h3 className="text-text-primary font-weight-presence">Recent Celebrations</h3>
              </div>
              
              <div className="badges-grid grid grid-cols-2 gap-space-breath">
                {recentBadges.length > 0 ? (
                  recentBadges.map((badge, index) => (
                    <BadgeCard key={`${badge.id}-${index}`} badge={badge} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-space-gentle text-text-secondary">
                    <GiftIcon className="w-8 h-8 mx-auto mb-space-breath opacity-50" />
                    <p className="text-text-breath">
                      Badges bloom as you tend your garden
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Column: Mood Timeline & AI Themes */}
          <div className="garden-column space-y-space-gentle">
            
            {/* Mood Timeline */}
            <div className="mood-timeline bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
              <div className="flex items-center gap-space-breath mb-space-gentle">
                <CalendarIcon className="w-5 h-5 text-soft-blush" />
                <h3 className="text-text-primary font-weight-presence">Emotional Seasons</h3>
              </div>
              
              <div className="timeline-grid grid grid-cols-7 gap-space-whisper">
                {moodTimeline.slice(-7).map((day, index) => (
                  <div key={index} className="timeline-day text-center">
                    <div className="day-emoji text-2xl mb-space-whisper">
                      {day.emoji}
                    </div>
                    <div className="day-date text-text-whisper text-text-whisper">
                      {day.date.getDate()}
                    </div>
                    {day.poeticMoment && (
                      <div className="poetic-moment text-text-whisper text-center mt-space-whisper">
                        {day.poeticMoment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="timeline-full mt-space-gentle pt-space-gentle border-t border-healing-mist">
                <div className="flex flex-wrap gap-space-whisper">
                  {moodTimeline.slice(-30).map((day, index) => (
                    <div 
                      key={index} 
                      className="timeline-dot w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: getMoodColor(day.tone),
                        opacity: day.tone === 'resting' ? 0.3 : 0.8
                      }}
                      title={`${day.date.toLocaleDateString()}: ${day.tone}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* AI Themes */}
            <div className="ai-themes bg-soft-blush-whisper border border-soft-blush-mist rounded-lg p-space-gentle">
              <div className="flex items-center gap-space-breath mb-space-gentle">
                <SparklesIcon className="w-5 h-5 text-soft-blush" />
                <h3 className="text-text-primary font-weight-presence">Poetry of Your Journey</h3>
              </div>
              
              <div className="themes-list space-y-space-breath">
                {aiThemes.map((theme, index) => (
                  <div key={index} className="theme-card bg-surface-elevated border border-soft-blush-mist rounded-lg p-space-breath">
                    <p className="text-text-breath italic leading-relaxed">
                      "{theme}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Emotional Terrain */}
          <div className="garden-column space-y-space-gentle">
            
            {/* Emotional Terrain Visualization */}
            {emotionalTerrain && (
              <EmotionalTerrainChart terrain={emotionalTerrain} />
            )}

            {/* Growth Portfolio Export */}
            <div className="portfolio-export bg-primary-whisper border border-primary-mist rounded-lg p-space-gentle">
              <div className="flex items-center gap-space-breath mb-space-gentle">
                <DocumentArrowDownIcon className="w-5 h-5 text-primary" />
                <h3 className="text-text-primary font-weight-presence">Growth Portfolio</h3>
              </div>
              
              <p className="text-text-secondary text-text-breath mb-space-gentle">
                Create a beautiful story of your growth to share with yourself, family, or educators.
              </p>
              
              <button
                onClick={handleExportPortfolio}
                className="sacred-button sacred-button-primary w-full"
              >
                {getSacredButton('create', 'Weave Your Story')}
              </button>
            </div>

            {/* Garden Wisdom */}
            <div className="garden-wisdom bg-healing-whisper border border-healing-mist rounded-lg p-space-gentle">
              <h4 className="text-text-primary font-weight-presence mb-space-breath">
                Garden Wisdom
              </h4>
              <p className="text-text-secondary text-text-breath italic">
                "Every garden tells a story of seasons - of rest and growth, challenge and bloom. 
                Your emotional landscape is no different. Trust the timing of your becoming."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== STREAK VISUALIZATION COMPONENT =====

function StreakVisualization({ streakData }: StreakVisualizationProps) {
  const getStreakColor = (phase: string) => {
    const colors = {
      building: '#cb997e',   // Terra
      flowing: '#a4b792',    // Sage
      deepening: '#eeddd3',  // Blush
      mastering: '#f9f6f1'   // Healing
    };
    return colors[phase as keyof typeof colors] || colors.building;
  };

  const getStreakMessage = (phase: string, streak: number) => {
    const messages = {
      building: `${streak} days of sacred beginning`,
      flowing: `${streak} days in the river of routine`,
      deepening: `${streak} days of profound commitment`,
      mastering: `${streak} days - you are the garden keeper`
    };
    return messages[phase as keyof typeof messages] || `${streak} days of presence`;
  };

  return (
    <div className="streak-visualization bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
      <div className="flex items-center gap-space-breath mb-space-gentle">
        <div 
          className="streak-icon w-5 h-5 rounded-full"
          style={{ backgroundColor: getStreakColor(streakData.streakPhase) }}
        />
        <h3 className="text-text-primary font-weight-presence">Sacred Consistency</h3>
      </div>
      
      {/* Blush-colored wave showing daily journaling */}
      <div className="streak-wave mb-space-gentle">
        <svg viewBox="0 0 200 40" className="w-full h-10">
          <defs>
            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eeddd3" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#eeddd3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#cb997e" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Generate wave path based on weekly pattern */}
          <path
            d={generateWavePath(streakData.weeklyPattern)}
            fill="url(#streakGradient)"
            stroke="#eeddd3"
            strokeWidth="1"
          />
        </svg>
      </div>
      
      <div className="streak-stats space-y-space-breath">
        <div className="text-center">
          <div className="streak-number text-2xl font-weight-ceremony text-primary">
            {streakData.currentStreak}
          </div>
          <div className="streak-message text-text-secondary text-text-breath">
            {getStreakMessage(streakData.streakPhase, streakData.currentStreak)}
          </div>
        </div>
        
        <div className="flex justify-between text-text-whisper">
          <span>Longest: {streakData.longestStreak} days</span>
          <span className="capitalize">{streakData.streakPhase} phase</span>
        </div>
      </div>
    </div>
  );
}

// ===== BADGE CARD COMPONENT =====

function BadgeCard({ badge }: { badge: Badge }) {
  const getBadgeColor = (color: string) => {
    const colors = {
      sage: '#a4b792',
      terra: '#cb997e', 
      blush: '#eeddd3',
      healing: '#f9f6f1'
    };
    return colors[color as keyof typeof colors] || colors.sage;
  };

  return (
    <div 
      className="badge-card p-space-breath rounded-lg border transition-all timing-breath hover:scale-105"
      style={{ 
        backgroundColor: `${getBadgeColor(badge.color)}20`,
        borderColor: `${getBadgeColor(badge.color)}40`
      }}
    >
      <div className="text-center">
        <div 
          className="badge-icon w-8 h-8 rounded-full mx-auto mb-space-whisper flex items-center justify-center"
          style={{ backgroundColor: getBadgeColor(badge.color) }}
        >
          <StarIcon className="w-4 h-4 text-white" />
        </div>
        <div className="badge-name text-text-breath font-weight-presence text-text-whisper">
          {badge.name}
        </div>
        <div className="badge-description text-text-whisper text-center">
          {badge.description}
        </div>
      </div>
    </div>
  );
}

// ===== EMOTIONAL TERRAIN CHART =====

function EmotionalTerrainChart({ terrain }: { terrain: EmotionalTerrain }) {
  const metrics = [
    { key: 'resilience', label: 'Resilience', color: '#a4b792' },
    { key: 'clarity', label: 'Clarity', color: '#cb997e' },
    { key: 'selfCompassion', label: 'Self-Compassion', color: '#eeddd3' },
    { key: 'connection', label: 'Connection', color: '#f9f6f1' },
    { key: 'culturalGrounding', label: 'Cultural Grounding', color: '#a4b792' }
  ];

  return (
    <div className="emotional-terrain bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
      <div className="flex items-center gap-space-breath mb-space-gentle">
        <ChartBarIcon className="w-5 h-5 text-primary" />
        <h3 className="text-text-primary font-weight-presence">Emotional Landscape</h3>
      </div>
      
      <div className="terrain-metrics space-y-space-breath">
        {metrics.map((metric) => (
          <div key={metric.key} className="terrain-metric">
            <div className="flex justify-between mb-space-whisper">
              <span className="text-text-breath">{metric.label}</span>
              <span className="text-text-secondary">
                {Math.round(terrain[metric.key as keyof EmotionalTerrain] * 100)}%
              </span>
            </div>
            <div className="terrain-bar bg-healing-mist rounded-full h-2 overflow-hidden">
              <div 
                className="terrain-fill h-full rounded-full transition-all timing-contemplation"
                style={{ 
                  width: `${terrain[metric.key as keyof EmotionalTerrain] * 100}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="terrain-summary mt-space-gentle pt-space-gentle border-t border-healing-mist">
        <div className="text-center">
          <div className="overall-wellbeing text-lg font-weight-presence text-primary">
            {Math.round(terrain.overallWellbeing * 100)}% Flourishing
          </div>
          <p className="text-text-secondary text-text-breath">
            {terrain.overallWellbeing > 0.8 ? 'Your garden blooms with vibrant life' :
             terrain.overallWellbeing > 0.6 ? 'Steady growth across all seasons' :
             terrain.overallWellbeing > 0.4 ? 'Seeds planted, growth emerging' :
             'New growth beginning its sacred journey'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

function generateWavePath(pattern: number[]): string {
  const width = 200;
  const height = 40;
  const segmentWidth = width / pattern.length;
  
  let path = `M 0 ${height}`;
  
  pattern.forEach((value, index) => {
    const x = index * segmentWidth;
    const y = height - (value * height * 0.6) - 5; // Base amplitude with padding
    
    if (index === 0) {
      path += ` L ${x} ${y}`;
    } else {
      // Create smooth curves between points
      const prevX = (index - 1) * segmentWidth;
      const controlX1 = prevX + segmentWidth * 0.3;
      const controlX2 = x - segmentWidth * 0.3;
      path += ` C ${controlX1} ${y} ${controlX2} ${y} ${x} ${y}`;
    }
  });
  
  path += ` L ${width} ${height} L 0 ${height} Z`;
  return path;
}

function getMoodColor(tone: string): string {
  const colors = {
    challenging: '#cb997e', // Terra
    neutral: '#a4b792',     // Sage
    hopeful: '#eeddd3',     // Blush
    mixed: '#f9f6f1',       // Healing
    celebrating: '#a4b792', // Sage
    resting: '#e8e8e8'      // Light gray
  };
  
  return colors[tone as keyof typeof colors] || colors.neutral;
}

export default MemoryGardenDashboard;