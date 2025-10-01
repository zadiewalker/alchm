// Client-side encryption for journal entries
// Uses Web Crypto API for secure encryption

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

// Derive a key from user's password/passphrase
export async function deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    false,
    ['encrypt', 'decrypt']
  );
}

// Get or create encryption key for user
export async function getUserKey(): Promise<CryptoKey> {
  // Check if key exists in IndexedDB
  const storedKey = await getStoredKey();
  if (storedKey) {
    return storedKey;
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt']
  );

  // Store key securely
  await storeKey(key);
  return key;
}

// Encrypt text
export async function encrypt(text: string): Promise<{ content: string; iv: string }> {
  try {
    const key = await getUserKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      data
    );

    // Convert to base64 for storage
    const content = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const ivStr = btoa(String.fromCharCode(...iv));

    return { content, iv: ivStr };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt content');
  }
}

// Decrypt text
export async function decrypt(encryptedContent: string, ivStr: string): Promise<string> {
  try {
    const key = await getUserKey();
    
    // Convert from base64
    const encrypted = Uint8Array.from(atob(encryptedContent), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encrypted
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt content');
  }
}

// IndexedDB operations for key storage
const DB_NAME = 'alchm_crypto';
const DB_VERSION = 1;
const STORE_NAME = 'keys';

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function storeKey(key: CryptoKey): Promise<void> {
  const db = await openDB();
  const exported = await crypto.subtle.exportKey('jwk', key);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(exported, 'user_key');

    request.onsuccess = () => {
      db.close();
      resolve();
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function getStoredKey(): Promise<CryptoKey | null> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('user_key');

      request.onsuccess = async () => {
        db.close();
        if (request.result) {
          const key = await crypto.subtle.importKey(
            'jwk',
            request.result,
            {
              name: ALGORITHM,
              length: KEY_LENGTH
            },
            true,
            ['encrypt', 'decrypt']
          );
          resolve(key);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error retrieving stored key:', error);
    return null;
  }
}

// Clear user's encryption key (for logout/data deletion)
export async function clearUserKey(): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete('user_key');

    request.onsuccess = () => {
      db.close();
      resolve();
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// Export key for backup
export async function exportKey(): Promise<string> {
  const key = await getUserKey();
  const exported = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exported);
}

// Import key from backup
export async function importKey(keyString: string): Promise<void> {
  const jwk = JSON.parse(keyString);
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt']
  );
  await storeKey(key);
}

// Generate secure one-way hash for privacy-preserving analytics
export async function generateSecureHash(input: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // Use SHA-256 for one-way hashing
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Failed to generate secure hash');
  }
}