/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-launch',
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
