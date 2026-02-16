====================================================
ALCHM FULL SYSTEM AUDIT
Date: 2026-02-16 11:58 CST
====================================================

SHIP-READINESS SCORE: 7/10

BUILD PIPELINE
--------------
Status: ✅ HEALTHY

Node: v22.22.0
npm:  10.9.4

next.config.js (key settings):
3:  output: 'export',
4:  trailingSlash: true,
12:    unoptimized: true,

Build (latest run):
Pages generated (index.html count): 32
Total HTML: 80
Total JS:   79
Total CSS:  8

Key pages sanity (_next refs + size):
- out/index.html: 10114 bytes, _next refs=1
- out/dashboard/index.html: 11420 bytes, _next refs=1
- out/journal/index.html: 11359 bytes, _next refs=1

iOS DEPLOYMENT
--------------
Capacitor CLI (Node 22): 8.0.2 (sync ok)

capacitor.config (full):
import type { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const serverUrl = process.env.CAPACITOR_SERVER_URL;
const useServerMode = process.env.CAPACITOR_USE_SERVER === 'true';
const redirectHostHints: Record<string, string[]> = {
  'alchmapp.web.app': ['alchm.vercel.app'],
};
const serverUrlOverrides: Record<string, string> = {
  // Bypass Firebase redirect/service-worker edge cases in WKWebView.
  'alchmapp.web.app': 'https://alchm.vercel.app',
};

function getEffectiveServerUrl(urlValue?: string): string | undefined {
  if (!urlValue) return undefined;
  try {
    const parsed = new URL(urlValue);
    return serverUrlOverrides[parsed.host] || urlValue;
  } catch {
    return urlValue;
  }
}

function getAllowedNavigationHosts(urlValue?: string): string[] {
  const hosts = new Set<string>();
  if (!urlValue) return [];
  try {
    const primaryHost = new URL(urlValue).host;
    hosts.add(primaryHost);
    const hintedHosts = redirectHostHints[primaryHost] || [];
    for (const host of hintedHosts) {
      hosts.add(host);
    }
    const extraHosts = (process.env.CAPACITOR_ALLOW_NAVIGATION || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    for (const host of extraHosts) {
      hosts.add(host);
    }
    return Array.from(hosts);
  } catch {
    return [];
  }
}

const config: CapacitorConfig = {
  appId: 'com.alchm.sanctuary',
  appName: 'ALCHM',
  // Bundled static mode by default: Capacitor serves built Next.js export from out/.
  webDir: 'out',
  ...(useServerMode && serverUrl
    ? {
      server: {
        url: getEffectiveServerUrl(serverUrl),
        androidScheme: 'https',
        cleartext: getEffectiveServerUrl(serverUrl)?.startsWith('http://'),
        allowNavigation: getAllowedNavigationHosts(serverUrl),
      },
    }
    : {}),
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#8B9A7C',
    scheme: "App",
    // Production optimizations
    webContentsDebuggingEnabled: false,
    allowsLinkPreview: false,
    preferredContentMode: 'mobile'
  },
  plugins: {
    SplashScreen: {
      // Prevent indefinite black-screen/splash lock if remote app load stalls.
      launchAutoHide: true,
      launchShowDuration: 1200,
      backgroundColor: '#8B9A7C',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#8B9A7C",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: KeyboardResize.None,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: false
    }
  }
};

export default config;

Capacitor config checks:
- webDir: capacitor.config.ts:51:  webDir: 'out',
NOT FOUND
- server.url present: 1

iOS project:
- Info.plist: ✅ ios/App/App/Info.plist
- UISceneManifest present: 1
- Default Configuration present: 1
- SceneDelegate.swift exists: YES

FEATURE STATUS TABLE
--------------------
| Feature              | Status   | Notes |
|---------------------|----------|-------|
| Splash screen        | COMPLETE | Locked design; navigation only changes allowed |
| Auth                 | PARTIAL  | Firebase-based UI; verify entitlement rules on device |
| Dashboard            | COMPLETE | Sanctuary primitives, continuity cards, reflection counter |
| Journal - list       | COMPLETE | Search/filters + empty/loading/error states |
| Journal - create     | COMPLETE | Autosave + moods + reflections + crisis detection |
| Journal - search     | COMPLETE | in-memory search service |
| Journal - tags       | COMPLETE | optional tags |
| Khepera reflection   | COMPLETE | typewriter + fallback handling |
| Khepera evolution    | COMPLETE | stage-based prompt context |
| Theme extraction     | COMPLETE | periodic extraction |
| Mood tracking        | COMPLETE | stored per entry |
| Insights             | PARTIAL  | depends on data volume |
| Pathways             | PARTIAL  | core pathways exist; verify completion loop |
| Settings             | COMPLETE | persisted settings service |
| Pricing / tiers      | COMPLETE | local tier model for TestFlight |
| Subscription gating  | COMPLETE | gates depth, never journaling |
| Onboarding           | COMPLETE | first-time flow creates real entry |
| Data export          | COMPLETE | JSON/CSV/TXT export |
| Evening check-in     | COMPLETE | check-in route + tier gate |
| Notifications        | COMPLETE | local notifications service |
| Continuity cards     | COMPLETE | dashboard continuity context |
| Community sharing    | PARTIAL  | local-only preview (backend/moderation TODO) |
| Crisis footer        | COMPLETE | present globally |
| Crisis modal         | COMPLETE | resources + tel/sms |
| Crisis detection     | COMPLETE | lightweight keyword detection |
| Design system        | COMPLETE | src/lib/design.ts tokens |
| Page transitions     | COMPLETE | fade transitions |
| Loading states       | COMPLETE | unified components |
| Empty states         | COMPLETE | Khepera voice |
| Error states         | COMPLETE | unified components |
| Offline support      | PARTIAL  | journaling works; AI queued behavior verify |
| 988 always visible   | COMPLETE | footer in layout |

DATA LAYER
----------
Primary storage: localStorage

localStorage key strings (from code):
src/cultural/multilingual-crisis-tester.ts:64:    this.languageConfigs.set('es', {
src/cultural/multilingual-crisis-tester.ts:152:    this.languageConfigs.set('pt', {
src/cultural/multilingual-crisis-tester.ts:221:    this.languageConfigs.set('ko', {
src/cultural/multilingual-crisis-tester.ts:296:    this.languageConfigs.set('hi', {
src/cultural/multilingual-crisis-tester.ts:367:    this.languageConfigs.set('de', {
src/cultural/multilingual-crisis-tester.ts:438:    this.languageConfigs.set('en', {
src/cultural/multilingual-crisis-tester.ts:497:      results.set(languageCode, languageResults);
src/cultural/multilingual-crisis-tester.ts:751:      report.languageResults.set(language, languageStats);
src/cultural/multilingual-crisis-tester.ts:762:      report.culturalNuanceDetection.set(language, nuanceDetection);
src/cultural/multilingual-crisis-tester.ts:769:      report.resourceAvailability.set(language, resourceStats);
src/cultural/cultural-trauma-detector.ts:53:    this.traumaTypes.set('slavery-intergenerational', {
src/cultural/cultural-trauma-detector.ts:114:    this.traumaTypes.set('holocaust-intergenerational', {
src/cultural/cultural-trauma-detector.ts:129:          culturalExpression: 'Scarcity mindset from survival trauma',
src/cultural/cultural-trauma-detector.ts:159:    this.traumaTypes.set('boarding-school-intergenerational', {
src/cultural/cultural-trauma-detector.ts:213:    this.traumaTypes.set('religious-conversion-therapy', {
src/cultural/cultural-trauma-detector.ts:258:    this.traumaTypes.set('religious-abuse', {
src/cultural/cultural-trauma-detector.ts:296:    this.traumaTypes.set('forced-migration-trauma', {
src/cultural/cultural-trauma-detector.ts:342:    this.traumaTypes.set('medical-racism-trauma', {
src/cultural/cultural-trauma-detector.ts:388:    this.traumaTypes.set('gender-identity-trauma', {
src/cultural/cultural-trauma-detector.ts:739:      results.set(traumaType, traumaResults);
src/cultural/cultural-crisis-validator.ts:42:    this.communityPatterns.set('african-american', {
src/cultural/cultural-crisis-validator.ts:108:    this.communityPatterns.set('lgbtq', {
src/cultural/cultural-crisis-validator.ts:142:            'workplace closeting stress',
src/cultural/cultural-crisis-validator.ts:174:    this.communityPatterns.set('indigenous', {
src/cultural/cultural-crisis-validator.ts:218:    this.communityPatterns.set('neurodivergent', {
src/cultural/cultural-crisis-validator.ts:431:      results.set(community, communityResults);
src/cultural/cultural-crisis-validator.ts:500:      report.byCommunity.set(community, communityStats);
src/cultural/community-resource-validator.ts:91:    this.resourceDatabase.set('african-american', [
src/cultural/community-resource-validator.ts:197:    this.resourceDatabase.set('lgbtq', [
src/cultural/community-resource-validator.ts:305:    this.resourceDatabase.set('indigenous', [
src/cultural/community-resource-validator.ts:364:    this.resourceDatabase.set('neurodivergent', [
src/cultural/community-resource-validator.ts:424:    this.validationResults.set(community, validations);
src/cultural/community-resource-validator.ts:720:      report.communityCoverage.set(community, communityStats);
src/middleware/crisis-safety-middleware.ts:202:      this.responseTimeMonitor.set(userId, responseTime);
src/middleware/crisis-safety-middleware.ts:252:    this.activeOverrides.set(userId, overrideState);
src/middleware/crisis-safety-middleware.ts:293:      this.emergencyCache.set(`business_metrics_suspended_${userId}`, {
src/middleware/crisis-safety-middleware.ts:334:      this.emergencyCache.set(`professional_notification_${userId}`, escalationData);
src/middleware/crisis-safety-middleware.ts:361:      response.headers.set('X-Crisis-Safety-Override', 'true');
src/middleware/crisis-safety-middleware.ts:362:      response.headers.set('X-Crisis-Severity', crisisResult.severity);
src/middleware/crisis-safety-middleware.ts:363:      response.headers.set('X-Emergency-Response-Time', Date.now().toString());
src/middleware/crisis-safety-middleware.ts:364:      response.headers.set('X-Business-Metrics-Suspended', 'true');
src/middleware/crisis-safety-middleware.ts:465:    this.emergencyCache.set('emergency_resources', {
src/policies/ferpa-notice.md:12:When ALCHM is used in educational settings, the following information is classified as educational records under FERPA:
src/cultural/indigenous-healing-integration.ts:83:    this.tribalNations.set('example-nation', {
src/cultural/indigenous-healing-integration.ts:510:      byRequirement.set(requirement.type, isCompliant);
src/cultural/indigenous-healing-integration.ts:610:      this.submissions.set(nationName, []);
src/middleware/security.ts:73:    resetTime: number;
src/middleware/security.ts:86:    if (entry && entry.resetTime < now) {
src/middleware/security.ts:95:      resetTime: now + typeof window !== 'undefined' && windowMs
src/middleware/security.ts:100:  if (rateLimitStore[ip].resetTime < now) {
src/middleware/security.ts:103:      resetTime: now + typeof window !== 'undefined' && windowMs
src/middleware/security.ts:179:    response.headers.set(key, value);
src/middleware/security.ts:186:    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
src/middleware/security.ts:187:    response.headers.set('Pragma', 'no-cache');
src/middleware/security.ts:188:    response.headers.set('Expires', '0');
src/policies/coppa-notice.md:92:- Configure privacy settings and notifications
src/policies/coppa-notice.md:109:- **Modify Settings**: Change privacy settings and data sharing preferences
src/policies/coppa-notice.md:179:- **Custom Retention**: Parents can set data retention periods
src/middleware/crisis-safety-middleware-edge.ts:227:      response.headers.set('X-Crisis-Safety-Override', 'true');
src/middleware/crisis-safety-middleware-edge.ts:228:      response.headers.set('X-Crisis-Severity', 'critical');
src/middleware/crisis-safety-middleware-edge.ts:229:      response.headers.set('X-Emergency-Response-Time', Date.now().toString());
src/middleware/crisis-safety-middleware-edge.ts:230:      response.headers.set('X-Business-Metrics-Suspended', 'true');
src/middleware/crisis-safety-middleware-edge.ts:231:      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
src/middleware-legal.ts:15:  // Skip compliance checks for static assets and internal Next.js routes
src/middleware-legal.ts:45:  // Skip static assets
src/middleware-legal.ts:73:  response.headers.set('X-Privacy-Policy', '/privacy-policy.html');
src/middleware-legal.ts:76:  response.headers.set('X-Cookie-Policy', '/cookie-policy.html');
src/middleware-legal.ts:79:  response.headers.set('X-GDPR-Compliant', 'true');
src/middleware-legal.ts:82:  response.headers.set('X-CCPA-Compliant', 'true');
src/middleware-legal.ts:86:    response.headers.set('X-COPPA-Compliant', 'true');
src/middleware-legal.ts:90:  response.headers.set('X-Data-Processing', 'minimal');
src/middleware-legal.ts:93:  response.headers.set('X-User-Rights', '/privacy/user-rights');
src/middleware-legal.ts:96:  response.headers.set('X-Consent-Management', '/privacy/consent');
src/middleware-legal.ts:154:    response.headers.set('X-Show-Cookie-Banner', 'true');
src/middleware-legal.ts:158:  response.headers.set('X-Cookie-Policy-Required', 'true');
src/middleware-legal.ts:159:  response.headers.set('X-Cookie-Categories', 'essential,analytics,ai_enhancement');
src/middleware-legal.ts:182:    response.headers.set('X-COPPA-Mode', 'true');
src/middleware-legal.ts:183:    response.headers.set('X-Enhanced-Privacy', 'true');
src/middleware-legal.ts:184:    response.headers.set('X-Parental-Controls', 'required');
src/middleware-legal.ts:198:  response.headers.set('X-Data-Collection', 'minimal');
src/middleware-legal.ts:199:  response.headers.set('X-Purpose-Limitation', 'true');
src/middleware-legal.ts:200:  response.headers.set('X-Storage-Limitation', 'user-controlled');
src/middleware-legal.ts:222:    response.headers.set('X-Crisis-Mode', 'true');
src/middleware-legal.ts:223:    response.headers.set('X-Safety-Override', 'allowed');
src/middleware-legal.ts:224:    response.headers.set('X-Emergency-Contacts', 'enabled');
src/middleware-legal.ts:227:    response.headers.set('X-Medical-Disclaimer', '/medical-disclaimer.html');
src/animations/ikigai_leaf_glow.json:10:  "assets": [],
src/styles/mobile.css:5:  --safe-area-inset-top: env(safe-area-inset-top);
src/styles/mobile.css:6:  --safe-area-inset-right: env(safe-area-inset-right);
src/styles/mobile.css:7:  --safe-area-inset-bottom: env(safe-area-inset-bottom);
src/styles/mobile.css:8:  --safe-area-inset-left: env(safe-area-inset-left);
src/styles/mobile.css:70:  padding-top: var(--safe-area-inset-top);
src/styles/mobile.css:71:  padding-bottom: var(--safe-area-inset-bottom);
src/styles/mobile.css:72:  padding-left: var(--safe-area-inset-left);
src/styles/mobile.css:73:  padding-right: var(--safe-area-inset-right);
src/styles/mobile.css:91:  padding-top: max(var(--safe-area-inset-top), 20px);
src/styles/mobile.css:171:    padding-top: max(var(--safe-area-inset-top), 47px);
src/styles/mobile.css:177:    padding-left: var(--safe-area-inset-left);
src/styles/mobile.css:178:    padding-right: var(--safe-area-inset-right);
src/styles/mobile.css:235:  padding-bottom: max(var(--safe-area-inset-bottom), 20px);
src/styles/mobile.css:247:  bottom: max(var(--safe-area-inset-bottom), 20px);
src/policies/privacy-policy.md:16:When used in educational settings, journal entries and related data are classified as educational records under FERPA. These include:
src/policies/privacy-policy.md:110:3. Notify school counselors or designated officials (educational settings only)
src/policies/privacy-policy.md:122:- **Journal Entries**: User can set automatic deletion (30 days to 7 years)
src/policies/privacy-policy.md:144:- **Language Preference**: User's selected language and cultural settings
src/animations/future_vision_light_wave.json:10:  "assets": [],
src/__tests__/basic.test.ts:2: * Basic test to verify Jest setup works
src/__tests__/basic.test.ts:12:  test('should have environment setup', () => {
src/components/ErrorBoundary.tsx:49:      sessionStorage.setItem('alchm-error-state', 'loop-detected')
src/components/ErrorBoundary.tsx:54:      scope.setTag('errorBoundary', this.props.name || 'unknown');
src/components/ErrorBoundary.tsx:55:      scope.setLevel('error');
src/components/ErrorBoundary.tsx:56:      scope.setContext('errorBoundary', {
src/components/ErrorBoundary.tsx:69:    sessionStorage.setItem('alchm-reload-count', newCount.toString())
src/components/ErrorBoundary.tsx:82:  handleReset = () => {
src/components/ErrorBoundary.tsx:128:                onClick={this.handleReset}
src/components/ErrorBoundary.tsx:131:                Reset Everything & Start Fresh
src/components/ErrorBoundary.tsx:156:    fallback: ({ error, resetError }) => (
src/components/ErrorBoundary.tsx:162:            onClick={resetError}
src/components/ErrorBoundary.tsx:165:            <span className="text-white text-sm font-medium">Reset</span>
src/components/ErrorBoundary.tsx:171:      scope.setTag('errorBoundary', 'sentry');

process.env usage (static export constraints apply):
src/middleware/security.ts:268:  secure: process.env.NODE_ENV === 'production',
src/middleware/security.ts:291:  // if (process.env.NODE_ENV === 'production') {
src/middleware.ts:78:  if (process.env.NODE_ENV === 'production' && PRODUCTION_BLOCKED_ROUTES.has(normalizedPath)) {
src/middleware-legal.ts:137:  if (process.env.NODE_ENV === 'production') {
src/mobile/index.tsx:257:      {process.env.NODE_ENV === 'development' && (
src/security/consent-management-validator.ts:604:      consentVersion: process.env.CONSENT_VERSION || '1.0',
src/security/hipaa-compliance-auditor.ts:639:      .update(JSON.stringify(data) + process.env.AUDIT_LOG_SECRET)
src/app/test-hooks/page.tsx:8:  if (process.env.NODE_ENV === 'production') return <BlockInProduction />
src/security/audit-log-validator.ts:427:    const hmacSecret = process.env.AUDIT_LOG_HMAC_SECRET || 'default-secret';
src/__tests__/basic.test.ts:13:    expect(process.env.NODE_ENV).toBe('test');
src/__tests__/env.setup.ts:2:process.env.NODE_ENV = 'test'
src/__tests__/env.setup.ts:5:process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
src/__tests__/env.setup.ts:6:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com'
src/__tests__/env.setup.ts:7:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
src/__tests__/env.setup.ts:8:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com'
src/__tests__/env.setup.ts:9:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789'
src/__tests__/env.setup.ts:10:process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:abcdef'
src/__tests__/env.setup.ts:13:process.env.FIREBASE_PROJECT_ID = 'test-project'
src/__tests__/env.setup.ts:14:process.env.FIREBASE_CLIENT_EMAIL = 'test@test-project.iam.gserviceaccount.com'
src/__tests__/env.setup.ts:15:process.env.FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+...\n-----END PRIVATE KEY-----\n'
src/__tests__/env.setup.ts:18:process.env.GEMINI_API_KEY = 'test-gemini-key'
src/__tests__/env.setup.ts:21:process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'
src/__tests__/env.setup.ts:22:process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
src/__tests__/env.setup.ts:25:process.env.NEXTAUTH_SECRET = 'test-secret'
src/__tests__/env.setup.ts:26:process.env.NEXTAUTH_URL = 'http://localhost:3000'
src/ai/genkit-config.ts:11:      apiKey: process.env.GOOGLE_AI_API_KEY,
src/lib/openaiWithRateLimit.ts:7:  apiKey: process.env.OPENAI_API_KEY,
src/__tests__/mobile-crisis-detection.test.ts:298:      const originalEnv = process.env.NODE_ENV;
src/__tests__/mobile-crisis-detection.test.ts:299:      process.env.NODE_ENV = 'production';
src/__tests__/mobile-crisis-detection.test.ts:305:      process.env.NODE_ENV = originalEnv;
src/__tests__/mobile-crisis-detection.test.ts:309:      const originalEnv = process.env.NODE_ENV;
src/__tests__/mobile-crisis-detection.test.ts:310:      process.env.NODE_ENV = 'development';
src/__tests__/mobile-crisis-detection.test.ts:317:      process.env.NODE_ENV = originalEnv;
src/app/api.disabled/community/react-to-story/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/__tests__/globalSetup.ts:10:  if (!process.env.NODE_OPTIONS?.includes('--max-old-space-size')) {
src/__tests__/globalSetup.ts:24:  process.env.TEST_START_TIME = startTime.toString()
src/__tests__/globalSetup.ts:27:  process.env.NODE_ENV = 'test'
src/__tests__/globalSetup.ts:28:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'alchm-test'
src/__tests__/globalSetup.ts:29:  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
src/__tests__/globalSetup.ts:30:  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
src/__tests__/globalTeardown.ts:9:  const startTime = parseInt(process.env.TEST_START_TIME || '0', 10)
src/app/api/community/react-to-story/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/ai/trauma-informed-engine.ts:97:      host: process.env.REDIS_HOST || 'localhost',
src/ai/trauma-informed-engine.ts:98:      port: parseInt(process.env.REDIS_PORT || '6379'),
src/components/ErrorBoundary.tsx:135:            {process.env.NODE_ENV === 'development' && (
src/ai/predictive-wellness-engine.ts:257:      host: process.env.REDIS_HOST || 'localhost',
src/ai/predictive-wellness-engine.ts:258:      port: parseInt(process.env.REDIS_PORT || '6379'),
src/ai/cross-platform-intelligence 2.ts.disabled:208:      host: process.env.REDIS_HOST || 'localhost',
src/ai/cross-platform-intelligence 2.ts.disabled:209:      port: parseInt(process.env.REDIS_PORT || '6379'),
src/ai/trauma-informed-engine 2.ts.disabled:97:      host: process.env.REDIS_HOST || 'localhost',
src/ai/trauma-informed-engine 2.ts.disabled:98:      port: parseInt(process.env.REDIS_PORT || '6379'),
src/app/api.disabled/community/join-collective-experience/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/ai/predictive-wellness-engine 2.ts.disabled:257:      host: process.env.REDIS_HOST || 'localhost',
src/ai/predictive-wellness-engine 2.ts.disabled:258:      port: parseInt(process.env.REDIS_PORT || '6379'),
src/app/api/community/join-collective-experience/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/test/page.tsx:6:  if (process.env.NODE_ENV === 'production') return <BlockInProduction />;
src/lib/stripe.ts:4:if (!process.env.STRIPE_SECRET_KEY) {
src/lib/stripe.ts:8:if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
src/lib/stripe.ts:9:  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
src/lib/stripe.ts:13:export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
src/lib/stripe.ts:22:    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
src/lib/stripe.ts:30:    growth: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || '',
src/lib/stripe.ts:31:    transformation: process.env.STRIPE_TRANSFORMATION_MONTHLY_PRICE_ID || '',
src/lib/analytics.ts:205:      if (process.env.NODE_ENV === 'development') {
src/app/api/community/create-healing-circle/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/api.disabled/community/create-healing-circle/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/lib/performance.ts:77:    if (process.env.NODE_ENV === 'development') {
src/ai/cross-platform-intelligence.ts:208:      host: process.env.REDIS_HOST || 'localhost',
src/ai/cross-platform-intelligence.ts:209:      port: parseInt(process.env.REDIS_PORT || '6379'),
src/app/debug-hooks/page.tsx:8:  if (process.env.NODE_ENV === 'production') return <BlockInProduction />
src/lib/advancedAI.ts:95:    this.openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null;
src/lib/firebaseAdmin.ts:10:    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
src/lib/firebaseAdmin.ts:13:    //   projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
src/lib/firebaseAdmin.ts:14:    //   clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
src/lib/firebaseAdmin.ts:15:    //   privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
src/app/api/community/create-wisdom-entry/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/layout.tsx:46:        {process.env.NODE_ENV !== 'production' ? <NavigationTelemetryPanel /> : null}
src/lib/firebase.ts:7:  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
src/lib/firebase.ts:8:  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
src/lib/firebase.ts:9:  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
src/lib/firebase.ts:10:  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
src/lib/firebase.ts:11:  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
src/lib/firebase.ts:12:  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
src/lib/aiService.ts:13:  apiKey: process.env.OPENAI_API_KEY,
src/app/api.disabled/community/create-wisdom-entry/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/api.disabled/analyze-journal/route.ts:27:    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
src/app/api.disabled/community/vote-on-wisdom/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/api/community/create-collective-experience/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/api.disabled/community/join-healing-circle/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/test-simple/page.tsx:9:  if (process.env.NODE_ENV === 'production') return <BlockInProduction />;
src/app/api.disabled/community/create-collective-experience/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/api.disabled/community/create-story/route.ts:8:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/debug-react/page.tsx:9:  if (process.env.NODE_ENV === 'production') return <BlockInProduction />;
src/app/debug-react/page.tsx:13:  console.log('🔥 DebugReactPage: Node env:', process.env.NODE_ENV)
src/app/debug-react/page.tsx:105:          <div><strong>Environment:</strong> {process.env.NODE_ENV || 'unknown'}</div>
src/ai/genkit.ts:3:    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
src/app/api/community/join-healing-circle/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/app/api/community/create-story/route.ts:8:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/components/BlockInProduction.tsx:4:  if (process.env.NODE_ENV !== 'production') {
src/app/api/community/vote-on-wisdom/route.ts:7:    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
src/components/admin/CrisisEventsList.tsx:69:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis-events?${params}`,
src/components/admin/CrisisEventsList.tsx:113:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis/${eventId}/escalate`,
src/components/admin/CrisisEventsList.tsx:146:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis/${eventId}/resolve`,
src/components/admin/CrisisAnalytics.tsx:37:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis-analytics?period=${selectedPeriod}`,
src/components/admin/AlertsPanel.tsx:66:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/check-alerts`,
src/components/admin/SystemHealthMonitor.tsx:26:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/system-health`,
src/components/admin/AdminAuthGuard.tsx:40:          `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/verify-access`,
src/components/admin/CrisisMonitoringDashboard.tsx:35:          `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/system-health`,
src/components/admin/ExportPanel.tsx:74:        `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL}/admin/crisis-export?${params}`,

API key exposure (source scan):
- Long-form sk-* tokens (20+ chars) found: 0

NAVIGATION & ROUTING
---------------------
window.location usages (non-external intents):
src/hooks/useSafeNavigation.ts:75:        /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) &&
src/utils/browser.ts:113:  location: isBrowser ? window.location : { pathname: '/', search: '', href: '' },
src/monitoring/crisis-performance-monitor.js:93:      url: window.location.href,
src/components/ErrorBoundary.tsx:77:      // Avoid window.location.reload() in Capacitor (can create loops); re-open current URL instead.
src/examples/tracking-implementation-example.tsx:91:    const source = new URLSearchParams(typeof window !== 'undefined' && window.location.search).get('source') || 'direct';
src/examples/tracking-implementation-example.tsx:225:      page: typeof window !== 'undefined' && window.location.pathname,
src/monitoring/performance-monitor.ts:136:      route: window.location.pathname,
src/monitoring/performance-monitor.ts:373:      window.location.pathname.includes('/crisis'),
src/monitoring/performance-monitor.ts:374:      window.location.pathname.includes('/emergency'),
src/monitoring/web-vitals-monitor.js:86:      url: window.location.href,
src/monitoring/web-vitals-monitor.js:104:      url: window.location.href
src/monitoring/error-tracker.ts:382:      route: window.location.pathname,
src/monitoring/error-tracker.ts:794:      window.location.pathname.includes('/crisis'),
src/monitoring/error-tracker.ts:795:      window.location.pathname.includes('/emergency'),
src/monitoring/error-tracker.ts:804:      window.location.pathname.includes('/therapist'),
src/monitoring/error-tracker.ts:805:      window.location.pathname.includes('/professional'),
src/components/NavigationClickTelemetry.tsx:43:        const toUrl = new URL(anchor.href, window.location.origin);
src/components/NavigationClickTelemetry.tsx:44:        if (toUrl.origin !== window.location.origin) return;
src/components/NavigationClickTelemetry.tsx:46:        const fromPath = normalizePath(window.location.pathname || '/');
src/monitoring/user-journey-analytics.ts:247:      window.location.pathname.includes('/crisis'),
src/monitoring/user-journey-analytics.ts:248:      window.location.pathname.includes('/emergency'),
src/monitoring/user-journey-analytics.ts:307:      if (crisisRoutes.some(route => window.location.pathname.includes(route))) {
src/lib/hipaaAuditLogger.ts:267:      location: window.location.hostname
src/app/debug-react/page.tsx:17:    console.log('🔥 DebugReactPage: Window location:', window.location.href)
src/lib/api/aiAnalysisApi.ts:57:    if (window.location.hostname === 'localhost') {
src/components/CapacitorErrorHandler.tsx:22:        url: window.location.href
src/components/CapacitorErrorHandler.tsx:58:        url: window.location.href
src/components/CapacitorErrorHandler.tsx:111:          url: window.location.href
src/app/test/page.tsx:25:          Current URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}
src/mobile/mobile-trauma-test.js:542:  if (window.location.hostname === 'localhost') {
src/app/page-original.tsx:87:              console.log('🔀 NAVIGATION: Current path =', window.location.pathname);
src/mobile/emergency-mode.tsx:314:      window.location.href = contacts[0].number;
src/lib/analytics.ts:89:    const urlParams = new URLSearchParams(window.location.search);
src/lib/analytics.ts:187:        page: typeof window !== 'undefined' ? window.location.pathname : '',
src/lib/analytics.ts:216:    const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '');
src/lib/analytics.ts:345:    url: window.location.href,
src/lib/performance.ts:61:      url: window.location.pathname,
src/__tests__/setup.ts:84:// Mock window.location
src/security/hipaa-compliance-auditor.ts:598:    return typeof window !== 'undefined' && window.location.protocol === 'https:';

Internal window.location count (excluding tel/sms/mailto/hash):
39

CODE QUALITY
------------
TypeScript errors (tsc --noEmit):
src/khepera/routing-decision-tree.ts(172,45): error TS1005: ',' expected.
src/khepera/routing-decision-tree.ts(172,54): error TS1005: ',' expected.
src/khepera/routing-decision-tree.ts(172,69): error TS1005: ':' expected.
src/khepera/somatic-response-generator.ts(400,4): error TS1160: Unterminated template literal.
src/middleware/security.ts(79,70): error TS1359: Identifier expected. 'typeof' is a reserved word that cannot be used here.
src/middleware/security.ts(79,84): error TS1005: ',' expected.
src/middleware/security.ts(79,111): error TS1005: ';' expected.
src/middleware/security.ts(79,136): error TS1005: ';' expected.
src/mobile/offline-crisis-resources.ts(472,71): error TS1005: ',' expected.
src/mobile/offline-crisis-resources.ts(472,80): error TS1005: ',' expected.
src/mobile/offline-crisis-resources.ts(668,46): error TS1005: ',' expected.
src/mobile/offline-crisis-resources.ts(668,55): error TS1005: ',' expected.
src/security/access-control-tester.ts(28,47): error TS1005: ';' expected.
src/security/access-control-tester.ts(31,1): error TS1128: Declaration or statement expected.
src/security/access-control-tester.ts(576,72): error TS1005: ';' expected.
src/security/consent-management-validator.ts(52,3): error TS1131: Property or signature expected.
src/security/consent-management-validator.ts(52,54): error TS1109: Expression expected.
src/security/consent-management-validator.ts(52,63): error TS1011: An element access expression should take an argument.
src/security/consent-management-validator.ts(53,22): error TS1109: Expression expected.
src/security/consent-management-validator.ts(54,17): error TS1005: ',' expected.
src/security/consent-management-validator.ts(55,25): error TS1005: ',' expected.
src/security/consent-management-validator.ts(56,20): error TS1005: ',' expected.
src/security/consent-management-validator.ts(57,31): error TS1005: ',' expected.
src/security/consent-management-validator.ts(60,21): error TS1011: An element access expression should take an argument.
src/security/consent-management-validator.ts(61,1): error TS1128: Declaration or statement expected.
src/security/consent-management-validator.ts(774,33): error TS1005: ')' expected.
src/security/consent-management-validator.ts(774,76): error TS1005: ';' expected.
src/security/data-breach-detector.ts(82,3): error TS1131: Property or signature expected.
src/security/data-breach-detector.ts(82,50): error TS1109: Expression expected.
src/security/data-breach-detector.ts(83,1): error TS1128: Declaration or statement expected.
src/types/career-schema.ts(556,3): error TS1131: Property or signature expected.
src/types/career-schema.ts(556,49): error TS1005: ';' expected.
src/types/career-schema.ts(556,72): error TS1011: An element access expression should take an argument.
src/types/career-schema.ts(558,29): error TS1011: An element access expression should take an argument.
src/types/career-schema.ts(559,35): error TS1011: An element access expression should take an argument.
src/types/career-schema.ts(561,1): error TS1128: Declaration or statement expected.
src/types/identity-pathway-schema.ts(528,30): error TS1005: ';' expected.
src/types/identity-pathway-schema.ts(528,37): error TS1011: An element access expression should take an argument.
src/types/identity-pathway-schema.ts(529,29): error TS1011: An element access expression should take an argument.
src/types/identity-pathway-schema.ts(531,1): error TS1128: Declaration or statement expected.

Dead/duplicate files (top-level patterns):
./ASSET_2_SUPPORTING_IMAGERY_DESIGN 2.html
./APP_STORE_SUBMISSION_CHECKLIST 2.md
./DEPLOYMENT_VERIFICATION_COMPLETE 2.md
./demo/index 2.html
./PRODUCTION_FEATURES 2.md
./CULTURAL_RELEVANCE_YOUTH_VOICE_AUDIT 2.md
./COMPREHENSIVE_FIREBASE_DIAGNOSTIC_AUDIT_REPORT 2.md
./ENVIRONMENT_SETUP_STATUS 2.md
./SOCIAL_MEDIA_TECHNICAL_ASSETS 2.md
./ALCHM_CASEL_ALIGNMENT_AUDIT 2.md
./ALCHM_JONY_IVE_DESIGN_TRANSFORMATION_COMPLETE 2.md
./auth-bundle-analysis 2.json
./FIREBASE_STUDIO_EDUCATION_SUCCESS_STORY 2.md
./TECHNICAL_CONTENT_TEASERS 2.md
./MOBILE_CACHE_FIX_INSTRUCTIONS 2.md
./DIAGNOSTIC_AUDIT_REPORT 2.json
./XCODE_TESTFLIGHT_COMPLETE_GUIDE 2.md
./ALCHM_SECURITY_AUDIT_COMPLETE 2.md
./README 2.md
./.lighthouserc 2.js
./APP_STORE_SUCCESS_STRATEGY 2.md
./MOBILE_AUTHENTICATION_VALIDATION_REPORT 2.md
./DEVHUNT_LAUNCH_PACKAGE 2.md
./cultural-competency-validation-test 2.js
./JONY_IVE_DESIGN_SYSTEM_DOCUMENTATION 2.md
./FIREBASE_STUDIO_EMERGENCY_RECOVERY_COMPLETE 2.md
./app-store-config 2.json
./AI_CULTURAL_SENSITIVITY_TEST_RESULTS 2.md
./ALCHM_PRODUCTION_READINESS_AUDIT 2.md
./crisis-safety-validation-test 2.js
./ASSET_3_APPS_GAMES_TAB_DESIGN 2.html
./XCODE_SETUP_GUIDE 2.md
./ALCHM_COMPREHENSIVE_MOBILE_PERFORMANCE_REPORT 2.md
./ALCHM_JONY_IVE_DESIGN_FOUNDATION 2.md
./PRODUCTION_TESTING_RESULTS 2.md
./alchm_featuring_report 2.md
./DEVELOPMENT_PATTERNS_GUIDE 2.md
./ARCHITECTURE 2.md
./beta-validation-report 2.json
./deploy-app-hosting 2.sh
./MOBILE_CRISIS_OPTIMIZATION_DEPLOYMENT_SUMMARY 2.md
./crisis-performance-results 2.json
./ALCHM_FRIENDS_FAMILY_LAUNCH_VALIDATION_REPORT 2.md
./cache-propagation-report 2.html
./COMPETITIVE_INTELLIGENCE_SYSTEM_DOCUMENTATION 2.md
./SERVER_DEPLOYMENT 2.md
./bundle-reports/vendor-optimization-1759258621126 2.json
./bundle-reports/bundle-report-1759257920203 2.json
./FIREBASE_STUDIO_EXCELLENCE_EXECUTIVE_SUMMARY 2.md
./CRISIS_PERFORMANCE_EMERGENCY_PLAN 2.md
./crisis-optimization-validation 2.json
./FINAL_ALCHM_AUTHENTICATION_VALIDATION_REPORT 2.md
./USABILITY_DISTRICT_TECH_INTEGRATION_QA 2.md
./JONY_IVE_AGE_VERIFICATION_SUCCESS 2.md
./CRISIS_SAFETY_INTEGRATION_GUIDE 2.md
./auth-test-final 2.png
./COMPREHENSIVE_XCODE_CRASHLYTICS_TESTLAB_GUIDE 2.md
./ALCHM_ACCESSIBILITY_IMPLEMENTATION_GUIDE 2.md
./crisis-performance-stress-test 2.js
./FIREBASE_STUDIO_DIAGNOSTIC_SUMMARY 2.md
./MOBILE_VALIDATION_REPORT 2.md
./APP_STORE_PROMOTIONAL_ASSETS_GUIDE 2.md
./MOBILE_AUTHENTICATION_CRITICAL_FIXES 2.md
./EMERGENCY_CREDENTIAL_ROTATION_GUIDE 2.md
./LEGAL_COMPLIANCE_CERTIFICATION 2.md
./beta-launch-validator 2.sh
./TECHNICAL_OVERVIEW 2.md
./out/sw 2.js
./android-metadata/google-play-metadata 2.json
./APP_STORE_READINESS_ANALYSIS 2.md
./.eslintrc 2.json
./ALCHM_ANALYTICS_MONITORING_COMPLETE 2.md
./.firebase/hosting.b3V0 2.cache
./auth-validation-results 2.json
./FIREBASE_STUDIO_ANALYSIS 2.md
./alchm_build 2.log
./ALCHM_RUM_IMPLEMENTATION_GUIDE 2.md
./auth-test-screenshot 2.png
./crisis-performance-test-results 2.json
./.lighthouseci/budget 2.json

CRITICAL ISSUES (must fix before TestFlight)
---------------------------------------------
1. Secrets in history or tracked files (BLOCKER) — addressed via history rewrite + placeholder cleanup.
2. Internal window.location-based reload/nav in user flows (HIGH) — addressed for internal flows; external intents remain.
3. Legacy crisis UI modules drifting from primary crisis components (MEDIUM) — removed unused legacy UI modules.

HIGH-PRIORITY ISSUES (should fix before TestFlight)
----------------------------------------------------
1. Next build warning chain via Sentry/Prisma instrumentation (MEDIUM) — review if it affects iOS bundle size/perf.
2. Large number of untracked duplicate ' 2.*' files (MEDIUM) — risk of accidental commit; recommend cleanup workflow.

MEDIUM-PRIORITY ISSUES (fix before App Store)
----------------------------------------------
1. Middleware/API routes are disabled in static export (expected) — ensure no runtime dependency.
2. Admin route uses Firebase auth and should be excluded from production builds if not needed.

LOW-PRIORITY ISSUES (tech debt / nice to have)
-----------------------------------------------
1. Debug/test routes should be removed or gated in production builds.

ARCHITECTURE RECOMMENDATIONS
-----------------------------
1. Keep all secrets out of repo; prefer device-only secrets or server proxy; never commit logs.
2. Consider removing Sentry server integrations for static export if they inflate bundles.
3. Create a dedicated cleanup branch to delete/ignore duplicate '* 2.*' artifacts.
