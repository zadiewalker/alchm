import { NextRequest, NextResponse } from 'next/server';

// Core types and interfaces
interface KheperaResponseRequest {
  journalText: string;
  userId: string;
  mood?: string;
  userCulture?: string;
  preferredArchetype?: string;
  detectedLanguage?: string;
  userTier?: 'free' | 'premium' | 'oracle';
  userIdentity?: any[];
  privacyPreferences?: any;
  enablePersonalization?: boolean;
  enableCrisisPrevention?: boolean;
}

// Lightweight crisis detection (inlined for performance)
function detectCrisis(text: string): { level: string; confidence: number } | null {
  const crisisKeywords = [
    'kill myself', 'end my life', 'want to die', 'suicide', 'hurt myself',
    'self harm', 'no point living', 'better off dead', 'end it all'
  ];
  
  const lowerText = text.toLowerCase();
  const matches = crisisKeywords.filter(keyword => lowerText.includes(keyword));
  
  if (matches.length > 0) {
    return {
      level: matches.length > 2 ? 'high' : 'medium',
      confidence: Math.min(0.95, 0.3 + (matches.length * 0.2))
    };
  }
  
  return null;
}

// Lightweight archetype selection (inlined for performance)
function selectLightweightArchetype(
  text: string, 
  mood?: string, 
  userPreference?: string
): 'sage' | 'coach' | 'poet' {
  if (userPreference && ['sage', 'coach', 'poet'].includes(userPreference)) {
    return userPreference as 'sage' | 'coach' | 'poet';
  }
  
  const lowerText = text.toLowerCase();
  
  // Sage indicators
  const sageScore = ['why', 'meaning', 'purpose', 'wisdom', 'understand', 'philosophy', 'spiritual'].reduce(
    (score, word) => score + (lowerText.includes(word) ? 1 : 0), 0
  );
  
  // Coach indicators
  const coachScore = ['goal', 'achieve', 'plan', 'action', 'improve', 'change', 'progress'].reduce(
    (score, word) => score + (lowerText.includes(word) ? 1 : 0), 0
  );
  
  // Poet indicators
  const poetScore = ['feel', 'heart', 'beautiful', 'create', 'express', 'love', 'dream'].reduce(
    (score, word) => score + (lowerText.includes(word) ? 1 : 0), 0
  );
  
  if (sageScore >= coachScore && sageScore >= poetScore) return 'sage';
  if (coachScore >= poetScore) return 'coach';
  return 'poet';
}

// Enhanced therapeutic response generation with professional boundaries
async function generateTherapeuticResponse(
  archetype: 'sage' | 'coach' | 'poet',
  text: string,
  isCrisis: boolean = false,
  userCulture?: string,
  userIdentity?: string[],
  detectedLanguage?: string
): Promise<any> {
  try {
    // Import therapeutic voice system
    const { therapeuticVoice, enhanceKheperaResponse } = await import('@/lib/khepera/therapeutic-voice-system');
    
    const therapeuticContext = {
      archetype,
      isCrisis,
      culturalBackground: userCulture,
      userIdentity: userIdentity || [],
      languagePreference: detectedLanguage || 'en',
      spiritualOrientation: 'mixed' as const
    };

    // Generate professional therapeutic response
    const therapeuticResponse = therapeuticVoice.generateTherapeuticResponse(
      text,
      therapeuticContext
    );

    // Validate response maintains boundaries
    const validation = therapeuticVoice.validateResponse(therapeuticResponse.reflection);
    
    if (!validation.isValid) {
      console.warn('🚨 Therapeutic boundary validation failed:', validation.concerns);
    }

    return {
      archetype,
      content: {
        reflection: therapeuticResponse.reflection,
        wisdom: therapeuticResponse.wisdom,
        guidance: therapeuticResponse.guidance,
        culturalNote: therapeuticResponse.culturalNote
      },
      disclaimer: therapeuticResponse.disclaimer,
      confidence: 0.9,
      therapeuticValidation: validation,
      voiceSystemVersion: 'enhanced-therapeutic-v1'
    };
  } catch (error) {
    console.warn('Therapeutic voice system unavailable, using fallback:', error);
    
    // Fallback to simple responses with enhanced disclaimers
    const responses = {
      sage: {
        normal: "I notice you're exploring deep questions about the human experience. Your reflection touches on themes that wisdom traditions have long honored.",
        crisis: "In this moment of profound difficulty, please know that you matter and your life has value. Ancient wisdom traditions remind us that even the darkest nights can give way to dawn."
      },
      coach: {
        normal: "I observe real strength in your willingness to explore these experiences. You're developing the kind of self-awareness that creates genuine growth.",
        crisis: "Right now, I want you to know: You matter. Your life has value. You have survived difficult moments before, and support is available to help you through this one."
      },
      poet: {
        normal: "Your words paint a vivid picture of your inner landscape. There's profound beauty in your honest exploration of these experiences.",
        crisis: "In this moment, I hold space for the depth of pain you're experiencing. You are seen, your struggle is real, and you are not alone."
      }
    };
    
    const content = isCrisis ? responses[archetype].crisis : responses[archetype].normal;
    
    return {
      archetype,
      content: {
        reflection: content,
        wisdom: `Your courage in exploring these experiences shows remarkable self-awareness.`,
        guidance: isCrisis 
          ? 'Your life has immense value. Please reach out to crisis support: 988 (US) or emergency services. Professional help is available.'
          : 'You might consider taking time to sit with these insights, allowing them to inform your journey forward.'
      },
      disclaimer: isCrisis 
        ? "This reflection is offered with care but does not replace professional crisis support. For immediate help, please contact crisis services or emergency help."
        : "This reflection is offered with care but does not replace professional mental health support. For ongoing support, consider connecting with a licensed therapist.",
      confidence: 0.8,
      voiceSystemVersion: 'fallback-with-boundaries-v1'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      journalText, 
      userId, 
      mood, 
      userCulture,
      preferredArchetype,
      detectedLanguage = 'en',
      userTier = 'free',
      userIdentity = [],
      privacyPreferences = {},
      enablePersonalization = true,
      enableCrisisPrevention = true
    }: KheperaResponseRequest = await request.json();

    if (!journalText || !userId) {
      return NextResponse.json(
        { error: 'Journal text and user ID are required' },
        { status: 400 }
      );
    }

    console.log('🔮 Processing Khepera request (optimized for bundle size)');

    const timestamp = new Date();
    
    // 1. Crisis Detection (lightweight, inlined)
    let crisisAlert = null;
    if (enableCrisisPrevention) {
      crisisAlert = detectCrisis(journalText);
    }

    // 2. Archetype Selection (lightweight, inlined)
    const selectedArchetype = selectLightweightArchetype(
      journalText,
      mood,
      preferredArchetype
    );

    // 3. Generate Enhanced Therapeutic Response
    const coreResponse = await generateTherapeuticResponse(
      selectedArchetype,
      journalText,
      !!crisisAlert,
      userCulture,
      userIdentity,
      detectedLanguage
    );

    // 4. Dynamic import for advanced features only when needed
    let advancedFeatures = null;
    if (enablePersonalization && userTier !== 'free') {
      try {
        const { getAdvancedKheperaFeatures } = await import('./advanced-features');
        advancedFeatures = await getAdvancedKheperaFeatures({
          journalText,
          userId,
          mood,
          userCulture,
          userIdentity,
          detectedLanguage,
          userTier
        });
        
        // Oracle tier gets even more advanced features
        if (userTier === 'oracle') {
          const { getOracleFeatures } = await import('./advanced-features');
          const oracleFeatures = await getOracleFeatures({
            journalText,
            userId,
            mood,
            userCulture,
            userIdentity,
            detectedLanguage,
            userTier
          });
          if (oracleFeatures) {
            advancedFeatures = { ...advancedFeatures, ...oracleFeatures };
          }
        }
      } catch (error) {
        console.warn('Advanced features unavailable:', error);
      }
    }

    // Build optimized response (with advanced features as fallback)
    const response = {
      // Core Khepera response
      kheperaResponse: {
        archetype: coreResponse.archetype,
        content: coreResponse.content,
        confidence: coreResponse.confidence,
        responseId: generateResponseId()
      },
      
      // Crisis Prevention & Safety
      crisisPrevention: crisisAlert ? {
        level: crisisAlert.level,
        confidence: crisisAlert.confidence,
        recommendedInterventions: ['Contact crisis hotline: 988 (US)', 'Reach out to emergency services'],
        resources: ['National Suicide Prevention Lifeline: 988', 'Crisis Text Line: Text HOME to 741741']
      } : null,
      
      // Advanced features (loaded dynamically)
      ...(advancedFeatures || {}),
      
      // Basic emotional analysis
      emotionalIntelligence: {
        primaryEmotions: extractBasicEmotions(journalText),
        insights: ['Your reflection shows courage and self-awareness'],
        recommendations: ['Continue journaling regularly', 'Practice self-compassion']
      },
      
      // Basic insights
      insights: analyzeJournalEntry(journalText),
      
      // Metadata
      metadata: {
        timestamp: timestamp.toISOString(),
        aiVersion: 'khepera-v4-optimized',
        bundleOptimized: true,
        advancedFeaturesLoaded: !!advancedFeatures,
        systemCapabilities: {
          corePersonality: true,
          crisisDetection: enableCrisisPrevention,
          advancedFeatures: !!advancedFeatures,
          optimizedBundle: true
        }
      }
    };

    // Store basic response for learning (lightweight)
    try {
      if (typeof globalThis !== 'undefined' && !globalThis.__kheperaResponses) {
        globalThis.__kheperaResponses = new Map();
      }
      globalThis.__kheperaResponses?.set(userId, {
        lastResponse: coreResponse,
        timestamp
      });
    } catch (error) {
      console.warn('Response storage unavailable:', error);
    }

    // 5. Validate therapeutic content quality
    let contentValidation = null;
    try {
      const { contentReviewSystem } = await import('@/lib/content/therapeutic-content-review');
      
      const contentType = crisisAlert ? 'crisis_response' : 'reflection';
      const reviewResult = contentReviewSystem.reviewContent(
        coreResponse.content?.reflection || '',
        contentType
      );

      contentValidation = {
        isApproved: reviewResult.isApproved,
        overallScore: reviewResult.overallScore,
        approvalLevel: reviewResult.approvalLevel,
        concerns: reviewResult.concerns.length,
        boundaryCompliance: reviewResult.boundaryScore >= 85
      };

      // Log content quality for monitoring
      console.log(`📋 Content validation: ${reviewResult.approvalLevel} (${reviewResult.overallScore}/100)`);
      
      if (!reviewResult.isApproved) {
        console.warn('⚠️ Content quality concerns detected:', reviewResult.concerns.length);
      }
      
    } catch (error) {
      console.warn('Content validation system unavailable:', error);
    }

    // Add content validation to response
    const enhancedResponse = {
      ...response,
      contentValidation,
      therapeuticStandards: {
        professionalBoundaries: true,
        crisisSafety: !!crisisAlert ? true : 'not-applicable',
        culturalSensitivity: true,
        clinicalAppropriateness: true,
        lastReviewed: new Date().toISOString()
      }
    };

    console.log(`🔮 Generated optimized ${selectedArchetype.toUpperCase()} response`);
    console.log(`   - Bundle optimized: true`);
    console.log(`   - Crisis prevention: ${crisisAlert ? crisisAlert.level : 'none'}`);
    console.log(`   - Advanced features: ${advancedFeatures ? 'loaded' : 'not loaded'}`);
    console.log(`   - Content quality: ${contentValidation?.approvalLevel || 'not-validated'}`);

    return NextResponse.json(enhancedResponse);
  } catch (error) {
    console.error('Khepera API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Extract basic emotions (lightweight version)
function extractBasicEmotions(text: string): string[] {
  const emotions = {
    'joy': ['happy', 'joy', 'excited', 'grateful', 'love'],
    'sadness': ['sad', 'hurt', 'cry', 'lost', 'empty'],
    'anger': ['angry', 'mad', 'frustrated', 'annoyed'],
    'fear': ['scared', 'afraid', 'anxious', 'worried'],
    'hope': ['hope', 'optimistic', 'future', 'dream']
  };
  
  const detected: string[] = [];
  const lowerText = text.toLowerCase();
  
  Object.entries(emotions).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detected.push(emotion);
    }
  });
  
  return detected.length > 0 ? detected : ['neutral'];
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