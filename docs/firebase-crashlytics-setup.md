# Firebase Crashlytics & Test Lab Setup for ALCHM

This document provides comprehensive instructions for configuring Firebase Crashlytics and Test Lab for the ALCHM trauma-informed journaling application.

## Overview

ALCHM implements **privacy-preserving crash reporting** that protects sensitive journal content while providing actionable crash data to improve user safety, especially during crisis scenarios.

## Prerequisites

1. **Firebase Project Setup**
   - Firebase project created: `alchm-digital-sanctuary`
   - Firebase SDK configured in mobile apps
   - Google Services configuration files added

2. **Required Firebase Services**
   - Firebase Crashlytics
   - Firebase Test Lab
   - Firebase Analytics (for crash context)
   - Firebase Performance Monitoring

## Configuration Files

### 1. Firebase Crashlytics Configuration

**Location:** `/firebase-crashlytics.json`

This configuration enables trauma-informed crash reporting with:
- Privacy-first data collection
- Sensitive data filtering
- Crisis context tracking
- Anonymous user identification

Key privacy features:
- `filter_journal_content: true` - Excludes journal text from crash reports
- `anonymize_user_data: true` - Removes personal identifiers
- `crisis_context_only: true` - Focuses on crisis safety data

### 2. Firebase Test Lab Configuration

**Location:** `/firebase-testlab.json`

Configures comprehensive mobile testing across:
- **Android Devices:** Pixel2, Pixel4, Pixel6 (API 28, 30, 33)
- **iOS Devices:** iPhone 8, iPhone 13 Pro, iPhone 15 Pro

**Critical Test Scenarios:**
- Crisis intervention flows
- Offline functionality
- Accessibility features
- Performance under stress

## Mobile App Integration

### Android Integration

#### Build Configuration Updates

1. **Project-level `build.gradle`:**
```gradle
dependencies {
    classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
}
```

2. **App-level `build.gradle`:**
```gradle
apply plugin: 'com.google.firebase.crashlytics'

dependencies {
    implementation 'com.google.firebase:firebase-crashlytics:18.6.1'
    implementation 'com.google.firebase:firebase-analytics:21.5.0'
}
```

#### Privacy-Preserving ProGuard Rules

Updated `/android/app/proguard-rules.pro` with:
- Firebase Crashlytics compatibility
- Sensitive data exclusion rules
- Journal content protection

#### Java Implementation

**`CrashlyticsInitializer.java`** provides:
- Privacy-first initialization
- Trauma-informed context setting
- Crisis error prioritization
- Sensitive data sanitization

### iOS Integration

**Podfile configuration:**
```ruby
pod 'CapacitorFirebaseCrashlytics', :path => '../../node_modules/@capacitor-firebase/crashlytics'
```

#### Symbol Upload Scripts

**`/scripts/upload-symbols-ios.sh`:**
- Automated dSYM file upload
- Privacy validation
- Archive symbol extraction

**`/scripts/upload-symbols-android.sh`:**
- ProGuard mapping file upload
- Native library symbol handling
- Build artifact validation

## Testing Framework

### Crisis Scenarios Testing

**`ALCHMCrisisTestFramework.java`** tests:
1. **Crisis Resource Access** - Emergency resources availability
2. **Panic Attack Navigation** - Simplified UI during stress
3. **Emergency Contact Flow** - Emergency calling functionality
4. **Offline Crisis Support** - Offline resource availability
5. **Safe Space Verification** - Consistent safety indicators
6. **App Stability Under Stress** - Rapid navigation resilience
7. **Crisis Button Accessibility** - Accessibility compliance

### Automated Test Execution

**`/scripts/crisis-scenarios-test.sh`:**
- Comprehensive crisis testing automation
- Performance validation during crisis
- Accessibility testing for trauma responses
- Privacy protection verification

### Firebase Test Lab Integration

**`/scripts/run-firebase-testlab.sh`:**
- Device matrix execution
- Cross-platform testing
- Automated result collection
- Trauma-informed test reporting

## Privacy & Security Features

### Data Protection During Crash Reporting

1. **Sensitive Data Filtering:**
   - Journal content automatically excluded
   - Personal information sanitized
   - Email/phone number redaction

2. **Anonymous User Identification:**
   - User IDs hashed before transmission
   - No personally identifiable information
   - Crisis context without personal details

3. **Trauma-Informed Logging:**
   - Crisis scenarios prioritized
   - Safe space context included
   - Emergency contact privacy protected

### Crisis-Specific Features

1. **Crisis Error Prioritization:**
   - Crisis-related crashes marked as critical
   - Emergency resource failures get immediate attention
   - Panic scenario errors fast-tracked

2. **Offline Crisis Support:**
   - Offline crash data collection
   - Local crisis resource validation
   - Network-independent error reporting

## Deployment Instructions

### Step 1: Add Firebase Configuration Files

**Android:**
```bash
# Add google-services.json to:
android/app/google-services.json
```

**iOS:**
```bash
# Add GoogleService-Info.plist to:
ios/App/App/GoogleService-Info.plist
```

### Step 2: Install Dependencies

```bash
# Install Capacitor Firebase plugins
npm install @capacitor-firebase/crashlytics @capacitor-firebase/analytics @capacitor-firebase/performance

# Sync with mobile projects
npx cap sync
```

### Step 3: Build and Deploy

```bash
# Build mobile apps with Crashlytics enabled
cd android && ./gradlew assembleRelease
cd ../ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release

# Run symbol upload scripts
./scripts/upload-symbols-android.sh
./scripts/upload-symbols-ios.sh
```

### Step 4: Validate Integration

```bash
# Run crisis scenarios testing
./scripts/crisis-scenarios-test.sh

# Execute Firebase Test Lab testing
./scripts/run-firebase-testlab.sh
```

## Monitoring & Analytics

### Crashlytics Dashboard

Monitor crash data at:
`https://console.firebase.google.com/project/alchm-digital-sanctuary/crashlytics`

Key metrics to track:
- Crisis-related crash frequency
- Emergency resource access failures
- Offline functionality issues
- Accessibility-related problems

### Test Lab Results

View test results at:
`https://console.firebase.google.com/project/alchm-digital-sanctuary/testlab`

Focus areas:
- Crisis scenario success rates
- Cross-device compatibility
- Performance during stress testing
- Accessibility compliance scores

## Trauma-Informed Considerations

### User Safety First

1. **Crisis Prioritization:** Crisis-related issues get immediate attention
2. **Privacy Protection:** No sensitive journal content ever transmitted
3. **Offline Support:** Crisis features work without internet connectivity
4. **Accessibility Focus:** Crisis buttons and resources are fully accessible

### Development Guidelines

1. **Never Log Journal Content:** Ensure journal text never appears in crash reports
2. **Sanitize Error Messages:** Remove potentially sensitive information from stack traces
3. **Test Crisis Scenarios:** Prioritize testing of emergency and crisis flows
4. **Validate Privacy:** Regular audits of crash data to ensure privacy compliance

## Troubleshooting

### Common Issues

1. **Crashlytics Not Initialized:**
   - Verify google-services.json/GoogleService-Info.plist are present
   - Check Firebase project configuration
   - Ensure Crashlytics dependency is added

2. **Symbol Upload Failures:**
   - Verify Firebase CLI authentication
   - Check dSYM/mapping file paths
   - Validate ProGuard configuration

3. **Test Lab Execution Issues:**
   - Confirm Firebase project has Test Lab enabled
   - Check APK/IPA build success
   - Verify device matrix configuration

4. **Privacy Violations in Crash Reports:**
   - Review sanitization functions
   - Check breadcrumb messages
   - Validate custom key values

### Support Resources

- Firebase Crashlytics Documentation: https://firebase.google.com/docs/crashlytics
- Firebase Test Lab Documentation: https://firebase.google.com/docs/test-lab
- ALCHM Privacy Policy: `/public/privacy-policy.html`

## Next Steps

1. **Deploy Configuration:** Add Firebase configuration files to mobile apps
2. **Test Integration:** Run crisis scenarios testing suite
3. **Monitor Performance:** Track crash data and test results
4. **Iterate & Improve:** Continuously improve based on crash analytics

---

**Important:** This setup prioritizes user safety and privacy while providing comprehensive crash reporting for improving the ALCHM experience during users' most vulnerable moments.