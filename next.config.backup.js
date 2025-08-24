// Emergency Fallback Configuration
// If Firebase Studio corrupts next.config.mjs, this serves as backup

const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  experimental: { serverComponentsExternalPackages: ['firebase-admin'] }
};

module.exports = nextConfig;