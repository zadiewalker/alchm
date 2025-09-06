/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone for Firebase App Hosting SSR
  output: 'standalone',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Strict TypeScript checking for production readiness
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },
  
  // ESLint configuration for Firebase App Hosting builds
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint errors during builds for Firebase deployment
    dirs: ['src']
  },
  
  // Firebase App Hosting optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'tailwindcss'],
    serverComponentsExternalPackages: ['firebase-admin', 'stripe']
  },
  
  // Firebase App Hosting webpack configuration
  webpack: (config, { isServer }) => {
    // Server-side externals for Firebase App Hosting
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin');
      config.externals.push('stripe');
    }
    
    // Browser compatibility fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: false,
      os: false,
      stream: false,
      http: false,
      https: false,
      url: false,
      querystring: false
    };
    
    return config;
  },
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Headers and redirects are handled by Firebase Hosting in firebase.json
  
  // Environment configuration
  env: {
    CUSTOM_KEY: 'ALCHM_PRODUCTION',
    BUILD_TARGET: 'firebase-studio-app-hosting'
  }
};

// Export for Firebase App Hosting compatibility
module.exports = nextConfig;