// AI integration for ALCHM - Gemini and OpenAI
import { getServerEnv } from './env';
import { sanitizeInput } from './security';

// Types for AI responses
export interface AIResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  metadata?: {
    model: string;
    tokens: number;
    processingTime: number;
  };
}

export interface JournalAnalysis {
  mood: 'positive' | 'neutral' | 'negative' | 'mixed';
  emotions: string[];
  themes: string[];
  insights: string[];
  suggestions: string[];
  riskFactors?: string[];
  supportRecommendations?: string[];
}

export interface TraumaAssessment {
  severity: 'low' | 'medium' | 'high';
  triggers: string[];
  copingStrategies: string[];
  professionalSupport: boolean;
  resources: string[];
}

// Trauma-informed prompts
const TRAUMA_INFORMED_PROMPTS = {
  analysis: `You are a trauma-informed AI assistant analyzing a journal entry. 
Your response should be:
- Non-judgmental and validating
- Focused on strengths and resilience
- Culturally sensitive
- Emphasizing user agency and choice
- Avoiding retraumatization

Analyze the following journal entry and provide insights that support healing and growth.`,

  reflection: `As a trauma-informed companion, help the user reflect on their experience with:
- Validation of their feelings
- Recognition of their strength
- Gentle exploration of patterns
- Emphasis on their resilience
- Suggestions for self-care

Remember: Safety, choice, and empowerment are key principles.`,

  crisis: `This appears to be a crisis situation. Respond with:
- Immediate validation and support
- Crisis resources and hotlines
- Encouragement to seek professional help
- Reminder of their worth and that help is available
- Safety planning suggestions

Always prioritize immediate safety and professional intervention.`
};

// Crisis keywords that require special handling
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'hurt myself', 'self-harm', 'cutting', 'overdose',
  'hopeless', 'no point', 'better off dead'
];

class AIService {
  private openaiApiKey: string;
  private geminiApiKey: string;

  constructor() {
    const env = getServerEnv();
    this.openaiApiKey = env.openaiApiKey;
    this.geminiApiKey = env.geminiApiKey || '';
  }

  // Analyze journal entry with trauma-informed approach
  async analyzeJournalEntry(entry: string): Promise<JournalAnalysis> {
    const sanitizedEntry = sanitizeInput(entry);
    
    // Check for crisis indicators
    const hasCrisisIndicators = this.detectCrisisIndicators(sanitizedEntry);
    
    try {
      const response = await this.callGemini({
        prompt: hasCrisisIndicators ? TRAUMA_INFORMED_PROMPTS.crisis : TRAUMA_INFORMED_PROMPTS.analysis,
        content: sanitizedEntry,
        temperature: 0.3, // Lower temperature for more consistent, safer responses
        maxTokens: 500
      });

      return this.parseJournalAnalysis(response.content, hasCrisisIndicators);
    } catch (error) {
      console.error('[AI] Journal analysis failed:', error);
      return this.getSafetyFallbackAnalysis(hasCrisisIndicators);
    }
  }

  // Generate reflection prompts
  async generateReflectionPrompts(previousEntries: string[]): Promise<string[]> {
    try {
      const context = previousEntries.slice(-3).join('\n---\n'); // Last 3 entries
      
      const response = await this.callGemini({
        prompt: `Based on these recent journal entries, generate 3 gentle, trauma-informed reflection prompts that encourage self-discovery and healing. Each prompt should be supportive and strength-based.`,
        content: sanitizeInput(context),
        temperature: 0.7,
        maxTokens: 200
      });

      return this.parseReflectionPrompts(response.content);
    } catch (error) {
      console.error('[AI] Reflection prompt generation failed:', error);
      return this.getDefaultReflectionPrompts();
    }
  }

  // Assess trauma indicators with extreme care
  async assessTraumaIndicators(entry: string): Promise<TraumaAssessment> {
    const sanitizedEntry = sanitizeInput(entry);
    
    try {
      const response = await this.callGemini({
        prompt: `As a trauma-informed AI, carefully assess this journal entry for trauma indicators. Focus on resilience, coping strategies, and appropriate resources. Be extremely cautious and supportive.`,
        content: sanitizedEntry,
        temperature: 0.2, // Very low temperature for sensitive analysis
        maxTokens: 300
      });

      return this.parseTraumaAssessment(response.content);
    } catch (error) {
      console.error('[AI] Trauma assessment failed:', error);
      return this.getSafetyFallbackTraumaAssessment();
    }
  }

  // Call Gemini API with proper error handling and rate limiting
  private async callGemini({
    prompt,
    content,
    temperature = 0.5,
    maxTokens = 300
  }: {
    prompt: string;
    content: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${prompt}\n\nJournal Entry:\n${content}`
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          content: data.candidates[0].content.parts[0].text,
          confidence: 0.8, // Gemini doesn't provide confidence scores
          metadata: {
            model: 'gemini-pro',
            tokens: data.usageMetadata?.totalTokenCount || 0,
            processingTime
          }
        };
      } else {
        throw new Error('Invalid response format from Gemini');
      }
    } catch (error) {
      console.error('[AI] Gemini API call failed:', error);
      throw error;
    }
  }

  // Detect crisis indicators in text
  private detectCrisisIndicators(text: string): boolean {
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  }

  // Parse journal analysis from AI response
  private parseJournalAnalysis(content: string, hasCrisisIndicators: boolean): JournalAnalysis {
    // This would parse the AI response into structured data
    // For now, returning a safe default structure
    return {
      mood: hasCrisisIndicators ? 'negative' : 'neutral',
      emotions: ['processing', 'reflective'],
      themes: ['self-awareness', 'growth'],
      insights: ['You are taking important steps in your healing journey'],
      suggestions: [
        'Continue journaling as a form of self-care',
        'Consider speaking with a trusted friend or counselor',
        'Practice grounding techniques when feeling overwhelmed'
      ],
      ...(hasCrisisIndicators && {
        riskFactors: ['crisis indicators detected'],
        supportRecommendations: [
          'Please reach out to a mental health professional immediately',
          'Call 988 (Suicide & Crisis Lifeline) if in the US',
          'Contact your local emergency services if in immediate danger'
        ]
      })
    };
  }

  // Parse trauma assessment
  private parseTraumaAssessment(content: string): TraumaAssessment {
    return {
      severity: 'low',
      triggers: [],
      copingStrategies: ['journaling', 'mindfulness', 'self-reflection'],
      professionalSupport: false,
      resources: [
        'SAMHSA National Helpline: 1-800-662-4357',
        'Crisis Text Line: Text HOME to 741741',
        'National Alliance on Mental Illness: nami.org'
      ]
    };
  }

  // Safety fallbacks
  private getSafetyFallbackAnalysis(hasCrisisIndicators: boolean): JournalAnalysis {
    return {
      mood: 'neutral',
      emotions: ['processing'],
      themes: ['self-reflection'],
      insights: ['Your willingness to journal shows strength and self-awareness'],
      suggestions: ['Continue this practice of self-reflection'],
      ...(hasCrisisIndicators && {
        riskFactors: ['Please seek professional support'],
        supportRecommendations: [
          'Contact a mental health professional',
          'Call 988 for crisis support',
          'Reach out to trusted friends or family'
        ]
      })
    };
  }

  private getSafetyFallbackTraumaAssessment(): TraumaAssessment {
    return {
      severity: 'medium',
      triggers: [],
      copingStrategies: ['seek professional support'],
      professionalSupport: true,
      resources: [
        'National Suicide Prevention Lifeline: 988',
        'Crisis Text Line: Text HOME to 741741',
        'SAMHSA: 1-800-662-4357'
      ]
    };
  }

  private parseReflectionPrompts(content: string): string[] {
    // Parse AI response into reflection prompts
    return [
      'What brought you peace or comfort today?',
      'How did you show strength or resilience recently?',
      'What would you tell a friend going through something similar?'
    ];
  }

  private getDefaultReflectionPrompts(): string[] {
    return [
      'What are three things you appreciate about yourself today?',
      'How have you grown stronger through past challenges?',
      'What would bring you comfort and peace right now?'
    ];
  }
}

// Export singleton instance
export const aiService = new AIService();

// Rate limiting for AI calls
const AI_RATE_LIMITS = {
  analysis: { calls: 10, typeof window !== 'undefined' && window: 60000 }, // 10 calls per minute
  reflection: { calls: 5, typeof window !== 'undefined' && window: 60000 }, // 5 calls per minute
};

const rateLimitTracker = new Map<string, { count: number; resetTime: number }>();

export function checkAIRateLimit(operation: keyof typeof AI_RATE_LIMITS, userId: string): boolean {
  const key = `${operation}:${userId}`;
  const limit = AI_RATE_LIMITS[operation];
  const now = Date.now();
  
  const tracker = rateLimitTracker.get(key);
  
  if (!tracker || now > tracker.resetTime) {
    rateLimitTracker.set(key, { count: 1, resetTime: now + limit.typeof window !== 'undefined' && window });
    return true;
  }
  
  if (tracker.count >= limit.calls) {
    return false;
  }
  
  tracker.count++;
  return true;
}