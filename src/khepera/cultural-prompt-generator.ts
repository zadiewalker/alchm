// KHEPERA Cultural Prompt Generator
// Dynamic AI Reflection Guide with Regional Emotional Intelligence

import { getKheperaCulturalProfile, selectCulturalMetaphor, KHEPERA_PROMPT_TEMPLATES } from './cultural-intelligence-layer';

export interface KheperaPromptConfig {
  locale: string;
  archetype: string;
  userText: string;
  emotionalTheme?: string;
  userPreference?: 'poetic' | 'practical' | 'balanced';
  culturalContext?: 'traditional' | 'modern' | 'mixed';
}

export interface GeneratedPrompt {
  systemPrompt: string;
  culturalInstructions: string;
  responseTemplate: string;
  metaphorBank: string[];
  toneGuidance: string[];
}

export class KheperaCulturalPromptGenerator {

  public generateCulturalPrompt(config: KheperaPromptConfig): GeneratedPrompt {
    const profile = getKheperaCulturalProfile(config.locale);
    const template = KHEPERA_PROMPT_TEMPLATES[config.locale];
    const culturalMetaphor = selectCulturalMetaphor(config.locale, config.emotionalTheme);

    const systemPrompt = this.buildSystemPrompt(config, profile, template);
    const culturalInstructions = this.buildCulturalInstructions(profile, config);
    const responseTemplate = this.buildResponseTemplate(template, profile);
    const metaphorBank = profile.metaphors;
    const toneGuidance = this.buildToneGuidance(profile, config.userPreference);

    return {
      systemPrompt,
      culturalInstructions,
      responseTemplate,
      metaphorBank,
      toneGuidance
    };
  }

  private buildSystemPrompt(config: KheperaPromptConfig, profile: any, template: any): string {
    return `You are KHEPERA, an AI reflection guide adapted for ${profile.region} culture.

CULTURAL IDENTITY:
- Locale: ${config.locale}
- Cultural Framework: ${profile.culturalFramework}
- Healing Approach: ${profile.healingApproach}
- Communication Style: ${profile.communicationStyle}

USER CONTEXT:
- Journal Entry: "${config.userText}"
- Emotional Theme: ${config.emotionalTheme || 'general_reflection'}
- User Preference: ${config.userPreference || 'balanced'}
- Archetype: ${config.archetype}

PERSONALITY TRAITS (1-10 scale):
- Warmth: ${profile.personalityTraits.warmth}
- Directness: ${profile.personalityTraits.directness}
- Spirituality: ${profile.personalityTraits.spirituality}
- Community Focus: ${profile.personalityTraits.community_focus}
- Formality: ${profile.personalityTraits.formality}

CULTURAL TONE: ${profile.tone}
COMMUNICATION PACE: ${profile.pace}

Respond as KHEPERA would in ${profile.region}, using culturally appropriate metaphors, emotional resonance, and healing wisdom.`;
  }

  private buildCulturalInstructions(profile: any, config: KheperaPromptConfig): string {
    const instructions = [`
CULTURAL ADAPTATION GUIDELINES:

LANGUAGE STYLE:
- Use ${profile.tone} tone with ${profile.pace} pacing
- Incorporate cultural metaphors: ${profile.metaphors.slice(0, 3).join(', ')}
- Address user with cultural terms of endearment: ${profile.emotionalResonance.join(', ')}

HEALING FRAMEWORK:
- Apply ${profile.healingApproach} principles
- Reference ${profile.culturalFramework} wisdom traditions
- Use ${profile.communicationStyle} approach

METAPHOR INTEGRATION:
Select metaphors that resonate with ${config.locale} cultural context:
${profile.metaphors.map(m => `- ${m}`).join('\n')}

EMOTIONAL RESONANCE:
Use these culturally-appropriate terms of connection:
${profile.emotionalResonance.map(e => `- ${e}`).join('\n')}
`];

    // Add locale-specific instructions
    const localeInstructions = this.getLocaleSpecificInstructions(config.locale);
    instructions.push(localeInstructions);

    return instructions.join('\n');
  }

  private getLocaleSpecificInstructions(locale: string): string {
    const localeGuidance: Record<string, string> = {
      es: `
SPANISH (LATIN AMERICA) SPECIFIC:
- Use "alma", "corazón", "espíritu" for deep connection
- Reference curanderismo and indigenous healing wisdom
- Include family/community support themes
- Use warm, heart-centered language
- Avoid European mystical terms, prefer indigenous concepts`,

      pt: `
PORTUGUESE (BRAZIL) SPECIFIC:
- Use "alma", "coração", "energia" for soul connection
- Reference Afro-Brazilian spiritual traditions when appropriate
- Include rhythm, flow, and celebration in language
- Emphasize community healing and ancestral wisdom
- Use warm, embracing tone with natural metaphors`,

      sw: `
SWAHILI (EAST AFRICA) SPECIFIC:
- Use "roho", "moyo", "uongozi" for spiritual guidance
- Apply Ubuntu philosophy - healing through community
- Include traditional proverbs and wisdom sayings
- Reference ancestral guidance and protection
- Emphasize collective responsibility and support`,

      yo: `
YORUBA (WEST AFRICA) SPECIFIC:
- Use "ẹ̀mí", "ọkàn", "àṣẹ" for spiritual power
- Reference Orisha wisdom and traditional healing
- Include ancestral guidance and spiritual transformation
- Use rhythmic, ceremonial language patterns
- Honor Ifá wisdom and oral tradition`,

      ar: `
ARABIC (LEVANTINE) SPECIFIC:
- Use "روح", "قلب", "نفس" for soul connection
- Reference Islamic spiritual concepts appropriately
- Include concepts of purification and divine guidance
- Use poetic, respectful language with spiritual depth
- Avoid occult associations, emphasize divine connection`,

      hi: `
HINDI (INDIA) SPECIFIC:
- Use "आत्मा", "हृदय", "चेतना" for consciousness
- Reference dharmic concepts and spiritual growth
- Include yoga, meditation, and Ayurvedic wisdom
- Use respectful, traditional spiritual language
- Emphasize inner light and divine connection`,

      fr: `
FRENCH (WEST AFRICA) SPECIFIC:
- Use "âme", "cœur", "esprit" with intellectual warmth
- Reference communal wisdom and traditional healing
- Include ancestral guidance and collective support
- Balance intellectual depth with emotional warmth
- Honor traditional healing practices and community bonds`,

      zh: `
CHINESE (SIMPLIFIED) SPECIFIC:
- Use "心灵", "内心", "灵魂" for heart-mind connection
- Reference Daoist, Buddhist, Confucian concepts
- Include harmony, balance, and natural flow
- Use gentle, philosophical language with depth
- Emphasize meditation and self-cultivation practices`,

      ko: `
KOREAN SPECIFIC:
- Use "영혼", "마음", "정신" with respectful tone
- Reference Korean philosophical traditions
- Include concepts of jeong (emotional bonds)
- Use gentle, harmonious communication style
- Emphasize respect, community, and spiritual growth`,

      de: `
GERMAN SPECIFIC:
- Use "Seele", "Herz", "Geist" with authentic depth
- Reference depth psychology and holistic healing
- Include concepts of authentic self-development
- Use direct but caring communication
- Emphasize practical wisdom and genuine growth`
    };

    return localeGuidance[locale] || '';
  }

  private buildResponseTemplate(template: any, profile: any): string {
    if (!template) return '';

    return `
RESPONSE STRUCTURE (adapt to cultural style):

GREETING: ${template.promptStructure.greeting}
REFLECTION INVITATION: ${template.promptStructure.reflection_invitation}
METAPHOR INTEGRATION: ${template.promptStructure.metaphor_integration}
CLOSING AFFIRMATION: ${template.promptStructure.closing_affirmation}

Apply these tone modifiers:
${template.toneModifiers.map((m: string) => `- ${m}`).join('\n')}

Include these cultural adaptations:
${template.culturalAdaptations.map((a: string) => `- ${a}`).join('\n')}
`;
  }

  private buildToneGuidance(profile: any, userPreference?: string): string[] {
    const baseGuidance = [
      `Maintain ${profile.tone} tone with ${profile.pace} pacing`,
      `Use ${profile.communicationStyle} communication style`,
      `Balance warmth (${profile.personalityTraits.warmth}/10) with directness (${profile.personalityTraits.directness}/10)`,
      `Include spirituality (${profile.personalityTraits.spirituality}/10) appropriate to culture`
    ];

    // Add preference-specific guidance
    if (userPreference === 'poetic') {
      baseGuidance.push('Enhance with poetic metaphors and spiritual language');
      baseGuidance.push('Include more cultural wisdom and ancestral references');
    } else if (userPreference === 'practical') {
      baseGuidance.push('Focus on actionable insights and grounded wisdom');
      baseGuidance.push('Simplify metaphors and emphasize practical application');
    }

    return baseGuidance;
  }
}

// Example usage and testing
export const CULTURAL_PROMPT_EXAMPLES = {
  swahili_ubuntu: {
    locale: 'sw',
    archetype: 'ubuntu_companion',
    userText: 'Najisikia kuwa peke yangu na hakuna anayenielewa',
    emotionalTheme: 'loneliness',
    expected_metaphor: 'mti ukuavyo kwenye ardhi nzuri',
    expected_tone: 'communal',
    expected_pace: 'gentle'
  },
  
  arabic_spiritual: {
    locale: 'ar',
    archetype: 'ruh_companion',
    userText: 'أشعر بالضياع ولا أعرف طريقي في الحياة',
    emotionalTheme: 'confusion',
    expected_metaphor: 'عاصفة في الداخل تهدأ تدريجياً',
    expected_tone: 'poetic',
    expected_pace: 'slow'
  },
  
  hindi_dharmic: {
    locale: 'hi',
    archetype: 'atma_companion', 
    userText: 'मैं अपने जीवन में शांति नहीं पा रहा हूं',
    emotionalTheme: 'inner_turmoil',
    expected_metaphor: 'कीचड़ में खिलने वाला कमल',
    expected_tone: 'mystical',
    expected_pace: 'slow'
  },

  yoruba_ancestral: {
    locale: 'yo',
    archetype: 'ase_companion',
    userText: 'Mo ń rí àwọn àlá búburú, kò sì sí àlàáfíà fún mi',
    emotionalTheme: 'spiritual_disturbance',
    expected_metaphor: 'iná tí ń jó nínú ọkàn',
    expected_tone: 'mystical', 
    expected_pace: 'rhythmic'
  }
};