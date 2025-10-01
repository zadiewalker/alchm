// Firebase Configuration Validator
// This utility helps diagnose common Firebase setup issues

export interface FirebaseConfigValidation {
  isValid: boolean;
  missingVariables: string[];
  warnings: string[];
  config: Record<string, string>;
}

export function validateFirebaseConfig(): FirebaseConfigValidation {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  const optionalVars = [
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
  ];

  const missingVariables: string[] = [];
  const warnings: string[] = [];
  const config: Record<string, string> = {};

  // Check required variables
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVariables.push(varName);
    } else {
      config[varName] = value;
    }
  });

  // Check optional variables and warn if missing
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      warnings.push(`Optional variable ${varName} is not set`);
    } else {
      config[varName] = value;
    }
  });

  // Validate format of key variables
  if (config.NEXT_PUBLIC_FIREBASE_API_KEY && !config.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIza')) {
    warnings.push('NEXT_PUBLIC_FIREBASE_API_KEY should start with "AIza"');
  }

  if (config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && !config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes('.firebaseapp.com')) {
    warnings.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN should end with ".firebaseapp.com"');
  }

  if (config.NEXT_PUBLIC_FIREBASE_PROJECT_ID && config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    const projectIdFromDomain = config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.split('.')[0];
    if (projectIdFromDomain !== config.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      warnings.push('Project ID and Auth Domain appear to be mismatched');
    }
  }

  const isValid = missingVariables.length === 0;

  return {
    isValid,
    missingVariables,
    warnings,
    config
  };
}

// Console logging version for debugging
export function logFirebaseConfigValidation(): void {
  const validation = validateFirebaseConfig();
  
  console.log('🔥 Firebase Configuration Validation');
  console.log('====================================');
  
  if (validation.isValid) {
    console.log('✅ Configuration is valid');
    console.log('📊 Loaded variables:', Object.keys(validation.config).length);
  } else {
    console.error('❌ Configuration is invalid');
    console.error('Missing required variables:', validation.missingVariables);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️  Warnings:');
    validation.warnings.forEach(warning => console.warn(`   ${warning}`));
  }
  
  // Log masked config for debugging (don't expose sensitive data)
  const maskedConfig = Object.entries(validation.config).reduce((acc, [key, value]) => {
    acc[key] = key.includes('API_KEY') ? value.substring(0, 10) + '...' : value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('🔧 Configuration (masked):');
  console.table(maskedConfig);
}

// React hook for use in components
export function useFirebaseConfigValidation() {
  const validation = validateFirebaseConfig();
  
  if (!validation.isValid) {
    console.error('Firebase configuration invalid:', validation.missingVariables);
  }
  
  return validation;
}