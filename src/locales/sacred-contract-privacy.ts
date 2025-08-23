// ALCHM Sacred Contract Privacy Copy
// Multinational Privacy & Ethics - Culturally Sensitive Legal Compliance

export interface SacredContractPrivacy {
  locale: string;
  country: string;
  legalFramework: string;
  sacredContract: {
    title: string;
    primaryText: string;
    dataProtection: string;
    aiPurpose: string;
    userRights: string;
    culturalRespect: string;
  };
  legalFootnotes: {
    compliance: string;
    rights: string;
    contact: string;
  };
  culturalNotes: string;
}

export const SACRED_CONTRACT_PRIVACY: Record<string, SacredContractPrivacy> = {
  // French (Senegal) - GDPR Aligned
  'fr-sn': {
    locale: 'fr-sn',
    country: 'Senegal',
    legalFramework: 'GDPR + Senegal Data Protection Law',
    sacredContract: {
      title: 'Contrat Sacré de Confidentialité',
      primaryText: 'Vos réflexions spirituelles demeurent dans l\'intimité de votre âme. Nous protégeons vos confidences avec un chiffrement sacré et utilisons l\'intelligence artificielle uniquement pour accompagner votre épanouissement spirituel—jamais pour commercialiser ou exposer vos secrets¹.',
      dataProtection: 'Votre histoire personnelle est sacrée. Nous gardons vos paroles comme un griot garde les récits ancestraux—avec respect, protection et honneur².',
      aiPurpose: 'Notre intelligence artificielle agit comme un sage compagnon, offrant guidance et réflexion pour nourrir votre croissance intérieure, en respectant les traditions de sagesse communautaire³.',
      userRights: 'Vous conservez un contrôle total sur vos confidences spirituelles. Vous pouvez consulter, modifier ou effacer vos réflexions à tout moment, comme un droit sacré⁴.',
      culturalRespect: 'Nous honorons la tradition sénégalaise de teranga (hospitalité) et respectons vos croyances spirituelles, qu\'elles soient islamiques, chrétiennes ou issues des traditions ancestrales.'
    },
    legalFootnotes: {
      compliance: '¹ Conforme au RGPD (UE) 2016/679 et à la Loi sénégalaise sur la protection des données personnelles n°2008-12',
      rights: '² Droits RGPD: accès (Art. 15), rectification (Art. 16), effacement (Art. 17), portabilité (Art. 20)',
      contact: '³ Délégué à la Protection des Données: privacy@alchm.app | Commission de Protection des Données Personnelles (CDP) du Sénégal'
    },
    culturalNotes: 'Emphasizes teranga (Senegalese hospitality), griot tradition of sacred storytelling, and multi-religious respect (Islam/Christianity/Traditional)'
  },

  // Hindi (India) - Personal Data Protection Bill Aligned  
  'hi-in': {
    locale: 'hi-in',
    country: 'India',
    legalFramework: 'Digital Personal Data Protection Act 2023',
    sacredContract: {
      title: 'पवित्र गोपनीयता संधि',
      primaryText: 'आपके आत्मिक विचार और भावनाएं पूर्णतः गुप्त हैं। हम आपके मन की बातों को एन्क्रिप्शन द्वारा सुरक्षित रखते हैं और कृत्रिम बुद्धिमत्ता का उपयोग केवल आपके आध्यात्मिक विकास में सहायता के लिए करते हैं—आपकी व्यक्तिगत जानकारी को बेचने या गलत उपयोग के लिए नहीं¹।',
      dataProtection: 'आपकी जीवन कथा पवित्र है। हम आपके विचारों को उसी तरह संरक्षित रखते हैं जैसे एक मंदिर में पवित्र ग्रंथ सुरक्षित रखे जाते हैं²।',
      aiPurpose: 'हमारी कृत्रिम बुद्धिमत्ता एक आध्यात्मिक गुरु की भांति कार्य करती है, जो आपके अंतर्मन की यात्रा में मार्गदर्शन प्रदान करती है, धर्म और अध्यात्म की परंपराओं के अनुसार³।',
      userRights: 'आपको अपने आध्यात्मिक विचारों पर पूर्ण नियंत्रण है। आप अपने चिंतन को देख सकते हैं, सुधार सकते हैं या मिटा सकते हैं—यह आपका मौलिक अधिकार है⁴।',
      culturalRespect: 'हम भारतीय संस्कृति के "वसुधैव कुटुम्बकम्" (सारा विश्व एक परिवार है) के सिद्धांत को मानते हैं और सभी धर्मों—हिंदू, इस्लाम, सिख, ईसाई, बौद्ध, जैन—का समान सम्मान करते हैं।'
    },
    legalFootnotes: {
      compliance: '¹ डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 और सूचना प्रौद्योगिकी अधिनियम 2000 के अनुपालन में',
      rights: '² व्यक्तिगत डेटा अधिकार: पहुंच, सुधार, मिटाना, पोर्टेबिलिटी (धारा 11-14)',
      contact: '³ डेटा सुरक्षा अधिकारी: privacy@alchm.app | डेटा संरक्षण बोर्ड ऑफ इंडिया'
    },
    culturalNotes: 'References Vasudhaiva Kutumbakam (world as family), guru-disciple tradition, temple sanctity, and multi-religious harmony (Hindu/Islam/Sikh/Christian/Buddhist/Jain)'
  },

  // Arabic (Egypt) - GDPR + Egyptian Law Aligned
  'ar-eg': {
    locale: 'ar-eg',
    country: 'Egypt',
    legalFramework: 'GDPR + Egyptian Data Protection Law',
    sacredContract: {
      title: 'العهد المقدس للخصوصية',
      primaryText: 'تأملاتك الروحية محفوظة في أمان تام. نحن نحمي أسرار قلبك بالتشفير المقدس ونستخدم الذكاء الاصطناعي فقط لدعم نموك الروحي—وليس لبيع أو استغلال بياناتك الشخصية¹.',
      dataProtection: 'حكايتك الشخصية مقدسة عندنا. نحافظ على كلماتك كما يُحافظ على المخطوطات النفيسة في مكتبة الإسكندرية—بأمانة وتقديس واحترام².',
      aiPurpose: 'ذكاؤنا الاصطناعي يعمل مثل المرشد الروحي الحكيم، يقدم التوجيه والبصيرة لتغذية رحلتك الداخلية، مع احترام تعاليم الحكمة الإسلامية والمسيحية³.',
      userRights: 'تحتفظ بالسيطرة الكاملة على أسرارك الروحية. يمكنك الاطلاع على تأملاتك أو تعديلها أو حذفها في أي وقت—هذا حق مقدس لك⁴.',
      culturalRespect: 'نكرم التراث المصري العريق ونحترم معتقداتك الروحية، سواء كانت إسلامية أو مسيحية، ونقدر قيم الكرم والضيافة المصرية الأصيلة.'
    },
    legalFootnotes: {
      compliance: '¹ متوافق مع اللائحة العامة لحماية البيانات الأوروبية (GDPR) وقانون حماية البيانات المصري',
      rights: '² حقوق حماية البيانات: الوصول، التصحيح، المحو، قابلية النقل (المواد 15-20)',
      contact: '³ مسؤول حماية البيانات: privacy@alchm.app | جهاز حماية البيانات الشخصية المصري'
    },
    culturalNotes: 'References Library of Alexandria (knowledge preservation), Islamic and Christian spirituality, Egyptian hospitality values, and spiritual guidance traditions'
  },

  // Portuguese (Brazil) - LGPD Aligned
  'pt-br': {
    locale: 'pt-br',
    country: 'Brazil',
    legalFramework: 'Lei Geral de Proteção de Dados (LGPD)',
    sacredContract: {
      title: 'Contrato Sagrado de Privacidade',
      primaryText: 'Suas reflexões espirituais permanecem em total privacidade. Protegemos seus sentimentos íntimos com criptografia sagrada e usamos inteligência artificial apenas para apoiar seu crescimento espiritual—nunca para vender ou explorar seus dados pessoais¹.',
      dataProtection: 'Sua história de vida é sagrada para nós. Guardamos suas palavras como os guardiões das tradições ancestrais protegem os segredos da floresta—com respeito, proteção e reverência².',
      aiPurpose: 'Nossa inteligência artificial atua como um guia espiritual sábio, oferecendo orientação e insights para nutrir sua jornada interior, respeitando as tradições de cura e axé afro-brasileiras³.',
      userRights: 'Você mantém controle total sobre suas confidências espirituais. Pode acessar, corrigir ou apagar suas reflexões a qualquer momento—este é seu direito sagrado e fundamental⁴.',
      culturalRespect: 'Honramos a diversidade espiritual brasileira e respeitamos suas crenças, sejam católicas, evangélicas, espíritas, afro-brasileiras (Candomblé, Umbanda) ou indígenas, celebrando nossa rica herança multicultural.'
    },
    legalFootnotes: {
      compliance: '¹ Em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018',
      rights: '² Direitos do titular: acesso (Art. 18), correção, eliminação, portabilidade conforme LGPD',
      contact: '³ Encarregado de Proteção de Dados: privacy@alchm.app | Autoridade Nacional de Proteção de Dados (ANPD)'
    },
    culturalNotes: 'References Afro-Brazilian spiritual traditions (axé, Candomblé, Umbanda), indigenous wisdom, forest guardianship, and Brazilian multicultural religious diversity'
  }
};

// Utility functions for Sacred Contract Privacy
export function getSacredContractPrivacy(locale: string, country?: string): SacredContractPrivacy | null {
  const key = country ? `${locale}-${country.toLowerCase()}` : locale;
  return SACRED_CONTRACT_PRIVACY[key] || null;
}

export function getAllSacredContracts(): SacredContractPrivacy[] {
  return Object.values(SACRED_CONTRACT_PRIVACY);
}

export function generatePrivacyNotice(locale: string, country?: string): string {
  const contract = getSacredContractPrivacy(locale, country);
  if (!contract) return '';

  return `
${contract.sacredContract.title}

${contract.sacredContract.primaryText}

${contract.sacredContract.dataProtection}

${contract.sacredContract.aiPurpose}

${contract.sacredContract.userRights}

${contract.sacredContract.culturalRespect}

---
${contract.legalFootnotes.compliance}
${contract.legalFootnotes.rights}
${contract.legalFootnotes.contact}
`;
}

export interface PrivacyComplianceConfig {
  gdprRequired: boolean;
  lgpdRequired: boolean;
  pdpRequired: boolean;
  cookieConsent: boolean;
  rightToForgotten: boolean;
  dataPortability: boolean;
  explicitConsent: boolean;
}

export function getComplianceRequirements(country: string): PrivacyComplianceConfig {
  const requirements: Record<string, PrivacyComplianceConfig> = {
    // European countries + those with GDPR adequacy decisions
    'senegal': {
      gdprRequired: true,
      lgpdRequired: false, 
      pdpRequired: false,
      cookieConsent: true,
      rightToForgotten: true,
      dataPortability: true,
      explicitConsent: true
    },
    'egypt': {
      gdprRequired: true,
      lgpdRequired: false,
      pdpRequired: false, 
      cookieConsent: true,
      rightToForgotten: true,
      dataPortability: true,
      explicitConsent: true
    },
    'brazil': {
      gdprRequired: false,
      lgpdRequired: true,
      pdpRequired: false,
      cookieConsent: true,
      rightToForgotten: true,
      dataPortability: true,
      explicitConsent: true
    },
    'india': {
      gdprRequired: false,
      lgpdRequired: false,
      pdpRequired: true,
      cookieConsent: true,
      rightToForgotten: true,
      dataPortability: true,
      explicitConsent: true
    }
  };

  return requirements[country.toLowerCase()] || {
    gdprRequired: false,
    lgpdRequired: false,
    pdpRequired: false,
    cookieConsent: true,
    rightToForgotten: false,
    dataPortability: false,
    explicitConsent: true
  };
}