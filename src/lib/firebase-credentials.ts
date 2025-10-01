/**
 * Firebase Admin SDK Credentials Management
 * Secure handling of service account keys with fallbacks for different environments
 */

export interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export interface CredentialValidationResult {
  valid: boolean;
  source: 'service_account' | 'application_default' | 'emulator';
  error?: string;
  projectId?: string;
  clientEmail?: string;
}

/**
 * Validates and parses Firebase service account key from environment
 */
export function parseServiceAccountKey(keyString?: string): ServiceAccountKey | null {
  if (!keyString) {
    return null;
  }

  try {
    const parsed = JSON.parse(keyString);
    
    // Validate required fields
    const requiredFields = [
      'type', 'project_id', 'private_key_id', 'private_key',
      'client_email', 'client_id', 'auth_uri', 'token_uri'
    ];

    for (const field of requiredFields) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate service account type
    if (parsed.type !== 'service_account') {
      throw new Error(`Invalid credential type: ${parsed.type}. Expected: service_account`);
    }

    // Validate private key format
    if (!parsed.private_key.includes('BEGIN PRIVATE KEY') || 
        !parsed.private_key.includes('END PRIVATE KEY')) {
      throw new Error('Invalid private key format');
    }

    // Validate email format
    if (!parsed.client_email.includes('@') || 
        !parsed.client_email.includes('.iam.gserviceaccount.com')) {
      throw new Error('Invalid service account email format');
    }

    return parsed as ServiceAccountKey;
  } catch (error) {
    console.error('[Firebase Credentials] Failed to parse service account key:', error);
    return null;
  }
}

/**
 * Validates Firebase credentials and returns validation result
 */
export function validateFirebaseCredentials(
  projectId: string, 
  serviceAccountKey?: string
): CredentialValidationResult {
  const isDev = process.env.NODE_ENV === 'development';
  const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || 
                    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
                    process.env.FUNCTIONS_EMULATOR;

  // Emulator environment
  if (isEmulator) {
    return {
      valid: true,
      source: 'emulator',
      projectId
    };
  }

  // Try service account key first
  if (serviceAccountKey) {
    const parsedKey = parseServiceAccountKey(serviceAccountKey);
    if (parsedKey) {
      // Validate project ID matches
      if (parsedKey.project_id !== projectId) {
        return {
          valid: false,
          source: 'service_account',
          error: `Project ID mismatch: key=${parsedKey.project_id}, expected=${projectId}`
        };
      }

      return {
        valid: true,
        source: 'service_account',
        projectId: parsedKey.project_id,
        clientEmail: parsedKey.client_email
      };
    } else {
      return {
        valid: false,
        source: 'service_account',
        error: 'Failed to parse service account key'
      };
    }
  }

  // Development fallback to Application Default Credentials
  if (isDev) {
    // Check for gcloud CLI authentication
    try {
      const gcloudConfig = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (gcloudConfig) {
        return {
          valid: true,
          source: 'application_default',
          projectId
        };
      }
    } catch (error) {
      // Silently continue to check for other methods
    }

    return {
      valid: true,
      source: 'application_default',
      projectId,
      error: 'Using application default credentials (development only)'
    };
  }

  // Production requires service account key
  return {
    valid: false,
    source: 'service_account',
    error: 'Service account key is required for production environment'
  };
}

/**
 * Creates a masked version of service account email for logging
 */
export function maskServiceAccountEmail(email?: string): string {
  if (!email) return 'unknown';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return 'invalid-format';
  
  const maskedUsername = username.slice(0, 3) + '***' + username.slice(-3);
  return `${maskedUsername}@${domain}`;
}

/**
 * Generates service account key setup instructions
 */
export function getServiceAccountSetupInstructions(projectId: string): string {
  return `
🔐 Firebase Service Account Setup Required

For production deployment, you need to set up a Firebase service account key:

1. Go to Firebase Console: https://console.firebase.google.com/project/${projectId}/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Download the JSON file
4. Set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable with the JSON content:

   # Option 1: Environment variable (recommended for production)
   export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"${projectId}",...}'

   # Option 2: For local development, you can also use:
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

5. Ensure the service account has the following roles:
   - Firebase Admin SDK Administrator Service Agent
   - Cloud Firestore Service Agent
   - Firebase Authentication Admin

Security Notes:
- Never commit the service account key to version control
- Use secure environment variable management in production
- Rotate keys regularly for enhanced security
- Monitor service account usage in Cloud Console

For development, you can use Firebase Emulators or gcloud authentication:
- npm run firebase:emulators (recommended for development)
- gcloud auth application-default login
  `;
}

/**
 * Validates that the service account has required permissions
 */
export async function validateServiceAccountPermissions(
  serviceAccount: ServiceAccountKey
): Promise<{ valid: boolean; permissions: string[]; missing: string[] }> {
  // This is a client-side validation - full permission validation would require Cloud IAM API calls
  const requiredRoles = [
    'roles/firebase.admin',
    'roles/datastore.user',
    'roles/firebaseauth.admin'
  ];

  // Basic validation based on service account structure
  const hasValidStructure = serviceAccount.client_email.includes('firebase-adminsdk') ||
                           serviceAccount.client_email.includes('iam.gserviceaccount.com');

  return {
    valid: hasValidStructure,
    permissions: hasValidStructure ? requiredRoles : [],
    missing: hasValidStructure ? [] : requiredRoles
  };
}

/**
 * Environment-specific credential configuration
 */
export const getCredentialConfig = (environment: string) => {
  switch (environment) {
    case 'production':
      return {
        requiresServiceAccount: true,
        allowApplicationDefault: false,
        allowEmulator: false,
        strictValidation: true
      };
    case 'staging':
      return {
        requiresServiceAccount: true,
        allowApplicationDefault: true,
        allowEmulator: false,
        strictValidation: true
      };
    case 'development':
      return {
        requiresServiceAccount: false,
        allowApplicationDefault: true,
        allowEmulator: true,
        strictValidation: false
      };
    default:
      return {
        requiresServiceAccount: true,
        allowApplicationDefault: false,
        allowEmulator: false,
        strictValidation: true
      };
  }
};