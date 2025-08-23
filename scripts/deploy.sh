#!/bin/bash

# ALCHM Firebase Deployment Script
# Optimized build pipeline for Firebase Functions + Next.js

set -e  # Exit on any error

echo "🚀 Starting ALCHM deployment pipeline..."

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out functions/lib functions/dist

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# 3. Type checking
echo "🔍 Running TypeScript checks..."
npx tsc --noEmit

# 4. Lint check
echo "✨ Running linting..."
pnpm run lint --quiet || echo "⚠️  Lint warnings detected, continuing..."

# 5. Build Next.js application
echo "🏗️  Building Next.js application..."
npx next build

# 6. Build Firebase Functions
echo "🔥 Building Firebase Functions..."
cd functions
pnpm install --frozen-lockfile
pnpm run build
cd ..

# 7. Copy Next.js build to functions directory
echo "📋 Copying Next.js build for Functions..."
if [ -d ".next" ]; then
  cp -r .next functions/
  echo "✅ Copied .next directory to functions"
else
  echo "❌ .next directory not found - build may have failed"
  exit 1
fi

if [ -d "public" ]; then
  cp -r public functions/
  echo "✅ Copied public directory to functions"
else
  echo "ℹ️  No public directory to copy"
fi

if [ -f "next.config.mjs" ]; then
  cp next.config.mjs functions/
  echo "✅ Copied next.config.mjs to functions"
else
  echo "ℹ️  No next.config.mjs to copy"
fi

cp package.json functions/package-app.json
echo "✅ Copied package.json as package-app.json"

# 8. Deploy to Firebase
echo "🚀 Deploying to Firebase..."
npx firebase deploy --only functions,hosting

echo "✅ Deployment completed successfully!"
echo "🌐 Live at: https://alchm-digital-sanctuary.web.app"