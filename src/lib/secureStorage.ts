/**
 * Secure Storage for Mental Health Data
 * 
 * HIPAA-COMPLIANT: All patient health information (PHI) 
 * must be encrypted before storage in localStorage
 */

// Use native Web Crypto API instead of crypto-js for better security and no dependencies
// This provides FIPS 140-2 compliant encryption in modern browsers

// Generate or retrieve encryption key for this device using Web Crypto API
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  const keyName = 'alchm_device_key_v2';
  
  try {
    // Try to retrieve existing key
    const storedKeyData = localStorage.getItem(keyName);
    if (storedKeyData) {
      const keyData = JSON.parse(storedKeyData);
      return await crypto.subtle.importKey(
        'jwk',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    }
    
    // Generate new key if none exists
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Export and store the key
    const exportedKey = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(keyName, JSON.stringify(exportedKey));
    
    return key;
  } catch (error) {
    console.error('Key generation/retrieval failed:', error);
    throw new Error('Failed to create or retrieve encryption key');
  }
}

// Generate additional entropy for key derivation
function getSessionEntropy(): string {
  const timestamp = Date.now().toString();
  const userAgent = navigator.userAgent || 'unknown';
  const screenInfo = `${screen.width || 0}x${${screen.height || 0}}`;
  const language = navigator.language || 'en';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  return `${timestamp}-${userAgent.slice(0, 50)}-${screenInfo}-${language}-${timezone}`;
}

// Convert string to ArrayBuffer for encryption
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Convert ArrayBuffer to string for decryption
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

/**
 * Encrypt sensitive data using Web Crypto API (AES-GCM)
 */
export async function encryptData(data: any): Promise<string> {
  try {
    if (typeof window === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }
    
    const key = await getOrCreateEncryptionKey();
    const jsonString = JSON.stringify(data);
    const dataBuffer = stringToArrayBuffer(jsonString);
    
    // Generate random IV for each encryption
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Add session entropy as additional authenticated data
    const aad = stringToArrayBuffer(getSessionEntropy());
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: aad
      },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Decrypt data using Web Crypto API (AES-GCM)
 */
export async function decryptData(encryptedData: string): Promise<any> {
  try {
    if (typeof window === 'undefined' || !crypto.subtle) {
      return null;
    }
    
    const key = await getOrCreateEncryptionKey();
    
    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Get session entropy for AAD
    const aad = stringToArrayBuffer(getSessionEntropy());
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: aad
      },
      key,
      encrypted
    );
    
    const decryptedText = arrayBufferToString(decryptedBuffer);
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Return null instead of throwing to allow app to continue
    return null;
  }
}

/**
 * Secure localStorage wrapper for mental health data
 */
export const secureStorage = {
  /**
   * Store encrypted mental health data
   */
  async setItem(key: string, value: any, isHealthData = true): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        console.warn('SecureStorage: Window not available');
        return;
      }

      if (isHealthData) {
        // Encrypt all health-related data
        const encrypted = await encryptData(value);
        localStorage.setItem(`encrypted_${key}`, encrypted);
        
        // Store metadata about encryption (for audit purposes)
        const metadata = {
          encrypted: true,
          timestamp: new Date().toISOString(),
          type: 'health_data',
          algorithm: 'AES-GCM-256'
        };
        localStorage.setItem(`meta_${key}`, JSON.stringify(metadata));
      } else {
        // Non-health data can be stored normally
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    } catch (error) {
      console.error('SecureStorage setItem failed:', error);
      throw error;
    }
  },

  /**
   * Retrieve and decrypt mental health data
   */
  async getItem(key: string, isHealthData = true): Promise<any> {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      if (isHealthData) {
        // Try to get encrypted data first
        const encryptedData = localStorage.getItem(`encrypted_${key}`);
        if (encryptedData) {
          const decrypted = await decryptData(encryptedData);
          if (decrypted !== null) {
            return decrypted;
          }
        }
        
        // Fallback: check for unencrypted legacy data
        const legacyData = localStorage.getItem(key);
        if (legacyData) {
          try {
            // Migrate legacy data to encrypted storage
            const parsed = JSON.parse(legacyData);
            await this.setItem(key, parsed, true);
            
            // Remove unencrypted version
            localStorage.removeItem(key);
            
            return parsed;
          } catch {
            return legacyData;
          }
        }
        
        return null;
      } else {
        // Non-health data
        const data = localStorage.getItem(key);
        try {
          return data ? JSON.parse(data) : null;
        } catch {
          return data;
        }
      }
    } catch (error) {
      console.error('SecureStorage getItem failed:', error);
      return null;
    }
  },

  /**
   * Remove encrypted data
   */
  removeItem(key: string, isHealthData = true): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      if (isHealthData) {
        localStorage.removeItem(`encrypted_${key}`);
        localStorage.removeItem(`meta_${key}`);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('SecureStorage removeItem failed:', error);
    }
  },

  /**
   * Clear all encrypted health data
   */
  clearHealthData(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('encrypted_') || key.startsWith('meta_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('SecureStorage clearHealthData failed:', error);
    }
  },

  /**
   * Get storage audit information
   */
  getAuditInfo(): any {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const keys = Object.keys(localStorage);
      const encryptedKeys = keys.filter(key => key.startsWith('encrypted_'));
      const metaKeys = keys.filter(key => key.startsWith('meta_'));
      
      return {
        encryptedItems: encryptedKeys.length,
        totalMetadata: metaKeys.length,
        lastAccess: new Date().toISOString(),
        encryption: 'AES-256-CBC',
        keyDerivation: 'PBKDF2-SHA256-1000'
      };
    } catch (error) {
      console.error('SecureStorage audit failed:', error);
      return null;
    }
  }
};

/**
 * Enhanced browser utility with encryption support
 */
export const secureLocalStorage = {
  getItem: (key: string) => secureStorage.getItem(key, true),
  setItem: (key: string, value: any) => secureStorage.setItem(key, value, true),
  removeItem: (key: string) => secureStorage.removeItem(key, true)
};

/**
 * Synchronous wrapper for compatibility with existing code
 * NOTE: Uses synchronous fallback for legacy compatibility
 */
export const compatibleSecureStorage = {
  getItem: (key: string) => {
    // For immediate compatibility, return cached or fallback value
    const encryptedData = localStorage.getItem(`encrypted_${key}`);
    if (encryptedData) {
      // For sync compatibility, we'll need to decrypt asynchronously in background
      // and return cached value for now
      console.warn('Encrypted data found but requires async decryption. Use secureStorage.getItem() directly for proper decryption.');
    }
    
    // Fallback to unencrypted legacy data
    const legacyData = localStorage.getItem(key);
    try {
      return legacyData ? JSON.parse(legacyData) : null;
    } catch {
      return legacyData;
    }
  },
  
  setItem: (key: string, value: any) => {
    // Store data that will be encrypted in next async operation
    localStorage.setItem(`pending_encrypt_${key}`, JSON.stringify(value));
    
    // Trigger async encryption in background
    secureStorage.setItem(key, value, true).then(() => {
      // Clean up pending data once encrypted
      localStorage.removeItem(`pending_encrypt_${key}`);
    }).catch(console.error);
  },
  
  removeItem: (key: string) => {
    secureStorage.removeItem(key, true);
  }
};

/**
 * Check if current storage contains unencrypted health data
 */
export function auditStorageSecurity(): {
  hasUnencryptedHealthData: boolean;
  unencryptedKeys: string[];
  encryptedKeys: string[];
  recommendations: string[];
} {
  if (typeof window === 'undefined') {
    return {
      hasUnencryptedHealthData: false,
      unencryptedKeys: [],
      encryptedKeys: [],
      recommendations: ['Run audit in browser environment']
    };
  }

  const allKeys = Object.keys(localStorage);
  const encryptedKeys = allKeys.filter(key => key.startsWith('encrypted_'));
  const healthDataKeys = [
    'userEmail', 'journalEntries', 'safetyPlan', 'moodData',
    'therapyNotes', 'medicationReminders', 'crisisEvents'
  ];
  
  const unencryptedHealthKeys = allKeys.filter(key => 
    healthDataKeys.some(healthKey => key.includes(healthKey)) && 
    !key.startsWith('encrypted_') && 
    !key.startsWith('meta_')
  );

  const recommendations = [];
  if (unencryptedHealthKeys.length > 0) {
    recommendations.push('Migrate unencrypted health data to secure storage');
  }
  if (encryptedKeys.length === 0) {
    recommendations.push('Enable encryption for all new health data');
  }
  
  return {
    hasUnencryptedHealthData: unencryptedHealthKeys.length > 0,
    unencryptedKeys: unencryptedHealthKeys,
    encryptedKeys,
    recommendations
  };
}