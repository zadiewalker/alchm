export async function hideNativeSplashScreen(fadeOutDuration = 500): Promise<void> {
  if (typeof window === 'undefined' || !(window as { Capacitor?: unknown }).Capacitor) {
    return;
  }

  const { SplashScreen } = await import('@capacitor/splash-screen');
  await SplashScreen.hide({ fadeOutDuration });
}
