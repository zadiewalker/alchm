/**
 * ALCHM Crisis Detection API - Life Safety Critical System
 * Real-time crisis detection with cultural competency and privacy preservation
 * 
 * CRITICAL: This endpoint can save lives - security, reliability, and cultural sensitivity are paramount
 * NO user content is stored, only anonymized crisis detection metrics for safety monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerConfig } from '@/lib/config';

// Types for crisis detection
interface CrisisAnalysis {
  crisisDetected: boolean;
  severity: 'none' | 'low' | 'medium' | 'high' | 'immediate';
  indicators: string[];
  urgency: 'none' | 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  culturalContext?: string[];
}

interface CrisisResource {
  name: string;
  contact: string;
  type: 'phone' | 'text' | 'web' | 'app';
  country: string;
  description: string;
  languages?: string[];
  culturalFocus?: string[];
  available24h?: boolean;
}

interface EmergencyContact {
  name: string;
  number: string;
  country: string;
  type: 'emergency' | 'crisis' | 'mental_health';
}

// Multilingual immediate crisis patterns with cultural considerations
const IMMEDIATE_CRISIS_PATTERNS = {
  // English - Including LGBTQ+, racial, and economic crisis expressions
  en: [
    'want to die', 'kill myself', 'end it all', 'suicide', 'can\'t go on',
    'better off dead', 'no point living', 'ending my life', 'not worth living',
    'don\'t want to be here', 'want to disappear', 'can\'t take anymore',
    'world would be better without me', 'nobody would miss me', 'tired of fighting',
    'ready to give up', 'can\'t handle this pain', 'want the pain to stop',
    // LGBTQ+ specific crisis language
    'can\'t live like this anymore', 'hate who i am', 'world won\'t accept me',
    'family disowned me', 'nowhere safe for me', 'tired of hiding',
    // Economic/social justice crisis language
    'can\'t afford to live', 'system is against me', 'no hope for people like me',
    'will never escape poverty', 'society wants me gone'
  ],
  
  // Spanish - Including cultural and immigration-specific crisis expressions
  es: [
    'quiero morir', 'matarme', 'suicidio', 'terminar con todo', 'no puedo más',
    'mejor muerto', 'no vale la pena vivir', 'acabar con mi vida',
    'no quiero estar aquí', 'quiero desaparecer', 'ya no aguanto',
    'el mundo estaría mejor sin mí', 'nadie me extrañaría', 'cansado de luchar',
    'listo para rendirme', 'no puedo con este dolor', 'quiero que pare el dolor',
    // Immigration and cultural crisis language
    'no pertenezco aquí', 'mi familia me rechaza', 'no hay lugar para mí',
    'deportarán a mi familia', 'sin papeles no tengo futuro', 'perdí mi identidad',
    'entre dos mundos', 'ni de aquí ni de allá'
  ],
  
  // Portuguese - Including Brazilian cultural expressions
  pt: [
    'quero morrer', 'me matar', 'suicídio', 'acabar com tudo', 'não aguento mais',
    'melhor morto', 'não vale a pena viver', 'acabar com minha vida',
    'não quero estar aqui', 'quero desaparecer', 'não consigo mais',
    'mundo seria melhor sem mim', 'ninguém sentiria minha falta', 'cansado de lutar',
    'pronto para desistir', 'não consigo com essa dor', 'quero que a dor pare',
    // Brazilian cultural crisis expressions
    'família me rejeitou', 'sociedade me exclui', 'sem lugar no mundo',
    'violência não para', 'sem esperança no brasil', 'sistema me esqueceu'
  ],
  
  // Korean - Including cultural shame and academic pressure expressions
  ko: [
    '죽고 싶어', '자살', '끝내고 싶어', '더 이상 못하겠어', '살 이유가 없어',
    '죽는 게 나아', '살 가치가 없어', '내 인생 끝내고 싶어',
    '여기 있고 싶지 않아', '사라지고 싶어', '더 이상 견딜 수 없어',
    '나 없어도 세상은 더 좋을 거야', '아무도 나를 그리워하지 않을 거야',
    // Cultural and academic pressure crisis expressions
    '가족에게 부끄러움', '실패자야', '기대에 못 미쳐', '명예를 더럽혔어',
    '부모님께 죄송해', '사회에서 밀려나', '경쟁에서 뒤처져'
  ],
  
  // Hindi - Including cultural and social pressure expressions
  hi: [
    'मरना चाहता हूं', 'आत्महत्या', 'सब कुछ खत्म करना', 'और नहीं सह सकता',
    'जीने का कोई मतलब नहीं', 'मरना बेहतर है', 'जीने लायक नहीं',
    'यहां नहीं रहना चाहता', 'गायब हो जाना चाहता हूं', 'और बर्दाश्त नहीं कर सकता',
    // Cultural and social crisis expressions
    'परिवार की इज्जत गई', 'समाज में जगह नहीं', 'शर्म की वजह से',
    'जाति के कारण भेदभाव', 'दहेज की समस्या', 'इज्जत बचाने के लिए'
  ],
  
  // German - Including cultural and economic expressions
  de: [
    'sterben wollen', 'selbstmord', 'umbringen', 'nicht mehr leben wollen',
    'besser tot', 'leben hat keinen sinn', 'mein leben beenden',
    'will nicht hier sein', 'verschwinden wollen', 'kann nicht mehr',
    'welt wäre besser ohne mich', 'niemand würde mich vermissen',
    // German cultural crisis expressions
    'gesellschaft akzeptiert mich nicht', 'integration gescheitert',
    'arbeitslos und hoffnungslos', 'schulden erdrücken mich'
  ]
};

// Cultural competency patterns for context-aware detection
const CULTURAL_CRISIS_INDICATORS = {
  lgbtq: ['conversion therapy', 'pray the gay away', 'family rejected me', 'kicked out for being', 'transition denied'],
  immigrant: ['deportation', 'undocumented', 'visa expired', 'homeland war', 'family separated'],
  economic: ['eviction notice', 'can\'t afford food', 'medical bills', 'homeless soon', 'job rejection'],
  racial: ['police brutality', 'hate crime', 'racial profiling', 'workplace discrimination', 'systemic racism'],
  religious: ['lost faith', 'religious trauma', 'community shunned', 'blasphemy guilt', 'spiritual crisis']
};

// Initialize OpenAI with secure configuration
function getOpenAIInstance(): OpenAI {
  try {
    const serverConfig = getServerConfig();
    return new OpenAI({
      apiKey: serverConfig.ai.openaiApiKey,
      ...(serverConfig.ai.openaiProjectId && { 
        project: serverConfig.ai.openaiProjectId 
      }),
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    throw new Error('Crisis detection service configuration error');
  }
}

// Detect language of input text
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Korean detection (Hangul characters)
  if (/[\u3131-\u3163\uac00-\ud7a3]/.test(text)) return 'ko';
  
  // Hindi detection (Devanagari script)
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  
  // Spanish detection (common Spanish words and patterns)
  if (/\b(yo|mi|que|de|la|el|en|es|se|no|te|lo|le|da|su|por|son|con|para|una|sobre|todo|ser|tener|ir|estar|hacer|poder|decir|este|ese|aquel|muy|más|pero|si|cuando|donde|como|porque|aunque)\b/.test(lowerText)) return 'es';
  
  // Portuguese detection (distinguishing from Spanish)
  if (/\b(eu|meu|que|de|da|do|em|é|se|não|te|lhe|sua|por|são|com|para|uma|sobre|tudo|ser|ter|ir|estar|fazer|poder|dizer|este|esse|aquele|muito|mais|mas|se|quando|onde|como|porque|embora|ão|ões)\b/.test(lowerText)) return 'pt';
  
  // German detection
  if (/\b(ich|mein|dass|von|der|die|das|in|ist|sich|nicht|du|ihm|ihre|für|sind|mit|zu|eine|über|alles|sein|haben|gehen|werden|machen|können|sagen|dieser|diese|dieses|sehr|mehr|aber|wenn|wo|wie|weil|obwohl)\b/.test(lowerText)) return 'de';
  
  // Default to English
  return 'en';
}

// Check for immediate crisis patterns
function checkImmediateCrisis(text: string): { detected: boolean; language: string; culturalContext: string[] } {
  const language = detectLanguage(text);
  const lowerText = text.toLowerCase();
  
  // Check language-specific patterns
  const patterns = IMMEDIATE_CRISIS_PATTERNS[language as keyof typeof IMMEDIATE_CRISIS_PATTERNS] || IMMEDIATE_CRISIS_PATTERNS.en;
  const immediateRisk = patterns.some(pattern => lowerText.includes(pattern.toLowerCase()));
  
  // Check cultural context indicators
  const culturalContext: string[] = [];
  Object.entries(CULTURAL_CRISIS_INDICATORS).forEach(([context, indicators]) => {
    if (indicators.some(indicator => lowerText.includes(indicator.toLowerCase()))) {
      culturalContext.push(context);
    }
  });
  
  return {
    detected: immediateRisk,
    language,
    culturalContext
  };
}

// Get culturally appropriate crisis resources
function getCrisisResources(culturalContext: string[] = [], language: string = 'en'): CrisisResource[] {
  const baseResources: CrisisResource[] = [
    {
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      type: 'phone',
      country: 'US',
      description: '24/7 crisis support and suicide prevention',
      languages: ['en', 'es'],
      available24h: true
    },
    {
      name: 'Crisis Text Line',
      contact: '741741',
      type: 'text',
      country: 'US',
      description: 'Text HOME to 741741 for 24/7 crisis support',
      languages: ['en', 'es'],
      available24h: true
    },
    {
      name: 'International Crisis Lines',
      contact: 'https://findahelpline.com',
      type: 'web',
      country: 'Global',
      description: 'Find crisis support in your country',
      languages: ['en', 'es', 'pt', 'ko', 'hi', 'de'],
      available24h: true
    }
  ];

  // Add culturally specific resources
  const culturalResources: CrisisResource[] = [];
  
  if (culturalContext.includes('lgbtq')) {
    culturalResources.push(
      {
        name: 'Trevor Project',
        contact: '1-866-488-7386',
        type: 'phone',
        country: 'US',
        description: '24/7 crisis support for LGBTQ youth',
        culturalFocus: ['lgbtq', 'youth'],
        available24h: true
      },
      {
        name: 'Trans Lifeline',
        contact: '877-565-8860',
        type: 'phone',
        country: 'US',
        description: 'Crisis support for transgender individuals',
        culturalFocus: ['transgender'],
        available24h: true
      }
    );
  }
  
  if (culturalContext.includes('immigrant')) {
    culturalResources.push({
      name: 'SAMHSA National Helpline',
      contact: '1-800-662-4357',
      type: 'phone',
      country: 'US',
      description: 'Mental health support regardless of immigration status',
      culturalFocus: ['immigrant', 'undocumented'],
      languages: ['en', 'es'],
      available24h: true
    });
  }

  // Language-specific resources
  if (language === 'es') {
    culturalResources.push({
      name: 'Línea Nacional de Prevención del Suicidio',
      contact: '988',
      type: 'phone',
      country: 'US',
      description: 'Apoyo en crisis las 24 horas en español',
      languages: ['es'],
      available24h: true
    });
  }

  return [...baseResources, ...culturalResources];
}

// Get emergency contacts
function getEmergencyContacts(): EmergencyContact[] {
  return [
    {
      name: 'Emergency Services (US)',
      number: '911',
      country: 'US',
      type: 'emergency'
    },
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      country: 'US',
      type: 'crisis'
    },
    {
      name: 'Emergency Services (International)',
      number: '112',
      country: 'International',
      type: 'emergency'
    }
  ];
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { text, userId, userLanguage } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required for crisis detection' },
        { status: 400 }
      );
    }

    // Immediate crisis check with cultural context
    const immediateCheck = checkImmediateCrisis(text);
    
    if (immediateCheck.detected) {
      const resources = getCrisisResources(immediateCheck.culturalContext, immediateCheck.language);
      const interventions = [
        'Immediate professional support is available',
        'You are not alone in this struggle',
        'Crisis counselors are standing by to help',
        'Your life has value and meaning'
      ];

      // Add culturally sensitive interventions
      if (immediateCheck.culturalContext.includes('lgbtq')) {
        interventions.push('LGBTQ-affirming crisis support is available');
      }
      if (immediateCheck.culturalContext.includes('immigrant')) {
        interventions.push('Immigration status-safe mental health support exists');
      }

      return NextResponse.json({
        crisisDetected: true,
        severity: 'immediate' as const,
        resources,
        interventions,
        culturalConsiderations: immediateCheck.culturalContext,
        emergencyContacts: getEmergencyContacts(),
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    }

    // AI-powered analysis for subtle crisis indicators
    const openai = getOpenAIInstance();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast, cost-effective for crisis detection
      messages: [
        {
          role: "system",
          content: `You are a culturally competent crisis detection system for a trauma-informed mental health app. 

Analyze text for signs of:
- Suicidal ideation or self-harm thoughts
- Severe depression or hopelessness  
- Immediate danger to self or others
- Active crisis states requiring intervention
- Cultural or identity-based distress (LGBTQ+, immigrant, racial, economic)

Consider cultural context and avoid pathologizing normal cultural expressions of distress.

Respond ONLY with a JSON object:
{
  "crisisDetected": boolean,
  "severity": "none" | "low" | "medium" | "high" | "immediate", 
  "confidence": "low" | "medium" | "high",
  "indicators": ["specific crisis indicators found"],
  "urgency": "none" | "low" | "medium" | "high",
  "culturalContext": ["relevant cultural factors"],
  "recommendedResponse": "immediate" | "supportive" | "monitoring" | "none"
}

Be sensitive but thorough. False positives are preferable to missed crises.
Prioritize user safety above all other considerations.`
        },
        {
          role: "user",
          content: text.substring(0, 1500) // Limit for privacy and processing efficiency
        }
      ],
      temperature: 0, // Deterministic for consistency
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });

    const analysis: CrisisAnalysis = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    // Generate response based on analysis
    const resources = analysis.crisisDetected ? 
      getCrisisResources(analysis.culturalContext, immediateCheck.language) : [];
    
    const interventions: string[] = [];
    if (analysis.crisisDetected) {
      switch (analysis.severity) {
        case 'high':
        case 'immediate':
          interventions.push(
            'We care about you and want you to be safe',
            'Professional crisis support is available right now',
            'You deserve compassionate, immediate help'
          );
          break;
        case 'medium':
          interventions.push(
            'Your feelings are valid and you deserve support',
            'Mental health resources are here when you need them',
            'Consider reaching out to a trusted friend or counselor'
          );
          break;
        case 'low':
          interventions.push(
            'Thank you for sharing your feelings',
            'Self-care and support resources are available',
            'Your wellbeing matters'
          );
          break;
      }
    }

    // Log crisis detection (NO user content) for safety monitoring
    if (analysis.crisisDetected) {
      console.log('Crisis detected:', {
        userId: userId ? 'user-present' : 'anonymous',
        severity: analysis.severity,
        confidence: analysis.confidence,
        urgency: analysis.urgency,
        culturalContext: analysis.culturalContext,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        // NO TEXT CONTENT LOGGED FOR PRIVACY
      });
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      crisisDetected: analysis.crisisDetected || false,
      severity: analysis.severity || 'none',
      resources,
      interventions,
      culturalConsiderations: analysis.culturalContext || [],
      emergencyContacts: analysis.crisisDetected ? getEmergencyContacts() : [],
      confidence: analysis.confidence || 'low',
      urgency: analysis.urgency || 'none',
      responseTime,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Crisis detection error:', error);
    
    // FAIL SAFE: When in doubt, assume crisis for user safety
    return NextResponse.json({
      crisisDetected: true,
      severity: 'high' as const,
      resources: getCrisisResources(),
      interventions: [
        'We care about you and want you to be safe',
        'Crisis support is available right now',
        'Technical difficulties - but help is still here for you'
      ],
      culturalConsiderations: [],
      emergencyContacts: getEmergencyContacts(),
      confidence: 'unknown' as const,
      urgency: 'high' as const,
      failsafe: true,
      error: 'Crisis detection service error - defaulting to safety',
      timestamp: new Date().toISOString(),
    });
  }
}

// Health check endpoint
export async function GET() {
  try {
    const serverConfig = getServerConfig();
    const hasValidConfig = !!(serverConfig.ai.openaiApiKey);
    
    // Calculate total patterns for monitoring
    const totalPatterns = Object.values(IMMEDIATE_CRISIS_PATTERNS)
      .reduce((sum, patterns) => sum + patterns.length, 0);
    
    return NextResponse.json({
      status: 'operational',
      service: 'crisis-detection',
      version: '2.0.0',
      configValid: hasValidConfig,
      capabilities: {
        languages: Object.keys(IMMEDIATE_CRISIS_PATTERNS),
        culturalContexts: Object.keys(CULTURAL_CRISIS_INDICATORS),
        immediatePatterns: totalPatterns,
        aiAnalysis: hasValidConfig,
        privacyPreserving: true,
        mobileOptimized: true
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'degraded',
        service: 'crisis-detection',
        error: 'Configuration issues detected',
        fallback: 'Immediate pattern detection still available',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Security: Only allow POST and GET methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST, GET' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST, GET' } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { 'Allow': 'POST, GET' } }
  );
}