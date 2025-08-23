#!/bin/bash

# Security Rules and Permissions Audit Script for ALCHM
# This script audits Firebase security rules and access permissions

echo "🔒 ALCHM Security Rules & Permissions Audit"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to increment counters
increment_counter() {
    local status=$1
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    case $status in
        "pass") PASSED_CHECKS=$((PASSED_CHECKS + 1)) ;;
        "fail") FAILED_CHECKS=$((FAILED_CHECKS + 1)) ;;
        "warn") WARNING_CHECKS=$((WARNING_CHECKS + 1)) ;;
    esac
}

# Function to check Firebase CLI authentication
check_firebase_auth() {
    echo -e "\n${BLUE}🔐 Firebase Authentication Check${NC}"
    
    if ! command -v firebase >/dev/null 2>&1; then
        echo -e "${RED}❌ Firebase CLI not found${NC}"
        echo "   Install with: npm install -g firebase-tools"
        increment_counter "fail"
        return 1
    fi
    
    echo -e "${GREEN}✅ Firebase CLI available${NC}"
    increment_counter "pass"
    
    # Check authentication
    if firebase projects:list >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Firebase authentication successful${NC}"
        increment_counter "pass"
        
        # Get current project
        local current_project=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}' || echo "none")
        if [ "$current_project" != "none" ]; then
            echo "  📍 Current project: $current_project"
        fi
        return 0
    else
        echo -e "${RED}❌ Firebase authentication failed${NC}"
        echo "   Run: firebase login"
        increment_counter "fail"
        return 1
    fi
}

# Function to audit Firestore security rules
audit_firestore_rules() {
    echo -e "\n${BLUE}🗄️ Firestore Security Rules Audit${NC}"
    
    if [ -f "firestore.rules" ]; then
        echo -e "${GREEN}✅ Firestore rules file found${NC}"
        increment_counter "pass"
        
        echo "🔍 Analyzing Firestore security rules..."
        
        # Check for overly permissive rules
        echo -e "\n📋 Security Analysis:"
        
        # Check for allow read, write without conditions
        local open_rules=$(grep -n "allow read, write" firestore.rules | grep -v "if" | wc -l)
        if [ "$open_rules" -gt 0 ]; then
            echo -e "${RED}❌ Found $open_rules completely open rules (allow read, write without conditions)${NC}"
            grep -n "allow read, write" firestore.rules | grep -v "if"
            increment_counter "fail"
        else
            echo -e "${GREEN}✅ No completely open rules found${NC}"
            increment_counter "pass"
        fi
        
        # Check for authentication requirements
        local auth_checks=$(grep -c "request.auth != null" firestore.rules)
        if [ "$auth_checks" -gt 0 ]; then
            echo -e "${GREEN}✅ Authentication checks found: $auth_checks${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No authentication checks found${NC}"
            increment_counter "warn"
        fi
        
        # Check for user ownership validation
        local ownership_checks=$(grep -c "request.auth.uid" firestore.rules)
        if [ "$ownership_checks" -gt 0 ]; then
            echo -e "${GREEN}✅ User ownership checks found: $ownership_checks${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No user ownership validation found${NC}"
            increment_counter "warn"
        fi
        
        # Check for data validation
        local validation_checks=$(grep -c "request.resource.data" firestore.rules)
        if [ "$validation_checks" -gt 0 ]; then
            echo -e "${GREEN}✅ Data validation checks found: $validation_checks${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No data validation found${NC}"
            increment_counter "warn"
        fi
        
        # Check for common security patterns
        echo -e "\n🔍 Common Security Patterns:"
        
        # Check for proper collection security
        if grep -q "journals" firestore.rules; then
            echo -e "${GREEN}✅ Journal collection security rules found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No specific journal collection rules${NC}"
            increment_counter "warn"
        fi
        
        # Check for admin/system rules
        if grep -q "admin" firestore.rules || grep -q "system" firestore.rules; then
            echo -e "${GREEN}✅ Admin/system collection rules found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No admin/system collection rules${NC}"
            increment_counter "warn"
        fi
        
        # Check for time-based restrictions
        if grep -q "request.time" firestore.rules; then
            echo -e "${GREEN}✅ Time-based restrictions found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No time-based restrictions${NC}"
            increment_counter "warn"
        fi
        
        # Test rules syntax
        echo -e "\n🧪 Testing rules syntax..."
        if firebase firestore:rules:list >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Rules syntax appears valid${NC}"
            increment_counter "pass"
        else
            echo -e "${RED}❌ Rules syntax validation failed${NC}"
            increment_counter "fail"
        fi
        
    else
        echo -e "${RED}❌ Firestore rules file not found${NC}"
        echo "   Create firestore.rules file with proper security rules"
        increment_counter "fail"
    fi
}

# Function to audit Storage security rules
audit_storage_rules() {
    echo -e "\n${BLUE}📁 Storage Security Rules Audit${NC}"
    
    if [ -f "storage.rules" ]; then
        echo -e "${GREEN}✅ Storage rules file found${NC}"
        increment_counter "pass"
        
        echo "🔍 Analyzing Storage security rules..."
        
        # Check for authentication requirements
        local auth_checks=$(grep -c "request.auth != null" storage.rules)
        if [ "$auth_checks" -gt 0 ]; then
            echo -e "${GREEN}✅ Authentication checks found: $auth_checks${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No authentication checks found${NC}"
            increment_counter "warn"
        fi
        
        # Check for file size restrictions
        if grep -q "size" storage.rules; then
            echo -e "${GREEN}✅ File size restrictions found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No file size restrictions${NC}"
            increment_counter "warn"
        fi
        
        # Check for file type restrictions
        if grep -q "contentType" storage.rules; then
            echo -e "${GREEN}✅ File type restrictions found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No file type restrictions${NC}"
            increment_counter "warn"
        fi
        
    else
        echo -e "${YELLOW}⚠️  Storage rules file not found${NC}"
        echo "   Consider creating storage.rules if using Firebase Storage"
        increment_counter "warn"
    fi
}

# Function to check Firebase project configuration
check_firebase_project_config() {
    echo -e "\n${BLUE}⚙️ Firebase Project Configuration${NC}"
    
    # Check firebase.json configuration
    if [ -f "firebase.json" ]; then
        echo -e "${GREEN}✅ firebase.json found${NC}"
        increment_counter "pass"
        
        # Check for security configuration
        if grep -q "rules" firebase.json; then
            echo -e "${GREEN}✅ Rules configuration found in firebase.json${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No rules configuration in firebase.json${NC}"
            increment_counter "warn"
        fi
        
        # Check for hosting security headers
        if grep -q "headers" firebase.json; then
            echo -e "${GREEN}✅ Security headers configured${NC}"
            increment_counter "pass"
            
            # Check for specific security headers
            if grep -A 10 "headers" firebase.json | grep -q "X-Frame-Options"; then
                echo -e "${GREEN}✅ X-Frame-Options header configured${NC}"
                increment_counter "pass"
            else
                echo -e "${YELLOW}⚠️  X-Frame-Options header missing${NC}"
                increment_counter "warn"
            fi
            
            if grep -A 10 "headers" firebase.json | grep -q "X-Content-Type-Options"; then
                echo -e "${GREEN}✅ X-Content-Type-Options header configured${NC}"
                increment_counter "pass"
            else
                echo -e "${YELLOW}⚠️  X-Content-Type-Options header missing${NC}"
                increment_counter "warn"
            fi
            
        else
            echo -e "${YELLOW}⚠️  No security headers configured${NC}"
            increment_counter "warn"
        fi
        
    else
        echo -e "${RED}❌ firebase.json not found${NC}"
        increment_counter "fail"
    fi
}

# Function to check authentication configuration
check_auth_configuration() {
    echo -e "\n${BLUE}👤 Authentication Configuration${NC}"
    
    # Check for environment variables
    if [ ! -z "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" ]; then
        echo -e "${GREEN}✅ Auth domain configured${NC}"
        increment_counter "pass"
    else
        echo -e "${RED}❌ Auth domain not configured${NC}"
        increment_counter "fail"
    fi
    
    # Check for proper auth domain format
    if [[ "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" == *.firebaseapp.com ]]; then
        echo -e "${GREEN}✅ Auth domain format is correct${NC}"
        increment_counter "pass"
    else
        echo -e "${YELLOW}⚠️  Auth domain format may be incorrect${NC}"
        increment_counter "warn"
    fi
    
    # Authentication security recommendations
    echo -e "\n${BLUE}🔐 Authentication Security Recommendations${NC}"
    echo "  • Enable multi-factor authentication for admin accounts"
    echo "  • Implement proper session management"
    echo "  • Use Firebase App Check for additional protection"
    echo "  • Monitor for suspicious authentication patterns"
    echo "  • Implement account lockout policies"
    echo "  • Use secure password requirements"
}

# Function to check API security
check_api_security() {
    echo -e "\n${BLUE}🔌 API Security Configuration${NC}"
    
    # Check for API routes with authentication
    if [ -d "src/app/api" ]; then
        echo -e "${GREEN}✅ API routes directory found${NC}"
        increment_counter "pass"
        
        local api_files=$(find src/app/api -name "route.ts" -o -name "route.js" | wc -l)
        echo "  📊 API route files found: $api_files"
        
        # Check for authentication in API routes
        local auth_routes=$(grep -r "validateSession\|auth" src/app/api --include="*.ts" --include="*.js" | wc -l)
        if [ "$auth_routes" -gt 0 ]; then
            echo -e "${GREEN}✅ Authentication checks found in API routes${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No authentication checks found in API routes${NC}"
            increment_counter "warn"
        fi
        
        # Check for rate limiting
        if grep -r "rateLimit\|throttle" src/app/api --include="*.ts" --include="*.js" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Rate limiting implementation found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No rate limiting found${NC}"
            increment_counter "warn"
        fi
        
        # Check for input validation
        if grep -r "validate\|schema\|zod" src/app/api --include="*.ts" --include="*.js" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Input validation found${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No input validation found${NC}"
            increment_counter "warn"
        fi
        
    else
        echo -e "${YELLOW}⚠️  No API routes directory found${NC}"
        increment_counter "warn"
    fi
}

# Function to check environment security
check_environment_security() {
    echo -e "\n${BLUE}🌐 Environment Security${NC}"
    
    # Check for proper environment configuration
    if [ -f ".env.local" ]; then
        echo "🔍 Checking environment security..."
        
        # Check for secrets exposure
        if grep -q "PRIVATE_KEY" .env.local; then
            echo -e "${YELLOW}⚠️  Private keys found in environment${NC}"
            echo "   Ensure these are properly secured"
            increment_counter "warn"
        fi
        
        # Check for production vs development keys
        if [ "$NODE_ENV" = "production" ]; then
            if grep -q "test" .env.local; then
                echo -e "${RED}❌ Test keys found in production environment${NC}"
                increment_counter "fail"
            else
                echo -e "${GREEN}✅ No test keys in production environment${NC}"
                increment_counter "pass"
            fi
        fi
        
        # Check for API key restrictions
        echo -e "${YELLOW}⚠️  Verify API keys have proper restrictions in Firebase Console${NC}"
        increment_counter "warn"
        
    else
        echo -e "${YELLOW}⚠️  No .env.local file found${NC}"
        increment_counter "warn"
    fi
}

# Function to generate security rules templates
generate_security_templates() {
    echo -e "\n${BLUE}📝 Generating Security Rules Templates${NC}"
    
    # Generate comprehensive Firestore rules template
    cat > firestore.rules.template << 'EOF'
// Firestore Security Rules Template for ALCHM
// Production-ready security rules with proper authentication and authorization

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions for authentication and authorization
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidUser() {
      return isAuthenticated() && request.auth.uid != null;
    }
    
    function isValidTimestamp(timestamp) {
      return timestamp is timestamp;
    }
    
    function isValidString(str, minLength, maxLength) {
      return str is string && str.size() >= minLength && str.size() <= maxLength;
    }
    
    // User profiles - users can only access their own profile
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
      
      // Validate user data structure
      allow create, update: if isAuthenticated() && isOwner(userId)
        && request.resource.data.keys().hasAll(['email', 'createdAt', 'updatedAt'])
        && isValidString(request.resource.data.email, 5, 100)
        && isValidTimestamp(request.resource.data.createdAt)
        && isValidTimestamp(request.resource.data.updatedAt);
    }
    
    // Journal entries - users can only access their own journals
    match /journals/{journalId} {
      allow read, write: if isAuthenticated() 
        && resource.data.userId == request.auth.uid;
      
      allow create: if isAuthenticated()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.keys().hasAll(['userId', 'content', 'createdAt', 'updatedAt'])
        && isValidString(request.resource.data.content, 1, 10000)
        && isValidTimestamp(request.resource.data.createdAt)
        && isValidTimestamp(request.resource.data.updatedAt);
      
      allow update: if isAuthenticated()
        && resource.data.userId == request.auth.uid
        && request.resource.data.userId == request.auth.uid
        && isValidTimestamp(request.resource.data.updatedAt);
      
      allow delete: if isAuthenticated() 
        && resource.data.userId == request.auth.uid;
    }
    
    // User sessions - for session management
    match /sessions/{sessionId} {
      allow read, write: if isAuthenticated() 
        && resource.data.userId == request.auth.uid;
      
      allow create: if isAuthenticated()
        && request.resource.data.userId == request.auth.uid
        && isValidTimestamp(request.resource.data.createdAt)
        && isValidTimestamp(request.resource.data.expiresAt);
    }
    
    // Error logs - only allow creation for authenticated users
    match /errorLogs/{logId} {
      allow create: if isAuthenticated()
        && request.resource.data.keys().hasAll(['timestamp', 'level', 'message'])
        && isValidTimestamp(request.resource.data.timestamp);
      
      // Only admins can read error logs (implement admin check as needed)
      allow read: if false; // Implement admin authorization
    }
    
    // Health checks - allow system to create health check documents
    match /health_checks/{checkId} {
      allow create: if true; // System health checks
      allow read: if false;  // Prevent public access
      allow delete: if true; // Allow cleanup
    }
    
    // System configuration - read-only for authenticated users
    match /system/{doc} {
      allow read: if isAuthenticated();
      allow write: if false; // Only allow through admin SDK
    }
    
    // Analytics data - users can only access their own analytics
    match /analytics/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
    
    // Subscription data - users can only access their own subscription
    match /subscriptions/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if false; // Only allow through admin SDK for security
    }
    
    // Default deny rule - explicitly deny access to any other documents
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
EOF

    echo -e "${GREEN}✅ Firestore rules template created: firestore.rules.template${NC}"
    
    # Generate Storage rules template
    cat > storage.rules.template << 'EOF'
// Storage Security Rules Template for ALCHM
// Production-ready storage rules with proper authentication and file validation

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidImageSize() {
      return resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    function isValidImageType() {
      return resource.contentType.matches('image/.*');
    }
    
    function isValidDocumentType() {
      return resource.contentType in ['application/pdf', 'text/plain', 'application/msword'];
    }
    
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if isAuthenticated(); // Profile images can be read by any authenticated user
      allow write: if isAuthenticated() && isOwner(userId) 
        && isValidImageSize() && isValidImageType();
      allow delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Journal attachments
    match /journals/{userId}/attachments/{fileName} {
      allow read, write, delete: if isAuthenticated() && isOwner(userId)
        && (isValidImageType() || isValidDocumentType())
        && resource.size < 10 * 1024 * 1024; // 10MB limit for journal attachments
    }
    
    // Temporary uploads
    match /temp/{userId}/{fileName} {
      allow write: if isAuthenticated() && isOwner(userId)
        && resource.size < 20 * 1024 * 1024; // 20MB limit for temp files
      allow read, delete: if isAuthenticated() && isOwner(userId);
    }
    
    // System files - only allow admin access
    match /system/{fileName} {
      allow read, write: if false; // Only admin SDK access
    }
    
    // Default deny rule
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
EOF

    echo -e "${GREEN}✅ Storage rules template created: storage.rules.template${NC}"
    
    # Generate security checklist
    cat > security-checklist.md << 'EOF'
# ALCHM Security Checklist

## Firestore Security Rules ✅
- [ ] Authentication required for all user data access
- [ ] User ownership validation (users can only access their own data)
- [ ] Data validation for all write operations
- [ ] Proper field validation (string lengths, required fields)
- [ ] Timestamp validation for audit trails
- [ ] Rate limiting considerations in rules
- [ ] Admin-only access for system collections
- [ ] Default deny rule at the end

## Storage Security Rules ✅
- [ ] Authentication required for all uploads
- [ ] File size limits enforced
- [ ] File type restrictions (images, documents only)
- [ ] User ownership validation for file access
- [ ] Separate permissions for read/write/delete
- [ ] Temporary file cleanup mechanisms
- [ ] Admin-only access for system files

## API Security ✅
- [ ] Authentication middleware on protected routes
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] CORS configuration properly set
- [ ] Error handling doesn't expose sensitive information
- [ ] Logging of security events
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention measures

## Environment Security ✅
- [ ] Secrets not committed to version control
- [ ] Production vs development key separation
- [ ] API key restrictions configured in Firebase Console
- [ ] Environment variables properly secured
- [ ] Private keys stored securely
- [ ] Regular key rotation schedule
- [ ] Access logs monitored

## Authentication Security ✅
- [ ] Strong password requirements
- [ ] Multi-factor authentication enabled
- [ ] Session timeout configured
- [ ] Account lockout policies
- [ ] Suspicious activity monitoring
- [ ] Email verification required
- [ ] Password reset security
- [ ] Social login security (if used)

## Network Security ✅
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured (HSTS, X-Frame-Options, etc.)
- [ ] CSP (Content Security Policy) implemented
- [ ] Firebase App Check enabled
- [ ] CDN security configured
- [ ] DNS security (DNSSEC if applicable)

## Data Protection ✅
- [ ] Personal data encryption at rest
- [ ] Data retention policies defined
- [ ] Data deletion procedures
- [ ] Backup security measures
- [ ] GDPR compliance (if applicable)
- [ ] Data access logging
- [ ] Data anonymization for analytics

## Monitoring & Incident Response ✅
- [ ] Security event logging
- [ ] Real-time alerting for security issues
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented
- [ ] Security team contact information
- [ ] Backup and recovery procedures tested
- [ ] Vulnerability assessment schedule

## Development Security ✅
- [ ] Secure coding practices followed
- [ ] Code review process includes security
- [ ] Dependency vulnerability scanning
- [ ] Regular security updates applied
- [ ] Security testing in CI/CD pipeline
- [ ] Staging environment security
- [ ] Production deployment security

## Compliance & Documentation ✅
- [ ] Privacy policy updated and accessible
- [ ] Terms of service clearly defined
- [ ] Security documentation maintained
- [ ] Compliance requirements met
- [ ] Security training for team members
- [ ] Regular policy reviews scheduled
EOF

    echo -e "${GREEN}✅ Security checklist created: security-checklist.md${NC}"
}

# Load environment variables if available
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

# Main execution
check_firebase_auth

if [ $? -eq 0 ]; then
    audit_firestore_rules
    audit_storage_rules
    check_firebase_project_config
    check_auth_configuration
    check_api_security
    check_environment_security
    generate_security_templates
fi

# Summary
echo -e "\n${BLUE}📊 Security Rules & Permissions Audit Summary${NC}"
echo "================================================"
echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"

# Recommendations
echo -e "\n${BLUE}💡 Security Recommendations${NC}"
echo "================================================"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ Security configuration appears solid${NC}"
else
    echo -e "${RED}❌ $FAILED_CHECKS critical security issues found. Address immediately.${NC}"
fi

if [ $WARNING_CHECKS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNING_CHECKS security improvements recommended.${NC}"
fi

echo ""
echo "🔒 Security Best Practices:"
echo "  • Implement principle of least privilege"
echo "  • Regular security rule audits and testing"
echo "  • Monitor for unusual access patterns"
echo "  • Keep authentication systems updated"
echo "  • Implement proper session management"
echo "  • Use Firebase App Check for additional protection"
echo "  • Regular security training for development team"

echo ""
echo "📋 Next Steps:"
echo "  1. Address any failed security checks above"
echo "  2. Implement recommended security templates"
echo "  3. Test security rules in Firebase Console"
echo "  4. Set up security monitoring and alerting"
echo "  5. Schedule regular security audits"
echo "  6. Review and update security documentation"

# Exit with appropriate code
if [ $FAILED_CHECKS -eq 0 ]; then
    exit 0
else
    exit 1
fi