// Firestore mock
import { jest } from '@jest/globals'

// Mock Firestore data
const mockData = new Map()

// Mock Timestamp
export const Timestamp = {
  now: jest.fn(() => ({
    toDate: () => new Date(),
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0
  })),
  fromDate: jest.fn((date: Date) => ({
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0
  }))
}

// Mock DocumentReference
const createMockDocRef = (path: string) => ({
  id: path.split('/').pop(),
  path,
  get: jest.fn(() => Promise.resolve({
    id: path.split('/').pop(),
    exists: () => mockData.has(path),
    data: () => mockData.get(path) || null,
    ref: createMockDocRef(path)
  })),
  set: jest.fn((data: any) => {
    mockData.set(path, data)
    return Promise.resolve()
  }),
  update: jest.fn((data: any) => {
    const existing = mockData.get(path) || {}
    mockData.set(path, { ...existing, ...data })
    return Promise.resolve()
  }),
  delete: jest.fn(() => {
    mockData.delete(path)
    return Promise.resolve()
  }),
  onSnapshot: jest.fn((callback: any) => {
    // Call callback immediately with mock data
    const docData = mockData.get(path)
    callback({
      id: path.split('/').pop(),
      exists: () => !!docData,
      data: () => docData || null
    })
    // Return unsubscribe function
    return jest.fn()
  })
})

// Mock Query
const createMockQuery = (collectionPath: string) => ({
  where: jest.fn(() => createMockQuery(collectionPath)),
  orderBy: jest.fn(() => createMockQuery(collectionPath)),
  limit: jest.fn(() => createMockQuery(collectionPath)),
  startAfter: jest.fn(() => createMockQuery(collectionPath)),
  get: jest.fn(() => Promise.resolve({
    docs: Array.from(mockData.entries())
      .filter(([path]) => path.startsWith(collectionPath))
      .map(([path, data]) => ({
        id: path.split('/').pop(),
        exists: true,
        data: () => data,
        ref: createMockDocRef(path)
      })),
    empty: false,
    size: mockData.size
  })),
  onSnapshot: jest.fn((callback: any) => {
    const docs = Array.from(mockData.entries())
      .filter(([path]) => path.startsWith(collectionPath))
      .map(([path, data]) => ({
        id: path.split('/').pop(),
        exists: true,
        data: () => data,
        ref: createMockDocRef(path)
      }))
    
    callback({
      docs,
      empty: docs.length === 0,
      size: docs.length
    })
    
    return jest.fn() // unsubscribe
  })
})

// Mock CollectionReference
const createMockCollectionRef = (path: string) => ({
  ...createMockQuery(path),
  doc: jest.fn((id?: string) => {
    const docId = id || 'auto-generated-id'
    return createMockDocRef(`${path}/${docId}`)
  }),
  add: jest.fn((data: any) => {
    const docId = 'auto-generated-id-' + Date.now()
    const docPath = `${path}/${docId}`
    mockData.set(docPath, data)
    return Promise.resolve(createMockDocRef(docPath))
  })
})

// Main Firestore mock
export const getFirestore = jest.fn(() => ({
  collection: jest.fn((path: string) => createMockCollectionRef(path)),
  doc: jest.fn((path: string) => createMockDocRef(path)),
  runTransaction: jest.fn((updateFunction: any) => {
    return Promise.resolve(updateFunction({
      get: jest.fn((ref: any) => Promise.resolve({
        exists: () => mockData.has(ref.path),
        data: () => mockData.get(ref.path)
      })),
      set: jest.fn((ref: any, data: any) => {
        mockData.set(ref.path, data)
      }),
      update: jest.fn((ref: any, data: any) => {
        const existing = mockData.get(ref.path) || {}
        mockData.set(ref.path, { ...existing, ...data })
      }),
      delete: jest.fn((ref: any) => {
        mockData.delete(ref.path)
      })
    }))
  }),
  batch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve())
  }))
}))

export const connectFirestoreEmulator = jest.fn()
export const enableIndexedDbPersistence = jest.fn(() => Promise.resolve())
export const enableMultiTabIndexedDbPersistence = jest.fn(() => Promise.resolve())

// Query helpers
export const query = jest.fn((collection: any, ...constraints: any[]) => ({
  ...collection,
  _constraints: constraints
}))

export const where = jest.fn((field: string, operator: string, value: any) => ({
  type: 'where',
  field,
  operator,
  value
}))

export const orderBy = jest.fn((field: string, direction?: string) => ({
  type: 'orderBy',
  field,
  direction: direction || 'asc'
}))

export const limit = jest.fn((limitValue: number) => ({
  type: 'limit',
  limit: limitValue
}))

export const startAfter = jest.fn((doc: any) => ({
  type: 'startAfter',
  doc
}))

// Utilities for testing
export const __mockData = mockData
export const __clearMockData = () => mockData.clear()

export default {
  getFirestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  startAfter
}