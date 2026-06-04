// src/boot/bootstrap.ts
// Runs BEFORE React mounts. No async. No promises. No Firebase.
// Purpose: validate environment, apply CSS tokens, check storage version.

import { STORAGE_KEYS } from '@/config/storageKeys';
import { isOnboardingComplete, migrateStorage } from '@/services/storage/storageMigrationService';
import { BUILD_STAMP } from '@/config/buildInfo';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/utils/storage';
import { installGlobalErrorHandlers } from './errorHandlers';
import { loadFonts } from './loadFonts';

export type BootstrapResult = {
  ok: boolean;
  storageVersion: string;
  isFirstLaunch: boolean;
  hasCompletedOnboarding: boolean;
  error?: string;
};

export function bootstrap(): BootstrapResult {
  try {
    if (typeof window !== 'undefined') {
      window.console.info(`[ALCHM build] ${BUILD_STAMP}`);
      (window as Window & { __ALCHM_BUILD__?: string }).__ALCHM_BUILD__ = BUILD_STAMP;
    }

    // 0. Install error handlers before anything else
    installGlobalErrorHandlers();

    // 1. Apply CSS tokens directly to :root before first paint
    // This bypasses the CSS file loading race condition in Capacitor WebView
    applyCSSTokens();

    // 2. Load fonts programmatically to ensure they work in WebView
    loadFonts();

    // 3. Migrate storage if version changed
    migrateStorage();

    // 4. Read onboarding state
    const hasCompletedOnboarding = isOnboardingComplete();
    const isFirstLaunch = !getStorageItemWithFallback(STORAGE_KEYS.LAUNCHED_BEFORE);

    // Mark as launched
    setStorageItemNormalized(STORAGE_KEYS.LAUNCHED_BEFORE, 'true');

    return {
      ok: true,
      storageVersion: '1.0',
      isFirstLaunch,
      hasCompletedOnboarding,
    };
  } catch (error) {
    return {
      ok: false,
      storageVersion: '1.0',
      isFirstLaunch: false,
      hasCompletedOnboarding: false,
      error: error instanceof Error ? error.message : 'Bootstrap failed',
    };
  }
}

// Apply CSS custom properties directly via JavaScript.
// This is the ONLY reliable way to set CSS variables in Capacitor WebView.
// CSS files can fail silently. JS runs synchronously before paint.
function applyCSSTokens(): void {
  const root = document.documentElement;

  root.style.setProperty('--bg-base', '#1F2A1B');
  root.style.setProperty('--bg-surface', 'rgba(68, 83, 57, 0.82)');
  root.style.setProperty('--bg-surface-deep', '#2D3A25');
  root.style.setProperty('--bg-inset', 'rgba(168, 185, 147, 0.16)');
  root.style.setProperty('--bg-nav', 'rgba(31, 42, 27, 0.92)');
  root.style.setProperty('--bg-overlay', 'rgba(31, 42, 27, 0.32)');

  root.style.setProperty('--background-primary', '#1F2A1B');
  root.style.setProperty('--surface-color', 'rgba(68, 83, 57, 0.82)');
  root.style.setProperty('--surface-elevated', 'rgba(139, 154, 124, 0.34)');
  root.style.setProperty('--surface-input', 'rgba(168, 185, 147, 0.16)');
  root.style.setProperty('--surface-nav', 'rgba(31, 42, 27, 0.92)');

  root.style.setProperty('--text-primary', '#FFF3D6');
  root.style.setProperty('--text-secondary', 'rgba(243, 231, 200, 0.78)');
  root.style.setProperty('--text-muted', 'rgba(168, 185, 147, 0.72)');
  root.style.setProperty('--text-tertiary', 'rgba(168, 185, 147, 0.72)');
  root.style.setProperty('--text-hint', 'rgba(168, 185, 147, 0.62)');

  root.style.setProperty('--khepera-text', '#FFF3D6');
  root.style.setProperty('--khepera-seed', '#F3E7C8');
  root.style.setProperty('--khepera-attr', 'rgba(168, 185, 147, 0.72)');
  root.style.setProperty('--khepera-card-bg', 'rgba(139, 154, 124, 0.26)');
  root.style.setProperty('--khepera-card-border', 'rgba(185,151,78,0.2)');
  root.style.setProperty('--khepera-reflection-text', '#FFF3D6');
  root.style.setProperty('--khepera-perspective-text', '#F3E7C8');
  root.style.setProperty('--khepera-seed-text', '#FFF3D6');
  root.style.setProperty('--khepera-support-text', 'rgba(243, 231, 200, 0.78)');
  root.style.setProperty('--khepera-label-text', 'rgba(168, 185, 147, 0.72)');
  root.style.setProperty('--khepera-measure', '32ch');
  root.style.setProperty('--khepera-seed-measure', '24ch');
  root.style.setProperty('--khepera-inset', '28px');
  root.style.setProperty('--khepera-block-gap', '16px');
  root.style.setProperty('--khepera-paragraph-gap', '18px');
  root.style.setProperty('--khepera-section-gap', '26px');
  root.style.setProperty('--scarab-logo-size-sm', '36px');
  root.style.setProperty('--scarab-logo-size-md', '52px');
  root.style.setProperty('--scarab-logo-size-lg', '88px');
  root.style.setProperty('--scarab-logo-space-sm', '12px');
  root.style.setProperty('--scarab-logo-space-md', '20px');
  root.style.setProperty('--scarab-logo-space-lg', '28px');

  root.style.setProperty('--gold', '#B9974E');
  root.style.setProperty('--gold-border', 'rgba(185, 151, 78, 0.42)');
  root.style.setProperty('--gold-subtle', 'rgba(185, 151, 78, 0.18)');
  root.style.setProperty('--accent-primary', '#B9974E');
  root.style.setProperty('--accent-hover', '#C7A967');

  root.style.setProperty('--border-subtle', 'rgba(185,151,78,0.2)');
  root.style.setProperty('--border-normal', 'rgba(185,151,78,0.2)');
  root.style.setProperty('--border-strong', 'rgba(185,151,78,0.42)');
  root.style.setProperty('--border-divider', 'rgba(185,151,78,0.2)');
  root.style.setProperty('--border-visible', 'rgba(185,151,78,0.42)');
  root.style.setProperty('--surface-focus', 'rgba(168, 185, 147, 0.28)');
  root.style.setProperty('--surface-soft-hover', 'rgba(168, 185, 147, 0.16)');
  root.style.setProperty('--surface-soft-selected', 'rgba(168, 185, 147, 0.22)');
  root.style.setProperty('--surface-nav-halo', 'rgba(198, 168, 94, 0.22)');
  root.style.setProperty('--surface-nav-active', 'rgba(255, 255, 255, 0.08)');
  root.style.setProperty('--border-selected', 'rgba(255, 255, 255, 0.12)');
  root.style.setProperty('--focus-ring-soft', 'rgba(255,255,255,0.04)');
  root.style.setProperty('--shadow-input-rest', 'inset 0 1px 0 rgba(255,255,255,0.08)');
  root.style.setProperty('--shadow-input-focus', '0 0 0 1px rgba(255,255,255,0.04)');
  root.style.setProperty('--gradient-writing-shelf', 'linear-gradient(180deg, rgba(31, 42, 27, 0) 0%, rgba(31, 42, 27, 0.88) 30%, rgba(31, 42, 27, 0.98) 100%)');
  root.style.setProperty('--shadow-nav', '0 -10px 38px rgba(31, 42, 27, 0.34)');
  root.style.setProperty('--font-family-serif', '"Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, "Noto Serif", Georgia, serif');
  root.style.setProperty('--font-family-heading', 'var(--font-family-serif)');
  root.style.setProperty('--font-family-khepera', 'var(--font-family-serif)');
  root.style.setProperty('--font-serif', 'var(--font-family-serif)');
  root.style.setProperty('--text-title', 'var(--font-size-2xl)');
  root.style.setProperty('--text-seed', '30px');
  root.style.setProperty('--transition-base', '190ms cubic-bezier(0.22, 1, 0.36, 1)');
  root.style.setProperty('--transition-quiet', '210ms cubic-bezier(0.22, 1, 0.36, 1)');
  root.style.setProperty('--transition-slow', '240ms cubic-bezier(0.22, 1, 0.36, 1)');
  root.style.setProperty('--motion-fast', '150ms');
  root.style.setProperty('--motion-normal', '190ms');
  root.style.setProperty('--motion-slow', '240ms');
  root.style.setProperty('--motion-easing', 'cubic-bezier(0.22, 1, 0.36, 1)');

  root.style.setProperty('--btn-primary-bg', '#B9974E');
  root.style.setProperty('--btn-primary-border', 'rgba(185,151,78,0.42)');
  root.style.setProperty('--btn-primary-text', '#FFF3D6');
  root.style.setProperty('--btn-primary-active', '#C7A967');

  document.body.style.backgroundColor = 'var(--background-primary)';
}
