// Firebase app mock
import { jest } from '@jest/globals'

export const initializeApp = jest.fn(() => ({
  name: 'test-app',
  options: {
    projectId: 'test-project',
    apiKey: 'test-api-key'
  }
}))

export const getApp = jest.fn(() => ({
  name: 'test-app',
  options: {
    projectId: 'test-project'
  }
}))

export const getApps = jest.fn(() => [])

export const deleteApp = jest.fn(() => Promise.resolve())

export default {
  initializeApp,
  getApp,
  getApps,
  deleteApp
}