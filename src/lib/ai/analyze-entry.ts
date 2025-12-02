/**
 * ALCHM Identity Operating System - Entry Analysis Engine
 * 
 * This module analyzes journal entries and generates multi-modal responses
 * from the 7 pillars of ALCHM's council of perspectives.
 */

import { 
  PILLAR_PROMPTS, 
  PILLAR_METADATA, 
  CRISIS_KEYWORDS, 
  HIGH_URGENCY_KEYWORDS,
  suggestPrimaryPillar,
  type ResponsePillar 
} from './prompts';

// Type definitions
export interface Practice {
  type: 'breathwork' | 'movement' | 'meditation' | 'writing' | 'ritual' | 'action';
  title: string;
  duration?: string;
  instructions: string;
}

export interface PillarResponse {
  pillar: ResponsePillar;
  title: string;
  icon: string;
  response: string;
  practices?: Practice[];
  journalPrompt?: string;
}

export interface AnalysisResult {
  primaryPillar: ResponsePillar;
  emotionalTone: string[];
  themes: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
}

export interface EntryAnalysis {
  primaryPillar: ResponsePillar;
  emotionalTone: string[];
  themes: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
  responses: PillarResponse[];
}

// Initialize AI client based on available services
let aiClient: any = null;

async function getAIClient() {
  if (aiClient) return aiClient;
  
  try {
    // Try Anthropic first (preferred for this use case)
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    aiClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return aiClient;
  } catch (error) {
    // Fallback to OpenAI if available
    try {
      const { Configuration, OpenAIApi } = await import('openai');
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      aiClient = new OpenAIApi(configuration);
      return aiClient;
    } catch (openAIError) {
      throw new Error('No AI service available. Please configure ANTHROPIC_API_KEY or OPENAI_API_KEY');
    }
  }
}

/**
 * Perform initial crisis detection using keyword analysis
 * This provides immediate safety assessment before AI analysis
 */
function detectCrisisKeywords(content: string): { isCrisis: boolean; isHighUrgency: boolean } {
  const lowerContent = content.toLowerCase();
  
  const isCrisis = CRISIS_KEYWORDS.some(keyword => lowerContent.includes(keyword));
  const isHighUrgency = HIGH_URGENCY_KEYWORDS.some(keyword => lowerContent.includes(keyword));
  
  return { isCrisis, isHighUrgency };
}

/**
 * Analyze journal entry to determine primary pillar and emotional context
 */
export async function analyzeEntry(content: string): Promise<AnalysisResult> {
  // Early crisis detection
  const { isCrisis, isHighUrgency } = detectCrisisKeywords(content);
  
  if (isCrisis) {
    return {
      primaryPillar: 'nurturer', // Crisis situations need immediate nurturing
      emotionalTone: ['crisis', 'distress'],
      themes: ['crisis support needed'],
      urgencyLevel: 'crisis'
    };
  }

  try {
    const ai = await getAIClient();
    
    // Construct analysis prompt
    const analysisPrompt = `Analyze this journal entry and respond with JSON only:

"""
${content}
"""

Determine:
1. primaryPillar: Which response type would be MOST valuable right now?
   Options: therapist, body, nurturer, coach, shadow, sage, healer
   
   Guidelines:
   - therapist: processing patterns, seeking understanding, relationship issues
   - body: physical symptoms, stress, anxiety, overwhelm, need for grounding
   - nurturer: self-critical, shame, harsh inner voice, need for compassion
   - coach: stuck, procrastinating, avoiding action, needing direction/motivation
   - shadow: projection, recurring patterns, triggers, unconscious material
   - sage: meaning-seeking, existential questions, life transitions, perspective needed
   - healer: spiritual concerns, holistic needs, ritual/ceremony would help

2. emotionalTone: Array of 2-4 primary emotions present (e.g., ["anxious", "hopeful", "confused"])

3. themes: Array of 2-3 core themes (e.g., ["relationship conflict", "self-worth", "career uncertainty"])

4. urgencyLevel: 
   - "crisis" if mentions self-harm, suicide, immediate danger
   - "high" if acute distress, panic, overwhelming emotion
   - "medium" if struggling but stable, processing difficulty
   - "low" if reflective, processing, relatively stable

Respond with valid JSON only:
{"primaryPillar": "...", "emotionalTone": [...], "themes": [...], "urgencyLevel": "..."}`;

    let response;
    
    if (ai.messages) {
      // Anthropic Claude
      response = await ai.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: analysisPrompt
        }]
      });
      
      const text = response.content[0]?.text || '';
      return JSON.parse(text);
      
    } else {
      // OpenAI GPT
      response = await ai.createChatCompletion({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: analysisPrompt
        }],
        max_tokens: 500,
        temperature: 0.3
      });
      
      const text = response.data.choices[0]?.message?.content || '';
      return JSON.parse(text);
    }
    
  } catch (error) {
    console.error('AI analysis failed, falling back to keyword analysis:', error);
    
    // Fallback to keyword-based analysis
    const emotionalTone = ['uncertain']; // Safe default
    const themes = ['general reflection'];
    const urgencyLevel = isHighUrgency ? 'high' : 'medium';
    
    // Use keyword-based pillar suggestion
    const primaryPillar = suggestPrimaryPillar(content, emotionalTone, themes);
    
    return {
      primaryPillar,
      emotionalTone,
      themes,
      urgencyLevel
    };
  }
}

/**
 * Generate a response from a specific pillar
 */
export async function generatePillarResponse(
  content: string,
  pillar: ResponsePillar,
  analysis: AnalysisResult
): Promise<PillarResponse> {
  
  try {
    const ai = await getAIClient();
    const systemPrompt = PILLAR_PROMPTS[pillar];
    const meta = PILLAR_METADATA[pillar];
    
    const userPrompt = `Here is the journal entry to respond to:

"""
${content}
"""

Context:
- Detected emotional tone: ${analysis.emotionalTone.join(', ')}
- Core themes: ${analysis.themes.join(', ')}
- Urgency level: ${analysis.urgencyLevel}

Provide your response as the ${meta.title}. Be genuine, specific to what they wrote, and offer real value.
Do not be generic. Reference specific things they shared.

After your main response, if appropriate, include:
- A specific practice (with clear instructions)
- A follow-up journal prompt

Format as JSON:
{
  "response": "Your main response text here...",
  "practices": [
    {
      "type": "breathwork|movement|meditation|writing|ritual|action",
      "title": "Name of practice",
      "duration": "2 minutes",
      "instructions": "Clear step-by-step instructions..."
    }
  ],
  "journalPrompt": "Optional follow-up question for deeper exploration..."
}

Keep practices practical and achievable. Make journal prompts thought-provoking but not overwhelming.`;

    let response;
    
    if (ai.messages) {
      // Anthropic Claude
      response = await ai.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{
          role: 'user', 
          content: userPrompt
        }]
      });
      
      const text = response.content[0]?.text || '';
      const parsed = JSON.parse(text);
      
      return {
        pillar,
        title: meta.title,
        icon: meta.icon,
        response: parsed.response,
        practices: parsed.practices || [],
        journalPrompt: parsed.journalPrompt
      };
      
    } else {
      // OpenAI GPT
      response = await ai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      });
      
      const text = response.data.choices[0]?.message?.content || '';
      const parsed = JSON.parse(text);
      
      return {
        pillar,
        title: meta.title,
        icon: meta.icon,
        response: parsed.response,
        practices: parsed.practices || [],
        journalPrompt: parsed.journalPrompt
      };
    }
    
  } catch (error) {
    console.error(`Failed to generate ${pillar} response:`, error);
    
    // Fallback response
    const meta = PILLAR_METADATA[pillar];
    return {
      pillar,
      title: meta.title,
      icon: meta.icon,
      response: `Thank you for sharing this with me. I understand you're going through something meaningful, and I want you to know that your experience matters. While I'm having trouble generating a full response right now, I'm here to support you. Consider taking a few deep breaths and being gentle with yourself.`,
      practices: [],
      journalPrompt: undefined
    };
  }
}

/**
 * Generate all responses (primary first, then others in parallel)
 */
export async function generateAllResponses(
  content: string,
  analysis: AnalysisResult
): Promise<PillarResponse[]> {
  
  const allPillars: ResponsePillar[] = [
    'therapist', 'body', 'healer', 'nurturer', 'coach', 'shadow', 'sage'
  ];

  try {
    // Generate primary response first for immediate user feedback
    const primaryResponse = await generatePillarResponse(
      content, 
      analysis.primaryPillar, 
      analysis
    );
    
    // Generate other responses in parallel
    const otherPillars = allPillars.filter(p => p !== analysis.primaryPillar);
    const otherResponses = await Promise.all(
      otherPillars.map(pillar => generatePillarResponse(content, pillar, analysis))
    );

    // Return with primary first, others in a logical order
    return [primaryResponse, ...otherResponses];
    
  } catch (error) {
    console.error('Failed to generate all responses:', error);
    
    // Return at least the primary response
    try {
      const primaryResponse = await generatePillarResponse(
        content,
        analysis.primaryPillar,
        analysis
      );
      return [primaryResponse];
    } catch (primaryError) {
      console.error('Even primary response failed:', primaryError);
      throw new Error('Unable to generate any responses');
    }
  }
}

/**
 * Complete entry analysis pipeline
 */
export async function analyzeJournalEntry(
  content: string,
  generateAll: boolean = false
): Promise<{
  analysis: AnalysisResult;
  responses: PillarResponse[];
  crisis?: {
    detected: boolean;
    resources?: {
      call: string;
      text: string;
      chat: string;
    };
  };
}> {
  
  // Step 1: Analyze the entry
  const analysis = await analyzeEntry(content);
  
  // Step 2: Handle crisis situations
  if (analysis.urgencyLevel === 'crisis') {
    return {
      analysis,
      responses: [],
      crisis: {
        detected: true,
        resources: {
          call: '988',
          text: 'HOME to 741741',
          chat: 'https://988lifeline.org/chat/'
        }
      }
    };
  }
  
  // Step 3: Generate appropriate responses
  let responses: PillarResponse[];
  
  if (generateAll) {
    responses = await generateAllResponses(content, analysis);
  } else {
    // Free tier: only primary response
    const primaryResponse = await generatePillarResponse(
      content,
      analysis.primaryPillar,
      analysis
    );
    responses = [primaryResponse];
  }
  
  return {
    analysis,
    responses
  };
}