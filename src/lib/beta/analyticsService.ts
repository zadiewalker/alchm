// Beta Analytics Service

import { getFirebaseDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import {
  BetaAnalytics,
  TimeSeries,
  CategoryData,
  FeatureAdoption,
  RetentionData,
  FeatureCoverage
} from '@/types/beta';
import { betaUserService } from './betaUserService';
import { feedbackService } from './feedbackService';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private db: any;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private async getDb() {
    if (!this.db) {
      this.db = await getFirebaseDb();
    }
    return this.db;
  }

  // Comprehensive Beta Analytics
  async getBetaAnalytics(timeRange?: { start: Date; end: Date }): Promise<BetaAnalytics> {
    const [overview, engagement, feedback, testing] = await Promise.all([
      this.getOverviewMetrics(timeRange),
      this.getEngagementMetrics(timeRange),
      this.getFeedbackMetrics(timeRange),
      this.getTestingMetrics(timeRange)
    ]);

    return {
      overview,
      engagement,
      feedback,
      testing
    };
  }

  // Overview Metrics
  private async getOverviewMetrics(timeRange?: { start: Date; end: Date }) {
    const betaUsers = await betaUserService.getBetaUsers();
    const feedback = await feedbackService.getFeedbackStats(timeRange);
    
    const activeUsers = betaUsers.filter(user => {
      const daysSinceActive = Math.floor(
        (Date.now() - user.metrics.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceActive <= 7; // Active in last 7 days
    }).length;

    const avgEngagementScore = betaUsers.length > 0
      ? betaUsers.reduce((sum, user) => sum + user.metrics.engagementScore, 0) / betaUsers.length
      : 0;

    const surveysCompleted = betaUsers.reduce((sum, user) => sum + user.metrics.surveysCompleted, 0);
    const interviewsCompleted = betaUsers.reduce((sum, user) => sum + user.metrics.interviewsCompleted, 0);

    return {
      totalUsers: betaUsers.length,
      activeUsers,
      avgEngagementScore: Math.round(avgEngagementScore),
      bugReports: feedback.totalFeedback,
      featureRequests: feedback.byType['feature_request'] || 0,
      surveysCompleted,
      interviewsCompleted
    };
  }

  // Engagement Metrics
  private async getEngagementMetrics(timeRange?: { start: Date; end: Date }) {
    const betaUsers = await betaUserService.getBetaUsers();
    
    // Daily Active Users (last 30 days)
    const dailyActiveUsers = await this.getDailyActiveUsers(30);
    
    // Session Duration (average over time)
    const sessionDuration = await this.getSessionDurationTrend(30);
    
    // Feature Adoption
    const featureAdoption = await this.getFeatureAdoption(betaUsers);
    
    // User Retention
    const userRetention = await this.getUserRetention(betaUsers);

    return {
      dailyActiveUsers,
      sessionDuration,
      featureAdoption,
      userRetention
    };
  }

  private async getDailyActiveUsers(days: number): Promise<TimeSeries[]> {
    const betaUsers = await betaUserService.getBetaUsers();
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const activeCount = betaUsers.filter(user => {
        const lastActive = new Date(user.metrics.lastActiveAt);
        return lastActive >= date && lastActive < nextDate;
      }).length;
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: activeCount
      });
    }
    
    return result;
  }

  private async getSessionDurationTrend(days: number): Promise<TimeSeries[]> {
    const betaUsers = await betaUserService.getBetaUsers();
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // This would ideally come from session tracking data
      // For now, we'll simulate based on total time spent
      const avgDuration = betaUsers.length > 0
        ? betaUsers.reduce((sum, user) => sum + (user.metrics.totalTimeSpent / user.metrics.sessionsCount || 0), 0) / betaUsers.length
        : 0;
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(avgDuration / 60) // Convert to minutes
      });
    }
    
    return result;
  }

  private async getFeatureAdoption(betaUsers: any[]): Promise<FeatureAdoption[]> {
    const featureUsage = new Map<string, { users: Set<string>, totalTime: number, usageCount: number }>();
    
    betaUsers.forEach(user => {
      user.metrics.featuresUsed.forEach((feature: string) => {
        if (!featureUsage.has(feature)) {
          featureUsage.set(feature, { users: new Set(), totalTime: 0, usageCount: 0 });
        }
        
        const usage = featureUsage.get(feature)!;
        usage.users.add(user.uid);
        usage.totalTime += user.metrics.totalTimeSpent / user.metrics.featuresUsed.length; // Rough estimate
        usage.usageCount += 1;
      });
    });
    
    return Array.from(featureUsage.entries()).map(([feature, data]) => ({
      feature,
      adoptionRate: betaUsers.length > 0 ? (data.users.size / betaUsers.length) * 100 : 0,
      usageCount: data.usageCount,
      avgTimeSpent: data.users.size > 0 ? data.totalTime / data.users.size : 0
    })).sort((a, b) => b.adoptionRate - a.adoptionRate);
  }

  private async getUserRetention(betaUsers: any[]): Promise<RetentionData[]> {
    const cohorts = new Map<string, any[]>();
    
    // Group users by join month
    betaUsers.forEach(user => {
      const joinMonth = new Date(user.joinedAt).toISOString().slice(0, 7); // YYYY-MM
      if (!cohorts.has(joinMonth)) {
        cohorts.set(joinMonth, []);
      }
      cohorts.get(joinMonth)!.push(user);
    });
    
    return Array.from(cohorts.entries()).map(([cohort, users]) => {
      const cohortDate = new Date(cohort + '-01');
      
      const calculateRetention = (days: number) => {
        const targetDate = new Date(cohortDate);
        targetDate.setDate(targetDate.getDate() + days);
        
        const activeUsers = users.filter(user => {
          const lastActive = new Date(user.metrics.lastActiveAt);
          return lastActive >= targetDate;
        }).length;
        
        return users.length > 0 ? (activeUsers / users.length) * 100 : 0;
      };
      
      return {
        cohort,
        day1: calculateRetention(1),
        day7: calculateRetention(7),
        day14: calculateRetention(14),
        day30: calculateRetention(30)
      };
    }).sort((a, b) => b.cohort.localeCompare(a.cohort));
  }

  // Feedback Metrics
  private async getFeedbackMetrics(timeRange?: { start: Date; end: Date }) {
    const feedbackStats = await feedbackService.getFeedbackStats(timeRange);
    
    const bugsByPriority: CategoryData[] = Object.entries(feedbackStats.byPriority).map(([priority, count]) => ({
      category: priority,
      count,
      percentage: feedbackStats.totalFeedback > 0 ? (count / feedbackStats.totalFeedback) * 100 : 0
    }));
    
    const feedbackByType: CategoryData[] = Object.entries(feedbackStats.byType).map(([type, count]) => ({
      category: type.replace('_', ' '),
      count,
      percentage: feedbackStats.totalFeedback > 0 ? (count / feedbackStats.totalFeedback) * 100 : 0
    }));
    
    // Resolution time trend (last 30 days)
    const resolutionTime = await this.getResolutionTimeTrend(30);
    
    // Satisfaction scores (would need additional implementation)
    const satisfactionScores = await this.getSatisfactionScoresTrend(30);
    
    return {
      bugsByPriority,
      feedbackByType,
      resolutionTime,
      satisfactionScores
    };
  }

  private async getResolutionTimeTrend(days: number): Promise<TimeSeries[]> {
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // This would need to be calculated from actual feedback resolution data
      // For now, we'll simulate some data
      const avgResolutionTime = 2 + Math.random() * 3; // 2-5 hours average
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(avgResolutionTime * 100) / 100
      });
    }
    
    return result;
  }

  private async getSatisfactionScoresTrend(days: number): Promise<TimeSeries[]> {
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // This would come from survey data
      // For now, we'll simulate scores between 3.5 and 4.5
      const satisfactionScore = 3.5 + Math.random() * 1;
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(satisfactionScore * 10) / 10
      });
    }
    
    return result;
  }

  // Testing Metrics
  private async getTestingMetrics(timeRange?: { start: Date; end: Date }) {
    const betaUsers = await betaUserService.getBetaUsers();
    
    // Feature coverage
    const coverageByFeature = await this.getFeatureCoverage(betaUsers);
    
    // Testing effectiveness
    const testingEffectiveness = await this.getTestingEffectivenessTrend(30);
    
    // Issue discovery rate
    const issueDiscoveryRate = await this.getIssueDiscoveryRate(30);
    
    return {
      coverageByFeature,
      testingEffectiveness,
      issueDiscoveryRate
    };
  }

  private async getFeatureCoverage(betaUsers: any[]): Promise<FeatureCoverage[]> {
    const features = new Set<string>();
    const featureData = new Map<string, { users: Set<string>, bugs: number, feedback: number }>();
    
    // Collect all features
    betaUsers.forEach(user => {
      user.metrics.featuresUsed.forEach((feature: string) => {
        features.add(feature);
        if (!featureData.has(feature)) {
          featureData.set(feature, { users: new Set(), bugs: 0, feedback: 0 });
        }
        featureData.get(feature)!.users.add(user.uid);
      });
    });
    
    // This would need to be enhanced with actual bug/feedback data per feature
    return Array.from(features).map(feature => {
      const data = featureData.get(feature)!;
      return {
        feature,
        coverage: betaUsers.length > 0 ? (data.users.size / betaUsers.length) * 100 : 0,
        usersTestedCount: data.users.size,
        bugsFound: Math.floor(Math.random() * 3), // Simulated
        feedbackCount: Math.floor(Math.random() * 5) // Simulated
      };
    }).sort((a, b) => b.coverage - a.coverage);
  }

  private async getTestingEffectivenessTrend(days: number): Promise<TimeSeries[]> {
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Testing effectiveness could be measured as bugs found per tester per day
      // For now, we'll simulate
      const effectiveness = 0.1 + Math.random() * 0.3; // 0.1-0.4 bugs per tester
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(effectiveness * 100) / 100
      });
    }
    
    return result;
  }

  private async getIssueDiscoveryRate(days: number): Promise<TimeSeries[]> {
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Issues discovered per day
      const issuesFound = Math.floor(Math.random() * 5); // 0-4 issues per day
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: issuesFound
      });
    }
    
    return result;
  }

  // User-specific Analytics
  async getUserAnalytics(userId: string): Promise<{
    engagementHistory: TimeSeries[];
    featureUsage: { feature: string; usage: number }[];
    feedbackContributions: { type: string; count: number }[];
    streak: number;
    achievements: string[];
  }> {
    const betaUser = await betaUserService.getBetaUser(userId);
    
    if (!betaUser) {
      throw new Error('Beta user not found');
    }
    
    // Engagement history (last 30 days)
    const engagementHistory = await this.getUserEngagementHistory(userId, 30);
    
    // Feature usage breakdown
    const featureUsage = betaUser.metrics.featuresUsed.map((feature: string) => ({
      feature,
      usage: Math.floor(Math.random() * 10) + 1 // Simulated usage count
    }));
    
    // Feedback contributions
    const feedbackContributions = [
      { type: 'bugs', count: betaUser.metrics.bugsReported },
      { type: 'feedback', count: betaUser.metrics.feedbackSubmitted },
      { type: 'surveys', count: betaUser.metrics.surveysCompleted }
    ];
    
    // Current streak (days of consecutive activity)
    const streak = await this.calculateUserStreak(userId);
    
    // Achievements
    const achievements = await this.getUserAchievements(betaUser);
    
    return {
      engagementHistory,
      featureUsage,
      feedbackContributions,
      streak,
      achievements
    };
  }

  private async getUserEngagementHistory(userId: string, days: number): Promise<TimeSeries[]> {
    // This would track daily engagement scores
    // For now, we'll simulate based on activity
    const result: TimeSeries[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulated engagement score (0-100)
      const engagement = Math.random() * 100;
      
      result.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(engagement)
      });
    }
    
    return result;
  }

  private async calculateUserStreak(userId: string): Promise<number> {
    // This would calculate consecutive days of activity
    // For now, we'll return a simulated streak
    return Math.floor(Math.random() * 30) + 1;
  }

  private async getUserAchievements(betaUser: any): Promise<string[]> {
    const achievements: string[] = [];
    
    if (betaUser.metrics.bugsReported >= 1) achievements.push('First Bug Reporter');
    if (betaUser.metrics.bugsReported >= 10) achievements.push('Bug Hunter');
    if (betaUser.metrics.feedbackSubmitted >= 5) achievements.push('Feedback Champion');
    if (betaUser.metrics.surveysCompleted >= 3) achievements.push('Survey Contributor');
    if (betaUser.metrics.engagementScore >= 80) achievements.push('Highly Engaged');
    if (betaUser.metrics.sessionsCount >= 50) achievements.push('Power User');
    
    return achievements;
  }

  // Export Analytics Data
  async exportAnalyticsData(format: 'json' | 'csv'): Promise<string> {
    const analytics = await this.getBetaAnalytics();
    
    if (format === 'json') {
      return JSON.stringify(analytics, null, 2);
    } else {
      // Convert to CSV format
      let csv = 'Metric,Value\n';
      csv += `Total Users,${analytics.overview.totalUsers}\n`;
      csv += `Active Users,${analytics.overview.activeUsers}\n`;
      csv += `Avg Engagement Score,${analytics.overview.avgEngagementScore}\n`;
      csv += `Bug Reports,${analytics.overview.bugReports}\n`;
      csv += `Feature Requests,${analytics.overview.featureRequests}\n`;
      csv += `Surveys Completed,${analytics.overview.surveysCompleted}\n`;
      csv += `Interviews Completed,${analytics.overview.interviewsCompleted}\n`;
      
      return csv;
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();