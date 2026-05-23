#!/usr/bin/env bash
set -euo pipefail

echo "ALCHM Xcode Cloud post-clone"
echo "Node: $(node --version)"
echo "npm: $(npm --version)"

if [ ! -f package-lock.json ]; then
  echo "package-lock.json is required for deterministic install." >&2
  exit 1
fi

npm install -g npm@11.4.2
echo "Pinned npm: $(npm --version)"

npm ci
npm run build
npx cap sync ios --deployment

cd ios/App
pod install --deployment
