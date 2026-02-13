"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeJournalEntry = analyzeJournalEntry;
const openai_1 = __importDefault(require("openai"));
const prompts_1 = require("./prompts");
// Initialize OpenAI client with environment variable
let openai = null;
function getOpenAIClient() {
    if (!openai) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE") {
            throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
        }
        openai = new openai_1.default({
            apiKey: apiKey,
        });
    }
    return openai;
}
async function analyzeJournalEntry(journalEntry, userId, journalEntryId) {
    var _a, _b;
    try {
        console.log(`Starting AI analysis for user ${userId}, entry ${journalEntryId}`);
        const client = getOpenAIClient();
        // Single comprehensive AI call for faster response
        const comprehensivePrompt = `
JOURNAL ENTRY TO ANALYZE:
"${journalEntry}"

Please provide a comprehensive analysis with the following structure:

1. CRISIS ASSESSMENT:
${prompts_1.CRISIS_DETECTION_PROMPT.replace("{journalEntry}", "")}

2. TRAUMA-INFORMED ANALYSIS:
${prompts_1.TRAUMA_INFORMED_ANALYSIS_PROMPT.replace("{journalEntry}", "")}

3. EMOTIONAL THEMES:
${prompts_1.EMOTIONAL_THEMES_PROMPT.replace("{journalEntry}", "")}

4. WISDOM REFLECTION:
${prompts_1.WISDOM_REFLECTION_PROMPT.replace("{journalEntry}", "")}

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
        const responseText = ((_b = (_a = comprehensiveResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        console.log("Raw AI response:", responseText);
        // Try to parse as JSON first
        let parsedResponse = null;
        try {
            parsedResponse = parseJSONResponse(responseText, {});
        }
        catch (error) {
            console.warn("Failed to parse as JSON, falling back to text parsing");
            parsedResponse = {};
        }
        // Extract components with fallbacks
        const crisisAssessment = (parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.crisisAssessment) || {
            isCrisis: false,
            confidenceLevel: "low",
            reasoning: "Unable to assess",
            suggestedResources: null
        };
        const analysis = (parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.analysis) || {
            emotionalRecognition: "Thank you for sharing your thoughts with such honesty.",
            strengthIdentification: "Your willingness to reflect shows deep self-awareness.",
            gentleInsight: "Every moment of honest self-reflection is a gift you give yourself.",
            nurturingSuggestion: "Take a gentle breath and acknowledge your courage in exploring your inner world."
        };
        const emotionalThemes = (parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.emotionalThemes) || {
            primaryEmotions: ["reflective"],
            emotionalJourney: "Exploring feelings with courage",
            copingStrategies: null,
            growthIndicators: null,
            supportiveNote: "You are brave for expressing your feelings"
        };
        const wisdomReflection = (parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.wisdomReflection) || "In sharing your thoughts, you demonstrate deep wisdom about the healing power of expression.";
        const result = {
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
    }
    catch (error) {
        console.error("AI Analysis Error:", error);
        // Return supportive fallback analysis if AI fails
        return createFallbackAnalysis(userId, journalEntryId);
    }
}
function parseJSONResponse(jsonText, fallback) {
    try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return fallback;
    }
    catch (_a) {
        return fallback;
    }
}
function extractSection(text, keyword, fallback) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(keyword)) {
            // Return the next line or the line after a colon
            const nextLine = lines[i + 1] || lines[i].split(":")[1];
            if (nextLine && nextLine.trim()) {
                return nextLine.trim();
            }
        }
    }
    return fallback;
}
function createFallbackAnalysis(userId, journalEntryId) {
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
//# sourceMappingURL=aiService.js.map