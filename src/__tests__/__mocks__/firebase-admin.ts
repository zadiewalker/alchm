// Firebase Admin mock
import { jest } from '@jest/globals'

const mockData = new Map()

// Mock Admin SDK
export const initializeApp = jest.fn(() => ({
  name: 'admin-app',
  projectId: 'test-project'
}))

export const getApp = jest.fn(() => ({
  name: 'admin-app',
  projectId: 'test-project'
}))

export const getApps = jest.fn(() => [])

// Auth Admin Mock
export const auth = jest.fn(() => ({
  verifyIdToken: jest.fn((_token: string) => Promise.resolve({
    uid: 'test-user-id',
    email: 'test@example.com',
    aud: 'test-project',
    iss: 'https://securetoken.google.com/test-project',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    sub: 'test-user-id'
  })),
  createUser: jest.fn((properties: any) => Promise.resolve({
    uid: 'new-user-id',
    email: properties.email,
    emailVerified: properties.emailVerified || false,
    displayName: properties.displayName || null
  })),
  getUserByEmail: jest.fn((email: string) => Promise.resolve({
    uid: 'test-user-id',
    email,
    emailVerified: true,
    displayName: 'Test User'
  })),
  updateUser: jest.fn((uid: string, properties: any) => Promise.resolve({
    uid,
    ...properties
  })),
  deleteUser: jest.fn(() => Promise.resolve()),
  setCustomUserClaims: jest.fn(() => Promise.resolve())
}))

// Firestore Admin Mock
export const firestore = jest.fn(() => ({
  collection: jest.fn((path: string) => ({
    doc: jest.fn((id?: string) => {
      const docId = id || 'auto-generated-id'
      const docPath = `${path}/${docId}`
      
      return {
        id: docId,
        path: docPath,
        get: jest.fn(() => Promise.resolve({
          id: docId,
          exists: mockData.has(docPath),
          data: () => mockData.get(docPath) || null,
          ref: { id: docId, path: docPath }
        })),
        set: jest.fn((data: any) => {
          mockData.set(docPath, data)
          return Promise.resolve()
        }),
        update: jest.fn((data: any) => {
          const existing = mockData.get(docPath) || {}
          mockData.set(docPath, { ...existing, ...data })
          return Promise.resolve()
        }),
        delete: jest.fn(() => {
          mockData.delete(docPath)
          return Promise.resolve()
        })
      }
    }),
    add: jest.fn((data: any) => {
      const docId = 'auto-generated-id-' + Date.now()
      const docPath = `${path}/${docId}`
      mockData.set(docPath, data)
      return Promise.resolve({
        id: docId,
        path: docPath
      })
    }),
    where: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({
        docs: Array.from(mockData.entries())
          .filter(([key]) => key.startsWith(path))
          .map(([key, value]) => ({
            id: key.split('/').pop(),
            data: () => value,
            ref: { id: key.split('/').pop(), path: key }
          })),
        empty: false,
        size: 1
      }))
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({
        docs: [],
        empty: true,
        size: 0
      }))
    })),
    limit: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({
        docs: [],
        empty: true,
        size: 0
      }))
    }))
  })),
  doc: jest.fn((path: string) => ({
    id: path.split('/').pop(),
    path,
    get: jest.fn(() => Promise.resolve({
      id: path.split('/').pop(),
      exists: mockData.has(path),
      data: () => mockData.get(path) || null
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
    })
  })),
  runTransaction: jest.fn((updateFunction: any) => {
    return Promise.resolve(updateFunction({
      get: jest.fn((ref: any) => Promise.resolve({
        exists: mockData.has(ref.path),
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

// Timestamp mock
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

// Functions Admin Mock
export const functions = jest.fn(() => ({
  httpsCallable: jest.fn((_name: string) => jest.fn((_data: any) => Promise.resolve({
    data: { result: 'mock-result' }
  })))
}))

// Test utilities
export const __mockData = mockData
export const __clearMockData = () => mockData.clear()

export default {
  initializeApp,
  getApp,
  getApps,
  auth,
  firestore,
  functions,
  Timestamp
}