# 🍎 ALCHM App Store Submission Checklist

## ✅ CRITICAL REQUIREMENTS

### 📱 **App Metadata & Information**
- [ ] **App Name**: "ALCHM" (matches bundle identifier)
- [ ] **Bundle ID**: Consistent with Apple Developer account
- [ ] **Version Number**: Properly incremented
- [ ] **Build Number**: Unique and incremented
- [ ] **App Description**: Clear, concise, no marketing speak
- [ ] **Keywords**: Relevant, no competitor names
- [ ] **Support URL**: Working and accessible
- [ ] **Privacy Policy URL**: Accessible and comprehensive

### 🖼️ **App Store Assets**
- [ ] **App Icon**: 1024x1024px, no transparency, proper design
- [ ] **Screenshots**: 
  - [ ] iPhone 6.7" (Pro Max): At least 3 screenshots
  - [ ] iPhone 6.5" (Plus): At least 3 screenshots  
  - [ ] iPhone 5.5": At least 3 screenshots
  - [ ] All screenshots show actual app content
  - [ ] No placeholder or generic content
- [ ] **App Preview Videos**: Optional but recommended
- [ ] **Promotional Text**: Clear value proposition

---

## 🔒 **PRIVACY & PERMISSIONS**

### 📋 **Privacy Nutrition Labels**
- [ ] **Data Collection Declared**: 
  - [ ] Journal entries (stored locally)
  - [ ] User preferences (stored locally)
  - [ ] No tracking across apps/websites
  - [ ] No data sold to third parties
- [ ] **Permission Descriptions** (Info.plist):
  - [x] Camera: "ALCHM does not use camera functionality"
  - [x] Microphone: "ALCHM does not use microphone functionality"
  - [x] Location: "ALCHM does not use location services"
  - [x] Photo Library: "ALCHM does not access your photo library"
  - [x] Health: "ALCHM does not access health data"

### 🔐 **Data Security**
- [ ] **Local Storage Only**: All sensitive data stored locally
- [ ] **No Server Dependencies**: App works offline
- [ ] **Encryption**: Local data is encrypted if needed
- [ ] **Privacy Policy**: Updated and accessible

---

## 💰 **IN-APP PURCHASES & MONETIZATION**

### 🛒 **Subscription Setup**
- [x] **Growth Tier**: Free forever
- [x] **Transformation Tier**: $4.99/month
- [ ] **Stripe Integration**: Working and tested
- [ ] **Subscription Terms**: Clear in app and metadata
- [ ] **Free Trial**: If offered, properly configured
- [ ] **Restore Purchases**: Functionality implemented
- [ ] **Subscription Management**: Links to Apple's system

### 💳 **Payment Compliance**
- [ ] **No External Payment Links**: All payments through Apple
- [ ] **Subscription Cancellation**: Clear instructions
- [ ] **Terms of Service**: Accessible and compliant
- [ ] **Auto-renewal**: Properly disclosed

---

## 🩺 **HEALTHCARE & MENTAL HEALTH COMPLIANCE**

### ⚕️ **Medical Content Guidelines**
- [ ] **Crisis Support**: 988 number prominently displayed
- [ ] **Disclaimer**: Clear that app is not medical advice
- [ ] **Professional Warning**: Encourages professional help when needed
- [ ] **Age Restriction**: 17+ rating if mental health content
- [ ] **Content Review**: No medical claims or diagnoses

### 🛡️ **Safety Features**
- [x] **Crisis Support Footer**: "Crisis support available · 988"
- [ ] **Emergency Resources**: Accessible from key screens
- [ ] **Content Warnings**: For potentially triggering content
- [ ] **Professional Referrals**: Links to find therapists

---

## 🔧 **TECHNICAL REQUIREMENTS**

### 📱 **App Functionality**
- [ ] **No Crashes**: Thorough testing on multiple devices
- [ ] **Splash Screen**: Loads properly and disappears
- [ ] **Navigation**: All buttons and links work
- [ ] **Pathways**: All interactive elements functional
- [ ] **Journal**: Create, save, and view entries
- [ ] **Settings**: All toggles and options work
- [ ] **Offline Functionality**: App works without internet

### 🏗️ **Build Quality**
- [x] **Static Export**: All pages generate properly (index.html created)
- [x] **Sacred Colors**: Consistent throughout app
- [x] **Typography**: Proper fonts and sizing
- [x] **Performance**: Fast loading and smooth animations
- [x] **Memory Usage**: No leaks or excessive usage

### 🖥️ **iOS Compatibility**
- [x] **iOS Version Support**: Minimum iOS 12+
- [x] **Device Support**: iPhone and iPad (if applicable)
- [x] **Orientation**: Portrait only (as configured)
- [x] **Safe Area**: Proper handling of notches/home indicator
- [x] **Dark Mode**: Supports system appearance if needed
- [x] **UIScene Lifecycle**: Modern lifecycle implementation added
- [x] **Keyboard Constraints**: Native keyboard handling configured

---

## 📖 **CONTENT & COMPLIANCE**

### 📝 **App Content**
- [ ] **Age-Appropriate**: All content suitable for rating
- [ ] **No Objectionable Content**: No profanity, violence, etc.
- [ ] **Cultural Sensitivity**: Respectful and inclusive
- [ ] **Therapeutic Content**: Professional and evidence-based
- [ ] **User-Generated Content**: Moderation if applicable

### 🎯 **App Store Guidelines**
- [ ] **Guideline 1.1.1**: App completeness
- [ ] **Guideline 2.1**: App performance
- [ ] **Guideline 3.1.1**: In-app purchases
- [ ] **Guideline 4.0**: Design standards
- [ ] **Guideline 5.1.1**: Privacy requirements

---

## 🚀 **PRE-SUBMISSION TESTING**

### 🧪 **Quality Assurance**
- [ ] **Device Testing**:
  - [ ] iPhone 12/13/14/15 (various sizes)
  - [ ] iOS 16, 17, 18 compatibility
  - [ ] Fresh install testing
  - [ ] Update testing (if not first submission)

### ✅ **User Journey Testing**
- [ ] **Onboarding**: Complete flow works
- [ ] **Splash → Dashboard**: Navigation works
- [ ] **Journal Creation**: Full create/save/view flow
- [ ] **Pathways**: Can access and complete stages
- [ ] **Settings**: All preferences save properly
- [ ] **Subscription**: Full payment flow (test mode)

### 🔍 **Final Checks**
- [ ] **App Store Connect**: All metadata complete
- [ ] **Build Upload**: Latest build uploaded successfully
- [ ] **TestFlight**: Internal testing completed
- [ ] **External Testing**: Beta testers approved (if applicable)

---

## 🚨 **COMMON REJECTION FIXES**

### ❌ **Previous Issues to Avoid**
- [ ] **Incomplete Information**: All App Store fields filled
- [ ] **Missing Privacy Policy**: Link working and comprehensive  
- [ ] **Non-functional Features**: All buttons and links work
- [ ] **Performance Issues**: No crashes or hangs
- [ ] **Design Guidelines**: Follows iOS Human Interface Guidelines
- [ ] **In-app Purchase Issues**: Clear pricing and terms
- [ ] **Content Issues**: Age-appropriate and compliant

### 🛠️ **Proactive Fixes Applied**
- [x] **Sacred Color Palette**: Consistent throughout app
- [x] **Crisis Support**: 988 number on every relevant screen
- [x] **Navigation**: All pathways and features accessible
- [x] **Pricing**: Clear free vs premium distinction
- [x] **Static Export**: All pages properly generated
- [x] **Performance**: Optimized for iOS WebView
- [x] **Permissions**: Minimal and justified
- [x] **UIScene Implementation**: Added SceneDelegate.swift and updated AppDelegate
- [x] **Keyboard Optimization**: Configured native keyboard handling
- [x] **Console Log Cleanup**: Removed logs preventing static generation

---

## 📋 **SUBMISSION WORKFLOW**

### 1️⃣ **Pre-Submission**
- [ ] Complete this entire checklist
- [ ] Final build testing
- [ ] App Store Connect setup

### 2️⃣ **Submission Day**
- [ ] Upload final build
- [ ] Submit for review
- [ ] Monitor review status

### 3️⃣ **Post-Submission**
- [ ] Respond to reviewer feedback promptly
- [ ] Be ready for quick fixes if needed
- [ ] Plan release marketing

---

## 📞 **EMERGENCY CONTACTS & RESOURCES**

- **Crisis Support**: 988 (displayed throughout app)
- **Apple Developer Support**: developer.apple.com/support
- **App Store Review Guidelines**: developer.apple.com/app-store/review/guidelines
- **TestFlight**: testflight.apple.com

---

*Last Updated: February 8, 2026*
*Status: Ready for final review and submission*