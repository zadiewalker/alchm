export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export function sanitizeInputSecure(input: string, options?: { maxLength?: number }): string {
  const maxLength = options?.maxLength ?? 10000;
  return String(input || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .slice(0, maxLength)
    .trim();
}
