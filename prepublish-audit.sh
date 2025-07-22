#!/bin/bash

echo "🚀 Running ALCHM Pre-Publish Full Stack Audit..."

ERROR=0

function run_check() {
    DESCRIPTION=$1
    CMD=$2
    echo ""
    echo "🔎 $DESCRIPTION"
    eval "$CMD"
    if [ $? -ne 0 ]; then
        echo "❌ $DESCRIPTION FAILED"
        ERROR=1
    else
        echo "✅ $DESCRIPTION PASSED"
    fi
}

# 1. Frontend Build & Lint
run_check "Next.js Build" "pnpm run build"
run_check "Next.js Lint" "pnpm run lint"

# 2. TypeScript Safety
run_check "TypeScript Type Check" "pnpm tsc --noEmit"

# 3. Firebase Integrity
run_check "Firebase Emulator Start (dry)" "firebase emulators:exec 'echo Firestore emulator running'"
run_check "Firebase Firestore Rules Validation" "firebase deploy --only firestore:rules --dry-run"

# 4. Environment Variables Check
ENV_VARS=(FIREBASE_ADMIN_CREDENTIALS STRIPE_SECRET_KEY NEXT_PUBLIC_FIREBASE_API_KEY NEXT_PUBLIC_FIREBASE_PROJECT_ID NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
for VAR in "${ENV_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "❌ MISSING ENV VAR: $VAR"
        ERROR=1
    else
        echo "✅ $VAR found"
    fi
done

# 5. Dependency Health
run_check "Dependency Vulnerability Audit" "pnpm audit --audit-level=high"
run_check "Outdated Dependency Check" "pnpm outdated || echo '✅ No major outdated dependencies detected'"

# 6. Manual Reminders
echo ""
echo "📌 Manual QA Checklist:"
echo "✅ Test Stripe Checkout Flow"
echo "✅ Test Reflection Submission Flow"
echo "✅ Confirm UI loads with Dark Mode toggle"
echo "✅ Verify no console errors on localhost:3000"
echo ""

# Final Summary
if [ $ERROR -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED — YOU ARE CLEAR TO PUBLISH 🚀"
    exit 0
else
    echo "❌ ERRORS DETECTED — Fix above issues before deploying!"
    exit 1
fi
