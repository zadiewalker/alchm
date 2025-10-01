'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { JournalEntry } from '@/lib/useJournals';

interface InsightData {
  emotionalTrends: {
    averageMood: number;
    moodTrend: 'improving' | 'declining' | 'stable';
    commonEmotions: string[];
  };
  patterns: {
    writingFrequency: string;
    commonThemes: string[];
    triggerWords: string[];
    strengthPatterns: string[];
  };
  wellness: {
    riskLevel: 'low' | 'moderate' | 'high';
    protectiveFactors: string[];
    recommendations: string[];
  };
}

interface AIInsightsDashboardProps {
  entries: JournalEntry[];
}

export default function AIInsightsDashboard({ entries }: AIInsightsDashboardProps) {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const { user } = useAuth();

  const generateInsights = async () => {
    if (!user?.uid || entries.length === 0) return;

    setLoading(true);
    try {
      // Filter entries based on timeframe
      const now = new Date();
      const timeframeMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      };

      const filteredEntries = entries.filter(entry => 
        now.getTime() - entry.createdAt.getTime() <= timeframeMs[selectedTimeframe]
      );

      if (filteredEntries.length === 0) {
        setInsights(null);
        return;
      }

      // Calculate emotional trends
      const moodsOnly = filteredEntries
        .map(entry => entry.mood)
        .filter((mood): mood is number => typeof mood === 'number');

      const averageMood = moodsOnly.length > 0 
        ? moodsOnly.reduce((sum, mood) => sum + mood, 0) / moodsOnly.length 
        : 5;

      // Determine trend
      let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (moodsOnly.length >= 3) {
        const firstHalf = moodsOnly.slice(0, Math.floor(moodsOnly.length / 2));
        const secondHalf = moodsOnly.slice(Math.floor(moodsOnly.length / 2));
        const firstAvg = firstHalf.reduce((sum, mood) => sum + mood, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, mood) => sum + mood, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 0.5) moodTrend = 'improving';
        else if (secondAvg < firstAvg - 0.5) moodTrend = 'declining';
      }

      // Extract common themes and patterns
      const allContent = filteredEntries.map(entry => entry.content.toLowerCase()).join(' ');
      const allTags = filteredEntries.flatMap(entry => entry.tags || []);
      const allCategories = filteredEntries.map(entry => entry.category).filter(Boolean);

      // Simple keyword analysis for common emotions
      const emotionWords = {
        happy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic'],
        sad: ['sad', 'down', 'depressed', 'upset', 'disappointed', 'lonely'],
        anxious: ['anxious', 'worry', 'stressed', 'nervous', 'overwhelmed', 'panic'],
        angry: ['angry', 'frustrated', 'annoyed', 'mad', 'irritated', 'furious'],
        grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'lucky'],
        hopeful: ['hope', 'optimistic', 'confident', 'positive', 'motivated']
      };

      const commonEmotions = Object.entries(emotionWords)
        .filter(([emotion, words]) => 
          words.some(word => allContent.includes(word))
        )
        .map(([emotion]) => emotion)
        .slice(0, 5);

      // Get most frequent tags and categories
      const tagCounts: { [key: string]: number } = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      const categoryCounts: { [key: string]: number } = {};
      allCategories.forEach(cat => {
        if (cat) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });

      const commonThemes = [
        ...Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([tag]) => tag),
        ...Object.entries(categoryCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 2)
          .map(([cat]) => cat)
      ].slice(0, 5);

      // Determine writing frequency
      const entriesPerDay = filteredEntries.length / (timeframeMs[selectedTimeframe] / (24 * 60 * 60 * 1000));
      let writingFrequency = 'Infrequent';
      if (entriesPerDay >= 1) writingFrequency = 'Daily';
      else if (entriesPerDay >= 0.5) writingFrequency = 'Regular';
      else if (entriesPerDay >= 0.2) writingFrequency = 'Weekly';

      // Assess wellness risk based on mood trends and keywords
      let riskLevel: 'low' | 'moderate' | 'high' = 'low';
      const riskWords = ['crisis', 'hopeless', 'suicidal', 'harm', 'end', 'give up'];
      const hasRiskWords = riskWords.some(word => allContent.includes(word));
      
      if (hasRiskWords || averageMood < 3) riskLevel = 'high';
      else if (moodTrend === 'declining' || averageMood < 5) riskLevel = 'moderate';

      // Generate protective factors and recommendations
      const protectiveFactors = [
        ...(entriesPerDay > 0.3 ? ['Regular journaling practice'] : []),
        ...(averageMood > 6 ? ['Generally positive mood'] : []),
        ...(commonEmotions.includes('grateful') ? ['Gratitude practice'] : []),
        ...(allCategories.includes('Health') ? ['Health awareness'] : []),
        ...(allCategories.includes('Relationships') ? ['Social connections'] : [])
      ].slice(0, 4);

      const recommendations = [
        ...(moodTrend === 'declining' ? ['Consider additional support resources'] : []),
        ...(entriesPerDay < 0.2 ? ['Try writing more frequently for better insights'] : []),
        ...(riskLevel === 'moderate' ? ['Focus on self-care activities'] : []),
        ...(commonEmotions.includes('anxious') ? ['Practice mindfulness and breathing exercises'] : []),
        'Continue your journaling practice - it\'s helping!'
      ].slice(0, 3);

      setInsights({
        emotionalTrends: {
          averageMood: Math.round(averageMood * 10) / 10,
          moodTrend,
          commonEmotions
        },
        patterns: {
          writingFrequency,
          commonThemes,
          triggerWords: [], // Could be enhanced with more sophisticated analysis
          strengthPatterns: protectiveFactors
        },
        wellness: {
          riskLevel,
          protectiveFactors,
          recommendations
        }
      });
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [entries, selectedTimeframe, user]);

  if (!insights && !loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid #e5e5e5',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
        <h3 style={{ color: '#2e2e2e', marginBottom: '1rem' }}>AI Insights</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Write a few more journal entries to unlock personalized AI insights about your emotional patterns and wellbeing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#a4b792]/20 rounded-2xl p-8 mb-8 shadow-sm">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 className="text-[#2e2e2e] m-0 flex items-center gap-2 text-xl font-medium">
          <span className="text-[#a4b792] text-2xl">✨</span> 
          <span className="text-[#a4b792]">Personalized Insights</span>
        </h3>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d')}
          className="px-4 py-2 border border-[#a4b792]/30 rounded-lg text-sm bg-white text-[#2e2e2e] focus:ring-2 focus:ring-[#a4b792]/20 focus:border-[#a4b792] transition-colors"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
          <p>Analyzing your journal patterns...</p>
        </div>
      ) : insights && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Emotional Trends */}
          <div className="bg-gradient-to-br from-[#a4b792]/5 to-[#a4b792]/10 p-6 rounded-xl border border-[#a4b792]/20">
            <h4 style={{ 
              color: '#2e2e2e', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📈 Emotional Trends
            </h4>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Average Mood</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e2e2e' }}>
                    {insights.emotionalTrends.averageMood}/10
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    insights.emotionalTrends.moodTrend === 'improving' ? 'bg-[#a4b792]' : 
                    insights.emotionalTrends.moodTrend === 'declining' ? 'bg-[#d4756b]' : 'bg-[#a4b792]/60'
                  }`}>
                    {insights.emotionalTrends.moodTrend === 'improving' ? '↗️ Improving' :
                     insights.emotionalTrends.moodTrend === 'declining' ? '↘️ Declining' : '→ Stable'}
                  </span>
                </div>
              </div>
              
              {insights.emotionalTrends.commonEmotions.length > 0 && (
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Common Emotions</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {insights.emotionalTrends.commonEmotions.map(emotion => (
                      <span key={emotion} style={{
                        background: '#cb997e',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        textTransform: 'capitalize'
                      }}>
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Writing Patterns */}
          <div style={{
            background: '#fef3f3',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #cb997e'
          }}>
            <h4 style={{ 
              color: '#2e2e2e', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📝 Writing Patterns
            </h4>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Writing Frequency</p>
                <p style={{ fontWeight: 'bold', color: '#2e2e2e', margin: 0 }}>
                  {insights.patterns.writingFrequency}
                </p>
              </div>
              
              {insights.patterns.commonThemes.length > 0 && (
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Common Themes</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {insights.patterns.commonThemes.map(theme => (
                      <span key={theme} style={{
                        background: '#8ea876',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wellness Overview */}
          <div style={{
            background: insights.wellness.riskLevel === 'high' ? '#fee2e2' :
                       insights.wellness.riskLevel === 'moderate' ? '#fef3c7' : '#dcfce7',
            padding: '1.5rem',
            borderRadius: '8px',
            border: `1px solid ${insights.wellness.riskLevel === 'high' ? '#ef4444' :
                                insights.wellness.riskLevel === 'moderate' ? '#f59e0b' : '#10b981'}`
          }}>
            <h4 style={{ 
              color: '#2e2e2e', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🌟 Wellness Overview
            </h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Current Status</p>
                <span style={{
                  background: insights.wellness.riskLevel === 'high' ? '#ef4444' :
                             insights.wellness.riskLevel === 'moderate' ? '#f59e0b' : '#10b981',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {insights.wellness.riskLevel === 'low' ? '✅ Doing Well' :
                   insights.wellness.riskLevel === 'moderate' ? '⚠️ Moderate Support Needed' : '🚨 High Support Recommended'}
                </span>
              </div>

              {insights.wellness.protectiveFactors.length > 0 && (
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Your Strengths</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {insights.wellness.protectiveFactors.map((factor, index) => (
                      <li key={index} style={{ color: '#2e2e2e', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {insights.wellness.recommendations.length > 0 && (
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Personalized Recommendations</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {insights.wellness.recommendations.map((rec, index) => (
                      <li key={index} style={{ color: '#2e2e2e', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}