const logs: Array<{ type: string; title: string; detail: string; at: string }> = [];
export function appendStartupError(entry: { type: string; title: string; detail: string }) { logs.push({ ...entry, at: new Date().toISOString() }); }
export function getStartupErrors() { return logs.slice(-100); }
