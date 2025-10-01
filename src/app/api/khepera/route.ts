import { NextRequest, NextResponse } from 'next/server';
import { kheperaPersonalitySystem } from '@/lib/khepera-personality-system';
import { advancedEmotionalIntelligence } from '@/lib/advanced-emotional-intelligence-v2';
import { culturalResponsivenessEngine } from '@/lib/cultural-responsiveness-engine';
import { culturalWisdomEngine } from '@/khepera/cultural-wisdom-engine';
import { enhancedArchetypeSystem } from '@/khepera/enhanced-archetype-system';
import { personalizedInterventionTiming } from '@/khepera/personalized-intervention-timing';
import { predictiveCrisisPreventionSystem } from '@/khepera/predictive-crisis-prevention';
import { culturalEmotionalIntelligenceEngine } from '@/ai/cultural-emotional-intelligence';
import { communityWisdomIntegrationSystem } from '@/khepera/community-wisdom-integration';
import { privacyPreservingPersonalizationSystem } from '@/khepera/privacy-preserving-personalization';

export async function POST(request: NextRequest) {
  try {
    const { 
      journalText, 
      userId, 
      mood, 
      userCulture,
      preferredArchetype,
      detectedLanguage = 'en',
      userTier = 'free', // free, premium, oracle
      userIdentity = [], // array of identity dimensions
      privacyPreferences = {},
      enablePersonalization = true,
      enableCrisisPrevention = true
    } = await request.json();

    if (!journalText || !userId) {
      return NextResponse.json(
        { error: 'Journal text and user ID are required' },
        { status: 400 }
      );
    }

    console.log('🔮 Processing Khepera request with enhanced cultural wisdom system');

    const timestamp = new Date();
    
    // 1. Enhanced Cultural Emotional Intelligence Analysis
    const culturalEmotionalAnalysis = culturalEmotionalIntelligenceEngine.analyzeCulturalEmotionalIntelligence(
      userId,
      journalText,
      mood,
      userCulture,
      userIdentity.map((id: any) => ({ 
        type: id.type, 
        value: id.value, 
        salience: id.salience || 0.5, 
        pride: id.pride || 0.5, 
        discrimination: id.discrimination || 0.3, 
        culturalExpression: id.culturalExpression || [] 
      }))
    );

    // 2. Integrate Cultural Wisdom
    const culturalWisdom = culturalWisdomEngine.integrateWisdom(
      journalText,
      userCulture,
      userIdentity.map((id: any) => id.value),
      detectedLanguage,
      mood
    );

    // 3. Crisis Prevention Analysis (if enabled)
    let crisisAlert = null;
    if (enableCrisisPrevention) {
      crisisAlert = predictiveCrisisPreventionSystem.analyzeForCrisisPrevention(
        userId,
        journalText,
        mood,
        timestamp,
        userCulture
      );
    }

    // 4. Personalized Intervention Timing
    personalizedInterventionTiming.analyzeEntry(
      userId,
      journalText,
      mood,
      timestamp,
      userCulture
    );

    const circadianContext = {
      hour: timestamp.getHours(),
      dayOfWeek: timestamp.getDay(),
      season: getSeason(timestamp),
      userTimezone: 'UTC', // Could be determined from user settings
      culturalEvents: [] // Could include relevant cultural events
    };

    const optimalTiming = personalizedInterventionTiming.getOptimalInterventionTiming(
      userId,
      circadianContext,
      userCulture
    );

    // 5. Community Wisdom Integration
    const communityWisdom = await communityWisdomIntegrationSystem.queryWisdom({
      emotionalState: mood,
      culturalContext: userCulture,
      identityDimensions: userIdentity.map((id: any) => id.value),
      urgencyLevel: crisisAlert ? 'high' : 'medium',
      privacyPreferences: {
        allowPersonalization: enablePersonalization,
        allowCommunityLearning: (privacyPreferences as any).allowCommunityLearning || false,
        geographicalSharing: (privacyPreferences as any).geographicalSharing || false,
        researchParticipation: (privacyPreferences as any).researchParticipation || false,
        anonymityLevel: (privacyPreferences as any).anonymityLevel || 'enhanced'
      }
    });

    // 6. Privacy-Preserving Personalization (if enabled)
    let personalizedPrediction = null;
    if (enablePersonalization) {
      personalizedPrediction = await privacyPreservingPersonalizationSystem.generatePersonalizedPrediction(
        userId,
        {
          journalText,
          mood,
          culturalContext: userCulture,
          identityDimensions: userIdentity.map((id: any) => id.value),
          timestamp
        }
      );
    }

    // 7. Select optimal archetype (enhanced with cultural wisdom)
    const selectedArchetype = personalizedPrediction?.archetypeRecommendation.primaryArchetype || 
      kheperaPersonalitySystem.selectArchetype(
        journalText,
        mood,
        userCulture,
        preferredArchetype,
        kheperaPersonalitySystem.getUserHistory(userId),
        userTier
      );

    // 8. Generate Enhanced Culturally-Adapted Response
    const enhancedResponse = enhancedArchetypeSystem.generateCulturallyAdaptedResponse(
      selectedArchetype,
      journalText,
      mood,
      userCulture,
      userIdentity.map((id: any) => id.value),
      detectedLanguage
    );

    // 9. Legacy system for backwards compatibility
    const legacyEmotionalAnalysis = advancedEmotionalIntelligence.analyzeEmotionalIntelligence(
      journalText,
      userCulture,
      detectedLanguage
    );

    // Store enhanced response for learning
    kheperaPersonalitySystem.storeResponse(userId, {
      content: enhancedResponse.response.reflection + ' ' + enhancedResponse.response.wisdom,
      wisdom: enhancedResponse.response.wisdom,
      actionable: enhancedResponse.response.guidance,
      confidence: enhancedResponse.confidenceScore,
      responseId: generateResponseId(),
      archetype: selectedArchetype,
      culturalAdaptation: enhancedResponse.culturalAdaptation
    });

    // Build comprehensive enhanced response
    const response = {
      // Enhanced Khepera response with cultural wisdom
      kheperaResponse: {
        archetype: enhancedResponse.archetype,
        culturalAdaptation: enhancedResponse.culturalAdaptation,
        content: {
          opening: enhancedResponse.response.opening,
          reflection: enhancedResponse.response.reflection,
          wisdom: enhancedResponse.response.wisdom,
          affirmation: enhancedResponse.response.affirmation,
          guidance: enhancedResponse.response.guidance,
          resources: enhancedResponse.response.resources,
          closing: enhancedResponse.response.closing
        },
        identityAffirmations: enhancedResponse.identityAffirmation,
        culturalElements: enhancedResponse.culturalElements,
        voiceCharacteristics: enhancedResponse.voiceCharacteristics,
        confidence: enhancedResponse.confidenceScore,
        responseId: generateResponseId()
      },
      
      // Cultural Wisdom Integration
      culturalWisdom: {
        selectedTraditions: culturalWisdom.selectedTraditions.map(t => ({
          name: t.name,
          regions: t.regions,
          healingPractices: t.healingPractices.slice(0, 3) // Limit for response size
        })),
        applicableWisdom: culturalWisdom.applicableWisdom.slice(0, 5),
        healingPractices: culturalWisdom.healingPractices.slice(0, 3),
        culturalMetaphors: culturalWisdom.culturalMetaphors.slice(0, 2),
        identityAffirmations: culturalWisdom.identityAffirmations.slice(0, 3),
        communityConnections: culturalWisdom.communityConnections.slice(0, 3),
        confidence: culturalWisdom.confidenceScore
      },
      
      // Enhanced Cultural Emotional Intelligence
      culturalEmotionalIntelligence: {
        emotionalPattern: {
          primaryEmotions: culturalEmotionalAnalysis.emotionalPattern.primaryEmotions,
          emotionalComplexity: culturalEmotionalAnalysis.emotionalPattern.emotionalComplexity,
          culturalInfluences: culturalEmotionalAnalysis.emotionalPattern.culturalInfluences,
          expressionStyle: culturalEmotionalAnalysis.emotionalPattern.expressionStyle
        },
        intersectionalFactors: culturalEmotionalAnalysis.intersectionalFactors,
        recommendedSupport: culturalEmotionalAnalysis.recommendedSupport,
        traumaInformedConsiderations: culturalEmotionalAnalysis.traumaInformedConsiderations,
        identityAffirmations: culturalEmotionalAnalysis.identityAffirmations,
        confidence: culturalEmotionalAnalysis.confidenceScore
      },
      
      // Crisis Prevention & Safety
      crisisPrevention: crisisAlert ? {
        level: crisisAlert.level,
        confidence: crisisAlert.confidence,
        timeEstimate: crisisAlert.timeEstimate,
        recommendedInterventions: crisisAlert.recommendedInterventions,
        culturalAdaptations: crisisAlert.culturalAdaptations,
        privacyCompliant: crisisAlert.privacyCompliant
      } : null,
      
      // Personalized Timing & Intervention
      personalizedTiming: optimalTiming ? {
        optimalTime: optimalTiming.optimalTime,
        confidence: optimalTiming.confidence,
        rationale: optimalTiming.rationale,
        interventionType: optimalTiming.interventionType,
        culturalAdaptation: optimalTiming.culturalAdaptation,
        personalizedMessage: optimalTiming.personalizedMessage
      } : null,
      
      // Community Wisdom
      communityWisdom: {
        relevantWisdom: communityWisdom.relevantWisdom.slice(0, 3).map(w => ({
          type: w.wisdom.wisdomType,
          description: w.wisdom.anonymizedPattern.generalDescription,
          culturalContext: w.wisdom.culturalContext,
          relevanceScore: w.relevanceScore,
          culturalAlignment: w.culturalAlignment
        })),
        culturalAdaptations: communityWisdom.culturalAdaptations.slice(0, 2),
        communitySupport: communityWisdom.communitySupport.slice(0, 3),
        diversityMetrics: {
          marginalizationSupport: communityWisdom.diversityMetrics.marginalizationSupport
        },
        confidence: communityWisdom.confidenceScore,
        privacyCompliant: communityWisdom.privacyCompliance.userDataProtected
      },
      
      // Privacy-Preserving Personalization
      personalization: personalizedPrediction ? {
        archetypeRecommendation: personalizedPrediction.archetypeRecommendation,
        culturalAdaptation: personalizedPrediction.culturalAdaptation,
        timingRecommendation: personalizedPrediction.timingRecommendation,
        confidence: personalizedPrediction.confidenceScore,
        privacyCompliant: personalizedPrediction.privacyCompliant
      } : null,
      
      // Legacy compatibility
      emotionalIntelligence: {
        primaryEmotions: legacyEmotionalAnalysis.primaryEmotions,
        patterns: legacyEmotionalAnalysis.patterns,
        insights: legacyEmotionalAnalysis.insights,
        recommendations: legacyEmotionalAnalysis.recommendations
      },
      traumaInformed: legacyEmotionalAnalysis.traumaInformed,
      insights: analyzeJournalEntry(journalText),
      
      // Enhanced Metadata
      metadata: {
        timestamp: timestamp.toISOString(),
        aiVersion: 'khepera-v3-enhanced-cultural-wisdom',
        systemCapabilities: {
          culturalWisdomIntegration: true,
          enhancedArchetypes: true,
          personalizedTiming: enablePersonalization,
          crisisPrevention: enableCrisisPrevention,
          communityWisdom: true,
          privacyPreserving: true,
          intersectionalSupport: true
        },
        privacyCompliance: {
          dataMinimization: true,
          userControl: true,
          transparentProcessing: true,
          culturalSensitivity: true
        }
      }
    };

    console.log(`🔮 Generated enhanced ${selectedArchetype.toUpperCase()} response with cultural wisdom`);
    console.log(`   - Cultural traditions: ${culturalWisdom.selectedTraditions.length}`);
    console.log(`   - Identity affirmations: ${culturalWisdom.identityAffirmations.length}`);
    console.log(`   - Community wisdom nodes: ${communityWisdom.relevantWisdom.length}`);
    console.log(`   - Crisis prevention: ${crisisAlert ? crisisAlert.level : 'none'}`);
    console.log(`   - Personalization: ${personalizedPrediction ? 'enabled' : 'disabled'}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Khepera API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simple Khepera response generator (placeholder for AI integration)
function generateKheperaResponse(text: string): string {
  const textLength = text.length;
  const wordCount = text.split(/\s+/).length;
  
  if (textLength < 50) {
    return "Thank you for sharing your thoughts. Every moment of reflection, no matter how brief, is valuable. Would you like to explore what's on your mind a bit more?";
  }
  
  if (wordCount > 100) {
    return "I can sense the depth in your reflection today. Your willingness to explore your inner landscape shows real courage. What stands out most to you from what you've written?";
  }
  
  return "Your words carry wisdom and strength. I'm here to witness your journey without judgment. How does it feel to have expressed these thoughts?";
}

// Simple journal analysis (placeholder for advanced AI analysis)
function analyzeJournalEntry(text: string) {
  const textLower = text.toLowerCase();
  
  const emotions = {
    positive: ['happy', 'joy', 'grateful', 'love', 'excited', 'peaceful', 'calm'].some(word => textLower.includes(word)),
    challenging: ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'difficult'].some(word => textLower.includes(word)),
    reflective: ['think', 'realize', 'understand', 'learn', 'grow', 'remember', 'consider'].some(word => textLower.includes(word))
  };
  
  return {
    wordCount: text.split(/\s+/).length,
    estimatedReadTime: Math.ceil(text.split(/\s+/).length / 200), // words per minute
    emotionalTone: emotions,
    themes: identifyThemes(textLower)
  };
}

function identifyThemes(text: string): string[] {
  const themes = [];
  
  if (text.includes('work') || text.includes('job') || text.includes('career')) {
    themes.push('Work & Career');
  }
  
  if (text.includes('family') || text.includes('parent') || text.includes('child')) {
    themes.push('Family');
  }
  
  if (text.includes('friend') || text.includes('relationship') || text.includes('partner')) {
    themes.push('Relationships');
  }
  
  if (text.includes('goal') || text.includes('dream') || text.includes('future')) {
    themes.push('Goals & Aspirations');
  }
  
  if (text.includes('health') || text.includes('exercise') || text.includes('sleep')) {
    themes.push('Health & Wellness');
  }
  
  return themes;
}

// Helper function for season detection
function getSeason(date: Date): string {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

// Helper function for response ID generation
function generateResponseId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}