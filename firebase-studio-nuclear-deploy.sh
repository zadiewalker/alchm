#!/bin/bash

# Firebase Studio Nuclear Deployment Script
# Bypasses all caching issues and forces fresh deployment

set -e

echo "🚨 ALCHM - Firebase Studio Nuclear Deployment"
echo "============================================="
echo "Timestamp: $(date)"
echo ""

echo "🧹 Step 1: Clearing ALL Firebase caches..."
firebase logout || true
rm -rf ~/.config/firebase 2>/dev/null || true
rm -rf ~/.cache/firebase 2>/dev/null || true
echo "✅ Caches cleared"

echo ""
echo "🔐 Step 2: Fresh Firebase authentication..."
firebase login --reauth
echo "✅ Authentication refreshed"

echo ""
echo "📋 Step 3: Verifying project configuration..."
firebase use alchm-digital-sanctuary
firebase projects:list | grep alchm-digital-sanctuary
echo "✅ Project confirmed"

echo ""
echo "🔧 Step 4: Validating apphosting.yaml..."
if [ ! -f "apphosting.yaml" ]; then
    echo "❌ apphosting.yaml not found!"
    exit 1
fi

echo "Configuration preview:"
head -10 apphosting.yaml
echo "✅ Configuration validated"

echo ""
echo "🏗️ Step 5: Testing local build..."
npm run gcp-build
echo "✅ Build successful"

echo ""
echo "🚀 Step 6: Deploying to Firebase Studio..."
echo "This will create/update your App Hosting backend..."
firebase deploy --only=apphosting --force

echo ""
echo "✅ NUCLEAR DEPLOYMENT COMPLETE!"
echo "🌿 ALCHM should now be live on Firebase Studio"
echo "Check your Firebase Console for deployment status"
echo ""
echo "Deployment URL will be shown in Firebase Console > App Hosting"