#!/bin/bash

# Build and Sync Script for ALCHM Capacitor iOS App
# This script ensures a clean build and sync process

echo "🔧 ALCHM Capacitor iOS Build & Sync"
echo "==================================="

# Step 1: Clean previous builds
echo ""
echo "1. Cleaning previous builds..."
rm -rf out .next
echo "✅ Cleaned out/ and .next/"

# Step 2: Build Next.js static export
echo ""
echo "2. Building Next.js static export..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
echo "✅ Next.js build completed"

# Step 3: Sync to iOS
echo ""
echo "3. Syncing to iOS app..."
npx cap sync ios
if [ $? -ne 0 ]; then
    echo "❌ iOS sync failed. Please check the errors above."
    exit 1
fi
echo "✅ iOS sync completed"

# Step 4: Run diagnostics
echo ""
echo "4. Running diagnostics..."
node scripts/test-capacitor.js

echo ""
echo "🎉 Build and sync completed successfully!"
echo ""
echo "Next steps:"
echo "1. Open ios/App/App.xcworkspace in Xcode"
echo "2. Build and run the app"
echo "3. Use Safari Web Inspector for debugging"
echo ""