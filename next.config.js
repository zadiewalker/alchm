// Firebase App Hosting Next.js configuration
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin']
  }
};

module.exports = nextConfig;