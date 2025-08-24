# ALCHM Android Internal Testing Guide

## Google Play Console Internal Testing Setup

### 1. Internal Testing Track
Internal testing allows you to distribute your app to up to 100 internal testers without review.

**Setup Steps:**
1. Go to Google Play Console → Your App → Testing → Internal testing
2. Create new release or manage existing releases
3. Upload signed APK/AAB file
4. Add release notes describing trauma-informed features
5. Add internal testers by email address

### 2. Testing Focus Areas

#### Mental Health App Compliance
- [ ] Content warnings display correctly
- [ ] Crisis resources are easily accessible  
- [ ] Privacy policy is prominent and accessible
- [ ] Data encryption works end-to-end
- [ ] No sensitive data appears in logs

#### Trauma-Informed Design Validation
- [ ] UI colors are gentle and non-triggering
- [ ] Navigation provides clear exit options
- [ ] Text is readable and not overwhelming
- [ ] Animations are smooth and calming
- [ ] Sound/vibration alerts are optional

#### Accessibility Testing
- [ ] TalkBack screen reader works correctly
- [ ] All UI elements have content descriptions
- [ ] Text scales properly with system font size
- [ ] High contrast mode is supported
- [ ] Touch targets meet minimum size requirements

#### Core Functionality Testing
- [ ] Journaling works offline and syncs properly
- [ ] Mood tracking data persists correctly
- [ ] AI insights are helpful and appropriate
- [ ] User data export/deletion works
- [ ] App performance is smooth on older devices

### 3. Test Device Coverage
Test on various Android versions and screen sizes:
- **Android 6.0+ (API 23+)**: Minimum supported version
- **Android 14 (API 34)**: Target version
- **Small screens**: 4.7" phones
- **Large screens**: 6.5"+ phones and tablets
- **Different manufacturers**: Samsung, Google Pixel, OnePlus, etc.

### 4. Internal Tester Feedback Collection
Create structured feedback forms covering:
- Trauma-informed design effectiveness
- Accessibility and usability
- Privacy and security concerns
- Performance and stability
- Feature requests and improvements

### 5. Release Candidates
Use internal testing to validate:
- **Alpha builds**: Core functionality and basic UI
- **Beta builds**: Complete features with final UI
- **Release candidates**: Final builds ready for production

### 6. Testing Automation
Run automated tests before each internal release:
```bash
# Run all tests
npm run android:test:all

# Run accessibility tests specifically  
npm run android:test:accessibility

# Generate test reports
npm run android:test:report
```

### 7. Data Privacy Testing
Special attention for mental health apps:
- Verify no journal content appears in crash logs
- Test data encryption at rest and in transit
- Validate secure user authentication
- Check for any data leaks to third parties