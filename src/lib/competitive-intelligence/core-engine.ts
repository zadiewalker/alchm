/**
 * ALCHM Competitive Intelligence Core Engine
 * Central orchestrator for competitive monitoring and analysis
 */

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

import {
  CompetitorProfile,
  AppStoreMetrics,
  ReviewSentiment,
  FeatureAnalysis,
  MarketOpportunity,
  CompetitiveAlert,
  CompetitiveReport,
  MonitoringConfig
} from './types';

import {
  COLLECTIONS,
  CompetitiveIntelligenceConverter,
  CompetitiveQueryBuilder,
  CompetitiveAggregations
} from './database-schema';

/**
 * Core Competitive Intelligence Engine
 */
export class CompetitiveIntelligenceEngine {
  private static instance: CompetitiveIntelligenceEngine;
  private monitoringConfig: MonitoringConfig | null = null;
  private isMonitoring: boolean = false;
  
  private constructor() {}
  
  public static getInstance(): CompetitiveIntelligenceEngine {
    if (!CompetitiveIntelligenceEngine.instance) {
      CompetitiveIntelligenceEngine.instance = new CompetitiveIntelligenceEngine();
    }
    return CompetitiveIntelligenceEngine.instance;
  }
  
  /**
   * Initialize the monitoring system
   */
  async initialize(): Promise<void> {
    try {
      this.monitoringConfig = await this.getMonitoringConfig();
      console.log('Competitive Intelligence Engine initialized');
    } catch (error) {
      console.error('Failed to initialize Competitive Intelligence Engine:', error);
      throw error;
    }
  }
  
  /**
   * Start automated monitoring
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('Monitoring already active');
      return;
    }
    
    this.isMonitoring = true;
    console.log('Starting competitive monitoring...');
    
    // Schedule monitoring tasks
    this.scheduleAppStoreMonitoring();
    this.scheduleReviewAnalysis();
    this.scheduleFeatureDetection();
    this.scheduleOpportunityAnalysis();
  }
  
  /**
   * Stop automated monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('Competitive monitoring stopped');
  }
  
  // ==================== COMPETITOR MANAGEMENT ====================
  
  /**
   * Add a new competitor to track
   */
  async addCompetitor(competitor: Omit<CompetitorProfile, 'id'>): Promise<string> {
    try {
      const competitorData = {
        ...competitor,
        lastUpdated: new Date(),
        trackingStartDate: new Date(),
        isActive: true
      };
      
      const docRef = await addDoc(
        collection(db, COLLECTIONS.COMPETITORS),
        CompetitiveIntelligenceConverter.competitorToFirestore(competitorData as CompetitorProfile)
      );
      
      console.log(`Added competitor: ${competitor.name} (${docRef.id})`);
      return docRef.id;
    } catch (error) {
      console.error('Error adding competitor:', error);
      throw error;
    }
  }
  
  /**
   * Get all active competitors
   */
  async getActiveCompetitors(): Promise<CompetitorProfile[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.COMPETITORS),
          where('isActive', '==', true),
          orderBy('lastUpdated', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => 
        CompetitiveIntelligenceConverter.competitorFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error fetching competitors:', error);
      throw error;
    }
  }
  
  /**
   * Update competitor information
   */
  async updateCompetitor(competitorId: string, updates: Partial<CompetitorProfile>): Promise<void> {
    try {
      const competitorRef = doc(db, COLLECTIONS.COMPETITORS, competitorId);
      await updateDoc(competitorRef, {
        ...updates,
        lastUpdated: new Date()
      });
      
      console.log(`Updated competitor: ${competitorId}`);
    } catch (error) {
      console.error('Error updating competitor:', error);
      throw error;
    }
  }
  
  // ==================== APP STORE METRICS ====================
  
  /**
   * Record app store metrics for a competitor
   */
  async recordAppStoreMetrics(metrics: Omit<AppStoreMetrics, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, COLLECTIONS.APP_STORE_METRICS),
        CompetitiveIntelligenceConverter.metricsToFirestore(metrics as AppStoreMetrics)
      );
      
      // Check for significant changes and create alerts
      await this.checkForMetricAlerts(metrics);
      
      return docRef.id;
    } catch (error) {
      console.error('Error recording app store metrics:', error);
      throw error;
    }
  }
  
  /**
   * Get recent metrics for a competitor
   */
  async getCompetitorMetrics(competitorId: string, platform: string, days: number = 30): Promise<AppStoreMetrics[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.APP_STORE_METRICS),
          where('competitorId', '==', competitorId),
          where('platform', '==', platform),
          where('date', '>=', Timestamp.fromDate(startDate)),
          orderBy('date', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => 
        CompetitiveIntelligenceConverter.metricsFromFirestore(doc.data(), doc.id)
      );
    } catch (error) {
      console.error('Error fetching competitor metrics:', error);
      throw error;
    }
  }
  
  // ==================== REVIEW SENTIMENT ANALYSIS ====================
  
  /**
   * Analyze and store review sentiment
   */
  async analyzeReviewSentiment(review: Omit<ReviewSentiment, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, COLLECTIONS.REVIEW_SENTIMENT),
        CompetitiveIntelligenceConverter.reviewToFirestore(review as ReviewSentiment)
      );
      
      // Check for sentiment trends and create alerts
      await this.checkForSentimentAlerts(review);
      
      return docRef.id;
    } catch (error) {
      console.error('Error storing review sentiment:', error);
      throw error;
    }
  }
  
  /**
   * Get sentiment trends for competitors
   */
  async getSentimentTrends(competitorIds: string[], days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.REVIEW_SENTIMENT),
          where('competitorId', 'in', competitorIds),
          where('date', '>=', Timestamp.fromDate(startDate)),
          orderBy('date', 'desc')
        )
      );
      
      const reviews = querySnapshot.docs.map(doc => 
        CompetitiveIntelligenceConverter.reviewFromFirestore(doc.data(), doc.id)
      );
      
      return CompetitiveAggregations.calculateSentimentTrends(reviews);
    } catch (error) {
      console.error('Error calculating sentiment trends:', error);
      throw error;
    }
  }
  
  // ==================== MARKET OPPORTUNITIES ====================
  
  /**
   * Identify and record market opportunities
   */
  async identifyMarketOpportunity(opportunity: Omit<MarketOpportunity, 'id'>): Promise<string> {
    try {
      const opportunityData = {
        ...opportunity,
        identifiedDate: new Date(),
        status: 'new' as const
      };
      
      const docRef = await addDoc(
        collection(db, COLLECTIONS.MARKET_OPPORTUNITIES),
        opportunityData
      );
      
      // Create alert for high-priority opportunities
      if (opportunity.priority === 'high') {
        await this.createAlert({
          type: 'vulnerability',
          competitorId: 'market',
          severity: 'high',
          title: `High-Priority Market Opportunity: ${opportunity.title}`,
          description: opportunity.description,
          triggerData: opportunity,
          threshold: null,
          currentValue: opportunity.confidence,
          recommendedActions: opportunity.recommendedActions
        });
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error recording market opportunity:', error);
      throw error;
    }
  }
  
  /**
   * Get market opportunities by priority
   */
  async getMarketOpportunities(priority?: string): Promise<MarketOpportunity[]> {
    try {
      let queryConstraints = [
        collection(db, COLLECTIONS.MARKET_OPPORTUNITIES),
        where('status', 'in', ['new', 'investigating', 'validated'])
      ];
      
      if (priority) {
        queryConstraints.push(where('priority', '==', priority));
      }
      
      queryConstraints.push(orderBy('confidence', 'desc'));
      queryConstraints.push(orderBy('identifiedDate', 'desc'));
      
      const querySnapshot = await getDocs(query(...queryConstraints));
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MarketOpportunity[];
    } catch (error) {
      console.error('Error fetching market opportunities:', error);
      throw error;
    }
  }
  
  // ==================== ALERTS SYSTEM ====================
  
  /**
   * Create a competitive alert
   */
  async createAlert(alertData: Omit<CompetitiveAlert, 'id' | 'detectedAt' | 'status'>): Promise<string> {
    try {
      const alert: Omit<CompetitiveAlert, 'id'> = {
        ...alertData,
        detectedAt: new Date(),
        status: 'new'
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), alert);
      
      // Send notifications if configured
      await this.sendAlertNotifications(alert);
      
      console.log(`Created alert: ${alertData.title}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
  
  /**
   * Get unresolved alerts
   */
  async getUnresolvedAlerts(): Promise<CompetitiveAlert[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.ALERTS),
          where('status', 'in', ['new', 'investigating']),
          orderBy('severity', 'desc'),
          orderBy('detectedAt', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CompetitiveAlert[];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }
  
  // ==================== REPORTING ====================
  
  /**
   * Generate competitive intelligence report
   */
  async generateReport(type: string, startDate: Date, endDate: Date): Promise<CompetitiveReport> {
    try {
      // This would typically involve complex data aggregation and analysis
      // For now, we'll create a basic structure
      const report: Omit<CompetitiveReport, 'id'> = {
        type: type as any,
        title: `Competitive Intelligence Report - ${type}`,
        executiveSummary: 'Analysis of competitive landscape and market opportunities.',
        keyFindings: [],
        recommendations: [],
        startDate,
        endDate,
        sections: [],
        generatedAt: new Date(),
        generatedBy: 'automated',
        confidenceLevel: 0.8,
        dataQualityScore: 0.9
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.REPORTS), report);
      
      return {
        id: docRef.id,
        ...report
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
  
  // ==================== PRIVATE METHODS ====================
  
  private async getMonitoringConfig(): Promise<MonitoringConfig> {
    try {
      const configDoc = await getDoc(doc(db, COLLECTIONS.MONITORING_CONFIG, 'default'));
      
      if (configDoc.exists()) {
        return configDoc.data() as MonitoringConfig;
      }
      
      // Return default config if none exists
      return {
        competitorIds: [],
        appStoreCheckFrequency: 'daily',
        reviewAnalysisFrequency: 'daily',
        featureDetectionFrequency: 'weekly',
        rankingChangeThreshold: 5,
        sentimentChangeThreshold: 0.2,
        reviewVolumeThreshold: 50,
        emailAlerts: true,
        dataRetentionDays: 365,
        archiveAfterDays: 730
      };
    } catch (error) {
      console.error('Error fetching monitoring config:', error);
      throw error;
    }
  }
  
  private scheduleAppStoreMonitoring(): void {
    if (!this.monitoringConfig) return;
    
    const frequency = this.monitoringConfig.appStoreCheckFrequency;
    const intervalMs = frequency === 'hourly' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    
    setInterval(async () => {
      if (this.isMonitoring) {
        await this.runAppStoreMonitoring();
      }
    }, intervalMs);
  }
  
  private scheduleReviewAnalysis(): void {
    if (!this.monitoringConfig) return;
    
    const frequency = this.monitoringConfig.reviewAnalysisFrequency;
    const intervalMs = frequency === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    
    setInterval(async () => {
      if (this.isMonitoring) {
        await this.runReviewAnalysis();
      }
    }, intervalMs);
  }
  
  private scheduleFeatureDetection(): void {
    // Implementation for feature detection scheduling
  }
  
  private scheduleOpportunityAnalysis(): void {
    // Implementation for opportunity analysis scheduling
  }
  
  private async runAppStoreMonitoring(): Promise<void> {
    // Implementation for automated app store monitoring
    console.log('Running app store monitoring...');
  }
  
  private async runReviewAnalysis(): Promise<void> {
    // Implementation for automated review analysis
    console.log('Running review analysis...');
  }
  
  private async checkForMetricAlerts(metrics: Omit<AppStoreMetrics, 'id'>): Promise<void> {
    // Implementation for metric-based alert detection
  }
  
  private async checkForSentimentAlerts(review: Omit<ReviewSentiment, 'id'>): Promise<void> {
    // Implementation for sentiment-based alert detection
  }
  
  private async sendAlertNotifications(alert: Omit<CompetitiveAlert, 'id'>): Promise<void> {
    // Implementation for alert notifications (email, Slack, etc.)
    console.log(`Alert notification: ${alert.title}`);
  }
}

// Export singleton instance
export const competitiveIntelligence = CompetitiveIntelligenceEngine.getInstance();