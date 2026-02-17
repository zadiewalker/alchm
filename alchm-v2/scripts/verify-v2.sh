#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

echo "==========================================="
echo "ALCHM v2 — 37-Finding Verification"
echo "Project: $ROOT_DIR"
echo "Date: $(date)"
echo "==========================================="

pass=0
fail=0

ok() { echo "✅ $1"; pass=$((pass+1)); }
bad() { echo "❌ $1"; fail=$((fail+1)); }
info() { echo "ℹ️  $1"; }

echo ""
echo "=== F01: Duplicate '* 2.*' files ==="
# Ignore generated artifacts (.next/out/ios). This check is about Finder duplicates in source/config.
F1="$(find . -name "* 2.*" \
  -not -path './node_modules/*' \
  -not -path './.git/*' \
  -not -path './.next/*' \
  -not -path './out/*' \
  -not -path './ios/*' \
  | wc -l | tr -d ' ')"
echo "Count: $F1"
if [ "$F1" = "0" ]; then
  ok "F01 duplicates"
else
  bad "F01 duplicates"
  find . -name "* 2.*" \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './.next/*' \
    -not -path './out/*' \
    -not -path './ios/*' \
    -print
fi

echo ""
echo "=== Build (clean) ==="
rm -rf .next out 2>/dev/null || true
if npm run build >/tmp/alchm-v2-build.log 2>&1; then
  ok "Build succeeds"
else
  bad "Build fails"
  tail -120 /tmp/alchm-v2-build.log || true
fi
PAGES="$(find out -name "index.html" 2>/dev/null | wc -l | tr -d ' ')"
echo "Pages: $PAGES"

echo ""
echo "=== F28: Built pages >= 12 ==="
if [ "$PAGES" -ge 12 ] 2>/dev/null; then ok "F28 pages"; else bad "F28 pages"; fi

echo ""
echo "=== F02: TypeScript errors (strict) ==="
TS_ERRS="$(npx tsc --noEmit 2>&1 | grep -c "error TS" || true)"
TS_ERRS="$(echo "$TS_ERRS" | tr -d '[:space:]')"
echo "TS errors: $TS_ERRS"
if [ "$TS_ERRS" = "0" ]; then ok "F02 TypeScript"; else bad "F02 TypeScript"; npx tsc --noEmit 2>&1 | head -80; fi

echo ""
echo "=== F03: Dead directories absent ==="
F3=0
for dir in cultural middleware policies security monitoring ai examples __tests__ admin; do
  if [ -d "src/$dir" ]; then
    echo "Present: src/$dir"
    F3=$((F3+1))
  fi
done
echo "Count: $F3"
if [ "$F3" = "0" ]; then ok "F03 dead directories"; else bad "F03 dead directories"; fi

echo ""
echo "=== F04: Dead lib files absent ==="
F4=0
for f in stripe.ts openaiWithRateLimit.ts hipaaAuditLogger.ts advancedAI.ts firebaseAdmin.ts aiService.ts; do
  if [ -f "src/lib/$f" ]; then
    echo "Present: src/lib/$f"
    F4=$((F4+1))
  fi
done
echo "Count: $F4"
if [ "$F4" = "0" ]; then ok "F04 dead lib"; else bad "F04 dead lib"; fi

echo ""
echo "=== F05: Dead middleware files absent ==="
F5=0
[ -f "src/middleware.ts" ] && F5=$((F5+1))
[ -f "src/middleware-legal.ts" ] && F5=$((F5+1))
echo "Count: $F5"
if [ "$F5" = "0" ]; then ok "F05 middleware"; else bad "F05 middleware"; fi

echo ""
echo "=== F07: API routes absent (static export) ==="
F7=0
[ -d "src/app/api" ] && F7=$((F7+1))
[ -d "src/app/api.disabled" ] && F7=$((F7+1))
echo "Count: $F7"
if [ "$F7" = "0" ]; then ok "F07 api routes"; else bad "F07 api routes"; fi

echo ""
echo "=== F08: Debug/admin routes not exported ==="
F8=0
for route in test test-hooks test-simple debug-hooks debug-react admin api; do
  if [ -d "out/$route" ]; then
    echo "Present in out/: $route"
    F8=$((F8+1))
  fi
done
echo "Count: $F8"
if [ "$F8" = "0" ]; then ok "F08 debug routes"; else bad "F08 debug routes"; fi

echo ""
echo "=== F09: window.location internal navigation ==="
F9="$(grep -R --line-number "window\\.location" src 2>/dev/null | grep -v "tel:" | grep -v "sms:" | grep -v "mailto:" | grep -v "typeof window" | wc -l | tr -d ' ')"
echo "Count: $F9"
if [ "$F9" = "0" ]; then ok "F09 window.location"; else bad "F09 window.location"; grep -R --line-number "window\\.location" src 2>/dev/null | head -40; fi

echo ""
echo "=== F10: Direct localStorage access outside src/lib/storage.ts ==="
F10="$(grep -R --line-number "localStorage\\." src 2>/dev/null | grep -v "src/lib/storage.ts" | wc -l | tr -d ' ')"
echo "Count: $F10"
if [ "$F10" = "0" ]; then ok "F10 localStorage"; else bad "F10 localStorage"; grep -R --line-number "localStorage\\." src 2>/dev/null | grep -v "src/lib/storage.ts" | head -60; fi

echo ""
echo "=== F11: console.log in source ==="
F11="$(grep -R --line-number "console\\.log" src 2>/dev/null | wc -l | tr -d ' ')"
echo "Count: $F11"
if [ "$F11" = "0" ]; then ok "F11 console.log"; else bad "F11 console.log"; grep -R --line-number "console\\.log" src 2>/dev/null | head -60; fi

echo ""
echo "=== F12: Hardcoded API keys in src ==="
F12="$(grep -R --line-number -E "sk-ant|sk_live|pk_live|sk_test|pk_test" src 2>/dev/null | wc -l | tr -d ' ')"
echo "Count: $F12"
if [ "$F12" = "0" ]; then ok "F12 hardcoded keys"; else bad "F12 hardcoded keys"; grep -R --line-number -E "sk-ant|sk_live|pk_live|sk_test|pk_test" src 2>/dev/null | head -40; fi

echo ""
echo "=== F13: Non-public process.env usage in client code ==="
F13="$(grep -R --line-number "process\\.env\\." src 2>/dev/null | grep -v "NEXT_PUBLIC_" | grep -v "NODE_ENV" | wc -l | tr -d ' ')"
echo "Count: $F13"
if [ "$F13" = "0" ]; then ok "F13 env vars"; else bad "F13 env vars"; grep -R --line-number "process\\.env\\." src 2>/dev/null | head -60; fi

echo ""
echo "=== F14: Sentry references in src ==="
F14="$(grep -R --line-number -E "sentry|Sentry|@sentry" src 2>/dev/null | wc -l | tr -d ' ')"
echo "Count: $F14"
if [ "$F14" = "0" ]; then ok "F14 Sentry"; else bad "F14 Sentry"; grep -R --line-number -E "sentry|Sentry|@sentry" src 2>/dev/null | head -40; fi

echo ""
echo "=== F15: Files with hooks must have 'use client' ==="
F15=0
while IFS= read -r f; do
  hooks="$(grep -c -E "useState\\(|useEffect\\(|useRouter\\(|useCallback\\(|useRef\\(|useMemo\\(|useContext\\(" "$f" 2>/dev/null || true)"
  client="$(grep -c "'use client'" "$f" 2>/dev/null || true)"
  hooks="${hooks:-0}"
  client="${client:-0}"
  if [ "$hooks" -gt 0 ] && [ "$client" -eq 0 ]; then
    echo "Missing 'use client': $f"
    F15=$((F15+1))
  fi
done < <(find src -name "*.tsx" -not -path "*/node_modules/*" | sort)
echo "Count: $F15"
if [ "$F15" = "0" ]; then ok "F15 use client"; else bad "F15 use client"; fi

echo ""
echo "=== F16: Health disclaimer present ==="
F16="$(grep -R -l -E "not.*therapist|not.*medical|not.*counselor" src 2>/dev/null | wc -l | tr -d ' ')"
echo "Files: $F16"
if [ "$F16" -ge 2 ] 2>/dev/null; then ok "F16 disclaimer"; else bad "F16 disclaimer"; fi

echo ""
echo "=== F17: AI disclosure present ==="
F17="$(grep -R -l -E "artificial intelligence|AI companion|AI-generated" src 2>/dev/null | wc -l | tr -d ' ')"
echo "Files: $F17"
if [ "$F17" -ge 1 ] 2>/dev/null; then ok "F17 AI disclosure"; else bad "F17 AI disclosure"; fi

echo ""
echo "=== F18/F19: Privacy + Terms pages exist ==="
F18=0; F19=0
[ -f "src/app/privacy/page.tsx" ] && F18=1
[ -f "src/app/terms/page.tsx" ] && F19=1
echo "privacy=$F18 terms=$F19"
if [ "$F18" = "1" ]; then ok "F18 privacy"; else bad "F18 privacy"; fi
if [ "$F19" = "1" ]; then ok "F19 terms"; else bad "F19 terms"; fi

echo ""
echo "=== F20: Fake purchase logic ==="
F20="$(grep -R --line-number -E "localStorage.*purchase|localStorage.*subscription|localStorage.*tier.*paid" src 2>/dev/null | wc -l | tr -d ' ')"
echo "Count: $F20"
if [ "$F20" = "0" ]; then ok "F20 fake purchases"; else bad "F20 fake purchases"; fi

echo ""
echo "=== F21: 988 accessible from root layout ==="
F21="$(grep -c -E "988|CrisisFooter" src/app/layout.tsx 2>/dev/null || echo 0)"
echo "Count: $F21"
if [ "$F21" -ge 1 ] 2>/dev/null; then ok "F21 988 layout"; else bad "F21 988 layout"; fi

echo ""
echo "=== F22: Accessibility labels ==="
F22="$(grep -R --line-number "aria-label" src 2>/dev/null | wc -l | tr -d ' ')"
echo "aria-label count: $F22"
if [ "$F22" -ge 20 ] 2>/dev/null; then ok "F22 a11y"; else bad "F22 a11y"; fi

echo ""
echo "=== F23: Capacitor config has no server override ==="
F23="$(grep -n -E "^[[:space:]]*server[[:space:]]*:" capacitor.config.ts 2>/dev/null | wc -l | tr -d ' ')"
echo "server overrides: $F23"
if [ "$F23" = "0" ]; then ok "F23 server.url"; else bad "F23 server.url"; grep -n -E "^[[:space:]]*server[[:space:]]*:" capacitor.config.ts 2>/dev/null; fi

echo ""
echo "=== F24: Loading states exist on non-legal pages ==="
F24=0
while IFS= read -r f; do
  route="$(echo "$f" | sed 's|^src/app||;s|/page.tsx$||;s|^$|/|')"
  # Privacy/Terms are static legal pages.
  echo "$route" | grep -qE "^/(privacy|terms)/?$" && continue
  # Skip routes that are intentionally static / do not load data.
  if [ "$route" = "/" ] || [ "$route" = "/pricing" ] || [ "$route" = "/pricing/" ] || [ "$route" = "/onboarding" ] || [ "$route" = "/onboarding/" ]; then
    continue
  fi

  # Many routes render their loading state in a client component, not in page.tsx.
  # Check all TSX in the route folder.
  route_dir="$(dirname "$f")"
  has="$(grep -R -h -E "LoadingState|state === 'loading'|PageState" "$route_dir" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')"
  if [ "$has" -eq 0 ]; then
    echo "No loading marker: $route ($route_dir)"
    F24=$((F24+1))
  fi
done < <(find src/app -name "page.tsx" | sort)
echo "Count: $F24"
if [ "$F24" = "0" ]; then ok "F24 loading states"; else bad "F24 loading states"; fi

echo ""
echo "=== F25: Khepera prompt safety rails ==="
therapist="$(grep -c -E "not.*therapist|not.*counselor|not.*medical" src/lib/khepera.ts 2>/dev/null || echo 0)"
crisis988="$(grep -c "988" src/lib/khepera.ts 2>/dev/null || echo 0)"
aiid="$(grep -c -E "artificial intelligence|AI companion" src/lib/khepera.ts 2>/dev/null || echo 0)"
echo "therapist=$therapist 988=$crisis988 ai=$aiid"
if [ "$therapist" -ge 1 ] && [ "$crisis988" -ge 1 ] && [ "$aiid" -ge 1 ]; then ok "F25 prompt safety"; else bad "F25 prompt safety"; fi

echo ""
echo "=== F26: Orphan files (lib/components/hooks must be imported) ==="
F26=0
while IFS= read -r f; do
  rel="${f#src/}"
  mod="@/${rel%.*}"
  if ! grep -R -E -q "from[[:space:]]+['\\\"]${mod}['\\\"]|import\\([[:space:]]*['\\\"]${mod}['\\\"]" src 2>/dev/null; then
    echo "Orphan: $f (expected import: $mod)"
    F26=$((F26+1))
  fi
done < <(find src/lib src/components src/hooks -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | sort)
echo "Count: $F26"
if [ "$F26" = "0" ]; then ok "F26 orphans"; else bad "F26 orphans"; fi

echo ""
echo "=== F27: src file count under 60 ==="
F27="$(find src -type f | wc -l | tr -d ' ')"
echo "src files: $F27"
if [ "$F27" -lt 60 ] 2>/dev/null; then ok "F27 file count"; else bad "F27 file count"; fi

echo ""
echo "=== F31: Dead type files absent ==="
F31=0
for f in career-schema.ts identity-pathway-schema.ts; do
  [ -f "src/types/$f" ] && F31=$((F31+1))
done
echo "Count: $F31"
if [ "$F31" = "0" ]; then ok "F31 dead types"; else bad "F31 dead types"; fi

echo ""
echo "=== F32: No telemetry in layout ==="
F32="$(grep -c -E "Telemetry|telemetry" src/app/layout.tsx 2>/dev/null || true)"
F32="$(echo "$F32" | tr -d '[:space:]')"
echo "Count: $F32"
if [ "$F32" = "0" ]; then ok "F32 telemetry"; else bad "F32 telemetry"; fi

echo ""
echo "=== F33/F34: No BlockInProduction, no page-original ==="
F33=0; F34=0
[ -f "src/components/BlockInProduction.tsx" ] && F33=1
[ -f "src/app/page-original.tsx" ] && F34=1
echo "BlockInProduction=$F33 page-original=$F34"
if [ "$F33" = "0" ]; then ok "F33 BlockInProduction"; else bad "F33 BlockInProduction"; fi
if [ "$F34" = "0" ]; then ok "F34 page-original"; else bad "F34 page-original"; fi

echo ""
echo "=== F35: viewport-fit=cover present ==="
F35="$(grep -c -E "viewportFit|viewport-fit=cover|viewport-fit" src/app/layout.tsx 2>/dev/null || echo 0)"
echo "Count: $F35"
if [ "$F35" -ge 1 ] 2>/dev/null; then ok "F35 viewport-fit"; else bad "F35 viewport-fit"; fi

echo ""
echo "=== F36: Safe area CSS rules present ==="
F36="$(grep -R -h "safe-area-inset" src/app/globals.css src/styles/mobile.css 2>/dev/null | wc -l | tr -d ' ')"
echo "Count: $F36"
if [ "$F36" -ge 4 ] 2>/dev/null; then ok "F36 safe area"; else bad "F36 safe area"; fi

echo ""
echo "=== F37: App Store metadata doc present ==="
F37=0
[ -f "APP_STORE_METADATA.md" ] && F37=1
echo "Present: $F37"
if [ "$F37" = "1" ]; then ok "F37 metadata"; else bad "F37 metadata"; fi

echo ""
echo "=== F29: iOS sync + pages ==="
if npx cap sync ios >/tmp/alchm-v2-cap-sync.log 2>&1; then
  ok "iOS sync succeeds"
else
  bad "iOS sync fails"
  tail -120 /tmp/alchm-v2-cap-sync.log || true
fi
IOS_PAGES="$(find ios/App/App/public -name "index.html" 2>/dev/null | wc -l | tr -d ' ')"
echo "iOS pages: $IOS_PAGES"
if [ "$IOS_PAGES" -ge 12 ] 2>/dev/null; then ok "F29 iOS pages"; else bad "F29 iOS pages"; fi

echo ""
echo "==========================================="
echo "RESULT"
echo "==========================================="
echo "PASSED: $pass"
echo "FAILED: $fail"
if [ "$fail" = "0" ]; then
  echo "✅ ALL CHECKS PASSED"
  exit 0
else
  echo "❌ SOME CHECKS FAILED"
  exit 1
fi
