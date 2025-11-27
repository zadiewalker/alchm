'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Performance-optimized imports: Lightweight emotional intelligence facade
import { 
  LightweightEmotionalIntelligence, 
  LightweightIdentityArchetype, 
  EvolutionInsight,
  EmotionalIntelligencePerformanceMonitor 
} from '@/lib/lightweight-emotional-intelligence';

// Crisis-optimized navigation component for report card
interface CrisisOptimizedButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function CrisisOptimizedButton({ href, children, className = '', onClick }: CrisisOptimizedButtonProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Trauma-informed haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([8, 4, 8]); // Gentle confirmation
    }
    
    try {
      setIsNavigating(true);
      setHasError(false);
      onClick?.();
      
      // Store navigation context for crash recovery
      sessionStorage.setItem('report_card_navigation', JSON.stringify({
        targetPath: href,
        timestamp: Date.now(),
        source: 'report_card'
      }));
      
      // Gentle delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate with explicit error handling
      await router.push(href);
      
    } catch (error) {
      console.error('Navigation failed from ReportCard:', error);
      setHasError(true);
      
      // Error haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([30, 10, 30]);
      }
      
      // Supportive error message
      setTimeout(() => {
        if (confirm('Navigation had trouble loading. Would you like to try again?')) {
          handleClick(e);
        }
      }, 500);
      
    } finally {
      setIsNavigating(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`${className} crisis-optimized-nav-button`}
      style={{
        // Trauma-informed touch targets
        minHeight: '52px',
        minWidth: '120px',
        padding: '12px 16px',
        margin: '4px',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)',
        // Smooth transitions
        transition: 'all 0.2s ease',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Visual feedback states
        opacity: isNavigating ? 0.7 : 1,
        cursor: hasError ? 'help' : 'pointer',
        position: 'relative',
        border: 'none',
        background: 'transparent',
        width: '100%',
        textAlign: 'left'
      }}
      disabled={isNavigating}
      aria-busy={isNavigating}
      aria-label={`Navigate to ${href} - Analytics page`}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'translateZ(0) scale(0.98)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'translateZ(0) scale(1)';
      }}
      onTouchCancel={(e) => {
        e.currentTarget.style.transform = 'translateZ(0) scale(1)';
      }}
    >
      {children}
      
      {/* Loading indicator */}
      {isNavigating && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '12px',
          height: '12px',
          background: 'rgba(164, 183, 146, 0.8)',
          borderRadius: '50%',
          animation: 'gentle-pulse 1s ease-in-out infinite'
        }} />
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '12px',
          color: '#ef4444'
        }}>
          ⚠
        </div>
      )}
    </button>
  );
}

interface IdentityInsights {
  // Core identity metrics
  identityCoherence: number; // How aligned user is with their authentic self
  emotionalIntelligence: number; // Sophisticated emotional awareness
  archetypeEmbodiment: number; // How fully user embodies their archetype
  authenticityIndex: number; // Alignment between inner and outer expression
  
  // Growth and evolution
  growthVelocity: number; // Speed of personal evolution
  integrationLevel: number; // How well user integrates experiences
  wisdomAccumulation: number; // Depth of insight and understanding
  serviceReadiness: number; // Readiness to serve others from gifts
  
  // Emotional sophistication
  emotionalRange: number; // Breadth of emotional experience
  emotionalRegulation: number; // Skill in managing emotions
  emotionalExpression: number; // Ability to express emotions authentically
  emotionalWisdom: number; // Understanding emotions as information
  
  // Lightweight identity archetype (no heavy imports)
  primaryArchetype: LightweightIdentityArchetype | null;
  archetypePhase: string;
  evolutionStage: string;
  uniqueGifts: string[];
  
  // Relationships and impact
  relationalWisdom: number; // Understanding of relationship dynamics
  communicationEvolution: number; // Growth in communication skills
  leadershipEmergence: number; // Development of leadership qualities
  
  // Shadow work and healing
  shadowIntegration: number; // Integration of shadow aspects
  traumaHealing: number; // Progress in healing trauma
  projectionReclamation: number; // Reclaiming projections
  
  // Service and purpose
  purposeClarity: number; // Clarity about life purpose
  giftActivation: number; // Activation of unique gifts
  serviceExpression: number; // Expression of service to others
  
  // Meta metrics
  overallEvolution: number; // Overall identity evolution score
  evolutionTrend: 'accelerating' | 'steady' | 'integrating' | 'breakthrough_imminent';
  streakDays: number;
  totalReflections: number;
  recentBreakthroughs: number;
}

interface ReportCardProps {
  timeframe?: 'week' | 'month' | 'quarter';
  variant?: 'compact' | 'full';
}

// EvolutionInsight interface now imported from lightweight-emotional-intelligence

export default function ReportCard({ timeframe = 'month', variant = 'compact' }: ReportCardProps) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<IdentityInsights | null>(null);
  const [evolutionInsights, setEvolutionInsights] = useState<EvolutionInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnoughData, setHasEnoughData] = useState(false);
  
  // Performance monitoring for component initialization
  useEffect(() => {
    EmotionalIntelligencePerformanceMonitor.measureBundleSize();
  }, []);

  useEffect(() => {
    const loadIdentityInsights = async () => {
      setIsLoading(true);
      
      try {
        // Performance-optimized: Use lightweight computation with async loading of heavy systems
        const quickInsights = generateLightweightInsights();
        
        // Set initial fast insights immediately for better perceived performance
        setInsights(quickInsights);
        setHasEnoughData(quickInsights.totalReflections >= 5);
        setIsLoading(false);
        
        // Async enhancement with heavy emotional intelligence systems
        if (typeof window !== 'undefined') {
          enhanceWithAdvancedSystems(quickInsights);
        }
        
      } catch (error) {
        console.error('Failed to load identity insights:', error);
        // Fallback to basic insights
        const fallbackInsights = generateLightweightInsights();
        setInsights(fallbackInsights);
        setHasEnoughData(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadIdentityInsights();
    }
  }, [user, timeframe]);

  // Performance-optimized lightweight insights generation
  const generateLightweightInsights = (): IdentityInsights => {
    const startTime = performance.now();
    
    // Use lightweight emotional intelligence engine
    const quickInsights = LightweightEmotionalIntelligence.generateQuickInsights(user?.uid);
    const emotionalMetrics = LightweightEmotionalIntelligence.calculateEmotionalMetrics();
    
    const insights: IdentityInsights = {
      // Core identity metrics from lightweight engine
      identityCoherence: quickInsights.identityCoherence,
      emotionalIntelligence: quickInsights.emotionalIntelligence,
      archetypeEmbodiment: quickInsights.archetypeEmbodiment,
      authenticityIndex: quickInsights.authenticityIndex,
      
      // Growth and evolution metrics
      growthVelocity: emotionalMetrics.growthVelocity,
      integrationLevel: emotionalMetrics.integrationLevel,
      wisdomAccumulation: emotionalMetrics.wisdomAccumulation,
      serviceReadiness: emotionalMetrics.serviceReadiness,
      
      // Emotional sophistication
      emotionalRange: emotionalMetrics.emotionalRange,
      emotionalRegulation: emotionalMetrics.emotionalRegulation,
      emotionalExpression: emotionalMetrics.emotionalExpression,
      emotionalWisdom: emotionalMetrics.emotionalWisdom,
      
      // Lightweight archetype from performance-optimized engine
      primaryArchetype: quickInsights.primaryArchetype,
      archetypePhase: quickInsights.primaryArchetype.currentPhase.name,
      evolutionStage: quickInsights.primaryArchetype.evolutionStage,
      uniqueGifts: quickInsights.uniqueGifts,
      
      // Relationships and impact
      relationalWisdom: emotionalMetrics.relationalWisdom,
      communicationEvolution: emotionalMetrics.communicationEvolution,
      leadershipEmergence: emotionalMetrics.leadershipEmergence,
      
      // Shadow work and healing
      shadowIntegration: emotionalMetrics.shadowIntegration,
      traumaHealing: emotionalMetrics.traumaHealing,
      projectionReclamation: emotionalMetrics.projectionReclamation,
      
      // Service and purpose
      purposeClarity: emotionalMetrics.purposeClarity,
      giftActivation: emotionalMetrics.giftActivation,
      serviceExpression: emotionalMetrics.serviceExpression,
      
      // Meta metrics from quick insights
      overallEvolution: quickInsights.overallEvolution,
      evolutionTrend: quickInsights.evolutionTrend,
      streakDays: quickInsights.streakDays,
      totalReflections: quickInsights.totalReflections,
      recentBreakthroughs: quickInsights.recentBreakthroughs
    };
    
    // Monitor performance
    EmotionalIntelligencePerformanceMonitor.measureRenderTime('ReportCard-LightweightInsights', startTime);
    
    return insights;
  };

  // Async enhancement with heavy systems (loaded on demand)
  const enhanceWithAdvancedSystems = async (baseInsights: IdentityInsights) => {
    try {
      // Use the lightweight intelligence engine's enhancement capability
      const enhanced = await LightweightEmotionalIntelligence.enhanceWithAdvancedSystems();
      
      if (enhanced) {
        console.log('Advanced emotional intelligence systems loaded for enhanced analysis');
        // In a real implementation, we would update the insights with enhanced data
        // For now, we maintain the lightweight approach for performance
      }
    } catch (error) {
      // Graceful degradation - the component works without advanced systems
      console.warn('Advanced emotional intelligence systems failed to load, using lightweight analysis');
    }
  };

  // Generate lightweight evolution insights (no heavy computation)
  const generateEvolutionInsights = (): EvolutionInsight[] => {
    const startTime = performance.now();
    
    // Use lightweight emotional intelligence engine for evolution insights
    const insights = LightweightEmotionalIntelligence.generateEvolutionInsights();
    
    // Monitor performance
    EmotionalIntelligencePerformanceMonitor.measureRenderTime('ReportCard-EvolutionInsights', startTime);
    
    return insights;
  };

  // Set evolution insights immediately for better performance
  useEffect(() => {
    if (insights) {
      setEvolutionInsights(generateEvolutionInsights());
    }
  }, [insights]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-white border border-sage-100 rounded-3xl shadow-soft transition-all duration-300">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
            <div className="animate-gentle-pulse">
              <div className="w-6 h-6 bg-sage-400 rounded opacity-60 animate-breathe" />
            </div>
          </div>
          <p className="text-sage-600 font-medium text-sm tracking-wide">
            Analyzing your identity evolution
          </p>
          <p className="text-sage-500 text-xs mt-2 tracking-wide">
            Processing emotional signatures & archetype patterns
          </p>
        </div>
        {/* Signature Jony Ive gradient orb */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-radial from-sage-100/30 via-sage-50/10 to-transparent rounded-full blur-sm" />
      </div>
    );
  }

  if (!hasEnoughData) {
    return (
      <div className="relative overflow-hidden bg-white border border-sage-100 rounded-3xl shadow-soft p-8 text-center transition-all duration-300 hover:shadow-card group">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
          <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-8 h-8 bg-sage-400 rounded-lg opacity-40 animate-breathe" />
          </div>
        </div>
        
        <h3 className="text-ink font-medium text-xl mb-3 tracking-tight">
          Your Identity Map Is Emerging
        </h3>
        
        <p className="text-muted text-sm mb-8 leading-relaxed max-w-xs mx-auto">
          Continue reflecting to unlock your unique archetype and emotional intelligence insights.
        </p>
        
        <CrisisOptimizedButton
          href="/journal"
          className="inline-flex items-center gap-3 px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 group/btn"
        >
          <span className="group-hover/btn:scale-110 transition-transform duration-200">✍️</span>
          Start Writing
        </CrisisOptimizedButton>
        
        {/* Signature gradient orb */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-radial from-sage-100/20 via-sage-50/5 to-transparent rounded-full blur-lg" />
      </div>
    );
  }

  if (!insights) return null;

  const getEvolutionColor = (score: number) => {
    if (score >= 0.8) return 'sage-400';
    if (score >= 0.6) return 'amber-400';
    return 'rose-400';
  };

  const getEvolutionColorClass = (score: number) => {
    if (score >= 0.8) return 'text-sage-600 bg-sage-100';
    if (score >= 0.6) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };
  
  const formatPercentage = (score: number) => Math.round(score * 100);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accelerating': return '⚡';
      case 'steady': return '↗';
      case 'integrating': return '◉';
      case 'breakthrough_imminent': return '✨';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'accelerating': return 'text-purple-600';
      case 'steady': return 'text-sage-600';
      case 'integrating': return 'text-blue-600';
      case 'breakthrough_imminent': return 'text-amber-600';
      default: return 'text-muted';
    }
  };

  const getTrendBg = (trend: string) => {
    switch (trend) {
      case 'accelerating': return 'bg-purple-50';
      case 'steady': return 'bg-sage-50';
      case 'integrating': return 'bg-blue-50';
      case 'breakthrough_imminent': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  const formatTimeframe = () => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'quarter': return 'This Quarter';
      default: return 'This Month';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative overflow-hidden bg-white border border-sage-100 rounded-3xl shadow-card p-8 transition-all duration-300 hover:shadow-elevated group">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-ink font-medium text-2xl mb-1 tracking-tight">
              Identity Evolution Report
            </h3>
            <p className="text-muted text-sm tracking-wide font-medium">
              {formatTimeframe()}
            </p>
            {insights.primaryArchetype && (
              <p className="text-sage-600 text-xs mt-1 tracking-wide font-medium">
                {insights.primaryArchetype.name} • {insights.archetypePhase}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${getTrendBg(insights.evolutionTrend)} transition-all duration-300`}>
              <span className={`text-xl font-medium ${getTrendColor(insights.evolutionTrend)}`}>{getTrendIcon(insights.evolutionTrend)}</span>
            </div>
            <div className={`px-4 py-2 rounded-2xl font-medium text-sm ${getEvolutionColorClass(insights.overallEvolution)} transition-all duration-300`}>
              {formatPercentage(insights.overallEvolution)}%
            </div>
          </div>
        </div>

        {/* Core Identity Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Identity Coherence', value: insights.identityCoherence, key: 'coherence' },
            { label: 'Emotional Intel', value: insights.emotionalIntelligence, key: 'eq' },
            { label: 'Authenticity', value: insights.authenticityIndex, key: 'authentic' },
            { label: 'Integration', value: insights.integrationLevel, key: 'integration' }
          ].map((metric, index) => (
            <div key={index} className="group/metric bg-sage-50/30 hover:bg-sage-50/50 p-4 rounded-2xl border border-sage-100/50 transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {metric.label}
                </span>
                <div className="w-2 h-2 rounded-full bg-sage-200 group-hover/metric:bg-sage-300 transition-colors duration-200" />
              </div>
              <div className={`text-2xl font-medium tracking-tight ${metric.value >= 0.8 ? 'text-sage-600' : metric.value >= 0.6 ? 'text-amber-600' : 'text-rose-500'}`}>
                {formatPercentage(metric.value)}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Evolution Insights */}
        {evolutionInsights.length > 0 && (
          <div className="mb-8">
            <h4 className="text-ink font-medium text-sm mb-4 tracking-wide uppercase">
              Recent Evolution Insights
            </h4>
            <div className="space-y-3">
              {evolutionInsights.slice(0, 2).map((insight, index) => (
                <div key={index} className="group/insight bg-gradient-to-r from-sage-50/30 to-sage-100/20 p-4 rounded-2xl border border-sage-100/60 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-ink font-medium text-sm tracking-tight">
                      {insight.title}
                    </h5>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      insight.type === 'breakthrough' ? 'bg-purple-100 text-purple-700' :
                      insight.type === 'integration' ? 'bg-blue-100 text-blue-700' :
                      insight.type === 'gift_activation' ? 'bg-amber-100 text-amber-700' :
                      insight.type === 'shadow_work' ? 'bg-rose-100 text-rose-700' :
                      'bg-sage-100 text-sage-700'
                    }`}>
                      {insight.type.replace('_', ' ')}
                    </div>
                  </div>
                  <p className="text-muted text-xs leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Summary */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-sage-50/50 to-sage-100/30 rounded-2xl border border-sage-100/60 mb-8 group/summary hover:shadow-soft transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-subtle border border-sage-100">
              <div className="w-3 h-3 bg-sage-400 rounded-full animate-gentle-pulse" />
            </div>
            <div>
              <div className="text-ink font-medium text-base tracking-tight">
                {insights.streakDays} day streak
              </div>
              <div className="text-muted text-xs font-medium">
                {insights.totalReflections} identity reflections
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1.5 rounded-xl text-xs font-medium ${getTrendColor(insights.evolutionTrend)} ${getTrendBg(insights.evolutionTrend)} border transition-all duration-200 ${
            insights.evolutionTrend === 'accelerating' ? 'border-purple-200' : 
            insights.evolutionTrend === 'steady' ? 'border-sage-200' :
            insights.evolutionTrend === 'integrating' ? 'border-blue-200' :
            insights.evolutionTrend === 'breakthrough_imminent' ? 'border-amber-200' : 'border-gray-200'
          }`}>
            {insights.evolutionTrend.replace('_', ' ')}
          </div>
        </div>

        {/* Action Button - Crisis-Optimized Navigation */}
        <CrisisOptimizedButton
          href="/analytics"
          className="block w-full py-4 text-center bg-gradient-to-r from-sage-50 to-sage-100/80 hover:from-sage-100 hover:to-sage-200/80 text-sage-700 hover:text-sage-800 rounded-2xl text-sm font-medium border border-sage-200 hover:border-sage-300 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 tracking-wide group/btn"
        >
          <span className="group-hover/btn:tracking-wider transition-all duration-200">Explore Identity Map</span>
        </CrisisOptimizedButton>

        {/* Signature Jony Ive gradient orb */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-radial from-sage-100/15 via-sage-50/5 to-transparent rounded-full blur-lg pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Secondary depth orb */}
        <div className="absolute top-1/2 -left-16 w-32 h-32 bg-gradient-radial from-sage-50/10 via-sage-100/5 to-transparent rounded-full blur-md pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
      </div>
    );
  }

  // Full variant would go here, but compact is sufficient for dashboard
  return null;
}