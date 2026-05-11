/**
 * Mock implementation of idb-keyval for build-time compatibility
 * 
 * This provides fallback functionality when the real idb-keyval is not available
 * without persisting raw journal text into browser storage.
 */

const mockStore = new Map<string, unknown>();

export async function get<T = unknown>(key: string | IDBKeyRange): Promise<T | undefined> {
  return mockStore.get(String(key)) as T | undefined;
}

export async function set(key: string | IDBKeyRange, value: unknown): Promise<void> {
  mockStore.set(String(key), value);
}

export async function del(key: string | IDBKeyRange): Promise<void> {
  mockStore.delete(String(key));
}

export async function clear(): Promise<void> {
  mockStore.clear();
}

export async function keys<KeyType = IDBKeyRange>(): Promise<KeyType[]> {
  return Array.from(mockStore.keys()) as KeyType[];
}
