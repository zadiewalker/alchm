// ALCHM Cultural Tone Recommendations
// Post-Audit Implementation Guide for Culturally Authentic Translations

export interface CulturalToneRecommendation {
  locale: string;
  culturalFramework: string;
  keyTermReplacements: Record<string, string>;
  metaphorGrounding: string[];
  youthAdaptations: string[];
  sacredLanguageShifts: Record<string, string>;
  implementationPriority: 'high' | 'medium' | 'low';
}

export const CULTURAL_TONE_RECOMMENDATIONS: Record<string, CulturalToneRecommendation> = {
  es: {
    locale: 'es',
    culturalFramework: 'curanderismo_indigenous_healing',
    keyTermReplacements: {
      'digital_sanctuary': 'refugio sagrado virtual',
      'emotional_alchemy': 'medicina del alma',
      'ai_assisted_reflection': 'reflexión acompañada',
      'begin_first_reflection': 'Abre tu corazón al diálogo sagrado',
      'therapy': 'sanación',
      'mental_health': 'bienestar del alma',
      'treatment': 'acompañamiento espiritual'
    },
    metaphorGrounding: [
      'Replace European mystical terms with indigenous concepts',
      'Use "medicina del alma" (soul medicine) over alchemy',
      'Reference curanderismo healing traditions',
      'Emphasize "corazón" as center of wisdom'
    ],
    youthAdaptations: [
      'Use "plática del alma" (soul conversation) for informal tone',
      'Replace formal "reflexión" with "diálogo del corazón"',
      'Include family/community connection themes',
      'Use affirming terms like "alma hermosa" (beautiful soul)'
    ],
    sacredLanguageShifts: {
      'clinical': 'sagrado',
      'treatment': 'medicina ancestral',
      'diagnosis': 'reconocimiento del alma',
      'symptoms': 'señales del corazón'
    },
    implementationPriority: 'high'
  },

  pt: {
    locale: 'pt',
    culturalFramework: 'afro_brazilian_spiritual_healing',
    keyTermReplacements: {
      'digital_sanctuary': 'terreiro digital sagrado',
      'emotional_alchemy': 'cura do coração',
      'ai_assisted_reflection': 'reflexão acompanhada',
      'begin_first_reflection': 'Abra seu coração para o diálogo',
      'therapy': 'cura',
      'mental_health': 'bem-estar da alma',
      'treatment': 'processo de cura'
    },
    metaphorGrounding: [
      'Integrate Afro-Brazilian "terreiro" concepts',
      'Reference "axé" (life force) and community healing',
      'Use "cura" instead of clinical treatment language',
      'Emphasize ancestral wisdom and spiritual connection'
    ],
    youthAdaptations: [
      'Use "conversa interior" for reflection',
      'Include "energia" and "vibração" concepts',
      'Reference community support and belonging',
      'Use warm terms like "coração corajoso" (brave heart)'
    ],
    sacredLanguageShifts: {
      'clinical': 'sagrado',
      'treatment': 'processo de cura espiritual',
      'diagnosis': 'reconhecimento da alma',
      'symptoms': 'sinais do coração'
    },
    implementationPriority: 'high'
  },

  sw: {
    locale: 'sw',
    culturalFramework: 'ubuntu_communal_healing',
    keyTermReplacements: {
      'digital_sanctuary': 'makao takatifu ya kiroho',
      'emotional_alchemy': 'mabadiliko ya roho',
      'ai_assisted_reflection': 'mazungumzo ya kiroho',
      'begin_first_reflection': 'Funua moyo wako kwa mazungumzo',
      'therapy': 'uponyaji',
      'mental_health': 'ustawi wa roho',
      'treatment': 'mchakato wa uponyaji'
    },
    metaphorGrounding: [
      'Ground in Ubuntu philosophy and communal healing',
      'Use "uponyaji" (healing) in community context',
      'Reference traditional healing practices',
      'Emphasize "roho" (spirit) connection and wisdom'
    ],
    youthAdaptations: [
      'Use "sherehe ya roho" (celebration of spirit)',
      'Include community support themes',
      'Reference ancestral guidance in modern context',
      'Use affirming "roho nzuri" (good spirit)'
    ],
    sacredLanguageShifts: {
      'clinical': 'takatifu',
      'treatment': 'uponyaji wa kijamii',
      'diagnosis': 'ufahamu wa roho',
      'symptoms': 'ishara za ndani'
    },
    implementationPriority: 'high'
  },

  yo: {
    locale: 'yo',
    culturalFramework: 'yoruba_ifa_orisha_wisdom',
    keyTermReplacements: {
      'digital_sanctuary': 'ilé ìsìn ẹ̀mí',
      'emotional_alchemy': 'ìyípadà ọkàn',
      'ai_assisted_reflection': 'ìbánisọ̀rọ̀ ẹ̀mí',
      'begin_first_reflection': 'Ṣí ọkàn rẹ sí ọ̀rọ̀ ẹ̀mí',
      'therapy': 'ìwòsàn',
      'mental_health': 'ìlera ẹ̀mí',
      'treatment': 'ètò ìwòsàn'
    },
    metaphorGrounding: [
      'Connect to Ifá wisdom and Orisha spirituality',
      'Use "àṣẹ" (life force) concepts',
      'Reference oral tradition and storytelling',
      'Emphasize ancestral guidance and community wisdom'
    ],
    youthAdaptations: [
      'Use conversational "ìbánisọ̀rọ̀" (dialogue)',
      'Include modern expressions with traditional concepts',
      'Reference community elders and wisdom sharing',
      'Use encouraging "ẹ̀mí rẹwà" (beautiful spirit)'
    ],
    sacredLanguageShifts: {
      'clinical': 'mímọ́',
      'treatment': 'ìwòsàn àjọṣe',
      'diagnosis': 'ìmọ̀ ọkàn',
      'symptoms': 'àmì inú'
    },
    implementationPriority: 'high'
  },

  ar: {
    locale: 'ar',
    culturalFramework: 'islamic_sufi_spiritual_healing',
    keyTermReplacements: {
      'digital_sanctuary': 'بيت الروح الرقمي',
      'emotional_alchemy': 'تزكية النفس',
      'ai_assisted_reflection': 'حوار النفس المرشد',
      'begin_first_reflection': 'افتح قلبك للحديث الروحي',
      'therapy': 'شفاء',
      'mental_health': 'صحة الروح',
      'treatment': 'علاج روحي'
    },
    metaphorGrounding: [
      'Ground in Islamic mystical traditions',
      'Use "tazkiyah" (soul purification) concepts',
      'Reference "suhba" (spiritual companionship)',
      'Avoid occult associations, emphasize divine guidance'
    ],
    youthAdaptations: [
      'Use "مناجاة" (intimate conversation) for reflection',
      'Include community support in Islamic context',
      'Reference prophetic wisdom and guidance',
      'Use blessing language "الروح الجميلة" (beautiful soul)'
    ],
    sacredLanguageShifts: {
      'clinical': 'مقدس',
      'treatment': 'شفاء بالصحبة الروحية',
      'diagnosis': 'فهم النفس',
      'symptoms': 'إشارات القلب'
    },
    implementationPriority: 'medium'
  },

  hi: {
    locale: 'hi',
    culturalFramework: 'dharmic_yoga_ayurveda_healing',
    keyTermReplacements: {
      'digital_sanctuary': 'आत्म-मंदिर',
      'emotional_alchemy': 'हृदय परिवर्तन',
      'ai_assisted_reflection': 'सहयोगी आत्म-चिंतन',
      'begin_first_reflection': 'अपने हृदय की आवाज़ सुनें',
      'therapy': 'चिकित्सा',
      'mental_health': 'मानसिक स्वास्थ्य',
      'treatment': 'उपचार'
    },
    metaphorGrounding: [
      'Connect to yoga, dharma, and Ayurvedic concepts',
      'Use "atma" (soul) and "hridaya" (heart-center)',
      'Reference "satsang" (spiritual gathering)',
      'Emphasize inner wisdom and spiritual growth'
    ],
    youthAdaptations: [
      'Use "आत्मा से बातचीत" (conversation with soul)',
      'Include modern spiritual seeking language',
      'Reference guru-disciple wisdom sharing',
      'Use affirming "सुंदर आत्मा" (beautiful soul)'
    ],
    sacredLanguageShifts: {
      'clinical': 'पवित्र',
      'treatment': 'आध्यात्मिक चिकित्सा',
      'diagnosis': 'आत्म-ज्ञान',
      'symptoms': 'हृदय के संकेत'
    },
    implementationPriority: 'medium'
  },

  fr: {
    locale: 'fr',
    culturalFramework: 'west_african_communal_wisdom',
    keyTermReplacements: {
      'digital_sanctuary': 'temple de l\'âme numérique',
      'emotional_alchemy': 'transformation du cœur',
      'ai_assisted_reflection': 'réflexion accompagnée',
      'begin_first_reflection': 'Ouvrez votre cœur au dialogue',
      'therapy': 'guérison',
      'mental_health': 'bien-être de l\'âme',
      'treatment': 'accompagnement thérapeutique'
    },
    metaphorGrounding: [
      'Honor communal wisdom and ancestral guidance',
      'Use "guérison" (healing) over clinical terms',
      'Reference traditional healing and community support',
      'Emphasize collective wisdom and belonging'
    ],
    youthAdaptations: [
      'Use "conversation intérieure" for reflection',
      'Include community and family connection themes',
      'Reference wisdom sharing traditions',
      'Use warm terms "belle âme" (beautiful soul)'
    ],
    sacredLanguageShifts: {
      'clinical': 'sacré',
      'treatment': 'guérison communautaire',
      'diagnosis': 'reconnaissance de l\'âme',
      'symptoms': 'signaux du cœur'
    },
    implementationPriority: 'medium'
  },

  zh: {
    locale: 'zh',
    culturalFramework: 'daoist_buddhist_confucian_cultivation',
    keyTermReplacements: {
      'digital_sanctuary': '心灵净土',
      'emotional_alchemy': '心性转化',
      'ai_assisted_reflection': '智慧对话',
      'begin_first_reflection': '开启心灵对话',
      'therapy': '治疗',
      'mental_health': '心理健康',
      'treatment': '治疗'
    },
    metaphorGrounding: [
      'Ground in Daoist, Buddhist, Confucian concepts',
      'Use "xinling" (heart-mind) and harmony themes',
      'Reference meditation and self-cultivation',
      'Emphasize balance, inner peace, and wisdom'
    ],
    youthAdaptations: [
      'Use "与内心交流" (communicate with inner self)',
      'Include modern mindfulness and wellness concepts',
      'Reference traditional wisdom in contemporary context',
      'Use encouraging "美丽的灵魂" (beautiful soul)'
    ],
    sacredLanguageShifts: {
      'clinical': '神圣',
      'treatment': '心灵修养',
      'diagnosis': '心性认知',
      'symptoms': '心灵信号'
    },
    implementationPriority: 'medium'
  }
};

// Implementation utilities
export function getCulturallyTunedTerm(locale: string, englishTerm: string): string {
  const recommendation = CULTURAL_TONE_RECOMMENDATIONS[locale];
  if (!recommendation) return englishTerm;
  
  return recommendation.keyTermReplacements[englishTerm] || englishTerm;
}

export function getCulturalFramework(locale: string): string {
  const recommendation = CULTURAL_TONE_RECOMMENDATIONS[locale];
  return recommendation?.culturalFramework || 'universal_healing';
}

export function getMetaphorGrounding(locale: string): string[] {
  const recommendation = CULTURAL_TONE_RECOMMENDATIONS[locale];
  return recommendation?.metaphorGrounding || [];
}

export function getYouthAdaptations(locale: string): string[] {
  const recommendation = CULTURAL_TONE_RECOMMENDATIONS[locale];
  return recommendation?.youthAdaptations || [];
}

export function getSacredLanguageShift(locale: string, clinicalTerm: string): string {
  const recommendation = CULTURAL_TONE_RECOMMENDATIONS[locale];
  return recommendation?.sacredLanguageShifts[clinicalTerm] || clinicalTerm;
}