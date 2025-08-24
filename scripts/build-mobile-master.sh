#!/bin/bash

# ALCHM Master Mobile Build Script
# Builds for both iOS TestFlight and Android Google Play

set -e

PLATFORM=${1:-both}
BUILD_TYPE=${2:-testing}

echo "📱 ALCHM Master Mobile Build"
echo "═══════════════════════════════════════"
echo "Platform: $PLATFORM"
echo "Build Type: $BUILD_TYPE"
echo "═══════════════════════════════════════"

# Step 1: Build web application
echo "🌐 Building web application..."
npm run build

# Step 2: Sync with Capacitor
echo "📱 Syncing with Capacitor..."
npx cap sync

# Step 3: Build based on platform
case $PLATFORM in
  "ios")
    echo "🍎 Building iOS for TestFlight..."
    npm run ios:build
    echo "✅ iOS build complete"
    ;;
  "android")
    echo "🤖 Building Android for Google Play..."
    npm run android:build:$BUILD_TYPE
    echo "✅ Android build complete"
    ;;
  "both")
    echo "🍎 Building iOS for TestFlight..."
    npm run ios:build
    echo "✅ iOS build complete"
    
    echo "🤖 Building Android for Google Play..."
    npm run android:build:$BUILD_TYPE
    echo "✅ Android build complete"
    ;;
  *)
    echo "❌ Invalid platform. Use: ios, android, or both"
    exit 1
    ;;
esac

echo ""
echo "🎉 ALCHM Mobile Build Complete!"
echo "📱 Platforms built: $PLATFORM"
echo "🚀 Ready for app store distribution!"