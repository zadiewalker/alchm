// Emotional Alchemy Engine - Transform pain into power within 60 seconds
import { z } from 'zod';

// Input/Output schemas for the emotional alchemy flow
export const EmotionalAlchemyInput = z.object({
  text: z.string().min(10, 'Journal entry must be at least 10 characters'),
  userId: z.string(),
  beforeMood: z.number().min(1).max(10).optional(),
  previousEntries: z.array(z.string()).optional(),
  timestamp: z.number().optional()
});

export const EmotionalAlchemyOutput = z.object({
  reflection: z.string(),
  suggestedActions: z.array(z.string()),
  moodPrediction: z.number().min(1).max(10),
  confidenceScore: z.number().min(0).max(1),
  emotionalTags: z.array(z.string()),
  celebrationTriggered: z.boolean(),
  insights: z.object({
    patterns: z.array(z.string()),
    growth: z.string().optional(),
    affirmation: z.string()
  })
});

export type EmotionalAlchemyInputType = z.infer<typeof EmotionalAlchemyInput>;
export type EmotionalAlchemyOutputType = z.infer<typeof EmotionalAlchemyOutput>;

// Trauma-informed prompts for different emotional states
const TRAUMA_INFORMED_PROMPTS = {
  distressed: `You are a compassionate AI therapist trained in trauma-informed care. 
    Analyze this journal entry with deep empathy and understanding. The person is struggling.
    Provide a reflection that validates their experience and offers gentle guidance.
    Keep your response under 50 words but make it feel personally crafted.
    Focus on their strength and resilience, even in this difficult moment.`,
  
  neutral: `You are a wise and supportive AI companion. 
    This person is sharing their thoughts and feelings. 
    Provide an insightful reflection that helps them see patterns and possibilities.
    Keep your response under 50 words but make it meaningful and actionable.
    Help them connect with their inner wisdom.`,
  
  positive: `You are an encouraging AI guide celebrating this person's growth.
    They're sharing a positive experience or insight.
    Provide a reflection that amplifies their joy and helps them build on this momentum.
    Keep your response under 50 words but make it celebratory and forward-looking.
    Help them see how this connects to their larger journey.`
};

// Emotional state detection
export function detectEmotionalState(text: string, beforeMood?: number): 'distressed' | 'neutral' | 'positive' {
  const distressKeywords = [
    'anxious', 'depressed', 'overwhelmed', 'hopeless', 'scared', 'angry', 
    'frustrated', 'lost', 'broken', 'hurt', 'pain', 'struggle', 'difficult',
    'hard', 'stressed', 'worried', 'fear', 'sad', 'lonely', 'empty'
  ];
  
  const positiveKeywords = [
    'grateful', 'happy', 'joy', 'excited', 'proud', 'accomplished', 
    'peaceful', 'calm', 'hopeful', 'love', 'blessed', 'amazing',
    'wonderful', 'great', 'good', 'success', 'breakthrough', 'growth'
  ];
  
  const lowerText = text.toLowerCase();
  const distressCount = distressKeywords.filter(word => lowerText.includes(word)).length;
  const positiveCount = positiveKeywords.filter(word => lowerText.includes(word)).length;
  
  // Factor in mood score if available
  if (beforeMood) {
    if (beforeMood <= 3) return 'distressed';
    if (beforeMood >= 7) return 'positive';
  }
  
  if (distressCount > positiveCount && distressCount > 0) return 'distressed';
  if (positiveCount > distressCount && positiveCount > 0) return 'positive';
  return 'neutral';
}

// Extract emotional tags from text
export function extractEmotionalTags(text: string): string[] {
  const emotionMap = {
    anxiety: ['anxious', 'nervous', 'worried', 'stressed', 'tense'],
    sadness: ['sad', 'depressed', 'down', 'melancholy', 'grief'],
    anger: ['angry', 'frustrated', 'annoyed', 'irritated', 'mad'],
    joy: ['happy', 'joyful', 'excited', 'cheerful', 'elated'],
    fear: ['scared', 'afraid', 'fearful', 'terrified', 'nervous'],
    love: ['love', 'affection', 'care', 'warmth', 'connection'],
    gratitude: ['grateful', 'thankful', 'blessed', 'appreciative'],
    hope: ['hopeful', 'optimistic', 'positive', 'encouraged'],
    peace: ['calm', 'peaceful', 'serene', 'tranquil', 'centered'],
    confusion: ['confused', 'lost', 'uncertain', 'puzzled', 'unclear']
  };
  
  const lowerText = text.toLowerCase();
  const tags: string[] = [];
  
  Object.entries(emotionMap).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tags.push(emotion);
    }
  });
  
  return tags.length > 0 ? tags : ['reflection'];
}

// Generate suggested actions based on emotional state and content
export function generateSuggestedActions(
  text: string, 
  emotionalState: 'distressed' | 'neutral' | 'positive',
  emotionalTags: string[]
): string[] {
  const baseActions = {
    distressed: [
      'Take 5 deep breaths and remind yourself: this feeling will pass',
      'Write down 3 things you\'re grateful for right now',
      'Reach out to someone who cares about you',
      'Go for a short walk or do gentle movement',
      'Practice the 5-4-3-2-1 grounding technique'
    ],
    neutral: [
      'Set one small intention for tomorrow',
      'Notice one pattern in your thoughts today',
      'Ask yourself: what would make tomorrow 1% better?',
      'Reflect on one thing you learned about yourself',
      'Consider sharing this insight with someone you trust'
    ],
    positive: [
      'Celebrate this moment - you deserve it!',
      'Write down what led to this positive feeling',
      'Share your joy with someone who would appreciate it',
      'Use this energy to tackle something you\'ve been putting off',
      'Set an intention to build on this momentum'
    ]
  };
  
  // Customize actions based on emotional tags
  const customActions: string[] = [];
  
  if (emotionalTags.includes('anxiety')) {
    customActions.push('Try the 4-7-8 breathing technique to calm your nervous system');
  }
  if (emotionalTags.includes('gratitude')) {
    customActions.push('Consider starting a daily gratitude practice');
  }
  if (emotionalTags.includes('confusion')) {
    customActions.push('Break down what you\'re feeling into smaller, manageable pieces');
  }
  
  // Return mix of base and custom actions
  const actions = [...baseActions[emotionalState].slice(0, 3), ...customActions.slice(0, 2)];
  return actions.slice(0, 4); // Limit to 4 actions
}

// Calculate mood prediction based on content analysis
export function predictMoodShift(
  text: string, 
  beforeMood: number = 5,
  emotionalState: 'distressed' | 'neutral' | 'positive'
): { prediction: number; confidence: number } {
  const textLength = text.length;
  const wordCount = text.split(/\s+/).length;
  
  // Base prediction on emotional state
  let basePrediction = beforeMood;
  let confidence = 0.5;
  
  switch (emotionalState) {
    case 'distressed':
      // Writing about distress often provides some relief
      basePrediction = Math.min(beforeMood + 0.5, 10);
      confidence = textLength > 200 ? 0.7 : 0.5; // More writing = more processing
      break;
    case 'positive':
      // Positive entries tend to maintain or boost mood
      basePrediction = Math.min(beforeMood + 1, 10);
      confidence = 0.8;
      break;
    case 'neutral':
      // Neutral reflection provides moderate benefit
      basePrediction = Math.min(beforeMood + 0.3, 10);
      confidence = 0.6;
      break;
  }
  
  // Adjust for engagement level (longer entries = more processing)
  if (wordCount > 100) {
    basePrediction += 0.2;
    confidence += 0.1;
  }
  
  return {
    prediction: Math.round(basePrediction * 10) / 10,
    confidence: Math.min(confidence, 1)
  };
}

// Generate affirmations based on content
export function generateAffirmation(text: string, emotionalState: 'distressed' | 'neutral' | 'positive'): string {
  const affirmations = {
    distressed: [
      'You have survived 100% of your difficult days so far. You are stronger than you know.',
      'This pain you feel is temporary. Your resilience is permanent.',
      'You are worthy of love and compassion, especially from yourself.',
      'Every small step forward is an act of courage.',
      'You are not alone in this struggle. Your feelings are valid.'
    ],
    neutral: [
      'You are exactly where you need to be in your journey.',
      'Your willingness to reflect shows your commitment to growth.',
      'You have the wisdom within you to navigate this path.',
      'Every moment of awareness is a step toward understanding.',
      'You are becoming more yourself with each passing day.'
    ],
    positive: [
      'Your joy is a gift to the world. Let it shine brightly.',
      'You are creating positive momentum in your life.',
      'This happiness you feel is a preview of what\'s possible.',
      'You deserve all the good things happening in your life.',
      'Your positive energy is contagious and healing.'
    ]
  };
  
  const options = affirmations[emotionalState];
  return options[Math.floor(Math.random() * options.length)];
}

// Core emotional alchemy processing function
export async function processEmotionalAlchemy(input: EmotionalAlchemyInputType): Promise<EmotionalAlchemyOutputType> {
  try {
    // Detect emotional state
    const emotionalState = detectEmotionalState(input.text, input.beforeMood);
    
    // Extract emotional tags
    const emotionalTags = extractEmotionalTags(input.text);
    
    // Generate AI reflection (placeholder for now - will integrate with Genkit/Gemini)
    const reflection = await generateAIReflection(input.text, emotionalState, input.previousEntries);
    
    // Generate suggested actions
    const suggestedActions = generateSuggestedActions(input.text, emotionalState, emotionalTags);
    
    // Predict mood shift
    const moodPrediction = predictMoodShift(input.text, input.beforeMood, emotionalState);
    
    // Generate affirmation
    const affirmation = generateAffirmation(input.text, emotionalState);
    
    // Detect patterns (basic implementation)
    const patterns = detectPatterns(input.text, input.previousEntries || []);
    
    // Check if celebration should be triggered
    const celebrationTriggered = moodPrediction.prediction > (input.beforeMood || 5) + 1;
    
    return {
      reflection,
      suggestedActions,
      moodPrediction: moodPrediction.prediction,
      confidenceScore: moodPrediction.confidence,
      emotionalTags,
      celebrationTriggered,
      insights: {
        patterns,
        growth: celebrationTriggered ? 'You\'re making meaningful progress in your emotional journey!' : undefined,
        affirmation
      }
    };
  } catch (error) {
    console.error('Error in emotional alchemy processing:', error);
    throw new Error('Failed to process emotional alchemy');
  }
}

// Placeholder for AI reflection generation (will be replaced with Genkit integration)
async function generateAIReflection(
  text: string, 
  emotionalState: 'distressed' | 'neutral' | 'positive',
  previousEntries?: string[]
): Promise<string> {
  // This is a placeholder - in the next step we'll integrate with Genkit/Gemini
  const templates = {
    distressed: 'I hear the pain in your words, and I want you to know that your feelings are completely valid. What stands out to me is your courage in expressing these difficult emotions.',
    neutral: 'Your thoughtful reflection shows a deep commitment to understanding yourself. I notice you\'re processing complex feelings with wisdom and patience.',
    positive: 'The joy and gratitude in your words is beautiful to witness. This positive energy you\'re cultivating is creating ripples of growth in your life.'
  };
  
  return templates[emotionalState];
}

// Basic pattern detection (will be enhanced with AI)
function detectPatterns(currentText: string, previousEntries: string[]): string[] {
  const patterns: string[] = [];
  
  // Simple keyword frequency analysis
  const currentWords = currentText.toLowerCase().split(/\s+/);
  const allPreviousText = previousEntries.join(' ').toLowerCase();
  
  const recurringThemes = ['work', 'family', 'relationship', 'anxiety', 'goal', 'progress'];
  
  recurringThemes.forEach(theme => {
    if (currentWords.includes(theme) && allPreviousText.includes(theme)) {
      patterns.push(`Recurring theme: ${theme}`);
    }
  });
  
  if (patterns.length === 0) {
    patterns.push('New emotional territory being explored');
  }
  
  return patterns;
}