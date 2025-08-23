// ALCHM Geo-Linguistic Crisis Support Routing System
// Culturally Sensitive Mental Health Escalation

export interface CrisisLine {
  id: string;
  name: string;
  country: string;
  region: string;
  languages: string[];
  phone: string;
  internationalPhone?: string;
  website?: string;
  textSupport?: string;
  chatSupport?: string;
  availability: string;
  culturalNotes: string;
  specialties?: string[];
}

export interface CrisisResponse {
  userLang: string;
  region: string;
  country: string;
  crisisLine: CrisisLine;
  message: string;
  urgentMessage: string;
  action: 'clickToCall' | 'textMessage' | 'webChat' | 'website';
  secondaryResources: CrisisLine[];
  culturalGuidance: string;
  immediateSteps: string[];
}

export const GLOBAL_CRISIS_LINES: Record<string, CrisisLine[]> = {
  // Latin America
  brazil: [{
    id: 'cvv_brazil',
    name: 'Centro de Valorização da Vida (CVV)',
    country: 'Brazil',
    region: 'Latin America',
    languages: ['pt'],
    phone: '188',
    internationalPhone: '+55-11-3151-2525',
    website: 'https://www.cvv.org.br',
    availability: '24 horas, todos os dias',
    culturalNotes: 'Volunteer-based emotional support with Catholic roots, emphasizes human dignity and community care',
    specialties: ['suicide_prevention', 'emotional_support']
  }],
  
  mexico: [{
    id: 'saptel_mexico',
    name: 'SAPTEL México',
    country: 'Mexico',
    region: 'Latin America', 
    languages: ['es'],
    phone: '5259-8121',
    internationalPhone: '+52-55-5259-8121',
    website: 'https://saptel.org.mx',
    availability: '24 horas',
    culturalNotes: 'Professional psychology services, understands family-centered Mexican culture',
    specialties: ['crisis_intervention', 'family_support']
  }],

  // South Asia
  india: [{
    id: 'icall_india',
    name: 'iCall Psychosocial Helpline',
    country: 'India',
    region: 'South Asia',
    languages: ['hi', 'en', 'mr'],
    phone: '9152987821',
    internationalPhone: '+91-9152987821',
    website: 'https://icallhelpline.org',
    availability: 'Monday-Saturday, 8am-10pm IST',
    culturalNotes: 'Professional counselors trained in Indian cultural context, family dynamics, and spiritual approaches',
    specialties: ['counseling', 'emotional_support', 'family_issues']
  }, {
    id: 'vandrevala_india',
    name: 'Vandrevala Foundation Helpline',
    country: 'India',
    region: 'South Asia',
    languages: ['hi', 'en'],
    phone: '9999666555',
    internationalPhone: '+91-9999666555',
    website: 'https://vandrevalafoundation.com',
    availability: '24 hours',
    culturalNotes: 'Mental health support with understanding of Indian family structures and social pressures',
    specialties: ['mental_health', 'crisis_intervention']
  }],

  // West Africa  
  nigeria: [{
    id: 'mentally_aware_nigeria',
    name: 'Mentally Aware Nigeria Initiative (MANI)',
    country: 'Nigeria',
    region: 'West Africa',
    languages: ['en', 'yo', 'ig', 'ha'],
    phone: '08149155070',
    internationalPhone: '+234-814-915-5070',
    website: 'https://mentallyawareng.com',
    availability: 'Monday-Friday, 9am-5pm WAT',
    culturalNotes: 'Community-based mental health with understanding of traditional healing and spiritual beliefs',
    specialties: ['mental_health_awareness', 'community_support']
  }],

  // East Africa
  kenya: [{
    id: 'befrienders_kenya',
    name: 'Befrienders Kenya',
    country: 'Kenya',
    region: 'East Africa',
    languages: ['en', 'sw'],
    phone: '0722178177',
    internationalPhone: '+254-722-178-177',
    website: 'https://befrienderskenya.org',
    availability: '24 hours',
    culturalNotes: 'Ubuntu-based support emphasizing community care and traditional wisdom',
    specialties: ['suicide_prevention', 'emotional_support']
  }],

  // Middle East
  jordan: [{
    id: 'nsp_jordan',
    name: 'National Suicide Prevention Jordan',
    country: 'Jordan',
    region: 'Middle East',
    languages: ['ar', 'en'],
    phone: '110',
    website: 'https://www.nspj.org',
    availability: '24 hours',
    culturalNotes: 'Islamic-informed counseling respecting cultural and religious values',
    specialties: ['suicide_prevention', 'family_counseling']
  }],

  // Europe
  uk: [{
    id: 'samaritans_uk',
    name: 'Samaritans',
    country: 'United Kingdom',
    region: 'Europe',
    languages: ['en'],
    phone: '116123',
    website: 'https://www.samaritans.org',
    textSupport: '07725909090',
    availability: '24 hours',
    culturalNotes: 'Non-judgmental listening service with multicultural awareness',
    specialties: ['emotional_support', 'suicide_prevention']
  }],

  // North America
  usa: [{
    id: 'suicide_lifeline_usa',
    name: '988 Suicide & Crisis Lifeline',
    country: 'United States',
    region: 'North America',
    languages: ['en', 'es'],
    phone: '988',
    website: 'https://suicidepreventionlifeline.org',
    textSupport: '741741',
    availability: '24 hours',
    culturalNotes: 'Culturally competent counselors available for diverse communities',
    specialties: ['suicide_prevention', 'crisis_intervention']
  }],

  canada: [{
    id: 'talk_suicide_canada',
    name: 'Talk Suicide Canada',
    country: 'Canada', 
    region: 'North America',
    languages: ['en', 'fr'],
    phone: '1-833-456-4566',
    website: 'https://talksuicide.ca',
    availability: '24 hours',
    culturalNotes: 'Bilingual support with Indigenous and multicultural competency',
    specialties: ['suicide_prevention', 'indigenous_support']
  }],

  // East Asia
  china: [{
    id: 'beijing_crisis_china',
    name: 'Beijing Crisis Intervention Hotline',
    country: 'China',
    region: 'East Asia',
    languages: ['zh'],
    phone: '400-161-9995',
    availability: '24 hours',
    culturalNotes: 'Professional mental health support with understanding of Chinese cultural values and family dynamics',
    specialties: ['crisis_intervention', 'mental_health']
  }],

  // Southeast Asia
  philippines: [{
    id: 'ncmh_philippines',
    name: 'NCMH Crisis Hotline',
    country: 'Philippines',
    region: 'Southeast Asia',
    languages: ['en', 'tl'],
    phone: '0917-899-8727',
    internationalPhone: '+63-917-899-8727',
    availability: '24 hours',
    culturalNotes: 'Culturally sensitive support understanding Filipino family values and spiritual beliefs',
    specialties: ['mental_health', 'crisis_intervention']
  }],

  // Oceania
  australia: [{
    id: 'lifeline_australia',
    name: 'Lifeline Australia',
    country: 'Australia',
    region: 'Oceania',
    languages: ['en'],
    phone: '13-11-14',
    website: 'https://www.lifeline.org.au',
    textSupport: '0477-13-11-14',
    chatSupport: 'https://www.lifeline.org.au/crisis-chat',
    availability: '24 hours',
    culturalNotes: 'Aboriginal and Torres Strait Islander cultural competency available',
    specialties: ['crisis_support', 'suicide_prevention', 'indigenous_support']
  }]
};

export const CRISIS_MESSAGES: Record<string, Record<string, any>> = {
  pt: {
    urgent: 'VOCÊ NÃO ESTÁ SOZINHO(A). HELP IS AVAILABLE.',
    message: 'Você não está sozinho(a). Fale com alguém agora que entende e se importa.',
    callToAction: 'Ligue agora para',
    textAction: 'Envie mensagem para',
    webAction: 'Acesse o site',
    immediateSteps: [
      'Respire fundo - você está seguro(a) agora',
      'Ligue para a linha de apoio abaixo',
      'Se estiver em perigo imediato, ligue 192 (SAMU)',
      'Peça ajuda a alguém próximo se possível'
    ],
    culturalGuidance: 'Buscar ajuda é um ato de coragem. Sua família e comunidade se importam com você.'
  },
  
  es: {
    urgent: 'NO ESTÁS SOLO(A). HAY AYUDA DISPONIBLE.',
    message: 'No estás solo(a). Habla con alguien ahora que comprende y se preocupa por ti.',
    callToAction: 'Llama ahora a',
    textAction: 'Envía mensaje a',
    webAction: 'Visita el sitio web',
    immediateSteps: [
      'Respira profundo - estás seguro(a) ahora',
      'Llama a la línea de apoyo abajo',
      'Si estás en peligro inmediato, llama a emergencias',
      'Pide ayuda a alguien cercano si es posible'
    ],
    culturalGuidance: 'Pedir ayuda es un acto de valentía. Tu familia y comunidad te apoyan.'
  },

  en: {
    urgent: 'YOU ARE NOT ALONE. HELP IS AVAILABLE.',
    message: 'You are not alone. Talk to someone now who understands and cares.',
    callToAction: 'Call now',
    textAction: 'Text',
    webAction: 'Visit website',
    immediateSteps: [
      'Take a deep breath - you are safe right now',
      'Call the support line below',
      'If in immediate danger, call emergency services',
      'Reach out to someone nearby if possible'
    ],
    culturalGuidance: 'Seeking help is a sign of strength. You deserve support and care.'
  },

  hi: {
    urgent: 'आप अकेले नहीं हैं। सहायता उपलब्ध है।',
    message: 'आप अकेले नहीं हैं। किसी ऐसे व्यक्ति से बात करें जो समझता है और परवाह करता है।',
    callToAction: 'अभी कॉल करें',
    textAction: 'संदेश भेजें',
    webAction: 'वेबसाइट पर जाएं',
    immediateSteps: [
      'गहरी सांस लें - आप अभी सुरक्षित हैं',
      'नीचे दी गई सहायता लाइन पर कॉल करें',
      'तत्काल खतरे में होने पर आपातकालीन सेवाओं को कॉल करें',
      'यदि संभव हो तो किसी नजदीकी व्यक्ति से संपर्क करें'
    ],
    culturalGuidance: 'मदद मांगना साहस का संकेत है। आपका परिवार और समुदाय आपकी परवाह करता है।'
  },

  ar: {
    urgent: 'أنت لست وحيداً. المساعدة متوفرة.',
    message: 'أنت لست وحيداً. تحدث مع شخص يفهمك ويهتم بك.',
    callToAction: 'اتصل الآن بـ',
    textAction: 'أرسل رسالة إلى',
    webAction: 'زر الموقع',
    immediateSteps: [
      'خذ نفساً عميقاً - أنت في أمان الآن',
      'اتصل بخط الدعم أدناه',
      'في حالة الخطر الفوري، اتصل بخدمات الطوارئ',
      'اطلب المساعدة من شخص قريب إن أمكن'
    ],
    culturalGuidance: 'طلب المساعدة علامة على القوة. أسرتك ومجتمعك يهتمون بك.'
  },

  sw: {
    urgent: 'HUKO PEKE YAKO. MSAADA UNAPATIKANA.',
    message: 'Huko peke yako. Zungumza na mtu anayeelewa na anayejali.',
    callToAction: 'Piga simu sasa',
    textAction: 'Tuma ujumbe',
    webAction: 'Tembelea tovuti',
    immediateSteps: [
      'Pumua kwa kina - uko salama sasa',
      'Piga simu ya msaada hapo chini',
      'Kama uko hatarini moja kwa moja, piga huduma za dharura',
      'Omba msaada kwa mtu aliye karibu kama inawezekana'
    ],
    culturalGuidance: 'Kutafuta msaada ni dalili ya ujasiri. Jamii yako inakujali.'
  },

  fr: {
    urgent: 'VOUS N\'ÊTES PAS SEUL(E). DE L\'AIDE EST DISPONIBLE.',
    message: 'Vous n\'êtes pas seul(e). Parlez à quelqu\'un qui comprend et se soucie de vous.',
    callToAction: 'Appelez maintenant',
    textAction: 'Envoyez un message',
    webAction: 'Visitez le site web',
    immediateSteps: [
      'Respirez profondément - vous êtes en sécurité maintenant',
      'Appelez la ligne de soutien ci-dessous',
      'En cas de danger immédiat, appelez les services d\'urgence',
      'Demandez de l\'aide à quelqu\'un de proche si possible'
    ],
    culturalGuidance: 'Demander de l\'aide est un acte de courage. Votre communauté se soucie de vous.'
  },

  zh: {
    urgent: '你并不孤单。帮助就在身边。',
    message: '你并不孤单。与理解并关心你的人交谈。',
    callToAction: '立即致电',
    textAction: '发送消息',
    webAction: '访问网站',
    immediateSteps: [
      '深呼吸 - 你现在是安全的',
      '拨打下面的支持热线',
      '如果有即时危险，请拨打急救服务',
      '如果可能，向附近的人求助'
    ],
    culturalGuidance: '寻求帮助是勇气的表现。你的家人和社区关心你。'
  }
};

export class GeoLinguisticCrisisRouter {
  
  async detectUserLocation(ip?: string): Promise<{ country: string; region: string; languages: string[] }> {
    // In production, use IP geolocation service like MaxMind or ipapi
    // For demo purposes, returning sample data
    if (ip?.includes('192.168') || ip?.includes('127.0.0.1')) {
      return { country: 'usa', region: 'North America', languages: ['en'] };
    }
    
    // Placeholder for actual IP geolocation
    return { country: 'usa', region: 'North America', languages: ['en'] };
  }

  detectUserLanguage(acceptLanguage?: string, userLocale?: string): string {
    // Priority: userLocale > accept-language header > fallback to 'en'
    if (userLocale && this.isSupportedLanguage(userLocale)) {
      return userLocale;
    }

    if (acceptLanguage) {
      const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().toLowerCase());
      
      for (const lang of languages) {
        if (this.isSupportedLanguage(lang)) {
          return lang;
        }
        // Check for base language (e.g., 'en' from 'en-US')
        const baseLang = lang.split('-')[0];
        if (this.isSupportedLanguage(baseLang)) {
          return baseLang;
        }
      }
    }

    return 'en'; // fallback
  }

  private isSupportedLanguage(lang: string): boolean {
    return Object.keys(CRISIS_MESSAGES).includes(lang);
  }

  getCrisisLinesForCountry(country: string): CrisisLine[] {
    return GLOBAL_CRISIS_LINES[country.toLowerCase()] || [];
  }

  findBestCrisisLine(country: string, language: string): CrisisLine | null {
    const lines = this.getCrisisLinesForCountry(country);
    
    // Find line that supports user's language
    const languageMatch = lines.find(line => line.languages.includes(language));
    if (languageMatch) return languageMatch;

    // Fallback to English if available
    const englishMatch = lines.find(line => line.languages.includes('en'));
    if (englishMatch) return englishMatch;

    // Return first available line
    return lines[0] || null;
  }

  generateCrisisResponse(
    country: string, 
    language: string, 
    userIP?: string,
    acceptLanguage?: string
  ): CrisisResponse | null {
    const detectedLang = this.detectUserLanguage(acceptLanguage, language);
    const crisisLine = this.findBestCrisisLine(country, detectedLang);
    
    if (!crisisLine) return null;

    const messages = CRISIS_MESSAGES[detectedLang] || CRISIS_MESSAGES['en'];
    const allLines = this.getCrisisLinesForCountry(country);
    const secondaryResources = allLines.filter(line => line.id !== crisisLine.id);

    // Determine best action method
    let action: 'clickToCall' | 'textMessage' | 'webChat' | 'website' = 'clickToCall';
    if (crisisLine.chatSupport) action = 'webChat';
    else if (crisisLine.textSupport) action = 'textMessage';
    else if (crisisLine.website) action = 'website';

    const response: CrisisResponse = {
      userLang: detectedLang,
      region: crisisLine.region,
      country: crisisLine.country,
      crisisLine,
      message: messages.message,
      urgentMessage: messages.urgent,
      action,
      secondaryResources,
      culturalGuidance: messages.culturalGuidance,
      immediateSteps: messages.immediateSteps
    };

    return response;
  }

  generateClickToCallUrl(phone: string, country: string): string {
    // Format phone number for tel: links
    let formattedPhone = phone.replace(/[\s-()]/g, '');
    
    // Add country code if not present for international dialing
    if (!formattedPhone.startsWith('+')) {
      const countryCodes: Record<string, string> = {
        'usa': '+1',
        'canada': '+1', 
        'brazil': '+55',
        'mexico': '+52',
        'uk': '+44',
        'india': '+91',
        'nigeria': '+234',
        'kenya': '+254',
        'jordan': '+962',
        'china': '+86',
        'philippines': '+63',
        'australia': '+61'
      };
      
      const countryCode = countryCodes[country.toLowerCase()];
      if (countryCode) {
        formattedPhone = countryCode + formattedPhone;
      }
    }

    return `tel:${formattedPhone}`;
  }

  // Crisis escalation detection
  detectCrisisKeywords(text: string, language: string): boolean {
    const crisisKeywords: Record<string, string[]> = {
      en: ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself', 'die', 'hopeless'],
      es: ['suicidio', 'matarme', 'terminar todo', 'no vale la pena vivir', 'hacerme daño', 'morir', 'sin esperanza'],
      pt: ['suicídio', 'me matar', 'acabar com tudo', 'não vale a pena viver', 'me machucar', 'morrer', 'sem esperança'],
      hi: ['आत्महत्या', 'खुद को मारना', 'सब कुछ खत्म', 'जीने लायक नहीं', 'खुद को नुकसान', 'मरना', 'निराशा'],
      ar: ['انتحار', 'قتل نفسي', 'إنهاء كل شيء', 'لا يستحق العيش', 'إيذاء نفسي', 'موت', 'يائس'],
      sw: ['kujiua', 'kujiua mwenyewe', 'kumaliza yote', 'haistahili kuishi', 'kujidhuru', 'kufa', 'bila matumaini'],
      fr: ['suicide', 'me tuer', 'tout finir', 'ne vaut pas la peine de vivre', 'me faire mal', 'mourir', 'sans espoir'],
      zh: ['自杀', '杀死自己', '结束一切', '不值得活着', '伤害自己', '死', '绝望']
    };

    const keywords = crisisKeywords[language] || crisisKeywords['en'];
    const lowerText = text.toLowerCase();
    
    return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  }
}