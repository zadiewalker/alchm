import type { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const serverUrl = process.env.CAPACITOR_SERVER_URL;
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
  // Server/API mode packaging: bundle minimal fallback web assets,
  // but run the app from the configured remote Next.js server.
  webDir: 'public',
  server: {
    ...(serverUrl ? { url: getEffectiveServerUrl(serverUrl) } : {}),
    androidScheme: 'https',
    cleartext: serverUrl ? getEffectiveServerUrl(serverUrl)?.startsWith('http://') : true,
    allowNavigation: getAllowedNavigationHosts(serverUrl)
  },
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
