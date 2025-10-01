#!/bin/bash

# ALCHM Firebase App Hosting Deployment Script
# Deploys Next.js app with dynamic routes and API endpoints

set -e  # Exit on error

echo "🚀 Starting ALCHM Firebase App Hosting deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit --progress=false

# Build the Next.js app for standalone deployment
echo "🏗️ Building Next.js app for Firebase App Hosting..."
NODE_OPTIONS='--max-old-space-size=8192' SKIP_ENV_VALIDATION=true npm run build:firebase-studio

# Check if standalone server was created
if [ ! -f ".next/standalone/server.js" ]; then
    echo "❌ Error: Standalone server not created. Check Next.js configuration."
    exit 1
fi

# Deploy Firebase Functions first
echo "🔧 Deploying Firebase Functions..."
firebase deploy --only functions

# Deploy to Firebase App Hosting
echo "🌐 Deploying to Firebase App Hosting..."
firebase apphosting:backends:create --config apphosting.yaml

echo "✅ Deployment completed successfully!"
echo ""
echo "🎯 Your ALCHM app should now be available with:"
echo "   - Dynamic Next.js routes"
echo "   - API endpoints (/api/*)"
echo "   - Server-side rendering"
echo "   - Firebase authentication"
echo "   - Crisis detection features"
echo ""
echo "🔍 Check deployment status:"
echo "   firebase apphosting:backends:list"
echo ""
echo "📱 Test the deployment:"
echo "   curl https://your-app-url/api/status"