let online = true;
export async function initNetworkStatus() { online = typeof navigator !== 'undefined' ? navigator.onLine : true; }
export function isOnline() { return online; }
