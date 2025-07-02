/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "your-supabase-bucket.vercel.app",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com", // Google profile images if using Google Auth
      "avatars.githubusercontent.com", // GitHub profile images if using GitHub Auth
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // if Vercel is blocked by eslint warnings
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
