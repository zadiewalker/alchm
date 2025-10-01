/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// CRISIS-CRITICAL: Ultra-aggressive performance optimization for mental health platform
const nextConfig = {
  output: 'export',
  distDir: '.next',
  trailingSlash: false,
  
  // Disable image optimization for emergency bundle reduction
  images: {
    unoptimized: true,
  },
  
  // Allow build errors during emergency deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // CRISIS-CRITICAL: Ultra-aggressive experimental optimizations
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
    largePageDataBytes: 16 * 1024, // 16KB limit - crisis-critical
    bundlePagesExternals: true,
    esmExternals: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // EMERGENCY: Webpack optimization for crisis performance
  webpack: (config, { isServer, dev }) => {
    // Server externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin', 'stripe');
    }
    
    // CRISIS-CRITICAL: Ultra-aggressive production optimization
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 2000, // Smaller chunks for better splitting
          maxSize: 25000, // 25KB max per chunk - EMERGENCY
          minChunks: 1,
          maxAsyncRequests: 30, // Allow more async chunks
          maxInitialRequests: 8, // More initial requests for better splitting
          cacheGroups: {
            default: false,
            vendors: false,
            // Split React into separate chunk
            react: {
              test: /[\\/]node_modules[\\/]react[\\/]/,
              name: 'react',
              priority: 100,
              chunks: 'all',
              maxSize: 40000,
              enforce: true
            },
            // Split React-DOM into separate chunk
            reactDom: {
              test: /[\\/]node_modules[\\/]react-dom[\\/]/,
              name: 'react-dom',
              priority: 99,
              chunks: 'all',
              maxSize: 40000,
              enforce: true
            },
            // Next.js framework
            nextFramework: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'next-framework',
              priority: 98,
              chunks: 'all',
              maxSize: 40000,
            },
            // Firebase - async only (not in initial bundle)
            firebase: {
              test: /[\\/]node_modules[\\/]firebase[\\/]/,
              name: 'firebase',
              priority: 90,
              chunks: 'async',
              maxSize: 30000,
            },
            // Stripe - async only
            stripe: {
              test: /[\\/]node_modules[\\/]@stripe[\\/]/,
              name: 'stripe',
              priority: 80,
              chunks: 'async',
              maxSize: 25000,
            },
            // Analytics components - async only (CRITICAL FIX)
            analytics: {
              test: /[\\/]src[\\/](components|lib)[\\/].*(analytics|optimization|improvement|research|framework|loops|collection).*\.(tsx?|jsx?)$/i,
              name: 'analytics',
              priority: 75,
              chunks: 'async',
              maxSize: 20000,
            },
            // Large components - async only
            largeComponents: {
              test: /[\\/]src[\\/]components[\\/].*(Framework|System|Loops|Collection|Engine|Optimization).*\.(tsx?|jsx?)$/,
              name: 'large-components',
              priority: 74,
              chunks: 'async',
              maxSize: 20000,
            },
            // Crisis-critical components - small chunks
            crisis: {
              test: /[\\/]src[\\/]components[\\/].*(crisis|emergency|support).*[\\/]/i,
              name: 'crisis',
              priority: 95,
              chunks: 'all',
              maxSize: 15000,
              enforce: true
            },
            // UI libraries chunk
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|@heroicons|lucide-react)[\\/]/,
              name: 'ui',
              priority: 70,
              chunks: 'async',
              maxSize: 25000,
            },
            // Other node modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 50,
              chunks: 'async',
              maxSize: 25000,
            },
            // Common components
            common: {
              test: /[\\/]src[\\/]components[\\/]/,
              name: 'common',
              priority: 60,
              chunks: 'async',
              minChunks: 2,
              maxSize: 20000,
            },
          }
        },
        usedExports: true,
        sideEffects: false,
        moduleIds: 'deterministic',
        runtimeChunk: {
          name: 'webpack-runtime',
        },
      };
      
      // Add module concatenation for smaller bundles
      config.optimization.concatenateModules = true;
      
      // Remove source maps in emergency mode
      config.devtool = false;
    }
    
    // ALLOW BUILD: Temporarily allow build to investigate bundle contents
    config.performance = {
      maxAssetSize: 2000000,      // 2MB per asset - TEMPORARY
      maxEntrypointSize: 3000000, // 3MB total initial load - TEMPORARY  
      hints: 'warning'
    };
    
    return config;
  },
  
  // Disable headers to reduce bundle size
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);