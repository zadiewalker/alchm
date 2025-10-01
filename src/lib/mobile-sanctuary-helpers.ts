/**
 * Mobile Sanctuary Helpers - Battery Conservation & Offline Functionality
 * Optimized for users in vulnerable states accessing ALCHM during crisis
 */

// Device capability detection
export interface DeviceCapabilities {
  batteryAPI: boolean;
  vibration: boolean;
  serviceWorker: boolean;
  localStorage: boolean;
  networkInformation: boolean;
  wakeLock: boolean;
  offline: boolean;
}

// Battery status interface
export interface BatteryStatus {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  isLowBattery: boolean;
  isCriticalBattery: boolean;
}

// Network information interface
export interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
  isSlowConnection: boolean;
  isOffline: boolean;
}

// Performance tier based on device capabilities
export type PerformanceTier = 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high';

/**
 * Detect device capabilities for Progressive Enhancement
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  if (typeof window === 'undefined') {
    return {
      batteryAPI: false,
      vibration: false,
      serviceWorker: false,
      localStorage: false,
      networkInformation: false,
      wakeLock: false,
      offline: false
    };
  }

  return {
    batteryAPI: 'getBattery' in navigator,
    vibration: 'vibrate' in navigator,
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: typeof Storage !== 'undefined',
    networkInformation: 'connection' in navigator,
    wakeLock: 'wakeLock' in navigator,
    offline: !navigator.onLine
  };
};

/**
 * Battery Management for Crisis Situations
 */
export class BatteryManager {
  private battery: any = null;
  private callbacks: ((status: BatteryStatus) => void)[] = [];
  private lowBatteryThreshold = 0.2; // 20%
  private criticalBatteryThreshold = 0.1; // 10%

  constructor() {
    this.initializeBattery();
  }

  private async initializeBattery() {
    if ('getBattery' in navigator) {
      try {
        this.battery = await (navigator as any).getBattery();
        this.setupBatteryListeners();
      } catch (error) {
        console.warn('Battery API not supported or failed:', error);
      }
    }
  }

  private setupBatteryListeners() {
    if (!this.battery) return;

    const updateStatus = () => {
      const status = this.getBatteryStatus();
      this.callbacks.forEach(callback => callback(status));
    };

    this.battery.addEventListener('chargingchange', updateStatus);
    this.battery.addEventListener('levelchange', updateStatus);
    this.battery.addEventListener('chargingtimechange', updateStatus);
    this.battery.addEventListener('dischargingtimechange', updateStatus);
  }

  getBatteryStatus(): BatteryStatus {
    if (!this.battery) {
      return {
        level: 1,
        charging: false,
        chargingTime: Infinity,
        dischargingTime: Infinity,
        isLowBattery: false,
        isCriticalBattery: false
      };
    }

    const level = this.battery.level;
    return {
      level,
      charging: this.battery.charging,
      chargingTime: this.battery.chargingTime,
      dischargingTime: this.battery.dischargingTime,
      isLowBattery: level <= this.lowBatteryThreshold && !this.battery.charging,
      isCriticalBattery: level <= this.criticalBatteryThreshold && !this.battery.charging
    };
  }

  onBatteryChange(callback: (status: BatteryStatus) => void) {
    this.callbacks.push(callback);
    // Immediately call with current status
    callback(this.getBatteryStatus());
  }

  /**
   * Enable battery saver mode optimizations
   */
  enableBatterySaver(): void {
    document.documentElement.classList.add('sanctuary-battery-saver');
    
    // Disable animations
    const style = document.createElement('style');
    style.textContent = `
      .sanctuary-battery-saver * {
        animation-play-state: paused !important;
        transition-duration: 0.01ms !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
        will-change: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  disableBatterySaver(): void {
    document.documentElement.classList.remove('sanctuary-battery-saver');
    // Remove the injected styles
    const styles = document.head.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent?.includes('sanctuary-battery-saver')) {
        style.remove();
      }
    });
  }
}

/**
 * Network Quality Detection for Progressive Loading
 */
export class NetworkManager {
  private callbacks: ((info: NetworkInfo) => void)[] = [];

  constructor() {
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    // Online/offline events
    window.addEventListener('online', () => this.notifyCallbacks());
    window.addEventListener('offline', () => this.notifyCallbacks());

    // Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => this.notifyCallbacks());
    }
  }

  private notifyCallbacks() {
    const info = this.getNetworkInfo();
    this.callbacks.forEach(callback => callback(info));
  }

  getNetworkInfo(): NetworkInfo {
    const isOffline = !navigator.onLine;
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection.effectiveType || 'unknown';
      
      return {
        effectiveType,
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
        isSlowConnection: effectiveType === '2g' || effectiveType === 'slow-2g' || connection.saveData,
        isOffline
      };
    }

    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false,
      isSlowConnection: false,
      isOffline
    };
  }

  onNetworkChange(callback: (info: NetworkInfo) => void) {
    this.callbacks.push(callback);
    // Immediately call with current status
    callback(this.getNetworkInfo());
  }

  /**
   * Optimize for slow connections
   */
  enableSlowConnectionMode(): void {
    document.documentElement.classList.add('slow-connection');
    
    // Disable non-essential images and animations
    const style = document.createElement('style');
    style.textContent = `
      .slow-connection .high-bandwidth-content {
        display: none !important;
      }
      .slow-connection img:not([data-essential]) {
        opacity: 0.3;
      }
      .slow-connection video {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  disableSlowConnectionMode(): void {
    document.documentElement.classList.remove('slow-connection');
  }
}

/**
 * Performance Tier Detection for Adaptive UX
 */
export class PerformanceManager {
  private tier: PerformanceTier = 'medium';
  private callbacks: ((tier: PerformanceTier) => void)[] = [];

  constructor() {
    this.detectPerformanceTier();
  }

  private async detectPerformanceTier(): Promise<void> {
    let score = 0;

    // Device memory
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      if (memory >= 8) score += 3;
      else if (memory >= 4) score += 2;
      else if (memory >= 2) score += 1;
    } else {
      score += 1; // Default assumption
    }

    // Hardware concurrency (CPU cores)
    if ('hardwareConcurrency' in navigator) {
      const cores = navigator.hardwareConcurrency;
      if (cores >= 8) score += 3;
      else if (cores >= 4) score += 2;
      else if (cores >= 2) score += 1;
    } else {
      score += 1; // Default assumption
    }

    // Connection quality
    const networkInfo = new NetworkManager().getNetworkInfo();
    if (networkInfo.effectiveType === '4g' && networkInfo.downlink > 1.5) score += 2;
    else if (networkInfo.effectiveType === '3g') score += 1;

    // Performance timing (if available)
    if ('performance' in window && performance.timing) {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      if (loadTime < 1000) score += 2;
      else if (loadTime < 3000) score += 1;
    }

    // Determine tier
    if (score >= 10) this.tier = 'ultra-high';
    else if (score >= 7) this.tier = 'high';
    else if (score >= 5) this.tier = 'medium';
    else if (score >= 3) this.tier = 'low';
    else this.tier = 'ultra-low';

    this.applyPerformanceTier();
    this.notifyCallbacks();
  }

  private applyPerformanceTier(): void {
    document.documentElement.classList.add(`perf-tier-${this.tier}`);
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback(this.tier));
  }

  getPerformanceTier(): PerformanceTier {
    return this.tier;
  }

  onPerformanceTierChange(callback: (tier: PerformanceTier) => void): void {
    this.callbacks.push(callback);
    callback(this.tier);
  }
}

/**
 * Offline-First Storage Manager for Crisis Situations
 */
export class OfflineStorageManager {
  private readonly CRISIS_RESOURCES_KEY = 'alchm_crisis_resources';
  private readonly JOURNAL_DRAFTS_KEY = 'alchm_journal_drafts';
  private readonly USER_PREFERENCES_KEY = 'alchm_user_preferences';

  /**
   * Store critical crisis resources for offline access
   */
  async storeCrisisResources(resources: any[]): Promise<void> {
    try {
      const encrypted = await this.encryptData(resources);
      localStorage.setItem(this.CRISIS_RESOURCES_KEY, encrypted);
    } catch (error) {
      console.error('Failed to store crisis resources:', error);
    }
  }

  /**
   * Retrieve crisis resources (works offline)
   */
  async getCrisisResources(): Promise<any[]> {
    try {
      const encrypted = localStorage.getItem(this.CRISIS_RESOURCES_KEY);
      if (encrypted) {
        return await this.decryptData(encrypted);
      }
    } catch (error) {
      console.error('Failed to retrieve crisis resources:', error);
    }
    
    // Return default crisis resources if none stored
    return this.getDefaultCrisisResources();
  }

  /**
   * Store journal draft for offline writing
   */
  async storeJournalDraft(id: string, content: any): Promise<void> {
    try {
      const drafts = await this.getJournalDrafts();
      drafts[id] = {
        ...content,
        lastModified: new Date().toISOString(),
        offline: true
      };
      
      const encrypted = await this.encryptData(drafts);
      localStorage.setItem(this.JOURNAL_DRAFTS_KEY, encrypted);
    } catch (error) {
      console.error('Failed to store journal draft:', error);
    }
  }

  /**
   * Get all journal drafts
   */
  async getJournalDrafts(): Promise<Record<string, any>> {
    try {
      const encrypted = localStorage.getItem(this.JOURNAL_DRAFTS_KEY);
      if (encrypted) {
        return await this.decryptData(encrypted);
      }
    } catch (error) {
      console.error('Failed to retrieve journal drafts:', error);
    }
    return {};
  }

  /**
   * Store user preferences for offline access
   */
  async storeUserPreferences(preferences: any): Promise<void> {
    try {
      const encrypted = await this.encryptData(preferences);
      localStorage.setItem(this.USER_PREFERENCES_KEY, encrypted);
    } catch (error) {
      console.error('Failed to store user preferences:', error);
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<any> {
    try {
      const encrypted = localStorage.getItem(this.USER_PREFERENCES_KEY);
      if (encrypted) {
        return await this.decryptData(encrypted);
      }
    } catch (error) {
      console.error('Failed to retrieve user preferences:', error);
    }
    return {};
  }

  private async encryptData(data: any): Promise<string> {
    // Simple encryption for client-side storage
    // In production, use proper encryption libraries
    return btoa(JSON.stringify(data));
  }

  private async decryptData(encrypted: string): Promise<any> {
    try {
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  private getDefaultCrisisResources(): any[] {
    return [
      {
        id: 'suicide-prevention',
        title: 'Suicide & Crisis Lifeline',
        description: '24/7 crisis support',
        phone: '988',
        text: 'HOME to 741741',
        priority: 'high'
      },
      {
        id: 'crisis-text',
        title: 'Crisis Text Line',
        description: 'Text-based crisis support',
        text: 'HOME to 741741',
        priority: 'high'
      },
      {
        id: 'emergency',
        title: 'Emergency Services',
        description: 'Medical emergency',
        phone: '911',
        priority: 'critical'
      }
    ];
  }

  /**
   * Clear all offline data (for privacy)
   */
  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.CRISIS_RESOURCES_KEY);
      localStorage.removeItem(this.JOURNAL_DRAFTS_KEY);
      localStorage.removeItem(this.USER_PREFERENCES_KEY);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: number; percentage: number } {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
          percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100
        };
      });
    }
    
    // Fallback estimation
    let used = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
    } catch (error) {
      // localStorage might not be available
    }
    
    return {
      used,
      available: 5 * 1024 * 1024, // Assume 5MB available
      percentage: (used / (5 * 1024 * 1024)) * 100
    };
  }
}

/**
 * Haptic Feedback Manager for Crisis Support
 */
export class HapticManager {
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'vibrate' in navigator;
  }

  /**
   * Gentle vibration for positive feedback
   */
  gentle(): void {
    if (this.isSupported) {
      navigator.vibrate(50);
    }
  }

  /**
   * Breathing pattern vibration for grounding
   */
  breathing(): void {
    if (this.isSupported) {
      // 4-7-8 breathing pattern
      navigator.vibrate([4000, 500, 7000, 500, 8000]);
    }
  }

  /**
   * Emergency attention pattern
   */
  emergency(): void {
    if (this.isSupported) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }

  /**
   * Success pattern for completed actions
   */
  success(): void {
    if (this.isSupported) {
      navigator.vibrate([100, 50, 100]);
    }
  }

  /**
   * Warning pattern for important notifications
   */
  warning(): void {
    if (this.isSupported) {
      navigator.vibrate([150, 100, 150, 100, 150]);
    }
  }
}

/**
 * Comprehensive Mobile Sanctuary Manager
 * Coordinates all mobile optimization features
 */
export class MobileSanctuaryManager {
  public battery: BatteryManager;
  public network: NetworkManager;
  public performance: PerformanceManager;
  public storage: OfflineStorageManager;
  public haptic: HapticManager;
  
  private crisisMode = false;
  private batterySaver = false;

  constructor() {
    this.battery = new BatteryManager();
    this.network = new NetworkManager();
    this.performance = new PerformanceManager();
    this.storage = new OfflineStorageManager();
    this.haptic = new HapticManager();

    this.setupAutoOptimizations();
  }

  private setupAutoOptimizations(): void {
    // Auto-enable battery saver on low battery
    this.battery.onBatteryChange((status) => {
      if (status.isLowBattery && !this.batterySaver) {
        this.enableBatterySaver();
      } else if (!status.isLowBattery && this.batterySaver && !this.crisisMode) {
        this.disableBatterySaver();
      }
    });

    // Auto-optimize for slow connections
    this.network.onNetworkChange((info) => {
      if (info.isSlowConnection) {
        this.network.enableSlowConnectionMode();
      } else {
        this.network.disableSlowConnectionMode();
      }
    });
  }

  /**
   * Enable crisis mode optimizations
   */
  enableCrisisMode(): void {
    this.crisisMode = true;
    document.documentElement.classList.add('sanctuary-crisis-mode');
    
    // Ensure crisis resources are available offline
    this.storage.getCrisisResources().then(resources => {
      if (resources.length === 0) {
        // Pre-populate with default crisis resources
        this.storage.storeCrisisResources(this.getDefaultCrisisResources());
      }
    });

    // Enable enhanced haptic feedback
    this.haptic.warning();
  }

  /**
   * Disable crisis mode
   */
  disableCrisisMode(): void {
    this.crisisMode = false;
    document.documentElement.classList.remove('sanctuary-crisis-mode');
  }

  /**
   * Enable battery saver mode
   */
  enableBatterySaver(): void {
    this.batterySaver = true;
    this.battery.enableBatterySaver();
  }

  /**
   * Disable battery saver mode
   */
  disableBatterySaver(): void {
    this.batterySaver = false;
    this.battery.disableBatterySaver();
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus(): {
    battery: BatteryStatus;
    network: NetworkInfo;
    performance: PerformanceTier;
    capabilities: DeviceCapabilities;
    crisisMode: boolean;
    batterySaver: boolean;
  } {
    return {
      battery: this.battery.getBatteryStatus(),
      network: this.network.getNetworkInfo(),
      performance: this.performance.getPerformanceTier(),
      capabilities: detectDeviceCapabilities(),
      crisisMode: this.crisisMode,
      batterySaver: this.batterySaver
    };
  }

  private getDefaultCrisisResources() {
    return [
      {
        id: 'suicide-prevention',
        title: 'Suicide & Crisis Lifeline',
        phone: '988',
        available24_7: true
      },
      {
        id: 'crisis-text',
        title: 'Crisis Text Line',
        text: 'HOME to 741741',
        available24_7: true
      }
    ];
  }
}

// Export singleton instance for global use
export const mobileSanctuary = new MobileSanctuaryManager();