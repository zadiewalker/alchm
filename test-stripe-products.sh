#!/bin/bash

# ALCHM Stripe Product Testing Script
# Tests that your Stripe products are correctly configured

echo "🏛️ ALCHM STRIPE PRODUCT VALIDATION"
echo "=================================="
echo ""

# Check if development server is running
echo "🔍 Checking development server..."
if curl -s "http://localhost:3000" > /dev/null 2>&1; then
    echo "✅ Development server is running"
else
    echo "❌ Development server not running. Run: npm run dev"
    exit 1
fi

echo ""
echo "🔧 Testing Stripe Configuration..."

# Test 1: Check environment variables
echo ""
echo "📋 Environment Variables:"
if grep -q "STRIPE_PREMIUM_SANCTUARY_PRICE_ID=price_" .env.local; then
    price_id=$(grep "STRIPE_PREMIUM_SANCTUARY_PRICE_ID=" .env.local | cut -d'=' -f2)
    echo "✅ STRIPE_PREMIUM_SANCTUARY_PRICE_ID: ${price_id:0:20}..."
else
    echo "❌ STRIPE_PREMIUM_SANCTUARY_PRICE_ID: Not properly configured"
fi

if grep -q "STRIPE_ORACLE_SANCTUARY_PRICE_ID=price_" .env.local; then
    oracle_id=$(grep "STRIPE_ORACLE_SANCTUARY_PRICE_ID=" .env.local | cut -d'=' -f2)
    echo "✅ STRIPE_ORACLE_SANCTUARY_PRICE_ID: ${oracle_id:0:20}..."
else
    echo "❌ STRIPE_ORACLE_SANCTUARY_PRICE_ID: Not properly configured"
fi

# Test 2: Test checkout session creation
echo ""
echo "💳 Testing Checkout Session Creation..."

# Get the actual price ID from env
PREMIUM_PRICE_ID=$(grep "STRIPE_PREMIUM_SANCTUARY_PRICE_ID=" .env.local | cut -d'=' -f2)

if [[ $PREMIUM_PRICE_ID == price_* ]]; then
    echo "Testing with price ID: $PREMIUM_PRICE_ID"
    
    response=$(curl -s -X POST "http://localhost:3000/api/stripe/create-checkout-session" \
        -H "Content-Type: application/json" \
        -d "{\"price_id\": \"$PREMIUM_PRICE_ID\", \"success_url\": \"http://localhost:3000/pricing/success\", \"cancel_url\": \"http://localhost:3000/pricing\"}")
    
    if echo "$response" | grep -q "checkout_url"; then
        echo "✅ Stripe Checkout Session: SUCCESS"
        checkout_url=$(echo "$response" | grep -o '"checkout_url":"[^"]*' | cut -d'"' -f4)
        echo "   Checkout URL generated: ${checkout_url:0:50}..."
    else
        echo "❌ Stripe Checkout Session: FAILED"
        echo "   Response: $response"
    fi
else
    echo "⚠️ Skipping checkout test - price ID not in correct format"
fi

# Test 3: Test webhook endpoint
echo ""
echo "🔗 Testing Webhook Endpoint..."
webhook_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/stripe/webhook")
if [ "$webhook_response" == "405" ]; then
    echo "✅ Webhook Endpoint: Available (Method Not Allowed is expected)"
else
    echo "❌ Webhook Endpoint: Not responding correctly (got $webhook_response)"
fi

# Test 4: Pricing page accessibility
echo ""
echo "🏷️ Testing Pricing Page..."
if curl -s "http://localhost:3000/pricing" | grep -q "Premium Sanctuary"; then
    echo "✅ Pricing Page: Accessible and contains product information"
else
    echo "❌ Pricing Page: Not accessible or missing content"
fi

echo ""
echo "=================================="
echo "📊 SUMMARY"
echo "=================================="

# Count successes
success_count=0
total_tests=4

if grep -q "STRIPE_PREMIUM_SANCTUARY_PRICE_ID=price_" .env.local; then
    ((success_count++))
fi

if [[ $PREMIUM_PRICE_ID == price_* ]] && echo "$response" | grep -q "checkout_url"; then
    ((success_count++))
fi

if [ "$webhook_response" == "405" ]; then
    ((success_count++))
fi

if curl -s "http://localhost:3000/pricing" | grep -q "Premium Sanctuary"; then
    ((success_count++))
fi

echo "Tests Passed: $success_count/$total_tests"

if [ $success_count -eq $total_tests ]; then
    echo "🎉 ALL TESTS PASSED! Stripe is properly configured."
    echo ""
    echo "✅ Ready for production deployment!"
    echo "✅ Users can now subscribe to Premium Sanctuary"
    echo ""
    echo "🚀 Deploy with: firebase deploy --only hosting:alchmapp"
else
    echo "⚠️ Some tests failed. Please review the Stripe configuration."
    echo ""
    echo "📖 Next steps:"
    echo "1. Follow STRIPE_PRODUCT_SETUP_GUIDE.md"
    echo "2. Create products in Stripe Dashboard"
    echo "3. Update price IDs in .env.local"
    echo "4. Re-run this script"
fi

echo ""