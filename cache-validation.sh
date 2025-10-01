#!/bin/bash

# ALCHM Cache Validation & CDN Busting Script
# Ensures Sacred Contract styling reaches all users globally

echo "🔄 ALCHM Sacred Contract Cache Validation Started..."
echo "=================================="

# Function to test cache headers and content
test_endpoint() {
    local url="$1"
    local location="$2"
    
    echo "📍 Testing: $location"
    echo "URL: $url"
    
    # Test with cache-busting headers
    response=$(curl -w "%{http_code},%{time_total},%{time_namelookup}" \
        -H "Cache-Control: no-cache, no-store, must-revalidate" \
        -H "Pragma: no-cache" \
        -H "User-Agent: ALCHM-Cache-Validator/1.0" \
        -s "$url" | tail -1)
    
    # Extract Sacred Contract background color
    sage_color=$(curl -s -H "Cache-Control: no-cache" "$url" | grep -o 'rgba(164, 183, 146, [0-9.]*)')
    
    echo "Response: $response"
    echo "Sacred Contract Color: ${sage_color:-"NOT FOUND"}"
    
    # Check if opacity is correct (should be 0.4)
    if echo "$sage_color" | grep -q "0.4"; then
        echo "✅ Sage green opacity is correct (0.4)"
    elif echo "$sage_color" | grep -q "0.15"; then
        echo "❌ Still showing old opacity (0.15) - Cache not cleared"
        return 1
    else
        echo "❓ Unknown opacity value: $sage_color"
        return 1
    fi
    
    echo "---"
    return 0
}

# Test main endpoints
echo "🌍 Testing Global Cache Status..."
test_endpoint "https://alchm-digital-sanctuary.web.app/" "Primary Domain"

# Force CDN refresh for multiple edge locations
echo ""
echo "🔄 Forcing CDN Cache Refresh..."

# Purge with different methods
echo "Method 1: PURGE request"
purge_response=$(curl -X PURGE "https://alchm-digital-sanctuary.web.app/" 2>/dev/null || echo "PURGE failed")
echo "Purge Response: $purge_response"

echo "Method 2: Cache-Control bypass"
bypass_test=$(curl -w "%{http_code}" -o /dev/null -s \
    -H "Cache-Control: no-cache, no-store, must-revalidate" \
    -H "Pragma: no-cache" \
    -H "If-Modified-Since: Thu, 01 Jan 1970 00:00:00 GMT" \
    "https://alchm-digital-sanctuary.web.app/")
echo "Bypass Test Response Code: $bypass_test"

echo "Method 3: Query parameter cache-busting"
timestamp=$(date +%s)
query_test=$(curl -w "%{http_code}" -o /dev/null -s \
    "https://alchm-digital-sanctuary.web.app/?cb=$timestamp")
echo "Query Cache-Bust Response Code: $query_test"

# Wait for cache propagation
echo ""
echo "⏳ Waiting 30 seconds for cache propagation..."
sleep 30

# Final validation
echo ""
echo "🔍 Final Cache Validation..."
final_test=$(curl -s "https://alchm-digital-sanctuary.web.app/" | grep -o 'rgba(164, 183, 146, [0-9.]*)')
if echo "$final_test" | grep -q "0.4"; then
    echo "✅ SUCCESS: Sacred Contract now showing proper sage green opacity (0.4)"
    echo "✅ Users should now see a visible sage green background instead of white"
else
    echo "❌ FAILED: Sacred Contract still showing old styling"
    echo "Current value: $final_test"
fi

echo ""
echo "🎯 Cache Validation Complete!"
echo "=================================="