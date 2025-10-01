'use client';

import React, { useState, useEffect } from 'react';
import { detectCrisisMultiLanguage } from '@/lib/multi-language-crisis-detection';
import { Button } from '@/components/ui/button';

interface CrisisInterventionProps {
  detectedText: string;
  language?: string;
  onDismiss?: () => void;
  onEscalate?: (level: string) => void;
}

interface InterventionLevel {
  level: 'gentle' | 'supportive' | 'urgent' | 'emergency';
  title: string;
  message: string;
  actions: {
    primary: { text: string; action: () => void; style: string };
    secondary?: { text: string; action: () => void; style: string };
    dismiss?: { text: string; action: () => void; style: string };
  };
  resources: {
    title: string;
    items: { name: string; contact: string; available: string }[];
  };
  followUp: {
    schedule: string[];
    type: 'gentle' | 'active' | 'continuous';
  };
}

// Multilingual intervention messages
const interventionMessages = {
  en: {
    gentle: {
      title: "We're here for you",
      message: "It sounds like you might be going through a difficult time. You're not alone, and support is available whenever you're ready.",
      primaryAction: "Find support resources",
      secondaryAction: "Continue writing",
      dismissAction: "I'm okay for now"
    },
    supportive: {
      title: "You matter, and help is available",
      message: "What you're experiencing sounds really challenging. Professional support and caring people are ready to help you through this.",
      primaryAction: "Connect with crisis support",
      secondaryAction: "View local resources",
      dismissAction: "Not right now"
    },
    urgent: {
      title: "Immediate support is available",
      message: "It sounds like you're in significant distress. Crisis counselors are standing by right now to provide immediate support.",
      primaryAction: "Call crisis hotline now",
      secondaryAction: "Text crisis support",
      dismissAction: "I need a moment"
    },
    emergency: {
      title: "Emergency support - You are not alone",
      message: "We're concerned about your safety. Emergency support is available right now. Please reach out - you matter, and people care about you.",
      primaryAction: "Call emergency support",
      secondaryAction: "Connect with crisis chat",
      dismissAction: "I'm safe right now"
    }
  },
  es: {
    gentle: {
      title: "Estamos aquí para ti",
      message: "Parece que podrías estar pasando por un momento difícil. No estás solo, y el apoyo está disponible cuando estés listo.",
      primaryAction: "Encontrar recursos de apoyo",
      secondaryAction: "Continuar escribiendo",
      dismissAction: "Estoy bien por ahora"
    },
    supportive: {
      title: "Importas, y hay ayuda disponible",
      message: "Lo que estás experimentando suena muy desafiante. El apoyo profesional y personas que se preocupan están listas para ayudarte.",
      primaryAction: "Conectar con apoyo de crisis",
      secondaryAction: "Ver recursos locales",
      dismissAction: "Ahora no"
    },
    urgent: {
      title: "Apoyo inmediato está disponible",
      message: "Parece que estás en angustia significativa. Los consejeros de crisis están esperando ahora para proporcionar apoyo inmediato.",
      primaryAction: "Llamar línea de crisis ahora",
      secondaryAction: "Enviar texto de apoyo",
      dismissAction: "Necesito un momento"
    },
    emergency: {
      title: "Apoyo de emergencia - No estás solo",
      message: "Estamos preocupados por tu seguridad. El apoyo de emergencia está disponible ahora. Por favor comunícate - importas, y la gente se preocupa por ti.",
      primaryAction: "Llamar apoyo de emergencia",
      secondaryAction: "Conectar con chat de crisis",
      dismissAction: "Estoy seguro ahora"
    }
  },
  pt: {
    gentle: {
      title: "Estamos aqui para você",
      message: "Parece que você pode estar passando por um momento difícil. Você não está sozinho, e apoio está disponível quando você estiver pronto.",
      primaryAction: "Encontrar recursos de apoio",
      secondaryAction: "Continuar escrevendo",
      dismissAction: "Estou bem por agora"
    },
    supportive: {
      title: "Você importa, e ajuda está disponível",
      message: "O que você está vivenciando parece muito desafiador. Apoio profissional e pessoas que se importam estão prontas para ajudá-lo.",
      primaryAction: "Conectar com apoio de crise",
      secondaryAction: "Ver recursos locais",
      dismissAction: "Agora não"
    },
    urgent: {
      title: "Apoio imediato está disponível",
      message: "Parece que você está em sofrimento significativo. Conselheiros de crise estão aguardando agora para fornecer apoio imediato.",
      primaryAction: "Ligar para linha de crise agora",
      secondaryAction: "Enviar texto de apoio",
      dismissAction: "Preciso de um momento"
    },
    emergency: {
      title: "Apoio de emergência - Você não está sozinho",
      message: "Estamos preocupados com sua segurança. Apoio de emergência está disponível agora. Por favor, entre em contato - você importa, e as pessoas se importam com você.",
      primaryAction: "Ligar para apoio de emergência",
      secondaryAction: "Conectar com chat de crise",
      dismissAction: "Estou seguro agora"
    }
  },
  ko: {
    gentle: {
      title: "우리가 당신과 함께 있어요",
      message: "힘든 시간을 보내고 있는 것 같아요. 혼자가 아니며, 준비가 되면 언제든지 도움을 받을 수 있어요.",
      primaryAction: "지원 자료 찾기",
      secondaryAction: "계속 쓰기",
      dismissAction: "지금은 괜찮아요"
    },
    supportive: {
      title: "당신은 소중하며, 도움을 받을 수 있어요",
      message: "겪고 있는 일이 정말 어려워 보여요. 전문적인 지원과 관심 있는 사람들이 당신을 도울 준비가 되어 있어요.",
      primaryAction: "위기 지원에 연결",
      secondaryAction: "지역 자원 보기",
      dismissAction: "지금은 아니에요"
    },
    urgent: {
      title: "즉시 지원을 받을 수 있어요",
      message: "상당한 고통을 겪고 있는 것 같아요. 위기 상담사들이 즉시 지원을 제공하기 위해 대기하고 있어요.",
      primaryAction: "지금 위기 상담 전화",
      secondaryAction: "위기 지원 문자",
      dismissAction: "잠시 시간이 필요해요"
    },
    emergency: {
      title: "응급 지원 - 혼자가 아니에요",
      message: "당신의 안전이 걱정돼요. 응급 지원이 지금 바로 가능해요. 연락해 주세요 - 당신은 소중하고, 사람들이 당신을 걱정하고 있어요.",
      primaryAction: "응급 지원에 전화",
      secondaryAction: "위기 채팅 연결",
      dismissAction: "지금은 안전해요"
    }
  },
  hi: {
    gentle: {
      title: "हम आपके साथ हैं",
      message: "लगता है आप कठिन समय से गुजर रहे हैं। आप अकेले नहीं हैं, और जब आप तैयार हों तो सहायता उपलब्ध है।",
      primaryAction: "सहायता संसाधन खोजें",
      secondaryAction: "लिखना जारी रखें",
      dismissAction: "मैं अभी ठीक हूँ"
    },
    supportive: {
      title: "आप महत्वपूर्ण हैं, और मदद उपलब्ध है",
      message: "जो आप अनुभव कर रहे हैं वह वास्तव में चुनौतीपूर्ण लगता है। पेशेवर सहायता और देखभाल करने वाले लोग आपकी मदद के लिए तैयार हैं।",
      primaryAction: "संकट सहायता से जुड़ें",
      secondaryAction: "स्थानीय संसाधन देखें",
      dismissAction: "अभी नहीं"
    },
    urgent: {
      title: "तत्काल सहायता उपलब्ध है",
      message: "लगता है आप महत्वपूर्ण संकट में हैं। संकट सलाहकार तत्काल सहायता प्रदान करने के लिए अभी इंतजार कर रहे हैं।",
      primaryAction: "अभी संकट हॉटलाइन कॉल करें",
      secondaryAction: "संकट सहायता टेक्स्ट",
      dismissAction: "मुझे एक पल चाहिए"
    },
    emergency: {
      title: "आपातकालीन सहायता - आप अकेले नहीं हैं",
      message: "हमें आपकी सुरक्षा की चिंता है। आपातकालीन सहायता अभी उपलब्ध है। कृपया संपर्क करें - आप महत्वपूर्ण हैं, और लोग आपकी परवाह करते हैं।",
      primaryAction: "आपातकालीन सहायता कॉल करें",
      secondaryAction: "संकट चैट से जुड़ें",
      dismissAction: "मैं अभी सुरक्षित हूँ"
    }
  },
  de: {
    gentle: {
      title: "Wir sind für Sie da",
      message: "Es scheint, als würden Sie eine schwere Zeit durchmachen. Sie sind nicht allein, und Unterstützung ist verfügbar, wann immer Sie bereit sind.",
      primaryAction: "Unterstützungsressourcen finden",
      secondaryAction: "Weiter schreiben",
      dismissAction: "Mir geht es momentan gut"
    },
    supportive: {
      title: "Sie sind wichtig, und Hilfe ist verfügbar",
      message: "Was Sie erleben, klingt wirklich herausfordernd. Professionelle Unterstützung und fürsorgliche Menschen sind bereit, Ihnen zu helfen.",
      primaryAction: "Mit Krisenunterstützung verbinden",
      secondaryAction: "Lokale Ressourcen ansehen",
      dismissAction: "Nicht jetzt"
    },
    urgent: {
      title: "Sofortige Unterstützung ist verfügbar",
      message: "Es scheint, als befänden Sie sich in erheblicher Bedrängnis. Krisenberater stehen jetzt bereit, um sofortige Unterstützung zu bieten.",
      primaryAction: "Jetzt Krisenhotline anrufen",
      secondaryAction: "Krisenunterstützung per Text",
      dismissAction: "Ich brauche einen Moment"
    },
    emergency: {
      title: "Notfallunterstützung - Sie sind nicht allein",
      message: "Wir machen uns Sorgen um Ihre Sicherheit. Notfallunterstützung ist jetzt verfügbar. Bitte melden Sie sich - Sie sind wichtig, und Menschen kümmern sich um Sie.",
      primaryAction: "Notfallunterstützung anrufen",
      secondaryAction: "Mit Krisenchat verbinden",
      dismissAction: "Ich bin jetzt sicher"
    }
  }
};

export default function EnhancedCrisisIntervention({ 
  detectedText, 
  language = 'en', 
  onDismiss, 
  onEscalate 
}: CrisisInterventionProps) {
  const [crisisResult, setCrisisResult] = useState<any>(null);
  const [interventionLevel, setInterventionLevel] = useState<InterventionLevel | null>(null);
  const [showFullResources, setShowFullResources] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    // Analyze the detected text for crisis patterns
    const result = detectCrisisMultiLanguage(detectedText, language);
    setCrisisResult(result);

    // Create intervention level based on results
    if (result.detected) {
      const level = createInterventionLevel(result, language as keyof typeof interventionMessages);
      setInterventionLevel(level);
    }
  }, [detectedText, language]);

  const createInterventionLevel = (result: any, lang: keyof typeof interventionMessages): InterventionLevel => {
    const messages = interventionMessages[lang] || interventionMessages.en;
    const resources = result.localizedResources?.[0] || {
      emergencyNumber: '911',
      crisisHotline: '988',
      onlineResources: []
    };

    let levelType: 'gentle' | 'supportive' | 'urgent' | 'emergency' = 'gentle';
    let messageKey: keyof typeof messages = 'gentle';

    switch (result.recommendedAction) {
      case 'emergency':
        levelType = 'emergency';
        messageKey = 'emergency';
        break;
      case 'intervention':
        levelType = 'urgent';
        messageKey = 'urgent';
        break;
      case 'support':
        levelType = 'supportive';
        messageKey = 'supportive';
        break;
      default:
        levelType = 'gentle';
        messageKey = 'gentle';
    }

    const message = messages[messageKey];

    return {
      level: levelType,
      title: message.title,
      message: message.message,
      actions: {
        primary: {
          text: message.primaryAction,
          action: () => handlePrimaryAction(levelType, resources),
          style: levelType === 'emergency' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-sage-500 hover:bg-sage-600 text-white'
        },
        secondary: {
          text: message.secondaryAction,
          action: () => handleSecondaryAction(levelType, resources),
          style: 'bg-sage-200 hover:bg-sage-300 text-sage-800'
        },
        dismiss: {
          text: message.dismissAction,
          action: () => handleDismiss(),
          style: 'text-sage-600 hover:text-sage-800'
        }
      },
      resources: {
        title: lang === 'es' ? 'Recursos de Crisis' :
               lang === 'pt' ? 'Recursos de Crise' :
               lang === 'ko' ? '위기 자원' :
               lang === 'hi' ? 'संकट संसाधन' :
               lang === 'de' ? 'Krisenressourcen' : 'Crisis Resources',
        items: [
          {
            name: lang === 'es' ? 'Línea de Crisis' :
                  lang === 'pt' ? 'Linha de Crise' :
                  lang === 'ko' ? '위기 상담 전화' :
                  lang === 'hi' ? 'संकट हॉटलाइन' :
                  lang === 'de' ? 'Krisenhotline' : 'Crisis Hotline',
            contact: resources.crisisHotline,
            available: lang === 'es' ? '24/7 disponible' :
                      lang === 'pt' ? '24/7 disponível' :
                      lang === 'ko' ? '24시간 이용 가능' :
                      lang === 'hi' ? '24/7 उपलब्ध' :
                      lang === 'de' ? '24/7 verfügbar' : '24/7 available'
          },
          {
            name: lang === 'es' ? 'Emergencia' :
                  lang === 'pt' ? 'Emergência' :
                  lang === 'ko' ? '응급상황' :
                  lang === 'hi' ? 'आपातकाल' :
                  lang === 'de' ? 'Notfall' : 'Emergency',
            contact: resources.emergencyNumber,
            available: lang === 'es' ? 'Siempre disponible' :
                      lang === 'pt' ? 'Sempre disponível' :
                      lang === 'ko' ? '항상 이용 가능' :
                      lang === 'hi' ? 'हमेशा उपलब्ध' :
                      lang === 'de' ? 'Immer verfügbar' : 'Always available'
          }
        ]
      },
      followUp: {
        schedule: levelType === 'emergency' ? ['continuous'] : 
                 levelType === 'urgent' ? ['1h', '6h', '24h'] :
                 levelType === 'supportive' ? ['6h', '24h'] : ['24h'],
        type: levelType === 'emergency' ? 'continuous' : 
              levelType === 'urgent' ? 'active' : 'gentle'
      }
    };
  };

  const handlePrimaryAction = (level: string, resources: any) => {
    if (level === 'emergency' || level === 'urgent') {
      // Direct call to crisis hotline
      window.open(`tel:${resources.crisisHotline}`, '_self');
    } else {
      // Show full resources
      setShowFullResources(true);
    }
    
    if (onEscalate) {
      onEscalate(level);
    }
  };

  const handleSecondaryAction = (level: string, resources: any) => {
    if (level === 'emergency') {
      // Open crisis chat or text line
      if (resources.textHotline) {
        window.open(`sms:${resources.textHotline}`, '_self');
      } else {
        setShowFullResources(true);
      }
    } else {
      setShowFullResources(true);
    }
  };

  const handleDismiss = () => {
    // Schedule follow-up based on intervention level
    if (interventionLevel?.followUp.type === 'continuous') {
      // Don't dismiss emergency interventions easily
      const confirm = window.confirm(
        language === 'es' ? '¿Estás seguro de que estás a salvo ahora mismo?' :
        language === 'pt' ? 'Tem certeza de que está seguro agora?' :
        language === 'ko' ? '지금 안전하다고 확신하시나요?' :
        language === 'hi' ? 'क्या आप सुनिश्चित हैं कि आप अभी सुरक्षित हैं?' :
        language === 'de' ? 'Sind Sie sicher, dass Sie jetzt sicher sind?' :
        'Are you sure you are safe right now?'
      );
      
      if (!confirm) return;
    }
    
    // Schedule gentle follow-ups
    scheduleFollowUp(interventionLevel?.followUp.schedule || ['24h']);
    
    if (onDismiss) {
      onDismiss();
    }
  };

  const scheduleFollowUp = (schedule: string[]) => {
    // Store follow-up schedule in localStorage for later processing
    const followUps = {
      timestamp: Date.now(),
      schedule: schedule,
      userId: 'current_user', // Should be actual user ID
      type: interventionLevel?.followUp.type || 'gentle'
    };
    
    localStorage.setItem('alchm_crisis_followup', JSON.stringify(followUps));
  };

  if (!crisisResult?.detected || !interventionLevel) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 sanctuary-backdrop backdrop-blur-xl flex items-center justify-center p-phi-lg animate-fade-in">
      <div className={`
        organic-container sanctuary-glass border shadow-floating max-w-lg w-full p-phi-xl
        ${interventionLevel.level === 'emergency' ? 'border-red-400/40 bg-gradient-to-br from-red-50/95 to-red-100/90' : 
          'border-sage-400/40 bg-gradient-to-br from-sanctuary/95 to-sage-50/90'}
        animate-slide-in-up backdrop-blur-xl
      `}>
        {/* Crisis Level Indicator */}
        <div className={`
          absolute top-0 left-0 right-0 text-center py-phi-sm text-phi-xs font-light tracking-wide rounded-t-3xl
          ${interventionLevel.level === 'emergency' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
            interventionLevel.level === 'urgent' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
            'bg-gradient-to-r from-sage-400 to-sage-500 text-sanctuary'}
        `}>
          {interventionLevel.level === 'emergency' ? 
            (language === 'es' ? 'Apoyo de Emergencia' :
             language === 'pt' ? 'Apoio de Emergência' :
             language === 'ko' ? '응급 지원' :
             language === 'hi' ? 'आपातकालीन सहायता' :
             language === 'de' ? 'Notfallunterstützung' : 'Emergency Support') :
           interventionLevel.level === 'urgent' ?
            (language === 'es' ? 'Apoyo Urgente' :
             language === 'pt' ? 'Apoio Urgente' :
             language === 'ko' ? '긴급 지원' :
             language === 'hi' ? 'तत्काल सहायता' :
             language === 'de' ? 'Dringende Unterstützung' : 'Urgent Support') :
            (language === 'es' ? 'Apoyo Disponible' :
             language === 'pt' ? 'Apoio Disponível' :
             language === 'ko' ? '지원 가능' :
             language === 'hi' ? 'सहायता उपलब्ध' :
             language === 'de' ? 'Unterstützung Verfügbar' : 'Support Available')
          }
        </div>

        <div className="pt-phi-lg">
          {/* Crisis Detection Confidence (for transparency) */}
          <div className="flex items-center justify-center mb-phi-md">
            <div className={`
              w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-elevated animate-gentle-pulse
              ${interventionLevel.level === 'emergency' ? 'bg-gradient-to-br from-red-400 to-red-500' :
                'bg-gradient-to-br from-sage-400 to-sage-500'}
            `}>
              <span className="text-2xl text-sanctuary">
                {interventionLevel.level === 'emergency' ? '🆘' : 
                 interventionLevel.level === 'urgent' ? '⚠️' : 
                 '💙'}
              </span>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-phi-lg">
            <h2 className="text-phi-xl font-light text-sage-800 mb-phi-sm tracking-wide">
              {interventionLevel.title}
            </h2>
            <p className="text-phi-base leading-relaxed text-sage-700 font-light tracking-wide">
              {interventionLevel.message}
            </p>
          </div>

          {/* Quick Resources */}
          {!showFullResources && (
            <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-md mb-phi-lg backdrop-blur-xl">
              <h3 className="text-phi-sm font-light text-sage-700 mb-phi-sm tracking-wide">
                {interventionLevel.resources.title}
              </h3>
              <div className="space-y-phi-xs">
                {interventionLevel.resources.items.slice(0, 2).map((resource, index) => (
                  <div key={index} className="flex justify-between items-center text-phi-xs">
                    <span className="text-sage-600 font-light">{resource.name}</span>
                    <button
                      onClick={() => window.open(`tel:${resource.contact}`, '_self')}
                      className="text-sage-800 hover:text-sage-900 font-medium underline"
                    >
                      {resource.contact}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Resources Modal */}
          {showFullResources && (
            <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-md mb-phi-lg backdrop-blur-xl max-h-48 overflow-y-auto">
              <div className="flex justify-between items-center mb-phi-sm">
                <h3 className="text-phi-sm font-light text-sage-700 tracking-wide">
                  {interventionLevel.resources.title}
                </h3>
                <button
                  onClick={() => setShowFullResources(false)}
                  className="text-sage-600 hover:text-sage-800 text-phi-xs"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-phi-sm">
                {crisisResult.localizedResources?.[0]?.onlineResources?.map((resource: any, index: number) => (
                  <div key={index} className="bg-sage-50/60 rounded-xl p-phi-sm">
                    <h4 className="text-phi-xs font-medium text-sage-800 mb-1">{resource.name}</h4>
                    <p className="text-phi-xs text-sage-600 mb-phi-xs">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-phi-xs text-sage-800 hover:text-sage-900 underline"
                    >
                      {resource.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-phi-sm">
            <Button
              onClick={interventionLevel.actions.primary.action}
              className={`w-full py-phi-md text-phi-sm font-light tracking-wide transition-all duration-400 hover:scale-105 active:scale-95 ${interventionLevel.actions.primary.style}`}
            >
              {interventionLevel.actions.primary.text}
            </Button>
            
            {interventionLevel.actions.secondary && (
              <Button
                onClick={interventionLevel.actions.secondary.action}
                className={`w-full py-phi-sm text-phi-sm font-light tracking-wide transition-all duration-400 hover:scale-105 active:scale-95 ${interventionLevel.actions.secondary.style}`}
              >
                {interventionLevel.actions.secondary.text}
              </Button>
            )}
            
            <button
              onClick={interventionLevel.actions.dismiss.action}
              className={`w-full py-phi-sm text-phi-xs font-light tracking-wide transition-all duration-400 hover:scale-105 active:scale-95 ${interventionLevel.actions.dismiss.style}`}
            >
              {interventionLevel.actions.dismiss.text}
            </button>
          </div>

          {/* Cultural Adaptation Notice */}
          {crisisResult.culturalContext && crisisResult.culturalContext.length > 0 && (
            <div className="mt-phi-md text-center">
              <p className="text-phi-xs text-sage-600 italic font-light">
                {language === 'es' ? 'Recursos adaptados culturalmente disponibles' :
                 language === 'pt' ? 'Recursos culturalmente adaptados disponíveis' :
                 language === 'ko' ? '문화적으로 적응된 자원 이용 가능' :
                 language === 'hi' ? 'सांस्कृतिक रूप से अनुकूलित संसाधन उपलब्ध' :
                 language === 'de' ? 'Kulturell angepasste Ressourcen verfügbar' :
                 'Culturally adapted resources available'}
              </p>
            </div>
          )}
        </div>

        {/* Decoration */}
        <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">
          {interventionLevel.level === 'emergency' ? '🆘' : '💙'}
        </div>
      </div>
    </div>
  );
}