#!/bin/bash

# ALCHM iOS TestFlight Build Script
# Automates the iOS build and TestFlight upload process

set -e

echo "🍎 Starting ALCHM iOS TestFlight Build Process"
echo "═══════════════════════════════════════════════"

# Step 1: Clean and prepare
echo "🧹 Cleaning previous builds..."
rm -rf ios/App/build
rm -rf dist

# Step 2: Build web app
echo "🌐 Building web application..."
npm run build

# Step 3: Sync with Capacitor
echo "📱 Syncing with Capacitor iOS..."
npx cap sync ios

# Step 4: Update build number
echo "📊 Updating build number..."
BUILD_NUMBER=$(date +%Y%m%d%H%M)
plutil -replace CFBundleVersion -string "$BUILD_NUMBER" ios/App/App/Info.plist
echo "Build number set to: $BUILD_NUMBER"

# Step 5: Build iOS app
echo "🔨 Building iOS application..."
cd ios/App
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath "build/App.xcarchive" \
  archive

# Step 6: Export for TestFlight
echo "📦 Exporting for TestFlight..."
xcodebuild -exportArchive \
  -archivePath "build/App.xcarchive" \
  -exportPath "build/TestFlight" \
  -exportOptionsPlist "ExportOptions.plist"

echo "✅ iOS build complete!"
echo "📍 Archive location: ios/App/build/App.xcarchive"
echo "📦 TestFlight build: ios/App/build/TestFlight/"
echo ""
echo "🚀 Next steps:"
echo "1. Open Xcode and verify the archive"
echo "2. Upload to App Store Connect via Xcode Organizer"
echo "3. Configure TestFlight beta testing in App Store Connect"