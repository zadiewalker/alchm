# ALCHM Accessibility Implementation Guide

## WCAG 2.1 AA Compliance for Trauma-Informed Mental Health Applications

This comprehensive guide provides implementation details for the accessibility system designed specifically for ALCHM, ensuring WCAG 2.1 AA compliance with trauma-informed design principles.

---

## 🎯 Overview

ALCHM's accessibility system is designed with the understanding that users may be accessing the application during their most vulnerable moments - panic attacks, dissociative episodes, crisis situations, or while experiencing physical symptoms of distress. Every accessibility feature is tested under stress conditions.

### Core Principles

1. **Crisis-First Design**: Every accessibility feature works during mental health crises
2. **Trauma-Informed**: Designed for users experiencing trauma symptoms
3. **Multi-Modal Access**: Works with all assistive technologies
4. **Progressive Enhancement**: Graceful degradation on older devices
5. **Zero-Barrier Emergency Access**: Crisis resources accessible without barriers

---

## 🚀 Quick Start

### 1. Basic Setup

```tsx
// app/layout.tsx
import { AccessibilityProvider } from '@/components/accessibility';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AccessibilityProvider initialCrisisMode={false}>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
```

### 2. Page-Level Implementation

```tsx
// pages/journal.tsx
import { 
  ScreenReaderSupport, 
  KeyboardNavigation,
  TraumaInformedMotionControls,
  MobileAccessibilityOptimizations 
} from '@/components/accessibility';

export default function JournalPage() {
  return (
    <TraumaInformedMotionControls>
      <MobileAccessibilityOptimizations>
        <ScreenReaderSupport 
          pageTitle="Sacred Journal Space" 
          pageDescription="A safe space for your thoughts and reflections"
        >
          <KeyboardNavigation enableArrowNavigation={false} focusTrapEnabled={false}>
            <main id="main-content" className="journal-page">
              {/* Your page content */}
            </main>
          </KeyboardNavigation>
        </ScreenReaderSupport>
      </MobileAccessibilityOptimizations>
    </TraumaInformedMotionControls>
  );
}
```

### 3. Form Implementation

```tsx
import { AccessibleForm, AccessibleTextarea, AccessibleInput } from '@/components/accessibility';

function JournalForm() {
  const validateJournal = (data: FormData) => {
    const content = data.get('journal') as string;
    if (!content || content.length < 10) {
      return {
        isValid: false,
        errors: ['Please write at least 10 characters to begin your reflection'],
        warnings: []
      };
    }
    return { isValid: true, errors: [], warnings: [] };
  };

  return (
    <AccessibleForm 
      validation={validateJournal}
      onSubmit={(data) => saveJournal(data)}
      crisisMode={false}
    >
      <AccessibleTextarea
        name="journal"
        label="Your Sacred Space"
        description="Write freely about your thoughts, feelings, or experiences. This space is private and secure."
        placeholder="What's on your mind today?"
        required
        rows={8}
        maxLength={5000}
      />
      
      <AccessibleInput
        name="mood"
        label="Current Mood (Optional)"
        description="One word to describe how you're feeling right now"
        placeholder="Peaceful, anxious, hopeful..."
      />
    </AccessibleForm>
  );
}
```

---

## 🛡️ Crisis Support Implementation

### Floating Crisis Button

```tsx
import { FloatingCrisisButton } from '@/components/accessibility';

// Add to your main layout or any page
export default function Layout({ children }) {
  return (
    <div>
      {children}
      <FloatingCrisisButton />
    </div>
  );
}
```

### Crisis Mode Detection

```tsx
import { useAccessibility } from '@/components/accessibility';

function MyComponent() {
  const { settings, enableCrisisMode, enableEmergencyMode } = useAccessibility();

  // Auto-detect crisis keywords in journal entries
  const handleJournalChange = (content: string) => {
    const crisisKeywords = ['suicide', 'kill myself', 'end it', 'can\'t go on'];
    const hasCrisisContent = crisisKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisContent && !settings.crisisMode) {
      enableCrisisMode();
    }
  };

  return (
    <div className={settings.crisisMode ? 'crisis-mode-active' : ''}>
      {/* Component content */}
    </div>
  );
}
```

---

## 📱 Mobile Accessibility

### Touch Target Optimization

```tsx
// Automatic touch target optimization
import { MobileAccessibilityOptimizations } from '@/components/accessibility';

function MobileJournal() {
  return (
    <MobileAccessibilityOptimizations>
      {/* All buttons automatically get appropriate touch targets */}
      <button className="journal-save-btn">
        Save Entry
      </button>
      
      {/* Crisis mode increases all touch targets automatically */}
      <button data-crisis-help className="crisis-button">
        Get Help Now
      </button>
    </MobileAccessibilityOptimizations>
  );
}
```

### Shake Detection for Emergency

The mobile optimizations automatically detect device shaking in crisis mode and activate emergency protocols.

---

## 🎭 Motion and Animation Controls

### Basic Implementation

```tsx
import { TraumaInformedMotionControls } from '@/components/accessibility';

function App() {
  return (
    <TraumaInformedMotionControls 
      enableMotionDetection={true}
      crisisMotionReduction={true}
    >
      <div className="app-content">
        {/* Animations automatically respect motion preferences */}
        <div className="animate-fade-in">
          Content here
        </div>
      </div>
    </TraumaInformedMotionControls>
  );
}
```

### CSS Integration

Add to your global CSS:

```css
/* Import the motion control styles */
@import '/src/components/accessibility/TraumaInformedMotionControls';

/* Use CSS custom properties for motion-safe animations */
.my-animation {
  animation-duration: var(--motion-duration, 300ms);
  transform: translateX(var(--motion-distance, 10px));
  transition-duration: var(--transition-duration, 0.3s);
}

/* Crisis-safe animations */
.emergency-pulse {
  animation: crisis-pulse var(--healing-heartbeat, 1.618s) ease-in-out infinite;
}

@keyframes crisis-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## 🔍 Testing and Auditing

### Built-in Audit Tool

```tsx
import { AccessibilityAuditTool } from '@/components/accessibility';

function DevMode() {
  return (
    <div>
      {process.env.NODE_ENV === 'development' && (
        <AccessibilityAuditTool />
      )}
    </div>
  );
}
```

### Manual Testing Checklist

#### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac/iOS)
- [ ] Verify all content is announced correctly
- [ ] Test crisis mode announcements
- [ ] Verify form error announcements

#### Keyboard Navigation Testing
- [ ] Tab through all interactive elements
- [ ] Test arrow key navigation where applicable
- [ ] Verify focus indicators are visible
- [ ] Test escape key functionality
- [ ] Test crisis mode keyboard shortcuts

#### Mobile Testing
- [ ] Test on actual devices, not just simulators
- [ ] Verify touch targets are at least 44px (52px in crisis mode)
- [ ] Test with trembling hands simulation
- [ ] Test landscape and portrait orientations
- [ ] Verify zoom functionality doesn't break layout

#### Crisis Scenario Testing
- [ ] Enable crisis mode and test all functionality
- [ ] Test emergency button accessibility
- [ ] Verify crisis resource links work
- [ ] Test motion sensitivity features
- [ ] Verify simplified interface works

---

## 🎨 Color Contrast Implementation

### Using Accessible Colors

```tsx
// Use the predefined accessible color classes
<div className="bg-accessible-light text-accessible-dark">
  {/* WCAG AA compliant contrast */}
</div>

<div className="bg-accessible-sage text-accessible-light">
  {/* Sage theme with proper contrast */}
</div>

// Crisis mode colors
<div className="bg-accessible-error text-accessible-error">
  {/* Crisis-safe error colors */}
</div>
```

### Custom Color Validation

```css
/* Use CSS custom properties for consistent contrast */
:root {
  /* These provide 4.5:1 minimum contrast ratio */
  --text-primary: var(--a11y-gray-900);
  --text-secondary: var(--a11y-gray-700);
  --bg-primary: var(--a11y-white);
  --bg-secondary: var(--a11y-gray-50);
}

/* Crisis mode overrides */
.crisis-mode {
  --text-primary: var(--a11y-crisis-red-text);
  --bg-primary: var(--a11y-crisis-red-light);
}
```

---

## 🔧 Advanced Customization

### Custom Accessibility Settings

```tsx
import { useAccessibility } from '@/components/accessibility';

function CustomAccessibilityControls() {
  const { settings, updateSettings } = useAccessibility();

  const handleCustomSetting = (setting: string, value: any) => {
    updateSettings({ [setting]: value });
    
    // Custom logic for specific settings
    if (setting === 'fontSize' && value === 'crisis') {
      // Additional crisis-specific adjustments
      document.body.style.lineHeight = '1.8';
    }
  };

  return (
    <div>
      <button onClick={() => handleCustomSetting('fontSize', 'crisis')}>
        Emergency Text Size
      </button>
    </div>
  );
}
```

### Custom Screen Reader Announcements

```tsx
import { useAccessibility } from '@/components/accessibility';

function JournalComponent() {
  const { announceToScreenReader } = useAccessibility();

  const handleSave = async () => {
    try {
      await saveJournal();
      announceToScreenReader('Journal entry saved successfully', 'polite');
    } catch (error) {
      announceToScreenReader('Failed to save journal entry. Please try again.', 'assertive');
    }
  };

  return (
    <button onClick={handleSave}>
      Save Journal
    </button>
  );
}
```

---

## 📊 Performance Considerations

### Bundle Size Optimization

The accessibility system is designed to be tree-shakable:

```tsx
// Import only what you need
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { AccessibleInput } from '@/components/accessibility/AccessibleForms';

// Avoid importing everything
// import * from '@/components/accessibility'; // ❌ Don't do this
```

### Crisis Mode Performance

```tsx
// Crisis mode automatically:
// - Disables non-essential animations
// - Reduces CPU usage
// - Optimizes for battery life
// - Prioritizes critical resources

const { settings } = useAccessibility();

if (settings.crisisMode) {
  // Critical resources only
  // Disable background updates
  // Reduce network requests
}
```

---

## 🚨 Emergency Protocols

### Crisis Detection Triggers

1. **Keyword Detection**: Automatic crisis mode activation
2. **Device Shaking**: Emergency assistance on mobile
3. **Rapid Navigation**: Unusual browsing patterns
4. **Manual Activation**: User-triggered crisis mode

### Emergency Resource Integration

```tsx
// Emergency contact integration
<CrisisAccessibilityButton
  onActivate={() => window.location.href = 'tel:988'}
  variant="emergency"
  emergencyNumber="988"
  customText="Call Crisis Lifeline"
/>

// Auto-dial in emergency mode
const { settings } = useAccessibility();
if (settings.emergencyMode) {
  // Show prominent emergency contacts
  // Reduce cognitive load
  // Simplify all interactions
}
```

---

## 📋 WCAG 2.1 AA Compliance Checklist

### Level A Requirements
- [ ] 1.1.1 Non-text Content - Alt text implemented
- [ ] 1.2.1 Audio-only/Video-only - Media alternatives
- [ ] 1.3.1 Info and Relationships - Semantic markup
- [ ] 1.3.2 Meaningful Sequence - Logical reading order
- [ ] 1.3.3 Sensory Characteristics - Not relying on sensory info alone
- [ ] 1.4.1 Use of Color - Color not sole indicator
- [ ] 1.4.2 Audio Control - No auto-playing audio
- [ ] 2.1.1 Keyboard - Full keyboard access
- [ ] 2.1.2 No Keyboard Trap - Focus not trapped
- [ ] 2.2.1 Timing Adjustable - User control over timing
- [ ] 2.2.2 Pause, Stop, Hide - Control over moving content
- [ ] 2.3.1 Three Flashes - No seizure-inducing content
- [ ] 2.4.1 Bypass Blocks - Skip navigation implemented
- [ ] 2.4.2 Page Titled - Descriptive page titles
- [ ] 2.4.3 Focus Order - Logical focus sequence
- [ ] 2.4.4 Link Purpose - Descriptive link text
- [ ] 3.1.1 Language of Page - Language specified
- [ ] 3.2.1 On Focus - No context changes on focus
- [ ] 3.2.2 On Input - No context changes on input
- [ ] 3.3.1 Error Identification - Errors identified
- [ ] 3.3.2 Labels or Instructions - Form labels provided
- [ ] 4.1.1 Parsing - Valid markup
- [ ] 4.1.2 Name, Role, Value - Proper ARIA implementation

### Level AA Requirements
- [ ] 1.2.4 Captions (Live) - Live video captions
- [ ] 1.2.5 Audio Description - Video audio descriptions
- [ ] 1.4.3 Contrast (Minimum) - 4.5:1 contrast ratio
- [ ] 1.4.4 Resize Text - 200% zoom support
- [ ] 1.4.5 Images of Text - Avoid text in images
- [ ] 2.4.5 Multiple Ways - Multiple navigation options
- [ ] 2.4.6 Headings and Labels - Descriptive headings
- [ ] 2.4.7 Focus Visible - Visible focus indicators
- [ ] 3.1.2 Language of Parts - Language changes marked
- [ ] 3.2.3 Consistent Navigation - Consistent navigation
- [ ] 3.2.4 Consistent Identification - Consistent component identification
- [ ] 3.3.3 Error Suggestion - Error correction suggestions
- [ ] 3.3.4 Error Prevention - Error prevention for critical actions
- [ ] 4.1.3 Status Messages - ARIA live regions

### Trauma-Informed Additional Requirements
- [ ] Crisis button accessible via multiple input methods
- [ ] Emergency resources work without JavaScript
- [ ] Motion sensitivity controls available
- [ ] High contrast mode for dissociation
- [ ] Large touch targets for trembling hands
- [ ] Simple navigation during crisis
- [ ] Offline access to crisis resources
- [ ] No triggering animations or content

---

## 🛠️ Troubleshooting

### Common Issues

#### Screen Reader Not Announcing Changes
```tsx
// Ensure ARIA live regions are set up correctly
<div aria-live="polite" id="status-announcements"></div>

// Use the announcement function
const { announceToScreenReader } = useAccessibility();
announceToScreenReader('Content updated', 'polite');
```

#### Focus Not Visible
```tsx
// Ensure focus-ring class is applied
<button className="focus-ring">
  My Button
</button>

// Or use the enhanced focus
<button className="focus-enhanced">
  Important Button
</button>
```

#### Touch Targets Too Small
```tsx
// Wrap in mobile optimization
<MobileAccessibilityOptimizations>
  <button>Button</button> {/* Automatically optimized */}
</MobileAccessibilityOptimizations>

// Or use explicit classes
<button className="touch-target-comfortable">
  Mobile-Friendly Button
</button>
```

#### Motion Sensitivity Not Working
```tsx
// Ensure TraumaInformedMotionControls wrapper is present
<TraumaInformedMotionControls>
  <div className="animate-fade-in">
    {/* Animation automatically controlled */}
  </div>
</TraumaInformedMotionControls>
```

### Crisis Mode Not Activating
```tsx
// Check crisis detection setup
const { enableCrisisMode, settings } = useAccessibility();

// Manual activation
useEffect(() => {
  if (detectCrisisCondition()) {
    enableCrisisMode();
  }
}, []);

// Verify crisis mode is active
console.log('Crisis mode active:', settings.crisisMode);
```

---

## 📚 Resources

### Testing Tools
- **Screen Readers**: NVDA (free), JAWS, VoiceOver
- **Color Contrast**: WebAIM Contrast Checker, Colour Contrast Analyser
- **Keyboard Testing**: Built-in browser developer tools
- **Mobile Testing**: Real devices, BrowserStack, Sauce Labs

### Standards Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Mobile Accessibility](https://www.w3.org/WAI/mobile/)

### Trauma-Informed Design
- Crisis intervention best practices
- Mental health emergency protocols
- Assistive technology for trauma survivors

---

## 🤝 Contributing

When contributing to the accessibility system:

1. **Test with real users**: Include users with disabilities in testing
2. **Crisis scenario testing**: Test all features under simulated crisis conditions
3. **Performance impact**: Ensure accessibility features don't slow down the app
4. **Documentation**: Update this guide with any new features or changes
5. **Backwards compatibility**: Ensure changes don't break existing implementations

---

## 📞 Support

For accessibility-related questions or issues:

1. Check this guide first
2. Review the component documentation
3. Test with the built-in audit tool
4. Consult WCAG 2.1 guidelines
5. Consider trauma-informed design principles

Remember: Accessibility is not optional for ALCHM. Every feature must be accessible to users who may be experiencing crisis, using assistive technologies, or accessing the app during their most vulnerable moments.