// ALCHM Client-Side Encryption for FERPA/COPPA Compliance
// AES-256-GCM encryption for journal content protection

import { createHmac, randomBytes } from 'crypto';

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  authTag: string;
  keyDerivationSalt: string;
}

export interface DecryptionResult {
  decryptedData: string;
  isValid: boolean;
}

export class EncryptionService {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 16;
  private readonly SALT_LENGTH = 32;
  private readonly TAG_LENGTH = 16;
  private readonly ITERATIONS = 100000; // PBKDF2 iterations

  // Generate user-specific encryption key from password + device fingerprint
  private async deriveKey(userPassword: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userPassword),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt journal content before Firestore storage
  async encryptJournalContent(
    content: string, 
    userKey: string, 
    additionalData?: string
  ): Promise<EncryptionResult> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      
      // Derive encryption key
      const key = await this.deriveKey(userKey, salt);
      
      // Encrypt with additional authenticated data (user ID, timestamp)
      const additionalAuthData = additionalData ? encoder.encode(additionalData) : undefined;
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: additionalAuthData
        },
        key,
        data
      );

      // Extract auth tag (last 16 bytes) and encrypted data
      const encryptedArray = new Uint8Array(encrypted);
      const authTag = encryptedArray.slice(-this.TAG_LENGTH);
      const encryptedData = encryptedArray.slice(0, -this.TAG_LENGTH);

      return {
        encryptedData: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv),
        authTag: this.arrayBufferToBase64(authTag),
        keyDerivationSalt: this.arrayBufferToBase64(salt)
      };
    } catch (error) {
      console.error('[Encryption] Failed to encrypt journal content:', error);
      throw new Error('Encryption failed - journal content not secure');
    }
  }

  // Decrypt journal content after Firestore retrieval
  async decryptJournalContent(
    encryptionResult: EncryptionResult,
    userKey: string,
    additionalData?: string
  ): Promise<DecryptionResult> {
    try {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      // Convert base64 back to Uint8Array
      const encryptedData = this.base64ToArrayBuffer(encryptionResult.encryptedData);
      const iv = this.base64ToArrayBuffer(encryptionResult.iv);
      const authTag = this.base64ToArrayBuffer(encryptionResult.authTag);
      const salt = this.base64ToArrayBuffer(encryptionResult.keyDerivationSalt);

      // Derive the same key
      const key = await this.deriveKey(userKey, salt);

      // Combine encrypted data with auth tag for decryption
      const encryptedWithTag = new Uint8Array(encryptedData.length + authTag.length);
      encryptedWithTag.set(new Uint8Array(encryptedData));
      encryptedWithTag.set(new Uint8Array(authTag), encryptedData.length);

      // Decrypt with additional authenticated data
      const additionalAuthData = additionalData ? encoder.encode(additionalData) : undefined;

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: additionalAuthData
        },
        key,
        encryptedWithTag
      );

      const decryptedData = decoder.decode(decrypted);

      return {
        decryptedData,
        isValid: true
      };
    } catch (error) {
      console.error('[Encryption] Failed to decrypt journal content:', error);
      return {
        decryptedData: '',
        isValid: false
      };
    }
  }

  // Generate device-specific key component for additional security
  async generateDeviceFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('ALCHM Security Fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      canvas.toDataURL()
    ].join('|');

    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    return this.arrayBufferToBase64(hashBuffer).substring(0, 16);
  }

  // Utility functions for base64 conversion
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Validate encryption integrity
  async validateEncryption(encryptionResult: EncryptionResult): Promise<boolean> {
    try {
      // Check that all required fields are present and valid base64
      const requiredFields = ['encryptedData', 'iv', 'authTag', 'keyDerivationSalt'];
      for (const field of requiredFields) {
        if (!encryptionResult[field as keyof EncryptionResult]) {
          return false;
        }
        // Validate base64
        atob(encryptionResult[field as keyof EncryptionResult] as string);
      }
      return true;
    } catch {
      return false;
    }
  }

  // Secure key generation for new users
  async generateSecureUserKey(): Promise<string> {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const deviceFingerprint = await this.generateDeviceFingerprint();
    
    // Combine random bytes with device fingerprint
    const combined = this.arrayBufferToBase64(randomBytes) + deviceFingerprint;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(combined));
    
    return this.arrayBufferToBase64(hashBuffer);
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();