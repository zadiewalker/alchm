#!/bin/bash
# deploy-testflight.sh

echo "🔨 Building web app..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "⚠️  Build failed, but continuing with existing build in out/ folder"
fi

echo "📱 Syncing to iOS..."
npx cap copy ios
npx cap sync ios

echo "🚀 Opening Xcode..."
echo ""
echo "Next steps in Xcode:"
echo "1. Increment Build number in General tab"
echo "2. Product → Archive"
echo "3. Distribute App → App Store Connect → Upload"
echo ""

npx cap open ios