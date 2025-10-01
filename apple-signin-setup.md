# Apple Sign In & Custom Domain Setup Guide

## 1. Firebase Console Checklist
- [ ] Authentication → Sign-in method → Enable Apple
- [ ] Copy OAuth redirect URI for Apple Developer
- [ ] Set Service ID: `com.alchmapp.web.signin`
- [ ] Add authorized domains: `alchmapp.com`, `www.alchmapp.com`

## 2. Apple Developer Console Checklist  
- [ ] Create Service ID: `com.alchmapp.web.signin`
- [ ] Enable "Sign In with Apple" for Service ID
- [ ] Configure domains: `alchmapp.com`, `www.alchmapp.com`
- [ ] Set return URL: (Firebase OAuth redirect URI)
- [ ] Generate and download private key

## 3. Domain Setup Checklist
- [ ] ✅ Domain already owned: www.alchmapp.com
- [ ] Add custom domain in Firebase Hosting: `alchmapp.com`, `www.alchmapp.com`
- [ ] Configure DNS A records to point to Firebase: 151.101.1.195, 151.101.65.195
- [ ] Configure DNS CNAME: www → alchmapp.web.app (or use A records for both)
- [ ] Wait for SSL certificate provisioning (up to 24 hours)

## 4. OAuth Configuration Checklist
- [ ] Google Cloud Console → Add `alchmapp.com` to authorized domains
- [ ] Update authorized redirect URIs: `https://www.alchmapp.com/__/auth/handler`
- [ ] Firebase Auth → Add `alchmapp.com`, `www.alchmapp.com` to authorized domains
- [ ] Test OAuth flow with custom domain

## 5. Firebase Apple Provider Final Setup
- [ ] Apple Team ID: (from Apple Developer account)
- [ ] Service ID: `com.alchmapp.web.signin`
- [ ] Private Key: Upload .p8 file from Apple
- [ ] Key ID: From Apple Developer private key

## 6. Testing Commands
```bash
# Deploy to test custom domain
firebase deploy --only hosting:alchmapp

# Test Apple Sign In (after all configs)
# Visit: https://www.alchmapp.com/auth/login
# Click "Continue with Apple" button
```

## Expected Timeline:
- Apple Developer setup: 15-30 minutes
- DNS propagation: 1-24 hours  
- SSL certificate: 1-24 hours
- Total setup time: 1-2 days for full propagation

## Troubleshooting:
- If Apple Sign In fails: Check Service ID configuration
- If domain doesn't load: Verify DNS records
- If OAuth fails: Ensure all redirect URIs match exactly
- If SSL issues: Wait for certificate provisioning (up to 24 hours)