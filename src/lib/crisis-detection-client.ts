/**
 * ALCHM Crisis Detection Client Utility
 * Mobile-optimized crisis detection with offline fallbacks
 * 
 * CRITICAL: This system ensures crisis detection works even when network fails
 * Implements battery-efficient processing and immediate response capabilities
 */

import { getClientConfig } from '@/lib/config';

// Types for crisis detection responses
export interface CrisisDetectionResponse {
  crisisDetected: boolean;
  severity: 'none' | 'low' | 'medium' | 'high' | 'immediate';
  resources: CrisisResource[];
  interventions: string[];
  culturalConsiderations: string[];
  emergencyContacts: EmergencyContact[];
  confidence?: 'low' | 'medium' | 'high';
  urgency?: 'none' | 'low' | 'medium' | 'high';
  responseTime?: number;
  offline?: boolean;
  failsafe?: boolean;
}

export interface CrisisResource {
  name: string;
  contact: string;
  type: 'phone' | 'text' | 'web' | 'app';
  country: string;
  description: string;
  languages?: string[];
  culturalFocus?: string[];
  available24h?: boolean;
}

export interface EmergencyContact {
  name: string;
  number: string;
  country: string;
  type: 'emergency' | 'crisis' | 'mental_health';
}

// Offline crisis patterns for immediate detection
const OFFLINE_CRISIS_PATTERNS = {
  en: [
    'want to die', 'kill myself', 'end it all', 'suicide', 'can\'t go on',
    'better off dead', 'no point living', 'ending my life', 'not worth living',
    'want to disappear', 'can\'t take anymore', 'ready to give up'
  ],
  es: [
    'quiero morir', 'matarme', 'suicidio', 'terminar con todo', 'no puedo más',
    'mejor muerto', 'no vale la pena vivir', 'acabar con mi vida'
  ],
  pt: [
    'quero morrer', 'me matar', 'suicídio', 'acabar com tudo', 'não aguento mais',
    'melhor morto', 'não vale a pena viver', 'acabar com minha vida'
  ]
};

// Offline crisis resources
const OFFLINE_CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: '988',
    type: 'phone',
    country: 'US',
    description: '24/7 crisis support and suicide prevention',
    available24h: true
  },
  {
    name: 'Crisis Text Line',
    contact: '741741',
    type: 'text',
    country: 'US',
    description: 'Text HOME to 741741 for 24/7 crisis support',
    available24h: true
  },
  {
    name: 'Emergency Services',
    contact: '911',
    type: 'phone',
    country: 'US',
    description: 'For immediate medical emergencies',
    available24h: true
  }
];

const OFFLINE_EMERGENCY_CONTACTS: EmergencyContact[] = [
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
  }
];

// Mobile-optimized language detection
function detectLanguageMobile(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Quick checks for performance
  if (/\b(yo|mi|que|de|la|el|en|es|se|no|te|lo)\b/.test(lowerText)) return 'es';
  if (/\b(eu|meu|que|de|da|do|em|é|se|não|te)\b/.test(lowerText)) return 'pt';
  
  return 'en'; // Default
}

// Offline crisis detection for when network fails
function detectCrisisOffline(text: string): { detected: boolean; language: string } {
  const language = detectLanguageMobile(text);
  const lowerText = text.toLowerCase();
  
  const patterns = OFFLINE_CRISIS_PATTERNS[language as keyof typeof OFFLINE_CRISIS_PATTERNS] || OFFLINE_CRISIS_PATTERNS.en;
  const detected = patterns.some(pattern => lowerText.includes(pattern.toLowerCase()));
  
  return { detected, language };
}

// Network availability check with timeout
async function checkNetworkAvailability(): Promise<boolean> {
  try {
    // Quick network test with short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch('/api/health/ping', {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Battery-efficient debounced detection
class CrisisDetectionQueue {
  private queue: Array<{ text: string; resolve: (result: CrisisDetectionResponse) => void; reject: (error: Error) => void }> = [];
  private processing = false;
  private lastRequest = 0;
  private readonly minInterval = 1000; // Minimum 1 second between requests for battery efficiency

  async addRequest(text: string): Promise<CrisisDetectionResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push({ text, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequest;
      
      if (timeSinceLastRequest < this.minInterval) {
        await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
      }
      
      const request = this.queue.shift();
      if (request) {
        try {
          const result = await this.performDetection(request.text);
          request.resolve(result);
        } catch (error) {
          request.reject(error instanceof Error ? error : new Error('Unknown detection error'));
        }
        
        this.lastRequest = Date.now();
      }
    }
    
    this.processing = false;
  }

  private async performDetection(text: string): Promise<CrisisDetectionResponse> {
    const startTime = Date.now();
    
    // First check offline patterns for immediate response
    const offlineCheck = detectCrisisOffline(text);
    
    if (offlineCheck.detected) {
      return {
        crisisDetected: true,
        severity: 'immediate',
        resources: OFFLINE_CRISIS_RESOURCES,
        interventions: [
          'We care about you and want you to be safe',
          'Immediate professional support is available',
          'Call 988 for crisis support right now'
        ],
        culturalConsiderations: [],
        emergencyContacts: OFFLINE_EMERGENCY_CONTACTS,
        confidence: 'high',
        urgency: 'high',
        responseTime: Date.now() - startTime,
        offline: true
      };
    }
    
    // Check network availability
    const networkAvailable = await checkNetworkAvailability();
    
    if (!networkAvailable) {
      // Network unavailable - use offline fallback
      return {
        crisisDetected: false,
        severity: 'none',
        resources: OFFLINE_CRISIS_RESOURCES, // Always provide resources offline
        interventions: [
          'Crisis resources are available even when offline',
          'Call 988 if you need immediate support'
        ],
        culturalConsiderations: [],
        emergencyContacts: OFFLINE_EMERGENCY_CONTACTS,
        responseTime: Date.now() - startTime,
        offline: true
      };
    }
    
    // Network available - use API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch('/api/crisis-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Crisis detection API error: ${response.status}`);
      }
      
      const result = await response.json();
      result.responseTime = Date.now() - startTime;
      return result;
      
    } catch (error) {
      // API failed - fall back to offline detection with safety bias
      console.warn('Crisis detection API failed, using offline fallback:', error);
      
      return {
        crisisDetected: true, // Fail safe - assume crisis when unsure
        severity: 'medium',
        resources: OFFLINE_CRISIS_RESOURCES,
        interventions: [
          'We care about you and want you to be safe',
          'Technical difficulties - but help is available',
          'Call 988 for crisis support'
        ],
        culturalConsiderations: [],
        emergencyContacts: OFFLINE_EMERGENCY_CONTACTS,
        confidence: 'unknown',
        urgency: 'medium',
        responseTime: Date.now() - startTime,
        offline: true,
        failsafe: true
      };
    }
  }
}

// Global queue instance for battery efficiency
const detectionQueue = new CrisisDetectionQueue();

// Main crisis detection function
export async function detectCrisis(text: string): Promise<CrisisDetectionResponse> {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      crisisDetected: false,
      severity: 'none',
      resources: [],
      interventions: [],
      culturalConsiderations: [],
      emergencyContacts: []
    };
  }
  
  return detectionQueue.addRequest(text.trim());
}

// Immediate crisis check for real-time typing
export function checkImmediateCrisis(text: string): boolean {
  if (!text || text.length < 5) return false;
  
  const offlineCheck = detectCrisisOffline(text);
  return offlineCheck.detected;
}

// Preload crisis resources for offline access
export function preloadCrisisResources(): void {
  try {
    // Store resources in localStorage for offline access
    const resources = {
      crisisResources: OFFLINE_CRISIS_RESOURCES,
      emergencyContacts: OFFLINE_EMERGENCY_CONTACTS,
      lastUpdated: Date.now()
    };
    
    localStorage.setItem('alchm_crisis_resources', JSON.stringify(resources));
  } catch (error) {
    console.warn('Could not preload crisis resources:', error);
  }
}

// Get cached crisis resources when offline
export function getCachedCrisisResources(): { resources: CrisisResource[]; contacts: EmergencyContact[] } {
  try {
    const cached = localStorage.getItem('alchm_crisis_resources');
    if (cached) {
      const data = JSON.parse(cached);
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Use cached data if less than 24 hours old
      if (Date.now() - data.lastUpdated < oneDay) {
        return {
          resources: data.crisisResources || OFFLINE_CRISIS_RESOURCES,
          contacts: data.emergencyContacts || OFFLINE_EMERGENCY_CONTACTS
        };
      }
    }
  } catch (error) {
    console.warn('Could not load cached crisis resources:', error);
  }
  
  // Fall back to built-in resources
  return {
    resources: OFFLINE_CRISIS_RESOURCES,
    contacts: OFFLINE_EMERGENCY_CONTACTS
  };
}

// Service worker registration for offline support
export function registerCrisisServiceWorker(): void {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/crisis-sw.js')
      .then(registration => {
        console.log('Crisis service worker registered:', registration);
      })
      .catch(error => {
        console.warn('Crisis service worker registration failed:', error);
      });
  }
}

// Initialize crisis detection system
export function initializeCrisisDetection(): void {
  preloadCrisisResources();
  registerCrisisServiceWorker();
  
  // Preload the API endpoint for faster response
  if (navigator.onLine) {
    fetch('/api/crisis-detection', { method: 'GET' }).catch(() => {
      // Ignore errors - this is just a preload
    });
  }
}

// Crisis detection hook for React components
export function useCrisisDetection() {
  const detect = async (text: string) => {
    return detectCrisis(text);
  };
  
  const checkImmediate = (text: string) => {
    return checkImmediateCrisis(text);
  };
  
  const getCachedResources = () => {
    return getCachedCrisisResources();
  };
  
  return {
    detect,
    checkImmediate,
    getCachedResources,
    isOnline: navigator.onLine
  };
}