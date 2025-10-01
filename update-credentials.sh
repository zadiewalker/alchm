#!/bin/bash

# ALCHM Credential Update Helper
# Interactive script to safely update credentials in .env.local

echo "🔐 ALCHM CREDENTIAL UPDATE HELPER"
echo "================================="
echo ""
echo "This script will help you safely update your .env.local file with new credentials."
echo "Make sure you have generated new credentials from all services first!"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "Creating from template..."
    if [ -f ".env.local.template" ]; then
        cp .env.local.template .env.local
        echo "✅ Created .env.local from template"
    else
        echo "❌ No template found. Please create .env.local manually."
        exit 1
    fi
fi

# Backup current .env.local
backup_file=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
cp .env.local "$backup_file"
echo "✅ Backed up current .env.local to $backup_file"
echo ""

# Helper function to update a credential
update_credential() {
    local var_name="$1"
    local description="$2"
    local current_value=$(grep "^$var_name=" .env.local | cut -d'=' -f2- | tr -d '"')
    
    echo "📝 Updating: $description"
    echo "Variable: $var_name"
    
    if [ -n "$current_value" ]; then
        echo "Current value: ${current_value:0:20}..." 
    else
        echo "Current value: (not set)"
    fi
    
    echo -n "Enter new value (or press Enter to skip): "
    read new_value
    
    if [ -n "$new_value" ]; then
        # Escape special characters for sed
        escaped_value=$(printf '%s\n' "$new_value" | sed 's/[[\.*^$()+?{|]/\\&/g')
        
        # Update the value in .env.local
        if grep -q "^$var_name=" .env.local; then
            sed -i "" "s|^$var_name=.*|$var_name=\"$new_value\"|" .env.local
        else
            echo "$var_name=\"$new_value\"" >> .env.local
        fi
        echo "✅ Updated $var_name"
    else
        echo "⏭️  Skipped $var_name"
    fi
    echo ""
}

echo "🔥 FIREBASE ADMIN CREDENTIALS"
echo "============================"
echo "Get these from: https://console.firebase.google.com/project/alchm-digital-sanctuary/settings/serviceaccounts/adminsdk"
echo ""

update_credential "FIREBASE_CLIENT_EMAIL" "Firebase Service Account Email"
update_credential "FIREBASE_PRIVATE_KEY" "Firebase Private Key (keep the quotes and \\n)"

echo "💳 STRIPE CREDENTIALS"
echo "==================="
echo "Get these from: https://dashboard.stripe.com/apikeys"
echo ""

update_credential "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe Publishable Key (pk_live_...)"
update_credential "STRIPE_SECRET_KEY" "Stripe Secret Key (sk_live_...)"
update_credential "STRIPE_WEBHOOK_SECRET" "Stripe Webhook Secret (whsec_...)"

echo "🤖 AI SERVICE CREDENTIALS"
echo "========================"
echo "OpenAI: https://platform.openai.com/api-keys"
echo "Google AI: https://console.cloud.google.com/apis/credentials"
echo ""

update_credential "OPENAI_API_KEY" "OpenAI API Key (sk-...)"
update_credential "GOOGLE_AI_API_KEY" "Google AI API Key (AIzaSy...)"

echo "✅ CREDENTIAL UPDATE COMPLETE!"
echo "=============================="
echo ""
echo "📋 Next steps:"
echo "1. Test your credentials: ./test-new-credentials.sh"
echo "2. If tests pass: npm run build"
echo "3. Deploy to production: firebase deploy --only hosting:alchmapp"
echo "4. Revoke old credentials in each service console"
echo ""
echo "🔒 Security reminders:"
echo "- Never commit .env.local to git"
echo "- Keep your backup file ($backup_file) secure"
echo "- Monitor logs for any authentication errors"
echo ""

# Quick validation
echo "🔍 Quick validation of .env.local format:"
required_vars=("FIREBASE_CLIENT_EMAIL" "FIREBASE_PRIVATE_KEY" "STRIPE_SECRET_KEY" "OPENAI_API_KEY" "GOOGLE_AI_API_KEY")
all_present=true

for var in "${required_vars[@]}"; do
    if grep -q "^$var=" .env.local && [ -n "$(grep "^$var=" .env.local | cut -d'=' -f2-)" ]; then
        echo "✅ $var - present"
    else
        echo "❌ $var - missing or empty"
        all_present=false
    fi
done

echo ""
if [ "$all_present" = true ]; then
    echo "🎉 All critical credentials are present!"
    echo "Run: ./test-new-credentials.sh to validate functionality"
else
    echo "⚠️  Some credentials are missing. Please update them manually in .env.local"
fi