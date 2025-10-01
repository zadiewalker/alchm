/**
 * Japanese Localization Framework for ALCHM
 * Culturally adaptive mental health support with deep Japanese context
 */

export interface JapaneseLocaleConfig {
  formalityLevel: 'casual' | 'polite' | 'respectful' | 'honorific';
  userAge: 'student' | 'young-adult' | 'adult' | 'senior';
  context: 'academic' | 'workplace' | 'family' | 'personal' | 'crisis';
  culturalFramework: 'individual' | 'collective' | 'family-centered';
}

export interface JapaneseTranslation {
  key: string;
  hiragana?: string;
  kanji?: string;
  romaji?: string;
  furigana?: string;
  context: string;
  formalityLevel: string;
  culturalNotes?: string;
}

export class JapaneseLocalization {
  private static formalityMappings = {
    'mental health': {
      casual: 'メンタルヘルス',
      polite: '心の健康',
      respectful: '精神的健康',
      honorific: '心身の健康管理'
    },
    'journal': {
      casual: '日記',
      polite: '心の記録',
      respectful: '内省記録',
      honorific: 'ご自身の記録'
    },
    'crisis support': {
      casual: 'サポート',
      polite: '心のサポート',
      respectful: '緊急時支援',
      honorific: '心の支援体制'
    },
    'emotional wellness': {
      casual: '気持ちの健康',
      polite: '心の調和',
      respectful: '感情的安定',
      honorific: '心身の調和'
    }
  };

  private static culturalConcepts = {
    ikigai: {
      definition: '生きがい - Life purpose and meaning',
      usage: 'Finding what makes life worth living',
      journalPrompt: 'あなたの生きがいについて考えてみましょう。何があなたを朝起きたくさせますか？'
    },
    wa: {
      definition: '和 - Harmony and peace',
      usage: 'Balance in relationships and self',
      journalPrompt: '心の和について。今日、どのように調和を感じましたか？'
    },
    ganbaru: {
      definition: '頑張る - Healthy perseverance',
      usage: 'Effort that serves growth, not burnout',
      journalPrompt: '健康的な頑張りについて。無理をしていませんか？'
    },
    omoiyari: {
      definition: '思いやり - Compassionate consideration',
      usage: 'Understanding others and self',
      journalPrompt: '思いやりの気持ち。自分にも優しくできていますか？'
    },
    kokoro: {
      definition: '心 - Heart/mind unity',
      usage: 'Holistic emotional-mental wellbeing',
      journalPrompt: '心の状態について。今の心はどんな色をしていますか？'
    }
  };

  /**
   * Get culturally appropriate translation based on context
   */
  static getTranslation(
    key: string, 
    config: JapaneseLocaleConfig
  ): string {
    const mapping = this.formalityMappings[key as keyof typeof this.formalityMappings];
    if (!mapping) return key;

    return mapping[config.formalityLevel] || mapping.polite;
  }

  /**
   * Generate context-aware Japanese content
   */
  static generateContextualContent(
    contentType: 'greeting' | 'encouragement' | 'crisis' | 'reflection',
    config: JapaneseLocaleConfig
  ): string {
    switch (contentType) {
      case 'greeting':
        return this.generateGreeting(config);
      case 'encouragement':
        return this.generateEncouragement(config);
      case 'crisis':
        return this.generateCrisisSupport(config);
      case 'reflection':
        return this.generateReflectionPrompt(config);
      default:
        return '';
    }
  }

  private static generateGreeting(config: JapaneseLocaleConfig): string {
    const timeGreeting = this.getTimeBasedGreeting();
    
    switch (config.formalityLevel) {
      case 'casual':
        return `${timeGreeting}！今日も心の記録をつけましょう。`;
      case 'polite':
        return `${timeGreeting}。今日の心の状態はいかがですか？`;
      case 'respectful':
        return `${timeGreeting}。本日も内省の時間をお取りいただき、ありがとうございます。`;
      case 'honorific':
        return `${timeGreeting}でございます。ご自身と向き合う大切な時間をお過ごしください。`;
      default:
        return `${timeGreeting}。今日の心の状態はいかがですか？`;
    }
  }

  private static generateEncouragement(config: JapaneseLocaleConfig): string {
    const encouragements = {
      casual: [
        '今日もよく頑張ったね。',
        '小さな一歩でも大切だよ。',
        '自分のペースでいいんだよ。'
      ],
      polite: [
        '今日もお疲れさまでした。',
        '小さな進歩も大切な成長です。',
        'ご自分のペースを大切にしてください。'
      ],
      respectful: [
        '本日もお疲れさまでございました。',
        '着実な歩みを続けていらっしゃいますね。',
        'ご自身のペースを尊重することが大切です。'
      ],
      honorific: [
        '本日も大変お疲れさまでございました。',
        '着実にご成長なさっていることを感じます。',
        'ご自身のお心と向き合う姿勢を尊敬いたします。'
      ]
    };

    const options = encouragements[config.formalityLevel];
    return options[Math.floor(Math.random() * options.length)];
  }

  private static generateCrisisSupport(config: JapaneseLocaleConfig): string {
    const crisisMessages = {
      casual: '今とても辛い気持ちだと思う。一人じゃないよ。話を聞いてくれる人がいるから。',
      polite: '今、とてもお辛い状況だと思います。お一人で抱え込まず、サポートを受けてください。',
      respectful: 'ご困難な状況にいらっしゃることと存じます。専門の支援を受けることをお勧めいたします。',
      honorific: '大変ご困難な状況にいらっしゃることと深くお察しいたします。ご専門の方々がお待ちしております。'
    };

    return crisisMessages[config.formalityLevel];
  }

  private static generateReflectionPrompt(config: JapaneseLocaleConfig): string {
    const prompts = {
      academic: [
        '今日の学びの中で、何か心に残ったことはありますか？',
        '勉強のプレッシャーの中で、自分らしさを保てていますか？',
        '仲間との関係で、今日感じたことは何ですか？'
      ],
      workplace: [
        '職場での人間関係で、今日感じたことは何ですか？',
        '仕事のストレスと上手に付き合えていますか？',
        '今日の仕事で、自分らしさを発揮できた瞬間はありますか？'
      ],
      family: [
        '家族との関係の中で、今日の気持ちはいかがですか？',
        '家族への思いやりと、自分への思いやりのバランスは？',
        '家庭での役割の中で、自分らしくいられていますか？'
      ],
      personal: [
        '今日の心の色は何色でしょうか？',
        '自分への思いやりを示せた瞬間はありましたか？',
        '今日、心の和を感じた瞬間はありますか？'
      ],
      crisis: [
        '今の気持ちを、無理に言葉にしなくても大丈夫です。',
        '呼吸に意識を向けて、今この瞬間にいることを感じてみましょう。',
        '一人じゃありません。支えてくれる人がいることを思い出してください。'
      ]
    };

    const contextPrompts = prompts[config.context] || prompts.personal;
    return contextPrompts[Math.floor(Math.random() * contextPrompts.length)];
  }

  private static getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour < 6) return 'お疲れさまです';
    if (hour < 10) return 'おはようございます';
    if (hour < 17) return 'こんにちは';
    if (hour < 22) return 'こんばんは';
    return 'お疲れさまです';
  }

  /**
   * Cultural concept integration
   */
  static getCulturalConcept(concept: keyof typeof JapaneseLocalization.culturalConcepts) {
    return this.culturalConcepts[concept];
  }

  /**
   * Generate Japanese-specific journal prompts
   */
  static getJournalPrompts(theme: string, config: JapaneseLocaleConfig): string[] {
    const prompts: Record<string, string[]> = {
      ikigai: [
        'あなたの生きがいについて考えてみましょう。何があなたを朝起きたくさせますか？',
        '今日、生きがいを感じた瞬間はありましたか？',
        'あなたの情熱と、世界が必要としていることの重なる部分は何ですか？'
      ],
      wa: [
        '今日、心の和を感じた瞬間はありますか？',
        '人間関係の中で、調和を大切にしながらも自分らしくいられていますか？',
        '内なる平和を感じるために、何が必要でしょうか？'
      ],
      ganbaru: [
        '今日の「頑張り」は健康的でしたか？',
        '努力と無理の違いを感じることができましたか？',
        '自分のペースを大切にしながら前進できていますか？'
      ],
      stress: [
        '今日感じたストレスは、どのような形で現れましたか？',
        'プレッシャーの中でも、自分らしさを保てていますか？',
        'ストレスを和らげるために、何か小さなことでもできることはありますか？'
      ],
      gratitude: [
        '今日、感謝の気持ちを感じた瞬間はありましたか？',
        '当たり前だと思っていることの中に、実は大切なものはありませんか？',
        '自分自身に対しても、感謝の気持ちを持てていますか？'
      ]
    };

    return prompts[theme] || prompts.wa;
  }

  /**
   * Adaptive formality based on relationship and context
   */
  static determineFormality(
    userAge: string,
    relationship: string,
    context: string
  ): JapaneseLocaleConfig['formalityLevel'] {
    // Student context - more casual but respectful
    if (userAge === 'student') {
      if (context === 'crisis') return 'polite';
      if (context === 'academic') return 'polite';
      return 'casual';
    }

    // Adult context - balance formality with approachability
    if (userAge === 'adult') {
      if (context === 'crisis') return 'respectful';
      if (context === 'workplace') return 'polite';
      return 'polite';
    }

    // Senior context - more respectful
    if (userAge === 'senior') {
      return 'respectful';
    }

    return 'polite'; // Default safe option
  }

  /**
   * Japanese-specific validation for mental health terms
   */
  static validateCulturalSensitivity(content: string): {
    isAppropriate: boolean;
    suggestions: string[];
    culturalNotes: string[];
  } {
    const inappropriate = ['精神病', '頭がおかしい', '気が狂う'];
    const suggestions: string[] = [];
    const culturalNotes: string[] = [];

    let isAppropriate = true;

    inappropriate.forEach(term => {
      if (content.includes(term)) {
        isAppropriate = false;
        suggestions.push(`「${term}」は避けて、より適切な表現を使用してください。`);
      }
    });

    // Positive cultural integration suggestions
    if (content.includes('目標')) {
      culturalNotes.push('生きがいの概念と関連付けることで、より深い意味を持たせることができます。');
    }

    if (content.includes('努力')) {
      culturalNotes.push('健康的な頑張りと無理の違いを意識した表現にすることをお勧めします。');
    }

    return { isAppropriate, suggestions, culturalNotes };
  }
}

export default JapaneseLocalization;