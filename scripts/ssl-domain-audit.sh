#!/bin/bash

# SSL Certificates and Custom Domains Audit Script for ALCHM
# This script verifies SSL certificates and custom domain configuration

echo "🔒 ALCHM SSL Certificates & Custom Domains Audit"
echo "================================================="

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

# Function to check SSL certificate
check_ssl_certificate() {
    local domain=$1
    local description=$2
    
    echo -e "\n${BLUE}🔍 Checking SSL Certificate for $description${NC}"
    echo "Domain: $domain"
    
    # Check if domain resolves
    if ! nslookup "$domain" >/dev/null 2>&1; then
        echo -e "${RED}❌ Domain does not resolve${NC}"
        increment_counter "fail"
        return 1
    fi
    
    echo -e "${GREEN}✅ Domain resolves${NC}"
    increment_counter "pass"
    
    # Check SSL certificate using OpenSSL
    if command -v openssl >/dev/null 2>&1; then
        echo "🔍 Checking SSL certificate details..."
        
        # Get certificate information
        local cert_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates -subject -issuer 2>/dev/null)
        
        if [ $? -eq 0 ] && [ ! -z "$cert_info" ]; then
            echo -e "${GREEN}✅ SSL certificate found${NC}"
            increment_counter "pass"
            
            # Parse certificate details
            local not_before=$(echo "$cert_info" | grep "notBefore" | cut -d= -f2-)
            local not_after=$(echo "$cert_info" | grep "notAfter" | cut -d= -f2-)
            local subject=$(echo "$cert_info" | grep "subject" | cut -d= -f2-)
            local issuer=$(echo "$cert_info" | grep "issuer" | cut -d= -f2-)
            
            echo "  📅 Valid from: $not_before"
            echo "  📅 Valid until: $not_after"
            echo "  🏢 Subject: $subject"
            echo "  🏛️  Issuer: $issuer"
            
            # Check certificate expiration
            local expiry_date=$(date -d "$not_after" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$not_after" +%s 2>/dev/null)
            local current_date=$(date +%s)
            local days_until_expiry=$(( (expiry_date - current_date) / 86400 ))
            
            if [ $days_until_expiry -lt 0 ]; then
                echo -e "${RED}❌ Certificate has EXPIRED${NC}"
                increment_counter "fail"
            elif [ $days_until_expiry -lt 30 ]; then
                echo -e "${YELLOW}⚠️  Certificate expires in $days_until_expiry days${NC}"
                increment_counter "warn"
            else
                echo -e "${GREEN}✅ Certificate valid for $days_until_expiry more days${NC}"
                increment_counter "pass"
            fi
            
        else
            echo -e "${RED}❌ No valid SSL certificate found${NC}"
            increment_counter "fail"
        fi
    else
        echo -e "${YELLOW}⚠️  OpenSSL not available, skipping certificate details${NC}"
        increment_counter "warn"
    fi
    
    # Check HTTPS redirect
    echo "🔍 Checking HTTP to HTTPS redirect..."
    if command -v curl >/dev/null 2>&1; then
        local redirect_test=$(curl -s -I -L "http://$domain" | head -n 1)
        if echo "$redirect_test" | grep -q "301\|302"; then
            echo -e "${GREEN}✅ HTTP redirects to HTTPS${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  HTTP may not redirect to HTTPS${NC}"
            increment_counter "warn"
        fi
    fi
    
    # Check security headers
    echo "🔍 Checking security headers..."
    if command -v curl >/dev/null 2>&1; then
        local headers=$(curl -s -I "https://$domain" 2>/dev/null)
        
        # Check for important security headers
        if echo "$headers" | grep -qi "strict-transport-security"; then
            echo -e "${GREEN}✅ HSTS header present${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  HSTS header missing${NC}"
            increment_counter "warn"
        fi
        
        if echo "$headers" | grep -qi "x-frame-options"; then
            echo -e "${GREEN}✅ X-Frame-Options header present${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  X-Frame-Options header missing${NC}"
            increment_counter "warn"
        fi
        
        if echo "$headers" | grep -qi "x-content-type-options"; then
            echo -e "${GREEN}✅ X-Content-Type-Options header present${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  X-Content-Type-Options header missing${NC}"
            increment_counter "warn"
        fi
    fi
}

# Function to check Firebase hosting configuration
check_firebase_hosting() {
    echo -e "\n${BLUE}🔥 Firebase Hosting Configuration${NC}"
    
    # Check if Firebase CLI is available
    if ! command -v firebase >/dev/null 2>&1; then
        echo -e "${RED}❌ Firebase CLI not found${NC}"
        echo "   Install with: npm install -g firebase-tools"
        increment_counter "fail"
        return 1
    fi
    
    echo -e "${GREEN}✅ Firebase CLI available${NC}"
    increment_counter "pass"
    
    # Check Firebase project
    echo "🔍 Checking Firebase project configuration..."
    local project_info=$(firebase projects:list 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Firebase authentication successful${NC}"
        increment_counter "pass"
        
        # Get current project
        local current_project=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}' || echo "none")
        if [ "$current_project" != "none" ]; then
            echo "  📍 Current project: $current_project"
        fi
        
    else
        echo -e "${RED}❌ Firebase authentication failed${NC}"
        echo "   Run: firebase login"
        increment_counter "fail"
        return 1
    fi
    
    # Check hosting sites
    echo "🔍 Checking Firebase hosting sites..."
    local hosting_sites=$(firebase hosting:sites:list 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Hosting sites accessible${NC}"
        increment_counter "pass"
        echo "$hosting_sites"
    else
        echo -e "${YELLOW}⚠️  Unable to retrieve hosting sites${NC}"
        increment_counter "warn"
    fi
    
    # Check firebase.json configuration
    echo "🔍 Checking firebase.json configuration..."
    if [ -f "firebase.json" ]; then
        echo -e "${GREEN}✅ firebase.json found${NC}"
        increment_counter "pass"
        
        # Check for hosting configuration
        if grep -q "hosting" firebase.json; then
            echo -e "${GREEN}✅ Hosting configuration present${NC}"
            increment_counter "pass"
            
            # Check for custom domain configuration
            if grep -q "site" firebase.json; then
                echo -e "${GREEN}✅ Custom site configuration found${NC}"
                increment_counter "pass"
            else
                echo -e "${YELLOW}⚠️  No custom site specified${NC}"
                increment_counter "warn"
            fi
            
            # Check for security headers
            if grep -q "headers" firebase.json; then
                echo -e "${GREEN}✅ Custom headers configured${NC}"
                increment_counter "pass"
            else
                echo -e "${YELLOW}⚠️  No custom headers configured${NC}"
                increment_counter "warn"
            fi
            
        else
            echo -e "${RED}❌ No hosting configuration in firebase.json${NC}"
            increment_counter "fail"
        fi
        
    else
        echo -e "${RED}❌ firebase.json not found${NC}"
        increment_counter "fail"
    fi
}

# Function to check DNS configuration
check_dns_configuration() {
    local domain=$1
    
    echo -e "\n${BLUE}🌐 DNS Configuration for $domain${NC}"
    
    if ! command -v nslookup >/dev/null 2>&1 && ! command -v dig >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  No DNS tools available (nslookup or dig)${NC}"
        increment_counter "warn"
        return 1
    fi
    
    # Check A record
    echo "🔍 Checking A record..."
    if command -v dig >/dev/null 2>&1; then
        local a_record=$(dig +short A "$domain" 2>/dev/null)
        if [ ! -z "$a_record" ]; then
            echo -e "${GREEN}✅ A record found: $a_record${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No A record found${NC}"
            increment_counter "warn"
        fi
    fi
    
    # Check AAAA record (IPv6)
    echo "🔍 Checking AAAA record..."
    if command -v dig >/dev/null 2>&1; then
        local aaaa_record=$(dig +short AAAA "$domain" 2>/dev/null)
        if [ ! -z "$aaaa_record" ]; then
            echo -e "${GREEN}✅ AAAA record found: $aaaa_record${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No AAAA record found (IPv6)${NC}"
            increment_counter "warn"
        fi
    fi
    
    # Check CNAME for www subdomain
    echo "🔍 Checking www subdomain..."
    if command -v dig >/dev/null 2>&1; then
        local www_record=$(dig +short CNAME "www.$domain" 2>/dev/null)
        if [ ! -z "$www_record" ]; then
            echo -e "${GREEN}✅ www CNAME found: $www_record${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No www CNAME found${NC}"
            increment_counter "warn"
        fi
    fi
    
    # Check MX record (for email)
    echo "🔍 Checking MX record..."
    if command -v dig >/dev/null 2>&1; then
        local mx_record=$(dig +short MX "$domain" 2>/dev/null)
        if [ ! -z "$mx_record" ]; then
            echo -e "${GREEN}✅ MX record found: $mx_record${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  No MX record found${NC}"
            increment_counter "warn"
        fi
    fi
}

# Function to check CDN and performance
check_cdn_performance() {
    local domain=$1
    
    echo -e "\n${BLUE}⚡ CDN and Performance Check for $domain${NC}"
    
    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  curl not available${NC}"
        increment_counter "warn"
        return 1
    fi
    
    # Check response time
    echo "🔍 Checking response time..."
    local response_time=$(curl -o /dev/null -s -w "%{time_total}" "https://$domain" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "  ⏱️  Response time: ${response_time}s"
        
        # Convert to milliseconds for comparison
        local response_ms=$(echo "$response_time * 1000" | bc 2>/dev/null || echo "0")
        local response_ms_int=${response_ms%.*}
        
        if [ "$response_ms_int" -lt 1000 ]; then
            echo -e "${GREEN}✅ Excellent response time (<1s)${NC}"
            increment_counter "pass"
        elif [ "$response_ms_int" -lt 3000 ]; then
            echo -e "${YELLOW}⚠️  Good response time (<3s)${NC}"
            increment_counter "warn"
        else
            echo -e "${RED}❌ Slow response time (>3s)${NC}"
            increment_counter "fail"
        fi
    else
        echo -e "${RED}❌ Failed to connect${NC}"
        increment_counter "fail"
    fi
    
    # Check for CDN headers
    echo "🔍 Checking CDN headers..."
    local headers=$(curl -s -I "https://$domain" 2>/dev/null)
    
    if echo "$headers" | grep -qi "cf-ray\|x-cache\|x-served-by\|server: cloudflare"; then
        echo -e "${GREEN}✅ CDN detected${NC}"
        increment_counter "pass"
    else
        echo -e "${YELLOW}⚠️  No CDN detected${NC}"
        increment_counter "warn"
    fi
    
    # Check compression
    if echo "$headers" | grep -qi "content-encoding: gzip\|content-encoding: br"; then
        echo -e "${GREEN}✅ Compression enabled${NC}"
        increment_counter "pass"
    else
        echo -e "${YELLOW}⚠️  No compression detected${NC}"
        increment_counter "warn"
    fi
}

# Load environment variables if available
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

# Main domain to check
MAIN_DOMAIN=${NEXT_PUBLIC_APP_URL:-""}
if [ ! -z "$MAIN_DOMAIN" ]; then
    # Remove protocol from URL
    MAIN_DOMAIN=$(echo "$MAIN_DOMAIN" | sed 's|https\?://||' | sed 's|/.*||')
else
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_APP_URL not set, checking Firebase hosting...${NC}"
    increment_counter "warn"
fi

# Check Firebase hosting configuration first
check_firebase_hosting

# If we have a main domain, check it
if [ ! -z "$MAIN_DOMAIN" ]; then
    check_ssl_certificate "$MAIN_DOMAIN" "Main Domain"
    check_dns_configuration "$MAIN_DOMAIN"
    check_cdn_performance "$MAIN_DOMAIN"
else
    echo -e "\n${YELLOW}⚠️  No custom domain specified. Using Firebase hosting domain.${NC}"
    
    # Try to get Firebase hosting URL
    if command -v firebase >/dev/null 2>&1; then
        local project_id=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}' || echo "")
        if [ ! -z "$project_id" ]; then
            local firebase_domain="${project_id}.web.app"
            echo -e "\n${BLUE}Checking Firebase default domain: $firebase_domain${NC}"
            check_ssl_certificate "$firebase_domain" "Firebase Default Domain"
        fi
    fi
fi

# Check additional domains/subdomains
echo -e "\n${BLUE}🔍 Additional Domain Checks${NC}"

# Common subdomains to check
SUBDOMAINS=("www" "api" "admin" "app")

for subdomain in "${SUBDOMAINS[@]}"; do
    if [ ! -z "$MAIN_DOMAIN" ]; then
        local full_domain="${subdomain}.${MAIN_DOMAIN}"
        echo "🔍 Checking $full_domain..."
        
        if nslookup "$full_domain" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $full_domain resolves${NC}"
            increment_counter "pass"
        else
            echo -e "${YELLOW}⚠️  $full_domain does not resolve${NC}"
            increment_counter "warn"
        fi
    fi
done

# Generate SSL certificate renewal reminder
echo -e "\n${BLUE}📝 Generating SSL Certificate Monitoring Script${NC}"

cat > scripts/ssl-monitor.sh << 'EOF'
#!/bin/bash
# SSL Certificate Monitoring Script
# Run this script periodically to monitor certificate expiration

DOMAIN="$1"
if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain>"
    exit 1
fi

# Check certificate expiration
EXPIRY_DATE=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

if [ ! -z "$EXPIRY_DATE" ]; then
    EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$EXPIRY_DATE" +%s 2>/dev/null)
    CURRENT_EPOCH=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
    
    echo "Certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days"
    
    if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
        echo "⚠️ WARNING: Certificate expires soon!"
        exit 1
    fi
else
    echo "❌ Could not retrieve certificate information"
    exit 1
fi
EOF

chmod +x scripts/ssl-monitor.sh
echo -e "${GREEN}✅ SSL monitoring script created: scripts/ssl-monitor.sh${NC}"

# Generate Firebase hosting configuration template
echo -e "\n${BLUE}📝 Generating Optimized Firebase Hosting Configuration${NC}"

cat > firebase.hosting.template.json << 'EOF'
{
  "hosting": {
    "site": "your-custom-site-name",
    "public": ".next",
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      },
      {
        "source": "/_next/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/_next/image/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ],
    "redirects": [
      {
        "source": "/home",
        "destination": "/",
        "type": 301
      }
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
EOF

echo -e "${GREEN}✅ Firebase hosting template created: firebase.hosting.template.json${NC}"

# Summary
echo -e "\n${BLUE}📊 SSL & Domain Audit Summary${NC}"
echo "============================================="
echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"

# Recommendations
echo -e "\n${BLUE}💡 Recommendations${NC}"
echo "============================================="

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ SSL and domain configuration looks good!${NC}"
else
    echo -e "${RED}❌ $FAILED_CHECKS critical issues found. Address before production.${NC}"
fi

if [ $WARNING_CHECKS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNING_CHECKS warnings found. Consider addressing for optimal security.${NC}"
fi

echo ""
echo "🔒 SSL Best Practices:"
echo "  • Use strong encryption (TLS 1.3 preferred)"
echo "  • Enable HSTS with long max-age"
echo "  • Set up certificate auto-renewal"
echo "  • Monitor certificate expiration"
echo "  • Use OCSP stapling for performance"

echo ""
echo "🌐 Domain Best Practices:"
echo "  • Set up www redirect (CNAME or redirect)"
echo "  • Configure proper DNS TTL values"
echo "  • Use CAA records for certificate authority"
echo "  • Enable domain security features (DNSSEC)"
echo "  • Monitor DNS propagation globally"

echo ""
echo "📋 Next Steps:"
echo "  1. Address any failed SSL checks"
echo "  2. Configure custom domain in Firebase console"
echo "  3. Set up SSL certificate (auto-managed by Firebase)"
echo "  4. Configure DNS records as required"
echo "  5. Test domain accessibility globally"
echo "  6. Set up monitoring for certificate expiration"

# Exit with appropriate code
if [ $FAILED_CHECKS -eq 0 ]; then
    exit 0
else
    exit 1
fi