'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/hooks/useData';
import { advancedAI, AIInsight, PersonalityProfile, PredictiveModel, ThematicAnalysis, AIRecommendation } from '@/lib/advancedAI';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/lib/storageKeys';

export default function AIInsightsDashboard() {
  const { user } = useAuth();
  const { getJournalEntries, getDreamEntries, isInitialized } = useData();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [thematicAnalysis, setThematicAnalysis] = useState<ThematicAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'personality' | 'predictions' | 'themes' | 'recommendations'>('insights');
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  useEffect(() => {
    if (isInitialized) {
      loadAIAnalysis();
    }
  }, [isInitialized]);

  const loadAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Load cached analysis first
      const cached = loadCachedAnalysis();
      if (cached) {
        setInsights(cached.insights || []);
        setPersonalityProfile(cached.personality || null);
        setPredictiveModel(cached.predictions || null);
        setThematicAnalysis(cached.themes || null);
        setRecommendations(cached.recommendations || []);
        setLastAnalysis(cached.lastAnalysis ? new Date(cached.lastAnalysis) : null);
      }

      // Check if we need fresh analysis (daily update)
      const today = new Date().toDateString();
      const lastAnalysisDate = cached?.lastAnalysis ? new Date(cached.lastAnalysis).toDateString() : null;
      
      if (lastAnalysisDate !== today) {
        await performFreshAnalysis();
      }
    } catch (error) {
      console.error('Error loading AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performFreshAnalysis = async () => {
    try {
      // Gather all user data
      const journalEntries = await getJournalEntries(50);
      const dreamEntries = await getDreamEntries();
      const moodHistory = JSON.parse(getStorageItemWithFallback('mood_history') || '[]');
      const challengeCompletions = JSON.parse(getStorageItemWithFallback('transformation_progress') || '{}').challengeHistory || [];
      const pathwayProgress = JSON.parse(getStorageItemWithFallback('pathway_progress') || '[]');

      const userData = {
        journalEntries,
        moodHistory,
        challengeCompletions,
        pathwayProgress,
        dreamEntries
      };

      // Generate comprehensive AI analysis
      console.log('Performing AI analysis...');
      
      // Complex pattern analysis
      const newInsights = await advancedAI.analyzeComplexPatterns(userData);
      setInsights(newInsights);

      // Personality profiling
      const newProfile = await advancedAI.generatePersonalityProfile({
        journalEntries,
        challengePreferences: challengeCompletions,
        socialInteractions: [],
        emotionalResponses: moodHistory
      });
      setPersonalityProfile(newProfile);

      // Predictive modeling
      const newPredictions = await advancedAI.generatePredictiveModel([...journalEntries, ...moodHistory]);
      setPredictiveModel(newPredictions);

      // Thematic analysis
      const newThemes = await advancedAI.performThematicAnalysis(journalEntries);
      setThematicAnalysis(newThemes);

      // Personalized recommendations
      const newRecommendations = await advancedAI.generatePersonalizedRecommendations(
        newProfile,
        { currentMood: getCurrentMood(), recentStress: getRecentStressLevel() },
        ['emotional wellness', 'personal growth', 'self-awareness']
      );
      setRecommendations(newRecommendations);

      // Cache the results
      const analysisData = {
        insights: newInsights,
        personality: newProfile,
        predictions: newPredictions,
        themes: newThemes,
        recommendations: newRecommendations,
        lastAnalysis: new Date()
      };
      
      setStorageItemNormalized('ai_analysis', JSON.stringify(analysisData));
      setLastAnalysis(new Date());
      
      console.log('AI analysis complete');
    } catch (error) {
      console.error('Error performing fresh analysis:', error);
    }
  };

  const loadCachedAnalysis = () => {
    try {
      const cached = getStorageItemWithFallback('ai_analysis');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const getCurrentMood = (): number => {
    const recent = getStorageItemWithFallback('current_mood');
    if (recent) {
      const mood = parseInt(recent);
      return isNaN(mood) ? 5 : Math.max(1, Math.min(10, mood));
    }
    return 5;
  };

  const getRecentStressLevel = (): number => {
    // Simple stress assessment based on recent entries
    return 4; // Default moderate stress level
  };

  const dismissInsight = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, dismissed: true } : insight
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      pattern: '🔍',
      prediction: '🔮',
      recommendation: '💡',
      breakthrough: '🚀',
      warning: '⚠️'
    };
    return icons[type as keyof typeof icons] || '✨';
  };

  const tabs = [
    { id: 'insights' as const, name: 'AI Insights', icon: '🧠', count: insights.filter(i => !i.dismissed).length },
    { id: 'personality' as const, name: 'Personality', icon: '👤', count: personalityProfile ? 1 : 0 },
    { id: 'predictions' as const, name: 'Predictions', icon: '🔮', count: predictiveModel ? 1 : 0 },
    { id: 'themes' as const, name: 'Themes', icon: '📊', count: thematicAnalysis ? 1 : 0 },
    { id: 'recommendations' as const, name: 'AI Guidance', icon: '🎯', count: recommendations.length }
  ];

  return (
    <div className="ai-insights-dashboard max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🧠</div>
        <h2 className="text-2xl text-white font-light mb-3">Advanced AI Insights</h2>
        <p className="text-white/70 text-sm">
          Deep pattern analysis and personalized guidance powered by advanced artificial intelligence
        </p>
        {lastAnalysis && (
          <p className="text-white/50 text-xs mt-2">
            Last analysis: {lastAnalysis.toLocaleDateString()} at {lastAnalysis.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="bg-[#8B9A7C]/20 border border-[#8B9A7C]/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#A8B5A0] border-t-[#8B9A7C] rounded-full animate-spin"></div>
            <span className="text-[#A8B5A0]">Performing advanced AI analysis of your data...</span>
          </div>
        </div>
      )}

      {/* Refresh Analysis */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white text-lg font-light">AI Analysis Engine</h3>
            <p className="text-white/60 text-sm">
              Advanced pattern recognition, personality profiling, and predictive modeling
            </p>
          </div>
          <button
            onClick={performFreshAnalysis}
            disabled={isAnalyzing}
            className="bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-2 mb-8">
        <div className="grid grid-cols-5 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="text-xl mb-1">{tab.icon}</div>
              <div className="font-medium text-xs">{tab.name}</div>
              {tab.count > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#8B9A7C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.count > 9 ? '9+' : tab.count}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <h3 className="text-white text-lg font-light">🔍 Pattern Recognition & Insights</h3>
          
          {insights.filter(i => !i.dismissed).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🧠</div>
              <h3 className="text-white text-lg font-light mb-2">Building AI Insights</h3>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                Continue journaling and engaging with the app. Our AI will identify meaningful patterns in your growth journey.
              </p>
            </div>
          ) : (
            insights.filter(i => !i.dismissed).map((insight) => (
              <div
                key={insight.id}
                className={`border-2 rounded-2xl p-6 ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                    <div>
                      <h4 className="text-white font-medium">{insight.title}</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white/60">{insight.category}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">{Math.round((insight.confidence || 0) * 100)}% confidence</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">{insight.timeframe}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <p className="text-white/80 mb-4 leading-relaxed">
                  {insight.description}
                </p>

                {insight.actionItems.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-white/80 font-medium mb-2">Recommended Actions:</h5>
                    <ul className="space-y-1">
                      {insight.actionItems.map((action, index) => (
                        <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-[#8B9A7C] mt-1">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.supportingEvidence.length > 0 && (
                  <div>
                    <h5 className="text-white/80 font-medium mb-2">Supporting Evidence:</h5>
                    <ul className="space-y-1">
                      {insight.supportingEvidence.map((evidence, index) => (
                        <li key={index} className="text-white/60 text-sm flex items-start gap-2">
                          <span className="text-[#8B9A7C] mt-1">•</span>
                          {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'personality' && personalityProfile && (
        <div className="space-y-6">
          <h3 className="text-white text-lg font-light">👤 AI Personality Analysis</h3>
          
          {/* Big Five Traits */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4">Personality Traits</h4>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(personalityProfile.traits).map(([trait, value]) => (
                <div key={trait} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 relative">
                    <div className="w-full h-full bg-gray-700 rounded-full"></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#8B9A7C] to-[#A8B5A0] rounded-full"
                      style={{ height: `${Math.max(0, Math.min(100, value || 0))}%`, marginTop: `${Math.max(0, Math.min(100, 100 - (value || 0)))}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                      {value}
                    </div>
                  </div>
                  <div className="text-white/80 text-sm capitalize">{trait.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Patterns */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4">Cognitive Patterns</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-white/80 text-sm font-medium mb-2">Processing Style</h5>
                <div className="bg-black/20 p-3 rounded-lg">
                  <span className="text-[#A8B5A0] capitalize">{personalityProfile.cognitivePatterns.processingStyle}</span>
                </div>
              </div>
              <div>
                <h5 className="text-white/80 text-sm font-medium mb-2">Communication Preference</h5>
                <div className="bg-black/20 p-3 rounded-lg">
                  <span className="text-[#8B9A7C] capitalize">{personalityProfile.cognitivePatterns.communicationPreference}</span>
                </div>
              </div>
              <div>
                <h5 className="text-white/80 text-sm font-medium mb-2">Challenge Approach</h5>
                <div className="bg-black/20 p-3 rounded-lg">
                  <span className="text-[#E5C97D] capitalize">{personalityProfile.cognitivePatterns.challengeApproach}</span>
                </div>
              </div>
              <div>
                <h5 className="text-white/80 text-sm font-medium mb-2">Motivation Drivers</h5>
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {personalityProfile.cognitivePatterns.motivationDrivers.map((driver, index) => (
                      <span key={index} className="bg-[#8B9A7C]/20 text-[#A8B5A0] px-2 py-1 rounded text-xs">
                        {driver}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Intelligence */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4">Emotional Intelligence Profile</h4>
            <div className="grid md:grid-cols-4 gap-4">
              {Object.entries(personalityProfile.emotionalIntelligence).map(([skill, value]) => (
                <div key={skill} className="text-center">
                  <div className="text-2xl text-[#8B9A7C] font-light mb-2">{value}</div>
                  <div className="text-white/70 text-sm capitalize">
                    {skill.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                    <div
                      className="h-full bg-[#8B9A7C] rounded-full transition-all duration-300"
                      style={{ width: `${value || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && predictiveModel && (
        <div className="space-y-6">
          <h3 className="text-white text-lg font-light">🔮 Predictive Analysis</h3>
          
          {/* Mood Forecast */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4">7-Day Mood Forecast</h4>
            <div className="flex items-end gap-2 h-32">
              {predictiveModel.predictions.moodForecast.slice(0, 7).map((forecast, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-[#8B9A7C] to-[#A8B5A0] rounded-t transition-all duration-300"
                    style={{ height: `${Math.max(0, Math.min(100, (forecast.predictedMood || 5) * 10))}%` }}
                  ></div>
                  <div className="text-white/60 text-xs mt-2">
                    {new Date(forecast.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className="text-white text-xs">{forecast.predictedMood.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#E5C97D]/10 border border-[#E5C97D]/30 rounded-2xl p-6">
              <h4 className="text-[#E5C97D] font-medium mb-4">Risk Factors</h4>
              <div className="space-y-3">
                {predictiveModel.riskFactors.slice(0, 3).map((risk, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">{risk.factor}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-[#E5C97D] rounded-full"
                          style={{ width: `${(risk.impact || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[#E5C97D] text-xs">{Math.round((risk.impact || 0) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#8B9A7C]/10 border border-[#8B9A7C]/30 rounded-2xl p-6">
              <h4 className="text-[#8B9A7C] font-medium mb-4">Protective Factors</h4>
              <div className="space-y-3">
                {predictiveModel.protectiveFactors.slice(0, 3).map((protective, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">{protective.factor}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-[#8B9A7C] rounded-full"
                          style={{ width: `${(protective.strength || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[#8B9A7C] text-xs">{Math.round((protective.strength || 0) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'themes' && thematicAnalysis && (
        <div className="space-y-6">
          <h3 className="text-white text-lg font-light">📊 Thematic Analysis</h3>
          
          {/* Dominant Themes */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4">Dominant Themes in Your Journey</h4>
            <div className="space-y-4">
              {thematicAnalysis.dominantThemes.slice(0, 5).map((theme, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/80">{theme.theme}</span>
                      <span className="text-white/60 text-sm">{theme.frequency} mentions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-[#8B9A7C] rounded-full"
                          style={{ width: `${thematicAnalysis.dominantThemes.length > 0 ? Math.min(100, Math.max(0, (theme.frequency / Math.max(...thematicAnalysis.dominantThemes.map(t => t.frequency || 1))) * 100)) : 0}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${theme.sentiment > 0 ? 'text-[#8B9A7C]' : theme.sentiment < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {theme.sentiment > 0 ? '📈' : theme.sentiment < 0 ? '📉' : '➡️'} {theme.evolution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Trajectory */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-4">Growth Trajectory</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">
                {thematicAnalysis.growthTrajectory.direction === 'ascending' ? '📈' :
                 thematicAnalysis.growthTrajectory.direction === 'descending' ? '📉' :
                 thematicAnalysis.growthTrajectory.direction === 'oscillating' ? '〰️' : '➡️'}
              </div>
              <div>
                <div className="text-white font-medium capitalize">{thematicAnalysis.growthTrajectory.direction} Trajectory</div>
                <div className="text-white/60 text-sm">
                  Growth velocity: {(thematicAnalysis.growthTrajectory.velocity * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {thematicAnalysis.growthTrajectory.inflectionPoints.length > 0 && (
              <div>
                <h5 className="text-white/80 text-sm font-medium mb-2">Key Inflection Points:</h5>
                <div className="space-y-2">
                  {thematicAnalysis.growthTrajectory.inflectionPoints.slice(0, 3).map((point, index) => (
                    <div key={index} className="bg-black/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">{point.event}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-xs">{new Date(point.date).toLocaleDateString()}</span>
                          <span className={`text-xs ${point.impact > 0 ? 'text-[#8B9A7C]' : 'text-red-400'}`}>
                            {point.impact > 0 ? '+' : ''}{(point.impact * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <h3 className="text-white text-lg font-light">🎯 AI-Generated Recommendations</h3>
          
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🎯</div>
              <h3 className="text-white text-lg font-light mb-2">Generating Recommendations</h3>
              <p className="text-white/50 text-sm">
                AI recommendations will appear after sufficient data analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-medium">{rec.title}</h4>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-white/60">{rec.category}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">{rec.timeCommitment}</span>
                        <span className="text-white/40">•</span>
                        <span className={`${rec.difficulty === 'easy' ? 'text-[#8B9A7C]' : rec.difficulty === 'moderate' ? 'text-[#E5C97D]' : 'text-red-400'}`}>
                          {rec.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i < rec.priority / 2 ? 'bg-[#E5C97D]' : 'bg-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/80 mb-3 leading-relaxed">{rec.description}</p>
                  
                  <div className="mb-3">
                    <h5 className="text-white/80 text-sm font-medium mb-1">Why This Recommendation:</h5>
                    <p className="text-white/60 text-sm">{rec.rationale}</p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-white/80 text-sm font-medium mb-1">Expected Outcome:</h5>
                    <p className="text-white/60 text-sm">{rec.expectedOutcome}</p>
                  </div>

                  {rec.successMetrics.length > 0 && (
                    <div>
                      <h5 className="text-white/80 text-sm font-medium mb-1">Success Indicators:</h5>
                      <ul className="space-y-1">
                        {rec.successMetrics.map((metric, idx) => (
                          <li key={idx} className="text-white/60 text-sm flex items-start gap-2">
                            <span className="text-[#8B9A7C] mt-1">•</span>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
