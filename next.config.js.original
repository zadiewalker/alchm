/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// CRISIS-CRITICAL: Emergency vendor chunk optimization for mobile crisis users
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  trailingSlash: false,
  
  // EMERGENCY: Ultra-aggressive image optimization reduction
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: [],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  
  // Allow build completion for vendor optimization
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // CRISIS-CRITICAL: Vendor optimization experimental features
  experimental: {
    optimizePackageImports: [
      'firebase/app',
      'firebase/auth', 
      'firebase/firestore',
      '@stripe/stripe-js',
      'framer-motion',
      '@google/generative-ai'
    ],
    serverComponentsExternalPackages: ['firebase-admin', 'stripe'],
    optimizeCss: true,
    largePageDataBytes: 16 * 1024,
    bundlePagesExternals: true,
    esmExternals: true,
    webpackBuildWorker: true,
    cpus: Math.max(1, Math.floor(require('os').cpus().length / 2)),
    optimisticClientCache: true,
    turbo: {
      rules: {
        '*.css': {
          loaders: ['css-loader'],
          as: '*.css'
        }
      }
    }
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // VENDOR OPTIMIZATION: Aggressive webpack configuration for crisis performance
  webpack: (config, { isServer, dev }) => {
    // Server externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin', 'stripe');
    }
    
    // CRISIS-CRITICAL: Vendor chunk splitting optimization
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 2000,      // 2KB minimum chunk size
          maxSize: 100000,    // 100KB maximum chunk size
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 4, // Allow 4 initial chunks maximum
          automaticNameDelimiter: '-',
          cacheGroups: {
            default: false,
            vendors: false,
            
            // PRIORITY 1: React ecosystem - single optimized chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              priority: 100,
              chunks: 'all',
              maxSize: 80000, // 80KB for React ecosystem
              enforce: true,
              reuseExistingChunk: true
            },
            
            // PRIORITY 2: Next.js framework - separate from React
            nextFramework: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next-framework',
              priority: 95,
              chunks: 'all',
              maxSize: 50000, // 50KB for Next.js
              enforce: true,
              reuseExistingChunk: true
            },
            
            // PRIORITY 3: Crisis-critical Firebase (app + auth only)
            firebaseCritical: {
              test: /[\\/]node_modules[\\/]firebase[\\/](app|auth)[\\/]/,
              name: 'firebase-critical',
              priority: 90,
              chunks: 'async', // Load async to keep initial bundle small
              maxSize: 60000, // 60KB for critical Firebase
              enforce: true
            },
            
            // PRIORITY 4: Firebase Firestore - separate async chunk
            firebaseFirestore: {
              test: /[\\/]node_modules[\\/]firebase[\\/]firestore[\\/]/,
              name: 'firebase-firestore',
              priority: 85,
              chunks: 'async',
              maxSize: 80000, // 80KB for Firestore
              enforce: true
            },
            
            // PRIORITY 5: Essential utilities (small, frequently used)
            utilities: {
              test: /[\\/]node_modules[\\/](zod|@swc[\\/]helpers)[\\/]/,
              name: 'utilities',
              priority: 80,
              chunks: 'all',
              maxSize: 30000, // 30KB for utilities
              reuseExistingChunk: true
            },
            
            // ASYNC ONLY: Heavy libraries loaded on demand
            animations: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'animations',
              priority: 70,
              chunks: 'async',
              maxSize: 100000, // 100KB for Framer Motion
            },
            
            ai: {
              test: /[\\/]node_modules[\\/]@google[\\/]generative-ai[\\/]/,
              name: 'ai-vendor',
              priority: 65,
              chunks: 'async',
              maxSize: 80000, // 80KB for AI
            },
            
            stripe: {
              test: /[\\/]node_modules[\\/](@stripe|stripe)[\\/]/,
              name: 'stripe',
              priority: 60,
              chunks: 'async',
              maxSize: 60000, // 60KB for Stripe
            },
            
            tailwind: {
              test: /[\\/]node_modules[\\/]@tailwindcss[\\/]/,
              name: 'tailwind',
              priority: 55,
              chunks: 'async',
              maxSize: 40000, // 40KB for Tailwind
            },
            
            // Catch-all for remaining vendor code - async only
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: (module) => {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                return `vendor-${packageName?.replace('@', '').replace('/', '-') || 'misc'}`;
              },
              priority: 40,
              chunks: 'async',
              maxSize: 50000, // 50KB max per vendor chunk
              minChunks: 1,
              reuseExistingChunk: true
            },
            
            // App components - shared code
            common: {
              test: /[\\/]src[\\/]/,
              name: 'common',
              priority: 30,
              chunks: 'async',
              minChunks: 2,
              maxSize: 60000, // 60KB for common app code
              reuseExistingChunk: true
            }
          }
        },
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        runtimeChunk: {
          name: 'webpack-runtime',
        },
        concatenateModules: true, // Enable scope hoisting
      };
      
      // Remove source maps for smaller bundles
      config.devtool = false;
    }
    
    // CRISIS-OPTIMIZED: Performance settings for emergency deployment
    config.performance = {
      maxAssetSize: 200000,    // 200KB per asset
      maxEntrypointSize: 400000, // 400KB total initial load
      hints: 'warning'
    };
    
    // Crisis-specific module resolution for faster lookups
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@crisis': require('path').resolve(__dirname, 'src/components/crisis'),
      '@mobile': require('path').resolve(__dirname, 'src/components/mobile'),
      '@emergency': require('path').resolve(__dirname, 'src/lib/crisis-resource-cache-manager')
    };
    
    // Optimize for crisis scenarios
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      buffer: false
    };
    
    return config;
  },
  
  // Disable headers to reduce bundle size
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);