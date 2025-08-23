# ALCHM Security Documentation

## Critical Security Alert - Action Required

**IMMEDIATE ACTION REQUIRED**: The Firebase private keys in `.env.local` must be revoked and regenerated.

### Steps to Secure Your Deployment:

1. **Revoke Current Firebase Service Account Keys**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Project Settings > Service Accounts
   - Delete the current service account key (ID: c1f96644d5ead7c1d48a6bce370826416fdd9a8b)
   - Generate a new service account key

2. **Update Environment Variables**:
   - Replace `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local` with the new key
   - Ensure `.env.local` is never committed to git
   - Use the `.env.local.template` file for reference

3. **Secure Deployment**:
   - For production, use secure environment variable storage (Vercel Environment Variables, Firebase App Hosting secrets, etc.)
   - Never store private keys in code or version control

## Security Features Implemented

### 1. Environment Variable Validation (`src/lib/env.ts`)
- Server-side vs client-side variable separation
- Validation of required environment variables
- Secure credential management

### 2. Input Sanitization (`src/lib/security.ts`)
- XSS prevention through input sanitization
- Content Security Policy (CSP) directives
- Rate limiting configuration
- Security headers for API routes

### 3. Firebase Admin Security (`src/lib/firebaseAdmin.ts`)
- Secure service account initialization
- Session cookie verification
- Proper error handling

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on all API endpoints
4. **Validate all inputs** on both client and server
5. **Use HTTPS only** in production
6. **Regular security audits** with `pnpm audit`

## Emergency Response

If you suspect a security breach:
1. Immediately revoke all Firebase service account keys
2. Regenerate all API keys (OpenAI, Stripe, etc.)
3. Review Firebase Authentication logs
4. Check for unauthorized data access in Firestore

## Security Headers Implemented

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`