import type { ReflectionExportDocumentOutput } from '../../types/exports';
import { recordOperationalException, recordOperationalEvent } from '@/services/monitoring/telemetry';

export type ReflectionExportDeliveryResult = {
  method: 'share' | 'download';
};

function downloadFile(fileName: string, content: string): ReflectionExportDeliveryResult {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return { method: 'download' };
}

export async function exportReflectionDocument(
  output: ReflectionExportDocumentOutput
): Promise<ReflectionExportDeliveryResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Reflection export is only available in a browser context.');
  }

  const file = new File([output.html], output.fileName, {
    type: 'text/html;charset=utf-8',
  });

  try {
    const [{ Capacitor }, { Share }] = await Promise.all([
      import('@capacitor/core'),
      import('@capacitor/share'),
    ]);

    if (Capacitor.isNativePlatform()) {
      const blob = new Blob([output.html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      try {
        await Share.share({
          title: output.fileName.replace(/\.html$/i, ''),
          text: 'Reflection Export',
          url,
        });

        recordOperationalEvent('submission_transition', { state: 'export_shared_native' });
        return { method: 'share' };
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  } catch (error) {
    recordOperationalException('export_failure', error, { state: 'native_share_unavailable' });
    // Fall back to the browser share/download flow below when the native bridge
    // is unavailable or not usable in the current environment.
  }

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: output.fileName.replace(/\.html$/i, ''),
        text: 'Reflection Export',
      });
      recordOperationalEvent('submission_transition', { state: 'export_shared_browser' });
      return { method: 'share' };
    } catch (error) {
      recordOperationalException('export_failure', error, { state: 'browser_share_failed' });
    }
  }

  return downloadFile(output.fileName, output.html);
}
