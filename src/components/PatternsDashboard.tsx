'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';

interface DashboardData {
  totalEntries: number;
  recentTrend: 'improving' | 'stable' | 'concerning';
  quickInsights: string[];
  topEmotions: Array<{ emotion: string; count: number }>;
  writingStreak: number;
  averageMood: number | null;
  needsAttention: boolean;
  lastEntryDate: Date | null;
}

export default function PatternsDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/patterns-dashboard?userId=${user.uid}`);
        const data = await response.json();

        if (data.success) {
          setDashboard(data.dashboard);
        }
      } catch (error) {
        console.error('Failed to fetch patterns dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.uid]);

  if (loading || !dashboard) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #e5e5e5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.2rem' }}>📊</span>
          <span style={{ color: '#666' }}>Loading your patterns...</span>
        </div>
      </div>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#a4b792';
      case 'concerning': return '#d4756b';
      default: return '#a4b792/60';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'concerning': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className={`rounded-2xl p-6 mb-8 shadow-sm transition-all duration-300 ${
      dashboard.needsAttention 
        ? 'bg-gradient-to-br from-red-50 to-red-25 border-2 border-[#d4756b]/40' 
        : 'bg-white border border-[#a4b792]/20'
    }`}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1.5rem'
      }}>
        <h3 className="m-0 text-[#2e2e2e] text-xl font-medium flex items-center gap-2">
          <span className="text-[#a4b792] text-2xl">📊</span> 
          <span className="text-[#a4b792]">Your Patterns at a Glance</span>
        </h3>

        {dashboard.needsAttention && (
          <div className="bg-[#d4756b] text-white px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wide">
            💙 Extra Care
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Writing Streak */}
        <div style={{ textAlign: 'center' }}>
          <div className={`text-2xl font-medium mb-1 ${
            dashboard.writingStreak >= 3 ? 'text-[#a4b792]' : 'text-[#a4b792]/60'
          }`}>
            {dashboard.writingStreak}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Day Streak
          </div>
        </div>

        {/* Total Entries */}
        <div style={{ textAlign: 'center' }}>
          <div className="text-2xl font-medium mb-1 text-[#a4b792]">
            {dashboard.totalEntries}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Total Entries
          </div>
        </div>

        {/* Average Mood */}
        {dashboard.averageMood !== null && (
          <div style={{ textAlign: 'center' }}>
            <div className={`text-2xl font-medium mb-1 ${
              dashboard.averageMood >= 6 ? 'text-[#a4b792]' : 
              dashboard.averageMood >= 4 ? 'text-[#a4b792]/70' : 'text-[#d4756b]'
            }`}>
              {dashboard.averageMood}/10
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Avg Mood
            </div>
          </div>
        )}

        {/* Recent Trend */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            color: getTrendColor(dashboard.recentTrend),
            marginBottom: '0.25rem'
          }}>
            {getTrendIcon(dashboard.recentTrend)}
          </div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: getTrendColor(dashboard.recentTrend),
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {dashboard.recentTrend}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {dashboard.quickInsights.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ 
            color: '#2e2e2e', 
            fontSize: '0.9rem',
            margin: '0 0 0.75rem 0',
            fontWeight: '600'
          }}>
            Quick Insights
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {dashboard.quickInsights.map((insight, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#2e2e2e',
                borderLeft: '3px solid #8ea876'
              }}>
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Emotions */}
      {dashboard.topEmotions.length > 0 && (
        <div>
          <h4 style={{ 
            color: '#2e2e2e', 
            fontSize: '0.9rem',
            margin: '0 0 0.75rem 0',
            fontWeight: '600'
          }}>
            Recent Emotional Themes
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {dashboard.topEmotions.slice(0, 6).map((emotion, index) => (
              <span key={index} style={{
                background: '#cb997e',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {emotion.emotion}
                <span style={{
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {emotion.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Support Message for High Risk */}
      {dashboard.needsAttention && (
        <div style={{
          background: '#fff',
          border: '2px solid #d4756b',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💙</div>
          <p style={{ 
            color: '#2e2e2e', 
            fontSize: '0.9rem',
            margin: '0 0 0.5rem 0',
            fontWeight: '500'
          }}>
            Your recent entries suggest you might benefit from extra support
          </p>
          <p style={{ 
            color: '#666', 
            fontSize: '0.8rem',
            margin: 0
          }}>
            Consider reaching out to a trusted friend, counselor, or mental health professional
          </p>
        </div>
      )}
    </div>
  );
}