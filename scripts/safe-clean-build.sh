#!/bin/bash
set -euo pipefail

# Safe clean build for ALCHM.
# Motivation: some environments accumulate huge/stale `out/` directories that can be slow or flaky to delete.
# This script moves `out/` aside to /tmp, clears `.next/`, and runs a clean static export build.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STAMP="$(date +"%Y%m%d-%H%M%S")"

echo "=== ALCHM Safe Clean Build ==="
echo "Repo: $ROOT"
echo "Time: $STAMP"
echo ""

if [ -d "out" ]; then
  TRASH="/tmp/alchm-out-trash-$STAMP"
  echo "Moving existing out/ -> $TRASH"
  mv "out" "$TRASH"
fi

echo "Removing .next/"
rm -rf ".next"

echo ""
echo "Building..."
npm run build

echo ""
PAGES="$(find out -name "index.html" 2>/dev/null | wc -l | tr -d ' ')"
echo "Pages in out/: $PAGES"

echo ""
echo "Core routes:"
for route in "" dashboard journal journal/new settings onboarding pricing privacy privacy-policy terms insights pathways checkin; do
  if [ -f "out/${route}/index.html" ]; then
    echo "  ✅ /$route"
  else
    echo "  ❌ /$route (missing)"
  fi
done

