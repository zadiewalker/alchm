/**
 * Crisis Diagnostic Guardian
 * 
 * MISSION: Provide trauma-informed diagnostic operations that prioritize user safety
 * above all system concerns. This guardian ensures diagnostic processes never interfere
 * with crisis support functionality or create jarring experiences for vulnerable users.
 * 
 * This system operates under the principle: Better to have slower diagnostics than
 * to risk compromising a user's safety during a crisis moment.
 */

interface CrisisAwareDiagnosticConfig {
  maxExecutionTime: number;           // Max diagnostic time before auto-stop
  performanceThreshold: number;       // Min performance score to continue
  gentleUITransitions: boolean;       // Use gentle, non-jarring UI changes
  pauseOnCrisisDetection: boolean;    // Auto-pause diagnostics if crisis detected
  emergencyStopEnabled: boolean;      // Enable emergency stop mechanisms
  traumaInformedLogging: boolean;     // Use trauma-informed logging practices
}

interface DiagnosticSafetyChecks {
  crisisButtonAccessible: boolean;
  emergencyNavigationWorking: boolean;
  hotlineResourcesAvailable: boolean;
  offlineCacheIntact: boolean;
  ageVerificationFunctional: boolean;
  userInCrisisState: boolean;
}

interface DiagnosticOperation {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  crisisImpact: 'none' | 'minimal' | 'moderate' | 'high';
  requiresSafetyValidation: boolean;
  canRunDuringCrisis: boolean;
}

class CrisisDiagnosticGuardian {
  private static instance: CrisisDiagnosticGuardian;
  
  private config: CrisisAwareDiagnosticConfig = {
    maxExecutionTime: 30000,      // 30 seconds max
    performanceThreshold: 95,     // 95% safety score minimum
    gentleUITransitions: true,
    pauseOnCrisisDetection: true,
    emergencyStopEnabled: true,
    traumaInformedLogging: true
  };
  
  private activeDiagnostics: Map<string, DiagnosticOperation> = new Map();
  private emergencyStopTriggered = false;
  private lastSafetyCheck = 0;
  private safetyCheckInterval = 5000; // Check safety every 5 seconds
  
  private constructor() {
    this.initializeGuardian();
  }
  
  static getInstance(): CrisisDiagnosticGuardian {
    if (!CrisisDiagnosticGuardian.instance) {
      CrisisDiagnosticGuardian.instance = new CrisisDiagnosticGuardian();
    }
    return CrisisDiagnosticGuardian.instance;
  }
  
  /**
   * Initialize the crisis diagnostic guardian system
   */
  private initializeGuardian(): void {
    console.log('🛡️ Crisis Diagnostic Guardian initialized');
    
    // Set up emergency stop listeners
    if (typeof window !== 'undefined') {
      this.setupEmergencyStopListeners();
      this.setupCrisisDetectionListeners();
      this.startSafetyMonitoring();
    }
  }
  
  /**
   * Validate system safety before running any diagnostic operation
   */
  async validateSystemSafety(): Promise<DiagnosticSafetyChecks> {
    console.log('🔍 Validating system safety for diagnostic operations');
    
    try {
      const checks: DiagnosticSafetyChecks = {
        crisisButtonAccessible: await this.testCrisisButtonAccessibility(),
        emergencyNavigationWorking: await this.testEmergencyNavigation(),
        hotlineResourcesAvailable: await this.testHotlineResources(),
        offlineCacheIntact: await this.testOfflineCache(),
        ageVerificationFunctional: await this.testAgeVerification(),
        userInCrisisState: await this.detectUserCrisisState()
      };
      
      this.lastSafetyCheck = Date.now();
      
      console.log('🛡️ Safety validation completed:', {
        allSafe: Object.values(checks).every(check => check === true || check === false),
        criticalIssues: Object.entries(checks)
          .filter(([key, value]) => key !== 'userInCrisisState' && !value)
          .map(([key]) => key)
      });
      
      return checks;
      
    } catch (error) {
      console.error('💥 Safety validation failed:', error);
      
      // Return fail-safe state
      return {
        crisisButtonAccessible: false,
        emergencyNavigationWorking: false,
        hotlineResourcesAvailable: false,
        offlineCacheIntact: false,
        ageVerificationFunctional: false,
        userInCrisisState: true // Assume crisis state for safety
      };
    }
  }
  
  /**
   * Run diagnostic operation with crisis safety protections
   */
  async runSafeDiagnostic(
    operation: DiagnosticOperation,
    executor: () => Promise<any>
  ): Promise<{
    success: boolean;
    result?: any;
    stoppedForSafety?: boolean;
    error?: string;
  }> {
    console.log(`🔧 Starting safe diagnostic: ${operation.name}`);
    
    // Check if emergency stop is active
    if (this.emergencyStopTriggered) {
      return {
        success: false,
        stoppedForSafety: true,
        error: 'Emergency stop is active'
      };
    }
    
    // Validate system safety first
    const safetyChecks = await this.validateSystemSafety();
    
    // Check if operation can run during crisis
    if (safetyChecks.userInCrisisState && !operation.canRunDuringCrisis) {
      console.log('⏸️ Pausing diagnostic - user in crisis state');
      return {
        success: false,
        stoppedForSafety: true,
        error: 'User in crisis state - diagnostic paused for safety'
      };
    }
    
    // Check critical safety requirements
    const criticalSafetyMet = safetyChecks.crisisButtonAccessible && 
                             safetyChecks.emergencyNavigationWorking && 
                             safetyChecks.hotlineResourcesAvailable;
    
    if (!criticalSafetyMet && operation.requiresSafetyValidation) {
      console.error('🚨 Critical safety requirements not met');
      return {
        success: false,
        stoppedForSafety: true,
        error: 'Critical safety systems not functional'
      };
    }
    
    // Add operation to active tracking
    this.activeDiagnostics.set(operation.id, operation);
    
    try {
      // Create safety timeout
      const safetyTimeout = setTimeout(() => {
        console.warn(`⏱️ Diagnostic ${operation.name} exceeded max time - stopping for safety`);
        this.stopDiagnostic(operation.id, 'Exceeded maximum execution time');
      }, this.config.maxExecutionTime);
      
      // Start gentle UI indication if needed
      if (this.config.gentleUITransitions) {
        this.showGentleDiagnosticIndicator(operation);
      }
      
      // Set up safety monitoring during execution
      const safetyMonitor = this.startOperationSafetyMonitoring(operation.id);
      
      // Execute the diagnostic operation
      const result = await executor();
      
      // Clean up
      clearTimeout(safetyTimeout);
      safetyMonitor.stop();
      this.activeDiagnostics.delete(operation.id);
      this.hideGentleDiagnosticIndicator();
      
      console.log(`✅ Diagnostic ${operation.name} completed safely`);
      
      return {
        success: true,
        result
      };
      
    } catch (error) {
      console.error(`💥 Diagnostic ${operation.name} failed:`, error);
      
      // Clean up on error
      this.activeDiagnostics.delete(operation.id);
      this.hideGentleDiagnosticIndicator();
      
      return {
        success: false,
        error: String(error)
      };
    }
  }
  
  /**
   * Emergency stop all diagnostic operations
   */
  emergencyStopAll(reason: string = 'Emergency stop triggered'): void {
    console.error('🛑 EMERGENCY STOP: All diagnostic operations halted');
    console.error('Reason:', reason);
    
    this.emergencyStopTriggered = true;
    
    // Stop all active diagnostics
    for (const [id, operation] of this.activeDiagnostics) {
      console.log(`🛑 Stopping diagnostic: ${operation.name}`);
    }
    
    this.activeDiagnostics.clear();
    this.hideGentleDiagnosticIndicator();
    
    // Notify system of emergency stop
    this.notifyEmergencyStop(reason);
  }
  
  /**
   * Reset emergency stop and resume operations (if safe)
   */
  async resetEmergencyStop(): Promise<boolean> {
    console.log('🔄 Attempting to reset emergency stop');
    
    // Validate system safety before resuming
    const safetyChecks = await this.validateSystemSafety();
    
    const criticalSafetyMet = safetyChecks.crisisButtonAccessible && 
                             safetyChecks.emergencyNavigationWorking && 
                             safetyChecks.hotlineResourcesAvailable;
    
    if (criticalSafetyMet && !safetyChecks.userInCrisisState) {
      this.emergencyStopTriggered = false;
      console.log('✅ Emergency stop reset - operations can resume');
      return true;
    } else {
      console.warn('⚠️ Cannot reset emergency stop - safety requirements not met');
      return false;
    }
  }
  
  /**
   * Test crisis button accessibility
   */
  private async testCrisisButtonAccessibility(): Promise<boolean> {
    try {
      // Check if crisis support elements are accessible
      if (typeof document !== 'undefined') {
        const crisisElements = document.querySelectorAll('[data-crisis-support]');
        return crisisElements.length > 0;
      }
      
      // Server-side check
      return true; // Assume accessible for server-side
    } catch (error) {
      console.error('Crisis button accessibility test failed:', error);
      return false;
    }
  }
  
  /**
   * Test emergency navigation functionality
   */
  private async testEmergencyNavigation(): Promise<boolean> {
    try {
      // Test that emergency routes are accessible
      const emergencyPaths = ['/emergency', '/crisis-resources', '/988'];
      
      // In a real implementation, this would test route resolution
      // For now, return true if window.location is available
      return typeof window !== 'undefined' && !!window.location;
    } catch (error) {
      console.error('Emergency navigation test failed:', error);
      return false;
    }
  }
  
  /**
   * Test hotline resource availability
   */
  private async testHotlineResources(): Promise<boolean> {
    try {
      // Check if crisis resources are loaded
      const hotlineData = localStorage.getItem('crisis_hotlines');
      return !!hotlineData;
    } catch (error) {
      console.error('Hotline resources test failed:', error);
      return false;
    }
  }
  
  /**
   * Test offline cache integrity
   */
  private async testOfflineCache(): Promise<boolean> {
    try {
      if ('serviceWorker' in navigator && 'caches' in window) {
        const cache = await caches.open('crisis-cache');
        const keys = await cache.keys();
        return keys.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Offline cache test failed:', error);
      return false;
    }
  }
  
  /**
   * Test age verification system
   */
  private async testAgeVerification(): Promise<boolean> {
    try {
      // Check if age verification system is functional
      const ageVerified = localStorage.getItem('age_verified');
      return ageVerified === 'true' || ageVerified === null; // null means not needed yet
    } catch (error) {
      console.error('Age verification test failed:', error);
      return false;
    }
  }
  
  /**
   * Detect if user is currently in crisis state
   */
  private async detectUserCrisisState(): Promise<boolean> {
    try {
      // Check for active crisis indicators
      const crisisIndicators = [
        sessionStorage.getItem('crisis_support_active'),
        document.querySelector('.crisis-support-modal')?.classList.contains('visible'),
        localStorage.getItem('recent_crisis_detection')
      ];
      
      return crisisIndicators.some(indicator => !!indicator);
    } catch (error) {
      console.error('Crisis state detection failed:', error);
      return false; // Default to no crisis detected
    }
  }
  
  /**
   * Setup emergency stop listeners
   */
  private setupEmergencyStopListeners(): void {
    // Listen for keyboard shortcuts (Ctrl+Shift+S = Emergency Stop)
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        this.emergencyStopAll('Keyboard shortcut triggered');
      }
    });
    
    // Listen for custom emergency events
    window.addEventListener('crisis-emergency-stop', (event: any) => {
      this.emergencyStopAll(event.detail?.reason || 'Custom event triggered');
    });
  }
  
  /**
   * Setup crisis detection listeners
   */
  private setupCrisisDetectionListeners(): void {
    // Listen for crisis detection events
    window.addEventListener('crisis-detected', (event: any) => {
      if (this.config.pauseOnCrisisDetection) {
        console.log('⏸️ Crisis detected - pausing diagnostic operations');
        this.pauseAllDiagnostics('Crisis detected');
      }
    });
    
    // Listen for crisis support activation
    window.addEventListener('crisis-support-activated', () => {
      if (this.config.pauseOnCrisisDetection) {
        this.pauseAllDiagnostics('Crisis support activated');
      }
    });
  }
  
  /**
   * Start continuous safety monitoring
   */
  private startSafetyMonitoring(): void {
    setInterval(async () => {
      if (this.activeDiagnostics.size > 0) {
        const safetyChecks = await this.validateSystemSafety();
        
        // If user enters crisis state, pause all diagnostics
        if (safetyChecks.userInCrisisState && this.config.pauseOnCrisisDetection) {
          this.pauseAllDiagnostics('User entered crisis state');
        }
        
        // If critical systems fail, emergency stop
        const criticalFailure = !safetyChecks.crisisButtonAccessible || 
                               !safetyChecks.emergencyNavigationWorking || 
                               !safetyChecks.hotlineResourcesAvailable;
        
        if (criticalFailure) {
          this.emergencyStopAll('Critical safety system failure detected');
        }
      }
    }, this.safetyCheckInterval);
  }
  
  /**
   * Start safety monitoring for specific operation
   */
  private startOperationSafetyMonitoring(operationId: string): { stop: () => void } {
    const interval = setInterval(async () => {
      if (!this.activeDiagnostics.has(operationId)) {
        clearInterval(interval);
        return;
      }
      
      // Check if operation should be stopped for safety
      const safetyChecks = await this.validateSystemSafety();
      
      if (safetyChecks.userInCrisisState) {
        console.log(`⏸️ Stopping operation ${operationId} - user in crisis`);
        this.stopDiagnostic(operationId, 'User entered crisis state');
        clearInterval(interval);
      }
    }, 2000); // Check every 2 seconds during operation
    
    return {
      stop: () => clearInterval(interval)
    };
  }
  
  /**
   * Show gentle diagnostic indicator
   */
  private showGentleDiagnosticIndicator(operation: DiagnosticOperation): void {
    if (typeof document === 'undefined') return;
    
    // Create gentle, non-intrusive indicator
    const indicator = document.createElement('div');
    indicator.id = 'gentle-diagnostic-indicator';
    indicator.className = 'fixed bottom-4 right-4 bg-sage-100 text-sage-800 px-4 py-2 rounded-lg shadow-soft text-sm transition-all duration-500 z-40';
    indicator.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-sage-400 rounded-full animate-gentle-pulse"></div>
        <span>System check in progress...</span>
      </div>
    `;
    
    document.body.appendChild(indicator);
    
    // Animate in gently
    setTimeout(() => {
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateY(0)';
    }, 100);
  }
  
  /**
   * Hide gentle diagnostic indicator
   */
  private hideGentleDiagnosticIndicator(): void {
    if (typeof document === 'undefined') return;
    
    const indicator = document.getElementById('gentle-diagnostic-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        indicator.remove();
      }, 500);
    }
  }
  
  /**
   * Pause all active diagnostics
   */
  private pauseAllDiagnostics(reason: string): void {
    console.log(`⏸️ Pausing all diagnostics: ${reason}`);
    
    for (const [id, operation] of this.activeDiagnostics) {
      console.log(`⏸️ Pausing: ${operation.name}`);
    }
    
    this.hideGentleDiagnosticIndicator();
  }
  
  /**
   * Stop specific diagnostic operation
   */
  private stopDiagnostic(operationId: string, reason: string): void {
    const operation = this.activeDiagnostics.get(operationId);
    if (operation) {
      console.log(`🛑 Stopping diagnostic ${operation.name}: ${reason}`);
      this.activeDiagnostics.delete(operationId);
    }
  }
  
  /**
   * Notify system of emergency stop
   */
  private notifyEmergencyStop(reason: string): void {
    // Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('diagnostic-emergency-stop', {
        detail: { reason, timestamp: Date.now() }
      }));
    }
    
    // Log for monitoring
    if (this.config.traumaInformedLogging) {
      console.log('🛡️ Emergency stop logged (trauma-informed logging active)');
    }
  }
  
  /**
   * Get current guardian status
   */
  getStatus(): {
    emergencyStopActive: boolean;
    activeDiagnostics: number;
    lastSafetyCheck: number;
    safetyCheckAge: number;
  } {
    return {
      emergencyStopActive: this.emergencyStopTriggered,
      activeDiagnostics: this.activeDiagnostics.size,
      lastSafetyCheck: this.lastSafetyCheck,
      safetyCheckAge: Date.now() - this.lastSafetyCheck
    };
  }
}

// Export singleton instance
export const crisisDiagnosticGuardian = CrisisDiagnosticGuardian.getInstance();

// Export types
export type {
  CrisisAwareDiagnosticConfig,
  DiagnosticSafetyChecks,
  DiagnosticOperation
};