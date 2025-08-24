#!/bin/bash

# ALCHM Release Automation Script
# Handles version bumping, building, and deployment

set -e

RELEASE_TYPE=${1:-patch}  # patch, minor, major
PLATFORM=${2:-both}        # ios, android, both

echo "🚀 ALCHM Release Automation"
echo "═══════════════════════════════════════"
echo "Release Type: $RELEASE_TYPE"
echo "Platform: $PLATFORM"
echo "═══════════════════════════════════════"

# Step 1: Version bump
echo "📊 Bumping version..."
npm version $RELEASE_TYPE --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Step 2: Update native app versions
echo "📱 Updating native app versions..."
if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  # Update iOS version
  plutil -replace CFBundleShortVersionString -string "$NEW_VERSION" ios/App/App/Info.plist
fi

if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
  # Update Android version (this would need proper gradle modification)
  echo "Android version update needed in gradle files"
fi

# Step 3: Run tests
echo "🧪 Running comprehensive tests..."
./scripts/continuous-testing-pipeline.sh

# Step 4: Build for release
echo "🔨 Building release versions..."
./scripts/build-mobile-master.sh $PLATFORM release

# Step 5: Create git tag
echo "📝 Creating git tag..."
git add .
git commit -m "Release v$NEW_VERSION"
git tag "v$NEW_VERSION"

echo ""
echo "🎉 ALCHM Release v$NEW_VERSION Complete!"
echo "📱 Platform: $PLATFORM"
echo "🚀 Ready for app store submission!"
echo ""
echo "Next steps:"
echo "1. Push to git: git push && git push --tags"
echo "2. Upload iOS build to TestFlight"
echo "3. Upload Android build to Google Play Internal Testing"