/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone for Firebase App Hosting with API routes
  output: 'standalone',
  
  // Disable trailing slash to prevent 404s
  trailingSlash: false,
  
  // Disable image optimization for Firebase compatibility
  images: {
    unoptimized: true
  },
  
  // Experimental features for Firebase compatibility
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*'],
    },
  },
  
  // Server configuration
  serverExternalPackages: ['firebase-admin'],
  
  // Environment variables
  env: {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'alchm-digital-sanctuary',
  },
  
  // Optimize for Firebase Functions
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('firebase-admin');
    }
    return config;
  }
};

module.exports = nextConfig;