#!/bin/bash

# ALCHM iOS WebView Optimization Rebuild Script
# This script rebuilds the iOS app with WebView performance optimizations

set -e

echo "🚀 Starting ALCHM iOS WebView Optimization Rebuild..."

# Clean existing build artifacts
echo "🧹 Cleaning existing build artifacts..."
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*
rm -rf build/
rm -rf Pods/
rm -f Podfile.lock

# Update CocoaPods
echo "📦 Updating CocoaPods..."
pod repo update

# Install pods with new iOS 17+ configurations
echo "⚙️ Installing pods with iOS 17+ optimizations..."
pod install --repo-update --clean-install

# Sync Capacitor with new configurations
echo "⚡ Syncing Capacitor with new iOS configurations..."
cd ../../
npx cap sync ios
cd ios/App

# Build for simulator (Debug)
echo "🔨 Building for iOS Simulator (Debug)..."
xcodebuild -workspace App.xcworkspace \
           -scheme App \
           -configuration Debug \
           -destination 'platform=iOS Simulator,name=iPhone 15 Pro,OS=latest' \
           clean build \
           -quiet

echo "✅ iOS WebView optimizations applied successfully!"
echo ""
echo "🎯 Key optimizations applied:"
echo "   • iOS 17+ deployment target"
echo "   • WebView process pool optimization"
echo "   • Metal GPU acceleration enabled"
echo "   • Network timeout optimizations"
echo "   • Memory management improvements"
echo "   • Sandbox extension handling"
echo "   • App Transport Security configured"
echo ""
echo "📱 You can now run the app on iOS 17+ devices with improved WebView performance!"