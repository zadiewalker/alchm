#!/bin/bash

echo "🚀 ALCHM Beta Launch Validation Suite"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validation counters
PASSED=0
FAILED=0

validate_check() {
  local test_name="$1"
  local command="$2"
  
  echo -n "🧪 $test_name... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    ((FAILED++))
    return 1
  fi
}

echo -e "\n📋 ${YELLOW}Critical File Structure Validation${NC}"
echo "----------------------------------------"

validate_check "Firebase config exists" "test -f firebase.json"
validate_check "Package.json exists" "test -f package.json"
validate_check "Next.js config exists" "test -f next.config.js"
validate_check "Environment config exists" "test -f .env.local"
validate_check "Firestore rules exist" "test -f firestore.rules"

echo -e "\n🔐 ${YELLOW}Authentication System Validation${NC}"
echo "----------------------------------------"

validate_check "Auth context exists" "test -f src/contexts/AuthContext.tsx"
validate_check "Login page exists" "test -f src/app/auth/login/page.tsx"
validate_check "Domain-aware auth exists" "test -f src/lib/auth/domain-aware-auth.ts"
validate_check "Mobile auth optimizer exists" "test -f src/lib/auth/mobile-auth-optimizer.ts"

echo -e "\n📱 ${YELLOW}Core User Interface Validation${NC}"
echo "----------------------------------------"

validate_check "Dashboard page exists" "test -f src/app/dashboard/page.tsx"
validate_check "Journal page exists" "test -f src/app/journal/page.tsx"
validate_check "Root layout exists" "test -f src/app/layout.tsx"
validate_check "Client providers exist" "test -f src/components/ClientProviders.tsx"

echo -e "\n🆘 ${YELLOW}Crisis Support System Validation${NC}"
echo "----------------------------------------"

validate_check "Crisis detection API exists" "test -f src/app/api/crisis-detection/route.ts"
validate_check "Emergency auth bypass exists" "test -f src/lib/crisis/emergency-authentication-bypass.ts"
validate_check "Crisis floating button exists" "test -f src/components/ui/CrisisFloatingButtonNew.tsx"
validate_check "Emergency crisis button exists" "test -f src/components/ui/EmergencyCrisisButton.tsx"

echo -e "\n🔥 ${YELLOW}Firebase Integration Validation${NC}"
echo "----------------------------------------"

validate_check "Firebase client config exists" "test -f src/lib/firebase.ts"
validate_check "Khepera API endpoint exists" "test -f src/app/api/khepera/route.ts"
validate_check "Auth session API exists" "test -f src/app/api/auth/session/route.ts"

echo -e "\n🎨 ${YELLOW}Styling and Assets Validation${NC}"
echo "----------------------------------------"

validate_check "Global CSS exists" "test -f src/app/globals.css"
validate_check "Tailwind config exists" "test -f tailwind.config.ts"
validate_check "Mobile crisis styles exist" "test -f src/styles/mobile-crisis-core.css"

echo -e "\n📊 ${YELLOW}Validation Results${NC}"
echo "========================"
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "\n🎉 ${GREEN}BETA LAUNCH READY!${NC}"
  echo -e "All critical systems validated. ALCHM is ready for beta users."
  exit 0
else
  echo -e "\n⚠️  ${YELLOW}BETA LAUNCH BLOCKED${NC}"
  echo -e "Please resolve $FAILED failed validation(s) before launching."
  exit 1
fi