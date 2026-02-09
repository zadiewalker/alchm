const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Capacitor
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  distDir: 'out',
  
  // Allow cross-origin requests for development
  allowedDevOrigins: ['10.0.0.24:3000', 'localhost:3000'],
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // iOS WebView specific optimizations
  generateEtags: false,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  
  // Fix for Capacitor iOS WebView
  assetPrefix: '',
  basePath: '',
  
  // Optimize webpack bundle splitting for iOS WebView
  experimental: {
    optimizePackageImports: ['firebase', 'lucide-react', '@stripe/stripe-js', 'chart.js'],
    // iOS WebView optimizations
    webpackBuildWorker: false, // Disable for iOS compatibility
    serverMinification: false
  },
  
  // Tree shake unused code
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle size for iOS WebView
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.maxAsyncRequests = 10; // Reduced for iOS WebView
      config.optimization.splitChunks.maxInitialRequests = 8; // Reduced for iOS WebView
      config.optimization.splitChunks.minSize = 30000; // Larger chunks for iOS WebView
      
      // Tree shake Firebase and other heavy libraries
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase/app': 'firebase/app',
        'firebase/auth': 'firebase/auth', 
        'firebase/firestore': 'firebase/firestore',
      };
      
      // Optimize chunk loading
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Simplified cache groups for iOS WebView stability
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        // Critical frameworks - load synchronously
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
          enforce: true
        },
        // All other vendor code - single chunk to reduce requests
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          maxSize: 300000, // Larger chunks for fewer requests
          minChunks: 1
        }
      };
      
      // iOS WebView specific optimizations
      config.optimization.providedExports = true;
      config.optimization.concatenateModules = true;
    }
    return config;
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Only upload source maps in production
  silent: process.env.NODE_ENV === 'development',
  
  // Performance optimizations
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: process.env.NODE_ENV === 'production',
  
  // For static export compatibility
  automaticVercelMonitors: false,
};

// Export with Sentry configuration
module.exports = process.env.NODE_ENV === 'production' 
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
