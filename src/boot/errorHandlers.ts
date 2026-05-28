// src/boot/errorHandlers.ts
// Called once during bootstrap, before React mounts

function dispatchFatal(message: string): void {
  try {
    window.dispatchEvent(
      new CustomEvent('alchm:fatal', {
        detail: { message },
      })
    );
  } catch {
    // Ignore dispatch failures; console logging is the primary signal.
  }
}

export function installGlobalErrorHandlers(): void {
  // Handle unhandled Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;

    // Ignore empty errors — these are from unmounted async operations
    // The useSafeAsync hook prevents these at the source;
    // this is the backstop
    if (
      !error ||
      error === null ||
      error === undefined ||
      (typeof error === 'object' && Object.keys(error).length === 0) ||
      (typeof error === 'string' && error.trim() === '')
    ) {
      event.preventDefault();
      return;
    }

    // Ignore Firebase network errors in offline mode
    if (
      error?.code === 'unavailable' ||
      error?.code === 'failed-precondition' ||
      error?.message?.includes('offline') ||
      error?.message?.includes('network')
    ) {
      event.preventDefault();
      return;
    }

    console.error('[FATAL unhandledrejection]', {
      reason: error,
      stack: error?.stack,
    });
    dispatchFatal(
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'An unhandled promise rejection occurred during startup.'
    );
  });

  // Handle synchronous errors
  window.addEventListener('error', (event) => {
    // Cross-origin script errors have no useful info — suppress
    if (event.message === 'Script error.' && event.colno === 0) {
      event.preventDefault();
      return;
    }

    // Firebase/network errors — suppress in offline mode
    if (
      event.message?.includes('offline') ||
      event.message?.includes('network') ||
      event.message?.includes('FirebaseError')
    ) {
      event.preventDefault();
      return;
    }

    console.error('[FATAL window.error]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
    });
    dispatchFatal(event.message || 'A JavaScript error occurred during startup.');
  });
}
