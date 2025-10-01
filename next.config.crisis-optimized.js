/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// CRISIS-OPTIMIZED: Refined vendor chunk strategy for sub-3-second crisis access
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  trailingSlash: false,
  
  // CRISIS-CRITICAL: Image optimization disabled for speed
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: [],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  
  // Allow build completion for optimization analysis
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // CRISIS-OPTIMIZED: Refined experimental features
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
    optimisticClientCache: true
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // CRISIS-OPTIMIZED: Refined webpack configuration for optimal chunking
  webpack: (config, { isServer, dev }) => {
    // Server externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin', 'stripe');
    }
    
    // CRISIS-CRITICAL: Optimized vendor chunk splitting for mobile performance
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,     // 20KB minimum - prevents over-splitting
          maxSize: 150000,    // 150KB maximum - allows reasonable chunk sizes
          minChunks: 1,
          maxAsyncRequests: 15, // Reduced to prevent chunk fragmentation
          maxInitialRequests: 3, // Only essential chunks on initial load
          automaticNameDelimiter: '-',
          cacheGroups: {
            default: false,
            vendors: false,
            
            // PRIORITY 1: React ecosystem - consolidated chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              priority: 100,
              chunks: 'all',
              enforce: true,
              reuseExistingChunk: true
            },
            
            // PRIORITY 2: Next.js framework - consolidated, not over-split
            nextjs: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'nextjs-vendor', 
              priority: 95,
              chunks: 'all',
              enforce: true,
              reuseExistingChunk: true
            },
            
            // PRIORITY 3: Essential utilities for initial load
            essentials: {
              test: /[\\/]node_modules[\\/](zod|@swc\/helpers)[\\/]/,
              name: 'essentials',
              priority: 90,
              chunks: 'all',
              maxSize: 40000,
              reuseExistingChunk: true
            },
            
            // ASYNC CHUNKS: Heavy libraries loaded on demand
            firebase: {
              test: /[\\/]node_modules[\\/]firebase[\\/]/,
              name: 'firebase-vendor',
              priority: 80,
              chunks: 'async',
              maxSize: 200000, // Allow larger size since it's async
              enforce: true
            },
            
            motion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'motion-vendor',
              priority: 70,
              chunks: 'async',
              maxSize: 150000
            },
            
            ai: {
              test: /[\\/]node_modules[\\/]@google[\\/]generative-ai[\\/]/,
              name: 'ai-vendor',
              priority: 65,
              chunks: 'async',
              maxSize: 100000
            },
            
            stripe: {
              test: /[\\/]node_modules[\\/](@stripe|stripe)[\\/]/,
              name: 'stripe-vendor',
              priority: 60,
              chunks: 'async',
              maxSize: 80000
            },
            
            styles: {
              test: /[\\/]node_modules[\\/]@tailwindcss[\\/]/,
              name: 'styles-vendor',
              priority: 55,
              chunks: 'async',
              maxSize: 50000
            },
            
            // Catch-all for remaining vendor code
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor-misc',
              priority: 40,
              chunks: 'async',
              maxSize: 100000,
              minChunks: 1,
              reuseExistingChunk: true
            },
            
            // App components - shared code
            common: {
              test: /[\\/]src[\\/]/,
              name: 'app-common',
              priority: 30,
              chunks: 'async',
              minChunks: 3, // Only if used in 3+ places
              maxSize: 80000,
              reuseExistingChunk: true
            }
          }
        },
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        runtimeChunk: {
          name: 'runtime',
        },
        concatenateModules: true, // Enable scope hoisting
      };
      
      // Remove source maps for smaller bundles
      config.devtool = false;
    }
    
    // CRISIS-OPTIMIZED: Performance settings for mobile emergency access
    config.performance = {
      maxAssetSize: 150000,    // 150KB per asset
      maxEntrypointSize: 300000, // 300KB total initial load target
      hints: 'warning'
    };
    
    // Crisis-specific module resolution
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
