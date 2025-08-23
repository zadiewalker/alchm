// Genkit-powered Emotional Alchemy Flow
import { defineFlow } from '@genkit-ai/flow';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';
import { 
  EmotionalAlchemyInput, 
  EmotionalAlchemyOutput,
  detectEmotionalState,
  extractEmotionalTags,
  generateSuggestedActions,
  predictMoodShift,
  generateAffirmation,
  TRAUMA_INFORMED_PROMPTS
} from './emotional-alchemy';

// Enhanced Genkit flow for emotional alchemy
export const emotionalAlchemyFlow = defineFlow(
  {
    name: 'emotional-alchemy',
    inputSchema: EmotionalAlchemyInput,
    outputSchema: EmotionalAlchemyOutput,
  },
  async (input) => {
    try {
      // Detect emotional state first
      const emotionalState = detectEmotionalState(input.text, input.beforeMood);
      
      // Get appropriate trauma-informed prompt
      const systemPrompt = TRAUMA_INFORMED_PROMPTS[emotionalState];
      
      // Create context from previous entries if available
      const context = input.previousEntries && input.previousEntries.length > 0
        ? `\n\nContext from recent entries: ${input.previousEntries.slice(-3).join(' ')}`
        : '';
      
      // Generate AI reflection using Gemini
      const reflectionPrompt = `${systemPrompt}
      
      Journal Entry: "${input.text}"${context}
      
      Provide a compassionate, insightful reflection that:
      1. Validates their emotional experience
      2. Offers a gentle reframe or new perspective
      3. Highlights their strength and resilience
      4. Feels personally crafted, not generic
      
      Keep it under 50 words but make every word count. This person needs to feel truly seen and understood.`;

      const geminiResponse = await gemini15Flash.generate({
        prompt: reflectionPrompt,
        config: {
          maxOutputTokens: 100,
          temperature: 0.7,
          topP: 0.8,
        },
      });

      const reflection = geminiResponse.text();
      
      // Fallback if AI response is insufficient
      if (!reflection || reflection.length < 20) {
        throw new Error('Insufficient AI response');
      }

      // Extract emotional tags
      const emotionalTags = extractEmotionalTags(input.text);
      
      // Generate suggested actions
      const suggestedActions = generateSuggestedActions(input.text, emotionalState, emotionalTags);
      
      // Predict mood shift
      const moodPrediction = predictMoodShift(input.text, input.beforeMood, emotionalState);
      
      // Generate affirmation
      const affirmation = generateAffirmation(input.text, emotionalState);
      
      // Enhanced pattern detection with AI
      const patterns = await detectPatternsWithAI(input.text, input.previousEntries || []);
      
      // Check if celebration should be triggered
      const celebrationTriggered = moodPrediction.prediction > (input.beforeMood || 5) + 1.5;
      
      // Generate growth insight if celebration triggered
      let growth: string | undefined;
      if (celebrationTriggered) {
        const growthPrompt = `Based on this journal entry showing emotional progress: "${input.text}"
        
        Generate a brief, encouraging message (20 words max) celebrating their growth and progress. Make it personal and specific to their breakthrough.`;
        
        const growthResponse = await gemini15Flash.generate({
          prompt: growthPrompt,
          config: {
            maxOutputTokens: 50,
            temperature: 0.6,
          },
        });
        
        growth = growthResponse.text() || 'You\'re making meaningful progress in your emotional journey!';
      }

      return {
        reflection,
        suggestedActions,
        moodPrediction: moodPrediction.prediction,
        confidenceScore: moodPrediction.confidence,
        emotionalTags,
        celebrationTriggered,
        insights: {
          patterns,
          growth,
          affirmation
        }
      };

    } catch (error) {
      console.error('Error in Genkit emotional alchemy flow:', error);
      
      // Graceful fallback to non-AI processing
      return await fallbackEmotionalAlchemy(input);
    }
  }
);

// AI-powered pattern detection
async function detectPatternsWithAI(currentText: string, previousEntries: string[]): Promise<string[]> {
  if (previousEntries.length === 0) {
    return ['Beginning your emotional awareness journey'];
  }

  try {
    const patternPrompt = `Analyze these journal entries for emotional and behavioral patterns:

Current entry: "${currentText}"

Previous entries: ${previousEntries.slice(-5).join('\n\n')}

Identify 2-3 key patterns in:
- Emotional themes
- Coping strategies
- Growth areas
- Recurring challenges

Format as brief, encouraging observations (10 words each max). Focus on patterns that help the person understand themselves better.`;

    const patternResponse = await gemini15Flash.generate({
      prompt: patternPrompt,
      config: {
        maxOutputTokens: 150,
        temperature: 0.5,
      },
    });

    const patternText = patternResponse.text();
    if (patternText) {
      // Parse the response into individual patterns
      return patternText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3)
        .map(pattern => pattern.replace(/^[-*•]\s*/, '').trim());
    }
  } catch (error) {
    console.error('Error in AI pattern detection:', error);
  }

  // Fallback to basic pattern detection
  return ['Consistent engagement with emotional awareness'];
}

// Fallback processing when AI fails
async function fallbackEmotionalAlchemy(input: z.infer<typeof EmotionalAlchemyInput>): Promise<z.infer<typeof EmotionalAlchemyOutput>> {
  const emotionalState = detectEmotionalState(input.text, input.beforeMood);
  const emotionalTags = extractEmotionalTags(input.text);
  const suggestedActions = generateSuggestedActions(input.text, emotionalState, emotionalTags);
  const moodPrediction = predictMoodShift(input.text, input.beforeMood, emotionalState);
  const affirmation = generateAffirmation(input.text, emotionalState);

  // Fallback reflections
  const fallbackReflections = {
    distressed: 'I hear you, and your feelings are completely valid. Thank you for trusting me with your thoughts. You have more strength than you realize.',
    neutral: 'Your willingness to reflect shows wisdom and self-awareness. These moments of introspection are building blocks for growth.',
    positive: 'The positive energy in your words is beautiful. This joy you\'re experiencing is well-deserved and worth celebrating.'
  };

  return {
    reflection: fallbackReflections[emotionalState],
    suggestedActions,
    moodPrediction: moodPrediction.prediction,
    confidenceScore: moodPrediction.confidence * 0.8, // Lower confidence for fallback
    emotionalTags,
    celebrationTriggered: moodPrediction.prediction > (input.beforeMood || 5) + 1.5,
    insights: {
      patterns: ['Engaging in meaningful self-reflection'],
      growth: moodPrediction.prediction > (input.beforeMood || 5) + 1.5 
        ? 'You\'re making progress in your emotional journey!'
        : undefined,
      affirmation
    }
  };
}

// Export for use in other flows
export { detectPatternsWithAI };