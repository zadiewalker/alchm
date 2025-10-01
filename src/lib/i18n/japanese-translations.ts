/**
 * Comprehensive Japanese Translations for ALCHM
 * Context-aware, culturally sensitive translations
 */

export const japaneseTranslations = {
  // Navigation and Core UI
  navigation: {
    dashboard: '心の記録室',
    journal: '今日の心',
    journals: '心の歴史',
    insights: '内なる気づき',
    community: '心の仲間',
    crisis: '心のサポート',
    settings: '設定',
    logout: 'ログアウト',
    home: 'ホーム'
  },

  // Authentication
  auth: {
    login: 'ログイン',
    signup: '新規登録',
    email: 'メールアドレス',
    password: 'パスワード',
    welcome: 'ALCHMへようこそ',
    welcomeMessage: '心の健康を大切にする場所へようこそ。あなたのペースで、安全に進めていきましょう。',
    loginWithGoogle: 'Googleでログイン',
    createAccount: 'アカウントを作成',
    forgotPassword: 'パスワードを忘れた方',
    ageVerification: '年齢確認',
    ageVerificationMessage: '13歳未満の方は保護者の同意が必要です。',
    parentalConsent: '保護者の同意',
    consentRequired: '保護者の同意が必要です'
  },

  // Dashboard
  dashboard: {
    welcome: {
      morning: 'おはようございます',
      afternoon: 'こんにちは',
      evening: 'こんばんは',
      night: 'お疲れさまです'
    },
    todaysReflection: '今日の内省',
    recentInsights: '最近の気づき',
    emotionalWeather: '心の天気',
    writeEntry: '心の記録をつける',
    continueLearning: '学びを続ける',
    connectCommunity: '仲間とつながる',
    crisisSupport: '今すぐサポートが必要',
    weeklyProgress: '今週の歩み',
    monthlyGrowth: '今月の成長'
  },

  // Journal Interface
  journal: {
    title: '今日の心の記録',
    placeholder: '今日の気持ち、考え、体験について自由に書いてください。正しい答えはありません。あなたのペースで。',
    promptSuggestions: '書くヒント',
    saveEntry: '記録を保存',
    saving: '保存中...',
    saved: '保存しました',
    autoSaveEnabled: '自動保存が有効です',
    voiceNote: '音声メモ',
    addPhoto: '写真を追加',
    mood: '今の気分',
    energy: 'エネルギーレベル',
    gratitude: '感謝の気持ち',
    challenge: '今日の挑戦',
    learning: '今日の学び'
  },

  // Emotional Intelligence
  emotions: {
    happy: '嬉しい',
    sad: '悲しい',
    angry: '怒り',
    anxious: '不安',
    calm: '落ち着いている',
    excited: 'わくわく',
    frustrated: 'いらいら',
    peaceful: '平和',
    overwhelmed: '圧倒されている',
    content: '満足',
    lonely: '寂しい',
    grateful: '感謝',
    hopeful: '希望に満ちた',
    confused: '混乱',
    proud: '誇らしい',
    embarrassed: '恥ずかしい',
    disappointed: 'がっかり',
    nervous: '緊張',
    relaxed: 'リラックス',
    curious: '好奇心'
  },

  // Journal Prompts (Japanese Cultural Context)
  prompts: {
    ikigai: {
      title: '生きがいについて',
      prompt: 'あなたの生きがいについて考えてみましょう。何があなたを朝起きたくさせますか？'
    },
    wa: {
      title: '心の調和',
      prompt: '今日、心の和を感じた瞬間はありましたか？人間関係の中で調和を保ちながら自分らしくいられていますか？'
    },
    ganbaru: {
      title: '健康的な努力',
      prompt: '今日の「頑張り」は健康的でしたか？努力と無理の違いを感じることができましたか？'
    },
    omoiyari: {
      title: '思いやりの心',
      prompt: '今日、誰かへの思いやりを示しましたか？自分自身への思いやりも忘れていませんか？'
    },
    relationships: {
      title: '人間関係',
      prompt: '今日の人間関係の中で感じたことを振り返ってみましょう。'
    },
    stress: {
      title: 'ストレスとの向き合い方',
      prompt: '今日感じたストレスやプレッシャーについて。どのように対処しましたか？'
    },
    growth: {
      title: '成長の実感',
      prompt: '最近、自分の成長を感じた瞬間はありますか？小さな変化でも大切です。'
    },
    gratitude: {
      title: '感謝の気持ち',
      prompt: '今日、感謝の気持ちを感じた瞬間はありましたか？'
    }
  },

  // Crisis Support
  crisis: {
    immediateHelp: '今すぐサポートが必要な方',
    notAlone: 'あなたは一人じゃありません',
    crisisMessage: '今とても辛い気持ちだと思います。専門の方々がサポートしてくれます。',
    callHotline: '相談電話をかける',
    chatSupport: 'チャットサポート',
    emergencyServices: '緊急時（警察・救急）',
    localResources: '地域のサポート',
    breathingExercise: '呼吸法',
    groundingTechnique: 'グラウンディング',
    safetyPlan: '安全計画',
    professionalHelp: '専門家のサポート'
  },

  // Japanese-Specific Crisis Resources
  crisisResources: {
    inochino: {
      name: 'いのちの電話',
      number: '0570-783-556',
      description: '24時間対応の自殺予防相談電話',
      available: '24時間365日'
    },
    kokoro: {
      name: 'こころの健康相談統一ダイヤル',
      number: '0570-064-556',
      description: '心の健康についての相談',
      available: '地域により異なります'
    },
    jhelp: {
      name: 'TELL相談',
      number: '03-5774-0992',
      description: '英語・日本語でのカウンセリング',
      available: '毎日 9:00-23:00'
    },
    police: {
      name: '警察（緊急）',
      number: '110',
      description: '緊急時の警察への通報',
      available: '24時間365日'
    },
    ambulance: {
      name: '救急車',
      number: '119',
      description: '救急医療が必要な時',
      available: '24時間365日'
    }
  },

  // Community Features
  community: {
    anonymousSharing: '匿名での分かち合い',
    wisdomCircle: '知恵の輪',
    supportCircle: 'サポートサークル',
    healingJourney: '癒しの旅路',
    sharedWisdom: '共有された知恵',
    communityGuidelines: 'コミュニティガイドライン',
    respectfulCommunication: '思いやりのあるコミュニケーション',
    anonymousPost: '匿名で投稿',
    react: '反応する',
    support: '支える',
    hearts: 'ハート',
    understanding: '理解',
    strength: '強さ',
    gratitude: '感謝'
  },

  // Educational Content
  learning: {
    emotionalLiteracy: '感情の理解',
    copingStrategies: '対処法',
    mindfulness: 'マインドフルネス',
    resilience: 'レジリエンス',
    selfCompassion: '自己への慈悲',
    boundarySettting: '境界線の設定',
    stressManagement: 'ストレス管理',
    relationshipSkills: '人間関係のスキル',
    communicationSkills: 'コミュニケーションスキル',
    emotionalRegulation: '感情調整'
  },

  // Badge System (Japanese Cultural Context)
  badges: {
    foundation: {
      feelingTranslator: '感情の翻訳者',
      bodyWisdom: '身体の知恵',
      triggerMapper: 'きっかけの地図作り',
      safeSpaceCreator: '安全な場所の創造者'
    },
    skillDevelopment: {
      pauseMaster: '一呼吸の達人',
      breathAlchemist: '呼吸の錬金術師',
      reframeArtist: 'リフレーミングの芸術家',
      boundaryGuardian: '境界線の守護者'
    },
    resilience: {
      stormSurfer: '嵐のサーファー',
      wisdomKeeper: '知恵の番人',
      phoenixRising: '蘇る不死鳥',
      gentleWarrior: '優しい戦士'
    },
    community: {
      anonymousAngel: '匿名の天使',
      collectiveStrength: '集合的な強さ',
      rippleEffect: '波紋効果',
      sanctuaryBuilder: '聖域の建設者'
    },
    cultural: {
      ikigaiSeeker: '生きがいの探求者',
      waKeeper: '和の守り手',
      omoiyariMaster: '思いやりの達人',
      kokoroHealer: '心の癒し手'
    }
  },

  // Pricing (Japanese Context)
  pricing: {
    choosePlan: 'あなたの癒しの旅路を選んでください',
    everyPathValid: 'どの道も正しい道です',
    sanctuary: {
      name: '聖域（無料）',
      description: '心の健康の基盤となる完全なサポート',
      features: [
        '無制限の日記記録',
        'ケペラAIによる反省サポート',
        '思いやりのある習慣システム',
        '基礎バッジの獲得',
        '危機時のサポートリソース',
        '基本的な自己理解レポート',
        'コミュニティへの参加',
        'オフライン日記機能'
      ]
    },
    deepCut: {
      name: 'ディープカット（月額499円）',
      description: '深い自己理解のための高度なツール',
      features: [
        '聖域の全機能',
        '高度なパターン認識',
        '無制限のケペラAI会話',
        '全バッジツリーへのアクセス',
        '優先カスタマーサポート',
        '拡張エクスポート機能',
        '個人化された洞察レポート',
        '新機能への早期アクセス'
      ]
    },
    oracle: {
      name: 'オラクル（月額999円）',
      description: '真の変革のための包括的なツールキット',
      features: [
        'ディープカットの全機能',
        '家族向けダッシュボード',
        'グループセラピーツール',
        '高度な危機予防システム',
        'プロフェッショナル向け分析',
        'カスタムAIパーソナリティ',
        '無制限クラウドストレージ',
        '専門家相談リクエスト'
      ]
    },
    freeTrial: '無料体験',
    startFree: '無料で始める',
    choosePlan: 'プランを選択',
    moneyBackGuarantee: '30日間返金保証',
    yourWellbeingFirst: 'あなたの心の健康が最優先です',
    financialHardship: '経済的困難な方への支援',
    slidingScale: 'スライディングスケール料金'
  },

  // Settings
  settings: {
    profile: 'プロフィール',
    preferences: '設定',
    privacy: 'プライバシー',
    notifications: '通知',
    language: '言語',
    accessibility: 'アクセシビリティ',
    dataExport: 'データのエクスポート',
    deleteAccount: 'アカウントの削除',
    formalityLevel: '丁寧さレベル',
    culturalContext: '文化的背景',
    helpAndSupport: 'ヘルプとサポート'
  },

  // Notifications (Japanese Style)
  notifications: {
    gentleReminder: '優しいリマインダー',
    journalReminder: '心の記録の時間です',
    breathingBreak: '深呼吸の時間',
    gratitudeMoment: '感謝の瞬間',
    selfCareCheck: 'セルフケアチェック',
    communityUpdate: 'コミュニティからのお知らせ',
    badgeEarned: 'バッジを獲得しました',
    weeklyReflection: '週間振り返り',
    monthlyInsights: '月間インサイト'
  },

  // Time and Date (Japanese Format)
  time: {
    today: '今日',
    yesterday: '昨日',
    thisWeek: '今週',
    thisMonth: '今月',
    morning: '朝',
    afternoon: '午後',
    evening: '夕方',
    night: '夜',
    weekdays: ['月', '火', '水', '木', '金', '土', '日'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },

  // Success Messages
  success: {
    entrySaved: '心の記録が保存されました',
    badgeEarned: '新しいバッジを獲得しました！',
    profileUpdated: 'プロフィールが更新されました',
    settingsSaved: '設定が保存されました',
    dataExported: 'データがエクスポートされました',
    supportMessageSent: 'サポートメッセージが送信されました'
  },

  // Error Messages (Gentle Japanese Style)
  errors: {
    networkError: 'ネットワークの問題が発生しました。少し時間をおいてから再度お試しください。',
    saveFailed: '保存に失敗しました。もう一度お試しください。',
    loginFailed: 'ログインできませんでした。認証情報をご確認ください。',
    ageVerificationRequired: '年齢確認が必要です',
    parentalConsentRequired: '保護者の同意が必要です',
    generalError: '申し訳ございません。問題が発生しました。'
  },

  // Cultural Sensitivity Messages
  cultural: {
    respectPrivacy: 'プライバシーを尊重します',
    noJudgment: '判断いたしません',
    yourPace: 'あなたのペースで',
    culturalSensitivity: '文化的配慮',
    individualAndCollective: '個人と集団の調和',
    savesFace: '面子を保つ',
    indirectCommunication: '間接的なコミュニケーション'
  }
};

export default japaneseTranslations;