# ALCHM Android Testing Documentation

## Testing Strategy Overview

ALCHM employs a comprehensive testing strategy specifically designed for trauma-informed mental health applications.

## Test Types

### 1. Unit Tests (`src/test/`)
- **Purpose**: Test individual components in isolation
- **Focus Areas**: 
  - Data encryption/decryption
  - Privacy compliance validation  
  - Core business logic
  - Utility functions
- **Tools**: JUnit, Mockito, Robolectric

### 2. Integration Tests (`src/androidTest/`)
- **Purpose**: Test component interactions
- **Focus Areas**:
  - Database operations
  - Network communication
  - File system access
  - Security implementations
- **Tools**: Espresso, AndroidJUnit4

### 3. UI Tests (`src/androidTest/ui/`)
- **Purpose**: Test user interface and interactions
- **Focus Areas**:
  - Trauma-informed design validation
  - Accessibility compliance
  - WebView functionality
  - User journey flows
- **Tools**: Espresso, UI Automator, WebDriver

### 4. Accessibility Tests
- **Purpose**: Ensure inclusive design
- **Focus Areas**:
  - TalkBack compatibility
  - Content descriptions
  - Touch target sizes
  - Color contrast ratios
- **Tools**: Espresso Accessibility, AccessibilityChecks

## Mental Health App Specific Testing

### Privacy & Security Testing
- [ ] Journal entries never appear in logs
- [ ] Data is encrypted at rest and in transit
- [ ] No sensitive data in crash reports
- [ ] Secure authentication validation
- [ ] Third-party integration privacy

### Trauma-Informed Design Testing
- [ ] UI colors are calming and non-triggering
- [ ] Navigation provides safe exit options
- [ ] Content warnings display appropriately
- [ ] Crisis resources are easily accessible
- [ ] Text and imagery are supportive

### Compliance Testing
- [ ] HIPAA-informed data handling
- [ ] Age verification for mature content
- [ ] Privacy policy accessibility
- [ ] Terms of service clarity
- [ ] Data deletion functionality

## Test Execution

### Local Testing
```bash
# Run all tests
npm run android:test:all

# Run specific test types
npm run android:test:unit
npm run android:test:integration
npm run android:test:ui
npm run android:test:accessibility

# Generate coverage reports
npm run android:test:coverage
```

### CI/CD Testing
Tests are automatically run on:
- Pull request creation
- Merge to main branch
- Release candidate builds
- Scheduled daily runs

### Device Testing
- **Physical Devices**: Test on real Android devices
- **Emulators**: Various Android versions and screen sizes
- **Cloud Testing**: Firebase Test Lab integration
- **Accessibility**: Real screen readers and assistive technology

## Test Data Management

### Mock Data
- Safe, non-triggering journal content examples
- Diverse user personas for testing
- Privacy-compliant test scenarios

### Test Database
- Encrypted test data sets
- Realistic usage patterns
- Performance benchmarking data

## Reporting and Metrics

### Test Coverage
- Target: >90% code coverage
- Critical paths: 100% coverage
- Privacy/security code: 100% coverage

### Performance Metrics
- App launch time < 2 seconds
- UI response time < 100ms
- Memory usage monitoring
- Battery usage optimization

### Accessibility Metrics
- All UI elements have content descriptions
- Minimum touch target size: 48dp
- Color contrast ratio: 4.5:1 minimum
- TalkBack navigation completeness