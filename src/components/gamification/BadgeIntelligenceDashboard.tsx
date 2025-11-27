'use client';

/**
 * BADGE INTELLIGENCE DASHBOARD
 * "Analytics that honor healing, not engagement that exploits"
 * 
 * This dashboard showcases the revolutionary badge intelligence system:
 * - Real-time badge effectiveness analysis
 * - Personalized achievement recommendations
 * - Trauma-informed A/B testing results
 * - Anti-shame badge experiences
 * - Grace token integration
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadgeIntelligence, usePersonalizedRecommendations, useBadgeAnalytics, useAntiShameBadges } from '@/hooks/useBadgeIntelligence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BadgeIntelligenceDashboard() {
  const { state, actions } = useBadgeIntelligence();
  const { recommendations, generate, accept, defer, loading: recLoading } = usePersonalizedRecommendations();
  const { badgeEffectiveness, analyzeBadge, loading: analyticsLoading } = useBadgeAnalytics();
  const { generateExperience, integrateGrace, currentContext, updateContext, reportWellbeing } = useAntiShameBadges();
  
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  
  useEffect(() => {
    // Generate initial recommendations
    if (recommendations.length === 0 && !recLoading) {
      generate();
    }
  }, [recommendations, recLoading, generate]);
  
  const handleAcceptRecommendation = async (recommendationId: string) => {
    try {
      const result = await accept(recommendationId);
      const experience = await generateExperience(recommendationId);
      const graceIntegration = await integrateGrace(recommendationId);
      
      setCelebrationData({
        ...result,
        ...experience,
        ...graceIntegration
      });
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };
  
  const handleAnalyzeBadge = async (badgeId: string) => {
    try {
      await analyzeBadge(badgeId);
      setSelectedBadge(badgeId);
    } catch (error) {
      console.error('Error analyzing badge:', error);
    }
  };
  
  const handleWellbeingReport = async (metric: string, value: number) => {
    try {
      await reportWellbeing({ metric, value, context: 'dashboard_interaction' });
      updateContext({ [metric.replace('_', '') + 'Level']: value });
    } catch (error) {
      console.error('Error reporting wellbeing:', error);
    }
  };
  
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-sage-50 to-earth-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-medium text-sage-900">Badge Intelligence Dashboard</h1>
        <p className="text-sage-700 max-w-2xl mx-auto">
          Analytics that serve your healing journey. Every metric honors your growth, every recommendation supports your authentic self.
        </p>
      </div>
      
      {/* Current Context Panel */}
      <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sage-800 flex items-center gap-2">
            🧠 Current Context Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-sage-600">Stress Level</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={currentContext.stressLevel}
                  onChange={(e) => handleWellbeingReport('stress_level', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-sage-700 w-6">{currentContext.stressLevel}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-sage-600">Energy Level</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={currentContext.energyLevel}
                  onChange={(e) => handleWellbeingReport('energy_level', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-sage-700 w-6">{currentContext.energyLevel}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-sage-600">Available Time</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  value={currentContext.availableTime}
                  onChange={(e) => updateContext({ availableTime: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-sage-700 w-8">{currentContext.availableTime}m</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-sage-600">Current Mood</label>
              <select 
                value={currentContext.currentMood}
                onChange={(e) => updateContext({ currentMood: e.target.value })}
                className="w-full p-2 rounded border border-sage-200 bg-white"
              >
                <option value="peaceful">Peaceful</option>
                <option value="neutral">Neutral</option>
                <option value="processing">Processing</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="energized">Energized</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-sage-600">Grace Support</label>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={currentContext.recentGraceTokenUse}
                  onChange={(e) => updateContext({ recentGraceTokenUse: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-sage-700">Recent use</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Personalized Recommendations */}
      <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sage-800 flex items-center gap-2">
            ✨ Personalized Achievement Recommendations
          </CardTitle>
          <p className="text-sage-600 text-sm">
            Achievements tailored to your unique healing journey and current context
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full mx-auto mb-4"></div>
                <p className="text-sage-600">Analyzing your healing patterns...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="text-4xl">🌱</div>
                <p className="text-sage-600">No recommendations ready yet.</p>
                <Button onClick={() => generate()} className="bg-sage-600 hover:bg-sage-700 text-white">
                  Generate Recommendations
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.achievementId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-sage-200 rounded-lg p-4 bg-white"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sage-800">{rec.personalizedTitle}</h4>
                          <p className="text-sm text-sage-600 capitalize">Category: {rec.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-sage-700">
                            Relevance: {rec.relevanceScore}%
                          </div>
                          <div className="text-xs text-sage-500">
                            {rec.timingRecommendation.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sage-700">{rec.personalizedDescription}</p>
                      
                      <div className="bg-sage-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-sage-800 mb-1">Therapeutic Value</h5>
                        <p className="text-sm text-sage-600">{rec.therapeuticValue}</p>
                      </div>
                      
                      <div className="bg-sage-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-sage-800 mb-1">Personal Rationale</h5>
                        <p className="text-sm text-sage-600">{rec.personalizedRationale}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-sage-800">Timeline</h5>
                          <p className="text-sm text-sage-600">{rec.timeline.suggested}</p>
                          {rec.timeline.flexible && (
                            <p className="text-xs text-sage-500">Flexible timing available</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-sage-800">Difficulty</h5>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < rec.difficultyLevel.personalizedLevel
                                      ? 'bg-sage-400'
                                      : 'bg-sage-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-sage-500">
                              {rec.difficultyLevel.personalizedLevel}/10
                            </span>
                          </div>
                          <p className="text-xs text-sage-500">{rec.difficultyLevel.adaptationReason}</p>
                        </div>
                      </div>
                      
                      <div className="bg-earth-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-sage-800 mb-2">Support Offered</h5>
                        <div className="space-y-1">
                          <p className="text-xs text-sage-600">
                            🤲 {rec.supportOffered.graceTokenIntegration}
                          </p>
                          <p className="text-xs text-sage-600">
                            🛡️ {rec.supportOffered.shameInterruption.join(', ')}
                          </p>
                          <p className="text-xs text-sage-600">
                            🎉 Celebration style: {rec.supportOffered.celebrationStyle.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptRecommendation(rec.achievementId)}
                          className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
                        >
                          Accept Achievement
                        </Button>
                        <Button
                          onClick={() => defer(rec.achievementId, 'not_ready_now')}
                          variant="outline"
                          className="border-sage-300 text-sage-700 hover:bg-sage-50"
                        >
                          Maybe Later
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Badge Effectiveness Analytics */}
      <Card className="border-sage-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sage-800 flex items-center gap-2">
            📊 Badge Effectiveness Intelligence
          </CardTitle>
          <p className="text-sage-600 text-sm">
            Therapeutic value analysis for each badge type
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['presence_1', 'insight_1', 'resilience_1'].map(badgeId => (
                <Button
                  key={badgeId}
                  onClick={() => handleAnalyzeBadge(badgeId)}
                  variant={selectedBadge === badgeId ? 'default' : 'outline'}
                  className={selectedBadge === badgeId ? 'bg-sage-600 text-white' : 'border-sage-300 text-sage-700'}
                >
                  {badgeId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
            
            {analyticsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full mx-auto mb-4"></div>
                <p className="text-sage-600">Analyzing therapeutic effectiveness...</p>
              </div>
            ) : selectedBadge && badgeEffectiveness[selectedBadge] ? (
              <div className="space-y-6">
                {(() => {
                  const effectiveness = badgeEffectiveness[selectedBadge];
                  return (
                    <>
                      {/* Therapeutic Value Metrics */}
                      <div className="bg-sage-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sage-800 mb-3">Therapeutic Value Analysis</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-medium text-sage-700">
                              {effectiveness.therapeuticValue.completionSatisfaction}%
                            </div>
                            <div className="text-sm text-sage-600">Completion Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-medium text-sage-700">
                              {effectiveness.therapeuticValue.postCompletionBehavior.increasedSelfCompassion}%
                            </div>
                            <div className="text-sm text-sage-600">Self-Compassion Increase</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-medium text-sage-700">
                              {effectiveness.therapeuticValue.postCompletionBehavior.sustainedJournalingPractice}%
                            </div>
                            <div className="text-sm text-sage-600">Sustained Practice</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-medium text-sage-700">
                              +{effectiveness.therapeuticValue.healingMomentumChange}%
                            </div>
                            <div className="text-sm text-sage-600">Healing Momentum</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trauma-Informed Impact */}
                      <div className="bg-earth-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sage-800 mb-3">Trauma-Informed Safety Analysis</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className={`text-2xl font-medium ${
                              effectiveness.traumaInformedImpact.anxietyTriggerRate < 10 ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {effectiveness.traumaInformedImpact.anxietyTriggerRate}%
                            </div>
                            <div className="text-sm text-sage-600">Anxiety Triggers</div>
                            <div className="text-xs text-sage-500">(Lower is better)</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-medium ${
                              effectiveness.traumaInformedImpact.shameActivation < 5 ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {effectiveness.traumaInformedImpact.shameActivation}%
                            </div>
                            <div className="text-sm text-sage-600">Shame Activation</div>
                            <div className="text-xs text-sage-500">(Lower is better)</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-medium ${
                              effectiveness.traumaInformedImpact.perfectionismIncrease < 10 ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {effectiveness.traumaInformedImpact.perfectionismIncrease}%
                            </div>
                            <div className="text-sm text-sage-600">Perfectionism Risk</div>
                            <div className="text-xs text-sage-500">(Lower is better)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-medium text-sage-700">
                              {effectiveness.traumaInformedImpact.graceTokenUsageAfter}%
                            </div>
                            <div className="text-sm text-sage-600">Grace Token Use</div>
                            <div className="text-xs text-sage-500">(Self-compassion)</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quality Indicators */}
                      <div className="bg-white p-4 rounded-lg border border-sage-200">
                        <h4 className="font-medium text-sage-800 mb-3">Quality & Sustainability Metrics</h4>
                        <div className="space-y-3">
                          {Object.entries(effectiveness.qualityIndicators).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <div className="w-32 text-sm text-sage-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </div>
                              <div className="flex-1 bg-sage-100 rounded-full h-2">
                                <div 
                                  className="bg-sage-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                              <div className="w-12 text-sm text-sage-700 text-right">{value}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Concern Signals */}
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-3">Concern Signal Monitoring</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(effectiveness.concernSignals).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className={`text-lg font-medium ${
                                value < 15 ? 'text-green-600' : value < 25 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {value}%
                              </div>
                              <div className="text-sm text-amber-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-600 mt-3">
                          Low values indicate healthier engagement patterns
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8 text-sage-600">
                Select a badge to view its therapeutic effectiveness analysis
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Celebration Experience */}
      <AnimatePresence>
        {celebrationData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setCelebrationData(null)}
          >
            <Card className="max-w-lg w-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="text-sage-800 text-center">🎉 Achievement Celebration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="text-lg text-sage-700">
                  {celebrationData.celebrationMessage}
                </div>
                
                <div className="bg-sage-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sage-800 mb-2">Identity Affirmation</h4>
                  <p className="text-sage-700">{celebrationData.identityAffirmation}</p>
                </div>
                
                <div className="bg-earth-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sage-800 mb-2">Next Steps (No Pressure)</h4>
                  <p className="text-sage-700">{celebrationData.nextStepGuidance}</p>
                </div>
                
                {celebrationData.graceEnhanced && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Grace-Enhanced Experience</h4>
                    <p className="text-blue-700">{celebrationData.supportMessage}</p>
                    <div className="mt-2 space-y-1">
                      {celebrationData.adaptations.map((adaptation: string, index: number) => (
                        <p key={index} className="text-xs text-blue-600">• {adaptation}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={() => setCelebrationData(null)}
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white"
                >
                  Continue Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* System Status */}
      <div className="text-center text-sm text-sage-500 space-y-1">
        <p>Badge Intelligence System Active</p>
        <p>Therapeutic Goals: {state.healingPatterns ? '✓' : '⏳'} | Personal Profile: {state.personalGrowthProfile ? '✓' : '⏳'} | Anti-Shame Protection: ✓</p>
        <p className="italic">All metrics serve your healing journey, never exploit it.</p>
      </div>
    </div>
  );
}