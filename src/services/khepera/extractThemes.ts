import type { ThemeTag, EmotionalTone } from '@/types/journal';
import { createModelText } from './generateResponse';

const VALID_THEMES: ThemeTag[] = [
  'grief_loss',
  'relationship_tension',
  'self_worth',
  'identity',
  'work_purpose',
  'fear_uncertainty',
  'anger_injustice',
  'body_health',
  'creativity_expression',
  'spirituality_meaning',
  'rest_recovery',
  'joy_gratitude',
  'transition_change',
  'boundary_setting',
  'childhood_origin',
];

const VALID_TONES: EmotionalTone[] = [
  'processing',
  'grief',
  'anger',
  'anxiety',
  'clarity',
  'numbness',
  'tenderness',
  'ambivalence',
];

function isThemeTag(value: unknown): value is ThemeTag {
  return typeof value === 'string' && VALID_THEMES.some((theme) => theme === value);
}

function isEmotionalTone(value: unknown): value is EmotionalTone {
  return typeof value === 'string' && VALID_TONES.some((tone) => tone === value);
}

export async function extractThemesFromEntry(
  entryText: string,
  kheperaResponse: string
): Promise<{ themes: ThemeTag[]; tone: EmotionalTone }> {
  
  try {
    const systemPrompt = `You are a clinical theme extraction system. Analyze journal entries and responses to identify:

1. PRIMARY THEMES (0-3 themes max):
${VALID_THEMES.map(t => `- ${t}`).join('\n')}

2. EMOTIONAL TONE (exactly one):
${VALID_TONES.map(t => `- ${t}`).join('\n')}

Extract themes based on CONTENT, not just keywords. Look for underlying patterns, not surface mentions.

TONE GUIDELINES:
- processing: working through something, exploring, in motion
- grief: loss, mourning, sadness, missing something
- anger: frustration, injustice, boundaries violated
- anxiety: worry, fear, overwhelm, uncertainty
- clarity: understanding, insight, resolution
- numbness: disconnection, emptiness, shut down
- tenderness: compassion, softness, vulnerability
- ambivalence: mixed feelings, contradictions, uncertainty

Return JSON only: {"themes": ["theme1", "theme2"], "tone": "tone"}`;

    const response = await createModelText({
      inputTextForSafety: entryText,
      model: process.env.AI_PROVIDER === 'openai'
        ? process.env.OPENAI_KHEPERA_MODEL || 'gpt-4.1-mini'
        : 'claude-3-5-haiku-20241022',
      maxTokens: 200,
      temperature: 0.3,
      responseFormat: 'text',
      system: systemPrompt,
      prompt: `ENTRY:\n${entryText}\n\nRESPONSE:\n${kheperaResponse}\n\nExtract themes and tone:`,
    });

    if (response.blockedByCrisis) {
      return {
        themes: [],
        tone: 'processing',
      };
    }

    const parsed: unknown = JSON.parse(response.text);
    const result = typeof parsed === 'object' && parsed !== null ? parsed : {};
    
    // Validate and filter themes
    const themes = 'themes' in result && Array.isArray(result.themes)
      ? result.themes.filter(isThemeTag).slice(0, 3)
      : [];
    
    // Validate tone
    const tone = 'tone' in result && isEmotionalTone(result.tone) ? result.tone : 'processing';

    return { themes, tone };

  } catch (error) {
    console.error('Theme extraction failed:', error);
    
    // Return safe defaults
    return {
      themes: [],
      tone: 'processing'
    };
  }
}
