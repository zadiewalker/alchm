#!/bin/bash

# ALCHM iOS Build and Sync Script
# Optimized for iOS WebView performance

echo "🍎 Building ALCHM for iOS WebView..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf out/ .next/

# Build with iOS optimizations
echo "🔧 Building with iOS WebView optimizations..."
npm run build

# Check if index.html exists. Do not synthesize fallback HTML; stale generated
# shells can make Xcode appear to run old ALCHM surfaces.
if [ ! -f "out/index.html" ]; then
    echo "❌ out/index.html missing after build; refusing to sync stale fallback HTML"
    exit 1
fi

# Sync to iOS
echo "📱 Syncing to iOS..."
npx cap copy ios

# Check bundle sizes for iOS WebView compatibility
echo "📊 Bundle size analysis:"
du -h out/_next/static/chunks/*.js | sort -hr | head -10

echo "✅ iOS build and sync complete!"
echo "🚀 Run 'npx cap open ios' to test in Xcode"
