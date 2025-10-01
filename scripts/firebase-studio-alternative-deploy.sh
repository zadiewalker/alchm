#!/bin/bash

# FIREBASE STUDIO ALTERNATIVE DEPLOYMENT METHOD
# BYPASSES CACHED CONFIGURATION ENTIRELY

set -e

echo "🔄 FIREBASE STUDIO ALTERNATIVE DEPLOYMENT METHOD..."

# Method 1: Use minimal configuration
echo "📦 Method 1: Minimal Configuration Deployment"
cp apphosting-minimal.yaml apphosting.yaml

firebase deploy --only apphosting --project=alchm-digital-sanctuary

echo "✅ Minimal deployment complete. If this works, Firebase Studio cache is bypassed."

# Method 2: Manual Firebase Console Configuration
echo ""
echo "🖥️  Method 2: Manual Firebase Console Configuration"
echo "If automated deployment fails, follow these steps:"
echo ""
echo "1. Go to Firebase Console: https://console.firebase.google.com/project/alchm-digital-sanctuary/apphosting"
echo "2. Delete existing backend 'alchm-backend'"
echo "3. Create new backend 'alchm-nuclear-backend'"
echo "4. Configure environment variables manually:"
echo "   - NEXT_PUBLIC_FIREBASE_API_KEY: AIzaSyCqjfzvykK6q55vLH7F0FEuyK0cppGhD3w"
echo "   - NEXT_PUBLIC_FIREBASE_PROJECT_ID: alchm-digital-sanctuary"
echo "   - NODE_ENV: production"
echo ""
echo "5. Deploy from Console interface"
echo ""
echo "✅ This bypasses ALL local configuration caching issues."