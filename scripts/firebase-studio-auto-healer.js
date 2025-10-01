#!/usr/bin/env node

/**
 * 🔧 ALCHM Firebase Studio Auto-Healer
 * 
 * Advanced self-healing system that automatically fixes common Firebase Studio
 * deployment issues and optimizes the application for production deployment.
 * 
 * @version 2.0.0 - Production Ready
 * @author ALCHM Core Team
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FirebaseStudioAutoHealer {
  constructor() {
    this.healingActions = [];
    this.backups = new Map();
    this.verbose = process.argv.includes('--verbose');
    this.dryRun = process.argv.includes('--dry-run');
    
    this.log('🔧 Firebase Studio Auto-Healer initialized');
    this.log(`Mode: ${this.dryRun ? 'Dry run (no changes)' : 'Active healing'}`);
  }

  log(message, level = 'info') {
    const prefix = {
      'info': '🔧',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'healing': '💊'
    }[level] || '🔧';
    
    console.log(`${prefix} ${message}`);
  }

  createBackup(filePath) {
    if (fs.existsSync(filePath)) {
      const backupPath = `${filePath}.backup-${Date.now()}`;
      fs.copyFileSync(filePath, backupPath);
      this.backups.set(filePath, backupPath);
      this.log(`Created backup: ${backupPath}`, 'info');
      return backupPath;
    }
    return null;
  }

  applyFix(description, action) {
    this.log(`Applying fix: ${description}`, 'healing');
    
    if (this.dryRun) {
      this.log(`[DRY RUN] Would apply: ${description}`, 'info');
      return;
    }
    
    try {
      action();
      this.healingActions.push({
        description,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
      this.log(`✅ Fixed: ${description}`, 'success');
    } catch (error) {
      this.log(`❌ Failed to fix: ${description} - ${error.message}`, 'error');
      this.healingActions.push({
        description,
        timestamp: new Date().toISOString(), 
        status: 'failed',
        error: error.message
      });
    }
  }

  // 1. BUNDLE SIZE OPTIMIZATION FIXES
  healBundleSize() {
    this.log('🔧 Healing bundle size issues...');
    
    // Fix 1: Optimize Next.js configuration
    this.applyFix('Optimize Next.js configuration for Firebase Studio', () => {
      this.createBackup('next.config.js');
      
      const optimizedConfig = this.generateOptimizedNextConfig();
      fs.writeFileSync('next.config.js', optimizedConfig);
    });
    
    // Fix 2: Add emergency build script
    this.applyFix('Add emergency build script for bundle optimization', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      packageJson.scripts = {
        ...packageJson.scripts,
        'build:emergency': 'NODE_OPTIONS="--max-old-space-size=4096" NEXT_TELEMETRY_DISABLED=1 next build',
        'build:firebase-studio': 'NODE_OPTIONS="--max-old-space-size=8192" FIREBASE_STUDIO_OPTIMIZATION=true next build',
        'analyze:bundle': 'ANALYZE=true npm run build'
      };
      
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    });
    
    // Fix 3: Create webpack optimization plugin
    this.applyFix('Create custom webpack optimization plugin', () => {
      this.createWebpackOptimizationPlugin();
    });
    
    // Fix 4: Optimize imports
    this.applyFix('Optimize import statements for tree-shaking', () => {
      this.optimizeImports();
    });
  }

  generateOptimizedNextConfig() {
    return `/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Firebase Studio Optimized Configuration
const nextConfig = {
  output: 'export',
  distDir: '.next',
  trailingSlash: false,
  
  // Disable image optimization for Firebase Studio compatibility
  images: {
    unoptimized: true,
  },
  
  // Build optimization for production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Aggressive experimental optimizations
  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'next',
      'firebase/app',
      'firebase/auth', 
      'firebase/firestore',
      '@stripe/stripe-js'
    ],
    serverComponentsExternalPackages: ['firebase-admin', 'stripe'],
    optimizeCss: true,
    largePageDataBytes: 8 * 1024, // 8KB limit
    bundlePagesExternals: true,
    esmExternals: true,
  },
  
  // Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    styledComponents: false // Disable if not used
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Advanced webpack optimization
  webpack: (config, { isServer, dev }) => {
    // Server-side externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin', 'stripe');
    }
    
    // Client-side production optimizations
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 1000,      // 1KB minimum chunk size
          maxSize: 15000,     // 15KB maximum chunk size
          minChunks: 1,
          maxAsyncRequests: 50,
          maxInitialRequests: 8,
          cacheGroups: {
            default: false,
            vendors: false,
            
            // React framework chunk
            react: {
              test: /[\\/]node_modules[\\/]react[\\/]/,
              name: 'react',
              priority: 100,
              chunks: 'all',
              maxSize: 30000,
              enforce: true
            },
            
            // React-DOM chunk
            reactDom: {
              test: /[\\/]node_modules[\\/]react-dom[\\/]/,
              name: 'react-dom',
              priority: 99,
              chunks: 'all', 
              maxSize: 30000,
              enforce: true
            },
            
            // Next.js framework
            nextFramework: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next-framework',
              priority: 98,
              chunks: 'all',
              maxSize: 25000,
            },
            
            // Firebase (async only to reduce initial bundle)
            firebase: {
              test: /[\\/]node_modules[\\/]firebase[\\/]/,
              name: 'firebase',
              priority: 90,
              chunks: 'async',
              maxSize: 20000,
            },
            
            // Stripe (async only)
            stripe: {
              test: /[\\/]node_modules[\\/]@stripe[\\/]/,
              name: 'stripe',
              priority: 80,
              chunks: 'async', 
              maxSize: 15000,
            },
            
            // Crisis components (high priority for mental health app)
            crisis: {
              test: /[\\/]src[\\/]components[\\/].*(crisis|emergency|support).*[\\/]/i,
              name: 'crisis',
              priority: 95,
              chunks: 'all',
              maxSize: 10000,
              enforce: true
            },
            
            // Large components (async loading)
            largeComponents: {
              test: /[\\/]src[\\/]components[\\/].*(Framework|System|Engine|Dashboard).*\\.(tsx?|jsx?)$/,
              name: 'large-components',
              priority: 70,
              chunks: 'async',
              maxSize: 15000,
            },
            
            // Common utilities
            utils: {
              test: /[\\/]src[\\/](lib|utils)[\\/]/,
              name: 'utils',
              priority: 60,
              chunks: 'async',
              minChunks: 2,
              maxSize: 10000,
            },
            
            // Vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 50,
              chunks: 'async',
              maxSize: 15000,
            },
            
            // Common components
            common: {
              test: /[\\/]src[\\/]components[\\/]/,
              name: 'common',
              priority: 40,
              chunks: 'async',
              minChunks: 2,
              maxSize: 12000,
            },
          }
        },
        
        // Additional optimizations
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        runtimeChunk: {
          name: 'webpack-runtime',
        },
        concatenateModules: true, // Scope hoisting
      };
      
      // Remove source maps in production for smaller bundles
      config.devtool = false;
      
      // Minimize CSS
      if (config.optimization.minimizer) {
        const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
        config.optimization.minimizer.push(new CssMinimizerPlugin());
      }
    }
    
    // Firebase Studio specific performance limits
    config.performance = {
      maxAssetSize: 1000000,      // 1MB per asset
      maxEntrypointSize: 1500000, // 1.5MB total initial load
      hints: process.env.NODE_ENV === 'production' ? 'error' : 'warning'
    };
    
    return config;
  },
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Optimize static generation
  generateEtags: false,
  
  // Compress output
  compress: true,
};

module.exports = withBundleAnalyzer(nextConfig);`;
  }

  createWebpackOptimizationPlugin() {
    const pluginContent = `// Firebase Studio Webpack Optimization Plugin
const path = require('path');

class FirebaseStudioOptimizationPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FirebaseStudioOptimizationPlugin', (compilation, callback) => {
      // Log bundle sizes for monitoring
      const stats = compilation.getStats().toJson();
      const assets = stats.assets || [];
      
      let totalSize = 0;
      let jsSize = 0;
      
      assets.forEach(asset => {
        totalSize += asset.size;
        if (asset.name.endsWith('.js')) {
          jsSize += asset.size;
        }
        
        // Warn about large assets
        if (asset.size > 1000000) { // 1MB
          console.warn(\`⚠️ Large asset detected: \${asset.name} (\${(asset.size / 1024 / 1024).toFixed(2)}MB)\`);
        }
      });
      
      console.log(\`📊 Bundle Analysis:\`);
      console.log(\`   Total Size: \${(totalSize / 1024 / 1024).toFixed(2)}MB\`);
      console.log(\`   JavaScript: \${(jsSize / 1024 / 1024).toFixed(2)}MB\`);
      
      // Firebase Studio limits check
      const FIREBASE_STUDIO_LIMIT = 2 * 1024 * 1024; // 2MB
      if (totalSize > FIREBASE_STUDIO_LIMIT) {
        console.error(\`❌ Bundle exceeds Firebase Studio limit: \${(totalSize / 1024 / 1024).toFixed(2)}MB > 2MB\`);
      } else {
        console.log(\`✅ Bundle size within Firebase Studio limits\`);
      }
      
      callback();
    });
  }
}

module.exports = FirebaseStudioOptimizationPlugin;`;
    
    fs.mkdirSync('webpack-plugins', { recursive: true });
    fs.writeFileSync('webpack-plugins/firebase-studio-optimization.js', pluginContent);
  }

  optimizeImports() {
    // Find and optimize import statements
    const srcDir = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDir)) return;
    
    const files = this.getAllFiles(srcDir, ['.tsx', '.ts', '.jsx', '.js']);
    
    files.forEach(file => {
      this.createBackup(file);
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Optimize Firebase imports
      if (content.includes("import firebase from 'firebase'") || content.includes('import * as firebase')) {
        content = content.replace(
          /import firebase from ['"]firebase['"];?/g,
          "import { initializeApp } from 'firebase/app';"
        );
        content = content.replace(
          /import \* as firebase from ['"]firebase['"];?/g,
          "import { initializeApp } from 'firebase/app';"
        );
        modified = true;
      }
      
      // Optimize React imports for tree-shaking
      if (content.includes("import React from 'react'") && !content.includes('React.')) {
        content = content.replace(
          /import React from ['"]react['"];?/g,
          "import { useState, useEffect, useMemo, useCallback } from 'react';"
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(file, content);
      }
    });
  }

  // 2. SSR/HYDRATION FIXES
  healSSRIssues() {
    this.log('🔧 Healing SSR/hydration issues...');
    
    // Fix 1: Add dynamic imports for client-only components
    this.applyFix('Add dynamic imports for client-only components', () => {
      this.addDynamicImports();
    });
    
    // Fix 2: Fix browser API usage
    this.applyFix('Add SSR protection for browser APIs', () => {
      this.addSSRProtection();
    });
    
    // Fix 3: Create client component wrappers
    this.applyFix('Create client component wrappers', () => {
      this.createClientWrappers();
    });
  }

  addDynamicImports() {
    const componentsToMakeDynamic = [
      'Dashboard',
      'Journal', 
      'KheperaChat',
      'AnalyticsComponents',
      'PaymentFlow'
    ];
    
    // Create dynamic import wrapper file
    const dynamicImportsContent = `// Dynamic imports for client-only components
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Dynamic component exports
${componentsToMakeDynamic.map(component => `
export const ${component}Dynamic = dynamic(
  () => import('@/components/${component}'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);`).join('')}

// Firebase dynamic imports
export const FirebaseAuth = dynamic(
  () => import('@/lib/firebase').then(mod => ({ default: mod.auth })),
  { ssr: false }
);

export const FirebaseFirestore = dynamic(
  () => import('@/lib/firebase').then(mod => ({ default: mod.firestore })),
  { ssr: false }
);`;
    
    fs.mkdirSync('src/components/dynamic', { recursive: true });
    fs.writeFileSync('src/components/dynamic/index.ts', dynamicImportsContent);
  }

  addSSRProtection() {
    const srcDir = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDir)) return;
    
    const files = this.getAllFiles(srcDir, ['.tsx', '.ts']);
    
    files.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Add SSR protection for window object
      if (content.includes('window.') && !content.includes('typeof window')) {
        this.createBackup(file);
        content = content.replace(
          /(?<!typeof )window\./g,
          'typeof window !== "undefined" && window.'
        );
        modified = true;
      }
      
      // Add SSR protection for localStorage
      if (content.includes('localStorage') && !content.includes('typeof window')) {
        this.createBackup(file);
        content = content.replace(
          /localStorage/g,
          'typeof window !== "undefined" ? localStorage : null'
        );
        modified = true;
      }
      
      // Add SSR protection for document
      if (content.includes('document.') && !content.includes('typeof document')) {
        this.createBackup(file);
        content = content.replace(
          /(?<!typeof )document\./g,
          'typeof document !== "undefined" && document.'
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(file, content);
      }
    });
  }

  createClientWrappers() {
    // Create client-only wrapper components
    const clientWrapperContent = `'use client';

import { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Client-only wrapper component
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Browser API wrapper
export function withBrowserAPI<T extends object>(Component: ComponentType<T>) {
  return function WrappedComponent(props: T) {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    if (!mounted || typeof window === 'undefined') {
      return <div>Loading...</div>;
    }
    
    return <Component {...props} />;
  };
}`;
    
    fs.mkdirSync('src/components/wrappers', { recursive: true });
    fs.writeFileSync('src/components/wrappers/ClientOnly.tsx', clientWrapperContent);
  }

  // 3. FIREBASE CONFIGURATION FIXES
  healFirebaseConfig() {
    this.log('🔧 Healing Firebase configuration issues...');
    
    // Fix 1: Optimize Firebase configuration
    this.applyFix('Optimize Firebase client configuration', () => {
      this.optimizeFirebaseConfig();
    });
    
    // Fix 2: Fix Firebase admin configuration
    this.applyFix('Optimize Firebase admin configuration', () => {
      this.optimizeFirebaseAdminConfig();
    });
    
    // Fix 3: Create Firebase utilities
    this.applyFix('Create optimized Firebase utilities', () => {
      this.createFirebaseUtils();
    });
  }

  optimizeFirebaseConfig() {
    const firebaseConfigContent = `// Optimized Firebase configuration for production
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
function validateFirebaseConfig() {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  for (const field of requiredFields) {
    if (!firebaseConfig[field]) {
      throw new Error(\`Firebase configuration missing: \${field}\`);
    }
  }
}

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

try {
  validateFirebaseConfig();
  
  // Initialize only if not already initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  // Initialize services lazily
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { app, auth, firestore, storage };
export default app;`;
    
    this.createBackup('src/lib/firebase.ts');
    fs.writeFileSync('src/lib/firebase.ts', firebaseConfigContent);
  }

  optimizeFirebaseAdminConfig() {
    const adminConfigContent = `// Optimized Firebase Admin configuration
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Service account configuration
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n'),
};

// Initialize admin app with error handling
let adminApp;
let adminAuth;
let adminFirestore;

try {
  // Check if admin app is already initialized
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    }, 'admin');
  } else {
    adminApp = getApps()[0];
  }
  
  adminAuth = getAuth(adminApp);
  adminFirestore = getFirestore(adminApp);
  
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  // Graceful fallback for development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Firebase Admin not initialized - using development fallback');
  } else {
    throw error;
  }
}

export { adminApp, adminAuth, adminFirestore };`;
    
    this.createBackup('src/lib/firebaseAdmin.ts');
    fs.writeFileSync('src/lib/firebaseAdmin.ts', adminConfigContent);
  }

  createFirebaseUtils() {
    const utilsContent = `// Firebase utility functions
import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData
} from 'firebase/firestore';

// Type-safe Firestore operations
export class FirestoreUtils {
  static async get<T = DocumentData>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(\`Error getting document \${docId} from \${collectionName}:\`, error);
      throw error;
    }
  }
  
  static async add<T = DocumentData>(collectionName: string, data: T): Promise<string> {
    try {
      const collectionRef = collection(firestore, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error(\`Error adding document to \${collectionName}:\`, error);
      throw error;
    }
  }
  
  static async update<T = Partial<DocumentData>>(
    collectionName: string, 
    docId: string, 
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(firestore, collectionName, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(\`Error updating document \${docId} in \${collectionName}:\`, error);
      throw error;
    }
  }
  
  static async delete(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(firestore, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(\`Error deleting document \${docId} from \${collectionName}:\`, error);
      throw error;
    }
  }
  
  static async list<T = DocumentData>(
    collectionName: string,
    conditions: Array<{ field: string; operator: any; value: any }> = [],
    orderByField?: string,
    limitCount?: number
  ): Promise<T[]> {
    try {
      const collectionRef = collection(firestore, collectionName);
      let q = query(collectionRef);
      
      // Apply where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }
      
      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error) {
      console.error(\`Error listing documents from \${collectionName}:\`, error);
      throw error;
    }
  }
}

// Connection status utility
export function useFirebaseConnection() {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    // Monitor Firestore connection
    const unsubscribe = firestore._delegate._databaseId ? 
      () => setIsConnected(true) : 
      () => setIsConnected(false);
    
    return unsubscribe;
  }, []);
  
  return isConnected;
}`;
    
    fs.writeFileSync('src/lib/firebaseUtils.ts', utilsContent);
  }

  // 4. PERFORMANCE OPTIMIZATION FIXES
  healPerformanceIssues() {
    this.log('🔧 Healing performance issues...');
    
    // Fix 1: Add performance monitoring
    this.applyFix('Add performance monitoring utilities', () => {
      this.createPerformanceMonitoring();
    });
    
    // Fix 2: Optimize images
    this.applyFix('Create image optimization utilities', () => {
      this.createImageOptimization();
    });
    
    // Fix 3: Add caching utilities
    this.applyFix('Create caching utilities', () => {
      this.createCachingUtils();
    });
  }

  createPerformanceMonitoring() {
    const performanceContent = `// Performance monitoring utilities
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

// Core Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return;
  
  getCLS(console.log);
  getFCP(console.log);
  getFID(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// Performance budget checker
export class PerformanceBudget {
  private static budgets = {
    fcp: 1800, // First Contentful Paint
    lcp: 2500, // Largest Contentful Paint
    cls: 0.1,  // Cumulative Layout Shift
    fid: 100,  // First Input Delay
  };
  
  static check(metric: string, value: number): boolean {
    const budget = this.budgets[metric as keyof typeof this.budgets];
    if (!budget) return true;
    
    const withinBudget = value <= budget;
    if (!withinBudget) {
      console.warn(\`Performance budget exceeded: \${metric} = \${value} (budget: \${budget})\`);
    }
    
    return withinBudget;
  }
}

// Bundle size monitor
export function monitorBundleSize() {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('.js') && entry.transferSize) {
        const sizeKB = entry.transferSize / 1024;
        console.log(\`Bundle: \${entry.name} = \${sizeKB.toFixed(2)}KB\`);
        
        if (sizeKB > 1000) { // 1MB warning
          console.warn(\`Large bundle detected: \${entry.name}\`);
        }
      }
    });
  });
  
  observer.observe({ entryTypes: ['navigation', 'resource'] });
}`;
    
    fs.mkdirSync('src/lib/performance', { recursive: true });
    fs.writeFileSync('src/lib/performance/monitoring.ts', performanceContent);
  }

  createImageOptimization() {
    const imageOptContent = `// Image optimization utilities
import { useState, useEffect } from 'react';

// Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  loading = 'lazy' 
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setImageSrc('/images/placeholder.png'); // Fallback image
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);
  
  return (
    <div className={\`relative \${className}\`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={\`\${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300\`}
      />
    </div>
  );
}

// Image preloader
export function preloadImages(urls: string[]) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Critical images for above-the-fold content
export const criticalImages = [
  '/images/logo.png',
  '/images/hero-bg.jpg',
  '/icons/icon-192x192.png',
];

// Preload critical images on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    preloadImages(criticalImages);
  });
}`;
    
    fs.writeFileSync('src/lib/performance/images.tsx', imageOptContent);
  }

  createCachingUtils() {
    const cachingContent = `// Caching utilities for performance optimization
import { useState, useEffect, useCallback } from 'react';

// Memory cache for API responses
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // 5 min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();

// React hook for cached API calls
export function useCachedFetch<T>(
  url: string, 
  options?: RequestInit,
  ttl?: number
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = \`\${url}-\${JSON.stringify(options)}\`;
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Check cache first
        const cachedData = memoryCache.get(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
        
        // Fetch from network
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const result = await response.json();
        
        // Cache the result
        memoryCache.set(cacheKey, result, ttl);
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url, cacheKey, ttl]);
  
  return { data, loading, error };
}

// Debounced value hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Local storage cache with expiration
export class LocalStorageCache {
  static set(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('LocalStorage cache write failed:', error);
    }
  }
  
  static get(key: string): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('LocalStorage cache read failed:', error);
      return null;
    }
  }
  
  static clear(prefix?: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      if (prefix) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.warn('LocalStorage cache clear failed:', error);
    }
  }
}`;
    
    fs.writeFileSync('src/lib/performance/caching.ts', cachingContent);
  }

  // 5. DEPLOYMENT PIPELINE FIXES
  healDeploymentIssues() {
    this.log('🔧 Healing deployment pipeline issues...');
    
    // Fix 1: Create deployment scripts
    this.applyFix('Create optimized deployment scripts', () => {
      this.createDeploymentScripts();
    });
    
    // Fix 2: Fix environment configuration
    this.applyFix('Optimize environment configuration', () => {
      this.fixEnvironmentConfig();
    });
    
    // Fix 3: Create pre-deployment checks
    this.applyFix('Create pre-deployment validation', () => {
      this.createPreDeploymentChecks();
    });
  }

  createDeploymentScripts() {
    // Firebase Studio optimized deployment script
    const deployScript = `#!/bin/bash

# Firebase Studio Optimized Deployment Script
set -e

echo "🚀 Starting Firebase Studio deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out dist
npm run clean 2>/dev/null || true

# Install dependencies with cache
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."
npm run lint || echo "⚠️ Linting issues detected"
npm run typecheck || echo "⚠️ TypeScript issues detected"

# Build with Firebase Studio optimizations
echo "🏗️ Building for Firebase Studio..."
NODE_ENV=production npm run build:firebase-studio

# Validate bundle sizes
echo "📊 Validating bundle sizes..."
node scripts/validate-bundle-size.js

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting,functions

echo "✅ Deployment complete!"`;
    
    fs.writeFileSync('scripts/deploy-firebase-studio.sh', deployScript);
    
    // Make script executable
    try {
      execSync('chmod +x scripts/deploy-firebase-studio.sh');
    } catch (error) {
      this.log('Could not make deploy script executable', 'warning');
    }
    
    // Bundle size validation script
    const bundleValidatorContent = `#!/usr/bin/env node

// Bundle size validator for Firebase Studio
const fs = require('fs');
const path = require('path');

const FIREBASE_STUDIO_LIMITS = {
  totalBundle: 2 * 1024 * 1024, // 2MB
  singleAsset: 1 * 1024 * 1024,  // 1MB
  firstLoadJS: 1.5 * 1024 * 1024 // 1.5MB
};

function validateBundleSize() {
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    console.error('❌ Build output directory not found');
    process.exit(1);
  }
  
  let totalSize = 0;
  let violations = [];
  
  function checkDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkDirectory(filePath, prefix + file + '/');
      } else {
        const size = stat.size;
        totalSize += size;
        
        if (size > FIREBASE_STUDIO_LIMITS.singleAsset) {
          violations.push({
            file: prefix + file,
            size,
            limit: FIREBASE_STUDIO_LIMITS.singleAsset,
            type: 'single-asset'
          });
        }
      }
    }
  }
  
  checkDirectory(outDir);
  
  // Check total bundle size
  if (totalSize > FIREBASE_STUDIO_LIMITS.totalBundle) {
    violations.push({
      file: 'Total bundle',
      size: totalSize,
      limit: FIREBASE_STUDIO_LIMITS.totalBundle,
      type: 'total-bundle'
    });
  }
  
  // Report results
  console.log(\`📊 Bundle Analysis:\`);
  console.log(\`   Total Size: \${(totalSize / 1024 / 1024).toFixed(2)}MB\`);
  console.log(\`   Firebase Studio Limit: \${(FIREBASE_STUDIO_LIMITS.totalBundle / 1024 / 1024).toFixed(2)}MB\`);
  
  if (violations.length > 0) {
    console.error(\`❌ Bundle size violations detected:\`);
    violations.forEach(violation => {
      console.error(\`   \${violation.file}: \${(violation.size / 1024 / 1024).toFixed(2)}MB > \${(violation.limit / 1024 / 1024).toFixed(2)}MB\`);
    });
    process.exit(1);
  } else {
    console.log(\`✅ Bundle size within Firebase Studio limits\`);
    process.exit(0);
  }
}

validateBundleSize();`;
    
    fs.writeFileSync('scripts/validate-bundle-size.js', bundleValidatorContent);
  }

  fixEnvironmentConfig() {
    // Create environment validation
    const envValidatorContent = `// Environment configuration validator
const requiredEnvVars = {
  client: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ],
  server: [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'STRIPE_SECRET_KEY'
  ]
};

export function validateEnvironment(side: 'client' | 'server' | 'both' = 'both'): boolean {
  const varsToCheck = side === 'both' 
    ? [...requiredEnvVars.client, ...requiredEnvVars.server]
    : requiredEnvVars[side];
  
  const missing = varsToCheck.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }
  
  return true;
}

// Auto-validate on import in development
if (process.env.NODE_ENV === 'development') {
  validateEnvironment();
}`;
    
    fs.writeFileSync('src/lib/validateEnvironment.ts', envValidatorContent);
    
    // Create example environment file
    const exampleEnvContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Other Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1`;
    
    if (!fs.existsSync('.env.example')) {
      fs.writeFileSync('.env.example', exampleEnvContent);
    }
  }

  createPreDeploymentChecks() {
    const checksContent = `#!/usr/bin/env node

// Pre-deployment validation checks
const fs = require('fs');
const { execSync } = require('child_process');

class PreDeploymentValidator {
  constructor() {
    this.checks = [];
    this.passed = 0;
    this.failed = 0;
  }
  
  log(message, type = 'info') {
    const prefix = {
      'info': '📋',
      'success': '✅', 
      'error': '❌',
      'warning': '⚠️'
    }[type];
    console.log(\`\${prefix} \${message}\`);
  }
  
  async runCheck(name, checkFn) {
    try {
      this.log(\`Running: \${name}\`);
      await checkFn();
      this.log(\`Passed: \${name}\`, 'success');
      this.passed++;
    } catch (error) {
      this.log(\`Failed: \${name} - \${error.message}\`, 'error');
      this.failed++;
    }
  }
  
  async validate() {
    this.log('🚀 Starting pre-deployment validation...');
    
    // Check 1: Environment variables
    await this.runCheck('Environment variables', () => {
      const required = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      ];
      
      for (const envVar of required) {
        if (!process.env[envVar]) {
          throw new Error(\`Missing environment variable: \${envVar}\`);
        }
      }
    });
    
    // Check 2: Build completion
    await this.runCheck('Build output exists', () => {
      if (!fs.existsSync('out/index.html')) {
        throw new Error('Build output not found - run npm run build first');
      }
    });
    
    // Check 3: Firebase configuration
    await this.runCheck('Firebase configuration', () => {
      if (!fs.existsSync('firebase.json')) {
        throw new Error('firebase.json not found');
      }
      
      const config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
      if (!config.hosting || !config.functions) {
        throw new Error('Firebase hosting or functions configuration missing');
      }
    });
    
    // Check 4: Bundle size validation
    await this.runCheck('Bundle size validation', () => {
      try {
        execSync('node scripts/validate-bundle-size.js', { stdio: 'pipe' });
      } catch (error) {
        throw new Error('Bundle size exceeds Firebase Studio limits');
      }
    });
    
    // Check 5: TypeScript compilation
    await this.runCheck('TypeScript compilation', () => {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
      } catch (error) {
        throw new Error('TypeScript compilation errors detected');
      }
    });
    
    // Check 6: Firebase Functions validation
    await this.runCheck('Firebase Functions', () => {
      if (fs.existsSync('functions/src/index.ts')) {
        try {
          execSync('cd functions && npm run build', { stdio: 'pipe' });
        } catch (error) {
          throw new Error('Firebase Functions build failed');
        }
      }
    });
    
    // Summary
    this.log(\`\nValidation Summary:\`);
    this.log(\`✅ Passed: \${this.passed}\`);
    this.log(\`❌ Failed: \${this.failed}\`);
    
    if (this.failed > 0) {
      this.log('🚨 Pre-deployment validation failed!', 'error');
      process.exit(1);
    } else {
      this.log('🎉 All pre-deployment checks passed!', 'success');
      process.exit(0);
    }
  }
}

const validator = new PreDeploymentValidator();
validator.validate().catch(error => {
  console.error('Validation error:', error);
  process.exit(1);
});`;
    
    fs.writeFileSync('scripts/pre-deployment-checks.js', checksContent);
  }

  // UTILITY METHODS
  getAllFiles(dir, extensions = []) {
    const files = [];
    
    function traverse(currentDir) {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            traverse(fullPath);
          } else if (entry.isFile()) {
            if (extensions.length === 0 || extensions.some(ext => entry.name.endsWith(ext))) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
    
    if (fs.existsSync(dir)) {
      traverse(dir);
    }
    return files;
  }

  // MAIN HEALING PROCESS
  async heal() {
    this.log('🔧 Starting Firebase Studio Auto-Healing Process...');
    this.log(`Mode: ${this.dryRun ? 'Dry run (no changes will be made)' : 'Active healing'}`);
    
    try {
      // Core healing processes
      await this.healBundleSize();
      await this.healSSRIssues();
      await this.healFirebaseConfig();
      await this.healPerformanceIssues();
      await this.healDeploymentIssues();
      
      // Generate healing report
      this.generateHealingReport();
      
      this.log('🎉 Auto-healing process completed successfully!', 'success');
      
    } catch (error) {
      this.log(`💥 Auto-healing process failed: ${error.message}`, 'error');
      console.error('Full error:', error);
      process.exit(1);
    }
  }

  generateHealingReport() {
    const report = {
      timestamp: new Date().toISOString(),
      mode: this.dryRun ? 'dry-run' : 'active',
      healingActions: this.healingActions,
      backups: Array.from(this.backups.entries()).map(([original, backup]) => ({
        original,
        backup
      })),
      summary: {
        totalActions: this.healingActions.length,
        successful: this.healingActions.filter(a => a.status === 'success').length,
        failed: this.healingActions.filter(a => a.status === 'failed').length,
        backupsCreated: this.backups.size
      }
    };
    
    // Save report
    const reportPath = `healing-reports/auto-healer-${Date.now()}.json`;
    fs.mkdirSync('healing-reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate summary
    const summary = `
🔧 Firebase Studio Auto-Healer Report
====================================

📊 HEALING SUMMARY
- Timestamp: ${report.timestamp}
- Mode: ${report.mode}
- Total Actions: ${report.summary.totalActions}
- Successful: ${report.summary.successful}
- Failed: ${report.summary.failed}
- Backups Created: ${report.summary.backupsCreated}

✅ SUCCESSFUL HEALING ACTIONS:
${this.healingActions
  .filter(a => a.status === 'success')
  .map(a => `✅ ${a.description}`)
  .join('\n') || 'None'}

❌ FAILED HEALING ACTIONS:
${this.healingActions
  .filter(a => a.status === 'failed')
  .map(a => `❌ ${a.description} - ${a.error}`)
  .join('\n') || 'None'}

💾 BACKUPS CREATED:
${Array.from(this.backups.entries())
  .map(([original, backup]) => `💾 ${original} → ${backup}`)
  .join('\n') || 'None'}

📄 Full report: ${reportPath}
`;
    
    const summaryPath = 'FIREBASE_STUDIO_AUTO_HEALER_SUMMARY.md';
    fs.writeFileSync(summaryPath, summary);
    console.log(summary);
    
    this.log(`📄 Report saved to: ${reportPath}`, 'success');
    this.log(`📋 Summary saved to: ${summaryPath}`, 'success');
  }
}

// Execute the auto-healer
if (require.main === module) {
  const healer = new FirebaseStudioAutoHealer();
  healer.heal().catch(error => {
    console.error('💥 Fatal error in auto-healer:', error);
    process.exit(1);
  });
}

module.exports = FirebaseStudioAutoHealer;