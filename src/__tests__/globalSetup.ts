/**
 * Jest Global Setup - Performance optimized for Firebase App Hosting
 * Initializes testing environment with memory management
 */

export default async function globalSetup(): Promise<void> {
  console.log('🧪 Starting ALCHM test environment setup...')
  
  // Set Node.js memory optimization flags
  if (!process.env.NODE_OPTIONS?.includes('--max-old-space-size')) {
    console.warn('⚠️ Consider setting NODE_OPTIONS="--max-old-space-size=4096" for better test performance')
  }
  
  // Enable garbage collection if available
  if (global.gc) {
    console.log('✅ Garbage collection enabled for tests')
    global.gc()
  } else {
    console.log('ℹ️ Garbage collection not available (run with --expose-gc for better memory management)')
  }
  
  // Set up performance monitoring
  const startTime = Date.now()
  process.env.TEST_START_TIME = startTime.toString()
  
  // Configure test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'alchm-test'
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  
  // Optimize V8 for testing
  if (typeof global.gc === 'undefined') {
    try {
      require('v8').setFlagsFromString('--expose_gc')
      global.gc = require('vm').runInNewContext('gc')
    } catch (e) {
      console.warn('Could not enable garbage collection')
    }
  }
  
  console.log('🚀 ALCHM test environment ready')
}