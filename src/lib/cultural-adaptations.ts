// ALCHM Cultural Adaptations & Sacred Language System
// Youth-Centered Spiritual Resonance Across Cultures

export interface CulturalAdaptation {
  locale: string;
  spiritualFramework: string;
  youthToneAdjustments: string[];
  sacredTerms: Record<string, string>;
  communityValues: string[];
  healingMetaphors: string[];
}

export const CULTURAL_ADAPTATIONS: Record<string, CulturalAdaptation> = {
  // Spanish (Latin America) - Family-centered, warm, heart-focused
  es: {
    locale: 'es',
    spiritualFramework: 'corazón_healing', // Heart-centered healing
    youthToneAdjustments: [
      'Use "alma" (soul) instead of clinical terms',
      'Emphasize "corazón" (heart) for emotional connection',
      'Reference "luz" (light) for hope and growth',
      'Include "sagrado" (sacred) to honor spiritual journey'
    ],
    sacredTerms: {
      sanctuary: 'santuario sagrado',
      healing: 'sanación del alma',
      growth: 'crecimiento espiritual',
      reflection: 'reflexión del corazón',
      sacred: 'sagrado',
      journey: 'viaje sagrado',
      community: 'comunidad de corazones'
    },
    communityValues: ['familia', 'comunidad', 'respeto', 'cariño'],
    healingMetaphors: [
      'como semilla que crece hacia la luz',
      'como río que fluye hacia el mar',
      'como corazón que late con esperanza'
    ]
  },

  // Portuguese (Brazil) - Warmth, community, soulfulness
  pt: {
    locale: 'pt',
    spiritualFramework: 'alma_cura', // Soul healing
    youthToneAdjustments: [
      'Use "alma" for depth and spirituality',
      'Emphasize "coração" for emotional warmth',
      'Reference "luz" for spiritual guidance',
      'Include "sagrado" for reverence'
    ],
    sacredTerms: {
      sanctuary: 'santuário sagrado',
      healing: 'cura da alma',
      growth: 'crescimento espiritual',
      reflection: 'reflexão da alma',
      sacred: 'sagrado',
      journey: 'jornada sagrada',
      community: 'comunidade de corações curadores'
    },
    communityValues: ['família', 'comunidade', 'calor humano', 'esperança'],
    healingMetaphors: [
      'como flor que desabrocha ao sol',
      'como água que encontra seu caminho',
      'como alma que dança com a vida'
    ]
  },

  // Swahili (Kenya) - Ubuntu philosophy, communal healing
  sw: {
    locale: 'sw',
    spiritualFramework: 'ubuntu_uponyaji', // Ubuntu healing
    youthToneAdjustments: [
      'Emphasize "roho" (soul/spirit) for depth',
      'Use "takatifu" (sacred/holy) for reverence',
      'Include "uponyaji" (healing) for restoration',
      'Reference communal wisdom and ancestors'
    ],
    sacredTerms: {
      sanctuary: 'patakatifu takatifu',
      healing: 'uponyaji wa roho',
      growth: 'maendeleo ya kiroho',
      reflection: 'tafakari ya roho',
      sacred: 'takatifu',
      journey: 'safari takatifu',
      community: 'jamii ya roho zinazopona'
    },
    communityValues: ['ubuntu', 'ujamaa', 'heshima', 'upendo'],
    healingMetaphors: [
      'kama mti ukuavyo kwenye ardhi nzuri',
      'kama mto ukuelekeavyo baharini',
      'kama jua lichomozavyo giza'
    ]
  },

  // Yoruba (Nigeria) - Ancestral wisdom, spiritual connection
  yo: {
    locale: 'yo',
    spiritualFramework: 'emi_iwosan', // Spirit healing
    youthToneAdjustments: [
      'Use "ẹ̀mí" (spirit/soul) for spiritual depth',
      'Emphasize "mímọ́" (sacred/holy) for reverence',
      'Include ancestral wisdom and connection',
      'Reference spiritual growth and community'
    ],
    sacredTerms: {
      sanctuary: 'ibi mímọ́ ayélujára',
      healing: 'ìwòsàn ẹ̀mí',
      growth: 'ìdàgbàsókè ẹ̀mí',
      reflection: 'ìrònú ẹ̀mí',
      sacred: 'mímọ́',
      journey: 'ìrìn-àjò mímọ́',
      community: 'àwùjọ àwọn ọkàn apòrànná'
    },
    communityValues: ['ìwà', 'ọmọlúwàbí', 'àjọṣe', 'ìfẹ́'],
    healingMetaphors: [
      'bí ewé tí ń ru sókè sí oòrùn',
      'bí omi tí ń sàn lọ sí òkun',
      'bí ẹ̀mí tí ń gbilẹ̀ láyé'
    ]
  },

  // Hindi (India) - Dharmic values, spiritual growth
  hi: {
    locale: 'hi',
    spiritualFramework: 'atma_chikitsa', // Soul healing
    youthToneAdjustments: [
      'Use "आत्मा" (atma/soul) for spiritual depth',
      'Emphasize "पवित्र" (pavitra/sacred) for reverence',
      'Include dharmic concepts of growth',
      'Reference inner light and spiritual journey'
    ],
    sacredTerms: {
      sanctuary: 'पवित्र डिजिटल अभयारण्य',
      healing: 'आत्मिक चंगाई',
      growth: 'आध्यात्मिक विकास',
      reflection: 'आत्मिक चिंतन',
      sacred: 'पवित्र',
      journey: 'पवित्र यात्रा',
      community: 'चंगाई करने वाले हृदयों का समुदाय'
    },
    communityValues: ['धर्म', 'अहिंसा', 'करुणा', 'सेवा'],
    healingMetaphors: [
      'जैसे फूल सूरज की रोशनी में खिलता है',
      'जैसे नदी समुद्र में मिलती है',
      'जैसे आत्मा अपने सच्चे स्वरूप में विकसित होती है'
    ]
  },

  // Arabic (Levantine) - Spiritual reverence, community support
  ar: {
    locale: 'ar',
    spiritualFramework: 'shifa_ruhi', // Spiritual healing
    youthToneAdjustments: [
      'Use "روح" (ruh/soul) for spiritual connection',
      'Emphasize "مقدس" (muqaddas/sacred) for reverence',
      'Include community support and blessing',
      'Reference divine guidance and inner peace'
    ],
    sacredTerms: {
      sanctuary: 'الملاذ الرقمي المقدس',
      healing: 'الشفاء الروحي',
      growth: 'النمو الروحي',
      reflection: 'التأمل الروحي',
      sacred: 'مقدس',
      journey: 'الرحلة المقدسة',
      community: 'جماعة القلوب الشافية'
    },
    communityValues: ['كرامة', 'احترام', 'رحمة', 'تضامن'],
    healingMetaphors: [
      'كالزهرة التي تتفتح في النور',
      'كالنهر الذي يجري نحو البحر',
      'كالروح التي تسمو نحو السلام'
    ]
  },

  // French (West Africa) - Intellectual depth, community wisdom
  fr: {
    locale: 'fr',
    spiritualFramework: 'guerison_ame', // Soul healing
    youthToneAdjustments: [
      'Use "âme" (soul) for spiritual depth',
      'Emphasize "sacré" (sacred) for reverence',
      'Include community wisdom and support',
      'Reference inner light and transformation'
    ],
    sacredTerms: {
      sanctuary: 'sanctuaire numérique sacré',
      healing: 'guérison de l\'âme',
      growth: 'croissance spirituelle',
      reflection: 'réflexion de l\'âme',
      sacred: 'sacré',
      journey: 'voyage sacré',
      community: 'communauté de cœurs guérisseurs'
    },
    communityValues: ['dignité', 'solidarité', 'sagesse', 'compassion'],
    healingMetaphors: [
      'comme une fleur qui s\'épanouit dans la lumière',
      'comme une rivière qui trouve son chemin vers la mer',
      'comme une âme qui grandit vers sa vérité'
    ]
  },

  // Chinese (Simplified) - Harmony, balance, inner cultivation
  zh: {
    locale: 'zh',
    spiritualFramework: 'xinling_liaoyu', // Heart-mind healing
    youthToneAdjustments: [
      'Use "心灵" (xinling/heart-mind) for holistic approach',
      'Emphasize "神圣" (shensheng/sacred) for reverence',
      'Include balance and harmony concepts',
      'Reference inner cultivation and growth'
    ],
    sacredTerms: {
      sanctuary: '神圣的数字圣境',
      healing: '心灵疗愈',
      growth: '心灵成长',
      reflection: '心灵反思',
      sacred: '神圣',
      journey: '神圣之旅',
      community: '疗愈心灵的社区'
    },
    communityValues: ['和谐', '平衡', '尊重', '慈悲'],
    healingMetaphors: [
      '如莲花在清水中绽放',
      '如溪流汇入大海',
      '如心灵在宁静中成长'
    ]
  },

  // Korean - Respect, harmony, spiritual growth
  ko: {
    locale: 'ko',
    spiritualFramework: 'maeum_chikyu', // Heart healing
    youthToneAdjustments: [
      'Use "영혼" (yeong-hon/soul) for spiritual depth',
      'Emphasize "신성한" (sinseonghan/sacred) for reverence',
      'Include respect and harmony values',
      'Reference inner peace and growth'
    ],
    sacredTerms: {
      sanctuary: '신성한 디지털 성역',
      healing: '영혼의 치유',
      growth: '영적 성장',
      reflection: '영혼의 성찰',
      sacred: '신성한',
      journey: '신성한 여행',
      community: '치유하는 마음들의 공동체'
    },
    communityValues: ['존중', '조화', '인내', '자비'],
    healingMetaphors: [
      '햇살 속에서 피어나는 꽃처럼',
      '바다로 흘러가는 강처럼',
      '평화를 향해 자라나는 영혼처럼'
    ]
  },

  // German - Precision, depth, authentic growth
  de: {
    locale: 'de',
    spiritualFramework: 'seele_heilung', // Soul healing
    youthToneAdjustments: [
      'Use "Seele" (soul) for spiritual depth',
      'Emphasize "heilig" (sacred/holy) for reverence',
      'Include authentic growth and self-discovery',
      'Reference inner strength and transformation'
    ],
    sacredTerms: {
      sanctuary: 'heiliges digitales Heiligtum',
      healing: 'Heilung der Seele',
      growth: 'spirituelles Wachstum',
      reflection: 'Seelenreflektion',
      sacred: 'heilig',
      journey: 'heilige Reise',
      community: 'Gemeinschaft heilender Herzen'
    },
    communityValues: ['Authentizität', 'Tiefe', 'Respekt', 'Mitgefühl'],
    healingMetaphors: [
      'wie eine Blume, die im Licht erblüht',
      'wie ein Fluss, der seinen Weg zum Meer findet',
      'wie eine Seele, die zu ihrer Wahrheit erwacht'
    ]
  }
};

// Functions to apply cultural adaptations
export function getCulturalSacredTerm(locale: string, term: keyof CulturalAdaptation['sacredTerms']): string {
  const adaptation = CULTURAL_ADAPTATIONS[locale];
  return adaptation?.sacredTerms[term] || term;
}

export function getCulturalHealingMetaphor(locale: string): string {
  const adaptation = CULTURAL_ADAPTATIONS[locale];
  if (!adaptation) return 'like a flower blooming in sunlight';
  
  const metaphors = adaptation.healingMetaphors;
  return metaphors[Math.floor(Math.random() * metaphors.length)];
}

export function getCulturalCommunityValue(locale: string): string[] {
  const adaptation = CULTURAL_ADAPTATIONS[locale];
  return adaptation?.communityValues || ['respect', 'compassion', 'growth', 'community'];
}

export function getYouthToneGuidance(locale: string): string[] {
  const adaptation = CULTURAL_ADAPTATIONS[locale];
  return adaptation?.youthToneAdjustments || [
    'Use warm, affirming language',
    'Emphasize sacredness over clinical terms',
    'Focus on spiritual growth and community',
    'Include hope and possibility'
  ];
}