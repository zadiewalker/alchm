#!/usr/bin/env bash
set -euo pipefail

echo "ALCHM Xcode Cloud pre-xcodebuild verification"

if [ ! -d "ios/App/App.xcworkspace" ]; then
  echo "Missing authoritative workspace: ios/App/App.xcworkspace" >&2
  echo "Xcode Cloud must be configured with workspace ios/App/App.xcworkspace and scheme App." >&2
  exit 1
fi

npm run verify:native-bundle
