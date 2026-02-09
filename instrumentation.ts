// Minimal instrumentation file for Sentry/Next.js compatibility
// Required to suppress instrumentation warnings with static export

export async function register() {
  // No-op for static export compatibility
  // Sentry initialization happens in individual config files instead
}