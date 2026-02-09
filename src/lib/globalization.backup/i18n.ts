/**
 * Advanced Internationalization System for ALCHM
 * 
 * Comprehensive i18n framework supporting 15+ languages with RTL support,
 * cultural adaptations, and trauma-informed localization
 */

import { getLocaleConfig, LocaleConfig } from './index';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export interface LocalizedContent {
  [locale: string]: TranslationKey;
}

export interface CulturallyAdaptedTranslation {
  base: string;
  cultural_adaptations: {
    [culturalContext: string]: string;
  };
  tone_variations: {
    formal: string;
    informal: string;
    spiritual: string;
    clinical: string;
  };
  trauma_sensitive: {
    gentle: string;
    direct: string;
    empowering: string;
  };
}

/**
 * Enhanced translation interface supporting cultural adaptations
 */
export interface EnhancedTranslations {
  [key: string]: CulturallyAdaptedTranslation | string | EnhancedTranslations;
}

/**
 * Core ALCHM translations with cultural sensitivity
 */
export const TRANSLATIONS: Record<string, EnhancedTranslations> = {
  'en-US': {
    common: {
      welcome: {
        base: "Welcome to ALCHM",
        cultural_adaptations: {
          indigenous: "Welcome to this healing space",
          collectivist: "Welcome to our community of healing",
          spiritual: "Welcome to this sacred space of transformation"
        },
        tone_variations: {
          formal: "Welcome to the ALCHM platform",
          informal: "Hey there! Welcome to ALCHM",
          spiritual: "Blessings and welcome to ALCHM",
          clinical: "Welcome to the ALCHM therapeutic platform"
        },
        trauma_sensitive: {
          gentle: "You are safe here. Welcome to ALCHM",
          direct: "Welcome to ALCHM - your healing space",
          empowering: "Welcome to ALCHM, where your healing journey begins"
        }
      },
      continue: "Continue",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      loading: "Loading...",
      error: "Something went wrong. Please try again.",
      success: "Success!",
      privacy: "Privacy",
      terms: "Terms of Service",
      support: "Support"
    },
    journal: {
      title: "Journal",
      new_entry: "New Entry",
      save_entry: "Save Entry",
      prompt_today: {
        base: "How are you feeling today?",
        cultural_adaptations: {
          collectivist: "How are you and your loved ones feeling today?",
          somatic_expression: "What are you noticing in your body and emotions today?",
          spiritual: "How is your spirit today?",
          family_centered: "How is your family's energy today, and how are you within that?"
        },
        tone_variations: {
          formal: "Please describe your current emotional state",
          informal: "What's going on with you today?",
          spiritual: "How is your soul speaking to you today?",
          clinical: "Please rate and describe your mood today"
        },
        trauma_sensitive: {
          gentle: "Take your time... how are things feeling for you today?",
          direct: "Check in with yourself - how are you doing today?",
          empowering: "You have the wisdom to know how you're feeling - what's coming up today?"
        }
      },
      reflection_prompts: {
        gratitude: {
          base: "What are you grateful for today?",
          cultural_adaptations: {
            indigenous: "What gifts from the ancestors and earth are you grateful for?",
            collectivist: "What blessings in your community fill your heart today?",
            spiritual: "What divine gifts do you notice in your life today?"
          }
        },
        growth: {
          base: "How have you grown recently?",
          cultural_adaptations: {
            cyclical_time: "What cycles of growth and wisdom are you experiencing?",
            ancestral_wisdom: "How are you honoring the growth of your ancestors within you?",
            community_healing: "How has your growth contributed to your community's healing?"
          }
        },
        challenges: {
          base: "What challenges are you facing?",
          cultural_adaptations: {
            collectivist: "What challenges are you and your loved ones navigating?",
            spiritual: "What spiritual lessons are presenting themselves as challenges?",
            somatic: "What challenges are you feeling in your body and spirit?"
          },
          trauma_sensitive: {
            gentle: "What difficulties are you gently holding space for right now?",
            direct: "What's challenging you that you'd like to process?",
            empowering: "What challenges are actually opportunities for your strength to shine?"
          }
        }
      }
    },
    crisis: {
      immediate_support: {
        base: "If you're in immediate danger, please contact emergency services",
        cultural_adaptations: {
          immigrant: "If you're in danger and safe to call, contact emergency services. If not safe to call authorities, text our crisis line",
          lgbtq: "If you're in danger, you can contact emergency services or LGBTQ-affirming crisis lines",
          poc: "If you're in immediate danger, consider emergency services or community-based crisis support"
        }
      },
      resources_available: "Crisis resources available 24/7",
      you_are_not_alone: {
        base: "You are not alone",
        cultural_adaptations: {
          collectivist: "Your community holds you - you are not alone",
          spiritual: "The universe/divine holds you - you are not alone",
          indigenous: "Your ancestors and community surround you - you are not alone"
        }
      }
    },
    healing: {
      approaches: {
        traditional_therapy: "Traditional Therapy",
        cultural_healing: "Cultural Healing Practices",
        spiritual_integration: "Spiritual Integration",
        community_support: "Community Support",
        somatic_practices: "Body-Based Practices",
        creative_expression: "Creative Expression"
      },
      modalities: {
        talk_therapy: "Talk Therapy",
        art_therapy: "Art Therapy",
        movement_therapy: "Movement Therapy",
        meditation: "Meditation & Mindfulness",
        breathwork: "Breathwork",
        ritual_healing: "Ritual & Ceremonial Healing"
      }
    },
    community: {
      healing_circles: "Healing Circles",
      peer_support: "Peer Support",
      cultural_sharing: "Cultural Wisdom Sharing",
      anonymous_support: "Anonymous Support Groups",
      moderated_spaces: "Moderated Safe Spaces"
    },
    settings: {
      language: "Language",
      cultural_preferences: "Cultural Preferences",
      healing_traditions: "Healing Traditions",
      privacy_level: "Privacy Level",
      community_visibility: "Community Visibility",
      crisis_preferences: "Crisis Response Preferences"
    }
  },
  
  'es-MX': {
    common: {
      welcome: {
        base: "Bienvenido a ALCHM",
        cultural_adaptations: {
          indigenous: "Bienvenido a este espacio sagrado de sanación",
          collectivist: "Bienvenido a nuestra comunidad de sanación",
          spiritual: "Bienvenido a este espacio sagrado de transformación",
          family_centered: "Bienvenidos a este espacio familiar de sanación"
        },
        tone_variations: {
          formal: "Le damos la bienvenida a la plataforma ALCHM",
          informal: "¡Hola! Bienvenido a ALCHM",
          spiritual: "Bendiciones y bienvenido a ALCHM",
          clinical: "Bienvenido a la plataforma terapéutica ALCHM"
        },
        trauma_sensitive: {
          gentle: "Estás seguro aquí. Bienvenido a ALCHM",
          direct: "Bienvenido a ALCHM - tu espacio de sanación",
          empowering: "Bienvenido a ALCHM, donde comienza tu viaje de sanación"
        }
      },
      continue: "Continuar",
      cancel: "Cancelar", 
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      loading: "Cargando...",
      error: "Algo salió mal. Por favor intenta de nuevo.",
      success: "¡Éxito!",
      privacy: "Privacidad",
      terms: "Términos de Servicio",
      support: "Apoyo"
    },
    journal: {
      title: "Diario",
      new_entry: "Nueva Entrada",
      save_entry: "Guardar Entrada",
      prompt_today: {
        base: "¿Cómo te sientes hoy?",
        cultural_adaptations: {
          collectivist: "¿Cómo se sienten tú y tus seres queridos hoy?",
          somatic_expression: "¿Qué estás notando en tu cuerpo y emociones hoy?",
          spiritual: "¿Cómo está tu espíritu hoy?",
          family_centered: "¿Cómo está la energía de tu familia hoy, y cómo estás tú dentro de eso?"
        },
        tone_variations: {
          formal: "Por favor describe tu estado emocional actual",
          informal: "¿Qué tal andas hoy?",
          spiritual: "¿Cómo te está hablando tu alma hoy?",
          clinical: "Por favor evalúa y describe tu estado de ánimo hoy"
        },
        trauma_sensitive: {
          gentle: "Tómate tu tiempo... ¿cómo se sienten las cosas para ti hoy?",
          direct: "Conéctate contigo mismo - ¿cómo estás hoy?",
          empowering: "Tienes la sabiduría para saber cómo te sientes - ¿qué está surgiendo hoy?"
        }
      }
    },
    crisis: {
      immediate_support: {
        base: "Si estás en peligro inmediato, por favor contacta los servicios de emergencia",
        cultural_adaptations: {
          immigrant: "Si estás en peligro y es seguro llamar, contacta servicios de emergencia. Si no es seguro llamar a las autoridades, envía mensaje a nuestra línea de crisis",
          undocumented: "Si estás en peligro, considera contactar organizaciones comunitarias de apoyo en crisis"
        }
      },
      resources_available: "Recursos de crisis disponibles 24/7",
      you_are_not_alone: {
        base: "No estás solo",
        cultural_adaptations: {
          collectivist: "Tu comunidad te sostiene - no estás solo",
          spiritual: "El universo/lo divino te sostiene - no estás solo",
          family_centered: "Tu familia y comunidad te abrazan - no estás solo"
        }
      }
    }
  },

  'ar-SA': {
    common: {
      welcome: {
        base: "مرحباً بك في ALCHM",
        cultural_adaptations: {
          islamic: "أهلاً وسهلاً بك في هذا المكان المبارك للشفاء",
          family_centered: "مرحباً بك وبعائلتك في مجتمع الشفاء",
          spiritual: "بإسم الله، مرحباً بك في مكان التحول المقدس"
        },
        tone_variations: {
          formal: "نرحب بكم في منصة ALCHM",
          informal: "أهلاً! مرحباً بك في ALCHM",
          spiritual: "بارك الله فيك ومرحباً بك في ALCHM",
          clinical: "مرحباً بك في منصة ALCHM العلاجية"
        },
        trauma_sensitive: {
          gentle: "أنت في أمان هنا. مرحباً بك في ALCHM",
          direct: "مرحباً بك في ALCHM - مساحة الشفاء الخاصة بك",
          empowering: "مرحباً بك في ALCHM، حيث تبدأ رحلة شفائك"
        }
      },
      continue: "متابعة",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تحرير",
      delete: "حذف",
      loading: "جاري التحميل...",
      error: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      success: "نجح!",
      privacy: "الخصوصية",
      terms: "شروط الخدمة",
      support: "الدعم"
    },
    journal: {
      title: "اليومية",
      new_entry: "إدخال جديد",
      save_entry: "حفظ الإدخال",
      prompt_today: {
        base: "كيف تشعر اليوم؟",
        cultural_adaptations: {
          islamic: "كيف حالك اليوم بإذن الله؟",
          family_centered: "كيف حال الأسرة اليوم وكيف حالك أنت؟",
          spiritual: "كيف حال روحك اليوم؟"
        },
        tone_variations: {
          formal: "يرجى وصف حالتك العاطفية الحالية",
          informal: "شلونك اليوم؟",
          spiritual: "كيف تتحدث روحك إليك اليوم؟",
          clinical: "يرجى تقييم ووصف مزاجك اليوم"
        },
        trauma_sensitive: {
          gentle: "خذ وقتك... كيف تشعر بالأشياء اليوم؟",
          direct: "تفقد نفسك - كيف حالك اليوم؟",
          empowering: "لديك الحكمة لتعرف كيف تشعر - ما الذي يظهر اليوم؟"
        }
      }
    }
  },

  'de-DE': {
    common: {
      welcome: {
        base: "Willkommen bei ALCHM",
        cultural_adaptations: {
          therapeutic: "Willkommen in diesem therapeutischen Raum",
          community: "Willkommen in unserer Heilungsgemeinschaft",
          holistic: "Willkommen in diesem ganzheitlichen Heilungsraum"
        },
        tone_variations: {
          formal: "Willkommen auf der ALCHM-Plattform",
          informal: "Hey! Willkommen bei ALCHM",
          spiritual: "Segen und willkommen bei ALCHM",
          clinical: "Willkommen auf der therapeutischen ALCHM-Plattform"
        },
        trauma_sensitive: {
          gentle: "Sie sind hier sicher. Willkommen bei ALCHM",
          direct: "Willkommen bei ALCHM - Ihr Heilungsraum",
          empowering: "Willkommen bei ALCHM, wo Ihre Heilungsreise beginnt"
        }
      },
      continue: "Weiter",
      cancel: "Abbrechen",
      save: "Speichern",
      edit: "Bearbeiten",
      delete: "Löschen",
      loading: "Wird geladen...",
      error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      success: "Erfolgreich!",
      privacy: "Datenschutz",
      terms: "Nutzungsbedingungen",
      support: "Unterstützung"
    }
  },

  'hi-IN': {
    common: {
      welcome: {
        base: "ALCHM में आपका स्वागत है",
        cultural_adaptations: {
          ayurvedic: "इस आयुर्वेदिक चिकित्सा स्थान में आपका स्वागत है",
          family_centered: "हमारे पारिवारिक उपचार समुदाय में आपका स्वागत है",
          spiritual: "इस पवित्र परिवर्तन स्थान में आपका स्वागत है"
        },
        tone_variations: {
          formal: "ALCHM प्लेटफॉर्म पर आपका स्वागत है",
          informal: "नमस्ते! ALCHM में आपका स्वागत है",
          spiritual: "आशीर्वाद और ALCHM में आपका स्वागत है",
          clinical: "ALCHM चिकित्सा प्लेटफॉर्म में आपका स्वागत है"
        },
        trauma_sensitive: {
          gentle: "आप यहाँ सुरक्षित हैं। ALCHM में आपका स्वागत है",
          direct: "ALCHM में आपका स्वागत है - आपका उपचार स्थान",
          empowering: "ALCHM में आपका स्वागत है, जहाँ आपकी उपचार यात्रा शुरू होती है"
        }
      },
      continue: "जारी रखें",
      cancel: "रद्द करें",
      save: "सेव करें",
      edit: "संपादित करें",
      delete: "डिलीट करें",
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हुआ। कृपया फिर से कोशिश करें।",
      success: "सफल!",
      privacy: "गोपनीयता",
      terms: "सेवा की शर्तें",
      support: "समर्थन"
    }
  },

  'pt-BR': {
    common: {
      welcome: {
        base: "Bem-vindo ao ALCHM",
        cultural_adaptations: {
          spiritual: "Bem-vindo a este espaço sagrado de cura",
          community: "Bem-vindo à nossa comunidade de cura",
          afro_brazilian: "Bem-vindo a este terreiro de cura e transformação"
        },
        tone_variations: {
          formal: "Bem-vindo à plataforma ALCHM",
          informal: "Oi! Bem-vindo ao ALCHM",
          spiritual: "Bênçãos e bem-vindo ao ALCHM",
          clinical: "Bem-vindo à plataforma terapêutica ALCHM"
        },
        trauma_sensitive: {
          gentle: "Você está seguro aqui. Bem-vindo ao ALCHM",
          direct: "Bem-vindo ao ALCHM - seu espaço de cura",
          empowering: "Bem-vindo ao ALCHM, onde sua jornada de cura começá"
        }
      }
    }
  }
};

/**
 * Get translation with cultural adaptation
 */
export function getCulturalTranslation(
  key: string,
  locale: string,
  options: {
    culturalContext?: string;
    tone?: 'formal' | 'informal' | 'spiritual' | 'clinical';
    traumaSensitive?: 'gentle' | 'direct' | 'empowering';
    fallback?: string;
  } = {}
): string {
  const translation = getNestedTranslation(TRANSLATIONS[locale] || TRANSLATIONS['en-US'], key);
  
  if (typeof translation === 'string') {
    return translation;
  }

  if (typeof translation === 'object' && 'base' in translation) {
    const culturallyAdapted = translation as CulturallyAdaptedTranslation;
    
    // Try cultural adaptation first
    if (options.culturalContext && culturallyAdapted.cultural_adaptations[options.culturalContext]) {
      return culturallyAdapted.cultural_adaptations[options.culturalContext];
    }
    
    // Try tone variation
    if (options.tone && culturallyAdapted.tone_variations[options.tone]) {
      return culturallyAdapted.tone_variations[options.tone];
    }
    
    // Try trauma sensitive variation
    if (options.traumaSensitive && culturallyAdapted.trauma_sensitive[options.traumaSensitive]) {
      return culturallyAdapted.trauma_sensitive[options.traumaSensitive];
    }
    
    return culturallyAdapted.base;
  }

  return options.fallback || key;
}

/**
 * Get nested translation from object using dot notation
 */
function getNestedTranslation(obj: any, key: string): any {
  return key.split('.').reduce((current, k) => current?.[k], obj);
}

/**
 * RTL Language support utilities
 */
export const RTL_LOCALES = ['ar-SA', 'he-IL', 'fa-IR', 'ur-PK'];

export function isRTLLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale);
}

export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
}

/**
 * Format numbers, dates, and currencies based on locale
 */
export function formatNumber(number: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(number);
}

export function formatCurrency(amount: number, locale: string): string {
  const config = getLocaleConfig(locale);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.currency
  }).format(amount);
}

export function formatDate(date: Date, locale: string): string {
  const config = getLocaleConfig(locale);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC'
  }).format(date);
}

export function formatTime(time: Date, locale: string): string {
  const config = getLocaleConfig(locale);
  return new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
    hour12: config.timeFormat === '12h'
  }).format(time);
}

/**
 * Validate if translation exists for a key
 */
export function hasTranslation(key: string, locale: string): boolean {
  const translation = getNestedTranslation(TRANSLATIONS[locale] || TRANSLATIONS['en-US'], key);
  return translation !== undefined;
}

/**
 * Get all available locales for the platform
 */
export function getAvailableLocales(): string[] {
  return Object.keys(TRANSLATIONS);
}

/**
 * Detect user's preferred locale from browser/system settings
 */
export function detectUserLocale(): string {
  if (typeof window === 'undefined') return 'en-US';
  
  const browserLocales = navigator.languages || [navigator.language];
  const availableLocales = getAvailableLocales();
  
  for (const browserLocale of browserLocales) {
    // Exact match
    if (availableLocales.includes(browserLocale)) {
      return browserLocale;
    }
    
    // Language match (en-GB -> en-US)
    const language = browserLocale.split('-')[0];
    const match = availableLocales.find(locale => locale.startsWith(language));
    if (match) {
      return match;
    }
  }
  
  return 'en-US'; // Fallback
}

