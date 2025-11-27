import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alchm.app',
  appName: 'ALCHM',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    url: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#a4b792',
    allowsLinkPreview: false,
    scrollEnabled: true,
    presentationStyle: 'fullscreen',
    scheme: 'ALCHM'
  },
  android: {
    backgroundColor: '#a4b792',
    allowMixedContent: true,
    captureInput: true
  },
  plugins: {
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#a4b792',
      overlay: false
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#a4b792',
      androidSplashResourceName: 'splash',
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#f7f7f2',
      showSpinner: false
    },
    App: {
      launchUrl: 'https://alchmapp.web.app'
    }
  }
};

export default config;
