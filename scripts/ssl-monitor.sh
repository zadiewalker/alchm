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
