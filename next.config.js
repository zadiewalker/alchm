/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase Studio Compatibility
  output: 'export',
  trailingSlash: true,
  
  // Image Optimization (disabled for Firebase hosting)
  images: {
    unoptimized: true
  },
  
  // Crisis-Safe Performance Optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Mobile Cache Busting - Force fresh builds
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).slice(2)}`
  },
  
  // Bundle Optimization for Firebase Studio
  experimental: {
    optimizePackageImports: ['@firebase/firestore', '@firebase/auth']
  },
  
  // Exclude test files from build
  eslint: {
    dirs: ['src/app', 'src/components', 'src/lib'],
    ignoreDuringBuilds: true
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
