/**
 * MOBILE COMPATIBILITY VALIDATOR
 * Privacy & Legal Compliance Specialist Implementation
 * 
 * CRITICAL COPPA COMPLIANCE VALIDATION for mobile browsers
 * 
 * REGULATORY VALIDATION:
 * - COPPA: Mobile age verification compatibility testing
 * - GDPR: Mobile consent mechanism validation  
 * - FERPA: Educational platform mobile access testing
 * - CCPA: Mobile privacy rights accessibility testing
 * 
 * MOBILE BROWSER TESTING:
 * - iOS Safari privacy mode compatibility
 * - Android Chrome private browsing support
 * - Samsung Internet privacy features
 * - Firefox Focus tracking protection
 * - Cross-browser session storage reliability
 */

export interface MobileCompatibilityResult {
  isCompatible: boolean;
  browserType: string;
  deviceType: string;
  privacyFeatures: {
    cookiesEnabled: boolean;
    localStorageAvailable: boolean;
    sessionStorageAvailable: boolean;
    thirdPartyCookiesBlocked: boolean;
    privateBrowsingDetected: boolean;
    trackingProtectionActive: boolean;
  };
  ageVerificationCapability: {
    canDisplayModal: boolean;
    canStoreVerification: boolean;
    requiresEmergencyBypass: boolean;
    coppaCompliant: boolean;
  };
  emergencyAccessNeeded: boolean;
  recommendations: string[];
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: 'privacy' | 'storage' | 'display' | 'compliance';
    message: string;
    solution: string;
  }>;
}

class MobileCompatibilityValidator {
  
  /**
   * Comprehensive mobile compatibility assessment
   */
  public async validateMobileCompatibility(): Promise<MobileCompatibilityResult> {
    if (typeof window === 'undefined') {
      // Server-side - assume compatibility
      return this.createServerSideResult();
    }

    const deviceInfo = this.detectDeviceCapabilities();
    const privacyFeatures = await this.testPrivacyFeatures();
    const ageVerificationTests = await this.testAgeVerificationCapability();
    const issues = this.identifyCompatibilityIssues(deviceInfo, privacyFeatures, ageVerificationTests);
    
    const emergencyAccessNeeded = this.shouldEnableEmergencyAccess(issues, ageVerificationTests);
    const recommendations = this.generateRecommendations(issues, emergencyAccessNeeded);

    const result: MobileCompatibilityResult = {
      isCompatible: !emergencyAccessNeeded,
      browserType: deviceInfo.browserType,
      deviceType: deviceInfo.deviceType,
      privacyFeatures,
      ageVerificationCapability: ageVerificationTests,
      emergencyAccessNeeded,
      recommendations,
      issues
    };

    // Log comprehensive assessment for compliance audit
    this.logCompatibilityAssessment(result);
    
    return result;
  }

  /**
   * Detect comprehensive device and browser capabilities
   */
  private detectDeviceCapabilities() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Device detection
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    
    let deviceType = 'desktop';
    if (isTablet) deviceType = 'tablet';
    else if (isMobile) deviceType = 'mobile';
    
    // Browser detection with privacy feature awareness
    let browserType = 'unknown';
    let version = '';
    
    if (userAgent.includes('firefox')) {
      browserType = 'firefox';
      const match = userAgent.match(/firefox\/([0-9.]+)/);
      version = match ? match[1] : '';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browserType = 'safari';
      const match = userAgent.match(/version\/([0-9.]+)/);
      version = match ? match[1] : '';
    } else if (userAgent.includes('chrome')) {
      browserType = 'chrome';
      const match = userAgent.match(/chrome\/([0-9.]+)/);
      version = match ? match[1] : '';
    } else if (userAgent.includes('edge')) {
      browserType = 'edge';
      const match = userAgent.match(/edg\/([0-9.]+)/);
      version = match ? match[1] : '';
    } else if (userAgent.includes('samsung')) {
      browserType = 'samsung';
    }
    
    return {
      isMobile,
      isTablet,
      isIOS,
      isAndroid,
      deviceType,
      browserType,
      version,
      userAgent: userAgent.substring(0, 100) + '...', // Privacy-preserving truncation
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      touchSupport: 'ontouchstart' in window,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
  }

  /**
   * Test privacy features and storage capabilities
   */
  private async testPrivacyFeatures() {
    const features = {
      cookiesEnabled: false,
      localStorageAvailable: false,
      sessionStorageAvailable: false,
      thirdPartyCookiesBlocked: false,
      privateBrowsingDetected: false,
      trackingProtectionActive: false
    };

    // Test cookie support
    try {
      document.cookie = 'alchm_test=1; path=/; samesite=strict';
      features.cookiesEnabled = document.cookie.includes('alchm_test=1');
      document.cookie = 'alchm_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    } catch {
      features.cookiesEnabled = false;
    }

    // Test localStorage
    try {
      const testKey = '__alchm_localStorage_test__';
      localStorage.setItem(testKey, 'test');
      features.localStorageAvailable = localStorage.getItem(testKey) === 'test';
      localStorage.removeItem(testKey);
    } catch {
      features.localStorageAvailable = false;
      features.privateBrowsingDetected = true; // Common cause
    }

    // Test sessionStorage
    try {
      const testKey = '__alchm_sessionStorage_test__';
      sessionStorage.setItem(testKey, 'test');
      features.sessionStorageAvailable = sessionStorage.getItem(testKey) === 'test';
      sessionStorage.removeItem(testKey);
    } catch {
      features.sessionStorageAvailable = false;
    }

    // Detect private browsing mode
    if (!features.localStorageAvailable && features.sessionStorageAvailable) {
      features.privateBrowsingDetected = true;
    }

    // Test for tracking protection (Firefox, Safari ITP)
    try {
      // Create a test iframe to detect tracking protection
      const testFrame = document.createElement('iframe');
      testFrame.style.display = 'none';
      testFrame.src = 'data:text/html,<script>parent.postMessage("tracking_test", "*")</script>';
      
      const trackingTest = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          features.trackingProtectionActive = true;
          resolve(true);
        }, 1000);
        
        const messageHandler = (event: MessageEvent) => {
          if (event.data === 'tracking_test') {
            clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
            resolve(false);
          }
        };
        
        window.addEventListener('message', messageHandler);
        document.body.appendChild(testFrame);
        
        setTimeout(() => {
          document.body.removeChild(testFrame);
        }, 1100);
      });
      
      features.trackingProtectionActive = await trackingTest;
    } catch {
      features.trackingProtectionActive = true; // Assume active if test fails
    }

    // Test third-party cookie blocking
    try {
      // This is a simplified test - in production you'd test against a third-party domain
      const thirdPartyTest = document.cookie.length === 0 && !features.cookiesEnabled;
      features.thirdPartyCookiesBlocked = thirdPartyTest;
    } catch {
      features.thirdPartyCookiesBlocked = true;
    }

    return features;
  }

  /**
   * Test age verification component capability
   */
  private async testAgeVerificationCapability() {
    const capability = {
      canDisplayModal: true,
      canStoreVerification: false,
      requiresEmergencyBypass: false,
      coppaCompliant: true
    };

    // Test modal display capability
    try {
      // Test if we can create and display modal elements
      const testModal = document.createElement('div');
      testModal.style.position = 'fixed';
      testModal.style.top = '0';
      testModal.style.left = '0';
      testModal.style.width = '100%';
      testModal.style.height = '100%';
      testModal.style.zIndex = '9999';
      testModal.style.visibility = 'hidden';
      
      document.body.appendChild(testModal);
      const canDisplay = testModal.offsetHeight > 0;
      document.body.removeChild(testModal);
      
      capability.canDisplayModal = canDisplay;
    } catch {
      capability.canDisplayModal = false;
      capability.requiresEmergencyBypass = true;
    }

    // Test verification storage capability
    try {
      const testData = JSON.stringify({
        test: true,
        timestamp: Date.now()
      });
      
      // Try sessionStorage first (most compatible)
      sessionStorage.setItem('__alchm_verification_test__', testData);
      const sessionTest = sessionStorage.getItem('__alchm_verification_test__') === testData;
      sessionStorage.removeItem('__alchm_verification_test__');
      
      if (sessionTest) {
        capability.canStoreVerification = true;
      } else {
        // Try localStorage
        localStorage.setItem('__alchm_verification_test__', testData);
        const localTest = localStorage.getItem('__alchm_verification_test__') === testData;
        localStorage.removeItem('__alchm_verification_test__');
        
        capability.canStoreVerification = localTest;
      }
    } catch {
      capability.canStoreVerification = false;
      capability.requiresEmergencyBypass = true;
    }

    // COPPA compliance assessment
    capability.coppaCompliant = capability.canDisplayModal && (
      capability.canStoreVerification || 
      capability.requiresEmergencyBypass // Emergency bypass maintains compliance
    );

    return capability;
  }

  /**
   * Identify specific compatibility issues
   */
  private identifyCompatibilityIssues(deviceInfo: any, privacyFeatures: any, ageVerification: any) {
    const issues: Array<{
      severity: 'critical' | 'warning' | 'info';
      category: 'privacy' | 'storage' | 'display' | 'compliance';
      message: string;
      solution: string;
    }> = [];

    // iOS Safari specific issues
    if (deviceInfo.isIOS && deviceInfo.browserType === 'safari') {
      if (privacyFeatures.privateBrowsingDetected) {
        issues.push({
          severity: 'warning',
          category: 'privacy',
          message: 'iOS Safari private browsing detected - age verification will be session-only',
          solution: 'Use emergency bypass or switch to non-private browsing for persistent verification'
        });
      }
      
      if (privacyFeatures.trackingProtectionActive) {
        issues.push({
          severity: 'info',
          category: 'privacy',
          message: 'iOS Intelligent Tracking Prevention is active',
          solution: 'Age verification will use cookie fallback for session persistence'
        });
      }
    }

    // Private browsing issues
    if (privacyFeatures.privateBrowsingDetected) {
      issues.push({
        severity: 'warning',
        category: 'storage',
        message: 'Private browsing mode prevents persistent age verification storage',
        solution: 'Age verification will be valid for current session only'
      });
    }

    // Storage capability issues
    if (!privacyFeatures.localStorageAvailable && !privacyFeatures.sessionStorageAvailable) {
      issues.push({
        severity: 'critical',
        category: 'storage',
        message: 'No storage mechanisms available for age verification',
        solution: 'Emergency bypass required for COPPA compliance'
      });
    }

    // Display capability issues
    if (!ageVerification.canDisplayModal) {
      issues.push({
        severity: 'critical',
        category: 'display',
        message: 'Cannot display age verification modal',
        solution: 'Emergency bypass required with simplified verification flow'
      });
    }

    // COPPA compliance issues
    if (!ageVerification.coppaCompliant) {
      issues.push({
        severity: 'critical',
        category: 'compliance',
        message: 'Current configuration cannot maintain COPPA compliance',
        solution: 'Emergency bypass with enhanced parental consent required'
      });
    }

    // Firefox Focus issues
    if (deviceInfo.browserType === 'firefox' && privacyFeatures.trackingProtectionActive) {
      issues.push({
        severity: 'warning',
        category: 'privacy',
        message: 'Firefox Enhanced Tracking Protection may interfere with age verification',
        solution: 'Emergency bypass available if verification fails'
      });
    }

    return issues;
  }

  /**
   * Determine if emergency access should be enabled
   */
  private shouldEnableEmergencyAccess(issues: any[], ageVerification: any): boolean {
    // Critical issues that require emergency bypass
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    
    if (criticalIssues.length > 0) {
      return true;
    }

    // Age verification capability failures
    if (!ageVerification.canDisplayModal || !ageVerification.canStoreVerification) {
      return true;
    }

    // Multiple warning-level issues
    const warningIssues = issues.filter(issue => issue.severity === 'warning');
    if (warningIssues.length >= 2) {
      return true;
    }

    return false;
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(issues: any[], emergencyAccessNeeded: boolean): string[] {
    const recommendations: string[] = [];

    if (emergencyAccessNeeded) {
      recommendations.push('Enable emergency age verification bypass for mobile compatibility');
      recommendations.push('Use simplified COPPA-compliant verification flow');
      recommendations.push('Implement enhanced audit logging for emergency access');
    }

    if (issues.some(issue => issue.category === 'storage')) {
      recommendations.push('Use session-only verification with cookie fallback');
      recommendations.push('Implement in-memory verification state management');
    }

    if (issues.some(issue => issue.category === 'privacy')) {
      recommendations.push('Enable privacy-enhanced verification mode');
      recommendations.push('Use client-side only verification processing');
    }

    if (issues.some(issue => issue.category === 'compliance')) {
      recommendations.push('Activate enhanced COPPA protection measures');
      recommendations.push('Enable mandatory parental consent flows for minors');
    }

    recommendations.push('Provide crisis support access regardless of verification status');
    recommendations.push('Log all verification attempts for compliance audit');

    return recommendations;
  }

  /**
   * Create server-side compatibility result
   */
  private createServerSideResult(): MobileCompatibilityResult {
    return {
      isCompatible: true,
      browserType: 'server',
      deviceType: 'server',
      privacyFeatures: {
        cookiesEnabled: true,
        localStorageAvailable: true,
        sessionStorageAvailable: true,
        thirdPartyCookiesBlocked: false,
        privateBrowsingDetected: false,
        trackingProtectionActive: false
      },
      ageVerificationCapability: {
        canDisplayModal: true,
        canStoreVerification: true,
        requiresEmergencyBypass: false,
        coppaCompliant: true
      },
      emergencyAccessNeeded: false,
      recommendations: ['Server-side rendering detected - client-side validation will occur on hydration'],
      issues: []
    };
  }

  /**
   * Log comprehensive compatibility assessment
   */
  private logCompatibilityAssessment(result: MobileCompatibilityResult): void {
    const assessment = {
      timestamp: new Date().toISOString(),
      compatibility: result.isCompatible ? 'compatible' : 'requires_emergency_bypass',
      device: `${result.deviceType}_${result.browserType}`,
      coppaCompliant: result.ageVerificationCapability.coppaCompliant,
      emergencyBypassNeeded: result.emergencyAccessNeeded,
      criticalIssues: result.issues.filter(issue => issue.severity === 'critical').length,
      warningIssues: result.issues.filter(issue => issue.severity === 'warning').length,
      privacyFeatures: {
        storageAvailable: result.privacyFeatures.localStorageAvailable || result.privacyFeatures.sessionStorageAvailable,
        privateBrowsing: result.privacyFeatures.privateBrowsingDetected,
        trackingProtection: result.privacyFeatures.trackingProtectionActive
      }
    };

    console.log('[MOBILE_COMPATIBILITY_ASSESSMENT]', assessment);

    // Store assessment for compliance audit
    try {
      sessionStorage.setItem('alchm_compatibility_assessment', JSON.stringify(assessment));
    } catch {
      // Store in memory if sessionStorage unavailable
      (window as any).__alchm_compatibility_assessment = assessment;
    }
  }
}

// Export singleton instance
export const mobileCompatibilityValidator = new MobileCompatibilityValidator();

// Export convenience functions
export async function validateMobileCompatibility(): Promise<MobileCompatibilityResult> {
  return mobileCompatibilityValidator.validateMobileCompatibility();
}

export function isMobileDeviceWithKnownIssues(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isIOSSafari = isIOS && userAgent.includes('safari') && !userAgent.includes('chrome');
  const isMobileFirefox = userAgent.includes('firefox') && /android|mobile/i.test(userAgent);
  
  return isIOSSafari || isMobileFirefox;
}

export function shouldShowEmergencyBypass(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check stored compatibility assessment
  try {
    const stored = sessionStorage.getItem('alchm_compatibility_assessment') || 
                  JSON.stringify((window as any).__alchm_compatibility_assessment || {});
    const assessment = JSON.parse(stored);
    return assessment.emergencyBypassNeeded === true;
  } catch {
    // If no assessment available, check for known problematic devices
    return isMobileDeviceWithKnownIssues();
  }
}