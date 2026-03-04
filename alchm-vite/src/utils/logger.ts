export function log(...args: unknown[]) { if (import.meta.env.DEV) console.log('[alchm]', ...args); }
