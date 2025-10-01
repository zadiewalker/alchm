/**
 * Japanese Khepera AI Personality
 * Culturally adaptive AI responses for Japanese mental health context
 */

import JapaneseLocalization, { JapaneseLocaleConfig } from '@/lib/i18n/japanese-localization';

export interface JapaneseKheperaConfig {
  communicationStyle: 'direct' | 'indirect' | 'very-indirect';
  emotionalIntensity: 'gentle' | 'moderate' | 'warm' | 'reserved';
  culturalFramework: 'individual' | 'collective' | 'harmony-focused';
  responseLength: 'brief' | 'moderate' | 'detailed';
  includesCulturalConcepts: boolean;
}

export class JapaneseKheperaPersonality {
  private static communicationPatterns = {
    direct: {
      prefix: '',
      suffix: '。',
      questionStyle: 'ですか？',
      suggestion: 'してみてください。'
    },
    indirect: {
      prefix: 'もしかすると',
      suffix: 'かもしれませんね。',
      questionStyle: 'でしょうか？',
      suggestion: 'してみてはいかがでしょうか。'
    },
    'very-indirect': {
      prefix: 'ひょっとして',
      suffix: 'のような気がいたします。',
      questionStyle: 'でしょうか？',
      suggestion: 'ということも考えられますが、いかがでしょうか。'
    }
  };

  private static culturalResponseTemplates = {
    validation: {
      individual: [
        'あなたの気持ちを大切にしてください。',
        'あなたらしさを尊重します。',
        'あなたの体験は価値があります。'
      ],
      collective: [
        'みんなそれぞれ違う体験をしていますね。',
        'あなたも大切な仲間の一人です。',
        '共に歩む道のりだと思います。'
      ],
      'harmony-focused': [
        '心の調和を大切にしましょう。',
        '内なる平和を感じていきましょう。',
        '心の和を保つことを大切にしてください。'
      ]
    },
    encouragement: {
      individual: [
        'あなたなりのペースで進んでいきましょう。',
        '小さな一歩も大切な成長です。',
        'あなたの強さを信じています。'
      ],
      collective: [
        'みんなで支え合いながら進んでいきましょう。',
        '一人ではありません。仲間がいます。',
        '共に成長していく道のりですね。'
      ],
      'harmony-focused': [
        '心の調和を保ちながら前進していきましょう。',
        '和を大切にしながら、自分らしさも育てていきましょう。',
        '内なる平和を感じながら歩んでいってください。'
      ]
    },
    reflection: {
      individual: [
        'あなた自身との対話を大切にしてください。',
        '内なる声に耳を傾けてみましょう。',
        'あなたの気持ちをゆっくり味わってみてください。'
      ],
      collective: [
        '他の人の体験と比較する必要はありません。',
        'あなたの体験も、誰かの支えになるかもしれません。',
        'みんなそれぞれの学びがありますね。'
      ],
      'harmony-focused': [
        '心の中の様々な声に、優しく耳を傾けてみましょう。',
        '内なる対立も、調和への道筋かもしれません。',
        '心の奥深くにある平和を感じてみてください。'
      ]
    }
  };

  /**
   * Generate culturally appropriate response based on user input
   */
  static generateResponse(
    userInput: string,
    emotion: string,
    config: JapaneseKheperaConfig,
    localeConfig: JapaneseLocaleConfig
  ): string {
    const responseType = this.determineResponseType(userInput, emotion);
    const culturalResponse = this.getCulturalResponse(responseType, config);
    const styledResponse = this.applyJapaneseCommunicationStyle(culturalResponse, config, localeConfig);
    
    if (config.includesCulturalConcepts) {
      return this.integrateCulturalConcepts(styledResponse, emotion, config);
    }
    
    return styledResponse;
  }

  private static determineResponseType(userInput: string, emotion: string): 'validation' | 'encouragement' | 'reflection' | 'crisis' {
    // Crisis keywords detection
    const crisisKeywords = ['死にたい', '消えたい', '終わりたい', '限界', '辛すぎる', '助けて'];
    if (crisisKeywords.some(keyword => userInput.includes(keyword))) {
      return 'crisis';
    }

    // Emotional state analysis
    const negativeEmotions = ['悲しい', '不安', '怒り', '絶望', '孤独'];
    const reflectiveEmotions = ['混乱', '考えている', '迷い', '疑問'];
    
    if (negativeEmotions.some(emotion_word => emotion.includes(emotion_word))) {
      return 'validation';
    }
    
    if (reflectiveEmotions.some(emotion_word => emotion.includes(emotion_word))) {
      return 'reflection';
    }
    
    return 'encouragement';
  }

  private static getCulturalResponse(
    responseType: keyof typeof JapaneseKheperaPersonality.culturalResponseTemplates,
    config: JapaneseKheperaConfig
  ): string {
    if (responseType === 'crisis') {
      return this.generateCrisisResponse(config);
    }

    const responses = this.culturalResponseTemplates[responseType][config.culturalFramework];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private static generateCrisisResponse(config: JapaneseKheperaConfig): string {
    const crisisResponses = {
      gentle: [
        '今とても辛い状況にいらっしゃるのですね。あなたは一人ではありません。',
        '大変お辛い気持ちをお察しします。専門の方にお話を聞いてもらいませんか？',
        '今の苦しさを一人で抱える必要はありません。サポートを受けることをお勧めします。'
      ],
      moderate: [
        '深刻な状況にいらっしゃることが伝わってきます。今すぐ専門家のサポートを受けてください。',
        'あなたの命は大切です。今すぐ相談できる方がいます。電話をかけてみてください。',
        '一人で抱え込まず、今すぐ誰かに助けを求めてください。'
      ],
      reserved: [
        'ご状況をお察しいたします。適切な支援を受けられることをお勧めいたします。',
        '専門的なサポートをお受けになることが最も良いかと存じます。',
        'しかるべき機関にご相談されることをお勧めいたします。'
      ]
    };

    return crisisResponses[config.emotionalIntensity][0];
  }

  private static applyJapaneseCommunicationStyle(
    response: string,
    config: JapaneseKheperaConfig,
    localeConfig: JapaneseLocaleConfig
  ): string {
    const pattern = this.communicationPatterns[config.communicationStyle];
    
    // Apply formality based on locale config
    const formalityAdjustment = this.adjustForFormality(response, localeConfig.formalityLevel);
    
    // Apply communication style
    if (config.communicationStyle === 'indirect' || config.communicationStyle === 'very-indirect') {
      return `${pattern.prefix}${formalityAdjustment}${pattern.suffix}`;
    }
    
    return `${formalityAdjustment}${pattern.suffix}`;
  }

  private static adjustForFormality(response: string, formality: JapaneseLocaleConfig['formalityLevel']): string {
    const formalityMappings = {
      casual: response.replace(/です/g, 'だよ').replace(/ます/g, 'る'),
      polite: response, // Default
      respectful: response.replace(/してください/g, 'していただけませんか'),
      honorific: response.replace(/あなた/g, 'あなた様').replace(/してください/g, 'お願いいたします')
    };

    return formalityMappings[formality] || response;
  }

  private static integrateCulturalConcepts(
    response: string,
    emotion: string,
    config: JapaneseKheperaConfig
  ): string {
    // Select appropriate cultural concept based on emotion and context
    if (emotion.includes('目標') || emotion.includes('目的')) {
      return `${response}\n\n生きがいについて考えてみると、新しい視点が見えてくるかもしれませんね。`;
    }
    
    if (emotion.includes('ストレス') || emotion.includes('頑張り')) {
      return `${response}\n\n健康的な頑張りと無理の違いを意識することも大切ですね。`;
    }
    
    if (emotion.includes('人間関係') || emotion.includes('関係')) {
      return `${response}\n\n和を大切にしながらも、あなたらしさを保つことができるといいですね。`;
    }
    
    if (emotion.includes('優しさ') || emotion.includes('思いやり')) {
      return `${response}\n\n他者への思いやりと同じように、ご自身への思いやりも大切にしてください。`;
    }
    
    return response;
  }

  /**
   * Generate culturally appropriate follow-up questions
   */
  static generateFollowUpQuestion(
    userInput: string,
    config: JapaneseKheperaConfig,
    localeConfig: JapaneseLocaleConfig
  ): string {
    const questionTemplates = {
      individual: [
        'あなたにとって一番大切なことは何でしょうか？',
        'この体験からどのような学びがありそうですか？',
        'あなたらしさを感じられる瞬間はどんな時ですか？'
      ],
      collective: [
        '周りの人との関係の中で、どのような気持ちになりますか？',
        'この体験を通して、人とのつながりについてどう感じますか？',
        '仲間の存在をどのように感じていますか？'
      ],
      'harmony-focused': [
        '心の調和を感じられる瞬間はありますか？',
        '内なる平和につながるものは何でしょうか？',
        'バランスを取るために大切なことは何だと思いますか？'
      ]
    };

    const questions = questionTemplates[config.culturalFramework];
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    return this.applyJapaneseCommunicationStyle(selectedQuestion, config, localeConfig);
  }

  /**
   * Generate Japanese-specific coping strategy suggestions
   */
  static generateCopingSuggestion(
    emotion: string,
    config: JapaneseKheperaConfig
  ): string {
    const suggestions = {
      stress: [
        '深呼吸を3回してみませんか？吸って、吐いて、心を落ち着けましょう。',
        '散歩に出かけて、自然の中で心をリフレッシュしてみてはいかがでしょうか。',
        '温かいお茶を飲みながら、ゆっくりした時間を過ごしてみてください。'
      ],
      sadness: [
        '悲しい気持ちも大切な感情です。無理に抑える必要はありません。',
        '信頼できる人に話を聞いてもらうことで、心が軽くなるかもしれません。',
        '日記に気持ちを書いてみると、整理がつくかもしれませんね。'
      ],
      anxiety: [
        '今この瞬間に意識を向けて、足裏の感覚を感じてみてください。',
        '不安な気持ちを受け入れながら、深くゆっくりと呼吸してみましょう。',
        '5つの感覚を使って周りのものを観察してみてください。'
      ],
      anger: [
        '怒りの奥にある本当の気持ちに気づいてみませんか？',
        '一度その場を離れて、クールダウンの時間を取ってみてください。',
        '体を動かすことで、エネルギーを発散させてみてはいかがでしょうか。'
      ]
    };

    const emotionKey = this.mapEmotionToKey(emotion);
    const emotionSuggestions = suggestions[emotionKey] || suggestions.stress;
    
    return emotionSuggestions[Math.floor(Math.random() * emotionSuggestions.length)];
  }

  private static mapEmotionToKey(emotion: string): keyof typeof JapaneseKheperaPersonality.generateCopingSuggestion.suggestions {
    if (emotion.includes('ストレス') || emotion.includes('圧倒')) return 'stress';
    if (emotion.includes('悲し') || emotion.includes('落ち込み')) return 'sadness';
    if (emotion.includes('不安') || emotion.includes('心配')) return 'anxiety';
    if (emotion.includes('怒り') || emotion.includes('いらいら')) return 'anger';
    return 'stress';
  }

  /**
   * Cultural sensitivity check for AI responses
   */
  static validateCulturalSensitivity(response: string): {
    isAppropriate: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for overly direct advice-giving
    if (response.includes('すべきです') || response.includes('しなければならない')) {
      issues.push('Too directive - Japanese culture prefers suggestions over commands');
      suggestions.push('Use "してみてはいかがでしょうか" instead of "すべきです"');
    }

    // Check for individual vs collective balance
    if (response.includes('あなただけ') || response.includes('自分だけ')) {
      issues.push('May be too individualistic for Japanese context');
      suggestions.push('Include acknowledgment of social context and relationships');
    }

    // Check for face-saving language
    if (response.includes('間違い') || response.includes('失敗')) {
      issues.push('Direct mention of mistakes may cause loss of face');
      suggestions.push('Reframe as learning opportunities or growth experiences');
    }

    return {
      isAppropriate: issues.length === 0,
      issues,
      suggestions
    };
  }
}

export default JapaneseKheperaPersonality;