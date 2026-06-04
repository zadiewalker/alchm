export type AppStoreScreenshotId =
  | 'entry'
  | 'presence'
  | 'writing'
  | 'reflection'
  | 'trust'
  | 'close';

export interface AppStoreScreenshotDefinition {
  id: AppStoreScreenshotId;
  headline: string;
  subline: string;
  preferredScreen: string;
  assetPath: string;
  status: 'pending' | 'ready';
  imageSrc?: string;
  imageAlt: string;
  imageObjectPosition?: string;
  screenshotOffsetY?: string;
}

export interface AppStoreExportProfile {
  id: 'iphone-69' | 'iphone-65';
  label: string;
  width: number;
  height: number;
  copyMaxWidth: number;
  outerPadding: number;
  copyTop: number;
  screenshotTop: number;
  screenshotWidth: number;
  screenshotHeight: number;
}

export const APP_STORE_SCREENSHOT_TOKENS = {
  background:
    'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15), transparent 36%), linear-gradient(180deg, #A8B5A0 0%, #8B9A7C 42%, #8B9A7C 100%)',
  surface:
    'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 100%)',
  screenshotBorder: '1px solid rgba(255,255,255,0.2)',
  screenshotShadow: '0 36px 72px rgba(255,255,255,0.2)',
  screenRadius: 44,
  textGap: 20,
  headlineFamily: 'var(--font-display)',
  bodyFamily: 'var(--font-ui)',
  headlineColor: 'var(--color-text-primary)',
  sublineColor: 'rgba(255,255,255,0.8)',
  noteColor: 'rgba(255,255,255,0.7)',
  eyebrowColor: 'rgba(255,255,255,0.7)',
} as const;

export const APP_STORE_EXPORT_PROFILES: readonly AppStoreExportProfile[] = [
  {
    id: 'iphone-69',
    label: 'iPhone 6.9"',
    width: 1290,
    height: 2796,
    copyMaxWidth: 780,
    outerPadding: 112,
    copyTop: 188,
    screenshotTop: 930,
    screenshotWidth: 844,
    screenshotHeight: 1716,
  },
  {
    id: 'iphone-65',
    label: 'iPhone 6.5"',
    width: 1242,
    height: 2688,
    copyMaxWidth: 760,
    outerPadding: 104,
    copyTop: 176,
    screenshotTop: 892,
    screenshotWidth: 812,
    screenshotHeight: 1648,
  },
] as const;

export const DEFAULT_APP_STORE_EXPORT_PROFILE = APP_STORE_EXPORT_PROFILES[0];

export const APP_STORE_SCREENSHOTS: readonly AppStoreScreenshotDefinition[] = [
  {
    id: 'entry',
    headline: 'A place to put what is here.',
    subline: 'You don’t need the right words.',
    preferredScreen: 'onboarding / arrival / pause-like screen',
    assetPath: '/marketing/app-store/entry.png',
    status: 'pending',
    imageAlt: 'ALCHM entry screenshot slot',
    imageObjectPosition: 'center top',
    screenshotOffsetY: '18px',
  },
  {
    id: 'presence',
    headline: 'Start with what’s present.',
    subline: 'No tracking. No scoring. No pressure.',
    preferredScreen: 'dashboard hero or main home view',
    assetPath: '/marketing/app-store/presence.png',
    status: 'pending',
    imageAlt: 'ALCHM presence screenshot slot',
    imageObjectPosition: 'center top',
    screenshotOffsetY: '8px',
  },
  {
    id: 'writing',
    headline: 'Begin anywhere.',
    subline: 'A quiet space to write and stay.',
    preferredScreen: 'entry / writing / somatic prompt screen',
    assetPath: '/marketing/app-store/writing.png',
    status: 'pending',
    imageAlt: 'ALCHM writing screenshot slot',
    imageObjectPosition: 'center top',
  },
  {
    id: 'reflection',
    headline: 'A reflection, not advice.',
    subline: 'Khepera stays with what you write.',
    preferredScreen: 'Khepera reflection screen',
    assetPath: '/marketing/app-store/reflection.png',
    status: 'pending',
    imageAlt: 'ALCHM reflection screenshot slot',
    imageObjectPosition: 'center center',
  },
  {
    id: 'trust',
    headline: 'What you write stays yours.',
    subline: 'Only what you choose is included.',
    preferredScreen: 'export preview / privacy / trust-oriented screen',
    assetPath: '/marketing/app-store/trust.png',
    status: 'pending',
    imageAlt: 'ALCHM trust screenshot slot',
    imageObjectPosition: 'center top',
  },
  {
    id: 'close',
    headline: 'Your space is ready.',
    subline: 'Begin from where you are.',
    preferredScreen: 'ready / completion / dashboard re-entry screen',
    assetPath: '/marketing/app-store/close.png',
    status: 'pending',
    imageAlt: 'ALCHM close screenshot slot',
    imageObjectPosition: 'center top',
  },
] as const;

export function getAppStoreExportProfile(
  profileId?: string,
): AppStoreExportProfile {
  return (
    APP_STORE_EXPORT_PROFILES.find((profile) => profile.id === profileId) ??
    DEFAULT_APP_STORE_EXPORT_PROFILE
  );
}
