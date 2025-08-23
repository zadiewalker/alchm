// Main Dashboard - Personalized user experience with tier-based features
// Central hub for journaling, insights, and wellness tracking

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Heart, 
  Target, 
  Zap,
  Book,
  Users,
  Crown,
  Sparkles,
  BarChart3,
  MessageCircle,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { UserProfile, JournalEntry, EngagementMetrics } from '@/types/firestore-schema';
import { useJournals } from '@/lib/useJournals';
import JournalEntryComponent from './JournalEntry';
import { TierFeatureGate, TierBadge } from './TierFeatureGate';

interface DashboardProps {
  user: UserProfile;
}

export default function Dashboard({ user }: DashboardProps) {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'entries' | 'insights' | 'patterns'>('overview');
  
  const { getRecentEntries, getEngagementMetrics } = useJournals();

  useEffect(() => {
    loadDashboardData();
  }, [user.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [entries, metrics] = await Promise.all([
        getRecentEntries(user.id, 10),
        getEngagementMetrics(user.id)
      ]);
      
      setRecentEntries(entries);
      setEngagementMetrics(metrics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user.displayName?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  const getStreakMotivation = () => {
    if (user.currentStreak === 0) return "Ready to start your journey?";
    if (user.currentStreak === 1) return "Great start! Keep the momentum going.";
    if (user.currentStreak < 7) return `${user.currentStreak} days strong! Building a powerful habit.`;
    if (user.currentStreak < 30) return `Amazing ${user.currentStreak}-day streak! You're developing deep self-awareness.`;
    return `Incredible ${user.currentStreak}-day journey! Your commitment to growth is inspiring.`;
  };

  const getTierColor = () => {
    switch (user.tier) {
      case 'oracle': return 'from-gold-600 to-amber-600';
      case 'deep-cut': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  const getUpgradePrompt = () => {
    if (user.tier === 'oracle') return null;
    
    const benefits = user.tier === 'free' 
      ? ['Unlimited storage', 'Advanced insights', 'Pattern analysis', 'Auto-save']
      : ['AI Mentor sessions', 'Executive coaching', 'Inner circle sharing', 'Priority support'];
    
    const targetTier = user.tier === 'free' ? 'Deep Cut' : 'Oracle';
    const price = user.tier === 'free' ? '$7.99/mo' : '$14.99/mo';
    
    return (
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-2">
                Unlock {targetTier} Features
              </h3>
              <div className="grid grid-cols-2 gap-1 mb-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Starting at {price} • Cancel anytime
              </p>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showNewEntry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <JournalEntryComponent 
          user={user}
          onSave={(entry) => {
            setRecentEntries([entry, ...recentEntries]);
            setShowNewEntry(false);
          }}
          onCancel={() => setShowNewEntry(false)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}
          </h1>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`bg-gradient-to-r ${getTierColor()} text-white border-0`}
            >
              {user.tier.charAt(0).toUpperCase() + user.tier.slice(1).replace('-', ' ')} Tier
            </Badge>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{getStreakMotivation()}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowNewEntry(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{user.currentStreak}</p>
                <p className="text-sm text-gray-400">Day streak</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{user.totalEntries}</p>
                <p className="text-sm text-gray-400">Total entries</p>
              </div>
              <Book className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {engagementMetrics?.averageMoodAfter.toFixed(1) || '-'}
                </p>
                <p className="text-sm text-gray-400">Avg mood</p>
              </div>
              <Heart className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {user.tier === 'free' ? '30' : '∞'}
                </p>
                <p className="text-sm text-gray-400">Days storage</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Entries */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentEntries.length === 0 ? (
                <div className="text-center py-8">
                  <Book className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No entries yet. Start your journey!</p>
                  <Button 
                    onClick={() => setShowNewEntry(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Write your first entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEntries.slice(0, 5).map((entry) => (
                    <div 
                      key={entry.id} 
                      className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-400">
                            {new Date(entry.createdAt.seconds * 1000).toLocaleDateString()}
                          </div>
                          {entry.aiProcessed && (
                            <Badge variant="outline" className="border-blue-400 text-blue-300 text-xs">
                              AI Analyzed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="text-sm text-gray-400">{entry.moodBefore}/10</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {entry.text}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{entry.wordCount} words</span>
                        {entry.moodAfter && entry.moodDelta && (
                          <div className="flex items-center gap-1 text-xs text-green-400">
                            <TrendingUp className="h-3 w-3" />
                            +{entry.moodDelta.toFixed(1)} mood improvement
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {recentEntries.length > 5 && (
                    <Button variant="outline" className="w-full border-gray-600">
                      View all entries ({recentEntries.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tier-specific features */}
          <TierFeatureGate userTier={user.tier} requiredTier="deep-cut" showUpgrade={false}>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Pattern Analysis
                  <TierBadge requiredTier="deep-cut" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">87%</p>
                    <p className="text-sm text-gray-400">Consistency score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">+2.3</p>
                    <p className="text-sm text-gray-400">Avg mood improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TierFeatureGate>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setShowNewEntry(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
              
              <TierFeatureGate userTier={user.tier} requiredTier="oracle" showUpgrade={false}>
                <Button variant="outline" className="w-full border-gold-400 text-gold-300 hover:bg-gold-900/20">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Mentor Chat
                </Button>
              </TierFeatureGate>
              
              <Button variant="outline" className="w-full border-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              
              <TierFeatureGate userTier={user.tier} requiredTier="deep-cut" showUpgrade={false}>
                <Button variant="outline" className="w-full border-gray-600">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Patterns
                </Button>
              </TierFeatureGate>
            </CardContent>
          </Card>

          {/* Wellness Check */}
          <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Heart className="h-5 w-5" />
                Wellness Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Sleep quality</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-3 h-3 bg-green-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Energy level</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <div key={star} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    ))}
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Stress level</span>
                  <div className="flex gap-1">
                    {[1, 2].map((star) => (
                      <div key={star} className="w-3 h-3 bg-red-400 rounded-full"></div>
                    ))}
                    {[3, 4, 5].map((star) => (
                      <div key={star} className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time of day prompt */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                {new Date().getHours() < 12 ? (
                  <Sun className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                ) : (
                  <Moon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-300 mb-3">
                  {new Date().getHours() < 12 
                    ? 'Morning journaling helps set intentions and priorities for the day ahead.'
                    : new Date().getHours() < 17
                    ? 'Afternoon reflection can help you process experiences and reset your energy.'
                    : 'Evening journaling is perfect for gratitude, reflection, and releasing the day.'
                  }
                </p>
                <Button 
                  size="sm" 
                  onClick={() => setShowNewEntry(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start writing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade prompt */}
          {getUpgradePrompt()}
        </div>
      </div>
    </div>
  );
}