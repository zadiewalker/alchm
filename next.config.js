/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase Hosting Compatibility
  trailingSlash: false,
  
  // Image Optimization (disabled for Firebase hosting)
  images: {
    unoptimized: true
  },
  
  // Performance Optimizations (disabled CSS minification for build fix)
  swcMinify: false,
  compress: false,
  poweredByHeader: false,
  
  // Cache Busting for deployments
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).slice(2)}`
  },
  
  // Bundle Optimization 
  experimental: {
    optimizePackageImports: ['@firebase/firestore', '@firebase/auth'],
    serverComponentsExternalPackages: ['firebase-admin']
  },
  
  // Build configuration
  eslint: {
    dirs: ['src/app', 'src/components', 'src/lib'],
    ignoreDuringBuilds: true
  },
  
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Static export for Firebase Hosting
  output: 'export',
  distDir: 'out',
  skipTrailingSlashRedirect: true,
  
  // Webpack config to fix CSS parsing error
  webpack: (config) => {
    // Disable CSS optimization that's causing the parsing error
    config.optimization.minimize = false;
    return config;
  }
}

module.exports = nextConfig
