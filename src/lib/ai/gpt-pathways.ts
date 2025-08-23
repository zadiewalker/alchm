// GPT-4o Integration for ALCHM Pathways
// Specialized for mentor-style prompting and persona-based coaching

import OpenAI from 'openai';
import { CulturalContext, EmotionalState } from '@/types/pathways-schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GPTMentorshipRequest {
  stepContent: string;
  userContext: Record<string, any>;
  promptType: 'mentor' | 'mirror' | 'visionary' | 'encouragement' | 'insight_analysis';
  culturalContext: CulturalContext;
  userReflections?: string[];
}

export interface GPTMentorshipResponse {
  content: string;
  confidence: number;
  persona: 'mentor' | 'mirror' | 'visionary';
  emotionalState?: EmotionalState;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    estimatedImpact: number;
    timeframe: string;
    actionItems: string[];
  }>;
  culturalAdaptations: string[];
  toneAdjustments: {
    warmth: number;      // 0-1 scale
    directness: number;  // 0-1 scale
    formality: number;   // 0-1 scale
    encouragement: number; // 0-1 scale
  };
}

/**
 * Generate mentor-style guidance using GPT-4o
 */
export async function generateGPTMentorship(request: GPTMentorshipRequest): Promise<GPTMentorshipResponse> {
  try {
    const systemPrompt = buildSystemPrompt(request);
    const userPrompt = buildUserPrompt(request);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT-4o');
    }

    return parseGPTResponse(content, request);

  } catch (error) {
    console.error('Error generating GPT mentorship:', error);
    return createFallbackMentorshipResponse(request);
  }
}

/**
 * Build specialized system prompts for different persona types
 */
function buildSystemPrompt(request: GPTMentorshipRequest): string {
  const basePersona = getPersonaDescription(request.promptType);
  const culturalGuidance = getCulturalGuidance(request.culturalContext);
  
  return `You are ${basePersona} in the ALCHM Pathways system, a soul-centered SEL platform for youth development.

${culturalGuidance}

Core Principles:
- Trauma-informed approach: Always assume positive intent and create emotional safety
- Culturally responsive: Adapt communication style and examples to user's cultural context
- Strength-based: Focus on capabilities and growth rather than deficits
- Developmentally appropriate: Use age-appropriate language and concepts for adolescents/young adults
- Crisis-aware: Recognize signs of distress and provide appropriate support

Your responses should be:
1. Emotionally attuned and validating
2. Culturally sensitive and inclusive
3. Growth-oriented with actionable insights
4. Appropriately warm and encouraging
5. Trauma-informed and safe

Always respond in JSON format with the following structure:
{
  "content": "Your main response content",
  "persona": "mentor|mirror|visionary",
  "toneAdjustments": {
    "warmth": number (0-1),
    "directness": number (0-1), 
    "formality": number (0-1),
    "encouragement": number (0-1)
  },
  "recommendations": [
    {
      "type": "next_step|skill_practice|reflection_prompt|external_resource",
      "title": "string",
      "description": "string", 
      "priority": "low|medium|high",
      "estimatedImpact": number (1-10),
      "timeframe": "string",
      "actionItems": ["string"]
    }
  ],
  "culturalAdaptations": ["string"],
  "emotionalResonance": {
    "validationLevel": number (0-1),
    "encouragementLevel": number (0-1),
    "challengeLevel": number (0-1)
  }
}`;
}

function getPersonaDescription(promptType: string): string {
  switch (promptType) {
    case 'mentor':
      return `a wise, experienced mentor who provides guidance with warmth and wisdom. You draw from diverse life experiences and offer practical advice while honoring the user's autonomy and cultural background. You balance support with gentle challenges that promote growth.`;
      
    case 'mirror':
      return `a reflective companion who helps users see themselves more clearly. You reflect back what you observe in their thoughts and feelings, helping them recognize patterns, strengths, and growth areas. You ask thoughtful questions that deepen self-awareness.`;
      
    case 'visionary':
      return `an inspiring guide who helps users connect with their potential and future possibilities. You help them envision their growth, set meaningful goals, and see how their current experiences contribute to their larger journey. You inspire hope and possibility.`;
      
    case 'encouragement':
      return `a supportive cheerleader who celebrates progress and provides motivation. You acknowledge efforts, highlight strengths, and offer encouragement during challenging moments. You help users maintain momentum and confidence.`;
      
    case 'insight_analysis':
      return `an analytical guide who helps users understand the deeper meaning of their experiences. You identify patterns, connections, and insights that might not be immediately obvious, helping users integrate their learning.`;
      
    default:
      return `a supportive guide who adapts your approach based on what the user needs most in this moment.`;
  }
}

function getCulturalGuidance(culturalContext: CulturalContext): string {
  const guidance = [`Cultural Context Awareness:`];
  
  // Communication style adaptations
  if (culturalContext.communicationStyle === 'indirect' || culturalContext.communicationStyle === 'high_context') {
    guidance.push(`- Use indirect communication: Be subtle, use metaphors, allow for interpretation`);
    guidance.push(`- Honor high-context communication: Pay attention to what's unsaid`);
  } else {
    guidance.push(`- Use direct communication: Be clear, specific, and straightforward`);
  }
  
  // Cultural background considerations
  if (culturalContext.culturalBackground.includes('collectivist')) {
    guidance.push(`- Honor collectivist values: Consider family, community, and group harmony`);
    guidance.push(`- Frame growth in terms of contribution to others and community benefit`);
  }
  
  if (culturalContext.culturalBackground.includes('individualist')) {
    guidance.push(`- Honor individualist values: Focus on personal agency and self-determination`);
    guidance.push(`- Emphasize personal choice and individual growth paths`);
  }
  
  // Value system adaptations
  if (culturalContext.valueSystem.includes('family_centered')) {
    guidance.push(`- Acknowledge the importance of family relationships and obligations`);
    guidance.push(`- Consider how growth affects and involves family dynamics`);
  }
  
  if (culturalContext.valueSystem.includes('achievement_oriented')) {
    guidance.push(`- Recognize the importance of accomplishment and progress`);
    guidance.push(`- Celebrate milestones and tangible growth indicators`);
  }
  
  // Language considerations
  if (culturalContext.primaryLanguage !== 'en') {
    guidance.push(`- Use simple, clear language that translates well`);
    guidance.push(`- Avoid idioms and cultural references that may not translate`);
    guidance.push(`- Be patient with language nuances and expression differences`);
  }
  
  return guidance.join('\n');
}

function buildUserPrompt(request: GPTMentorshipRequest): string {
  let prompt = `Current Pathway Step: "${request.stepContent}"\n\n`;
  
  // Add user context
  if (request.userContext.currentSELScores) {
    prompt += `User's Current SEL Development:\n${JSON.stringify(request.userContext.currentSELScores, null, 2)}\n\n`;
  }
  
  if (request.userContext.engagementScore) {
    prompt += `Engagement Level: ${request.userContext.engagementScore}/100\n\n`;
  }
  
  if (request.userContext.recentMilestones && request.userContext.recentMilestones.length > 0) {
    prompt += `Recent Milestones:\n${request.userContext.recentMilestones.map((m: any) => `- ${m.title}: ${m.description}`).join('\n')}\n\n`;
  }
  
  // Add user reflections if available
  if (request.userReflections && request.userReflections.length > 0) {
    prompt += `User's Recent Reflections:\n${request.userReflections.join('\n\n')}\n\n`;
  }
  
  // Add specific prompt based on type
  switch (request.promptType) {
    case 'mentor':
      prompt += `As a mentor, provide guidance for this step. Help the user understand the importance of this reflection and offer wisdom for their journey.`;
      break;
      
    case 'mirror':
      prompt += `As a reflective mirror, help the user see themselves more clearly. What patterns, strengths, or growth areas do you observe? Ask questions that deepen self-awareness.`;
      break;
      
    case 'visionary':
      prompt += `As a visionary guide, help the user connect this step to their larger journey and future possibilities. How does this moment contribute to their growth and potential?`;
      break;
      
    case 'encouragement':
      prompt += `Provide encouragement and motivation. Acknowledge their efforts, celebrate their progress, and inspire them to continue their growth journey.`;
      break;
      
    case 'insight_analysis':
      prompt += `Analyze the deeper meaning and insights from their reflections. What patterns, connections, or learning opportunities do you see?`;
      break;
  }
  
  return prompt;
}

/**
 * Parse GPT response and structure it
 */
function parseGPTResponse(content: string, request: GPTMentorshipRequest): GPTMentorshipResponse {
  try {
    const parsed = JSON.parse(content);
    
    return {
      content: parsed.content || 'Your reflection shows thoughtful engagement with this important step.',
      confidence: calculateGPTConfidence(parsed),
      persona: parsed.persona || request.promptType as any,
      emotionalState: parseEmotionalState(parsed),
      recommendations: parsed.recommendations || [],
      culturalAdaptations: parsed.culturalAdaptations || [],
      toneAdjustments: parsed.toneAdjustments || {
        warmth: 0.7,
        directness: 0.6,
        formality: 0.4,
        encouragement: 0.8
      }
    };
    
  } catch (error) {
    console.error('Error parsing GPT response:', error);
    return createFallbackMentorshipResponse(request);
  }
}

function calculateGPTConfidence(parsed: any): number {
  let confidence = 0.7; // Base confidence for GPT
  
  if (parsed.recommendations && parsed.recommendations.length > 0) confidence += 0.1;
  if (parsed.culturalAdaptations && parsed.culturalAdaptations.length > 0) confidence += 0.1;
  if (parsed.toneAdjustments) confidence += 0.1;
  
  return Math.min(1.0, confidence);
}

function parseEmotionalState(parsed: any): EmotionalState | undefined {
  if (!parsed.emotionalResonance) return undefined;
  
  return {
    primaryEmotion: 'support',
    intensity: 6,
    valence: 0.7,
    arousal: 0.5,
    complexity: 0.6,
    regulation: 0.8
  };
}

function createFallbackMentorshipResponse(request: GPTMentorshipRequest): GPTMentorshipResponse {
  const fallbackContent = getFallbackContent(request.promptType);
  
  return {
    content: fallbackContent,
    confidence: 0.3,
    persona: request.promptType as any,
    recommendations: [],
    culturalAdaptations: [],
    toneAdjustments: {
      warmth: 0.7,
      directness: 0.5,
      formality: 0.4,
      encouragement: 0.8
    }
  };
}

function getFallbackContent(promptType: string): string {
  switch (promptType) {
    case 'mentor':
      return 'Your journey of self-discovery is valuable and important. Take time to reflect deeply on your experiences and trust in your own wisdom as you grow.';
    case 'mirror':
      return 'As you reflect on this step, notice what thoughts and feelings arise. What does this reveal about your inner world and your growth?';
    case 'visionary':
      return 'This moment is part of your larger journey of becoming. Each reflection and insight contributes to the person you are becoming.';
    case 'encouragement':
      return 'You are showing courage by engaging in this reflection. Your willingness to explore and grow is something to be celebrated.';
    default:
      return 'Your thoughtful engagement with this step shows your commitment to growth and self-understanding.';
  }
}

/**
 * Generate pre-step prompts to prepare users
 */
export async function generatePreStepPrompt(
  stepContent: string,
  userContext: Record<string, any>,
  culturalContext: CulturalContext
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a warm, encouraging guide helping a young person prepare for a meaningful reflection. Your role is to:
          
1. Set the emotional stage for deep, safe reflection
2. Provide cultural context and relevance
3. Offer gentle preparation and encouragement
4. Create anticipation for growth and insight

Cultural Context: ${JSON.stringify(culturalContext)}

Be warm, culturally sensitive, and age-appropriate. Create a sense of safety and possibility.`
        },
        {
          role: "user", 
          content: `Help prepare the user for this pathway step: "${stepContent}"

Create a brief, encouraging introduction that helps them feel ready and excited for this reflection. Make it culturally relevant and emotionally safe.`
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || 
           'Take a moment to center yourself as you prepare for this meaningful reflection. You have everything within you to engage with this step authentically and powerfully.';

  } catch (error) {
    console.error('Error generating pre-step prompt:', error);
    return 'Take a moment to center yourself as you prepare for this meaningful reflection. You have everything within you to engage with this step authentically and powerfully.';
  }
}

/**
 * Generate post-step integration prompts
 */
export async function generatePostStepIntegration(
  stepContent: string,
  userReflections: string[],
  culturalContext: CulturalContext
): Promise<{
  integrationPrompt: string;
  nextStepPreparation: string;
  celebrationMessage: string;
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a wise integration guide helping a young person process and integrate their reflection experience. 

Cultural Context: ${JSON.stringify(culturalContext)}

Provide three distinct responses:
1. Integration prompt: Help them synthesize their insights
2. Next step preparation: Brief guidance for continuing their journey  
3. Celebration message: Acknowledge their growth and effort

Be warm, culturally appropriate, and growth-focused. Respond in JSON format.`
        },
        {
          role: "user",
          content: `Step completed: "${stepContent}"
          
User's reflections: ${userReflections.join('\n\n')}

Help them integrate this experience and prepare for continued growth.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        integrationPrompt: parsed.integrationPrompt || 'Take a moment to reflect on what you\'ve discovered about yourself.',
        nextStepPreparation: parsed.nextStepPreparation || 'You\'re ready to continue your journey of growth and discovery.',
        celebrationMessage: parsed.celebrationMessage || 'Your thoughtful reflection is a gift to your future self.'
      };
    }

  } catch (error) {
    console.error('Error generating post-step integration:', error);
  }

  return {
    integrationPrompt: 'Take a moment to reflect on what you\'ve discovered about yourself through this experience.',
    nextStepPreparation: 'You\'re ready to continue your journey with new insights and understanding.',
    celebrationMessage: 'Your thoughtful engagement and reflection are important steps in your growth journey.'
  };
}

/**
 * Generate culturally adapted examples and scenarios
 */
export async function generateCulturalExamples(
  stepTheme: string,
  culturalContext: CulturalContext,
  ageGroup: string
): Promise<{
  examples: string[];
  scenarios: string[];
  culturalConnections: string[];
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate culturally relevant examples and scenarios for SEL development.

Cultural Context: ${JSON.stringify(culturalContext)}
Age Group: ${ageGroup}

Create examples that:
1. Resonate with the user's cultural background
2. Use familiar contexts and relationships
3. Honor cultural values and communication styles
4. Are age-appropriate and relatable

Respond in JSON format with examples, scenarios, and cultural connections.`
        },
        {
          role: "user",
          content: `Theme: ${stepTheme}

Generate 3 examples, 2 scenarios, and 2 cultural connections that would resonate with someone from this cultural background.`
        }
      ],
      temperature: 0.8,
      max_tokens: 600,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        examples: parsed.examples || [],
        scenarios: parsed.scenarios || [],
        culturalConnections: parsed.culturalConnections || []
      };
    }

  } catch (error) {
    console.error('Error generating cultural examples:', error);
  }

  return {
    examples: [],
    scenarios: [],
    culturalConnections: []
  };
}

export default {
  generateGPTMentorship,
  generatePreStepPrompt,
  generatePostStepIntegration,
  generateCulturalExamples
};