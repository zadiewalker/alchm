/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for Firebase App Hosting compatibility  
  output: 'export',
  
  // Disable trailing slash to prevent 404s
  trailingSlash: false,
  
  // Disable image optimization for Firebase compatibility
  images: {
    unoptimized: true
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'alchm-digital-sanctuary',
  }
};

module.exports = nextConfig;