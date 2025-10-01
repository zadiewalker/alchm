/**
 * Japanese Crisis Resources and Intervention System
 * Culturally appropriate crisis support for Japanese users
 */

export interface JapaneseCrisisResource {
  id: string;
  name: string;
  nameKanji?: string;
  nameHiragana?: string;
  description: string;
  phone?: string;
  website?: string;
  email?: string;
  chatUrl?: string;
  availability: string;
  languages: string[];
  specialties: string[];
  region?: 'national' | 'tokyo' | 'osaka' | 'kyoto' | 'fukuoka' | 'sendai' | 'sapporo';
  culturalContext: 'general' | 'youth' | 'lgbt' | 'international' | 'workplace' | 'academic';
  formalityLevel: 'casual' | 'polite' | 'formal';
}

export const JAPANESE_CRISIS_RESOURCES: JapaneseCrisisResource[] = [
  // National Resources
  {
    id: 'inochi-no-denwa',
    name: 'いのちの電話',
    nameKanji: '生命の電話',
    nameHiragana: 'いのちのでんわ',
    description: '24時間対応の自殺予防相談電話。訓練を受けたボランティアが対応します。',
    phone: '0570-783-556',
    website: 'https://www.inochinodenwa.org/',
    availability: '24時間365日',
    languages: ['日本語'],
    specialties: ['自殺予防', '心の健康', '人生相談'],
    region: 'national',
    culturalContext: 'general',
    formalityLevel: 'polite'
  },
  {
    id: 'kokoro-kenko',
    name: 'こころの健康相談統一ダイヤル',
    nameKanji: '心の健康相談統一ダイヤル',
    nameHiragana: 'こころのけんこうそうだんとういつダイヤル',
    description: '心の健康について相談できる統一ダイヤル。各都道府県の相談窓口につながります。',
    phone: '0570-064-556',
    website: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/kokoro/index.html',
    availability: '地域により異なります（多くは平日9:00-17:00）',
    languages: ['日本語'],
    specialties: ['心の健康', 'メンタルヘルス', '精神保健'],
    region: 'national',
    culturalContext: 'general',
    formalityLevel: 'formal'
  },
  {
    id: 'tell-lifeline',
    name: 'TELL Lifeline',
    description: '英語と日本語で対応する24時間電話相談。国際コミュニティ向けのメンタルヘルスサポート。',
    phone: '03-5774-0992',
    website: 'https://telljp.com/',
    email: 'lifeline@telljp.com',
    availability: '毎日 9:00-23:00',
    languages: ['英語', '日本語'],
    specialties: ['国際的メンタルヘルス', '文化適応', '外国人サポート'],
    region: 'national',
    culturalContext: 'international',
    formalityLevel: 'polite'
  },

  // Emergency Services
  {
    id: 'police-emergency',
    name: '警察（緊急通報）',
    nameKanji: '警察',
    nameHiragana: 'けいさつ',
    description: '生命に危険がある緊急事態の際の警察への通報',
    phone: '110',
    availability: '24時間365日',
    languages: ['日本語', '英語（通訳サービス）'],
    specialties: ['緊急事態', '生命の危険', '事件・事故'],
    region: 'national',
    culturalContext: 'general',
    formalityLevel: 'formal'
  },
  {
    id: 'ambulance-fire',
    name: '救急車・消防',
    nameKanji: '救急車・消防',
    nameHiragana: 'きゅうきゅうしゃ・しょうぼう',
    description: '医療緊急事態や火災の際の救急・消防への通報',
    phone: '119',
    availability: '24時間365日',
    languages: ['日本語', '英語（通訳サービス）'],
    specialties: ['医療緊急事態', '救急医療', '火災'],
    region: 'national',
    culturalContext: 'general',
    formalityLevel: 'formal'
  },

  // Youth-Specific Resources
  {
    id: 'child-line',
    name: 'チャイルドライン',
    nameHiragana: 'チャイルドライン',
    description: '18歳までの子どもが相談できる電話。子ども専用の相談窓口です。',
    phone: '0120-99-7777',
    website: 'https://childline.or.jp/',
    availability: '毎日 16:00-21:00',
    languages: ['日本語'],
    specialties: ['子ども・青少年', '学校問題', 'いじめ', '家族関係'],
    region: 'national',
    culturalContext: 'youth',
    formalityLevel: 'casual'
  },
  {
    id: 'young-telephone',
    name: 'ヤング・テレホン',
    nameHiragana: 'ヤング・テレホン',
    description: '青少年向けの相談電話。学校や友人関係の悩みなど',
    phone: '03-3580-4970',
    availability: '月-金 8:30-17:15',
    languages: ['日本語'],
    specialties: ['青少年', '学校問題', '友人関係', '進路相談'],
    region: 'national',
    culturalContext: 'youth',
    formalityLevel: 'polite'
  },

  // LGBT+ Resources
  {
    id: 'lgbt-hotline',
    name: 'LGBT電話相談',
    nameHiragana: 'LGBT でんわそうだん',
    description: 'LGBT+の方々のための専門相談電話',
    phone: '03-3383-5556',
    availability: '火・金 19:00-22:00',
    languages: ['日本語'],
    specialties: ['LGBT+', 'セクシュアリティ', 'ジェンダー', 'カミングアウト'],
    region: 'national',
    culturalContext: 'lgbt',
    formalityLevel: 'polite'
  },

  // Online and Chat Resources
  {
    id: 'yorisoi-chat',
    name: 'よりそいチャット',
    nameHiragana: 'よりそいチャット',
    description: 'SNS相談。LINEやTwitterで気軽に相談できます',
    website: 'https://yorisoi-chat.jp/',
    chatUrl: 'https://line.me/ti/p/@yorisoi-chat',
    availability: '毎日 17:00-22:30',
    languages: ['日本語'],
    specialties: ['SNS相談', '若者支援', 'オンライン相談'],
    region: 'national',
    culturalContext: 'youth',
    formalityLevel: 'casual'
  }
];

export class JapaneseCrisisSupport {
  /**
   * Get appropriate crisis resources based on user profile
   */
  static getResourcesForUser(
    age: number,
    region: string,
    language: 'japanese' | 'english' | 'both',
    culturalContext: 'general' | 'international' | 'lgbt' | 'academic' | 'workplace'
  ): JapaneseCrisisResource[] {
    let resources = JAPANESE_CRISIS_RESOURCES;

    // Filter by age
    if (age < 18) {
      resources = resources.filter(r => 
        r.culturalContext === 'youth' || 
        r.culturalContext === 'general' ||
        r.specialties.includes('子ども・青少年')
      );
    }

    // Filter by language preference
    if (language === 'english') {
      resources = resources.filter(r => r.languages.includes('英語'));
    } else if (language === 'japanese') {
      resources = resources.filter(r => r.languages.includes('日本語'));
    }

    // Filter by cultural context
    if (culturalContext !== 'general') {
      const contextResources = resources.filter(r => r.culturalContext === culturalContext);
      const generalResources = resources.filter(r => r.culturalContext === 'general');
      resources = [...contextResources, ...generalResources];
    }

    // Always include emergency services
    const emergencyServices = JAPANESE_CRISIS_RESOURCES.filter(r => 
      r.phone === '110' || r.phone === '119'
    );

    return [...new Set([...emergencyServices, ...resources])];
  }

  /**
   * Generate culturally appropriate crisis intervention message
   */
  static generateCrisisMessage(
    severity: 'low' | 'medium' | 'high' | 'emergency',
    formalityLevel: 'casual' | 'polite' | 'formal',
    age?: number
  ): string {
    const messages = {
      emergency: {
        casual: '今すぐ助けが必要だね。一人じゃないよ。110番（警察）や119番（救急）に電話して。',
        polite: '今すぐサポートが必要ですね。お一人で抱え込まず、緊急通報（110・119）をしてください。',
        formal: '緊急事態と判断いたします。速やかに警察（110）または救急（119）へご連絡ください。'
      },
      high: {
        casual: 'とても辛い状況だと思う。今すぐ誰かに話を聞いてもらおう。いのちの電話（0570-783-556）が24時間対応してくれるよ。',
        polite: 'とてもお辛い状況ですね。今すぐ専門の方にお話を聞いてもらってください。いのちの電話（0570-783-556）が24時間対応しています。',
        formal: 'ご困難な状況にいらっしゃいますね。専門機関にご相談されることをお勧めいたします。'
      },
      medium: {
        casual: '大変な時期だね。一人で抱え込まなくていいよ。話を聞いてくれる人がいるから。',
        polite: '大変な時期をお過ごしですね。お一人で抱え込まず、サポートを受けてください。',
        formal: 'ご困難をお察しいたします。適切なサポートをお受けになることをお勧めいたします。'
      },
      low: {
        casual: '今の気持ち、大切にしてね。無理しないで、自分のペースでいいから。',
        polite: '今の気持ちを大切にしてください。無理をせず、ご自分のペースで進んでください。',
        formal: 'ご自身のお気持ちを大切になさってください。無理をなさらず、適切なペースでお進みください。'
      }
    };

    return messages[severity][formalityLevel];
  }

  /**
   * Cultural crisis detection patterns for Japanese context
   */
  static detectCrisisInJapaneseText(text: string): {
    severity: 'none' | 'low' | 'medium' | 'high' | 'emergency';
    keywords: string[];
    culturalMarkers: string[];
  } {
    const emergencyKeywords = ['死にたい', '自殺', '終わりにしたい', '消えたい', '飛び降り', '薬を飲む'];
    const highKeywords = ['生きていけない', '限界', '助けて', '苦しすぎる', '絶望', '希望がない'];
    const mediumKeywords = ['辛い', '疲れた', '眠れない', '食べられない', '孤独', '不安'];
    const lowKeywords = ['悲しい', '落ち込む', 'ストレス', '心配', '迷い'];

    // Japanese cultural markers of distress
    const culturalMarkers = [];
    if (text.includes('迷惑をかけ') || text.includes('申し訳')) culturalMarkers.push('guilt-shame');
    if (text.includes('頑張れない') || text.includes('頑張りすぎ')) culturalMarkers.push('ganbaru-pressure');
    if (text.includes('和を乱') || text.includes('みんなに合わせ')) culturalMarkers.push('harmony-pressure');
    if (text.includes('恥ずかし') || text.includes('面目')) culturalMarkers.push('face-saving');
    if (text.includes('一人になりたい') || text.includes('引きこもり')) culturalMarkers.push('social-withdrawal');

    const foundKeywords = [];
    let severity: 'none' | 'low' | 'medium' | 'high' | 'emergency' = 'none';

    // Check severity levels
    const emergencyFound = emergencyKeywords.filter(k => text.includes(k));
    const highFound = highKeywords.filter(k => text.includes(k));
    const mediumFound = mediumKeywords.filter(k => text.includes(k));
    const lowFound = lowKeywords.filter(k => text.includes(k));

    if (emergencyFound.length > 0) {
      severity = 'emergency';
      foundKeywords.push(...emergencyFound);
    } else if (highFound.length > 0) {
      severity = 'high';
      foundKeywords.push(...highFound);
    } else if (mediumFound.length > 0) {
      severity = 'medium';
      foundKeywords.push(...mediumFound);
    } else if (lowFound.length > 0) {
      severity = 'low';
      foundKeywords.push(...lowFound);
    }

    return { severity, keywords: foundKeywords, culturalMarkers };
  }

  /**
   * Generate culturally appropriate follow-up suggestions
   */
  static generateFollowUpSuggestions(
    severity: 'low' | 'medium' | 'high' | 'emergency',
    culturalMarkers: string[]
  ): string[] {
    const suggestions = [];

    // Base suggestions by severity
    switch (severity) {
      case 'emergency':
        suggestions.push('今すぐ110番（警察）または119番（救急）に電話してください');
        suggestions.push('近くにいる信頼できる人に助けを求めてください');
        break;
      case 'high':
        suggestions.push('いのちの電話（0570-783-556）に相談してください（24時間対応）');
        suggestions.push('こころの健康相談統一ダイヤル（0570-064-556）に相談してください');
        break;
      case 'medium':
        suggestions.push('深呼吸を3回してみてください');
        suggestions.push('信頼できる人に話を聞いてもらってください');
        suggestions.push('専門の相談窓口に連絡してみてください');
        break;
      case 'low':
        suggestions.push('今日はゆっくり休んでください');
        suggestions.push('温かい飲み物を飲んでリラックスしてください');
        suggestions.push('気持ちを日記に書いてみてください');
        break;
    }

    // Cultural-specific suggestions
    if (culturalMarkers.includes('ganbaru-pressure')) {
      suggestions.push('頑張りすぎなくても大丈夫です。休息も大切な時間です');
    }
    if (culturalMarkers.includes('harmony-pressure')) {
      suggestions.push('周りとの調和も大切ですが、あなた自身の気持ちも同じく大切です');
    }
    if (culturalMarkers.includes('guilt-shame')) {
      suggestions.push('申し訳ないと思う必要はありません。サポートを求めることは自然なことです');
    }
    if (culturalMarkers.includes('social-withdrawal')) {
      suggestions.push('一人の時間も大切ですが、つながりも心の支えになります');
    }

    return suggestions;
  }

  /**
   * Get region-specific resources
   */
  static getRegionalResources(prefecture: string): JapaneseCrisisResource[] {
    // This would be expanded with prefecture-specific resources
    const prefectureMapping: Record<string, string> = {
      '東京': 'tokyo',
      '大阪': 'osaka',
      '京都': 'kyoto',
      '福岡': 'fukuoka',
      '宮城': 'sendai',
      '北海道': 'sapporo'
    };

    const region = prefectureMapping[prefecture] || 'national';
    return JAPANESE_CRISIS_RESOURCES.filter(r => 
      r.region === region || r.region === 'national'
    );
  }
}

export default JapaneseCrisisSupport;