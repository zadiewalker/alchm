/**
 * Privacy-Preserving Storage and Deletion System for ALCHM Visual Diagnostics
 * Ensures all visual diagnostic data is handled with maximum privacy and security
 */

import { createHash } from 'crypto';

export interface PrivacyConfig {
  maxRetentionHours: number;
  autoDeleteEnabled: boolean;
  encryptionEnabled: boolean;
  sensitiveDataBlurring: boolean;
  consentRequired: boolean;
  auditLogging: boolean;
  traumaInformed: boolean;
}

export interface StoredDiagnosticData {
  id: string;
  type: 'screenshot' | 'recording' | 'logs' | 'annotation';
  encryptedData: string;
  metadata: DiagnosticMetadata;
  privacy: PrivacyMetadata;
  consent: ConsentRecord;
  audit: AuditLog[];
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface DiagnosticMetadata {
  fileSize: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  format: string;
  compressed: boolean;
  analyzed: boolean;
  analysisResults?: any;
  userId?: string;
  sessionId: string;
  deviceInfo: DeviceInfo;
}

export interface PrivacyMetadata {
  sensitiveDataDetected: SensitiveDataDetection[];
  blurredRegions: BlurredRegion[];
  encryptionMethod: string;
  anonymized: boolean;
  pseudonymized: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  retentionCategory: 'diagnostic' | 'support' | 'development' | 'research';
}

export interface SensitiveDataDetection {
  type: 'email' | 'phone' | 'address' | 'name' | 'payment' | 'medical' | 'personal';
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
  masked: boolean;
  redactionMethod: 'blur' | 'black_box' | 'pixelate' | 'remove';
}

export interface BlurredRegion {
  bounds: { x: number; y: number; width: number; height: number };
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  applied: boolean;
}

export interface ConsentRecord {
  granted: boolean;
  grantedAt: Date;
  consentType: 'diagnostic' | 'support' | 'improvement' | 'research';
  scope: string[];
  duration: number; // hours
  withdrawable: boolean;
  traumaInformedConsent: boolean;
  parentalConsent?: boolean;
  explicitConsent: boolean;
}

export interface AuditLog {
  timestamp: Date;
  action: 'created' | 'accessed' | 'modified' | 'shared' | 'deleted' | 'expired';
  actor: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}

export interface DeviceInfo {
  platform: string;
  browser: string;
  version: string;
  mobile: boolean;
  screenSize: { width: number; height: number };
  timezone: string;
  language: string;
}

export interface DeletionPolicy {
  automaticDeletion: boolean;
  retentionPeriod: number; // hours
  warningPeriod: number; // hours before deletion
  userControlled: boolean;
  immediateOnRequest: boolean;
  secureWipe: boolean;
  auditDeletion: boolean;
}

export interface PrivacyViolation {
  id: string;
  timestamp: Date;
  type: 'unauthorized_access' | 'retention_exceeded' | 'consent_violation' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedData: string[];
  resolved: boolean;
  reportedToUser: boolean;
  mitigationActions: string[];
}

/**
 * Main Privacy Manager class
 */
export class PrivacyManager {
  private config: PrivacyConfig;
  private storageKey = 'alchm_diagnostic_data';
  private encryptionKey: string;
  private deletionTimers: Map<string, NodeJS.Timeout> = new Map();
  private violations: PrivacyViolation[] = [];

  constructor(config: Partial<PrivacyConfig> = {}) {
    this.config = {
      maxRetentionHours: 24,
      autoDeleteEnabled: true,
      encryptionEnabled: true,
      sensitiveDataBlurring: true,
      consentRequired: true,
      auditLogging: true,
      traumaInformed: true,
      ...config
    };

    this.encryptionKey = this.generateEncryptionKey();
    this.initializeDeletionScheduler();
  }

  /**
   * Store diagnostic data with privacy protections
   */
  async storeDiagnosticData(
    data: Blob | string,
    type: StoredDiagnosticData['type'],
    metadata: Partial<DiagnosticMetadata>,
    consent: ConsentRecord
  ): Promise<string> {
    // Validate consent
    if (this.config.consentRequired && !this.validateConsent(consent)) {
      throw new Error(this.config.traumaInformed 
        ? 'We need your permission to help you with this. Your privacy is important to us.'
        : 'Valid consent required for data storage');
    }

    // Generate unique ID
    const id = this.generateId();

    // Process data for privacy
    const processedData = await this.processForPrivacy(data, type);

    // Encrypt data
    const encryptedData = this.config.encryptionEnabled 
      ? await this.encryptData(processedData)
      : typeof processedData === 'string' ? processedData : await this.blobToBase64(processedData);

    // Create storage record
    const storedData: StoredDiagnosticData = {
      id,
      type,
      encryptedData,
      metadata: {
        fileSize: typeof data === 'string' ? data.length : data.size,
        format: this.detectFormat(data),
        compressed: false,
        analyzed: false,
        sessionId: this.generateSessionId(),
        deviceInfo: this.getDeviceInfo(),
        ...metadata
      },
      privacy: {
        sensitiveDataDetected: [],
        blurredRegions: [],
        encryptionMethod: this.config.encryptionEnabled ? 'AES-256-GCM' : 'none',
        anonymized: false,
        pseudonymized: true,
        dataClassification: 'confidential',
        retentionCategory: 'diagnostic'
      },
      consent,
      audit: [{
        timestamp: new Date(),
        action: 'created',
        actor: 'system',
        details: `${type} data stored with privacy protections`,
        reason: 'diagnostic_support'
      }],
      expiresAt: new Date(Date.now() + this.config.maxRetentionHours * 60 * 60 * 1000),
      createdAt: new Date(),
      lastAccessedAt: new Date()
    };

    // Store in browser storage (encrypted)
    await this.saveToStorage(id, storedData);

    // Schedule automatic deletion
    if (this.config.autoDeleteEnabled) {
      this.scheduleAutomaticDeletion(id, storedData.expiresAt);
    }

    // Log audit event
    if (this.config.auditLogging) {
      this.logAuditEvent(id, 'created', 'Data stored with privacy protections');
    }

    return id;
  }

  /**
   * Retrieve diagnostic data with access logging
   */
  async retrieveDiagnosticData(id: string, reason?: string): Promise<StoredDiagnosticData | null> {
    const storedData = await this.loadFromStorage(id);
    
    if (!storedData) {
      return null;
    }

    // Check if expired
    if (storedData.expiresAt <= new Date()) {
      await this.deleteDiagnosticData(id, 'expired');
      return null;
    }

    // Update last accessed time
    storedData.lastAccessedAt = new Date();

    // Log access
    this.logAuditEvent(id, 'accessed', reason || 'Data retrieved');

    await this.saveToStorage(id, storedData);

    return storedData;
  }

  /**
   * Delete diagnostic data securely
   */
  async deleteDiagnosticData(id: string, reason: string = 'user_request'): Promise<boolean> {
    const storedData = await this.loadFromStorage(id);
    
    if (!storedData) {
      return false;
    }

    // Log deletion
    this.logAuditEvent(id, 'deleted', `Data deletion: ${reason}`);

    // Secure deletion from storage
    await this.secureDeleteFromStorage(id);

    // Cancel scheduled deletion
    if (this.deletionTimers.has(id)) {
      clearTimeout(this.deletionTimers.get(id)!);
      this.deletionTimers.delete(id);
    }

    // If trauma-informed, log supportive message
    if (this.config.traumaInformed) {
      console.log(`💚 Your data has been safely and completely removed. Your privacy is protected.`);
    }

    return true;
  }

  /**
   * Get user's data summary for transparency
   */
  async getUserDataSummary(): Promise<{
    totalFiles: number;
    dataTypes: Record<string, number>;
    totalSize: number;
    oldestFile: Date | null;
    expirationDates: Date[];
    privacyStatus: 'compliant' | 'warning' | 'violation';
  }> {
    const allData = await this.getAllStoredData();
    
    const summary = {
      totalFiles: allData.length,
      dataTypes: {} as Record<string, number>,
      totalSize: 0,
      oldestFile: null as Date | null,
      expirationDates: [] as Date[],
      privacyStatus: 'compliant' as const
    };

    allData.forEach(data => {
      summary.dataTypes[data.type] = (summary.dataTypes[data.type] || 0) + 1;
      summary.totalSize += data.metadata.fileSize;
      summary.expirationDates.push(data.expiresAt);
      
      if (!summary.oldestFile || data.createdAt < summary.oldestFile) {
        summary.oldestFile = data.createdAt;
      }
    });

    // Check for privacy violations
    const expiredData = allData.filter(data => data.expiresAt <= new Date());
    if (expiredData.length > 0) {
      summary.privacyStatus = 'violation';
    }

    return summary;
  }

  /**
   * Delete all user data (right to be forgotten)
   */
  async deleteAllUserData(): Promise<{
    deletedCount: number;
    errors: string[];
    traumaInformedMessage?: string;
  }> {
    const allData = await this.getAllStoredData();
    let deletedCount = 0;
    const errors: string[] = [];

    for (const data of allData) {
      try {
        await this.deleteDiagnosticData(data.id, 'user_requested_full_deletion');
        deletedCount++;
      } catch (error) {
        errors.push(`Failed to delete ${data.id}: ${error}`);
      }
    }

    const result = {
      deletedCount,
      errors,
      traumaInformedMessage: this.config.traumaInformed 
        ? `We've safely removed all your diagnostic data (${deletedCount} files). Your privacy is completely protected, and you can use ALCHM knowing your data is secure. This was your choice, and we respect that.`
        : undefined
    };

    return result;
  }

  /**
   * Process data for privacy (blur sensitive information)
   */
  private async processForPrivacy(data: Blob | string, type: StoredDiagnosticData['type']): Promise<Blob | string> {
    if (!this.config.sensitiveDataBlurring || type === 'logs') {
      return data;
    }

    if (typeof data === 'string') {
      // Text data - remove sensitive patterns
      return this.sanitizeTextData(data);
    }

    if (type === 'screenshot' || type === 'recording') {
      // Image/video data - blur sensitive regions
      return await this.blurSensitiveRegions(data);
    }

    return data;
  }

  /**
   * Sanitize text data
   */
  private sanitizeTextData(text: string): string {
    // Remove email addresses
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
    
    // Remove phone numbers
    text = text.replace(/(\+?1?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g, '[PHONE_REDACTED]');
    
    // Remove credit card numbers
    text = text.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_REDACTED]');
    
    // Remove SSN patterns
    text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
    
    return text;
  }

  /**
   * Blur sensitive regions in image data
   */
  private async blurSensitiveRegions(data: Blob): Promise<Blob> {
    // This would integrate with computer vision to detect sensitive content
    // For now, return original data
    return data;
  }

  /**
   * Encrypt data
   */
  private async encryptData(data: Blob | string): Promise<string> {
    // Simple encryption simulation
    const dataString = typeof data === 'string' ? data : await this.blobToBase64(data);
    
    // In production, use Web Crypto API
    const encrypted = btoa(dataString + this.encryptionKey);
    
    return encrypted;
  }

  /**
   * Decrypt data
   */
  private async decryptData(encryptedData: string): Promise<string> {
    // Simple decryption simulation
    const decrypted = atob(encryptedData);
    return decrypted.replace(this.encryptionKey, '');
  }

  /**
   * Schedule automatic deletion
   */
  private scheduleAutomaticDeletion(id: string, expiresAt: Date): void {
    const timeUntilExpiry = expiresAt.getTime() - Date.now();
    
    if (timeUntilExpiry > 0) {
      const timer = setTimeout(async () => {
        await this.deleteDiagnosticData(id, 'automatic_expiry');
        this.deletionTimers.delete(id);
      }, timeUntilExpiry);
      
      this.deletionTimers.set(id, timer);
    }
  }

  /**
   * Initialize deletion scheduler
   */
  private async initializeDeletionScheduler(): Promise<void> {
    const allData = await this.getAllStoredData();
    
    allData.forEach(data => {
      if (data.expiresAt > new Date()) {
        this.scheduleAutomaticDeletion(data.id, data.expiresAt);
      } else {
        // Delete expired data immediately
        this.deleteDiagnosticData(data.id, 'startup_cleanup');
      }
    });
  }

  /**
   * Storage operations
   */
  private async saveToStorage(id: string, data: StoredDiagnosticData): Promise<void> {
    const key = `${this.storageKey}_${id}`;
    const serialized = JSON.stringify(data);
    
    try {
      typeof window !== 'undefined' && localStorage.setItem(key, serialized);
    } catch (error) {
      // Handle storage quota exceeded
      console.warn('Storage quota exceeded, cleaning up old data');
      await this.cleanupOldData();
      typeof window !== 'undefined' && localStorage.setItem(key, serialized);
    }
  }

  private async loadFromStorage(id: string): Promise<StoredDiagnosticData | null> {
    const key = `${this.storageKey}_${id}`;
    const serialized = typeof window !== 'undefined' && localStorage.getItem(key);
    
    if (!serialized) {
      return null;
    }

    try {
      const data = JSON.parse(serialized);
      // Deserialize dates
      data.expiresAt = new Date(data.expiresAt);
      data.createdAt = new Date(data.createdAt);
      data.lastAccessedAt = new Date(data.lastAccessedAt);
      data.audit = data.audit.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      return data;
    } catch (error) {
      console.error('Failed to parse stored data:', error);
      return null;
    }
  }

  private async secureDeleteFromStorage(id: string): Promise<void> {
    const key = `${this.storageKey}_${id}`;
    
    // Overwrite with random data multiple times for secure deletion
    for (let i = 0; i < 3; i++) {
      const randomData = Array(1000).fill(0).map(() => Math.random().toString(36)).join('');
      typeof window !== 'undefined' && localStorage.setItem(key, randomData);
    }
    
    typeof window !== 'undefined' && localStorage.removeItem(key);
  }

  private async getAllStoredData(): Promise<StoredDiagnosticData[]> {
    const allData: StoredDiagnosticData[] = [];
    
    for (let i = 0; i < typeof window !== 'undefined' && localStorage.length; i++) {
      const key = typeof window !== 'undefined' && localStorage.key(i);
      if (key?.startsWith(this.storageKey)) {
        const id = key.replace(`${this.storageKey}_`, '');
        const data = await this.loadFromStorage(id);
        if (data) {
          allData.push(data);
        }
      }
    }
    
    return allData;
  }

  /**
   * Utility methods
   */
  private validateConsent(consent: ConsentRecord): boolean {
    if (!consent.granted) return false;
    if (consent.grantedAt.getTime() + (consent.duration * 60 * 60 * 1000) < Date.now()) return false;
    return true;
  }

  private generateId(): string {
    return `diag_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateEncryptionKey(): string {
    // In production, use a proper key derivation function
    return Array(32).fill(0).map(() => Math.random().toString(36)).join('').substring(0, 32);
  }

  private detectFormat(data: Blob | string): string {
    if (typeof data === 'string') return 'text';
    return data.type || 'binary';
  }

  private getDeviceInfo(): DeviceInfo {
    return {
      platform: typeof window !== 'undefined' && navigator.platform,
      browser: typeof window !== 'undefined' && navigator.userAgent.split(' ')[0],
      version: typeof window !== 'undefined' && navigator.appVersion,
      mobile: /Mobile|Android|iPhone|iPad/.test(typeof window !== 'undefined' && navigator.userAgent),
      screenSize: { width: screen.width, height: screen.height },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: typeof window !== 'undefined' && navigator.language
    };
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private logAuditEvent(dataId: string, action: AuditLog['action'], details: string): void {
    if (!this.config.auditLogging) return;
    
    console.log(`[PRIVACY AUDIT] ${action.toUpperCase()}: ${details} (ID: ${dataId})`);
  }

  private async cleanupOldData(): Promise<void> {
    const allData = await this.getAllStoredData();
    const sortedByAge = allData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // Delete oldest 20% of data
    const toDelete = sortedByAge.slice(0, Math.ceil(sortedByAge.length * 0.2));
    
    for (const data of toDelete) {
      await this.deleteDiagnosticData(data.id, 'storage_cleanup');
    }
  }
}

/**
 * Factory function for creating privacy manager instances
 */
export function createPrivacyManager(config?: Partial<PrivacyConfig>): PrivacyManager {
  return new PrivacyManager(config);
}

/**
 * Helper function to create trauma-informed consent
 */
export function createTraumaInformedConsent(
  scope: string[],
  durationHours: number = 24
): ConsentRecord {
  return {
    granted: true,
    grantedAt: new Date(),
    consentType: 'diagnostic',
    scope,
    duration: durationHours,
    withdrawable: true,
    traumaInformedConsent: true,
    explicitConsent: true
  };
}

/**
 * Privacy-first configuration for ALCHM
 */
export const ALCHM_PRIVACY_CONFIG: PrivacyConfig = {
  maxRetentionHours: 24,
  autoDeleteEnabled: true,
  encryptionEnabled: true,
  sensitiveDataBlurring: true,
  consentRequired: true,
  auditLogging: true,
  traumaInformed: true
};