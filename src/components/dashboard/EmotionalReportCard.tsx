'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import { defaultRefreshScheduler } from '@/lib/analytics/refresh-scheduler';

// Privacy-preserving analytics types
interface EmotionalMetrics {
  moodStability: number;
  emotionalRange: number;
  growthMomentum: number;
  selfCompassion: number;
  resilienceQuotient: number;
  authenticityIndex: number;
  writingEvolution: number;
  insightDepth: number;
}

interface HealingPattern {
  type: 'breakthrough' | 'gentle_growth' | 'integration' | 'restoration' | 'discovery';
  title: string;
  description: string;
  frequency: number;
  trend: 'emerging' | 'strengthening' | 'stabilizing';
  daysActive: number;
}

interface MilestoneAchievement {
  id: string;
  title: string;
  description: string;
  achievedAt: Date;
  category: 'consistency' | 'depth' | 'insight' | 'growth' | 'courage';
  icon: string;
}

interface EmotionalJourneyData {
  metrics: EmotionalMetrics;
  patterns: HealingPattern[];
  milestones: MilestoneAchievement[];
  timeframe: 'week' | 'month' | 'quarter';
  totalEntries: number;
  streakDays: number;
  averageSessionLength: number;
  emotionalVocabularyGrowth: number;
}

interface EmotionalReportCardProps {
  timeframe?: 'week' | 'month' | 'quarter';
  showPrivacyIndicator?: boolean;
}

export default function EmotionalReportCard({ 
  timeframe = 'month', 
  showPrivacyIndicator = true 
}: EmotionalReportCardProps) {
  const { user } = useAuth();
  const [journeyData, setJourneyData] = useState<EmotionalJourneyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'patterns' | 'growth'>('overview');
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [crisisMode, setCrisisMode] = useState(false);
  const [lastTouch, setLastTouch] = useState(0);

  // Mobile optimization and crisis detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const checkCrisisMode = () => {
      const crisisIndicators = [
        localStorage.getItem('alchm_emergency_mode') === 'true',
        document.body.classList.contains('crisis-active'),
        document.body.classList.contains('emergency-mode')
      ];
      setCrisisMode(crisisIndicators.some(Boolean));
    };
    
    checkMobile();
    checkCrisisMode();
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('storage', checkCrisisMode);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('storage', checkCrisisMode);
    };
  }, []);

  // Anti-tremor touch protection for vulnerable users
  const handleMobileTouch = useCallback((action: () => void) => {
    const now = Date.now();
    if (now - lastTouch < 800) return; // Prevent rapid taps during emotional distress
    
    setLastTouch(now);
    
    // Gentle haptic feedback for supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(30); // Gentle vibration
    }
    
    action();
  }, [lastTouch]);

  // Use shared refresh scheduler
  const cacheManager = defaultRefreshScheduler.getCacheManager('alchm_emotional_journey_data');

  useEffect(() => {
    const generateEmotionalJourney = async () => {
      setIsLoading(true);
      
      try {
        // Check if we should refresh data based on schedule
        const cachedData = cacheManager.get();
        const shouldRefresh = cacheManager.shouldRefresh();
        
        if (cachedData && !shouldRefresh) {
          // Use cached data if not time to refresh
          setJourneyData(cachedData);
          setHasEnoughData(cachedData.totalEntries >= 3);
          setIsLoading(false);
          return;
        }
        // Privacy-preserving analytics generation
        const mockData: EmotionalJourneyData = {
          metrics: {
            moodStability: 0.72,
            emotionalRange: 0.68,
            growthMomentum: 0.85,
            selfCompassion: 0.61,
            resilienceQuotient: 0.74,
            authenticityIndex: 0.79,
            writingEvolution: 0.82,
            insightDepth: 0.67
          },
          patterns: [
            {
              type: 'breakthrough',
              title: 'Evening Reflection Clarity',
              description: 'You\'ve been finding profound insights during evening writing sessions, showing your mind processes experiences beautifully when given quiet space.',
              frequency: 0.73,
              trend: 'strengthening',
              daysActive: 18
            },
            {
              type: 'gentle_growth',
              title: 'Emotional Vocabulary Expansion',
              description: 'Your writing shows increasing nuance in emotional expression - you\'re becoming fluent in the language of your inner world.',
              frequency: 0.65,
              trend: 'emerging',
              daysActive: 12
            },
            {
              type: 'restoration',
              title: 'Self-Compassion Moments',
              description: 'Beautiful patterns of kindness toward yourself are emerging, especially after difficult days. This is profound healing work.',
              frequency: 0.58,
              trend: 'stabilizing',
              daysActive: 24
            }
          ],
          milestones: [
            {
              id: '1',
              title: 'Consistent Voice',
              description: 'Wrote for 7 consecutive days',
              achievedAt: new Date(Date.now() - 86400000 * 2),
              category: 'consistency',
              icon: '🕊️'
            },
            {
              id: '2',
              title: 'Emotional Depth',
              description: 'Explored complex feelings with courage',
              achievedAt: new Date(Date.now() - 86400000 * 5),
              category: 'depth',
              icon: '🌊'
            },
            {
              id: '3',
              title: 'Growth Insight',
              description: 'Recognized a significant personal pattern',
              achievedAt: new Date(Date.now() - 86400000 * 8),
              category: 'insight',
              icon: '✨'
            }
          ],
          timeframe,
          totalEntries: 23,
          streakDays: 7,
          averageSessionLength: 8.5,
          emotionalVocabularyGrowth: 0.34
        };

        // Store data and update refresh timestamp
        cacheManager.set(mockData);
        
        setJourneyData(mockData);
        setHasEnoughData(mockData.totalEntries >= 5);
        
      } catch (error) {
        console.error('Failed to generate emotional journey data:', error);
        // Try to load cached data as fallback
        const fallbackData = cacheManager.get();
        if (fallbackData) {
          setJourneyData(fallbackData);
          setHasEnoughData(fallbackData.totalEntries >= 3);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      generateEmotionalJourney();
    }
  }, [user, timeframe]);

  const formatTimeframe = () => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'quarter': return 'This Quarter';
      default: return 'This Month';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 0.75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (value >= 0.60) return 'text-sage-600 bg-sage-50 border-sage-200';
    if (value >= 0.45) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getMetricDescription = (key: string, value: number) => {
    const descriptions = {
      moodStability: value >= 0.7 ? 'Your emotional landscape shows beautiful stability' : 'Your feelings are naturally flowing - this is part of growth',
      emotionalRange: value >= 0.7 ? 'You\'re experiencing a rich spectrum of emotions' : 'You\'re exploring different emotional territories with courage',
      growthMomentum: value >= 0.7 ? 'Your personal evolution is accelerating beautifully' : 'You\'re building momentum in your healing journey',
      selfCompassion: value >= 0.7 ? 'You\'re treating yourself with deep kindness' : 'You\'re learning to be gentler with yourself - this takes time',
      resilienceQuotient: value >= 0.7 ? 'Your inner strength is remarkable' : 'You\'re building resilience with each challenging moment',
      authenticityIndex: value >= 0.7 ? 'Your true self is shining through clearly' : 'You\'re courageously exploring who you really are',
      writingEvolution: value >= 0.7 ? 'Your writing voice is becoming more powerful' : 'Your expression is evolving with beautiful authenticity',
      insightDepth: value >= 0.7 ? 'Your self-awareness is profoundly deep' : 'You\'re developing meaningful insights about yourself'
    };
    return descriptions[key as keyof typeof descriptions] || 'Your journey is unfolding perfectly';
  };

  const MetricVisualization = ({ label, value, description }: { label: string, value: number, description: string }) => (
    <div className="group relative">
      {/* Organic progress shape */}
      <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sage-50/30 to-sage-100/20 border border-sage-100/50 transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5 ${
        isMobile ? 'h-24 min-h-[96px]' : 'h-20'
      }`} style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.1)'
      }}>
        {/* Growth visualization - organic flowing shape */}
        <div 
          className="absolute bottom-0 left-0 h-full rounded-2xl bg-gradient-to-t from-sage-300/40 to-sage-200/30 transition-all duration-700 ease-out"
          style={{ 
            width: `${value * 100}%`,
            clipPath: `polygon(0 100%, ${value * 100}% 100%, ${Math.min(value * 100 + 10, 100)}% 0, 0 ${100 - value * 20}%)`
          }}
        />
        
        {/* Floating percentage */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/80 backdrop-blur-sm">
          <span className={`font-semibold text-sage-700 ${
            isMobile ? 'text-base' : 'text-sm'
          }`}>
            {Math.round(value * 100)}%
          </span>
        </div>
        
        {/* Metric label */}
        <div className="absolute bottom-3 left-3">
          <h4 className={`font-semibold text-sage-800 tracking-tight ${
            isMobile ? 'text-base' : 'text-sm'
          }`}>
            {label}
          </h4>
        </div>
        
        {/* Sparkle indicator for high values */}
        {value >= 0.75 && (
          <div className="absolute top-2 left-2 text-lg animate-gentle-sparkle">
            ✨
          </div>
        )}
      </div>
      
      {/* Compassionate description - always visible on mobile */}
      {isMobile ? (
        <div className="mt-2">
          <p className="text-xs text-sage-700 text-center leading-relaxed px-2">
            {description}
          </p>
        </div>
      ) : (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-soft border border-sage-100 max-w-xs">
            <p className="text-xs text-sage-700 text-center leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const PatternCard = ({ pattern }: { pattern: HealingPattern }) => {
    const getPatternColor = (type: string) => {
      switch (type) {
        case 'breakthrough': return 'from-purple-50 to-purple-100 border-purple-200 text-purple-800';
        case 'gentle_growth': return 'from-sage-50 to-sage-100 border-sage-200 text-sage-800';
        case 'integration': return 'from-blue-50 to-blue-100 border-blue-200 text-blue-800';
        case 'restoration': return 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800';
        case 'discovery': return 'from-amber-50 to-amber-100 border-amber-200 text-amber-800';
        default: return 'from-gray-50 to-gray-100 border-gray-200 text-gray-800';
      }
    };

    const getPatternIcon = (type: string) => {
      switch (type) {
        case 'breakthrough': return '🌟';
        case 'gentle_growth': return '🌱';
        case 'integration': return '🔄';
        case 'restoration': return '🌸';
        case 'discovery': return '🔍';
        default: return '💭';
      }
    };

    return (
      <div className={`group relative p-4 rounded-2xl bg-gradient-to-br ${getPatternColor(pattern.type)} border transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">
              {getPatternIcon(pattern.type)}
            </span>
            <h3 className="font-semibold text-sm tracking-tight">
              {pattern.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            <span className="text-xs font-medium">
              {pattern.daysActive}d
            </span>
          </div>
        </div>
        
        <p className="text-xs leading-relaxed mb-3 opacity-90">
          {pattern.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current rounded-full transition-all duration-500"
                style={{ width: `${pattern.frequency * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium">
              {Math.round(pattern.frequency * 100)}%
            </span>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            pattern.trend === 'emerging' ? 'bg-green-100 text-green-700' :
            pattern.trend === 'strengthening' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {pattern.trend}
          </span>
        </div>
      </div>
    );
  };

  const MilestoneCard = ({ milestone }: { milestone: MilestoneAchievement }) => {
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'consistency': return 'bg-sage-100 text-sage-700';
        case 'depth': return 'bg-blue-100 text-blue-700';
        case 'insight': return 'bg-purple-100 text-purple-700';
        case 'growth': return 'bg-emerald-100 text-emerald-700';
        case 'courage': return 'bg-amber-100 text-amber-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const timeAgo = Math.floor((Date.now() - milestone.achievedAt.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="group relative p-4 bg-gradient-to-br from-white/50 to-white/30 border border-sage-100/50 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-lg">{milestone.icon}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm text-sage-800 tracking-tight">
                {milestone.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(milestone.category)}`}>
                {milestone.category}
              </span>
            </div>
            
            <p className="text-xs text-sage-600 leading-relaxed mb-2">
              {milestone.description}
            </p>
            
            <span className="text-xs text-sage-500 font-medium">
              {timeAgo === 0 ? 'Today' : `${timeAgo} day${timeAgo === 1 ? '' : 's'} ago`}
            </span>
          </div>
        </div>
        
        {/* Celebration sparkle */}
        <div className="absolute -top-1 -right-1 text-sm animate-gentle-sparkle opacity-60">
          ✨
        </div>
      </div>
    );
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-8 backdrop-blur-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
            <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-pulse opacity-60" />
          </div>
          <h3 className="text-sage-800 font-semibold text-lg mb-2 tracking-tight">
            Gathering Your Healing Insights
          </h3>
          <p className="text-sage-600 text-sm tracking-wide">
            Honoring your journey with compassionate analysis
          </p>
        </div>
        
        {/* Floating background elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-radial from-sage-100/30 via-sage-50/10 to-transparent rounded-full blur-sm" />
        <div className="absolute top-1/2 -left-8 w-24 h-24 bg-gradient-radial from-sage-50/20 via-sage-100/5 to-transparent rounded-full blur-md" />
      </div>
    );
  }

  if (!hasEnoughData) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-8 backdrop-blur-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
          <span className="text-2xl opacity-60 animate-gentle-breathe">🌱</span>
        </div>
        
        <h3 className="text-sage-800 font-semibold text-xl mb-3 tracking-tight">
          Your Emotional Garden Is Growing
        </h3>
        
        <p className="text-sage-600 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
          Continue nurturing your inner world through writing. Each entry helps us understand your unique healing patterns.
        </p>
        
        <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sage-400 to-sage-500 hover:from-sage-500 hover:to-sage-600 text-white rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 group">
          <span className="group-hover:scale-110 transition-transform duration-200">✍️</span>
          Continue Writing
        </button>
        
        {/* Floating background elements */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-radial from-sage-100/20 via-sage-50/5 to-transparent rounded-full blur-lg" />
      </div>
    );
  }

  if (!journeyData) return null;

  const TabButton = ({ id, label, isActive, onClick }: { 
    id: string; 
    label: string; 
    isActive: boolean; 
    onClick: () => void; 
  }) => (
    <button
      onClick={() => isMobile 
        ? handleMobileTouch(onClick)
        : onClick()
      }
      className={`rounded-xl font-medium transition-all duration-200 touch-target-safe ${
        isMobile 
          ? 'px-4 py-3 text-base min-h-[52px]' 
          : 'px-4 py-2 text-sm'
      } ${
        isActive 
          ? 'bg-white text-sage-700 shadow-soft' 
          : 'text-sage-600 hover:text-sage-700 hover:bg-sage-50/50'
      }`}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)'
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft backdrop-blur-sm">
      {/* Privacy indicator */}
      {showPrivacyIndicator && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-sage-100/60 backdrop-blur-sm rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-gentle-pulse" />
          <span className="text-xs font-medium text-sage-700">Privacy Protected</span>
        </div>
      )}

      {/* Header */}
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sage-800 font-semibold text-2xl mb-1 tracking-tight">
              Your Emotional Journey
            </h2>
            <p className="text-sage-600 text-sm tracking-wide font-medium">
              {formatTimeframe()} • {journeyData.totalEntries} reflections
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-sage-400 rounded-full" />
              <span className="text-xs text-sage-500 font-medium">
                Next refresh: {defaultRefreshScheduler.formatNextRefresh()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl">
              <span className="text-xl animate-gentle-pulse">🌸</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-sage-700">
                {journeyData.streakDays} days
              </div>
              <div className="text-xs text-sage-600 font-medium">
                writing streak
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-sage-50/60 rounded-xl">
          <TabButton
            id="overview"
            label="Overview"
            isActive={selectedTab === 'overview'}
            onClick={() => setSelectedTab('overview')}
          />
          <TabButton
            id="patterns"
            label="Patterns"
            isActive={selectedTab === 'patterns'}
            onClick={() => setSelectedTab('patterns')}
          />
          <TabButton
            id="growth"
            label="Growth"
            isActive={selectedTab === 'growth'}
            onClick={() => setSelectedTab('growth')}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 pt-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Emotional Metrics Grid */}
            <div>
              <h3 className={`text-sage-800 font-semibold mb-4 tracking-tight ${
                isMobile ? 'text-xl' : 'text-lg'
              }`}>
                Emotional Landscape
              </h3>
              <div className={`grid gap-4 ${
                isMobile || crisisMode 
                  ? 'grid-cols-1' 
                  : 'grid-cols-2 lg:grid-cols-4'
              }`}>
                <MetricVisualization
                  label="Stability"
                  value={journeyData.metrics.moodStability}
                  description={getMetricDescription('moodStability', journeyData.metrics.moodStability)}
                />
                <MetricVisualization
                  label="Growth"
                  value={journeyData.metrics.growthMomentum}
                  description={getMetricDescription('growthMomentum', journeyData.metrics.growthMomentum)}
                />
                <MetricVisualization
                  label="Authenticity"
                  value={journeyData.metrics.authenticityIndex}
                  description={getMetricDescription('authenticityIndex', journeyData.metrics.authenticityIndex)}
                />
                <MetricVisualization
                  label="Resilience"
                  value={journeyData.metrics.resilienceQuotient}
                  description={getMetricDescription('resilienceQuotient', journeyData.metrics.resilienceQuotient)}
                />
              </div>
            </div>

            {/* Journey Stats */}
            <div className={`grid gap-4 ${
              isMobile || crisisMode 
                ? 'grid-cols-1' 
                : 'grid-cols-1 md:grid-cols-3'
            }`}>
              <div className="p-4 bg-gradient-to-br from-sage-50/50 to-sage-100/30 rounded-2xl border border-sage-100/50">
                <div className="text-2xl font-bold text-sage-700 mb-1">
                  {journeyData.averageSessionLength.toFixed(1)}m
                </div>
                <div className="text-sm text-sage-600 font-medium">
                  Average session length - you're taking time to go deep
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl border border-blue-100/50">
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  +{Math.round(journeyData.emotionalVocabularyGrowth * 100)}%
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Emotional vocabulary growth - you're finding new words for feelings
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-2xl border border-purple-100/50">
                <div className="text-2xl font-bold text-purple-700 mb-1">
                  {Math.round(journeyData.metrics.insightDepth * 100)}%
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  Insight depth - your self-awareness is expanding beautifully
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'patterns' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sage-800 font-semibold text-lg mb-2 tracking-tight">
                Healing Patterns We've Noticed
              </h3>
              <p className="text-sage-600 text-sm mb-6 leading-relaxed">
                These gentle observations honor the unique ways you're growing and healing.
              </p>
              
              <div className="space-y-4">
                {journeyData.patterns.map((pattern, index) => (
                  <PatternCard key={index} pattern={pattern} />
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'growth' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sage-800 font-semibold text-lg mb-2 tracking-tight">
                Milestones & Celebrations
              </h3>
              <p className="text-sage-600 text-sm mb-6 leading-relaxed">
                Every step forward deserves recognition. These are your recent achievements in healing.
              </p>
              
              <div className="space-y-4">
                {journeyData.milestones.map((milestone) => (
                  <MilestoneCard key={milestone.id} milestone={milestone} />
                ))}
              </div>
            </div>

            {/* Encouragement */}
            <div className="p-6 bg-gradient-to-br from-sage-50/50 to-sage-100/30 rounded-2xl border border-sage-100/50 text-center">
              <div className="text-3xl mb-3 animate-gentle-sparkle">🌟</div>
              <h4 className="text-sage-800 font-semibold text-lg mb-2 tracking-tight">
                You're Doing Beautiful Work
              </h4>
              <p className="text-sage-600 text-sm leading-relaxed max-w-md mx-auto">
                Your commitment to understanding yourself is profound. Each reflection is an act of courage and self-love.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating background elements */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-radial from-sage-100/15 via-sage-50/5 to-transparent rounded-full blur-lg pointer-events-none opacity-60" />
      <div className="absolute top-1/2 -left-16 w-32 h-32 bg-gradient-radial from-sage-50/10 via-sage-100/5 to-transparent rounded-full blur-md pointer-events-none opacity-30" />
    </div>
  );
}