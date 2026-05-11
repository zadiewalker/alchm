import type { CapacitorConfig } from '@capacitor/cli';

// Bundled-only configuration for static export.
// Do not set server.url for App Store/TestFlight builds.
const config: CapacitorConfig = {
  appId: 'com.alchm.sanctuary',
  appName: 'ALCHM',
  webDir: 'out',
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#2D332A',
    allowsLinkPreview: false,
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#8B9A7C',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#8B9A7C',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'none',
      style: 'DARK',
    },
  },
};

export default config;
