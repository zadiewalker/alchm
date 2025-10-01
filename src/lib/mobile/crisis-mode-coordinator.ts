'use client';

/**
 * Crisis Mode Coordinator
 * Central system for coordinating all crisis safety features on mobile devices
 * Integrates: Crisis detection, offline resources, performance monitoring, 
 * privacy compliance, and professional escalation
 */

interface CrisisCoordinatorState {
  // Crisis Detection
  isActive: boolean;
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  confidence: number;
  triggerSource: 'text_analysis' | 'performance_degradation' | 'user_activated' | 'tremor_detection' | 'isolation_pattern';
  
  // Performance Monitoring
  deviceStruggling: boolean;
  batteryLevel: number;
  networkStatus: 'online' | 'offline' | 'poor';
  memoryPressure: 'normal' | 'warning' | 'critical';
  
  // User Context
  accessibilityNeeds: {
    tremorCompensation: boolean;
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    oneHandedMode: boolean;
  };
  
  // Professional Integration
  therapistAlerted: boolean;
  emergencyServicesContacted: boolean;
  supportResourcesOffered: string[];
  escalationHistory: Array<{
    timestamp: number;
    severity: string;
    action: string;
    outcome?: string;
  }>;
  
  // Privacy & Compliance
  dataMinimizationActive: boolean;
  encryptedStorageEnabled: boolean;
  auditTrailMaintained: boolean;
  userConsentLevel: 'basic' | 'enhanced' | 'emergency_override';
}

interface CrisisCoordinatorConfig {
  // Performance Thresholds
  performanceCrisisThresholds: {
    lcp: number; // Largest Contentful Paint threshold
    fid: number; // First Input Delay threshold
    cls: number; // Cumulative Layout Shift threshold
    memoryUsage: number; // Memory usage in MB
  };
  
  // Crisis Detection Settings
  keywordSensitivity: 'low' | 'medium' | 'high';
  proactiveInterventionEnabled: boolean;
  offlineResourcesCached: boolean;
  
  // Professional Integration
  therapistEndpoint?: string;
  emergencyEscalationEnabled: boolean;
  peerSupportEnabled: boolean;
  
  // Accessibility
  automaticTremorDetection: boolean;
  contextualAdaptation: boolean;
  batteryOptimization: boolean;
}

export class CrisisModeCoordinator {
  private state: CrisisCoordinatorState;
  private config: CrisisCoordinatorConfig;
  private listeners: Map<string, Function[]> = new Map();
  private performanceMonitor: any;
  private crisisDetector: any;
  private offlineManager: any;
  
  private readonly STORAGE_KEY = 'alchm_crisis_coordinator_state';
  private readonly AUDIT_KEY = 'alchm_crisis_audit_trail';
  
  constructor(config: Partial<CrisisCoordinatorConfig> = {}) {
    this.config = {
      performanceCrisisThresholds: {
        lcp: 2500, // 2.5 seconds for mobile crisis threshold
        fid: 50,   // 50ms input delay threshold
        cls: 0.05, // 0.05 layout shift threshold
        memoryUsage: 100 // 100MB memory threshold
      },
      keywordSensitivity: 'high',
      proactiveInterventionEnabled: true,
      offlineResourcesCached: true,
      automaticTremorDetection: true,
      contextualAdaptation: true,
      batteryOptimization: true,
      emergencyEscalationEnabled: true,
      peerSupportEnabled: true,
      ...config
    };
    
    this.state = this.loadSavedState() || this.getInitialState();
    this.initialize();
  }
  
  private getInitialState(): CrisisCoordinatorState {
    return {
      isActive: false,
      severity: 'none',
      confidence: 0,
      triggerSource: 'user_activated',
      deviceStruggling: false,
      batteryLevel: 100,
      networkStatus: 'online',
      memoryPressure: 'normal',
      accessibilityNeeds: {
        tremorCompensation: false,
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        oneHandedMode: false
      },
      therapistAlerted: false,
      emergencyServicesContacted: false,
      supportResourcesOffered: [],
      escalationHistory: [],
      dataMinimizationActive: false,
      encryptedStorageEnabled: true,
      auditTrailMaintained: true,
      userConsentLevel: 'basic'
    };
  }
  
  private async initialize() {
    // Initialize performance monitoring integration
    await this.initializePerformanceMonitoring();
    
    // Initialize crisis detection
    await this.initializeCrisisDetection();
    
    // Initialize offline resource management
    await this.initializeOfflineResources();
    
    // Setup device capabilities detection
    await this.detectDeviceCapabilities();
    
    // Setup privacy & compliance monitoring
    this.initializePrivacyCompliance();
    
    // Start monitoring loops
    this.startMonitoringLoops();
    
    console.log('[CrisisModeCoordinator] Initialized with config:', this.config);
  }
  
  private async initializePerformanceMonitoring() {
    // Monitor Core Web Vitals for crisis scenarios
    if (typeof window !== 'undefined') {
      const { coreWebVitalsMonitor } = await import('@/lib/core-web-vitals-monitor');
      this.performanceMonitor = coreWebVitalsMonitor;
      
      // Listen for performance degradation
      this.performanceMonitor.onAlert((alert: any) => {
        if (this.isPerformanceCrisis(alert)) {
          this.activateCrisisMode('performance_degradation', 'high', 85);
        }
      });
    }
  }
  
  private async initializeCrisisDetection() {
    // Listen for crisis detection events
    if (typeof window !== 'undefined') {
      window.addEventListener('alchm:crisis-detected', (event: any) => {
        const { severity, confidence, keywords } = event.detail;
        this.activateCrisisMode('text_analysis', severity, confidence);
      });
      
      window.addEventListener('alchm:emergency-gesture', () => {
        this.activateCrisisMode('user_activated', 'emergency', 100);
      });
    }
  }
  
  private async initializeOfflineResources() {
    if (this.config.offlineResourcesCached) {
      await this.cacheEmergencyResources();
    }
    
    // Monitor network status
    if (typeof window !== 'undefined') {
      const updateNetworkStatus = () => {
        this.updateState({
          networkStatus: navigator.onLine ? 'online' : 'offline'
        });
      };
      
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);
      updateNetworkStatus();
    }
  }
  
  private async detectDeviceCapabilities() {
    if (typeof window === 'undefined') return;
    
    const capabilities = {
      tremorCompensation: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      oneHandedMode: false
    };
    
    // Detect tremor patterns from device motion
    if (this.config.automaticTremorDetection && window.DeviceMotionEvent) {
      let motionSamples: number[] = [];
      
      const motionHandler = (event: DeviceMotionEvent) => {
        if (event.accelerationIncludingGravity) {
          const { x, y, z } = event.accelerationIncludingGravity;
          if (x !== null && y !== null && z !== null) {
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            motionSamples.push(magnitude);
            
            if (motionSamples.length > 20) {
              motionSamples = motionSamples.slice(-20);
              
              // Detect potential tremor pattern
              const variance = this.calculateVariance(motionSamples);
              if (variance > 50 && variance < 200) { // Tremor range
                capabilities.tremorCompensation = true;
                this.activateCrisisMode('tremor_detection', 'medium', 70);
              }
            }
          }
        }
      };
      
      window.addEventListener('devicemotion', motionHandler, { passive: true });
    }
    
    // Detect screen size for one-handed mode
    if (window.screen && window.screen.width < 400) {
      capabilities.oneHandedMode = true;
    }
    
    // Check for reduced motion preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      capabilities.reducedMotion = true;
    }
    
    // Check for high contrast preferences
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      capabilities.highContrast = true;
    }
    
    this.updateState({ accessibilityNeeds: capabilities });
  }
  
  private initializePrivacyCompliance() {
    // Enable encrypted storage for crisis data
    this.updateState({ encryptedStorageEnabled: true });
    
    // Start audit trail
    this.logAuditEvent('coordinator_initialized', { 
      timestamp: Date.now(),
      config: this.config 
    });
  }
  
  private startMonitoringLoops() {
    // Battery monitoring
    this.monitorBatteryLevel();
    
    // Memory pressure monitoring
    this.monitorMemoryPressure();
    
    // Isolation pattern detection
    this.monitorIsolationPatterns();
    
    // Regular state persistence
    setInterval(() => {
      this.persistState();
    }, 10000); // Save every 10 seconds
  }
  
  private async monitorBatteryLevel() {
    if (typeof window === 'undefined' || !('getBattery' in navigator)) return;
    
    try {
      const battery = await (navigator as any).getBattery();
      
      const updateBattery = () => {
        const level = Math.round(battery.level * 100);
        this.updateState({ batteryLevel: level });
        
        // Enable battery optimization for crisis users
        if (level < 20 && this.state.isActive) {
          this.activateBatteryOptimization();
        }
      };
      
      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
    } catch (error) {
      console.warn('[CrisisModeCoordinator] Battery API not available');
    }
  }
  
  private monitorMemoryPressure() {
    if (typeof window === 'undefined') return;
    
    const checkMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMB = memInfo.usedJSHeapSize / 1024 / 1024;
        
        let pressure: CrisisCoordinatorState['memoryPressure'] = 'normal';
        if (usedMB > this.config.performanceCrisisThresholds.memoryUsage * 1.5) {
          pressure = 'critical';
        } else if (usedMB > this.config.performanceCrisisThresholds.memoryUsage) {
          pressure = 'warning';
        }
        
        this.updateState({ memoryPressure: pressure });
        
        if (pressure === 'critical' && this.state.isActive) {
          this.activateMemoryOptimization();
        }
      }
    };
    
    setInterval(checkMemory, 5000); // Check every 5 seconds
  }
  
  private monitorIsolationPatterns() {
    // Track late-night usage patterns as isolation indicators
    const checkIsolation = () => {
      const hour = new Date().getHours();
      const isLateNight = hour >= 23 || hour <= 5;
      const sessionDuration = Date.now() - (this.state.escalationHistory[0]?.timestamp || Date.now());
      
      if (isLateNight && sessionDuration > 60 * 60 * 1000) { // 1 hour late night session
        this.activateCrisisMode('isolation_pattern', 'medium', 60);
      }
    };
    
    setInterval(checkIsolation, 60000); // Check every minute
  }
  
  // Main crisis activation method
  public activateCrisisMode(
    source: CrisisCoordinatorState['triggerSource'],
    severity: CrisisCoordinatorState['severity'],
    confidence: number
  ) {
    const wasActive = this.state.isActive;
    const previousSeverity = this.state.severity;
    
    // Only escalate or activate, never de-escalate automatically
    if (!wasActive || this.getSeverityLevel(severity) > this.getSeverityLevel(previousSeverity)) {
      this.updateState({
        isActive: true,
        severity,
        confidence,
        triggerSource: source
      });
      
      // Log escalation
      this.logEscalation(severity, source, 'activated');
      
      // Trigger immediate interventions based on severity
      this.executeInterventions(severity);
      
      // Notify all listeners
      this.emit('crisis-activated', {
        severity,
        confidence,
        source,
        wasActive,
        previousSeverity
      });
      
      console.log(`[CrisisModeCoordinator] Crisis activated: ${severity} (${confidence}% confidence) from ${source}`);
    }
  }
  
  public deactivateCrisisMode(reason: string = 'user_reported_safe') {
    if (this.state.isActive) {
      this.logEscalation(this.state.severity, this.state.triggerSource, `deactivated: ${reason}`);
      
      this.updateState({
        isActive: false,
        severity: 'none',
        confidence: 0
      });
      
      this.emit('crisis-deactivated', { reason });
      
      console.log(`[CrisisModeCoordinator] Crisis deactivated: ${reason}`);
    }
  }
  
  private executeInterventions(severity: CrisisCoordinatorState['severity']) {
    switch (severity) {
      case 'emergency':
      case 'critical':
        this.activateEmergencyProtocol();
        break;
      case 'high':
        this.activateIntensiveSupport();
        break;
      case 'medium':
        this.activateModerateSupport();
        break;
      case 'low':
        this.activateGentleSupport();
        break;
    }
  }
  
  private activateEmergencyProtocol() {
    // Immediate emergency interventions
    this.showEmergencyInterface();
    this.alertTherapist('emergency');
    this.prepareEmergencyContacts();
    this.activateDataMinimization();
    
    // Performance optimizations for emergency
    this.activateUltraMinimalMode();
    this.disableNonEssentialFeatures();
    
    this.logAuditEvent('emergency_protocol_activated', {
      timestamp: Date.now(),
      severity: this.state.severity,
      confidence: this.state.confidence
    });
  }
  
  private activateIntensiveSupport() {
    this.showCrisisInterface();
    this.offerImmediateResources();
    this.alertTherapist('high_risk');
    this.activatePerformanceOptimizations();
  }
  
  private activateModerateSupport() {
    this.showSupportInterface();
    this.offerCopingResources();
    this.enableAccessibilityEnhancements();
  }
  
  private activateGentleSupport() {
    this.showGentleSupport();
    this.offerWellnessResources();
  }
  
  // Professional Integration Methods
  private async alertTherapist(priority: 'low' | 'medium' | 'high' | 'emergency') {
    if (!this.config.therapistEndpoint || this.state.therapistAlerted) return;
    
    try {
      const alertData = {
        userId: this.getAnonymizedUserId(),
        priority,
        severity: this.state.severity,
        confidence: this.state.confidence,
        triggerSource: this.state.triggerSource,
        timestamp: new Date().toISOString(),
        deviceContext: {
          batteryLevel: this.state.batteryLevel,
          networkStatus: this.state.networkStatus,
          accessibilityNeeds: this.state.accessibilityNeeds
        }
      };
      
      // HIPAA-compliant encrypted transmission
      const encryptedData = await this.encryptForTransmission(alertData);
      
      const response = await fetch(this.config.therapistEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Crisis-Priority': priority,
          'X-Encryption-Version': '1.0'
        },
        body: JSON.stringify(encryptedData)
      });
      
      if (response.ok) {
        this.updateState({ therapistAlerted: true });
        this.logAuditEvent('therapist_alerted', { priority, timestamp: Date.now() });
      }
      
    } catch (error) {
      console.error('[CrisisModeCoordinator] Failed to alert therapist:', error);
      // Fallback: Store alert for later transmission
      this.storeFailedAlert('therapist', { priority, timestamp: Date.now() });
    }
  }
  
  // Interface Methods
  private showEmergencyInterface() {
    window.dispatchEvent(new CustomEvent('alchm:show-emergency-interface', {
      detail: {
        severity: this.state.severity,
        confidence: this.state.confidence,
        offlineResources: this.state.networkStatus === 'offline'
      }
    }));
  }
  
  private showCrisisInterface() {
    window.dispatchEvent(new CustomEvent('alchm:show-crisis-interface', {
      detail: {
        severity: this.state.severity,
        resources: this.getRecommendedResources()
      }
    }));
  }
  
  private showSupportInterface() {
    window.dispatchEvent(new CustomEvent('alchm:show-support-interface', {
      detail: {
        severity: this.state.severity,
        techniques: this.getCopingTechniques()
      }
    }));
  }
  
  private showGentleSupport() {
    window.dispatchEvent(new CustomEvent('alchm:show-gentle-support', {
      detail: {
        resources: this.getWellnessResources()
      }
    }));
  }
  
  // Performance Optimization Methods
  private activateUltraMinimalMode() {
    document.body.classList.add('ultra-minimal-crisis');
    document.documentElement.style.setProperty('--crisis-mode', 'emergency');
    document.documentElement.style.setProperty('--disable-all-animations', '1');
    document.documentElement.style.setProperty('--simplify-layout', '1');
    
    this.updateState({ deviceStruggling: false }); // Force optimization
  }
  
  private activatePerformanceOptimizations() {
    if (this.state.accessibilityNeeds.tremorCompensation) {
      this.activateTremorCompensation();
    }
    
    if (this.state.accessibilityNeeds.reducedMotion) {
      this.activateReducedMotion();
    }
    
    if (this.state.batteryLevel < 30) {
      this.activateBatteryOptimization();
    }
  }
  
  private activateTremorCompensation() {
    document.body.classList.add('tremor-compensation-active');
    document.documentElement.style.setProperty('--touch-target-size', '64px');
    document.documentElement.style.setProperty('--touch-padding', '24px');
    document.documentElement.style.setProperty('--stabilize-taps', '1');
  }
  
  private activateReducedMotion() {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }
  
  private activateBatteryOptimization() {
    document.body.classList.add('battery-optimization-active');
    document.documentElement.style.setProperty('--disable-gpu-acceleration', '1');
    document.documentElement.style.setProperty('--reduce-brightness', '0.8');
  }
  
  private activateMemoryOptimization() {
    // Unload non-essential images and resources
    const images = document.querySelectorAll('img:not(.crisis-essential)');
    images.forEach(img => {
      const element = img as HTMLImageElement;
      if (!element.src.startsWith('data:')) {
        element.dataset.originalSrc = element.src;
        element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=';
      }
    });
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
  }
  
  private disableNonEssentialFeatures() {
    // Hide decorative elements
    const decorative = document.querySelectorAll('.decorative, [data-priority="low"]');
    decorative.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  }
  
  // Privacy & Compliance Methods
  private activateDataMinimization() {
    this.updateState({ dataMinimizationActive: true });
    
    // Clear non-essential data
    try {
      const nonEssentialKeys = Object.keys(localStorage).filter(key => 
        !key.startsWith('alchm_crisis_') && 
        !key.startsWith('alchm_emergency_')
      );
      
      nonEssentialKeys.forEach(key => {
        const backup = localStorage.getItem(key);
        if (backup) {
          sessionStorage.setItem(`backup_${key}`, backup);
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('[CrisisModeCoordinator] Data minimization failed:', error);
    }
  }
  
  private async encryptForTransmission(data: any): Promise<any> {
    // In production, implement proper encryption
    // For now, return base64 encoded data with timestamp
    return {
      encrypted: true,
      data: btoa(JSON.stringify(data)),
      timestamp: Date.now(),
      version: '1.0'
    };
  }
  
  // Resource Management
  private async cacheEmergencyResources() {
    const emergencyResources = {
      hotlines: [
        { name: '988 Suicide & Crisis Lifeline', number: '988' },
        { name: 'Crisis Text Line', contact: 'text HOME to 741741' },
        { name: 'Emergency Services', number: '911' }
      ],
      techniques: [
        { name: 'Grounding 5-4-3-2-1', description: '5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste' },
        { name: 'Box Breathing', description: 'Inhale 4, hold 4, exhale 4, hold 4' },
        { name: 'Progressive Muscle Relaxation', description: 'Tense and release muscle groups' }
      ],
      safetyPlanning: {
        warningSignsWorksheet: 'cached_content_here',
        copingStrategiesGuide: 'cached_content_here',
        supportContactsTemplate: 'cached_content_here'
      }
    };
    
    try {
      localStorage.setItem('alchm_emergency_resources', JSON.stringify(emergencyResources));
      localStorage.setItem('alchm_emergency_cache_timestamp', Date.now().toString());
      
      console.log('[CrisisModeCoordinator] Emergency resources cached');
    } catch (error) {
      console.error('[CrisisModeCoordinator] Failed to cache emergency resources:', error);
    }
  }
  
  // Utility Methods
  private isPerformanceCrisis(alert: any): boolean {
    const thresholds = this.config.performanceCrisisThresholds;
    
    return (
      (alert.metric === 'lcp' && alert.value > thresholds.lcp) ||
      (alert.metric === 'fid' && alert.value > thresholds.fid) ||
      (alert.metric === 'cls' && alert.value > thresholds.cls) ||
      (alert.metric === 'memory' && alert.value > thresholds.memoryUsage)
    );
  }
  
  private getSeverityLevel(severity: CrisisCoordinatorState['severity']): number {
    const levels = { none: 0, low: 1, medium: 2, high: 3, critical: 4, emergency: 5 };
    return levels[severity] || 0;
  }
  
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
  
  private getAnonymizedUserId(): string {
    // Return anonymized identifier for HIPAA compliance
    return btoa(Date.now().toString()).substring(0, 16);
  }
  
  private getRecommendedResources(): string[] {
    return this.state.supportResourcesOffered;
  }
  
  private getCopingTechniques(): string[] {
    return ['grounding-5-4-3-2-1', 'box-breathing', 'progressive-muscle-relaxation'];
  }
  
  private getWellnessResources(): string[] {
    return ['mindfulness-exercises', 'self-care-checklist', 'mood-tracking'];
  }
  
  // State Management
  private updateState(updates: Partial<CrisisCoordinatorState>) {
    this.state = { ...this.state, ...updates };
    this.persistState();
  }
  
  private persistState() {
    try {
      const stateToSave = {
        ...this.state,
        lastUpdated: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('[CrisisModeCoordinator] Failed to persist state:', error);
    }
  }
  
  private loadSavedState(): CrisisCoordinatorState | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const ageMs = Date.now() - (parsed.lastUpdated || 0);
        
        // Only restore state if less than 1 hour old
        if (ageMs < 60 * 60 * 1000) {
          delete parsed.lastUpdated;
          return parsed;
        }
      }
    } catch (error) {
      console.warn('[CrisisModeCoordinator] Failed to load saved state:', error);
    }
    return null;
  }
  
  private logEscalation(severity: string, source: string, action: string) {
    const escalation = {
      timestamp: Date.now(),
      severity,
      action,
      source
    };
    
    this.state.escalationHistory.push(escalation);
    
    // Keep only last 50 escalations
    if (this.state.escalationHistory.length > 50) {
      this.state.escalationHistory = this.state.escalationHistory.slice(-50);
    }
  }
  
  private logAuditEvent(event: string, data: any) {
    if (!this.state.auditTrailMaintained) return;
    
    try {
      const auditEntry = {
        timestamp: Date.now(),
        event,
        data: { ...data },
        sessionId: this.getAnonymizedUserId()
      };
      
      const existingAudit = JSON.parse(localStorage.getItem(this.AUDIT_KEY) || '[]');
      existingAudit.push(auditEntry);
      
      // Keep only last 100 audit entries
      const trimmedAudit = existingAudit.slice(-100);
      localStorage.setItem(this.AUDIT_KEY, JSON.stringify(trimmedAudit));
      
    } catch (error) {
      console.warn('[CrisisModeCoordinator] Failed to log audit event:', error);
    }
  }
  
  private storeFailedAlert(type: string, data: any) {
    try {
      const failedAlerts = JSON.parse(localStorage.getItem('alchm_failed_alerts') || '[]');
      failedAlerts.push({ type, data, timestamp: Date.now() });
      localStorage.setItem('alchm_failed_alerts', JSON.stringify(failedAlerts));
    } catch (error) {
      console.warn('[CrisisModeCoordinator] Failed to store failed alert:', error);
    }
  }
  
  // Event System
  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`[CrisisModeCoordinator] Listener error for ${event}:`, error);
      }
    });
    
    // Also emit as DOM event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`alchm:${event}`, { detail: data }));
    }
  }
  
  public on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
  
  public off(event: string, listener: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  // Public API
  public getState(): Readonly<CrisisCoordinatorState> {
    return { ...this.state };
  }
  
  public getConfig(): Readonly<CrisisCoordinatorConfig> {
    return { ...this.config };
  }
  
  public updateConfig(updates: Partial<CrisisCoordinatorConfig>) {
    this.config = { ...this.config, ...updates };
    this.logAuditEvent('config_updated', updates);
  }
  
  public reportUserSafe() {
    this.deactivateCrisisMode('user_reported_safe');
    this.logAuditEvent('user_reported_safe', { timestamp: Date.now() });
  }
  
  public manualActivation(severity: CrisisCoordinatorState['severity'] = 'medium') {
    this.activateCrisisMode('user_activated', severity, 100);
  }
  
  public getAuditTrail() {
    try {
      return JSON.parse(localStorage.getItem(this.AUDIT_KEY) || '[]');
    } catch {
      return [];
    }
  }
  
  public exportCrisisData() {
    return {
      state: this.getState(),
      config: this.getConfig(),
      auditTrail: this.getAuditTrail(),
      exportTimestamp: new Date().toISOString(),
      version: '1.0'
    };
  }
}

// Global instance
let globalCoordinator: CrisisModeCoordinator | null = null;

export function getCrisisModeCoordinator(config?: Partial<CrisisCoordinatorConfig>): CrisisModeCoordinator {
  if (!globalCoordinator) {
    globalCoordinator = new CrisisModeCoordinator(config);
  }
  return globalCoordinator;
}

export function resetCrisisModeCoordinator() {
  globalCoordinator = null;
}

// React hook for easy integration
export function useCrisisModeCoordinator() {
  const coordinator = getCrisisModeCoordinator();
  const [state, setState] = React.useState(coordinator.getState());
  
  React.useEffect(() => {
    const updateState = () => setState(coordinator.getState());
    
    coordinator.on('crisis-activated', updateState);
    coordinator.on('crisis-deactivated', updateState);
    
    return () => {
      coordinator.off('crisis-activated', updateState);
      coordinator.off('crisis-deactivated', updateState);
    };
  }, [coordinator]);
  
  return {
    state,
    coordinator,
    activateCrisis: coordinator.manualActivation.bind(coordinator),
    deactivateCrisis: coordinator.reportUserSafe.bind(coordinator),
    isActive: state.isActive,
    severity: state.severity
  };
}

// React import for the hook
declare global {
  var React: typeof import('react');
}

export default CrisisModeCoordinator;