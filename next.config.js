// Next.js 14 Firebase Studio Compatible Configuration
// Designed to work WITH Firebase Studio's override system

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase App Hosting requirements
  output: 'standalone',
  
  // Disable trailing slash
  trailingSlash: false,
  
  // Image optimization disabled for Firebase
  images: {
    unoptimized: true
  },
  
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin']
  }
};

module.exports = nextConfig;