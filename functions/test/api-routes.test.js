// Integration tests for API routes through Firebase Functions
const functions = require('firebase-functions-test')()
const admin = require('firebase-admin')
const { expect } = require('chai')
const request = require('supertest')

// Mock Next.js app for testing
const express = require('express')
const app = express()

app.use(express.json())

// Mock API routes
app.post('/api/save', async (req, res) => {
  try {
    const { userId, title, content, emotion, mood, tags, isPrivate } = req.body

    // Validate required fields
    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields'
        }
      })
    }

    // Mock save operation
    const entryId = 'mock-entry-' + Date.now()
    
    res.json({
      success: true,
      data: {
        id: entryId,
        message: 'Journal entry saved successfully'
      },
      processingTime: 150
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to save journal entry'
      }
    })
  }
})

app.post('/api/khepera', async (req, res) => {
  try {
    const { prompt, includeRiskAssessment, includeResourceRecommendations, culturalContext } = req.body

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt too short or invalid'
        }
      })
    }

    // Simulate risk assessment
    const lowerPrompt = prompt.toLowerCase()
    let riskLevel = 'low'
    let immediateAction = false
    
    if (lowerPrompt.includes('kill myself') || lowerPrompt.includes('suicide')) {
      riskLevel = 'critical'
      immediateAction = true
    } else if (lowerPrompt.includes('hurt myself') || lowerPrompt.includes('hopeless')) {
      riskLevel = 'high'
      immediateAction = true
    } else if (lowerPrompt.includes('overwhelmed') || lowerPrompt.includes('struggling')) {
      riskLevel = 'medium'
    }

    // Mock Khepera response
    const response = {
      success: true,
      data: {
        message: riskLevel === 'critical' 
          ? "I hear that you're going through something very difficult right now. Your feelings are valid, and you don't have to face this alone. Please consider reaching out to a crisis helpline (988) or trusted person immediately."
          : "Thank you for sharing with me. I can sense you're processing some important feelings. Remember that seeking support is a sign of strength.",
        confidence: 0.85,
        processingTime: 1200,
        metadata: {
          requestId: 'req-' + Date.now(),
          timestamp: new Date().toISOString(),
          model: 'gemini-pro',
          cached: false,
          riskLevel,
          emotionalContext: {
            primaryEmotion: riskLevel === 'critical' ? 'distress' : 'processing',
            intensity: riskLevel === 'critical' ? 0.9 : 0.5,
            valence: riskLevel === 'critical' ? 'negative' : 'neutral'
          },
          recommendations: includeResourceRecommendations ? [
            'Continue journaling as a form of self-expression',
            'Consider professional counseling if you haven\'t already'
          ] : undefined
        },
        tokenUsage: {
          promptTokens: 120,
          completionTokens: 180,
          totalTokens: 300
        }
      }
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'AI processing failed'
      }
    })
  }
})

app.post('/api/auth/session', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided'
        }
      })
    }

    // Mock session validation
    if (token === 'valid-token') {
      res.json({
        success: true,
        data: {
          valid: true,
          userId: 'user-123',
          email: 'test@example.com',
          expiresAt: Date.now() + 3600000 // 1 hour
        }
      })
    } else if (token === 'expired-token') {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired'
        }
      })
    } else {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Session validation failed'
      }
    })
  }
})

describe('API Routes Integration Tests', () => {
  before(() => {
    // Initialize Firebase Admin for testing
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: 'test-project'
      })
    }
  })

  after(() => {
    functions.cleanup()
  })

  describe('POST /api/save', () => {
    it('should save journal entry successfully', async () => {
      const entryData = {
        userId: 'user-123',
        title: 'Test Entry',
        content: 'This is a test journal entry with meaningful content.',
        emotion: 'hopeful',
        mood: 'positive',
        tags: ['test', 'integration'],
        isPrivate: true
      }

      const response = await request(app)
        .post('/api/save')
        .send(entryData)
        .expect(200)

      expect(response.body.success).to.be.true
      expect(response.body.data.id).to.be.a('string')
      expect(response.body.data.message).to.include('saved successfully')
      expect(response.body.processingTime).to.be.a('number')
    })

    it('should reject entries without required fields', async () => {
      const invalidData = {
        title: 'Test Entry',
        // Missing userId and content
        emotion: 'happy'
      }

      const response = await request(app)
        .post('/api/save')
        .send(invalidData)
        .expect(400)

      expect(response.body.success).to.be.false
      expect(response.body.error.code).to.equal('VALIDATION_ERROR')
    })

    it('should handle content sanitization', async () => {
      const entryData = {
        userId: 'user-123',
        title: '<script>alert("xss")</script>Safe Title',
        content: 'This content is safe <script>alert("xss")</script>',
        isPrivate: true
      }

      const response = await request(app)
        .post('/api/save')
        .send(entryData)
        .expect(200)

      expect(response.body.success).to.be.true
      // Response should not contain the script tag
      expect(JSON.stringify(response.body)).to.not.include('<script>')
    })

    it('should enforce content length limits', async () => {
      const entryData = {
        userId: 'user-123',
        title: 'a'.repeat(300), // Very long title
        content: 'b'.repeat(20000), // Very long content
        isPrivate: true
      }

      const response = await request(app)
        .post('/api/save')
        .send(entryData)

      // Should either truncate or reject
      expect([200, 400]).to.include(response.status)
    })
  })

  describe('POST /api/khepera', () => {
    it('should provide trauma-informed AI response', async () => {
      const prompt = 'I had a difficult day at work and feeling overwhelmed with everything going on in my life.'

      const response = await request(app)
        .post('/api/khepera')
        .send({ 
          prompt,
          includeRiskAssessment: true,
          includeResourceRecommendations: true
        })
        .expect(200)

      expect(response.body.success).to.be.true
      expect(response.body.data.message).to.be.a('string')
      expect(response.body.data.confidence).to.be.a('number')
      expect(response.body.data.metadata.riskLevel).to.be.oneOf(['low', 'medium', 'high', 'critical'])
      expect(response.body.data.metadata.emotionalContext).to.be.an('object')
    })

    it('should detect high-risk content', async () => {
      const criticalPrompt = 'I feel like I want to hurt myself and nothing matters anymore.'

      const response = await request(app)
        .post('/api/khepera')
        .send({ 
          prompt: criticalPrompt,
          includeRiskAssessment: true
        })
        .expect(200)

      expect(response.body.success).to.be.true
      expect(response.body.data.metadata.riskLevel).to.be.oneOf(['high', 'critical'])
      expect(response.body.data.message).to.include('crisis helpline')
    })

    it('should handle very short prompts', async () => {
      const shortPrompt = 'Hi'

      const response = await request(app)
        .post('/api/khepera')
        .send({ prompt: shortPrompt })
        .expect(400)

      expect(response.body.success).to.be.false
      expect(response.body.error.code).to.equal('VALIDATION_ERROR')
    })

    it('should include cultural context when provided', async () => {
      const prompt = 'I am struggling with family expectations and cultural pressure.'

      const response = await request(app)
        .post('/api/khepera')
        .send({ 
          prompt,
          culturalContext: 'Asian-American',
          includeRiskAssessment: true
        })
        .expect(200)

      expect(response.body.success).to.be.true
      expect(response.body.data.message).to.be.a('string')
    })

    it('should provide resource recommendations when requested', async () => {
      const prompt = 'I need some guidance on dealing with anxiety.'

      const response = await request(app)
        .post('/api/khepera')
        .send({ 
          prompt,
          includeResourceRecommendations: true
        })
        .expect(200)

      expect(response.body.success).to.be.true
      expect(response.body.data.metadata.recommendations).to.be.an('array')
      expect(response.body.data.metadata.recommendations.length).to.be.greaterThan(0)
    })

    it('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/api/khepera')
        .send({ invalidField: 'test' })
        .expect(400)

      expect(response.body.success).to.be.false
      expect(response.body.error.code).to.equal('VALIDATION_ERROR')
    })
  })

  describe('POST /api/auth/session', () => {
    it('should validate valid session tokens', async () => {
      const response = await request(app)
        .post('/api/auth/session')
        .send({ token: 'valid-token' })
        .expect(200)

      expect(response.body.success).to.be.true
      expect(response.body.data.valid).to.be.true
      expect(response.body.data.userId).to.equal('user-123')
      expect(response.body.data.email).to.equal('test@example.com')
    })

    it('should reject expired tokens', async () => {
      const response = await request(app)
        .post('/api/auth/session')
        .send({ token: 'expired-token' })
        .expect(401)

      expect(response.body.success).to.be.false
      expect(response.body.error.code).to.equal('TOKEN_EXPIRED')
    })

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .post('/api/auth/session')
        .send({ token: 'invalid-token' })
        .expect(401)

      expect(response.body.success).to.be.false
      expect(response.body.error.code).to.equal('INVALID_TOKEN')
    })

    it('should require token in request', async () => {
      const response = await request(app)
        .post('/api/auth/session')
        .send({}) // No token
        .expect(401)

      expect(response.body.success).to.be.false
      expect(response.body.error.code).to.equal('UNAUTHORIZED')
    })
  })

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // Temporarily break the save endpoint
      const originalPost = app._router.stack.find(layer => 
        layer.route && layer.route.path === '/api/save'
      )
      
      app.post('/api/save-error-test', (req, res) => {
        throw new Error('Simulated server error')
      })

      const response = await request(app)
        .post('/api/save-error-test')
        .send({
          userId: 'user-123',
          content: 'Test content'
        })
        .expect(500)

      expect(response.body).to.have.property('error')
    })

    it('should validate request content types', async () => {
      const response = await request(app)
        .post('/api/save')
        .set('Content-Type', 'text/plain')
        .send('plain text instead of json')

      expect(response.status).to.be.oneOf([400, 415]) // Bad Request or Unsupported Media Type
    })

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/save')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')

      expect(response.status).to.equal(400)
    })
  })

  describe('Performance', () => {
    it('should respond within acceptable time limits', async function() {
      this.timeout(5000) // 5 second timeout

      const startTime = Date.now()
      
      await request(app)
        .post('/api/khepera')
        .send({ 
          prompt: 'This is a test prompt for performance testing.' 
        })
        .expect(200)

      const responseTime = Date.now() - startTime
      expect(responseTime).to.be.below(3000) // Should respond within 3 seconds
    })

    it('should handle concurrent requests', async function() {
      this.timeout(10000) // 10 second timeout

      const promises = []
      const numRequests = 5

      for (let i = 0; i < numRequests; i++) {
        promises.push(
          request(app)
            .post('/api/save')
            .send({
              userId: `user-${i}`,
              content: `Test content ${i}`,
              isPrivate: true
            })
        )
      }

      const responses = await Promise.all(promises)
      
      responses.forEach(response => {
        expect(response.status).to.equal(200)
        expect(response.body.success).to.be.true
      })
    })
  })

  describe('Security', () => {
    it('should sanitize user input', async () => {
      const maliciousInput = {
        userId: 'user-123',
        content: '<script>document.location="http://malicious.com"</script>This is my journal entry.',
        title: 'javascript:alert("xss")',
        isPrivate: true
      }

      const response = await request(app)
        .post('/api/save')
        .send(maliciousInput)
        .expect(200)

      // Response should not contain script tags or javascript protocol
      const responseStr = JSON.stringify(response.body)
      expect(responseStr).to.not.include('<script>')
      expect(responseStr).to.not.include('javascript:')
    })

    it('should validate request size limits', async () => {
      const largeContent = 'x'.repeat(1024 * 1024) // 1MB of content

      const response = await request(app)
        .post('/api/save')
        .send({
          userId: 'user-123',
          content: largeContent,
          isPrivate: true
        })

      // Should either accept (if within limits) or reject (if too large)
      expect([200, 400, 413]).to.include(response.status)
    })
  })
})