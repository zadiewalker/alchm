# ALCHM Development Patterns Guide

## 🛡️ **Crisis Safety Development Patterns** (EXCELLENT - Continue These)

### **Pattern 1: Trauma-Informed Error Handling**
```typescript
// ✅ EXCELLENT PATTERN - Found in authFunctions.ts
function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return "We don't have an account with this email address. Would you like to create a new account?";
    case 'auth/popup-closed-by-user':
      return 'Authentication was cancelled. Take your time - we\'ll be here when you\'re ready.';
    case 'auth/network-request-failed':
      return 'Connection issue. Please check your internet connection and try again.';
    default:
      return 'Something went wrong. Please try again in a moment.';
  }
}

// 📋 Template for New Features:
export const createTraumaInformedErrorHandler = (context: string) => {
  return (error: any): string => {
    // Log error for debugging (never show raw errors to users)
    console.error(`[${context}] Error:`, error);
    
    // Return gentle, non-alarming message
    return `We encountered a gentle hiccup with ${context}. You're safe here - please try again.`;
  };
};
```

### **Pattern 2: Crisis-Safe UI Components**
```typescript
// ✅ EXCELLENT PATTERN - Found in login/signup pages
const crisisSafeButton = {
  minHeight: isMobile ? '60px' : '52px', // Crisis accessibility
  fontSize: isMobile ? '18px' : '16px',  // Readable during distress
  touchAction: 'manipulation',
  padding: isMobile ? '20px 24px' : '12px 16px' // Enhanced touch area
};

// 📋 Template for Crisis-Safe Components:
export const CrisisSafeButton = ({ children, onClick, loading = false }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="crisis-safe-button"
    style={{
      minHeight: '60px',
      minWidth: '60px',
      fontSize: '18px',
      fontWeight: '600',
      borderRadius: '1.5rem',
      transition: 'all 300ms ease',
      touchAction: 'manipulation'
    }}
    aria-label={`${children} - Crisis-safe interaction`}
  >
    {loading ? (
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
    ) : children}
  </button>
);
```

### **Pattern 3: Mobile Crisis Optimization**
```typescript
// ✅ EXCELLENT PATTERN - Found in mobile auth utils
export const crisisOptimizedMobile = {
  // Haptic feedback for reassurance
  provideHapticFeedback: (type: 'success' | 'error' | 'warning') => {
    if (!navigator.vibrate) return;
    
    const patterns = {
      success: [100, 50, 100],      // Short celebration
      error: [200, 100, 200],       // Alert pattern
      warning: [150]                // Single gentle buzz
    };
    
    navigator.vibrate(patterns[type]);
  },
  
  // Device stress detection
  detectDeviceStress: () => ({
    batteryLevel: (navigator as any).getBattery?.()?.level || 1,
    networkType: (navigator as any).connection?.effectiveType || 'unknown',
    memoryPressure: (performance as any).memory?.usedJSHeapSize / (performance as any).memory?.jsHeapSizeLimit || 0
  })
};
```

## 🔥 **Firebase Integration Patterns** (EXCELLENT - Continue These)

### **Pattern 1: Dynamic Imports for Performance**
```typescript
// ✅ EXCELLENT PATTERN - Found throughout auth system
async function getAuthInstance() {
  if (!authInstance) {
    const app = await getFirebaseApp();
    authInstance = getAuth(app);
  }
  return authInstance;
}

// Dynamic Firebase imports reduce bundle size
const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
```

### **Pattern 2: Graceful Offline Handling**
```typescript
// ✅ EXCELLENT PATTERN - Template for offline-first Firebase
export const offlineFirstFirestore = {
  async safeWrite(docPath: string, data: any) {
    try {
      if (!navigator.onLine) {
        // Store for when online
        this.queueOfflineWrite(docPath, data);
        return { success: true, offline: true };
      }
      
      const db = await getFirestore();
      await setDoc(doc(db, docPath), data);
      return { success: true, offline: false };
      
    } catch (error) {
      // Graceful fallback
      this.queueOfflineWrite(docPath, data);
      return { success: true, offline: true, error: error.message };
    }
  }
};
```

### **Pattern 3: User Profile Management**
```typescript
// ✅ EXCELLENT PATTERN - Found in auth functions
async function createUserProfileIfNeeded(user: any) {
  try {
    const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
    const db = getFirestore();
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || 'ALCHM User',
        createdAt: new Date(),
        tier: 'free',
        // Trauma-informed defaults
        preferences: {
          crisisAlerts: true,
          dailyReflectionReminder: true
        },
        riskLevel: 'low',
        crisisPreventionEnabled: true
      });
    } else {
      // Update last active for existing users
      await setDoc(doc(db, 'users', user.uid), {
        lastActiveAt: new Date()
      }, { merge: true });
    }
  } catch (error) {
    console.error('User profile creation error:', error);
    // Don't fail authentication if profile creation fails
  }
}
```

## 📋 **Development Workflow Checklist**

### **Before Creating New Features:**
- [ ] Create crisis-safe error handling
- [ ] Implement mobile-first responsive design
- [ ] Add haptic feedback for mobile interactions
- [ ] Use dynamic Firebase imports
- [ ] Test offline functionality
- [ ] Validate trauma-informed messaging
- [ ] Ensure 60px minimum touch targets
- [ ] Add loading states with gentle animations

### **Code Review Checklist:**
- [ ] Error messages are gentle and non-alarming
- [ ] No raw error objects shown to users
- [ ] Touch targets meet crisis accessibility standards
- [ ] Firebase operations have offline fallbacks
- [ ] Mobile interactions include haptic feedback
- [ ] Typography is readable during stress (18px+)
- [ ] Loading states prevent user confusion

## 🎯 **Integration Standards**

### **Authentication Integration:**
```typescript
// Always follow this pattern for new auth methods
export async function newAuthMethod() {
  try {
    const auth = await getAuthInstance();
    const result = await authOperation();
    
    // Always create/update user profile
    if (result.user) {
      await createUserProfileIfNeeded(result.user);
    }
    
    return {
      user: result.user,
      error: null,
      authMethod: 'method-name'
    };
  } catch (error: any) {
    return {
      user: null,
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}
```

### **API Endpoint Integration:**
```typescript
// Always follow this pattern for new API endpoints
export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();
    
    // Validate input
    if (!data) {
      return NextResponse.json(
        { error: 'Required data not provided' },
        { status: 400 }
      );
    }
    
    // Process with crisis-safe error handling
    const result = await processData(data);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
```

These patterns represent the gold standard for ALCHM development. Continue using these approaches for all new features.