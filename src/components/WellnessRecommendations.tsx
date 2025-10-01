'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';

interface WellnessRecommendation {
  id: string;
  type: 'crisis' | 'struggling' | 'managing' | 'thriving' | 'need_specific' | 'strength_building';
  category: string;
  title: string;
  description: string;
  actionSteps: string[];
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  confidence: number;
  personalizedReason: string;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'challenging';
  tags: string[];
}

interface WellnessProfile {
  currentState: 'thriving' | 'managing' | 'struggling' | 'crisis';
  primaryNeeds: string[];
  strengths: string[];
  preferences: {
    timeOfDay: string[];
    activityTypes: string[];
    supportStyle: string;
    copingMethods: string[];
  };
  recommendations: WellnessRecommendation[];
  lastUpdated: string;
}

export default function WellnessRecommendations() {
  const [wellnessProfile, setWellnessProfile] = useState<WellnessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchWellnessRecommendations = async (showRefreshing = false) => {
    if (!user?.uid) return;

    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await fetch(`/api/wellness-recommendations?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setWellnessProfile(data.profile);
        
        // Extract unique categories for filtering
        const categories = [...new Set(data.profile.recommendations.map((rec: WellnessRecommendation) => rec.category))] as string[];
        if (selectedCategories.length === 0) {
          setSelectedCategories(categories);
        }
      } else {
        setError(data.message || 'Failed to load wellness recommendations');
      }
    } catch (err: any) {
      console.error('Failed to fetch wellness recommendations:', err);
      setError('Unable to load your personalized recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWellnessRecommendations();
  }, [user?.uid]);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'thriving': return '#8ea876';
      case 'managing': return '#cb997e';
      case 'struggling': return '#d4756b';
      case 'crisis': return '#c33';
      default: return '#666';
    }
  };

  const getStateEmoji = (state: string) => {
    switch (state) {
      case 'thriving': return '🌟';
      case 'managing': return '🌱';
      case 'struggling': return '🤗';
      case 'crisis': return '🆘';
      default: return '💙';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'crisis': return '#c33';
      case 'high': return '#d4756b';
      case 'medium': return '#cb997e';
      case 'low': return '#8ea876';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Mental Health': '🧠',
      'Self-Care': '🌸',
      'Physical Wellness': '💪',
      'Social Connection': '🤝',
      'Professional Support': '👨‍⚕️',
      'Mindfulness': '🧘',
      'Creative Expression': '🎨',
      'Routine Building': '📅',
      'Stress Management': '😌',
      'Sleep & Rest': '💤',
      'Nutrition': '🥗',
      'Exercise': '🏃',
      'Learning': '📚',
      'Spirituality': '🕯️'
    };
    return icons[category] || '🌟';
  };

  const filteredRecommendations = wellnessProfile?.recommendations.filter(
    rec => selectedCategories.includes(rec.category)
  ) || [];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid #e5e5e5',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌟</div>
        <p style={{ color: '#666', margin: 0 }}>Analyzing your wellness needs...</p>
      </div>
    );
  }

  if (error || !wellnessProfile) {
    return (
      <div style={{
        background: '#fff5f5',
        borderRadius: '12px',
        padding: '2rem',
        border: '2px solid #d4756b',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️</div>
        <p style={{ color: '#d4756b', marginBottom: '1rem' }}>
          {error || 'Unable to load wellness recommendations'}
        </p>
        <button
          onClick={() => fetchWellnessRecommendations()}
          style={{
            background: '#d4756b',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const urgentRecommendations = filteredRecommendations.filter(rec => rec.urgency === 'high' || rec.urgency === 'crisis');
  const otherRecommendations = filteredRecommendations.filter(rec => rec.urgency === 'medium' || rec.urgency === 'low');

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Header with Current State */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e5e5e5',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            margin: 0,
            color: '#2e2e2e',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🌟 Your Wellness Journey
          </h3>
          <button
            onClick={() => fetchWellnessRecommendations(true)}
            disabled={refreshing}
            style={{
              background: refreshing ? '#ccc' : '#8ea876',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: refreshing ? 'not-allowed' : 'pointer'
            }}
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: getStateColor(wellnessProfile.currentState),
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {getStateEmoji(wellnessProfile.currentState)}
            Currently {wellnessProfile.currentState.charAt(0).toUpperCase() + wellnessProfile.currentState.slice(1)}
          </div>
          <span style={{ color: '#666', fontSize: '0.8rem' }}>
            Last updated: {new Date(wellnessProfile.lastUpdated).toLocaleDateString()}
          </span>
        </div>

        {wellnessProfile.primaryNeeds.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Primary Focus Areas:
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {wellnessProfile.primaryNeeds.map((need, index) => (
                <span key={index} style={{
                  background: '#f0f7ff',
                  color: '#2e2e2e',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  border: '1px solid #8ea876'
                }}>
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}

        {wellnessProfile.strengths.length > 0 && (
          <div>
            <h4 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Your Strengths:
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {wellnessProfile.strengths.slice(0, 4).map((strength, index) => (
                <span key={index} style={{
                  background: '#fff5f0',
                  color: '#cb997e',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  border: '1px solid #cb997e'
                }}>
                  💪 {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Filters */}
      {wellnessProfile.recommendations.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #e5e5e5',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#2e2e2e', fontSize: '1rem' }}>
            Filter by Category:
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[...new Set(wellnessProfile.recommendations.map(rec => rec.category))].map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                style={{
                  background: selectedCategories.includes(category) ? '#8ea876' : 'transparent',
                  color: selectedCategories.includes(category) ? 'white' : '#666',
                  border: `1px solid ${selectedCategories.includes(category) ? '#8ea876' : '#e5e5e5'}`,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {getCategoryIcon(category)} {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Recommendations */}
      {urgentRecommendations.length > 0 && (
        <div style={{
          background: '#fff5f5',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '2px solid #d4756b',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            color: '#d4756b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem'
          }}>
            ⚡ Priority Recommendations
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {urgentRecommendations.map((rec, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.25rem',
                border: '2px solid #d4756b'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <h4 style={{
                    margin: 0,
                    color: '#2e2e2e',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {getCategoryIcon(rec.category)} {rec.title}
                  </h4>
                  <div style={{
                    background: getUrgencyColor(rec.urgency),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {rec.urgency}
                  </div>
                </div>
                
                <p style={{
                  color: '#2e2e2e',
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  lineHeight: '1.4'
                }}>
                  {rec.description}
                </p>
                
                <div style={{
                  background: '#f0f7ff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.75rem'
                }}>
                  <p style={{
                    color: '#2e2e2e',
                    fontSize: '0.85rem',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    💡 {rec.personalizedReason}
                  </p>
                </div>
                
                {rec.actionSteps.length > 0 && (
                  <div>
                    <h5 style={{
                      color: '#666',
                      fontSize: '0.85rem',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Next Steps:
                    </h5>
                    <ul style={{
                      margin: '0 0 0 1rem',
                      padding: 0,
                      color: '#2e2e2e',
                      fontSize: '0.85rem'
                    }}>
                      {rec.actionSteps.slice(0, 3).map((step, stepIndex) => (
                        <li key={stepIndex} style={{ marginBottom: '0.25rem' }}>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#666'
                }}>
                  {rec.estimatedTime && (
                    <span>⏱️ {rec.estimatedTime}</span>
                  )}
                  {rec.difficulty && (
                    <span>📊 {rec.difficulty}</span>
                  )}
                  <span>🎯 {Math.round(rec.confidence * 100)}% match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Recommendations */}
      {otherRecommendations.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e5e5'
        }}>
          <h3 style={{
            color: '#2e2e2e',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.1rem'
          }}>
            🌱 Personalized Wellness Suggestions
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {otherRecommendations.map((rec, index) => (
              <div key={index} style={{
                background: '#fafafa',
                borderRadius: '8px',
                padding: '1.25rem',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <h4 style={{
                    margin: 0,
                    color: '#2e2e2e',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {getCategoryIcon(rec.category)} {rec.title}
                  </h4>
                  <span style={{
                    color: '#666',
                    fontSize: '0.8rem',
                    background: '#e5e5e5',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {rec.category}
                  </span>
                </div>
                
                <p style={{
                  color: '#2e2e2e',
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                  lineHeight: '1.4'
                }}>
                  {rec.description}
                </p>
                
                <div style={{
                  background: '#f0f7ff',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.75rem'
                }}>
                  <p style={{
                    color: '#2e2e2e',
                    fontSize: '0.85rem',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    💡 {rec.personalizedReason}
                  </p>
                </div>
                
                {rec.actionSteps.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <h5 style={{
                      color: '#666',
                      fontSize: '0.85rem',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      How to get started:
                    </h5>
                    <ul style={{
                      margin: '0 0 0 1rem',
                      padding: 0,
                      color: '#2e2e2e',
                      fontSize: '0.85rem'
                    }}>
                      {rec.actionSteps.slice(0, 2).map((step, stepIndex) => (
                        <li key={stepIndex} style={{ marginBottom: '0.25rem' }}>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: '#666'
                }}>
                  {rec.estimatedTime && (
                    <span>⏱️ {rec.estimatedTime}</span>
                  )}
                  {rec.difficulty && (
                    <span>📊 {rec.difficulty}</span>
                  )}
                  <span>🎯 {Math.round(rec.confidence * 100)}% match</span>
                </div>
                
                {rec.tags.length > 0 && (
                  <div style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    gap: '0.25rem',
                    flexWrap: 'wrap'
                  }}>
                    {rec.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} style={{
                        background: '#8ea876',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '0.7rem'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredRecommendations.length === 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid #e5e5e5',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌟</div>
          <p style={{ color: '#666', margin: 0 }}>
            No recommendations match your selected categories. Try adjusting your filters above.
          </p>
        </div>
      )}
    </div>
  );
}