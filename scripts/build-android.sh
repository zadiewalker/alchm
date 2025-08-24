#!/bin/bash

# ALCHM Android Build Script for Google Play Distribution
# Handles debug, testing, and release builds

set -e

BUILD_TYPE=${1:-debug}
echo "🤖 Building ALCHM Android - Build Type: $BUILD_TYPE"
echo "═══════════════════════════════════════════════════════"

# Step 1: Clean and prepare
echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

# Step 2: Build web app
echo "🌐 Building web application..."
cd ..
npm run build

# Step 3: Sync with Capacitor
echo "📱 Syncing with Capacitor Android..."
npx cap sync android

# Step 4: Update version code
echo "📊 Updating version code..."
VERSION_CODE=$(date +%Y%m%d%H%M)
echo "Version code: $VERSION_CODE"

cd android

# Step 5: Build based on type
case $BUILD_TYPE in
  "debug")
    echo "🔨 Building debug APK..."
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    ;;
  "testing")
    echo "🔨 Building testing APK..."
    ./gradlew assembleTestingDebug
    APK_PATH="app/build/outputs/apk/testing/debug/app-testing-debug.apk"
    ;;
  "release")
    echo "🔨 Building release AAB for Google Play..."
    ./gradlew bundleRelease
    APK_PATH="app/build/outputs/bundle/release/app-release.aab"
    ;;
  *)
    echo "❌ Invalid build type. Use: debug, testing, or release"
    exit 1
    ;;
esac

echo "✅ Build complete!"
echo "📍 Output location: android/$APK_PATH"

if [ "$BUILD_TYPE" = "release" ]; then
  echo ""
  echo "🚀 Ready for Google Play Console upload!"
  echo "1. Go to Google Play Console"
  echo "2. Select your app"
  echo "3. Go to Production → Create new release"
  echo "4. Upload the AAB file: android/$APK_PATH"
  echo "5. Fill in release notes and submit for review"
fi