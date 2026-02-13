import OpenAI from "openai";
import { 
  TRAUMA_INFORMED_ANALYSIS_PROMPT, 
  CRISIS_DETECTION_PROMPT,
  EMOTIONAL_THEMES_PROMPT,
  WISDOM_REFLECTION_PROMPT
} from "./prompts";
import { JournalAnalysis } from "./types";

// Initialize OpenAI client with environment variable
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE") {
      throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
    }
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

export async function analyzeJournalEntry(
  journalEntry: string,
  userId: string,
  journalEntryId: string
): Promise<JournalAnalysis> {
  try {
    console.log(`Starting AI analysis for user ${userId}, entry ${journalEntryId}`);
    const client = getOpenAIClient();

    // Single comprehensive AI call for faster response
    const comprehensivePrompt = `
JOURNAL ENTRY TO ANALYZE:
"${journalEntry}"

Please provide a comprehensive analysis with the following structure:

1. CRISIS ASSESSMENT:
${CRISIS_DETECTION_PROMPT.replace("{journalEntry}", "")}

2. TRAUMA-INFORMED ANALYSIS:
${TRAUMA_INFORMED_ANALYSIS_PROMPT.replace("{journalEntry}", "")}

3. EMOTIONAL THEMES:
${EMOTIONAL_THEMES_PROMPT.replace("{journalEntry}", "")}

4. WISDOM REFLECTION:
${WISDOM_REFLECTION_PROMPT.replace("{journalEntry}", "")}

Return your response in this exact JSON format:
{
  "crisisAssessment": {
    "isCrisis": boolean,
    "confidenceLevel": "low" | "medium" | "high",
    "reasoning": "explanation",
    "suggestedResources": ["resource1", "resource2"] or null
  },
  "analysis": {
    "emotionalRecognition": "recognition text",
    "strengthIdentification": "strength text", 
    "gentleInsight": "insight text",
    "nurturingSuggestion": "suggestion text"
  },
  "emotionalThemes": {
    "primaryEmotions": ["emotion1", "emotion2"],
    "emotionalJourney": "journey description",
    "copingStrategies": ["strategy1"] or null,
    "growthIndicators": ["indicator1"] or null,
    "supportiveNote": "supportive message"
  },
  "wisdomReflection": "wisdom reflection text"
}`;

    const comprehensiveResponse = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Khepera, a trauma-informed AI companion. Provide supportive, healing-focused insights. Always respond with valid JSON."
        },
        {
          role: "user",
          content: comprehensivePrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Parse comprehensive response
    const responseText = comprehensiveResponse.choices[0]?.message?.content || "";
    console.log("Raw AI response:", responseText);
    
    // Try to parse as JSON first
    let parsedResponse: any = null;
    try {
      parsedResponse = parseJSONResponse(responseText, {});
    } catch (error) {
      console.warn("Failed to parse as JSON, falling back to text parsing");
      parsedResponse = {};
    }

    // Extract components with fallbacks
    const crisisAssessment = parsedResponse?.crisisAssessment || {
      isCrisis: false,
      confidenceLevel: "low" as const,
      reasoning: "Unable to assess",
      suggestedResources: null
    };

    const analysis = parsedResponse?.analysis || {
      emotionalRecognition: "Thank you for sharing your thoughts with such honesty.",
      strengthIdentification: "Your willingness to reflect shows deep self-awareness.",
      gentleInsight: "Every moment of honest self-reflection is a gift you give yourself.",
      nurturingSuggestion: "Take a gentle breath and acknowledge your courage in exploring your inner world."
    };

    const emotionalThemes = parsedResponse?.emotionalThemes || {
      primaryEmotions: ["reflective"],
      emotionalJourney: "Exploring feelings with courage",
      copingStrategies: null,
      growthIndicators: null,
      supportiveNote: "You are brave for expressing your feelings"
    };

    const wisdomReflection = parsedResponse?.wisdomReflection || "In sharing your thoughts, you demonstrate deep wisdom about the healing power of expression.";

    const result: JournalAnalysis = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      analysis,
      emotionalThemes,
      wisdomReflection,
      crisisAssessment,
      metadata: {
        analyzedAt: new Date(),
        userId,
        journalEntryId
      }
    };

    console.log(`AI analysis completed for user ${userId}`);
    
    // Log crisis detection if flagged
    if (crisisAssessment.isCrisis) {
      console.warn(`CRISIS DETECTED for user ${userId}: ${crisisAssessment.reasoning}`);
    }

    return result;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    
    // Return supportive fallback analysis if AI fails
    return createFallbackAnalysis(userId, journalEntryId);
  }
}

function parseJSONResponse<T>(jsonText: string, fallback: T): T {
  try {
    // Extract JSON from response if it's wrapped in text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return fallback;
  } catch {
    return fallback;
  }
}



function createFallbackAnalysis(userId: string, journalEntryId: string): JournalAnalysis {
  return {
    id: `fallback_${Date.now()}`,
    analysis: {
      emotionalRecognition: "Thank you for sharing your thoughts and feelings with such honesty.",
      strengthIdentification: "It takes courage to explore your inner world through journaling.",
      gentleInsight: "Your willingness to reflect shows a commitment to your own growth and healing.",
      nurturingSuggestion: "Take a moment to acknowledge yourself for this act of self-care and expression."
    },
    emotionalThemes: {
      primaryEmotions: ["reflective", "brave"],
      emotionalJourney: "Taking time for self-reflection",
      copingStrategies: ["journaling"],
      growthIndicators: ["self-awareness", "emotional expression"],
      supportiveNote: "You are creating a safe space for your feelings"
    },
    wisdomReflection: "In sharing your thoughts, you demonstrate a deep understanding that healing happens when we give voice to our experiences. Your commitment to this practice is a testament to your inner wisdom.",
    crisisAssessment: {
      isCrisis: false,
      confidenceLevel: "low",
      reasoning: "Analysis temporarily unavailable",
      suggestedResources: null
    },
    metadata: {
      analyzedAt: new Date(),
      userId,
      journalEntryId
    }
  };
}