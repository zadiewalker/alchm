// Firebase Auth mock
import { jest } from '@jest/globals'

// Mock user data
let mockCurrentUser: any = null

export const getAuth = jest.fn(() => ({
  currentUser: mockCurrentUser,
  onAuthStateChanged: jest.fn((callback: any) => {
    // Call callback immediately with current user
    callback(mockCurrentUser)
    // Return unsubscribe function
    return jest.fn()
  }),
  signOut: jest.fn(() => {
    mockCurrentUser = null
    return Promise.resolve()
  })
}))

export const signInWithEmailAndPassword = jest.fn((auth: any, email: string, _password: string) => {
  const mockUser = {
    uid: 'test-user-id',
    email,
    emailVerified: true,
    displayName: 'Test User',
    getIdToken: jest.fn(() => Promise.resolve('mock-id-token')),
    getIdTokenResult: jest.fn(() => Promise.resolve({
      token: 'mock-id-token',
      claims: {}
    }))
  }
  
  mockCurrentUser = mockUser
  
  return Promise.resolve({
    user: mockUser,
    credential: null,
    operationType: 'signIn'
  })
})

export const createUserWithEmailAndPassword = jest.fn((auth: any, email: string, _password: string) => {
  const mockUser = {
    uid: 'test-new-user-id',
    email,
    emailVerified: false,
    displayName: null,
    getIdToken: jest.fn(() => Promise.resolve('mock-id-token')),
    getIdTokenResult: jest.fn(() => Promise.resolve({
      token: 'mock-id-token',
      claims: {}
    }))
  }
  
  mockCurrentUser = mockUser
  
  return Promise.resolve({
    user: mockUser,
    credential: null,
    operationType: 'signIn'
  })
})

export const signOut = jest.fn((_auth: any) => {
  mockCurrentUser = null
  return Promise.resolve()
})

export const sendPasswordResetEmail = jest.fn(() => Promise.resolve())

export const updatePassword = jest.fn(() => Promise.resolve())

export const updateProfile = jest.fn(() => Promise.resolve())

export const deleteUser = jest.fn(() => Promise.resolve())

export const onAuthStateChanged = jest.fn((auth: any, callback: any) => {
  callback(mockCurrentUser)
  return jest.fn() // unsubscribe
})

export const connectAuthEmulator = jest.fn()

// Test utilities
export const __setMockCurrentUser = (user: any) => {
  mockCurrentUser = user
}

export const __clearMockCurrentUser = () => {
  mockCurrentUser = null
}

export default {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  deleteUser,
  onAuthStateChanged,
  connectAuthEmulator
}