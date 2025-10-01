# 🔐 COMPLETE CREDENTIAL ROTATION GUIDE
## ALCHM Mental Health Platform - Emergency Security Response

**CRITICAL**: These credentials were exposed and must be rotated immediately to protect vulnerable mental health users.

---

## 🔥 1. FIREBASE SERVICE ACCOUNT (CRITICAL PRIORITY)

### Generate New Credentials:
1. Go to: https://console.firebase.google.com/project/alchm-digital-sanctuary/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Download the JSON file (DO NOT COMMIT TO GIT)
4. Extract these values from the JSON:

```json
{
  "project_id": "alchm-digital-sanctuary",
  "private_key": "-----BEGIN PRIVATE KEY-----\n[LONG_KEY_STRING]\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@alchm-digital-sanctuary.iam.gserviceaccount.com"
}
```

### Add to .env.local:
```bash
# ===== FIREBASE ADMIN SDK (NEW) =====
FIREBASE_PROJECT_ID=alchm-digital-sanctuary
FIREBASE_CLIENT_EMAIL=[client_email from JSON]
FIREBASE_PRIVATE_KEY="[private_key from JSON - keep quotes and newlines]"
```

### Test Firebase:
```bash
npm run dev
# Check console for Firebase connection success
```

---

## 💳 2. STRIPE API KEYS (CRITICAL PRIORITY)

### Generate New Credentials:
1. Go to: https://dashboard.stripe.com/apikeys
2. **Create New Secret Key:**
   - Click **"Create restricted key"**
   - Name: "ALCHM Mental Health Platform"
   - Permissions needed:
     - `customers:write` (create user accounts)
     - `checkout:write` (payment sessions) 
     - `subscriptions:write` (recurring billing)
     - `prices:read` (pricing tiers)
     - `webhooks:write` (payment confirmations)

3. **Get Publishable Key:**
   - Copy your **Publishable key** (starts with `pk_live_`)

4. **Create New Webhook:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click **"Add endpoint"**
   - URL: `https://alchmapp.web.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`
   - Copy the **Signing secret** (starts with `whsec_`)

### Add to .env.local:
```bash
# ===== STRIPE CONFIGURATION (NEW) =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[NEW_PUBLISHABLE_KEY]
STRIPE_SECRET_KEY=sk_live_[NEW_SECRET_KEY] 
STRIPE_WEBHOOK_SECRET=whsec_[NEW_WEBHOOK_SECRET]
```

### Test Stripe:
```bash
# Test payment creation
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_test"}'
```

---

## 🤖 3. OPENAI API KEY (HIGH PRIORITY)

### Generate New Credentials:
1. Go to: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name: "ALCHM Crisis Detection AI"
4. Permissions: Default (full access needed for GPT-4 crisis analysis)
5. Copy the key (starts with `sk-`)

### Add to .env.local:
```bash
# ===== AI SERVICES (NEW) =====
OPENAI_API_KEY=sk-[NEW_OPENAI_KEY]
```

### Test OpenAI:
```bash
# Test crisis detection
curl -X POST http://localhost:3000/api/ai/crisis-detection \
  -H "Content-Type: application/json" \
  -d '{"text":"I feel hopeless today","userId":"test"}'
```

---

## 🧠 4. GOOGLE AI API KEY (HIGH PRIORITY)

### Generate New Credentials:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"Create Credentials"** → **"API key"**
3. **Restrict the API key:**
   - Application restrictions: None (for now)
   - API restrictions: **Generative Language API**
4. Name it: "ALCHM Khepera Therapeutic AI"
5. Copy the key (starts with `AIzaSy`)

### Add to .env.local:
```bash
# ===== AI SERVICES (CONTINUED) =====
GOOGLE_AI_API_KEY=AIzaSy[NEW_GOOGLE_AI_KEY]
```

### Test Google AI:
```bash
# Test Khepera responses
curl -X POST http://localhost:3000/api/ai/khepera \
  -H "Content-Type: application/json" \
  -d '{"message":"I need support today","userId":"test"}'
```

---

## 🔧 5. COMPLETE .env.local TEMPLATE

Replace your entire `.env.local` file with this template using the NEW credentials:

```bash
# ===== FIREBASE CONFIGURATION (NEW) =====
NEXT_PUBLIC_FIREBASE_API_KEY=[KEEP_EXISTING_PUBLIC_KEY]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=alchm-digital-sanctuary.web.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=alchm-digital-sanctuary
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=alchm-digital-sanctuary.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=10211111067
NEXT_PUBLIC_FIREBASE_APP_ID=1:10211111067:web:4f23562b8a1f63cd8c963e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0RPJ2D5M1R

# ===== FIREBASE ADMIN SDK (NEW - ROTATE THESE) =====
FIREBASE_PROJECT_ID=alchm-digital-sanctuary
FIREBASE_CLIENT_EMAIL=[NEW_CLIENT_EMAIL_FROM_JSON]
FIREBASE_PRIVATE_KEY="[NEW_PRIVATE_KEY_FROM_JSON]"

# ===== STRIPE CONFIGURATION (NEW - ROTATE ALL) =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[NEW_PUBLISHABLE_KEY]
STRIPE_SECRET_KEY=[NEW_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=[NEW_WEBHOOK_SECRET]
STRIPE_DEEP_CUT_PRICE_ID=price_deep_cut_monthly
STRIPE_ORACLE_PRICE_ID=price_oracle_monthly

# ===== AUTHENTICATION =====
NEXTAUTH_SECRET=Jvzx1BoVQOYqVpRPUYTinLUhIxQn5fkcIax20R5FgME=
NEXTAUTH_URL=https://alchmapp.web.app

# ===== ENVIRONMENT =====
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production

# ===== API CONFIGURATION =====
NEXT_PUBLIC_API_URL=https://alchmapp.web.app

# ===== AI SERVICES (NEW - ROTATE BOTH) =====
GOOGLE_AI_API_KEY=[NEW_GOOGLE_AI_KEY]
OPENAI_API_KEY=[NEW_OPENAI_KEY]
NEXT_PUBLIC_OPENAI_PROJECT_ID=proj_x1r01947ZhmBdF5a7yMbRj0u

# ===== CRISIS SUPPORT (KEEP EXISTING) =====
NEXT_PUBLIC_CRISIS_HOTLINES="988,1-800-273-8255"
NEXT_PUBLIC_CRISIS_TEXT_LINE="741741"
NEXT_PUBLIC_EMERGENCY_NUMBER="911"

# ===== ALL OTHER SETTINGS (KEEP EXISTING) =====
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
ALLOWED_ORIGINS=https://alchmapp.web.app,https://www.alchmapp.web.app
FIRESTORE_REGION=us-central1
MAX_DB_CONNECTIONS=100
MAX_FILE_SIZE=10485760
MAX_AUDIO_FILE_SIZE=52428800
MAX_DOCUMENT_FILE_SIZE=26214400
CACHE_TTL=3600
ENABLE_BUNDLE_ANALYZER=false
ENABLE_COMPRESSION=true
ENABLE_SERVICE_WORKER=true
CSP_REPORT_URI=https://alchmapp.web.app/api/csp-report
TRUSTED_DOMAINS=firebasestorage.googleapis.com,googleapis.com,alchmapp.web.app
BACKUP_BUCKET=gs://alchm-digital-sanctuary-backups
BACKUP_RETENTION_DAYS=30
ENABLE_AI_FEATURES=true
ENABLE_CRISIS_PREVENTION=true
ENABLE_PREMIUM_FEATURES=true
ENABLE_ANALYTICS=true
DEBUG=false
VERBOSE_LOGGING=false
CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
```

---

## 🧪 6. COMPREHENSIVE TESTING PROCEDURE

After updating all credentials, run these tests:

```bash
# 1. Start development server
npm run dev

# 2. Test Firebase Authentication
curl -X POST http://localhost:3000/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"sessionToken":"test"}'

# 3. Test Crisis Detection (OpenAI)
curl -X POST http://localhost:3000/api/ai/crisis-detection \
  -H "Content-Type: application/json" \
  -d '{"text":"I feel hopeless","userId":"test"}'

# 4. Test Khepera AI (Google AI)
curl -X POST http://localhost:3000/api/ai/khepera \
  -H "Content-Type: application/json" \
  -d '{"message":"I need guidance","userId":"test"}'

# 5. Test Stripe Payments
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_1234"}'

# 6. Run full system validation
npm run security:check
node scripts/validate-crisis.js

# 7. Test production build
npm run build

# 8. Test deployment
firebase deploy --only hosting:alchmapp
```

---

## 🚨 SECURITY CHECKLIST

- [ ] Generated new Firebase service account key
- [ ] Generated new Stripe restricted API keys  
- [ ] Generated new OpenAI API key
- [ ] Generated new Google AI API key
- [ ] Updated .env.local with ALL new credentials
- [ ] Deleted downloaded Firebase JSON file
- [ ] Tested authentication flow
- [ ] Tested crisis detection system
- [ ] Tested Khepera AI responses
- [ ] Tested Stripe payment flow
- [ ] Ran security validation
- [ ] Ran crisis system validation
- [ ] Deployed to production
- [ ] Revoked old credentials in each service

---

## ⚠️ CRITICAL REMINDERS

1. **NEVER COMMIT** the new credentials to git
2. **DELETE** downloaded Firebase JSON file after use
3. **REVOKE** old credentials only AFTER confirming new ones work
4. **MONITOR** Firebase Functions logs for any authentication errors
5. **TEST THOROUGHLY** before announcing platform availability to users

---

**This completes the emergency credential rotation for ALCHM. All life-critical systems (crisis detection, authentication, AI processing, payments) will be secured with fresh credentials.**