// Jest module mocks for Firebase and external dependencies
module.exports = {
  // Firebase mocks
  '^firebase/app$': '<rootDir>/src/__tests__/__mocks__/firebase/app.ts',
  '^firebase/auth$': '<rootDir>/src/__tests__/__mocks__/firebase/auth.ts', 
  '^firebase/firestore$': '<rootDir>/src/__tests__/__mocks__/firebase/firestore.ts',
  '^firebase/functions$': '<rootDir>/src/__tests__/__mocks__/firebase/functions.ts',
  '^firebase/storage$': '<rootDir>/src/__tests__/__mocks__/firebase/storage.ts',
  '^firebase-admin$': '<rootDir>/src/__tests__/__mocks__/firebase-admin.ts',
  '^firebase-admin/app$': '<rootDir>/src/__tests__/__mocks__/firebase-admin.ts',
  '^firebase-admin/auth$': '<rootDir>/src/__tests__/__mocks__/firebase-admin.ts',
  '^firebase-admin/firestore$': '<rootDir>/src/__tests__/__mocks__/firebase-admin.ts',
  
  // Next.js mocks
  '^next/server$': '<rootDir>/src/__tests__/__mocks__/next/server.ts',
  '^next/navigation$': '<rootDir>/src/__tests__/__mocks__/next/navigation.ts',
  '^next/headers$': '<rootDir>/src/__tests__/__mocks__/next/headers.ts',
  
  // Crypto mocks (for Node.js compatibility)
  '^crypto$': '<rootDir>/src/__tests__/__mocks__/crypto.ts',
  
  // Stripe mocks
  '^stripe$': '<rootDir>/src/__tests__/__mocks__/stripe.ts'
}