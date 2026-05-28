import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { isNativePlatform } from '@/services/platform/platformService';

export async function triggerHapticImpact(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
  if (!isNativePlatform()) return;

  const impactStyle =
    style === 'heavy'
      ? ImpactStyle.Heavy
      : style === 'medium'
        ? ImpactStyle.Medium
        : ImpactStyle.Light;

  await Haptics.impact({ style: impactStyle }).catch(() => {});
}

export function subscribeToKeyboardVisibility(
  onChange: (visible: boolean) => void
): () => void {
  if (!isNativePlatform()) return () => {};

  let disposed = false;
  let showHandle: { remove: () => void } | null = null;
  let hideHandle: { remove: () => void } | null = null;

  Keyboard.addListener('keyboardWillShow', () => {
    if (!disposed) onChange(true);
  }).then((listener) => {
    if (disposed) {
      listener.remove();
      return;
    }
    showHandle = listener;
  });

  Keyboard.addListener('keyboardWillHide', () => {
    if (!disposed) onChange(false);
  }).then((listener) => {
    if (disposed) {
      listener.remove();
      return;
    }
    hideHandle = listener;
  });

  return () => {
    disposed = true;
    showHandle?.remove();
    hideHandle?.remove();
  };
}
