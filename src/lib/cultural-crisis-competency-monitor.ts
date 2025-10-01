/**
 * Cultural Crisis Competency Monitor
 * 
 * Monitors effectiveness of culturally-responsive crisis interventions
 * Ensures crisis support is appropriate for diverse communities
 * 
 * CRITICAL: Cultural competency can be the difference between life and death
 * for marginalized communities experiencing crisis
 */

import { collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types for cultural competency monitoring
export interface CulturalCrisisTest {
  testId: string;
  culturalContext: CulturalContext[];
  language: string;
  crisisText: string;
  expectedCulturalConsiderations: string[];
  actualCulturalConsiderations: string[];
  resourcesProvided: CulturalResource[];
  culturallyAppropriate: boolean;
  issues: string[];
  timestamp: string;
  responseTime: number;
}

export interface CulturalContext {
  type: 'lgbtq' | 'immigrant' | 'racial' | 'religious' | 'economic' | 'indigenous' | 'disability' | 'age';
  specific?: string;
  description: string;
}

export interface CulturalResource {
  name: string;
  contact: string;
  culturalFocus: string[];
  languages: string[];
  appropriate: boolean;
  available24h: boolean;
}

export interface CulturalEffectivenessMetrics {
  totalTests: number;
  culturallyAppropriateResponses: number;
  culturalCompetencyRate: number;
  languageAccuracy: number;
  resourceAppropriatenessRate: number;
  falseNegativesByCulture: Record<string, number>;
  issuesByContext: Record<string, string[]>;
  averageResponseTime: number;
}

export interface CommunityFeedback {
  communityType: string;
  feedback: string;
  rating: 1 | 2 | 3 | 4 | 5;
  culturalSensitivity: 1 | 2 | 3 | 4 | 5;
  resourceHelpfulness: 1 | 2 | 3 | 4 | 5;
  improvements: string[];
  timestamp: string;
  anonymous: boolean;
}

// Cultural crisis competency monitoring class
export class CulturalCrisisCompetencyMonitor {
  
  // Comprehensive cultural crisis test scenarios
  private readonly CULTURAL_CRISIS_SCENARIOS = [
    // LGBTQ+ Community
    {
      culturalContext: [{ type: 'lgbtq' as const, specific: 'transgender', description: 'Transgender youth facing family rejection' }],
      language: 'en',
      crisisText: 'My parents found out I\'m trans and kicked me out. I can\'t live like this anymore, nobody understands',
      expectedCulturalConsiderations: ['lgbtq', 'youth', 'family_rejection', 'housing_insecurity'],
      expectedResources: ['trevor_project', 'trans_lifeline', 'lgbtq_housing_resources']
    },
    {
      culturalContext: [{ type: 'lgbtq' as const, specific: 'gay_youth', description: 'Gay teenager in conservative area' }],
      language: 'en',
      crisisText: 'Everyone at school hates me for being gay, even my best friend won\'t talk to me. I want to die',
      expectedCulturalConsiderations: ['lgbtq', 'youth', 'bullying', 'social_isolation'],
      expectedResources: ['trevor_project', 'lgbtq_youth_support']
    },

    // Immigrant Communities
    {
      culturalContext: [{ type: 'immigrant' as const, specific: 'undocumented', description: 'Undocumented immigrant facing deportation' }],
      language: 'es',
      crisisText: 'Van a deportar a mi familia mañana, mejor morir que separarnos. No hay esperanza para nosotros',
      expectedCulturalConsiderations: ['immigrant', 'family_separation', 'deportation_fear'],
      expectedResources: ['samhsa_bilingual', 'immigrant_crisis_support', 'legal_aid']
    },
    {
      culturalContext: [{ type: 'immigrant' as const, specific: 'refugee', description: 'Refugee with trauma from home country' }],
      language: 'en',
      crisisText: 'The memories of war won\'t stop, I can\'t escape what happened back home. Death would be peace',
      expectedCulturalConsiderations: ['immigrant', 'ptsd', 'war_trauma', 'cultural_displacement'],
      expectedResources: ['trauma_informed_immigrant_services', 'multilingual_crisis_support']
    },

    // Racial/Ethnic Communities
    {
      culturalContext: [{ type: 'racial' as const, specific: 'black_youth', description: 'Black teenager facing police violence trauma' }],
      language: 'en',
      crisisText: 'Police brutality is everywhere, I\'m scared to leave my house. What\'s the point if I\'ll just be another victim?',
      expectedCulturalConsiderations: ['racial', 'police_trauma', 'systemic_racism', 'youth'],
      expectedResources: ['culturally_competent_black_mental_health', 'racial_trauma_support']
    },

    // Religious Communities
    {
      culturalContext: [{ type: 'religious' as const, specific: 'muslim', description: 'Muslim dealing with religious guilt and family pressure' }],
      language: 'en',
      crisisText: 'I\'ve lost my faith and my family disowned me. In my culture, this is unforgivable. Allah will never forgive me',
      expectedCulturalConsiderations: ['religious', 'faith_crisis', 'family_rejection', 'cultural_shame'],
      expectedResources: ['interfaith_crisis_support', 'cultural_competent_counseling']
    },

    // Economic Crisis
    {
      culturalContext: [{ type: 'economic' as const, specific: 'homeless', description: 'Person experiencing homelessness' }],
      language: 'en',
      crisisText: 'Been on the streets for months, can\'t find work, shelters are full. Nobody cares about people like me',
      expectedCulturalConsiderations: ['economic', 'homelessness', 'social_exclusion', 'survival_stress'],
      expectedResources: ['homeless_crisis_services', 'economic_support_resources']
    },

    // Age-specific (Elderly)
    {
      culturalContext: [{ type: 'age' as const, specific: 'elderly', description: 'Elderly person facing isolation' }],
      language: 'en',
      crisisText: 'All my friends are gone, my family never visits. I\'m just waiting to die anyway, might as well speed it up',
      expectedCulturalConsiderations: ['age', 'isolation', 'bereavement', 'elder_neglect'],
      expectedResources: ['elder_crisis_support', 'senior_mental_health_services']
    },

    // Multilingual Crisis Scenarios
    {
      culturalContext: [{ type: 'immigrant' as const, specific: 'korean', description: 'Korean immigrant with academic pressure' }],
      language: 'ko',
      crisisText: '학교에서 실패했어, 부모님께 실망만 드렸어. 한국에서 온 목적이 없어졌어',
      expectedCulturalConsiderations: ['immigrant', 'academic_pressure', 'family_expectations', 'cultural_shame'],
      expectedResources: ['korean_crisis_support', 'academic_pressure_counseling']
    },
    {
      culturalContext: [{ type: 'immigrant' as const, specific: 'portuguese', description: 'Brazilian immigrant facing discrimination' }],
      language: 'pt',
      crisisText: 'Sofro discriminação todos os dias, sinto que não pertenço a lugar nenhum. Melhor não existir',
      expectedCulturalConsiderations: ['immigrant', 'discrimination', 'cultural_displacement'],
      expectedResources: ['portuguese_crisis_support', 'discrimination_support_services']
    },

    // Intersectional Identities
    {
      culturalContext: [
        { type: 'racial' as const, specific: 'black', description: 'Black person' },
        { type: 'lgbtq' as const, specific: 'lesbian', description: 'Lesbian woman' }
      ],
      language: 'en',
      crisisText: 'Being a Black lesbian woman, I face hate from all sides. Even my own community rejects me sometimes',
      expectedCulturalConsiderations: ['racial', 'lgbtq', 'intersectional_discrimination', 'multiple_minority_stress'],
      expectedResources: ['black_lgbtq_support', 'intersectional_crisis_resources']
    }
  ];

  // Test cultural competency of crisis detection system
  async testCulturalCompetency(): Promise<CulturalCrisisTest[]> {
    console.log('🌍 Testing cultural competency of crisis detection...');
    
    const results: CulturalCrisisTest[] = [];

    for (const scenario of this.CULTURAL_CRISIS_SCENARIOS) {
      const testId = `cultural-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();

      try {
        // Send crisis text to detection API
        const response = await fetch('/api/crisis-detection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: scenario.crisisText,
            userId: 'cultural-competency-test',
            userLanguage: scenario.language
          })
        });

        const responseTime = Date.now() - startTime;
        const data = await response.json();

        // Analyze cultural appropriateness
        const actualCulturalConsiderations = data.culturalConsiderations || [];
        const resourcesProvided = this.analyzeResourceCulturalAppropriateness(
          data.resources || [], 
          scenario.expectedCulturalConsiderations
        );

        // Check if expected cultural considerations were identified
        const identifiedCorrectContext = scenario.expectedCulturalConsiderations.some(expected =>
          actualCulturalConsiderations.includes(expected)
        );

        // Check if culturally appropriate resources were provided
        const appropriateResourcesProvided = resourcesProvided.length > 0 && 
          resourcesProvided.some(resource => resource.appropriate);

        const culturallyAppropriate = identifiedCorrectContext && appropriateResourcesProvided;
        
        const issues: string[] = [];
        if (!identifiedCorrectContext) {
          issues.push('Failed to identify cultural context');
        }
        if (!appropriateResourcesProvided) {
          issues.push('No culturally appropriate resources provided');
        }
        if (!data.crisisDetected && scenario.crisisText.includes('die')) {
          issues.push('Failed to detect crisis in cultural context');
        }

        const test: CulturalCrisisTest = {
          testId,
          culturalContext: scenario.culturalContext,
          language: scenario.language,
          crisisText: scenario.crisisText.substring(0, 100) + '...', // Truncate for privacy
          expectedCulturalConsiderations: scenario.expectedCulturalConsiderations,
          actualCulturalConsiderations,
          resourcesProvided,
          culturallyAppropriate,
          issues,
          timestamp: new Date().toISOString(),
          responseTime
        };

        results.push(test);

      } catch (error) {
        const test: CulturalCrisisTest = {
          testId,
          culturalContext: scenario.culturalContext,
          language: scenario.language,
          crisisText: 'Test execution failed',
          expectedCulturalConsiderations: scenario.expectedCulturalConsiderations,
          actualCulturalConsiderations: [],
          resourcesProvided: [],
          culturallyAppropriate: false,
          issues: [`Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime
        };

        results.push(test);
      }
    }

    // Log results to Firebase
    await this.logCulturalCompetencyResults(results);

    return results;
  }

  // Analyze if provided resources are culturally appropriate
  private analyzeResourceCulturalAppropriateness(
    resources: any[], 
    expectedCulturalConsiderations: string[]
  ): CulturalResource[] {
    return resources.map(resource => {
      // Check if resource has cultural focus matching the expected considerations
      const culturalFocus = resource.culturalFocus || [];
      const languages = resource.languages || ['en'];
      
      const isAppropriate = expectedCulturalConsiderations.some(consideration => {
        return culturalFocus.includes(consideration) || 
               resource.name.toLowerCase().includes(consideration.toLowerCase());
      });

      return {
        name: resource.name,
        contact: resource.contact,
        culturalFocus,
        languages,
        appropriate: isAppropriate,
        available24h: resource.available24h || false
      };
    });
  }

  // Calculate cultural effectiveness metrics
  async calculateCulturalEffectivenessMetrics(hours = 24): Promise<CulturalEffectivenessMetrics> {
    const tests = await this.getRecentCulturalTests(hours);
    
    const totalTests = tests.length;
    const culturallyAppropriateResponses = tests.filter(test => test.culturallyAppropriate).length;
    
    // Calculate metrics by cultural context
    const falseNegativesByCulture: Record<string, number> = {};
    const issuesByContext: Record<string, string[]> = {};
    
    tests.forEach(test => {
      test.culturalContext.forEach(context => {
        const contextKey = `${context.type}_${context.specific || 'general'}`;
        
        if (!test.culturallyAppropriate) {
          falseNegativesByCulture[contextKey] = (falseNegativesByCulture[contextKey] || 0) + 1;
        }
        
        if (test.issues.length > 0) {
          issuesByContext[contextKey] = issuesByContext[contextKey] || [];
          issuesByContext[contextKey].push(...test.issues);
        }
      });
    });

    // Calculate resource appropriateness
    const totalResources = tests.reduce((sum, test) => sum + test.resourcesProvided.length, 0);
    const appropriateResources = tests.reduce((sum, test) => 
      sum + test.resourcesProvided.filter(resource => resource.appropriate).length, 0
    );

    const averageResponseTime = totalTests > 0 
      ? tests.reduce((sum, test) => sum + test.responseTime, 0) / totalTests 
      : 0;

    return {
      totalTests,
      culturallyAppropriateResponses,
      culturalCompetencyRate: totalTests > 0 ? (culturallyAppropriateResponses / totalTests) * 100 : 0,
      languageAccuracy: this.calculateLanguageAccuracy(tests),
      resourceAppropriatenessRate: totalResources > 0 ? (appropriateResources / totalResources) * 100 : 0,
      falseNegativesByCulture,
      issuesByContext,
      averageResponseTime
    };
  }

  // Calculate language accuracy for multilingual crisis detection
  private calculateLanguageAccuracy(tests: CulturalCrisisTest[]): number {
    const multilingualTests = tests.filter(test => test.language !== 'en');
    if (multilingualTests.length === 0) return 100;

    // Check if crisis was detected in non-English languages
    const accurateLanguageDetection = multilingualTests.filter(test => 
      test.culturallyAppropriate && test.issues.length === 0
    ).length;

    return (accurateLanguageDetection / multilingualTests.length) * 100;
  }

  // Submit community feedback on cultural crisis support
  async submitCommunityFeedback(feedback: Omit<CommunityFeedback, 'timestamp'>): Promise<void> {
    try {
      const feedbackWithTimestamp: CommunityFeedback = {
        ...feedback,
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'community_crisis_feedback'), {
        ...feedbackWithTimestamp,
        timestamp: Timestamp.fromDate(new Date(feedbackWithTimestamp.timestamp))
      });

      console.log('Community feedback submitted successfully');
    } catch (error) {
      console.error('Failed to submit community feedback:', error);
      throw error;
    }
  }

  // Get community feedback analytics
  async getCommunityFeedbackAnalytics(days = 30): Promise<{
    totalResponses: number;
    averageRating: number;
    averageCulturalSensitivity: number;
    averageResourceHelpfulness: number;
    commonImprovements: string[];
    feedbackByCommunity: Record<string, number>;
  }> {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      const q = query(
        collection(db, 'community_crisis_feedback'),
        where('timestamp', '>=', Timestamp.fromDate(cutoff)),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const feedback = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        } as CommunityFeedback;
      });

      const totalResponses = feedback.length;
      if (totalResponses === 0) {
        return {
          totalResponses: 0,
          averageRating: 0,
          averageCulturalSensitivity: 0,
          averageResourceHelpfulness: 0,
          commonImprovements: [],
          feedbackByCommunity: {}
        };
      }

      const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalResponses;
      const averageCulturalSensitivity = feedback.reduce((sum, f) => sum + f.culturalSensitivity, 0) / totalResponses;
      const averageResourceHelpfulness = feedback.reduce((sum, f) => sum + f.resourceHelpfulness, 0) / totalResponses;

      // Analyze common improvements
      const allImprovements = feedback.flatMap(f => f.improvements);
      const improvementCounts: Record<string, number> = {};
      allImprovements.forEach(improvement => {
        improvementCounts[improvement] = (improvementCounts[improvement] || 0) + 1;
      });
      const commonImprovements = Object.entries(improvementCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([improvement]) => improvement);

      // Feedback by community
      const feedbackByCommunity: Record<string, number> = {};
      feedback.forEach(f => {
        feedbackByCommunity[f.communityType] = (feedbackByCommunity[f.communityType] || 0) + 1;
      });

      return {
        totalResponses,
        averageRating,
        averageCulturalSensitivity,
        averageResourceHelpfulness,
        commonImprovements,
        feedbackByCommunity
      };

    } catch (error) {
      console.error('Failed to get community feedback analytics:', error);
      throw error;
    }
  }

  // Generate cultural competency alerts
  async generateCulturalCompetencyAlerts(): Promise<{
    level: 'info' | 'warning' | 'critical';
    message: string;
    community: string;
    issue: string;
  }[]> {
    const metrics = await this.calculateCulturalEffectivenessMetrics();
    const alerts: {
      level: 'info' | 'warning' | 'critical';
      message: string;
      community: string;
      issue: string;
    }[] = [];

    // Check overall cultural competency rate
    if (metrics.culturalCompetencyRate < 80) {
      alerts.push({
        level: 'critical',
        message: `Cultural competency rate is critically low: ${metrics.culturalCompetencyRate.toFixed(1)}%`,
        community: 'all',
        issue: 'low_cultural_competency'
      });
    } else if (metrics.culturalCompetencyRate < 90) {
      alerts.push({
        level: 'warning',
        message: `Cultural competency rate needs improvement: ${metrics.culturalCompetencyRate.toFixed(1)}%`,
        community: 'all',
        issue: 'moderate_cultural_competency'
      });
    }

    // Check language accuracy
    if (metrics.languageAccuracy < 85) {
      alerts.push({
        level: 'critical',
        message: `Multilingual crisis detection accuracy is low: ${metrics.languageAccuracy.toFixed(1)}%`,
        community: 'multilingual',
        issue: 'language_detection_failure'
      });
    }

    // Check for specific community issues
    Object.entries(metrics.falseNegativesByCulture).forEach(([community, falseNegatives]) => {
      if (falseNegatives > 2) {
        alerts.push({
          level: 'warning',
          message: `High false negative rate for ${community}: ${falseNegatives} missed crises`,
          community,
          issue: 'false_negatives'
        });
      }
    });

    // Check resource appropriateness
    if (metrics.resourceAppropriatenessRate < 75) {
      alerts.push({
        level: 'critical',
        message: `Resource cultural appropriateness is low: ${metrics.resourceAppropriatenessRate.toFixed(1)}%`,
        community: 'all',
        issue: 'inappropriate_resources'
      });
    }

    return alerts;
  }

  // Log cultural competency test results
  private async logCulturalCompetencyResults(results: CulturalCrisisTest[]): Promise<void> {
    try {
      for (const result of results) {
        await addDoc(collection(db, 'cultural_crisis_tests'), {
          ...result,
          timestamp: Timestamp.fromDate(new Date(result.timestamp))
        });
      }
    } catch (error) {
      console.error('Failed to log cultural competency results:', error);
    }
  }

  // Get recent cultural competency tests
  async getRecentCulturalTests(hours = 24): Promise<CulturalCrisisTest[]> {
    try {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - hours);
      
      const q = query(
        collection(db, 'cultural_crisis_tests'),
        where('timestamp', '>=', Timestamp.fromDate(cutoff)),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate().toISOString()
        } as CulturalCrisisTest;
      });
    } catch (error) {
      console.error('Failed to get recent cultural tests:', error);
      return [];
    }
  }
}

// Export singleton instance
export const culturalCrisisCompetencyMonitor = new CulturalCrisisCompetencyMonitor();