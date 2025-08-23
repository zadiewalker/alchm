// Gemini AI Integration for ALCHM Pathways
// Specialized for mood analysis, bias detection, and SEL scoring

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PathwayProgress, CulturalContext, EmotionalState, SELGrowthIndicator } from '@/types/pathways-schema';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface GeminiInsightRequest {
  type: 'step_completion_analysis' | 'reflection_prompt' | 'mood_analysis' | 'bias_detection' | 'sel_scoring';
  stepContent: string;
  userInput?: string;
  userProgress: PathwayProgress;
  culturalContext: CulturalContext;
}

export interface GeminiInsightResponse {
  content: string;
  confidence: number;
  emotionalState: EmotionalState;
  selGrowthIndicators: SELGrowthIndicator[];
  culturalConsiderations: string[];
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    estimatedImpact: number;
    timeframe: string;
    actionItems: string[];
  }>;
  safetyFlags: string[];
  biasDetection: {
    detectedBiases: string[];
    mitigation: string[];
    culturalSensitivity: number;
  };
}

/**
 * Generate comprehensive AI insights using Gemini
 */
export async function generateGeminiInsight(request: GeminiInsightRequest): Promise<GeminiInsightResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = buildGeminiPrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return parseGeminiResponse(text, request);

  } catch (error) {
    console.error('Error generating Gemini insight:', error);
    return createFallbackResponse();
  }
}

/**
 * Build specialized prompts for different analysis types
 */
function buildGeminiPrompt(request: GeminiInsightRequest): string {
  const baseContext = `
You are an expert in Social-Emotional Learning (SEL) and trauma-informed youth development, specialized in culturally responsive analysis.

User Context:
- Cultural Background: ${request.culturalContext.culturalBackground.join(', ')}
- Communication Style: ${request.culturalContext.communicationStyle}
- Value System: ${request.culturalContext.valueSystem.join(', ')}
- Current SEL Scores: ${JSON.stringify(request.userProgress.SELCompetencyScore)}
- Pathway Progress: ${request.userProgress.completionRate}%

Cultural Sensitivity Requirements:
- Respect ${request.culturalContext.culturalBackground.join(' and ')} perspectives
- Adapt communication for ${request.culturalContext.communicationStyle} style
- Consider ${request.culturalContext.valueSystem.join(' and ')} values
- Use culturally relevant examples and metaphors
- Avoid Western-centric assumptions

Safety Requirements:
- Trauma-informed approach
- Crisis prevention awareness
- Bias detection and mitigation
- Age-appropriate language (adolescent-focused)
`;

  switch (request.type) {
    case 'step_completion_analysis':
      return buildStepAnalysisPrompt(baseContext, request);
    case 'reflection_prompt':
      return buildReflectionPrompt(baseContext, request);
    case 'mood_analysis':
      return buildMoodAnalysisPrompt(baseContext, request);
    case 'bias_detection':
      return buildBiasDetectionPrompt(baseContext, request);
    case 'sel_scoring':
      return buildSELScoringPrompt(baseContext, request);
    default:
      return buildGeneralAnalysisPrompt(baseContext, request);
  }
}

function buildStepAnalysisPrompt(baseContext: string, request: GeminiInsightRequest): string {
  return `${baseContext}

TASK: Analyze the user's completion of this pathway step and provide comprehensive insights.

Step Content: "${request.stepContent}"
User Response: "${request.userInput}"

Please analyze and provide insights in JSON format:

{
  "emotionalAnalysis": {
    "primaryEmotion": "string",
    "intensity": number (0-10),
    "valence": number (-1 to 1),
    "arousal": number (0-1),
    "complexity": number (0-1),
    "regulation": number (0-1)
  },
  "selGrowthAnalysis": [
    {
      "competency": "selfAwareness|selfManagement|socialAwareness|relationshipSkills|responsibleDecisionMaking",
      "growthDirection": "improving|maintaining|declining",
      "growthRate": number (0-1),
      "evidence": ["string"],
      "nextMilestone": "string",
      "supportStrategy": "string"
    }
  ],
  "biasDetection": {
    "detectedBiases": ["string"],
    "mitigation": ["string"],
    "culturalSensitivity": number (0-1)
  },
  "insights": {
    "keyStrengths": ["string"],
    "growthAreas": ["string"],
    "patterns": ["string"],
    "breakthroughMoments": ["string"]
  },
  "recommendations": [
    {
      "type": "next_step|skill_practice|reflection_prompt|external_resource",
      "title": "string",
      "description": "string",
      "priority": "low|medium|high|urgent",
      "estimatedImpact": number (0-10),
      "timeframe": "string",
      "actionItems": ["string"]
    }
  ],
  "culturalConsiderations": ["string"],
  "safetyFlags": ["string"],
  "encouragement": "string"
}

Focus on:
1. Emotional regulation patterns
2. Cultural identity integration
3. SEL competency development
4. Trauma-informed insights
5. Crisis prevention indicators
`;
}

function buildReflectionPrompt(baseContext: string, request: GeminiInsightRequest): string {
  return `${baseContext}

TASK: Generate a culturally adapted reflection prompt for this pathway step.

Step Content: "${request.stepContent}"

Consider:
- User's cultural communication preferences
- Current emotional state and SEL development
- Trauma-informed approach
- Age-appropriate language

Provide JSON response:
{
  "adaptedPrompt": "string",
  "culturalAdaptations": ["string"],
  "supportingQuestions": ["string"],
  "safetyConsiderations": ["string"],
  "encouragement": "string"
}

Make the prompt:
1. Culturally resonant
2. Emotionally safe
3. Developmentally appropriate
4. Growth-oriented
5. Strength-based
`;
}

function buildMoodAnalysisPrompt(baseContext: string, request: GeminiInsightRequest): string {
  return `${baseContext}

TASK: Analyze the emotional state and mood patterns in the user's reflection.

User Input: "${request.userInput}"

Provide detailed mood analysis in JSON:
{
  "currentMood": {
    "primaryEmotion": "string",
    "secondaryEmotions": ["string"],
    "intensity": number (0-10),
    "valence": number (-1 to 1),
    "arousal": number (0-1),
    "stability": number (0-1)
  },
  "moodPatterns": {
    "consistencyWithPrevious": number (0-1),
    "volatility": number (0-1),
    "triggers": ["string"],
    "copingStrategies": ["string"]
  },
  "culturalContext": {
    "emotionalExpressionStyle": "string",
    "culturalFactors": ["string"],
    "adaptations": ["string"]
  },
  "concerns": ["string"],
  "strengths": ["string"]
}

Consider cultural differences in emotional expression and be trauma-informed.
`;
}

function buildBiasDetectionPrompt(baseContext: string, request: GeminiInsightRequest): string {
  return `${baseContext}

TASK: Detect potential biases in content or responses and suggest culturally sensitive adaptations.

Content to Analyze: "${request.stepContent}"
User Response: "${request.userInput}"

Analyze for biases in JSON format:
{
  "detectedBiases": [
    {
      "type": "cultural|gender|age|socioeconomic|religious|ability",
      "description": "string",
      "severity": "low|medium|high",
      "evidence": "string"
    }
  ],
  "culturalSensitivityIssues": ["string"],
  "recommendedAdaptations": [
    {
      "area": "string",
      "suggestion": "string",
      "rationale": "string"
    }
  ],
  "inclusivityScore": number (0-1),
  "improvements": ["string"]
}

Focus on ensuring content is inclusive and culturally responsive.
`;
}

function buildSELScoringPrompt(baseContext: string, request: GeminiInsightRequest): string {
  return `${baseContext}

TASK: Score SEL competency development based on user's reflection and responses.

User Input: "${request.userInput}"
Step Focus: "${request.stepContent}"

Provide SEL scoring in JSON:
{
  "selScores": {
    "selfAwareness": {
      "currentLevel": number (0-100),
      "growthFromBaseline": number,
      "evidence": ["string"],
      "nextDevelopmentArea": "string"
    },
    "selfManagement": {
      "currentLevel": number (0-100),
      "growthFromBaseline": number,
      "evidence": ["string"],
      "nextDevelopmentArea": "string"
    },
    "socialAwareness": {
      "currentLevel": number (0-100),
      "growthFromBaseline": number,
      "evidence": ["string"],
      "nextDevelopmentArea": "string"
    },
    "relationshipSkills": {
      "currentLevel": number (0-100),
      "growthFromBaseline": number,
      "evidence": ["string"],
      "nextDevelopmentArea": "string"
    },
    "responsibleDecisionMaking": {
      "currentLevel": number (0-100),
      "growthFromBaseline": number,
      "evidence": ["string"],
      "nextDevelopmentArea": "string"
    }
  },
  "overallDevelopment": {
    "trajectory": "accelerating|steady|variable|concerning",
    "strengths": ["string"],
    "priorityAreas": ["string"],
    "culturalFactors": ["string"]
  },
  "recommendations": ["string"]
}

Use culturally responsive assessment criteria.
`;
}

function buildGeneralAnalysisPrompt(baseContext: string, request: GeminiInsightRequest): string {
  return `${baseContext}

TASK: Provide general analysis and insights for this pathway interaction.

Step Content: "${request.stepContent}"
User Input: "${request.userInput || 'N/A'}"

Provide comprehensive analysis in JSON format with emotional state, growth indicators, recommendations, and cultural considerations.
`;
}

/**
 * Parse Gemini response and structure it
 */
function parseGeminiResponse(text: string, request: GeminiInsightRequest): GeminiInsightResponse {
  try {
    // Extract JSON from response if it's wrapped in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonText);

    return {
      content: extractMainContent(parsed),
      confidence: calculateConfidence(parsed),
      emotionalState: parseEmotionalState(parsed),
      selGrowthIndicators: parseSELGrowthIndicators(parsed),
      culturalConsiderations: parsed.culturalConsiderations || [],
      recommendations: parseRecommendations(parsed),
      safetyFlags: parsed.safetyFlags || [],
      biasDetection: parseBiasDetection(parsed)
    };

  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return createFallbackResponse();
  }
}

function extractMainContent(parsed: any): string {
  if (parsed.insights) {
    return Object.values(parsed.insights).flat().join(' ');
  }
  if (parsed.adaptedPrompt) {
    return parsed.adaptedPrompt;
  }
  if (parsed.encouragement) {
    return parsed.encouragement;
  }
  return 'Analysis completed with insights for your continued growth.';
}

function calculateConfidence(parsed: any): number {
  // Calculate confidence based on response completeness and quality
  let confidence = 0.5;
  
  if (parsed.emotionalAnalysis) confidence += 0.2;
  if (parsed.selGrowthAnalysis) confidence += 0.2;
  if (parsed.recommendations) confidence += 0.1;
  
  return Math.min(1.0, confidence);
}

function parseEmotionalState(parsed: any): EmotionalState {
  const emotional = parsed.emotionalAnalysis || parsed.currentMood || {};
  
  return {
    primaryEmotion: emotional.primaryEmotion || 'neutral',
    intensity: emotional.intensity || 5,
    valence: emotional.valence || 0,
    arousal: emotional.arousal || 0.5,
    complexity: emotional.complexity || 0.5,
    regulation: emotional.regulation || 0.5
  };
}

function parseSELGrowthIndicators(parsed: any): SELGrowthIndicator[] {
  const selAnalysis = parsed.selGrowthAnalysis || [];
  
  return selAnalysis.map((item: any) => ({
    competency: item.competency as keyof SELCompetencyScore,
    growthDirection: item.growthDirection || 'maintaining',
    growthRate: item.growthRate || 0,
    evidence: item.evidence || [],
    nextMilestone: item.nextMilestone || '',
    supportStrategy: item.supportStrategy || ''
  }));
}

function parseRecommendations(parsed: any): any[] {
  return parsed.recommendations || [];
}

function parseBiasDetection(parsed: any): any {
  return parsed.biasDetection || {
    detectedBiases: [],
    mitigation: [],
    culturalSensitivity: 1.0
  };
}

function createFallbackResponse(): GeminiInsightResponse {
  return {
    content: 'Your reflection shows thoughtful engagement. Continue exploring your insights.',
    confidence: 0.3,
    emotionalState: {
      primaryEmotion: 'neutral',
      intensity: 5,
      valence: 0,
      arousal: 0.5,
      complexity: 0.5,
      regulation: 0.5
    },
    selGrowthIndicators: [],
    culturalConsiderations: [],
    recommendations: [],
    safetyFlags: [],
    biasDetection: {
      detectedBiases: [],
      mitigation: [],
      culturalSensitivity: 1.0
    }
  };
}

/**
 * Specialized Gemini functions for specific pathway needs
 */

export async function analyzeJournalForPathways(
  journalText: string,
  culturalContext: CulturalContext
): Promise<{
  suggestedPathways: string[];
  emotionalState: EmotionalState;
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
Analyze this journal entry and suggest appropriate ALCHM pathways:

Journal: "${journalText}"
Cultural Context: ${JSON.stringify(culturalContext)}

Available Pathway Categories:
- self_discovery
- emotional_regulation  
- social_connection
- purpose_exploration
- resilience_building
- leadership_development
- cultural_identity
- trauma_informed
- crisis_support

Respond in JSON:
{
  "suggestedPathways": ["pathway_category"],
  "emotionalState": {
    "primaryEmotion": "string",
    "intensity": number (0-10),
    "valence": number (-1 to 1),
    "urgencyLevel": "low|medium|high|crisis"
  },
  "reasoning": "string"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsed = JSON.parse(text);
    
    return {
      suggestedPathways: parsed.suggestedPathways || ['self_discovery'],
      emotionalState: parsed.emotionalState || {
        primaryEmotion: 'neutral',
        intensity: 5,
        valence: 0,
        arousal: 0.5,
        complexity: 0.5,
        regulation: 0.5
      },
      urgencyLevel: parsed.emotionalState?.urgencyLevel || 'low'
    };

  } catch (error) {
    console.error('Error analyzing journal for pathways:', error);
    return {
      suggestedPathways: ['self_discovery'],
      emotionalState: {
        primaryEmotion: 'neutral',
        intensity: 5,
        valence: 0,
        arousal: 0.5,
        complexity: 0.5,
        regulation: 0.5
      },
      urgencyLevel: 'low'
    };
  }
}

export async function detectCulturalAdaptationNeeds(
  content: string,
  targetCulture: CulturalContext
): Promise<{
  adaptationScore: number;
  suggestions: string[];
  culturalMismatches: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
Analyze this content for cultural adaptation needs:

Content: "${content}"
Target Culture: ${JSON.stringify(targetCulture)}

Assess cultural sensitivity and suggest adaptations in JSON:
{
  "adaptationScore": number (0-1),
  "suggestions": ["string"],
  "culturalMismatches": ["string"],
  "adaptedContent": "string"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const parsed = JSON.parse(text);
    
    return {
      adaptationScore: parsed.adaptationScore || 0.8,
      suggestions: parsed.suggestions || [],
      culturalMismatches: parsed.culturalMismatches || []
    };

  } catch (error) {
    console.error('Error detecting cultural adaptation needs:', error);
    return {
      adaptationScore: 0.8,
      suggestions: [],
      culturalMismatches: []
    };
  }
}

export default {
  generateGeminiInsight,
  analyzeJournalForPathways,
  detectCulturalAdaptationNeeds
};