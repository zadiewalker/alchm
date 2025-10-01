// ALCHM Enterprise Security Infrastructure
// Advanced Firebase App Check, Security Monitoring, and Threat Detection
// Mental Health Data Protection with Real-time Security Analytics

import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '@/lib/firebase';

// ===== SECURITY INTERFACES =====

interface SecurityThreat {
  threatId: string;
  userId?: string;
  threatType: 'UNAUTHORIZED_ACCESS' | 'DATA_BREACH' | 'SUSPICIOUS_ACTIVITY' | 'MALICIOUS_REQUEST' | 'CREDENTIAL_STUFFING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: string;
  mitigationActions: string[];
  status: 'DETECTED' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
}

interface SecurityMonitoringConfig {
  enableRealTimeMonitoring: boolean;
  enableThreatDetection: boolean;
  enableBehavioralAnalysis: boolean;
  enableGeofencing: boolean;
  alertThresholds: {
    failedLoginAttempts: number;
    suspiciousDeviceChanges: number;
    unusualAccessPatterns: number;
    dataExfiltrationAlerts: number;
  };
  autoMitigationEnabled: boolean;
}

interface DeviceFingerprint {
  deviceId: string;
  userId: string;
  deviceType: 'MOBILE' | 'DESKTOP' | 'TABLET' | 'UNKNOWN';
  operatingSystem: string;
  browser: string;
  screenResolution: string;
  timezone: string;
  language: string;
  trustedDevice: boolean;
  lastSeen: Date;
  riskScore: number;
}

interface AccessPatternAnalysis {
  userId: string;
  normalAccessHours: number[];
  normalLocations: string[];
  averageSessionDuration: number;
  typicalDeviceCount: number;
  behaviorBaseline: {
    journalEntryFrequency: number;
    averageEntryLength: number;
    moodPatterns: number[];
    featureUsagePatterns: Record<string, number>;
  };
  anomalyScore: number;
  lastAnalyzed: Date;
}

// ===== APP CHECK CONFIGURATION =====

let appCheck: any = null;

export function initializeEnterpriseAppCheck() {
  try {
    // Production reCAPTCHA configuration
    if (typeof window !== 'undefined' && !appCheck) {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
        isTokenAutoRefreshEnabled: true
      });

      console.log('✅ Firebase App Check initialized for mental health data protection');
    }
  } catch (error) {
    console.error('❌ Failed to initialize App Check:', error);
  }
}

export async function getAppCheckToken(): Promise<string | null> {
  try {
    if (appCheck) {
      const appCheckTokenResponse = await getToken(appCheck);
      return appCheckTokenResponse.token;
    }
    return null;
  } catch (error) {
    console.error('Failed to get App Check token:', error);
    return null;
  }
}

// ===== SECURITY MONITORING =====

class EnterpriseSecurityMonitor {
  private config: SecurityMonitoringConfig;
  private auth = getAuth(app);
  private functions = getFunctions(app);
  
  constructor(config: SecurityMonitoringConfig) {
    this.config = config;
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (this.config.enableRealTimeMonitoring) {
      this.startAuthMonitoring();
      this.startBehavioralAnalysis();
      this.startDeviceMonitoring();
    }
  }

  private startAuthMonitoring() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.analyzeAuthEvent(user, 'LOGIN');
        await this.updateDeviceFingerprint(user);
      }
    });
  }

  async analyzeAuthEvent(user: User, eventType: 'LOGIN' | 'LOGOUT' | 'TOKEN_REFRESH') {
    try {
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const accessPattern = await this.getAccessPattern(user.uid);
      
      // Check for suspicious login patterns
      const suspiciousActivity = await this.detectSuspiciousLogin(user, deviceFingerprint, accessPattern);
      
      if (suspiciousActivity.detected) {
        await this.reportSecurityThreat({
          threatId: `auth_${Date.now()}`,
          userId: user.uid,
          threatType: 'SUSPICIOUS_ACTIVITY',
          severity: suspiciousActivity.severity,
          timestamp: new Date(),
          ipAddress: await this.getUserIP(),
          userAgent: navigator.userAgent,
          details: suspiciousActivity.details,
          mitigationActions: suspiciousActivity.suggestedActions,
          status: 'DETECTED'
        });
      }

      // Log successful authentication
      await this.logSecurityEvent({
        userId: user.uid,
        eventType,
        deviceFingerprint,
        timestamp: new Date(),
        success: true
      });

    } catch (error) {
      console.error('Error analyzing auth event:', error);
    }
  }

  private async detectSuspiciousLogin(
    user: User, 
    deviceFingerprint: DeviceFingerprint, 
    accessPattern: AccessPatternAnalysis
  ): Promise<{ detected: boolean; severity: SecurityThreat['severity']; details: string; suggestedActions: string[] }> {
    
    const suspiciousIndicators = [];
    let severity: SecurityThreat['severity'] = 'LOW';
    const suggestedActions: string[] = [];

    // Check for new device
    if (!deviceFingerprint.trustedDevice) {
      suspiciousIndicators.push('New device detected');
      suggestedActions.push('Require additional authentication');
    }

    // Check for unusual access time
    const currentHour = new Date().getHours();
    if (!accessPattern.normalAccessHours.includes(currentHour)) {
      suspiciousIndicators.push('Unusual access time');
      severity = 'MEDIUM';
    }

    // Check for impossible travel (if location data available)
    const locationCheck = await this.checkImpossibleTravel(user.uid);
    if (locationCheck.impossible) {
      suspiciousIndicators.push('Impossible travel detected');
      severity = 'HIGH';
      suggestedActions.push('Force logout all devices', 'Require password change');
    }

    // Check for high-risk device characteristics
    if (deviceFingerprint.riskScore > 0.8) {
      suspiciousIndicators.push('High-risk device detected');
      severity = 'HIGH';
      suggestedActions.push('Restrict sensitive operations', 'Enable enhanced monitoring');
    }

    return {
      detected: suspiciousIndicators.length > 0,
      severity,
      details: suspiciousIndicators.join('; '),
      suggestedActions
    };
  }

  private async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    const deviceId = await this.generateDeviceId();
    
    return {
      deviceId,
      userId: this.auth.currentUser?.uid || '',
      deviceType: this.detectDeviceType(),
      operatingSystem: this.detectOS(),
      browser: this.detectBrowser(),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      trustedDevice: await this.isDeviceTrusted(deviceId),
      lastSeen: new Date(),
      riskScore: await this.calculateDeviceRiskScore()
    };
  }

  private async generateDeviceId(): Promise<string> {
    // Create stable device identifier using multiple factors
    const factors = [
      navigator.userAgent,
      screen.width.toString(),
      screen.height.toString(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language
    ];
    
    const combinedFactors = factors.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(combinedFactors);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private detectDeviceType(): DeviceFingerprint['deviceType'] {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'MOBILE';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'TABLET';
    } else if (/desktop|windows|mac|linux/i.test(userAgent)) {
      return 'DESKTOP';
    }
    
    return 'UNKNOWN';
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Unknown';
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Unknown';
  }

  private async isDeviceTrusted(deviceId: string): Promise<boolean> {
    try {
      const deviceDoc = await getDoc(doc(db, 'trusted_devices', deviceId));
      return deviceDoc.exists() && deviceDoc.data()?.trusted === true;
    } catch (error) {
      return false;
    }
  }

  private async calculateDeviceRiskScore(): Promise<number> {
    let riskScore = 0;
    
    // Check for suspicious browser characteristics
    if (!navigator.cookieEnabled) riskScore += 0.3;
    if (!window.localStorage) riskScore += 0.2;
    
    // Check for automation tools
    if ((window as any).webdriver || (navigator as any).webdriver) riskScore += 0.8;
    if ((window as any).callPhantom || (window as any)._phantom) riskScore += 0.8;
    
    // Check for unusual screen characteristics
    if (screen.width < 800 || screen.height < 600) riskScore += 0.1;
    
    // Check for VPN/Proxy indicators (simplified)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timezone || timezone === 'UTC') riskScore += 0.2;
    
    return Math.min(riskScore, 1.0);
  }

  private async getAccessPattern(userId: string): Promise<AccessPatternAnalysis> {
    try {
      const patternDoc = await getDoc(doc(db, 'access_patterns', userId));
      
      if (patternDoc.exists()) {
        const data = patternDoc.data();
        return {
          ...data,
          lastAnalyzed: data.lastAnalyzed?.toDate() || new Date()
        } as AccessPatternAnalysis;
      }
      
      // Return default pattern for new users
      return {
        userId,
        normalAccessHours: [],
        normalLocations: [],
        averageSessionDuration: 0,
        typicalDeviceCount: 1,
        behaviorBaseline: {
          journalEntryFrequency: 0,
          averageEntryLength: 0,
          moodPatterns: [],
          featureUsagePatterns: {}
        },
        anomalyScore: 0,
        lastAnalyzed: new Date()
      };
    } catch (error) {
      console.error('Error getting access pattern:', error);
      throw error;
    }
  }

  private async checkImpossibleTravel(userId: string): Promise<{ impossible: boolean; details?: string }> {
    // This would integrate with geolocation services to check for impossible travel
    // For now, return a placeholder
    return { impossible: false };
  }

  private async getUserIP(): Promise<string> {
    try {
      // This would typically be done server-side
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  private async startBehavioralAnalysis() {
    if (!this.config.enableBehavioralAnalysis) return;

    // Monitor user behavior patterns
    this.monitorJournalingPatterns();
    this.monitorNavigationPatterns();
    this.monitorInteractionPatterns();
  }

  private monitorJournalingPatterns() {
    // Track journaling behavior for anomaly detection
    window.addEventListener('beforeunload', () => {
      this.analyzeSessionBehavior();
    });
  }

  private monitorNavigationPatterns() {
    // Track navigation patterns
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      // Log navigation event
      originalPushState.apply(history, args);
    };
  }

  private monitorInteractionPatterns() {
    let interactionCount = 0;
    let lastInteraction = Date.now();

    ['click', 'keypress', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        const now = Date.now();
        const timeSinceLastInteraction = now - lastInteraction;
        
        // Detect bot-like behavior
        if (timeSinceLastInteraction < 50 && interactionCount > 100) {
          this.reportSecurityThreat({
            threatId: `bot_${Date.now()}`,
            threatType: 'SUSPICIOUS_ACTIVITY',
            severity: 'MEDIUM',
            timestamp: new Date(),
            ipAddress: 'unknown',
            userAgent: navigator.userAgent,
            details: 'Bot-like interaction patterns detected',
            mitigationActions: ['Rate limit requests', 'Require CAPTCHA'],
            status: 'DETECTED'
          });
        }
        
        lastInteraction = now;
      });
    });
  }

  private async startDeviceMonitoring() {
    // Monitor for device changes and new device registrations
    setInterval(async () => {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.updateDeviceFingerprint(currentUser);
      }
    }, 60000); // Check every minute
  }

  private async updateDeviceFingerprint(user: User) {
    try {
      const fingerprint = await this.generateDeviceFingerprint();
      fingerprint.userId = user.uid;
      
      await setDoc(doc(db, 'device_fingerprints', fingerprint.deviceId), {
        ...fingerprint,
        lastSeen: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      console.error('Error updating device fingerprint:', error);
    }
  }

  private async analyzeSessionBehavior() {
    // Analyze current session for anomalies
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    try {
      const sessionData = {
        userId: currentUser.uid,
        sessionDuration: Date.now() - (window as any).sessionStartTime,
        interactionCount: (window as any).interactionCount || 0,
        pagesVisited: (window as any).pagesVisited || 1,
        journalEntriesCreated: (window as any).journalEntriesCreated || 0
      };

      // Check for anomalous session behavior
      const anomalyScore = await this.calculateSessionAnomalyScore(sessionData);
      
      if (anomalyScore > 0.8) {
        await this.reportSecurityThreat({
          threatId: `session_${Date.now()}`,
          userId: currentUser.uid,
          threatType: 'SUSPICIOUS_ACTIVITY',
          severity: 'MEDIUM',
          timestamp: new Date(),
          ipAddress: await this.getUserIP(),
          userAgent: navigator.userAgent,
          details: `Anomalous session behavior detected (score: ${anomalyScore})`,
          mitigationActions: ['Monitor closely', 'Log additional details'],
          status: 'DETECTED'
        });
      }

    } catch (error) {
      console.error('Error analyzing session behavior:', error);
    }
  }

  private async calculateSessionAnomalyScore(sessionData: any): Promise<number> {
    // Calculate anomaly score based on session characteristics
    let anomalyScore = 0;
    
    // Unusually short session with many interactions
    if (sessionData.sessionDuration < 30000 && sessionData.interactionCount > 50) {
      anomalyScore += 0.4;
    }
    
    // Unusually long session with no interactions
    if (sessionData.sessionDuration > 3600000 && sessionData.interactionCount < 5) {
      anomalyScore += 0.3;
    }
    
    // Many pages visited in short time
    if (sessionData.pagesVisited > 20 && sessionData.sessionDuration < 60000) {
      anomalyScore += 0.5;
    }
    
    return Math.min(anomalyScore, 1.0);
  }

  async reportSecurityThreat(threat: SecurityThreat) {
    try {
      // Store threat in Firestore
      await setDoc(doc(db, 'security_threats', threat.threatId), {
        ...threat,
        timestamp: serverTimestamp()
      });

      // If critical threat, trigger immediate response
      if (threat.severity === 'CRITICAL') {
        await this.triggerEmergencyResponse(threat);
      }

      // Log to console for development
      console.warn('🚨 Security threat detected:', threat);

    } catch (error) {
      console.error('Error reporting security threat:', error);
    }
  }

  private async triggerEmergencyResponse(threat: SecurityThreat) {
    try {
      // Call Cloud Function for emergency response
      const emergencyResponse = httpsCallable(this.functions, 'handleSecurityThreat');
      await emergencyResponse({ threat });

      console.log('🚨 Emergency security response triggered');
    } catch (error) {
      console.error('Error triggering emergency response:', error);
    }
  }

  private async logSecurityEvent(event: any) {
    try {
      await setDoc(doc(collection(db, 'security_events')), {
        ...event,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }
}

// ===== CRISIS INTERVENTION SECURITY =====

export class CrisisInterventionSecurity {
  private auth = getAuth(app);
  private functions = getFunctions(app);

  async analyzeCrisisRisk(journalText: string, userId: string): Promise<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    interventionRequired: boolean;
    professionalNotificationRequired: boolean;
    emergencyContactRequired: boolean;
  }> {
    try {
      const analyzeCrisisRisk = httpsCallable(this.functions, 'analyzeCrisisRisk');
      const result = await analyzeCrisisRisk({
        text: journalText,
        userId,
        timestamp: new Date().toISOString()
      });

      return result.data as any;
    } catch (error) {
      console.error('Error analyzing crisis risk:', error);
      // Fail-safe: assume medium risk if analysis fails
      return {
        riskLevel: 'MEDIUM',
        interventionRequired: true,
        professionalNotificationRequired: false,
        emergencyContactRequired: false
      };
    }
  }

  async triggerCrisisIntervention(userId: string, riskLevel: string, details: string) {
    try {
      const triggerIntervention = httpsCallable(this.functions, 'triggerCrisisIntervention');
      await triggerIntervention({
        userId,
        riskLevel,
        details,
        timestamp: new Date().toISOString()
      });

      console.log('🚑 Crisis intervention triggered');
    } catch (error) {
      console.error('Error triggering crisis intervention:', error);
    }
  }
}

// ===== INITIALIZE SECURITY =====

const defaultSecurityConfig: SecurityMonitoringConfig = {
  enableRealTimeMonitoring: true,
  enableThreatDetection: true,
  enableBehavioralAnalysis: true,
  enableGeofencing: false,
  alertThresholds: {
    failedLoginAttempts: 5,
    suspiciousDeviceChanges: 3,
    unusualAccessPatterns: 10,
    dataExfiltrationAlerts: 2
  },
  autoMitigationEnabled: true
};

// Initialize security systems
let securityMonitor: EnterpriseSecurityMonitor | null = null;
let crisisSecurity: CrisisInterventionSecurity | null = null;

export function initializeEnterpriseSecurity(config: Partial<SecurityMonitoringConfig> = {}) {
  const finalConfig = { ...defaultSecurityConfig, ...config };
  
  securityMonitor = new EnterpriseSecurityMonitor(finalConfig);
  crisisSecurity = new CrisisInterventionSecurity();
  
  console.log('🛡️ Enterprise security systems initialized');
}

export function getSecurityMonitor(): EnterpriseSecurityMonitor | null {
  return securityMonitor;
}

export function getCrisisSecurity(): CrisisInterventionSecurity | null {
  return crisisSecurity;
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Set session start time for behavior analysis
  (window as any).sessionStartTime = Date.now();
  (window as any).interactionCount = 0;
  (window as any).pagesVisited = 1;
  (window as any).journalEntriesCreated = 0;
  
  // Initialize security when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeEnterpriseAppCheck();
      initializeEnterpriseSecurity();
    });
  } else {
    initializeEnterpriseAppCheck();
    initializeEnterpriseSecurity();
  }
}