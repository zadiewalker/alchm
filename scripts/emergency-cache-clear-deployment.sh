#!/bin/bash
# Emergency Cache Clear and Deployment Script for ALCHM Landing Page

echo "🚀 ALCHM Emergency Cache Clear and Deployment"
echo "============================================"

# Step 1: Force a fresh build
echo "📦 Building fresh version..."
npm run build

# Step 2: Clear any local caches
echo "🧹 Clearing local caches..."
rm -rf .next/cache
rm -rf node_modules/.cache

# Step 3: Deploy with cache busting
echo "🚀 Deploying to Firebase with cache busting..."
firebase deploy --only hosting --force

# Step 4: Test the deployment
echo "🔍 Testing deployment..."
echo "Testing alchmapp.web.app..."
RESPONSE=$(curl -s -w "%{http_code}" https://alchmapp.web.app -o /dev/null)
if [ $RESPONSE -eq 200 ]; then
    echo "✅ alchmapp.web.app is responding correctly (HTTP $RESPONSE)"
else
    echo "❌ alchmapp.web.app returned HTTP $RESPONSE"
fi

echo "Testing redirect from alchm-digital-sanctuary.web.app..."
REDIRECT_RESPONSE=$(curl -s -w "%{http_code}" https://alchm-digital-sanctuary.web.app -o /dev/null)
if [ $REDIRECT_RESPONSE -eq 301 ]; then
    echo "✅ alchm-digital-sanctuary.web.app is redirecting correctly (HTTP $REDIRECT_RESPONSE)"
else
    echo "❌ alchm-digital-sanctuary.web.app returned HTTP $REDIRECT_RESPONSE"
fi

# Step 5: Verify content
echo "🔍 Verifying new landing page content..."
CONTENT_CHECK=$(curl -s https://alchmapp.web.app | grep -c "The World's First Identity OS")
if [ $CONTENT_CHECK -gt 0 ]; then
    echo "✅ New landing page content detected (Identity OS tagline found)"
else
    echo "❌ New landing page content not found - may be cached"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "Main Site: https://alchmapp.web.app"
echo "Redirect Site: https://alchm-digital-sanctuary.web.app"
echo ""
echo "If you're still seeing the old version:"
echo "1. Hard refresh (Ctrl+F5 or Cmd+Shift+R)"
echo "2. Clear browser cache"
echo "3. Try incognito/private browsing mode"
echo "4. Wait 5-10 minutes for CDN propagation"