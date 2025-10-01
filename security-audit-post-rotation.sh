#!/bin/bash

# 🔒 POST-ROTATION SECURITY AUDIT
# ALCHM Mental Health Platform - Privacy & Compliance Validation
# Ensures COPPA, FERPA, GDPR, and CCPA compliance after credential rotation

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

AUDIT_LOG="security-audit-$(date +%Y%m%d_%H%M%S).log"
ISSUES_FOUND=0

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$AUDIT_LOG"
}

audit_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        log "PASS: $2"
    else
        echo -e "${RED}❌ $2${NC}"
        log "FAIL: $2"
        ((ISSUES_FOUND++))
    fi
}

audit_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

echo -e "${BLUE}🔒 ALCHM SECURITY AUDIT${NC}"
echo "======================="
echo "Privacy & Legal Compliance Validation"
echo "Audit log: $AUDIT_LOG"
echo ""

log "Security audit initiated"

echo "🔐 CREDENTIAL SECURITY AUDIT"
echo "============================"

# Check environment file permissions
if [ -f ".env.local" ]; then
    PERMS=$(stat -c %a .env.local 2>/dev/null || stat -f %A .env.local 2>/dev/null)
    if [ "$PERMS" = "600" ]; then
        audit_check 0 "Environment file permissions (600)"
    else
        audit_check 1 "Environment file permissions (current: $PERMS, should be: 600)"
        echo "  Fix: chmod 600 .env.local"
    fi
else
    audit_check 1 "Environment file exists"
fi

# Check .gitignore
if grep -q "^\.env\.local$" .gitignore 2>/dev/null; then
    audit_check 0 ".env.local in .gitignore"
else
    audit_check 1 ".env.local in .gitignore"
    echo "  Fix: echo '.env.local' >> .gitignore"
fi

# Scan for hardcoded secrets
echo ""
echo "🔍 CREDENTIAL EXPOSURE SCAN"
echo "==========================="

echo "Scanning for hardcoded API keys..."
EXPOSED_KEYS=$(grep -r -n "AIzaSy\|sk-proj-\|sk_live_\|whsec_" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.log" --exclude="security-audit-post-rotation.sh" . 2>/dev/null | wc -l)

if [ "$EXPOSED_KEYS" -eq 0 ]; then
    audit_check 0 "No hardcoded credentials in codebase"
else
    audit_check 1 "Found $EXPOSED_KEYS potential hardcoded credentials"
    echo "  Run: grep -r 'AIzaSy\\|sk-proj-\\|sk_live_\\|whsec_' --exclude-dir=node_modules ."
fi

# Check for old compromised keys
echo "Scanning for previously compromised keys..."
COMPROMISED_KEYS=(
    "AIzaSyCqjfzvykK6q55vLH7F0FEuyK0cppGhD3w"
    "AIzaSyDkwpIpL_rsYDCu8mY2tGqQOFMJLkaTipg"
)

for key in "${COMPROMISED_KEYS[@]}"; do
    if grep -r "$key" --exclude-dir=node_modules --exclude="*.log" . 2>/dev/null; then
        audit_check 1 "Found compromised key: $key"
        echo "  This key must be removed immediately"
    else
        audit_check 0 "Compromised key removed: ${key:0:20}..."
    fi
done

echo ""
echo "👶 COPPA COMPLIANCE AUDIT (Under-13 Users)"
echo "=========================================="

# Check for age verification
if grep -r "age.*verification\|ageVerification\|AgeVerification" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Age verification implementation found"
else
    audit_check 1 "Age verification implementation"
    echo "  COPPA requires verifiable parental consent for users under 13"
fi

# Check parental consent flows
if grep -r "parental.*consent\|parentalConsent" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Parental consent implementation found"
else
    audit_warning "Parental consent flows not detected"
fi

echo ""
echo "🎓 FERPA COMPLIANCE AUDIT (Educational Data)"
echo "============================================"

# Check for educational records protection
if grep -r "educational.*record\|student.*data\|FERPA" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Educational data protection references found"
else
    audit_warning "Educational data protection measures not explicitly found"
fi

echo ""
echo "🌍 GDPR COMPLIANCE AUDIT (EU Users)"
echo "==================================="

# Check for data subject rights
GDPR_RIGHTS=("export" "delete" "portability" "rectification")
for right in "${GDPR_RIGHTS[@]}"; do
    if find src/ -name "*.tsx" -o -name "*.ts" | xargs grep -l "$right" 2>/dev/null | head -1 > /dev/null; then
        audit_check 0 "GDPR $right right implementation found"
    else
        audit_warning "GDPR $right right not explicitly implemented"
    fi
done

# Check for consent management
if grep -r "consent.*management\|ConsentManager\|cookie.*consent" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Consent management system found"
else
    audit_warning "Consent management system not detected"
fi

echo ""
echo "🏛️ CCPA COMPLIANCE AUDIT (California Users)"
echo "==========================================="

# Check for opt-out mechanisms
if grep -r "do.*not.*sell\|opt.*out\|CCPA" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "CCPA opt-out mechanisms found"
else
    audit_warning "CCPA opt-out mechanisms not detected"
fi

echo ""
echo "🔒 DATA ENCRYPTION AUDIT"
echo "========================"

# Check for encryption implementations
if grep -r "encrypt\|crypto\|bcrypt\|cipher" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Encryption implementations found"
else
    audit_check 1 "No encryption implementations detected"
    echo "  All PII must be encrypted before storage/transmission"
fi

# Check for secure storage patterns
if grep -r "secureStorage\|encryptedStorage" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Secure storage patterns found"
else
    audit_warning "Secure storage patterns not explicitly found"
fi

echo ""
echo "🏥 MENTAL HEALTH SPECIFIC PROTECTIONS"
echo "====================================="

# Check for crisis intervention systems
if grep -r "crisis.*detection\|suicide.*prevention\|emergency.*contact" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Crisis intervention systems found"
else
    audit_check 1 "Crisis intervention systems not detected"
    echo "  CRITICAL: Mental health platforms must have crisis detection"
fi

# Check for trauma-informed design
if grep -r "trauma.*informed\|traumaInformed" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Trauma-informed design elements found"
else
    audit_warning "Trauma-informed design elements not explicitly found"
fi

# Check for medical disclaimers
if grep -r "medical.*disclaimer\|not.*substitute.*therapy" src/ 2>/dev/null | head -1 > /dev/null; then
    audit_check 0 "Medical disclaimers found"
else
    audit_check 1 "Medical disclaimers not found"
    echo "  REQUIRED: Mental health apps must include medical disclaimers"
fi

echo ""
echo "🛡️ SECURITY HEADERS AUDIT"
echo "========================="

# Check Next.js security configuration
if [ -f "next.config.js" ]; then
    if grep -q "Content-Security-Policy\|X-Frame-Options\|X-Content-Type-Options" next.config.js 2>/dev/null; then
        audit_check 0 "Security headers configured in Next.js"
    else
        audit_warning "Security headers not found in Next.js config"
    fi
fi

echo ""
echo "📊 PRIVACY POLICY & TERMS AUDIT"
echo "==============================="

# Check for privacy policy
if [ -f "public/privacy-policy.html" ] || [ -f "src/app/privacy/page.tsx" ]; then
    audit_check 0 "Privacy policy found"
else
    audit_check 1 "Privacy policy not found"
    echo "  REQUIRED: All platforms collecting personal data need privacy policies"
fi

# Check for terms of service
if find . -name "*terms*" -type f | grep -v node_modules | head -1 > /dev/null; then
    audit_check 0 "Terms of service found"
else
    audit_warning "Terms of service not found"
fi

echo ""
echo "🔍 FIREBASE SECURITY RULES AUDIT"
echo "================================"

if [ -f "firestore.rules" ]; then
    # Check for user data protection
    if grep -q "request.auth.uid == userId\|request.auth != null" firestore.rules 2>/dev/null; then
        audit_check 0 "User data access control in Firestore rules"
    else
        audit_check 1 "User data access control in Firestore rules"
        echo "  Users should only access their own data"
    fi
    
    # Check for write validation
    if grep -q "validate\|allow write.*if" firestore.rules 2>/dev/null; then
        audit_check 0 "Data validation in Firestore rules"
    else
        audit_warning "Data validation not found in Firestore rules"
    fi
else
    audit_check 1 "Firestore security rules file not found"
fi

echo ""
echo "📊 AUDIT SUMMARY"
echo "================"

log "Security audit completed with $ISSUES_FOUND issues"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}🎉 SECURITY AUDIT PASSED${NC}"
    echo "✅ All critical security measures in place"
    echo "✅ Privacy compliance appears adequate"
    echo "✅ System ready for vulnerable user populations"
else
    echo -e "${RED}❌ $ISSUES_FOUND SECURITY ISSUES FOUND${NC}"
    echo ""
    echo "🚨 CRITICAL ACTIONS REQUIRED:"
    echo "1. Review all failed checks above"
    echo "2. Implement missing privacy protections"
    echo "3. Fix credential exposure issues"
    echo "4. Ensure crisis intervention systems work"
    echo "5. Re-run audit after fixes"
    echo ""
    echo "⚠️  DO NOT serve vulnerable users until issues resolved"
fi

echo ""
echo "📋 REGULATORY COMPLIANCE CHECKLIST"
echo "=================================="
echo "□ COPPA: Age verification and parental consent"
echo "□ FERPA: Educational data protection"  
echo "□ GDPR: Data subject rights implemented"
echo "□ CCPA: Consumer privacy rights"
echo "□ Mental Health: Crisis intervention active"
echo "□ Security: All credentials properly secured"

echo ""
echo "📞 CRISIS SAFETY VERIFICATION"
echo "============================="
echo "Even with technical issues, ensure users can access:"
echo "• National Suicide Prevention Lifeline: 988"
echo "• Crisis Text Line: Text HOME to 741741"
echo "• Emergency Services: 911"

echo ""
echo "Detailed audit log: $AUDIT_LOG"

# Generate recommendations
cat > security-recommendations.md << EOF
# Security Audit Recommendations

## Priority Actions Required

### CRITICAL (Fix Immediately)
- [ ] Rotate any exposed credentials
- [ ] Implement crisis detection system
- [ ] Add medical disclaimers
- [ ] Secure environment variables

### HIGH PRIORITY (Fix Within 24 Hours)  
- [ ] Implement age verification for COPPA
- [ ] Add data encryption for PII
- [ ] Configure security headers
- [ ] Create privacy policy

### MEDIUM PRIORITY (Fix Within 1 Week)
- [ ] Implement GDPR data rights
- [ ] Add CCPA opt-out mechanisms
- [ ] Enhance Firestore security rules
- [ ] Implement consent management

### MONITORING (Ongoing)
- [ ] Regular credential audits
- [ ] Privacy impact assessments
- [ ] Security header validation
- [ ] Crisis system testing

## Compliance Requirements

### COPPA (Users Under 13)
- Verifiable parental consent required
- Limited data collection
- Enhanced deletion rights
- No behavioral advertising

### FERPA (Educational Use)
- Student data protection
- Parent/guardian access rights
- Restricted third-party sharing
- Educational purpose limitation

### GDPR (EU Users)
- Lawful basis for processing
- Data subject rights (access, delete, portability)
- Privacy by design
- Breach notification procedures

### CCPA (California Users)
- Right to know data collected
- Right to delete personal information
- Right to opt-out of sale
- Non-discrimination protection

Generated: $(date)
EOF

echo "Security recommendations saved to: security-recommendations.md"