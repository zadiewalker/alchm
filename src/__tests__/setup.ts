// Jest setup file for ALCHM testing environment
import '@testing-library/jest-dom'

// Global test timeout
jest.setTimeout(10000)

// Mock console methods to reduce noise in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: componentWillMount has been renamed') ||
       args[0].includes('Firebase'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillMount has been renamed') ||
       args[0].includes('Firebase'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  writable: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock as any

// Mock fetch
global.fetch = jest.fn()

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidFirebaseTimestamp(): R
      toBeValidUUID(): R
      toHaveValidTraumaInformedResponse(): R
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidFirebaseTimestamp(received) {
    const isValid = received && 
      typeof received.toDate === 'function' &&
      received.toDate() instanceof Date
    
    return {
      message: () => `expected ${received} to be a valid Firebase Timestamp`,
      pass: isValid,
    }
  },
  
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const isValid = typeof received === 'string' && uuidRegex.test(received)
    
    return {
      message: () => `expected ${received} to be a valid UUID`,
      pass: isValid,
    }
  },
  
  toHaveValidTraumaInformedResponse(received) {
    const hasRequiredFields = received &&
      typeof received.content === 'string' &&
      received.content.length > 0 &&
      typeof received.confidence === 'number' &&
      received.confidence >= 0 &&
      received.confidence <= 1 &&
      received.metadata &&
      typeof received.metadata.requestId === 'string'
    
    return {
      message: () => `expected ${JSON.stringify(received)} to have valid trauma-informed response structure`,
      pass: hasRequiredFields,
    }
  }
})