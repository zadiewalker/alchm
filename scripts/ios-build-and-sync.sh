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

# Check if index.html exists, create if missing
if [ ! -f "out/index.html" ]; then
    echo "⚠️  index.html missing, creating from build manifest..."
    
    # Get the build ID from the 404 page
    BUILD_ID=$(grep -o '"buildId":"[^"]*"' out/404/index.html | cut -d'"' -f4)
    
    if [ -z "$BUILD_ID" ]; then
        echo "❌ Could not determine build ID"
        exit 1
    fi
    
    echo "📋 Using build ID: $BUILD_ID"
    
    # Create index.html with proper build ID
    cat > out/index.html << EOF
<!DOCTYPE html><html lang="en" class="antialiased"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"/><meta name="theme-color" content="#8B9A7C"/><title>ALCHM</title><meta name="description" content="Your digital sanctuary for healing and transformation. Not a substitute for professional medical care."/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><meta name="apple-mobile-web-app-title" content="ALCHM"/><meta name="mobile-web-app-capable" content="yes"/><meta name="application-name" content="ALCHM"/><link rel="manifest" href="/manifest.json"/><link rel="apple-touch-icon" href="/icon-192.png"/><link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png"/><link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><link rel="apple-touch-startup-image" href="/splash-screen.png"/><meta name="msapplication-TileColor" content="#8B9A7C"/><meta name="msapplication-TileImage" content="/icon-144.png"/><meta name="msapplication-config" content="/browserconfig.xml"/><meta httpEquiv="X-UA-Compatible" content="IE=edge"/><meta name="referrer" content="strict-origin-when-cross-origin"/><meta name="format-detection" content="telephone=no"/><meta name="apple-touch-fullscreen" content="yes"/><script defer="" noModule="" src="/_next/static/chunks/polyfills-42372ed130431b0a.js"></script><script src="/_next/static/chunks/webpack-abf5f5290482f86a.js" defer=""></script><script src="/_next/static/chunks/framework-34532b6de6f80099.js" defer=""></script><script src="/_next/static/chunks/main-7007588d3b5a59d1.js" defer=""></script><script src="/_next/static/chunks/main-app-c9e8196cae12c1f2.js" defer=""></script><script src="/_next/static/chunks/vendors-bc4083c3-2b3bfc6dc89202ee.js" defer=""></script><script src="/_next/static/$BUILD_ID/_buildManifest.js" defer=""></script><script src="/_next/static/$BUILD_ID/_ssgManifest.js" defer=""></script></head><body class="bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] min-h-screen"><div id="__next"></div><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}},"page":"/","query":{},"buildId":"$BUILD_ID","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script></body></html>
EOF

    echo "✅ Created index.html with build ID: $BUILD_ID"
fi

# Sync to iOS
echo "📱 Syncing to iOS..."
npx cap copy ios

# Check bundle sizes for iOS WebView compatibility
echo "📊 Bundle size analysis:"
du -h out/_next/static/chunks/*.js | sort -hr | head -10

echo "✅ iOS build and sync complete!"
echo "🚀 Run 'npx cap open ios' to test in Xcode"