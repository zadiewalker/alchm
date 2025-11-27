'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CrisisResourceIntegration } from '../../components/crisis/CrisisResourceIntegration';

interface CrisisResource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  text?: string;
  website?: string;
  availability: string;
  languages: string[];
  specializations: string[];
  urgent?: boolean;
}

export default function CrisisResourcesPage() {
  const [userLocation, setUserLocation] = useState<string>('US');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const router = useRouter();
  const lastInteractionRef = useRef<number>(Date.now());

  const crisisResources: CrisisResource[] = [
    {
      id: '988-lifeline',
      name: '988 Suicide & Crisis Lifeline',
      description: '24/7, free and confidential support for people in distress, including prevention and crisis resources.',
      phone: '988',
      website: 'https://988lifeline.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['Suicide Prevention', 'Mental Health Crisis', 'Emotional Support'],
      urgent: true
    },
    {
      id: 'crisis-text-line',
      name: 'Crisis Text Line',
      description: 'Free, 24/7 support via text message. Trained crisis counselors provide support for any crisis.',
      text: '741741',
      website: 'https://www.crisistextline.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['Text Support', 'Crisis Counseling', 'Youth Support']
    },
    {
      id: 'trevor-lifeline',
      name: 'The Trevor Lifeline',
      description: '24/7 crisis support services for LGBTQ+ young people under 25.',
      phone: '1-866-488-7386',
      text: '678678',
      website: 'https://www.thetrevorproject.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['LGBTQ+ Youth', 'Suicide Prevention', 'Crisis Counseling']
    },
    {
      id: 'trans-lifeline',
      name: 'Trans Lifeline',
      description: 'Peer support hotline for transgender people, by transgender people.',
      phone: '877-565-8860',
      website: 'https://translifeline.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['Transgender Support', 'Peer Counseling']
    },
    {
      id: 'national-domestic-violence',
      name: 'National Domestic Violence Hotline',
      description: '24/7 confidential support for domestic violence survivors and those who know them.',
      phone: '1-800-799-7233',
      text: 'START to 88788',
      website: 'https://www.thehotline.org',
      availability: '24/7',
      languages: ['English', 'Spanish', '200+ languages via interpreters'],
      specializations: ['Domestic Violence', 'Intimate Partner Violence', 'Safety Planning']
    },
    {
      id: 'rainn-hotline',
      name: 'RAINN National Sexual Assault Hotline',
      description: 'Free, confidential support for survivors of sexual violence and their loved ones.',
      phone: '1-800-656-4673',
      website: 'https://www.rainn.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['Sexual Assault', 'Trauma Support', 'Legal Resources']
    },
    {
      id: 'samhsa-helpline',
      name: 'SAMHSA National Helpline',
      description: 'Treatment referral and information service for mental health and substance use disorders.',
      phone: '1-800-662-4357',
      website: 'https://www.samhsa.gov/find-help/national-helpline',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['Substance Abuse', 'Mental Health Treatment', 'Referrals']
    },
    {
      id: 'stronghearts-native',
      name: 'StrongHearts Native Helpline',
      description: 'Confidential and anonymous culturally-appropriate domestic violence and dating violence helpline for Native Americans.',
      phone: '1-844-762-8483',
      website: 'https://strongheartshelpline.org',
      availability: '7 AM - 10 PM CT',
      languages: ['English', 'Native Languages'],
      specializations: ['Native American/Indigenous', 'Domestic Violence', 'Cultural Support']
    }
  ];

  // Enhanced cultural and identity-specific resources
  const culturalResources: CrisisResource[] = [
    {
      id: 'lgbtq-trevor',
      name: 'The Trevor Project',
      description: '24/7 crisis support for LGBTQ+ young people under 25.',
      phone: '1-866-488-7386',
      text: '678678',
      website: 'https://www.thetrevorproject.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['LGBTQ+ Youth', 'Suicide Prevention', 'Identity Support'],
      urgent: false
    },
    {
      id: 'trans-lifeline',
      name: 'Trans Lifeline',
      description: 'Peer support hotline run by and for transgender people.',
      phone: '877-565-8860',
      website: 'https://translifeline.org',
      availability: '24/7',
      languages: ['English', 'Spanish'],
      specializations: ['Transgender Support', 'Peer Counseling', 'Identity Affirmation']
    },
    {
      id: 'stronghearts-native',
      name: 'StrongHearts Native Helpline',
      description: 'Culturally-appropriate support for Native Americans experiencing domestic violence.',
      phone: '1-844-762-8483',
      website: 'https://strongheartshelpline.org',
      availability: '7 AM - 10 PM CT',
      languages: ['English', 'Native Languages'],
      specializations: ['Native American/Indigenous', 'Domestic Violence', 'Cultural Support']
    },
    {
      id: 'blackline',
      name: 'BlackLine',
      description: 'Crisis support prioritizing Black/African American mental health.',
      phone: '1-800-604-5841',
      website: 'https://www.callblackline.com',
      availability: 'Daily',
      languages: ['English'],
      specializations: ['Black/African American', 'Mental Health', 'Crisis Support']
    },
    {
      id: 'national-latina-helpline',
      name: 'National Latina Helpline',
      description: 'Bilingual support for Latina women in crisis.',
      phone: '1-800-971-4366',
      website: 'https://nationallatinasnetwork.org',
      availability: 'Weekdays',
      languages: ['English', 'Spanish'],
      specializations: ['Latina/Hispanic', 'Women', 'Domestic Violence']
    },
    {
      id: 'asian-mental-health-collective',
      name: 'Asian Mental Health Directory',
      description: 'Resource directory for Asian American mental health support.',
      website: 'https://www.asianmhc.org',
      availability: 'Resource Directory',
      languages: ['English', 'Various Asian Languages'],
      specializations: ['Asian American', 'Mental Health', 'Cultural Support']
    }
  ];

  const internationalResources: CrisisResource[] = [
    {
      id: 'canada-talk-suicide',
      name: 'Talk Suicide Canada',
      description: '24/7 support for anyone in Canada having thoughts of suicide.',
      phone: '1-833-456-4566',
      website: 'https://talksuicide.ca',
      availability: '24/7',
      languages: ['English', 'French'],
      specializations: ['Suicide Prevention']
    },
    {
      id: 'uk-samaritans',
      name: 'Samaritans (UK)',
      description: 'Free support for anyone in emotional distress.',
      phone: '116 123',
      website: 'https://www.samaritans.org',
      availability: '24/7',
      languages: ['English'],
      specializations: ['Emotional Support', 'Suicide Prevention']
    },
    {
      id: 'australia-lifeline',
      name: 'Lifeline Australia',
      description: '24/7 crisis support and suicide prevention.',
      phone: '13 11 14',
      website: 'https://www.lifeline.org.au',
      availability: '24/7',
      languages: ['English'],
      specializations: ['Crisis Support', 'Suicide Prevention']
    },
    {
      id: 'mexico-saptel',
      name: 'SAPTEL México',
      description: 'Crisis support and suicide prevention in Mexico.',
      phone: '(55) 5259-8121',
      website: 'https://saptel.org.mx',
      availability: '24/7',
      languages: ['Spanish'],
      specializations: ['Crisis Support', 'Suicide Prevention']
    },
    {
      id: 'india-vandrevala',
      name: 'Vandrevala Foundation (India)',
      description: 'Mental health support and crisis intervention in India.',
      phone: '1860-2662-345',
      website: 'https://www.vandrevalafoundation.com',
      availability: '24/7',
      languages: ['English', 'Hindi', 'Other Indian Languages'],
      specializations: ['Mental Health', 'Crisis Support']
    },
    {
      id: 'germany-telefonseelsorge',
      name: 'Telefonseelsorge (Germany)',
      description: 'Crisis counseling and emotional support in Germany.',
      phone: '0800 111 0 111',
      website: 'https://www.telefonseelsorge.de',
      availability: '24/7',
      languages: ['German'],
      specializations: ['Crisis Counseling', 'Emotional Support']
    }
  ];

  const specializedFilters = [
    'LGBTQ+ Youth',
    'Transgender Support', 
    'Domestic Violence',
    'Sexual Assault',
    'Substance Abuse',
    'Native American/Indigenous',
    'Black/African American',
    'Latina/Hispanic',
    'Asian American',
    'Veterans',
    'Youth Support',
    'Text Support',
    'Peer Counseling',
    'Identity Support',
    'Cultural Support'
  ];

  // Language-specific crisis phrases for cultural competency
  const culturalPhrases = {
    es: {
      emergency: 'Ayuda de emergencia disponible',
      support: 'No estás solo. Hay ayuda disponible.',
      call: 'Llamar',
      text: 'Enviar mensaje'
    },
    pt: {
      emergency: 'Ajuda de emergência disponível',
      support: 'Você não está sozinho. Ajuda está disponível.',
      call: 'Ligar',
      text: 'Enviar mensagem'
    },
    ko: {
      emergency: '응급 도움이 가능합니다',
      support: '당신은 혼자가 아닙니다. 도움을 받을 수 있습니다.',
      call: '전화',
      text: '문자'
    },
    hi: {
      emergency: 'आपातकालीन सहायता उपलब्ध है',
      support: 'आप अकेले नहीं हैं। सहायता उपलब्ध है।',
      call: 'फोन करें',
      text: 'संदेश भेजें'
    },
    de: {
      emergency: 'Notfallhilfe verfügbar',
      support: 'Du bist nicht allein. Hilfe ist verfügbar.',
      call: 'Anrufen',
      text: 'Nachricht senden'
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const currentPhrases = culturalPhrases[selectedLanguage as keyof typeof culturalPhrases] || culturalPhrases.es;

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredResources = crisisResources.filter(resource => 
    selectedFilters.length === 0 || 
    selectedFilters.some(filter => resource.specializations.includes(filter))
  );

  const filteredCulturalResources = culturalResources.filter(resource => 
    selectedFilters.length === 0 || 
    selectedFilters.some(filter => resource.specializations.includes(filter))
  );

  const filteredInternationalResources = internationalResources.filter(resource => 
    selectedFilters.length === 0 || 
    selectedFilters.some(filter => resource.specializations.includes(filter))
  );

  // Cultural awareness and identity affirmation messages
  const culturalAffirmations = [
    "Your cultural identity is valid and valued.",
    "There are people who understand your experience.",
    "Your struggles are real and deserve support.",
    "Help is available in ways that honor your identity.",
    "You belong in spaces of healing and support."
  ];

  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % culturalAffirmations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Emergency interaction tracking for safety
  useEffect(() => {
    const startTime = Date.now();
    setLoadTime(startTime);

    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    // Emergency mode detection (panic states)
    const detectEmergencyMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('emergency') === 'true' || urlParams.get('crisis') === 'true') {
        setEmergencyMode(true);
        document.body.classList.add('emergency-mode');
      }
    };
    detectEmergencyMode();

    // High contrast mode for accessibility
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => setIsHighContrast(e.matches));

    // Voice commands for accessibility
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        if (command.includes('emergency') || command.includes('crisis') || command.includes('help')) {
          handleEmergencyCall('988');
        }
      };
      
      setVoiceEnabled(true);
      
      // Activate voice on triple-tap
      let tapCount = 0;
      const handleTripleTap = () => {
        tapCount++;
        setTimeout(() => { tapCount = 0; }, 1000);
        if (tapCount === 3) {
          recognition.start();
          if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        }
      };
      document.addEventListener('click', handleTripleTap);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleEmergencyCall = (number: string, description?: string) => {
    // Update last interaction for safety monitoring
    lastInteractionRef.current = Date.now();
    
    // Enhanced haptic feedback for crisis situations
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]); // Strong confirmation pattern
    }
    
    // Track usage for crisis monitoring (privacy-preserving)
    if (typeof window !== 'undefined') {
      if ('performance' in window) {
        performance.mark('crisis-resource-used');
        performance.measure('crisis-response-time', 'navigationStart', 'crisis-resource-used');
      }
      
      // Background sync for offline usage tracking
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('crisis-resource-used');
        });
      }
      
      // Store emergency contact usage (local only)
      try {
        const emergencyLog = JSON.parse(localStorage.getItem('alchm-crisis-log') || '[]');
        emergencyLog.push({
          timestamp: Date.now(),
          action: 'emergency_call',
          resource: number.replace(/[^0-9]/g, ''), // Store only numbers for privacy
          offline: isOffline
        });
        // Keep only last 10 entries for privacy
        localStorage.setItem('alchm-crisis-log', JSON.stringify(emergencyLog.slice(-10)));
      } catch (e) {
        // Ignore storage errors in crisis situations
      }
    }
    
    // Initiate call with fallback
    try {
      window.location.href = `tel:${number}`;
    } catch (e) {
      // Fallback for environments where tel: links don't work
      alert(`Call this number immediately: ${number}${description ? ` (${description})` : ''}`);
    }
  };

  const handleEmergencyText = (number: string, message?: string) => {
    lastInteractionRef.current = Date.now();
    
    // Lighter haptic feedback for text
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    if (typeof window !== 'undefined') {
      if ('performance' in window) {
        performance.mark('crisis-text-used');
      }
      
      // Track text usage
      try {
        const emergencyLog = JSON.parse(localStorage.getItem('alchm-crisis-log') || '[]');
        emergencyLog.push({
          timestamp: Date.now(),
          action: 'emergency_text',
          resource: number.replace(/[^0-9]/g, ''),
          offline: isOffline
        });
        localStorage.setItem('alchm-crisis-log', JSON.stringify(emergencyLog.slice(-10)));
      } catch (e) {
        // Ignore storage errors
      }
    }
    
    const textUrl = message ? `sms:${number}&body=${encodeURIComponent(message)}` : `sms:${number}`;
    try {
      window.location.href = textUrl;
    } catch (e) {
      alert(`Text this number: ${number}${message ? ` with message: ${message}` : ''}`);
    }
  };

  // Quick exit function for safety
  const handleQuickExit = () => {
    // Clear any crisis-related browser history
    if (window.history.length > 1) {
      window.history.replaceState({}, '', 'about:blank');
    }
    
    // Navigate to safe site
    window.location.href = 'https://www.google.com';
  };

  // Panic button - large, always accessible
  const handlePanicButton = () => {
    if (navigator.vibrate) navigator.vibrate([300, 200, 300]);
    handleEmergencyCall('988', 'Suicide & Crisis Lifeline');
  };

  // Location-based resource detection
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use IP-based location service for privacy
          fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          })
          .then(res => res.json())
          .then(data => setUserLocation(data.country || 'US'))
          .catch(() => setUserLocation('US'));
        },
        () => {
          // Fallback to IP-based detection
          fetch('/api/location')
            .then(res => res.json())
            .then(data => setUserLocation(data.country || 'US'))
            .catch(() => setUserLocation('US'));
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, [userLocation]);

  return (
    <CrisisResourceIntegration emergencyMode={emergencyMode}>
      <div className={`min-h-screen ${isHighContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-sage-primary via-sage-hover to-sage-active'} ${emergencyMode ? 'emergency-mode' : ''}`}>
      {/* Offline Status Banner */}
      {isOffline && (
        <div className="bg-orange-500 text-white p-3 text-center font-medium animate-pulse">
          📶 You're offline - Emergency numbers still work
        </div>
      )}
      
      {/* Performance Status */}
      {Date.now() - loadTime > 3000 && (
        <div className="bg-yellow-500 text-black p-2 text-center text-sm">
          ⚠️ Slow loading detected - Emergency contacts available below
        </div>
      )}
      
      {/* Crisis Alert Banner - Enhanced */}
      <div className={`${isHighContrast ? 'bg-white text-black' : 'bg-red-600 text-white'} p-4 text-center border-b-4 border-red-800`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xl font-medium mb-3 leading-tight">
            🆘 If you're in immediate danger, call 911
          </p>
          <p className="text-lg mb-4 opacity-90">
            Crisis support is available 24/7. You are not alone.
          </p>
          <div className="flex flex-col gap-3 justify-center items-center">
            <button
              onClick={() => handleEmergencyCall('988', 'Suicide & Crisis Lifeline')}
              className={`crisis-touch-target bg-white text-red-600 px-8 py-4 rounded-2xl font-medium text-xl hover:bg-red-50 transition-all transform hover:scale-105 min-w-[280px] min-h-[80px] flex items-center justify-center gap-3 shadow-xl ${emergencyMode ? 'animate-pulse' : ''}`}
              aria-label="Call 988 Suicide and Crisis Lifeline immediately"
            >
              📞 Call 988 Now
            </button>
            <button
              onClick={() => handleEmergencyText('741741', 'HOME')}
              className={`crisis-touch-target bg-white text-red-600 px-8 py-4 rounded-2xl font-medium text-xl hover:bg-red-50 transition-all transform hover:scale-105 min-w-[280px] min-h-[80px] flex items-center justify-center gap-3 shadow-xl ${emergencyMode ? 'animate-pulse' : ''}`}
              aria-label="Text HOME to 741741 for crisis support"
            >
              💬 Text HOME to 741741
            </button>
            {voiceEnabled && (
              <p className="text-sm opacity-75 mt-2">
                💡 Voice commands enabled - Triple-tap screen and say "help" or "emergency"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Header - Crisis Optimized */}
      <header className={`${isHighContrast ? 'bg-gray-900 border-gray-700' : 'bg-sanctuary-glass backdrop-blur-xl border-b border-sanctuary/20'}`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <h1 className={`text-3xl font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-2 leading-tight`}>
                Crisis Support Resources
              </h1>
              <p className={`${isHighContrast ? 'text-gray-300' : 'text-sage-active/70'} text-lg leading-relaxed`}>
                You matter. Help is available 24/7. Your life has value.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`${isOffline ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full text-sm font-medium`}>
                  {isOffline ? '📶 Offline Mode' : '🌐 Connected'}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  ⚡ Load Time: {Date.now() - loadTime}ms
                </span>
                {emergencyMode && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    🚨 Emergency Mode
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleQuickExit}
                className={`crisis-touch-target bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors min-h-[56px] ${isHighContrast ? 'border-2 border-white' : ''}`}
                title="Quick Exit (Ctrl+Shift+X)"
                aria-label="Quickly exit this page for safety"
              >
                ← Quick Exit
              </button>
              <Link
                href="/dashboard"
                className={`crisis-touch-target ${isHighContrast ? 'bg-white text-black border-2 border-black' : 'bg-sage-primary text-sanctuary'} px-6 py-3 rounded-xl font-medium hover:bg-sage-hover transition-colors min-h-[56px] flex items-center`}
              >
                Back to Sanctuary
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Immediate Crisis Support - Enhanced Mobile UX */}
        <section className="mb-12" data-crisis-level="immediate">
          <h2 className={`text-3xl font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-8 text-center`}>
            Immediate Crisis Support
          </h2>
          <div className="grid gap-8 max-w-4xl mx-auto">
            {crisisResources.filter(r => r.urgent).map(resource => (
              <div key={resource.id} className={`${isHighContrast ? 'bg-gray-800 border-white' : 'bg-sanctuary-glass backdrop-blur-xl border-red-200'} rounded-3xl p-8 border-2 shadow-2xl transform transition-all hover:scale-102`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${isHighContrast ? 'bg-white text-black' : 'bg-red-500 text-white'} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                    🆘
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} leading-tight`}>{resource.name}</h3>
                    <p className={`${isHighContrast ? 'text-gray-300' : 'text-sage-active/80'} text-lg mt-2 leading-relaxed`}>{resource.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {resource.phone && (
                    <button
                      onClick={() => handleEmergencyCall(resource.phone, resource.description)}
                      className={`crisis-touch-target ${isHighContrast ? 'bg-white text-black border-2 border-black' : 'bg-red-500 text-white'} px-8 py-6 rounded-2xl font-medium text-xl hover:bg-red-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl min-h-[80px]`}
                      aria-label={`Call ${resource.phone} for ${resource.description}`}
                    >
                      📞 Call {resource.phone}
                    </button>
                  )}
                  {resource.text && (
                    <button
                      onClick={() => handleEmergencyText(resource.text, resource.text === '741741' ? 'HOME' : undefined)}
                      className={`crisis-touch-target ${isHighContrast ? 'bg-gray-700 text-white border-2 border-gray-500' : 'bg-sage-primary text-sanctuary'} px-8 py-6 rounded-2xl font-medium text-xl hover:bg-sage-hover transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl min-h-[80px]`}
                      aria-label={`Text ${resource.text} for crisis support`}
                    >
                      💬 Text {resource.text}
                    </button>
                  )}
                  {resource.website && (
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`crisis-touch-target ${isHighContrast ? 'bg-gray-600 text-white border-2 border-gray-400' : 'bg-blue-500 text-white'} px-8 py-4 rounded-2xl font-medium text-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg min-h-[64px]`}
                      aria-label={`Visit ${resource.name} website`}
                    >
                      🌐 Visit Website
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  <span className={`${isHighContrast ? 'bg-white text-black' : 'bg-red-100 text-red-800'} px-4 py-2 rounded-full font-medium text-base shadow-sm`}>
                    {resource.availability}
                  </span>
                  {resource.languages.slice(0, 3).map(lang => (
                    <span key={lang} className={`${isHighContrast ? 'bg-gray-700 text-white' : 'bg-sage-light text-sage-active'} px-4 py-2 rounded-full text-base shadow-sm`}>
                      {lang}
                    </span>
                  ))}
                  {resource.languages.length > 3 && (
                    <span className={`${isHighContrast ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'} px-4 py-2 rounded-full text-base`}>
                      +{resource.languages.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Specialized Support Filters */}
        <section className="mb-8">
          <h3 className="text-xl font-medium text-sage-active mb-4">Filter by Specialization</h3>
          <div className="flex flex-wrap gap-3">
            {specializedFilters.map(filter => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilters.includes(filter)
                    ? 'bg-sage-primary text-sanctuary'
                    : 'bg-sanctuary/50 text-sage-active hover:bg-sanctuary/70'
                }`}
              >
                {filter}
              </button>
            ))}
            {selectedFilters.length > 0 && (
              <button
                onClick={() => setSelectedFilters([])}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </section>

        {/* All Crisis Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-medium text-sage-active mb-6">
            Additional Crisis Resources
            {selectedFilters.length > 0 && (
              <span className="text-lg font-normal text-sage-active/70 ml-2">
                (Filtered by: {selectedFilters.join(', ')})
              </span>
            )}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.filter(r => !r.urgent).map(resource => (
              <div key={resource.id} className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl p-6 border border-sanctuary/30 shadow-xl">
                <h3 className="text-lg font-medium text-sage-active mb-3">{resource.name}</h3>
                <p className="text-sage-active/80 mb-4 text-sm leading-relaxed">{resource.description}</p>
                
                <div className="space-y-2 mb-4">
                  {resource.phone && (
                    <button
                      onClick={() => handleEmergencyCall(resource.phone)}
                      className="w-full bg-sage-primary text-sanctuary px-4 py-2 rounded-full font-medium hover:bg-sage-hover transition-colors flex items-center justify-center gap-2"
                    >
                      📞 Call {resource.phone}
                    </button>
                  )}
                  {resource.text && (
                    <button
                      onClick={() => handleEmergencyText(resource.text)}
                      className="w-full bg-sage-light text-sage-active px-4 py-2 rounded-full font-medium hover:bg-sage-muted transition-colors flex items-center justify-center gap-2"
                    >
                      💬 Text {resource.text}
                    </button>
                  )}
                  {resource.website && (
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-sanctuary/50 text-sage-active px-4 py-2 rounded-full font-medium hover:bg-sanctuary/70 transition-colors flex items-center justify-center gap-2"
                    >
                      🌐 Visit Website
                    </a>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-sage-light text-sage-active px-2 py-1 rounded-full text-xs font-medium">
                      {resource.availability}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resource.specializations.map(spec => (
                      <span key={spec} className="bg-sanctuary/30 text-sage-active px-2 py-1 rounded-full text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cultural & Identity-Specific Resources */}
        <section className="mb-12">
          <div className={`${isHighContrast ? 'bg-gray-800 border-white' : 'bg-sanctuary-glass backdrop-blur-xl border-sanctuary/30'} rounded-3xl p-8 border-2 shadow-xl`}>
            <h2 className={`text-3xl font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-6 text-center`}>
              Cultural & Identity-Affirming Support
            </h2>
            
            {/* Cultural Affirmation Banner */}
            <div className={`${isHighContrast ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-50 to-pink-50'} p-6 rounded-2xl mb-8 text-center`}>
              <p className={`text-xl ${isHighContrast ? 'text-white' : 'text-purple-900'} font-medium leading-relaxed transition-all duration-500`}>
                {culturalAffirmations[currentAffirmation]}
              </p>
            </div>
            
            {/* Language Selection */}
            <div className="mb-8">
              <h3 className={`text-lg font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-4 text-center`}>
                Choose Your Language / Elige tu idioma / Escolha seu idioma
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(culturalPhrases).map(([code, phrases]) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLanguage(code)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedLanguage === code
                        ? (isHighContrast ? 'bg-white text-black' : 'bg-purple-500 text-white')
                        : (isHighContrast ? 'bg-gray-700 text-white border border-gray-500' : 'bg-white/70 text-purple-700 hover:bg-purple-100')
                    }`}
                  >
                    {code === 'en' ? 'English' : 
                     code === 'es' ? 'Español' :
                     code === 'pt' ? 'Português' :
                     code === 'ko' ? '한국어' :
                     code === 'hi' ? 'हिंदी' :
                     code === 'de' ? 'Deutsch' : code.toUpperCase()}
                  </button>
                ))}
              </div>
              {selectedLanguage !== 'en' && (
                <div className={`mt-4 p-4 ${isHighContrast ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl text-center`}>
                  <p className={`text-lg ${isHighContrast ? 'text-white' : 'text-blue-900'} font-medium`}>
                    {currentPhrases?.emergency || 'Emergency help available'}
                  </p>
                  <p className={`${isHighContrast ? 'text-gray-300' : 'text-blue-700'} mt-2`}>
                    {currentPhrases?.support || 'You are not alone. Help is available.'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCulturalResources.map(resource => (
                <div key={resource.id} className={`${isHighContrast ? 'bg-gray-700 border-gray-500' : 'bg-white/80 border-purple-200'} rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all`}>
                  <h3 className={`text-lg font-medium ${isHighContrast ? 'text-white' : 'text-purple-900'} mb-3 leading-tight`}>{resource.name}</h3>
                  <p className={`${isHighContrast ? 'text-gray-300' : 'text-purple-700'} mb-4 text-sm leading-relaxed`}>{resource.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    {resource.phone && (
                      <button
                        onClick={() => handleEmergencyCall(resource.phone, resource.description)}
                        className={`crisis-touch-target w-full ${isHighContrast ? 'bg-white text-black border-2 border-black' : 'bg-purple-500 text-white'} px-4 py-3 rounded-xl font-medium hover:bg-purple-600 transition-all flex items-center justify-center gap-2 min-h-[56px]`}
                        aria-label={`Call ${resource.name} at ${resource.phone}`}
                      >
                        📞 {currentPhrases?.call || 'Call'} {resource.phone}
                      </button>
                    )}
                    {resource.text && (
                      <button
                        onClick={() => handleEmergencyText(resource.text)}
                        className={`crisis-touch-target w-full ${isHighContrast ? 'bg-gray-600 text-white border-2 border-gray-400' : 'bg-green-500 text-white'} px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2 min-h-[56px]`}
                        aria-label={`Text ${resource.name} at ${resource.text}`}
                      >
                        💬 {currentPhrases?.text || 'Text'} {resource.text}
                      </button>
                    )}
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`crisis-touch-target w-full ${isHighContrast ? 'bg-gray-500 text-white border-2 border-gray-300' : 'bg-blue-500 text-white'} px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2 min-h-[56px]`}
                        aria-label={`Visit ${resource.name} website`}
                      >
                        🌐 Visit Website
                      </a>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className={`${isHighContrast ? 'bg-white text-black' : 'bg-purple-100 text-purple-800'} px-3 py-1 rounded-full text-xs font-medium`}>
                        {resource.availability}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {resource.specializations.map(spec => (
                        <span key={spec} className={`${isHighContrast ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-full text-xs`}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* International Resources */}
        <section className="mb-12">
          <h2 className={`text-3xl font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-8 text-center`}>
            International Crisis Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternationalResources.map(resource => (
              <div key={resource.id} className={`${isHighContrast ? 'bg-gray-800 border-white' : 'bg-sanctuary-glass backdrop-blur-xl border-sanctuary/30'} rounded-3xl p-6 border-2 shadow-xl hover:shadow-2xl transition-all`}>
                <h3 className={`text-lg font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-3 leading-tight`}>{resource.name}</h3>
                <p className={`${isHighContrast ? 'text-gray-300' : 'text-sage-active/80'} mb-4 text-sm leading-relaxed`}>{resource.description}</p>
                
                <div className="space-y-3 mb-4">
                  {resource.phone && (
                    <button
                      onClick={() => handleEmergencyCall(resource.phone, resource.description)}
                      className={`crisis-touch-target w-full ${isHighContrast ? 'bg-white text-black border-2 border-black' : 'bg-sage-primary text-sanctuary'} px-4 py-3 rounded-xl font-medium hover:bg-sage-hover transition-all flex items-center justify-center gap-2 min-h-[56px]`}
                      aria-label={`Call ${resource.name} at ${resource.phone}`}
                    >
                      📞 Call {resource.phone}
                    </button>
                  )}
                  {resource.website && (
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`crisis-touch-target w-full ${isHighContrast ? 'bg-gray-600 text-white border-2 border-gray-400' : 'bg-sanctuary/50 text-sage-active'} px-4 py-3 rounded-xl font-medium hover:bg-sanctuary/70 transition-all flex items-center justify-center gap-2 min-h-[56px]`}
                      aria-label={`Visit ${resource.name} website`}
                    >
                      🌐 Visit Website
                    </a>
                  )}
                </div>
                
                <div className="space-y-2">
                  <span className={`${isHighContrast ? 'bg-white text-black' : 'bg-sage-light text-sage-active'} px-3 py-1 rounded-full text-xs font-medium inline-block`}>
                    {resource.availability}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {resource.languages.map(lang => (
                      <span key={lang} className={`${isHighContrast ? 'bg-gray-600 text-white' : 'bg-sanctuary/30 text-sage-active'} px-2 py-1 rounded-full text-xs`}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Planning */}
        <section className="mb-12">
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl p-8 border border-sanctuary/30 shadow-xl">
            <h2 className="text-2xl font-medium text-sage-active mb-6">Safety Planning</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-sage-active mb-3">Create a Safety Plan</h3>
                <ul className="space-y-2 text-sage-active/80">
                  <li>• Identify personal warning signs</li>
                  <li>• List coping strategies that help</li>
                  <li>• Include trusted contacts</li>
                  <li>• Note crisis hotline numbers</li>
                  <li>• Remove potential means of harm</li>
                  <li>• Create a safe environment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-active mb-3">When to Seek Help</h3>
                <ul className="space-y-2 text-sage-active/80">
                  <li>• Thoughts of hurting yourself or others</li>
                  <li>• Feeling overwhelmed or hopeless</li>
                  <li>• Substance use affecting daily life</li>
                  <li>• Relationship or domestic violence</li>
                  <li>• Trauma or sexual assault</li>
                  <li>• Any time you need someone to talk to</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Support */}
        <section>
          <div className="text-center bg-sanctuary-glass backdrop-blur-xl rounded-3xl p-8 border border-sanctuary/30 shadow-xl">
            <h2 className="text-2xl font-medium text-sage-active mb-4">You Are Not Alone</h2>
            <p className="text-sage-active/80 text-lg mb-6 max-w-2xl mx-auto">
              Your life has value. Your struggles are valid. Support is available, and there are people who care about you and want to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/journal"
                className="bg-sage-primary text-sanctuary px-8 py-3 rounded-full font-medium hover:bg-sage-hover transition-colors"
              >
                Return to Your Journal
              </Link>
              <Link
                href="/dashboard"
                className="bg-sanctuary/50 text-sage-active px-8 py-3 rounded-full font-medium hover:bg-sanctuary/70 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Grounding Techniques Section */}
      <section className="mb-12">
        <div className={`${isHighContrast ? 'bg-gray-800 border-white' : 'bg-sanctuary-glass backdrop-blur-xl border-sanctuary/30'} rounded-3xl p-8 border-2 shadow-xl max-w-4xl mx-auto`}>
          <h2 className={`text-3xl font-medium ${isHighContrast ? 'text-white' : 'text-sage-active'} mb-6 text-center`}>Immediate Grounding & Breathing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`${isHighContrast ? 'bg-gray-700' : 'bg-blue-50'} p-6 rounded-2xl`}>
              <h3 className={`text-xl font-medium ${isHighContrast ? 'text-white' : 'text-blue-900'} mb-4 flex items-center gap-2`}>
                🫁 Box Breathing
              </h3>
              <div className={`space-y-3 ${isHighContrast ? 'text-gray-300' : 'text-blue-800'} text-lg leading-relaxed`}>
                <p>• Breathe in for 4 counts</p>
                <p>• Hold for 4 counts</p>
                <p>• Breathe out for 6 counts</p>
                <p>• Repeat 4-6 times</p>
              </div>
            </div>
            <div className={`${isHighContrast ? 'bg-gray-700' : 'bg-green-50'} p-6 rounded-2xl`}>
              <h3 className={`text-xl font-medium ${isHighContrast ? 'text-white' : 'text-green-900'} mb-4 flex items-center gap-2`}>
                🎯 5-4-3-2-1 Grounding
              </h3>
              <div className={`space-y-3 ${isHighContrast ? 'text-gray-300' : 'text-green-800'} text-lg leading-relaxed`}>
                <p>• 5 things you can see</p>
                <p>• 4 things you can touch</p>
                <p>• 3 things you can hear</p>
                <p>• 2 things you can smell</p>
                <p>• 1 thing you can taste</p>
              </div>
            </div>
          </div>
          <div className={`${isHighContrast ? 'bg-gray-700' : 'bg-purple-50'} p-6 rounded-2xl mt-6 text-center`}>
            <h3 className={`text-xl font-medium ${isHighContrast ? 'text-white' : 'text-purple-900'} mb-4`}>
              💫 Emergency Affirmations
            </h3>
            <div className={`${isHighContrast ? 'text-gray-300' : 'text-purple-800'} text-lg space-y-2`}>
              <p>"I am safe in this moment."</p>
              <p>"This feeling will pass."</p>
              <p>"I am worthy of support and care."</p>
              <p>"Help is available to me."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Panic Button - Extra Large for Crisis States */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handlePanicButton}
          className={`crisis-touch-target w-20 h-20 rounded-full ${isHighContrast ? 'bg-white text-black border-4 border-black' : 'bg-red-500 text-white'} shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center ${emergencyMode ? 'animate-bounce' : 'animate-pulse'}`}
          title="Emergency Crisis Support - Call 988 (Press F1)"
          aria-label="Emergency crisis support - Call 988 immediately"
        >
          <span className="text-3xl font-medium">🆘</span>
        </button>
      </div>
      
      {/* Accessibility and Performance Info */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className={`${isHighContrast ? 'bg-gray-800 text-white border-white' : 'bg-white/90 text-gray-800 border-gray-300'} px-4 py-2 rounded-xl border shadow-lg text-sm`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></div>
            <span>{isOffline ? 'Offline' : 'Online'}</span>
          </div>
          {voiceEnabled && (
            <div className="text-xs mt-1 opacity-75">
              Voice: Triple-tap + speak
            </div>
          )}
        </div>
      </div>
      </div>
    </CrisisResourceIntegration>
  );
}