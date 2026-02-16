export interface SessionValidationResult {
  valid: boolean;
  userId?: string;
  error?: {
    userMessage: string;
  };
}

// Compatibility shim for legacy pages/api routes.
// Static export builds compile this file, but these routes are not used in iOS bundled mode.
export async function validateSession(): Promise<SessionValidationResult> {
  return {
    valid: false,
    error: {
      userMessage: 'Session validation is unavailable in static mode.',
    },
  };
}
