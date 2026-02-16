// ALCHM AI Analysis API Client
import { getAuth } from 'firebase/auth';

export interface JournalAnalysis {
  id: string;
  analysis: {
    emotionalRecognition: string;
    strengthIdentification: string;
    gentleInsight: string;
    nurturingSuggestion: string;
  };
  emotionalThemes: {
    primaryEmotions: string[];
    emotionalJourney: string;
    copingStrategies: string[] | null;
    growthIndicators: string[] | null;
    supportiveNote: string;
  };
  wisdomReflection: string;
  crisisAssessment: {
    isCrisis: boolean;
    confidenceLevel: 'low' | 'medium' | 'high';
    reasoning: string;
    suggestedResources: string[] | null;
  };
  metadata: {
    analyzedAt: Date;
    userId: string;
    journalEntryId: string;
  };
}

export interface AnalysisRequest {
  journalEntry: string;
  userId: string;
  journalEntryId: string;
}

export interface AnalysisOptions {
  continuityContext?: string;
  pathwayGuidance?: string;
  reflectionFocus?: string;
  isCheckin?: boolean;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  confidenceLevel: 'low' | 'medium' | 'high';
  reasoning: string;
  suggestedResources: string[] | null;
}

// Get the base URL for Firebase Functions
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:5001/alchm-digital-sanctuary/us-central1';
    }
    return 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
  }
  // Default for server-side rendering
  return 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
}

// Get authentication token
async function getAuthToken(): Promise<string | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

// Make authenticated API request
async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/aiAnalysis${endpoint}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Couldn't parse error as JSON, use default message
    }
    
    throw new Error(errorMessage);
  }

  return response;
}

// Main AI Analysis function - NOW USING ONLY LOCAL ANALYSIS FOR SPEED
export async function analyzeJournalEntry(
  journalEntry: string,
  userId: string,
  journalEntryId: string,
  options: AnalysisOptions = {}
): Promise<JournalAnalysis> {
  
  console.log('🚀 Using instant local Khepera analysis for maximum speed');
  
  // Return immediate local analysis - no network calls, no delays
  return createLocalAnalysis(journalEntry, userId, journalEntryId, options);
}

// Quick crisis detection (faster, separate endpoint)
export async function detectCrisis(
  journalEntry: string,
  userId: string
): Promise<CrisisDetectionResult> {
  try {
    const response = await makeAuthenticatedRequest('/crisis-detection', {
      method: 'POST',
      body: JSON.stringify({ journalEntry, userId }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Crisis detection failed');
    }

    return data.crisisAssessment;

  } catch (error) {
    console.error('Crisis Detection Error:', error);
    
    // Return safe fallback
    return {
      isCrisis: false,
      confidenceLevel: 'low',
      reasoning: 'Unable to assess due to technical error',
      suggestedResources: ['988 Lifeline', 'Crisis Text Line: Text HOME to 741741']
    };
  }
}

// Health check for API availability
export async function checkApiHealth(): Promise<boolean> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/healthCheck/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Get user's analysis history
export async function getUserAnalytics(userId: string) {
  try {
    const response = await makeAuthenticatedRequest(`/analytics/${userId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Analytics retrieval failed');
    }

    return data;

  } catch (error) {
    console.error('Analytics Error:', error);
    return null;
  }
}

// Create instant local analysis for immediate responses
function createLocalAnalysis(
  journalEntry: string,
  userId: string,
  journalEntryId: string,
  options: AnalysisOptions
): JournalAnalysis {
  const text = journalEntry.toLowerCase();
  const wordCount = journalEntry.trim().split(/\s+/).length;
  
  // Quick emotion detection
  const emotionPatterns = {
    grateful: ['thank', 'grateful', 'appreciate', 'blessed', 'thankful'],
    anxious: ['anxious', 'worried', 'stress', 'nervous', 'overwhelm'],
    sad: ['sad', 'down', 'depressed', 'lonely', 'empty', 'hopeless'],
    angry: ['angry', 'mad', 'frustrated', 'annoyed', 'furious'],
    happy: ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'great'],
    peaceful: ['calm', 'peaceful', 'serene', 'quiet', 'stillness'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'mixed'],
    hopeful: ['hope', 'optimistic', 'better', 'improving', 'forward']
  };
  
  const detectedEmotions: string[] = [];
  for (const [emotion, words] of Object.entries(emotionPatterns)) {
    if (words.some(word => text.includes(word))) {
      detectedEmotions.push(emotion);
    }
  }
  
  // Quick strength identification
  const strengthIndicators: string[] = [];
  if (text.includes('try') || text.includes('trying')) strengthIndicators.push('perseverance');
  if (text.includes('help') || text.includes('support')) strengthIndicators.push('seeking connection');
  if (text.includes('understand') || text.includes('figure')) strengthIndicators.push('self-awareness');
  if (text.includes('feel') || text.includes('emotion')) strengthIndicators.push('emotional intelligence');
  if (wordCount > 50) strengthIndicators.push('thoughtful reflection');
  
  // Generate appropriate responses
  const responses = {
    emotionalRecognition: generateEmotionalRecognition(detectedEmotions),
    strengthIdentification: generateStrengthResponse(strengthIndicators),
    gentleInsight: generateInsight(text, detectedEmotions, options),
    nurturingSuggestion: generateNurturingSuggestion(detectedEmotions)
  };
  
  return {
    id: `local_${Date.now()}`,
    analysis: responses,
    emotionalThemes: {
      primaryEmotions: detectedEmotions.slice(0, 3),
      emotionalJourney: 'Processing emotions through reflective writing',
      copingStrategies: ['journaling', 'self-expression'],
      growthIndicators: strengthIndicators,
      supportiveNote: 'Your commitment to self-reflection shows great emotional courage'
    },
    wisdomReflection: generateWisdomReflection(detectedEmotions, strengthIndicators),
    crisisAssessment: {
      isCrisis: false,
      confidenceLevel: 'low',
      reasoning: 'Local analysis for immediate support',
      suggestedResources: null
    },
    metadata: {
      analyzedAt: new Date(),
      userId,
      journalEntryId
    }
  };
}

// Helper functions for local analysis
function generateEmotionalRecognition(emotions: string[]): string {
  if (emotions.length === 0) {
    return "Thank you for sharing your thoughts with such openness and trust.";
  }
  
  const emotionPhrases = {
    grateful: "Your sense of gratitude shines through beautifully",
    anxious: "I notice the weight of worry you're carrying",
    sad: "Your sadness is felt and honored here",
    angry: "I hear the frustration in your words",
    happy: "Your joy is wonderful to witness", 
    peaceful: "There's a lovely sense of calm in your reflection",
    confused: "It's completely okay to feel uncertain",
    hopeful: "Your hope is a beautiful light"
  };
  
  const recognized = emotions.map(e => emotionPhrases[e] || `Your ${e} feelings are valid`);
  return recognized[0] + (recognized.length > 1 ? `, and I also sense ${recognized.slice(1).join(' and ')}.` : '.');
}

function generateStrengthResponse(strengths: string[]): string {
  if (strengths.length === 0) {
    return "Your willingness to reflect shows remarkable courage and self-awareness.";
  }
  
  const strengthPhrases = {
    perseverance: "your determination to keep trying despite challenges",
    'seeking connection': "your wisdom in reaching out for help and support",
    'self-awareness': "your deep insight into your own experience",
    'emotional intelligence': "your ability to recognize and name your feelings",
    'thoughtful reflection': "your commitment to meaningful self-examination"
  };
  
  const recognizedStrengths = strengths.map(s => strengthPhrases[s] || s);
  return `I see ${recognizedStrengths.join(' and ')} as profound strengths in your healing journey.`;
}

function generateInsight(text: string, emotions: string[], options: AnalysisOptions): string {
  if (options.isCheckin) {
    return "A brief check-in still matters. Let this be enough for tonight.";
  }

  const insights = [
    "Every feeling you experience is part of your unique human journey.",
    "Your emotional world is rich and complex, which shows the depth of your heart.",
    "Writing these thoughts takes courage - you're creating space for healing.",
    "Your feelings deserve to be witnessed and honored, just as they are.",
    "This moment of reflection is an act of profound self-care."
  ];
  
  // Choose insight based on dominant emotion
  if (emotions.includes('grateful')) {
    return withContext("Gratitude has a way of opening our hearts to even more beauty in life.", options);
  }
  if (emotions.includes('sad')) {
    return withContext("Sadness often comes when we care deeply - it shows the tenderness of your heart.", options);
  }
  if (emotions.includes('anxious')) {
    return withContext("Anxiety often arises when we're trying to protect what matters to us.", options);
  }
  
  return withContext(insights[Math.floor(Math.random() * insights.length)], options);
}

function withContext(base: string, options: AnalysisOptions): string {
  const extra: string[] = [];

  if (options.pathwayGuidance) {
    extra.push(`Pathway focus: ${options.reflectionFocus || 'current step'}.`);
  }

  if (options.continuityContext) {
    extra.push(options.continuityContext);
  }

  if (!extra.length) return base;
  return `${base}\n\n${extra.join(' ')}`;
}

function generateNurturingSuggestion(emotions: string[]): string {
  if (emotions.includes('anxious') || emotions.includes('overwhelm')) {
    return "Take three slow, deep breaths. Place your hand on your heart and remind yourself: 'I am safe in this moment.'";
  }
  if (emotions.includes('sad')) {
    return "Wrap yourself in something soft and warm. Your feelings deserve gentle care and patience.";
  }
  if (emotions.includes('angry')) {
    return "Your anger is valid. Take a moment to move your body - stretch, walk, or shake out the tension.";
  }
  if (emotions.includes('grateful')) {
    return "Let this gratitude settle into your heart. Notice how appreciation can be its own form of healing.";
  }
  
  return "Be gentle with yourself today. You're exactly where you need to be in this moment.";
}

function generateWisdomReflection(emotions: string[], strengths: string[]): string {
  const reflections = [
    "In this moment of honest reflection, you demonstrate the profound wisdom that comes from turning toward your inner world with curiosity and care.",
    "Your willingness to explore your feelings through writing shows a deep understanding of the healing power of expression and self-awareness.",
    "There is something sacred about this pause you've taken to check in with yourself - it speaks to your innate wisdom about what your soul needs.",
    "Through this practice of journaling, you're creating a conversation with the deepest parts of yourself, which is one of the most healing things we can do."
  ];
  
  return reflections[Math.floor(Math.random() * reflections.length)];
}

// Create fallback analysis when AI fails
function createFallbackAnalysis(userId: string, journalEntryId: string, error?: any): JournalAnalysis {
  const isApiError = error?.message?.includes('API') || error?.message?.includes('network') || error?.message?.includes('fetch');
  
  return {
    id: `fallback_${Date.now()}`,
    analysis: {
      emotionalRecognition: "Thank you for sharing your thoughts and feelings with such honesty and courage.",
      strengthIdentification: "Writing in your journal shows incredible strength and commitment to your healing journey.",
      gentleInsight: "Your willingness to reflect deeply demonstrates remarkable self-awareness and growth.",
      nurturingSuggestion: "Take a moment to acknowledge yourself for this beautiful act of self-care and expression."
    },
    emotionalThemes: {
      primaryEmotions: ['reflective', 'brave'],
      emotionalJourney: 'Taking time for meaningful self-reflection',
      copingStrategies: ['journaling', 'emotional expression'],
      growthIndicators: ['self-awareness', 'emotional courage'],
      supportiveNote: 'You are creating a sacred space for your feelings and experiences'
    },
    wisdomReflection: "In sharing your thoughts through journaling, you demonstrate deep wisdom about the healing power of expression. Your commitment to this practice shows remarkable insight into your own growth journey.",
    crisisAssessment: {
      isCrisis: false,
      confidenceLevel: 'low',
      reasoning: isApiError ? 'AI analysis temporarily unavailable' : 'Analysis service initializing',
      suggestedResources: null
    },
    metadata: {
      analyzedAt: new Date(),
      userId,
      journalEntryId
    }
  };
}
