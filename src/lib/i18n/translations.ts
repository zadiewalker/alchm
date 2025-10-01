export type SupportedLanguage = 'en' | 'es' | 'ar' | 'zh';

export interface TranslationStrings {
  // Navigation and Common
  navigation: {
    home: string;
    journal: string;
    pathways: string;
    community: string;
    dashboard: string;
    export: string;
    settings: string;
  };
  
  // Authentication
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    welcomeBack: string;
    createAccount: string;
  };
  
  // Onboarding
  onboarding: {
    welcome: string;
    findYourPath: string;
    questionProgress: string;
    skipOnboarding: string;
    getStarted: string;
    exploreAllPathways: string;
  };
  
  // Pathways
  pathways: {
    resilience: {
      title: string;
      subtitle: string;
      description: string;
    };
    becoming: {
      title: string;
      subtitle: string;
      description: string;
    };
    purpose: {
      title: string;
      subtitle: string;
      description: string;
    };
    belonging: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
  
  // Journal
  journal: {
    writeYourTruth: string;
    startWriting: string;
    saveEntry: string;
    newEntry: string;
    yourEntries: string;
    noEntriesYet: string;
  };
  
  // Community
  community: {
    sharingCircle: string;
    anonymousSpace: string;
    shareAnonymously: string;
    safeSpace: string;
    guidelines: string;
    loadMoreStories: string;
  };
  
  // Crisis Support
  crisis: {
    crisisSupport: string;
    immediateHelp: string;
    callEmergency: string;
    crisisLine: string;
    textSupport: string;
    youMatter: string;
  };
  
  // Export
  export: {
    exportJourney: string;
    createPDF: string;
    downloadExport: string;
    privacyNotice: string;
    exportOptions: string;
  };
  
  // Wellness Analytics
  analytics: {
    wellnessInsights: string;
    progressOverTime: string;
    moodTrends: string;
    growthMetrics: string;
  };
  
  // Medical Disclaimers
  medical: {
    disclaimer: string;
    notTherapy: string;
    seekProfessionalHelp: string;
    emergencyServices: string;
  };
  
  // Time and Dates
  time: {
    today: string;
    yesterday: string;
    thisWeek: string;
    lastWeek: string;
    thisMonth: string;
    daysAgo: string;
    hoursAgo: string;
    minutesAgo: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    navigation: {
      home: 'Home',
      journal: 'Journal',
      pathways: 'Pathways',
      community: 'Community',
      dashboard: 'Dashboard',
      export: 'Export',
      settings: 'Settings',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
    },
    onboarding: {
      welcome: 'Welcome to Your Digital Sanctuary',
      findYourPath: "Let's find the perfect starting point for your healing journey",
      questionProgress: 'Question {current} of {total}',
      skipOnboarding: 'Skip and explore all pathways',
      getStarted: 'Get Started',
      exploreAllPathways: 'Explore All Pathways',
    },
    pathways: {
      resilience: {
        title: 'Resilience',
        subtitle: 'Your Strength Story',
        description: 'Discover the power you already carry. This pathway helps you recognize your inherent resilience and build on the strength that lives in your bones.',
      },
      becoming: {
        title: 'Becoming',
        subtitle: 'Your Evolution Journey',
        description: 'Embrace the art of transformation. This pathway supports you in shedding old stories and stepping into the fullest expression of who you are meant to be.',
      },
      purpose: {
        title: 'Purpose',
        subtitle: 'Your Meaning Quest',
        description: 'Discover what sets your soul on fire. This pathway helps you connect with your deepest values and find ways to contribute meaningfully to the world.',
      },
      belonging: {
        title: 'Belonging',
        subtitle: 'Your Connection Circle',
        description: 'Find your people and your place. This pathway focuses on understanding authentic connection and creating spaces where you can be fully yourself.',
      },
    },
    journal: {
      writeYourTruth: 'Write your truth here...',
      startWriting: 'Start Writing',
      saveEntry: 'Save Entry',
      newEntry: 'New Entry',
      yourEntries: 'Your Entries',
      noEntriesYet: 'No entries yet. Start your healing journey by writing your first reflection.',
    },
    community: {
      sharingCircle: 'Anonymous Sharing Circle',
      anonymousSpace: 'A safe space to share your truth and connect with others on similar journeys',
      shareAnonymously: 'Share Anonymously',
      safeSpace: 'Safe Space Guidelines',
      guidelines: 'All sharing is anonymous. Be kind, authentic, and respectful. If you\'re in crisis, please reach out to 988 or emergency services.',
      loadMoreStories: 'Load more stories',
    },
    crisis: {
      crisisSupport: 'Crisis Support',
      immediateHelp: 'Get Help Now',
      callEmergency: 'Call 911',
      crisisLine: '988 Crisis Lifeline',
      textSupport: 'Text HOME to 741741',
      youMatter: 'You matter. You are not alone. Help is available 24/7.',
    },
    export: {
      exportJourney: 'Export Your Journey',
      createPDF: 'Create a beautiful PDF of your healing journey and insights',
      downloadExport: 'Download PDF Export',
      privacyNotice: 'Your exported typeof window !== 'undefined' && document contains personal information. Store it securely and only share with trusted healthcare providers.',
      exportOptions: 'Export Options',
    },
    analytics: {
      wellnessInsights: 'Wellness Insights',
      progressOverTime: 'Progress Over Time',
      moodTrends: 'Mood Trends',
      growthMetrics: 'Growth Metrics',
    },
    medical: {
      disclaimer: 'Important Medical Disclaimer',
      notTherapy: 'ALCHM is not therapy, medical advice, or professional treatment',
      seekProfessionalHelp: 'Please consult licensed mental health professionals for treatment',
      emergencyServices: 'Call 911 for life-threatening emergencies',
    },
    time: {
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      lastWeek: 'Last week',
      thisMonth: 'This month',
      daysAgo: '{count} days ago',
      hoursAgo: '{count} hours ago',
      minutesAgo: '{count} minutes ago',
    },
  },
  
  es: {
    navigation: {
      home: 'Inicio',
      journal: 'Diario',
      pathways: 'Caminos',
      community: 'Comunidad',
      dashboard: 'Panel',
      export: 'Exportar',
      settings: 'Configuración',
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      welcomeBack: 'Bienvenido de Vuelta',
      createAccount: 'Crear Cuenta',
    },
    onboarding: {
      welcome: 'Bienvenido a Tu Santuario Digital',
      findYourPath: 'Encontremos el punto de partida perfecto para tu viaje de sanación',
      questionProgress: 'Pregunta {current} de {total}',
      skipOnboarding: 'Saltar y explorar todos los caminos',
      getStarted: 'Comenzar',
      exploreAllPathways: 'Explorar Todos los Caminos',
    },
    pathways: {
      resilience: {
        title: 'Resistencia',
        subtitle: 'Tu Historia de Fortaleza',
        description: 'Descubre el poder que ya llevas dentro. Este camino te ayuda a reconocer tu resistencia inherente y a construir sobre la fuerza que vive en tus huesos.',
      },
      becoming: {
        title: 'Transformación',
        subtitle: 'Tu Viaje de Evolución',
        description: 'Abraza el arte de la transformación. Este camino te apoya en dejar ir viejas historias y dar paso a la expresión más plena de quien estás destinado a ser.',
      },
      purpose: {
        title: 'Propósito',
        subtitle: 'Tu Búsqueda de Significado',
        description: 'Descubre lo que enciende tu alma. Este camino te ayuda a conectar con tus valores más profundos y encontrar formas de contribuir significativamente al mundo.',
      },
      belonging: {
        title: 'Pertenencia',
        subtitle: 'Tu Círculo de Conexión',
        description: 'Encuentra a tu gente y tu lugar. Este camino se enfoca en entender la conexión auténtica y crear espacios donde puedes ser completamente tú mismo.',
      },
    },
    journal: {
      writeYourTruth: 'Escribe tu verdad aquí...',
      startWriting: 'Comenzar a Escribir',
      saveEntry: 'Guardar Entrada',
      newEntry: 'Nueva Entrada',
      yourEntries: 'Tus Entradas',
      noEntriesYet: 'Aún no hay entradas. Comienza tu viaje de sanación escribiendo tu primera reflexión.',
    },
    community: {
      sharingCircle: 'Círculo de Compartir Anónimo',
      anonymousSpace: 'Un espacio seguro para compartir tu verdad y conectar con otros en viajes similares',
      shareAnonymously: 'Compartir Anónimamente',
      safeSpace: 'Pautas del Espacio Seguro',
      guidelines: 'Todo lo compartido es anónimo. Sé amable, auténtico y respetuoso. Si estás en crisis, por favor contacta al 988 o servicios de emergencia.',
      loadMoreStories: 'Cargar más historias',
    },
    crisis: {
      crisisSupport: 'Apoyo en Crisis',
      immediateHelp: 'Obtener Ayuda Ahora',
      callEmergency: 'Llamar al 911',
      crisisLine: 'Línea de Crisis 988',
      textSupport: 'Envía mensaje HOME al 741741',
      youMatter: 'Importas. No estás solo. La ayuda está disponible 24/7.',
    },
    export: {
      exportJourney: 'Exportar Tu Viaje',
      createPDF: 'Crea un hermoso PDF de tu viaje de sanación y percepciones',
      downloadExport: 'Descargar Exportación PDF',
      privacyNotice: 'Tu typeof window !== 'undefined' && documento exportado contiene información personal. Guárdalo de forma segura y compártelo solo con profesionales de salud de confianza.',
      exportOptions: 'Opciones de Exportación',
    },
    analytics: {
      wellnessInsights: 'Perspectivas de Bienestar',
      progressOverTime: 'Progreso a lo Largo del Tiempo',
      moodTrends: 'Tendencias del Estado de Ánimo',
      growthMetrics: 'Métricas de Crecimiento',
    },
    medical: {
      disclaimer: 'Descargo de Responsabilidad Médica Importante',
      notTherapy: 'ALCHM no es terapia, consejo médico o tratamiento profesional',
      seekProfessionalHelp: 'Por favor consulta a profesionales de salud mental licenciados para tratamiento',
      emergencyServices: 'Llama al 911 para emergencias que amenacen la vida',
    },
    time: {
      today: 'Hoy',
      yesterday: 'Ayer',
      thisWeek: 'Esta semana',
      lastWeek: 'La semana pasada',
      thisMonth: 'Este mes',
      daysAgo: 'hace {count} días',
      hoursAgo: 'hace {count} horas',
      minutesAgo: 'hace {count} minutos',
    },
  },
  
  ar: {
    navigation: {
      home: 'الرئيسية',
      journal: 'المذكرات',
      pathways: 'المسارات',
      community: 'المجتمع',
      dashboard: 'لوحة التحكم',
      export: 'تصدير',
      settings: 'الإعدادات',
    },
    auth: {
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      signOut: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      welcomeBack: 'مرحباً بعودتك',
      createAccount: 'إنشاء حساب',
    },
    onboarding: {
      welcome: 'مرحباً بك في ملاذك الرقمي',
      findYourPath: 'دعنا نجد نقطة البداية المثالية لرحلة شفائك',
      questionProgress: 'السؤال {current} من {total}',
      skipOnboarding: 'تخطي واستكشاف جميع المسارات',
      getStarted: 'ابدأ',
      exploreAllPathways: 'استكشف جميع المسارات',
    },
    pathways: {
      resilience: {
        title: 'المرونة',
        subtitle: 'قصة قوتك',
        description: 'اكتشف القوة التي تحملها بالفعل. يساعدك هذا المسار على التعرف على مرونتك الفطرية والبناء على القوة التي تعيش في عظامك.',
      },
      becoming: {
        title: 'التحول',
        subtitle: 'رحلة تطورك',
        description: 'احتضن فن التحول. يدعمك هذا المسار في التخلي عن القصص القديمة والدخول إلى أكمل تعبير عمن من المفترض أن تكون.',
      },
      purpose: {
        title: 'الهدف',
        subtitle: 'بحثك عن المعنى',
        description: 'اكتشف ما يشعل روحك. يساعدك هذا المسار على الاتصال بقيمك الأعمق وإيجاد طرق للمساهمة بشكل هادف في العالم.',
      },
      belonging: {
        title: 'الانتماء',
        subtitle: 'دائرة اتصالك',
        description: 'ابحث عن شعبك ومكانك. يركز هذا المسار على فهم الاتصال الأصيل وخلق مساحات حيث يمكنك أن تكون نفسك تماماً.',
      },
    },
    journal: {
      writeYourTruth: 'اكتب حقيقتك هنا...',
      startWriting: 'ابدأ الكتابة',
      saveEntry: 'حفظ المدخل',
      newEntry: 'مدخل جديد',
      yourEntries: 'مدخلاتك',
      noEntriesYet: 'لا توجد مدخلات بعد. ابدأ رحلة شفائك بكتابة تأملك الأول.',
    },
    community: {
      sharingCircle: 'دائرة المشاركة المجهولة',
      anonymousSpace: 'مساحة آمنة لمشاركة حقيقتك والتواصل مع آخرين في رحلات مماثلة',
      shareAnonymously: 'شارك بشكل مجهول',
      safeSpace: 'إرشادات المساحة الآمنة',
      guidelines: 'جميع المشاركات مجهولة. كن لطيفاً وأصيلاً ومحترماً. إذا كنت في أزمة، يرجى التواصل مع خدمات الطوارئ.',
      loadMoreStories: 'تحميل المزيد من القصص',
    },
    crisis: {
      crisisSupport: 'دعم الأزمات',
      immediateHelp: 'احصل على المساعدة الآن',
      callEmergency: 'اتصل بالطوارئ',
      crisisLine: 'خط الأزمات',
      textSupport: 'دعم عبر الرسائل النصية',
      youMatter: 'أنت مهم. لست وحدك. المساعدة متاحة على مدار الساعة.',
    },
    export: {
      exportJourney: 'تصدير رحلتك',
      createPDF: 'قم بإنشاء ملف PDF جميل لرحلة شفائك ورؤاك',
      downloadExport: 'تحميل تصدير PDF',
      privacyNotice: 'وثيقتك المصدرة تحتوي على معلومات شخصية. احتفظ بها بأمان واعرضها فقط مع مقدمي الرعاية الصحية الموثوقين.',
      exportOptions: 'خيارات التصدير',
    },
    analytics: {
      wellnessInsights: 'رؤى العافية',
      progressOverTime: 'التقدم مع الوقت',
      moodTrends: 'اتجاهات المزاج',
      growthMetrics: 'مقاييس النمو',
    },
    medical: {
      disclaimer: 'إخلاء المسؤولية الطبية المهم',
      notTherapy: 'ALCHM ليس علاجاً أو نصيحة طبية أو علاجاً مهنياً',
      seekProfessionalHelp: 'يرجى استشارة متخصصين في الصحة النفسية المرخصين للعلاج',
      emergencyServices: 'اتصل بخدمات الطوارئ للحالات المهددة للحياة',
    },
    time: {
      today: 'اليوم',
      yesterday: 'أمس',
      thisWeek: 'هذا الأسبوع',
      lastWeek: 'الأسبوع الماضي',
      thisMonth: 'هذا الشهر',
      daysAgo: 'منذ {count} أيام',
      hoursAgo: 'منذ {count} ساعات',
      minutesAgo: 'منذ {count} دقائق',
    },
  },
  
  zh: {
    navigation: {
      home: '首页',
      journal: '日记',
      pathways: '路径',
      community: '社区',
      dashboard: '控制面板',
      export: '导出',
      settings: '设置',
    },
    auth: {
      signIn: '登录',
      signUp: '注册',
      signOut: '退出',
      email: '电子邮箱',
      password: '密码',
      welcomeBack: '欢迎回来',
      createAccount: '创建账户',
    },
    onboarding: {
      welcome: '欢迎来到您的数字圣所',
      findYourPath: '让我们为您的疗愈之旅找到完美的起点',
      questionProgress: '第{current}个问题，共{total}个',
      skipOnboarding: '跳过并探索所有路径',
      getStarted: '开始',
      exploreAllPathways: '探索所有路径',
    },
    pathways: {
      resilience: {
        title: '韧性',
        subtitle: '您的力量故事',
        description: '发现您已经拥有的力量。这条路径帮助您认识到内在的韧性，并在您骨子里的力量基础上继续建设。',
      },
      becoming: {
        title: '成长',
        subtitle: '您的进化之旅',
        description: '拥抱转变的艺术。这条路径支持您摆脱旧的故事，步入您注定要成为的最完整的自我表达。',
      },
      purpose: {
        title: '目标',
        subtitle: '您的意义探索',
        description: '发现什么点燃了您的灵魂。这条路径帮助您与最深层的价值观连接，找到为世界做出有意义贡献的方式。',
      },
      belonging: {
        title: '归属',
        subtitle: '您的连接圈',
        description: '找到您的人群和位置。这条路径专注于理解真实的连接，创造您可以完全做自己的空间。',
      },
    },
    journal: {
      writeYourTruth: '在这里写下您的真实想法...',
      startWriting: '开始写作',
      saveEntry: '保存条目',
      newEntry: '新条目',
      yourEntries: '您的条目',
      noEntriesYet: '还没有条目。通过写下您的第一个反思开始您的疗愈之旅。',
    },
    community: {
      sharingCircle: '匿名分享圈',
      anonymousSpace: '一个安全的空间，分享您的真实想法并与有类似旅程的其他人连接',
      shareAnonymously: '匿名分享',
      safeSpace: '安全空间指南',
      guidelines: '所有分享都是匿名的。请友善、真实和尊重他人。如果您处于危机中，请联系紧急服务。',
      loadMoreStories: '加载更多故事',
    },
    crisis: {
      crisisSupport: '危机支持',
      immediateHelp: '立即获得帮助',
      callEmergency: '拨打紧急电话',
      crisisLine: '危机热线',
      textSupport: '短信支持',
      youMatter: '您很重要。您并不孤单。24/7都有帮助可用。',
    },
    export: {
      exportJourney: '导出您的旅程',
      createPDF: '创建一个美丽的PDF，记录您的疗愈之旅和洞察',
      downloadExport: '下载PDF导出',
      privacyNotice: '您的导出文档包含个人信息。请安全存储，只与可信的医疗保健提供者分享。',
      exportOptions: '导出选项',
    },
    analytics: {
      wellnessInsights: '健康洞察',
      progressOverTime: '进展随时间变化',
      moodTrends: '情绪趋势',
      growthMetrics: '成长指标',
    },
    medical: {
      disclaimer: '重要医疗免责声明',
      notTherapy: 'ALCHM不是治疗、医疗建议或专业治疗',
      seekProfessionalHelp: '请咨询持牌心理健康专业人士进行治疗',
      emergencyServices: '遇到危及生命的紧急情况请拨打急救电话',
    },
    time: {
      today: '今天',
      yesterday: '昨天',
      thisWeek: '本周',
      lastWeek: '上周',
      thisMonth: '本月',
      daysAgo: '{count}天前',
      hoursAgo: '{count}小时前',
      minutesAgo: '{count}分钟前',
    },
  },
};

export function getTranslation(language: SupportedLanguage): TranslationStrings {
  return translations[language] || translations.en;
}

export function formatTranslation(template: string, values: Record<string, string | number>): string {
  let result = template;
  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return result;
}