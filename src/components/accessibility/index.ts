/**
 * ALCHM Accessibility Components Index
 * 
 * Comprehensive accessibility components for trauma-informed mental health applications.
 * Provides WCAG 2.1 AA compliance with special considerations for crisis situations.
 */

// Core Accessibility Components
export { AccessibilityProvider, useAccessibility } from './AccessibilityProvider';
export { default as ScreenReaderSupport, AccessibleHeading, AccessibleDescription, AccessibleList, AccessibleButton } from './ScreenReaderSupport';
export { default as KeyboardNavigation, FocusTrap, RovingTabIndex, AccessibleMenu, KeyboardShortcuts } from './KeyboardNavigation';
export { AccessibilityControls } from './AccessibilityControls';

// Form Accessibility
export { 
  AccessibleForm, 
  AccessibleInput, 
  AccessibleTextarea, 
  AccessibleSelect 
} from './AccessibleForms';

// Crisis-Specific Components
export { default as CrisisAccessibilityButton, FloatingCrisisButton } from './CrisisAccessibilityButton';
export { default as TraumaInformedMotionControls, MotionControlStyles } from './TraumaInformedMotionControls';

// Mobile Accessibility
export { default as MobileAccessibilityOptimizations } from './MobileAccessibilityOptimizations';

// Development Tools
export { default as AccessibilityAuditTool } from './AccessibilityAuditTool';

// Re-export types for consumers
export type { AccessibilitySettings, AccessibilityContext } from './AccessibilityProvider';

/**
 * Quick Setup Guide:
 * 
 * 1. Wrap your app with AccessibilityProvider:
 * ```tsx
 * import { AccessibilityProvider } from '@/components/accessibility';
 * 
 * export default function App({ children }) {
 *   return (
 *     <AccessibilityProvider initialCrisisMode={false}>
 *       {children}
 *     </AccessibilityProvider>
 *   );
 * }
 * ```
 * 
 * 2. Add ScreenReaderSupport to your pages:
 * ```tsx
 * import { ScreenReaderSupport } from '@/components/accessibility';
 * 
 * export default function Page() {
 *   return (
 *     <ScreenReaderSupport 
 *       pageTitle="Journal Entry" 
 *       pageDescription="Write and reflect on your thoughts"
 *     >
 *       <main id="main-content">
 *         {/* Your page content */}
 *       </main>
 *     </ScreenReaderSupport>
 *   );
 * }
 * ```
 * 
 * 3. Use accessible form components:
 * ```tsx
 * import { AccessibleForm, AccessibleInput } from '@/components/accessibility';
 * 
 * <AccessibleForm onSubmit={handleSubmit}>
 *   <AccessibleInput 
 *     name="journal"
 *     label="Your Journal Entry"
 *     required
 *     validation={(value) => value.length < 10 ? 'Please write more' : null}
 *   />
 * </AccessibleForm>
 * ```
 * 
 * 4. Add crisis support:
 * ```tsx
 * import { FloatingCrisisButton } from '@/components/accessibility';
 * 
 * // Add anywhere in your app
 * <FloatingCrisisButton />
 * ```
 * 
 * 5. Enable mobile optimizations:
 * ```tsx
 * import { MobileAccessibilityOptimizations } from '@/components/accessibility';
 * 
 * <MobileAccessibilityOptimizations>
 *   {/* Your mobile content */}
 * </MobileAccessibilityOptimizations>
 * ```
 */