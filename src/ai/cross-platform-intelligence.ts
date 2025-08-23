// Cross-Platform Intelligence - Holistic Wellness AI with Privacy-First Integration
// Problem: Wellness data is scattered across platforms, creating incomplete insights
// Solution: Privacy-first data integration that builds comprehensive wellness understanding

import { z } from 'zod';
import { logger } from '@/lib/logging';
import { traumaInformedEngine } from './trauma-informed-engine';
import { predictiveWellnessEngine } from './predictive-wellness-engine';
import Redis from 'ioredis';

// Supported data platforms and sources
export interface DataPlatform {
  id: string;
  name: string;
  type: 'health' | 'fitness' | 'mental_health' | 'productivity' | 'social' | 'sleep' | 'nutrition';
  authType: 'oauth2' | 'api_key' | 'webhook' | 'manual';
  privacyLevel: 'anonymous' | 'aggregated' | 'personal';
  dataTypes: string[];
  refreshRate: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

// Wellness data integration point
export interface WellnessDataSource {
  platform: string;
  dataType: string;
  value: number | string | boolean;
  timestamp: Date;
  confidence: number; // 0-1, how reliable this data is
  source: 'direct' | 'inferred' | 'aggregated';
  metadata?: Record<string, any>;
}

// Holistic wellness profile
export interface HolisticWellnessProfile {
  userId: string;
  physicalHealth: {
    activityLevel: number; // 0-10
    sleepQuality: number; // 0-10
    nutritionScore: number; // 0-10
    vitalSigns: {
      heartRateVariability?: number;
      restingHeartRate?: number;
      bloodPressure?: string;
    };
    fitnessMetrics: {
      weeklyActiveMinutes: number;
      averageSteps: number;
      exerciseFrequency: number;
    };
  };
  mentalHealth: {
    moodStability: number; // 0-10
    stressLevel: number; // 0-10
    anxietyLevel: number; // 0-10
    resilience: number; // 0-10
    copingStrategiesEffectiveness: number; // 0-10
    journalingConsistency: number; // 0-10
  };
  socialWellness: {
    connectionQuality: number; // 0-10
    supportSystemStrength: number; // 0-10
    socialEngagement: number; // 0-10
    professionalSupport: boolean;
  };
  cognitiveWellness: {
    focusQuality: number; // 0-10
    productivityLevel: number; // 0-10
    learningEngagement: number; // 0-10
    memoryFunction: number; // 0-10
  };
  spiritualWellness: {
    purposeClarity: number; // 0-10
    valueAlignment: number; // 0-10
    mindfulnessPractice: number; // 0-10
    gratitudePractice: number; // 0-10
  };
  environmentalFactors: {
    workStressLevel: number; // 0-10
    homeEnvironmentQuality: number; // 0-10
    financialStress: number; // 0-10
    seasonalAffect: number; // 0-10
  };
  overallWellnessScore: number; // 0-100
  lastUpdated: Date;
  dataCompletenessScore: number; // 0-1, how complete the profile is
}

// Cross-platform insight
export interface CrossPlatformInsight {
  type: 'correlation' | 'pattern' | 'recommendation' | 'warning' | 'celebration';
  title: string;
  description: string;
  confidence: number; // 0-1
  dataSources: string[]; // Which platforms contributed to this insight
  actionable: boolean;
  suggestedActions?: string[];
  impact: 'low' | 'medium' | 'high';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  wellnessDomains: string[]; // Which wellness areas this affects
}

// Data integration request
const DataIntegrationRequest = z.object({
  platforms: z.array(z.object({
    platformId: z.string(),
    authToken: z.string().optional(),
    dataTypes: z.array(z.string()),
    syncFrequency: z.enum(['realtime', 'hourly', 'daily', 'weekly']).default('daily')
  })),
  privacySettings: z.object({
    allowCorrelationAnalysis: z.boolean().default(true),
    shareAggregatedData: z.boolean().default(false),
    retentionPeriodDays: z.number().min(1).max(365).default(90),
    anonymizePersonalData: z.boolean().default(true)
  }),
  analyticsPreferences: z.object({
    enablePredictiveInsights: z.boolean().default(true),
    enableCrossCorrelations: z.boolean().default(true),
    focusAreas: z.array(z.string()).default([])
  })
});

export type DataIntegrationRequest = z.infer<typeof DataIntegrationRequest>;

// Supported platforms registry
const SUPPORTED_PLATFORMS: Record<string, DataPlatform> = {
  apple_health: {
    id: 'apple_health',
    name: 'Apple Health',
    type: 'health',
    authType: 'oauth2',
    privacyLevel: 'personal',
    dataTypes: ['steps', 'heart_rate', 'sleep', 'workout', 'mindfulness'],
    refreshRate: 'hourly'
  },
  google_fit: {
    id: 'google_fit',
    name: 'Google Fit',
    type: 'fitness',
    authType: 'oauth2',
    privacyLevel: 'personal',
    dataTypes: ['activity', 'location', 'nutrition', 'body_measurements'],
    refreshRate: 'hourly'
  },
  fitbit: {
    id: 'fitbit',
    name: 'Fitbit',
    type: 'fitness',
    authType: 'oauth2',
    privacyLevel: 'personal',
    dataTypes: ['steps', 'heart_rate', 'sleep', 'exercise', 'weight'],
    refreshRate: 'hourly'
  },
  oura: {
    id: 'oura',
    name: 'Oura Ring',
    type: 'sleep',
    authType: 'oauth2',
    privacyLevel: 'personal',
    dataTypes: ['sleep', 'readiness', 'activity', 'heart_rate_variability'],
    refreshRate: 'daily'
  },
  headspace: {
    id: 'headspace',
    name: 'Headspace',
    type: 'mental_health',
    authType: 'api_key',
    privacyLevel: 'aggregated',
    dataTypes: ['meditation_sessions', 'mindfulness_minutes', 'focus_sessions'],
    refreshRate: 'daily'
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    type: 'mental_health',
    authType: 'oauth2',
    privacyLevel: 'aggregated',
    dataTypes: ['music_mood', 'listening_patterns', 'energy_levels'],
    refreshRate: 'daily'
  },
  rescue_time: {
    id: 'rescue_time',
    name: 'RescueTime',
    type: 'productivity',
    authType: 'api_key',
    privacyLevel: 'aggregated',
    dataTypes: ['screen_time', 'productivity_score', 'focus_time', 'distraction_time'],
    refreshRate: 'daily'
  },
  calendar: {
    id: 'calendar',
    name: 'Calendar Integration',
    type: 'productivity',
    authType: 'oauth2',
    privacyLevel: 'aggregated',
    dataTypes: ['meeting_load', 'free_time', 'work_life_balance'],
    refreshRate: 'hourly'
  }
};

// Privacy-first data processor
class PrivacyFirstDataProcessor {
  private redis: Redis;
  private readonly ENCRYPTED_DATA_TTL = 7 * 24 * 60 * 60; // 7 days

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }

  // Process raw platform data into wellness insights
  async processRawData(
    userId: string,
    platformData: Record<string, WellnessDataSource[]>,
    privacySettings: any
  ): Promise<WellnessDataSource[]> {
    const processedData: WellnessDataSource[] = [];

    for (const [platform, dataPoints] of Object.entries(platformData)) {
      for (const dataPoint of dataPoints) {
        // Apply privacy filters
        const processedPoint = await this.applyPrivacyFilters(dataPoint, privacySettings);
        
        // Normalize data format
        const normalizedPoint = this.normalizeDataPoint(processedPoint, platform);
        
        // Validate data quality
        if (this.validateDataQuality(normalizedPoint)) {
          processedData.push(normalizedPoint);
        }
      }
    }

    // Store processed data temporarily for analysis
    await this.storeProcessedData(userId, processedData, privacySettings.retentionPeriodDays);

    return processedData;
  }

  // Apply privacy filtering based on user settings
  private async applyPrivacyFilters(
    dataPoint: WellnessDataSource,
    privacySettings: any
  ): Promise<WellnessDataSource> {
    let filteredData = { ...dataPoint };

    // Anonymize personal data if requested
    if (privacySettings.anonymizePersonalData) {
      filteredData = this.anonymizeDataPoint(filteredData);
    }

    // Remove precise timestamps if privacy level is high
    if (privacySettings.privacyLevel === 'high') {
      filteredData.timestamp = new Date(
        Math.floor(filteredData.timestamp.getTime() / (60 * 60 * 1000)) * 60 * 60 * 1000
      ); // Round to nearest hour
    }

    return filteredData;
  }

  // Anonymize personally identifiable information
  private anonymizeDataPoint(dataPoint: WellnessDataSource): WellnessDataSource {
    const anonymized = { ...dataPoint };

    // Remove or hash specific location data
    if (anonymized.metadata?.location) {
      delete anonymized.metadata.location;
    }

    // Anonymize device identifiers
    if (anonymized.metadata?.deviceId) {
      anonymized.metadata.deviceId = this.hashValue(anonymized.metadata.deviceId);
    }

    return anonymized;
  }

  // Hash sensitive values
  private hashValue(value: string): string {
    return Buffer.from(value).toString('base64').slice(0, 8);
  }

  // Normalize data points to consistent format
  private normalizeDataPoint(dataPoint: WellnessDataSource, platform: string): WellnessDataSource {
    const normalized = { ...dataPoint };

    // Normalize value ranges to 0-10 scale where applicable
    if (dataPoint.dataType === 'mood' && typeof dataPoint.value === 'number') {
      normalized.value = this.normalizeToScale(dataPoint.value, 1, 5, 0, 10);
    }

    // Normalize activity data
    if (dataPoint.dataType === 'steps' && typeof dataPoint.value === 'number') {
      normalized.value = Math.min(10, dataPoint.value / 1000); // Cap at 10k steps = 10
    }

    // Add platform context
    normalized.metadata = {
      ...normalized.metadata,
      sourcePlatform: platform,
      normalizedAt: new Date()
    };

    return normalized;
  }

  // Normalize values to standard scale
  private normalizeToScale(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }

  // Validate data quality and reliability
  private validateDataQuality(dataPoint: WellnessDataSource): boolean {
    // Check timestamp validity
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    if (dataPoint.timestamp < oneYearAgo || dataPoint.timestamp > now) {
      return false;
    }

    // Check confidence score
    if (dataPoint.confidence < 0.3) {
      return false;
    }

    // Check value validity based on data type
    if (typeof dataPoint.value === 'number') {
      if (isNaN(dataPoint.value) || !isFinite(dataPoint.value)) {
        return false;
      }
    }

    return true;
  }

  // Store processed data with encryption and TTL
  private async storeProcessedData(
    userId: string,
    data: WellnessDataSource[],
    retentionDays: number
  ): Promise<void> {
    try {
      const dataKey = `processed_data:${userId}:${Date.now()}`;
      const encryptedData = this.encryptSensitiveData(data);
      
      await this.redis.setex(
        dataKey,
        retentionDays * 24 * 60 * 60,
        JSON.stringify(encryptedData)
      );
      
    } catch (error) {
      logger.warn('Failed to store processed data', error);
    }
  }

  // Simple encryption for sensitive data
  private encryptSensitiveData(data: WellnessDataSource[]): any {
    // In production, use proper encryption (AES-256)
    // For now, just base64 encode sensitive fields
    return data.map(point => ({
      ...point,
      value: typeof point.value === 'string' ? Buffer.from(point.value).toString('base64') : point.value
    }));
  }
}

// Holistic profile builder
class HolisticProfileBuilder {
  // Build comprehensive wellness profile from integrated data
  static buildProfile(
    userId: string,
    integratedData: WellnessDataSource[],
    existingProfile?: HolisticWellnessProfile
  ): HolisticWellnessProfile {
    const now = new Date();
    const recentData = integratedData.filter(
      point => now.getTime() - point.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );

    // Group data by wellness domain
    const physicalData = recentData.filter(d => this.isPhysicalHealthData(d.dataType));
    const mentalData = recentData.filter(d => this.isMentalHealthData(d.dataType));
    const socialData = recentData.filter(d => this.isSocialWellnessData(d.dataType));
    const cognitiveData = recentData.filter(d => this.isCognitiveWellnessData(d.dataType));
    const spiritualData = recentData.filter(d => this.isSpiritualWellnessData(d.dataType));
    const environmentalData = recentData.filter(d => this.isEnvironmentalData(d.dataType));

    const profile: HolisticWellnessProfile = {
      userId,
      physicalHealth: this.buildPhysicalHealthProfile(physicalData),
      mentalHealth: this.buildMentalHealthProfile(mentalData),
      socialWellness: this.buildSocialWellnessProfile(socialData),
      cognitiveWellness: this.buildCognitiveWellnessProfile(cognitiveData),
      spiritualWellness: this.buildSpiritualWellnessProfile(spiritualData),
      environmentalFactors: this.buildEnvironmentalProfile(environmentalData),
      overallWellnessScore: 0, // Will be calculated
      lastUpdated: now,
      dataCompletenessScore: this.calculateDataCompleteness(recentData)
    };

    // Calculate overall wellness score
    profile.overallWellnessScore = this.calculateOverallWellnessScore(profile);

    return profile;
  }

  // Build physical health profile
  private static buildPhysicalHealthProfile(data: WellnessDataSource[]): any {
    const activityData = data.filter(d => ['steps', 'activity', 'exercise'].includes(d.dataType));
    const sleepData = data.filter(d => d.dataType === 'sleep');
    const nutritionData = data.filter(d => d.dataType === 'nutrition');
    const vitalData = data.filter(d => ['heart_rate', 'blood_pressure', 'heart_rate_variability'].includes(d.dataType));

    return {
      activityLevel: this.calculateAverageScore(activityData),
      sleepQuality: this.calculateAverageScore(sleepData),
      nutritionScore: this.calculateAverageScore(nutritionData),
      vitalSigns: this.buildVitalSigns(vitalData),
      fitnessMetrics: this.buildFitnessMetrics(activityData)
    };
  }

  // Build mental health profile
  private static buildMentalHealthProfile(data: WellnessDataSource[]): any {
    const moodData = data.filter(d => d.dataType === 'mood');
    const stressData = data.filter(d => d.dataType === 'stress');
    const anxietyData = data.filter(d => d.dataType === 'anxiety');
    const journalData = data.filter(d => d.dataType === 'journal_entry');

    return {
      moodStability: this.calculateMoodStability(moodData),
      stressLevel: this.calculateAverageScore(stressData),
      anxietyLevel: this.calculateAverageScore(anxietyData),
      resilience: this.calculateResilience(data),
      copingStrategiesEffectiveness: this.calculateCopingEffectiveness(data),
      journalingConsistency: this.calculateJournalingConsistency(journalData)
    };
  }

  // Build social wellness profile
  private static buildSocialWellnessProfile(data: WellnessDataSource[]): any {
    const socialData = data.filter(d => d.dataType.includes('social'));
    const supportData = data.filter(d => d.dataType.includes('support'));

    return {
      connectionQuality: this.calculateAverageScore(socialData),
      supportSystemStrength: this.calculateAverageScore(supportData),
      socialEngagement: this.calculateSocialEngagement(data),
      professionalSupport: this.hasProfessionalSupport(data)
    };
  }

  // Build cognitive wellness profile
  private static buildCognitiveWellnessProfile(data: WellnessDataSource[]): any {
    const focusData = data.filter(d => ['focus', 'concentration'].includes(d.dataType));
    const productivityData = data.filter(d => d.dataType === 'productivity');
    const learningData = data.filter(d => d.dataType === 'learning');

    return {
      focusQuality: this.calculateAverageScore(focusData),
      productivityLevel: this.calculateAverageScore(productivityData),
      learningEngagement: this.calculateAverageScore(learningData),
      memoryFunction: this.inferMemoryFunction(data)
    };
  }

  // Build spiritual wellness profile
  private static buildSpiritualWellnessProfile(data: WellnessDataSource[]): any {
    const mindfulnessData = data.filter(d => d.dataType === 'mindfulness');
    const gratitudeData = data.filter(d => d.dataType === 'gratitude');

    return {
      purposeClarity: this.inferPurposeClarity(data),
      valueAlignment: this.inferValueAlignment(data),
      mindfulnessPractice: this.calculateAverageScore(mindfulnessData),
      gratitudePractice: this.calculateAverageScore(gratitudeData)
    };
  }

  // Build environmental factors profile
  private static buildEnvironmentalProfile(data: WellnessDataSource[]): any {
    const workData = data.filter(d => d.dataType.includes('work'));
    const homeData = data.filter(d => d.dataType.includes('home'));
    const financialData = data.filter(d => d.dataType.includes('financial'));

    return {
      workStressLevel: this.calculateAverageScore(workData),
      homeEnvironmentQuality: this.calculateAverageScore(homeData),
      financialStress: this.calculateAverageScore(financialData),
      seasonalAffect: this.calculateSeasonalAffect(data)
    };
  }

  // Helper methods for profile building
  private static calculateAverageScore(data: WellnessDataSource[]): number {
    if (data.length === 0) return 5; // Default neutral score

    const numericalData = data
      .filter(d => typeof d.value === 'number')
      .map(d => d.value as number);

    if (numericalData.length === 0) return 5;

    const sum = numericalData.reduce((total, value) => total + value, 0);
    return Math.round((sum / numericalData.length) * 10) / 10; // Round to 1 decimal
  }

  private static calculateMoodStability(moodData: WellnessDataSource[]): number {
    if (moodData.length < 3) return 5;

    const moodValues = moodData
      .filter(d => typeof d.value === 'number')
      .map(d => d.value as number)
      .sort((a, b) => a - b);

    // Calculate standard deviation
    const avg = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
    const variance = moodValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / moodValues.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher stability
    return Math.max(0, Math.min(10, 10 - (stdDev * 2)));
  }

  private static calculateResilience(data: WellnessDataSource[]): number {
    // Resilience inferred from recovery patterns after stress
    const stressData = data.filter(d => d.dataType === 'stress');
    const moodData = data.filter(d => d.dataType === 'mood');

    if (stressData.length === 0 || moodData.length === 0) return 7; // Default

    // Look for recovery patterns - this is simplified
    // In production, would use more sophisticated analysis
    return 7; // Placeholder for complex resilience calculation
  }

  private static calculateCopingEffectiveness(data: WellnessDataSource[]): number {
    const copingData = data.filter(d => d.dataType.includes('coping'));
    return this.calculateAverageScore(copingData);
  }

  private static calculateJournalingConsistency(journalData: WellnessDataSource[]): number {
    if (journalData.length === 0) return 0;

    // Calculate consistency over past week
    const daysWithEntries = new Set(
      journalData.map(d => d.timestamp.toDateString())
    ).size;

    return Math.min(10, (daysWithEntries / 7) * 10);
  }

  private static calculateSocialEngagement(data: WellnessDataSource[]): number {
    const socialData = data.filter(d => 
      d.dataType.includes('social') || 
      d.dataType.includes('communication') ||
      d.dataType.includes('connection')
    );

    return this.calculateAverageScore(socialData);
  }

  private static hasProfessionalSupport(data: WellnessDataSource[]): boolean {
    const professionalData = data.filter(d => 
      d.dataType.includes('therapy') ||
      d.dataType.includes('counseling') ||
      d.dataType.includes('professional_support')
    );

    return professionalData.length > 0;
  }

  private static inferMemoryFunction(data: WellnessDataSource[]): number {
    // Infer from cognitive performance and sleep quality
    const sleepData = data.filter(d => d.dataType === 'sleep');
    const focusData = data.filter(d => d.dataType === 'focus');

    const sleepScore = this.calculateAverageScore(sleepData);
    const focusScore = this.calculateAverageScore(focusData);

    return (sleepScore * 0.6 + focusScore * 0.4); // Sleep heavily influences memory
  }

  private static inferPurposeClarity(data: WellnessDataSource[]): number {
    // Infer from goal-setting behavior and life satisfaction
    const goalData = data.filter(d => d.dataType.includes('goal'));
    const satisfactionData = data.filter(d => d.dataType.includes('satisfaction'));

    return (this.calculateAverageScore(goalData) + this.calculateAverageScore(satisfactionData)) / 2;
  }

  private static inferValueAlignment(data: WellnessDataSource[]): number {
    // Infer from decision patterns and satisfaction
    return 7; // Placeholder for complex analysis
  }

  private static calculateSeasonalAffect(data: WellnessDataSource[]): number {
    const now = new Date();
    const month = now.getMonth();
    
    // Higher seasonal affect in winter months (Nov-Feb in Northern Hemisphere)
    if (month >= 10 || month <= 1) {
      return 3; // Higher seasonal impact
    } else if (month >= 2 && month <= 4) {
      return 2; // Moderate impact in spring
    } else {
      return 1; // Lower impact in summer/fall
    }
  }

  private static buildVitalSigns(vitalData: WellnessDataSource[]): any {
    const hrData = vitalData.filter(d => d.dataType === 'heart_rate');
    const hrvData = vitalData.filter(d => d.dataType === 'heart_rate_variability');
    const bpData = vitalData.filter(d => d.dataType === 'blood_pressure');

    return {
      heartRateVariability: hrvData.length > 0 ? this.calculateAverageScore(hrvData) : undefined,
      restingHeartRate: hrData.length > 0 ? this.calculateAverageScore(hrData) : undefined,
      bloodPressure: bpData.length > 0 ? String(bpData[bpData.length - 1].value) : undefined
    };
  }

  private static buildFitnessMetrics(activityData: WellnessDataSource[]): any {
    const stepsData = activityData.filter(d => d.dataType === 'steps');
    const exerciseData = activityData.filter(d => d.dataType === 'exercise');

    return {
      weeklyActiveMinutes: exerciseData.length * 30, // Estimate
      averageSteps: this.calculateAverageScore(stepsData) * 1000, // Convert back to steps
      exerciseFrequency: exerciseData.length
    };
  }

  private static calculateOverallWellnessScore(profile: HolisticWellnessProfile): number {
    const weights = {
      physical: 0.25,
      mental: 0.30,
      social: 0.20,
      cognitive: 0.15,
      spiritual: 0.05,
      environmental: 0.05
    };

    const physicalScore = (
      profile.physicalHealth.activityLevel +
      profile.physicalHealth.sleepQuality +
      profile.physicalHealth.nutritionScore
    ) / 3;

    const mentalScore = (
      profile.mentalHealth.moodStability +
      (10 - profile.mentalHealth.stressLevel) +
      (10 - profile.mentalHealth.anxietyLevel) +
      profile.mentalHealth.resilience
    ) / 4;

    const socialScore = (
      profile.socialWellness.connectionQuality +
      profile.socialWellness.supportSystemStrength +
      profile.socialWellness.socialEngagement
    ) / 3;

    const cognitiveScore = (
      profile.cognitiveWellness.focusQuality +
      profile.cognitiveWellness.productivityLevel +
      profile.cognitiveWellness.memoryFunction
    ) / 3;

    const spiritualScore = (
      profile.spiritualWellness.purposeClarity +
      profile.spiritualWellness.valueAlignment +
      profile.spiritualWellness.mindfulnessPractice
    ) / 3;

    const environmentalScore = (
      (10 - profile.environmentalFactors.workStressLevel) +
      profile.environmentalFactors.homeEnvironmentQuality +
      (10 - profile.environmentalFactors.financialStress)
    ) / 3;

    const overallScore = (
      physicalScore * weights.physical +
      mentalScore * weights.mental +
      socialScore * weights.social +
      cognitiveScore * weights.cognitive +
      spiritualScore * weights.spiritual +
      environmentalScore * weights.environmental
    ) * 10; // Convert to 0-100 scale

    return Math.round(overallScore);
  }

  private static calculateDataCompleteness(data: WellnessDataSource[]): number {
    const requiredDataTypes = [
      'mood', 'sleep', 'activity', 'stress', 'social', 'productivity'
    ];

    const presentDataTypes = new Set(data.map(d => d.dataType));
    const completeness = requiredDataTypes.filter(type => 
      Array.from(presentDataTypes).some(present => present.includes(type))
    ).length / requiredDataTypes.length;

    return Math.round(completeness * 100) / 100;
  }

  // Data type classification helpers
  private static isPhysicalHealthData(dataType: string): boolean {
    return ['steps', 'activity', 'exercise', 'sleep', 'nutrition', 'heart_rate', 'blood_pressure'].includes(dataType);
  }

  private static isMentalHealthData(dataType: string): boolean {
    return ['mood', 'stress', 'anxiety', 'journal_entry', 'meditation', 'mindfulness'].includes(dataType);
  }

  private static isSocialWellnessData(dataType: string): boolean {
    return dataType.includes('social') || dataType.includes('support') || dataType.includes('relationship');
  }

  private static isCognitiveWellnessData(dataType: string): boolean {
    return ['focus', 'productivity', 'learning', 'concentration', 'memory'].includes(dataType);
  }

  private static isSpiritualWellnessData(dataType: string): boolean {
    return ['mindfulness', 'gratitude', 'purpose', 'values', 'meaning'].includes(dataType);
  }

  private static isEnvironmentalData(dataType: string): boolean {
    return dataType.includes('work') || dataType.includes('home') || dataType.includes('financial') || dataType.includes('environment');
  }
}

// Cross-platform correlation analyzer
class CrossPlatformCorrelationAnalyzer {
  // Find meaningful correlations between different data sources
  static async analyzeCorrelations(
    profile: HolisticWellnessProfile,
    integratedData: WellnessDataSource[]
  ): Promise<CrossPlatformInsight[]> {
    const insights: CrossPlatformInsight[] = [];

    // Analyze sleep-mood correlations
    const sleepMoodInsight = await this.analyzeSleepMoodCorrelation(integratedData);
    if (sleepMoodInsight) insights.push(sleepMoodInsight);

    // Analyze activity-energy correlations
    const activityEnergyInsight = await this.analyzeActivityEnergyCorrelation(integratedData);
    if (activityEnergyInsight) insights.push(activityEnergyInsight);

    // Analyze work-stress correlations
    const workStressInsight = await this.analyzeWorkStressCorrelation(integratedData);
    if (workStressInsight) insights.push(workStressInsight);

    // Analyze social-mood correlations
    const socialMoodInsight = await this.analyzeSocialMoodCorrelation(integratedData);
    if (socialMoodInsight) insights.push(socialMoodInsight);

    // Generate holistic recommendations
    const holisticInsights = this.generateHolisticRecommendations(profile);
    insights.push(...holisticInsights);

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private static async analyzeSleepMoodCorrelation(data: WellnessDataSource[]): Promise<CrossPlatformInsight | null> {
    const sleepData = data.filter(d => d.dataType === 'sleep');
    const moodData = data.filter(d => d.dataType === 'mood');

    if (sleepData.length < 5 || moodData.length < 5) return null;

    // Calculate correlation coefficient (simplified)
    const correlation = this.calculateCorrelation(sleepData, moodData);

    if (Math.abs(correlation) > 0.6) {
      return {
        type: 'correlation',
        title: 'Sleep-Mood Connection Detected',
        description: correlation > 0 
          ? 'Your sleep quality strongly correlates with your mood the next day. Better sleep leads to better mood.'
          : 'There\'s an inverse relationship between your sleep patterns and mood. Consider adjusting your sleep routine.',
        confidence: Math.abs(correlation),
        dataSources: ['sleep_tracker', 'mood_journal'],
        actionable: true,
        suggestedActions: [
          'Prioritize 7-9 hours of sleep',
          'Maintain consistent sleep schedule',
          'Create relaxing bedtime routine'
        ],
        impact: 'high',
        timeframe: 'short_term',
        wellnessDomains: ['physical', 'mental']
      };
    }

    return null;
  }

  private static async analyzeActivityEnergyCorrelation(data: WellnessDataSource[]): Promise<CrossPlatformInsight | null> {
    const activityData = data.filter(d => ['steps', 'exercise', 'activity'].includes(d.dataType));
    const energyData = data.filter(d => d.dataType === 'energy');

    if (activityData.length < 3 || energyData.length < 3) return null;

    const correlation = this.calculateCorrelation(activityData, energyData);

    if (correlation > 0.5) {
      return {
        type: 'pattern',
        title: 'Activity Boosts Your Energy',
        description: 'Your physical activity levels correlate with higher energy throughout the day.',
        confidence: correlation,
        dataSources: ['fitness_tracker', 'energy_journal'],
        actionable: true,
        suggestedActions: [
          'Take short walking breaks during low-energy periods',
          'Schedule workouts before energy-demanding tasks',
          'Consider morning exercise routine'
        ],
        impact: 'medium',
        timeframe: 'immediate',
        wellnessDomains: ['physical', 'cognitive']
      };
    }

    return null;
  }

  private static async analyzeWorkStressCorrelation(data: WellnessDataSource[]): Promise<CrossPlatformInsight | null> {
    const workData = data.filter(d => d.dataType.includes('work'));
    const stressData = data.filter(d => d.dataType === 'stress');

    if (workData.length < 3 || stressData.length < 3) return null;

    const correlation = this.calculateCorrelation(workData, stressData);

    if (correlation > 0.6) {
      return {
        type: 'warning',
        title: 'Work Load Affecting Stress Levels',
        description: 'Your work-related activities show a strong correlation with stress levels.',
        confidence: correlation,
        dataSources: ['calendar', 'stress_tracking'],
        actionable: true,
        suggestedActions: [
          'Schedule regular breaks during work',
          'Practice stress management techniques',
          'Consider workload discussion with supervisor'
        ],
        impact: 'high',
        timeframe: 'short_term',
        wellnessDomains: ['mental', 'environmental']
      };
    }

    return null;
  }

  private static async analyzeSocialMoodCorrelation(data: WellnessDataSource[]): Promise<CrossPlatformInsight | null> {
    const socialData = data.filter(d => d.dataType.includes('social'));
    const moodData = data.filter(d => d.dataType === 'mood');

    if (socialData.length < 3 || moodData.length < 3) return null;

    const correlation = this.calculateCorrelation(socialData, moodData);

    if (correlation > 0.5) {
      return {
        type: 'recommendation',
        title: 'Social Connection Improves Mood',
        description: 'Your social interactions have a positive impact on your mood and well-being.',
        confidence: correlation,
        dataSources: ['social_media', 'calendar', 'mood_journal'],
        actionable: true,
        suggestedActions: [
          'Schedule regular social activities',
          'Reach out to friends during low mood periods',
          'Join community or interest groups'
        ],
        impact: 'high',
        timeframe: 'short_term',
        wellnessDomains: ['social', 'mental']
      };
    }

    return null;
  }

  private static generateHolisticRecommendations(profile: HolisticWellnessProfile): CrossPlatformInsight[] {
    const insights: CrossPlatformInsight[] = [];

    // Overall wellness score insights
    if (profile.overallWellnessScore < 60) {
      insights.push({
        type: 'recommendation',
        title: 'Focus on Foundation Wellness Areas',
        description: 'Your overall wellness score suggests focusing on basic wellness fundamentals would provide the most benefit.',
        confidence: 0.8,
        dataSources: ['comprehensive_analysis'],
        actionable: true,
        suggestedActions: [
          'Prioritize sleep quality and consistency',
          'Increase daily physical activity',
          'Practice stress management techniques'
        ],
        impact: 'high',
        timeframe: 'long_term',
        wellnessDomains: ['physical', 'mental']
      });
    }

    // Data completeness insights
    if (profile.dataCompletenessScore < 0.7) {
      insights.push({
        type: 'recommendation',
        title: 'Improve Wellness Tracking Coverage',
        description: 'More comprehensive data tracking would enable better personalized insights.',
        confidence: 0.7,
        dataSources: ['data_analysis'],
        actionable: true,
        suggestedActions: [
          'Connect additional wellness platforms',
          'Regular mood and energy check-ins',
          'Track sleep patterns consistently'
        ],
        impact: 'medium',
        timeframe: 'short_term',
        wellnessDomains: ['all']
      });
    }

    return insights;
  }

  // Simple correlation calculation
  private static calculateCorrelation(
    dataA: WellnessDataSource[],
    dataB: WellnessDataSource[]
  ): number {
    // This is a simplified correlation calculation
    // In production, would use proper statistical correlation with time alignment
    
    const valuesA = dataA.filter(d => typeof d.value === 'number').map(d => d.value as number);
    const valuesB = dataB.filter(d => typeof d.value === 'number').map(d => d.value as number);

    if (valuesA.length < 3 || valuesB.length < 3) return 0;

    // Take equal length samples
    const minLength = Math.min(valuesA.length, valuesB.length);
    const a = valuesA.slice(0, minLength);
    const b = valuesB.slice(0, minLength);

    // Calculate Pearson correlation coefficient
    const n = a.length;
    const sumA = a.reduce((sum, val) => sum + val, 0);
    const sumB = b.reduce((sum, val) => sum + val, 0);
    const sumAB = a.reduce((sum, val, i) => sum + (val * b[i]), 0);
    const sumA2 = a.reduce((sum, val) => sum + (val * val), 0);
    const sumB2 = b.reduce((sum, val) => sum + (val * val), 0);

    const numerator = (n * sumAB) - (sumA * sumB);
    const denominator = Math.sqrt(((n * sumA2) - (sumA * sumA)) * ((n * sumB2) - (sumB * sumB)));

    return denominator === 0 ? 0 : numerator / denominator;
  }
}

// Main Cross-Platform Intelligence Engine
export class CrossPlatformIntelligenceEngine {
  private dataProcessor: PrivacyFirstDataProcessor;
  
  constructor() {
    this.dataProcessor = new PrivacyFirstDataProcessor();
  }

  // Process integrated wellness data and generate holistic insights
  async generateHolisticInsights(
    userId: string,
    integratedData: Record<string, WellnessDataSource[]>,
    privacySettings: any,
    analyticsPreferences: any
  ): Promise<{
    profile: HolisticWellnessProfile;
    insights: CrossPlatformInsight[];
    recommendations: string[];
  }> {
    try {
      // Process raw data with privacy filters
      const processedData = await this.dataProcessor.processRawData(
        userId,
        integratedData,
        privacySettings
      );

      // Build holistic wellness profile
      const profile = HolisticProfileBuilder.buildProfile(userId, processedData);

      // Generate cross-platform insights
      let insights: CrossPlatformInsight[] = [];
      if (analyticsPreferences.enableCrossCorrelations) {
        insights = await CrossPlatformCorrelationAnalyzer.analyzeCorrelations(profile, processedData);
      }

      // Filter insights based on user preferences
      if (analyticsPreferences.focusAreas.length > 0) {
        insights = insights.filter(insight => 
          insight.wellnessDomains.some(domain => 
            analyticsPreferences.focusAreas.includes(domain)
          )
        );
      }

      // Generate actionable recommendations
      const recommendations = this.generateRecommendations(profile, insights);

      logger.info('Holistic insights generated', {
        userId: userId.slice(0, 8) + '...',
        overallWellnessScore: profile.overallWellnessScore,
        dataCompletenessScore: profile.dataCompletenessScore,
        insightCount: insights.length,
        dataPlatforms: Object.keys(integratedData).length
      });

      return {
        profile,
        insights: insights.slice(0, 10), // Limit to top 10 insights
        recommendations
      };

    } catch (error) {
      logger.error('Error generating holistic insights', error);
      throw error;
    }
  }

  // Generate actionable recommendations from profile and insights
  private generateRecommendations(
    profile: HolisticWellnessProfile,
    insights: CrossPlatformInsight[]
  ): string[] {
    const recommendations = new Set<string>();

    // Add suggestions from high-impact insights
    insights
      .filter(insight => insight.impact === 'high' && insight.actionable)
      .forEach(insight => {
        insight.suggestedActions?.forEach(action => recommendations.add(action));
      });

    // Add profile-based recommendations
    if (profile.physicalHealth.sleepQuality < 6) {
      recommendations.add('Focus on improving sleep quality - aim for 7-9 hours nightly');
    }

    if (profile.mentalHealth.stressLevel > 7) {
      recommendations.add('Implement daily stress management techniques like deep breathing or meditation');
    }

    if (profile.socialWellness.connectionQuality < 6) {
      recommendations.add('Prioritize social connections - schedule regular time with friends or family');
    }

    if (profile.physicalHealth.activityLevel < 5) {
      recommendations.add('Increase daily physical activity - even 10-minute walks can make a difference');
    }

    // Ensure we have at least 3 recommendations
    if (recommendations.size < 3) {
      recommendations.add('Continue regular journaling to track patterns and progress');
      recommendations.add('Maintain consistent daily routines for better wellness stability');
      recommendations.add('Celebrate small wins and progress in your wellness journey');
    }

    return Array.from(recommendations).slice(0, 7); // Limit to 7 recommendations
  }

  // Get supported platforms
  getSupportedPlatforms(): DataPlatform[] {
    return Object.values(SUPPORTED_PLATFORMS);
  }

  // Validate platform integration
  async validatePlatformIntegration(platformId: string, authToken: string): Promise<boolean> {
    const platform = SUPPORTED_PLATFORMS[platformId];
    if (!platform) return false;

    // In production, would validate auth token with platform API
    return authToken.length > 10; // Simple validation
  }
}

// Export for API integration
export const crossPlatformIntelligenceEngine = new CrossPlatformIntelligenceEngine();
export { DataIntegrationRequest, HolisticWellnessProfile, CrossPlatformInsight, SUPPORTED_PLATFORMS };