#!/bin/bash

# ALCHM iOS Build Test Script
# Tests the iOS build from command line

set -e

echo "🍎 ALCHM iOS Build Test"
echo "======================="

# Navigate to iOS project directory
cd "/Users/zadiewalker/Desktop/alchm/ios/ALCHM"

echo "📱 Project location: $(pwd)"
echo ""

# Check if Xcode workspace exists
if [ ! -f "ALCHM.xcworkspace/contents.xcworkspacedata" ]; then
    echo "❌ Error: ALCHM.xcworkspace not found"
    exit 1
fi

echo "✅ Workspace found: ALCHM.xcworkspace"

# Check if project files exist
if [ ! -f "ALCHM.xcodeproj/project.pbxproj" ]; then
    echo "❌ Error: ALCHM.xcodeproj not found"
    exit 1
fi

echo "✅ Project found: ALCHM.xcodeproj"

# Check app source files
if [ ! -f "ALCHM/Info.plist" ]; then
    echo "❌ Error: Info.plist not found"
    exit 1
fi

echo "✅ Info.plist found"

# Check web content
if [ ! -d "ALCHM/public" ] || [ ! -f "ALCHM/public/index.html" ]; then
    echo "❌ Error: Web content not found in public folder"
    exit 1
fi

echo "✅ Web content found"

# Check bundle identifier
BUNDLE_ID=$(plutil -extract CFBundleIdentifier xml1 -o - ALCHM/Info.plist | grep -o 'com\.alchm\.app' || echo "not found")
if [ "$BUNDLE_ID" = "com.alchm.app" ]; then
    echo "✅ Bundle identifier: $BUNDLE_ID"
else
    echo "❌ Bundle identifier incorrect: $BUNDLE_ID"
fi

# Check display name
DISPLAY_NAME=$(plutil -extract CFBundleDisplayName xml1 -o - ALCHM/Info.plist | grep -o 'ALCHM' || echo "not found")
if [ "$DISPLAY_NAME" = "ALCHM" ]; then
    echo "✅ Display name: $DISPLAY_NAME"
else
    echo "❌ Display name incorrect: $DISPLAY_NAME"
fi

echo ""
echo "🚀 Ready for build! Next steps:"
echo ""
echo "1. In Xcode, select scheme: ALCHM"
echo "2. Select destination: iPhone Simulator (any device)"
echo "3. Press Cmd+B to build"
echo ""
echo "Or run from command line:"
echo "xcodebuild -workspace ALCHM.xcworkspace -scheme ALCHM -destination 'platform=iOS Simulator,name=iPhone 15' build"
echo ""
echo "For device build:"
echo "xcodebuild -workspace ALCHM.xcworkspace -scheme ALCHM -destination 'generic/platform=iOS' build"
echo ""

# Try to list available simulators
echo "📱 Available iOS Simulators:"
xcrun simctl list devices ios | grep -E "(iPhone|iPad)" | head -5 || echo "Could not list simulators"

echo ""
echo "✅ Build environment ready!"