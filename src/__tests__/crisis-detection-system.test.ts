/**
 * ALCHM Crisis Detection System Tests
 * Comprehensive testing for life-safety critical crisis detection
 * 
 * CRITICAL: These tests validate the system that could save lives
 * Tests cover multilingual detection, cultural competency, and privacy preservation
 */

import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock the configuration
jest.mock('@/lib/config', () => ({
  getServerConfig: jest.fn(() => ({
    ai: {
      openaiApiKey: 'sk-test-key',
      openaiProjectId: 'test-project'
    }
  }))
}));

// Mock OpenAI
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
};

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => mockOpenAI);
});

// Import the route handlers after mocking
import { POST, GET } from '@/app/api/crisis-detection/route';

describe('Crisis Detection API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Immediate Crisis Detection', () => {
    test('detects English suicide ideation', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I want to kill myself' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('immediate');
      expect(data.resources).toBeDefined();
      expect(data.interventions).toBeDefined();
      expect(data.emergencyContacts).toBeDefined();
    });

    test('detects Spanish crisis language', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'quiero morir no puedo más' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('immediate');
      expect(data.resources).toContain(
        expect.objectContaining({
          name: expect.stringContaining('988')
        })
      );
    });

    test('detects Portuguese crisis language', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'quero me matar não aguento mais' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('immediate');
    });

    test('detects Korean crisis language', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '죽고 싶어 더 이상 못하겠어' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('immediate');
    });

    test('detects Hindi crisis language', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'मरना चाहता हूं और नहीं सह सकता' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('immediate');
    });

    test('detects German crisis language', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'ich will sterben kann nicht mehr leben' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('immediate');
    });
  });

  describe('Cultural Context Detection', () => {
    test('detects LGBTQ+ crisis context', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'My family disowned me for being gay I want to end it all' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.culturalConsiderations).toContain('lgbtq');
      expect(data.resources).toContain(
        expect.objectContaining({
          name: expect.stringContaining('Trevor')
        })
      );
    });

    test('detects immigration-related crisis', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'They want to deport my family I have nowhere to go' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.culturalConsiderations).toContain('immigrant');
    });

    test('detects economic crisis context', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'Got eviction notice cannot afford food anymore' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.culturalConsiderations).toContain('economic');
    });
  });

  describe('AI-Powered Analysis', () => {
    test('uses AI for subtle crisis detection', async () => {
      // Mock successful AI response
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              crisisDetected: true,
              severity: 'medium',
              confidence: 'high',
              indicators: ['hopelessness', 'isolation'],
              urgency: 'medium',
              culturalContext: [],
              recommendedResponse: 'supportive'
            })
          }
        }]
      });

      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'Everything feels pointless lately and I feel so alone' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('medium');
      expect(data.confidence).toBe('high');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    test('handles AI service failures with safety bias', async () => {
      // Mock AI failure
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'I feel really sad today' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true); // Fail safe - assume crisis
      expect(data.severity).toBe('high');
      expect(data.failsafe).toBe(true);
      expect(data.resources).toBeDefined();
    });
  });

  describe('Privacy and Security', () => {
    test('validates input parameters', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Missing text
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Text is required');
    });

    test('handles invalid JSON input', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });

      const response = await POST(request);
      const data = await response.json();

      // Should fail safe to crisis detected
      expect(response.status).toBe(200);
      expect(data.crisisDetected).toBe(true);
      expect(data.failsafe).toBe(true);
    });

    test('limits text input length for privacy', async () => {
      // Mock AI response
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              crisisDetected: false,
              severity: 'none',
              confidence: 'medium',
              indicators: [],
              urgency: 'none',
              culturalContext: []
            })
          }
        }]
      });

      const longText = 'This is a very long text. '.repeat(200); // Much longer than 1500 chars
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: longText })
      });

      await POST(request);

      // Check that the AI was called with truncated text
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringMatching(/^.{1,1500}$/) // Max 1500 characters
            })
          ])
        })
      );
    });

    test('does not log user content', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I want to die' })
      });

      await POST(request);

      // Check that no user content was logged
      const logCalls = consoleSpy.mock.calls;
      logCalls.forEach(call => {
        const logMessage = call.join(' ');
        expect(logMessage).not.toContain('I want to die');
      });
    });
  });

  describe('Performance Requirements', () => {
    test('responds within 3 seconds for immediate crisis', async () => {
      const start = Date.now();
      
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I want to kill myself' })
      });

      const response = await POST(request);
      const data = await response.json();
      const responseTime = Date.now() - start;

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(3000); // Less than 3 seconds
      expect(data.responseTime).toBeDefined();
    });

    test('includes response time in output', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I feel okay today' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.responseTime).toBeDefined();
      expect(typeof data.responseTime).toBe('number');
      expect(data.responseTime).toBeGreaterThan(0);
    });
  });

  describe('Resource Integration', () => {
    test('provides culturally appropriate resources for LGBTQ+ crisis', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'Family rejected me for being trans I want to end it' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.resources).toContain(
        expect.objectContaining({
          name: expect.stringMatching(/Trevor|Trans/i)
        })
      );
    });

    test('provides emergency contacts for high severity crisis', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I want to die tonight' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.emergencyContacts).toBeDefined();
      expect(data.emergencyContacts.length).toBeGreaterThan(0);
      expect(data.emergencyContacts).toContain(
        expect.objectContaining({
          number: '988',
          type: 'crisis'
        })
      );
    });

    test('provides appropriate interventions based on severity', async () => {
      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I want to kill myself right now' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.interventions).toBeDefined();
      expect(data.interventions.length).toBeGreaterThan(0);
      expect(data.interventions.some(intervention => 
        intervention.includes('care') || intervention.includes('safe')
      )).toBe(true);
    });
  });

  describe('False Positive/Negative Prevention', () => {
    test('does not trigger false positive for creative writing', async () => {
      // Mock AI response for creative content
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              crisisDetected: false,
              severity: 'none',
              confidence: 'high',
              indicators: [],
              urgency: 'none',
              culturalContext: []
            })
          }
        }]
      });

      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'Writing a story where the character dies in the end' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.crisisDetected).toBe(false);
      expect(data.severity).toBe('none');
    });

    test('maintains sensitivity for subtle crisis expressions', async () => {
      // Mock AI response for subtle crisis
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              crisisDetected: true,
              severity: 'medium',
              confidence: 'medium',
              indicators: ['hopelessness', 'worthlessness'],
              urgency: 'medium',
              culturalContext: []
            })
          }
        }]
      });

      const request = new NextRequest('http://localhost/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: 'I wonder if anyone would notice if I just disappeared' 
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.crisisDetected).toBe(true);
      expect(data.severity).toBe('medium');
    });
  });

  describe('Health Check Endpoint', () => {
    test('returns operational status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('operational');
      expect(data.service).toBe('crisis-detection');
      expect(data.version).toBe('2.0.0');
      expect(data.capabilities).toBeDefined();
      expect(data.capabilities.languages).toContain('en');
      expect(data.capabilities.privacyPreserving).toBe(true);
      expect(data.capabilities.mobileOptimized).toBe(true);
    });
  });

  describe('HTTP Method Security', () => {
    test('rejects PUT requests', async () => {
      const { PUT } = await import('@/app/api/crisis-detection/route');
      const response = await PUT();
      
      expect(response.status).toBe(405);
      const data = await response.json();
      expect(data.error).toBe('Method not allowed');
    });

    test('rejects DELETE requests', async () => {
      const { DELETE } = await import('@/app/api/crisis-detection/route');
      const response = await DELETE();
      
      expect(response.status).toBe(405);
      const data = await response.json();
      expect(data.error).toBe('Method not allowed');
    });

    test('rejects PATCH requests', async () => {
      const { PATCH } = await import('@/app/api/crisis-detection/route');
      const response = await PATCH();
      
      expect(response.status).toBe(405);
      const data = await response.json();
      expect(data.error).toBe('Method not allowed');
    });
  });
});

describe('Crisis Detection Edge Cases', () => {
  test('handles empty text input', async () => {
    const request = new NextRequest('http://localhost/api/crisis-detection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Text is required');
  });

  test('handles non-string text input', async () => {
    const request = new NextRequest('http://localhost/api/crisis-detection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 123 })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Text is required');
  });

  test('handles mixed language crisis expressions', async () => {
    const request = new NextRequest('http://localhost/api/crisis-detection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'I want to die quiero morir não aguento mais' 
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.crisisDetected).toBe(true);
    expect(data.severity).toBe('immediate');
  });
});