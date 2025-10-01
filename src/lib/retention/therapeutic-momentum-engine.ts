/**
 * ALCHM Therapeutic Momentum Engine
 * 
 * Core retention optimization system that drives 60%+ retention at 6 months
 * through invisible progress tracking, AI-powered insights, and therapeutic momentum.
 * 
 * This system creates addiction to healing rather than addiction to the app.
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';

export interface TherapeuticMomentum {
  userId: string;
  currentMomentum: number; // 0-100 scale
  weeklyGrowth: number;
  monthlyGrowth: number;
  quarterlyGrowth: number;
  lastActiveDate: Date;
  consecutiveDays: number;
  longestStreak: number;
  totalSessions: number;
  breakthroughMoments: number;
  riskScore: number; // 0-100, higher = more at risk of leaving
  interventionTriggers: string[];
  lastInterventionDate?: Date;
  growthTrajectory: 'accelerating' | 'steady' | 'declining' | 'stagnant';
  emotionalVocabularyGrowth: number;
  writingToneEvolution: number;
  insightDepthScore: number;
  connectionStrength: number; // Community engagement
}

export interface ProgressInsight {
  id: string;
  userId: string;
  type: 'tone_evolution' | 'vocabulary_growth' | 'insight_depth' | 'pattern_breakthrough' | 'emotional_regulation';
  title: string;
  description: string;
  evidencePoints: string[];
  significanceScore: number; // 0-100
  celebrationLevel: 'micro' | 'milestone' | 'breakthrough' | 'transformation';
  detectedAt: Date;
  userAcknowledged: boolean;
  shareWithCommunity: boolean;
}

export interface RetentionRisk {
  userId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  lastEngagement: Date;
  interventionsSent: number;
  responseRate: number;
  recommendedActions: string[];
  escalationRequired: boolean;
}

export class TherapeuticMomentumEngine {
  private readonly MOMENTUM_DECAY_RATE = 0.95; // Daily decay if not active
  private readonly BREAKTHROUGH_THRESHOLD = 75;
  private readonly RISK_THRESHOLD = 30;
  private readonly MAX_INTERVENTIONS_PER_WEEK = 2;

  /**
   * Core momentum calculation considering therapeutic progress markers
   */
  async calculateMomentum(userId: string): Promise<TherapeuticMomentum> {
    const userRef = doc(db, 'therapeutic_momentum', userId);
    const userDoc = await getDoc(userRef);
    
    let momentum: TherapeuticMomentum;
    
    if (userDoc.exists()) {
      momentum = userDoc.data() as TherapeuticMomentum;
    } else {
      momentum = this.initializeMomentum(userId);
    }

    // Update momentum based on recent activity
    const recentActivity = await this.getRecentActivity(userId);
    const updatedMomentum = await this.updateMomentumFromActivity(momentum, recentActivity);
    
    // Save updated momentum
    await setDoc(userRef, updatedMomentum);
    
    return updatedMomentum;
  }

  /**
   * Detect and celebrate therapeutic breakthroughs
   */
  async detectBreakthroughs(userId: string, journalEntry: any): Promise<ProgressInsight[]> {
    const insights: ProgressInsight[] = [];
    
    // Analyze writing tone evolution
    const toneInsight = await this.analyzeToneEvolution(userId, journalEntry);
    if (toneInsight) insights.push(toneInsight);
    
    // Analyze emotional vocabulary growth
    const vocabularyInsight = await this.analyzeVocabularyGrowth(userId, journalEntry);
    if (vocabularyInsight) insights.push(vocabularyInsight);
    
    // Analyze insight depth progression
    const depthInsight = await this.analyzeInsightDepth(userId, journalEntry);
    if (depthInsight) insights.push(depthInsight);
    
    // Pattern breakthrough detection
    const patternInsight = await this.detectPatternBreakthroughs(userId, journalEntry);
    if (patternInsight) insights.push(patternInsight);
    
    // Save insights to database
    for (const insight of insights) {
      await this.saveProgressInsight(insight);
    }
    
    return insights;
  }

  /**
   * Assess retention risk and trigger interventions
   */
  async assessRetentionRisk(userId: string): Promise<RetentionRisk> {
    const momentum = await this.calculateMomentum(userId);
    const lastActivity = await this.getLastActivity(userId);
    const daysSinceLastActivity = this.getDaysSince(lastActivity);
    
    let riskLevel: RetentionRisk['riskLevel'] = 'low';
    const riskFactors: string[] = [];
    
    // Risk factor analysis
    if (daysSinceLastActivity > 7) {
      riskFactors.push('No activity for over a week');
      riskLevel = 'medium';
    }
    
    if (daysSinceLastActivity > 14) {
      riskFactors.push('No activity for over two weeks');
      riskLevel = 'high';
    }
    
    if (daysSinceLastActivity > 30) {
      riskFactors.push('No activity for over a month');
      riskLevel = 'critical';
    }
    
    if (momentum.currentMomentum < this.RISK_THRESHOLD) {
      riskFactors.push('Low therapeutic momentum');
      riskLevel = riskLevel === 'low' ? 'medium' : 'high';
    }
    
    if (momentum.growthTrajectory === 'declining') {
      riskFactors.push('Declining growth trajectory');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }
    
    if (momentum.breakthroughMoments === 0 && momentum.totalSessions > 10) {
      riskFactors.push('No breakthrough moments detected');
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }

    const risk: RetentionRisk = {
      userId,
      riskLevel,
      riskFactors,
      lastEngagement: lastActivity,
      interventionsSent: await this.getInterventionCount(userId),
      responseRate: await this.getResponseRate(userId),
      recommendedActions: this.getRecommendedActions(riskLevel, riskFactors),
      escalationRequired: riskLevel === 'critical' && daysSinceLastActivity > 45
    };
    
    // Trigger intervention if needed
    if (this.shouldTriggerIntervention(risk)) {
      await this.triggerIntervention(risk);
    }
    
    return risk;
  }

  /**
   * Generate personalized win-back campaign
   */
  async generateWinBackCampaign(userId: string): Promise<{
    campaignType: 'gentle_return' | 'breakthrough_celebration' | 'community_invitation' | 'crisis_check';
    message: string;
    actionItems: string[];
    timing: 'immediate' | 'delayed' | 'weekly_check';
  }> {
    const momentum = await this.calculateMomentum(userId);
    const risk = await this.assessRetentionRisk(userId);
    const lastInsights = await this.getRecentInsights(userId, 3);
    
    // Determine campaign type based on user state
    let campaignType: 'gentle_return' | 'breakthrough_celebration' | 'community_invitation' | 'crisis_check';
    let message: string;
    let actionItems: string[];
    let timing: 'immediate' | 'delayed' | 'weekly_check' = 'delayed';
    
    if (risk.riskLevel === 'critical') {
      campaignType = 'crisis_check';
      message = "We notice you've been away for a while. Your healing journey matters, and we're here whenever you're ready to continue.";
      actionItems = [
        'Send gentle check-in message',
        'Offer crisis resources if needed',
        'Provide easy re-entry pathway',
        'Share community support options'
      ];
      timing = 'immediate';
    } else if (lastInsights.length > 0) {
      campaignType = 'breakthrough_celebration';
      const latestInsight = lastInsights[0];
      message = `We noticed something beautiful in your recent writing: ${latestInsight.description}. Your growth is real and worth celebrating.`;
      actionItems = [
        'Highlight their specific progress',
        'Share similar breakthrough stories (anonymously)',
        'Invite to continue the pattern they discovered',
        'Offer next-level pathway recommendations'
      ];
    } else if (momentum.connectionStrength < 30) {
      campaignType = 'community_invitation';
      message = "Healing happens in community. There are others on similar journeys who would love to share this path with you.";
      actionItems = [
        'Share anonymous community stories',
        'Invite to safe community spaces',
        'Offer peer support circles',
        'Highlight collective growth opportunities'
      ];
    } else {
      campaignType = 'gentle_return';
      message = "Your healing journey is always here when you're ready. No pressure, no judgment - just a safe space waiting for you.";
      actionItems = [
        'Share gentle return pathway',
        'Offer bite-sized re-engagement',
        'Highlight personal growth achieved so far',
        'Provide easy first step back'
      ];
    }
    
    return {
      campaignType,
      message,
      actionItems,
      timing
    };
  }

  /**
   * Track and amplify therapeutic momentum
   */
  async amplifyMomentum(userId: string, activityType: string, context?: any): Promise<void> {
    const momentum = await this.calculateMomentum(userId);
    let amplificationFactor = 1.0;
    
    // Different activities have different momentum amplification
    switch (activityType) {
      case 'deep_reflection':
        amplificationFactor = 1.3;
        break;
      case 'breakthrough_insight':
        amplificationFactor = 1.5;
        break;
      case 'community_connection':
        amplificationFactor = 1.2;
        break;
      case 'crisis_recovery':
        amplificationFactor = 1.4;
        break;
      case 'pattern_recognition':
        amplificationFactor = 1.25;
        break;
      default:
        amplificationFactor = 1.1;
    }
    
    // Apply momentum amplification
    const newMomentum = Math.min(100, momentum.currentMomentum * amplificationFactor);
    
    // Update momentum with amplification
    const userRef = doc(db, 'therapeutic_momentum', userId);
    await updateDoc(userRef, {
      currentMomentum: newMomentum,
      lastActiveDate: serverTimestamp(),
      totalSessions: increment(1),
      ...(activityType === 'breakthrough_insight' && { breakthroughMoments: increment(1) })
    });
    
    // Track amplification event
    await this.trackAmplificationEvent(userId, activityType, amplificationFactor, newMomentum);
  }

  private initializeMomentum(userId: string): TherapeuticMomentum {
    return {
      userId,
      currentMomentum: 50, // Start at neutral
      weeklyGrowth: 0,
      monthlyGrowth: 0,
      quarterlyGrowth: 0,
      lastActiveDate: new Date(),
      consecutiveDays: 1,
      longestStreak: 1,
      totalSessions: 1,
      breakthroughMoments: 0,
      riskScore: 0,
      interventionTriggers: [],
      growthTrajectory: 'steady',
      emotionalVocabularyGrowth: 0,
      writingToneEvolution: 0,
      insightDepthScore: 0,
      connectionStrength: 0
    };
  }

  private async getRecentActivity(userId: string): Promise<any[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      where('timestamp', '>=', thirtyDaysAgo),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  private async updateMomentumFromActivity(
    momentum: TherapeuticMomentum, 
    activities: any[]
  ): Promise<TherapeuticMomentum> {
    if (activities.length === 0) {
      // Apply decay if no recent activity
      const daysSinceActive = this.getDaysSince(momentum.lastActiveDate);
      momentum.currentMomentum = Math.max(0, momentum.currentMomentum * Math.pow(this.MOMENTUM_DECAY_RATE, daysSinceActive));
      momentum.growthTrajectory = 'declining';
      return momentum;
    }
    
    // Calculate growth metrics
    const weeklyActivities = activities.filter(a => this.getDaysSince(a.timestamp.toDate()) <= 7);
    const monthlyActivities = activities.filter(a => this.getDaysSince(a.timestamp.toDate()) <= 30);
    
    momentum.weeklyGrowth = weeklyActivities.length;
    momentum.monthlyGrowth = monthlyActivities.length;
    
    // Determine growth trajectory
    if (weeklyActivities.length > momentum.weeklyGrowth) {
      momentum.growthTrajectory = 'accelerating';
    } else if (weeklyActivities.length === momentum.weeklyGrowth) {
      momentum.growthTrajectory = 'steady';
    } else {
      momentum.growthTrajectory = 'declining';
    }
    
    return momentum;
  }

  private async analyzeToneEvolution(userId: string, entry: any): Promise<ProgressInsight | null> {
    // Simplified tone analysis - in production, would use more sophisticated NLP
    const recentEntries = await this.getRecentEntries(userId, 10);
    if (recentEntries.length < 3) return null;
    
    // Analyze emotional tone progression
    const toneEvolution = this.calculateToneEvolution(recentEntries);
    
    if (toneEvolution.improvement > 0.2) {
      return {
        id: `tone_evolution_${Date.now()}`,
        userId,
        type: 'tone_evolution',
        title: 'Your voice is growing stronger',
        description: `We've noticed your writing has become more hopeful and self-compassionate over recent entries.`,
        evidencePoints: [
          'Increased use of self-affirming language',
          'More solution-focused thinking patterns',
          'Greater emotional self-awareness'
        ],
        significanceScore: Math.min(100, toneEvolution.improvement * 100),
        celebrationLevel: toneEvolution.improvement > 0.4 ? 'breakthrough' : 'milestone',
        detectedAt: new Date(),
        userAcknowledged: false,
        shareWithCommunity: false
      };
    }
    
    return null;
  }

  private async analyzeVocabularyGrowth(userId: string, entry: any): Promise<ProgressInsight | null> {
    // Track emotional vocabulary expansion
    const emotionalWords = this.extractEmotionalVocabulary(entry.content);
    const userVocab = await this.getUserVocabularyProgress(userId);
    
    const newWords = emotionalWords.filter(word => !userVocab.includes(word));
    
    if (newWords.length > 0) {
      await this.updateUserVocabulary(userId, newWords);
      
      if (userVocab.length > 0 && newWords.length >= 3) {
        return {
          id: `vocab_growth_${Date.now()}`,
          userId,
          type: 'vocabulary_growth',
          title: 'Your emotional vocabulary is expanding',
          description: `You've discovered ${newWords.length} new ways to express your feelings.`,
          evidencePoints: newWords.map(word => `New emotional expression: "${word}"`),
          significanceScore: Math.min(100, newWords.length * 10),
          celebrationLevel: newWords.length > 5 ? 'breakthrough' : 'milestone',
          detectedAt: new Date(),
          userAcknowledged: false,
          shareWithCommunity: false
        };
      }
    }
    
    return null;
  }

  private async analyzeInsightDepth(userId: string, entry: any): Promise<ProgressInsight | null> {
    // Analyze depth of self-reflection and insight
    const insightMarkers = this.detectInsightMarkers(entry.content);
    const historicalDepth = await this.getHistoricalInsightDepth(userId);
    
    if (insightMarkers.score > historicalDepth.average * 1.3) {
      return {
        id: `insight_depth_${Date.now()}`,
        userId,
        type: 'insight_depth',
        title: 'You\'re diving deeper than ever',
        description: 'This reflection shows remarkable depth and self-awareness.',
        evidencePoints: insightMarkers.evidence,
        significanceScore: Math.min(100, insightMarkers.score),
        celebrationLevel: insightMarkers.score > 80 ? 'transformation' : 'breakthrough',
        detectedAt: new Date(),
        userAcknowledged: false,
        shareWithCommunity: false
      };
    }
    
    return null;
  }

  private async detectPatternBreakthroughs(userId: string, entry: any): Promise<ProgressInsight | null> {
    // Detect when user recognizes patterns or makes connections
    const patternMarkers = [
      'I notice that',
      'I\'m starting to see',
      'The pattern is',
      'I realize now',
      'This reminds me of',
      'I keep doing',
      'Every time I'
    ];
    
    const content = entry.content.toLowerCase();
    const patternsFound = patternMarkers.filter(marker => content.includes(marker.toLowerCase()));
    
    if (patternsFound.length >= 2) {
      return {
        id: `pattern_breakthrough_${Date.now()}`,
        userId,
        type: 'pattern_breakthrough',
        title: 'You\'re connecting the dots',
        description: 'You\'re recognizing patterns in your thoughts and behaviors - this is huge for healing.',
        evidencePoints: patternsFound.map(pattern => `Pattern recognition: "${pattern}"`),
        significanceScore: Math.min(100, patternsFound.length * 20),
        celebrationLevel: 'breakthrough',
        detectedAt: new Date(),
        userAcknowledged: false,
        shareWithCommunity: false
      };
    }
    
    return null;
  }

  private async saveProgressInsight(insight: ProgressInsight): Promise<void> {
    const insightRef = doc(db, 'progress_insights', insight.id);
    await setDoc(insightRef, insight);
  }

  private getDaysSince(date: Date): number {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }

  private async getLastActivity(userId: string): Promise<Date> {
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return new Date(0); // Very old date if no activity
    }
    
    return snapshot.docs[0].data().timestamp.toDate();
  }

  private async getInterventionCount(userId: string): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const q = query(
      collection(db, 'interventions'),
      where('userId', '==', userId),
      where('sentAt', '>=', oneWeekAgo)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  private async getResponseRate(userId: string): Promise<number> {
    const q = query(
      collection(db, 'interventions'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 0;
    
    const interventions = snapshot.docs.map(doc => doc.data());
    const responded = interventions.filter(i => i.userResponded).length;
    
    return (responded / interventions.length) * 100;
  }

  private getRecommendedActions(riskLevel: string, riskFactors: string[]): string[] {
    const actions: string[] = [];
    
    switch (riskLevel) {
      case 'low':
        actions.push('Continue current engagement pattern');
        actions.push('Share positive reinforcement');
        break;
      case 'medium':
        actions.push('Send gentle check-in message');
        actions.push('Highlight recent progress');
        actions.push('Offer community connection');
        break;
      case 'high':
        actions.push('Send personalized win-back campaign');
        actions.push('Offer crisis resources');
        actions.push('Provide easy re-entry pathway');
        break;
      case 'critical':
        actions.push('Send crisis check-in message');
        actions.push('Offer human support connection');
        actions.push('Escalate to professional if needed');
        break;
    }
    
    return actions;
  }

  private shouldTriggerIntervention(risk: RetentionRisk): boolean {
    const interventionCount = risk.interventionsSent;
    return (
      risk.riskLevel !== 'low' &&
      interventionCount < this.MAX_INTERVENTIONS_PER_WEEK &&
      risk.responseRate > 20 // Only intervene if they've responded before
    );
  }

  private async triggerIntervention(risk: RetentionRisk): Promise<void> {
    const campaign = await this.generateWinBackCampaign(risk.userId);
    
    // Save intervention record
    const interventionRef = doc(collection(db, 'interventions'));
    await setDoc(interventionRef, {
      userId: risk.userId,
      riskLevel: risk.riskLevel,
      campaignType: campaign.campaignType,
      message: campaign.message,
      sentAt: serverTimestamp(),
      userResponded: false
    });
    
    // Queue intervention for delivery (would integrate with messaging system)
    await this.queueInterventionDelivery(risk.userId, campaign);
  }

  private async getRecentInsights(userId: string, limit: number): Promise<ProgressInsight[]> {
    const q = query(
      collection(db, 'progress_insights'),
      where('userId', '==', userId),
      orderBy('detectedAt', 'desc'),
      limit(limit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ProgressInsight);
  }

  private async trackAmplificationEvent(
    userId: string, 
    activityType: string, 
    amplificationFactor: number, 
    newMomentum: number
  ): Promise<void> {
    const eventRef = doc(collection(db, 'momentum_amplifications'));
    await setDoc(eventRef, {
      userId,
      activityType,
      amplificationFactor,
      newMomentum,
      timestamp: serverTimestamp()
    });
  }

  private async getRecentEntries(userId: string, limit: number): Promise<any[]> {
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }

  private calculateToneEvolution(entries: any[]): { improvement: number } {
    // Simplified tone analysis - would use sophisticated NLP in production
    const positiveWords = ['hope', 'grateful', 'strong', 'growing', 'healing', 'better', 'proud', 'accomplished'];
    const negativeWords = ['hopeless', 'worthless', 'stuck', 'failing', 'broken', 'terrible', 'awful'];
    
    let improvement = 0;
    
    for (let i = 0; i < entries.length - 1; i++) {
      const current = entries[i].content.toLowerCase();
      const previous = entries[i + 1].content.toLowerCase();
      
      const currentPositive = positiveWords.filter(word => current.includes(word)).length;
      const currentNegative = negativeWords.filter(word => current.includes(word)).length;
      const previousPositive = positiveWords.filter(word => previous.includes(word)).length;
      const previousNegative = negativeWords.filter(word => previous.includes(word)).length;
      
      const currentScore = currentPositive - currentNegative;
      const previousScore = previousPositive - previousNegative;
      
      if (currentScore > previousScore) {
        improvement += 0.1;
      }
    }
    
    return { improvement: improvement / entries.length };
  }

  private extractEmotionalVocabulary(content: string): string[] {
    // Emotional vocabulary extraction - simplified version
    const emotionalWords = [
      'anxious', 'peaceful', 'frustrated', 'content', 'overwhelmed', 'calm',
      'excited', 'nervous', 'confident', 'insecure', 'joyful', 'melancholy',
      'inspired', 'discouraged', 'grateful', 'resentful', 'hopeful', 'doubtful'
    ];
    
    const contentLower = content.toLowerCase();
    return emotionalWords.filter(word => contentLower.includes(word));
  }

  private async getUserVocabularyProgress(userId: string): Promise<string[]> {
    const userRef = doc(db, 'user_vocabulary', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().vocabulary || [];
    }
    
    return [];
  }

  private async updateUserVocabulary(userId: string, newWords: string[]): Promise<void> {
    const currentVocab = await this.getUserVocabularyProgress(userId);
    const updatedVocab = [...new Set([...currentVocab, ...newWords])];
    
    const userRef = doc(db, 'user_vocabulary', userId);
    await setDoc(userRef, { vocabulary: updatedVocab }, { merge: true });
  }

  private detectInsightMarkers(content: string): { score: number; evidence: string[] } {
    const insightMarkers = [
      { pattern: /I understand (now|better)/gi, weight: 10 },
      { pattern: /I realize/gi, weight: 15 },
      { pattern: /This makes me think/gi, weight: 8 },
      { pattern: /I'm learning/gi, weight: 12 },
      { pattern: /I can see/gi, weight: 10 },
      { pattern: /It's becoming clear/gi, weight: 18 },
      { pattern: /I'm starting to understand/gi, weight: 15 }
    ];
    
    let score = 0;
    const evidence: string[] = [];
    
    for (const marker of insightMarkers) {
      const matches = content.match(marker.pattern);
      if (matches) {
        score += matches.length * marker.weight;
        evidence.push(`Insight marker: "${matches[0]}"`);
      }
    }
    
    return { score, evidence };
  }

  private async getHistoricalInsightDepth(userId: string): Promise<{ average: number }> {
    // Simplified - would track historical insight depth scores
    return { average: 30 }; // Default baseline
  }

  private async queueInterventionDelivery(userId: string, campaign: any): Promise<void> {
    // Queue intervention for delivery through messaging system
    const queueRef = doc(collection(db, 'intervention_queue'));
    await setDoc(queueRef, {
      userId,
      campaign,
      scheduledFor: campaign.timing === 'immediate' ? serverTimestamp() : new Date(Date.now() + 24 * 60 * 60 * 1000),
      delivered: false
    });
  }
}

export const therapeuticMomentumEngine = new TherapeuticMomentumEngine();