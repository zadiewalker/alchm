# ALCHM Accessibility Testing Guide

## Comprehensive Testing for Trauma-Informed Mental Health Applications

This guide provides detailed testing procedures for ensuring ALCHM meets WCAG 2.1 AA standards with trauma-informed considerations for users accessing the application during crisis moments.

---

## 🎯 Testing Philosophy

**Every accessibility feature must work during a mental health crisis.** Our testing approach assumes users may be:
- Experiencing panic attacks or anxiety
- Having trembling hands or motor difficulties  
- Dealing with blurred vision from tears
- In dissociative states
- Using older or damaged devices
- On slow network connections

---

## 🛠️ Testing Tools Required

### Screen Reader Testing
- **NVDA (Windows)** - Primary testing screen reader (free)
- **JAWS (Windows)** - Secondary testing (trial version)
- **VoiceOver (macOS/iOS)** - Apple ecosystem testing
- **TalkBack (Android)** - Android accessibility testing

### Browser Testing Extensions
- **axe DevTools** - Automated accessibility scanning
- **WAVE Web Accessibility Evaluation Tool**
- **Lighthouse** - Built into Chrome DevTools
- **Color Contrast Analyser** - Paciello Group tool

### Mobile Testing Tools
- **iOS Simulator** with VoiceOver enabled
- **Android Emulator** with TalkBack enabled
- **Real devices** for authentic touch testing
- **BrowserStack** for cross-device testing

### Color and Contrast Testing
- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser (TPG)** - Desktop application
- **Stark** - Figma/Sketch plugin for designers

---

## 📋 Pre-Testing Setup

### 1. Enable Accessibility Features

#### Windows Setup
```bash
# Install NVDA screen reader
# Download from: https://www.nvaccess.org/download/

# Enable Windows accessibility features
# Settings > Ease of Access > Narrator (for initial testing)
```

#### macOS Setup
```bash
# Enable VoiceOver
# System Preferences > Accessibility > VoiceOver > Enable VoiceOver
# Shortcut: Cmd + F5

# Enable other accessibility features for testing
# System Preferences > Accessibility > Display > Increase Contrast
# System Preferences > Accessibility > Display > Reduce Motion
```

#### Browser Setup
```javascript
// Install browser extensions
// - axe DevTools (Chrome/Firefox)
// - WAVE (Chrome/Firefox)
// - Lighthouse (built into Chrome)

// Enable browser accessibility features
// Chrome: chrome://settings/accessibility
// Firefox: about:preferences#general (Accessibility section)
```

### 2. Development Environment Setup

```bash
# Install accessibility testing dependencies
npm install --save-dev @axe-core/playwright @testing-library/jest-dom

# Add to package.json scripts
"test:a11y": "npm run test:accessibility",
"test:sr": "npm run test:screen-reader",
"test:mobile-a11y": "npm run test:mobile-accessibility"
```

---

## 🔍 Automated Testing

### 1. Built-in Audit Tool

ALCHM includes a comprehensive accessibility audit tool:

```tsx
import { AccessibilityAuditTool } from '@/components/accessibility';

// Add to any page during development
function DevPage() {
  return (
    <div>
      <AccessibilityAuditTool />
      {/* Your page content */}
    </div>
  );
}
```

**Testing Procedure:**
1. Navigate to the page under test
2. Click "Run Audit" in the AccessibilityAuditTool
3. Review all errors and warnings
4. Address critical and crisis-impact issues first
5. Export report for documentation

### 2. Playwright Accessibility Testing

```javascript
// tests/accessibility.spec.js
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests', () => {
  test('should not have any accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('crisis mode accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Enable crisis mode
    await page.click('[data-testid="enable-crisis-mode"]');
    
    // Wait for crisis mode to activate
    await page.waitForSelector('.crisis-mode');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### 3. Jest Accessibility Tests

```javascript
// tests/accessibility.test.js
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import JournalPage from '../pages/journal';

expect.extend(toHaveNoViolations);

test('Journal page should be accessible', async () => {
  const { container } = render(<JournalPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Crisis mode should maintain accessibility', async () => {
  const { container } = render(
    <AccessibilityProvider initialCrisisMode={true}>
      <JournalPage />
    </AccessibilityProvider>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 🎯 Manual Testing Procedures

### 1. Keyboard Navigation Testing

**Primary Test (No Mouse/Touch)**
1. Unplug your mouse or disable trackpad
2. Navigate the entire application using only keyboard
3. Verify all interactive elements are reachable
4. Check focus indicators are clearly visible

**Testing Checklist:**
- [ ] Tab key moves focus to all interactive elements
- [ ] Shift+Tab moves focus backwards correctly
- [ ] Arrow keys work for menu/list navigation
- [ ] Enter/Space activate buttons and links
- [ ] Escape key closes modals and menus
- [ ] Focus indicators have sufficient contrast
- [ ] Focus order is logical and intuitive

**Crisis Mode Keyboard Testing:**
- [ ] Ctrl/Cmd+H activates crisis help
- [ ] Alt+E activates emergency mode
- [ ] Crisis resources reachable within 3 tab stops
- [ ] All crisis functions work keyboard-only

#### Keyboard Navigation Script
```javascript
// Automated keyboard testing helper
function testKeyboardNavigation() {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  let currentIndex = 0;
  
  function nextElement() {
    if (currentIndex < focusableElements.length - 1) {
      currentIndex++;
      focusableElements[currentIndex].focus();
    }
  }
  
  function previousElement() {
    if (currentIndex > 0) {
      currentIndex--;
      focusableElements[currentIndex].focus();
    }
  }
  
  // Test each element is focusable
  focusableElements.forEach((element, index) => {
    element.focus();
    const focused = document.activeElement;
    console.log(`Element ${index}: ${focused === element ? 'PASS' : 'FAIL'}`);
  });
}
```

### 2. Screen Reader Testing

#### NVDA Testing (Windows)

**Basic Navigation Test:**
1. Open NVDA (Ctrl+Alt+N)
2. Navigate to ALCHM application
3. Use reading mode (NVDA+Space to toggle)
4. Test all major page sections

**NVDA Key Commands:**
- `NVDA+Ctrl+Enter` - Say current line
- `H` - Next heading
- `Shift+H` - Previous heading
- `K` - Next link
- `B` - Next button
- `F` - Next form field
- `NVDA+F7` - Elements list
- `NVDA+T` - Read title

**Testing Script:**
```
1. Load journal page
2. Press H to navigate through headings
3. Verify heading hierarchy is logical (H1 > H2 > H3)
4. Press F to navigate form fields
5. Verify all fields have proper labels
6. Test crisis button (should announce emergency function)
7. Enable crisis mode and verify announcements
8. Test journal entry with screen reader
```

#### VoiceOver Testing (macOS/iOS)

**Desktop VoiceOver Commands:**
- `Cmd+F5` - Toggle VoiceOver
- `Ctrl+Alt+A` - Start reading
- `Ctrl+Alt+Right Arrow` - Next element
- `Ctrl+Alt+Space` - Activate element
- `Ctrl+Alt+U` - Rotor (elements list)

**iOS VoiceOver Commands:**
- `Triple-click home/side button` - Toggle VoiceOver
- `Swipe right` - Next element
- `Swipe left` - Previous element
- `Double tap` - Activate element
- `Rotor gesture` - Navigate by element type

### 3. Color Contrast Testing

**Manual Testing Procedure:**
1. Use WebAIM Contrast Checker for spot checks
2. Test all text/background combinations
3. Verify 4.5:1 ratio for normal text
4. Verify 3:1 ratio for large text (18px+ or 14px+ bold)

**Crisis Mode Contrast Testing:**
- [ ] Crisis button text clearly readable
- [ ] Emergency contact information high contrast
- [ ] Error messages meet AA standards
- [ ] Focus indicators visible on all backgrounds

**Automated Contrast Testing:**
```javascript
// Color contrast validation function
function validateColorContrast() {
  const elements = document.querySelectorAll('*');
  const violations = [];
  
  elements.forEach(element => {
    const style = window.getComputedStyle(element);
    const textColor = style.color;
    const bgColor = style.backgroundColor;
    
    if (textColor && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      const ratio = calculateContrastRatio(textColor, bgColor);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;
      
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
      const requiredRatio = isLargeText ? 3 : 4.5;
      
      if (ratio < requiredRatio) {
        violations.push({
          element,
          ratio,
          required: requiredRatio,
          textColor,
          bgColor
        });
      }
    }
  });
  
  return violations;
}
```

### 4. Mobile Accessibility Testing

**Touch Target Testing:**
1. Test on actual mobile devices (not just desktop simulators)
2. Use your thumb to navigate (not index finger)
3. Test with screen gloves or stylus
4. Verify 44px minimum touch targets (52px in crisis mode)

**Mobile Testing Checklist:**
- [ ] All buttons easily tappable with thumb
- [ ] Adequate spacing between touch targets
- [ ] Pinch-to-zoom functionality works
- [ ] Text remains readable at 200% zoom
- [ ] Crisis button accessible in landscape/portrait
- [ ] Emergency shake detection works (if applicable)
- [ ] Voice input functions properly

**iOS Mobile Testing:**
```bash
# Enable iOS accessibility features
Settings > Accessibility > VoiceOver > On
Settings > Accessibility > Touch > AssistiveTouch > On
Settings > Accessibility > Display & Text Size > Button Shapes > On
```

**Android Mobile Testing:**
```bash
# Enable Android accessibility features
Settings > Accessibility > TalkBack > On
Settings > Accessibility > Touch & hold delay > Long
Settings > Accessibility > High contrast text > On
```

### 5. Crisis Scenario Testing

**Simulated Crisis Conditions:**
1. **Trembling Hands Test:**
   - Shake your hands while using the application
   - Test if buttons remain easily clickable
   - Verify no accidental activations

2. **Blurred Vision Test:**
   - Use petroleum jelly on glasses or blur eyes
   - Test if text is still readable
   - Verify high contrast mode helps

3. **Rapid Breathing Test:**
   - Hyperventilate slightly (safely!)
   - Test if breathing indicators are calming
   - Verify crisis resources easily accessible

4. **Cognitive Load Test:**
   - Perform mental math while using app
   - Test if interface remains simple
   - Verify crisis mode reduces complexity

**Crisis Mode Testing Script:**
```javascript
// Crisis mode accessibility validation
function testCrisisMode() {
  // Enable crisis mode
  document.querySelector('[data-crisis-mode-toggle]')?.click();
  
  // Wait for activation
  setTimeout(() => {
    // Test crisis button accessibility
    const crisisButton = document.querySelector('[data-crisis-help]');
    if (!crisisButton) {
      console.error('FAIL: Crisis button not found');
      return;
    }
    
    // Test touch target size
    const rect = crisisButton.getBoundingClientRect();
    if (rect.width < 52 || rect.height < 52) {
      console.error('FAIL: Crisis button too small');
    }
    
    // Test keyboard accessibility
    crisisButton.focus();
    if (document.activeElement !== crisisButton) {
      console.error('FAIL: Crisis button not focusable');
    }
    
    // Test ARIA attributes
    if (!crisisButton.getAttribute('aria-label')) {
      console.error('FAIL: Crisis button missing ARIA label');
    }
    
    console.log('Crisis mode accessibility test complete');
  }, 1000);
}
```

---

## 🔄 Testing Workflow

### Daily Testing (During Development)
1. **Quick Accessibility Scan** (5 minutes)
   - Run built-in audit tool on current page
   - Check keyboard navigation of new elements
   - Verify new content has proper headings/labels

2. **Focus Management Test** (3 minutes)
   - Tab through page to verify focus order
   - Test Escape key functionality
   - Check focus indicators are visible

3. **Crisis Button Test** (2 minutes)
   - Verify crisis button present and functional
   - Test keyboard activation (multiple keys)
   - Check touch target size on mobile

### Weekly Testing (Comprehensive)
1. **Screen Reader Testing** (30 minutes)
   - Test with NVDA or VoiceOver
   - Navigate major user flows
   - Verify form announcements

2. **Mobile Accessibility** (20 minutes)
   - Test on real devices
   - Check touch targets and spacing
   - Verify zoom functionality

3. **Color Contrast Audit** (15 minutes)
   - Automated contrast checking
   - Manual verification of key elements
   - Test in different lighting conditions

### Pre-Release Testing (Full Audit)
1. **Complete WCAG 2.1 AA Audit** (2-3 hours)
   - Automated testing with axe
   - Manual testing with screen readers
   - Keyboard-only navigation test
   - Mobile accessibility verification
   - Crisis scenario testing

2. **User Testing with Disabilities** (4-6 hours)
   - Test with actual users who use assistive technologies
   - Include users with various disabilities
   - Test in crisis simulation scenarios
   - Gather qualitative feedback

3. **Performance Impact Testing** (1 hour)
   - Verify accessibility features don't slow app
   - Test on low-end devices
   - Check crisis mode performance

---

## 📊 Testing Documentation

### Test Report Template

```markdown
# Accessibility Test Report

**Date:** [Date]
**Tester:** [Name]
**Browser:** [Browser/Version]
**Device:** [Device/OS]

## Summary
- Total Issues Found: [Number]
- Critical: [Number]
- Major: [Number]
- Minor: [Number]
- Crisis-Impact Issues: [Number]

## WCAG 2.1 Compliance
- Level A: [Pass/Fail]
- Level AA: [Pass/Fail]
- Trauma-Informed Score: [0-100]

## Screen Reader Testing
- NVDA: [Pass/Fail/Notes]
- VoiceOver: [Pass/Fail/Notes]
- Content announcement: [Quality rating]

## Keyboard Navigation
- Tab order: [Pass/Fail]
- Focus indicators: [Pass/Fail]
- Crisis shortcuts: [Pass/Fail]

## Mobile Accessibility
- Touch targets: [Pass/Fail]
- Zoom functionality: [Pass/Fail]
- Orientation support: [Pass/Fail]

## Crisis Mode Testing
- Emergency access: [Pass/Fail]
- Simplified interface: [Pass/Fail]
- Motion reduction: [Pass/Fail]

## Issues Found
[Detailed list of issues with severity and recommendations]

## Recommendations
[Prioritized list of improvements]
```

### Automated Testing Reports

The built-in AccessibilityAuditTool generates detailed JSON reports:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "pageTitle": "ALCHM Journal",
  "summary": {
    "total": 3,
    "errors": 1,
    "warnings": 2,
    "passed": 18,
    "crisisCritical": 1
  },
  "wcagLevel": "AA",
  "traumaInformedScore": 85,
  "issues": [...]
}
```

---

## 🚨 Critical Issue Response

### Immediate Action Items (Critical Issues)
1. **Crisis Button Not Accessible**
   - Stop all development
   - Fix keyboard/screen reader access
   - Test with real assistive technologies

2. **Color Contrast Below 3:1**
   - Identify all failing combinations
   - Update color tokens
   - Re-test entire application

3. **Form Without Labels**
   - Add ARIA labels immediately
   - Test with screen readers
   - Verify error announcements

4. **Keyboard Trap**
   - Identify trapping elements
   - Fix focus management
   - Test all escape routes

### Issue Escalation Process
1. **Critical (Crisis-Impact):** Immediate fix required
2. **Major (WCAG AA Failure):** Fix within 24 hours
3. **Minor (Best Practice):** Fix in next sprint
4. **Enhancement:** Add to backlog

---

## 📚 Resources and Training

### Learning Resources
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

### Testing Communities
- [WebAIM Discussion List](https://webaim.org/discussion/)
- [A11y Slack Community](https://web-a11y.slack.com/)
- [Accessibility Testing Facebook Group](https://www.facebook.com/groups/accessibilitytesting/)

### Specialized Training for Crisis Applications
- Crisis intervention accessibility best practices
- Trauma-informed design principles
- Emergency interface design patterns
- Assistive technology for mental health

---

## 🤝 Getting Help

### When You're Stuck
1. **Check this guide** for common solutions
2. **Use the built-in audit tool** for automated detection
3. **Test with actual screen readers** for real-world validation
4. **Consult WCAG guidelines** for standards compliance
5. **Reach out to accessibility community** for expert advice

### Remember: Every Accessibility Feature Must Work During a Crisis
The life of someone experiencing a mental health emergency may depend on your accessibility implementation. Test everything with this critical perspective in mind.

---

**Never ship accessibility features without testing them with real assistive technologies and, when possible, real users with disabilities.**