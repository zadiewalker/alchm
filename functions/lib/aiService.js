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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        console.log(`Starting AI analysis for user ${userId}, entry ${journalEntryId}`);
        const client = getOpenAIClient();
        // Run analysis calls in parallel for efficiency
        const [traumaInformedResponse, crisisDetectionResponse, emotionalThemesResponse, wisdomReflectionResponse] = await Promise.all([
            // Main trauma-informed analysis
            client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are Khepera, a trauma-informed AI companion. Provide supportive, healing-focused insights."
                    },
                    {
                        role: "user",
                        content: prompts_1.TRAUMA_INFORMED_ANALYSIS_PROMPT.replace("{journalEntry}", journalEntry)
                    }
                ],
                max_tokens: 800,
                temperature: 0.7,
            }),
            // Crisis detection (separate call for safety)
            client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a crisis detection system. Be conservative - only flag clear immediate dangers."
                    },
                    {
                        role: "user",
                        content: prompts_1.CRISIS_DETECTION_PROMPT.replace("{journalEntry}", journalEntry)
                    }
                ],
                max_tokens: 200,
                temperature: 0.1, // Lower temperature for consistent crisis detection
            }),
            // Emotional themes analysis
            client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "Analyze emotional themes with compassion and insight."
                    },
                    {
                        role: "user",
                        content: prompts_1.EMOTIONAL_THEMES_PROMPT.replace("{journalEntry}", journalEntry)
                    }
                ],
                max_tokens: 400,
                temperature: 0.6,
            }),
            // Wisdom reflection
            client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "Reflect the user's wisdom back to them with warmth and affirmation."
                    },
                    {
                        role: "user",
                        content: prompts_1.WISDOM_REFLECTION_PROMPT.replace("{journalEntry}", journalEntry)
                    }
                ],
                max_tokens: 300,
                temperature: 0.8,
            })
        ]);
        // Parse responses
        const mainAnalysisText = ((_b = (_a = traumaInformedResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        const crisisText = ((_d = (_c = crisisDetectionResponse.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || "";
        const emotionalThemesText = ((_f = (_e = emotionalThemesResponse.choices[0]) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.content) || "";
        const wisdomText = ((_h = (_g = wisdomReflectionResponse.choices[0]) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.content) || "";
        // Parse structured responses
        const crisisAssessment = parseJSONResponse(crisisText, {
            isCrisis: false,
            confidenceLevel: "low",
            reasoning: "Unable to assess",
            suggestedResources: null
        });
        const emotionalThemes = parseJSONResponse(emotionalThemesText, {
            primaryEmotions: ["processing"],
            emotionalJourney: "Exploring feelings with courage",
            copingStrategies: null,
            growthIndicators: null,
            supportiveNote: "You are brave for expressing your feelings"
        });
        // Parse main analysis into structured format
        const analysis = parseTraumaInformedAnalysis(mainAnalysisText);
        const result = {
            id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            analysis,
            emotionalThemes,
            wisdomReflection: wisdomText,
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
function parseTraumaInformedAnalysis(analysisText) {
    // Simple parsing of the structured analysis
    // In production, you might want more sophisticated parsing
    return {
        emotionalRecognition: extractSection(analysisText, "emotional recognition", "I see you are experiencing many feelings right now."),
        strengthIdentification: extractSection(analysisText, "strength", "You showed courage by expressing yourself."),
        gentleInsight: extractSection(analysisText, "insight", "This reflection shows your growing self-awareness."),
        nurturingSuggestion: extractSection(analysisText, "suggestion", "Consider taking a moment to breathe and offer yourself compassion.")
    };
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