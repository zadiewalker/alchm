/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Avoid Next inferring the monorepo root due to multiple lockfiles.
  outputFileTracingRoot: path.join(__dirname),
};
module.exports = nextConfig;
