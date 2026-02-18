import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alchm.sanctuary',
  appName: 'ALCHM',
  webDir: 'dist',
  // Bundled static files only. Never point to a dev server in production.
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#2D332A',
    scheme: 'App',
    webContentsDebuggingEnabled: false,
    allowsLinkPreview: false,
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // Hide manually after React mounts.
      launchShowDuration: 1200,
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
