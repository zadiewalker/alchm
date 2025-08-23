// Global polyfills for server-side rendering compatibility
// This must be the first import to ensure browser globals are available in server environment

// Check if we're in a Node.js environment without browser globals
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  // Use globalThis as the base and create browser-like polyfills
  const g = globalThis;
  
  // Essential browser globals that may be referenced by bundled code
  g.self = g;
  g.window = g;
  g.global = g;
  
  // DOM-like objects
  g.document = {
    createElement: () => ({}),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    documentElement: { style: {} },
    head: { appendChild: () => {} },
    body: { appendChild: () => {} }
  };
  
  g.location = {
    href: '',
    origin: '',
    protocol: 'https:',
    host: '',
    hostname: '',
    port: '',
    pathname: '/',
    search: '',
    hash: ''
  };
  
  g.navigator = {
    userAgent: 'node.js',
    platform: 'node',
    language: 'en-US',
    languages: ['en-US'],
    onLine: true,
    cookieEnabled: false
  };
  
  // Storage APIs
  const mockStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  };
  
  g.localStorage = mockStorage;
  g.sessionStorage = mockStorage;
  
  // Event handling
  g.addEventListener = () => {};
  g.removeEventListener = () => {};
  g.dispatchEvent = () => true;
  
  // Encoding functions
  g.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
  g.atob = (str) => Buffer.from(str, 'base64').toString('binary');
  
  // Fetch API fallback
  if (!g.fetch) {
    g.fetch = () => Promise.reject(new Error('fetch not available in server environment'));
  }
}

// Also check the legacy global object
if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
  global.window = global;
}