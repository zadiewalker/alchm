'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';

interface EmotionalPattern {
  patternType: 'mood_cycle' | 'trigger_response' | 'coping_success' | 'growth_trend' | 'risk_escalation';
  description: string;
  confidence: number;
  timeframe: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  triggerEvents: string[];
  emotionalTags: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  strengthsIdentified: string[];
  lastOccurrence: Date;
}

interface PatternAnalysisResult {
  userId: string;
  analysisDate: Date;
  overallEmotionalTrend: 'improving' | 'stable' | 'concerning' | 'mixed';
  emotionalPatterns: EmotionalPattern[];
  keyInsights: string[];
  personalizedRecommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    protectiveElements: string[];
  };
  strengthsProfile: string[];
  nextAnalysisRecommended: Date;
}

export default function EmotionalPatternsDisplay() {
  const [patterns, setPatterns] = useState<PatternAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPatterns, setShowPatterns] = useState(false);
  const { user } = useAuth();

  const analyzePatterns = async (dateRange: number = 30) => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/emotional-patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          analysisDepth: 'comprehensive',
          dateRange
        })
      });

      const data = await response.json();

      if (data.success) {
        setPatterns(data.patterns);
        setShowPatterns(true);
      } else {
        throw new Error(data.message || 'Failed to analyze patterns');
      }
    } catch (err: any) {
      console.error('Failed to analyze emotional patterns:', err);
      setError('Unable to analyze patterns right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'mood_cycle': return '🔄';
      case 'trigger_response': return '⚡';
      case 'coping_success': return '💪';
      case 'growth_trend': return '📈';
      case 'risk_escalation': return '⚠️';
      default: return '🔍';
    }
  };

  const getPatternTypeLabel = (type: string) => {
    switch (type) {
      case 'mood_cycle': return 'Mood Cycles';
      case 'trigger_response': return 'Trigger Response';
      case 'coping_success': return 'Coping Success';
      case 'growth_trend': return 'Growth Trend';
      case 'risk_escalation': return 'Risk Pattern';
      default: return 'Pattern';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#8ea876';
      case 'medium': return '#cb997e';
      case 'high': return '#d4756b';
      case 'critical': return '#c33';
      default: return '#666';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#8ea876';
      case 'stable': return '#cb997e';
      case 'concerning': return '#d4756b';
      case 'mixed': return '#a4b792';
      default: return '#666';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'concerning': return '📉';
      case 'mixed': return '🌊';
      default: return '📊';
    }
  };

  if (!showPatterns) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ 
          color: '#2e2e2e', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🧠</span> Emotional Pattern Analysis
        </h3>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid #e5e5e5'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h4 style={{ marginBottom: '1rem', color: '#2e2e2e' }}>Discover Your Emotional Patterns</h4>
          <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Uncover meaningful patterns in your emotional journey. Understand your triggers, celebrate your strengths, and get personalized insights to support your growth.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => analyzePatterns(14)}
              disabled={loading}
              style={{
                background: '#8ea876',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Last 2 Weeks'}
            </button>
            
            <button
              onClick={() => analyzePatterns(30)}
              disabled={loading}
              style={{
                background: '#cb997e',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {loading ? '⏳ Analyzing...' : '📅 Last Month'}
            </button>
            
            <button
              onClick={() => analyzePatterns(90)}
              disabled={loading}
              style={{
                background: '#a4b792',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {loading ? '⏳ Analyzing...' : '📈 Last 3 Months'}
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!patterns) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ 
          color: '#2e2e2e', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🧠</span> Your Emotional Patterns
        </h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowPatterns(false)}
            style={{
              background: '#e5e5e5',
              color: '#666',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            ← Back
          </button>
          
          <button
            onClick={() => analyzePatterns(30)}
            disabled={loading}
            style={{
              background: '#cb997e',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontSize: '0.8rem'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Overall Trend */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: `2px solid ${getTrendColor(patterns.overallEmotionalTrend)}`
      }}>
        <h4 style={{ 
          color: '#2e2e2e', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>{getTrendIcon(patterns.overallEmotionalTrend)}</span> 
          Overall Emotional Trend: {patterns.overallEmotionalTrend.charAt(0).toUpperCase() + patterns.overallEmotionalTrend.slice(1)}
        </h4>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Key Insights */}
          {patterns.keyInsights.length > 0 && (
            <div>
              <h5 style={{ color: '#8ea876', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                💡 Key Insights
              </h5>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {patterns.keyInsights.map((insight, index) => (
                  <li key={index} style={{ color: '#2e2e2e', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths Profile */}
          {patterns.strengthsProfile.length > 0 && (
            <div>
              <h5 style={{ color: '#8ea876', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                🌟 Your Strengths
              </h5>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {patterns.strengthsProfile.map((strength, index) => (
                  <span key={index} style={{
                    background: '#f0f7ff',
                    color: '#8ea876',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    border: '1px solid #8ea876'
                  }}>
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      {patterns.riskAssessment.level !== 'low' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: `2px solid ${getRiskLevelColor(patterns.riskAssessment.level)}`
        }}>
          <h4 style={{ 
            color: getRiskLevelColor(patterns.riskAssessment.level), 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🛡️</span> Support & Care Assessment
          </h4>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {patterns.riskAssessment.factors.length > 0 && (
              <div>
                <h5 style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Areas needing attention:
                </h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {patterns.riskAssessment.factors.map((factor, index) => (
                    <li key={index} style={{ color: '#2e2e2e', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {patterns.riskAssessment.protectiveElements.length > 0 && (
              <div>
                <h5 style={{ color: '#8ea876', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Protective factors working for you:
                </h5>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {patterns.riskAssessment.protectiveElements.map((element, index) => (
                    <li key={index} style={{ color: '#2e2e2e', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      {element}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Individual Patterns */}
      {patterns.emotionalPatterns.length > 0 && (
        <div>
          <h4 style={{ 
            color: '#2e2e2e', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🔍</span> Detailed Patterns Discovered
          </h4>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {patterns.emotionalPatterns.map((pattern, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid #e5e5e5',
                boxShadow: '0 1px 3px rgba(46, 46, 46, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h5 style={{ 
                    margin: 0,
                    color: '#2e2e2e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    <span>{getPatternTypeIcon(pattern.patternType)}</span>
                    {getPatternTypeLabel(pattern.patternType)}
                  </h5>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                      background: getRiskLevelColor(pattern.riskLevel),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {pattern.riskLevel}
                    </span>
                    
                    <span style={{
                      background: '#f0f7ff',
                      color: '#666',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem'
                    }}>
                      {Math.round(pattern.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>

                <p style={{ 
                  color: '#2e2e2e', 
                  marginBottom: '1rem',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  {pattern.description}
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Emotional Tags */}
                  {pattern.emotionalTags.length > 0 && (
                    <div>
                      <h6 style={{ 
                        color: '#666', 
                        marginBottom: '0.25rem', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        Themes
                      </h6>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {pattern.emotionalTags.map((tag, tagIndex) => (
                          <span key={tagIndex} style={{
                            background: '#cb997e',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {pattern.recommendations.length > 0 && (
                    <div>
                      <h6 style={{ 
                        color: '#8ea876', 
                        marginBottom: '0.25rem', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        Recommendations
                      </h6>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {pattern.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} style={{ 
                            color: '#2e2e2e', 
                            marginBottom: '0.25rem',
                            fontSize: '0.85rem'
                          }}>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {pattern.strengthsIdentified.length > 0 && (
                    <div>
                      <h6 style={{ 
                        color: '#8ea876', 
                        marginBottom: '0.25rem', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        Strengths Identified
                      </h6>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {pattern.strengthsIdentified.map((strength, strengthIndex) => (
                          <li key={strengthIndex} style={{ 
                            color: '#8ea876', 
                            marginBottom: '0.25rem',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      {patterns.personalizedRecommendations.length > 0 && (
        <div style={{
          background: '#f0f7ff',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '1.5rem',
          border: '2px solid #8ea876'
        }}>
          <h4 style={{ 
            color: '#2e2e2e', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>💡</span> Personalized Action Plan
          </h4>
          
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {patterns.personalizedRecommendations.map((recommendation, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                color: '#2e2e2e'
              }}>
                <span style={{ marginRight: '0.5rem' }}>•</span>
                {recommendation}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}