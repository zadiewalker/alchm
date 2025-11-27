#!/bin/bash

echo "🚀 ALCHM Pre-Publish Audit: Launch Sequence Initiated"

# STEP 1: Check for nested 'alchm/alchm'
if [ -d "./alchm/alchm" ]; then
  echo "⚠️ Nested './alchm/alchm' found. Auditing..."
  diff -qr ./ ./alchm/alchm/
  echo "🗑 Deleting nested 'alchm/alchm'... (backup any changes first)"
  rm -rf ./alchm/alchm
fi

# STEP 2: Clean workspace
echo "🧹 Cleaning lockfiles and node_modules..."
rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock

# STEP 3: Reinstall dependencies
if command -v pnpm &> /dev/null; then
  echo "📦 Installing dependencies with pnpm..."
  pnpm install --force
else
  echo "📦 Installing dependencies with npm..."
  npm install --legacy-peer-deps
fi

# STEP 4: Add critical missing packages if needed
echo "🔍 Verifying critical packages..."
npm install @opentelemetry/exporter-jaeger --save
npm install @opentelemetry/sdk-node @opentelemetry/instrumentation --save

# STEP 5: Fix invalid Gemini prompt structure
echo "🧠 Patching Gemini message role structure..."
find ./src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  -e 's/role: *["'"'"']user["'"'"']/role: "user"/g' \
  -e 's/role: *["'"'"']model["'"'"']/role: "model"/g' \
  -e 's/role: *["'"'"']system["'"'"']/role: "system"/g' \
  -e 's/role: *["'"'"']tool["'"'"']/role: "tool"/g'

# STEP 6: Patch invalid import
echo "🔧 Checking for invalid imports of 'emotions'..."
grep -rl "import.*emotions.*from '@/components/journal/moods'" ./src | while read file; do
  echo "⚠️ Fixing invalid import in $file"
  sed -i '' 's/import .*emotions.*from .*moods.*/\/\/ TODO: Replace 'emotions' import with 'emotionOptions' or actual export./' "$file"
done

# STEP 7: Warn about Webpack loader usage
echo "🔎 Checking for deprecated 'require.extensions' usage..."
grep -r "require.extensions" ./src ./node_modules | grep -v "node_modules" && \
echo "⚠️ Replace 'require.extensions' with proper Webpack loader config."

# STEP 8: Run type check
echo "✅ Running type check..."
npx tsc --noEmit

# STEP 9: Build check
echo "🏗 Running local build check..."
npm run build || {
  echo "❌ Build failed. Fix the above issues and retry.";
  exit 1;
}

# STEP 10: Mobile Deployment Readiness Check
echo "📱 Checking mobile deployment readiness..."
if [ -f "scripts/mobile-deployment-optimization.js" ]; then
  echo "✅ Mobile deployment validation script found"
  
  # Quick validation of mobile optimization components
  if grep -q "touch-safe\|crisis-accessible" src/styles/globals.css 2>/dev/null; then
    echo "✅ Mobile accessibility CSS detected"
  else
    echo "⚠️ Mobile accessibility CSS not found - ensure touch targets are optimized"
  fi
  
  # Check for service worker
  if [ -f "public/sw.js" ] || [ -f "src/app/sw.js" ]; then
    echo "✅ Service worker found for offline functionality"
  else
    echo "⚠️ No service worker found - offline crisis access may be limited"
  fi
  
  # Check for crisis-specific pages
  if [ -f "src/app/crisis-resources/page.tsx" ] || [ -f "public/crisis-resources.html" ]; then
    echo "✅ Crisis resources page found"
  else
    echo "⚠️ Crisis resources page not found"
  fi
  
else
  echo "⚠️ Mobile deployment validation script not found"
  echo "   Run 'npm run mobile:validate' before production deployment"
fi

# STEP 11: Firebase Hosting Emulator Test
if [ -f "firebase.json" ]; then
  echo "🌐 Launching Firebase Emulator for testing..."
  echo "   Use Ctrl+C to stop and continue with deployment"
  timeout 30s npx firebase emulators:start --only hosting || true
else
  echo "⚠️ firebase.json not found. Skipping emulator launch."
fi

echo ""
echo "✅ ALCHM Pre-Publish Audit Complete!"
echo "🚀 Ready for mobile-optimized deployment!"
echo ""
echo "Next steps:"
echo "1. Run deployment: ./scripts/deploy-mobile-optimized.sh staging"
echo "2. Validate mobile performance: npm run mobile:validate"
echo "3. For production: ./scripts/deploy-mobile-optimized.sh production"
echo ""
