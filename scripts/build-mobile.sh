#!/bin/bash

echo "🚀 Building ALCHM Mobile App..."

# Create temporary backup of API routes
echo "📦 Backing up API routes..."
mkdir -p .mobile-build-backup
cp -r src/app/api .mobile-build-backup/ 2>/dev/null || true

# Remove problematic API routes for static export
echo "🗑️  Temporarily removing server-side API routes..."
rm -rf src/app/api 2>/dev/null || true

# Copy mobile config
echo "⚙️  Using mobile configuration..."
cp next.config.mobile.js next.config.js

# Build static export
echo "🏗️  Building static mobile app..."
NODE_OPTIONS='--max-old-space-size=8192' NEXT_PUBLIC_IS_MOBILE=true npm run build

# Create mobile API endpoints file (for client-side API calls)
echo "📱 Creating mobile API configuration..."
mkdir -p out
cat > out/mobile-api-config.js << 'EOF'
window.MOBILE_API_CONFIG = {
  baseUrl: 'https://alchm-digital-sanctuary.web.app',
  endpoints: {
    journals: '/api/journals',
    save: '/api/save', 
    aiInsights: '/api/ai-insights',
    crisisDetection: '/api/crisis-detection',
    export: '/api/journals/export'
  }
};
EOF

# Restore API routes
echo "🔄 Restoring API routes..."
if [ -d ".mobile-build-backup/api" ]; then
  mkdir -p src/app
  cp -r .mobile-build-backup/api src/app/
  rm -rf .mobile-build-backup
fi

# Restore original config
echo "♻️  Restoring original Next.js configuration..."
git checkout next.config.js 2>/dev/null || echo "Config already restored"

echo "✅ Mobile build complete! Static files are in ./out directory"
echo "📱 Ready for Capacitor deployment"