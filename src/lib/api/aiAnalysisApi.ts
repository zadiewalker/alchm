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

// Main AI Analysis function
export async function analyzeJournalEntry(
  journalEntry: string,
  userId: string,
  journalEntryId: string
): Promise<JournalAnalysis> {
  try {
    console.log('Requesting AI analysis...');
    
    const request: AnalysisRequest = {
      journalEntry,
      userId,
      journalEntryId
    };

    const response = await makeAuthenticatedRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Analysis failed');
    }

    console.log('AI analysis completed successfully');
    return data.analysis;

  } catch (error) {
    console.error('AI Analysis Error:', error);
    
    // Return supportive fallback analysis
    return createFallbackAnalysis(userId, journalEntryId, error);
  }
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