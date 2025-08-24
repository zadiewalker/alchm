// Firebase Studio Bulletproof Configuration v3.0
// Specifically designed to survive apphosting-adapter-nextjs-build overrides
// NO ES module syntax to prevent __esModule injection

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