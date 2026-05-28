import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { getPlatform, isNativePlatform } from '@/services/platform/platformService';

interface NativeSubscriptionUiPlugin {
  presentSubscriptionScreen(): Promise<{
    presented: boolean;
    reason?: string;
  }>;
  getDiagnostics?(): Promise<NativeSubscriptionDiagnostics>;
  addListener(
    eventName: 'subscriptionSheetDidDismiss',
    listenerFunc: () => void,
  ): Promise<PluginListenerHandle>;
}

const NativeSubscriptionUi = registerPlugin<NativeSubscriptionUiPlugin>('ALCHMSubscriptions');
const SUBSCRIPTION_SHEET_DISMISS_TIMEOUT_MS = 120000;
const NATIVE_SUBSCRIPTION_DIAGNOSTICS_TIMEOUT_MS = 2500;

export interface NativeSubscriptionDiagnostics {
  nativePluginCallSucceeded: boolean;
  nativePluginErrorCategory: string | null;
  nativePluginErrorMessage: string | null;
  nativeConfigFound: boolean;
  plistKeyName: string | null;
  plistKeyFound: boolean;
  entitlementId: string | null;
  offeringId: string | null;
  appBundleId: string | null;
  bundleVersion: string | null;
  bundleShortVersion: string | null;
  bridgeControllerActive: boolean;
  pluginRegistered: boolean;
  validationError: string | null;
}

function sanitizeNativePluginError(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Native subscription diagnostics unavailable.';
  return message.replace(/\s+/g, ' ').slice(0, 160);
}

function getUnavailableNativeDiagnostics(
  category: string,
  message: string | null = null,
): NativeSubscriptionDiagnostics {
  return {
    nativePluginCallSucceeded: false,
    nativePluginErrorCategory: category,
    nativePluginErrorMessage: message,
    nativeConfigFound: false,
    plistKeyName: null,
    plistKeyFound: false,
    entitlementId: null,
    offeringId: null,
    appBundleId: null,
    bundleVersion: null,
    bundleShortVersion: null,
    bridgeControllerActive: false,
    pluginRegistered: false,
    validationError: null,
  };
}

function getNativeDiagnosticsTimeout(): Promise<NativeSubscriptionDiagnostics> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => {
      resolve(
        getUnavailableNativeDiagnostics(
          'plugin_call_timeout',
          'Native subscription diagnostics timed out.',
        ),
      );
    }, NATIVE_SUBSCRIPTION_DIAGNOSTICS_TIMEOUT_MS);
  });
}

export function canPresentNativeSubscriptionScreen(): boolean {
  return isNativePlatform() && getPlatform() === 'ios';
}

export async function presentNativeSubscriptionScreen(): Promise<boolean> {
  if (!canPresentNativeSubscriptionScreen()) {
    return false;
  }

  let listenerHandle: PluginListenerHandle | null = null;
  let resolveDismissal: (() => void) | null = null;

  try {
    const dismissed = new Promise<void>((resolve) => {
      resolveDismissal = resolve;
    });
    const dismissalTimeout = new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, SUBSCRIPTION_SHEET_DISMISS_TIMEOUT_MS);
    });

    listenerHandle = await NativeSubscriptionUi.addListener('subscriptionSheetDidDismiss', () => {
      resolveDismissal?.();
      resolveDismissal = null;
    });

    const result = await NativeSubscriptionUi.presentSubscriptionScreen();

    if (!result.presented) {
      await listenerHandle?.remove();
      listenerHandle = null;
      return false;
    }

    await Promise.race([dismissed, dismissalTimeout]);
    await listenerHandle?.remove();
    listenerHandle = null;
    return true;
  } catch (error) {
    console.warn('[RC] native subscription screen failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    await listenerHandle?.remove();
    return false;
  }
}

export async function getNativeSubscriptionDiagnostics(): Promise<NativeSubscriptionDiagnostics> {
  if (!canPresentNativeSubscriptionScreen()) {
    return getUnavailableNativeDiagnostics('not_native_ios');
  }

  if (!NativeSubscriptionUi.getDiagnostics) {
    return getUnavailableNativeDiagnostics('plugin_method_unavailable');
  }

  try {
    return await Promise.race([
      NativeSubscriptionUi.getDiagnostics(),
      getNativeDiagnosticsTimeout(),
    ]);
  } catch (error) {
    return getUnavailableNativeDiagnostics('plugin_call_failed', sanitizeNativePluginError(error));
  }
}
