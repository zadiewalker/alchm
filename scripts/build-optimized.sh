#!/bin/bash
# Optimized build script for ALCHM

set -e

echo "🚀 Starting optimized build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Environment variables for optimization
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384"
export NEXT_TELEMETRY_DISABLED=1

# Enable build optimizations
echo "⚡ Building with optimizations..."
time npm run build

# Check bundle size
echo "📊 Analyzing bundle size..."
if [ -f ".next/analyze/client.html" ]; then
    echo "✅ Bundle analysis available at .next/analyze/client.html"
fi

# Calculate build size
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "📦 Build size: $BUILD_SIZE"

# Check for optimization opportunities
echo "🔍 Checking for optimization opportunities..."
echo "- Checking for large chunks..."
find .next/static/chunks -name "*.js" -size +500k -exec ls -lh {} \; | head -5

echo "✅ Optimized build complete!"