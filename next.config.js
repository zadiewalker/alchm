/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-launch',
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

if (process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT) {
  const { withSentryConfig } = require('@sentry/nextjs');

  module.exports = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: false,
  }, {
    hideSourceMaps: true,
    widenClientFileUpload: true,
  });
} else {
  module.exports = nextConfig;
}
