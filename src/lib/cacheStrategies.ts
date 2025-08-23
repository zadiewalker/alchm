// Comprehensive caching strategies for ALCHM performance optimization
export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  staleWhileRevalidate?: number // Stale-while-revalidate time
  tags?: string[] // Cache tags for invalidation
  version?: string // Cache version for busting
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  version: string
  tags: string[]
}

// Multi-layer cache manager
export class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>()
  private readonly maxMemoryEntries = 1000
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  // Memory cache operations
  setMemory<T>(key: string, data: T, config: CacheConfig): void {
    // Evict old entries if at capacity
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      this.evictOldest()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: config.ttl,
      version: config.version || '1.0',
      tags: config.tags || []
    }

    this.memoryCache.set(key, entry)
  }

  getMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(key)
      return null
    }

    return entry.data as T
  }

  // Browser storage cache (localStorage/sessionStorage)
  async setStorage<T>(key: string, data: T, config: CacheConfig, persistent: boolean = true): Promise<void> {
    if (typeof window === 'undefined') return

    const storage = persistent ? localStorage : sessionStorage
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: config.ttl,
      version: config.version || '1.0',
      tags: config.tags || []
    }

    try {
      storage.setItem(`alchm_cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      console.warn('Failed to store in browser cache:', error)
      // Fallback to memory cache
      this.setMemory(key, data, config)
    }
  }

  async getStorage<T>(key: string, persistent: boolean = true): Promise<T | null> {
    if (typeof window === 'undefined') return null

    const storage = persistent ? localStorage : sessionStorage
    
    try {
      const cached = storage.getItem(`alchm_cache_${key}`)
      if (!cached) return null

      const entry: CacheEntry<T> = JSON.parse(cached)
      
      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        storage.removeItem(`alchm_cache_${key}`)
        return null
      }

      return entry.data
    } catch (error) {
      console.warn('Failed to retrieve from browser cache:', error)
      return null
    }
  }

  // IndexedDB cache for large data
  async setIndexedDB<T>(key: string, data: T, config: CacheConfig): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) return

    try {
      const db = await this.openIndexedDB()
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: config.ttl,
        version: config.version || '1.0',
        tags: config.tags || []
      }

      await new Promise((resolve, reject) => {
        const request = store.put({ key, ...entry })
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Failed to store in IndexedDB:', error)
    }
  }

  async getIndexedDB<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) return null

    try {
      const db = await this.openIndexedDB()
      const transaction = db.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      
      const result = await new Promise<any>((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (!result) return null

      // Check if expired
      if (Date.now() - result.timestamp > result.ttl) {
        await this.deleteIndexedDB(key)
        return null
      }

      return result.data as T
    } catch (error) {
      console.warn('Failed to retrieve from IndexedDB:', error)
      return null
    }
  }

  // Service Worker cache
  async setServiceWorkerCache(request: Request, response: Response, config: CacheConfig): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    try {
      const cache = await caches.open(`alchm-v${config.version || '1.0'}`)
      
      // Clone response since it can only be consumed once
      const responseClone = response.clone()
      
      // Add cache headers
      const headers = new Headers(responseClone.headers)
      headers.set('sw-cache-timestamp', Date.now().toString())
      headers.set('sw-cache-ttl', config.ttl.toString())
      
      const cachedResponse = new Response(await responseClone.blob(), {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers
      })

      await cache.put(request, cachedResponse)
    } catch (error) {
      console.warn('Failed to cache in Service Worker:', error)
    }
  }

  async getServiceWorkerCache(request: Request): Promise<Response | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null

    try {
      const cacheNames = await caches.keys()
      
      for (const cacheName of cacheNames.filter(name => name.startsWith('alchm-v'))) {
        const cache = await caches.open(cacheName)
        const response = await cache.match(request)
        
        if (response) {
          const timestamp = response.headers.get('sw-cache-timestamp')
          const ttl = response.headers.get('sw-cache-ttl')
          
          if (timestamp && ttl) {
            const age = Date.now() - parseInt(timestamp)
            if (age > parseInt(ttl)) {
              await cache.delete(request)
              continue
            }
          }
          
          return response
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve from Service Worker cache:', error)
    }

    return null
  }

  // Cache invalidation
  invalidateByTag(tag: string): void {
    // Memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags.includes(tag)) {
        this.memoryCache.delete(key)
      }
    }

    // Browser storage
    this.invalidateStorageByTag(tag)

    // IndexedDB
    this.invalidateIndexedDBByTag(tag)
  }

  invalidateByVersion(version: string): void {
    // Memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.version !== version) {
        this.memoryCache.delete(key)
      }
    }

    // Browser storage
    this.invalidateStorageByVersion(version)
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    
    // Memory cache cleanup
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.memoryCache.delete(key)
      }
    }

    // Browser storage cleanup
    this.cleanupStorage()

    // IndexedDB cleanup
    this.cleanupIndexedDB()
  }

  // Cache statistics
  getStats(): {
    memorySize: number
    memoryHitRate: number
    storageSize: number
  } {
    return {
      memorySize: this.memoryCache.size,
      memoryHitRate: 0, // Would need to track hits/misses
      storageSize: this.getStorageSize()
    }
  }

  // Private helper methods
  private evictOldest(): void {
    let oldest: [string, CacheEntry<any>] | null = null
    
    for (const entry of this.memoryCache.entries()) {
      if (!oldest || entry[1].timestamp < oldest[1].timestamp) {
        oldest = entry
      }
    }

    if (oldest) {
      this.memoryCache.delete(oldest[0])
    }
  }

  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('alchm-cache', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' })
          store.createIndex('timestamp', 'timestamp')
          store.createIndex('tags', 'tags', { multiEntry: true })
        }
      }
    })
  }

  private async deleteIndexedDB(key: string): Promise<void> {
    try {
      const db = await this.openIndexedDB()
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      
      await new Promise((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Failed to delete from IndexedDB:', error)
    }
  }

  private invalidateStorageByTag(tag: string): void {
    if (typeof window === 'undefined') return

    [localStorage, sessionStorage].forEach(storage => {
      const keysToDelete: string[] = []
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key?.startsWith('alchm_cache_')) {
          try {
            const entry = JSON.parse(storage.getItem(key)!)
            if (entry.tags?.includes(tag)) {
              keysToDelete.push(key)
            }
          } catch (error) {
            keysToDelete.push(key) // Remove invalid entries
          }
        }
      }

      keysToDelete.forEach(key => storage.removeItem(key))
    })
  }

  private invalidateStorageByVersion(version: string): void {
    if (typeof window === 'undefined') return

    [localStorage, sessionStorage].forEach(storage => {
      const keysToDelete: string[] = []
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key?.startsWith('alchm_cache_')) {
          try {
            const entry = JSON.parse(storage.getItem(key)!)
            if (entry.version !== version) {
              keysToDelete.push(key)
            }
          } catch (error) {
            keysToDelete.push(key)
          }
        }
      }

      keysToDelete.forEach(key => storage.removeItem(key))
    })
  }

  private cleanupStorage(): void {
    if (typeof window === 'undefined') return

    const now = Date.now()
    
    [localStorage, sessionStorage].forEach(storage => {
      const keysToDelete: string[] = []
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key?.startsWith('alchm_cache_')) {
          try {
            const entry = JSON.parse(storage.getItem(key)!)
            if (now - entry.timestamp > entry.ttl) {
              keysToDelete.push(key)
            }
          } catch (error) {
            keysToDelete.push(key)
          }
        }
      }

      keysToDelete.forEach(key => storage.removeItem(key))
    })
  }

  private async cleanupIndexedDB(): Promise<void> {
    try {
      const db = await this.openIndexedDB()
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const now = Date.now()
      
      const request = store.openCursor()
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          const entry = cursor.value
          if (now - entry.timestamp > entry.ttl) {
            cursor.delete()
          }
          cursor.continue()
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup IndexedDB:', error)
    }
  }

  private async invalidateIndexedDBByTag(tag: string): Promise<void> {
    try {
      const db = await this.openIndexedDB()
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('tags')
      
      const request = index.openCursor(IDBKeyRange.only(tag))
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
    } catch (error) {
      console.warn('Failed to invalidate IndexedDB by tag:', error)
    }
  }

  private getStorageSize(): number {
    if (typeof window === 'undefined') return 0

    let size = 0
    
    [localStorage, sessionStorage].forEach(storage => {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key?.startsWith('alchm_cache_')) {
          size += (storage.getItem(key) || '').length
        }
      }
    })

    return size
  }
}

// Application-specific cache strategies
export class AlchmCacheStrategies {
  private cacheManager = new CacheManager()

  // Journal entries cache
  async cacheJournalEntries(userId: string, entries: any[]): Promise<void> {
    await this.cacheManager.setStorage(
      `journal_entries_${userId}`,
      entries,
      {
        ttl: 10 * 60 * 1000, // 10 minutes
        tags: ['journal', `user:${userId}`],
        version: '1.0'
      }
    )
  }

  async getCachedJournalEntries(userId: string): Promise<any[] | null> {
    return await this.cacheManager.getStorage(`journal_entries_${userId}`)
  }

  // User session cache
  async cacheUserSession(userId: string, sessionData: any): Promise<void> {
    this.cacheManager.setMemory(
      `user_session_${userId}`,
      sessionData,
      {
        ttl: 30 * 60 * 1000, // 30 minutes
        tags: ['session', `user:${userId}`],
        version: '1.0'
      }
    )
  }

  getCachedUserSession(userId: string): any | null {
    return this.cacheManager.getMemory(`user_session_${userId}`)
  }

  // AI responses cache
  async cacheAIResponse(prompt: string, response: any): Promise<void> {
    const promptHash = await this.hashString(prompt)
    
    await this.cacheManager.setIndexedDB(
      `ai_response_${promptHash}`,
      response,
      {
        ttl: 60 * 60 * 1000, // 1 hour
        tags: ['ai', 'khepera'],
        version: '1.0'
      }
    )
  }

  async getCachedAIResponse(prompt: string): Promise<any | null> {
    const promptHash = await this.hashString(prompt)
    return await this.cacheManager.getIndexedDB(`ai_response_${promptHash}`)
  }

  // Static assets cache (handled by Service Worker)
  async cacheStaticAsset(request: Request, response: Response): Promise<void> {
    await this.cacheManager.setServiceWorkerCache(
      request,
      response,
      {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        tags: ['static'],
        version: '1.0'
      }
    )
  }

  async getCachedStaticAsset(request: Request): Promise<Response | null> {
    return await this.cacheManager.getServiceWorkerCache(request)
  }

  // Cache invalidation methods
  invalidateUserCache(userId: string): void {
    this.cacheManager.invalidateByTag(`user:${userId}`)
  }

  invalidateAICache(): void {
    this.cacheManager.invalidateByTag('ai')
  }

  invalidateAllCache(): void {
    this.cacheManager.invalidateByVersion('1.0')
  }

  // Cleanup and maintenance
  performMaintenance(): void {
    this.cacheManager.cleanup()
  }

  getCacheStats() {
    return this.cacheManager.getStats()
  }

  // Utility methods
  private async hashString(str: string): Promise<string> {
    if (typeof window !== 'undefined' && 'crypto' in window && 'subtle' in crypto) {
      const encoder = new TextEncoder()
      const data = encoder.encode(str)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
    
    // Fallback simple hash
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }
}

// Singleton instance
let cacheStrategies: AlchmCacheStrategies | null = null

export function getCacheStrategies(): AlchmCacheStrategies {
  if (!cacheStrategies) {
    cacheStrategies = new AlchmCacheStrategies()
  }
  return cacheStrategies
}

// Cache warming utilities
export class CacheWarmer {
  private cacheStrategies = getCacheStrategies()

  // Warm critical user data
  async warmUserCache(userId: string): Promise<void> {
    try {
      // Preload user session
      const sessionResponse = await fetch(`/api/user/${userId}/session`)
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json()
        await this.cacheStrategies.cacheUserSession(userId, sessionData)
      }

      // Preload recent journal entries
      const entriesResponse = await fetch(`/api/user/${userId}/entries?limit=20`)
      if (entriesResponse.ok) {
        const entries = await entriesResponse.json()
        await this.cacheStrategies.cacheJournalEntries(userId, entries)
      }
    } catch (error) {
      console.warn('Failed to warm user cache:', error)
    }
  }

  // Warm static assets
  async warmStaticAssets(): Promise<void> {
    const criticalAssets = [
      '/static/css/app.css',
      '/static/js/app.js',
      '/static/fonts/inter.woff2',
      '/static/images/logo.svg'
    ]

    const warmPromises = criticalAssets.map(async (asset) => {
      try {
        const response = await fetch(asset)
        if (response.ok) {
          const request = new Request(asset)
          await this.cacheStrategies.cacheStaticAsset(request, response)
        }
      } catch (error) {
        console.warn(`Failed to warm asset ${asset}:`, error)
      }
    })

    await Promise.allSettled(warmPromises)
  }
}