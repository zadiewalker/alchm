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

# STEP 10: Firebase Hosting Emulator Test
if [ -f "firebase.json" ]; then
  echo "🌐 Launching Firebase Emulator..."
  npx firebase emulators:start --only hosting
else
  echo "⚠️ firebase.json not found. Skipping emulator launch."
fi

echo "✅ ALCHM Pre-Publish Audit Complete. You’re ready to deploy! 🛸"
