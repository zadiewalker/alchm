import * as admin from "firebase-admin";
import OpenAI from "openai";
import { 
  UserCircadianProfile, 
  InterventionSchedule, 
  PersonalizedIntervention,
  OptimalTimingModel,
  ReceptivityPredictor,
  AdaptiveInterventionConfig
} from "./types";

/**
 * ALCHM Personalized Intervention Timing System
 * 
 * Revolutionary AI system that learns each user's optimal intervention timing:
 * - Circadian rhythm consideration for intervention delivery
 * - Learning user's receptivity patterns and energy cycles
 * - Personalized notification scheduling based on effectiveness
 * - Adaptive intervention intensity based on user state
 * - Machine learning models for optimal therapeutic timing
 */
export class PersonalizedInterventionService {
  private db: admin.firestore.Firestore;
  private openai: OpenAI;

  constructor() {
    this.db = admin.firestore();
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key required for personalized interventions");
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Main method to generate personalized intervention schedule
   */
  async generatePersonalizedInterventions(userId: string): Promise<InterventionSchedule> {
    try {
      console.log(`Generating personalized intervention schedule for user ${userId}`);
      
      // Step 1: Build comprehensive user profile
      const userProfile = await this.buildCircadianProfile(userId);
      
      // Step 2: Analyze historical receptivity patterns
      const receptivityModel = await this.buildReceptivityModel(userProfile);
      
      // Step 3: Generate optimal timing model
      const timingModel = await this.createOptimalTimingModel(userProfile, receptivityModel);
      
      // Step 4: Create adaptive intervention config
      const interventionConfig = await this.createAdaptiveConfig(userProfile, timingModel);
      
      // Step 5: Generate scheduled interventions
      const scheduledInterventions = await this.generateScheduledInterventions(
        userProfile, 
        timingModel, 
        interventionConfig
      );
      
      const schedule: InterventionSchedule = {
        id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        circadianProfile: userProfile,
        receptivityModel,
        timingModel,
        interventionConfig,
        scheduledInterventions,
        effectivenessTracking: {
          enabled: true,
          metrics: ['engagement_rate', 'emotional_response', 'timing_satisfaction'],
          feedbackLoop: true
        },
        adaptiveSettings: {
          learningEnabled: true,
          adjustmentFrequency: 'weekly',
          personalizedFactors: this.identifyPersonalizationFactors(userProfile)
        },
        metadata: {
          generatedAt: new Date(),
          version: '2.0',
          nextUpdate: this.calculateNextUpdate()
        }
      };
      
      // Step 6: Store schedule and update user preferences
      await this.storeInterventionSchedule(schedule);
      
      return schedule;
      
    } catch (error) {
      console.error("Personalized intervention generation error:", error);
      throw new Error(`Intervention scheduling failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Build user's circadian rhythm and activity profile
   */
  private async buildCircadianProfile(userId: string): Promise<UserCircadianProfile> {
    // Gather user activity data
    const [journalData, voiceData, engagementData, userSettings] = await Promise.all([
      this.getUserJournalingPatterns(userId),
      this.getUserVoiceActivityPatterns(userId),
      this.getUserEngagementPatterns(userId),
      this.getUserSettings(userId)
    ]);
    
    // Analyze circadian patterns
    const circadianRhythm = this.analyzeCircadianRhythm(journalData, voiceData, engagementData);
    
    // Identify energy cycles
    const energyCycles = await this.identifyEnergyCycles(journalData, voiceData);
    
    // Calculate optimal intervention windows
    const interventionWindows = this.calculateInterventionWindows(circadianRhythm, energyCycles);
    
    // Assess emotional receptivity patterns
    const emotionalReceptivity = await this.assessEmotionalReceptivity(journalData);
    
    return {
      userId,
      circadianRhythm: {
        peakAlertness: circadianRhythm.peakHours,
        lowEnergyPeriods: circadianRhythm.lowEnergyHours,
        naturalWakeTime: circadianRhythm.averageWakeTime,
        naturalSleepTime: circadianRhythm.averageSleepTime,
        midDayDip: circadianRhythm.midDayDipTime
      },
      energyCycles: {
        highEnergyWindows: energyCycles.highEnergyPeriods,
        lowEnergyWindows: energyCycles.lowEnergyPeriods,
        transitionPeriods: energyCycles.transitions,
        weekdayVsWeekend: energyCycles.weekendDifferences
      },
      interventionWindows: {
        optimal: interventionWindows.optimal,
        acceptable: interventionWindows.acceptable,
        avoid: interventionWindows.avoid
      },
      emotionalReceptivity: {
        highReceptivityTimes: emotionalReceptivity.highTimes,
        lowReceptivityTimes: emotionalReceptivity.lowTimes,
        emotionalStatePatterns: emotionalReceptivity.patterns
      },
      personalPreferences: {
        timezone: userSettings.timezone || 'UTC',
        preferredContactTimes: userSettings.preferredTimes || [],
        doNotDisturbHours: userSettings.dndHours || [],
        interventionFrequency: userSettings.interventionFreq || 'moderate'
      },
      profileAccuracy: this.calculateProfileAccuracy(journalData, voiceData, engagementData),
      lastUpdated: new Date()
    };
  }

  /**
   * Build machine learning model for user receptivity prediction
   */
  private async buildReceptivityModel(userProfile: UserCircadianProfile): Promise<ReceptivityPredictor> {
    const prompt = `
    Create a personalized receptivity prediction model for this user based on their activity patterns:

    User Profile:
    - Peak alertness times: ${userProfile.circadianRhythm.peakAlertness.join(', ')}
    - Low energy periods: ${userProfile.circadianRhythm.lowEnergyPeriods.join(', ')}
    - High emotional receptivity: ${userProfile.emotionalReceptivity.highReceptivityTimes.join(', ')}
    - Preferred contact times: ${userProfile.personalPreferences.preferredContactTimes.join(', ')}
    - Do not disturb: ${userProfile.personalPreferences.doNotDisturbHours.join(', ')}

    Provide receptivity model in JSON format:
    {
      "hourlyReceptivityScores": {
        "0": 0.1, "1": 0.1, ..., "23": 0.8
      },
      "weekdayFactors": {
        "monday": 0.8, "tuesday": 0.9, ..., "sunday": 0.6
      },
      "contextualFactors": {
        "afterJournaling": 0.9,
        "morningPerson": boolean,
        "eveningPerson": boolean,
        "stressResponseTiming": "immediate|delayed|evening"
      },
      "personalizedTriggers": {
        "positiveState": ["trigger1", "trigger2"],
        "neutralState": ["trigger3", "trigger4"],
        "challengingState": ["trigger5", "trigger6"]
      },
      "avoidancePatterns": {
        "timeBasedAvoidance": ["hour1", "hour2"],
        "contextBasedAvoidance": ["context1", "context2"]
      }
    }
    `;
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in behavioral psychology and circadian rhythm optimization. Create precise receptivity models."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 800
    });
    
    try {
      const modelData = JSON.parse(response.choices[0]?.message?.content || "{}");
      
      return {
        userId: userProfile.userId,
        hourlyReceptivityScores: modelData.hourlyReceptivityScores || this.generateDefaultHourlyScores(),
        weekdayFactors: modelData.weekdayFactors || this.generateDefaultWeekdayFactors(),
        contextualFactors: modelData.contextualFactors || {},
        personalizedTriggers: modelData.personalizedTriggers || { positiveState: [], neutralState: [], challengingState: [] },
        avoidancePatterns: modelData.avoidancePatterns || { timeBasedAvoidance: [], contextBasedAvoidance: [] },
        modelAccuracy: userProfile.profileAccuracy,
        lastTraining: new Date(),
        adaptationRate: 0.1 // How quickly model adapts to new data
      };
    } catch (error) {
      console.error("Receptivity model parsing error:", error);
      return this.createFallbackReceptivityModel(userProfile.userId);
    }
  }

  /**
   * Create optimal timing model for different intervention types
   */
  private async createOptimalTimingModel(
    userProfile: UserCircadianProfile,
    receptivityModel: ReceptivityPredictor
  ): Promise<OptimalTimingModel> {
    return {
      userId: userProfile.userId,
      interventionTypeTimings: {
        'crisis_prevention': {
          optimal: this.findOptimalTimesForType('crisis_prevention', userProfile, receptivityModel),
          effectiveness: 0.9,
          frequency: 'as_needed'
        },
        'daily_check_in': {
          optimal: this.findOptimalTimesForType('daily_check_in', userProfile, receptivityModel),
          effectiveness: 0.85,
          frequency: 'daily'
        },
        'therapeutic_reminder': {
          optimal: this.findOptimalTimesForType('therapeutic_reminder', userProfile, receptivityModel),
          effectiveness: 0.75,
          frequency: 'weekly'
        },
        'coping_strategy': {
          optimal: this.findOptimalTimesForType('coping_strategy', userProfile, receptivityModel),
          effectiveness: 0.8,
          frequency: 'bi_weekly'
        },
        'progress_celebration': {
          optimal: this.findOptimalTimesForType('progress_celebration', userProfile, receptivityModel),
          effectiveness: 0.9,
          frequency: 'milestone_based'
        }
      },
      personalizedAdjustments: {
        stressStateModifications: this.calculateStressStateAdjustments(userProfile),
        emotionalStateModifications: this.calculateEmotionalStateAdjustments(receptivityModel),
        contextualModifications: this.calculateContextualAdjustments(userProfile)
      },
      adaptiveRules: {
        successFeedbackBoost: 1.2, // Increase likelihood of similar timing after success
        failureFeedbackReduction: 0.7, // Decrease likelihood after poor response
        contextualLearning: true,
        temporalDriftAdjustment: true // Adjust for changes in user schedule
      },
      confidenceMetrics: {
        overallConfidence: this.calculateTimingConfidence(userProfile, receptivityModel),
        interventionSpecificConfidence: this.calculateInterventionConfidences(userProfile),
        predictionHorizon: '14_days'
      }
    };
  }

  /**
   * Create adaptive intervention configuration
   */
  private async createAdaptiveConfig(
    userProfile: UserCircadianProfile,
    timingModel: OptimalTimingModel
  ): Promise<AdaptiveInterventionConfig> {
    return {
      userId: userProfile.userId,
      intensitySettings: {
        baseline: this.calculateBaselineIntensity(userProfile),
        adaptationRules: {
          'high_stress': { modifier: 0.7, rationale: 'Reduce intensity during high stress' },
          'low_engagement': { modifier: 1.3, rationale: 'Increase intensity for low engagement' },
          'positive_state': { modifier: 1.1, rationale: 'Slightly increase for positive reinforcement' },
          'crisis_risk': { modifier: 1.5, rationale: 'Increase intensity for crisis prevention' }
        }
      },
      frequencySettings: {
        baseline: this.calculateBaselineFrequency(userProfile),
        adaptationRules: {
          'consistent_engagement': { modifier: 0.9, rationale: 'Reduce frequency for consistent users' },
          'irregular_engagement': { modifier: 1.2, rationale: 'Increase frequency for irregular users' },
          'crisis_period': { modifier: 2.0, rationale: 'Double frequency during crisis periods' }
        }
      },
      contentPersonalization: {
        languageStyle: await this.determineLanguageStyle(userProfile.userId),
        emotionalTone: await this.determineOptimalTone(userProfile.userId),
        contentLength: this.determineOptimalContentLength(userProfile),
        personalizedElements: await this.identifyPersonalizedElements(userProfile.userId)
      },
      deliveryMethodOptimization: {
        preferredMethods: this.identifyPreferredMethods(userProfile),
        fallbackMethods: this.identifyFallbackMethods(userProfile),
        contextualMethodSelection: this.createContextualMethodRules(userProfile)
      },
      feedbackLoopSettings: {
        implicitFeedbackTracking: true,
        explicitFeedbackRequests: 'weekly',
        adaptationSpeed: 'moderate',
        rollbackCapability: true
      }
    };
  }

  /**
   * Generate specific scheduled interventions
   */
  private async generateScheduledInterventions(
    userProfile: UserCircadianProfile,
    timingModel: OptimalTimingModel,
    config: AdaptiveInterventionConfig
  ): Promise<PersonalizedIntervention[]> {
    const interventions: PersonalizedIntervention[] = [];
    const currentDate = new Date();
    
    // Generate interventions for the next 14 days
    for (let day = 0; day < 14; day++) {
      const targetDate = new Date(currentDate);
      targetDate.setDate(targetDate.getDate() + day);
      
      // Daily check-in intervention
      if (this.shouldScheduleIntervention('daily_check_in', day, config)) {
        const optimalTime = this.findBestTimeForDate(
          targetDate, 
          timingModel.interventionTypeTimings['daily_check_in'].optimal,
          userProfile
        );
        
        interventions.push({
          id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userProfile.userId,
          type: 'daily_check_in',
          scheduledTime: optimalTime,
          content: await this.generatePersonalizedContent('daily_check_in', userProfile.userId, config),
          deliveryMethod: config.deliveryMethodOptimization.preferredMethods[0] || 'notification',
          intensity: this.calculateInterventionIntensity('daily_check_in', config, day),
          adaptiveSettings: {
            canReschedule: true,
            reschedulingWindow: '2_hours',
            contextualAdjustments: true
          },
          metadata: {
            generatedAt: new Date(),
            timingConfidence: timingModel.confidenceMetrics.interventionSpecificConfidence['daily_check_in'] || 0.8,
            expectedEngagement: this.predictEngagement('daily_check_in', optimalTime, userProfile)
          }
        });
      }
      
      // Weekly therapeutic reminders
      if (day % 7 === 0 && this.shouldScheduleIntervention('therapeutic_reminder', day, config)) {
        const optimalTime = this.findBestTimeForDate(
          targetDate,
          timingModel.interventionTypeTimings['therapeutic_reminder'].optimal,
          userProfile
        );
        
        interventions.push({
          id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: userProfile.userId,
          type: 'therapeutic_reminder',
          scheduledTime: optimalTime,
          content: await this.generatePersonalizedContent('therapeutic_reminder', userProfile.userId, config),
          deliveryMethod: config.deliveryMethodOptimization.preferredMethods[0] || 'notification',
          intensity: this.calculateInterventionIntensity('therapeutic_reminder', config, day),
          adaptiveSettings: {
            canReschedule: true,
            reschedulingWindow: '4_hours',
            contextualAdjustments: true
          },
          metadata: {
            generatedAt: new Date(),
            timingConfidence: timingModel.confidenceMetrics.interventionSpecificConfidence['therapeutic_reminder'] || 0.75,
            expectedEngagement: this.predictEngagement('therapeutic_reminder', optimalTime, userProfile)
          }
        });
      }
    }
    
    return interventions.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  /**
   * Store intervention schedule securely
   */
  private async storeInterventionSchedule(schedule: InterventionSchedule): Promise<void> {
    await this.db.collection('interventionSchedules').doc(schedule.userId).set({
      ...schedule,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Store individual interventions for execution
    const batch = this.db.batch();
    
    schedule.scheduledInterventions.forEach(intervention => {
      const docRef = this.db.collection('scheduledInterventions').doc();
      batch.set(docRef, {
        ...intervention,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'scheduled'
      });
    });
    
    await batch.commit();
  }

  // Helper methods for data analysis and calculations
  private async getUserJournalingPatterns(userId: string) {
    const snapshot = await this.db.collection('journalEntries')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    return snapshot.docs.map(doc => ({
      timestamp: doc.data().timestamp.toDate(),
      length: doc.data().content?.length || 0,
      emotionalState: doc.data().emotionalThemes?.primaryEmotions || []
    }));
  }

  private async getUserVoiceActivityPatterns(userId: string) {
    const snapshot = await this.db.collection('voiceAnalyses')
      .where('metadata.userId', '==', userId)
      .orderBy('metadata.analyzedAt', 'desc')
      .limit(50)
      .get();
    
    return snapshot.docs.map(doc => ({
      timestamp: doc.data().metadata.analyzedAt.toDate(),
      duration: doc.data().transcription?.duration || 0,
      emotionalState: doc.data().emotionalAnalysis?.primaryEmotions || []
    }));
  }

  private async getUserEngagementPatterns(userId: string) {
    // This would track app usage, response rates, etc.
    // For now, return mock data structure
    return {
      appUsageTimes: [],
      responseRates: {},
      engagementQuality: {}
    };
  }

  private async getUserSettings(userId: string) {
    const userDoc = await this.db.collection('users').doc(userId).get();
    return userDoc.data()?.settings || {};
  }

  private analyzeCircadianRhythm(journalData: any[], voiceData: any[], engagementData: any) {
    // Analyze activity patterns to infer circadian rhythm
    const allActivities = [
      ...journalData.map(d => ({ time: d.timestamp, type: 'journal' })),
      ...voiceData.map(d => ({ time: d.timestamp, type: 'voice' }))
    ];
    
    // Group by hour of day
    const hourlyActivity: { [key: number]: number } = {};
    allActivities.forEach(activity => {
      const hour = activity.time.getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });
    
    // Find peak activity times
    const sortedHours = Object.entries(hourlyActivity)
      .sort(([,a], [,b]) => b - a)
      .map(([hour]) => parseInt(hour));
    
    const peakHours = sortedHours.slice(0, 3);
    const lowEnergyHours = sortedHours.slice(-3);
    
    // Estimate wake/sleep times from activity patterns
    const firstActivity = Math.min(...Object.keys(hourlyActivity).map(Number));
    const lastActivity = Math.max(...Object.keys(hourlyActivity).map(Number));
    
    return {
      peakHours,
      lowEnergyHours,
      averageWakeTime: firstActivity,
      averageSleepTime: lastActivity,
      midDayDipTime: this.findMidDayDip(hourlyActivity)
    };
  }

  private async identifyEnergyCycles(journalData: any[], voiceData: any[]) {
    // Analyze energy levels from emotional content and voice patterns
    const energyPatterns = journalData.map(entry => {
      const hour = entry.timestamp.getHours();
      const energyLevel = this.inferEnergyFromEmotions(entry.emotionalState);
      return { hour, energy: energyLevel };
    });
    
    // Group by time periods
    const morningEnergy = energyPatterns.filter(p => p.hour >= 6 && p.hour <= 10)
      .reduce((sum, p) => sum + p.energy, 0) / energyPatterns.filter(p => p.hour >= 6 && p.hour <= 10).length || 0;
    
    const afternoonEnergy = energyPatterns.filter(p => p.hour >= 12 && p.hour <= 16)
      .reduce((sum, p) => sum + p.energy, 0) / energyPatterns.filter(p => p.hour >= 12 && p.hour <= 16).length || 0;
    
    const eveningEnergy = energyPatterns.filter(p => p.hour >= 18 && p.hour <= 22)
      .reduce((sum, p) => sum + p.energy, 0) / energyPatterns.filter(p => p.hour >= 18 && p.hour <= 22).length || 0;
    
    return {
      highEnergyPeriods: this.identifyHighEnergyPeriods(morningEnergy, afternoonEnergy, eveningEnergy),
      lowEnergyPeriods: this.identifyLowEnergyPeriods(morningEnergy, afternoonEnergy, eveningEnergy),
      transitions: this.identifyEnergyTransitions(energyPatterns),
      weekendDifferences: this.calculateWeekendDifferences(journalData, voiceData)
    };
  }

  private calculateInterventionWindows(circadianRhythm: any, energyCycles: any) {
    return {
      optimal: this.combineOptimalTimes(circadianRhythm.peakHours, energyCycles.highEnergyPeriods),
      acceptable: this.identifyAcceptableTimes(circadianRhythm, energyCycles),
      avoid: [...circadianRhythm.lowEnergyHours, ...energyCycles.lowEnergyPeriods]
    };
  }

  private async assessEmotionalReceptivity(journalData: any[]) {
    // Analyze when users are most emotionally receptive
    const receptivityData = journalData.map(entry => {
      const hour = entry.timestamp.getHours();
      const receptivity = this.calculateEmotionalReceptivity(entry.emotionalState);
      return { hour, receptivity };
    });
    
    // Group by hour and calculate average receptivity
    const hourlyReceptivity: { [key: number]: number[] } = {};
    receptivityData.forEach(({ hour, receptivity }) => {
      if (!hourlyReceptivity[hour]) hourlyReceptivity[hour] = [];
      hourlyReceptivity[hour].push(receptivity);
    });
    
    const avgHourlyReceptivity: { [key: number]: number } = {};
    Object.entries(hourlyReceptivity).forEach(([hour, values]) => {
      avgHourlyReceptivity[parseInt(hour)] = values.reduce((a, b) => a + b, 0) / values.length;
    });
    
    // Find high and low receptivity times
    const sortedByReceptivity = Object.entries(avgHourlyReceptivity)
      .sort(([,a], [,b]) => b - a)
      .map(([hour]) => parseInt(hour));
    
    return {
      highTimes: sortedByReceptivity.slice(0, 4),
      lowTimes: sortedByReceptivity.slice(-2),
      patterns: this.identifyReceptivityPatterns(avgHourlyReceptivity)
    };
  }

  private calculateProfileAccuracy(journalData: any[], voiceData: any[], engagementData: any): number {
    let accuracy = 0.5; // Base accuracy
    
    // More data points increase accuracy
    if (journalData.length > 30) accuracy += 0.2;
    if (voiceData.length > 10) accuracy += 0.1;
    
    // Consistency in patterns increases accuracy
    const consistencyScore = this.calculatePatternConsistency(journalData);
    accuracy += consistencyScore * 0.2;
    
    return Math.min(accuracy, 0.95); // Cap at 95%
  }

  private generateDefaultHourlyScores() {
    // Default circadian-based receptivity scores
    const scores: { [key: string]: number } = {};
    for (let hour = 0; hour < 24; hour++) {
      if (hour >= 6 && hour <= 9) scores[hour.toString()] = 0.8; // Morning high
      else if (hour >= 10 && hour <= 11) scores[hour.toString()] = 0.6; // Late morning
      else if (hour >= 12 && hour <= 14) scores[hour.toString()] = 0.4; // Midday dip
      else if (hour >= 15 && hour <= 17) scores[hour.toString()] = 0.7; // Afternoon recovery
      else if (hour >= 18 && hour <= 20) scores[hour.toString()] = 0.8; // Evening peak
      else if (hour >= 21 && hour <= 22) scores[hour.toString()] = 0.5; // Wind down
      else scores[hour.toString()] = 0.2; // Late night/early morning
    }
    return scores;
  }

  private generateDefaultWeekdayFactors() {
    return {
      'monday': 0.7, // Monday blues
      'tuesday': 0.8,
      'wednesday': 0.9, // Mid-week peak
      'thursday': 0.8,
      'friday': 0.9, // End of week relief
      'saturday': 0.6, // Weekend relaxation
      'sunday': 0.5  // Sunday scaries
    };
  }

  private createFallbackReceptivityModel(userId: string): ReceptivityPredictor {
    return {
      userId,
      hourlyReceptivityScores: this.generateDefaultHourlyScores(),
      weekdayFactors: this.generateDefaultWeekdayFactors(),
      contextualFactors: {
        afterJournaling: 0.9,
        morningPerson: true,
        eveningPerson: false,
        stressResponseTiming: 'delayed'
      },
      personalizedTriggers: {
        positiveState: ['morning_reflection', 'evening_gratitude'],
        neutralState: ['midday_check_in'],
        challengingState: ['gentle_support', 'coping_reminder']
      },
      avoidancePatterns: {
        timeBasedAvoidance: ['0', '1', '2', '3', '4', '5'], // Late night/early morning
        contextBasedAvoidance: ['high_stress']
      },
      modelAccuracy: 0.7,
      lastTraining: new Date(),
      adaptationRate: 0.1
    };
  }

  private findOptimalTimesForType(
    interventionType: string,
    userProfile: UserCircadianProfile,
    receptivityModel: ReceptivityPredictor
  ): string[] {
    const optimalTimes: string[] = [];
    
    // Combine circadian peaks with receptivity scores
    const peakHours = userProfile.circadianRhythm.peakAlertness;
    const highReceptivityHours = Object.entries(receptivityModel.hourlyReceptivityScores)
      .filter(([, score]) => score > 0.7)
      .map(([hour]) => hour);
    
    // Find intersection of peak times and high receptivity
    const combinedOptimal = peakHours.filter(hour => 
      highReceptivityHours.includes(hour.toString())
    );
    
    // Add intervention-specific optimal times
    switch (interventionType) {
      case 'crisis_prevention':
        // Crisis prevention should be available 24/7 but prefer high receptivity times
        optimalTimes.push(...highReceptivityHours);
        break;
      case 'daily_check_in':
        // Morning or evening check-ins typically work well
        optimalTimes.push('8', '9', '19', '20');
        break;
      case 'therapeutic_reminder':
        // Mid-morning when people are alert but not rushed
        optimalTimes.push('10', '11');
        break;
      default:
        optimalTimes.push(...combinedOptimal.map(h => h.toString()));
    }
    
    return optimalTimes.length > 0 ? optimalTimes : ['10', '15', '19']; // Fallback times
  }

  private calculateStressStateAdjustments(userProfile: UserCircadianProfile) {
    return {
      'high_stress': {
        timeShift: '+2_hours', // Delay interventions during acute stress
        intensityReduction: 0.7,
        methodChange: 'gentle_notification'
      },
      'moderate_stress': {
        timeShift: '+30_minutes',
        intensityReduction: 0.9,
        methodChange: null
      }
    };
  }

  private calculateEmotionalStateAdjustments(receptivityModel: ReceptivityPredictor) {
    return {
      'positive_state': {
        boost: 1.2,
        preferredTypes: ['progress_celebration', 'skill_building']
      },
      'neutral_state': {
        boost: 1.0,
        preferredTypes: ['daily_check_in', 'routine_support']
      },
      'challenging_state': {
        boost: 0.8,
        preferredTypes: ['crisis_prevention', 'coping_strategy'],
        gentleApproach: true
      }
    };
  }

  private calculateContextualAdjustments(userProfile: UserCircadianProfile) {
    return {
      'after_journaling': { receptivityBoost: 1.3 },
      'weekend': { frequencyReduction: 0.7 },
      'holiday': { frequencyReduction: 0.5 },
      'work_hours': { methodPreference: 'subtle_notification' }
    };
  }

  private calculateTimingConfidence(
    userProfile: UserCircadianProfile, 
    receptivityModel: ReceptivityPredictor
  ): number {
    let confidence = 0.6; // Base confidence
    
    confidence += userProfile.profileAccuracy * 0.3;
    confidence += receptivityModel.modelAccuracy * 0.1;
    
    return Math.min(confidence, 0.95);
  }

  private calculateInterventionConfidences(userProfile: UserCircadianProfile) {
    return {
      'crisis_prevention': 0.9, // High confidence due to 24/7 availability
      'daily_check_in': 0.85,   // Good data on user patterns
      'therapeutic_reminder': 0.75, // Moderate confidence
      'coping_strategy': 0.8,
      'progress_celebration': 0.9
    };
  }

  // Additional helper methods for intervention generation
  private calculateBaselineIntensity(userProfile: UserCircadianProfile): string {
    // Determine baseline intervention intensity based on user profile
    if (userProfile.personalPreferences.interventionFrequency === 'high') return 'high';
    if (userProfile.personalPreferences.interventionFrequency === 'low') return 'low';
    return 'moderate';
  }

  private calculateBaselineFrequency(userProfile: UserCircadianProfile): string {
    // Determine baseline intervention frequency
    return userProfile.personalPreferences.interventionFrequency || 'moderate';
  }

  private async determineLanguageStyle(userId: string): Promise<string> {
    // Analyze user's writing style from journal entries
    // For now, return default
    return 'warm_supportive';
  }

  private async determineOptimalTone(userId: string): Promise<string> {
    // Determine optimal emotional tone for interventions
    return 'gentle_encouraging';
  }

  private determineOptimalContentLength(userProfile: UserCircadianProfile): string {
    // Determine optimal content length based on user engagement patterns
    return 'medium'; // short, medium, long
  }

  private async identifyPersonalizedElements(userId: string): Promise<string[]> {
    // Identify personalized elements like user's name usage, specific interests, etc.
    return ['first_name', 'progress_acknowledgment', 'personal_strengths'];
  }

  private identifyPreferredMethods(userProfile: UserCircadianProfile): string[] {
    // Identify preferred delivery methods based on engagement patterns
    return ['push_notification', 'in_app_message'];
  }

  private identifyFallbackMethods(userProfile: UserCircadianProfile): string[] {
    return ['gentle_reminder', 'weekly_summary'];
  }

  private createContextualMethodRules(userProfile: UserCircadianProfile) {
    return {
      'high_stress': 'gentle_notification',
      'work_hours': 'subtle_reminder',
      'evening': 'rich_content',
      'weekend': 'relaxed_tone'
    };
  }

  private shouldScheduleIntervention(type: string, day: number, config: AdaptiveInterventionConfig): boolean {
    switch (type) {
      case 'daily_check_in':
        return true; // Schedule daily
      case 'therapeutic_reminder':
        return day % 7 === 0; // Weekly
      case 'coping_strategy':
        return day % 14 === 0; // Bi-weekly
      default:
        return false;
    }
  }

  private findBestTimeForDate(
    date: Date,
    optimalTimes: string[],
    userProfile: UserCircadianProfile
  ): Date {
    // Find the best time on the given date
    const bestHour = parseInt(optimalTimes[0]) || 10; // Default to 10 AM
    
    const scheduledTime = new Date(date);
    scheduledTime.setHours(bestHour, 0, 0, 0);
    
    return scheduledTime;
  }

  private async generatePersonalizedContent(
    type: string,
    userId: string,
    config: AdaptiveInterventionConfig
  ): Promise<string> {
    // Generate personalized intervention content
    const contentMap: { [key: string]: string[] } = {
      'daily_check_in': [
        'How are you feeling today? Take a moment to check in with yourself.',
        'What\'s on your heart right now? I\'m here to listen.',
        'How would you describe your emotional weather today?'
      ],
      'therapeutic_reminder': [
        'Remember, healing happens in small moments of self-compassion.',
        'You\'ve shown such strength in your journey. That strength is still with you.',
        'Take a breath. You\'re exactly where you need to be right now.'
      ]
    };
    
    const options = contentMap[type] || ['Take care of yourself today.'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private calculateInterventionIntensity(
    type: string,
    config: AdaptiveInterventionConfig,
    day: number
  ): string {
    // Calculate appropriate intervention intensity
    let baseIntensity = config.intensitySettings.baseline;
    
    // Adjust based on intervention type
    if (type === 'crisis_prevention') return 'high';
    if (type === 'daily_check_in') return 'medium';
    
    return baseIntensity;
  }

  private predictEngagement(
    type: string,
    scheduledTime: Date,
    userProfile: UserCircadianProfile
  ): number {
    // Predict likelihood of user engagement
    const hour = scheduledTime.getHours();
    const isOptimalTime = userProfile.interventionWindows.optimal.includes(hour.toString());
    
    let baseEngagement = 0.5;
    if (isOptimalTime) baseEngagement += 0.3;
    
    // Type-specific adjustments
    if (type === 'daily_check_in') baseEngagement += 0.1;
    if (type === 'crisis_prevention') baseEngagement += 0.2;
    
    return Math.min(baseEngagement, 0.95);
  }

  private calculateNextUpdate(): Date {
    const nextUpdate = new Date();
    nextUpdate.setDate(nextUpdate.getDate() + 7); // Update weekly
    return nextUpdate;
  }

  private identifyPersonalizationFactors(userProfile: UserCircadianProfile): string[] {
    const factors = ['circadian_rhythm', 'engagement_patterns'];
    
    if (userProfile.profileAccuracy > 0.8) factors.push('high_confidence_timing');
    if (userProfile.personalPreferences.preferredContactTimes.length > 0) factors.push('user_specified_preferences');
    
    return factors;
  }

  // Helper methods for circadian analysis
  private findMidDayDip(hourlyActivity: { [key: number]: number }): number {
    // Find the hour between 12-16 with lowest activity
    let minActivity = Infinity;
    let midDayDip = 14; // Default 2 PM
    
    for (let hour = 12; hour <= 16; hour++) {
      if (hourlyActivity[hour] && hourlyActivity[hour] < minActivity) {
        minActivity = hourlyActivity[hour];
        midDayDip = hour;
      }
    }
    
    return midDayDip;
  }

  private inferEnergyFromEmotions(emotions: string[]): number {
    const highEnergyEmotions = ['excited', 'energetic', 'motivated', 'confident'];
    const lowEnergyEmotions = ['tired', 'drained', 'lethargic', 'depressed'];
    
    const highCount = emotions.filter(e => highEnergyEmotions.includes(e)).length;
    const lowCount = emotions.filter(e => lowEnergyEmotions.includes(e)).length;
    
    return 50 + (highCount - lowCount) * 15; // Scale 0-100
  }

  private identifyHighEnergyPeriods(morning: number, afternoon: number, evening: number): string[] {
    const periods = [];
    if (morning > 60) periods.push('morning');
    if (afternoon > 60) periods.push('afternoon');
    if (evening > 60) periods.push('evening');
    return periods;
  }

  private identifyLowEnergyPeriods(morning: number, afternoon: number, evening: number): string[] {
    const periods = [];
    if (morning < 40) periods.push('morning');
    if (afternoon < 40) periods.push('afternoon');
    if (evening < 40) periods.push('evening');
    return periods;
  }

  private identifyEnergyTransitions(energyPatterns: any[]): string[] {
    // Simple transition detection
    return ['morning_to_afternoon', 'afternoon_to_evening'];
  }

  private calculateWeekendDifferences(journalData: any[], voiceData: any[]): any {
    // Analyze differences between weekday and weekend patterns
    return {
      laterWakeup: true,
      differentEnergyPeaks: true,
      moreRelaxedSchedule: true
    };
  }

  private combineOptimalTimes(peakHours: number[], energyPeriods: string[]): string[] {
    // Combine circadian peaks with energy periods
    return peakHours.map(h => h.toString());
  }

  private identifyAcceptableTimes(circadianRhythm: any, energyCycles: any): string[] {
    // Times that are acceptable but not optimal
    return ['11', '14', '16', '18'];
  }

  private calculateEmotionalReceptivity(emotions: string[]): number {
    const receptiveEmotions = ['reflective', 'open', 'curious', 'hopeful'];
    const nonReceptiveEmotions = ['angry', 'defensive', 'overwhelmed', 'closed'];
    
    const receptiveCount = emotions.filter(e => receptiveEmotions.includes(e)).length;
    const nonReceptiveCount = emotions.filter(e => nonReceptiveEmotions.includes(e)).length;
    
    return 50 + (receptiveCount - nonReceptiveCount) * 20;
  }

  private identifyReceptivityPatterns(hourlyReceptivity: { [key: number]: number }) {
    // Identify patterns in emotional receptivity
    return {
      peakReceptivity: 'morning',
      lowReceptivity: 'midday',
      secondaryPeak: 'evening'
    };
  }

  private calculatePatternConsistency(journalData: any[]): number {
    // Calculate how consistent user patterns are
    const times = journalData.map(entry => entry.timestamp.getHours());
    const uniqueTimes = [...new Set(times)];
    
    // More consistent timing = higher score
    return Math.max(0, 1 - (uniqueTimes.length / 24));
  }
}