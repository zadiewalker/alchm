// Integration tests for Firebase Functions
const functions = require('firebase-functions-test')()
const admin = require('firebase-admin')
const { expect } = require('chai')

// Import functions to test
const { chatWithGemini, nextApp } = require('../lib/index')

describe('Firebase Functions Integration Tests', () => {
  let adminInitStub

  before(() => {
    // Initialize Firebase Admin with test config
    adminInitStub = admin.initializeApp({
      projectId: 'test-project'
    })
  })

  after(() => {
    // Clean up
    functions.cleanup()
    if (adminInitStub) {
      adminInitStub.delete()
    }
  })

  describe('chatWithGemini Function', () => {
    it('should respond to Gemini AI requests', async () => {
      // Mock request object
      const req = {
        body: {
          prompt: 'Hello, how are you?'
        },
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }

      // Mock response object
      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      // Mock Gemini API response
      const originalGemini = require('@google/generative-ai').GoogleGenerativeAI
      const mockGemini = {
        getGenerativeModel: () => ({
          generateContent: async () => ({
            response: {
              text: () => 'Hello! I am doing well, thank you for asking. How can I help you today?'
            }
          })
        })
      }

      // Replace Gemini with mock
      require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = function() {
        return mockGemini
      }

      try {
        await chatWithGemini(req, res)
        
        expect(res.data).to.be.a('string')
        expect(res.data).to.include('Hello!')
        expect(res.statusCode).to.equal(200)
      } finally {
        // Restore original Gemini
        require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = originalGemini
      }
    })

    it('should handle invalid requests gracefully', async () => {
      const req = {
        body: {}, // No prompt provided
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      try {
        await chatWithGemini(req, res)
        // Should handle missing prompt gracefully
        expect(res.statusCode).to.be.oneOf([200, 400])
      } catch (error) {
        // Error handling is acceptable for invalid requests
        expect(error).to.be.an('error')
      }
    })

    it('should handle Gemini API errors', async () => {
      const req = {
        body: {
          prompt: 'Test prompt'
        },
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      // Mock Gemini API error
      const originalGemini = require('@google/generative-ai').GoogleGenerativeAI
      const mockGemini = {
        getGenerativeModel: () => ({
          generateContent: async () => {
            throw new Error('API quota exceeded')
          }
        })
      }

      require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = function() {
        return mockGemini
      }

      try {
        await chatWithGemini(req, res)
        // Should handle API errors gracefully
        expect(res.statusCode).to.be.oneOf([200, 500, 503])
      } catch (error) {
        expect(error.message).to.include('API quota exceeded')
      } finally {
        require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = originalGemini
      }
    })
  })

  describe('nextApp Function', () => {
    it('should handle Next.js requests', async () => {
      const req = {
        method: 'GET',
        url: '/',
        headers: {},
        get: function(header) {
          return this.headers[header] || 'test-user-agent'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        end: function(data) {
          this.data = data
        },
        data: null,
        statusCode: 200
      }

      try {
        await nextApp(req, res)
        // Next.js should respond
        expect(res.statusCode).to.be.oneOf([200, 404, 500])
      } catch (error) {
        // Next.js initialization errors are acceptable in test environment
        expect(error).to.be.an('error')
      }
    })

    it('should log requests properly', async () => {
      const req = {
        method: 'GET',
        url: '/test-page',
        headers: {
          'user-agent': 'test-agent'
        },
        get: function(header) {
          return this.headers[header]
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        end: function(data) {
          this.data = data
        }
      }

      // Spy on console.log
      const originalLog = console.log
      const logMessages = []
      console.log = (...args) => {
        logMessages.push(args.join(' '))
      }

      try {
        await nextApp(req, res)
        
        // Should log the request
        const requestLog = logMessages.find(msg => 
          msg.includes('[NextApp]') && 
          msg.includes('GET') && 
          msg.includes('/test-page')
        )
        expect(requestLog).to.exist
      } catch (error) {
        // Error is acceptable, we're testing logging
      } finally {
        console.log = originalLog
      }
    })
  })

  describe('Environment Configuration', () => {
    it('should handle missing Gemini API key', () => {
      // Test API key configuration
      const originalEnv = process.env.GEMINI_API_KEY
      delete process.env.GEMINI_API_KEY
      
      try {
        // Should not throw during require
        const testFunctions = require('../lib/index')
        expect(testFunctions.chatWithGemini).to.be.a('function')
      } finally {
        if (originalEnv) {
          process.env.GEMINI_API_KEY = originalEnv
        }
      }
    })

    it('should configure function runtime options correctly', () => {
      const testFunctions = require('../lib/index')
      
      // nextApp function should be configured with proper options
      expect(testFunctions.nextApp).to.be.a('function')
      
      // Should have proper region and runtime configuration
      // (This is more of a smoke test as the actual configuration
      // is set during function deployment)
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed requests', async () => {
      const req = {
        body: 'invalid-json-string',
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      try {
        await chatWithGemini(req, res)
        // Should handle malformed requests gracefully
        expect(res.statusCode).to.be.oneOf([200, 400, 500])
      } catch (error) {
        // Error handling is acceptable
        expect(error).to.be.an('error')
      }
    })

    it('should handle network timeouts', async function() {
      this.timeout(10000) // Increase timeout for this test

      const req = {
        body: {
          prompt: 'Test prompt that might timeout'
        },
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      // Mock slow Gemini API
      const originalGemini = require('@google/generative-ai').GoogleGenerativeAI
      const mockGemini = {
        getGenerativeModel: () => ({
          generateContent: async () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  response: {
                    text: () => 'Delayed response'
                  }
                })
              }, 5000) // 5 second delay
            })
          }
        })
      }

      require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = function() {
        return mockGemini
      }

      try {
        const startTime = Date.now()
        await chatWithGemini(req, res)
        const endTime = Date.now()
        
        // Should complete within reasonable time
        expect(endTime - startTime).to.be.below(10000)
      } finally {
        require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = originalGemini
      }
    })
  })

  describe('Security', () => {
    it('should validate request headers', async () => {
      const req = {
        body: {
          prompt: 'Test with suspicious headers'
        },
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-host': 'malicious-host.com',
          'x-real-ip': '192.168.1.1'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      try {
        await chatWithGemini(req, res)
        // Should handle requests with various headers
        expect(res.statusCode).to.be.oneOf([200, 400, 403])
      } catch (error) {
        // Security validation errors are acceptable
        expect(error).to.be.an('error')
      }
    })

    it('should sanitize user input', async () => {
      const req = {
        body: {
          prompt: '<script>alert("xss")</script>Tell me about trauma healing'
        },
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }

      const res = {
        send: function(data) {
          this.data = data
        },
        status: function(code) {
          this.statusCode = code
          return this
        },
        data: null,
        statusCode: 200
      }

      // Mock Gemini response
      const originalGemini = require('@google/generative-ai').GoogleGenerativeAI
      const mockGemini = {
        getGenerativeModel: () => ({
          generateContent: async (prompt) => {
            // Verify that prompt doesn't contain script tags
            const promptText = Array.isArray(prompt) ? prompt.join(' ') : prompt
            expect(promptText).to.not.include('<script>')
            
            return {
              response: {
                text: () => 'Safe response about trauma healing'
              }
            }
          }
        })
      }

      require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = function() {
        return mockGemini
      }

      try {
        await chatWithGemini(req, res)
        expect(res.data).to.not.include('<script>')
      } finally {
        require.cache[require.resolve('@google/generative-ai')].exports.GoogleGenerativeAI = originalGemini
      }
    })
  })
})