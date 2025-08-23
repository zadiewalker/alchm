#!/bin/bash

echo "🚀 Starting ALCHM Publish Process..."

# Step 1: Cleanup
echo "🧹 Cleaning up node_modules, build, and lock files..."
rm -rf node_modules .next dist package-lock.json pnpm-lock.yaml

# Step 2: Install dependencies using npm (safer than pnpm for now)
echo "📦 Installing fresh dependencies..."
npm install

# Step 3: TypeScript check
echo "✅ Running TypeScript checks..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ TypeScript check failed. Exiting..."
  exit 1
fi

# Step 4: ESLint auto-fix
echo "🧼 Running ESLint autofix..."
npx eslint . --ext .ts,.tsx --fix

# Step 5: Build for production
echo "🛠 Building the app..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Exiting..."
  exit 1
fi

# Step 6: Firebase Deploy
read -p "🎯 Deploy to Firebase now? (y/N): " confirm
if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
  echo "🚀 Deploying to Firebase..."
  firebase deploy --only hosting
else
  echo "📦 Build complete. Firebase deploy skipped."
fi

echo "✅ ALCHM publish process complete."
