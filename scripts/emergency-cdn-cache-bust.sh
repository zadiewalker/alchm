#!/bin/bash

# Emergency CDN Cache Bust Script
# This script forces cache invalidation across all possible CDN layers

echo "🚨 EMERGENCY CACHE BUST INITIATED"
echo "=================================="

# Get current timestamp for cache busting
TIMESTAMP=$(date +%s)

# Force rebuild with cache-busting timestamp
echo "🔄 Rebuilding with timestamp: $TIMESTAMP"
rm -rf out .next
echo "NEXT_PUBLIC_BUILD_TIMESTAMP=$TIMESTAMP" > .env.cache-bust

# Build with timestamp
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# Deploy with force flag
echo "🚀 Force deploying to Firebase..."
npx firebase deploy --only hosting --force

# Ping both domains with cache-bust headers
echo "🌐 Testing cache bust on primary domain..."
curl -H "Cache-Control: no-cache" -H "Pragma: no-cache" "https://alchmapp.web.app?cb=$TIMESTAMP" > /dev/null

echo "🌐 Testing cache bust on secondary domain..."  
curl -H "Cache-Control: no-cache" -H "Pragma: no-cache" "https://alchm-digital-sanctuary.web.app?cb=$TIMESTAMP" > /dev/null

# Clean up
rm -f .env.cache-bust

echo "✅ Emergency cache bust complete!"
echo "🔍 Please test with hard refresh (Ctrl+F5 or Cmd+Shift+R)"
echo "🔍 Or try incognito mode with ?cb=$TIMESTAMP appended to URL"
