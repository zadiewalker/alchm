#!/usr/bin/env bash
set -euo pipefail

echo "═══════════════════════════════════════════"
echo "PERFORMANCE REBUILD VERIFICATION (alchm-vite)"
echo "═══════════════════════════════════════════"

# P-01: TypeScript passes
TS_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || true)
echo "P-01 TypeScript errors: $TS_ERRORS $([ "${TS_ERRORS:-0}" -eq 0 ] && echo '✅' || echo '❌')"

# P-02: Build succeeds + build time (seconds)
BUILD_START=$(date +%s)
npm run build >/dev/null 2>&1
BUILD_OK=$?
BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))
echo "P-02 Build: $([ $BUILD_OK -eq 0 ] && echo '✅' || echo '❌') (${BUILD_TIME}s)"

# P-03: Entry point exists
ENTRY=$([ -f "dist/index.html" ] && echo 1 || echo 0)
echo "P-03 dist/index.html: $([ "$ENTRY" -eq 1 ] && echo '✅' || echo '❌')"

# P-04: Bundle size (MB)
BUNDLE_MB=$(du -sm "dist/" 2>/dev/null | cut -f1 | tr -d ' ')
echo "P-04 Bundle: ${BUNDLE_MB}MB $([ "${BUNDLE_MB:-99}" -lt 3 ] && echo '✅' || echo '⚠️  large')"

# P-05: No Next.js imports
NEXT_IMPORTS=$( (grep -r "from 'next/" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true) | wc -l | tr -d ' ')
echo "P-05 Next.js imports: $NEXT_IMPORTS $([ "$NEXT_IMPORTS" -eq 0 ] && echo '✅' || echo '❌')"

# P-06: No window.location for internal nav
WIN_LOC=$(
  (
    (grep -r "window\\.location" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || true) \
      | (grep -v "tel:\\|sms:\\|mailto:\\|typeof" || true)
  ) | wc -l | tr -d ' '
)
echo "P-06 window.location: $WIN_LOC $([ "$WIN_LOC" -eq 0 ] && echo '✅' || echo '❌')"

# P-07: Source file count (ts/tsx/css)
FILE_COUNT=$(find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) 2>/dev/null | wc -l | tr -d ' ')
echo "P-07 Source files: $FILE_COUNT $([ "$FILE_COUNT" -lt 50 ] && echo '✅' || echo '⚠️')"

# P-08: Capacitor sync
npx cap sync ios >/dev/null 2>&1
CAP_OK=$?
IOS_ENTRY=$([ -f "ios/App/App/public/index.html" ] && echo 1 || echo 0)
echo "P-08 iOS sync: $([ $CAP_OK -eq 0 ] && [ $IOS_ENTRY -eq 1 ] && echo '✅' || echo '❌')"

# P-09: No Finder-duplicate artifacts
DUPES=$(find . -name "* 2.*" -not -path "./node_modules/*" -not -path "./ios/App/App/public/*" 2>/dev/null | wc -l | tr -d ' ')
echo "P-09 Duplicate files (* 2.*): $DUPES $([ "$DUPES" -eq 0 ] && echo '✅' || echo '❌')"

# P-10: Crisis support visible in UI code
CRISIS=$( (grep -r "988\\|CrisisFooter" src/ --include="*.tsx" 2>/dev/null || true) | wc -l | tr -d ' ')
echo "P-10 Crisis resources: $CRISIS refs $([ "$CRISIS" -gt 0 ] && echo '✅' || echo '❌')"

echo ""
echo "═══════════════════════════════════════════"
