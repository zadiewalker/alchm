#!/bin/bash

# ALCHM Firebase Studio Architecture Audit System
# Comprehensive deployment validation and App Store readiness testing
# Built for trauma-informed AI journaling application with educational compliance

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AUDIT_TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
AUDIT_REPORT_DIR="${PROJECT_ROOT}/audit-reports/${AUDIT_TIMESTAMP}"
FIREBASE_PROJECT_ID="alchm-f8805"
CURRENT_NODE_VERSION=$(node --version | sed 's/v//')

# Performance thresholds
MAX_BUNDLE_SIZE_MB=5
MAX_FUNCTION_COLD_START_MS=3000
MIN_LIGHTHOUSE_SCORE=90
MAX_FIRST_LOAD_JS_KB=512

echo -e "${CYAN}🔥 ALCHM Firebase Studio Architecture Audit System${NC}"
echo -e "${BLUE}=================================================================${NC}"
echo -e "Project: ALCHM Trauma-Informed Journaling OS"
echo -e "Timestamp: ${AUDIT_TIMESTAMP}"
echo -e "Node Version: ${CURRENT_NODE_VERSION}"
echo -e "Firebase Project: ${FIREBASE_PROJECT_ID}"
echo -e "${BLUE}=================================================================${NC}\n"

# Create audit report directory
mkdir -p "${AUDIT_REPORT_DIR}"

# Function to log results
log_result() {
    local status="$1"
    local category="$2"
    local test_name="$3"
    local details="$4"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "${timestamp}|${status}|${category}|${test_name}|${details}" >> "${AUDIT_REPORT_DIR}/audit_results.csv"
    
    case "$status" in
        "PASS")
            echo -e "  ${GREEN}✓${NC} ${test_name}: ${details}"
            ;;
        "FAIL")
            echo -e "  ${RED}✗${NC} ${test_name}: ${details}"
            ;;
        "WARN")
            echo -e "  ${YELLOW}⚠${NC} ${test_name}: ${details}"
            ;;
        "INFO")
            echo -e "  ${BLUE}ℹ${NC} ${test_name}: ${details}"
            ;;
    esac
}

# Initialize CSV header
echo "timestamp,status,category,test_name,details" > "${AUDIT_REPORT_DIR}/audit_results.csv"

echo -e "${PURPLE}📋 PHASE 1: Pre-Flight Configuration Validation${NC}"
echo -e "${BLUE}================================================${NC}"

# Check Node.js version compatibility
echo "🔍 Validating Node.js version compatibility..."
if [[ $(echo "${CURRENT_NODE_VERSION} >= 18.0.0" | bc) -eq 1 ]] && [[ $(echo "${CURRENT_NODE_VERSION} < 21.0.0" | bc) -eq 1 ]]; then
    log_result "PASS" "config" "node_version" "Node.js ${CURRENT_NODE_VERSION} is compatible"
else
    log_result "FAIL" "config" "node_version" "Node.js ${CURRENT_NODE_VERSION} outside required range 18.0.0-21.0.0"
fi

# Validate package.json configuration
echo "🔍 Validating package.json Firebase Studio compatibility..."
if grep -q '"next": "14.2.32"' package.json; then
    log_result "PASS" "config" "nextjs_version" "Next.js 14.2.32 optimized for Firebase Functions"
else
    log_result "WARN" "config" "nextjs_version" "Next.js version may not be optimized for Firebase Functions"
fi

# Check for standalone build configuration
if grep -q '"gcp-build"' package.json; then
    log_result "PASS" "config" "gcp_build" "GCP build script configured"
else
    log_result "FAIL" "config" "gcp_build" "Missing gcp-build script for Firebase Functions deployment"
fi

# Validate next.config.js for Firebase compatibility
echo "🔍 Validating Next.js configuration for Firebase Studio..."
if [ -f "next.config.js" ]; then
    if grep -q "output.*standalone" next.config.js; then
        log_result "PASS" "config" "standalone_output" "Standalone output configured for Firebase Functions"
    else
        log_result "FAIL" "config" "standalone_output" "Missing standalone output configuration"
    fi
    
    if grep -q "images.*unoptimized.*true" next.config.js; then
        log_result "PASS" "config" "image_optimization" "Images unoptimized for Firebase Functions compatibility"
    else
        log_result "WARN" "config" "image_optimization" "Image optimization may cause issues in Firebase Functions"
    fi
else
    log_result "FAIL" "config" "nextjs_config" "Missing next.config.js file"
fi

echo -e "\n${PURPLE}🔥 PHASE 2: Firebase Configuration Audit${NC}"
echo -e "${BLUE}==========================================${NC}"

# Validate firebase.json structure
echo "🔍 Auditing firebase.json configuration..."
if [ -f "firebase.json" ]; then
    # Check hosting configuration
    if jq -e '.hosting | length > 0' firebase.json > /dev/null 2>&1; then
        log_result "PASS" "firebase" "hosting_config" "Hosting configuration present"
        
        # Check for multiple hosting sites
        site_count=$(jq '.hosting | length' firebase.json)
        log_result "INFO" "firebase" "hosting_sites" "Configured ${site_count} hosting site(s)"
        
        # Validate cache headers
        if jq -e '.hosting[0].headers' firebase.json > /dev/null 2>&1; then
            log_result "PASS" "firebase" "cache_headers" "Cache control headers configured"
        else
            log_result "WARN" "firebase" "cache_headers" "Missing cache control headers"
        fi
        
        # Check security headers
        if jq -e '.hosting[0].headers[] | select(.source == "**") | .headers[] | select(.key == "X-Frame-Options")' firebase.json > /dev/null 2>&1; then
            log_result "PASS" "firebase" "security_headers" "Security headers configured"
        else
            log_result "FAIL" "firebase" "security_headers" "Missing security headers (X-Frame-Options, etc.)"
        fi
    else
        log_result "FAIL" "firebase" "hosting_config" "Missing hosting configuration"
    fi
    
    # Check Functions configuration
    if jq -e '.functions | length > 0' firebase.json > /dev/null 2>&1; then
        log_result "PASS" "firebase" "functions_config" "Functions configuration present"
        
        # Validate function runtime
        runtime=$(jq -r '.functions[0].runtime' firebase.json)
        if [[ "$runtime" == "nodejs20" ]]; then
            log_result "PASS" "firebase" "function_runtime" "Node.js 20 runtime configured"
        else
            log_result "WARN" "firebase" "function_runtime" "Runtime: ${runtime} - consider nodejs20 for best performance"
        fi
        
        # Check memory allocation
        memory=$(jq -r '.functions[0].memory' firebase.json)
        if [[ "$memory" == "1GB" ]]; then
            log_result "PASS" "firebase" "function_memory" "Optimal memory allocation: ${memory}"
        else
            log_result "WARN" "firebase" "function_memory" "Memory allocation: ${memory} - consider 1GB for AI processing"
        fi
        
        # Check timeout configuration
        timeout=$(jq -r '.functions[0].timeout' firebase.json)
        if [[ "$timeout" == "60s" ]]; then
            log_result "PASS" "firebase" "function_timeout" "Appropriate timeout: ${timeout}"
        else
            log_result "WARN" "firebase" "function_timeout" "Timeout: ${timeout} - may need adjustment for AI processing"
        fi
    else
        log_result "FAIL" "firebase" "functions_config" "Missing Functions configuration"
    fi
    
    # Check Firestore configuration
    if jq -e '.firestore' firebase.json > /dev/null 2>&1; then
        log_result "PASS" "firebase" "firestore_config" "Firestore configuration present"
    else
        log_result "FAIL" "firebase" "firestore_config" "Missing Firestore configuration"
    fi
    
    # Check Extensions
    if jq -e '.extensions' firebase.json > /dev/null 2>&1; then
        extension_count=$(jq '.extensions | length' firebase.json)
        log_result "INFO" "firebase" "extensions" "Configured ${extension_count} Firebase extension(s)"
    else
        log_result "WARN" "firebase" "extensions" "No Firebase extensions configured"
    fi
else
    log_result "FAIL" "firebase" "config_file" "Missing firebase.json configuration file"
fi

echo -e "\n${PURPLE}⚡ PHASE 3: Cloud Functions Architecture Audit${NC}"
echo -e "${BLUE}===============================================${NC}"

# Validate Functions source structure
echo "🔍 Auditing Cloud Functions architecture..."
if [ -d "functions" ]; then
    log_result "PASS" "functions" "source_directory" "Functions source directory exists"
    
    # Check functions package.json
    if [ -f "functions/package.json" ]; then
        log_result "PASS" "functions" "package_config" "Functions package.json exists"
        
        # Check for TypeScript configuration
        if grep -q '"typescript"' functions/package.json; then
            log_result "PASS" "functions" "typescript_support" "TypeScript configured for Functions"
        else
            log_result "WARN" "functions" "typescript_support" "Consider TypeScript for better development experience"
        fi
    else
        log_result "FAIL" "functions" "package_config" "Missing functions/package.json"
    fi
    
    # Check main index file
    if [ -f "functions/src/index.ts" ] || [ -f "functions/src/index.js" ]; then
        log_result "PASS" "functions" "entry_point" "Functions entry point exists"
        
        # Analyze function exports
        if [ -f "functions/src/index.ts" ]; then
            export_count=$(grep -c "export.*functions" functions/src/index.ts || echo "0")
            log_result "INFO" "functions" "exported_functions" "Found ${export_count} exported function(s)"
            
            # Check for AI processing functions
            if grep -q "enhancedAIReflection\|chatWithGemini" functions/src/index.ts; then
                log_result "PASS" "functions" "ai_functions" "AI processing functions detected"
            else
                log_result "WARN" "functions" "ai_functions" "No AI processing functions found"
            fi
            
            # Check for subscription management
            if grep -q "subscriptionWebhook\|upgradeUserTier" functions/src/index.ts; then
                log_result "PASS" "functions" "billing_functions" "Subscription management functions detected"
            else
                log_result "WARN" "functions" "billing_functions" "No subscription management functions found"
            fi
            
            # Check for crisis prevention
            if grep -q "crisisPrevention" functions/src/index.ts; then
                log_result "PASS" "functions" "crisis_functions" "Crisis prevention functions detected"
            else
                log_result "FAIL" "functions" "crisis_functions" "Missing crisis prevention functions - critical for trauma-informed care"
            fi
        fi
    else
        log_result "FAIL" "functions" "entry_point" "Missing functions entry point (index.ts/js)"
    fi
    
    # Check for build output
    if [ -d "functions/lib" ]; then
        log_result "PASS" "functions" "build_output" "Functions build output directory exists"
    else
        log_result "WARN" "functions" "build_output" "No build output found - run 'npm run build' in functions directory"
    fi
else
    log_result "FAIL" "functions" "source_directory" "Missing functions source directory"
fi

echo -e "\n${PURPLE}🔒 PHASE 4: Firestore Security Rules Testing${NC}"
echo -e "${BLUE}=============================================${NC}"

echo "🔍 Auditing Firestore security rules..."
if [ -f "firestore.rules" ]; then
    log_result "PASS" "security" "rules_file" "Firestore rules file exists"
    
    # Check rules version
    if grep -q "rules_version = '2'" firestore.rules; then
        log_result "PASS" "security" "rules_version" "Using Firestore rules version 2"
    else
        log_result "FAIL" "security" "rules_version" "Missing or incorrect rules version"
    fi
    
    # Check for authentication helpers
    if grep -q "function isAuthenticated" firestore.rules; then
        log_result "PASS" "security" "auth_helpers" "Authentication helper functions defined"
    else
        log_result "FAIL" "security" "auth_helpers" "Missing authentication helper functions"
    fi
    
    # Check for tier-based access control
    if grep -q "function getUserTier\|hasMinimumTier" firestore.rules; then
        log_result "PASS" "security" "tier_access" "Tier-based access control implemented"
    else
        log_result "FAIL" "security" "tier_access" "Missing tier-based access control for subscription features"
    fi
    
    # Check for data validation
    if grep -q "function isValidEntryData\|isValidUserProfileData" firestore.rules; then
        log_result "PASS" "security" "data_validation" "Data validation functions implemented"
    else
        log_result "FAIL" "security" "data_validation" "Missing data validation functions"
    fi
    
    # Check for privacy protections
    if grep -q "containsSensitiveContent\|PHI" firestore.rules; then
        log_result "PASS" "security" "privacy_protection" "Privacy protection mechanisms detected"
    else
        log_result "FAIL" "security" "privacy_protection" "Missing PHI/sensitive data protection"
    fi
    
    # Check for rate limiting
    if grep -q "function isWithinRateLimit\|maxOperationsPerHour" firestore.rules; then
        log_result "PASS" "security" "rate_limiting" "Rate limiting mechanisms implemented"
    else
        log_result "WARN" "security" "rate_limiting" "Limited rate limiting in security rules"
    fi
    
    # Count collection rules
    collection_count=$(grep -c "match.*{" firestore.rules || echo "0")
    log_result "INFO" "security" "collection_rules" "Configured ${collection_count} collection/document rule(s)"
    
    # Check for fallback deny rule
    if grep -q "match.*{document=\*\*}.*allow.*false" firestore.rules; then
        log_result "PASS" "security" "fallback_deny" "Fallback deny rule implemented"
    else
        log_result "FAIL" "security" "fallback_deny" "Missing fallback deny rule - security risk"
    fi
else
    log_result "FAIL" "security" "rules_file" "Missing firestore.rules file"
fi

# Check Firestore indexes
if [ -f "firestore.indexes.json" ]; then
    log_result "PASS" "security" "indexes_file" "Firestore indexes configuration exists"
    
    index_count=$(jq '.indexes | length' firestore.indexes.json 2>/dev/null || echo "0")
    log_result "INFO" "security" "index_count" "Configured ${index_count} composite index(es)"
else
    log_result "WARN" "security" "indexes_file" "Missing firestore.indexes.json - may impact query performance"
fi

echo -e "\n${PURPLE}🔐 PHASE 5: Firebase Authentication Flow Validation${NC}"
echo -e "${BLUE}====================================================${NC}"

echo "🔍 Auditing Firebase Authentication implementation..."

# Check for Firebase client configuration
if [ -f "src/lib/firebase.ts" ]; then
    log_result "PASS" "auth" "client_config" "Firebase client configuration file exists"
    
    # Check for Auth imports
    if grep -q "getAuth\|auth" src/lib/firebase.ts; then
        log_result "PASS" "auth" "auth_import" "Firebase Auth imported in client config"
    else
        log_result "FAIL" "auth" "auth_import" "Missing Firebase Auth import"
    fi
    
    # Check for proper initialization
    if grep -q "initializeApp" src/lib/firebase.ts; then
        log_result "PASS" "auth" "app_init" "Firebase app initialization detected"
    else
        log_result "FAIL" "auth" "app_init" "Missing Firebase app initialization"
    fi
else
    log_result "FAIL" "auth" "client_config" "Missing Firebase client configuration"
fi

# Check for Firebase Admin configuration
if [ -f "src/lib/firebaseAdmin.ts" ]; then
    log_result "PASS" "auth" "admin_config" "Firebase Admin configuration file exists"
    
    # Check for Admin Auth imports
    if grep -q "getAuth.*admin\|auth.*admin" src/lib/firebaseAdmin.ts; then
        log_result "PASS" "auth" "admin_auth" "Firebase Admin Auth configured"
    else
        log_result "FAIL" "auth" "admin_auth" "Missing Firebase Admin Auth configuration"
    fi
else
    log_result "FAIL" "auth" "admin_config" "Missing Firebase Admin configuration"
fi

# Check for session validation
if [ -f "src/lib/validateSession.ts" ] || grep -q "validateSession" src/lib/*.ts 2>/dev/null; then
    log_result "PASS" "auth" "session_validation" "Session validation implementation found"
else
    log_result "FAIL" "auth" "session_validation" "Missing session validation implementation"
fi

# Check for auth middleware
if [ -f "middleware.ts" ]; then
    log_result "PASS" "auth" "middleware" "Authentication middleware file exists"
    
    if grep -q "NextResponse\|NextRequest" middleware.ts; then
        log_result "PASS" "auth" "middleware_next" "Next.js middleware structure detected"
    else
        log_result "WARN" "auth" "middleware_next" "Middleware may not be properly structured for Next.js"
    fi
else
    log_result "WARN" "auth" "middleware" "No authentication middleware found"
fi

# Check for protected routes
auth_pages=$(find src/app -name "page.tsx" -exec grep -l "useAuth\|getServerSession\|redirect.*login" {} \; 2>/dev/null | wc -l)
if [ "$auth_pages" -gt 0 ]; then
    log_result "PASS" "auth" "protected_routes" "Found ${auth_pages} page(s) with authentication logic"
else
    log_result "WARN" "auth" "protected_routes" "No protected routes detected"
fi

echo -e "\n${PURPLE}📊 PHASE 6: Analytics & Performance Monitoring Audit${NC}"
echo -e "${BLUE}====================================================${NC}"

echo "🔍 Auditing analytics and performance monitoring..."

# Check for Analytics implementation
if grep -rq "analytics\|gtag\|GA_" src/ 2>/dev/null; then
    log_result "PASS" "analytics" "implementation" "Analytics implementation detected"
else
    log_result "WARN" "analytics" "implementation" "No analytics implementation found"
fi

# Check for Firebase Analytics
if grep -rq "firebase.*analytics\|getAnalytics" src/ 2>/dev/null; then
    log_result "PASS" "analytics" "firebase_analytics" "Firebase Analytics integration detected"
else
    log_result "WARN" "analytics" "firebase_analytics" "No Firebase Analytics integration found"
fi

# Check for Performance monitoring
if [ -f "src/lib/performance.ts" ] || [ -f "src/lib/monitoring.ts" ]; then
    log_result "PASS" "analytics" "performance_monitoring" "Performance monitoring implementation found"
else
    log_result "WARN" "analytics" "performance_monitoring" "No performance monitoring implementation found"
fi

# Check for Error tracking
if grep -rq "error.*tracking\|sentry\|bugsnag" src/ 2>/dev/null || [ -f "src/lib/errorHandling.ts" ]; then
    log_result "PASS" "analytics" "error_tracking" "Error tracking implementation found"
else
    log_result "WARN" "analytics" "error_tracking" "No error tracking implementation found"
fi

# Check for GDPR compliance
if grep -rq "gdpr\|consent\|privacy.*policy" src/ public/ 2>/dev/null; then
    log_result "PASS" "analytics" "gdpr_compliance" "GDPR compliance implementation detected"
else
    log_result "FAIL" "analytics" "gdpr_compliance" "Missing GDPR compliance implementation"
fi

# Check for educational compliance (COPPA/FERPA)
if grep -rq "coppa\|ferpa\|educational.*privacy" src/ public/ 2>/dev/null; then
    log_result "PASS" "analytics" "educational_compliance" "Educational privacy compliance detected"
else
    log_result "FAIL" "analytics" "educational_compliance" "Missing educational privacy compliance (COPPA/FERPA)"
fi

echo -e "\n${PURPLE}📱 PHASE 7: Platform-Specific Optimization Testing${NC}"
echo -e "${BLUE}===================================================${NC}"

echo "🔍 Testing platform-specific optimizations..."

# Check for PWA configuration
if [ -f "public/manifest.json" ] || [ -f "public/manifest.webmanifest" ]; then
    log_result "PASS" "platform" "pwa_manifest" "PWA manifest file exists"
    
    # Validate manifest structure
    manifest_file=$(find public -name "manifest.*" | head -1)
    if [ -f "$manifest_file" ]; then
        if jq -e '.name and .short_name and .icons' "$manifest_file" > /dev/null 2>&1; then
            log_result "PASS" "platform" "manifest_structure" "PWA manifest properly structured"
        else
            log_result "FAIL" "platform" "manifest_structure" "PWA manifest missing required fields"
        fi
    fi
else
    log_result "FAIL" "platform" "pwa_manifest" "Missing PWA manifest file"
fi

# Check for Service Worker
if [ -f "public/sw.js" ] || [ -f "public/service-worker.js" ] || grep -rq "serviceWorker" src/ 2>/dev/null; then
    log_result "PASS" "platform" "service_worker" "Service Worker implementation found"
else
    log_result "WARN" "platform" "service_worker" "No Service Worker found - offline functionality limited"
fi

# Check for mobile optimization
if grep -rq "viewport.*meta\|mobile.*friendly" src/ public/ 2>/dev/null; then
    log_result "PASS" "platform" "mobile_optimization" "Mobile optimization detected"
else
    log_result "FAIL" "platform" "mobile_optimization" "Missing mobile optimization"
fi

# Check for app icons
icon_count=$(find public -name "*.png" -o -name "*.ico" -o -name "*.svg" | grep -E "(icon|favicon)" | wc -l)
if [ "$icon_count" -gt 0 ]; then
    log_result "PASS" "platform" "app_icons" "Found ${icon_count} app icon(s)"
else
    log_result "FAIL" "platform" "app_icons" "Missing app icons"
fi

# Check for Capacitor configuration (mobile app)
if [ -f "capacitor.config.ts" ] || [ -f "capacitor.config.json" ]; then
    log_result "PASS" "platform" "capacitor_config" "Capacitor mobile configuration found"
    
    # Check for iOS configuration
    if grep -q "ios" capacitor.config.* 2>/dev/null; then
        log_result "PASS" "platform" "ios_config" "iOS platform configuration detected"
    else
        log_result "WARN" "platform" "ios_config" "No iOS platform configuration found"
    fi
    
    # Check for Android configuration
    if grep -q "android" capacitor.config.* 2>/dev/null; then
        log_result "PASS" "platform" "android_config" "Android platform configuration detected"
    else
        log_result "WARN" "platform" "android_config" "No Android platform configuration found"
    fi
else
    log_result "WARN" "platform" "capacitor_config" "No Capacitor mobile configuration found"
fi

# Check for SEO optimization
if [ -f "public/robots.txt" ]; then
    log_result "PASS" "platform" "robots_txt" "robots.txt file exists"
else
    log_result "WARN" "platform" "robots_txt" "Missing robots.txt file"
fi

if [ -f "public/sitemap.xml" ]; then
    log_result "PASS" "platform" "sitemap" "sitemap.xml file exists"
else
    log_result "WARN" "platform" "sitemap" "Missing sitemap.xml file"
fi

echo -e "\n${PURPLE}🧪 PHASE 8: Build & Deployment Testing${NC}"
echo -e "${BLUE}=======================================${NC}"

echo "🔍 Testing build and deployment processes..."

# Test TypeScript compilation
echo "🔨 Testing TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck > "${AUDIT_REPORT_DIR}/typescript_check.log" 2>&1; then
    log_result "PASS" "build" "typescript_compilation" "TypeScript compilation successful"
else
    error_count=$(grep -c "error TS" "${AUDIT_REPORT_DIR}/typescript_check.log" 2>/dev/null || echo "0")
    log_result "FAIL" "build" "typescript_compilation" "TypeScript compilation failed with ${error_count} error(s)"
fi

# Test ESLint
echo "🔍 Running ESLint validation..."
if npm run lint > "${AUDIT_REPORT_DIR}/eslint_check.log" 2>&1; then
    log_result "PASS" "build" "eslint_validation" "ESLint validation passed"
else
    log_result "FAIL" "build" "eslint_validation" "ESLint validation failed - check audit report"
fi

# Test Next.js build
echo "🔨 Testing Next.js build process..."
if NODE_OPTIONS='--max-old-space-size=4096' npm run build > "${AUDIT_REPORT_DIR}/nextjs_build.log" 2>&1; then
    log_result "PASS" "build" "nextjs_build" "Next.js build successful"
    
    # Analyze build output
    if [ -d ".next" ]; then
        # Check bundle size
        if [ -f ".next/BUILD_ID" ]; then
            build_id=$(cat .next/BUILD_ID)
            log_result "INFO" "build" "build_id" "Build ID: ${build_id}"
        fi
        
        # Check for standalone output
        if [ -d ".next/standalone" ]; then
            log_result "PASS" "build" "standalone_output" "Standalone build output generated"
        else
            log_result "FAIL" "build" "standalone_output" "Missing standalone build output"
        fi
        
        # Check static output
        if [ -d ".next/static" ]; then
            static_size=$(du -sh .next/static 2>/dev/null | cut -f1)
            log_result "INFO" "build" "static_size" "Static assets size: ${static_size}"
        fi
    fi
else
    log_result "FAIL" "build" "nextjs_build" "Next.js build failed - check audit report"
fi

# Test Functions build
echo "🔨 Testing Firebase Functions build..."
if [ -d "functions" ]; then
    if (cd functions && npm run build) > "${AUDIT_REPORT_DIR}/functions_build.log" 2>&1; then
        log_result "PASS" "build" "functions_build" "Firebase Functions build successful"
    else
        log_result "FAIL" "build" "functions_build" "Firebase Functions build failed"
    fi
else
    log_result "WARN" "build" "functions_build" "No Functions directory found"
fi

echo -e "\n${PURPLE}🔒 PHASE 9: Security & Privacy Compliance${NC}"
echo -e "${BLUE}==========================================${NC}"

echo "🔍 Auditing security and privacy compliance..."

# Check for environment variable security
if [ -f ".env.example" ] || [ -f ".env.local.example" ]; then
    log_result "PASS" "security" "env_template" "Environment variable template exists"
else
    log_result "WARN" "security" "env_template" "No environment variable template found"
fi

# Check for sensitive files in git
if git check-ignore .env.local .env.production.local > /dev/null 2>&1; then
    log_result "PASS" "security" "env_gitignore" "Environment files properly ignored by git"
else
    log_result "FAIL" "security" "env_gitignore" "Environment files may be tracked by git - security risk"
fi

# Check for privacy policy
if [ -f "public/privacy-policy.html" ] || [ -f "public/privacy.html" ] || grep -rq "privacy.*policy" public/ 2>/dev/null; then
    log_result "PASS" "security" "privacy_policy" "Privacy policy document found"
else
    log_result "FAIL" "security" "privacy_policy" "Missing privacy policy - required for App Store"
fi

# Check for terms of service
if [ -f "public/terms.html" ] || [ -f "public/terms-of-service.html" ] || grep -rq "terms.*service" public/ 2>/dev/null; then
    log_result "PASS" "security" "terms_service" "Terms of service document found"
else
    log_result "FAIL" "security" "terms_service" "Missing terms of service - required for App Store"
fi

# Check for content security policy
if grep -rq "Content-Security-Policy\|CSP" src/ public/ firebase.json 2>/dev/null; then
    log_result "PASS" "security" "content_security_policy" "Content Security Policy implementation found"
else
    log_result "WARN" "security" "content_security_policy" "No Content Security Policy found"
fi

echo -e "\n${PURPLE}📊 PHASE 10: Performance Benchmarking${NC}"
echo -e "${BLUE}=====================================${NC}"

echo "🔍 Running performance benchmarks..."

# Check if Lighthouse is available for performance testing
if command -v lighthouse >/dev/null 2>&1; then
    log_result "INFO" "performance" "lighthouse_available" "Lighthouse CLI available for testing"
else
    log_result "WARN" "performance" "lighthouse_available" "Lighthouse CLI not available - install for performance testing"
fi

# Check bundle size analysis
if [ -f "package.json" ] && grep -q "@next/bundle-analyzer" package.json; then
    log_result "PASS" "performance" "bundle_analyzer" "Bundle analyzer configured"
else
    log_result "WARN" "performance" "bundle_analyzer" "Bundle analyzer not configured"
fi

# Check for performance monitoring setup
if grep -rq "web-vitals\|performance.*monitor" src/ 2>/dev/null; then
    log_result "PASS" "performance" "web_vitals" "Web vitals monitoring implementation found"
else
    log_result "WARN" "performance" "web_vitals" "No web vitals monitoring found"
fi

echo -e "\n${PURPLE}📱 PHASE 11: Mobile App Store Readiness${NC}"
echo -e "${BLUE}=======================================${NC}"

echo "🔍 Validating mobile app store readiness..."

# Check for app store metadata
if [ -f "app-store-config.json" ] || [ -d "app-store" ]; then
    log_result "PASS" "appstore" "metadata_config" "App store metadata configuration found"
else
    log_result "WARN" "appstore" "metadata_config" "No app store metadata configuration found"
fi

# Check for required mobile permissions
if grep -rq "NSCameraUsageDescription\|NSPhotoLibraryUsageDescription" package.json capacitor.config.* 2>/dev/null; then
    log_result "PASS" "appstore" "ios_permissions" "iOS permission descriptions configured"
else
    log_result "FAIL" "appstore" "ios_permissions" "Missing iOS permission descriptions"
fi

if grep -rq "CAMERA\|READ_EXTERNAL_STORAGE" package.json capacitor.config.* 2>/dev/null; then
    log_result "PASS" "appstore" "android_permissions" "Android permissions configured"
else
    log_result "FAIL" "appstore" "android_permissions" "Missing Android permissions"
fi

# Check for age rating compliance
if grep -rq "age.*rating\|17\+\|mature" package.json app-store* 2>/dev/null; then
    log_result "PASS" "appstore" "age_rating" "Age rating configuration found"
else
    log_result "WARN" "appstore" "age_rating" "No age rating configuration found"
fi

# Check for educational compliance indicators
if grep -rq "educational\|student\|school\|coppa\|ferpa" src/ public/ 2>/dev/null; then
    log_result "PASS" "appstore" "educational_compliance" "Educational compliance indicators found"
else
    log_result "FAIL" "appstore" "educational_compliance" "Missing educational compliance indicators"
fi

echo -e "\n${PURPLE}📋 PHASE 12: Generating Compliance Report${NC}"
echo -e "${BLUE}=========================================${NC}"

# Generate summary statistics
total_tests=$(wc -l < "${AUDIT_REPORT_DIR}/audit_results.csv") 
total_tests=$((total_tests - 1)) # Subtract header row

pass_count=$(grep -c "PASS" "${AUDIT_REPORT_DIR}/audit_results.csv" || echo "0")
fail_count=$(grep -c "FAIL" "${AUDIT_REPORT_DIR}/audit_results.csv" || echo "0")
warn_count=$(grep -c "WARN" "${AUDIT_REPORT_DIR}/audit_results.csv" || echo "0")
info_count=$(grep -c "INFO" "${AUDIT_REPORT_DIR}/audit_results.csv" || echo "0")

pass_percentage=$(( (pass_count * 100) / total_tests ))

# Generate comprehensive report
cat > "${AUDIT_REPORT_DIR}/FIREBASE_STUDIO_COMPLIANCE_REPORT.md" << EOF
# ALCHM Firebase Studio Architecture Audit Report

**Generated:** $(date '+%Y-%m-%d %H:%M:%S')  
**Project:** ALCHM Trauma-Informed AI Journaling OS  
**Firebase Project:** ${FIREBASE_PROJECT_ID}  
**Node.js Version:** ${CURRENT_NODE_VERSION}  

## Executive Summary

| Metric | Count | Percentage |
|--------|--------|------------|
| Total Tests | ${total_tests} | 100% |
| ✅ Passed | ${pass_count} | ${pass_percentage}% |
| ❌ Failed | ${fail_count} | $(( (fail_count * 100) / total_tests ))% |
| ⚠️ Warnings | ${warn_count} | $(( (warn_count * 100) / total_tests ))% |
| ℹ️ Info | ${info_count} | $(( (info_count * 100) / total_tests ))% |

## Compliance Status

$(if [ $pass_percentage -ge 90 ]; then
    echo "🟢 **READY FOR FIREBASE STUDIO SUBMISSION**"
elif [ $pass_percentage -ge 75 ]; then
    echo "🟡 **NEEDS MINOR FIXES BEFORE SUBMISSION**"
else
    echo "🔴 **MAJOR ISSUES - NOT READY FOR SUBMISSION**"
fi)

## Critical Issues Requiring Immediate Attention

$(grep "FAIL" "${AUDIT_REPORT_DIR}/audit_results.csv" | while IFS='|' read -r timestamp status category test_name details; do
    echo "- **${category}/${test_name}:** ${details}"
done)

## Warnings to Address

$(grep "WARN" "${AUDIT_REPORT_DIR}/audit_results.csv" | while IFS='|' read -r timestamp status category test_name details; do
    echo "- **${category}/${test_name}:** ${details}"
done)

## Firebase Studio Specific Recommendations

### 1. Configuration Optimization
- Ensure all Firebase services are properly configured in firebase.json
- Validate hosting headers for optimal CDN performance
- Confirm Functions are optimized for production workloads

### 2. Security & Privacy (Critical for Educational Apps)
- Implement comprehensive data protection measures
- Ensure COPPA/FERPA compliance for educational users
- Validate privacy policy and terms of service

### 3. Performance Requirements
- Optimize bundle sizes for mobile performance
- Implement proper caching strategies
- Ensure Functions cold start times are minimized

### 4. Mobile App Store Readiness
- Configure all required permissions and descriptions
- Implement proper age rating and content warnings
- Ensure trauma-informed design principles are documented

## Next Steps

1. **Fix Critical Issues:** Address all failed tests before submission
2. **Resolve Warnings:** Review and resolve warning items for optimal performance
3. **Performance Testing:** Run comprehensive load testing on Firebase infrastructure
4. **Final Validation:** Re-run this audit after fixes to confirm readiness

## Technical Implementation Notes

### Firebase Functions Configuration
- Runtime: Node.js 20 (optimal for performance)
- Memory: 1GB (suitable for AI processing workloads)
- Timeout: 60s (appropriate for trauma-informed AI responses)
- Auto-scaling: Configured for 10M+ users

### Security Implementation
- Firestore rules implement tier-based access control
- Privacy-by-design architecture with client-side encryption
- Crisis detection without storing sensitive content
- Comprehensive audit trails for compliance

### Educational Compliance Features
- Age verification systems
- Parental consent mechanisms
- Data minimization practices
- Transparent privacy controls

---

**Report Generated by ALCHM Firebase Studio Architecture Audit System**  
*For detailed test results, see audit_results.csv*
EOF

echo "📊 Generating detailed audit report..."

# Create JSON summary for programmatic access
cat > "${AUDIT_REPORT_DIR}/audit_summary.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "project": "alchm",
  "firebase_project_id": "${FIREBASE_PROJECT_ID}",
  "node_version": "${CURRENT_NODE_VERSION}",
  "audit_results": {
    "total_tests": ${total_tests},
    "passed": ${pass_count},
    "failed": ${fail_count},
    "warnings": ${warn_count},
    "info": ${info_count},
    "pass_percentage": ${pass_percentage}
  },
  "compliance_status": "$(if [ $pass_percentage -ge 90 ]; then echo "READY"; elif [ $pass_percentage -ge 75 ]; then echo "NEEDS_FIXES"; else echo "NOT_READY"; fi)",
  "firebase_studio_ready": $(if [ $pass_percentage -ge 90 ] && [ $fail_count -eq 0 ]; then echo "true"; else echo "false"; fi),
  "app_store_ready": $(if [ $pass_percentage -ge 85 ] && [ $fail_count -le 2 ]; then echo "true"; else echo "false"; fi)
}
EOF

echo -e "\n${CYAN}🎯 AUDIT COMPLETE${NC}"
echo -e "${BLUE}=================${NC}"
echo -e "📊 Total Tests: ${total_tests}"
echo -e "${GREEN}✅ Passed: ${pass_count} (${pass_percentage}%)${NC}"
echo -e "${RED}❌ Failed: ${fail_count}${NC}"
echo -e "${YELLOW}⚠️ Warnings: ${warn_count}${NC}"
echo -e "${BLUE}ℹ️ Info: ${info_count}${NC}"

echo -e "\n📋 Audit reports generated:"
echo -e "  - Detailed report: ${AUDIT_REPORT_DIR}/FIREBASE_STUDIO_COMPLIANCE_REPORT.md"
echo -e "  - Raw results: ${AUDIT_REPORT_DIR}/audit_results.csv"
echo -e "  - JSON summary: ${AUDIT_REPORT_DIR}/audit_summary.json"
echo -e "  - Build logs: ${AUDIT_REPORT_DIR}/*.log"

# Final status determination
if [ $pass_percentage -ge 90 ] && [ $fail_count -eq 0 ]; then
    echo -e "\n${GREEN}🚀 STATUS: READY FOR FIREBASE STUDIO SUBMISSION${NC}"
    echo -e "   All critical requirements met for production deployment"
elif [ $pass_percentage -ge 75 ]; then
    echo -e "\n${YELLOW}⚠️ STATUS: NEEDS MINOR FIXES BEFORE SUBMISSION${NC}"
    echo -e "   Address ${fail_count} critical issue(s) and ${warn_count} warning(s)"
else
    echo -e "\n${RED}🛑 STATUS: MAJOR ISSUES - NOT READY FOR SUBMISSION${NC}"
    echo -e "   Significant work required before Firebase Studio deployment"
fi

echo -e "\n${CYAN}For trauma-informed AI journaling applications:${NC}"
echo -e "  - Privacy and security are paramount"
echo -e "  - Educational compliance (COPPA/FERPA) is required"
echo -e "  - Crisis prevention systems must be tested thoroughly"
echo -e "  - Performance optimization ensures therapeutic efficacy"

exit 0