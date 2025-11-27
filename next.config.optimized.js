/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// OPTIMIZED: Streamlined configuration for deployment efficiency
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  trailingSlash: false,
  
  // Optimized image configuration
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: [],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  
  // Build optimizations
  typescript: {
    ignoreBuildErrors: false, // Catch errors early
  },
  
  eslint: {
    ignoreDuringBuilds: false, // Maintain code quality
  },
  
  // Optimized experimental features
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
    bundlePagesExternals: true,
    esmExternals: true,
    webpackBuildWorker: true,
    cpus: Math.max(1, Math.floor(require('os').cpus().length / 2))
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },
  
  swcMinify: true,
  
  // Optimized webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Server externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin', 'stripe');
    }
    
    // Optimized chunk splitting for production
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 200000,
          minChunks: 1,
          maxAsyncRequests: 10,
          maxInitialRequests: 3,
          cacheGroups: {
            default: false,
            vendors: false,
            
            // React ecosystem
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              priority: 100,
              chunks: 'all',
              enforce: true
            },
            
            // Next.js framework
            nextjs: {
              test: /[\\/]node_modules[\\/]next[\\/]/,
              name: 'nextjs-vendor', 
              priority: 95,
              chunks: 'all',
              enforce: true
            },
            
            // Essential utilities
            essentials: {
              test: /[\\/]node_modules[\\/](zod|@swc\/helpers)[\\/]/,
              name: 'essentials',
              priority: 90,
              chunks: 'all'
            },
            
            // Async vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 40,
              chunks: 'async',
              reuseExistingChunk: true
            }
          }
        },
        moduleIds: 'deterministic',
        runtimeChunk: 'single'
      };
      
      // Remove source maps for production
      config.devtool = false;
    }
    
    // Performance budgets
    config.performance = {
      maxAssetSize: 200000,
      maxEntrypointSize: 400000,
      hints: 'warning'
    };
    
    // Module resolution
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
  
  poweredByHeader: false,
  
  // Redirects for legacy URLs
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/en/dashboard',
        permanent: false,
      },
      {
        source: '/journal',
        destination: '/en/journal',
        permanent: false,
      }
    ];
  }
};

module.exports = withBundleAnalyzer(nextConfig);